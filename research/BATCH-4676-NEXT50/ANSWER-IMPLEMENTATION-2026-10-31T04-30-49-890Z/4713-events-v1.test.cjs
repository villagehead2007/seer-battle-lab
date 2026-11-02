'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4713-battle.cjs'),{E,make,turn}=H;
test('4713致死攻击先触发死亡和击败事件，再回归登场HP，保留原有PP异常和能力状态',()=>{
 const s=make({move:20038,index:-1,soul:true,hp:1000,aStats:{def:1},bStats:{atk:9999},enemyLoadout:[10047,20038,20195,20136,37755]});s.fighters[0].stages.acc=-2;s.fighters[0].ailments['诅咒']=10;const beforePP=s.fighters[0].pp['wiki:20038'],events=[],old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='death'&&c.a.side===0)events.push({event,hp:c.a.hp,used:!!c.a.soulState.rewindUsed1916});if(event==='opponentDefeated'&&c.a.side===1)events.push({event,hp:c.t.hp});}};
 try{turn(s,20038,10047);}finally{E.SOULS=old;}
 assert.deepEqual(events,[{event:'death',hp:0,used:false},{event:'opponentDefeated',hp:0}]);assert.equal(s.fighters[0].soulState.rewindEvents1916[0].phase,'after-death');assert.equal(s.fighters[0].soulState.rewindEvents1916[0].hpAfter,9000);assert.equal(s.fighters[0].pp['wiki:20038'],beforePP-1);assert.equal(s.fighters[0].stages.acc,-2);assert.ok(s.fighters[0].ailments['诅咒']);assert.ok(s.fighters[0].hp>0);
});
test('4713第五红伤击败对手自留1HP，消除成功只登记真正下只出场回复，不给自己回满',()=>{
 const s=make({move:37755,hp:1000});s.fighters[1].hp=1;s.fighters[1].stages.atk=2;turn(s,37755,20038);assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].hp,1);assert.equal(s.healthLossEvents.find(e=>e.targetSide===0).hpLoss,999);assert.equal(s.fighters[0].soulState.successor1979.restoreHp,true);assert.equal(s.fighters[0].soulState.successor1979.restorePP,true);assert.equal(s.fighters[0].soulState.successor1979.status,'deferred-real-next-ally');assert.equal(s.fighters[0].pp['wiki:37755'],9);
});
