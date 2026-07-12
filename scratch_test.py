import requests
import json

url = "http://localhost:8000/api/ai/match-job"

payload = {
    "resume_id": 1,
    "job_description": "We are looking for a Senior React Developer with 5+ years of experience. Skills required: React, Redux, Tailwind, TypeScript. You will be responsible for leading the frontend team."
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Failed to hit API: {e}")
