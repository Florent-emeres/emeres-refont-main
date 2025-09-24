from app.models.schemas import ModerationRequest, ModerationResponse

def admin_moderation(req: ModerationRequest) -> ModerationResponse:
    return ModerationResponse(action=f"review:{req.item_id}")
