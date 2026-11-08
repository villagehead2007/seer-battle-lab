'use strict';
const fs=require('fs'),p='tests/remaining-4853-execution328.test.cjs',q='research/BATCH-4816-REMAINING/FINAL-GATES/execution328-repair-draft.cjs',s=fs.readFileSync(p,'utf8');
let n=s.replaceAll("require('../","require('../../../").replaceAll('chance of[0,80]','chance of[0,30,80]').replace('概率0的公共异常子效果执行失败仍附曝，80不附曝','原始概率0不执行不附曝，30附曝而80不附曝').replace('chance===0);','chance>0&&chance<=50);assert.equal((a.ailmentExecutions4853??[]).some(e=>e.actorSide===1),chance>0&&chance<=50);');
if(n===s||n.includes('执行失败仍附曝'))throw Error('draft transformation failed');
fs.writeFileSync(q,n,{flag:'wx'});
