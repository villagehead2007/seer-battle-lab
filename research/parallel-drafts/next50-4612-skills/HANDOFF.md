4612 魂弦技能最终交接（v4冻结）

44审核项＝17基础＋27效果，逐项字面test名见4612-instance-evidence.json。全部当前single，无真正多精灵延期。未知原始20420/4六参数与arity3仍完整保留，不能擅拆两个三元组或只执行前三项；这条效果没有自然实现证据，stateTests空、pendingTests列真实基础PP及拒绝，不拿guard充数。

私有v4 tests-v4.log：36/36、退出0，1纯结构、2纯诊断、33真实状态/明确载荷（其中20420测试仅证明独立基础与保留冲突）。主线已另完成377/377生产整合与旧目标/公共回归，实际自身21+36+2组合＝59；不是子代理执行，非正式单精灵验收。问题仍partial。

源码/测试/patch已冻结（FREEZE.json SHA）；range-effects片段放工厂尾，effect-registry片段必须放return Object.freeze({statusDeclarations,registry:之前：1327新37172运行/校验及1326新28634校验都在后置legacy之后，保持非direct的parse形状。7条souls精确锚点分别：criticalContext只读criticalsEnabled；新盾来源消失005；新免反消费006；新固定数值吸取未答类型保护与明确载荷；新1587真KO/晚杀；新1587奖励判断；新1400余段疲惫中断4521。所有无marker旧路径保留。

生产实际test路径：tests/next50-4612-skills.test.cjs；helper tests/helpers/4612-battle.cjs。复制helper时../../../dist及../../../research转../../，test的./4612-battle.cjs转./helpers/4612-battle.cjs；其中../../../data/species/4384.json转../data/species/4384.json。私有preload不入生产，没有注入1820；main单独整合魂印4补丁与真实组合，不重复处理。

来源：17原技能全部字段、hidden/friend/advance/atk_num核对见raw-field-audit.json；实际全atk_num1，无额外分支。主线source/details保留4旧259ebd64与新cda7be9a历史，skill20420仍28707a7b六参数；未知不修改来源/metadata arity。来源hash引用最新manifest。

新问题仅Q-N50-4612-003：543[10]增加致命概率没有单位/算法。关闭随机暴击、真实1204已强制必暴的共同分支不保护；明确chance0/1载荷验证真实暴击与红伤，不将参数10猜为百分点/倍数。

公共关联完整实例见shared-associations.draft.json：
- 20420/4→4600-001，明确子问六参数是否两组三元组及速度/命中实际行为。
- 37172/1327→4608-003，仅盾基数；比例伤害与理论回复完成，最终各候选floor相同自然授盾，原分数请求不提前floor（9001/3边界实测）。main另定向修复旧37150同一过度阻塞并141/141回归，子代理未改shared/旧冻结稿。
- 37171/1387、28634/1752→4600-005，来源耗尽但其他盾存活与真实主动清除。普通单源自然耗尽固定反击/明确吸取载荷均有真实状态；不把触发registry当证据。
- 1752固定数值300吸取伤害类型→旧Q-BATCH-004未答部分；理论回复300已确认，不重复问。新source不选fixed/percent/true，自然正伤害类型保护，明确三类型载荷均验证理论回复及禁疗/倍率/免伤、随机PP2。
- 随机PP池依据research/3807-user-confirmed-rules.json：明确所有随机清PP、已配招且PP>0、等概率无放回、不足全清；测0/1/普通2/PP保护。不把Q038–043吸PP分配当池依据。
- 37173/1587→4589-004，仅先前已授1387/1752载荷晚杀承接；本体/1272当前真KO记录包含重生前死亡，敌自损不误算本人KO；1603按既有冻结确认是下回合重生，文档不冒称即时回满。
- 1400→4521-001：真实对手两段首段清回合，疲惫成功且余段存在才新marker保护；单段/免疫失败/1820回合初自清不误阻。
- 191/1768/1204→4511-006，真实重复授予与异源免异混合消费；普通首次、消费、到期及1768转换后后续真实红伤都完成。

公共改动精确范围：1012仅新启世序曲实际steal返回数量>0才授300盾；43仅新28633用原legacy fraction并skill origin禁疗；1205新增真实模板后手全强；1828[150]与1843[300,100,7]只新源validate扩展，旧execute不变；1400/1387/1752/191 marker只新源；1327/1326保持旧legacy模式。main必要旧回归范围已完成，不要求扩大审计/重复整库。

PRIVATE-FAILURE-HISTORY.json保留v1 28/18p10f、v2 31/29p2f、v3 33/32p1f、v4 36/36日志与具体原因。真实夹具修正包括：本体先耗敌盾后1545/1497取当前值；护盾会挡1272固定的基数测试须分离；1486概率多draw的控制使用真实beforeAttackDamage同步RNG，保持1.9红伤断言；1326后置legacy源校验；未删断言或放宽行为标准。

未联网、未写shared、未跑整库/验证器、不使用Git、未读/处理live新增MD回答。源码与测试v4后不改，只补证据元数据。
