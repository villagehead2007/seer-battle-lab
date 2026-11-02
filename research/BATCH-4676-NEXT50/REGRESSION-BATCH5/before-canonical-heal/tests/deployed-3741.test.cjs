'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3741-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3741 基础28招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3741 基础28招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3741 479三实例自损与固定追加、低血保留及精确阈值死亡',()=>{
 for(const x of pick(479))for(const hp of [1,x.params[0]-1,x.params[0],x.params[0]+1,9000]){const s=make(x,{hp}),o=turn(s);assert.equal(o.fighters[0].hp,hp<x.params[2]?1:Math.max(0,hp-x.params[0]));assert.equal(o.fighters[1].hp,9000-x.params[1]);const no=make(x,{hp});timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].hp,hp);assert.equal(turn(no).fighters[1].hp,9000);}
 const im=make(e(479));im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=2;const o=turn(im);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].hp,8800);
});
test('3741 1412低于300必先独立于先制，300边界不触发',()=>{
 for(const hp of [1,299,300,301]){const s=make(e(1412),{hp,aStats:{spe:1}});s.moveDefinitions[key(900041)].priority=20;assert.equal(turn(s).turns[0].first,hp<300?0:1);}
});
test('3741 1400回合效果被清疲惫、免断失败与异常免疫和到期',()=>{
 const s=make(e(1400)),o=turn(s);assert.equal(o.fighters[0].effects['回合被清追加异常'].end,3);
 function clear(q){q.moveDefinitions[key(900041)].operations=[{effectId:797,index:0,phase:'afterHit',params:[2],sourceArgs:[2]}];return turn(q,900031);}
 const yes=clear(o);assert.equal(yes.fighters[0].effects['回合被清追加异常'],undefined);assert.ok([3,4].includes(yes.fighters[1].ailments['疲惫']));
 const im=structuredClone(o);im.fighters[1].counts.immune=1;assert.equal(clear(im).fighters[1].ailments['疲惫'],undefined);const protectedState=structuredClone(o);timer(protectedState,0,'protect');assert.equal(clear(protectedState).fighters[1].ailments['疲惫'],undefined);
 const expired=structuredClone(o);expired.round=4;assert.equal(clear(expired).fighters[1].ailments['疲惫'],undefined);
});
test('3741 39两实例PP削减概率、零PP阻止后手及下限',()=>{
 for(const x of pick(39)){let yes=false,no=false;for(let seed=0;seed<70;seed++){const s=make(x,{seed});s.fighters[1].pp[key(900041)]=1;const o=turn(s);if(o.fighters[1].pp[key(900040)]===99-x.params[1]){yes=true;assert.equal(o.fighters[1].pp[key(900041)],0);assert.ok(o.turns[0].events.some(e=>e.text.includes('已无 PP')));}else no=true;}assert.ok(yes);if(x.params[0]<100)assert.ok(no);}
});
test('3741 34实际攻击伤害双倍反馈、未受攻击零追加及固定免疫',()=>{
 const s=make(e(34),{aStats:{spe:1}}),o=turn(s,s.auditMoveId,900040);assert.equal(9000-o.fighters[1].hp,2*(9000-o.fighters[0].hp));assert.equal(turn(make(e(34))).fighters[1].hp,9000);
 const im=make(e(34),{aStats:{spe:1}});im.fighters[1].soulId=622;const out=turn(im,im.auditMoveId,900040);assert.equal(out.fighters[1].hp,9000);
});
test('3741 452与101按攻击实际伤害回复，免攻和禁疗失败',()=>{
 for(const x of pick(101)){const s=make(x,{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,1000+Math.floor(o.fighters[0].lastAttackDamage*x.params[0]/100));timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);timer(s,1,'攻击伤害免疫');assert.equal(turn(s).fighters[0].hp,1000);}
 const s=make(e(452),{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].effects['攻击吸血'].end,3);const h=turn(o,900030);assert.equal(h.fighters[0].hp,1000+h.fighters[0].lastAttackDamage);o.round=4;assert.equal(turn(o,900030).fighters[0].hp,1000);
});
test('3741 43与1239真实回复、半血边界和禁疗',()=>{
 for(const x of [...pick(43),...pick(1239)])for(const hp of [1000,4499,4500,8999,9000]){const s=make(x,{hp}),o=turn(s);const gain=Math.min(9000-hp,4500);assert.equal(o.fighters[0].hp,hp+gain);if(x.id===1239)assert.equal(9000-o.fighters[1].hp-(o.fighters[0].lastAttackDamage??0),hp<4500?gain:0);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,hp);}
});
test('3741 585与885全属性强化六级、严格体力比较和禁强',()=>{
 for(const x of [...pick(585),...pick(885)])for(const targetHp of [8999,9000]){const s=make(x,{targetHp}),o=turn(s);assert.ok(Object.values(o.fighters[0].stages).every(n=>n===(x.id===885&&targetHp<9000?2:1)));s.fighters[0].stages.atk=6;assert.equal(turn(s).fighters[0].stages.atk,6);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.def,0);}
});
test('3741 3与521和1167解除反转及回满，锁弱和封招失败',()=>{
 for(const id of [3,521,1167]){const s=make(e(id),{hp:1000});s.fighters[0].stages.atk=-3;const o=turn(s);assert.equal(o.fighters[0].stages.atk,id===521?3:0);assert.equal(o.fighters[0].hp,id===1167?9000:1000);timer(s,0,'弱化不可解除反转');assert.equal(turn(s).fighters[0].stages.atk,-3);assert.equal(turn(s).fighters[0].hp,1000);const no=make(e(id),{hp:1000});assert.equal(turn(no).fighters[0].hp,1000);}
});
test('3741 85与1180吸强、成功下两回合必暴及禁强失败',()=>{
 for(const id of [85,1180]){const s=make(e(id));s.fighters[1].stages.atk=3;const o=turn(s);assert.equal(o.fighters[0].stages.atk,3);assert.equal(o.fighters[1].stages.atk,0);if(id===1180){assert.equal(o.fighters[0].effects['必定暴击'].start,2);assert.equal(o.fighters[0].effects['必定暴击'].end,3);assert.equal(turn(make(e(id))).fighters[0].effects['必定暴击'],undefined);}timer(s,0,'禁强化');assert.equal(turn(s).fighters[1].stages.atk,3);}
});
test('3741 436自身损失体力追加、满体零与百分比免疫，785按远古微弱先制',()=>{
 for(const hp of [1000,9000]){const s=make(e(436),{hp}),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,(9000-hp)*.2);s.fighters[1].soulId=622;s.fighters[1].ailments['疲惫']=1;const im=turn(s);assert.equal(9000-im.fighters[1].hp,im.fighters[0].lastAttackDamage);}
 const s=make(e(785),{aStats:{spe:1}});let yes=false,no=false;for(const type of ['火','水','飞行','机械','远古','神秘','冰','地面','光']){s.fighters[1].type=type;const weak=E.typeEffectiveness(s.fighters[0].type,type,s.typeChart)<1;const o=turn(s);assert.equal(o.turns[0].first,weak?0:1);if(weak)yes=true;else no=true;}assert.ok(yes&&no);
});
test('3741 477受击双攻下降、免弱失败及两回合期限',()=>{
 const s=make(e(477)),o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[1].stages.spa,-1);assert.equal(o.fighters[0].effects['受击弱化对手'].end,2);const im=make(e(477));timer(im,1,'免弱');assert.equal(turn(im,im.auditMoveId,900040).fighters[1].stages.spa,0);o.round=3;assert.equal(turn(o,900031,900040).fighters[1].stages.spa,-1);
});
test('3741 15害怕与453清强疲惫，默认二三回合及失败免疫',()=>{
 let yes=false,no=false;for(let seed=0;seed<50;seed++){const s=make(e(15),{seed}),o=turn(s);if(o.fighters[1].ailments['害怕']){yes=true;assert.ok([2,3].includes(o.fighters[1].ailments['害怕']));}else no=true;}assert.ok(yes&&no);
 const s=make(e(453));s.fighters[1].stages.atk=1;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.ok([2,3].includes(o.fighters[1].ailments['疲惫']));assert.equal(turn(make(e(453))).fighters[1].ailments['疲惫'],undefined);s.fighters[1].counts.immune=1;assert.equal(turn(s).fighters[1].ailments['疲惫'],undefined);
});
test('3741 29固定追加、473严格低伤加攻及447最低攻击伤害免疫',()=>{
 const s=make(e(29)),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,50);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);
 const low=make(e(473));assert.equal(turn(low).fighters[0].stages.atk,2);low.moveDefinitions[key(low.auditMoveId)].power=3000;timer(low,1,'伤害上限',{amount:300});assert.equal(turn(low).fighters[0].stages.atk,0);
 for(const x of pick(447)){const s=make(x),o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,300);timer(s,1,'攻击伤害免疫');assert.equal(turn(s).fighters[1].hp,9000);}
});
test('3741 48免异常与191反弹、478各时长封属及解除后恢复',()=>{
 for(const id of [48,191]){const s=make(e(id),{opponentMove:14103,opponentEffectId:15});let reflected=false;for(let seed=0;seed<50;seed++){s.rng=seed;const o=turn(s,s.auditMoveId,900042);assert.equal(o.fighters[0].ailments['害怕'],undefined);if(o.fighters[1].ailments['害怕'])reflected=true;}if(id===191)assert.ok(reflected);}
 for(const x of pick(478)){const s=make(x);s.moveDefinitions[key(900041)].operations=[{effectId:585,index:0,phase:'afterHit',params:[1,1,1,1,1,1]}];const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].effects.statusBlock.end,x.params[0]);o.round=x.params[0]+1;assert.equal(turn(o,900031).fighters[1].stages.atk,1);}
});
test('3741 58必暴843和619先制窗口、当回合不提前及到期',()=>{
 for(const id of [58,843,619])for(const x of pick(id)){const s=make(x,{aStats:{spe:1}}),o=turn(s);const f=o.fighters[id===619?1:0],k=id===58?'必定暴击':'id984';assert.equal(f.effects[k].start,2);assert.equal(f.effects[k].end,x.params[0]+1);assert.equal(o.turns[0].first,1);if(id!==58)assert.equal(turn(o,900031).turns[1].first,0);else{const n=turn(o,900030),plain=structuredClone(o);delete plain.fighters[0].effects[k];assert.ok(n.fighters[0].lastAttackDamage>=2*turn(plain,900030).fighters[0].lastAttackDamage);}o.round=x.params[0]+2;assert.equal(turn(o,900031).fighters[id===619?1:0].effects[k],undefined);}
});
test('3741 1394共享普通池与1151用攻强化、控制未用招失败',()=>{
 const s=make(e(1394)),o=turn(s);assert.equal(Object.keys(o.fighters[1].ailments).length,2);assert.ok(Object.values(o.fighters[1].ailments).every(n=>[2,3].includes(n)));const im=make(e(1394));timer(im,1,'免异常');assert.equal(Object.keys(turn(im).fighters[1].ailments).length,0);
 const q=make(e(1151));assert.ok(Object.values(turn(q,q.auditMoveId,900040).fighters[0].stages).every(n=>n===1));q.fighters[1].ailments['疲惫']=2;assert.equal(turn(q,q.auditMoveId,900040).fighters[0].stages.atk,0);assert.equal(turn(make(e(1151))).fighters[0].stages.atk,0);
});
test('3741 797清回合禁疗与1393用招前降防速、失败百分比追加',()=>{
 const s=make(e(797));timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].effects['无法通过自身技能恢复体力'].end,2);assert.equal(turn(make(e(797))).fighters[1].effects['无法通过自身技能恢复体力'],undefined);timer(s,1,'protect');assert.equal(turn(s).fighters[1].effects['无法通过自身技能恢复体力'],undefined);
 const q=make(e(1393)),x=turn(q);assert.equal(x.fighters[1].stages.def,-1);assert.equal(x.fighters[1].stages.spe,-1);const y=turn(x,900031);assert.equal(y.fighters[1].stages.def,-2);const im=make(e(1393));timer(im,1,'免弱');const z=turn(im);assert.equal(9000-z.fighters[1].hp-z.fighters[0].lastAttackDamage,3000);assert.equal(z.fighters[1].stages.def,0);
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3741 1239实际回复附伤不减去后续蛊反噬公共修复',()=>{const o=require('./helpers/assert-1239-atomic-heal.cjs')(3741);assert.equal(o.fighters[0].hp,8960);});}
