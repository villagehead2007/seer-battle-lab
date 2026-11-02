const fs=require('fs');fs.writeFileSync('tests/helpers/4004-battle.cjs',fs.readFileSync('tests/helpers/3964-battle.cjs','utf8').replaceAll('3964','4004').replaceAll('10001','10006'));
