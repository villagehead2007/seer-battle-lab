const fs=require('fs');function append(p,block){let s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('});');fs.writeFileSync(p,s.slice(0,i)+block+'\n'+s.slice(i));}
append('dist/range-effects.js',`
// Source and independent user confirmations: research/SIX-DEPLOY-USER-CONFIRMATIONS.json.
metadata[2265]={info:'自身拥有1道寂杀之魄时无视自身能力下降状态，拥有2道时无视护盾效果，拥有3道时无视伤害限制效果',args_num:0};
metadata[2266]={info:'为对方附加自身攻击值{0}%的肃霜之禁',args_num:1};
metadata[2268]={info:'连续攻击对手{0}次，对手每有{1}点肃霜之禁额外攻击{2}次，自身处于能力提升状态时效果翻倍',args_num:3};
add(2265,'beforeOrder',c=>{if((c.a.soulState.coldEssence??0)>=1)c.a.soulState.ignoreOwnWeakThis=true;},[],undefined,undefined,{beforeDamage(c){const n=c.a.soulState.coldEssence??0;if(n>=2)c.ignoreShield=true;if(n>=3)c.ignoreLimit=true;}});
add(2266,'afterHit',(c,p)=>{c.t.soulState.coldBan=Math.min(200,(c.t.soulState.coldBan??0)+Math.floor(c.a.stats.atk*p[0]/100));},[pct]);
add(2268,'beforeUse',(c,p)=>{c.hits=(p[0]+Math.floor((c.t.soulState.coldBan??0)/p[1])*p[2])*(Object.values(c.a.stages).some(n=>n>0)?2:1);},[[90,90],[50,50],[10,10]]);
`);
append('dist/range-souls.js',`
registry[1155]={name:'冰魄·柯尔德',sourceHash:'8603e5bf',traits:{},hooks:{
roundStart(c){c.a.soulState.ignoreTargetBoostRound=c.round;},
beforeHealthDamage(c){if(c.type!=='attack'||c.amount<=0)return;const st=c.a.soulState;if(st.coldNextCap){c.amount=Math.min(c.amount,200);delete st.coldNextCap;}const n=c.amount;if(n>c.a.stats.maxHp/2)c.amount=Math.floor(n*.4);else if(n<c.a.stats.maxHp/2)st.coldReflect=(st.coldReflect??0)+n;},
attackDamageTaken(c){const n=c.a.soulState.coldReflect??0;delete c.a.soulState.coldReflect;if(n>0&&c.t.hp>0)c.hurt(c.t,n,'冰魄低伤反弹','percent');},
afterHit(c){if(c.m.kind==='status'||!Object.values(c.t.stages).some(n=>n>0))return;if(!c.ailment(c.t,'冰封',c.a))c.a.soulState.coldNextCap=true;}
}};
registry[1971]={name:'冰魄·柯尔德·觉醒',sourceHash:'8360a956',deferred:['寂杀之魄下场保留；主动切换及己方在场精灵死亡清理肃霜之禁'],traits:{ignoreOpponentPriorityUpTo:f=>f.soulState.coldPriorityCap??0},hooks:{
roundStart(c){const st=c.a.soulState;st.coldSaved=0;st.coldNoEssence=!(st.coldEssence>0);st.coldPriorityCap=(Object.values(c.a.ailments).some(n=>n>=c.round)||Object.values(c.t.ailments).some(n=>n>=c.round))?(st.coldEssence??0)*(Object.values(c.a.ailments).some(n=>n>=c.round)?3:1):0;const m=c.selectedMove(c.a);if(st.coldNoEssence||m.kind!=='status'&&m.kind!=='item')st.ignoreTargetBoostRound=c.round;},
beforeHealthDamage(c){if(!['attack','fixed','percent'].includes(c.type)||!c.skillPhase||c.currentActorSide!==c.t.side||c.amount<=0)return;const before=c.amount;c.amount=Math.floor(before*.4);c.a.soulState.coldSaved=(c.a.soulState.coldSaved??0)+before-c.amount;},
damageTaken(c){if(c.type==='true'&&(c.settledDamage??0)>0)c.a.soulState.coldEssence=Math.min(3,(c.a.soulState.coldEssence??0)+1);},
afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0||!Object.values(c.t.stages).some(n=>n>0))return;const applied=c.ailment(c.t,'冰封',c.a);if(c.a.soulState.coldNoEssence||!applied)c.t.soulState.coldBan=200;},
combatEnd(c){const n=c.a.soulState.coldSaved??0;c.a.soulState.coldSaved=0;if(n>0&&n<200)c.feedbackPair(n);else if(n>200&&c.a.soulState.coldEssence>0&&c.t.hp>0)c.ailment(c.t,'冻伤',c.a,false,false,3);}
}};
`);
let p='dist/souls.js',s=fs.readFileSync(p,'utf8');s=s.replace('round:r,skillPhase,currentActorSide,priorityValue:',`round:r,skillPhase,currentActorSide,feedbackPair(n){hurt(a,n,'觉醒冰魄战阶反馈','true',false,false,a);if(t.hp>0){t.soulState.coldFeedbackFloor=a.hp<=0;hurt(t,n,'觉醒冰魄战阶反馈','true',false,false,a);delete t.soulState.coldFeedbackFloor;}},priorityValue:`);s=s.replace('amount=shared.amount;hpFloor=shared.hpFloor??0;', 'amount=shared.amount;hpFloor=Math.max(shared.hpFloor??0,f.soulState.coldFeedbackFloor?1:0);');fs.writeFileSync(p,s);
