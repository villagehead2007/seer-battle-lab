const fs=require('fs'),p='dist/range-souls.js';let s=fs.readFileSync(p,'utf8');if(s.includes('registry[1613]='))throw Error('exists');const at=s.lastIndexOf('\n});');s=s.slice(0,at)+`
registry[1613]={name:'海棠教皇·未明',sourceHash:'c6d33591',traits:{},hooks:{
roundStart(c){c.a.soulState.haitangFullRound=c.a.hp===c.a.stats.maxHp?c.round:0;},
beforeCrit(c){if(c.a.soulState.haitangFullRound===c.round)c.forceCrit=true;},
afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.haitangFullRound===c.round&&(c.settledDamage??c.dealt)>400)c.ailment(c.t,'冰封',c.a,false,false,null,{probabilityPercent:100});},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'id984',1,{amount:1},c.round+1);else{const healed=c.heal(c.a,c.a.stats.maxHp/3,'海棠教皇未满体回复')??0;if(healed>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,healed,'海棠教皇实际回复等量附伤','percent');}}
}};
`+s.slice(at);fs.writeFileSync(p,s);
