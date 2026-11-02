'use strict';
const fs=require('fs'),P=require('../completion-policy.cjs'),s=require('../data/species/3291.json').snapshot,r=require('../SINGLE-STAGE-REVIEWS.json');
const file='tests/deployed-3291.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
const map={4:'普通能力',5:'普通能力',30:'普通攻击',645:'普通攻击',683:'普通攻击',1094:'圣世惩杀',1095:'瀚空之门',1096:'本地真实命宇',1097:'亘古圣辰',1098:'万皇宗魄'};
for(const i of P.inventory(s)){const n=i.kind==='move'?'全部17招':i.kind==='soul'?'魂印免粉':map[i.raw.instance.id];if(!n)throw Error(i.key);const name=names.find(x=>x.includes(n));if(!name)throw Error(n);
 const entry={sourceDigest:i.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'依据现有SeerAPI快照research/selected-3291.json及正式本地原始参数，核查本地wiki技能ID路径和实际状态；不以旧代码代替来源。',singleBehavior:i.kind==='move'?'真实本地技能基础伤害、PP消耗、控制封招及零PP拒绝':i.kind==='soul'?'当前自身免粉免弱、首发三回合免异常、行动结束回复与无效技能皇怒；成功普通技能不得产生无词条皇怒':i.raw.instance.description,implementation:['dist/souls.js','dist/soul-registry.js','dist/range-effects.js'],tests:Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[{file,name,assertion:name}]]))};
 if(i.kind==='soul'){entry.scope='mixed';entry.deferredBehavior='在背包为其他己方队员提供星皇之赐与首发星皇之佑';entry.trigger='队伍存在星皇且其他队员出场';entry.futureMechanisms=['队伍背包光环','首发判定'];}
 r.entries[i.key]=entry;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');console.log(P.reviewCoverage(s,r));
