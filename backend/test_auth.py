#!/usr/bin/env python3
"""
Test script for authentication endpoints
Run: python test_auth.py
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.RESET}")

def print_section(msg):
    print(f"\n{Colors.YELLOW}{'='*60}{Colors.RESET}")
    print(f"{Colors.YELLOW}{msg}{Colors.RESET}")
    print(f"{Colors.YELLOW}{'='*60}{Colors.RESET}\n")

# Test data
test_email = f"test_{datetime.now().timestamp()}@example.com"
test_name = "Test User"
test_password = "TestPass123"

def test_register():
    """Test user registration"""
    print_section("Testing User Registration")
    
    payload = {
        "name": test_name,
        "email": test_email,
        "password": test_password
    }
    
    print_info(f"Registering user: {test_email}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=payload
        )
        
        if response.status_code == 201:
            user = response.json()
            print_success(f"User registered successfully")
            print(f"  ID: {user['id']}")
            print(f"  Name: {user['name']}")
            print(f"  Email: {user['email']}")
            print(f"  Role: {user['role']}")
            return user
        else:
            print_error(f"Registration failed: {response.status_code}")
            print(response.json())
            return None
    except Exception as e:
        print_error(f"Registration error: {e}")
        return None

def test_login():
    """Test user login"""
    print_section("Testing User Login")
    
    payload = {
        "email": test_email,
        "password": test_password
    }
    
    print_info(f"Logging in with email: {test_email}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=payload
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Login successful")
            print(f"  Token Type: {data['token_type']}")
            print(f"  Token (first 50 chars): {data['access_token'][:50]}...")
            print(f"  User: {data['user']['name']}")
            return data['access_token']
        else:
            print_error(f"Login failed: {response.status_code}")
            print(response.json())
            return None
    except Exception as e:
        print_error(f"Login error: {e}")
        return None

def test_get_me(token):
    """Test get current user endpoint"""
    print_section("Testing Get Current User")
    
    print_info(f"Fetching current user info with token")
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers=headers
        )
        
        if response.status_code == 200:
            user = response.json()
            print_success(f"Current user retrieved successfully")
            print(f"  ID: {user['id']}")
            print(f"  Name: {user['name']}")
            print(f"  Email: {user['email']}")
            print(f"  Is Active: {user['is_active']}")
            print(f"  Created At: {user['created_at']}")
            return True
        else:
            print_error(f"Failed to get user: {response.status_code}")
            print(response.json())
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print_section("Testing Invalid Login (Negative Test)")
    
    payload = {
        "email": test_email,
        "password": "WrongPassword123"
    }
    
    print_info(f"Attempting login with wrong password")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=payload
        )
        
        if response.status_code == 401:
            print_success(f"Correctly rejected invalid credentials (401)")
            return True
        else:
            print_error(f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_invalid_token():
    """Test /me endpoint with invalid token"""
    print_section("Testing Invalid Token (Negative Test)")
    
    headers = {
        "Authorization": "Bearer invalid_token_123"
    }
    
    print_info(f"Attempting to fetch user with invalid token")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers=headers
        )
        
        if response.status_code == 401:
            print_success(f"Correctly rejected invalid token (401)")
            return True
        else:
            print_error(f"Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_missing_token():
    """Test /me endpoint without token"""
    print_section("Testing Missing Token (Negative Test)")
    
    print_info(f"Attempting to fetch user without token")
    
    try:
        response = requests.get(f"{BASE_URL}/api/auth/me")
        
        if response.status_code == 403:
            print_success(f"Correctly rejected missing token (403)")
            return True
        else:
            print_error(f"Expected 403, got {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def main():
    print(f"\n{Colors.BLUE}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║         ReactHub Authentication API Test Suite            ║")
    print("║              Testing Database Connection                  ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(Colors.RESET)
    
    # Test health check
    print_section("Testing API Health")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success("API is healthy and running")
        else:
            print_error("API health check failed")
            return
    except Exception as e:
        print_error(f"Cannot connect to API: {e}")
        print_info("Make sure the server is running: python -m uvicorn app.main:app --reload")
        return
    
    # Run tests
    results = {
        "register": False,
        "login": False,
        "get_me": False,
        "invalid_login": False,
        "invalid_token": False,
        "missing_token": False
    }
    
    # Positive tests
    results["register"] = test_register() is not None
    if results["register"]:
        token = test_login()
        results["login"] = token is not None
        if results["login"]:
            results["get_me"] = test_get_me(token)
    
    # Negative tests
    results["invalid_login"] = test_invalid_login()
    results["invalid_token"] = test_invalid_token()
    results["missing_token"] = test_missing_token()
    
    # Summary
    print_section("Test Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_status in results.items():
        status = f"{Colors.GREEN}✅ PASS{Colors.RESET}" if passed_status else f"{Colors.RED}❌ FAIL{Colors.RESET}"
        print(f"  {test_name.ljust(20)} {status}")
    
    print(f"\n{Colors.BLUE}Total: {passed}/{total} tests passed{Colors.RESET}\n")
    
    if passed == total:
        print(f"{Colors.GREEN}🎉 All tests passed!{Colors.RESET}\n")
    else:
        print(f"{Colors.RED}⚠️  Some tests failed{Colors.RESET}\n")

if __name__ == "__main__":
    main()
