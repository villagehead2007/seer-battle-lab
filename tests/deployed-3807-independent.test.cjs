'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,make,turn,pick,timer,key,keys}=require('./helpers/3807-battle.cjs');
const e=id=>pick(id)[0];
test('3807 22的5%疲惫两回合与612的5%五段，成功失败及免疫致死边界',()=>{
 let yes=false,no=false,multi=false,single=false;
 for(let seed=0;seed<100;seed++){
  const s=make(e(22),{seed}),o=turn(s);if(o.fighters[1].ailments['疲惫']){yes=true;assert.equal(o.fighters[1].ailments['疲惫'],2);timer(s,1,'免异常');assert.equal(turn(s).fighters[1].ailments['疲惫'],undefined);}else no=true;
  const m=make(e(612),{seed}),n=turn(m),plain=make(e(612),{seed,omit:true}),b=turn(plain);if(n.fighters[0].lastAttackDamage>b.fighters[0].lastAttackDamage*4){multi=true;assert.equal(n.fighters[0].pp[key(m.auditMoveId)],4);}else single=true;
 }assert.ok(yes&&no&&multi&&single);
 const lethal=make(e(612),{targetHp:1}),out=turn(lethal);assert.equal(out.fighters[1].hp,0);assert.equal(out.fighters[0].lastAttackDamage,1);
});
test('3807 47与48五回合免弱免异常、到期恢复及封招不授予免疫',()=>{
 for(const [id,name]of [[47,'免弱'],[48,'免异常']]){const s=make(e(id)),o=turn(s);assert.equal(o.fighters[0].effects[name].end,5);const blocked=make(e(id));timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].effects[name],undefined);o.round=6;assert.equal(turn(o,900031).fighters[0].effects[name],undefined);}
 const weak=make(e(47),{opponentMove:20513});assert.equal(turn(weak,undefined,900042).fighters[0].stages.spe,0);
 for(let seed=0;seed<100;seed++){const s=make(e(48),{seed,opponentMove:11069});assert.equal(turn(s,undefined,900042).fighters[0].ailments['疲惫'],undefined);}
});
test('3807 697突破伤害上限但保留攻击免疫、1061反转复制与失败消强',()=>{
 const s=make(e(697));timer(s,1,'攻击伤害上限',{amount:1});assert.ok(turn(s).fighters[0].lastAttackDamage>1);timer(s,1,'攻击伤害免疫');assert.equal(turn(s).fighters[1].hp,9000);
 for(const protect of [false,true]){const s=make(e(1061));s.fighters[1].stages.atk=3;if(protect)timer(s,1,'免弱');const o=turn(s);assert.equal(o.fighters[1].stages.atk,protect?0:-3);assert.equal(o.fighters[0].stages.atk,protect?0:3);}
 const no=make(e(1061));assert.equal(turn(no).fighters[0].stages.atk,0);no.fighters[1].stages.atk=6;no.fighters[0].stages.atk=5;assert.equal(turn(no).fighters[0].stages.atk,6);timer(no,0,'禁强化');assert.equal(turn(no).fighters[0].stages.atk,5);
});
test('3807 1285未击败逐槽扣2PP、零值下限、击败及封招不扣',()=>{
 const s=make(e(1285));s.fighters[1].pp[key(900040)]=1;const o=turn(s);assert.equal(o.fighters[1].pp[key(900040)],0);assert.equal(o.fighters[1].pp[key(900041)],96);for(const id of [900042,900043,900044])assert.equal(o.fighters[1].pp[key(id)],97);
 const lethal=make(e(1285),{targetHp:1}),l=turn(lethal);assert.equal(l.fighters[1].hp,0);assert.equal(l.fighters[1].pp[key(900040)],99);
 const blocked=make(e(1285));timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[1].pp[key(900040)],99);
});
test('3807 4与5逐实例强化弱化、六级边界、免弱及禁强化',()=>{
 for(const entry of [...pick(4),...pick(5)]){const [stat,,delta]=entry.params,side=entry.id===4?0:1,k=keys[stat];const s=make(entry),o=turn(s);assert.equal(o.fighters[side].stages[k],delta);s.fighters[side].stages[k]=delta>0?6:-6;assert.equal(turn(s).fighters[side].stages[k],delta>0?6:-6);const no=make(entry);timer(no,side,delta>0?'禁强化':'免弱');assert.equal(turn(no).fighters[side].stages[k],0);}
});
test('3807 1130体力严格比较与1283先后手强化、免弱和六级边界',()=>{
 for(const hp of [8999,9000]){const s=make(e(1130),{hp}),o=turn(s);for(const k of keys)assert.equal(o.fighters[1].stages[k],hp<9000?-2:-1);timer(s,1,'免弱');for(const k of keys)assert.equal(turn(s).fighters[1].stages[k],0);}
 for(const slow of [false,true]){const s=make(e(1283),{aStats:{spe:slow?1:500}}),o=turn(s);for(const k of keys)assert.equal(o.fighters[0].stages[k],slow?1:2);s.fighters[0].stages.atk=6;assert.equal(turn(s).fighters[0].stages.atk,6);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.def,0);}
});
test('3807 880消回合成功才给下回合先制、843下两回合窗口与过期',()=>{
 const s=make(e(880));timer(s,1,'免弱');const o=turn(s);assert.equal(o.fighters[1].effects['免弱'],undefined);assert.equal(o.fighters[0].effects.id984.start,2);assert.equal(o.fighters[0].effects.id984.end,2);assert.equal(turn(make(e(880))).fighters[0].effects.id984,undefined);
 const n=turn(make(e(843),{aStats:{spe:1}}));assert.equal(n.fighters[0].effects.id984.start,2);assert.equal(n.fighters[0].effects.id984.end,3);assert.equal(turn(n,900031).turns.at(-1).first,0);n.round=4;assert.equal(turn(n,900031).turns.at(-1).first,1);
});
test('3807 440对手两回合双倍扣PP、679禁技能回复及到期恢复',()=>{
 const s=make(e(440)),o=turn(s);assert.equal(o.fighters[1].pp[key(900041)],97);const n=turn(o,900031);assert.equal(n.fighters[1].pp[key(900041)],95);assert.equal(turn(n,900031).fighters[1].pp[key(900041)],94);
 const h=make(e(679),{opponentMove:26591,opponentEffectId:1451,targetHp:1000}),b=turn(h,undefined,900042);assert.equal(b.fighters[1].hp,1000-b.fighters[0].lastAttackDamage);assert.equal(b.fighters[1].effects['技能禁疗'].end,2);b.round=3;const healed=turn(b,900031,900042);assert.equal(healed.fighters[1].hp,b.fighters[1].hp+4500);
});
test('3807 882按正能力种类加威力、848按负能力种类固伤及粉伤免疫',()=>{
 for(const id of [882,848]){const s=make(e(id)),base=turn(s),side=id===882?0:1;s.fighters[side].stages.acc=id===882?6:-6;const o=turn(s);if(id===882)assert.ok(o.fighters[0].lastAttackDamage>base.fighters[0].lastAttackDamage);else assert.equal(base.fighters[1].hp-o.fighters[1].hp,100);s.fighters[side].stages.acc=id===882?1:-1;assert.equal(turn(s).fighters[1].hp,o.fighters[1].hp);}
 const s=make(e(848));s.fighters[1].stages.acc=-1;s.fighters[1].soulId=622;const baseline=structuredClone(s);baseline.moveDefinitions[key(s.auditMoveId)].operations=[];const o=turn(s),b=turn(baseline);assert.equal(o.fighters[1].hp,b.fighters[1].hp);assert.equal(o.fighters[0].lastAttackDamage,b.fighters[0].lastAttackDamage);
});
test('3807 1450按对手任意技能PP严格小于2吸取250或500，零PP和不足体力边界',()=>{
 for(const pp of [0,1,2,3]){const s=make(e(1450),{hp:1000});s.fighters[1].pp[key(900040)]=pp;const o=turn(s),n=pp<2?500:250;assert.equal(o.fighters[0].hp,1000+n);assert.equal(o.fighters[1].hp,9000-n);}
 const low=make(e(1450),{hp:1000,targetHp:100});const l=turn(low);assert.equal(l.fighters[1].hp,0);assert.equal(l.fighters[0].hp,1250);
 const full=make(e(1450));const f=turn(full);assert.equal(f.fighters[0].hp,9000);assert.equal(f.fighters[1].hp,8750);
});
test('3807 1450固定免疫仍理论回复，技能禁疗与失效保持限制',()=>{
 const immune=make(e(1450),{hp:1000});immune.fighters[1].soulId=622;const i=turn(immune);assert.equal(i.fighters[0].hp,1250);assert.equal(i.fighters[1].hp,9000);
 const banned=make(e(1450),{hp:1000});timer(banned,0,'技能禁疗');const b=turn(banned);assert.equal(b.fighters[0].hp,1000);assert.equal(b.fighters[1].hp,8750);
 const blocked=make(e(1450),{hp:1000});timer(blocked,0,'skillBlock');const x=turn(blocked);assert.equal(x.fighters[0].hp,1000);assert.equal(x.fighters[1].hp,9000);
});
test('3807 1451高体获得400数值盾、低体回复半上限、等体无收益及回复截断',()=>{
 for(const [hp,target,expected,shield]of [[5000,4000,5000,400],[1000,8000,5500,0],[4000,4000,4000,0],[8000,8500,9000,0]]){const s=make(e(1451),{hp,targetHp:target}),o=turn(s);assert.equal(o.fighters[0].hp,expected);assert.equal(o.fighters[0].suitState.shield,shield);}
 const s=make(e(1451),{hp:5000,targetHp:4000}),o=turn(s),n=turn(o,900031,900040);assert.equal(n.fighters[0].hp,5000);assert.ok(n.fighters[0].suitState.shield<400);assert.ok(n.fighters[0].suitState.shield>0);
});
test('3807 1451技能禁疗、封招失败与既有护盾共存',()=>{
 const banned=make(e(1451),{hp:1000});timer(banned,0,'技能禁疗');assert.equal(turn(banned).fighters[0].hp,1000);
 const blocked=make(e(1451),{hp:5000,targetHp:4000});timer(blocked,0,'skillBlock');assert.equal(turn(blocked).fighters[0].suitState.shield,0);
 const layered=make(e(1451),{hp:5000,targetHp:4000});layered.fighters[0].suitState.shield=100;assert.equal(turn(layered).fighters[0].suitState.shield,500);
});

test('3807 基础17招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3807 基础17招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns.at(-1).first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns.at(-1).events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});



