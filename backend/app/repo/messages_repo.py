from typing import List, Dict, Any
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
    _MESSAGES: Dict[str, Dict[str, Any]] = {}


def _now() -> datetime.datetime:
    return datetime.datetime.utcnow()


def add_message(thread_id: str, sender_id: str, content_enc: str) -> str:
    doc = {
        "thread_id": thread_id,
        "sender_id": sender_id,
        "content_enc": content_enc,
        "created_at": _now(),
    }
    if _USE_MEM:
        message_id = uuid.uuid4().hex
        doc["_id"] = message_id
        _MESSAGES[message_id] = doc
        return message_id
    from bson import ObjectId

    doc["thread_id"] = ObjectId(thread_id)
    result = db.messages.insert_one(doc)
    return str(result.inserted_id)


def list_messages(thread_id: str) -> List[Dict[str, Any]]:
    if _USE_MEM:
        messages = [m for m in _MESSAGES.values() if m["thread_id"] == thread_id]
        messages.sort(key=lambda item: item["created_at"])
        return messages
    from bson import ObjectId

    cursor = db.messages.find({"thread_id": ObjectId(thread_id)}).sort("created_at", 1)
    return list(cursor)
