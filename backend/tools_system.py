"""
ÉMÉRÉS Tools System - Architecture modulaire pour tous les outils premium
Gère les outils comme Coach IA, Focus Rooms, Cartes Mémoires, etc.
"""

import os
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from dotenv import load_dotenv
from llm_client import LlmChat, UserMessage, LLM_INTEGRATION_AVAILABLE
import uuid
import json
from bson import ObjectId

load_dotenv()

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================


def convert_objectid_to_str(obj):
    """Convert MongoDB ObjectId to string for JSON serialization"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: convert_objectid_to_str(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid_to_str(item) for item in obj]
    else:
        return obj


# ============================================================================
# MODÈLES DE DONNÉES
# ============================================================================


class ToolSession(BaseModel):
    session_id: str
    user_id: str
    tool_type: str  # "coach_ia", "focus_room", "cartes_memoires", etc.
    metadata: Dict[str, Any] = {}
    created_at: str
    updated_at: str
    is_active: bool = True


class ChatMessage(BaseModel):
    message_id: str
    session_id: str
    user_id: str
    role: str  # "user" ou "assistant"
    content: str
    timestamp: str
    metadata: Dict[str, Any] = {}


class ToolUsageStats(BaseModel):
    user_id: str
    tool_type: str
    total_sessions: int = 0
    total_messages: int = 0
    last_used: Optional[str] = None
    premium_features_used: List[str] = []


# ============================================================================
# SYSTÈME DE GESTION DES OUTILS
# ============================================================================


class EmereToolsManager:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.llm_key = os.getenv("OPENAI_API_KEY") or os.getenv("EMERGENT_LLM_KEY")

        # Configuration des outils disponibles
        self.available_tools = {
            "coach_ia": {
                "name": "Coach IA Études",
                "description": "Assistant IA pour l'apprentissage et la productivité",
                "premium_required": True,
                "pack_required": ["Learn+", "Premium"],
                "model": "gpt-4o",
                "provider": "openai",
            },
            "focus_room": {
                "name": "Focus Rooms Pro",
                "description": "Salles de concentration collaborative",
                "premium_required": True,
                "pack_required": ["Focus+", "Premium"],
                "features": ["collaborative", "soundscapes", "distraction_blocking"],
            },
            "cartes_memoires": {
                "name": "Cartes Mémoires Pro",
                "description": "Système de révision par cartes mémoire avec spaced repetition",
                "premium_required": True,
                "pack_required": ["Learn+", "Premium"],
                "features": ["spaced_repetition", "analytics", "custom_decks"],
            },
            "coach_flow": {
                "name": "Coach Flow IA",
                "description": "Assistant IA pour la productivité et le flow",
                "premium_required": True,
                "pack_required": ["Focus+", "Premium"],
                "model": "gpt-4o-mini",
                "provider": "openai",
            },
        }

    async def create_tool_session(
        self, user_id: str, tool_type: str, metadata: Optional[Dict] = None
    ) -> str:
        """Créer une nouvelle session d'outil pour un utilisateur"""
        session_id = str(uuid.uuid4())

        session_data = ToolSession(
            session_id=session_id,
            user_id=user_id,
            tool_type=tool_type,
            metadata=metadata or {},
            created_at=datetime.now(timezone.utc).isoformat(),
            updated_at=datetime.now(timezone.utc).isoformat(),
        )

        await self.db.tool_sessions.insert_one(session_data.dict())

        # Mettre à jour les stats utilisateur
        await self.update_user_stats(user_id, tool_type)

        return session_id

    async def get_user_sessions(self, user_id: str, tool_type: Optional[str] = None) -> List[Dict]:
        """Récupérer les sessions d'un utilisateur"""
        filter_query = {"user_id": user_id, "is_active": True}
        if tool_type:
            filter_query["tool_type"] = tool_type

        sessions = await self.db.tool_sessions.find(filter_query).to_list(length=50)
        return [convert_objectid_to_str(session) for session in sessions]

    async def update_user_stats(self, user_id: str, tool_type: str):
        """Mettre à jour les statistiques d'utilisation"""
        stats_filter = {"user_id": user_id, "tool_type": tool_type}

        existing_stats = await self.db.tool_usage_stats.find_one(stats_filter)

        if existing_stats:
            await self.db.tool_usage_stats.update_one(
                stats_filter,
                {
                    "$inc": {"total_sessions": 1},
                    "$set": {"last_used": datetime.now(timezone.utc).isoformat()},
                },
            )
        else:
            new_stats = ToolUsageStats(
                user_id=user_id,
                tool_type=tool_type,
                total_sessions=1,
                last_used=datetime.now(timezone.utc).isoformat(),
            )
            await self.db.tool_usage_stats.insert_one(new_stats.dict())

    async def check_tool_access(self, user_id: str, tool_type: str) -> Dict[str, Any]:
        """Vérifier si l'utilisateur a accès à un outil"""
        if tool_type not in self.available_tools:
            return {"has_access": False, "reason": "tool_not_found"}

        tool_config = self.available_tools[tool_type]

        # Pour l'instant, on considère que tous les utilisateurs connectés ont accès
        # TODO: Implémenter la vérification des abonnements premium

        user = await self.db.users.find_one({"id": user_id})
        if not user:
            return {"has_access": False, "reason": "user_not_found"}

        # Vérification des prérequis premium (simulation)
        if tool_config.get("premium_required", False):
            # TODO: Vérifier l'abonnement premium réel
            # Pour l'instant, on autorise tous les utilisateurs connectés
            pass

        return {"has_access": True, "tool_config": tool_config, "reason": "authorized"}


# ============================================================================
# COACH IA ÉTUDES - PREMIER OUTIL COMPLET
# ============================================================================


class CoachIAEtudes:
    def __init__(self, tools_manager: EmereToolsManager):
        self.tools_manager = tools_manager
        self.db = tools_manager.db
        self.llm_key = tools_manager.llm_key

        # Configuration spécialisée pour les étudiants français
        self.system_message = """Tu es le Coach IA Études d'ÉMÉRÉS, un assistant expert en apprentissage et productivité pour étudiants français.

PERSONNALITÉ ET STYLE:
- Bienveillant, motivant et empathique
- Adapté au système éducatif français (Licence, Master, écoles, etc.)
- Utilise un français naturel avec du tutoiement
- Concis mais détaillé quand nécessaire

EXPERTISES PRINCIPALES:
1. **Méthodes d'apprentissage**: Techniques de mémorisation, spaced repetition, mind mapping
2. **Productivité étudiante**: Gestion du temps, méthode Pomodoro, planning de révisions
3. **Orientation**: Choix de formations, conseils carrière adaptés au marché français
4. **Motivation**: Gestion du stress, procrastination, maintien de la motivation
5. **Révisions**: Stratégies d'examens, partiels, concours français

FONCTIONNALITÉS SPÉCIALES:
- Créer des plannings de révision personnalisés
- Expliquer des concepts complexes simplement
- Donner des conseils pratiques immédiatement applicables
- S'adapter au niveau et au domaine d'études de l'étudiant

IMPORTANT: Reste toujours dans ton rôle de coach bienveillant et expert."""

    async def create_chat_session(self, user_id: str, context: Optional[Dict] = None) -> str:
        """Créer une session de chat avec le Coach IA"""
        session_id = await self.tools_manager.create_tool_session(
            user_id=user_id,
            tool_type="coach_ia",
            metadata={
                "context": context or {},
                "model": "gpt-4o",
                "provider": "openai",
                "conversation_type": "coaching",
            },
        )

        return session_id

    async def send_message(self, session_id: str, user_id: str, message: str) -> Dict[str, Any]:
        """Envoyer un message au Coach IA et obtenir une réponse"""
        try:
            # Vérifier la session
            session = await self.db.tool_sessions.find_one(
                {
                    "session_id": session_id,
                    "user_id": user_id,
                    "tool_type": "coach_ia",
                    "is_active": True,
                }
            )

            if not session:
                return {"success": False, "error": "Session non trouvée ou invalide"}

            # Dégradation honnête : pas de LLM configuré → message clair, pas de
            # réponse simulée exposée à l'étudiant
            if not self.llm_key:
                return {
                    "success": False,
                    "error": "ai_unavailable",
                    "message": (
                        "L'IA conversationnelle n'est pas encore activée sur cette "
                        "installation. L'administrateur doit configurer la clé LLM "
                        "(variable OPENAI_API_KEY ou EMERGENT_LLM_KEY)."
                    ),
                }

            # Récupérer l'historique des messages
            chat_history = (
                await self.db.chat_messages.find({"session_id": session_id})
                .sort("timestamp", 1)
                .to_list(length=10)
            )

            # Initialiser le chat LLM
            chat = LlmChat(
                api_key=self.llm_key, session_id=session_id, system_message=self.system_message
            ).with_model(
                os.getenv("LLM_PROVIDER", "openai").strip().lower() or "openai",
                os.getenv("LLM_MODEL", "gpt-4o-mini"),
            )

            # Créer le message utilisateur
            user_message = UserMessage(text=message)

            # Envoyer le message et obtenir la réponse
            response = await chat.send_message(user_message)

            provider = os.getenv("LLM_PROVIDER", "openai").strip().lower() or "openai"
            model = os.getenv("LLM_MODEL", "gpt-4o-mini")

            # Enregistrer le message utilisateur
            user_msg_id = str(uuid.uuid4())
            user_chat_message = ChatMessage(
                message_id=user_msg_id,
                session_id=session_id,
                user_id=user_id,
                role="user",
                content=message,
                timestamp=datetime.now(timezone.utc).isoformat(),
            )
            await self.db.chat_messages.insert_one(user_chat_message.dict())

            # Enregistrer la réponse de l'IA
            ai_msg_id = str(uuid.uuid4())
            ai_chat_message = ChatMessage(
                message_id=ai_msg_id,
                session_id=session_id,
                user_id=user_id,
                role="assistant",
                content=response,
                timestamp=datetime.now(timezone.utc).isoformat(),
                metadata={"model": model, "provider": provider},
            )
            await self.db.chat_messages.insert_one(ai_chat_message.dict())

            # Mettre à jour les stats
            await self.db.tool_usage_stats.update_one(
                {"user_id": user_id, "tool_type": "coach_ia"},
                {"$inc": {"total_messages": 2}},  # +2 pour user et assistant
                upsert=True,
            )

            # Mettre à jour la session (avec compteur de consommation LLM)
            await self.db.tool_sessions.update_one(
                {"session_id": session_id},
                {
                    "$set": {"updated_at": datetime.now(timezone.utc).isoformat()},
                    "$inc": {"usage.llm_calls": 1},
                },
            )

            return {
                "success": True,
                "response": response,
                "message_id": ai_msg_id,
                "session_id": session_id,
                "timestamp": ai_chat_message.timestamp,
            }

        except Exception as e:
            print(f"Erreur dans send_message: {str(e)}")
            return {"success": False, "error": f"Erreur technique: {str(e)}"}

    async def get_chat_history(self, session_id: str, user_id: str) -> List[Dict]:
        """Récupérer l'historique d'une conversation"""
        # Vérifier que l'utilisateur a accès à cette session
        session = await self.db.tool_sessions.find_one(
            {"session_id": session_id, "user_id": user_id, "tool_type": "coach_ia"}
        )

        if not session:
            return []

        messages = (
            await self.db.chat_messages.find({"session_id": session_id})
            .sort("timestamp", 1)
            .to_list(length=100)
        )

        return [convert_objectid_to_str(message) for message in messages]

    async def get_user_coach_sessions(self, user_id: str) -> List[Dict]:
        """Récupérer toutes les sessions de coaching d'un utilisateur"""
        sessions = await self.tools_manager.get_user_sessions(user_id, "coach_ia")

        # Ajouter le dernier message de chaque session pour l'aperçu
        for session in sessions:
            last_message = await self.db.chat_messages.find_one(
                {"session_id": session["session_id"]}, sort=[("timestamp", -1)]
            )
            session["last_message"] = (
                convert_objectid_to_str(last_message) if last_message else None
            )

        return sessions
