const fs=require('fs');
let h=fs.readFileSync('tests/helpers/3623-battle.cjs','utf8').replaceAll('3623','3626').replace('moveId:10535','moveId:10086').replace('options.soul??(source.moves.find(m=>m.id===entry.moveId).advanced?1863:917)','options.soul??919').replace('10535,20267,10405,13300','10086,20231,32115,20182');
fs.writeFileSync('tests/helpers/3626-battle.cjs',h);
let base=fs.readFileSync('tests/deployed-3623.test.cjs','utf8').replaceAll('3623','3626').replaceAll('21招','17招').replace('41实例','27实例');fs.writeFileSync('tests/deployed-3626.test.cjs',base);
const old=fs.readFileSync('tests/deployed-3623-mechanisms.test.cjs','utf8'),blocks=old.split(/(?=test\(')/),chosen=['属性4与5','191四回合','693与843','928两实例'];
let reuse=blocks[0]+blocks.slice(1).filter(b=>chosen.some(x=>b.slice(0,b.indexOf('()=>')).includes(x))).join('');
reuse=reuse.replaceAll('3623','3626').replaceAll('10535','10086').replace(/ const duplicate=make\(\{moveId:22064[\s\S]*?spe,-1\);assert.equal\(o.fighters\[1\].stages.acc,-1\);/,' const duplicate=make({moveId:20182,index:null}),o=turn(duplicate);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[1].stages.spa,-1);');
fs.writeFileSync('tests/deployed-3626-mechanisms.test.cjs',reuse);
