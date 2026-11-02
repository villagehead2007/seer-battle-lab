'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,timer,pick}=require('./helpers/3550-battle.cjs');
const e=id=>pick(id)[0],m=id=>({moveId:id,index:null});
test('3550 基础17招伤害PP、零PP拒绝、封招和控制逐招',()=>{
 for(const move of source.moves){const s=make(m(move.id),{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(move.id)],move.pp-1);if(move.kind==='status')assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*move.power*180/300)/50)+2,stab=require('./helpers/source-stab.cjs')(move.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(move.type,s.fighters[1].type,s.typeChart)*.89));}
 const no=make(m(move.id),{omit:true});no.fighters[0].pp[key(move.id)]=0;assert.throws(()=>turn(no));const b=make(m(move.id),{omit:true});timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);b.fighters[0].ailments['疲惫']=2;assert.equal(turn(b).fighters[0].pp[key(move.id)],move.pp);}
});
test('3550 基础17招先制、MISS、必中与暴击实际伤害',()=>{
 for(const move of source.moves){const s=make(m(move.id),{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(s).turns[0].first,move.priority>0?0:1);
 const q=make(m(move.id),{omit:true}),plain=turn(q);timer(q,0,'必定暴击');const crit=turn(q);if(move.kind!=='status'){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=2*n&&crit.fighters[0].lastAttackDamage<=2*n+1);}
 if(!move.alwaysHit){let missed=false;for(let seed=0;seed<40&&!missed;seed++){const q=make(m(move.id),{omit:true,hit:false,seed});q.fighters[0].stages.acc=-6;const n=turn(q);if(n.turns[0].events.some(x=>x.text.includes('未命中'))){missed=true;assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(move.id)],move.pp-1);}}assert.ok(missed,String(move.id));}}
});
test('3550 魂印849免粉免异常、抗性100及自身满血首回合先制',()=>{
 const s=make(undefined,{soul:849,aStats:{spe:1}});assert.equal(s.fighters[0].build.resistance.fixed,100);assert.equal(s.fighters[0].build.resistance.percent,100);assert.equal(turn(s).turns[0].first,0);s.round=2;assert.equal(turn(s).turns[0].first,1);
 for(const [id,args]of [[683,[100,100]],[603,[100,6,2]],[971,[1,3,2]]]){const q=make(undefined,{soul:849});q.moveDefinitions[key(900041)].operations=[{effectId:id,index:0,phase:'afterHit',params:args,sourceArgs:args}];const n=turn(q,900031);assert.equal(n.fighters[0].hp,9000);assert.deepEqual(n.fighters[0].ailments,{});}
 const hit=make(undefined,{soul:849});assert.ok(turn(hit,900031,900040).fighters[0].hp<9000);
 const weak=make(undefined,{soul:849});weak.moveDefinitions[key(900041)].operations=[{effectId:749,index:0,phase:'afterHit',params:[100,1],sourceArgs:[100,1]}];assert.equal(turn(weak,900031).fighters[0].stages.atk,-1);
});
test('3550 4与5逐实例能力变化、概率失败、六级边界及免疫',()=>{
 for(const id of [4,5])for(const x of pick(id)){let success=false,failure=false;for(let seed=0;seed<30;seed++){const q=make(x,{seed}),n=turn(q).fighters[id===4?0:1].stages[keys[x.params[0]]];if(n===x.params[2])success=true;else failure=true;}assert.ok(success);if(x.params[1]<100)assert.ok(failure);const q=make(x),side=id===4?0:1;q.fighters[side].stages[keys[x.params[0]]]=x.params[2]>0?6:-6;assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],x.params[2]>0?6:-6);q.fighters[side].stages[keys[x.params[0]]]=0;timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[keys[x.params[0]]],0);}
});
test('3550 29固伤20和30后手双倍，抗性与先手失败',()=>{
 const q=make(e(29)),n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,20);q.fighters[1].build.resistance.fixed=100;const no=turn(q);assert.equal(9000-no.fighters[1].hp,no.fighters[0].lastAttackDamage);
 const fast=turn(make(e(30))),slow=turn(make(e(30),{aStats:{spe:1}}));assert.ok(slow.fighters[0].lastAttackDamage>fast.fighters[0].lastAttackDamage*1.8);
});
test('3550 1297消回合成功且害怕失败才吸取，消除成功害怕、免断和免异常',()=>{
 const yes=make(e(1297),{hp:1000});timer(yes,1,'免弱');const y=turn(yes);assert.ok(y.fighters[1].ailments['害怕']);assert.equal(y.fighters[0].hp,1000);assert.equal(y.fighters[1].effects['免弱'],undefined);
 for(const mode of ['empty','immune','protect']){const s=make(e(1297),{hp:1000});if(mode==='immune'){timer(s,1,'免弱');s.fighters[1].counts.immune=1;}if(mode==='protect')timer(s,1,'protect');const n=turn(s);assert.equal(n.fighters[0].hp,mode==='immune'?4000:1000);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage+(mode==='immune'?3000:0));if(mode==='protect')assert.ok(n.fighters[1].effects.protect);}
 const blocked=make(e(1297),{hp:1000});timer(blocked,0,'技能禁疗');assert.equal(turn(blocked).fighters[0].hp,1000);
});
test('3550 1298消强单精灵分支及保护、空状态失败',()=>{
 const s=make(e(1298));s.fighters[1].stages.atk=3;assert.equal(turn(s).fighters[1].stages.atk,0);timer(s,1,'幽蝶强化保护');assert.equal(turn(s).fighters[1].stages.atk,3);assert.equal(turn(make(e(1298))).fighters[1].stages.atk,0);
});
test('3550 749全弱与585全强逐项及免疫六级上限',()=>{
 for(const id of [749,585]){const side=id===749?1:0,n=id===749?-1:1,q=make(e(id));assert.ok(Object.values(turn(q).fighters[side].stages).every(x=>x===n));timer(q,side,id===749?'免弱':'禁强化');assert.ok(Object.values(turn(q).fighters[side].stages).every(x=>x===0));for(const k of keys)q.fighters[side].stages[k]=6*n;assert.ok(Object.values(turn(q).fighters[side].stages).every(x=>x===6*n));}
});
test('3550 1315最终50暴击与505仅暴击实际伤害回复、禁疗和满血',()=>{
 let yes=false,no=false;for(let seed=0;seed<40;seed++){const q=make(m(31579),{hp:1000,criticals:true,seed}),n=turn(q),critical=n.turns[0].events.some(x=>x.detail?.includes('暴击 2'));if(critical){yes=true;assert.equal(n.fighters[0].hp,1000+Math.floor(n.fighters[0].lastAttackDamage*.5));}else{no=true;assert.equal(n.fighters[0].hp,1000);}}assert.ok(yes&&no);
 const q=make(e(505),{hp:8999});timer(q,0,'必定暴击');assert.equal(turn(q).fighters[0].hp,9000);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,8999);
});
test('3550 821免断先后三四回合、到期后可清除',()=>{
 for(const slow of [false,true]){const q=make(e(821),{aStats:{spe:slow?1:500}}),n=turn(q);assert.equal(n.fighters[0].effects.protect.end,slow?4:3);n.moveDefinitions[key(900041)].operations=[{effectId:733,index:0,phase:'afterHit',params:[100,0],sourceArgs:[100,0]}];assert.ok(turn(n,900031).fighters[0].effects.protect);n.round=5;assert.equal(turn(n,900031).fighters[0].effects.protect,undefined);}
});
test('3550 1316先手随机三项不重复、后手无强化，1317后手回复上限禁疗',()=>{
 const q=make(e(1316)),n=turn(q);assert.equal(Object.values(n.fighters[0].stages).filter(x=>x===1).length,3);assert.ok(Object.values(turn(make(e(1316),{aStats:{spe:1}})).fighters[0].stages).every(x=>x===0));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(x=>x===0));
 const h=make(e(1317),{hp:1000,aStats:{spe:1}});assert.equal(turn(h).fighters[0].hp,3250);timer(h,0,'技能禁疗');assert.equal(turn(h).fighters[0].hp,1000);assert.equal(turn(make(e(1317),{hp:8999,aStats:{spe:1}})).fighters[0].hp,9000);assert.equal(turn(make(e(1317),{hp:1000})).fighters[0].hp,1000);
});
test('3550 1302概率翻倍或吸强、强化保护及禁强失败',()=>{
 let doubled=false,stolen=false;for(let seed=0;seed<30;seed++){const q=make(e(1302),{seed});q.fighters[1].stages.atk=3;const n=turn(q);if(n.fighters[1].stages.atk===3){doubled=true;assert.equal(n.fighters[0].stages.atk,2);}else{stolen=true;assert.equal(n.fighters[0].stages.atk,4);assert.equal(n.fighters[1].stages.atk,0);}timer(q,1,'幽蝶强化保护');assert.equal(turn(q).fighters[1].stages.atk,3);timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].stages.atk,0);}assert.ok(doubled&&stolen);
});
test('3550 1303持续吸取半血边界及禁疗、843先制时长、1304真实忽略双防',()=>{
 for(const hp of [4499,4500,9000]){const q=make(e(1303),{hp}),n=turn(q);assert.equal(n.fighters[1].hp,hp<4500?3000:6000);assert.equal(n.fighters[0].effects['用招低体双吸'].end,4);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,hp);}
 const priority=turn(make(e(843)));assert.equal(priority.fighters[0].effects.id984.start,2);assert.equal(priority.fighters[0].effects.id984.end,3);
 const q=make(e(1304)),n=turn(q);assert.equal(n.fighters[0].effects['咤克斯忽略双防'].start,2);for(const kind of ['physical','special']){n.moveDefinitions[key(900030)].kind=kind;const a=turn(n,900030),plain=structuredClone(n);delete plain.fighters[0].effects['咤克斯忽略双防'];assert.ok(a.fighters[0].lastAttackDamage>turn(plain,900030).fighters[0].lastAttackDamage);n.round=4;assert.equal(turn(n,900030).fighters[0].lastAttackDamage,turn(plain,900030).fighters[0].lastAttackDamage);n.round=2;}
});
test('3550 1208实际反转后下一攻击失效，保护失败与消费',()=>{
 const q=make(e(1208));q.fighters[0].stages.atk=-2;const n=turn(q);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].counts.nextAttackInvalid,1);const out=turn(n,900031,900040);assert.equal(out.fighters[0].hp,n.fighters[0].hp);assert.equal(out.fighters[1].counts.nextAttackInvalid,0);timer(q,0,'弱化不可解除反转');const no=turn(q);assert.equal(no.fighters[0].stages.atk,-2);assert.equal(no.fighters[1].counts.nextAttackInvalid??0,0);
});
test('3550 1300减伤后严格280门槛、随机两异常失败清回合与免断',()=>{
 const base=turn(make(e(1300)));assert.equal(base.fighters[0].effects['减伤高伤随机异常'].end,3);
 const low=turn(base,900031,900040),plain=structuredClone(base);delete plain.fighters[0].effects['减伤高伤随机异常'];assert.ok(low.fighters[1].lastAttackDamage<turn(plain,900031,900040).fighters[1].lastAttackDamage);
 const high=structuredClone(base);high.moveDefinitions[key(900040)].power=3000;timer(high,1,'免弱');const y=turn(high,900031,900040);assert.ok(y.fighters[1].lastAttackDamage>280);assert.equal(y.randomStatusEvents.at(-1).sourceKey,'effect:1300');assert.equal(Object.keys(y.fighters[1].ailments).length,2);assert.ok(y.fighters[1].effects['免弱']);
 high.fighters[1].counts.immune=1;const failed=turn(high,900031,900040);assert.equal(Object.keys(failed.fighters[1].ailments).length,1);assert.equal(failed.fighters[1].effects['免弱'],undefined);timer(high,1,'protect');assert.ok(turn(high,900031,900040).fighters[1].effects.protect);
 timer(base,1,'免弱');assert.ok(turn(base,900031,900040).fighters[1].effects['免弱']);
 let boundary;for(let power=500;power<1300;power++){const q=structuredClone(base);q.moveDefinitions[key(900040)].power=power;const n=turn(q,900031,900040);if(n.fighters[1].lastAttackDamage===280){boundary=n;break;}}assert.ok(boundary);assert.equal(boundary.randomStatusEvents,undefined);
});

test('3550 1305当前自身存活一只的真实回复、满HP上限/禁疗/控制未用，额外队友计数独立延期',()=>{const e=pick(1305)[0],s=make(e,{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,1000+e.params[0]);const full=make(e,{hp:8999});assert.equal(turn(full).fighters[0].hp,9000);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);s.fighters[0].ailments['疲惫']=3;assert.equal(turn(s).fighters[0].pp[key(e.moveId)],source.moves.find(m=>m.id===e.moveId).pp);});
