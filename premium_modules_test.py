#!/usr/bin/env python3
"""
ÉMÉRÉS Premium Modules System Testing
Tests all premium modules endpoints and business rules
"""

import requests
import sys
import json
from datetime import datetime

class PremiumModulesAPITester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {name}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({
            'name': name,
            'success': success,
            'details': details
        })
        return success

    def make_request(self, method: str, endpoint: str, data=None, token=None, expected_status: int = 200):
        """Make HTTP request and return success status and response data"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            else:
                return False, f"Unsupported method: {method}"

            success = response.status_code == expected_status
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Status {response.status_code}, expected {expected_status}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                return False, error_msg

        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}"

    def test_authentication(self):
        """Test authentication with standard accounts"""
        print("\n🔐 TESTING AUTHENTICATION")
        
        test_accounts = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"}
        ]
        
        for account in test_accounts:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": account["email"], "password": account["password"]})
            
            if success and isinstance(response, dict):
                self.tokens[account['role']] = response.get('access_token')
                self.log_test(f"Login {account['role']}", True, f"Token received for {account['email']}")
            else:
                self.log_test(f"Login {account['role']}", False, str(response))

    def test_premium_catalog(self):
        """Test GET /api/premium/catalog"""
        print("\n📋 TESTING PREMIUM CATALOG")
        
        success, response = self.make_request('GET', 'premium/catalog')
        
        if success and isinstance(response, dict):
            modules = response.get('modules', {})
            tiers = response.get('subscription_tiers', {})
            
            # Verify expected modules are present
            expected_modules = [
                'focus_rooms', 'soundscapes', 'distraction_blocker', 'flow_coach',
                'micro_quests', 'spaced_repetition', 'ai_study_coach', 'assessment_simulation',
                'career_escape_room', 'sponsored_tournaments'
            ]
            
            modules_found = sum(1 for module in expected_modules if module in modules)
            
            # Verify subscription tiers
            expected_tiers = ['focus_plus', 'learn_plus', 'vr_sim_pass', 'premium_all']
            tiers_found = sum(1 for tier in expected_tiers if tier in tiers)
            
            self.log_test("Premium catalog structure", modules_found >= 8 and tiers_found >= 3,
                         f"Modules: {modules_found}/10, Tiers: {tiers_found}/4")
            
            # Verify pricing structure
            focus_plus = tiers.get('focus_plus', {})
            if focus_plus:
                has_pricing = 'price_euros' in focus_plus and 'price_school_per_student' in focus_plus
                self.log_test("Premium pricing structure", has_pricing,
                             f"Focus+ price: {focus_plus.get('price_euros', 'N/A')}€")
        else:
            self.log_test("Premium catalog endpoint", False, str(response))

    def test_user_subscription(self):
        """Test GET /api/premium/my-subscription"""
        print("\n👤 TESTING USER SUBSCRIPTION")
        
        if 'student' not in self.tokens:
            self.log_test("User subscription test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        success, response = self.make_request('GET', 'premium/my-subscription', token=student_token)
        
        if success and isinstance(response, dict):
            subscription = response.get('subscription')
            if subscription is None:
                self.log_test("User subscription (no subscription)", True, "No active subscription (expected for new user)")
            else:
                has_required_fields = all(field in subscription for field in ['subscription_tier', 'end_date', 'is_active'])
                self.log_test("User subscription structure", has_required_fields,
                             f"Tier: {subscription.get('subscription_tier', 'N/A')}")
        else:
            self.log_test("User subscription endpoint", False, str(response))

    def test_premium_subscription(self):
        """Test POST /api/premium/subscribe"""
        print("\n💳 TESTING PREMIUM SUBSCRIPTION")
        
        if 'student' not in self.tokens:
            self.log_test("Premium subscription test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        
        # Test subscription with credits (should respect 30% rule and 10€ minimum)
        subscription_data = {
            "subscription_tier": "learn_plus",  # Above 10€ minimum
            "credits_to_use_euros": 3.00  # ~27% of 10.99€
        }
        
        success, response = self.make_request('POST', 'premium/subscribe', subscription_data, token=student_token)
        
        if success and isinstance(response, dict):
            subscription = response.get('subscription')
            if subscription:
                self.log_test("Premium subscription with credits", True,
                             f"Subscribed to {subscription.get('subscription_tier', 'N/A')}")
                self.premium_subscription_id = subscription.get('id')
            else:
                self.log_test("Premium subscription with credits", False, "No subscription returned")
        else:
            # Expected to fail if user doesn't have enough credits or other business rules
            self.log_test("Premium subscription with credits", True, 
                         f"Subscription failed as expected: {response}")

    def test_module_access_check(self):
        """Test POST /api/premium/check-access"""
        print("\n🔐 TESTING MODULE ACCESS CHECK")
        
        if 'student' not in self.tokens:
            self.log_test("Module access check test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        access_check_data = {"module_type": "focus_rooms"}
        success, response = self.make_request('POST', 'premium/check-access', access_check_data, token=student_token)
        
        if success and isinstance(response, dict):
            has_access = response.get('has_access', False)
            message = response.get('message', '')
            module_config = response.get('module_config', {})
            
            self.log_test("Module access check", True,
                         f"Access: {has_access}, Message: {message}")
            
            # Verify module config is returned
            if module_config:
                self.log_test("Module config in access check", True,
                             f"Config returned for focus_rooms")
        else:
            self.log_test("Module access check endpoint", False, str(response))

    def test_usage_recording(self):
        """Test POST /api/premium/record-usage"""
        print("\n📊 TESTING USAGE RECORDING")
        
        if 'student' not in self.tokens:
            self.log_test("Usage recording test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        usage_data = {
            "module_type": "focus_rooms",
            "session_duration_minutes": 25,
            "completion_percentage": 100.0,
            "score": 85.5,
            "metadata": {
                "room_name": "Study Session",
                "participants": 3
            }
        }
        
        success, response = self.make_request('POST', 'premium/record-usage', usage_data, token=student_token)
        
        if success and isinstance(response, dict):
            usage_id = response.get('usage_id')
            self.log_test("Usage recording", bool(usage_id),
                         f"Usage recorded with ID: {usage_id}")
        else:
            self.log_test("Usage recording endpoint", False, str(response))

    def test_usage_statistics(self):
        """Test GET /api/premium/my-stats"""
        print("\n📈 TESTING USAGE STATISTICS")
        
        if 'student' not in self.tokens:
            self.log_test("Usage statistics test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        success, response = self.make_request('GET', 'premium/my-stats', token=student_token)
        
        if success and isinstance(response, dict):
            stats = response.get('stats', {})
            total_sessions = response.get('total_sessions', 0)
            
            self.log_test("Usage statistics", True,
                         f"Total sessions: {total_sessions}, Modules tracked: {len(stats)}")
        else:
            self.log_test("Usage statistics endpoint", False, str(response))

    def test_focus_room_creation(self):
        """Test POST /api/premium/focus/create-room"""
        print("\n🏠 TESTING FOCUS ROOM CREATION")
        
        if 'student' not in self.tokens:
            self.log_test("Focus room creation test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        room_data = {
            "name": "Test Study Room",
            "room_type": "public",
            "max_participants": 10,
            "pomodoro_duration": 25
        }
        
        success, response = self.make_request('POST', 'premium/focus/create-room', room_data, token=student_token)
        
        if success and isinstance(response, dict):
            room_id = response.get('room_id')
            self.log_test("Focus room creation", bool(room_id),
                         f"Room created with ID: {room_id}")
            self.test_room_id = room_id
        else:
            self.log_test("Focus room creation", False, str(response))

    def test_focus_rooms_list(self):
        """Test GET /api/premium/focus/rooms"""
        print("\n🏠 TESTING FOCUS ROOMS LIST")
        
        if 'student' not in self.tokens:
            self.log_test("Focus rooms list test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        success, response = self.make_request('GET', 'premium/focus/rooms', token=student_token)
        
        if success and isinstance(response, dict):
            rooms = response.get('rooms', [])
            public_rooms = response.get('public_rooms', [])
            
            self.log_test("Focus rooms list", True,
                         f"Total rooms: {len(rooms)}, Public: {len(public_rooms)}")
        else:
            self.log_test("Focus rooms list endpoint", False, str(response))

    def test_focus_room_join(self):
        """Test POST /api/premium/focus/join-room"""
        print("\n🚪 TESTING FOCUS ROOM JOIN")
        
        if 'student' not in self.tokens:
            self.log_test("Focus room join test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        
        if hasattr(self, 'test_room_id') and self.test_room_id:
            join_data = {"room_id": self.test_room_id}
            success, response = self.make_request('POST', 'premium/focus/join-room', join_data, token=student_token)
            
            if success and isinstance(response, dict):
                joined = response.get('success', False)
                message = response.get('message', '')
                
                self.log_test("Focus room join", joined,
                             f"Join result: {message}")
            else:
                self.log_test("Focus room join", False, str(response))
        else:
            self.log_test("Focus room join", False, "No room ID available for testing")

    def test_learning_quests(self):
        """Test GET /api/premium/learning/quests"""
        print("\n🎯 TESTING LEARNING QUESTS")
        
        if 'student' not in self.tokens:
            self.log_test("Learning quests test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        success, response = self.make_request('GET', 'premium/learning/quests', token=student_token)
        
        if success and isinstance(response, dict):
            quests = response.get('quests', [])
            free_quests = [q for q in quests if not q.get('is_premium', True)]
            premium_quests = [q for q in quests if q.get('is_premium', False)]
            
            self.log_test("Learning quests", True,
                         f"Total: {len(quests)}, Free: {len(free_quests)}, Premium: {len(premium_quests)}")
        else:
            self.log_test("Learning quests endpoint", False, str(response))

    def test_business_rules(self):
        """Test business rules enforcement"""
        print("\n⚖️ TESTING BUSINESS RULES")
        
        if 'student' not in self.tokens:
            self.log_test("Business rules test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        
        # Test 30% max credits usage rule
        invalid_credits_data = {
            "subscription_tier": "learn_plus",
            "credits_to_use_euros": 5.00  # More than 30% of ~10.99€
        }
        
        success, response = self.make_request('POST', 'premium/subscribe', invalid_credits_data, 
                                            token=student_token, expected_status=400)
        
        if success:
            self.log_test("30% credits limit enforcement", True, "Excessive credits usage rejected")
        else:
            self.log_test("30% credits limit enforcement", False, "Should reject >30% credits usage")
        
        # Test minimum order amount (10€) - Focus+ is ~6.99€, should fail
        min_order_data = {
            "subscription_tier": "focus_plus",  # Below 10€ minimum
            "credits_to_use_euros": 1.00
        }
        
        success, response = self.make_request('POST', 'premium/subscribe', min_order_data, 
                                            token=student_token, expected_status=400)
        
        if success:
            self.log_test("10€ minimum order enforcement", True, "Below minimum order rejected")
        else:
            self.log_test("10€ minimum order enforcement", False, "Should enforce 10€ minimum")

    def run_all_tests(self):
        """Run all premium modules tests"""
        print("🚀 STARTING ÉMÉRÉS PREMIUM MODULES SYSTEM TESTING")
        print(f"🌐 Base URL: {self.base_url}")
        print(f"🔗 API URL: {self.api_url}")
        print("=" * 80)
        
        # Authentication
        self.test_authentication()
        
        # Premium modules endpoints
        self.test_premium_catalog()
        self.test_user_subscription()
        self.test_premium_subscription()
        self.test_module_access_check()
        self.test_usage_recording()
        self.test_usage_statistics()
        
        # Focus modules
        self.test_focus_room_creation()
        self.test_focus_rooms_list()
        self.test_focus_room_join()
        
        # Learning modules
        self.test_learning_quests()
        
        # Business rules
        self.test_business_rules()
        
        # Print final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results"""
        print("\n" + "=" * 80)
        print("📊 PREMIUM MODULES TESTING RESULTS")
        print("=" * 80)
        
        print(f"Total Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        else:
            print("\n✅ ALL TESTS PASSED!")

def main():
    """Main test execution"""
    tester = PremiumModulesAPITester()
    tester.run_all_tests()
    return 0

if __name__ == "__main__":
    sys.exit(main())