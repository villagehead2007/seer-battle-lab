'use strict';const fs=require('fs'),assert=require('node:assert/strict');function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,100));fs.writeFileSync(p,s.replace(a,b));}function append(p,c){const s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('\n});');assert.ok(i>0);fs.writeFileSync(p,s.slice(0,i)+'\n'+c+s.slice(i));}
const s=require('./4222-reviewed-snapshot.json');let code='';for(const id of [655,1691,1692,1693]){const e=s.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(655,'afterHit',(c,p)=>{const before={...c.a.stages};c.clearNegative(c.a);if(stats.some(k=>before[k]<0&&c.a.stages[k]===0))p.slice(2).forEach((n,i)=>{if(n)c.stage(c.t,n,[stats[i]]);});},[[1,1],[0,0],[-1,-1],[0,0],[-1,-1],[0,0],[0,0],[0,0]]);
add(1691,'afterHit',(c,p)=>{c.a.soulState.terminalStrike={remaining:p[0],amount:p[1]};},[[1,99],[0,99999]]);
add(1692,'beforeDamage',(c,p)=>{if(roll(c,c.a.soulState.terminalShieldActive?p[1]:p[0]))c.modifier*=2;},[pct,pct]);
add(1693,'afterHit',(c,p)=>c.timed(c.a,'用招源盾比例真伤',p[0],{fraction:1/p[1],extra:p[2]}),[turns,[1,9999],[0,99999]]);
`;append('dist/range-effects.js',code);
edit('dist/range-effects.js',`  if(!positive.length||!c.clearBoost(c.t))return;
  // Clearing also supplies the fallback when immunity prevents inversion.
  for(const k of positive){c.stage(c.t,-levels[k],[k]);if(c.t.stages[k]===-levels[k])c.stage(c.a,levels[k],[k]);}`,`  if(!positive.length)return;
  registry[143].execute(c,[]);
  let changed=false;for(const k of positive)if(c.t.stages[k]===-levels[k]){changed=true;c.stage(c.a,levels[k],[k]);}
  if(!changed)c.clearBoost(c.t);`);
append('dist/range-souls.js',`function terminalShieldEvent(c,active){const st=c.a.soulState;st.terminalShieldActive=active;const e=st.terminalStrike;if(e?.remaining>0){e.remaining--;st.terminalStrikeQueue??=[];st.terminalStrikeQueue.push({round:c.round??1,amount:e.amount});}}
function terminalShieldEntry(c){c.a.soulState.terminalEntryRound=c.round??1;terminalShieldEvent(c,true);}
registry[1441]={name:'核爆·机械塔克林',sourceHash:'c11dc5f8',traits:{},hooks:{battleStart:terminalShieldEntry,entryTriggered:terminalShieldEntry,
beforeAilment(c){if(!c.a.soulState.terminalShieldActive)return;c.blocked=true;terminalShieldEvent(c,false);c.a.soulState.terminalConsumedRound=c.round;c.refreshShield(c.a,300,'soul:1441:terminal');},
beforeUse(c){if(!c.m.fifth)return;const st=c.a.soulState;st.terminalFifth={round:c.round,move:c.m.id,activeBefore:!!st.terminalShieldActive};if(!st.terminalShieldActive)terminalShieldEvent(c,true);},
beforeCrit(c){const e=c.a.soulState.terminalFifth;if(c.m.fifth&&e?.round===c.round&&e.move===c.m.id&&e.activeBefore)c.forceCrit=true;},
beforeDamage(c){if(c.a.soulState.terminalShieldActive)c.modifier*=1.5;},
afterHit(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.soulState.terminalShieldActive||c.a.hp<=0||c.t.hp<=0)return;c.hurt(c.t,(c.effective(c.a,'def')+c.effective(c.a,'spd'))*.5,'终阶源盾未激活双防追加','fixed');},
combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&st.terminalEntryRound===c.round&&st.terminalConsumedRound===c.round&&!st.terminalShieldActive)terminalShieldEvent(c,true);},
roundEnd(c){const st=c.a.soulState,queue=st.terminalStrikeQueue??[];st.terminalStrikeQueue=queue.filter(x=>x.round>c.round);for(const e of queue.filter(x=>x.round===c.round))if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,e.amount,'终阶源盾变化回合结束追加','fixed');}
}};`);
edit('dist/souls.js',"      E.SOULS.run('afterUse',{...context(a,t,m),", "      if(a.hp>0&&t.hp>0&&m.kind!=='item'&&on(a,'用招源盾比例真伤')){const e=a.effects['用招源盾比例真伤'];if(e.usedRound!==r){e.usedRound=r;const immune=damageImmune(t,'percent');inflict(a,t,t.stats.maxHp*e.fraction,'用招百分比追加','percent');if(immune&&a.hp>0&&t.hp>0)inflict(a,t,e.extra,'百分比免疫额外真实伤害','true');}}\n      E.SOULS.run('afterUse',{...context(a,t,m),");
let h=fs.readFileSync('tests/helpers/4216-battle.cjs','utf8').replaceAll('4216','4222').replace('moveId:10086','moveId:10611');h=h.replace("if(o.hit!==false)s.fighters[0].effects['攻击必中']={start:1,end:99};","if(o.hit!==false){s.fighters[0].effects['攻击必中']={start:1,end:99};s.fighters[0].effects['属性必中']={start:1,end:99};}");fs.writeFileSync('tests/helpers/4222-battle.cjs',h);
edit('tests/helpers/sourced-583-1647-battle.cjs','module.exports=function(id,effect){','module.exports=function(id,effect,selectedMove=null){');edit('tests/helpers/sourced-583-1647-battle.cjs','[4169,4189,4194,4200,4208,4215,4216,4219].includes(id)','[4169,4189,4194,4200,4208,4215,4216,4219,4222].includes(id)');edit('tests/helpers/sourced-583-1647-battle.cjs','.filter(x=>x.x.id===effect);','.filter(x=>x.x.id===effect&&(selectedMove===null||x.m.id===selectedMove));');
console.log('4222 sourced shield,655/1691/1692/1693 implemented; public1061 canonical reversal event path corrected');
