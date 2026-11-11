import json
import logging
import logging.config
import sys
from datetime import UTC, datetime


class JsonFormatter(logging.Formatter):
    """Serialize log records as JSON for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "ts": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "event": getattr(record, "event", None),
            "msg": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            payload["request_id"] = record.request_id
        if hasattr(record, "user_id"):
            payload["user_id"] = record.user_id
        return json.dumps(payload, ensure_ascii=False)


def setup_logging(json_output: bool = True, level: str = "INFO") -> None:
    """Configure root logging with optional JSON output to stdout."""
    if json_output:
        logging.config.dictConfig(
            {
                "version": 1,
                "disable_existing_loggers": False,
                "formatters": {
                    "json": {"()": JsonFormatter},
                },
                "handlers": {
                    "default": {
                        "level": level,
                        "class": "logging.StreamHandler",
                        "stream": sys.stdout,
                        "formatter": "json",
                    }
                },
                "root": {
                    "level": level,
                    "handlers": ["default"],
                },
            }
        )
    else:
        logging.basicConfig(
            level=level,
            format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            stream=sys.stdout,
        )
