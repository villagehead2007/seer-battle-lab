'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,make,turn,pick,timer}=require('./helpers/3724-battle.cjs');const e=id=>pick(id)[0];
test('3724 944施加者基础双防、攻击使用后伤害、属性不触发与百分比免疫',()=>{
 const s=make(e(944),{aStats:{def:400,spd:600},bStats:{def:2000,spd:3000}});s.fighters[0].stages.def=6;s.fighters[0].stages.spd=-6;
 const o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[1].hp,8650);assert.ok(o.fighters[0].hp<9000);assert.equal(o.fighters[0].effects['对手攻击后双防追加'].end,3);
 assert.equal(turn(make(e(944))).fighters[1].hp,9000);
 const kill=make(e(944),{targetHp:100});const k=turn(kill,kill.auditMoveId,900040);assert.equal(k.fighters[1].hp,0);assert.ok(k.fighters[0].hp<9000,'对手先完成攻击才被追加击败');
 const no=make(e(944));no.fighters[1].soulId=null;no.fighters[1].species='emperor';const n=turn(no,no.auditMoveId,900040);assert.equal(n.fighters[1].hp,9000);
 const block=make(e(944));timer(block,0,'skillBlock');assert.equal(turn(block,block.auditMoveId,900040).fighters[1].hp,9000);
 let expire=turn(make(e(944)));for(let i=0;i<3;i++)expire=turn(expire,900031);const before=expire.fighters[1].hp;assert.equal(turn(expire,900031,900040).fighters[1].hp,before);
});
test('3724 999与1756回复追加后重比体力、等体失败及真实先制',()=>{
 for(const soul of [999,1756]){const s=make({moveId:10234,index:null},{soul,omit:true,hp:4000,targetHp:5000,aStats:{spe:1}});const o=turn(s,900031);assert.equal(o.fighters[0].hp,7000);assert.equal(o.fighters[1].hp,2000);assert.equal(o.fighters[0].effects.id984.amount,1);assert.equal(o.fighters[0].effects.id984.start,2);assert.equal(turn(o,900031).turns[1].first,0);
 const equal=turn(make({moveId:10234,index:null},{soul,omit:true,hp:4000,targetHp:4000}),900031);assert.equal(equal.fighters[0].hp,4000);assert.equal(equal.fighters[1].hp,4000);assert.equal(equal.fighters[0].effects.id984,undefined);
 const remain=turn(make({moveId:10234,index:null},{soul,omit:true,hp:1000,targetHp:9000}),900031);assert.equal(remain.fighters[0].hp,4000);assert.equal(remain.fighters[1].hp,6000);assert.equal(remain.fighters[0].effects.id984,undefined);
 const cap=turn(make({moveId:10234,index:null},{soul,omit:true,hp:8500,targetHp:9000}),900031);assert.equal(cap.fighters[0].hp,9000);assert.equal(cap.fighters[1].hp,8500);
 const im=make({moveId:10234,index:null},{soul,omit:true,hp:4000,targetHp:8000});im.fighters[1].soulId=null;im.fighters[1].species='emperor';im.fighters[1].ailments['疲惫']=im.round+1;const io=turn(im,900031);assert.equal(io.fighters[0].hp,7000);assert.equal(io.fighters[1].hp,8000);assert.equal(io.fighters[0].effects.id984,undefined);
 }
});
test('3724 999与1756攻击前固伤、回合层数、控制未用招及固定免疫',()=>{
 for(const [soul,n]of [[999,18],[1756,20]]){const s=make({moveId:10234,index:null},{soul,omit:true});s.round=5;const o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,5*n);if(soul===1756)assert.equal(o.fighters[0].soulState.fallenDragonResentment,5);
 const im=structuredClone(s);im.fighters[1].soulId=null;im.fighters[1].species='emperor';im.fighters[1].ailments['疲惫']=im.round+1;const io=turn(im);assert.equal(9000-io.fighters[1].hp,io.fighters[0].lastAttackDamage);
 const control=structuredClone(s);control.fighters[0].ailments['疲惫']=control.round+1;assert.equal(turn(control).fighters[1].hp,9000);
 const low=structuredClone(s);low.fighters[1].hp=1;const k=turn(low);assert.equal(k.fighters[1].hp,0);
 }
});
test('3724 1756三十层严格边界、五十层上限、满体和黯龙攻击增伤',()=>{
 for(const [r,hp,expected,priority]of [[30,8000,8000,1],[31,8000,9000,2],[31,9000,9000,2]]){const s=make({moveId:10234,index:null},{soul:1756,omit:true,hp,targetHp:7000});s.round=r;const o=turn(s,900031);assert.equal(o.fighters[0].hp,expected);assert.equal(o.fighters[1].hp,7000-(expected-hp));assert.equal(o.fighters[0].effects.id984.amount,priority);}
 const s=make({moveId:10234,index:null},{soul:1756,omit:true});s.round=60;s.fighters[0].soulState.darkDragonHatred=20;const o=turn(s);assert.equal(o.fighters[0].soulState.fallenDragonResentment,30);const plain=structuredClone(s);plain.fighters[0].soulState.darkDragonHatred=0;assert.ok(o.fighters[0].lastAttackDamage>turn(plain).fighters[0].lastAttackDamage);
});
test('3724 2056击败回满和自身层数增长、未击败不消耗及层数上限',()=>{
 for(const [r,dark,want]of [[3,0,3],[25,10,25],[40,0,10]]){const s=make(e(2056),{soul:1756,hp:1000,targetHp:100});s.round=r;s.fighters[1].hp=r*20+1;s.fighters[0].soulState.darkDragonHatred=dark;const o=turn(s);assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[0].soulState.darkDragonHatred,want);}
 const s=make(e(2056),{hp:1000});const o=turn(s);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].soulState.darkDragonHatred,undefined);const block=make(e(2056),{targetHp:1,hp:1000});timer(block,0,'skillBlock');assert.equal(turn(block).fighters[0].hp,1000);
 const healblock=make(e(2056),{hp:1000,targetHp:1});timer(healblock,0,'技能禁疗');assert.equal(turn(healblock).fighters[0].hp,1000);
});
test('3724 1839用招半血回复与回合末最大体力吸取、禁疗免疫及四回合到期',()=>{
 const s=make(e(1839),{hp:1000});const o=turn(s);assert.equal(o.fighters[0].hp,8500);assert.equal(o.fighters[1].hp,6000);assert.equal(o.fighters[0].effects.id57.end,4);
 const im=make(e(1839),{hp:1000});im.fighters[1].soulId=null;im.fighters[1].species='emperor';assert.equal(turn(im).fighters[0].hp,8500);assert.equal(turn(im).fighters[1].hp,9000);
 const no=make(e(1839),{hp:1000});timer(no,0,'技能禁疗');assert.equal(turn(no).fighters[0].hp,1000);assert.equal(turn(no).fighters[1].hp,6000);
 const controlled=structuredClone(o);controlled.fighters[0].hp=1000;controlled.fighters[0].ailments['疲惫']=2;assert.equal(turn(controlled,900031).fighters[0].hp,4000);
 const expired=structuredClone(o);expired.round=5;expired.fighters[0].hp=1000;const ex=turn(expired,900031);assert.equal(ex.fighters[0].hp,1000);assert.equal(ex.fighters[1].hp,6000);
});
test('3724 1225负等级条件吸取、比例独立回复、免疫禁疗与非负失败',()=>{
 const s=make(e(1225),{hp:1000});s.fighters[1].stages.atk=-1;const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,3000);
 assert.equal(turn(make(e(1225),{hp:1000})).fighters[0].hp,1000);
 const im=structuredClone(s);im.fighters[1].soulId=null;im.fighters[1].species='emperor';assert.equal(turn(im).fighters[0].hp,4000);
 const no=structuredClone(s);timer(no,0,'技能禁疗');assert.equal(turn(no).fighters[0].hp,1000);
 const cap=structuredClone(s);cap.fighters[1].hp=500;const co=turn(cap);assert.equal(co.fighters[0].hp,4000);
});
test('3724 1393用招伤害前降防速及失败粉伤、1067低体替换吸取边界',()=>{
 const s=make(e(1393)),o=turn(s);assert.equal(o.fighters[1].stages.def,-1);assert.equal(o.fighters[1].stages.spe,-1);assert.ok(o.fighters[0].lastAttackDamage>turn(make(e(1393),{omit:true})).fighters[0].lastAttackDamage);const im=make(e(1393));timer(im,1,'免弱');const io=turn(im);assert.equal(9000-io.fighters[1].hp-io.fighters[0].lastAttackDamage,3000);assert.equal(io.fighters[1].stages.def,0);assert.equal(turn(io,900031).fighters[1].hp,io.fighters[1].hp-3000);
 for(const hp of [4499,4500]){const s=make(e(1067),{hp});const o=turn(s);assert.equal(o.fighters[0].hp,hp+3000);assert.equal(o.fighters[1].hp,hp<4500?6000:9000);}const no=make(e(1067),{hp:1000});timer(no,0,'技能禁疗');assert.equal(turn(no).fighters[0].hp,1000);
});
test('3724 1394已确认普通随机池、二种无放回和默认时长',()=>{
 for(const id of [1394]){for(let seed=0;seed<12;seed++){const s=make(e(id),{seed}),o=turn(s);const events=o.randomStatusEvents.filter(x=>x.effectId===id&&x.type==='draw');assert.equal(events.length,2);assert.equal(new Set(events.map(x=>x.name)).size,2);assert.equal(Object.keys(o.fighters[1].ailments).length,2);for(const end of Object.values(o.fighters[1].ailments))assert.ok([2,3].includes(end));}
 const no=make(e(id));timer(no,1,'免异常');timer(no,1,'doubleDamage');const o=turn(no);assert.equal(Object.keys(o.fighters[1].ailments).length,0);assert.equal(!!o.fighters[1].effects.doubleDamage,id===1394);const attack=make(e(id));assert.equal(turn(attack,attack.auditMoveId,900040).randomStatusEvents?.length??0,0);
 }
});
test('3724 1348已确认普通随机池与免疫失败清回合、二种无放回和默认时长',()=>{
 for(const id of [1348]){for(let seed=0;seed<12;seed++){const s=make(e(id),{seed}),o=turn(s);const events=o.randomStatusEvents.filter(x=>x.effectId===id&&x.type==='draw');assert.equal(events.length,2);assert.equal(new Set(events.map(x=>x.name)).size,2);assert.equal(Object.keys(o.fighters[1].ailments).length,2);for(const end of Object.values(o.fighters[1].ailments))assert.ok([2,3].includes(end));}
 const no=make(e(id));timer(no,1,'免异常');timer(no,1,'doubleDamage');const o=turn(no);assert.equal(Object.keys(o.fighters[1].ailments).length,0);assert.equal(!!o.fighters[1].effects.doubleDamage,id===1394);const attack=make(e(id));assert.equal(turn(attack,attack.auditMoveId,900040).randomStatusEvents?.length??0,0);
 }
});
test('3724 1269对手攻击命中前吸取、百分比免疫失败和属性不触发',()=>{
 const s=make(e(1269),{hp:1000}),o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[1].hp,6000);assert.equal(o.fighters[0].hp,4000-o.fighters[1].lastAttackDamage);const low=make(e(1269),{targetHp:1000,hp:1000});const k=turn(low,low.auditMoveId,900040);assert.equal(k.fighters[1].hp,0);assert.equal(k.fighters[1].lastAttackDamage??0,0);assert.equal(k.fighters[0].hp,4000);assert.equal(turn(make(e(1269))).fighters[1].hp,9000);
 const im=make(e(1269));im.fighters[1].soulId=622;assert.equal(turn(im,im.auditMoveId,900040).fighters[1].hp,9000);
});
test('3724 2054未来两回合暴击获得一次免疫、消费、非暴击与过期失败',()=>{
 const s=turn(make(e(2054)));assert.equal(s.fighters[0].counts.immune??0,0);timer(s,0,'必定暴击');const o=turn(s,900030);assert.equal(o.fighters[0].counts.immune,1);const no=turn(make(e(2054)));assert.equal(turn(no,900030).fighters[0].counts.immune??0,0);
 const hit=make(e(2054),{opponentMove:36744,opponentEffectId:1605});hit.moveDefinitions[key(900042)].priority=0;let first=turn(hit);timer(first,0,'必定暴击');const applied=turn(first,900030,900042);assert.equal(applied.fighters[0].counts.immune,0);assert.equal(applied.fighters[0].ailments['害怕'],undefined);assert.ok(applied.fighters[0].ailments['烧伤']);
 const expired=turn(make(e(2054)));expired.round=4;timer(expired,0,'必定暴击');assert.equal(turn(expired,900030).fighters[0].counts.immune??0,0);
});
test('3724 2028自身天敌必中与2055对方天敌清回合各自条件',()=>{
 for(const id of [2028,2055])for(const advantage of [false,true]){const s=make(e(id),{hit:false});s.fighters[0].type='火';s.fighters[1].type=advantage?(id===2028?'草':'水'):'火';s.fighters[0].stages.acc=-6;s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;s.moveDefinitions[key(s.auditMoveId)].power=100;if(id===2055){timer(s,0,'攻击必中');timer(s,1,'doubleDamage');const o=turn(s);assert.equal(!!o.fighters[1].effects.doubleDamage,!advantage);}else{const o=turn(s);assert.equal((o.fighters[0].lastAttackDamage??0)>0,advantage);}}
});
test('3724 1394共享池边界映射、无放回及未知池拒绝',()=>{
 const P=require('../dist/status-pools.js');assert.deepEqual(P.configuration(1394).candidates,P.pool());const values=[0,0,.999999,.999999];let index=0;const draw=P.drawForEffect(1394,2,()=>values[index++]);assert.equal(index,4);assert.equal(draw[0].duration,2);assert.equal(draw[1].duration,3);assert.equal(draw[0].name,P.pool()[0].name);assert.equal(draw[1].name,P.pool().at(-1).name);assert.throws(()=>P.drawForEffect(999999,2,()=>assert.fail()),/needs-source/);
});
