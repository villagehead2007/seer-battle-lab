'use strict';const fs=require('fs'),assert=require('node:assert/strict');
const edit=(p,fn)=>fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8'))),rep=(s,a,b)=>{assert(s.includes(a),a.slice(0,80));return s.replace(a,b);};
edit('dist/range-souls.js',s=>{
 s=rep(s,"sourceHash:'480fc859',partial:true,unimplemented:['吸取回复后自身死亡的后续载荷资格']","sourceHash:'480fc859',partial:false");
 return rep(s,"if(c.a.hp<=0){const q=c.a.soulState.lethal1977;if(typeof q!=='boolean')throw Error('Q-4685-002：布贝吸取后自身死亡是否继续附疲惫待确认');if(!q)return;}","if(c.a.hp<=0)return;");
});
edit('dist/range-effects.js',s=>{
 s=rep(s,"if(Number(c.a.number)!==4780)return registry20Before4780.execute(c,p);const q=c.a.soulState.selfFatigue20Timing;if(!['current','after-own-action'].includes(q))throw Error('Q-4780-001：自疲惫1回合计当前残轮还是保留到下个完整行动轮待确认');if(statusRoll(c,p[0]))c.ailment(c.a,'疲惫',c.a,false,false,p[1]+(q==='after-own-action'?1:0),{probabilityPercent:p[0],declaredDuration:p[1],selfControlTiming:q});", "if(Number(c.a.number)!==4780)return registry20Before4780.execute(c,p);if(statusRoll(c,p[0]))c.ailment(c.a,'疲惫',c.a,false,false,p[1]+1,{probabilityPercent:p[0],declaredDuration:p[1],selfControlTiming:'after-own-action'});");
 s=rep(s,"if(first){const q=c.a.soulState.firstUse77;if(!['grant-use','next-use'].includes(q))throw Error('Q-N50-4625-011：定时使用技能回复授予本次是否触发待确认');if(q==='next-use')return;}","");
 const start=s.indexOf('{const old=registry[1073];registry[1073]=Object.freeze({...old,execute(c,p){if((c.m.wikiId??c.m.id)!==29077'),end=s.indexOf('\n',start);assert(start>0&&end>start);
 s=s.slice(0,start)+`{const old=registry[1073];registry[1073]=Object.freeze({...old,execute(c,p){if((c.m.wikiId??c.m.id)!==29077||c.m.revision!=='seerapi:d5645cd0'||c.effectInstanceIndex!==1)return old.execute(c,p);c.timed(c.a,'布贝高伤回满反击',p[0],{threshold:p[1],sourceHash:'d5645cd0',sourceMove:29077});},received4780(c){const e=c.a.effects['布贝高伤回满反击'];if(!e||e.sourceHash!=='d5645cd0'||!c.on(c.a,'布贝高伤回满反击')||c.settledDamage<=e.threshold||c.a.hp<=0||c.reflected||c.a.soulState.counterBusy4780)return;c.a.soulState.counterBusy4780=true;try{const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp,'布贝高伤主动回满','skill');const n=Math.max(0,c.a.hp-before);if(c.a.hp>0&&c.t.hp>0&&n>0)c.counterFixed(n);}finally{delete c.a.soulState.counterBusy4780;}}});}`+s.slice(end);
 // Original128 is an explicitly answered exception for this one exact source.
 s+=`\n{const old=registry[1247];registry[1247]=Object.freeze({...old,execute(c,p){if((c.m.wikiId??c.m.id)!==37969||c.m.revision!=='seerapi:f68da803'||c.effectInstanceIndex!==2)return old.execute(c,p);if(c.a.side===c.first)c.timed(c.t,'布贝行动技能禁疗',1,{sourceMove:37969,sourceHash:'f68da803'});}});}\n`;
 return s;
});
edit('dist/souls.js',s=>rep(s,"const blocked405=origin==='skill'&&on(f,'无法通过自身技能恢复体力')","const blocked405=origin==='skill'&&(on(f,'无法通过自身技能恢复体力')||on(f,'布贝行动技能禁疗')&&currentActorSide===f.side)"));
console.log('4780 confirmed runtime applied');
