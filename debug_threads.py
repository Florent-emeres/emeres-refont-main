#!/usr/bin/env python3
"""
Debug script to check existing mentorship conversations and create proper test data
"""

import requests
import json

def make_request(method, endpoint, data=None, token=None):
    base_url = "https://emeres-ui-enhance.preview.emergentagent.com"
    api_url = f"{base_url}/api"
    url = f"{api_url}/{endpoint}"
    headers = {'Content-Type': 'application/json'}
    
    if token:
        headers['Authorization'] = f'Bearer {token}'

    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=10)
        
        print(f"{method} {endpoint} -> Status: {response.status_code}")
        
        if response.status_code < 400:
            try:
                return response.json()
            except:
                return response.text
        else:
            try:
                error = response.json()
                print(f"Error: {error}")
                return error
            except:
                print(f"Error: {response.text}")
                return response.text
    except Exception as e:
        print(f"Request failed: {e}")
        return None

def main():
    print("🔍 DEBUGGING MENTORSHIP CONVERSATIONS FOR THREAD TESTING")
    
    # Login as student
    student_credentials = {"email": "student@emeres.fr", "password": "StudentPass123!"}
    student_response = make_request('POST', 'auth/login', student_credentials)
    
    if not student_response or 'access_token' not in student_response:
        print("❌ Student login failed")
        return
    
    student_token = student_response['access_token']
    student_id = student_response['user']['id']
    print(f"✅ Student logged in: {student_id}")
    
    # Login as mentor
    mentor_credentials = {"email": "mentor@emeres.fr", "password": "MentorPass123!"}
    mentor_response = make_request('POST', 'auth/login', mentor_credentials)
    
    if not mentor_response or 'access_token' not in mentor_response:
        print("❌ Mentor login failed")
        return
    
    mentor_token = mentor_response['access_token']
    mentor_id = mentor_response['user']['id']
    print(f"✅ Mentor logged in: {mentor_id}")
    
    # Check existing conversations
    print("\n🔍 Checking existing mentorship conversations...")
    conversations = make_request('GET', 'student/conversations', token=student_token)
    
    if conversations and isinstance(conversations, dict):
        conv_list = conversations.get('conversations', [])
        print(f"Found {len(conv_list)} conversations")
        
        if conv_list:
            for i, conv in enumerate(conv_list):
                print(f"  Conversation {i+1}: {json.dumps(conv, indent=2)}")
                
                # Try to create thread with this conversation
                conv_id = conv.get('conversation_id') or conv.get('id')
                if conv_id:
                    thread_data = {"mentorship_id": conv_id}
                    thread_result = make_request('POST', 'threads/mentorship/create', thread_data, token=student_token)
                else:
                    print("  ❌ Conversation has no ID, skipping thread creation")
                    continue
                
                if thread_result and isinstance(thread_result, dict) and 'thread_id' in thread_result:
                    print(f"  ✅ Thread created successfully: {thread_result['thread_id']}")
                    
                    # Test sending a message
                    message_data = {"message": "Test message for thread architecture", "message_type": "text"}
                    msg_result = make_request('POST', f"threads/{thread_result['thread_id']}/messages", message_data, token=student_token)
                    
                    if msg_result and isinstance(msg_result, dict) and 'message_id' in msg_result:
                        print(f"  ✅ Message sent successfully: {msg_result['message_id']}")
                        
                        # Test retrieving messages
                        messages = make_request('GET', f"threads/{thread_result['thread_id']}/messages", token=student_token)
                        if messages and isinstance(messages, dict):
                            msg_list = messages.get('messages', [])
                            print(f"  ✅ Retrieved {len(msg_list)} messages")
                            print(f"    Full response: {json.dumps(messages, indent=2)}")
                            
                            if msg_list:
                                first_msg = msg_list[0]
                                print(f"    Message content: {first_msg.get('content', '')[:50]}...")
                                print(f"    Sender role: {first_msg.get('sender_role')}")
                                print(f"    Is encrypted: {first_msg.get('is_encrypted', 'N/A')}")
                            else:
                                print("    No messages in the list")
                        else:
                            print(f"  ❌ Failed to retrieve messages: {messages}")
                    else:
                        print(f"  ❌ Failed to send message: {msg_result}")
                else:
                    print(f"  ❌ Failed to create thread: {thread_result}")
        else:
            print("No existing conversations found")
            
            # Try to create a mentorship conversation first
            print("\n🔧 Attempting to create mentorship conversation...")
            
            # First check if there are mentorship ads and responses
            ads = make_request('GET', 'student/mentorship-ads', token=student_token)
            if ads and isinstance(ads, list) and len(ads) > 0:
                print(f"Found {len(ads)} mentorship ads")
                
                # Check mentor responses
                responses = make_request('GET', 'student/ad-responses', token=student_token)
                if responses and isinstance(responses, dict):
                    response_list = responses.get('responses', [])
                    print(f"Found {len(response_list)} mentor responses")
                    
                    if response_list:
                        # Try to accept a response to create a conversation
                        first_response = response_list[0]
                        response_id = first_response.get('id')
                        
                        accept_data = {"action": "accept", "message": "J'accepte votre proposition de mentorat"}
                        accept_result = make_request('POST', f'student/ad-responses/{response_id}/action', accept_data, token=student_token)
                        
                        if accept_result:
                            print(f"✅ Response accepted: {accept_result}")
                            
                            # Check conversations again
                            new_conversations = make_request('GET', 'student/conversations', token=student_token)
                            if new_conversations and isinstance(new_conversations, dict):
                                new_conv_list = new_conversations.get('conversations', [])
                                print(f"Now found {len(new_conv_list)} conversations after accepting response")
                        else:
                            print(f"❌ Failed to accept response: {accept_result}")
    else:
        print(f"❌ Failed to get conversations: {conversations}")

if __name__ == "__main__":
    main()