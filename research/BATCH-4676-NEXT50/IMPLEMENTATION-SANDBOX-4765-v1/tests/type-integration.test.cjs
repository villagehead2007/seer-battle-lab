'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const E=require('../dist/engine.js'),D=require('../type-database.cjs'),chart=D.toLegacyChart();
const key=(side,slot)=>'wiki:'+((902850+side)*10+slot);
function snapshot(side,type,attack,ops=[]){const id=902850+side;return {id,name:'公共属性接入夹具',type,base:{maxHp:100,atk:100,def:100,spa:100,spd:100,spe:100},souls:[],source:{provider:'seerapi'},typeChart:structuredClone(chart),missingEffects:[],effects:ops.map(([id])=>({id,argsNum:E.WIKI.effectsEngine.registry[id].argsNum,template:E.WIKI.effectsEngine.registry[id].template})),moves:Array.from({length:4},(_,i)=>({id:id*10+i,name:'属性接入测试'+i,provider:'seerapi',kind:i===0?'physical':i===1?'special':'status',type:i<2?attack:'普通',power:i<2?120:0,pp:30,priority:0,accuracy:100,alwaysHit:true,critical:'1/16',level:i,fifth:false,effectIds:i===0?ops.map(x=>x[0]):[],effectInstances:i===0?ops.map(([id,args])=>({id,args})):[],description:''}))};}
function game(own,attack,defense,ops=[],engine=E){return engine.createBattle({wikiSnapshots:[snapshot(0,own,attack,ops),snapshot(1,defense,'普通')],criticals:false,seed:'type-integration',builds:[{overrides:{maxHp:4000,atk:200,spa:200,def:200,spd:200,spe:500}},{overrides:{maxHp:4000,atk:200,spa:200,def:200,spd:200,spe:100}}]});}
const turn=(s,slot=0,engine=E)=>engine.resolveTurn(s,[key(0,slot),key(1,2)]);
function checkDamage(s,affinity,stab,slot=0){const out=turn(s,slot),event=out.turns[0].events.find(e=>e.kind==='damage');assert.ok(event);const detail=event.detail,roll=Number(detail.match(/浮动 (\d+)%/)[1]);assert.ok(detail.includes('× 属性 '+affinity+' ×'));assert.ok(detail.includes('× 本系 '+stab+' ×'));const expected=affinity===0?0:Math.floor(102*stab*affinity*roll/100);assert.equal(s.fighters[1].hp-out.fighters[1].hp,expected);assert.equal(out.fighters[0].pp[key(0,slot)],29);assert.equal(s.fighters[0].pp[key(0,slot)],30);return out;}

test('全部基础和组合倍率均可无快照查库，未知属性明确失败而非默认1',()=>{
 assert.equal(E.TYPES,D);
 for(const a of D.data.combinations)for(const d of D.data.combinations)assert.equal(E.typeEffectiveness(a.name,d.name),D.multiplier(a.combinationId,d.combinationId));
 assert.equal(E.typeEffectiveness('自然圣灵','电'),4);assert.equal(E.typeEffectiveness('电','自然圣灵'),.5);
 assert.throws(()=>E.typeEffectiveness('不存在','火'),/未覆盖/);assert.throws(()=>E.sameTypeBonus('属性','火'),/未覆盖/);
});

test('真实伤害覆盖单双克制和边界0、0.125、0.25、0.5、1、1.5、2.625、4',()=>{
 for(const [attack,defense,n]of [['电','地面',0],['电','圣灵地面',.125],['电','机械地面',.25],['火','水',.5],['火','普通',1],['火','草超能',1.5],['火飞行','草机械',2.625],['火','草机械',4]])checkDamage(game('王',attack,defense),n,1);
});

test('单属性同系、双属性主副单系及同组合均有本系，部分重合双系不加成',()=>{
 for(const [own,attack,bonus]of [['火','火',1.5],['火飞行','火',1.5],['火飞行','飞行',1.5],['火飞行','火 飞行',1.5],['火·飞行','火飞行',1.5],['火飞行','火龙',1],['火','火飞行',1],['火飞行','普通',1]]){
  assert.equal(E.sameTypeBonus(attack,own),bonus);checkDamage(game(own,attack,'普通'),1,bonus);checkDamage(game(own,attack,'普通'),1,bonus,1);
 }
});

test('状态技能不调用攻击倍率，组成单属性本系随当前属性变化而更新',()=>{
 const s=game('火飞行','火','普通'),before=structuredClone(s),idle=turn(s,2);assert.deepEqual(idle.fighters.map(f=>f.hp),before.fighters.map(f=>f.hp));assert.equal(idle.fighters[0].pp[key(0,2)],29);
 checkDamage(s,1,1.5);const changed=structuredClone(s);changed.fighters[0].type='水';checkDamage(changed,1,1);assert.equal(s.fighters[0].type,'火飞行');
});

test('技能1616授予本系不和默认本系重复相乘，非克制不授予',()=>{
 checkDamage(game('王','火','草',[[1616,[]]]),2,1.5);
 checkDamage(game('火飞行','火','草',[[1616,[]]]),2,1.5);
 checkDamage(game('王','火','普通',[[1616,[]]]),1,1);
});

test('属性无效保留零伤害，微弱无视效果仍在基础数据库倍率之后生效',()=>{
 checkDamage(game('王','火','水',[[760,[]]]),1,1);
 checkDamage(game('电','电','地面'),0,1.5);
 const s=game('火飞行','火','草机械');s.fighters[1].effects['当回合免伤']={start:1,end:99};assert.equal(turn(s).fighters[1].hp,4000);
});

test('经典战斗分支也查库并保持零伤害，不再使用草对草的硬编码表',()=>{
 const s=E.createBattle({species:['rey','gaia'],criticals:false,seed:'classic-types',builds:[{overrides:{maxHp:4000,atk:200,def:200,spe:500}},{overrides:{maxHp:4000,atk:200,def:200,spe:100}}]});s.fighters[1].type='地面';const out=E.resolveTurn(s,['flash','purify']);assert.equal(out.fighters[1].hp,4000);assert.equal(out.fighters[0].pp.flash,s.fighters[0].pp.flash-1);
 const weak=structuredClone(s);weak.fighters[1].type='草';const o=E.resolveTurn(weak,['flash','purify']);assert.ok(o.fighters[1].hp<4000);assert.ok(o.turns[0].events.find(e=>e.kind==='damage').detail.includes('× 属性 0.5 ×'));
});

test('默认内置对战也记录数据库版本，重开一致且版本不匹配拒绝重算',()=>{
 const s=E.createBattle({criticals:false}),again=E.createBattle(s.initial);assert.deepEqual(again.fighters,s.fighters);assert.deepEqual(s.typeLibraryVersion,E.typeLibraryVersion);
 const bad=structuredClone(s);bad.typeLibraryVersion.stabRule='unknown';assert.throws(()=>E.resolveTurn(bad,['gate','inherit']),/版本不匹配/);assert.throws(()=>E.createBattle({...s.initial,typeLibraryVersion:{}}),/版本不匹配/);
 const online=game('火飞行','火','普通');assert.deepEqual(E.createBattle(online.initial).fighters,online.fighters);
});

test('快照倍率冲突、映射冲突与缺项均拒绝开局且不污染原局',()=>{
 const old=game('火飞行','火','普通'),expected=turn(old);
 for(const mutate of [s=>s.typeChart.rows['战斗']['邪灵']=1,s=>s.typeChart.aliases['火飞行']=['水','飞行'],s=>delete s.typeChart.rows['火']['普通'],s=>s.typeChart.revision='seerapi:other']){
  const a=snapshot(0,'火飞行','火'),b=snapshot(1,'普通','普通');mutate(a);mutate(b);assert.throws(()=>E.createBattle({wikiSnapshots:[a,b]}),/冲突|不完整/);assert.deepEqual(turn(old),expected);
 }
 const changed=structuredClone(old);changed.typeChart.rows['火']['普通']=2;assert.throws(()=>turn(changed),/来源冲突/);assert.equal(changed.fighters[0].pp[key(0,0)],30);
});

test('来源冲突记录逐项保存API和Wiki证据，不覆盖任一来源原文',()=>{
 const c=require('../data/types/conflicts.json'),sources=require('../data/types/sources.json'),resolve=(o,p)=>p.split('/').slice(1).reduce((x,k)=>x[k],o);assert.equal(c.matrixConflicts.length,3);
 for(const row of c.matrixConflicts){const [a,w]=row.alternatives;assert.equal(resolve(sources,a.relationPointer).multiple,a.value);assert.equal(a.source.provider,'seerapi');assert.equal(w.source.provider,'bwiki');assert.ok(resolve(sources,w.source.pointer).includes(w.originalDescription));assert.equal(D.baseMultiplier(row.attack,row.defense),row.selected.value);assert.notEqual(a.value,w.value);assert.equal(row.status,'recorded-source-disagreement');}
 assert.equal(c.formulaConflict.selected.revision,388521);assert.equal(c.formulaConflict.alternative.source.revision,388558);
 const stab=D.data.rules.stab,raw=resolve(require('../data/statuses/sources.json'),stab.source.pointer);assert.ok(raw.includes(stab.originalDescription));assert.match(stab.originalDescription,/两个单属性系别/);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),stab.source.hash);
});

test('浏览器按真实脚本顺序加载同一数据库，版本/矩阵/伤害与Node一致',()=>{
 const html=fs.readFileSync('dist/index.html','utf8'),scripts=[...html.matchAll(/<script defer src="([^"]+)"/g)].map(m=>m[1]),context=vm.createContext({console});
 for(const file of scripts.slice(0,scripts.indexOf('engine.js')+1))vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context,{filename:file});
 assert.equal(context.BattleTypeCatalog.sha256,crypto.createHash('sha256').update(fs.readFileSync('data/types/types.json')).digest('hex'));
 const browser=context.BattleEngine;assert.equal(browser.typeEffectiveness('火飞行','草机械'),2.625);assert.equal(browser.sameTypeBonus('火','火飞行'),1.5);
 const s=game('火飞行','火','草机械'),bs=game('火飞行','火','草机械',[],browser);assert.deepEqual(JSON.parse(JSON.stringify(turn(bs,0,browser))),JSON.parse(JSON.stringify(turn(s))));
});
