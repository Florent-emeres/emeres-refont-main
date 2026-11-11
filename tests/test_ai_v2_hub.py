import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402


@pytest.fixture()
def client():
    return TestClient(app)


def test_student_cover_letter(client):
    payload = {"profile": "BTS SIO", "offer": "Stage Dev Web"}
    response = client.post("/ai/v2/student/student_cover_letter", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "letter" in data
    assert isinstance(data.get("key_points"), list)


def test_forbidden_tool(client):
    payload = {"profile": "X", "offer": "Y"}
    response = client.post("/ai/v2/company/student_cover_letter", json=payload)
    assert response.status_code == 403


def test_student_interview_start(client):
    response = client.post("/ai/v2/student/student_interview_start", json={"role": "Data Analyst"})
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data and "first_question" in data
