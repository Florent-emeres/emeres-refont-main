from fastapi import APIRouter

from backend.app.observability.metrics import REGISTRY

router = APIRouter()


@router.get("/metrics")
def metrics() -> dict:
    """Expose current counters and latency histograms."""
    return REGISTRY.export()
