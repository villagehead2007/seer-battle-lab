'use strict';const fs=require('node:fs'),cp=require('node:child_process');
const files=fs.readdirSync('tests').filter(n=>n.endsWith('.test.cjs')&&(/免攻|攻击免疫|零伤|attackImmune/.test(fs.readFileSync('tests/'+n,'utf8'))||/4635|4642|effect-registry|range-rules|souls\.test|zero-damage/.test(n))).map(n=>'tests/'+n);
fs.writeFileSync('research/zero-damage-hit-2026-10-29/affected-test-files.json',JSON.stringify({at:new Date().toISOString(),files},null,2)+'\n');
const child=cp.spawn(process.execPath,['research/next50-performance-run.cjs','zero-hit-affected-v1',...files],{stdio:'inherit',windowsHide:true,env:{...process.env,SEER_TEST_WORKERS:'2'}});child.on('exit',code=>process.exitCode=code??1);
