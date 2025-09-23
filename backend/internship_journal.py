"""
ÉMÉRÉS Internship Journal System
Comprehensive internship tracking with tutors, objectives, and evaluations
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import uuid
import json

# Internship Journal Models
class InternshipStatus(str, Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    ON_HOLD = "on_hold"

class ObjectiveStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"

class ObjectivePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class EvaluationRating(str, Enum):
    EXCELLENT = "excellent"      # 5/5
    GOOD = "good"               # 4/5
    SATISFACTORY = "satisfactory" # 3/5
    NEEDS_IMPROVEMENT = "needs_improvement" # 2/5
    UNSATISFACTORY = "unsatisfactory" # 1/5

class TutorType(str, Enum):
    SCHOOL = "school"           # Tuteur école
    COMPANY = "company"         # Tuteur entreprise
    MENTOR = "mentor"           # Mentor ÉMÉRÉS

@dataclass
class InternshipObjective:
    """Individual internship objective"""
    id: str
    internship_id: str
    title: str
    description: str
    priority: ObjectivePriority
    status: ObjectiveStatus
    due_date: datetime
    created_date: datetime
    completion_date: Optional[datetime] = None
    assigned_by: str = ""  # tutor_id
    assigned_to: str = ""  # student_id
    skills_developed: List[str] = None
    deliverables: List[str] = None
    progress_notes: List[Dict] = None
    completion_percentage: int = 0
    validation_required: bool = True
    validated_by: Optional[str] = None
    validated_at: Optional[datetime] = None

    def __post_init__(self):
        if self.skills_developed is None:
            self.skills_developed = []
        if self.deliverables is None:
            self.deliverables = []
        if self.progress_notes is None:
            self.progress_notes = []

@dataclass
class WeeklyReport:
    """Weekly internship report"""
    id: str
    internship_id: str
    student_id: str
    week_number: int
    start_date: datetime
    end_date: datetime
    
    # Student input
    tasks_completed: List[str]
    difficulties_encountered: List[str]
    skills_learned: List[str]
    objectives_progress: Dict[str, int]  # objective_id -> progress percentage
    student_notes: str
    time_spent_hours: float
    
    # Tutor feedback
    tutor_feedback: Optional[str] = None
    tutor_rating: Optional[EvaluationRating] = None
    tutor_recommendations: List[str] = None
    validated_by_tutor: bool = False
    validation_date: Optional[datetime] = None
    
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if self.tutor_recommendations is None:
            self.tutor_recommendations = []
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

@dataclass 
class InternshipEvaluation:
    """Comprehensive internship evaluation"""
    id: str
    internship_id: str
    student_id: str
    evaluator_id: str
    evaluator_type: TutorType
    evaluation_type: str  # "mid_term", "final", "monthly"
    
    # Technical skills evaluation
    technical_skills: Dict[str, EvaluationRating]
    
    # Soft skills evaluation  
    soft_skills: Dict[str, EvaluationRating]
    
    # Overall performance
    overall_rating: EvaluationRating
    strengths: List[str]
    areas_for_improvement: List[str]
    recommendations: List[str]
    
    # Detailed feedback
    detailed_feedback: str
    future_opportunities: str
    would_recommend_student: bool
    
    # Scoring
    total_score: float  # Calculated score out of 100
    
    created_at: datetime = None
    evaluation_period_start: datetime = None
    evaluation_period_end: datetime = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)

@dataclass
class InternshipJournal:
    """Main internship journal entry"""
    id: str
    student_id: str
    company_id: str
    internship_title: str
    internship_description: str
    
    # Dates
    start_date: datetime
    end_date: datetime
    duration_weeks: int
    
    # Status and progress
    status: InternshipStatus
    overall_progress: float  # 0-100%
    
    # Tutors
    school_tutor_id: Optional[str] = None
    company_tutor_id: Optional[str] = None  
    mentor_id: Optional[str] = None
    
    # Objectives and tracking
    objectives: List[InternshipObjective] = None
    weekly_reports: List[WeeklyReport] = None
    evaluations: List[InternshipEvaluation] = None
    
    # Documents and resources
    documents: List[Dict] = None  # Document links, reports, etc.
    
    # Metadata
    created_at: datetime = None
    updated_at: datetime = None
    created_by: str = ""

    def __post_init__(self):
        if self.objectives is None:
            self.objectives = []
        if self.weekly_reports is None:
            self.weekly_reports = []
        if self.evaluations is None:
            self.evaluations = []
        if self.documents is None:
            self.documents = []
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

class InternshipJournalManager:
    """Manager for internship journal operations"""
    
    def __init__(self, db):
        self.db = db
    
    async def create_internship_journal(self, journal_data: Dict) -> str:
        """Create a new internship journal"""
        try:
            journal = InternshipJournal(
                id=str(uuid.uuid4()),
                **journal_data
            )
            
            # Calculate duration in weeks
            duration = journal.end_date - journal.start_date
            journal.duration_weeks = max(1, duration.days // 7)
            
            await self.db.internship_journals.insert_one(journal.__dict__)
            
            # Create initial objectives if provided
            if 'initial_objectives' in journal_data:
                for obj_data in journal_data['initial_objectives']:
                    await self.create_objective(journal.id, obj_data)
            
            return journal.id
            
        except Exception as e:
            print(f"❌ Error creating internship journal: {e}")
            return None
    
    async def create_objective(self, internship_id: str, objective_data: Dict) -> str:
        """Create a new internship objective"""
        try:
            objective = InternshipObjective(
                id=str(uuid.uuid4()),
                internship_id=internship_id,
                created_date=datetime.now(timezone.utc),
                **objective_data
            )
            
            # Store objective in database
            await self.db.internship_objectives.insert_one(objective.__dict__)
            
            # Update journal's objectives list
            await self.db.internship_journals.update_one(
                {"id": internship_id},
                {"$push": {"objectives": objective.id}}
            )
            
            return objective.id
            
        except Exception as e:
            print(f"❌ Error creating objective: {e}")
            return None
    
    async def update_objective_progress(self, objective_id: str, progress_data: Dict) -> bool:
        """Update objective progress"""
        try:
            update_data = {
                "completion_percentage": progress_data.get("completion_percentage", 0),
                "status": progress_data.get("status", ObjectiveStatus.IN_PROGRESS),
                "updated_at": datetime.now(timezone.utc)
            }
            
            # Add progress note
            if "note" in progress_data:
                progress_note = {
                    "date": datetime.now(timezone.utc).isoformat(),
                    "note": progress_data["note"],
                    "updated_by": progress_data.get("updated_by", "")
                }
                update_data["$push"] = {"progress_notes": progress_note}
            
            # Mark as completed if 100%
            if progress_data.get("completion_percentage") == 100:
                update_data["status"] = ObjectiveStatus.COMPLETED
                update_data["completion_date"] = datetime.now(timezone.utc)
            
            result = await self.db.internship_objectives.update_one(
                {"id": objective_id},
                {"$set": update_data} if "$push" not in update_data else {
                    "$set": {k: v for k, v in update_data.items() if k != "$push"},
                    "$push": update_data["$push"]
                }
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"❌ Error updating objective progress: {e}")
            return False
    
    async def validate_objective(self, objective_id: str, validator_id: str) -> bool:
        """Validate completed objective by tutor"""
        try:
            result = await self.db.internship_objectives.update_one(
                {"id": objective_id, "status": ObjectiveStatus.COMPLETED},
                {"$set": {
                    "validated_by": validator_id,
                    "validated_at": datetime.now(timezone.utc)
                }}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"❌ Error validating objective: {e}")
            return False
    
    async def create_weekly_report(self, report_data: Dict) -> str:
        """Create weekly internship report"""
        try:
            report = WeeklyReport(
                id=str(uuid.uuid4()),
                **report_data
            )
            
            await self.db.weekly_reports.insert_one(report.__dict__)
            
            # Update journal's weekly reports list
            await self.db.internship_journals.update_one(
                {"id": report.internship_id},
                {"$push": {"weekly_reports": report.id}}
            )
            
            return report.id
            
        except Exception as e:
            print(f"❌ Error creating weekly report: {e}")
            return None
    
    async def submit_tutor_feedback(self, report_id: str, feedback_data: Dict) -> bool:
        """Submit tutor feedback for weekly report"""
        try:
            update_data = {
                "tutor_feedback": feedback_data.get("feedback", ""),
                "tutor_rating": feedback_data.get("rating"),
                "tutor_recommendations": feedback_data.get("recommendations", []),
                "validated_by_tutor": True,
                "validation_date": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            
            result = await self.db.weekly_reports.update_one(
                {"id": report_id},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"❌ Error submitting tutor feedback: {e}")
            return False
    
    async def create_evaluation(self, evaluation_data: Dict) -> str:
        """Create internship evaluation"""
        try:
            evaluation = InternshipEvaluation(
                id=str(uuid.uuid4()),
                **evaluation_data
            )
            
            # Calculate total score based on ratings
            evaluation.total_score = self._calculate_evaluation_score(evaluation)
            
            await self.db.internship_evaluations.insert_one(evaluation.__dict__)
            
            # Update journal's evaluations list
            await self.db.internship_journals.update_one(
                {"id": evaluation.internship_id},
                {"$push": {"evaluations": evaluation.id}}
            )
            
            return evaluation.id
            
        except Exception as e:
            print(f"❌ Error creating evaluation: {e}")
            return None
    
    def _calculate_evaluation_score(self, evaluation: InternshipEvaluation) -> float:
        """Calculate total evaluation score"""
        rating_values = {
            EvaluationRating.EXCELLENT: 5,
            EvaluationRating.GOOD: 4,
            EvaluationRating.SATISFACTORY: 3,
            EvaluationRating.NEEDS_IMPROVEMENT: 2,
            EvaluationRating.UNSATISFACTORY: 1
        }
        
        total_points = 0
        total_criteria = 0
        
        # Technical skills
        for rating in evaluation.technical_skills.values():
            total_points += rating_values.get(rating, 0)
            total_criteria += 1
        
        # Soft skills  
        for rating in evaluation.soft_skills.values():
            total_points += rating_values.get(rating, 0)
            total_criteria += 1
        
        # Overall rating (weighted more heavily)
        total_points += rating_values.get(evaluation.overall_rating, 0) * 2
        total_criteria += 2
        
        if total_criteria == 0:
            return 0
        
        # Convert to percentage
        return (total_points / (total_criteria * 5)) * 100
    
    async def get_journal_progress(self, internship_id: str) -> Dict:
        """Get comprehensive progress overview"""
        try:
            journal = await self.db.internship_journals.find_one({"id": internship_id})
            if not journal:
                return {}
            
            # Get objectives progress
            objectives = await self.db.internship_objectives.find(
                {"internship_id": internship_id}
            ).to_list(None)
            
            # Get weekly reports
            reports = await self.db.weekly_reports.find(
                {"internship_id": internship_id}
            ).sort("week_number", 1).to_list(None)
            
            # Get evaluations
            evaluations = await self.db.internship_evaluations.find(
                {"internship_id": internship_id}
            ).to_list(None)
            
            # Calculate progress metrics
            total_objectives = len(objectives)
            completed_objectives = len([obj for obj in objectives if obj["status"] == ObjectiveStatus.COMPLETED])
            
            total_reports = len(reports)
            validated_reports = len([rep for rep in reports if rep.get("validated_by_tutor", False)])
            
            avg_rating = 0
            if evaluations:
                avg_rating = sum(eval.get("total_score", 0) for eval in evaluations) / len(evaluations)
            
            return {
                "internship_id": internship_id,
                "status": journal["status"],
                "overall_progress": journal.get("overall_progress", 0),
                "objectives": {
                    "total": total_objectives,
                    "completed": completed_objectives,
                    "completion_rate": (completed_objectives / total_objectives * 100) if total_objectives > 0 else 0
                },
                "weekly_reports": {
                    "total": total_reports,
                    "validated": validated_reports,
                    "validation_rate": (validated_reports / total_reports * 100) if total_reports > 0 else 0
                },
                "evaluations": {
                    "count": len(evaluations),
                    "average_score": avg_rating
                },
                "last_activity": max(
                    journal.get("updated_at", ""),
                    max([obj.get("updated_at", "") for obj in objectives] + [""]),
                    max([rep.get("updated_at", "") for rep in reports] + [""])
                )
            }
            
        except Exception as e:
            print(f"❌ Error getting journal progress: {e}")
            return {}
    
    async def generate_internship_report(self, internship_id: str, format: str = "summary") -> Dict:
        """Generate comprehensive internship report"""
        try:
            progress = await self.get_journal_progress(internship_id)
            
            if format == "summary":
                return {
                    "type": "internship_summary",
                    "internship_id": internship_id,
                    "generated_at": datetime.now(timezone.utc).isoformat(),
                    "progress": progress,
                    "key_metrics": {
                        "objectives_completion": progress["objectives"]["completion_rate"],
                        "reports_validation": progress["weekly_reports"]["validation_rate"], 
                        "average_evaluation_score": progress["evaluations"]["average_score"]
                    }
                }
            
            # For detailed report, include all data
            journal = await self.db.internship_journals.find_one({"id": internship_id})
            objectives = await self.db.internship_objectives.find({"internship_id": internship_id}).to_list(None)
            reports = await self.db.weekly_reports.find({"internship_id": internship_id}).to_list(None)
            evaluations = await self.db.internship_evaluations.find({"internship_id": internship_id}).to_list(None)
            
            return {
                "type": "internship_detailed_report",
                "internship_id": internship_id,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "journal": journal,
                "objectives": objectives,
                "weekly_reports": reports,
                "evaluations": evaluations,
                "progress": progress
            }
            
        except Exception as e:
            print(f"❌ Error generating internship report: {e}")
            return {}