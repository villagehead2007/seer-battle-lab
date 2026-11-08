'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4829/snapshot.json'),H=require('./helpers/remaining-battle.cjs')(source),{E,key,keys,make,turn,timer,sum}=H;
const row=(id,n=0)=>{const rows=source.moves.flatMap(m=>m.effectInstances.map((e,index)=>({move:m.id,index,id:e.id}))).filter(x=>x.id===id);return rows[n];};
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);fn(event,c);}};try{return run();}finally{E.SOULS=old;}}
test('4829全部9招完整原生2019初始化、有序实例与PP，64种子基础命中先制暴击、零PP拒绝及整招封锁',()=>{
 for(const m of source.moves){const s=make({move:m.id,soul:true,hp:1000}),c=E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m);assert.equal(c.issue,'');assert.equal(s.fighters[0].soulId,2019);assert.deepEqual(s.moveDefinitions[key(m.id)].operations.map(x=>[x.effectId,x.index,x.phase,x.params]),c.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));turn(s);assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1);const no=make({move:m.id});no.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(no),/有 PP/);assert.equal(sum(no,'percent'),0);const blocked=make({move:m.id});timer(blocked,0,'skillBlock');turn(blocked);assert.equal(blocked.fighters[0].pp[key(m.id)],m.pp-1);assert.equal(sum(blocked,'percent'),0);}
 assert.equal(require('./helpers/next50-base-probe.cjs').verify(H).length,9);
});
test('4829真实2019首次满体麻痹免疫3回合，免疫成功消敌回合消正且计数，其他异常不误免疫',()=>{
 const s=make({move:38132,index:-1,soul:true});assert.equal(s.fighters[0].soulState.kabuda2019.entryEnd,3);observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){c.a.stages.def=3;assert.equal(c.ailment(c.t,'麻痹',c.a,false,false,2),false);assert.equal(c.a.stages.def,0);assert.equal(c.a.effects['攻击必中'],undefined);assert.equal(c.t.soulState.kabuda2019.count,1);assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),true);}},()=>turn(s));assert.ok(s.fighters[0].ailments['中毒']);
});
test('4829真实2019回合初无强化红伤50%、无回合先制1与双条件战阶魂印回血，条件快照不追溯',()=>{
 for(const [boost,timed,wantPriority,wantHeal]of [[false,false,4,3000],[true,false,4,0],[false,true,3,0],[true,true,3,0]]){const s=make({move:38132,index:-1,soul:true,hp:1000});s.fighters[1].effects={};if(boost)s.fighters[1].stages.def=1;if(timed)timer(s,1,'免弱');turn(s);assert.equal(s.fighters[0].soulState.resolvedPriority.value,wantPriority);assert.equal(s.fighters[0].hp,2800+wantHeal);const base=make({move:38132,index:-1,hp:1000});base.fighters[1].effects={};if(boost)base.fighters[1].stages.def=1;turn(base);assert.ok(Math.abs(sum(s)-sum(base)*(boost?1:1.5))<=2);}
});
test('4829真实2019攻击使用后20%吸取含MISS与命中零伤，属性药剂未用不吸取，百分免疫仍理论回复',()=>{
 for(const mode of ['normal','miss','zero','immune-percent']){const s=make({move:38132,index:-1,soul:true,hp:1000});if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];timer(s,0,'攻击必失');}if(mode==='zero')timer(s,1,'攻击伤害免疫');if(mode==='immune-percent')timer(s,1,'固定百分比免疫');turn(s);assert.equal(s.fighters[0].hp,2800);assert.equal(sum(s,'percent'),mode==='immune-percent'?0:1800);if(['miss','zero'].includes(mode))assert.equal(sum(s),0);}
 for(const mode of ['status','potion','not-used']){const s=make({move:29180,index:-1,soul:true,hp:1000});if(mode==='not-used')s.fighters[0].ailments['害怕']=99;turn(s,mode==='potion'?null:29180);assert.equal(sum(s,'percent'),0);}
});
test('4829真实2019各来源免疫累计四次到60%且此后免全部异常不耗次数，重复尝试计数封顶',()=>{
 const s=make({move:38132,index:-1,soul:true,hp:1000});observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0){for(let n=1;n<=4;n++){assert.equal(c.ailment(c.a,'麻痹',c.t,false,false,2),false);assert.equal(c.a.soulState.kabuda2019.count,n);}c.a.counts.immune=2;assert.equal(c.ailment(c.a,'害怕',c.t,false,false,2),false);assert.equal(c.a.counts.immune,2);assert.equal(c.a.soulState.kabuda2019.count,4);}},()=>turn(s));assert.equal(sum(s,'percent'),5400);assert.equal(s.fighters[0].hp,6400);
 const a=make({move:29180,index:-1,soul:true});a.fighters[0].counts.immune=1;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0){assert.equal(c.ailment(c.a,'中毒',c.t,false,false,2),false);assert.equal(c.a.counts.immune,0);assert.equal(c.a.soulState.kabuda2019.count,1);}},()=>turn(a));
});
test('4829/1932除麻痹免反不耗次数、麻痹仍可次数挡；91780%成功失败补粉与1660失败全PP2',()=>{
 for(const n of[0,1]){const s=make(row(1932,n));turn(s);observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){c.t.counts.immune=2;assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),false);assert.ok(c.a.ailments['中毒']);assert.equal(c.t.counts.immune,2);assert.equal(c.ailment(c.t,'麻痹',c.a,false,false,2),false);assert.equal(c.t.counts.immune,1);}},()=>turn(s,38134));}
 const out=new Set();for(let seed=1;seed<25&&out.size<2;seed++){const s=make({...row(917),seed:Math.imul(seed,0x9e3779b1)>>>0});turn(s);if(s.fighters[1].ailments['麻痹']){out.add('yes');assert.equal(sum(s,'percent'),0);}else{out.add('no');assert.equal(sum(s,'percent'),3000);}}assert.equal(out.size,2);
 const a=make(row(1660));a.fighters[1].counts.immune=1;turn(a);for(const k of a.fighters[1].moves)assert.equal(a.fighters[1].pp[k],a.moveDefinitions[k].pp-2-(k===key(20117)?1:0));
});
test('4829/1168双方任一异常全强翻倍及免强，1065普通比例净HP附伤当前起低体翻倍不重复乘二及到期',()=>{
 for(const side of[0,1]){const a=make(row(1168));a.fighters[side].ailments['流血']=99;turn(a);for(const k of keys)assert.equal(a.fighters[0].stages[k],2);}const no=make(row(1168));timer(no,0,'禁强化');turn(no);assert.equal(no.fighters[0].stages.atk,0);
 for(const [hp,n]of [[1000,6000],[4500,3000],[8500,500],[9000,0]]){const s=make({...row(1065),hp});turn(s);assert.equal(s.fighters[0].hp,hp+n);assert.equal(sum(s,'percent'),n);}const b=make({...row(1065),hp:1000});timer(b,0,'技能禁疗');turn(b);assert.equal(b.fighters[0].hp,1000);assert.equal(sum(b,'percent'),0);
});
test('4829/1605真实麻痹50%成功失败，1019完整红伤严格大于阈值且保1不截断命中封属性',()=>{
 const out=new Set();for(let seed=1;seed<25&&out.size<2;seed++){const a=make({...row(1605),seed:Math.imul(seed,0x9e3779b1)>>>0});turn(a);out.add(!!a.fighters[1].ailments['麻痹']);}assert.equal(out.size,2);
 for(const atk of[1,3000]){const s=make({...row(1019),aStats:{atk},targetHp:1});timer(s,1,'致命保留',{hp:1});turn(s);assert.equal(s.fighters[1].hp,1);assert.equal(!!s.fighters[1].effects.statusBlock,atk===3000);assert.equal(sum(s)>400,atk===3000);}
});
test('4829/1750忽略自身弱化和1874弱化视强化，保留原战阶，1060真吸强后仅下回合封攻与693下回合红伤50%',()=>{
 for(const [id,stage]of [[1750,-6],[1874,-3]]){const a=make(row(id));a.fighters[0].stages.atk=stage;turn(a);const b=make({...row(id),index:-1});b.fighters[0].stages.atk=id===1874?3:0;turn(b);assert.ok(Math.abs(sum(a)-sum(b))<=2);assert.equal(a.fighters[0].stages.atk,stage);}
 const c=make(row(1060));c.fighters[1].stages.atk=2;turn(c);assert.equal(c.fighters[0].stages.atk,2);assert.equal(c.fighters[1].stages.atk,1);assert.equal(c.fighters[1].effects.attackBlock.start,2);assert.equal(c.fighters[1].effects.attackBlock.end,2);turn(c,29180,10127);assert.equal(sum(c,'attack',1),0);
 const d=make(row(693));turn(d);assert.ok(Object.values(d.fighters[0].effects).some(e=>e.start===2&&e.end===2));
});
test('4829/2145清自身异常成功即封敌命中效果，敌免疫不阻自清，转移保留剩余回合；1265下一次攻减半属性不消费',()=>{
 const a=make(row(2145));a.fighters[0].ailments['流血']=5;a.fighters[1].counts.immune=1;turn(a);assert.equal(a.fighters[0].ailments['流血'],undefined);assert.equal(a.fighters[1].ailments['流血'],undefined);assert.ok(a.fighters[1].effects['技能命中效果失效']);const b=make(row(2145));b.fighters[0].ailments['流血']=5;turn(b);assert.equal(b.fighters[1].ailments['流血'],5);
 const c=make(row(1265));turn(c);assert.equal(c.fighters[0].counts.nextAttackReductionUses,1);turn(c,29180);assert.equal(c.fighters[0].counts.nextAttackReductionUses,1);turn(c,29180,10127);assert.equal(c.fighters[0].counts.nextAttackReductionUses,0);
});
test('4829/1221反转弱化同源免异刷新非累加，547双方指定麻痹2回合与魂印免疫成功消回合交互',()=>{
 const a=make(row(1221));a.fighters[0].stages.atk=-2;turn(a);assert.equal(a.fighters[0].stages.atk,2);assert.equal(a.fighters[0].counts.immune,1);a.fighters[0].stages.atk=-1;turn(a,38133);assert.equal(a.fighters[0].counts.immune,1);
 const b=make(row(547));turn(b);assert.equal(b.fighters[0].ailments['麻痹'],2);assert.equal(b.fighters[1].ailments['麻痹'],2);const c=make({...row(547),soul:true});turn(c);assert.equal(c.fighters[0].ailments['麻痹'],undefined);assert.equal(c.fighters[1].ailments['麻痹'],2);assert.equal(c.fighters[0].soulState.kabuda2019.count,1);
});
test('4829/915消回合成功授下回合攻击麻痹失败不授，1356只暴击附最大HP三分一，933未击败授下次暴击',()=>{
 const a=make(row(915));turn(a);assert.equal(a.fighters[1].ailments['麻痹'],undefined);assert.equal(a.fighters[0].effects['攻击附加异常'].start,2);turn(a,38134);assert.ok(a.fighters[1].ailments['麻痹']);const b=make(row(915));b.fighters[1].effects={};turn(b);assert.equal(b.fighters[0].effects['攻击附加异常'],undefined);
 for(const crit of[false,true]){const c=make(row(1356));if(crit)timer(c,0,'必定暴击');turn(c);assert.equal(sum(c,'percent'),crit?3000:0);}const d=make(row(933));turn(d);assert.equal(d.fighters[0].counts.nextCrit,1);turn(d,38134);assert.equal(d.fighters[0].counts.nextCrit,1);
});
test('4829/1286第五当回合击败实际回满所有PP，未击败不回且已死亡领域拥有者不阻回复',()=>{
 const a=make({...row(1286),targetHp:1});for(const k of a.fighters[0].moves)a.fighters[0].pp[k]=1;turn(a);for(const k of a.fighters[0].moves)assert.equal(a.fighters[0].pp[k],a.moveDefinitions[k].pp);const b=make(row(1286));for(const k of b.fighters[0].moves)b.fighters[0].pp[k]=1;turn(b);assert.equal(b.fighters[0].pp[key(38134)],0);const c=make({...row(1286),targetHp:1});for(const k of c.fighters[0].moves)c.fighters[0].pp[k]=1;c.fighters[1].soulState.bedPartnerPP=true;timer(c,1,'次元领域');turn(c);assert.equal(c.fighters[1].hp,0);for(const k of c.fighters[0].moves)assert.equal(c.fighters[0].pp[k],c.moveDefinitions[k].pp);
});
test('4829/1984额外攻减50%当前起3回合到期，1926下两次攻忽略免攻属性不消费且第三次恢复免疫',()=>{
 const a=make(row(1984));turn(a,29171,10127);const base=make({move:29171,index:-1});turn(base,29171,10127);assert.ok(Math.abs(sum(a,'attack',1)-sum(base,'attack',1)*.5)<=1);a.moveDefinitions[key(38134)].operations=[];for(let r=2;r<=4;r++){const reference=make({move:38134,index:-1});reference.rng=a.rng;turn(a,38134,10127);turn(reference,38134,10127);assert.ok(Math.abs(sum(a,'attack',1)-sum(reference,'attack',1)*(r<=3?.5:1))<=1);}
 const b=make(row(1926));b.moveDefinitions[key(38134)].operations=[];timer(b,1,'攻击伤害免疫');turn(b);for(let n=1;n<=3;n++){turn(b,38134);assert.equal(sum(b)>0,n<=2);}
});
test('4829/843所有技能下两回合先制2、881弱化固有先制3不消弱，693下回合50%红增伤到期',()=>{
 const a=make(row(843));turn(a);turn(a,38134);assert.equal(a.fighters[0].soulState.resolvedPriority.value,2);turn(a,38134);assert.equal(a.fighters[0].soulState.resolvedPriority.value,2);turn(a,38134);assert.equal(a.fighters[0].soulState.resolvedPriority.value,0);
 const b=make(row(881));b.fighters[0].stages.def=-1;turn(b);assert.equal(b.fighters[0].soulState.resolvedPriority.value,3);assert.equal(b.fighters[0].stages.def,-1);const c=make(row(693));turn(c);c.moveDefinitions[key(38134)].operations=[];const base=make({move:38134,index:-1});c.rng=base.rng;turn(c,38134);turn(base);assert.ok(Math.abs(sum(c)-1.5*sum(base))<=2);
});
test('4829真实2019入场体力30%分档边界、麻痹免疫到期及失败不计数，合法共享转换进入状态计数',()=>{
 for(const [hp,end]of [[2699,0],[2700,1],[5399,1],[5400,2],[8099,2],[8100,3]]){const old=E.SOULS;E.SOULS={...old,run(e,c){if(e==='battleStart'&&c.a.side===0)c.a.hp=hp;old.run(e,c);}};let s;try{s=make({move:29180,index:-1,soul:true});}finally{E.SOULS=old;}assert.equal(s.fighters[0].soulState.kabuda2019.entryEnd,end);}
 const a=make({move:29180,index:-1,soul:true});for(let i=1;i<=3;i++)turn(a,29180);observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0){assert.equal(c.ailment(c.a,'麻痹',c.t,false,false,2),true);assert.equal(c.a.soulState.kabuda2019.count,0);}},()=>turn(a,29180));
 const b=make({move:29180,index:-1,soul:true});b.fighters[0].soulState.specialStates={'巫祖之眸':{confirmation:'Q-N20-4401-002',fifthKind:'status'}};observe((e,c)=>{if(e==='beforeUse'&&c.a.side===0){assert.equal(c.ailment(c.a,'害怕',c.t,false,false,2),true);assert.ok(c.a.ailments['砥砺']);assert.equal(c.a.soulState.kabuda2019.count,1);}},()=>turn(b,29180));
});
test('4829/1065持续4回合末到期、回复削减净HP附伤；1660免异失败PP保护不减，1019零红不封属性',()=>{
 const a=make({...row(1065),hp:1000});timer(a,0,'回复效果削减',{fraction:.5});turn(a);assert.equal(a.fighters[0].hp,4000);assert.equal(sum(a,'percent'),3000);delete a.fighters[0].effects['回复效果削减'];a.moveDefinitions[key(38134)].operations=[];for(let r=2;r<=5;r++){a.fighters[0].hp=8000;a.fighters[1].hp=9000;turn(a,38134);assert.equal(sum(a,'percent'),r<=4?1000:0);}
 const b=make(row(1660));b.fighters[1].counts.immune=1;timer(b,1,'PP保护');turn(b);for(const k of b.fighters[1].moves)assert.equal(b.fighters[1].pp[k],b.moveDefinitions[k].pp-(k===key(20117)?1:0));const c=make(row(1019));timer(c,1,'攻击伤害免疫');turn(c);assert.equal(c.fighters[1].effects.statusBlock,undefined);
});
test('4829/1060连续吸强重授下回合封攻不取消当前既有封攻，强化保护失败不新增封锁',()=>{
 const a=make(row(1060));a.fighters[1].stages.atk=2;turn(a);turn(a,38120,10127);assert.equal(sum(a,'attack',1),0);assert.equal(a.fighters[1].effects.attackBlock.start,2);assert.equal(a.fighters[1].effects.attackBlock.end,3);
 const b=make(row(1060));b.fighters[1].stages.atk=2;timer(b,1,'幽蝶强化保护');turn(b);assert.equal(b.fighters[1].effects.attackBlock,undefined);assert.equal(b.fighters[1].stages.atk,3);
});
test('4829真实2019公共登场异常入口遵守麻痹免疫并消正清回合，计数含登场次数免异与转换',()=>{
 const old=E.SOULS;let seen=false;E.SOULS={...old,run(e,c){old.run(e,c);if(e==='battleStart'&&c.a.side===1){c.a.stages.atk=2;c.a.effects.testEntry={start:1,end:2};assert.equal(c.entryAilment(c.t,'麻痹',2,c.a),false);assert.equal(c.a.stages.atk,0);assert.equal(c.a.effects.testEntry,undefined);assert.equal(c.t.soulState.kabuda2019.count,1);c.t.counts.immune=1;assert.equal(c.entryAilment(c.t,'中毒',2,c.a),false);assert.equal(c.t.soulState.kabuda2019.count,2);seen=true;}}};try{make({move:29180,index:-1,soul:true});}finally{E.SOULS=old;}assert.equal(seen,true);
});
