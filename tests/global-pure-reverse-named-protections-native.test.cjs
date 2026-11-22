'use strict';const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function make(actor,move,enemy,soul,o={}){const a=store.species(actor),b=store.species(enemy);a.selectedSoulId=a.souls[0].id;b.selectedSoulId=soul;const stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:4000},s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[move]),loadout(b,o.enemyMove?[o.enemyMove]:[])],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});if(o.hp!==undefined)s.fighters[0].hp=o.hp;Object.assign(s.fighters[0].stages,{acc:6});Object.assign(s.fighters[1].stages,{atk:2,def:2,spa:2,spd:2,spe:2,acc:2});return s;}
const turn=(s,a,b='potion:pp')=>E.resolveTurn(s,[typeof a==='number'?'wiki:'+a:a,typeof b==='number'?'wiki:'+b:b]);
for(const[enemy,soul]of[[4589,1797],[4589,1864],[4608,1813],[4714,1915],[4840,2033]])test('统一直接反转穿过原生'+enemy+'魂'+soul+'仅防消吸保护，原消强仍被保护阻挡',()=>{
 const s=turn(make(3240,23240,enemy,soul),23240);assert.ok(s.fighters[1].stages.atk<0);assert.ok(s.fighters[1].stages.def<0);const clear=turn(make(3240,15882,enemy,soul),15882);assert.ok(clear.fighters[1].stages.atk>0);assert.ok(clear.fighters[1].stages.def>0);
});
test('圣谕原1764对手未选技能的防消吸不阻明王死亡直接反转，原先清回合仍依自身保护处理',()=>{
 const s=turn(make(3237,14102,4554,1764,{hp:1,enemyMove:36848}),'potion:pp',36848);assert.equal(s.fighters[0].hp,0);assert.equal(s.fighters[0].soulState.mingDeathTriggered,true);assert.equal(s.fighters[1].soulState.oracleNoSkillOpponent1764,1);assert.equal(s.fighters[1].stages.atk,-2);assert.equal(s.fighters[1].stages.def,-2);
});
