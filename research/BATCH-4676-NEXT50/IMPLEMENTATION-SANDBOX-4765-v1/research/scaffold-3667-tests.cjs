'use strict';
const fs=require('fs');
let helper=fs.readFileSync('tests/helpers/3665-battle.cjs','utf8').replaceAll('3665','3667')
 .replace("require('../../data/species/3667.json').snapshot","require('../../research/3667-reviewed-snapshot.json')")
 .replace('options.soul??951','options.soul??955').replaceAll('10001','10250').replace('20288,10194,20044','20190,13038,21119');
fs.writeFileSync('tests/helpers/3667-battle.cjs',helper);
let tests=fs.readFileSync('tests/deployed-3665.test.cjs','utf8').replaceAll('3665','3667').replaceAll('27招','23招').replaceAll('48实例','44实例');
tests=tests.replace('make(e);','make(e,{omit:true});');
// These are base-behavior assertions only. Effect/soul completion remains explicitly pending.
tests=tests.replaceAll('make(e);','make(e,{omit:true});');
fs.writeFileSync('tests/deployed-3667.test.cjs',tests);
