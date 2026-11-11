"""
API Routes pour les sections du tableau de bord école
Profil, statistiques, étudiants, partenariats, évaluations, analytics et activité.
"""

import os
import re
import uuid
from datetime import UTC, datetime, timedelta

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

    async def get_attached_students(school_user_id: str) -> list[dict]:
        return (
            await db.student_profiles.find({"school_id": school_user_id})
            .sort("created_at", -1)
            .to_list(None)
        )

    async def get_declared_students(school_name: str) -> list[dict]:
        if not school_name.strip():
            return []
        declared = school_name_filters(school_name)
        declared["school_id"] = None
        return await db.student_profiles.find(declared).sort("created_at", -1).to_list(None)

    async def notify_user(user_id: str, title: str, message: str, notification_type: str):
        await db.notifications.insert_one(
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "title": title,
                "message": message,
                "type": notification_type,
                "data": {},
                "is_read": False,
                "is_sent": True,
                "created_at": now().isoformat(),
                "read_at": None,
            }
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
        students = await get_attached_students(current_user["id"])
        declared = await get_declared_students(profile.get("school_name", ""))
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
            "declared_students": len(declared),
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
        attached = await get_attached_students(current_user["id"])
        declared = await get_declared_students(profile.get("school_name", ""))
        students = [(s, "attached") for s in attached] + [(s, "declared") for s in declared]
        student_user_ids = [s.get("user_id") for s, _ in students if s.get("user_id")]

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
        for student, attachment_status in students:
            student_applications = by_student.get(student.get("user_id") or "", [])
            enriched.append(
                clean(
                    {
                        **student,
                        "attachment_status": attachment_status,
                        "applications_count": len(student_applications),
                        "accepted_count": sum(
                            1 for a in student_applications if a.get("status") == "accepted"
                        ),
                        "is_active": bool(student_applications),
                    }
                )
            )
        return enriched

    @router.get("/school/students/available")
    async def list_available_students(q: str = "", current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        query_filter: dict = {"school_id": None}
        declared = school_name_filters(profile.get("school_name", ""))
        query_filter["$nor"] = [declared]
        if q.strip():
            escaped = re.escape(q.strip())
            search = {"$regex": escaped, "$options": "i"}
            query_filter["$or"] = [
                {"first_name": search},
                {"last_name": search},
                {"email": search},
                {"institution_name": search},
            ]
        students = (
            await db.student_profiles.find(query_filter)
            .sort("created_at", -1)
            .limit(20)
            .to_list(None)
        )
        return [clean(s) for s in students]

    @router.post("/school/students/{student_user_id}/attach")
    async def attach_student(student_user_id: str, current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        student = await db.student_profiles.find_one({"user_id": student_user_id})
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        if student.get("school_id") and student["school_id"] != current_user["id"]:
            raise HTTPException(
                status_code=409, detail="Étudiant déjà rattaché à un autre établissement"
            )
        await db.student_profiles.update_one(
            {"user_id": student_user_id},
            {
                "$set": {
                    "school_id": current_user["id"],
                    "school_name": profile.get("school_name", ""),
                    "updated_at": now(),
                }
            },
        )
        school_label = profile.get("school_name", "votre établissement")
        await notify_user(
            student_user_id,
            "Rattachement à un établissement",
            f"Vous avez été rattaché à {school_label}.",
            "school",
        )
        return {"success": True, "school_id": current_user["id"]}

    # ==========================================================================
    # INVITATIONS (code école → étudiant)
    # ==========================================================================

    @router.get("/school/invitations")
    async def list_invitations(current_user: dict = Depends(require_school)):
        invitations = (
            await db.school_invitations.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(i) for i in invitations]

    @router.post("/school/invitations")
    async def create_invitation(current_user: dict = Depends(require_school)):
        profile = await get_school_profile(current_user)
        code = uuid.uuid4().hex[:8].upper()
        invitation = {
            "id": str(uuid.uuid4()),
            "school_id": current_user["id"],
            "school_name": profile.get("school_name", ""),
            "code": code,
            "status": "pending",
            "accepted_by": None,
            "expires_at": now() + timedelta(days=7),
            "created_at": now(),
        }
        await db.school_invitations.insert_one(invitation)
        return clean(invitation)

    @router.delete("/school/invitations/{invitation_id}")
    async def cancel_invitation(invitation_id: str, current_user: dict = Depends(require_school)):
        result = await db.school_invitations.update_one(
            {"id": invitation_id, "school_id": current_user["id"], "status": "pending"},
            {"$set": {"status": "cancelled"}},
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Invitation non trouvée ou déjà traitée")
        return {"success": True}

    @router.post("/school/join")
    async def join_school(join_data: dict, current_user: dict = Depends(get_current_user)):
        if current_user.get("role") != "student":
            raise HTTPException(
                status_code=403, detail="Seuls les étudiants peuvent rejoindre une école"
            )
        code = (join_data.get("code") or "").strip().upper()
        if not code:
            raise HTTPException(status_code=400, detail="Code d'invitation requis")
        invitation = await db.school_invitations.find_one({"code": code})
        expires_at = invitation.get("expires_at") if invitation else None
        if expires_at is not None and getattr(expires_at, "tzinfo", None) is None:
            expires_at = expires_at.replace(tzinfo=UTC)
        if not invitation or invitation.get("status") != "pending":
            raise HTTPException(status_code=404, detail="Code d'invitation invalide ou expiré")
        if expires_at is not None and expires_at < now():
            raise HTTPException(status_code=404, detail="Code d'invitation invalide ou expiré")
        student = await db.student_profiles.find_one({"user_id": current_user["id"]})
        if not student:
            raise HTTPException(status_code=404, detail="Profil étudiant non trouvé")
        if student.get("school_id") and student["school_id"] != invitation["school_id"]:
            raise HTTPException(
                status_code=409, detail="Vous êtes déjà rattaché à un autre établissement"
            )
        await db.student_profiles.update_one(
            {"user_id": current_user["id"]},
            {
                "$set": {
                    "school_id": invitation["school_id"],
                    "school_name": invitation.get("school_name", ""),
                    "updated_at": now(),
                }
            },
        )
        await db.school_invitations.update_one(
            {"id": invitation["id"]},
            {"$set": {"status": "accepted", "accepted_by": current_user["id"]}},
        )
        joiner = get_display_name(current_user) or "Un étudiant"
        await notify_user(
            invitation["school_id"],
            "Nouvel étudiant rattaché",
            f"{joiner} a rejoint votre établissement avec un code d'invitation.",
            "school",
        )
        return {"success": True, "school_name": invitation.get("school_name", "")}

    @router.post("/school/students/{student_user_id}/detach")
    async def detach_student(student_user_id: str, current_user: dict = Depends(require_school)):
        student = await db.student_profiles.find_one({"user_id": student_user_id})
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        if student.get("school_id") != current_user["id"]:
            raise HTTPException(
                status_code=404, detail="Étudiant non rattaché à votre établissement"
            )
        await db.student_profiles.update_one(
            {"user_id": student_user_id},
            {"$set": {"school_id": None, "school_name": None, "updated_at": now()}},
        )
        await notify_user(
            student_user_id,
            "Détachement d'un établissement",
            "Votre rattachement à l'établissement a été retiré.",
            "school",
        )
        return {"success": True}

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
        students = await get_attached_students(current_user["id"])
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
        students = await get_attached_students(current_user["id"])
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

    # ==========================================================================
    # DOCUMENTS ADMINISTRATIFS
    # ==========================================================================

    DOCUMENT_TYPES = ("convention", "attestation", "rapport", "autre")

    @router.get("/school/documents")
    async def list_documents(current_user: dict = Depends(require_school)):
        documents = (
            await db.school_documents.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(d) for d in documents]

    @router.post("/school/documents")
    async def create_document(document_data: dict, current_user: dict = Depends(require_school)):
        title = (document_data.get("title") or "").strip()
        if not title:
            raise HTTPException(status_code=400, detail="Le titre est obligatoire")
        document_type = document_data.get("document_type", "autre")
        if document_type not in DOCUMENT_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Type invalide, valeurs autorisées: {', '.join(DOCUMENT_TYPES)}",
            )
        document = {
            "id": str(uuid.uuid4()),
            "school_id": current_user["id"],
            "title": title,
            "document_type": document_type,
            "description": document_data.get("description"),
            "file_url": document_data.get("file_url"),
            "created_at": now(),
            "updated_at": now(),
        }
        await db.school_documents.insert_one(document)
        return clean(document)

    @router.delete("/school/documents/{document_id}")
    async def delete_document(document_id: str, current_user: dict = Depends(require_school)):
        result = await db.school_documents.delete_one(
            {"id": document_id, "school_id": current_user["id"]}
        )
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Document non trouvé")
        return {"success": True}

    # ==========================================================================
    # COMMUNICATION (annonces aux étudiants rattachés)
    # ==========================================================================

    @router.get("/school/announcements")
    async def list_announcements(current_user: dict = Depends(require_school)):
        announcements = (
            await db.school_announcements.find({"school_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(a) for a in announcements]

    @router.post("/school/announcements")
    async def create_announcement(
        announcement_data: dict, current_user: dict = Depends(require_school)
    ):
        title = (announcement_data.get("title") or "").strip()
        body = (announcement_data.get("body") or "").strip()
        if not title or not body:
            raise HTTPException(status_code=400, detail="Le titre et le message sont obligatoires")
        announcement = {
            "id": str(uuid.uuid4()),
            "school_id": current_user["id"],
            "title": title,
            "body": body,
            "audience": announcement_data.get("audience", "attached_students"),
            "created_at": now(),
        }
        await db.school_announcements.insert_one(announcement)

        students = await get_attached_students(current_user["id"])
        for student in students:
            student_user_id = student.get("user_id")
            if student_user_id:
                await notify_user(
                    student_user_id,
                    f"Annonce de votre établissement : {title}",
                    body,
                    "school",
                )

        return clean({**announcement, "notified_students": len(students)})

    return router
