#!/usr/bin/env python3
"""
ÉMÉRÉS Final Regression Test - Post Visual Corrections
Focused test to verify backend stability after frontend color palette changes
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class EmeresFinalRegressionTest:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.critical_issues = []
        self.minor_issues = []

    def log_test(self, name: str, success: bool, details: str = "", is_critical: bool = True):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅"
        else:
            status = "❌"
            if is_critical:
                self.critical_issues.append(f"{name}: {details}")
            else:
                self.minor_issues.append(f"{name}: {details}")
        
        result = f"{status} {name}"
        if details:
            result += f" | {details}"
        
        print(result)
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

    def authenticate_users(self):
        """Authenticate all user types"""
        print("🔐 AUTHENTICATION REGRESSION TEST")
        print("=" * 50)
        
        test_users = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]

        for user_data in test_users:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": user_data["email"], "password": user_data["password"]})
            
            if success and isinstance(response, dict):
                self.tokens[user_data['role']] = response.get('access_token')
                self.users[user_data['role']] = response.get('user', {})
                self.log_test(f"Login {user_data['role']}", True, "Authentication successful")
            else:
                self.log_test(f"Login {user_data['role']}", False, str(response))

    def test_critical_endpoints(self):
        """Test critical endpoints that must work"""
        print("\n🎯 CRITICAL ENDPOINTS REGRESSION TEST")
        print("=" * 50)
        
        # Test dashboards (core functionality)
        dashboard_tests = [
            ("student", "student/dashboard/stats"),
            ("mentor", "mentor/dashboard"),
            ("company", "company/dashboard"),
            ("institution", "institution/dashboard")
        ]

        for role, endpoint in dashboard_tests:
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                self.log_test(f"Dashboard {role}", success, 
                             f"{len(response.keys()) if success and isinstance(response, dict) else 0} fields" if success else str(response))

        # Test profiles (core functionality)
        profile_tests = [
            ("student", "profile/student"),
            ("mentor", "profile/mentor"),
            ("company", "profile/company"),
            ("institution", "profile/institution")
        ]

        for role, endpoint in profile_tests:
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                self.log_test(f"Profile {role}", success,
                             f"{len(response.keys()) if success and isinstance(response, dict) else 0} fields" if success else str(response))

    def test_business_critical_endpoints(self):
        """Test business-critical endpoints"""
        print("\n💼 BUSINESS CRITICAL ENDPOINTS")
        print("=" * 50)
        
        # Test offers system
        success, response = self.make_request('GET', 'offers')
        self.log_test("Public offers", success,
                     f"{len(response) if success and isinstance(response, list) else 0} offers" if success else str(response))

        # Test applications system
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'applications/my', token=self.tokens['student'])
            self.log_test("Student applications", success,
                         f"{len(response) if success and isinstance(response, list) else 0} applications" if success else str(response))

        # Test credits system
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'credits/balance', token=self.tokens['student'])
            self.log_test("Credits balance", success,
                         f"{len(response.keys()) if success and isinstance(response, dict) else 0} fields" if success else str(response))

        # Test messaging system
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'messaging/threads', token=self.tokens['student'])
            self.log_test("Messaging threads", success,
                         f"{len(response) if success and isinstance(response, list) else 0} threads" if success else str(response))

        # Test contact form
        contact_data = {
            "firstName": "Test",
            "lastName": "Regression",
            "email": "test.regression@example.com",
            "message": "Regression test after visual corrections"
        }
        success, response = self.make_request('POST', 'contact', contact_data)
        self.log_test("Contact form", success, "Form processed" if success else str(response))

    def test_ai_tools_status(self):
        """Test AI tools status (non-critical for regression)"""
        print("\n🤖 AI TOOLS STATUS CHECK")
        print("=" * 50)
        
        if 'student' not in self.tokens:
            self.log_test("AI Tools Check", False, "No student token", is_critical=False)
            return

        student_token = self.tokens['student']

        # Test Coach IA session creation
        success, response = self.make_request('POST', 'ai-coach/session', 
                                             {"topic": "Test regression"}, token=student_token)
        self.log_test("Coach IA session", success, 
                     f"Session: {response.get('session_id', 'N/A')}" if success else str(response), 
                     is_critical=False)

        # Test CV Evaluator (with proper data)
        cv_data = {"cv_text": "Jean Dupont\nÉtudiant en informatique\nCompétences: Python, React"}
        success, response = self.make_request('POST', 'cv-evaluator/analyze', cv_data, token=student_token)
        self.log_test("CV Evaluator", success,
                     f"Score: {response.get('score', 'N/A')}" if success else str(response),
                     is_critical=False)

        # Test Interview IA
        interview_data = {"position": "Développeur", "level": "junior"}
        success, response = self.make_request('POST', 'interview/start', interview_data, token=student_token)
        self.log_test("Interview IA", success,
                     f"Interview: {response.get('interview_id', 'N/A')}" if success else str(response),
                     is_critical=False)

    def test_security_regression(self):
        """Test security hasn't regressed"""
        print("\n🔒 SECURITY REGRESSION TEST")
        print("=" * 50)
        
        # Test unauthorized access
        success, response = self.make_request('GET', 'profile/student', expected_status=401)
        self.log_test("Unauthorized access blocked", success, "401 returned correctly")

        # Test cross-role access
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'profile/company', 
                                                token=self.tokens['student'], expected_status=403)
            self.log_test("Cross-role access blocked", success, "403 returned correctly")

    def run_regression_test(self):
        """Run complete regression test"""
        print("🎯 ÉMÉRÉS BACKEND REGRESSION TEST - POST VISUAL CORRECTIONS")
        print("=" * 70)
        print("Objectif: Vérifier que les corrections visuelles n'ont pas cassé le backend")
        print("=" * 70)

        self.authenticate_users()
        self.test_critical_endpoints()
        self.test_business_critical_endpoints()
        self.test_ai_tools_status()
        self.test_security_regression()

        # Calculate results
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print("\n" + "=" * 70)
        print("🎯 RÉSULTATS REGRESSION TEST")
        print("=" * 70)
        print(f"📊 TESTS EXÉCUTÉS: {self.tests_run}")
        print(f"✅ TESTS RÉUSSIS: {self.tests_passed}")
        print(f"❌ TESTS ÉCHOUÉS: {self.tests_run - self.tests_passed}")
        print(f"📈 TAUX DE RÉUSSITE: {success_rate:.1f}%")
        
        print(f"\n🚨 PROBLÈMES CRITIQUES: {len(self.critical_issues)}")
        for issue in self.critical_issues:
            print(f"   • {issue}")
            
        print(f"\n⚠️  PROBLÈMES MINEURS: {len(self.minor_issues)}")
        for issue in self.minor_issues[:5]:  # Show first 5
            print(f"   • {issue}")

        print("\n🎯 CONCLUSION REGRESSION:")
        if len(self.critical_issues) == 0:
            print("✅ AUCUNE RÉGRESSION CRITIQUE détectée!")
            print("Les corrections visuelles n'ont pas impacté les fonctionnalités backend critiques.")
            if success_rate >= 90:
                print("🎉 Backend ÉMÉRÉS reste 100% opérationnel pour les fonctions critiques!")
        else:
            print(f"❌ {len(self.critical_issues)} RÉGRESSIONS CRITIQUES détectées")
            print("Les corrections visuelles ont impacté certaines fonctionnalités backend.")

        return len(self.critical_issues) == 0 and success_rate >= 90

if __name__ == "__main__":
    tester = EmeresFinalRegressionTest()
    success = tester.run_regression_test()
    sys.exit(0 if success else 1)