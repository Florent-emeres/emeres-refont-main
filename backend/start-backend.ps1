# Shortcut script to start the backend with required environment variables
if (-not (Test-Path '.\.venv\Scripts\Activate.ps1')) {
    Write-Error 'Virtual environment not found. Run py -3.11 -m venv .venv first.'
    exit 1
}

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -ErrorAction SilentlyContinue | Out-Null

.\.venv\Scripts\Activate.ps1

 = 'mongodb+srv://florentmerlinpro_db_user:Emeres_db_mdp01%2B-@clusteremerestest.k1zprgj.mongodb.net/'
 = 'emeres_dev'
 = 'dev-secret-key'
 = 'ollama'
 = 'llama3.1'
 = 'http://localhost:11434'

uvicorn server:app --reload
