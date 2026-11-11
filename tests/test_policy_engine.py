import os
import importlib
import time
from pathlib import Path

import pytest

from backend.app.policy.forbidden_tools_guard import ToolCall
from tests.utils.policy_helpers import make_policy, reload_policy_modules


def write_policy(path: Path, **kwargs) -> Path:
    path.write_text(make_policy(**kwargs), encoding="utf-8")
    return path


def reload_middlewares():
    modules = reload_policy_modules()
    return modules.tool_execution


def test_policy_loads_and_validates(tmp_path, monkeypatch):
    policy_path = write_policy(
        tmp_path / "policy.yaml",
        forbidden=["web.run", "unsafe"],
        aliases={"internet": "web.run", "browse": "web.run"},
    )
    monkeypatch.setenv("POLICY_FILE", str(policy_path))
    te = reload_middlewares()

    call = ToolCall(name="internet", display_name="Web", context="sync", prompt="ok")
    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=["x"], request_id="r1", user_id="u1")


def test_policy_overrides_runtime_without_redeploy(tmp_path, monkeypatch):
    policy_path = write_policy(tmp_path / "policy.yaml", forbid_async=True)
    monkeypatch.setenv("POLICY_FILE", str(policy_path))
    te = reload_middlewares()

    call = ToolCall(name="x", display_name="X", context="async", prompt="...")
    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="r2", user_id="u2")

    time.sleep(0.01)
    write_policy(policy_path, forbid_async=False)
    te = reload_middlewares()

    call2 = ToolCall(name="x", display_name="X", context="async", prompt="...")
    out = te.execute_tool(lambda **k: "ok", call=call2, ancestry=[], request_id="r3", user_id="u3")
    assert out == "ok"


def test_policy_blocks_with_custom_pattern_via_alias(tmp_path, monkeypatch):
    policy_path = write_policy(
        tmp_path / "policy.yaml",
        forbidden=["danger.run"],
        aliases={"go": "danger.run"},
    )
    monkeypatch.setenv("POLICY_FILE", str(policy_path))
    te = reload_middlewares()

    call = ToolCall(
        name="ok", display_name="OK", context="sync", prompt="utilise danger.run\nensuite continue"
    )
    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="r4", user_id="u4")


def test_policy_nested_toggle(tmp_path, monkeypatch):
    policy_path = write_policy(tmp_path / "policy.yaml", forbidden=["web.run"], forbid_nested=True)
    monkeypatch.setenv("POLICY_FILE", str(policy_path))
    te = reload_middlewares()

    call = ToolCall(name="file_search", display_name="FS", context="sync", prompt="ok")
    with pytest.raises(PermissionError):
        te.execute_tool(
            lambda **k: "ok", call=call, ancestry=["web.run"], request_id="r5", user_id="u5"
        )

    time.sleep(0.01)
    write_policy(policy_path, forbidden=["web.run"], forbid_nested=False)
    te = reload_middlewares()

    out = te.execute_tool(
        lambda **k: "ok", call=call, ancestry=["web.run"], request_id="r6", user_id="u6"
    )
    assert out == "ok"


def test_policy_reload_counters(tmp_path, monkeypatch):
    from backend.app.observability.metrics import REGISTRY

    REGISTRY._counters.clear()
    REGISTRY._latency.clear()

    missing_path = tmp_path / "missing.yaml"
    monkeypatch.setenv("POLICY_FILE", str(missing_path))

    import importlib
    import backend.app.policy.loader as loader

    loader = importlib.reload(loader)
    loader.PolicyLoader().load_if_changed()

    export1 = REGISTRY.export()
    assert export1["counters"].get("policy_reload_count{error}", 0) >= 1

    valid_path = tmp_path / "policy.yaml"
    valid_path.write_text("version: 1\n", encoding="utf-8")
    monkeypatch.setenv("POLICY_FILE", str(valid_path))
    loader = importlib.reload(loader)
    loader.PolicyLoader().load_if_changed()

    export2 = REGISTRY.export()
    assert export2["counters"].get("policy_reload_count{ok}", 0) >= 1
