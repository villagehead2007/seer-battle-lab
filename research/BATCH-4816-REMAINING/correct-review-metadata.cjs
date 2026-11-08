'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),path=require('path'),crypto=require('crypto'),root=__dirname,base=path.resolve(root,'../..'),rp=path.join(base,'SINGLE-STAGE-REVIEWS.json'),reviews=JSON.parse(fs.readFileSync(rp)),ids=new Set(require('./STATUS.json').targets.map(x=>x.id)),g=require('./COMMON-GLOSSARY-SOURCE.json'),at=new Date().toISOString(),history=[];
const legal=['single','mixed','multiplayer'],kinds=['team-members','bench','next-entry','switch','off-field','team-state'];
const kindMap={reentry:'switch',team:'team-state','additional-pet':'team-members','dead-bench':'off-field','switch-entry':'switch','next-opponent':'next-entry','next-ally':'next-entry','next-pet':'next-entry','other-ally':'team-members','bench-all':'off-field','opponent-bench-all':'off-field','side-shared-successor':'team-state','team-count':'team-state','switch-retention':'switch','team-condition':'team-state','team-order':'team-state','current-team-member':'team-state',entry:'switch','bench-revival':'off-field'};
const overrides={
'4816:soul:2008':[{kind:'switch',quote:'自身每次登场时开启赛博共振器'}],
'4822:soul:2013':[{kind:'switch',quote:'登场时为对手附加3回合易燃'}],
'4823:soul:2014':[{kind:'switch',quote:'登场时为自身附加10回合的冻伤'}],
'4853:soul:2038':[{kind:'team-members',quote:'自身位于出战背包时'},{kind:'switch',quote:'自身主动切换时'},{kind:'next-entry',quote:'己方下只精灵登场时'}],
'4861:soul:2046':[{kind:'switch',quote:'自身登场时'},{kind:'team-members',quote:'混沌系额外精灵',glossary:426},{kind:'switch',quote:'涂蝶主动下场或死亡时消失',glossary:426}],
'4872:soul:2059':[{kind:'off-field',quote:'己方场下所有精灵恢复99点体力',glossary:478}],
'4888:soul:2075':[{kind:'team-members',quote:'若己方其他精灵处于附属类异常状态'},{kind:'off-field',quote:'己方场下所有精灵',glossary:493},{kind:'off-field',quote:'己方场下所有精灵',glossary:494},{kind:'off-field',quote:'对方场下所有精灵',glossary:495}],
'4895:skill:29328:0':[{kind:'switch',quote:'所有异常抗性必定触发，失去全免抗性，下场保留',glossary:256}],
'4898:soul:2084':[{kind:'team-state',quote:'对方每有1只精灵的信仰对象是自身'},{kind:'team-state',quote:'若对方的信仰对象均为自身'}],
'4898:skill:29339:4':[{kind:'team-state',quote:'对方精灵均拥有信仰对象时'},{kind:'team-members',quote:'为对方所有精灵恢复404点体力并附加404点固定伤害'}],
'4905:soul:2092':[{kind:'switch',quote:'本次在场的触发项数+1'}],
'4905:soul:2106':[{kind:'switch',quote:'本次在场的触发项数+1'}],
'4912:soul:2099':[{kind:'switch',quote:'自身每次在场首次使用攻击技能时'},{kind:'team-state',quote:'双方每有一只阵亡精灵上限+5',glossary:527},{kind:'off-field',quote:'灰蛾不在场时每回合减少1层',glossary:528}],
'4921:soul:2117':[{kind:'switch',quote:'之后本场战斗自身登场时'},{kind:'switch',quote:'未注明消失时点时，默认为精灵下场时',glossary:536}],
'4922:soul:2118':[{kind:'off-field',quote:'恢复至己方不在场精灵'}],
'4923:soul:2119':[{kind:'team-state',quote:'双方首位、末位精灵的效果触发无视顺序条件',glossary:538},{kind:'switch',quote:'双方的主动下场视为驱逐下场',glossary:539}],
'4933:soul:2128':[{kind:'team-members',quote:'将己方精灵的信仰对象改为自身'},{kind:'switch',quote:'下场保留',glossary:554}],
'4942:soul:2141':[{kind:'off-field',quote:'自身存活于场下时，为己方提供霜域血装支援'},{kind:'next-entry',quote:'自身死亡切换下场时为己方下只出战精灵附加3回合冰呪'}],
'4942:skill:29444:3':[{kind:'off-field',quote:'己方精灵每在场下受到260点伤害'},{kind:'off-field',quote:'恢复至己方不在场精灵'}],
'4942:skill:38523:0':[{kind:'team-state',quote:'对方存在含有“秒杀”特性的精灵时'},{kind:'team-state',quote:'每有1个含有“秒杀”的特性'}],
'4942:skill:38524:2':[{kind:'off-field',quote:'对方场下阵亡的首位精灵消逝'}],
'4942:skill:38524:4':[{kind:'switch',quote:'对手下回合无法主动切换精灵'}]
};
const snapshots=new Map([...ids].map(id=>[id,JSON.parse(fs.readFileSync(path.join(root,String(id),'snapshot.json')))]));
for(const[key,review]of Object.entries(reviews.entries)){
const [id,kind,rawId,index]=key.split(':');if(!ids.has(+id))continue;const s=snapshots.get(+id),move=s.moves.find(x=>x.id===+rawId),raw=kind==='soul'?s.souls.find(x=>x.id===+rawId):kind==='skill'?move?.effectInstances[+index]:move;if(!raw)continue;
const sourceTexts=[raw.description,raw.desc_formatting_adjustment,raw.analyze_desc].filter(Boolean);const before=structuredClone(review);if(review.scope==='multi')review.scope='multiplayer';if(review.scope==='multiplayer'&&review.singleBehavior){review.verificationNote=[review.verificationNote,review.singleBehavior].filter(Boolean).join('；');review.singleBehavior='';}
if(key==='4875:move:10986'){
 assert.equal(move.hash,'ace9579');assert.equal(move.sourceTargetCount,3);assert.deepEqual(move.effectInstances,[]);review.scope='single';review.rationale='按已确认全局多目标范围规则，仅忽略真实atk_num=3范围标记；当前对手普通攻击一次，不列为多精灵延期。';review.userConfirmation='research/MULTI-TARGET-USER-SCOPE.json';review.ignoredSourceFeatures=[{field:'atk_num',value:3,sourceHash:'ace9579',confirmation:review.userConfirmation}];review.dependencyEvidence=[];review.deferredBehavior='';review.trigger='';review.futureMechanisms=[];
}else if(review.dependencyEvidence){review.dependencyEvidence=structuredClone(overrides[key]??review.dependencyEvidence).map(e=>{e.kind=kindMap[e.kind]??e.kind;assert.ok(kinds.includes(e.kind),key+' invalid kind '+e.kind);if(e.glossary){const term=g.entries.find(x=>x.id===e.glossary);assert.ok(term?.desc.includes(e.quote),key+' glossary literal');e.source={file:'research/BATCH-4816-REMAINING/COMMON-GLOSSARY-SOURCE.json',url:'https://api.seerapi.com/v1/glossary_entry/'+term.id,revision:term.hash};}else{assert.ok(sourceTexts.some(t=>t.includes(e.quote)),key+' nonliteral '+e.quote);e.source={file:'research/BATCH-4816-REMAINING/'+id+'/snapshot.json',url:'https://api.seerapi.com/v1/'+(kind==='soul'?'soulmark':'skill')+'/'+rawId,revision:raw.hash??move?.revision??s.source.revision};}return e;});}
assert.ok(legal.includes(review.scope),key);assert.ok(review.scope!=='multiplayer'||!review.singleBehavior,key);if(JSON.stringify(before)!==JSON.stringify(review)){review.metadataCorrection={at,scope:'schema-and-literal-source-evidence-only',notFormalAcceptance:true};history.push({key,before,after:structuredClone(review)});}
}
const out={at,scope:'fixed52',sourcePolicy:'原文连续引文，命名状态另附真实glossary URL/hash；无效别名只修正元数据，纯多精灵空处理说明移为verificationNote，不冒充自身实现。',changed:history.length,formalAcceptanceChanged:false,history};
fs.writeFileSync(path.join(root,'REVIEW-METADATA-CORRECTION.json'),JSON.stringify(out,null,2)+'\n');fs.writeFileSync(rp,JSON.stringify(reviews,null,2)+'\n');
for(const id of ids){const p=path.join(root,String(id),'audit-config.json');if(!fs.existsSync(p))continue;const c=JSON.parse(fs.readFileSync(p));let changed=false;for(const key of Object.keys(c.reviews??{})){if(!history.some(x=>x.key===key))continue;c.reviews[key]={...reviews.entries[key]};delete c.reviews[key].tests;delete c.reviews[key].sourceDigest;delete c.reviews[key].reviewedBy;delete c.reviews[key].reviewedAt;changed=true;}if(changed)fs.writeFileSync(p,JSON.stringify(c,null,2)+'\n');}
console.log(JSON.stringify({changed:history.length,validation:'legal schema and literal source/linked glossary verified; formal acceptance unchanged'}));
