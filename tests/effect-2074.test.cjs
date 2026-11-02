'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const P=require('../dist/status-pools.js'),E=require('../dist/engine.js'),S=E.STATUS_RULES,db=require('../status-database.cjs');
const sequence=values=>{let i=0;return ()=>{assert.ok(i<values.length,'不得额外抽样');return values[i++];};};
const fighter=()=>({hp:1600,stats:{maxHp:1600},counts:{immune:0},resistUntil:0,ailments:{}});
// Synthetic, soul-free skill fixture; no species file or import cursor is touched.
const key=(side,slot)=>'wiki:'+((900880+side)*10+slot);
function snapshot(side,count){const id=900880+side,R=E.WIKI.effectsEngine.registry[2074];return {id,name:'2074公共效果夹具',type:'普通',base:{maxHp:100,atk:100,def:100,spa:100,spd:100,spe:100},souls:[],source:{provider:'seerapi'},typeChart:{revision:'2074-test',aliases:{普通:['普通']},rows:{普通:{普通:1}}},effects:count?[{id:2074,argsNum:1,template:R.template}]:[],missingEffects:[],moves:Array.from({length:4},(_,i)=>({id:id*10+i,name:'2074测试招'+i,provider:'seerapi',kind:i===0?'physical':'status',type:'普通',power:i===0?120:0,pp:30,priority:0,accuracy:100,alwaysHit:true,critical:'1/16',level:i,fifth:false,effectIds:i===1&&count?[2074]:[],effectInstances:i===1&&count?[{id:2074,args:[count]}]:[],description:''}))};}
function game(count=1){return E.createBattle({wikiSnapshots:[snapshot(0,count),snapshot(1,0)],criticals:false,seed:'effect2074',builds:[{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:500}},{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:100}}]});}
const turn=(s,a=1,b=2)=>E.resolveTurn(s,[key(0,a),key(1,b)]);
const timer=(s,side,k)=>{s.fighters[side].effects[k]={start:1,end:99};};
function find(name,duration=null){for(let seed=0;seed<1024;seed++){const s=game();s.rng=seed;const o=turn(s),draw=o.randomStatusEvents.find(e=>e.type==='draw');if(draw.name===name&&(duration===null||draw.duration===duration))return {s,o,draw};}assert.fail('未覆盖 '+name+' '+duration);}

test('2074从数据库动态读取全部38个PVP候选，排除限制类与确认的PVE专属项，保留来源冲突',()=>{
 const expected=db.list().filter(r=>!['瘫痪','凝滞','山神守护'].includes(r.name)).map(({id,name})=>({id,name}));assert.deepEqual(P.pool(),expected);assert.equal(P.pool().length,38);
 assert.ok(P.pool().some(r=>r.name==='魇昧'));assert.ok(!P.pool().some(r=>r.name==='山神守护'));assert.equal(db.getByName('魇昧').classification.isRestrictedClass,true);assert.equal(db.getByName('山神守护').classification.isAbnormal,null);assert.equal(P.sourceType,'project_rule/user_confirmed');
 const copy=structuredClone(db.list());copy.push({id:100,name:'仅测试动态目录'});assert.ok(P.pool(copy).some(r=>r.id===100));assert.equal(P.pool().some(r=>r.id===100),false);assert.equal(P.pool(copy).length,39);
});

test('2074每个候选占同样宽度的随机区间，端点覆盖首尾项',()=>{
 const pool=P.pool(),counts=new Map(pool.map(r=>[r.id,0]));
 for(let i=0;i<pool.length;i++)for(const offset of [.01,.25,.5,.75,.99]){const [choice]=P.draw(1,sequence([(i+offset)/pool.length,0]));assert.equal(choice.id,pool[i].id);counts.set(choice.id,counts.get(choice.id)+1);}
 assert.ok([...counts.values()].every(n=>n===5));assert.equal(P.draw(1,sequence([0,0]))[0].id,pool[0].id);assert.equal(P.draw(1,sequence([1-Number.EPSILON,0]))[0].id,pool.at(-1).id);
});

test('2074持续2或3回合等概率独立抽取，精确检查二分区边界',()=>{
 for(const [u,n]of [[0,2],[.5-Number.EPSILON,2],[.5,3],[1-Number.EPSILON,3]])assert.equal(P.draw(1,sequence([.4,u]))[0].duration,n);
 const counts=[0,0];for(let i=0;i<300;i++)counts[P.draw(1,sequence([.6,(i+.5)/300]))[0].duration-2]++;assert.deepEqual(counts,[150,150]);
});

test('2074同次多种无放回、跨次可重抽，数量和随机值错误不修改状态',()=>{
 const all=P.draw(38,()=>0);assert.equal(new Set(all.map(r=>r.id)).size,38);assert.deepEqual(all.map(r=>r.id),P.pool().map(r=>r.id));
 assert.equal(P.draw(1,()=>0)[0].id,P.draw(1,()=>0)[0].id);
 for(const n of [0,-1,1.5,39])assert.throws(()=>P.draw(n,()=>assert.fail('非法数量先拒绝')),RangeError);
 for(const u of [-.1,1,NaN,Infinity])assert.throws(()=>P.draw(1,()=>u),RangeError);
 const f=fighter();assert.throws(()=>S.effect2074({t:f,a:fighter(),random:sequence([0,0,1]),ailment:()=>assert.fail('完整抽样校验前不能施加')},2),RangeError);assert.deepEqual(f.ailments,{});
});

test('2074公共施加按最大剩余回合刷新，短新时长不缩短且不相加',()=>{
 for(const [oldEnd,newDuration,expected]of [[8,1,8],[4,3,6],[6,3,6],[2,2,5]]){
  const f=fighter();f.ailments['中毒']=oldEnd;f.ailments['混乱']=12;
  const out=S.attempt(f,'中毒',4,{duration:newDuration,merge:'max-remaining'});assert.equal(out.applied,true);assert.equal(f.ailments['中毒'],expected);assert.equal(out.endRound,expected);assert.equal(out.appliedDuration,expected-4+1);assert.equal(f.ailments['混乱'],12);
 }
 const ordinary=fighter();ordinary.ailments['中毒']=8;S.attempt(ordinary,'中毒',4,{duration:1});assert.equal(ordinary.ailments['中毒'],8,'Q002其它未说明效果也采用最大剩余时长');
});

test('2074免疫失败不刷新已有状态，抗性窗口采用新时长而非合并时长',()=>{
 const f=fighter();f.ailments['中毒']=20;f.counts.immune=1;
 let out=S.attempt(f,'中毒',4,{duration:2,merge:'max-remaining'});assert.equal(out.reason,'count-immunity');assert.equal(f.counts.immune,0);assert.equal(f.ailments['中毒'],20);
 out=S.attempt(f,'中毒',4,{duration:2,merge:'max-remaining',resistanceChance:()=>1,random:()=>0});assert.equal(out.reason,'resisted');assert.equal(f.resistUntil,5);assert.equal(f.ailments['中毒'],20);
 out=S.attempt(f,'中毒',5,{duration:3,merge:'max-remaining'});assert.equal(out.reason,'resistance-window');assert.equal(f.ailments['中毒'],20);
});

test('2074经真实技能入口施加中毒扣血、麻痹阻止行动，时长到期后恢复',()=>{
 for(const [name,duration]of [['中毒',3],['麻痹',2]]){const {s,o}=find(name,duration);assert.equal(o.fighters[1].ailments[name],duration);assert.deepEqual(s.fighters[1].ailments,{});assert.equal(o.fighters[0].pp[key(0,1)],29);
  if(name==='中毒')assert.equal(o.fighters[1].hp,1400);else assert.equal(o.fighters[1].pp[key(1,2)],30);
  let next=o;for(let round=2;round<=duration;round++)next=turn(next,2);assert.equal(next.fighters[1].ailments[name],undefined);
  const hp=next.fighters[1].hp,pp=next.fighters[1].pp[key(1,2)];next=turn(next,2);assert.equal(next.fighters[1].hp,hp);assert.equal(next.fighters[1].pp[key(1,2)],pp-1);
 }
});

test('2074真实同状态刷新保留更长时间、延长短时间，并保持其它状态',()=>{
 const {s}=find('中毒',3);for(const [old,expected]of [[1,3],[7,7]]){const a=structuredClone(s);a.fighters[1].ailments['中毒']=old;a.fighters[1].ailments['混乱']=9;const out=turn(a);assert.equal(out.fighters[1].ailments['中毒'],expected);assert.equal(out.fighters[1].ailments['混乱'],9);assert.equal(out.randomStatusEvents.find(e=>e.type==='application').endRound,expected);}
});

test('2074真实免异常、次数免疫及抗性成功均不刷新，不失败补抽',()=>{
 const {s}=find('中毒',3);
 for(const kind of ['免异常','count','window']){const a=structuredClone(s);a.fighters[1].ailments['中毒']=7;if(kind==='免异常')timer(a,1,kind);else if(kind==='count')a.fighters[1].counts.immune=1;else a.fighters[1].resistUntil=3;const o=turn(a);assert.equal(o.fighters[1].ailments['中毒'],7);assert.equal(o.randomStatusEvents.filter(e=>e.type==='draw').length,1);assert.equal(o.randomStatusEvents.find(e=>e.type==='application').applied,false);if(kind==='count')assert.equal(o.fighters[1].counts.immune,0);}
 let resisted=false,applied=false;for(let seed=0;seed<256&&(!resisted||!applied);seed++){const a=game();a.rng=seed;a.fighters[1].build.resistance.major='中毒';const o=turn(a),draw=o.randomStatusEvents.find(e=>e.type==='draw'),event=o.randomStatusEvents.find(e=>e.type==='application');if(draw.name!=='中毒')continue;if(event.reason==='resisted'){resisted=true;assert.equal(o.fighters[1].resistUntil,draw.duration);assert.equal(o.fighters[1].ailments['中毒'],undefined);}else if(event.applied){applied=true;assert.equal(event.endRound,draw.duration);}}
 assert.ok(resisted&&applied);
});

test('2074反弹携带原时长及max策略，仅刷新实际接收者，双向反弹停止',()=>{
 const {s}=find('中毒',3);s.fighters[0].ailments['中毒']=8;timer(s,1,'reflect');let o=turn(s);assert.equal(o.fighters[0].ailments['中毒'],8);assert.equal(o.fighters[1].ailments['中毒'],undefined);assert.equal(o.randomStatusEvents.filter(e=>e.type==='draw').length,1);
 const received=o.randomStatusEvents.find(e=>e.type==='application'&&e.applied);assert.equal(received.targetSide,0);assert.equal(received.duration,3);assert.equal(received.endRound,8);
 const both=structuredClone(s);delete both.fighters[0].ailments['中毒'];timer(both,0,'reflect');o=turn(both);assert.deepEqual(o.fighters[0].ailments,{});assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.randomStatusEvents.filter(e=>e.type==='application').length,2);
});

test('2074对免疫目标抽取N种只消费实际次数，不额外补抽',()=>{
 const s=game(3);s.fighters[1].counts.immune=3;const o=turn(s);const draws=o.randomStatusEvents.filter(e=>e.type==='draw');assert.equal(draws.length,3);assert.equal(new Set(draws.map(e=>e.id)).size,3);assert.equal(o.fighters[1].counts.immune,0);assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.randomStatusEvents.filter(e=>e.reason==='count-immunity').length,3);
});

test('2074命中阶段未到达或目标倒下时不施加、不消耗抽样随机数',()=>{
 const s=game();s.moveDefinitions[key(0,1)].alwaysHit=false;s.moveDefinitions[key(0,1)].accuracy=0;const o=turn(s);assert.equal(o.randomStatusEvents,undefined);assert.deepEqual(o.fighters[1].ailments,{});assert.equal(o.fighters[0].pp[key(0,1)],29);
 const f=fighter();f.hp=0;assert.deepEqual(S.effect2074({t:f,random:()=>assert.fail('倒下不抽样')},1),[]);
});

test('2074按用户规则排除PVE山神守护，魇昧正常施加为白板异常',()=>{
 assert.ok(!P.pool().some(x=>x.name==='山神守护'));const {o}=find('魇昧',3);assert.equal(o.fighters[1].ailments['魇昧'],3);assert.equal(o.fighters[1].hp,1600);assert.ok(!o.pendingStatusBehaviors?.some(x=>x.name==='魇昧'));assert.equal(S.attempt(fighter(),'山神守护',1,{duration:3}).reason,'pve-only');
});

test('2074浏览器目录与数据库一致，浏览器和Node同种子真实结果一致',()=>{
 const dir=path.join(__dirname,'../dist'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8'),scripts=[...html.matchAll(/<script defer src="([^"]+)"/g)].map(m=>m[1]),browser=vm.createContext({console});
 for(const file of scripts.slice(0,scripts.indexOf('engine.js')+1))vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),browser,{filename:file});
 assert.deepEqual(JSON.parse(JSON.stringify(browser.BattleStatusCatalog.records)),db.list().map(({id,name})=>({id,name})));
 assert.equal(browser.BattleStatusCatalog.databaseHash,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../data/statuses/statuses.json'))).digest('hex'));
 assert.deepEqual(JSON.parse(JSON.stringify(browser.BattleStatusPools.pool())),P.pool());
 const a=game(2),b=browser.BattleEngine.createBattle(a.initial),x=turn(a),y=browser.BattleEngine.resolveTurn(b,[key(0,1),key(1,2)]);assert.deepEqual(JSON.parse(JSON.stringify(y.randomStatusEvents)),x.randomStatusEvents);assert.deepEqual(JSON.parse(JSON.stringify(y.fighters[1].ailments)),x.fighters[1].ailments);assert.equal(y.fighters[1].hp,x.fighters[1].hp);
});
