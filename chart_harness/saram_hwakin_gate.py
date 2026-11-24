"""「사람 확인」 continue gate (HARD 2026-11-24).

Filename marker ``(사람 확인)`` is an ambiguity flag only — not an auto-analysis
ban. When area + amount gates PASS, notify then continue to 종중 / item analysis.
Jose present only on ``_1`` / ``_2`` … siblings must be merged before declaring
조서無.

Sync target (OneDrive chart(+k-geo)):
  ``_run_daily_item_job.py`` · ``_gongo_front_triage.py`` · ``_saram_geomto_marker.py``

Anchor: 강릉 장현근린공원 20261120 — 산4 임야×4 ≈ 2.93억 PASS → proceed.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Iterable, Mapping, Sequence

SARAM_HWAKIN_MARKER = "(사람 확인)"
SARAM_GEOMTO_MARKER = "(사람 검토)"

# …_20261120.hwpx  ↔  …_20261120_1.hwpx / …_20261120_2.xlsx
# Date token stays in the group key; only a short trailing _N is the accessory index.
_SIBLING_SUFFIX_RE = re.compile(
    r"^(?P<base>.+?_\d{8})(?:_(?P<idx>\d{1,2}))?(?P<ext>\.[^.]+)$",
    re.UNICODE,
)
_SIBLING_SUFFIX_FALLBACK_RE = re.compile(
    r"^(?P<base>.+?)(?:_(?P<idx>\d{1,2}))?(?P<ext>\.[^.]+)$",
    re.UNICODE,
)


class Decision(str, Enum):
    """Pipeline disposition after evaluating the 「사람 확인」 HARD."""

    HOLD = "hold"  # true ambiguity / missing fields — keep human marker
    CONTINUE = "continue"  # notify + proceed (jongjung / item analysis)
    SKIP = "skip"  # clear fail at area/money (not caused by 사람 확인 alone)


@dataclass(frozen=True)
class GateInput:
    """Minimal inputs for the portable gate (no K-Geo / LLM)."""

    filename: str
    area_gate_pass: bool
    amount_gate_pass: bool
    jose_present: bool = False
    """True after merging primary + ``_N`` sibling jose sources."""
    notify: bool = True
    """When CONTINUE, callers should emit a 통고 before jongjung/item."""


@dataclass(frozen=True)
class GateResult:
    decision: Decision
    reason: str
    has_saram_hwakin: bool
    should_notify: bool = False
    continue_to_jongjung: bool = False
    continue_to_item_analysis: bool = False
    notes: tuple[str, ...] = field(default_factory=tuple)

    @property
    def is_auto_hold_forbidden(self) -> bool:
        """True when 「사람 확인」 alone must not force DONE유보/hold."""
        return self.has_saram_hwakin and self.decision != Decision.HOLD


def has_saram_hwakin_marker(name: str) -> bool:
    return SARAM_HWAKIN_MARKER in (name or "")


def has_saram_geomto_marker(name: str) -> bool:
    return SARAM_GEOMTO_MARKER in (name or "")


def evaluate_saram_hwakin_continue(inp: GateInput) -> GateResult:
    """Decide whether ``(사람 확인)`` may halt the pipeline.

    HARD: marker alone never yields HOLD. HOLD only when gates fail to clear
    *and* jose is still missing after sibling merge (true field shortage).
    """
    marked = has_saram_hwakin_marker(inp.filename)
    notes: list[str] = []
    if marked:
        notes.append("marker=사람확인(애매표시·자동분석금지아님)")

    gates_ok = bool(inp.area_gate_pass and inp.amount_gate_pass)

    if gates_ok and inp.jose_present:
        notes.append("area+amount PASS · jose merged → 통고 후 종중·아이템 진행")
        return GateResult(
            decision=Decision.CONTINUE,
            reason="saram_hwakin_gates_pass_continue",
            has_saram_hwakin=marked,
            should_notify=bool(inp.notify and marked),
            continue_to_jongjung=True,
            continue_to_item_analysis=True,
            notes=tuple(notes),
        )

    if gates_ok and not inp.jose_present:
        # Gates cleared from available numbers, but jose still missing after
        # sibling merge → human review marker path (사람 검토), not silent 유보
        # caused by 「사람 확인」 alone.
        notes.append("gates PASS but jose missing after sibling merge")
        return GateResult(
            decision=Decision.HOLD,
            reason="jose_missing_after_sibling_merge",
            has_saram_hwakin=marked,
            should_notify=bool(marked),
            continue_to_jongjung=False,
            continue_to_item_analysis=False,
            notes=tuple(notes),
        )

    if not gates_ok:
        notes.append("area/amount gate not PASS")
        # Clear shortfall → SKIP; do not blame 「사람 확인」 for the stop.
        return GateResult(
            decision=Decision.SKIP,
            reason="area_or_amount_gate_fail",
            has_saram_hwakin=marked,
            should_notify=False,
            continue_to_jongjung=False,
            continue_to_item_analysis=False,
            notes=tuple(notes),
        )

    # Defensive fallback — should be unreachable.
    return GateResult(
        decision=Decision.HOLD,
        reason="unresolved",
        has_saram_hwakin=marked,
        notes=tuple(notes),
    )


def _strip_triage_markers(name: str) -> str:
    out = name
    for marker in (
        SARAM_HWAKIN_MARKER,
        SARAM_GEOMTO_MARKER,
        "(유보)",
        "(아이템 비해당)",
        "(원천제외)",
    ):
        out = out.replace(marker, "")
    return out


def _stem_parts(path: Path) -> tuple[str, str | None, str]:
    name = _strip_triage_markers(path.name)
    m = _SIBLING_SUFFIX_RE.match(name) or _SIBLING_SUFFIX_FALLBACK_RE.match(name)
    if not m:
        clean = Path(name)
        return clean.stem, None, clean.suffix
    return m.group("base"), m.group("idx"), m.group("ext")


def sibling_group_key(path: Path | str) -> str:
    """Group key for primary + ``_1``/``_2`` accessory files (strip triage markers)."""
    base, _idx, _ext = _stem_parts(Path(path))
    return base


def list_sibling_paths(
    primary: Path | str,
    directory: Path | str | None = None,
    *,
    names: Sequence[str] | None = None,
) -> list[Path]:
    """Return primary + numeric ``_N`` siblings sharing the same group key."""
    primary_path = Path(primary)
    key = sibling_group_key(primary_path)
    if names is not None:
        candidates = [Path(n) if Path(n).is_absolute() else (primary_path.parent / n) for n in names]
    else:
        root = Path(directory) if directory is not None else primary_path.parent
        candidates = list(root.iterdir()) if root.is_dir() else [primary_path]

    out: list[Path] = []
    for c in candidates:
        if sibling_group_key(c) == key:
            out.append(c)
    # Stable order: bare stem first, then _1, _2, …
    def sort_key(p: Path) -> tuple[int, int, str]:
        _base, idx, _ext = _stem_parts(p)
        if idx is None:
            return (0, 0, p.name)
        return (1, int(idx), p.name)

    return sorted(set(out), key=sort_key)


def merge_jose_from_siblings(
    primary: Path | str,
    *,
    jose_by_name: Mapping[str, bool] | None = None,
    jose_names: Iterable[str] | None = None,
    directory: Path | str | None = None,
    names: Sequence[str] | None = None,
) -> dict:
    """Merge jose-present flags across primary + ``_N`` accessories.

    ``jose_by_name`` maps filename → whether that file contributes jose rows.
    If omitted, ``jose_names`` is treated as the set of filenames that have jose.
    """
    siblings = list_sibling_paths(primary, directory, names=names)
    present_set = set(jose_names or ())
    flags: dict[str, bool] = {}
    for s in siblings:
        if jose_by_name is not None:
            flags[s.name] = bool(jose_by_name.get(s.name, jose_by_name.get(str(s), False)))
        else:
            flags[s.name] = s.name in present_set
    any_jose = any(flags.values())
    sources = [n for n, ok in flags.items() if ok]
    return {
        "siblings": [str(s) for s in siblings],
        "jose_by_file": flags,
        "jose_present": any_jose,
        "jose_sources": sources,
        "merged_from_accessory_only": bool(
            any_jose and all(_stem_parts(Path(n))[1] is not None for n in sources)
        ),
    }


def estimate_imya_compensation_eok(area_m2: float, gongsi_won_per_m2: float, multiplier: float = 4.0) -> float:
    """Rough 예상보상가 in 억 for 임야×배수 (portable smoke helper)."""
    return (area_m2 * gongsi_won_per_m2 * multiplier) / 1e8
