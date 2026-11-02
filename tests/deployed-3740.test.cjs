'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3740-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3740 基础22招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3740 基础22招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3740 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});





test('3740 原魂印1014入场盾先制、未受攻击按实际回复固伤、受伤后抵挡',()=>{
 const s=make({moveId:10535,index:null},{soul:1014,omit:true,hp:1000,aStats:{spe:1}});assert.equal(s.fighters[0].suitState.shield,400);const o=turn(s,900031);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].hp,1250);assert.equal(o.fighters[1].hp,8750);const full=make({moveId:10535,index:null},{soul:1014,omit:true});assert.equal(turn(full,900031).fighters[1].hp,9000);const cap=make({moveId:10535,index:null},{soul:1014,omit:true,hp:8999});assert.equal(turn(cap,900031).fighters[1].hp,8999);s.fighters[0].suitState.shield=0;const hit=turn(s,900031,900040);assert.equal(hit.turns[0].first,1);assert.equal(hit.fighters[0].counts.attackNullify,1);const hp=hit.fighters[0].hp;const next=turn(hit,900031,900040);assert.equal(next.fighters[0].hp,hp+250);assert.equal(next.fighters[0].counts.attackNullify,0);
});
test('3740 原魂印1014攻击增伤逐次25至100、属性不增加与封招无攻击伤害',()=>{
 let s=make({moveId:10535,index:null},{soul:1014,omit:true});for(let i=1;i<=5;i++){s.rng=0;s.fighters[1].hp=9000;const ref=structuredClone(s);ref.fighters[0].soulId=null;const base=turn(ref).fighters[0].lastAttackDamage;s=turn(s);assert.equal(s.fighters[0].soulState.waveGrowth,Math.min(i,4));assert.ok(Math.abs(s.fighters[0].lastAttackDamage-base*(1+Math.min(i,4)*.25))<=2);}const before=s.fighters[0].soulState.waveGrowth;assert.equal(turn(s,900031).fighters[0].soulState.waveGrowth,before);const no=make({moveId:10535,index:null},{soul:1014,omit:true});timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].lastAttackDamage,undefined);
});
test('3740 1019严格高于300封属、相等失败、两回合到期',()=>{
 const s=make(e(1019));s.moveDefinitions[key(s.auditMoveId)].power=2000;const yes=turn(s);assert.ok(yes.fighters[0].lastAttackDamage>300);assert.equal(yes.fighters[1].effects.statusBlock.end,2);timer(s,1,'伤害上限',{amount:300});const equal=turn(s);assert.equal(equal.fighters[0].lastAttackDamage,300);assert.equal(equal.fighters[1].effects.statusBlock,undefined);yes.round=3;assert.equal(turn(yes,900031).fighters[1].effects.statusBlock,undefined);
});
test('3740 1155连续追加20至40与中断重置、百分比免疫封招失败',()=>{
 let s=make(e(1155));for(const fraction of [.2,.3,.4,.4]){s.fighters[1].hp=9000;s=turn(s);assert.equal(9000-s.fighters[1].hp-s.fighters[0].lastAttackDamage,9000*fraction);}s=turn(s,900031);s.fighters[1].hp=9000;const reset=turn(s);assert.equal(9000-reset.fighters[1].hp-reset.fighters[0].lastAttackDamage,1800);const im=make(e(1155));im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=1;const o=turn(im);assert.equal(9000-o.fighters[1].hp,o.fighters[0].lastAttackDamage);timer(im,0,'skillBlock');assert.equal(turn(im).fighters[1].hp,9000);
});
test('3740 1399原版冰封觉醒冻伤、清回合失败不补偿及成功后异常免疫保底',()=>{
 for(const x of pick(1399)){const s=make(x);timer(s,1,'doubleDamage');const o=turn(s);assert.ok(o.fighters[1].ailments[x.params[0]===15?'冰封':'冻伤']);assert.equal(o.fighters[0].counts.immune,undefined);const no=turn(make(x));assert.equal(no.fighters[0].counts.immune,undefined);s.fighters[1].counts.immune=1;assert.equal(turn(s).fighters[0].counts.immune,1);timer(s,1,'protect');assert.equal(turn(s).fighters[0].counts.immune,undefined);}
});

test('3740 1326两实例复用数值护盾查询、护罩不算、禁强六级',()=>{
 for(const x of pick(1326))for(const kind of ['none','shield','attackShield','barrier']){const s=make(x);if(kind==='shield'||kind==='barrier')s.fighters[0].suitState[kind]=1;if(kind==='attackShield')s.fighters[0].soulState.attackShield=1;const o=turn(s);assert.equal(o.fighters[0].stages.atk,['shield','attackShield'].includes(kind)?2:1);s.fighters[0].stages.atk=6;assert.equal(turn(s).fighters[0].stages.atk,6);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.def,0);}
});
test('3740 1035冰封概率成功失败、免疫触发后续束缚且两回合到期',()=>{
 let success=false,failed=false;for(let seed=0;seed<40;seed++){const s=make(e(1035),{seed}),o=turn(s);if(o.fighters[1].ailments['冰封']){success=true;assert.equal(o.fighters[0].effects['攻击概率异常'],undefined);}else{failed=true;assert.equal(o.fighters[0].effects['攻击概率异常'].start,2);assert.equal(o.fighters[0].effects['攻击概率异常'].end,3);}}assert.ok(success&&failed);const im=make(e(1035));im.fighters[1].counts.immune=1;const o=turn(im);assert.equal(o.fighters[1].ailments['冰封'],undefined);assert.ok(turn(o,900030).fighters[1].ailments['束缚']>=2);o.round=4;assert.equal(turn(o,900030).fighters[1].ailments['束缚'],undefined);
});
test('3740 1751护盾破裂400固伤和束缚、未破不触发及异常免疫',()=>{
 const s=make(e(1751));const o=turn(s);assert.equal(o.fighters[0].suitState.shield,400);assert.equal(o.fighters[1].hp,9000);s.moveDefinitions[key(900040)].power=3000;const hit=turn(s,s.auditMoveId,900040);assert.equal(hit.fighters[0].suitState.shield,0);assert.equal(hit.fighters[1].hp,8600);assert.ok(hit.fighters[1].ailments['束缚']);s.fighters[1].counts.immune=1;const im=turn(s,s.auditMoveId,900040);assert.equal(im.fighters[1].hp,8600);assert.equal(im.fighters[1].ailments['束缚'],undefined);
});
test('3740 1239回复前严格半血及实际回复粉伤、禁疗满体',()=>{
 for(const hp of [1000,4499,4500,9000]){const s=make(e(1239),{hp}),o=turn(s);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].hp,hp<4500?hp:9000);timer(s,0,'技能禁疗');const no=turn(s);assert.equal(no.fighters[0].hp,hp);assert.equal(no.fighters[1].hp,9000);}
});

test('3740 1061两实例反转并复制强化、无强化及免弱失败清强',()=>{
 for(const x of pick(1061)){const s=make(x);s.fighters[1].stages.atk=3;const o=turn(s);assert.equal(o.fighters[1].stages.atk,-3);assert.equal(o.fighters[0].stages.atk,3);const no=turn(make(x));assert.equal(no.fighters[0].stages.atk,0);timer(s,1,'免弱');const im=turn(s);assert.equal(im.fighters[1].stages.atk,0);assert.equal(im.fighters[0].stages.atk,0);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].stages.atk,3);}
});
test('3740 1082低伤追加严格300边界、405先手固伤与免粉',()=>{
 for(const x of pick(1082)){const s=make(x),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,2700);s.moveDefinitions[key(s.auditMoveId)].power=2000;timer(s,1,'伤害上限',{amount:300});const edge=turn(s);assert.equal(edge.fighters[0].lastAttackDamage,300);assert.equal(edge.fighters[1].hp,8700);const im=make(x);im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=1;const io=turn(im);assert.equal(9000-io.fighters[1].hp,io.fighters[0].lastAttackDamage);}
 for(const first of [true,false]){const s=make(e(405),{aStats:{spe:first?500:1}}),o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,first?150:0);}
});
test('3740 749全弱、1194反转免弱、1232反转转移与881条件先制',()=>{
 const s=make(e(749));assert.ok(Object.values(turn(s).fighters[1].stages).every(n=>n===-1));timer(s,1,'免弱');assert.ok(Object.values(turn(s).fighters[1].stages).every(n=>n===0));
 for(const id of [1194,1232]){const q=make(e(id));q.fighters[0].stages.atk=-3;const o=turn(q);assert.equal(o.fighters[0].stages.atk,3);if(id===1194){assert.equal(o.fighters[0].effects['免弱'].end,4);assert.equal(turn(make(e(id))).fighters[0].effects['免弱'],undefined);}else assert.equal(o.fighters[1].stages.atk,-3);timer(q,0,'skillBlock');assert.equal(turn(q).fighters[0].stages.atk,-3);}
 const weak=make(e(881),{aStats:{spe:1}});assert.equal(turn(weak).turns[0].first,1);weak.fighters[0].stages.def=-1;assert.equal(turn(weak).turns[0].first,0);
});
test('3740 77用招定额回复、47免弱及191两版本反弹回合到期',()=>{
 const s=make(e(77),{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,1150);assert.equal(turn(o,900031).fighters[0].hp,1300);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,1000);o.round=4;assert.equal(turn(o,900031).fighters[0].hp,1150);
 const w=make(e(47),{opponentMove:20660,opponentEffectId:5}),wo=turn(w,w.auditMoveId,900042);assert.equal(wo.fighters[0].stages.def,0);wo.round=4;assert.equal(turn(wo,900031,900042).fighters[0].stages.def,-1);
 for(const x of pick(191)){const q=make(x,{opponentMove:26427,opponentEffectId:1035});let reflected=false;for(let seed=0;seed<20;seed++){q.rng=seed;const qo=turn(q,q.auditMoveId,900042);assert.equal(qo.fighters[0].ailments['冰封'],undefined);if(qo.fighters[1].ailments['冰封'])reflected=true;}assert.ok(reflected);assert.equal(turn(q).fighters[0].effects.reflect.end,x.params[0]);}
});
test('3740 693增伤843先制与1218未击败的后续窗口、当回合不提前',()=>{
 for(const id of [693,843,1218])for(const x of pick(id)){const s=make(x),o=turn(s);const k=id===693?'id913':'id984';assert.equal(o.fighters[0].effects[k].start,2);assert.equal(o.fighters[0].effects[k].end,3);const next=structuredClone(o);next.rng=0;const base=structuredClone(next);delete base.fighters[0].effects[k];if(id===693){const b=turn(base,900030).fighters[0].lastAttackDamage,n=turn(next,900030).fighters[0].lastAttackDamage;assert.ok(Math.abs(n-b*2)<=1);}else{next.fighters[0].stats.spe=1;assert.equal(turn(next,900031).turns.at(-1).first,0);}o.round=4;assert.equal(turn(o,900031).fighters[0].effects[k],undefined);}
});

test('3740 2262泪多于水时加算获得、相等不触发及封招',()=>{
 for(const [water,tears,want]of [[0,4,4],[3,4,7],[4,4,4],[5,4,5],[0,0,0]]){const s=make(e(2262));s.fighters[0].soulState.eternalWater=water;s.fighters[1].soulState.inkTears=tears;assert.equal(turn(s).fighters[0].soulState.eternalWater,want);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].soulState.eternalWater,water);}
});
test('3740 901清回合成功加攻失败不加与58下两回合必暴',()=>{
 const s=make(e(901));timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[0].stages.atk,2);assert.equal(turn(make(e(901))).fighters[0].stages.atk,0);timer(s,1,'protect');assert.equal(turn(s).fighters[0].stages.atk,0);const b=turn(make(e(58)));const f=b.fighters[0].effects;assert.equal(f['必定暴击'].start,2);assert.equal(f['必定暴击'].end,3);b.round=4;assert.equal(turn(b,900031).fighters[0].effects['必定暴击'],undefined);
});
test('3740 760双第五消除微弱而保持克制、699双第五突破免攻',()=>{
 for(const x of pick(760)){const s=make(x),r=make(x,{omit:true});s.fighters[1].type='草';r.fighters[1].type='草';const o=turn(s),ref=turn(r);assert.ok(o.fighters[0].lastAttackDamage>=ref.fighters[0].lastAttackDamage*2-1);s.fighters[1].type='火';r.fighters[1].type='火';assert.equal(turn(s).fighters[0].lastAttackDamage,turn(r).fighters[0].lastAttackDamage);}
 for(const x of pick(699)){const s=make(x);s.fighters[1].counts.attackNullify=1;assert.ok(turn(s).fighters[1].hp<9000);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[1].hp,9000);}
});
test('3740 14冻伤概率成功失败、二三回合与异常免疫',()=>{
 let yes=false,no=false;for(let seed=0;seed<100;seed++){const s=make(e(14),{seed}),o=turn(s);if(o.fighters[1].ailments['冻伤']){yes=true;assert.ok([2,3].includes(o.fighters[1].ailments['冻伤']));s.fighters[1].counts.immune=1;assert.equal(turn(s).fighters[1].ailments['冻伤'],undefined);}else no=true;}assert.ok(yes&&no);
});

test('3740 确认1751本来源盾独立消失、同来源刷新一次及其他盾不重复反应',()=>{const o=require('./helpers/assert-1751-source-shield.cjs')(3740),p=require('./helpers/3740-battle.cjs').pick(1751)[0].params;assert.equal(o.fighters[1].hp,9000-p[1]);});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3740 1239实际回复附伤不减去后续蛊反噬公共修复',()=>{const o=require('./helpers/assert-1239-atomic-heal.cjs')(3740);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3740 32666效果1061公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3740,32666);assert.ok(o.fighters[0].hp>0);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3740 37806效果1061公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-1061-reversal-path.cjs')(3740,37806);assert.ok(o.fighters[0].hp>0);});}
