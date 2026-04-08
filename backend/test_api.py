"""Quick test of the full auth flow."""
import json
from urllib.request import Request, urlopen

BASE = "http://localhost:8000/api"

# 1. Login
print("1. Testing login...")
login_data = json.dumps({"email": "amit@test.com", "password": "password123"}).encode()
req = Request(f"{BASE}/auth/login", data=login_data, headers={"Content-Type": "application/json"})
resp = urlopen(req)
tokens = json.loads(resp.read())
print(f"   ✅ Login OK - token: {tokens['access_token'][:30]}...")

# 2. Get /me
print("2. Testing /auth/me...")
req2 = Request(f"{BASE}/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
resp2 = urlopen(req2)
user = json.loads(resp2.read())
print(f"   ✅ User: {user['first_name']} {user['last_name']} ({user['role']})")

# 3. Dashboard stats
print("3. Testing /users/dashboard/stats...")
req3 = Request(f"{BASE}/users/dashboard/stats", headers={"Authorization": f"Bearer {tokens['access_token']}"})
resp3 = urlopen(req3)
stats = json.loads(resp3.read())
print(f"   ✅ Stats: enrolled={stats['total_courses_enrolled']}, completed={stats['completed_courses']}")

# 4. List courses
print("4. Testing /courses/...")
req4 = Request(f"{BASE}/courses/")
resp4 = urlopen(req4)
courses = json.loads(resp4.read())
print(f"   ✅ Found {len(courses)} published courses")

print()
print("🎉 All API tests passed!")
