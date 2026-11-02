'use strict';const fs=require('fs'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('crypto');
const files=['dist/range-effects.js','dist/souls.js'],bytes=files.map(p=>fs.readFileSync(p)),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
try{
 let r=bytes[0].toString();const before="if(!c.crit&&c.a.hp>0)p.forEach((n,i)=>{if(n)c.stage(c.a,n,[stats[i]]);});";assert.equal(r.split(before).length,2);r=r.replace(before,'if(!c.crit&&c.a.hp>0)c.stage(c.a,p[0],["atk"]);');fs.writeFileSync(files[0],r);
 let s=bytes[1].toString(),q='probabilityPercent:(e.chance??1)*100';assert.equal(s.split(q).length,2);fs.writeFileSync(files[1],s.replace(q,'probabilityPercent:e.chance??100'));
 const log='research/4182-public-real-counterfactual-failures.log',fd=fs.openSync(log,'wx'),result=cp.spawnSync(process.execPath,['--test','--test-name-pattern','732真实第五|百分之百受击','tests/deployed-4182-partial.test.cjs'],{stdio:['ignore',fd,fd]});fs.closeSync(fd);assert.equal(result.status,1);const text=fs.readFileSync(log,'utf8');assert.match(text,/def/);assert.match(text,/3580/);console.log({exitCode:result.status,expectedRealFailures:2,log});
}finally{files.forEach((p,i)=>{fs.writeFileSync(p,bytes[i]);assert.equal(hash(fs.readFileSync(p)),hash(bytes[i]));});}
