"""
API Routes pour les sections du tableau de bord institution
Profil, statistiques réelles, étudiants rattachés par déclaration, analytics et activité.
"""

import os
import re
import uuid
from datetime import UTC, datetime

import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from tools_system import convert_objectid_to_str

JWT_SECRET = os.environ.get("SECRET_KEY", "emeres-secret-key-change-in-production")
security = HTTPBearer()


def create_institution_sections_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api", tags=["institution-sections"])

    async def get_current_user(
        token: HTTPAuthorizationCredentials = Depends(security),
    ) -> dict:
        try:
            if not token.credentials:
                raise HTTPException(status_code=401, detail="Token manquant")
            payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(status_code=401, detail="Token invalide")
            user = await db.users.find_one({"id": user_id})
            if not user:
                raise HTTPException(status_code=401, detail="Utilisateur non trouvé")
            return user
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Token invalide") from None

    async def require_institution(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in ("institution", "admin"):
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user

    def clean(doc: dict | None) -> dict:
        return convert_objectid_to_str({k: v for k, v in (doc or {}).items() if k != "_id"})

    def now() -> datetime:
        return datetime.now(UTC)

    def get_display_name(user: dict) -> str:
        return f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()

    async def get_institution_profile(user: dict) -> dict:
        profile = await db.institution_profiles.find_one({"user_id": user["id"]})
        if profile:
            return profile
        base = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "institution_name": get_display_name(user) or "Institution",
            "institution_type": None,
            "address": None,
            "city": None,
            "postal_code": None,
            "phone": None,
            "website": None,
            "description": None,
            "region": None,
            "created_at": now(),
            "updated_at": now(),
        }
        await db.institution_profiles.insert_one(base)
        return base

    def institution_name_filters(institution_name: str) -> dict:
        escaped = re.escape(institution_name.strip())
        pattern = f"^{escaped}$"
        return {
            "$or": [
                {"institution_name": {"$regex": pattern, "$options": "i"}},
                {"school_name": {"$regex": pattern, "$options": "i"}},
            ]
        }

    async def get_institution_students(institution_name: str) -> list[dict]:
        if not institution_name.strip():
            return []
        return (
            await db.student_profiles.find(institution_name_filters(institution_name))
            .sort("created_at", -1)
            .to_list(None)
        )

    async def get_students_applications(student_user_ids: list[str | None]) -> list[dict]:
        ids = [i for i in student_user_ids if i]
        if not ids:
            return []
        return await db.applications.find({"student_id": {"$in": ids}}).to_list(None)

    # ==========================================================================
    # PROFIL INSTITUTION
    # ==========================================================================

    @router.get("/institution/profile")
    async def read_institution_profile(current_user: dict = Depends(require_institution)):
        profile = await get_institution_profile(current_user)
        return clean(profile)

    @router.put("/institution/profile")
    async def update_institution_profile(
        profile_data: dict, current_user: dict = Depends(require_institution)
    ):
        profile = await get_institution_profile(current_user)
        allowed = {
            "institution_name",
            "institution_type",
            "address",
            "city",
            "postal_code",
            "phone",
            "website",
            "description",
            "region",
        }
        updates = {k: v for k, v in profile_data.items() if k in allowed}
        if not updates:
            raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
        updates["updated_at"] = now()
        await db.institution_profiles.update_one({"id": profile["id"]}, {"$set": updates})
        updated = await db.institution_profiles.find_one({"id": profile["id"]})
        return clean(updated)

    # ==========================================================================
    # STATISTIQUES (données réelles)
    # ==========================================================================

    @router.get("/institution/stats")
    async def get_institution_stats(current_user: dict = Depends(require_institution)):
        profile = await get_institution_profile(current_user)
        students = await get_institution_students(profile.get("institution_name", ""))
        student_user_ids = [s.get("user_id") for s in students if s.get("user_id")]

        applications = await get_students_applications(student_user_ids)
        accepted = sum(1 for a in applications if a.get("status") == "accepted")
        placement_rate = round(100 * accepted / len(applications), 1) if applications else 0
        partner_companies = len({a.get("company_id") for a in applications if a.get("company_id")})

        return {
            "total_students": len(students),
            "active_students": len(
                {a.get("student_id") for a in applications if a.get("student_id")}
            ),
            "total_applications": len(applications),
            "accepted_applications": accepted,
            "placement_rate": placement_rate,
            "partner_companies": partner_companies,
        }

    @router.get("/institution/dashboard")
    async def get_institution_dashboard(current_user: dict = Depends(require_institution)):
        stats = await get_institution_stats(current_user)
        return {
            "student_count": stats["total_students"],
            "active_students": stats["active_students"],
            "total_applications": stats["total_applications"],
            "accepted_applications": stats["accepted_applications"],
            "placement_rate": stats["placement_rate"],
            "partner_companies": stats["partner_companies"],
        }

    # ==========================================================================
    # ÉTUDIANTS
    # ==========================================================================

    @router.get("/institution/students")
    async def list_institution_students(current_user: dict = Depends(require_institution)):
        profile = await get_institution_profile(current_user)
        students = await get_institution_students(profile.get("institution_name", ""))
        student_user_ids = [s.get("user_id") for s in students if s.get("user_id")]
        applications = await get_students_applications(student_user_ids)

        by_student: dict[str, list[dict]] = {}
        for application in applications:
            key = application.get("student_id") or ""
            by_student.setdefault(key, []).append(application)

        enriched = []
        for student in students:
            student_applications = by_student.get(student.get("user_id") or "", [])
            enriched.append(
                clean(
                    {
                        **student,
                        "applications_count": len(student_applications),
                        "accepted_count": sum(
                            1 for a in student_applications if a.get("status") == "accepted"
                        ),
                        "is_active": bool(student_applications),
                    }
                )
            )
        return enriched

    # ==========================================================================
    # ANALYTICS
    # ==========================================================================

    @router.get("/institution/analytics")
    async def get_institution_analytics(current_user: dict = Depends(require_institution)):
        profile = await get_institution_profile(current_user)
        students = await get_institution_students(profile.get("institution_name", ""))
        student_user_ids = [s.get("user_id") for s in students if s.get("user_id")]

        status_counts = {
            "received": 0,
            "reviewing": 0,
            "interview": 0,
            "accepted": 0,
            "rejected": 0,
        }
        offer_ids: set[str] = set()
        top_skills: dict[str, int] = {}
        if student_user_ids:
            applications = await get_students_applications(student_user_ids)
            for application in applications:
                application_status = application.get("status", "received")
                status_counts[application_status] = status_counts.get(application_status, 0) + 1
                if application.get("offer_id"):
                    offer_ids.add(application["offer_id"])
            for student in students:
                for skill in student.get("main_skills", []) or []:
                    top_skills[skill] = top_skills.get(skill, 0) + 1

        offers_by_sector: dict[str, int] = {}
        if offer_ids:
            offers = await db.internship_offers.find({"id": {"$in": list(offer_ids)}}).to_list(None)
            for offer in offers:
                sector = offer.get("sector") or "Non spécifié"
                offers_by_sector[sector] = offers_by_sector.get(sector, 0) + 1

        return {
            "total_students": len(students),
            "applications_by_status": status_counts,
            "total_applications": sum(status_counts.values()),
            "top_skills": sorted(top_skills.items(), key=lambda item: -item[1])[:10],
            "offers_by_sector": offers_by_sector,
        }

    # ==========================================================================
    # ACTIVITÉ RÉCENTE
    # ==========================================================================

    @router.get("/institution/activity")
    async def get_institution_activity(current_user: dict = Depends(require_institution)):
        profile = await get_institution_profile(current_user)
        students = await get_institution_students(profile.get("institution_name", ""))
        recent_students = sorted(
            students, key=lambda s: s.get("created_at") or now(), reverse=True
        )[:5]
        student_user_ids = [s.get("user_id") for s in recent_students if s.get("user_id")]
        applications = await get_students_applications(student_user_ids)
        recent_applications = sorted(
            applications,
            key=lambda a: a.get("applied_at") or a.get("created_at") or now(),
            reverse=True,
        )[:5]

        activity: list[dict] = []
        for student in recent_students:
            student_label = (
                f"{student.get('first_name', '')} {student.get('last_name', '')}".strip()
                or "Nouvel étudiant"
            )
            activity.append(
                {
                    "type": "student",
                    "label": f"{student_label} a rejoint l'institution",
                    "date": student.get("created_at"),
                }
            )
        for application in recent_applications:
            matches = [
                s for s in recent_students if s.get("user_id") == application.get("student_id")
            ]
            matched_student = matches[0] if matches else None
            student_label = (
                f"{matched_student.get('first_name', '')} "
                f"{matched_student.get('last_name', '')}".strip()
                if matched_student
                else "Un étudiant"
            )
            activity.append(
                {
                    "type": "application",
                    "label": f"{student_label} a postulé à une offre",
                    "date": application.get("applied_at") or application.get("created_at"),
                }
            )
        activity.sort(key=lambda item: item.get("date") or now(), reverse=True)
        return [clean(item) for item in activity[:15]]

    return router
