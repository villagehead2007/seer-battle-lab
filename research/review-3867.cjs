const fs=require('fs'),P=require('../completion-policy.cjs'),s=require('../local-species.cjs').species(3867),r=require('../SINGLE-STAGE-REVIEWS.json');const file='tests/deployed-3867.test.cjs',names=[...fs.readFileSync(file,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);const refs=p=>{const name=names.find(n=>n.includes(p));if(!name)throw Error(p);return {file,name,assertion:name};};
const map={4:'4和5',5:'4和5',40:'40先手',1423:'1423消',1131:'1423消',48:'15害怕',15:'15害怕',125:'40先手',33:'40先手',191:'15害怕',740:'740回合',776:'776翻倍',1265:'776翻倍',451:'451烧冻',885:'885体力',927:'885体力',1121:'776翻倍',1129:'1129强化',1449:'1129强化',2390:'2390消',1885:'1885免',1708:'1708未受',2228:'2228仅',1359:'740回合',741:'741三回',742:'741三回'};
for(const i of P.inventory(s)){const e={sourceDigest:i.sourceDigest,scope:'single',reviewedBy:'Codex',reviewedAt:new Date().toISOString(),rationale:'真实API/BWIKI原文、有序参数与已确认公共规则核对；双魂印受击时序与1708命中要求独立用户确认；伙伴为自身强化，无明示队伍依赖。',implementation:['dist/range-effects.js','dist/range-souls.js','dist/souls.js'],userConfirmation:'research/3867-user-confirmed-rules.json'};let evidence;
 if(i.kind==='move'){e.singleBehavior=i.raw.name+'真实基础PP/伤害/命中/控制与双魂印真实本地逐招配招执行';evidence=[refs('全部技能基础'),refs('正式本地18')];}
 else if(i.kind==='soul'){e.singleBehavior='受攻击结算后含MISS和零伤；按吸取前强化选择分支，吸强成功实际回复等量固伤及下两回合先制；无强化石化失败封属';evidence=[refs('魂印吸强'),refs('魂印MISS')];}
 else{e.singleBehavior=i.raw.instance.description;evidence=[refs(map[i.raw.instance.id])];}
 e.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,evidence]));r.entries[i.key]=e;
}
for(const i of P.inventory(require('../data/species/3549.json').snapshot).filter(i=>i.kind==='skill'&&i.raw.instance.id===1708)){const e=r.entries[i.key];if(e){e.singleBehavior='出手时本回合未受伤且命中后，降低对手后续回合先制，非能力下降';e.implementation=['dist/range-effects.js'];e.tests=Object.fromEntries(['success','failure','boundary','interaction'].map(k=>[k,[refs('1708既有'),refs('1708未受')]]));}}
fs.writeFileSync('SINGLE-STAGE-REVIEWS.json',JSON.stringify(r,null,2)+'\n');console.log(P.reviewCoverage(s,r));

