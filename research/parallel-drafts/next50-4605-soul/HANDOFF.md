# 4605 无限·欧根尼克魂印1810交接

冻结魂印1810/61bf371a，eid2203[1,5,10,1,60,30,1]。raw、非空当前analyze、历史formatted与Wiki1810 rev320345同义。factor2400340/209ab312只是兑换消耗与当前pet/skill37136/soul1810引用，不产生新战斗版本，完整字段见source-audit.json。

生产只需range-souls.production-fragment.js；没有公共补丁、没有新资源机制。冻结完整接口frozen-soul1810-v1.cjs可供skills组合测试。souls.production-edits.json为空，勿创建多余入口。

每开始回合攻击技能威力+5，真实第1轮+5、第10轮+50；全技先制floor(round/10)。仅普通技能基础伤害吃威力，真实typed附伤不吃这项。roundStart冻结无正/无负六项等级、HP严格低/高；行动中变化不反复重判，次回合重新评估。

无自身正等级使本轮自身技能把敌正等级视负，普通红伤已验证同敌负等级，敌真实原等级保持。实际清强/吸强/35计数与虚拟视图范围仍4605-001，skills处理source-bound分歧保护；本魂印registry也明确partial/unimplemented，不据代码默认行为视为用户答案。

无下降且低HP时本轮受到fixed/percent乘0.4；无下降且高HP时本轮输出fixed/percent乘1.3。复用beforeIncomingDamage和既有pinkDamageMultiplier，完整无视减伤沿现有0/1管线，不凭想象部分比例新增问题。真实伤害、直接失HP、普通红伤均不受该增减；输出实际增伤与理论回复基数分别处理。

私有tests-v1.log：node --test --test-concurrency=1，真实24/24pass、exit0，无活动进程。此前口头预估25有误，以真实node统计24为准。24个逐字test名与sha256见source-audit.json、FREEZE.json。全部含真实状态断言，无纯结构/纯throws完成证据。

覆盖真实20轮第9/10/19/20、未行动仍累加威力、普通物/特攻、view敌正防与自身正/负/混合门槛、双向HP/等级快照与相等边界、fixed/percent/true/direct、盾、死亡完整伤害/HP减少、固定吸取与最大HP比例附伤理论回复、禁疗/免疫、B方真实1810初始化、typed第1/10轮不吃基础威力。

没有多宠延期。本子代理没有写共享文件、联网、读取或处理live MD新答案、运行整库/正式验证器。尚须主代理生产整合和按修改后真实字节验证，私有日志不代替主线通过。
