'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),dir='research/4643-final-answers-2026-10-29/',base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/';
assert.equal(JSON.parse(fs.readFileSync('research/zero-hit-full-regression-v2-result.json')).passed,true);
fs.mkdirSync(dir,{recursive:true});
for(const p of ['dist/souls.js','dist/range-effects.js','tests/next50-4643-skills.test.cjs'])fs.copyFileSync(p,dir+path.basename(p));
function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,140));fs.writeFileSync(p,s.replace(a,b));}
edit('dist/range-effects.js',"if(c.a.counts.nextAttackHealing>0)throw Error('Q-N50-4511-006：1314未消费攻击转回复重授/混源待确认');","if(c.a.counts.nextAttackHealing>(c.a.soulState.belle1314??0))throw Error('Q-N50-4511-006：1314与异源攻击转回复共存待确认');");
const core='dist/souls.js';
edit(core,"if(!effectContext.ignoreImmunity&&!warImmunity&&((t.soulState.panNullify1554&&t.counts.attackNullify>0)||remaining<=0||on(t,'当回合免伤')||on(t,'攻击伤害免疫')||on(t,'技能禁疗')||context(t,a,m).shieldValue(t)>0||(t.suitState.barrier??0)>0))throw Error('Q-N50-4516-002：1314与免攻/零结算/护盾/技能禁疗交互待确认');",'');
edit(core,"t.counts.nextAttackHealing>0&&!t.soulState.panConversion1677)","t.counts.nextAttackHealing>0&&!t.soulState.panConversion1677&&!t.soulState.belle1314)");
const anchor="if(!effectContext.ignoreImmunity&&!warImmunity&&t.soulState.panConversion1677>0&&t.counts.nextAttackHealing>0){";
edit(core,anchor,"if(!effectContext.ignoreImmunity&&!warImmunity&&t.soulState.belle1314>0&&t.counts.nextAttackHealing>0){const converted=Math.max(0,remaining);t.counts.nextAttackHealing--;if(--t.soulState.belle1314===0)delete t.soulState.belle1314;t.soulState.nextAttackHealingConsumedRound=r;t.soulState.lastSettledAttackConversion={round:r,amount:converted,effectId:1314,moveId:28722};heal(t,converted,'完整红伤转换体力','skill');remaining=0;hitImmune=true;minimumSuppressed=true;}"+anchor);
edit(core,"if((a.counts.nextSkillPriority??0)>0)throw Error('Q-N50-4511-006：1203下次先制未消费重授/混源待确认');a.counts.nextSkillPriority=pending.count;a.soulState.nextSkillPriorityAmount=pending.amount;","grantSkillPriority(a,pending.count,pending.amount,'4643:37349:1203',1203,true);");
const p=base+'4643-user-confirmations.json',c=JSON.parse(fs.readFileSync(p));c.finalAnswers={recordedAt:new Date().toISOString(),source:'human chat replies call_c533d67c840d4f6191e9318d4b25ffce and call_926ea29067634a059cea3f607a747670',1314:'同源刷新1次；防御减免免疫护盾处理后的完整红伤转回复，零伤消费，回复受禁疗',1203:'同源刷新1次；异源分别保存先制相加，实际用招各消费1次',nameCorrection:'28722真实来源名星垂穹仪，早期提问误写天赐恩宠，确认按ID绑定'};c.pending=[];c.status='final-answers-implemented-awaiting-tests';fs.writeFileSync(p,JSON.stringify(c,null,2)+'\n');
console.log('4643 final answers implemented; mixed conversion sources remain explicitly guarded outside this confirmation');
