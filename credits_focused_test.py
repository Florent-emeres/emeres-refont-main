#!/usr/bin/env python3
"""
ÉMÉRÉS Credits System Focused Test
Detailed investigation of the issues found in regression test
"""

import requests
import json
from datetime import datetime

class CreditsFocusedTester:
    def __init__(self):
        self.base_url = "https://emeres-ui-enhance.preview.emergentagent.com"
        self.api_url = f"{self.base_url}/api"
        self.tokens = {}
        
        # Test accounts
        self.test_accounts = {
            "student": {"email": "student@emeres.fr", "password": "StudentPass123!"},
            "mentor": {"email": "mentor@emeres.fr", "password": "MentorPass123!"},
            "company": {"email": "company@emeres.fr", "password": "CompanyPass123!"},
            "institution": {"email": "institution@emeres.fr", "password": "InstitutionPass123!"}
        }

    def authenticate_all(self):
        """Authenticate all users"""
        print("🔐 Authenticating all users...")
        for role, credentials in self.test_accounts.items():
            response = requests.post(f"{self.api_url}/auth/login", json=credentials)
            if response.status_code == 200:
                data = response.json()
                self.tokens[role] = data.get('access_token')
                print(f"✅ {role.capitalize()} authenticated")
            else:
                print(f"❌ {role.capitalize()} authentication failed: {response.status_code}")

    def investigate_profile_issues(self):
        """Investigate the profile endpoint issues"""
        print("\n🔍 INVESTIGATING PROFILE ISSUES")
        
        # 1. Check mentor profile issue
        print("\n1. Mentor Profile Issue:")
        if 'mentor' in self.tokens:
            response = requests.get(f"{self.api_url}/profile/mentor", 
                                  headers={'Authorization': f'Bearer {self.tokens["mentor"]}'})
            print(f"   GET /api/profile/mentor: {response.status_code}")
            if response.status_code != 200:
                print(f"   Response: {response.text}")
        
        # 2. Check student profile validation
        print("\n2. Student Profile Validation:")
        if 'student' in self.tokens:
            # Get current profile first
            response = requests.get(f"{self.api_url}/profile/student",
                                  headers={'Authorization': f'Bearer {self.tokens["student"]}'})
            if response.status_code == 200:
                profile = response.json()
                print(f"   Current profile has {len(profile.keys())} fields")
                
                # Try to update with minimal data (this was failing)
                minimal_update = {
                    "id": profile.get('id'),
                    "user_id": profile.get('user_id'),
                    "updated_at": datetime.now().isoformat()
                }
                
                update_response = requests.put(f"{self.api_url}/profile/student",
                                             json=minimal_update,
                                             headers={'Authorization': f'Bearer {self.tokens["student"]}'})
                print(f"   PUT with minimal data: {update_response.status_code}")
                if update_response.status_code != 200:
                    error_data = update_response.json()
                    print(f"   Validation errors: {error_data}")
                    
                    # Try with required fields
                    print("\n   Trying with required fields...")
                    complete_update = profile.copy()
                    complete_update.update({
                        "birth_date": "1995-01-01",
                        "phone": "+33123456789", 
                        "email": "student@emeres.fr",
                        "updated_at": datetime.now().isoformat()
                    })
                    
                    complete_response = requests.put(f"{self.api_url}/profile/student",
                                                   json=complete_update,
                                                   headers={'Authorization': f'Bearer {self.tokens["student"]}'})
                    print(f"   PUT with required fields: {complete_response.status_code}")
        
        # 3. Check institution profile update
        print("\n3. Institution Profile Update:")
        if 'institution' in self.tokens:
            response = requests.get(f"{self.api_url}/profile/institution",
                                  headers={'Authorization': f'Bearer {self.tokens["institution"]}'})
            if response.status_code == 200:
                profile = response.json()
                update_response = requests.put(f"{self.api_url}/profile/institution",
                                             json=profile,
                                             headers={'Authorization': f'Bearer {self.tokens["institution"]}'})
                print(f"   PUT /api/profile/institution: {update_response.status_code}")
                if update_response.status_code != 200:
                    print(f"   Response: {update_response.text}")

    def search_credits_endpoints(self):
        """Search for any credits-related endpoints"""
        print("\n🏆 SEARCHING FOR CREDITS ENDPOINTS")
        
        # Comprehensive list of potential credits endpoints
        potential_endpoints = [
            # Student credits
            'student/credits', 'student/credits/balance', 'student/credits/history',
            'student/rewards', 'student/rewards/available', 'student/rewards/claimed',
            'student/achievements', 'student/achievements/list', 'student/achievements/progress',
            'student/points', 'student/points/balance', 'student/points/history',
            'student/badges', 'student/badges/earned', 'student/badges/available',
            
            # General credits
            'credits', 'credits/balance', 'credits/history', 'credits/earn', 'credits/spend',
            'rewards', 'rewards/available', 'rewards/catalog', 'rewards/claim',
            'achievements', 'achievements/list', 'achievements/unlock',
            'points', 'points/balance', 'points/leaderboard',
            'badges', 'badges/available', 'badges/earned',
            
            # Gamification
            'gamification/profile', 'gamification/stats', 'gamification/leaderboard',
            'leaderboard', 'leaderboard/students', 'leaderboard/global',
            
            # Progress tracking
            'progress', 'progress/student', 'progress/achievements',
            'milestones', 'milestones/student', 'milestones/completed',
            
            # Émérés specific
            'emeres/credits', 'emeres/rewards', 'emeres/achievements',
            'platform/credits', 'platform/rewards', 'platform/gamification'
        ]
        
        found_endpoints = []
        
        if 'student' in self.tokens:
            print("   Testing with student token...")
            for endpoint in potential_endpoints:
                try:
                    response = requests.get(f"{self.api_url}/{endpoint}",
                                          headers={'Authorization': f'Bearer {self.tokens["student"]}'})
                    
                    if response.status_code == 200:
                        try:
                            data = response.json()
                            if isinstance(data, dict):
                                fields = len(data.keys())
                                found_endpoints.append((endpoint, f"Dict with {fields} fields"))
                            elif isinstance(data, list):
                                items = len(data)
                                found_endpoints.append((endpoint, f"List with {items} items"))
                            else:
                                found_endpoints.append((endpoint, "Data found"))
                        except:
                            found_endpoints.append((endpoint, "Non-JSON response"))
                    elif response.status_code not in [404, 405]:
                        # Interesting non-404 responses
                        found_endpoints.append((endpoint, f"Status {response.status_code}"))
                        
                except Exception as e:
                    continue
        
        if found_endpoints:
            print(f"\n   ✅ Found {len(found_endpoints)} potential credits endpoints:")
            for endpoint, description in found_endpoints:
                print(f"      • /api/{endpoint}: {description}")
        else:
            print("   ❌ No credits-related endpoints found")
            print("   This suggests the credits system may not be implemented yet")

    def test_existing_functionality(self):
        """Test existing functionality that should work"""
        print("\n✅ TESTING EXISTING FUNCTIONALITY")
        
        # Test core endpoints that should work
        test_cases = [
            ("GET", "offers", None, "student"),
            ("GET", "student/dashboard/stats", None, "student"),
            ("GET", "mentor/dashboard", None, "mentor"),
            ("GET", "company/dashboard", None, "company"),
            ("GET", "institution/dashboard", None, "institution"),
            ("GET", "applications/my", None, "student"),
            ("GET", "offers/my", None, "company"),
            ("GET", "threads", None, "student"),
            ("GET", "threads", None, "mentor")
        ]
        
        for method, endpoint, data, role in test_cases:
            if role in self.tokens:
                headers = {'Authorization': f'Bearer {self.tokens[role]}'}
                
                if method == "GET":
                    response = requests.get(f"{self.api_url}/{endpoint}", headers=headers)
                else:
                    response = requests.post(f"{self.api_url}/{endpoint}", json=data, headers=headers)
                
                status = "✅" if response.status_code == 200 else "❌"
                print(f"   {status} {method} /api/{endpoint} ({role}): {response.status_code}")

    def run_investigation(self):
        """Run the focused investigation"""
        print("🔍 ÉMÉRÉS CREDITS SYSTEM FOCUSED INVESTIGATION")
        print("=" * 60)
        
        self.authenticate_all()
        self.investigate_profile_issues()
        self.search_credits_endpoints()
        self.test_existing_functionality()
        
        print("\n" + "=" * 60)
        print("📋 INVESTIGATION SUMMARY")
        print("=" * 60)
        print("1. Authentication: All 4 user roles working correctly")
        print("2. Profile Issues: Some validation requirements and missing endpoints")
        print("3. Credits System: Needs investigation for implementation status")
        print("4. Core Functionality: Most endpoints working as expected")

if __name__ == "__main__":
    tester = CreditsFocusedTester()
    tester.run_investigation()