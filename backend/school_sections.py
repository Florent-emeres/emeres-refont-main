"""
API Routes pour les sections du tableau de bord école
Profil, statistiques, étudiants, partenariats, évaluations, analytics et activité.
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

PARTNERSHIP_STATUSES = ("pending", "active", "ended")


def create_school_sections_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api", tags=["school-sections"])

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

    async def require_school(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in ("school", "admin"):
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user

    def clean(doc: dict | None) -> dict:
        return convert_objectid_to_str({k: v for k, v in (doc or {}).items() if k != "_id"})

    def now() -> datetime:
        return datetime.now(UTC)

    def get_display_name(user: dict) -> str:
        return f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()

    async def get_school_profile(user: dict) -> dict:
        profile = await db.school_profiles.find_one({"user_id": user["id"]})
        if profile:
            return profile
        base = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "school_name": get_display_name(user) or "Établissement",
            "address": None,
            "city": None,
            "postal_code": None,
            "phone": None,
            "website": None,
            "description": None,
            "institution_type": None,
            "academic_fields": [],
            "created_at": now(),
            "updated_at": now(),
        }
        await db.school_profiles.insert_one(base)
        return base

    def school_name_filters(school_name: str) -> dict:
        escaped = re.escape(school_name.strip())
        pattern = f"^{escaped}$"
        return {
            "$or": [
                {"institution_name": {"$regex": pattern, "$options": "i"}},
                {"school_name": {"$regex": pattern, "$options": "i"}},
            ]
        }

    async def get_school_students(school_name: str) -> list[dict]:
        if not school_name.strip():
            return []
        return (
            await db.student_profiles.find(school_name_filters(school_name))
            .sort("created_at", -1)
            .to_list(None)
        )

    # ==========================================================================
    # PROFIL ÉCOLE
    # ==========================================================================

    @router.get("/school/profile")
    async def read_school_profile(current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        return clean(profile)

    @router.put("/school/profile")
    async def update_school_profile(
        profile_data: dict, current_user: dict = Depends(require_school)
    ):
        profile = await get_school_profile(current_user)
        allowed = {
            "school_name",
            "address",
            "city",
            "postal_code",
            "phone",
            "website",
            "description",
            "institution_type",
            "academic_fields",
        }
        updates = {k: v for k, v in profile_data.items() if k in allowed}
        if not updates:
            raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
        updates["updated_at"] = now()
        await db.school_profiles.update_one({"id": profile["id"]}, {"$set": updates})
        updated = await db.school_profiles.find_one({"id": profile["id"]})
        return clean(updated)

    # ==========================================================================
    # STATISTIQUES (données réelles)
    # ==========================================================================

    @router.get("/school/stats")
    async def get_school_stats(current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        students = await get_school_students(profile.get("school_name", ""))
        student_user_ids = [s.get("user_id") for s in students if s.get("user_id")]

        applications: list[dict] = []
        if student_user_ids:
            applications = await db.applications.find(
                {"student_id": {"$in": student_user_ids}}
            ).to_list(None)
        accepted = sum(1 for a in applications if a.get("status") == "accepted")
        placement_rate = round(100 * accepted / len(applications), 1) if applications else 0

        partnerships_count = await db.school_partnerships.count_documents(
            {"school_id": current_user["id"], "status": "active"}
        )

        evaluations = await db.school_evaluations.find({"school_id": current_user["id"]}).to_list(
            None
        )
        ratings = [e.get("rating") for e in evaluations if isinstance(e.get("rating"), int | float)]
        average_satisfaction = round(sum(ratings) / len(ratings), 1) if ratings else 0

        return {
            "total_students": len(students),
            "active_students": len(
                {a.get("student_id") for a in applications if a.get("student_id")}
            ),
            "partnerships_count": partnerships_count,
            "placement_rate": placement_rate,
            "average_satisfaction": average_satisfaction,
        }

    # ==========================================================================
    # ÉTUDIANTS
    # ==========================================================================

    @router.get("/school/students")
    async def list_school_students(current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        students = await get_school_students(profile.get("school_name", ""))
        student_user_ids = [s.get("user_id") for s in students if s.get("user_id")]

        applications: list[dict] = []
        if student_user_ids:
            applications = await db.applications.find(
                {"student_id": {"$in": student_user_ids}}
            ).to_list(None)
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
    # PARTENARIATS
    # ==========================================================================

    @router.get("/school/partnerships")
    async def list_partnerships(current_user: dict = Depends(require_school)):
        partnerships = (
            await db.school_partnerships.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(p) for p in partnerships]

    @router.post("/school/partnerships")
    async def create_partnership(
        partnership_data: dict, current_user: dict = Depends(require_school)
    ):
        status = partnership_data.get("status", "pending")
        if status not in PARTNERSHIP_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Statut invalide, valeurs autorisées: {', '.join(PARTNERSHIP_STATUSES)}",
            )
        partnership = {
            "id": str(uuid.uuid4()),
            "school_id": current_user["id"],
            "company_name": partnership_data.get("company_name", ""),
            "sector": partnership_data.get("sector", ""),
            "contact_email": partnership_data.get("contact_email"),
            "contact_phone": partnership_data.get("contact_phone"),
            "partnership_type": partnership_data.get("partnership_type", "stage"),
            "description": partnership_data.get("description"),
            "status": status,
            "created_at": now(),
            "updated_at": now(),
        }
        await db.school_partnerships.insert_one(partnership)
        return clean(partnership)

    @router.put("/school/partnerships/{partnership_id}")
    async def update_partnership(
        partnership_id: str,
        partnership_data: dict,
        current_user: dict = Depends(require_school),
    ):
        allowed = {
            "company_name",
            "sector",
            "contact_email",
            "contact_phone",
            "partnership_type",
            "description",
            "status",
        }
        updates = {k: v for k, v in partnership_data.items() if k in allowed}
        if updates.get("status") and updates["status"] not in PARTNERSHIP_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Statut invalide, valeurs autorisées: {', '.join(PARTNERSHIP_STATUSES)}",
            )
        if not updates:
            raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
        updates["updated_at"] = now()
        result = await db.school_partnerships.update_one(
            {"id": partnership_id, "school_id": current_user["id"]}, {"$set": updates}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Partenariat non trouvé")
        return {"success": True}

    # ==========================================================================
    # ÉVALUATIONS
    # ==========================================================================

    @router.get("/school/evaluations")
    async def list_evaluations(current_user: dict = Depends(require_school)):
        evaluations = (
            await db.school_evaluations.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(e) for e in evaluations]

    @router.post("/school/evaluations")
    async def create_evaluation(
        evaluation_data: dict, current_user: dict = Depends(require_school)
    ):
        rating = evaluation_data.get("rating")
        if not isinstance(rating, int | float) or not 1 <= rating <= 5:
            raise HTTPException(status_code=400, detail="La note doit être comprise entre 1 et 5")
        evaluation = {
            "id": str(uuid.uuid4()),
            "school_id": current_user["id"],
            "formation_name": evaluation_data.get("formation_name", ""),
            "student_name": evaluation_data.get("student_name", ""),
            "rating": rating,
            "comment": evaluation_data.get("comment"),
            "created_at": now(),
        }
        await db.school_evaluations.insert_one(evaluation)
        return clean(evaluation)

    # ==========================================================================
    # ANALYTICS
    # ==========================================================================

    @router.get("/school/analytics")
    async def get_school_analytics(current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        students = await get_school_students(profile.get("school_name", ""))
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
            applications = await db.applications.find(
                {"student_id": {"$in": student_user_ids}}
            ).to_list(None)
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

    @router.get("/school/activity")
    async def get_school_activity(current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        students = await get_school_students(profile.get("school_name", ""))
        recent_students = sorted(
            students, key=lambda s: s.get("created_at") or now(), reverse=True
        )[:5]
        partnerships = (
            await db.school_partnerships.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .limit(5)
            .to_list(None)
        )
        evaluations = (
            await db.school_evaluations.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .limit(5)
            .to_list(None)
        )

        activity: list[dict] = []
        for student in recent_students:
            student_label = (
                f"{student.get('first_name', '')} {student.get('last_name', '')}".strip()
                or "Nouvel étudiant"
            )
            activity.append(
                {
                    "type": "student",
                    "label": student_label,
                    "date": student.get("created_at"),
                }
            )
        for partnership in partnerships:
            activity.append(
                {
                    "type": "partnership",
                    "label": f"Partenariat avec {partnership.get('company_name', '')}",
                    "date": partnership.get("created_at"),
                }
            )
        for evaluation in evaluations:
            formation = evaluation.get("formation_name", "")
            activity.append(
                {
                    "type": "evaluation",
                    "label": f"Évaluation {formation}: {evaluation.get('rating')}/5",
                    "date": evaluation.get("created_at"),
                }
            )
        activity.sort(key=lambda item: item.get("date") or now(), reverse=True)
        return [clean(item) for item in activity[:15]]

    return router
