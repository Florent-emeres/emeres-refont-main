#!/usr/bin/env python3
"""
ÉMÉRÉS Platform - Company Sections Backend API Testing Suite
Tests the newly integrated company sections as requested in review:
1. Document Management System
2. Internship Tracking System  
3. Integrations Management
4. Advanced Communication System
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class CompanySectionsAPITester:
    def __init__(self, base_url="https://emeres-ui-enhance.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tokens = {}
        self.users = {}
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.company_token = None

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

    def setup_company_authentication(self):
        """Setup company authentication for testing"""
        print("🔐 SETTING UP COMPANY AUTHENTICATION")
        
        # Register a test company
        registration_data = {
            "first_name": "Test",
            "last_name": "Manager",
            "job_title": "HR Director",
            "email": "test.manager@testcompany.com",
            "email_confirmation": "test.manager@testcompany.com",
            "password": "TestPassword123!",
            "password_confirmation": "TestPassword123!",
            "company_name": "Test Company SAS",
            "sector": "Technology",
            "siret_siren": "12345678901234",
            "vat_number": "FR12345678901",
            "accepts_terms": True,
            "authorized_to_create": True,
            "accepts_partner_communications": False
        }
        
        success, response = self.make_request('POST', 'company/register', registration_data)
        
        if success and isinstance(response, dict):
            self.company_token = response.get('access_token')
            self.users['company'] = response.get('user', {})
            self.log_test("Company authentication setup", True, "Company registered and authenticated")
            return True
        else:
            # Try to login with existing credentials
            login_data = {
                "email": "test.manager@testcompany.com",
                "password": "TestPassword123!"
            }
            
            success, response = self.make_request('POST', 'auth/login', login_data)
            if success and isinstance(response, dict):
                self.company_token = response.get('access_token')
                self.users['company'] = response.get('user', {})
                self.log_test("Company authentication setup", True, "Company logged in successfully")
                return True
            else:
                self.log_test("Company authentication setup", False, f"Failed to authenticate: {str(response)}")
                return False

    def test_document_management_system(self):
        """Test Document Management System endpoints"""
        print("\n📄 TESTING DOCUMENT MANAGEMENT SYSTEM")
        
        if not self.company_token:
            self.log_test("Document Management System", False, "No company token available")
            return

        # Test 1: GET /api/company/documents
        print("\n📥 Testing GET /api/company/documents")
        success, response = self.make_request('GET', 'company/documents', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/documents", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} documents")
        else:
            # Check if endpoint exists (404 vs other errors)
            if "404" in str(response):
                self.log_test("GET /api/company/documents", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/documents", False, str(response))

        # Test 2: POST /api/company/documents
        print("\n📤 Testing POST /api/company/documents")
        document_data = {
            "title": "Company Policy Document",
            "description": "Internal company policies and procedures",
            "category": "policy",
            "access_level": "internal",
            "file_url": "https://example.com/documents/policy.pdf",
            "metadata": {
                "author": "HR Department",
                "version": "1.0",
                "created_date": datetime.now().isoformat()
            }
        }
        
        success, response = self.make_request('POST', 'company/documents', document_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/documents", True, "Document created successfully")
            self.document_id = response.get('id') if isinstance(response, dict) else None
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/documents", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/documents", False, str(response))

        # Test 3: GET /api/company/templates
        print("\n📋 Testing GET /api/company/templates")
        success, response = self.make_request('GET', 'company/templates', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/templates", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} templates")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/templates", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/templates", False, str(response))

        # Test 4: POST /api/company/templates
        print("\n📝 Testing POST /api/company/templates")
        template_data = {
            "name": "Internship Agreement Template",
            "type": "contract",
            "content": "Standard internship agreement template with company terms",
            "variables": ["student_name", "start_date", "end_date", "supervisor"],
            "is_active": True
        }
        
        success, response = self.make_request('POST', 'company/templates', template_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/templates", True, "Template created successfully")
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/templates", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/templates", False, str(response))

        # Test 5: POST /api/company/documents/upload
        print("\n📁 Testing POST /api/company/documents/upload")
        upload_data = {
            "file_name": "company_handbook.pdf",
            "file_type": "application/pdf",
            "file_size": 2048000,
            "category": "handbook",
            "access_level": "public"
        }
        
        success, response = self.make_request('POST', 'company/documents/upload', upload_data, token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("POST /api/company/documents/upload", True, "File upload endpoint working")
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/documents/upload", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/documents/upload", False, str(response))

    def test_internship_tracking_system(self):
        """Test Internship Tracking System endpoints"""
        print("\n👨‍🎓 TESTING INTERNSHIP TRACKING SYSTEM")
        
        if not self.company_token:
            self.log_test("Internship Tracking System", False, "No company token available")
            return

        # Test 1: GET /api/company/interns/active
        print("\n👥 Testing GET /api/company/interns/active")
        success, response = self.make_request('GET', 'company/interns/active', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/interns/active", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} active interns")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/interns/active", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/interns/active", False, str(response))

        # Test 2: POST /api/company/interns/active
        print("\n➕ Testing POST /api/company/interns/active")
        intern_data = {
            "student_id": "test-student-123",
            "student_name": "Marie Dupont",
            "student_email": "marie.dupont@student.com",
            "supervisor_id": "supervisor-456",
            "supervisor_name": "Jean Martin",
            "start_date": "2025-09-01",
            "end_date": "2025-12-31",
            "objectives": [
                "Learn web development fundamentals",
                "Complete a real project",
                "Gain professional experience"
            ],
            "department": "IT Development",
            "status": "active"
        }
        
        success, response = self.make_request('POST', 'company/interns/active', intern_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/interns/active", True, "Intern record created successfully")
            self.intern_id = response.get('id') if isinstance(response, dict) else None
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/interns/active", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/interns/active", False, str(response))

        # Test 3: GET /api/company/evaluations
        print("\n📊 Testing GET /api/company/evaluations")
        success, response = self.make_request('GET', 'company/evaluations', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/evaluations", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} evaluations")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/evaluations", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/evaluations", False, str(response))

        # Test 4: POST /api/company/evaluations
        print("\n📝 Testing POST /api/company/evaluations")
        evaluation_data = {
            "intern_id": self.intern_id if hasattr(self, 'intern_id') else "test-intern-123",
            "evaluator_id": "supervisor-456",
            "evaluation_period": "mid-term",
            "ratings": {
                "technical_skills": 4,
                "communication": 5,
                "teamwork": 4,
                "initiative": 3,
                "punctuality": 5
            },
            "feedback": "Excellent progress in technical skills. Shows great potential.",
            "objectives_met": ["Learn web development fundamentals"],
            "areas_for_improvement": ["Take more initiative in team meetings"],
            "overall_rating": 4.2,
            "evaluation_date": datetime.now().isoformat()
        }
        
        success, response = self.make_request('POST', 'company/evaluations', evaluation_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/evaluations", True, "Evaluation created successfully")
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/evaluations", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/evaluations", False, str(response))

    def test_integrations_management(self):
        """Test Integrations Management endpoints"""
        print("\n🔗 TESTING INTEGRATIONS MANAGEMENT")
        
        if not self.company_token:
            self.log_test("Integrations Management", False, "No company token available")
            return

        # Test 1: GET /api/company/integrations
        print("\n🔌 Testing GET /api/company/integrations")
        success, response = self.make_request('GET', 'company/integrations', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/integrations", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} integrations")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/integrations", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/integrations", False, str(response))

        # Test 2: POST /api/company/integrations
        print("\n➕ Testing POST /api/company/integrations")
        integration_data = {
            "name": "HR Management System",
            "type": "hrms",
            "provider": "WorkdayHR",
            "configuration": {
                "api_endpoint": "https://api.workday.com/v1",
                "sync_frequency": "daily",
                "data_types": ["employees", "departments", "positions"]
            },
            "is_active": True,
            "last_sync": None
        }
        
        success, response = self.make_request('POST', 'company/integrations', integration_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/integrations", True, "Integration created successfully")
            self.integration_id = response.get('id') if isinstance(response, dict) else None
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/integrations", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/integrations", False, str(response))

        # Test 3: GET /api/company/imports
        print("\n📥 Testing GET /api/company/imports")
        success, response = self.make_request('GET', 'company/imports', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/imports", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} import records")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/imports", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/imports", False, str(response))

        # Test 4: GET /api/company/exports
        print("\n📤 Testing GET /api/company/exports")
        success, response = self.make_request('GET', 'company/exports', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/exports", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} export records")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/exports", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/exports", False, str(response))

        # Test 5: POST /api/company/import-csv
        print("\n📊 Testing POST /api/company/import-csv")
        csv_import_data = {
            "file_name": "student_data.csv",
            "data_type": "students",
            "mapping": {
                "first_name": "column_1",
                "last_name": "column_2", 
                "email": "column_3",
                "school": "column_4"
            },
            "options": {
                "skip_duplicates": True,
                "validate_emails": True
            }
        }
        
        success, response = self.make_request('POST', 'company/import-csv', csv_import_data, token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("POST /api/company/import-csv", True, "CSV import initiated successfully")
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/import-csv", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/import-csv", False, str(response))

        # Test 6: POST /api/company/export
        print("\n📋 Testing POST /api/company/export")
        export_data = {
            "data_type": "applications",
            "format": "csv",
            "filters": {
                "status": "received",
                "date_range": {
                    "start": "2025-01-01",
                    "end": "2025-12-31"
                }
            },
            "fields": ["student_name", "application_date", "status", "position"]
        }
        
        success, response = self.make_request('POST', 'company/export', export_data, token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("POST /api/company/export", True, "Data export initiated successfully")
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/export", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/export", False, str(response))

    def test_advanced_communication_system(self):
        """Test Advanced Communication System endpoints"""
        print("\n💬 TESTING ADVANCED COMMUNICATION SYSTEM")
        
        if not self.company_token:
            self.log_test("Advanced Communication System", False, "No company token available")
            return

        # Test 1: GET /api/company/messages
        print("\n📨 Testing GET /api/company/messages")
        success, response = self.make_request('GET', 'company/messages', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/messages", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} messages")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/messages", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/messages", False, str(response))

        # Test 2: POST /api/company/messages
        print("\n✉️ Testing POST /api/company/messages")
        message_data = {
            "recipient_type": "student",
            "recipient_ids": ["student-123", "student-456"],
            "subject": "Internship Opportunity Available",
            "content": "We have an exciting internship opportunity that matches your profile.",
            "message_type": "opportunity",
            "scheduled_send": None,
            "attachments": [],
            "priority": "normal"
        }
        
        success, response = self.make_request('POST', 'company/messages', message_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/messages", True, "Message created successfully")
            self.message_id = response.get('id') if isinstance(response, dict) else None
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/messages", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/messages", False, str(response))

        # Test 3: GET /api/company/workflows
        print("\n🔄 Testing GET /api/company/workflows")
        success, response = self.make_request('GET', 'company/workflows', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/workflows", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} workflows")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/workflows", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/workflows", False, str(response))

        # Test 4: POST /api/company/workflows
        print("\n⚙️ Testing POST /api/company/workflows")
        workflow_data = {
            "name": "Application Review Process",
            "description": "Automated workflow for reviewing student applications",
            "trigger": {
                "type": "application_received",
                "conditions": {
                    "position_type": "internship"
                }
            },
            "steps": [
                {
                    "step_id": 1,
                    "action": "send_acknowledgment",
                    "delay": 0,
                    "parameters": {
                        "template": "application_received"
                    }
                },
                {
                    "step_id": 2,
                    "action": "notify_hr",
                    "delay": 3600,
                    "parameters": {
                        "recipients": ["hr@company.com"]
                    }
                }
            ],
            "is_active": True
        }
        
        success, response = self.make_request('POST', 'company/workflows', workflow_data, token=self.company_token, expected_status=201)
        
        if success:
            self.log_test("POST /api/company/workflows", True, "Workflow created successfully")
        else:
            if "404" in str(response):
                self.log_test("POST /api/company/workflows", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("POST /api/company/workflows", False, str(response))

        # Test 5: GET /api/company/notifications
        print("\n🔔 Testing GET /api/company/notifications")
        success, response = self.make_request('GET', 'company/notifications', token=self.company_token, expected_status=200)
        
        if success:
            self.log_test("GET /api/company/notifications", True, f"Retrieved {len(response) if isinstance(response, list) else 'N/A'} notifications")
        else:
            if "404" in str(response):
                self.log_test("GET /api/company/notifications", False, "ENDPOINT NOT IMPLEMENTED - 404 Not Found")
            else:
                self.log_test("GET /api/company/notifications", False, str(response))

    def test_fallback_scenarios(self):
        """Test fallback scenarios for missing endpoints"""
        print("\n🔄 TESTING FALLBACK SCENARIOS")
        
        if not self.company_token:
            self.log_test("Fallback scenarios", False, "No company token available")
            return

        # Test that existing endpoints still work as fallbacks
        print("\n📋 Testing existing endpoints as fallbacks")
        
        # Test existing offers endpoint (should work)
        success, response = self.make_request('GET', 'offers/my', token=self.company_token, expected_status=200)
        self.log_test("Fallback: GET /api/offers/my", success, 
                     f"Existing offers endpoint works: {len(response) if success and isinstance(response, list) else 'N/A'} offers")

        # Test existing applications endpoint (should work)
        success, response = self.make_request('GET', 'applications/company', token=self.company_token, expected_status=200)
        self.log_test("Fallback: GET /api/applications/company", success,
                     f"Existing applications endpoint works: {len(response) if success and isinstance(response, list) else 'N/A'} applications")

        # Test existing company profile endpoint (should work)
        success, response = self.make_request('GET', 'profile/company', token=self.company_token, expected_status=200)
        self.log_test("Fallback: GET /api/profile/company", success,
                     f"Existing profile endpoint works: {response.get('company_name', 'N/A') if success and isinstance(response, dict) else 'Error'}")

    def run_all_tests(self):
        """Run all company sections tests"""
        print("🚀 STARTING COMPANY SECTIONS BACKEND API TESTS")
        print(f"Testing against: {self.base_url}")
        print("=" * 80)
        
        # Setup authentication
        if not self.setup_company_authentication():
            print("❌ Failed to setup company authentication. Aborting tests.")
            return
        
        # Run all test suites
        self.test_document_management_system()
        self.test_internship_tracking_system()
        self.test_integrations_management()
        self.test_advanced_communication_system()
        self.test_fallback_scenarios()
        
        # Print summary
        print("\n" + "=" * 80)
        print("📊 COMPANY SECTIONS TEST SUMMARY")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed / self.tests_run * 100):.1f}%")
        
        # Print failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        # Print analysis
        print(f"\n🔍 ANALYSIS:")
        not_implemented_count = len([test for test in failed_tests if "NOT IMPLEMENTED" in test['details']])
        other_errors_count = len(failed_tests) - not_implemented_count
        
        print(f"  - Endpoints not implemented: {not_implemented_count}")
        print(f"  - Other errors: {other_errors_count}")
        print(f"  - Working endpoints: {self.tests_passed}")
        
        if not_implemented_count > 0:
            print(f"\n⚠️  CRITICAL: {not_implemented_count} company section endpoints are missing from the backend!")
            print("   The review request asks to test these endpoints, but they don't exist yet.")
            print("   Backend implementation is needed for the newly integrated company sections.")

if __name__ == "__main__":
    tester = CompanySectionsAPITester()
    tester.run_all_tests()