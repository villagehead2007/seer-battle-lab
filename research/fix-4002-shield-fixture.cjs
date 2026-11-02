const fs=require('fs'),p='tests/deployed-4002-partial.test.cjs';let s=fs.readFileSync(p,'utf8').replace('power=600;let o=turn(s','power=1000;let o=turn(s');fs.writeFileSync(p,s);
