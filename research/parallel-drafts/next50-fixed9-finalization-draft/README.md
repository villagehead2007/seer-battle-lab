# Fixed9 finalization draft — not executed

Entry: `finalize-fixed9-after-review.cjs`. Main review and explicit `--apply-fixed9-after-review` are required. The child has not executed this script, any test, a validator, deployment, or shared-file mutation.

The script gates on `research/4633-production-integrated-targeted-v3-result.json`: exit0, failed0, passed=tests, concurrency1, and both fixed9/101 test files included. Historical v1 1308/1296p12f and v2 1344/1340p4f remain history; v3 success is not inferred from either.

Review these points before applying:

1. Check all9 exact inventory/source/review `sourceDigest` values. Only their `Q-BATCH-004` type subgap is removed. Other questions and original sources remain.
2. Check all9 clarified entries and101 individually have `P.checkReview=[]`. `readonly-review-checks.json` identifies a current named-witness limitation: nine literal test callbacks call `matrix(id)`, whose real state assertions are inside a helper. The policy intentionally does not follow that call. Main needs direct real-state witnesses in those callbacks, retaining the original matrix assertions; the finalizer must not bypass this requirement.
3. Exactly four pre-existing `4612:skill:20420:0` success/failure/boundary/interaction coverage blockers persist. Baseline/current diffs are recorded. All other current review failures must be zero. Compilation/source arity issues are recorded, never presented as zero.
4. Update literal test names globally in current review refs using fixed-followup `renamedLiteralTests` and101 `old-test-edits.json`. The original review files are backed up before write.
5. Restore exactly7 reopened targets from23 to30 unique independent-completed IDs, sorted by fixed `b.ids`. Processed30, scan4633/line257, formal4509 and accepted cursor remain unchanged. This is independent-work restoration, not deployment or formal acceptance.
6. Derive each target and pending snapshot questions from its current inventory reviews. Pending validation issues are recomputed and preserved, including4612 effect4 arity. No live answer is read or applied.
7. The101 association is the real `4628:skill:14859:0`, `basisMove.name`, sourcehash `b44c89e4`, effect101 `seerapi:2e77710f`, args[30]. Existing4305 behavior is expressly not an answer. All4 current literal state tests are added to each coverage class; research basis policies remain labeled research inputs.
8. MD handling uses only Buffer prefix preservation and append. Existing content is not parsed, searched, trimmed or reserialized. Original prefix bytes/SHA and backup, appended bytes/SHA and post-prefix SHA are saved. No PROGRESS write exists.

Planned shared writes, only after all preflight assertions: `SINGLE-STAGE-REVIEWS.json`, seven `data/species-pending/<id>.json` files, `research/BATCH-4509-NEXT50-STATUS.json`, append-only QUESTIONS, and a new finalization evidence JSON plus recoverable backups. No production code/tests/source snapshots/queue/scheduler are changed by this script.
