'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/remaining-4871.cjs'),{E,key,foreign,turn,make,timer}=H;
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(e,c){old.run(e,c);fn(e,c);}};try{return run();}finally{E.SOULS=old;}}
test('4871已答风龙结：真实20/50/80概率按总数先加50再除概率并向上取整，普通失败仍执行一次且不多抽随机',()=>{
 for(const [move,count,expected]of[[19239,1,255],[24712,0,63],[24712,1,64]]){const a=foreign({id:3025,ids:[24712,19239,24713,19240,19241],move,strip:move===19239,converted:true}),b=foreign({id:3025,ids:[24712,19239,24713,19240,19241],move,strip:move===19239,converted:true,observer:false});a.fighters[0].soulState.wind2058.count=count;turn(a,20065,move);turn(b,20065,move);assert.equal(a.fighters[0].soulState.wind2058.count,expected);assert.equal(a.windExecutionEvents2058.length,1);assert.equal(a.rng,b.rng);}
 const a=make({soul:true,move:20065});observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){const p=c.statusProbability(50);c.ailmentRoll4853(p,false);}},()=>turn(a));assert.equal(a.fighters[0].soulState.wind2058.count,102);
});
test('4871已答零概率：原本0或被亮封为0不算风龙结执行；同样封锁场景永沐原正概率仍资格保持独立',()=>{
 for(const bright of[false,true]){const a=make({soul:true,move:20065});if(bright)a.fighters[1].soulState.bright2009=99;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){const p=c.statusProbability(bright?50:0);assert.equal(p,0);assert.equal(c.ailmentRoll4853(p,false),false);assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2,{resolvedProbabilityPercent:0}),false);}},()=>turn(a));assert.equal(a.fighters[0].soulState.wind2058.count,1);assert.equal(a.windExecutionEvents2058?.length??0,0);}
});
test('4871已答满额：采用增加后的数量判断清异，非龙满1000消耗转龙归零后仍清已有异常并满HP全PP',()=>{
 const a=make({soul:true,move:20065,hp:1000});a.fighters[0].soulState.wind2058.count=950;a.fighters[0].ailments['烧伤']=3;for(const k of a.fighters[0].moves)a.fighters[0].pp[k]=1;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1)c.ailment(c.t,'中毒',c.a,false,false,2,{probabilityPercent:100});},()=>turn(a));assert.equal(a.fighters[0].type,'龙');assert.equal(a.fighters[0].soulState.wind2058.count,0);assert.deepEqual(a.fighters[0].ailments,{});assert.equal(a.fighters[0].hp,9000);for(const k of a.fighters[0].moves)assert.equal(a.fighters[0].pp[k],a.moveDefinitions[k].pp);
});
test('4871已答反弹：原50%成功后反弹执行按100%统计且不重新抽概率，风龙结只加50，永沐不把反弹算低概率',()=>{
 const a=make({soul:true,move:20065});a.fighters[0].type='龙';a.fighters[0].soulState.wind2058.count=0;timer(a,1,'reflect');observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0)c.ailment(c.t,'烧伤',c.a,false,false,2,{probabilityPercent:50});},()=>turn(a));assert.equal(a.fighters[0].soulState.wind2058.count,50);assert.equal(a.windExecutionEvents2058[0].chance,100);assert.ok(a.fighters[0].ailments['烧伤']);assert.equal(a.fighters[1].ailments['烧伤'],undefined);
 const src=require('../research/BATCH-4816-REMAINING/4853/snapshot.json'),h=require('./helpers/remaining-battle.cjs')(src),b=h.make({soul:true,move:38210,index:-1});timer(b,1,'reflect');observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0)c.ailment(c.t,'烧伤',c.a,false,false,2,{probabilityPercent:50});},()=>h.turn(b));assert.ok(b.fighters[0].ailments['烧伤']);assert.equal(b.fighters[1].soulState.exposure4853,undefined);
});
test('4871已答特性封零：真实五星高热8%在亮封锁后不计执行，既不新增风龙结也不强施烧伤',()=>{
 const a=foreign({id:3066,ids:[16076,19415,24805,19416,19417],move:16076,native:false,strip:true,converted:true,own:[10018,29265,34462,29266,38272]});a.fighters[1].build.characteristic=E.CHARACTERISTICS.normalize({groupId:24,star:5});a.fighters[1].soulState.bright2009=99;turn(a,10018,16076);assert.equal(a.fighters[0].soulState.wind2058.count,0);assert.equal(a.windExecutionEvents2058?.length??0,0);assert.equal(a.fighters[0].ailments['烧伤'],undefined);
});
