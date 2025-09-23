#!/usr/bin/env python3
"""
ÉMÉRÉS Address Fields Backend Testing - Review Request Specific
Tests address fields persistence with French postal codes (62200, 62230)
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class AddressProfileTester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_data = None
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
                    expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response data"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

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

    def setup_authentication(self):
        """Setup authentication for testing"""
        print("🔐 SETTING UP AUTHENTICATION")
        
        # Try to register a new user
        user_data = {
            "email": "address-test-student@example.com",
            "password": "password123",
            "role": "student",
            "first_name": "Test",
            "last_name": "Student"
        }
        
        success, response = self.make_request('POST', 'auth/register', user_data)
        
        if success and isinstance(response, dict):
            self.token = response.get('access_token')
            self.user_data = response.get('user', {})
            self.log_test("Authentication setup", True, "New user registered")
            return True
        else:
            # Try to login with existing user
            login_data = {
                "email": "address-test-student@example.com",
                "password": "password123"
            }
            
            success, response = self.make_request('POST', 'auth/login', login_data)
            
            if success and isinstance(response, dict):
                self.token = response.get('access_token')
                self.user_data = response.get('user', {})
                self.log_test("Authentication setup", True, "Existing user login")
                return True
            else:
                self.log_test("Authentication setup", False, str(response))
                return False

    def test_get_user_profile_endpoint(self):
        """Test GET /api/profile/student endpoint (equivalent to /api/user-profile)"""
        print("\n📥 TESTING GET USER PROFILE ENDPOINT")
        
        success, profile_response = self.make_request('GET', 'profile/student')
        self.log_test("GET /api/profile/student", success, 
                     "Profile retrieved successfully" if success else str(profile_response))
        
        if success:
            # Check if address fields are present in the model
            address_fields = ['address_street', 'postal_code', 'city', 'country']
            address_fields_present = [field for field in address_fields if field in profile_response]
            self.log_test("Address fields in StudentProfile model", len(address_fields_present) == len(address_fields),
                         f"Address fields present: {address_fields_present}")
            
            # Check other important fields
            required_fields = ['first_name', 'last_name', 'phone', 'email', 'birth_date']
            required_fields_present = [field for field in required_fields if field in profile_response]
            self.log_test("Required fields in profile", len(required_fields_present) > 0,
                         f"Required fields present: {required_fields_present}")
            
            return profile_response
        
        return None

    def test_address_fields_boulogne_sur_mer(self, base_profile):
        """Test address fields with Boulogne-sur-Mer (62200)"""
        print("\n📍 TESTING ADDRESS FIELDS - BOULOGNE-SUR-MER (62200)")
        
        if not base_profile:
            self.log_test("Boulogne-sur-Mer address test", False, "No base profile available")
            return
        
        # Test with Boulogne-sur-Mer postal code as requested
        boulogne_profile = base_profile.copy()
        boulogne_profile.update({
            "last_name": "Dubois",
            "first_name": "Marie",
            "birth_date": "1999-05-15",
            "phone": "+33321876543",
            "email": "marie.dubois@example.com",
            "address_street": "15 Rue Nationale",
            "postal_code": "62200",
            "city": "Boulogne-sur-Mer",
            "country": "France",
            "gdpr_consent": True,
            "terms_accepted": True,
            "profile_sharing_consent": True,
            "updated_at": datetime.now().isoformat()
        })
        
        success, response = self.make_request('PUT', 'profile/student', boulogne_profile)
        self.log_test("PUT profile with Boulogne-sur-Mer address", success,
                     "Address fields accepted" if success else str(response))
        
        if success:
            # Verify address persistence
            success, verify_response = self.make_request('GET', 'profile/student')
            if success:
                address_fields = {
                    'address_street': '15 Rue Nationale',
                    'postal_code': '62200',
                    'city': 'Boulogne-sur-Mer',
                    'country': 'France'
                }
                
                all_address_correct = True
                for field, expected_value in address_fields.items():
                    actual_value = verify_response.get(field)
                    if actual_value != expected_value:
                        all_address_correct = False
                        print(f"  ❌ Address field {field}: expected '{expected_value}', got '{actual_value}'")
                    else:
                        print(f"  ✅ Address field {field}: '{actual_value}' ✓")
                
                self.log_test("Boulogne-sur-Mer address persistence", all_address_correct,
                             "All address fields persisted correctly" if all_address_correct else "Some address fields not persisted")
            else:
                self.log_test("Verify Boulogne-sur-Mer address", False, str(verify_response))

    def test_address_fields_outreau(self, base_profile):
        """Test address fields with Outreau (62230)"""
        print("\n📍 TESTING ADDRESS FIELDS - OUTREAU (62230)")
        
        if not base_profile:
            self.log_test("Outreau address test", False, "No base profile available")
            return
        
        # Test with Outreau postal code as requested
        outreau_profile = base_profile.copy()
        outreau_profile.update({
            "last_name": "Martin",
            "first_name": "Pierre",
            "birth_date": "1998-12-10",
            "phone": "+33321654321",
            "email": "pierre.martin@example.com",
            "address_street": "42 Avenue de la République",
            "postal_code": "62230",
            "city": "Outreau",
            "country": "France",
            "gdpr_consent": True,
            "terms_accepted": True,
            "profile_sharing_consent": True,
            "updated_at": datetime.now().isoformat()
        })
        
        success, response = self.make_request('PUT', 'profile/student', outreau_profile)
        self.log_test("PUT profile with Outreau address", success,
                     "Address fields accepted" if success else str(response))
        
        if success:
            # Verify address persistence
            success, verify_response = self.make_request('GET', 'profile/student')
            if success:
                address_fields = {
                    'address_street': '42 Avenue de la République',
                    'postal_code': '62230',
                    'city': 'Outreau',
                    'country': 'France'
                }
                
                all_address_correct = True
                for field, expected_value in address_fields.items():
                    actual_value = verify_response.get(field)
                    if actual_value != expected_value:
                        all_address_correct = False
                        print(f"  ❌ Address field {field}: expected '{expected_value}', got '{actual_value}'")
                    else:
                        print(f"  ✅ Address field {field}: '{actual_value}' ✓")
                
                self.log_test("Outreau address persistence", all_address_correct,
                             "All address fields persisted correctly" if all_address_correct else "Some address fields not persisted")
            else:
                self.log_test("Verify Outreau address", False, str(verify_response))

    def test_comprehensive_profile_update(self, base_profile):
        """Test comprehensive profile update with all 7-section fields"""
        print("\n📤 TESTING COMPREHENSIVE PROFILE UPDATE")
        
        if not base_profile:
            self.log_test("Comprehensive profile update", False, "No base profile available")
            return
        
        # Test PUT endpoint with comprehensive profile data including address fields
        comprehensive_update = {
            "id": base_profile.get('id'),
            "user_id": base_profile.get('user_id'),
            
            # Personal information (required fields)
            "last_name": "Leclerc",
            "first_name": "Sophie",
            "birth_date": "1999-07-20",
            "phone": "+33321987654",
            "email": "sophie.leclerc@example.com",
            
            # Address fields (focus of review request)
            "address_street": "25 Boulevard Sainte-Beuve",
            "postal_code": "62200",
            "city": "Boulogne-sur-Mer", 
            "country": "France",
            
            # Additional personal info
            "gender": "Femme",
            "nationality": "Française",
            
            # Academic information
            "institution_name": "Université du Littoral Côte d'Opale",
            "institution_type": "Université",
            "field_of_study": "Informatique et Systèmes d'Information",
            "degree_preparing": "Master",
            "study_year": "2e année",
            "graduation_year": "2025",
            
            # Skills and experience
            "main_skills": ["Python", "JavaScript", "React", "Node.js", "MongoDB"],
            "languages": [
                {"language": "Français", "level": "Natif"},
                {"language": "Anglais", "level": "B2"},
                {"language": "Allemand", "level": "A2"}
            ],
            "past_experiences": [
                {
                    "title": "Stage Développeur Web",
                    "company": "WebAgency Boulogne",
                    "duration": "2 mois",
                    "description": "Développement d'applications web avec React et Node.js"
                }
            ],
            
            # Job search preferences
            "search_objective": "Stage de fin d'études en développement web",
            "search_domain": "Développement web et applications",
            "contract_type": "Stage obligatoire",
            "desired_duration": "6 mois",
            "geographic_mobility": "Hauts-de-France et région parisienne",
            "remote_work_accepted": True,
            "availability_start": "2025-04-01",
            
            # Required consents
            "gdpr_consent": True,
            "terms_accepted": True,
            "profile_sharing_consent": True,
            
            # Notification preferences
            "email_notifications": True,
            "sms_notifications": False,
            "app_notifications": True,
            
            # Legacy fields for compatibility
            "education_level": "Master 2",
            "school_name": "Université du Littoral Côte d'Opale",
            "skills": ["Python", "JavaScript", "React"],
            "interests": ["Développement Web", "Intelligence Artificielle"],
            "preferred_sectors": ["Technologie", "Startup"],
            "preferred_locations": ["Boulogne-sur-Mer", "Paris", "Lille"],
            "experience_level": "Intermédiaire",
            "bio": "Étudiante en Master Informatique passionnée par le développement web et les nouvelles technologies",
            
            "created_at": base_profile.get('created_at'),
            "updated_at": datetime.now().isoformat()
        }
        
        success, update_response = self.make_request('PUT', 'profile/student', comprehensive_update)
        self.log_test("PUT comprehensive profile update", success,
                     "Profile updated successfully" if success else str(update_response))
        
        if success:
            # Verify the update was successful and address fields are persisted
            success, verify_response = self.make_request('GET', 'profile/student')
            if success:
                # Check specific address fields mentioned in review request
                address_verification = {
                    'postal_code': '62200',
                    'city': 'Boulogne-sur-Mer',
                    'address_street': '25 Boulevard Sainte-Beuve',
                    'country': 'France'
                }
                
                address_persistence_success = True
                for field, expected_value in address_verification.items():
                    actual_value = verify_response.get(field)
                    if actual_value != expected_value:
                        address_persistence_success = False
                        print(f"  ❌ Address field {field}: expected '{expected_value}', got '{actual_value}'")
                    else:
                        print(f"  ✅ Address field {field}: '{actual_value}' ✓")
                
                self.log_test("Address fields persistence after comprehensive update", address_persistence_success,
                             "All address fields correctly persisted" if address_persistence_success else "Address fields not properly persisted")
                
                # Check other important fields
                other_fields_verification = {
                    'first_name': 'Sophie',
                    'last_name': 'Leclerc',
                    'phone': '+33321987654',
                    'email': 'sophie.leclerc@example.com',
                    'institution_name': 'Université du Littoral Côte d\'Opale',
                    'field_of_study': 'Informatique et Systèmes d\'Information'
                }
                
                other_fields_success = True
                for field, expected_value in other_fields_verification.items():
                    actual_value = verify_response.get(field)
                    if actual_value != expected_value:
                        other_fields_success = False
                        print(f"  ⚠️  Field {field}: expected '{expected_value}', got '{actual_value}'")
                
                self.log_test("Other profile fields persistence", other_fields_success,
                             "All profile fields correctly persisted" if other_fields_success else "Some profile fields not properly persisted")
            else:
                self.log_test("Verify profile after comprehensive update", False, str(verify_response))

    def test_backend_validation(self, base_profile):
        """Test backend validation for required fields"""
        print("\n✅ TESTING BACKEND VALIDATION")
        
        if not base_profile:
            self.log_test("Backend validation test", False, "No base profile available")
            return
        
        # Test missing required fields - should return 400
        incomplete_profile = {
            "id": base_profile.get('id'),
            "user_id": base_profile.get('user_id'),
            # Missing required fields: first_name, last_name, phone, email, birth_date
            "address_street": "Test Street",
            "postal_code": "62200",
            "city": "Boulogne-sur-Mer",
            "country": "France",
            "updated_at": datetime.now().isoformat()
        }
        
        success, response = self.make_request('PUT', 'profile/student', incomplete_profile, expected_status=400)
        self.log_test("Required fields validation (should return 400)", success, 
                     "Correctly rejected with 400" if success else f"Should have been rejected: {response}")
        
        # Test complete profile with all required fields - should return 200
        complete_profile = {
            "id": base_profile.get('id'),
            "user_id": base_profile.get('user_id'),
            "last_name": "Martin",
            "first_name": "Sophie",
            "birth_date": "1999-03-20",
            "phone": "+33123456789",
            "email": "sophie.martin@example.com",
            "address_street": "Test Street",
            "postal_code": "62200",
            "city": "Boulogne-sur-Mer",
            "country": "France",
            "gdpr_consent": True,
            "terms_accepted": True,
            "profile_sharing_consent": True,
            "updated_at": datetime.now().isoformat()
        }
        
        success, response = self.make_request('PUT', 'profile/student', complete_profile)
        self.log_test("Complete profile validation (should return 200)", success, 
                     "Complete profile accepted" if success else f"Complete profile rejected: {response}")

    def run_all_tests(self):
        """Run all address and profile tests"""
        print("🚀 STARTING ADDRESS FIELDS BACKEND TESTS (REVIEW REQUEST)")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)

        # Setup authentication
        if not self.setup_authentication():
            print("❌ Authentication failed, cannot proceed with tests")
            return False

        # Test GET endpoint and get base profile
        base_profile = self.test_get_user_profile_endpoint()
        
        # Test address fields with French postal codes
        self.test_address_fields_boulogne_sur_mer(base_profile)
        self.test_address_fields_outreau(base_profile)
        
        # Test comprehensive profile update
        self.test_comprehensive_profile_update(base_profile)
        
        # Test backend validation
        self.test_backend_validation(base_profile)

        # Print summary
        print("\n" + "=" * 60)
        print("📊 ADDRESS FIELDS TEST SUMMARY")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")

        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")

        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = AddressProfileTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())