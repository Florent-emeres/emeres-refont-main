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


def test_company_job_posting(client):
    resp = client.post(
        "/ai/v2/company/company_job_posting",
        json={"role": "Data Analyst", "requirements": ["SQL", "Python"]},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"].startswith("Data Analyst")
    assert "description" in data


def test_school_reports(client):
    resp = client.post("/ai/v2/school/school_reports", json={"period": "S1"})
    assert resp.status_code == 200
    assert "indicators" in resp.json()


def test_mentor_plan(client):
    resp = client.post(
        "/ai/v2/mentor/mentor_mentor_plan",
        json={"student_id": "u1"},
    )
    assert resp.status_code == 200
    assert isinstance(resp.json().get("goals", []), list)


def test_admin_moderation(client):
    resp = client.post("/ai/v2/admin/admin_moderation", json={"item_id": "msg1"})
    assert resp.status_code == 200
    assert "action" in resp.json()
