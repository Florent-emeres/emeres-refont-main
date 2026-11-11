import importlib
import os
from pathlib import Path

import yaml
from app.middleware.timed_execution import timed_execute_tool
from app.models import schemas
from app.policy.forbidden_tools_guard import ToolCall
from app.repo import users_repo
from fastapi import APIRouter, HTTPException, Request

router = APIRouter(prefix="/ai/v2")

SCHEMA_MAP = {
    "student_cover_letter": (
        schemas.CoverLetterRequest,
        schemas.CoverLetterResponse,
        "app.ai.tools.student.cover_letter",
        "student_cover_letter",
    ),
    "student_job_reco": (
        schemas.JobRecoRequest,
        schemas.JobRecoResponse,
        "app.ai.tools.student.job_reco",
        "student_job_reco",
    ),
    "student_coach": (
        schemas.CoachRequest,
        schemas.CoachResponse,
        "app.ai.tools.student.coach",
        "student_coach",
    ),
    "student_diagnostic": (
        schemas.CVEvalRequest,
        schemas.CVEvalResponse,
        "app.ai.tools.student.diagnostic",
        "student_diagnostic",
    ),
    "student_interview_start": (
        schemas.InterviewStartRequest,
        schemas.InterviewStartResponse,
        "app.ai.tools.student.interview",
        "student_interview_start",
    ),
    "student_interview_answer": (
        schemas.InterviewAnswerRequest,
        schemas.InterviewAnswerResponse,
        "app.ai.tools.student.interview",
        "student_interview_answer",
    ),
    "student_assistant": (
        schemas.AssistantRequest,
        schemas.AssistantResponse,
        "app.ai.tools.student.assistant",
        "student_assistant_tool",
    ),
}


def _is_true(value: str | None) -> bool:
    return str(value or "").lower() in ("1", "true", "yes", "on")


REQUIRE_JOBSEEKER_TRUE = _is_true(os.getenv("REQUIRE_JOBSEEKER_TRUE", "false"))


def load_agent(agent: str) -> dict:
    base_dir = Path(__file__).resolve().parent
    path = base_dir / "agents" / f"{agent}.yaml"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Agent {agent} not found")
    return yaml.safe_load(path.read_text(encoding="utf-8"))


@router.post("/{agent}/{tool}")
def run_tool(agent: str, tool: str, payload: dict, request: Request):
    cfg = load_agent(agent)
    allowed = cfg.get("tools", {}).get("allowed", [])
    if tool not in allowed:
        raise HTTPException(status_code=403, detail="Tool not allowed")
    if tool not in SCHEMA_MAP:
        raise HTTPException(status_code=404, detail="Unknown tool")

    ReqModel, ResModel, module_path, func_name = SCHEMA_MAP[tool]
    user_id = request.headers.get("X-User-Id") or payload.get("user_id") or "u_test"

    if agent == "jobseeker":
        status = users_repo.get_jobseeker_status(user_id)
        if REQUIRE_JOBSEEKER_TRUE and (not status or not status.get("is_jobseeker")):
            raise HTTPException(status_code=403, detail="jobseeker access denied")
        context = payload.setdefault("context", {})
        if status and status.get("programs"):
            context["jobseeker_programs"] = status["programs"]

    req = ReqModel(**payload)
    module = importlib.import_module(module_path)
    handler = getattr(module, func_name)

    context_dict = payload.get("context") if isinstance(payload.get("context"), dict) else None
    context_mode = str(context_dict.get("mode", "sync")) if context_dict else "sync"
    prompt_value = None
    for key in ("prompt", "question", "content"):
        value = payload.get(key)
        if isinstance(value, str) and value:
            prompt_value = value
            break

    tool_call = ToolCall(
        name=tool,
        display_name=f"{agent}:{tool}",
        parent=agent,
        context=context_mode,
        prompt=prompt_value,
    )
    request_id = request.headers.get("X-Request-Id", "request-local")

    result = timed_execute_tool(
        handler,
        call=tool_call,
        ancestry=[agent],
        request_id=request_id,
        user_id=user_id,
        req=req,
    )
    if hasattr(result, "model_dump"):
        result_payload = result.model_dump()
    elif hasattr(result, "dict"):
        result_payload = result.dict()
    elif isinstance(result, dict):
        result_payload = result
    else:
        raise HTTPException(status_code=500, detail="Invalid tool response")
    return ResModel(**result_payload)


SCHEMA_MAP.update(
    {
        "company_shortlisting": (
            schemas.ShortlistRequest,
            schemas.ShortlistResponse,
            "app.ai.tools.company.shortlisting",
            "company_shortlisting",
        ),
        "company_matching": (
            schemas.MatchingRequest,
            schemas.MatchingResult,
            "app.ai.tools.company.matching_score",
            "company_matching",
        ),
        "company_job_posting": (
            schemas.JobPostingRequest,
            schemas.JobPostingResponse,
            "app.ai.tools.company.job_posting",
            "company_job_posting",
        ),
        "company_interview_guide": (
            schemas.InterviewGuideRequest,
            schemas.InterviewGuideResponse,
            "app.ai.tools.company.interview_guide",
            "company_interview_guide",
        ),
        "company_onboarding_pack": (
            schemas.OnboardingPackRequest,
            schemas.OnboardingPackResponse,
            "app.ai.tools.company.onboarding_pack",
            "company_onboarding_pack",
        ),
        "school_cohort_tracking": (
            schemas.CohortTrackRequest,
            schemas.CohortTrackResponse,
            "app.ai.tools.school.cohort_tracking",
            "school_cohort_tracking",
        ),
        "school_reports": (
            schemas.ReportsRequest,
            schemas.ReportsResponse,
            "app.ai.tools.school.reports",
            "school_reports",
        ),
        "school_documents": (
            schemas.DocumentsRequest,
            schemas.DocumentsResponse,
            "app.ai.tools.school.documents",
            "school_documents",
        ),
        "school_compliance": (
            schemas.ComplianceRequest,
            schemas.ComplianceResponse,
            "app.ai.tools.school.compliance",
            "school_compliance",
        ),
        "school_partnerships": (
            schemas.PartnershipsRequest,
            schemas.PartnershipsResponse,
            "app.ai.tools.school.partnerships",
            "school_partnerships",
        ),
        "mentor_mentor_plan": (
            schemas.MentorPlanRequest,
            schemas.MentorPlanResponse,
            "app.ai.tools.mentor.mentor_plan",
            "mentor_mentor_plan",
        ),
        "mentor_mentor_feedback": (
            schemas.MentorFeedbackRequest,
            schemas.MentorFeedbackResponse,
            "app.ai.tools.mentor.mentor_feedback",
            "mentor_mentor_feedback",
        ),
        "mentor_risk_detection": (
            schemas.RiskDetectRequest,
            schemas.RiskDetectResponse,
            "app.ai.tools.mentor.risk_detection",
            "mentor_risk_detection",
        ),
        "mentor_mentor_advice": (
            schemas.MentorAdviceRequest,
            schemas.MentorAdviceResponse,
            "app.ai.tools.mentor.mentor_advice",
            "mentor_mentor_advice",
        ),
        "mentor_final_evaluation": (
            schemas.FinalEvalRequest,
            schemas.FinalEvalResponse,
            "app.ai.tools.mentor.final_evaluation",
            "mentor_final_evaluation",
        ),
        "admin_moderation": (
            schemas.ModerationRequest,
            schemas.ModerationResponse,
            "app.ai.tools.admin.moderation",
            "admin_moderation",
        ),
        "admin_observability": (
            schemas.ObservabilityRequest,
            schemas.ObservabilityResponse,
            "app.ai.tools.admin.observability",
            "admin_observability",
        ),
        "admin_catalogs": (
            schemas.CatalogsRequest,
            schemas.CatalogsResponse,
            "app.ai.tools.admin.catalogs",
            "admin_catalogs",
        ),
        "admin_rgpd": (
            schemas.RgpdRequest,
            schemas.RgpdResponse,
            "app.ai.tools.admin.rgpd",
            "admin_rgpd",
        ),
        "admin_ab_testing": (
            schemas.ABTestRequest,
            schemas.ABTestResponse,
            "app.ai.tools.admin.ab_testing",
            "admin_ab_testing",
        ),
        "jobseeker_cover_letter": (
            schemas.CoverLetterRequest,
            schemas.CoverLetterResponse,
            "app.ai.tools.jobseeker.cover_letter",
            "jobseeker_cover_letter",
        ),
        "jobseeker_cv_optimizer": (
            schemas.CVOptimizeRequest,
            schemas.CVOptimizeResponse,
            "app.ai.tools.jobseeker.cv_optimizer",
            "jobseeker_cv_optimizer",
        ),
        "jobseeker_career_explorer": (
            schemas.CareerExploreRequest,
            schemas.CareerExploreResponse,
            "app.ai.tools.jobseeker.career_explorer",
            "jobseeker_career_explorer",
        ),
        "jobseeker_coach": (
            schemas.CoachRequest,
            schemas.CoachResponse,
            "app.ai.tools.jobseeker.coach",
            "jobseeker_coach",
        ),
        "jobseeker_interview_start": (
            schemas.InterviewStartRequest,
            schemas.InterviewStartResponse,
            "app.ai.tools.jobseeker.interview",
            "jobseeker_interview_start",
        ),
        "jobseeker_interview_answer": (
            schemas.InterviewAnswerRequest,
            schemas.InterviewAnswerResponse,
            "app.ai.tools.jobseeker.interview",
            "jobseeker_interview_answer",
        ),
    }
)
