from __future__ import annotations

import importlib
from pathlib import Path
from types import SimpleNamespace

DEFAULT_POLICY = (
    'version: 1\n'
    'tools:\n'
    '  forbidden:\n'
    '    - web.run\n'
    '  aliases:\n'
    '    internet: web.run\n'
    '    browse: web.run\n'
    'rules:\n'
    '  forbid_async: true\n'
    '  forbid_multiline_with_forbidden: true\n'
    '  forbid_nested_ancestors: true\n'
)

def make_policy(
    *,
    forbidden: list[str] | None = None,
    aliases: dict[str, str] | None = None,
    forbid_async: bool = True,
    forbid_multiline: bool = True,
    forbid_nested: bool = True,
) -> str:
    forbidden = [ (item or "").lower() for item in (forbidden or []) ]
    aliases = { (k or "").lower(): (v or "").lower() for k, v in (aliases or {}).items() }
    lines = [
        'version: 1',
        'tools:',
        '  forbidden:',
    ]
    if forbidden:
        lines.extend(f'    - {item}' for item in forbidden)
    else:
        lines.append('    []')
    lines.append('  aliases:')
    if aliases:
        lines.extend(f'    {k}: {v}' for k, v in aliases.items())
    else:
        lines.append('    {}')
    lines.extend([
        'rules:',
        f'  forbid_async: {str(forbid_async).lower()}',
        f'  forbid_multiline_with_forbidden: {str(forbid_multiline).lower()}',
        f'  forbid_nested_ancestors: {str(forbid_nested).lower()}',
    ])
    return '\n'.join(lines)

def reload_policy_modules() -> SimpleNamespace:
    import backend.app.policy.manager as manager
    manager = importlib.reload(manager)
    import backend.app.middleware.tool_execution as tool_execution
    tool_execution = importlib.reload(tool_execution)
    import backend.app.middleware.timed_execution as timed_execution
    timed_execution = importlib.reload(timed_execution)
    return SimpleNamespace(
        manager=manager,
        tool_execution=tool_execution,
        timed_execution=timed_execution,
    )
