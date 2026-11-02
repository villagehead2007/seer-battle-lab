'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4554-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
function work(s,fn,move=s.auditMoveId,other=920041){const old=E.SOULS;let done=false;E.SOULS={...old,run(event,c){old.run(event,c);if(!done&&event==='roundStart'&&c.a.side===0){done=true;fn(c);}}};try{return turn(s,move,other);}finally{E.SOULS=old;}}
const damage=(s,side,type)=>(s.damageEvents??[]).filter(x=>x.targetSide===side&&x.type===type).reduce((a,x)=>a+x.settledDamage,0);
test('4554全部17招与真实1764初始形态原生运行，四常规加真实第五合法配招和PP',()=>{
 for(const m of source.moves){const b=structuredClone(source);b.id=920754;b.souls=[];const fifth=source.moves.find(x=>x.fifth),regular=source.moves.filter(x=>!x.fifth),load=m.fifth?[...regular.slice(0,4),m]:[m,...regular.filter(x=>x.id!==m.id).slice(0,3),fifth];
  const s=E.createBattle({wikiSnapshots:[source,b],wikiLoadouts:[load.map(x=>x.id),load.map(x=>x.id)],criticals:false,builds:[{overrides:{maxHp:9000,spe:500}},{overrides:{maxHp:9000,spe:100}}]});s.rng=123;assert.equal(s.fighters[0].soulState.oracleForm1764,'holy');assert.equal(s.fighters[0].soulState.oracleNextAttack1764,true);
  const o=E.resolveTurn(s,[key(m.id),key(load[0].id)]);assert.equal(o.fighters[0].pp[key(m.id)],m.effectInstances.some(x=>x.id===87)?m.pp:m.pp-1,'原生技能PP '+m.id);assert.ok(o.fighters[0].hp>0);if(m.id===36855)assert.equal(o.fighters[0].soulState.oracle1444Power.power,0);
 }
});
test('4554整招三段仅各响应一层，完整伤害合计后才比较威力减层',()=>{
 const s=make({moveId:36848,index:-1},{hp:1000,aStats:{atk:10}});H.op(s,1863,[2,1],920030);
 const o=work(s,c=>{c.soulAbility(1764,'grantMark','evil',3);},920030);const n=damage(o,1,'attack');assert.equal(o.damageEvents.filter(x=>x.type==='attack'&&x.targetSide===1).length,3);assert.equal(damage(o,1,'percent'),Math.floor(n*.7));const m=o.fighters[1].soulState.oracleMarks1764.evil;assert.equal(m.length,n>100?2:3);assert.equal(m.filter(x=>x.triggerUsed).length,n>100?0:1);assert.equal(o.fighters[0].hp,1000+Math.floor(n*.7));
});
test('4554邪诲吸取理论回复不受目标低HP或百分比免疫降低，禁疗仍按公共规则',()=>{
 for(const mode of ['low','immune','ban']){const s=make({moveId:36848,index:-1},{hp:1000,targetHp:mode==='low'?20:9000});if(mode==='immune')timer(s,1,'固定百分比免疫');if(mode==='ban')timer(s,0,'回复效果削减',{fraction:1});
  const o=work(s,c=>{c.soulAbility(1764,'grantMark','evil');c.soulAbility(1764,'qualifiedMarkResponse',{settledDamage:1000,power:1000});},920031);assert.equal(damage(o,1,'percent'),mode==='immune'?0:700);assert.equal(o.fighters[0].hp,mode==='ban'?1000:1700);assert.equal(o.fighters[1].hp,mode==='low'?0:mode==='immune'?9000:8300);
 }
});
test('4554免异同源刷新其他来源保留，后获先消费且2059只响应自己的次数',()=>{
 let s=turn(make(e(2059),{hp:1000}));s=turn(s);assert.equal(s.fighters[0].counts.immune,2);H.op(s,1440,[1],920031);s=turn(s,920031);assert.equal(s.fighters[0].counts.immune,3);H.op(s,16,[100]);s=turn(s,920032,920042);assert.equal(s.fighters[0].counts.immune,2);assert.equal(s.fighters[0].hp,1000);s=turn(s,920032,920042);assert.equal(s.fighters[0].counts.immune,1);assert.equal(s.fighters[0].hp,1200);assert.equal(damage(s,1,'fixed'),200);
 const bad=make(e(2059));bad.fighters[0].soulState.immunity1757Charges=[100,100];assert.throws(()=>turn(bad),/来源/);
});
test('4554 2031绝对PP变化严格9不触发10触发，PP保护阻止实际减量不算变化',()=>{
 for(const n of [9,10]){const s=make(e(2031));for(const f of s.fighters)for(const k of f.moves)f.pp[k]=9;s.fighters[0].pp[key(s.auditMoveId)]=10;s.fighters[1].pp[key(920040)]=9+n;const o=turn(s);assert.equal(!!o.fighters[1].ailments['失明'],n===10);assert.equal(!!o.fighters[1].ailments['失神'],false);assert.equal(o.fighters[1].pp[key(920040)],9);}
 const s=make(e(2031));for(const f of s.fighters)for(const k of f.moves)f.pp[k]=9;s.fighters[0].pp[key(s.auditMoveId)]=10;s.fighters[1].pp[key(920040)]=50;timer(s,1,'PP保护');const o=turn(s);assert.equal(o.fighters[1].ailments['失明'],undefined);assert.equal(o.fighters[1].pp[key(920040)],50);
});
test('4554 2067提前清除回复HP和PP一次，禁疗与PP禁回分别独立',()=>{
 for(const mode of ['normal','heal-ban','pp-ban']){let s=turn(make(e(2067),{hp:1000}));s.fighters[0].pp[key(920030)]=1;if(mode==='heal-ban')timer(s,0,'技能禁疗');if(mode==='pp-ban'){s.fighters[1].soulState.bedPartnerPP=true;timer(s,1,'机械领域',{fraction:1});}H.op(s,180,[]);const o=turn(s,920031,920042);assert.equal(o.fighters[0].hp,mode==='heal-ban'?1000:9000);assert.equal(o.fighters[0].pp[key(920030)],mode==='pp-ban'?1:99);assert.equal(o.fighters[0].effects['概率闪避'],undefined);}
});
