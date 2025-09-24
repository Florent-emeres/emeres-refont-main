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


def test_forbidden_student_calls_company_tool(client):
    # Test avec JSON valide
    resp = client.post(
        "/ai/v2/student/company_job_posting",
        json={"role": "Data Analyst", "requirements": []},
    )
    assert resp.status_code == 403
    assert resp.headers["content-type"] == "application/json"
    assert "detail" in resp.json()
    assert "tool not allowed" in resp.json()["detail"].lower()

    # Test avec JSON invalide mais bien formaté
    resp = client.post(
        "/ai/v2/student/company_job_posting",
        json={},
    )
    assert resp.status_code == 403
    assert "detail" in resp.json()
    assert resp.json()["detail"] == "Tool not allowed"

    # Test avec contenu vide mais valide
    resp = client.post(
        "/ai/v2/student/company_job_posting",
        json=None
    )
    assert resp.status_code in (403, 422)  # 422 est acceptable car le corps est requis

    # Test avec autre type de contenu
    resp = client.post(
        "/ai/v2/student/company_job_posting",
        data="texte brut"
    )
    assert resp.status_code in (403, 422)  # 422 est acceptable car le corps est invalide


def test_forbidden_company_calls_student_tool(client):
    # Test accès outil étudiant
    resp = client.post(
        "/ai/v2/company/student_cover_letter",
        json={"profile": "X", "offer": "Y"},
    )
    assert resp.status_code == 403
    assert "detail" in resp.json()
    assert resp.json()["detail"] == "Tool not allowed"

    # Test accès autre outil étudiant
    resp = client.post(
        "/ai/v2/company/student_cv_analysis",
        json={"cv": "content"},
    )
    assert resp.status_code == 403


def test_forbidden_school_calls_admin_tool(client):
    # Test outil admin standard
    resp = client.post(
        "/ai/v2/school/admin_moderation",
        json={"item_id": "abc"},
    )
    assert resp.status_code == 403
    assert "detail" in resp.json()
    assert resp.json()["detail"] == "Tool not allowed"

    # Test outil admin avec données complexes
    resp = client.post(
        "/ai/v2/school/admin_moderation",
        json={"items": [{"id": "1"}, {"id": "2"}]},
    )
    assert resp.status_code == 403


def test_forbidden_mentor_calls_school_tool(client):
    # Test rapport standard
    resp = client.post(
        "/ai/v2/mentor/school_reports",
        json={"period": "S1"},
    )
    assert resp.status_code == 403
    assert "detail" in resp.json()
    assert resp.json()["detail"] == "Tool not allowed"

    # Test rapport détaillé
    resp = client.post(
        "/ai/v2/mentor/school_reports",
        json={"period": "S1", "details": True},
    )
    assert resp.status_code == 403


def test_forbidden_admin_calls_mentor_tool(client):
    # Test outil mentor basique
    resp = client.post(
        "/ai/v2/admin/mentor_mentor_plan",
        json={"student_id": "u1"},
    )
    assert resp.status_code == 403
    assert "detail" in resp.json()
    assert resp.json()["detail"] == "Tool not allowed"

    # Test avec paramètres étendus
    resp = client.post(
        "/ai/v2/admin/mentor_mentor_plan",
        json={"student_id": "u1", "extended": True},
    )
    assert resp.status_code == 403


def test_forbidden_jobseeker_calls_student_tool(client):
    # Test outil CV
    resp = client.post(
        "/ai/v2/jobseeker/student_cv_optimizer",
        json={"cv_text": "Mon CV..."},
    )
    assert resp.status_code == 403
    assert "detail" in resp.json()
    assert resp.json()["detail"] == "Tool not allowed"

    # Test outil lettre motivation
    resp = client.post(
        "/ai/v2/jobseeker/student_cover_letter",
        json={"profile": "Parcours", "offer": "Poste"},
    )
    assert resp.status_code == 403

    # Test avec en-têtes personnalisés
    resp = client.post(
        "/ai/v2/jobseeker/student_cv_optimizer",
        json={"cv_text": "CV"},
        headers={"X-Custom": "test"},
    )
    assert resp.status_code == 403
