const fs=require('fs'),s=fs.readFileSync('tests/deployed-3840.test.cjs','utf8');
fs.writeFileSync('tests/deployed-3847.test.cjs',s.slice(0,s.indexOf("test('3840 11中毒")).replaceAll('3840','3847').replaceAll('22招','24招'));
