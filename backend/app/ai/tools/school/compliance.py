from app.models.schemas import ComplianceRequest, ComplianceResponse

def school_compliance(req: ComplianceRequest) -> ComplianceResponse:
    checklist = ["RGPD vérifié", "Accords pédagogiques signés", "Contacts référents à jour"]
    return ComplianceResponse(checklist=checklist)
