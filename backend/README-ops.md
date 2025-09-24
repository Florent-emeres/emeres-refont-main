# ÉMÉRÉS – Operations Guid## Variables d'environnement clés
- `USE_V2_ONLY=true` : force les routes legacy à répondre 410.
- `MONGO_URL` / `DB_NAME` : cible MongoDB.
- `MESSAGING_ENCRYPTION_KEY` : clé Fernet persistante pour les messages.
- `HTTP_TIMEOUT`, `HTTP_RETRIES` : timeouts/retries pour les clients HTTP.
- `RL_WINDOW_SEC`, `RL_MAX_REQ` : configuration du middleware de rate limiting.
- `OTEL_EXPORTER_OTLP_ENDPOINT` : envoi des traces vers un collecteur OTLP.

### Secrets & config
- `REQUIRE_MESSAGING_KEY=true` en prod → clé obligatoire, pas de fallback.
- `USE_V2_ONLY=true` → legacy 410 Gone.
- `REQUIRE_JOBSEEKER_TRUE` → active des contrôles/contexte supplémentaires pour l'agent jobseeker si votre hub le supporte. Prérequis
- Python 3.11+
- MongoDB (Atlas ou cluster interne)
- Variables d’environnement définies (voir `.env.production.example`).

## Installation locale
```bash
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scriptsctivate
pip install -r backend/requirements.txt
```

## Tests & lint
```bash
pytest -q
ruff check backend
bandit -q -r backend -x tests
```

## Lancement API
```bash
uvicorn app.main:app --reload
```

## Variables d’environnement clés
- `USE_V2_ONLY=true` : force les routes legacy à répondre 410.
- `MONGO_URL` / `DB_NAME` : cible MongoDB.
- `MESSAGING_ENCRYPTION_KEY` : clé Fernet persistante pour les messages.
- `HTTP_TIMEOUT`, `HTTP_RETRIES` : timeouts/retries pour les clients HTTP.
- `RL_WINDOW_SEC`, `RL_MAX_REQ` : configuration du middleware de rate limiting.
- `OTEL_EXPORTER_OTLP_ENDPOINT` : envoi des traces vers un collecteur OTLP.

## Indexes Mongo
Les indexes sont créés automatiquement au démarrage via `ensure_indexes()`.

## Pipeline CI
Voir `.github/workflows/ci.yml` (lint, sécurité, tests, couverture).
