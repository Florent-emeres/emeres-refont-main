#!/usr/bin/env python3
"""
Check database for thread messages
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def check_database():
    # Load environment variables
    load_dotenv('/app/backend/.env')
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🔍 Checking database for thread-related collections...")
    
    # Check message_threads collection
    threads = await db.message_threads.find({}).to_list(None)
    print(f"📋 Found {len(threads)} threads in message_threads collection")
    
    for i, thread in enumerate(threads):
        print(f"  Thread {i+1}: ID={thread.get('id')}, Type={thread.get('type')}, Status={thread.get('status')}")
    
    # Check thread_messages collection
    messages = await db.thread_messages.find({}).to_list(None)
    print(f"💬 Found {len(messages)} messages in thread_messages collection")
    
    for i, message in enumerate(messages):
        print(f"  Message {i+1}: ID={message.get('id')}, Thread={message.get('thread_id')}, Sender={message.get('sender_id')}")
        print(f"    Content length: {len(message.get('content', ''))}, Encrypted: {message.get('is_encrypted', False)}")
        print(f"    Deleted at: {message.get('deleted_at', 'None')}")
        print(f"    Created at: {message.get('created_at', 'None')}")
        print(f"    All fields: {list(message.keys())}")
    
    # Check thread_audit_logs collection
    audit_logs = await db.thread_audit_logs.find({}).to_list(None)
    print(f"📝 Found {len(audit_logs)} audit logs in thread_audit_logs collection")
    
    for i, log in enumerate(audit_logs):
        print(f"  Log {i+1}: Action={log.get('action')}, Actor={log.get('actor_id')}, Thread={log.get('thread_id')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_database())