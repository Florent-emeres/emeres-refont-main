import pytest

from backend.app.observability.logging_config import setup_logging
from tests.utils.log_helpers import assert_forbidden as _assert_forbidden
from tests.utils.log_helpers import parse_forbidden_tool_logs
from tests.utils.policy_helpers import DEFAULT_POLICY, reload_policy_modules


@pytest.fixture(autouse=True, scope="session")
def _setup_json_logging():
    """Configure JSON logging for the entire pytest session."""
    setup_logging(json_output=True, level="WARNING")
    yield


def parse_forbidden_logs(caplog):
    """Return JSON payloads for forbidden_tool_blocked logs."""
    return parse_forbidden_tool_logs(caplog)


def assert_forbidden_log(caplog, *, reason: str | None = None):
    """Assert at least one forbidden_tool_blocked log, optionally by reason."""
    return _assert_forbidden(caplog, reason=reason)


@pytest.fixture(autouse=True)
def policy_env(monkeypatch, tmp_path):
    policy_path = tmp_path / "policy.yaml"
    policy_path.write_text(DEFAULT_POLICY, encoding="utf-8")
    monkeypatch.setenv("POLICY_FILE", str(policy_path))
    reload_policy_modules()
    yield policy_path
