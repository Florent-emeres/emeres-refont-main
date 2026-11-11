from app.models.schemas import ProfileUpdate
from app.repo import users_repo
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/me", tags=["me"])

VALID_PROGRAMS = {"RSA", "CEJ"}


@router.patch("/profile")
def update_profile(
    body: ProfileUpdate, user_id: str = Query("u_test", description="temporary user id")
):
    if body.jobseeker:
        if not set(body.jobseeker.programs).issubset(VALID_PROGRAMS):
            raise HTTPException(status_code=422, detail="Invalid program in jobseeker.programs")
        users_repo.set_jobseeker_status(user_id, body.jobseeker.model_dump())
    return {"ok": True}
