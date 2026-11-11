from __future__ import annotations

from dataclasses import dataclass
from threading import RLock


def _quantile(sorted_values: list[float], q: float) -> float:
    if not sorted_values:
        return 0.0
    if len(sorted_values) == 1:
        return sorted_values[0]
    idx = q * (len(sorted_values) - 1)
    lower = int(idx)
    upper = min(lower + 1, len(sorted_values) - 1)
    weight = idx - lower
    return sorted_values[lower] * (1 - weight) + sorted_values[upper] * weight


@dataclass
class LatencyStats:
    values: list[float]


class MetricsRegistry:
    """Very small in-memory registry for counters and latency stats."""

    def __init__(self) -> None:
        self._counters: dict[str, int] = {}
        self._latency: dict[str, LatencyStats] = {}
        self._lock = RLock()

    def increment(self, key: str, amount: int = 1) -> None:
        with self._lock:
            self._counters[key] = self._counters.get(key, 0) + amount

    def inc(self, metric: str, label: str | None = None) -> None:

        key = metric if not label else f"{metric}{{{label}}}"
        self.increment(key)

    def observe_latency(self, key: str, value_ms: float) -> None:
        with self._lock:
            stats = self._latency.get(key)
            if stats is None:
                stats = LatencyStats(values=[])
                self._latency[key] = stats
            stats.values.append(value_ms)

    def export(self) -> dict[str, object]:
        with self._lock:
            counters = dict(self._counters)
            latency_payload: dict[str, dict[str, float]] = {}
            for key, stats in self._latency.items():
                if not stats.values:
                    continue
                sorted_values = sorted(stats.values)
                latency_payload[key] = {
                    "count": len(sorted_values),
                    "p50": _quantile(sorted_values, 0.5),
                    "p95": _quantile(sorted_values, 0.95),
                    "p99": _quantile(sorted_values, 0.99),
                    "max": sorted_values[-1],
                }
            return {"counters": counters, "latency_ms": latency_payload}


REGISTRY = MetricsRegistry()


def inc_policy_reload(ok: bool = True) -> None:
    """Increment policy reload counters."""
    if ok:
        REGISTRY.inc("policy_reload_count", "ok")
    else:
        REGISTRY.inc("policy_reload_count", "error")
