'use strict';const fs=require('node:fs'),assert=require('node:assert/strict'),path='research/zero-damage-hit-2026-10-29/assertion-update-plan.json',plan=[];
function add(file,scope,before,after,reason){const s=fs.readFileSync(file,'utf8'),start=scope?s.indexOf(scope):0;assert.ok(start>=0,scope);const end=scope?s.indexOf('\ntest(',start+1):-1,part=s.slice(start,end<0?s.length:end);assert.ok(part.includes(before),file+' '+before);plan.push({file,scope,before,after,reason});}
add('tests/helpers/assert-597-nominal-after-kill.cjs',null,"expected=['heal-ban','attack-immune'].includes(mode)?1000:","expected=mode==='heal-ban'?1000:",'命中免攻仍执行持续吸取及理论回复');
add('tests/helpers/assert-597-nominal-after-kill.cjs',null,'else assert.equal(o.fighters[1].hp,9000);',"else assert.equal(o.fighters[1].hp,mode==='attack-immune'?9000-9000/x.args[1]:9000);",'仅攻击免疫不免疫百分比吸取');
add('tests/deployed-3575-state.test.cjs','3575 回合923先手吸150','assert.equal(turn(imm).fighters[0].hp,1000)','assert.equal(turn(imm).fighters[0].hp,1150)','零伤命中仍授用招吸取且理论回复150');
add('tests/deployed-3580-mechanisms.test.cjs','3580 固伤29追加75',"timer(immune,1,'鬼王攻击免疫');assert.equal(turn(immune).fighters[1].hp,9000)","timer(immune,1,'鬼王攻击免疫');assert.equal(turn(immune).fighters[1].hp,8925)",'仅攻击免疫保留75固定附伤');
add('tests/deployed-3580-mechanisms.test.cjs','3580 固伤29追加75','攻击免疫取消本招固伤','攻击免疫仍执行本招固伤','更新被新规则覆盖的测试标题');
add('tests/deployed-3580-mechanisms.test.cjs','3580 低伤1018','assert.deepEqual(hp(f),[9000,9000])','assert.deepEqual(hp(f),[9000,8925])','免攻保留75固伤，低伤反馈按实际发生伤害执行');
add('tests/deployed-3584-mechanisms.test.cjs','3584 后手939','assert.deepEqual(hp(turn(im)),[1000,9000])','assert.deepEqual(hp(turn(im)),[4000,9000])','命中后吸取伤害免疫但理论回复3000');
add('tests/deployed-3586-mechanisms.test.cjs','3586 护盾1017','assert.equal(o.fighters[0].suitState.shield,400)','assert.equal(o.fighters[0].suitState.shield,0)','已命中执行耗盾转固，固伤仍可被全伤免疫');
add('tests/deployed-3586-mechanisms.test.cjs','3586 减伤811','assert.equal(turn(im).fighters[0].counts.nextDamageReduction,undefined)','assert.equal(turn(im).fighters[0].counts.nextDamageReduction,0)','已命中仍登记按本次0伤计算的0减伤');
add('tests/deployed-3592-extra.test.cjs','3592 固伤29真实追加50',"timer(s,1,'鬼王攻击免疫');assert.equal(turn(s).fighters[1].hp,9000)","timer(s,1,'鬼王攻击免疫');assert.equal(turn(s).fighters[1].hp,8950)",'仅攻击免疫保留50固定附伤');
add('tests/deployed-3613-new.test.cjs','3613 1680无异常',"timer(s,1,'鬼王攻击免疫');assert.equal(turn(s).fighters[1].hp,9000)","timer(s,1,'鬼王攻击免疫');assert.equal(turn(s).fighters[1].hp,8800)",'仅攻击免疫保留200真实附伤；有异常及封招条件仍检查');
add('tests/deployed-3613-reused.test.cjs','3613 回复1按实际','assert.deepEqual(hp(turn(immune)),[1000,9000])','assert.deepEqual(hp(turn(immune)),[e.id===870?1100:1000,9000])','吸血1按0红伤仍回0，870固定吸取理论回复100');
add('tests/helpers/assert-939-nominal-heal.cjs',null,'assert.equal(stopped.fighters[0].hp,1000);assert.equal(stopped.fighters[1].hp,200);','assert.equal(stopped.fighters[0].hp,4000);assert.equal(stopped.fighters[1].hp,0);','攻击被免疫仍命中，939吸取3000并理论回复3000');
add('tests/deployed-3705-independent.test.cjs','3705 1425七参数','assert.equal(z.fighters[0].stages.spe,0)','assert.equal(z.fighters[0].stages.spe,2)','已命中0伤低于300，按真实参数速度+2');
fs.writeFileSync(path,JSON.stringify({confirmation:'research/zero-damage-hit-2026-10-29/confirmation.json',status:'prepared-not-applied',plan},null,2)+'\n');console.log({prepared:plan.length,applied:false});
