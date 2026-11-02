'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),file='dist/range-souls.js';let s=fs.readFileSync(file,'utf8');
const replacements=[
 ["healthRules.drainPercent(c,c.t.stats.maxHp/3,'混沌弱化免疫百分比吸取');if(!c.ppReductionBlocked(c.t))","healthRules.drainPercent(c,c.t.stats.maxHp/3,'混沌弱化免疫百分比吸取');if(c.a.hp<=0)return;if(!c.ppReductionBlocked(c.t))"],
 ["if(hurt>0&&c.t.hp>0)c.hurt(c.t,hurt,'混沌回合初弱化附伤'","if(hurt>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,hurt,'混沌回合初弱化附伤'"],
 ["const healed=c.heal(c.a,c.a.stats.maxHp/3,'觉醒不同类回复')??0;if(c.t.hp>0)c.hurt(c.t,healed,'觉醒不同类恢复量附伤','percent');","const healed=c.heal(c.a,c.a.stats.maxHp/3,'觉醒不同类回复')??0;if(c.a.hp<=0)return;if(c.t.hp>0)c.hurt(c.t,healed,'觉醒不同类恢复量附伤','percent');if(c.a.hp<=0)return;"],
 ["const healed=c.heal(c.a,c.a.stats.maxHp/3,'原版不同类流程末回复')??0;if(c.t.hp>0)c.hurt(c.t,healed,'原版不同类恢复量附伤','percent');","const healed=c.heal(c.a,c.a.stats.maxHp/3,'原版不同类流程末回复')??0;if(c.a.hp<=0)return;if(c.t.hp>0)c.hurt(c.t,healed,'原版不同类恢复量附伤','percent');if(c.a.hp<=0)return;"],
 ["for(let i=0;i<count&&c.t.hp>0;i++)if(!c.randomAllPvpAilments(1,1715)","for(let i=0;i<count&&c.a.hp>0&&c.t.hp>0;i++)if(!c.randomAllPvpAilments(1,1715)"]
];
for(const [before,after]of replacements){assert.equal(s.split(before).length-1,1,before);s=s.replace(before,after);}fs.writeFileSync(file,s);
console.log('仅修复本轮4075/4125实际复现的回复后死亡继续问题；公共治疗、临终效果和其他源不变。');
