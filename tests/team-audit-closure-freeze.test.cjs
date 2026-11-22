'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const G=require('../research/TEAM-STAGE-2/shared-complete.cjs');
const {auditClosureInputs}=G;
const project=path.resolve(__dirname,'..'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'seer-closure-freeze-'));t.after(()=>{assert.ok(path.basename(root).startsWith('seer-closure-freeze-'));fs.rmSync(root,{recursive:true,force:true});});fs.mkdirSync(path.join(root,'proof'));fs.writeFileSync(path.join(root,'proof/leaf.log'),'original');const input={file:'proof/leaf.log',sha256:hash('original')};const audit={status:'complete',closure:{inputs:[input]}};const write=()=>fs.writeFileSync(path.join(root,'audit.json'),JSON.stringify(audit));write();return{root,input,audit,write,gates:[{id:'fixture',file:'audit.json',status:'complete'}]};}
test('最终冻结收录闭合叶及审计本身，规范化键且不修改基础清单',t=>{const f=fixture(t),base={};f.input.file='proof\\leaf.log';f.write();const files=auditClosureInputs(f.root,base,f.gates);assert.equal(files['proof/leaf.log'],hash('original'));assert.equal(files['audit.json'],hash(fs.readFileSync(path.join(f.root,'audit.json'))));assert.deepEqual(base,{});});
test('闭合叶在启动核对后变化也被最终冻结复查拒绝',t=>{const f=fixture(t),before=auditClosureInputs(f.root,{},f.gates);fs.writeFileSync(path.join(f.root,'proof/leaf.log'),'changed');assert.throws(()=>auditClosureInputs(f.root,{},f.gates),/哈希不符/);f.input.sha256=hash('changed');f.write();const after=auditClosureInputs(f.root,{},f.gates);assert.notEqual(hash(JSON.stringify(before)),hash(JSON.stringify(after)));});
test('专项冻结拒绝项目外路径、无效摘要及基础输入冲突',t=>{const f=fixture(t);f.input.file='../outside';f.write();assert.throws(()=>auditClosureInputs(f.root,{},f.gates),/项目内/);f.input.file='proof/leaf.log';f.input.sha256='forged';f.write();assert.throws(()=>auditClosureInputs(f.root,{},f.gates),/摘要无效/);f.input.sha256=hash('original');f.write();assert.throws(()=>auditClosureInputs(f.root,{'proof/leaf.log':hash('different')},f.gates),/冲突/);});
test('已完成专项不能遗漏闭合清单，未完成专项仍保留审计文件',t=>{const f=fixture(t);delete f.audit.closure;f.write();assert.throws(()=>auditClosureInputs(f.root,{},f.gates),/缺少闭合/);f.audit.status='pending';f.gates[0].status='pending';f.write();assert.ok(auditClosureInputs(f.root,{},f.gates)['audit.json']);});
test('V9正式冻结表包含每一个当期专项闭合输入，且未闭合时禁止独立验收', t => {
  const gateFile = path.join(project, 'research/TEAM-STAGE-2/ADDITIONAL-REQUIRED-PRE-REGRESSION-GATES-2026-11-17.json');
  const gateDocument = JSON.parse(fs.readFileSync(gateFile, 'utf8'));
  const {files,fingerprint}=require('../research/TEAM-STAGE-2/complete-sLE0c5/inputs.json');
  const result=require('../research/TEAM-STAGE-2/complete-sLE0c5/result.json');
  assert.equal(result.status,'passed');
  assert.equal(fingerprint,result.fingerprint);
  assert.equal(hash(JSON.stringify(files)),fingerprint);
  let checked = 0;
  for (const gate of gateDocument.requiredAdditionalGates) {
    const auditBytes = fs.readFileSync(path.join(project, gate.file));
    const audit = JSON.parse(auditBytes);
    assert.equal(files[gate.file], hash(auditBytes));
    for (const input of audit.closure?.inputs ?? []) {
      assert.equal(files[input.file.replaceAll('\\', '/')], input.sha256, input.file);
      checked++;
    }
  }
  assert.ok(checked >= 2267);
  assert.ok(files['research/TEAM-STAGE-2/shared-complete.cjs']);

  const blocked = {
    ...gateDocument,
    requiredAdditionalGates: gateDocument.requiredAdditionalGates.map((gate, index) =>
      index === 0 ? {...gate, status: 'pending'} : gate),
  };
  const originalRead = fs.readFileSync;
  t.mock.method(fs, 'readFileSync', (file, ...options) => (
    file === gateFile ? JSON.stringify(blocked) : originalRead(file, ...options)
  ));
  assert.throws(() => G.runIndependent(), /尚未闭合.*effect-ownership-all-current-imported/);
});
