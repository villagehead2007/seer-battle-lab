'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4717-battle.cjs'),{make,turn,timer,source,sum}=H;
const {E}=H;
const row=id=>source.moves.flatMap(m=>m.effectInstances.map((e,index)=>({move:m.id,index,...e}))).find(e=>e.id===id);
test('4717确认独立虚空伤害同时穿过盾免攻限伤且保留资源，封命中载荷则不执行',()=>{
 for(const sealed of [false,true]){const s=make({...row(2253),hp:8000});s.fighters[1].suitState.shield=2000;s.fighters[1].counts.attackNullify=1;timer(s,1,'伤害上限',{amount:50});if(sealed)timer(s,0,'技能命中效果失效');turn(s);assert.equal(sum(s),sealed?0:1000);assert.equal(s.fighters[1].hp,sealed?9000:8000);assert.equal(s.fighters[1].suitState.shield,2000);assert.equal(s.fighters[1].counts.attackNullify,1);}
});
test('4717反转负级遵禁强化，失败不把原负级传对手，成功实际转为正级后附弱',()=>{
 for(const blocked of [false,true]){const s=make(row(1232));s.fighters[0].stages.atk=-3;if(blocked)timer(s,0,'禁强化');turn(s);assert.equal(s.fighters[0].stages.atk,blocked?-3:3);assert.equal(s.fighters[1].stages.atk,blocked?0:-3);}
});
test('4717的2148自身次数免异同源刷新且实际消费，回合免异优先，命中封锁不授予',()=>{
 for(const mode of ['normal','timed','sealed']){const s=make(row(2148));if(mode==='sealed')timer(s,0,'技能命中效果失效');turn(s);assert.equal(s.fighters[0].counts.immune,mode==='sealed'?undefined:1);if(mode==='sealed')continue;turn(s);assert.equal(s.fighters[0].counts.immune,1);if(mode==='timed')timer(s,0,'免异常');let applied;const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);if(e==='afterUse'&&c.a.side===0)applied=c.ailment(c.a,'中毒',c.t);}};try{turn(s,10401);}finally{E.SOULS=old;}assert.equal(applied,false);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(s.fighters[0].counts.immune,mode==='timed'?1:0);assert.equal(s.fighters[1].counts.immune,undefined);}
});
test('4717转态连续削减按当时上限并保持HP直至截顶，不产生伤害事件',()=>{
 const s=make({soul:true,index:-1,move:10401,hp:8000});s.fighters[0].soulState.qualifiedTeamHalf1919=true;turn(s);assert.equal(s.fighters[0].stats.maxHp,8100);assert.equal(s.fighters[0].hp,8000);turn(s);assert.equal(s.fighters[0].stats.maxHp,7290);assert.equal(s.fighters[0].hp,7290);assert.equal((s.damageEvents??[]).filter(e=>e.targetSide===0).length,0);
});
