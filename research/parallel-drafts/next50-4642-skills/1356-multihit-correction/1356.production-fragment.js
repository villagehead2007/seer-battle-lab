// Current-source correction only. Source1356/4daf0872,37348/9e655a90/i2/[3].
// Retains old1356 phase, parse/direct, validator and every other owner.
{
  const old1356Multi4642=registry[1356];
  const exact1356Multi4642=(c,p)=>(c.m?.wikiId??c.m?.id)===37348&&(c.m?.hash==='9e655a90'||c.m?.revision==='seerapi:9e655a90')&&c.effectInstanceIndex===2&&p.length===1&&p[0]===3;
  const token1356Multi4642=c=>c.round+':'+c.m.id+':'+c.effectUseCount();
  registry[1356]=Object.freeze({...old1356Multi4642,
    execute(c,p){
      if(!exact1356Multi4642(c,p)||(c.a.soulState.attackSegmentsThisUse??1)<=1)return old1356Multi4642.execute(c,p);
      if(!c.crit||c.t.hp<=0)return;
      const policy=c.a.soulState.qualified1356Unit4642;
      if(!['per-critical-hit','skill-end-once'].includes(policy))throw Error('Q-N50-4642-010：1356真实多段暴击附加百分伤的单位与施加时点待确认');
      if(policy==='per-critical-hit')return old1356Multi4642.execute(c,p);
      const token=token1356Multi4642(c),existing=c.a.soulState.pending1356Multi4642;
      if(existing?.token===token)existing.eligibleCriticalHits++;
      else c.a.soulState.pending1356Multi4642={token,eligibleCriticalHits:1};
    },
    hooks:{...old1356Multi4642.hooks,afterAttack(c,p){
      if(!exact1356Multi4642(c,p))return old1356Multi4642.hooks?.afterAttack?.(c,p);
      const e=c.a.soulState.pending1356Multi4642;
      if(e?.token!==token1356Multi4642(c))return;
      delete c.a.soulState.pending1356Multi4642;
      if(c.a.soulState.qualified1356Unit4642==='skill-end-once'&&e.eligibleCriticalHits>0&&c.t.hp>0)return old1356Multi4642.execute({...c,crit:true},p);
    }}
  });
}
