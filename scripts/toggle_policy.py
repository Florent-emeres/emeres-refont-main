#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Toggle forbid_async in policy.yaml and force hot reload."""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.request
from typing import Any, Dict

sys.path.insert(0, os.getcwd())

from backend.app.policy.manager import MANAGER  # type: ignore
from backend.app.observability.metrics import REGISTRY  # type: ignore

try:  # optional dependency
    import yaml  # type: ignore
except Exception:  # pragma: no cover
    yaml = None


def read_yaml(path: str) -> Dict[str, Any]:
    if yaml is None:
        raise RuntimeError("PyYAML is not installed. `pip install pyyaml`")
    with open(path, "r", encoding="utf-8") as handle:
        return yaml.safe_load(handle) or {}


def write_yaml(path: str, data: Dict[str, Any]) -> None:
    if yaml is None:
        raise RuntimeError("PyYAML is not installed. `pip install pyyaml`")
    with open(path, "w", encoding="utf-8") as handle:
        yaml.safe_dump(data, handle, sort_keys=False, allow_unicode=True)


def get_policy_path(cli_path: str | None) -> str:
    if cli_path:
        return cli_path
    env_path = os.getenv("POLICY_FILE")
    if env_path:
        return env_path
    return "backend/policy.yaml"


def http_get_metrics(url: str, timeout: float = 3.0) -> Dict[str, Any]:
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        raw = response.read().decode("utf-8", errors="replace")
    try:
        return json.loads(raw)
    except Exception:  # pragma: no cover
        return {"_raw": raw}


def toggle_forbid_async(policy: Dict[str, Any]) -> tuple[bool, bool]:
    rules = policy.setdefault("rules", {})
    before = bool(rules.get("forbid_async", True))
    after = not before
    rules["forbid_async"] = after
    return before, after


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Toggle forbid_async in policy.yaml and force hot reload."
    )
    parser.add_argument("--policy-file", dest="policy_file", default=None, help="Path to policy file")
    parser.add_argument("--metrics-url", dest="metrics_url", default=None, help="Optional /metrics URL")
    parser.add_argument("--dry-run", action="store_true", help="Show result without writing or reloading")
    args = parser.parse_args()

    policy_path = get_policy_path(args.policy_file)
    print(f"[toggle_policy] POLICY_FILE = {policy_path}")

    try:
        policy = read_yaml(policy_path)
    except FileNotFoundError:
        print(f"[toggle_policy] File not found, creating: {policy_path}")
        policy = {"version": 1, "tools": {"forbidden": [], "aliases": {}}, "rules": {}}
    except Exception as exc:
        print(f"[toggle_policy] Failed to read YAML: {exc}", file=sys.stderr)
        return 2

    before, after = toggle_forbid_async(policy)
    print(f"[toggle_policy] forbid_async: {before} -> {after}")

    if args.dry_run:
        print("[toggle_policy] DRY-RUN: no file written, no reload performed.")
        print(json.dumps(policy, ensure_ascii=False, indent=2))
        return 0

    try:
        write_yaml(policy_path, policy)
    except Exception as exc:
        print(f"[toggle_policy] Failed to write YAML: {exc}", file=sys.stderr)
        return 3

    time.sleep(0.02)
    MANAGER.reload()
    print("[toggle_policy] Reload triggered via PolicyManager.reload()")

    export_local = REGISTRY.export()
    print("[toggle_policy] Metrics (REGISTRY.export()):")
    print(json.dumps(export_local, ensure_ascii=False, indent=2))

    if args.metrics_url:
        try:
            metrics = http_get_metrics(args.metrics_url)
            print("[toggle_policy] Metrics (HTTP):")
            print(json.dumps(metrics, ensure_ascii=False, indent=2))
        except Exception as exc:  # pragma: no cover
            print(f"[toggle_policy] HTTP /metrics failed: {exc}", file=sys.stderr)

    print("[toggle_policy] Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
