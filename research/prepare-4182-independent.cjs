'use strict';
const fs=require('fs');
let s=fs.readFileSync('tests/helpers/4169-battle.cjs','utf8').replaceAll('4169','4182').replace('unknown=[1644,1650]','unknown=[441]');
s=s.replace('moveId:10047','moveId:10004');
fs.writeFileSync('tests/helpers/4182-battle.cjs',s);
