'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3291-native.cjs');
// Independent one-draw oracle for the public deterministic battle seed state.
function nextRandom(state){let t=(state+0x6D2B79F5)>>>0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
const rageEvents=s=>s.turns.at(-1).events.filter(e=>e.kind==='damage'&&e.text.includes('（星皇之怒）'));
const rageRoll=s=>s.turns.at(-1).events.filter(e=>e.text.includes('星皇之怒判定'));
const normalDamage=s=>s.turns.at(-1).events.find(e=>e.kind==='damage'&&!e.text.includes('星皇之怒'));

test('3291原622皇怒概率50/清强奖励70/翻倍100/140封顶100，按真实seed一次抽样及实际额外红伤核对',()=>{
 // Ordinary10499 is not must-hit: its accuracy draw precedes the independent rage roll,
 // even when the whole skill is blocked. Guaranteed-hit30381 below has no accuracy draw.
 const seen=new Map([[50,new Set()],[70,new Set()],[100,new Set()]]);
 for(let seed=1;seed<=16;seed++)for(const [bonus,double,percent]of [[false,false,50],[true,false,70],[false,true,100],[true,true,100]]){
  const input=H.make(10499,{seed,aEffects:{skillBlock:{start:1,end:1},...(bonus?{rageBonus:{start:1,end:1}}:{})},aCounts:double?{rageDouble:1}:{}}),expected=nextRandom((input.rng+0x6D2B79F5)>>>0)<percent/100,s=H.turn(input,10499),roll=rageRoll(s);
  assert.equal(roll.length,1);assert.match(roll[0].text,new RegExp('判定 '+percent+'%：'));
  const triggered=roll[0].text.includes('：触发');assert.equal(triggered,expected,'seed'+seed+'/'+percent);
  assert.equal(rageEvents(s).length,Number(expected));assert.equal(H.damage(s,'attack')>0,expected);
  if(double)assert.equal(s.fighters[0].counts.rageDouble,0);
  seen.get(percent).add(triggered);
 }
 assert.deepEqual(seen.get(50),new Set([true,false]));assert.deepEqual(seen.get(70),new Set([true,false]));assert.deepEqual(seen.get(100),new Set([true]));
});

test('3291原1098暴击20个百分点逐命中增长及100封顶，原生主红伤暴击倍率与独立seed吻合',()=>{
 for(let seed=1;seed<=12;seed++)for(const uses of [0,1,2,3,4,9]){
  const input=H.make(30381,{seed,criticals:true});input.fighters[0].fifthUses=uses;
  const expected=nextRandom(input.rng)<Math.min(1,1/16+.2*(uses+1)),s=H.turn(input,30381),event=normalDamage(s);
  assert.ok(event);assert.equal(/暴击 2 ×/.test(event.detail),expected,'seed'+seed+'/uses'+uses);
  assert.equal(s.fighters[0].fifthUses,uses+1);assert.equal(s.fighters[0].pp['wiki:30381'],4);
 }
});

test('3291原1098整招无效及其额外皇怒不推进主招成长，下次真命中仍按首次暴击概率计算',()=>{
 for(let seed=1;seed<=12;seed++){
  let s=H.turn(H.make(30381,{seed,criticals:true,aEffects:{skillBlock:{start:1,end:1}}}),30381);
  assert.equal(s.fighters[0].fifthUses,0);assert.equal(s.fighters[0].pp['wiki:30381'],4);
  const expected=nextRandom(s.rng)<.2625;s=H.turn(s,30381);
  assert.equal(s.fighters[0].fifthUses,1);assert.equal(/暴击 2 ×/.test(normalDamage(s).detail),expected,'seed'+seed);
 }
});

test('3291原下两技能皇怒概率/完整威力按实际技能消费，攻击先制只消费攻击；MISS无效与控制药剂独立',()=>{
 for(const mode of ['hit','zero','invalid','miss','status','control','item']){
  const input=H.make(30380,{extraMoves:[10499,20530],aCounts:{rageDouble:2,rageFull:2,attackPriority:2},aEffects:mode==='invalid'?{skillBlock:{start:1,end:1}}:mode==='miss'?{攻击必失:{start:1,end:1}}:{},aAilments:mode==='control'?{睡眠:2}:{},bEffects:mode==='zero'?{攻击伤害免疫:{start:1,end:1}}:{}});
  const move=mode==='item'?'potion:pp':mode==='status'?20530:mode==='miss'?10499:30380,before=input.fighters[0].pp['wiki:'+move],s=H.turn(input,move),f=s.fighters[0],used=!['control','item'].includes(mode),attack=used&&mode!=='status';
  assert.equal(f.counts.rageDouble,2-Number(used),mode);assert.equal(f.counts.rageFull,2-Number(used),mode);assert.equal(f.counts.attackPriority,2-Number(attack),mode);
  if(used)assert.equal(f.pp['wiki:'+move],before-1,mode);
  if(['hit','zero','invalid'].includes(mode)){assert.equal(rageRoll(s).length,1);assert.match(rageRoll(s)[0].text,/判定 100%：触发/);assert.match(rageEvents(s)[0].detail,/威力 150 ·/);}
  else assert.equal(rageRoll(s).length,0,mode);
 }
});

test('3291原1095免异记录后得先消费；前三回合免异不消次数，门到期后新二次耗尽才消费旧三次',()=>{
 let s=H.make(25294,{enemyId:3205,enemyMoves:[22053],aCounts:{immune:3}});s=H.turn(s,25294,22053);
 assert.equal(s.fighters[0].counts.immune,5);assert.equal(s.fighters[0].effects.gate.end,3);
 s=H.turn(s,'potion:pp');s=H.turn(s,'potion:pp');assert.equal(s.round,4);assert.equal(s.fighters[0].counts.immune,5);
 for(let i=0;i<3;i++){
  if(s.fighters[1].pp['wiki:22053']===0){s=H.turn(s,'potion:pp','potion:pp');assert.equal(s.fighters[0].counts.immune,5-i);}
  s=H.turn(s,'potion:pp',22053);const f=s.fighters[0],records=f.soulState.ailmentImmuneSources,star=records.find(e=>e.key.includes('1095')),legacy=records.filter(e=>e.kind==='legacy').reduce((n,e)=>n+e.count,0);
  assert.equal(f.counts.immune,4-i);assert.equal(star?.count??0,Math.max(0,1-i));assert.equal(legacy,i<2?3:2);assert.equal(f.ailments.睡眠,undefined);
 }
});
