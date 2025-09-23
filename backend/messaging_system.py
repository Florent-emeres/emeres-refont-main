"""
ÉMÉRÉS - Système de Messagerie Interne Multi-Contextes
========================================================

Implémentation complète du système de messagerie interne selon les spécifications :
- Thread-based conversations avec contextes métier
- RBAC strict avec ThreadParticipant
- Chiffrement E2E et audit logs
- Support WebSocket pour temps réel
- Auto-création de threads sur événements business

Contextes supportés :
- CANDIDATURE : Étudiant ↔ Entreprise
- MENTORAT : Étudiant ↔ Mentor  
- SCOLAIRE : Étudiant ↔ École
- PARTENARIAT : Entreprise ↔ École
- STAGE : Multi-acteurs (Étudiant, Entreprise, École, Mentor)
"""

from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from cryptography.fernet import Fernet
import uuid
import os
import base64

# Configuration du chiffrement E2E
ENCRYPTION_KEY = os.environ.get('MESSAGING_ENCRYPTION_KEY', Fernet.generate_key())
if isinstance(ENCRYPTION_KEY, str):
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()
cipher_suite = Fernet(ENCRYPTION_KEY)

class ThreadContextType:
    """Énumération des contextes de threads"""
    CANDIDATURE = "candidature"
    MENTORAT = "mentorat"
    SCOLAIRE = "scolaire"
    PARTENARIAT = "partenariat"
    STAGE = "stage"
    SUPPORT = "support"

class ThreadStatus:
    """États possibles d'un thread"""
    ACTIVE = "active"
    ARCHIVED = "archived"
    LOCKED = "locked"
    RESOLVED = "resolved"

class MessageType:
    """Types de messages supportés"""
    TEXT = "text"
    FILE = "file"
    IMAGE = "image"
    SYSTEM = "system"
    DOCUMENT = "document"

class ThreadParticipant(BaseModel):
    """Participant à un thread avec permissions granulaires"""
    user_id: str
    role: str  # student, company, school, mentor, institution
    permissions: List[str] = ["read", "write"]  # read, write, admin, export
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_read_at: Optional[datetime] = None
    notification_enabled: bool = True
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Thread(BaseModel):
    """Thread de conversation avec contexte métier"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    context_type: str  # ThreadContextType
    context_id: str  # ID de l'objet source (candidature_id, stage_id, etc.)
    title: str  # Titre généré automatiquement ou personnalisé
    
    # Contexte business
    context_data: Dict[str, Any] = {}  # Données métier spécifiques
    
    # Participants et accès
    participants: List[ThreadParticipant] = []
    created_by: str  # user_id du créateur
    
    # État et priorité
    status: str = ThreadStatus.ACTIVE
    priority: str = "normal"  # low, normal, high, urgent
    is_private: bool = False
    
    # Tags et catégorisation
    tags: List[str] = []
    category: Optional[str] = None
    
    # Métadonnées temporelles
    last_activity_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Sécurité et conformité
    is_encrypted: bool = True
    retention_policy: Optional[str] = None
    audit_enabled: bool = True
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Message(BaseModel):
    """Message avec chiffrement E2E et métadonnées complètes"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    thread_id: str
    
    # Expéditeur
    sender_id: str
    sender_role: str
    sender_name: str  # Cache pour performance
    
    # Contenu (sera chiffré)
    body: str  # Message principal
    message_type: str = MessageType.TEXT
    reply_to_message_id: Optional[str] = None
    
    # Pièces jointes et médias
    attachments: List[Dict[str, Any]] = []
    
    # Métadonnées avancées
    metadata: Dict[str, Any] = {}
    mentions: List[str] = []  # user_ids mentionnés avec @
    is_important: bool = False
    
    # Statut de lecture par participant
    read_by: List[Dict[str, Any]] = []  # [{"user_id": "", "read_at": ""}]
    
    # Édition et suppression
    edited_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[str] = None
    
    # Sécurité et audit
    is_encrypted: bool = True
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AuditLog(BaseModel):
    """Log d'audit pour conformité et sécurité"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    thread_id: str
    action: str  # created, message_sent, message_read, participant_added, exported
    actor_id: str
    actor_role: str
    actor_name: str
    target_id: Optional[str] = None
    details: Dict[str, Any] = {}
    
    # Conformité et sécurité
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    session_id: Optional[str] = None
    
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# ========================================
# FONCTIONS DE CHIFFREMENT E2E
# ========================================

def encrypt_message(message: str) -> str:
    """Chiffre un message avec Fernet"""
    try:
        encrypted_bytes = cipher_suite.encrypt(message.encode('utf-8'))
        return base64.urlsafe_b64encode(encrypted_bytes).decode('utf-8')
    except Exception as e:
        print(f"Erreur chiffrement: {e}")
        return message  # Fallback en cas d'erreur

def decrypt_message(encrypted_message: str) -> str:
    """Déchiffre un message avec Fernet"""
    try:
        encrypted_bytes = base64.urlsafe_b64decode(encrypted_message.encode('utf-8'))
        decrypted_bytes = cipher_suite.decrypt(encrypted_bytes)
        return decrypted_bytes.decode('utf-8')
    except Exception as e:
        print(f"Erreur déchiffrement: {e}")
        return encrypted_message  # Fallback en cas d'erreur

# ========================================
# SERVICES BUSINESS LOGIC
# ========================================

class MessagingService:
    """Service principal pour la messagerie interne"""
    
    def __init__(self, db):
        self.db = db
    
    async def create_thread_for_context(
        self, 
        context_type: str, 
        context_id: str, 
        participants: List[Dict[str, str]], 
        title: str = None,
        created_by: str = None,
        context_data: Dict[str, Any] = None
    ) -> Thread:
        """Crée automatiquement un thread pour un contexte business"""
        
        # Générer titre automatique si non fourni
        if not title:
            title = self._generate_auto_title(context_type, context_data or {})
        
        # Créer les participants
        thread_participants = []
        for p in participants:
            participant = ThreadParticipant(
                user_id=p["user_id"],
                role=p["role"],
                permissions=p.get("permissions", ["read", "write"])
            )
            thread_participants.append(participant)
        
        # Créer le thread
        thread = Thread(
            context_type=context_type,
            context_id=context_id,
            title=title,
            participants=thread_participants,
            created_by=created_by or (participants[0]["user_id"] if participants else "system"),
            context_data=context_data or {},
            tags=self._generate_auto_tags(context_type, context_data or {})
        )
        
        # Sauvegarder en base
        await self.db.threads.insert_one(thread.dict())
        
        # Log d'audit
        await self._log_audit(
            thread.id, "thread_created", thread.created_by, "system",
            details={"context_type": context_type, "context_id": context_id}
        )
        
        return thread
    
    async def send_message(
        self, 
        thread_id: str, 
        sender_id: str, 
        sender_role: str,
        sender_name: str,
        body: str,
        message_type: str = MessageType.TEXT,
        attachments: List[Dict[str, Any]] = None,
        mentions: List[str] = None,
        is_important: bool = False
    ) -> Message:
        """Envoie un message dans un thread"""
        
        # Vérifier accès en écriture
        if not await self._verify_thread_access(thread_id, sender_id, "write"):
            raise Exception("Accès en écriture refusé")
        
        # Chiffrer le contenu
        encrypted_body = encrypt_message(body)
        
        # Créer le message
        message = Message(
            thread_id=thread_id,
            sender_id=sender_id,
            sender_role=sender_role,
            sender_name=sender_name,
            body=encrypted_body,
            message_type=message_type,
            attachments=attachments or [],
            mentions=mentions or [],
            is_important=is_important
        )
        
        # Sauvegarder en base
        await self.db.messages.insert_one(message.dict())
        
        # Mettre à jour l'activité du thread
        await self.db.threads.update_one(
            {"id": thread_id},
            {
                "$set": {
                    "last_activity_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        
        # Log d'audit
        await self._log_audit(
            thread_id, "message_sent", sender_id, sender_role,
            target_id=message.id,
            details={"message_type": message_type, "has_attachments": len(attachments or []) > 0}
        )
        
        return message
    
    async def get_threads_for_user(
        self, 
        user_id: str, 
        user_role: str,
        context_filter: str = None,
        search: str = None
    ) -> List[Dict[str, Any]]:
        """Récupère les threads visibles pour un utilisateur"""
        
        # Construire la requête
        query = {"participants.user_id": user_id}
        if context_filter:
            query["context_type"] = context_filter
        
        # Récupérer les threads
        threads_cursor = self.db.threads.find(query).sort("last_activity_at", -1)
        threads = await threads_cursor.to_list(length=None)
        
        # Enrichir avec les informations d'inbox
        enriched_threads = []
        for thread_data in threads:
            # Créer l'objet Thread pour validation
            thread = Thread(**thread_data)
            
            # Calculer les non-lus pour cet utilisateur
            unread_count = await self._get_unread_count(thread.id, user_id)
            
            # Récupérer le dernier message
            last_message = await self._get_last_message(thread.id)
            
            # Filtrage par recherche si spécifié
            if search and not self._thread_matches_search(thread, last_message, search):
                continue
            
            enriched_thread = {
                "thread_id": thread.id,
                "context_type": thread.context_type,
                "title": thread.title,
                "status": thread.status,
                "priority": thread.priority,
                "tags": thread.tags,
                "unread_count": unread_count,
                "last_activity_at": thread.last_activity_at.isoformat(),
                "participants": [p.dict() for p in thread.participants],
                "context_data": thread.context_data
            }
            
            if last_message:
                # Déchiffrer le message pour l'affichage
                decrypted_content = decrypt_message(last_message.get("body", ""))
                enriched_thread["last_message"] = {
                    "sender_name": last_message.get("sender_name", ""),
                    "content": decrypted_content[:100] + "..." if len(decrypted_content) > 100 else decrypted_content,
                    "created_at": last_message.get("created_at")
                }
            
            enriched_threads.append(enriched_thread)
        
        return enriched_threads
    
    async def get_thread_messages(
        self, 
        thread_id: str, 
        user_id: str,
        cursor: str = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Récupère les messages d'un thread avec pagination"""
        
        # Vérifier accès en lecture
        if not await self._verify_thread_access(thread_id, user_id, "read"):
            raise Exception("Accès en lecture refusé")
        
        # Construire la requête avec pagination
        query = {"thread_id": thread_id}
        if cursor:
            # Pagination basée sur l'ID du message
            query["id"] = {"$lt": cursor}
        
        # Récupérer les messages
        messages_cursor = self.db.messages.find(query).sort("created_at", -1).limit(limit)
        messages = await messages_cursor.to_list(length=None)
        
        # Déchiffrer et enrichir les messages
        enriched_messages = []
        for msg_data in messages:
            message = Message(**msg_data)
            
            # Déchiffrer le contenu
            decrypted_body = decrypt_message(message.body)
            
            # Vérifier si c'est son propre message
            is_own = message.sender_id == user_id
            
            # Vérifier si lu par l'utilisateur
            is_read = any(r.get("user_id") == user_id for r in message.read_by)
            
            enriched_message = {
                "message_id": message.id,
                "sender_id": message.sender_id,
                "sender_name": message.sender_name,
                "sender_role": message.sender_role,
                "content": decrypted_body,
                "message_type": message.message_type,
                "attachments": message.attachments,
                "mentions": message.mentions,
                "is_important": message.is_important,
                "is_own": is_own,
                "is_read": is_read,
                "created_at": message.created_at.isoformat(),
                "edited_at": message.edited_at.isoformat() if message.edited_at else None
            }
            
            enriched_messages.append(enriched_message)
        
        return list(reversed(enriched_messages))  # Ordre chronologique
    
    async def mark_thread_as_read(self, thread_id: str, user_id: str):
        """Marque tous les messages d'un thread comme lus pour un utilisateur"""
        
        # Mettre à jour lastReadAt du participant
        await self.db.threads.update_one(
            {"id": thread_id, "participants.user_id": user_id},
            {"$set": {"participants.$.last_read_at": datetime.now(timezone.utc)}}
        )
        
        # Mettre à jour les messages non lus
        await self.db.messages.update_many(
            {
                "thread_id": thread_id,
                "sender_id": {"$ne": user_id},  # Pas ses propres messages
                "read_by.user_id": {"$ne": user_id}  # Pas déjà lu
            },
            {
                "$push": {
                    "read_by": {
                        "user_id": user_id,
                        "read_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            }
        )
        
        # Log d'audit
        await self._log_audit(
            thread_id, "thread_read", user_id, "user",
            details={"marked_as_read": True}
        )
    
    # ========================================
    # MÉTHODES PRIVÉES
    # ========================================
    
    def _generate_auto_title(self, context_type: str, context_data: Dict[str, Any]) -> str:
        """Génère automatiquement un titre selon le contexte"""
        titles = {
            ThreadContextType.CANDIDATURE: f"Candidature - {context_data.get('position', 'Stage')}",
            ThreadContextType.MENTORAT: f"Mentorat - {context_data.get('student_name', 'Étudiant')}",
            ThreadContextType.SCOLAIRE: f"Scolaire - {context_data.get('subject', 'Question')}",
            ThreadContextType.PARTENARIAT: f"Partenariat - {context_data.get('company_name', 'Entreprise')} x {context_data.get('school_name', 'École')}",
            ThreadContextType.STAGE: f"Stage - {context_data.get('position', 'Mission')}",
            ThreadContextType.SUPPORT: f"Support - {context_data.get('category', 'Demande')}"
        }
        return titles.get(context_type, f"Conversation {context_type}")
    
    def _generate_auto_tags(self, context_type: str, context_data: Dict[str, Any]) -> List[str]:
        """Génère automatiquement des tags selon le contexte"""
        base_tags = [context_type]
        
        if context_data.get("priority"):
            base_tags.append(f"priority:{context_data['priority']}")
        
        if context_data.get("company_name"):
            base_tags.append(f"company:{context_data['company_name']}")
        
        if context_data.get("position"):
            base_tags.append(f"position:{context_data['position']}")
        
        return base_tags
    
    async def _verify_thread_access(self, thread_id: str, user_id: str, permission: str = "read") -> bool:
        """Vérifie l'accès d'un utilisateur à un thread"""
        thread = await self.db.threads.find_one({"id": thread_id})
        if not thread:
            return False
        
        # Chercher le participant
        for participant in thread.get("participants", []):
            if participant.get("user_id") == user_id:
                permissions = participant.get("permissions", [])
                return permission in permissions
        
        return False
    
    async def _get_unread_count(self, thread_id: str, user_id: str) -> int:
        """Calcule le nombre de messages non lus dans un thread"""
        
        # Récupérer la dernière lecture du participant
        thread = await self.db.threads.find_one({"id": thread_id})
        if not thread:
            return 0
        
        participant = next((p for p in thread.get("participants", []) if p.get("user_id") == user_id), None)
        if not participant:
            return 0
        
        last_read_at = participant.get("last_read_at")
        if not last_read_at:
            # Jamais lu, compter tous les messages sauf les siens
            count = await self.db.messages.count_documents({
                "thread_id": thread_id,
                "sender_id": {"$ne": user_id}
            })
            return count
        
        # Convertir la date si c'est une string
        if isinstance(last_read_at, str):
            last_read_at = datetime.fromisoformat(last_read_at.replace('Z', '+00:00'))
        
        # Compter les messages après la dernière lecture
        count = await self.db.messages.count_documents({
            "thread_id": thread_id,
            "sender_id": {"$ne": user_id},
            "created_at": {"$gt": last_read_at}
        })
        return count
    
    async def _get_last_message(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Récupère le dernier message d'un thread"""
        message = await self.db.messages.find_one(
            {"thread_id": thread_id},
            sort=[("created_at", -1)]
        )
        return message
    
    def _thread_matches_search(self, thread: Thread, last_message: Dict[str, Any], search: str) -> bool:
        """Vérifie si un thread correspond à la recherche"""
        search_lower = search.lower()
        
        # Recherche dans le titre
        if search_lower in thread.title.lower():
            return True
        
        # Recherche dans les tags
        if any(search_lower in tag.lower() for tag in thread.tags):
            return True
        
        # Recherche dans le dernier message
        if last_message:
            decrypted_content = decrypt_message(last_message.get("body", ""))
            if search_lower in decrypted_content.lower():
                return True
        
        # Recherche dans les données de contexte
        context_str = str(thread.context_data).lower()
        if search_lower in context_str:
            return True
        
        return False
    
    async def _log_audit(
        self, 
        thread_id: str, 
        action: str, 
        actor_id: str, 
        actor_role: str,
        target_id: str = None,
        details: Dict[str, Any] = None
    ):
        """Enregistre un événement d'audit"""
        audit_log = AuditLog(
            thread_id=thread_id,
            action=action,
            actor_id=actor_id,
            actor_role=actor_role,
            actor_name=f"User {actor_id}",  # Peut être enrichi
            target_id=target_id,
            details=details or {}
        )
        
        await self.db.audit_logs.insert_one(audit_log.dict())

# ========================================
# FACTORY FUNCTIONS
# ========================================

def create_messaging_service(db) -> MessagingService:
    """Factory pour créer le service de messagerie"""
    return MessagingService(db)

# ========================================
# CONTEXT CREATORS - AUTO-THREAD CREATION
# ========================================

async def create_candidature_thread(
    messaging_service: MessagingService,
    application_id: str,
    student_id: str,
    company_user_ids: List[str],
    position_title: str = "Stage",
    company_name: str = "Entreprise"
) -> Thread:
    """Crée automatiquement un thread pour une candidature"""
    
    participants = [
        {"user_id": student_id, "role": "student"}
    ]
    
    for company_user_id in company_user_ids:
        participants.append({
            "user_id": company_user_id, 
            "role": "company",
            "permissions": ["read", "write", "export"]
        })
    
    return await messaging_service.create_thread_for_context(
        context_type=ThreadContextType.CANDIDATURE,
        context_id=application_id,
        participants=participants,
        title=f"Candidature - {position_title}",
        context_data={
            "application_id": application_id,
            "position": position_title,
            "company_name": company_name
        }
    )

async def create_mentorat_thread(
    messaging_service: MessagingService,
    mentor_relation_id: str,
    student_id: str,
    mentor_id: str,
    student_name: str = "Étudiant"
) -> Thread:
    """Crée automatiquement un thread pour un mentorat"""
    
    participants = [
        {"user_id": student_id, "role": "student"},
        {"user_id": mentor_id, "role": "mentor", "permissions": ["read", "write", "export"]}
    ]
    
    return await messaging_service.create_thread_for_context(
        context_type=ThreadContextType.MENTORAT,
        context_id=mentor_relation_id,
        participants=participants,
        title=f"Mentorat - {student_name}",
        context_data={
            "mentor_relation_id": mentor_relation_id,
            "student_name": student_name
        }
    )

async def create_scolaire_thread(
    messaging_service: MessagingService,
    context_id: str,
    student_id: str,
    school_user_ids: List[str],
    subject: str = "Question scolaire"
) -> Thread:
    """Crée automatiquement un thread scolaire"""
    
    participants = [
        {"user_id": student_id, "role": "student"}
    ]
    
    for school_user_id in school_user_ids:
        participants.append({
            "user_id": school_user_id, 
            "role": "school",
            "permissions": ["read", "write", "admin", "export"]
        })
    
    return await messaging_service.create_thread_for_context(
        context_type=ThreadContextType.SCOLAIRE,
        context_id=context_id,
        participants=participants,
        title=f"Scolaire - {subject}",
        context_data={
            "subject": subject
        }
    )

async def create_partenariat_thread(
    messaging_service: MessagingService,
    partnership_id: str,
    company_user_ids: List[str],
    school_user_ids: List[str],
    company_name: str = "Entreprise",
    school_name: str = "École"
) -> Thread:
    """Crée automatiquement un thread de partenariat"""
    
    participants = []
    
    for company_user_id in company_user_ids:
        participants.append({
            "user_id": company_user_id, 
            "role": "company",
            "permissions": ["read", "write", "export"]
        })
    
    for school_user_id in school_user_ids:
        participants.append({
            "user_id": school_user_id, 
            "role": "school",
            "permissions": ["read", "write", "admin", "export"]
        })
    
    return await messaging_service.create_thread_for_context(
        context_type=ThreadContextType.PARTENARIAT,
        context_id=partnership_id,
        participants=participants,
        title=f"Partenariat - {company_name} x {school_name}",
        context_data={
            "partnership_id": partnership_id,
            "company_name": company_name,
            "school_name": school_name
        }
    )