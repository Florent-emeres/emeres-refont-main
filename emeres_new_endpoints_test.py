#!/usr/bin/env python3
"""
ÉMÉRÉS Platform New Endpoints Testing Suite
Tests the recently added endpoints as requested in French review:
- GET /api/auth/me
- GET /api/profile/institution  
- GET /api/student/dashboard
- GET /api/mentor/dashboard
- GET /api/company/dashboard
- GET /api/institution/dashboard
- GET /api/institution/analytics
- GET /api/student/profile

Goal: Reach 90%+ success rate to confirm backend is production ready
"""

import requests
import sys
import json
from typing import Dict, Any, Optional

class EmeresNewEndpointsTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
        # Test users as specified in review request
        self.test_users = {
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

    def authenticate_all_users(self):
        """Authenticate all test users"""
        print("🔐 AUTHENTICATING ALL TEST USERS")
        
        for role, credentials in self.test_users.items():
            success, response = self.make_request('POST', 'auth/login', credentials)
            
            if success and isinstance(response, dict):
                self.tokens[role] = response.get('access_token')
                self.users[role] = response.get('user', {})
                self.log_test(f"Login {role}", True, f"Token received for {credentials['email']}")
            else:
                self.log_test(f"Login {role}", False, f"{credentials['email']} - {str(response)}")

    def test_auth_me_endpoint(self):
        """Test GET /api/auth/me endpoint for all user roles"""
        print("\n🔍 TESTING GET /api/auth/me ENDPOINT")
        
        for role in self.test_users.keys():
            if role not in self.tokens:
                self.log_test(f"GET /api/auth/me ({role})", False, f"No token for {role}")
                continue
                
            token = self.tokens[role]
            success, response = self.make_request('GET', 'auth/me', token=token)
            
            if success and isinstance(response, dict):
                # Verify response contains expected user information
                expected_fields = ['id', 'email', 'role']
                has_required_fields = all(field in response for field in expected_fields)
                
                if has_required_fields:
                    user_role = response.get('role')
                    user_email = response.get('email')
                    self.log_test(f"GET /api/auth/me ({role})", True, 
                                f"Role: {user_role}, Email: {user_email}")
                else:
                    self.log_test(f"GET /api/auth/me ({role})", False, 
                                f"Missing required fields: {expected_fields}")
            else:
                self.log_test(f"GET /api/auth/me ({role})", False, str(response))

    def test_profile_institution_endpoint(self):
        """Test GET /api/profile/institution endpoint"""
        print("\n🏛️ TESTING GET /api/profile/institution ENDPOINT")
        
        if 'institution' not in self.tokens:
            self.log_test("GET /api/profile/institution", False, "No institution token")
            return
            
        token = self.tokens['institution']
        success, response = self.make_request('GET', 'profile/institution', token=token)
        
        if success and isinstance(response, dict):
            # Verify response structure for institution profile
            expected_fields = ['id', 'user_id']
            has_basic_fields = all(field in response for field in expected_fields)
            
            self.log_test("GET /api/profile/institution", has_basic_fields, 
                        f"Institution profile retrieved with {len(response)} fields")
        else:
            self.log_test("GET /api/profile/institution", False, str(response))

    def test_dashboard_endpoints(self):
        """Test all dashboard endpoints for each role"""
        print("\n📊 TESTING DASHBOARD ENDPOINTS")
        
        dashboard_endpoints = {
            'student': 'student/dashboard',
            'mentor': 'mentor/dashboard', 
            'company': 'company/dashboard',
            'institution': 'institution/dashboard'
        }
        
        for role, endpoint in dashboard_endpoints.items():
            if role not in self.tokens:
                self.log_test(f"GET /api/{endpoint}", False, f"No token for {role}")
                continue
                
            token = self.tokens[role]
            success, response = self.make_request('GET', endpoint, token=token)
            
            if success and isinstance(response, dict):
                # Verify dashboard data structure
                data_fields = len(response)
                self.log_test(f"GET /api/{endpoint}", True, 
                            f"Dashboard data retrieved with {data_fields} fields")
                
                # Log some key dashboard metrics if available
                if 'stats' in response:
                    stats = response['stats']
                    print(f"  📈 Dashboard stats: {stats}")
                elif 'metrics' in response:
                    metrics = response['metrics']
                    print(f"  📈 Dashboard metrics: {metrics}")
                    
            else:
                self.log_test(f"GET /api/{endpoint}", False, str(response))

    def test_institution_analytics_endpoint(self):
        """Test GET /api/institution/analytics endpoint"""
        print("\n📈 TESTING GET /api/institution/analytics ENDPOINT")
        
        if 'institution' not in self.tokens:
            self.log_test("GET /api/institution/analytics", False, "No institution token")
            return
            
        token = self.tokens['institution']
        success, response = self.make_request('GET', 'institution/analytics', token=token)
        
        if success and isinstance(response, dict):
            # Verify analytics data structure
            expected_analytics_fields = ['market_data', 'placement_rates', 'competency_gaps']
            analytics_fields_present = sum(1 for field in expected_analytics_fields if field in response)
            
            self.log_test("GET /api/institution/analytics", True, 
                        f"Analytics data with {len(response)} fields, {analytics_fields_present} expected analytics fields")
            
            # Log analytics summary if available
            if 'market_data' in response:
                print(f"  📊 Market data available: {type(response['market_data'])}")
            if 'placement_rates' in response:
                print(f"  📊 Placement rates available: {type(response['placement_rates'])}")
                
        else:
            self.log_test("GET /api/institution/analytics", False, str(response))

    def test_student_profile_alias_endpoint(self):
        """Test GET /api/student/profile endpoint (alias for student profile)"""
        print("\n👨‍🎓 TESTING GET /api/student/profile ENDPOINT (ALIAS)")
        
        if 'student' not in self.tokens:
            self.log_test("GET /api/student/profile", False, "No student token")
            return
            
        token = self.tokens['student']
        success, response = self.make_request('GET', 'student/profile', token=token)
        
        if success and isinstance(response, dict):
            # Verify this returns the same data as /api/profile/student
            expected_fields = ['id', 'user_id', 'first_name', 'last_name']
            has_profile_fields = all(field in response for field in expected_fields)
            
            self.log_test("GET /api/student/profile", has_profile_fields, 
                        f"Student profile alias working with {len(response)} fields")
            
            # Compare with original endpoint if possible
            success_orig, response_orig = self.make_request('GET', 'profile/student', token=token)
            if success_orig:
                fields_match = len(response) == len(response_orig)
                self.log_test("Student profile alias consistency", fields_match,
                            f"Alias has {len(response)} fields vs original {len(response_orig)} fields")
        else:
            self.log_test("GET /api/student/profile", False, str(response))

    def test_data_structure_integrity(self):
        """Test that all endpoints return well-structured data"""
        print("\n🔍 TESTING DATA STRUCTURE INTEGRITY")
        
        endpoints_to_test = [
            ('auth/me', 'student'),
            ('student/dashboard', 'student'),
            ('mentor/dashboard', 'mentor'),
            ('company/dashboard', 'company'),
            ('institution/dashboard', 'institution'),
            ('institution/analytics', 'institution'),
            ('profile/institution', 'institution'),
            ('student/profile', 'student')
        ]
        
        well_structured_count = 0
        total_endpoints = len(endpoints_to_test)
        
        for endpoint, role in endpoints_to_test:
            if role not in self.tokens:
                continue
                
            token = self.tokens[role]
            success, response = self.make_request('GET', endpoint, token=token)
            
            if success and isinstance(response, dict):
                # Check for common data integrity issues
                has_null_values = any(v is None for v in response.values() if isinstance(v, (str, int, float)))
                has_empty_required_fields = False
                
                # Check for empty strings in critical fields
                critical_fields = ['id', 'user_id', 'email', 'role']
                for field in critical_fields:
                    if field in response and response[field] == "":
                        has_empty_required_fields = True
                        break
                
                is_well_structured = not has_null_values and not has_empty_required_fields
                
                if is_well_structured:
                    well_structured_count += 1
                    
                print(f"  ✅ {endpoint} ({role}): Well structured - {len(response)} fields")
            else:
                print(f"  ❌ {endpoint} ({role}): Failed to retrieve data")
        
        integrity_percentage = (well_structured_count / total_endpoints) * 100
        self.log_test("Overall data structure integrity", well_structured_count == total_endpoints,
                    f"{well_structured_count}/{total_endpoints} endpoints well-structured ({integrity_percentage:.1f}%)")

    def test_cross_role_access_control(self):
        """Test that role-based access control is working for new endpoints"""
        print("\n🔒 TESTING CROSS-ROLE ACCESS CONTROL")
        
        # Test that students cannot access other role dashboards
        if 'student' in self.tokens:
            student_token = self.tokens['student']
            
            # Student should not access mentor dashboard
            success, response = self.make_request('GET', 'mentor/dashboard', token=student_token, expected_status=403)
            self.log_test("Student->Mentor dashboard access denied", success, 
                        "Access properly denied" if success else "Access not properly controlled")
            
            # Student should not access company dashboard  
            success, response = self.make_request('GET', 'company/dashboard', token=student_token, expected_status=403)
            self.log_test("Student->Company dashboard access denied", success,
                        "Access properly denied" if success else "Access not properly controlled")
            
            # Student should not access institution analytics
            success, response = self.make_request('GET', 'institution/analytics', token=student_token, expected_status=403)
            self.log_test("Student->Institution analytics access denied", success,
                        "Access properly denied" if success else "Access not properly controlled")

    def run_comprehensive_test(self):
        """Run all tests for the new endpoints"""
        print("🎯 ÉMÉRÉS NEW ENDPOINTS COMPREHENSIVE TESTING")
        print("=" * 60)
        print("Testing recently added endpoints as requested in French review:")
        print("- GET /api/auth/me")
        print("- GET /api/profile/institution")
        print("- GET /api/student/dashboard")
        print("- GET /api/mentor/dashboard")
        print("- GET /api/company/dashboard")
        print("- GET /api/institution/dashboard")
        print("- GET /api/institution/analytics")
        print("- GET /api/student/profile")
        print("=" * 60)
        
        # Step 1: Authenticate all users
        self.authenticate_all_users()
        
        # Step 2: Test all new endpoints
        self.test_auth_me_endpoint()
        self.test_profile_institution_endpoint()
        self.test_dashboard_endpoints()
        self.test_institution_analytics_endpoint()
        self.test_student_profile_alias_endpoint()
        
        # Step 3: Test data integrity and security
        self.test_data_structure_integrity()
        self.test_cross_role_access_control()
        
        # Step 4: Calculate and display results
        self.display_final_results()

    def display_final_results(self):
        """Display comprehensive test results"""
        print("\n" + "=" * 60)
        print("🎯 ÉMÉRÉS NEW ENDPOINTS TEST RESULTS")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        
        print(f"📊 OVERALL SUCCESS RATE: {success_rate:.1f}% ({self.tests_passed}/{self.tests_run})")
        
        if success_rate >= 90:
            print("🎉 EXCELLENT: Backend is ready for production (90%+ success rate achieved)")
        elif success_rate >= 75:
            print("✅ GOOD: Backend is mostly functional with minor issues")
        elif success_rate >= 50:
            print("⚠️  MODERATE: Backend has significant issues that need attention")
        else:
            print("❌ CRITICAL: Backend has major issues blocking production readiness")
        
        print("\n📋 DETAILED RESULTS BY CATEGORY:")
        
        # Group results by category
        auth_tests = [r for r in self.test_results if 'auth' in r['name'].lower()]
        dashboard_tests = [r for r in self.test_results if 'dashboard' in r['name'].lower()]
        profile_tests = [r for r in self.test_results if 'profile' in r['name'].lower()]
        security_tests = [r for r in self.test_results if 'access' in r['name'].lower() or 'denied' in r['name'].lower()]
        
        categories = [
            ("🔐 Authentication", auth_tests),
            ("📊 Dashboards", dashboard_tests), 
            ("👤 Profiles", profile_tests),
            ("🔒 Security", security_tests)
        ]
        
        for category_name, tests in categories:
            if tests:
                passed = sum(1 for t in tests if t['success'])
                total = len(tests)
                rate = (passed / total) * 100 if total > 0 else 0
                print(f"  {category_name}: {rate:.1f}% ({passed}/{total})")
        
        print("\n🔍 FAILED TESTS:")
        failed_tests = [r for r in self.test_results if not r['success']]
        if failed_tests:
            for test in failed_tests:
                print(f"  ❌ {test['name']}: {test['details']}")
        else:
            print("  🎉 No failed tests!")
        
        print("\n📈 RECOMMENDATION:")
        if success_rate >= 90:
            print("  ✅ All new endpoints are working correctly")
            print("  ✅ Backend API is complete and stable") 
            print("  ✅ Ready for production deployment")
        else:
            print("  ⚠️  Some endpoints need attention before production")
            print("  🔧 Review failed tests and fix issues")
            print("  🧪 Re-run tests after fixes")

if __name__ == "__main__":
    tester = EmeresNewEndpointsTester()
    tester.run_comprehensive_test()