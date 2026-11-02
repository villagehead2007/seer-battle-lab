'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3870-battle.cjs');
const e=id=>pick(id)[0];
test('3870 1471消强成功石化失败才回复，免强无目标不补偿',()=>{
 const q=make(e(1471),{hp:1000});assert.equal(turn(q).fighters[0].hp,1000);q.fighters[1].stages.atk=2;const n=turn(q);assert.equal(n.fighters[1].stages.atk,0);assert.ok(n.fighters[1].ailments['石化']);assert.equal(n.fighters[0].hp,1000);timer(q,1,'免异常');assert.equal(turn(q).fighters[0].hp,4000);timer(q,1,'幽蝶强化保护');assert.equal(turn(q).fighters[0].hp,1000);delete q.fighters[1].effects['幽蝶强化保护'];timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);
});
test('3870 106特殊闪避与必中穿透、物理不受影响和期限',()=>{
 const q=turn(make(e(106)));q.moveDefinitions[key(900040)].alwaysHit=false;assert.equal(turn(q,900031,900040).fighters[0].hp,9000);q.moveDefinitions[key(900040)].alwaysHit=true;assert.ok(turn(q,900031,900040).fighters[0].hp<9000);q.moveDefinitions[key(900040)].alwaysHit=false;q.moveDefinitions[key(900040)].kind='physical';assert.ok(turn(q,900031,900040).fighters[0].hp<9000);q.moveDefinitions[key(900040)].kind='special';q.round=4;assert.ok(turn(q,900031,900040).fighters[0].hp<9000);
});
test('3870 745异常翻倍弱化、免弱和六级边界',()=>{
 for(const abnormal of [false,true]){const q=make(e(745));if(abnormal)q.fighters[1].ailments['麻痹']=3;const n=turn(q);for(let i=0;i<6;i++)assert.equal(n.fighters[1].stages[keys[i]],e(745).params[i]*(abnormal?2:1));timer(q,1,'免弱');assert.ok(Object.values(turn(q).fighters[1].stages).every(v=>v===0));delete q.fighters[1].effects['免弱'];q.fighters[1].stages.atk=-6;assert.equal(turn(q).fighters[1].stages.atk,-6);}
});
test('3870 2403伙伴睡眠默认独立时长与免疫失败',()=>{
 const durations=new Set();for(let seed=0;seed<40;seed++){const q=make(e(2403),{seed});durations.add(turn(q).fighters[1].ailments['睡眠']);timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['睡眠'],undefined);}assert.deepEqual([...durations].sort(),[2,3]);
});
test('3870 1465先手最终暴击率与实际未暴击全弱，后手不触发',()=>{
 let crit=false,weak=false;for(let seed=0;seed<80;seed++){const q=make(e(1465),{seed,criticals:true}),n=turn(q);if(n.fighters[1].stages.atk===-1)weak=true;else crit=true;const b=make(e(1465),{seed,criticals:true,aStats:{spe:1}});assert.equal(turn(b).fighters[1].stages.atk,0);}assert.ok(crit&&weak);
 const q=make(e(1465),{criticals:true});timer(q,0,'必定暴击');assert.equal(turn(q).fighters[1].stages.atk,0);
});
test('3870 837固定吸取理论回复、逐次增长封顶和禁疗',()=>{
 let q=make(e(837),{hp:1000});for(const amount of [200,300,400,400]){const hp=q.fighters[0].hp,enemy=q.fighters[1].hp;const n=turn(q);assert.equal(n.fighters[0].hp-hp,amount);assert.equal(enemy-n.fighters[1].hp,amount);q=n;}
 const immune=make(e(837),{hp:1000});immune.fighters[1].build.resistance.fixed=100;assert.equal(turn(immune).fighters[0].hp,1200);assert.equal(turn(immune).fighters[1].hp,9000);timer(immune,0,'技能禁疗');assert.equal(turn(immune).fighters[0].hp,1000);const low=make(e(837),{hp:1000,targetHp:1});assert.equal(turn(low).fighters[0].hp,1200);
});
test('3870 魂印清弱当回合先制增伤、失败与加算',()=>{
 for(const soul of [1142,1449]){const q=make(undefined,{soul});q.fighters[0].stages.acc=-1;const n=turn(q,900030);assert.equal(n.fighters[0].stages.acc,0);assert.equal(n.fighters[0].soulState.darkEyeBonus,.5);const p=make(undefined,{soul});p.fighters[0].stages.acc=-1;p.fighters[0].soulState.darkEyeBonusRound=1;const both=turn(p,900030);assert.equal(both.fighters[0].soulState.darkEyeBonus,1);const base=turn(make(),900030).fighters[0].lastAttackDamage;assert.equal(both.fighters[0].lastAttackDamage,base*2);timer(q,0,'弱化不可解除反转');const fail=turn(q,900031);assert.equal(fail.fighters[0].stages.acc,-1);assert.equal(fail.fighters[0].soulState.darkEyeCleansed,false);}
});
test('3870 魂印双版本强化种类固伤与石化失败下回合增伤',()=>{
 for(const soul of [1142,1449]){const q=make(undefined,{soul});q.fighters[1].stages.def=2;q.fighters[1].stages.acc=1;const n=turn(q,900030);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,(soul===1142?80:100)*2);assert.equal(n.fighters[1].ailments['石化'],undefined);const p=make(undefined,{soul});timer(p,1,'免异常');const fail=turn(p,900030);assert.equal(fail.fighters[0].soulState.darkEyeBonusRound,2);assert.equal(turn(fail,900030).fighters[0].soulState.darkEyeBonus,.5);const miss=make(undefined,{soul,hit:false});miss.moveDefinitions[key(900030)].alwaysHit=false;miss.moveDefinitions[key(900030)].accuracy=0;assert.equal(turn(miss,900030).fighters[0].soulState.darkEyeBonusRound,undefined);}
 let yes=false,no=false;for(let seed=0;seed<60;seed++){const n=turn(make(undefined,{soul:1142,seed}),900030);yes ||=!!n.fighters[1].ailments['石化'];no ||=n.fighters[0].soulState.darkEyeBonusRound===2;}assert.ok(yes&&no);
});
test('3870 4和5基础强化弱化概率、免疫和上限',()=>{
 for(const id of [4,5])for(const x of pick(id)){let yes=false,no=false;for(let seed=0;seed<40;seed++){const v=turn(make(x,{seed})).fighters[id===4?0:1].stages[keys[x.params[0]]];yes ||=v===x.params[2];no ||=v===0;}assert.ok(yes);if(x.params[1]<100)assert.ok(no);const q=make(x);timer(q,id===4?0:1,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[id===4?0:1].stages[keys[x.params[0]]],0);}
});
test('3870 40先手威力、29固伤抗性、43回复截断和89吸血',()=>{
 assert.ok(turn(make(e(40))).fighters[0].lastAttackDamage>turn(make(e(40),{aStats:{spe:1}})).fighters[0].lastAttackDamage*1.8);const q=make(e(29)),n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,90);q.fighters[1].build.resistance.fixed=100;assert.equal(9000-turn(q).fighters[1].hp,turn(q).fighters[0].lastAttackDamage);
 assert.equal(turn(make(e(43),{hp:8000})).fighters[0].hp,9000);const h=make(e(43),{hp:1000});timer(h,0,'技能禁疗');assert.equal(turn(h).fighters[0].hp,1000);const v=turn(make(e(89),{hp:1000})),a=turn(v,900030);assert.equal(a.fighters[0].hp-v.fighters[0].hp,Math.floor(a.fighters[0].lastAttackDamage/3));
});
test('3870 48和191异常免疫反弹及1440一次消费',()=>{
 for(const id of [48,191,1440]){const q=make(e(id));q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['害怕'],undefined);if(id===191)assert.ok(n.fighters[1].ailments['害怕']);if(id===1440)assert.ok(turn(n,900031).fighters[0].ailments['害怕']);}
});
test('3870 1024攻击免疫成功与失败实际伤害百分比反弹',()=>{
 let yes=false,no=false;for(let seed=0;seed<60;seed++){const q=make(e(1024),{seed}),n=turn(q,undefined,900040),d=9000-n.fighters[0].hp;yes ||=d===0;no ||=d>0;assert.equal(9000-n.fighters[1].hp,d);}assert.ok(yes&&no);
});
test('3870 1020目标强化条件与1145双方强化',()=>{
 for(const boosted of [false,true]){const q=make(e(1020));if(boosted)q.fighters[1].stages.acc=1;assert.equal(turn(q).fighters[0].stages.atk,boosted?1:2);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].stages.atk,0);}const q=make(e(1145));const n=turn(q);assert.ok(n.fighters.every(f=>Object.values(f.stages).every(v=>v===1)));timer(q,1,'禁强化');assert.equal(turn(q).fighters[1].stages.atk,0);
});
test('3870 1067低体回复改吸与717低体回复双倍、679禁疗',()=>{
 for(const id of [1067,717])for(const hp of [1000,4500]){const q=make(e(id),{hp}),n=turn(q);assert.equal(n.fighters[0].hp-hp,id===717&&hp<4500?6000:3000);assert.equal(9000-n.fighters[1].hp,id===1067&&hp>=4500?0:3000);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,hp);}
 const q=turn(make(e(679)));q.fighters[1].hp=1000;q.moveDefinitions[key(900041)].operations=[{effectId:579,index:0,phase:'afterHit',params:[2],sourceArgs:[2]}];assert.equal(turn(q,900031).fighters[1].hp,1000);q.round=3;assert.equal(turn(q,900031).fighters[1].hp,5500);
});
test('3870 843与619下回合先制、828有强化先制和1124消回合增伤',()=>{
 for(const id of [843,619]){const n=turn(make(e(id))),side=id===843?0:1;assert.equal(n.fighters[side].effects.id984.amount,id===843?2:-2);assert.equal(n.fighters[side].effects.id984.start,2);assert.equal(n.fighters[side].effects.id984.end,3);}
 const q=make(e(828),{aStats:{spe:1}});q.fighters[0].stages.acc=1;const n=turn(q,undefined,900040);assert.equal(n.turns[0].first,0);assert.ok(n.fighters[0].lastAttackDamage>0);
 const c=make(e(1124));assert.equal(turn(c).fighters[0].effects.id913,undefined);timer(c,1,'免弱');assert.equal(turn(c).fighters[0].effects.id913.bonus,1);timer(c,1,'protect');assert.equal(turn(c).fighters[0].effects.id913,undefined);
});
test('3870 475低于阈值必暴与高伤失败',()=>{
 const n=turn(make(e(475)));assert.equal(n.fighters[0].effects['必定暴击'].start,2);assert.equal(n.fighters[0].effects['必定暴击'].end,3);assert.equal(turn(make(e(475),{aStats:{spa:5000}})).fighters[0].effects['必定暴击'],undefined);
});

test('3870 全部技能基础伤害、MISS、控制封招与暴击倍率',()=>{
 for(const move of source.moves){const entry={moveId:move.id,index:null};const q=make(entry,{omit:true}),n=turn(q);if(move.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);const stopped=make(entry,{omit:true});stopped.fighters[0].ailments['疲惫']=2;assert.equal(turn(stopped).fighters[0].pp[key(move.id)],move.pp);timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(move.power>0){const c=make(entry,{omit:true});timer(c,0,'必定暴击');assert.ok(turn(c).fighters[0].lastAttackDamage>=n.fighters[0].lastAttackDamage*2);}if(!move.alwaysHit){const miss=make(entry,{omit:true,hit:false});miss.moveDefinitions[key(move.id)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);}}
});
test('3870 正式本地18招双魂印配招初始化执行与PP伤害',()=>{
 const local=require('../local-species.cjs').species(3870);assert.equal(local.source.storage,'local');
 for(const soulId of [1142,1449])for(const m of local.moves){const a=structuredClone(local);a.selectedSoulId=soulId;const ids=[m.id,...a.moves.filter(x=>!x.fifth&&x.id!==m.id).slice(0,m.fifth?4:3).map(x=>x.id),...(!m.fifth?[33328]:[])];const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(s.fighters[0].soulId,soulId);assert.equal(s.fighters[0].pp[key(m.id)],m.pp);const n=E.resolveTurn(s,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.kind!=='status')assert.ok(n.fighters[0].lastAttackDamage>0);s.fighters[0].pp[key(m.id)]=0;assert.throws(()=>E.resolveTurn(s,[key(m.id),key(m.id)]));}
});







{const test=require('node:test').test,assert=require('node:assert/strict');test('3870 717用招后理论吸取不因基础攻击击杀丢失',()=>{const o=require('./helpers/assert-717-1674-after-kill.cjs')(3870,717);assert.equal(o.fighters[1].hp,0);assert.ok(o.fighters[0].hp>5000);});}
