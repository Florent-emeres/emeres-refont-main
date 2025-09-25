import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from backend.app.policy.forbidden_tools_guard import ToolCall
from tests.utils.log_helpers import parse_forbidden_tool_logs
from tests.utils.policy_helpers import make_policy, reload_policy_modules

BACKEND_DIR = Path(__file__).resolve().parents[1] / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app  # noqa: E402


def configure_policy(policy_path: Path, **kwargs) -> object:
    policy_path.write_text(make_policy(**kwargs), encoding="utf-8")
    modules = reload_policy_modules()
    return modules.tool_execution


@pytest.fixture()
def client():
    return TestClient(app)


def test_forbidden_student_calls_company_tool(client):
    resp = client.post(
        "/ai/v2/student/company_job_posting",
        json={"role": "Data Analyst", "requirements": []},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Tool not allowed"


def test_forbidden_company_calls_student_tool(client):
    resp = client.post(
        "/ai/v2/company/student_cover_letter",
        json={"profile": "X", "offer": "Y"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Tool not allowed"


def test_forbidden_school_calls_admin_tool(client):
    resp = client.post(
        "/ai/v2/school/admin_moderation",
        json={"item_id": "abc"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Tool not allowed"


def test_forbidden_mentor_calls_school_tool(client):
    resp = client.post(
        "/ai/v2/mentor/school_reports",
        json={"period": "S1"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Tool not allowed"


def test_forbidden_admin_calls_mentor_tool(client):
    resp = client.post(
        "/ai/v2/admin/mentor_mentor_plan",
        json={"student_id": "u1"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Tool not allowed"


def test_forbidden_jobseeker_calls_student_tool(client):
    resp = client.post(
        "/ai/v2/jobseeker/student_cv_optimizer",
        json={"cv_text": "Mon CV"},
    )
    assert resp.status_code == 403
    assert resp.json()["detail"] == "Tool not allowed"


def test_aliases_blocked(policy_env, caplog):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={"internet": "web.run"})
    caplog.set_level("WARNING")
    call = ToolCall(name="internet", display_name="Web", context="sync", prompt="cherche...")

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **kw: "ok", call=call, ancestry=["file_search"], request_id="t-alias", user_id="u1")

    assert any(
        '"event": "forbidden_tool_blocked"' in rec.message and '"reason": "alias_or_direct_forbidden"' in rec.message
        for rec in caplog.records
    )


def test_nested_calls_blocked(policy_env, caplog):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={})
    caplog.set_level("WARNING")
    call = ToolCall(name="file_search", display_name="File Search", context="sync", prompt="...")

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **kw: "ok", call=call, ancestry=["web.run"], request_id="t-nested", user_id="u1")

    assert any(
        '"event": "forbidden_tool_blocked"' in rec.message and '"reason": "nested"' in rec.message
        for rec in caplog.records
    )


def test_async_context_blocked(policy_env, caplog):
    te = configure_policy(policy_env, forbid_async=True)
    caplog.set_level("WARNING")
    call = ToolCall(name="student_job_reco", display_name="Reco", context="async", prompt="safe")

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **kw: "ok", call=call, ancestry=[], request_id="t-async", user_id="u3")

    assert any('"reason": "async_context"' in rec.message for rec in caplog.records)


def test_multiline_prompt_blocked(policy_env, caplog):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={})
    caplog.set_level("WARNING")
    call = ToolCall(
        name="file_search",
        display_name="File Search",
        context="sync",
        prompt="utilise web.run\npuis continue...",
    )

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **kw: "ok", call=call, ancestry=[], request_id="t-multi", user_id="u1")

    assert any(
        '"event": "forbidden_tool_blocked"' in rec.message and '"reason": "multiline_prompt"' in rec.message
        for rec in caplog.records
    )


def test_alias_case_insensitive(policy_env):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={"InTeRnEt": "web.run"})
    call = ToolCall(name="internet", context="sync", prompt="ok")

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="case", user_id="u1")


def test_policy_invalid_yaml_fallback(policy_env):
    modules = reload_policy_modules()
    modules.manager.MANAGER.reload()
    te = modules.tool_execution

    policy_env.write_text("not: [", encoding="utf-8")
    modules.manager.MANAGER.reload()

    call = ToolCall(name="web.run", context="sync", prompt="ok")

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="fallback", user_id="u1")


def test_multiline_without_forbidden_ok(policy_env):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={})
    call = ToolCall(name="file_search", context="sync", prompt="ligne1\nligne2")

    result = te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="multi-ok", user_id="u1")
    assert result == "ok"


def test_async_uppercase_blocked(policy_env):
    te = configure_policy(policy_env, forbid_async=True)
    call = ToolCall(name="x", context="ASYNC", prompt="ok")

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="async", user_id="u1")


def test_prompt_none_safe(policy_env):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={})
    call = ToolCall(name="file_search", context="sync", prompt=None)

    result = te.execute_tool(lambda **k: "ok", call=call, ancestry=None, request_id="prompt-none", user_id="u1")
    assert result == "ok"


def test_prompt_excerpt_truncated(policy_env, caplog):
    te = configure_policy(policy_env, forbidden=["web.run"], aliases={})
    long_prompt = "do\n" + "web.run " + ("x" * 500)
    call = ToolCall(name="file_search", context="sync", prompt=long_prompt)

    with pytest.raises(PermissionError):
        te.execute_tool(lambda **k: "ok", call=call, ancestry=[], request_id="long", user_id="u1")

    logs = parse_forbidden_tool_logs(caplog)
    assert logs, "No forbidden logs captured"
    excerpt = logs[-1]["tool_call"]["prompt_excerpt"]
    assert len(excerpt) <= 160
    assert excerpt.startswith("do")
    assert excerpt.endswith("x")
