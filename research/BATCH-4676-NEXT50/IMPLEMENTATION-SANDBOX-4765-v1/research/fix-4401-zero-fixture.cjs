const fs=require('fs'),p='tests/deployed-4401-independent.test.cjs';let s=fs.readFileSync(p,'utf8').replace("immune?0:-(pp-1)","immune||pp===1?0:1-pp");fs.writeFileSync(p,s);
