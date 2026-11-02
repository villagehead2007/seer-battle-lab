const fs=require('fs');
let s=fs.readFileSync('tests/helpers/3631-battle.cjs','utf8').replaceAll('3631','3642').replaceAll('10157','10018').replace('options.soul??920','options.soul??931').replace('10018,20030,12804,10333','10018,20992,10060,10055');fs.writeFileSync('tests/helpers/3642-battle.cjs',s);
s=fs.readFileSync('tests/deployed-3637.test.cjs','utf8').replaceAll('3637','3642').replace('49实例','44实例');fs.writeFileSync('tests/deployed-3642.test.cjs',s);
let blocks=fs.readFileSync('tests/deployed-3631-reused.test.cjs','utf8').split(/(?=test\(')/);s=blocks[0]+blocks.slice(1).filter(x=>!x.startsWith("test('3631 191")).join('');s=s.replaceAll('3631','3642').replaceAll('10157','10018').replace('moveId:21747','moveId:21070');fs.writeFileSync('tests/deployed-3642-reused.test.cjs',s);
// Copy only matching verified branches, adapting only species-specific input IDs.
blocks=fs.readFileSync('tests/deployed-3637-effects.test.cjs','utf8').split(/(?=test\(')/);const terms=['15三个概率','126三回合','57用技能'];s=blocks[0]+blocks.slice(1).filter(x=>terms.some(t=>x.slice(0,x.indexOf('()=>')).includes(t))).join('');s=s.replaceAll('3637','3642').replace('15三个概率','15两种概率');fs.writeFileSync('tests/deployed-3642-common.test.cjs',s);
console.log('scaffold ready');
