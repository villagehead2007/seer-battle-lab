const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{createStore}=require('../local-species.cjs');
function fixture(t){const base=os.tmpdir(),dir=fs.mkdtempSync(path.join(base,'seer-local-test-'));t.after(()=>{if(path.dirname(dir)!==base||!path.basename(dir).startsWith('seer-local-test-'))throw Error('unsafe test cleanup');fs.rmSync(dir,{recursive:true});});return createStore(dir);}
const source=()=>structuredClone(require('../data/species/2987.json').snapshot);
test('适配范围包含新保存编号，不依赖旧检查清单并排除重复跳过项',t=>{
 const base=os.tmpdir(),dir=fs.mkdtempSync(path.join(base,'seer-coverage-test-'));
 t.after(()=>{if(path.dirname(dir)!==base||!path.basename(dir).startsWith('seer-coverage-test-'))throw Error('unsafe test cleanup');fs.rmSync(dir,{recursive:true});});
 fs.writeFileSync(path.join(dir,'adaptation.json'),JSON.stringify({checked:[3000,999999],skipped:[{id:2987,name:'过期跳过记录'},{id:3000,name:'无魂印'}]}));
 const store=createStore(path.join(dir,'species'));assert.equal(store.save(source()).saved,true);
 const current=store.status();assert.equal(current.count,1);assert.deepEqual(current.coverage.savedRanges,[[2987,2987]]);assert.deepEqual(current.coverage.checkedRanges,[[2987,2987],[3000,3000]]);assert.equal(current.coverage.checkedCount,2);assert.deepEqual(current.coverage.skipped,[{id:3000,name:'无魂印'}]);
});
test('单只精灵永久落盘，另一个进程实例可离线检索和读取真实属性',t=>{const store=fixture(t),s=source();assert.equal(store.save(s).saved,true);const loaded=store.species(2987);assert.equal(loaded.source.storage,'local');assert.equal(loaded.type,'王');assert.ok(loaded.typeChart.rows['王']);assert.ok(loaded.deployment.deferredSouls.some(x=>x.description.includes('复活')));assert.equal(store.search('重生').results[0].id,2987);assert.equal(store.search('2987').results.length,1);assert.equal(store.search('3000').results.length,0);});
test('未完成新版本不覆盖已部署版本，中性测试表和未知魂印不能发布',t=>{const store=fixture(t),s=source();store.save(s);for(const mutate of [x=>x.moves[0].effectIds=[999999],x=>x.typeChart.revision='rule-audit-neutral',x=>x.souls[0].hash='changed',x=>x.base.atk=-1]){const bad=source();mutate(bad);assert.equal(store.save(bad).saved,false);assert.equal(store.species(2987).source.revision,s.source.revision);}});
test('本地读取拒绝路径穿越与未部署ID',t=>{const store=fixture(t);assert.throws(()=>store.species('../server'),/编号/);assert.throws(()=>store.species(3000),/尚未部署/);});

test('3021起无魂印跳过存储，旧存档读取保持兼容',t=>{const store=fixture(t),s=source();s.id=3023;s.souls=[];const r=store.save(s);assert.equal(r.saved,false);assert.equal(r.skipped,true);assert.equal(store.status().count,0);assert.throws(()=>store.species(3023),/尚未部署/);});
