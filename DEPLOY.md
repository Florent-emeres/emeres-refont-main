# Déploiement en ligne — Render + MongoDB Atlas

Guide pour mettre la plateforme en ligne pour les tests (~30 minutes, gratuit).

## Architecture

| Composant | Service | Coût |
|---|---|---|
| Backend FastAPI | Render (Docker, plan free) | 0 € |
| Frontend React | Render (site statique) | 0 € |
| MongoDB | Atlas M0 (512 Mo) | 0 € |

> Le plan free Render endort le backend après 15 min d'inactivité (~50 s au réveil).
> Pour une démo sans latence : passer le backend en plan paid (~7 $/mois), même configuration.

## Étape 1 — MongoDB Atlas

1. Connectez-vous sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. **Build a Database** → **M0 Free** → région Europe (Paris/Frankfurt) → Create
3. **Database Access** → **Add New Database User** :
   - Authentication : Password
   - Utilisateur : `emeres-app` , mot de passe fort (générez-le)
   - Role : **Read and write to any database**
4. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`)
   (Render utilise des IP sortantes dynamiques ; à restreindre plus tard si besoin)
5. **Database** → **Connect** → **Drivers** → copiez la chaîne SRV, elle ressemble à :
   ```
   mongodb+srv://emeres-app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Remplacez `<password>` par le mot de passe réel et ajoutez le nom de base :
   `...mongodb.net/emeres?retryWrites=true&w=majority`

## Étape 2 — Render (Blueprint)

1. Connectez-vous sur [dashboard.render.com](https://dashboard.render.com)
2. **New** → **Blueprint** → sélectionnez le repo `Florent-emeres/emeres-refont-main`
   (autorisez l'accès au repo si demandé — le fichier `render.yaml` est détecté automatiquement)
3. Renseignez les variables demandées :
   - `MONGO_URL` : la chaîne SRV Atlas de l'étape 1
   - `REACT_APP_BACKEND_URL` : laissez vide pour l'instant (étape 3)
   - `CORS_ORIGINS` / `FRONTEND_URL` : laissez vide pour l'instant (étape 4)
4. **Apply** — les deux services se déploient (5-10 min la première fois)

## Étape 3 — Brancher le frontend

1. Ouvrez le service **emeres-backend** : copiez son URL en haut de page
   (ex : `https://emeres-backend-a1b2.onrender.com`)
2. Ouvrez le service **emeres-frontend** → **Environment** → variable
   `REACT_APP_BACKEND_URL` → collez l'URL complète du backend (avec `https://`)
3. Sauvegardez : le frontend se redéploie automatiquement (le build CRA intègre
   l'URL au moment de la compilation)

## Étape 4 — Finaliser (recommandé)

Sur **emeres-backend** → **Environment**, définissez puis laissez redéployer :
- `CORS_ORIGINS` : l'URL du frontend (ex : `https://emeres-frontend-a1b2.onrender.com`)
- `FRONTEND_URL` : la même URL (liens des emails)

> `DEV_MODE=true` (actuel) désactive la confirmation email pour faciliter les tests.
> À passer à `false` avant toute mise en production réelle.

## Étape 5 — Peupler la plateforme (jeu pilote)

Depuis n'importe quelle machine avec Python 3 :

```bash
git clone https://github.com/Florent-emeres/emeres-refont-main
cd emeres-refont-main
pip install -r backend/requirements.txt
python3 backend/seed_pilot.py --base-url https://emeres-backend-xxxx.onrender.com
```

Comptes créés (mot de passe `Pilote!2024`) :
- École : `school@pilot.emeres.fr`
- Institution : `institution@pilot.emeres.fr`
- Entreprises : `company01@pilot.emeres.fr` … `company10@pilot.emeres.fr`
- Étudiants : `etudiant01@pilot.emeres.fr` … `etudiant50@pilot.emeres.fr`
- Mentors : `mentor1@pilot.emeres.fr` … `mentor5@pilot.emeres.fr`

Le seed est idempotent : le relancer ne duplique rien.

## Étape 6 — Activer l'IA conversationnelle (optionnel, ~2 $/mois)

Sans cette étape, la plateforme fonctionne en mode local déterministe (matching,
CV evaluator et feedback d'entretien calculés localement ; Émé guide sans LLM).

Sur **emeres-backend** → **Environment**, définissez puis laissez redéployer :

| Variable | Valeur | Rôle |
|---|---|---|
| `LLM_PROVIDER` | `openai` | active le relais LLM (au lieu de `stub`) |
| `OPENAI_API_KEY` | votre clé Mistral | authentification (compatible API OpenAI) |
| `OPENAI_BASE_URL` | `https://api.mistral.ai/v1` | pointe vers Mistral plutôt qu'OpenAI |
| `LLM_MODEL` | `mistral-small-latest` | modèle économique (~0,10 $/M tokens) |

Vérification : `GET /api/ai/status` (avec un token) → `{"llm_available": true, "mode": "llm"}`.
Émé et le Coach IA Études basculent automatiquement en mode LLM ; le scoring local
(matching, CV, entretien) reste gratuit et inchangé.

Coût estimé : ~1,5–3 $/mois pour 50 étudiants actifs, ~30 $/mois pour 1 000
(rate limiting 10 req/min/utilisateur sur la génération de lettres, historique
du coach plafonné, compteur `usage.llm_calls` par session).

## Variante — Frontend sur Vercel (optionnel)

Le frontend React peut être hébergé sur Vercel au lieu du site statique Render.
**Le backend FastAPI reste sur Render** : Vercel est serverless et ne peut pas
exécuter le backend Docker (websockets, MongoDB, process longue durée).

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → importez le repo
2. **Root Directory** : `frontend` (Vercel détecte Create React App automatiquement)
3. **Environment Variables** : `REACT_APP_BACKEND_URL` = URL complète du backend Render
4. **Deploy** — le routage SPA est déjà géré par `frontend/vercel.json`
5. Sur le backend Render, mettez `CORS_ORIGINS` et `FRONTEND_URL` à l'URL Vercel
   (ex : `https://emeres.vercel.app`), puis laissez redéployer

> Chaque push sur `main` redéploie automatiquement le frontend sur Vercel.

## Vérifier

1. Backend : ouvrez `https://emeres-backend-xxxx.onrender.com/health` → `{"status": "ok"}`
2. Frontend : ouvrez l'URL du site statique → page d'accueil Émérés
3. Connexion : `school@pilot.emeres.fr` / `Pilote!2024` → dashboard école avec données réelles

## Sécurité — avant une vraie mise en production

- `SECRET_KEY` : généré automatiquement par le Blueprint (ne pas réutiliser ailleurs)
- `CORS_ORIGINS` : restreindre au domaine du frontend (fait à l'étape 4)
- `DEV_MODE=false` + configurer l'envoi d'emails réel
- Atlas : restreindre si possible les IP, activer les sauvegardes
- Ajouter un domaine personnalisé et HTTPS (automatique sur Render)
