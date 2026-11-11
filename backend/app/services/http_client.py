import os

import requests
from requests.adapters import HTTPAdapter, Retry

DEFAULT_TIMEOUT = float(os.getenv("HTTP_TIMEOUT", "8"))
RETRIES = int(os.getenv("HTTP_RETRIES", "2"))

_session = requests.Session()
_retries = Retry(total=RETRIES, backoff_factor=0.3, status_forcelist=[502, 503, 504, 429])
_session.mount("http://", HTTPAdapter(max_retries=_retries))
_session.mount("https://", HTTPAdapter(max_retries=_retries))


def get(url: str, **kwargs):
    timeout = kwargs.pop("timeout", DEFAULT_TIMEOUT)
    return _session.get(url, timeout=timeout, **kwargs)


def post(url: str, **kwargs):
    timeout = kwargs.pop("timeout", DEFAULT_TIMEOUT)
    return _session.post(url, timeout=timeout, **kwargs)
