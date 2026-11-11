import sys
from pathlib import Path
import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def mock_repos():
    """Mock tous les repos utilisés - autouse=True pour appliquer à tous les tests"""
    with (
        patch("app.routes.threads_v2.threads_repo") as threads,
        patch("app.routes.threads_v2.messages_repo") as messages,
        patch("app.routes.threads_v2.audit_repo") as audit,
    ):
        threads.create_thread.return_value = "thread_123"
        threads.is_participant.return_value = True
        messages.add_message.return_value = "msg_123"
        yield {"threads": threads, "messages": messages, "audit": audit}


@pytest.fixture(autouse=True)
def mock_crypto():
    """Mock les fonctions de cryptographie - autouse=True pour appliquer à tous les tests"""
    with (
        patch("app.routes.threads_v2.encrypt") as encrypt,
        patch("app.routes.threads_v2.decrypt") as decrypt,
    ):
        encrypt.return_value = "encrypted_content"
        decrypt.return_value = "decrypted_content"
        yield {"encrypt": encrypt, "decrypt": decrypt}


def test_create_thread(client, mock_repos):
    """Test la création d'un thread avec contexte complet"""
    thread_data = {
        "participants": [
            {"user_id": "u1", "role": "student"},
            {"user_id": "c1", "role": "company"},
        ],
        "context": {"type": "mentoring", "subject": "career"},
    }

    response = client.post("/threads", json=thread_data)

    assert response.status_code == 200
    assert response.json() == {"thread_id": "thread_123"}

    mock_repos["threads"].create_thread.assert_called_once_with(
        thread_data["participants"], thread_data["context"]
    )
    mock_repos["audit"].add_audit.assert_called_once_with(
        "thread_123", "u1", "create_thread", thread_data["context"]
    )


def test_thread_message_lifecycle(client, mock_repos, mock_crypto):
    """Test le cycle de vie complet d'un message dans un thread"""
    thread_id = "thread_123"
    user_id = "u1"
    content = "Hello world!"

    # Envoi du message
    post_resp = client.post(
        f"/threads/{thread_id}/messages", json={"sender_id": user_id, "content": content}
    )
    assert post_resp.status_code == 200
    assert post_resp.json() == {"message_id": "msg_123"}
    mock_crypto["encrypt"].assert_called_once_with(content)

    # Configuration du mock pour la lecture
    mock_repos["messages"].list_messages.return_value = [
        {
            "sender_id": user_id,
            "content_enc": "encrypted_content",
            "created_at": datetime(2025, 9, 24, 12, 0),
        }
    ]

    # Lecture des messages
    get_resp = client.get(f"/threads/{thread_id}/messages?user_id={user_id}")
    assert get_resp.status_code == 200
    messages = get_resp.json()["messages"]
    assert len(messages) == 1
    assert messages[0]["content"] == "decrypted_content"
    assert messages[0]["sender_id"] == user_id
    assert "2025-09-24" in messages[0]["created_at"]

    # Marquage comme lu
    mark_resp = client.post(f"/threads/{thread_id}/read", json={"user_id": user_id})
    assert mark_resp.status_code == 200
    assert mark_resp.json() == {"status": "ok"}


def test_unauthorized_access(client, mock_repos):
    """Test les accès non autorisés aux différentes opérations"""
    thread_id = "thread_123"
    mock_repos["threads"].is_participant.return_value = False

    # Test lecture non autorisée
    get_resp = client.get(f"/threads/{thread_id}/messages?user_id=intruder")
    assert get_resp.status_code == 403
    assert get_resp.json()["detail"] == "Not a participant"

    # Test envoi non autorisé
    post_resp = client.post(
        f"/threads/{thread_id}/messages", json={"sender_id": "intruder", "content": "Hello"}
    )
    assert post_resp.status_code == 403

    # Test marquage non autorisé
    mark_resp = client.post(f"/threads/{thread_id}/read", json={"user_id": "intruder"})
    assert mark_resp.status_code == 403


def test_edge_cases(client, mock_repos, mock_crypto):
    """Test des cas limites et formats spéciaux"""
    thread_id = "thread_123"
    user_id = "u1"

    # Message vide
    post_resp = client.post(
        f"/threads/{thread_id}/messages", json={"sender_id": user_id, "content": ""}
    )
    assert post_resp.status_code == 200

    # Message avec caractères spéciaux
    post_resp = client.post(
        f"/threads/{thread_id}/messages",
        json={"sender_id": user_id, "content": "🚀 Hello! &lt;script&gt;"},
    )
    assert post_resp.status_code == 200

    # Test avec created_at manquant
    mock_repos["messages"].list_messages.return_value = [
        {
            "sender_id": user_id,
            "content_enc": "encrypted_content",
            # created_at manquant
        }
    ]
    get_resp = client.get(f"/threads/{thread_id}/messages?user_id={user_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["messages"][0]["created_at"] is None
