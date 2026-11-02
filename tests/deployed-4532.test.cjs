'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4532-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
const damage=(s,type,side)=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.sourceSide===side&&x.type===type).reduce((n,x)=>n+x.settledDamage,0);

test('4532最新封锁确认：痕消费及PP照常，零威力1673最低666词条关闭，独立1745用后固伤仍触发',()=>{
 const s=make(e(1673),{soul:1745});s.fighters[0].soulState.jiHen1745=true;s.moveDefinitions[key(s.auditMoveId)].priority=3;
 const o=turn(s);assert.equal(o.fighters[0].pp[key(s.auditMoveId)],s.fighters[0].pp[key(s.auditMoveId)]-1);
 assert.equal(o.fighters[0].soulState.jiHen1745,undefined);assert.equal(damage(o,'attack',0),0);assert.equal(damage(o,'fixed',0),300);assert.ok(o.fighters[1].hp>0);
 o.fighters[0].pp[key(o.auditMoveId)]=1;const next=turn(o);assert.ok(damage(next,'attack',0)>=666||next.fighters[1].hp===0,'下一次技能不继承已消费封锁');
});

test('4532最新封锁确认：全部技能阶段含固有补偿关闭，独立魂印1728属性用后百分比伤害保留',()=>{
 const soul=require('../research/4516-reviewed-snapshot.json').souls.find(x=>x.id===1728);
 const s=make(e(2051),{soulRecord:soul});timer(s,0,'技能命中效果失效');s.fighters[0].counts.nextSkillInvalid=1;
 const o=turn(s);assert.equal(o.fighters[0].soulState.jiKe1745,undefined);assert.equal(damage(o,'percent',0),150);assert.equal(o.fighters[0].pp[key(s.auditMoveId)],s.fighters[0].pp[key(s.auditMoveId)]-1);
 const q=make(e(1673));timer(q,0,'技能命中效果失效');const z=turn(q);assert.equal(damage(z,'attack',0),0);assert.ok(z.fighters[1].hp>0);
});

test('4532用户005补充：2050重复授予刷新一次，匹配最终先制扣PP及次数，技能强化关闭但魂印回复保留',()=>{
 const soul=source.souls.find(x=>x.id===1745);let s=make(e(2050),{enemySoul:soul});
 s=turn(s);s=turn(s);assert.equal(s.fighters[1].soulState.ji2050.count,1);
 H.op(s,4,[0,100,2],920041);s.moveDefinitions[key(920041)].priority=2;s.fighters[1].hp=1000;s.moveDefinitions[key(920031)].priority=3;
 const before=s.fighters[1].pp[key(920041)],o=turn(s,920031,920041);
 assert.equal(o.fighters[1].soulState.ji2050,undefined);assert.equal(o.fighters[1].pp[key(920041)],before-1);
 assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].hp,1500);
});

test('4532用户005边界：控制和0PP不消费，基础先制1被封为0不匹配，最终先制3不匹配',()=>{
 for(const mode of ['control','noPP','sealed','three']){
  let s=turn(make(e(2050)));s.moveDefinitions[key(920040)].priority=1;
  if(mode==='control')s.fighters[1].ailments['疲惫']=s.round+1;
  if(mode==='sealed')timer(s,1,'先制效果失效');if(mode==='three')timer(s,1,'id984',{amount:2});
  let before=s.fighters[1].pp[key(920040)],o;if(mode==='noPP'){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='roundStart'&&c.a.side===1)c.a.pp[key(920040)]=0;}};try{o=turn(s,920031,920040);before=0;}finally{E.SOULS=old;}}else o=turn(s,920031,920040);assert.equal(o.fighters[1].soulState.ji2050.count,1);
  assert.equal(o.fighters[1].pp[key(920040)],before-(mode==='control'||mode==='noPP'?0:1));
  if(mode==='sealed'||mode==='three')assert.ok(damage(o,'attack',1)>0);
 }
});

test('4532用户003：579在回合末判定，命中后自身死亡不复活、随后敌死亡不回复、禁疗到期前仍生效',()=>{
 const x=e(579),s=make(x,{hp:1});s.fighters[0].effects['攻击必中']={start:1,end:99};
 const dead=turn(s,undefined,920040);assert.equal(dead.fighters[0].hp,0);
 const q=make(x,{hp:1000});timer(q,0,'技能禁疗',{},1,1);assert.equal(turn(q).fighters[0].hp,1000);
 const z=make(x,{hp:1000,targetHp:1});assert.equal(turn(z).fighters[0].hp,1000);
 const late=make(x,{hp:1000,targetHp:500});late.fighters[1].ailments['烧伤']=1;const ended=turn(late);assert.equal(ended.fighters[1].hp,0);assert.equal(ended.fighters[0].hp,1000);
 const miss=make(x,{hp:1000});miss.fighters[0].ailments['失明']=2;assert.equal(turn(miss).fighters[0].hp,1000);
});

test('4532全部22真实技能与原魂印1745：完整原效果、合法第五、真实使用和PP消费',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,22);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(28384))ids[ids.length-1]=28384;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1745);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
  if(m.id===28384)assert.equal(o.fighters[0].hp,0);
 }
});
