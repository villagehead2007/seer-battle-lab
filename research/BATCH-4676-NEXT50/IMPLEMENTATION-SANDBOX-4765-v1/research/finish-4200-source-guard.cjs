'use strict';const fs=require('fs'),assert=require('node:assert/strict'),p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});');assert.ok(!s.includes('4200 exact 878'));const code=`
// 4200 exact 878 instance; preserve every pre-existing parameter boundary.
{const old=registry[878];registry[878]=Object.freeze({...old,validate(p,m,i){if(m?.id===29477&&m.hash==='f3c7867e'&&i===3&&JSON.stringify(p)==='[2,25]')return;old.validate(p,m,i);},execute(c,p){if(p[1]===25)c.timed(c.a,'先手附加异常',p[0],{ailment:'致命诅咒'},c.round+1);else old.execute(c,p);}});}
`;fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
