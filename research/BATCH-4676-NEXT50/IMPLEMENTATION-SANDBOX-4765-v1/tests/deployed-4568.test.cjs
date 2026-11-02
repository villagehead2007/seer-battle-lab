'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4568-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0],sum=(s,side,type)=>(s.damageEvents??[]).filter(x=>x.round===s.round-1&&x.targetSide===side&&x.type===type).reduce((a,x)=>a+x.settledDamage,0);
test('4568全部17技能与真实1778原生运行，低HP弱化改变后续先制条件，PP与吸取实际变化',()=>{
 for(const m of source.moves){const b=structuredClone(source);b.id=920768;b.souls=[];const fifth=source.moves.find(x=>x.fifth),regular=source.moves.filter(x=>!x.fifth),load=m.fifth?[...regular.slice(0,4),m]:[m,...regular.filter(x=>x.id!==m.id).slice(0,3),fifth];
  const s=E.createBattle({wikiSnapshots:[source,b],wikiLoadouts:[load.map(x=>x.id),load.map(x=>x.id)],criticals:false,builds:[{overrides:{maxHp:9000,spe:500}},{overrides:{maxHp:9000,spe:100}}]});s.rng=123;const o=E.resolveTurn(s,[key(m.id),key(load[0].id)]);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,'真实源PP '+m.id);assert.equal(o.fighters[0].soulState.resolvedPriority.value,m.priority+1);assert.ok(o.fighters[0].hp>0);
 }
});
test('4568 1612完整多段技能合计200加200不满足低350，合计300仅触发一次',()=>{
 for(const amount of [150,200]){const s=make(e(1612));s.moveDefinitions[key(s.auditMoveId)].power=0;const old=E.SOULS;let injected=false;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeUse'&&c.a.side===1&&!injected){injected=true;c.hurt(c.t,amount,'同一完整技能第一笔','fixed');c.hurt(c.t,amount,'同一完整技能第二笔','true');}}};let o;try{o=turn(s);}finally{E.SOULS=old;}assert.equal(o.fighters[0].soulState.jiege1612Window.amount,2*amount);assert.equal(o.fighters[0].soulState.jiege1612Window.resolved,true);assert.equal(!!o.fighters[1].ailments['沉默'],amount===150);assert.equal(sum(o,1,'fixed'),0);}
});
test('4568 1612技能窗口相互独立，零伤不创建响应，来源异常免疫失败补固仅一次',()=>{
 const s=make(e(1612));s.moveDefinitions[key(s.auditMoveId)].power=0;timer(s,1,'免异常');const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeUse'&&c.a.side===1){c.hurt(c.t,100,'一招第一笔','fixed');c.hurt(c.t,100,'一招第二笔','true');}}};let o;try{o=turn(s);o=turn(o,920031);}finally{E.SOULS=old;}assert.equal(sum(o,1,'fixed'),350);assert.equal(o.fighters[0].soulState.jiege1612Window.amount,200);assert.equal(o.fighters[1].hp,8300);
});
test('4568 764监听真实攻击MISS或整招无效仍使用扣粉，控制不使用保PP，免粉不改上限',()=>{
 for(const mode of ['normal','miss','blocked','control','immune']){const s=make(e(764));if(mode==='miss')s.fighters[1].ailments['失明']=3;if(mode==='blocked')s.fighters[1].counts.nextAttackInvalid=1;if(mode==='control')s.fighters[1].ailments['疲惫']=3;if(mode==='immune')timer(s,1,'固定百分比免疫');const pp=s.fighters[1].pp[key(920040)],o=turn(s,s.auditMoveId,920040);assert.equal(sum(o,1,'percent'),mode==='control'||mode==='immune'?0:3000);assert.equal(o.fighters[1].stats.maxHp,9000);assert.equal(o.fighters[1].pp[key(920040)],pp-(mode==='control'?0:1));}
});
