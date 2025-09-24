#!/usr/bin/env python3
"""Migrate legacy internal_* collections to v2 threads/messages/audit_logs."""

import argparse
import datetime
import os
from typing import Dict

from bson import ObjectId
from pymongo import MongoClient


def _build_db():
    mongo_url = os.environ.get("MONGO_URL")
    if not mongo_url:
        raise RuntimeError("MONGO_URL environment variable required")
    client = MongoClient(mongo_url)
    db_name = os.environ.get("DB_NAME")
    if db_name:
        return client[db_name]
    return client.get_default_database()


def migrate(execute: bool = False):
    db = _build_db()

    internal_threads = list(db.internal_threads.find({}))
    internal_messages = list(db.internal_messages.find({}))
    audits_legacy = list(db.thread_audit_logs.find({}))

    print(
        f"[info] found internal_threads={len(internal_threads)}, "
        f"internal_messages={len(internal_messages)}, audit_legacy={len(audits_legacy)}"
    )

    db.threads.create_index("created_at")
    db.threads.create_index("participants.user_id")
    db.messages.create_index([("thread_id", 1), ("created_at", 1)])
    db.audit_logs.create_index("ts")

    migrated_threads = migrated_messages = migrated_audits = 0
    id_map: Dict[str, str] = {}

    for thread in internal_threads:
        participants = thread.get("participants") or thread.get("members") or []
        context = thread.get("context") or {"type": thread.get("type", "unknown")}
        doc = {
            "participants": participants,
            "context": context,
            "created_at": thread.get("created_at", datetime.datetime.utcnow()),
        }
        if execute:
            res = db.threads.insert_one(doc)
            new_id = str(res.inserted_id)
        else:
            new_id = f"DRY_{thread['_id']}"
        id_map[str(thread["_id"])] = new_id
        migrated_threads += 1

    for message in internal_messages:
        legacy_thread_id = str(message.get("thread_id") or message.get("thread"))
        new_thread_id = id_map.get(legacy_thread_id)
        if not new_thread_id:
            print(f"[warn] orphan legacy message {message['_id']} (thread {legacy_thread_id})")
            continue
        content_enc = message.get("content_enc") or message.get("content")
        doc = {
            "thread_id": new_thread_id,
            "sender_id": message.get("sender_id") or message.get("author_id"),
            "content_enc": content_enc,
            "created_at": message.get("created_at", datetime.datetime.utcnow()),
        }
        if execute:
            try:
                doc["thread_id"] = ObjectId(new_thread_id)
            except Exception:
                pass
            db.messages.insert_one(doc)
        migrated_messages += 1

    for audit in audits_legacy:
        mapped_thread = id_map.get(str(audit.get("thread_id")))
        thread_ref = mapped_thread or audit.get("thread_id")
        doc = {
            "thread_id": thread_ref,
            "user_id": audit.get("user_id"),
            "action": audit.get("action", "legacy"),
            "meta": audit.get("meta", {}),
            "ts": audit.get("ts", datetime.datetime.utcnow()),
        }
        if execute:
            try:
                doc["thread_id"] = ObjectId(doc["thread_id"])
            except Exception:
                pass
            db.audit_logs.insert_one(doc)
        migrated_audits += 1

    print(
        f"[done] threads={migrated_threads}, messages={migrated_messages}, "
        f"audits={migrated_audits}, execute={execute}"
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="write changes to database")
    parser.add_argument("--dry-run", action="store_true", help="run without writes")
    args = parser.parse_args()

    execute = args.execute and not args.dry_run
    migrate(execute=execute)


if __name__ == "__main__":
    main()
