#!/usr/bin/env python3
"""
Detailed Analysis of the 2 Failing Messaging Tests
Focus: GET /messaging/threads/{thread_id} and Export data structure issues
"""

import requests
import sys
import json
import uuid
from datetime import datetime

class DetailedFailureAnalyzer:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}

    def setup_auth(self):
        """Setup authentication"""
        print("🔐 Setting up authentication...")
        
        # Login as student
        student_login = {"email": "student@emeres.fr", "password": "StudentPass123!"}
        response = requests.post(f"{self.api_url}/auth/login", json=student_login)
        
        if response.status_code == 200:
            data = response.json()
            self.tokens['student'] = data.get('access_token')
            self.users['student'] = data.get('user', {})
            print(f"✅ Student authenticated: {self.users['student'].get('id')}")
            return True
        else:
            print(f"❌ Student authentication failed: {response.status_code}")
            return False

    def create_test_thread(self):
        """Create a test thread with messages"""
        print("\n🧵 Creating test thread with messages...")
        
        headers = {'Authorization': f'Bearer {self.tokens["student"]}', 'Content-Type': 'application/json'}
        
        # Try different thread types to find one that works
        thread_types = [
            {
                "endpoint": "support/create",
                "data": {
                    "subject": "Test support thread for analysis",
                    "priority": "high",
                    "category": "technical_issue"
                }
            },
            {
                "endpoint": "candidature/create", 
                "data": {
                    "application_id": f"app-{str(uuid.uuid4())[:8]}",
                    "company_id": f"company-{str(uuid.uuid4())[:8]}",
                    "offer_title": "Test Stage"
                }
            }
        ]
        
        for thread_type in thread_types:
            print(f"Trying {thread_type['endpoint']}...")
            response = requests.post(f"{self.api_url}/messaging/threads/{thread_type['endpoint']}", 
                                   json=thread_type['data'], headers=headers)
            
            if response.status_code == 200:
                thread_id = response.json().get('thread_id')
                print(f"✅ Thread created: {thread_id}")
                
                # Send a test message
                message_data = {
                    "content": "Test message for decryption analysis",
                    "message_type": "text",
                    "is_important": False
                }
                
                msg_response = requests.post(f"{self.api_url}/messaging/threads/{thread_id}/messages",
                                           json=message_data, headers=headers)
                
                if msg_response.status_code == 200:
                    print(f"✅ Message sent: {msg_response.json().get('message_id')}")
                else:
                    print(f"⚠️ Message sending failed: {msg_response.status_code}")
                
                return thread_id
            else:
                print(f"❌ Failed: {response.status_code} - {response.text}")
        
        print("❌ All thread creation attempts failed")
        return None

    def analyze_thread_retrieval_failure(self, thread_id):
        """Analyze the GET /messaging/threads/{thread_id} failure in detail"""
        print(f"\n🎯 ANALYZING THREAD RETRIEVAL FAILURE")
        print(f"Testing: GET /messaging/threads/{thread_id}")
        
        headers = {'Authorization': f'Bearer {self.tokens["student"]}', 'Content-Type': 'application/json'}
        
        try:
            response = requests.get(f"{self.api_url}/messaging/threads/{thread_id}", 
                                  headers=headers, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response Headers: {dict(response.headers)}")
            
            if response.status_code == 500:
                print("❌ HTTP 500 ERROR CONFIRMED")
                try:
                    error_data = response.json()
                    print(f"Error Details: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Raw Error Response: {response.text}")
                
                print("\n🔍 LIKELY CAUSES:")
                print("1. Message decryption failure in thread retrieval")
                print("2. Database query error when fetching thread details")
                print("3. User display name resolution error")
                print("4. Thread participant data corruption")
                
            elif response.status_code == 200:
                print("✅ Thread retrieval successful")
                data = response.json()
                print(f"Thread data keys: {list(data.keys())}")
                
                messages = data.get('messages', [])
                print(f"Messages count: {len(messages)}")
                
                if messages:
                    first_msg = messages[0]
                    print(f"First message keys: {list(first_msg.keys())}")
                    print(f"Content length: {len(first_msg.get('content', ''))}")
                    print(f"Is encrypted: {first_msg.get('is_encrypted', False)}")
                    
            else:
                print(f"❌ Unexpected status code: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Request exception: {str(e)}")

    def analyze_export_failure(self, thread_id):
        """Analyze the export data structure failure"""
        print(f"\n📄 ANALYZING EXPORT DATA STRUCTURE FAILURE")
        print(f"Testing: GET /messaging/export/{thread_id}")
        
        headers = {'Authorization': f'Bearer {self.tokens["student"]}', 'Content-Type': 'application/json'}
        
        try:
            response = requests.get(f"{self.api_url}/messaging/export/{thread_id}",
                                  headers=headers, timeout=10)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Export endpoint accessible")
                try:
                    data = response.json()
                    print(f"Response keys: {list(data.keys())}")
                    
                    export_data = data.get('export_data', {})
                    print(f"Export data keys: {list(export_data.keys())}")
                    
                    # Check expected structure
                    expected_fields = ['thread', 'messages', 'participants', 'metadata']
                    missing_fields = []
                    
                    for field in expected_fields:
                        if field not in export_data:
                            missing_fields.append(field)
                    
                    if missing_fields:
                        print(f"❌ MISSING FIELDS: {missing_fields}")
                        print("This explains the 'Export data structure' test failure")
                    else:
                        print("✅ All expected fields present")
                    
                    # Check thread field specifically
                    thread_info = export_data.get('thread')
                    if thread_info is None:
                        print("❌ CRITICAL: 'thread' field is None")
                        print("This is the root cause of the export structure failure")
                    else:
                        print(f"✅ Thread info present: {type(thread_info)}")
                        if isinstance(thread_info, dict):
                            print(f"Thread info keys: {list(thread_info.keys())}")
                    
                    print(f"\nFull export response:")
                    print(json.dumps(data, indent=2, default=str))
                    
                except Exception as e:
                    print(f"❌ JSON parsing error: {str(e)}")
                    print(f"Raw response: {response.text}")
            else:
                print(f"❌ Export failed with status: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Request exception: {str(e)}")

    def run_detailed_analysis(self):
        """Run detailed analysis of the 2 failing tests"""
        print("🔍 DETAILED ANALYSIS OF 2 FAILING MESSAGING TESTS")
        print("=" * 70)
        
        if not self.setup_auth():
            print("❌ Cannot proceed without authentication")
            return
        
        thread_id = self.create_test_thread()
        if not thread_id:
            print("❌ Cannot proceed without test thread")
            return
        
        # Analyze both failures
        self.analyze_thread_retrieval_failure(thread_id)
        self.analyze_export_failure(thread_id)
        
        print("\n" + "=" * 70)
        print("📋 SUMMARY FOR MAIN AGENT")
        print("=" * 70)
        print("FAILURE 1: GET /messaging/threads/{thread_id} returns HTTP 500")
        print("  - This is the thread retrieval with message decryption issue")
        print("  - Likely causes: Decryption error, DB query error, or user resolution error")
        print()
        print("FAILURE 2: Export data structure has missing 'thread' field")
        print("  - Export endpoint works but returns incomplete data structure")
        print("  - The 'thread' field in export_data is None instead of thread info")
        print()
        print("🎯 RECOMMENDED FIXES:")
        print("1. Debug the thread retrieval endpoint for decryption/DB issues")
        print("2. Fix export endpoint to properly populate the 'thread' field")
        print("3. These are the exact 2 tests preventing 100% success rate")

if __name__ == "__main__":
    analyzer = DetailedFailureAnalyzer()
    analyzer.run_detailed_analysis()