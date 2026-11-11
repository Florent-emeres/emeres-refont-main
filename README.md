# Émérés — Plateforme d'insertion professionnelle

Plateforme SaaS à l'intersection de l'EdTech et des RH : mise en relation entre étudiants, entreprises, établissements scolaires, mentors et institutions.

## Stack

- **Backend** : FastAPI (Python 3.12), MongoDB (Motor), JWT, Prometheus/OTel
- **Frontend** : React 19 (CRA + craco), Tailwind CSS, Radix UI, React Router 7
- **IA** : client LLM intégré (`llm_client.py`) avec modes `stub` (sans clé), `openai`, `ollama`

## Démarrage rapide (Docker)

```bash
cp .env.example .env       # ajustez les valeurs si besoin
docker compose up --build
```

- Frontend : http://localhost:3000
- API : http://localhost:8001 (docs Swagger : http://localhost:8001/docs)

## Démarrage en développement (sans Docker)

1. **MongoDB** : lancez une instance locale (`mongod --dbpath <dossier>`) et notez l'URL.
2. **Backend** :

```bash
cd backend
pip install -r requirements.txt
export MONGO_URL="mongodb://127.0.0.1:27017"
export DB_NAME="emeres"
export SECRET_KEY="dev-secret"
export DEV_MODE=true
uvicorn server:app --host 127.0.0.1 --port 8001
```

3. **Frontend** :

```bash
cd frontend
npm ci
REACT_APP_BACKEND_URL=http://127.0.0.1:8001 npm start
```

## Variables d'environnement principales

| Variable | Rôle | Défaut |
|---|---|---|
| `MONGO_URL` | URL MongoDB (backend) | — (obligatoire) |
| `DB_NAME` | Nom de la base | — (obligatoire) |
| `SECRET_KEY` | Signature JWT | valeur de dev |
| `DEV_MODE` | Mode développement | `true` |
| `LLM_PROVIDER` | `stub` / `openai` / `ollama` | `stub` |
| `REACT_APP_BACKEND_URL` | URL de l'API pour le frontend | — |

Voir `.env.example` pour la liste complète.

## Rôles et modules

- **Étudiants** : profil 7 sections, recherche d'offres, matching IA, portfolio, CV/lettres générés, journal de stage, simulateur d'entretien
- **Entreprises** : inscription avec vérification SIRET/VAT, offres, pipeline de candidatures, dashboard
- **Écoles** : suivi des étudiants, conformité, dashboard dédié
- **Mentors** : demandes de mentorat, sessions, objectifs, évaluations
- **Institutions** : cohortes, analytics d'insertion
- **Transverse** : messagerie, calendrier, crédits, modules premium, coach IA

## Données du pilote (seed)

Pour alimenter la plateforme avec un jeu de données réaliste (1 école, 1 institution, 10 entreprises, 50 étudiants, 5 mentors, offres/candidatures/sessions/évaluations) :

```bash
cd backend
python3 seed_pilot.py --base-url http://127.0.0.1:8001
```

Le script est idempotent (aucun effet si le pilote existe déjà) et passe par l'API publique. Comptes sur le domaine `pilot.emeres.fr`, mot de passe commun `Pilote!2024` — à changer avant toute mise en production.

## Tests et qualité

```bash
pytest -q                 # tests backend
ruff check .              # lint
black --check .           # format
cd frontend && npm ci && npm run build   # build frontend
```

La CI (GitHub Actions) exécute lint, format, mypy et pytest à chaque push.
