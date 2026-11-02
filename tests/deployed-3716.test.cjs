'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3716-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3716 基础25招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3716 基础25招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3716 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3716 原版觉醒全部技能接入与真实PP、跨版本第五拒绝',()=>{
 for(const group of source.skillVersions){const s={...structuredClone(source),selectedSoulId:group.soulId};for(const id of group.moveIds){const m=s.moves.find(x=>x.id===id),load=E.WIKI.defaultMoves(s);if(!load.includes(id))load[load.findIndex(k=>s.moves.find(x=>x.id===k).fifth===m.fifth)]=id;assert.deepEqual(E.WIKI.assess(s,load).issues,[]);const b=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[load,load]});assert.equal(b.fighters[0].pp[key(id)],m.pp);}
 const other=source.skillVersions.find(g=>g!==group),bad=E.WIKI.defaultMoves(s);bad[0]=other.moveIds.find(id=>!group.moveIds.includes(id)&&s.moves.find(m=>m.id===id).fifth);assert.ok(E.WIKI.assess(s,bad).issues.length);}
});
test('3716 22明确疲惫3回合、15与782害怕概率失败免疫及累积封顶',()=>{
 const fatigue=turn(make(e(22)));assert.equal(fatigue.fighters[1].ailments['疲惫'],3);for(const id of [15,782]){let applied=0,failed=0;for(let seed=0;seed<40;seed++){const s=make(e(id),{seed}),o=turn(s);if(o.fighters[1].ailments['害怕']){assert.ok([2,3].includes(o.fighters[1].ailments['害怕']));applied++;}else failed++;}assert.ok(applied&&failed);const im=make(e(id));timer(im,1,'免异常');assert.equal(turn(im).fighters[1].ailments['害怕'],undefined);}
 for(let seed=0;seed<20;seed++){const run=uses=>{const s=make(e(782),{seed});s.fighters[0].soulState.skillUses={[key(s.auditMoveId)]:uses};return turn(s).fighters[1].ailments['害怕'];};assert.equal(run(4),run(50));}
});
test('3716 40先手双威力，33清强805成功清两PP，保护和无强化失败',()=>{
 const s=make(e(40)),base=make(e(40),{omit:true});base.moveDefinitions[key(base.auditMoveId)].power*=2;assert.equal(turn(s).fighters[0].lastAttackDamage,turn(base).fighters[0].lastAttackDamage);const late=make(e(40),{aStats:{spe:1}}),ref=make(e(40),{omit:true,aStats:{spe:1}});assert.equal(turn(late).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);
 for(const id of [33,805]){const s=make(e(id));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);if(id===805)assert.equal(Object.values(o.fighters[1].pp).filter(x=>x===0).length,2);const no=make(e(id));assert.ok(Object.values(turn(no).fighters[1].pp).every(x=>x>0));timer(s,1,'幽蝶强化保护');assert.equal(turn(s).fighters[1].stages.atk,2);}
});
test('3716 58后续必暴191免疫反弹、43恢复及57持续用招回复禁疗',()=>{
 const start=turn(make(e(58)));const plain=turn(make(e(58),{omit:true}),900030);assert.ok(turn(start,900030).fighters[0].lastAttackDamage>plain.fighters[0].lastAttackDamage);assert.equal(start.fighters[0].effects['必定暴击'].end,3);
 const reflect=make(e(191),{opponentMove:20499,opponentEffectId:22});const r=turn(reflect,reflect.auditMoveId,900042);assert.equal(r.fighters[0].ailments['疲惫'],undefined);assert.equal(r.fighters[1].ailments['疲惫'],3);
 const heal=make(e(43),{hp:1000});assert.equal(turn(heal).fighters[0].hp,4000);timer(heal,0,'技能禁疗');assert.equal(turn(heal).fighters[0].hp,1000);
 const timedHeal=turn(make(e(57),{hp:1000}));timedHeal.fighters[0].hp=1000;assert.equal(turn(timedHeal,900031).fighters[0].hp,5500);timer(timedHeal,0,'技能禁疗');assert.equal(turn(timedHeal,900031).fighters[0].hp,1000);
});
test('3716 1751盾消失200固伤与石化分支、683范围随机固伤、1017消耗实际护盾',()=>{
 let stone=0,none=0;for(let seed=0;seed<20;seed++){const s=turn(make(e(1751)));s.fighters[1].stats.spa=9999;s.rng=seed;const o=turn(s,900031,900040);assert.equal(o.fighters[1].hp,8800);assert.equal(o.fighters[0].suitState.shield,0);if(o.fighters[1].ailments['石化'])stone++;else none++;}assert.ok(stone&&none);
 const values=new Set();for(let seed=0;seed<20;seed++){const o=turn(make(e(683),{seed}));const n=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(n>=150&&n<=250);values.add(n);}assert.ok(values.size>1);
 const s=make(e(1017));s.fighters[0].suitState.shield=350;const o=turn(s);assert.equal(o.fighters[0].suitState.shield,0);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,350);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].suitState.shield,350);
});
test('3716 1326护盾双强化1038双反转得盾946低体双强化及禁强',()=>{
 for(const shield of [0,1]){const s=make(e(1326));s.fighters[0].suitState.shield=shield;assert.equal(turn(s).fighters[0].stages.atk,shield?2:1);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);}
 const rev=make(e(1038));rev.fighters[0].stages.atk=-4;const o=turn(rev);assert.equal(o.fighters[0].stages.atk,6);assert.equal(o.fighters[0].suitState.shield,300);assert.equal(turn(make(e(1038))).fighters[0].suitState.shield,0);
 for(const hp of [1000,9000])assert.equal(turn(make(e(946),{hp})).fighters[0].stages.atk,hp===1000?2:1);
});
test('3716 1154低体和1004高体用招固伤、619降先制843加先制及444PP',()=>{
 for(const [id,hp,expected] of [[1154,1000,400],[1154,9000,200],[1004,9000,200]]){const s=make(e(id),{hp});const o=turn(s);assert.equal(o.fighters[1].hp,9000-expected);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);}
 const high=make(e(1004),{targetHp:5000});assert.equal(turn(high).fighters[1].hp,4600);
 const low=turn(make(e(619)));assert.equal(low.fighters[1].effects.id984.amount,-2);assert.equal(low.fighters[1].effects.id984.start,2);const up=turn(make(e(843)));assert.equal(up.fighters[0].effects.id984.amount,2);assert.equal(up.fighters[0].effects.id984.start,2);
 const pp=make(e(444));for(const id of pp.fighters[0].moves)pp.fighters[0].pp[id]=1;const p=turn(pp);assert.equal(p.fighters[0].pp[key(p.auditMoveId)],1);assert.equal(p.fighters[0].pp[key(900031)],2);assert.equal(p.fighters[1].pp[key(900040)],98);
});
test('3716 1110反转成功一次封属失败不封、1124清回合成功下两回合增伤',()=>{
 const s=make(e(1110));s.fighters[1].stages.atk=2;const o=E.resolveTurn(s,[key(s.auditMoveId),'potion:hp']);assert.equal(o.fighters[1].stages.atk,-2);assert.equal(o.fighters[1].counts.nextStatusInvalid,1);assert.equal(turn(o,900031).fighters[1].counts.nextStatusInvalid,0);assert.equal(turn(make(e(1110))).fighters[1].counts.nextStatusInvalid,undefined);
 const boost=make(e(1124));timer(boost,1,'doubleDamage');const b=turn(boost);assert.equal(b.fighters[0].effects.id913.start,2);assert.equal(b.fighters[0].effects.id913.end,3);const no=structuredClone(b);delete no.fighters[0].effects.id913;assert.ok(turn(b,900030).fighters[0].lastAttackDamage>turn(no,900030).fighters[0].lastAttackDamage);assert.equal(turn(make(e(1124))).fighters[0].effects.id913,undefined);
});
test('3716 696逐次暴击提升与80%封顶通过真实伤害比较',()=>{
 let grew=false,noncrit=false;for(let seed=0;seed<40;seed++){const run=uses=>{const s=make(e(696),{seed,criticals:true});s.fighters[0].soulState.skillUses={[key(s.auditMoveId)]:uses};return turn(s).fighters[0].lastAttackDamage;};const first=run(0),cap=run(10);assert.equal(cap,run(50));if(cap>first)grew=true;if(first===cap)noncrit=true;}assert.ok(grew&&noncrit);
});

test('3716 确认1751本来源盾独立消失、同来源刷新一次及其他盾不重复反应',()=>{const o=require('./helpers/assert-1751-source-shield.cjs')(3716),p=require('./helpers/3716-battle.cjs').pick(1751)[0].params;assert.equal(o.fighters[1].hp,9000-p[1]);});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3716 1751公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1751-cold-probability.cjs')(3716);assert.equal(Object.keys(o.fighters[1].ailments).length,0);});}
