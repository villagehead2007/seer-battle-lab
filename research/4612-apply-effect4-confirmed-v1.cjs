'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const record='research/4612-4-user-confirmation-2026-10-28.json',confirmation={questionId:'Q-N50-4600-001-4612-4',record,speciesId:4612,skillId:20420,skillHash:'28707a7b',effectId:4,index:0,args:[4,100,1,5,100,1],effectRevision:'seerapi:cda7be9a',metadataArgsNum:3,answerOriginal:'速度+1、命中+1',semantics:'两个有序三元组：速度+1、命中+1；保留原六参数与来源原文'};
const c=read(record);assert.equal(c.userAnswerVerbatim,confirmation.answerOriginal);c.exactParameterConfirmation=confirmation;c.status='implemented-awaiting-state-tests';write(record,c);
let s=read('research/4612-reviewed-snapshot.json');s.moves.find(m=>m.id===20420).sourceParameterConfirmation=confirmation;write('research/4612-reviewed-snapshot.json',s);
let p='dist/effect-registry.js',text=fs.readFileSync(p,'utf8');
function replace(a,b){assert.equal(text.split(a).length,2,a.slice(0,80));text=text.replace(a,b);}
replace('function acceptsSourceParameterConflict(move,index,instance,metadata){',`function acceptsSourceParameterConflict(move,index,instance,metadata){
 if(move?.id===20420){const expected=${JSON.stringify(confirmation)};return move.provider==='seerapi'&&move.hash==='28707a7b'&&move.revision==='seerapi:28707a7b'&&index===0&&instance?.id===4&&metadata?.id===4&&metadata.argsNum===3&&metadata.revision==='seerapi:cda7be9a'&&metadata.template===registry[4].template&&JSON.stringify(instance.args)==='[4,100,1,5,100,1]'&&JSON.stringify(move.sourceParameterConfirmation)===JSON.stringify(expected);}`);
const marker=' const args=instance.args.slice();if([4,5].includes(instance.id))';
replace(marker,` if(acceptedConflict&&instance.id===4&&move.id===20420){const labels=['攻击','防御','特攻','特防','速度','命中'];for(let offset=0;offset<6;offset+=3){const args=instance.args.slice(offset,offset+3);args[0]=labels[args[0]];const text=normalize(rule.template).replace(/\\{(\\d+)\\}/g,(_,n)=>String(args[Number(n)])),result=compile([4],text,[entry]);if(result.issue)return result;operations.push({...result.operations[0],index,sourceArgs:instance.args.slice(),sourceParameterGroup:offset/3});}continue;}
 const args=instance.args.slice();if([4,5].includes(instance.id))`);
fs.writeFileSync(p,text);
p='completion-policy.cjs';text=fs.readFileSync(p,'utf8');
const anchor="try{if(snapshot.id===4604&&instance.id===1767&&move.id===37124)";
replace(anchor,`try{if(snapshot.id===4612&&instance.id===4&&move.id===20420){const data=JSON.parse(fs.readFileSync(path.join(root,'${record}'),'utf8'));acceptedConflict=snapshot.source.revision==='eea9d0b0'&&data.speciesId===4612&&data.sourceHash==='28707a7b'&&data.effectMetadataHash==='cda7be9a'&&data.userAnswerVerbatim==='速度+1、命中+1'&&JSON.stringify(data.rawParameters)==='[4,100,1,5,100,1]'&&JSON.stringify(data.exactParameterConfirmation)===JSON.stringify(move.sourceParameterConfirmation);}else if(snapshot.id===4604&&instance.id===1767&&move.id===37124)`);
fs.writeFileSync(p,text);
p='dist/range-effects.js';text=fs.readFileSync(p,'utf8');replace("if((m.wikiId??m.id)===20420)throw Error('Q-N50-4600-001：20420/4六参数与arity3矛盾，未选解释');",'');fs.writeFileSync(p,text);
p='tests/helpers/4612-battle.cjs';text=fs.readFileSync(p,'utf8');replace("if(m.id===20420&&x.id===4&&i===0)throw Error('Q-N50-4600-001：20420/4原六参数与arity3矛盾');",'');fs.writeFileSync(p,text);
p='tests/next50-4612-skills.test.cjs';text=fs.readFileSync(p,'utf8');text=text.replace('...make(e(543)).fighters,criticalsEnabled:true','criticalsEnabled:true');fs.writeFileSync(p,text);
console.log('4612 effect4 exact six-parameter source authorized and compiled to two ordered clauses; raw args and text retained.');
