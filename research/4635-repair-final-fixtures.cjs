'use strict';const fs=require('node:fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/';
let p='tests/next50-4635-skills.test.cjs',s=fs.readFileSync(p,'utf8');fs.copyFileSync(p,base+'4635-before/skills-before-final-fixture-repair.cjs');
function rep(a,b){assert.ok(s.includes(a));s=s.replace(a,b);}
rep("z.moveDefinitions[k].power=100;}const out=turn(z)","z.moveDefinitions[k].power=100;z.moveDefinitions[k].type=H.source.moves.find(m=>m.id===10086).type;}const out=turn(z)");
rep("assert.equal(s.fighters[1].counts.nextAttackInvalid,1);qualified(s,c=>H.E.WIKI.effectsEngine.registry[933]","assert.equal(s.fighters[1].counts.nextAttackInvalid,1);s.fighters[0].pp[key(920031)]=99;qualified(s,c=>H.E.WIKI.effectsEngine.registry[933]");
rep("timer(s,0,'能力下降状态无法消除')","timer(s,0,'弱化不可解除反转')");fs.writeFileSync(p,s);
p='tests/range-rules.test.cjs';s=fs.readFileSync(p,'utf8');fs.copyFileSync(p,'research/zero-damage-hit-2026-10-29/range-rules.test.cjs.before');
const old='46抵挡不被属性招消费，免攻击取消同招附固',name='46抵挡不被属性招消费，最新零伤命中规则保留同招80固定附伤';
rep(old,name);const start=s.indexOf("test('"+name),end=s.indexOf('\n',start);let line=s.slice(start,end);assert.ok(line.includes('assert.equal(s.fighters[0].hp,9999)'));line=line.replace('assert.equal(s.fighters[0].hp,9999)','assert.equal(s.fighters[0].hp,9919);assert.ok(s.damageEvents.some(e=>e.type===\'fixed\'&&e.targetSide===0&&e.settledDamage===80))');s=s.slice(0,start)+line+s.slice(end);fs.writeFileSync(p,s);
const cp=base+'4635-user-confirmations.json',c=JSON.parse(fs.readFileSync(cp,'utf8'));c.failedRuns.push({proof:'research/4635-final-confirmed-v1-result.json',tests:203,pass:199,fail:4,reason:'3个新增夹具设置错误：属性招改物攻未同步属性、耗尽PP后未恢复对照招、错误锁负键；1个旧免攻取消附固断言被用户新统一规则覆盖。原断言及文件保留，改为实际80固定附伤断言。'});fs.writeFileSync(cp,JSON.stringify(c,null,2)+'\n');
