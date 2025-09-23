#!/usr/bin/env python3
"""
ÉMÉRÉS Focused Re-Test - Key Corrections Verification
Focus on the 3 main corrections mentioned in the French review:
1. ✅ Endpoint /api/profile/mentor added
2. ✅ AI tools endpoints added
3. ✅ RBAC security reinforced
"""

import requests
import json
import time

class FocusedRetest:
    def __init__(self):
        self.base_url = "https://emeres-ui-enhance.preview.emergentagent.com"
        self.api_url = f"{self.base_url}/api"
        self.tokens = {}
        self.tests_passed = 0
        self.tests_run = 0

    def log_test(self, name: str, success: bool, details: str = ""):
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
        return success

    def make_request(self, method: str, endpoint: str, data=None, token=None, expected_status=200):
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            
            success = response.status_code == expected_status
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                return False, f"Status {response.status_code}, expected {expected_status}"
        except Exception as e:
            return False, f"Request failed: {str(e)}"

    def authenticate_users(self):
        """Authenticate test users"""
        print("🔐 AUTHENTICATION SETUP")
        
        # Try to login with existing users
        test_users = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]
        
        for user in test_users:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": user["email"], "password": user["password"]})
            
            if success and isinstance(response, dict) and response.get('access_token'):
                self.tokens[user['role']] = response.get('access_token')
                self.log_test(f"Auth {user['role']}", True, "Token obtained")
            else:
                self.log_test(f"Auth {user['role']}", False, str(response))

    def test_mentor_profile_endpoint(self):
        """Test the corrected /api/profile/mentor endpoint"""
        print("\n👤 CORRECTION 1: /api/profile/mentor ENDPOINT")
        
        if 'mentor' not in self.tokens:
            self.log_test("Mentor profile test", False, "No mentor token available")
            return
        
        mentor_token = self.tokens['mentor']
        
        # Test GET /api/profile/mentor with mentor token
        success, response = self.make_request('GET', 'profile/mentor', token=mentor_token)
        
        if success and isinstance(response, dict):
            field_count = len(response.keys())
            self.log_test("✅ CORRECTION: /api/profile/mentor", True, 
                         f"Endpoint accessible - {field_count} champs retournés")
        else:
            self.log_test("❌ RÉGRESSION: /api/profile/mentor", False, 
                         f"Endpoint toujours manquant: {str(response)}")
        
        # Test RBAC - student should NOT access mentor profile
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'profile/mentor', 
                                                 token=self.tokens['student'], expected_status=403)
            self.log_test("✅ RBAC: Student->Mentor profile denied", success,
                         "403 Forbidden" if success else "Access not protected")

    def test_ai_tools_endpoints(self):
        """Test the corrected AI tools endpoints"""
        print("\n🤖 CORRECTION 2: AI TOOLS ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("AI tools test", False, "No student token available")
            return
        
        student_token = self.tokens['student']
        
        # Test 1: Coach IA endpoints
        print("  🎓 Testing Coach IA System")
        
        # Check if tools are available
        success, response = self.make_request('GET', 'tools/available', token=student_token)
        if success and isinstance(response, list):
            coach_ia_available = any(tool.get('name') == 'Coach IA Études' for tool in response)
            self.log_test("✅ Coach IA Available", coach_ia_available,
                         "Coach IA dans la liste des outils" if coach_ia_available else "Coach IA non trouvé")
        
        # Test Coach IA session creation
        coach_data = {
            "tool_type": "coach_ia",
            "context": "etudes"
        }
        success, response = self.make_request('POST', 'tools/coach-ia/session', coach_data, token=student_token)
        if success and isinstance(response, dict):
            session_id = response.get('session_id')
            self.log_test("✅ CORRECTION: Coach IA Session", True, f"Session créée: {session_id}")
            
            # Test chat if session created
            if session_id:
                chat_data = {"message": "Bonjour Coach IA, j'ai besoin d'aide"}
                success, chat_response = self.make_request('POST', f'tools/coach-ia/chat/{session_id}', 
                                                         chat_data, token=student_token)
                self.log_test("✅ CORRECTION: Coach IA Chat", success,
                             "Chat fonctionnel" if success else str(chat_response))
        else:
            self.log_test("❌ RÉGRESSION: Coach IA Session", False, str(response))
        
        # Test 2: CV Evaluator IA
        print("  📄 Testing CV Evaluator IA")
        cv_data = {
            "cv_content": "Marie Dubois\nÉtudiante Master Informatique\nPython, React, MongoDB",
            "target_position": "Stage Développeur"
        }
        success, response = self.make_request('POST', 'cv-evaluator/analyze', cv_data, token=student_token)
        if success and isinstance(response, dict):
            self.log_test("✅ CORRECTION: CV Evaluator IA", True, 
                         f"Analyse réussie - Score: {response.get('overall_score', 'N/A')}")
        else:
            self.log_test("❌ RÉGRESSION: CV Evaluator IA", False, str(response))
        
        # Test 3: Interview IA
        print("  🎤 Testing Interview IA")
        interview_data = {
            "job_title": "Développeur Full-Stack",
            "company_sector": "Technologie"
        }
        success, response = self.make_request('POST', 'interview/start', interview_data, token=student_token)
        if success and isinstance(response, dict):
            interview_id = response.get('interview_id')
            self.log_test("✅ CORRECTION: Interview IA", True, f"Entretien démarré: {interview_id}")
        else:
            self.log_test("❌ RÉGRESSION: Interview IA", False, str(response))

    def test_rbac_security_reinforced(self):
        """Test the reinforced RBAC security"""
        print("\n🔒 CORRECTION 3: RBAC SECURITY REINFORCED")
        
        # Test 1: Unauthorized access (no token) should return 401
        success, response = self.make_request('GET', 'profile/student', expected_status=401)
        self.log_test("✅ RBAC: No token -> 401", success, "Unauthorized access blocked")
        
        # Test 2: Invalid token should return 401
        success, response = self.make_request('GET', 'profile/student', 
                                             token="invalid-token", expected_status=401)
        self.log_test("✅ RBAC: Invalid token -> 401", success, "Invalid token rejected")
        
        # Test 3: Cross-role access should return 403
        if 'student' in self.tokens and 'company' in self.tokens:
            # Student trying to access company dashboard
            success, response = self.make_request('GET', 'company/dashboard', 
                                                 token=self.tokens['student'], expected_status=403)
            self.log_test("✅ RBAC: Student->Company dashboard -> 403", success, 
                         "Cross-role access blocked")
            
            # Company trying to access student dashboard  
            success, response = self.make_request('GET', 'student/dashboard/stats', 
                                                 token=self.tokens['company'], expected_status=403)
            self.log_test("✅ RBAC: Company->Student dashboard -> 403", success,
                         "Cross-role access blocked")
        
        # Test 4: Correct role access should work (200)
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'profile/student', token=self.tokens['student'])
            self.log_test("✅ RBAC: Student->Student profile -> 200", success,
                         "Correct role access allowed")

    def run_focused_test(self):
        """Run the focused re-test"""
        print("🎯 ÉMÉRÉS FOCUSED RE-TEST - KEY CORRECTIONS VERIFICATION")
        print("=" * 70)
        print("Focus: 3 corrections principales mentionnées dans la review française")
        print("=" * 70)
        
        self.authenticate_users()
        self.test_mentor_profile_endpoint()
        self.test_ai_tools_endpoints()
        self.test_rbac_security_reinforced()
        
        # Results
        print("\n" + "=" * 70)
        print("🎯 RÉSULTATS FOCUSED RE-TEST")
        print("=" * 70)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 Tests: {self.tests_run} | Réussis: {self.tests_passed} | Taux: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 CORRECTIONS PRINCIPALES VALIDÉES!")
        elif success_rate >= 70:
            print("⚠️ CORRECTIONS PARTIELLEMENT VALIDÉES")
        else:
            print("❌ CORRECTIONS NON VALIDÉES - PROBLÈMES PERSISTANTS")
        
        return success_rate

if __name__ == "__main__":
    tester = FocusedRetest()
    tester.run_focused_test()