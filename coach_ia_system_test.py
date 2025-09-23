#!/usr/bin/env python3
"""
🎯 TEST URGENT - SYSTÈME OUTILS ÉMÉRÉS COMPLET
Test complet du système Coach IA selon la demande française

PHASES DE TEST:
1. Vérification Infrastructure
2. Test Coach IA Endpoints  
3. Test Intégration Complète
4. Diagnostic Problèmes
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class CoachIASystemTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.session_ids = {}

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
                response = requests.get(url, headers=headers, timeout=15)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=15)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=15)
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

    def test_authentication_setup(self):
        """Authentification avec student@emeres.fr/StudentPass123!"""
        print("\n🔐 PHASE PRÉLIMINAIRE: AUTHENTIFICATION")
        
        login_data = {
            "email": "student@emeres.fr",
            "password": "StudentPass123!"
        }
        
        success, response = self.make_request('POST', 'auth/login', login_data)
        
        if success and isinstance(response, dict):
            self.tokens['student'] = response.get('access_token')
            self.users['student'] = response.get('user', {})
            self.log_test("Authentification student@emeres.fr", True, "Token obtenu avec succès")
            return True
        else:
            self.log_test("Authentification student@emeres.fr", False, str(response))
            return False

    def test_phase_1_infrastructure(self):
        """PHASE 1: VÉRIFICATION INFRASTRUCTURE"""
        print("\n🏗️ PHASE 1: VÉRIFICATION INFRASTRUCTURE")
        
        if 'student' not in self.tokens:
            self.log_test("Phase 1 - Infrastructure", False, "Pas de token d'authentification")
            return False
        
        token = self.tokens['student']
        
        # Test 1.1: API Tools Routes - GET /api/tools/available
        print("\n📋 Test 1.1: API Tools Routes")
        success, response = self.make_request('GET', 'tools/available', token=token)
        
        if success and isinstance(response, dict):
            tools = response.get('tools', [])
            coach_ia_found = any(tool.get('tool_id') == 'coach_ia' for tool in tools)
            self.log_test("GET /api/tools/available", success, 
                         f"Trouvé {len(tools)} outils, Coach IA: {'✅' if coach_ia_found else '❌'}")
            
            # Analyser les outils disponibles
            for tool in tools:
                tool_name = tool.get('name', 'Unknown')
                has_access = tool.get('has_access', False)
                premium_required = tool.get('premium_required', False)
                print(f"  📦 {tool_name}: Accès {'✅' if has_access else '❌'}, Premium: {'✅' if premium_required else '❌'}")
        else:
            self.log_test("GET /api/tools/available", False, str(response))
            coach_ia_found = False
        
        # Test 1.2: Database Collections - Vérifier via endpoints
        print("\n🗄️ Test 1.2: Database Collections")
        
        # Test sessions endpoint pour vérifier la collection tool_sessions
        success, response = self.make_request('GET', 'tools/sessions', token=token)
        if success:
            sessions = response.get('sessions', [])
            self.log_test("Collection tool_sessions accessible", True, f"Trouvé {len(sessions)} sessions")
        else:
            self.log_test("Collection tool_sessions accessible", False, str(response))
        
        # Test stats endpoint pour vérifier tool_usage_stats
        success, response = self.make_request('GET', 'tools/stats', token=token)
        if success:
            stats = response.get('stats', [])
            self.log_test("Collection tool_usage_stats accessible", True, f"Trouvé {len(stats)} stats")
        else:
            self.log_test("Collection tool_usage_stats accessible", False, str(response))
        
        # Test 1.3: Emergent LLM Integration - Health check
        print("\n🤖 Test 1.3: Emergent LLM Integration")
        success, response = self.make_request('GET', 'tools/health')
        
        if success and isinstance(response, dict):
            status = response.get('status', 'unknown')
            tools_available = response.get('tools_available', 0)
            self.log_test("Emergent LLM Integration Health", status == 'healthy', 
                         f"Status: {status}, Outils: {tools_available}")
        else:
            self.log_test("Emergent LLM Integration Health", False, str(response))
        
        return coach_ia_found

    def test_phase_2_coach_ia_endpoints(self):
        """PHASE 2: TEST COACH IA ENDPOINTS"""
        print("\n🎓 PHASE 2: TEST COACH IA ENDPOINTS")
        
        if 'student' not in self.tokens:
            self.log_test("Phase 2 - Coach IA Endpoints", False, "Pas de token d'authentification")
            return False
        
        token = self.tokens['student']
        
        # Test 2.1: POST /api/tools/coach-ia/session - Création session coaching
        print("\n📝 Test 2.1: Création session coaching")
        session_context = {
            "subject": "Organisation des révisions",
            "level": "Master 2",
            "domain": "Informatique"
        }
        
        success, response = self.make_request('POST', 'tools/coach-ia/session', session_context, token=token)
        
        if success and isinstance(response, dict):
            session_id = response.get('session_id')
            if session_id:
                self.session_ids['coach_ia'] = session_id
                self.log_test("POST /api/tools/coach-ia/session", True, f"Session créée: {session_id[:8]}...")
            else:
                self.log_test("POST /api/tools/coach-ia/session", False, "Pas de session_id dans la réponse")
                return False
        else:
            self.log_test("POST /api/tools/coach-ia/session", False, str(response))
            return False
        
        # Test 2.2: POST /api/tools/coach-ia/chat/{session_id} - Envoi message
        print("\n💬 Test 2.2: Envoi message au Coach IA")
        session_id = self.session_ids['coach_ia']
        
        chat_message = {
            "message": "Bonjour Coach IA, comment organiser mes révisions ?",
            "context": {"urgency": "high", "exam_date": "2025-06-15"}
        }
        
        success, response = self.make_request('POST', f'tools/coach-ia/chat/{session_id}', 
                                            chat_message, token=token)
        
        if success and isinstance(response, dict):
            ai_response = response.get('response', '')
            message_id = response.get('message_id', '')
            success_flag = response.get('success', False)
            
            if success_flag and ai_response:
                self.log_test("POST /api/tools/coach-ia/chat/{session_id}", True, 
                             f"Réponse IA reçue ({len(ai_response)} chars), Message ID: {message_id[:8]}...")
                print(f"  🤖 Aperçu réponse IA: {ai_response[:100]}...")
            else:
                self.log_test("POST /api/tools/coach-ia/chat/{session_id}", False, 
                             f"Pas de réponse IA valide: {response}")
        else:
            self.log_test("POST /api/tools/coach-ia/chat/{session_id}", False, str(response))
        
        # Test 2.3: GET /api/tools/coach-ia/history/{session_id} - Récupération historique
        print("\n📚 Test 2.3: Récupération historique")
        success, response = self.make_request('GET', f'tools/coach-ia/history/{session_id}', token=token)
        
        if success and isinstance(response, dict):
            history = response.get('history', [])
            user_messages = [msg for msg in history if msg.get('role') == 'user']
            ai_messages = [msg for msg in history if msg.get('role') == 'assistant']
            
            self.log_test("GET /api/tools/coach-ia/history/{session_id}", True, 
                         f"Historique: {len(history)} messages ({len(user_messages)} user, {len(ai_messages)} IA)")
        else:
            self.log_test("GET /api/tools/coach-ia/history/{session_id}", False, str(response))
        
        # Test 2.4: GET /api/tools/coach-ia/sessions - Sessions utilisateur
        print("\n📋 Test 2.4: Sessions utilisateur")
        success, response = self.make_request('GET', 'tools/coach-ia/sessions', token=token)
        
        if success and isinstance(response, dict):
            sessions = response.get('sessions', [])
            active_sessions = [s for s in sessions if s.get('is_active', False)]
            
            self.log_test("GET /api/tools/coach-ia/sessions", True, 
                         f"Sessions: {len(sessions)} total, {len(active_sessions)} actives")
        else:
            self.log_test("GET /api/tools/coach-ia/sessions", False, str(response))
        
        return True

    def test_phase_3_integration_complete(self):
        """PHASE 3: TEST INTÉGRATION COMPLÈTE"""
        print("\n🔗 PHASE 3: TEST INTÉGRATION COMPLÈTE")
        
        if 'student' not in self.tokens:
            self.log_test("Phase 3 - Intégration", False, "Pas de token d'authentification")
            return False
        
        token = self.tokens['student']
        
        # Test 3.1: Session Management - Créer plusieurs sessions
        print("\n📊 Test 3.1: Session Management")
        
        # Créer une deuxième session
        session_context_2 = {
            "subject": "Préparation entretien",
            "level": "Master 2", 
            "domain": "Informatique"
        }
        
        success, response = self.make_request('POST', 'tools/coach-ia/session', session_context_2, token=token)
        
        if success and isinstance(response, dict):
            session_id_2 = response.get('session_id')
            self.session_ids['coach_ia_2'] = session_id_2
            self.log_test("Création session multiple", True, f"Session 2 créée: {session_id_2[:8]}...")
        else:
            self.log_test("Création session multiple", False, str(response))
        
        # Test 3.2: Chat Functionality - Test conversation complète
        print("\n💭 Test 3.2: Chat Functionality - Conversation complète")
        
        if 'coach_ia' in self.session_ids:
            session_id = self.session_ids['coach_ia']
            
            # Messages de test pour une conversation réaliste
            test_messages = [
                "Peux-tu m'aider à créer un planning de révision pour mes examens de juin ?",
                "J'ai 5 matières à réviser en 3 mois. Comment organiser cela efficacement ?",
                "Quelles sont les meilleures techniques de mémorisation pour l'informatique ?"
            ]
            
            conversation_success = True
            for i, message in enumerate(test_messages):
                chat_data = {"message": message}
                success, response = self.make_request('POST', f'tools/coach-ia/chat/{session_id}', 
                                                    chat_data, token=token)
                
                if success and isinstance(response, dict) and response.get('success'):
                    ai_response = response.get('response', '')
                    print(f"  💬 Message {i+1}: Réponse IA ({len(ai_response)} chars)")
                else:
                    conversation_success = False
                    print(f"  ❌ Message {i+1}: Échec - {response}")
            
            self.log_test("Conversation complète Coach IA", conversation_success, 
                         f"Échange de {len(test_messages)} messages")
        
        # Test 3.3: Data Persistence - Vérifier sauvegarde messages
        print("\n💾 Test 3.3: Data Persistence")
        
        if 'coach_ia' in self.session_ids:
            session_id = self.session_ids['coach_ia']
            
            # Récupérer l'historique pour vérifier la persistance
            success, response = self.make_request('GET', f'tools/coach-ia/history/{session_id}', token=token)
            
            if success and isinstance(response, dict):
                history = response.get('history', [])
                
                # Vérifier que tous les messages sont sauvegardés
                expected_messages = 4  # 1 initial + 3 de test
                user_messages = [msg for msg in history if msg.get('role') == 'user']
                ai_messages = [msg for msg in history if msg.get('role') == 'assistant']
                
                persistence_ok = len(user_messages) >= expected_messages and len(ai_messages) >= expected_messages
                
                self.log_test("Persistance messages en DB", persistence_ok, 
                             f"Messages sauvegardés: {len(user_messages)} user, {len(ai_messages)} IA")
                
                # Vérifier la structure des messages
                if history:
                    sample_message = history[0]
                    required_fields = ['message_id', 'session_id', 'user_id', 'role', 'content', 'timestamp']
                    structure_ok = all(field in sample_message for field in required_fields)
                    
                    self.log_test("Structure messages correcte", structure_ok, 
                                 f"Champs présents: {list(sample_message.keys())}")
            else:
                self.log_test("Persistance messages en DB", False, str(response))
        
        return True

    def test_phase_4_diagnostic_problems(self):
        """PHASE 4: DIAGNOSTIC PROBLÈMES"""
        print("\n🔍 PHASE 4: DIAGNOSTIC PROBLÈMES")
        
        # Test 4.1: Import Errors - Vérifier via health check
        print("\n📦 Test 4.1: Import Errors")
        success, response = self.make_request('GET', 'tools/health')
        
        if success and isinstance(response, dict):
            status = response.get('status')
            tools_count = response.get('tools_available', 0)
            
            imports_ok = status == 'healthy' and tools_count > 0
            self.log_test("Imports tools_system, api_tools", imports_ok, 
                         f"Status: {status}, Outils: {tools_count}")
        else:
            self.log_test("Imports tools_system, api_tools", False, str(response))
        
        # Test 4.2: Database Connections - Test accès MongoDB
        print("\n🗄️ Test 4.2: Database Connections")
        
        if 'student' in self.tokens:
            token = self.tokens['student']
            
            # Test accès aux différentes collections
            collections_tests = [
                ('tool_sessions', 'tools/sessions'),
                ('tool_usage_stats', 'tools/stats'),
                ('chat_messages', f'tools/coach-ia/history/{self.session_ids.get("coach_ia", "test")}')
            ]
            
            db_connections_ok = True
            for collection_name, endpoint in collections_tests:
                success, response = self.make_request('GET', endpoint, token=token)
                if success:
                    print(f"  ✅ Collection {collection_name}: Accessible")
                else:
                    print(f"  ❌ Collection {collection_name}: Erreur - {response}")
                    db_connections_ok = False
            
            self.log_test("Accès MongoDB collections", db_connections_ok, 
                         "Toutes les collections sont accessibles" if db_connections_ok else "Problèmes d'accès détectés")
        
        # Test 4.3: LLM Integration - Test communication OpenAI via Emergent
        print("\n🤖 Test 4.3: LLM Integration")
        
        if 'student' in self.tokens and 'coach_ia' in self.session_ids:
            token = self.tokens['student']
            session_id = self.session_ids['coach_ia']
            
            # Test message simple pour vérifier LLM
            test_llm_message = {
                "message": "Test de connexion LLM - réponds juste 'OK' si tu me reçois."
            }
            
            success, response = self.make_request('POST', f'tools/coach-ia/chat/{session_id}', 
                                                test_llm_message, token=token)
            
            if success and isinstance(response, dict):
                ai_response = response.get('response', '')
                success_flag = response.get('success', False)
                
                llm_working = success_flag and len(ai_response) > 0
                self.log_test("Communication OpenAI via Emergent", llm_working, 
                             f"Réponse LLM: {'✅' if llm_working else '❌'} ({len(ai_response)} chars)")
                
                if llm_working:
                    print(f"  🤖 Réponse LLM: {ai_response[:100]}...")
            else:
                self.log_test("Communication OpenAI via Emergent", False, str(response))
        
        return True

    def run_complete_test_suite(self):
        """Exécuter la suite complète de tests"""
        print("🎯 DÉMARRAGE TEST URGENT - SYSTÈME OUTILS ÉMÉRÉS COMPLET")
        print("=" * 80)
        
        # Phase préliminaire
        if not self.test_authentication_setup():
            print("\n❌ ÉCHEC AUTHENTIFICATION - ARRÊT DES TESTS")
            return False
        
        # Phase 1: Infrastructure
        infrastructure_ok = self.test_phase_1_infrastructure()
        
        # Phase 2: Coach IA Endpoints
        endpoints_ok = self.test_phase_2_coach_ia_endpoints()
        
        # Phase 3: Intégration complète
        integration_ok = self.test_phase_3_integration_complete()
        
        # Phase 4: Diagnostic
        diagnostic_ok = self.test_phase_4_diagnostic_problems()
        
        # Résultats finaux
        self.print_final_results()
        
        return infrastructure_ok and endpoints_ok and integration_ok and diagnostic_ok

    def print_final_results(self):
        """Afficher les résultats finaux"""
        print("\n" + "=" * 80)
        print("🎯 RÉSULTATS FINAUX - SYSTÈME OUTILS ÉMÉRÉS")
        print("=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 STATISTIQUES GLOBALES:")
        print(f"   Tests exécutés: {self.tests_run}")
        print(f"   Tests réussis: {self.tests_passed}")
        print(f"   Taux de réussite: {success_rate:.1f}%")
        
        # Résultats par phase
        phases = {
            "PHASE 1 - Infrastructure": ["API Tools Routes", "Database Collections", "Emergent LLM Integration"],
            "PHASE 2 - Coach IA Endpoints": ["POST /api/tools/coach-ia/session", "POST /api/tools/coach-ia/chat", "GET /api/tools/coach-ia/history", "GET /api/tools/coach-ia/sessions"],
            "PHASE 3 - Intégration": ["Session Management", "Chat Functionality", "Data Persistence"],
            "PHASE 4 - Diagnostic": ["Import Errors", "Database Connections", "LLM Integration"]
        }
        
        print(f"\n📋 RÉSULTATS DÉTAILLÉS:")
        for phase, keywords in phases.items():
            phase_tests = [test for test in self.test_results if any(keyword in test['name'] for keyword in keywords)]
            phase_passed = sum(1 for test in phase_tests if test['success'])
            phase_total = len(phase_tests)
            phase_rate = (phase_passed / phase_total * 100) if phase_total > 0 else 0
            
            status = "✅" if phase_rate >= 80 else "⚠️" if phase_rate >= 50 else "❌"
            print(f"   {status} {phase}: {phase_passed}/{phase_total} ({phase_rate:.1f}%)")
        
        # Problèmes critiques identifiés
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ PROBLÈMES IDENTIFIÉS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"   • {test['name']}: {test['details']}")
        
        # Recommandations
        print(f"\n🎯 OBJECTIF: Identifier et corriger TOUS les problèmes pour atteindre 100% fonctionnel")
        
        if success_rate >= 90:
            print("✅ EXCELLENT: Système Coach IA opérationnel à plus de 90%")
        elif success_rate >= 70:
            print("⚠️ BON: Système partiellement fonctionnel, corrections mineures nécessaires")
        else:
            print("❌ CRITIQUE: Problèmes majeurs détectés, corrections urgentes requises")

def main():
    """Point d'entrée principal"""
    tester = CoachIASystemTester()
    
    try:
        success = tester.run_complete_test_suite()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Test interrompu par l'utilisateur")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erreur critique: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()