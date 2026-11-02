'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),{E,source,key,keys,make,turn,timer,pick}=require('./helpers/3867-battle.cjs');
const e=id=>pick(id)[0];
test('3867 1708既有3549真实技能降低后续先制而非能力',()=>{
 const a=structuredClone(require('../data/species/3549.json').snapshot);a.souls=[];a.moves=a.moves.filter(m=>!E.WIKI.moveIssue(m,a));const m=a.moves.find(m=>m.id===29392);m.effectInstances=m.effectInstances.filter(e=>e.id===1708);m.effectIds=[1708];const ids=E.WIKI.defaultMoves(a);if(!ids.includes(m.id))ids[ids.findIndex(id=>!a.moves.find(x=>x.id===id).fifth)]=m.id;const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,spe:900}},{overrides:{maxHp:9000,def:300,spd:300,spe:1}}]});s.fighters[0].effects['攻击必中']={start:1,end:99};const n=E.resolveTurn(s,[key(m.id),key(m.id)]);assert.equal(n.fighters[1].effects.id984.amount,-m.effectInstances[0].args[1]);assert.ok(Object.values(n.fighters[1].stages).every(v=>v===0));assert.equal(n.fighters[0].effects.id984.amount,-2);
});
test('3867 1423消回合概率害怕与失败回复及1131随机固伤区间',()=>{
 let yes=false,no=false;for(let seed=0;seed<60;seed++){const q=make(e(1423),{seed,hp:1000});timer(q,1,'免弱');const n=turn(q);if(n.fighters[1].ailments['害怕']){yes=true;assert.equal(n.fighters[0].hp,1000);}else{no=true;assert.equal(n.fighters[0].hp,5500);}}assert.ok(yes&&no);
 for(const boosted of [false,true]){const vals=new Set();for(let seed=0;seed<50;seed++){const q=make(e(1131),{seed});if(boosted)q.fighters[0].stages.acc=1;const n=turn(q),v=9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage;assert.ok(v>=(boosted?200:150)&&v<=(boosted?350:300));vals.add(v);}assert.ok(vals.size>10);}
});
test('3867 40先手威力与33清强免护、125攻击伤害上限',()=>{
 assert.ok(turn(make(e(40))).fighters[0].lastAttackDamage>turn(make(e(40),{aStats:{spe:1}})).fighters[0].lastAttackDamage*1.8);
 const q=make(e(33));q.fighters[1].stages.atk=3;assert.equal(turn(q).fighters[1].stages.atk,0);timer(q,1,'幽蝶强化保护');assert.equal(turn(q).fighters[1].stages.atk,3);
 const n=turn(make(e(125),{bStats:{spa:9000}}));const hp=n.fighters[0].hp;assert.equal(hp-turn(n,900031,900040).fighters[0].hp,250);n.round=3;assert.ok(hp-turn(n,900031,900040).fighters[0].hp>250);
});
test('3867 740回合末反馈清除与1359反馈成功强化、免弱失败清自身',()=>{
 for(const id of [740,1359]){const q=make(e(id));q.fighters[0].stages.atk=-2;const n=turn(q);assert.equal(n.fighters[1].stages.atk,-2);assert.equal(n.fighters[0].stages.atk,id===1359?1:0);timer(q,1,'免弱');const no=turn(q);assert.equal(no.fighters[1].stages.atk,0);assert.equal(no.fighters[0].stages.atk,0);}
});
test('3867 776翻倍期限与1265攻击减伤一次、1121固粉减伤一次',()=>{
 const active=turn(make(e(776))).fighters[0].effects.doubleDamage;const q=make();q.round=2;q.fighters[0].effects.doubleDamage=active;assert.ok(turn(q).fighters[0].lastAttackDamage>=turn(make()).fighters[0].lastAttackDamage*2);q.round=4;assert.equal(turn(q).fighters[0].lastAttackDamage,turn(make()).fighters[0].lastAttackDamage);
 const s=turn(make(e(1265)));const first=turn(s,900031,900040),second=turn(first,900031,900040);assert.ok(s.fighters[0].hp-first.fighters[0].hp<(first.fighters[0].hp-second.fighters[0].hp));
 const p=turn(make(e(1121)));p.moveDefinitions[key(900041)].operations=[{effectId:683,index:0,phase:'afterHit',params:[100,100],sourceArgs:[100,100]}];const n=turn(p,900031);assert.equal(p.fighters[0].hp-n.fighters[0].hp,50);assert.equal(n.fighters[0].hp-turn(n,900031).fighters[0].hp,100);
});
test('3867 451烧冻毒动态默认时长与免异常',()=>{
 const names=new Set();for(let seed=0;seed<60;seed++){const q=make(e(451),{seed}),n=turn(q);const entries=Object.entries(n.fighters[1].ailments);assert.equal(entries.length,1);names.add(entries[0][0]);assert.ok([2,3].includes(entries[0][1]));timer(q,1,'免异常');assert.deepEqual(turn(q).fighters[1].ailments,{});}assert.deepEqual([...names].sort(),['中毒','冻伤','烧伤'].sort());
});
test('3867 885体力比较强化与927低体实际回复等量粉伤',()=>{
 for(const hp of [8999,9000]){const q=make(e(885),{targetHp:8999,hp});assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===(hp===9000?2:1)));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===0));}
 for(const hp of [4499,4500,8000]){const q=make(e(927),{hp}),n=turn(q),gain=n.fighters[0].hp-hp;assert.equal(gain,Math.min(4500,9000-hp));assert.equal(9000-n.fighters[1].hp,hp<4500?gain:0);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[1].hp,9000);}
});
test('3867 1129强化概率翻倍与1449实际可回复转伤',()=>{
 const values=new Set();for(let seed=0;seed<50;seed++){const q=make(e(1129),{seed}),n=turn(q);values.add(n.fighters[0].lastAttackDamage);q.fighters[0].stages.acc=1;const strong=turn(q);const base=turn(make(e(1129),{seed,omit:true})).fighters[0].lastAttackDamage;assert.ok(strong.fighters[0].lastAttackDamage>=base*1.7&&strong.fighters[0].lastAttackDamage<=base*2.4);}assert.ok(values.size>1);
 const q=turn(make(e(1449)));q.fighters[1].hp=8000;q.moveDefinitions[key(900041)].operations=[{effectId:579,index:0,phase:'afterHit',params:[2],sourceArgs:[2]}];const n=turn(q,900031);assert.equal(n.fighters[1].hp,8000-Math.floor(1000/3));timer(q,1,'技能禁疗');assert.equal(turn(q,900031).fighters[1].hp,8000);
});
test('3867 741三回合免大伤与742低伤害怕、免异常',()=>{
 const q=turn(make(e(741),{bStats:{spa:9000}}));assert.equal(turn(q,900031,900040).fighters[0].hp,9000);q.round=4;assert.ok(turn(q,900031,900040).fighters[0].hp<9000);
 const p=turn(make(e(742)));assert.ok(turn(p,900031,900040).fighters[1].ailments['害怕']);timer(p,1,'免异常');assert.equal(turn(p,900031,900040).fighters[1].ailments['害怕'],undefined);
});
test('3867 魂印吸强后实际回复等量固伤与双版本先制',()=>{
 for(const soul of [1139,1447]){const q=make(undefined,{soul,hp:1000});q.fighters[1].stages.spa=2;const n=turn(q,900031,900040),d=9000-n.fighters[1].hp;assert.equal(n.fighters[0].stages.spa,2);assert.equal(n.fighters[1].stages.spa,0);assert.equal(d,soul===1139?3000:4500);assert.equal(n.fighters[0].hp,1000-n.fighters[1].lastAttackDamage+d);assert.equal(n.fighters[0].effects.id984.amount,soul===1139?1:2);assert.equal(n.fighters[1].ailments['石化'],undefined);assert.equal(n.fighters[1].effects.statusBlock,undefined);}
 const q=make(undefined,{soul:1139});q.fighters[1].stages.spa=2;const n=turn(q,900031,900040);assert.equal(n.fighters[0].hp,9000);assert.equal(9000-n.fighters[1].hp,n.fighters[1].lastAttackDamage);timer(q,1,'幽蝶强化保护');const blocked=turn(q,900031,900040);assert.equal(blocked.fighters[0].stages.spa,0);assert.equal(blocked.fighters[0].effects.id984,undefined);
});
test('3867 魂印MISS与免攻零伤仍吸强，无强化石化失败封属',()=>{
 for(const mode of ['miss','immune']){const q=make(undefined,{soul:1139,hp:1000});q.fighters[1].stages.atk=1;if(mode==='miss')q.moveDefinitions[key(900040)].accuracy=0,q.moveDefinitions[key(900040)].alwaysHit=false;else q.fighters[0].counts.attackNullify=1;const n=turn(q,900031,900040);assert.equal(n.fighters[0].stages.atk,1);assert.equal(n.fighters[0].hp,4000);}
 let stone=false,block=false;for(let seed=0;seed<40;seed++){const q=make(undefined,{soul:1139,seed}),n=turn(q,900031,900040);stone ||=!!n.fighters[1].ailments['石化'];block ||=!!n.fighters[1].effects.statusBlock;}assert.ok(stone&&block);const q=make(undefined,{soul:1447});timer(q,1,'免异常');assert.ok(turn(q,900031,900040).fighters[1].effects.statusBlock);
});
test('3867 1708未受伤命中才降先制、MISS失败且不改能力',()=>{
 const q=make(e(1708)),n=turn(q);assert.equal(n.fighters[1].effects.id984.amount,-2);assert.ok(Object.values(n.fighters[1].stages).every(v=>v===0));assert.equal(n.fighters[1].effects.id984.start,2);
 const slow=make(e(1708),{aStats:{spe:1}});slow.moveDefinitions[key(slow.auditMoveId)].priority=0;const hit=turn(slow,undefined,900040);assert.equal(hit.fighters[1].effects.id984,undefined);const miss=make(e(1708),{hit:false});miss.moveDefinitions[key(miss.auditMoveId)].alwaysHit=false;miss.moveDefinitions[key(miss.auditMoveId)].accuracy=0;assert.equal(turn(miss).fighters[1].effects.id984,undefined);
});
test('3867 2390消回合成功封攻下两回合、免断失败及命中效果失效',()=>{
 const q=make(e(2390));timer(q,1,'免弱');const n=turn(q);assert.equal(n.fighters[1].effects.attackBlock.start,2);n.moveDefinitions[key(900040)].operations=[{effectId:585,index:0,phase:'afterHit',params:[1],sourceArgs:[1]}];const blocked=turn(n,900031,900040);assert.equal(blocked.fighters[0].hp,n.fighters[0].hp);assert.equal(blocked.fighters[1].stages.atk,0);n.round=4;assert.ok(turn(n,900031,900040).fighters[0].hp<n.fighters[0].hp);timer(q,1,'protect');assert.equal(turn(q).fighters[1].effects.attackBlock,undefined);
});
test('3867 1885免粉石化与理论吸取、护罩不等于免粉',()=>{
 const q=make(e(1885),{hp:1000});timer(q,1,'固定百分比免疫');const n=turn(q);assert.equal(n.fighters[0].hp,4000);assert.ok(n.fighters[1].ailments['石化']);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage);delete q.fighters[1].effects['固定百分比免疫'];q.fighters[1].suitState.barrier=5000;assert.equal(turn(q).fighters[1].ailments['石化'],undefined);
});
test('3867 2228仅削减固粉输出、三回合期限及抗性',()=>{
 for(const id of [683,977]){const q=turn(make(e(2228)));q.moveDefinitions[key(900041)].operations=[{effectId:id,index:0,phase:'afterHit',params:id===683?[100,100]:[3,2],sourceArgs:id===683?[100,100]:[3,2]}];const hp=q.fighters[0].hp;assert.equal(hp-turn(q,900031).fighters[0].hp,id===683?50:1500);q.round=4;assert.equal(hp-turn(q,900031).fighters[0].hp,id===683?100:3000);q.fighters[0].build.resistance[id===683?'fixed':'percent']=100;assert.equal(turn(q,900031).fighters[0].hp,hp);}
});
test('3867 4和5概率强化弱化、失败免疫和六级边界',()=>{
 for(const id of [4,5])for(const x of pick(id)){let yes=false,no=false;for(let seed=0;seed<50;seed++){const n=turn(make(x,{seed})).fighters[id===4?0:1].stages[keys[x.params[0]]];yes ||=n===x.params[2];no ||=n===0;}assert.ok(yes);if(x.params[1]<100)assert.ok(no);const q=make(x);timer(q,id===4?0:1,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[id===4?0:1].stages[keys[x.params[0]]],0);}
});
test('3867 15害怕概率、48免异常与191反弹',()=>{
 let yes=false,no=false;for(let seed=0;seed<50;seed++){const n=turn(make(e(15),{seed}));yes ||=!!n.fighters[1].ailments['害怕'];no ||=!n.fighters[1].ailments['害怕'];}assert.ok(yes&&no);
 for(const id of [48,191]){const q=make(e(id));q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,6,2],sourceArgs:[100,6,2]}];const n=turn(q);assert.equal(n.fighters[0].ailments['害怕'],undefined);if(id===191)assert.ok(n.fighters[1].ailments['害怕']);n.round=e(id).params[0]+1;n.fighters[1].ailments={};assert.ok(turn(n,900031).fighters[0].ailments['害怕']);}
});
test('3867 全部技能基础伤害、MISS、控制封招与暴击倍率',()=>{
 for(const move of source.moves){const entry={moveId:move.id,index:null};const q=make(entry,{omit:true}),n=turn(q);if(move.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);const stopped=make(entry,{omit:true});stopped.fighters[0].ailments['疲惫']=2;assert.equal(turn(stopped).fighters[0].pp[key(move.id)],move.pp);timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(move.power>0){const c=make(entry,{omit:true});timer(c,0,'必定暴击');assert.ok(turn(c).fighters[0].lastAttackDamage>=n.fighters[0].lastAttackDamage*2);}if(!move.alwaysHit){const miss=make(entry,{omit:true,hit:false});miss.moveDefinitions[key(move.id)].accuracy=0;assert.equal(turn(miss).fighters[1].hp,9000);}}
});
test('3867 正式本地18招双魂印配招初始化执行与PP伤害',()=>{
 const local=require('../local-species.cjs').species(3867);assert.equal(local.source.storage,'local');
 for(const soulId of [1139,1447])for(const m of local.moves){const a=structuredClone(local);a.selectedSoulId=soulId;const ids=[m.id,...a.moves.filter(x=>!x.fifth&&x.id!==m.id).slice(0,m.fifth?4:3).map(x=>x.id),...(!m.fifth?[33314]:[])];const s=E.createBattle({wikiSnapshots:[a,a],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});assert.equal(s.fighters[0].soulId,soulId);assert.equal(s.fighters[0].pp[key(m.id)],m.pp);const n=E.resolveTurn(s,[key(m.id),key(m.id)]);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.kind!=='status')assert.ok(n.fighters[0].lastAttackDamage>0);s.fighters[0].pp[key(m.id)]=0;assert.throws(()=>E.resolveTurn(s,[key(m.id),key(m.id)]));}
});







{const test=require('node:test').test,assert=require('node:assert/strict');test('3867 927原子实际回复与技能禁疗公共修复',()=>{const o=require('./helpers/assert-4200-public-heal.cjs')(3867,927);assert.ok(o.fighters[0].hp>1000);});}
