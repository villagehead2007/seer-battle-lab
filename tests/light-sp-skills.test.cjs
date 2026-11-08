'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/light-source-battle.cjs');
const make=(move,options={})=>H.make(move,{id:13311,...options});
test('SP2603神灵变系且忽略对手正负先制，2604只在神灵形态忽略攻击减伤',()=>{
 const s=make(38624,{index:0});s.fighters[0].type='神灵';s.moveDefinitions['wiki:'+H.HIT].priority=5;assert.ok(H.turn(s,38624,H.HIT).turns[0].events[0].text.includes('A 方 先手'));
 const no=make(38624,{index:0});no.moveDefinitions['wiki:'+H.HIT].priority=5;assert.ok(H.turn(no,38624,H.HIT).turns[0].events[0].text.includes('B 方 先手'));
 const negative=make(38624,{index:0});negative.fighters[0].type='神灵';H.timer(negative,0,'id984',{amount:-4});negative.moveDefinitions['wiki:'+H.HIT].priority=-3;const reordered=H.turn(negative,38624,H.HIT);assert.ok(reordered.turns[0].events[0].text.includes('B 方 先手'));assert.ok(reordered.fighters[0].hp<600);
 for(const deity of[false,true]){const a=make(38625,{index:0}),b=make(38625,{index:0});if(deity)a.fighters[0].type=b.fighters[0].type='神灵';H.timer(a,1,'全伤害减半');a.rng=b.rng=1024;const reduced=H.sum(H.turn(a),'attack'),normal=H.sum(H.turn(b),'attack');if(deity)assert.equal(reduced,normal);else assert.ok(reduced>=normal*.45&&reduced<=normal*.55);}
});
test('SP2444真实吸强成功封属，无强化则授未来攻击先制，强化保护令吸取失败',()=>{
 const s=make(38624,{index:2});s.fighters[1].stages.atk=2;const out=H.turn(s);assert.equal(out.fighters[1].stages.atk,0);assert.equal(out.fighters[0].stages.atk,2);assert.ok(out.fighters[1].effects.statusBlock);const empty=H.turn(make(38624,{index:2}));assert.equal(empty.fighters[0].effects['攻击先制'].amount,1);assert.equal(empty.fighters[0].effects['攻击先制'].start,2);const protectedState=make(38624,{index:2});protectedState.fighters[1].stages.atk=2;H.timer(protectedState,1,'强化保护');const failed=H.turn(protectedState);assert.equal(failed.fighters[1].stages.atk,2);assert.equal(failed.fighters[0].stages.atk,0);
});
test('SP2570技能MISS才清回合并回满，命中零伤不执行无效补偿，禁疗仍生效',()=>{
 const s=make(38624,{index:3,hp:100});H.timer(s,0,'攻击必失');H.timer(s,1,'攻击必中');const out=H.turn(s);assert.equal(out.fighters[0].hp,900);assert.equal(out.fighters[1].effects['攻击必中'],undefined);
 const zero=make(38624,{index:3,hp:100});H.timer(zero,1,'攻击伤害免疫');assert.equal(H.turn(zero).fighters[0].hp,100);const blocked=make(38624,{index:3,hp:100});H.timer(blocked,0,'攻击必失');H.timer(blocked,0,'技能禁疗');assert.equal(H.turn(blocked).fighters[0].hp,100);
});
test('SP1926未来两次攻击无视免攻且属性不消费，924未来命中按目标最大HP理论吸取',()=>{
 const s=make(29502,{index:2});let state=H.turn(s);assert.equal(state.fighters[0].counts.nextAttackIgnoreImmunity,2);state=H.turn(state,H.WAIT);assert.equal(state.fighters[0].counts.nextAttackIgnoreImmunity,2);H.timer(state,1,'攻击伤害免疫');const out=H.turn(state,H.HIT);assert.equal(out.fighters[0].counts.nextAttackIgnoreImmunity,1);assert.ok(H.sum(out,'attack')>0);
 const drain=H.turn(make(29502,{index:3,hp:100}));const healed=H.turn(drain,H.HIT);assert.equal(healed.fighters[0].hp,900);assert.ok(H.sum(healed,'percent')>=3000);const miss=H.turn(make(29502,{index:3,hp:100}));miss.moveDefinitions['wiki:'+H.HIT].alwaysHit=false;H.timer(miss,0,'攻击必失');assert.equal(H.turn(miss,H.HIT).fighters[0].hp,100);
});
test('SP1886回合被清后对方下一回合减攻100%，保护阻止清除则不授惩罚',()=>{
 const s=H.turn(make(29502,{index:4,enemyMove:23800}));const out=H.turn(s,H.WAIT,23800);assert.equal(out.fighters[1].effects['攻击伤害倍数'].multiple,0);assert.equal(out.fighters[1].effects['攻击伤害倍数'].start,3);const zero=H.turn(out,H.WAIT,H.HIT);assert.equal(zero.fighters[0].hp,out.fighters[0].hp);assert.ok(H.turn(zero,H.WAIT,H.HIT).fighters[0].hp<zero.fighters[0].hp);
 const held=H.turn(make(29502,{index:4,enemyMove:23800}));H.timer(held,0,'protect');const no=H.turn(held,H.WAIT,23800);assert.equal(no.fighters[1].effects['攻击伤害倍数'],undefined);
});
test('SP1669当前自身35%翻倍有真实成功失败；1647按理论吸取、低体双倍、免粉补300真伤',()=>{
 const seen=new Set();for(let i=1;i<=24&&seen.size<2;i++){const s=make(29503,{index:0});s.rng=(i*0x9e3779b9)>>>0;const out=H.turn(s);seen.add(out.fighters[0].stages.atk);assert.equal(out.fighters[0].stages.def,out.fighters[0].stages.atk);}assert.deepEqual([...seen].sort(),[1,2]);
 const s=make(29503,{index:1,hp:100});H.timer(s,1,'固定百分比免疫');const out=H.turn(s);assert.equal(out.fighters[0].hp,900);assert.equal(H.sum(out,'percent'),0);assert.equal(H.sum(out,'true'),300);assert.equal(out.fighters[1].hp,8700);
 const no=make(29503,{index:1,hp:100});H.timer(no,0,'技能禁疗');const blocked=H.turn(no);assert.equal(blocked.fighters[0].hp,100);assert.equal(H.sum(blocked,'percent'),6000);
});
test('SP1840只在暴击增红100%，1962/1963未击败才清回合与清强，1167解弱成功才回满',()=>{
 const a=make(38625,{index:2}),b=make(38625,{index:2});a.criticals=b.criticals=true;H.timer(a,0,'必定暴击');H.timer(b,0,'必定暴击');b.moveDefinitions['wiki:38625'].operations=[];a.rng=b.rng=1024;assert.ok(H.sum(H.turn(a),'attack')>H.sum(H.turn(b),'attack')*1.8);
 const clear=make(38625);clear.fighters[1].stages.atk=2;H.timer(clear,1,'攻击必中');const out=H.turn(clear);assert.equal(out.fighters[1].stages.atk,0);assert.equal(out.fighters[1].effects['攻击必中'],undefined);
 const heal=make(38626,{index:1,hp:100});heal.fighters[0].stages.atk=-2;assert.equal(H.turn(heal).fighters[0].hp,900);assert.equal(H.turn(make(38626,{index:1,hp:100})).fighters[0].hp,100);const protect=make(38626,{index:1,hp:100});protect.fighters[0].stages.atk=-2;H.timer(protect,0,'弱化不可解除反转');assert.equal(H.turn(protect).fighters[0].hp,100);
});
test('SP2606部分免异也封疲惫分支，2607免弱封全弱，2608/2609次数免固粉均封对应附伤且查询不消费',()=>{
 const plain=H.turn(make(38626,{index:2}));assert.ok(plain.fighters[1].ailments['疲惫']>=1);const partial=make(38626,{index:2});H.timer(partial,0,'免异常反弹除流血');assert.equal(H.turn(partial).fighters[1].ailments['疲惫'],undefined);const count=make(38626,{index:2});count.fighters[0].counts.immune=1;const held=H.turn(count);assert.equal(held.fighters[0].counts.immune,1);assert.equal(held.fighters[1].ailments['疲惫'],undefined);
 const weak=make(38626,{index:3});H.timer(weak,0,'免弱');assert.equal(H.turn(weak).fighters[1].stages.atk,0);assert.equal(H.turn(make(38626,{index:3})).fighters[1].stages.atk,-1);
 for(const [index,type,amount]of[[5,'fixed',200],[4,'percent',1800]]){assert.equal(H.sum(H.turn(make(38626,{index})),type),amount);const s=make(38626,{index});s.fighters[0].counts.nextPinkImmunity=1;const out=H.turn(s);assert.equal(H.sum(out,type),0);assert.equal(out.fighters[0].counts.nextPinkImmunity,1);}
});
test('SP首次第五自身变系后当前一击立即用神灵属性，原本神灵与本次才变系结算一致',()=>{
 const a=make(38626,{index:0,soul:true}),b=make(38626,{index:0,soul:true});b.fighters[0].type='神灵';a.rng=b.rng=1024;const fresh=H.turn(a),deity=H.turn(b);assert.equal(fresh.fighters[0].type,'神灵');assert.equal(H.sum(fresh,'attack'),H.sum(deity,'attack'));
});
test('SP原本致死免攻同源刷新1且完整抵挡一次，下一次无新授予时恢复正常伤害',()=>{
 const s=make(38625,{index:2,soul:true,targetHp:1});H.timer(s,1,'致命保留',{hp:1});let state=H.turn(s);assert.equal(state.fighters[0].soulState.divineVessel.attackGuard,1);state=H.turn(state);assert.equal(state.fighters[0].soulState.divineVessel.attackGuard,1);const blocked=H.turn(state,H.WAIT,H.HIT);assert.equal(blocked.fighters[0].soulState.divineVessel.attackGuard,0);const last=blocked.damageEvents.filter(e=>e.round===3&&e.sourceSide===1&&e.type==='attack');assert.equal(last.reduce((n,e)=>n+e.settledDamage,0),0);const next=H.turn(blocked,H.WAIT,H.HIT);assert.ok(next.damageEvents.some(e=>e.round===4&&e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));
});
