# Backend LLM Configuration

The backend now uses a built-in client (`llm_client.py`) instead of the private
`emergentintegrations` package. Configure it via environment variables:

- `LLM_PROVIDER`: `stub` (default), `ollama`, or `openai`.
- `LLM_MODEL`: model name for the selected provider (`llama3.1` default for
  Ollama/local setups, e.g. `gpt-4o-mini` for OpenAI).
- `OLLAMA_BASE_URL`: base URL of your Ollama server (`http://localhost:11434`).
- `OPENAI_BASE_URL`: API base for OpenAI-compatible endpoints (defaults to
  `https://api.openai.com/v1`).
- `OPENAI_API_KEY`: required when using the OpenAI provider.
- `LLM_HTTP_TIMEOUT`: request timeout in seconds (default `30`).
- `LLM_HTTP_RETRIES`: retry attempts before falling back (default `2`).

When no provider is configured or requests fail, the client returns deterministic
fallback responses so the API remains usable. Switch to a real provider once a
local model (Ollama) or an API key (OpenAI/Anthropic) is available.

See `tests/test_llm_client.py` for examples exercising the stub mode. Run the
backend with these variables exported, e.g.:

```powershell
$env:LLM_PROVIDER = "ollama"
$env:LLM_MODEL = "llama3.1"
uvicorn server:app --reload
```
## Quick start

1. Pull the local model once (ollama pull llama3.1) and keep Ollama running.
2. Set up MongoDB Atlas credentials in .env (already prefilled for the dev cluster).
3. Launch the API with the helper script:
   `powershell
   cd backend
   .\start-backend.ps1
   `
4. Browse http://127.0.0.1:8000/docs to exercise the endpoints.

The script applies the required environment variables and activates the virtual environment automatically.
