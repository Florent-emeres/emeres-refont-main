from app.models.schemas import JobRecoRequest, JobRecoResponse

def student_job_reco(req: JobRecoRequest) -> JobRecoResponse:
    return JobRecoResponse(offers=["offer_1", "offer_2", "offer_3"])
