'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
const rageEvents=s=>s.turns.at(-1).events.filter(e=>e.text.includes('星皇之怒判定'));
const rageHits=s=>s.turns.at(-1).events.filter(e=>e.kind==='damage'&&e.text.includes('（星皇之怒）'));
const blocked={skillBlock:{start:1,end:1}};

test('3291原622普通整招无效皇怒仅一次50判定，半威力额外红伤不再扣PP或推进命中成长',()=>{
 const outcomes=new Set();
 for(let seed=1;seed<=12;seed++){
  const s=H.turn(H.make(10499,{seed,aEffects:blocked}),10499),f=s.fighters[0],events=rageEvents(s),hits=rageHits(s);
  assert.equal(events.length,1);assert.match(events[0].text,/50%/);
  const triggered=events[0].text.includes('：触发');outcomes.add(triggered);assert.equal(hits.length,Number(triggered));
  assert.equal(f.pp['wiki:10499'],H.source.moves.find(m=>m.id===10499).pp-1);
  assert.equal(f.soulState.skillUses['wiki:10499'],1);assert.equal(f.soulState.skillHitUses?.['wiki:10499']??0,0);
  assert.equal(f.hp,9000);assert.equal(s.fighters[1].hp,9000-H.damage(s,'attack'));
  if(triggered)assert.match(hits[0].detail,/威力 20 ·/);
 }
 assert.deepEqual([...outcomes].sort(),[false,true]);
});

test('3291原五专属独立皇怒保留MISS及整招无效分支，被控未出和药剂均不判定',()=>{
 for(const move of [30376,25294,25295,30380,30381])for(const mode of ['miss','invalid','control','item']){
  const input=H.make(move,{seed:4,aEffects:mode==='miss'?{攻击必失:{start:1,end:1}}:mode==='invalid'?blocked:{},aAilments:mode==='control'?{睡眠:2}:{}}),before=input.fighters[0].pp['wiki:'+move];
  const s=H.turn(input,mode==='item'?'potion:pp':move),actual=['miss','invalid'].includes(mode);
  assert.equal(rageEvents(s).length,Number(actual),move+':'+mode);
  assert.equal(s.fighters[0].pp['wiki:'+move],before-Number(actual));
  assert.equal(s.fighters[0].fifthUses,move===30381&&mode==='miss'?1:0,'原必中第五穿透攻击必失；其余无命中时额外行动不推进成长');
 }
});

test('3291原皇怒完整威力仅消费已持有的下次技能储备，半威力与不减威力真实伤害分别结算',()=>{
 for(let seed=1;seed<=8;seed++){
  const run=full=>H.turn(H.make(30381,{seed,aEffects:blocked,aCounts:full?{rageFull:2}:{},aStats:{atk:1800},bStats:{def:400}}),30381),half=run(false),full=run(true);
  assert.equal(rageEvents(half)[0].text,rageEvents(full)[0].text);
  assert.equal(full.fighters[0].counts.rageFull,1);assert.equal(full.fighters[0].fifthUses,0);
  if(rageHits(half).length){assert.match(rageHits(half)[0].detail,/威力 80 ·/);assert.match(rageHits(full)[0].detail,/威力 160 ·/);assert.ok(H.damage(full,'attack')>H.damage(half,'attack')*1.8);}
 }
});

test('3291原皇怒不响应原3242战霸下次真实反馈，不消费原储备；普通红伤仍反馈',()=>{
 let triggered=0;
 for(let seed=1;seed<=8;seed++)for(const mode of ['rage','normal']){
  const s=H.turn(H.make(mode==='rage'?30381:10499,{seed,enemyId:3242,enemyMoves:[25183],aStats:{spe:100},bStats:{spe:4000},aStages:{acc:6},aEffects:{四杀鬼囹:{start:1,end:1},...(mode==='rage'?blocked:{})}}),mode==='rage'?30381:10499,25183);
  if(mode==='rage'){
   assert.equal(H.damage(s,'true',1),0,'额外行动不得触发战霸反馈');assert.equal(s.fighters[1].counts.nextDamageReturn,2,'不消费反馈储备');
   assert.equal(s.fighters[0].hp,9000);if(rageHits(s).length)triggered++;
  }else{assert.ok(H.damage(s,'true',1)>0);assert.equal(s.fighters[1].counts.nextDamageReturn,undefined);}
 }
 assert.ok(triggered>0);
});

test('3291原皇怒击败原3056禁止魂410临终反击；普通红伤击败保留完整伤害反击',()=>{
 let triggered=0;
 for(let seed=1;seed<=8;seed++)for(const mode of ['rage','normal']){
  const move=mode==='rage'?30381:10499,s=H.turn(H.make(move,{seed,enemyId:3056,bHp:1,aStages:{acc:6},aEffects:{四杀鬼囹:{start:1,end:1},...(mode==='rage'?blocked:{})}}),move);
  if(mode==='rage'){
   assert.equal(H.damage(s,'true',1)+H.damage(s,'percent',1)+H.damage(s,'fixed',1),0,'皇怒击败禁止临终反击');
   if(rageHits(s).length){triggered++;assert.equal(s.fighters[1].hp,0);assert.equal(s.fighters[0].hp,9000);}
  }else{assert.equal(s.fighters[1].hp,0);assert.ok((s.damageEvents??[]).some(e=>e.sourceSide===1),'普通击败仍保留来源反击');}
 }
 assert.ok(triggered>0);
});
