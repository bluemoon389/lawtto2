"""「경미한 변경」 continue gate (HARD 2026-11-24).

Title / filename tokens ``경미한 변경`` / ``경미한변경`` / ``경미변경`` are
framing labels only — not an auto 유보 / ask / DONE유보 ban.

Judge with 사유지 · 조서 · area · amount gates. When those PASS, notify then
continue to item analysis / chart candidate (잔여지 included).

Jose present only on ``_1`` / ``_2`` … siblings: reuse
``merge_jose_from_siblings`` from ``saram_hwakin_gate``.

Sync target (OneDrive chart(+k-geo)): daily select / front triage — owned by
self-hosted worker; this module is the portable SSOT + tests.

Anchor: 광주 2026-426 대로2-46 등 — 육안 잔여 · 사유지 부분편입.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from .saram_hwakin_gate import (
    Decision,
    merge_jose_from_siblings,
)

# Framing tokens only — never alone force HOLD / 유보 / ask / DONE유보.
GYEONGMI_TOKENS: tuple[str, ...] = (
    "경미한 변경",
    "경미한변경",
    "경미변경",
)


@dataclass(frozen=True)
class GateInput:
    """Minimal inputs for the portable 경미한 변경 gate (no K-Geo / LLM)."""

    filename: str
    area_gate_pass: bool
    amount_gate_pass: bool
    jose_present: bool = False
    """True after merging primary + ``_N`` sibling jose sources."""
    sayuji_pass: bool = True
    """사유지 gate PASS (private land present / not 사유지전무)."""
    title: str = ""
    """Optional 표제; marker may appear in title and/or filename."""
    notify: bool = True
    """When CONTINUE with marker, callers should emit a 통고 before analysis."""


@dataclass(frozen=True)
class GateResult:
    decision: Decision
    reason: str
    has_gyeongmi: bool
    should_notify: bool = False
    continue_to_item_analysis: bool = False
    continue_to_chart_candidate: bool = False
    notes: tuple[str, ...] = field(default_factory=tuple)

    @property
    def is_auto_hold_forbidden(self) -> bool:
        """True when 경미한 변경 alone must not force DONE유보/hold."""
        return self.has_gyeongmi and self.decision != Decision.HOLD


def has_gyeongmi_marker(*texts: str) -> bool:
    """True if any of ``경미한 변경`` / ``경미한변경`` / ``경미변경`` appears."""
    blob = " ".join(t or "" for t in texts)
    return any(tok in blob for tok in GYEONGMI_TOKENS)


def evaluate_gyeongmi_continue(inp: GateInput) -> GateResult:
    """Decide whether 「경미한 변경」 may halt daily triage.

    HARD: marker alone never yields HOLD. HOLD only for true field shortage
    (jose missing after sibling merge). SKIP on clear area/amount/sayuji fail.
    CONTINUE when sayuji + jose + area/amount PASS → notify then item/chart.
    """
    marked = has_gyeongmi_marker(inp.filename, inp.title)
    notes: list[str] = []
    if marked:
        notes.append("marker=경미한변경(프레이밍·자동유보금지)")

    gates_ok = bool(
        inp.sayuji_pass and inp.area_gate_pass and inp.amount_gate_pass
    )

    if gates_ok and inp.jose_present:
        notes.append(
            "sayuji+area+amount PASS · jose merged → 통고 후 아이템·차트 진행"
        )
        return GateResult(
            decision=Decision.CONTINUE,
            reason="gyeongmi_gates_pass_continue",
            has_gyeongmi=marked,
            should_notify=bool(inp.notify and marked),
            continue_to_item_analysis=True,
            continue_to_chart_candidate=True,
            notes=tuple(notes),
        )

    if gates_ok and not inp.jose_present:
        # Gates cleared, but jose still missing after sibling merge →
        # human review path (사람 검토), not silent 유보-from-경미.
        notes.append("gates PASS but jose missing after sibling merge")
        return GateResult(
            decision=Decision.HOLD,
            reason="jose_missing_after_sibling_merge",
            has_gyeongmi=marked,
            should_notify=bool(marked),
            continue_to_item_analysis=False,
            continue_to_chart_candidate=False,
            notes=tuple(notes),
        )

    if not gates_ok:
        notes.append("sayuji/area/amount gate not PASS")
        # Clear shortfall → SKIP; do not blame 경미한 변경 for the stop.
        return GateResult(
            decision=Decision.SKIP,
            reason="sayuji_area_or_amount_gate_fail",
            has_gyeongmi=marked,
            should_notify=False,
            continue_to_item_analysis=False,
            continue_to_chart_candidate=False,
            notes=tuple(notes),
        )

    # Defensive fallback — should be unreachable.
    return GateResult(
        decision=Decision.HOLD,
        reason="unresolved",
        has_gyeongmi=marked,
        notes=tuple(notes),
    )


__all__ = [
    "GYEONGMI_TOKENS",
    "Decision",
    "GateInput",
    "GateResult",
    "has_gyeongmi_marker",
    "evaluate_gyeongmi_continue",
    "merge_jose_from_siblings",
]
