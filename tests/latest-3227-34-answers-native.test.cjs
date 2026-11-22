'use strict';const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),Q=require('./helpers/3227-native.cjs');
function make(id,move,enemy,enemyMove,o={}){const a=store.species(id),b=store.species(enemy),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000},s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[move]),loadout(b,[enemyMove])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});Object.assign(s.fighters[0].effects,o.effects??{});if(o.enemyHp!==undefined)s.fighters[1].hp=o.enemyHp;if(o.hp!==undefined)s.fighters[0].hp=o.hp;return s;}
const turn=(s,a,b='potion:pp')=>E.resolveTurn(s,[typeof a==='number'?'wiki:'+a:a,typeof b==='number'?'wiki:'+b:b]),events=(s,side,type)=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.sourceSide===side&&e.type===type),sum=(s,side,type)=>events(s,side,type).reduce((n,e)=>n+e.settledDamage,0);
test('用户统一34通用符文锁链和星光克制均按本回合完整红伤二倍造成真伤，不附本体红或固定反馈',()=>{
 for(const[id,move]of[[3237,22193],[4648,10020]]){const s=turn(make(id,move,2989,10086),move,10086),red=sum(s,1,'attack');assert.ok(red>0);assert.equal(sum(s,0,'true'),red*2,String(id));assert.equal(sum(s,0,'fixed'),0);assert.equal(sum(s,0,'attack'),0);}
});
test('用户34只计红伤输入，原对手附固定百分比和真实伤害均不参与反馈',()=>{
 for(const[enemy,move,type,effects]of[[3227,10250,'fixed',{}],[3211,25114,'percent',{}],[4875,29276,'true',{固定百分比免疫:{start:1,end:1}}]]){const s=turn(make(3237,22193,enemy,move,{effects,...(enemy===3211?{enemyHp:4000}:{})}),22193,move);assert.ok(sum(s,1,type)>0,String(enemy));assert.equal(sum(s,0,'true'),sum(s,1,'attack')*2,String(enemy));assert.equal(sum(s,0,'fixed'),0);}
});
test('用户34累计本回合全部红段，不取最近一段，魂425百分比吸取仍排除',()=>{
 const s=turn(make(3237,22193,3079,16103,{effects:{免异常:{start:1,end:1}}}),22193,16103),hits=events(s,1,'attack');assert.ok(hits.length>=2);assert.ok(sum(s,1,'percent')>0);assert.equal(sum(s,0,'true'),hits.reduce((n,e)=>n+e.settledDamage,0)*2);
});
test('用户34不带入上回合受伤，当前回合对手吃药则无反馈',()=>{
 let s=turn(make(3237,22193,2989,10086),'potion:pp',10086);assert.ok(sum(s,1,'attack')>0);s=turn(s,22193);assert.equal(sum(s,1,'attack'),0);assert.equal(sum(s,0,'true'),0);assert.equal(sum(s,0,'fixed'),0);
});
test('用户34按完整结算红伤，原有1HP受保命命中后实际损失0也反馈真实二倍',()=>{
 const s=turn(make(3237,22193,2989,10086,{hp:1,effects:{致命保留:{start:1,end:2,hp:1}}}),22193,10086),red=events(s,1,'attack');assert.equal(s.fighters[0].hp,1);assert.ok(red.reduce((n,e)=>n+e.settledDamage,0)>0);assert.equal(red.reduce((n,e)=>n+e.hpLoss,0),0);assert.equal(sum(s,0,'true'),sum(s,1,'attack')*2);
});
test('用户1062禁强化仍清敌但不获强化不授吸血，保护仍挡清强，完整67和两原魂不删除',()=>{
 for(const soul of[552,553])for(const mode of['normal','ban','protect','ban-protect','none']){const old=E.WIKI.effectsEngine,hp=[];E.WIKI.effectsEngine={...old,run(phase,ops,c){const out=old.run(phase,ops,c);if(phase==='afterHit'&&c.a.side===0&&(c.m.wikiId??c.m.id)===30095)hp.push(c.a.hp);return out;}};let s;try{s=Q.turn(Q.make(30095,{soul,aHp:1000,aStages:{acc:6},aStats:{def:400,spd:400},bStats:{def:400,spd:400},bStages:mode==='none'?{}:{atk:2,def:1},aEffects:mode.includes('ban')?{禁强化:{start:1,end:3}}:{},bEffects:mode.includes('protect')?{强化保护:{start:1,end:3}}:{}}),30095);}finally{E.WIKI.effectsEngine=old;}const success=mode==='normal';assert.equal(s.fighters[1].stages.atk,mode.includes('protect')?2:0,mode);assert.equal(s.fighters[0].stages.atk,success?2:0,mode);assert.equal(Q.damage(s,'percent'),success?3000:0,mode);assert.deepEqual(hp,[success?4000:1000],mode);assert.equal(s.fighters[0].soulId,soul);}
});
test('用户奇拉美两招783仅真实清强或吸强反击三分一，直接143反转不触发',()=>{
 for(const soul of[552,553])for(const move of[24579,24632])for(const other of[15882,30145,23240]){let s=Q.turn(Q.make(move,{soul,extraMoves:[20521],enemyId:3240,enemyMoves:[other,15882,20230]}),move);assert.equal(s.fighters[0].stages.atk,1);s=Q.turn(s,'potion:pp',other);assert.equal(s.fighters[0].stages.atk,other===23240?-1:0);assert.equal(Q.damage(s,'percent'),other===23240?0:3000,String(move)+'/'+other);if(other!==15882){s=Q.turn(s,'potion:pp',15882);assert.equal(Q.damage(s,'percent'),0,'无正级时清强失败不反击');}else{s=Q.turn(s,'potion:pp',20230);if(move===24632)s=Q.turn(s,'potion:pp');s=Q.turn(s,20521,15882);assert.equal(s.fighters[0].stages.def,0,'实际清除了原沉默的双防正级');assert.equal(Q.damage(s,'percent'),0,'783过期后不反击');}}
});
test('用户677已发动后真实MISS或整招封锁仍吸强，吃药和控制未用不吸，正常PP保留原57及843',()=>{
 for(const soul of[552,553])for(const mode of['miss','invalid','item','protected']){let s=Q.turn(Q.make(25153,{soul,extraMoves:[10250],enemyMoves:[20889],aStats:{spe:4000},bEffects:mode==='protected'?{强化保护:{start:2,end:2}}:{},aEffects:mode==='miss'?{攻击必失:{start:2,end:2}}:mode==='invalid'?{skillBlock:{start:2,end:2}}:{}}),25153,20889);assert.equal(s.fighters[1].stages.spe,1);const pp=s.fighters[0].pp['wiki:10250'];s=Q.turn(s,mode==='item'?'potion:pp':10250);assert.equal(s.fighters[1].stages.spe,['item','protected'].includes(mode)?1:0,mode);assert.equal(s.fighters[0].stages.spe,['item','protected'].includes(mode)?0:1,mode);if(mode!=='item')assert.equal(s.fighters[0].pp['wiki:10250'],pp-1);}
 const s=Q.turn(Q.make(25153,{extraMoves:[10250],aAilments:{疲惫:1},aEffects:{用招吸强:{start:1,end:2}},bStages:{spe:1}}),10250);assert.equal(s.fighters[1].stages.spe,1);assert.equal(s.fighters[0].pp['wiki:10250'],Q.source.moves.find(m=>m.id===10250).pp);
 let expiry=Q.turn(Q.make(25153,{extraMoves:[10250],enemyMoves:[20889],aStats:{spe:4000},aEffects:{攻击必失:{start:2,end:2}}}),25153,20889);expiry=Q.turn(expiry,10250);assert.equal(expiry.fighters[1].stages.spe,0);expiry=Q.turn(expiry,'potion:pp',20889);expiry=Q.turn(expiry,10250);assert.equal(expiry.fighters[1].stages.spe,1,'两回合到期后真实用招不再吸强');
});
