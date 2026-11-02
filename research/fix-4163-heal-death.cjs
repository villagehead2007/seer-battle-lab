'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),path='dist/range-souls.js';let s=fs.readFileSync(path,'utf8');
const before="healthRules.drainPercent(c,c.shieldValue(c.a)*.7,'逆魂护盾70%吸取');if(c.t.hp>0)",after="healthRules.drainPercent(c,c.shieldValue(c.a)*.7,'逆魂护盾70%吸取');if(c.a.hp<=0)return;if(c.t.hp>0)";
assert.equal(s.split(before).length-1,1);s=s.replace(before,after);
const condition='if(id===1389&&shield&&c.t.hp>0)';assert.equal(s.split(condition).length-1,1);s=s.replace(condition,'if(id===1389&&shield&&c.a.hp>0&&c.t.hp>0)');fs.writeFileSync(path,s);
console.log('只限制当前两魂印当前持有者存活时继续后续反应；回复后死亡立即停止。');
