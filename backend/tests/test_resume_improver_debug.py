import json
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_improve_resume_endpoint_returns_structured_response():
    payload = {
        "section_text": "Experienced software engineer with strong Python and cloud experience building scalable APIs and leading delivery across cross-functional teams.",
        "section_type": "summary",
        "target_role": "Python Developer",
        "level": "Mid",
    }

    response = client.post('/ai/improve-resume', json=payload)
    print('status', response.status_code)
    print('body', response.text)
    assert response.status_code == 200
    body = response.json()
    assert 'success' in body
