# 4468 隔离草稿交接（未正式合入、部署或验收）

队列实核 `seer_id.txt` 第213行=4468，固定50内。仅 `research/parallel-drafts/4468/` 存放交付。未改正式dist/data/tests/审核/缓存/MD进度或STATUS；未HTTP/API/Wiki、Git、后台、全库测试、validator；未处理4472。

## 来源和已答精确边界

`source-audit.json` 保存17技能每个原hash、原索引、有序参数、原描述/效果revision、魂印及49条既有审核原文。已和 `4468-source-manifest.json` 每条API技能记录核对hash与原实例完全相同。pet4468/80f1440f；魂印1678/7b65acca/eid2057/[11,37,221,1,221,1]；一真实第五36392/24e29745，没有伙伴/强化额外版本遗漏。

`answer-evidence.json` 逐字保存确认manifest中的本只五回答及来源文件SHA256/行号：

- Q001“前者”：只将0PP技能回1，已有正PP保持，采用格式化API这一分支；原desc字段冲突及全部原文保留。
- Q002“授权”：仅36391/f88eb61a/i4/1767/d25219b2/[3,37]按零参语义兼容，不能删原两个参数或将授权泛化。
- Q003“授权”：仅36388/1ea5cdc8/atk_num6新增精确适配；当前只攻击目标一次。按用户已有全局排除范围，多目标本身不伪造成多精灵延期。
- Q004“直接废除此技能，无法再次点击”：首次成功1906后从合法技能列表永久排除，即使PP已满或药剂回复也不解除。
- Q005“累计对手六项能力的正等级、每级威力+1、负等级不抵扣且没有额外威力上限”：公共35按atk/def/spa/spd/spe/acc的正等级求和直接加威力，明确覆盖原问列出的旧目标依赖。

## 最小补丁

最终 `changes.json` 含唯一before/after锚点及当前基准hash、命中次数。`overlay.cjs` 仅内存加载这些补丁，不写正式文件。不要运行过程build/update脚本重新生成，避免回退最后的精确原参数拒绝及多目标排除修复。

1. `range-souls.js`：去掉1678已答partial/unimplemented；三玺战阶只遍历0PP改1，不生成旧pending。其他魂印层快照、回复、失去/增加资源、六回君临和到期/击败直接代价沿用已核现有完整代码。
2. `effect-registry.js`：为Q002增加精确sourceParameterConfirmation校验分支，要求skill/hash/revision/provider/index/effect/元数据模板+revision/原描述/原[3,37]和完整确认对象。`candidate-snapshot.json` 只给此真实技能附相同确认对象。
3. `range-effects.js`：1767校验对36391必须严格匹配唯一原tuple，内部按原零参校验，不改实际operations.params/sourceArgs的[3,37]；对其他已存在零参来源沿用原校验。原源码处理器本就不使用这两个冗余数，公共引擎执行时原参数照常保留。
4. `seerapi.cjs`：reviewedTargets仅增36388/1ea5cdc8/6一项；该精确实例不产生atk_num队伍延期。错误hash或目标数仍标未适配，其他旧多目标条目不改。候选真实sourceTargetCount=6保留，只有已答limitations清除。
5. `range-effects.js`：1906首次成功真实清敌回合/盾罩、回满HP/PP、六玺及七回冻结原行为保留；增加现有registry.selectable入口 `!emperorFifthUsed`。正常初始化已有choiceRuleIds分发；UI和resolveTurn都用E.availableMoves，永久无法点击且直接提交亦被拒绝。没有用PP清零代替禁选。
6. 公共35：替换旧“物特对应双攻防×20”为已答六正级之和；移除本36384旧pending throw。原source/effect hash一律不变，用户确认为实现依据，不冒称API提供公式。

## 测试、失败和结果

最终命令：

`node --test research/parallel-drafts/4468/state-tests.draft.cjs research/parallel-drafts/4468/independent-tests.draft.cjs research/parallel-drafts/4468/public-35-old-regressions.draft.cjs`

`combined-v3.log`：**32/32、exit0**。19项原独立状态测试、10项本次确认/接入及旧4184真实状态测试、3项其他必要35旧源回归；不重复累计为多次整库。未执行npm/正式搜索存储/validator，不能标正式验收。

- 真实17个ID逐个配招、编译、初始化及效果执行；第五选择规则由正式初始化绑定，不靠注入fixture假装已接入。
- 三玺0PP/正PP与阈值、221魂印回复和技能禁疗；首次第五成功后PP恢复仍禁选，药剂不解除，非法直接提交无状态变化。
- 第五MISS/失明/整招失效/命中载荷封锁/控制未用不标成功。PP耗尽与技能废除分别断言，不把0PP无法选择误当成功废除。
- 1767原params/sourceArgs/index完整保留，真实HP对比“敌正级视负”且原等级不改；错误hash/revision/index/原参（包括擅改[]）/metadata/确认绑定拒绝，旧零参来源继续可用。
- 36388来源字段6保留，实际仅一段当前目标，错hash/数量拒绝，无伪造队伍延期。
- 35对本36384与旧4184真实13100分别跑零、六项全正、全负、混合正负；同时断言真实damage detail的精确威力、目标实际HP、原PP消耗、输入状态不变。旧3576、4222、4288也按各自正式原source/技能/参数跑相同状态分支。
- `state-v1.log`两失败完整保留：一次把药剂错误加wiki前缀；一次把MISS耗尽1PP后的不可用误预期可用。改为合法药剂ID及显式恢复PP后检查未废除，没有弱化正确语义断言。原测试原文保存在 `independent-tests.original.cjs`。

## 必要旧影响和主整合任务

公共35改变四个既有目标的真实行为：3576/5fe5b341与4184/37fb5618的13100/39d13fa8；4222/23c703ae与4288/f0ede8c0的10930/e27b5c21；均为效果35/94f7d2fb/[]。精确来源和实例见审计文件 `public35Affected`。

以上隔离回归不等于旧目标正式重新认证。主代理应按最终公共代码补入对应正式测试、更新本4468及必要旧目标审核引用，完成必要正式回归/重新认证后使用新的有效日志，尤其旧5语义项中的4184不能继续复用旧公式认证。不要仅把旧35断言删掉；若旧断言坚持旧×20公式，应依据本次已确认新规则重写精确预期及状态证据。

正式公共代码持续变动，先复核每一锚点；候选从当前真实保存源衍生，不覆盖原研究源/原问答。`RESULTS.json` 明确formalAccepted=false、仅隔离通过。主代理统一正式修改、部署和进度记录。

## 真实延期与外部资料

保留魂印1678真实再登场获得2玺/上回合对手主动切换额外2玺、真实离场生命周期；六玺下回合敌不能主动换宠、君临或第五结束后己方下回合不能主动换宠；36389/43dfd047/i1/67[3]真实下一只精灵最大HP减少三分之一。现有自身单精灵混合分支均不延期。

无新的未答语义问题，无额外HTTP请求清单。已完成全部授权草稿工作，当前无活动进程；正式部署验收尚未进行。
