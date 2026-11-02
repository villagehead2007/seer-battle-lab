const fs=require('fs'),p='research/parallel-drafts/4489/',migrations=[];
for(const id of [4499,4500]){let h=fs.readFileSync('tests/helpers/'+id+'-battle.cjs','utf8').replace("require('../../dist/engine.js')","require('./overlay.cjs').engine").replace("require('../../research/"+id+"-reviewed-snapshot.json')","require('../../"+id+"-reviewed-snapshot.json')");fs.writeFileSync(p+'linked-'+id+'-helper.draft.cjs',h);const original=fs.readFileSync('tests/deployed-'+id+'-independent.test.cjs','utf8');let t=original.replace("require('./helpers/"+id+"-battle.cjs')","require('./linked-"+id+"-helper.draft.cjs')").replaceAll("require('../dist/","require('../../../dist/").replaceAll("require('../research/","require('../../");
const edits=id===4499?[
["assert.throws(()=>turn(s),/Q-N20-4489-003/);assert.equal(s.fighters[0].hp,1000);", "const restored=turn(s);assert.equal(restored.fighters[0].hp,1100);assert.equal(s.fighters[0].hp,1000);"],
["assert.throws(()=>turn(q),/Q-N20-4489-002/);assert.equal(q.fighters[1].hp,9000);", "const uncleared=turn(q);assert.ok(has(uncleared,1,'失体Ⅰ'));assert.equal(q.fighters[1].hp,9000);"],
["assert.throws(()=>turn(s,920031),/Q-N20-4489-003/);assert.equal(s.fighters[1].hp,9000);", "const selfLoss=turn(s,920031);assert.equal(selfLoss.fighters[1].hp,8900);assert.ok(selfLoss.damageEvents.some(e=>e.type==='fixed'&&e.sourceSide===1&&e.targetSide===1&&e.settledDamage===100));assert.equal(s.fighters[1].hp,9000);"],
["标记清除类别与回体技能禁疗来源沿原公共问题显式待答，不把空白当允许", "标记不可普通消回合且回体属独立回复，不受仅技能禁疗"],
["失体伤害来源影响输出倍率时沿公共003待答不猜100或150", "失体伤害归持有者自身，施加者输出倍率不影响100"]
]:[
["assert.throws(()=>turn(s,920031,920042),/Q-N20-4489-002/);assert.equal(s.fighters[0].hp,9000);", "const ordinaryClear=turn(s,920031,920042);assert.ok(has(ordinaryClear,'white'));assert.equal(ordinaryClear.fighters[0].hp,9000);assert.equal(s.fighters[0].hp,9000);"],
["白色龙鳞3回持续标记是否普通可消回合沿公共4489-002待答", "白色龙鳞3回特殊标记不可普通消回合"]
];for(const [before,after]of edits){if(t.split(before).length!==2)throw Error('migration '+id+' '+before.slice(0,30));t=t.replace(before,after);migrations.push({file:'tests/deployed-'+id+'-independent.test.cjs',before,after,reason:'仅按已答Q4489公共标记清除/独立回复/持有者受伤迁移；其它待实现条款和断言保留'});}fs.writeFileSync(p+'linked-'+id+'-public-regressions.draft.cjs',t);}
fs.writeFileSync(p+'linked-public-test-migrations.json',JSON.stringify(migrations,null,2)+'\n');
