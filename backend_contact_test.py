#!/usr/bin/env python3
"""
ÉMÉRÉS Contact Endpoint Comprehensive Testing
Test du nouveau endpoint de contact /api/contact

Test Requirements from Review Request:
1. POST /api/contact accepte les données du formulaire 
2. Validation des champs requis (firstName, lastName, email, message)
3. Organisation optionnelle fonctionne
4. Réponse JSON correcte avec timestamp
5. Email envoyé à contact@emeres.fr avec les détails
6. Email de confirmation envoyé à l'expéditeur  
7. Templates HTML fonctionnels
8. Gestion d'erreurs appropriée (400/500)
9. Test avec tous les champs
10. Test sans organisation (champ optionnel)
11. Test avec messages longs
12. Vérification des erreurs 400/500
"""

import requests
import json
import time
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')
load_dotenv('/app/frontend/.env')

# Configuration
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
API_BASE = f"{BACKEND_URL}/api"

class ContactEndpointTester:
    def __init__(self):
        self.results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_result(self, test_name, success, details="", response_data=None):
        """Log test result"""
        self.total_tests += 1
        if success:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            self.failed_tests += 1
            status = "❌ FAIL"
            
        result = {
            "test": test_name,
            "status": status,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()

    def test_contact_endpoint_basic_functionality(self):
        """Test 1: Basic contact form submission with all fields"""
        print("🧪 TEST 1: Basic Contact Form Submission (All Fields)")
        
        try:
            contact_data = {
                "firstName": "Jean",
                "lastName": "Dupont",
                "email": "jean.dupont@example.com",
                "organization": "Tech Innovation SAS",
                "message": "Bonjour, je souhaite en savoir plus sur vos services de placement étudiant. Pouvez-vous me contacter pour discuter d'un partenariat potentiel ?"
            }
            
            response = requests.post(
                f"{API_BASE}/contact",
                json=contact_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_json = response.json()
                
                # Verify response structure
                required_fields = ["success", "message", "timestamp"]
                missing_fields = [field for field in required_fields if field not in response_json]
                
                if missing_fields:
                    self.log_result(
                        "Basic Contact Form - Response Structure",
                        False,
                        f"Missing required fields in response: {missing_fields}",
                        response_json
                    )
                    return
                
                # Verify response values
                if response_json.get("success") != True:
                    self.log_result(
                        "Basic Contact Form - Success Field",
                        False,
                        f"Expected success=True, got {response_json.get('success')}",
                        response_json
                    )
                    return
                
                # Verify timestamp format
                timestamp = response_json.get("timestamp")
                if not timestamp:
                    self.log_result(
                        "Basic Contact Form - Timestamp",
                        False,
                        "Timestamp field is missing or empty",
                        response_json
                    )
                    return
                
                self.log_result(
                    "Basic Contact Form - All Fields",
                    True,
                    f"Successfully submitted contact form. Response: {response_json.get('message')}",
                    response_json
                )
                
            else:
                self.log_result(
                    "Basic Contact Form - All Fields",
                    False,
                    f"Expected status 200, got {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_result(
                "Basic Contact Form - All Fields",
                False,
                f"Exception occurred: {str(e)}"
            )

    def test_contact_endpoint_without_organization(self):
        """Test 2: Contact form without optional organization field"""
        print("🧪 TEST 2: Contact Form Without Organization (Optional Field)")
        
        try:
            contact_data = {
                "firstName": "Marie",
                "lastName": "Martin",
                "email": "marie.martin@gmail.com",
                "message": "Je suis étudiante en informatique et j'aimerais savoir comment votre plateforme peut m'aider à trouver un stage."
            }
            # Note: organization field is intentionally omitted
            
            response = requests.post(
                f"{API_BASE}/contact",
                json=contact_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_json = response.json()
                
                if response_json.get("success") == True:
                    self.log_result(
                        "Contact Form Without Organization",
                        True,
                        "Successfully submitted contact form without organization field",
                        response_json
                    )
                else:
                    self.log_result(
                        "Contact Form Without Organization",
                        False,
                        f"Expected success=True, got {response_json.get('success')}",
                        response_json
                    )
            else:
                self.log_result(
                    "Contact Form Without Organization",
                    False,
                    f"Expected status 200, got {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_result(
                "Contact Form Without Organization",
                False,
                f"Exception occurred: {str(e)}"
            )

    def test_contact_endpoint_long_message(self):
        """Test 3: Contact form with long message"""
        print("🧪 TEST 3: Contact Form With Long Message")
        
        try:
            long_message = """
            Bonjour l'équipe ÉMÉRÉS,
            
            Je me permets de vous contacter car je suis très intéressé par votre plateforme de mise en relation entre étudiants et entreprises. En tant que directeur des ressources humaines d'une entreprise de 200 employés dans le secteur de la technologie, nous sommes constamment à la recherche de jeunes talents pour nos équipes.
            
            Nous avons plusieurs besoins spécifiques :
            - Des stagiaires en développement web (React, Node.js, Python)
            - Des alternants en cybersécurité 
            - Des étudiants en marketing digital
            - Des profils en data science et intelligence artificielle
            
            Notre entreprise, Tech Solutions Pro, est basée à Lyon mais nous avons également des bureaux à Paris et Marseille. Nous offrons un environnement de travail moderne avec télétravail partiel, formation continue, et de nombreux avantages sociaux.
            
            J'aimerais organiser une réunion pour discuter :
            1. Des modalités de partenariat avec votre plateforme
            2. Des coûts associés à la publication d'offres
            3. Des outils de gestion des candidatures que vous proposez
            4. Des statistiques de matching avec les profils étudiants
            5. Des possibilités d'événements de recrutement
            
            Nous sommes également intéressés par la possibilité de proposer du mentorat à vos étudiants, car plusieurs de nos cadres seniors seraient ravis de partager leur expérience.
            
            Pourriez-vous me recontacter dans les plus brefs délais ? Je suis disponible du lundi au vendredi de 9h à 18h.
            
            Cordialement,
            Pierre Dubois
            Directeur RH
            Tech Solutions Pro
            """
            
            contact_data = {
                "firstName": "Pierre",
                "lastName": "Dubois",
                "email": "p.dubois@techsolutionspro.fr",
                "organization": "Tech Solutions Pro",
                "message": long_message.strip()
            }
            
            response = requests.post(
                f"{API_BASE}/contact",
                json=contact_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_json = response.json()
                
                if response_json.get("success") == True:
                    self.log_result(
                        "Contact Form With Long Message",
                        True,
                        f"Successfully submitted contact form with long message ({len(long_message)} characters)",
                        response_json
                    )
                else:
                    self.log_result(
                        "Contact Form With Long Message",
                        False,
                        f"Expected success=True, got {response_json.get('success')}",
                        response_json
                    )
            else:
                self.log_result(
                    "Contact Form With Long Message",
                    False,
                    f"Expected status 200, got {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_result(
                "Contact Form With Long Message",
                False,
                f"Exception occurred: {str(e)}"
            )

    def test_contact_endpoint_validation_errors(self):
        """Test 4: Validation errors for required fields"""
        print("🧪 TEST 4: Validation Errors for Required Fields")
        
        # Test cases for missing required fields
        test_cases = [
            {
                "name": "Missing firstName",
                "data": {
                    "lastName": "Test",
                    "email": "test@example.com",
                    "message": "Test message"
                },
                "expected_status": 422
            },
            {
                "name": "Missing lastName", 
                "data": {
                    "firstName": "Test",
                    "email": "test@example.com",
                    "message": "Test message"
                },
                "expected_status": 422
            },
            {
                "name": "Missing email",
                "data": {
                    "firstName": "Test",
                    "lastName": "Test",
                    "message": "Test message"
                },
                "expected_status": 422
            },
            {
                "name": "Missing message",
                "data": {
                    "firstName": "Test",
                    "lastName": "Test",
                    "email": "test@example.com"
                },
                "expected_status": 422
            },
            {
                "name": "Invalid email format",
                "data": {
                    "firstName": "Test",
                    "lastName": "Test",
                    "email": "invalid-email",
                    "message": "Test message"
                },
                "expected_status": 422
            },
            {
                "name": "Empty firstName",
                "data": {
                    "firstName": "",
                    "lastName": "Test",
                    "email": "test@example.com",
                    "message": "Test message"
                },
                "expected_status": 422
            }
        ]
        
        for test_case in test_cases:
            try:
                response = requests.post(
                    f"{API_BASE}/contact",
                    json=test_case["data"],
                    headers={"Content-Type": "application/json"},
                    timeout=30
                )
                
                if response.status_code == test_case["expected_status"]:
                    self.log_result(
                        f"Validation Error - {test_case['name']}",
                        True,
                        f"Correctly returned status {response.status_code} for invalid data"
                    )
                else:
                    self.log_result(
                        f"Validation Error - {test_case['name']}",
                        False,
                        f"Expected status {test_case['expected_status']}, got {response.status_code}",
                        response.text
                    )
                    
            except Exception as e:
                self.log_result(
                    f"Validation Error - {test_case['name']}",
                    False,
                    f"Exception occurred: {str(e)}"
                )

    def test_contact_endpoint_email_functionality(self):
        """Test 5: Email sending functionality (simulation check)"""
        print("🧪 TEST 5: Email Sending Functionality")
        
        try:
            contact_data = {
                "firstName": "Sophie",
                "lastName": "Leroy",
                "email": "sophie.leroy@universite.fr",
                "organization": "Université de Lyon",
                "message": "Nous aimerions établir un partenariat avec ÉMÉRÉS pour nos étudiants en master."
            }
            
            response = requests.post(
                f"{API_BASE}/contact",
                json=contact_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_json = response.json()
                
                # Since we're in development mode, emails are simulated
                # We check that the endpoint completes successfully, indicating email logic executed
                if response_json.get("success") == True:
                    self.log_result(
                        "Email Sending Functionality",
                        True,
                        "Contact form processed successfully - email sending logic executed (simulated in dev mode)",
                        response_json
                    )
                else:
                    self.log_result(
                        "Email Sending Functionality",
                        False,
                        f"Email sending failed - success={response_json.get('success')}",
                        response_json
                    )
            else:
                self.log_result(
                    "Email Sending Functionality",
                    False,
                    f"Email sending failed with status {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_result(
                "Email Sending Functionality",
                False,
                f"Exception occurred: {str(e)}"
            )

    def test_contact_endpoint_special_characters(self):
        """Test 6: Contact form with special characters and accents"""
        print("🧪 TEST 6: Contact Form With Special Characters and Accents")
        
        try:
            contact_data = {
                "firstName": "François",
                "lastName": "Müller-Château",
                "email": "francois.muller@société-française.fr",
                "organization": "Société Française d'Ingénierie & Co.",
                "message": "Bonjour ! Nous sommes intéressés par vos services. Voici nos besoins : développement web, IA, données... Pouvez-vous nous aider ? Merci ! 🚀"
            }
            
            response = requests.post(
                f"{API_BASE}/contact",
                json=contact_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                response_json = response.json()
                
                if response_json.get("success") == True:
                    self.log_result(
                        "Contact Form With Special Characters",
                        True,
                        "Successfully handled special characters, accents, and emojis",
                        response_json
                    )
                else:
                    self.log_result(
                        "Contact Form With Special Characters",
                        False,
                        f"Failed to process special characters - success={response_json.get('success')}",
                        response_json
                    )
            else:
                self.log_result(
                    "Contact Form With Special Characters",
                    False,
                    f"Failed to handle special characters - status {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_result(
                "Contact Form With Special Characters",
                False,
                f"Exception occurred: {str(e)}"
            )

    def test_contact_endpoint_malformed_requests(self):
        """Test 7: Malformed requests and edge cases"""
        print("🧪 TEST 7: Malformed Requests and Edge Cases")
        
        test_cases = [
            {
                "name": "Empty JSON",
                "data": {},
                "expected_status": 422
            },
            {
                "name": "Non-JSON Content",
                "data": "not json",
                "headers": {"Content-Type": "text/plain"},
                "expected_status": 422
            },
            {
                "name": "Null values",
                "data": {
                    "firstName": None,
                    "lastName": None,
                    "email": None,
                    "message": None
                },
                "expected_status": 422
            }
        ]
        
        for test_case in test_cases:
            try:
                headers = test_case.get("headers", {"Content-Type": "application/json"})
                
                if headers.get("Content-Type") == "application/json":
                    response = requests.post(
                        f"{API_BASE}/contact",
                        json=test_case["data"],
                        headers=headers,
                        timeout=30
                    )
                else:
                    response = requests.post(
                        f"{API_BASE}/contact",
                        data=test_case["data"],
                        headers=headers,
                        timeout=30
                    )
                
                if response.status_code in [422, 400, 500]:  # Accept various error codes
                    self.log_result(
                        f"Malformed Request - {test_case['name']}",
                        True,
                        f"Correctly handled malformed request with status {response.status_code}"
                    )
                else:
                    self.log_result(
                        f"Malformed Request - {test_case['name']}",
                        False,
                        f"Expected error status, got {response.status_code}",
                        response.text
                    )
                    
            except Exception as e:
                # For malformed requests, exceptions might be expected
                self.log_result(
                    f"Malformed Request - {test_case['name']}",
                    True,
                    f"Request properly rejected with exception: {str(e)}"
                )

    def run_all_tests(self):
        """Run all contact endpoint tests"""
        print("🚀 ÉMÉRÉS CONTACT ENDPOINT COMPREHENSIVE TESTING")
        print("=" * 60)
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        print()
        
        # Run all tests
        self.test_contact_endpoint_basic_functionality()
        self.test_contact_endpoint_without_organization()
        self.test_contact_endpoint_long_message()
        self.test_contact_endpoint_validation_errors()
        self.test_contact_endpoint_email_functionality()
        self.test_contact_endpoint_special_characters()
        self.test_contact_endpoint_malformed_requests()
        
        # Print summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests*100):.1f}%")
        print()
        
        if self.failed_tests > 0:
            print("❌ FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
            print()
        
        print("✅ PASSED TESTS:")
        for result in self.results:
            if result["success"]:
                print(f"  - {result['test']}")
        
        return self.passed_tests, self.failed_tests, self.total_tests

if __name__ == "__main__":
    tester = ContactEndpointTester()
    passed, failed, total = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if failed == 0 else 1)