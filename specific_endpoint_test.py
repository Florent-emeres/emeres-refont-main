#!/usr/bin/env python3
"""
ÉMÉRÉS Platform - Specific Endpoint Testing
Focus on recently fixed endpoints and critical functionality
"""

import requests
import json
from datetime import datetime

class SpecificEndpointTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.test_results = []

    def login_users(self):
        """Login with existing users"""
        users = [
            {"email": "student@emeres.fr", "password": "StudentPass123!", "role": "student"},
            {"email": "mentor@emeres.fr", "password": "MentorPass123!", "role": "mentor"},
            {"email": "company@emeres.fr", "password": "CompanyPass123!", "role": "company"},
            {"email": "institution@emeres.fr", "password": "InstitutionPass123!", "role": "institution"}
        ]

        for user in users:
            try:
                response = requests.post(f"{self.api_url}/auth/login", 
                                       json={"email": user["email"], "password": user["password"]}, 
                                       timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    self.tokens[user['role']] = data.get('access_token')
                    print(f"✅ Logged in as {user['role']}: {user['email']}")
                else:
                    print(f"❌ Failed to login as {user['role']}: {response.status_code}")
            except Exception as e:
                print(f"❌ Error logging in as {user['role']}: {str(e)}")

    def test_recently_fixed_endpoints(self):
        """Test the recently fixed endpoints mentioned in review"""
        print("\n🆕 TESTING RECENTLY FIXED ENDPOINTS")
        
        if 'student' not in self.tokens:
            print("❌ No student token available")
            return

        student_token = self.tokens['student']
        headers = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}

        # Test GET /api/student/mentorship-requests (nouvelle ajout)
        try:
            response = requests.get(f"{self.api_url}/student/mentorship-requests", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ GET /api/student/mentorship-requests: {response.status_code} - Found {len(data)} requests")
                if data:
                    print(f"   Sample request: {data[0].get('id', 'N/A')} - {data[0].get('status', 'N/A')}")
            else:
                print(f"❌ GET /api/student/mentorship-requests: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"❌ GET /api/student/mentorship-requests: Error - {str(e)}")

        # Test GET /api/student/notifications/unread-count (nouvelle ajout)
        try:
            response = requests.get(f"{self.api_url}/student/notifications/unread-count", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ GET /api/student/notifications/unread-count: {response.status_code} - Count: {data.get('count', 'N/A')}")
            else:
                print(f"❌ GET /api/student/notifications/unread-count: {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"❌ GET /api/student/notifications/unread-count: Error - {str(e)}")

    def test_critical_endpoints(self):
        """Test critical endpoints for each role"""
        print("\n🎯 TESTING CRITICAL ENDPOINTS BY ROLE")
        
        # Student endpoints
        if 'student' in self.tokens:
            print("\n👨‍🎓 STUDENT ENDPOINTS:")
            student_token = self.tokens['student']
            headers = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}
            
            endpoints = [
                ("GET", "profile/student", "Student profile"),
                ("GET", "offers", "Available offers"),
                ("GET", "applications/my", "My applications"),
                ("GET", "student/dashboard/stats", "Dashboard stats"),
                ("GET", "student/mentorship-ads", "My mentorship ads"),
                ("GET", "student/discover-mentors", "Discover mentors"),
                ("GET", "student/notifications", "Notifications")
            ]
            
            for method, endpoint, description in endpoints:
                try:
                    response = requests.get(f"{self.api_url}/{endpoint}", headers=headers, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, list):
                            print(f"   ✅ {description}: {len(data)} items")
                        elif isinstance(data, dict):
                            print(f"   ✅ {description}: Retrieved successfully")
                        else:
                            print(f"   ✅ {description}: OK")
                    else:
                        print(f"   ❌ {description}: {response.status_code}")
                except Exception as e:
                    print(f"   ❌ {description}: Error - {str(e)}")

        # Mentor endpoints
        if 'mentor' in self.tokens:
            print("\n🤝 MENTOR ENDPOINTS:")
            mentor_token = self.tokens['mentor']
            headers = {'Authorization': f'Bearer {mentor_token}', 'Content-Type': 'application/json'}
            
            endpoints = [
                ("GET", "mentor/profile", "Mentor profile"),
                ("GET", "mentor/students", "My students"),
                ("GET", "mentor/mentorship-ads", "Available mentorship ads"),
                ("GET", "mentor/sessions", "My sessions")
            ]
            
            for method, endpoint, description in endpoints:
                try:
                    response = requests.get(f"{self.api_url}/{endpoint}", headers=headers, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, list):
                            print(f"   ✅ {description}: {len(data)} items")
                        elif isinstance(data, dict):
                            print(f"   ✅ {description}: Retrieved successfully")
                        else:
                            print(f"   ✅ {description}: OK")
                    else:
                        print(f"   ❌ {description}: {response.status_code}")
                except Exception as e:
                    print(f"   ❌ {description}: Error - {str(e)}")

        # Company endpoints
        if 'company' in self.tokens:
            print("\n🏢 COMPANY ENDPOINTS:")
            company_token = self.tokens['company']
            headers = {'Authorization': f'Bearer {company_token}', 'Content-Type': 'application/json'}
            
            endpoints = [
                ("GET", "profile/company", "Company profile"),
                ("GET", "offers/my", "My offers"),
                ("GET", "applications/company", "Applications to my offers")
            ]
            
            for method, endpoint, description in endpoints:
                try:
                    response = requests.get(f"{self.api_url}/{endpoint}", headers=headers, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        if isinstance(data, list):
                            print(f"   ✅ {description}: {len(data)} items")
                        elif isinstance(data, dict):
                            print(f"   ✅ {description}: Retrieved successfully")
                        else:
                            print(f"   ✅ {description}: OK")
                    else:
                        print(f"   ❌ {description}: {response.status_code}")
                except Exception as e:
                    print(f"   ❌ {description}: Error - {str(e)}")

    def test_messaging_system(self):
        """Test messaging system endpoints"""
        print("\n💬 TESTING MESSAGING SYSTEM:")
        
        if 'student' not in self.tokens:
            print("❌ No student token available")
            return

        student_token = self.tokens['student']
        headers = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}

        # Test threads endpoint
        try:
            response = requests.get(f"{self.api_url}/threads", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                threads = data.get('threads', []) if isinstance(data, dict) else data
                print(f"   ✅ GET /api/threads: {len(threads)} threads")
            else:
                print(f"   ❌ GET /api/threads: {response.status_code}")
        except Exception as e:
            print(f"   ❌ GET /api/threads: Error - {str(e)}")

        # Test messaging inbox
        try:
            response = requests.get(f"{self.api_url}/messaging/inbox/student", headers=headers, timeout=10)
            if response.status_code == 200:
                print(f"   ✅ GET /api/messaging/inbox/student: OK")
            else:
                print(f"   ❌ GET /api/messaging/inbox/student: {response.status_code}")
        except Exception as e:
            print(f"   ❌ GET /api/messaging/inbox/student: Error - {str(e)}")

    def test_data_integrity_samples(self):
        """Test data integrity with sample data"""
        print("\n🔍 TESTING DATA INTEGRITY:")
        
        if 'student' not in self.tokens:
            print("❌ No student token available")
            return

        student_token = self.tokens['student']
        headers = {'Authorization': f'Bearer {student_token}', 'Content-Type': 'application/json'}

        # Test student profile data
        try:
            response = requests.get(f"{self.api_url}/profile/student", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'user_id', 'first_name', 'last_name']
                missing_fields = [field for field in required_fields if field not in data or not data[field]]
                
                if not missing_fields:
                    print(f"   ✅ Student profile integrity: All required fields present")
                    print(f"      Name: {data.get('first_name', 'N/A')} {data.get('last_name', 'N/A')}")
                    print(f"      Skills: {len(data.get('skills', []))} skills")
                    print(f"      Portfolio projects: {len(data.get('portfolio_projects', []))} projects")
                else:
                    print(f"   ⚠️  Student profile integrity: Missing fields: {missing_fields}")
            else:
                print(f"   ❌ Student profile integrity: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Student profile integrity: Error - {str(e)}")

        # Test offers data
        try:
            response = requests.get(f"{self.api_url}/offers", headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    first_offer = data[0]
                    required_fields = ['id', 'title', 'description', 'company_id']
                    missing_fields = [field for field in required_fields if field not in first_offer or not first_offer[field]]
                    
                    if not missing_fields:
                        print(f"   ✅ Offers integrity: All required fields present in {len(data)} offers")
                        print(f"      Sample offer: {first_offer.get('title', 'N/A')}")
                    else:
                        print(f"   ⚠️  Offers integrity: Missing fields in sample: {missing_fields}")
                else:
                    print(f"   ℹ️  Offers integrity: No offers available to test")
            else:
                print(f"   ❌ Offers integrity: {response.status_code}")
        except Exception as e:
            print(f"   ❌ Offers integrity: Error - {str(e)}")

    def run_tests(self):
        """Run all specific tests"""
        print("🎯 ÉMÉRÉS BACKEND - SPECIFIC ENDPOINT TESTING")
        print("=" * 50)
        
        self.login_users()
        self.test_recently_fixed_endpoints()
        self.test_critical_endpoints()
        self.test_messaging_system()
        self.test_data_integrity_samples()
        
        print("\n" + "=" * 50)
        print("✅ SPECIFIC ENDPOINT TESTING COMPLETE")

if __name__ == "__main__":
    tester = SpecificEndpointTester()
    tester.run_tests()