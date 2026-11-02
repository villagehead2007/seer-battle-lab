'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const root='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/4608-before/';
for(const p of ['tests/next50-4608-skills.test.cjs','tests/deployed-4608.test.cjs'])fs.copyFileSync(p,root+p.split('/').at(-1)+'.before-1204-confirmation',fs.constants.COPYFILE_EXCL);
let p='tests/next50-4608-skills.test.cjs',s=fs.readFileSync(p,'utf8');
const lines=s.split(/\r?\n/),i=lines.findIndex(x=>x.startsWith("test('4608 191同源刷新4回合"));assert.ok(i>=0);
lines[i]="test('4608 191同源刷新4回合，1204剩1重授刷新2且不累加',()=>{let s=turn(make(e(191)));assert.equal(s.fighters[0].effects.reflect.end,4);s=turn(s);assert.equal(s.fighters[0].effects.reflect.end,5);assert.equal(s.fighters[0].effects.reflect.start,2);let q=turn(make(e(1204),{criticals:true}));q=turn(q,920030);assert.equal(q.fighters[0].counts.nextCrit,1);q=turn(q);assert.equal(q.fighters[0].counts.nextCrit,2);q=turn(q);assert.equal(q.fighters[0].counts.nextCrit,2);q=turn(q,920031);assert.equal(q.fighters[0].counts.nextCrit,2);for(let n=1;n>=0;n--){q=turn(q,920030);assert.equal(q.fighters[0].counts.nextCrit,n);assert.ok(q.turns.at(-1).events.some(v=>v.text.includes('致命一击')));}});";
lines.push("test('4608 1204同源刷新保留其他来源次数，控制未用不消耗',()=>{let s=make(e(1204),{criticals:true});s.fighters[0].counts.nextCrit=1;s=turn(s);assert.equal(s.fighters[0].counts.nextCrit,3);s=turn(s,920030);assert.equal(s.fighters[0].counts.nextCrit,2);s=turn(s);assert.equal(s.fighters[0].counts.nextCrit,3);s.fighters[0].ailments['疲惫']=s.round;s=turn(s,920030);assert.equal(s.fighters[0].counts.nextCrit,3);});");
fs.writeFileSync(p,lines.join('\n'));
p='tests/deployed-4608.test.cjs';s=fs.readFileSync(p,'utf8');
assert.ok(s.includes("4608真实浊沙之躯先制使长河旱海坠先出手"));
s=s.replace('4608真实浊沙之躯先制使长河旱海坠先出手红伤0，后手敌攻击不能倒灌反馈基数','4608真实先制加2与原生负3叠加，对照攻击负4时先手反馈0且不读取未来红伤');
const before="s.rng=0;s.fighters[0].hp=1000;for(const f of s.fighters)";assert.equal(s.split(before).length,2);
s=s.replace(before,"s.rng=0;assert.equal(s.moveDefinitions[key(37150)].priority,-3);s.moveDefinitions[key(10127)].priority=-4;/* Explicit opponent initiative fixture; original 37150 priority is preserved. */s.fighters[0].hp=1000;for(const f of s.fighters)");
fs.writeFileSync(p,s);
console.log('1204 refresh/consumption state assertions added; opponent initiative fixture corrected, original failure retained.');

