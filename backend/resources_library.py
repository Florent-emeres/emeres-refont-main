"""
ÉMÉRÉS Resources Library System
Comprehensive resource management for guides, videos, courses, and educational content
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import uuid
import json

# Resource Library Models
class ResourceType(str, Enum):
    GUIDE = "guide"
    VIDEO = "video"
    COURSE = "course"
    TEMPLATE = "template"
    TOOL = "tool"
    ARTICLE = "article"
    WEBINAR = "webinar"
    PODCAST = "podcast"
    EBOOK = "ebook"
    CHECKLIST = "checklist"

class ResourceCategory(str, Enum):
    CAREER_DEVELOPMENT = "career_development"
    INTERVIEW_PREPARATION = "interview_preparation"
    CV_WRITING = "cv_writing"
    NETWORKING = "networking"
    TECHNICAL_SKILLS = "technical_skills"
    SOFT_SKILLS = "soft_skills"
    ENTREPRENEURSHIP = "entrepreneurship"
    MENTORING = "mentoring"
    INTERNSHIP_GUIDE = "internship_guide"
    JOB_SEARCH = "job_search"
    INDUSTRY_INSIGHTS = "industry_insights"
    PERSONAL_BRANDING = "personal_branding"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class ResourceStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    FEATURED = "featured"

@dataclass
class Resource:
    """Individual resource model"""
    id: str
    title: str
    description: str
    resource_type: ResourceType
    category: ResourceCategory
    difficulty_level: DifficultyLevel
    status: ResourceStatus
    
    # Content details
    content_url: Optional[str] = None
    content_text: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    file_size_mb: Optional[float] = None
    
    # Targeting
    target_roles: List[str] = None  # student, mentor, company, school, institution
    prerequisites: List[str] = None
    learning_outcomes: List[str] = None
    tags: List[str] = None
    
    # Metadata
    author: str = ""
    author_id: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None
    published_at: Optional[datetime] = None
    
    # Engagement metrics
    view_count: int = 0
    download_count: int = 0
    rating_average: float = 0.0
    rating_count: int = 0
    
    # Course-specific fields
    modules: List[Dict] = None
    quiz_questions: List[Dict] = None
    certificate_available: bool = False
    
    def __post_init__(self):
        if self.target_roles is None:
            self.target_roles = []
        if self.prerequisites is None:
            self.prerequisites = []
        if self.learning_outcomes is None:
            self.learning_outcomes = []
        if self.tags is None:
            self.tags = []
        if self.modules is None:
            self.modules = []
        if self.quiz_questions is None:
            self.quiz_questions = []
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

@dataclass
class ResourceCollection:
    """Collection/Playlist of resources"""
    id: str
    title: str
    description: str
    category: ResourceCategory
    target_roles: List[str]
    resource_ids: List[str]
    
    # Metadata
    created_by: str
    created_at: datetime = None
    updated_at: datetime = None
    is_featured: bool = False
    order_index: int = 0
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

@dataclass
class UserProgress:
    """User progress tracking for resources"""
    id: str
    user_id: str
    resource_id: str
    
    # Progress tracking
    started_at: datetime
    last_accessed_at: datetime
    completed_at: Optional[datetime] = None
    progress_percentage: int = 0
    time_spent_minutes: int = 0
    
    # Course-specific progress
    completed_modules: List[str] = None
    quiz_scores: Dict[str, float] = None
    notes: str = ""
    
    # Engagement
    bookmarked: bool = False
    rating: Optional[int] = None
    review: Optional[str] = None
    
    def __post_init__(self):
        if self.completed_modules is None:
            self.completed_modules = []
        if self.quiz_scores is None:
            self.quiz_scores = {}

class ResourceLibraryManager:
    """Manager for resource library operations"""
    
    def __init__(self, db):
        self.db = db
    
    async def create_resource(self, resource_data: Dict) -> str:
        """Create a new resource"""
        try:
            resource = Resource(
                id=str(uuid.uuid4()),
                **resource_data
            )
            
            await self.db.resources.insert_one(resource.__dict__)
            return resource.id
            
        except Exception as e:
            print(f"❌ Error creating resource: {e}")
            return None
    
    async def get_resources(self, filters: Dict = None, user_role: str = None) -> List[Dict]:
        """Get resources with filtering"""
        try:
            query = {"status": ResourceStatus.PUBLISHED}
            
            # Apply filters
            if filters:
                if "category" in filters:
                    query["category"] = filters["category"]
                if "resource_type" in filters:
                    query["resource_type"] = filters["resource_type"]
                if "difficulty_level" in filters:
                    query["difficulty_level"] = filters["difficulty_level"]
                if "search" in filters:
                    query["$or"] = [
                        {"title": {"$regex": filters["search"], "$options": "i"}},
                        {"description": {"$regex": filters["search"], "$options": "i"}},
                        {"tags": {"$in": [filters["search"]]}}
                    ]
            
            # Filter by user role
            if user_role:
                query["target_roles"] = {"$in": [user_role, "all"]}
            
            resources = await self.db.resources.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
            return resources
            
        except Exception as e:
            print(f"❌ Error getting resources: {e}")
            return []
    
    async def get_resource_by_id(self, resource_id: str) -> Optional[Dict]:
        """Get single resource by ID"""
        try:
            resource = await self.db.resources.find_one({"id": resource_id}, {"_id": 0})
            return resource
            
        except Exception as e:
            print(f"❌ Error getting resource: {e}")
            return None
    
    async def get_featured_resources(self, limit: int = 10) -> List[Dict]:
        """Get featured resources"""
        try:
            resources = await self.db.resources.find({
                "status": ResourceStatus.FEATURED
            }, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
            
            return resources
            
        except Exception as e:
            print(f"❌ Error getting featured resources: {e}")
            return []
    
    async def get_popular_resources(self, limit: int = 10) -> List[Dict]:
        """Get popular resources by view count"""
        try:
            resources = await self.db.resources.find({
                "status": ResourceStatus.PUBLISHED
            }, {"_id": 0}).sort("view_count", -1).limit(limit).to_list(limit)
            
            return resources
            
        except Exception as e:
            print(f"❌ Error getting popular resources: {e}")
            return []
    
    async def get_resources_by_category(self, category: ResourceCategory, limit: int = 20) -> List[Dict]:
        """Get resources by category"""
        try:
            resources = await self.db.resources.find({
                "category": category,
                "status": ResourceStatus.PUBLISHED
            }, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
            
            return resources
            
        except Exception as e:
            print(f"❌ Error getting resources by category: {e}")
            return []
    
    async def create_collection(self, collection_data: Dict) -> str:
        """Create a resource collection"""
        try:
            collection = ResourceCollection(
                id=str(uuid.uuid4()),
                **collection_data
            )
            
            await self.db.resource_collections.insert_one(collection.__dict__)
            return collection.id
            
        except Exception as e:
            print(f"❌ Error creating collection: {e}")
            return None
    
    async def get_collections(self, user_role: str = None) -> List[Dict]:
        """Get resource collections"""
        try:
            query = {}
            if user_role:
                query["target_roles"] = {"$in": [user_role, "all"]}
            
            collections = await self.db.resource_collections.find(query, {"_id": 0}).sort("order_index", 1).to_list(50)
            
            # Populate collections with actual resources
            for collection in collections:
                if collection.get("resource_ids"):
                    resources = await self.db.resources.find({
                        "id": {"$in": collection["resource_ids"]},
                        "status": ResourceStatus.PUBLISHED
                    }, {"_id": 0}).to_list(None)
                    collection["resources"] = resources
            
            return collections
            
        except Exception as e:
            print(f"❌ Error getting collections: {e}")
            return []
    
    async def track_resource_view(self, resource_id: str, user_id: str) -> bool:
        """Track resource view/access"""
        try:
            # Increment view count
            await self.db.resources.update_one(
                {"id": resource_id},
                {"$inc": {"view_count": 1}}
            )
            
            # Track user progress
            existing_progress = await self.db.user_progress.find_one({
                "user_id": user_id,
                "resource_id": resource_id
            })
            
            if existing_progress:
                # Update last accessed
                await self.db.user_progress.update_one(
                    {"user_id": user_id, "resource_id": resource_id},
                    {"$set": {"last_accessed_at": datetime.now(timezone.utc)}}
                )
            else:
                # Create new progress record
                progress = UserProgress(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    resource_id=resource_id,
                    started_at=datetime.now(timezone.utc),
                    last_accessed_at=datetime.now(timezone.utc)
                )
                await self.db.user_progress.insert_one(progress.__dict__)
            
            return True
            
        except Exception as e:
            print(f"❌ Error tracking resource view: {e}")
            return False
    
    async def update_progress(self, user_id: str, resource_id: str, progress_data: Dict) -> bool:
        """Update user progress for a resource"""
        try:
            update_data = {
                "progress_percentage": progress_data.get("progress_percentage", 0),
                "time_spent_minutes": progress_data.get("time_spent_minutes", 0),
                "last_accessed_at": datetime.now(timezone.utc)
            }
            
            # Mark as completed if 100%
            if progress_data.get("progress_percentage") == 100:
                update_data["completed_at"] = datetime.now(timezone.utc)
            
            # Update completed modules for courses
            if "completed_modules" in progress_data:
                update_data["completed_modules"] = progress_data["completed_modules"]
            
            # Update quiz scores
            if "quiz_scores" in progress_data:
                update_data["quiz_scores"] = progress_data["quiz_scores"]
            
            result = await self.db.user_progress.update_one(
                {"user_id": user_id, "resource_id": resource_id},
                {"$set": update_data}
            )
            
            return result.modified_count > 0
            
        except Exception as e:
            print(f"❌ Error updating progress: {e}")
            return False
    
    async def rate_resource(self, user_id: str, resource_id: str, rating: int, review: str = "") -> bool:
        """Rate and review a resource"""
        try:
            # Update user progress with rating
            await self.db.user_progress.update_one(
                {"user_id": user_id, "resource_id": resource_id},
                {"$set": {"rating": rating, "review": review}}
            )
            
            # Recalculate resource average rating
            ratings = await self.db.user_progress.find({
                "resource_id": resource_id,
                "rating": {"$exists": True, "$ne": None}
            }).to_list(None)
            
            if ratings:
                total_rating = sum(r["rating"] for r in ratings)
                avg_rating = total_rating / len(ratings)
                
                await self.db.resources.update_one(
                    {"id": resource_id},
                    {"$set": {
                        "rating_average": round(avg_rating, 2),
                        "rating_count": len(ratings)
                    }}
                )
            
            return True
            
        except Exception as e:
            print(f"❌ Error rating resource: {e}")
            return False
    
    async def get_user_progress(self, user_id: str, resource_id: str = None) -> List[Dict]:
        """Get user progress for resources"""
        try:
            query = {"user_id": user_id}
            if resource_id:
                query["resource_id"] = resource_id
            
            progress_records = await self.db.user_progress.find(query, {"_id": 0}).to_list(None)
            
            # Enrich with resource details
            for progress in progress_records:
                resource = await self.db.resources.find_one({"id": progress["resource_id"]})
                if resource:
                    progress["resource"] = resource
            
            return progress_records
            
        except Exception as e:
            print(f"❌ Error getting user progress: {e}")
            return []
    
    async def get_recommendations(self, user_id: str, user_role: str, limit: int = 10) -> List[Dict]:
        """Get personalized resource recommendations"""
        try:
            # Get user's completed resources
            user_progress = await self.db.user_progress.find({
                "user_id": user_id,
                "completed_at": {"$exists": True}
            }).to_list(None)
            
            completed_categories = []
            completed_resource_ids = []
            
            for progress in user_progress:
                resource = await self.db.resources.find_one({"id": progress["resource_id"]})
                if resource:
                    completed_categories.append(resource["category"])
                    completed_resource_ids.append(resource["id"])
            
            # Find resources in similar categories that user hasn't completed
            recommendations = await self.db.resources.find({
                "status": ResourceStatus.PUBLISHED,
                "target_roles": {"$in": [user_role, "all"]},
                "id": {"$nin": completed_resource_ids},
                "$or": [
                    {"category": {"$in": completed_categories}},
                    {"rating_average": {"$gte": 4.0}},
                    {"view_count": {"$gte": 50}}
                ]
            }).sort("rating_average", -1).limit(limit).to_list(limit)
            
            return recommendations
            
        except Exception as e:
            print(f"❌ Error getting recommendations: {e}")
            return []
    
    async def search_resources(self, search_query: str, filters: Dict = None) -> List[Dict]:
        """Advanced resource search"""
        try:
            # Build search pipeline
            pipeline = []
            
            # Text search stage
            if search_query:
                pipeline.append({
                    "$match": {
                        "$or": [
                            {"title": {"$regex": search_query, "$options": "i"}},
                            {"description": {"$regex": search_query, "$options": "i"}},
                            {"tags": {"$regex": search_query, "$options": "i"}},
                            {"learning_outcomes": {"$regex": search_query, "$options": "i"}}
                        ],
                        "status": ResourceStatus.PUBLISHED
                    }
                })
            else:
                pipeline.append({
                    "$match": {"status": ResourceStatus.PUBLISHED}
                })
            
            # Apply filters
            if filters:
                filter_match = {}
                if "category" in filters:
                    filter_match["category"] = filters["category"]
                if "resource_type" in filters:
                    filter_match["resource_type"] = filters["resource_type"]
                if "difficulty_level" in filters:
                    filter_match["difficulty_level"] = filters["difficulty_level"]
                if "target_role" in filters:
                    filter_match["target_roles"] = {"$in": [filters["target_role"], "all"]}
                
                if filter_match:
                    pipeline.append({"$match": filter_match})
            
            # Sort by relevance (rating + view count)
            pipeline.append({
                "$addFields": {
                    "relevance_score": {
                        "$add": [
                            {"$multiply": ["$rating_average", 2]},
                            {"$divide": ["$view_count", 100]}
                        ]
                    }
                }
            })
            
            pipeline.append({"$sort": {"relevance_score": -1}})
            pipeline.append({"$limit": 50})
            
            results = await self.db.resources.aggregate(pipeline).to_list(50)
            return results
            
        except Exception as e:
            print(f"❌ Error searching resources: {e}")
            return []
    
    async def get_learning_path(self, category: ResourceCategory, difficulty: DifficultyLevel = None) -> List[Dict]:
        """Get structured learning path for a category"""
        try:
            query = {
                "category": category,
                "status": ResourceStatus.PUBLISHED
            }
            
            if difficulty:
                query["difficulty_level"] = difficulty
            
            # Get resources ordered by difficulty and rating
            difficulty_order = {
                DifficultyLevel.BEGINNER: 1,
                DifficultyLevel.INTERMEDIATE: 2,
                DifficultyLevel.ADVANCED: 3,
                DifficultyLevel.EXPERT: 4
            }
            
            resources = await self.db.resources.find(query).to_list(None)
            
            # Sort by difficulty then by rating
            sorted_resources = sorted(
                resources,
                key=lambda x: (
                    difficulty_order.get(x.get("difficulty_level", DifficultyLevel.BEGINNER), 1),
                    -x.get("rating_average", 0)
                )
            )
            
            return sorted_resources
            
        except Exception as e:
            print(f"❌ Error getting learning path: {e}")
            return []

    async def init_default_resources(self):
        """Initialize default resources for ÉMÉRÉS"""
        try:
            # Check if resources already exist
            existing_count = await self.db.resources.count_documents({})
            if existing_count > 0:
                print(f"📚 Resources library already contains {existing_count} resources")
                return
            
            print("📚 Initializing default ÉMÉRÉS resources library...")
            
            default_resources = [
                # Career Development Guides
                {
                    "title": "Guide Complet : Réussir sa Recherche d'Emploi",
                    "description": "Stratégies complètes pour optimiser sa recherche d'emploi, du CV à l'entretien en passant par le networking.",
                    "resource_type": ResourceType.GUIDE,
                    "category": ResourceCategory.JOB_SEARCH,
                    "difficulty_level": DifficultyLevel.BEGINNER,
                    "status": ResourceStatus.FEATURED,
                    "target_roles": ["student", "all"],
                    "learning_outcomes": [
                        "Structurer sa recherche d'emploi",
                        "Optimiser son CV et sa lettre de motivation",
                        "Maîtriser les techniques d'entretien",
                        "Développer son réseau professionnel"
                    ],
                    "tags": ["emploi", "cv", "entretien", "recherche"],
                    "author": "Équipe ÉMÉRÉS",
                    "duration_minutes": 45,
                    "content_text": "# Guide Complet : Réussir sa Recherche d'Emploi\n\n## 1. Préparation et Stratégie\n...",
                    "rating_average": 4.8,
                    "rating_count": 156,
                    "view_count": 2340
                },
                
                # Interview Preparation
                {
                    "title": "Maîtriser l'Entretien d'Embauche : Techniques et Astuces",
                    "description": "Préparation complète aux entretiens : questions fréquentes, techniques STAR, gestion du stress et négociation salariale.",
                    "resource_type": ResourceType.VIDEO,
                    "category": ResourceCategory.INTERVIEW_PREPARATION,
                    "difficulty_level": DifficultyLevel.INTERMEDIATE,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["student", "all"],
                    "learning_outcomes": [
                        "Préparer ses réponses aux questions classiques",
                        "Utiliser la méthode STAR",
                        "Gérer son stress pendant l'entretien",
                        "Négocier son salaire efficacement"
                    ],
                    "tags": ["entretien", "questions", "stress", "salaire"],
                    "author": "Marie Dubois, RH Senior",
                    "duration_minutes": 35,
                    "rating_average": 4.6,
                    "rating_count": 89,
                    "view_count": 1456
                },
                
                # CV Writing
                {
                    "title": "Template : CV Moderne et Efficace 2024",
                    "description": "Modèle de CV moderne optimisé ATS avec exemples sectoriels et conseils de personnalisation.",
                    "resource_type": ResourceType.TEMPLATE,
                    "category": ResourceCategory.CV_WRITING,
                    "difficulty_level": DifficultyLevel.BEGINNER,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["student", "all"],
                    "learning_outcomes": [
                        "Structurer un CV professionnel",
                        "Optimiser pour les ATS",
                        "Adapter selon le secteur",
                        "Éviter les erreurs courantes"
                    ],
                    "tags": ["cv", "template", "ats", "moderne"],
                    "author": "Design Team ÉMÉRÉS",
                    "rating_average": 4.9,
                    "rating_count": 234,
                    "view_count": 3421,
                    "download_count": 1876
                },
                
                # Mentoring Resources
                {
                    "title": "Guide du Mentor : Accompagner Efficacement les Étudiants",
                    "description": "Méthodologies de mentorat, techniques de coaching et outils pour maximiser l'impact de l'accompagnement.",
                    "resource_type": ResourceType.GUIDE,
                    "category": ResourceCategory.MENTORING,
                    "difficulty_level": DifficultyLevel.INTERMEDIATE,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["mentor", "all"],
                    "learning_outcomes": [
                        "Définir les objectifs de mentorat",
                        "Utiliser les techniques de coaching",
                        "Structurer les sessions",
                        "Évaluer les progrès"
                    ],
                    "tags": ["mentorat", "coaching", "accompagnement", "évaluation"],
                    "author": "Dr. Pierre Martin, Coach Professionnel",
                    "duration_minutes": 50,
                    "rating_average": 4.7,
                    "rating_count": 67,
                    "view_count": 890
                },
                
                # Technical Skills
                {
                    "title": "Formation : Développement Web Full-Stack (Débutant)",
                    "description": "Formation complète pour débuter en développement web : HTML, CSS, JavaScript, bases de données et frameworks modernes.",
                    "resource_type": ResourceType.COURSE,
                    "category": ResourceCategory.TECHNICAL_SKILLS,
                    "difficulty_level": DifficultyLevel.BEGINNER,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["student", "all"],
                    "learning_outcomes": [
                        "Maîtriser HTML5 et CSS3",
                        "Programmer en JavaScript",
                        "Comprendre les bases de données",
                        "Utiliser React et Node.js"
                    ],
                    "tags": ["développement", "web", "javascript", "react", "nodejs"],
                    "author": "TechAcademy ÉMÉRÉS",
                    "duration_minutes": 480,
                    "modules": [
                        {"id": "1", "title": "Introduction au Web", "duration": 60},
                        {"id": "2", "title": "HTML et CSS", "duration": 120},
                        {"id": "3", "title": "JavaScript Fondamentaux", "duration": 150},
                        {"id": "4", "title": "React et Components", "duration": 150}
                    ],
                    "certificate_available": True,
                    "rating_average": 4.5,
                    "rating_count": 123,
                    "view_count": 2156
                },
                
                # Soft Skills
                {
                    "title": "Développer son Intelligence Émotionnelle en Entreprise",
                    "description": "Comprendre et développer son intelligence émotionnelle pour améliorer ses relations professionnelles et sa performance.",
                    "resource_type": ResourceType.WEBINAR,
                    "category": ResourceCategory.SOFT_SKILLS,
                    "difficulty_level": DifficultyLevel.INTERMEDIATE,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["student", "mentor", "company", "all"],
                    "learning_outcomes": [
                        "Comprendre l'intelligence émotionnelle",
                        "Gérer ses émotions au travail",
                        "Améliorer ses relations professionnelles",
                        "Développer l'empathie"
                    ],
                    "tags": ["soft-skills", "émotions", "relations", "empathie"],
                    "author": "Sophie Laurent, Psychologue du Travail",
                    "duration_minutes": 75,
                    "rating_average": 4.4,
                    "rating_count": 156,
                    "view_count": 1789
                },
                
                # Company Resources
                {
                    "title": "Guide RH : Optimiser son Processus de Recrutement",
                    "description": "Méthodologies et outils pour améliorer l'efficacité du recrutement et l'expérience candidat.",
                    "resource_type": ResourceType.GUIDE,
                    "category": ResourceCategory.INDUSTRY_INSIGHTS,
                    "difficulty_level": DifficultyLevel.ADVANCED,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["company", "all"],
                    "learning_outcomes": [
                        "Structurer le processus de recrutement",
                        "Améliorer l'expérience candidat",
                        "Utiliser les outils RH modernes",
                        "Mesurer l'efficacité"
                    ],
                    "tags": ["recrutement", "rh", "processus", "candidat"],
                    "author": "Cabinet RH Excellence",
                    "duration_minutes": 40,
                    "rating_average": 4.6,
                    "rating_count": 78,
                    "view_count": 1123
                },
                
                # Entrepreneurship
                {
                    "title": "Checklist : Lancer sa Startup en 2024",
                    "description": "Liste complète des étapes essentielles pour créer et lancer sa startup avec succès.",
                    "resource_type": ResourceType.CHECKLIST,
                    "category": ResourceCategory.ENTREPRENEURSHIP,
                    "difficulty_level": DifficultyLevel.INTERMEDIATE,
                    "status": ResourceStatus.PUBLISHED,
                    "target_roles": ["student", "all"],
                    "learning_outcomes": [
                        "Valider son idée de business",
                        "Constituer son équipe",
                        "Lever des fonds",
                        "Lancer son produit"
                    ],
                    "tags": ["startup", "entrepreneuriat", "business", "création"],
                    "author": "Incubateur ÉMÉRÉS",
                    "rating_average": 4.3,
                    "rating_count": 92,
                    "view_count": 1567,
                    "download_count": 834
                }
            ]
            
            # Insert default resources
            for resource_data in default_resources:
                resource_data["id"] = str(uuid.uuid4())
                resource_data["created_at"] = datetime.now(timezone.utc)
                resource_data["updated_at"] = datetime.now(timezone.utc)
                if resource_data["status"] == ResourceStatus.PUBLISHED:
                    resource_data["published_at"] = datetime.now(timezone.utc)
            
            await self.db.resources.insert_many(default_resources)
            print(f"✅ Initialized {len(default_resources)} default resources")
            
            # Create default collections
            default_collections = [
                {
                    "title": "Parcours Complet : Recherche d'Emploi",
                    "description": "Collection complète pour maîtriser tous les aspects de la recherche d'emploi",
                    "category": ResourceCategory.JOB_SEARCH,
                    "target_roles": ["student", "all"],
                    "resource_ids": [r["id"] for r in default_resources if r["category"] in [ResourceCategory.JOB_SEARCH, ResourceCategory.CV_WRITING, ResourceCategory.INTERVIEW_PREPARATION]],
                    "created_by": "system",
                    "is_featured": True,
                    "order_index": 1
                },
                {
                    "title": "Développement des Compétences Techniques",
                    "description": "Ressources pour développer ses compétences techniques et rester à jour",
                    "category": ResourceCategory.TECHNICAL_SKILLS,
                    "target_roles": ["student", "all"],
                    "resource_ids": [r["id"] for r in default_resources if r["category"] == ResourceCategory.TECHNICAL_SKILLS],
                    "created_by": "system",
                    "is_featured": True,
                    "order_index": 2
                }
            ]
            
            for collection_data in default_collections:
                collection_data["id"] = str(uuid.uuid4())
                collection_data["created_at"] = datetime.now(timezone.utc)
                collection_data["updated_at"] = datetime.now(timezone.utc)
            
            await self.db.resource_collections.insert_many(default_collections)
            print(f"✅ Initialized {len(default_collections)} default collections")
            
        except Exception as e:
            print(f"❌ Error initializing default resources: {e}")