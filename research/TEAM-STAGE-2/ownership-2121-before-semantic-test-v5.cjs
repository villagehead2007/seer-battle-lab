'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/report-restriction-native.cjs');
const {T,member,pp}=H;
const defs=[{id:4620,move:37211,amount:2700,field:'candle2121Continue'},{id:4753,move:37893,amount:2250,field:'continuations2121_4753'},{id:4923,move:38460,amount:2700,field:'continuations2121_4753'}];
function prepare(d,lethal){
 const weak=member(3575,[10234],{atk:180,spe:100});
 const attack=d.id===4620?10993:10001;
 const strong=member(d.id===4620?5000:3008,[attack],{atk:9999,spa:9999,spe:100});strong.build.resistance.percent=100;
 let g=T.create([[member(d.id,[d.move],{def:lethal?1:4000,spd:lethal?1:4000,spe:4000}),member(3002,[10250],{def:1}),member(3004,[10611],{def:1})],[weak,strong]],[1,0],{seed:14,criticals:false});
 g=T.turn(g,[pp,'wiki:10234']);assert.ok(g.battle.fighters[0].hp>0&&g.battle.fighters[0].hp<6000);
 g=T.turn(g,[{switchTo:2},'wiki:10234']);assert.ok(g.battle.fighters[0].hp>0&&g.battle.fighters[0].hp<6000);
 g=T.turn(g,[{switchTo:0},{switchTo:1}]);
 const round=g.battle.round;g=T.turn(g,['wiki:'+d.move,lethal?'wiki:'+attack:pp]);
 assert.ok(g.battle.fighters[0].soulState[d.field]);
 assert.equal(strong.build.resistance.percent,100);
 assert.ok(!g.battle.damageEvents.some(e=>e.round===round&&e.sourceSide===0&&e.type==='percent'&&e.hpLoss>0));
 return g;
}
test('4620原2121下一回合真实主动换人，由当前队友在回合末吸取且不复制延续',()=>{
 const d=defs[0];let g=prepare(d,false);const before=g.slots[0][1].fighter.hp;
 g=T.turn(g,[{switchTo:1},pp]);assert.equal(g.battle.fighters[0].hp,Math.min(9000,before+d.amount));
 assert.equal(g.battle.fighters[0].soulState[d.field],undefined);assert.equal(g.slots[0][0].fighter.soulState[d.field],undefined);
 const after=g.battle.fighters[0].hp;g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,after);
});
for(const d of defs)test(d.id+'原2121施法后真实红伤阵亡，下一轮接替者按原时点消费一次延续'+d.amount,()=>{
 let g=prepare(d,true);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].hp,0);
 const before=g.slots[0][1].fighter.hp;g=T.replace(g,[1,null]);assert.ok(g.battle.fighters[0].soulState[d.field]);
 assert.equal(g.slots[0][0].fighter.soulState[d.field],undefined);
 g=T.turn(g,[d.id===4620?pp:'wiki:10250',pp]);assert.equal(g.battle.fighters[0].hp,Math.min(9000,before+d.amount));
 assert.ok(!g.battle.fighters[0].soulState[d.field]||g.battle.fighters[0].soulState[d.field].length===0);
 const after=g.battle.fighters[0].hp;g=T.turn(g,[pp,pp]);assert.equal(g.battle.fighters[0].hp,after);
});
