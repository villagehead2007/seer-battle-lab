const old4674=Object.fromEntries([...new Set(bindings4674.map(b=>b.id))].map(id=>[id,registry[id]]));
const custom4674={
803(c,p){if(!(statusRoll(c,p[0])&&c.ailment(c.t,'瘫痪',c.a,false,false,null,{probabilityPercent:p[0]}))){c.heal(c.a,c.a.stats.maxHp/p[2],c.m.name+'未控回复','skill');c.timed(c.a,'伤害上限',p[3],{amount:p[4],polar803:true});}},
878(c,p){c.timed(c.a,'先手附加异常',p[0],{ailment:'束缚'},c.round+1);},
191(c,p,old){if(c.a.counts.immune>0||c.on(c.a,'免异常')||c.on(c.a,'reflect'))throw Error('Q-N50-4511-006：4674反弹与未消费免异资源重合待确认');return old.execute(c,p);},
77(c,p){c.timed(c.a,'无极用招定额回复',p[0],{amount:p[1],grantRound:c.round,grantUse:c.effectUseToken()});},
992(c,p){c.timed(c.a,'攻击附加当前体力粉伤',p[0],{fraction:p[1]/100,source4674:true,grantRound:c.round,grantUse:c.effectUseToken()});}
};
for(const id of new Set(bindings4674.map(b=>b.id))){const old=old4674[id];if(!old)throw Error('4674 missing '+id);registry[id]=Object.freeze({...old,validate(p,m,i){if(bindings4674.some(b=>b.id===id&&exact4674(m,i,b,p)))return;if(legacyBindings4674.some(b=>b.id===id&&exact4674(m,i,b,p)))return old.validate?.(p,m,i);if(bindings4674.some(b=>b.id===id&&b.moveId===(m?.wikiId??m?.id)))throw Error('4674 exact source required');return old.validate?.(p,m,i);},execute(c,p){if(!source4674(c,id))return old.execute(c,p);return custom4674[id]?custom4674[id](c,p,old):old.execute(c,p);}});}
function use77_4674(c){const e=c.a.effects['无极用招定额回复'];if(!e||e.start>c.round||e.end<c.round)return;const first=e.grantRound===c.round&&e.grantUse===c.effectUseToken(),mode=c.a.soulState.qualified77First4674;if(first&&!['grant-use','next-use'].includes(mode))throw Error('Q-N50-4625-011：4674持续用招回复首触待确认');if(first&&mode==='next-use')return;c.heal(c.a,e.amount,'无极用招定额回复','skill');}
registry[77]=Object.freeze({...registry[77],use77_4674});
function cap803(c,n,shield=0){const e=c.a.effects['伤害上限'];if(!e?.polar803||!(n>0))return n;const prior=c.settledReceived4658(c.a),mode=c.a.soulState.qualified803Unit4674,roundCap=Math.max(0,e.amount-prior);if(Math.min(n,e.amount)!==Math.min(n,roundCap)&&!['event','round-settled'].includes(mode))throw Error('Q-N50-4633-001：4674/803每事件或整回合限伤额度待确认');const cap=mode==='round-settled'?roundCap:e.amount,order=c.a.soulState.qualified803Shield4674;if(shield>0&&n>cap&&!['before','after'].includes(order))throw Error('Q-N50-4633-001：4674/803与护盾护罩扣除先后待确认');return shield>0&&order==='after'?n:Math.min(n,cap);}
registry[803]=Object.freeze({...registry[803],cap4674:cap803});
{const old=registry[2040];registry[2040]=Object.freeze({...old,deferredFor(p,m,i){if(bindings4674.some(b=>b.id===2040&&exact4674(m,i,b,p)))return '3回合内对手主动切换精灵出战时100%瘫痪；依赖真实主动换宠及新出场目标，无当前在场分支';return old.deferredFor?old.deferredFor(p,m,i):old.deferred;}});}
