'use strict';
const assert=require('node:assert/strict'),E=require('../../dist/engine.js'),T=require('../../dist/team-engine.js'),store=require('../../local-species.cjs'),{loadout}=require('./3001-native.cjs');
const rows=[
 [3017,387,null,.6,'塔克林魂印吸血'],[3019,390,10157,.4,'伊维特魂印吸血'],[3031,400,null,.5,'鬼神魂印吸血'],[3240,564,10535,.6,'邪灵王魂印吸血'],[3425,740,10047,.5,'奥斯卡魂印吸血'],[3425,1030,10047,.5,'奥斯卡魂印吸血'],[3432,748,null,.5,'柯尔霍德低体吸血'],[3686,969,10194,.5,'妖皇魂印特攻回复'],[3875,1145,10127,.5,'暗战攻击回复'],[3875,1446,10127,.5,'暗战攻击回复'],[4430,1645,12897,.5,'极光攻击伤害回复'],[4732,1930,10001,.05,'闪光皮神存活队友攻击吸血']
,[3652,937,12151,.5,'赛伯魂印攻击回复'],[3652,1475,12151,.5,'赛伯魂印攻击回复'],[3815,1090,10499,.5,'燃血攻击回复'],[3815,1129,10499,.5,'燃血攻击回复'],[3940,1203,10127,.5,'吕布非满体吸血'],[3940,1241,10127,1,'吕布非满体吸血'],[3432,2150,10001,.5,'弥沦之镜攻击回复']];
function member(id,soul,moves=[]){const snapshot=store.species(id);if(soul)snapshot.selectedSoulId=soul;const picked=loadout(snapshot,moves);assert.equal(E.WIKI.assess(snapshot,picked).issues.length,0);return{snapshot,moves:picked,build:{overrides:{maxHp:9000,atk:9999,spa:9999,def:4000,spd:4000,spe:9999}}};}

function verifySoul(id,soul,floor){const row=rows.find(x=>x[0]===id&&x[1]===soul);assert.ok(row);const[,,requestedMove,fraction,label]=row;
 const source=store.species(id),move=requestedMove??source.moves.find(m=>m.power>0&&!m.fifth&&!m.effectInstances.length).id,actor=member(id,soul,[move]),foe=member(2989);foe.build.overrides.def=1;foe.build.overrides.spd=1;
 let g=T.create([[actor,...(soul===1930?[member(3013)]:[])],[foe]],[0,0],{seed:14,criticals:false});g.battle.fighters[0].hp=1000;g.battle.fighters[1].hp=1;if(floor)g.battle.fighters[1].effects.致命保留={start:1,end:5,hp:1};if([1090,1129].includes(soul)){g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.fighters[0].soulState.bloodBurnRound,g.battle.round,'先由真实低体战阶开启次回合燃血');}
 const observations=[],old=E.SOULS;E.SOULS={...old,run(event,c){if(c.a.side!==0)return old.run(event,c);return old.run(event,{...c,heal(f,n,source,...rest){if(source===label)observations.push({n,settled:c.settledDamage,hpLoss:c.hpLoss??c.dealt,type:c.type,event});return c.heal(f,n,source,...rest);}});}};
 try{g=T.turn(g,['wiki:'+move,'potion:pp']);}finally{E.SOULS=old;}
 const red=(g.battle.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===0);assert.ok(red.length>0);assert.ok(red.reduce((n,e)=>n+e.settledDamage,0)>1);assert.equal(red.reduce((n,e)=>n+e.hpLoss,0),floor?0:1);assert.equal(observations.length,1,'原魂印攻击回血实际执行一次：'+label);const h=observations[0];assert.ok(h.settled>1);const expected=soul===2150?Math.floor(h.settled*fraction):h.settled*fraction;assert.equal(h.n,expected,'请求回复按完整结算红伤，不能按对手1点实际HP损失');assert.equal(g.battle.fighters[0].hp,Math.min(9000,1000+Math.floor(h.n)),'实际回HP仍受上限约束');
return {id,soul,floor,completeRed:h.settled,requestedHeal:h.n,expected};}
module.exports={verifySoul,rows};
