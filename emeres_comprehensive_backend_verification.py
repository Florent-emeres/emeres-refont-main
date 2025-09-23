#!/usr/bin/env python3
"""
ÉMÉRÉS Platform Backend API Comprehensive Verification Suite
VERIFICATION COMPLETE DE TOUT LE BACKEND ÉMÉRÉS

This test suite performs systematic verification of ALL ÉMÉRÉS backend functionality
as requested in the French review:

OBJECTIFS DE VERIFICATION:
1. Tous les endpoints API fonctionnent correctement
2. Toutes les fonctionnalités IA sont opérationnelles  
3. Tous les outils backend répondent correctement
4. Le système de crédits fonctionne parfaitement
5. Le système de messagerie est stable
6. Authentification et autorisation pour tous les rôles
7. Toutes les intégrations tiers fonctionnent
8. Performance et stabilité générale

TARGET: 95%+ success rate with performance < 2s per endpoint
"""

import requests
import sys
import json
import uuid
import time
from datetime import datetime
from typing import Dict, Any, Optional, List

class EmeresComprehensiveVerifier:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.performance_data = []
        
        # Test users for all 4 roles as specified in French review
        self.test_users = {
            "student": {
                "email": "student@emeres.fr",
                "password": "StudentPass123!",
                "role": "student",
                "first_name": "Marie",
                "last_name": "Étudiant"
            },
            "mentor": {
                "email": "mentor@emeres.fr", 
                "password": "MentorPass123!",
                "role": "mentor",
                "first_name": "Jean",
                "last_name": "Mentor"
            },
            "company": {
                "email": "company@emeres.fr",
                "password": "CompanyPass123!",
                "role": "company", 
                "first_name": "Sophie",
                "last_name": "Entreprise"
            },
            "institution": {
                "email": "institution@emeres.fr",
                "password": "InstitutionPass123!",
                "role": "institution",
                "first_name": "Pierre",
                "last_name": "Institution"
            }
        }

    def log_test(self, name: str, success: bool, details: str = "", response_time: float = 0):
        """Log test results with performance tracking"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        # Track performance
        if response_time > 0:
            self.performance_data.append({
                'endpoint': name,
                'response_time': response_time,
                'success': success
            })
            perf_info = f" ({response_time:.1f}ms)"
        else:
            perf_info = ""
        
        result = f"{status} - {name}{perf_info}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({
            'name': name,
            'success': success,
            'details': details,
            'response_time': response_time
        })
        return success

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    token: Optional[str] = None, expected_status: int = 200) -> tuple:
        """Make HTTP request with performance tracking"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        start_time = time.time()
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            else:
                return False, f"Unsupported method: {method}", 0

            response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
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
            response_time = (time.time() - start_time) * 1000
            return False, f"Request failed: {str(e)}", response_time

    def test_authentication_all_roles(self):
        """Test authentication for all 4 roles as specified in French review"""
        print("\n🔐 TESTING AUTHENTICATION ENDPOINTS - ALL 4 ROLES")
        print("   Testing: POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout, POST /api/auth/register")
        
        auth_results = []
        
        for role, user_data in self.test_users.items():
            print(f"\n👤 Testing {role.upper()} authentication")
            
            # Test 1: Login
            login_data = {
                "email": user_data["email"],
                "password": user_data["password"]
            }
            
            success, response, response_time = self.make_request('POST', 'auth/login', login_data)
            
            if success and isinstance(response, dict):
                self.tokens[role] = response.get('access_token')
                self.users[role] = response.get('user', {})
                self.log_test(f"Login {role}", True, f"Token received", response_time)
                auth_results.append(f"✅ {role} login: {response_time:.1f}ms")
                
                # Test 2: Get user info with token
                if self.tokens[role]:
                    success, me_response, me_time = self.make_request('GET', 'auth/me', token=self.tokens[role])
                    self.log_test(f"Auth/me {role}", success, 
                                f"User info retrieved" if success else str(me_response), me_time)
                    if success:
                        auth_results.append(f"✅ {role} auth/me: {me_time:.1f}ms")
                
            else:
                self.log_test(f"Login {role}", False, str(response), response_time)
                auth_results.append(f"❌ {role} login failed")
        
        # Test 3: Invalid credentials
        success, response, response_time = self.make_request('POST', 'auth/login', 
                                                           {"email": "invalid@emeres.fr", "password": "wrongpass"}, 
                                                           expected_status=401)
        self.log_test("Invalid login rejection", success, "401 returned correctly", response_time)
        
        print(f"\n📊 Authentication Summary:")
        for result in auth_results:
            print(f"   {result}")

    def test_dashboard_endpoints_all_roles(self):
        """Test dashboard endpoints for all roles as specified in French review"""
        print("\n📊 TESTING DASHBOARD ENDPOINTS - ALL ROLES")
        print("   Testing: GET /api/student/dashboard/stats, /api/mentor/dashboard, /api/company/dashboard, /api/institution/dashboard")
        
        dashboard_endpoints = {
            "student": "student/dashboard/stats",
            "mentor": "mentor/dashboard", 
            "company": "company/dashboard",
            "institution": "institution/dashboard"
        }
        
        dashboard_results = []
        
        for role, endpoint in dashboard_endpoints.items():
            if role in self.tokens:
                success, response, response_time = self.make_request('GET', endpoint, token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    field_count = len(response.keys())
                    self.log_test(f"Dashboard {role}", True, f"{field_count} fields returned", response_time)
                    dashboard_results.append(f"✅ {role}: {field_count} fields ({response_time:.1f}ms)")
                else:
                    self.log_test(f"Dashboard {role}", False, str(response), response_time)
                    dashboard_results.append(f"❌ {role}: failed")
            else:
                self.log_test(f"Dashboard {role}", False, "No token available")
                dashboard_results.append(f"❌ {role}: no token")
        
        print(f"\n📊 Dashboard Summary:")
        for result in dashboard_results:
            print(f"   {result}")

    def test_profile_endpoints_all_roles(self):
        """Test profile endpoints for all roles"""
        print("\n👥 TESTING PROFILE ENDPOINTS - ALL ROLES")
        print("   Testing: GET /api/profile/student, /api/profile/mentor, /api/profile/company, /api/profile/institution")
        
        profile_endpoints = {
            "student": "profile/student",
            "mentor": "profile/mentor",
            "company": "profile/company", 
            "institution": "profile/institution"
        }
        
        profile_results = []
        
        for role, endpoint in profile_endpoints.items():
            if role in self.tokens:
                success, response, response_time = self.make_request('GET', endpoint, token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    field_count = len(response.keys())
                    self.log_test(f"Profile {role}", True, f"{field_count} fields returned", response_time)
                    profile_results.append(f"✅ {role}: {field_count} fields ({response_time:.1f}ms)")
                else:
                    self.log_test(f"Profile {role}", False, str(response), response_time)
                    profile_results.append(f"❌ {role}: failed")
            else:
                self.log_test(f"Profile {role}", False, "No token available")
                profile_results.append(f"❌ {role}: no token")
        
        print(f"\n👥 Profile Summary:")
        for result in profile_results:
            print(f"   {result}")

    def test_ai_tools_endpoints(self):
        """Test AI tools endpoints as specified in French review"""
        print("\n🤖 TESTING AI TOOLS ENDPOINTS")
        print("   Testing: Coach IA, CV Evaluator IA, Entretien IA, and other AI endpoints")
        
        ai_endpoints = [
            ("tools/available", "GET", None, "Available AI tools"),
            ("ai-coach/session", "POST", {"message": "Bonjour Coach IA, j'ai besoin d'aide pour organiser mes révisions"}, "Coach IA session"),
            ("cv-evaluator/analyze", "POST", {"cv_text": "Expérience: Développeur Junior\nCompétences: Python, React"}, "CV Evaluator"),
            ("interview/start", "POST", {"position": "Développeur", "level": "junior"}, "Interview IA start"),
        ]
        
        ai_results = []
        
        # Use student token for AI tools testing
        student_token = self.tokens.get('student')
        
        if not student_token:
            self.log_test("AI Tools", False, "No student token available")
            return
        
        for endpoint, method, data, description in ai_endpoints:
            success, response, response_time = self.make_request(method, endpoint, data, token=student_token)
            
            if success:
                self.log_test(f"AI Tool: {description}", True, "Response received", response_time)
                ai_results.append(f"✅ {description}: {response_time:.1f}ms")
            else:
                self.log_test(f"AI Tool: {description}", False, str(response), response_time)
                ai_results.append(f"❌ {description}: failed")
        
        print(f"\n🤖 AI Tools Summary:")
        for result in ai_results:
            print(f"   {result}")

    def test_credits_system(self):
        """Test credits system endpoints as specified in French review"""
        print("\n💰 TESTING CREDITS SYSTEM")
        print("   Testing: GET /api/credits/balance, /api/credits/config, /api/credits/transactions, POST /api/credits/award-points")
        
        credits_endpoints = [
            ("credits/balance", "GET", None, "Credits balance"),
            ("credits/config", "GET", None, "Credits configuration"),
            ("credits/transactions", "GET", None, "Credits transactions"),
        ]
        
        credits_results = []
        
        # Test with student token
        student_token = self.tokens.get('student')
        
        if not student_token:
            self.log_test("Credits System", False, "No student token available")
            return
        
        for endpoint, method, data, description in credits_endpoints:
            success, response, response_time = self.make_request(method, endpoint, data, token=student_token)
            
            if success:
                if isinstance(response, dict):
                    if endpoint == "credits/balance":
                        balance_info = f"Points: {response.get('points', 'N/A')}, Credits: {response.get('credits', 'N/A')}"
                        self.log_test(f"Credits: {description}", True, balance_info, response_time)
                    else:
                        self.log_test(f"Credits: {description}", True, "Data retrieved", response_time)
                else:
                    self.log_test(f"Credits: {description}", True, "Response received", response_time)
                credits_results.append(f"✅ {description}: {response_time:.1f}ms")
            else:
                self.log_test(f"Credits: {description}", False, str(response), response_time)
                credits_results.append(f"❌ {description}: failed")
        
        # Test award points
        award_data = {
            "action_type": "daily_login",
            "points": 1,
            "description": "Connexion quotidienne"
        }
        
        success, response, response_time = self.make_request('POST', 'credits/award-points', award_data, token=student_token)
        
        if success:
            self.log_test("Credits: Award points", True, "Points awarded", response_time)
            credits_results.append(f"✅ Award points: {response_time:.1f}ms")
        else:
            self.log_test("Credits: Award points", False, str(response), response_time)
            credits_results.append(f"❌ Award points: failed")
        
        print(f"\n💰 Credits Summary:")
        for result in credits_results:
            print(f"   {result}")

    def test_offers_and_applications(self):
        """Test offers and applications endpoints"""
        print("\n💼 TESTING OFFERS AND APPLICATIONS")
        print("   Testing: GET /api/offers, /api/offers/my, /api/applications/my, /api/applications/company")
        
        offers_results = []
        
        # Test public offers
        success, response, response_time = self.make_request('GET', 'offers')
        
        if success and isinstance(response, list):
            self.log_test("Public offers", True, f"{len(response)} offers found", response_time)
            offers_results.append(f"✅ Public offers: {len(response)} offers ({response_time:.1f}ms)")
        else:
            self.log_test("Public offers", False, str(response), response_time)
            offers_results.append(f"❌ Public offers: failed")
        
        # Test company offers
        company_token = self.tokens.get('company')
        if company_token:
            success, response, response_time = self.make_request('GET', 'offers/my', token=company_token)
            
            if success and isinstance(response, list):
                self.log_test("Company offers", True, f"{len(response)} company offers", response_time)
                offers_results.append(f"✅ Company offers: {len(response)} offers ({response_time:.1f}ms)")
            else:
                self.log_test("Company offers", False, str(response), response_time)
                offers_results.append(f"❌ Company offers: failed")
        
        # Test student applications
        student_token = self.tokens.get('student')
        if student_token:
            success, response, response_time = self.make_request('GET', 'applications/my', token=student_token)
            
            if success and isinstance(response, list):
                self.log_test("Student applications", True, f"{len(response)} applications", response_time)
                offers_results.append(f"✅ Student applications: {len(response)} apps ({response_time:.1f}ms)")
            else:
                self.log_test("Student applications", False, str(response), response_time)
                offers_results.append(f"❌ Student applications: failed")
        
        # Test company applications
        if company_token:
            success, response, response_time = self.make_request('GET', 'applications/company', token=company_token)
            
            if success:
                self.log_test("Company applications", True, "Applications retrieved", response_time)
                offers_results.append(f"✅ Company applications: {response_time:.1f}ms")
            else:
                self.log_test("Company applications", False, str(response), response_time)
                offers_results.append(f"❌ Company applications: failed")
        
        print(f"\n💼 Offers & Applications Summary:")
        for result in offers_results:
            print(f"   {result}")

    def test_mentorship_system(self):
        """Test mentorship system endpoints"""
        print("\n🎓 TESTING MENTORSHIP SYSTEM")
        print("   Testing: /api/student/mentorship-ads, /api/student/mentorship-requests, /api/student/discover-mentors, /api/mentor/students")
        
        mentorship_results = []
        
        # Test student mentorship endpoints
        student_token = self.tokens.get('student')
        if student_token:
            mentorship_endpoints = [
                ("student/mentorship-ads", "Mentorship ads"),
                ("student/mentorship-requests", "Mentorship requests"),
                ("student/discover-mentors", "Discover mentors")
            ]
            
            for endpoint, description in mentorship_endpoints:
                success, response, response_time = self.make_request('GET', endpoint, token=student_token)
                
                if success:
                    if isinstance(response, list):
                        count = len(response)
                        self.log_test(f"Mentorship: {description}", True, f"{count} items", response_time)
                        mentorship_results.append(f"✅ {description}: {count} items ({response_time:.1f}ms)")
                    else:
                        self.log_test(f"Mentorship: {description}", True, "Data retrieved", response_time)
                        mentorship_results.append(f"✅ {description}: {response_time:.1f}ms")
                else:
                    self.log_test(f"Mentorship: {description}", False, str(response), response_time)
                    mentorship_results.append(f"❌ {description}: failed")
        
        # Test mentor endpoints
        mentor_token = self.tokens.get('mentor')
        if mentor_token:
            success, response, response_time = self.make_request('GET', 'mentor/students', token=mentor_token)
            
            if success:
                if isinstance(response, list):
                    count = len(response)
                    self.log_test("Mentorship: Mentor students", True, f"{count} students", response_time)
                    mentorship_results.append(f"✅ Mentor students: {count} students ({response_time:.1f}ms)")
                else:
                    self.log_test("Mentorship: Mentor students", True, "Data retrieved", response_time)
                    mentorship_results.append(f"✅ Mentor students: {response_time:.1f}ms")
            else:
                self.log_test("Mentorship: Mentor students", False, str(response), response_time)
                mentorship_results.append(f"❌ Mentor students: failed")
        
        print(f"\n🎓 Mentorship Summary:")
        for result in mentorship_results:
            print(f"   {result}")

    def test_messaging_system(self):
        """Test messaging system endpoints"""
        print("\n💬 TESTING MESSAGING SYSTEM")
        print("   Testing: GET /api/threads, GET /api/threads/{id}, POST /api/threads/{id}/messages, GET /api/messaging/inbox/*")
        
        messaging_results = []
        
        # Test with student token
        student_token = self.tokens.get('student')
        if student_token:
            # Test threads
            success, response, response_time = self.make_request('GET', 'threads', token=student_token)
            
            if success:
                if isinstance(response, dict) and 'tabs' in response:
                    tabs_count = len(response.get('tabs', []))
                    self.log_test("Messaging: Threads", True, f"{tabs_count} tabs", response_time)
                    messaging_results.append(f"✅ Threads: {tabs_count} tabs ({response_time:.1f}ms)")
                else:
                    self.log_test("Messaging: Threads", True, "Threads retrieved", response_time)
                    messaging_results.append(f"✅ Threads: {response_time:.1f}ms")
            else:
                self.log_test("Messaging: Threads", False, str(response), response_time)
                messaging_results.append(f"❌ Threads: failed")
            
            # Test inbox
            success, response, response_time = self.make_request('GET', 'messaging/inbox/student', token=student_token)
            
            if success:
                self.log_test("Messaging: Inbox", True, "Inbox accessed", response_time)
                messaging_results.append(f"✅ Inbox: {response_time:.1f}ms")
            else:
                self.log_test("Messaging: Inbox", False, str(response), response_time)
                messaging_results.append(f"❌ Inbox: failed")
            
            # Test thread creation
            thread_data = {
                "context_type": "support",
                "title": "Test Support Thread",
                "message": "Test message for support"
            }
            
            success, response, response_time = self.make_request('POST', 'messaging/threads/support/create', 
                                                               thread_data, token=student_token)
            
            if success:
                self.log_test("Messaging: Create thread", True, "Thread created", response_time)
                messaging_results.append(f"✅ Create thread: {response_time:.1f}ms")
            else:
                self.log_test("Messaging: Create thread", False, str(response), response_time)
                messaging_results.append(f"❌ Create thread: failed")
        
        print(f"\n💬 Messaging Summary:")
        for result in messaging_results:
            print(f"   {result}")

    def test_notifications_system(self):
        """Test notifications system endpoints"""
        print("\n🔔 TESTING NOTIFICATIONS SYSTEM")
        print("   Testing: GET /api/student/notifications, GET /api/student/notifications/unread-count")
        
        notifications_results = []
        
        # Test with student token
        student_token = self.tokens.get('student')
        if student_token:
            # Test notifications
            success, response, response_time = self.make_request('GET', 'student/notifications', token=student_token)
            
            if success:
                if isinstance(response, list):
                    count = len(response)
                    self.log_test("Notifications: List", True, f"{count} notifications", response_time)
                    notifications_results.append(f"✅ Notifications: {count} items ({response_time:.1f}ms)")
                else:
                    self.log_test("Notifications: List", True, "Notifications retrieved", response_time)
                    notifications_results.append(f"✅ Notifications: {response_time:.1f}ms")
            else:
                self.log_test("Notifications: List", False, str(response), response_time)
                notifications_results.append(f"❌ Notifications: failed")
            
            # Test unread count
            success, response, response_time = self.make_request('GET', 'student/notifications/unread-count', token=student_token)
            
            if success:
                if isinstance(response, dict) and 'count' in response:
                    count = response.get('count', 0)
                    self.log_test("Notifications: Unread count", True, f"{count} unread", response_time)
                    notifications_results.append(f"✅ Unread count: {count} ({response_time:.1f}ms)")
                else:
                    self.log_test("Notifications: Unread count", True, "Count retrieved", response_time)
                    notifications_results.append(f"✅ Unread count: {response_time:.1f}ms")
            else:
                self.log_test("Notifications: Unread count", False, str(response), response_time)
                notifications_results.append(f"❌ Unread count: failed")
        
        print(f"\n🔔 Notifications Summary:")
        for result in notifications_results:
            print(f"   {result}")

    def test_contact_support(self):
        """Test contact and support endpoints"""
        print("\n📞 TESTING CONTACT & SUPPORT")
        print("   Testing: POST /api/contact")
        
        contact_data = {
            "firstName": "Jean",
            "lastName": "Testeur",
            "email": "jean.testeur@example.com",
            "organization": "ÉMÉRÉS Testing",
            "message": "Test de vérification complète du système de contact ÉMÉRÉS. Ce message teste la fonctionnalité de contact dans le cadre de la review française."
        }
        
        success, response, response_time = self.make_request('POST', 'contact', contact_data)
        
        if success:
            if isinstance(response, dict) and response.get('success'):
                self.log_test("Contact form", True, "Message sent successfully", response_time)
            else:
                self.log_test("Contact form", True, "Response received", response_time)
        else:
            self.log_test("Contact form", False, str(response), response_time)

    def test_rbac_security(self):
        """Test Role-Based Access Control security"""
        print("\n🔒 TESTING RBAC SECURITY")
        print("   Testing role-based permissions and security")
        
        security_results = []
        
        # Test cross-role access restrictions
        if 'student' in self.tokens and 'company' in self.tokens:
            # Student trying to access company dashboard (should fail)
            success, response, response_time = self.make_request('GET', 'company/dashboard', 
                                                               token=self.tokens['student'], expected_status=403)
            
            if success:
                self.log_test("RBAC: Student->Company denied", True, "Access properly denied", response_time)
                security_results.append("✅ Student->Company access denied")
            else:
                self.log_test("RBAC: Student->Company denied", False, "Access not properly denied", response_time)
                security_results.append("❌ Student->Company access not denied")
            
            # Company trying to access student dashboard (should fail)
            success, response, response_time = self.make_request('GET', 'student/dashboard/stats', 
                                                               token=self.tokens['company'], expected_status=403)
            
            if success:
                self.log_test("RBAC: Company->Student denied", True, "Access properly denied", response_time)
                security_results.append("✅ Company->Student access denied")
            else:
                self.log_test("RBAC: Company->Student denied", False, "Access not properly denied", response_time)
                security_results.append("❌ Company->Student access not denied")
        
        # Test unauthorized access (no token)
        success, response, response_time = self.make_request('GET', 'student/dashboard/stats', expected_status=401)
        
        if success:
            self.log_test("RBAC: Unauthorized access denied", True, "401 returned correctly", response_time)
            security_results.append("✅ Unauthorized access denied")
        else:
            self.log_test("RBAC: Unauthorized access denied", False, "Unauthorized access not denied", response_time)
            security_results.append("❌ Unauthorized access not denied")
        
        print(f"\n🔒 RBAC Security Summary:")
        for result in security_results:
            print(f"   {result}")

    def test_performance_analysis(self):
        """Analyze performance data"""
        print("\n⚡ PERFORMANCE ANALYSIS")
        print("   Target: < 2000ms per endpoint")
        
        if not self.performance_data:
            print("   No performance data available")
            return
        
        # Calculate statistics
        response_times = [p['response_time'] for p in self.performance_data if p['response_time'] > 0]
        
        if response_times:
            avg_time = sum(response_times) / len(response_times)
            max_time = max(response_times)
            min_time = min(response_times)
            
            # Count endpoints over 2s threshold
            slow_endpoints = [p for p in self.performance_data if p['response_time'] > 2000]
            
            print(f"   📊 Average response time: {avg_time:.1f}ms")
            print(f"   📊 Fastest endpoint: {min_time:.1f}ms")
            print(f"   📊 Slowest endpoint: {max_time:.1f}ms")
            print(f"   📊 Endpoints over 2s: {len(slow_endpoints)}/{len(response_times)}")
            
            if slow_endpoints:
                print("   ⚠️  Slow endpoints:")
                for endpoint in slow_endpoints:
                    print(f"      - {endpoint['endpoint']}: {endpoint['response_time']:.1f}ms")
            
            # Performance score
            performance_score = (len(response_times) - len(slow_endpoints)) / len(response_times) * 100
            self.log_test("Performance analysis", performance_score >= 90, 
                         f"Performance score: {performance_score:.1f}%")

    def run_comprehensive_verification(self):
        """Run complete ÉMÉRÉS backend verification"""
        print("🚀 STARTING ÉMÉRÉS COMPREHENSIVE BACKEND VERIFICATION")
        print("=" * 80)
        print("VERIFICATION COMPLETE DE TOUT LE BACKEND ÉMÉRÉS")
        print("Target: 95%+ success rate with performance < 2s per endpoint")
        print("=" * 80)
        
        start_time = time.time()
        
        # Run all test suites
        self.test_authentication_all_roles()
        self.test_dashboard_endpoints_all_roles()
        self.test_profile_endpoints_all_roles()
        self.test_ai_tools_endpoints()
        self.test_credits_system()
        self.test_offers_and_applications()
        self.test_mentorship_system()
        self.test_messaging_system()
        self.test_notifications_system()
        self.test_contact_support()
        self.test_rbac_security()
        self.test_performance_analysis()
        
        # Calculate final results
        total_time = time.time() - start_time
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print("\n" + "=" * 80)
        print("🎯 FINAL VERIFICATION RESULTS")
        print("=" * 80)
        print(f"📊 Tests run: {self.tests_run}")
        print(f"✅ Tests passed: {self.tests_passed}")
        print(f"❌ Tests failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success rate: {success_rate:.1f}%")
        print(f"⏱️  Total time: {total_time:.1f}s")
        
        # Determine overall status
        if success_rate >= 95:
            status = "🎉 EXCELLENT - TARGET ACHIEVED"
            color = "✅"
        elif success_rate >= 90:
            status = "👍 VERY GOOD - NEAR TARGET"
            color = "✅"
        elif success_rate >= 80:
            status = "⚠️  GOOD - NEEDS IMPROVEMENT"
            color = "⚠️"
        else:
            status = "❌ NEEDS ATTENTION"
            color = "❌"
        
        print(f"\n{color} OVERALL STATUS: {status}")
        print(f"📋 Success Rate: {success_rate:.1f}% (Target: 95%+)")
        
        # Performance summary
        if self.performance_data:
            response_times = [p['response_time'] for p in self.performance_data if p['response_time'] > 0]
            if response_times:
                avg_time = sum(response_times) / len(response_times)
                slow_count = len([t for t in response_times if t > 2000])
                print(f"⚡ Performance: {avg_time:.1f}ms average, {slow_count} endpoints > 2s")
        
        print("=" * 80)
        
        return success_rate >= 95

if __name__ == "__main__":
    print("ÉMÉRÉS Backend Comprehensive Verification Suite")
    print("Systematic verification of ALL backend functionality")
    
    verifier = EmeresComprehensiveVerifier()
    success = verifier.run_comprehensive_verification()
    
    if success:
        print("\n🎉 VERIFICATION COMPLETE - BACKEND ÉMÉRÉS IS PRODUCTION READY!")
        sys.exit(0)
    else:
        print("\n⚠️  VERIFICATION COMPLETE - SOME ISSUES FOUND")
        sys.exit(1)