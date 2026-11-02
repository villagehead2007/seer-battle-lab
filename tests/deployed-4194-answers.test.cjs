'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4194-battle.cjs'),{make,turn,timer,key,E}=H;
const attack=s=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.type==='attack'&&e.sourceSide===0).reduce((n,e)=>n+e.settledDamage,0);
test('4194首击不加，成功攻击物特交替每次威力加30%至120%，全招多段只累积一次',()=>{
 let s=make({moveId:10047,index:null},{soul:1416,omit:true});for(let n=0;n<7;n++){
  s.fighters[0].hp=s.fighters[1].hp=9000;s.fighters[0].pp[key(s.auditMoveId)]=99;delete s.fighters[0].effects['必定暴击'];s.moveDefinitions[key(s.auditMoveId)].kind=n%2?'special':'physical';s.moveDefinitions[key(s.auditMoveId)].power=100;
  const reference=structuredClone(s);reference.fighters[0].soulId=0;reference.moveDefinitions[key(s.auditMoveId)].power=100*(1+Math.min(1.2,n*.3));const o=turn(s),b=turn(reference);assert.equal(attack(o),attack(b));assert.equal(o.fighters[0].soulState.lumAttackChain,n+1);s=o;
 }
 s=make({moveId:10047,index:null},{soul:1416});H.op(s,31,[3,3],s.auditMoveId);assert.equal(turn(s).fighters[0].soulState.lumAttackChain,1);
});
test('4194属性药剂控制MISS封锁均不断连不累计，恢复命中后沿原累计继续',()=>{
 const start=turn(make({moveId:10047,index:null},{soul:1416}));assert.equal(start.fighters[0].soulState.lumAttackChain,1);
 for(const mode of ['status','potion','control','miss','invalid']){
  let s=structuredClone(start);delete s.fighters[0].effects['必定暴击'];if(mode==='status')s=turn(s,920031);else if(mode==='potion')s=E.resolveTurn(s,['potion:hp',key(920041)]);else{if(mode==='control')s.fighters[0].ailments['疲惫']=2;if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}if(mode==='invalid')timer(s,0,'attackBlock',{},2,2);s=turn(s);}
  assert.equal(s.fighters[0].soulState.lumAttackChain,1,mode);assert.equal(s.fighters[0].effects['必定暴击'],undefined);s.moveDefinitions[key(s.auditMoveId)].alwaysHit=true;const o=turn(s);assert.equal(o.fighters[0].soulState.lumAttackChain,2,mode);
 }
});
test('4194只在战阶以整回合正结算攻击总量判一次，恰300不触发，固定附伤不混进攻击统计',()=>{
 for(const total of [1,100,299,300,301]){const s=make({moveId:10047,index:null},{soul:1416});s.moveDefinitions[key(s.auditMoveId)].power=9999;timer(s,1,'攻击伤害上限',{amount:total});const o=turn(s);assert.equal(attack(o),total);assert.equal(!!o.fighters[0].effects['必定暴击'],total<300);if(total<=300)assert.equal(o.fighters[0].soulState.lumPriorityRound,undefined);}
 const s=make({moveId:10047,index:null},{soul:1416});s.moveDefinitions[key(s.auditMoveId)].power=9999;H.op(s,31,[2,2],s.auditMoveId);timer(s,1,'攻击伤害上限',{amount:200});const o=turn(s);assert.equal(attack(o),400);assert.equal(o.fighters[0].effects['必定暴击'],undefined);
 const fixed=make({moveId:10047,index:null},{soul:1416});fixed.moveDefinitions[key(fixed.auditMoveId)].power=0;H.op(fixed,29,[1000],fixed.auditMoveId);const z=turn(fixed);assert.equal(attack(z),0);assert.equal(z.damageEvents.find(e=>e.type==='fixed').settledDamage,1000);assert.equal(z.fighters[0].effects['必定暴击'],undefined);assert.equal(z.fighters[0].soulState.lumPriorityRound,undefined);
 const over=make({moveId:10047,index:null},{soul:1416,targetHp:200});over.moveDefinitions[key(over.auditMoveId)].power=9999;timer(over,1,'攻击伤害上限',{amount:400});timer(over,1,'致命保留',{hp:1});const h=turn(over);assert.equal(attack(h),400);assert.equal(h.damageEvents.find(e=>e.type==='attack').hpLoss,199);assert.equal(h.fighters[0].effects['必定暴击'],undefined);assert.ok(h.fighters[0].soulState.lumPriorityRound===2||h.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===0));
});
test('4194高伤补偿面板攻击一半固定伤害不计等级，只在战阶一次、失败次回合攻击先制1',()=>{
 let yes=false,no=false;for(let seed=0;seed<70;seed++)for(const stage of [-6,0,6]){
  const s=make({moveId:10047,index:null},{soul:1416,seed});s.fighters[0].stages.atk=stage;s.moveDefinitions[key(s.auditMoveId)].power=9999;timer(s,1,'攻击伤害上限',{amount:400});const o=turn(s);const fixed=(o.damageEvents??[]).filter(e=>e.type==='fixed'&&e.sourceSide===0);assert.ok(fixed.length<=1);if(fixed.length){yes=true;assert.equal(fixed[0].settledDamage,90);}else{no=true;assert.equal(o.fighters[0].soulState.lumPriorityRound,2);}assert.equal(o.fighters[0].effects['必定暴击'],undefined);
 }assert.ok(yes&&no);
});
test('4194未使用攻击或控制MISS封锁完全免伤的0攻击伤害不获得下回合必暴',()=>{
 for(const mode of ['status','control','miss','invalid','immune']){const s=make({moveId:10047,index:null},{soul:1416});if(mode==='control')s.fighters[0].ailments['疲惫']=2;if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;}if(mode==='invalid')timer(s,0,'attackBlock');if(mode==='immune')timer(s,1,'当回合免伤');const o=turn(s,mode==='status'?920031:s.auditMoveId);assert.equal(attack(o),0);assert.equal(o.fighters[0].effects['必定暴击'],undefined);assert.equal(o.fighters[0].soulState.lumPriorityRound,undefined);}
});
test('4194低伤必暴在次回合实际生效且不用攻击则到期，高伤失败先制只给次回合攻击',()=>{
 const low=turn(make({moveId:10047,index:null},{soul:1416})),base=structuredClone(low);delete base.fighters[0].effects['必定暴击'];assert.ok(Math.abs(attack(turn(low))-2*attack(turn(base)))<=1);const expired=turn(low,920031);assert.equal(expired.fighters[0].effects['必定暴击'],undefined);
 let found=false;for(let seed=0;seed<40&&!found;seed++){const s=make({moveId:10047,index:null},{soul:1416,seed,aStats:{spe:1},bStats:{spe:900}});s.moveDefinitions[key(s.auditMoveId)].power=9999;timer(s,1,'攻击伤害上限',{amount:400});const o=turn(s);if(o.fighters[0].soulState.lumPriorityRound===2){found=true;for(const isAttack of [true,false]){const n=turn(o,isAttack?s.auditMoveId:920031);assert.equal(n.turns.at(-1).first,isAttack?0:1);}}}assert.equal(found,true);
});
