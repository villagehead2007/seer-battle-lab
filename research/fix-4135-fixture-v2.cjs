'use strict';const fs=require('fs'),assert=require('node:assert/strict'),p='tests/deployed-4135-partial.test.cjs';fs.copyFileSync(p,'research/4135-independent-v1-original-tests.cjs.txt');let s=fs.readFileSync(p,'utf8');function change(a,b){assert.ok(s.includes(a),a);s=s.replace(a,b);}
change("const out=[true,false].map(first=>damage(turn(make(pick(40)[0],{aStats:{spe:first?900:1}})),'attack'));","const out=[true,false].map(first=>{const s=make(pick(40)[0],{aStats:{spe:first?900:1}});s.moveDefinitions[key(910041)].priority=s.moveDefinitions[key(19627)].priority;return damage(turn(s),'attack');});");
change('o.fighters[0].effects.id984.start,2','o.fighters[0].effects[\'攻击先制\'].start,2');change('o.fighters[0].effects.id984.amount,1','o.fighters[0].effects[\'攻击先制\'].amount,1');
change("make(pick(544)[0]);for(const k","make(pick(544)[0],{seed:1});for(const k");change('o.fighters[1].pp[key(910031)],98','o.fighters[1].pp[key(910043)],98');
// Existing public barrier category absorbs fixed/percent; a normal attack must not consume it.
change('1446真实500护罩被攻击/固定/主动清除耗尽各触发一次全弱','1446真实500护罩由固定/百分比/主动清除耗尽各触发一次全弱，普通攻击不消耗');
change("['attack','fixed','consume','weakImmune']","['percent','fixed','consume','weakImmune']");
change("else{o.fighters[1].stats.atk=9999;o=turn(o,910031,910040);}","else{op(o,28,[10]);o=turn(o,910031,910042);}");
change("assert.equal(o.fighters[1].stages.atk,0);});","assert.equal(o.fighters[1].stages.atk,0);let a=turn(make(pick(1446)[0]));a.fighters[1].stats.atk=9999;a=turn(a,910031,910040);assert.equal(a.fighters[0].suitState.barrier,500);assert.ok(a.fighters[0].hp<9000);assert.equal(a.fighters[1].stages.atk,0);});");
fs.writeFileSync(p,s);console.log('fixed fixture-specific expectations; source/runtime unchanged');
