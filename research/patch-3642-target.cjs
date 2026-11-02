const fs=require('fs');let s=fs.readFileSync('seerapi.cjs','utf8').replace('const entry={13224:',"const entry={11460:['58978e68',2],13224:");fs.writeFileSync('seerapi.cjs',s);
s=fs.readFileSync('tests/deployed-3642-soul.test.cjs','utf8').replace("s.fighters[1].wikiMoves['wiki:900023']","s.moveDefinitions['wiki:900023']");fs.writeFileSync('tests/deployed-3642-soul.test.cjs',s);
