import os
import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

WINDOW = int(os.getenv("RL_WINDOW_SEC", "60"))
MAX_REQ = int(os.getenv("RL_MAX_REQ", "120"))

_BUCKET = {}


class SimpleRateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client = request.client
        ip = client.host if client else "unknown"
        now = int(time.time())
        window_key = now // WINDOW
        key = f"{ip}:{window_key}"
        _BUCKET[key] = _BUCKET.get(key, 0) + 1
        if _BUCKET[key] > MAX_REQ:
            raise HTTPException(status_code=429, detail="Too many requests")
        response = await call_next(request)
        return response
