"""Regression: 「경미한 변경」 must not auto-hold when gates PASS (HARD 2026-11-24)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from chart_harness.gyeongmi_byeongyeong_gate import (  # noqa: E402
    Decision,
    GateInput,
    evaluate_gyeongmi_continue,
    has_gyeongmi_marker,
    merge_jose_from_siblings,
)


# Anchor-like: 광주 2026-426 대로2-46 — 경미한 변경 framing + 사유지 부분편입
GWANGJU_PRIMARY = (
    "광주광역시_고시_제2026-426호_대로2-46호선_실시계획_경미한 변경_20261120.hwpx"
)
GWANGJU_ACCESSORY = (
    "광주광역시_고시_제2026-426호_대로2-46호선_실시계획_경미한 변경_20261120_1.hwpx"
)


def test_gwangju_2026_426_like_gyeongmi_plus_gates_pass_continues():
    result = evaluate_gyeongmi_continue(
        GateInput(
            filename=GWANGJU_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=True,
            sayuji_pass=True,
            jose_present=True,
        )
    )
    assert result.decision is Decision.CONTINUE
    assert result.has_gyeongmi is True
    assert result.should_notify is True
    assert result.continue_to_item_analysis is True
    assert result.continue_to_chart_candidate is True
    assert result.is_auto_hold_forbidden is True
    assert result.reason == "gyeongmi_gates_pass_continue"


def test_gyeongmi_marker_plus_gates_fail_is_skip_not_gyeongmi_blame():
    result = evaluate_gyeongmi_continue(
        GateInput(
            filename=GWANGJU_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=False,
            sayuji_pass=True,
            jose_present=True,
        )
    )
    assert result.decision is Decision.SKIP
    assert result.reason == "sayuji_area_or_amount_gate_fail"
    assert result.has_gyeongmi is True
    assert result.continue_to_item_analysis is False


def test_gyeongmi_marker_jose_missing_holds_for_fields_not_marker():
    merged = merge_jose_from_siblings(
        GWANGJU_PRIMARY,
        jose_by_name={GWANGJU_PRIMARY: False, GWANGJU_ACCESSORY: False},
        names=[GWANGJU_PRIMARY, GWANGJU_ACCESSORY],
    )
    result = evaluate_gyeongmi_continue(
        GateInput(
            filename=GWANGJU_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=True,
            sayuji_pass=True,
            jose_present=merged["jose_present"],
        )
    )
    assert result.decision is Decision.HOLD
    assert result.reason == "jose_missing_after_sibling_merge"
    assert result.has_gyeongmi is True
    # 사람검토 path — not silent 유보-from-경미
    assert "유보" not in result.reason


def test_no_marker_gates_pass_continues():
    result = evaluate_gyeongmi_continue(
        GateInput(
            filename="광주광역시_고시_제2026-426호_대로2-46호선_실시계획_20261120.hwpx",
            area_gate_pass=True,
            amount_gate_pass=True,
            sayuji_pass=True,
            jose_present=True,
        )
    )
    assert result.decision is Decision.CONTINUE
    assert result.has_gyeongmi is False
    assert result.should_notify is False
    assert result.continue_to_item_analysis is True


def test_variant_tokens_gyeongmihanbyeongyeong_and_gyeongmibyeongyeong():
    compact = "공고_경미한변경_20261120.hwpx"
    short = "공고_경미변경_20261120.hwpx"
    spaced = "공고_경미한 변경_20261120.hwpx"

    assert has_gyeongmi_marker(compact) is True
    assert has_gyeongmi_marker(short) is True
    assert has_gyeongmi_marker(spaced) is True
    assert has_gyeongmi_marker("일반_실시계획변경_20261120.hwpx") is False
    # Title-only marker also counts
    assert has_gyeongmi_marker("file.hwpx", "실시계획 경미한 변경 고시") is True

    for name in (compact, short, spaced):
        result = evaluate_gyeongmi_continue(
            GateInput(
                filename=name,
                area_gate_pass=True,
                amount_gate_pass=True,
                sayuji_pass=True,
                jose_present=True,
            )
        )
        assert result.decision is Decision.CONTINUE
        assert result.has_gyeongmi is True
        assert result.should_notify is True


def test_sayuji_fail_is_skip_even_with_gyeongmi_marker():
    result = evaluate_gyeongmi_continue(
        GateInput(
            filename=GWANGJU_PRIMARY,
            area_gate_pass=True,
            amount_gate_pass=True,
            sayuji_pass=False,
            jose_present=True,
        )
    )
    assert result.decision is Decision.SKIP
    assert result.reason == "sayuji_area_or_amount_gate_fail"
