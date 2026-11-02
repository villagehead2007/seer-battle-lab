'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make,turn,pick,timer}=require('./helpers/3686-battle.cjs');
const e=id=>pick(id)[0];
test('3686 基础26招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3686 基础26招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3686 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3686 740回合末反馈弱化并清除自身，免弱失败仍清除与三回合边界',()=>{
 const s=make(e(740));s.fighters[0].stages.atk=-2;s.fighters[0].stages.def=1;let o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[1].stages.atk,-2);assert.equal(o.fighters[0].stages.def,1);for(let r=2;r<=3;r++){o.fighters[0].stages.atk=-1;o=turn(o,900031);assert.equal(o.fighters[0].stages.atk,0);}assert.equal(o.fighters[0].effects['回合末反馈弱化'],undefined);o.fighters[0].stages.atk=-1;assert.equal(turn(o,900031).fighters[0].stages.atk,-1);
 const im=structuredClone(s);timer(im,1,'免弱');const n=turn(im);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].stages.atk,0);const b=structuredClone(s);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].stages.atk,-2);
});

test('3686 729高伤异常当前攻击及窗口，阈值失败免疫与概率失败',()=>{
 for(const x of pick(729)){const s=make(x,{aStats:{spa:8000}}),o=turn(s);assert.ok(o.fighters[0].lastAttackDamage>300);assert.equal(o.fighters[0].effects['高伤概率异常'].end,2);let yes=false,no=false;for(let seed=0;seed<30;seed++){const b=make(x,{aStats:{spa:8000},seed}),n=turn(b);if(n.fighters[1].pp[key(900041)]===99)yes=true;else no=true;}assert.ok(yes);if(x.params[2]<100)assert.ok(no);const low=turn(make(x));assert.ok(low.fighters[0].lastAttackDamage<=300);assert.equal(low.fighters[1].pp[key(900041)],98);const im=make(x,{aStats:{spa:8000}});timer(im,1,'免异常');assert.equal(turn(im).fighters[1].pp[key(900041)],98);const end=turn(o,900031);assert.equal(end.fighters[0].effects['高伤概率异常'],undefined);}
});

test('3686 1074高伤概率成功与异常失败补偿，次两回合异常及免疫失败',()=>{
 for(const x of pick(1074)){let success;for(let seed=0;seed<25;seed++){const s=make(x,{aStats:{spa:8000},seed}),o=turn(s);if(o.fighters[1].pp[key(900041)]===99){success=o;break;}}assert.ok(success);assert.equal(success.fighters[0].effects['攻击概率异常'],undefined);const under=turn(make(x));assert.ok(under.fighters[0].lastAttackDamage<280);assert.equal(under.fighters[0].effects['攻击概率异常'],undefined);const eligible=make(x,{aStats:{spa:8000}});timer(eligible,1,'免异常');const low=turn(eligible);delete low.fighters[1].effects['免异常'];assert.equal(low.fighters[0].effects['攻击概率异常'].start,2);assert.equal(low.fighters[0].effects['攻击概率异常'].end,3);assert.equal(low.fighters[0].effects['攻击概率异常'].ailment,x.params[5]===6?'害怕':'疲惫');const im=make(x,{aStats:{spa:8000}});timer(im,1,'免异常');assert.equal(turn(im).fighters[0].effects['攻击概率异常'].start,2);let applied=false;for(let seed=0;seed<20;seed++){const b=structuredClone(low);b.rng=seed;const n=turn(b,900030);if(n.fighters[1].pp[key(900041)]===low.fighters[1].pp[key(900041)])applied=true;}assert.ok(applied);assert.equal(turn(turn(low,900031),900031).fighters[0].effects['攻击概率异常'],undefined);}
});

test('3686 2385吸强免疫和无强化消回合，保护失败及次数消费',()=>{
 const s=make(e(2385));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[0].counts.immune,1);const b=structuredClone(s);timer(b,1,'幽蝶强化保护');assert.equal(turn(b).fighters[0].counts.immune,undefined);const no=make(e(2385));timer(no,1,'doubleDamage');assert.equal(turn(no).fighters[1].effects.doubleDamage,undefined);timer(no,1,'protect');assert.ok(turn(no).fighters[1].effects.doubleDamage);assert.equal(turn(make(e(2385))).fighters[0].counts.immune,undefined);
});

test('3686 2387按对手当前体力百分比每2%增加1%威力',()=>{
 for(const hp of [1,179,180,8999,9000]){const s=make(e(2387),{targetHp:hp}),ref=structuredClone(s);ref.moveDefinitions[key(s.auditMoveId)].operations=[];ref.moveDefinitions[key(s.auditMoveId)].power*=1+Math.floor(hp*100/9000/2)/100;assert.equal(turn(s).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);const im=structuredClone(s);timer(im,1,'攻击伤害免疫');assert.equal(turn(im).fighters[1].hp,hp);}
});

test('3686 2386伤后吸取和免疫时本次增伤，护盾零伤不误判为免疫',()=>{
 const s=make(e(2386),{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,3250);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,2250);
 const immune=make(e(2386),{hp:1000});immune.fighters[1].soulId=622;const plain=structuredClone(immune);plain.moveDefinitions[key(immune.auditMoveId)].operations=[];const a=turn(immune),b=turn(plain);assert.ok(Math.abs(a.fighters[0].lastAttackDamage-2*b.fighters[0].lastAttackDamage)<=1);assert.equal(a.fighters[0].hp,3250);
 const shield=make(e(2386),{hp:1000});shield.fighters[1].suitState.barrier=3000;const r=turn(shield);assert.equal(r.fighters[0].hp,3250);assert.equal(r.fighters[0].lastAttackDamage,o.fighters[0].lastAttackDamage);assert.equal(r.fighters[1].suitState.barrier,750);
 const ban=make(e(2386),{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);const cap=turn(make(e(2386),{hp:8999}));assert.equal(cap.fighters[0].hp,9000);
});

test('3686 魂印969先手增伤与低体翻倍，特攻必中回复而物攻不回复',()=>{
 for(const low of [false,true]){const s=make({moveId:10194,index:null},{soul:969,hp:low?1000:9000,hit:false});s.fighters[0].stages.acc=-6;s.moveDefinitions[key(10194)].accuracy=0;const base=structuredClone(s);base.fighters[0].soulId=null;timer(base,0,'攻击必中');const o=turn(s),b=turn(base),factor=low?2:1.5;assert.ok(Math.abs(o.fighters[0].lastAttackDamage-b.fighters[0].lastAttackDamage*factor)<=2);assert.equal(o.fighters[0].hp,Math.min(9000,s.fighters[0].hp+Math.floor(o.fighters[0].lastAttackDamage*.5)));}
 const p=make(undefined,{soul:969,hp:1000});assert.equal(turn(p).fighters[0].hp,1000);const im=make({moveId:10194,index:null},{soul:969,hp:1000});timer(im,1,'攻击伤害免疫');assert.equal(turn(im).fighters[0].hp,1000);
});

test('3686 魂印969对手出手前低体强化无关先后，先手惩罚和致死清回合',()=>{
 for(const slow of [false,true]){const s=make(undefined,{soul:969,hp:1000,aStats:{spe:slow?1:500}}),o=turn(s,900031);for(const k of keys)assert.equal(o.fighters[0].stages[k],1);assert.equal(o.fighters[1].hp,slow?6000:9000);const eq=make(undefined,{soul:969,aStats:{spe:slow?1:500}});assert.equal(turn(eq,900031).fighters[0].stages.atk,0);const ban=structuredClone(s);timer(ban,0,'禁强化');assert.equal(turn(ban,900031).fighters[0].stages.atk,0);}
 const s=make(undefined,{soul:969,hp:1000,targetHp:3000,aStats:{spe:1}});timer(s,1,'doubleDamage');const o=turn(s,900031,900040);assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[0].hp,1000);assert.ok(o.finished);
 const im=make(undefined,{soul:969,aStats:{spe:1}});im.fighters[1].soulId=622;assert.equal(turn(im,900031).fighters[1].hp,9000);
});

test('3686 77和57用招回复窗口、禁疗及满体上限',()=>{
 for(const id of [77,57])for(const x of pick(id)){const amount=id===77?200:3000,s=make(x,{hp:1000}),o=turn(s);assert.equal(o.fighters[0].hp,1000+amount);const n=turn(o,900031);assert.equal(n.fighters[0].hp,Math.min(9000,1000+2*amount));const expired=structuredClone(o);expired.round=x.params[0]+1;assert.equal(turn(expired,900031).fighters[0].hp,o.fighters[0].hp);const ban=make(x,{hp:1000});timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);assert.equal(turn(make(x,{hp:8999})).fighters[0].hp,9000);}
});

test('3686 585有序强化和433回合末指定能力，禁强化六级及到期',()=>{
 for(const x of pick(585)){const o=turn(make(x));for(let i=0;i<keys.length;i++)assert.equal(o.fighters[0].stages[keys[i]],x.params[i]);const cap=make(x);for(const k of keys)cap.fighters[0].stages[k]=6;assert.equal(turn(cap).fighters[0].stages.def,6);const ban=make(x);timer(ban,0,'禁强化');assert.equal(turn(ban).fighters[0].stages.def,0);}
 for(const x of pick(433)){let o=turn(make(x));for(let r=1;r<=3;r++){for(let i=0;i<keys.length;i++)assert.equal(o.fighters[0].stages[keys[i]],x.params[i+1]*r);if(r<3)o=turn(o,900031);}assert.equal(o.fighters[0].effects['每回合强化'],undefined);assert.deepEqual(turn(o,900031).fighters[0].stages,o.fighters[0].stages);const ban=make(x);timer(ban,0,'禁强化');assert.ok(Object.values(turn(ban).fighters[0].stages).every(n=>n===0));}
});

test('3686 440双倍三倍PP消费，当回合生效封招仍消费及第三回合到期',()=>{
 for(const x of pick(440)){let o=turn(make(x));assert.equal(o.fighters[1].pp[key(900041)],99-x.params[1]);o=turn(o,900031);assert.equal(o.fighters[1].pp[key(900041)],99-2*x.params[1]);o=turn(o,900031);assert.equal(o.fighters[1].effects['PP消耗倍增'],undefined);assert.equal(turn(o,900031).fighters[1].pp[key(900041)],98-3*x.params[1]);const low=make(x);low.fighters[1].pp[key(900041)]=1;assert.equal(turn(low).fighters[1].pp[key(900041)],0);const b=make(x);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].pp[key(900041)],98);}
});

test('3686 3清弱63反馈143反转，正负六级保护交互',()=>{
 for(const id of [3,63,143]){const s=make(e(id));s.fighters[0].stages.atk=-6;s.fighters[1].stages.def=6;const o=turn(s);if(id===143){assert.equal(o.fighters[1].stages.def,-6);assert.equal(o.fighters[0].stages.atk,-6);}else{assert.equal(o.fighters[0].stages.atk,0);if(id===63)assert.equal(o.fighters[1].stages.atk,-6);}const empty=turn(make(e(id)));assert.ok(Object.values(empty.fighters[0].stages).every(n=>n===0));const b=structuredClone(s);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].stages.atk,-6);assert.equal(turn(b).fighters[1].stages.def,6);if(id===63){const im=structuredClone(s);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);assert.equal(turn(im).fighters[0].stages.atk,0);}}
});

test('3686 775与1073高伤回满，反击等实际回复及禁疗致死边界',()=>{
 for(const id of [775,1073]){const s=make(e(id),{hp:6000,bStats:{spa:8000}}),o=turn(s,s.auditMoveId,900040);const damage=o.fighters[1].lastAttackDamage;assert.ok(damage>300);assert.equal(o.fighters[0].hp,9000);assert.equal(o.fighters[1].hp,id===1073?9000-(3000+damage):9000);const low=make(e(id),{hp:6000}),n=turn(low,low.auditMoveId,900040);assert.ok(n.fighters[1].lastAttackDamage<=300);assert.equal(n.fighters[0].hp,6000-n.fighters[1].lastAttackDamage);const ban=structuredClone(s);timer(ban,0,'技能禁疗');assert.equal(turn(ban,ban.auditMoveId,900040).fighters[0].hp,6000-damage);const dead=make(e(id),{hp:1,bStats:{spa:8000}});assert.equal(turn(dead,dead.auditMoveId,900040).fighters[0].hp,0);const ex=turn(make(e(id)));ex.round=e(id).params[0]+1;assert.ok(turn(ex,900031,900040).fighters[0].hp<9000);}
});

test('3686 694攻击必先与81必中58必暴843先制，窗口和控制失败',()=>{
 for(const id of [694,81,58,843])for(const x of pick(id)){const s=make(x,{aStats:{spe:1},hit:false}),o=turn(s);const k={694:'攻击必定先手',81:'攻击必中',58:'必定暴击',843:'id984'}[id];assert.equal(o.fighters[0].effects[k].start,2);assert.equal(o.fighters[0].effects[k].end,3);if([694,843].includes(id))assert.equal(turn(o,900030).turns[1].first,0);if(id===81){o.moveDefinitions[key(900030)].alwaysHit=false;o.moveDefinitions[key(900030)].accuracy=0;assert.ok(turn(o,900030).fighters[0].lastAttackDamage>0);}if(id===58){const base=structuredClone(o);delete base.fighters[0].effects[k];assert.ok(turn(o,900030).fighters[0].lastAttackDamage>=2*turn(base,900030).fighters[0].lastAttackDamage);}assert.equal(turn(turn(o,900031),900031).fighters[0].effects[k],undefined);const b=make(x,{hit:false});b.fighters[0].ailments['疲惫']=1;assert.equal(turn(b).fighters[0].effects[k],undefined);}
});

test('3686 48免异常191反弹，真实恐惧攻击与四回合到期',()=>{
 for(const id of [48,191])for(const x of pick(id)){const s=make(x,{opponentMove:32405,opponentEffectId:1074,bStats:{spa:8000},seed:1});const ready=turn(s);const o=turn(ready,900031,900042);assert.equal(o.fighters[0].ailments['害怕'],undefined);if(id===191)assert.ok(o.turns[1].events.some(ev=>JSON.stringify(ev).includes('反弹')));const k=id===48?'免异常':'reflect';assert.equal(o.fighters[0].effects[k].end,4);const ex=structuredClone(o);ex.round=4;assert.equal(turn(ex,900031).fighters[0].effects[k],undefined);const b=make(x);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].effects[k],undefined);}
});

test('3686 683随机固伤450随机回复1144吸取，范围抗性和禁疗',()=>{
 for(const id of [683,450,1144])for(const x of pick(id)){for(let seed=0;seed<12;seed++){const s=make(x,{hp:1000,seed}),o=turn(s),n=id===450?o.fighters[0].hp-1000:9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(n>=x.params[0]&&n<=x.params[1]);if(id===1144)assert.equal(o.fighters[0].hp-1000,n);const b=structuredClone(s);if(id===683){b.fighters[1].build.resistance.fixed=50;const t=turn(b);assert.equal(9000-t.fighters[1].hp-t.fighters[0].lastAttackDamage,Math.floor(n*.5));}else{timer(b,0,'技能禁疗');assert.equal(turn(b).fighters[0].hp,1000);}}if(id!==683)assert.equal(turn(make(x,{hp:8999})).fighters[0].hp,9000);}
});

test('3686 951反转及1159吸强成功获得一次异常免疫，失败和消费',()=>{
 for(const id of [951,1159]){const s=make(e(id));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,id===951?-2:0);assert.equal(o.fighters[0].counts.immune,1);assert.equal(turn(make(e(id))).fighters[0].counts.immune,undefined);const b=structuredClone(s);timer(b,0,'skillBlock');assert.equal(turn(b).fighters[0].counts.immune,undefined);const im=make(e(id),{opponentMove:32405,opponentEffectId:1074,bStats:{spa:8000}});im.fighters[1].stages.atk=2;assert.equal(turn(im,im.auditMoveId,900042).fighters[0].counts.immune,0);}
});

test('3686 677持续用招吸强，保护无强化及三回合到期',()=>{
 let o=turn(make(e(677)));o.fighters[1].stages.atk=2;o=turn(o,900031);assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].stages.atk,0);o.fighters[1].stages.def=1;timer(o,1,'幽蝶强化保护');o=turn(o,900031);assert.equal(o.fighters[1].stages.def,1);assert.equal(o.fighters[0].effects['用招吸强'],undefined);const ex=structuredClone(o);delete ex.fighters[1].effects['幽蝶强化保护'];assert.equal(turn(ex,900031).fighters[1].stages.def,1);
});

test('3686 971低体双吸半血阈值与禁疗抗性，四回合窗口',()=>{
 for(const x of pick(971)){const low=turn(make(x,{hp:4499})),edge=turn(make(x,{hp:4500}));assert.equal(low.fighters[1].hp,3000);assert.equal(low.fighters[0].hp,9000);assert.equal(edge.fighters[1].hp,6000);const b=make(x,{hp:1000});timer(b,0,'技能禁疗');assert.equal(turn(b).fighters[0].hp,1000);const ex=turn(make(x));ex.round=5;assert.equal(turn(ex,900031).fighters[1].hp,ex.fighters[1].hp);}
});

test('3686 877先手强化1283先手翻倍，禁强化与六级封顶',()=>{
 for(const id of [877,1283])for(const slow of [false,true]){const s=make(e(id),{aStats:{spe:slow?1:500}}),o=turn(s);assert.equal(o.fighters[0].stages.atk,id===877?(slow?0:1):(slow?1:2));const ban=structuredClone(s);timer(ban,0,'禁强化');assert.equal(turn(ban).fighters[0].stages.atk,0);for(const k of keys)s.fighters[0].stages[k]=6;assert.equal(turn(s).fighters[0].stages.atk,6);}
});

test('3686 925满体翻倍威力，低一点不翻倍与免攻',()=>{
 const full=make(e(925)),low=make(e(925),{hp:8999});assert.ok(turn(full).fighters[0].lastAttackDamage>turn(low).fighters[0].lastAttackDamage);const ref=structuredClone(full);ref.moveDefinitions[key(full.auditMoveId)].operations=[];ref.moveDefinitions[key(full.auditMoveId)].power*=2;assert.equal(turn(full).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);timer(full,1,'攻击伤害免疫');assert.equal(turn(full).fighters[1].hp,9000);
});

test('3686 478封属两回合真实强化失效，1208反转后下一次攻击失效',()=>{
 const s=make(e(478),{opponentMove:20044}),o=turn(s,s.auditMoveId,900042);assert.equal(o.fighters[1].stages.def,0);const n=turn(o,900031,900042);assert.equal(n.fighters[1].stages.def,0);assert.equal(turn(n,900031,900042).fighters[1].stages.def,1);const b=make(e(478));timer(b,0,'skillBlock');assert.equal(turn(b).fighters[1].effects.statusBlock,undefined);
 const a=make(e(1208));a.fighters[0].stages.atk=-2;const r=turn(a,a.auditMoveId,900040);assert.equal(r.fighters[0].stages.atk,2);assert.equal(r.fighters[0].hp,9000);assert.equal(r.fighters[1].counts.nextAttackInvalid,0);assert.ok(turn(r,900031,900040).fighters[0].hp<9000);assert.ok(turn(make(e(1208)),e(1208).moveId,900040).fighters[0].hp<9000);
});

test('3686 1138消回合害怕失败转疲惫，897未击败减伤一次',()=>{
 const s=make(e(1138),{seed:1});timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].pp[key(900041)],99);const im=structuredClone(s);im.fighters[1].counts.immune=2;assert.equal(turn(im).fighters[1].pp[key(900041)],98);const protect=structuredClone(s);timer(protect,1,'protect');assert.ok(turn(protect).fighters[1].effects.doubleDamage);
 const a=make(e(897)),ref=make(e(897),{omit:true});const r=turn(a,a.auditMoveId,900040),base=turn(ref,ref.auditMoveId,900040);assert.equal(9000-r.fighters[0].hp,Math.floor((9000-base.fighters[0].hp)*.5));const next=turn(r,900031,900040);assert.equal(r.fighters[0].hp-next.fighters[0].hp,base.fighters[0].hp-turn(base,900031,900040).fighters[0].hp);const dead=make(e(897),{targetHp:1});assert.equal(turn(dead).fighters[0].counts.attackReductionUses,undefined);
});

test('3686 高伤条件恰好300与280不触发，729和1074严格大于',()=>{
 for(const x of pick(729)){const s=make(x,{aStats:{spa:8000}});timer(s,1,'伤害上限',{amount:300});const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,300);assert.equal(o.fighters[1].pp[key(900041)],98);}
 for(const x of pick(1074)){const s=make(x,{aStats:{spa:8000}});timer(s,1,'伤害上限',{amount:280});const o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,280);assert.equal(o.fighters[1].pp[key(900041)],98);assert.equal(o.fighters[0].effects['攻击概率异常'],undefined);}
});
