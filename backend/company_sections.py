"""
API Routes pour les sections du tableau de bord entreprise
Blog, témoignages, documents, modèles, intégrations, imports/exports,
stagiaires, évaluations, communications, workflows et analytics.
"""

import csv
import io
import os
import uuid
from datetime import UTC, datetime, timedelta

import jwt
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from tools_system import convert_objectid_to_str

JWT_SECRET = os.environ.get("SECRET_KEY", "emeres-secret-key-change-in-production")
security = HTTPBearer()


def create_company_sections_router(db: AsyncIOMotorDatabase) -> APIRouter:
    router = APIRouter(prefix="/api", tags=["company-sections"])

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

    async def require_company(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in ("company", "admin"):
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user

    def clean(doc: dict | None) -> dict:
        return convert_objectid_to_str({k: v for k, v in (doc or {}).items() if k != "_id"})

    def now() -> datetime:
        return datetime.now(UTC)

    def get_display_name(user: dict) -> str:
        return f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()

    # ==========================================================================
    # BLOG & TÉMOIGNAGES
    # ==========================================================================

    @router.get("/company/blog")
    async def list_blog_posts(current_user: dict = Depends(require_company)):
        posts = (
            await db.company_blog_posts.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(p) for p in posts]

    @router.post("/company/blog")
    async def create_blog_post(post_data: dict, current_user: dict = Depends(require_company)):
        post = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "title": post_data.get("title", ""),
            "excerpt": post_data.get("excerpt", ""),
            "content": post_data.get("content", ""),
            "category": post_data.get("category", "actualite"),
            "tags": post_data.get("tags", []),
            "status": post_data.get("status", "draft"),
            "author": get_display_name(current_user),
            "views": 0,
            "created_at": now(),
            "updated_at": now(),
        }
        await db.company_blog_posts.insert_one(post)
        return clean(post)

    @router.put("/company/blog/{post_id}")
    async def update_blog_post(
        post_id: str, post_data: dict, current_user: dict = Depends(require_company)
    ):
        result = await db.company_blog_posts.update_one(
            {"id": post_id, "company_id": current_user["id"]},
            {
                "$set": {
                    **{
                        k: v
                        for k, v in post_data.items()
                        if k not in ("id", "company_id", "created_at")
                    },
                    "updated_at": now(),
                }
            },
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Article non trouvé")
        return {"success": True}

    @router.get("/company/testimonials")
    async def list_testimonials(current_user: dict = Depends(require_company)):
        items = (
            await db.company_testimonials.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(t) for t in items]

    @router.post("/company/testimonials")
    async def create_testimonial(data: dict, current_user: dict = Depends(require_company)):
        testimonial = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "author_name": data.get("author_name", ""),
            "author_role": data.get("author_role", ""),
            "content": data.get("content", ""),
            "rating": data.get("rating", 5),
            "period": data.get("period", ""),
            "status": data.get("status", "published"),
            "created_at": now(),
        }
        await db.company_testimonials.insert_one(testimonial)
        return clean(testimonial)

    @router.put("/company/testimonials/{testimonial_id}")
    async def update_testimonial(
        testimonial_id: str, data: dict, current_user: dict = Depends(require_company)
    ):
        result = await db.company_testimonials.update_one(
            {"id": testimonial_id, "company_id": current_user["id"]},
            {
                "$set": {
                    k: v for k, v in data.items() if k not in ("id", "company_id", "created_at")
                }
            },
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Témoignage non trouvé")
        return {"success": True}

    # ==========================================================================
    # DOCUMENTS & MODÈLES
    # ==========================================================================

    @router.get("/company/documents")
    async def list_documents(current_user: dict = Depends(require_company)):
        docs = (
            await db.company_documents.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(d) for d in docs]

    @router.post("/company/documents/upload")
    async def upload_document(
        title: str = Form(...),
        description: str = Form(""),
        category: str = Form("convention"),
        access_level: str = Form("company"),
        expiry_date: str = Form(""),
        file: UploadFile = File(...),
        current_user: dict = Depends(require_company),
    ):
        content = await file.read()
        document = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "title": title,
            "description": description,
            "category": category,
            "file_url": f"/uploads/{file.filename}",
            "file_name": file.filename,
            "file_size": len(content),
            "file_type": file.content_type or "application/octet-stream",
            "access_level": access_level,
            "expiry_date": expiry_date or None,
            "created_by": get_display_name(current_user),
            "downloads": 0,
            "status": "active",
            "created_at": now(),
            "updated_at": now(),
        }
        await db.company_documents.insert_one(document)
        return clean(document)

    @router.get("/company/templates")
    async def list_templates(current_user: dict = Depends(require_company)):
        templates = (
            await db.company_templates.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(t) for t in templates]

    @router.post("/company/templates")
    async def create_template(data: dict, current_user: dict = Depends(require_company)):
        template = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "name": data.get("name", ""),
            "content": data.get("content", ""),
            "type": data.get("type", "convention_stage"),
            "variables": data.get("variables", []),
            "category": data.get("category", "legal"),
            "created_by": get_display_name(current_user),
            "created_at": now(),
            "updated_at": now(),
        }
        await db.company_templates.insert_one(template)
        return clean(template)

    # ==========================================================================
    # INTÉGRATIONS, IMPORTS & EXPORTS
    # ==========================================================================

    @router.get("/company/integrations")
    async def list_integrations(current_user: dict = Depends(require_company)):
        integrations = await db.company_integrations.find(
            {"company_id": current_user["id"]}
        ).to_list(None)
        cleaned = []
        for i in integrations:
            i = clean(i)
            i.pop("api_key", None)
            cleaned.append(i)
        return cleaned

    @router.post("/company/integrations")
    async def configure_integration(data: dict, current_user: dict = Depends(require_company)):
        integration_name = data.get("integration_name", "")
        if not integration_name:
            raise HTTPException(status_code=400, detail="integration_name requis")
        existing = await db.company_integrations.find_one(
            {"company_id": current_user["id"], "integration_name": integration_name}
        )
        update = {
            "api_key": data.get("api_key", ""),
            "webhook_url": data.get("webhook_url", ""),
            "settings": data.get("settings", {}),
            "status": "connected",
            "configured_at": now(),
            "last_sync": now(),
        }
        if existing:
            await db.company_integrations.update_one({"_id": existing["_id"]}, {"$set": update})
        else:
            await db.company_integrations.insert_one(
                {
                    "id": str(uuid.uuid4()),
                    "company_id": current_user["id"],
                    "integration_name": integration_name,
                    **update,
                }
            )
        return {"success": True}

    @router.get("/company/imports")
    async def list_imports(current_user: dict = Depends(require_company)):
        imports = (
            await db.company_imports.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(i) for i in imports]

    @router.get("/company/exports")
    async def list_exports(current_user: dict = Depends(require_company)):
        exports = (
            await db.company_exports.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(e) for e in exports]

    @router.post("/company/import-csv")
    async def import_csv(
        import_type: str = Form("offers"),
        file: UploadFile = File(...),
        current_user: dict = Depends(require_company),
    ):
        content = await file.read()
        try:
            rows = list(csv.DictReader(io.StringIO(content.decode("utf-8-sig"))))
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Fichier CSV illisible") from None
        import_log = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "import_type": import_type,
            "filename": file.filename,
            "file_size": len(content),
            "rows_count": len(rows),
            "status": "processed",
            "created_at": now(),
        }
        await db.company_imports.insert_one(import_log)
        return clean(import_log)

    @router.post("/company/export")
    async def export_data(data: dict, current_user: dict = Depends(require_company)):
        export_type = data.get("export_type", "offers")
        export_format = data.get("format", "csv")
        headers_by_type = {
            "applications": ["id", "offer_id", "status", "created_at"],
            "interns": ["id", "student_name", "position", "status", "start_date", "end_date"],
            "offers": ["id", "title", "status", "location", "created_at"],
        }
        if export_type == "applications":
            docs = await db.applications.find({"company_id": current_user["id"]}).to_list(None)
            rows = [
                {
                    "id": d.get("id", ""),
                    "offer_id": d.get("job_offer_id", d.get("offer_id", "")),
                    "status": d.get("status", ""),
                    "created_at": str(d.get("created_at", "")),
                }
                for d in docs
            ]
        elif export_type == "interns":
            docs = await db.company_interns.find({"company_id": current_user["id"]}).to_list(None)
            rows = [
                {
                    "id": d.get("id", ""),
                    "student_name": d.get("student_name", ""),
                    "position": d.get("position", ""),
                    "status": d.get("status", ""),
                    "start_date": d.get("start_date", ""),
                    "end_date": d.get("end_date", ""),
                }
                for d in docs
            ]
        else:
            docs = await db.internship_offers.find({"company_id": current_user["id"]}).to_list(None)
            rows = [
                {
                    "id": d.get("id", ""),
                    "title": d.get("title", ""),
                    "status": d.get("status", ""),
                    "location": d.get("location", ""),
                    "created_at": str(d.get("created_at", "")),
                }
                for d in docs
            ]
        output = io.StringIO()
        writer = csv.DictWriter(
            output, fieldnames=headers_by_type.get(export_type, headers_by_type["offers"])
        )
        writer.writeheader()
        writer.writerows(rows)
        export_log = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "export_type": export_type,
            "format": export_format,
            "rows_count": len(rows),
            "status": "completed",
            "created_at": now(),
        }
        await db.company_exports.insert_one(export_log)
        return PlainTextResponse(content=output.getvalue(), media_type="text/csv")

    # ==========================================================================
    # STAGIAIRES & ÉVALUATIONS
    # ==========================================================================

    @router.get("/company/interns")
    async def list_interns(current_user: dict = Depends(require_company)):
        interns = (
            await db.company_interns.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(i) for i in interns]

    @router.get("/company/interns/active")
    async def list_active_interns(current_user: dict = Depends(require_company)):
        interns = (
            await db.company_interns.find({"company_id": current_user["id"], "status": "active"})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(i) for i in interns]

    @router.post("/company/interns")
    async def add_intern(data: dict, current_user: dict = Depends(require_company)):
        start_date = data.get("start_date") or ""
        try:
            start_dt = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
        except ValueError:
            start_dt = now()
        intern = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "student_name": data.get("student_name", ""),
            "student_email": data.get("student_email", ""),
            "position": data.get("position", ""),
            "department": data.get("department", ""),
            "start_date": start_date,
            "end_date": data.get("end_date", ""),
            "supervisor_name": data.get("supervisor_name", ""),
            "supervisor_email": data.get("supervisor_email", ""),
            "tutor_name": data.get("tutor_name", ""),
            "tutor_email": data.get("tutor_email", ""),
            "objectives": data.get("objectives", []),
            "weekly_schedule": data.get("weekly_schedule", ""),
            "gratification": data.get("gratification", ""),
            "status": data.get("status", "active"),
            "progress": 0,
            "last_evaluation_date": None,
            "next_evaluation_date": (start_dt + timedelta(days=30)).strftime("%Y-%m-%d"),
            "created_at": now(),
        }
        await db.company_interns.insert_one(intern)
        return clean(intern)

    @router.get("/company/evaluations")
    async def list_evaluations(current_user: dict = Depends(require_company)):
        evaluations = (
            await db.company_evaluations.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(e) for e in evaluations]

    @router.post("/company/evaluations")
    async def create_evaluation(data: dict, current_user: dict = Depends(require_company)):
        intern = await db.company_interns.find_one(
            {"id": data.get("intern_id"), "company_id": current_user["id"]}
        )
        evaluation = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "intern_id": data.get("intern_id", ""),
            "intern_name": (intern or {}).get("student_name", ""),
            "evaluation_date": data.get("evaluation_date", ""),
            "period": data.get("period", "mid_term"),
            "technical_skills": data.get("technical_skills", 5),
            "soft_skills": data.get("soft_skills", 5),
            "autonomy": data.get("autonomy", 5),
            "integration": data.get("integration", 5),
            "objectives_achievement": data.get("objectives_achievement", 5),
            "overall_rating": data.get("overall_rating", 5),
            "strengths": data.get("strengths", ""),
            "improvements": data.get("improvements", ""),
            "next_objectives": data.get("next_objectives", ""),
            "supervisor_comments": data.get("supervisor_comments", ""),
            "intern_feedback": data.get("intern_feedback", ""),
            "created_by": data.get("created_by", current_user["id"]),
            "created_at": now(),
        }
        await db.company_evaluations.insert_one(evaluation)
        if intern:
            await db.company_interns.update_one(
                {"id": intern["id"]},
                {"$set": {"last_evaluation_date": evaluation["evaluation_date"]}},
            )
        return clean(evaluation)

    # ==========================================================================
    # COMMUNICATIONS & WORKFLOWS
    # ==========================================================================

    @router.get("/company/messages")
    async def list_messages(current_user: dict = Depends(require_company)):
        messages = (
            await db.company_messages.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(m) for m in messages]

    @router.post("/company/messages")
    async def send_company_message(data: dict, current_user: dict = Depends(require_company)):
        scheduled_date = data.get("scheduled_date") or ""
        message = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "subject": data.get("subject", ""),
            "content": data.get("content", ""),
            "type": data.get("type", "email"),
            "recipients": data.get("recipients", []),
            "priority": data.get("priority", "normal"),
            "template_id": data.get("template_id", "") or None,
            "status": "scheduled" if scheduled_date else "sent",
            "scheduled_date": scheduled_date or None,
            "sent_at": None if scheduled_date else now(),
            "created_by": data.get("created_by", current_user["id"]),
            "created_at": now(),
        }
        await db.company_messages.insert_one(message)
        for recipient in message["recipients"]:
            notification = {
                "id": str(uuid.uuid4()),
                "user_id": recipient,
                "type": "company_message",
                "title": message["subject"],
                "message": message["content"][:200],
                "data": {"company_id": current_user["id"], "message_id": message["id"]},
                "is_read": False,
                "created_at": now(),
            }
            await db.notifications.insert_one(notification)
        return clean(message)

    @router.get("/company/workflows")
    async def list_workflows(current_user: dict = Depends(require_company)):
        workflows = (
            await db.company_workflows.find({"company_id": current_user["id"]})
            .sort("created_at", -1)
            .to_list(None)
        )
        return [clean(w) for w in workflows]

    @router.post("/company/workflows")
    async def create_workflow(data: dict, current_user: dict = Depends(require_company)):
        workflow = {
            "id": str(uuid.uuid4()),
            "company_id": current_user["id"],
            "name": data.get("name", ""),
            "trigger": data.get("trigger", "application_received"),
            "actions": data.get("actions", []),
            "conditions": data.get("conditions", []),
            "active": data.get("active", True),
            "runs_count": 0,
            "created_at": now(),
        }
        await db.company_workflows.insert_one(workflow)
        return clean(workflow)

    @router.get("/company/notifications")
    async def list_company_notifications(current_user: dict = Depends(require_company)):
        notifications = (
            await db.notifications.find({"user_id": current_user["id"]})
            .sort("created_at", -1)
            .limit(50)
            .to_list(50)
        )
        result = []
        for n in notifications:
            n = clean(n)
            n["read"] = n.pop("is_read", False)
            result.append(n)
        return result

    # ==========================================================================
    # ANALYTICS
    # ==========================================================================

    @router.get("/analytics/company")
    async def company_analytics(range: str = "30d", current_user: dict = Depends(require_company)):
        company_id = current_user["id"]
        offers = await db.internship_offers.find({"company_id": company_id}).to_list(None)
        applications = await db.applications.find({"company_id": company_id}).to_list(None)

        offers_total = len(offers)
        offers_active = len([o for o in offers if o.get("status") == "active"])
        offers_closed = len([o for o in offers if o.get("status") in ("closed", "archived")])
        offers_views = sum(o.get("views_count", 0) or 0 for o in offers)

        status_counts: dict[str, int] = {}
        for a in applications:
            status_counts[a.get("status", "received")] = (
                status_counts.get(a.get("status", "received"), 0) + 1
            )

        total_apps = len(applications)
        accepted = status_counts.get("accepted", 0)
        conversion_rate = round((accepted / total_apps * 100), 1) if total_apps else 0.0

        skill_counts: dict[str, int] = {}
        for o in offers:
            for skill in o.get("required_skills", []) or []:
                skill_counts[skill] = skill_counts.get(skill, 0) + 1
        top_skills = [
            s for s, _ in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]

        return {
            "range": range,
            "offers": {
                "total": offers_total,
                "active": offers_active,
                "closed": offers_closed,
                "views": offers_views,
            },
            "applications": {
                "total": total_apps,
                "received": status_counts.get("received", 0),
                "reviewing": status_counts.get("reviewing", 0),
                "interview": status_counts.get("interview", 0),
                "accepted": accepted,
                "rejected": status_counts.get("rejected", 0),
            },
            "performance": {
                "conversion_rate": conversion_rate,
                "top_skills": top_skills,
                "top_sources": ["Plateforme Émérés"],
            },
        }

    @router.get("/analytics/export")
    async def export_analytics(
        format: str = "csv",
        range: str = "30d",
        current_user: dict = Depends(require_company),
    ):
        analytics = await company_analytics(range=range, current_user=current_user)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["section", "metric", "value"])
        for section in ("offers", "applications"):
            for metric, value in analytics[section].items():
                writer.writerow([section, metric, value])
        writer.writerow(
            ["performance", "conversion_rate", analytics["performance"]["conversion_rate"]]
        )
        writer.writerow(
            ["performance", "top_skills", ", ".join(analytics["performance"]["top_skills"])]
        )
        return PlainTextResponse(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=rapport-rh-{range}.csv"},
        )

    return router
