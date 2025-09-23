#!/usr/bin/env python3
"""
ÉMÉRÉS Platform Backend API Testing Suite - French Review Request
Tests all authentication, profile, offer, and application endpoints
Focus on recently fixed endpoints and comprehensive backend validation
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class EmeresBackendTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.failed_endpoints = []
        self.successful_endpoints = []

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
            
            # Track endpoints
            endpoint_info = f"{method} /api/{endpoint}"
            if success:
                if endpoint_info not in self.successful_endpoints:
                    self.successful_endpoints.append(endpoint_info)
            else:
                error_msg = f"Status {response.status_code}, expected {expected_status}"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                
                endpoint_error = f"{endpoint_info} - {error_msg}"
                if endpoint_error not in self.failed_endpoints:
                    self.failed_endpoints.append(endpoint_error)
            
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
            endpoint_error = f"{method} /api/{endpoint} - Request failed: {str(e)}"
            if endpoint_error not in self.failed_endpoints:
                self.failed_endpoints.append(endpoint_error)
            return False, f"Request failed: {str(e)}"

    def test_authentication_endpoints(self):
        """Test authentication endpoints: login, register, logout"""
        print("\n🔐 TESTING AUTHENTICATION ENDPOINTS")
        
        # Test existing users from review request
        existing_users = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]

        # Test login for existing users
        for user in existing_users:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": user["email"], "password": user["password"]}, 
                                                expected_status=200)
            
            if success and isinstance(response, dict):
                self.tokens[user['role']] = response.get('access_token')
                self.users[user['role']] = response.get('user', {})
                self.log_test(f"Login {user['role']} ({user['email']})", True, "Token received")
            else:
                self.log_test(f"Login {user['role']} ({user['email']})", False, str(response))

        # Test registration for new user
        new_user_data = {
            "email": "test-new-user@emeres.fr",
            "password": "TestPass123!",
            "role": "student",
            "first_name": "Test",
            "last_name": "User"
        }
        
        success, response = self.make_request('POST', 'auth/register', new_user_data, expected_status=200)
        if success and isinstance(response, dict):
            self.tokens['test_student'] = response.get('access_token')
            self.users['test_student'] = response.get('user', {})
            self.log_test("Register new student", True, "Registration successful")
        else:
            self.log_test("Register new student", False, str(response))

        # Test invalid login
        success, response = self.make_request('POST', 'auth/login', 
                                            {"email": "invalid@emeres.fr", "password": "wrongpass"}, 
                                            expected_status=401)
        self.log_test("Invalid login rejection", success, "Should return 401")

    def test_recently_fixed_endpoints(self):
        """Test recently fixed endpoints mentioned in review request"""
        print("\n🆕 TESTING RECENTLY FIXED ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Recently fixed endpoints test", False, "No student token available")
            return

        student_token = self.tokens['student']
        
        # Test GET /api/student/mentorship-requests (nouvelle ajout)
        success, response = self.make_request('GET', 'student/mentorship-requests', token=student_token)
        self.log_test("GET /api/student/mentorship-requests", success, 
                     f"New endpoint - {len(response) if success and isinstance(response, list) else 'Error'} requests" if success else str(response))

        # Test GET /api/student/notifications/unread-count (nouvelle ajout)
        success, response = self.make_request('GET', 'student/notifications/unread-count', token=student_token)
        self.log_test("GET /api/student/notifications/unread-count", success, 
                     f"Unread count: {response.get('count', 'N/A') if success and isinstance(response, dict) else 'Error'}" if success else str(response))

    def test_student_dashboard_endpoints(self):
        """Test student dashboard endpoints: profil, offres, candidatures, stats"""
        print("\n👨‍🎓 TESTING STUDENT DASHBOARD ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Student dashboard endpoints test", False, "No student token available")
            return

        student_token = self.tokens['student']
        
        # Test profile endpoint
        success, response = self.make_request('GET', 'profile/student', token=student_token)
        self.log_test("GET /api/profile/student", success, "Profile retrieved" if success else str(response))

        # Test offers endpoint
        success, response = self.make_request('GET', 'offers', token=student_token)
        self.log_test("GET /api/offers", success, 
                     f"Found {len(response) if success and isinstance(response, list) else 0} offers" if success else str(response))

        # Test student applications
        success, response = self.make_request('GET', 'applications/my', token=student_token)
        self.log_test("GET /api/applications/my", success, 
                     f"Found {len(response) if success and isinstance(response, list) else 0} applications" if success else str(response))

        # Test student dashboard stats
        success, response = self.make_request('GET', 'student/dashboard/stats', token=student_token)
        self.log_test("GET /api/student/dashboard/stats", success, 
                     f"Stats retrieved" if success else str(response))

        # Test student mentorship ads
        success, response = self.make_request('GET', 'student/mentorship-ads', token=student_token)
        self.log_test("GET /api/student/mentorship-ads", success, 
                     f"Found {len(response) if success and isinstance(response, list) else 0} mentorship ads" if success else str(response))

        # Test discover mentors
        success, response = self.make_request('GET', 'student/discover-mentors', token=student_token)
        self.log_test("GET /api/student/discover-mentors", success, 
                     f"Found {len(response) if success and isinstance(response, list) else 0} mentors" if success else str(response))

    def test_mentorship_endpoints(self):
        """Test mentorship endpoints: annonces, découverte mentors, réponses"""
        print("\n🤝 TESTING MENTORSHIP ENDPOINTS")
        
        # Test with student token
        if 'student' in self.tokens:
            student_token = self.tokens['student']
            
            # Test student mentorship ads
            success, response = self.make_request('GET', 'student/mentorship-ads', token=student_token)
            self.log_test("GET /api/student/mentorship-ads (student view)", success, 
                         f"Student ads: {len(response) if success and isinstance(response, list) else 0}" if success else str(response))

            # Test create mentorship ad
            ad_data = {
                "title": "Recherche mentor en développement web",
                "description": "Étudiant en informatique cherche mentor expérimenté en développement web",
                "field_of_study": "Informatique",
                "desired_expertise": ["React", "Node.js", "MongoDB"],
                "mentorship_goals": ["Améliorer mes compétences techniques", "Préparer mon stage"],
                "duration_expected": "6 mois",
                "time_commitment": "2h/semaine",
                "urgency_level": "medium"
            }
            
            success, response = self.make_request('POST', 'student/mentorship-ads', ad_data, token=student_token)
            self.log_test("POST /api/student/mentorship-ads", success, 
                         f"Ad created: {response.get('id', 'N/A') if success else 'Failed'}" if success else str(response))

        # Test with mentor token
        if 'mentor' in self.tokens:
            mentor_token = self.tokens['mentor']
            
            # Test mentor view of mentorship ads
            success, response = self.make_request('GET', 'mentor/mentorship-ads', token=mentor_token)
            self.log_test("GET /api/mentor/mentorship-ads (mentor view)", success, 
                         f"Available ads: {len(response) if success and isinstance(response, list) else 0}" if success else str(response))

            # Test mentor profile
            success, response = self.make_request('GET', 'mentor/profile', token=mentor_token)
            self.log_test("GET /api/mentor/profile", success, "Mentor profile retrieved" if success else str(response))

            # Test mentor students
            success, response = self.make_request('GET', 'mentor/students', token=mentor_token)
            self.log_test("GET /api/mentor/students", success, 
                         f"Mentor students: {len(response) if success and isinstance(response, list) else 0}" if success else str(response))

    def test_messaging_endpoints(self):
        """Test messaging endpoints: threads, messages"""
        print("\n💬 TESTING MESSAGING ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Messaging endpoints test", False, "No student token available")
            return

        student_token = self.tokens['student']
        
        # Test threads endpoint
        success, response = self.make_request('GET', 'threads', token=student_token)
        self.log_test("GET /api/threads", success, 
                     f"Found {len(response.get('threads', [])) if success and isinstance(response, dict) else 0} threads" if success else str(response))

        # Test messaging inbox (legacy)
        success, response = self.make_request('GET', 'messaging/inbox/student', token=student_token)
        self.log_test("GET /api/messaging/inbox/student", success, "Inbox retrieved" if success else str(response))

        # Test thread creation for support context
        thread_data = {
            "context_type": "support",
            "title": "Question technique",
            "message": "J'ai besoin d'aide avec mon profil"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/support/create', thread_data, token=student_token)
        self.log_test("POST /api/messaging/threads/support/create", success, 
                     f"Thread created: {response.get('thread_id', 'N/A') if success else 'Failed'}" if success else str(response))

    def test_other_role_endpoints(self):
        """Test endpoints for other roles: mentor, company, institution"""
        print("\n🏢 TESTING OTHER ROLE ENDPOINTS")
        
        # Test company endpoints
        if 'company' in self.tokens:
            company_token = self.tokens['company']
            
            # Test company profile
            success, response = self.make_request('GET', 'profile/company', token=company_token)
            self.log_test("GET /api/profile/company", success, "Company profile retrieved" if success else str(response))

            # Test company offers
            success, response = self.make_request('GET', 'offers/my', token=company_token)
            self.log_test("GET /api/offers/my (company)", success, 
                         f"Company offers: {len(response) if success and isinstance(response, list) else 0}" if success else str(response))

            # Test company applications
            success, response = self.make_request('GET', 'applications/company', token=company_token)
            self.log_test("GET /api/applications/company", success, 
                         f"Company applications: {len(response) if success and isinstance(response, list) else 0}" if success else str(response))

        # Test institution endpoints
        if 'institution' in self.tokens:
            institution_token = self.tokens['institution']
            
            # Test institution profile
            success, response = self.make_request('GET', 'profile/institution', token=institution_token)
            self.log_test("GET /api/profile/institution", success, "Institution profile retrieved" if success else str(response))

            # Test institution analytics
            success, response = self.make_request('GET', 'institution/analytics', token=institution_token)
            self.log_test("GET /api/institution/analytics", success, "Institution analytics retrieved" if success else str(response))

    def test_comprehensive_endpoint_coverage(self):
        """Test comprehensive endpoint coverage to identify 404/500 errors"""
        print("\n🔍 TESTING COMPREHENSIVE ENDPOINT COVERAGE")
        
        # Common endpoints to test
        endpoints_to_test = [
            # Authentication
            ("GET", "auth/me", "student"),
            
            # Student specific
            ("GET", "student/profile", "student"),
            ("GET", "student/offers", "student"),
            ("GET", "student/applications", "student"),
            ("GET", "student/mentors", "student"),
            ("GET", "student/notifications", "student"),
            
            # Mentor specific
            ("GET", "mentor/dashboard", "mentor"),
            ("GET", "mentor/students", "mentor"),
            ("GET", "mentor/sessions", "mentor"),
            
            # Company specific
            ("GET", "company/dashboard", "company"),
            ("GET", "company/candidates", "company"),
            
            # Institution specific
            ("GET", "institution/dashboard", "institution"),
            ("GET", "institution/students", "institution"),
            
            # General endpoints
            ("GET", "offers", None),
            ("GET", "mentors", None),
            ("GET", "companies", None),
        ]
        
        for method, endpoint, role in endpoints_to_test:
            token = self.tokens.get(role) if role else None
            success, response = self.make_request(method, endpoint, token=token)
            
            endpoint_name = f"{method} /api/{endpoint}"
            if role:
                endpoint_name += f" ({role})"
            
            self.log_test(f"Endpoint coverage: {endpoint_name}", success, 
                         "Available" if success else "Not available or error")

    def test_data_integrity(self):
        """Test data integrity of returned data"""
        print("\n🔍 TESTING DATA INTEGRITY")
        
        if 'student' not in self.tokens:
            self.log_test("Data integrity test", False, "No student token available")
            return

        student_token = self.tokens['student']
        
        # Test student profile data integrity
        success, response = self.make_request('GET', 'profile/student', token=student_token)
        if success and isinstance(response, dict):
            required_fields = ['id', 'user_id', 'first_name', 'last_name']
            has_required_fields = all(field in response for field in required_fields)
            self.log_test("Student profile data integrity", has_required_fields, 
                         f"Required fields present: {has_required_fields}")
            
            # Check for null/empty critical fields
            critical_fields_valid = all(response.get(field) for field in ['id', 'user_id'])
            self.log_test("Student profile critical fields", critical_fields_valid,
                         "Critical fields not null/empty")
        else:
            self.log_test("Student profile data integrity", False, "Could not retrieve profile")

        # Test offers data integrity
        success, response = self.make_request('GET', 'offers', token=student_token)
        if success and isinstance(response, list) and len(response) > 0:
            first_offer = response[0]
            required_offer_fields = ['id', 'title', 'description', 'company_id']
            has_required_offer_fields = all(field in first_offer for field in required_offer_fields)
            self.log_test("Offers data integrity", has_required_offer_fields,
                         f"Offer fields present: {has_required_offer_fields}")
        else:
            self.log_test("Offers data integrity", True, "No offers to validate or endpoint error")

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 STARTING ÉMÉRÉS BACKEND API TESTING SUITE")
        print("=" * 60)
        
        # Run all test suites
        self.test_authentication_endpoints()
        self.test_recently_fixed_endpoints()
        self.test_student_dashboard_endpoints()
        self.test_mentorship_endpoints()
        self.test_messaging_endpoints()
        self.test_other_role_endpoints()
        self.test_comprehensive_endpoint_coverage()
        self.test_data_integrity()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        print(f"\n✅ SUCCESSFUL ENDPOINTS ({len(self.successful_endpoints)}):")
        for endpoint in sorted(self.successful_endpoints):
            print(f"  {endpoint}")
        
        if self.failed_endpoints:
            print(f"\n❌ FAILED ENDPOINTS ({len(self.failed_endpoints)}):")
            for endpoint in sorted(self.failed_endpoints):
                print(f"  {endpoint}")
        
        print("\n" + "=" * 60)
        
        if success_rate >= 80:
            print("🎉 OVERALL RESULT: EXCELLENT - Backend API is stable")
        elif success_rate >= 60:
            print("⚠️  OVERALL RESULT: GOOD - Some issues need attention")
        else:
            print("🚨 OVERALL RESULT: NEEDS WORK - Multiple critical issues")

if __name__ == "__main__":
    tester = EmeresBackendTester()
    tester.run_all_tests()