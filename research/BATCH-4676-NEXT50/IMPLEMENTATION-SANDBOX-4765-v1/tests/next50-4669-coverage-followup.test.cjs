'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {key,stats,make,turn,timed,dmg}=require('./helpers/4669-battle.cjs');
test('4669/978真实吸取敌攻击2与特攻1后反转为负2负1，自身对应提升且实际耗PP',()=>{
 const s=make(37500,0);s.fighters[1].stages.atk=2;s.fighters[1].stages.spa=1;
 turn(s,37500,20030);assert.equal(s.fighters[0].stages.atk,2);assert.equal(s.fighters[0].stages.spa,1);assert.equal(s.fighters[1].stages.atk,-2);assert.equal(s.fighters[1].stages.spa,-1);assert.equal(s.fighters[0].pp[key(37500)],19);assert.ok(dmg(s)>0);
});
test('4669/978上限与强化保护真实分歧诊断前保留两端阶段且本次已用PP消耗',()=>{
 for(const kind of ['cap','protect']){const s=make(37500,0);s.fighters[1].stages.atk=2;if(kind==='cap')s.fighters[0].stages.atk=5;else timed(s.fighters[1],'强化保护');let live;
 turn(s,37500,20030,{before(ev,c){if(ev==='beforeUse'&&c.a.side===0)live=c;}});assert.equal(live.a.stages.atk,kind==='cap'?6:0);assert.equal(live.t.stages.atk,kind==='cap'?-2:2);assert.equal(live.a.pp[key(37500)],19);}
});
test('4669/1711真实负阶不可解除时维持负2且不附焚烬，原成功载荷不被误执行',()=>{
 const s=make(37502,1);s.fighters[0].stages.atk=-2;timed(s.fighters[0],'弱化不可解除反转');turn(s,37502,20030);assert.equal(s.fighters[0].stages.atk,-2);assert.equal(s.fighters[1].ailments['焚烬'],undefined);assert.equal(s.fighters[0].pp[key(37502)],4);
});
test('4669/993禁强化真实阻止六项提升，敌烧伤不绕过强化门禁且正常耗PP',()=>{
 const s=make(28804,0);timed(s.fighters[0],'禁强化');s.fighters[1].ailments['烧伤']=3;turn(s,28804,20030);assert.deepEqual(stats.map(k=>s.fighters[0].stages[k]),Array(6).fill(0));assert.equal(s.fighters[0].pp[key(28804)],4);
});
test('4669/541真实高于300本体红伤不回复400，保持受伤HP与实际PP',()=>{
 const s=make(37503,0,{hp:1000,aStats:{atk:3000}});turn(s,37503,20030);assert.ok(dmg(s)>=300);assert.equal(s.fighters[0].hp,1000);assert.equal(s.fighters[0].pp[key(37503)],4);
});
test('4669/693下2回合红伤实际增加50且第四轮到期恢复基线',()=>{
 const a=make(28804,2),b=make(28804,2);turn(a,28804,20030);turn(b,20267,20030);
 for(let r=2;r<=4;r++){turn(a,10086,20030);turn(b,10086,20030);const x=dmg(a),y=dmg(b);assert.ok(y>0);if(r<=3)assert.ok(Math.abs(x-y*1.5)<=2);else assert.equal(x,y);assert.equal(a.fighters[0].pp[key(10086)],35-(r-1));}
});
test('4669/843下2回合真实优先2第四轮恢复0，619仅下一轮敌优先负1随后恢复',()=>{
 const a=make(28804,3);turn(a,28804,20030);for(let r=2;r<=4;r++){turn(a,10086,10086);assert.equal(a.fighters[0].soulState.resolvedPriority.value,r<=3?2:0);}
 const b=make(37503,3);turn(b,37503,20030);turn(b,10086,10086);assert.equal(b.fighters[1].soulState.resolvedPriority.value,-1);turn(b,10086,10086);assert.equal(b.fighters[1].soulState.resolvedPriority.value,0);assert.equal(b.fighters[0].pp[key(10086)],33);
});
