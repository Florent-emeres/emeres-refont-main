from typing import Dict, Any
import os
import datetime
import uuid

_USE_MEM = not bool(os.environ.get("MONGO_URL"))

if not _USE_MEM:
    from pymongo import MongoClient
    from bson import ObjectId

    _client = MongoClient(os.environ["MONGO_URL"])
    db = _client.get_default_database()
else:
    db = None
    _AUDITS: Dict[str, Dict[str, Any]] = {}


def _now() -> datetime.datetime:
    return datetime.datetime.utcnow()


def add_audit(thread_id: str, user_id: str, action: str, meta: Dict[str, Any] | None = None) -> None:
    doc = {
        "thread_id": thread_id,
        "user_id": user_id,
        "action": action,
        "meta": meta or {},
        "ts": _now(),
    }
    if _USE_MEM:
        _AUDITS[uuid.uuid4().hex] = doc
        return
    from bson import ObjectId

    doc["thread_id"] = ObjectId(thread_id)
    db.audit_logs.insert_one(doc)
