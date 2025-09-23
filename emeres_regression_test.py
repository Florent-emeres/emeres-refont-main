#!/usr/bin/env python3
"""
ÉMÉRÉS Backend Comprehensive Regression Testing Suite
Tests all APIs after frontend UI restructuring changes to ensure backend stability
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class EmeresRegressionTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.critical_failures = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
            self.critical_failures.append(f"{name}: {details}")
        
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

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    token: Optional[str] = None, expected_status: int = 200) -> tuple:
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
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
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

    def test_authentication_system(self):
        """Test authentication system with specific user credentials from review request"""
        print("\n🔐 TESTING AUTHENTICATION SYSTEM")
        
        # Test login for student@emeres.fr/StudentPass123! as specified in review
        print("\n👨‍🎓 Testing Student Authentication")
        student_login = {
            "email": "student@emeres.fr",
            "password": "StudentPass123!"
        }
        
        success, response = self.make_request('POST', 'auth/login', student_login)
        if success and isinstance(response, dict):
            self.tokens['student'] = response.get('access_token')
            self.users['student'] = response.get('user', {})
            self.log_test("Student login (student@emeres.fr)", True, "Authentication successful")
            
            # Test auth/me endpoint
            success, me_response = self.make_request('GET', 'auth/me', token=self.tokens['student'])
            if success:
                user_data = me_response
                expected_fields = ['id', 'email', 'role']
                has_required_fields = all(field in user_data for field in expected_fields)
                self.log_test("Auth/me endpoint returns proper user data", has_required_fields, 
                             f"Role: {user_data.get('role')}, Email: {user_data.get('email')}")
            else:
                self.log_test("Auth/me endpoint returns proper user data", False, str(me_response))
        else:
            self.log_test("Student login (student@emeres.fr)", False, str(response))
        
        # Test other user roles for comprehensive authentication testing
        other_users = [
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]
        
        for user_data in other_users:
            login_data = {"email": user_data["email"], "password": user_data["password"]}
            success, response = self.make_request('POST', 'auth/login', login_data)
            
            if success and isinstance(response, dict):
                self.tokens[user_data['role']] = response.get('access_token')
                self.users[user_data['role']] = response.get('user', {})
                self.log_test(f"{user_data['role'].title()} login", True, "Authentication successful")
                
                # Test auth/me for each role
                success, me_response = self.make_request('GET', 'auth/me', token=self.tokens[user_data['role']])
                self.log_test(f"Auth/me for {user_data['role']}", success, 
                             f"User data retrieved" if success else str(me_response))
            else:
                self.log_test(f"{user_data['role'].title()} login", False, str(response))

    def test_student_dashboard_apis(self):
        """Test all student dashboard-related endpoints"""
        print("\n👨‍🎓 TESTING STUDENT DASHBOARD APIs")
        
        if 'student' not in self.tokens:
            self.log_test("Student Dashboard APIs", False, "No student token available")
            return
        
        token = self.tokens['student']
        
        # Test profile endpoints
        print("\n📋 Testing Profile Endpoints")
        success, response = self.make_request('GET', 'profile/student', token=token)
        self.log_test("GET /api/profile/student", success, 
                     f"Profile data retrieved with {len(response.keys()) if success else 0} fields")
        
        # Test dashboard stats
        success, response = self.make_request('GET', 'student/dashboard/stats', token=token)
        if success:
            expected_stats = ['applications_count', 'offers_count', 'mentorship_ads_count', 'profile_completion']
            stats_present = any(stat in response for stat in expected_stats)
            self.log_test("GET /api/student/dashboard/stats", stats_present, 
                         f"Dashboard stats retrieved: {list(response.keys()) if isinstance(response, dict) else 'Invalid format'}")
        else:
            self.log_test("GET /api/student/dashboard/stats", False, str(response))
        
        # Test offers endpoint
        success, response = self.make_request('GET', 'offers', token=token)
        if success and isinstance(response, list):
            self.log_test("GET /api/offers", True, f"Retrieved {len(response)} offers")
        else:
            self.log_test("GET /api/offers", False, str(response))
        
        # Test applications endpoint
        success, response = self.make_request('GET', 'applications/my', token=token)
        if success and isinstance(response, list):
            self.log_test("GET /api/applications/my", True, f"Retrieved {len(response)} applications")
        else:
            self.log_test("GET /api/applications/my", False, str(response))
        
        # Test mentorship endpoints
        success, response = self.make_request('GET', 'student/mentorship-ads', token=token)
        if success and isinstance(response, list):
            self.log_test("GET /api/student/mentorship-ads", True, f"Retrieved {len(response)} mentorship ads")
        else:
            self.log_test("GET /api/student/mentorship-ads", False, str(response))
        
        success, response = self.make_request('GET', 'student/discover-mentors', token=token)
        self.log_test("GET /api/student/discover-mentors", success, 
                     f"Mentor discovery working" if success else str(response))
        
        # Test notifications
        success, response = self.make_request('GET', 'student/notifications', token=token)
        if success and isinstance(response, list):
            self.log_test("GET /api/student/notifications", True, f"Retrieved {len(response)} notifications")
        else:
            self.log_test("GET /api/student/notifications", False, str(response))
        
        success, response = self.make_request('GET', 'student/notifications/unread-count', token=token)
        self.log_test("GET /api/student/notifications/unread-count", success, 
                     f"Unread count: {response.get('count') if success else 'Failed'}")

    def test_credits_system_endpoints(self):
        """Test credits system endpoints as specified in review"""
        print("\n💰 TESTING CREDITS SYSTEM ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Credits System", False, "No student token available")
            return
        
        token = self.tokens['student']
        
        # Test credits balance endpoint
        success, response = self.make_request('GET', 'credits/balance', token=token)
        if success and isinstance(response, dict):
            expected_fields = ['points', 'credits', 'total_earned']
            has_balance_fields = any(field in response for field in expected_fields)
            self.log_test("GET /api/credits/balance", has_balance_fields, 
                         f"Balance: {response.get('points', 0)} points, {response.get('credits', 0)} credits")
        else:
            self.log_test("GET /api/credits/balance", False, str(response))
        
        # Test credits config endpoint
        success, response = self.make_request('GET', 'credits/config', token=token)
        if success and isinstance(response, dict):
            expected_config = ['points_per_credit', 'max_usage_percentage', 'min_order_amount']
            has_config_fields = any(field in response for field in expected_config)
            self.log_test("GET /api/credits/config", has_config_fields, 
                         f"Config retrieved with {len(response.keys())} settings")
        else:
            self.log_test("GET /api/credits/config", False, str(response))
        
        # Test credits transactions
        success, response = self.make_request('GET', 'credits/transactions', token=token)
        if success and isinstance(response, list):
            self.log_test("GET /api/credits/transactions", True, f"Retrieved {len(response)} transactions")
        else:
            self.log_test("GET /api/credits/transactions", False, str(response))
        
        # Test points awarding (simulate daily login)
        award_data = {
            "action": "daily_login",
            "context": "student_dashboard"
        }
        success, response = self.make_request('POST', 'credits/award-points', award_data, token=token)
        self.log_test("POST /api/credits/award-points", success, 
                     f"Points awarded: {response.get('points_awarded', 0) if success else 'Failed'}")
        
        # Test credits usage validation
        usage_data = {
            "amount": 5.00,
            "order_total": 20.00
        }
        success, response = self.make_request('POST', 'credits/can-use', usage_data, token=token)
        self.log_test("POST /api/credits/can-use", success, 
                     f"Usage validation: {response.get('can_use', False) if success else 'Failed'}")

    def test_premium_modules_endpoints(self):
        """Test premium modules endpoints if available"""
        print("\n⭐ TESTING PREMIUM MODULES ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Premium Modules", False, "No student token available")
            return
        
        token = self.tokens['student']
        
        # Test premium catalog
        success, response = self.make_request('GET', 'premium/catalog', token=token)
        if success and isinstance(response, dict):
            modules = response.get('modules', [])
            self.log_test("GET /api/premium/catalog", True, f"Retrieved {len(modules)} premium modules")
        else:
            self.log_test("GET /api/premium/catalog", False, str(response))
        
        # Test user subscription
        success, response = self.make_request('GET', 'premium/my-subscription', token=token)
        self.log_test("GET /api/premium/my-subscription", success, 
                     f"Subscription status retrieved" if success else str(response))
        
        # Test premium stats
        success, response = self.make_request('GET', 'premium/my-stats', token=token)
        self.log_test("GET /api/premium/my-stats", success, 
                     f"Premium stats retrieved" if success else str(response))

    def test_messaging_system_endpoints(self):
        """Test messaging system endpoints"""
        print("\n💬 TESTING MESSAGING SYSTEM ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Messaging System", False, "No student token available")
            return
        
        token = self.tokens['student']
        
        # Test threads endpoint
        success, response = self.make_request('GET', 'threads', token=token)
        if success and isinstance(response, dict):
            tabs = response.get('tabs', [])
            total_unread = response.get('total_unread', 0)
            self.log_test("GET /api/threads", True, 
                         f"Retrieved {len(tabs)} thread tabs, {total_unread} unread")
        else:
            self.log_test("GET /api/threads", False, str(response))
        
        # Test messaging inbox
        success, response = self.make_request('GET', 'messaging/inbox/student', token=token)
        self.log_test("GET /api/messaging/inbox/student", success, 
                     f"Inbox accessed" if success else str(response))
        
        # Test support thread creation
        support_data = {
            "subject": "Test Support Request",
            "message": "This is a test support message for regression testing",
            "category": "technical"
        }
        success, response = self.make_request('POST', 'messaging/threads/support/create', support_data, token=token)
        self.log_test("POST /api/messaging/threads/support/create", success, 
                     f"Support thread created: {response.get('thread_id') if success else 'Failed'}")

    def test_data_integrity(self):
        """Test data integrity - verify all endpoints return proper JSON responses"""
        print("\n🔍 TESTING DATA INTEGRITY")
        
        if 'student' not in self.tokens:
            self.log_test("Data Integrity", False, "No student token available")
            return
        
        token = self.tokens['student']
        
        # Test critical endpoints for proper JSON structure
        critical_endpoints = [
            ('GET', 'profile/student', 'Student Profile'),
            ('GET', 'offers', 'Job Offers'),
            ('GET', 'applications/my', 'Student Applications'),
            ('GET', 'student/dashboard/stats', 'Dashboard Stats'),
            ('GET', 'credits/balance', 'Credits Balance'),
            ('GET', 'threads', 'Message Threads')
        ]
        
        json_integrity_passed = 0
        total_endpoints = len(critical_endpoints)
        
        for method, endpoint, name in critical_endpoints:
            success, response = self.make_request(method, endpoint, token=token)
            
            if success:
                # Check if response is valid JSON structure
                is_valid_json = isinstance(response, (dict, list))
                
                # Check for null values in critical fields
                has_null_critical_fields = False
                if isinstance(response, dict):
                    critical_fields = ['id', 'user_id', 'email', 'role']
                    for field in critical_fields:
                        if field in response and response[field] is None:
                            has_null_critical_fields = True
                            break
                
                if is_valid_json and not has_null_critical_fields:
                    json_integrity_passed += 1
                    self.log_test(f"JSON integrity - {name}", True, "Valid JSON structure")
                else:
                    self.log_test(f"JSON integrity - {name}", False, 
                                 "Invalid JSON or null critical fields")
            else:
                self.log_test(f"JSON integrity - {name}", False, f"Endpoint failed: {str(response)}")
        
        # Overall data integrity score
        integrity_percentage = (json_integrity_passed / total_endpoints) * 100
        self.log_test("Overall Data Integrity", integrity_percentage >= 80, 
                     f"{integrity_percentage:.1f}% endpoints have proper JSON structure")

    def test_role_based_access_control(self):
        """Test that role-based access control is working properly"""
        print("\n🔒 TESTING ROLE-BASED ACCESS CONTROL")
        
        if len(self.tokens) < 2:
            self.log_test("RBAC Testing", False, "Need multiple user roles for RBAC testing")
            return
        
        # Test student trying to access company endpoints
        if 'student' in self.tokens and 'company' in self.tokens:
            student_token = self.tokens['student']
            
            # Student should not access company dashboard
            success, response = self.make_request('GET', 'company/dashboard', token=student_token, expected_status=403)
            self.log_test("Student->Company dashboard access denied", success, 
                         "Access properly denied" if success else "Access not properly restricted")
            
            # Student should not access institution analytics
            success, response = self.make_request('GET', 'institution/analytics', token=student_token, expected_status=403)
            self.log_test("Student->Institution analytics access denied", success, 
                         "Access properly denied" if success else "Access not properly restricted")
        
        # Test company trying to access student-specific endpoints
        if 'company' in self.tokens:
            company_token = self.tokens['company']
            
            # Company should not access student dashboard
            success, response = self.make_request('GET', 'student/dashboard/stats', token=company_token, expected_status=403)
            self.log_test("Company->Student dashboard access denied", success, 
                         "Access properly denied" if success else "Access not properly restricted")

    def test_performance_and_response_times(self):
        """Test API performance and response times"""
        print("\n⚡ TESTING PERFORMANCE AND RESPONSE TIMES")
        
        if 'student' not in self.tokens:
            self.log_test("Performance Testing", False, "No student token available")
            return
        
        token = self.tokens['student']
        
        # Test response times for critical endpoints
        import time
        
        performance_tests = [
            ('GET', 'auth/me', 'Authentication Check'),
            ('GET', 'profile/student', 'Profile Retrieval'),
            ('GET', 'offers', 'Offers Listing'),
            ('GET', 'credits/balance', 'Credits Balance')
        ]
        
        total_response_time = 0
        successful_tests = 0
        
        for method, endpoint, name in performance_tests:
            start_time = time.time()
            success, response = self.make_request(method, endpoint, token=token)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            total_response_time += response_time
            
            if success:
                successful_tests += 1
                performance_ok = response_time < 2000  # Less than 2 seconds
                self.log_test(f"Performance - {name}", performance_ok, 
                             f"{response_time:.1f}ms {'(Good)' if performance_ok else '(Slow)'}")
            else:
                self.log_test(f"Performance - {name}", False, f"Failed: {str(response)}")
        
        if successful_tests > 0:
            avg_response_time = total_response_time / successful_tests
            self.log_test("Average Response Time", avg_response_time < 1000, 
                         f"{avg_response_time:.1f}ms average")

    def run_comprehensive_regression_test(self):
        """Run the complete regression test suite"""
        print("🚀 STARTING ÉMÉRÉS BACKEND COMPREHENSIVE REGRESSION TESTING")
        print("=" * 80)
        print("Testing backend stability after frontend UI restructuring changes")
        print("=" * 80)
        
        # Run all test suites
        self.test_authentication_system()
        self.test_student_dashboard_apis()
        self.test_credits_system_endpoints()
        self.test_premium_modules_endpoints()
        self.test_messaging_system_endpoints()
        self.test_data_integrity()
        self.test_role_based_access_control()
        self.test_performance_and_response_times()
        
        # Generate final report
        self.generate_final_report()

    def generate_final_report(self):
        """Generate comprehensive test report"""
        print("\n" + "=" * 80)
        print("📊 ÉMÉRÉS BACKEND REGRESSION TEST REPORT")
        print("=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        
        print(f"📈 OVERALL RESULTS:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 95:
            print("🎉 EXCELLENT: Backend is highly stable after frontend changes")
        elif success_rate >= 85:
            print("✅ GOOD: Backend is stable with minor issues")
        elif success_rate >= 70:
            print("⚠️  MODERATE: Backend has some issues that need attention")
        else:
            print("❌ CRITICAL: Backend has significant issues requiring immediate attention")
        
        # Critical failures summary
        if self.critical_failures:
            print(f"\n🚨 CRITICAL FAILURES ({len(self.critical_failures)}):")
            for i, failure in enumerate(self.critical_failures[:10], 1):  # Show top 10
                print(f"   {i}. {failure}")
            if len(self.critical_failures) > 10:
                print(f"   ... and {len(self.critical_failures) - 10} more")
        else:
            print("\n✅ NO CRITICAL FAILURES DETECTED")
        
        # Test categories summary
        categories = {
            'Authentication': [r for r in self.test_results if 'login' in r['name'].lower() or 'auth' in r['name'].lower()],
            'Student Dashboard': [r for r in self.test_results if 'student' in r['name'].lower() and 'dashboard' in r['name'].lower()],
            'Credits System': [r for r in self.test_results if 'credits' in r['name'].lower()],
            'Data Integrity': [r for r in self.test_results if 'integrity' in r['name'].lower() or 'json' in r['name'].lower()],
            'Performance': [r for r in self.test_results if 'performance' in r['name'].lower()],
            'Security': [r for r in self.test_results if 'access' in r['name'].lower() or 'denied' in r['name'].lower()]
        }
        
        print(f"\n📋 CATEGORY BREAKDOWN:")
        for category, tests in categories.items():
            if tests:
                passed = sum(1 for t in tests if t['success'])
                total = len(tests)
                rate = (passed / total) * 100 if total > 0 else 0
                status = "✅" if rate >= 90 else "⚠️" if rate >= 70 else "❌"
                print(f"   {status} {category}: {passed}/{total} ({rate:.1f}%)")
        
        print("\n" + "=" * 80)
        print("🏁 REGRESSION TESTING COMPLETE")
        print("=" * 80)
        
        return success_rate >= 85  # Return True if backend is stable

if __name__ == "__main__":
    tester = EmeresRegressionTester()
    
    try:
        stable = tester.run_comprehensive_regression_test()
        sys.exit(0 if stable else 1)
    except KeyboardInterrupt:
        print("\n⏹️  Testing interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Testing failed with error: {str(e)}")
        sys.exit(1)