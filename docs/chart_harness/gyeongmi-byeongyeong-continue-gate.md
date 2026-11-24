# 「경미한 변경」 continue gate (portable · 2026-11-24)

Sibling of [saram-hwakin-continue-gate.md](saram-hwakin-continue-gate.md).

Project store HARD + ops:  
`/cursor/stores/bc-d91409f9-7035-4ca7-8c98-2386f2a77bc9/docs/gyeongmi-byeongyeong-continue-gate.md`

## HARD (summary)

Title / filename tokens `경미한 변경` · `경미한변경` · `경미변경` are **framing only** — **not** auto 유보 / ask / DONE유보.

- Judge with **사유지 · 조서 · area · amount** gates.
- Gates **PASS** → 통고 후 아이템 분석 · 차트 후보 (잔여지 포함).
- True field shortage → `(사람 검토)`; clear shortfall → SKIP / 비해당 as usual.

Anchor: 광주 2026-426 대로2-46 등.

## Portable module (this repo)

| Path | Role |
|---|---|
| `chart_harness/gyeongmi_byeongyeong_gate.py` | `has_gyeongmi_marker` · `evaluate_gyeongmi_continue` |
| `tests/test_gyeongmi_byeongyeong_not_auto_hold.py` | regression (≥5 cases) |
| jose merge | reuse `merge_jose_from_siblings` from `saram_hwakin_gate` |

```bash
python -m pytest tests/test_gyeongmi_byeongyeong_not_auto_hold.py -q
```

## Sync into chart(+k-geo) (self-hosted)

Live daily-select wiring is owned by the self-hosted `chart(+k-geo)` worker — **not** this PR. This repo is the portable SSOT + tests only.
