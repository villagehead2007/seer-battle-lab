'use strict';const fs=require('node:fs'),assert=require('node:assert/strict'),p='tests/next50-4612-skills.test.cjs';let s=fs.readFileSync(p,'utf8');
s=s.replace('4612原20420六参数与arity3保留自然拒绝，真实基础PP控制仍完成，已知独立载荷不擅拆两个三元组','4612原20420六参数按用户确认双三元组执行，真实速度命中各1与基础PP');s=s.replace("assert.throws(()=>make({moveId:20420,index:0}),/4600-001/);","const out=turn(make({moveId:20420,index:0}));assert.equal(out.fighters[0].stages.spe,1);assert.equal(out.fighters[0].stages.acc,1);");
s=s.replace('4612全部17真实有序组合共同分支，20420参数矛盾保留且不混入完成数','4612全部17真实有序组合共同分支，20420完整执行速度和命中强化');s=s.replace("if(m.id===20420){assert.throws(()=>make({moveId:m.id,index:null}),/4600-001/);continue;}",'');
s=s.replace('4612结构27效果原索引26可编译，唯一4六参数仍冲突并保留全部来源参数','4612结构27效果原索引完整编译，4六参数授权保留且展开两组');s=s.replace("assert.throws(()=>H.independentOperations(m,i),/4600-001/);continue;","assert.equal(H.independentOperations(m,i).length,2);continue;");
assert.ok(!s.includes('assert.throws(()=>make({moveId:20420,index:0})'));fs.writeFileSync(p,s);
