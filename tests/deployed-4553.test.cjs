'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4553-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];
function atStart(s,fn){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='roundStart'&&c.a.side===0)fn(c);}};try{return turn(s);}finally{E.SOULS=old;}}
test('4553原生17技能与1763入场魂印完整执行，真实混乱保留并用实际成功种子验证PP',()=>{
 for(const m of source.moves){let found=false;for(let seed=1;seed<=12&&!found;seed++){
  const b=structuredClone(source);b.id=920753;b.souls=[];const fifth=source.moves.find(x=>x.fifth),regular=source.moves.filter(x=>!x.fifth),load=m.fifth?[...regular.slice(0,4),m]:[m,...regular.filter(x=>x.id!==m.id).slice(0,3),fifth];
  const s=E.createBattle({wikiSnapshots:[source,b],wikiLoadouts:[load.map(x=>x.id),load.map(x=>x.id)],criticals:false,builds:[{overrides:{maxHp:9000,spe:500}},{overrides:{maxHp:9000,spe:100}}]});s.rng=seed;
  assert.equal(s.fighters[0].ailments['混乱'],2);assert.equal(s.fighters[1].ailments['混乱'],2);assert.equal(s.fighters[0].soulState.beiniaoCaptureArmed,true);assert.equal(s.fighters[0].soulState.beiniaoRecorded,undefined);
  const o=E.resolveTurn(s,[key(m.id),key(load[0].id)]);if(o.fighters[0].pp[key(m.id)]===m.pp-1){found=true;assert.ok(o.fighters[0].hp>0);}
 }assert.ok(found,'源技能实际可使用 '+m.id);}
});
test('4553记录异常每次重抽2或3且记录不消费，旧时长不继承，免疫失败真实封属',()=>{
 const seen=new Set;for(let seed=0;seed<24;seed++){const s=make({moveId:10004,index:-1},{soul:1763,seed});const o=atStart(s,c=>{c.clearAilment(c.a,'混乱');c.clearAilment(c.t,'混乱');c.a.soulState.beiniaoCaptureArmed=false;c.a.soulState.beiniaoRecorded={name:'失明',duration:9};});const n=o.fighters[1].ailments['失明'];assert.ok([2,3].includes(n));seen.add(n);assert.equal(o.fighters[0].soulState.beiniaoRecorded.duration,9);}assert.deepEqual([...seen].sort(),[2,3]);
 const s=make({moveId:10004,index:-1},{soul:1763});const o=atStart(s,c=>{c.clearAilment(c.a,'混乱');c.clearAilment(c.t,'混乱');c.a.soulState.beiniaoRecorded={name:'失明'};c.t.counts.immune=1;});assert.equal(o.fighters[1].ailments['失明'],undefined);assert.equal(o.fighters[1].effects.statusBlock.end,2);assert.equal(o.fighters[1].counts.immune,0);
});
test('4553原生战阶按双方剩余时长含当前计总数，五不清六才清，弱化按实际解除项数',()=>{
 for(const n of [5,6]){const s=make({moveId:20496,index:-1},{soul:1763,hp:1000});const o=atStart(s,c=>{c.clearAilment(c.a,'混乱');c.clearAilment(c.t,'混乱');c.a.soulState.beiniaoCaptureArmed=false;c.a.ailments['失明']=2;c.t.ailments['失明']=n-2;});assert.equal(o.fighters[0].hp,1000+n*60);assert.equal(o.fighters[1].stages.atk,n===6?-2:0);assert.equal(o.fighters[0].soulState.beiniaoSpringCry?.removed,n===6?2:undefined);assert.equal(!!o.fighters[0].ailments['失明'],n===5);}
});
test('4553命中封锁全部技能条款但1763独立用攻后异常照常，控制与零PP不触发',()=>{
 for(const mode of ['seal','control','pp']){const s=make(e(1794),{soul:1763,hp:1000});timer(s,0,'技能命中效果失效');if(mode==='pp')s.fighters[0].pp[key(s.auditMoveId)]=0;
  if(mode==='pp'){assert.throws(()=>turn(s),/PP|技能/);continue;}
  const o=atStart(s,c=>{c.clearAilment(c.a,'混乱');c.clearAilment(c.t,'混乱');c.a.soulState.beiniaoCaptureArmed=false;c.a.soulState.beiniaoRecorded={name:'失明'};if(mode==='control')c.a.ailments['疲惫']=3;});
  assert.equal(o.fighters[0].counts.nextAttackReductionUses??0,0);assert.equal(!!o.fighters[1].ailments['失明'],mode==='seal');assert.equal(o.fighters[0].hp,mode==='seal'?1120:1180);
 }
});
test('4553 1794失明与整招无效合并只补偿一次，无行动不补，818封锁不反馈',()=>{
 for(const mode of ['miss','blocked','both','control']){const s=make(e(1794),{hit:false,hp:1000});if(mode!=='blocked')s.fighters[0].ailments[mode==='control'?'疲惫':'失明']=3;if(mode==='blocked'||mode==='both')s.fighters[0].counts.nextSkillInvalid=1;const o=turn(s);assert.equal(o.fighters[0].hp,mode==='control'?1000:5500);assert.equal(o.fighters[0].counts.nextAttackReductionUses??0,mode==='control'?0:1);}
 const s=make(e(818),{aStats:{spe:1}});timer(s,0,'技能命中效果失效');const o=turn(s,s.auditMoveId,920040);assert.equal(o.damageEvents.filter(x=>x.targetSide===1&&x.type==='true').length,0);
});
