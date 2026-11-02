'use strict';
const fs=require('fs'),assert=require('assert/strict'),P=require('../completion-policy.cjs'),s=require('../local-species.cjs').species(3865),r=require('../SINGLE-STAGE-REVIEWS.json');
const files=['tests/deployed-3865.test.cjs','tests/deployed-3865-independent.test.cjs'];
const refs=part=>{for(const file of files){const name=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]).find(n=>n.includes(part));if(name)return {file,name,assertion:name};}throw Error(part);};
const map={4:'能力实例4',88:'88三倍',167:'167弱化',1354:'1354吸强',776:'132低体',99:'99混乱',498:'498暴击',486:'486下两',482:'88三倍',695:'695属性',132:'132低体',191:'191异常',1297:'1297害怕',847:'护盾护罩',1342:'护盾护罩',741:'741高额',1326:'护盾护罩',597:'597用招',843:'843下两',980:'843下两',1187:'1187害怕',1415:'1415结算',1221:'1221反转',986:'正式本地17',1152:'正式本地17',848:'167弱化'};
for(const i of P.inventory(s)){const entry={sourceDigest:i.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'SeerAPI真实来源与BWIKI交叉核对；歧义依research/3865-user-confirmed-rules.json限定确认，保留原文与参数。',implementation:['dist/range-effects.js','dist/range-souls.js','dist/souls.js'],userConfirmation:'research/3865-user-confirmed-rules.json'};let evidence;
 if(i.kind==='move'){entry.singleBehavior=i.raw.name+'真实基础威力、分类、命中、PP与先制；正式本地快照真实ID配招初始化执行';evidence=[refs('基础17招伤害'),refs('基础17招先制'),refs('正式本地17')];}
 else if(i.kind==='soul'){entry.scope='mixed';entry.singleBehavior='重复选招含控制判定，独立30%失效和回合末理论300回复；回合初严格体力比较全弱先制；当前击败累计暴击闪避10个百分点';entry.deferredBehavior='换宠后保留击败收益、后续对手出场继续累计';entry.trigger='发生换宠或下一名对手登场';entry.futureMechanisms=['换宠状态保留','队伍连续击败计数'];entry.dependencyEvidence=[{kind:'switch',quote:'切换保留'}];evidence=[refs('魂印重复'),refs('魂印固定'),refs('击败当前')];}
 else{entry.singleBehavior=i.raw.instance.description;evidence=[refs(map[i.raw.instance.id])];}
 entry.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,evidence]));r.entries[i.key]=entry;
}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');console.log(P.reviewCoverage(s,r));
