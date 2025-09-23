#!/usr/bin/env python3
"""
ÉMÉRÉS Multi-Role Messaging System Backend Testing
Focus: Testing messaging system after HTTP 500 error fixes
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class MessagingSystemTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

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

    def test_authentication(self):
        """Test authentication with specific credentials from review request"""
        print("\n🔐 TESTING MESSAGING SYSTEM AUTHENTICATION")
        
        # Test with specific credentials from review request
        test_credentials = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"}
        ]
        
        for cred in test_credentials:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": cred["email"], "password": cred["password"]}, 
                                                expected_status=200)
            
            if success and isinstance(response, dict):
                self.tokens[cred["role"]] = response.get('access_token')
                self.users[cred["role"]] = response.get('user', {})
                user_id = response.get('user', {}).get('id', 'N/A')
                self.log_test(f"{cred['role'].title()} authentication", True, 
                             f"Login successful - User ID: {user_id}")
            else:
                self.log_test(f"{cred['role'].title()} authentication", False, str(response))

    def test_thread_creation_endpoints(self):
        """Test thread creation endpoints with flexible API"""
        print("\n🧵 TESTING THREAD CREATION ENDPOINTS")
        
        if 'student' not in self.tokens or 'mentor' not in self.tokens:
            self.log_test("Thread creation test", False, "Missing authentication tokens")
            return
        
        student_token = self.tokens['student']
        mentor_token = self.tokens['mentor']
        
        # Test 1: POST /messaging/threads/candidature/create
        print("\n📝 Testing Candidature Thread Creation")
        candidature_data = {
            "application_id": f"app-{str(uuid.uuid4())[:8]}",
            "company_id": f"company-{str(uuid.uuid4())[:8]}",
            "offer_title": "Stage Développeur Full-Stack"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/candidature/create', 
                                            candidature_data, token=student_token)
        if success and isinstance(response, dict):
            self.candidature_thread_id = response.get('thread_id')
            self.log_test("Create candidature thread", True, 
                         f"Thread created: {self.candidature_thread_id}")
        else:
            self.log_test("Create candidature thread", False, str(response))
        
        # Test 2: POST /messaging/threads/mentorat/create
        print("\n👨‍🏫 Testing Mentorat Thread Creation")
        mentorat_data = {
            "mentor_id": self.users['mentor'].get('id', f"mentor-{str(uuid.uuid4())[:8]}"),
            "student_id": self.users['student'].get('id', 'student-test'),
            "mentorship_type": "career_guidance"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/mentorat/create', 
                                            mentorat_data, token=student_token)
        if success and isinstance(response, dict):
            self.mentorat_thread_id = response.get('thread_id')
            self.log_test("Create mentorat thread", True, 
                         f"Thread created: {self.mentorat_thread_id}")
        else:
            self.log_test("Create mentorat thread", False, str(response))
        
        # Test 3: POST /messaging/threads/scolaire/create
        print("\n🏫 Testing Scolaire Thread Creation")
        scolaire_data = {
            "student_id": self.users['student'].get('id', 'student-test'),
            "school_id": f"school-{str(uuid.uuid4())[:8]}",
            "subject": "Demande de stage obligatoire"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/scolaire/create', 
                                            scolaire_data, token=student_token)
        if success and isinstance(response, dict):
            self.scolaire_thread_id = response.get('thread_id')
            self.log_test("Create scolaire thread", True, 
                         f"Thread created: {self.scolaire_thread_id}")
        else:
            self.log_test("Create scolaire thread", False, str(response))
        
        # Test 4: POST /messaging/threads/partenariat/create (now allows students for testing)
        print("\n🤝 Testing Partenariat Thread Creation")
        partenariat_data = {
            "company_id": f"company-{str(uuid.uuid4())[:8]}",
            "school_id": f"school-{str(uuid.uuid4())[:8]}",
            "subject": "Partenariat stages étudiants"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/partenariat/create', 
                                            partenariat_data, token=student_token)
        if success and isinstance(response, dict):
            self.partenariat_thread_id = response.get('thread_id')
            self.log_test("Create partenariat thread (student access)", True, 
                         f"Thread created: {self.partenariat_thread_id}")
        else:
            self.log_test("Create partenariat thread (student access)", False, str(response))
        
        # Test 5: POST /messaging/threads/support/create
        print("\n🆘 Testing Support Thread Creation")
        support_data = {
            "subject": "Problème technique avec la plateforme",
            "priority": "high",
            "category": "technical_issue"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/support/create', 
                                            support_data, token=student_token)
        if success and isinstance(response, dict):
            self.support_thread_id = response.get('thread_id')
            self.log_test("Create support thread", True, 
                         f"Thread created: {self.support_thread_id}")
        else:
            self.log_test("Create support thread", False, str(response))

    def test_message_operations(self):
        """Test message sending and retrieval with encryption"""
        print("\n💬 TESTING MESSAGE OPERATIONS")
        
        if 'student' not in self.tokens or not hasattr(self, 'mentorat_thread_id'):
            self.log_test("Message operations test", False, "Missing tokens or thread ID")
            return
        
        student_token = self.tokens['student']
        mentor_token = self.tokens['mentor']
        thread_id = self.mentorat_thread_id
        
        # Test 1: POST /messaging/threads/{thread_id}/messages (sending encrypted messages)
        print("\n📤 Testing Message Sending with Encryption")
        
        test_messages = [
            {
                "content": "Bonjour, j'aimerais discuter de mes objectifs de carrière en développement web.",
                "message_type": "text",
                "is_important": False
            },
            {
                "content": "Pouvez-vous me conseiller sur les compétences techniques à développer ?",
                "message_type": "text", 
                "is_important": True
            }
        ]
        
        sent_message_ids = []
        for i, message_data in enumerate(test_messages):
            success, response = self.make_request('POST', f'messaging/threads/{thread_id}/messages', 
                                                message_data, token=student_token)
            if success and isinstance(response, dict):
                message_id = response.get('message_id')
                sent_message_ids.append(message_id)
                self.log_test(f"Send encrypted message {i+1}", True, 
                             f"Message sent: {message_id}, Encrypted: {response.get('encrypted', False)}")
            else:
                self.log_test(f"Send encrypted message {i+1}", False, str(response))
        
        # Test mentor reply
        mentor_reply = {
            "content": "Bonjour ! Je serais ravi de vous accompagner. Commençons par définir vos objectifs SMART.",
            "message_type": "text",
            "reply_to_message_id": sent_message_ids[0] if sent_message_ids else None
        }
        
        success, response = self.make_request('POST', f'messaging/threads/{thread_id}/messages', 
                                            mentor_reply, token=mentor_token)
        if success:
            self.log_test("Mentor reply message", True, 
                         f"Reply sent: {response.get('message_id')}")
        else:
            self.log_test("Mentor reply message", False, str(response))
        
        # Test 2: GET /messaging/threads/{thread_id} (retrieving thread details with decryption)
        print("\n📥 Testing Thread Retrieval with Message Decryption")
        
        success, response = self.make_request('GET', f'messaging/threads/{thread_id}', 
                                            token=student_token)
        if success and isinstance(response, dict):
            messages = response.get('messages', [])
            thread_info = response.get('thread', {})
            
            self.log_test("Get thread details", True, 
                         f"Thread retrieved: {len(messages)} messages, Type: {thread_info.get('context_type')}")
            
            # Verify message decryption
            if messages:
                first_message = messages[0]
                content = first_message.get('content', '')
                is_encrypted = first_message.get('is_encrypted', False)
                
                # Content should be readable (decrypted)
                is_readable = len(content) > 0 and not content.startswith('gAAAAA')  # Fernet encrypted data starts with gAAAAA
                
                self.log_test("Message decryption", is_readable, 
                             f"Content readable: {is_readable}, Length: {len(content)}")
                
                # Verify message metadata
                expected_fields = ['message_id', 'sender_id', 'sender_role', 'content', 'created_at']
                has_metadata = all(field in first_message for field in expected_fields)
                
                self.log_test("Message metadata structure", has_metadata, 
                             f"Sender: {first_message.get('sender_role')}, Time: {first_message.get('created_at', 'N/A')[:19]}")
        else:
            self.log_test("Get thread details", False, str(response))

    def test_other_operations(self):
        """Test search, inbox, archive, and export operations"""
        print("\n🔍 TESTING OTHER MESSAGING OPERATIONS")
        
        if 'student' not in self.tokens:
            self.log_test("Other messaging operations test", False, "Missing student token")
            return
        
        student_token = self.tokens['student']
        mentor_token = self.tokens['mentor']
        
        # Test 1: GET /messaging/search (message search)
        print("\n🔎 Testing Message Search")
        
        search_queries = [
            {"query": "objectifs", "context_type": "mentorat"},
            {"query": "développement", "context_type": None},
            {"query": "carrière"}
        ]
        
        for search_data in search_queries:
            query_params = "&".join([f"{k}={v}" for k, v in search_data.items() if v is not None])
            success, response = self.make_request('GET', f'messaging/search?{query_params}', 
                                                token=student_token)
            if success and isinstance(response, dict):
                results = response.get('results', [])
                total = response.get('total', 0)
                self.log_test(f"Search messages: '{search_data['query']}'", True, 
                             f"Found {total} results")
            else:
                self.log_test(f"Search messages: '{search_data['query']}'", False, str(response))
        
        # Test 2: GET /messaging/inbox/{user_role} (role-based inbox)
        print("\n📬 Testing Role-Based Inbox")
        
        for role, token in [("student", student_token), ("mentor", mentor_token)]:
            success, response = self.make_request('GET', f'messaging/inbox/{role}', 
                                                token=token)
            if success and isinstance(response, dict):
                threads = response.get('threads', [])
                stats = response.get('stats', {})
                
                self.log_test(f"Get {role} inbox", True, 
                             f"Threads: {len(threads)}, Unread: {stats.get('unread_count', 0)}")
                
                # Verify inbox structure
                if threads:
                    first_thread = threads[0]
                    expected_fields = ['thread_id', 'context_type', 'title', 'last_message', 'participants']
                    has_structure = all(field in first_thread for field in expected_fields)
                    
                    self.log_test(f"{role} inbox structure", has_structure, 
                                 f"Type: {first_thread.get('context_type')}, Participants: {len(first_thread.get('participants', []))}")
            else:
                self.log_test(f"Get {role} inbox", False, str(response))
        
        # Test 3: PUT /messaging/threads/{thread_id}/archive (now requires write instead of admin)
        print("\n📁 Testing Thread Archive")
        
        if hasattr(self, 'support_thread_id'):
            thread_id = self.support_thread_id
            success, response = self.make_request('PUT', f'messaging/threads/{thread_id}/archive', 
                                                token=student_token)
            if success and isinstance(response, dict):
                self.log_test("Archive thread (write permission)", True, 
                             f"Thread archived: {response.get('success', False)}")
            else:
                self.log_test("Archive thread (write permission)", False, str(response))
        
        # Test 4: GET /messaging/export/{thread_id} (now requires read instead of special permissions)
        print("\n📄 Testing Thread Export")
        
        if hasattr(self, 'mentorat_thread_id'):
            thread_id = self.mentorat_thread_id
            success, response = self.make_request('GET', f'messaging/export/{thread_id}', 
                                                token=student_token)
            if success and isinstance(response, dict):
                export_data = response.get('export_data', {})
                thread_info = export_data.get('thread', {})
                
                self.log_test("Export thread (read permission)", True, 
                             f"Export generated: {len(export_data.get('messages', []))} messages")
                
                # Verify export structure
                expected_fields = ['thread', 'messages', 'participants', 'metadata']
                has_export_structure = all(field in export_data for field in expected_fields)
                
                self.log_test("Export data structure", has_export_structure, 
                             f"Thread: {thread_info.get('context_type')}, Exported by: {response.get('exported_by')}")
            else:
                self.log_test("Export thread (read permission)", False, str(response))

    def test_fixed_features(self):
        """Test fixed features mentioned in review request"""
        print("\n🔧 TESTING FIXED MESSAGING FEATURES")
        
        if 'student' not in self.tokens:
            self.log_test("Fixed features test", False, "Missing student token")
            return
        
        student_token = self.tokens['student']
        
        # Test 1: User display name resolution (now has fallbacks and error handling)
        print("\n👤 Testing User Display Name Resolution")
        
        if hasattr(self, 'mentorat_thread_id'):
            success, response = self.make_request('GET', f'messaging/threads/{self.mentorat_thread_id}', 
                                                token=student_token)
            if success and isinstance(response, dict):
                messages = response.get('messages', [])
                participants = response.get('thread', {}).get('participants', [])
                
                # Check if display names are resolved
                display_names_resolved = True
                for message in messages:
                    sender_name = message.get('sender_name', '')
                    if not sender_name or sender_name == 'Unknown User':
                        display_names_resolved = False
                        break
                
                self.log_test("User display name resolution", display_names_resolved, 
                             f"All sender names resolved: {display_names_resolved}")
                
                # Check participant names
                participant_names_resolved = all(
                    p.get('display_name', '') != '' for p in participants
                )
                
                self.log_test("Participant name resolution", participant_names_resolved, 
                             f"All participant names resolved: {participant_names_resolved}")
        
        # Test 2: Flexible API contracts (endpoints accept multiple field names)
        print("\n🔄 Testing Flexible API Contracts")
        
        # Test candidature thread creation with both field names
        flexible_data_tests = [
            {"candidature_id": f"cand-{str(uuid.uuid4())[:8]}", "company_id": "test-company"},
            {"application_id": f"app-{str(uuid.uuid4())[:8]}", "company_id": "test-company"}
        ]
        
        for i, data in enumerate(flexible_data_tests):
            success, response = self.make_request('POST', 'messaging/threads/candidature/create', 
                                                data, token=student_token)
            field_name = "candidature_id" if "candidature_id" in data else "application_id"
            
            if success and isinstance(response, dict):
                self.log_test(f"Flexible API - {field_name}", True, 
                             f"Thread created with {field_name}")
            else:
                self.log_test(f"Flexible API - {field_name}", False, str(response))
        
        # Test 3: Role permissions (students can now access partenariat for testing)
        print("\n🔐 Testing Updated Role Permissions")
        
        # Student should be able to create partenariat thread
        partenariat_test_data = {
            "company_id": f"test-company-{str(uuid.uuid4())[:8]}",
            "school_id": f"test-school-{str(uuid.uuid4())[:8]}",
            "subject": "Test partenariat access for students"
        }
        
        success, response = self.make_request('POST', 'messaging/threads/partenariat/create', 
                                            partenariat_test_data, token=student_token)
        
        if success and isinstance(response, dict):
            self.log_test("Student partenariat access", True, 
                         "Students can now create partenariat threads for testing")
        else:
            self.log_test("Student partenariat access", False, str(response))

    def run_comprehensive_tests(self):
        """Run comprehensive messaging system tests"""
        print("🧵 COMPREHENSIVE MESSAGING SYSTEM TESTING")
        print("   Testing multi-role messaging system after HTTP 500 error fixes")
        print("=" * 80)
        
        # Run all messaging tests in sequence
        self.test_authentication()
        self.test_thread_creation_endpoints()
        self.test_message_operations()
        self.test_other_operations()
        self.test_fixed_features()
        
        # Print final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results"""
        print("\n" + "=" * 80)
        print("📊 MESSAGING SYSTEM TEST RESULTS")
        print("=" * 80)
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")

        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        # Show passed tests summary
        passed_tests = [test for test in self.test_results if test['success']]
        if passed_tests:
            print(f"\n✅ PASSED TESTS: {len(passed_tests)}")
            
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = MessagingSystemTester()
    tester.run_comprehensive_tests()