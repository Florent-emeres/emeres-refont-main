#!/usr/bin/env python3
"""
Test script specifically for mentorship ads visibility limits
Answers the question: Is there a 6-ad limit on mentorship ads visibility?
"""

import sys
import os
sys.path.append('/app')

from backend_test import EmeresAPITester

def main():
    print("🎯 MENTORSHIP ADS VISIBILITY LIMITS TEST")
    print("Question: Is there a limit of 6 ads visible to mentors?")
    print("=" * 80)
    
    # Initialize tester
    tester = EmeresAPITester()
    
    # Run the specific test
    tester.test_mentorship_ads_visibility_limits()
    
    # Print results
    print("\n" + "=" * 80)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 80)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "No tests run")
    
    # Show failed tests if any
    failed_tests = [test for test in tester.test_results if not test['success']]
    if failed_tests:
        print("\n❌ FAILED TESTS:")
        for test in failed_tests:
            print(f"  - {test['name']}: {test['details']}")
    else:
        print("\n✅ ALL TESTS PASSED!")

if __name__ == "__main__":
    main()