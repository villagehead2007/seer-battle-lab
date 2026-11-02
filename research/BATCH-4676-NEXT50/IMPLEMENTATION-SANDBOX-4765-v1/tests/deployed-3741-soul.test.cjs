'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,make,turn,pick,timer,key}=require('./helpers/3741-battle.cjs');
const e=id=>pick(id)[0],soul=options=>make({moveId:14102,index:null},{soul:1016,omit:true,...options});
function random(seed){let t=(seed+0x6D2B79F5)>>>0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
function seedFor(n,width){for(let seed=0;seed<100000;seed++)if(Math.floor(random(seed)*width)===n)return seed;throw Error('missing seed');}
test('3741 魂印1016原版高低体增减伤与等体无分支',()=>{
 for(const [hp,target]of [[8000,5000],[5000,8000],[8000,8000]]){const s=soul({hp,targetHp:target}),ref=structuredClone(s);ref.fighters[0].soulId=null;const a=turn(s,900030,900040),b=turn(ref,900030,900040);const multiplier=hp>target?1.5:1;assert.ok(Math.abs(a.fighters[0].lastAttackDamage-b.fighters[0].lastAttackDamage*multiplier)<=12);if(hp<target){assert.ok(a.fighters[0].roundAttackDamage<=Math.ceil(b.fighters[0].roundAttackDamage/2));assert.ok(a.fighters[0].hp>hp);}if(hp===target){assert.equal(a.fighters[0].lastAttackDamage,b.fighters[0].lastAttackDamage);assert.equal(a.fighters[0].hp,b.fighters[0].hp);}}
});
test('3741 魂印1016随机整数区间包含端点与中间值，复用统一种子',()=>{
 for(const n of [0,1,8,20]){const seed=seedFor(n,21),s=soul({hp:8000,targetHp:5000,seed}),o=turn(s,900031);assert.equal(o.fighters[1].hp,5000-Math.floor(4000*(20+n)/100));assert.equal(turn(s,900031).fighters[1].hp,o.fighters[1].hp);}
 for(const n of [0,1,198,200]){const s=soul({hp:1000,seed:seedFor(n,201)});assert.equal(turn(s,900031).fighters[0].hp,1200+n);}
});
test('3741 魂印1016异常保命覆盖攻击粉伤自损与异常扣血，清异常后再死不保命',()=>{
 for(const partner of [false,true]){const s=soul({partner,aStats:{maxHp:1}});s.fighters[0].ailments['烧伤']=3;const o=turn(s,900031,900040);assert.equal(o.fighters[0].hp,1);assert.equal(o.fighters[0].ailments['烧伤'],undefined);const n=turn(o,900031,900040);assert.equal(n.fighters[0].hp,0);o.fighters[0].ailments['烧伤']=4;assert.equal(turn(o,900031,900040).fighters[0].hp,1);}
 const self=make(e(479),{soul:1016,hp:200,aStats:{maxHp:200}});self.fighters[0].ailments['烧伤']=3;assert.ok(turn(self).fighters[0].hp>0);delete self.fighters[0].ailments['烧伤'];assert.equal(turn(self).fighters[0].hp,0);
 const dot=soul({hp:1});dot.fighters[0].ailments['烧伤']=3;const o=turn(dot,900031);assert.equal(o.fighters[0].hp,1);assert.equal(o.fighters[0].ailments['烧伤'],undefined);
 const pink=soul({aStats:{maxHp:1}});pink.fighters[0].ailments['烧伤']=3;pink.moveDefinitions[key(900041)].operations=[{effectId:29,index:0,phase:'afterHit',params:[50],sourceArgs:[50]}];assert.equal(turn(pink,900031).fighters[0].hp,1);
});
test('3741 2395携带即生效，原版回合初与伙伴动态HP判定分别验证',()=>{
 for(const partner of [false,true]){const s=soul({partner,hp:5000,targetHp:8000});assert.equal(!!s.fighters[0].soulState.kubesaPartner,partner);s.moveDefinitions[key(900040)].power=80;s.moveDefinitions[key(900031)].operations=[{effectId:43,index:0,phase:'afterHit',params:{fraction:1},sourceArgs:[1]}];const o=turn(s,900031,900040);if(partner)assert.ok(o.fighters[0].roundAttackDamage>20);else assert.ok(o.fighters[0].roundAttackDamage<20);}
 const p=soul({partner:true});p.fighters[0].hp=1;p.moveDefinitions[key(900041)].operations=[{effectId:12,index:0,phase:'afterHit',params:[100],sourceArgs:[100]},{effectId:29,index:1,phase:'afterHit',params:[9999],sourceArgs:[9999]}];p.fighters[0].stats.spe=1;const o=turn(p,900031);assert.ok(o.fighters[0].hp>0);assert.equal(o.fighters[0].ailments['烧伤'],undefined);
});
test('3741 2388清异常直接自损、远古直伤克制无本系无暴击且受减免',()=>{
 for(const type of ['远古','火','机械']){const s=make(e(2388),{hp:8000});s.fighters[1].type=type;s.fighters[0].ailments['烧伤']=3;const o=turn(s);assert.equal(o.fighters[0].hp,5200);assert.equal(o.fighters[0].ailments['烧伤'],undefined);assert.equal(9000-o.fighters[1].hp,Math.min(9000,Math.floor(4500*E.typeEffectiveness('远古',type,s.typeChart))));timer(s,0,'必定暴击');assert.equal(turn(s).fighters[1].hp,o.fighters[1].hp);timer(s,1,'攻击伤害免疫');assert.equal(turn(s).fighters[1].hp,9000);}
 const s=make(e(2388),{hp:1000});timer(s,1,'全伤害减半');const ref=make(e(2388),{hp:1000}),base=9000-turn(ref).fighters[1].hp;assert.equal(9000-turn(s).fighters[1].hp,base/2);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].hp,1000);
});
test('3741 1978消强疲惫成功与消强失败无补偿、成功后异常免疫保底百分比',()=>{
 const s=make(e(1978));s.fighters[1].stages.atk=1;const o=turn(s);assert.equal(o.fighters[1].hp,9000);assert.ok([2,3].includes(o.fighters[1].ailments['疲惫']));assert.equal(o.fighters[1].stages.atk,0);assert.equal(turn(make(e(1978))).fighters[1].hp,9000);s.fighters[1].counts.immune=1;assert.equal(turn(s).fighters[1].hp,6000);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);
});
test('3741 2394技能失效触发咒印，属性封锁消耗一次及零伤攻击也消耗',()=>{
 const s=make(e(2394),{soul:1016,partner:true});timer(s,0,'statusBlock');const o=turn(s);assert.ok(o.fighters[0].effects['符文咒印']===undefined);assert.ok(o.turns[0].events.some(x=>x.text.includes('B 方 技能被封锁')));
 const a=make(e(2394),{soul:1016,partner:true});timer(a,0,'statusBlock');timer(a,0,'攻击伤害免疫');const r=turn(a,a.auditMoveId,900040);assert.equal(r.fighters[0].effects['符文咒印'],undefined);assert.equal(r.fighters[0].hp,9000);assert.equal(r.fighters[1].hp,9000);
 const control=make(e(2394),{soul:1016,partner:true});control.fighters[0].ailments['疲惫']=3;assert.equal(turn(control).fighters[0].effects['符文咒印'],undefined);
});
test('3741 伙伴符文锁链变咒印，攻击后等量真伤而非两倍固定',()=>{
 const s=make(e(34),{soul:1016,partner:true,aStats:{spe:999}});s.moveDefinitions[key(s.auditMoveId)].priority=1;const o=turn(s,s.auditMoveId,900040);assert.equal(9000-o.fighters[1].hp,o.fighters[0].roundAttackDamage);assert.equal(o.fighters[0].effects['符文咒印'],undefined);
 const p=make(e(34),{partner:true});const o2=turn(p);assert.ok(o2.fighters[0].effects['符文咒印']);assert.equal(o2.fighters[0].effects['符文咒印'].end,3);o2.round=4;const gone=turn(o2,900031);assert.equal(gone.fighters[0].effects['符文咒印'],undefined);
});
test('3741 2393封属种类逐项计数、双方累计与三回合到期',()=>{
 const start=turn(make(e(2393)));assert.equal(start.fighters[0].effects['封属种类增伤'].end,3);
 const additions=[s=>timer(s,1,'statusBlock'),s=>timer(s,1,'skillBlock'),s=>s.fighters[1].ailments['沉默']=99,s=>s.fighters[1].counts.nextStatusInvalid=1,s=>timer(s,0,'符文咒印')];
 for(let count=0;count<=5;count++){const s=structuredClone(start);for(const add of additions.slice(0,count))add(s);const base=structuredClone(s);delete base.fighters[0].effects['封属种类增伤'];const o=turn(s,900030),r=turn(base,900030);assert.ok(Math.abs(o.fighters[0].lastAttackDamage-r.fighters[0].lastAttackDamage*(1+count*.5))<=2);}
 const two=structuredClone(start);timer(two,0,'statusBlock');timer(two,1,'statusBlock');const ref=structuredClone(two);delete ref.fighters[0].effects['封属种类增伤'];assert.ok(Math.abs(turn(two,900030).fighters[0].lastAttackDamage-2*turn(ref,900030).fighters[0].lastAttackDamage)<=1);
 const expired=structuredClone(two);expired.round=4;const plain=structuredClone(expired);delete plain.fighters[0].effects['封属种类增伤'];assert.equal(turn(expired,900030).fighters[0].lastAttackDamage,turn(plain,900030).fighters[0].lastAttackDamage);
});
test('3741 原魂印回合初无异常不保命，伙伴当回合新异常可以保命',()=>{
 for(const partner of [false,true]){const p=soul({partner,hp:1,aStats:{spe:1}});p.moveDefinitions[key(900041)].operations=[{effectId:12,index:0,phase:'afterHit',params:[100],sourceArgs:[100]},{effectId:29,index:1,phase:'afterHit',params:[9999],sourceArgs:[9999]}];const o=turn(p,900031);assert.equal(o.fighters[0].hp>0,partner);}
});
