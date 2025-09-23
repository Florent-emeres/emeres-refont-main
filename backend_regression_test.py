#!/usr/bin/env python3
"""
ÉMÉRÉS Backend Regression Testing Suite
Tests critical endpoints after frontend "À propos" pages addition
Focus: Performance, Authentication, and Critical API endpoints
"""

import requests
import sys
import json
import time
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
        self.performance_metrics = {}

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
                    token: Optional[str] = None, expected_status: int = 200, measure_time: bool = False) -> tuple:
        """Make HTTP request and return success status, response data, and optionally timing"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        start_time = time.time() if measure_time else None

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            else:
                return False, f"Unsupported method: {method}", None

            end_time = time.time() if measure_time else None
            response_time = (end_time - start_time) * 1000 if measure_time else None  # Convert to ms

            success = response.status_code == expected_status
            
            if success:
                try:
                    return True, response.json(), response_time
                except:
                    return True, response.text, response_time
            else:
                error_msg = f"Status {response.status_code}, expected {expected_status}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                return False, error_msg, response_time

        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", None

    def test_authentication_all_roles(self):
        """Test authentication for all user roles as specified in review request"""
        print("\n🔐 TESTING AUTHENTICATION FOR ALL ROLES")
        print("   Testing: student, mentor, company, institution")
        
        # Test credentials for all roles
        test_credentials = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]

        for cred in test_credentials:
            print(f"\n🔑 Testing {cred['role']} authentication")
            
            # Test login endpoint
            success, response, response_time = self.make_request(
                'POST', 'auth/login', 
                {"email": cred["email"], "password": cred["password"]}, 
                expected_status=200, measure_time=True
            )
            
            if success and isinstance(response, dict):
                self.tokens[cred['role']] = response.get('access_token')
                self.users[cred['role']] = response.get('user', {})
                self.performance_metrics[f"login_{cred['role']}"] = response_time
                
                self.log_test(f"Login {cred['role']}", True, 
                             f"Token received, response time: {response_time:.1f}ms")
            else:
                self.log_test(f"Login {cred['role']}", False, str(response))

    def test_auth_me_endpoint(self):
        """Test GET /api/auth/me endpoint for all authenticated roles"""
        print("\n👤 TESTING GET /api/auth/me ENDPOINT")
        print("   Verifying user info retrieval for all roles")
        
        for role in ['student', 'mentor', 'company', 'institution']:
            if role not in self.tokens:
                self.log_test(f"GET /api/auth/me - {role}", False, f"No {role} token available")
                continue
                
            success, response, response_time = self.make_request(
                'GET', 'auth/me', 
                token=self.tokens[role], 
                expected_status=200, measure_time=True
            )
            
            if success and isinstance(response, dict):
                user_data = response
                expected_fields = ['id', 'email', 'role', 'first_name', 'last_name']
                has_required_fields = all(field in user_data for field in expected_fields)
                correct_role = user_data.get('role') == role
                
                self.performance_metrics[f"auth_me_{role}"] = response_time
                
                self.log_test(f"GET /api/auth/me - {role}", 
                             has_required_fields and correct_role,
                             f"User info retrieved, role: {user_data.get('role')}, time: {response_time:.1f}ms")
            else:
                self.log_test(f"GET /api/auth/me - {role}", False, str(response))

    def test_dashboard_endpoints(self):
        """Test all dashboard endpoints specified in review request"""
        print("\n📊 TESTING DASHBOARD ENDPOINTS")
        print("   Testing: student/dashboard/stats, mentor/dashboard, company/dashboard, institution/dashboard")
        
        dashboard_endpoints = [
            {"endpoint": "student/dashboard/stats", "role": "student"},
            {"endpoint": "mentor/dashboard", "role": "mentor"},
            {"endpoint": "company/dashboard", "role": "company"},
            {"endpoint": "institution/dashboard", "role": "institution"}
        ]
        
        for dashboard in dashboard_endpoints:
            endpoint = dashboard["endpoint"]
            role = dashboard["role"]
            
            if role not in self.tokens:
                self.log_test(f"GET /api/{endpoint}", False, f"No {role} token available")
                continue
                
            success, response, response_time = self.make_request(
                'GET', endpoint,
                token=self.tokens[role],
                expected_status=200, measure_time=True
            )
            
            if success and isinstance(response, dict):
                # Verify dashboard data structure
                data_fields = len(response.keys())
                has_data = data_fields > 0
                
                self.performance_metrics[f"dashboard_{role}"] = response_time
                
                self.log_test(f"GET /api/{endpoint}", has_data,
                             f"Dashboard data retrieved, {data_fields} fields, time: {response_time:.1f}ms")
            else:
                self.log_test(f"GET /api/{endpoint}", False, str(response))

    def test_performance_metrics(self):
        """Analyze performance metrics to ensure no regression"""
        print("\n⚡ PERFORMANCE ANALYSIS")
        print("   Analyzing response times for performance regression")
        
        if not self.performance_metrics:
            self.log_test("Performance analysis", False, "No performance data collected")
            return
            
        # Define acceptable response time thresholds (in ms)
        thresholds = {
            'login': 2000,      # 2 seconds for login
            'auth_me': 1000,    # 1 second for user info
            'dashboard': 3000   # 3 seconds for dashboard data
        }
        
        performance_issues = []
        
        for metric_name, response_time in self.performance_metrics.items():
            # Determine threshold based on metric type
            threshold = 1000  # default
            for threshold_type, threshold_value in thresholds.items():
                if threshold_type in metric_name:
                    threshold = threshold_value
                    break
            
            if response_time > threshold:
                performance_issues.append(f"{metric_name}: {response_time:.1f}ms (threshold: {threshold}ms)")
            
            print(f"  📈 {metric_name}: {response_time:.1f}ms")
        
        if performance_issues:
            self.log_test("Performance regression check", False, 
                         f"Performance issues detected: {'; '.join(performance_issues)}")
        else:
            avg_response_time = sum(self.performance_metrics.values()) / len(self.performance_metrics)
            self.log_test("Performance regression check", True,
                         f"All endpoints within acceptable limits, avg: {avg_response_time:.1f}ms")

    def test_cross_role_security(self):
        """Test that role-based access control still works correctly"""
        print("\n🔒 TESTING CROSS-ROLE SECURITY")
        print("   Verifying role-based access control after frontend changes")
        
        # Test that students cannot access company dashboard
        if 'student' in self.tokens:
            success, response, _ = self.make_request(
                'GET', 'company/dashboard',
                token=self.tokens['student'],
                expected_status=403
            )
            self.log_test("Student->Company dashboard access denied", success,
                         "Access properly denied" if success else "Security breach detected")
        
        # Test that companies cannot access student dashboard stats
        if 'company' in self.tokens:
            success, response, _ = self.make_request(
                'GET', 'student/dashboard/stats',
                token=self.tokens['company'],
                expected_status=403
            )
            self.log_test("Company->Student dashboard access denied", success,
                         "Access properly denied" if success else "Security breach detected")
        
        # Test that mentors cannot access institution dashboard
        if 'mentor' in self.tokens:
            success, response, _ = self.make_request(
                'GET', 'institution/dashboard',
                token=self.tokens['mentor'],
                expected_status=403
            )
            self.log_test("Mentor->Institution dashboard access denied", success,
                         "Access properly denied" if success else "Security breach detected")

    def test_critical_endpoints_functionality(self):
        """Test additional critical endpoints to ensure no regression"""
        print("\n🎯 TESTING ADDITIONAL CRITICAL ENDPOINTS")
        print("   Testing core functionality endpoints")
        
        # Test offers endpoint (public)
        success, response, response_time = self.make_request(
            'GET', 'offers', expected_status=200, measure_time=True
        )
        if success and isinstance(response, list):
            self.log_test("GET /api/offers (public)", True,
                         f"Retrieved {len(response)} offers, time: {response_time:.1f}ms")
        else:
            self.log_test("GET /api/offers (public)", False, str(response))
        
        # Test student profile endpoint
        if 'student' in self.tokens:
            success, response, response_time = self.make_request(
                'GET', 'profile/student',
                token=self.tokens['student'],
                expected_status=200, measure_time=True
            )
            if success and isinstance(response, dict):
                profile_fields = len(response.keys())
                self.log_test("GET /api/profile/student", True,
                             f"Profile retrieved, {profile_fields} fields, time: {response_time:.1f}ms")
            else:
                self.log_test("GET /api/profile/student", False, str(response))
        
        # Test company profile endpoint
        if 'company' in self.tokens:
            success, response, response_time = self.make_request(
                'GET', 'profile/company',
                token=self.tokens['company'],
                expected_status=200, measure_time=True
            )
            if success and isinstance(response, dict):
                profile_fields = len(response.keys())
                self.log_test("GET /api/profile/company", True,
                             f"Profile retrieved, {profile_fields} fields, time: {response_time:.1f}ms")
            else:
                self.log_test("GET /api/profile/company", False, str(response))

    def test_new_frontend_routes_impact(self):
        """Test that new frontend routes don't impact backend"""
        print("\n🌐 TESTING FRONTEND ROUTES IMPACT ON BACKEND")
        print("   Verifying new 'À propos' pages don't affect backend performance")
        
        # The new frontend routes (Mission, Récompenses, Carrières) are client-side only
        # They should not impact backend performance or functionality
        # We test this by ensuring all critical endpoints still respond normally
        
        critical_endpoints = [
            {"endpoint": "auth/me", "role": "student", "name": "User authentication"},
            {"endpoint": "offers", "role": None, "name": "Public offers"},
            {"endpoint": "student/dashboard/stats", "role": "student", "name": "Student dashboard"},
        ]
        
        total_response_time = 0
        successful_tests = 0
        
        for test_endpoint in critical_endpoints:
            endpoint = test_endpoint["endpoint"]
            role = test_endpoint["role"]
            name = test_endpoint["name"]
            
            token = self.tokens.get(role) if role else None
            
            success, response, response_time = self.make_request(
                'GET', endpoint,
                token=token,
                expected_status=200, measure_time=True
            )
            
            if success and response_time:
                total_response_time += response_time
                successful_tests += 1
                
                self.log_test(f"Frontend impact test - {name}", True,
                             f"No impact detected, time: {response_time:.1f}ms")
            else:
                self.log_test(f"Frontend impact test - {name}", False,
                             f"Potential impact detected: {str(response)}")
        
        if successful_tests > 0:
            avg_response_time = total_response_time / successful_tests
            impact_detected = avg_response_time > 2000  # 2 second threshold
            
            self.log_test("Overall frontend impact assessment", not impact_detected,
                         f"Average response time: {avg_response_time:.1f}ms, impact: {'YES' if impact_detected else 'NO'}")

    def run_regression_tests(self):
        """Run all regression tests"""
        print("🚀 ÉMÉRÉS BACKEND REGRESSION TESTING SUITE")
        print("=" * 60)
        print("Testing backend stability after frontend 'À propos' pages addition")
        print("Focus: Performance, Authentication, Critical API endpoints")
        print("=" * 60)
        
        # Run all test suites
        self.test_authentication_all_roles()
        self.test_auth_me_endpoint()
        self.test_dashboard_endpoints()
        self.test_cross_role_security()
        self.test_critical_endpoints_functionality()
        self.test_new_frontend_routes_impact()
        self.test_performance_metrics()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 REGRESSION TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("✅ REGRESSION TEST RESULT: PASS - Backend stable after frontend changes")
        elif success_rate >= 75:
            print("⚠️  REGRESSION TEST RESULT: WARNING - Minor issues detected")
        else:
            print("❌ REGRESSION TEST RESULT: FAIL - Significant regressions detected")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        # Print performance summary
        if self.performance_metrics:
            print(f"\n⚡ PERFORMANCE SUMMARY:")
            avg_time = sum(self.performance_metrics.values()) / len(self.performance_metrics)
            print(f"  Average Response Time: {avg_time:.1f}ms")
            slowest = max(self.performance_metrics.items(), key=lambda x: x[1])
            print(f"  Slowest Endpoint: {slowest[0]} ({slowest[1]:.1f}ms)")
        
        return success_rate >= 90

if __name__ == "__main__":
    tester = EmeresRegressionTester()
    success = tester.run_regression_tests()
    sys.exit(0 if success else 1)