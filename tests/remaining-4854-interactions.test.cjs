'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4854/snapshot.json'),{E,make,turn,timer,sum}=require('./helpers/remaining-battle.cjs')(source);
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);fn(e,c);}};try{return run();}finally{E.SOULS=old;}}
test('4854魂印吸取回血不受技能禁疗，属性命中封锁只封技能效果；死亡不触发受击中毒或吸取复活',()=>{
 const a=make({move:20249,soul:true,hp:1000});timer(a,0,'技能禁疗');timer(a,0,'属性技能命中效果失效');turn(a);assert.equal(a.fighters[0].stages.spe,0);assert.equal(a.fighters[0].hp,1050);assert.equal(sum(a,'fixed'),50);
 const b=make({move:10062,index:-1,soul:true,hp:1});turn(b,10062,10127);assert.equal(b.fighters[0].hp,0);assert.equal(b.fighters[1].ailments['中毒'],undefined);assert.equal(sum(b,'fixed'),0);
});
test('4854/125已知首段限红300不误限固定百分比真实伤害，162已答固定输出遵守免疫',()=>{
 const a=make({move:38203,index:1,bStats:{atk:9999}}),got=[];observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1)for(const type of['fixed','percent','true'])got.push(c.hurt(c.t,1000,'三类非红',type));},()=>turn(a,38203,10127));assert.deepEqual(got,[1000,1000,1000]);assert.equal(sum(a,'attack',1),300);assert.equal(a.fighters[0].hp,5700);
 const b=make({move:38205,index:2});b.fighters[1].ailments['中毒']=3;timer(b,1,'固定百分比免疫');turn(b);assert.equal(sum(b,'fixed'),0);
});
