const fs=require('fs');fs.writeFileSync('research/3867-user-confirmed-rules.json',JSON.stringify({species:3867,confirmedAt:new Date().toISOString(),source:'human-user',answer:'后；是；吸取前；是',rules:{souls:[1139,1447],timing:'攻击结算后，MISS和免攻零伤仍触发',branch:'攻击者有无提升按吸取前状态判断，吸强成功不再进入无强化石化分支',damage:'等量固伤按实际回复量，包含缺血截断和禁疗'},sourceHashes:['82ce05ed','bb368e84']},null,2)+'\n');
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8');s=s.replace("add(1708,'afterHit',(c,p)=>c.stage(c.t,-p[1]),[[1,10],[0,10]]);","add(1708,'beforeUse',(c,p)=>{if(c.a.roundDamageTaken===0)c.timed(c.t,'id984',p[0],{amount:-p[1]},c.round+1);},[[1,10],[0,10]]);");
const i=s.lastIndexOf('\n});');s=s.slice(0,i)+`
metadata[2390]={info:'消除对手回合类效果，消除成功则下{0}回合对手攻击技能无法造成伤害且命中效果失效',args_num:1};
metadata[1885]={info:'吸取对手最大体力的1/{0}，若对手免疫百分比伤害则{1}%令对手{2}',args_num:3};
metadata[2228]={info:'{0}回合内对手造成的固定伤害和百分比伤害减少{1}%',args_num:2};
add(2390,'afterHit',(c,p)=>{if(c.clear(c.t))c.timed(c.t,'attackBlock',p[0],{},c.round+1);},[turns]);
add(1885,'afterHit',(c,p)=>{const immune=c.damageImmune(c.t,'percent');healthRules.drainPercent(c,c.t.stats.maxHp/p[0],c.m.name+'吸取');if(immune&&statusRoll(c,p[1]))c.ailment(c.t,'石化',c.a);},[[1,9999],pct,[9,9]]);
add(2228,'afterHit',(c,p)=>c.timed(c.t,'固定百分比减伤输出',p[0],{fraction:p[1]/100}),[turns,pct]);
`+s.slice(i);fs.writeFileSync(p,s);
p='dist/souls.js';s=fs.readFileSync(p,'utf8').replace("return hurt(t,n*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比增伤')", "return hurt(t,n*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比减伤输出')?1-a.effects['固定百分比减伤输出'].fraction:1)*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比增伤')");fs.writeFileSync(p,s);
