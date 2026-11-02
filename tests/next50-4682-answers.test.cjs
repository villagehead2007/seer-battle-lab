'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,timer,sum}=require('./helpers/4682-battle.cjs');
const row=id=>source.moves.flatMap(m=>m.effectInstances.map((e,index)=>({move:m.id,index,...e}))).find(x=>x.id===id);
test('4682真实1100增伤与817易伤均不放大固定百分比真实伤害，持续窗口内各扣50HP',()=>{
  for(const effect of[1100,817]){
    const trigger=make(row(effect));
    if(effect===1100){timer(trigger,1,'免异常');turn(trigger,trigger.auditMoveId,28832);}else turn(trigger,trigger.auditMoveId,37553);
    const held=effect===1100?trigger.fighters[0].effects.id913:trigger.fighters[1].effects['其他技能易伤'];assert.ok(held);
    for(const type of['fixed','percent','true']){
      const s=make({move:28832,index:-1});s.round=2;
      const owner=effect===1100?s.fighters[0]:s.fighters[1];owner.effects[effect===1100?'id913':'其他技能易伤']=structuredClone(held);
      const before=s.fighters[1].hp,old=E.SOULS;
      E.SOULS={...old,run(event,c){old.run(event,c);if(event==='afterUse'&&c.a.side===0)c.hurt(c.t,50,'4682非红范围验证',type);}};
      try{turn(s,28832,28832);}finally{E.SOULS=old;}
      assert.equal(sum(s,type),50);assert.equal(s.fighters[1].hp,before-50);
    }
  }
});
