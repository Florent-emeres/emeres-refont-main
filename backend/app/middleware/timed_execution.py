from __future__ import annotations

import json
import logging
import time
from collections.abc import Callable
from typing import Any

from backend.app.middleware.tool_execution import execute_tool
from backend.app.observability.metrics import REGISTRY

logger = logging.getLogger(__name__)


def timed_execute_tool(
    tool_fn: Callable[..., Any],
    *,
    call,
    ancestry: list[str] | None = None,
    request_id: str = "unknown",
    user_id: str | None = None,
    **tool_kwargs: Any,
) -> Any:
    ancestry = ancestry or []
    tool_name = call.name or "unknown"
    start = time.perf_counter()
    try:
        result = execute_tool(
            tool_fn,
            call=call,
            ancestry=ancestry,
            request_id=request_id,
            user_id=user_id,
            **tool_kwargs,
        )
        duration_ms = (time.perf_counter() - start) * 1000
        REGISTRY.increment(f"tool_success{{{tool_name}}}")
        REGISTRY.observe_latency(f"tool.{tool_name}.latency", duration_ms)
        return result
    except PermissionError:
        duration_ms = (time.perf_counter() - start) * 1000
        REGISTRY.increment(f"tool_blocked{{{tool_name}}}")
        REGISTRY.observe_latency(f"tool.{tool_name}.latency", duration_ms)
        raise
    except Exception as exc:  # noqa: BLE001
        duration_ms = (time.perf_counter() - start) * 1000
        REGISTRY.increment(f"tool_error{{{tool_name}}}")
        REGISTRY.observe_latency(f"tool.{tool_name}.latency", duration_ms)
        payload = {
            "event": "tool_execution_error",
            "request_id": request_id,
            "user_id": user_id,
            "tool": tool_name,
            "ancestry": ancestry,
            "error": type(exc).__name__,
            "error_message": str(exc),
        }
        logger.error(json.dumps(payload, ensure_ascii=False))
        raise
