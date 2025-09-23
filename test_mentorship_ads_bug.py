#!/usr/bin/env python3
"""
URGENT BUG TEST: Student mentorship ads not displaying after creation
Testing the specific issue reported in review request
"""

import requests
import json
from datetime import datetime

class MentorshipAdsBugTester:
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

    def test_mentorship_ads_bug(self):
        """Test the specific mentorship ads bug reported in review request"""
        print("🐛 TESTING STUDENT MENTORSHIP ADS BUG (URGENT)")
        print("   Issue: Student created mentorship ad but it doesn't appear in 'Mes Annonces de Mentorat' page")
        print("="*80)
        
        # Step 1: Login as student with provided credentials
        print("\n🔑 Step 1: Login as student")
        login_data = {
            "email": "student@emeres.fr",
            "password": "StudentPass123!"
        }
        
        success, response = self.make_request('POST', 'auth/login', login_data)
        if not success:
            self.log_test("Student login (student@emeres.fr)", False, f"Login failed: {response}")
            return
        
        student_token = response.get('access_token')
        student_user = response.get('user', {})
        student_id = student_user.get('id')
        
        self.log_test("Student login (student@emeres.fr)", True, f"Student ID: {student_id}")
        
        # Step 2: Test POST /api/student/mentorship-ads with sample ad
        print("\n📝 Step 2: Create mentorship ad with sample data")
        
        sample_ad_data = {
            "title": "Recherche mentor en développement web",
            "description": "Étudiant en informatique cherche mentor expérimenté pour m'accompagner dans mon projet de fin d'études.",
            "field_of_study": "Informatique",
            "desired_expertise": ["Développement Web", "JavaScript", "React"],
            "mentorship_goals": ["Finaliser projet", "Améliorer compétences", "Orientation carrière"],
            "mentorship_type": "individual",
            "duration_expected": "3 mois",
            "time_commitment": "2h/semaine",
            "preferred_communication": ["video", "email"],
            "availability_schedule": "Mardis et jeudis 18h-20h",
            "urgency_level": "medium"
        }
        
        success, create_response = self.make_request('POST', 'student/mentorship-ads', sample_ad_data, token=student_token)
        
        if success:
            ad_id = create_response.get('ad_id')
            self.log_test("Create mentorship ad (POST)", True, f"Ad created with ID: {ad_id}")
        else:
            self.log_test("Create mentorship ad (POST)", False, f"Creation failed: {create_response}")
            return
        
        # Step 3: Test GET /api/student/mentorship-ads to check retrieval
        print("\n📥 Step 3: Retrieve student's mentorship ads")
        
        success, get_response = self.make_request('GET', 'student/mentorship-ads', token=student_token)
        
        if success:
            ads_list = get_response if isinstance(get_response, list) else []
            ads_count = len(ads_list)
            
            # Check if the created ad is in the list
            created_ad_found = False
            if ad_id:
                created_ad_found = any(ad.get('id') == ad_id for ad in ads_list)
            
            self.log_test("Retrieve mentorship ads (GET)", True, f"Found {ads_count} ads")
            self.log_test("Created ad appears in list", created_ad_found, 
                         f"Ad {ad_id} {'found' if created_ad_found else 'NOT FOUND'} in student's ads")
            
            # Debug: Check user IDs in returned ads
            if ads_list:
                print(f"   🔍 Debug - Ads found:")
                for ad in ads_list:
                    ad_student_id = ad.get('student_id', 'N/A')
                    ad_title = ad.get('title', 'N/A')
                    print(f"      - Ad: {ad_title[:50]}... | Student ID: {ad_student_id}")
                    
                # Check if any ads belong to current student
                student_ads = [ad for ad in ads_list if ad.get('student_id') == student_id]
                self.log_test("User ID matching", len(student_ads) > 0,
                             f"Found {len(student_ads)} ads for current student ID {student_id}")
            else:
                print(f"   ⚠️  No ads returned - this indicates the bug!")
                
        else:
            self.log_test("Retrieve mentorship ads (GET)", False, f"Retrieval failed: {get_response}")
        
        # Step 4: Diagnostic - Check database vs fake data issue
        print("\n🔍 Step 4: Diagnostic Analysis")
        
        # The issue is likely that:
        # - POST endpoint saves to database (db.mentorship_ads)
        # - GET endpoint reads from STUDENT_MENTORSHIP_ADS constant (fake data)
        # This creates a mismatch where created ads are not retrieved
        
        diagnostic_info = {
            "student_id": student_id,
            "ad_created": success and ad_id is not None,
            "ad_id": ad_id,
            "ads_retrieved": success and isinstance(get_response, list),
            "ads_count": len(get_response) if success and isinstance(get_response, list) else 0,
            "created_ad_in_results": created_ad_found if 'created_ad_found' in locals() else False
        }
        
        # Determine the root cause
        if diagnostic_info["ad_created"] and diagnostic_info["ads_retrieved"]:
            if not diagnostic_info["created_ad_in_results"]:
                root_cause = "DATABASE MISMATCH: POST saves to db.mentorship_ads, GET reads from STUDENT_MENTORSHIP_ADS constant"
                bug_confirmed = True
            else:
                root_cause = "No issue detected - ad creation and retrieval working correctly"
                bug_confirmed = False
        else:
            root_cause = "Cannot determine - either creation or retrieval failed"
            bug_confirmed = False
        
        self.log_test("Bug diagnosis", bug_confirmed, root_cause)
        
        print(f"\n📊 Diagnostic Summary:")
        print(f"   Student ID: {diagnostic_info['student_id']}")
        print(f"   Ad Created: {diagnostic_info['ad_created']}")
        print(f"   Ad ID: {diagnostic_info['ad_id']}")
        print(f"   Ads Retrieved: {diagnostic_info['ads_retrieved']}")
        print(f"   Ads Count: {diagnostic_info['ads_count']}")
        print(f"   Created Ad Found: {diagnostic_info['created_ad_in_results']}")
        print(f"   Root Cause: {root_cause}")
        
        return diagnostic_info

    def run_test(self):
        """Run the mentorship ads bug test"""
        print("🎯 URGENT BUG TEST: Student Mentorship Ads Not Displaying")
        print(f"🌐 Testing against: {self.base_url}")
        print("="*80)
        
        diagnostic_result = self.test_mentorship_ads_bug()
        
        # Print summary
        print("\n" + "="*80)
        print("📊 BUG TEST SUMMARY")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        if diagnostic_result and diagnostic_result.get("ad_created") and not diagnostic_result.get("created_ad_in_results"):
            print("\n🚨 BUG CONFIRMED:")
            print("   - Student can create mentorship ads (POST works)")
            print("   - Student cannot see their created ads (GET doesn't return created ads)")
            print("   - Root cause: GET endpoint reads from fake data, POST saves to database")
            print("   - Fix needed: Update GET endpoint to read from database instead of fake data")
        
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = MentorshipAdsBugTester()
    tester.run_test()