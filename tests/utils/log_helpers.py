import json
from typing import Any, Dict, List
from _pytest.logging import LogCaptureFixture


def parse_forbidden_tool_logs(caplog: LogCaptureFixture) -> List[Dict[str, Any]]:
    """Return parsed JSON logs for forbidden tool blocks from caplog."""
    results: List[Dict[str, Any]] = []
    for record in caplog.records:
        message = record.message
        if "forbidden_tool_blocked" not in message:
            continue
        try:
            data = json.loads(message)
        except Exception:
            continue
        if data.get("event") != "forbidden_tool_blocked":
            continue
        if "reason" not in data and "msg" in data and "Forbidden tool usage:" in data["msg"]:
            data["reason"] = data["msg"].split("Forbidden tool usage:", 1)[-1].strip()
        results.append(data)
    return results


def assert_forbidden(caplog: LogCaptureFixture, *, reason: str | None = None) -> List[Dict[str, Any]]:
    """Assert that at least one forbidden tool log was captured (optionally by reason)."""
    logs = parse_forbidden_tool_logs(caplog)
    assert logs, "Aucun log de blocage captur"
    if reason is not None:
        assert any(log.get("reason") == reason for log in logs), f"Aucun log avec reason={reason}"
    return logs
