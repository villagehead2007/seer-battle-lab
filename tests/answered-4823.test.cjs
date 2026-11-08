'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4823/snapshot.json');
const {E,make,turn,timer}=require('./helpers/remaining-battle.cjs')(source);
test('4823已答冻伤减半：5取2、1取0，立即清除零时长，减少回合数决定本次减伤',()=>{
 for(const n of [1,3,5,9,10]){const s=make({move:10001,soul:true}),remaining=Math.floor(n/2);s.fighters[0].ailments['冻伤']=n;
 const old=E.SOULS;let atUse,reduction;
 E.SOULS={...old,run(event,c){old.run(event,c);if(event==='opponentBeforeUse'&&c.a.side===0)atUse={end:c.a.ailments['冻伤'],removed:c.a.soulState.snow2014.removed};if(event==='beforeIncomingAttack'&&c.a.side===0)reduction=c.reduction;}};
 try{turn(s,10001,10127);}finally{E.SOULS=old;}
 assert.equal(atUse.removed,n-remaining);assert.equal(atUse.end,remaining===0?undefined:remaining);assert.ok(Math.abs(reduction-(n-remaining)/10)<1e-9);
 assert.equal(s.fighters[0].soulState.snow2014.end,Math.max(0,remaining-1));
 }
});
test('4823已答冻伤减半：未实际用招和属性不减半，免异导致无冻伤不创设状态，连续攻击按当前剩余值取整',()=>{
 const blocked=make({move:10001,soul:true});blocked.fighters[0].ailments['冻伤']=5;blocked.fighters[1].ailments['疲惫']=3;turn(blocked,10001,10127);assert.equal(blocked.fighters[0].soulState.snow2014.removed,0);
 const status=make({move:10001,soul:true});status.fighters[0].ailments['冻伤']=5;turn(status);assert.equal(status.fighters[0].soulState.snow2014.removed,0);
 const immune=make({move:10001,soul:true,selfEntryImmune:1});turn(immune,10001,10127);assert.equal(immune.fighters[0].ailments['冻伤'],undefined);assert.equal(immune.fighters[0].soulState.snow2014.removed,0);
 const repeat=make({move:10001,soul:true});repeat.fighters[0].ailments['冻伤']=5;timer(repeat,1,'免异常');turn(repeat,10001,10127);assert.equal(repeat.fighters[0].ailments['冻伤'],2);turn(repeat,10001,10127);assert.equal(repeat.fighters[0].ailments['冻伤'],undefined);assert.equal(repeat.fighters[0].soulState.snow2014.removed,1);
});
