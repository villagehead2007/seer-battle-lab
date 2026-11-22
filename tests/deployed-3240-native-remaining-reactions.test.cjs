'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240原两招164：真实攻击命中含零红触发害怕，MISS封招属性和免异分支保留',()=>{
 for(const move of[24065,25179])for(const mode of['normal','zero','miss','invalid','status','immune']){const enemy=mode==='status'?20889:10086,s=H.turn(H.make(move,{enemyMoves:[enemy],aStages:{acc:6},bStages:{acc:6},aEffects:mode==='zero'?{攻击伤害免疫:{start:1,end:1}}:{},bEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:mode==='invalid'?{skillBlock:{start:1,end:1}}:mode==='immune'?{免异常:{start:1,end:1}}:{}}),move,enemy);assert.equal(Boolean(s.fighters[1].ailments.害怕),['normal','zero'].includes(mode),move+mode);assert.equal(H.damage(s,'attack',1)>0,['normal','immune'].includes(mode));assert.equal(s.fighters[1].pp['wiki:'+enemy],s.moveDefinitions['wiki:'+enemy].pp-1);}
});
test('3240原164从当回合起三回，最后一回攻击仍判定且第四回已到期，不因药剂暂停',()=>{
 for(const move of[24065,25179]){let s=H.make(move,{enemyMoves:[10086],bStages:{acc:6},bEffects:{免异常:{start:1,end:3}}});for(let r=1;r<=4;r++){s=H.turn(s,r===1?move:'potion:pp',10086);assert.equal(s.fighters[1].ailments.害怕,undefined);assert.ok(H.damage(s,'attack',1)>0);assert.equal(s.turns.at(-1).events.some(e=>/免疫害怕/.test(e.text)),r<=3);if(r<3)assert.equal(s.fighters[0].effects.受击异常.end,3);}assert.equal(s.fighters[0].effects.受击异常,undefined);}
});
test('3240摄魄60当回合至第三回固定200，药剂和疲惫未出招仍结算，第四回消失及免固独立',()=>{
 for(const mode of['normal','controlled','immune']){let s=H.make(24065,{aAilments:mode==='controlled'?{疲惫:2}:{},aEffects:mode==='controlled'?{每回合附加固伤:{start:1,end:3,amount:200}}:{},bGear:mode==='immune'?{resistance:{fixed:100}}:{}});for(let r=1;r<=4;r++){s=H.turn(s,r===1&&mode!=='controlled'||mode==='controlled'&&r<=2?24065:'potion:pp');assert.equal(H.damage(s,'fixed'),mode==='immune'||r>3?0:200);if(mode==='controlled'&&r<=2)assert.equal(s.fighters[0].pp['wiki:24065'],5);}}
});
test('3240摄魄694下两回合仅攻击必先，第三次攻击回归真实低速度顺序，魂564独立消耗',()=>{
 const attack=H.source.moves.find(m=>m.kind!=='status'&&!m.fifth&&!m.priority).id;for(const statusSecond of[false,true]){let s=H.make(24065,{extraMoves:[attack,23241],enemyMoves:[10086],aStats:{spe:1,atk:9999,spa:9999},bStats:{spe:4000,def:300,spd:300},aStages:{acc:6},bStages:{acc:6},bEffects:{免异常:{start:1,end:6}}});for(let r=1;r<=4;r++){const move=r===1?24065:r===2&&statusSecond?23241:attack;s=H.turn(s,move,10086);assert.equal(s.turns.at(-1).first,r===3||r===2&&!statusSecond?0:1,'R'+r);if(move===attack)assert.ok(H.damage(s,'attack')>=280,'原魂564低伤先制条件未满足');}}
});
