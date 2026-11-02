# 4474 隔离草稿交接（未正式合入、部署或验收）

实核seer_id第215行=4474，固定50内。唯一工作目录 `research/parallel-drafts/4474/`。未写正式dist/data/tests/共享缓存/审核/问答MD/进度/STATUS；未外部HTTP、Git、全库、validator、后台或新代理，未处理4477。

## 真实来源与明确回答

`source-audit.json`保存17技能每个hash/revision、有序实例/参数/效果revision、sourceFlags、魂印与44条原审核。每个技能已逐一和`research/4474-source-manifest.json`原API记录核对hash与有序实例；源内部conflicts=[]。pet4474/33e773bc；魂印1683/9a471d8c/eid2067/[1,100,100,1]；17技能、一个真实第五36423/567f961f，没有自身强化或追加第五遗漏。

`answer-evidence.json`保存确认manifest来源SHA256和完整两节原文：

- Q4474-001“对手”：对手技能使用者的六项能力全部为正时，妤玫闪避；不能误看自身六项全正。
- Q4474-002“前者”：自身六项全正时，在实际使用技能入口立即清除对手正级，包含MISS/整体无效；不等到成功命中，不对控制未用/无合法PP/药剂触发。

原描述/格式化矛盾和用户回答仍分别保存，不修改API hash或原参数，不把确认冒称API内容。

## 唯一正式代码补丁建议

`changes.json`只有一处 `dist/range-souls.js` 1683 registry的唯一锚点替换，保留原before、after、基准hash/最新唯一命中。`overlay.cjs`内存载入最终补丁，未落正式dist。

- 回合开始双方全属性+1及敌有正级时本回合攻击2倍快照保留原实现。
- beforeSkillDodge只用 `allSixBoosted(c.t)`，仍遵守公共alwaysHit/必中路径。
- beforeUse只用 `allSixBoosted(c.a)` 决定清敌强。该入口在控制/PP实际使用之后、整招无效/MISS判断之前；魂印来源清强不受技能命中载荷封锁或攻击伤害免疫撤回。
- 移除旧partial/unimplemented、双主语guard、pendingYumeiMissClear和原beforeSkillHit重复清强，避免同次使用重复判定/清除。

无新增公共机制或精确参数兼容。正式公共文件继续变化，主代理整合前需重新核唯一锚点，不能覆盖整文件。

## 候选数据及范围排除

`candidate-snapshot.json`保留全部原hash、原17技能/实例/sourceFlags/魂印参数。仅将11332/f5bd9dfa原遗留的atk_num多目标延期标签移出候选deferredEffects，真实sourceTargetCount=4不改。

原44审核中的`4474:move:11332`已经明确为single，并逐字记录“已授权11332/f5bd9dfa/atk_num4按全局忽略范围只当前普通攻击，不当新延期”。因此这只是落实已有明确范围排除；不是新兼容授权、不是删掉真实队伍分支。原`MULTI-PET-TODO.json`仍有`4474:move:11332`遗留条目，主代理正式保存时应核对移为用户已排除记录，不能继续伪称真实多精灵延期。当前本只没有其他真正多精灵分支。

## 隔离真实状态结果

分别执行，未为凑日志额外重复旧随机循环：

1. `node --test research/parallel-drafts/4474/independent-tests.draft.cjs`：**18/18，exit0**，`independent-v1.log`。保留旧1694端点1400seed及1129概率原真实HP测试，约109秒；没有减少测试循环或断言。
2. `node --test research/parallel-drafts/4474/state-tests.draft.cjs`：**9/9，exit0**，`state-v2.log`。

合计27个不同测试；不是两次整库，没有npm或正式validator。

新增状态覆盖：双方四种全强组合及0/负级缺口、敌攻击/属性闪避和PP消耗、必中穿过、自身实际使用清强的普通/强制MISS/失明/整招无效/命中载荷封锁/伤害免疫、控制/无PP/药剂不触发、强化保护与敌负级保留、出手前自身被降至0的动态判定、清强确在真实伤害计算前、回合开始翻倍快照不重算、双方真实1683同时在场时身份/顺序及实际HP、全部17真实技能配招编译初始化执行与11332只攻击当前一次。

`state-v1.log`真实失败保留：新测试错误手写10250基础PP35（真实来源40）；修为读取原来源PP再断言耗1，未改生产代码或弱化行为预期。原独立测试全文保存在`independent-tests.original.cjs`；只将已答后旧guard/pending断言换为真实已确认状态，原其余断言不变。

## 主代理正式整合

将候选真实数据正式部署、合入对应tests并重绑44条审核引用，特别原第3/4项魂印测试名称与旧pending引用需更新。单只本地搜索/加载/配招/版本/初始化正式检查、完整npm及validator仍由主代理按正式队列执行。source-audit与RESULTS都明确accepted=false；不能把隔离27项通过当作正式验收。

本改动只1683当前唯一真实来源，无额外旧目标重新认证依赖。无新语义问题、无外部资料请求，无活动进程。
