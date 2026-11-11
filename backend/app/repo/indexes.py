import os

from pymongo import MongoClient


def ensure_indexes() -> None:
    url = os.environ.get("MONGO_URL")
    if not url:
        return
    client = MongoClient(url)
    db = client.get_default_database()
    db.threads.create_index("created_at")
    db.threads.create_index("participants.user_id")
    db.messages.create_index([("thread_id", 1), ("created_at", 1)])
    db.audit_logs.create_index("ts")
