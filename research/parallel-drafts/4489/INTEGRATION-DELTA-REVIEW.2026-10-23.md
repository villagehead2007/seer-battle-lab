# 4489 正式整合前增量复核（2026-10-23）

本次只读当前正式文件；只新增本交接说明。未重跑测试、npm或正式验证器，未更改原草稿补丁、源、测试和历史结果。

## 七个锚点

对 changes.json 的原 before 逐字计数，1至7全部唯一命中，计数均1。锚点序号与原文件顺序一致：1942/1943注册插入；initialContext特殊标记guard；clear中的PP/HP标记guard；clear中的白鳞guard；回体/失体用后处理；restoreState；精确36506/72失败补偿。

读取时正式SHA256：
- dist/souls.js：141e4a72bb89c7c4652615acd7ffba31aeaedc1d64616f6a0ee4563b35a19bec
- dist/range-effects.js：4d67fbc9ea2d820f50def850bfb353c90ab4e41dd36a8bde7e77ed41788e724c

这些是本次读取基准，不覆盖 changes.json 原历史hash。合入前再次验证各锚点。

## 4482 clear大行

当前 dist/souls.js:256 clear 删除eligible时新增 executorBatch -> E.SOULS.run('timedEffectEnded', context+reason:'clear')，并保持 delayedExecutionToken联动、降低攻击反应、状态恢复及其他清除反应。4489第3/4补丁仅删除前置两个已答guard，完全没有替换该大行，故逐字替换不会覆盖4482新行为；不能用旧整段clear实现替换当前代码。initialContext只删guard也保留其原清除列表逻辑。单凭唯一锚点不能替代合入后公共状态交互回归。

## 已确认的18招原生夹具漏洞及最小修正建议

state-tests.draft.cjs:11 的“所有18真实ID...”测试仍使用 a=clone(H.source), b=clone(H.source); b.souls=[]，二者 id 均4489。此处确有真实魂印丢失，不只是潜在风险。

可核调用链：dist/wiki-support.js:12 profileFor 以 wiki:+s.id 生成key，单原魂与空魂的同ID均是 wiki:4489；prepare的speciesAdditions[p.key]在第二方覆盖第一方，将soulId写为null；dist/souls.js:94读取同一E.SPECIES[f.species].soulId初始化两方。因此该18招测试旧通过仅证明无魂时的配招/效果执行，不足证明原魂1700与技能完整交互。其它通过make创建的独立状态测试已有 b.id=920688，未受同ID覆盖影响。

父代理正式迁移时最小改动：在该18招循环创建a/b后，令 b.id=920689; b.name='4489原生全招独立对照'; b.souls=[]，保留原真实a.id/源/hash/全部18技能。每次createBattle后、任何resolveTurn之前追加：
- assert.equal(s.fighters[0].number,'4489'); assert.equal(s.fighters[0].soulId,1700);
- assert.equal(s.wikiSnapshots[0].souls.find(x=>x.id===1700).hash,'5682455e');
- assert.notEqual(s.fighters[0].species,s.fighters[1].species); assert.equal(s.fighters[1].soulId,null);
- assert.ok(s.fighters[0].soulState.puEntryAffinity)，证明真实入场处理器已运行；按原类型夹具检查其own/foe及对应标记。
- 逐次断言所选真实loadout含本技能、唯一第五36508及37022为普通追加的真实flags；原PP/skillUses/伤害断言保留，因恢复真实魂印引发的PP/300/消失奖励等变化须按既有明确原答校正具体预期，不能删魂/删断言绕过。

原历史 final-isolated-v4.log 的79项exit0保留，但该18招一项的证明范围须作以上限定；本次未修夹具或重新执行，故不宣称原魂全18招修正已通过。其余33个当前目标/45关联测试结论仍以各自原夹具范围解读。正式合入/验收仍由主代理完成。
