"""Regression: 「사람 확인」 must not auto-hold when gates PASS (HARD 2026-11-24)."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from chart_harness.saram_hwakin_gate import (  # noqa: E402
    Decision,
    GateInput,
    evaluate_saram_hwakin_continue,
    estimate_imya_compensation_eok,
    merge_jose_from_siblings,
    sibling_group_key,
)


JANGHYEON_PRIMARY = (
    "강릉시_‘강릉시 장현근린공원 조성’사업 보상계획 열람 공고_20261120(사람 확인).hwpx"
)
JANGHYEON_ACCESSORY = (
    "강릉시_‘강릉시 장현근린공원 조성’사업 보상계획 열람 공고_20261120_1(사람 확인).hwpx"
)


def test_saram_hwakin_plus_gates_pass_continues_not_hold():
    result = evaluate_saram_hwakin_continue(
        GateInput(
            filename=JANGHYEON_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=True,
            jose_present=True,
        )
    )
    assert result.decision is Decision.CONTINUE
    assert result.has_saram_hwakin is True
    assert result.should_notify is True
    assert result.continue_to_jongjung is True
    assert result.continue_to_item_analysis is True
    assert result.is_auto_hold_forbidden is True


def test_saram_hwakin_alone_does_not_force_hold_when_gates_clear():
    """Marker is ambiguity display only — not an analysis ban flag."""
    unmarked = evaluate_saram_hwakin_continue(
        GateInput(
            filename="공고_20261120.hwpx",
            area_gate_pass=True,
            amount_gate_pass=True,
            jose_present=True,
        )
    )
    marked = evaluate_saram_hwakin_continue(
        GateInput(
            filename="공고_20261120(사람 확인).hwpx",
            area_gate_pass=True,
            amount_gate_pass=True,
            jose_present=True,
        )
    )
    assert unmarked.decision is Decision.CONTINUE
    assert marked.decision is Decision.CONTINUE
    assert marked.should_notify is True
    assert unmarked.should_notify is False


def test_jose_only_on_accessory_1_merges_and_continues():
    merged = merge_jose_from_siblings(
        JANGHYEON_PRIMARY,
        jose_by_name={
            JANGHYEON_PRIMARY: False,  # body = 이의신청서 only
            JANGHYEON_ACCESSORY: True,  # _1 = 공고+조서
        },
        names=[JANGHYEON_PRIMARY, JANGHYEON_ACCESSORY],
    )
    assert merged["jose_present"] is True
    assert merged["merged_from_accessory_only"] is True
    assert JANGHYEON_ACCESSORY in merged["jose_sources"]

    result = evaluate_saram_hwakin_continue(
        GateInput(
            filename=JANGHYEON_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=True,
            jose_present=merged["jose_present"],
        )
    )
    assert result.decision is Decision.CONTINUE


def test_sibling_group_key_pairs_primary_and_1():
    assert sibling_group_key(JANGHYEON_PRIMARY) == sibling_group_key(JANGHYEON_ACCESSORY)


def test_janghyeon_san4_imya_x4_amount_pass_anchor():
    """Anchor smoke: 산4 임야 공시 5,520 ×4 ≈ 2.93억 PASS → CONTINUE path."""
    # Back-solve area from stated ≈2.93억 at 5520×4
    # 2.93e8 / (5520 * 4) ≈ 13270.0 ㎡
    area_m2 = 2.93e8 / (5520.0 * 4.0)
    eok = estimate_imya_compensation_eok(area_m2, 5520.0, multiplier=4.0)
    assert eok == pytest.approx(2.93, abs=0.01)
    assert eok >= 1.0  # Stage A 1억 gate

    result = evaluate_saram_hwakin_continue(
        GateInput(
            filename=JANGHYEON_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=eok >= 1.0,
            jose_present=True,
        )
    )
    assert result.decision is Decision.CONTINUE
    assert result.continue_to_item_analysis is True


def test_amount_fail_is_skip_not_saram_hold():
    result = evaluate_saram_hwakin_continue(
        GateInput(
            filename="공고_20261120(사람 확인).hwpx",
            area_gate_pass=True,
            amount_gate_pass=False,
            jose_present=True,
        )
    )
    assert result.decision is Decision.SKIP
    assert result.reason == "area_or_amount_gate_fail"


def test_jose_missing_after_merge_holds_for_fields_not_marker():
    merged = merge_jose_from_siblings(
        JANGHYEON_PRIMARY,
        jose_by_name={JANGHYEON_PRIMARY: False, JANGHYEON_ACCESSORY: False},
        names=[JANGHYEON_PRIMARY, JANGHYEON_ACCESSORY],
    )
    result = evaluate_saram_hwakin_continue(
        GateInput(
            filename=JANGHYEON_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=True,
            jose_present=merged["jose_present"],
        )
    )
    assert result.decision is Decision.HOLD
    assert result.reason == "jose_missing_after_sibling_merge"
