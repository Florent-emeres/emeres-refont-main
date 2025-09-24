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


def test_js_cover_letter(client):
    resp = client.post(
        "/ai/v2/jobseeker/jobseeker_cover_letter",
        json={"profile": "Parcours varié", "offer": "Agent administratif"},
    )
    assert resp.status_code == 200
    assert "letter" in resp.json()


def test_js_cv_optimizer(client):
    resp = client.post(
        "/ai/v2/jobseeker/jobseeker_cv_optimizer",
        json={"cv_text": "Exp: Divers"},
    )
    assert resp.status_code == 200
    assert "improved_cv" in resp.json()


def test_js_career_explorer(client):
    resp = client.post(
        "/ai/v2/jobseeker/jobseeker_career_explorer",
        json={"interests": ["relation client"]},
    )
    assert resp.status_code == 200
    assert isinstance(resp.json().get("roles", []), list)


def test_js_interview_flow(client):
    start = client.post(
        "/ai/v2/jobseeker/jobseeker_interview_start",
        json={"role": "Agent d'accueil"},
    )
    assert start.status_code == 200
    session_id = start.json()["session_id"]
    answer = client.post(
        "/ai/v2/jobseeker/jobseeker_interview_answer",
        json={"session_id": session_id, "answer": "Présentation"},
    )
    assert answer.status_code == 200
    assert "feedback" in answer.json()


def test_profile_and_injection(client):
    update = client.patch(
        "/me/profile",
        params={"user_id": "u_test"},
        json={"jobseeker": {"is_jobseeker": True, "programs": ["CEJ"]}},
    )
    assert update.status_code == 200
    resp = client.post(
        "/ai/v2/jobseeker/jobseeker_coach",
        json={"question": "Par quoi commencer ?"},
    )
    assert resp.status_code == 200
