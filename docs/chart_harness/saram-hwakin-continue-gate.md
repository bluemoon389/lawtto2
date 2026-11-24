# 「사람 확인」 continue gate (portable · 2026-11-24)

## HARD

Filename `(사람 확인)` alone must **not** stop the pipeline as 유보 / hold / DONE유보.

When area + amount gates **PASS**:

1. Emit 통고 (notify)
2. Continue → 종중 gate + item analysis
3. `(사람 확인)` = ambiguity marker only, **not** auto-analysis ban
4. Jose in sibling `_1` / `_2` … must be **merged** before declaring 조서無

Anchor: 강릉 장현근린공원 20261120 — 산4 임야×4 ≈ 2.93억 PASS → proceed analysis.

Preferences: Project store `preferences.md` (2026-11-24).

## Portable module (this repo)

| Path | Role |
|---|---|
| `chart_harness/saram_hwakin_gate.py` | `evaluate_saram_hwakin_continue` · `merge_jose_from_siblings` |
| `tests/test_saram_hwakin_not_auto_hold.py` | regression |

```bash
python -m pytest tests/test_saram_hwakin_not_auto_hold.py -q
```

## Sync into chart(+k-geo) (self-hosted)

Wire the same decision into live daily select (minimal):

| Live file | Hook |
|---|---|
| `_gongo_front_triage.py` | Do not treat `(사람 확인)` as terminal hold when gates PASS |
| `_run_daily_item_job.py` | `process_group` / `try_produce_chart`: notify + continue jongjung/item |
| `_saram_geomto_marker.py` | Keep `(사람 검토)` for true field shortage; do not equate with `(사람 확인)` ban |
| jose extract | Merge `_1`/`_2` accessories before 조서無 |

Live disk patch is owned by the self-hosted `chart(+k-geo)` worker; this PR is the portable SSOT + tests.
