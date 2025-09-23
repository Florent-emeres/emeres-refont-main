#!/usr/bin/env python3
"""
ÉMÉRÉS Credits System Backend Regression Test
Tests backend functionality after frontend corrections to ensure no breaking changes
Focus: Authentication, Core APIs, Credits-related endpoints
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class EmeresCreditsRegressionTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Standard test accounts from review request
        self.test_accounts = {
            "student": {"email": "student@emeres.fr", "password": "StudentPass123!"},
            "mentor": {"email": "mentor@emeres.fr", "password": "MentorPass123!"},
            "company": {"email": "company@emeres.fr", "password": "CompanyPass123!"},
            "institution": {"email": "institution@emeres.fr", "password": "InstitutionPass123!"}
        }

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

    def test_authentication_all_roles(self):
        """Test authentication for all user roles - Priority 1"""
        print("\n🔐 TESTING AUTHENTICATION FOR ALL USER ROLES")
        print("   Verifying no breaking changes to authentication system after frontend corrections")
        
        for role, credentials in self.test_accounts.items():
            print(f"\n🔑 Testing {role.upper()} authentication")
            
            # Test login
            success, response = self.make_request('POST', 'auth/login', credentials)
            
            if success and isinstance(response, dict):
                self.tokens[role] = response.get('access_token')
                self.users[role] = response.get('user', {})
                
                # Verify token and user data
                user_role = self.users[role].get('role')
                has_token = bool(self.tokens[role])
                
                self.log_test(f"{role.capitalize()} login", has_token and user_role == role,
                             f"Token: {'✓' if has_token else '✗'}, Role: {user_role}")
                
                # Test auth/me endpoint
                if has_token:
                    success_me, me_response = self.make_request('GET', 'auth/me', token=self.tokens[role])
                    if success_me and isinstance(me_response, dict):
                        me_role = me_response.get('role')
                        self.log_test(f"{role.capitalize()} auth/me", me_role == role,
                                     f"Verified role: {me_role}")
                    else:
                        self.log_test(f"{role.capitalize()} auth/me", False, str(me_response))
            else:
                self.log_test(f"{role.capitalize()} login", False, str(response))

    def test_core_profile_endpoints(self):
        """Test core profile endpoints - Priority 2"""
        print("\n👤 TESTING CORE PROFILE ENDPOINTS")
        print("   Verifying profile access remains functional after frontend changes")
        
        profile_endpoints = {
            "student": "profile/student",
            "mentor": "profile/mentor", 
            "company": "profile/company",
            "institution": "profile/institution"
        }
        
        for role, endpoint in profile_endpoints.items():
            if role in self.tokens:
                print(f"\n📋 Testing {role} profile endpoint")
                
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    # Check for essential profile fields
                    has_id = 'id' in response
                    has_user_id = 'user_id' in response
                    
                    self.log_test(f"GET {endpoint}", has_id and has_user_id,
                                 f"Profile data retrieved - Fields: {len(response.keys())}")
                    
                    # Test profile update capability
                    if has_id and has_user_id:
                        update_data = response.copy()
                        update_data['updated_at'] = datetime.now().isoformat()
                        
                        success_update, update_response = self.make_request('PUT', endpoint, 
                                                                          update_data, token=self.tokens[role])
                        self.log_test(f"PUT {endpoint}", success_update,
                                     "Profile update successful" if success_update else str(update_response))
                else:
                    self.log_test(f"GET {endpoint}", False, str(response))
            else:
                self.log_test(f"{role.capitalize()} profile test", False, "No authentication token available")

    def test_core_offers_endpoints(self):
        """Test offers endpoints - Priority 3"""
        print("\n💼 TESTING CORE OFFERS ENDPOINTS")
        print("   Verifying job offers functionality remains intact")
        
        # Test public offers endpoint
        success, response = self.make_request('GET', 'offers')
        if success and isinstance(response, list):
            offers_count = len(response)
            self.log_test("GET /api/offers (public)", True, f"Retrieved {offers_count} offers")
            
            # Store first offer for application testing
            if offers_count > 0:
                self.sample_offer_id = response[0].get('id')
        else:
            self.log_test("GET /api/offers (public)", False, str(response))
        
        # Test company offers endpoint
        if 'company' in self.tokens:
            success, response = self.make_request('GET', 'offers/my', token=self.tokens['company'])
            if success and isinstance(response, list):
                company_offers = len(response)
                self.log_test("GET /api/offers/my (company)", True, f"Company has {company_offers} offers")
            else:
                self.log_test("GET /api/offers/my (company)", False, str(response))

    def test_core_applications_endpoints(self):
        """Test applications endpoints - Priority 4"""
        print("\n📝 TESTING CORE APPLICATIONS ENDPOINTS")
        print("   Verifying applications system functionality")
        
        # Test student applications
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'applications/my', token=self.tokens['student'])
            if success and isinstance(response, list):
                student_apps = len(response)
                self.log_test("GET /api/applications/my (student)", True, f"Student has {student_apps} applications")
            else:
                self.log_test("GET /api/applications/my (student)", False, str(response))
        
        # Test company applications
        if 'company' in self.tokens:
            success, response = self.make_request('GET', 'applications/company', token=self.tokens['company'])
            if success and isinstance(response, list):
                company_apps = len(response)
                self.log_test("GET /api/applications/company", True, f"Company received {company_apps} applications")
            else:
                self.log_test("GET /api/applications/company", False, str(response))

    def test_dashboard_endpoints(self):
        """Test dashboard endpoints - Priority 5"""
        print("\n📊 TESTING DASHBOARD ENDPOINTS")
        print("   Verifying dashboard data endpoints remain functional")
        
        dashboard_endpoints = {
            "student": "student/dashboard/stats",
            "mentor": "mentor/dashboard", 
            "company": "company/dashboard",
            "institution": "institution/dashboard"
        }
        
        for role, endpoint in dashboard_endpoints.items():
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    fields_count = len(response.keys())
                    self.log_test(f"GET /api/{endpoint}", True, f"Dashboard data: {fields_count} fields")
                else:
                    self.log_test(f"GET /api/{endpoint}", False, str(response))

    def test_messaging_endpoints(self):
        """Test messaging system endpoints - Priority 6"""
        print("\n💬 TESTING MESSAGING SYSTEM ENDPOINTS")
        print("   Verifying messaging functionality after frontend changes")
        
        # Test threads endpoint for different roles
        for role in ['student', 'mentor']:
            if role in self.tokens:
                success, response = self.make_request('GET', 'threads', token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    tabs = response.get('tabs', [])
                    total_unread = response.get('total_unread', 0)
                    self.log_test(f"GET /api/threads ({role})", True, 
                                 f"Tabs: {len(tabs)}, Unread: {total_unread}")
                else:
                    self.log_test(f"GET /api/threads ({role})", False, str(response))

    def test_credits_related_endpoints(self):
        """Test any credits-related endpoints - Priority 7"""
        print("\n🏆 TESTING CREDITS-RELATED ENDPOINTS")
        print("   Searching for credits system endpoints that may have been affected")
        
        # Test potential credits endpoints
        credits_endpoints = [
            'student/credits',
            'student/rewards', 
            'student/achievements',
            'credits/balance',
            'credits/history',
            'rewards/available',
            'achievements/list'
        ]
        
        if 'student' in self.tokens:
            for endpoint in credits_endpoints:
                success, response = self.make_request('GET', endpoint, token=self.tokens['student'])
                
                if success:
                    if isinstance(response, dict):
                        fields = len(response.keys())
                        self.log_test(f"Credits endpoint: {endpoint}", True, f"Found data: {fields} fields")
                    elif isinstance(response, list):
                        items = len(response)
                        self.log_test(f"Credits endpoint: {endpoint}", True, f"Found data: {items} items")
                    else:
                        self.log_test(f"Credits endpoint: {endpoint}", True, "Endpoint exists")
                else:
                    # 404 is expected for non-existent endpoints
                    if "404" in str(response):
                        continue  # Skip logging 404s as they're expected
                    else:
                        self.log_test(f"Credits endpoint: {endpoint}", False, str(response))

    def test_role_based_access_control(self):
        """Test RBAC remains intact - Priority 8"""
        print("\n🔒 TESTING ROLE-BASED ACCESS CONTROL")
        print("   Verifying security boundaries remain intact after frontend changes")
        
        # Test cross-role access restrictions
        test_cases = [
            ("student", "company/dashboard", 403),
            ("company", "student/dashboard/stats", 403),
            ("mentor", "institution/dashboard", 403),
            ("institution", "mentor/dashboard", 403)
        ]
        
        for user_role, endpoint, expected_status in test_cases:
            if user_role in self.tokens:
                success, response = self.make_request('GET', endpoint, 
                                                    token=self.tokens[user_role], 
                                                    expected_status=expected_status)
                self.log_test(f"RBAC: {user_role} -> {endpoint}", success,
                             f"Access properly denied ({expected_status})" if success else "Access not properly restricted")

    def test_performance_regression(self):
        """Test performance hasn't regressed - Priority 9"""
        print("\n⚡ TESTING PERFORMANCE REGRESSION")
        print("   Verifying response times remain acceptable after frontend changes")
        
        import time
        
        performance_tests = [
            ("auth/login", self.test_accounts["student"]),
            ("offers", None),
            ("profile/student", self.tokens.get("student"))
        ]
        
        for endpoint, data_or_token in performance_tests:
            start_time = time.time()
            
            if endpoint == "auth/login":
                success, response = self.make_request('POST', endpoint, data_or_token)
            elif data_or_token:  # Token provided
                success, response = self.make_request('GET', endpoint, token=data_or_token)
            else:  # Public endpoint
                success, response = self.make_request('GET', endpoint)
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            # Consider under 2000ms as acceptable
            is_fast_enough = response_time < 2000
            
            self.log_test(f"Performance: {endpoint}", is_fast_enough and success,
                         f"{response_time:.1f}ms {'(Good)' if is_fast_enough else '(Slow)'}")

    def test_data_integrity(self):
        """Test data integrity after frontend changes - Priority 10"""
        print("\n🔍 TESTING DATA INTEGRITY")
        print("   Verifying data structures remain consistent")
        
        # Test student profile data integrity
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'profile/student', token=self.tokens['student'])
            
            if success and isinstance(response, dict):
                # Check for required fields
                required_fields = ['id', 'user_id', 'first_name', 'last_name']
                has_required = all(field in response for field in required_fields)
                
                # Check for data types
                valid_types = True
                if 'created_at' in response:
                    try:
                        datetime.fromisoformat(response['created_at'].replace('Z', '+00:00'))
                    except:
                        valid_types = False
                
                self.log_test("Student profile data integrity", has_required and valid_types,
                             f"Required fields: {'✓' if has_required else '✗'}, Valid types: {'✓' if valid_types else '✗'}")

    def run_all_tests(self):
        """Run all regression tests"""
        print("🚀 ÉMÉRÉS CREDITS SYSTEM BACKEND REGRESSION TEST")
        print("=" * 60)
        print("Testing backend functionality after frontend corrections")
        print("Focus: Authentication, Core APIs, Credits-related endpoints")
        print("=" * 60)
        
        try:
            # Priority 1: Authentication (Critical)
            self.test_authentication_all_roles()
            
            # Priority 2: Core Profile Endpoints
            self.test_core_profile_endpoints()
            
            # Priority 3: Offers System
            self.test_core_offers_endpoints()
            
            # Priority 4: Applications System  
            self.test_core_applications_endpoints()
            
            # Priority 5: Dashboard Endpoints
            self.test_dashboard_endpoints()
            
            # Priority 6: Messaging System
            self.test_messaging_endpoints()
            
            # Priority 7: Credits-Related Endpoints
            self.test_credits_related_endpoints()
            
            # Priority 8: Security (RBAC)
            self.test_role_based_access_control()
            
            # Priority 9: Performance
            self.test_performance_regression()
            
            # Priority 10: Data Integrity
            self.test_data_integrity()
            
        except Exception as e:
            print(f"\n❌ CRITICAL ERROR: {str(e)}")
            self.log_test("Test execution", False, f"Critical error: {str(e)}")
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 REGRESSION TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        critical_failures = []
        minor_issues = []
        
        for result in self.test_results:
            if not result['success']:
                if any(keyword in result['name'].lower() for keyword in ['auth', 'login', 'profile', 'critical']):
                    critical_failures.append(result)
                else:
                    minor_issues.append(result)
        
        if critical_failures:
            print(f"\n🚨 CRITICAL FAILURES ({len(critical_failures)}):")
            for failure in critical_failures:
                print(f"  ❌ {failure['name']}: {failure['details']}")
        
        if minor_issues:
            print(f"\n⚠️  MINOR ISSUES ({len(minor_issues)}):")
            for issue in minor_issues:
                print(f"  ⚠️  {issue['name']}: {issue['details']}")
        
        if success_rate >= 95:
            print(f"\n✅ REGRESSION TEST RESULT: EXCELLENT ({success_rate:.1f}%)")
            print("   Backend functionality remains stable after frontend corrections")
        elif success_rate >= 85:
            print(f"\n⚠️  REGRESSION TEST RESULT: GOOD ({success_rate:.1f}%)")
            print("   Minor issues detected but core functionality intact")
        else:
            print(f"\n❌ REGRESSION TEST RESULT: ISSUES DETECTED ({success_rate:.1f}%)")
            print("   Significant regressions found - investigation required")
        
        return success_rate >= 85

if __name__ == "__main__":
    tester = EmeresCreditsRegressionTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)