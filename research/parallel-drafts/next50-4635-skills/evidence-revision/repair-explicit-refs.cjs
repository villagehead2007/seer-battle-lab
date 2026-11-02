const fs=require('fs'),p='research/parallel-drafts/next50-4635-skills/',ev=JSON.parse(fs.readFileSync(p+'4635-instance-evidence.json')),T=[...fs.readFileSync(p+'4635-skills.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]),A=[...fs.readFileSync(p+'additional-boundaries/state-boundaries.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]),C=[...fs.readFileSync(p+'correction/late-ko.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]),R=[...fs.readFileSync(p+'evidence-revision/1343-boundaries.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]),D=[...fs.readFileSync(p+'evidence-revision/duration-boundaries.test.cjs','utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]);const files={T:'tests/next50-4635-skills.test.cjs',A:'tests/next50-4635-additional-boundaries.test.cjs',C:'tests/next50-4635-late-ko.test.cjs',R:'tests/next50-4635-conversion-boundaries.test.cjs',D:'tests/next50-4635-duration-boundaries.test.cjs'},pool={T,A,C,R,D},ref=(type,index,assertion)=>({file:files[type],name:pool[type][index],assertion});
// Explicit mapping, manually audited against callback assertions. No effect-name search.
const map={
4:{success:[['T',3]],failure:[['A',0]],boundary:[['T',3]],interaction:[['T',48]]},
5:{success:[['T',3]],failure:[['A',0]],boundary:[['T',3]],interaction:[['T',3]]},
2170:{success:[['A',1]],failure:[['A',1]],boundary:[['A',1]],interaction:[['A',1]]},
1343:{success:[['T',7]],failure:[['T',7],['R',1]],boundary:[['R',0],['R',2]],interaction:[['R',0],['R',1],['R',2]]},
1371:{success:[['T',5]],failure:[['T',5]],boundary:[['T',5]],interaction:[['T',5]]},
2172:{success:[['T',6]],failure:[['T',6]],boundary:[['T',6]],interaction:[['T',6]]},
13:{success:[['T',8],['D',0]],failure:[['T',8]],boundary:[['D',0]],interaction:[['T',8],['D',0]]},
440:{success:[['T',9]],failure:[['A',0]],boundary:[['T',9]],interaction:[['T',9]]},
535:{success:[['T',10],['D',1]],failure:[['T',10],['T',43]],boundary:[['T',10],['D',1]],interaction:[['T',43]]},
1509:{success:[['T',11],['T',12]],failure:[['A',0],['T',47]],boundary:[['T',46],['T',12]],interaction:[['T',47],['T',12]]},
1510:{success:[],failure:[],boundary:[],interaction:[]},
1345:{success:[['T',13]],failure:[['T',13]],boundary:[['T',13]],interaction:[['T',13]]},
881:{success:[['T',14]],failure:[['T',14]],boundary:[['T',14]],interaction:[['T',14]]},
1687:{success:[['T',15],['D',2]],failure:[['T',15],['A',0]],boundary:[['D',2]],interaction:[['T',15],['D',2]]},
2160:{success:[['T',16],['T',37]],failure:[['T',37],['A',0]],boundary:[['D',3]],interaction:[['T',37],['T',16]]},
1524:{success:[['T',17]],failure:[['T',18]],boundary:[['T',17],['T',40]],interaction:[['T',18],['T',40]]},
2175:{success:[['T',38]],failure:[],boundary:[['T',38]],interaction:[['T',38]]},
1683:{success:[['T',19]],failure:[['A',0]],boundary:[['T',19]],interaction:[['T',19]]},
1949:{success:[['T',20]],failure:[['T',20]],boundary:[['T',21],['T',39]],interaction:[['T',39],['T',21]]},
1168:{success:[['T',22]],failure:[['A',0]],boundary:[['T',22]],interaction:[['T',22]]},
2176:{success:[['T',23]],failure:[['T',23]],boundary:[['T',41]],interaction:[['T',41],['T',23]]},
1303:{success:[['T',24]],failure:[['T',24],['T',35]],boundary:[['T',24],['T',35]],interaction:[['T',35],['T',36],['C',0],['C',1]]},
619:{success:[['T',25]],failure:[['A',0]],boundary:[['T',25]],interaction:[['T',25]]},
736:{success:[['T',26],['D',4]],failure:[['T',26]],boundary:[['D',4]],interaction:[['D',4]]},
2174:{success:[['T',27]],failure:[['T',27]],boundary:[['T',34]],interaction:[['T',27],['T',34]]},
925:{success:[['T',28]],failure:[['T',28]],boundary:[['T',28]],interaction:[['T',28]]},
2173:{success:[['T',29]],failure:[['T',29],['T',42]],boundary:[['T',42]],interaction:[['T',42]]},
1866:{success:[['T',30]],failure:[['T',30]],boundary:[['T',30]],interaction:[['T',30]]},
1822:{success:[['T',31]],failure:[['T',44]],boundary:[['T',31]],interaction:[['T',44]]},
1091:{success:[['T',32],['D',5]],failure:[['T',32]],boundary:[['D',5]],interaction:[['C',0],['C',1],['D',5]]}
};const notes={4:'当前每个原始4实例明确+1和6封顶；全技能封锁/控制未用保持全0，完整20462组合同时def/spd各1',5:'当前各原始5实例精确统计100或50概率，-6封底；全技能封锁/控制未用保持敌等级0',2170:'两个具体技能源自身速度1，敌异常有无使真实先制base/base+1，均验证PP和敌HP',1343:'真实清回合成功才授一次；无可清不授；红伤0仍消费、不回；禁疗不回仍消费；三类非红各100不耗，后续红耗',1371:'自身满/缺HP两边界，敌200实际低HP与理论回复3000；禁疗阻回复不挡percent3000',2172:'自身HP8000/9000严格不满/满；免异实际阻感染',13:'非草和草明确免疫；每轮双HP差1125严格持续1到5、第6停',440:'敌当轮及后续真实PP2倍，第4轮到期单倍；全技能封锁不授',535:'未受攻击不加、第一击双防各1、双6封顶；第2/3轮受击生效第4停；明确2段event/round政策和完整0政策实际状态差',1509:'普通全降且随机1PP0；无效明确补偿HP9000实际损失、死亡未用PP99/次数3；已有1463复活后PP3消费；0PP豁免、控制未用、整招无效已用',1345:'HP9000自损为0后仍执行随机1控制；免异失败实际percent4500；源没有额外自身存活前提',881:'真实atk-1时优先3反超速度；无负时敌先手，未把cap/时序虚构成其他断言',1687:'控制实际反给敌，非控制中毒正常落己；第2/3/4轮反弹、第5轮睡眠落己',2160:'self/enemy明确资格各实际2非限制状态、独立2或3结束时点；既授MISS/封锁仍抽、控制未用不抽；第2抽2、第3过期停',1524:'无负共同不回复，零敌负反馈明确clear/retain；免弱失败自清且HP不回；非零敌三政策和禁疗真实差异',2175:'仅extra-unused与明确receiver研究载荷afterUse各实际2状态；原生arity0/[3]尚阻塞，不给failure虚假状态refs',1683:'真实清强保护不丢atk2，3轮后可清为0；封锁不授',1949:'own0共同复制敌+3，敌无正不授、禁强失败；显式加/覆/高三算法差异与免异1次真实消费、1757等值混源诊断',1168:'双方无异常全1，任一中毒全2，6封顶不溢出；封锁不执行',2176:'寄生成功不清PP，免异失败清最高攻击PP；同名长寄生真实pending、明确并列all/first/random不同清槽数',1303:'实际HP4500/4499阈值分别3000/6000；MISS/整招无效既授仍触、控制未用/PP0未用不触、到期停；免粉理论heal/半回以及真实晚杀归属守卫',619:'下2轮真实先手改变、第3后恢复，不读旧turns[0]；封锁不授',736:'清敌正成功才statusBlock，敌无正不授；敌真实属性强化第1/2轮不加、扣PP，第3轮加1',2174:'双边0PP累计150；0项不附伤；免fixed补equaltrue；保1实际HP0损失仍正fixed不补true；盾挡fixed0补true、heal理论不降',925:'同种seed实际满9000红伤大于8999非满红伤；这是威力条件的实际伤害对照，不把倍威力说成精确倍伤',2173:'无异常共同无转移无清PP；中毒转入己清敌且1PP0；明确免疫bypass/normal政策下双方状态与PP数不同',1866:'30真实seed四限定池全部出现、各2无放回；免异不补抽实际0状态',1822:'实际消费剩余29/30全部PP成0，对应1350/2700；免粉仍耗PP并授次数，重授资源真实pending',1091:'本体普通KO无反弹，未KO授下两轮；第2/3实际反弹第4失效；已授1303晚杀归属精确真实状态诊断，不声称已解，尚未用位置推即时复活规则'};
for(const i of ev.items){if(i.kind==='skill-basic')continue;const m=map[i.effectId];if(!m)throw Error('missing explicit map '+i.effectId);for(const branch of ['success','failure','boundary','interaction'])i.stateRefs[branch]=m[branch].map(([type,n])=>ref(type,n,notes[i.effectId]));i.stateTests=[...new Set(Object.values(i.stateRefs).flat().map(r=>r.name))];i.stateRefNotes=notes[i.effectId];if(i.effectId===2175)i.nativeBlocker.nativeFailureStateTested=false;}
fs.writeFileSync(p+'4635-instance-evidence.json',JSON.stringify(ev,null,2));fs.writeFileSync(p+'evidence-revision/explicit-map-audit.json',JSON.stringify({cause:"原refs(id)要求数字后空格，实际literal名称无空格，导致已测引用遗漏；改显式ID到literal索引清单，非关键词猜测",archive:'4635-instance-evidence-before-explicit-map.json',map:Object.fromEntries(Object.entries(map).map(([id,by])=>[id,{categoryNotes:notes[id],refs:Object.fromEntries(Object.entries(by).map(([k,rows])=>[k,rows.map(([t,n])=>ref(t,n,notes[id]))]))}])),counts:{items:ev.items.length,effectInstances:ev.items.filter(i=>i.kind==='effect-instance').length,pureMultiNoState:1,native2175FailureGap:1},pendingProductionPaths:[files.R,files.D]},null,2));console.log('Explicit per-effect refs repaired; native2175 failure remains empty');
