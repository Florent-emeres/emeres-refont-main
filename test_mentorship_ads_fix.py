#!/usr/bin/env python3
"""
Test script specifically for the mentorship ads bug fix
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend_test import EmeresAPITester

def main():
    """Run only the mentorship ads bug fix test"""
    tester = EmeresAPITester()
    
    print("🚀 STARTING MENTORSHIP ADS BUG FIX TEST")
    print(f"Testing against: {tester.base_url}")
    print("=" * 80)
    
    # Run the specific test
    tester.test_mentorship_ads_bug_fix()
    
    # Print results
    print("\n" + "=" * 80)
    print("📊 TEST RESULTS")
    print("=" * 80)
    print(f"Total Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.tests_run - tester.tests_passed > 0:
        print("\n❌ FAILED TESTS:")
        for result in tester.test_results:
            if not result['success']:
                print(f"  - {result['name']}: {result['details']}")
    else:
        print("\n✅ ALL TESTS PASSED!")

if __name__ == "__main__":
    main()