'use strict';
const fs=require('fs'),r=require('./3847-source-check.json');
let file='dist/range-effects.js',s=fs.readFileSync(file,'utf8');
const ids=[761,1221],metadata=ids.map(id=>{const d=r.records.find(x=>x.url.endsWith('/skill_effect_type/'+id)).data;return 'metadata['+id+']='+JSON.stringify({info:d.info,args_num:d.args_num})+';';}).join('\n');
const code=`
${metadata}
add(761,'afterHit',(c,p)=>c.timed(c.t,'回复效果削减',p[0],{fraction:p[1]/100}),[turns,pct]);
add(1221,'afterHit',(c,p)=>{if(c.canRemoveNegative?.(c.a)===false)return;let changed=false;for(const k of stats){const before=c.a.stages[k];if(before<0){c.stage(c.a,-2*before,[k]);if(c.a.stages[k]===-before)changed=true;}}if(changed)c.a.counts.immune=(c.a.counts.immune??0)+p[0];},[[1,99]]);
`;
if(!s.includes("add(1221,")){s=s.replace(/\}\);\s*$/,code+'});\n');fs.writeFileSync(file,s);}
let prep=fs.readFileSync('research/prepare-3847.cjs','utf8');
const versions="s.skillVersions=s.souls.flatMap(soul=>s.moves.filter(m=>m.fifth).map(fifth=>({id:'soul-'+soul.id+'-fifth-'+fifth.id,soulId:soul.id,soulHash:soul.hash,fifthId:fifth.id,source:{url:s.source.url,revision:p.hash},moveIds:s.moves.filter(m=>!m.fifth||m.id===fifth.id).map(m=>m.id)})));\n";
if(!prep.includes('s.skillVersions='))prep=prep.replace("fs.writeFileSync('research/3847-reviewed-snapshot.json'",versions+"fs.writeFileSync('research/3847-reviewed-snapshot.json'");
fs.writeFileSync('research/prepare-3847.cjs',prep);
fs.writeFileSync('tests/helpers/3847-battle.cjs',fs.readFileSync('tests/helpers/3840-battle.cjs','utf8').replaceAll('3840','3847').replace('moveId:10086','moveId:10250'));
