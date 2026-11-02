'use strict';
require('./deployed-3865-independent.test.cjs');
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,key,make,turn,timer,pick}=require('./helpers/3865-battle.cjs');
const e=id=>pick(id)[0];
test('3865 191异常反弹三回合、到期与双免疫',()=>{
 const q=make(e(191));q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);q.round=4;const expired=turn({...q,round:4},900031);assert.ok(expired.fighters[0].ailments['害怕']);timer(q,1,'免异常',{},1);const blocked=turn({...q,round:1});assert.equal(blocked.fighters[1].ailments['害怕'],undefined);
});
test('3865 695属性失效概率、攻击不受影响与到期',()=>{
 const active=turn(make(e(695))).fighters[0].effects['对手属性失效'];assert.equal(active.end,3);let blocked=0,ok=0;
 for(let seed=0;seed<80;seed++){const q=make(undefined,{seed});q.round=2;q.fighters[0].effects['对手属性失效']=structuredClone(active);q.moveDefinitions[key(900041)].operations=[{effectId:585,index:0,phase:'afterHit',params:[1],sourceArgs:[1]}];const n=turn(q,900031);if(n.fighters[1].stages.atk===0)blocked++;else{assert.equal(n.fighters[1].stages.atk,1);ok++;}assert.ok(turn(q,900031,900040).fighters[0].hp<9000);q.round=4;assert.equal(turn(q,900031).fighters[1].stages.atk,1);}assert.ok(blocked&&ok);
});
test('3865 魂印重复选择包含控制、换招重置和失效概率',()=>{
 let failed=0,used=0;
 for(let seed=0;seed<60;seed++){let s=turn(make(undefined,{soul:1137,hp:1000,seed}));s.rng=seed;const n=turn(s,900031);assert.equal(n.fighters[0].hp,1300);assert.equal(n.fighters[1].hp,s.fighters[1].hp-300);if(n.turns.at(-1).events.some(x=>x.text.includes('技能')&&x.text.includes('封锁')))failed++;else used++;}
 assert.ok(failed&&used);
 let s=turn(make(undefined,{soul:1137,hp:1000}));s.fighters[1].ailments['疲惫']=5;let n=turn(s,900031);assert.equal(n.fighters[0].hp,1300);assert.equal(n.fighters[1].pp[key(900041)],98);n=turn(n,900031,900042);assert.equal(n.fighters[0].hp,1300);n=turn(n,900031,900042);assert.equal(n.fighters[0].hp,1600);
});
test('3865 魂印固定吸取理论回复、抗性和回合初体力严格比较',()=>{
 let s=turn(make(undefined,{soul:1137,hp:1000}));s.fighters[1].build.resistance.fixed=100;const hp=s.fighters[1].hp;const n=turn(s,900031);assert.equal(n.fighters[0].hp,1300);assert.equal(n.fighters[1].hp,hp);
 for(const targetHp of [8999,9000]){const q=make(undefined,{soul:1137,targetHp,aStats:{spe:1}}),o=turn(q,900031);assert.equal(o.turns[0].first,targetHp<9000?0:1);assert.ok(Object.values(o.fighters[1].stages).every(v=>v===(targetHp<9000?-1:0)));}
});
test('3865 击败当前对手记录10个百分点暴击闪避收益',()=>{
 const q=make(undefined,{soul:1137,targetHp:1});const n=turn(q);assert.equal(n.fighters[1].hp,0);assert.equal(n.fighters[0].soulState.shivaDefeats,1);assert.equal(E.SOULS.trait(n.fighters[0],'dodgeChance'),.1);
 const c={a:n.fighters[0],chance:1/16};E.SOULS.run('beforeCrit',c);assert.equal(c.chance,1/16+.1);
});
test('3865 1354吸强成功理论300回复、无强化全弱与保护',()=>{
 const q=make(e(1354),{hp:1000});q.fighters[1].stages.atk=2;q.fighters[1].build.resistance.fixed=100;const n=turn(q);assert.equal(n.fighters[0].hp,1300);assert.equal(n.fighters[0].stages.atk,2);assert.equal(n.fighters[1].stages.atk,0);
 const no=turn(make(e(1354),{hp:1000}));assert.equal(no.fighters[0].hp,1000);assert.ok(Object.values(no.fighters[1].stages).every(v=>v===-1));timer(q,1,'幽蝶强化保护');assert.equal(turn(q).fighters[0].hp,1000);
});
test('3865 1297消回合成功害怕失败比例吸取、成功不吸及禁疗',()=>{
 for(const mode of ['empty','immune','protect']){const q=make(e(1297),{hp:1000});if(mode==='immune'){timer(q,1,'免弱');q.fighters[1].counts.immune=1;}if(mode==='protect')timer(q,1,'protect');const n=turn(q);assert.equal(n.fighters[0].hp,mode==='immune'?4000:1000);assert.equal(n.fighters[1].hp,mode==='immune'?6000:9000);}
 const q=make(e(1297),{hp:1000});timer(q,1,'免弱');const n=turn(q);assert.equal(n.fighters[0].hp,1000);assert.ok(n.fighters[1].ailments['害怕']);delete q.fighters[1].effects['免弱'];timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,1000);
});
test('3865 1415结算前低体吸血50、相等25及禁疗上限',()=>{
 for(const [hp,targetHp,fraction]of [[400,500,.5],[500,500,.25]]){const q=make(e(1415),{hp,targetHp,aStats:{atk:1000}}),n=turn(q);assert.ok(n.fighters[1].hp<hp);assert.equal(n.fighters[0].hp,hp+Math.floor(n.fighters[0].lastAttackDamage*fraction));timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[0].hp,hp);}
 const q=make(e(1415),{hp:8999});assert.equal(turn(q).fighters[0].hp,9000);
});
test('3865 正式本地17招配招初始化和第五两项加算实际伤害',()=>{
 const source=require('../local-species.cjs').species(3865);assert.equal(source.source.storage,'local');
 for(const move of source.moves){const a=structuredClone(source);a.souls=[];const ids=[move.id,...a.moves.filter(m=>!m.fifth&&m.id!==move.id).slice(0,move.fifth?4:3).map(m=>m.id),...(!move.fifth?[33304]:[])];const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,def:300,spa:180,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,def:300,spa:180,spd:300,spe:100}}]});assert.ok(s.fighters[0].moves.includes(key(move.id)));assert.equal(s.fighters[0].pp[key(move.id)],move.pp);const n=E.resolveTurn(s,[key(move.id),key(move.id)]);assert.equal(n.fighters[0].pp[key(move.id)],move.pp-1);}
 const q=make({moveId:33304,index:null}),plain=make({moveId:33304,index:null},{omit:true});const n=turn(q),b=turn(plain);assert.ok(n.fighters[0].lastAttackDamage>=2*b.fighters[0].lastAttackDamage&&n.fighters[0].lastAttackDamage<=2*b.fighters[0].lastAttackDamage+1);
});



test("3865 持续比例吸取在基础攻击击败后仍按理论量回复，免疫/溢出/禁疗分开",()=>{const o=require('./helpers/assert-597-nominal-after-kill.cjs')(3865);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,0);});
