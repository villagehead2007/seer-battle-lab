'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4347-battle.cjs'),{make,turn,timer,key,E,source}=H;
const damage=(s,type='attack')=>(s.damageEvents??[]).filter(e=>e.type===type&&e.targetSide===1&&e.round===s.round-1).reduce((n,e)=>n+e.settledDamage,0);
test('4347已答两魂印低伤属性先制下回合真实抢先且第三回合到期，攻击不借用属性先制',()=>{for(const soul of [1571,1786]){const s=make({moveId:10006,index:null},{soul,aStats:{spe:1}});let o=turn(s);assert.equal(o.fighters[0].effects['属性技能先制'].start,2);assert.equal(o.fighters[0].effects['属性技能先制'].end,2);assert.equal(turn(o,920031).turns.at(-1).first,0);assert.equal(turn(turn(o,920031),920031).turns.at(-1).first,1);assert.equal(turn(o,920030).turns.at(-1).first,1);}});
test('4347强化魂印普通MISS仍低伤追加一次与属性先制，原版MISS及控制未用不触发',()=>{for(const soul of [1571,1786]){const s=make({moveId:10006,index:null},{soul,hit:false});s.moveDefinitions[key(10006)].alwaysHit=false;s.moveDefinitions[key(10006)].accuracy=0;const o=turn(s);assert.equal(damage(o),0);assert.equal(damage(o,'percent'),soul===1786?3000:0);assert.equal(o.fighters[0].pp[key(10006)],34);assert.equal(!!o.fighters[0].effects['属性技能先制'],soul===1786);const q=make({moveId:10006,index:null},{soul});q.fighters[0].ailments['疲惫']=2;const n=turn(q);assert.equal(damage(n,'percent'),0);assert.equal(n.fighters[0].pp[key(10006)],35);assert.equal(n.fighters[0].effects['属性技能先制'],undefined);}});
test('4347两魂印命中零结算仍追加，命中低伤一次不因afterUse重复，回复按实际且边界一致',()=>{for(const soul of [1571,1786]){const s=make({moveId:10006,index:null},{soul});timer(s,1,'攻击伤害免疫');const o=turn(s);assert.equal(damage(o),0);assert.equal(damage(o,'percent'),3000);assert.equal(o.damageEvents.filter(x=>x.type==='percent').length,1);for(const hp of [1000,8500,9000]){const q=make({moveId:10006,index:null},{soul,hp,aStats:{atk:9000}});q.moveDefinitions[key(10006)].power=140;const n=turn(q);assert.equal(n.fighters[0].hp,Math.min(9000,hp+3000));assert.equal(damage(n,'percent'),Math.min(3000,9000-hp));}}});
test('4347真实34503处决仅低于260归零且无伤害事件，保留1HP不击败与MISS不处决',()=>{for(const mode of ['kill','equal','save','miss']){const s=make(H.pick(456)[0],{targetHp:mode==='equal'?260:259,hit:mode!=='miss'});s.moveDefinitions[key(s.auditMoveId)].power=0;if(mode==='save')timer(s,1,'致命保留',{hp:1});if(mode==='miss'){s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}const o=turn(s);assert.equal(o.fighters[1].hp,mode==='kill'?0:mode==='save'?1:mode==='equal'?260:259);assert.equal((o.damageEvents??[]).filter(x=>x.settledDamage>0).length,0);}});

test('4347真实35752多段总伤仅一次魂印阈值结算，伙伴36519穿盾清回合吸取与疲惫完整链',()=>{for(const soul of [1571,1786]){const s=make({moveId:35752,index:null},{soul,hp:1000});const o=turn(s),hits=o.damageEvents.filter(e=>e.type==='attack'&&e.targetSide===1);assert.ok(hits.length>=8&&hits.length<=12);assert.equal(o.damageEvents.filter(e=>e.type==='percent'&&e.targetSide===1).length,1);assert.equal(damage(o,'percent'),3000);}const s=make({moveId:36519,index:null},{hp:1000,aStats:{spe:1}});s.fighters[1].suitState.shield=5000;s.fighters[1].stages.def=2;timer(s,1,'测试回合');const o=turn(s,undefined,920040);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[1].suitState.shield,5000);assert.equal(o.fighters[1].hp,9000-damage(o)-3000);assert.equal(o.fighters[1].effects['测试回合'],undefined);assert.ok(o.fighters[1].ailments['疲惫']>=2);assert.equal(o.fighters[1].pp[key(920040)],99);assert.equal(o.fighters[0].hp,4000);assert.equal(damage(o,'percent'),3000);assert.equal(o.fighters[1].stages.def,2);});
test('4347真实35755击败满HP与全部PP，不击败清回合免疫及强化翻倍仍执行',()=>{for(const kill of [false,true]){const s=make({moveId:35755,index:null},{hp:1000,targetHp:kill?1:9000});timer(s,1,'测试回合');s.fighters[0].stages.atk=1;s.fighters[0].pp[key(920031)]=1;const o=turn(s);assert.equal(o.fighters[1].effects['测试回合'],undefined);assert.equal(o.fighters[0].counts.immune,1);assert.equal(o.fighters[0].hp,kill?9000:1000);assert.equal(o.fighters[0].pp[key(920031)],kill?99:1);assert.equal(o.fighters[1].hp===0,kill);}});

test('4347强化魂印对手真实闪避仍算攻击MISS，普通命中分支不重复执行',()=>{for(const soul of [1571,1786]){const s=make({moveId:10006,index:null},{soul,hit:false});s.moveDefinitions[key(10006)].alwaysHit=false;timer(s,1,'物理攻击闪避');const o=turn(s);assert.equal(damage(o),0);assert.equal(damage(o,'percent'),soul===1786?3000:0);assert.equal(o.fighters[0].pp[key(10006)],34);}});

// 外部授予仅作隔离交互对照：保留真实技能ID、版本和原实例参数；不加入4347正式配招。
function sourcedInteractionFixture(s,side,owner,moveId,effectId){
 const src=require('../local-species.cjs').species(owner),m=src.moves.find(x=>x.id===moveId),compiled=E.WIKI.effectsEngine.compileInstances(m.effectInstances,src.effects,m),old=s.fighters[side].moves[1],slot=key(moveId);
 const operations=compiled.operations.filter(x=>x.effectId===effectId);assert.ok(operations.length>0);
 // 仅675原始参数隔离夹具：既有编译器params={}缺口另记，不宣称3564原生接入已修。
 if(owner===3564&&moveId===24231&&effectId===675){assert.equal(m.revision,'seerapi:bab36dda');const x=m.effectInstances.find(x=>x.id===675);assert.deepEqual(x.args,[2]);for(const op of operations)op.params=x.args.slice();}
 s.moveDefinitions[slot]={...s.moveDefinitions[old],...structuredClone(m),id:slot,wikiId:moveId,operations};
 s.fighters[side].moves[1]=slot;s.fighters[side].pp[slot]=m.pp;return m;
}
test('4347已答实际使用攻击包括失明和整招封锁，控制未用不触发且原版仍仅命中',()=>{
 for(const soul of [1571,1786])for(const mode of ['blind','blocked','control']){
  const s=make({moveId:10006,index:null},{soul});if(mode==='blind')s.fighters[0].ailments['失明']=2;if(mode==='blocked')timer(s,0,'attackBlock');if(mode==='control')s.fighters[0].ailments['疲惫']=2;
  const o=turn(s),used=mode!=='control';assert.equal(o.fighters[0].pp[key(10006)],used?34:35);assert.equal(o.fighters[0].soulState.skillUses?.[key(10006)]??0,used?1:0);assert.equal(damage(o),0);assert.equal(damage(o,'percent'),soul===1786&&used?3000:0);assert.equal(!!o.fighters[0].effects['属性技能先制'],soul===1786&&used);
 }
});
test('4347真实2380暴击必中修正原MISS后仅追加一次，不按旧MISS标志重复执行',()=>{
 for(const soul of [1571,1786]){
  let s=make({moveId:10006,index:null},{soul,criticals:true});const m=sourcedInteractionFixture(s,0,3711,29299,2380);assert.equal(m.revision,'seerapi:a9aa55f6');s=turn(s,29299);assert.equal(s.fighters[0].counts.criticalForceHit,2);assert.equal(s.fighters[0].pp[key(29299)],4);
  delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(10006)].alwaysHit=false;s.moveDefinitions[key(10006)].accuracy=0;timer(s,0,'必定暴击');const o=turn(s,10006);assert.ok(damage(o)>0);assert.equal(o.fighters[0].counts.criticalForceHit,1);assert.equal(damage(o,'percent'),3000);assert.equal(o.damageEvents.filter(e=>e.round===o.round-1&&e.type==='percent'&&e.targetSide===1).length,1);assert.equal(o.fighters[0].pp[key(10006)],34);
 }
});
test('4347真实675令非必中暴击全段无效仍属实际攻击，强化仅补一次且原版不追加',()=>{
 for(const soul of [1571,1786]){
  let s=make({moveId:10006,index:null},{soul,criticals:true});const m=sourcedInteractionFixture(s,1,3564,24231,675);assert.equal(m.revision,'seerapi:bab36dda');s=turn(s,920031,24231);assert.equal(s.fighters[1].pp[key(24231)],4);assert.ok(s.fighters[1].effects['非必中暴击无效']);
  delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(10006)].alwaysHit=false;timer(s,0,'必定暴击');const o=turn(s,10006,920043);assert.equal(damage(o),0);assert.equal(damage(o,'percent'),soul===1786?3000:0);assert.equal(o.fighters[0].pp[key(10006)],34);assert.equal(!!o.fighters[0].effects['属性技能先制'],soul===1786);
 }
});

test('4347强化魂印正常命中保留原技能吸取先于魂印回复的既有结算位置',()=>{
 const s=make({moveId:36519,index:null},{soul:1786,hp:8500,aStats:{atk:1000}}),o=turn(s),events=o.damageEvents.filter(e=>e.round===o.round-1&&e.type==='percent'&&e.targetSide===1);assert.ok(damage(o)>350);assert.deepEqual(events.map(e=>e.settledDamage),[3000]);assert.equal(o.turns.at(-1).events.filter(e=>e.kind==='heal').map(e=>e.text).join('|').includes('裁罪高伤回复：回复 0'),true);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].effects['攻击先制'].start,2);assert.equal(o.fighters[0].effects['属性技能先制'],undefined);
});

test('4347授权四互斥版本全部88次真实技能使用及源魂印选择混装拒绝',()=>{const result=require('./helpers/4347-full-versions.cjs')(require('../local-species.cjs').species(4347));assert.equal(result.executed,88);assert.equal(result.combinations.length,4);});

test('4347精确兼容拒绝错误23技能hash与revision、来源魂印标记参数及组合边界',()=>{
 const src=require('../local-species.cjs').species(4347),P=require('../completion-policy.cjs'),reviews=require('../SINGLE-STAGE-REVIEWS.json');assert.deepEqual(E.WIKI.skillVersionIssues(src),[]);let rejected=0;
 for(const m of src.moves)for(const field of ['hash','revision']){const wrong=structuredClone(src);wrong.moves.find(x=>x.id===m.id)[field]='unreviewed';assert.ok(E.WIKI.skillVersionIssues(wrong).includes('追加第五技能来源hash未审核'));rejected++;}assert.equal(rejected,46);
 const changes=[x=>x.source.revision='unreviewed',x=>x.additionalFifths.rawPet.hash='unreviewed',x=>x.souls[0].hash='unreviewed',x=>x.souls[0].source.revision='unreviewed',x=>x.skillVersions[0].soulHash='unreviewed',x=>x.moves[0].advanced=true,x=>x.moves.find(m=>m.id===36519).fifth=false,x=>x.skillVersions[0].moveIds.push(36519),x=>x.skillVersions[0].moveIds.pop(),x=>x.skillVersions[1]=structuredClone(x.skillVersions[0]),x=>x.additionalFifths.rawPet.skill.find(m=>m.skill.id===36519).is_special=false,x=>x.id=999999];
 for(const change of changes){const wrong=structuredClone(src);change(wrong);assert.ok(E.WIKI.skillVersionIssues(wrong).length>0);}
 for(const count of [0,1,3,5]){const wrong=structuredClone(src);wrong.skillVersions=Array.from({length:count},(_,i)=>structuredClone(src.skillVersions[i%4]));assert.ok(E.WIKI.skillVersionIssues(wrong).length>0);}assert.equal(src.skillVersions.length,4);
 const params=structuredClone(src);params.moves.find(m=>m.effectInstances.length).effectInstances[0].args[0]+=1;assert.ok(P.reviewCoverage(params,reviews).stale.length>0);const metadata=structuredClone(src);metadata.effects[0].revision='unreviewed';assert.ok(P.reviewCoverage(metadata,reviews).stale.length>0);
});
