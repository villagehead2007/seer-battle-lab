'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),vm=require('node:vm');
const D=require('../type-database.cjs'),R=require('../dist/type-rules.js'),sources=require('../data/types/sources.json');
const sha=x=>crypto.createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
const pointer=(d,p)=>p.split('/').slice(1).reduce((x,k)=>x[k.replace(/~1/g,'/').replace(/~0/g,'~')],d);

test('完整来源分页覆盖26元素和139组合，ID命名空间独立且不补造组合',()=>{
 for(const [kind,rows,idKey]of [['element_type',D.data.types,'id'],['element_type_combination',D.data.combinations,'combinationId']]){
  const pages=sources.records.filter(r=>r.key.startsWith(kind+':')),raw=pages.flatMap(r=>r.data.results);
  assert.equal(rows.length,pages[0].data.count);assert.equal(new Set(rows.map(x=>x[idKey])).size,rows.length);
  assert.deepEqual(rows.map(x=>x[idKey]),raw.map(x=>x.id));
  for(let i=0;i<pages.length;i++){assert.equal(pages[i].data.hash,pages[0].data.hash);assert.equal(pages[i].data.next,pages[i+1]?.url??null);}
 }
 assert.equal(D.data.types.length,26);assert.equal(D.data.combinations.length,139);
 assert.equal(D.data.combinations.filter(c=>c.classification==='dual').length,113);
 assert.equal(D.getType(21),null);assert.deepEqual(D.getCombination(21).types,[1,10]);
 assert.equal(D.findCombination([1,2]),null);assert.equal(D.getCombination('草水'),null);
});

test('每条属性与组合可追溯真实原始记录、revision/hash和获取时间，未给出的描述保持null',()=>{
 for(const r of sources.records)assert.equal(r.sha256,sha(r.data));
 for(const t of [...D.data.types,...D.data.combinations]){
  const raw=pointer(sources,t.source.pointer);assert.deepEqual(t.raw,raw);assert.equal(t.source.revision,raw.hash);assert.equal(t.source.hash,sha(raw));assert.ok(Number.isFinite(Date.parse(t.source.loadedAt)));assert.match(t.source.url,/^https:\/\/api.seerapi.com\/v1\/element_type/);
  assert.equal(t.originalDescription,null);assert.equal(t.source.versionTimestamp,null);
 }
 for(const t of D.data.types)assert.equal(t.category,null);
 const rule=D.data.rules.combination;assert.equal(rule.source.hash,sha(pointer(sources,rule.source.pointer)));assert.ok(pointer(sources,rule.source.pointer).includes(rule.originalDescription));assert.match(rule.originalDescription,/return \(x \+ y\) \/ 2/);
 const cached=require('../data/statuses/sources.json'),page=Object.values(cached.records.find(r=>r.key==='wiki-mechanics').data.query.pages).find(p=>p.title==='对战机制');
 assert.equal(rule.conflict.source.hash,sha(page.revisions[0].slots.main['*']));assert.ok(page.revisions[0].slots.main['*'].includes(rule.conflict.originalDescription));
});

test('按名称/ID查询及单双组合查询保留主副属性，别名只映射已存在组合',()=>{
 for(const t of D.data.types){assert.equal(D.getType(t.name),t);assert.equal(D.getType(t.id),t);assert.equal(D.findCombination([t.id]).classification,'single');}
 for(const c of D.data.combinations){assert.equal(D.getCombination(c.combinationId),c);for(const alias of c.aliases)assert.equal(D.getCombination(alias),c);assert.equal(D.findCombination(c.types),c);assert.equal(D.findCombination(c.types.slice().reverse()),c);assert.deepEqual(c.types,[c.raw.primary.id,...(c.raw.secondary?[c.raw.secondary.id]:[])]);}
 assert.equal(D.getCombination('自然 圣灵'),D.getCombination('自然圣灵'));assert.equal(D.getCombination('自然·圣灵'),D.getCombination(88));
 assert.equal(D.getCombination('属性'),null);assert.equal(D.findCombination([1,1]),null);assert.equal(D.findCombination([1,2,3]),null);
});

test('676格基础矩阵逐格等于SeerAPI，显式保留0与1，防御查询不是倒数',()=>{
 const elements=sources.records.find(r=>r.key==='element_type:0').data.results;let count=0;
 for(const t of elements)for(const r of t.relations){assert.equal(D.baseMultiplier(t.id,r.target_type.id),r.multiple);count++;}assert.equal(count,676);
 assert.equal(D.baseMultiplier('电','地面'),0);assert.equal(D.baseMultiplier('普通','火'),1);assert.equal(D.baseMultiplier('火','草'),2);assert.equal(D.baseMultiplier('草','火'),.5);
 assert.equal(D.matchups('火').find(x=>x.name==='草').multiplier,2);assert.equal(D.matchups('火','incoming').find(x=>x.name==='草').multiplier,.5);
 assert.equal(D.matchups('普通').find(x=>x.name==='火').relation,'neutral');assert.equal(D.matchups('电').find(x=>x.name==='地面').relation,'immune');
 for(const c of D.data.combinations)for(const entry of D.matchups(c.combinationId,'incoming'))assert.equal(entry.multiplier,D.multiplier(entry.combinationId,c.combinationId));
});

test('双属性按有证据的加权规则计算而非相乘，覆盖4倍/零分项/双对双',()=>{
 assert.equal(D.multiplier('火','草机械'),4);
 assert.equal(D.multiplier('火','草超能'),1.5); // 2 and 1, not 2
 assert.equal(D.multiplier('光','草暗影'),.5); // 0 and 2
 assert.equal(D.multiplier('电','战斗地面'),.25); // 1 and 0
 assert.equal(D.multiplier('自然圣灵','电'),4);
 assert.equal(D.multiplier('火飞行','草机械'),2.625); // (4 + (2 + .5)/2)/2
 assert.equal(R.combine(0,0),0);assert.equal(R.combine(0,.5),.125);assert.equal(R.combine(.5,.5),.5);
 assert.equal(R.calculate(D.data,[3],[1,6]),4);assert.equal(R.calculate(D.data,[3,4],[1,6]),2.625);
});

test('19321格组合矩阵完整且与现有公共倍率函数兼容',()=>{
 const E=require('../dist/engine.js'),chart=D.toLegacyChart();let n=0;
 for(const a of D.data.combinations)for(const d of D.data.combinations){const value=D.multiplier(a.combinationId,d.combinationId);assert.equal(typeof value,'number');assert.equal(value,R.calculate(D.data,a.types,d.types));assert.equal(value,E.typeEffectiveness(a.name,d.name,chart));n++;}
 assert.equal(n,19321);assert.deepEqual(D.data.coverage,{typeCount:26,combinationCount:139,singleCount:26,dualCount:113,baseCells:676,baseKnown:676,combinationCells:19321,combinationKnown:19321,combinationUnknown:0});
});

test('缺失属性、缺失单元、未知规则和非法分量返回null，适配器拒绝不完整数据',()=>{
 for(const name of ['不存在','属性','toString','__proto__']){assert.equal(D.getType(name),null);assert.equal(D.getCombination(name),null);assert.equal(D.multiplier(name,'火'),null);assert.equal(D.multiplier('火',name),null);assert.equal(D.matchups(name),null);}
 for(const n of [null,NaN,Infinity,-1,5])assert.equal(R.combine(n,1),null);
 for(const parts of [[],[9999],[1,1],[1,2,3],['火'],null])assert.equal(R.calculate(D.data,parts,[1]),null);
 const broken=structuredClone(D.data);broken.baseMatrix[3][1]=null;assert.equal(R.calculate(broken,[3],[1]),null);assert.equal(R.calculate(broken,[3,4],[1,6]),null);assert.equal(R.create(broken).baseMultiplier(3,1),null);assert.throws(()=>R.create(broken).toLegacyChart(),/Incomplete/);
 const missing=structuredClone(D.data);delete missing.matrix[3][1];assert.equal(R.create(missing).multiplier(3,1),null);assert.throws(()=>R.create(missing).toLegacyChart(),/Incomplete/);
 const badRule=structuredClone(D.data);badRule.rules.combination.id='unverified';assert.equal(R.calculate(badRule,[3],[1]),null);assert.throws(()=>R.create(badRule).toLegacyChart(),/Unconfirmed/);
 assert.throws(()=>D.matchups('火','reciprocal'),RangeError);
});

test('数据库只读、浏览器模块与Node一致，导出的旧表可修改而不污染库',()=>{
 assert.throws(()=>{D.data.baseMatrix[3][1]=1;},TypeError);assert.throws(()=>D.getCombination(88).types.push(1),TypeError);
 const chart=D.toLegacyChart();chart.rows['火']['草']=1;chart.aliases['自然圣灵'].pop();assert.equal(D.baseMultiplier('火','草'),2);assert.equal(D.getCombination(88).types.length,2);
 const sandbox={};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/type-rules.js'),'utf8'),sandbox);assert.equal(sandbox.BattleTypeRules.create(D.data).multiplier('火飞行','草机械'),2.625);
 assert.equal(D.data.engineIntegrated,true);const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');assert.match(html,/type-rules\.js/);assert.ok(html.indexOf('type-catalog.js')<html.indexOf('type-rules.js'));assert.ok(html.indexOf('type-rules.js')<html.indexOf('engine.js'));
});

test('现有129份精灵快照逐格兼容且来源冲突单独保留，不修改精灵资料',()=>{
 const audit=require('../research/type-system-audit.json');assert.equal(audit.existing.speciesCount,129);assert.equal(audit.existing.missing.length,0);assert.equal(audit.existing.rowDifferences.length,0);assert.equal(audit.existing.aliasDifferences.length,0);
 for(const r of audit.existing.records){const bytes=fs.readFileSync(r.path);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256);const s=JSON.parse(bytes).snapshot;for(const [a,row]of Object.entries(s.typeChart.rows))for(const [d,n]of Object.entries(row))assert.equal(D.baseMultiplier(a,d),n);for(const [name,parts]of Object.entries(s.typeChart.aliases))assert.deepEqual(D.getCombination(name).types.map(id=>D.getType(id).name),parts);}
 assert.deepEqual(audit.sources.sourceDifferences.map(d=>[d.attack,d.defense,d.seerapi,d.wiki]),[['战斗','邪灵',.5,1],['圣灵','邪灵',1,.5],['轮回','虚空',.5,1]]);
 assert.equal(audit.implementation.engineIntegrated,false);
});

const key=(side,slot)=>'wiki:'+((901850+side)*10+slot);
// Soul-free, in-memory fixtures only. No species are imported or saved.
function snapshot(side,type,attack,chart){const id=901850+side;return {id,name:'属性库伤害夹具',type,base:{maxHp:100,atk:100,def:100,spa:100,spd:100,spe:100},souls:[],source:{provider:'seerapi'},typeChart:chart,effects:[],missingEffects:[],moves:Array.from({length:4},(_,i)=>({id:id*10+i,name:'属性测试'+i,provider:'seerapi',kind:i===0?'physical':'status',type:i===0?attack:'普通',power:i===0?120:0,pp:30,priority:0,accuracy:100,alwaysHit:true,critical:'1/16',level:i,fifth:false,effectIds:[],effectInstances:[],description:''}))};}
function damageCase(attack,defense,chart){const E=require('../dist/engine.js');const s=E.createBattle({wikiSnapshots:[snapshot(0,'王',attack,chart),snapshot(1,defense,'普通',chart)],criticals:false,seed:'type-library',builds:[{overrides:{maxHp:4000,atk:200,spa:200,def:200,spd:200,spe:500}},{overrides:{maxHp:4000,atk:200,spa:200,def:200,spd:200,spe:100}}]});return {before:s,after:E.resolveTurn(s,[key(0,0),key(1,2)])};}

test('适配表通过真实伤害计算：普通/克制/微弱/无效/单双属性，HP和PP按倍率变化',()=>{
 const chart=D.toLegacyChart();
 for(const [a,d,expected]of [['火','普通',1],['火','草',2],['火','水',.5],['电','地面',0],['火','草机械',4],['火','草超能',1.5],['光','草暗影',.5],['火飞行','草机械',2.625]]){
  const {before,after}=damageCase(a,d,chart),event=after.turns[0].events.find(e=>e.kind==='damage');assert.ok(event);
  const detail=event.detail??event.details??event.explanation;assert.equal(typeof detail,'string');const roll=Number(detail.match(/浮动 (\d+)%/)[1]);assert.ok(detail.includes('× 属性 '+expected+' ×'));
  const expectedLoss=expected===0?0:Math.floor(102*expected*roll/100);assert.equal(before.fighters[1].hp-after.fighters[1].hp,expectedLoss);assert.equal(after.fighters[0].pp[key(0,0)],29);assert.equal(before.fighters[0].pp[key(0,0)],30);assert.equal(after.fighters[1].pp[key(1,2)],29);
 }
});

test('真实伤害与旧精灵表使用相同种子逐状态一致，新增组合无需写入精灵文件',()=>{
 const E=require('../dist/engine.js'),old=JSON.parse(fs.readFileSync('data/species/3665.json')).snapshot.typeChart,chart=D.toLegacyChart();
 const a=damageCase('普通','邪灵神秘',old).after,b=damageCase('普通','邪灵神秘',chart).after;assert.deepEqual(a.fighters,b.fighters);assert.deepEqual(a.turns,b.turns);assert.equal(a.rng,b.rng);
 const added=D.data.combinations.find(c=>!old.aliases[c.name]&&c.types.length===2);assert.ok(added);assert.throws(()=>E.typeEffectiveness('火',added.name,old),/未覆盖/);assert.ok(Number.isFinite(D.multiplier('火',added.name)));assert.ok(damageCase('火',added.name,chart).after.fighters[1].hp<4000);
});

test('属性索引保留旧查询先匹配语义：前项别名优先于后项名称，数字ID不混同数字字符串别名',()=>{
 const input=structuredClone(D.data),first=input.types[0],second=input.types[1];
 first.aliases=[...(first.aliases??[]),second.name,String(second.id)];
 const indexed=R.create(input);
 assert.equal(indexed.getType(second.name).id,first.id);
 assert.equal(indexed.getType(String(second.id)).id,first.id);
 assert.equal(indexed.getType(second.id).id,second.id);
 assert.equal(indexed.getType(NaN),null);
 assert.equal(indexed.getType('__not_a_source_type__'),null);
 input.types[0].aliases.push('__new_input_alias__');
 assert.equal(indexed.getType('__new_input_alias__'),null);
 assert.equal(R.create(input).getType('__new_input_alias__').id,first.id);
});
test('属性索引不缓存可变快照校验：同一对象首次通过后修改矩阵仍立即拒绝，恢复后再通过',()=>{
 const chart=D.toLegacyChart(),a=D.data.types[0].name,d=D.data.types[1].name,original=chart.rows[a][d];
 assert.doesNotThrow(()=>D.assertChart(chart));
 chart.rows[a][d]=original===1?0:1;
 assert.throws(()=>D.assertChart(chart),/属性倍率来源冲突/);
 chart.rows[a][d]=original;
 assert.doesNotThrow(()=>D.assertChart(chart));
 chart.aliases[D.data.combinations[0].name]=['__missing_element__'];
 assert.throws(()=>D.assertChart(chart),/属性成分无效/);
});
test('属性索引对旧非数组别名及畸形条目保留原查找错误，不用索引静默接纳异常资料',()=>{
 const input=structuredClone(D.data);input.types[0].aliases='__legacy_substring_alias__';
 const first=R.create(input);
 assert.equal(first.getType('substring').id,input.types[0].id);
 assert.equal(first.getType('').id,input.types[0].id);
 assert.throws(()=>first.getType(Symbol('invalid')),TypeError);
 input.types.push(null);const malformed=R.create(input);
 assert.equal(malformed.getType(input.types[0].name).id,input.types[0].id);
 assert.throws(()=>malformed.getType('__absent_bad_catalog__'),TypeError);
});
