#!/usr/bin/env python3
"""
Student Response Management System Testing
Focus on testing the new endpoints for student-side mentor response management
"""

import requests
import sys
import json
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class StudentResponseSystemTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
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

    def test_student_response_management_system(self):
        """Test the new Student Response Management System endpoints"""
        print("🎯 TESTING STUDENT RESPONSE MANAGEMENT SYSTEM")
        print("   Testing comprehensive student-side mentor response management")
        print("=" * 80)
        
        # Use provided credentials from review request
        student_credentials = {"email": "student@emeres.fr", "password": "StudentPass123!"}
        mentor_credentials = {"email": "mentor@emeres.fr", "password": "MentorPass123!"}
        
        # Phase 1: Authentication and Basic Functionality
        print("\n📋 PHASE 1: AUTHENTICATION & BASIC FUNCTIONALITY")
        
        # Login as student
        success, student_response = self.make_request('POST', 'auth/login', student_credentials)
        if success and isinstance(student_response, dict):
            student_token = student_response.get('access_token')
            student_user = student_response.get('user', {})
            self.log_test("Student authentication", True, f"Student ID: {student_user.get('id', 'N/A')}")
        else:
            self.log_test("Student authentication", False, str(student_response))
            return
        
        # Login as mentor
        success, mentor_response = self.make_request('POST', 'auth/login', mentor_credentials)
        if success and isinstance(mentor_response, dict):
            mentor_token = mentor_response.get('access_token')
            mentor_user = mentor_response.get('user', {})
            self.log_test("Mentor authentication", True, f"Mentor ID: {mentor_user.get('id', 'N/A')}")
        else:
            self.log_test("Mentor authentication", False, str(mentor_response))
            return
        
        # Test 1: GET /api/student/ad-responses
        print("\n📥 Testing GET /api/student/ad-responses")
        success, responses_data = self.make_request('GET', 'student/ad-responses', token=student_token)
        if success and isinstance(responses_data, dict):
            expected_fields = ['responses', 'total_responses', 'pending_responses', 'accepted_responses', 'ads_with_responses']
            has_all_fields = all(field in responses_data for field in expected_fields)
            self.log_test("GET student ad-responses structure", has_all_fields, 
                         f"Total responses: {responses_data.get('total_responses', 0)}")
            
            # Store responses for later tests
            self.student_responses = responses_data.get('responses', [])
        else:
            self.log_test("GET student ad-responses", False, str(responses_data))
            return
        
        # Test 2: GET /api/student/conversations
        print("\n💬 Testing GET /api/student/conversations")
        success, conversations_data = self.make_request('GET', 'student/conversations', token=student_token)
        if success and isinstance(conversations_data, dict):
            conversations = conversations_data.get('conversations', [])
            self.log_test("GET student conversations", True, f"Found {len(conversations)} conversations")
            
            # Store conversation for messaging tests
            self.student_conversations = conversations
        else:
            self.log_test("GET student conversations", False, str(conversations_data))
        
        # Test 3: GET /api/student/notifications/unread-count
        print("\n🔔 Testing GET /api/student/notifications/unread-count")
        success, notifications_data = self.make_request('GET', 'student/notifications/unread-count', token=student_token)
        if success and isinstance(notifications_data, dict):
            expected_fields = ['unread_notifications', 'pending_responses', 'unread_messages', 'total_unread']
            has_all_fields = all(field in notifications_data for field in expected_fields)
            self.log_test("GET notifications unread-count", has_all_fields,
                         f"Total unread: {notifications_data.get('total_unread', 0)}")
        else:
            self.log_test("GET notifications unread-count", False, str(notifications_data))
        
        # Test 4: GET /api/student/dashboard/stats
        print("\n📊 Testing GET /api/student/dashboard/stats")
        success, stats_data = self.make_request('GET', 'student/dashboard/stats', token=student_token)
        if success and isinstance(stats_data, dict):
            expected_sections = ['ads', 'responses', 'conversations', 'recent_responses']
            has_all_sections = all(section in stats_data for section in expected_sections)
            self.log_test("GET dashboard stats", has_all_sections,
                         f"Ads: {stats_data.get('ads', {}).get('total', 0)}, Responses: {stats_data.get('responses', {}).get('total', 0)}")
        else:
            self.log_test("GET dashboard stats", False, str(stats_data))
        
        # Phase 2: Complete Workflow Testing
        print("\n🔄 PHASE 2: COMPLETE WORKFLOW TESTING")
        
        # Create a mentorship ad first
        print("\n📝 Creating mentorship ad for workflow test")
        ad_data = {
            "title": "Recherche mentor en développement web React - Test Workflow",
            "description": "Étudiant en informatique recherche un mentor expérimenté pour m'accompagner dans l'apprentissage de React et du développement web moderne.",
            "field_of_study": "Informatique",
            "desired_expertise": ["React", "JavaScript", "Développement Web", "Frontend"],
            "mentorship_goals": ["Maîtriser React", "Développer des projets concrets", "Préparer stage"],
            "mentorship_type": "individual",
            "duration_expected": "6 mois",
            "time_commitment": "2h/semaine",
            "preferred_communication": ["video", "chat"],
            "urgency_level": "high"
        }
        
        success, ad_response = self.make_request('POST', 'student/mentorship-ads', ad_data, token=student_token)
        if success and isinstance(ad_response, dict):
            created_ad_id = ad_response.get('id')
            self.log_test("Create mentorship ad for workflow", True, f"Ad ID: {created_ad_id}")
        else:
            self.log_test("Create mentorship ad for workflow", False, str(ad_response))
            # Try to use existing ad if creation failed
            existing_ads = self.make_request('GET', 'student/mentorship-ads', token=student_token)
            if existing_ads[0] and existing_ads[1]:
                ads_list = existing_ads[1]
                if ads_list and len(ads_list) > 0:
                    created_ad_id = ads_list[0].get('id')
                    self.log_test("Use existing ad for workflow", True, f"Using Ad ID: {created_ad_id}")
                else:
                    print("   ⚠️  No ads available for workflow testing")
                    return
            else:
                return
        
        # Mentor responds to the ad
        print("\n📤 Mentor responding to student ad")
        response_data = {
            "message": "Bonjour ! Je suis développeur senior avec 8 ans d'expérience en React. Je serais ravi de vous accompagner dans votre apprentissage. Mon approche se base sur des projets pratiques et un suivi personnalisé."
        }
        
        success, mentor_response = self.make_request('POST', f'mentor/mentorship-ads/{created_ad_id}/respond', 
                                                   response_data, token=mentor_token)
        if success and isinstance(mentor_response, dict):
            response_id = mentor_response.get('response_id')
            self.log_test("Mentor responds to ad", True, f"Response ID: {response_id}")
        else:
            self.log_test("Mentor responds to ad", False, str(mentor_response))
            # Try to get existing response for testing
            success, existing_responses = self.make_request('GET', 'student/ad-responses', token=student_token)
            if success and existing_responses.get('responses'):
                response_id = existing_responses['responses'][0].get('response_id')
                self.log_test("Use existing response for workflow", True, f"Using Response ID: {response_id}")
            else:
                print("   ⚠️  No responses available for workflow testing")
                return
        
        # Student views updated responses
        print("\n👀 Student checking updated responses")
        success, updated_responses = self.make_request('GET', 'student/ad-responses', token=student_token)
        if success and isinstance(updated_responses, dict):
            new_total = updated_responses.get('total_responses', 0)
            new_pending = updated_responses.get('pending_responses', 0)
            self.log_test("Updated responses after mentor reply", True, 
                         f"Total: {new_total}, Pending: {new_pending}")
            
            # Verify response data includes mentor details
            if updated_responses.get('responses'):
                first_response = updated_responses['responses'][0]
                mentor_fields = ['mentor_name', 'mentor_company', 'mentor_specializations', 'mentor_bio']
                has_mentor_details = any(field in first_response for field in mentor_fields)
                self.log_test("Response includes mentor details", has_mentor_details,
                             f"Mentor: {first_response.get('mentor_name', 'N/A')}")
        else:
            self.log_test("Updated responses after mentor reply", False, str(updated_responses))
        
        # Test 5: POST /api/student/ad-responses/{response_id}/action (Accept)
        print("\n✅ Testing POST /api/student/ad-responses/{response_id}/action (Accept)")
        accept_data = {
            "action": "accept",
            "message": "Merci pour votre réponse ! Je suis très intéressé par votre accompagnement. Quand pouvons-nous commencer ?"
        }
        
        success, accept_response = self.make_request('POST', f'student/ad-responses/{response_id}/action', 
                                                   accept_data, token=student_token)
        if success and isinstance(accept_response, dict):
            conversation_id = accept_response.get('conversation_id')
            self.log_test("Accept mentor response", True, f"Conversation created: {conversation_id}")
            
            # Store conversation ID for messaging tests
            self.test_conversation_id = conversation_id
        else:
            self.log_test("Accept mentor response", False, str(accept_response))
        
        # Verify conversation was created
        print("\n💬 Verifying conversation creation")
        success, updated_conversations = self.make_request('GET', 'student/conversations', token=student_token)
        if success and isinstance(updated_conversations, dict):
            conversations = updated_conversations.get('conversations', [])
            conversation_found = any(conv.get('conversation_id') == conversation_id for conv in conversations)
            self.log_test("Conversation created successfully", conversation_found,
                         f"Found conversation in list: {conversation_found}")
        else:
            self.log_test("Verify conversation creation", False, str(updated_conversations))
        
        # Phase 3: Messaging System Testing
        print("\n💬 PHASE 3: MESSAGING SYSTEM TESTING")
        
        if hasattr(self, 'test_conversation_id') and self.test_conversation_id:
            # Test 6: GET /api/conversation/{conversation_id}/messages
            print(f"\n📥 Testing GET /api/conversation/{self.test_conversation_id}/messages")
            success, messages_data = self.make_request('GET', f'conversation/{self.test_conversation_id}/messages', 
                                                     token=student_token)
            if success and isinstance(messages_data, dict):
                messages = messages_data.get('messages', [])
                self.log_test("GET conversation messages", True, f"Found {len(messages)} messages")
            else:
                self.log_test("GET conversation messages", False, str(messages_data))
            
            # Test 7: POST /api/conversation/{conversation_id}/messages
            print(f"\n📤 Testing POST /api/conversation/{self.test_conversation_id}/messages")
            message_data = {
                "message": "Bonjour ! Je suis très motivé pour commencer ce mentorat. Pouvez-vous me parler de votre méthode d'accompagnement ?",
                "message_type": "text"
            }
            
            success, send_response = self.make_request('POST', f'conversation/{self.test_conversation_id}/messages', 
                                                     message_data, token=student_token)
            if success and isinstance(send_response, dict):
                message_id = send_response.get('message_id')
                self.log_test("Send message in conversation", True, f"Message ID: {message_id}")
            else:
                self.log_test("Send message in conversation", False, str(send_response))
            
            # Verify message was added
            print("\n🔍 Verifying message was added")
            success, updated_messages = self.make_request('GET', f'conversation/{self.test_conversation_id}/messages', 
                                                        token=student_token)
            if success and isinstance(updated_messages, dict):
                messages = updated_messages.get('messages', [])
                student_messages = [msg for msg in messages if msg.get('sender_type') == 'student']
                self.log_test("Message added to conversation", len(student_messages) > 0,
                             f"Student messages: {len(student_messages)}")
            else:
                self.log_test("Verify message addition", False, str(updated_messages))
        else:
            print("   ⚠️  No conversation ID available for messaging tests")
        
        # Phase 4: Data Integrity and Security Testing
        print("\n🔒 PHASE 4: DATA INTEGRITY & SECURITY TESTING")
        
        # Test conversation isolation
        print("\n🔐 Testing conversation isolation")
        if hasattr(self, 'test_conversation_id') and self.test_conversation_id:
            # Try to access conversation with mentor token (should work)
            success, mentor_messages = self.make_request('GET', f'conversation/{self.test_conversation_id}/messages', 
                                                       token=mentor_token)
            self.log_test("Mentor can access conversation", success, 
                         "Mentor has proper access" if success else "Access denied")
            
            # Create another student token to test isolation
            other_student_data = {"email": "test-student@example.com", "password": "password123"}
            success, other_student_response = self.make_request('POST', 'auth/login', other_student_data)
            if success and isinstance(other_student_response, dict):
                other_student_token = other_student_response.get('access_token')
                
                # Try to access conversation with different student (should fail)
                success, unauthorized_access = self.make_request('GET', f'conversation/{self.test_conversation_id}/messages', 
                                                               token=other_student_token, expected_status=403)
                self.log_test("Conversation isolation security", success,
                             "Unauthorized access properly denied" if success else "Security breach detected")
            else:
                self.log_test("Create test student for isolation", False, "Could not create test student")
        
        # Test notification system
        print("\n🔔 Testing notification system updates")
        success, final_notifications = self.make_request('GET', 'student/notifications/unread-count', token=student_token)
        if success and isinstance(final_notifications, dict):
            total_unread = final_notifications.get('total_unread', 0)
            self.log_test("Notification system working", True, f"Total unread notifications: {total_unread}")
        else:
            self.log_test("Notification system test", False, str(final_notifications))
        
        # Test dashboard stats update
        print("\n📊 Testing dashboard stats updates")
        success, final_stats = self.make_request('GET', 'student/dashboard/stats', token=student_token)
        if success and isinstance(final_stats, dict):
            conversations_count = final_stats.get('conversations', {}).get('active', 0)
            responses_count = final_stats.get('responses', {}).get('total', 0)
            self.log_test("Dashboard stats updated", True, 
                         f"Active conversations: {conversations_count}, Total responses: {responses_count}")
        else:
            self.log_test("Dashboard stats update test", False, str(final_stats))
        
        # Test role-based access control
        print("\n🛡️  Testing role-based access control")
        
        # Company user trying to access student endpoints (should fail)
        company_credentials = {"email": "test-company@example.com", "password": "password123"}
        success, company_response = self.make_request('POST', 'auth/login', company_credentials)
        if success and isinstance(company_response, dict):
            company_token = company_response.get('access_token')
            
            # Try to access student ad-responses (should fail)
            success, unauthorized_responses = self.make_request('GET', 'student/ad-responses', 
                                                              token=company_token, expected_status=403)
            self.log_test("Company access to student endpoints denied", success,
                         "Access properly denied" if success else "Security breach")
        else:
            self.log_test("Company authentication for security test", False, "Could not authenticate company user")

    def print_final_results(self):
        """Print comprehensive test results"""
        print("\n" + "=" * 80)
        print("📊 STUDENT RESPONSE MANAGEMENT SYSTEM TEST RESULTS")
        print("=" * 80)
        
        print(f"Total Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        else:
            print("\n✅ ALL TESTS PASSED!")

if __name__ == "__main__":
    tester = StudentResponseSystemTester()
    tester.test_student_response_management_system()
    tester.print_final_results()