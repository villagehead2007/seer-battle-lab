'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make:rawMake,turn,pick,timer}=require('./helpers/3737-battle.cjs');
const e=id=>pick(id)[0];const make=(entry,options={})=>rawMake(entry,{...(source.moves.find(m=>m.id===entry?.moveId)?.pp===0?{soul:2072}:{}),...options});
test('3737 基础17招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1),String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;zero.fighters[0].soulState.ningjie=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3737 基础17招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],Math.max(0,m.pp-1));miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3737 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});




test('3737 15害怕12烧伤成功失败和默认时长、免疫与未行动',()=>{
 for(const x of [...pick(15),...pick(12)]){const ail=x.id===12?'烧伤':'害怕';let yes=0,no=0;for(let seed=0;seed<120;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[1].ailments[ail]){assert.ok([2,3].includes(o.fighters[1].ailments[ail]));yes++;}else no++;}assert.ok(yes&&no);const im=make(x);timer(im,1,'免异常');assert.equal(turn(im).fighters[1].ailments[ail],undefined);const control=make(x);control.fighters[0].ailments['疲惫']=2;assert.equal(turn(control).fighters[1].ailments[ail],undefined);}
});
test('3737 1234清回合成功全降、保护与免弱、33清强1199吸强禁疗',()=>{
 const s=make(e(1234));timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[1].stages.acc,-1);assert.equal(turn(make(e(1234))).fighters[1].stages.atk,0);const im=structuredClone(s);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,-1,'可消除的免弱随回合效果先被清除');const protect=structuredClone(s);timer(protect,1,'protect');assert.equal(turn(protect).fighters[1].stages.atk,0);
 for(const id of [33,1199]){const s=make(e(id));s.fighters[1].stages.atk=2;const o=turn(s);assert.equal(o.fighters[1].stages.atk,0);if(id===1199){assert.equal(o.fighters[0].stages.atk,2);assert.equal(o.fighters[1].effects['无法通过自身技能恢复体力'].end,2);}timer(s,1,'幽蝶强化保护');assert.equal(turn(s).fighters[1].stages.atk,2);assert.equal(turn(make(e(id))).fighters[1].effects['无法通过自身技能恢复体力'],undefined);}
});
test('3737 1242失败累计概率与三倍成功重置、1315本招50%暴击',()=>{
 const x=e(1242);let fail,success;for(let seed=0;seed<50;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[0].soulState.effect1242Boost?.[key(x.moveId)]===10)fail={s,o};else success={s,o};}assert.ok(fail&&success);const cap=make(x);cap.fighters[0].soulState.effect1242Boost={[key(x.moveId)]:100};const c=turn(cap);assert.equal(c.fighters[0].soulState.effect1242Boost[key(x.moveId)],undefined);const ref=make(x,{omit:true});ref.moveDefinitions[key(x.moveId)].power*=3;assert.ok(c.fighters[0].lastAttackDamage>turn(fail.s).fighters[0].lastAttackDamage*2);
 const crit=e(1315);let yes=0,no=0;for(let seed=0;seed<80;seed++){const s=make(crit,{seed,criticals:true});s.moveDefinitions[key(crit.moveId)].criticalChance=0;const zero=make(crit,{seed,criticals:true,omit:true});zero.moveDefinitions[key(crit.moveId)].criticalChance=0;const o=turn(s),n=turn(zero);if(o.fighters[0].lastAttackDamage>n.fighters[0].lastAttackDamage*1.8)yes++;else no++;const high=structuredClone(s);high.moveDefinitions[key(crit.moveId)].criticalChance=1;assert.equal(turn(high).fighters[0].lastAttackDamage,o.fighters[0].lastAttackDamage);}assert.ok(yes&&no);
});
test('3737 428天敌附加683随机固伤、452实际攻击吸血与禁疗',()=>{
 for(const advantage of [false,true]){const s=make(e(428));s.fighters[0].type='火';s.fighters[1].type=advantage?'水':'火';const o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,advantage?50:0);}
 const values=new Set();for(let seed=0;seed<20;seed++){const o=turn(make(e(683),{seed})),n=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(n>=150&&n<=250);values.add(n);}assert.ok(values.size>1);
 const s=turn(make(e(452),{hp:1000}));const o=turn(s,900030);assert.equal(o.fighters[0].hp,1000+o.fighters[0].lastAttackDamage);timer(s,0,'技能禁疗');assert.equal(turn(s,900030).fighters[0].hp,1000);s.round=3;assert.equal(turn(s,900030).fighters[0].hp,1000);
});
test('3737 191反弹烧伤与1188受击焚烬失败吸取、三回合到期',()=>{
 const reflect=make(e(191),{opponentMove:10413,opponentEffectId:12});reflect.moveDefinitions[key(900042)].operations[0].params[0]=100;const r=turn(reflect,reflect.auditMoveId,900042);assert.equal(r.fighters[0].ailments['烧伤'],undefined);assert.ok(r.fighters[1].ailments['烧伤']);assert.equal(r.fighters[0].effects.reflect.end,4);
 const s=make(e(1188),{hp:1000});const o=turn(s,s.auditMoveId,900040);assert.ok(o.fighters[1].ailments['焚烬']);assert.equal(o.fighters[0].hp,1000-o.fighters[1].lastAttackDamage);const im=make(e(1188),{hp:1000});timer(im,1,'免异常');const io=turn(im,im.auditMoveId,900040);assert.equal(io.fighters[1].hp,6000);assert.equal(io.fighters[0].hp,4000-io.fighters[1].lastAttackDamage);const expired=turn(make(e(1188)));expired.round=4;assert.equal(turn(expired,900031,900040).fighters[1].ailments['焚烬'],undefined);
});
test('3737 1259概率免伤成功与失败双降、免弱和属性技能不触发',()=>{
 let yes=0,no=0;for(let seed=0;seed<50;seed++){const s=make(e(1259),{seed}),o=turn(s,s.auditMoveId,900040);if(o.fighters[0].hp===9000){yes++;assert.equal(o.fighters[1].stages.def,0);assert.equal(o.fighters[1].stages.spe,0);}else{no++;assert.equal(o.fighters[1].stages.def,-2);assert.equal(o.fighters[1].stages.spe,-2);const im=structuredClone(s);timer(im,1,'免弱');assert.equal(turn(im,im.auditMoveId,900040).fighters[1].stages.def,0);}}assert.ok(yes&&no);const attr=turn(make(e(1259)));assert.equal(attr.fighters[1].stages.def,0);assert.equal(attr.fighters[0].effects['概率攻击免疫'].end,3);
});
test('3737 993烧伤双强化532实际回复等量粉伤与843未来先制',()=>{
 for(const burn of [false,true]){const s=make(e(993));if(burn)s.fighters[1].ailments['烧伤']=2;assert.equal(turn(s).fighters[0].stages.atk,burn?2:1);timer(s,0,'禁强化');assert.equal(turn(s).fighters[0].stages.atk,0);}
 for(const hp of [1000,8500,9000]){const s=make(e(532),{hp}),o=turn(s),heal=Math.min(3000,9000-hp);assert.equal(o.fighters[0].hp,hp+heal);assert.equal(o.fighters[1].hp,9000-heal);timer(s,0,'技能禁疗');assert.equal(turn(s).fighters[1].hp,9000);}
 const p=turn(make(e(843)));assert.equal(p.fighters[0].effects.id984.start,2);assert.equal(p.fighters[0].effects.id984.end,3);p.fighters[0].stats.spe=1;assert.equal(turn(p,900031).turns[1].first,0);
});
test('3737 857先后手概率弱化与758任一烧伤威力翻倍且不叠四倍',()=>{
 const x=e(857);assert.equal(turn(make(x)).fighters[1].stages.atk,-1);let yes=0,no=0;for(let seed=0;seed<40;seed++){const o=turn(make(x,{seed,aStats:{spe:1}}));if(o.fighters[1].stages.atk===-1)yes++;else no++;}assert.ok(yes&&no);const im=make(x);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);
 for(const sides of [[],[0],[1],[0,1]]){const s=make(e(758)),ref=make(e(758),{omit:true});for(const side of sides){s.fighters[side].ailments['烧伤']=2;ref.fighters[side].ailments['烧伤']=2;}if(sides.length)ref.moveDefinitions[key(s.auditMoveId)].power*=2;assert.equal(turn(s).fighters[0].lastAttackDamage,turn(ref).fighters[0].lastAttackDamage);}
});
test('3737 678未来三回合开始强化、行动前生效、控制仍加与六级上限',()=>{
 const s=turn(make(e(678)));assert.equal(s.fighters[0].stages.atk,0);assert.equal(s.fighters[0].effects['回合初能力变化'].start,2);assert.equal(s.fighters[0].effects['回合初能力变化'].end,4);s.moveDefinitions[key(900030)].kind='physical';const ref=structuredClone(s);delete ref.fighters[0].effects['回合初能力变化'];const o=turn(s,900030);assert.equal(o.fighters[0].stages.atk,1);assert.ok(o.fighters[0].lastAttackDamage>turn(ref,900030).fighters[0].lastAttackDamage);const control=structuredClone(s);control.fighters[0].ailments['疲惫']=3;assert.equal(turn(control,900031).fighters[0].stages.atk,1);const cap=structuredClone(s);cap.fighters[0].stages.atk=6;assert.equal(turn(cap,900031).fighters[0].stages.atk,6);s.round=5;assert.equal(turn(s,900031).fighters[0].stages.atk,0);assert.equal(turn(make(e(678),{targetHp:1})).fighters[0].effects['回合初能力变化'],undefined);
});
test('3737 1088高于300严格边界、吸取比例量与禁疗免疫',()=>{
 const x=e(1088);let boundary;for(let atk=1;atk<3000;atk++){const s=make(x,{hp:1000,aStats:{atk}}),o=turn(s),n=o.fighters[0].lastAttackDamage;if(n===300){boundary=s;assert.equal(o.fighters[0].hp,1000);break;}}assert.ok(boundary);const high=structuredClone(boundary);high.fighters[0].stats.atk+=10;const o=turn(high);assert.ok(o.fighters[0].lastAttackDamage>300);assert.equal(o.fighters[0].hp,4000);const no=structuredClone(high);timer(no,0,'技能禁疗');assert.equal(turn(no).fighters[0].hp,1000);const im=structuredClone(high);im.fighters[1].soulId=622;im.fighters[1].ailments['疲惫']=2;assert.equal(turn(im).fighters[0].hp,4000);
});
test('3737 1015独立烧伤四种组合、默认二三回合和免疫',()=>{
 const combinations=new Set();for(let seed=0;seed<100;seed++){const s=make({moveId:10047,index:null},{soul:1015,omit:true,seed}),o=turn(s,900031);combinations.add(o.fighters.map(f=>!!f.ailments['烧伤']).join(','));for(const f of o.fighters)if(f.ailments['烧伤'])assert.ok([2,3].includes(f.ailments['烧伤']));}assert.equal(combinations.size,4);
 const no=make({moveId:10047,index:null},{soul:1015,omit:true});timer(no,0,'免异常');timer(no,1,'免异常');const n=turn(no,900031);assert.equal(n.fighters[0].ailments['烧伤'],undefined);assert.equal(n.fighters[1].ailments['烧伤'],undefined);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[1].hp,9000);
});
test('3737 1015敌方烧伤用攻百分比追加、属性与控制不触发、百分比抗性',()=>{
 for(const percent of [0,50]){const s=make({moveId:10047,index:null},{soul:1015,omit:true});timer(s,0,'免异常');timer(s,1,'免异常');s.fighters[1].ailments['烧伤']=2;s.fighters[1].build.resistance.percent=percent;s.fighters[1].build.resistance.fixed=100;const o=turn(s);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,percent===0?4125:2062);const attr=turn(s,900031);assert.equal(attr.fighters[1].hp,9000-(percent===0?1125:562));const ctrl=structuredClone(s);ctrl.fighters[0].ailments['疲惫']=2;assert.equal(turn(ctrl).fighters[1].hp,attr.fighters[1].hp);}
 const low=make({moveId:10047,index:null},{soul:1015,omit:true,targetHp:100});timer(low,0,'免异常');timer(low,1,'免异常');low.fighters[1].ailments['烧伤']=2;const k=turn(low,low.auditMoveId,900040);assert.equal(k.fighters[1].hp,0);assert.equal(k.fighters[1].lastAttackDamage??0,0);
});
test('3737 1015自身烧伤攻击先制与双伤、属性无先制及清除后失效',()=>{
 const s=make({moveId:10047,index:null},{soul:1015,omit:true,aStats:{spe:1}});timer(s,0,'免异常');timer(s,1,'免异常');s.fighters[0].ailments['烧伤']=2;assert.equal(turn(s,900030).turns[0].first,0);assert.equal(turn(s,900031).turns[0].first,1);const clean=structuredClone(s);delete clean.fighters[0].ailments['烧伤'];assert.equal(turn(clean,900030).turns[0].first,1);
 for(let seed=0;seed<10;seed++){const a=structuredClone(s);a.rng=seed;const b=structuredClone(a);b.fighters[0].soulId=null;b.rng=(seed+2*0x6D2B79F5)>>>0;const x=turn(a,900030).fighters[0].lastAttackDamage,y=turn(b,900030).fighters[0].lastAttackDamage;assert.ok(x===2*y||x===2*y+1,'对齐两次魂印概率抽取后的统一随机状态，双伤只容许一次向下取整差');}
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3737 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3737,532);assert.equal(o.fighters[0].hp,8960);});}
