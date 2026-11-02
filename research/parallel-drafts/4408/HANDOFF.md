# 4408 draft handoff — not formal deployment or acceptance

Only research/parallel-drafts/4408/ was written. No API/Wiki requests, Git, daemon, formal deployment, formal validator, or whole-library tests were run. 4408 remains for the primary agent to process in the formal serial queue.

## Minimal implementation proposal

- implementation.patch / changes.json contain four anchored replacements in range-souls.js and range-effects.js only. Baseline SHA-256 is recorded per file in changes.json and validation-result.json. Parent 4401 work may change surrounding files; apply the unique before/after anchors, never replace a whole public file.
- Soul1626/d2f7eed: remove stale Q4408-001 pending state and invoke the existing no-policy swapCurrentHP(). The existing helper independently clamps both receivers to their maxHP and produces no damage/heal/loss events. Comparison remains after clamp; both must survive; original high/low/equal timing and all-damage reduction remain.
- Effect1522: use context.outgoingSettledDamage('attack') for this round's full settled red damage, excluding fixed/percent/true additions. The existing Q4442 guard is removed because that answer is explicit. Current 1522 attached fixed damage cannot enter its own red threshold. Source values, categories, hashes and parameters are unchanged.
- Reuse existing public833 final-late-combat queue and public1342 source-barrier rules; no new per-species patch for either.

## Candidate and tests

candidate-snapshot.json preserves all original pet/soul/move hashes/arguments/flags. It clears only the answered833 limitation and obsolete11531 multi-target defer. The raw sourceTargetCount4 remains. Primary agent must apply the already-confirmed global multi-target exclusion bookkeeping during formal canonical save, retaining original evidence. No true team/switch/off-field branch was found in4408.

source-comparison.json verifies17 move hashes, pet flags (fifth/advanced/special), every ordered effect argument, pet hash and soul hash/arguments against4408-source-check.json: all match. source-audit.json contains ordered originals. Sole soul1626 is non-advanced; sole fifth36059/c3e9f2ad; no partner/advanced extra version. No precise extra compatibility needed beyond the already-existing948[28] binding. 22[40,2] is not a new mismatch: the registered counter interpretation is p[1]+1 and actual original text is疲惫3回合.

coverage-map.json lists48 review units (17 bases +30 effect instances +1 soul), each naming actual state tests. Preserve all existing correct assertions. Candidate updated20 independent tests replace only stale pending rejection/partial833 expectations with the confirmed behavior. Six additional tests cover bidirectional maxHP clamp/equal/low branches, all17 full-effect compilation,833 late poison kill/nonlethal floor/theoretical recovery/immune/banheal/control/MISS/payload-block, and1522 multi-segment cumulative200/202/full-damage-vs-HP-loss/non-red exclusion/attack immunity.

Isolated verification used a per-process CommonJS overlay; it never changes actual modules:

- independent-tests.draft.cjs:20/20 passed, exit0, independent-test.log.
- state-tests.draft.cjs:6/6 passed, exit0, state-test-v2.log.
- Initial additional run had2 test-oracle mistakes: poison from the opponent was counted as4408 damage; banheal was incorrectly expected to prevent damage. Original failing draft and log retained. Corrected sourceSide filtering and banheal expectation, no production assertion weakened.

For formal integration: copy formal-helper.cjs content to tests/helpers/4408-battle.cjs; formal-independent.cjs to tests/deployed-4408-independent.test.cjs; formal-deployed.cjs to tests/deployed-4408.test.cjs. These supplied contents use normal engine/helper paths; draft runner uses overlay instead. Do not copy overlay loader or candidate test paths into formal helpers. Primary agent must rerun in current canonical environment after merging; draft results are not acceptance.

## Public impact and remaining formal work

1522-impact.json finds one existing saved species with1522:4318, skill35598/f9840dfb index1 [200,300]. Its necessary affected specialist/local-gate evidence and recertification must be determined by primary agent; none was run here. Parent should also inspect old tests mentioning '本次' for1522 before full regression; don't weaken correct red-damage assertions. The original global answer is preserved in answer-evidence.json (Q4442-001 explicitly lists1522,使用技能后计算、不计正在计算的自身固定附伤).

No newly unanswered semantic question or external request is presently required by this draft. No new multi-pet dependency found. Source audit/history evidence is preserved; no original questions/hash edited.

Primary agent still needs: review patch and source audit; adapt formal source snapshot/confirmation record; official save and real search/load/loadout/sole-version battle initialization; bind all48 root reviews to final source and true state test names; verify deferred bookkeeping; run the official validator with its built-in targeted/local/full tests; update formal records only after exit0 passed(single-stage). Do not count the26 draft tests or compile assessment as that certification.
