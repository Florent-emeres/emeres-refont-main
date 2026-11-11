from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from backend.app.observability.structured_logging import build_forbidden_tool_log
from backend.app.policy.forbidden_tools_guard import ToolCall
from backend.app.policy.manager import MANAGER

logger = logging.getLogger(__name__)


def _block_and_log(request_id: str, user_id: str | None, reason: str, call: ToolCall) -> None:
    payload = build_forbidden_tool_log(
        request_id=request_id,
        user_id=user_id,
        reason=reason,
        tool_call={
            "name": call.name,
            "display_name": call.display_name,
            "parent": call.parent,
            "context": call.context,
            "prompt_excerpt": (call.prompt or "")[:160],
        },
    )
    logger.warning(payload)
    raise PermissionError(f"Forbidden tool usage: {reason}")


def execute_tool(
    tool_fn: Callable[..., Any],
    *,
    call: ToolCall,
    ancestry: list[str] | None = None,
    request_id: str = "unknown",
    user_id: str | None = None,
    **tool_kwargs: Any,
) -> Any:
    ancestry = ancestry or []
    guard, policy = MANAGER.get_guard_and_rules()

    if guard.is_forbidden(call):
        _block_and_log(request_id, user_id, reason="alias_or_direct_forbidden", call=call)

    if policy.rules.forbid_nested_ancestors and guard.violates_nested_policy(ancestry):
        _block_and_log(request_id, user_id, reason="nested", call=call)

    if policy.rules.forbid_async and guard.violates_async_policy(call):
        _block_and_log(request_id, user_id, reason="async_context", call=call)

    if policy.rules.forbid_multiline_with_forbidden and guard.violates_multiline_prompt_policy(
        call
    ):
        _block_and_log(request_id, user_id, reason="multiline_prompt", call=call)

    return tool_fn(**tool_kwargs)
