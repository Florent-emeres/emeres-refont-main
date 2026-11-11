import datetime
import os
import uuid
from typing import Any

_USE_MEM = not bool(os.environ.get("MONGO_URL"))

if not _USE_MEM:
    from pymongo import MongoClient

    _client = MongoClient(os.environ["MONGO_URL"])
    db = _client.get_default_database()
else:
    db = None
    _THREADS: dict[str, dict[str, Any]] = {}


def _now() -> datetime.datetime:
    return datetime.datetime.utcnow()


def create_thread(participants: list[dict[str, str]], context: dict[str, str]) -> str:
    doc = {
        "participants": participants,
        "context": context,
        "created_at": _now(),
    }
    if _USE_MEM:
        thread_id = uuid.uuid4().hex
        doc["_id"] = thread_id
        _THREADS[thread_id] = doc
        return thread_id
    result = db.threads.insert_one(doc)
    return str(result.inserted_id)


def is_participant(thread_id: str, user_id: str) -> bool:
    if _USE_MEM:
        thread = _THREADS.get(thread_id)
        if not thread:
            return False
        return any(p.get("user_id") == user_id for p in thread.get("participants", []))
    from bson import ObjectId

    return (
        db.threads.count_documents({"_id": ObjectId(thread_id), "participants.user_id": user_id})
        > 0
    )
