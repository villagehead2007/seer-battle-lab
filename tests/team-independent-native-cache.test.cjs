'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const G=require('../research/TEAM-STAGE-2/shared-complete.cjs');
const root=path.resolve(__dirname,'..'),base=path.join(root,'research/TEAM-STAGE-2');
let privateProject,privateDirectory;
test.after(()=>{
 if(privateDirectory){
  assert.equal(path.dirname(privateDirectory),base);
  assert.ok(path.basename(privateDirectory).startsWith('native-cache-project-'));
  fs.rmSync(privateDirectory,{recursive:true,force:true});
 }
});
function isolatedProject() {
 if (privateProject) return privateProject;
 const directory=fs.mkdtempSync(path.join(base,'native-cache-project-'));
 const relative=path.relative(base,directory);
 assert.ok(relative.startsWith('native-cache-project-') && path.dirname(relative)==='.');
 privateDirectory=directory;
 // Replicate the native cache's current inputs before making private probes.
 const snapshotDir=path.join(directory,'snapshot');
 const cache=G.nativeFileCache(snapshotDir);
 const {files}=JSON.parse(fs.readFileSync(path.join(snapshotDir,'inputs-'+cache.inputFingerprint+'.json'),'utf8'));
 cache.finish();
 for(const file of Object.keys(files)){
  const dest=path.join(directory,file);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.linkSync(path.join(root,file),dest);
 }
 const stage=path.join(directory,'research','TEAM-STAGE-2');
 privateProject={stage,tests:path.join(directory,'tests'),gate:require(path.join(stage,'shared-complete.cjs'))};
 return privateProject;
}
function fixture(t,success=true,project={stage:base,gate:G}){
 const folder=fs.mkdtempSync(path.join(project.stage,'native-cache-unit-'));
 t.after(()=>{const relative=path.relative(base,folder);assert.ok(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));fs.rmSync(folder,{recursive:true,force:true});});
 const file=path.join(folder,'fixture.cjs'),counter=path.join(folder,'executions.txt');
 fs.writeFileSync(file,"const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs');test('actual cache assertion',()=>{fs.appendFileSync("+JSON.stringify(counter)+",'x');assert.equal(2+2,"+(success?'4':'5')+");});\n");
 return {folder,file,counter,cache:()=>project.gate.nativeFileCache(path.join(folder,'cache'))};
}
function record(folder){const scope=path.join(folder,'cache');const fingerprint=fs.readdirSync(scope).find(x=>/^[a-f0-9]{64}$/.test(x));return path.join(scope,fingerprint,fs.readdirSync(path.join(scope,fingerprint)).find(x=>x.endsWith('.json')));}
test('独立缓存复用真实整文件具名通过结果且不再次执行子进程',t=>{
 const prior=process.env.CODEX_TOOL_CALL_ID;
 try{
  process.env.CODEX_TOOL_CALL_ID='native-cache-first-tool-call';
  const f=fixture(t),first=f.cache(),a=first.run(f.file,['actual cache assertion']);assert.equal(a.status,0);assert.equal(a.reusedFrom,undefined);first.finish();
  process.env.CODEX_TOOL_CALL_ID='native-cache-second-tool-call';
  const second=f.cache(),b=second.run(f.file,['actual cache assertion']);assert.equal(b.status,0);assert.ok(b.reusedFrom);second.finish();assert.equal(fs.readFileSync(f.counter,'utf8'),'x');
  assert.throws(()=>f.cache().run(f.file,['missing assertion']),/未执行引用的断言/);
 }finally{if(prior===undefined)delete process.env.CODEX_TOOL_CALL_ID;else process.env.CODEX_TOOL_CALL_ID=prior;}
});
test('独立缓存拒绝日志篡改、伪造成功及命令或文件摘要变化',t=>{
 const f=fixture(t),c=f.cache();c.run(f.file,['actual cache assertion']);c.finish();const name=record(f.folder),original=fs.readFileSync(name,'utf8'),r=JSON.parse(original);
 const log=path.resolve(root,r.log),output=fs.readFileSync(log,'utf8');fs.appendFileSync(log,'tampered');assert.throws(()=>f.cache().run(f.file,[]),/日志不符/);fs.writeFileSync(log,output);
 for(const edit of [x=>x.exitCode=1,x=>x.args=['--test','different.cjs'],x=>x.inputFingerprint='forged',x=>x.fileSha256='forged',x=>x.dependencyFingerprint='forged',x=>x.inputSnapshotSha256='forged']){const x=JSON.parse(original);edit(x);fs.writeFileSync(name,JSON.stringify(x));assert.throws(()=>f.cache().run(f.file,[]),/命令\/输入\/退出不符|原完整输入.*不符/);}
 fs.writeFileSync(name,original);assert.equal(fs.readFileSync(f.counter,'utf8'),'x');
});
test('独立缓存不采用实际失败的子进程输出',t=>{
 const f=fixture(t,false),c=f.cache(),a=c.run(f.file,[]);assert.equal(a.status,1);c.finish();
 const d=f.cache(),b=d.run(f.file,[]);assert.equal(b.status,1);assert.equal(b.reusedFrom,undefined);d.finish();assert.equal(fs.readFileSync(f.counter,'utf8'),'xx');
});
test('独立缓存完整输入运行中变化时拒绝提交成功证据',t=>{
 const project=isolatedProject(),f=fixture(t,true,project),c=f.cache();c.run(f.file,['actual cache assertion']);
 const probe=path.join(project.tests,'cache-input-probe-'+path.basename(f.folder)+'.cjs');
 try{fs.writeFileSync(probe,'module.exports=1;\n',{flag:'wx'});assert.throws(()=>c.finish(),/完整输入变化/);}finally{fs.unlinkSync(probe);}
 const d=f.cache(),a=d.run(f.file,['actual cache assertion']);assert.equal(a.reusedFrom,undefined);d.finish();assert.equal(fs.readFileSync(f.counter,'utf8'),'xx');
});
test('最终整库入口缺独立前置时拒绝且不创建冻结目录或运行npm',()=>{
 const previous=process.env.SEER_TEAM_INDEPENDENT_BATCH;
 const folders=()=>fs.readdirSync(base).filter(x=>x.startsWith('complete-')).sort();
 const before=folders();
 try{delete process.env.SEER_TEAM_INDEPENDENT_BATCH;assert.throws(()=>G.run(),/必须先完成独立前置/);assert.deepEqual(folders(),before);}finally{if(previous===undefined)delete process.env.SEER_TEAM_INDEPENDENT_BATCH;else process.env.SEER_TEAM_INDEPENDENT_BATCH=previous;}
 assert.throws(()=>G.independentEvidence(root,G.targets()),/证据目录必须/);
});
test('最终整库入口拒绝失败或目标不完整的前置收据',t=>{
 const f=fixture(t),targets=G.targets();
 const save=result=>{fs.writeFileSync(path.join(f.folder,'result.json'),JSON.stringify(result));fs.writeFileSync(path.join(f.folder,'inputs.json'),'{}');};
 save({stage:'independent-prerequisites',status:'rejected'});assert.throws(()=>G.independentEvidence(f.folder,targets),/不完整、输入过期或未通过/);
 save({stage:'independent-prerequisites',status:'passed',node:process.version,targets:[],fullNpmRun:false,frozen:false});assert.throws(()=>G.independentEvidence(f.folder,targets),/不完整、输入过期或未通过/);
});
test('无关测试文件改变可复用原完整快照，受测文件本身改变必须真实重跑',t=>{
 const project=isolatedProject(),f=fixture(t,true,project),probe=path.join(project.tests,'cache-unrelated-'+path.basename(f.folder)+'.test.cjs');
 t.after(()=>{if(fs.existsSync(probe))fs.unlinkSync(probe);});
 fs.writeFileSync(probe,'// unrelated test input version one\n',{flag:'wx'});
 const first=f.cache();first.run(f.file,['actual cache assertion']);first.finish();
 fs.writeFileSync(probe,'// unrelated test input version two\n');
 const second=f.cache(),reused=second.run(f.file,['actual cache assertion']);second.finish();
 assert.notEqual(first.inputFingerprint,second.inputFingerprint);assert.ok(reused.reusedFrom);assert.equal(fs.readFileSync(f.counter,'utf8'),'x');
 fs.appendFileSync(f.file,'// actual child file changed\n');
 const third=f.cache(),fresh=third.run(f.file,['actual cache assertion']);third.finish();assert.equal(fresh.reusedFrom,undefined);assert.equal(fs.readFileSync(f.counter,'utf8'),'xx');
});
test('实际读取其他测试文件时保留全输入依赖，不能以无关测试为由复用',t=>{
 const project=isolatedProject(),f=fixture(t,true,project),probe=path.join(project.tests,'cache-dependency-'+path.basename(f.folder)+'.test.cjs');
 t.after(()=>{if(fs.existsSync(probe))fs.unlinkSync(probe);});
 fs.writeFileSync(probe,"require('node:test')('dependency assertion',()=>require('node:assert/strict').equal(3,3));\n",{flag:'wx'});
 fs.appendFileSync(f.file,'require('+JSON.stringify(probe)+');\n');
 const first=f.cache();first.run(f.file,['actual cache assertion','dependency assertion']);first.finish();
 fs.appendFileSync(probe,'// referenced test input changed\n');
 const second=f.cache(),result=second.run(f.file,['actual cache assertion','dependency assertion']);second.finish();assert.equal(result.reusedFrom,undefined);assert.equal(fs.readFileSync(f.counter,'utf8'),'xx');
});
test('不读取审核表的战斗输出仅复用运行依赖，原完整快照仍保留审核摘要',t=>{
 const f=fixture(t),context={node:process.version,executable:process.execPath,environment:'unit-fixture'};
 const first={...context,files:{'SINGLE-STAGE-REVIEWS.json':'review-before','data/species/3001.json':'real-source'}},second={...context,files:{'SINGLE-STAGE-REVIEWS.json':'review-after','data/species/3001.json':'real-source'}};
 assert.notEqual(JSON.stringify(first),JSON.stringify(second));assert.deepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));assert.equal(first.files['SINGLE-STAGE-REVIEWS.json'],'review-before');
 const changed={...second,files:{...second.files,'data/species/3001.json':'different-real-source'}};assert.notDeepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(changed,f.file));
});
test('直接读取验收器及审核环境的测试仍绑定原始测试引用全文',t=>{
 const f=fixture(t);fs.appendFileSync(f.file,'require('+JSON.stringify(path.join(base,'shared-complete.cjs'))+');\n');
 const context={node:process.version,executable:process.execPath,environment:'unit-fixture'};
 const first=G.nativeDependencySnapshot({...context,files:{'SINGLE-STAGE-REVIEWS.json':'original-review-hash'}},f.file),second=G.nativeDependencySnapshot({...context,files:{'SINGLE-STAGE-REVIEWS.json':'changed-review-hash'}},f.file);
 assert.notEqual(JSON.stringify(first),JSON.stringify(second));assert.equal(first.files['SINGLE-STAGE-REVIEWS.json'],'original-review-hash');
});
test('静态JSON未被完整快照捕获时拒绝执行且不能保存成功缓存',t=>{
 const f=fixture(t),json=path.join(f.folder,'uncaptured-fixture.json');fs.writeFileSync(json,'{"value":1}');fs.appendFileSync(f.file,'require('+JSON.stringify(json)+');\n');
 const c=f.cache();assert.throws(()=>c.run(f.file,['actual cache assertion']),/静态依赖未纳入完整输入/);c.finish();assert.equal(fs.existsSync(f.counter),false);
});
test('种子JSON只影响实际读取者，原完整快照仍保留种子摘要',t=>{
 const f=fixture(t),seed='research/TEAM-STAGE-2/team-count-miss-seed-v1.json',context={node:process.version,executable:process.execPath,environment:'unit-fixture'};
 const first={...context,files:{[seed]:'seed-one'}},second={...context,files:{[seed]:'seed-two'}};
 assert.deepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));assert.equal(first.files[seed],'seed-one');
 fs.appendFileSync(f.file,'require('+JSON.stringify(path.join(root,seed))+');\n');assert.notDeepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));
});
test('缓存可以实际执行读取验收器的子进程，其静态JSON依赖均被完整捕获',t=>{
 const f=fixture(t);fs.appendFileSync(f.file,'require('+JSON.stringify(path.join(base,'shared-complete.cjs'))+');\n');
 const c=f.cache(),result=c.run(f.file,['actual cache assertion']);assert.equal(result.status,0);c.finish();assert.equal(fs.readFileSync(f.counter,'utf8'),'x');
});
test('序列化子程序从项目根目录导入的JSON也参与读取者的依赖',t=>{
 const f=fixture(t),seed='research/TEAM-STAGE-2/3036-native-random-boundary-seeds.json';
 fs.appendFileSync(f.file,'const serializedProgram="require(\'./'+seed+'\')";\n');
 const context={node:process.version,executable:process.execPath,environment:'unit-fixture'},first={...context,files:{[seed]:'seed-one'}},second={...context,files:{[seed]:'seed-two'}};
 assert.notDeepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));
});
test('提示模块变化只使实际读取者失效，不重跑不读取面板的战斗文件',t=>{
 const f=fixture(t),context={node:process.version,executable:process.execPath,environment:'unit-fixture'},first={...context,files:{'dist/battle-display.js':'display-before'}},second={...context,files:{'dist/battle-display.js':'display-after'}};
 assert.deepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));
 fs.appendFileSync(f.file,'require('+JSON.stringify(path.join(root,'dist/battle-display.js'))+');\n');assert.notDeepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));
});

test('多宠元数据文档变化不重跑非读取者，实际读取者仍保留完整输入并失效',t=>{
 const f=fixture(t),context={node:process.version,executable:process.execPath,environment:'unit-fixture'},first={...context,files:{'MULTI-PET-TODO.md':'metadata-before'}},second={...context,files:{'MULTI-PET-TODO.md':'metadata-after'}};
 assert.deepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));
 fs.appendFileSync(f.file,'require("node:fs").readFileSync('+JSON.stringify(path.join(root,'MULTI-PET-TODO.md'))+',"utf8");\n');assert.notDeepEqual(G.nativeDependencySnapshot(first,f.file),G.nativeDependencySnapshot(second,f.file));
});
