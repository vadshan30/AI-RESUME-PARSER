import requests
import os

with open('dummy.pdf', 'wb') as f:
    f.write(b'%PDF-1.4 dummy pdf content')

url = 'http://localhost:8000/resume/upload'
files = {'file': open('dummy.pdf', 'rb')}
try:
    response = requests.post(url, files=files)
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)
except Exception as e:
    print("ERROR:", str(e))
