'use strict';
const fs=require('fs');
let h=fs.readFileSync('tests/helpers/3642-battle.cjs','utf8').replaceAll('3642','3652').replace('moveId:10018','moveId:12130').replace('??931','??937').replace('10018,20992,10060,10055','12130,10224,11288,20365');fs.writeFileSync('tests/helpers/3652-battle.cjs',h);
fs.writeFileSync('tests/deployed-3652.test.cjs',fs.readFileSync('tests/deployed-3642.test.cjs','utf8').replaceAll('3642','3652').replace('42实例','48实例'));
let r=fs.readFileSync('tests/deployed-3631-reused.test.cjs','utf8').replaceAll('3631','3652').replaceAll('21747','21113').replaceAll('10157','12130');fs.writeFileSync('tests/deployed-3652-reused.test.cjs',r);
const fresh=require('./3652-source-check-external.json').records;let code=fs.readFileSync('dist/range-effects.js','utf8');for(const id of [56,121,413,1356]){const m=fresh.find(r=>r.url.endsWith('/skill_effect_type/'+id)).data;console.log(id,m.info);code=code.replace(new RegExp('metadata\\['+id+'\\]=[^\\n]+'),`metadata[${id}]=${JSON.stringify({info:m.info,args_num:m.args_num})};`);}fs.writeFileSync('dist/range-effects.js',code);
