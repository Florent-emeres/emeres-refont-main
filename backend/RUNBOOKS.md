# ÉMÉRÉS – Runbooks

## Incident : MongoDB indisponible
- **Symptômes** : erreurs 500 sur routes /threads, logs `ServerSelectionTimeoutError`.
- **Check** : ping cluster Mongo, vérifier credentials.
- **Actions** : basculer sur réplique ou restaurer service ; relancer backend après rétablissement.

## Incident : Clé de chiffrement absente
- **Symptômes** : démarrage échoue dans `crypto_service`.
- **Actions** : restaurer la clé Fernet persistante (`MESSAGING_ENCRYPTION_KEY`).
  - Si perdue : récupérer depuis coffre-fort ou forcer régénération et re-chiffrer les messages existants.

## Incident : LLM / API externes lentes
- **Symptômes** : timeouts HTTP, retries multiples.
- **Actions** : vérifier connectivité, ajuster `HTTP_TIMEOUT` / `HTTP_RETRIES`, désactiver temporairement l’appel externe si nécessaire.

## Incident : 429 Rate Limit
- **Symptômes** : clients reçoivent 429.
- **Actions** : augmenter `RL_MAX_REQ` / `RL_WINDOW_SEC`, ou déployer rate limiting distribué (Redis + fastapi-limiter).

## Incident : OTLP collecteur indisponible
- **Symptômes** : logs d’erreur OpenTelemetry.
- **Actions** : désactiver `OTEL_EXPORTER_OTLP_ENDPOINT` ou rediriger vers collecteur actif.
