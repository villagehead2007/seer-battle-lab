'use strict';
const fs=require('fs'),p='research/BATCH-4816-REMAINING/ANSWER-DEPLOYMENT-2026-11-05T10-51-34-562Z';for(const f of ['dist/souls.js','dist/range-souls.js','tests/remaining-4933-soul.test.cjs','tests/remaining-4933-native.test.cjs']){const dest=p+'/4933-before-'+f.replaceAll('/','_')+'.txt';if(fs.existsSync(dest))throw Error('already archived '+dest);fs.copyFileSync(f,dest);}
function edit(f,fn){let s=fs.readFileSync(f,'utf8');const r=(a,b)=>{if(!s.includes(a))throw Error('missing '+a.slice(0,80));s=s.replace(a,b);};fn(r,()=>s);fs.writeFileSync(f,s);}
edit('dist/range-souls.js',r=>{
r("const list=this.believers(c);if(list.length>1)throw Error('Q-4933-001：多个信仰者的总合计体力百分比算法待确认');if(!list.length)return null;return list[0].hp/list[0].stats.maxHp;","const list=this.believers(c);if(!list.length)return null;return list.reduce((n,f)=>n+f.hp,0)/list.reduce((n,f)=>n+f.stats.maxHp,0);");
r("if(c.on(c.a,'修罗意念不减'))throw Error('Q-4933-003：意念不减少期间消耗与收益规则待确认');if(st.form==='evil'&&st.extra>0)throw Error('Q-4933-004：未消费下次攻击意念附伤与新轮意念合并待确认');const amount=st.thought;","const retained=c.on(c.a,'修罗意念不减'),amount=st.thought;");
r("st.thought=0;for(const f of targets)","if(!retained)st.thought=0;for(const f of targets)");r("else{st.thought=0;st.extra=amount;}","else{if(!retained)st.thought=0;st.extra=amount;}");
r("finish(c){const st=shura2128(c.a);if(st.modifiedRound===c.round)throw Error('Q-4933-002：额外增减伤计入法之意念的结算层与取整待确认');}","record(c){const st=shura2128(c.a);if(!Number.isFinite(c.amount)||c.amount<0)throw Error('法之意念伤害差额无效');(st.damageChanges??=[]).push({round:c.round,kind:c.kind,amount:c.amount,unit:c.unit,coefficient:c.coefficient,move:c.move});},finish(c){const st=shura2128(c.a);if(st.thoughtSettledRound===c.round)return;const raw=(st.damageChanges??[]).filter(e=>e.round===c.round).reduce((n,e)=>n+e.amount,0),amount=Math.floor(raw+1e-9);st.thought+=amount;st.thoughtSettledRound=c.round;(st.thoughtGains??=[]).push({round:c.round,raw,amount});}");
r("partial:true,unimplemented:['Q-4933-001多信仰者百分比','Q-4933-002增减伤法之意念结算','Q-4933-003意念不减与消耗','Q-4933-004未消费附伤再授']","partial:false,unimplemented:[]");
r("if(amount){c.modifier*=1+amount;shura2128(c.a).modifiedRound=c.round;}","if(amount){c.shuraOutgoing2128={before:c.modifier,bonus:amount};c.modifier*=1+amount;}");
r("if(amount){c.reduction=1-(1-(c.reduction??0))*(1-amount);shura2128(c.a).modifiedRound=c.round;}","if(amount){c.shuraIncoming2128={before:c.reduction??0,fraction:amount};c.reduction=1-(1-(c.reduction??0))*(1-amount);}");
});
edit('dist/souls.js',r=>{
r("E.SOULS.run('beforeIncomingAttack',incoming);if(crit&&on(t,'黄幕抵挡致命'))", "E.SOULS.run('beforeIncomingAttack',incoming);if(incoming.shuraIncoming2128)effectContext.shuraIncoming2128={...incoming.shuraIncoming2128,modifier};if(crit&&on(t,'黄幕抵挡致命'))");
const needle="if(!rage&&!effectContext.ignoreImmunity&&total>0&&guardStates.available(t,'attack',r))";
r(needle,`// Q-4933-002: account at the sourced multiplier layer, before later
      // caps, shields and immunity. Sum exact changes and floor once at combatEnd.
      if(effectContext.shuraOutgoing2128||effectContext.shuraIncoming2128){const unit=(typedBase===0||feedback4608===0||affinity===0||typedBase===null&&feedback4608===null&&power===0)?0:base*stab*affinity*(feedback4608!==null?1:crit?2:1)*roll/100;for(const [f,kind,coefficient]of[[a,'increase',effectContext.shuraOutgoing2128?effectContext.shuraOutgoing2128.before*effectContext.shuraOutgoing2128.bonus:0],[t,'reduction',effectContext.shuraIncoming2128?effectContext.shuraIncoming2128.modifier*(1-effectContext.shuraIncoming2128.before)*effectContext.shuraIncoming2128.fraction*(1-damageReductionIgnore):0]])if(f.soulId===2128&&coefficient>0)E.SOULS.registry[2128].abilities.record({a:f,round:r,kind,unit,coefficient,amount:unit*coefficient,move:m.id});}
      `+needle);
});
console.log('4933 source-layer thought accounting and answers installed');
