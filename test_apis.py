import urllib.request
import json

def test():
    try:
        print("Testing job-match/scan...")
        data = json.dumps({'job_description': 'Looking for a Python backend engineer with React and 5 years experience', 'resume_id': 1}).encode()
        req = urllib.request.Request('http://127.0.0.1:8000/api/job-match/scan', data=data, headers={'Content-Type': 'application/json'})
        res = urllib.request.urlopen(req)
        print(json.loads(res.read()))
        
        print("\nTesting resume/1/improve...")
        data = json.dumps({'job_description': 'Python developer', 'ats_result': {'scores': {'overall_score': 50}}}).encode()
        req = urllib.request.Request('http://127.0.0.1:8000/api/resume/1/improve', data=data, headers={'Content-Type': 'application/json'})
        res = urllib.request.urlopen(req)
        print(json.loads(res.read()))
    except Exception as e:
        print(f"Error: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())

test()
