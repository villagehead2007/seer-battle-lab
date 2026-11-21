'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),L=require('../local-species.cjs'),P=require('../completion-policy.cjs'),{loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round120-conditional-native-input-20261113.json'),leaves=rows.filter(r=>r.category==='leaf'),keys=['atk','def','spa','spd','spe','acc'],stats={maxHp:9000,atk:180,spa:360,def:4000,spd:4000,spe:9999};
function make(row,o={}){const source=E.WIKI.versionSnapshots(L.species(row.id)).find(s=>P.digest(s)===row.snapshotDigest);assert.ok(source);const enemy=L.species(o.enemy??3056),plain=source.moves.find(m=>m.power>0&&!m.fifth&&!m.effectInstances.length);assert.ok(plain);const s=E.createBattle({wikiSnapshots:[source,enemy],wikiLoadouts:[loadout(source,[row.move,plain.id]),loadout(enemy,o.enemy===3318?[21076]:[10127,20117,23285])],builds:[{overrides:{...stats,atk:o.atk??stats.atk,spe:o.late?1:9999}},{overrides:{...stats,maxHp:9999,def:o.def??4000,spe:o.late?9999:1}}],seed:o.seed??14,criticals:false}),a=s.fighters[0],t=s.fighters[1];a.hp=o.aHp??8000;t.hp=o.tHp??9999;a.stages.acc=[1119,425,877].includes(row.effect)?0:6;if(o.ownNegative)a.stages.atk=-2;if(o.ownBoost)a.stages.atk=2;if(o.boost)t.stages.atk=2;if(o.protect)t.effects['强化保护']={start:1,end:99};if(o.buff)t.effects['攻击必中']={start:1,end:99};if(o.ailment)t.ailments['失明']=3;if(o.immune)t.counts.immune=20;if(o.weakImmune){t.effects['免弱']={start:1,end:99};t.effects.protect={start:1,end:99};}if(o.noBoost)a.effects['禁强化']={start:1,end:99};if(o.skillHealBlock)a.effects['技能禁疗']={start:1,end:99};if(o.pinkImmune)t.effects['固定百分比免疫']={start:1,end:99};if(o.ppProtect)t.effects['PP保护']={start:1,end:99};
 if(o.mode==='control')a.ailments['疲惫']=2;if(o.mode==='invalid')a.effects.skillBlock={start:1,end:1};if(o.mode==='zero')a.pp['wiki:'+row.move]=0;assert.equal(a.soulId,row.soul);assert.deepEqual(s.moveDefinitions['wiki:'+row.move].operations.map(x=>[Number(x.effectId),x.index,x.phase,x.sourceArgs]),row.operations);return{s,plain:plain.id};}
function turn(s,action,enemy='potion:pp'){const old=E.WIKI.effectsEngine,frames={},mid=typeof action==='number'?action:Number(String(action).replace('wiki:',''));E.WIKI.effectsEngine={...old,run(phase,ops,c){const before={a:structuredClone(c.a),t:structuredClone(c.t)},value=old.run(phase,ops,c);if(c.a.side===0&&(c.m.wikiId??c.m.id)===mid)frames[phase]={before,a:structuredClone(c.a),t:structuredClone(c.t),first:c.first};if(c.a.side===1&&(c.m.wikiId??c.m.id)===21076&&phase==='afterHit')frames.heal={before:before.a.hp,after:c.a.hp};return value;}};try{return{out:E.resolveTurn(s,[typeof action==='number'?'wiki:'+action:action,typeof enemy==='number'?'wiki:'+enemy:enemy]),frames};}finally{E.WIKI.effectsEngine=old;}}
function cast(row,o={}){const x=make(row,o);if(o.mode==='zero'){const before=structuredClone(x.s);assert.throws(()=>turn(x.s,row.move),/请选择|有 PP/);assert.deepEqual(x.s,before);return{...x,frames:{}};}return{...x,...turn(x.s,o.mode==='potion'?'potion:pp':row.move,o.enemyAction??'potion:pp')};}
function gates(row){for(const mode of['control','invalid','potion','zero'])assert.equal(cast(row,{mode,immune:true}).frames.afterHit,undefined,row.key+':'+mode);}
const sum=(s,round,type,side=0)=>(s.damageEvents??[]).filter(e=>e.round===round&&e.sourceSide===side&&e.type===type).reduce((n,e)=>n+e.settledDamage,0),events=s=>s.turns.at(-1).events;

test('克罗诺斯完整23123原版本整招保原PP全部有序指令，已核469组件组合并实际触害怕',()=>{
 for(const row of rows.filter(x=>x.category==='parent')){const x=cast(row,{enemyAction:20117});assert.equal(x.out.fighters[0].pp['wiki:'+row.move],row.pp-1);assert.equal(x.out.moveDefinitions['wiki:'+row.move].kind,'status');assert.deepEqual(x.frames.afterHit.a.effects['对手属性后指定异常'],{start:1,end:3,chance:100,ailment:'害怕'});assert.ok(x.out.fighters[1].ailments['害怕']>=2);gates(row);}
});

test('六条原清强反弱吸强来源真实成功才授原免异先制封属封攻禁疗，空条件与保护失败不授且原期限恢复',()=>{
 for(const row of leaves.filter(x=>[788,1119,1056,1060,797].includes(x.effect))){
  if(row.effect===788){for(const boost of[false,true]){const x=cast(row,{boost});assert.equal(x.frames.afterHit.t.stages.atk,0);assert.equal(!!x.frames.afterHit.a.effects['免异常'],boost);if(boost)assert.deepEqual(x.frames.afterHit.a.effects['免异常'],{start:1,end:1});}}
  if(row.effect===1119){for(const side of['none','own','foe']){const x=cast(row,{ownBoost:side==='own',boost:side==='foe'});assert.equal(x.frames.afterHit.a.stages.atk,0);assert.equal(x.frames.afterHit.t.stages.atk,0);assert.equal(!!x.frames.afterHit.a.effects.id984,side!=='none');if(side!=='none'){assert.deepEqual(x.frames.afterHit.a.effects.id984,{start:2,end:2,amount:2});const out=turn(x.out,x.plain,10127).out;assert.equal(out.turns.at(-1).first,0);}}}
  if(row.effect===1056){for(const negative of[false,true]){const x=cast(row,{ownNegative:negative});assert.equal(x.frames.afterHit.a.stages.atk,negative?2:0);assert.equal(!!x.frames.afterHit.t.effects.statusBlock,negative);if(negative){assert.deepEqual(x.frames.afterHit.t.effects.statusBlock,{start:1,end:2});const b=turn(x.out,'potion:pp',20117).out;assert.equal(b.fighters[1].stages.atk,0);const c=turn(b,'potion:pp',20117).out;assert.equal(c.fighters[1].stages.atk,1);}}}
  if(row.effect===1060){for(const mode of['empty','success','protected']){const x=cast(row,{boost:mode!=='empty',protect:mode==='protected',immune:true});assert.equal(x.frames.afterHit.t.stages.atk,mode==='protected'?2:0);assert.equal(x.frames.afterHit.a.stages.atk,mode==='success'?2:0);assert.equal(!!x.frames.afterHit.t.effects.attackBlock,mode==='success');if(mode==='success'){assert.deepEqual(x.frames.afterHit.t.effects.attackBlock,{start:2,end:2});const b=turn(x.out,'potion:pp',10127).out;assert.equal(sum(b,2,'attack',1),0);const c=turn(b,'potion:pp',10127).out;assert.ok(sum(c,3,'attack',1)>0);}}}
  if(row.effect===797){for(const buff of[false,true]){const x=cast(row,{enemy:3318,tHp:8000,late:true,buff,immune:true});assert.equal(!!x.frames.afterHit.t.effects['技能禁疗'],buff);if(buff){assert.deepEqual(x.frames.afterHit.t.effects['技能禁疗'],{start:1,end:2});const active=turn(x.out,'potion:pp',21076);assert.equal(active.frames.heal.after,active.frames.heal.before);let waiting=x.out;while(waiting.round<3)waiting=turn(waiting,'potion:pp').out;const ended=turn(waiting,'potion:pp',21076);assert.equal(ended.frames.heal.after,9999);}}}
  gates(row);
 }
});

test('425两原招六合法版本随机两项无放回各负2正2，免弱不补抽且独立加己，禁强只阻自身',()=>{
 for(const row of leaves.filter(x=>x.effect===425))for(const mode of['ordinary','weakImmune','noBoost']){const x=cast(row,{weakImmune:mode==='weakImmune',noBoost:mode==='noBoost',immune:true}),a=x.frames.afterHit.a.stages,t=x.frames.afterHit.t.stages;assert.equal(keys.filter(k=>a[k]===2).length,mode==='noBoost'?0:2);assert.equal(keys.filter(k=>t[k]===-2).length,mode==='weakImmune'?0:2);if(mode==='ordinary')assert.deepEqual(keys.filter(k=>a[k]===2),keys.filter(k=>t[k]===-2));}
 for(const row of leaves.filter(x=>x.effect===425))gates(row);
});

test('原1120低红280给200盾而423按原目标防御附固，847原400盾与46两次免攻实际消费不混相邻原效果',()=>{
 for(const row of leaves.filter(x=>x.effect===1120))for(const atk of[1,9999]){const x=cast(row,{atk,immune:true}),red=sum(x.out,1,'attack');assert.equal(red<280,atk===1);assert.equal(x.frames.afterAttack.a.suitState.shield,red<280?200:0);}
 for(const row of leaves.filter(x=>x.effect===423))for(const def of[400,1600]){const x=cast(row,{def,immune:true,late:true,enemyAction:20117});assert.equal(x.frames.afterHit.first,1);assert.equal(x.frames.afterHit.before.t.hp-x.frames.afterHit.t.hp,def);assert.equal(sum(x.out,1,'fixed'),def+2000,'original soul635 late fixed2000 is retained separately');}
 for(const row of leaves.filter(x=>x.effect===847)){const x=cast(row,{immune:true});assert.equal(x.frames.afterHit.a.suitState.shield,400);assert.equal(x.frames.afterHit.a.counts.attackNullify,1);const first=turn(x.out,'potion:pp',10127).out;assert.equal(first.fighters[0].suitState.shield,400);assert.equal(first.fighters[0].counts.attackNullify,0);const second=turn(first,'potion:pp',10127).out;assert.ok(second.fighters[0].suitState.shield<400);}
 for(const row of leaves.filter(x=>x.effect===46)){let s=cast(row).out;assert.equal(s.fighters[0].counts.attackNullify,2);for(const expected of[1,0]){s=turn(s,'potion:pp',10127).out;assert.equal(s.fighters[0].counts.attackNullify,expected);assert.equal(sum(s,s.round-1,'attack',1),0);}s=turn(s,'potion:pp',10127).out;assert.ok(sum(s,s.round-1,'attack',1)>0);}
 for(const row of leaves.filter(x=>[1120,423,847,46].includes(x.effect)))gates(row);
});

test('575两原特殊必命中招仅敌真实异常才按本次红伤回复，空条件及技能禁疗不回，满血封顶不删原魂',()=>{
 for(const row of leaves.filter(x=>x.effect===575))for(const mode of['normal','ailment','blocked','full']){const x=cast(row,{ailment:mode!=='normal',skillHealBlock:mode==='blocked',aHp:mode==='full'?9000:8000}),frame=x.frames.afterAttack,red=sum(x.out,1,'attack'),expected=mode==='ailment'?Math.min(9000-frame.before.a.hp,red):0;assert.ok(red>0);assert.equal(frame.a.hp-frame.before.a.hp,expected);assert.equal(x.out.fighters[0].soulId,758);}
 for(const row of leaves.filter(x=>x.effect===575))gates(row);
});

test('532两原四回来源实际回复3000封顶50满血0对应等量粉，禁疗与免粉分开，药剂不触发且原四回到期',()=>{
 for(const row of leaves.filter(x=>x.effect===532)){
  for(const[hp,blocked,immune,expected]of[[1000,false,false,3000],[8950,false,false,50],[9000,false,false,0],[1000,true,false,0],[1000,false,true,0]]){const x=cast(row,{aHp:hp,skillHealBlock:blocked,pinkImmune:immune,immune:true});assert.deepEqual(x.frames.afterHit.a.effects['用招回血粉伤'],{start:1,end:4,fraction:1/3});assert.equal(sum(x.out,1,'percent'),expected);if(hp<9000&&!blocked)assert.ok(events(x.out).some(e=>e.kind==='heal'&&e.text.includes('用招回血粉伤')),row.key+':'+hp);}
  const ready=cast(row,{immune:true}),potion=turn(ready.out,'potion:pp').out;assert.ok(!events(potion).some(e=>e.kind==='heal'&&e.text.includes('用招回血粉伤')));let s=ready.out;while(s.round<=4)s=turn(s,'potion:pp').out;assert.equal(s.fighters[0].effects['用招回血粉伤'],undefined);const ended=turn(s,ready.plain).out;assert.ok(!events(ended).some(e=>e.kind==='heal'&&e.text.includes('用招回血粉伤')));gates(row);
 }
});

test('原163六选一与152指定睡眠仅实际属性用后触发，免异阻挡药剂攻击阴性并原三回窗到期不迟补',()=>{
 const pool=['烧伤','冻伤','中毒','麻痹','害怕','睡眠'];for(const row of leaves.filter(x=>[163,152].includes(x.effect))){
  for(const requested of[2,3,4]){const ready=cast(row,{ppProtect:true});let s=ready.out;while(s.round<requested)s=turn(s,'potion:pp').out;s=turn(s,'potion:pp',20117).out;const active=Object.entries(s.fighters[1].ailments).filter(([,end])=>end>=requested);assert.equal(active.length,requested<=3?1:0);if(active.length){assert.ok(row.effect===152?active[0][0]==='睡眠':pool.includes(active[0][0]));assert.ok([2,3].includes(active[0][1]-requested+1));}}
  const ready=cast(row,{ppProtect:true,immune:true});const blocked=turn(ready.out,'potion:pp',20117).out;assert.deepEqual(blocked.fighters[1].ailments,{});const no=cast(row,{ppProtect:true});for(const action of['potion:pp',10127])assert.deepEqual(turn(no.out,'potion:pp',action).out.fighters[1].ailments,{});gates(row);
 }
});

test('原877顺序在原585全加1之后仅先手再全加1，后手不追溯且保完整吸取反应与原魂645',()=>{
 for(const row of leaves.filter(x=>x.effect===877))for(const late of[false,true]){const x=cast(row,{late,immune:true,enemyAction:20117});assert.equal(x.frames.afterHit.first,late?1:0);for(const key of keys)assert.equal(x.frames.afterHit.a.stages[key],late?1:2);assert.equal(x.out.fighters[0].stages.spe,late?3:4,'original soul645 separately adds two speed stages at the end');assert.equal(x.out.fighters[0].soulId,645);assert.equal(sum(x.out,1,'percent'),3333,'adjacent original597 keeps its already-confirmed percentage damage classification; 吸取 is not globally reclassified as 汲取');}
 for(const row of leaves.filter(x=>x.effect===877))gates(row);
});
