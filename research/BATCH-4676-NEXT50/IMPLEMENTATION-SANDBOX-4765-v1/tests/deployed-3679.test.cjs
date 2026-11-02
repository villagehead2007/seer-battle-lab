'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make,turn,pick,timer}=require('./helpers/3679-battle.cjs');
const e=id=>pick(id)[0];
test('3679 基础14招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3679 基础14招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3679 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});



test('3679 962无正强化翻倍、已有强化普通、禁强化与六级封顶',()=>{
 for(const boosted of [false,true]){const s=make(e(962));if(boosted)s.fighters[0].stages.atk=1;const o=turn(s);assert.equal(o.fighters[0].stages.def,boosted?1:2);const ban=structuredClone(s);timer(ban,0,'禁强化');assert.equal(turn(ban).fighters[0].stages.def,0);}
 const cap=make(e(962));for(const k of keys)cap.fighters[0].stages[k]=6;const o=turn(cap);for(const k of keys)assert.equal(o.fighters[0].stages[k],6);
});

test('3679 749概率降级成功失败、免弱和负六级边界',()=>{
 let yes,no;for(let seed=0;seed<40;seed++){const s=make(e(749),{seed}),o=turn(s);if(o.fighters[1].stages.atk===-1)yes=s;else no=o;}assert.ok(yes);for(const k of keys)assert.equal(turn(yes).fighters[1].stages[k],-1);
 const im=structuredClone(yes);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);for(const k of keys)yes.fighters[1].stages[k]=-6;assert.equal(turn(yes).fighters[1].stages.atk,-6);
});


test('3679 1393施放及后续伤害前降防速，失败粉伤与三回合到期',()=>{
 const x=e(1393),s=make(x),o=turn(s);assert.equal(o.fighters[1].stages.def,-2);assert.equal(o.fighters[1].stages.spe,-2);assert.equal(o.fighters[0].effects['用招伤害前降防速'].end,3);
 o.moveDefinitions[key(900030)].kind='physical';const hit=turn(o,900030),plain=structuredClone(o);delete plain.fighters[0].effects['用招伤害前降防速'];const ref=turn(plain,900030);assert.equal(hit.fighters[1].stages.def,-4);assert.ok(hit.fighters[0].lastAttackDamage>ref.fighters[0].lastAttackDamage);
 const third=turn(hit,900031);assert.equal(third.fighters[1].stages.def,-6);assert.equal(third.fighters[0].effects['用招伤害前降防速'],undefined);const fourth=turn(third,900031);assert.equal(fourth.fighters[1].hp,third.fighters[1].hp);
 const im=make(x);timer(im,1,'免弱');const f=turn(im);assert.equal(f.fighters[1].hp,6000);assert.equal(f.fighters[1].stages.def,0);
 const cap=make(x);cap.fighters[1].stages.def=-6;cap.fighters[1].stages.spe=-6;assert.equal(turn(cap).fighters[1].hp,6000);
 const partial=make(x);partial.fighters[1].stages.def=-6;assert.equal(turn(partial).fighters[1].hp,9000);
 const block=make(x);timer(block,0,'skillBlock');assert.equal(turn(block).fighters[0].effects['用招伤害前降防速'],undefined);
});

test('3679 999按正强化种类而非等级增伤，零种六种与弱化不计',()=>{
 for(let count=0;count<=6;count++){const s=make(e(999));for(let i=0;i<count;i++)s.fighters[0].stages[keys[i]]=i%2?1:6;const plain=structuredClone(s);plain.moveDefinitions[key(s.auditMoveId)].operations=[];const o=turn(s),p=turn(plain);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-p.fighters[0].lastAttackDamage*(1+.15*count))<=2);}
 const neg=make(e(999));neg.fighters[0].stages.spe=-2;const base=structuredClone(neg);base.moveDefinitions[key(neg.auditMoveId)].operations=[];assert.equal(turn(neg).fighters[0].lastAttackDamage,turn(base).fighters[0].lastAttackDamage);timer(neg,0,'skillBlock');assert.equal(turn(neg).fighters[1].hp,9000);
});

test('3679 1366百分比追加20至40实际攻击伤害，免攻零基数及抗性',()=>{
 let s=make(e(1366));for(let i=1;i<=4;i++){const before=s.fighters[1].hp;s=turn(s);assert.equal(before-s.fighters[1].hp-s.fighters[0].lastAttackDamage,Math.floor(s.fighters[0].lastAttackDamage*Math.min(40,20+(i-1)*10)/100));}
 const immune=make(e(1366));timer(immune,1,'攻击伤害免疫');assert.equal(turn(immune).fighters[1].hp,9000);
 const res=make(e(1366));res.fighters[1].build.resistance.percent=50;const o=turn(res);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,Math.floor(Math.floor(o.fighters[0].lastAttackDamage*.2)*.5));
 const b=make(e(1366));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);
});

test('3679 889消回合与636消强害怕，失败保护和异常次数免疫消费',()=>{
 for(const id of [889,636]){const s=make(e(id),{seed:1});if(id===889)timer(s,1,'doubleDamage');else s.fighters[1].stages.def=2;const o=turn(s);if(id===889)assert.equal(o.fighters[1].effects.doubleDamage,undefined);else assert.equal(o.fighters[1].stages.def,0);assert.equal(o.fighters[1].pp[key(900041)],99);
 const no=turn(make(e(id)));assert.equal(no.fighters[1].ailments['害怕'],undefined);const protect=structuredClone(s);timer(protect,1,id===889?'protect':'幽蝶强化保护');assert.equal(turn(protect).fighters[1].ailments['害怕'],undefined);
 const im=structuredClone(s);im.fighters[1].counts.immune=1;const out=turn(im);assert.equal(out.fighters[1].counts.immune,0);assert.equal(out.fighters[1].ailments['害怕'],undefined);}
});

test('3679 455已损体力固伤与683随机固伤，满血零追加护罩和封招',()=>{
 for(const hp of [9000,8999,4000]){const o=turn(make(e(455),{hp}));assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,9000-hp);}
 const vals=new Set();for(let seed=0;seed<80;seed++){const o=turn(make(e(683),{seed})),n=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(n>=200&&n<=400);vals.add(n);}assert.ok(vals.size>30);
 const shield=make(e(455),{hp:8500});shield.fighters[1].suitState.barrier=600;assert.equal(turn(shield).fighters[1].suitState.barrier,100);
 for(const id of [455,683]){const b=make(e(id),{hp:4000});timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);}
});

test('3679 696每次暴击概率递增至必暴，实际暴击伤害与未触发分支',()=>{
 let yes,no;for(let seed=0;seed<50;seed++){const s=make(e(696),{seed,criticals:true}),o=turn(s);if(o.turns[0].events.some(x=>JSON.stringify(x).includes('致命')))yes=o;else no=o;}assert.ok(yes&&no);
 for(let seed=0;seed<12;seed++){const s=make(e(696),{seed,criticals:true});s.fighters[0].soulState.skillUses={[key(s.auditMoveId)]:7};const o=turn(s);assert.ok(o.turns[0].events.some(x=>JSON.stringify(x).includes('致命')));const p=structuredClone(s);p.moveDefinitions[key(s.auditMoveId)].operations=[];p.moveDefinitions[key(s.auditMoveId)].criticalChance=0;const plain=turn(p);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-plain.fighters[0].lastAttackDamage*2)<6);}
 const b=make(e(696),{criticals:true});timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);
});

test('3679 717低血只翻倍回复不翻倍吸取，四回合禁疗与封顶',()=>{
 for(const hp of [1000,4499,4500,8999]){const o=turn(make(e(717),{hp}));assert.equal(o.fighters[1].hp,6000);assert.equal(o.fighters[0].hp,Math.min(9000,hp+(hp<4500?6000:3000)));}
 let s=turn(make(e(717)));for(let r=2;r<=5;r++){s.fighters[1].hp=9000;const o=turn(s,900031);assert.equal(9000-o.fighters[1].hp,r<=4?3000:0);s=o;}
 const ban=make(e(717),{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);const b=make(e(717));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].hp,9000);
});

test('3679 58必暴和843先制次两回合生效，施放及到期边界',()=>{
 for(const id of [58,843]){let s=turn(make(e(id),{aStats:{spe:1}}));const k=id===58?'必定暴击':'id984';assert.equal(s.fighters[0].effects[k].start,2);assert.equal(s.fighters[0].effects[k].end,3);for(let r=2;r<=4;r++){const p=structuredClone(s);delete p.fighters[0].effects[k];const ref=turn(p,900030),o=turn(s,900030);if(id===58)assert.ok(Math.abs(o.fighters[0].lastAttackDamage-ref.fighters[0].lastAttackDamage*(r<=3?2:1))<=1);else assert.equal(o.turns[r-1].first,r<=3?0:1);s=o;}
 const b=make(e(id));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects[k],undefined);}
});

test('3679 850按回合概率免攻及695封属，成功失败和两回合到期',()=>{
 for(const id of [850,695]){let yes,no;for(let seed=0;seed<60;seed++){const s=make(e(id),{seed,opponentMove:20156}),o=turn(s,undefined,id===850?900040:900042);const success=id===850?o.fighters[0].hp===9000:o.fighters[1].stages.atk===0;if(success)yes=o;else no=o;}assert.ok(yes&&no);assert.ok(id===850?no.fighters[0].hp<9000:no.fighters[1].stages.atk===1);const keyName=id===850?'概率攻击免疫':'对手属性失效';assert.equal(yes.fighters[0].effects[keyName].end,2);const after=turn(yes,900031);assert.equal(after.fighters[0].effects[keyName],undefined);const b=make(e(id));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects[keyName],undefined);}
 const s=make(e(850),{opponentMove:32370,opponentEffectId:455});s.fighters[1].hp=8000;const o=turn(s,undefined,900042);assert.ok(o.fighters[0].hp<=8000);
});

test('3679 1232反转自身下降并反馈对手，零下降免弱与六级边界',()=>{
 const s=make(e(1232));s.fighters[0].stages.atk=-6;s.fighters[0].stages.spe=-2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,6);assert.equal(o.fighters[1].stages.atk,-6);assert.equal(o.fighters[1].stages.spe,-2);const im=structuredClone(s);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);assert.equal(turn(make(e(1232))).fighters[0].stages.atk,0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-6);
});

test('3679 191真实害怕反弹与四回合到期，免疫次数和封招失败',()=>{
 const s=make(e(191),{opponentMove:32370,opponentEffectId:636,seed:1});s.fighters[0].stages.def=1;const first=turn(s);first.fighters[0].stages.def=1;const o=turn(first,900031,900042);assert.equal(o.fighters[0].stages.def,0);assert.equal(o.fighters[0].ailments['害怕'],undefined);assert.ok(o.turns[1].events.some(x=>JSON.stringify(x).includes('害怕')));assert.equal(o.fighters[0].effects.reflect.end,4);let n=first;for(let r=2;r<=4;r++)n=turn(n,900031);assert.equal(n.fighters[0].effects.reflect,undefined);const block=make(e(191));timer(block,0,'skillBlock');assert.equal(turn(block).fighters[0].effects.reflect,undefined);
});

test('3679 604随机威力连续增长并封顶300，换招重置与封招无伤',()=>{
 let s=make(e(604));const outputs=[];for(let i=1;i<=7;i++){s.fighters[0].pp[key(s.auditMoveId)]=5;s.fighters[1].hp=9000;const o=turn(s),damage=9000-o.fighters[1].hp;assert.ok(damage>0);if(i>=6){const ref=structuredClone(s);ref.moveDefinitions[key(s.auditMoveId)].operations=[];ref.moveDefinitions[key(s.auditMoveId)].power=300;const expected=turn(ref);const min=Math.floor((Math.floor(Math.floor(42*300*180/300)/50)+2)*1.5*E.typeEffectiveness(source.moves.find(m=>m.id===s.auditMoveId).type,s.fighters[1].type,s.typeChart)*.85);assert.ok(damage>=min);outputs.push(damage);}s=o;}
 const changed=turn(s,900031),reset=turn(changed);assert.equal(reset.fighters[0].consecutiveUses,1);const no=make(e(604));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
});

test('3679 魂印965倍伤二三四倍实伤，失败累计概率并在成功重置',()=>{
 const multiples=new Set();let failed;for(let seed=0;seed<80;seed++){const s=make({moveId:10361,index:null},{soul:965,omit:true,seed,hp:1000});const o=turn(s,900030);const m=o.fighters[0].soulState.leopardMultiplier;multiples.add(m);assert.equal(o.fighters[0].soulState.leopardChance,m===1?50:30);if(m===1)failed=s;const p=structuredClone(s);p.fighters[0].soulId=0;const raw=Math.floor(Math.floor(42*100*180/300)/50)+2,stab=require('./helpers/source-stab.cjs')(p.moveDefinitions[key(900030)].type,p.fighters[0].type,p.typeChart),affinity=E.typeEffectiveness(p.moveDefinitions[key(900030)].type,p.fighters[1].type,p.typeChart);assert.ok(o.fighters[0].lastAttackDamage>=Math.floor(raw*stab*affinity*.85*m));assert.ok(o.fighters[0].lastAttackDamage<=Math.floor(raw*stab*affinity*m));}
 assert.deepEqual([...multiples].sort(),[1,2,3,4]);assert.ok(failed);
 for(const chance of [30,50,70,90,100]){let failure=false;for(let seed=0;seed<40;seed++){const s=make({moveId:10361,index:null},{soul:965,omit:true,seed});s.fighters[0].soulState.leopardChance=chance;const o=turn(s,900030);if(o.fighters[0].soulState.leopardMultiplier===1){failure=true;assert.equal(o.fighters[0].soulState.leopardChance,Math.min(100,chance+20));}else assert.equal(o.fighters[0].soulState.leopardChance,30);}assert.equal(failure,chance<100);}
});

test('3679 魂印965下一次攻击先制跨属性招保留，控制不消费',()=>{
 const s=make({moveId:10361,index:null},{soul:965,omit:true,aStats:{spe:1}});s.fighters[0].soulState.leopardPriority=true;s.fighters[0].soulState.leopardChance=100;const status=turn(s,900031);assert.equal(status.turns[0].first,1);assert.equal(status.fighters[0].soulState.leopardPriority,true);const hit=turn(status,900030);assert.equal(hit.turns[1].first,0);assert.equal(hit.fighters[0].soulState.leopardPriority,false);assert.equal(hit.fighters[0].soulState.leopardChance,30);
 const controlled=structuredClone(s);controlled.fighters[0].ailments['疲惫']=1;const c=turn(controlled,900030);assert.equal(c.fighters[0].soulState.leopardChance,100);assert.equal(c.fighters[0].soulState.leopardPriority,true);assert.equal(c.fighters[0].pp[key(900030)],99);
});

test('3679 魂印965高低伤及300等值边界，最大体力基数与回复封顶',()=>{
 for(const damage of [299,300,301]){const s=make({moveId:10361,index:null},{soul:965,omit:true,hp:8000,bStats:{maxHp:9900}});s.moveDefinitions[key(900030)].power=3000;timer(s,1,'攻击伤害上限',{amount:damage});const o=turn(s,900030);assert.equal(o.fighters[0].lastAttackDamage,damage);assert.equal(9900-o.fighters[1].hp-damage,damage<300?3300:damage>300?3000:0);assert.equal(o.fighters[0].hp,damage===300?8000:9000);}
 const blocked=make({moveId:10361,index:null},{soul:965,omit:true,hp:1000});timer(blocked,0,'attackBlock');const b=turn(blocked,900030);assert.equal(b.fighters[0].lastAttackDamage??0,0);assert.equal(b.fighters[1].hp,6000);assert.equal(b.fighters[0].hp,4000);
 const status=turn(make({moveId:10361,index:null},{soul:965,omit:true,hp:1000}),900031);assert.equal(status.fighters[0].hp,1000);assert.equal(status.fighters[1].hp,9000);
 const cap=make({moveId:10361,index:null},{soul:965,omit:true,hp:8999});cap.moveDefinitions[key(900030)].power=500;const o=turn(cap,900030);assert.ok(o.fighters[0].lastAttackDamage>300);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,3000);assert.equal(o.fighters[0].hp,9000);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3679 717用招后理论吸取不因基础攻击击杀丢失',()=>{const o=require('./helpers/assert-717-1674-after-kill.cjs')(3679,717);assert.equal(o.fighters[1].hp,0);assert.ok(o.fighters[0].hp>5000);});}
