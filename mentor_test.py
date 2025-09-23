#!/usr/bin/env python3
"""
ÉMÉRÉS Mentor System Backend API Testing Suite
Tests all mentor endpoints as requested in the review
"""

import sys
sys.path.append('/app')
from backend_test import EmeresAPITester

def main():
    """Run mentor system tests"""
    tester = EmeresAPITester()
    
    print("🎓 STARTING ÉMÉRÉS MENTOR SYSTEM BACKEND API TESTS")
    print(f"🌐 Testing against: {tester.base_url}")
    print("=" * 80)
    
    try:
        # First ensure we have basic authentication working
        tester.test_user_registration()
        tester.test_user_login()
        
        # Run comprehensive mentor system tests
        tester.test_mentor_system_complete()
        tester.test_mentor_permissions_security()
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error during testing: {str(e)}")
    
    # Print final results
    tester.print_final_results()
    
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)