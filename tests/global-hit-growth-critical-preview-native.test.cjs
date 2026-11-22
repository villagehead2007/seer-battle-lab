'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function battle(id,move){const a=store.species(id),b=store.species(2989),stats={maxHp:9000,atk:100,spa:100,def:5000,spd:5000,spe:1000};const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[move]),loadout(b,[])],seed:14,criticals:true,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});s.fighters[0].counts.criticalForceHit=2;s.fighters[0].stages.acc=6;return s;}
function observe(work){const old=E.WIKI.effectsEngine,rows=[];E.WIKI.effectsEngine={...old,run(phase,ops,c){const out=old.run(phase,ops,c);if(phase==='beforeCrit'&&c.a.side===0)rows.push({round:c.round,chance:c.chance,move:c.m.wikiId});return out;}};try{return{state:work(),rows};}finally{E.WIKI.effectsEngine=old;}}
test('696暴击强制命中预判读取本次命中的成长档位，预判不另增次数',()=>{
 const move=19247,p=store.species(3026).moves.find(m=>m.id===move).effectInstances.find(x=>x.id===696).args,result=observe(()=>{let s=battle(3026,move);s=E.resolveTurn(s,['wiki:'+move,'potion:pp']);return E.resolveTurn(s,['wiki:'+move,'potion:pp']);});for(const r of[1,2])assert.equal(result.rows.find(x=>x.round===r&&x.move===move).chance,Math.min(p[2]/100,1/16+(p[0]+(r-1)*p[1])/100));assert.equal(result.state.fighters[0].soulState.skillHitUses['wiki:'+move],2);
});
test('星皇1098预先判暴击可用本次第一档20%，命中后仅记一次',()=>{
 const result=observe(()=>E.resolveTurn(battle(3291,30381),['wiki:30381','potion:pp']));assert.equal(result.rows.find(x=>x.move===30381).chance,1/16+.2);assert.equal(result.state.fighters[0].fifthUses,1);assert.equal(result.state.fighters[0].soulState.skillHitUses['wiki:30381'],1);
});
