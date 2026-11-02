const fs=require('fs');function edit(f,a,b){let s=fs.readFileSync(f,'utf8');if(!s.includes(a))throw Error('missing '+a);fs.writeFileSync(f,s.replace(a,b));}
fs.writeFileSync('research/3716-user-confirmed-rules.json',JSON.stringify({species:3716,confirmedAt:new Date().toISOString(),source:'当前用户明确确认',rules:{soul993:{hash:'88fa5288',answer:'百分比；是；实际回复量',meaning:'战阶结束无条件先回复maxHP/3，然后比较HP；仍较低则追加实际回复量的百分比伤害'},shields:{effects:[2079,1368],answer:'是',meaning:'仅有数值且抵挡伤害的护盾，排除分类闪避魔盾与护罩'},effect727:{hash:'f4e8c21',answer:'回到开战',meaning:'首回合后手回到开战初始能力等级，后续回到上一回合结束时'}},preserve:'所有API/Wiki冲突原文和hash保留，不伪称上游修订'},null,2)+'\n');
edit('dist/souls.js','  const boosted = f => keys.filter(k=>f.stages[k]>0);',`  const boosted = f => keys.filter(k=>f.stages[k]>0);
  // Numeric shields share a category; barriers and dodge windows are distinct.
  const shieldValue=f=>(f.suitState?.shield??0)+(f.soulState?.attackShield??0)+(f.soulState?.marsShield??0);`);
edit('dist/souls.js','f.soulState={energy:0};','f.soulState={energy:0,previousRoundStages:{...f.stages}};');
edit('dist/souls.js','    function jasmineBarrierGone(f)',`    function consumeShields(f,opponent){const n=shieldValue(f),ordinary=f.suitState.shield??0;f.suitState.shield=0;f.soulState.attackShield=0;if(f.soulState.marsShield>0){f.soulState.marsShield=0;f.soulState.marsShieldRestoreRound=r+2;}if(ordinary>0)suitShieldBreak(f,opponent);return n;}
    function jasmineBarrierGone(f)`);
edit('dist/souls.js','shieldConsumed:suitShieldBreak,damageImmune,','shieldConsumed:suitShieldBreak,shieldValue,consumeShields,damageImmune,');
edit('dist/souls.js','      let amount=gear.mitigate(f,n,type,{bypass});',"      const incoming={...context(f,origin??fs[1-f.side]),amount:n,type};if(!bypass)E.SOULS.run('beforeIncomingDamage',incoming);\n      let amount=gear.mitigate(f,incoming.amount,type,{bypass});");
edit('dist/souls.js',"      if(!rage)modifier*=(1-(E.SOULS.trait(t,'allDamageReduction')", "      if(!rage){const incoming={...context(t,a,m),reduction:0};E.SOULS.run('beforeIncomingAttack',incoming);modifier*=1-incoming.reduction*(1-damageReductionIgnore);}\n      if(!rage)modifier*=(1-(E.SOULS.trait(t,'allDamageReduction')");
edit('dist/souls.js',"if(!rage&&t.soulState.attackShield>0)","if(!rage&&!effectContext.ignoreShield&&t.soulState.attackShield>0)");
edit('dist/souls.js','received[t.side]=true;if(t.suitState.shield>0)','received[t.side]=true;if(!effectContext.ignoreShield&&t.suitState.shield>0)');
edit('dist/souls.js','if(!rage&&!effectContext.ignoreLimit)remaining=absorbMarsShield','if(!rage&&!effectContext.ignoreLimit&&!effectContext.ignoreShield)remaining=absorbMarsShield');
edit('dist/souls.js','    s.turns.push({round:r,choices:[...choices],first,events,remainingHp:fs.map(f=>f.hp)});','    for(const f of fs)f.soulState.previousRoundStages={...f.stages};\n    s.turns.push({round:r,choices:[...choices],first,events,remainingHp:fs.map(f=>f.hp)});');
edit('dist/soul-registry.js','const registry={',`const registry={
 993:{name:'该洛西斯·原魂印',sourceHash:'88fa5288',traits:{},hooks:{
 beforeUse(c){if(c.a.hp>0&&c.m.kind!=='item')c.timed(c.a,c.m.kind==='status'?'特殊攻击闪避':'物理攻击闪避',2,{});},
 combatEnd(c){if(c.a.hp<=0)return;const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'该洛西斯原魂印回复');if(c.a.hp<c.t.hp)c.hurt(c.t,c.a.hp-before,'该洛西斯原魂印追加','percent');}
 }},`);
edit('dist/soul-registry.js',"traits:{immuneAilments:['石化']},hooks:{",`traits:{immuneAilments:['石化']},hooks:{
 beforeDamage(c){if(c.shieldValue(c.a)>c.shieldValue(c.t))c.modifier*=1.5;},
 beforeIncomingAttack(c){if(c.shieldValue(c.a)<c.shieldValue(c.t))c.reduction=.5;},
 beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&c.shieldValue(c.a)<c.shieldValue(c.t))c.amount*=.5;},`);
const f='dist/range-effects.js',a=require('./3716-source-audit.json');let s=fs.readFileSync(f,'utf8'),extra='\n';for(const id of [2079,1110,2080,1368,1662,727]){const d=a.records.find(r=>r.url.endsWith('/skill_effect_type/'+id)).data;extra+=`metadata[${id}]=${JSON.stringify({info:d.info,args_num:d.args_num})};\n`;}
extra+=`add(2079,'beforeOrder',c=>{if(c.shieldValue(c.t)>0)c.priority++;},[],undefined,undefined,{beforeDamage(c){if(c.shieldValue(c.t)>0)c.ignoreShield=true;}});
add(2080,'beforeDamage',(c,p)=>{if(c.shieldValue(c.a)>0)c.power*=1+p[0]/100;},[[0,1000]]);
add(1110,'afterHit',(c,p)=>{let reversed=false;for(const k of stats)if(c.t.stages[k]>0){c.t.stages[k]*=-1;reversed=true;}if(reversed)c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+p[0];else c.clearBoost(c.t);},[[1,99]]);
add(1368,'afterHit',(c,p)=>{if(c.consumeShields(c.t,c.a)>0)c.timed(c.t,'skillBlock',p[0],{},c.round+1);},[turns]);
add(1662,'afterHit',c=>{const n=c.consumeShields(c.a,c.t);if(n>0&&c.t.hp>0&&c.hurt(c.t,n,c.m.name+'护盾转伤','fixed')===0)c.heal(c.a,n,c.m.name+'护盾转伤失败');});
add(727,'afterHit',c=>{if(c.a.side!==c.first&&c.a.soulState.previousRoundStages)Object.assign(c.a.stages,c.a.soulState.previousRoundStages);});
`;const at=s.lastIndexOf('});');fs.writeFileSync(f,s.slice(0,at)+extra+s.slice(at));
