# 3667及公共机制待确认规则 Q&A 清单

本次仅整理规则，3667及后续导入暂停。共有 **49题，5类；公共机制45题，仅3667为4题**。

当前64/69项审核有效，缺失5项。本清单将这5项依赖的规则拆成可回答问题；验证器直接拒绝原因为正式快照未部署，不能把这49题表述成49条验证器报错。答案确认后仍需实现、状态测试、部署与原验证门槛。

所有回答留空。选项只用于精确答题，不是推荐答案或机制事实；无法确认请填“待核实”。用户确认的规则将标为project_rule/user_confirmed，不能伪装为Wiki/API证据。回答清单不自动授权恢复开发。

机器可读清单：[research/user-rule-confirmation-3667.json](C:/Users/villa/Desktop/seer-battle-lab/research/user-rule-confirmation-3667.json)。每题中的来源文件及JSON指针可定位证据；文件SHA256见JSON的sourceManifest。魂印ID、魂印效果eid与技能效果ID分开记录。

| 分类 | 题数 |
|---|---:|
| A. 状态系统 | 22 |
| B. 随机池机制 | 15 |
| C. PP与资源机制 | 6 |
| D. 魂印和技能特殊规则 | 4 |
| E. 属性与伤害规则 | 2 |

## A. 状态系统

### Q001：睡眠默认时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：绝影孤现（17083）、斥天无常（28684）
- 魂印名称：混沌天蛇太祖·原魂印（项目标签），ID 955，hash 78b44dbf；来源未提供独立名称；混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 470、2074；魂印效果eid 1242、2348
- 状态：睡眠
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/7；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:soul:955、3667:soul:1935、3667:skill:17083:0、3667:skill:28684:1

【当前已确认】

- 睡眠：控制类异常状态，该状态下精灵无法行动，对手使用攻击技能且未MISS时解除
- 2074的1–3回合为独立项目规则，不是睡眠的通用默认时长。

【当前代码状态】

- 已实现：无显式时长时公共入口拒绝；旧调用方显式使用实验性的1–3回合。控制与攻击命中解除已有实现。
- 缺少：470、955、1935没有提供睡眠时长，2074的1–3回合不能外推。
- 不能验证完成的原因：470、955、1935没有提供睡眠时长，2074的1–3回合不能外推。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

470、955、1935没有提供睡眠时长，2074的1–3回合不能外推。

【需要用户回答】

**470及两版魂印施加睡眠时，默认时长是固定回合数还是随机回合数？**

回答格式：填写固定整数n，或填写“回合数→概率”表；如三个来源不同，按470、955、1935分别填写。

【用户回答】

和其他异常状态一样，都是1-3回合真随机，一切异常状态的施加如果没有特殊说明，默认1-3回合真随机

### Q002：非2074睡眠重复施加

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：绝影孤现（17083）、斥天无常（28684）
- 魂印名称：混沌天蛇太祖·原魂印（项目标签），ID 955，hash 78b44dbf；来源未提供独立名称；混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 470、2074；魂印效果eid 1242、2348
- 状态：睡眠
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/7；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:soul:955、3667:soul:1935、3667:skill:17083:0、3667:skill:28684:1

【当前已确认】

- 睡眠：控制类异常状态，该状态下精灵无法行动，对手使用攻击技能且未MISS时解除
- 2074的1–3回合为独立项目规则，不是睡眠的通用默认时长。

【当前代码状态】

- 已实现：2074取剩余时长最大值；非2074调用默认直接覆盖旧结束回合。
- 缺少：非2074睡眠重施的覆盖、延长或拒绝策略未确认。
- 不能验证完成的原因：非2074睡眠重施的覆盖、延长或拒绝策略未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

非2074睡眠重施的覆盖、延长或拒绝策略未确认。

【需要用户回答】

**已有睡眠时，再由470、955或1935施加睡眠，应覆盖为新时长、取新旧最大值、累加时长，还是不改变旧状态？**

回答格式：从四种策略选一；如按来源不同，分别选择。

【用户回答】

取新旧最大值，一切异常状态的施加，在没有特殊说明的情况下，若已经处于该异常，则取最大值

### Q003：睡眠与非攻击伤害

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：绝影孤现（17083）、斥天无常（28684）
- 魂印名称：混沌天蛇太祖·原魂印（项目标签），ID 955，hash 78b44dbf；来源未提供独立名称；混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 470、2074；魂印效果eid 1242、2348
- 状态：睡眠
- 文件位置：[research/status-high-frequency-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-high-frequency-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/7；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:soul:955、3667:soul:1935、3667:skill:17083:0、3667:skill:28684:1

【当前已确认】

- 睡眠：控制类异常状态，该状态下精灵无法行动，对手使用攻击技能且未MISS时解除
- 2074的1–3回合为独立项目规则，不是睡眠的通用默认时长。

【当前代码状态】

- 已实现：当前只在对手攻击未MISS时唤醒；中毒、混乱等伤害不会唤醒。
- 缺少：审核保留其它伤害是否解除睡眠的证据缺口。
- 不能验证完成的原因：审核保留其它伤害是否解除睡眠的证据缺口。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

审核保留其它伤害是否解除睡眠的证据缺口。

【需要用户回答】

**睡眠受到异常扣血、技能附加固定/百分比伤害、反弹伤害或真实伤害时，是否解除？**

回答格式：按四类分别填写“解除/不解除”；此处只问没有攻击命中事件的伤害。

【用户回答】

不解除

### Q004：睡眠解除后的行动机会

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：绝影孤现（17083）、斥天无常（28684）
- 魂印名称：混沌天蛇太祖·原魂印（项目标签），ID 955，hash 78b44dbf；来源未提供独立名称；混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 470、2074；魂印效果eid 1242、2348
- 状态：睡眠
- 文件位置：[research/status-high-frequency-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-high-frequency-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/7；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:soul:955、3667:soul:1935、3667:skill:17083:0、3667:skill:28684:1

【当前已确认】

- 睡眠：控制类异常状态，该状态下精灵无法行动，对手使用攻击技能且未MISS时解除
- 2074的1–3回合为独立项目规则，不是睡眠的通用默认时长。

【当前代码状态】

- 已实现：行动排序固定；因睡眠已跳过行动后，后手攻击唤醒不会补行动。
- 缺少：错过行动机会后是否补行动尚未确认。
- 不能验证完成的原因：错过行动机会后是否补行动尚未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

错过行动机会后是否补行动尚未确认。

【需要用户回答】

**先手精灵因睡眠跳过行动，随后被后手攻击唤醒，本回合是否补执行原选技能？**

回答格式：是/否。

【用户回答】

否

### Q005：衰弱倍率档位依据

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：衰弱
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/10；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 衰弱：弱化类异常状态，该状态下精灵若衰弱的回合数为1/2/3/4/5及以上，则受到的攻击伤害额外提升25%/50%/100%/250%/500%

【当前代码状态】

- 已实现：公共施加和计时已接入，未应用衰弱的增伤档位。
- 缺少：原文“衰弱的回合数”未说明指剩余、初始还是累计已持续时间。
- 不能验证完成的原因：原文“衰弱的回合数”未说明指剩余、初始还是累计已持续时间。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

原文“衰弱的回合数”未说明指剩余、初始还是累计已持续时间。

【需要用户回答】

**衰弱25%/50%/100%/250%/500%的档位，按当前剩余回合、这次施加的初始时长，还是已持续回合确定？**

回答格式：三选一；如为已持续回合，注明施加当回合记0还是1。

【用户回答】

固定刷新为3回合，当回合记1

### Q006：山神守护完整行为证据

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：山神守护
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/11；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- API枚举包含状态ID12；2074项目规则仍保留该候选。没有该状态行为原文。

【当前代码状态】

- 已实现：只支持公共施加、计时、免疫和清除；没有独立战斗行为。
- 缺少：数据库只有API枚举名，连原始行为描述都缺失，不能通过名称编造候选答案。
- 不能验证完成的原因：数据库只有API枚举名，连原始行为描述都缺失，不能通过名称编造候选答案。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

数据库只有API枚举名，连原始行为描述都缺失，不能通过名称编造候选答案。

【需要用户回答】

**是否能提供山神守护在当前页游对战中的完整原始词条或逐项实测规则？**

回答格式：有/无；选“有”时粘贴原文或实测的触发条件、目标、数值、时点、结束行为；选“无”则保持阻塞，不按无效果处理。

【用户回答】

山神守护为pve中boss专属异常状态，pvp对局中该异常不会出现

### Q007：砥砺：概率失败是否算执行

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：砥砺
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/33；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 砥砺：附属类异常状态，处于该状态的精灵受到真实伤害后若本回合未执行过附加异常状态的效果则增加此伤害值80%的体力

【当前代码状态】

- 已实现：未发放80%恢复；尚无覆盖所有附加异常路径的公共执行记录。
- 缺少：“执行过附加异常状态的效果”是否包括进入效果但概率判定失败，原文未界定。
- 不能验证完成的原因：“执行过附加异常状态的效果”是否包括进入效果但概率判定失败，原文未界定。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

“执行过附加异常状态的效果”是否包括进入效果但概率判定失败，原文未界定。

【需要用户回答】

**本回合进入了附加异常效果的判定，但随机概率未通过，是否算砥砺条件中的“执行过”？**

回答格式：是/否；此题只判定规则，不把缺少事件追踪当作需要用户开发。

【用户回答】

是

### Q008：砥砺：免疫失败是否算执行

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：砥砺
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/33；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 砥砺：附属类异常状态，处于该状态的精灵受到真实伤害后若本回合未执行过附加异常状态的效果则增加此伤害值80%的体力

【当前代码状态】

- 已实现：通用施加已有免疫结果，但砥砺未消费这些事件。
- 缺少：附加异常的概率通过后被免疫或抗性挡住，是否满足执行记录条件未明确。
- 不能验证完成的原因：附加异常的概率通过后被免疫或抗性挡住，是否满足执行记录条件未明确。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

附加异常的概率通过后被免疫或抗性挡住，是否满足执行记录条件未明确。

【需要用户回答】

**附加异常已经尝试施加但被免疫或抗性阻止，是否算砥砺条件中的“执行过”？**

回答格式：是/否；如免疫和抗性不同，分别回答。

【用户回答】

是

### Q009：冰封转冻伤的时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：冰封、冻伤
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/14；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/4；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 冰封：控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤、速度等级-1
- 冻伤：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力

【当前代码状态】

- 已实现：冰封控制与到期速度-1已实现；转冻伤仅产生待核实记录。
- 缺少：转化后的冻伤持续时长缺失。
- 不能验证完成的原因：转化后的冻伤持续时长缺失。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

转化后的冻伤持续时长缺失。

【需要用户回答】

**冰封结束所转化的冻伤持续多少回合？**

回答格式：固定正整数，或各回合数及对应概率。

【用户回答】

2

### Q010：易燃转烧伤的时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：易燃、烧伤
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/12；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/2；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 易燃：弱化类异常状态，该状态下精灵攻击技能命中率降低30%，受到火系攻击后转化为烧伤
- 烧伤：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力，而且攻击技能的威力会减少50%

【当前代码状态】

- 已实现：易燃降低攻击命中；火攻击触发转化待核实记录，未实际施加烧伤。
- 缺少：该转化的烧伤时长缺失，不能套用2074抽出的易燃时长。
- 不能验证完成的原因：该转化的烧伤时长缺失，不能套用2074抽出的易燃时长。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

该转化的烧伤时长缺失，不能套用2074抽出的易燃时长。

【需要用户回答】

**易燃受到火系攻击后转化的烧伤持续多少回合？**

回答格式：固定正整数，或各回合数及对应概率。

【用户回答】

2

### Q011：易燃与双属性火攻击

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：易燃
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/12；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 易燃：弱化类异常状态，该状态下精灵攻击技能命中率降低30%，受到火系攻击后转化为烧伤

【当前代码状态】

- 已实现：目前只有技能属性名称恰为“火”时登记转化待核实；含火组合未判断为火攻击。
- 缺少：含火的双属性技能是否满足“火系攻击”未确认。
- 不能验证完成的原因：含火的双属性技能是否满足“火系攻击”未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

含火的双属性技能是否满足“火系攻击”未确认。

【需要用户回答】

**含火成分的双属性攻击技能命中易燃目标，是否触发转烧伤？**

回答格式：是/否；主属性火与副属性火如有差别，分别回答。

【用户回答】

否

### Q012：焚烬转烧伤的时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：焚烬、烧伤
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/18；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/2；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 焚烬：控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤、命中等级-1
- 烧伤：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力，而且攻击技能的威力会减少50%

【当前代码状态】

- 已实现：旧到期分支降低命中并传入烧伤2回合；该2不是本表证实的参数。
- 缺少：烧伤的实际转化时长缺失。
- 不能验证完成的原因：烧伤的实际转化时长缺失。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

烧伤的实际转化时长缺失。

【需要用户回答】

**焚烬结束转化的烧伤持续多少回合？**

回答格式：固定正整数，或各回合数及对应概率；不把当前硬编码2视为已确认。

【用户回答】

2

### Q013：感染转中毒的时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：感染、中毒
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/23；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/1；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 感染：控制类异常状态，该状态下精灵无法行动，感染结束后会转化为中毒、攻击、特攻等级-1
- 中毒：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力

【当前代码状态】

- 已实现：旧到期分支降低双攻并写入后续2回合中毒。
- 缺少：中毒的实际转化时长缺失。
- 不能验证完成的原因：中毒的实际转化时长缺失。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

中毒的实际转化时长缺失。

【需要用户回答】

**感染结束转化的中毒持续多少回合？**

回答格式：固定正整数，或各回合数及对应概率。

【用户回答】

2

### Q014：神游转失神的时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：神游、失神
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/35；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/25；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 神游：控制类异常状态，该状态下精灵无法行动，神游结束后会转化为失神
- 失神：弱化类异常状态，该状态下精灵使用属性技能50%无效

【当前代码状态】

- 已实现：神游到期调用公共失神施加，时长沿用实验回退；失神50%属性技能失效已实现。
- 缺少：失神转化时长缺失。
- 不能验证完成的原因：失神转化时长缺失。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

失神转化时长缺失。

【需要用户回答】

**神游结束转化的失神持续多少回合？**

回答格式：固定正整数，或各回合数及对应概率。

【用户回答】

2

### Q015：诅咒转化后的时长

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：诅咒、烈焰诅咒、致命诅咒、虚弱诅咒
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/19；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/20；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/21；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/22；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 诅咒：控制类异常状态，该状态下精灵无法行动，诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个
- 烈焰诅咒：弱化类异常状态，该状态下每回合受到最大体力1/8的百分比伤害
- 致命诅咒：弱化类异常状态，该状态下受到的攻击伤害提升50%
- 虚弱诅咒：弱化类异常状态，该状态下造成的攻击伤害降低50%

【当前代码状态】

- 已实现：旧分支选中一种诅咒后写后续2回合，缺乏该时长依据。
- 缺少：三个目标状态的转化时长未确认；目标名单已知，不重复询问。
- 不能验证完成的原因：三个目标状态的转化时长未确认；目标名单已知，不重复询问。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

三个目标状态的转化时长未确认；目标名单已知，不重复询问。

【需要用户回答】

**诅咒结束转成烈焰诅咒、致命诅咒、虚弱诅咒后，各持续多少回合？**

回答格式：三个目标逐项填写固定整数或时长概率表；可明确填写“三者相同”。

【用户回答】

三者相同，均为2

### Q016：主动清除是否触发结束转化

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：冰封、焚烬、感染、诅咒、神游、渐冻、超频、空定
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/14；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/18；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/23；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/19；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/35；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/39；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/31；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/36；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 冰封：控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤、速度等级-1
- 焚烬：控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤、命中等级-1
- 感染：控制类异常状态，该状态下精灵无法行动，感染结束后会转化为中毒、攻击、特攻等级-1
- 诅咒：控制类异常状态，该状态下精灵无法行动，诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个
- 神游：控制类异常状态，该状态下精灵无法行动，神游结束后会转化为失神
- 渐冻：附属类异常状态，渐冻结束后会转化为3回合冰封
- 超频：附属类异常状态，该状态下精灵的技能先制+1且行动开始时恢复所选择技能的全部PP值，超频结束后会转化为1~2回合的瘫痪
- 空定：控制类异常状态，该状态下精灵无法行动，空定结束后会转化为2回合沉默

【当前代码状态】

- 已实现：冰封等旧转化只在自然到期分支；超频、空定的公共清除也登记待核实转化。
- 缺少：原文“结束后”对主动清除的适用范围未确认，现有路径不一致。
- 不能验证完成的原因：原文“结束后”对主动清除的适用范围未确认，现有路径不一致。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

原文“结束后”对主动清除的适用范围未确认，现有路径不一致。

【需要用户回答】

**主动清除这些状态时，是否也执行其结束转化及伴随能力下降？**

回答格式：逐状态填写“仅自然到期/主动清除也执行”；若转化和能力下降不同，分别填写。

【用户回答】

主动清除不转化，不执行能力下降

### Q017：转化是否重新检查免疫

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：冰封、焚烬、感染、诅咒、神游、渐冻、超频、空定、易燃
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/14；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/18；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/23；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/19；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/35；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/39；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/31；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/36；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/12；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 冰封：控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤、速度等级-1
- 焚烬：控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤、命中等级-1
- 感染：控制类异常状态，该状态下精灵无法行动，感染结束后会转化为中毒、攻击、特攻等级-1
- 诅咒：控制类异常状态，该状态下精灵无法行动，诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个
- 神游：控制类异常状态，该状态下精灵无法行动，神游结束后会转化为失神
- 渐冻：附属类异常状态，渐冻结束后会转化为3回合冰封
- 超频：附属类异常状态，该状态下精灵的技能先制+1且行动开始时恢复所选择技能的全部PP值，超频结束后会转化为1~2回合的瘫痪
- 空定：控制类异常状态，该状态下精灵无法行动，空定结束后会转化为2回合沉默
- 易燃：弱化类异常状态，该状态下精灵攻击技能命中率降低30%，受到火系攻击后转化为烧伤

【当前代码状态】

- 已实现：部分转化暂挂起；旧分支有直接写状态和重新调用免疫门禁两种路径。
- 缺少：转化后的新状态是否受当时异常免疫、次数免疫、抗性、反弹影响未确认。
- 不能验证完成的原因：转化后的新状态是否受当时异常免疫、次数免疫、抗性、反弹影响未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

转化后的新状态是否受当时异常免疫、次数免疫、抗性、反弹影响未确认。

【需要用户回答】

**状态转化时，新状态是否重新检查异常免疫、次数免疫、抗性和反弹？**

回答格式：按四项分别填“检查/绕过”；若不同转化规则不同，按上述九种来源状态逐行填写。

【用户回答】

全部绕过

### Q018：回合末转化的计时起点

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：冰封、焚烬、感染、诅咒、神游、渐冻、超频、空定
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/14；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/18；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/23；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/19；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/35；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/39；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/31；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/36；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 冰封：控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤、速度等级-1
- 焚烬：控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤、命中等级-1
- 感染：控制类异常状态，该状态下精灵无法行动，感染结束后会转化为中毒、攻击、特攻等级-1
- 诅咒：控制类异常状态，该状态下精灵无法行动，诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个
- 神游：控制类异常状态，该状态下精灵无法行动，神游结束后会转化为失神
- 渐冻：附属类异常状态，渐冻结束后会转化为3回合冰封
- 超频：附属类异常状态，该状态下精灵的技能先制+1且行动开始时恢复所选择技能的全部PP值，超频结束后会转化为1~2回合的瘫痪
- 空定：控制类异常状态，该状态下精灵无法行动，空定结束后会转化为2回合沉默

【当前代码状态】

- 已实现：公共施加用当前回合+n-1；旧部分转化直接写后续回合，二者不能自动视为同一时序。
- 缺少：自然到期发生在回合末时，新状态是否从下一回合起完整计算n回合未确认。
- 不能验证完成的原因：自然到期发生在回合末时，新状态是否从下一回合起完整计算n回合未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

自然到期发生在回合末时，新状态是否从下一回合起完整计算n回合未确认。

【需要用户回答】

**回合末转化为n回合新状态时，n是否从下一回合开始完整计算？**

回答格式：是/否；选否时选择“转化当前回合计第1回合”。

【用户回答】

是

### Q019：转化撞上已有同名状态

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：冰封、焚烬、感染、诅咒、神游、渐冻、超频、空定、易燃
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/14；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/18；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/23；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/19；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/35；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/39；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/31；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/36；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/12；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 冰封：控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤、速度等级-1
- 焚烬：控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤、命中等级-1
- 感染：控制类异常状态，该状态下精灵无法行动，感染结束后会转化为中毒、攻击、特攻等级-1
- 诅咒：控制类异常状态，该状态下精灵无法行动，诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个
- 神游：控制类异常状态，该状态下精灵无法行动，神游结束后会转化为失神
- 渐冻：附属类异常状态，渐冻结束后会转化为3回合冰封
- 超频：附属类异常状态，该状态下精灵的技能先制+1且行动开始时恢复所选择技能的全部PP值，超频结束后会转化为1~2回合的瘫痪
- 空定：控制类异常状态，该状态下精灵无法行动，空定结束后会转化为2回合沉默
- 易燃：弱化类异常状态，该状态下精灵攻击技能命中率降低30%，受到火系攻击后转化为烧伤

【当前代码状态】

- 已实现：2074原始附加使用max；转化分支不自动继承2074策略，旧路径多为覆盖。
- 缺少：转化目标已存在时的时长合并与叠层规则缺失。
- 不能验证完成的原因：转化目标已存在时的时长合并与叠层规则缺失。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

转化目标已存在时的时长合并与叠层规则缺失。

【需要用户回答】

**转化目标状态已存在时，是新时长覆盖、取最大值、累加时长，还是保留旧状态？**

回答格式：四选一；不同转化如有区别逐项列出。

【用户回答】

取最大值

### Q020：星赎与自然到期的先后

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：星赎
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/34；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 星赎：附属类异常状态，该状态下的精灵体力恢复效果提升30%，每回合结束时所有非限制类异常状态的回合数+1

【当前代码状态】

- 已实现：当前回合末先延长自身非限制状态，再清理到期状态，因此剩余1回合的星赎也可延长自身。
- 缺少：与当回合自然到期的精确先后尚未来源认证。
- 不能验证完成的原因：与当回合自然到期的精确先后尚未来源认证。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

与当回合自然到期的精确先后尚未来源认证。

【需要用户回答】

**同一回合末，星赎的异常回合数+1是否先于所有异常自然到期处理？**

回答格式：是/否；选否时明确“先到期再延长仍存续状态”。

【用户回答】

是

### Q021：周期异常扣血的时点

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：中毒、烧伤、冻伤、寄生、流血、烈焰诅咒、沉默
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/1；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/2；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/4；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/3；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/15；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/20；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/26；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 中毒：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力
- 烧伤：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力，而且攻击技能的威力会减少50%
- 冻伤：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力
- 寄生：弱化类异常状态，该状态下每回合都会扣除等同于最大体力的1/8的体力，同时对手会恢复扣除量的体力
- 流血：弱化类异常状态，该状态下每回合都会扣除80点体力
- 烈焰诅咒：弱化类异常状态，该状态下每回合受到最大体力1/8的百分比伤害
- 沉默：弱化类异常状态，该状态下每回合受到最大体力1/8的百分比伤害，且第五技能无效

【当前代码状态】

- 已实现：中毒等在回合末扣血；流血旧代码在对手用招时扣80，不能把此差异当作已确认规则。
- 缺少：“每回合扣血”没有给出统一精确时点，流血还涉及对手不行动时是否扣血。
- 不能验证完成的原因：“每回合扣血”没有给出统一精确时点，流血还涉及对手不行动时是否扣血。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

“每回合扣血”没有给出统一精确时点，流血还涉及对手不行动时是否扣血。

【需要用户回答】

**这些周期异常分别在哪个时点结算一次伤害？**

回答格式：每种状态选择“回合开始/自身行动前/自身行动后/对手行动前/对手行动后/回合结束”；选择行动时点者注明未行动时“仍结算/不结算”。

【用户回答】

回合结束时

### Q022：混乱扣血判定时点

【分类】

状态机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：混乱
- 文件位置：[research/status-high-frequency-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-high-frequency-review.json)；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/9；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第15行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第85行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 混乱：弱化类异常状态，该状态下每回合都会有5%的概率扣除50点体力，而且攻击技能的命中率减少80%

【当前代码状态】

- 已实现：当前在回合末进行5%扣50点判定。
- 缺少：来源给出每回合概率与数值，但没有精确判定时点。
- 不能验证完成的原因：来源给出每回合概率与数值，但没有精确判定时点。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

来源给出每回合概率与数值，但没有精确判定时点。

【需要用户回答】

**混乱每回合5%的扣血判定，是回合开始、行动前、行动后，还是回合结束？**

回答格式：四选一；若按行动，补选受控制未行动时“仍判定/不判定”。

【用户回答】

回合结束

## B. 随机池机制

### Q023：2074同次是否允许重复

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 文件位置：[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /projectRule；[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /execution；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 已由用户确认：全部异常状态排除瘫痪、凝滞，当前39项；候选等概率；1–3回合；同名时长取最大值。
- 用户确认不等于所有附加的implementation_decision均已获确认。

【当前代码状态】

- 已实现：一次在完整39候选中无放回抽N种；跨次可抽中已有状态。
- 缺少：无放回属于implementation_decision，非用户原文明确确认。
- 不能验证完成的原因：无放回属于implementation_decision，非用户原文明确确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

无放回属于implementation_decision，非用户原文明确确认。

【需要用户回答】

**2074一次附加2种异常时，两次抽样是否必须得到不同状态？**

回答格式：必须不同/允许重复。

【用户回答】

必须不同

### Q024：2074免疫失败是否补抽

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 文件位置：[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /projectRule；[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /execution；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 已由用户确认：全部异常状态排除瘫痪、凝滞，当前39项；候选等概率；1–3回合；同名时长取最大值。
- 用户确认不等于所有附加的implementation_decision均已获确认。

【当前代码状态】

- 已实现：当前某项被免疫或抗性阻止后不补抽；其余项继续施加。
- 缺少：失败不补抽仅为实现约定。
- 不能验证完成的原因：失败不补抽仅为实现约定。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

失败不补抽仅为实现约定。

【需要用户回答】

**2074抽中的状态被免疫或抗性阻止后，是否重新抽取直到成功附加要求的种数？**

回答格式：不补抽/补抽；如补抽，填写最大尝试次数或“剩余候选全部失败即停止”。

【用户回答】

不补抽

### Q025：2074计时是否包含施加回合

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 文件位置：[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /projectRule；[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /execution；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 已由用户确认：全部异常状态排除瘫痪、凝滞，当前39项；候选等概率；1–3回合；同名时长取最大值。
- 用户确认不等于所有附加的implementation_decision均已获确认。

【当前代码状态】

- 已实现：已确认每项1–3回合；当前结束回合=currentRound+n-1。
- 缺少：包含施加当前回合在执行说明中标为引擎时长约定，并非用户确认原文。
- 不能验证完成的原因：包含施加当前回合在执行说明中标为引擎时长约定，并非用户确认原文。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

包含施加当前回合在执行说明中标为引擎时长约定，并非用户确认原文。

【需要用户回答】

**2074抽到1回合异常并在后手施加时，是否仍在本回合结束解除？**

回答格式：是/否；选否时选择“至少持续至下一回合结束”或填写明确结束回合偏移。

【用户回答】

是

### Q026：2074各项时长是否独立

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 文件位置：[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /projectRule；[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /execution；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 已由用户确认：全部异常状态排除瘫痪、凝滞，当前39项；候选等概率；1–3回合；同名时长取最大值。
- 用户确认不等于所有附加的implementation_decision均已获确认。

【当前代码状态】

- 已实现：当前每个选中状态独立等概率抽取1/2/3回合。
- 缺少：1–3回合及等概率已确认，但同一次两种状态是否共享一次时长抽样未明确。
- 不能验证完成的原因：1–3回合及等概率已确认，但同一次两种状态是否共享一次时长抽样未明确。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

1–3回合及等概率已确认，但同一次两种状态是否共享一次时长抽样未明确。

【需要用户回答】

**2074一次附加2种状态时，各自独立抽持续时间，还是共用一次1–3回合结果？**

回答格式：独立抽样/共用一次结果。

【用户回答】

独立

### Q027：2074多状态施加顺序

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 文件位置：[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /projectRule；[research/effect-2074-report.json](C:/Users/villa/Desktop/seer-battle-lab/research/effect-2074-report.json)，JSON指针 /execution；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 已由用户确认：全部异常状态排除瘫痪、凝滞，当前39项；候选等概率；1–3回合；同名时长取最大值。
- 用户确认不等于所有附加的implementation_decision均已获确认。

【当前代码状态】

- 已实现：先抽出全部状态和时长，再按抽中顺序逐项经过免疫门禁。
- 缺少：顺序会决定一次免疫被哪种状态消耗；目前顺序只属实现决定。
- 不能验证完成的原因：顺序会决定一次免疫被哪种状态消耗；目前顺序只属实现决定。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

顺序会决定一次免疫被哪种状态消耗；目前顺序只属实现决定。

【需要用户回答】

**2074一次抽到多种状态后，按抽中顺序逐项施加，还是按固定状态顺序施加？**

回答格式：抽中顺序/固定顺序/同时判定；后两者分别补充排序列表或一次免疫作用于“单项/整次”。

【用户回答】

按抽中顺序

### Q028：1348候选池

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：公共配置candidatePool=null，新公共抽样接口拒绝执行；旧路径保留六状态实验池。
- 缺少：未确认1348与2074的池关系，不能由相似措辞推导。
- 不能验证完成的原因：未确认1348与2074的池关系，不能由相似措辞推导。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

未确认1348与2074的池关系，不能由相似措辞推导。

【需要用户回答】

**1348是否使用与2074完全相同的39项候选池？**

回答格式：是/否；选否时填写1348完整候选状态ID或名称列表，不用“等异常”省略。

【用户回答】

是

### Q029：1348候选权重

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：distribution=null；旧六状态路径均匀抽样不是来源证据。
- 缺少：1348各候选是否等概率未确认。
- 不能验证完成的原因：1348各候选是否等概率未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

1348各候选是否等概率未确认。

【需要用户回答】

**1348候选池内各状态是否等概率？**

回答格式：是/否；选否时按确认后的候选逐项填写权重。

前置问题：Q028

【用户回答】

是

### Q030：1348附加异常的持续时间

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：duration=null；旧路径使用公共实验1–3回合。技能的3回合是反应窗口。
- 缺少：反应窗口不等于每种异常持续时长，且不能复用2074时长结论。
- 不能验证完成的原因：反应窗口不等于每种异常持续时长，且不能复用2074时长结论。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

反应窗口不等于每种异常持续时长，且不能复用2074时长结论。

【需要用户回答】

**1348每次实际附加的异常持续几回合？**

回答格式：固定整数，或“回合数→概率”表；若按状态不同逐项填，若随机两项共用时长也须标明“共享/独立”。

前置问题：Q028

【用户回答】

1-3回合真随机

### Q031：1348同次抽取是否去重

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：旧六状态路径无放回选择2种，新配置未认证此策略。
- 缺少：原文“2种”未附具体抽样算法。
- 不能验证完成的原因：原文“2种”未附具体抽样算法。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

原文“2种”未附具体抽样算法。

【需要用户回答】

**1348一次附加2种异常是否必须不同？**

回答格式：必须不同/允许重复。

前置问题：Q028

【用户回答】

必须，以后每一种有关“随机附加异常”的词条，若没有特殊说明，都与这次我回答的一样

### Q032：1348是否排除已有状态

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：旧路径不会从候选中排除目标已存在的状态。
- 缺少：已有状态过滤规则未确认。
- 不能验证完成的原因：已有状态过滤规则未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

已有状态过滤规则未确认。

【需要用户回答】

**1348抽样前是否剔除目标当前已经具有的异常状态？**

回答格式：剔除/不剔除；若剔除后不足2种，选择“只施加剩余种类/允许已有状态回填/整次失败”。

前置问题：Q028

【用户回答】

不剔除

### Q033：1348同名异常刷新

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：旧施加默认覆盖，未使用2074的max策略。
- 缺少：同名刷新与叠加规则未确认；不能因为公共模块已有max而直接套用。
- 不能验证完成的原因：同名刷新与叠加规则未确认；不能因为公共模块已有max而直接套用。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

同名刷新与叠加规则未确认；不能因为公共模块已有max而直接套用。

【需要用户回答】

**1348允许抽到已有状态时，该状态时长应覆盖、取最大值、累加，还是保持不变？**

回答格式：四选一；若上一题确认绝不抽已有状态，填写“不适用”。

前置问题：Q028、Q032

【用户回答】

取最大值

### Q034：1348未触发补偿条件

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：旧路径两种都施加失败才清对手回合效果；任一成功即不清。
- 缺少：“未触发”是否指整次零成功或任一种失败未确认。
- 不能验证完成的原因：“未触发”是否指整次零成功或任一种失败未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

“未触发”是否指整次零成功或任一种失败未确认。

【需要用户回答】

**1348抽中的2种异常只有1种成功施加时，是否仍消除对手回合类效果？**

回答格式：是/否；同时填写“反弹成功但原目标未中状态”算成功还是失败。

前置问题：Q028

【用户回答】

否

### Q035：1348失败是否补抽

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：天蛇禁法（26258）
- 魂印名称：无直接魂印
- 效果ID：技能效果 1348；魂印效果eid 无
- 文件位置：[data/random-pools/effects.json](C:/Users/villa/Desktop/seer-battle-lab/data/random-pools/effects.json)，JSON指针 /effects/1348；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/1；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第505行
- 阻塞审核项：3667:skill:26258:2

【当前已确认】

- 1348：{0}回合内若对手使用属性技能则随机附加{1}种异常状态，未触发则消除对手回合类效果
- 3667实例参数[3,2]；API hash52ea44b4、BWIKI revision349330未给出候选及完整抽样语义。

【当前代码状态】

- 已实现：retryAfterImmunity=null；旧路径每种尝试一次，不补抽。
- 缺少：免疫失败后的补抽规则未确认。
- 不能验证完成的原因：免疫失败后的补抽规则未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

免疫失败后的补抽规则未确认。

【需要用户回答】

**1348抽中状态被免疫或抗性挡住后，是否补抽其它候选？**

回答格式：不补抽/补抽；如补抽，填写最大尝试次数或“剩余候选全部失败即停止”。

前置问题：Q028

【用户回答】

不补抽

### Q036：诅咒转化的选择概率

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：诅咒、烈焰诅咒、致命诅咒、虚弱诅咒
- 文件位置：[research/status-behavior-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-behavior-review.json)；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/19；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/20；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/21；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/22；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第598行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 诅咒：控制类异常状态，该状态下精灵无法行动，诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个
- 烈焰诅咒：弱化类异常状态，该状态下每回合受到最大体力1/8的百分比伤害
- 致命诅咒：弱化类异常状态，该状态下受到的攻击伤害提升50%
- 虚弱诅咒：弱化类异常状态，该状态下造成的攻击伤害降低50%

【当前代码状态】

- 已实现：旧分支按三者各1/3选择，目标名单有来源，权重没有。
- 缺少：诅咒转化权重未确认，不能从2074等概率推出。
- 不能验证完成的原因：诅咒转化权重未确认，不能从2074等概率推出。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

诅咒转化权重未确认，不能从2074等概率推出。

【需要用户回答】

**诅咒结束转成烈焰诅咒、致命诅咒、虚弱诅咒的概率分别是多少？**

回答格式：填写三个概率，总和100%；若由条件决定，按条件行填写确定目标。

【用户回答】

等概率

### Q037：超频转瘫痪的时长概率

【分类】

随机池

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：超频、瘫痪
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/31；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/16；[dist/status-pools.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-pools.js)，第1行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第598行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 超频：附属类异常状态，该状态下精灵的技能先制+1且行动开始时恢复所选择技能的全部PP值，超频结束后会转化为1~2回合的瘫痪
- 瘫痪：控制类异常状态，限制类异常状态，该状态下精灵无法行动、主动切换

【当前代码状态】

- 已实现：范围1–2有来源；当前只登记转化待核实，没有编造分布。
- 缺少：两种时长的选择概率或决定条件未确认。
- 不能验证完成的原因：两种时长的选择概率或决定条件未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

两种时长的选择概率或决定条件未确认。

【需要用户回答】

**超频结束后1回合与2回合瘫痪的概率分别是多少？**

回答格式：填写两个概率，总和100%；若不是随机，填写选择1或2的判定条件。

【用户回答】

等概率

## C. PP与资源机制

### Q038：强化魂印PP恢复分配

【分类】

PP机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第65行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 强化魂印1935：对手使用攻击技能后，攻击伤害≤300时吸取对手所有技能1PP，>300时吸取2PP。
- 普通PP回复不超过技能最大PP；上述已知范围不等于自身吸取分配已确认。

【当前代码状态】

- 已实现：对手各技能请求吸取1或2PP的范围、阈值已确认；1935尚未注册，也无公共吸取执行接口。
- 缺少：自身恢复哪些槽位、每槽恢复量以及是否与对手槽位对应未确认。
- 不能验证完成的原因：自身恢复哪些槽位、每槽恢复量以及是否与对手槽位对应未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

自身恢复哪些槽位、每槽恢复量以及是否与对手槽位对应未确认。

【需要用户回答】

**1935成功吸取PP后，自身每个技能的恢复量如何分配？**

回答格式：选择“每个已携带技能各回n/逐槽对应实际扣除量/按总实际吸取量分配”，并填写对应映射或总量分配次序；用对手5槽各实际扣1、自身5槽均缺PP的例子填写自身恢复向量。

【用户回答】

逐槽对应实际扣除量

### Q039：对手PP不足时的恢复基数

【分类】

PP机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第65行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 强化魂印1935：对手使用攻击技能后，攻击伤害≤300时吸取对手所有技能1PP，>300时吸取2PP。
- 普通PP回复不超过技能最大PP；上述已知范围不等于自身吸取分配已确认。

【当前代码状态】

- 已实现：普通PP扣除下限为0；吸取缺额如何影响自身回复未实现。
- 缺少：实际可扣量小于请求量时恢复基数未确认。
- 不能验证完成的原因：实际可扣量小于请求量时恢复基数未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

实际可扣量小于请求量时恢复基数未确认。

【需要用户回答】

**1935请求每槽吸取2PP，而对手某槽只有0或1PP时，自身对应恢复按请求2计算，还是只按该槽实际扣除0或1计算？**

回答格式：按请求量/按实际扣除量；若采用总量分配，答案说明该槽对总恢复量贡献。

前置问题：Q038

【用户回答】

按实际扣除量

### Q040：自身满PP是否阻止扣除

【分类】

PP机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第65行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 强化魂印1935：对手使用攻击技能后，攻击伤害≤300时吸取对手所有技能1PP，>300时吸取2PP。
- 普通PP回复不超过技能最大PP；上述已知范围不等于自身吸取分配已确认。

【当前代码状态】

- 已实现：普通恢复不超过各技能最大PP；尚未实现吸取事务。
- 缺少：自身无法恢复时，对手PP扣除是否仍发生未确认。
- 不能验证完成的原因：自身无法恢复时，对手PP扣除是否仍发生未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

自身无法恢复时，对手PP扣除是否仍发生未确认。

【需要用户回答】

**1935触发时自身所有技能PP均已满，是否仍扣除对手各技能PP？**

回答格式：仍扣除/不扣除。

前置问题：Q038

【用户回答】

仍扣除

### Q041：PP恢复溢出是否转移

【分类】

PP机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第65行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 强化魂印1935：对手使用攻击技能后，攻击伤害≤300时吸取对手所有技能1PP，>300时吸取2PP。
- 普通PP回复不超过技能最大PP；上述已知范围不等于自身吸取分配已确认。

【当前代码状态】

- 已实现：普通恢复会截断至技能PP上限；没有吸取量在槽位间再分配规则。
- 缺少：选定接收槽满PP或容量不足时，多余恢复量是否转给其它缺PP技能未确认。
- 不能验证完成的原因：选定接收槽满PP或容量不足时，多余恢复量是否转给其它缺PP技能未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

选定接收槽满PP或容量不足时，多余恢复量是否转给其它缺PP技能未确认。

【需要用户回答】

**1935吸取分配到某技能的恢复量超过该技能剩余容量时，溢出量直接丢弃，还是转给其它未满技能？**

回答格式：丢弃/转移；选转移时填写固定接收次序或概率。

前置问题：Q038

【用户回答】

直接丢弃

### Q042：吸取与PP扣除保护

【分类】

PP机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第65行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 强化魂印1935：对手使用攻击技能后，攻击伤害≤300时吸取对手所有技能1PP，>300时吸取2PP。
- 普通PP回复不超过技能最大PP；上述已知范围不等于自身吸取分配已确认。

【当前代码状态】

- 已实现：现有PP研究明确把防护交互保留null，强化魂印未注册。
- 缺少：PP降低保护是否阻止吸取、被阻止后是否仍产生恢复未确认。
- 不能验证完成的原因：PP降低保护是否阻止吸取、被阻止后是否仍产生恢复未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

PP降低保护是否阻止吸取、被阻止后是否仍产生恢复未确认。

【需要用户回答】

**对手存在“PP不能降低/免疫PP削减”效果时，1935的吸取是否被阻止？**

回答格式：完全阻止且不回复/阻止扣除但仍回复/吸取绕过该保护；若保护文字不同则逐类选择。

前置问题：Q038

【用户回答】

阻止

### Q043：星赐2PP恢复的范围

【分类】

PP机制

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：星赐
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)，JSON指针 /states/星赐；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/29；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第184行；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第65行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 附属类异常状态，该状态下的精灵造成的攻击伤害提升30%，每回合结束时恢复2点PP值

【当前代码状态】

- 已实现：星赐攻击伤害+30%已实现；回合结束恢复2PP尚未发放。
- 缺少：“恢复2点PP值”没有说明槽位分配。
- 不能验证完成的原因：“恢复2点PP值”没有说明槽位分配。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

“恢复2点PP值”没有说明槽位分配。

【需要用户回答】

**星赐每回合结束恢复2PP，是每个已携带技能各2点，还是所有技能合计2点？**

回答格式：每槽各2/总计2；选总计2时指定目标技能或分配顺序/概率。

【用户回答】

每槽各2

## D. 魂印和技能特殊规则

### Q044：原魂印首回合睡眠概率

【分类】

魂印

【影响范围】

- 仅3667

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·原魂印（项目标签），ID 955，hash 78b44dbf；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 1242
- 文件位置：[research/3667-reviewed-snapshot.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-reviewed-snapshot.json)，JSON指针 /souls/0；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/3；[dist/soul-registry.js](C:/Users/villa/Desktop/seer-battle-lab/dist/soul-registry.js)，第5行
- 阻塞审核项：3667:soul:955

【当前已确认】

- 受到的攻击伤害低于300则令对手所有PP值降低1点且自身下1次造成的攻击伤害提升100%，受到的攻击伤害高于300则令对手所有PP值降低2点且自身下1次受到的攻击伤害减少50%；自身所有技能30%令对手睡眠，每回合开始时概率增加10%，最高50%（boss无效）

【当前代码状态】

- 已实现：955已实现回合开始30+10至50；当前第一回合40%，第二回合起50%。
- 缺少：30%初值与第一次回合开始+10%的时序缺独立确认。
- 不能验证完成的原因：30%初值与第一次回合开始+10%的时序缺独立确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

30%初值与第一次回合开始+10%的时序缺独立确认。

【需要用户回答】

**955在第一回合第一次使用技能后，睡眠概率是30%还是40%？**

回答格式：30%/40%；后续每回合+10%、最高50%的已知规则不重复确认。

【用户回答】

40%

### Q045：强化魂印无攻击伤害时是否触发

【分类】

魂印

【影响范围】

- 仅3667

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/3667-reviewed-snapshot.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-reviewed-snapshot.json)，JSON指针 /souls/1；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/4；[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/soul-registry.js](C:/Users/villa/Desktop/seer-battle-lab/dist/soul-registry.js)，第5行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 对手使用攻击技能后，若对手造成的攻击伤害不高于300则吸取对手所有技能1点PP值且下1次造成的攻击伤害提升100%，若对手造成的攻击伤害高于300则吸取对手所有技能2点PP值且下次所受攻击的伤害减少50%|自身使用技能后，50%令对手睡眠，触发成功则此效果的触发概率减少至0%，未触发则此效果的触发概率提升至100%|（boss无效）

【当前代码状态】

- 已实现：来源触发写“对手使用攻击技能后”；低档是不高于300，不能照搬955的受击条件。1935未注册。
- 缺少：未命中、技能失效、免伤造成0时是否进入PP吸取及低伤分支未确认。
- 不能验证完成的原因：未命中、技能失效、免伤造成0时是否进入PP吸取及低伤分支未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

未命中、技能失效、免伤造成0时是否进入PP吸取及低伤分支未确认。

【需要用户回答】

**对手攻击未命中、攻击技能失效、命中但伤害被免疫为0这三种情况，1935是否触发吸取1PP及下次攻击增伤？**

回答格式：三种情况分别填“触发/不触发”；若PP与增伤不同，分别填写。

【用户回答】

触发

### Q046：强化魂印多段攻击统计

【分类】

魂印

【影响范围】

- 仅3667

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/3667-reviewed-snapshot.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-reviewed-snapshot.json)，JSON指针 /souls/1；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/4；[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/soul-registry.js](C:/Users/villa/Desktop/seer-battle-lab/dist/soul-registry.js)，第5行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 对手使用攻击技能后，若对手造成的攻击伤害不高于300则吸取对手所有技能1点PP值且下1次造成的攻击伤害提升100%，若对手造成的攻击伤害高于300则吸取对手所有技能2点PP值且下次所受攻击的伤害减少50%|自身使用技能后，50%令对手睡眠，触发成功则此效果的触发概率减少至0%，未触发则此效果的触发概率提升至100%|（boss无效）

【当前代码状态】

- 已实现：300边界已确认，未明确多段攻击如何统计。1935未注册。
- 缺少：按每段或整次技能总攻击伤害比较及次数限制未确认。
- 不能验证完成的原因：按每段或整次技能总攻击伤害比较及次数限制未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

按每段或整次技能总攻击伤害比较及次数限制未确认。

【需要用户回答】

**对手一次多段攻击造成200+200伤害时，1935按整次400触发一次高伤分支，还是按两段200各触发一次低伤分支？**

回答格式：整次总和一次/逐段分别触发；若仅首段或末段则选择对应段。

【用户回答】

整次总和一次

### Q047：强化魂印睡眠成功判定

【分类】

魂印

【影响范围】

- 仅3667

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：无直接技能；关联魂印
- 魂印名称：混沌天蛇太祖·强化魂印（项目标签），ID 1935，hash cc25b75e；来源未提供独立名称
- 效果ID：技能效果 无；魂印效果eid 2348
- 文件位置：[research/3667-reviewed-snapshot.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-reviewed-snapshot.json)，JSON指针 /souls/1；[research/3667-review-audit.json](C:/Users/villa/Desktop/seer-battle-lab/research/3667-review-audit.json)，JSON指针 /blockers/4；[research/pp-absorption-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/pp-absorption-review.json)，JSON指针 /unconfirmed；[dist/soul-registry.js](C:/Users/villa/Desktop/seer-battle-lab/dist/soul-registry.js)，第5行
- 阻塞审核项：3667:soul:1935

【当前已确认】

- 对手使用攻击技能后，若对手造成的攻击伤害不高于300则吸取对手所有技能1点PP值且下1次造成的攻击伤害提升100%，若对手造成的攻击伤害高于300则吸取对手所有技能2点PP值且下次所受攻击的伤害减少50%|自身使用技能后，50%令对手睡眠，触发成功则此效果的触发概率减少至0%，未触发则此效果的触发概率提升至100%|（boss无效）

【当前代码状态】

- 已实现：初始50%，成功后变0%，未触发后变100%有原文；状态成功如何定义未实现。
- 缺少：随机判定成功但免疫、抗性、反弹或同名未变化时，“触发成功”判据未确认。
- 不能验证完成的原因：随机判定成功但免疫、抗性、反弹或同名未变化时，“触发成功”判据未确认。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

随机判定成功但免疫、抗性、反弹或同名未变化时，“触发成功”判据未确认。

【需要用户回答】

**1935将下一次睡眠概率改为0%的条件，是随机判定通过，还是对手实际成功获得/刷新睡眠？**

回答格式：选择判据；对“免疫阻止/抗性阻止/反弹到自身/目标已有睡眠且时长未改变”四种情况逐项填写下一概率0%或100%。

【用户回答】

全部按实际

## E. 属性与伤害规则

属性倍率、双属性、本系与零倍率已检查，按当前明确策略不重复提问；本组仅保留候选状态的特殊伤害未确认项。

### Q048：沸涌下限与减伤顺序

【分类】

其他（特殊伤害）

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：沸涌
- 文件位置：[research/public-status-expansion-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/public-status-expansion-review.json)；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/32；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第69行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第266行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 弱化类异常状态，该状态下的精灵受到的攻击伤害至少为其最大体力的30%，对手打出致命一击时效果提升至50%

【当前代码状态】

- 已实现：已实现非暴击30%、暴击50%的最大体力伤害下限，再经过公共伤害限制。
- 缺少：下限与减伤/免伤的优先级只有引擎约定，未有可靠规则认证。
- 不能验证完成的原因：下限与减伤/免伤的优先级只有引擎约定，未有可靠规则认证。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

下限与减伤/免伤的优先级只有引擎约定，未有可靠规则认证。

【需要用户回答】

**沸涌的30%/50%下限，是减伤前的计算下限，还是所有减伤后的最终扣血下限？**

回答格式：减伤前/减伤后；另对完全免伤填写“仍为0/下限仍生效”。

【用户回答】

最终

### Q049：混乱50点自损的伤害类型

【分类】

其他（特殊伤害）

【影响范围】

- 公共机制（会影响后续精灵）

【关联对象】

- 精灵ID：3667（混沌天蛇太祖）
- 技能名称：斥天无常（28684）
- 魂印名称：无直接魂印
- 效果ID：技能效果 2074；魂印效果eid 无
- 状态：混乱
- 文件位置：[research/status-high-frequency-review.json](C:/Users/villa/Desktop/seer-battle-lab/research/status-high-frequency-review.json)；[data/statuses/statuses.json](C:/Users/villa/Desktop/seer-battle-lab/data/statuses/statuses.json)，JSON指针 /records/9；[dist/status-rules.js](C:/Users/villa/Desktop/seer-battle-lab/dist/status-rules.js)，第58行；[dist/souls.js](C:/Users/villa/Desktop/seer-battle-lab/dist/souls.js)，第112行
- 阻塞审核项：3667:skill:28684:1

【当前已确认】

- 弱化类异常状态，该状态下每回合都会有5%的概率扣除50点体力，而且攻击技能的命中率减少80%

【当前代码状态】

- 已实现：5%和50点有来源；当前按固定伤害通道计算，受固定抗性和免伤影响。
- 缺少：原文只写扣50点体力，未明确固定、真实或直接扣体力。
- 不能验证完成的原因：原文只写扣50点体力，未明确固定、真实或直接扣体力。 此问题对应未完成的单精灵语义审核，当前测试通过不足以确认该规则。

【缺少确认】

原文只写扣50点体力，未明确固定、真实或直接扣体力。

【需要用户回答】

**混乱触发的50点自损属于固定伤害、真实伤害，还是直接扣体力？**

回答格式：三选一；同时选择是否受固定抗性、全伤害免疫影响。

【用户回答】

直接扣体力，不受全伤害免疫影响

## 已检查但不重复提问的事项

- **2074候选范围、排除项、等概率、1–3回合和同名最大时长**：当前项目规则已明确；不问山神守护/魇昧是否入池，不沿用早期38项分类阻塞。
- **魇昧的基本显示行为**：原文已明确仅对己方将场上异常及能力等级显示为无回合数魇昧。缺少观察者视角属于代码/界面任务，不应转成用户确认规则。不能误列为已实现。
- **束缚公共清除接入、臣服历史伤害来源归属、砥砺执行事件追踪**：接入和记录路径由开发者补齐，不问用户如何编程；砥砺的执行判据歧义另以Q007/Q008提出。
- **狂信跨换宠身份与信仰存续**：本次只列单精灵阻塞，换宠身份属于第二阶段；来源已确认首次绑定与对手身份控制，不重复问。
- **属性矩阵、双属性、本系与边界倍率**：当前已统一查库；26属性、139组合、19321格完整。双属性采用Wiki388521公式；本系按388558规则。API/Wiki三格及2+2文字冲突已保留且有明确采用策略，当前3667审核没有新增属性规则阻塞，不要求重新选择。
- **普通PP上下限、每次正常用招扣1、原/强化300边界**：不重复确认已知PP边界；955为<300或>300、恰300不触发，1935为≤300或>300。吸取资源转移仍单独待确认。
- **伙伴技能/原版强化版分类、技能先制和已审核次数分支**：保留伙伴技28684和955/1935两版；isAdvanced均为false，不虚构觉醒第三版。现有64项审核及其明确规则不重开；强化版完整注册/测试属于后续实现。
- **全部unknownFields和未列明的状态互斥**：未将每个null或来源未提及的假想机制自动编成问题。现有不同状态共存与免疫流程有状态测试；本清单保留已明确记录的时长、转化、刷新、抽样及具体交互缺口，不额外推测未知冲突。
- **正式快照缺失、重新运行部署/专项/整库/验证器**：当前验证器直接拒绝点仍为未部署，不是它自动逐条判定这49个语义问题。用户确认后还需实现、审核、测试和正式部署，不能凭答案改为passed。

## 后续边界

本次不运行战斗测试或完成验证器，不修改任何代码、审核完成标记或进度文件。清单回答仍须逐项保存确认来源；资料不足继续保持null，不能删池成员、降标准或直接放行3667。


## 补充确认：魇昧白板异常

来源：project_rule/user_confirmed（当前用户补充；用户写作“魇寐”，数据库名称为“魇昧”）。

原始回答：魇寐受咱们的对局效果影响，改成无效果的白板异常状态吧，就是显示为异常状态，但是实际没有效果

当前项目规则：保留异常身份、正常名称和回合显示；沿用公共施加、刷新、到期、清除和免疫；不遮蔽显示，不控制行动，不改变伤害、属性、PP，不产生专属转化。

Wiki显示遮蔽规则仅作为原始来源保留，不用于本项目当前对局。

## Q005、Q048补充确认与实现

- Q005原始补充回答：“按初始3回合：始终100%”。衰弱固定刷新3回合，当回合计1，全程攻击受伤增加100%。
- Q048原始补充回答：“完全免伤也要扣下限伤害”。沸涌在免疫/减伤结算后执行最大体力30%或暴击50%的最终伤害下限。
- 两项来源均为 `project_rule/user_confirmed`，原始Q&A与Wiki/API证据均保留。
- 49项确认已对应实现；机器可读实现、来源与测试映射见同名JSON的各题implementation字段。魇昧白板补充规则见上节。

## 实现验证结果（2026-10-15）

49项确认与补充规则已接入；3667审核69/69，专项153/153，整库1155/1155，独立验证通过 `passed (single-stage)`。详情见 `research/3667-user-rules-verification.json`。未开始3670。
