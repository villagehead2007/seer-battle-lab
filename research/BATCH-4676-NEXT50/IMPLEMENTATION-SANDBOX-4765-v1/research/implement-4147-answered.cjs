'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
let soul=fs.readFileSync('dist/range-souls.js','utf8');
const first=soul.indexOf('registry[1376]={name:');assert.ok(first>0);let end=soul.indexOf('\n',first),base=soul.slice(first,end);
base=base.replace("partial:true,unimplemented:['Q-A60-4147-033：低体等量回复基数在理论/完整/实际不相同时'],",'');
const from=base.indexOf('const amount=c.t.stats.maxHp*.3,'),until=base.indexOf('},combatEnd',from);assert.ok(from>0&&until>from);
base=base.slice(0,from)+"const loss=c.hurt(c.t,c.t.stats.maxHp*.3,'月冕冰封未触发固定','fixed');if(c.a.hp<c.a.stats.maxHp*.3)c.heal(c.a,loss,'月冕低体实际HP损失等量回复');"+base.slice(until);
soul=soul.slice(0,first)+base+soul.slice(end);
const second=soul.indexOf('registry[2110]={name:');end=soul.indexOf('\n',second);let enhanced=soul.slice(second,end);
enhanced=enhanced.replace("partial:true,unimplemented:['Q-A60-4147-034：先制技能判据、奇数减半及混合修正'],",'');
const a=enhanced.indexOf('beforeIncomingAttack(c){'),b=enhanced.indexOf('combatEnd(c){',a);assert.ok(a>0&&b>a);
enhanced=enhanced.slice(0,a)+`beforeIncomingAttack(c){if(!c.celestials.some(x=>x.name==='血月'&&x.side===c.a.side&&x.start<=c.round&&x.end>=c.round)&&c.priorityValueOf(c.t)>0)c.reduction=1-(1-c.reduction)*.5;},
opponentPriority(c){if(c.m.kind!=='status'||c.priority<=0||c.celestials.some(x=>x.name==='寒月'&&x.side===c.a.side&&x.start<=c.round&&x.end>=c.round))return;const base=c.m.priority??0;c.priority+=Math.ceil(base/2)-base;},`+enhanced.slice(b);
soul=soul.slice(0,second)+enhanced+soul.slice(end);fs.writeFileSync('dist/range-souls.js',soul);
let rules=fs.readFileSync('dist/range-effects.js','utf8'),last=rules.lastIndexOf('\n});');assert.ok(last>0);
rules=rules.slice(0,last)+`
// User Q035/Q036 retain the unmodified SeerAPI effect templates and source parameters.
metadata[1633]={info:'使自身体力百分比与对手体力百分比对调，自身体力百分比高于对手时{0}%令对手{1}',args_num:2};
add(1633,'afterHit',(c,p)=>{if(c.a.hp<=0||c.t.hp<=0)return;const own=c.a.hp,enemy=c.t.hp,am=c.a.stats.maxHp,tm=c.t.stats.maxHp,higher=own*tm>enemy*am;
 c.a.hp=Math.max(1,Math.min(am,Math.ceil(enemy*am/tm)));c.t.hp=Math.max(1,Math.min(tm,Math.ceil(own*tm/am)));
 c.emit('双方按交换前体力百分比直接调整HP，向上取整并至少保留1HP。');if(higher&&statusRoll(c,p[0]))c.ailment(c.t,'失明',c.a);
},[[100,100],[20,20]]);
metadata[2422]={info:'伤害结算时额外将自身的护盾值计入攻击、特攻值',args_num:0};
add(2422,'beforeDamage',c=>{c.attackAddition=(c.attackAddition??0)+c.shieldValue(c.a);});
`+rules.slice(last);fs.writeFileSync('dist/range-effects.js',rules);
let engine=fs.readFileSync('dist/souls.js','utf8');
const expression="effectContext.attackOverride??(E.SOULS.trait(a,'equalAttackStats')?Math.max(effective(a,'atk'),effective(a,'spa')):effective(a,attackStat))";
assert.equal(engine.split(expression).length-1,2);engine=engine.replaceAll(expression,'('+expression+')+(effectContext.attackAddition??0)');
engine=engine.replace("${effectContext.attackOverride??effective(a,attackStat)} / 防御",'${attack} / 防御');fs.writeFileSync('dist/souls.js',engine);
const s=require('./4147-reviewed-snapshot.json'),binding={pet:'a6a942e',souls:{1376:'f8f409d4',2110:'d9891927'},fifths:[34699,38437],skills:s.moves.map(m=>m.id)};
let wiki=fs.readFileSync('dist/wiki-support.js','utf8');assert.ok(wiki.includes('const reviewed={'));wiki=wiki.replace('const reviewed={','const reviewed={4147:'+JSON.stringify(binding)+',');fs.writeFileSync('dist/wiki-support.js',wiki);
const path='tests/helpers/4147-battle.cjs';if(!fs.existsSync('research/4147-helper-before-answers.txt'))fs.copyFileSync(path,'research/4147-helper-before-answers.txt');
let helper=fs.readFileSync(path,'utf8');assert.ok(helper.includes('unknown=[1633,2422]'));helper=helper.replace('unknown=[1633,2422]','unknown=[]');fs.writeFileSync(path,helper);
console.log('4147按用户033-036与原精确双第五授权实现；尚需真实状态专项和完整验收。');
