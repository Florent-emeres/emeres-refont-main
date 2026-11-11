"""
Script de seed pour le pilote Émérés.

Crée un jeu de données réaliste via l'API publique (aucun accès direct à la base) :
  - 1 établissement scolaire (school)
  - 1 institution territoriale
  - 10 entreprises avec des offres actives
  - 50 étudiants (rattachés, déclarés institution, ou indépendants)
  - 5 mentors avec relations, sessions, objectifs et évaluations réels

Usage :
    python3 seed_pilot.py                       # seed si absent (idempotent)
    python3 seed_pilot.py --base-url http://127.0.0.1:8001

Tous les comptes utilisent le domaine pilot.emeres.fr et le mot de passe
Pilote!2024 (à changer avant toute mise en production).
"""

import argparse
import json
import random
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:8001/api"
DOMAIN = "pilot.emeres.fr"
PASSWORD = "Pilote!2024"

random.seed(2025)

SECTORS = ["Tech", "Santé", "Finance", "Industrie", "Commerce", "Conseil"]
SKILLS = [
    "Python",
    "JavaScript",
    "React",
    "SQL",
    "Excel",
    "Communication",
    "Marketing digital",
    "Gestion de projet",
    "Data analysis",
    "Figma",
]
FIELDS = [
    "Informatique",
    "Marketing",
    "Gestion",
    "Data",
    "Design",
    "Commerce international",
    "Ressources humaines",
]
OFFER_TITLES = [
    "Stage développement web",
    "Stage marketing digital",
    "Stage data analyst",
    "Stage gestion de projet",
    "Stage design UX/UI",
    "Stage ressources humaines",
    "Stage conseil",
    "Stage commerce international",
]
COMPANY_NAMES = [
    "Nexa Tech",
    "MediSanté",
    "Finéa Conseil",
    "IndustrIA",
    "Comptoir Duval",
    "Vertigo Studio",
    "LogiTrans",
    "Bâtir Plus",
    "AgroNouveau",
    "Optima Services",
]

MENTOR_PROFILES = [
    ("Sophie", "Bernard", "Nexa Tech", "Lead Developer", ["Développement Web", "Python", "React"]),
    ("Karim", "Haddad", "Finéa Conseil", "Manager", ["Gestion de projet", "Finance", "Excel"]),
    (
        "Marie",
        "Dubois",
        "MediSanté",
        "Responsable RH",
        ["Ressources humaines", "Communication", "Recrutement"],
    ),
    ("Thomas", "Petit", "Vertigo Studio", "Directeur artistique", ["Design", "Figma", "UX"]),
    ("Nadia", "Benali", "LogiTrans", "Data Manager", ["Data analysis", "SQL", "Python"]),
]


def req(method, path, token=None, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(BASE + path, data=data, method=method)
    r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, raw[:300].decode(errors="replace")


def register(role, first_name, last_name, email):
    status, data = req(
        "POST",
        "/auth/register",
        body={
            "email": email,
            "password": PASSWORD,
            "role": role,
            "first_name": first_name,
            "last_name": last_name,
        },
    )
    if status not in (200, 201):
        raise RuntimeError(f"register {email}: {status} {data}")
    token = data.get("access_token") or data.get("token")
    status, me = req("GET", "/auth/me", token=token)
    user_id = me.get("id") if status == 200 else None
    return token, user_id


def login(email):
    status, data = req("POST", "/auth/login", body={"email": email, "password": PASSWORD})
    return (data.get("access_token") or data.get("token")) if status == 200 else None


def main():
    global BASE
    parser = argparse.ArgumentParser(description="Seed pilote Émérés")
    parser.add_argument("--base-url", default="http://127.0.0.1:8001")
    args = parser.parse_args()
    BASE = args.base_url.rstrip("/") + "/api"

    if login(f"school@{DOMAIN}"):
        print(f"Pilote déjà présent ({DOMAIN}). Rien à faire.")
        return

    counts = {
        "offers": 0,
        "applications": 0,
        "accepted": 0,
        "relations": 0,
        "sessions": 0,
        "objectives": 0,
        "objectives_completed": 0,
        "evaluations": 0,
    }

    # 1. Établissement scolaire
    school_token, school_id = register("school", "Claire", "Moreau", f"school@{DOMAIN}")
    status, _ = req(
        "PUT",
        "/school/profile",
        token=school_token,
        body={
            "school_name": "Lycée Pilote Émérés",
            "description": "Établissement pilote du déploiement Émérés",
            "city": "Lyon",
            "institution_type": "Lycée",
        },
    )
    print(f"école: {school_id} (profil {status})")

    # 2. Institution territoriale
    inst_token, inst_id = register("institution", "Marc", "Lefèvre", f"institution@{DOMAIN}")
    status, _ = req(
        "PUT",
        "/institution/profile",
        token=inst_token,
        body={
            "institution_name": "Conseil Régional Pilote",
            "description": "Institution pilote — mesure d'impact territorial",
            "region": "Pilote",
        },
    )
    print(f"institution: {inst_id} (profil {status})")

    # 3. Entreprises + offres
    company_tokens = []
    for i, name in enumerate(COMPANY_NAMES, 1):
        token, _ = register("company", "Contact", name.split()[0], f"company{i:02d}@{DOMAIN}")
        company_tokens.append(token)
        for _ in range(random.randint(2, 3)):
            title = random.choice(OFFER_TITLES)
            status, offer = req(
                "POST",
                "/offers",
                token=token,
                body={
                    "title": f"{title} — {name}",
                    "description": f"Mission de {title.lower()} chez {name}.",
                    "skills_required": random.sample(SKILLS, k=3),
                    "location": random.choice(["Paris", "Lyon", "Bordeaux", "Nantes", "Lille"]),
                    "duration": random.choice(["2 mois", "3 mois", "6 mois"]),
                    "offer_type": "stage",
                    "status": "active",
                },
            )
            if status == 200:
                counts["offers"] += 1
    print(f"entreprises: {len(company_tokens)}, offres: {counts['offers']}")

    # 4. Étudiants : 30 rattachés école, 10 déclarés institution, 10 indépendants
    student_ids = []
    offer_ids = []
    for token in company_tokens:
        status, offers = req("GET", "/offers/my", token=token)
        if status == 200:
            offers = offers if isinstance(offers, list) else offers.get("offers", [])
            offer_ids += [o["id"] for o in offers if o.get("status") == "active"]
    offer_ids = list(dict.fromkeys(offer_ids))

    for i in range(1, 51):
        email = f"etudiant{i:02d}@{DOMAIN}"
        token, user_id = register("student", "Etudiant", f"Numero{i:02d}", email)
        student_ids.append(user_id)

        if i <= 30:
            status, _ = req("POST", f"/school/students/{user_id}/attach", token=school_token)
        status, profile = req("GET", "/profile/student", token=token)
        if status == 200:
            profile["email"] = email
            profile["birth_date"] = "2002-05-20"
            profile["phone"] = f"+336{i:08d}"
            profile["field_of_study"] = random.choice(FIELDS)
            profile["main_skills"] = random.sample(SKILLS, k=3)
            if 10 < i <= 40:
                profile["institution_name"] = "Conseil Régional Pilote"
            status, _ = req("PUT", "/profile/student", token=token, body=profile)

        for offer_id in random.sample(offer_ids, k=min(len(offer_ids), random.randint(2, 4))):
            status, app = req(
                "POST",
                "/applications",
                token=token,
                body={
                    "offer_id": offer_id,
                    "cover_letter": "Candidature générée par le seed pilote.",
                },
            )
            if status == 200:
                counts["applications"] += 1
    print(f"étudiants: {len(student_ids)}, candidatures: {counts['applications']}")

    # 5. Les entreprises font évoluer les candidatures
    for token in company_tokens:
        status, apps = req("GET", "/applications/company", token=token)
        if status != 200:
            continue
        for app in apps if isinstance(apps, list) else []:
            roll = random.random()
            if roll < 0.35:
                new_status = "accepted"
            elif roll < 0.65:
                new_status = "reviewing"
            elif roll < 0.85:
                new_status = "rejected"
            else:
                continue
            status2, _ = req(
                "PUT",
                f"/applications/{app['id']}/status",
                token=token,
                body={"status": new_status, "feedback": "Seed pilote"},
            )
            if status2 == 200 and new_status == "accepted":
                counts["accepted"] += 1
    print(f"candidatures acceptées: {counts['accepted']}")

    # 6. Partenariats école ↔ entreprises
    for i, _token in enumerate(company_tokens[:6]):
        status, _ = req(
            "POST",
            "/school/partnerships",
            token=school_token,
            body={
                "company_name": COMPANY_NAMES[i],
                "sector": SECTORS[i % len(SECTORS)],
                "partnership_type": "stage",
                "status": "active",
                "description": "Partenariat pilote Émérés",
            },
        )
    print("partenariats école: 6")

    # 7. Mentors : relations, sessions, objectifs, évaluations
    for i, (first, last, company, position, specializations) in enumerate(MENTOR_PROFILES, 1):
        token, mentor_id = register("mentor", first, last, f"mentor{i}@{DOMAIN}")
        status, _ = req(
            "PUT",
            "/mentor/profile",
            token=token,
            body={
                "company": company,
                "position": position,
                "specializations": specializations,
                "experience_years": random.randint(6, 15),
                "bio": f"{first} {last}, {position} chez {company}.",
                "availability_hours_per_week": random.randint(2, 6),
            },
        )
        mentees = random.sample(student_ids, k=random.randint(4, 8))
        for student_id in mentees:
            status, rel = req(
                "POST",
                "/mentor/students",
                token=token,
                body={
                    "student_id": student_id,
                    "program_type": random.choice(["Mentorat insertion", "Mentorat académique"]),
                    "start_date": "2025-01-15",
                },
            )
            if status != 200:
                continue
            counts["relations"] += 1
            for s in range(random.randint(1, 3)):
                status, sess = req(
                    "POST",
                    "/mentor/sessions",
                    token=token,
                    body={
                        "student_id": student_id,
                        "title": f"Session {s + 1}",
                        "scheduled_start": "2025-02-10T10:00:00Z",
                        "scheduled_end": "2025-02-10T11:00:00Z",
                    },
                )
                if status != 200:
                    continue
                req("PUT", f"/mentor/sessions/{sess['id']}/checkin", token=token)
                status3, _ = req(
                    "PUT",
                    f"/mentor/sessions/{sess['id']}/checkout",
                    token=token,
                    body={"notes": "Session pilote"},
                )
                if status3 == 200:
                    counts["sessions"] += 1
            for o in range(random.randint(1, 2)):
                status, obj = req(
                    "POST",
                    f"/mentor/students/{student_id}/objectives",
                    token=token,
                    body={
                        "title": f"Objectif pilote {o + 1}",
                        "description": "Objectif du seed pilote",
                        "specific": "spécifique",
                        "measurable": "mesurable",
                        "achievable": "réaliste",
                        "relevant": "pertinent",
                        "time_bound": "avant fin de parcours",
                        "due_date": "2025-06-30T00:00:00Z",
                    },
                )
                if status == 200:
                    counts["objectives"] += 1
                    if random.random() < 0.5:
                        status2, _ = req(
                            "PUT",
                            f"/mentor/objectives/{obj['id']}",
                            token=token,
                            body={"status": "completed", "progress_percentage": 100},
                        )
                        if status2 == 200:
                            counts["objectives_completed"] += 1
            if random.random() < 0.7:
                status, _ = req(
                    "POST",
                    f"/mentor/students/{student_id}/evaluations",
                    token=token,
                    body={
                        "student_id": student_id,
                        "evaluation_period": "monthly",
                        "period_start": "2025-02-01T00:00:00Z",
                        "period_end": "2025-02-28T00:00:00Z",
                        "autonomy_score": round(random.uniform(3, 5), 1),
                        "communication_score": round(random.uniform(3, 5), 1),
                        "quality_score": round(random.uniform(3, 5), 1),
                        "progression_score": round(random.uniform(3, 5), 1),
                    },
                )
                if status == 200:
                    counts["evaluations"] += 1
    print(
        f"mentors: {len(MENTOR_PROFILES)}, relations: {counts['relations']}, "
        f"sessions: {counts['sessions']}, objectifs: {counts['objectives']} "
        f"({counts['objectives_completed']} complétés), "
        f"évaluations: {counts['evaluations']}"
    )

    print(
        "\nSeed pilote terminé. Comptes sur "
        f"{DOMAIN} — mot de passe commun (à changer en production)."
    )


if __name__ == "__main__":
    main()
