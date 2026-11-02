# 4599魂印1805交接

真实source 61c58f40，eid2193[2,2,4,0,1,40,1]。完整raw/formatted/analyze、原始URL/hash、补查3records/dataSHA及001/002/003三题全文证据见source-audit.json。Wiki1805rev320340补充恒4，术语页缺失，eid仅arity。历史formatted恒4与现行analyze不冲突可补；不把缺失字段当删除。未读本轮liveMD新增答案。

## 生产整合

range-souls.production-fragment.js嵌入工厂，无require。souls.production-edits.json四条精确补丁：1805免异常次数混源guard、真实免疫消费来源删除、已算power的actor1805按round/move/use数组memo、beforeIncomingAttack复用当前同一实算power。不得复制威力公式或额外roll随机。

仅层接口frozen-layer-interface.cjs和v2供技能代理隔离其2106/2107/2108载荷测试，不能部署为完整魂印。v2只把不足层错误标为正式003，三个接口行为相同：levelCount返回{ming,fall}，transferLayer(from,n)足层向另一方转移，swapLayers交换。

自然使用攻击时base/actual相对阈值同判即执行，真分歧002。incoming按真实一次use只消费一层命起并将免攻绑定同次全部攻击段；1926无视免疫沿公共管线。新睡眠成功的载荷已有真实层/异常变化，当前攻击是否中断自然4521-001保护。自身实际使用后减魂落/睡眠/失败粉伤正常完成；普通MISS/失效仍used，控制未用无触发。动态威力MISS无实算值不猜，002。

自然未击败奖励时点001只保存pending/日志，不授猜测奖励；qualifiedNotDefeated明确条件/时点输入下独立完成回血/全部PP回复/相等首次免异及真实消费，不能冒称001解决。免疫未消费重授/混源4511-006。

## 未解决与延期

- 001未击败奖励时点/范围/真实KO判据。
- 002威力基础或实算口径（604随机、2108下次加威力有真实差异）。
- 003零层触发/自增饱和/互转边界。
- 共享4521-001敌使用中睡眠成功是否取消本次攻击；共享4511-006下次异常免疫重授/混源。

只延期真正己方上只下场状态继承→进入2回合免异、及击败后对手下场异常/负等级转给下一只。自身层数/互转/交换、2106/2107自身增层、失败补偿与当前奖励载荷不延期。

## 测试

node --test --test-concurrency=1 research/parallel-drafts/next50-4599-soul/soul1805.test.cjs。

tests-v1.log真实22/22 exit0、330ms，无活动进程。其后仅增加第23条真实2997/10022乱突31[2,5]多段只消费1层测试，未在v1日志运行；待主线调度最终23项。全部测试名literal，状态断言含层数/HP/PP/异常/完整伤害/真实消费，guard测试亦先断言已发生状态，不用纯throws充数。主线整合后仍须生产专项/必要回归/准确pending状态；此处未运行npm/正式验证器。

## 主线生产最终补充

research/4599-soul-production-targeted-v3.log：24/24通过，exit0，348ms，无活动进程。正式memo/incoming已限定typedBase===null，无actualPower原生入口return；新增属性实际使用typed附伤不消命起阴性。真实多段fixture最终用已认证4505的10022/31[2,5]和真实第五36589；v1在线身份不匹配、v2旧2997无第五的失败日志保留，断言未弱化、不伪造标记。独占实现/23测试/4补丁依主线要求未回写，正式版以主线生产文件为准。

1805来源“自身使用……攻击技能后”决定在2108技能afterAttack交换之后按当前层判定；1581明确“出手时”才属于前时点快照，不能套为本魂印规则。此前额外快照复核由此消除，不新增问题；主线另加真实交换后集成用例，当前24项不冒称已覆盖该组合。
