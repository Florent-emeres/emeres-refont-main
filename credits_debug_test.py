#!/usr/bin/env python3
"""
Debug Credits System Issues
"""

import requests
import json

def test_credits_endpoints():
    base_url = "https://emeres-ui-enhance.preview.emergentagent.com/api"
    
    # Login first
    login_data = {"email": "student@emeres.fr", "password": "StudentPass123!"}
    response = requests.post(f"{base_url}/auth/login", json=login_data)
    
    if response.status_code != 200:
        print(f"Login failed: {response.status_code} - {response.text}")
        return
    
    token = response.json().get('access_token')
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    
    print("🔍 DEBUGGING CREDITS SYSTEM ENDPOINTS")
    print("=" * 50)
    
    # Test credits balance
    print("\n1. Testing GET /api/credits/balance")
    response = requests.get(f"{base_url}/credits/balance", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test credits config
    print("\n2. Testing GET /api/credits/config")
    response = requests.get(f"{base_url}/credits/config", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test award points with correct data
    print("\n3. Testing POST /api/credits/award-points")
    award_data = {"action_type": "daily_login"}
    response = requests.post(f"{base_url}/credits/award-points", json=award_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test can-use with correct data
    print("\n4. Testing POST /api/credits/can-use")
    usage_data = {"credits_to_use_euros": 5.0, "order_total_euros": 20.0}
    response = requests.post(f"{base_url}/credits/can-use", json=usage_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_credits_endpoints()