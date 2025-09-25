from __future__ import annotations

import logging
import os
from typing import Optional

from pydantic import ValidationError

try:  # pragma: no cover - optional dependency
    import yaml
except Exception:  # pragma: no cover
    yaml = None

from backend.app.policy.schema import Policy
from backend.app.observability.metrics import inc_policy_reload


logger = logging.getLogger(__name__)

_DEFAULT_POLICY = Policy()


def _read_yaml(path: str) -> dict:
    if yaml is None:  # pragma: no cover
        return {}
    with open(path, "r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


class PolicyLoader:
    def __init__(self, path: Optional[str] = None) -> None:
        self.path = path or os.getenv("POLICY_FILE", "backend/policy.yaml")
        self._mtime: float = -1.0
        self._policy: Policy = _DEFAULT_POLICY

    def load_if_changed(self) -> Policy:
        try:
            stat = os.stat(self.path)
        except FileNotFoundError:
            logger.warning("policy_loader: file not found, using DEFAULT policy: %s", self.path)
            inc_policy_reload(ok=False)
            self._policy = _DEFAULT_POLICY
            self._mtime = -1.0
            return self._policy

        if stat.st_mtime <= self._mtime:
            return self._policy

        try:
            data = _read_yaml(self.path)
            policy = Policy.model_validate(data)
            self._policy = policy
            self._mtime = stat.st_mtime
            inc_policy_reload(ok=True)
        except (ValidationError, Exception):
            if self._mtime < 0:
                self._policy = _DEFAULT_POLICY
            # do not update mtime to retry later
        return self._policy

    def current(self) -> Policy:
        return self._policy
