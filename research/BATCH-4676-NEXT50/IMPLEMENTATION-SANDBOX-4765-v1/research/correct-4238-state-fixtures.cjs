'use strict';const fs=require('fs'),assert=require('node:assert/strict'),p='tests/deployed-4238-partial.test.cjs';let s=fs.readFileSync(p,'utf8');function replace(a,b){assert.ok(s.includes(a),a);s=s.replaceAll(a,b);}
replace("assert.ok([Math.floor(base*1.9),Math.floor(base*1.9)+1].includes(sum(o)))","assert.equal(base,16);assert.equal(sum(o),32)");
replace("'免疫能力下降'","'免弱'");replace("'weakLock'","'弱化不可解除反转'");replace("H.op(z,411,[100,0,0],920040)","H.op(z,33,[],920040)");
replace("H.op(s,29,[100],920040);assert.equal(turn(s,920031,920040).fighters[0].counts.luoAttackReduction,1)","H.op(s,29,[100],920040);s.moveDefinitions[key(920040)].kind='status';s.moveDefinitions[key(920040)].power=0;assert.equal(turn(s,920031,920040).fighters[0].counts.luoAttackReduction,1)");
replace("assert.equal(events(o)[0].crit,n>0)","assert.equal(o.turns.at(-1).events.some(e=>e.kind==='damage'&&e.text.includes('致命一击')),n>0)");
fs.writeFileSync(p,s);console.log('Fixture-only correction: native timer keys, actual clear33 instead of consecutive-power411, fixed-only status carrier, real crit log, pre-rounding exact32/16');
