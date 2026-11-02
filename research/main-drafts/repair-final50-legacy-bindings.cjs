'use strict';
// Prepared during the regression; apply only after that run has exited.
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto'),bp='research/BATCH-4509-NEXT50-STATUS.json',b=JSON.parse(fs.readFileSync(bp));assert.deepEqual(b.activeProcesses,[]);assert.equal(b.activeWork.fullRegressionRunning,false);
const path='dist/effect-registry.js',before=fs.readFileSync(path,'utf8'),dir='research/main-drafts/next50-final-legacy-repair';fs.mkdirSync(dir,{recursive:true});let after=before;
const sources=[];
for(const [species,id,hash,batch]of [[3393,20355,'e9cead29',4644],[3421,21507,'e2d9aeee',4646]]){
 const snapshot=JSON.parse(fs.readFileSync('data/species/'+species+'.json')).snapshot,m=snapshot.moves.find(m=>m.id===id);assert.equal(m.hash,hash);assert.equal(m.revision,'seerapi:'+hash);assert.deepEqual(m.effectInstances,[{id:58,args:[2],description:'下2回合自身攻击技能必定打出致命一击'}]);sources.push({species,move:m});
 const from=`function exact${batch}Tail(m,i,b,p){return !!m&&`,to=`function exact${batch}Tail(m,i,b,p){if(m&&(m.wikiId??m.id)===${id}&&b.moveId===${id}&&b.id===58&&b.index===0&&i===0&&m.hash==='${hash}'&&m.revision==='seerapi:${hash}'&&JSON.stringify(p)==='[2]')return true;return !!m&&`;
 assert.ok(after.includes(from));after=after.replace(from,to);
}
fs.writeFileSync(dir+'/effect-registry.before.js',before,{flag:'wx'});fs.writeFileSync(path,after);const sha=x=>crypto.createHash('sha256').update(x).digest('hex');fs.writeFileSync(dir+'/record.json',JSON.stringify({at:new Date().toISOString(),reason:'Retain exact saved prior versions of the same 58[2] skills. No source rewrite, arbitrary hash acceptance, behavior change, or new answer.',sources,changes:[{path,before:sha(before),after:sha(after)}]},null,2)+'\n');console.log('Applied exact legacy 58 source compatibility');
