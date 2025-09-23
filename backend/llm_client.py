import asyncio
import json
import logging
import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import httpx

logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT = float(os.getenv("LLM_HTTP_TIMEOUT", "30"))
DEFAULT_RETRIES = int(os.getenv("LLM_HTTP_RETRIES", "2"))
DEFAULT_PROVIDER = os.getenv("LLM_PROVIDER", "stub").strip().lower() or "stub"
DEFAULT_MODEL = os.getenv("LLM_MODEL", "llama3.1")


@dataclass
class UserMessage:
    text: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ChatMessage:
    role: str
    content: str


def _normalize_provider(provider: Optional[str]) -> str:
    if not provider:
        return DEFAULT_PROVIDER
    return provider.strip().lower()


class LlmChat:
    """Async chat client supporting local (Ollama), OpenAI-compatible and stub modes."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        session_id: Optional[str] = None,
        system_message: Optional[str] = None,
        provider: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[float] = None,
        retries: Optional[int] = None,
    ) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.session_id = session_id or "session-local"
        self.system_message = system_message
        self.provider = _normalize_provider(provider)
        self.model = model or DEFAULT_MODEL
        self.timeout = timeout or DEFAULT_TIMEOUT
        self.retries = retries if retries is not None else DEFAULT_RETRIES
        self.history: List[ChatMessage] = []
        self._warn_if_stub()

    def with_model(self, provider: Optional[str], model: Optional[str]) -> "LlmChat":
        self.provider = _normalize_provider(provider)
        if model:
            self.model = model
        return self

    async def send_message(self, message: UserMessage) -> str:
        self.history.append(ChatMessage(role="user", content=message.text))

        if self.provider == "openai":
            return await self._call_openai()
        if self.provider == "ollama":
            return await self._call_ollama()
        return self._fallback_response(message)

    @property
    def messages_payload(self) -> List[Dict[str, str]]:
        messages: List[Dict[str, str]] = []
        if self.system_message:
            messages.append({"role": "system", "content": self.system_message})
        for entry in self.history:
            messages.append({"role": entry.role, "content": entry.content})
        return messages

    async def _call_openai(self) -> str:
        base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
        url = f"{base_url}/chat/completions"

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        else:
            logger.warning("OPENAI_API_KEY missing, falling back to stub responses")
            return self._fallback_response(self.history[-1])

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": self.messages_payload,
            "temperature": float(os.getenv("LLM_TEMPERATURE", "0.2")),
        }

        for attempt in range(1, self.retries + 2):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                self.history.append(ChatMessage(role="assistant", content=content))
                return content
            except Exception as exc:
                logger.error("OpenAI provider error (attempt %s/%s): %s", attempt, self.retries + 1, exc)
                if attempt > self.retries:
                    return self._fallback_response(self.history[-1])
                await asyncio.sleep(1.5 * attempt)
        return self._fallback_response(self.history[-1])

    async def _call_ollama(self) -> str:
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        url = f"{base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": self.messages_payload,
            "stream": False,
        }

        for attempt in range(1, self.retries + 2):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                content = data.get("message", {}).get("content") or data.get("output", "")
                if not content:
                    raise ValueError("No content returned by Ollama")
                self.history.append(ChatMessage(role="assistant", content=content))
                return content
            except Exception as exc:
                logger.error("Ollama provider error (attempt %s/%s): %s", attempt, self.retries + 1, exc)
                if attempt > self.retries:
                    return self._fallback_response(self.history[-1])
                await asyncio.sleep(1.5 * attempt)
        return self._fallback_response(self.history[-1])

    def _fallback_response(self, message: ChatMessage | UserMessage) -> str:
        text = getattr(message, "text", None) or getattr(message, "content", "")
        snippet = text[:200] if text else ""

        lowered = snippet.lower() if snippet else ""

        if "match" in lowered and "score" in lowered:
            payload = {
                "match_score": 0.5,
                "reasoning": "Mode local fallback: resultat estime sans LLM.",
                "compatibility_factors": [
                    "Analyse heuristique",
                    "Activez un provider LLM pour une evaluation precise",
                ],
            }
            return json.dumps(payload)

        if "lettre" in lowered or "cover letter" in lowered:
            return (
                "Objet : Candidature (fallback)\n\n"
                "Bonjour,\n\n"
                "L'assistant IA n'est pas disponible. Utilisez ce modele simplifie en attendant"
                " la configuration d'un provider LLM.\n\n"
                "Madame, Monsieur,\n"
                "Je vous remercie pour l'attention portee a ma candidature. Mon parcours et"
                " mes competences correspondent au poste recherche et je reste a votre"
                " disposition pour un entretien.\n\n"
                "Cordialement,\nCandidat(e)\n"
            )

        if "coach" in lowered or "mentor" in lowered:
            return (
                "Mode coach fallback : definissez un objectif principal, decoupez-le en"
                " actions simples et planifiez des points de suivi. Activez un provider"
                " LLM pour des conseils personnalises."
            )

        return (
            "Reponse IA de secours. Aucun provider LLM actif. Message recu : " + snippet
        )

    def _warn_if_stub(self) -> None:
        if self.provider == "stub":
            logger.warning(
                "LLM provider set to 'stub'. Configure LLM_PROVIDER and related env vars to enable real inference."
            )


LLM_INTEGRATION_AVAILABLE = DEFAULT_PROVIDER in {"ollama", "openai"}

__all__ = ["LlmChat", "UserMessage", "LLM_INTEGRATION_AVAILABLE"]
