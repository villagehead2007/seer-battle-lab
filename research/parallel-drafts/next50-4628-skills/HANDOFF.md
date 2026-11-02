# 4628 技能独占交接

已冻结17基础+27实例，私有tests-v3.log40/40 exit0。2080同一测试补真实先手失盾边界后单独tests-extra-2080.log1/1 exit0，不称单轮41。

正式整合：range-effects片段插尾；effect-registry片段在最后legacy后、冻结return前；souls.production-edits.json 8个old均需唯一匹配后替换。preload-production只用于私有，不能带进生产。helper/test正式复制并转换相对路径。

44 items逐项EV含四类literal stateRefs。757/37258/i2是唯一pure multiplayer（敌流血、当轮击败、对方下只出场100%害怕），保留完整URL/hash/参数与未来流程；没有当前状态伪证明。

当前待确认：545新010，576→4608-001（小额与普通/攻击盾、多个伤害事件统计）、974→4627-010（流血同名不延长）、1842→4625-011与Q-BATCH-004、191→4511-006、545控制中断→4521-001。资格policy仅明确载荷，不当自然答案。1845同effect/hash旧用户答可窄复用使用时敌当前HP缺口快照，新[1,1]不沿用旧[2,1]比例。

101仅精确新14859取完整settled red30%回复，含过量、保1实际0、盾挡0、禁疗和倍率。旧101路径不改。545在真实正完整伤害事件处运行；576只有新marker窄保护；1842新used监听涵盖实际MISS/整招无效，控制未使用不触发。

结构测试只直接validate接口负例，不宣称旧non-direct通用compile实际调用validate。纯诊断和真实状态在EV分列，历史失败完整保留。未运行完整npm或validator。

冻结后复核已向主线报告1198泛“造成伤害”与预授1842吸取/1835吸取的真实非红范围交叉；等待主审，未擅改冻结源码。

## 1198 correction 最终

主审确认泛造成伤害范围是本只真实可达缺口，已关联4612-001（本API/Wiki一致，无1820字段矛盾）。先整合base range，再append correction/range-effects.production-fragment.js；在原8条souls之后额外应用correction/souls.production-edits.json两条，soul1835唯一读取HP损失patch另外应用一次。不能再次用私有preload整合生产。

current-use marker由source-bound beforeDamage条件候选与实际afterHit激活，真实预授1842与完整1835非红载荷才guard；明确red-only/all实际350/700、D/2D，理论回复保持原350或D。endAction清marker，下一次非此技能不拦。correction v1 4/4、v2题名纯诊断勘误后4/4分别计数；最后一项纯throws不当状态证据。

44 unique测试=40原+4补正；1结构、4纯诊断、39带真实状态（含明确政策载荷）。正式结果仍等main实际执行；44EV已添加3条补正实际Refs与纯诊断分列。

## 正式整合最终结果

正式首轮743/742pass/1fail，唯一主线2080观察器早于技能beforeDamage加成读取，生产SHA不变；主线改effectsEngine.run之后读后3/3复验通过。740未受影响+3主线=743 unique跨两轮真实通过；实际746执行745pass/历史1fail，不称单轮743/743，也不是npm/validator。补正正式测试实际路径 tests/next50-4628-correction.test.cjs（EV已更正）。主线45coverage无缺失/过期/错误，纯多宠TODO1。
