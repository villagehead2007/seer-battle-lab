'use strict';
// Integration draft only. No shared files are modified.
const health=require('../../../dist/health-rules.js');
module.exports={name:'梅林',sourceHash:'3a599098',traits:{},hooks:{
 roundStart(c){c.a.soulState.merlinAttackOut=0;c.a.soulState.merlinAttackIn=0;},
 damageDealt(c){if(c.type==='attack')c.a.soulState.merlinAttackOut=(c.a.soulState.merlinAttackOut??0)+(c.settledDamage??0);},
 attackDamageTaken(c){c.a.soulState.merlinAttackIn=(c.a.soulState.merlinAttackIn??0)+(c.settledDamage??0);},
 combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;
  if(c.t.hp*c.a.stats.maxHp>c.a.hp*c.t.stats.maxHp)health.drainPercent(c,c.t.stats.maxHp/3,'魔祖之渎');
  if(c.a.hp<=0||c.t.hp<=0)return;
  if(['atk','def','spa','spd','spe','acc'].some(k=>c.t.stages[k]>c.a.stages[k])){c.stage(c.a,1);c.stage(c.t,-1);}
  if(c.a.hp>0&&c.t.hp>0&&(c.a.soulState.merlinAttackIn??0)>(c.a.soulState.merlinAttackOut??0))c.randomFromSharedPool(2,false,1722);
 }
}};

