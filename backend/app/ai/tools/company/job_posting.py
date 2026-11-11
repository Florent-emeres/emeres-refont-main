from app.models.schemas import JobPostingRequest, JobPostingResponse


def company_job_posting(req: JobPostingRequest) -> JobPostingResponse:
    title = f"{req.role} (Stage)"
    details = ", ".join(req.requirements) if req.requirements else "Profil polyvalent"
    description = f"Annonce optimisée ATS. Compétences: {details}."
    return JobPostingResponse(title=title, description=description)
