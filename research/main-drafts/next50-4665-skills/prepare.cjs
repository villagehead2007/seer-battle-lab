'use strict';
const fs=require('fs'),path=require('path'),s=require('../../../research/4665-reviewed-snapshot.json'),dir=__dirname;
const bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({moveId:m.id,hash:m.hash??m.revision.replace(/^seerapi:/,''),index,id:e.id,args:e.args})));
const legacy=[],overlap=[];for(const f of fs.readdirSync(path.resolve(dir,'../../../data/species')).filter(f=>f.endsWith('.json'))){const x=JSON.parse(fs.readFileSync(path.resolve(dir,'../../../data/species',f),'utf8')).snapshot;if(!x?.moves)continue;for(const m of x.moves.filter(m=>s.moves.some(k=>k.id===m.id))){const hash=m.hash??m.revision?.replace(/^seerapi:/,'');overlap.push({owner:x.id,moveId:m.id,hash});for(const [index,e]of(m.effectInstances??[]).entries())if(bindings.some(b=>b.id===e.id&&b.moveId===m.id&&b.hash!==hash))legacy.push({moveId:m.id,hash,index,id:e.id,args:e.args,owner:x.id});}}
fs.writeFileSync(path.join(dir,'historical-source-overlap.json'),JSON.stringify({purpose:'only current22 move IDs certified old source bindings, not mechanism audit',overlap,differentHashBindings:legacy},null,2)+'\n');
fs.writeFileSync(path.join(dir,'bindings.json'),JSON.stringify(bindings,null,2)+'\n');
const pre=`const bindings4665=${JSON.stringify(bindings)},legacyBindings4665=${JSON.stringify(legacy)};\nfunction exact4665(m,i,b,p){return !!m&&(m.wikiId??m.id)===b.moveId&&(m.hash===b.hash||m.revision==='seerapi:'+b.hash)&&i===b.index&&JSON.stringify(p)===JSON.stringify(b.args);}\nfunction source4665(c,id){return bindings4665.some(b=>b.id===id&&exact4665(c.m,c.effectInstanceIndex,b,b.args));}\n`;
fs.writeFileSync(path.join(dir,'range-effects.production-fragment.js'),pre+fs.readFileSync(path.join(dir,'handlers.draft.js'),'utf8'));

