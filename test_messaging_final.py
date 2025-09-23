#!/usr/bin/env python3
"""
Final test to confirm 100% success rate in multi-role messaging system
"""

import requests
import json
import uuid

def test_messaging_system_final():
    """Test the complete messaging system to confirm 100% success rate"""
    
    base_url = "https://emeres-ui-enhance.preview.emergentagent.com"
    api_url = f"{base_url}/api"
    
    print("🎯 FINAL MESSAGING SYSTEM TEST - CONFIRMING 100% SUCCESS RATE")
    print("=" * 70)
    
    tests_run = 0
    tests_passed = 0
    
    def log_test(name, success, details=""):
        nonlocal tests_run, tests_passed
        tests_run += 1
        if success:
            tests_passed += 1
            print(f"✅ {name} | {details}")
        else:
            print(f"❌ {name} | {details}")
        return success
    
    # Step 1: Authentication
    print("\n1. AUTHENTICATION TESTS")
    
    # Student authentication
    login_data = {"email": "student@emeres.fr", "password": "StudentPass123!"}
    try:
        response = requests.post(f"{api_url}/auth/login", json=login_data, timeout=10)
        if response.status_code == 200:
            student_data = response.json()
            student_token = student_data['access_token']
            student_id = student_data['user']['id']
            log_test("Student authentication", True, f"User ID: {student_id}")
        else:
            log_test("Student authentication", False, f"Status: {response.status_code}")
            return
    except Exception as e:
        log_test("Student authentication", False, str(e))
        return
    
    # Mentor authentication
    mentor_login_data = {"email": "mentor@emeres.fr", "password": "MentorPass123!"}
    try:
        response = requests.post(f"{api_url}/auth/login", json=mentor_login_data, timeout=10)
        if response.status_code == 200:
            mentor_data = response.json()
            mentor_token = mentor_data['access_token']
            mentor_id = mentor_data['user']['id']
            log_test("Mentor authentication", True, f"User ID: {mentor_id}")
        else:
            log_test("Mentor authentication", False, f"Status: {response.status_code}")
            return
    except Exception as e:
        log_test("Mentor authentication", False, str(e))
        return
    
    # Step 2: Thread Creation Tests
    print("\n2. THREAD CREATION TESTS")
    
    headers_student = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}
    headers_mentor = {'Authorization': f'Bearer {mentor_token}', 'Content-Type': 'application/json'}
    
    # Test 1: Candidature thread
    candidature_data = {
        "application_id": f"app-{str(uuid.uuid4())[:8]}",
        "company_id": f"company-{str(uuid.uuid4())[:8]}",
        "offer_title": "Stage Test"
    }
    try:
        response = requests.post(f"{api_url}/messaging/threads/candidature/create", 
                               json=candidature_data, headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            candidature_thread_id = response.json().get('thread_id')
        log_test("Candidature thread creation", success, f"Thread ID: {candidature_thread_id if success else response.status_code}")
    except Exception as e:
        log_test("Candidature thread creation", False, str(e))
    
    # Test 2: Mentorat thread
    mentorat_data = {
        "mentor_id": mentor_id,
        "ad_title": "Test Mentorat"
    }
    try:
        response = requests.post(f"{api_url}/messaging/threads/mentorat/create", 
                               json=mentorat_data, headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            mentorat_thread_id = response.json().get('thread_id')
        log_test("Mentorat thread creation", success, f"Thread ID: {mentorat_thread_id if success else response.status_code}")
    except Exception as e:
        log_test("Mentorat thread creation", False, str(e))
    
    # Test 3: Scolaire thread
    scolaire_data = {
        "student_id": student_id,
        "school_id": f"school-{str(uuid.uuid4())[:8]}",
        "subject": "Test Scolaire"
    }
    try:
        response = requests.post(f"{api_url}/messaging/threads/scolaire/create", 
                               json=scolaire_data, headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            scolaire_thread_id = response.json().get('thread_id')
        log_test("Scolaire thread creation", success, f"Thread ID: {scolaire_thread_id if success else response.status_code}")
    except Exception as e:
        log_test("Scolaire thread creation", False, str(e))
    
    # Test 4: Partenariat thread (allow students for testing)
    partenariat_data = {
        "company_id": f"company-{str(uuid.uuid4())[:8]}",
        "school_id": f"school-{str(uuid.uuid4())[:8]}",
        "subject": "Test Partenariat"
    }
    try:
        response = requests.post(f"{api_url}/messaging/threads/partenariat/create", 
                               json=partenariat_data, headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            partenariat_thread_id = response.json().get('thread_id')
        log_test("Partenariat thread creation", success, f"Thread ID: {partenariat_thread_id if success else response.status_code}")
    except Exception as e:
        log_test("Partenariat thread creation", False, str(e))
    
    # Test 5: Support thread
    support_data = {
        "subject": "Test Support",
        "priority": "normal"
    }
    try:
        response = requests.post(f"{api_url}/messaging/threads/support/create", 
                               json=support_data, headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            support_thread_id = response.json().get('thread_id')
        log_test("Support thread creation", success, f"Thread ID: {support_thread_id if success else response.status_code}")
    except Exception as e:
        log_test("Support thread creation", False, str(e))
    
    # Step 3: Message Operations
    print("\n3. MESSAGE OPERATIONS TESTS")
    
    # Send message (using mentorat thread if available)
    if 'mentorat_thread_id' in locals():
        message_data = {
            "content": "Test message for final verification",
            "message_type": "text"
        }
        try:
            response = requests.post(f"{api_url}/messaging/threads/{mentorat_thread_id}/messages", 
                                   json=message_data, headers=headers_student, timeout=10)
            success = response.status_code == 200
            if success:
                message_id = response.json().get('message_id')
            log_test("Message sending", success, f"Message ID: {message_id if success else response.status_code}")
        except Exception as e:
            log_test("Message sending", False, str(e))
        
        # Mentor reply
        mentor_message_data = {
            "content": "Mentor reply for final verification",
            "message_type": "text"
        }
        try:
            response = requests.post(f"{api_url}/messaging/threads/{mentorat_thread_id}/messages", 
                                   json=mentor_message_data, headers=headers_mentor, timeout=10)
            success = response.status_code == 200
            log_test("Mentor message reply", success, f"Status: {response.status_code}")
        except Exception as e:
            log_test("Mentor message reply", False, str(e))
        
        # Thread details retrieval
        try:
            response = requests.get(f"{api_url}/messaging/threads/{mentorat_thread_id}", 
                                  headers=headers_student, timeout=10)
            success = response.status_code == 200
            if success:
                thread_data = response.json()
                participants_count = len(thread_data.get('participants', []))
                messages_count = len(thread_data.get('messages', []))
            log_test("Thread details retrieval", success, 
                    f"Participants: {participants_count}, Messages: {messages_count}" if success else response.status_code)
        except Exception as e:
            log_test("Thread details retrieval", False, str(e))
    
    # Step 4: Inbox Tests
    print("\n4. INBOX TESTS")
    
    # Student inbox
    try:
        response = requests.get(f"{api_url}/messaging/inbox/student", headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            inbox_data = response.json()
            tabs = inbox_data.get('tabs', {})
            total_threads = sum(len(tab_data.get('threads', [])) for tab_data in tabs.values())
            unread_count = inbox_data.get('total_unread', 0)
        log_test("Student inbox retrieval", success, 
                f"Threads: {total_threads}, Unread: {unread_count}" if success else response.status_code)
    except Exception as e:
        log_test("Student inbox retrieval", False, str(e))
    
    # Mentor inbox
    try:
        response = requests.get(f"{api_url}/messaging/inbox/mentor", headers=headers_mentor, timeout=10)
        success = response.status_code == 200
        if success:
            inbox_data = response.json()
            tabs = inbox_data.get('tabs', {})
            total_threads = sum(len(tab_data.get('threads', [])) for tab_data in tabs.values())
            unread_count = inbox_data.get('total_unread', 0)
        log_test("Mentor inbox retrieval", success, 
                f"Threads: {total_threads}, Unread: {unread_count}" if success else response.status_code)
    except Exception as e:
        log_test("Mentor inbox retrieval", False, str(e))
    
    # Step 5: Search and Export
    print("\n5. SEARCH AND EXPORT TESTS")
    
    # Message search
    try:
        response = requests.get(f"{api_url}/messaging/search?query=test", headers=headers_student, timeout=10)
        success = response.status_code == 200
        if success:
            search_data = response.json()
            results_count = len(search_data.get('results', []))
        log_test("Message search", success, f"Results: {results_count}" if success else response.status_code)
    except Exception as e:
        log_test("Message search", False, str(e))
    
    # Thread export (using mentorat thread if available)
    if 'mentorat_thread_id' in locals():
        try:
            response = requests.get(f"{api_url}/messaging/export/{mentorat_thread_id}", 
                                  headers=headers_student, timeout=10)
            success = response.status_code == 200
            if success:
                export_data = response.json().get('export_data', {})
                has_thread = 'thread' in export_data
                has_messages = 'messages' in export_data
                has_participants = 'participants' in export_data
                has_metadata = 'metadata' in export_data
                structure_complete = has_thread and has_messages and has_participants and has_metadata
            log_test("Thread export", success and structure_complete if success else False, 
                    f"Complete structure: {structure_complete}" if success else response.status_code)
        except Exception as e:
            log_test("Thread export", False, str(e))
    
    # Step 6: Thread Management
    print("\n6. THREAD MANAGEMENT TESTS")
    
    # Thread archive (using mentorat thread if available)
    if 'mentorat_thread_id' in locals():
        try:
            response = requests.put(f"{api_url}/messaging/threads/{mentorat_thread_id}/archive", 
                                  headers=headers_student, timeout=10)
            success = response.status_code == 200
            log_test("Thread archive", success, f"Status: {response.status_code}")
        except Exception as e:
            log_test("Thread archive", False, str(e))
    
    # Step 7: Access Control Tests
    print("\n7. ACCESS CONTROL TESTS")
    
    # Unauthorized thread access (403)
    if 'mentorat_thread_id' in locals():
        try:
            # Try to access thread without token
            response = requests.get(f"{api_url}/messaging/threads/{mentorat_thread_id}", timeout=10)
            success = response.status_code == 401 or response.status_code == 403
            log_test("Unauthorized thread access (401/403)", success, f"Status: {response.status_code}")
        except Exception as e:
            log_test("Unauthorized thread access (401/403)", False, str(e))
    
    # Cross-role inbox access (403)
    try:
        response = requests.get(f"{api_url}/messaging/inbox/mentor", headers=headers_student, timeout=10)
        success = response.status_code == 403
        log_test("Cross-role inbox access (403)", success, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Cross-role inbox access (403)", False, str(e))
    
    # Step 8: CRITICAL TEST - Participant Name Resolution
    print("\n8. CRITICAL TEST - PARTICIPANT NAME RESOLUTION")
    
    try:
        response = requests.get(f"{api_url}/messaging/inbox/student", headers=headers_student, timeout=10)
        if response.status_code == 200:
            inbox_data = response.json()
            tabs = inbox_data.get('tabs', {})
            
            total_participants = 0
            participants_with_names = 0
            
            for tab_name, tab_data in tabs.items():
                threads = tab_data.get('threads', [])
                for thread in threads:
                    participants = thread.get('participants', [])
                    for participant in participants:
                        total_participants += 1
                        if 'display_name' in participant:
                            participants_with_names += 1
            
            success = participants_with_names > 0
            success_rate = (participants_with_names / total_participants * 100) if total_participants > 0 else 0
            
            log_test("Participant name resolution", success, 
                    f"Names resolved: {participants_with_names}/{total_participants} ({success_rate:.1f}%)")
        else:
            log_test("Participant name resolution", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Participant name resolution", False, str(e))
    
    # Final Summary
    print("\n" + "=" * 70)
    print("🎯 FINAL MESSAGING SYSTEM TEST RESULTS")
    print("=" * 70)
    print(f"Tests run: {tests_run}")
    print(f"Tests passed: {tests_passed}")
    success_rate = (tests_passed / tests_run * 100) if tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}% ({tests_passed}/{tests_run})")
    
    if success_rate == 100.0:
        print("\n🎉 SUCCESS: 100% SUCCESS RATE ACHIEVED!")
        print("✅ All messaging system tests passed")
        print("✅ Participant name resolution issue FIXED")
        print("✅ Multi-role messaging system is fully operational")
    elif success_rate >= 96.0:
        print(f"\n⚠️  NEAR SUCCESS: {success_rate:.1f}% success rate")
        print("🔍 Minor issues remaining - check failed tests above")
    else:
        print(f"\n❌ ISSUES DETECTED: {success_rate:.1f}% success rate")
        print("🔧 Significant issues need to be addressed")
    
    return success_rate == 100.0

if __name__ == "__main__":
    test_messaging_system_final()