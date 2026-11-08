'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4826/snapshot.json'),H=require('./helpers/remaining-battle.cjs')(source),{E,key,keys,make,turn,timer,sum}=H;
const row=id=>{for(const m of source.moves){const index=m.effectInstances.findIndex(e=>e.id===id);if(index>=0)return {move:m.id,index};}throw Error(id);};
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);fn(event,c);}};try{return run();}finally{E.SOULS=old;}}
test('4826全部5招原生2016初始化与真实有序实例、PP、基础命中先制暴击和整招封锁',()=>{
 for(const m of source.moves){const s=make({move:m.id,soul:true,hp:4000}),actual=s.moveDefinitions[key(m.id)],compiled=E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m);assert.equal(compiled.issue,'');assert.equal(s.fighters[0].soulId,2016);assert.deepEqual(actual.operations.map(x=>[x.effectId,x.index,x.phase,x.params]),compiled.operations.map(x=>[x.effectId,x.index,x.phase,x.params]));turn(s);assert.equal(s.fighters[0].pp[key(m.id)],m.pp-1);const zero=make({move:m.id});zero.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(zero),/有 PP/);assert.equal(sum(zero,'fixed'),0);assert.equal(sum(zero,'percent'),0);assert.equal(zero.fighters[0].pp[key(m.id)],0);const blocked=make({move:m.id});timer(blocked,0,'skillBlock');turn(blocked);assert.equal(sum(blocked,'fixed'),0);assert.equal(sum(blocked,'percent'),0);assert.equal(blocked.fighters[0].pp[key(m.id)],m.pp-1);}
 assert.equal(require('./helpers/next50-base-probe.cjs').verify(H).length,5);
});
test('4826真实2016攻固粉25%减伤，收到两种后剩余类型首伤50%，重复类型不翻倍，真伤不减且逐回合清空',()=>{
 const s=make({move:29174,index:-1,soul:true}),values=[];observe((e,c)=>{if(e==='afterUse'&&c.a.side===1)for(const type of ['fixed','percent','fixed','true'])values.push(c.hurt(c.t,100,'魂印实际伤害类型',type));},()=>turn(s,29174,10127));assert.deepEqual(values,[75,50,75,100]);assert.deepEqual(s.fighters[0].soulState.damageTypes2016.types,['attack','fixed','percent']);const b=make({move:29174,index:-1});turn(b,29174,10127);assert.ok(Math.abs(sum(s,'attack',1)-sum(b,'attack',1)*.75)<=1);
 const next=[];observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1)next.push(c.hurt(c.t,100,'新回合固定首伤','fixed'));},()=>turn(s,29174,20117));assert.deepEqual(next,[75]);assert.deepEqual(s.fighters[0].soulState.damageTypes2016.types,['fixed']);
});
test('4826真实2016只检查敌流血，烧伤仍减伤；流血取消减伤且免控优先次数免异，非控仍消费次数',()=>{
 for(const bleed of [false,true]){const s=make({move:29174,index:-1,soul:true}),out=[];s.fighters[1].ailments[bleed?'流血':'烧伤']=99;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){out.push(c.hurt(c.t,100,'固伤判定','fixed'));if(bleed){c.t.counts.immune=2;assert.equal(c.ailment(c.t,'害怕',c.a,false,false,2),false);assert.equal(c.t.counts.immune,2);assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),false);assert.equal(c.t.counts.immune,1);}}},()=>turn(s));assert.equal(out[0],bleed?100:75);}
});
test('4826真实2016免疫零伤不计种类，保1正结算伤仍计，盾后零伤不补计',()=>{
 const s=make({move:29174,index:-1,soul:true,hp:1});timer(s,0,'致命保留',{hp:1});timer(s,0,'固定百分比免疫');observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){assert.equal(c.hurt(c.t,100,'被免疫固定','fixed'),0);assert.deepEqual(c.t.soulState.damageTypes2016.types,[]);delete c.t.effects['固定百分比免疫'];c.hurt(c.t,100,'保1正结算固定','fixed');assert.equal(c.t.hp,1);assert.deepEqual(c.t.soulState.damageTypes2016.types,['fixed']);}},()=>turn(s));assert.equal(s.fighters[0].hp,1);
});
test('4826/879消回合成功回满失败不回，技能禁疗阻回不阻消；1217消强成功才下次攻无效且属性不消费',()=>{
 const a=make(row(879));a.fighters[0].hp=2000;turn(a);assert.equal(a.fighters[0].hp,9000);const b=make(row(879));b.fighters[1].effects={};b.fighters[0].hp=2000;turn(b);assert.equal(b.fighters[0].hp,2000);const c=make(row(879));c.fighters[0].hp=2000;timer(c,0,'技能禁疗');turn(c);assert.equal(c.fighters[0].hp,2000);assert.equal(c.fighters[1].effects['攻击必中'],undefined);
 const d=make(row(1217));d.fighters[1].stages.atk=2;turn(d);assert.equal(d.fighters[1].stages.atk,1);assert.equal(d.fighters[1].counts.nextAttackInvalid,1);turn(d,38125);assert.equal(d.fighters[1].counts.nextAttackInvalid,1);turn(d,38125,10127);assert.equal(d.fighters[1].counts.nextAttackInvalid,0);assert.equal(sum(d,'attack',1),0);const no=make(row(1217));turn(no);assert.equal(no.fighters[1].counts.nextAttackInvalid??0,0);
});
test('4826/1875当前用招生效与4回合到期、低半严格翻倍、满体溢出禁疗按净HP等量附伤',()=>{
 for(const [hp,want]of [[1000,6000],[4500,3000],[8500,500],[9000,0]]){const s=make({...row(1875),hp});turn(s);assert.equal(s.fighters[0].hp,hp+want);assert.equal(sum(s,'percent'),want);}
 const s=make({...row(1875),hp:1000});timer(s,0,'技能禁疗');turn(s);assert.equal(s.fighters[0].hp,1000);assert.equal(sum(s,'percent'),0);const a=make({...row(1875),hp:1000});turn(a);for(let r=2;r<=5;r++){a.fighters[0].hp=8000;a.fighters[1].hp=9000;turn(a,38125);assert.equal(sum(a,'percent'),r<=4?1000:0);}
});
test('4826/191反弹不消次数、到期失效；1426仅无异常施害怕，被免疫不另抽其他异常',()=>{
 const a=make(row(191));turn(a);observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){c.t.counts.immune=2;assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),false);assert.equal(c.t.counts.immune,2);assert.ok(c.a.ailments['中毒']);}},()=>turn(a));
 const b=make(row(1426));turn(b);assert.ok(b.fighters[1].ailments['害怕']);const c=make(row(1426));c.fighters[1].ailments['中毒']=99;turn(c);assert.equal(c.fighters[1].ailments['害怕'],undefined);const d=make(row(1426));d.fighters[1].counts.immune=1;turn(d);assert.equal(d.fighters[1].counts.immune,0);assert.deepEqual(d.fighters[1].ailments,{});
});
test('4826/1397低半强化翻倍及禁强化、776843明确下两回合开始并到期',()=>{
 for(const [hp,want]of [[4499,2],[4500,1]]){const s=make({...row(1397),hp});turn(s);for(const k of keys)assert.equal(s.fighters[0].stages[k],want);}const no=make(row(1397));timer(no,0,'禁强化');turn(no);for(const k of keys)assert.equal(no.fighters[0].stages[k],0);
 for(const id of [776,843]){const s=make(row(id));turn(s);const relevant=Object.values(s.fighters[0].effects).find(e=>e.start===2&&e.end===3);assert.ok(relevant);turn(s,38123);assert.equal(s.fighters[0].soulState.resolvedPriority.value,id===843?5:3);const damage=sum(s);const base=make({move:38123,index:-1});turn(base);if(id===776)assert.ok(Math.abs(damage-2*sum(base))<=2);turn(s,38123);turn(s,38123);assert.equal(s.fighters[0].soulState.resolvedPriority.value,3);}
});
test('4826/1084异常附固翻倍、固定免疫零伤；2060当前及次回合敌属性流血，失败净回血等量百分伤且两回合到期',()=>{
 for(const status of [false,true]){const s=make(row(1084));if(status)s.fighters[1].ailments['中毒']=99;turn(s);assert.equal(sum(s,'fixed'),status?400:200);}const no=make(row(1084));timer(no,1,'固定百分比免疫');turn(no);assert.equal(sum(no,'fixed'),0);
 const a=make(row(2060));turn(a);assert.ok(a.fighters[1].ailments['流血']);const b=make({...row(2060),hp:8500});b.fighters[1].counts.immune=3;turn(b);assert.equal(b.fighters[0].hp,9000);assert.equal(sum(b,'percent'),500);b.fighters[0].hp=8000;turn(b,38125);assert.equal(sum(b,'percent'),1000);b.fighters[0].hp=8000;turn(b,38125);assert.equal(sum(b,'percent'),0);
 const c=make({...row(2060),hp:1000});c.fighters[1].counts.immune=1;timer(c,0,'技能禁疗');turn(c);assert.equal(c.fighters[0].hp,1000);assert.equal(sum(c,'percent'),0);
});
test('4826/1352解弱成功再全强，1289独立反馈真实双倍成功封下次技能；第五先解弱后无可反馈不封招',()=>{
 const a=make(row(1352));a.fighters[0].stages.atk=-2;turn(a);for(const k of keys)assert.equal(a.fighters[0].stages[k],1);const no=make(row(1352));turn(no);assert.equal(no.fighters[0].stages.atk,0);
 const b=make(row(1289));b.fighters[0].stages.atk=-2;turn(b);assert.equal(b.fighters[0].stages.atk,0);assert.equal(b.fighters[1].stages.atk,-4);assert.equal(b.fighters[1].counts.nextSkillInvalid??0,0);assert.equal(b.fighters[1].pp[key(20117)],b.moveDefinitions[key(20117)].pp-1);const full=make({move:38125});full.fighters[0].stages.atk=-2;turn(full);assert.equal(full.fighters[0].stages.atk,1);assert.equal(full.fighters[1].stages.atk,1);assert.equal(full.fighters[1].counts.nextSkillInvalid??0,0);
});
test('4826/1875回复倍率按实际净增加附伤，百分伤免疫不抹自身回复，命中效果封锁不授持续资源',()=>{
 const a=make({...row(1875),hp:1000});timer(a,0,'回复效果削减',{fraction:.5});turn(a);assert.equal(a.fighters[0].hp,4000);assert.equal(sum(a,'percent'),3000);
 const b=make({...row(1875),hp:1000});timer(b,1,'固定百分比免疫');turn(b);assert.equal(b.fighters[0].hp,7000);assert.equal(sum(b,'percent'),0);
 const c=make({...row(1875),hp:1000});timer(c,0,'statusBlock',{pendingStatusHitScope:true});turn(c);assert.equal(c.fighters[0].hp,1000);assert.equal(c.fighters[0].effects['鲨鱼用招低体回复附伤'],undefined);
});
test('4826/2060敌实际攻击不触流血失败补偿，属性整招无效仍属实际用招；封锁授予命中效果不产生资源',()=>{
 const a=make({...row(2060),hp:1000});turn(a,38124,10127);assert.equal(a.fighters[1].ailments['流血'],undefined);assert.equal(sum(a,'percent'),0);
 const b=make({...row(2060),hp:1000});timer(b,1,'skillBlock');turn(b);assert.ok(b.fighters[1].ailments['流血']);
 const c=make(row(2060));timer(c,0,'攻击伤害免疫');timer(c,0,'攻击技能命中效果失效');turn(c);assert.equal(c.fighters[0].effects['鲨鱼对手属性流血'],undefined);
});
test('4826/2016无流血可受控制，状态到期移除后免控失效；致死不复活且种类只录正结算',()=>{
 const a=make({move:29174,index:-1,soul:true});observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){assert.equal(c.ailment(c.t,'害怕',c.a,false,false,2),true);assert.ok(c.t.ailments['害怕']);}},()=>turn(a));
 const b=make({move:29174,index:-1,soul:true,hp:1});observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1)c.hurt(c.t,100,'致死固定','fixed');},()=>turn(b));assert.equal(b.fighters[0].hp,0);assert.deepEqual(b.fighters[0].soulState.damageTypes2016.types,['fixed']);
});
test('4826真实2016敌流血常驻免控先于回合反弹，不反弹不消耗次数，普通异常仍反弹',()=>{
 const s=make({move:29174,index:-1,soul:true});s.fighters[1].ailments['流血']=99;timer(s,0,'reflect');s.fighters[0].counts.immune=2;observe((e,c)=>{if(e==='beforeUse'&&c.a.side===1){assert.equal(c.ailment(c.t,'害怕',c.a,false,false,2),false);assert.equal(c.a.ailments['害怕'],undefined);assert.equal(c.t.counts.immune,2);assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),false);assert.ok(c.a.ailments['中毒']);assert.equal(c.t.counts.immune,2);}},()=>turn(s));
});
