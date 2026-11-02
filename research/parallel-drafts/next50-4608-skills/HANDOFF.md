4608 技能冻结交接（v3）

- 17真实技能基础+28真实效果实例=45项；证据4608-instance-evidence.json。全single，无新增真实多宠分支。魂印1813另由soul代理交付，不把其共享4511-002误记作4608-002。
- 私有最终node --test --test-concurrency=1：tests-v3.log，39/39、退出0；1纯结构、3纯诊断、35真实状态/明确政策载荷。纯诊断字面名称见evidence，不充当实现证据。未运行整库、正式部署或automation validator，待问题目标仍partial。
- 源码/测试/patch见FREEZE.json全部SHA，v3后不再改。生产整合两fragment：range-effects.production-fragment.js在工厂尾；effect-registry.production-fragment.js必须在其return Object.freeze({statusDeclarations,registry:之前（1327 legacy后注册会覆盖range同名包装，不能flip direct）。4条souls.production-edits.json按唯一精确旧锚点应用。
- 私有preload额外读取sibling冻结frozen-soul1813-v1.cjs与其2souls补丁；它们不是技能补丁，不重复整合。不要把私有preload复制进生产。
- helper复制至tests/helpers/4608-battle.cjs时，../../../dist及../../../research转../../；test复制至tests/deployed-4608-skills.test.cjs时，只把./4608-battle.cjs改./helpers/4608-battle.cjs，无其它外部snapshot require。
- 新问题仅001741多事件及实际参与红伤护盾先后；002929窗口/伤害类型/等量基数；0031327护盾基数。questions.draft.json含完整原始来源。004因混淆普通盾/护罩的夹具而撤销，从未追加用户MD。保留diagnostic两日志与勘误，不把现代码对照叫用户确认。
- 1924精确沿Q-N50-4521-002，crossref4599-005；真实used监听覆盖MISS/整招无效，控制未用不触发。先真实回血，只有实际!=500附伤口径诊断；明确政策输入覆盖禁疗/半回复/cap/满血。
- 741普通单次300/301、持续/到期、同判大伤、明确event/round、普通盾前后载荷均验证；真实小伤累计分歧和普通盾消费分歧自然保护001，仅source marker有效，ignoreShield/rage不误拦；不把仅护罩算参与红伤盾。
- 929自然从未受到伤害的共同0完成；正量类型/窗口仍002，qualifiedFeedback输入amount/type/healAmount仅明确载荷，不冒称来源自动选择。
- 1327自然低于300的比例伤害与理论回复全做（含红伤先击败明确载荷、免粉、禁疗/倍率/cap、低敌HP），盾只各候选都同量时自动授，否则完成伤害/回血后003保护；旧3532/3568/4125理论盾授权保持原scope不扩大。
- 公共006：新191反弹与次数免异/特定已有来源共存、191与1204真实重复授予、972已有次数再授/已知异源同值覆盖、741阈值免疫与972次数同时满足时消费。普通首次/消费/到期仍完成。
- 1813真实组合已含839实际maxHP9200→2300理论回复，485/1127敌高HP防清/防吸、真实红伤使其跌到自身下方立即失去保护，1497双方普通盾+cap且护罩不计。
- 历史：v1 35/30p5f，v2 36/35p1f，v3 39/39。legacy注册覆盖、冻结registry夹具、盾/罩分类夹具、不同round/rng伤害基准原因及修复全存PRIVATE-FAILURE-HISTORY.json；未删日志/弱化正确断言。最多两种有依据方案，无第四次连续试错。
- 旧1327最小必要回归路径已确认存在：tests/deployed-3532.test.cjs、deployed-3568.test.cjs、deployed-4125.test.cjs、effect-registry.test.cjs；由main生产整合后单进程必要回归。未宣称私有跑过这些路径。
- 本轮不读取、不处理liveMD新增答案，不写任何共享文件，不外查，不启动后台任务。
