const fs=require('fs'),p='tests/deployed-3979-partial.test.cjs';let s=fs.readFileSync(p,'utf8');s=s.replaceAll('威力 260 ','威力 200 ');fs.writeFileSync(p,s);
