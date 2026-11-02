// Exact1845 correction only. Old frozen module/test evidence remains unchanged.
const oldSoul1845Scope=registry[1845];
registry[1845]={...oldSoul1845Scope,partial:true,
  unimplemented:[...oldSoul1845Scope.unimplemented,'Q-N50-4644-001：每拥有构造是否累加攻击先制','Q-N50-4644-002：实际因PP不足未用是否属于无法行动'],
  traits:{...oldSoul1845Scope.traits,attackPriority(f){const e=f.soulState.constructionRound1845;if(e?.mode!=='active')return 0;const p=f.soulState.qualifiedConstructPriority1845;if(p==='once')return 1;if(p==='per-construction')return e.count;const err=Error('Q-N50-4644-001：每拥有1种构造是否也使攻击先制按构造数累加');err.constructPriority1845={count:e.count,round:e.round,hp:f.hp,pp:{...f.pp}};throw err;}},
  hooks:{...oldSoul1845Scope.hooks,actionEnd(c){const e=c.a.soulState.constructSkipped1845;if(e?.round===c.round&&e.move===c.m?.id&&e.reason==='noPP'){const p=c.a.soulState.qualifiedNoPPExtra1845;if(!['eligible','ineligible'].includes(p)){const err=Error('Q-N50-4644-002：合法选择后PP被清零导致未使用是否属于选择技能且无法行动');err.constructNoPP1845={round:c.round,move:c.m.id,pp:c.a.pp[c.m.id],hp:c.a.hp,shield:c.a.suitState?.shield??0,enemyHP:c.t.hp,enemyPP:{...c.t.pp},enemyAilments:{...c.t.ailments}};throw err;}if(p==='ineligible'){delete c.a.soulState.constructSkipped1845;return;}}return oldSoul1845Scope.hooks.actionEnd(c);}}
};

