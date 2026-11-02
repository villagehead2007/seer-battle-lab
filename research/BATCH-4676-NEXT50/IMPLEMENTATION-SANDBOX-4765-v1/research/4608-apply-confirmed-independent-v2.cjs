'use strict';
const fs=require('fs'),assert=require('assert/strict');
assert.ok(!fs.existsSync('research/.next50-batch-validation.lock'));
assert.equal(JSON.parse(fs.readFileSync('research/BATCH-4509-NEXT50-STATUS.json')).formalCompletedCount,20);
const replace=(p,a,b)=>{const t=fs.readFileSync(p,'utf8');assert.equal(t.split(a).length,2,'exactly one match: '+p+' '+a.slice(0,90));fs.writeFileSync(p,t.replace(a,b));};
// The first script stopped on its uniqueness check after updating only1813.
// 4612 has an identical old diagnostic string: restrict this edit to4608.
{
 const p='dist/effect-registry.js',t=fs.readFileSync(p,'utf8'),start=t.indexOf('// 4608 source-bound legacy 1327;'),end=t.indexOf('// 4612 source-bound legacy 1327;');assert.ok(start>=0&&end>start);
 const a="if(loss===Math.floor(nominal)&&healed===Math.floor(nominal)){c.addShield(c.a,Math.floor(nominal));return;}throw Error('Q-N50-4608-003：1327吸取与回复已执行，附盾基数待确认');",block=t.slice(start,end);assert.equal(block.split(a).length,2);fs.writeFileSync(p,t.slice(0,start)+block.replace(a,'c.addShield(c.a,Math.floor(nominal));')+t.slice(end));
}
replace('dist/range-effects.js',"if(c.a.counts.attackNullify>0)throw Error('Q-N50-4511-006：972已有次数再授待确认');c.a.counts.attackNullify=p[0];c.a.soulState.saffron972=true;","c.grantAttackNullify(c.a,p[0],'972');c.a.soulState.saffron972=true;");
replace('dist/range-effects.js',"if(id===191&&c.on(c.a,'reflect')||id===1204&&c.a.counts.nextCrit>0)throw Error('Q-N50-4511-006：4608免反/必暴重复授予待确认');","if(id===1204&&c.a.counts.nextCrit>0)throw Error('Q-N50-4511-006：4608必暴重复授予待直接确认');");
replace('dist/souls.js',"if(on(t,'reflect')&&t.effects.reflect.saffron191&&(t.counts.immune>0||t.soulState.immunity1757Charges?.length||t.soulState.oracle2059Charges?.length||on(t,'免异常')||on(t,'控制异常反弹')&&statusRules.isControl(k)))throw Error('Q-N50-4511-006：4608回合反弹与其他免异混源待确认');",'');
replace('dist/souls.js',"if(e.saffron1924&&n!==e.amount&&!e.qualifiedDamageBasis4608)throw Error('Q-N50-4521-002：1924回复后等量固定伤害基数待确认');",'');
replace('dist/souls.js',"if(immunitySource.kind==='1778'&&--t.soulState.jiegeNullify1778===0)","if(immunitySource.kind==='972'&&!t.soulState.attackNullifySources.some(e=>e.kind==='972'))delete t.soulState.saffron972;if(immunitySource.kind==='1778'&&--t.soulState.jiegeNullify1778===0)");
console.log('4608 confirmed independent branches applied; 741/929/1204 and state validation remain pending.');
