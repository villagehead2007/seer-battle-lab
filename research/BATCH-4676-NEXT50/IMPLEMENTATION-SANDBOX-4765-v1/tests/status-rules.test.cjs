'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),S=E.STATUS_RULES;
// Synthetic, soul-free fixtures only; these IDs are never imported into the species queue.
const key=(side,slot)=>'wiki:'+((900800+side)*10+slot);
function snapshot(side,ops=[]){const id=900800+side,R=E.WIKI.effectsEngine;return {id,name:'公共状态测试夹具',type:'普通',base:{maxHp:100,atk:100,def:100,spa:100,spd:100,spe:100},souls:[],source:{provider:'seerapi'},typeChart:{revision:'status-test',aliases:{普通:['普通']},rows:{普通:{普通:1}}},effects:ops.map(([id])=>({id,argsNum:R.registry[id].argsNum,template:R.registry[id].template})),missingEffects:[],moves:Array.from({length:4},(_,i)=>({id:id*10+i,name:'状态测试招'+i,provider:'seerapi',kind:i===0?'physical':i===3?'special':'status',type:'普通',power:i===0||i===3?120:0,pp:30,priority:0,accuracy:100,alwaysHit:true,critical:'1/16',level:i,fifth:false,effectIds:i===1?ops.map(x=>x[0]):[],effectInstances:i===1?ops.map(([id,args])=>({id,args})):[],description:''}))};}
function game(a=[],b=[]){return E.createBattle({wikiSnapshots:[snapshot(0,a),snapshot(1,b)],criticals:false,seed:'status-rules',builds:[{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:500}},{overrides:{maxHp:1600,atk:200,spa:200,def:200,spd:200,spe:100}}]});}
const turn=(s,a=2,b=2)=>E.resolveTurn(s,[key(0,a),key(1,b)]);
function timer(s,side,name){s.fighters[side].effects[name]={start:1,end:99};}
const applications=[['麻痹',10,[100]],['中毒',11,[100]],['烧伤',12,[100]],['冻伤',14,[100]],['害怕',15,[100]],['睡眠',16,[100]],['混乱',1975,[2,100,10,20]],['冰封',756,[100,15]]];
function lasting(name,id,args,setup=()=>{}){for(let seed=0;seed<64;seed++){const s=game([[id,args]]);s.rng=seed;setup(s);const o=turn(s,1,name==='混乱'?0:2);if(o.fighters[1].ailments[name]>=o.round)return {s,o};}assert.fail('未找到仍持续的分支 '+name);}

test('十种基础状态按显式时长写入真实回合，零回合拒绝且倒下目标不施加',()=>{
 const s=game();for(const name of Object.keys(S.ids)){const f=s.fighters[0];assert.equal(S.apply(f,name,2,3),true);assert.equal(f.ailments[name],4);assert.equal(S.active(f,name,4),true);assert.equal(S.active(f,name,5),false);const before=structuredClone(f);assert.throws(()=>S.apply(f,name,2,0),RangeError);assert.deepEqual(f,before);S.clear(f,name);assert.equal(f.ailments[name],undefined);}s.fighters[0].hp=0;assert.equal(S.apply(s.fighters[0],'烧伤',1,2),false);assert.deepEqual(s.fighters[0].ailments,{});
});
test('真实效果入口施加八种基础状态，并实际影响对手行动或血量',()=>{
 for(const [name,id,args]of applications){const {s,o}=lasting(name,id,args);assert.ok(o.fighters[1].ailments[name]>=2,name);assert.equal(o.fighters[0].pp[key(0,1)],29);if(['麻痹','害怕','睡眠','冰封'].includes(name))assert.equal(o.fighters[1].pp[key(1,2)],30);if(['中毒','烧伤','冻伤'].includes(name))assert.equal(o.fighters[1].hp,1400);assert.deepEqual(s.fighters[1].ailments,{});}
});
test('八种基础状态均受公共免异常、次数免疫及反弹限制',()=>{
 for(const [name,id,args]of applications){const blocked=game([[id,args]]);timer(blocked,1,'免异常');const b=turn(blocked,1,name==='混乱'?0:2);assert.deepEqual(b.fighters[1].ailments,{});assert.equal(b.fighters[1].hp,1600);assert.equal(b.fighters[1].pp[key(1,name==='混乱'?0:2)],29);
 const once=game([[id,args]]);once.fighters[1].counts.immune=1;const o=turn(once,1,name==='混乱'?0:2);assert.equal(o.fighters[1].counts.immune,0);assert.deepEqual(o.fighters[1].ailments,{});
 let found=false;for(let seed=0;seed<64&&!found;seed++){const reflect=game([[id,args]]);reflect.rng=seed;timer(reflect,1,'reflect');const r=turn(reflect,1,name==='混乱'?0:2);assert.deepEqual(r.fighters[1].ailments,{});if(r.fighters[0].ailments[name]>=2){found=true;assert.equal(r.fighters[0].pp[key(0,1)],29);}}assert.ok(found,name);}
});
test('状态抗性成功产生免疫窗口，失败才实际施加，免疫窗口结束后可重新施加',()=>{
 let yes,no;for(let seed=0;seed<128&&(!yes||!no);seed++){const s=game([[10,[100]]]);s.rng=seed;s.fighters[1].build.resistance.major='麻痹';const o=turn(s,1);if(o.fighters[1].resistUntil>=2)yes=o;else if(o.fighters[1].ailments['麻痹']>=2)no=o;}assert.ok(yes&&no);assert.deepEqual(yes.fighters[1].ailments,{});assert.equal(yes.fighters[1].pp[key(1,2)],29);assert.equal(no.fighters[1].pp[key(1,2)],30);
 const end= yes.fighters[1].resistUntil;yes.fighters[1].build.resistance.major='';for(;yes.round<=end;)yes=turn(yes,1);assert.deepEqual(yes.fighters[1].ailments,{});const after=turn(yes,1);assert.equal(after.fighters[1].pp[key(1,2)],yes.fighters[1].pp[key(1,2)]);
});
test('六种控制状态逐回合阻止行动和PP消耗，期满后恢复行动',()=>{
 for(const name of ['麻痹','害怕','睡眠','疲惫','石化','冰封']){let s=game();S.apply(s.fighters[0],name,1,2);s=turn(s);assert.equal(s.fighters[0].pp[key(0,2)],30);assert.ok(s.fighters[0].ailments[name]);s=turn(s);assert.equal(s.fighters[0].pp[key(0,2)],30);assert.equal(s.fighters[0].ailments[name],undefined);s=turn(s);assert.equal(s.fighters[0].pp[key(0,2)],29);}
});
test('烧伤降低最终攻击技能威力而非伤害直接减半，物攻特攻都生效',()=>{
 for(const slot of [0,3]){const burned=game(),half=game(),plain=game();S.apply(burned.fighters[0],'烧伤',1,1);half.moveDefinitions[key(0,slot)].power=60;const b=turn(burned,slot),h=turn(half,slot),p=turn(plain,slot);assert.equal(b.fighters[1].hp,h.fighters[1].hp);assert.ok(b.fighters[1].hp>p.fighters[1].hp);assert.equal(b.fighters[0].hp,1400);assert.equal(b.fighters[0].ailments['烧伤'],undefined);const healed=turn(b,slot),nextPlain=turn(p,slot);assert.equal(b.fighters[1].hp-healed.fighters[1].hp,p.fighters[1].hp-nextPlain.fighters[1].hp);}
});
test('烧伤威力修正和公共威力强化叠加，清除后不再降低威力',()=>{
 const a=game(),b=game();S.apply(a.fighters[0],'烧伤',1,5);timer(a,0,'鬼王威力翻倍');assert.equal(turn(a,0).fighters[1].hp,turn(b,0).fighters[1].hp);
 const c=game([[2240,[0]]]);S.apply(c.fighters[0],'烧伤',1,3);const out=turn(c,0); // put the cleansing effect on the attack for this synthetic counterfactual
 const clean=game([[2240,[0]]]);const attack=clean.moveDefinitions[key(0,0)],skill=clean.moveDefinitions[key(0,1)];attack.operations=skill.operations;S.apply(clean.fighters[0],'烧伤',1,3);const o=turn(clean,0);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[1].hp,turn(game(),0).fighters[1].hp);assert.ok(out.fighters[1].hp>o.fighters[1].hp);
});
test('中毒烧伤冻伤每回合各扣八分之一，不互相覆盖，结束后停止扣血',()=>{
 let s=game();for(const n of ['中毒','烧伤','冻伤'])S.apply(s.fighters[0],n,1,2);s=turn(s);assert.equal(s.fighters[0].hp,1000);s=turn(s);assert.equal(s.fighters[0].hp,400);assert.deepEqual(s.fighters[0].ailments,{});s=turn(s);assert.equal(s.fighters[0].hp,400);
});
test('持续伤害沿用百分比免疫与抗性，已倒下目标不重复扣血',()=>{
 const s=game();S.apply(s.fighters[0],'中毒',1,2);timer(s,0,'当回合免伤');assert.equal(turn(s).fighters[0].hp,1600);
 const reduced=game();S.apply(reduced.fighters[0],'冻伤',1,2);reduced.fighters[0].build.resistance.percent=50;assert.equal(turn(reduced).fighters[0].hp,1500);
 const lethal=game();lethal.fighters[0].hp=100;for(const n of ['中毒','烧伤','冻伤'])S.apply(lethal.fighters[0],n,1,2);const o=turn(lethal);assert.equal(o.fighters[0].hp,0);assert.equal(o.finished,true);assert.equal(o.turns[0].events.filter(x=>x.text.includes(' 点')&&/中毒|烧伤|冻伤/.test(x.text)).length,1);
});
test('真实清异常技能清除持续伤害，未到期控制也可被公共清除且不触发到期转化',()=>{
 const s=game([[544,[]]]);for(const n of ['中毒','烧伤','冻伤'])S.apply(s.fighters[0],n,1,3);const o=turn(s,1);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[0].hp,1600);
 const ice=game();S.apply(ice.fighters[0],'冰封',1,1);assert.deepEqual(S.clearAll(ice.fighters[0]),['冰封']);const cleared=turn(ice);assert.equal(cleared.fighters[0].stages.spe,0);assert.equal(cleared.pendingStatusTransitions,undefined);assert.equal(cleared.fighters[0].pp[key(0,2)],29);
});
test('睡眠命中攻击即解除，零伤害仍解除，MISS或属性技能不解除',()=>{
 const hit=game();S.apply(hit.fighters[1],'睡眠',1,3);timer(hit,1,'当回合免伤');const h=turn(hit,0);assert.equal(h.fighters[1].hp,1600);assert.equal(h.fighters[1].ailments['睡眠'],undefined);assert.equal(h.fighters[1].pp[key(1,2)],29);
 const miss=game();S.apply(miss.fighters[1],'睡眠',1,3);miss.moveDefinitions[key(0,0)].alwaysHit=false;timer(miss,0,'攻击必失');const m=turn(miss,0);assert.equal(m.fighters[1].ailments['睡眠'],3);assert.equal(m.fighters[1].pp[key(1,2)],30);
 const status=game();S.apply(status.fighters[1],'睡眠',1,3);assert.equal(turn(status).fighters[1].ailments['睡眠'],3);
});
test('睡眠解除不清除同时存在的其它控制，期满恢复不修改前一回合快照',()=>{
 const s=game();for(const n of ['睡眠','麻痹'])S.apply(s.fighters[1],n,1,2);const before=structuredClone(s),o=turn(s,0);assert.equal(o.fighters[1].ailments['睡眠'],undefined);assert.equal(o.fighters[1].ailments['麻痹'],2);assert.equal(o.fighters[1].pp[key(1,2)],30);assert.deepEqual(s,before);
});
test('混乱影响非必中攻击的命中，不降低属性技能或必中招命中',()=>{
 let seen=false;for(let seed=0;seed<128&&!seen;seed++){const s=game();s.rng=seed;S.apply(s.fighters[0],'混乱',1,3);s.moveDefinitions[key(0,0)].alwaysHit=false;const control=structuredClone(s);delete control.fighters[0].ailments['混乱'];const a=turn(s,0),b=turn(control,0);if(a.fighters[1].hp===1600&&b.fighters[1].hp<1600){seen=true;assert.equal(a.fighters[0].pp[key(0,0)],29);}}assert.ok(seen);
 const certain=game();S.apply(certain.fighters[0],'混乱',1,2);assert.ok(turn(certain,0).fighters[1].hp<1600);const attr=game([[11,[100]]]);S.apply(attr.fighters[0],'混乱',1,2);assert.equal(turn(attr,1).fighters[1].hp,1400);
});
test('混乱5%扣血成功与失败边界、免伤及到期后停止',()=>{
 const s=game(),f=s.fighters[0];S.apply(f,'混乱',1,2);const hurt=(t,n)=>{t.hp=Math.max(0,t.hp-n);};S.confusionDamage(f,1,()=>.049999,hurt);assert.equal(f.hp,1550);S.confusionDamage(f,1,()=>.05,hurt);assert.equal(f.hp,1550);S.confusionDamage(f,3,()=>0,hurt);assert.equal(f.hp,1550);
 let found=false;for(let seed=0;seed<128&&!found;seed++){const b=game();b.rng=seed;S.apply(b.fighters[0],'混乱',1,1);const o=turn(b);if(o.fighters[0].hp===1550){found=true;const immune=structuredClone(b);timer(immune,0,'当回合免伤');assert.equal(turn(immune).fighters[0].hp,1550);assert.equal(turn(o).fighters[0].hp,1550);}}assert.ok(found);
});
test('冰封自然到期速度下降有边界及免弱，确认转为后续两回合冻伤',()=>{
 for(const [speed,immune,expected]of [[0,false,-1],[-6,false,-6],[0,true,0]]){const s=game();S.apply(s.fighters[0],'冰封',1,1);s.fighters[0].stages.spe=speed;if(immune)timer(s,0,'免弱');const o=turn(s);assert.equal(o.fighters[0].stages.spe,expected);assert.equal(o.fighters[0].ailments['冰封'],undefined);assert.equal(o.fighters[0].ailments['冻伤'],3);assert.equal(o.pendingStatusTransitions,undefined);assert.equal(turn(o).fighters[0].hp,1400);}
});
test('倒下精灵冰封到期不产生弱化或待转化，状态实例相互独立',()=>{
 const s=game(),a=s.fighters[0],b=s.fighters[1];S.apply(a,'冰封',1,1);S.apply(b,'冰封',1,3);a.hp=0;let changes=0;S.iceExpired(a,1,()=>changes++,()=>changes++);assert.equal(changes,0);S.clear(a,'冰封');assert.equal(b.ailments['冰封'],3);
});
test('来源编码绑定及浏览器脚本加载顺序与Node端产生相同状态结果',()=>{
 const fs=require('fs'),path=require('path'),vm=require('vm'),db=require('../status-database.cjs');for(const [name,id]of Object.entries(S.ids))assert.equal(db.getById(id).name,name);assert.equal(S.sourceRevision,db.database.sources['wiki-mechanics'].revision);
 const dir=path.join(__dirname,'../dist'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');const scripts=[...html.matchAll(/<script defer src="([^"]+)"/g)].map(x=>x[1]);assert.ok(scripts.indexOf('status-rules.js')<scripts.indexOf('souls.js'));
 const browser=vm.createContext({console});for(const file of scripts.slice(0,scripts.indexOf('engine.js')+1))vm.runInContext(fs.readFileSync(path.join(dir,file),'utf8'),browser,{filename:file});
 const a=game(),b=browser.BattleEngine.createBattle(a.initial);S.apply(a.fighters[0],'烧伤',1,2);browser.BattleEngine.STATUS_RULES.apply(b.fighters[0],'烧伤',1,2);const x=turn(a,0),y=browser.BattleEngine.resolveTurn(b,[key(0,0),key(1,2)]);assert.equal(x.fighters[1].hp,y.fighters[1].hp);assert.equal(x.fighters[0].hp,y.fighters[0].hp);assert.equal(y.fighters[0].ailments['烧伤'],2);
});
test('疲惫显式时长经真实效果入口生效，清异常技能恢复状态而不引发转化',()=>{
 let s=game([[20,[100,2]]]);s=turn(s,1);assert.equal(s.fighters[0].ailments['疲惫'],2);const pp=s.fighters[0].pp[key(0,2)];s=turn(s);assert.equal(s.fighters[0].pp[key(0,2)],pp);assert.equal(s.fighters[0].ailments['疲惫'],undefined);s=turn(s);assert.equal(s.fighters[0].pp[key(0,2)],pp-1);
 const cleansing=game([[2482,[1,10]]]);cleansing.fighters[0].hp=1000;for(const n of ['中毒','烧伤','冻伤','混乱'])S.apply(cleansing.fighters[0],n,1,3);const o=turn(cleansing,1);assert.deepEqual(o.fighters[0].ailments,{});assert.equal(o.fighters[0].hp,1600);assert.equal(o.pendingStatusTransitions,undefined);
});
