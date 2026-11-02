'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make,turn,pick,timer}=require('./helpers/3879-battle.cjs');
const e=id=>pick(id)[0];
test('3879 5所有真实弱化实例、免弱和下限',()=>{
 for(const x of pick(5)){const q=make(x),k=keys[x.params[0]];assert.equal(turn(q).fighters[1].stages[k],x.params[2]);timer(q,1,'免弱');assert.equal(turn(q).fighters[1].stages[k],0);delete q.fighters[1].effects['免弱'];q.fighters[1].stages[k]=-6;assert.equal(turn(q).fighters[1].stages[k],-6);}
});
test('3879 37低体增威、29固伤和33清强保护',()=>{
 const q=make(e(37),{hp:4499});assert.ok(turn(q).fighters[0].lastAttackDamage>turn(make(e(37),{hp:4500})).fighters[0].lastAttackDamage*1.8);const p=make(e(29)),n=turn(p);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+30);p.fighters[1].build.resistance.fixed=100;const immune=turn(p);assert.equal(9000-immune.fighters[1].hp,immune.fighters[0].lastAttackDamage);const a=make(e(33));a.fighters[1].stages.atk=2;assert.equal(turn(a).fighters[1].stages.atk,0);timer(a,1,'幽蝶强化保护');assert.equal(turn(a).fighters[1].stages.atk,2);assert.equal(turn(make(e(33))).fighters[1].stages.atk,0);
});
test('3879 10所有麻痹概率实例、默认时长和免疫',()=>{
 for(const x of pick(10)){let yes=0,no=0;const duration=new Set();for(let seed=0;seed<90;seed++){const q=make(x,{seed}),n=turn(q);if(n.fighters[1].ailments['麻痹']){yes++;duration.add(n.fighters[1].ailments['麻痹']);}else no++;timer(q,1,'免异常');assert.equal(turn(q).fighters[1].ailments['麻痹'],undefined);}assert.ok(yes>0&&no>0);assert.deepEqual([...duration].sort(),[2,3]);}
});
test('3879 191两个实例反弹免疫及1137低体吸取边界',()=>{
 for(const x of pick(191)){const q=make(x);q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,0,2],sourceArgs:[100,0,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['麻痹'],undefined);assert.ok(n.fighters[1].ailments['麻痹']);q.fighters[1].effects['免异常']={start:1,end:99};assert.equal(turn(q).fighters[1].ailments['麻痹'],undefined);}
 for(const hp of [2999,3000]){const q=make(e(1137),{hp}),n=turn(q);assert.equal(n.fighters[0].hp,hp<3000?hp+3000:hp);assert.equal(n.fighters[1].hp,hp<3000?6000:9000);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,hp);}
});
test('3879 1001异常翻倍强化、597用招吸取和843先制期限',()=>{
 const q=make(e(1001));assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===1));q.fighters[1].ailments['烧伤']=3;assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===2));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===0));delete q.fighters[0].effects['禁强化'];q.fighters[0].stages.atk=6;assert.equal(turn(q).fighters[0].stages.atk,6);
 let p=make(e(597),{hp:1000});p.fighters[1].stats.maxHp=900;for(let r=1;r<=4;r++){p=turn(p,r===1?undefined:900031);assert.equal(p.fighters[0].hp,1000+300*r);}assert.equal(turn(p,900031).fighters[0].hp,2200);const blocked=make(e(597),{hp:1000});timer(blocked,0,'技能禁疗');assert.equal(turn(blocked).fighters[0].hp,1000);
 const n=turn(make(e(843)));assert.equal(n.fighters[0].effects.id984.start,2);assert.equal(n.fighters[0].effects.id984.end,3);assert.equal(n.fighters[0].effects.id984.amount,2);
});
test('3879 1070弱化先制与919仅后手封属',()=>{
 const q=make(e(1070),{aStats:{spe:1}});assert.equal(turn(q,undefined,900040).turns[0].first,1);q.fighters[1].stages.atk=-1;assert.equal(turn(q,undefined,900040).turns[0].first,0);
 assert.equal(turn(make(e(919))).fighters[1].effects.statusBlock,undefined);const n=turn(make(e(919),{aStats:{spe:1}}));assert.equal(n.fighters[1].effects.statusBlock.start,2);assert.equal(n.fighters[1].effects.statusBlock.end,2);assert.equal(turn(n,900031).fighters[1].pp[key(900041)],n.fighters[1].pp[key(900041)]-1);
});
test('3879 426闪避与1255流血失败粉伤、1040概率强化',()=>{
 const q=turn(make(e(426)));q.moveDefinitions[key(900040)].alwaysHit=false;assert.equal(turn(q,900031,900040).fighters[0].hp,9000);q.fighters[0].effects['概率闪避'].end=1;assert.ok(turn(q,900031,900040).fighters[0].hp<9000);
 const p=make(e(1255));assert.ok(turn(p).fighters[1].ailments['流血']);timer(p,1,'免异常');let n=turn(p);assert.equal(n.fighters[1].hp,6000);n=turn(n,900031);assert.equal(n.fighters[1].hp,3000);assert.equal(turn(n,900031).fighters[1].hp,3000);p.fighters[1].build.resistance.percent=100;assert.equal(turn(p).fighters[1].hp,9000);
 let yes=0,no=0;for(let seed=0;seed<40;seed++){const a=make(e(1040),{seed}),b=turn(a);if(b.fighters[1].ailments['麻痹'])yes++;else{no++;assert.ok(Object.values(b.fighters[0].stages).every(x=>x===1));}}assert.ok(yes&&no);const dead=make(e(1040),{targetHp:1});assert.ok(Object.values(turn(dead).fighters[0].stages).every(x=>x===0));
});
test('3879 双魂印命中伤害前反转、无强化分支与理论回复',()=>{
 for(const soul of [1148,1445]){const q=make(undefined,{soul,hp:1000});q.fighters[1].stages.spd=2;const n=turn(q,900030);assert.equal(n.fighters[1].stages.spd,-2);assert.equal(n.fighters[0].hp,1000);assert.equal(n.fighters[0].effects['魂印先制'],undefined);const neutral=make(undefined,{soul,hp:1000});assert.equal(turn(neutral,900030).fighters[0].hp,soul===1445?1250:1000);assert.equal(turn(neutral,900030).fighters[0].effects['魂印先制'],undefined);
 const miss=make(undefined,{soul,hp:1000,hit:false});miss.moveDefinitions[key(900030)].alwaysHit=false;miss.moveDefinitions[key(900030)].accuracy=0;miss.fighters[1].stages.spd=2;const missed=turn(miss,900030);assert.equal(missed.fighters[1].stages.spd,2);assert.equal(missed.fighters[0].hp,1000);
 const noSoul=make();noSoul.fighters[1].stages.spd=-2;assert.equal(n.fighters[0].lastAttackDamage,turn(noSoul,900030).fighters[0].lastAttackDamage);
 }
 const low=make(undefined,{soul:1445,hp:1000,targetHp:100});assert.equal(turn(low,900030).fighters[0].hp,1250);
});
test('3879 双魂印反转失败吸强与先制、属性招不触发',()=>{
 for(const soul of [1148,1445]){const q=make(undefined,{soul});q.fighters[1].stages.atk=2;timer(q,1,'免弱');let n=turn(q,900030);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[0].effects['魂印先制'].start,2);assert.equal(n.fighters[0].effects['魂印先制'].amount,3);const p=turn(q,900031);assert.equal(p.fighters[1].stages.atk,2);assert.equal(p.fighters[0].effects['魂印先制'],undefined);timer(q,0,'禁强化');n=turn(q,900030);assert.equal(n.fighters[1].stages.atk,2);assert.equal(n.fighters[0].stages.atk,0);assert.equal(n.fighters[0].effects['魂印先制'].amount,3);}
});
test('3879 双魂印回合初体力锁定、受击清回合麻痹及零伤',()=>{
 for(const soul of [1148,1445])for(const hp of [1000,9000]){const q=make(undefined,{soul,hp,targetHp:5000});timer(q,1,'免弱');const n=turn(q,900031,900040);assert.ok(n.fighters[0].hp<hp);if(hp>5000)assert.equal(n.fighters[1].effects['免弱'],undefined);else assert.ok(n.fighters[1].ailments['麻痹']);q.fighters[0].counts.attackNullify=1;const zero=turn(q,900031,900040);assert.ok(zero.fighters[1].effects['免弱']);assert.equal(zero.fighters[1].ailments['麻痹'],undefined);q.fighters[0].counts={};q.moveDefinitions[key(900040)].alwaysHit=false;q.moveDefinitions[key(900040)].accuracy=0;assert.equal(turn(q,900031,900040).fighters[1].ailments['麻痹'],undefined);}
 const equal=make(undefined,{soul:1148});timer(equal,1,'免弱');assert.ok(turn(equal,900031,900040).fighters[1].effects['免弱']);
});
test('3879 1472强化先后手伤害倍数与1350反弱封攻',()=>{
 for(const fast of [true,false]){const q=make(e(1472),{aStats:{spe:fast?500:1}});q.moveDefinitions[key(q.auditMoveId)].priority=0;q.fighters[0].stages.acc=1;const base=structuredClone(q);base.moveDefinitions[key(q.auditMoveId)].operations=[];const d=turn(base).fighters[0].lastAttackDamage;assert.ok(Math.abs(turn(q).fighters[0].lastAttackDamage-d*(fast?2:1.5))<=2);q.fighters[0].stages.acc=0;assert.equal(turn(q).fighters[0].lastAttackDamage,d);}
 const q=make(e(1350));q.fighters[0].stages.atk=-2;const n=turn(q);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].effects.attackBlock.start,2);assert.equal(turn(make(e(1350))).fighters[1].effects.attackBlock,undefined);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].stages.atk,-2);
});
test('3879 1473消盾随机正PP、空盾失败和不足两项',()=>{
 const q=make(e(1473));q.fighters[1].suitState.shield=300;q.fighters[1].pp[key(900040)]=0;let n=turn(q);assert.equal(n.fighters[1].suitState.shield,0);assert.equal(Object.values(n.fighters[1].pp).filter(x=>x===0).length,3);assert.equal(Object.values(turn(make(e(1473))).fighters[1].pp).filter(x=>x===0).length,0);
 for(const k of q.fighters[1].moves)q.fighters[1].pp[k]=0;q.fighters[1].pp[key(900041)]=2;n=turn(q);assert.ok(Object.values(n.fighters[1].pp).every(x=>x===0));
});
test('3879 1390麻痹失败闪避、1201先手失败先制及枚举',()=>{
 for(const id of [1390,1201]){const q=make(e(id));assert.ok(turn(q).fighters[1].ailments['麻痹']);timer(q,1,'免异常');const n=turn(q),k=id===1390?'概率闪避':'id984';assert.ok(n.fighters[0].effects[k]);if(id===1390){assert.ok(turn(n,900031,900040).fighters[0].hp<n.fighters[0].hp);n.moveDefinitions[key(900040)].alwaysHit=false;assert.equal(turn(n,900031,900040).fighters[0].hp,n.fighters[0].hp);}else{assert.equal(n.fighters[0].effects[k].start,2);q.fighters[0].stats.spe=1;assert.equal(turn(q).fighters[0].effects[k],undefined);}}
 for(const [id,accepted,rejected]of [[1390,[0,15],[1,6,14,16]],[1201,[0,6,15],[1,5,7,14,16]]]){const args=e(id).params;for(const v of accepted){const a=args.slice();a[1]=v;assert.doesNotThrow(()=>E.WIKI.effectsEngine.registry[id].validate(a));}for(const v of rejected){const a=args.slice();a[1]=v;assert.throws(()=>E.WIKI.effectsEngine.registry[id].validate(a));}}
});
test('3879 571延迟两回合单次固伤不叠加及免疫',()=>{
 const q=make(e(571));let n=turn(q);const hp=n.fighters[1].hp;n=turn(n,900031);assert.equal(n.fighters[1].hp,hp);n=turn(n,900031);assert.equal(n.fighters[1].hp,hp-300);assert.equal(turn(n,900031).fighters[1].hp,hp-300);
 let p=turn(make(e(571)));p=turn(p);const before=p.fighters[1].hp;assert.equal(turn(p,900031).fighters[1].hp,before-300);const immune=turn(make(e(571)));immune.fighters[1].build.resistance.fixed=100;assert.equal(turn(turn(immune,900031),900031).fighters[1].hp,immune.fighters[1].hp);
});
test('3879 1474按消除种类反击、吸强与保护和期限',()=>{
 const q=turn(make(e(1474)));q.fighters[0].stages.atk=3;q.fighters[0].stages.def=1;q.moveDefinitions[key(900041)].operations=[{effectId:33,index:0,phase:'afterHit',params:[],sourceArgs:[]}];let n=turn(q,900031);assert.equal(n.fighters[1].hp,q.fighters[1].hp-120);assert.equal(n.fighters[0].stages.atk,0);timer(q,0,'幽蝶强化保护');assert.equal(turn(q,900031).fighters[1].hp,q.fighters[1].hp);delete q.fighters[0].effects['幽蝶强化保护'];q.fighters[0].effects['消强按项反击'].end=1;assert.equal(turn(q,900031).fighters[1].hp,q.fighters[1].hp);
});
test('3879 1814用招麻痹失败吸取和2356消盾真伤持续期限',()=>{
 const q=make(e(1814),{hp:1000});timer(q,1,'免异常');let n=turn(q);assert.equal(n.fighters[0].hp,4000);assert.equal(n.fighters[1].hp,6000);n=turn(n,900031);assert.equal(n.fighters[0].hp,7000);assert.equal(turn(n,900031).fighters[0].hp,7000);assert.ok(turn(make(e(1814))).fighters[1].ailments['麻痹']);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);
 const p=make(e(2356));p.fighters[1].suitState.shield=400;let z=turn(p);assert.equal(z.fighters[1].suitState.shield,0);assert.equal(z.fighters[1].hp,8700);z.fighters[1].suitState.shield=200;z=turn(z,900031);assert.equal(z.fighters[1].hp,8550);z.fighters[1].suitState.shield=200;assert.equal(turn(z,900031).fighters[1].suitState.shield,200);assert.equal(turn(make(e(2356))).fighters[1].hp,9000);
});
test('3879 1224清回合成功下回合必暴和102麻痹增威',()=>{
 const q=make(e(1224));timer(q,1,'免弱');const n=turn(q);assert.equal(n.fighters[1].effects['免弱'],undefined);assert.equal(n.fighters[0].effects['必定暴击'].start,2);assert.equal(n.fighters[0].effects['必定暴击'].end,3);assert.equal(turn(make(e(1224))).fighters[0].effects['必定暴击'],undefined);timer(q,1,'protect');assert.equal(turn(q).fighters[0].effects['必定暴击'],undefined);
 const p=make(e(102));p.fighters[1].ailments['麻痹']=3;const d=turn(p).fighters[0].lastAttackDamage;assert.ok(d>turn(make(e(102))).fighters[0].lastAttackDamage*1.8);p.fighters[1].ailments['麻痹']=0;assert.equal(turn(p).fighters[0].lastAttackDamage,turn(make(e(102))).fighters[0].lastAttackDamage);
});

test('3879 全部技能基础伤害、MISS、控制封招与暴击倍率',()=>{
 for(const move of source.moves){const entry={moveId:move.id,index:null};const q=make(entry,{omit:true}),n=turn(q);if(move.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);const stopped=make(entry,{omit:true});stopped.fighters[0].ailments['疲惫']=2;assert.equal(turn(stopped).fighters[0].pp[key(move.id)],move.pp);timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(move.power>0){const c=make(entry,{omit:true});timer(c,0,'必定暴击');assert.ok(turn(c).fighters[0].lastAttackDamage>=n.fighters[0].lastAttackDamage*2);}if(!move.alwaysHit){const miss=make(entry,{omit:true,hit:false});miss.moveDefinitions[key(move.id)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);}}
});
test('3879 正式本地18招双魂印配招初始化执行与PP伤害',()=>{
 const local=require('../local-species.cjs').species(3879);assert.equal(local.source.storage,'local');
 for(const soulId of [1148,1445])for(const m of local.moves){const a=structuredClone(local);a.selectedSoulId=soulId;const ids=[m.id,...a.moves.filter(x=>!x.fifth&&x.id!==m.id).slice(0,m.fifth?4:3).map(x=>x.id),...(!m.fifth?[33367]:[])];const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(s.fighters[0].soulId,soulId);assert.equal(s.fighters[0].pp[key(m.id)],m.pp);const n=E.resolveTurn(s,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.kind!=='status')assert.ok(n.fighters[0].lastAttackDamage>0);s.fighters[0].pp[key(m.id)]=0;assert.throws(()=>E.resolveTurn(s,[key(m.id),key(m.id)]));}
});







test("3879 持续比例吸取在基础攻击击败后仍按理论量回复，免疫/溢出/禁疗分开",()=>{const o=require('./helpers/assert-597-nominal-after-kill.cjs')(3879);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,0);});
