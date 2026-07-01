import urllib.request
import json

url = "http://localhost:8000/api/roadmap/generate"
data = json.dumps({
    "target_role": "Software Developer",
    "missing_skills": ["Docker", "Kubernetes", "GraphQL"]
}).encode("utf-8")

headers = {
    "Content-Type": "application/json"
}

req = urllib.request.Request(url, data=data, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        print("Status Code:", response.getcode())
        result = json.loads(response.read().decode('utf-8'))
        print("Success!")
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Error:", str(e))
