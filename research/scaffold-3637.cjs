const fs=require('fs');
let s=fs.readFileSync('tests/helpers/3631-battle.cjs','utf8').replaceAll('3631','3637').replaceAll('10157','10128').replace('options.soul??920','options.soul??928').replace('10128,20030,12804,10333','10128,20038,10309,10243');fs.writeFileSync('tests/helpers/3637-battle.cjs',s);
s=fs.readFileSync('tests/deployed-3631.test.cjs','utf8').replaceAll('3631','3637').replaceAll('24招','27招').replace('45实例','51实例');fs.writeFileSync('tests/deployed-3637.test.cjs',s);
s=fs.readFileSync('tests/deployed-3631-reused.test.cjs','utf8').replaceAll('3631','3637').replaceAll('10157','10128').replace('moveId:21747','moveId:20038');fs.writeFileSync('tests/deployed-3637-reused.test.cjs',s);
// A separate serial probe checks the contradictory soul rendering against eid metadata.
s=fs.readFileSync('research/check-3637-source.cjs','utf8');s=s.replace("await get('pet_gender/'+p.gender.id);","await get('pet_gender/'+p.gender.id);await get('eid_effect/1217');");fs.writeFileSync('research/check-3637-source.cjs',s);
