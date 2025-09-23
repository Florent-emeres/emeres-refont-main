import asyncio
import json
import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from llm_client import LlmChat, UserMessage


def test_stub_match_response_contains_expected_fields(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "stub")
    chat = LlmChat(provider="stub")
    response = asyncio.run(chat.send_message(UserMessage(text="Peux-tu donner un match score ?")))
    data = json.loads(response)
    assert "match_score" in data
    assert "reasoning" in data


def test_stub_cover_letter_response(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "stub")
    chat = LlmChat(provider="stub")
    response = asyncio.run(chat.send_message(UserMessage(text="Redige une lettre de motivation.")))
    assert "Objet" in response
    assert "Cordialement" in response
