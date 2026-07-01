import urllib.request
import urllib.error

try:
    print("Testing /docs...")
    req = urllib.request.Request("http://127.0.0.1:8000/docs")
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Success.")
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("Reason:", e.reason)
    print("Body:", e.read().decode())
except urllib.error.URLError as e:
    print("URLError:", e.reason)

try:
    print("\nTesting /resume/upload...")
    req = urllib.request.Request("http://127.0.0.1:8000/resume/upload", method="OPTIONS")
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("Reason:", e.reason)
    print("Body:", e.read().decode())
except urllib.error.URLError as e:
    print("URLError:", e.reason)
