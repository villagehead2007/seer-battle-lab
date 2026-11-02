'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3724-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3724 基础26招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3724 基础26招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3724 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3724 原版觉醒全部技能接入与真实PP、跨版本第五拒绝',()=>{
 for(const group of source.skillVersions){const s={...structuredClone(source),selectedSoulId:group.soulId};for(const id of group.moveIds){const m=s.moves.find(x=>x.id===id),load=E.WIKI.defaultMoves(s);if(!load.includes(id))load[load.findIndex(k=>s.moves.find(x=>x.id===k).fifth===m.fifth)]=id;assert.deepEqual(E.WIKI.assess(s,load).issues,[]);const b=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[load,load]});assert.equal(b.fighters[0].pp[key(id)],m.pp);}
 const other=source.skillVersions.find(g=>g!==group),bad=E.WIKI.defaultMoves(s);bad[0]=other.moveIds.find(id=>!group.moveIds.includes(id)&&s.moves.find(m=>m.id===id).fifth);assert.ok(E.WIKI.assess(s,bad).issues.length);}
});
test('3724 15与12概率成功失败、1605必定异常、默认二三回合与免疫',()=>{
 for(const x of [...pick(15),...pick(12),...pick(1605)]){const ail=x.id===12||x.params[1]===2?'烧伤':'害怕';let yes=0,no=0;for(let seed=0;seed<160;seed++){const o=turn(make(x,{seed}));if(o.fighters[1].ailments[ail]){assert.ok([2,3].includes(o.fighters[1].ailments[ail]));yes++;}else no++;}assert.ok(yes);if(x.params[0]<100)assert.ok(no);else assert.equal(no,0);const im=make(x);timer(im,1,'免异常');assert.equal(turn(im).fighters[1].ailments[ail],undefined);}
});
test('3724 40先手37四分之一边界威力与604两版本连续随机威力封顶',()=>{
 for(const [id,options,twice]of [[40,{},true],[40,{aStats:{spe:1}},false],[37,{hp:2249},true],[37,{hp:2250},false]]){const x=e(id),s=make(x,options),ref=make(x,{...options,omit:true});if(twice)ref.moveDefinitions[key(x.moveId)].power*=2;assert.equal(turn(s).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);}
 for(const x of pick(604)){const damages=new Set();for(let seed=0;seed<20;seed++){const s=make(x,{seed});damages.add(turn(s).fighters[0].lastAttackDamage);const cap=structuredClone(s);cap.fighters[0].previousMoveId=key(x.moveId);cap.fighters[0].consecutiveUses=20;const capped=turn(cap).fighters[0].lastAttackDamage;assert.ok(capped>=turn(s).fighters[0].lastAttackDamage);cap.fighters[0].consecutiveUses=50;assert.equal(turn(cap).fighters[0].lastAttackDamage,capped);}assert.ok(damages.size>1);}
});
test('3724 33清强3清弱1055清强封攻与1124清回合成功增伤失败保护',()=>{
 for(const id of [33,1055]){const s=make(e(id));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);if(id===1055){assert.equal(o.fighters[1].effects.attackBlock.start,2);assert.equal(turn(o,900031,900040).fighters[1].lastAttackDamage??0,0);}const no=make(e(id));assert.equal(turn(no).fighters[1].effects.attackBlock,undefined);timer(s,1,'幽蝶强化保护');assert.equal(turn(s).fighters[1].stages.atk,2);}
 const s=make(e(3));s.fighters[0].stages.atk=-3;s.fighters[0].stages.spa=2;const o=turn(s);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[0].stages.spa,2);timer(s,0,'skillBlock');assert.equal(turn(s).fighters[0].stages.atk,-3);
 const clear=make(e(1124));timer(clear,1,'doubleDamage');const c=turn(clear);assert.equal(c.fighters[1].effects.doubleDamage,undefined);assert.equal(c.fighters[0].effects.id913.start,2);const ref=structuredClone(c);delete ref.fighters[0].effects.id913;assert.ok(turn(c,900030).fighters[0].lastAttackDamage>turn(ref,900030).fighters[0].lastAttackDamage);assert.equal(turn(make(e(1124))).fighters[0].effects.id913,undefined);
});
test('3724 48免异常191反弹47免弱922反弹弱化和明确持续时间',()=>{
 for(const id of [48,191]){for(const x of pick(id)){const s=make(x,{opponentMove:36744,opponentEffectId:1605});s.moveDefinitions[key(900042)].priority=0;const o=turn(s,s.auditMoveId,900042);assert.equal(o.fighters[0].ailments['烧伤'],undefined);if(id===191)assert.ok(o.fighters[1].ailments['烧伤']);assert.equal(o.fighters[0].effects[id===191?'reflect':'免异常'].end,x.params[0]);}}
 for(const id of [47,922]){const s=make(e(id),{opponentMove:20447});const o=turn(s,s.auditMoveId,900042);assert.equal(o.fighters[0].stages.spe,0);assert.equal(o.fighters[1].stages.spe,id===922?-1:0);}
});
test('3724 125攻击限伤二回合到期438当前体力概率回复与683随机固伤',()=>{
 const s=make(e(125),{bStats:{spa:9999}}),o=turn(s,s.auditMoveId,900040);assert.equal(o.fighters[0].hp,8800);assert.equal(o.fighters[0].effects['攻击伤害上限'].end,2);o.round=3;assert.ok(turn(o,900031,900040).fighters[0].hp<8600);
 let yes=0,no=0;for(let seed=0;seed<40;seed++){const s=make(e(438),{hp:3000,seed});const hp=turn(s).fighters[0].hp;if(hp===4000)yes++;else {assert.equal(hp,3000);no++;}timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[0].hp,3000);}assert.ok(yes&&no);
 const vals=new Set();for(let seed=0;seed<20;seed++){const o=turn(make(e(683),{seed}));const n=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(n>=150&&n<=250);vals.add(n);}assert.ok(vals.size>1);
});
test('3724 885高体双强化843下回合先制58必暴582未击败必暴933次数672击败回复',()=>{
 for(const x of pick(885))for(const hp of [5000,9000]){const s=make(x,{hp,targetHp:5000});assert.equal(turn(s).fighters[0].stages.atk,hp>5000?2:1);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);}
 for(const x of pick(843)){const o=turn(make(x));assert.equal(o.fighters[0].effects.id984.start,2);assert.equal(o.fighters[0].effects.id984.amount,2);o.fighters[0].stats.spe=1;assert.equal(turn(o,900031).turns[1].first,0);}
 for(const id of [58,582]){const o=turn(make(e(id)));assert.equal(o.fighters[0].effects['必定暴击'].start,2);assert.equal(o.fighters[0].effects['必定暴击'].end,3);const no=structuredClone(o);delete no.fighters[0].effects['必定暴击'];assert.ok(turn(o,900030).fighters[0].lastAttackDamage>turn(no,900030).fighters[0].lastAttackDamage);}
 const counts=turn(make(e(933)));assert.equal(counts.fighters[0].counts.nextCrit,2);assert.equal(turn(counts,900030).fighters[0].counts.nextCrit,1);assert.equal(turn(make(e(933),{targetHp:1})).fighters[0].counts.nextCrit,undefined);
 assert.equal(turn(make(e(672),{hp:1000,targetHp:1})).fighters[0].hp,9000);assert.equal(turn(make(e(672),{hp:1000})).fighters[0].hp,1000);const no=make(e(672),{hp:1000,targetHp:1});timer(no,0,'技能禁疗');assert.equal(turn(no).fighters[0].hp,1000);
});
