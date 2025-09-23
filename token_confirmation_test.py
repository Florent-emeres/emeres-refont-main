#!/usr/bin/env python3
"""
ÉMÉRÉS Token Confirmation Testing
Tests the complete email confirmation workflow including token usage
"""

import requests
import sys
import json
import uuid
import re
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional

class TokenConfirmationTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.test_session = str(uuid.uuid4())[:8]
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

    def extract_token_from_logs(self, email: str) -> Optional[str]:
        """Extract confirmation token from backend logs"""
        try:
            import subprocess
            result = subprocess.run(['tail', '-n', '50', '/var/log/supervisor/backend.out.log'], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                logs = result.stdout
                # Look for email simulation logs for this specific email
                lines = logs.split('\n')
                for i, line in enumerate(lines):
                    if f"EMAIL SIMULATION: To {email}" in line:
                        # Look for the next line with the token
                        if i + 1 < len(lines):
                            content_line = lines[i + 1]
                            # Extract token from URL like: http://localhost:3000/confirm-email?token=TOKEN
                            token_match = re.search(r'token=([a-f0-9-]+)', content_line)
                            if token_match:
                                return token_match.group(1)
            return None
        except Exception as e:
            print(f"Error extracting token: {e}")
            return None

    def test_complete_confirmation_workflow(self):
        """Test the complete email confirmation workflow"""
        print("\n🔄 TESTING COMPLETE CONFIRMATION WORKFLOW")
        
        # Step 1: Register a new user
        unique_email = f"complete-test-{self.test_session}@test.com"
        user_data = {
            "email": unique_email,
            "password": "TestPass123!",
            "role": "student",
            "first_name": "Complete",
            "last_name": "Test"
        }
        
        success, response = self.make_request('POST', 'auth/register', user_data, expected_status=200)
        
        if not success:
            self.log_test("Registration for token test", False, str(response))
            return False
        
        self.log_test("Registration for token test", True, "User registered successfully")
        
        # Step 2: Extract token from logs
        token = self.extract_token_from_logs(unique_email)
        
        if not token:
            self.log_test("Token extraction from logs", False, "Could not extract token from backend logs")
            return False
        
        self.log_test("Token extraction from logs", True, f"Token extracted: {token[:8]}...")
        
        # Step 3: Verify user is unverified before confirmation
        login_data = {"email": unique_email, "password": "TestPass123!"}
        success, response = self.make_request('POST', 'auth/login', login_data, expected_status=401)
        
        if success:
            self.log_test("User unverified before confirmation", True, "Login correctly blocked")
        else:
            self.log_test("User unverified before confirmation", False, "Login should be blocked")
        
        # Step 4: Confirm email with extracted token
        success, response = self.make_request('POST', f'auth/confirm-email?token={token}', expected_status=200)
        
        if success and isinstance(response, dict):
            # Check if confirmation was successful
            has_token = 'access_token' in response
            has_user = 'user' in response
            has_message = 'message' in response
            
            confirmation_success = has_token and has_user and has_message
            self.log_test("Email confirmation successful", confirmation_success,
                         f"Token: {has_token}, User: {has_user}, Message: {has_message}")
            
            if confirmation_success:
                # Check if user is now verified
                user_data = response.get('user', {})
                is_verified = user_data.get('is_verified', False)
                self.log_test("User marked as verified", is_verified,
                             f"Verified status: {is_verified}")
                
                # Store access token for further tests
                access_token = response.get('access_token')
                if access_token:
                    self.log_test("Access token provided after confirmation", True,
                                 f"Token received: {access_token[:20]}...")
                else:
                    self.log_test("Access token provided after confirmation", False,
                                 "No access token in response")
        else:
            self.log_test("Email confirmation successful", False, str(response))
            return False
        
        # Step 5: Verify login now works
        success, response = self.make_request('POST', 'auth/login', login_data, expected_status=200)
        
        if success and isinstance(response, dict):
            has_token = 'access_token' in response
            user_verified = response.get('user', {}).get('is_verified', False)
            
            login_success = has_token and user_verified
            self.log_test("Login works after confirmation", login_success,
                         f"Token: {has_token}, Verified: {user_verified}")
        else:
            self.log_test("Login works after confirmation", False, str(response))
        
        # Step 6: Test double token usage (should fail)
        success, response = self.make_request('POST', f'auth/confirm-email?token={token}', expected_status=400)
        
        if success:
            error_detail = ""
            try:
                if isinstance(response, dict):
                    error_detail = response.get('detail', '')
                elif isinstance(response, str):
                    error_detail = response
            except:
                pass
            
            token_reuse_blocked = 'token' in error_detail.lower() or 'used' in error_detail.lower()
            self.log_test("Double token usage blocked", token_reuse_blocked,
                         f"Error: {error_detail}")
        else:
            self.log_test("Double token usage blocked", False, "Token reuse should be blocked")
        
        return True

    def test_token_expiration_simulation(self):
        """Test token expiration handling"""
        print("\n⏰ TESTING TOKEN EXPIRATION")
        
        # Test with obviously invalid/expired tokens
        expired_tokens = [
            "00000000-0000-0000-0000-000000000000",  # Zero UUID
            "expired-token-12345",                    # Non-UUID format
            "ffffffff-ffff-ffff-ffff-ffffffffffff",  # Max UUID
        ]
        
        for token in expired_tokens:
            success, response = self.make_request('POST', f'auth/confirm-email?token={token}', 
                                                expected_status=400)
            
            if success:
                error_detail = ""
                try:
                    if isinstance(response, dict):
                        error_detail = response.get('detail', '')
                    elif isinstance(response, str):
                        error_detail = response
                except:
                    pass
                
                proper_rejection = 'token' in error_detail.lower() or 'invalid' in error_detail.lower()
                self.log_test(f"Invalid token rejected ({token[:8]}...)", proper_rejection,
                             f"Error: {error_detail}")
            else:
                self.log_test(f"Invalid token rejected ({token[:8]}...)", False, str(response))

    def test_welcome_email_workflow(self):
        """Test welcome email after confirmation"""
        print("\n📬 TESTING WELCOME EMAIL WORKFLOW")
        
        # Register another user to test welcome email
        unique_email = f"welcome-test-{self.test_session}@test.com"
        user_data = {
            "email": unique_email,
            "password": "TestPass123!",
            "role": "mentor",
            "first_name": "Welcome",
            "last_name": "Test"
        }
        
        success, response = self.make_request('POST', 'auth/register', user_data, expected_status=200)
        
        if not success:
            self.log_test("Registration for welcome email test", False, str(response))
            return
        
        self.log_test("Registration for welcome email test", True, "User registered")
        
        # Extract token
        token = self.extract_token_from_logs(unique_email)
        
        if not token:
            self.log_test("Token extraction for welcome test", False, "Could not extract token")
            return
        
        # Confirm email and check for welcome email in logs
        success, response = self.make_request('POST', f'auth/confirm-email?token={token}', expected_status=200)
        
        if success:
            self.log_test("Email confirmation for welcome test", True, "Confirmation successful")
            
            # Check logs for welcome email
            try:
                import subprocess
                result = subprocess.run(['tail', '-n', '20', '/var/log/supervisor/backend.out.log'], 
                                      capture_output=True, text=True)
                
                if result.returncode == 0:
                    logs = result.stdout
                    welcome_email_sent = "Bienvenue sur ÉMÉRÉS !" in logs
                    self.log_test("Welcome email sent after confirmation", welcome_email_sent,
                                 f"Welcome email found in logs: {welcome_email_sent}")
                else:
                    self.log_test("Welcome email sent after confirmation", False, "Could not check logs")
            except Exception as e:
                self.log_test("Welcome email sent after confirmation", False, f"Error checking logs: {e}")
        else:
            self.log_test("Email confirmation for welcome test", False, str(response))

    def run_all_tests(self):
        """Run all token confirmation tests"""
        print("🚀 STARTING TOKEN CONFIRMATION TESTS")
        print(f"📋 Test Session ID: {self.test_session}")
        print("=" * 60)
        
        # Run all test methods
        self.test_complete_confirmation_workflow()
        self.test_token_expiration_simulation()
        self.test_welcome_email_workflow()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TOKEN CONFIRMATION TEST SUMMARY")
        print("=" * 60)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 TOKEN CONFIRMATION SYSTEM IS EXCELLENT!")
        elif success_rate >= 80:
            print("✅ TOKEN CONFIRMATION SYSTEM IS WORKING WELL!")
        else:
            print("⚠️  TOKEN CONFIRMATION SYSTEM NEEDS ATTENTION")
        
        return success_rate >= 80

if __name__ == "__main__":
    tester = TokenConfirmationTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)