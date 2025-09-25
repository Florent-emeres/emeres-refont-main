from dataclasses import dataclass
from typing import Iterable, Mapping


@dataclass(frozen=True)
class ToolCall:
    name: str
    display_name: str | None = None
    parent: str | None = None
    context: str | None = None
    prompt: str | None = None


class ForbiddenToolsGuard:
    """Evaluate if a tool call violates security policies."""

    def __init__(self, forbidden: Iterable[str], aliases: Mapping[str, str] | None = None):
        self.forbidden = {t.lower() for t in forbidden}
        self.aliases = {k.lower(): v.lower() for k, v in (aliases or {}).items()}

    def _normalize(self, tool: str | None) -> str:
        if not tool:
            return ""
        lowered = tool.lower()
        return self.aliases.get(lowered, lowered)

    def is_forbidden(self, call: ToolCall) -> bool:
        candidates = [call.name, call.display_name]
        return any(self._normalize(candidate) in self.forbidden for candidate in candidates if candidate)

    def violates_nested_policy(self, ancestry: list[str]) -> bool:
        return any(self._normalize(ancestor) in self.forbidden for ancestor in ancestry)

    def violates_async_policy(self, call: ToolCall) -> bool:
        return (call.context or "sync").lower() == "async"

    def violates_multiline_prompt_policy(self, call: ToolCall) -> bool:
        prompt = call.prompt or ""
        if '\n' not in prompt and '\r' not in prompt:
            return False
        lowered = prompt.lower()
        return any(forbidden in lowered for forbidden in self.forbidden)
