'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
let souls=fs.readFileSync('dist/range-souls.js','utf8');
const start=souls.indexOf("for(const [id,hash,denominator]of [[1362,"),end=souls.indexOf('\n',start);assert.ok(start>0&&end>start);
souls=souls.slice(0,start)+`for(const [id,hash,denominator]of [[1362,'56119652',3],[1787,'18701ac4',2]])registry[id]={name:id===1362?'愈灵·克丽娅':'愈灵·克丽娅·强化',sourceHash:hash,
 traits:{attackReduction:f=>f.soulState.cleriaReduce?.5:0},hooks:{
 roundStart(c){c.a.soulState.cleriaStartHp=c.a.hp;c.a.soulState.cleriaReduce=c.on(c.a,'克丽娅次回合减攻伤')||c.on(c.a,'克丽娅重生减攻伤');},
 combatEnd(c){if(c.a.hp<=0)return;const before=c.a.hp,low=before<c.a.stats.maxHp/2;if(before<c.a.soulState.cleriaStartHp)c.heal(c.a,c.a.stats.maxHp/denominator,'克丽娅战阶回复');if(low)c.timed(c.a,'克丽娅次回合减攻伤',1,{fraction:.5},c.round+1);},
 death(c){const st=c.a.soulState;if(st.cleriaRebirthAttempted||st.vanished)return;st.cleriaRebirthAttempted=true;if(c.random()>=.5)return;
  c.a.hp=c.a.stats.maxHp;c.restorePP(c.a,Infinity);c.timed(c.a,'克丽娅重生减攻伤',3,{fraction:.5});st.cleriaReduce=true;c.emit('克丽娅唯一重生判定成功，恢复满体力与全部PP，原有状态保留。');
 }
}};`+souls.slice(end);fs.writeFileSync('dist/range-souls.js',souls);
let effects=fs.readFileSync('dist/range-effects.js','utf8');
const a=effects.indexOf("add(634,'beforeDamage'"),b=effects.indexOf('\n',a);assert.ok(a>0&&b>a);
effects=effects.slice(0,a)+`add(634,'beforeDamage',c=>{c.a.soulState.cleria634Before={round:c.round,move:c.m.id,higher:c.a.hp>c.t.hp};},[[1,1],pct],undefined,undefined,{afterAttack(c,p){const b=c.a.soulState.cleria634Before;if(b?.round===c.round&&b.move===c.m.id&&b.higher)c.heal(c.a,c.hpLoss*p[1]/100,c.m.name+'伤害回复');}});`+effects.slice(b);fs.writeFileSync('dist/range-effects.js',effects);
let engine=fs.readFileSync('dist/souls.js','utf8');
const old="if(m.kind!=='status'&&!blocked&&on(t,'概率闪避失败清PP')){const e=t.effects['概率闪避失败清PP'];ppDodge=!alwaysHit&&rng(s)<e.chance/100;if(!ppDodge){const pool=a.moves.slice();for(let i=0;i<e.count&&pool.length;i++)a.pp[pool.splice(Math.floor(rng(s)*pool.length),1)[0]]=0;}}";assert.ok(engine.includes(old));
engine=engine.replace(old,`if(m.kind!=='status'&&!blocked&&on(t,'概率闪避失败清PP')){const e=t.effects['概率闪避失败清PP'];
 if(e.rollRound!==r){e.rollRound=r;e.rolledDodge=rng(s)<e.chance/100;e.failureRound=0;}
 ppDodge=!alwaysHit&&e.rolledDodge;
 if(!ppDodge&&e.failureRound!==r){e.failureRound=r;const pool=a.moves.slice();for(let i=0;i<e.count&&pool.length;i++)a.pp[pool.splice(Math.floor(rng(s)*pool.length),1)[0]]=0;}
}`);fs.writeFileSync('dist/souls.js',engine);
let wiki=fs.readFileSync('dist/wiki-support.js','utf8');const anchor='const reviewed={';assert.ok(wiki.includes(anchor));
const s=require('./4135-reviewed-snapshot.json'),binding={pet:'f7781539',souls:{1362:'56119652',1787:'18701ac4'},fifths:[34633,36521],skills:s.moves.map(m=>m.id)};
wiki=wiki.replace(anchor,anchor+'4135:'+JSON.stringify(binding)+',');fs.writeFileSync('dist/wiki-support.js',wiki);
console.log('4135用户028-032与追加第五精确授权已接入，待专项及公共1235影响回归/认证。');
