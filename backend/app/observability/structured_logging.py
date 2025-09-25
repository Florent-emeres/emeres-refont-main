"""Structured logging helpers."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict


def build_forbidden_tool_log(
    *,
    request_id: str,
    user_id: str | None,
    reason: str,
    tool_call: Dict[str, Any],
) -> str:
    """Return a JSON string ready for WARN logging when a tool is blocked."""
    payload = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "level": "WARN",
        "event": "forbidden_tool_blocked",
        "request_id": request_id,
        "user_id": user_id,
        "reason": reason,
        "tool_call": tool_call,
    }
    return json.dumps(payload, ensure_ascii=False)
