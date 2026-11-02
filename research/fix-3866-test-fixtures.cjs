const fs=require('fs'),p='tests/deployed-3866.test.cjs';let s=fs.readFileSync(p,'utf8');
s=s.replaceAll('effectId:1038','effectId:180');
s=s.replace('Math.floor(base*1.5*.89)','Math.floor(base*1.5*E.typeEffectiveness(q.moveDefinitions[key(33310)].type,q.fighters[1].type,q.typeChart)*.89)');
const i=s.indexOf("test('3866 844");s=s.slice(0,i)+s.slice(i).replace('hp,4000','hp,3250').replace('lastAttackDamage,3000','lastAttackDamage,2250');fs.writeFileSync(p,s);
