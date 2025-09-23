#!/usr/bin/env python3
"""
Test script to identify the participant name resolution issue in messaging system
"""

import requests
import json

def test_participant_name_resolution():
    """Test the specific participant name resolution issue"""
    
    base_url = "https://emeres-ui-enhance.preview.emergentagent.com"
    api_url = f"{base_url}/api"
    
    print("🔍 TESTING PARTICIPANT NAME RESOLUTION ISSUE")
    print("=" * 60)
    
    # Step 1: Authenticate as student
    print("\n1. Authenticating as student...")
    login_data = {"email": "student@emeres.fr", "password": "StudentPass123!"}
    
    try:
        response = requests.post(f"{api_url}/auth/login", json=login_data, timeout=10)
        if response.status_code == 200:
            student_data = response.json()
            student_token = student_data['access_token']
            student_id = student_data['user']['id']
            print(f"✅ Student authenticated: {student_id}")
        else:
            print(f"❌ Student authentication failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Student authentication error: {e}")
        return
    
    # Step 2: Authenticate as mentor
    print("\n2. Authenticating as mentor...")
    mentor_login_data = {"email": "mentor@emeres.fr", "password": "MentorPass123!"}
    
    try:
        response = requests.post(f"{api_url}/auth/login", json=mentor_login_data, timeout=10)
        if response.status_code == 200:
            mentor_data = response.json()
            mentor_token = mentor_data['access_token']
            mentor_id = mentor_data['user']['id']
            print(f"✅ Mentor authenticated: {mentor_id}")
        else:
            print(f"❌ Mentor authentication failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Mentor authentication error: {e}")
        return
    
    # Step 3: Create a mentorat thread
    print("\n3. Creating mentorat thread...")
    thread_data = {
        "mentor_id": mentor_id,
        "ad_title": "Test Mentorat Thread",
        "ad_field": "Informatique"
    }
    
    headers = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}
    
    try:
        response = requests.post(f"{api_url}/messaging/threads/mentorat/create", 
                               json=thread_data, headers=headers, timeout=10)
        if response.status_code == 200:
            thread_response = response.json()
            thread_id = thread_response['thread_id']
            print(f"✅ Thread created: {thread_id}")
        else:
            print(f"❌ Thread creation failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Thread creation error: {e}")
        return
    
    # Step 4: Send a message to populate the thread
    print("\n4. Sending test message...")
    message_data = {
        "content": "Test message for participant name resolution",
        "message_type": "text"
    }
    
    try:
        response = requests.post(f"{api_url}/messaging/threads/{thread_id}/messages", 
                               json=message_data, headers=headers, timeout=10)
        if response.status_code == 200:
            message_response = response.json()
            print(f"✅ Message sent: {message_response.get('message_id')}")
        else:
            print(f"❌ Message sending failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Message sending error: {e}")
    
    # Step 5: Check student inbox for participant names
    print("\n5. Checking student inbox for participant names...")
    
    try:
        response = requests.get(f"{api_url}/messaging/inbox/student", headers=headers, timeout=10)
        if response.status_code == 200:
            inbox_data = response.json()
            print(f"✅ Inbox retrieved successfully")
            
            # Analyze participant data
            total_participants = 0
            participants_with_names = 0
            
            tabs = inbox_data.get('tabs', {})
            for tab_name, tab_data in tabs.items():
                threads = tab_data.get('threads', [])
                print(f"\n📋 Tab: {tab_name} ({len(threads)} threads)")
                
                for i, thread in enumerate(threads):
                    participants = thread.get('participants', [])
                    print(f"  Thread {i+1}: {len(participants)} participants")
                    
                    for j, participant in enumerate(participants):
                        total_participants += 1
                        print(f"    Participant {j+1}:")
                        print(f"      - user_id: {participant.get('user_id', 'N/A')}")
                        print(f"      - role: {participant.get('role', 'N/A')}")
                        print(f"      - permissions: {participant.get('permissions', [])}")
                        
                        # Check for display name fields
                        has_name = False
                        if 'display_name' in participant:
                            print(f"      - display_name: {participant['display_name']}")
                            has_name = True
                            participants_with_names += 1
                        if 'name' in participant:
                            print(f"      - name: {participant['name']}")
                            has_name = True
                            participants_with_names += 1
                        if 'first_name' in participant:
                            print(f"      - first_name: {participant['first_name']}")
                            has_name = True
                        if 'last_name' in participant:
                            print(f"      - last_name: {participant['last_name']}")
                            has_name = True
                        
                        if not has_name:
                            print(f"      ❌ NO DISPLAY NAME FOUND")
            
            print(f"\n📊 SUMMARY:")
            print(f"   Total participants: {total_participants}")
            print(f"   Participants with names: {participants_with_names}")
            print(f"   Success rate: {(participants_with_names/total_participants*100) if total_participants > 0 else 0:.1f}%")
            
            if participants_with_names == 0:
                print(f"\n❌ ISSUE CONFIRMED: No participant names are being resolved!")
                print(f"   This is the root cause of the 96.2% success rate (25/26 tests)")
                return False
            else:
                print(f"\n✅ Participant names are being resolved correctly")
                return True
                
        else:
            print(f"❌ Inbox retrieval failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Inbox retrieval error: {e}")
        return False

if __name__ == "__main__":
    test_participant_name_resolution()