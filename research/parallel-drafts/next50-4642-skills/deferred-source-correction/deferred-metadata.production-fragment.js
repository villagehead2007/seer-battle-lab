// Optional exact-source metadata hardening only. Current production semantics already match these API clauses.
// Insert inside range-effects IIFE AFTER current4642 fragments; no phase, execute, hooks, parse, direct or validator changes.
for(const [id,text] of [
  [1510,'2回合内对手主动切换精灵则回合开始后100%随机附加1种异常状态；依赖主动切换事件、随后回合开始及新在场目标'],
  [2040,'3回合内对手主动切换精灵出战时100%失神；依赖主动换入事件与新出战目标'],
  [2105,'未击败对手则令对方场下阵亡的首位精灵消逝；依赖敌方场下阵亡顺序列表、首位选择与消逝移除']
]){
  const old=registry[id];
  registry[id]=Object.freeze({...old,deferredFor(p,m,i){
    if(bindings4642.some(b=>b.id===id&&exact4642(m,i,b,p)))return text;
    return old.deferredFor?old.deferredFor(p,m,i):old.deferred;
  }});
}
