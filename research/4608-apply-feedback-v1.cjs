'use strict';
const fs=require('fs'),assert=require('assert/strict');
assert.ok(!fs.existsSync('research/.next50-batch-validation.lock'));
const replace=(p,a,b)=>{const t=fs.readFileSync(p,'utf8');assert.equal(t.split(a).length,2,'unique source marker '+a.slice(0,90));fs.writeFileSync(p,t.replace(a,b));};
replace('dist/souls.js',"incomingSettledDamage:(type=null)=>", "incomingOpponentRedDamage:()=>(s.damageEvents??[]).filter(e=>e.round===r&&e.sourceSide===t.side&&e.targetSide===a.side&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0),incomingSettledDamage:(type=null)=>");
replace('dist/souls.js',"function damage(a,t,m,rage,full,typedBase=null,cachedCrit=null,forceHit=false){", "function damage(a,t,m,rage,full,typedBase=null,cachedCrit=null,forceHit=false){\n      const feedback4608=!rage&&typedBase===null&&(m.wikiId??m.id)===37150&&m.revision==='seerapi:c7158d26'&&(m.operations??[]).some(op=>op.effectId===929&&op.index===0&&JSON.stringify(op.params)==='[2]')&&!skillContext(a,t,m).hitEffectsDisabled?context(a,t,m).incomingOpponentRedDamage()*2:null;");
replace('dist/souls.js',"if(typedBase!==null)modifier=statusRules.incomingMultiplier(t,r)","if(typedBase!==null||feedback4608!==null)modifier=statusRules.incomingMultiplier(t,r)");
replace('dist/souls.js',"let base=typedBase??(Math.floor", "let base=feedback4608??typedBase??(Math.floor");
replace('dist/souls.js',"const roll=typedBase===null?85+Math.floor(rng(s)*16):100,stab=typedBase===null?(effectContext.stab??E.sameTypeBonus(m.type,a.type,s.typeChart)):1;", "const roll=typedBase===null&&feedback4608===null?85+Math.floor(rng(s)*16):100,stab=typedBase===null&&feedback4608===null?(effectContext.stab??E.sameTypeBonus(m.type,a.type,s.typeChart)):1;if(feedback4608!==null)affinity=1;");
// Replace the formula operands in both initial computation and recalculation.
{
 const p='dist/souls.js',t=fs.readFileSync(p,'utf8'),needle="base*stab*affinity*(crit?2:1)",count=t.split(needle).length-1;assert.equal(count,3);fs.writeFileSync(p,t.split(needle).join("base*stab*affinity*(feedback4608!==null?1:crit?2:1)"));
}
replace('dist/range-effects.js',"const total=['attack','fixed','percent','true'].reduce((n,k)=>n+c.damageTotal(c.a,k),0);if(total>0)throw Error('Q-N50-4608-002：929反馈窗口、类型与等量基数待确认');", "if(c.m.revision!=='seerapi:c7158d26'||JSON.stringify(p)!=='[2]')throw Error('4608 929 runtime source mismatch');c.heal(c.a,c.settledDamage??c.dealt??0,c.m.name+'完整反馈红伤等量回复','skill');");
console.log('4608/37150/929 replaces offensive damage base with twice current-round opponent red damage; ordinary incoming mitigation and attack channels retained; healing uses complete settled feedback red.');
