#!/usr/bin/env python3
"""
ÉMÉRÉS Platform Backend API Comprehensive Re-Test Suite
RE-TEST COMPLET POUR VALIDATION 100% - ÉMÉRÉS BACKEND VERIFICATION

Tests all previously identified issues that were corrected:
1. ✅ Endpoint /api/profile/mentor added
2. ✅ AI tools endpoints added (Coach IA, CV Evaluator, Interview IA)  
3. ✅ RBAC security reinforced

TARGET: 100% success rate - no failed tests
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import time

class EmeresComprehensiveRetest:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.failed_tests = []
        self.start_time = time.time()

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
            self.failed_tests.append({
                'name': name,
                'details': details
            })
        
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
            start_time = time.time()
            
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            else:
                return False, f"Unsupported method: {method}"

            response_time = (time.time() - start_time) * 1000  # Convert to ms
            
            success = response.status_code == expected_status
            
            if success:
                try:
                    json_response = response.json()
                    return True, json_response
                except:
                    return True, response.text
            else:
                error_msg = f"Status {response.status_code}, expected {expected_status} ({response_time:.1f}ms)"
                try:
                    error_detail = response.json().get('detail', '')
                    if error_detail:
                        error_msg += f" - {error_detail}"
                except:
                    pass
                return False, error_msg

        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}"

    def test_authentication_complete_4_roles(self):
        """Test complete authentication for all 4 roles as requested"""
        print("\n🔐 PHASE 1: AUTHENTIFICATION COMPLÈTE (4 RÔLES)")
        
        # Test users with realistic French data
        test_users = [
            {
                "email": "etudiant@emeres.fr",
                "password": "EtudiantPass123!",
                "role": "student",
                "first_name": "Marie",
                "last_name": "Dubois"
            },
            {
                "email": "mentor@emeres.fr", 
                "password": "MentorPass123!",
                "role": "mentor",
                "first_name": "Jean",
                "last_name": "Martin"
            },
            {
                "email": "entreprise@emeres.fr",
                "password": "EntreprisePass123!",
                "role": "company",
                "first_name": "Sophie",
                "last_name": "Laurent"
            },
            {
                "email": "institution@emeres.fr",
                "password": "InstitutionPass123!",
                "role": "institution",
                "first_name": "Pierre",
                "last_name": "Durand"
            }
        ]

        for user_data in test_users:
            # Try login first (users might already exist)
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": user_data["email"], "password": user_data["password"]})
            
            if success and isinstance(response, dict) and response.get('access_token'):
                self.tokens[user_data['role']] = response.get('access_token')
                self.users[user_data['role']] = response.get('user', {})
                self.log_test(f"Authentification {user_data['role']}", True, 
                             f"Login réussi - Token reçu")
            else:
                # Try registration if login fails
                success, response = self.make_request('POST', 'auth/register', user_data)
                
                if success and isinstance(response, dict) and response.get('access_token'):
                    self.tokens[user_data['role']] = response.get('access_token')
                    self.users[user_data['role']] = response.get('user', {})
                    self.log_test(f"Authentification {user_data['role']}", True, 
                                 f"Inscription réussie - Token reçu")
                else:
                    self.log_test(f"Authentification {user_data['role']}", False, 
                                 f"Échec login/inscription: {str(response)}")

    def test_all_dashboards(self):
        """Test all dashboard endpoints for all roles"""
        print("\n📊 PHASE 2: TOUS LES DASHBOARDS")
        
        dashboard_endpoints = {
            'student': 'student/dashboard/stats',
            'mentor': 'mentor/dashboard', 
            'company': 'company/dashboard',
            'institution': 'institution/dashboard'
        }
        
        for role, endpoint in dashboard_endpoints.items():
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    field_count = len(response.keys())
                    self.log_test(f"Dashboard {role}", True, 
                                 f"{field_count} champs retournés - Données structurées")
                else:
                    self.log_test(f"Dashboard {role}", False, str(response))
            else:
                self.log_test(f"Dashboard {role}", False, "Token non disponible")

    def test_all_profiles(self):
        """Test all profile endpoints including the corrected /api/profile/mentor"""
        print("\n👤 PHASE 3: TOUS LES PROFILS (CORRECTION /api/profile/mentor)")
        
        profile_endpoints = {
            'student': 'profile/student',
            'mentor': 'profile/mentor',  # ✅ Previously missing - should now work
            'company': 'profile/company',
            'institution': 'profile/institution'
        }
        
        for role, endpoint in profile_endpoints.items():
            if role in self.tokens:
                success, response = self.make_request('GET', endpoint, token=self.tokens[role])
                
                if success and isinstance(response, dict):
                    field_count = len(response.keys())
                    self.log_test(f"Profil {role}", True, 
                                 f"{field_count} champs - Profil accessible")
                    
                    # Special verification for mentor profile (previously missing)
                    if role == 'mentor':
                        self.log_test("✅ CORRECTION: /api/profile/mentor", True, 
                                     "Endpoint précédemment manquant maintenant fonctionnel")
                else:
                    self.log_test(f"Profil {role}", False, str(response))
                    
                    # Special tracking for mentor profile failure
                    if role == 'mentor':
                        self.log_test("❌ RÉGRESSION: /api/profile/mentor", False, 
                                     "Endpoint toujours manquant - Correction non appliquée")
            else:
                self.log_test(f"Profil {role}", False, "Token non disponible")

    def test_ai_tools_complete(self):
        """Test all AI tools endpoints that were previously missing"""
        print("\n🤖 PHASE 4: OUTILS IA COMPLETS (CORRECTIONS APPLIQUÉES)")
        
        if 'student' not in self.tokens:
            self.log_test("Outils IA", False, "Token étudiant non disponible")
            return
            
        student_token = self.tokens['student']
        
        # Test 1: Coach IA System
        print("\n🎓 Testing Coach IA System")
        
        # Create Coach IA session
        coach_session_data = {
            "tool_type": "coach_ia",
            "context": "etudes",
            "initial_message": "Bonjour Coach IA, j'ai besoin d'aide pour organiser mes révisions"
        }
        
        success, response = self.make_request('POST', 'ai-coach/session', coach_session_data, token=student_token)
        if success and isinstance(response, dict):
            session_id = response.get('session_id')
            self.log_test("✅ CORRECTION: Coach IA Session", True, 
                         f"Session créée: {session_id}")
            
            # Test chat with Coach IA
            if session_id:
                chat_data = {
                    "message": "Comment puis-je mieux organiser mon temps d'étude?",
                    "context": "organisation_etudes"
                }
                
                success, chat_response = self.make_request('POST', f'ai-coach/chat/{session_id}', 
                                                         chat_data, token=student_token)
                self.log_test("✅ CORRECTION: Coach IA Chat", success, 
                             "Chat fonctionnel" if success else str(chat_response))
                
                # Get session details
                success, session_response = self.make_request('GET', f'ai-coach/session/{session_id}', 
                                                            token=student_token)
                self.log_test("✅ CORRECTION: Coach IA Session Details", success,
                             "Détails session accessibles" if success else str(session_response))
        else:
            self.log_test("❌ RÉGRESSION: Coach IA Session", False, str(response))
        
        # Test 2: CV Evaluator IA
        print("\n📄 Testing CV Evaluator IA")
        
        cv_data = {
            "cv_content": "Marie Dubois\nÉtudiante en Master Informatique\nCompétences: Python, React, MongoDB",
            "target_position": "Stage Développeur Full-Stack",
            "target_sector": "Technologie"
        }
        
        success, response = self.make_request('POST', 'cv-evaluator/analyze', cv_data, token=student_token)
        if success and isinstance(response, dict):
            self.log_test("✅ CORRECTION: CV Evaluator IA", True, 
                         f"Analyse CV réussie - Score: {response.get('score', 'N/A')}")
        else:
            self.log_test("❌ RÉGRESSION: CV Evaluator IA", False, str(response))
        
        # Test 3: Interview IA System
        print("\n🎤 Testing Interview IA System")
        
        interview_data = {
            "position": "Développeur Full-Stack",
            "company_sector": "Technologie",
            "interview_type": "technique",
            "difficulty_level": "intermediate"
        }
        
        success, response = self.make_request('POST', 'interview/start', interview_data, token=student_token)
        if success and isinstance(response, dict):
            interview_id = response.get('interview_id')
            self.log_test("✅ CORRECTION: Interview IA Start", True, 
                         f"Entretien démarré: {interview_id}")
            
            if interview_id:
                # Submit answer
                answer_data = {
                    "question_id": response.get('first_question_id', 'q1'),
                    "answer": "Je pense que React est un excellent framework pour créer des interfaces utilisateur dynamiques..."
                }
                
                success, answer_response = self.make_request('POST', 'interview/answer', 
                                                           answer_data, token=student_token)
                self.log_test("✅ CORRECTION: Interview IA Answer", success,
                             "Réponse soumise" if success else str(answer_response))
                
                # Get interview session
                success, session_response = self.make_request('GET', f'interview/session/{interview_id}', 
                                                            token=student_token)
                self.log_test("✅ CORRECTION: Interview IA Session", success,
                             "Session entretien accessible" if success else str(session_response))
        else:
            self.log_test("❌ RÉGRESSION: Interview IA Start", False, str(response))

    def test_credits_system(self):
        """Test credits system functionality"""
        print("\n💰 PHASE 5: SYSTÈME DE CRÉDITS")
        
        if 'student' not in self.tokens:
            self.log_test("Système crédits", False, "Token étudiant non disponible")
            return
            
        student_token = self.tokens['student']
        
        # Test credits balance
        success, response = self.make_request('GET', 'credits/balance', token=student_token)
        if success and isinstance(response, dict):
            balance = response.get('balance', 0)
            credits = response.get('credits', 0)
            self.log_test("Solde crédits", True, f"Balance: {balance} points, {credits} crédits")
        else:
            self.log_test("Solde crédits", False, str(response))
        
        # Test credits configuration
        success, response = self.make_request('GET', 'credits/config', token=student_token)
        self.log_test("Configuration crédits", success, 
                     "Configuration accessible" if success else str(response))
        
        # Test credits transactions
        success, response = self.make_request('GET', 'credits/transactions', token=student_token)
        if success and isinstance(response, list):
            self.log_test("Historique transactions", True, f"{len(response)} transactions")
        else:
            self.log_test("Historique transactions", False, str(response))
        
        # Test award points
        award_data = {
            "action": "daily_login",
            "points": 1
        }
        success, response = self.make_request('POST', 'credits/award-points', award_data, token=student_token)
        self.log_test("Attribution points", success, 
                     "Points attribués" if success else str(response))

    def test_offers_and_applications(self):
        """Test offers and applications system"""
        print("\n💼 PHASE 6: OFFRES ET CANDIDATURES")
        
        # Test public offers
        success, response = self.make_request('GET', 'offers')
        if success and isinstance(response, list):
            self.log_test("Offres publiques", True, f"{len(response)} offres disponibles")
        else:
            self.log_test("Offres publiques", False, str(response))
        
        # Test company offers
        if 'company' in self.tokens:
            success, response = self.make_request('GET', 'offers/my', token=self.tokens['company'])
            if success and isinstance(response, list):
                self.log_test("Offres entreprise", True, f"{len(response)} offres entreprise")
            else:
                self.log_test("Offres entreprise", False, str(response))
        
        # Test student applications
        if 'student' in self.tokens:
            success, response = self.make_request('GET', 'applications/my', token=self.tokens['student'])
            if success and isinstance(response, list):
                self.log_test("Candidatures étudiant", True, f"{len(response)} candidatures")
            else:
                self.log_test("Candidatures étudiant", False, str(response))

    def test_mentorship_system(self):
        """Test mentorship system functionality"""
        print("\n🤝 PHASE 7: SYSTÈME DE MENTORAT")
        
        if 'student' in self.tokens:
            student_token = self.tokens['student']
            
            # Test mentorship ads
            success, response = self.make_request('GET', 'student/mentorship-ads', token=student_token)
            if success and isinstance(response, list):
                self.log_test("Annonces mentorat", True, f"{len(response)} annonces")
            else:
                self.log_test("Annonces mentorat", False, str(response))
            
            # Test mentorship requests
            success, response = self.make_request('GET', 'student/mentorship-requests', token=student_token)
            if success and isinstance(response, list):
                self.log_test("Demandes mentorat", True, f"{len(response)} demandes")
            else:
                self.log_test("Demandes mentorat", False, str(response))
            
            # Test discover mentors
            success, response = self.make_request('GET', 'student/discover-mentors', token=student_token)
            self.log_test("Découvrir mentors", success, 
                         "Mentors accessibles" if success else str(response))
        
        if 'mentor' in self.tokens:
            mentor_token = self.tokens['mentor']
            
            # Test mentor students
            success, response = self.make_request('GET', 'mentor/students', token=mentor_token)
            if success and isinstance(response, list):
                self.log_test("Étudiants mentor", True, f"{len(response)} étudiants")
            else:
                self.log_test("Étudiants mentor", False, str(response))

    def test_messaging_system(self):
        """Test messaging system functionality"""
        print("\n💬 PHASE 8: MESSAGERIE")
        
        if 'student' in self.tokens:
            student_token = self.tokens['student']
            
            # Test threads
            success, response = self.make_request('GET', 'threads', token=student_token)
            if success and isinstance(response, dict):
                tabs = response.get('tabs', [])
                self.log_test("Threads messagerie", True, f"{len(tabs)} onglets")
            else:
                self.log_test("Threads messagerie", False, str(response))
            
            # Test inbox
            success, response = self.make_request('GET', 'messaging/inbox/student', token=student_token)
            self.log_test("Boîte de réception", success, 
                         "Inbox accessible" if success else str(response))
            
            # Test create support thread
            thread_data = {
                "context_type": "support",
                "title": "Demande d'aide technique",
                "message": "J'ai besoin d'aide avec mon profil"
            }
            success, response = self.make_request('POST', 'messaging/threads/support/create', 
                                                 thread_data, token=student_token)
            self.log_test("Création thread support", success,
                         "Thread créé" if success else str(response))

    def test_notifications_system(self):
        """Test notifications system"""
        print("\n🔔 PHASE 9: NOTIFICATIONS")
        
        if 'student' in self.tokens:
            student_token = self.tokens['student']
            
            # Test notifications list
            success, response = self.make_request('GET', 'student/notifications', token=student_token)
            if success and isinstance(response, list):
                self.log_test("Liste notifications", True, f"{len(response)} notifications")
            else:
                self.log_test("Liste notifications", False, str(response))
            
            # Test unread count
            success, response = self.make_request('GET', 'student/notifications/unread-count', token=student_token)
            if success and isinstance(response, dict):
                count = response.get('count', 0)
                self.log_test("Compteur non lues", True, f"{count} non lues")
            else:
                self.log_test("Compteur non lues", False, str(response))

    def test_contact_and_support(self):
        """Test contact and support functionality"""
        print("\n📞 PHASE 10: CONTACT ET SUPPORT")
        
        # Test contact form
        contact_data = {
            "firstName": "Marie",
            "lastName": "Test",
            "email": "marie.test@example.com",
            "organization": "Test University",
            "message": "Test de contact depuis le re-test complet ÉMÉRÉS"
        }
        
        success, response = self.make_request('POST', 'contact', contact_data)
        if success and isinstance(response, dict):
            self.log_test("Formulaire contact", True, "Message envoyé avec succès")
        else:
            self.log_test("Formulaire contact", False, str(response))

    def test_rbac_security_reinforced(self):
        """Test reinforced RBAC security as requested"""
        print("\n🔒 PHASE 11: SÉCURITÉ RBAC RENFORCÉE (CORRECTIONS)")
        
        # Test 1: Cross-role access denial
        if 'student' in self.tokens and 'company' in self.tokens:
            student_token = self.tokens['student']
            company_token = self.tokens['company']
            
            # Student trying to access company dashboard (should be 403)
            success, response = self.make_request('GET', 'company/dashboard', 
                                                 token=student_token, expected_status=403)
            self.log_test("✅ RBAC: Étudiant->Dashboard Entreprise", success,
                         "Accès refusé (403)" if success else "Accès non protégé")
            
            # Company trying to access student dashboard (should be 403)
            success, response = self.make_request('GET', 'student/dashboard/stats', 
                                                 token=company_token, expected_status=403)
            self.log_test("✅ RBAC: Entreprise->Dashboard Étudiant", success,
                         "Accès refusé (403)" if success else "Accès non protégé")
            
            # Student trying to access mentor profile (should be 403)
            success, response = self.make_request('GET', 'profile/mentor', 
                                                 token=student_token, expected_status=403)
            self.log_test("✅ RBAC: Étudiant->Profil Mentor", success,
                         "Accès refusé (403)" if success else "Accès non protégé")
        
        # Test 2: Unauthorized access (no token) should be 401
        success, response = self.make_request('GET', 'profile/student', expected_status=401)
        self.log_test("✅ RBAC: Accès sans token", success,
                     "401 Unauthorized" if success else "Accès non protégé")
        
        # Test 3: Invalid token should be 401
        success, response = self.make_request('GET', 'profile/student', 
                                             token="invalid-token", expected_status=401)
        self.log_test("✅ RBAC: Token invalide", success,
                     "401 Unauthorized" if success else "Token non validé")
        
        # Test 4: Role-specific endpoint access
        if 'mentor' in self.tokens:
            mentor_token = self.tokens['mentor']
            
            # Mentor should access mentor profile (should be 200)
            success, response = self.make_request('GET', 'profile/mentor', token=mentor_token)
            self.log_test("✅ RBAC: Mentor->Profil Mentor", success,
                         "Accès autorisé" if success else "Accès refusé incorrectement")

    def test_performance_requirements(self):
        """Test performance requirements (< 2s per endpoint)"""
        print("\n⚡ PHASE 12: PERFORMANCE (< 2s PAR ENDPOINT)")
        
        performance_tests = [
            ('auth/login', 'POST', {"email": "etudiant@emeres.fr", "password": "EtudiantPass123!"}),
            ('offers', 'GET', None),
            ('profile/student', 'GET', self.tokens.get('student')),
            ('student/dashboard/stats', 'GET', self.tokens.get('student')),
        ]
        
        slow_endpoints = []
        
        for endpoint, method, token_or_data in performance_tests:
            start_time = time.time()
            
            if method == 'GET':
                success, response = self.make_request(method, endpoint, token=token_or_data)
            else:
                success, response = self.make_request(method, endpoint, data=token_or_data)
            
            response_time = (time.time() - start_time) * 1000  # Convert to ms
            
            if response_time > 2000:  # 2 seconds
                slow_endpoints.append(f"{endpoint}: {response_time:.1f}ms")
            
            self.log_test(f"Performance {endpoint}", response_time < 2000,
                         f"{response_time:.1f}ms {'✅' if response_time < 2000 else '❌ LENT'}")
        
        if slow_endpoints:
            self.log_test("Performance globale", False, f"Endpoints lents: {', '.join(slow_endpoints)}")
        else:
            self.log_test("Performance globale", True, "Tous endpoints < 2s")

    def run_comprehensive_retest(self):
        """Run the complete comprehensive re-test"""
        print("🎯 ÉMÉRÉS BACKEND API - RE-TEST COMPLET POUR VALIDATION 100%")
        print("=" * 80)
        print("OBJECTIF: Valider que TOUS les problèmes identifiés ont été corrigés")
        print("CIBLE: 100% de succès - aucun test échoué")
        print("=" * 80)
        
        # Execute all test phases
        self.test_authentication_complete_4_roles()
        self.test_all_dashboards()
        self.test_all_profiles()
        self.test_ai_tools_complete()
        self.test_credits_system()
        self.test_offers_and_applications()
        self.test_mentorship_system()
        self.test_messaging_system()
        self.test_notifications_system()
        self.test_contact_and_support()
        self.test_rbac_security_reinforced()
        self.test_performance_requirements()
        
        # Final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive final results"""
        print("\n" + "=" * 80)
        print("🎯 RÉSULTATS FINAUX - RE-TEST COMPLET ÉMÉRÉS BACKEND")
        print("=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        total_time = time.time() - self.start_time
        
        print(f"📊 STATISTIQUES GLOBALES:")
        print(f"   • Tests exécutés: {self.tests_run}")
        print(f"   • Tests réussis: {self.tests_passed}")
        print(f"   • Tests échoués: {len(self.failed_tests)}")
        print(f"   • Taux de succès: {success_rate:.1f}%")
        print(f"   • Temps total: {total_time:.1f}s")
        
        # Success/Failure status
        if success_rate == 100:
            print(f"\n🎉 OBJECTIF ATTEINT: 100% DE SUCCÈS!")
            print("✅ Tous les problèmes précédemment identifiés ont été corrigés")
            print("✅ ÉMÉRÉS Backend API est PRÊT POUR PRODUCTION")
        elif success_rate >= 95:
            print(f"\n🎯 QUASI-OBJECTIF ATTEINT: {success_rate:.1f}% DE SUCCÈS")
            print("✅ Excellents résultats - Quelques ajustements mineurs nécessaires")
        else:
            print(f"\n⚠️ OBJECTIF NON ATTEINT: {success_rate:.1f}% DE SUCCÈS")
            print("❌ Des problèmes persistent - Corrections supplémentaires nécessaires")
        
        # Failed tests details
        if self.failed_tests:
            print(f"\n❌ TESTS ÉCHOUÉS ({len(self.failed_tests)}):")
            for i, failed_test in enumerate(self.failed_tests, 1):
                print(f"   {i}. {failed_test['name']}")
                if failed_test['details']:
                    print(f"      → {failed_test['details']}")
        
        # Key corrections verification
        print(f"\n🔍 VÉRIFICATION DES CORRECTIONS CLÉS:")
        
        mentor_profile_fixed = any(result['name'] == "✅ CORRECTION: /api/profile/mentor" and result['success'] 
                                  for result in self.test_results)
        ai_tools_fixed = any(result['name'].startswith("✅ CORRECTION: Coach IA") and result['success'] 
                            for result in self.test_results)
        rbac_fixed = any(result['name'].startswith("✅ RBAC:") and result['success'] 
                        for result in self.test_results)
        
        print(f"   • /api/profile/mentor ajouté: {'✅' if mentor_profile_fixed else '❌'}")
        print(f"   • Outils IA opérationnels: {'✅' if ai_tools_fixed else '❌'}")
        print(f"   • Sécurité RBAC renforcée: {'✅' if rbac_fixed else '❌'}")
        
        print("\n" + "=" * 80)
        
        return success_rate

if __name__ == "__main__":
    print("🚀 Démarrage du re-test complet ÉMÉRÉS Backend API...")
    
    tester = EmeresComprehensiveRetest()
    final_success_rate = tester.run_comprehensive_retest()
    
    # Exit with appropriate code
    if final_success_rate == 100:
        print("\n✅ RE-TEST TERMINÉ AVEC SUCCÈS - 100% OBJECTIF ATTEINT")
        sys.exit(0)
    elif final_success_rate is not None:
        print(f"\n⚠️ RE-TEST TERMINÉ - {final_success_rate:.1f}% SUCCÈS")
        sys.exit(1)
    else:
        print("\n❌ RE-TEST ÉCHOUÉ - ERREUR LORS DE L'EXÉCUTION")
        sys.exit(1)