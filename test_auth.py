import requests
import json
import time

BASE_URL = "http://localhost:8000/api/auth"

def test_send_otp():
    print("Testing /send-otp...")
    # Test invalid email (non-gmail)
    res = requests.post(f"{BASE_URL}/send-otp", json={"email": "test@yahoo.com"})
    assert res.status_code == 400, f"Expected 400 for non-gmail, got {res.status_code}"
    
    # Test valid email
    res = requests.post(f"{BASE_URL}/send-otp", json={"email": "test@gmail.com"})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}, {res.text}"
    print("/send-otp endpoint works.")

if __name__ == "__main__":
    try:
        test_send_otp()
        print("All tests passed.")
    except Exception as e:
        print(f"Test failed: {e}")
