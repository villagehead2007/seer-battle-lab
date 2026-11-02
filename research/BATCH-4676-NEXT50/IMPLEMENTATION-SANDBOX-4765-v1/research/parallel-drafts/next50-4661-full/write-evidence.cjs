const fs=require('fs'),crypto=require('crypto'),d='research/parallel-drafts/next50-4661-full/',s=require('../../../research/4661-reviewed-snapshot.json');const catalogs={a:['4661-full.test.draft.cjs','tests/next50-4661-full.test.cjs'],b:['remaining-boundaries.test.draft.cjs','tests/next50-4661-remaining-boundaries.test.cjs'],c:['progression-boundaries.test.draft.cjs','tests/next50-4661-progression-boundaries.test.cjs'],d:['additional-boundaries.test.draft.cjs','tests/next50-4661-additional-boundaries.test.cjs']};for(const[k,v]of Object.entries(catalogs))v.push([...fs.readFileSync(d+v[0],'utf8').matchAll(/test\('([^']+)'/g)].map(m=>m[1]));const ref=(k,i,assertions)=>({file:catalogs[k][1],test:catalogs[k][2][i],assertions,...(k==='d'?{validation:'UNRUN sidecar awaits parent production run'}:{validation:'private v11 48/48 exit0; production not yet run'})});const refs=(spec,note)=>spec.map(([k,i])=>ref(k,i,note));const four=(success,failure,boundary,interaction,notes={})=>({success:refs(success,notes.success??'实际HP/PP/等级或异常状态断言'),failure:refs(failure,notes.failure??'明确条件false、免疫或已使用但整招失效/控制未使用断言'),boundary:refs(boundary,notes.boundary??'该具体回合/数值/条件边界断言'),interaction:refs(interaction,notes.interaction??'当前实际交互状态断言')});
// Manually audited per-instance literal mapping. Indices below refer to immutable explicit catalogs, not name keywords.
const map={
 '28776:0':four([['a',6]],[['a',6],['b',2]],[['a',6]],[['a',6]],{boundary:'仅防御/特防两原索引各+2、其它等级不变、PP40→39；不声称本条已测+6封顶'}),
 '28776:1':four([['a',6]],[['a',6],['b',2]],[['a',6]],[['a',6]]),
 '28777:0':four([['a',7]],[['b',2]],[['a',7]],[['a',7]],{boundary:'授予第1轮后，第2轮仍0红伤、第3轮失效恢复红伤'}),
 '28777:1':four([['a',7]],[['b',2]],[['a',7]],[['a',7]]),
 '37452:0':four([['a',8]],[['a',8],['b',2]],[['d',1]],[['a',8],['d',1]]),
 '37453:0':four([['a',8]],[['d',1],['b',2]],[['d',1]],[['c',3]],{interaction:'明确PP0整招无效use-end研究载荷：原626真实三项+1、红伤0；不充自然强制范围答案'}),
 '28778:0':four([['a',9]],[['b',1],['b',2]],[['a',9]],[['a',9]],{failure:'全0无负等级自然共同无变化、控制/整招失效不执行'}),
 '28778:1':four([['a',9]],[['a',9],['b',2]],[['a',9]],[['a',9]]),
 '37454:0':four([['a',12]],[['b',2]],[['d',0]],[['a',12],['d',0]]),
 '37455:0':four([['a',10]],[['a',10],['b',2]],[['a',10]],[['b',1]],{boundary:'实际携带40PP受扣2、当前敌选中槽再实际消费1；PP保护不扣，非携带槽不引用'}),
 '37456:0':four([['a',11]],[['b',2]],[['a',11]],[['c',4]],{interaction:'PP0攻免自然003待答；明确仅use-end载荷仍降低maxHP50，红伤0，HP截断；不伪造穿免攻击红伤'}),
 '37457:0':four([['b',17]],[['b',17],['b',2]],[['b',17]],[['b',17]],{boundary:'100HP真实致死红伤后9000全回；后手被击败未用、PP未消耗，不授保护'}),
 '37458:0':four([['b',15]],[['b',15],['b',2]],[['b',15]],[['b',15]]),
 '37458:1':four([['b',14]],[['b',14],['b',2]],[['b',14]],[['b',14]]),
 '37458:2':four([['b',16]],[['b',16],['b',2]],[['b',16]],[['b',16]]),
 '37458:3':four([['a',19]],[['a',20],['a',21]],[['a',19],['a',20]],[['a',19]]),
 '28780:0':four([['b',3]],[['b',2]],[['b',3]],[['b',3]]),
 '28780:1':four([['a',13]],[['b',2]],[['a',13]],[['a',13]]),
 '28780:2':four([['b',5]],[['b',5],['b',2]],[['b',5],['b',19]],[['b',5],['b',19]]),
 '28780:3':four([['b',18]],[['b',2]],[['b',18]],[['b',18]],{success:'仅before-use/use-end明确研究输入分别实际施加束缚；自然准确时点仍004待答'}),
 '28780:4':four([['a',19]],[['a',20],['a',21]],[['a',19],['a',20]],[['a',19]]),
 '28781:0':four([['a',16]],[['b',2]],[['a',16]],[['a',16]]),
 '28781:1':four([['b',6],['b',7]],[['b',7],['b',2]],[['b',7],['b',19]],[['b',6],['b',7]]),
 '28781:2':four([['a',12]],[['b',2]],[['d',0]],[['a',12],['d',0]]),
 '28781:3':four([['a',19]],[['a',20],['a',21]],[['a',19],['a',20]],[['a',19]]),
 '37459:0':four([['a',10]],[['d',2],['b',2]],[['a',10],['d',2]],[['d',2]]),
 '37459:1':four([['a',14]],[['a',14],['b',2]],[['a',14]],[['b',3]]),
 '37459:2':four([['a',15]],[['b',2]],[['a',15]],[['b',1]]),
 '37459:4':four([['a',19]],[['a',20],['a',21]],[['a',19],['a',20]],[['a',19]]),
 '37460:0':four([['b',8]],[['b',8],['b',2]],[['b',8]],[['b',8]]),
 '37460:1':four([['c',0],['b',9]],[['b',9],['b',2]],[['b',9]],[['b',9]]),
 '37460:2':four([['b',10]],[['b',10],['b',2]],[['b',10]],[['b',10]]),
 '37460:3':four([['a',17]],[['a',17],['b',2]],[['a',17],['b',11]],[['b',11],['c',0]]),
 '37460:4':four([['a',18]],[['a',18],['b',2]],[['a',18],['b',11]],[['b',11]]),
 '37460:5':four([['a',18]],[['a',18],['b',2]],[['a',18]],[['b',12]])
};
const pending={'37458:0':['Q-N50-4661-010'],'37458:1':['Q-N50-4511-002'],'28780:0':['Q-N50-4511-006'],'28780:3':['Q-N50-4604-004'],'28781:1':['Q-N50-4625-011']};
const deferred={
 '28779:0':{scope:'multiplayer',trigger:'双方在下2回合内尝试主动切换精灵',dependency:'双方各自队伍替补与主动换宠动作门禁',futureMechanism:'禁止双方主动切换，不替代当前技能用招或异常控制',kind:'switch'},
 '37459:3':{scope:'multiplayer',trigger:'击败当前处于臣服的对手后，对方真实下一只精灵出战',dependency:'对方下一只目标选择与出场异常施加',futureMechanism:'对方下一只出战精灵附加臣服，不能转授当前尸体充完成',kind:'off-field'},
 '37459:2':{scope:'mixed',trigger:'对手在本回合真实切换精灵',dependency:'真实换宠事件与换入后的当前接收者',futureMechanism:'切换分支100%臣服；当前无切换分支100%束缚已真实实现',kind:'switch'},
 '37458:3':{scope:'mixed',trigger:'无为当回合未使用技能且自身异常，消耗本技能全部PP后，对手下回合主动切换',dependency:'对手下回合真实主动换宠门禁',futureMechanism:'当前条件与耗PP实际实现；仅下回合不能主动切换的门禁延期',kind:'switch'}
};
const basics=s.moves.map(m=>({key:'4661:move:'+m.id,kind:'skill-basic',moveId:m.id,name:m.name,hash:m.hash,description:m.description||`${m.kind}；${m.type}；威力${m.power}；PP${m.pp}；命中${m.accuracy}；必中${m.alwaysHit}；先制${m.priority}`,basicValues:{kind:m.kind,type:m.type,power:m.power,pp:m.pp,accuracy:m.accuracy,alwaysHit:m.alwaysHit,priority:m.priority},scope:'single',stateRefs:four([['a',4],['b',1]],[['a',5],['b',2]],[['a',4]],[['b',1],['b',2]],{boundary:'从原生最大PP到消耗1与0PP第五显式已授PP豁免，保留原始must_hit；不宣称所有95命中已逐一概率分布抽样'}),pending:[],deferred:[]}));
const effects=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>{const k=m.id+':'+index,df=deferred[k];if(!map[k]&&!df)throw Error('manual mapping missing '+k);return {key:'4661:skill:'+m.id+':'+index,kind:'effect-instance',moveId:m.id,moveName:m.name,moveHash:m.hash,index,effectId:e.id,args:e.args,description:e.description,effectDefinition:s.effects.find(x=>x.id===e.id),source:{skillURL:'https://api.seerapi.com/v1/skill/'+m.id,effectURL:'https://api.seerapi.com/v1/skill_effect_type/'+e.id,snapshot:s.source},scope:df?.scope??'single',stateRefs:map[k]??{success:[],failure:[],boundary:[],interaction:[]},pending:pending[k]??[],deferred:df?[{...df,sourceText:e.description,sourceMoveHash:m.hash,effectId:e.id,index,args:e.args,sourceURL:'https://api.seerapi.com/v1/skill/'+m.id}]:[],rationale:df?.scope==='multiplayer'?'来源直接需要真实切换或下一只目标，当前阶段无该目标，不用结构检查充状态证明':df?'当前在场条件/载荷实态完成；来源明确换宠分支单独保留':'当前在场双方真实分支与明确研究载荷逐项映射；待答不当自然机制完成'};}));
const branches=[
 {part:'zero-base-real-growth-and-half',text:'真实零种族养成、战斗开始六面板和的一半',pending:['Q-N50-4661-001'],stateRefs:four([['a',0]],[['a',2]],[['b',13]],[['a',0],['b',13]])},
 {part:'PP-ignore-and-post-use-reversal',text:'实际使用不受PP限制，使用之后当前PP与已损失PP反转',pending:[],stateRefs:four([['a',1],['a',2]],[['a',2]],[['a',1],['a',2]],[['c',0],['a',21]])},
 {part:'positive-PP-clear-and-next-ailment-immune',text:'正PP已用解除异常并免疫下次，PP0不重授',pending:['Q-N50-4511-006'],stateRefs:four([['a',3],['b',4]],[['a',2]],[['a',3],['b',4]],[['b',3]])},
 {part:'zero-PP-hit-and-force-effects',text:'0PP必命中并强制执行命中效果',pending:['Q-N50-4604-003'],stateRefs:four([['c',0]],[['a',2]],[['c',3],['c',4]],[['c',3],['c',4]])},
 {part:'zero-PP-progress-conditions-and-power',text:'万相永久依原顺序取消第五首未取消条的全部条件并+50',pending:['Q-N50-4661-002'],stateRefs:four([['a',1],['c',1]],[['a',2]],[['c',1]],[['b',8],['b',9],['b',10],['b',11],['b',12]])},
 {part:'current-actual-KO-reset-and-corpse-vanish',text:'当前实际击败后重置万相，当前尸体消逝；真实即时回复交叉待答',pending:['Q-N50-4661-003','Q-N50-4604-007'],stateRefs:four([['c',2]],[['a',2]],[['b',12]],[['b',12]])},
 {part:'battle-phase-end-all-carried-wuwei',text:'未使用技能的战阶结束，依真实配招顺序执行全部满足条件的无为',pending:[],stateRefs:four([['a',19]],[['a',20],['a',21]],[['a',19],['a',20]],[['a',19]])}
];
const soul={key:'4661:soul:1862',kind:'soul',soulId:1862,hash:'9320d014',description:s.souls[0].description,source:s.souls[0].source,scope:'mixed',branches,pending:[...new Set(branches.flatMap(b=>b.pending))],deferred:[{scope:'off-field',kind:'off-field',sourceText:'自身击败对手后，万相乖离重置并令对方阵亡精灵消逝',trigger:'真实多精灵对局中，被本魂指定的对方阵亡精灵离场移除',dependency:'队伍阵亡目标表与真实移除；当前被击败的在场目标消逝已有独立实现',futureMechanism:'仅非当前在场尸体目标/队伍影响延期，不扩大为所有历史尸体、不改变当前KO重置',sourceURL:s.souls[0].source.url,sourceHash:'9320d014'}],pureDiagnostics:[ref('c',5,'实际1463恢复9000后触007，记录PP/已重置/未消逝；不据代码顺序裁定自然答案')]};
const ev={target:4661,status:'private48/48 passed; production sidecar3 UNRUN; not deployed/not accepted',schema:'items55 kind skill-basic/effect-instance/soul; stateRefs four categories literal file/test/assertions; pure structural and diagnostics excluded from state refs',counts:{basic:17,effects:37,soul:1,inventory:55,privateTests:48,stateOrQualified:46,pureStructure:1,pureDiagnostics:1,additionalUnrun:3},sourceFiles:{snapshot:'research/4661-reviewed-snapshot.json',snapshotSHA256:crypto.createHash('sha256').update(fs.readFileSync('research/4661-reviewed-snapshot.json')).digest('hex'),manifest:'research/4661-source-manifest.json',manifestSHA256:crypto.createHash('sha256').update(fs.readFileSync('research/4661-source-manifest.json')).digest('hex'),sourceIntegrity:'research/4661-source-integrity.json',sourceChecks:110,sourceFailed:0},validation:{private:{run:'v11',tests:48,passed:48,failed:0,exitCode:0,log:d+'tests-v11.log'},additional:{tests:3,status:'UNRUN parent will validate production first'},production:null},pureStructure:[ref('b',0,'精确零种族来源白名单拒绝，不作实态四类覆盖')],pureDiagnostics:[ref('c',5,'实际HP/PP死亡顺序诊断，不算自然复活消逝正确答案')],items:[...basics,...effects,soul],deferred:[...effects.flatMap(e=>e.deferred.map(x=>({...x,key:e.key}))),...soul.deferred.map(x=>({...x,key:soul.key}))],sourceScopeNotes:['无伙伴追加或觉醒新版本；真实17技能，唯一第五37460','原base全0，父local-species精确源接入+新wiki-support同源接入，不伪造种族','纯多宠2144/185无第一阶段状态引用；混合1868/2190[3]/魂当前分支立即做','旧版本同17moveId存档无重叠；所有共用effect保留old phase/parse/direct/hooks/fallback','某些旧literal标题比断言范围宽，仅本EV具体assertions作为覆盖说明，未据标题伪造1604禁PP证据；新增sidecar真实补齐']};
if(ev.items.length!==55)throw Error('inventory not55');fs.writeFileSync(d+'4661-instance-evidence.json',JSON.stringify(ev,null,2)+'\n');fs.writeFileSync(d+'literal-test-catalog.json',JSON.stringify(Object.fromEntries(Object.entries(catalogs).map(([k,v])=>[k,{privateFile:d+v[0],productionFile:v[1],tests:v[2]}])),null,2)+'\n');fs.writeFileSync(d+'soul-branch-state-evidence.json',JSON.stringify(soul,null,2)+'\n');console.log(JSON.stringify({items:ev.items.length,effects:effects.length,pure:ev.pureStructure.length,diagnostics:ev.pureDiagnostics.length,deferred:ev.deferred.length}));

