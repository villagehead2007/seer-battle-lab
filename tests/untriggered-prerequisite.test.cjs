const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),E=require('../dist/engine.js');
const inventory=require('../research/untriggered-rule-inventory.json'),key=id=>'wiki:'+id;
function make(id,pet,move){const original=JSON.parse(fs.readFileSync(`data/species/${pet}.json`)).snapshot,a=structuredClone(original);delete a.skillVersions;delete a.additionalFifths;a.souls=[];const m=structuredClone(a.moves.find(x=>x.id===move)),inst=m.effectInstances.find(x=>x.id===id);m.effectInstances=[inst];m.effectIds=[id];m.limitations=[];m.fifth=true;m.sourceFlags={is_fifth:true,is_special:false};
 const neutral=(id,kind='status',power=0)=>({...m,id,name:'通则测试'+id,kind,power,priority:0,pp:99,fifth:false,alwaysHit:true,effectIds:[],effectInstances:[],description:'',sourceFlags:{is_fifth:false,is_special:false}});a.moves=[m,neutral(990001),neutral(990002),neutral(990003),neutral(990004)];const b=structuredClone(a);b.id=999999;b.name='通则对照';b.moves=[{...neutral(990010),fifth:true,sourceFlags:{is_fifth:true,is_special:false}},neutral(990011),neutral(990012),neutral(990013),neutral(990014)];const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500};const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[a.moves.map(x=>x.id),b.moves.map(x=>x.id)],criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});s.fighters[0].effects['攻击必中']={start:1,end:99};s.fighters[0].hp=1000;s.auditMove=m.id;s.args=inst.args;s.rng=1;return s;}
const run=s=>E.resolveTurn(s,[key(s.auditMove),key(990010)]),timer=(s,k)=>s.fighters[1].effects[k]={start:1,end:99};
test('未触发通则 1353持续效果后手不清回合、先手异常失败才清除',()=>{
 const q=make(1353,3642,26207);timer(q,'免异常');timer(q,'免弱');q.fighters[0].stats.spe=1;const no=run(q);assert.ok(no.fighters[1].effects['免弱']);q.fighters[0].stats.spe=1000;assert.equal(run(q).fighters[1].effects['免弱'],undefined);q.fighters[1].effects.protect={start:1,end:99};assert.ok(run(q).fighters[1].effects['免弱']);
});
test('1020真实本地各实例编译参数并按目标强化给予有限能力等级',()=>{
 for(const file of fs.readdirSync('data/species').filter(f=>f.endsWith('.json'))){const s=JSON.parse(fs.readFileSync('data/species/'+file)).snapshot;for(const m of s?.moves??[])for(const x of m.effectInstances??[])if(x.id===1020){for(const boosted of [false,true]){const q=make(1020,s.id,m.id);if(boosted)q.fighters[1].stages.acc=1;assert.equal(run(q).fighters[0].stages.atk,x.args[0]*(boosted?1:2));}}}
});
test('未触发通则 消回合1297和1423无前置不回复，成功后免异常才补偿',()=>{
 for(const id of [1297,1423])for(const [pet,move]of inventory[id].targets){const q=make(id,pet,move);assert.equal(run(q).fighters[0].hp,1000);timer(q,'protect');assert.equal(run(q).fighters[0].hp,1000);delete q.fighters[1].effects.protect;timer(q,'免异常');q.fighters[1].counts.immune=1;const n=run(q);assert.equal(n.fighters[0].hp,1000+Math.floor(9000/q.args[id===1297?1:2]));assert.equal(n.fighters[1].counts.immune,0);}
});
test('未触发通则 1399消回合成功后异常失败才增加免异常次数',()=>{
 for(const [pet,move]of inventory[1399].targets){const q=make(1399,pet,move);assert.equal(run(q).fighters[0].counts.immune??0,0);timer(q,'免弱');q.fighters[1].counts.immune=1;assert.equal(run(q).fighters[0].counts.immune,q.args[1]);timer(q,'protect');assert.equal(run(q).fighters[0].counts.immune??0,0);}
});
test('未触发通则 1864与1978消强成功且异常失败才补偿',()=>{
 for(const id of [1864,1978])for(const [pet,move]of inventory[id].targets){const q=make(id,pet,move);timer(q,'免异常');let n=run(q);if(id===1864)assert.equal(n.fighters[0].ailments['狂暴'],undefined);else assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage);q.fighters[1].stages.acc=1;n=run(q);assert.equal(n.fighters[1].stages.acc,0);if(id===1864)assert.ok(n.fighters[0].ailments['狂暴']);else assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,3000);timer(q,'幽蝶强化保护');n=run(q);if(id===1864)assert.equal(n.fighters[0].ailments['狂暴'],undefined);else assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage);}
});
test('未触发通则 909必须先手且麻痹失败才追加固伤',()=>{
 for(const [pet,move]of inventory[909].targets){const q=make(909,pet,move);q.fighters[0].stats.spe=1;timer(q,'免异常');let n=run(q);assert.equal(9000-n.fighters[1].hp,n.fighters[0].lastAttackDamage);q.fighters[0].stats.spe=1000;n=run(q);assert.equal(9000-n.fighters[1].hp-n.fighters[0].lastAttackDamage,q.args[2]);}
});
test('未触发通则 1334低伤和1074与1539高伤前置严格成立',()=>{
 for(const id of [1334,1074,1539])for(const [pet,move]of inventory[id].targets){for(const high of [false,true]){const q=make(id,pet,move);q.fighters[0].stats.atk=q.fighters[0].stats.spa=high?3000:1;timer(q,'免异常');timer(q,'免弱');const n=run(q),eligible=id===1334?!high:high;if(id===1334)assert.equal(!!n.fighters[0].counts.nextSkillCurse,eligible);if(id===1074)assert.equal(!!n.fighters[0].effects['攻击概率异常'],eligible);if(id===1539)assert.equal(!!n.fighters[1].effects['免弱'],!eligible);assert.ok(high?n.fighters[0].lastAttackDamage>q.args[0]:n.fighters[0].lastAttackDamage<q.args[0]);}}
});
test('未触发通则 1337体力前置与1485目标强化前置失败无补偿',()=>{
 for(const id of [1337,1485])for(const [pet,move]of inventory[id].targets){const q=make(id,pet,move);timer(q,'免弱');q.fighters[1].counts.immune=1;let n=run(q);assert.ok(n.fighters[1].effects['免弱']);assert.equal(n.fighters[1].ailments['空定'],undefined);if(id===1337)q.fighters[0].hp=9000,q.fighters[1].hp=8000;else q.fighters[1].stages.acc=1;n=run(q);if(id===1337)assert.equal(n.fighters[1].effects['免弱'],undefined);else assert.ok(n.fighters[1].ailments['空定']);}
});
