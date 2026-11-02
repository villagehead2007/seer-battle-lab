const fs=require('fs');
let s=fs.readFileSync('tests/deployed-3550.test.cjs','utf8');
s=s.slice(0,s.indexOf("test('3550 魂印849"));
fs.writeFileSync('tests/deployed-3865-independent.test.cjs',s.replaceAll('3550','3865'));
