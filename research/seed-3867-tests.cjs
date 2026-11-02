const fs=require('fs'),source=fs.readFileSync('tests/deployed-3866.test.cjs','utf8');
const chunks=source.split('\ntest('),selected=chunks.slice(1).filter(x=>x.startsWith("'3866 全部技能基础")||x.startsWith("'3866 正式本地18"));
const text=chunks[0]+selected.map(x=>'\ntest('+x).join('');
fs.writeFileSync('tests/deployed-3867.test.cjs',text.replaceAll('3866','3867').replaceAll('1138','1139').replaceAll('1437','1447').replaceAll('33310','33314'));
