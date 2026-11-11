from app.repo import audit_repo, messages_repo, threads_repo
from app.services.crypto_service import decrypt, encrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/threads", tags=["threads"])


class ThreadCreate(BaseModel):
    participants: list[dict[str, str]]
    context: dict[str, str]


class MessageCreate(BaseModel):
    sender_id: str
    content: str


class MarkRead(BaseModel):
    user_id: str


def _auth(thread_id: str, user_id: str) -> bool:
    return threads_repo.is_participant(thread_id, user_id)


@router.post("")
def create_thread(body: ThreadCreate):
    thread_id = threads_repo.create_thread(body.participants, body.context)
    audit_repo.add_audit(thread_id, body.participants[0]["user_id"], "create_thread", body.context)
    return {"thread_id": thread_id}


@router.post("/{thread_id}/messages")
def post_message(thread_id: str, body: MessageCreate):
    if not _auth(thread_id, body.sender_id):
        raise HTTPException(status_code=403, detail="Not a participant")
    message_id = messages_repo.add_message(thread_id, body.sender_id, encrypt(body.content))
    audit_repo.add_audit(thread_id, body.sender_id, "send_message", {"message_id": message_id})
    return {"message_id": message_id}


@router.get("/{thread_id}/messages")
def get_messages(thread_id: str, user_id: str):
    if not _auth(thread_id, user_id):
        raise HTTPException(status_code=403, detail="Not a participant")
    docs = messages_repo.list_messages(thread_id)
    messages = []
    for doc in docs:
        created_at = doc.get("created_at")
        if hasattr(created_at, "isoformat"):
            created_at = created_at.isoformat()
        messages.append(
            {
                "sender_id": doc.get("sender_id"),
                "content": decrypt(doc.get("content_enc", "")),
                "created_at": created_at,
            }
        )
    audit_repo.add_audit(thread_id, user_id, "read_messages", {"count": len(messages)})
    return {"messages": messages}


@router.post("/{thread_id}/read")
def mark_read(thread_id: str, body: MarkRead):
    if not _auth(thread_id, body.user_id):
        raise HTTPException(status_code=403, detail="Not a participant")
    audit_repo.add_audit(thread_id, body.user_id, "mark_read", None)
    return {"status": "ok"}
