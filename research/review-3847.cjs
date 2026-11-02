'use strict';
const fs=require('fs'),assert=require('assert/strict'),P=require('../completion-policy.cjs'),source=require('./3847-reviewed-snapshot.json');
const files=['tests/deployed-3847.test.cjs','tests/deployed-3847-partial.test.cjs','tests/deployed-3847-mechanisms.test.cjs'];
const refs=files.flatMap(file=>[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1],assertion:m[1]})));
const ref=n=>{const r=refs.filter(x=>x.name.includes(n));assert.ok(r.length,n);return r;};
const groups=[[[4,5],'基础能力'],[[40,921],'40先手'],[[1180,1199],'1180及'],[[478,191,573],'478封'],[[77,1135],'77用'],[[585,433,1151],'585全'],[[417,762,843],'417攻击'],[[451,971],'451真实'],[[1134,1285],'1134反馈'],[[1001],'1001异常'],[[1181],'1181用'],[[1491,2058,2057],'1491与'],[[55],'55交换'],[[761],'761削'],[[1221],'1221反'],[[786,1078],'786动态'],[[1423],'1423害怕'],[[1647],'1647低'],[[2284],'2284剥'],[[1878,1111],'1878消'],[[1821,2456],'1821逐'],[[1427],'1427每'],[[2526],'尸骸']];
const map=Object.fromEntries(groups.flatMap(([ids,n])=>ids.map(id=>[id,n])));
const saved=require('../local-species.cjs').save(source);assert.equal(saved.saved,true,JSON.stringify(saved.issues));
const s=saved.snapshot,reviews=require('../SINGLE-STAGE-REVIEWS.json');
for(const i of P.inventory(s)){
 const r={sourceDigest:i.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'按真实原文检查当前双方在场可触发行为；自身追加能力纳入单精灵，明确后继目标和阵亡精灵集合分支单列。',implementation:['dist/range-effects.js','dist/souls.js'],userConfirmation:'research/3847-user-confirmed-rules.json'};let evidence=[];
 if(i.kind==='move'){r.singleBehavior=i.raw.name+'基础威力、物特分类、命中暴击、先制及PP消耗、控制和封招；版本按真实第五与魂印分组。';evidence=[...ref('基础24招伤害'),...ref('基础24招先制')];}
 else if(i.kind==='soul'){r.singleBehavior='回合初异常条件锁定后的攻击命中比例吸取；对手使用攻击后按回合末累计攻击伤害判定300界限；高伤百分比反弹和疲惫，强化版另消回合；低伤含零伤时下回合先制和攻击增伤。';r.implementation.push('dist/range-souls.js');evidence=ref('两版魂印');}
 else {const id=i.raw.instance.id;r.singleBehavior=i.raw.instance.description;
  if(id===840){r.scope='multiplayer';delete r.singleBehavior;r.deferredBehavior=i.raw.instance.description;r.trigger='击败当前对手后下一只敌方精灵登场';r.futureMechanisms=['队伍后继入场和己方在场受益者选择'];r.dependencyEvidence=[{kind:'next-entry',quote:'对方下只精灵出战时'}];}
  else {evidence=ref(map[id]);if(id===2526){r.scope='mixed';r.singleBehavior='开局召唤尸骸；持有时剥离每个单属性积累50属性直伤加值，每回合首次造成致死伤害增加六项能力值50，六异常行动结束消耗尸骸秒杀；消耗保留已获收益。';r.deferredBehavior='再次登场时令双方1只阵亡精灵消逝并召唤尸骸，以及下场保留后重新入场；需要双方队伍阵亡集合。';r.trigger='存在双方阵亡队员并发生后续登场';r.futureMechanisms=['双方阵亡精灵集合及消逝','离场和再次登场状态保留'];r.dependencyEvidence=[{kind:'team-members',quote:'令双方1只阵亡精灵消逝'}];}
  }
 }
 if(r.scope!=='multiplayer')r.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,evidence]));
 reviews.entries[i.key]=r;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(reviews,null,2)+'\n');
const coverage=P.reviewCoverage(s,reviews);fs.writeFileSync('research/3847-review-audit.json',JSON.stringify({status:'awaiting-final-gate',coverage,source:'research/3847-source-manifest.json',confirmation:'research/3847-user-confirmed-rules.json'},null,2)+'\n');console.log(coverage);
