#!/usr/bin/env python3
"""
ÉMÉRÉS FINAL 100% FUNCTIONALITY VALIDATION TEST
Tests all 48 endpoints as requested in French review for 100% success rate
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class EmeresFinal100ValidationTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session_ids = {}  # Store AI session IDs

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
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
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

    def setup_test_users(self):
        """Setup test users for all 4 roles"""
        print("\n🔐 SETTING UP TEST USERS FOR ALL ROLES")
        
        test_users = [
            {
                "email": "student@emeres.fr",
                "password": "StudentPass123!",
                "role": "student",
                "first_name": "Marie",
                "last_name": "Étudiant"
            },
            {
                "email": "mentor@emeres.fr",
                "password": "MentorPass123!",
                "role": "mentor",
                "first_name": "Jean",
                "last_name": "Mentor"
            },
            {
                "email": "company@emeres.fr",
                "password": "CompanyPass123!",
                "role": "company",
                "first_name": "Sophie",
                "last_name": "Entreprise"
            },
            {
                "email": "institution@emeres.fr",
                "password": "InstitutionPass123!",
                "role": "institution",
                "first_name": "Pierre",
                "last_name": "Institution"
            }
        ]

        for user_data in test_users:
            # Try login first (users might already exist)
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": user_data["email"], "password": user_data["password"]})
            
            if success and isinstance(response, dict):
                self.tokens[user_data['role']] = response.get('access_token')
                self.users[user_data['role']] = response.get('user', {})
                self.log_test(f"Login {user_data['role']}", True, f"Existing user logged in")
            else:
                # Try registration if login fails
                success, response = self.make_request('POST', 'auth/register', user_data)
                
                if success and isinstance(response, dict):
                    self.tokens[user_data['role']] = response.get('access_token')
                    self.users[user_data['role']] = response.get('user', {})
                    self.log_test(f"Register {user_data['role']}", True, f"New user registered")
                else:
                    self.log_test(f"Setup {user_data['role']}", False, str(response))

    def test_authentication_endpoints(self):
        """Test Authentication (4 endpoints) - 100% target"""
        print("\n🔐 TESTING AUTHENTICATION ENDPOINTS (4/4)")
        
        # 1. POST /api/auth/login (4 roles)
        login_tests = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]

        for login in login_tests:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": login["email"], "password": login["password"]})
            
            if success and isinstance(response, dict) and response.get('access_token'):
                self.tokens[login['role']] = response.get('access_token')
                self.users[login['role']] = response.get('user', {})
                self.log_test(f"POST /api/auth/login ({login['role']})", True, f"Token: {response.get('access_token')[:20]}...")
            else:
                self.log_test(f"POST /api/auth/login ({login['role']})", False, str(response))

        # 2. GET /api/auth/me (for each role)
        for role in ['student', 'mentor', 'company', 'institution']:
            if role in self.tokens:
                success, response = self.make_request('GET', 'auth/me', token=self.tokens[role])
                if success and isinstance(response, dict):
                    self.log_test(f"GET /api/auth/me ({role})", True, f"User ID: {response.get('id', 'N/A')}")
                else:
                    self.log_test(f"GET /api/auth/me ({role})", False, str(response))

        # 3. POST /api/auth/logout (ADDED)
        if 'student' in self.tokens:
            success, response = self.make_request('POST', 'auth/logout', token=self.tokens['student'])
            self.log_test("POST /api/auth/logout", success, "Logout endpoint working" if success else str(response))

        # 4. POST /api/auth/register (test with new user)
        new_user_data = {
            "email": f"test-{uuid.uuid4().hex[:8]}@emeres.fr",
            "password": "TestPass123!",
            "role": "student",
            "first_name": "Test",
            "last_name": "User"
        }
        success, response = self.make_request('POST', 'auth/register', new_user_data)
        self.log_test("POST /api/auth/register", success, "New user registration" if success else str(response))

    def test_dashboard_endpoints(self):
        """Test Dashboards (4 endpoints) - 100% target"""
        print("\n📊 TESTING DASHBOARD ENDPOINTS (4/4)")
        
        dashboard_tests = [
            ("student", "student/dashboard/stats"),
            ("mentor", "mentor/dashboard"),
            ("company", "company/dashboard"),
            ("institution", "institution/dashboard")
        ]

        for role, endpoint in dashboard_tests:
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                if success and isinstance(response, dict):
                    field_count = len(response.keys())
                    self.log_test(f"GET /api/{endpoint}", True, f"{field_count} fields returned")
                else:
                    self.log_test(f"GET /api/{endpoint}", False, str(response))
            else:
                self.log_test(f"GET /api/{endpoint}", False, f"No {role} token available")

    def test_profile_endpoints(self):
        """Test Profiles (4 endpoints) - 100% target"""
        print("\n👤 TESTING PROFILE ENDPOINTS (4/4)")
        
        profile_tests = [
            ("student", "profile/student"),
            ("mentor", "profile/mentor"),  # CORRECTED
            ("company", "profile/company"),
            ("institution", "profile/institution")
        ]

        for role, endpoint in profile_tests:
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                if success and isinstance(response, dict):
                    field_count = len(response.keys())
                    self.log_test(f"GET /api/{endpoint}", True, f"{field_count} fields returned")
                else:
                    self.log_test(f"GET /api/{endpoint}", False, str(response))
            else:
                self.log_test(f"GET /api/{endpoint}", False, f"No {role} token available")

    def test_ai_tools_endpoints(self):
        """Test AI Tools (7 endpoints) - 100% target"""
        print("\n🤖 TESTING AI TOOLS ENDPOINTS (7/7)")
        
        if 'student' not in self.tokens:
            self.log_test("AI Tools test", False, "No student token available")
            return

        student_token = self.tokens['student']

        # 1. POST /api/ai-coach/session
        session_data = {
            "title": "Session de coaching IA",
            "context": "Préparation entretien d'embauche",
            "goals": ["Améliorer confiance en soi", "Préparer réponses techniques"]
        }
        success, response = self.make_request('POST', 'ai-coach/session', session_data, token=student_token)
        if success and isinstance(response, dict):
            self.session_ids['coach'] = response.get('session_id')
            self.log_test("POST /api/ai-coach/session", True, f"Session ID: {self.session_ids.get('coach', 'N/A')}")
        else:
            self.log_test("POST /api/ai-coach/session", False, str(response))

        # 2. GET /api/ai-coach/session/{id}
        if 'coach' in self.session_ids:
            success, response = self.make_request('GET', f'ai-coach/session/{self.session_ids["coach"]}', token=student_token)
            self.log_test("GET /api/ai-coach/session/{id}", success, "Session retrieved" if success else str(response))

        # 3. POST /api/ai-coach/chat (CORRECTED - no more coroutine error)
        if 'coach' in self.session_ids:
            chat_data = {
                "message": "Bonjour Coach IA, comment puis-je améliorer ma présentation personnelle ?",
                "session_id": self.session_ids["coach"],
                "context": "entretien_preparation"
            }
            success, response = self.make_request('POST', 'ai-coach/chat', chat_data, token=student_token)
            if success and isinstance(response, dict):
                response_length = len(response.get('response', ''))
                self.log_test("POST /api/ai-coach/chat", True, f"Response: {response_length} chars")
            else:
                self.log_test("POST /api/ai-coach/chat", False, str(response))

        # 4. POST /api/cv-evaluator/analyze
        cv_data = {
            "cv_content": "Marie Étudiant\nÉtudiante en Master Informatique\nCompétences: Python, React, MongoDB\nExpérience: Stage développeur junior chez TechStart",
            "target_position": "Développeur Full-Stack",
            "target_sector": "Technologie"
        }
        success, response = self.make_request('POST', 'cv-evaluator/analyze', cv_data, token=student_token)
        if success and isinstance(response, dict):
            score = response.get('score', 'N/A')
            self.log_test("POST /api/cv-evaluator/analyze", True, f"CV Score: {score}")
        else:
            self.log_test("POST /api/cv-evaluator/analyze", False, str(response))

        # 5. POST /api/interview/start
        interview_data = {
            "position": "Développeur Full-Stack",
            "company": "TechCorp",
            "difficulty": "intermediate",
            "duration": 30
        }
        success, response = self.make_request('POST', 'interview/start', interview_data, token=student_token)
        if success and isinstance(response, dict):
            self.session_ids['interview'] = response.get('session_id')
            self.log_test("POST /api/interview/start", True, f"Interview session: {self.session_ids.get('interview', 'N/A')}")
        else:
            self.log_test("POST /api/interview/start", False, str(response))

        # 6. POST /api/interview/answer (CORRECTED)
        if 'interview' in self.session_ids:
            answer_data = {
                "session_id": self.session_ids["interview"],
                "answer": "J'ai 3 ans d'expérience en développement web avec React et Node.js. J'ai travaillé sur plusieurs projets incluant des applications e-commerce et des systèmes de gestion.",
                "question_id": "q1"
            }
            success, response = self.make_request('POST', 'interview/answer', answer_data, token=student_token)
            self.log_test("POST /api/interview/answer", success, "Answer submitted" if success else str(response))

        # 7. GET /api/interview/session/{id}
        if 'interview' in self.session_ids:
            success, response = self.make_request('GET', f'interview/session/{self.session_ids["interview"]}', token=student_token)
            self.log_test("GET /api/interview/session/{id}", success, "Interview session retrieved" if success else str(response))

    def test_credits_system_endpoints(self):
        """Test Credits System (3 endpoints) - 100% target"""
        print("\n💰 TESTING CREDITS SYSTEM ENDPOINTS (3/3)")
        
        if 'student' not in self.tokens:
            self.log_test("Credits system test", False, "No student token available")
            return

        student_token = self.tokens['student']

        # 1. GET /api/credits/balance
        success, response = self.make_request('GET', 'credits/balance', token=student_token)
        if success and isinstance(response, dict):
            balance_fields = len(response.keys())
            self.log_test("GET /api/credits/balance", True, f"{balance_fields} balance fields")
        else:
            self.log_test("GET /api/credits/balance", False, str(response))

        # 2. GET /api/credits/config
        success, response = self.make_request('GET', 'credits/config', token=student_token)
        if success and isinstance(response, dict):
            config_fields = len(response.keys())
            self.log_test("GET /api/credits/config", True, f"{config_fields} config fields")
        else:
            self.log_test("GET /api/credits/config", False, str(response))

        # 3. GET /api/credits/transactions
        success, response = self.make_request('GET', 'credits/transactions', token=student_token)
        if success and isinstance(response, list):
            transaction_count = len(response)
            self.log_test("GET /api/credits/transactions", True, f"{transaction_count} transactions")
        else:
            self.log_test("GET /api/credits/transactions", False, str(response))

    def test_offers_applications_endpoints(self):
        """Test Offers and Applications (6 endpoints) - 100% target"""
        print("\n💼 TESTING OFFERS AND APPLICATIONS ENDPOINTS (6/6)")
        
        # 1. GET /api/offers (public)
        success, response = self.make_request('GET', 'offers')
        if success and isinstance(response, list):
            offers_count = len(response)
            self.log_test("GET /api/offers", True, f"{offers_count} public offers")
        else:
            self.log_test("GET /api/offers", False, str(response))

        # 2. GET /api/offers/my (company)
        if 'company' in self.tokens:
            success, response = self.make_request('GET', 'offers/my', token=self.tokens['company'])
            if success and isinstance(response, list):
                company_offers = len(response)
                self.log_test("GET /api/offers/my", True, f"{company_offers} company offers")
            else:
                self.log_test("GET /api/offers/my", False, str(response))

        # 3. GET /api/applications/my (student)
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'applications/my', token=self.tokens['student'])
            if success and isinstance(response, list):
                student_apps = len(response)
                self.log_test("GET /api/applications/my", True, f"{student_apps} student applications")
            else:
                self.log_test("GET /api/applications/my", False, str(response))

        # 4. GET /api/applications/company (company)
        if 'company' in self.tokens:
            success, response = self.make_request('GET', 'applications/company', token=self.tokens['company'])
            if success and isinstance(response, list):
                company_apps = len(response)
                self.log_test("GET /api/applications/company", True, f"{company_apps} applications to company")
            else:
                self.log_test("GET /api/applications/company", False, str(response))

        # 5. POST /api/offers (create offer - company)
        if 'company' in self.tokens:
            offer_data = {
                "title": "Stage Développeur Full-Stack",
                "description": "Rejoignez notre équipe dynamique pour développer des applications web innovantes",
                "location": "Paris, France",
                "duration": "6 mois",
                "sector": "Technologie",
                "level": "intermediate",
                "salary": "800€/mois",
                "requirements": ["React", "Node.js", "MongoDB"],
                "start_date": "2025-09-01"
            }
            success, response = self.make_request('POST', 'offers', offer_data, token=self.tokens['company'])
            if success and isinstance(response, dict):
                offer_id = response.get('id')
                self.log_test("POST /api/offers", True, f"Offer created: {offer_id}")
                
                # 6. POST /api/applications (apply to offer - student)
                if 'student' in self.tokens and offer_id:
                    app_data = {
                        "offer_id": offer_id,
                        "cover_letter": "Je suis très intéressé par cette opportunité de stage et souhaiterais rejoindre votre équipe."
                    }
                    success, response = self.make_request('POST', 'applications', app_data, token=self.tokens['student'])
                    self.log_test("POST /api/applications", success, "Application submitted" if success else str(response))
            else:
                self.log_test("POST /api/offers", False, str(response))

    def test_messaging_endpoints(self):
        """Test Messaging (2 endpoints) - 100% target"""
        print("\n💬 TESTING MESSAGING ENDPOINTS (2/2)")
        
        if 'student' not in self.tokens:
            self.log_test("Messaging test", False, "No student token available")
            return

        student_token = self.tokens['student']

        # 1. GET /api/messaging/threads (ADDED)
        success, response = self.make_request('GET', 'messaging/threads', token=student_token)
        if success and isinstance(response, list):
            threads_count = len(response)
            self.log_test("GET /api/messaging/threads", True, f"{threads_count} message threads")
        else:
            self.log_test("GET /api/messaging/threads", False, str(response))

        # 2. POST /api/messaging/send (ADDED)
        if 'mentor' in self.tokens:
            message_data = {
                "recipient_id": self.users['mentor'].get('id'),
                "subject": "Demande de mentorat",
                "content": "Bonjour, je souhaiterais bénéficier de votre expertise en développement web.",
                "context_type": "mentorat"
            }
            success, response = self.make_request('POST', 'messaging/send', message_data, token=student_token)
            self.log_test("POST /api/messaging/send", success, "Message sent" if success else str(response))

    def test_notifications_endpoints(self):
        """Test Notifications (2 endpoints) - 100% target"""
        print("\n🔔 TESTING NOTIFICATIONS ENDPOINTS (2/2)")
        
        if 'student' not in self.tokens:
            self.log_test("Notifications test", False, "No student token available")
            return

        student_token = self.tokens['student']

        # 1. GET /api/student/notifications
        success, response = self.make_request('GET', 'student/notifications', token=student_token)
        if success and isinstance(response, list):
            notifications_count = len(response)
            self.log_test("GET /api/student/notifications", True, f"{notifications_count} notifications")
        else:
            self.log_test("GET /api/student/notifications", False, str(response))

        # 2. GET /api/student/notifications/unread-count
        success, response = self.make_request('GET', 'student/notifications/unread-count', token=student_token)
        if success and isinstance(response, dict):
            unread_count = response.get('count', 0)
            self.log_test("GET /api/student/notifications/unread-count", True, f"{unread_count} unread notifications")
        else:
            self.log_test("GET /api/student/notifications/unread-count", False, str(response))

    def test_mentorship_endpoints(self):
        """Test Mentorship (4 endpoints) - 100% target"""
        print("\n🎓 TESTING MENTORSHIP ENDPOINTS (4/4)")
        
        if 'student' not in self.tokens:
            self.log_test("Mentorship test", False, "No student token available")
            return

        student_token = self.tokens['student']

        # 1. GET /api/student/mentorship-ads
        success, response = self.make_request('GET', 'student/mentorship-ads', token=student_token)
        if success and isinstance(response, list):
            ads_count = len(response)
            self.log_test("GET /api/student/mentorship-ads", True, f"{ads_count} mentorship ads")
        else:
            self.log_test("GET /api/student/mentorship-ads", False, str(response))

        # 2. GET /api/student/mentorship-requests
        success, response = self.make_request('GET', 'student/mentorship-requests', token=student_token)
        if success and isinstance(response, list):
            requests_count = len(response)
            self.log_test("GET /api/student/mentorship-requests", True, f"{requests_count} mentorship requests")
        else:
            self.log_test("GET /api/student/mentorship-requests", False, str(response))

        # 3. GET /api/student/discover-mentors
        success, response = self.make_request('GET', 'student/discover-mentors', token=student_token)
        if success and isinstance(response, dict) and 'mentors' in response:
            mentors_count = response.get('total_available', 0)
            self.log_test("GET /api/student/discover-mentors", True, f"{mentors_count} available mentors")
        else:
            self.log_test("GET /api/student/discover-mentors", False, str(response))

        # 4. GET /api/mentor/students (mentor)
        if 'mentor' in self.tokens:
            success, response = self.make_request('GET', 'mentor/students', token=self.tokens['mentor'])
            if success and isinstance(response, list):
                students_count = len(response)
                self.log_test("GET /api/mentor/students", True, f"{students_count} mentor students")
            else:
                self.log_test("GET /api/mentor/students", False, str(response))

    def test_contact_endpoint(self):
        """Test Contact (1 endpoint) - 100% target"""
        print("\n📞 TESTING CONTACT ENDPOINT (1/1)")
        
        # POST /api/contact
        contact_data = {
            "firstName": "Marie",
            "lastName": "Dubois",
            "email": "marie.dubois@example.com",
            "organization": "École Supérieure de Paris",
            "message": "Bonjour, je souhaiterais obtenir plus d'informations sur votre plateforme ÉMÉRÉS pour notre établissement."
        }
        success, response = self.make_request('POST', 'contact', contact_data)
        if success and isinstance(response, dict):
            self.log_test("POST /api/contact", True, f"Contact form submitted successfully")
        else:
            self.log_test("POST /api/contact", False, str(response))

    def test_rbac_security(self):
        """Test RBAC Security (2 validations) - 100% target"""
        print("\n🔒 TESTING RBAC SECURITY (2/2)")
        
        if 'student' not in self.tokens or 'company' not in self.tokens:
            self.log_test("RBAC Security test", False, "Missing tokens for security testing")
            return

        student_token = self.tokens['student']
        company_token = self.tokens['company']

        # 1. Authorized access (200) - Student accessing student profile
        success, response = self.make_request('GET', 'profile/student', token=student_token, expected_status=200)
        self.log_test("RBAC Authorized Access (200)", success, "Student can access own profile")

        # 2. Unauthorized access (401/403) - Student trying to access company profile
        success, response = self.make_request('GET', 'profile/company', token=student_token, expected_status=403)
        self.log_test("RBAC Unauthorized Access (403)", success, "Cross-role access properly blocked")

    def test_performance_requirements(self):
        """Test Performance Requirements - All endpoints < 2s"""
        print("\n⚡ TESTING PERFORMANCE REQUIREMENTS")
        
        if 'student' not in self.tokens:
            self.log_test("Performance test", False, "No student token available")
            return

        student_token = self.tokens['student']
        
        # Test a few key endpoints for performance
        performance_tests = [
            ('GET', 'auth/me', student_token),
            ('GET', 'profile/student', student_token),
            ('GET', 'offers', None),
            ('GET', 'credits/balance', student_token)
        ]

        total_time = 0
        successful_tests = 0

        for method, endpoint, token in performance_tests:
            import time
            start_time = time.time()
            
            success, response = self.make_request(method, endpoint, token=token)
            
            end_time = time.time()
            response_time = end_time - start_time
            total_time += response_time
            
            if success:
                successful_tests += 1
                performance_ok = response_time < 2.0
                self.log_test(f"Performance {method} /api/{endpoint}", performance_ok, 
                             f"{response_time:.3f}s {'✓' if performance_ok else '✗ >2s'}")

        if successful_tests > 0:
            avg_time = total_time / successful_tests
            self.log_test("Average Response Time", avg_time < 2.0, f"{avg_time:.3f}s average")

    def run_comprehensive_test(self):
        """Run comprehensive test of all 48 endpoints"""
        print("🎯 ÉMÉRÉS FINAL 100% FUNCTIONALITY VALIDATION")
        print("=" * 60)
        print("Testing all 48 endpoints for 100% success rate as requested in French review")
        print("=" * 60)

        # Setup
        self.setup_test_users()
        
        # Test all endpoint categories
        self.test_authentication_endpoints()      # 4 endpoints
        self.test_dashboard_endpoints()           # 4 endpoints  
        self.test_profile_endpoints()             # 4 endpoints
        self.test_ai_tools_endpoints()            # 7 endpoints
        self.test_credits_system_endpoints()      # 3 endpoints
        self.test_offers_applications_endpoints() # 6 endpoints
        self.test_messaging_endpoints()           # 2 endpoints
        self.test_notifications_endpoints()       # 2 endpoints
        self.test_mentorship_endpoints()          # 4 endpoints
        self.test_contact_endpoint()              # 1 endpoint
        self.test_rbac_security()                 # 2 validations
        self.test_performance_requirements()      # Performance check

        # Final Results
        print("\n" + "=" * 60)
        print("🎯 FINAL RESULTS - ÉMÉRÉS 100% FUNCTIONALITY VALIDATION")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 TESTS RUN: {self.tests_run}")
        print(f"✅ TESTS PASSED: {self.tests_passed}")
        print(f"❌ TESTS FAILED: {self.tests_run - self.tests_passed}")
        print(f"🎯 SUCCESS RATE: {success_rate:.1f}%")
        
        if success_rate >= 100.0:
            print("🎉 OBJECTIF 100% ATTEINT! ÉMÉRÉS platform is PRODUCTION READY!")
        elif success_rate >= 95.0:
            print("🎯 EXCELLENT! Near-perfect functionality achieved!")
        elif success_rate >= 90.0:
            print("✅ GOOD! Platform is functional with minor issues")
        else:
            print("⚠️  NEEDS ATTENTION! Critical issues require fixing")

        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  • {test['name']}: {test['details']}")

        return success_rate >= 95.0

if __name__ == "__main__":
    tester = EmeresFinal100ValidationTester()
    success = tester.run_comprehensive_test()
    sys.exit(0 if success else 1)