import sys
from pathlib import Path

import pytest
import logging

from backend.app.policy.forbidden_tools_guard import ToolCall
from tests.utils.policy_helpers import make_policy, reload_policy_modules

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from backend.app.observability.metrics import REGISTRY  # noqa: E402


def _reset_metrics():
    REGISTRY._counters.clear()
    REGISTRY._latency.clear()


def get_timed_execute_tool():
    modules = reload_policy_modules()
    return modules.timed_execution.timed_execute_tool


def test_timed_success(caplog):
    _reset_metrics()
    caplog.set_level(logging.ERROR)

    def ok_tool(value: str) -> str:
        return value

    timed_execute_tool = get_timed_execute_tool()
    call = ToolCall(name="file_search", display_name="File Search", context="sync", prompt="ok")
    out = timed_execute_tool(
        ok_tool, call=call, ancestry=[], request_id="r-success", user_id="u1", value="hello"
    )
    assert out == "hello"

    expo = REGISTRY.export()
    assert expo["counters"].get("tool_success{file_search}") == 1
    lat = expo["latency_ms"].get("tool.file_search.latency")
    assert lat is not None
    assert lat["count"] >= 1
    for key in ("p50", "p95", "p99", "max"):
        assert key in lat


def test_timed_error(caplog):
    _reset_metrics()
    caplog.set_level(logging.ERROR)

    def boom_tool():
        raise RuntimeError("boom")

    timed_execute_tool = get_timed_execute_tool()
    call = ToolCall(name="file_search", display_name="File Search", context="sync", prompt="x")

    with pytest.raises(RuntimeError):
        timed_execute_tool(boom_tool, call=call, ancestry=[], request_id="r-error", user_id="u2")

    expo = REGISTRY.export()
    assert expo["counters"].get("tool_error{file_search}") == 1
    assert any('"tool_execution_error"' in rec.message for rec in caplog.records)


def test_timed_blocked(policy_env, caplog):
    _reset_metrics()
    caplog.set_level(logging.WARNING)

    policy_env.write_text(
        make_policy(forbidden=["web.run"], aliases={"internet": "web.run"}), encoding="utf-8"
    )
    modules = reload_policy_modules()
    timed_execute_tool = modules.timed_execution.timed_execute_tool

    def ok_tool():
        return "ok"

    call = ToolCall(name="internet", display_name="Web", context="sync", prompt="go")

    with pytest.raises(PermissionError):
        timed_execute_tool(
            ok_tool, call=call, ancestry=["file_search"], request_id="r-block", user_id="u3"
        )

    expo = REGISTRY.export()
    assert expo["counters"].get("tool_blocked{internet}") == 1
    assert any('"forbidden_tool_blocked"' in rec.message for rec in caplog.records)


def test_export_metrics_has_percentiles():
    _reset_metrics()

    timed_execute_tool = get_timed_execute_tool()

    def ok_tool():
        return "ok"

    call = ToolCall(name="x", display_name="X", context="sync", prompt="p")
    for _ in range(3):
        timed_execute_tool(ok_tool, call=call, ancestry=[], request_id="r-pct", user_id="u4")

    expo = REGISTRY.export()
    lat = expo["latency_ms"].get("tool.x.latency")
    assert lat is not None
    for key in ("p50", "p95", "p99", "max"):
        assert key in lat
