from __future__ import annotations

from typing import Tuple

from backend.app.policy.forbidden_tools_guard import ForbiddenToolsGuard
from backend.app.policy.loader import PolicyLoader
from backend.app.policy.schema import Policy


class PolicyManager:
    def __init__(self) -> None:
        self._loader = PolicyLoader()
        self._cache: Tuple[Policy, ForbiddenToolsGuard] | None = None

    def _ensure_policy(self) -> Policy:
        return self._loader.load_if_changed()

    def get_guard_and_rules(self) -> tuple[ForbiddenToolsGuard, Policy]:
        policy = self._ensure_policy()
        if self._cache and self._cache[0] is policy:
            return self._cache[1], policy
        guard = ForbiddenToolsGuard(forbidden=policy.tools.forbidden, aliases=policy.tools.aliases)
        self._cache = (policy, guard)
        return guard, policy

    def reload(self) -> Policy:
        self._cache = None
        return self._loader.load_if_changed()


MANAGER = PolicyManager()
