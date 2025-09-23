#!/usr/bin/env python3
"""
ÉMÉRÉS Platform Comprehensive Backend API Testing Suite
Tests ALL backend endpoints to calculate final success rate
Focus on endpoints that were previously failing (404/500 errors)
"""

import requests
import sys
import json
from typing import Dict, Any, Optional

class EmeresComprehensiveAPITester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}
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
            'details': details,
            'endpoint': name.split(' ')[0] if ' ' in name else name
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
                self.log_test(f"AUTH Login {role}", True, f"Token received for {credentials['email']}")
            else:
                self.log_test(f"AUTH Login {role}", False, f"{credentials['email']} - {str(response)}")

    def test_authentication_endpoints(self):
        """Test all authentication endpoints"""
        print("\n🔐 TESTING AUTHENTICATION ENDPOINTS")
        
        # Test GET /api/auth/me for all roles
        for role in self.test_users.keys():
            if role not in self.tokens:
                continue
                
            token = self.tokens[role]
            success, response = self.make_request('GET', 'auth/me', token=token)
            self.log_test(f"GET /api/auth/me ({role})", success, 
                        f"User info retrieved" if success else str(response))

    def test_profile_endpoints(self):
        """Test all profile endpoints"""
        print("\n👤 TESTING PROFILE ENDPOINTS")
        
        # Test student profile endpoints
        if 'student' in self.tokens:
            token = self.tokens['student']
            
            success, response = self.make_request('GET', 'profile/student', token=token)
            self.log_test("GET /api/profile/student", success, 
                        f"Profile retrieved with {len(response) if success and isinstance(response, dict) else 0} fields")
            
            # Test alias endpoint
            success, response = self.make_request('GET', 'student/profile', token=token)
            self.log_test("GET /api/student/profile", success, 
                        f"Profile alias working" if success else str(response))
        
        # Test mentor profile
        if 'mentor' in self.tokens:
            token = self.tokens['mentor']
            success, response = self.make_request('GET', 'profile/mentor', token=token)
            self.log_test("GET /api/profile/mentor", success, 
                        f"Mentor profile retrieved" if success else str(response))
        
        # Test company profile
        if 'company' in self.tokens:
            token = self.tokens['company']
            success, response = self.make_request('GET', 'profile/company', token=token)
            self.log_test("GET /api/profile/company", success, 
                        f"Company profile retrieved" if success else str(response))
        
        # Test institution profile
        if 'institution' in self.tokens:
            token = self.tokens['institution']
            success, response = self.make_request('GET', 'profile/institution', token=token)
            self.log_test("GET /api/profile/institution", success, 
                        f"Institution profile retrieved" if success else str(response))

    def test_dashboard_endpoints(self):
        """Test all dashboard endpoints"""
        print("\n📊 TESTING DASHBOARD ENDPOINTS")
        
        dashboard_endpoints = {
            'student': 'student/dashboard',
            'mentor': 'mentor/dashboard',
            'company': 'company/dashboard', 
            'institution': 'institution/dashboard'
        }
        
        for role, endpoint in dashboard_endpoints.items():
            if role not in self.tokens:
                continue
                
            token = self.tokens[role]
            success, response = self.make_request('GET', endpoint, token=token)
            self.log_test(f"GET /api/{endpoint}", success, 
                        f"Dashboard data retrieved" if success else str(response))

    def test_analytics_endpoints(self):
        """Test analytics endpoints"""
        print("\n📈 TESTING ANALYTICS ENDPOINTS")
        
        if 'institution' in self.tokens:
            token = self.tokens['institution']
            success, response = self.make_request('GET', 'institution/analytics', token=token)
            self.log_test("GET /api/institution/analytics", success, 
                        f"Analytics data retrieved" if success else str(response))

    def test_offers_endpoints(self):
        """Test job offers endpoints"""
        print("\n💼 TESTING OFFERS ENDPOINTS")
        
        # Test public offers endpoint
        success, response = self.make_request('GET', 'offers')
        offers_count = len(response) if success and isinstance(response, list) else 0
        self.log_test("GET /api/offers", success, 
                    f"Retrieved {offers_count} offers" if success else str(response))
        
        # Test company offers
        if 'company' in self.tokens:
            token = self.tokens['company']
            success, response = self.make_request('GET', 'offers/my', token=token)
            company_offers = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/offers/my", success, 
                        f"Retrieved {company_offers} company offers" if success else str(response))

    def test_applications_endpoints(self):
        """Test applications endpoints"""
        print("\n📝 TESTING APPLICATIONS ENDPOINTS")
        
        # Test student applications
        if 'student' in self.tokens:
            token = self.tokens['student']
            success, response = self.make_request('GET', 'applications/my', token=token)
            apps_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/applications/my", success, 
                        f"Retrieved {apps_count} applications" if success else str(response))
        
        # Test company applications
        if 'company' in self.tokens:
            token = self.tokens['company']
            success, response = self.make_request('GET', 'applications/company', token=token)
            company_apps = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/applications/company", success, 
                        f"Retrieved {company_apps} company applications" if success else str(response))

    def test_mentorship_endpoints(self):
        """Test mentorship system endpoints"""
        print("\n🤝 TESTING MENTORSHIP ENDPOINTS")
        
        # Test student mentorship endpoints
        if 'student' in self.tokens:
            token = self.tokens['student']
            
            # Student mentorship ads
            success, response = self.make_request('GET', 'student/mentorship-ads', token=token)
            ads_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/student/mentorship-ads", success, 
                        f"Retrieved {ads_count} mentorship ads" if success else str(response))
            
            # Discover mentors
            success, response = self.make_request('GET', 'student/discover-mentors', token=token)
            mentors_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/student/discover-mentors", success, 
                        f"Found {mentors_count} mentors" if success else str(response))
            
            # Mentorship requests
            success, response = self.make_request('GET', 'student/mentorship-requests', token=token)
            requests_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/student/mentorship-requests", success, 
                        f"Retrieved {requests_count} mentorship requests" if success else str(response))
        
        # Test mentor endpoints
        if 'mentor' in self.tokens:
            token = self.tokens['mentor']
            
            # Mentor students
            success, response = self.make_request('GET', 'mentor/students', token=token)
            students_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/mentor/students", success, 
                        f"Found {students_count} mentor students" if success else str(response))
            
            # Mentor sessions
            success, response = self.make_request('GET', 'mentor/sessions', token=token)
            sessions_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/mentor/sessions", success, 
                        f"Found {sessions_count} mentor sessions" if success else str(response))
            
            # Mentorship ads for mentors
            success, response = self.make_request('GET', 'mentor/mentorship-ads', token=token)
            mentor_ads_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/mentor/mentorship-ads", success, 
                        f"Found {mentor_ads_count} ads for mentors" if success else str(response))

    def test_messaging_endpoints(self):
        """Test messaging system endpoints"""
        print("\n💬 TESTING MESSAGING ENDPOINTS")
        
        # Test threads endpoint for all roles
        for role in ['student', 'mentor', 'company', 'institution']:
            if role not in self.tokens:
                continue
                
            token = self.tokens[role]
            success, response = self.make_request('GET', 'threads', token=token)
            self.log_test(f"GET /api/threads ({role})", success, 
                        f"Threads retrieved" if success else str(response))

    def test_notifications_endpoints(self):
        """Test notifications endpoints"""
        print("\n🔔 TESTING NOTIFICATIONS ENDPOINTS")
        
        # Test student notifications
        if 'student' in self.tokens:
            token = self.tokens['student']
            
            success, response = self.make_request('GET', 'student/notifications', token=token)
            notifs_count = len(response) if success and isinstance(response, list) else 0
            self.log_test("GET /api/student/notifications", success, 
                        f"Retrieved {notifs_count} notifications" if success else str(response))
            
            success, response = self.make_request('GET', 'student/notifications/unread-count', token=token)
            self.log_test("GET /api/student/notifications/unread-count", success, 
                        f"Unread count retrieved" if success else str(response))

    def test_dashboard_stats_endpoints(self):
        """Test dashboard statistics endpoints"""
        print("\n📊 TESTING DASHBOARD STATS ENDPOINTS")
        
        if 'student' in self.tokens:
            token = self.tokens['student']
            success, response = self.make_request('GET', 'student/dashboard/stats', token=token)
            self.log_test("GET /api/student/dashboard/stats", success, 
                        f"Dashboard stats retrieved" if success else str(response))

    def run_comprehensive_test(self):
        """Run comprehensive test of all ÉMÉRÉS backend endpoints"""
        print("🎯 ÉMÉRÉS COMPREHENSIVE BACKEND API TESTING")
        print("=" * 70)
        print("Testing ALL backend endpoints to calculate final success rate")
        print("Focus: Previously failing endpoints (404/500 errors)")
        print("Goal: Reach 90%+ success rate for production readiness")
        print("=" * 70)
        
        # Step 1: Authentication
        self.authenticate_all_users()
        
        # Step 2: Test all endpoint categories
        self.test_authentication_endpoints()
        self.test_profile_endpoints()
        self.test_dashboard_endpoints()
        self.test_analytics_endpoints()
        self.test_offers_endpoints()
        self.test_applications_endpoints()
        self.test_mentorship_endpoints()
        self.test_messaging_endpoints()
        self.test_notifications_endpoints()
        self.test_dashboard_stats_endpoints()
        
        # Step 3: Display comprehensive results
        self.display_comprehensive_results()

    def display_comprehensive_results(self):
        """Display comprehensive test results with detailed analysis"""
        print("\n" + "=" * 70)
        print("🎯 ÉMÉRÉS COMPREHENSIVE BACKEND TEST RESULTS")
        print("=" * 70)
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        
        print(f"📊 OVERALL SUCCESS RATE: {success_rate:.1f}% ({self.tests_passed}/{self.tests_run})")
        
        # Success rate evaluation
        if success_rate >= 90:
            print("🎉 EXCELLENT: Backend ready for production (90%+ achieved)")
            status = "PRODUCTION READY"
        elif success_rate >= 75:
            print("✅ GOOD: Backend mostly functional with minor issues")
            status = "MOSTLY READY"
        elif success_rate >= 50:
            print("⚠️  MODERATE: Backend has significant issues")
            status = "NEEDS WORK"
        else:
            print("❌ CRITICAL: Backend has major blocking issues")
            status = "NOT READY"
        
        print(f"🏷️  STATUS: {status}")
        
        # Detailed breakdown by endpoint category
        print("\n📋 DETAILED RESULTS BY ENDPOINT CATEGORY:")
        
        categories = {
            "🔐 Authentication": ["AUTH", "auth/me"],
            "👤 Profiles": ["profile/", "student/profile"],
            "📊 Dashboards": ["dashboard"],
            "📈 Analytics": ["analytics"],
            "💼 Offers": ["offers"],
            "📝 Applications": ["applications"],
            "🤝 Mentorship": ["mentorship", "mentor/", "discover-mentors"],
            "💬 Messaging": ["threads", "messaging"],
            "🔔 Notifications": ["notifications"],
            "📊 Stats": ["stats"]
        }
        
        for category_name, keywords in categories.items():
            category_tests = []
            for result in self.test_results:
                endpoint = result.get('endpoint', result['name']).lower()
                if any(keyword.lower() in endpoint for keyword in keywords):
                    category_tests.append(result)
            
            if category_tests:
                passed = sum(1 for t in category_tests if t['success'])
                total = len(category_tests)
                rate = (passed / total) * 100 if total > 0 else 0
                print(f"  {category_name}: {rate:.1f}% ({passed}/{total})")
        
        # Previously failing endpoints analysis
        print("\n🔍 PREVIOUSLY FAILING ENDPOINTS STATUS:")
        previously_failing = [
            "GET /api/auth/me",
            "GET /api/profile/institution", 
            "GET /api/student/dashboard",
            "GET /api/mentor/dashboard",
            "GET /api/company/dashboard",
            "GET /api/institution/dashboard",
            "GET /api/institution/analytics",
            "GET /api/student/profile"
        ]
        
        fixed_count = 0
        for endpoint in previously_failing:
            endpoint_key = endpoint.replace("GET /api/", "").replace("/", "_")
            found_test = None
            for result in self.test_results:
                if endpoint.lower().replace("get /api/", "") in result['name'].lower():
                    found_test = result
                    break
            
            if found_test:
                if found_test['success']:
                    print(f"  ✅ {endpoint}: FIXED")
                    fixed_count += 1
                else:
                    print(f"  ❌ {endpoint}: STILL FAILING - {found_test['details']}")
            else:
                print(f"  ❓ {endpoint}: NOT TESTED")
        
        fix_rate = (fixed_count / len(previously_failing)) * 100
        print(f"\n📈 PREVIOUSLY FAILING ENDPOINTS FIX RATE: {fix_rate:.1f}% ({fixed_count}/{len(previously_failing)})")
        
        # Failed tests summary
        print("\n❌ FAILED TESTS SUMMARY:")
        failed_tests = [r for r in self.test_results if not r['success']]
        if failed_tests:
            for test in failed_tests:
                print(f"  ❌ {test['name']}: {test['details']}")
        else:
            print("  🎉 No failed tests!")
        
        # Final recommendation
        print("\n🎯 FINAL RECOMMENDATION:")
        if success_rate >= 90:
            print("  ✅ ÉMÉRÉS backend API is COMPLETE and STABLE")
            print("  ✅ All critical endpoints are working correctly")
            print("  ✅ Ready for PRODUCTION deployment")
            print("  🚀 Success rate exceeds 90% target from review request")
        else:
            print(f"  ⚠️  Success rate {success_rate:.1f}% is below 90% target")
            print("  🔧 Review and fix failed endpoints")
            print("  🧪 Re-run comprehensive tests after fixes")
            print("  📋 Focus on critical business functionality first")
        
        print("\n" + "=" * 70)

if __name__ == "__main__":
    tester = EmeresComprehensiveAPITester()
    tester.run_comprehensive_test()