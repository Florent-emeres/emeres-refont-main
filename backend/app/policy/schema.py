from __future__ import annotations

from typing import Dict, List

from pydantic import BaseModel, Field, field_validator


class ToolSettings(BaseModel):
    forbidden: List[str] = Field(default_factory=list)
    aliases: Dict[str, str] = Field(default_factory=dict)

    @field_validator("forbidden", mode="before")
    def _normalize_forbidden(cls, value):  # noqa: N805
        if not value:
            return []
        return [ (item or "").lower() for item in value ]

    @field_validator("aliases", mode="before")
    def _normalize_aliases(cls, value):  # noqa: N805
        if not value:
            return {}
        return { (k or "").lower(): (v or "").lower() for k, v in value.items() }


class RuleSettings(BaseModel):
    forbid_async: bool = True
    forbid_multiline_with_forbidden: bool = True
    forbid_nested_ancestors: bool = True


class Policy(BaseModel):
    version: int = 1
    tools: ToolSettings = Field(default_factory=ToolSettings)
    rules: RuleSettings = Field(default_factory=RuleSettings)
