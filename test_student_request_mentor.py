#!/usr/bin/env python3
"""
Focused test for STUDENT REQUEST MENTOR ENDPOINT BUG FIX
Tests the fix for 'Mentor not found or not available' error
"""

import requests
import sys
import json
from datetime import datetime

class StudentRequestMentorTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

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
        return success

    def make_request(self, method: str, endpoint: str, data=None, token=None, expected_status: int = 200):
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

    def test_student_request_mentor_bug_fix(self):
        """Test the STUDENT REQUEST MENTOR ENDPOINT BUG FIX"""
        print("🎯 TESTING STUDENT REQUEST MENTOR ENDPOINT BUG FIX")
        print("   Testing the fix for 'Mentor not found or not available' error")
        print("=" * 80)
        
        # Phase 1: Basic Functionality
        print("\n📋 Phase 1: Basic Functionality")
        
        # Login with student credentials
        student_login_data = {"email": "student@emeres.fr", "password": "StudentPass123!"}
        success, login_response = self.make_request('POST', 'auth/login', student_login_data)
        
        if not success:
            self.log_test("Student authentication", False, f"Login failed: {login_response}")
            return
        
        student_token = login_response.get('access_token')
        student_user = login_response.get('user', {})
        self.log_test("Student authentication", True, f"Logged in as {student_user.get('email')}")
        
        # Verify endpoint exists and responds correctly
        test_request_data = {"mentor_id": "test-mentor-id", "message": "Test message"}
        success, response = self.make_request('POST', 'student/request-mentor', test_request_data, 
                                            token=student_token, expected_status=404)
        self.log_test("Endpoint exists and validates", success, "Endpoint properly validates mentor ID")
        
        # Test authentication and role validation
        success, response = self.make_request('POST', 'student/request-mentor', test_request_data, 
                                            expected_status=401)
        self.log_test("Authentication required", success, "Endpoint requires authentication")
        
        # Phase 2: Database Mentor Request
        print("\n📊 Phase 2: Database Mentor Request")
        
        # Get real mentor ID from database (mentor@emeres.fr profile)
        mentor_login_data = {"email": "mentor@emeres.fr", "password": "MentorPass123!"}
        success, mentor_login_response = self.make_request('POST', 'auth/login', mentor_login_data)
        
        if not success:
            self.log_test("Get database mentor ID", False, f"Mentor login failed: {mentor_login_response}")
            return
        
        mentor_user = mentor_login_response.get('user', {})
        mentor_id = mentor_user.get('id')
        self.log_test("Get database mentor ID", True, f"Found mentor ID: {mentor_id}")
        
        # Test POST /api/student/request-mentor with database mentor ID
        db_request_data = {
            "mentor_id": mentor_id,
            "message": "Je souhaiterais bénéficier de votre expertise en développement web et intelligence artificielle pour mon projet de fin d'études."
        }
        
        success, response = self.make_request('POST', 'student/request-mentor', db_request_data, 
                                            token=student_token)
        
        if success:
            self.log_test("Database mentor request - NO ERROR", True, 
                         "✅ Successfully requested database mentor without 'Mentor not found' error")
            
            # Verify response structure
            expected_fields = ['success', 'request_id', 'message', 'expires_at']
            has_all_fields = all(field in response for field in expected_fields)
            self.log_test("Database mentor response format", has_all_fields,
                         f"Response includes: {list(response.keys())}")
        else:
            error_msg = str(response)
            if "Mentor not found or not available" in error_msg:
                self.log_test("Database mentor request - NO ERROR", False, 
                             "❌ CRITICAL: Still getting 'Mentor not found' error for database mentor")
            elif "already exists" in error_msg.lower():
                self.log_test("Database mentor request - NO ERROR", True, 
                             "✅ Request already exists - mentor found successfully (fix working)")
            else:
                self.log_test("Database mentor request - NO ERROR", False, f"Other error: {error_msg}")
        
        # Phase 3: Fake Data Fallback
        print("\n🔄 Phase 3: Fake Data Fallback")
        
        # Test with fake mentor IDs from AVAILABLE_MENTORS_FOR_STUDENTS
        fake_mentor_ids = ["user-mentor-001", "user-mentor-002", "user-mentor-003"]
        
        for fake_id in fake_mentor_ids:
            fake_request_data = {
                "mentor_id": fake_id,
                "message": f"Test request to fake mentor {fake_id}"
            }
            
            success, response = self.make_request('POST', 'student/request-mentor', fake_request_data, 
                                                token=student_token)
            
            if success:
                self.log_test(f"Fake mentor fallback ({fake_id})", True, 
                             "✅ Fallback logic works for fake mentor IDs")
            else:
                error_msg = str(response)
                if "already exists" in error_msg.lower():
                    self.log_test(f"Fake mentor fallback ({fake_id})", True, 
                                 "✅ Request already exists - fallback working (mentor found)")
                elif "Mentor not found or not available" in error_msg:
                    self.log_test(f"Fake mentor fallback ({fake_id})", False, 
                                 f"❌ CRITICAL: Fallback not working - {error_msg}")
                else:
                    self.log_test(f"Fake mentor fallback ({fake_id})", False, f"Other error: {error_msg}")
        
        # Phase 4: Error Handling
        print("\n❌ Phase 4: Error Handling")
        
        # Test with invalid/non-existent mentor IDs
        invalid_mentor_ids = ["invalid-mentor-123", "non-existent-mentor"]
        
        for invalid_id in invalid_mentor_ids:
            invalid_request_data = {
                "mentor_id": invalid_id,
                "message": "Test request to invalid mentor"
            }
            
            success, response = self.make_request('POST', 'student/request-mentor', invalid_request_data, 
                                                token=student_token, expected_status=404)
            
            if success:
                self.log_test(f"Invalid mentor ID handling ({invalid_id})", True, 
                             "✅ Proper 404 error for truly invalid mentor")
            else:
                self.log_test(f"Invalid mentor ID handling ({invalid_id})", False, 
                             f"Unexpected response: {response}")
        
        # Test missing mentor ID
        invalid_request_data = {"message": "Test without mentor ID"}
        success, response = self.make_request('POST', 'student/request-mentor', invalid_request_data, 
                                            token=student_token, expected_status=400)
        self.log_test("Missing mentor ID handling", success, "✅ Proper 400 error for missing mentor ID")
        
        # Phase 5: Data Format Verification
        print("\n📋 Phase 5: Data Format Verification")
        
        # Get mentor profile to verify conversion includes all expected fields
        mentor_token = mentor_login_response.get('access_token')
        success, mentor_profile = self.make_request('GET', 'mentor/profile', token=mentor_token)
        
        if success:
            # Verify mentor profile has expected fields for conversion
            expected_mentor_fields = [
                'user_id', 'first_name', 'last_name', 'company', 'position',
                'specializations', 'experience_years', 'bio'
            ]
            
            profile_fields_present = sum(1 for field in expected_mentor_fields 
                                       if field in mentor_profile and mentor_profile[field])
            
            self.log_test("Mentor profile data completeness", profile_fields_present >= 6,
                         f"Profile has {profile_fields_present}/{len(expected_mentor_fields)} expected fields")
            
            # Test that matching score calculation works with converted data
            if mentor_profile.get('specializations'):
                specializations = mentor_profile.get('specializations', [])
                self.log_test("Matching score calculation data", len(specializations) > 0,
                             f"Mentor has {len(specializations)} specializations for matching: {specializations}")
            
        else:
            self.log_test("Mentor profile verification", False, f"Could not get mentor profile: {response}")
        
        # Summary
        print("\n📊 STUDENT REQUEST MENTOR BUG FIX TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        print("\n✅ Expected Results:")
        print("   - No more 'Mentor not found or not available' errors for valid mentors")
        print("   - Successful requests to both database and fake mentors") 
        print("   - Proper mentor profile data formatting and matching score calculation")
        print("   - Consistent behavior with mentor response endpoint fallback logic")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 ALL TESTS PASSED - BUG FIX WORKING CORRECTLY!")
        elif self.tests_passed >= self.tests_run * 0.8:
            print("\n✅ MOSTLY WORKING - Minor issues detected")
        else:
            print("\n❌ CRITICAL ISSUES DETECTED - Bug fix needs attention")

if __name__ == "__main__":
    tester = StudentRequestMentorTester()
    tester.test_student_request_mentor_bug_fix()