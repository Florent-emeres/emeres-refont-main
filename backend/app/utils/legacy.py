import inspect
from functools import wraps

from app.config.flags import USE_V2_ONLY
from fastapi import HTTPException


def ensure_legacy_enabled():
    if USE_V2_ONLY:
        raise HTTPException(status_code=410, detail="Use /ai/v2/... or /threads")


def legacy_endpoint(func):
    if inspect.iscoroutinefunction(func):

        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            ensure_legacy_enabled()
            return await func(*args, **kwargs)

        return async_wrapper

    @wraps(func)
    def sync_wrapper(*args, **kwargs):
        ensure_legacy_enabled()
        return func(*args, **kwargs)

    return sync_wrapper
