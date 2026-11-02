'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4711-battle.cjs'),{E}=H;
test('4711先盾后罩，护盾消失事件时护罩仍保留，随后护罩消失回血且按消耗前条件不增长减伤',()=>{
 const s=H.make({soul:true,index:-1,move:28932,hp:1000});
 const old=E.SOULS,events=[];E.SOULS={...old,run(event,c){old.run(event,c);if(event==='opponentBeforeUse'&&c.a.side===0)c.a.soulState.barrierGoneHeal=100;if(event==='allShieldsGone'&&c.a.side===0)events.push({barrier:c.a.suitState.barrier,hp:c.a.hp});}};
 try{H.turn(s,28932,28931);}finally{E.SOULS=old;}
 assert.deepEqual(events,[{barrier:236,hp:1000}]);assert.equal(s.fighters[0].hp,1100);assert.equal(s.fighters[0].suitState.barrier,0);assert.equal(s.fighters[0].soulState.solver1913.red,0);assert.equal(s.fighters[0].soulState.solver1913.pink,0);assert.equal(H.sum(s,'percent'),236);
});
