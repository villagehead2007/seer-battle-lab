'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4618-battle.cjs');
const entry=id=>H.entries.find(x=>x.id===id),damage=(s,type='attack',side=1)=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.type===type&&x.targetSide===side).reduce((n,x)=>n+x.settledDamage,0);
test('4618主线窥目视龙只限魂印两条，草系实际属性不变且1490不误判天敌，解放无异常正常害怕',()=>{
  const e=H.entries.find(x=>x.id===1490),s=H.make(e,{soul:1824,bType:'草'}),old=H.E.SOULS;let granted=false;
  assert.equal(H.E.typeEffectiveness('草',H.source.type,H.source.typeChart),1);
  H.E.SOULS={...old,run(event,c){if(!granted&&event==='roundStart'&&c.a.side===0){granted=true;old.registry[1824].abilities.grantGaze(c);assert.equal(c.t.type,'草');}old.run(event,c);}};
  let o;try{o=H.turn(s);}finally{H.E.SOULS=old;}
  assert.equal(o.fighters[1].type,'草');
  assert.equal(o.fighters[1].ailments['沉默'],undefined);
  assert.equal(o.fighters[1].effects['属性技能命中效果失效'],undefined);
  assert.ok(o.fighters[1].ailments['害怕']>0);
  assert.equal(!!o.fighters[1].soulState.specialStates?.gaze1824,false);
  assert.equal(o.fighters[0].pp[H.key(e.moveId)],H.source.moves.find(m=>m.id===e.moveId).pp-1);
});
test('4618主线1553严格高半体力才附加完整红伤30百分伤，4499和4500不触发4501触发且真实扣PP',()=>{
  for(const hp of [4499,4500,4501]){const e=entry(1553),s=H.make(e,{hp,aStats:{spa:3000}});H.timer(s,1,'攻击伤害上限',{amount:501});const o=H.turn(s),extra=hp>4500?150:0;
    assert.equal(damage(o),501);assert.equal(damage(o,'percent'),extra);assert.equal(o.fighters[1].hp,9000-501-extra);assert.equal(o.fighters[0].hp,hp);assert.equal(o.fighters[0].pp[H.key(e.moveId)],H.source.moves.find(m=>m.id===e.moveId).pp-1);}
});
test('4618主线1553用完整501而非实际损失199作基数，保留1HP下追加150完整百分伤且实际再损0',()=>{
  const s=H.make(entry(1553),{hp:6000,targetHp:200,aStats:{spa:3000}});H.timer(s,1,'攻击伤害上限',{amount:501});H.timer(s,1,'致命保留',{hp:1});const o=H.turn(s),events=o.damageEvents.filter(x=>x.round===1&&x.targetSide===1);
  assert.equal(damage(o),501);assert.equal(damage(o,'percent'),150);assert.equal(events.find(x=>x.type==='attack').hpLoss,199);assert.equal(events.find(x=>x.type==='percent').hpLoss,0);assert.equal(o.fighters[1].hp,1);
});
test('4618主线1553百分伤免疫不免本体501，攻击完全免疫时本体及比例附伤均0',()=>{
  for(const mode of ['pink','attack']){const s=H.make(entry(1553),{hp:6000,aStats:{spa:3000}});H.timer(s,1,'攻击伤害上限',{amount:501});if(mode==='pink')H.timer(s,1,'固定百分比免疫');else H.timer(s,1,'概率攻击免疫',{chance:100});const o=H.turn(s);assert.equal(damage(o),mode==='pink'?501:0);assert.equal(damage(o,'percent'),0);assert.equal(o.fighters[1].hp,mode==='pink'?8499:9000);}
});
test('4618主线2100普通盾和攻击盾正1边界均倍红伤，零盾或仅护罩不翻倍且真实HP同步',()=>{
  const e=entry(2100);for(const mode of ['zero','shield1','shield300','attack1','barrier']){const s=H.make(e),control=H.make({...e,index:-1});for(const x of [s,control]){if(mode.startsWith('shield'))x.fighters[0].suitState.shield=mode==='shield1'?1:300;if(mode==='attack1')x.fighters[0].soulState.attackShield=1;if(mode==='barrier')x.fighters[0].suitState.barrier=300;}const o=H.turn(s),plain=H.turn(control),n=damage(o),base=damage(plain),doubles=['shield1','shield300','attack1'].includes(mode);assert.ok(base>0);if(doubles)assert.ok(Math.abs(n-2*base)<=1,'只容许最终整数伤害的单点取整差');else assert.equal(n,base);assert.equal(o.fighters[1].hp,9000-n);assert.equal(o.fighters[0].pp[H.key(e.moveId)],H.source.moves.find(m=>m.id===e.moveId).pp-1);}
});
test('4618主线2100本次出手前普通盾已被敌先手耗尽则立即不翻倍，原盾真正消费',()=>{
  const e=entry(2100),s=H.make(e,{aStats:{spe:1},bStats:{spe:500}}),control=H.make({...e,index:-1},{aStats:{spe:1},bStats:{spe:500}});for(const x of [s,control])x.fighters[0].suitState.shield=1;const o=H.turn(s,e.moveId,920040),plain=H.turn(control,e.moveId,920040);assert.equal(o.turns[0].first,1);assert.equal(o.fighters[0].suitState.shield,0);assert.ok(o.fighters[0].hp<9000);assert.equal(damage(o),damage(plain));assert.ok(damage(o)>0);assert.equal(o.fighters[1].hp,9000-damage(o));
});
