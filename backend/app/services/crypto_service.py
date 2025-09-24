import os
from cryptography.fernet import Fernet

def _is_true(value: str | None) -> bool:
    return str(value or "").lower() in ("1", "true", "yes", "on")

_REQUIRE = _is_true(os.environ.get("REQUIRE_MESSAGING_KEY", "false"))

_CUR = os.environ.get("MESSAGING_ENCRYPTION_KEY")
if _REQUIRE and not _CUR:
    raise RuntimeError("MESSAGING_ENCRYPTION_KEY is required when REQUIRE_MESSAGING_KEY=true")

if not _CUR:
    _CUR = Fernet.generate_key().decode()

_PREV = os.environ.get("MESSAGING_ENCRYPTION_KEY_PREV")

_f_cur = Fernet(_CUR.encode())
_f_prev = Fernet(_PREV.encode()) if _PREV else None

def encrypt(plain: str) -> str:
    return _f_cur.encrypt(plain.encode()).decode()

def decrypt(token: str) -> str:
    try:
        return _f_cur.decrypt(token.encode()).decode()
    except Exception:
        if _f_prev:
            return _f_prev.decrypt(token.encode()).decode()
        raise
