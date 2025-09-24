import os
from typing import Optional, Dict, Any

_USE_MEM = not bool(os.environ.get("MONGO_URL"))

if not _USE_MEM:
    from pymongo import MongoClient

    _client = MongoClient(os.environ["MONGO_URL"])
    db = _client.get_default_database()
else:
    db = None
    _USERS: Dict[str, Dict[str, Any]] = {}


def set_jobseeker_status(user_id: str, payload: Dict[str, Any]) -> None:
    if _USE_MEM:
        doc = _USERS.get(user_id, {})
        doc["jobseeker"] = payload
        _USERS[user_id] = doc
        return
    db.users.update_one({"_id": user_id}, {"$set": {"jobseeker": payload}}, upsert=True)


def get_jobseeker_status(user_id: str) -> Optional[Dict[str, Any]]:
    if _USE_MEM:
        doc = _USERS.get(user_id)
        if not doc:
            return None
        return doc.get("jobseeker")
    record = db.users.find_one({"_id": user_id}, {"jobseeker": 1})
    if not record:
        return None
    return record.get("jobseeker")
