'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/3623-battle.cjs');const {E,source,key,IDLE,WAIT,HIT,make,turn,wait,timer,allStages}=H;
const e={moveId:10535,index:null};
function rngs(seed,n){const values=[];for(let i=0;i<n;i++){seed=(seed+0x6D2B79F5)>>>0;let z=seed;z=Math.imul(z^z>>>15,z|1);z^=z+Math.imul(z^z>>>7,z|61);values.push(((z^z>>>14)>>>0)/4294967296);}return values;}
test('3623 原魂印917回合开始两项强化、特攻追加、六级与禁强化',()=>{
 let extra=0,ordinary=0;for(let seed=0;seed<32;seed++){const s=make(e,{soul:917,omit:true,seed}),o=turn(s),pool=H.keys.slice(),chosen=[];for(const roll of rngs(seed,2))chosen.push(pool.splice(Math.floor(roll*pool.length),1)[0]);const expected=Object.fromEntries(H.keys.map(k=>[k,(chosen.includes(k)?1:0)+(chosen.includes('spa')&&['atk','spe'].includes(k)?2:0)]));assert.deepEqual(o.fighters[0].stages,expected);if(chosen.includes('spa'))extra++;else ordinary++;
 const control=make(e,{soul:917,omit:true,seed});control.fighters[0].ailments['疲惫']=1;assert.deepEqual(turn(control).fighters[0].stages,expected);assert.equal(turn(control).fighters[0].pp[key(10535)],40);
 }assert.ok(extra>0&&ordinary>0);const cap=make(e,{soul:917,omit:true});allStages(cap,0,6);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));allStages(cap,0,0);timer(cap,0,'禁强化');assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(0));
});
test('3623 原魂印917选属下回合先制连续选属不吞掉当前收益',()=>{
 let s=make(e,{soul:917,omit:true,aStats:{spe:1}});s=turn(s,IDLE);assert.equal(s.turns[0].first,1);s=turn(s,IDLE);assert.equal(s.turns.at(-1).first,0);s=turn(s,10535);assert.equal(s.turns.at(-1).first,0);s=turn(s,10535);assert.equal(s.turns.at(-1).first,1);
 const item=make(e,{soul:917,omit:true,aStats:{spe:1}}),o=E.resolveTurn(item,['potion:hp',key(WAIT)]);assert.deepEqual(Object.values(o.fighters[0].stages),Array(6).fill(0));assert.equal(turn(o,10535).turns.at(-1).first,1);
});
test('3623 两魂印50与80闪避阈值、等体边界、必中及真实减伤',()=>{
 for(const soul of [917,1863])for(const ownHp of [4000,5000,6000]){let hit=0,miss=0;for(let seed=0;seed<50;seed++){const s=make(e,{soul,omit:true,seed,hp:ownHp,targetHp:5000}),o=E.resolveTurn(s,['potion:pp',key(HIT)]),dodged=rngs(seed,2)[1]<(ownHp<5000?.8:.5);assert.equal(o.fighters[0].hp===ownHp,dodged);if(dodged)miss++;else hit++;assert.equal(o.fighters[0].soulState.blakeBuffRound,undefined);}
 assert.ok(hit>0&&miss>0);const s=make(e,{soul,omit:true,hp:ownHp,targetHp:5000});s.moveDefinitions[key(HIT)].alwaysHit=true;const o=E.resolveTurn(s,['potion:pp',key(HIT)]),row=o.turns[0].events.find(x=>x.kind==='damage');assert.ok(o.fighters[0].hp<ownHp);assert.ok(row.detail.includes('增减伤 '+(soul===1863&&ownHp>5000?.4:.5)));assert.deepEqual(Object.values(o.fighters[0].stages),Array(6).fill(0));}
});
test('3623 觉醒魂印1863用招三项强化与攻击额外、控制和禁强化',()=>{
 for(let seed=0;seed<24;seed++){const s=make(e,{soul:1863,omit:true,seed}),pool=H.keys.slice(),chosen=[];for(const roll of rngs(seed,3))chosen.push(pool.splice(Math.floor(roll*pool.length),1)[0]);const expected=Object.fromEntries(H.keys.map(k=>[k,(chosen.includes(k)?1:0)+(['atk','spe'].includes(k)?1:0)]));const o=turn(s);assert.deepEqual(o.fighters[0].stages,expected);const control=structuredClone(s);control.fighters[0].ailments['疲惫']=1;assert.deepEqual(Object.values(turn(control).fighters[0].stages),Array(6).fill(0));assert.equal(turn(control).fighters[0].pp[key(10535)],40);}
 const cap=make(e,{soul:1863,omit:true});allStages(cap,0,6);assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(6));allStages(cap,0,0);timer(cap,0,'禁强化');assert.deepEqual(Object.values(turn(cap).fighters[0].stages),Array(6).fill(0));
});
test('3623 觉醒魂印1863失效次回合双类型收益、失误封招、过期与重复失效',()=>{
 for(const choice of [10535,IDLE]){let s=make(e,{soul:1863,omit:true});timer(s,0,'skillBlock',{},1);s=turn(s,choice);assert.equal(s.fighters[0].soulState.butterflyUnconditionalRound,2);allStages(s,0,0);const next=turn(s,choice),sum=Object.values(next.fighters[0].stages).reduce((a,b)=>a+b,0);assert.equal(sum,5);assert.equal(next.fighters[1].effects.id984.amount,-2);assert.equal(next.fighters[1].effects.id984.start,3);allStages(next,0,0);const third=turn(next,choice);assert.equal(Object.values(third.fighters[0].stages).reduce((a,b)=>a+b,0),choice===IDLE?3:5);if(choice===10535)assert.equal(third.fighters[1].effects.id984,undefined);}
 const miss=make(e,{soul:1863,omit:true,hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[0].soulState.butterflyUnconditionalRound,2);let repeated=make(e,{soul:1863,omit:true});timer(repeated,0,'skillBlock');repeated=turn(repeated);repeated=turn(repeated);assert.equal(repeated.fighters[0].soulState.butterflyUnconditionalRound,3);
 const expire=make(e,{soul:1863,omit:true});timer(expire,0,'skillBlock',{},1);let s=turn(expire);s=E.resolveTurn(s,['potion:pp',key(WAIT)]);allStages(s,0,0);const o=turn(s,IDLE);assert.equal(Object.values(o.fighters[0].stages).reduce((a,b)=>a+b,0),3);
});
test('3623 两版真实技能组、魂印来源、种族值及跨版拒绝',()=>{
 assert.deepEqual(E.WIKI.skillVersionIssues(source),[]);assert.deepEqual(source.moves.filter(m=>m.fifth).map(m=>m.id),[32102,37464]);assert.equal(source.moves.length,21);
 for(const soul of [917,1863]){const s={...structuredClone(source),selectedSoulId:soul},available=E.WIKI.availableMoves(s);assert.equal(available.length,soul===917?17:20);const ids=E.WIKI.defaultMoves(s);assert.ok(ids.includes(soul===917?32102:37464));const battle=E.createBattle({wikiSnapshots:[s,s]});assert.equal(battle.fighters[0].soulId,soul);assert.equal(battle.fighters[0].gender,2);for(const id of available.map(m=>m.id))assert.ok(s.moves.some(m=>m.id===id));const invalid=ids.map(id=>s.moves.find(m=>m.id===id).fifth?(soul===917?37464:32102):id);assert.equal(E.WIKI.assess(s,invalid).supported,false);assert.deepEqual(s.souls.find(x=>x.id===1863).base,{maxHp:167,atk:144,def:111,spa:70,spd:111,spe:137});}
 const opponent=require('../data/species/3592.json').snapshot,b=E.createBattle({wikiSnapshots:[source,opponent]});assert.equal(b.fighters[1].gender,source.targetGenderSources[3592].genderId);assert.equal(source.targetGenderSources[3592].revision,opponent.source.revision);
});
