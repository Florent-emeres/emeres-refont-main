"""
Script d'initialisation des données de messagerie pour tests
Crée des threads et messages de démonstration
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid
import os
from messaging_system import MessagingService, create_messaging_service

async def init_messaging_data():
    """Initialise les données de test pour la messagerie"""
    
    # Connexion MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client.emeres_db
    
    # Service de messagerie
    messaging_service = create_messaging_service(db)
    
    print("🚀 Initialisation des données de messagerie...")
    
    # Nettoyer les collections existantes
    await db.threads.delete_many({})
    await db.messages.delete_many({})
    await db.audit_logs.delete_many({})
    print("✅ Collections nettoyées")
    
    # IDs des utilisateurs (supposés existants)
    student_id = "student-001"
    mentor_id = "mentor-001" 
    company_id = "company-001"
    school_id = "school-001"
    
    # 1. THREAD CANDIDATURE
    print("📝 Création thread candidature...")
    candidature_thread = await messaging_service.create_thread_for_context(
        context_type="candidature",
        context_id="candidature-frontend-001",
        participants=[
            {"user_id": student_id, "role": "student", "permissions": ["read", "write"]},
            {"user_id": company_id, "role": "company", "permissions": ["read", "write", "export"]}
        ],
        title="Candidature - Stage Développeur Frontend",
        created_by=student_id,
        context_data={
            "position": "Stage Développeur Frontend",
            "company_name": "TechCorp Innovation",
            "application_date": "2024-01-15",
            "status": "en_cours"
        }
    )
    
    # Messages pour candidature
    await messaging_service.send_message(
        thread_id=candidature_thread.id,
        sender_id=student_id,
        sender_role="student", 
        sender_name="Marie Dubois",
        body="Bonjour,\n\nJe vous adresse ma candidature pour le poste de stagiaire développeur frontend au sein de votre équipe. Passionnée par les technologies web modernes, j'aimerais mettre mes compétences en React et TypeScript au service de vos projets innovants.\n\nPourrions-nous planifier un entretien pour discuter de cette opportunité ?\n\nCordialement,\nMarie Dubois"
    )
    
    await messaging_service.send_message(
        thread_id=candidature_thread.id,
        sender_id=company_id,
        sender_role="company",
        sender_name="Thomas Martin - RH",
        body="Bonjour Marie,\n\nNous avons bien reçu votre candidature qui nous intéresse beaucoup. Votre profil correspond parfaitement à nos attentes pour notre équipe frontend.\n\nSeriez-vous disponible mardi prochain à 14h pour un entretien vidéo ? Nous pourrons ainsi discuter plus en détail du stage et de nos projets en cours.\n\nCordialement,\nThomas Martin\nResponsable RH - TechCorp Innovation"
    )
    
    await messaging_service.send_message(
        thread_id=candidature_thread.id,
        sender_id=student_id,
        sender_role="student",
        sender_name="Marie Dubois", 
        body="Parfait ! Je suis disponible mardi à 14h. Faut-il que je prépare quelque chose de spécifique pour l'entretien ?"
    )
    
    # 2. THREAD MENTORAT
    print("👨‍🏫 Création thread mentorat...")
    mentorat_thread = await messaging_service.create_thread_for_context(
        context_type="mentorat",
        context_id="mentorat-marie-001",
        participants=[
            {"user_id": student_id, "role": "student", "permissions": ["read", "write"]},
            {"user_id": mentor_id, "role": "mentor", "permissions": ["read", "write", "export"]}
        ],
        title="Mentorat - Marie Dubois",
        created_by=student_id,
        context_data={
            "student_name": "Marie Dubois",
            "mentor_name": "Jean Dupont",
            "speciality": "Développement Frontend",
            "start_date": "2024-01-10"
        }
    )
    
    await messaging_service.send_message(
        thread_id=mentorat_thread.id,
        sender_id=mentor_id,
        sender_role="mentor",
        sender_name="Jean Dupont - Mentor",
        body="Salut Marie ! 👋\n\nJe suis ravi de t'accompagner dans ton parcours de développeuse frontend. Pour bien commencer, j'aimerais connaître tes objectifs principaux pour les 3 prochains mois.\n\nQuelles technologies aimerais-tu approfondir ? As-tu des projets personnels en cours ?\n\nÀ bientôt pour notre premier call !"
    )
    
    await messaging_service.send_message(
        thread_id=mentorat_thread.id,
        sender_id=student_id,
        sender_role="student",
        sender_name="Marie Dubois",
        body="Salut Jean ! Merci beaucoup pour ton accompagnement 🙏\n\nMes objectifs :\n- Maîtriser React avec TypeScript\n- Apprendre les tests unitaires (Jest/Testing Library) \n- Comprendre les architectures frontend scalables\n\nJ'ai un projet perso d'app de gestion de tâches en cours, on pourrait peut-être l'utiliser comme support ?\n\nHâte de commencer !"
    )
    
    # 3. THREAD SCOLAIRE  
    print("🎓 Création thread scolaire...")
    scolaire_thread = await messaging_service.create_thread_for_context(
        context_type="scolaire",
        context_id="scolaire-marie-001",
        participants=[
            {"user_id": student_id, "role": "student", "permissions": ["read", "write"]},
            {"user_id": school_id, "role": "school", "permissions": ["read", "write", "admin", "export"]}
        ],
        title="Scolaire - Questions pédagogiques",
        created_by=student_id,
        context_data={
            "subject": "Questions pédagogiques",
            "student_class": "Master 2 Informatique",
            "academic_year": "2023-2024"
        }
    )
    
    await messaging_service.send_message(
        thread_id=scolaire_thread.id,
        sender_id=student_id,
        sender_role="student",
        sender_name="Marie Dubois",
        body="Bonjour,\n\nJ'ai une question concernant la validation de mon stage. Dois-je rendre un rapport écrit en plus de la soutenance orale ?\n\nAussi, y a-t-il des critères spécifiques pour l'évaluation du maître de stage ?\n\nMerci d'avance pour vos précisions.\n\nCordialement,\nMarie"
    )
    
    await messaging_service.send_message(
        thread_id=scolaire_thread.id,
        sender_id=school_id,
        sender_role="school",
        sender_name="Sophie Leclerc - Administration",
        body="Bonjour Marie,\n\nEffectivement, vous devez rendre :\n1. Un rapport de stage de 20-30 pages\n2. Préparer une soutenance de 20 minutes\n\nL'évaluation du maître de stage se fait via une grille d'évaluation que nous lui envoyons directement. Elle porte sur vos compétences techniques et relationnelles.\n\nLe rapport doit être rendu au plus tard 15 jours avant la soutenance.\n\nCordialement,\nSophie Leclerc"
    )
    
    # 4. THREAD SUPPORT
    print("🎧 Création thread support...")
    support_thread = await messaging_service.create_thread_for_context(
        context_type="support",
        context_id="support-001",
        participants=[
            {"user_id": student_id, "role": "student", "permissions": ["read", "write"]},
            {"user_id": "support-001", "role": "support", "permissions": ["read", "write", "admin"]}
        ],
        title="Support - Problème de connexion",
        created_by=student_id,
        context_data={
            "category": "Technique",
            "priority": "normal"
        }
    )
    
    await messaging_service.send_message(
        thread_id=support_thread.id,
        sender_id=student_id,
        sender_role="student", 
        sender_name="Marie Dubois",
        body="Bonjour l'équipe support,\n\nJ'ai des difficultés à accéder à certaines sections de mon tableau de bord. La page se charge mais reste blanche.\n\nPouvez-vous m'aider ?\n\nMarie"
    )
    
    await messaging_service.send_message(
        thread_id=support_thread.id,
        sender_id="support-001",
        sender_role="support",
        sender_name="Équipe Support ÉMÉRÉS",
        body="Bonjour Marie,\n\nMerci pour votre retour. Ce problème peut venir du cache de votre navigateur.\n\nPouvez-vous essayer :\n1. Ctrl+F5 pour forcer le rechargement\n2. Vider le cache de votre navigateur\n3. Essayer en navigation privée\n\nTenez-nous au courant !\n\nÉquipe Support"
    )
    
    # Statistiques finales
    threads_count = await db.threads.count_documents({})
    messages_count = await db.messages.count_documents({})
    
    print(f"\n🎉 Initialisation terminée !")
    print(f"📊 Créé : {threads_count} threads, {messages_count} messages")
    print(f"📝 Contextes : candidature, mentorat, scolaire, support")
    print(f"👥 Participants : étudiant, mentor, entreprise, école, support")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(init_messaging_data())