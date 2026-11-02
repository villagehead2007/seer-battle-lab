'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3711-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3711 基础21招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3711 基础21招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3711 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3711 原版觉醒绑定及全部技能真实初始PP、宁界零PP技能与跨版拒绝',()=>{
 for(const group of source.skillVersions){const s={...structuredClone(source),selectedSoulId:group.soulId};for(const id of group.moveIds){let load=E.WIKI.defaultMoves(s);const m=s.moves.find(x=>x.id===id);if(!load.includes(id))load[load.findIndex(k=>s.moves.find(x=>x.id===k).fifth===m.fifth)]=id;assert.deepEqual(E.WIKI.assess(s,load).issues,[]);const battle=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[load,load]});assert.equal(battle.fighters[0].pp[key(id)],m.pp);if(id===38319)assert.ok(E.availableMoves(battle.fighters[0]).includes(key(id)));}
 const other=source.skillVersions.find(g=>g!==group),foreign=other.moveIds.find(id=>!group.moveIds.includes(id)&&source.moves.find(m=>m.id===id).fifth);const bad=E.WIKI.defaultMoves(s);bad[0]=foreign;assert.ok(E.WIKI.assess(s,bad).issues.length);}
});
test('3711 清弱3与710、清强736封属、945和879清回合回复的成功失败保护',()=>{
 for(const id of [3,710]){const s=make(e(id));s.fighters[0].stages.atk=-2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);if(id===710)assert.equal(o.fighters[0].effects['免弱'].end,3);const no=make(e(id));assert.equal(turn(no).fighters[0].effects['免弱'],undefined);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-2);}
 const clear=make(e(736));clear.fighters[1].stages.atk=2;const o=turn(clear);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].effects.statusBlock.end,2);assert.equal(turn(make(e(736))).fighters[1].effects.statusBlock,undefined);
 for(const id of [945,879]){const s=make(e(id),{hp:1000});timer(s,1,'doubleDamage');assert.equal(turn(s).fighters[0].hp,9000);const no=make(e(id),{hp:1000});assert.equal(turn(no).fighters[0].hp,1000);timer(s,1,'protect');assert.equal(turn(s).fighters[0].hp,1000);}
});
test('3711 58必暴和843后续先制、48免异常47免弱191反弹的真实交互',()=>{
 const start=turn(make(e(58)));assert.equal(start.fighters[0].effects['必定暴击'].end,3);const high=turn(start,900030);const base=turn(make(e(58),{omit:true}),900030);assert.ok(high.fighters[0].lastAttackDamage>base.fighters[0].lastAttackDamage);
 const pr=turn(make(e(843),{aStats:{spe:1}}));assert.equal(pr.fighters[0].effects.id984.start,2);assert.equal(turn(pr,900030,900040).turns.at(-1).first,0);
 const weak=make(e(47),{opponentMove:30671});const w=turn(weak,weak.auditMoveId,900042);assert.equal(w.fighters[0].stages.atk,0);
 for(const id of [48,191]){const s=make(e(id),{opponentMove:26358,opponentEffectId:1047});const o=turn(s,s.auditMoveId,900042);assert.equal(o.fighters[0].ailments['睡眠'],undefined);if(id===191)assert.ok(o.fighters[1].ailments['睡眠']>=2);}
});
test('3711 52先手封招720闪避和939后手实际百分比吸取',()=>{
 for(const id of [52,720]){const s=make(e(id));s.moveDefinitions[key(900040)].alwaysHit=false;const o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[0].hp,9000);const slow=make(e(id),{aStats:{spe:1}});slow.moveDefinitions[key(900040)].alwaysHit=false;assert.ok(turn(slow,slow.auditMoveId,900040).fighters[0].hp<9000);}
 const late=make(e(939),{hp:1000,aStats:{spe:1}});const o=turn(late,late.auditMoveId,900040);assert.equal(o.fighters[0].hp,4000-o.fighters[1].lastAttackDamage);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,3000);const fast=make(e(939),{hp:1000});assert.equal(turn(fast).fighters[0].hp,1000);
});
test('3711 1047睡眠成功失败吸取、971低体双吸及禁疗交互',()=>{
 let success,fail;for(let seed=0;seed<30;seed++){const s=make(e(1047),{hp:1000,seed}),o=turn(s);if(o.fighters[1].ailments['睡眠'])success=o;else fail=o;}assert.ok(success);assert.equal(success.fighters[0].hp,1000);assert.ok(fail);assert.equal(fail.fighters[0].hp,4000);
 const im=make(e(1047),{hp:1000});timer(im,1,'免异常');timer(im,0,'技能禁疗');const i=turn(im);assert.equal(i.fighters[1].hp,6000);assert.equal(i.fighters[0].hp,1000);
 for(const hp of [1000,4500]){const s=turn(make(e(971),{hp}));const o=turn(s,900031);assert.ok(o.fighters[0].hp>=s.fighters[0].hp);assert.ok(o.fighters[1].hp<s.fighters[1].hp);}
});
test('3711 1283先后手强化、1164反转与失败清回合、881弱化先制',()=>{
 for(const speed of [1,500]){const s=make(e(1283),{aStats:{spe:speed}});assert.equal(turn(s).fighters[0].stages.atk,speed===1?1:2);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);}
 const rev=make(e(1164));rev.fighters[1].stages.atk=2;assert.equal(turn(rev).fighters[1].stages.atk,-2);const clear=make(e(1164));timer(clear,1,'doubleDamage');assert.equal(turn(clear).fighters[1].effects.doubleDamage,undefined);timer(clear,1,'protect');assert.ok(turn(clear).fighters[1].effects.doubleDamage);
 const quick=make(e(881),{aStats:{spe:1}});quick.fighters[0].stages.atk=-1;assert.equal(turn(quick).turns[0].first,0);quick.fighters[0].stages.atk=0;assert.equal(turn(quick).turns[0].first,1);
});
test('3711 738对手属性触发后两回合封攻、攻击不触发与保护到期',()=>{
 const s=make(e(738)),o=turn(s);assert.equal(o.fighters[1].effects['攻击技能命中效果失效'].start,2);assert.equal(o.fighters[1].effects['攻击技能命中效果失效'].end,3);const attack=turn(o,900031,900040);assert.equal(attack.fighters[0].hp,9000);const no=turn(make(e(738)),e(738).moveId,900040);assert.equal(no.fighters[1].effects['攻击技能命中效果失效'],undefined);o.round=4;assert.ok(turn(o,900031,900040).fighters[0].hp<9000);
});
test('3711 760无微弱与842强化增伤1152无强化增伤的条件和伤害免疫',()=>{
 for(const id of [842,1152]){const run=n=>{const s=make(e(id));s.fighters[0].stages.acc=n;return turn(s).fighters[0].lastAttackDamage;};assert.ok(id===842?run(1)>run(0):run(0)>run(1));const im=make(e(id));timer(im,1,'攻击伤害免疫');assert.equal(turn(im).fighters[0].lastAttackDamage,0);}
 const s=make(e(760));const m=s.moveDefinitions[key(s.auditMoveId)];let type;for(const candidate of s.typeChart.types??[])if(E.typeEffectiveness(m.type,candidate,s.typeChart)<1){type=candidate;break;}
 // Actual chart pair search uses source aliases, including dual types.
 if(!type)type=Object.keys(s.typeChart.aliases).find(t=>E.typeEffectiveness(m.type,t,s.typeChart)<1);assert.ok(type);s.fighters[1].type=type;const o=turn(s);const base=structuredClone(s);base.moveDefinitions[key(base.auditMoveId)].operations=[];assert.ok(o.fighters[0].lastAttackDamage>turn(base).fighters[0].lastAttackDamage);
});
test('3711 1558仅下三回合暴击增伤，非暴不增伤与到期',()=>{
 const start=turn(make(e(1558)));assert.equal(start.fighters[0].effects['暴击攻击增伤'].start,2);assert.equal(start.fighters[0].effects['暴击攻击增伤'].end,4);const no=structuredClone(start);delete no.fighters[0].effects['暴击攻击增伤'];assert.equal(turn(start,900030).fighters[0].lastAttackDamage,turn(no,900030).fighters[0].lastAttackDamage);timer(start,0,'必定暴击');timer(no,0,'必定暴击');assert.ok(turn(start,900030).fighters[0].lastAttackDamage>=2*turn(no,900030).fighters[0].lastAttackDamage-1);start.round=5;no.round=5;assert.equal(turn(start,900030).fighters[0].lastAttackDamage,turn(no,900030).fighters[0].lastAttackDamage);
});
test('3711 2429有回合效果清五项PP，无效果与PP保护不清',()=>{
 const s=make(e(2429));timer(s,1,'doubleDamage');const o=E.resolveTurn(s,[key(s.auditMoveId),'potion:hp']);assert.ok(Object.values(o.fighters[1].pp).every(n=>n===0));const no=E.resolveTurn(make(e(2429)),[key(s.auditMoveId),'potion:hp']);assert.ok(Object.values(no.fighters[1].pp).every(n=>n===99));timer(s,1,'PP保护');assert.ok(Object.values(E.resolveTurn(s,[key(s.auditMoveId),'potion:hp']).fighters[1].pp).every(n=>n===99));
});

test('3711 939后手名义回复在伤害免疫溢出禁疗先手边界保持真实状态',()=>{const o=require('./helpers/assert-939-nominal-heal.cjs')(3711);assert.equal(o.fighters[0].hp,1000);});
