from app.models.schemas import ObservabilityRequest, ObservabilityResponse


def admin_observability(req: ObservabilityRequest) -> ObservabilityResponse:
    metrics = {"timeframe": req.timeframe, "latency_ms": 120, "error_rate": 0.01}
    return ObservabilityResponse(metrics=metrics)
