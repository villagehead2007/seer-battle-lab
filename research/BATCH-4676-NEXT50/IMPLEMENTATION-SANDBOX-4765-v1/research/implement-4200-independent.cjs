'use strict';const fs=require('fs'),assert=require('node:assert/strict'),source=require('./4200-reviewed-snapshot.json');
function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p+' unique anchor');fs.writeFileSync(p,s.replace(a,b));}
edit('dist/effect-registry.js',"const before=c.a.hp;c.heal(c.a,c.dealt*p[0]/100,c.m.name);const restored=Math.max(0,c.a.hp-before);if(c.crit&&c.t.hp>0&&restored>0)","const restored=c.heal(c.a,c.dealt*p[0]/100,c.m.name)??0;if(c.crit&&c.a.hp>0&&c.t.hp>0&&restored>0)");
edit('dist/souls.js',"const e=a.effects['用招低体回血粉伤'],low=a.hp<a.stats.maxHp*e.threshold,before=a.hp;heal(a,a.stats.maxHp*e.fraction,'用招低体回血粉伤','skill');if(low&&t.hp>0)inflict(a,t,a.hp-before,'用招低体回血粉伤','percent');","const e=a.effects['用招低体回血粉伤'],low=a.hp<a.stats.maxHp*e.threshold,restored=heal(a,a.stats.maxHp*e.fraction,'用招低体回血粉伤','skill')??0;if(low&&a.hp>0&&t.hp>0&&restored>0)inflict(a,t,restored,'用招低体回血粉伤','percent');");
edit('dist/souls.js',"heal(f,f.effects['先手固定吸取'].amount,'先手固定吸取');","heal(f,f.effects['先手固定吸取'].amount,'先手固定吸取','skill');");
// One-use lethal survival is a final HP floor after mitigation, never a settled-damage cap.
edit('dist/souls.js',"const lossBudget=bypass?settledDamage:preventLethal(f,settledDamage)","if(!bypass&&f.soulState.nextLethalFloor&&f.hp>0&&settledDamage>=f.hp){hpFloor=Math.max(hpFloor,1);delete f.soulState.nextLethalFloor;}const lossBudget=bypass?settledDamage:preventLethal(f,settledDamage)");
edit('dist/souls.js',"const lossBudget=!rage&&!effectContext.ignoreLimit?preventLethal(t,settledDamage):settledDamage","if(!rage&&!effectContext.ignoreLimit&&t.soulState.nextLethalFloor&&t.hp>0&&settledDamage>=t.hp){hpFloor=Math.max(hpFloor,1);delete t.soulState.nextLethalFloor;}const lossBudget=!rage&&!effectContext.ignoreLimit?preventLethal(t,settledDamage):settledDamage");
edit('dist/souls.js',"      if(a.hp>0&&on(a,'用招吸取体力'))","      if(a.hp>0&&on(a,'用招固定吸取体力')){const e=a.effects['用招固定吸取体力'];inflict(a,t,e.amount,'用招固定吸取体力','fixed');heal(a,e.amount,'用招固定吸取体力','skill');}\n      if(a.hp>0&&on(a,'用招吸取体力'))");
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});'),code='\n// 4200: exact sourced independent clauses; 2447 remains unregistered pending timing evidence.\n';for(const id of [1675,1068,1983,2281,1679]){const e=source.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(1675,'afterHit',(c,p)=>{const before={...c.t.stages};registry[143].execute(c,[]);if(Object.keys(before).some(k=>before[k]>0&&c.t.stages[k]===-before[k]))c.timed(c.t,'技能禁疗',p[0],{});},[turns]);
add(1068,'afterHit',(c,p)=>c.timed(c.a,'致命保留',p[0],{hp:p[1]},c.round+1),[turns,[1,1]]);
add(1983,'afterHit',(c,p)=>c.timed(c.a,'用招固定吸取体力',p[0],{amount:p[1]}),[turns,[1,9999]]);
add(2281,'afterHit',c=>{if(c.a.side===c.first)c.a.soulState.nextLethalFloor=1;},[]);
add(1679,'afterAttack',(c,p)=>{if((c.settledDamage??c.dealt)<=p[0])throw Error('1679低伤未触发是否也吸取待Q-A60-4200-049');if(!(statusRoll(c,p[1])&&c.ailment(c.t,ailments[p[2]],c.a)))healthRules.drainPercent(c,c.t.stats.maxHp/p[3],c.m.name+'未感染吸取');},[[0,99999],pct,[27,27],[1,9999]]);
`;fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');at=s.lastIndexOf('\n});');code=`
for(const [id,hash]of [[1422,'ce698ab3'],[1762,'7af0cb07']])registry[id]={name:'阿莱克托'+(id===1762?'·强化':''),sourceHash:hash,...(id===1422?{partial:true,unimplemented:['Q-A60-4200-050：先手未触发补偿的无攻击/外部必暴/多段统计']}:{ }),traits:{},hooks:{
roundStart(c){const st=c.a.soulState;st.alectoBonus=st.alectoTakenRound===c.round-1&&st.alectoOpponentId===c.t.id?Math.floor(st.alectoTaken*100/c.a.stats.maxHp)*.02:0;st.alectoCritRolls=[];delete st.alectoAttackCrit;delete st.alectoCompensationPending;},
attackDamageTaken(c){const st=c.a.soulState,n=c.settledDamage??c.dealt;if(n<=0)return;if(st.alectoTakenRound!==c.round||st.alectoOpponentId!==c.t.id){st.alectoTakenRound=c.round;st.alectoOpponentId=c.t.id;st.alectoTaken=0;}st.alectoTaken+=n;},
beforeDamage(c){c.modifier*=1+(c.a.soulState.alectoBonus??0);},
beforeCrit(c){if(c.a.side!==c.first)return;if(id===1762){c.forceCrit=true;return;}const st=c.a.soulState;if(st.alectoCritRolls.length)throw Error('阿莱克托同回合多次暴击判定与补偿待Q-A60-4200-050');const success=c.random()<.5;st.alectoCritRolls.push(success);c.forceCrit=!!c.forceCrit||success;c.chance=0;},
afterAttack(c){c.a.soulState.alectoAttackCrit=c.crit;},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(c.a.side!==c.first){c.timed(c.a,'id984',1,{amount:1},c.round+1);return;}if(id===1762||st.alectoCritRolls.length===1&&!st.alectoCritRolls[0]&&st.alectoAttackCrit===false){c.stage(c.a,2,['atk','spe']);}else if(id===1422&&(st.alectoCritRolls.length===0||!st.alectoCritRolls[0]&&st.alectoAttackCrit))st.alectoCompensationPending='Q-A60-4200-050';}
}};
`;fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
edit('seerapi.cjs',"const entry={11680:","const entry={11084:['c5d5e1ca',4],11680:");
let h=fs.readFileSync('tests/helpers/4194-battle.cjs','utf8').replaceAll('4194','4200').replace('unknown=[]','unknown=[2447]').replace('moveId:10047','moveId:10006');fs.writeFileSync('tests/helpers/4200-battle.cjs',h);
edit('tests/helpers/sourced-583-1647-battle.cjs','[4169,4189,4194].includes(id)','[4169,4189,4194,4200].includes(id)');
console.log('4200 independent implementation and 927/1323/923 repairs saved');
