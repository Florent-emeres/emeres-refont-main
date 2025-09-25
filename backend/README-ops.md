

## Sécurité outils (Pass 9)

Cette section décrit la politique de blocage des outils (forbidden tools) appliquée par le middleware d’exécution (`backend/app/middleware/tool_execution.py`) et le guard (`backend/app/policy/forbidden_tools_guard.py`).

### Ce que couvre la politique
- Interdits directs & alias : un appel est bloqué si le nom de l’outil ou son alias est listé comme interdit.
- Appels imbriqués : blocage si un outil interdit apparaît dans la pile d’ancêtres (ex: `["web.run", "file_search"]`).
- Contexte async : tout appel marqué `context="async"` est refusé.
- Prompts multi-lignes : blocage si le prompt contient des retours à la ligne et mentionne un outil interdit.

### Configuration (ENV)
Deux variables suffisent (JSON) :

```bash
# Liste d’outils interdits (noms normalisés)
export FORBIDDEN_TOOLS='["web.run","unsafe_tool"]'

# Aliases → nom réel (case-insensitive)
export TOOL_ALIASES='{"internet":"web.run","browse":"web.run"}'
```

Si les variables sont absentes ou invalides, un fallback minimal est appliqué (`{"web.run"}`).

### Middleware
Utiliser `execute_tool(...)` pour toute exécution d’outil :

```python
from backend.app.middleware.tool_execution import execute_tool
from backend.app.policy.forbidden_tools_guard import ToolCall


def some_tool(**kw): ...


call = ToolCall(name="internet", display_name="Web", context="sync", prompt="...")

execute_tool(
  some_tool,
  call=call,
  ancestry=["file_search"],      # pile d’outils appelants (facultatif)
  request_id="req-abc123",       # pour corrélation logs
  user_id="user-42",
  # ...kwargs passés à some_tool
)
```

### Logs structurés (JSON)
Tout blocage émet un log WARN JSON via `build_forbidden_tool_log` :

```json
{
  "ts": "2025-09-25T09:12:34.567+00:00",
  "level": "WARN",
  "event": "forbidden_tool_blocked",
  "request_id": "req-abc123",
  "user_id": "user-42",
  "reason": "alias_or_direct_forbidden",
  "tool_call": {
    "name": "internet",
    "display_name": "Web",
    "parent": null,
    "context": "sync",
    "prompt_excerpt": "utilise web.run\n..."
  }
}
```

Reasons possibles :
- `alias_or_direct_forbidden`
- `nested`
- `async_context`
- `multiline_prompt`

**Activer les logs**

```bash
export LOG_LEVEL=WARNING   # selon ta config logging
pytest -q -s               # pour voir les logs en local
```

### Tests
Des tests existent dans `tests/test_ai_v2_forbidden_tools.py` (Pass 9) :
- `test_aliases_blocked`
- `test_nested_calls_blocked`
- `test_async_context_blocked`
- `test_multiline_prompt_blocked`

Lancer uniquement ces cas :

```bash
pytest -q tests/test_ai_v2_forbidden_tools.py -k "aliases or nested or async or multiline" -s
```

### Troubleshooting
- **Rien ne se bloque alors que j’ai configuré les ENV** : vérifie que le process est relancé après export (les ENV sont lus au module import). Dans les tests, penser à reload :
  ```python
  import importlib
  from backend.app.middleware import tool_execution as te
  importlib.reload(te)
  ```
- **JSON invalide dans FORBIDDEN_TOOLS / TOOL_ALIASES** : le middleware tombe en mode fallback. Corrige le JSON (guillemets, virgules).
- **Je veux tracer la pile complète** : passe `ancestry=[...]` avec tous les parents connus ; tout nom matchant un interdit déclenche `reason="nested"`.

### Definition of Done (Pass 9)
- Blocages actifs pour alias, imbriqués, async, prompts multi-lignes.
- Logs WARN JSON avec `event=forbidden_tool_blocked` + `reason`.
- README-ops (cette section) à jour.


## Observabilité (Pass 10)

### Logging JSON
- Config via `backend/app/observability/logging_config.py::setup_logging(json_output=True, level="INFO")`.
- Root logger émet un JSON `{ts, level, logger, event, msg, request_id, user_id, ...}`.
- Les erreurs d’outils sont loggées avec `event="tool_execution_error"` par `timed_execute_tool`.

### Métriques in-memory
- Registry léger (`backend/app/observability/metrics.py`).
- Exposition via `REGISTRY.export()` ou endpoint FastAPI `/metrics` (`backend/app/http/metrics_endpoint.py`).
- Compteurs principaux :
  - `tool_success{<tool_name>}` : exécution réussie.
  - `tool_error{<tool_name>}` : exception Python levée.
  - `tool_blocked{<tool_name>}` : bloqué par le guard (alias, async, nested, prompt).
- Latences : histogramme par outil (`tool.<tool>.latency`) avec `p50`, `p95`, `p99`, `max`, `count` (ms).

### Instrumentation
- `timed_execute_tool` (backend/app/middleware/timed_execution.py) entoure `execute_tool`.
- Déjà branché pour les routes `/ai/v2/{agent}/{tool}` (`hub_router.py`).
- `request_id` récupéré via entête `X-Request-Id` (fallback local).

### Tests
- `tests/test_observability_metrics.py` : succès, erreur, blocage, export percentiles.
- Commande : `pytest -q tests/test_observability_metrics.py`.

### Definition of Done (Pass 10)
- `timed_execute_tool` appliqué sur la route AI.
- Compteurs success/error/blocked et latences exposées.
- Log structuré `tool_execution_error` avec request_id/user_id.
- README mis à jour.


## 🧩 Policy Engine (Pass 11)

La sécurité outils est désormais pilotée par un fichier YAML validé (Pydantic).

### Fichier
- Chemin par défaut : `backend/policy.yaml`
- Override : `POLICY_FILE=/chemin/vers/policy.yaml`

### Schéma
- `tools.forbidden`: liste d’outils interdits (lowercase)
- `tools.aliases`: mapping alias → nom réel (case-insensitive)
- `rules.forbid_async`: bool (default: true)
- `rules.forbid_multiline_with_forbidden`: bool (default: true)
- `rules.forbid_nested_ancestors`: bool (default: true)

### Reload à chaud
La policy est rechargée automatiquement si le fichier change (mtime).
Aucun redeploy nécessaire : le middleware relit via `PolicyManager`.

### Logs & métriques
- Les blocages restent tracés en JSON via `forbidden_tool_blocked`.
- Les métriques de latence & compteurs (Pass 10) ne changent pas.

### Dépendances
- PyYAML (lecture YAML)
- Pydantic (validation)


## ✅ Pass 12 — CI & Qualité

### CI (GitHub Actions)
- Workflow: `.github/workflows/ci.yml`
- Étapes: lint (ruff), format (black --check), types (mypy), tests (pytest + coverage)
- Résultats visibles via badge GitHub Actions

### pre-commit
- Fichier: `.pre-commit-config.yaml`
- Installation: `pip install pre-commit && pre-commit install`
- Lancer sur tout le code: `pre-commit run -a`

### Couverture
- Lancer: `pytest --cov=backend --cov-report=term-missing`
- Artefact `.coverage` uploadé par la CI
