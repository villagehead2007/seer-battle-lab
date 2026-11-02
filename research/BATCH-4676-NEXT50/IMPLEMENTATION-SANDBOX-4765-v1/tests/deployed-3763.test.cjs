'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3763-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3763 基础19招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3763 基础19招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns.at(-1).first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns.at(-1).events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});


test('3763 4与5能力变化概率、封锁、免弱及六级边界',()=>{
 for(const x of [...pick(4),...pick(5)]){let hit=false,miss=false;for(let seed=0;seed<40;seed++){const s=make(x,{seed}),o=turn(s),side=x.id===4?0:1,k=keys[x.params[0]];if(o.fighters[side].stages[k]===x.params[2])hit=true;else miss=true;}assert.ok(hit);if(x.params[1]<100)assert.ok(miss);const s=make(x),side=x.id===4?0:1,k=keys[x.params[0]];s.fighters[side].stages[k]=x.params[2]>0?6:-6;assert.equal(turn(s).fighters[side].stages[k],s.fighters[side].stages[k]);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[side].stages[k],s.fighters[side].stages[k]);if(x.id===5){s.fighters[1].stages[k]=0;timer(s,1,'免弱');assert.equal(turn(s).fighters[1].stages[k],0);}}
});
test('3763 868清强成功降下回合先制、885高体强化与1056反转封属',()=>{
 const s=make(e(868));s.fighters[1].stages.spe=2;const o=turn(s);assert.equal(o.fighters[1].stages.spe,0);assert.equal(turn(o,900031).turns.at(-1).first,0);assert.equal(Object.values(turn(make(e(868))).fighters[1].effects).length,0);
 for(const x of pick(885))for(const hp of [8999,9000]){const q=make(x,{targetHp:hp}),n=turn(q);assert.ok(Object.values(n.fighters[0].stages).every(v=>v===(hp<9000?2:1)));timer(q,0,'禁强化');assert.equal(turn(q).fighters[0].stages.atk,0);}
 const q=make(e(1056));q.fighters[0].stages.atk=-3;const n=turn(q);assert.equal(n.fighters[0].stages.atk,3);assert.equal(n.fighters[1].effects.statusBlock.end,2);assert.equal(turn(make(e(1056))).fighters[1].effects.statusBlock,undefined);timer(q,0,'弱化不可解除反转');assert.equal(turn(q).fighters[0].stages.atk,-3);
});
test('3763 741高伤免疫严格阈值，440双倍PP及到期',()=>{
 const s=make(e(741)),o=turn(s);assert.equal(o.fighters[0].effects['大额攻击免疫'].end,2);
 const high=structuredClone(o);high.moveDefinitions[key(900040)].power=10000;assert.equal(turn(high,900031,900040).fighters[1].lastAttackDamage,0);const low=turn(o,900031,900040);assert.ok(low.fighters[1].lastAttackDamage>0);high.round=3;assert.ok(turn(high,900031,900040).fighters[1].lastAttackDamage>300);
 const q=make(e(440)),n=turn(q);assert.equal(n.fighters[1].pp[key(900041)],97);assert.equal(turn(n,900031).fighters[1].pp[key(900041)],95);const end=turn(turn(n,900031),900031);assert.equal(end.fighters[1].pp[key(900041)],94);
});
test('3763 136自身MISS回复与15命中害怕，封招不当MISS和免疫',()=>{
 const s=make(e(136),{hp:1000,hit:false});s.moveDefinitions[key(s.auditMoveId)].alwaysHit=false;s.moveDefinitions[key(s.auditMoveId)].accuracy=0;assert.equal(turn(s).fighters[0].hp,3250);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].hp,1000);
 const q=make(e(15)),n=turn(q);assert.ok([2,3].includes(n.fighters[1].ailments['害怕']));q.fighters[1].counts.immune=1;assert.equal(turn(q).fighters[1].ailments['害怕'],undefined);
});
test('3763 47免弱48免异常191反弹及固定期限',()=>{
 for(const id of [47,48,191]){const s=make(e(id)),o=turn(s),effect=id===47?'免弱':id===48?'免异常':'reflect';assert.equal(o.fighters[0].effects[effect].end,id===191?4:3);o.moveDefinitions[key(900041)].operations=[{effectId:5,index:0,phase:'afterHit',params:{chance:1,stat:'atk',amount:-1,target:'opponent'},sourceArgs:[0,100,-1]},{effectId:15,index:1,phase:'afterHit',params:[100],sourceArgs:[100]}];const n=turn(o,900031);if(id===47)assert.equal(n.fighters[0].stages.atk,0);else assert.equal(n.fighters[0].ailments['害怕'],undefined);if(id===191)assert.ok(n.fighters[1].ailments['害怕']);o.round=5;const expired=turn(o,900031);assert.equal(expired.fighters[0].stages.atk,-1);assert.ok(expired.fighters[0].ailments['害怕']);}
});
test('3763 482概率先制、843下回合先制与58及582必暴期限',()=>{
 let first=false,last=false;for(let seed=0;seed<30;seed++){const s=make(e(482),{seed,aStats:{spe:1}}),o=turn(s);if(o.turns.at(-1).first===0)first=true;else last=true;}assert.ok(first&&last);
 const s=make(e(843),{aStats:{spe:1}}),o=turn(s);assert.equal(o.turns.at(-1).first,1);assert.equal(turn(o,900031).turns.at(-1).first,0);o.round=4;assert.equal(turn(o,900031).turns.at(-1).first,1);
 for(const id of [58,582]){const q=make(e(id)),n=turn(q);assert.equal(n.fighters[0].effects['必定暴击'].start,2);assert.equal(n.fighters[0].effects['必定暴击'].end,3);const yes=turn(n,900030);const no=structuredClone(n);delete no.fighters[0].effects['必定暴击'];assert.ok(yes.fighters[0].lastAttackDamage>=turn(no,900030).fighters[0].lastAttackDamage*2-1);}
});
test('3763 1086低体增伤、683随机固伤和906逐次百分比上限',()=>{
 const s=make(e(1086),{hp:1000}),base=make(e(1086),{hp:9000});assert.ok(turn(s).fighters[0].lastAttackDamage>turn(base).fighters[0].lastAttackDamage);const eq=make(e(1086),{hp:1000,targetHp:1000});assert.equal(turn(eq).fighters[0].lastAttackDamage,turn(base).fighters[0].lastAttackDamage);
 const values=new Set();for(let seed=0;seed<40;seed++){const q=make(e(683),{seed}),n=turn(q),extra=9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage;assert.ok(extra>=200&&extra<=400);values.add(extra);}assert.ok(values.size>2);
 let q=make(e(906));for(const fraction of [.2,.3,.4,.4]){q.fighters[1].hp=9000;const n=turn(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,9000*fraction);q=n;}
});
test('3763 1065低体回复翻倍并按实际回复追加、禁疗和满体',()=>{
 for(const hp of [1000,4499,4500,8000,9000]){const s=make(e(1065),{hp}),n=turn(s),gain=Math.min(9000-hp,hp<4500?6000:3000);assert.equal(n.fighters[0].hp,hp+gain);assert.equal(n.fighters[1].hp,9000-gain);assert.equal(n.fighters[0].effects['用招低体双倍回血粉伤'].end,4);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,hp);assert.equal(turn(s).fighters[1].hp,9000);}
});
test('3763 573两实例明确石化期限及清强失败免疫',()=>{
 for(const x of pick(573)){const s=make(x),o=turn(s);o.fighters[0].stages.atk=2;o.moveDefinitions[key(900041)].operations=[{effectId:868,index:0,phase:'afterHit',params:[3],sourceArgs:[3]}];const n=turn(o,900031);assert.equal(n.fighters[0].stages.atk,0);assert.equal(n.fighters[1].ailments['石化'],2+x.params[3]-1);const im=structuredClone(o);im.fighters[1].counts.immune=1;assert.equal(turn(im,900031).fighters[1].ailments['石化'],undefined);o.fighters[0].stages.atk=0;assert.equal(turn(o,900031).fighters[1].ailments['石化'],undefined);}
});
test('3763 889清回合石化和979成功下两回合先制，免断失败',()=>{
 for(const id of [889,979]){const s=make(e(id));timer(s,1,'免弱');const n=turn(s);assert.equal(n.fighters[1].effects['免弱'],undefined);if(id===889)assert.ok([2,3].includes(n.fighters[1].ailments['石化']));else {assert.equal(n.fighters[0].effects.id984.start,2);assert.equal(n.fighters[0].effects.id984.end,3);}timer(s,1,'protect');const no=turn(s);assert.ok(no.fighters[1].effects['免弱']);assert.equal(no.fighters[1].ailments['石化'],undefined);assert.equal(no.fighters[0].effects.id984,undefined);}
});

test('3763 1751护盾抵伤消失固伤与石化概率、部分盾不触发',()=>{
 let stone=false,none=false;for(let seed=0;seed<40;seed++){const s=make(e(1751),{seed});s.moveDefinitions[key(900040)].power=1500;const n=turn(s,s.auditMoveId,900040);assert.equal(n.fighters[0].suitState.shield,0);assert.equal(n.fighters[1].hp,8800);if(n.fighters[1].ailments['石化']){stone=true;assert.ok([2,3].includes(n.fighters[1].ailments['石化']));}else none=true;}assert.ok(stone&&none);const s=make(e(1751)),n=turn(s,s.auditMoveId,900040);assert.ok(n.fighters[0].suitState.shield>0);assert.equal(n.fighters[1].hp,9000);const no=make(e(1751));timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].suitState.shield,0);
});

test('3763 确认1751本来源盾独立消失、同来源刷新一次及其他盾不重复反应',()=>{const o=require('./helpers/assert-1751-source-shield.cjs')(3763),p=require('./helpers/3763-battle.cjs').pick(1751)[0].params;assert.equal(o.fighters[1].hp,9000-p[1]);});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3763 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3763);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3763 1751公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1751-cold-probability.cjs')(3763);assert.equal(Object.keys(o.fighters[1].ailments).length,0);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3763 1697实际免疫补真或来源盾独立反应公共回归',()=>{const o=require('./helpers/assert-1697-actual-immunity.cjs')(3763);assert.ok(o.fighters[0].hp>0);});}
