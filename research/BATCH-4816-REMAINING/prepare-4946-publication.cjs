'use strict';
const fs=require('fs'),assert=require('assert/strict'),base='research/BATCH-4816-REMAINING/',dir=require('./ACTIVE-ANSWER-DEPLOYMENT.json').dir,a=require('./4946/INSTANCE-AUDIT.json');
const testFiles=fs.readdirSync('tests').filter(n=>/^(remaining|answered)-4946.*test.cjs$/.test(n)).sort().map(n=>'tests/'+n),names=f=>[...fs.readFileSync(f,'utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]);
const by={};for(const x of a.items)for(const t of x.tests??[])(by[t.file]??=new Set).add(t.name);
const testRenames={};for(const[f,oldset]of Object.entries(by)){const old=[...oldset],now=names(f);for(let i=0;i<old.length;i++){if(now.includes(old[i]))continue;let j=i;if(f.endsWith('-law.test.cjs'))j=({2:3,3:4,4:2})[i]??i;if(f.endsWith('-final-branches.test.cjs'))j=({0:1,1:2,2:0})[i];if(f.endsWith('-skills.test.cjs'))j=({5:6,6:5})[i]??i;assert.ok(now[j],old[i]);testRenames[old[i]]=now[j];}}
const confirmations=fs.readdirSync(dir).filter(n=>/^CONFIRMATION-4946.*\.json$/.test(n)).map(n=>dir+'/'+n);assert.ok(confirmations.length>=3);
const newNames=testFiles.filter(f=>f.includes('/answered-')).flatMap(names),config={id:4946,semanticsReviewed:true,confirmations,requiredProofs:[base+'4946/all-current-old-v5-result.json'],testFiles,testRenames,singleRationale:'原始六答、理论回复/减伤顺序补答及新增007=225、008=不获得均落实；真实HP/PP、概率、槽位、消耗、时长、分层减伤与来源边界有专项。真实场下和下一只出场仍延期。',items:{}};
config.items['4946:soul:2146']={rationale:config.singleRationale,singleBehavior:'实际在场双方回合初强化种类、先制与总比例减伤最多30%，先限总上限再按真实穿减；修罗意念按原贡献比例分摊后计入。攻击麻痹失败按敌最大HP70%吸取，免粉改真汲取，两者按理论量回复。危急一次全回复、清敌回合/盾、获得四槽并按北西东南连接；辰律保留占槽参与连接与末位消耗，满四槽不获得，不排队。单回合多点末一次载荷，四槽觉醒与自身既有雷辰转换保留真实来源。',additionalTests:newNames,confirmations};
for(const key of ['4946:skill:38537:3','4946:skill:38537:4','4946:skill:38538:1','4946:skill:38538:4'])config.items[key]={confirmations,additionalTests:newNames.filter(n=>/辰律|2571|2591|下回合|四颗/.test(n))};
fs.writeFileSync(dir+'/DEPLOY-4946.json',JSON.stringify(config,null,2)+'\n',{flag:'wx'});
console.log({config:dir+'/DEPLOY-4946.json',renames:Object.keys(testRenames).length,tests:newNames.length});
