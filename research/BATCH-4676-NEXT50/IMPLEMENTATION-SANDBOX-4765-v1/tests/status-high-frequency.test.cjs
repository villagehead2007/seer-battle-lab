'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),S=E.STATUS_RULES,db=require('../status-database.cjs');
const names=['中毒','麻痹','睡眠','害怕','混乱'];
const fighter=()=>({hp:1600,stats:{maxHp:1600},ailments:{},counts:{immune:0},resistUntil:0});
const noRandom=()=>assert.fail('该分支不应消耗随机数');
// Soul-free synthetic fixtures; not imported or persisted as species.
const key=(side,slot)=>'wiki:'+((900850+side)*10+slot);
function snapshot(side,ops=[]){const id=900850+side,R=E.WIKI.effectsEngine;return {id,name:'高频状态交互夹具',type:'普通',base:{maxHp:100,atk:100,def:100,spa:100,spd:100,spe:100},souls:[],source:{provider:'seerapi'},typeChart:{revision:'status-interaction-test',aliases:{普通:['普通']},rows:{普通:{普通:1}}},effects:ops.map(([id])=>({id,argsNum:R.registry[id].argsNum,template:R.registry[id].template})),missingEffects:[],moves:Array.from({length:4},(_,i)=>({id:id*10+i,name:'状态交互招'+i,provider:'seerapi',kind:i===0?'physical':i===3?'special':'status',type:'普通',power:i===0||i===3?120:0,pp:30,priority:0,accuracy:100,alwaysHit:true,critical:'1/16',level:i,fifth:false,effectIds:i===1?ops.map(x=>x[0]):[],effectInstances:i===1?ops.map(([id,args])=>({id,args})):[],description:''}))};}
function game(ops=[]){return E.createBattle({wikiSnapshots:[snapshot(0,ops),snapshot(1)],criticals:false,seed:'status-interaction',builds:[{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:500}},{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:100}}]});}
const turn=(s,a=2,b=2)=>E.resolveTurn(s,[key(0,a),key(1,b)]);
const timer=(s,side,name)=>{s.fighters[side].effects[name]={start:1,end:99};};

test('五种状态默认二或三回合均匀，免疫先行且保留Wiki未知原字段',()=>{
 for(const name of names){const f=fighter();f.counts.immune=1;const out=S.attempt(f,name,1,{random:noRandom});assert.equal(out.reason,'count-immunity');assert.equal(out.applied,false);assert.equal(f.counts.immune,0);assert.deepEqual(f.ailments,{});for(const [u,n]of [[0,2],[.5-Number.EPSILON,2],[.5,3],[1-Number.EPSILON,3]]){const x=fighter();const a=S.attempt(x,name,1,{random:()=>u});assert.equal(a.duration,n);assert.equal(x.ailments[name],n);assert.equal(a.durationOrigin,'user-confirmed-default-2-3');}assert.equal(db.getByName(name).defaultDurationTurns,null);}
});

test('五种状态显式时长施加并持续到边界，非法时长不消费已有免疫',()=>{
 for(const name of names){const f=fighter();const out=S.attempt(f,name,4,{duration:2,random:noRandom});assert.equal(out.applied,true);assert.equal(out.durationOrigin,'explicit');assert.equal(f.ailments[name],5);assert.equal(S.active(f,name,5),true);assert.equal(S.active(f,name,6),false);
  f.counts.immune=1;const before=structuredClone(f);for(const n of [0,-1,1.5,NaN,Infinity])assert.throws(()=>S.attempt(f,name,4,{duration:n,random:noRandom}),RangeError);assert.deepEqual(f,before);
  f.hp=0;assert.equal(S.attempt(f,name,4,{duration:2,random:noRandom}).reason,'defeated');assert.equal(f.counts.immune,1);
 }
});

test('五种状态共用策略阻挡、次数免疫和抗性窗口，按原顺序且只消费一次',()=>{
 for(const name of names){const f=fighter();f.counts.immune=2;f.resistUntil=5;
  assert.equal(S.attempt(f,name,4,{duration:2,gate:()=>false,random:noRandom}).reason,'blocked-by-policy');assert.equal(f.counts.immune,2);
  assert.equal(S.attempt(f,name,4,{duration:2,random:noRandom}).reason,'count-immunity');assert.equal(f.counts.immune,1);
  assert.equal(S.attempt(f,name,4,{duration:2,random:noRandom}).reason,'count-immunity');assert.equal(f.counts.immune,0);
  assert.equal(S.attempt(f,name,5,{duration:2,random:noRandom}).reason,'resistance-window');assert.deepEqual(f.ailments,{});
  assert.equal(S.attempt(f,name,6,{duration:2,random:noRandom}).applied,true);assert.equal(f.ailments[name],7);
 }
});

test('五种状态抗性概率边界及等时免疫窗口由公共模块实际写入',()=>{
 for(const name of names){for(const [roll,resisted]of [[.179999,true],[.18,false]]){const f=fighter(),events=[];
  const out=S.attempt(f,name,3,{duration:2,resistanceChance:()=>.18,random:()=>roll,notify:x=>events.push(x.reason)});
  assert.equal(out.applied,!resisted);assert.equal(f.resistUntil,resisted?4:0);assert.equal(f.ailments[name],resisted?undefined:4);
  assert.deepEqual(events,resisted?['resisted']:['resistance-failed','applied']);
 }}
});

test('显式绕过免疫不消费免疫次数、抗性窗口或概率，仍使用给定时长',()=>{
 for(const name of names){const f=fighter();f.counts.immune=2;f.resistUntil=9;
  const out=S.attempt(f,name,3,{duration:2,bypass:true,gate:()=>assert.fail('不应进入专属免疫'),resistanceChance:()=>1,random:noRandom});
  assert.equal(out.applied,true);assert.equal(f.ailments[name],4);assert.equal(f.counts.immune,2);assert.equal(f.resistUntil,9);
 }
});

test('旧实验时长必须显式注入并带来源标签，不成为状态默认值',()=>{
 for(const name of names){const f=fighter(),draws=[.9,.4];let calls=0;
  const out=S.attempt(f,name,2,{resistanceChance:()=>.18,random:()=>{calls++;return draws.shift();},durationFallback:{origin:'legacy-experimental-1-3',resolve:r=>1+Math.floor(r()*3)}});
  assert.equal(out.applied,true);assert.equal(out.duration,2);assert.equal(out.durationOrigin,'legacy-experimental-1-3');assert.equal(f.ailments[name],3);assert.equal(calls,2);assert.equal(db.getByName(name).defaultDurationTurns,null);
 }
});

test('五种状态主动清除与到期独立，清除幂等且到期回调只触发一次',()=>{
 const f=fighter();for(const name of names)S.attempt(f,name,1,{duration:2});
 assert.equal(S.clear(f,'睡眠'),true);assert.equal(S.clear(f,'睡眠'),false);assert.equal(f.ailments['麻痹'],2);const expired=[];
 assert.deepEqual(S.expire(f,1,k=>expired.push(k)),[]);assert.equal(expired.length,0);
 assert.deepEqual(S.expire(f,2,k=>expired.push(k)),names.filter(n=>n!=='睡眠'));assert.deepEqual(expired,names.filter(n=>n!=='睡眠'));assert.deepEqual(f.ailments,{});
 assert.deepEqual(S.expire(f,3,k=>expired.push(k)),[]);assert.equal(expired.length,4);
 for(const name of names)S.attempt(f,name,4,{duration:2});assert.deepEqual(S.clearAll(f),names);assert.deepEqual(S.expire(f,5),[]);
});

test('公共到期遍历不会把回调新施加的状态在同一轮再次到期',()=>{
 const f=fighter();S.apply(f,'麻痹',1,1);const expired=[];
 S.expire(f,1,k=>{expired.push(k);S.apply(f,'中毒',1,1);});assert.deepEqual(expired,['麻痹']);assert.equal(f.ailments['中毒'],1);assert.equal(f.ailments['麻痹'],undefined);
});

test('五种状态真实施加遇双向反弹终止，不消费后续次数免疫',()=>{
 for(const [name,id,args]of [['中毒',11,[100]],['麻痹',10,[100]],['睡眠',16,[100]],['害怕',15,[100]],['混乱',1975,[2,100,10,20]]]){
  const s=game([[id,args]]);timer(s,0,'reflect');timer(s,1,'reflect');for(const f of s.fighters)f.counts.immune=1;
  const out=turn(s,1,name==='混乱'?0:2);for(const f of out.fighters){assert.deepEqual(f.ailments,{});assert.equal(f.counts.immune,1);}assert.equal(out.fighters[0].pp[key(0,1)],29);
 }
});

test('真实零概率施加不写入异常也不消耗免疫次数',()=>{
 for(const id of [10,11,15,16]){const s=game([[id,[0]]]);s.fighters[1].counts.immune=1;const out=turn(s,1);assert.deepEqual(out.fighters[1].ailments,{});assert.equal(out.fighters[1].counts.immune,1);assert.equal(out.fighters[1].hp,1600);assert.equal(out.fighters[1].pp[key(1,2)],29);}
});

test('中毒用最大体力计算且受百分比抗性，后加异常免疫不清除既有毒',()=>{
 let s=game();S.attempt(s.fighters[0],'中毒',1,{duration:2});s.fighters[0].hp=900;s.fighters[0].stats.maxHp=2400;s.fighters[0].build.resistance.percent=50;timer(s,0,'免异常');
 s=turn(s);assert.equal(s.fighters[0].hp,750);assert.equal(s.fighters[0].ailments['中毒'],2);assert.equal(s.fighters[0].pp[key(0,2)],29);
 s=turn(s);assert.equal(s.fighters[0].hp,600);assert.equal(s.fighters[0].ailments['中毒'],undefined);assert.equal(turn(s).fighters[0].hp,600);
});

test('麻痹和害怕受到攻击仍控制且不自行改变能力等级，到期后恢复行动',()=>{
 for(const name of ['麻痹','害怕']){let s=game();S.attempt(s.fighters[1],name,1,{duration:2});const stages=structuredClone(s.fighters[1].stages);
  s=turn(s,0);assert.ok(s.fighters[1].hp<1600);assert.equal(s.fighters[1].ailments[name],2);assert.equal(s.fighters[1].pp[key(1,2)],30);assert.deepEqual(s.fighters[1].stages,stages);
  s=turn(s);assert.equal(s.fighters[1].pp[key(1,2)],30);assert.equal(s.fighters[1].ailments[name],undefined);assert.equal(turn(s).fighters[1].pp[key(1,2)],29);
 }
});

test('睡眠不被中毒或混乱自损唤醒，持续伤害照常结算',()=>{
 let found=false;for(let seed=0;seed<128&&!found;seed++){const s=game();s.rng=seed;for(const n of ['睡眠','中毒','混乱'])S.attempt(s.fighters[0],n,1,{duration:3});const out=turn(s);
  if(out.fighters[0].hp===1350){found=true;assert.equal(out.fighters[0].ailments['睡眠'],3);assert.equal(out.fighters[0].pp[key(0,2)],30);assert.equal(out.fighters[0].ailments['混乱'],3);}
 }assert.ok(found,'必须覆盖混乱扣50和中毒扣200同时成功的真实回合');
});

test('先行动者睡眠被后手攻击解除不会补行动，下回合物攻特攻都可恢复',()=>{
 for(const slot of [0,3]){let s=game();S.attempt(s.fighters[0],'睡眠',1,{duration:3});s=turn(s,slot,slot);assert.equal(s.fighters[0].ailments['睡眠'],undefined);assert.equal(s.fighters[0].pp[key(0,slot)],30);assert.ok(s.fighters[0].hp<1600);assert.equal(s.fighters[1].hp,1600);
  s=turn(s,slot);assert.equal(s.fighters[0].pp[key(0,slot)],29);assert.ok(s.fighters[1].hp<1600);
 }
});

test('混乱直接自损不受固伤百分比抗性影响，并与控制状态共存',()=>{
 let found=false;for(let seed=0;seed<128&&!found;seed++){const s=game();s.rng=seed;for(const n of ['混乱','害怕'])S.attempt(s.fighters[0],n,1,{duration:2});s.fighters[0].build.resistance.fixed=50;s.fighters[0].build.resistance.percent=100;const out=turn(s);
  if(out.fighters[0].hp===1550){found=true;assert.equal(out.fighters[0].pp[key(0,2)],30);assert.equal(out.fighters[0].ailments['混乱'],2);assert.equal(out.fighters[0].ailments['害怕'],2);}
 }assert.ok(found);
});

test('混乱降低物攻及特攻命中，清除恢复命中且不清除其它异常',()=>{
 for(const slot of [0,3]){let found=false;for(let seed=0;seed<128&&!found;seed++){const s=game();s.rng=seed;s.moveDefinitions[key(0,slot)].alwaysHit=false;S.attempt(s.fighters[0],'混乱',1,{duration:3});S.attempt(s.fighters[0],'中毒',1,{duration:3});const cleared=structuredClone(s);S.clear(cleared.fighters[0],'混乱');
  const a=turn(s,slot),b=turn(cleared,slot);if(a.fighters[1].hp===1600&&b.fighters[1].hp<1600){found=true;assert.equal(b.fighters[0].hp,1400);assert.equal(b.fighters[0].ailments['中毒'],3);assert.equal(b.fighters[0].ailments['混乱'],undefined);assert.equal(a.fighters[0].pp[key(0,slot)],29);}
 }assert.ok(found);}
});
