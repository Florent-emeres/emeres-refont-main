from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

from app.ai.hub_router import router as ai_v2_router
from app.routes.threads_v2 import router as threads_router
from app.routes.profile import router as profile_router
from app.middleware.rate_limit import SimpleRateLimitMiddleware
from app.observability.tracing import init_tracing

try:
    from app.repo.indexes import ensure_indexes
except Exception:  # pragma: no cover
    ensure_indexes = None

app = FastAPI(title="EMERES")

if ensure_indexes:
    try:
        ensure_indexes()
    except Exception:
        pass

app.add_middleware(SimpleRateLimitMiddleware)
init_tracing(app)
try:
    Instrumentator().instrument(app).expose(app, endpoint="/metrics", should_gzip=True)
except Exception:
    pass

app.include_router(ai_v2_router)
app.include_router(threads_router)
app.include_router(profile_router)
