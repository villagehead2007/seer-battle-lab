'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/4182-battle.cjs'),{make,pick,turn,keys,timer,E,key}=H;
test('4182 732真实第五非暴击六项强化及暴击、封顶、禁强化边界',()=>{
 const entry=pick(732)[0];assert.deepEqual(entry.params,[1,1,1,1,1,1]);
 const s=turn(make(entry));for(const k of keys)assert.equal(s.fighters[0].stages[k],1,k);
 const cap=make(entry);for(const k of keys)cap.fighters[0].stages[k]=6;const c=turn(cap);for(const k of keys)assert.equal(c.fighters[0].stages[k],6);
 const blocked=make(entry);timer(blocked,0,'禁强化');const b=turn(blocked);for(const k of keys)assert.equal(b.fighters[0].stages[k],0);
 const crit=make(entry,{criticals:true});timer(crit,0,'必定暴击');const t=turn(crit);for(const k of keys)assert.equal(t.fighters[0].stages[k],0);
});
test('4182 732仅真实34884版本允许全六项参数，旧实例不扩大兼容',()=>{
 const r=E.WIKI.effectsEngine.registry[732],m=H.source.moves.find(m=>m.id===34884);
 assert.doesNotThrow(()=>r.validate([1,1,1,1,1,1],m,2));
 assert.throws(()=>r.validate([1,1,1,1,1,1],{...m,hash:'invalid'},2));
 assert.throws(()=>r.validate([2,1,0,0,0,0],{id:31834,hash:'b0505be9'},1));
 assert.doesNotThrow(()=>r.validate([2,0,0,0,0,0],{id:31834,hash:'b0505be9'},1));
});
test('4182及旧三只1322百分之百受击异常不被寒月当作百分之一屏蔽',()=>{
 const sourced=require('./helpers/sourced-583-1647-battle.cjs');
 for(const id of [3580,3673,3896]){
  const {s,turn}=sourced(id,1322);s.fighters[0].hp=1000;
  s.celestials=[{name:'寒月',side:0,start:1,end:99}];
  const a=turn(s),b=turn(a,980031,980040);
  const name=({3580:'诅咒',3673:'睡眠',3896:'瘫痪'})[id];assert.ok(b.fighters[1].ailments[name]>=2,id+' '+name);
 }
});
test('4182 1664先手低威力整招失效、100边界、后手不触发及击败延续',()=>{
 const e=pick(1664)[0],s=make(e);s.moveDefinitions[key(920040)].power=99;
 const a=turn(s,s.auditMoveId,920040);assert.equal(a.fighters[0].hp,9000);assert.equal(a.fighters[0].effects['低威力攻击无效'],undefined);
 const boundary=make(e);boundary.moveDefinitions[key(920040)].power=100;const b=turn(boundary,boundary.auditMoveId,920040);assert.ok(b.fighters[0].hp<9000);
 const late=make(e,{aStats:{spe:50},bStats:{spe:900}});late.moveDefinitions[key(late.auditMoveId)].priority=0;const l=turn(late);assert.equal(l.fighters[0].effects['低威力攻击无效'],undefined);
 const dead=turn(make(e,{targetHp:1}));assert.equal(dead.fighters[1].hp,0);assert.equal(dead.fighters[0].effects['低威力攻击无效'].start,2);assert.equal(dead.fighters[0].effects['低威力攻击无效'].end,2);
 const expired=turn(a,920031,920040);assert.ok(expired.fighters[0].hp<9000);
});
test('4182 1665自身全强化属于单精灵，封顶免强及真实背包分支独立',()=>{
 const e=pick(1665)[0],a=turn(make(e));for(const k of keys)assert.equal(a.fighters[0].stages[k],1);
 const blocked=make(e);timer(blocked,0,'禁强化');const b=turn(blocked);for(const k of keys)assert.equal(b.fighters[0].stages[k],0);
 const cap=make(e);for(const k of keys)cap.fighters[0].stages[k]=6;const c=turn(cap);for(const k of keys)assert.equal(c.fighters[0].stages[k],6);
 assert.match(E.WIKI.effectsEngine.registry[1665].deferred,/背包/);
});
test('4182 1481实际随机伤害翻倍及负能力使50%成为100%，不变更防御阶段',()=>{
 const e=pick(1481)[0];let doubled=false,ordinary=false;
 for(let seed=0;seed<30;seed++){
  const s=make(e,{seed});const base=make(e,{seed:(seed+0x6D2B79F5)>>>0,omit:true});
  const d=9000-turn(s).fighters[1].hp,n=9000-turn(base).fighters[1].hp;
  assert.ok(d===n||Math.abs(d-2*n)<=1);if(d>n)doubled=true;else ordinary=true;
  const weak=make(e,{seed});weak.fighters[1].stages.acc=-1;const w=9000-turn(weak).fighters[1].hp;const unrolled=9000-turn(make(e,{seed,omit:true})).fighters[1].hp;assert.ok(Math.abs(w-2*unrolled)<=1);
 }assert.ok(doubled&&ordinary);
});
test('4182 魂印1406独立25%攻击增伤、回合开始异常克制快照、不虚构背包全灭',()=>{
 const s=make({moveId:10004,index:null},{soul:1406}),base=make({moveId:10004,index:null});
 s.fighters[1].ailments['失明']=9;base.fighters[1].ailments['失明']=9;const a=turn(s),b=turn(base),d=9000-a.fighters[1].hp,n=9000-b.fighters[1].hp;assert.ok(Math.abs(d-1.25*n)<=1);assert.ok(d<2250);
 const ail=make({moveId:10004,index:null},{soul:1406});ail.fighters[1].ailments['失明']=9;const o=turn(ail);assert.equal(o.fighters[0].soulState.fallenDragonAilmentRound,1);
 assert.equal(a.fighters[0].soulState.fallenDragonAilmentRound,1);
});
test('4182 基础4与重复5及585各真实实例独立能力变化和免弱/禁强化',()=>{
 for(const e of [...pick(4),...pick(5),...pick(585)]){
  const s=turn(make(e)),x=s.fighters[e.id===5?1:0];const expected=Object.fromEntries(keys.map(k=>[k,0]));
  if(e.id===585)e.params.forEach((v,i)=>expected[keys[i]]=v);else expected[keys[e.params[0]]]=e.params[2];
  assert.deepEqual(x.stages,expected);
  const z=make(e);timer(z,e.id===5?1:0,e.id===5?'免弱':'禁强化');const b=turn(z);assert.ok(Object.values(b.fighters[e.id===5?1:0].stages).every(v=>v===0));
 }
});
test('4182 2严格半血增威与29固定75和683真实200至300随机附伤',()=>{
 const e=pick(2)[0],half=turn(make(e,{targetHp:4500})),low=turn(make(e,{targetHp:4499}));assert.ok(4499-low.fighters[1].hp>4500-half.fighters[1].hp);
 for(const id of [29,683])for(let seed=0;seed<15;seed++){
  const e=pick(id)[0],s=turn(make(e,{seed})),b=turn(make(e,{seed,omit:true})),extra=b.fighters[1].hp-s.fighters[1].hp;
  if(id===29)assert.equal(extra,75);else assert.ok(extra>=200&&extra<=300);
 }
});
test('4182 12烧伤10%成功失败和免异常不绕过',()=>{
 let yes=false,no=false;for(let seed=0;seed<70;seed++){const s=turn(make(pick(12)[0],{seed}));yes ||= !!s.fighters[1].ailments['烧伤'];no ||= !s.fighters[1].ailments['烧伤'];const z=make(pick(12)[0],{seed});timer(z,1,'免异常');assert.equal(turn(z).fighters[1].ailments['烧伤'],undefined);}assert.ok(yes&&no);
});
test('4182 85转移与1061反转复制成功失败及521自身负能力反转',()=>{
 for(const id of [85,1061]){const s=make(pick(id)[0]);s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,id===85?0:-2);const b=turn(make(pick(id)[0]));assert.equal(b.fighters[0].stages.atk,0);}
 const s=make(pick(521)[0]);s.fighters[0].stages.def=-3;const a=turn(s);assert.equal(a.fighters[0].stages.def,3);
 const b=make(pick(1061)[0]);b.fighters[1].stages.atk=2;timer(b,1,'免弱');const o=turn(b);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].stages.atk,0);
});
test('4182 46抵挡一次与693次回合增伤真实消费及到期',()=>{
 const s=make(pick(46)[0]);const a=turn(s,s.auditMoveId,920040);assert.equal(a.fighters[0].hp,9000);assert.equal(a.fighters[0].counts.attackNullify,0);const b=turn(a,920031,920040);assert.ok(b.fighters[0].hp<9000);
 const e=pick(693)[0],p=turn(make(e)),n=turn(make(e,{omit:true}));assert.equal(p.fighters[0].effects.id913.start,2);assert.equal(p.fighters[0].effects.id913.end,3);
 const boosted=turn(p,920030),normal=turn(n,920030);assert.ok(9000-boosted.fighters[1].hp>9000-normal.fighters[1].hp);
});
test('4182 77回血200上限禁疗与48四回合免异常、47免弱、165逐回合双防强化',()=>{
 const e=pick(77)[0];assert.equal(turn(make(e,{hp:8800})).fighters[0].hp,9000);const z=make(e,{hp:3000});timer(z,0,'技能禁疗');assert.equal(turn(z).fighters[0].hp,3000);
 for(const id of [47,48]){const a=turn(make(pick(id)[0]));const name=id===47?'免弱':'免异常';assert.equal(a.fighters[0].effects[name].end,4);}
 const d=turn(make(pick(165)[0])),b=turn(d,920031),c=turn(b,920031),end=turn(c,920031);assert.equal(d.fighters[0].stages.def,2);assert.equal(b.fighters[0].stages.spd,4);assert.equal(c.fighters[0].stages.def,6);assert.equal(end.fighters[0].stages.def,6);
});
test('4182 191反弹真实异常与1028两种弱化和失败百分比补偿',()=>{
 const s=make(pick(191)[0]);H.op(s,15,[100],920042);const a=turn(s,s.auditMoveId,920042);assert.equal(a.fighters[0].ailments['害怕'],undefined);assert.ok(a.fighters[1].ailments['害怕']>=1);
 const e=pick(1028)[0],b=turn(make(e));assert.equal(b.fighters[1].stages.spd,-2);assert.equal(b.fighters[1].stages.spe,-2);assert.equal(b.fighters[1].hp,9000);
 const z=make(e);timer(z,1,'免弱');const c=turn(z);assert.equal(c.fighters[1].hp,6000);assert.equal(c.fighters[1].stages.spd,0);
});
test('4182 681和843次两回合必中暴击与全技能先制真实期限',()=>{
 const a=turn(make(pick(681)[0]));assert.equal(a.fighters[0].effects['必定暴击'].start,2);assert.equal(a.fighters[0].effects['必定暴击'].end,3);assert.equal(a.fighters[0].effects['攻击必中'].end,3);
 const b=turn(make(pick(843)[0]));assert.equal(b.fighters[0].effects.id984.amount,2);assert.equal(b.fighters[0].effects.id984.start,2);assert.equal(b.fighters[0].effects.id984.end,3);
});
test('4182 1065低体理论回复翻倍后按实际回复附加，禁疗不附伤',()=>{
 const e=pick(1065)[0],low=turn(make(e,{hp:3000})),high=turn(make(e,{hp:6000}));assert.equal(low.fighters[0].hp,9000);assert.equal(low.fighters[1].hp,3000);assert.equal(high.fighters[0].hp,9000);assert.equal(high.fighters[1].hp,6000);
 const z=make(e,{hp:3000});timer(z,0,'技能禁疗');const b=turn(z);assert.equal(b.fighters[0].hp,3000);assert.equal(b.fighters[1].hp,9000);
});
test('4182 1322受击诅咒、异常免疫转全弱及免弱、期限',()=>{
 const e=pick(1322)[0],s=turn(make(e));const a=turn(s,920031,920040);assert.ok(a.fighters[1].ailments['诅咒']>=2);
 const z=turn(make(e));timer(z,1,'免异常');const b=turn(z,920031,920040);for(const k of keys)assert.equal(b.fighters[1].stages[k],-1);
 const both=turn(make(e));timer(both,1,'免异常');timer(both,1,'免弱');const c=turn(both,920031,920040);for(const k of keys)assert.equal(c.fighters[1].stages[k],0);
 assert.equal(s.fighters[0].effects['诅咒受击反应'].end,4);
});
test('4182 494忽略防御强化但不忽略基础防御，769无异常加伤',()=>{
 for(const id of [494,769]){const e=pick(id)[0],s=make(e),b=make(e,{omit:true});if(id===494){s.fighters[1].stages.spd=6;b.fighters[1].stages.spd=6;}const a=turn(s),n=turn(b);assert.ok(a.fighters[1].hp<n.fighters[1].hp);}
 const e=pick(769)[0],s=make(e),b=make(e,{omit:true});s.fighters[1].ailments['失明']=9;b.fighters[1].ailments['失明']=9;assert.equal(turn(s).fighters[1].hp,turn(b).fighters[1].hp);
});
test('4182 1539高于300诅咒与失败清回合、781消除后封属性及1356暴击百分比',()=>{
 const e=pick(1539)[0],high=make(e,{aStats:{spa:900}});assert.ok(turn(high).fighters[1].ailments['诅咒']>=1);
 const low=make(e,{aStats:{spa:900}});timer(low,1,'免弱');timer(low,1,'免异常');const b=turn(low);assert.equal(b.fighters[1].effects['免弱'],undefined);
 const clear=make(pick(781)[0]);timer(clear,1,'免弱');const c=turn(clear);assert.equal(c.fighters[1].effects['免弱'],undefined);assert.equal(c.fighters[1].effects.statusBlock.end,2);
 const p=pick(1356)[0],crit=make(p,{criticals:true});timer(crit,0,'必定暴击');const base=make(p,{criticals:true,omit:true});timer(base,0,'必定暴击');assert.equal(turn(base).fighters[1].hp-turn(crit).fighters[1].hp,3000);
 const plain=make(p);assert.equal(turn(plain).fighters[1].hp,turn(make(p,{omit:true})).fighters[1].hp);
});
test('4182 582未击败保留次两回合暴击及672当回合击败回满，658结算伤害反馈',()=>{
 const p=turn(make(pick(582)[0]));assert.equal(p.fighters[0].effects['必定暴击'].start,2);assert.equal(p.fighters[0].effects['必定暴击'].end,3);
 const killed=turn(make(pick(672)[0],{targetHp:1,hp:1000}));assert.equal(killed.fighters[1].hp,0);assert.equal(killed.fighters[0].hp,9000);
 const s=turn(make(pick(658)[0]));const b=turn(s,920031,920040);assert.equal(9000-b.fighters[1].hp,9000-b.fighters[0].hp);assert.equal(b.fighters[0].counts.nextDamageReturn,undefined);
});
test('4182 全部22真实技能索引和唯一第五保留，441真实注册且保留全部索引',()=>{
 assert.equal(H.source.moves.length,22);assert.deepEqual(H.source.moves.filter(m=>m.fifth).map(m=>m.id),[34884]);assert.equal(typeof E.WIKI.effectsEngine.registry[441].execute,'function');
 for(const m of H.source.moves){const s=make({moveId:m.id,index:null},{omit:true});assert.ok(s.fighters[0].moves.includes(key(m.id)));assert.ok(s.fighters[0].pp[key(m.id)]>0);const o=turn(s);assert.equal(o.round,2);}
});
test('4182 1539新诅咒参数只接受真实34883来源实例',()=>{
 const r=E.WIKI.effectsEngine.registry[1539],m=H.source.moves.find(m=>m.id===34883);assert.doesNotThrow(()=>r.validate([300,100,23],m,2));assert.throws(()=>r.validate([300,100,23],{...m,hash:'bad'},2));assert.throws(()=>r.validate([300,100,23],m,1));assert.throws(()=>r.validate([300,100,24],m,2));
});
test('4182 1322保留1HP实际零损失仍按受到攻击触发诅咒',()=>{
 const e=pick(1322)[0],s=turn(make(e));s.fighters[0].hp=1;timer(s,0,'致命保留',{hp:1});const o=turn(s,920031,920040);assert.equal(o.fighters[0].hp,1);assert.ok(o.fighters[0].roundSettledAttackDamage>0);assert.equal(o.fighters[0].roundAttackDamage,0);assert.ok(o.fighters[1].ailments['诅咒']>=2);
});
