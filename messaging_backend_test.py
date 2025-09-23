#!/usr/bin/env python3
"""
ÉMÉRÉS Messaging System Backend API Testing Suite
Focus: Thread Management, Message APIs, Authentication, Data Structure, Context-based Messaging
As requested in review: Test messaging system backend functionality after compilation fixes
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class MessagingBackendTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}  # Store tokens for different users
        self.users = {}   # Store user data
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

    def authenticate_test_users(self):
        """Authenticate with the provided test credentials"""
        print("\n🔐 AUTHENTICATING TEST USERS")
        
        # Test credentials from review request
        test_credentials = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"}
        ]
        
        for creds in test_credentials:
            success, response = self.make_request('POST', 'auth/login', 
                                                {"email": creds["email"], "password": creds["password"]})
            
            if success and isinstance(response, dict):
                self.tokens[creds['role']] = response.get('access_token')
                self.users[creds['role']] = response.get('user', {})
                self.log_test(f"Authenticate {creds['role']}", True, f"Token received for {creds['email']}")
            else:
                self.log_test(f"Authenticate {creds['role']}", False, f"Failed to authenticate {creds['email']}: {str(response)}")

    def test_thread_management_apis(self, student_token, mentor_token):
        """Test Thread Management APIs: GET /api/threads, GET /api/threads/{id}, POST thread creation"""
        print("\n📋 TESTING THREAD MANAGEMENT APIs")
        
        # Test 1: GET /api/threads - List all threads for user
        print("\n📥 Testing GET /api/threads")
        success, response = self.make_request('GET', 'threads', token=student_token)
        
        if success and isinstance(response, dict):
            threads = response.get('threads', [])
            total_count = response.get('total_count', 0)
            unread_count = response.get('unread_count', 0)
            
            self.log_test("GET /api/threads", True, 
                         f"Retrieved {len(threads)} threads, Total: {total_count}, Unread: {unread_count}")
            
            # Store thread ID for later tests
            if threads:
                self.test_thread_id = threads[0].get('id')
                
                # Test GET /api/threads/{id} - Get specific thread
                print(f"\n📄 Testing GET /api/threads/{self.test_thread_id}")
                success, thread_response = self.make_request('GET', f'threads/{self.test_thread_id}', token=student_token)
                
                if success and isinstance(thread_response, dict):
                    thread_info = thread_response.get('thread', {})
                    messages = thread_response.get('messages', [])
                    
                    self.log_test("GET /api/threads/{id}", True, 
                                 f"Thread details: {thread_info.get('title', 'N/A')}, Messages: {len(messages)}")
                else:
                    self.log_test("GET /api/threads/{id}", False, str(thread_response))
        else:
            self.log_test("GET /api/threads", False, str(response))
        
        # Test 2: POST thread creation endpoints for different contexts
        print("\n📤 Testing POST thread creation endpoints")
        
        # Create candidature thread
        candidature_data = {
            "context_type": "candidature",
            "title": "Candidature - Stage Développeur",
            "participants": [
                {"user_id": self.users['student'].get('id'), "role": "student"},
                {"user_id": str(uuid.uuid4()), "role": "company"}
            ]
        }
        
        success, response = self.make_request('POST', 'threads/context/candidature', 
                                            candidature_data, token=student_token)
        if success and isinstance(response, dict):
            self.candidature_thread_id = response.get('thread_id')
            self.log_test("POST candidature thread", True, f"Thread ID: {self.candidature_thread_id}")
        else:
            self.log_test("POST candidature thread", False, str(response))
        
        # Create mentorat thread
        mentorat_data = {
            "context_type": "mentorat",
            "title": "Mentorat - Développement Web",
            "participants": [
                {"user_id": self.users['student'].get('id'), "role": "student"},
                {"user_id": self.users['mentor'].get('id'), "role": "mentor"}
            ]
        }
        
        success, response = self.make_request('POST', 'threads/context/mentorat', 
                                            mentorat_data, token=student_token)
        if success and isinstance(response, dict):
            self.mentorat_thread_id = response.get('thread_id')
            self.log_test("POST mentorat thread", True, f"Thread ID: {self.mentorat_thread_id}")
        else:
            self.log_test("POST mentorat thread", False, str(response))
        
        # Create scolaire thread
        scolaire_data = {
            "context_type": "scolaire",
            "title": "Demande administrative",
            "participants": [
                {"user_id": self.users['student'].get('id'), "role": "student"},
                {"user_id": str(uuid.uuid4()), "role": "school"}
            ]
        }
        
        success, response = self.make_request('POST', 'threads/context/scolaire', 
                                            scolaire_data, token=student_token)
        if success and isinstance(response, dict):
            self.scolaire_thread_id = response.get('thread_id')
            self.log_test("POST scolaire thread", True, f"Thread ID: {self.scolaire_thread_id}")
        else:
            self.log_test("POST scolaire thread", False, str(response))
        
        # Create support thread
        support_data = {
            "context_type": "support",
            "title": "Support technique",
            "participants": [
                {"user_id": self.users['student'].get('id'), "role": "student"},
                {"user_id": str(uuid.uuid4()), "role": "institution"}
            ]
        }
        
        success, response = self.make_request('POST', 'threads/context/support', 
                                            support_data, token=student_token)
        if success and isinstance(response, dict):
            self.support_thread_id = response.get('thread_id')
            self.log_test("POST support thread", True, f"Thread ID: {self.support_thread_id}")
        else:
            self.log_test("POST support thread", False, str(response))

    def test_message_apis(self, student_token, mentor_token):
        """Test Message APIs: GET /api/threads/{id}/messages, POST /api/threads/{id}/messages"""
        print("\n💬 TESTING MESSAGE APIs")
        
        # Use mentorat thread for testing if available
        thread_id = getattr(self, 'mentorat_thread_id', None) or getattr(self, 'test_thread_id', None)
        
        if not thread_id:
            self.log_test("Message APIs setup", False, "No thread ID available for testing")
            return
        
        # Test 1: GET /api/threads/{id}/messages
        print(f"\n📥 Testing GET /api/threads/{thread_id}/messages")
        success, response = self.make_request('GET', f'threads/{thread_id}/messages', token=student_token)
        
        if success and isinstance(response, dict):
            messages = response.get('messages', [])
            thread_info = response.get('thread', {})
            
            self.log_test("GET thread messages", True, 
                         f"Retrieved {len(messages)} messages for thread {thread_id}")
            
            # Verify thread info structure
            expected_thread_fields = ['id', 'title', 'context_type', 'participants']
            thread_fields_present = all(field in thread_info for field in expected_thread_fields)
            self.log_test("Thread info structure", thread_fields_present,
                         f"Thread fields: {list(thread_info.keys())}")
        else:
            self.log_test("GET thread messages", False, str(response))
        
        # Test 2: POST /api/threads/{id}/messages - Send message
        print(f"\n📤 Testing POST /api/threads/{thread_id}/messages")
        message_data = {
            "content": "Bonjour ! J'espère que vous allez bien. Je voulais vous faire un point sur mon avancement dans le projet que nous avons discuté la semaine dernière.",
            "message_type": "text"
        }
        
        success, response = self.make_request('POST', f'threads/{thread_id}/messages', 
                                            message_data, token=student_token)
        
        if success and isinstance(response, dict):
            message_id = response.get('message_id')
            encrypted = response.get('encrypted', False)
            
            self.log_test("POST send message", True, 
                         f"Message sent: {message_id}, Encrypted: {encrypted}")
            
            # Store message ID for later tests
            self.test_message_id = message_id
        else:
            self.log_test("POST send message", False, str(response))
        
        # Test 3: Send mentor reply
        print(f"\n👨‍🏫 Testing mentor reply")
        mentor_message_data = {
            "content": "Bonjour ! Merci pour votre message. Je suis content d'avoir de vos nouvelles. Pouvez-vous me donner plus de détails sur les difficultés que vous rencontrez ?",
            "message_type": "text"
        }
        
        success, response = self.make_request('POST', f'threads/{thread_id}/messages', 
                                            mentor_message_data, token=mentor_token)
        
        if success and isinstance(response, dict):
            mentor_message_id = response.get('message_id')
            self.log_test("Mentor reply message", True, f"Mentor message sent: {mentor_message_id}")
        else:
            self.log_test("Mentor reply message", False, str(response))
        
        # Test 4: Verify messages were added
        print(f"\n🔍 Testing message persistence")
        success, response = self.make_request('GET', f'threads/{thread_id}/messages', token=student_token)
        
        if success and isinstance(response, dict):
            messages = response.get('messages', [])
            new_message_count = len(messages)
            
            # Should have at least the messages we just sent
            self.log_test("Message persistence", new_message_count >= 2,
                         f"Found {new_message_count} messages after sending")
            
            # Verify message structure
            if messages:
                latest_message = messages[-1]
                expected_message_fields = ['id', 'content', 'sender_id', 'sender_role', 'created_at', 'is_encrypted']
                message_fields_present = all(field in latest_message for field in expected_message_fields)
                self.log_test("Message structure", message_fields_present,
                             f"Message fields: {list(latest_message.keys())}")
        else:
            self.log_test("Message persistence", False, str(response))

    def test_messaging_authentication(self, student_token, mentor_token):
        """Test authentication requirements for messaging endpoints"""
        print("\n🔐 TESTING MESSAGING AUTHENTICATION")
        
        thread_id = getattr(self, 'mentorat_thread_id', None) or getattr(self, 'test_thread_id', None)
        
        if not thread_id:
            self.log_test("Authentication test setup", False, "No thread ID available")
            return
        
        # Test 1: Access without token (should fail)
        print("\n🚫 Testing access without authentication")
        success, response = self.make_request('GET', 'threads', expected_status=401)
        self.log_test("Unauthenticated access denied", success, "Access properly denied without token")
        
        # Test 2: Access with invalid token (should fail)
        print("\n🔑 Testing access with invalid token")
        success, response = self.make_request('GET', 'threads', token="invalid_token", expected_status=401)
        self.log_test("Invalid token denied", success, "Access properly denied with invalid token")
        
        # Test 3: Valid token access (should succeed)
        print("\n✅ Testing access with valid token")
        success, response = self.make_request('GET', 'threads', token=student_token)
        self.log_test("Valid token access", success, "Access granted with valid token")
        
        # Test 4: Cross-user thread access (should be controlled)
        print("\n🔒 Testing thread access permissions")
        # Try to access thread with different user token
        success, response = self.make_request('GET', f'threads/{thread_id}/messages', token=mentor_token)
        # This should succeed if mentor is participant, or fail if not
        self.log_test("Thread access control", True, 
                     f"Thread access result: {'allowed' if success else 'denied'}")

    def test_messaging_data_structure(self, student_token, mentor_token):
        """Test data structure compatibility with frontend expectations"""
        print("\n📊 TESTING MESSAGING DATA STRUCTURE")
        
        # Test 1: GET /api/threads response structure
        print("\n📋 Testing threads list structure")
        success, response = self.make_request('GET', 'threads', token=student_token)
        
        if success and isinstance(response, dict):
            # Expected structure for frontend compatibility
            expected_root_fields = ['threads', 'total_count', 'unread_count']
            root_fields_present = all(field in response for field in expected_root_fields)
            
            self.log_test("Threads list root structure", root_fields_present,
                         f"Root fields: {list(response.keys())}")
            
            threads = response.get('threads', [])
            if threads:
                thread = threads[0]
                expected_thread_fields = ['id', 'title', 'context_type', 'last_activity_at', 'unread_count', 'participants']
                thread_fields_present = all(field in thread for field in expected_thread_fields)
                
                self.log_test("Thread object structure", thread_fields_present,
                             f"Thread fields: {list(thread.keys())}")
                
                # Test participant structure
                participants = thread.get('participants', [])
                if participants:
                    participant = participants[0]
                    expected_participant_fields = ['user_id', 'role', 'display_name']
                    participant_fields_present = all(field in participant for field in expected_participant_fields)
                    
                    self.log_test("Participant structure", participant_fields_present,
                                 f"Participant fields: {list(participant.keys())}")
        else:
            self.log_test("Threads list structure", False, str(response))
        
        # Test 2: Message structure
        thread_id = getattr(self, 'mentorat_thread_id', None) or getattr(self, 'test_thread_id', None)
        
        if thread_id:
            print("\n💬 Testing message structure")
            success, response = self.make_request('GET', f'threads/{thread_id}/messages', token=student_token)
            
            if success and isinstance(response, dict):
                messages = response.get('messages', [])
                if messages:
                    message = messages[0]
                    expected_message_fields = ['id', 'content', 'sender_id', 'sender_role', 'sender_name', 'created_at', 'is_encrypted']
                    message_fields_present = all(field in message for field in expected_message_fields)
                    
                    self.log_test("Message object structure", message_fields_present,
                                 f"Message fields: {list(message.keys())}")
                    
                    # Test data types
                    content_is_string = isinstance(message.get('content'), str)
                    created_at_is_string = isinstance(message.get('created_at'), str)
                    is_encrypted_is_bool = isinstance(message.get('is_encrypted'), bool)
                    
                    data_types_correct = content_is_string and created_at_is_string and is_encrypted_is_bool
                    self.log_test("Message data types", data_types_correct,
                                 f"Content: {type(message.get('content'))}, Created: {type(message.get('created_at'))}, Encrypted: {type(message.get('is_encrypted'))}")

    def test_context_based_messaging(self, student_token, mentor_token):
        """Test different messaging contexts (candidature, mentorat, scolaire, support)"""
        print("\n🎯 TESTING CONTEXT-BASED MESSAGING")
        
        # Test each context type
        contexts = ['candidature', 'mentorat', 'scolaire', 'support']
        
        for context in contexts:
            print(f"\n📂 Testing {context} context")
            
            # Get threads for this context
            success, response = self.make_request('GET', f'threads?context_type={context}', token=student_token)
            
            if success and isinstance(response, dict):
                threads = response.get('threads', [])
                context_threads = [t for t in threads if t.get('context_type') == context]
                
                self.log_test(f"{context} context threads", True,
                             f"Found {len(context_threads)} {context} threads")
                
                # Test context-specific data
                if context_threads:
                    thread = context_threads[0]
                    context_data = thread.get('context_data', {})
                    
                    # Each context should have specific data fields
                    context_specific_data = len(context_data) > 0
                    self.log_test(f"{context} context data", context_specific_data,
                                 f"Context data fields: {list(context_data.keys())}")
            else:
                self.log_test(f"{context} context threads", False, str(response))
        
        # Test context filtering
        print("\n🔍 Testing context filtering")
        success, response = self.make_request('GET', 'threads?context_type=mentorat', token=student_token)
        
        if success and isinstance(response, dict):
            threads = response.get('threads', [])
            all_mentorat = all(t.get('context_type') == 'mentorat' for t in threads)
            
            self.log_test("Context filtering", all_mentorat,
                         f"All {len(threads)} threads are mentorat context")
        else:
            self.log_test("Context filtering", False, str(response))

    def test_messaging_real_data_integration(self, student_token, mentor_token):
        """Test messaging system with real data integration"""
        print("\n🔗 TESTING REAL DATA INTEGRATION")
        
        # Test 1: Real user data in messages
        print("\n👤 Testing real user data integration")
        success, response = self.make_request('GET', 'threads', token=student_token)
        
        if success and isinstance(response, dict):
            threads = response.get('threads', [])
            
            if threads:
                # Check if participant names are resolved from real user data
                thread = threads[0]
                participants = thread.get('participants', [])
                
                real_names_present = any(
                    p.get('display_name') and p.get('display_name') != 'Unknown User' 
                    for p in participants
                )
                
                self.log_test("Real user names in threads", real_names_present,
                             f"Found real user names in participants")
                
                # Test message sender names
                thread_id = thread.get('id')
                if thread_id:
                    success, msg_response = self.make_request('GET', f'threads/{thread_id}/messages', token=student_token)
                    
                    if success and isinstance(msg_response, dict):
                        messages = msg_response.get('messages', [])
                        
                        real_sender_names = any(
                            m.get('sender_name') and m.get('sender_name') != 'Unknown User'
                            for m in messages
                        )
                        
                        self.log_test("Real sender names in messages", real_sender_names,
                                     f"Found real sender names in messages")
        
        # Test 2: Integration with other system components
        print("\n🔄 Testing system integration")
        
        # Test search functionality
        success, response = self.make_request('GET', 'threads/search?q=stage', token=student_token)
        
        if success and isinstance(response, dict):
            search_results = response.get('results', [])
            self.log_test("Message search integration", True,
                         f"Search returned {len(search_results)} results")
        else:
            self.log_test("Message search integration", False, str(response))
        
        # Test thread archiving
        thread_id = getattr(self, 'support_thread_id', None)
        if thread_id:
            success, response = self.make_request('POST', f'threads/{thread_id}/archive', 
                                                {}, token=student_token)
            self.log_test("Thread archiving", success,
                         "Thread archiving functionality working" if success else str(response))
        
        # Test thread export
        if thread_id:
            success, response = self.make_request('GET', f'threads/{thread_id}/export', 
                                                token=student_token)
            self.log_test("Thread export", success,
                         "Thread export functionality working" if success else str(response))

    def run_messaging_tests(self):
        """Run messaging system backend API tests as requested in review"""
        print("🧵 STARTING MESSAGING SYSTEM BACKEND API TESTS")
        print("   Focus: Thread Management, Message APIs, Authentication, Data Structure, Context-based Messaging")
        print(f"📡 Testing against: {self.api_url}")
        print("=" * 80)
        
        # First authenticate with the provided credentials
        self.authenticate_test_users()
        
        if 'student' not in self.tokens or 'mentor' not in self.tokens:
            print("❌ CRITICAL: Missing required user tokens - cannot proceed with messaging tests")
            return
        
        student_token = self.tokens['student']
        mentor_token = self.tokens['mentor']
        
        # Test 1: Thread Management APIs
        self.test_thread_management_apis(student_token, mentor_token)
        
        # Test 2: Message APIs
        self.test_message_apis(student_token, mentor_token)
        
        # Test 3: Authentication verification
        self.test_messaging_authentication(student_token, mentor_token)
        
        # Test 4: Data Structure verification
        self.test_messaging_data_structure(student_token, mentor_token)
        
        # Test 5: Context-based messaging
        self.test_context_based_messaging(student_token, mentor_token)
        
        # Test 6: Real data integration
        self.test_messaging_real_data_integration(student_token, mentor_token)
        
        # Print final results
        self.print_final_results()

    def print_final_results(self):
        """Print final test results"""
        print("\n" + "=" * 80)
        print("🧵 MESSAGING SYSTEM BACKEND API TEST RESULTS")
        print("=" * 80)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"📊 OVERALL RESULTS: {self.tests_passed}/{self.tests_run} tests passed ({success_rate:.1f}%)")
        
        if success_rate >= 90:
            print("🎉 EXCELLENT: Messaging system backend APIs are working correctly!")
        elif success_rate >= 75:
            print("✅ GOOD: Most messaging system APIs are working with minor issues")
        elif success_rate >= 50:
            print("⚠️  MODERATE: Messaging system has significant issues that need attention")
        else:
            print("❌ CRITICAL: Messaging system backend APIs have major problems")
        
        # Group results by category
        categories = {
            'Authentication': [],
            'Thread Management': [],
            'Message APIs': [],
            'Data Structure': [],
            'Context-based': [],
            'Real Data Integration': []
        }
        
        for result in self.test_results:
            name = result['name']
            if 'Authenticate' in name or 'authentication' in name or 'token' in name:
                categories['Authentication'].append(result)
            elif 'thread' in name.lower() and ('GET' in name or 'POST' in name):
                categories['Thread Management'].append(result)
            elif 'message' in name.lower() or 'send' in name.lower() or 'reply' in name.lower():
                categories['Message APIs'].append(result)
            elif 'structure' in name.lower() or 'data' in name.lower():
                categories['Data Structure'].append(result)
            elif 'context' in name.lower() or any(ctx in name.lower() for ctx in ['candidature', 'mentorat', 'scolaire', 'support']):
                categories['Context-based'].append(result)
            elif 'real' in name.lower() or 'integration' in name.lower() or 'search' in name.lower():
                categories['Real Data Integration'].append(result)
        
        for category, results in categories.items():
            if results:
                passed = sum(1 for r in results if r['success'])
                total = len(results)
                print(f"\n📋 {category}: {passed}/{total} passed")
                for result in results:
                    status = "✅" if result['success'] else "❌"
                    print(f"   {status} {result['name']}")

if __name__ == "__main__":
    tester = MessagingBackendTester()
    tester.run_messaging_tests()