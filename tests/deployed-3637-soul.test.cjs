'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3637-battle.cjs');
const {source,IDLE,HIT,make,turn,wait,timer,allStages}=H,e={moveId:10128,index:null};
function incoming(soul,n,options={}){const s=make(e,{soul,omit:true,hp:1000,bStats:{atk:9000},...options});timer(s,0,'攻击伤害上限',{amount:n});return s;}
test('3637 双魂印回合开始双防速度变化、行动顺序与免弱禁强边界',()=>{
 for(const soul of [928,1474]){const s=make(e,{soul,omit:true,aStats:{spe:100},bStats:{spe:150}}),o=wait(s);for(const k of ['def','spd','spe']){assert.equal(o.fighters[0].stages[k],1);assert.equal(o.fighters[1].stages[k],-1);}assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].stages.atk,0);const cap=allStages(allStages(make(e,{soul,omit:true}),0,6),1,-6);assert.equal(wait(cap).fighters[0].stages.def,6);assert.equal(wait(cap).fighters[1].stages.def,-6);const ban=make(e,{soul,omit:true});timer(ban,0,'禁强化');timer(ban,1,'免弱');const b=wait(ban);assert.deepEqual(b.fighters[0].stages,ban.fighters[0].stages);assert.deepEqual(b.fighters[1].stages,ban.fighters[1].stages);}
});
test('3637 双魂印350与340严格受击阈值、相等空分支及回满',()=>{
 for(const [soul,threshold]of [[928,350],[1474,340]])for(const n of [threshold-1,threshold,threshold+1]){const o=turn(incoming(soul,n),IDLE,HIT);assert.equal(o.fighters[1].lastAttackDamage,n);assert.equal(o.fighters[0].hp,n>threshold?9000:1000-n);assert.equal(o.fighters[1].hp,9000-(n<threshold?Math.floor(n*.5):0));}
 const original=turn(incoming(928,345),IDLE,HIT),enhanced=turn(incoming(1474,345),IDLE,HIT);assert.equal(original.fighters[0].hp,655);assert.equal(enhanced.fighters[0].hp,9000);
});
test('3637 双魂印反伤类型抗性、零伤失误与护罩交互',()=>{
 for(const soul of [928,1474]){const s=incoming(soul,200);s.fighters[1].build.resistance.fixed=0;s.fighters[1].build.resistance.percent=50;assert.equal(turn(s,IDLE,HIT).fighters[1].hp,8900);s.fighters[1].build.resistance.fixed=50;assert.equal(turn(s,IDLE,HIT).fighters[1].hp,8950);s.fighters[1].suitState.barrier=60;const b=turn(s,IDLE,HIT);assert.equal(b.fighters[1].hp,9000);assert.equal(b.fighters[1].suitState.barrier,10);
 const no=incoming(soul,200);timer(no,0,'当回合免伤');assert.deepEqual(turn(no,IDLE,HIT).fighters.map(f=>f.hp),[1000,9000]);const miss=incoming(soul,200);timer(miss,1,'攻击必失');assert.deepEqual(turn(miss,IDLE,HIT).fighters.map(f=>f.hp),[1000,9000]);}
});
test('3637 双魂印致死不复活、固粉不触发、技能禁疗不拦魂印',()=>{
 for(const soul of [928,1474]){assert.equal(turn(incoming(soul,400,{hp:400}),IDLE,HIT).fighters[0].hp,0);const ban=incoming(soul,400);timer(ban,0,'技能禁疗');assert.equal(turn(ban,IDLE,HIT).fighters[0].hp,9000);
 const pink=make(e,{soul,omit:true,hp:1000,opponentEffect:{moveId:26194,index:2}});const p=turn(pink,IDLE,900023);assert.equal(p.fighters[0].hp,800);assert.equal(p.fighters[1].hp,9000);const high=make(e,{soul,omit:true,hp:8000,targetHp:1000,opponentEffect:{moveId:26194,index:2}});assert.equal(turn(high,IDLE,900023).fighters[0].hp,7600);
 }
});
test('3637 两版真实魂印分别选择并保留原文hash与参数',()=>{
 assert.deepEqual(source.souls.map(s=>s.id),[928,1474]);assert.deepEqual(source.souls.map(s=>s.args),[[1,1,350,350,50,1],[1,1,340,340,50,1]]);for(const soul of [928,1474]){const s=make({moveId:26195,index:null},{soul}),o=turn(s);assert.equal(s.fighters[0].soulId,soul);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[0].stages.def,3);assert.equal(o.fighters[0].suitState.barrier,350);assert.equal(o.fighters[0].pp['wiki:26195'],4);}
});
