import importlib
import os
from fastapi.testclient import TestClient
import pytest


def _ensure_env(monkeypatch):
    mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017/test")
    db_name = os.environ.get("DB_NAME", "emeres_dev")
    monkeypatch.setenv("MONGO_URL", mongo_url)
    monkeypatch.setenv("DB_NAME", db_name)
    monkeypatch.setenv("SECRET_KEY", os.environ.get("SECRET_KEY", "dev-secret"))
    monkeypatch.setenv("USE_V2_ONLY", "true")


@pytest.mark.skipif(os.environ.get("SKIP_LEGACY_410_TEST") == "1", reason="legacy test skipped")
def test_legacy_generate_cover_letter_returns_410(monkeypatch):
    _ensure_env(monkeypatch)
    legacy_module = importlib.import_module("backend.server")
    importlib.reload(legacy_module)
    client = TestClient(legacy_module.app)
    response = client.post(
        "/api/ai/generate-cover-letter",
        json={
            "studentProfile": {},
            "jobInfo": {},
            "preferences": {},
        },
    )
    assert response.status_code == 410
