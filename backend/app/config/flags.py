import os

USE_V2_ONLY = os.getenv("USE_V2_ONLY", "false").lower() in ("1", "true", "yes")
