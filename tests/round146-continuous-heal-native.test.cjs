'use strict';const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),rows=require('../research/TEAM-STAGE-2/round146-continuous-source-input-20261113.json').rows,pp='potion:pp';
function make(row,gu=false,fatal=false){const foe=S.species(gu?3516:2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000},s=E.createBattle({wikiSnapshots:[row.source,foe],wikiLoadouts:[loadout(row.source,[row.moveId]),loadout(foe,[])],builds:[{overrides:stats},{overrides:{...stats,spe:500}}],seed:14,criticals:false});assert.equal(s.fighters[0].soulId,row.selectedSoulId);if(gu){s.fighters[0].hp=fatal?1:row.speciesId===4946?4000:1000;if(fatal)s.fighters[0].effects['回复效果削减']={start:1,end:9,fraction:.999};s.fighters[1].stages.atk=1;const out=E.resolveTurn(s,[pp,pp]);assert.ok(out.fighters[0].soulState.soulGu?.length>0);assert.ok(out.fighters[0].hp>0,row.key+' setup survives');return out;}return s;}
function cast(s,row){const old=E.WIKI.effectsEngine,grants=[];E.WIKI.effectsEngine={...old,run(phase,ops,c){if(c.a.side!==0||(c.m.wikiId??c.m.id)!==row.moveId)return old.run(phase,ops,c);const ctx={...c,timed(f,key,n,data,...rest){const out=c.timed(f,key,n,data,...rest);if(ctx.effectInstanceIndex===row.index)grants.push({key,n,data:structuredClone(data),side:f.side});return out;}};return old.run(phase,ops,ctx);}};try{return{out:E.resolveTurn(s,['wiki:'+row.moveId,pp]),grants};}finally{E.WIKI.effectsEngine=old;}}
const routeKeys={29052:'盖亚实际用招回复附伤',29046:'盖亚实际用招回复附伤',29434:'星礼用招低体回复附伤',29456:'万霆用招流程后回复',28667:'冥判用招回血粉伤',28723:'星河用招回血粉伤',28734:'星光用招回血粉伤',28741:'星光使用技能回复附伤',29022:'超算实际用招回血粉伤',26331:'超算实际用招回血粉伤',28977:'皮神实际用招回复粉伤',29001:'纳多雷实际用招回复粉伤',29110:'纳多雷实际用招回复粉伤',29128:'纳多雷实际用招回复粉伤',29172:'卡布达用招低体回复附伤',29180:'卡布达用招低体回复附伤',29198:'星礼用招低体回复附伤'};
test('532与1065及927全部123真实原来源保原魂原招原参数，完整用招实际授对应持续监听',()=>{
 const errors=[];for(const row of rows){try{const x=cast(make(row),row);assert.equal(x.grants.length,1,row.key);const g=x.grants[0],expected=routeKeys[row.moveId]??(row.effectId===532?'用招回血粉伤':row.effectId===1065?'用招低体双倍回血粉伤':'用招低体回血粉伤');assert.equal(g.key,expected,row.key+' exact runtime listener');assert.equal(g.side,0,row.key);assert.equal(g.n,row.args[0],row.key);assert.equal(g.data.fraction,1/row.args[1],row.key);if(row.effectId!==532)assert.equal(g.data.threshold,1/row.args[2],row.key);if(row.moveId===28944)assert.equal(x.out.fighters[0].effects[g.key].source4713,true);if(row.moveId===28958)assert.equal(x.out.fighters[0].effects[g.key].source4716,true);assert.equal(x.out.fighters[0].soulState.skillUses['wiki:'+row.moveId],1,row.key);}catch(e){errors.push(row.key+': '+e.message);}}assert.deepEqual(errors,[]);
});
const privateCases=[
 [4713,28944,'钢熠身躯实际用招回复','钢熠身躯用招等量百分比'],
 [4732,28977,'神辉实际用招回复','神辉实际用招等量粉伤'],
 [4743,29001,'大地精能实际用招回复','大地精能等量粉伤'],
 [4748,29022,'重组拆分实际用招回复','重组拆分等量百分比'],
 [4829,29172,'卡布达用招回血','卡布达净回血等量附伤'],
 [4840,29198,'星礼用招回血','星礼净回血等量附伤'],
 [4937,29434,'星礼用招回血','星礼净回血等量附伤'],
 [4766,29052,'盖亚实际使用技能回复','盖亚实际用招回复等量粉伤'],
 [4766,29046,'盖亚实际使用技能回复','盖亚实际用招回复等量粉伤'],
 [4946,29456,'万霆流程后回复','万霆流程后回复附伤'],
 [4625,28667,'冥判已授用招恢复','冥判实际回复等量百分伤'],
 [4643,28723,'星河用招回复','星河等量百分比'],
 [4716,28958,'崩坏圣堂实际用招回复','崩坏圣堂实际用招等量百分比'],
 [4647,28734,'星光既授使用回复','星光回复等量百分'],
 [4649,28741,'星光使用技能回复','星光使用技能等量百分比'],
 ...[532,1065,927].map(id=>{const row=rows.find(r=>r.effectId===id),label=id===532?'用招回血粉伤':id===1065?'用招低体双倍回血粉伤':'用招低体回血粉伤';return[row.speciesId,row.moveId,label,label];})
];
test('十八公共或独立持续用招回复路径在真实自然蛊后按实际治疗量附伤，不把随后蛊40扣成净回复',()=>{
 const errors=[];for(const[id,mid,healLabel,damageLabel]of privateCases){try{const row=rows.find(r=>r.speciesId===id&&r.moveId===mid),x=cast(make(row,true),row),events=x.out.turns.at(-1).events,heals=events.filter(e=>e.kind==='heal'&&e.text.startsWith('A 方 '+healLabel+'：')),hits=events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='percent'&&e.text.includes(damageLabel));assert.equal(heals.length,1,row.key+' actual native listener fired');const healed=Number(heals[0].text.match(/回复 (\d+) 点体力/)?.[1]??0);assert.ok(healed>0,row.key);assert.equal(hits.length,1,row.key+' selected listener attaches once');assert.equal(hits[0].damage.settledDamage,healed,row.key+' true treatment basis');assert.ok(events.some(e=>e.text.includes('留魂之蛊汲取')&&e.damage?.settledDamage===40),row.key+' Gu actually ran');}catch(e){errors.push(id+': '+e.message);}}assert.deepEqual(errors,[]);
});
test('冥判星河与崩坏三独立用招监听治疗后遭自然蛊击败不继续附百分比',()=>{
 const errors=[];for(const[id,mid,label]of[[4625,28667,'冥判实际回复等量百分伤'],[4643,28723,'星河等量百分比'],[4716,28958,'崩坏圣堂实际用招等量百分比']]){try{const row=rows.find(r=>r.speciesId===id&&r.moveId===mid),x=cast(make(row,true,true),row),events=x.out.turns.at(-1).events;assert.equal(x.out.fighters[0].hp,0,row.key+' natural Gu KO');assert.ok(events.some(e=>e.kind==='heal'&&/回复 [1-9]\d* 点体力/.test(e.text)),row.key+' actual treatment precedes KO');assert.equal(events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='percent'&&e.text.includes(label)).length,0,row.key+' no posthumous damage');}catch(e){errors.push(id+': '+e.message);}}assert.deepEqual(errors,[]);
});
