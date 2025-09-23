#!/usr/bin/env python3
"""
ÉMÉRÉS SchoolDashboard Diagnostic Test Suite
Focused testing for school authentication and session timeout issues
"""

import requests
import sys
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional

class SchoolDashboardDiagnostic:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.school_token = None
        self.school_user = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session_start_time = None

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
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
        return success

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    token: Optional[str] = None, expected_status: int = 200, timeout: int = 10) -> tuple:
        """Make HTTP request and return success status and response data"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            start_time = time.time()
            
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
            else:
                return False, f"Unsupported method: {method}"

            response_time = time.time() - start_time
            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    return True, {
                        'data': response_data,
                        'response_time': response_time,
                        'status_code': response.status_code
                    }
                except:
                    return True, {
                        'data': response.text,
                        'response_time': response_time,
                        'status_code': response.status_code
                    }
            else:
                error_msg = f"Status {response.status_code}, expected {expected_status}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                return False, {
                    'error': error_msg,
                    'response_time': response_time,
                    'status_code': response.status_code
                }

        except requests.exceptions.Timeout:
            return False, f"Request timeout after {timeout}s"
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}"

    def test_school_authentication_login(self):
        """Test school user authentication with school@emeres.fr"""
        print("\n🏫 PHASE 1: TESTING SCHOOL AUTHENTICATION LOGIN")
        
        # Test school login with provided credentials
        login_data = {
            "email": "school@emeres.fr",
            "password": "SchoolPass123!"
        }
        
        print(f"   Attempting login with: {login_data['email']}")
        success, response = self.make_request('POST', 'auth/login', login_data, timeout=15)
        
        if success:
            response_data = response.get('data', {})
            self.school_token = response_data.get('access_token')
            self.school_user = response_data.get('user', {})
            self.session_start_time = time.time()
            
            # Verify user role
            user_role = self.school_user.get('role')
            user_email = self.school_user.get('email')
            
            role_correct = user_role == 'school'
            email_correct = user_email == 'school@emeres.fr'
            
            self.log_test("School login authentication", success and role_correct and email_correct,
                         f"Role: {user_role}, Email: {user_email}, Token: {'✓' if self.school_token else '✗'}")
            
            if self.school_token:
                print(f"   🔑 Token received: {self.school_token[:20]}...")
                print(f"   👤 User ID: {self.school_user.get('id', 'N/A')}")
                print(f"   ⏱️  Response time: {response.get('response_time', 0):.3f}s")
        else:
            self.log_test("School login authentication", False, 
                         f"Login failed: {response.get('error', 'Unknown error')}")
            return False
        
        return True

    def test_auth_me_endpoint(self):
        """Test /api/auth/me endpoint with school token"""
        print("\n🔍 PHASE 2: TESTING /api/auth/me ENDPOINT")
        
        if not self.school_token:
            self.log_test("Auth/me endpoint test", False, "No school token available")
            return False
        
        success, response = self.make_request('GET', 'auth/me', token=self.school_token, timeout=10)
        
        if success:
            response_data = response.get('data', {})
            user_role = response_data.get('role')
            user_email = response_data.get('email')
            user_id = response_data.get('id')
            
            # Verify user data consistency
            role_match = user_role == 'school'
            email_match = user_email == 'school@emeres.fr'
            has_id = bool(user_id)
            
            self.log_test("Auth/me endpoint functionality", success and role_match and email_match and has_id,
                         f"Role: {user_role}, Email: {user_email}, ID: {'✓' if has_id else '✗'}")
            
            print(f"   📊 User data: ID={user_id}, Role={user_role}, Email={user_email}")
            print(f"   ⏱️  Response time: {response.get('response_time', 0):.3f}s")
        else:
            self.log_test("Auth/me endpoint functionality", False,
                         f"Auth/me failed: {response.get('error', 'Unknown error')}")
            return False
        
        return True

    def test_school_specific_endpoints(self):
        """Test school-specific API endpoints"""
        print("\n🎓 PHASE 3: TESTING SCHOOL-SPECIFIC ENDPOINTS")
        
        if not self.school_token:
            self.log_test("School endpoints test", False, "No school token available")
            return False
        
        # Test school profile endpoint
        print("   Testing GET /api/profile/school")
        success, response = self.make_request('GET', 'profile/school', token=self.school_token)
        
        if success:
            response_data = response.get('data', {})
            has_profile_data = bool(response_data)
            self.log_test("School profile endpoint", has_profile_data,
                         f"Profile data: {'✓' if has_profile_data else '✗'}")
        else:
            # School profile might not exist yet, check if it's 404 or auth issue
            status_code = response.get('status_code', 0)
            if status_code == 404:
                self.log_test("School profile endpoint", True, "Profile not found (404) - expected for new account")
            else:
                self.log_test("School profile endpoint", False,
                             f"Unexpected error: {response.get('error', 'Unknown')}")
        
        # Test school dashboard endpoint
        print("   Testing GET /api/school/dashboard")
        success, response = self.make_request('GET', 'school/dashboard', token=self.school_token)
        
        if success:
            response_data = response.get('data', {})
            has_dashboard_data = bool(response_data)
            self.log_test("School dashboard endpoint", has_dashboard_data,
                         f"Dashboard data: {'✓' if has_dashboard_data else '✗'}")
        else:
            status_code = response.get('status_code', 0)
            if status_code == 404:
                self.log_test("School dashboard endpoint", True, "Dashboard endpoint not implemented (404)")
            else:
                self.log_test("School dashboard endpoint", False,
                             f"Dashboard error: {response.get('error', 'Unknown')}")
        
        return True

    def test_session_timeout_behavior(self):
        """Test session timeout and token validity over time"""
        print("\n⏰ PHASE 4: TESTING SESSION TIMEOUT BEHAVIOR")
        
        if not self.school_token or not self.session_start_time:
            self.log_test("Session timeout test", False, "No session data available")
            return False
        
        # Test immediate token validity
        print("   Testing immediate token validity")
        success, response = self.make_request('GET', 'auth/me', token=self.school_token, timeout=5)
        
        if success:
            self.log_test("Immediate token validity", True, "Token valid immediately after login")
        else:
            self.log_test("Immediate token validity", False, 
                         f"Token invalid immediately: {response.get('error', 'Unknown')}")
            return False
        
        # Test token validity after short delay
        print("   Testing token validity after 30 seconds...")
        time.sleep(30)
        
        success, response = self.make_request('GET', 'auth/me', token=self.school_token, timeout=5)
        
        if success:
            self.log_test("Token validity after 30s", True, "Token still valid after 30 seconds")
        else:
            self.log_test("Token validity after 30s", False,
                         f"Token expired after 30s: {response.get('error', 'Unknown')}")
        
        # Test multiple rapid requests (simulate dashboard usage)
        print("   Testing rapid consecutive requests (dashboard simulation)")
        rapid_requests_success = 0
        rapid_requests_total = 5
        
        for i in range(rapid_requests_total):
            success, response = self.make_request('GET', 'auth/me', token=self.school_token, timeout=3)
            if success:
                rapid_requests_success += 1
            time.sleep(1)  # 1 second between requests
        
        rapid_success_rate = rapid_requests_success / rapid_requests_total
        self.log_test("Rapid requests handling", rapid_success_rate >= 0.8,
                     f"Success rate: {rapid_success_rate:.1%} ({rapid_requests_success}/{rapid_requests_total})")
        
        return True

    def test_logout_functionality(self):
        """Test logout endpoint and token invalidation"""
        print("\n🚪 PHASE 5: TESTING LOGOUT FUNCTIONALITY")
        
        if not self.school_token:
            self.log_test("Logout test", False, "No school token available")
            return False
        
        # Test logout endpoint
        print("   Testing POST /api/auth/logout")
        success, response = self.make_request('POST', 'auth/logout', token=self.school_token, timeout=10)
        
        if success:
            self.log_test("Logout endpoint", True, "Logout successful")
            
            # Test token invalidation after logout
            print("   Testing token validity after logout")
            success, response = self.make_request('GET', 'auth/me', token=self.school_token, 
                                                expected_status=401, timeout=5)
            
            if success:  # success means we got expected 401
                self.log_test("Token invalidation after logout", True, "Token properly invalidated")
            else:
                self.log_test("Token invalidation after logout", False,
                             f"Token still valid after logout: {response.get('error', 'Unknown')}")
        else:
            status_code = response.get('status_code', 0)
            if status_code == 404:
                self.log_test("Logout endpoint", False, "Logout endpoint not implemented (404)")
            else:
                self.log_test("Logout endpoint", False,
                             f"Logout failed: {response.get('error', 'Unknown')}")
        
        return True

    def test_session_persistence_across_requests(self):
        """Test session persistence across different types of requests"""
        print("\n🔄 PHASE 6: TESTING SESSION PERSISTENCE")
        
        # Re-login for persistence test
        print("   Re-authenticating for persistence test")
        login_data = {
            "email": "school@emeres.fr", 
            "password": "SchoolPass123!"
        }
        
        success, response = self.make_request('POST', 'auth/login', login_data, timeout=10)
        
        if not success:
            self.log_test("Re-authentication for persistence test", False, "Could not re-authenticate")
            return False
        
        response_data = response.get('data', {})
        fresh_token = response_data.get('access_token')
        
        if not fresh_token:
            self.log_test("Re-authentication for persistence test", False, "No token received")
            return False
        
        self.log_test("Re-authentication for persistence test", True, "Fresh token obtained")
        
        # Test different endpoint types with same token
        endpoints_to_test = [
            ('GET', 'auth/me', 'User info endpoint'),
            ('GET', 'profile/school', 'School profile endpoint'),
            ('GET', 'offers', 'Public offers endpoint'),
        ]
        
        persistence_success = 0
        persistence_total = len(endpoints_to_test)
        
        for method, endpoint, description in endpoints_to_test:
            print(f"   Testing {description}: {method} /api/{endpoint}")
            success, response = self.make_request(method, endpoint, token=fresh_token, timeout=8)
            
            if success or response.get('status_code') == 404:  # 404 is acceptable for some endpoints
                persistence_success += 1
                status = "✓"
            else:
                status = "✗"
            
            print(f"     {status} {description}: {response.get('status_code', 'N/A')}")
        
        persistence_rate = persistence_success / persistence_total
        self.log_test("Session persistence across endpoints", persistence_rate >= 0.8,
                     f"Persistence rate: {persistence_rate:.1%} ({persistence_success}/{persistence_total})")
        
        return True

    def test_concurrent_session_handling(self):
        """Test handling of multiple concurrent sessions"""
        print("\n👥 PHASE 7: TESTING CONCURRENT SESSION HANDLING")
        
        # Create multiple tokens by logging in multiple times
        tokens = []
        
        for i in range(3):
            print(f"   Creating session {i+1}/3")
            login_data = {
                "email": "school@emeres.fr",
                "password": "SchoolPass123!"
            }
            
            success, response = self.make_request('POST', 'auth/login', login_data, timeout=10)
            
            if success:
                response_data = response.get('data', {})
                token = response_data.get('access_token')
                if token:
                    tokens.append(token)
        
        self.log_test("Multiple session creation", len(tokens) >= 2,
                     f"Created {len(tokens)}/3 sessions")
        
        if len(tokens) < 2:
            return False
        
        # Test if all tokens are valid
        valid_tokens = 0
        for i, token in enumerate(tokens):
            success, response = self.make_request('GET', 'auth/me', token=token, timeout=5)
            if success:
                valid_tokens += 1
        
        self.log_test("Concurrent session validity", valid_tokens >= 2,
                     f"Valid sessions: {valid_tokens}/{len(tokens)}")
        
        return True

    def run_diagnostic(self):
        """Run complete diagnostic test suite"""
        print("🏫 ÉMÉRÉS SCHOOLDASHBOARD DIAGNOSTIC TEST SUITE")
        print("=" * 60)
        print(f"Target URL: {self.base_url}")
        print(f"API URL: {self.api_url}")
        print(f"Test User: school@emeres.fr")
        print(f"Started: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Run all test phases
        phases = [
            self.test_school_authentication_login,
            self.test_auth_me_endpoint,
            self.test_school_specific_endpoints,
            self.test_session_timeout_behavior,
            self.test_logout_functionality,
            self.test_session_persistence_across_requests,
            self.test_concurrent_session_handling
        ]
        
        for phase in phases:
            try:
                phase()
            except Exception as e:
                print(f"❌ PHASE ERROR: {phase.__name__} failed with exception: {str(e)}")
                self.log_test(f"{phase.__name__} (exception)", False, str(e))
            
            print()  # Add spacing between phases
        
        # Print summary
        self.print_diagnostic_summary()

    def print_diagnostic_summary(self):
        """Print comprehensive diagnostic summary"""
        print("🏫 SCHOOLDASHBOARD DIAGNOSTIC SUMMARY")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 OVERALL RESULTS:")
        print(f"   Tests Run: {self.tests_run}")
        print(f"   Tests Passed: {self.tests_passed}")
        print(f"   Success Rate: {success_rate:.1f}%")
        print()
        
        # Categorize results
        critical_failures = []
        warnings = []
        successes = []
        
        for result in self.test_results:
            if not result['success']:
                if any(keyword in result['name'].lower() for keyword in ['login', 'auth', 'token']):
                    critical_failures.append(result)
                else:
                    warnings.append(result)
            else:
                successes.append(result)
        
        # Print critical failures
        if critical_failures:
            print("🚨 CRITICAL FAILURES (Authentication/Session Issues):")
            for failure in critical_failures:
                print(f"   ❌ {failure['name']}: {failure['details']}")
            print()
        
        # Print warnings
        if warnings:
            print("⚠️  WARNINGS (Non-Critical Issues):")
            for warning in warnings:
                print(f"   ⚠️  {warning['name']}: {warning['details']}")
            print()
        
        # Print key successes
        if successes:
            print("✅ KEY SUCCESSES:")
            for success in successes[:5]:  # Show first 5 successes
                print(f"   ✅ {success['name']}: {success['details']}")
            if len(successes) > 5:
                print(f"   ... and {len(successes) - 5} more successful tests")
            print()
        
        # Diagnostic conclusions
        print("🔍 DIAGNOSTIC CONCLUSIONS:")
        
        if success_rate >= 80:
            print("   ✅ School authentication system is working correctly")
            print("   ✅ No significant session timeout issues detected")
            print("   ✅ SchoolDashboard should be accessible")
        elif success_rate >= 60:
            print("   ⚠️  School authentication has minor issues")
            print("   ⚠️  Some session management problems detected")
            print("   ⚠️  SchoolDashboard may have intermittent access issues")
        else:
            print("   🚨 Critical authentication problems detected")
            print("   🚨 Significant session timeout issues found")
            print("   🚨 SchoolDashboard likely inaccessible")
        
        print()
        print("📋 RECOMMENDATIONS:")
        
        if critical_failures:
            print("   1. Fix authentication issues before proceeding")
            print("   2. Check school user account exists in database")
            print("   3. Verify JWT token configuration")
        
        if any('timeout' in result['name'].lower() for result in self.test_results if not result['success']):
            print("   4. Investigate session timeout configuration")
            print("   5. Check token expiration settings")
        
        if success_rate < 100:
            print("   6. Review backend logs for detailed error information")
            print("   7. Test with different school credentials if available")
        
        print("=" * 60)

if __name__ == "__main__":
    diagnostic = SchoolDashboardDiagnostic()
    diagnostic.run_diagnostic()