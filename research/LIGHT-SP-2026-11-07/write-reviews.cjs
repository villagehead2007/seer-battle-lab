'use strict';
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../..'),store=require('../../local-species.cjs'),{inventory}=require('../../completion-policy.cjs');
const files=['legacy-state','training-effects','training-core','sp-skills','sp-core','additional-clauses','soul-interactions','versions'];
const cases=files.flatMap(f=>{const file='tests/light-'+f+'.test.cjs',text=fs.readFileSync(path.join(root,file),'utf8');return [...text.matchAll(/test\('([^']+)'/g)].map(m=>({file,name:m[1]}));});
const find=prefix=>{const matches=cases.filter(c=>c.name.startsWith(prefix));if(matches.length!==1)throw Error('ambiguous witness '+prefix);return matches[0];};
const groups=[
 [[4,5],'共同基础状态'],[[29,30,48,33],'共同29固定'],[[85,677,469],'共同85即时'],[[39,3,57],'共同39真实'],[[164,93],'共同164受攻'],[[681,481,440],'共同681/481'],[[609,180,432,198],'共同609疲惫'],[[433,491,690],'神圣领域433'],[[807,776,610],'诛魔807'],[[125,626,1124],'光辉125'],[[894],'寰宇894'],[[470,1125],'寰宇470'],[[585,843,532],'剑定585'],[[1126,679],'十字1126'],[[1128],'原第五1128'],
 [[2613],'特训2613'],[[2621],'特训2621'],[[2616],'特训2616'],[[2614],'特训2614'],[[2619],'SP2619'],[[2615],'特训2615'],[[523],'最新523'],[[2533],'SP2533'],[[1756],'特训1756'],[[2611,2617,2618],'特训2611/'],[[2620],'特训2620'],[[2612],'凯歌2612'],[[1774],'盛凌1774'],[[1065],'诸魔1065'],[[191],'谳世191'],[[417],'Q-LIGHT-014'],
 [[2603,2604],'SP2603'],[[2444],'SP2444'],[[2570],'SP2570'],[[1926,924],'SP1926'],[[1886],'SP1886'],[[1669,1647],'SP1669'],[[1840,1962,1963,1167],'SP1840'],[[2606,2607,2608,2609],'SP2606'],[[2605],'SP首次第五'],[[43,868],'第五43'],[[1440,478],'SP1440'],[[486],'SP486'],[[2610,2468],'神途七层']
];
const map=new Map(groups.flatMap(([ids,prefix])=>ids.map(id=>[id,find(prefix)])));
map.set(2602,find('SP承影未清除'));
const reviewPath=path.join(root,'SINGLE-STAGE-REVIEWS.json'),reviews=JSON.parse(fs.readFileSync(reviewPath,'utf8'));
const base=find('两目标全部真实'),boundary=find('两目标全部技能PP1');
function refs(cs){return cs.map(c=>({...c,assertion:c.name+'：测试体中的实际HP、PP、等级、免疫或期限断言；保留成功条件与反例。'}));}
for(const id of[3311,13311])for(const entry of inventory(store.species(id))){
 const r={sourceDigest:entry.sourceDigest,scope:'single',reviewedBy:'Codex source-instance and battle-state review',reviewedAt:'2026-11-07',implementation:['dist/range-effects.js','dist/souls.js','dist/effect-registry.js'],rationale:'按该来源实例的原文、参数、顺序与触发阶段审核；当前在场双方可执行的行为立即实现，原始来源保持不变。',singleBehavior:'',tests:{}};
 let witnesses=[];
 if(entry.kind==='move'){
  r.singleBehavior=`${entry.raw.name}（${entry.raw.id}）：采用实际API的技能分类、威力、系别、PP、命中、暴击、先制；扣PP后执行对应有序效果，控制阻止行动与消费，零PP不得普通选择。`;
  r.tests={success:refs([base]),failure:refs([base,boundary]),boundary:refs([boundary]),interaction:refs([base,boundary])};
  if(entry.raw.id===16685)r.ignoredSourceFeatures=[{field:'atk_num',value:4,sourceHash:'2b38f1c8',confirmation:'research/MULTI-TARGET-USER-SCOPE.json'}];
 }else if(entry.kind==='soul'){
  r.implementation=['dist/range-souls.js','dist/soul-registry.js','dist/souls.js'];r.singleBehavior=entry.raw.description.split('|').filter(x=>!x.includes('场下')).join('；')+'。具体歧义依USER-CONFIRMATIONS.json，源数值不重写。';
  witnesses=id===3311?[find('新638追加严格'),find('新638按自身'),find('新638复活后的两回合'),find('新638清除奖励')]:cases.filter(c=>c.file==='tests/light-sp-core.test.cjs').concat([find('SP原本致死免攻'),find('SP低额红伤真实'),find('已部署4946')]);
  if(id===13311){r.scope='mixed';r.deferredBehavior='存活于场下时为己方在场精灵授予已移除记录的无视对应免疫/抗性提升；真实换宠后的在场变系重置、共享神魂记录。';r.trigger='SP存活于场下且己方另一精灵在场附加被移除的记录，或真实切换后重新登场';r.futureMechanisms=['队伍共享神魂之器与移除历史','场下存活监听、队友攻击对应免疫与抗性处理','真实换宠事件和本次在场神灵系重置'];r.dependencyEvidence=[{kind:'off-field',quote:'自身存活于场下时，己方在场精灵'}];}
 }else{
  const effectId=entry.raw.instance.id;r.singleBehavior=`来源效果${effectId}，实例${entry.raw.index}，参数${JSON.stringify(entry.raw.instance.args)}：${entry.raw.instance.description}；复用公共伤害、命中、免疫、回复与状态机制，不把数值计算方式当作伤害类型。`;
  if(effectId===1307){r.scope='multiplayer';delete r.singleBehavior;r.deferredBehavior='未击败对手则恢复己方所有不在场精灵70点体力';r.trigger='凯歌攻击结算后未击败对手，己方存在不在场精灵';r.futureMechanisms=['场下己方队伍枚举与HP状态','为每个不在场成员分别执行70回复'];r.dependencyEvidence=[{kind:'off-field',quote:'不在场精灵'}];}
  else{if(!map.has(effectId))throw Error('no semantic witness '+entry.key+' '+effectId);witnesses=[map.get(effectId)];}
  if([2613,1669,2610].includes(effectId)){
   r.scope='mixed';
   if(effectId===2613){r.deferredBehavior='自身满体力时为己方其他精灵恢复180体力；自身在场回复已执行';r.trigger='使用谳世还生时自身满体力并存在其他己方成员';r.futureMechanisms=['己方其他成员枚举、HP和回复来源'];r.dependencyEvidence=[{kind:'team-members',quote:'己方所有精灵'}];}
   if(effectId===1669){r.deferredBehavior='己方其他存活精灵各自贡献35%的翻倍概率；当前自身一只的35%贡献已实现';r.trigger='使用驱魇逐邪时己方另有存活成员';r.futureMechanisms=['己方队伍存活数量与概率计算'];r.dependencyEvidence=[{kind:'team-state',quote:'己方每存活1只精灵'}];}
   if(effectId===2610){r.deferredBehavior='神途之熠神灵系期间双方无法主动切换精灵；仅真实换宠入口的限制延期，其他固有行为全部立即实现';r.trigger='持有神途之熠且自身为神灵系，任一方请求真实主动换宠';r.futureMechanisms=['换宠选择、强制换宠与入场离场事件'];r.glossarySource={url:'https://api.seerapi.com/v1/glossary_entry/?name=神途之熠&limit=20&expand=true',hash:'4cf21267',file:'research/LIGHT-SP-2026-11-07/sources.json'};witnesses.push(find('神途普通形态'),find('神途神灵形态零PP'),find('Q-LIGHT-012'),find('神途神灵条件'));}
  }
  if(effectId===2468)witnesses.push(find('神途第五初始化'),find('Q-LIGHT-012'));
  if([48,125,681].includes(effectId))witnesses.push(find('同效果不同来源参数'));
 }
 if(witnesses.length)for(const b of['success','failure','boundary','interaction'])r.tests[b]=refs(witnesses);
 reviews.entries[entry.key]=r;
}
fs.writeFileSync(reviewPath,JSON.stringify(reviews,null,2)+'\n');console.log('Wrote only 3311/13311 source-bound reviews.');
