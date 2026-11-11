import sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app
from app.models.schemas import ProfileUpdate, JobseekerData


@pytest.fixture
def client():
    return TestClient(app)


def test_update_profile_valid_programs(client):
    """Test update profile avec programmes valides"""
    profile_data = {
        "jobseeker": {"programs": ["RSA"], "other_field": "value", "is_jobseeker": True}
    }
    with patch("app.routes.profile.users_repo.set_jobseeker_status") as mock_update:
        response = client.patch("/me/profile?user_id=u123", json=profile_data)
        assert response.status_code == 200
        assert response.json() == {"ok": True}
        mock_update.assert_called_once_with("u123", {"programs": ["RSA"], "is_jobseeker": True})


def test_update_profile_invalid_programs(client):
    """Test update profile avec programmes invalides"""
    profile_data = {
        "jobseeker": {"programs": ["INVALID"], "other_field": "value", "is_jobseeker": True}
    }
    response = client.patch("/me/profile?user_id=u123", json=profile_data)
    assert response.status_code == 422
    assert "Invalid program" in response.json()["detail"]


def test_update_profile_multiple_programs(client):
    """Test update profile avec plusieurs programmes valides"""
    profile_data = {
        "jobseeker": {"programs": ["RSA", "CEJ"], "other_field": "value", "is_jobseeker": True}
    }
    with patch("app.routes.profile.users_repo.set_jobseeker_status") as mock_update:
        response = client.patch("/me/profile?user_id=u123", json=profile_data)
        assert response.status_code == 200
        assert response.json() == {"ok": True}
        mock_update.assert_called_once()


def test_update_profile_no_jobseeker(client):
    """Test update profile sans données jobseeker"""
    profile_data = {"other_data": "value"}
    response = client.patch("/me/profile?user_id=u123", json=profile_data)
    assert response.status_code == 200
    assert response.json() == {"ok": True}


def test_update_profile_empty_programs(client):
    """Test update profile avec liste de programmes vide"""
    profile_data = {"jobseeker": {"programs": [], "other_field": "value", "is_jobseeker": True}}
    with patch("app.routes.profile.users_repo.set_jobseeker_status") as mock_update:
        response = client.patch("/me/profile?user_id=u123", json=profile_data)
        assert response.status_code == 200
        assert response.json() == {"ok": True}
        mock_update.assert_called_once()
