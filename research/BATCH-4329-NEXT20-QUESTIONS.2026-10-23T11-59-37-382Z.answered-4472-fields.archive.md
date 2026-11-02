# 4329起固定20只：待确认问题

固定范围：4329、4333、4338、4345、4347、4353、4354、4355、4358、4359、4361、4364、4372、4373、4376、4384、4386、4387、4394、4395。正式队列第177–196行。仅用户填写并明确通知后处理答案；建议和空白不是确认。

## 4329 倪克斯（部分实现，审核进行中）

精灵来源https://api.seerapi.com/v1/pet/4329，hash81dec1d0。原版/强化/伙伴自身分支均属第一阶段。

### Q-N20-4329-001 — 两版魂印能力差值与原版PP窗口

- 已查资料：现有确认、SeerAPI精灵/魂印/技能/模板与eid_effect1913、2126；BWIKI魂印1555、1735、效果1949、1959、2037。未找到可消除此缺口的已有确认。
- 本地原始证据：research/4329-source-check.json、research/4329-extra-source.json、research/4329-wiki-source.json；Wiki URL、revision及时间原样保存在后者。
- 精确来源、版本、实例及完整原文：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1555",
    "hash": "90557811",
    "effect": {
      "effect_args": [
        50,
        1,
        3,
        1
      ],
      "effect": {
        "id": 1913,
        "url": "https://api.seerapi.com/v1/eid_effect/1913"
      }
    },
    "original": "每次登场首回合若对手处于能力提升状态则自身受到的攻击伤害降低50%且下回合对手属性技能失效，当回合战斗阶段结束时若双方全属性能力差值≥3开启倪克斯结界：下2回合对手攻击技能先制效果失效、下2回合自身攻击必定命中、2回合内每个战斗阶段结束时恢复自身所有技能1点PP值；|战斗阶段结束时若自身体力高于回合开始时则下回合攻击必定打出致命一击，战斗阶段结束时若自身体力等于回合开始时则下回合攻击技能先制+1，战斗阶段结束时若自身体力低于回合开始时则恢复自身最大体力的1/3（boss无效）",
    "formatted": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场首回合：\r\n<indent=32><sprite=4><indent=48>回合开始时，若对手处于能力提升状态则自身受到的<b>攻击伤害</b><color=#64F9FA>减少</color>50%且下回合对手<b>属性技能</b><color=#64F9FA>无效</color>\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时，若双方全属性能力差值≥3开启<color=#FFF779>倪克斯结界</color>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身体力高于回合开始时则下回合攻击必定<color=#64F9FA>打出致命一击</color>\r\n<indent=32><sprite=4><indent=48>若自身体力等于回合开始时则下回合攻击技能<b>先制</b>+1\r\n<indent=32><sprite=4><indent=48>若自身体力低于回合开始时则<color=#64F9FA>恢复</color>自身最大体力的1/3\r\n\r\n<indent=0><sprite=5><indent=15>倪克斯结界：\r\n<indent=16><sprite=6><indent=32>下2回合对手<b>攻击技能</b><color=#64F9FA>先制效果失效</color>\r\n<indent=16><sprite=6><indent=32>下2回合自身攻击<color=#64F9FA>必定命中</color>\r\n<indent=16><sprite=6><indent=32>2回合内每个战斗阶段结束时<color=#64F9FA>恢复</color>自身所有技能1点<b>PP值</b>"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1735",
    "hash": "763e1182",
    "effect": {
      "effect_args": [
        1,
        0
      ],
      "effect": {
        "id": 2126,
        "url": "https://api.seerapi.com/v1/eid_effect/2126"
      }
    },
    "original": "每次登场首回合开始时若对手处于能力提升状态则当回合自身受到的攻击伤害、固定伤害、百分比伤害减少50%，且下回合对手使用的属性技能无效；|登场首次战斗阶段结束时，若双方能力等级差值≥12则解除自身当前所处的异常状态并开启3回合的谧夜之幕；|战斗阶段结束时若自身当前体力高于回合开始时则下回合攻击技能必定打出致命一击且命中前令对手全属性-1、属性技能使用后令对手沉默，若不高于回合开始时则恢复自身最大体力的1/3并造成等量百分比伤害且下回合所有技能额外先制+1|（谧夜之幕下场消失，所有特效boss无效）|谧夜之幕：开启期间对手攻击技能先制效果失效、自身攻击技能必定命中且每个战斗阶段结束时恢复所有技能PP值",
    "formatted": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场首回合：\r\n<indent=32><sprite=4><indent=48>回合开始时，若对手处于能力提升状态则当回合自身受到的<b>攻击伤害、固定伤害、百分比伤害</b><color=#64F9FA>减少</color>50%且下回合对手<b>属性技能</b><color=#64F9FA>无效</color>\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时，若双方能力等级差值≥12则<color=#64F9FA>解除</color>自身所处的<b>异常状态</b>并开启3回合的<color=#FFF779>谧夜之幕</color>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身体力高于回合开始时则下回合：\r\n<indent=32><sprite=4><sprite=4><indent=64><b>攻击技能</b>必定<color=#64F9FA>打出致命一击</color>且使用时令对手<color=#64F9FA>全属性-1</color>\r\n<indent=32><sprite=4><sprite=4><indent=64><b>属性技能</b>使用后<color=#64F9FA>令对手沉默</color>\r\n<indent=32><sprite=4><indent=48>若自身体力不高于回合开始则<color=#64F9FA>恢复</color>自身最大体力的1/3并造成等量<b>百分比伤害</b>且下回合所有技能额外<b>先制</b>+1：\r\n\r\n<indent=0><sprite=5><indent=15>谧夜之幕：\r\n<indent=16><sprite=6><indent=32>自身每个战斗阶段结束时<color=#64F9FA>恢复</color>所有的<b>PP值</b>\r\n<indent=16><sprite=6><indent=32>对手攻击技能的<color=#64F9FA>先制效果失效</color>且受到的<b>攻击技能</b><color=#64F9FA>必定命中</color>"
  }
]
```

- 缺口/冲突：魂印及eid_effect只给出阈值3/12，未给六项能力等级差值的运算式。原版将攻击先制/必中写为下2回合，PP写为2回合内；是否同一窗口未说明。
- 可选解释及战斗差异：能力差值可按逐项差的绝对值之和，或两方等级总和之差的绝对值理解。例如双方分别攻击+2和防御+2，前者4，后者0，会改变是否开启结界。请分别明确两个版本的公式，以及原版PP回复是否包含开启当回合。
- 影响、已完成与被阻塞部分：首次战阶结界触发、结界先制/必中与PP恢复时窗；已实现首回合减伤/封属性及原版HP比较奖励。

我的回答：看双方能力提升等级总和，比如我全属性加一，对面攻击-1特攻-1，则差为8；这点写得没问题，就是不一样
          公式为   |我的攻击能力提升-对手攻击能力提升|+|我的特攻能力提升-对手特攻能力提升|+|我的防御能力提升-对手防御能力提升|+|我的特防能力提升-对手特防能力提升|+|我的速度能力提升-对手速度能力提升|+|我的命中能力提升-对手命中能力提升|

### Q-N20-4329-002 — 强化版全属性-1的API内部时序冲突

- 已查资料：现有确认、SeerAPI精灵/魂印/技能/模板与eid_effect1913、2126；BWIKI魂印1555、1735、效果1949、1959、2037。未找到可消除此缺口的已有确认。
- 本地原始证据：research/4329-source-check.json、research/4329-extra-source.json、research/4329-wiki-source.json；Wiki URL、revision及时间原样保存在后者。
- 精确来源、版本、实例及完整原文：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1735",
    "hash": "763e1182",
    "effect": {
      "effect_args": [
        1,
        0
      ],
      "effect": {
        "id": 2126,
        "url": "https://api.seerapi.com/v1/eid_effect/2126"
      }
    },
    "original": "每次登场首回合开始时若对手处于能力提升状态则当回合自身受到的攻击伤害、固定伤害、百分比伤害减少50%，且下回合对手使用的属性技能无效；|登场首次战斗阶段结束时，若双方能力等级差值≥12则解除自身当前所处的异常状态并开启3回合的谧夜之幕；|战斗阶段结束时若自身当前体力高于回合开始时则下回合攻击技能必定打出致命一击且命中前令对手全属性-1、属性技能使用后令对手沉默，若不高于回合开始时则恢复自身最大体力的1/3并造成等量百分比伤害且下回合所有技能额外先制+1|（谧夜之幕下场消失，所有特效boss无效）|谧夜之幕：开启期间对手攻击技能先制效果失效、自身攻击技能必定命中且每个战斗阶段结束时恢复所有技能PP值",
    "formatted": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场首回合：\r\n<indent=32><sprite=4><indent=48>回合开始时，若对手处于能力提升状态则当回合自身受到的<b>攻击伤害、固定伤害、百分比伤害</b><color=#64F9FA>减少</color>50%且下回合对手<b>属性技能</b><color=#64F9FA>无效</color>\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时，若双方能力等级差值≥12则<color=#64F9FA>解除</color>自身所处的<b>异常状态</b>并开启3回合的<color=#FFF779>谧夜之幕</color>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身体力高于回合开始时则下回合：\r\n<indent=32><sprite=4><sprite=4><indent=64><b>攻击技能</b>必定<color=#64F9FA>打出致命一击</color>且使用时令对手<color=#64F9FA>全属性-1</color>\r\n<indent=32><sprite=4><sprite=4><indent=64><b>属性技能</b>使用后<color=#64F9FA>令对手沉默</color>\r\n<indent=32><sprite=4><indent=48>若自身体力不高于回合开始则<color=#64F9FA>恢复</color>自身最大体力的1/3并造成等量<b>百分比伤害</b>且下回合所有技能额外<b>先制</b>+1：\r\n\r\n<indent=0><sprite=5><indent=15>谧夜之幕：\r\n<indent=16><sprite=6><indent=32>自身每个战斗阶段结束时<color=#64F9FA>恢复</color>所有的<b>PP值</b>\r\n<indent=16><sprite=6><indent=32>对手攻击技能的<color=#64F9FA>先制效果失效</color>且受到的<b>攻击技能</b><color=#64F9FA>必定命中</color>"
  }
]
```

- 缺口/冲突：同hash763e1182的desc写“命中前令对手全属性-1”，desc_formatting_adjustment写“使用时令对手全属性-1”。底层2126仅参数数量，BWIKI复述desc，无法裁定API内部差异。
- 可选解释及战斗差异：按使用时：实际用招但MISS也可能弱化；按命中前：MISS不弱化。两者都须另遵守技能失效与控制未用的现有机制。请确定采用哪个字段对应的时机。
- 影响、已完成与被阻塞部分：强化高体奖励下回合攻击弱化；必暴奖励和属性用后沉默已独立实现，未猜定攻击弱化时机。

我的回答：按使用时

### Q-N20-4329-003 — 已由既有确认消解，不需重复回答

复核research/FIXED60-ANSWER-USER-CONFIRMATIONS.json中Q-A60-4109-019的原回答：“实际回复；不回复就不附加”。与当前先回复后等量附伤的语义一致；复用该回复基数，仍保留4329的百分比伤害类型。没有新增用户回答，没有修改上游词条。原问题及完整原文保存在research/4329-Q003-before-local-confirmation-check.txt；本段不再作为待回答项。

已实现强化1735等体/低体回复、按实际治疗事件量附伤及下回合全技能先制+1；满血、回复削减、封顶测试见research/4329-independent-v6.log。

### Q-N20-4329-004 — 伙伴效果2037总段数及每相差1段的含义

- 已查资料：现有确认、SeerAPI精灵/魂印/技能/模板与eid_effect1913、2126；BWIKI魂印1555、1735、效果1949、1959、2037。未找到可消除此缺口的已有确认。
- 本地原始证据：research/4329-source-check.json、research/4329-extra-source.json、research/4329-wiki-source.json；Wiki URL、revision及时间原样保存在后者。
- 精确来源、版本、实例及完整原文：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/36696",
    "hash": "62da0896",
    "skill": "至暗·无量空邃",
    "instances": [
      {
        "info": "双方能力提升、下降总段数≤24时，每相差1段附加15点真实伤害，>24时开启3回合的谧夜之幕，若已开启则3回合内对手无法造成固定伤害、百分比伤害",
        "analyze_info": "[sprite name=iconHit]双方能力提升、下降总段数≤24时，每相差1段附加15点[color=#52a5f2]真实伤害[/color]，>24时开启3回合的[color=#f35555]谧夜之幕[/color]，若已开启则3回合内对手无法造成[color=#52a5f2]固定伤害[/color]、[color=#52a5f2]百分比伤害[/color]",
        "args": [
          24,
          15,
          24
        ],
        "effect": {
          "id": 2037,
          "url": "https://api.seerapi.com/v1/skill_effect_type/2037"
        }
      }
    ]
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/2037",
    "hash": "9364aa9",
    "template": "双方能力提升、下降总段数≤{0}时，每相差1段附加{1}点真实伤害，>{2}时开启3回合的谧夜之幕，若已开启则3回合内对手无法造成固定伤害、百分比伤害",
    "argsNum": 3
  }
]
```

- 缺口/冲突：实例[24,15,24]与模板数量一致，但“双方能力提升、下降总段数”及“每相差1段”未定义两方各项的合并与比较对象；SeerAPI/BWIKI均未给算例。谧夜之幕由技能开启与魂印开启是否共享同一持续窗口亦需明确。
- 可选解释及战斗差异：请给出段数与附伤公式，尤其0段、24段、25段边界，以及已有谧夜之幕时是只封粉伤还是同时刷新幕。按与24的差额理解，0段产生360真伤、24段为0；按双方段数差理解会有不同结果，当前不选择任何一种。
- 影响、已完成与被阻塞部分：伙伴追加技2037本身；原版/强化魂印的幕关联规则。伙伴技能保留真实ID36696及激活道具1725370，未延期到多精灵。

我的回答：总段数和相差段数看的是双方能力等级，比如我全属性加一，对方命中+1特防+1，则总段数为6+2=8，相差段数为（1*4=2+0）=4；总段数小于等于24附加相差段数*15的真实伤害，大于等于25时开启幕；有幕只封粉伤；共享统一窗口

### Q-N20-4329-005 — 伙伴效果1959睡眠与本招翻倍的结算时序

- 已查资料：现有确认、SeerAPI精灵/魂印/技能/模板与eid_effect1913、2126；BWIKI魂印1555、1735、效果1949、1959、2037。未找到可消除此缺口的已有确认。
- 本地原始证据：research/4329-source-check.json、research/4329-extra-source.json、research/4329-wiki-source.json；Wiki URL、revision及时间原样保存在后者。
- 精确来源、版本、实例及完整原文：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/36696",
    "hash": "62da0896",
    "skill": "至暗·无量空邃",
    "instances": [
      {
        "info": "消除对手回合类效果，消除成功100%令对手睡眠，未触发则造成的攻击伤害翻倍",
        "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功100%令对手[color=#57c975]睡眠[/color]，[color=#52a5f2]未触发[/color]则造成的攻击伤害翻倍",
        "args": [
          100,
          8
        ],
        "effect": {
          "id": 1959,
          "url": "https://api.seerapi.com/v1/skill_effect_type/1959"
        }
      }
    ]
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1959",
    "hash": "96719f8f",
    "template": "消除对手回合类效果，消除成功{0}%令对手{1}，未触发则造成的攻击伤害翻倍",
    "argsNum": 2
  }
]
```

- 缺口/冲突：词条同时要求消回合成功睡眠、睡眠未触发本次攻击伤害翻倍，来源未给睡眠与攻击伤害的先后。试验在伤害前附加睡眠会由同招伤害唤醒；这是代码试验结果，不作为真实机制来源。
- 可选解释及战斗差异：请明确睡眠成功是否应保留到本招伤害之后，或本来就允许同招唤醒；若应在伤害后施加，请同时明确睡眠免疫次数的判定/消费与伤害翻倍的先后。没有来源支持的额外机制未作为默认选项。
- 影响、已完成与被阻塞部分：仅1959；未核实方案与两个原断言逐字保存research/4329-1959-unverified-hypothesis.txt、research/4329-1959-unverified-tests.txt；失败日志research/4329-independent-v3.log。未保留猜测实现。

我的回答：睡眠成功必须保留，不允许同招唤醒；睡眠在攻击伤害前判定并消费免疫次数、失败就让本招翻倍，而成功睡眠保留至本招结束

### Q-N20-4329-006 — 条件秒杀495的伤害、保命与死亡事件

完整技能、实例、模板与版本：

```json
{
  "skill": {
    "url": "https://api.seerapi.com/v1/skill/35661",
    "data": {
      "id": 35661,
      "name": "恐惧突袭",
      "power": 120,
      "max_pp": 10,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 51,
        "url": "https://api.seerapi.com/v1/element_type_combination/51"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若对手处于害怕状态，则20%概率秒杀对手",
          "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]害怕[/color]状态，则20%概率[color=#52a5f2]秒杀[/color]对手",
          "args": [
            6,
            20
          ],
          "effect": {
            "id": 495,
            "url": "https://api.seerapi.com/v1/skill_effect_type/495"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "1f5bd12"
    },
    "loadedAt": "2026-10-21T14:08:01.484Z",
    "storage": "refreshed"
  },
  "effect": {
    "url": "https://api.seerapi.com/v1/skill_effect_type/495",
    "data": {
      "id": 495,
      "args_num": 2,
      "info": "若对手处于{0}状态，则{1}%概率秒杀对手",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]{0}[/color]状态，则{1}%概率[color=#52a5f2]秒杀[/color]对手",
      "pve_effective": false,
      "param": [
        {
          "position": 0,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 14327,
          "url": "https://api.seerapi.com/v1/skill/14327"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 16046,
          "url": "https://api.seerapi.com/v1/skill/16046"
        },
        {
          "id": 29002,
          "url": "https://api.seerapi.com/v1/skill/29002"
        },
        {
          "id": 32200,
          "url": "https://api.seerapi.com/v1/skill/32200"
        },
        {
          "id": 32312,
          "url": "https://api.seerapi.com/v1/skill/32312"
        },
        {
          "id": 32634,
          "url": "https://api.seerapi.com/v1/skill/32634"
        },
        {
          "id": 32751,
          "url": "https://api.seerapi.com/v1/skill/32751"
        },
        {
          "id": 32964,
          "url": "https://api.seerapi.com/v1/skill/32964"
        },
        {
          "id": 33050,
          "url": "https://api.seerapi.com/v1/skill/33050"
        },
        {
          "id": 33377,
          "url": "https://api.seerapi.com/v1/skill/33377"
        },
        {
          "id": 33677,
          "url": "https://api.seerapi.com/v1/skill/33677"
        },
        {
          "id": 33696,
          "url": "https://api.seerapi.com/v1/skill/33696"
        },
        {
          "id": 33766,
          "url": "https://api.seerapi.com/v1/skill/33766"
        },
        {
          "id": 33776,
          "url": "https://api.seerapi.com/v1/skill/33776"
        },
        {
          "id": 33897,
          "url": "https://api.seerapi.com/v1/skill/33897"
        },
        {
          "id": 33992,
          "url": "https://api.seerapi.com/v1/skill/33992"
        },
        {
          "id": 34279,
          "url": "https://api.seerapi.com/v1/skill/34279"
        },
        {
          "id": 34597,
          "url": "https://api.seerapi.com/v1/skill/34597"
        },
        {
          "id": 34789,
          "url": "https://api.seerapi.com/v1/skill/34789"
        },
        {
          "id": 35049,
          "url": "https://api.seerapi.com/v1/skill/35049"
        },
        {
          "id": 35235,
          "url": "https://api.seerapi.com/v1/skill/35235"
        },
        {
          "id": 35240,
          "url": "https://api.seerapi.com/v1/skill/35240"
        },
        {
          "id": 35246,
          "url": "https://api.seerapi.com/v1/skill/35246"
        },
        {
          "id": 35479,
          "url": "https://api.seerapi.com/v1/skill/35479"
        },
        {
          "id": 35661,
          "url": "https://api.seerapi.com/v1/skill/35661"
        },
        {
          "id": 35780,
          "url": "https://api.seerapi.com/v1/skill/35780"
        },
        {
          "id": 36860,
          "url": "https://api.seerapi.com/v1/skill/36860"
        },
        {
          "id": 37392,
          "url": "https://api.seerapi.com/v1/skill/37392"
        },
        {
          "id": 38595,
          "url": "https://api.seerapi.com/v1/skill/38595"
        }
      ],
      "tag": [
        {
          "id": 29062,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/29062"
        }
      ],
      "hash": "eeaea91f"
    },
    "cacheFile": "research/3941-source-check.json",
    "loadedAt": "2026-10-19T07:45:09.842Z",
    "storage": "existing-cache"
  }
}
```

本地证据research/4329-source-check.json。已查既有用户确认及公共秒杀代码：1591与456已有精确实例授权，不能扩大到495；当前495处理器以目标剩余HP作为true伤害，这与直接秒杀的伤害事件、护盾/免疫/保命路径不同，不能把该代码或测试当真实来源。

具体待确认：恐惧突袭35661/495[6,20]在条件与概率满足时，是否直接归零HP；是否允许保留1HP、免伤/真伤免疫或护盾阻挡，是否触发击败及死亡反应？直接HP归零与当前true伤害路径会在这些交互上不同。其余条件检查、未触发及控制未用已测试；成功分支不宣称正确实现。此项也会影响同效果的其他真实实例，未擅自修补已部署目标。

我的回答：是，直接归零hp；当对手有免死的时候才保留1hp；保留1hp不触发击败和死亡反应；全部都是统一直接归零HP、只受免死影响且不产生伤害事件

## 4333 哀·拉伯克 — 独立工作完成，待确认

资料完整保留research/4333-source-check.json、4333-extra-source.json、4333-wiki-source.json。23项专项通过；精确参数冲突未绕过，未正式部署或验收。

### Q-N20-4333-001 — 复仇21741/58[2,2]在4333的精确兼容授权

完整原文、实例、来源URL/hash/加载时间：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/21741",
    "data": {
      "id": 21741,
      "name": "复仇",
      "power": 0,
      "max_pp": 5,
      "accuracy": 100,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "陷入了愤怒",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "下2回合自身攻击技能必定打出致命一击",
          "analyze_info": "[sprite name=iconHit]下2回合自身攻击技能必定打出[color=#57c975]致命一击[/color]（boss有效）",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 58,
            "url": "https://api.seerapi.com/v1/skill_effect_type/58"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "4d5b40d1"
    },
    "cacheFile": "research/selected-3711-3716-3724-3737-3739-3740-3741-3763-3788-3807.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/58",
    "data": {
      "id": 58,
      "args_num": 1,
      "info": "下{0}回合自身攻击技能必定打出致命一击",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]下{0}回合自身攻击技能必定打出[color=#57c975]致命一击[/color]（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 16617,
          "url": "https://api.seerapi.com/v1/skill/16617"
        },
        {
          "id": 17799,
          "url": "https://api.seerapi.com/v1/skill/17799"
        },
        {
          "id": 19725,
          "url": "https://api.seerapi.com/v1/skill/19725"
        },
        {
          "id": 20151,
          "url": "https://api.seerapi.com/v1/skill/20151"
        },
        {
          "id": 20355,
          "url": "https://api.seerapi.com/v1/skill/20355"
        },
        {
          "id": 20404,
          "url": "https://api.seerapi.com/v1/skill/20404"
        },
        {
          "id": 20457,
          "url": "https://api.seerapi.com/v1/skill/20457"
        },
        {
          "id": 20482,
          "url": "https://api.seerapi.com/v1/skill/20482"
        },
        {
          "id": 20500,
          "url": "https://api.seerapi.com/v1/skill/20500"
        },
        {
          "id": 20542,
          "url": "https://api.seerapi.com/v1/skill/20542"
        },
        {
          "id": 20554,
          "url": "https://api.seerapi.com/v1/skill/20554"
        },
        {
          "id": 20558,
          "url": "https://api.seerapi.com/v1/skill/20558"
        },
        {
          "id": 20562,
          "url": "https://api.seerapi.com/v1/skill/20562"
        },
        {
          "id": 20592,
          "url": "https://api.seerapi.com/v1/skill/20592"
        },
        {
          "id": 20614,
          "url": "https://api.seerapi.com/v1/skill/20614"
        },
        {
          "id": 20618,
          "url": "https://api.seerapi.com/v1/skill/20618"
        },
        {
          "id": 20625,
          "url": "https://api.seerapi.com/v1/skill/20625"
        },
        {
          "id": 20655,
          "url": "https://api.seerapi.com/v1/skill/20655"
        },
        {
          "id": 20673,
          "url": "https://api.seerapi.com/v1/skill/20673"
        },
        {
          "id": 20683,
          "url": "https://api.seerapi.com/v1/skill/20683"
        },
        {
          "id": 20686,
          "url": "https://api.seerapi.com/v1/skill/20686"
        },
        {
          "id": 20692,
          "url": "https://api.seerapi.com/v1/skill/20692"
        },
        {
          "id": 20700,
          "url": "https://api.seerapi.com/v1/skill/20700"
        },
        {
          "id": 20724,
          "url": "https://api.seerapi.com/v1/skill/20724"
        },
        {
          "id": 20737,
          "url": "https://api.seerapi.com/v1/skill/20737"
        },
        {
          "id": 20751,
          "url": "https://api.seerapi.com/v1/skill/20751"
        },
        {
          "id": 20754,
          "url": "https://api.seerapi.com/v1/skill/20754"
        },
        {
          "id": 20769,
          "url": "https://api.seerapi.com/v1/skill/20769"
        },
        {
          "id": 20793,
          "url": "https://api.seerapi.com/v1/skill/20793"
        },
        {
          "id": 20798,
          "url": "https://api.seerapi.com/v1/skill/20798"
        },
        {
          "id": 20801,
          "url": "https://api.seerapi.com/v1/skill/20801"
        },
        {
          "id": 20818,
          "url": "https://api.seerapi.com/v1/skill/20818"
        },
        {
          "id": 20854,
          "url": "https://api.seerapi.com/v1/skill/20854"
        },
        {
          "id": 20862,
          "url": "https://api.seerapi.com/v1/skill/20862"
        },
        {
          "id": 20909,
          "url": "https://api.seerapi.com/v1/skill/20909"
        },
        {
          "id": 20912,
          "url": "https://api.seerapi.com/v1/skill/20912"
        },
        {
          "id": 20938,
          "url": "https://api.seerapi.com/v1/skill/20938"
        },
        {
          "id": 20942,
          "url": "https://api.seerapi.com/v1/skill/20942"
        },
        {
          "id": 20945,
          "url": "https://api.seerapi.com/v1/skill/20945"
        },
        {
          "id": 20947,
          "url": "https://api.seerapi.com/v1/skill/20947"
        },
        {
          "id": 20962,
          "url": "https://api.seerapi.com/v1/skill/20962"
        },
        {
          "id": 20966,
          "url": "https://api.seerapi.com/v1/skill/20966"
        },
        {
          "id": 20968,
          "url": "https://api.seerapi.com/v1/skill/20968"
        },
        {
          "id": 20981,
          "url": "https://api.seerapi.com/v1/skill/20981"
        },
        {
          "id": 20984,
          "url": "https://api.seerapi.com/v1/skill/20984"
        },
        {
          "id": 20992,
          "url": "https://api.seerapi.com/v1/skill/20992"
        },
        {
          "id": 20998,
          "url": "https://api.seerapi.com/v1/skill/20998"
        },
        {
          "id": 21003,
          "url": "https://api.seerapi.com/v1/skill/21003"
        },
        {
          "id": 21013,
          "url": "https://api.seerapi.com/v1/skill/21013"
        },
        {
          "id": 21022,
          "url": "https://api.seerapi.com/v1/skill/21022"
        },
        {
          "id": 21025,
          "url": "https://api.seerapi.com/v1/skill/21025"
        },
        {
          "id": 21033,
          "url": "https://api.seerapi.com/v1/skill/21033"
        },
        {
          "id": 21040,
          "url": "https://api.seerapi.com/v1/skill/21040"
        },
        {
          "id": 21049,
          "url": "https://api.seerapi.com/v1/skill/21049"
        },
        {
          "id": 21059,
          "url": "https://api.seerapi.com/v1/skill/21059"
        },
        {
          "id": 21071,
          "url": "https://api.seerapi.com/v1/skill/21071"
        },
        {
          "id": 21077,
          "url": "https://api.seerapi.com/v1/skill/21077"
        },
        {
          "id": 21080,
          "url": "https://api.seerapi.com/v1/skill/21080"
        },
        {
          "id": 21087,
          "url": "https://api.seerapi.com/v1/skill/21087"
        },
        {
          "id": 21094,
          "url": "https://api.seerapi.com/v1/skill/21094"
        },
        {
          "id": 21099,
          "url": "https://api.seerapi.com/v1/skill/21099"
        },
        {
          "id": 21101,
          "url": "https://api.seerapi.com/v1/skill/21101"
        },
        {
          "id": 21120,
          "url": "https://api.seerapi.com/v1/skill/21120"
        },
        {
          "id": 21132,
          "url": "https://api.seerapi.com/v1/skill/21132"
        },
        {
          "id": 21144,
          "url": "https://api.seerapi.com/v1/skill/21144"
        },
        {
          "id": 21146,
          "url": "https://api.seerapi.com/v1/skill/21146"
        },
        {
          "id": 21152,
          "url": "https://api.seerapi.com/v1/skill/21152"
        },
        {
          "id": 21171,
          "url": "https://api.seerapi.com/v1/skill/21171"
        },
        {
          "id": 21182,
          "url": "https://api.seerapi.com/v1/skill/21182"
        },
        {
          "id": 21189,
          "url": "https://api.seerapi.com/v1/skill/21189"
        },
        {
          "id": 21194,
          "url": "https://api.seerapi.com/v1/skill/21194"
        },
        {
          "id": 21232,
          "url": "https://api.seerapi.com/v1/skill/21232"
        },
        {
          "id": 21237,
          "url": "https://api.seerapi.com/v1/skill/21237"
        },
        {
          "id": 21247,
          "url": "https://api.seerapi.com/v1/skill/21247"
        },
        {
          "id": 21272,
          "url": "https://api.seerapi.com/v1/skill/21272"
        },
        {
          "id": 21299,
          "url": "https://api.seerapi.com/v1/skill/21299"
        },
        {
          "id": 21312,
          "url": "https://api.seerapi.com/v1/skill/21312"
        },
        {
          "id": 21344,
          "url": "https://api.seerapi.com/v1/skill/21344"
        },
        {
          "id": 21356,
          "url": "https://api.seerapi.com/v1/skill/21356"
        },
        {
          "id": 21359,
          "url": "https://api.seerapi.com/v1/skill/21359"
        },
        {
          "id": 21381,
          "url": "https://api.seerapi.com/v1/skill/21381"
        },
        {
          "id": 21397,
          "url": "https://api.seerapi.com/v1/skill/21397"
        },
        {
          "id": 21399,
          "url": "https://api.seerapi.com/v1/skill/21399"
        },
        {
          "id": 21446,
          "url": "https://api.seerapi.com/v1/skill/21446"
        },
        {
          "id": 21448,
          "url": "https://api.seerapi.com/v1/skill/21448"
        },
        {
          "id": 21462,
          "url": "https://api.seerapi.com/v1/skill/21462"
        },
        {
          "id": 21479,
          "url": "https://api.seerapi.com/v1/skill/21479"
        },
        {
          "id": 21483,
          "url": "https://api.seerapi.com/v1/skill/21483"
        },
        {
          "id": 21507,
          "url": "https://api.seerapi.com/v1/skill/21507"
        },
        {
          "id": 21526,
          "url": "https://api.seerapi.com/v1/skill/21526"
        },
        {
          "id": 21540,
          "url": "https://api.seerapi.com/v1/skill/21540"
        },
        {
          "id": 21541,
          "url": "https://api.seerapi.com/v1/skill/21541"
        },
        {
          "id": 21545,
          "url": "https://api.seerapi.com/v1/skill/21545"
        },
        {
          "id": 21572,
          "url": "https://api.seerapi.com/v1/skill/21572"
        },
        {
          "id": 21591,
          "url": "https://api.seerapi.com/v1/skill/21591"
        },
        {
          "id": 21599,
          "url": "https://api.seerapi.com/v1/skill/21599"
        },
        {
          "id": 21612,
          "url": "https://api.seerapi.com/v1/skill/21612"
        },
        {
          "id": 21634,
          "url": "https://api.seerapi.com/v1/skill/21634"
        },
        {
          "id": 21648,
          "url": "https://api.seerapi.com/v1/skill/21648"
        },
        {
          "id": 21654,
          "url": "https://api.seerapi.com/v1/skill/21654"
        },
        {
          "id": 21682,
          "url": "https://api.seerapi.com/v1/skill/21682"
        },
        {
          "id": 21686,
          "url": "https://api.seerapi.com/v1/skill/21686"
        },
        {
          "id": 21704,
          "url": "https://api.seerapi.com/v1/skill/21704"
        },
        {
          "id": 21741,
          "url": "https://api.seerapi.com/v1/skill/21741"
        },
        {
          "id": 21743,
          "url": "https://api.seerapi.com/v1/skill/21743"
        },
        {
          "id": 21830,
          "url": "https://api.seerapi.com/v1/skill/21830"
        },
        {
          "id": 21876,
          "url": "https://api.seerapi.com/v1/skill/21876"
        },
        {
          "id": 21892,
          "url": "https://api.seerapi.com/v1/skill/21892"
        },
        {
          "id": 21900,
          "url": "https://api.seerapi.com/v1/skill/21900"
        },
        {
          "id": 21918,
          "url": "https://api.seerapi.com/v1/skill/21918"
        },
        {
          "id": 21939,
          "url": "https://api.seerapi.com/v1/skill/21939"
        },
        {
          "id": 21960,
          "url": "https://api.seerapi.com/v1/skill/21960"
        },
        {
          "id": 21982,
          "url": "https://api.seerapi.com/v1/skill/21982"
        },
        {
          "id": 22003,
          "url": "https://api.seerapi.com/v1/skill/22003"
        },
        {
          "id": 22027,
          "url": "https://api.seerapi.com/v1/skill/22027"
        },
        {
          "id": 22030,
          "url": "https://api.seerapi.com/v1/skill/22030"
        },
        {
          "id": 22060,
          "url": "https://api.seerapi.com/v1/skill/22060"
        },
        {
          "id": 22072,
          "url": "https://api.seerapi.com/v1/skill/22072"
        },
        {
          "id": 22141,
          "url": "https://api.seerapi.com/v1/skill/22141"
        },
        {
          "id": 22198,
          "url": "https://api.seerapi.com/v1/skill/22198"
        },
        {
          "id": 22229,
          "url": "https://api.seerapi.com/v1/skill/22229"
        },
        {
          "id": 22332,
          "url": "https://api.seerapi.com/v1/skill/22332"
        },
        {
          "id": 22339,
          "url": "https://api.seerapi.com/v1/skill/22339"
        },
        {
          "id": 22342,
          "url": "https://api.seerapi.com/v1/skill/22342"
        },
        {
          "id": 22353,
          "url": "https://api.seerapi.com/v1/skill/22353"
        },
        {
          "id": 22367,
          "url": "https://api.seerapi.com/v1/skill/22367"
        },
        {
          "id": 22375,
          "url": "https://api.seerapi.com/v1/skill/22375"
        },
        {
          "id": 22397,
          "url": "https://api.seerapi.com/v1/skill/22397"
        },
        {
          "id": 22431,
          "url": "https://api.seerapi.com/v1/skill/22431"
        },
        {
          "id": 22476,
          "url": "https://api.seerapi.com/v1/skill/22476"
        },
        {
          "id": 22496,
          "url": "https://api.seerapi.com/v1/skill/22496"
        },
        {
          "id": 22542,
          "url": "https://api.seerapi.com/v1/skill/22542"
        },
        {
          "id": 22544,
          "url": "https://api.seerapi.com/v1/skill/22544"
        },
        {
          "id": 22549,
          "url": "https://api.seerapi.com/v1/skill/22549"
        },
        {
          "id": 22572,
          "url": "https://api.seerapi.com/v1/skill/22572"
        },
        {
          "id": 22575,
          "url": "https://api.seerapi.com/v1/skill/22575"
        },
        {
          "id": 22583,
          "url": "https://api.seerapi.com/v1/skill/22583"
        },
        {
          "id": 22596,
          "url": "https://api.seerapi.com/v1/skill/22596"
        },
        {
          "id": 22599,
          "url": "https://api.seerapi.com/v1/skill/22599"
        },
        {
          "id": 22608,
          "url": "https://api.seerapi.com/v1/skill/22608"
        },
        {
          "id": 22633,
          "url": "https://api.seerapi.com/v1/skill/22633"
        },
        {
          "id": 22640,
          "url": "https://api.seerapi.com/v1/skill/22640"
        },
        {
          "id": 22662,
          "url": "https://api.seerapi.com/v1/skill/22662"
        },
        {
          "id": 22669,
          "url": "https://api.seerapi.com/v1/skill/22669"
        },
        {
          "id": 22681,
          "url": "https://api.seerapi.com/v1/skill/22681"
        },
        {
          "id": 22693,
          "url": "https://api.seerapi.com/v1/skill/22693"
        },
        {
          "id": 22701,
          "url": "https://api.seerapi.com/v1/skill/22701"
        },
        {
          "id": 22721,
          "url": "https://api.seerapi.com/v1/skill/22721"
        },
        {
          "id": 22734,
          "url": "https://api.seerapi.com/v1/skill/22734"
        },
        {
          "id": 22751,
          "url": "https://api.seerapi.com/v1/skill/22751"
        },
        {
          "id": 22762,
          "url": "https://api.seerapi.com/v1/skill/22762"
        },
        {
          "id": 22785,
          "url": "https://api.seerapi.com/v1/skill/22785"
        },
        {
          "id": 22810,
          "url": "https://api.seerapi.com/v1/skill/22810"
        },
        {
          "id": 22825,
          "url": "https://api.seerapi.com/v1/skill/22825"
        },
        {
          "id": 22836,
          "url": "https://api.seerapi.com/v1/skill/22836"
        },
        {
          "id": 22857,
          "url": "https://api.seerapi.com/v1/skill/22857"
        },
        {
          "id": 22879,
          "url": "https://api.seerapi.com/v1/skill/22879"
        },
        {
          "id": 22881,
          "url": "https://api.seerapi.com/v1/skill/22881"
        },
        {
          "id": 22890,
          "url": "https://api.seerapi.com/v1/skill/22890"
        },
        {
          "id": 22903,
          "url": "https://api.seerapi.com/v1/skill/22903"
        },
        {
          "id": 22921,
          "url": "https://api.seerapi.com/v1/skill/22921"
        },
        {
          "id": 22927,
          "url": "https://api.seerapi.com/v1/skill/22927"
        },
        {
          "id": 22928,
          "url": "https://api.seerapi.com/v1/skill/22928"
        },
        {
          "id": 22933,
          "url": "https://api.seerapi.com/v1/skill/22933"
        },
        {
          "id": 22935,
          "url": "https://api.seerapi.com/v1/skill/22935"
        },
        {
          "id": 22958,
          "url": "https://api.seerapi.com/v1/skill/22958"
        },
        {
          "id": 22980,
          "url": "https://api.seerapi.com/v1/skill/22980"
        },
        {
          "id": 22986,
          "url": "https://api.seerapi.com/v1/skill/22986"
        },
        {
          "id": 22994,
          "url": "https://api.seerapi.com/v1/skill/22994"
        },
        {
          "id": 23006,
          "url": "https://api.seerapi.com/v1/skill/23006"
        },
        {
          "id": 23023,
          "url": "https://api.seerapi.com/v1/skill/23023"
        },
        {
          "id": 23031,
          "url": "https://api.seerapi.com/v1/skill/23031"
        },
        {
          "id": 23048,
          "url": "https://api.seerapi.com/v1/skill/23048"
        },
        {
          "id": 23052,
          "url": "https://api.seerapi.com/v1/skill/23052"
        },
        {
          "id": 23057,
          "url": "https://api.seerapi.com/v1/skill/23057"
        },
        {
          "id": 23069,
          "url": "https://api.seerapi.com/v1/skill/23069"
        },
        {
          "id": 23080,
          "url": "https://api.seerapi.com/v1/skill/23080"
        },
        {
          "id": 23087,
          "url": "https://api.seerapi.com/v1/skill/23087"
        },
        {
          "id": 23089,
          "url": "https://api.seerapi.com/v1/skill/23089"
        },
        {
          "id": 23115,
          "url": "https://api.seerapi.com/v1/skill/23115"
        },
        {
          "id": 23116,
          "url": "https://api.seerapi.com/v1/skill/23116"
        },
        {
          "id": 23119,
          "url": "https://api.seerapi.com/v1/skill/23119"
        },
        {
          "id": 23143,
          "url": "https://api.seerapi.com/v1/skill/23143"
        },
        {
          "id": 23166,
          "url": "https://api.seerapi.com/v1/skill/23166"
        },
        {
          "id": 23180,
          "url": "https://api.seerapi.com/v1/skill/23180"
        },
        {
          "id": 23194,
          "url": "https://api.seerapi.com/v1/skill/23194"
        },
        {
          "id": 23213,
          "url": "https://api.seerapi.com/v1/skill/23213"
        },
        {
          "id": 23226,
          "url": "https://api.seerapi.com/v1/skill/23226"
        },
        {
          "id": 23227,
          "url": "https://api.seerapi.com/v1/skill/23227"
        },
        {
          "id": 23239,
          "url": "https://api.seerapi.com/v1/skill/23239"
        },
        {
          "id": 23263,
          "url": "https://api.seerapi.com/v1/skill/23263"
        },
        {
          "id": 23271,
          "url": "https://api.seerapi.com/v1/skill/23271"
        },
        {
          "id": 23279,
          "url": "https://api.seerapi.com/v1/skill/23279"
        },
        {
          "id": 23285,
          "url": "https://api.seerapi.com/v1/skill/23285"
        },
        {
          "id": 23313,
          "url": "https://api.seerapi.com/v1/skill/23313"
        },
        {
          "id": 23322,
          "url": "https://api.seerapi.com/v1/skill/23322"
        },
        {
          "id": 23334,
          "url": "https://api.seerapi.com/v1/skill/23334"
        },
        {
          "id": 23364,
          "url": "https://api.seerapi.com/v1/skill/23364"
        },
        {
          "id": 23379,
          "url": "https://api.seerapi.com/v1/skill/23379"
        },
        {
          "id": 23388,
          "url": "https://api.seerapi.com/v1/skill/23388"
        },
        {
          "id": 23390,
          "url": "https://api.seerapi.com/v1/skill/23390"
        },
        {
          "id": 23395,
          "url": "https://api.seerapi.com/v1/skill/23395"
        },
        {
          "id": 23397,
          "url": "https://api.seerapi.com/v1/skill/23397"
        },
        {
          "id": 23420,
          "url": "https://api.seerapi.com/v1/skill/23420"
        },
        {
          "id": 23425,
          "url": "https://api.seerapi.com/v1/skill/23425"
        },
        {
          "id": 23428,
          "url": "https://api.seerapi.com/v1/skill/23428"
        },
        {
          "id": 23436,
          "url": "https://api.seerapi.com/v1/skill/23436"
        },
        {
          "id": 23445,
          "url": "https://api.seerapi.com/v1/skill/23445"
        },
        {
          "id": 23465,
          "url": "https://api.seerapi.com/v1/skill/23465"
        },
        {
          "id": 23498,
          "url": "https://api.seerapi.com/v1/skill/23498"
        },
        {
          "id": 23543,
          "url": "https://api.seerapi.com/v1/skill/23543"
        },
        {
          "id": 23556,
          "url": "https://api.seerapi.com/v1/skill/23556"
        },
        {
          "id": 23562,
          "url": "https://api.seerapi.com/v1/skill/23562"
        },
        {
          "id": 23565,
          "url": "https://api.seerapi.com/v1/skill/23565"
        },
        {
          "id": 23584,
          "url": "https://api.seerapi.com/v1/skill/23584"
        },
        {
          "id": 23589,
          "url": "https://api.seerapi.com/v1/skill/23589"
        },
        {
          "id": 23599,
          "url": "https://api.seerapi.com/v1/skill/23599"
        },
        {
          "id": 23602,
          "url": "https://api.seerapi.com/v1/skill/23602"
        },
        {
          "id": 23604,
          "url": "https://api.seerapi.com/v1/skill/23604"
        },
        {
          "id": 23615,
          "url": "https://api.seerapi.com/v1/skill/23615"
        },
        {
          "id": 23629,
          "url": "https://api.seerapi.com/v1/skill/23629"
        },
        {
          "id": 23631,
          "url": "https://api.seerapi.com/v1/skill/23631"
        },
        {
          "id": 23666,
          "url": "https://api.seerapi.com/v1/skill/23666"
        },
        {
          "id": 23668,
          "url": "https://api.seerapi.com/v1/skill/23668"
        },
        {
          "id": 23677,
          "url": "https://api.seerapi.com/v1/skill/23677"
        },
        {
          "id": 23696,
          "url": "https://api.seerapi.com/v1/skill/23696"
        },
        {
          "id": 23725,
          "url": "https://api.seerapi.com/v1/skill/23725"
        },
        {
          "id": 23728,
          "url": "https://api.seerapi.com/v1/skill/23728"
        },
        {
          "id": 23741,
          "url": "https://api.seerapi.com/v1/skill/23741"
        },
        {
          "id": 23752,
          "url": "https://api.seerapi.com/v1/skill/23752"
        },
        {
          "id": 23758,
          "url": "https://api.seerapi.com/v1/skill/23758"
        },
        {
          "id": 23760,
          "url": "https://api.seerapi.com/v1/skill/23760"
        },
        {
          "id": 23766,
          "url": "https://api.seerapi.com/v1/skill/23766"
        },
        {
          "id": 23777,
          "url": "https://api.seerapi.com/v1/skill/23777"
        },
        {
          "id": 23783,
          "url": "https://api.seerapi.com/v1/skill/23783"
        },
        {
          "id": 23786,
          "url": "https://api.seerapi.com/v1/skill/23786"
        },
        {
          "id": 23803,
          "url": "https://api.seerapi.com/v1/skill/23803"
        },
        {
          "id": 23808,
          "url": "https://api.seerapi.com/v1/skill/23808"
        },
        {
          "id": 23809,
          "url": "https://api.seerapi.com/v1/skill/23809"
        },
        {
          "id": 23812,
          "url": "https://api.seerapi.com/v1/skill/23812"
        },
        {
          "id": 23825,
          "url": "https://api.seerapi.com/v1/skill/23825"
        },
        {
          "id": 23834,
          "url": "https://api.seerapi.com/v1/skill/23834"
        },
        {
          "id": 23858,
          "url": "https://api.seerapi.com/v1/skill/23858"
        },
        {
          "id": 23873,
          "url": "https://api.seerapi.com/v1/skill/23873"
        },
        {
          "id": 23926,
          "url": "https://api.seerapi.com/v1/skill/23926"
        },
        {
          "id": 23962,
          "url": "https://api.seerapi.com/v1/skill/23962"
        },
        {
          "id": 23987,
          "url": "https://api.seerapi.com/v1/skill/23987"
        },
        {
          "id": 24016,
          "url": "https://api.seerapi.com/v1/skill/24016"
        },
        {
          "id": 24210,
          "url": "https://api.seerapi.com/v1/skill/24210"
        },
        {
          "id": 24218,
          "url": "https://api.seerapi.com/v1/skill/24218"
        },
        {
          "id": 24261,
          "url": "https://api.seerapi.com/v1/skill/24261"
        },
        {
          "id": 24521,
          "url": "https://api.seerapi.com/v1/skill/24521"
        },
        {
          "id": 24640,
          "url": "https://api.seerapi.com/v1/skill/24640"
        },
        {
          "id": 24669,
          "url": "https://api.seerapi.com/v1/skill/24669"
        },
        {
          "id": 24727,
          "url": "https://api.seerapi.com/v1/skill/24727"
        },
        {
          "id": 24895,
          "url": "https://api.seerapi.com/v1/skill/24895"
        },
        {
          "id": 24907,
          "url": "https://api.seerapi.com/v1/skill/24907"
        },
        {
          "id": 24964,
          "url": "https://api.seerapi.com/v1/skill/24964"
        },
        {
          "id": 25018,
          "url": "https://api.seerapi.com/v1/skill/25018"
        },
        {
          "id": 25058,
          "url": "https://api.seerapi.com/v1/skill/25058"
        },
        {
          "id": 25213,
          "url": "https://api.seerapi.com/v1/skill/25213"
        },
        {
          "id": 25244,
          "url": "https://api.seerapi.com/v1/skill/25244"
        },
        {
          "id": 25290,
          "url": "https://api.seerapi.com/v1/skill/25290"
        },
        {
          "id": 25303,
          "url": "https://api.seerapi.com/v1/skill/25303"
        },
        {
          "id": 25375,
          "url": "https://api.seerapi.com/v1/skill/25375"
        },
        {
          "id": 25379,
          "url": "https://api.seerapi.com/v1/skill/25379"
        },
        {
          "id": 25431,
          "url": "https://api.seerapi.com/v1/skill/25431"
        },
        {
          "id": 25534,
          "url": "https://api.seerapi.com/v1/skill/25534"
        },
        {
          "id": 25539,
          "url": "https://api.seerapi.com/v1/skill/25539"
        },
        {
          "id": 25548,
          "url": "https://api.seerapi.com/v1/skill/25548"
        },
        {
          "id": 25578,
          "url": "https://api.seerapi.com/v1/skill/25578"
        },
        {
          "id": 25602,
          "url": "https://api.seerapi.com/v1/skill/25602"
        },
        {
          "id": 25628,
          "url": "https://api.seerapi.com/v1/skill/25628"
        },
        {
          "id": 25665,
          "url": "https://api.seerapi.com/v1/skill/25665"
        },
        {
          "id": 25689,
          "url": "https://api.seerapi.com/v1/skill/25689"
        },
        {
          "id": 25750,
          "url": "https://api.seerapi.com/v1/skill/25750"
        },
        {
          "id": 25770,
          "url": "https://api.seerapi.com/v1/skill/25770"
        },
        {
          "id": 25784,
          "url": "https://api.seerapi.com/v1/skill/25784"
        },
        {
          "id": 25887,
          "url": "https://api.seerapi.com/v1/skill/25887"
        },
        {
          "id": 25890,
          "url": "https://api.seerapi.com/v1/skill/25890"
        },
        {
          "id": 25901,
          "url": "https://api.seerapi.com/v1/skill/25901"
        },
        {
          "id": 25924,
          "url": "https://api.seerapi.com/v1/skill/25924"
        },
        {
          "id": 25935,
          "url": "https://api.seerapi.com/v1/skill/25935"
        },
        {
          "id": 25972,
          "url": "https://api.seerapi.com/v1/skill/25972"
        },
        {
          "id": 25985,
          "url": "https://api.seerapi.com/v1/skill/25985"
        },
        {
          "id": 25991,
          "url": "https://api.seerapi.com/v1/skill/25991"
        },
        {
          "id": 25996,
          "url": "https://api.seerapi.com/v1/skill/25996"
        },
        {
          "id": 26022,
          "url": "https://api.seerapi.com/v1/skill/26022"
        },
        {
          "id": 26024,
          "url": "https://api.seerapi.com/v1/skill/26024"
        },
        {
          "id": 26054,
          "url": "https://api.seerapi.com/v1/skill/26054"
        },
        {
          "id": 26109,
          "url": "https://api.seerapi.com/v1/skill/26109"
        },
        {
          "id": 26121,
          "url": "https://api.seerapi.com/v1/skill/26121"
        },
        {
          "id": 26138,
          "url": "https://api.seerapi.com/v1/skill/26138"
        },
        {
          "id": 26144,
          "url": "https://api.seerapi.com/v1/skill/26144"
        },
        {
          "id": 26192,
          "url": "https://api.seerapi.com/v1/skill/26192"
        },
        {
          "id": 26210,
          "url": "https://api.seerapi.com/v1/skill/26210"
        },
        {
          "id": 26275,
          "url": "https://api.seerapi.com/v1/skill/26275"
        },
        {
          "id": 26291,
          "url": "https://api.seerapi.com/v1/skill/26291"
        },
        {
          "id": 26307,
          "url": "https://api.seerapi.com/v1/skill/26307"
        },
        {
          "id": 26330,
          "url": "https://api.seerapi.com/v1/skill/26330"
        },
        {
          "id": 26337,
          "url": "https://api.seerapi.com/v1/skill/26337"
        },
        {
          "id": 26358,
          "url": "https://api.seerapi.com/v1/skill/26358"
        },
        {
          "id": 26367,
          "url": "https://api.seerapi.com/v1/skill/26367"
        },
        {
          "id": 26379,
          "url": "https://api.seerapi.com/v1/skill/26379"
        },
        {
          "id": 26387,
          "url": "https://api.seerapi.com/v1/skill/26387"
        },
        {
          "id": 26391,
          "url": "https://api.seerapi.com/v1/skill/26391"
        },
        {
          "id": 26393,
          "url": "https://api.seerapi.com/v1/skill/26393"
        },
        {
          "id": 26403,
          "url": "https://api.seerapi.com/v1/skill/26403"
        },
        {
          "id": 26414,
          "url": "https://api.seerapi.com/v1/skill/26414"
        },
        {
          "id": 26423,
          "url": "https://api.seerapi.com/v1/skill/26423"
        },
        {
          "id": 26433,
          "url": "https://api.seerapi.com/v1/skill/26433"
        },
        {
          "id": 26455,
          "url": "https://api.seerapi.com/v1/skill/26455"
        },
        {
          "id": 26476,
          "url": "https://api.seerapi.com/v1/skill/26476"
        },
        {
          "id": 26483,
          "url": "https://api.seerapi.com/v1/skill/26483"
        },
        {
          "id": 26486,
          "url": "https://api.seerapi.com/v1/skill/26486"
        },
        {
          "id": 26519,
          "url": "https://api.seerapi.com/v1/skill/26519"
        },
        {
          "id": 26523,
          "url": "https://api.seerapi.com/v1/skill/26523"
        },
        {
          "id": 26538,
          "url": "https://api.seerapi.com/v1/skill/26538"
        },
        {
          "id": 26571,
          "url": "https://api.seerapi.com/v1/skill/26571"
        },
        {
          "id": 26668,
          "url": "https://api.seerapi.com/v1/skill/26668"
        },
        {
          "id": 26675,
          "url": "https://api.seerapi.com/v1/skill/26675"
        },
        {
          "id": 26678,
          "url": "https://api.seerapi.com/v1/skill/26678"
        },
        {
          "id": 26697,
          "url": "https://api.seerapi.com/v1/skill/26697"
        },
        {
          "id": 26704,
          "url": "https://api.seerapi.com/v1/skill/26704"
        },
        {
          "id": 26706,
          "url": "https://api.seerapi.com/v1/skill/26706"
        },
        {
          "id": 26718,
          "url": "https://api.seerapi.com/v1/skill/26718"
        },
        {
          "id": 26724,
          "url": "https://api.seerapi.com/v1/skill/26724"
        },
        {
          "id": 26740,
          "url": "https://api.seerapi.com/v1/skill/26740"
        },
        {
          "id": 26747,
          "url": "https://api.seerapi.com/v1/skill/26747"
        },
        {
          "id": 26758,
          "url": "https://api.seerapi.com/v1/skill/26758"
        },
        {
          "id": 26773,
          "url": "https://api.seerapi.com/v1/skill/26773"
        },
        {
          "id": 26784,
          "url": "https://api.seerapi.com/v1/skill/26784"
        },
        {
          "id": 26787,
          "url": "https://api.seerapi.com/v1/skill/26787"
        },
        {
          "id": 26799,
          "url": "https://api.seerapi.com/v1/skill/26799"
        },
        {
          "id": 26815,
          "url": "https://api.seerapi.com/v1/skill/26815"
        },
        {
          "id": 26879,
          "url": "https://api.seerapi.com/v1/skill/26879"
        },
        {
          "id": 26900,
          "url": "https://api.seerapi.com/v1/skill/26900"
        },
        {
          "id": 26910,
          "url": "https://api.seerapi.com/v1/skill/26910"
        },
        {
          "id": 26927,
          "url": "https://api.seerapi.com/v1/skill/26927"
        },
        {
          "id": 27032,
          "url": "https://api.seerapi.com/v1/skill/27032"
        },
        {
          "id": 27060,
          "url": "https://api.seerapi.com/v1/skill/27060"
        },
        {
          "id": 27073,
          "url": "https://api.seerapi.com/v1/skill/27073"
        },
        {
          "id": 27164,
          "url": "https://api.seerapi.com/v1/skill/27164"
        },
        {
          "id": 27212,
          "url": "https://api.seerapi.com/v1/skill/27212"
        },
        {
          "id": 27222,
          "url": "https://api.seerapi.com/v1/skill/27222"
        },
        {
          "id": 27223,
          "url": "https://api.seerapi.com/v1/skill/27223"
        },
        {
          "id": 27248,
          "url": "https://api.seerapi.com/v1/skill/27248"
        },
        {
          "id": 27260,
          "url": "https://api.seerapi.com/v1/skill/27260"
        },
        {
          "id": 27266,
          "url": "https://api.seerapi.com/v1/skill/27266"
        },
        {
          "id": 27282,
          "url": "https://api.seerapi.com/v1/skill/27282"
        },
        {
          "id": 27299,
          "url": "https://api.seerapi.com/v1/skill/27299"
        },
        {
          "id": 27317,
          "url": "https://api.seerapi.com/v1/skill/27317"
        },
        {
          "id": 27368,
          "url": "https://api.seerapi.com/v1/skill/27368"
        },
        {
          "id": 27389,
          "url": "https://api.seerapi.com/v1/skill/27389"
        },
        {
          "id": 27408,
          "url": "https://api.seerapi.com/v1/skill/27408"
        },
        {
          "id": 27465,
          "url": "https://api.seerapi.com/v1/skill/27465"
        },
        {
          "id": 27517,
          "url": "https://api.seerapi.com/v1/skill/27517"
        },
        {
          "id": 27522,
          "url": "https://api.seerapi.com/v1/skill/27522"
        },
        {
          "id": 27537,
          "url": "https://api.seerapi.com/v1/skill/27537"
        },
        {
          "id": 27553,
          "url": "https://api.seerapi.com/v1/skill/27553"
        },
        {
          "id": 27562,
          "url": "https://api.seerapi.com/v1/skill/27562"
        },
        {
          "id": 27570,
          "url": "https://api.seerapi.com/v1/skill/27570"
        },
        {
          "id": 27638,
          "url": "https://api.seerapi.com/v1/skill/27638"
        },
        {
          "id": 27640,
          "url": "https://api.seerapi.com/v1/skill/27640"
        },
        {
          "id": 27686,
          "url": "https://api.seerapi.com/v1/skill/27686"
        },
        {
          "id": 27700,
          "url": "https://api.seerapi.com/v1/skill/27700"
        },
        {
          "id": 27732,
          "url": "https://api.seerapi.com/v1/skill/27732"
        },
        {
          "id": 27757,
          "url": "https://api.seerapi.com/v1/skill/27757"
        },
        {
          "id": 27765,
          "url": "https://api.seerapi.com/v1/skill/27765"
        },
        {
          "id": 27827,
          "url": "https://api.seerapi.com/v1/skill/27827"
        },
        {
          "id": 27874,
          "url": "https://api.seerapi.com/v1/skill/27874"
        },
        {
          "id": 27901,
          "url": "https://api.seerapi.com/v1/skill/27901"
        },
        {
          "id": 27931,
          "url": "https://api.seerapi.com/v1/skill/27931"
        },
        {
          "id": 27947,
          "url": "https://api.seerapi.com/v1/skill/27947"
        },
        {
          "id": 27956,
          "url": "https://api.seerapi.com/v1/skill/27956"
        },
        {
          "id": 27966,
          "url": "https://api.seerapi.com/v1/skill/27966"
        },
        {
          "id": 27973,
          "url": "https://api.seerapi.com/v1/skill/27973"
        },
        {
          "id": 28001,
          "url": "https://api.seerapi.com/v1/skill/28001"
        },
        {
          "id": 28008,
          "url": "https://api.seerapi.com/v1/skill/28008"
        },
        {
          "id": 28018,
          "url": "https://api.seerapi.com/v1/skill/28018"
        },
        {
          "id": 28042,
          "url": "https://api.seerapi.com/v1/skill/28042"
        },
        {
          "id": 28083,
          "url": "https://api.seerapi.com/v1/skill/28083"
        },
        {
          "id": 28126,
          "url": "https://api.seerapi.com/v1/skill/28126"
        },
        {
          "id": 28133,
          "url": "https://api.seerapi.com/v1/skill/28133"
        },
        {
          "id": 28175,
          "url": "https://api.seerapi.com/v1/skill/28175"
        },
        {
          "id": 28187,
          "url": "https://api.seerapi.com/v1/skill/28187"
        },
        {
          "id": 28190,
          "url": "https://api.seerapi.com/v1/skill/28190"
        },
        {
          "id": 28208,
          "url": "https://api.seerapi.com/v1/skill/28208"
        },
        {
          "id": 28238,
          "url": "https://api.seerapi.com/v1/skill/28238"
        },
        {
          "id": 28309,
          "url": "https://api.seerapi.com/v1/skill/28309"
        },
        {
          "id": 28397,
          "url": "https://api.seerapi.com/v1/skill/28397"
        },
        {
          "id": 28413,
          "url": "https://api.seerapi.com/v1/skill/28413"
        },
        {
          "id": 28429,
          "url": "https://api.seerapi.com/v1/skill/28429"
        },
        {
          "id": 28575,
          "url": "https://api.seerapi.com/v1/skill/28575"
        },
        {
          "id": 28623,
          "url": "https://api.seerapi.com/v1/skill/28623"
        },
        {
          "id": 28647,
          "url": "https://api.seerapi.com/v1/skill/28647"
        },
        {
          "id": 28652,
          "url": "https://api.seerapi.com/v1/skill/28652"
        },
        {
          "id": 28698,
          "url": "https://api.seerapi.com/v1/skill/28698"
        },
        {
          "id": 28717,
          "url": "https://api.seerapi.com/v1/skill/28717"
        },
        {
          "id": 28774,
          "url": "https://api.seerapi.com/v1/skill/28774"
        },
        {
          "id": 28838,
          "url": "https://api.seerapi.com/v1/skill/28838"
        },
        {
          "id": 28880,
          "url": "https://api.seerapi.com/v1/skill/28880"
        },
        {
          "id": 28898,
          "url": "https://api.seerapi.com/v1/skill/28898"
        },
        {
          "id": 28907,
          "url": "https://api.seerapi.com/v1/skill/28907"
        },
        {
          "id": 28950,
          "url": "https://api.seerapi.com/v1/skill/28950"
        },
        {
          "id": 28971,
          "url": "https://api.seerapi.com/v1/skill/28971"
        },
        {
          "id": 29031,
          "url": "https://api.seerapi.com/v1/skill/29031"
        },
        {
          "id": 29050,
          "url": "https://api.seerapi.com/v1/skill/29050"
        },
        {
          "id": 29110,
          "url": "https://api.seerapi.com/v1/skill/29110"
        },
        {
          "id": 29160,
          "url": "https://api.seerapi.com/v1/skill/29160"
        },
        {
          "id": 29164,
          "url": "https://api.seerapi.com/v1/skill/29164"
        },
        {
          "id": 29204,
          "url": "https://api.seerapi.com/v1/skill/29204"
        },
        {
          "id": 29248,
          "url": "https://api.seerapi.com/v1/skill/29248"
        },
        {
          "id": 29273,
          "url": "https://api.seerapi.com/v1/skill/29273"
        },
        {
          "id": 29298,
          "url": "https://api.seerapi.com/v1/skill/29298"
        },
        {
          "id": 29310,
          "url": "https://api.seerapi.com/v1/skill/29310"
        },
        {
          "id": 29333,
          "url": "https://api.seerapi.com/v1/skill/29333"
        },
        {
          "id": 29340,
          "url": "https://api.seerapi.com/v1/skill/29340"
        },
        {
          "id": 29347,
          "url": "https://api.seerapi.com/v1/skill/29347"
        },
        {
          "id": 29373,
          "url": "https://api.seerapi.com/v1/skill/29373"
        },
        {
          "id": 29380,
          "url": "https://api.seerapi.com/v1/skill/29380"
        },
        {
          "id": 29428,
          "url": "https://api.seerapi.com/v1/skill/29428"
        },
        {
          "id": 35862,
          "url": "https://api.seerapi.com/v1/skill/35862"
        },
        {
          "id": 38085,
          "url": "https://api.seerapi.com/v1/skill/38085"
        },
        {
          "id": 38226,
          "url": "https://api.seerapi.com/v1/skill/38226"
        }
      ],
      "tag": [
        {
          "id": 8553,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/8553"
        }
      ],
      "hash": "a88e6bf3"
    },
    "cacheFile": "research/3665-source-check-external.json",
    "loadedAt": "2026-10-13T14:46:22.916Z",
    "storage": "existing-cache"
  }
]
```

已查现有用户确认、SeerAPI、底层魂印元数据及BWIKI，后两者原始URL/revision见上述本地证据。

具体缺口：API模板58 args_num=1但本实例args=[2,2]。旧3788、4289同技能hash的授权明确绑定精灵版本，当前4333正式校验仍拒绝，不扩大授权。

问题与解释差异：请确认当前4333/pet ad8a14b6、21741/4d5b40d1、58/参数[2,2]的末尾2是否同样无意义，并是否授权最小精确兼容：仅追加本精灵版本到数据/运行时/正式审核校验，不改原始来源，不放宽其他实例。

影响、已完成/被阻塞：仅21741该实例阻止完整部署，其他28招基础与其余实例已独立测试。

我的回答：是，同样无意义；授权

### Q-N20-4333-002 — 强化1851两回合低PP命中失效在登场取样还是持续判定

完整原文、实例、来源URL/hash/加载时间：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1851",
    "data": {
      "id": 1851,
      "desc": "自身每次登场后2回合内令对手PP值不高于最大PP值1/3的技能命中效果失效；对手每次登场后随机1个技能PP值归零且自身下2次攻击必定打出致命一击|回合开始时开启逆维矩阵：若对手存在攻击技能PP值不高于最大PP值1/3则当回合自身受到的攻击伤害、固定伤害减少50%，若对手存在属性技能PP值不高于最大PP值1/3则当回合结束后恢复自身最大体力的1/3|自身攻击后，若本次攻击打出了致命一击则令对手随机1个技能PP值归0，若本次攻击未打出致命一击则吸取对手最大体力的1/3（所有PP值计算向上取整，所有效果boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身每次登场时令对手所有PP值不高于最大PP值1/3（向上取整）的技能下2回合<color=#64F9FA>命中效果失效</color>\r\n<indent=16><sprite=3><indent=32>对手每次登场后随机1个技能PP值<color=#64F9FA>归零</color>且自身下2次攻击必定<color=#64F9FA>打出致命一击</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时开启逆维矩阵：\r\n<indent=32><sprite=4><indent=48>若对手存在攻击技能PP值不高于最大PP值1/3（向上取整）则当回合受到的<b>攻击伤害、固定伤害</b><color=#64F9FA>减少</color>50%\r\n<indent=32><sprite=4><indent=48>若对手存在属性技能PP值不高于最大PP值1/3（向上取整）则当回合结束后<color=#64F9FA>恢复</color>自身最大体力的1/3\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能打出致命一击则令对手随机1个技能<b>PP值</b><color=#64F9FA>归零</color>\r\n<indent=16><sprite=3><indent=32>自身攻击技能未打出致命一击则<color=#64F9FA>吸取</color>对手最大体力的1/3",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4333,
          "url": "https://api.seerapi.com/v1/pet/4333"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          0
        ],
        "effect": {
          "id": 2245,
          "url": "https://api.seerapi.com/v1/eid_effect/2245"
        }
      },
      "effect_alias": "alias_2245_1_0",
      "tag": [
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        },
        {
          "id": 4,
          "url": "https://api.seerapi.com/v1/soulmark_tag/4"
        },
        {
          "id": 16,
          "url": "https://api.seerapi.com/v1/soulmark_tag/16"
        }
      ],
      "intensified_to": null,
      "from": {
        "id": 1559,
        "url": "https://api.seerapi.com/v1/soulmark/1559"
      },
      "advance": null,
      "hash": "feedc462"
    },
    "loadedAt": "2026-10-21T14:34:56.466Z",
    "storage": "refreshed"
  }
]
```

已查现有用户确认、SeerAPI、底层魂印元数据及BWIKI，后两者原始URL/revision见上述本地证据。

具体缺口：desc写“每次登场后2回合内令…PP值不高于…命中效果失效”，格式化写“每次登场时令…技能下2回合命中效果失效”，未说明中途PP跨阈值是否改变名单。底层2245仅参数数量，BWIKI无算例。

问题与解释差异：登场时PP高于向上取整1/3、之后用招降到阈值的技能应被封锁吗？登场低PP而之后回PP越过阈值是否解除？请给出取样时机。当前候选按登场记录，但快照和动态结果冲突即显式报错，不猜定。

影响、已完成/被阻塞：强化版命中效果封锁；首次随机清PP/2次必暴、矩阵分支和其他独立词条继续实现。

我的回答：不封锁；不解除；取样实际为登场时；每次登场进行取样；确定这两回合的名单；登场低PP、之后恢复超过阈值的技能，仍按登场名单封锁满两回合

### Q-N20-4333-003 — 两版魂印未打出致命一击的MISS与零攻击伤害口径

完整原文、实例、来源URL/hash/加载时间：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1559",
    "data": {
      "id": 1559,
      "desc": "自身每次登场时令对手所有PP值为零的技能下2回合所附带的效果失效；|对手每次主动切换精灵则触发次元之镜：1、自身下2次攻击必定打出致命一击；2、令登场精灵随机1个技能PP值归零，若为攻击技能则令该技能下2回合造成的攻击伤害降低50%，若为属性技能则恢复自身最大体力的1/3；|自身攻击技能打出致命一击则令对手随机1个技能PP值归零，自身攻击技能未打出致命一击则吸取对手最大体力的1/3（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身每次登场时令对手所有PP值为零的技能下2回合<color=#64F9FA>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手每次主动切换精灵则触发次元之镜：\r\n<indent=16><sprite=3><indent=32>自身下2次攻击必定<color=#64F9FA>打出致命一击</color>\r\n<indent=16><sprite=3><indent=32>令登场精灵随机1个技能<b>PP值</b><color=#64F9FA>归零</color>\r\n<indent=32><sprite=4><indent=48>若为攻击技能则令<b>该技能</b>下2回合造成的<b>攻击伤害</b><color=#64F9FA>降低</color>50%\r\n<indent=32><sprite=4><indent=48>若为属性技能则<color=#64F9FA>恢复</color>自身最大体力的1/3\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能打出致命一击则令对手随机1个技能<b>PP值</b><color=#64F9FA>归零</color>\r\n<indent=16><sprite=3><indent=32>自身攻击技能未打出致命一击则<color=#64F9FA>吸取</color>对手最大体力的1/3",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4333,
          "url": "https://api.seerapi.com/v1/pet/4333"
        }
      ],
      "effect": {
        "effect_args": [
          2,
          2,
          2,
          50,
          3,
          1,
          3,
          1
        ],
        "effect": {
          "id": 1918,
          "url": "https://api.seerapi.com/v1/eid_effect/1918"
        }
      },
      "effect_alias": "alias_1918_2_2_2_50_3_1_3_1",
      "tag": [
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 16,
          "url": "https://api.seerapi.com/v1/soulmark_tag/16"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": {
        "id": 1851,
        "url": "https://api.seerapi.com/v1/soulmark/1851"
      },
      "from": null,
      "advance": null,
      "hash": "5f62f895"
    },
    "loadedAt": "2026-10-21T14:34:49.878Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1851",
    "data": {
      "id": 1851,
      "desc": "自身每次登场后2回合内令对手PP值不高于最大PP值1/3的技能命中效果失效；对手每次登场后随机1个技能PP值归零且自身下2次攻击必定打出致命一击|回合开始时开启逆维矩阵：若对手存在攻击技能PP值不高于最大PP值1/3则当回合自身受到的攻击伤害、固定伤害减少50%，若对手存在属性技能PP值不高于最大PP值1/3则当回合结束后恢复自身最大体力的1/3|自身攻击后，若本次攻击打出了致命一击则令对手随机1个技能PP值归0，若本次攻击未打出致命一击则吸取对手最大体力的1/3（所有PP值计算向上取整，所有效果boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身每次登场时令对手所有PP值不高于最大PP值1/3（向上取整）的技能下2回合<color=#64F9FA>命中效果失效</color>\r\n<indent=16><sprite=3><indent=32>对手每次登场后随机1个技能PP值<color=#64F9FA>归零</color>且自身下2次攻击必定<color=#64F9FA>打出致命一击</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时开启逆维矩阵：\r\n<indent=32><sprite=4><indent=48>若对手存在攻击技能PP值不高于最大PP值1/3（向上取整）则当回合受到的<b>攻击伤害、固定伤害</b><color=#64F9FA>减少</color>50%\r\n<indent=32><sprite=4><indent=48>若对手存在属性技能PP值不高于最大PP值1/3（向上取整）则当回合结束后<color=#64F9FA>恢复</color>自身最大体力的1/3\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能打出致命一击则令对手随机1个技能<b>PP值</b><color=#64F9FA>归零</color>\r\n<indent=16><sprite=3><indent=32>自身攻击技能未打出致命一击则<color=#64F9FA>吸取</color>对手最大体力的1/3",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4333,
          "url": "https://api.seerapi.com/v1/pet/4333"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          0
        ],
        "effect": {
          "id": 2245,
          "url": "https://api.seerapi.com/v1/eid_effect/2245"
        }
      },
      "effect_alias": "alias_2245_1_0",
      "tag": [
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        },
        {
          "id": 4,
          "url": "https://api.seerapi.com/v1/soulmark_tag/4"
        },
        {
          "id": 16,
          "url": "https://api.seerapi.com/v1/soulmark_tag/16"
        }
      ],
      "intensified_to": null,
      "from": {
        "id": 1559,
        "url": "https://api.seerapi.com/v1/soulmark/1559"
      },
      "advance": null,
      "hash": "feedc462"
    },
    "loadedAt": "2026-10-21T14:34:56.466Z",
    "storage": "refreshed"
  }
]
```

已查现有用户确认、SeerAPI、底层魂印元数据及BWIKI，后两者原始URL/revision见上述本地证据。

具体缺口：两版原文均写攻击未暴击吸取，但未明确MISS、技能失效、命中后伤害全免是否也触发；旧公共afterAttack只覆盖命中，代码不作为真实依据。现有Q019等阈值问题的确认不自动扩大成此项暴击条件规则。

问题与解释差异：实际使用攻击技能但MISS或命中效果失效时是否吸取？命中但攻击伤害0时是否吸取？多段若出现暴击与未暴击混合，按整招是否有暴击判断还是逐段触发？原版与强化版是否相同？

影响、已完成/被阻塞：当前两版正常命中暴击清PP/非暴吸取已测试，未确认的失败分支保留partial，不转多精灵延期。

我的回答：miss与技能失效不触发，伤害被抵挡触发（以后所有技能效果，除了写技能无效时的效果，其余效果都在miss和未命中或被抵挡时失效，记下来）两版魂印的混合暴击多段按整招触发吸取，括号中的“被抵挡”是指伤害被免疫挡住，和指技能命中效果被封锁；公共规则中的“被抵挡”包括仅命中效果被封锁和“免疫收到的攻击”词条

## 4338 星礼 — 无待用户确认问题

魂印1564/2a0cb57、17技能全部在场分支已实现并逐项审核。格式化来源明确攻击增减伤；1655枚举25/d0299043与1187枚举1/27df2271已额外查询，补齐实际参数语义。专项与真实17ID完整效果接入已通过，45项审核当前无缺项/失效。1702主动换宠至己方下一只回复200完整登记延期；单精灵认证仍以正式验证器实际退出为准，当前运行v3。来源research/4338-source-check.json、4338-extra-source.json；测试tests/deployed-4338.test.cjs，门槛research/next20-4338-gate-v3.log。

## 4345 圣心女皇·卡托娜 — 开发中，独立工作尚未完成

### Q-N20-4345-001 — 护盾无法叠加的再次授予和等量回复

完整魂印、来源URL、hash、参数与加载时间：

```json
{
  "url": "https://api.seerapi.com/v1/soulmark/1570",
  "data": {
    "id": 1570,
    "desc": "当回合对手使用攻击技能则战斗阶段结束时给自身附加最大体力1/3的护盾（护盾无法叠加）并恢复等量体力且令自身下回合属性技能先制+2；|当回合对手未使用攻击技能则战斗阶段结束时给自身附加对手最大体力1/3的护盾（护盾无法叠加）并使自身防御+1、特防+1，且令对手下回合属性技能失效；|自身每次主动切换下场时，若当前拥有的护盾量高于600，则将自身的能力提升状态附加给己方下只出场精灵（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>当回合对手使用攻击技能则：\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时给自身<color=#64F9FA>附加</color>最大体力1/3的<b>护盾</b>（护盾无法叠加）并<color=#64F9FA>恢复</color>等量体力\r\n<indent=32><sprite=4><indent=48>令自身下回合属性技能<b>先制</b>+2\r\n<indent=16><sprite=3><indent=32>当回合对手未使用攻击技能则：\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时给自身<color=#64F9FA>附加</color>对手最大体力1/3的<b>护盾</b>（护盾无法叠加）并使自身防御+1、特防+1\r\n<indent=32><sprite=4><indent=48>令对手下回合<b>属性技能</b><color=#64F9FA>失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身每次主动切换下场时，若当前拥有的护盾量高于600，则将自身的<b>能力提升状态</b><color=#64F9FA>附加</color>给己方下只出场精灵",
    "analyze_desc": "",
    "pve_effective": false,
    "intensified": false,
    "is_adv": false,
    "pet": [
      {
        "id": 4345,
        "url": "https://api.seerapi.com/v1/pet/4345"
      }
    ],
    "effect": {
      "effect_args": [
        3,
        2,
        3,
        1,
        1,
        600,
        1
      ],
      "effect": {
        "id": 1929,
        "url": "https://api.seerapi.com/v1/eid_effect/1929"
      }
    },
    "effect_alias": "alias_1929_3_2_3_1_1_600_1",
    "tag": [
      {
        "id": 3,
        "url": "https://api.seerapi.com/v1/soulmark_tag/3"
      },
      {
        "id": 5,
        "url": "https://api.seerapi.com/v1/soulmark_tag/5"
      },
      {
        "id": 14,
        "url": "https://api.seerapi.com/v1/soulmark_tag/14"
      }
    ],
    "intensified_to": null,
    "from": null,
    "advance": null,
    "hash": "3f5caca3"
  },
  "loadedAt": "2026-10-21T15:01:36.847Z",
  "storage": "refreshed"
}
```

已查现有用户确认、SeerAPI原文/格式化及BWIKI魂印1570，后者URL/revision/原文保存在research/4345-wiki-source.json；未找到明确说明旧盾残余、异源护盾和再次获得护盾时回复基数的算例。来源hash3f5caca3，实例eid及参数保留原记录，未修改上游。

具体问题：①“护盾无法叠加”指同魂印旧盾被新值覆盖、只补足至新值，还是已有盾时不再授予？与技能或其他来源的护盾是否独立共存？②敌本回合使用攻击时，已有盾导致实际新增盾不足最大HP1/3，回复仍按名义最大HP1/3、实际新增盾、还是当前总盾？这些解释会改变残余1000盾再授3000后的总盾量及回复量。没有来源支持的新机制未选为默认。

已完成：空盾时按对手实际用攻击/未用攻击分支授对应双方最大HP1/3盾，回复/防御特防/下回合属性先制与封属；死亡不授盾。已有盾再次授予显式阻塞，不猜测。其余独立工作继续，未正式部署/验收。

我的回答：统一来源的盾第二次获得时不叠加，只补足至新值，与其他来源的盾独立共存；名义值

## 4347 裁罪魔剪·塞泽丝

独立工作完成，尚未验收。26项专项通过，全部技能与魂印已逐实例记录审核；两个真实版本均保留。完整原始资料及加载时间：research/4347-source-check.json；底层接口：research/4347-extra-source.json；Wiki失败原因：research/4347-wiki-source.json。

### Q-N20-4347-001 — 原魂印低伤分支的属性先制

完整原始词条、ID、hash、eid实例参数、来源URL：

```json
{
  "url": "https://api.seerapi.com/v1/soulmark/1571",
  "data": {
    "id": 1571,
    "desc": "回合开始时自身体力每损失1%则当回合攻击造成的伤害提升1%，若自身体力低于最大体力的1/2则转变为伤害提升2%，战斗阶段结束时对手体力每剩余1%，则下回合自身受到的固定伤害和百分比伤害降低0.4%；|自身攻击技能命中后若造成的伤害低于对手最大体力的1/3则附加对手最大体力1/3的百分比伤害；自身攻击技能命中后若造成的伤害高于对手最大体力的1/3则恢复自身最大体力的1/3并造成等量百分比伤害且令自身下回合攻击技能先制+1（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时自身体力每损失1%则当回合造成的<b>攻击伤害</b><color=#64F9FA>提升</color>1%\r\n<indent=32><sprite=4><indent=48>若自身体力低于最大体力的1/2则改为提升2%\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时对手体力每剩余1%，下回合自身受到的<b>固定伤害</b>和<b>百分比伤害</b><color=#64F9FA>降低</color>0.4%\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中后若造成的攻击伤害低于对手最大体力的1/3则<color=#64F9FA>附加</color>对手最大体力1/3的<b>百分比伤害</b>且下回合属性技能<b>先制</b>+1\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中后若造成的攻击伤害高于对手最大体力的1/3则<color=#64F9FA>恢复</color>自身最大体力的1/3并<color=#64F9FA>附加</color>等量<b>百分比伤害</b>且下回合攻击技能<b>先制</b>+1",
    "analyze_desc": "",
    "pve_effective": false,
    "intensified": false,
    "is_adv": false,
    "pet": [
      {
        "id": 4347,
        "url": "https://api.seerapi.com/v1/pet/4347"
      }
    ],
    "effect": {
      "effect_args": [
        1,
        2,
        3,
        3,
        3,
        3,
        1,
        1
      ],
      "effect": {
        "id": 1930,
        "url": "https://api.seerapi.com/v1/eid_effect/1930"
      }
    },
    "effect_alias": "alias_1930_1_2_3_3_3_3_1_1",
    "tag": [
      {
        "id": 2,
        "url": "https://api.seerapi.com/v1/soulmark_tag/2"
      },
      {
        "id": 10,
        "url": "https://api.seerapi.com/v1/soulmark_tag/10"
      },
      {
        "id": 15,
        "url": "https://api.seerapi.com/v1/soulmark_tag/15"
      }
    ],
    "intensified_to": {
      "id": 1786,
      "url": "https://api.seerapi.com/v1/soulmark/1786"
    },
    "from": null,
    "advance": null,
    "hash": "dad708c7"
  },
  "loadedAt": "2026-10-21T15:28:36.239Z",
  "storage": "refreshed"
}
```

已查资料与缺口：desc没有低伤后属性先制，而desc_formatting_adjustment有“且下回合属性技能先制+1”。底层eid1930/hash18fe4a0f只返回参数数量8，没有行为说明；Wiki TLS连接建立前断开，未取得解释。

可选解释与战斗差异：按普通字段低伤只追加；按格式化字段低伤还使下回合属性先制+1，会改变与对手的行动顺序。

影响范围及阻塞：仅本问题所述分支；已实现两版缺体增伤、各自时序的减粉、明确命中后的低/高/等值边界及实际回复等量追加，未部署该精灵。我的建议不是用户回答。

我的回答：按格式化

### Q-N20-4347-002 — 强化魂印攻击后的MISS范围

完整原始词条、ID、hash、eid实例参数、来源URL：

```json
{
  "url": "https://api.seerapi.com/v1/soulmark/1786",
  "data": {
    "id": 1786,
    "desc": "回合开始时自身体力每损失1%当回合攻击造成的伤害提升1%，若自身体力低于最大体力的1/2则转变为提升2%；回合开始时对手体力每剩余1%当回合受到的固定伤害、百分比伤害减少0.5%|自身攻击后若造成的伤害低于350则附加对手最大体力1/3的百分比伤害且下回合属性技能先制+1，若造成的伤害高于350则恢复自身最大体力的1/3并造成等量百分比伤害且下回合攻击技能先制+1（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时自身体力每损失1%则当回合造成的<b>攻击伤害</b><color=#64F9FA>提升</color>1%\r\n<indent=32><sprite=4><indent=48>若自身体力低于最大体力的1/2则改为提升2%\r\n<indent=16><sprite=3><indent=32>回合开始时对手体力每剩余1%，当回合自身受到的<b>固定伤害</b>和<b>百分比伤害</b><color=#64F9FA>降低</color>0.5%\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击后若造成的攻击伤害低于350则<color=#64F9FA>附加</color>对手最大体力1/3的<b>百分比伤害</b>且下回合属性技能<b>先制</b>+1\r\n<indent=16><sprite=3><indent=32>自身攻击后若造成的攻击伤害高于350则<color=#64F9FA>恢复</color>自身最大体力的1/3并<color=#64F9FA>附加</color>等量<b>百分比伤害</b>且下回合攻击技能<b>先制</b>+1",
    "analyze_desc": "",
    "pve_effective": false,
    "intensified": false,
    "is_adv": false,
    "pet": [
      {
        "id": 4347,
        "url": "https://api.seerapi.com/v1/pet/4347"
      }
    ],
    "effect": {
      "effect_args": [
        1,
        0
      ],
      "effect": {
        "id": 2179,
        "url": "https://api.seerapi.com/v1/eid_effect/2179"
      }
    },
    "effect_alias": "alias_2179_1_0",
    "tag": [
      {
        "id": 2,
        "url": "https://api.seerapi.com/v1/soulmark_tag/2"
      },
      {
        "id": 10,
        "url": "https://api.seerapi.com/v1/soulmark_tag/10"
      },
      {
        "id": 15,
        "url": "https://api.seerapi.com/v1/soulmark_tag/15"
      }
    ],
    "intensified_to": null,
    "from": {
      "id": 1571,
      "url": "https://api.seerapi.com/v1/soulmark/1571"
    },
    "advance": null,
    "hash": "d0e7ec19"
  },
  "loadedAt": "2026-10-21T15:28:43.451Z",
  "storage": "refreshed"
}
```

已查资料与缺口：原版明确“攻击技能命中后”，强化版改为“自身攻击后”；格式化字段也未说明MISS是否计入。底层eid2179/hash4cc46b91只有参数数量2，Wiki同上失败。既有4109魂印1342整回合累计确认不机械扩张到本版技能后窗口。

可选解释与战斗差异：按已命中的攻击行动判断则MISS无追加；按实际使用攻击后包括MISS判断，则MISS的0伤进入低于350分支，追加比例伤害并授予属性先制。命中后的各分支、等于350、零伤、死亡与实际回复已独立实现和测试。

影响范围及阻塞：仅本问题所述分支；已实现两版缺体增伤、各自时序的减粉、明确命中后的低/高/等值边界及实际回复等量追加，未部署该精灵。我的建议不是用户回答。

我的回答：自身攻击后则miss也计入

### 关联公共问题 Q-N20-4329-006 — 456条件秒杀

不另建同义主问题。4347技能34503绝命之气，效果456[260]，完整原始技能、模板、URL/hash及实例如下：

```json
{
  "skill": {
    "url": "https://api.seerapi.com/v1/skill/34503",
    "data": {
      "id": 34503,
      "name": "绝命之气",
      "power": 120,
      "max_pp": 10,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 48,
        "url": "https://api.seerapi.com/v1/element_type_combination/48"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若对手体力不足260则直接秒杀",
          "analyze_info": "[sprite name=iconHit]若对手体力不足260则直接[color=#52a5f2]秒杀[/color]（boss有效）",
          "args": [
            260
          ],
          "effect": {
            "id": 456,
            "url": "https://api.seerapi.com/v1/skill_effect_type/456"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "49651a47"
    },
    "cacheFile": "research/4109-source-check.json",
    "loadedAt": "2026-10-19T19:09:36.835Z",
    "storage": "existing-cache"
  },
  "effect": {
    "url": "https://api.seerapi.com/v1/skill_effect_type/456",
    "data": {
      "id": 456,
      "args_num": 1,
      "info": "若对手体力不足{0}则直接秒杀",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若对手体力不足{0}则直接[color=#52a5f2]秒杀[/color]（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 13739,
          "url": "https://api.seerapi.com/v1/skill/13739"
        },
        {
          "id": 13740,
          "url": "https://api.seerapi.com/v1/skill/13740"
        },
        {
          "id": 13741,
          "url": "https://api.seerapi.com/v1/skill/13741"
        },
        {
          "id": 13742,
          "url": "https://api.seerapi.com/v1/skill/13742"
        },
        {
          "id": 13743,
          "url": "https://api.seerapi.com/v1/skill/13743"
        },
        {
          "id": 13841,
          "url": "https://api.seerapi.com/v1/skill/13841"
        },
        {
          "id": 16047,
          "url": "https://api.seerapi.com/v1/skill/16047"
        },
        {
          "id": 16341,
          "url": "https://api.seerapi.com/v1/skill/16341"
        },
        {
          "id": 16407,
          "url": "https://api.seerapi.com/v1/skill/16407"
        },
        {
          "id": 16764,
          "url": "https://api.seerapi.com/v1/skill/16764"
        },
        {
          "id": 17099,
          "url": "https://api.seerapi.com/v1/skill/17099"
        },
        {
          "id": 17174,
          "url": "https://api.seerapi.com/v1/skill/17174"
        },
        {
          "id": 17274,
          "url": "https://api.seerapi.com/v1/skill/17274"
        },
        {
          "id": 17355,
          "url": "https://api.seerapi.com/v1/skill/17355"
        },
        {
          "id": 17475,
          "url": "https://api.seerapi.com/v1/skill/17475"
        },
        {
          "id": 17505,
          "url": "https://api.seerapi.com/v1/skill/17505"
        },
        {
          "id": 17583,
          "url": "https://api.seerapi.com/v1/skill/17583"
        },
        {
          "id": 17635,
          "url": "https://api.seerapi.com/v1/skill/17635"
        },
        {
          "id": 17685,
          "url": "https://api.seerapi.com/v1/skill/17685"
        },
        {
          "id": 17702,
          "url": "https://api.seerapi.com/v1/skill/17702"
        },
        {
          "id": 17761,
          "url": "https://api.seerapi.com/v1/skill/17761"
        },
        {
          "id": 17861,
          "url": "https://api.seerapi.com/v1/skill/17861"
        },
        {
          "id": 17874,
          "url": "https://api.seerapi.com/v1/skill/17874"
        },
        {
          "id": 17890,
          "url": "https://api.seerapi.com/v1/skill/17890"
        },
        {
          "id": 17926,
          "url": "https://api.seerapi.com/v1/skill/17926"
        },
        {
          "id": 17965,
          "url": "https://api.seerapi.com/v1/skill/17965"
        },
        {
          "id": 17979,
          "url": "https://api.seerapi.com/v1/skill/17979"
        },
        {
          "id": 18000,
          "url": "https://api.seerapi.com/v1/skill/18000"
        },
        {
          "id": 18041,
          "url": "https://api.seerapi.com/v1/skill/18041"
        },
        {
          "id": 18117,
          "url": "https://api.seerapi.com/v1/skill/18117"
        },
        {
          "id": 18143,
          "url": "https://api.seerapi.com/v1/skill/18143"
        },
        {
          "id": 18148,
          "url": "https://api.seerapi.com/v1/skill/18148"
        },
        {
          "id": 18251,
          "url": "https://api.seerapi.com/v1/skill/18251"
        },
        {
          "id": 18382,
          "url": "https://api.seerapi.com/v1/skill/18382"
        },
        {
          "id": 19020,
          "url": "https://api.seerapi.com/v1/skill/19020"
        },
        {
          "id": 19062,
          "url": "https://api.seerapi.com/v1/skill/19062"
        },
        {
          "id": 19110,
          "url": "https://api.seerapi.com/v1/skill/19110"
        },
        {
          "id": 19133,
          "url": "https://api.seerapi.com/v1/skill/19133"
        },
        {
          "id": 19198,
          "url": "https://api.seerapi.com/v1/skill/19198"
        },
        {
          "id": 19213,
          "url": "https://api.seerapi.com/v1/skill/19213"
        },
        {
          "id": 19246,
          "url": "https://api.seerapi.com/v1/skill/19246"
        },
        {
          "id": 19272,
          "url": "https://api.seerapi.com/v1/skill/19272"
        },
        {
          "id": 19328,
          "url": "https://api.seerapi.com/v1/skill/19328"
        },
        {
          "id": 19338,
          "url": "https://api.seerapi.com/v1/skill/19338"
        },
        {
          "id": 19348,
          "url": "https://api.seerapi.com/v1/skill/19348"
        },
        {
          "id": 19360,
          "url": "https://api.seerapi.com/v1/skill/19360"
        },
        {
          "id": 19368,
          "url": "https://api.seerapi.com/v1/skill/19368"
        },
        {
          "id": 19416,
          "url": "https://api.seerapi.com/v1/skill/19416"
        },
        {
          "id": 19453,
          "url": "https://api.seerapi.com/v1/skill/19453"
        },
        {
          "id": 19463,
          "url": "https://api.seerapi.com/v1/skill/19463"
        },
        {
          "id": 19467,
          "url": "https://api.seerapi.com/v1/skill/19467"
        },
        {
          "id": 24639,
          "url": "https://api.seerapi.com/v1/skill/24639"
        },
        {
          "id": 30013,
          "url": "https://api.seerapi.com/v1/skill/30013"
        },
        {
          "id": 30016,
          "url": "https://api.seerapi.com/v1/skill/30016"
        },
        {
          "id": 30612,
          "url": "https://api.seerapi.com/v1/skill/30612"
        },
        {
          "id": 30690,
          "url": "https://api.seerapi.com/v1/skill/30690"
        },
        {
          "id": 30747,
          "url": "https://api.seerapi.com/v1/skill/30747"
        },
        {
          "id": 31599,
          "url": "https://api.seerapi.com/v1/skill/31599"
        },
        {
          "id": 31744,
          "url": "https://api.seerapi.com/v1/skill/31744"
        },
        {
          "id": 32156,
          "url": "https://api.seerapi.com/v1/skill/32156"
        },
        {
          "id": 32285,
          "url": "https://api.seerapi.com/v1/skill/32285"
        },
        {
          "id": 32615,
          "url": "https://api.seerapi.com/v1/skill/32615"
        },
        {
          "id": 32750,
          "url": "https://api.seerapi.com/v1/skill/32750"
        },
        {
          "id": 32761,
          "url": "https://api.seerapi.com/v1/skill/32761"
        },
        {
          "id": 32821,
          "url": "https://api.seerapi.com/v1/skill/32821"
        },
        {
          "id": 32903,
          "url": "https://api.seerapi.com/v1/skill/32903"
        },
        {
          "id": 33017,
          "url": "https://api.seerapi.com/v1/skill/33017"
        },
        {
          "id": 33496,
          "url": "https://api.seerapi.com/v1/skill/33496"
        },
        {
          "id": 33787,
          "url": "https://api.seerapi.com/v1/skill/33787"
        },
        {
          "id": 33817,
          "url": "https://api.seerapi.com/v1/skill/33817"
        },
        {
          "id": 33844,
          "url": "https://api.seerapi.com/v1/skill/33844"
        },
        {
          "id": 33871,
          "url": "https://api.seerapi.com/v1/skill/33871"
        },
        {
          "id": 34100,
          "url": "https://api.seerapi.com/v1/skill/34100"
        },
        {
          "id": 34138,
          "url": "https://api.seerapi.com/v1/skill/34138"
        },
        {
          "id": 34197,
          "url": "https://api.seerapi.com/v1/skill/34197"
        },
        {
          "id": 34238,
          "url": "https://api.seerapi.com/v1/skill/34238"
        },
        {
          "id": 34268,
          "url": "https://api.seerapi.com/v1/skill/34268"
        },
        {
          "id": 34301,
          "url": "https://api.seerapi.com/v1/skill/34301"
        },
        {
          "id": 34359,
          "url": "https://api.seerapi.com/v1/skill/34359"
        },
        {
          "id": 34420,
          "url": "https://api.seerapi.com/v1/skill/34420"
        },
        {
          "id": 34448,
          "url": "https://api.seerapi.com/v1/skill/34448"
        },
        {
          "id": 34503,
          "url": "https://api.seerapi.com/v1/skill/34503"
        },
        {
          "id": 34588,
          "url": "https://api.seerapi.com/v1/skill/34588"
        },
        {
          "id": 34620,
          "url": "https://api.seerapi.com/v1/skill/34620"
        },
        {
          "id": 34676,
          "url": "https://api.seerapi.com/v1/skill/34676"
        },
        {
          "id": 34692,
          "url": "https://api.seerapi.com/v1/skill/34692"
        },
        {
          "id": 34711,
          "url": "https://api.seerapi.com/v1/skill/34711"
        },
        {
          "id": 34714,
          "url": "https://api.seerapi.com/v1/skill/34714"
        },
        {
          "id": 34731,
          "url": "https://api.seerapi.com/v1/skill/34731"
        },
        {
          "id": 34808,
          "url": "https://api.seerapi.com/v1/skill/34808"
        },
        {
          "id": 34826,
          "url": "https://api.seerapi.com/v1/skill/34826"
        },
        {
          "id": 34839,
          "url": "https://api.seerapi.com/v1/skill/34839"
        },
        {
          "id": 34949,
          "url": "https://api.seerapi.com/v1/skill/34949"
        },
        {
          "id": 34969,
          "url": "https://api.seerapi.com/v1/skill/34969"
        },
        {
          "id": 35085,
          "url": "https://api.seerapi.com/v1/skill/35085"
        },
        {
          "id": 35092,
          "url": "https://api.seerapi.com/v1/skill/35092"
        },
        {
          "id": 35127,
          "url": "https://api.seerapi.com/v1/skill/35127"
        },
        {
          "id": 35279,
          "url": "https://api.seerapi.com/v1/skill/35279"
        },
        {
          "id": 35436,
          "url": "https://api.seerapi.com/v1/skill/35436"
        },
        {
          "id": 35488,
          "url": "https://api.seerapi.com/v1/skill/35488"
        },
        {
          "id": 35549,
          "url": "https://api.seerapi.com/v1/skill/35549"
        },
        {
          "id": 35998,
          "url": "https://api.seerapi.com/v1/skill/35998"
        },
        {
          "id": 36118,
          "url": "https://api.seerapi.com/v1/skill/36118"
        },
        {
          "id": 36454,
          "url": "https://api.seerapi.com/v1/skill/36454"
        },
        {
          "id": 36645,
          "url": "https://api.seerapi.com/v1/skill/36645"
        },
        {
          "id": 36658,
          "url": "https://api.seerapi.com/v1/skill/36658"
        },
        {
          "id": 37101,
          "url": "https://api.seerapi.com/v1/skill/37101"
        },
        {
          "id": 37460,
          "url": "https://api.seerapi.com/v1/skill/37460"
        },
        {
          "id": 37779,
          "url": "https://api.seerapi.com/v1/skill/37779"
        },
        {
          "id": 38497,
          "url": "https://api.seerapi.com/v1/skill/38497"
        },
        {
          "id": 38511,
          "url": "https://api.seerapi.com/v1/skill/38511"
        }
      ],
      "tag": [
        {
          "id": 29062,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/29062"
        }
      ],
      "hash": "58eeaad1"
    },
    "cacheFile": "research/3652-source-check-external.json",
    "loadedAt": "2026-10-13T14:31:27.317Z",
    "storage": "existing-cache"
  }
}
```

已查本地691/495/456处理链；这些代码不能反证上游秒杀语义。当前456被实现为默认伤害，既有495使用真实伤害，来源词条均未说明免疫/护盾/保留1HP及死亡事件。完整保留当前已用实现，但不将伤害处理冒充已确认秒杀。阈值严格低于260与未达到时不触发已经测试；受保护目标的死亡语义等待公共主问题回答，其他全部独立工作继续。

我的回答：见公共主问题，留空。

## 4353 花寅

独立工作完成，尚未部署/验收。19项专项通过，全部43项逐实例审核无缺失失效。无真实多精灵延期。

### Q-N20-4353-001 — 1577命中前吸取的技能范围与MISS时点

精灵4353；魂印1577/hash178d88fb；eid1937参数[100,2,3,1,1,1]。完整原始两种字段及URL、实例、hash：

```json
{
  "url": "https://api.seerapi.com/v1/soulmark/1577",
  "data": {
    "id": 1577,
    "desc": "对手每次先出手则下回合选择使用攻击技能时所有先制效果失效；|自身每次先出手则当回合造成的攻击伤害提升100%；|自身每次先出手且技能命中前对手当前体力高于最大体力的1/2，则{吸取}对手最大{体力}的1/3；|战斗阶段结束时若自身当前体力低于对手则令自身全属性+1且下回合所有技能先制+1|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手每次先出手则对手下回合<b>攻击技能</b><color=#64F9FA>先制效果失效</color>\r\n<indent=16><sprite=3><indent=32>自身每次先出手则<b>攻击技能</b>造成的<b>攻击伤害</b><color=#64F9FA>提升</color>100%\r\n<indent=32><sprite=4><indent=48>出手时若对手体力高于最大体力的1/2则额外<color=#64F9FA>吸取</color>对手最大体力的1/3\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时若自身体力低于对手则令自身全属性+1且下回合自身所有技能<b>先制</b>+1",
    "analyze_desc": "",
    "pve_effective": false,
    "intensified": false,
    "is_adv": false,
    "pet": [
      {
        "id": 4353,
        "url": "https://api.seerapi.com/v1/pet/4353"
      }
    ],
    "effect": {
      "effect_args": [
        100,
        2,
        3,
        1,
        1,
        1
      ],
      "effect": {
        "id": 1937,
        "url": "https://api.seerapi.com/v1/eid_effect/1937"
      }
    },
    "effect_alias": "alias_1937_100_2_3_1_1_1",
    "tag": [
      {
        "id": 2,
        "url": "https://api.seerapi.com/v1/soulmark_tag/2"
      },
      {
        "id": 10,
        "url": "https://api.seerapi.com/v1/soulmark_tag/10"
      },
      {
        "id": 12,
        "url": "https://api.seerapi.com/v1/soulmark_tag/12"
      }
    ],
    "intensified_to": null,
    "from": null,
    "advance": null,
    "hash": "178d88fb"
  },
  "loadedAt": "2026-10-21T15:43:01.540Z",
  "storage": "refreshed"
}
```

已查项目旧确认、API魂印与eid1937（仅参数数目6/hash1d7c689b，无行为解释），及Wiki魂印:1577 revision320114（research/4353-wiki-source.json，URL见文件）仍重复普通描述。普通字段第三独立句为“自身每次先出手且技能命中前…吸取”；格式化字段嵌在“攻击技能”段落下，未明确是否也包括属性技能。两字段均未区分MISS判定前还是确认命中但造成伤害前的窗口。

具体问题：先手属性技能是否触发该吸取？先手攻击MISS是否仍在命中判定前吸取？对多段攻击，按技能首次命中前取样一次还是逐段？

有依据的范围与战斗差异：按普通独立句的技能范围，属性招也可能吸取；按格式化段落的攻击范围，属性招不吸取。按MISS判定前/实际命中后，MISS时敌我HP分别会/不会变化。词条用“技能命中前”而非“每段”，本轮只实现并验证单段攻击实际命中前的明确交集，不擅自决定其他分支。

已完成：实际先手攻击增伤100%、单段命中前敌严格高半体吸取1/3及理论等量回复、严格半体不吸、敌实际先出手后的下回合攻击所有先制失效、战阶低体全强与下回合全技能先制；1631自身0HP结算、全部技能独立实现和状态测试。阻塞：此魂印上述语义；未部署，不把部分专项当完成认证。

我的回答：触发；是；首次命中前取样一次

## 4354

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4355

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4358

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4359

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4361

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4364

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4372

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4373

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4376

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4384

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4386

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4387

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4394

尚未开始逐项审核，不能标记“无待用户确认问题”。

## 4395

尚未开始逐项审核，不能标记“无待用户确认问题”。



## 4354 狂沙之主·萨特 — 连续两批任务续接审核

2026-10-21T16:15:13.287Z。独立工作完成，未部署/未验收。26项自身状态专项通过，全部64项已逐实例审核并明确未确认结论。两个真实魂印和两个第五组合均保留；来源不变，未知2439没有注册空处理器。公共伤害/PP/命中状态扩展只对新显式状态生效；4347/4353影响专项45项当前通过。

完整原文、来源URL、hash、ID与实例：

```json
{
  "souls": [
    {
      "url": "https://api.seerapi.com/v1/soulmark/1578",
      "data": {
        "id": 1578,
        "desc": "回合开始时若自身体力高于最大体力的1/2，则当回合自身受到的攻击伤害不超过自身最大体力的1/2，战斗阶段结束时若自身体力低于最大体力的1/2，则下回合自身所有技能先制+2|对手使用技能后，下次使用技能时若类型与本次相同则自身免疫下1次受到的异常状态，若类型与本次不同则下回合攻击技能获得黯天之尘且战斗阶段结束时若自身体力低于最大体力的1/2则消除对手回合类效果|（boss无效）",
        "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时若自身体力高于最大体力的1/2，则当回合自身受到的<b>攻击伤害</b><color=#64F9FA>无法超过</color>自身最大体力的1/2\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若自身体力低于最大体力的1/2，则下回合自身所有技能<b>先制</b>+2\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手当回合使用的技能类型与上次相同则自身<color=#64F9FA>免疫</color>下1次受到的<b>异常状态</b>\r\n<indent=16><sprite=3><indent=32>对手当回合使用的技能类型与上次不同则：\r\n<indent=32><sprite=4><indent=48>自身下回合攻击技能获得<color=#FFF779>黯天之尘</color>效果\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时若自身体力低于最大体力的1/2则<color=#64F9FA>消除</color>对手<b>回合类效果</b>\r\n\r\n<indent=0><sprite=5><indent=15>黯天之尘：\r\n<indent=16><sprite=6><indent=32><b>先制</b>+1\r\n<indent=16><sprite=6><indent=32>造成的<b>攻击伤害</b><color=#64F9FA>提升</color>80%\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>恢复</color>自身所有技能2点<b>PP值</b>",
        "analyze_desc": "[sprite name=dot4][color=#57c975]回合开始时[/color]若自身体力高于最大体力的1/2，则[color=#52a5f2]当回合[/color]自身受到的攻击伤害不超过自身最大体力的1/2，[color=#57c975]战斗阶段结束时[/color]若自身体力低于最大体力的1/2，则下回合自身所有[color=#52a5f2]技能先制[/color]+2|[sprite name=dot4]对手[color=#57c975]使用技能后[/color]，下次[color=#57c975]使用技能时[/color]若类型与本次相同则自身免疫下1次受到的异常状态，若类型与本次不同则下回合攻击技能获得[color=#f35555]黯天之尘[/color]且[color=#57c975]战斗阶段结束时[/color]若自身体力低于最大体力的1/2则消除对手[color=#52a5f2]回合类效果[/color]",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4354,
            "url": "https://api.seerapi.com/v1/pet/4354"
          }
        ],
        "effect": {
          "effect_args": [
            1,
            2,
            2,
            2,
            2,
            1,
            1
          ],
          "effect": {
            "id": 1938,
            "url": "https://api.seerapi.com/v1/eid_effect/1938"
          }
        },
        "effect_alias": "alias_1938_1_2_2_2_2_1_1",
        "tag": [
          {
            "id": 8,
            "url": "https://api.seerapi.com/v1/soulmark_tag/8"
          },
          {
            "id": 9,
            "url": "https://api.seerapi.com/v1/soulmark_tag/9"
          },
          {
            "id": 10,
            "url": "https://api.seerapi.com/v1/soulmark_tag/10"
          }
        ],
        "intensified_to": null,
        "from": null,
        "advance": null,
        "hash": "fa7a82b4"
      },
      "loadedAt": "2026-10-21T15:51:39.124Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/soulmark/2079",
      "data": {
        "id": 2079,
        "desc": "自身登场时获得黯穹之尘，之后对手使用技能后，下次使用技能时若类型与本次相同则自身免疫下1次受到的异常状态，若类型与本次不同则战斗阶段结束时获得黯穹之尘|回合开始时，若自身体力高于最大体力的1/2，则当回合自身受到的技能伤害无法超过自身最大体力的1/2，当次伤害对自身的克制系数未小于等于对手第五技能对自身的克制系数时改为1/4且限制时恢复最大体力的1/2，若自身体力低于最大体力的1/2，则当回合自身所有技能先制+2，自身对对手的克制系数未小于等于自身第五技能对自身的克制系数时解除自身所处的异常状态|（boss无效）",
        "desc_formatting_adjustment": null,
        "analyze_desc": "[sprite name=dot4]自身[color=#57c975]登场时[/color]获得[color=#f35555]黯穹之尘[/color]，[color=#52a5f2]之后[/color]对手[color=#57c975]使用技能后[/color]，下次[color=#57c975]使用技能时[/color]若类型与本次相同则自身免疫下1次受到的异常状态，若类型与本次不同则[color=#57c975]战斗阶段结束时[/color]获得[color=#f35555]黯穹之尘[/color]|[sprite name=dot4][color=#57c975]回合开始时[/color]，若自身体力高于最大体力的1/2，则[color=#52a5f2]当回合[/color]自身受到的技能伤害无法超过自身最大体力的1/2，当次伤害对自身的克制系数未小于等于对手第五技能对自身的克制系数时改为1/4且限制时恢复最大体力的1/2，若自身体力低于最大体力的1/2，则[color=#52a5f2]当回合[/color]自身所有[color=#52a5f2]技能先制[/color]+2，自身对对手的克制系数未小于等于自身第五技能对自身的克制系数时解除自身所处的异常状态",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4354,
            "url": "https://api.seerapi.com/v1/pet/4354"
          }
        ],
        "effect": {
          "effect_args": [
            1,
            0
          ],
          "effect": {
            "id": 2500,
            "url": "https://api.seerapi.com/v1/eid_effect/2500"
          }
        },
        "effect_alias": "alias_2500_1_0",
        "tag": [
          {
            "id": 4,
            "url": "https://api.seerapi.com/v1/soulmark_tag/4"
          },
          {
            "id": 10,
            "url": "https://api.seerapi.com/v1/soulmark_tag/10"
          }
        ],
        "intensified_to": null,
        "from": null,
        "advance": null,
        "hash": "82ea8f8b"
      },
      "loadedAt": "2026-10-21T15:51:45.304Z",
      "storage": "refreshed"
    }
  ],
  "effects": [
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/692",
      "data": {
        "id": 692,
        "args_num": 1,
        "info": "{0}回合内免疫受到的致命一击伤害并直接扣除对手等量体力",
        "info_formatting_adjustment": null,
        "analyze_info": "[sprite name=iconHit]{0}回合内免疫受到的[color=#57c975]致命一击[/color]伤害并直接扣除对手等量体力",
        "pve_effective": false,
        "param": null,
        "hash": "cd9a528c"
      },
      "cacheFile": "research/selected-current-batch.json",
      "storage": "existing-cache"
    },
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/2354",
      "data": {
        "id": 2354,
        "args_num": 1,
        "info": "吸取对手{0}点体力，对手不处于异常状态时改为汲取",
        "info_formatting_adjustment": null,
        "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手{0}点体力，对手不处于异常状态时改为汲取",
        "pve_effective": false,
        "param": null,
        "skill": [
          {
            "id": 38118,
            "url": "https://api.seerapi.com/v1/skill/38118"
          }
        ],
        "tag": [
          {
            "id": 35850,
            "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
          }
        ],
        "hash": "ef541f6c"
      },
      "loadedAt": "2026-10-21T15:52:56.083Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/1787",
      "data": {
        "id": 1787,
        "args_num": 1,
        "info": "沙之力量觉醒，使自身下{0}次攻击获得黯天之尘效果",
        "info_formatting_adjustment": null,
        "analyze_info": "[sprite name=iconHit]沙之力量觉醒，使自身下{0}次攻击获得[color=#f35555]黯天之尘[/color]效果",
        "pve_effective": false,
        "param": null,
        "skill": [
          {
            "id": 35793,
            "url": "https://api.seerapi.com/v1/skill/35793"
          }
        ],
        "tag": [],
        "hash": "75082e2e"
      },
      "loadedAt": "2026-10-21T15:53:14.395Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/1128",
      "data": {
        "id": 1128,
        "args_num": 1,
        "info": "击败对手则令对手下{0}次使用的攻击技能无效",
        "info_formatting_adjustment": null,
        "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下{0}次使用的攻击技能无效",
        "pve_effective": false,
        "param": null,
        "skill": [
          {
            "id": 28030,
            "url": "https://api.seerapi.com/v1/skill/28030"
          },
          {
            "id": 30469,
            "url": "https://api.seerapi.com/v1/skill/30469"
          },
          {
            "id": 30515,
            "url": "https://api.seerapi.com/v1/skill/30515"
          },
          {
            "id": 31025,
            "url": "https://api.seerapi.com/v1/skill/31025"
          },
          {
            "id": 31041,
            "url": "https://api.seerapi.com/v1/skill/31041"
          },
          {
            "id": 31123,
            "url": "https://api.seerapi.com/v1/skill/31123"
          },
          {
            "id": 31179,
            "url": "https://api.seerapi.com/v1/skill/31179"
          },
          {
            "id": 31341,
            "url": "https://api.seerapi.com/v1/skill/31341"
          },
          {
            "id": 31519,
            "url": "https://api.seerapi.com/v1/skill/31519"
          },
          {
            "id": 31529,
            "url": "https://api.seerapi.com/v1/skill/31529"
          },
          {
            "id": 31847,
            "url": "https://api.seerapi.com/v1/skill/31847"
          },
          {
            "id": 32233,
            "url": "https://api.seerapi.com/v1/skill/32233"
          },
          {
            "id": 33105,
            "url": "https://api.seerapi.com/v1/skill/33105"
          },
          {
            "id": 34034,
            "url": "https://api.seerapi.com/v1/skill/34034"
          },
          {
            "id": 35793,
            "url": "https://api.seerapi.com/v1/skill/35793"
          },
          {
            "id": 36427,
            "url": "https://api.seerapi.com/v1/skill/36427"
          },
          {
            "id": 36611,
            "url": "https://api.seerapi.com/v1/skill/36611"
          },
          {
            "id": 36857,
            "url": "https://api.seerapi.com/v1/skill/36857"
          },
          {
            "id": 37064,
            "url": "https://api.seerapi.com/v1/skill/37064"
          },
          {
            "id": 38010,
            "url": "https://api.seerapi.com/v1/skill/38010"
          },
          {
            "id": 38348,
            "url": "https://api.seerapi.com/v1/skill/38348"
          },
          {
            "id": 38497,
            "url": "https://api.seerapi.com/v1/skill/38497"
          }
        ],
        "tag": [
          {
            "id": 44313,
            "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
          }
        ],
        "hash": "1b3b7422"
      },
      "cacheFile": "research/3652-source-check-external.json",
      "loadedAt": "2026-10-13T14:32:48.482Z",
      "storage": "existing-cache"
    },
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/2439",
      "data": {
        "id": 2439,
        "args_num": 0,
        "info": "获得黯穹之尘",
        "info_formatting_adjustment": null,
        "analyze_info": "[sprite name=iconHit]获得[color=#f35555]黯穹之尘[/color]",
        "pve_effective": false,
        "param": null,
        "skill": [
          {
            "id": 38348,
            "url": "https://api.seerapi.com/v1/skill/38348"
          }
        ],
        "tag": [],
        "hash": "a73b832"
      },
      "loadedAt": "2026-10-21T15:53:33.741Z",
      "storage": "refreshed"
    }
  ],
  "skills": [
    {
      "url": "https://api.seerapi.com/v1/skill/27922",
      "data": {
        "id": 27922,
        "name": "镇秽龙脉",
        "power": 0,
        "max_pp": 10,
        "accuracy": 95,
        "crit_rate": null,
        "priority": 0,
        "must_hit": false,
        "atk_num": 1,
        "info": "开始反弹对手的致命一击了；使自身随机2项能力提升",
        "category": {
          "id": 4,
          "url": "https://api.seerapi.com/v1/skill_category/4"
        },
        "type": {
          "id": 8,
          "url": "https://api.seerapi.com/v1/element_type_combination/8"
        },
        "learned_by_pet": [],
        "skill_effect": [
          {
            "info": "3回合内免疫受到的致命一击伤害并直接扣除对手等量体力",
            "analyze_info": "[sprite name=iconHit]3回合内免疫受到的[color=#52a5f2]致命一击[/color]伤害并直接扣除对手等量体力",
            "args": [
              3
            ],
            "effect": {
              "id": 692,
              "url": "https://api.seerapi.com/v1/skill_effect_type/692"
            }
          },
          {
            "info": "随机使自己2项能力+2",
            "analyze_info": "[sprite name=iconHit]随机使自己2项能力+2（boss有效）",
            "args": [
              2,
              2
            ],
            "effect": {
              "id": 626,
              "url": "https://api.seerapi.com/v1/skill_effect_type/626"
            }
          }
        ],
        "friend_skill_effect": [],
        "hide_effect": null,
        "advance": null,
        "hash": "e06eccf7"
      },
      "loadedAt": "2026-10-21T15:52:04.554Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill/38118",
      "data": {
        "id": 38118,
        "name": "枯骨遗沙镇",
        "power": 150,
        "max_pp": 5,
        "accuracy": 95,
        "crit_rate": 6.25,
        "priority": 1,
        "must_hit": true,
        "atk_num": 1,
        "info": null,
        "category": {
          "id": 2,
          "url": "https://api.seerapi.com/v1/skill_category/2"
        },
        "type": {
          "id": 109,
          "url": "https://api.seerapi.com/v1/element_type_combination/109"
        },
        "learned_by_pet": [],
        "skill_effect": [
          {
            "info": "无视护盾效果",
            "analyze_info": "[sprite name=iconHit]无视[color=#57c975]护盾[/color]效果",
            "args": [],
            "effect": {
              "id": 1568,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1568"
            }
          },
          {
            "info": "反转自身能力下降状态，反转成功则2回合内令对手使用的属性技能无效",
            "analyze_info": "[sprite name=iconHit]反转自身能力下降状态（boss有效），反转成功则2回合内令对手使用的属性技能无效",
            "args": [
              2
            ],
            "effect": {
              "id": 1056,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1056"
            }
          },
          {
            "info": "造成的攻击伤害提升50%，对手处于异常状态时效果翻倍",
            "analyze_info": "[sprite name=iconHit]造成的攻击伤害提升50%，对手处于异常状态时效果翻倍",
            "args": [
              50
            ],
            "effect": {
              "id": 2352,
              "url": "https://api.seerapi.com/v1/skill_effect_type/2352"
            }
          },
          {
            "info": "吸取对手250点体力，对手不处于异常状态时改为汲取",
            "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手250点体力，对手不处于异常状态时改为汲取",
            "args": [
              250
            ],
            "effect": {
              "id": 2354,
              "url": "https://api.seerapi.com/v1/skill_effect_type/2354"
            }
          }
        ],
        "friend_skill_effect": [],
        "hide_effect": null,
        "advance": null,
        "hash": "89959ef9"
      },
      "loadedAt": "2026-10-21T15:52:49.712Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill/35793",
      "data": {
        "id": 35793,
        "name": "地动六合覆",
        "power": 160,
        "max_pp": 5,
        "accuracy": 95,
        "crit_rate": 6.25,
        "priority": 0,
        "must_hit": true,
        "atk_num": 1,
        "info": "此身所矗之处，皆为盖伦之土！",
        "category": {
          "id": 2,
          "url": "https://api.seerapi.com/v1/skill_category/2"
        },
        "type": {
          "id": 109,
          "url": "https://api.seerapi.com/v1/element_type_combination/109"
        },
        "learned_by_pet": [],
        "skill_effect": [
          {
            "info": "沙之力量觉醒，使自身下1次攻击获得黯天之尘效果",
            "analyze_info": "[sprite name=iconHit]沙之力量觉醒，使自身下1次攻击获得[color=#f35555]黯天之尘[/color]效果",
            "args": [
              1
            ],
            "effect": {
              "id": 1787,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1787"
            }
          },
          {
            "info": "消除对手回合类效果，消除成功则令对手石化",
            "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则令对手[color=#57c975]石化[/color]",
            "args": [
              9
            ],
            "effect": {
              "id": 889,
              "url": "https://api.seerapi.com/v1/skill_effect_type/889"
            }
          },
          {
            "info": "100%令对手束缚，未触发则附加自身最大体力30%的百分比伤害，若对手免疫百分比伤害则转变为真实伤害",
            "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]束缚[/color]，[color=#52a5f2]未触发[/color]则附加自身最大体力30%的[color=#52a5f2]百分比伤害[/color]，若对手免疫[color=#52a5f2]百分比伤害[/color]则转变为[color=#52a5f2]真实伤害[/color]",
            "args": [
              100,
              28,
              30
            ],
            "effect": {
              "id": 1788,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1788"
            }
          },
          {
            "info": "击败对手则令对手下1次使用的攻击技能无效",
            "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下1次使用的攻击技能无效",
            "args": [
              1
            ],
            "effect": {
              "id": 1128,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1128"
            }
          }
        ],
        "friend_skill_effect": [],
        "hide_effect": null,
        "advance": null,
        "hash": "e0502df4"
      },
      "loadedAt": "2026-10-21T15:53:08.274Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill/38348",
      "data": {
        "id": 38348,
        "name": "天驳百洲禁",
        "power": 160,
        "max_pp": 5,
        "accuracy": 95,
        "crit_rate": 6.25,
        "priority": 0,
        "must_hit": true,
        "atk_num": 1,
        "info": null,
        "category": {
          "id": 2,
          "url": "https://api.seerapi.com/v1/skill_category/2"
        },
        "type": {
          "id": 109,
          "url": "https://api.seerapi.com/v1/element_type_combination/109"
        },
        "learned_by_pet": [],
        "skill_effect": [
          {
            "info": "获得黯穹之尘",
            "analyze_info": "[sprite name=iconHit]获得[color=#f35555]黯穹之尘[/color]",
            "args": [],
            "effect": {
              "id": 2439,
              "url": "https://api.seerapi.com/v1/skill_effect_type/2439"
            }
          },
          {
            "info": "消除对手回合类效果，消除成功100%令对手石化，100%令对手臣服，自身体力低于50%时取消触发条件",
            "analyze_info": "[sprite name=iconHit]消除对手回合类效果，消除成功100%令对手[color=#57c975]石化[/color]，100%令对手[color=#57c975]臣服[/color]，自身体力低于50%时取消触发条件",
            "args": [
              100,
              9,
              100,
              31,
              50
            ],
            "effect": {
              "id": 2438,
              "url": "https://api.seerapi.com/v1/skill_effect_type/2438"
            }
          },
          {
            "info": "100%令对手束缚，未触发则附加自身最大体力30%的百分比伤害，若对手免疫百分比伤害则转变为真实伤害",
            "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]束缚[/color]，[color=#52a5f2]未触发[/color]则附加自身最大体力30%的[color=#52a5f2]百分比伤害[/color]，若对手免疫[color=#52a5f2]百分比伤害[/color]则转变为[color=#52a5f2]真实伤害[/color]",
            "args": [
              100,
              28,
              30
            ],
            "effect": {
              "id": 1788,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1788"
            }
          },
          {
            "info": "未击败对手时恢复当回合所造成攻击伤害的50%的体力，若未造成攻击伤害则对手2回合内无法主动切换精灵",
            "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手时恢复[color=#52a5f2]当回合(411)[/color]所造成攻击伤害的50%的体力，若未造成攻击伤害则对手2回合内无法[color=#52a5f2]主动切换[/color]精灵",
            "args": [
              50,
              2
            ],
            "effect": {
              "id": 2440,
              "url": "https://api.seerapi.com/v1/skill_effect_type/2440"
            }
          },
          {
            "info": "击败对手则令对手下1次使用的攻击技能无效",
            "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下1次使用的攻击技能无效",
            "args": [
              1
            ],
            "effect": {
              "id": 1128,
              "url": "https://api.seerapi.com/v1/skill_effect_type/1128"
            }
          }
        ],
        "friend_skill_effect": [],
        "hide_effect": null,
        "advance": null,
        "hash": "3bc89db0"
      },
      "loadedAt": "2026-10-21T15:53:27.710Z",
      "storage": "refreshed"
    }
  ]
}
```

其余完整原始精灵/技能/效果及缓存路径：research/4354-source-check.json。Wiki原文与revision：research/4354-wiki-source.json；API eid1938/hash50ef9a47、eid2500/hashb447a344以及Wiki查询：research/4354-extra-source.json。

### Q-N20-4354-001 — 黯穹之尘完整定义

关联实例：魂印2079/hash82ea8f8b登场及异类用招战阶授予；技能38348/hash3bc89db0实例0效果2439[]/hasha73b832。

已查资料与缺口：SeerAPI仅有名称，格式化定义为空；Wiki魂印2079 revision341447、效果2439 revision349480也只有名称；全文搜索无结果，eid2500仅返回参数数2。原版1578的黯天之尘则已明确先制1、攻击伤害80%、全PP2，不能以旧版冒充新名称。

解释与战斗差异：没有足够依据提供具体数值选项；擅自继承旧版会影响先制、增伤、回复与持续/次数。

明确问题：请给出黯穹之尘的完整效果、持续/消费条件以及重复获得规则。

影响范围、已完成与阻塞：原版尘、其他独立技能、觉醒明确的单次攻击限制/低体分支已实现；2439及觉醒授尘行为均明确未实现。

我的回答：黯穹之尘 获得时，若自身体力低于最大体力的50%则消除对手回合类效果；自身的攻击技能先制增加自身对对手的克制系数的级数，使用时恢复自身所有技能2点PP值，命中时消耗黯穹之尘并使自身当回合造成的攻击伤害额外提升80%
	黯穹之尘一直保留到攻击命中消费，重复获得时不叠加，但重新执行低体消回合

### Q-N20-4354-002 — 技能类型的分类

关联实例：两个魂印1578与2079在对手实际用招后比较本次与上次技能类型。

已查资料与缺口：API普通和格式化字段、Wiki都没有给出类型枚举；eid无行为定义。现有物理/特殊/属性三种原始kind已完整保存。

解释与战斗差异：按物理/特殊/属性三类时物理改特殊为不同；按攻击/属性两类时物理改特殊为相同。会分别授尘或免一次异常。

明确问题：这里的技能类型是物理/特殊/属性三类，还是攻击/属性两类？

影响范围、已完成与阻塞：同一原始kind必同类、攻击与属性必不同类的明确交集已实现测试；物特转换显式标记pending，不推断。

我的回答：三类

### Q-N20-4354-003 — 2354固定数值汲取的回复基数

关联实例：38118枯骨遗沙镇/hash89959ef9；效果2354[250]/hashef541f6c。

已查资料与缺口：已采用用户确认：无异常改汲取时伤害必须是真实伤害，不重问类型。全局固定数值吸取按理论回复的确认措辞为“吸取”，AGENTS同时明确不机械改成汲取；3516汲取40的理论回复有具体实例绑定，不能擅自扩大。API/Wiki未说明本新分支回复基数。

解释与战斗差异：原始250真实伤害面对目标1HP时，理论数值可回250，实际HP损失则仅回1；完整结算与实际损失也须区分。

明确问题：2354无异常汲取250时，应按理论250、完整结算伤害，还是目标实际HP损失回复？

影响范围、已完成与阻塞：有异常固定吸取250已完整实现并测试理论回复/抗性；无异常真实伤害已实现并测试，回复保留pending；整招显式限制正式部署。

我的回答：理论

### Q-N20-4354-004 — 两版伤害上限的单位及觉醒非攻击伤害的系数

关联实例：1578高体攻击上限1/2；2079高体技能伤害1/2、系数条件1/4且限制时回复1/2。

已查资料与缺口：两版本来源没有明确多次受击按单次还是累计；2079未给固定/百分比/真实附伤的克制系数定义。当前引擎这些伤害不按技能属性乘克制，不能直接把源技能系别自动带入条件比较。

解释与战斗差异：例如两次各3000时，单次上限4500均不截断，累计上限会使第二次只结算1500；觉醒固定附伤比较按源技能系数或无属性系数会决定4500/2250上限及是否回复。

明确问题：这两版上限按每次伤害还是回合累计？2079的非攻击技能伤害应取哪个克制系数进行比较？

影响范围、已完成与阻塞：单次实际攻击、严格半体、真实当前招与敌第五克制比较、严格超过才回复、忽略限制交互，以及低体真实第五比较清异常均已测试；多次及未定义非攻击比较保留。

我的回答：每回合；非攻击技能不受此词条限制；攻击技能附带的固定、百分比和真实伤害也排除在2079上限之外

### Q-N20-4354-005 — 4354精确追加第五来源授权

关联实例：pet4354 hash5f80b53，两魂印1578/fa7a82b4、2079/82ea8f8b，两个第五35793与38348各原始hash见上方。

已查资料与缺口：当前additionalFifthIssues仅准入既有精确物种。当前资料没有advance，38348为真实is_fifth=true且is_special=true，19技能全部保留；已构建四组合，source flags未伪造，来源结构校验现只拒绝“追加第五来源版本尚未审核”。

解释与战斗差异：最小方案仅将本精确pet/soul/全部skill/fifth版本加入现有来源审核表，仍拒绝变化hash、双第五、漏招和混装。未修改白名单或扩大其他兼容。

明确问题：是否授权research/4354-exact-additional-fifth-proposal.json所列4354精确来源和四版本组合？

影响范围、已完成与阻塞：完整可审查方案已保存；19个原始ID基础和逐效果独立测试已完成；授权后的正式版本选择/加载全组合执行仍阻塞，不能绕过校验。

我的回答：授权

### Q-N20-4354-006 — 公共692直接扣除体力的类型

关联实例：本只27922/hash见原始记录效果692[3]；关联3005/24668、3033/24737、3194/23769、3578/31850、4068/27210、4215/27567。完整各自原文/hash/参数/URL在research/4354-692-source-impact.json。

已查资料与缺口：SeerAPI与Wiki效果692 revision349572均写“直接扣除对手等量体力”，没有写真实伤害。现有代码反真伤、历史测试已如此，但代码和通过日志不能当用户确认；已查保存确认未找到692专门定义。

解释与战斗差异：若直接HP减少，则可能不产生伤害事件或被伤害护盾/免疫阻挡；若真实伤害则沿真实伤害事件与免疫链，不能机械等价。

明确问题：692的等量扣除应作为直接体力损失还是真实伤害，是否遵守相应保命与死亡事件？

影响范围、已完成与阻塞：普通暴击免伤与等量HP变化、非暴击、三回合到期已验证；保持原有真伤基线，不删除其断言或自行改变已有目标；本只相关招限制部署，未确认类型/保护不声明完成。

我的回答：体力损失；遵守

### Q-N20-4354-007 — 公共1128击败后的目标

关联实例：本只35793实例3与38348实例4，1128[1]/hash1b3b7422；其余全部本地关联实例在research/4354-1128-source-impact.json。

已查资料与缺口：API词条“击败对手则令对手下1次使用的攻击技能无效”，Wiki查询见4354-extra-source.json；未写下一只/队伍。现有注册表空处理并标注下一只，只是历史实现判断，不能作为真实延期依据。

解释与战斗差异：若指被击败的同一对手自身复活后的攻击，属于当前双方可触发；若指后继出场对手，才是真正多精灵延期。

明确问题：1128封锁的是被击败原对手复活后的攻击，还是对方下一只出场精灵的攻击？

影响范围、已完成与阻塞：这两实例标为单精灵待确认，原始资料完整保留；统一延期生成器仍显示needs-review历史候选，不能豁免；2440中明确主动切换的单独分支才正式延期。

我的回答：826下回合随机异常由整个队伍继续承接



## 4355 终末大天使 — 独立工作完成，部分待确认

2026-10-21T16:43:38.074Z。29项自身状态专项通过；65项逐实例审核已记录。魂印1579真实全部当前分支实现，采用API本体与Wiki魂印:1579 revision320116补充的每刻每回合一次、提前替代战阶和盾罩叠加规则，未修改API原文。21招使用完整原始来源、原始ID/revision与魂印完成真实配招、初始化和执行；1792所在27925通过正常校验拒绝。尚未部署、没有HTTP或正式验证器通过。

### Q-N20-4355-001 — 1792属性直伤后的等量护盾基数

精灵4355；技能27925圣临巡礼，效果实例3，1792[150]/hash80e7dd23；真实技能hash与完整原文、URL、实例：

```json
{
  "skill": {
    "url": "https://api.seerapi.com/v1/skill/27925",
    "data": {
      "id": 27925,
      "name": "圣临巡礼",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹受到的异常状态了；开始恢复自身一定体力并造成等量固定伤害了；使对手直接受到一定光·暗影攻击伤害并获得等量护盾",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若当前体力低于对手则先制+1",
          "analyze_info": "[sprite name=iconInherent]若当前体力低于对手则[color=#52a5f2]先制[/color]+1（boss有效）",
          "args": [],
          "effect": {
            "id": 954,
            "url": "https://api.seerapi.com/v1/skill_effect_type/954"
          }
        },
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "4回合内每回合使用技能恢复自身最大体力的1/2并造成等量百分比伤害，恢复体力时若自身为满体力则效果转变为附加自身最大体力1/3的百分比伤害",
          "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能恢复自身最大体力的1/2并造成等量[color=#52a5f2]百分比伤害[/color]，恢复体力时若自身为满体力则效果转变为附加自身最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
          "args": [
            4,
            2,
            3
          ],
          "effect": {
            "id": 1695,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1695"
          }
        },
        {
          "info": "使对手直接受到150点光·暗影系伤害并获得等量护盾（不可叠加），若自身没有护盾则效果翻倍",
          "analyze_info": "[sprite name=iconHit]使对手直接受到150点光·暗影系伤害并获得等量[color=#57c975]护盾[/color]（不可叠加），若自身没有[color=#57c975]护盾[/color]则效果翻倍",
          "args": [
            150
          ],
          "effect": {
            "id": 1792,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1792"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "28630abf"
    },
    "loadedAt": "2026-10-21T16:17:21.486Z",
    "storage": "refreshed"
  },
  "effect": {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1792",
    "data": {
      "id": 1792,
      "args_num": 1,
      "info": "使对手直接受到{0}点光·暗影系伤害并获得等量护盾（不可叠加），若自身没有护盾则效果翻倍",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]使对手直接受到{0}点光·暗影系伤害并获得等量[color=#57c975]护盾[/color]（不可叠加），若自身没有[color=#57c975]护盾[/color]则效果翻倍",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 27925,
          "url": "https://api.seerapi.com/v1/skill/27925"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "80e7dd23"
    },
    "loadedAt": "2026-10-21T16:17:27.497Z",
    "storage": "refreshed"
  },
  "soul": {
    "url": "https://api.seerapi.com/v1/soulmark/1579",
    "data": {
      "id": 1579,
      "desc": "自身不处于能力提升状态时100%闪避对手攻击且战斗阶段结束时触发诫罚之刻，对手使用攻击技能时提前触发|自身体力低于最大体力的1/2时所有技能先制+2且战斗阶段结束时触发宽恕之刻，对手攻击技能命中时提前触发|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>自身不处于能力提升状态时100%<color=#64F9FA>闪避</color>对手<b>攻击技能</b>且战斗阶段结束时触发<color=#FFF779>诫罚之刻</color>\r\n<indent=32><sprite=4><indent=48>对手使用攻击技能时提前触发\r\n<indent=16><sprite=3><indent=32>自身体力低于1/2时所有技能<b>先制</b>+2且战斗阶段结束时触发<color=#FFF779>宽恕之刻</color>\r\n<indent=32><sprite=4><indent=48>对手攻击技能命中时提前触发\r\n\r\n<indent=0><sprite=5><indent=15>诫罚之刻：\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>消除</color>并获得对手的<b>护盾、护罩</b>\r\n<indent=16><sprite=6><indent=32>若对手处于能力提升状态则令对手双防-2，若对手免疫能力下降则<color=#64F9FA>消除</color>对手<b>能力提升状态</b>\r\n<indent=32><sprite=4><indent=48>消除成功则1回合内对手攻击、特攻值变为0\r\n\r\n<indent=0><sprite=5><indent=15>宽恕之刻：\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>恢复</color>自身最大体力的1/3\r\n<indent=32><sprite=4><indent=48>若自身处于异常状态则恢复效果翻倍且<color=#64F9FA>解除</color>所处的疲惫、害怕状态",
      "analyze_desc": "[sprite name=dot4]自身不处于[color=#52a5f2]能力提升状态[/color]时100%[color=#57c975]闪避[/color][color=#52a5f2]对手[/color]攻击且[color=#57c975]战斗阶段结束时[/color]触发[color=#f35555]诫罚之刻[/color]，[color=#52a5f2]对手[/color]使用攻击技能时提前触发|[sprite name=dot4]自身体力低于最大体力的1/2时所有[color=#52a5f2]技能先制[/color]+2且[color=#57c975]战斗阶段结束时[/color]触发[color=#f35555]宽恕之刻[/color]，[color=#52a5f2]对手[/color]攻击技能命中时提前触发",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4355,
          "url": "https://api.seerapi.com/v1/pet/4355"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          2,
          2,
          1
        ],
        "effect": {
          "id": 1940,
          "url": "https://api.seerapi.com/v1/eid_effect/1940"
        }
      },
      "effect_alias": "alias_1940_100_2_2_1",
      "tag": [
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 13,
          "url": "https://api.seerapi.com/v1/soulmark_tag/13"
        },
        {
          "id": 18,
          "url": "https://api.seerapi.com/v1/soulmark_tag/18"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "3ffab5b0"
    },
    "loadedAt": "2026-10-21T16:15:57.003Z",
    "storage": "refreshed"
  }
}
```

已查资料：项目所有已保存确认；API技能/效果1792以及魂印底层eid1940/hash49b2fd76（无行为描述）；Wiki效果1792 revision344250仅重复同一原文。证据路径research/4355-source-check.json、4355-wiki-source.json、4355-extra-source.json。现有“回复等量附伤”“汲取/吸取体力”等确认不机械扩大为本条typed伤害后的护盾基数。

缺口及解释差异：“等量护盾”究竟取无盾翻倍后的原始数值300、经过克制/减免/免疫/盾处理的完整结算伤害，还是目标实际HP损失？例如计算基数300，经克制结算600，而对手仅有100HP，三种盾量分别300、600、100；伤害免疫时理论数值与实际/结算也不同。

明确问题：1792的等量护盾应该按原始数值（含无盾翻倍）、完整结算伤害，还是目标实际HP损失授予？

已完成与阻塞：光暗影属性直伤使用已核实公共typed机制；无普通/攻击护盾时翻倍、护罩不视为护盾、攻击免疫与克制真实伤害均已验证。仅授盾未实现并显式限制整招；不把未授盾的测试当全部完成。其他全部独立技能与魂印完成状态测试及逐项审核。

我的回答：实际hp损伤

### 关联公共问题 Q-N20-4345-001 — 1792不可叠加的重复授盾

不新建同义主问题。关联本只27925实例3效果1792[150]，原文“并获得等量护盾（不可叠加）”，API/Wiki与hash见上方。已有自身或其他来源护盾时如何重复授予沿用主问题等待回答；此处不预先选择刷新、覆盖、拒绝或异源叠加，也不替用户填写答案。


4355补充审核：影之波动11657/hash3c1bd651原始atk_num=5按已保存research/MULTI-TARGET-USER-SCOPE.json排除多目标范围，保留原始数值，仅当前目标一次普通攻击。真实源接入确认只有1条攻击事件；不误作5连击，不列为真实多精灵延期，不新增问题。自身专项现30/30（research/4355-independent-v5.log）。


## 4358 杰特洛 — 全部独立工作完成，部分待确认

2026-10-21T17:32:43.502Z。18技能、两魂印、四组合全部逐项审核；55项审核记录，25项真实状态专项通过。来源资料research/4358-source-check.json；Wiki补充research/4358-wiki-source.json、4358-extra-source.json；完整原始实例与URL/hash如下。未部署、未正式验收。

```json
[
  {
    "url": "https://api.seerapi.com/v1/pet/4358",
    "data": {
      "id": 4358,
      "name": "杰特洛",
      "yielding_exp": 140,
      "catch_rate": 0,
      "evolving_lv": 0,
      "releaseable": false,
      "fusion_master": false,
      "fusion_sub": false,
      "has_resistance": true,
      "resource_id": 4358,
      "enemy_resource_id": null,
      "type": {
        "id": 30,
        "url": "https://api.seerapi.com/v1/element_type_combination/30"
      },
      "gender": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/pet_gender/1"
      },
      "base_stats": {
        "atk": 70,
        "def": 113,
        "sp_atk": 137,
        "sp_def": 113,
        "spd": 136,
        "hp": 171,
        "percent": false,
        "total": 740
      },
      "pet_class": {
        "id": 3018,
        "url": "https://api.seerapi.com/v1/pet_class/3018"
      },
      "evolution_chain_index": 0,
      "yielding_ev": {
        "atk": 0,
        "def": 0,
        "sp_atk": 0,
        "sp_def": 0,
        "spd": 0,
        "hp": 0,
        "percent": false,
        "total": 0
      },
      "vipbuff": null,
      "mount_type": null,
      "diy_stats": null,
      "skill": [
        {
          "learning_level": 1,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10008,
            "url": "https://api.seerapi.com/v1/skill/10008"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 5,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20190,
            "url": "https://api.seerapi.com/v1/skill/20190"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 9,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10194,
            "url": "https://api.seerapi.com/v1/skill/10194"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 13,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20171,
            "url": "https://api.seerapi.com/v1/skill/20171"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 17,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10009,
            "url": "https://api.seerapi.com/v1/skill/10009"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 21,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35809,
            "url": "https://api.seerapi.com/v1/skill/35809"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 25,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20872,
            "url": "https://api.seerapi.com/v1/skill/20872"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 29,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 12231,
            "url": "https://api.seerapi.com/v1/skill/12231"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 33,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 21828,
            "url": "https://api.seerapi.com/v1/skill/21828"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 37,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35810,
            "url": "https://api.seerapi.com/v1/skill/35810"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 41,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27932,
            "url": "https://api.seerapi.com/v1/skill/27932"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 45,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35811,
            "url": "https://api.seerapi.com/v1/skill/35811"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 49,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27933,
            "url": "https://api.seerapi.com/v1/skill/27933"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 53,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35812,
            "url": "https://api.seerapi.com/v1/skill/35812"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 57,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27934,
            "url": "https://api.seerapi.com/v1/skill/27934"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 61,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35813,
            "url": "https://api.seerapi.com/v1/skill/35813"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 76,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 35814,
            "url": "https://api.seerapi.com/v1/skill/35814"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 76,
          "is_special": true,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 38358,
            "url": "https://api.seerapi.com/v1/skill/38358"
          },
          "skill_activation_item": {
            "id": 1727994,
            "url": "https://api.seerapi.com/v1/skill_activation_item/1727994"
          }
        }
      ],
      "soulmark": [
        {
          "id": 1583,
          "url": "https://api.seerapi.com/v1/soulmark/1583"
        },
        {
          "id": 1905,
          "url": "https://api.seerapi.com/v1/soulmark/1905"
        }
      ],
      "factor": [
        {
          "id": 2400106,
          "url": "https://api.seerapi.com/v1/factor/2400106"
        }
      ],
      "encyclopedia_entry": {
        "id": 4358,
        "url": "https://api.seerapi.com/v1/pet_encyclopedia_entry/4358"
      },
      "archive_story_entry": {
        "id": 439,
        "url": "https://api.seerapi.com/v1/pet_archive_story_entry/439"
      },
      "peak_pool": null,
      "peak_expert_pool": null,
      "peak_cost_pool": {
        "id": 10,
        "url": "https://api.seerapi.com/v1/peak_cost_pool/10"
      },
      "advance": null,
      "hash": "867ea8fa"
    },
    "loadedAt": "2026-10-21T16:45:04.282Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1583",
    "data": {
      "id": 1583,
      "desc": "自身为对手天敌时，自身受到的伤害除以m（m＝自身对对手的克制倍数，最高不超过2），对手为自身天敌时，自身造成的伤害乘n（n＝对手对自身的克制倍数，最高不超过2）；|回合开始时，若自身体力值与速度值之和低于对手则令对手速度、命中-1，若自身攻击值与特攻值之和低于对手则令对手攻击、特攻-1，若自身防御值与特防值之和低于对手则令对手防御、特防-1；以上效果若至少1项未满足条件或未触发则当回合战斗阶段结束时恢复自身最大体力的1/3，若至少2项未满足条件或未触发则当回合自身所有技能先制+1，若3项均未满足条件或未触发则消除对手回合类效果（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>自身为对手天敌时，自身受到的<b>攻击伤害</b>除以m，m＝自身对对手的克制倍数，最高不超过2\r\n<indent=16><sprite=3><indent=32>对手为自身天敌时，自身造成的<b>攻击伤害</b>乘n，n＝对手对自身的克制倍数，最高不超过2\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>根据比较双方的部分数值，触发以下效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>若自身体力值与速度值之和低于对手则令对手速度、命中-1\r\n<indent=32><sprite=4><sprite=4><indent=64>若自身攻击值与特攻值之和低于对手则令对手攻击、特攻-1\r\n<indent=32><sprite=4><sprite=4><indent=64>若自身防御值与特防值之和低于对手则令对手防御、特防-1\r\n<indent=32><sprite=4><indent=48>根据以上效果的触发情况，触发以下效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>有至少1项未满足条件或未触发则当回合战斗阶段结束时<color=#64F9FA>恢复</color>自身1/3最大体力\r\n<indent=32><sprite=4><sprite=4><indent=64>有至少2项未满足条件或未触发则当回合自身<b>先制</b>+1\r\n<indent=32><sprite=4><sprite=4><indent=64>若3项未满足条件或未触发则<color=#64F9FA>消除</color>对手<b>回合类效果</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4358,
          "url": "https://api.seerapi.com/v1/pet/4358"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          3,
          2,
          1,
          3,
          1
        ],
        "effect": {
          "id": 1942,
          "url": "https://api.seerapi.com/v1/eid_effect/1942"
        }
      },
      "effect_alias": "alias_1942_1_3_2_1_3_1",
      "tag": [
        {
          "id": 9,
          "url": "https://api.seerapi.com/v1/soulmark_tag/9"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 13,
          "url": "https://api.seerapi.com/v1/soulmark_tag/13"
        }
      ],
      "intensified_to": {
        "id": 1905,
        "url": "https://api.seerapi.com/v1/soulmark/1905"
      },
      "from": null,
      "advance": null,
      "hash": "84dc0c15"
    },
    "loadedAt": "2026-10-21T16:45:10.867Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1905",
    "data": {
      "id": 1905,
      "desc": "自身为对手天敌时，自身受到的伤害除以m（m＝自身对对手的克制倍数，最高不超过2），对手为自身天敌时，自身造成的伤害乘n（n＝对手对自身的克制倍数，最高不超过2）|回合开始时，若自身体力值与速度值之和低于对手则令对手速度、命中-1，若自身攻击值与特攻值之和低于对手则令对手攻击、特攻-1，若自身防御值与特防值之和低于对手则令对手防御、特防-1；以上效果若至少1项未满足条件或未触发则每有1项当回合战斗阶段结束时恢复自身最大体力的20%，若至少2项未满足条件或未触发则每有1项当回合自身所有技能先制+1，若3项均未满足条件或未触发则消除对手回合类效果并吸取对手所有技能1点PP值|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>自身为对手天敌时，自身受到的<b>攻击伤害</b>除以m，m＝自身对对手的克制倍数，最高不超过2\r\n<indent=16><sprite=3><indent=32>对手为自身天敌时，自身造成的<b>攻击伤害</b>乘n，n＝对手对自身的克制倍数，最高不超过2\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>根据比较双方的部分数值，触发以下效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>若自身体力值与速度值之和低于对手则令对手速度、命中-1\r\n<indent=32><sprite=4><sprite=4><indent=64>若自身攻击值与特攻值之和低于对手则令对手攻击、特攻-1\r\n<indent=32><sprite=4><sprite=4><indent=64>若自身防御值与特防值之和低于对手则令对手防御、特防-1\r\n<indent=32><sprite=4><indent=48>根据以上效果的触发情况，触发以下效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>若至少1项未满足条件或未触发则每有1项当回合战斗阶段结束时<color=#64F9FA>恢复</color>自身最大体力的20%\r\n<indent=32><sprite=4><sprite=4><indent=64>若至少2项未满足条件或未触发则每有1项当回合自身所有技能<b>先制</b>+1\r\n<indent=32><sprite=4><sprite=4><indent=64>若3项均未满足条件或未触发则<color=#64F9FA>消除</color>对手<b>回合类效果</b>并<color=#64F9FA>吸取</color>对手所有技能1点<b>PP值</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4358,
          "url": "https://api.seerapi.com/v1/pet/4358"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          20,
          2,
          1,
          3,
          1,
          1
        ],
        "effect": {
          "id": 2304,
          "url": "https://api.seerapi.com/v1/eid_effect/2304"
        }
      },
      "effect_alias": "alias_2304_1_20_2_1_3_1_1",
      "tag": [
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 4,
          "url": "https://api.seerapi.com/v1/soulmark_tag/4"
        }
      ],
      "intensified_to": null,
      "from": {
        "id": 1583,
        "url": "https://api.seerapi.com/v1/soulmark/1583"
      },
      "advance": null,
      "hash": "b805865a"
    },
    "loadedAt": "2026-10-21T16:45:17.606Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35813",
    "data": {
      "id": 35813,
      "name": "神钢扶摇",
      "power": 150,
      "max_pp": 5,
      "accuracy": 96,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 30,
        "url": "https://api.seerapi.com/v1/element_type_combination/30"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "先出手时使对手2回合属性技能无效",
          "analyze_info": "[sprite name=iconHit]先出手时使对手2回合属性技能无效",
          "args": [
            2
          ],
          "effect": {
            "id": 1284,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1284"
          }
        },
        {
          "info": "若后出手则消除对手回合类效果",
          "analyze_info": "[sprite name=iconHit]若后出手则消除对手[color=#52a5f2]回合类效果[/color]",
          "args": [],
          "effect": {
            "id": 1083,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1083"
          }
        },
        {
          "info": "技能无效时，恢复自身最大体力的1/2且下1次受到的攻击伤害额外减少50%",
          "analyze_info": "[sprite name=iconInherent]技能无效时，恢复自身最大体力的1/2且下1次受到的攻击[color=#52a5f2]伤害额外减少[/color]50%",
          "args": [
            2,
            1,
            50
          ],
          "effect": {
            "id": 1794,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1794"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "31caec3e"
    },
    "loadedAt": "2026-10-21T16:46:28.592Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1794",
    "data": {
      "id": 1794,
      "args_num": 3,
      "info": "技能无效时，恢复自身最大体力的1/2且下1次受到的攻击伤害额外减少50%",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconInherent]技能无效时，恢复自身最大体力的1/2且下1次受到的攻击[color=#52a5f2]伤害额外减少[/color]50%",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28933,
          "url": "https://api.seerapi.com/v1/skill/28933"
        },
        {
          "id": 29025,
          "url": "https://api.seerapi.com/v1/skill/29025"
        },
        {
          "id": 29213,
          "url": "https://api.seerapi.com/v1/skill/29213"
        },
        {
          "id": 29346,
          "url": "https://api.seerapi.com/v1/skill/29346"
        },
        {
          "id": 29398,
          "url": "https://api.seerapi.com/v1/skill/29398"
        },
        {
          "id": 29447,
          "url": "https://api.seerapi.com/v1/skill/29447"
        },
        {
          "id": 35813,
          "url": "https://api.seerapi.com/v1/skill/35813"
        },
        {
          "id": 36005,
          "url": "https://api.seerapi.com/v1/skill/36005"
        },
        {
          "id": 36304,
          "url": "https://api.seerapi.com/v1/skill/36304"
        },
        {
          "id": 36846,
          "url": "https://api.seerapi.com/v1/skill/36846"
        },
        {
          "id": 37439,
          "url": "https://api.seerapi.com/v1/skill/37439"
        },
        {
          "id": 38144,
          "url": "https://api.seerapi.com/v1/skill/38144"
        },
        {
          "id": 38378,
          "url": "https://api.seerapi.com/v1/skill/38378"
        },
        {
          "id": 38490,
          "url": "https://api.seerapi.com/v1/skill/38490"
        }
      ],
      "tag": [
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        },
        {
          "id": 46009,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/46009"
        }
      ],
      "hash": "8650c556"
    },
    "cacheFile": "research/4037-source-check.json",
    "loadedAt": "2026-10-19T11:18:20.394Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35814",
    "data": {
      "id": 35814,
      "name": "凌风逸天宵",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 30,
        "url": "https://api.seerapi.com/v1/element_type_combination/30"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "对手处于能力下降状态时先制+1",
          "analyze_info": "[sprite name=iconInherent]对手处于能力下降状态时[color=#52a5f2]先制[/color]+1（boss有效）",
          "args": [],
          "effect": {
            "id": 1243,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1243"
          }
        },
        {
          "info": "3回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]3回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            3
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "对手处于能力下降状态造成的伤害提升50%",
          "analyze_info": "[sprite name=iconHit]对手处于能力下降状态造成的伤害提升50%",
          "args": [
            50
          ],
          "effect": {
            "id": 1439,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1439"
          }
        },
        {
          "info": "附加对手能力下降等级总和X50的固定伤害",
          "analyze_info": "[sprite name=iconHit]附加对手能力下降等级总和X50的[color=#52a5f2]固定伤害[/color]",
          "args": [
            50
          ],
          "effect": {
            "id": 1772,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1772"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "ae2e20b9"
    },
    "loadedAt": "2026-10-21T16:46:35.151Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/38358",
    "data": {
      "id": 38358,
      "name": "极影绘风岚",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 30,
        "url": "https://api.seerapi.com/v1/element_type_combination/30"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "对手处于能力下降状态时先制+3",
          "analyze_info": "[sprite name=iconInherent]对手处于能力下降状态时[color=#52a5f2]先制[/color]+3",
          "args": [],
          "effect": {
            "id": 2349,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2349"
          }
        },
        {
          "info": "使敌我双方同时超频4回合",
          "analyze_info": "[sprite name=iconHit]使敌我双方同时[color=#57c975]超频[/color]4回合（boss有效）",
          "args": [
            35,
            4
          ],
          "effect": {
            "id": 547,
            "url": "https://api.seerapi.com/v1/skill_effect_type/547"
          }
        },
        {
          "info": "5回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]5回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            5
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "对手处于能力下降状态则威力提升60%",
          "analyze_info": "[sprite name=iconHit]对手处于能力下降状态则[color=#52a5f2]威力[/color]提升60%",
          "args": [
            60
          ],
          "effect": {
            "id": 1953,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1953"
          }
        },
        {
          "info": "附加双方能力下降等级总和X70的固定伤害",
          "analyze_info": "[sprite name=iconHit]附加双方能力下降等级总和X70的[color=#52a5f2]固定伤害[/color]",
          "args": [
            70
          ],
          "effect": {
            "id": 1773,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1773"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "338078d"
    },
    "loadedAt": "2026-10-21T16:46:41.327Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4358-001 — 两魂印三组数值比较是否计入能力等级

关联实例：1583/84dc0c15，1905/b805865a；eid1942[1,3,2,1,3,1]和2304[1,20,2,1,3,1,1]。完整原文/参数/版本在上方JSON与原始source-check，未改写来源。

查证与差异：原始面板比较与等级修正比较可得不同降级及补偿。两口径结论相同部分全部执行；冲突组明确pending，未猜测。

明确问题：体力+速度、攻击+特攻、防御+特防比较的速度/攻防是否参与能力等级？4327旧回答明确只覆盖4327，不能外推。

已完成：不依赖该回答的技能/魂印全部状态实现、成功失败边界交互及逐项审核；被阻塞部分仅以上未知分支及正式完整部署验收。

我的回答：不计入；所有数值比较的词条都只比面板，不计入能力等级，记下来


### Q-N20-4358-002 — 能力降至下限时的失败组计数

关联实例：同上两真实魂印三组比较及补偿。完整原文/参数/版本在上方JSON与原始source-check，未改写来源。

查证与差异：已实现免弱和条件不满足的明确失败；-6仍可下降部分真实执行。未知组以失败上下界保存，仅实施两口径均成立的补偿，强化比例回复不猜数值。

明确问题：条件满足但该组目标一项或两项已为-6时，是按该组至少一项实际下降算成功，还是必须两项下降？两项均未变化是否算一项失败？

已完成：不依赖该回答的技能/魂印全部状态实现、成功失败边界交互及逐项审核；被阻塞部分仅以上未知分支及正式完整部署验收。

我的回答：必须两项下降；算


### Q-N20-4358-003 — 公共“技能无效”是否包括未命中

关联实例：4358/35813实例2效果1794[2,1,50]；公共关联4037/29447同1794参数、3516/38008效果1803[]。完整原文/参数/版本在上方JSON与原始source-check，未改写来源。

查证与差异：API效果1794与Wiki效果1794 revision344252均无定义；术语页面不存在且检索无补充。现有代码会把MISS交给onInvalid，仅是待核实基线，不当真实依据。整招被封补偿和技能禁疗已真实验证；属性命中效果失效不等于整体技能无效。

明确问题：本条“技能无效时”补偿是否在普通MISS时触发，还是仅技能被整体封锁/主动判无效才触发？

已完成：不依赖该回答的技能/魂印全部状态实现、成功失败边界交互及逐项审核；被阻塞部分仅以上未知分支及正式完整部署验收。

我的回答：miss也触发


### Q-N20-4358-004 — 4358追加第五精确来源兼容授权

关联实例：pet4358 hash867ea8fa；原第五35814/ae2e20b9，追加第五38358/338078d，两个真实魂印及四真实组合。完整原文/参数/版本在上方JSON与原始source-check，未改写来源。

查证与差异：完整最小方案及四组合见research/4358-exact-additional-fifth-proposal.json；原始标记均保留。现有兼容白名单尚不含4358，未修改校验或扩大其他精灵授权。

明确问题：是否授权仅对4358当前pet/魂印/两个第五hash的精确来源组合接入追加第五兼容？

已完成：不依赖该回答的技能/魂印全部状态实现、成功失败边界交互及逐项审核；被阻塞部分仅以上未知分支及正式完整部署验收。

我的回答：授权



## 4359 隙之门·基卢 — 全部独立工作完成，部分待确认

2026-10-21T17:49:42.900Z。42项逐实例审核；25项自身真实状态专项通过，两真实魂印15招完整原始来源正常配招/初始化/执行（35816因780未知触发范围保留正常限制）。资料research/4359-source-check.json、4359-wiki-source.json、4359-extra-source.json；Wiki魂印1584 revision320121、1852 revision320387、效果780 revision343240未解决以下缺口。未部署、未正式验收。

完整相关原始词条、URL/hash、参数及版本：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1584",
    "data": {
      "id": 1584,
      "desc": "自身每次使用攻击技能则获得等同于对手上1次使用的攻击技能威力的提升，自身每次使用属性技能则令对手下回合无法使用属性技能；|回合开始时对手每有1个技能PP值≤2则令自身所有技能额外先制+1，战斗阶段结束时若自身体力低于对手则令对手所有技能PP值-1（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身每次使用攻击技能则获得等同于对手上1次使用的攻击技能<b>威力</b>的<color=#64F9FA>提升</color>\r\n<indent=16><sprite=3><indent=32>自身每次使用属性技能则令对手下回合<b>属性技能<color=#64F9FA></b>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时对手每有1个技能PP值≤2则令自身所有技能额外<b>先制</b>+1\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若自身体力低于对手则令对手所有技能PP值-1",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4359,
          "url": "https://api.seerapi.com/v1/pet/4359"
        }
      ],
      "effect": {
        "effect_args": [
          2,
          1,
          1,
          1
        ],
        "effect": {
          "id": 1943,
          "url": "https://api.seerapi.com/v1/eid_effect/1943"
        }
      },
      "effect_alias": "alias_1943_2_1_1_1",
      "tag": [
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 14,
          "url": "https://api.seerapi.com/v1/soulmark_tag/14"
        },
        {
          "id": 16,
          "url": "https://api.seerapi.com/v1/soulmark_tag/16"
        }
      ],
      "intensified_to": {
        "id": 1852,
        "url": "https://api.seerapi.com/v1/soulmark/1852"
      },
      "from": null,
      "advance": null,
      "hash": "ca815c0a"
    },
    "loadedAt": "2026-10-21T17:33:03.863Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1852",
    "data": {
      "id": 1852,
      "desc": "自身每次使用攻击技能则获得等同于对手上1次使用的攻击技能威力的提升，自身每次使用属性技能则令对手下回合无法使用属性技能|回合开始时对手每有1个技能PP值≤3则令自身所有技能额外先制+1，战斗阶段结束时若自身体力低于对手则吸取对手所有技能PP值1点（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身每次使用攻击技能则获得等同于对手上1次使用的攻击技能<b>威力</b>的<color=#64F9FA>提升</color>\r\n<indent=16><sprite=3><indent=32>自身每次使用属性技能则令对手下回合<b>属性技能<color=#64F9FA></b>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时双方每有1个技能PP值≤3则令自身所有技能额外<b>先制</b>+1\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若自身体力低于对手则<color=#64F9FA>吸取</color>对手所有技能<b>PP值</b>1点",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4359,
          "url": "https://api.seerapi.com/v1/pet/4359"
        }
      ],
      "effect": {
        "effect_args": [
          3,
          1,
          1,
          1
        ],
        "effect": {
          "id": 2246,
          "url": "https://api.seerapi.com/v1/eid_effect/2246"
        }
      },
      "effect_alias": "alias_2246_3_1_1_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 14,
          "url": "https://api.seerapi.com/v1/soulmark_tag/14"
        },
        {
          "id": 16,
          "url": "https://api.seerapi.com/v1/soulmark_tag/16"
        }
      ],
      "intensified_to": null,
      "from": {
        "id": 1584,
        "url": "https://api.seerapi.com/v1/soulmark/1584"
      },
      "advance": null,
      "hash": "be392f9a"
    },
    "loadedAt": "2026-10-21T17:33:10.621Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35816",
    "data": {
      "id": 35816,
      "name": "降维光线",
      "power": 120,
      "max_pp": 10,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 17,
        "url": "https://api.seerapi.com/v1/element_type_combination/17"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "3回合内受到攻击则50%令对手随机1个技能PP值归零",
          "analyze_info": "[sprite name=iconHit]3回合内受到攻击则50%令对手随机1个技能PP值归零",
          "args": [
            3,
            50,
            1
          ],
          "effect": {
            "id": 780,
            "url": "https://api.seerapi.com/v1/skill_effect_type/780"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "3af31b2"
    },
    "loadedAt": "2026-10-21T17:33:30.083Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/780",
    "data": {
      "id": 780,
      "args_num": 3,
      "info": "{0}回合内受到攻击则{1}%令对手随机{2}个技能PP值归零",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内受到攻击则{1}%令对手随机{2}个技能PP值归零",
      "pve_effective": false,
      "param": null,
      "hash": "d0d55140"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35820",
    "data": {
      "id": 35820,
      "name": "逆矩阵之源",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 17,
        "url": "https://api.seerapi.com/v1/element_type_combination/17"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则自身下2次攻击技能造成的伤害额外提升100%",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则自身下2次攻击技能造成的[color=#52a5f2]伤害额外提升[/color]100%（boss有效）",
          "args": [
            2,
            100
          ],
          "effect": {
            "id": 1179,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1179"
          }
        },
        {
          "info": "吸取对手200点体力，若对手任意1项技能PP值小于3点则吸取效果翻倍",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手200点体力，若对手任意1项技能PP值小于3点则[color=#52a5f2]吸取[/color]效果翻倍",
          "args": [
            200,
            3
          ],
          "effect": {
            "id": 1450,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1450"
          }
        },
        {
          "info": "100%令对手失明，未触发则降低对手所有技能1点PP值",
          "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]失明[/color]，[color=#52a5f2]未触发[/color]则降低对手所有技能1点PP值",
          "args": [
            100,
            20,
            1
          ],
          "effect": {
            "id": 1660,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1660"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "8bfdc40e"
    },
    "loadedAt": "2026-10-21T17:34:14.835Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4359-001 — 强化魂印PP计数API内部冲突

关联实例：1852/be392f9a，eid2246[3,1,1,1]；原版1584/ca815c0a明确仅对手≤2。原文、完整参数与版本见上述原始JSON；完整精灵与其余实例见source-check，未改写来源。

已查与具体缺口/战斗差异：API desc写“对手每有1个技能PP值≤3”，同一API desc_formatting_adjustment写“双方每有1个技能PP值≤3”；Wiki重复对手。API内部冲突，不能用API优先Wiki规则裁决自身。对手低PP贡献已实现；自身有低PP时明确pending。

明确问题：1852的先制应只统计对手五槽，还是统计双方十槽？

影响与完成部分：所有不依赖答案的实现、成功/失败/边界/交互测试及逐项审核完成。仅相应未知分支和正式完整验收阻塞；没有把未知语义登记为多精灵豁免。

我的回答：原魂印为对手，羁绊魂印为双方


### Q-N20-4359-002 — 攻击威力提升持续、叠加及取值

关联实例：两版共同“自身每次使用攻击技能则获得等同于对手上1次使用的攻击技能威力的提升”。原文、完整参数与版本见上述原始JSON；完整精灵与其余实例见source-check，未改写来源。

已查与具体缺口/战斗差异：已查API eid1943/hash58cf970f、2246/hash3444e0fc只提供参数数量；Wiki无补充。未说明提升仅本次攻击还是累积保留，及取对手原始威力或其经过威力修改后的实际威力。当前只记录对手真实使用攻击及自身次数；依赖未知答案的增威不填猜测数值，其他魂印全部确定分支已实现。

明确问题：该提升只作用本次攻击，还是累加保留？取对手原始威力还是实际修正后的威力？

影响与完成部分：所有不依赖答案的实现、成功/失败/边界/交互测试及逐项审核完成。仅相应未知分支和正式完整验收阻塞；没有把未知语义登记为多精灵豁免。

我的回答：只作用于本次；原始威力


### Q-N20-4359-003 — 公共780“受到攻击”的零伤/MISS触发

关联实例：4359/35816效果780[3,50,1]/abe0ad9d；公共关联3242/24119，3393/25546，3883/26772，3907/24855。原文、完整参数与版本见上述原始JSON；完整精灵与其余实例见source-check，未改写来源。

已查与具体缺口/战斗差异：API和Wiki只重复“受到攻击则”，受到攻击/伤害免疫术语页不存在、检索无补充。已有代码在受击处理器中触发不是来源。已实现并验证正完整伤害（含原1HP保命、实际HP损失0）、随机非零PP槽、概率失败及PP保护；全部免疫导致结算0、以及MISS是否应触发未猜测。

明确问题：780是否要求攻击命中并造成正完整结算伤害？攻击命中但结算0、普通MISS两种情况分别触发吗？

影响与完成部分：所有不依赖答案的实现、成功/失败/边界/交互测试及逐项审核完成。仅相应未知分支和正式完整验收阻塞；没有把未知语义登记为多精灵豁免。

我的回答：必须命中，结算0也触发；miss不触发；1834遇到命中但被免疫不消耗这一次限伤机会；1834遇到护盾完全挡住攻击、完整结算伤害为0时，触发该效果且消耗限伤次数



## 4361 洛基 — 全部独立工作完成，部分待确认

2026-10-21T18:07:39.557Z。50项逐实例审核，26项自身状态专项、公共影响106/106通过（内含当时自身26项，不能重复累计）。两真实版本17招保持原始ID/参数/版本正常配招、初始化与实际执行。未知魂印语义使完整部署正常拒绝；没有HTTP或验证器通过。来源research/4361-source-check.json、4361-wiki-source.json、4361-extra-source.json；原始词条/字段与hash如下。

```json
[
  {
    "url": "https://api.seerapi.com/v1/pet/4361",
    "data": {
      "id": 4361,
      "name": "洛基",
      "yielding_exp": 140,
      "catch_rate": 0,
      "evolving_lv": 0,
      "releaseable": false,
      "fusion_master": false,
      "fusion_sub": false,
      "has_resistance": true,
      "resource_id": 4361,
      "enemy_resource_id": null,
      "type": {
        "id": 226,
        "url": "https://api.seerapi.com/v1/element_type_combination/226"
      },
      "gender": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/pet_gender/1"
      },
      "base_stats": {
        "atk": 70,
        "def": 110,
        "sp_atk": 142,
        "sp_def": 112,
        "spd": 138,
        "hp": 178,
        "percent": false,
        "total": 750
      },
      "pet_class": {
        "id": 3021,
        "url": "https://api.seerapi.com/v1/pet_class/3021"
      },
      "evolution_chain_index": 0,
      "yielding_ev": {
        "atk": 0,
        "def": 0,
        "sp_atk": 0,
        "sp_def": 0,
        "spd": 0,
        "hp": 0,
        "percent": false,
        "total": 0
      },
      "vipbuff": null,
      "mount_type": null,
      "diy_stats": null,
      "skill": [
        {
          "learning_level": 1,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10086,
            "url": "https://api.seerapi.com/v1/skill/10086"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 5,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20030,
            "url": "https://api.seerapi.com/v1/skill/20030"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 9,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 33072,
            "url": "https://api.seerapi.com/v1/skill/33072"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 13,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 33073,
            "url": "https://api.seerapi.com/v1/skill/33073"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 17,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20088,
            "url": "https://api.seerapi.com/v1/skill/20088"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 21,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35826,
            "url": "https://api.seerapi.com/v1/skill/35826"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 25,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 33075,
            "url": "https://api.seerapi.com/v1/skill/33075"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 29,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 26625,
            "url": "https://api.seerapi.com/v1/skill/26625"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 33,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 33076,
            "url": "https://api.seerapi.com/v1/skill/33076"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 37,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35827,
            "url": "https://api.seerapi.com/v1/skill/35827"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 41,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27940,
            "url": "https://api.seerapi.com/v1/skill/27940"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 45,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35828,
            "url": "https://api.seerapi.com/v1/skill/35828"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 49,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27941,
            "url": "https://api.seerapi.com/v1/skill/27941"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 53,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35829,
            "url": "https://api.seerapi.com/v1/skill/35829"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 57,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27942,
            "url": "https://api.seerapi.com/v1/skill/27942"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 61,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35830,
            "url": "https://api.seerapi.com/v1/skill/35830"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 76,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 35831,
            "url": "https://api.seerapi.com/v1/skill/35831"
          },
          "skill_activation_item": null
        }
      ],
      "soulmark": [
        {
          "id": 1586,
          "url": "https://api.seerapi.com/v1/soulmark/1586"
        },
        {
          "id": 2055,
          "url": "https://api.seerapi.com/v1/soulmark/2055"
        }
      ],
      "factor": [],
      "encyclopedia_entry": {
        "id": 4361,
        "url": "https://api.seerapi.com/v1/pet_encyclopedia_entry/4361"
      },
      "archive_story_entry": null,
      "peak_pool": null,
      "peak_expert_pool": null,
      "peak_cost_pool": null,
      "advance": null,
      "hash": "f2fe625c"
    },
    "loadedAt": "2026-10-21T17:50:08.260Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1586",
    "data": {
      "id": 1586,
      "desc": "自身存活于场下时，对方在场精灵每次攻击结束后，洛基获得1层堕恶神祇以触发诡计神罚|自身登场时，若堕恶神祇达到3层，则2回合内回合开始时、战斗阶段结束时，若自身通过堕恶神祇获得的护盾或护罩消失则对手下1次攻击技能无效、下次下场后本场战斗自身失去本条效果|自身下场时，若自身通过堕恶神祇获得的护盾与护罩均已消失，则重置堕恶神祇|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>洛基存活于场下时，对方使用攻击技能则洛基获得1层<color=#FFF779>堕恶神祇</color>以对对方在场精灵发动1次诡计神罚：\r\n<indent=32><sprite=4><indent=48><color=#64F9FA>附加</color>等同于洛基特攻值20%的<b>真实伤害</b>\r\n<indent=32><sprite=4><sprite=4><indent=64>若对手当前体力低于最大体力的1/5则效果转化为令对手该攻击技能<b>PP值</b><color=#64F9FA>归零</color>\r\n\r\n<indent=0><sprite=0><indent=16>登场效果： \r\n<indent=16><sprite=3><indent=32>洛基登场时，根据堕恶神祇的层数触发累计的效果：\r\n<indent=32><sprite=4><indent=48>达到1层：<color=#64F9FA>获得</color>堕恶神祇层数*100的<b>护盾</b>与<b>护罩</b>；若二者均存在则每回合开始使自身当回合受到的异常状态<color=#64F9FA>转化</color>为流血，若二者均消失则洛基离场后堕恶神祇层数重置\r\n<indent=32><sprite=4><indent=48>达到3层：登场之后2回合内，每个回合开始时与战斗阶段结束时若自身未拥有上述效果中的护盾或护罩其一，则触发以下效果： \r\n<indent=32><sprite=4><sprite=4><indent=64>对手的下1次<b>攻击技能</b><color=#64F9FA>无效</color>\r\n<indent=32><sprite=4><sprite=4><indent=64>本场战斗不再触发上述判定 \r\n\r\n<indent=0><sprite=5><indent=15>堕恶神祇（上限3层，下场保留）：\r\n<indent=16><sprite=6><indent=32>洛基用以触发部分效果的判定依据",
      "analyze_desc": "[sprite name=dot4]自身存活于场下时，[color=#52a5f2]对方[/color]在场精灵每次攻击结束后，洛基获得1层[color=#f35555]堕恶神祇[/color][color=#52a5f2]以[/color]触发[color=#f35555]诡计神罚[/color]|[sprite name=dot4]自身[color=#52a5f2]登场时[/color]，若[color=#f35555]堕恶神祇[/color]达到3层，则2回合内[color=#57c975]回合开始时[/color]、[color=#57c975]战斗阶段结束时[/color]，若自身通过[color=#f35555]堕恶神祇[/color]获得的[color=#57c975]护盾[/color]或[color=#57c975]护罩[/color]消失则[color=#52a5f2]对手[/color]下1次攻击[color=#52a5f2]技能无效[/color]、下次下场后本场战斗自身失去本条效果|[sprite name=dot4]自身[color=#57c975]下场时[/color]，若自身通过[color=#f35555]堕恶神祇[/color]获得的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]均已消失，则重置[color=#f35555]堕恶神祇[/color]",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4361,
          "url": "https://api.seerapi.com/v1/pet/4361"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          2,
          1,
          2,
          2,
          2,
          3,
          1
        ],
        "effect": {
          "id": 1944,
          "url": "https://api.seerapi.com/v1/eid_effect/1944"
        }
      },
      "effect_alias": "alias_1944_100_2_1_2_2_2_3_1",
      "tag": [
        {
          "id": 5,
          "url": "https://api.seerapi.com/v1/soulmark_tag/5"
        },
        {
          "id": 3,
          "url": "https://api.seerapi.com/v1/soulmark_tag/3"
        },
        {
          "id": 17,
          "url": "https://api.seerapi.com/v1/soulmark_tag/17"
        }
      ],
      "intensified_to": {
        "id": 2055,
        "url": "https://api.seerapi.com/v1/soulmark/2055"
      },
      "from": null,
      "advance": null,
      "hash": "ce8136cf"
    },
    "loadedAt": "2026-10-21T17:50:14.221Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/2055",
    "data": {
      "id": 2055,
      "desc": "自身存活于场下时，对方在场精灵每次攻击结束后，洛基获得1层堕恶神祇以触发神诗叙诡|自身登场时，若堕恶神祇达到3层，则2回合内战斗阶段结束时，若自身通过堕恶神祇获得的护盾或护罩消失则使己方下1回合免疫对手的攻击，免疫成功时重置对方的虚饰弧光，自身不在场时额外重置自身的堕恶神祇层数|（boss无效）",
      "desc_formatting_adjustment": null,
      "analyze_desc": "[sprite name=dot4]自身存活于场下时，对方在场精灵每次攻击结束后，洛基获得1层[color=#f35555]堕恶神祇[/color][color=#52a5f2]以[/color]触发[color=#f35555]神诗叙诡[/color]|[sprite name=dot4]自身[color=#57c975]登场时[/color]，若[color=#f35555]堕恶神祇[/color][color=#52a5f2]达到[/color]3层，则2回合内[color=#57c975]战斗阶段结束时[/color]，若自身通过[color=#f35555]堕恶神祇[/color]获得的[color=#57c975]护盾[/color]或[color=#57c975]护罩[/color]消失则使[color=#52a5f2]己方[/color]下1回合[color=#52a5f2]免疫对手的攻击[/color]，免疫成功时重置[color=#52a5f2]对方[/color]的[color=#f35555]虚饰弧光[/color]，自身不在场时额外重置自身的[color=#f35555]堕恶神祇[/color]层数",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4361,
          "url": "https://api.seerapi.com/v1/pet/4361"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          0
        ],
        "effect": {
          "id": 2476,
          "url": "https://api.seerapi.com/v1/eid_effect/2476"
        }
      },
      "effect_alias": "alias_2476_1_0",
      "tag": [
        {
          "id": 3,
          "url": "https://api.seerapi.com/v1/soulmark_tag/3"
        },
        {
          "id": 15,
          "url": "https://api.seerapi.com/v1/soulmark_tag/15"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": {
        "id": 1586,
        "url": "https://api.seerapi.com/v1/soulmark/1586"
      },
      "advance": null,
      "hash": "39e0b383"
    },
    "loadedAt": "2026-10-21T17:50:21.259Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4361-001 — 强化2055神诗叙诡、神祇盾罩及虚饰弧光定义缺失

精灵4361，强化魂印2055/hash39e0b383，eid2476[1,0]/hash ece24480。完整原始词条见上方。已查API所有描述字段、底层eid仅参数数量、项目来源无其他定义、Wiki魂印2055 revision339055以及三个术语页（缺失）和组合检索，无可补充定义。原版的诡计神罚和授盾定义不能自行扩大到新命名强化能力。

缺口及战斗差异：神诗叙诡的完整效果、神祇层数与授盾护罩是否仍按原版层数*100，以及虚饰弧光的类型/归属/重置值未说明。若沿用原版授盾，3层有300盾和300罩并能按来源消失检查；若新能力不同则触发窗口和免疫均可能变化，不能构造无依据的其他数值选项。未知重置不假填0。神诗的场下部分明确延期但缺定义仍登记待查；当前明确在场的盾罩消失授予次回合免疫已实现并状态测试，不把未知定义整体当多精灵豁免。

明确问题：请补充2055神诗叙诡、堕恶神祇授盾护罩及虚饰弧光的完整定义（含参数和重置值）。

我的回答：堕恶神祇
自身登场时，每有1层获得100点护盾、护罩，之后每回合开始时，若此护盾与护罩均存在，则当回合自身受到的异常状态转化为流血；最高3层

神诗叙诡
附加自身特攻值20%的真实伤害，若此伤害不足以致死，则此伤害不会减少对手的体力值并转化为等量的虚饰弧光累计至对手；己方在场精灵存在技能PP值为0时，吸取对手当回合所使用的技能全部PP值平均恢复至己方在场精灵PP值为0的技能

虚饰弧光
自身受到技能伤害后，若自身体力值低于虚饰弧光，则移除虚饰弧光并消耗自身全部体力；下场保留

诡计神罚
附加自身特攻值20%的真实伤害，若对手的体力值低于最大体力的1/5则改为令对手当回合所使用的攻击技能PP值归0
2055免疫成功后，“重置对方的虚饰弧光”就是将其累计值清零

### Q-N20-4361-002 — 原版1586失盾首次奖励后的停用时机有API字段冲突

精灵4361，原版魂印1586/hashce8136cf，eid1944[100,2,1,2,2,2,3,1]/hash6f7bd719。API desc原文包含“下次下场后本场战斗自身失去本条效果”，desc_formatting_adjustment写“本场战斗不再触发上述判定”；完整字段未删改，见上方。Wiki魂印1586 revision320123写额外效果触发后之后登场不再触发，不能消除API自身时间点矛盾。底层eid只有参数数量，无法裁决。

差异：首次失去任一来源盾罩授予下次攻击技能无效是确定交集；若立即停用，则本次在场不会再授予；若等下次下场才停用，入场两回合窗口内多个回合开始/战阶末可能重复授予。当前实现首次奖励，重复候选显式pending，不填猜测次数；控制未用不消费、攻击实际使用消费、来源分离和两回合边界均验证。

明确问题：首次破盾/罩奖励后，是立即停止本场后续判定，还是直到下一次下场才停止（若后者，同次在场能否按每个回合开始及战阶末重复奖励）？

我的回答：直到下一次下场才停止；可以但该技能无效不可叠加，最多只存一次



## 4364 尤莉米特 — 全部独立工作完成，部分待确认

2026-10-21T18:30:22.914Z。52项逐实例审核，28项自身专项与公共148/148通过（内含自身28项，不能重复累计）。18真实技能包含伙伴37340，未知第五35847使正常完整配招/初始化/部署拒绝；未冒充已完成正常本地接入或HTTP，未跑已知必失败的正式验证器。来源research/4364-source-check.json、4364-wiki-source.json、4364-extra-source.json；Wiki魂印1588 revision320125、2080 revision341449，效果1090 revision348967、1801 revision344259、1802 revision344260及检索未解决以下缺口。

完整原始词条、参数、URL/hash和版本实例：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1588",
    "data": {
      "id": 1588,
      "desc": "自身出战时获得群辉加护；自身拥有群辉加护时，若对手处于回合类效果则自身闪避对手的技能，若对手的技能命中自身则命中后对手每有1个与此技能类型不同的技能自身恢复120点体力|己方其他精灵首次出战时自身获得1层群芳加护（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>群芳加护：\r\n<indent=16><sprite=3><indent=32>自身每次登场后获得<b>群芳加护</b>：\r\n<indent=32><sprite=4><indent=48>对手拥有回合类效果时，100%<color=#64F9FA>闪避</color>对手的技能\r\n<indent=32><sprite=4><indent=48>自身被技能命中后，<color=#64F9FA>恢复</color>对手所携带不同类型技能数*120的<b>体力</b>\r\n<indent=16><sprite=3><indent=32>若自身被攻击技能命中，则群芳加护消失\r\n<indent=16><sprite=3><indent=32>群芳加护消失后，下回合对手<color=#64F9FA>先制效果失效</color>且以回合类效果形式1回合内<color=#64F9FA>无法主动切换精灵</color>\r\n\r\n<indent=0><sprite=0><indent=16>群辉加护：\r\n<indent=16><sprite=3><indent=32>己方每只其他精灵首次登场后，自身获得1层<b>群辉加护</b>\r\n<indent=16><sprite=3><indent=32>自身被击败时，消耗自身所有群辉加护，每有1层群辉加护：\r\n<indent=32><sprite=4><indent=48>所有<b>不在场精灵</b>所有技能<color=#64F9FA>恢复</color>1点PP\r\n<indent=32><sprite=4><indent=48>己方下只精灵登场后首次技能<color=#64F9FA>附加</color>群芳加护消失时自身所受到攻击伤害20%的<b>百分比伤害</b>",
      "analyze_desc": "[sprite name=dot4]自身[color=#57c975]出战时[/color]获得[color=#f35555]群辉加护[/color]；自身拥有[color=#f35555]群辉加护[/color]时，若对手处于[color=#52a5f2]回合类效果[/color]则自身[color=#57c975]闪避[/color]对手的技能，若对手的技能命中自身则命中后对手每有1个与此技能类型不同的技能自身恢复120点体力|[color=#52a5f2]己方[/color]其他精灵[color=#52a5f2]首次[/color][color=#57c975]出战时[/color]自身获得1层[color=#f35555]群芳加护[/color]",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4364,
          "url": "https://api.seerapi.com/v1/pet/4364"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          120,
          1
        ],
        "effect": {
          "id": 1950,
          "url": "https://api.seerapi.com/v1/eid_effect/1950"
        }
      },
      "effect_alias": "alias_1950_100_120_1",
      "tag": [
        {
          "id": 5,
          "url": "https://api.seerapi.com/v1/soulmark_tag/5"
        },
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 18,
          "url": "https://api.seerapi.com/v1/soulmark_tag/18"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "d3a9f290"
    },
    "loadedAt": "2026-10-21T18:08:18.288Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/2080",
    "data": {
      "id": 2080,
      "desc": "自身出战时获得群辉加护；自身拥有群辉加护时，若对手处于回合类效果则自身闪避对手的技能，若对手的技能命中自身则命中后对手每有1个与此技能类型不同的技能自身恢复120点体力，若对手的技能未命中自身则此次技能结束时本次在场每闪避成功1次，吸取对手120点体力|己方其他精灵首次出战时自身获得1层群芳加护；自身拥有群芳加护时，双方使用技能后自身与对手受到1点固定伤害，然后若对手的体力未减少则本次在场自身造成的攻击伤害提升20%，若自身的体力未减少则本次在场造成的固定伤害、百分比伤害提升20%，伤害提升效果均可叠加，自身每有1层群芳加护最高可叠加1次|（boss无效）",
      "desc_formatting_adjustment": null,
      "analyze_desc": "[sprite name=dot4]自身[color=#57c975]出战时[/color]获得[color=#f35555]群辉加护[/color]；自身拥有[color=#f35555]群辉加护[/color]时，若对手处于[color=#52a5f2]回合类效果[/color]则自身[color=#57c975]闪避[/color]对手的技能，若对手的技能命中自身则命中后对手每有1个与此技能类型不同的技能自身恢复120点体力，若对手的技能未命中自身则此次技能结束时本次在场每[color=#57c975]闪避[/color]成功1次，[color=#52a5f2]吸取[/color]对手120点体力|[color=#52a5f2]己方[/color]其他精灵[color=#52a5f2]首次[/color][color=#57c975]出战时[/color]自身获得1层[color=#f35555]群芳加护[/color]；自身拥有[color=#f35555]群芳加护[/color]时，双方[color=#57c975]使用技能后[/color]自身与对手受到1点[color=#52a5f2]固定伤害[/color]，[color=#52a5f2]然后[/color]若对手的体力未减少则本次在场自身造成的攻击伤害提升20%，若自身的体力未减少则本次在场造成的[color=#52a5f2]固定伤害[/color]、[color=#52a5f2]百分比伤害[/color]提升20%，伤害提升效果均可叠加，自身每有1层[color=#f35555]群芳加护[/color]最高可叠加1次",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4364,
          "url": "https://api.seerapi.com/v1/pet/4364"
        }
      ],
      "effect": {
        "effect_args": [
          101,
          120,
          1
        ],
        "effect": {
          "id": 1950,
          "url": "https://api.seerapi.com/v1/eid_effect/1950"
        }
      },
      "effect_alias": "alias_1950_101_120_1",
      "tag": [
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "fa61a6cf"
    },
    "loadedAt": "2026-10-21T18:08:25.144Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/27949",
    "data": {
      "id": 27949,
      "name": "芳缀山河",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹异常状态了；己方每存活1只精灵则自身下1次受到的固定伤害和百分比伤害减少10%。己方每阵亡1只精灵则吸取对手50点体力，自身存在群辉加护时效果提升",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "4回合内每回合结束后解除并反馈自身能力下降状态",
          "analyze_info": "[sprite name=iconHit]4回合内每[color=#57c975]回合结束后[/color]解除并反馈自身能力下降状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 922,
            "url": "https://api.seerapi.com/v1/skill_effect_type/922"
          }
        },
        {
          "info": "己方场下每存活1只精灵，自身下1次受到的固定伤害、百分比伤害减少10%，自身每有1层群芳加护提升10%，己方场下每阵亡1只精灵，吸取对手50点体力，自身每有1层群芳加护提升50点",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]己方[/color]场下每存活1只精灵，自身下1次受到的[color=#52a5f2]固定伤害[/color]、[color=#52a5f2]百分比伤害[/color]减少10%，自身每有1层群芳加护提升10%，[color=#52a5f2]己方[/color]场下每阵亡1只精灵，[color=#52a5f2]吸取[/color]对手50点体力，自身每有1层群芳加护提升50点",
          "args": [
            10,
            10,
            50,
            50
          ],
          "effect": {
            "id": 1800,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1800"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "cc05536c"
    },
    "loadedAt": "2026-10-21T18:09:03.956Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35846",
    "data": {
      "id": 35846,
      "name": "繁星赞美诗",
      "power": 150,
      "max_pp": 5,
      "accuracy": 96,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 49,
        "url": "https://api.seerapi.com/v1/element_type_combination/49"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若上回合自身未受到攻击伤害则附加对手最大体力1/3的百分比伤害",
          "analyze_info": "[sprite name=iconHit]若上回合自身未受到攻击伤害则附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
          "args": [
            3
          ],
          "effect": {
            "id": 1801,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1801"
          }
        },
        {
          "info": "若上回合自身受到了攻击伤害则下1次受到的攻击伤害不会超过上回合所受攻击伤害的数额",
          "analyze_info": "[sprite name=iconHit]若上回合自身受到了攻击伤害则下1次受到的攻击伤害不会超过上回合所受攻击伤害的数额",
          "args": [
            1
          ],
          "effect": {
            "id": 1802,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1802"
          }
        },
        {
          "info": "未击败对手则下回合自身所有技能先制+2",
          "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则下回合自身所有[color=#52a5f2]技能先制[/color]+2（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 984,
            "url": "https://api.seerapi.com/v1/skill_effect_type/984"
          }
        },
        {
          "info": "击败对手则1回合内令对手攻击技能无法造成伤害且命中效果失效",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则1回合内令对手攻击技能无法造成伤害且命中效果失效",
          "args": [
            1
          ],
          "effect": {
            "id": 1090,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1090"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "363e35f"
    },
    "loadedAt": "2026-10-21T18:09:30.141Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1801",
    "data": {
      "id": 1801,
      "args_num": 1,
      "info": "若上回合自身未受到攻击伤害则附加对手最大体力1/{0}的百分比伤害",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若上回合自身未受到攻击伤害则附加对手最大体力1/{0}的[color=#52a5f2]百分比伤害[/color]",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28805,
          "url": "https://api.seerapi.com/v1/skill/28805"
        },
        {
          "id": 29287,
          "url": "https://api.seerapi.com/v1/skill/29287"
        },
        {
          "id": 35846,
          "url": "https://api.seerapi.com/v1/skill/35846"
        },
        {
          "id": 36666,
          "url": "https://api.seerapi.com/v1/skill/36666"
        },
        {
          "id": 36757,
          "url": "https://api.seerapi.com/v1/skill/36757"
        },
        {
          "id": 36771,
          "url": "https://api.seerapi.com/v1/skill/36771"
        },
        {
          "id": 37340,
          "url": "https://api.seerapi.com/v1/skill/37340"
        },
        {
          "id": 38239,
          "url": "https://api.seerapi.com/v1/skill/38239"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "1d75511d"
    },
    "loadedAt": "2026-10-21T18:09:36.149Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1802",
    "data": {
      "id": 1802,
      "args_num": 1,
      "info": "若上回合自身受到了攻击伤害则下{0}次受到的攻击伤害不会超过上回合所受攻击伤害的数额",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若上回合自身受到了攻击伤害则下{0}次受到的攻击伤害不会超过上回合所受攻击伤害的数额",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 35846,
          "url": "https://api.seerapi.com/v1/skill/35846"
        },
        {
          "id": 37033,
          "url": "https://api.seerapi.com/v1/skill/37033"
        }
      ],
      "tag": [
        {
          "id": 64371,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/64371"
        }
      ],
      "hash": "2720d142"
    },
    "loadedAt": "2026-10-21T18:09:42.659Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1090",
    "data": {
      "id": 1090,
      "args_num": 1,
      "info": "击败对手则{0}回合内令对手攻击技能无法造成伤害且命中效果失效",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则{0}回合内令对手攻击技能无法造成伤害且命中效果失效",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 30367,
          "url": "https://api.seerapi.com/v1/skill/30367"
        },
        {
          "id": 30580,
          "url": "https://api.seerapi.com/v1/skill/30580"
        },
        {
          "id": 31295,
          "url": "https://api.seerapi.com/v1/skill/31295"
        },
        {
          "id": 32184,
          "url": "https://api.seerapi.com/v1/skill/32184"
        },
        {
          "id": 32716,
          "url": "https://api.seerapi.com/v1/skill/32716"
        },
        {
          "id": 33927,
          "url": "https://api.seerapi.com/v1/skill/33927"
        },
        {
          "id": 35220,
          "url": "https://api.seerapi.com/v1/skill/35220"
        },
        {
          "id": 35670,
          "url": "https://api.seerapi.com/v1/skill/35670"
        },
        {
          "id": 35821,
          "url": "https://api.seerapi.com/v1/skill/35821"
        },
        {
          "id": 35846,
          "url": "https://api.seerapi.com/v1/skill/35846"
        },
        {
          "id": 35945,
          "url": "https://api.seerapi.com/v1/skill/35945"
        },
        {
          "id": 36215,
          "url": "https://api.seerapi.com/v1/skill/36215"
        },
        {
          "id": 36762,
          "url": "https://api.seerapi.com/v1/skill/36762"
        },
        {
          "id": 37340,
          "url": "https://api.seerapi.com/v1/skill/37340"
        },
        {
          "id": 37522,
          "url": "https://api.seerapi.com/v1/skill/37522"
        },
        {
          "id": 38177,
          "url": "https://api.seerapi.com/v1/skill/38177"
        }
      ],
      "tag": [
        {
          "id": 52161,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/52161"
        },
        {
          "id": 44313,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
        }
      ],
      "hash": "9c49fdb"
    },
    "cacheFile": "research/4246-source-check.json",
    "loadedAt": "2026-10-20T08:41:05.228Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/37340",
    "data": {
      "id": 37340,
      "name": "星罗阑珊谱",
      "power": 150,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 14,
        "url": "https://api.seerapi.com/v1/element_type_combination/14"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若上回合自身未受到攻击伤害则附加对手最大体力1/3的百分比伤害",
          "analyze_info": "[sprite name=iconHit]若上回合自身未受到攻击伤害则附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
          "args": [
            3
          ],
          "effect": {
            "id": 1801,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1801"
          }
        },
        {
          "info": "出手时本回合若未受到伤害则对手下2回合先制-2",
          "analyze_info": "[sprite name=iconHit]出手时本回合若未受到伤害则对手下2回合[color=#52a5f2]先制[/color]-2",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 1708,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1708"
          }
        },
        {
          "info": "未击败对手则恢复自身所有技能2点PP值",
          "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则恢复自身所有技能2点PP值",
          "args": [
            2
          ],
          "effect": {
            "id": 1821,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1821"
          }
        },
        {
          "info": "击败对手则2回合内令对手攻击技能无法造成伤害且命中效果失效",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则2回合内令对手攻击技能无法造成伤害且命中效果失效",
          "args": [
            2
          ],
          "effect": {
            "id": 1090,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1090"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "486b4118"
    },
    "loadedAt": "2026-10-21T18:09:49.011Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35847",
    "data": {
      "id": 35847,
      "name": "千华觅月歌",
      "power": 160,
      "max_pp": 5,
      "accuracy": 0,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 49,
        "url": "https://api.seerapi.com/v1/element_type_combination/49"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "技能无效时，恢复自身最大体力的1/3且对手2回合内属性技能命中效果失效，自身体力低于1/2时恢复效果翻倍，自身体力高于1/2时失效回合+1",
          "analyze_info": "[sprite name=iconInherent]技能无效时，恢复自身最大体力的1/3且对手2回合内属性技能命中效果失效，自身体力低于1/2时恢复效果翻倍，自身体力高于1/2时失效回合+1",
          "args": [],
          "effect": {
            "id": 1803,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1803"
          }
        },
        {
          "info": "100%令对手麻痹，触发后3回合内对手主动切换精灵则若当回合开始后100%令对手束缚",
          "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]麻痹[/color]，触发后3回合内对手[color=#52a5f2]主动切换[/color]精灵则若[color=#52a5f2]当回合[/color]开始后100%令对手[color=#57c975]束缚[/color]",
          "args": [
            100,
            0,
            3,
            100,
            28
          ],
          "effect": {
            "id": 1562,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1562"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "88a80618"
    },
    "loadedAt": "2026-10-21T18:10:02.475Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4364-001 — 原版加护名称与角色API内部对调

关联实例：原版1588/d3a9f290，eid1950[100,120,1]/a89bfa20；27949效果1800[10,10,50,50]。完整原文、URL、hash与参数见上述原始JSON，未改写来源。

已查与缺口/战斗差异：API desc称自身出战获得群辉、其他精灵首次出战产生群芳层；同一API格式化字段称自身群芳、其他精灵产生群辉层。Wiki支持格式化，但不能裁决API内部冲突。自身出战组闪避/回复的共同角色已实现；1800究竟用自身保护1层还是其他精灵产生的层数影响10%减伤与50点吸取。原版层数不填假值，给定真实已知层数的自身公式已实现。

明确问题：原版1588群芳/群辉应如何对应“自身出战保护”与“其他精灵首次出战层数”，1800使用哪一种层数？

完成与阻塞：所有不依赖答案的来源、逐项审核、实现及真实状态成功/失败/边界/关键交互完成。仅所列未知分支及正常完整部署/正式验收受阻，不伪称成功或豁免。

我的回答：群辉加护
自身被攻击技能命中后消耗；消耗时己方记录当回合自身受到的技能伤害，对手下回合先制效果失效且以回合类效果形式下回合无法主动切换精灵

群芳加护
自身被击败时消耗；消耗时每消耗1层，己方所有不在场精灵所有技能恢复1点PP且下只精灵登场后首次技能附加群辉加护消耗时所记录伤害20%的百分比伤害
群辉群芳是两个词条


### Q-N20-4364-002 — 强化自身保护被命中后的生命周期

关联实例：强化2080/fa61a6cf，eid1950[101,120,1]。完整原文、URL、hash与参数见上述原始JSON，未改写来源。

已查与缺口/战斗差异：强化原文和Wiki都只说拥有自身加护时闪避/命中回复/未命中吸取，没有原版格式化的攻击命中后消失、次回合先制失效条件，不能擅自沿用。第一次攻击命中后的已知回复已经实现，之后保护寿命显式pending；属性命中后的明确交集不消失，强化团队层当前自身触发增伤分支全部实现。若攻击命中后消失则后续无闪避回复，若持续则仍可触发，战斗差异实质。

明确问题：2080自身出战获得的保护，是否在被攻击技能命中后消失？若会，是否仍有原版的次回合先制失效与禁止换宠？

完成与阻塞：所有不依赖答案的来源、逐项审核、实现及真实状态成功/失败/边界/关键交互完成。仅所列未知分支及正常完整部署/正式验收受阻，不伪称成功或豁免。

我的回答：群辉加护在被攻击技能命中后消失；有


### Q-N20-4364-003 — 强化闪避累计与未命中分类

关联实例：2080自身出战保护，“若对手的技能未命中自身则此次技能结束时本次在场每闪避成功1次，吸取对手120点体力”。完整原文、URL、hash与参数见上述原始JSON，未改写来源。

已查与缺口/战斗差异：明确由魂印闪避且无其他失败原因时的第一次120、第二次240及理论吸取已真实验证。普通命中率MISS、失明、技能整体被封、其他强制未命中是否计为“闪避成功”缺定义；不同分类会改变此次及后续累计吸取量。发生不明失败历史后不按已知最小计数伪造完整吸取数值。

明确问题：哪些未命中原因计入2080累计闪避，并触发吸取：普通MISS、失明、技能被整体封锁、强制未命中、其他来源闪避分别如何？

完成与阻塞：所有不依赖答案的来源、逐项审核、实现及真实状态成功/失败/边界/关键交互完成。仅所列未知分支及正常完整部署/正式验收受阻，不伪称成功或豁免。

我的回答：仅普通miss


### Q-N20-4364-004 — 原版保护消失后先制效果失效的范围

关联实例：1588格式化字段“群芳加护消失后，下回合对手先制效果失效”。完整原文、URL、hash与参数见上述原始JSON，未改写来源。

已查与缺口/战斗差异：已查原文、Wiki及既有确认；Q-A60-4288-076只对4288确认额外正向先制失效，不能扩为此实例。基础技能先制、额外正向先制、负向修正是否保留影响实际顺序；当前先制分支显式pending，原版保护消失/回复与禁止真实切换的延期均已分离。

明确问题：1588的先制失效仅禁止额外正向先制，还是也把基础先制与负向修正归零？

完成与阻塞：所有不依赖答案的来源、逐项审核、实现及真实状态成功/失败/边界/关键交互完成。仅所列未知分支及正常完整部署/正式验收受阻，不伪称成功或豁免。

我的回答：4372魂印1597在迷阵解除后的先制失效，也把基础先制、额外正先制和负向修正全部归零


### Q-N20-4364-005 — 公共1801第一回合没有上回合的判定

关联实例：35846实例0、伙伴37340实例0，效果1801/1d75511d [3]。完整原文、URL、hash与参数见上述原始JSON，未改写来源。

已查与缺口/战斗差异：API与Wiki仅说“若上回合自身未受到攻击伤害”，未说明首回合没有上回合是否成立。后续实际前回合0伤、正完整伤害（含保留1HP实际损失0）已分别实现，记录与当前回合分开。首回合取0会附对手最大HP/3；要求实际存在上回合则不附，当前首回合明确pending。

明确问题：1801首回合没有上回合时，应当视为未受到攻击伤害并附加三分一，还是不触发？

完成与阻塞：所有不依赖答案的来源、逐项审核、实现及真实状态成功/失败/边界/关键交互完成。仅所列未知分支及正常完整部署/正式验收受阻，不伪称成功或豁免。

我的回答：不触发


### Q-N20-4364-006 — 本只1090作用对象及两精确实例接入授权

关联实例：35846实例3 [1]、伙伴37340实例3 [2]，效果1090/9c49fdb；完整精确方案research/4364-1090-exact-proposal.json。完整原文、URL、hash与参数见上述原始JSON，未改写来源。

已查与缺口/战斗差异：原文“击败对手则N回合内令对手攻击技能无法造成伤害且命中效果失效”未明后继或复活原目标。旧Q-A60-4246-060明确仅4246，注册表也仅放行35220/cf57d8f0实例2[1]，没有扩大授权。API/Wiki未补明；不能靠旧ID空延期豁免本实例，也不正常绕过校验。最小方案只增加本只两个真实hash实例，须先明确目标与时长。

明确问题：本只1090是否也作用于下一只真实对手（而非复活原目标），分别持续击败后的下1/2回合？若是，是否授权按提案仅接入这两个精确来源实例？

完成与阻塞：所有不依赖答案的来源、逐项审核、实现及真实状态成功/失败/边界/关键交互完成。仅所列未知分支及正常完整部署/正式验收受阻，不伪称成功或豁免。

我的回答：确认4386的35945／8f085421／实例3／1090[2]同样作用于下一只真实对手、持续击败后下2回合，并授权该新增精确实例？

### 关联公共主问题 Q-N20-4358-003 — 新增4364第五35847效果1803

关联35847/hash88a80618，实例0，1803[]/hash7ffa6061。完整原文和来源见上方JSON。“技能无效”是否包含普通MISS继续并入已有公共主问题，不新建同义问题、不替填答案。整招无效时的三分一/低半翻倍回复、高半时长、技能禁疗及只禁属性附效已实际验证。



## 4372 幻魅灵狐·苏璃 — 全部独立工作完成，部分待确认

2026-10-21T19:03:48.658Z。46项逐实例审核，29项自身状态专项通过，公共影响218/218通过（含当时自身28项，后来补1项仅本只再验，不能重复累计）。17招全部基础及独立效果真实状态执行；真实第五正常受待确认限制，尚未正常完整配招/初始化/部署、HTTP及正式认证。来源research/4372-source-check.json、4372-wiki-source.json、4372-extra-source.json；真实性别证据research/4372-gender-evidence.json。Wiki魂印1597及效果1806只重复原文，未解决下述API内部矛盾/缺口。API eid1958/37ef3a3只提供7参数数量；同词条公共药剂反转69/hash50942e00仅作为相同原文通用机制依据，药剂250为实验台已有数值，不伪称为精灵上游参数。

完整原始词条、URL/hash、参数和版本：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1597",
    "data": {
      "id": 1597,
      "desc": "每次登场后自身首次技能命中前100%令对手睡眠，未触发则消除对手回合类效果，若自身登场时对手为雄性精灵则对手额外陷入失心迷阵；|回合开始时若对手处于失心迷阵则令自身防御、特防、命中+1且当回合自身受到的攻击伤害减少30%；回合开始时若对手未处于失心迷阵则令对手防御、特防、命中-1且当回合自身造成的攻击伤害提升30%|（失心迷阵对手下场不保留，所有特效boss无效）|失心迷阵：自身使用体力药剂时效果变成减少相应的体力；回合结束后，若双方均不处于能力提升及能力下降状态，则失心迷阵解除，下回合自身无法主动切换精灵、所有先制效果失效且受到的攻击伤害额外提升120%",
      "desc_formatting_adjustment": "<indent=16><sprite=3><indent=32>登场效果：\r\n<indent=32><sprite=4><indent=48>每次登场时，若对手为雄性精灵则令对手陷入<color=#FFF779>失心迷阵</color>\r\n<indent=32><sprite=4><indent=48>每次登场之后，自身首次使用技能前100%<color=#64F9FA>令对手睡眠</color>\r\n<indent=32><sprite=4><sprite=4><indent=64>未触发则<color=#64F9FA>消除</color>对手<b>回合类效果</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手处于失心迷阵则令自身防御、特防、命中+1且当回合自身受到的<b>攻击伤害</b><color=#64F9FA>减少</color>30%\r\n<indent=32><sprite=4><indent=48>若对手不处于失心迷阵则令对手防御、特防、命中-1且当回合自身造成的<b>攻击伤害</b><color=#64F9FA>提升</color>30%\r\n\r\n<indent=0><sprite=5><indent=15>失心迷阵：\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>药剂效果中的体力增加变为体力减少</color>\r\n<indent=16><sprite=6><indent=32>回合结束后，若双方均不处于能力提升及能力下降状态，则失心迷阵解除并触发以下效果：\r\n<indent=32><sprite=4><indent=48>自身下回合<color=#64F9FA>无法主动切换精灵</color>\r\n<indent=32><sprite=4><indent=48>自身下回合<color=#64F9FA>先制效果失效</color>且受到的<b>攻击伤害</b><color=#64F9FA>提升</color>120%",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4372,
          "url": "https://api.seerapi.com/v1/pet/4372"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          1,
          30,
          1,
          30,
          120,
          1
        ],
        "effect": {
          "id": 1958,
          "url": "https://api.seerapi.com/v1/eid_effect/1958"
        }
      },
      "effect_alias": "alias_1958_100_1_30_1_30_120_1",
      "tag": [
        {
          "id": 9,
          "url": "https://api.seerapi.com/v1/soulmark_tag/9"
        },
        {
          "id": 11,
          "url": "https://api.seerapi.com/v1/soulmark_tag/11"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "d8f17d91"
    },
    "loadedAt": "2026-10-21T18:31:00.552Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35890",
    "data": {
      "id": 35890,
      "name": "璃·舞倾天下",
      "power": 99,
      "max_pp": 1,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "我想时间会给出答案的，临行前让我最后为你跳这一舞吧。",
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 29,
        "url": "https://api.seerapi.com/v1/element_type_combination/29"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则己方免疫下2次受到的异常状态",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则[color=#52a5f2]己方[/color]免疫下2次受到的异常状态",
          "args": [
            2
          ],
          "effect": {
            "id": 928,
            "url": "https://api.seerapi.com/v1/skill_effect_type/928"
          }
        },
        {
          "info": "100%令对手束缚，未触发则降低对手所有技能2点PP值",
          "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]束缚[/color]，[color=#52a5f2]未触发[/color]则降低对手所有技能2点PP值",
          "args": [
            100,
            28,
            2
          ],
          "effect": {
            "id": 1660,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1660"
          }
        },
        {
          "info": "若对手为雄性精灵，则未陷入失心迷阵时令对手陷入失心迷阵，陷入失心迷阵时当次攻击不消耗自身PP值；若对手不为雄性精灵，则恢复自身全部体力",
          "analyze_info": "[sprite name=iconHit]若对手为雄性精灵，则未陷入[color=#f35555]失心迷阵[/color]时令对手陷入[color=#f35555]失心迷阵[/color]，陷入[color=#f35555]失心迷阵[/color]时当次攻击不消耗自身PP值；若对手不为雄性精灵，则恢复自身全部体力",
          "args": [],
          "effect": {
            "id": 1806,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1806"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "603f67fb"
    },
    "loadedAt": "2026-10-21T18:32:43.887Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1806",
    "data": {
      "id": 1806,
      "args_num": 0,
      "info": "若对手为雄性精灵，则未陷入失心迷阵时令对手陷入失心迷阵，陷入失心迷阵时当次攻击不消耗自身PP值；若对手不为雄性精灵，则恢复自身全部体力",
      "info_formatting_adjustment": "<condition>若对手为雄性精灵</condition>，则：\r\n--><condition>未<condition>陷入失心迷阵时</condition></condition>令对手陷入失心迷阵\r\n--><condition>陷入失心迷阵时</condition>当次攻击不消耗自身PP值\r\n<condition>若对手不为雄性精灵</condition>，则恢复自身全部体力",
      "analyze_info": "[sprite name=iconHit]若对手为雄性精灵，则未陷入[color=#f35555]失心迷阵[/color]时令对手陷入[color=#f35555]失心迷阵[/color]，陷入[color=#f35555]失心迷阵[/color]时当次攻击不消耗自身PP值；若对手不为雄性精灵，则恢复自身全部体力",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 35890,
          "url": "https://api.seerapi.com/v1/skill/35890"
        }
      ],
      "tag": [
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        }
      ],
      "hash": "1b3ca568"
    },
    "loadedAt": "2026-10-21T18:32:50.433Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4372-001 — 首次睡眠“命中前”与“使用前”的API时序冲突

1597/hashd8f17d91，eid1958[100,1,30,1,30,120,1]。API desc写“每次登场后自身首次技能命中前100%令对手睡眠，未触发则消除对手回合类效果”；同一API格式化字段写“每次登场之后，自身首次使用技能前100%令对手睡眠”。Wiki只重复命中前；底层eid无补充说明。不能用代码或Wiki裁决API内部差异。

差异：按使用前，首次MISS/整体被封也可能已经睡眠或清回合并消费首次；按命中前实际未命中可能保留到下次命中。当前确定实际命中前的交集已实现，睡眠成功、免疫/反弹后清回合、免断失败、药剂不消费、控制未用均验证；不明首次失败后明确记录pending而不在之后猜测补触发。睡眠还会被本次真实攻击打醒，相关顺序和1805倍率均已真实断言。

明确问题：1597首次睡眠按首次实际使用还是首次实际命中触发？MISS、整体封锁、失明三种失败时分别触发及消费首次吗？

我的回答：实际使用；消费

### Q-N20-4372-002 — 1806已迷阵时免PP在未命中/整体无效的范围

第五35890/hash603f67fb，实例2，1806[]/hash1b3ca568。原文“陷入失心迷阵时当次攻击不消耗自身PP值”，API analyze_info把整条标记iconHit；格式化未补充免耗在命中前或只在成功命中时成立。Wiki效果1806重复原文，项目旧来源未有本实例明确确认。

正常成功分支已完整实现为不发生基础PP消耗，不伪装成回复：三倍基础消耗仍免；对手下一用招PP归0仍能归0，不会退款抵消其效果；PP保护按公共规则；原本未迷阵时本次正常消耗并施阵；非雄性回满、禁疗及击败后回复均测试。未知失败分支运行时明确抛待确认且原输入完整保留，不返回猜测战斗状态。使用前已经被关闭的攻击命中附效按现有全阶段通则关闭此免耗，不作为新疑问；已执行的前置效果不因后续附效关闭而回滚。

差异：若发动时满足已迷阵即可免，MISS和被封也可能0基础消耗；若必须成功命中，失败应按正常扣除。1PP、三倍消耗以及随后被额外清PP的场景有实际资源差异。

明确问题：1806免PP是发动时已迷阵就生效，还是必须成功命中？普通MISS、失明、技能整体被封分别是否免基础PP消耗？

我的回答：发动时满足已迷阵即可免；都免

### 关联公共主问题 Q-N20-4364-004 — 4372迷阵解除后的先制失效范围

不新建同义问题。新增关联1597/hashd8f17d91失心迷阵解除条款：desc原文“下回合自身无法主动切换精灵、所有先制效果失效且受到的攻击伤害额外提升120%”，格式化写“自身下回合先制效果失效且受到的攻击伤害提升120%”，完整原文/参数见上方。Q-A60-4288-076仅4288的“额外正向先制失效”不扩大。此主问题须分别明确4364与本4372中“所有/先制效果失效”是否影响基础先制和负向修正；若范围不同请分开说明。当前解除迷阵、次回合攻击易伤120%及换宠延期已实现，优先范围仍pending；不将该主问题的未来仅4364回答自动扩给4372。



## 4373 龙焉 — 逐项审核及全部独立工作完成，部分待确认

2026-10-21T20:07:13.075Z。53项逐实例审核，29自身专项；research/4373-and-4372-final-v3.log 58/58（含4372药剂直接HP事件增强断言）；research/4373-public-v2.log107/107（含自身29、4372及3575/4109/4030），research/4373-public-v3.log187/187。这些是专项，不冒充完整npm或正式认证。完整真实原文、参数、URL/hash：

```json
[
  {
    "url": "https://api.seerapi.com/v1/pet/4373",
    "data": {
      "id": 4373,
      "name": "龙焉",
      "yielding_exp": 140,
      "catch_rate": 0,
      "evolving_lv": 0,
      "releaseable": false,
      "fusion_master": false,
      "fusion_sub": false,
      "has_resistance": true,
      "resource_id": 4373,
      "enemy_resource_id": null,
      "type": {
        "id": 73,
        "url": "https://api.seerapi.com/v1/element_type_combination/73"
      },
      "gender": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/pet_gender/2"
      },
      "base_stats": {
        "atk": 139,
        "def": 110,
        "sp_atk": 70,
        "sp_def": 110,
        "spd": 125,
        "hp": 171,
        "percent": false,
        "total": 725
      },
      "pet_class": {
        "id": 3033,
        "url": "https://api.seerapi.com/v1/pet_class/3033"
      },
      "evolution_chain_index": 0,
      "yielding_ev": {
        "atk": 0,
        "def": 0,
        "sp_atk": 0,
        "sp_def": 0,
        "spd": 0,
        "hp": 0,
        "percent": false,
        "total": 0
      },
      "vipbuff": null,
      "mount_type": null,
      "diy_stats": null,
      "skill": [
        {
          "learning_level": 1,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10611,
            "url": "https://api.seerapi.com/v1/skill/10611"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 5,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 21119,
            "url": "https://api.seerapi.com/v1/skill/21119"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 9,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 11904,
            "url": "https://api.seerapi.com/v1/skill/11904"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 13,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 11088,
            "url": "https://api.seerapi.com/v1/skill/11088"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 17,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 22870,
            "url": "https://api.seerapi.com/v1/skill/22870"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 21,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35891,
            "url": "https://api.seerapi.com/v1/skill/35891"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 25,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 15250,
            "url": "https://api.seerapi.com/v1/skill/15250"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 29,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20156,
            "url": "https://api.seerapi.com/v1/skill/20156"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 33,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 15247,
            "url": "https://api.seerapi.com/v1/skill/15247"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 37,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35892,
            "url": "https://api.seerapi.com/v1/skill/35892"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 41,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27972,
            "url": "https://api.seerapi.com/v1/skill/27972"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 45,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35893,
            "url": "https://api.seerapi.com/v1/skill/35893"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 49,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27973,
            "url": "https://api.seerapi.com/v1/skill/27973"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 53,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35894,
            "url": "https://api.seerapi.com/v1/skill/35894"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 57,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27974,
            "url": "https://api.seerapi.com/v1/skill/27974"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 61,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35895,
            "url": "https://api.seerapi.com/v1/skill/35895"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 76,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 35896,
            "url": "https://api.seerapi.com/v1/skill/35896"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 76,
          "is_special": true,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 37360,
            "url": "https://api.seerapi.com/v1/skill/37360"
          },
          "skill_activation_item": {
            "id": 1726042,
            "url": "https://api.seerapi.com/v1/skill_activation_item/1726042"
          }
        }
      ],
      "soulmark": [
        {
          "id": 1598,
          "url": "https://api.seerapi.com/v1/soulmark/1598"
        }
      ],
      "factor": [],
      "encyclopedia_entry": {
        "id": 4373,
        "url": "https://api.seerapi.com/v1/pet_encyclopedia_entry/4373"
      },
      "archive_story_entry": null,
      "peak_pool": null,
      "peak_expert_pool": null,
      "peak_cost_pool": null,
      "advance": null,
      "hash": "28f30e22"
    },
    "loadedAt": "2026-10-21T19:06:49.466Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1598",
    "data": {
      "id": 1598,
      "desc": "自身在场期间会触发渎龙轮舞，以两种攻击模式循环作战：奇数次选择使用的攻击技能先制-1且造成的伤害提升50%，偶数次选择使用的攻击技能先制+1且使用后{吸取}对手最大{体力}的1/3；|回合开始时若上回合自身未使用攻击技能，则当回合自身免疫受到的异常状态，若满足免疫条件则当回合战斗阶段结束时根据免疫情况获得如下效果（登场首回合必定满足）：|①.未通过该方式免疫过异常状态，恢复自身所有攻击技能2点PP值；|②.通过该方式免疫过n次异常状态，恢复自身最大体力的n/3|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场后触发渎龙轮舞：\r\n<indent=32><sprite=4><indent=48>奇数次选择的攻击技能<b>先制</b>-1且造成的<b>攻击伤害</b><color=#64F9FA>提升</color>50%\r\n<indent=32><sprite=4><indent=48>偶数次选择的攻击技能<b>先制</b>+1且使用后<color=#64F9FA>吸取</color>对手最大体力的1/3\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身未于上回合使用攻击技能，则本回合<color=#64F9FA>免疫</color>受到的<b>异常状态</b>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若本回合未通过回合开始效果免疫过异常状态，则自身所有攻击技能PP+2\r\n<indent=32><sprite=4><indent=48>若本回合已通过回合开始效果免疫过异常状态，则每免疫过1次<color=#64F9FA>恢复</color>自身最大体力的1/3",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4373,
          "url": "https://api.seerapi.com/v1/pet/4373"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          50,
          1,
          3,
          2,
          1,
          3,
          1
        ],
        "effect": {
          "id": 1959,
          "url": "https://api.seerapi.com/v1/eid_effect/1959"
        }
      },
      "effect_alias": "alias_1959_1_50_1_3_2_1_3_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 8,
          "url": "https://api.seerapi.com/v1/soulmark_tag/8"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "bd54e01d"
    },
    "loadedAt": "2026-10-21T19:06:55.954Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35896",
    "data": {
      "id": 35896,
      "name": "龙舞·罚",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 73,
        "url": "https://api.seerapi.com/v1/element_type_combination/73"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "攻击时将对手的能力提升状态视为相应的能力下降状态",
          "analyze_info": "[sprite name=iconInherent]攻击时将对手的能力提升状态视为相应的能力下降状态（boss有效）",
          "args": [],
          "effect": {
            "id": 1767,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1767"
          }
        },
        {
          "info": "若对手处于回合类效果则造成伤害提升100%并消除对手回合类效果",
          "analyze_info": "[sprite name=iconHit]若对手处于[color=#52a5f2]回合类效果[/color]则造成伤害提升100%并消除对手[color=#52a5f2]回合类效果[/color]",
          "args": [
            100
          ],
          "effect": {
            "id": 1808,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1808"
          }
        },
        {
          "info": "获得200点护罩，护罩消失时100%令对手害怕",
          "analyze_info": "[sprite name=iconHit]获得200点[color=#57c975]护罩[/color]，[color=#57c975]护罩[/color]消失时100%令对手[color=#57c975]害怕[/color]",
          "args": [
            200,
            100,
            6
          ],
          "effect": {
            "id": 1809,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1809"
          }
        },
        {
          "info": "当回合若未击败对手则吸取对手最大体力的1/3",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则[color=#52a5f2]吸取[/color]对手最大体力的1/3",
          "args": [
            3
          ],
          "effect": {
            "id": 833,
            "url": "https://api.seerapi.com/v1/skill_effect_type/833"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "87d98b22"
    },
    "loadedAt": "2026-10-21T19:11:35.310Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1809",
    "data": {
      "id": 1809,
      "args_num": 3,
      "info": "获得{0}点护罩，护罩消失时{1}%令对手{2}",
      "info_formatting_adjustment": "获得{0}点护罩\r\n--><condition>护罩消失时</condition>{1}%令对手{2}",
      "analyze_info": "[sprite name=iconHit]获得{0}点[color=#57c975]护罩[/color]，[color=#57c975]护罩[/color]消失时{1}%令对手[color=#57c975]{2}[/color]",
      "pve_effective": false,
      "param": [
        {
          "position": 2,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 28177,
          "url": "https://api.seerapi.com/v1/skill/28177"
        },
        {
          "id": 28957,
          "url": "https://api.seerapi.com/v1/skill/28957"
        },
        {
          "id": 35896,
          "url": "https://api.seerapi.com/v1/skill/35896"
        },
        {
          "id": 36791,
          "url": "https://api.seerapi.com/v1/skill/36791"
        },
        {
          "id": 37360,
          "url": "https://api.seerapi.com/v1/skill/37360"
        },
        {
          "id": 37553,
          "url": "https://api.seerapi.com/v1/skill/37553"
        }
      ],
      "tag": [
        {
          "id": 61613,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/61613"
        },
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        }
      ],
      "hash": "d2835630"
    },
    "loadedAt": "2026-10-21T19:11:47.423Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/833",
    "data": {
      "id": 833,
      "args_num": 1,
      "info": "当回合若未击败对手则吸取对手最大体力的1/{0}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则[color=#52a5f2]吸取[/color]对手最大体力的1/{0}",
      "pve_effective": false,
      "param": null,
      "hash": "d68ad255"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/37360",
    "data": {
      "id": 37360,
      "name": "龙舞·戮",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 73,
        "url": "https://api.seerapi.com/v1/element_type_combination/73"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "攻击时将对手的能力提升状态视为相应的能力下降状态",
          "analyze_info": "[sprite name=iconInherent]攻击时将对手的能力提升状态视为相应的能力下降状态（boss有效）",
          "args": [],
          "effect": {
            "id": 1767,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1767"
          }
        },
        {
          "info": "若对手处于回合类效果则造成伤害提升150%并消除对手回合类效果",
          "analyze_info": "[sprite name=iconHit]若对手处于[color=#52a5f2]回合类效果[/color]则造成伤害提升150%并消除对手[color=#52a5f2]回合类效果[/color]",
          "args": [
            150
          ],
          "effect": {
            "id": 1808,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1808"
          }
        },
        {
          "info": "获得200点护罩，护罩消失时100%令对手害怕",
          "analyze_info": "[sprite name=iconHit]获得200点[color=#57c975]护罩[/color]，[color=#57c975]护罩[/color]消失时100%令对手[color=#57c975]害怕[/color]",
          "args": [
            200,
            100,
            6
          ],
          "effect": {
            "id": 1809,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1809"
          }
        },
        {
          "info": "附加对手最大体力1/3的百分比伤害，未击败对手则恢复自身等量体力值",
          "analyze_info": "[sprite name=iconHit]附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]，未[color=#57c975]击败[/color]对手则恢复自身等量体力值",
          "args": [
            3
          ],
          "effect": {
            "id": 1709,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1709"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "b0bca17d"
    },
    "loadedAt": "2026-10-21T19:11:53.479Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1709",
    "data": {
      "id": 1709,
      "args_num": 1,
      "info": "附加对手最大体力1/{0}的百分比伤害，未击败对手则恢复自身等量体力值",
      "info_formatting_adjustment": "附加对手最大体力1/{0}的百分比伤害\r\n--><condition>未击败对手</condition>则恢复自身等量体力值",
      "analyze_info": "[sprite name=iconHit]附加对手最大体力1/{0}的[color=#52a5f2]百分比伤害[/color]，未[color=#57c975]击败[/color]对手则恢复自身等量体力值",
      "pve_effective": false,
      "param": null,
      "hash": "57e08f44"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  }
]
```

### Q-N20-4373-001 — 追加第五精确兼容授权

API附加第五37360/hashb0bca17d，真实激活物1726042悼龙古鳞，原第五35896与1598/bd54e01d形成2个真实版本。既有精确兼容不覆盖此新实例。保存research/4373-exact-additional-fifth-proposal.json，未改白名单，未混装两第五。

已完成：其他独立分支、真实状态测试和逐项审核；被阻塞：本条未知行为及正常版本接入/认证。已查本地来源/历史确认、API与research/4373-wiki-source.json、4373-extra-source.json。来源请求失败记录真实保留，不无限重试。

明确问题：是否批准该提案中仅4373、1598及37360真实来源/hash、原第五和追加第五两个互斥配招版本的精确兼容？

我的回答：批准

### Q-N20-4373-002 — 公共护罩共存、重复授予及消失触发

1809[200,100,6]两第五同实例。原Q-A60-4275-100的后得护罩先消耗确认仅4275命运轮，不自动推广。关联4361神祇来源护罩。单一来源无共存首次授予200、固定/百分比抵伤至0或清除后100%害怕、免疫不补触发已实现；重复已有护罩时明确拒绝；其他来源后来共存标记分配未确认，不据现有账本猜测。重复获得可叠加或覆盖；多来源按不同消费顺序会改变何时触发害怕/4361神祇消失。API/Wiki效果同文，无顺序定义。

已完成：其他独立分支、真实状态测试和逐项审核；被阻塞：本条未知行为及正常版本接入/认证。已查本地来源/历史确认、API与research/4373-wiki-source.json、4373-extra-source.json。来源请求失败记录真实保留，不无限重试。

明确问题：普通技能护罩重复获得时叠加还是覆盖？多来源护罩按何顺序扣除，1809按它的200耗尽触发还是总护罩归零触发，重复授予后触发次数如何计算？

我的回答：同来源覆盖，不同来源叠加；后获得的先后出；它的200好几年触发；触发次数刷新为1

### Q-N20-4373-003 — 1709对手最大HP比例附伤的未击败等量回复口径

1709[3]/57e08f44；37360实例3。现有全局理论回复明确自身最大HP比例附伤与固定吸取，不擅自推广到此对手最大HP比例。已核对SIX-DEPLOY及FIXED60确认，4258-065理论值属于2566取消条件特例，不扩展普通1709。正常非致命无减免时共同确定回复等量、目标已死或击败不回复已测；免疫/保留1HP场景理论值、完整结算、实际HP损失会不同。Wiki无进一步口径。

已完成：其他独立分支、真实状态测试和逐项审核；被阻塞：本条未知行为及正常版本接入/认证。已查本地来源/历史确认、API与research/4373-wiki-source.json、4373-extra-source.json。来源请求失败记录真实保留，不无限重试。

明确问题：普通1709在未击败对手时，等量回复按理论比例数值、完整结算伤害还是实际HP减少量计算？

我的回答：理论

### Q-N20-4373-004 — 833当回合未击败的判定与吸取时序

833[3]/d68ad255；35896实例3。完整原文“当回合若未击败对手则吸取对手最大体力的1/3”。已有公共处理在命中后目标仍活时立即吸取；这不是来源给出的时点答案。普通无其他晚期伤害场景和本次攻击已击败不吸取已测试；若之后中毒/魂印等当回合击败，立即吸取与回合战斗结束判定会不同。API/Wiki只重复原文；未因现有代码而默认为已答。

已完成：其他独立分支、真实状态测试和逐项审核；被阻塞：本条未知行为及正常版本接入/认证。已查本地来源/历史确认、API与research/4373-wiki-source.json、4373-extra-source.json。来源请求失败记录真实保留，不无限重试。

明确问题：833是本次攻击后目标未死就立即吸取，还是当回合战斗结束时确认未击败才吸取？若后续同回合异常或魂印击败是否仍吸取？

我的回答：战斗阶段结束时确认未击败才吸取，833效果在使对方致死时残留一点体力，记下来！；不吸取


## 4376 圣谕之风·岚 — 逐项审核及全部独立工作完成，部分待确认

2026-10-21T20:17:16.082Z。22真实技能，63项逐实例审核，自身25专项通过。research/4376-independent-v2.log80/80含本只25+4373的191反弹更正后29+4361的26；research/4376-public-v1.log167中166通过，1条正确1053错误hash拒绝断言失败，原因是误扩大基础枚举；已恢复原[7]范围，完全复用既有相同27190/faffbc85/实例1/[3,8,3]精确分支。research/4376-1053-exact-v3.log49/49（本只25、4113的24）当前通过，不删弱断言、不新增授权。剩公共8目标当时143项通过，新1053恢复不影响其分支。公共853临时面板速度与861 PP保护修复的正式重认证仍排队，不能用专项冒充认证。

来源完整原文、参数、URL/hash：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1600",
    "data": {
      "id": 1600,
      "desc": "在风神的庇护下，自身天生免疫能力下降状态且释放技能不消耗PP值(PP值为0时无法释放技能)，在圣光的庇护下，自身天生免疫受到的非本系攻击伤害且自身所有攻击伤害获得本系属性加成；|自身连续使用攻击技能则100%令对手睡眠,未触发则消除对手回合类效果且{吸取}对手300点{体力}，自身连续使用属性技能则下回合受到的攻击伤害、固定伤害和百分比伤害减少50%且所有技能先制+1，当回合自身使用技能且以上条件均未触发则战斗阶段结束时附加100点真实伤害（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>在风神的庇护下，自身天生<color=#64F9FA>免疫</color><b>能力下降状态</b>且<color=#64F9FA>释放技能不消耗PP值</color>\r\n<indent=16><sprite=3><indent=32>在圣光的庇护下，自身天生<color=#64F9FA>抵挡</color>受到的<b>非本系攻击</b>且自身所有攻击获得<b>本系属性加成</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身连续使用攻击技能则100%<color=#64F9FA>令对手睡眠</color>\r\n<indent=32><sprite=4><indent=48>未触发则<color=#64F9FA>消除</color>对手<b>回合类效果</b>且<color=#64F9FA>吸取</color>对手300点<b>体力</b>\r\n<indent=16><sprite=3><indent=32>自身连续使用属性技能则下回合受到的<b>攻击伤害、固定伤害和百分比伤害</b><color=#64F9FA>减少</color>50%且所有技能先制+1\r\n<indent=16><sprite=3><indent=32>当回合自身使用技能且以上条件均未满足则战斗阶段结束时<color=#64F9FA>附加</color>100点<b>真实伤害</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4376,
          "url": "https://api.seerapi.com/v1/pet/4376"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          300,
          50,
          1,
          100,
          1
        ],
        "effect": {
          "id": 1961,
          "url": "https://api.seerapi.com/v1/eid_effect/1961"
        }
      },
      "effect_alias": "alias_1961_100_300_50_1_100_1",
      "tag": [
        {
          "id": 4,
          "url": "https://api.seerapi.com/v1/soulmark_tag/4"
        },
        {
          "id": 9,
          "url": "https://api.seerapi.com/v1/soulmark_tag/9"
        },
        {
          "id": 11,
          "url": "https://api.seerapi.com/v1/soulmark_tag/11"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "6580ffe6"
    },
    "loadedAt": "2026-10-21T20:07:28.617Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35910",
    "data": {
      "id": 35910,
      "name": "谕·风定绝尘",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 88,
        "url": "https://api.seerapi.com/v1/element_type_combination/88"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则吸取对手最大体力的1/3",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则[color=#52a5f2]吸取[/color]对手最大体力的1/3",
          "args": [
            3
          ],
          "effect": {
            "id": 942,
            "url": "https://api.seerapi.com/v1/skill_effect_type/942"
          }
        },
        {
          "info": "2回合内令对手使用的属性技能无效",
          "analyze_info": "[sprite name=iconHit]2回合内令对手使用的属性技能无效（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 478,
            "url": "https://api.seerapi.com/v1/skill_effect_type/478"
          }
        },
        {
          "info": "当回合若未击败对手则100%令对手睡眠，未触发则令自身全属性+1",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则100%令对手[color=#57c975]睡眠[/color]，[color=#52a5f2]未触发[/color]则令自身[color=#52a5f2]全属性[/color]+1",
          "args": [
            100,
            8,
            1
          ],
          "effect": {
            "id": 1040,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1040"
          }
        },
        {
          "info": "当回合击败对手则令自身3回合内回合类效果无法被消除",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color][color=#57c975]击败[/color]对手则令自身3回合内[color=#52a5f2]回合类效果[/color]无法被消除",
          "args": [
            3
          ],
          "effect": {
            "id": 1811,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1811"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "d8c8779e"
    },
    "loadedAt": "2026-10-21T20:08:14.436Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1040",
    "data": {
      "id": 1040,
      "args_num": 3,
      "info": "当回合若未击败对手则{0}%令对手{1}，未触发则令自身全属性+{2}",
      "info_formatting_adjustment": "当回合若未击败对手则{0}%令对手{1}\r\n--><condition>未触发</condition>则令自身全属性+{2}",
      "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则{0}%令对手[color=#57c975]{1}[/color]，[color=#52a5f2]未触发[/color]则令自身[color=#52a5f2]全属性[/color]+{2}",
      "pve_effective": false,
      "param": [
        {
          "position": 1,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "hash": "659bbd5b"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  }
]
```

### Q-N20-4376-001 — “非本系攻击”相对攻击者还是受击者

1600/6580ffe6，eid1961[100,300,50,1,100,1]/45df617f。原文“自身天生免疫受到的非本系攻击伤害且自身所有攻击伤害获得本系属性加成”。API魂印、格式化及Wiki魂印1600/rev320137同文。API底层eid只参数数目，无定义；Wiki精确术语标题缺失，全文查询只返回本精灵与同魂印，未明确参照方。完整查询research/4376-source-check.json、4376-extra-source.json、4376-wiki-source.json。

两个有据可比口径：按攻击者本系，攻击者火系用火招打自然圣灵可穿过免疫；按受击者本系，同一火招仍为圣谕之风非本系而免疫。双方都是本系或双方都非本系时结果相同，交集已实现并测试；归属不同明确抛待确认。自己的所有攻击获得真实公共本系倍率、免弱、免PP但0PP不能用、真实连续攻击睡眠/失败清回合吸300、连续属性下回合三类减伤和先制、未满足条件战斗末100真伤均已完成。

明确问题：1600“免疫受到的非本系攻击伤害”，本系是相对攻击者自身属性，还是相对圣谕之风自身属性？

我的回答：相对于攻击者

### 关联公共主问题 Q-N20-4373-004 — 1040当回合未击败睡眠与失败强化的时点

追加关联4376第五35910/d8c8779e，实例2 effect1040/659bbd5b [100,8,1]，完整原文“当回合若未击败对手则100%令对手睡眠，未触发则令自身全属性+1”。同主问题的当回合未击败判据；若本次攻击没击败、随后当回合异常或魂印击败，当前执行和最终回合判定有差异。不重复建问题，不把效果推迟作为多精灵豁免。正常不晚杀睡眠成功/免疫后自身全属性1及已击败不触发已验证；未知时序与正常全第五接入/认证待答案。


## 4384 王左兵右 — 逐项审核及全部独立工作完成，部分待确认

2026-10-21T20:29:44.458Z。17招两第五真实版本；44逐实例审核；自身20状态专项，research/4384-independent-v5.log49/49含本只20和4373更正技能禁疗真实字段后的29。公共research/4384-public-v1.log179/179，旧3512真实753回归research/4384-753-legacy-v1.log1/1。各日志不重复累计、不冒充全npm/正式认证。818仍完全未注册；1603未出手死亡因重生规则未知明确拒绝，研究给定已重生仅验证独立成功载荷，不冒充重生本身可用。初次测试中的错误基础0威力、超出本地HP上限、不可变注册表spy、非真实禁疗字段已改为正确真实条件；所有失败日志保留。1114先清回合会先移除临时PP保护，再清PP，按原文顺序修正原新测试错误预期，未删除正确断言。

完整原文/参数/URL/hash：

```json
[
  {
    "url": "https://api.seerapi.com/v1/pet/4384",
    "data": {
      "id": 4384,
      "name": "王左兵右",
      "yielding_exp": 140,
      "catch_rate": 0,
      "evolving_lv": 0,
      "releaseable": false,
      "fusion_master": false,
      "fusion_sub": false,
      "has_resistance": true,
      "resource_id": 4384,
      "enemy_resource_id": null,
      "type": {
        "id": 61,
        "url": "https://api.seerapi.com/v1/element_type_combination/61"
      },
      "gender": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/pet_gender/1"
      },
      "base_stats": {
        "atk": 139,
        "def": 111,
        "sp_atk": 70,
        "sp_def": 111,
        "spd": 133,
        "hp": 171,
        "percent": false,
        "total": 735
      },
      "pet_class": {
        "id": 3044,
        "url": "https://api.seerapi.com/v1/pet_class/3044"
      },
      "evolution_chain_index": 0,
      "yielding_ev": {
        "atk": 0,
        "def": 0,
        "sp_atk": 0,
        "sp_def": 0,
        "spd": 0,
        "hp": 0,
        "percent": false,
        "total": 0
      },
      "vipbuff": null,
      "mount_type": null,
      "diy_stats": null,
      "skill": [
        {
          "learning_level": 1,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10361,
            "url": "https://api.seerapi.com/v1/skill/10361"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 5,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20156,
            "url": "https://api.seerapi.com/v1/skill/20156"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 9,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10363,
            "url": "https://api.seerapi.com/v1/skill/10363"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 13,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20769,
            "url": "https://api.seerapi.com/v1/skill/20769"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 17,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 19710,
            "url": "https://api.seerapi.com/v1/skill/19710"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 21,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35928,
            "url": "https://api.seerapi.com/v1/skill/35928"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 25,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10366,
            "url": "https://api.seerapi.com/v1/skill/10366"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 29,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 34041,
            "url": "https://api.seerapi.com/v1/skill/34041"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 37,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35929,
            "url": "https://api.seerapi.com/v1/skill/35929"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 41,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27989,
            "url": "https://api.seerapi.com/v1/skill/27989"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 45,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35930,
            "url": "https://api.seerapi.com/v1/skill/35930"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 49,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27990,
            "url": "https://api.seerapi.com/v1/skill/27990"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 53,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35931,
            "url": "https://api.seerapi.com/v1/skill/35931"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 57,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27991,
            "url": "https://api.seerapi.com/v1/skill/27991"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 61,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35932,
            "url": "https://api.seerapi.com/v1/skill/35932"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 76,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 35933,
            "url": "https://api.seerapi.com/v1/skill/35933"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 77,
          "is_special": true,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 37277,
            "url": "https://api.seerapi.com/v1/skill/37277"
          },
          "skill_activation_item": {
            "id": 1725957,
            "url": "https://api.seerapi.com/v1/skill_activation_item/1725957"
          }
        }
      ],
      "soulmark": [
        {
          "id": 1603,
          "url": "https://api.seerapi.com/v1/soulmark/1603"
        }
      ],
      "factor": [
        {
          "id": 2400130,
          "url": "https://api.seerapi.com/v1/factor/2400130"
        }
      ],
      "encyclopedia_entry": {
        "id": 4384,
        "url": "https://api.seerapi.com/v1/pet_encyclopedia_entry/4384"
      },
      "archive_story_entry": {
        "id": 448,
        "url": "https://api.seerapi.com/v1/pet_archive_story_entry/448"
      },
      "peak_pool": null,
      "peak_expert_pool": null,
      "peak_cost_pool": null,
      "advance": null,
      "hash": "30c83ee7"
    },
    "loadedAt": "2026-10-21T20:17:19.453Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1603",
    "data": {
      "id": 1603,
      "desc": "自身死亡时若当回合自身未出手则100%重生1次，若成功重生则令对手当回合使用的技能PP值归零且下2回合造成的攻击伤害降低50%，若未成功重生则令对手随机2个技能PP值归零且令己方下只登场精灵全属性+1（每场战斗仅触发1次）；|自身使用技能则恢复自身最大体力的1/3，若自身满体力则附加对手最大体力1/3的百分比伤害（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>限定效果（每场战斗限1次）：\r\n<indent=16><sprite=3><indent=32>自身死亡时若当回合自身未出手则100%<color=#64F9FA>重生</color>1次\r\n<indent=32><sprite=4><indent=48>若成功重生则令对手当回合使用的技能<b>PP值</b>归零且下2回合造成的<b>攻击伤害</b><color=#64F9FA>降低</color>50%\r\n<indent=32><sprite=4><indent=48>若未成功重生则令对手随机2个技能<b>PP值</b>归零且令己方下只登场精灵<color=#64F9FA>全属性+1</color>\r\n\r\n<indent=0><sprite=0><indent=16>技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用技能则<color=#64F9FA>恢复</color>自身最大体力的1/3\r\n<indent=32><sprite=4><indent=48>若自身满体力则<color=#64F9FA>附加</color>对手最大体力1/3的<b>百分比伤害</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4384,
          "url": "https://api.seerapi.com/v1/pet/4384"
        }
      ],
      "effect": {
        "effect_args": [
          3,
          3,
          1
        ],
        "effect": {
          "id": 1965,
          "url": "https://api.seerapi.com/v1/eid_effect/1965"
        }
      },
      "effect_alias": "alias_1965_3_3_1",
      "tag": [
        {
          "id": 5,
          "url": "https://api.seerapi.com/v1/soulmark_tag/5"
        },
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 15,
          "url": "https://api.seerapi.com/v1/soulmark_tag/15"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "bc2323a2"
    },
    "loadedAt": "2026-10-21T20:17:25.623Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35933",
    "data": {
      "id": 35933,
      "name": "神亡天决斩",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 61,
        "url": "https://api.seerapi.com/v1/element_type_combination/61"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则令对手随机2项技能PP值归零",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则令对手随机2项技能PP值归零",
          "args": [
            2
          ],
          "effect": {
            "id": 1114,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1114"
          }
        },
        {
          "info": "出手时本回合若未受到伤害则对手下2回合属性技能无效",
          "analyze_info": "[sprite name=iconHit]出手时本回合若未受到伤害则对手下2回合属性技能无效（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 1031,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1031"
          }
        },
        {
          "info": "当回合若未击败对手则吸取对手最大体力的1/3",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则[color=#52a5f2]吸取[/color]对手最大体力的1/3",
          "args": [
            3
          ],
          "effect": {
            "id": 833,
            "url": "https://api.seerapi.com/v1/skill_effect_type/833"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "db0f41d7"
    },
    "loadedAt": "2026-10-21T20:19:10.264Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/37277",
    "data": {
      "id": 37277,
      "name": "天陨神裁剑",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 61,
        "url": "https://api.seerapi.com/v1/element_type_combination/61"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则令对手随机2项技能PP值归零",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则令对手随机2项技能PP值归零",
          "args": [
            2
          ],
          "effect": {
            "id": 1114,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1114"
          }
        },
        {
          "info": "出手时本回合若未受到伤害则对手下2回合属性技能无效",
          "analyze_info": "[sprite name=iconHit]出手时本回合若未受到伤害则对手下2回合属性技能无效（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 1031,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1031"
          }
        },
        {
          "info": "出手时本回合若受到伤害，则将伤害反馈给对手",
          "analyze_info": "[sprite name=iconHit]出手时本回合若受到伤害，则将伤害反馈给对手",
          "args": [],
          "effect": {
            "id": 818,
            "url": "https://api.seerapi.com/v1/skill_effect_type/818"
          }
        },
        {
          "info": "附加对手最大体力1/3的百分比伤害，未击败对手则恢复自身等量体力值",
          "analyze_info": "[sprite name=iconHit]附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]，未[color=#57c975]击败[/color]对手则恢复自身等量体力值",
          "args": [
            3
          ],
          "effect": {
            "id": 1709,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1709"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "bc70b2e"
    },
    "loadedAt": "2026-10-21T20:19:17.050Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/818",
    "data": {
      "id": 818,
      "args_num": 0,
      "info": "出手时本回合若受到伤害，则将伤害反馈给对手",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]出手时本回合若受到伤害，则将伤害反馈给对手",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 17953,
          "url": "https://api.seerapi.com/v1/skill/17953"
        },
        {
          "id": 25164,
          "url": "https://api.seerapi.com/v1/skill/25164"
        },
        {
          "id": 28434,
          "url": "https://api.seerapi.com/v1/skill/28434"
        },
        {
          "id": 30151,
          "url": "https://api.seerapi.com/v1/skill/30151"
        },
        {
          "id": 30958,
          "url": "https://api.seerapi.com/v1/skill/30958"
        },
        {
          "id": 33253,
          "url": "https://api.seerapi.com/v1/skill/33253"
        },
        {
          "id": 37000,
          "url": "https://api.seerapi.com/v1/skill/37000"
        },
        {
          "id": 37277,
          "url": "https://api.seerapi.com/v1/skill/37277"
        },
        {
          "id": 38006,
          "url": "https://api.seerapi.com/v1/skill/38006"
        }
      ],
      "tag": [
        {
          "id": 51801,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/51801"
        }
      ],
      "hash": "fb25ed10"
    },
    "loadedAt": "2026-10-21T20:19:23.506Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_activation_item/1725957",
    "data": {
      "id": 1725957,
      "name": "双生魔兵",
      "item_number": 1,
      "item": {
        "id": 1725957,
        "url": "https://api.seerapi.com/v1/item/1725957"
      },
      "skill": {
        "id": 37277,
        "url": "https://api.seerapi.com/v1/skill/37277"
      },
      "pet": {
        "id": 4384,
        "url": "https://api.seerapi.com/v1/pet/4384"
      },
      "hash": "7e63d1a9"
    },
    "loadedAt": "2026-10-21T20:19:29.378Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4384-001 — 1603重生恢复与“未出手”规则

1603/bc2323a2，eid1965[3,3,1]。API与Wiki魂印rev320140仅原文重生1次，未说明恢复HP、PP及等级/异常/回合效果保留。底层eid只参数数目；Wiki重生/复活标题缺失，精确搜索无补充。旧Q-A60-4135-029明确仅4135两魂印，引用3739/3983也均为特定实例，不能扩展本1603。已实现实际使用技能回复三分一、回复后满血百分比附伤、实际出手后死亡必不满足条件时随机2槽PP归0/PP保护，真实下一只强化单列延期。成功重生后的独立清当前用招PP/当回合后用招PP与下2回合半攻伤代码已完成，并在“给定已成功重生”条件的研究状态及后续真实战斗测试；没有伪造未知复活量或正式认证。

来源已查：research/4384-source-check.json、4384-wiki-source.json、4384-extra-source.json。被阻塞：本条未知规则及正常全版本接入/验收；其他不依赖回答部分已完成并测试。

明确问题：请明确1603重生恢复多少HP/PP，能力等级、异常和回合效果是否保留；各种致死与被控制未用、喝药是否按“未出手”重生，及其发生时点？

我的回答：hp和pp回满；全部保留；是，发生节点是死亡的下回合开始

### Q-N20-4384-002 — 追加第五精确兼容授权

原第五35933/hashdb0f41d7，追加第五37277/bc70b2e，真实激活物1725957/7e63d1a9双生魔兵；Soul1603/bc2323a2，两互斥版本及精确来源提案research/4384-exact-additional-fifth-proposal.json已保存，未改白名单或混装。

来源已查：research/4384-source-check.json、4384-wiki-source.json、4384-extra-source.json。被阻塞：本条未知规则及正常全版本接入/验收；其他不依赖回答部分已完成并测试。

明确问题：是否批准提案中仅4384、1603及37277真实来源/hash、原第五和追加第五互斥两版本的精确兼容？

我的回答：授权

### Q-N20-4384-003 — 818反伤载荷的伤害类型缺失

37277实例2，effect818[]/fb25ed10。原文“出手时本回合若受到伤害，则将伤害反馈给对手”。API/analyze仅iconHit加同文本，Wiki效果818/rev343278同文。进一步按API真实链接查skill_effect_type_tag/51801/hash a913e81d，仅名称“反伤”，同标签并列多种不同具体文本，仍无类型定义。完整本地research/4384-extra-source.json。依据已确认伤害/HP损失区分，不能用直接HP损失冒充所受伤害，也不能凭现有其他反伤代码选固定/真实类型。类型不同会影响固定/真实免疫、盾罩及后续伤害事件；来源没有支持具体选项，故不虚列候选答案。818保持未注册，其他3个追加第五词条有据部分完成；不建空处理器或伪部署。

来源已查：research/4384-source-check.json、4384-wiki-source.json、4384-extra-source.json。被阻塞：本条未知规则及正常全版本接入/验收；其他不依赖回答部分已完成并测试。

明确问题：818“反馈”实际造成哪一种伤害，或是否是直接HP减少？请补充该效果的伤害类型。

我的回答：1818反弹改为真实伤害，按抵挡前数值返还，只反弹红伤，弹回去是真伤，所以双方都有1818时不再次反弹；1818应为“免疫并反弹红伤，返还为真伤”

### 关联公共主问题 Q-N20-4373-003 / Q-N20-4373-004

4384追加第五37277/bc70b2e实例3 effect1709[3]/57e08f44，关联等量回复基数主问题003；原第五35933实例2 effect833[3]/d68ad255关联当回合未击败判据/时序主问题004。完整原始词条保留上方来源及快照；正常无晚杀、非致命未减免等共同分支已测试，未重新提问或扩大旧确认。


## 4386 缔笙 — 逐项审核及全部独立工作完成，部分待确认

2026-10-21T20:49:57.752Z。16真实技能（“缔·永世羁绊”为自身普通技能，不因名字延期）；43项逐实例审核；25自身状态专项，research/4386-independent-final-v4.log41/41含自身25与旧4037的16；research/4386-public-v1.log171/171包含当时本只25/4384的20/4376的26及旧目标、公共注册表与魂印。当前26? 本只确为25，日志重复不相加。真实运行至第21回合验证此前10回合浪潮、10层、PP倍增、刷新非20层；全部阈值当前实现，只有真实场下/不同精灵历史延期。14045源atk_num3按research/MULTI-TARGET-USER-SCOPE.json已确认排除，只实际攻击1次，并保留来源原值。未知1090未绕过旧精确校验，免粉反弹的未知载荷仅记录pending，未正式部署/正常全第五初始化或验收。

完整来源、原文、参数、URL/hash：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1605",
    "data": {
      "id": 1605,
      "desc": "自身存活于己方出战背包时，每10回合触发1次幻境浪潮|回合开始时，对手根据缔结印记达到的层数，获得以下效果|    1层：以回合类效果的形式，对手使用技能消耗的PP值翻倍；|    3层：造成的攻击伤害额外减少30%；|    5层：造成的固定伤害、百分比伤害额外减少30%；|    7层：无法通过其技能恢复体力且受到原本恢复量1/3的真实伤害|回合开始时若自身体力为满则当回合免疫受到的异常状态，若自身体力不为满则当回合使用技能无视对手双防能力提升状态；|战斗阶段结束时若对手当前体力不高于回合开始时则下回合自身所有技能先制+1，若对手当前体力不低于回合开始时则恢复自身最大体力的1/3|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>缔笙存活于出战背包时，战斗每经过10回合都会开启1次幻境浪潮：\r\n<indent=32><sprite=4><indent=48>该10回合内对手的每个精灵<color=#64F9FA>每在场过1回合</color>都会被附加1层<b>缔结印记</b>，缔结印记持续10回合\r\n<indent=16><sprite=3><indent=32>缔笙在场时，根据对手当前精灵缔结印记层数触发<b>累计</b>的效果：\r\n<indent=32><sprite=4><indent=48>1层：每回合，对手都以回合类效果形式1回合内释放技能所消耗的PP值翻倍\r\n<indent=32><sprite=4><indent=48>3层：对手造成的<b>攻击伤害</b><color=#64F9FA>降低</color>30%\r\n<indent=32><sprite=4><indent=48>5层：对手造成的<b>固定伤害、百分比伤害</b><color=#64F9FA>降低</color>30%\r\n<indent=32><sprite=4><indent=48>7层：对手无法通过自身技能恢复体力并<color=#64F9FA>受到</color>恢复量1/3的<b>真实伤害</b>；\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身满体力则当回合自身<color=#64F9FA>免疫</color>受到的<b>异常状态</b>\r\n<indent=32><sprite=4><indent=48>若自身未满体力则当回合自身技能<color=#64F9FA>无视</color>对手<b>防御以及特防能力提升</b>状态\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若对手当前体力<color=#64F9FA>不高于</color>回合开始时则下回合自身所有技能<b>先制</b>+1\r\n<indent=32><sprite=4><indent=48>若对手当前体力<color=#64F9FA>不低于</color>回合开始时则<color=#64F9FA>恢复</color>自身最大体力的1/3,",
      "analyze_desc": "[sprite name=dot4]自身存活于[color=#52a5f2]己方[/color]出战背包时，每10回合触发1次[color=#f35555]幻境浪潮[/color]|[sprite name=dot4][color=#57c975]回合开始时[/color]，[color=#52a5f2]对手[/color]根据[color=#f35555]缔结印记[/color]达到的层数，获得以下效果|[sprite name=dot5]    1层：以[color=#52a5f2]回合类效果[/color]的形式，[color=#52a5f2]对手[/color]使用技能消耗的PP值翻倍；|[sprite name=dot5]    3层：造成的攻击[color=#52a5f2]伤害额外减少[/color]30%；|[sprite name=dot5]    5层：造成的[color=#52a5f2]固定伤害[/color]、百分比[color=#52a5f2]伤害额外减少[/color]30%；|[sprite name=dot5]    7层：[color=#57c975]无法通过其技能恢复体力[/color]且受到原本恢复量1/3的[color=#52a5f2]真实伤害[/color]|[sprite name=dot4][color=#57c975]回合开始时[/color]若自身体力为满则[color=#52a5f2]当回合[/color][color=#57c975]免疫[/color]受到的[color=#52a5f2]异常状态[/color]，若自身体力不为满则[color=#52a5f2]当回合[/color]使用技能无视[color=#52a5f2]对手[/color]双防[color=#52a5f2]能力提升状态[/color]；|[sprite name=dot4][color=#57c975]战斗阶段结束时[/color]若[color=#52a5f2]对手[/color]当前体力不高于[color=#57c975]回合开始时[/color]则下回合自身所有[color=#52a5f2]技能先制[/color]+1，若[color=#52a5f2]对手[/color]当前体力不低于[color=#57c975]回合开始时[/color]则恢复自身最大体力的1/3",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4386,
          "url": "https://api.seerapi.com/v1/pet/4386"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          3,
          1
        ],
        "effect": {
          "id": 1963,
          "url": "https://api.seerapi.com/v1/eid_effect/1963"
        }
      },
      "effect_alias": "alias_1963_1_3_1",
      "tag": [
        {
          "id": 8,
          "url": "https://api.seerapi.com/v1/soulmark_tag/8"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "85e76e53"
    },
    "loadedAt": "2026-10-21T20:29:54.489Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/27995",
    "data": {
      "id": 27995,
      "name": "盛夏相逢",
      "power": 0,
      "max_pp": 10,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": "开始有一定概率免疫对手的攻击伤害了",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "3回合内有50%概率免疫对手攻击伤害，未触发则对手特防-2，速度-2",
          "analyze_info": "[sprite name=iconHit]3回合内有50%概率免疫对手攻击伤害，[color=#52a5f2]未触发[/color]则对手特防-2，速度-2",
          "args": [
            3,
            50,
            0,
            0,
            0,
            -2,
            -2,
            0
          ],
          "effect": {
            "id": 1259,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1259"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "35bea69b"
    },
    "loadedAt": "2026-10-21T20:30:21.400Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1259",
    "data": {
      "id": 1259,
      "args_num": 8,
      "info": "{0}回合内有{1}%概率免疫对手攻击伤害，未触发则对手{2}",
      "info_formatting_adjustment": "{0}回合内有{1}%概率免疫对手攻击伤害\r\n--><condition>未触发</condition>则对手{2}",
      "analyze_info": "[sprite name=iconHit]{0}回合内有{1}%概率免疫对手攻击伤害，[color=#52a5f2]未触发[/color]则对手{2}",
      "pve_effective": false,
      "param": [
        {
          "position": 2,
          "param": {
            "id": 0,
            "url": "https://api.seerapi.com/v1/skill_effect_param/0"
          }
        }
      ],
      "hash": "6b5ae893"
    },
    "cacheFile": "research/selected-3711-3716-3724-3737-3739-3740-3741-3763-3788-3807.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/27996",
    "data": {
      "id": 27996,
      "name": "邂逅今夏",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫异常状态了；对手受到的伤害开始提升了；开始免疫并反弹自身受到的固定伤害和百分比伤害了；对手开始无法主动切换精灵了",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "5回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]5回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            5
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "下2回合造成的攻击伤害额外提升150%",
          "analyze_info": "[sprite name=iconHit]下2回合造成的攻击[color=#52a5f2]伤害额外提升[/color]150%（boss有效）",
          "args": [
            2,
            150
          ],
          "effect": {
            "id": 693,
            "url": "https://api.seerapi.com/v1/skill_effect_type/693"
          }
        },
        {
          "info": "2回合内免疫并反弹自身受到的固定伤害和百分比伤害",
          "analyze_info": "[sprite name=iconHit]2回合内免疫并[color=#52a5f2]反弹[/color]自身受到的[color=#52a5f2]固定伤害[/color]和[color=#52a5f2]百分比伤害[/color]",
          "args": [
            2
          ],
          "effect": {
            "id": 1818,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1818"
          }
        },
        {
          "info": "下2回合令对手无法主动切换精灵",
          "analyze_info": "[sprite name=iconHit]下2回合令对手无法[color=#52a5f2]主动切换[/color]精灵",
          "args": [
            2
          ],
          "effect": {
            "id": 1478,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1478"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "fcfe8e05"
    },
    "loadedAt": "2026-10-21T20:30:34.289Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1818",
    "data": {
      "id": 1818,
      "args_num": 1,
      "info": "{0}回合内免疫并反弹自身受到的固定伤害和百分比伤害",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内免疫并[color=#52a5f2]反弹[/color]自身受到的[color=#52a5f2]固定伤害[/color]和[color=#52a5f2]百分比伤害[/color]",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 27996,
          "url": "https://api.seerapi.com/v1/skill/27996"
        },
        {
          "id": 29419,
          "url": "https://api.seerapi.com/v1/skill/29419"
        },
        {
          "id": 36718,
          "url": "https://api.seerapi.com/v1/skill/36718"
        },
        {
          "id": 38424,
          "url": "https://api.seerapi.com/v1/skill/38424"
        }
      ],
      "tag": [
        {
          "id": 52161,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/52161"
        },
        {
          "id": 51801,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/51801"
        }
      ],
      "hash": "66b5c100"
    },
    "loadedAt": "2026-10-21T20:30:41.071Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35945",
    "data": {
      "id": 35945,
      "name": "笙·形影合弦",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 17,
        "url": "https://api.seerapi.com/v1/element_type_combination/17"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "造成的攻击伤害若高于300则令对手2回合内使用的属性技能无效",
          "analyze_info": "[sprite name=iconHit]造成的攻击伤害若高于300则令对手2回合内使用的属性技能无效（boss有效）",
          "args": [
            300,
            2
          ],
          "effect": {
            "id": 1019,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1019"
          }
        },
        {
          "info": "造成的攻击伤害若低于300则附加给对手200点真实伤害",
          "analyze_info": "[sprite name=iconHit]造成的攻击伤害若低于300则附加给对手200点[color=#52a5f2]真实伤害[/color]",
          "args": [
            300,
            200
          ],
          "effect": {
            "id": 1820,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1820"
          }
        },
        {
          "info": "未击败对手则恢复自身所有技能2点PP值",
          "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则恢复自身所有技能2点PP值",
          "args": [
            2
          ],
          "effect": {
            "id": 1821,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1821"
          }
        },
        {
          "info": "击败对手则2回合内令对手攻击技能无法造成伤害且命中效果失效",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则2回合内令对手攻击技能无法造成伤害且命中效果失效",
          "args": [
            2
          ],
          "effect": {
            "id": 1090,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1090"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "8f085421"
    },
    "loadedAt": "2026-10-21T20:31:06.339Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1090",
    "data": {
      "id": 1090,
      "args_num": 1,
      "info": "击败对手则{0}回合内令对手攻击技能无法造成伤害且命中效果失效",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则{0}回合内令对手攻击技能无法造成伤害且命中效果失效",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 30367,
          "url": "https://api.seerapi.com/v1/skill/30367"
        },
        {
          "id": 30580,
          "url": "https://api.seerapi.com/v1/skill/30580"
        },
        {
          "id": 31295,
          "url": "https://api.seerapi.com/v1/skill/31295"
        },
        {
          "id": 32184,
          "url": "https://api.seerapi.com/v1/skill/32184"
        },
        {
          "id": 32716,
          "url": "https://api.seerapi.com/v1/skill/32716"
        },
        {
          "id": 33927,
          "url": "https://api.seerapi.com/v1/skill/33927"
        },
        {
          "id": 35220,
          "url": "https://api.seerapi.com/v1/skill/35220"
        },
        {
          "id": 35670,
          "url": "https://api.seerapi.com/v1/skill/35670"
        },
        {
          "id": 35821,
          "url": "https://api.seerapi.com/v1/skill/35821"
        },
        {
          "id": 35846,
          "url": "https://api.seerapi.com/v1/skill/35846"
        },
        {
          "id": 35945,
          "url": "https://api.seerapi.com/v1/skill/35945"
        },
        {
          "id": 36215,
          "url": "https://api.seerapi.com/v1/skill/36215"
        },
        {
          "id": 36762,
          "url": "https://api.seerapi.com/v1/skill/36762"
        },
        {
          "id": 37340,
          "url": "https://api.seerapi.com/v1/skill/37340"
        },
        {
          "id": 37522,
          "url": "https://api.seerapi.com/v1/skill/37522"
        },
        {
          "id": 38177,
          "url": "https://api.seerapi.com/v1/skill/38177"
        }
      ],
      "tag": [
        {
          "id": 52161,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/52161"
        },
        {
          "id": 44313,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
        }
      ],
      "hash": "9c49fdb"
    },
    "cacheFile": "research/4246-source-check.json",
    "loadedAt": "2026-10-20T08:41:05.228Z",
    "storage": "existing-cache"
  }
]
```

### Q-N20-4386-001 — 7层回复转真实伤害与其他禁疗/转伤的并存顺序

1605/85e76e53、eid1963[1,3,1]。7层原文“无法通过其技能恢复体力且受到原本恢复量1/3的真实伤害”，API格式化一致；Wiki魂印1605仅同义补充。独立时已按既有公共原本回复量机制实现技能回复不发生、原本实际会回复量三分一真实伤害，覆盖满血0、回复削减、完整伤害与HP实际减少独立；魂印回复不被技能禁疗转换。未知交互：同时有普通技能禁疗/次元领域/既有1449百分比回复转伤条目时，原本回复被阻止能否仍转真伤；两个转换是否各触发、先后或覆盖。不同会使一次原本4500回复带来0、单项或多项伤害，可能提前死亡。资料未说明，当前并存时明确抛待确认，不静默按代码先后选一种。

已查来源与补充：research/4386-source-check.json、4386-wiki-source.json、4386-extra-source.json，完整词条见上方。其他不依赖回答的单在场分支代码、测试和逐项审核均完成；阻塞仅本未知交互/单位和正常部署验收。

明确问题：1605的7层与其他技能禁疗或1449等回复转伤并存时，各自是否触发？请明确转换顺序或覆盖关系及所用“原本回复量”。

我的回答：触发禁疗；不触发转伤

### Q-N20-4386-002 — 1259概率免疫攻击的抽样与失败弱化单位

27995/35bea69b实例0 effect1259/6b5ae893，[3,50,0,0,0,-2,-2,0]，原文“3回合内有50%概率免疫对手攻击伤害，未触发则对手特防-2，速度-2”。底层API八参数及param0能力向量真实保留，非误读为速命。API原文/格式化/analyze和Wiki效果1259仅同文，“概率免疫伤害”独立标题缺失；未找到覆盖本源的已有回答。对一次普通单段入站50%成功/失败、两项-2、时长已实现测试；多段第二段或同回合第二次入站由既有公共unresolvedUnit保护明确拒绝。该保护只绑定真实技能27995/35bea69b，不向既有其他已审来源推广猜测。

已查来源与补充：research/4386-source-check.json、4386-wiki-source.json、4386-extra-source.json，完整词条见上方。其他不依赖回答的单在场分支代码、测试和逐项审核均完成；阻塞仅本未知交互/单位和正常部署验收。

明确问题：本1259按每段伤害、每次攻击技能还是每回合抽一次50%？多段或同回合多次入站时，失败的特防/速度-2按哪个单位触发？

我的回答：“每回合抽一次，免疫未触发才弱化一次”

### 关联公共主问题 Q-N20-4384-003 — 1818反弹具体载荷另列实例，不默认同818答案

27996/fcfe8e05实例2，1818[2]/66b5c100，原文“2回合内免疫并反弹自身受到的固定伤害和百分比伤害”；Wiki效果1818同文，无反弹类型/返量/顺序补充。免疫固定/百分比2回合、真伤不免已真实实现测试；发生入站时显式记录未实现的反弹，不捏造返伤。需补充本1818反弹是否保持入站伤害类型、返还量在减免/护罩前还是后、以及双方都有该效果时的反弹规则。它与818同属反伤载荷缺失，合并到同一公共主问题，但不擅自认为818的未来答案自动覆盖1818。

### 关联公共主问题 Q-N20-4364-006 — 1090新精确实例

35945/8f085421实例3 effect1090/9c49fdb [2]，原文“击败对手则2回合内令对手攻击技能无法造成伤害且命中效果失效”。旧只允许4246/35220/cf57d8f0实例2[1]，未扩授权。本源目标是被击败后同精灵重生，还是后继精灵等，仍须明确，不因ID1090就延期；保存research/4386-1090-exact-proposal.json。与4364-006共用主问题，需分别明确本源目标和仅此新ID/hash/索引/参数的精确授权。

4386统计文字补充更正：上段“当前26?”为编辑残留；4386自身为25项，4376当前为26项。实际以所列日志统计为准，不重复累计。


## 4387 坦普瑞 — 逐项审查及全部独立工作完成，部分待确认

2026-10-21T21:28:55.847Z。17真实技能、45项逐实例审查登记（未知项未通过语义认证，缺失/失效0仅表示审查条目完整，不表示全部词条已通过）。自身27状态专项，research/4387-independent-final-v8.log53/53含本只27和4376的26；research/4387-public-current-v2.log204/204含当时本只26与旧目标/公共异常测试，后来补1个初始化案例由v8独立再验；research/4387-ailment-origin-v1.log139/139为公共异常来源调整时的专门回归，日志有重叠不相加。此前research/4387-public-v1.log182/182在异常来源调整前，只作历史证据不充当前新门控验证。新增源初始化未触发的先制/减伤边界已修正并再验，不能由undefined===undefined虚获收益。普通新机制1488/1480与1822明确共同分支已实现，1822分歧边界与826未答，不部署。

公共问题发现及修复：当次属性技能不能附异常的标记曾误拦同回合末魂印/反弹。现在公共context给技能、魂印、反弹明确来源；原属性技能仍受限制，魂印沉默/真实2093低体麻痹反弹不误封。反弹后敌2093因异常回复到9000并重新授予2次禁属，真实复合结果已断言，不削去正确后效。完整27999原链还覆盖先吸取、免技能攻击但被固定伤害击败后1631仍按原文发伤，双方平局；原普通伤害与HP损失独立。

源版本：1606/ccbff4fd、真实eid1970/524c2b06。额外请求曾误查1964，原请求记录未删，但没有作为1606来源或实现依据；正确1970已核，纠正记录research/4387-eid-reference-correction.json。共享1822反向链接37320/38390也做资料核对，未发现指向4387的来源，不凭共享效果ID给本目标追加技能；见research/4387-linked-reference-ownership.json。不导入或开发列表外目标。

完整来源、原文、参数、URL/hash：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1606",
    "data": {
      "id": 1606,
      "desc": "回合开始时若对手处于异常状态则自身所有技能先制+1，若对手不处于异常状态则降低对手所有技能PP值1点；|回合结束时若自身任意1项技能PP值为0则恢复自身所有技能PP值1点且恢复自身最大体力的1/3并造成等量百分比伤害，若自身≥3项技能PP值为0则额外消除对手回合类效果且100%令对手沉默（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手处于异常状态则自身所有技能<b>先制</b>+1\r\n<indent=32><sprite=4><indent=48>若对手不处于异常状态则<color=#64F9FA>降低</color>对手所有技能<b>PP值</b>1点\r\n\r\n<indent=0><sprite=0><indent=16>回合结束效果：\r\n<indent=16><sprite=3><indent=32>回合结束时：\r\n<indent=32><sprite=4><indent=48>若自身任意1项技能PP值为0则<color=#64F9FA>恢复</color>自身所有技能<b>PP值</b>1点且<color=#64F9FA>恢复</color>自身最大体力的1/3并造成等量<b>百分比伤害</b>\r\n<indent=32><sprite=4><indent=48>若自身≥3项技能PP值为0则额外<color=#64F9FA>消除</color>对手<b>回合类效果</b>且100%<color=#64F9FA>令对手沉默</color>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4387,
          "url": "https://api.seerapi.com/v1/pet/4387"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          1,
          3,
          3,
          100,
          1
        ],
        "effect": {
          "id": 1970,
          "url": "https://api.seerapi.com/v1/eid_effect/1970"
        }
      },
      "effect_alias": "alias_1970_1_1_3_3_100_1",
      "tag": [
        {
          "id": 9,
          "url": "https://api.seerapi.com/v1/soulmark_tag/9"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 16,
          "url": "https://api.seerapi.com/v1/soulmark_tag/16"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "ccbff4fd"
    },
    "loadedAt": "2026-10-21T20:50:08.239Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35950",
    "data": {
      "id": 35950,
      "name": "咒术·魂狩",
      "power": 150,
      "max_pp": 1,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 225,
        "url": "https://api.seerapi.com/v1/element_type_combination/225"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "100%令对手中毒，未触发则消除对手回合类效果",
          "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]中毒[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
          "args": [
            100,
            1
          ],
          "effect": {
            "id": 1187,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1187"
          }
        },
        {
          "info": "若对手处于异常状态则自身造成的攻击伤害额外提升100%",
          "analyze_info": "[sprite name=iconHit]若对手处于异常状态则自身造成的攻击[color=#52a5f2]伤害额外提升[/color]100%（boss有效）",
          "args": [
            100
          ],
          "effect": {
            "id": 1048,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1048"
          }
        },
        {
          "info": "当回合击败对手则下回合开始后随机附加2种异常状态",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color][color=#57c975]击败[/color]对手则下回合开始后随机附加2种异常状态",
          "args": [
            2
          ],
          "effect": {
            "id": 826,
            "url": "https://api.seerapi.com/v1/skill_effect_type/826"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "30b241c9"
    },
    "loadedAt": "2026-10-21T20:51:19.839Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/826",
    "data": {
      "id": 826,
      "args_num": 1,
      "info": "当回合击败对手则下回合开始后随机附加{0}种异常状态",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color][color=#57c975]击败[/color]对手则下回合开始后随机附加{0}种异常状态",
      "pve_effective": false,
      "param": null,
      "hash": "51e5c388"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35951",
    "data": {
      "id": 35951,
      "name": "禁术·契灭",
      "power": 160,
      "max_pp": 1,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "快结下这契约吧，你所有的愿望都将实现！",
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 225,
        "url": "https://api.seerapi.com/v1/element_type_combination/225"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消耗自身所有技能的PP值并附加自身最大体力值20%的百分比伤害，若消耗的PP值≥5点则附加的百分比伤害翻倍且额外令对手下1次攻击技能无效",
          "analyze_info": "[sprite name=iconHit]消耗自身所有技能的PP值并附加自身最大体力值20%的[color=#52a5f2]百分比伤害[/color]，若消耗的PP值≥5点则附加的[color=#52a5f2]百分比伤害[/color]翻倍且额外令对手下1次攻击技能无效",
          "args": [
            20,
            5,
            1
          ],
          "effect": {
            "id": 1822,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1822"
          }
        },
        {
          "info": "下2回合自身造成的攻击伤害翻倍",
          "analyze_info": "[sprite name=iconHit]下2回合自身造成的攻击伤害翻倍（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 776,
            "url": "https://api.seerapi.com/v1/skill_effect_type/776"
          }
        },
        {
          "info": "下2回合令自身所有技能先制+2",
          "analyze_info": "[sprite name=iconHit]下2回合令自身所有[color=#52a5f2]技能先制[/color]+2（boss有效）",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 843,
            "url": "https://api.seerapi.com/v1/skill_effect_type/843"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "663b81"
    },
    "loadedAt": "2026-10-21T20:51:26.023Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1822",
    "data": {
      "id": 1822,
      "args_num": 3,
      "info": "消耗自身所有技能的PP值并附加自身最大体力值{0}%的百分比伤害，若消耗的PP值≥{1}点则附加的百分比伤害翻倍且额外令对手下{2}次攻击技能无效",
      "info_formatting_adjustment": "消耗自身所有技能的PP值并附加自身最大体力值{0}%的百分比伤害\r\n--><condition>若消耗的PP值≥{1}点</condition>则附加的百分比伤害翻倍且额外令对手下{2}次攻击技能无效",
      "analyze_info": "[sprite name=iconHit]消耗自身所有技能的PP值并附加自身最大体力值{0}%的[color=#52a5f2]百分比伤害[/color]，若消耗的PP值≥{1}点则附加的[color=#52a5f2]百分比伤害[/color]翻倍且额外令对手下{2}次攻击技能无效",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 35951,
          "url": "https://api.seerapi.com/v1/skill/35951"
        },
        {
          "id": 37320,
          "url": "https://api.seerapi.com/v1/skill/37320"
        },
        {
          "id": 38390,
          "url": "https://api.seerapi.com/v1/skill/38390"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        },
        {
          "id": 44313,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
        }
      ],
      "hash": "629b2d3a"
    },
    "loadedAt": "2026-10-21T20:51:32.392Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4387-001 — 1822阈值是否包括本次基础PP收费

35951/663b81实例0，1822[20,5,1]/629b2d3a。原文“消耗自身所有技能的PP值并附加自身最大体力值20%的百分比伤害，若消耗的PP值≥5点则附加的百分比伤害翻倍且额外令对手下1次攻击技能无效”。API原文/格式化/analyze仅标iconHit，Wiki效果1822同文、PP消耗独立页面缺失，精确检索未给口径。来源research/4387-source-check.json、4387-wiki-source.json、4387-extra-source.json。

两种有据解释：条目“消耗”的PP仅指本效果清空的额外实际PP；或包括同一次使用技能的基础实耗。只额外剩4、本次基础已付1时分别为20%+不封攻击，或40%+下1次攻击无效。三倍基础又可产生额外2、实际基础3等跨阈值场景。项目记录真实基础实耗与本效果清空量，代码顺序不当作口径答案。两解释相同的额外≥5与额外+基础<5已全部实现、验证，包括余额不足时基础收费只记录真实付2而非虚计3、免疫/命中附效关闭不多扣、PP保护不免主动消耗、下次攻击消费和本体魂印回合末恢复。存在分歧时明确抛待确认，原输入完整保留，不返回猜测结果。

被阻塞：临界阈值判断及正常全部技能/版本接入验收；其他独立工作已完成。

明确问题：1822的“消耗PP值≥5”只统计该条效果额外清空的实际PP，还是包含这次使用技能的基础实际PP消耗？

我的回答：不包含

### 关联公共主问题 Q-N20-4354-007 — 826击败后下回合异常的目标

35950/30b241c9实例2，826[2]/51e5c388，完整原文“当回合击败对手则下回合开始后随机附加2种异常状态”。API无目标补充，Wiki效果826/rev同文保存在extra-source。没有明确“对方下只”或“对方全队”；不因为旧注册表的延期标签而把本源豁免。与1128等共享击败后后续效果目标主问题，但需分别明确本826：原被击败者重生后是否触发、还是仅真实后继精灵、或队伍下次出战目标？当前研究明确排除未知826指令且完整保留原ID/参数/文，其他1187中毒、1048异常攻伤、整个魂印和其余技能均已状态验证。826未实现，不宣称真正多精灵分支已完成；只有语义明确后才可按真实依赖登记。


## 4394 祭空墟祖 — 18真实技能及魂印逐项审核，独立工作完成、部分待确认

2026-10-21T22:09:40.440Z。20自身状态专项；research/4394-independent-v2.log20/20，后续1201收紧来源绑定后research/4394-enum-source-v3.log40/40包含本只20与旧3879的20，重叠不累计。公共回归research/4394-public-current-v1.log266/267保留原失败：旧3879正确的泛参数拒绝断言被新7枚举扩大，现在按35989/79746c50/实例0/[100,7,2,1]真实来源绑定新行为，保留旧断言不改。不是扩大用户精确兼容授权。48项审查登记，缺失/失效0仅表示覆盖，未知不表示通过。无正式部署和完整验收。

全部原始词条、名称、ID、参数、URL/hash及版本如下；补充Wiki/参照/缺失检索详见research/4394-wiki-source.json、4394-extra-source.json、4394-764-related-instances.json。

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1612",
    "data": {
      "id": 1612,
      "desc": "回合开始时若自身满体力则当回合自身免疫所有受到的异常状态且自身造成的攻击伤害提升100%；|战斗阶段结束时若自身处于异常状态则{吸取}对手最大{体力}的1/3且令对手下回合属性技能失效，若自身不处于异常状态则附加自身最大体力1/3的百分比伤害（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身满体力则当回合自身<color=#64F9FA>免疫</color>所有受到的<b>异常状态</b>\r\n<indent=32><sprite=4><indent=48>自身造成的<b>攻击伤害</b><color=#64F9FA>提升</color>100%\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身处于异常状态则<color=#64F9FA>吸取</color>对手最大体力的1/3且令对手下回合<b>属性技能</b><color=#64F9FA>失效</color>\r\n<indent=32><sprite=4><indent=48>若自身不处于异常状态则<color=#64F9FA>附加</color>自身最大体力1/3的<b>百分比伤害</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4394,
          "url": "https://api.seerapi.com/v1/pet/4394"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          3,
          3,
          1
        ],
        "effect": {
          "id": 1998,
          "url": "https://api.seerapi.com/v1/eid_effect/1998"
        }
      },
      "effect_alias": "alias_1998_100_3_3_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 8,
          "url": "https://api.seerapi.com/v1/soulmark_tag/8"
        },
        {
          "id": 14,
          "url": "https://api.seerapi.com/v1/soulmark_tag/14"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "7a3cbc9d"
    },
    "loadedAt": "2026-10-21T21:29:05.736Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28017",
    "data": {
      "id": 28017,
      "name": "古谕魔盒",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹异常状态了；开始每回合附加一定固定伤害了；对手使用攻击技能则降低一定体力",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "4回合内使用技能附加250点固定伤害，若自身体力高于对手则效果翻倍",
          "analyze_info": "[sprite name=iconHit]4回合内使用技能附加250点[color=#52a5f2]固定伤害[/color]，若自身体力高于对手则效果翻倍（boss有效）",
          "args": [
            4,
            250
          ],
          "effect": {
            "id": 1004,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1004"
          }
        },
        {
          "info": "3回合内若对手使用攻击技能降低对手最大体力的1/3",
          "analyze_info": "[sprite name=iconHit]3回合内若对手使用攻击技能降低对手最大体力的1/3",
          "args": [
            3,
            3
          ],
          "effect": {
            "id": 764,
            "url": "https://api.seerapi.com/v1/skill_effect_type/764"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "5df56412"
    },
    "loadedAt": "2026-10-21T21:29:50.249Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/764",
    "data": {
      "id": 764,
      "args_num": 2,
      "info": "{0}回合内若对手使用攻击技能降低对手最大体力的1/{1}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内若对手使用攻击技能降低对手最大体力的1/{1}",
      "pve_effective": false,
      "param": null,
      "hash": "2b679190"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/35990",
    "data": {
      "id": 35990,
      "name": "光陨荒芜祭",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 18,
        "url": "https://api.seerapi.com/v1/element_type_combination/18"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则下1次受到的伤害转化为自身体力",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则下1次受到的伤害[color=#52a5f2]转化[/color]为自身体力",
          "args": [
            1
          ],
          "effect": {
            "id": 1343,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1343"
          }
        },
        {
          "info": "攻击结束时附加对手双防之和40%的百分比伤害",
          "analyze_info": "[sprite name=iconHit]攻击结束时附加对手双防之和40%的[color=#52a5f2]百分比伤害[/color]",
          "args": [
            40
          ],
          "effect": {
            "id": 967,
            "url": "https://api.seerapi.com/v1/skill_effect_type/967"
          }
        },
        {
          "info": "击败对手则对方下只精灵出战时己方在场精灵吸取其最大体力的1/3",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则对方下只精灵[color=#57c975]出战时[/color][color=#52a5f2]己方[/color]在场精灵[color=#52a5f2]吸取[/color]其最大体力的1/3",
          "args": [
            3
          ],
          "effect": {
            "id": 840,
            "url": "https://api.seerapi.com/v1/skill_effect_type/840"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "5a1b5564"
    },
    "loadedAt": "2026-10-21T21:30:23.763Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1343",
    "data": {
      "id": 1343,
      "args_num": 1,
      "info": "消除对手回合类效果，消除成功则下{0}次受到的伤害转化为自身体力",
      "info_formatting_adjustment": "消除对手回合类效果\r\n--><condition>消除成功</condition>则下{0}次受到的伤害转化为体力恢复",
      "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则下{0}次受到的伤害[color=#52a5f2]转化[/color]为自身体力",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28474,
          "url": "https://api.seerapi.com/v1/skill/28474"
        },
        {
          "id": 32005,
          "url": "https://api.seerapi.com/v1/skill/32005"
        },
        {
          "id": 35870,
          "url": "https://api.seerapi.com/v1/skill/35870"
        },
        {
          "id": 35990,
          "url": "https://api.seerapi.com/v1/skill/35990"
        },
        {
          "id": 37252,
          "url": "https://api.seerapi.com/v1/skill/37252"
        },
        {
          "id": 37316,
          "url": "https://api.seerapi.com/v1/skill/37316"
        },
        {
          "id": 37974,
          "url": "https://api.seerapi.com/v1/skill/37974"
        },
        {
          "id": 38252,
          "url": "https://api.seerapi.com/v1/skill/38252"
        },
        {
          "id": 38566,
          "url": "https://api.seerapi.com/v1/skill/38566"
        }
      ],
      "tag": [
        {
          "id": 30442,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/30442"
        },
        {
          "id": 52161,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/52161"
        },
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        }
      ],
      "hash": "fcacc01f"
    },
    "loadedAt": "2026-10-21T21:30:30.214Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/840",
    "data": {
      "id": 840,
      "args_num": 1,
      "info": "击败对手则对方下只精灵出战时己方在场精灵吸取其最大体力的1/{0}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则对方下只精灵[color=#57c975]出战时[/color][color=#52a5f2]己方[/color]在场精灵[color=#52a5f2]吸取[/color]其最大体力的1/{0}",
      "pve_effective": false,
      "param": null,
      "hash": "e93bb261"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/37252",
    "data": {
      "id": 37252,
      "name": "晦隐空灵诀",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 18,
        "url": "https://api.seerapi.com/v1/element_type_combination/18"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则下1次受到的伤害转化为自身体力",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则下1次受到的伤害[color=#52a5f2]转化[/color]为自身体力",
          "args": [
            1
          ],
          "effect": {
            "id": 1343,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1343"
          }
        },
        {
          "info": "吸取对手最大体力的1/3，若对手免疫百分比伤害则100%令对手疲惫",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手最大体力的1/3，若对手免疫[color=#52a5f2]百分比伤害[/color]则100%令对手[color=#57c975]疲惫[/color]",
          "args": [
            3,
            100,
            7
          ],
          "effect": {
            "id": 1885,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1885"
          }
        },
        {
          "info": "当回合击败对手则恢复自身全部体力",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color][color=#57c975]击败[/color]对手则恢复自身全部体力（boss有效）",
          "args": [],
          "effect": {
            "id": 672,
            "url": "https://api.seerapi.com/v1/skill_effect_type/672"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "36217e60"
    },
    "loadedAt": "2026-10-21T21:30:36.174Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4394-001 — 1343清回合成功后下次伤害转为体力

35990/5a1b5564与37252/36217e60实例0，1343[1]/fcacc01f，原文“消除对手回合类效果，消除成功则下1次受到的伤害转化为自身体力”。API、Wiki1343及伤害转换精确检索没有给出免疫/护盾后0伤是否消费、转换在伤害结算哪一步、是否按技能回复受禁疗等规则。已有4246-060的1090范围只涉及下一回合机制，不能扩成此不同次数词条；现有代码不是用户答案。

可独立部分真实清回合成功/无效果/保护失败已测；后半未实现，代码明确pending且正式编译拒绝整个未完成条目，研究手动只执行已审核前半。不同消费口径影响0伤后下一击是否继续转换，不同回复类型影响技能禁疗下能否回血。不能据无来源选项自填优先级。影响两第五完整链和本地正式验收，其余当前明确分支已实现。

明确问题：1343的“下1次伤害转化为体力”以哪一步伤害计量，0结算伤害是否消费次数，转换回复是否受技能禁疗限制？

我的回答：转换量按防御、减免、免疫、护盾处理后的完整红伤；消费；受

### Q-N20-4394-002 — 追加第五精确来源接入授权

37252晦隐空灵诀/36217e60（获取物1725878/c756e7d1墟祖记忆）与原35990光陨荒芜祭/5a1b5564，两真实版本分别保留；魂印1612/7a3cbc9d。API pet4394/98ed6dd5及additional第五来源完整保留。精确方案research/4394-exact-additional-fifth-proposal.json（implemented:false），未扩大兼容白名单。研究两组分别实际执行已知技能链，正常双版本部署选择仍被现有校验拒绝。

明确问题：是否授权该文件绑定4394/1612及35990、37252真实hash的最小追加第五接入兼容（不扩大到其他来源或参数）？

我的回答：授权

### Q-N20-4394-003 — 764“降低对手最大体力”的对象与类型

28017古谕魔盒/5df56412实例2，764[3,3]/2b679190，完整原文“3回合内若对手使用攻击技能降低对手最大体力的1/3”。API原始/格式化与Wiki764均同文；百分比伤害/粉伤/体力上限补充页缺失，精确检索无新增解释。相关旧3481/25783/5b5052b0实例1[4,3]证据完整保存在4394-764-related-instances.json，仅遗留实现，不因代码行为充作答案，保留原可用版本。

现文可读为降低maxHP上限或按maxHP三分之一减少当前HP；前者改变今后恢复上限和最大体力比例基数，后者不改上限。若指当前HP损失，还缺百分比伤害还是直接体力减少的真实分类，不能凭数字推断。当前同技能191/1004反弹异常及250/500附伤全做成功失败边界交互，764未知指令不执行、不标多精灵延期。影响古谕魔盒完整实现及正式验收。与此前692的HP损失类型问题有关，但此处多一层上限对象歧义，未把旧答案泛化。

明确问题：764指减少maxHP上限，还是按maxHP比例减少当前HP；若是后者，应按哪种伤害/体力损失类型结算？

我的回答：后者；百分比


## 4395 海棠教皇·未明 — 全22技能/魂印逐项审核及独立工作完成，1项待确认

2026-10-21T22:18:14.157Z。63审查登记，缺失/失效0；独立严格结构错误0，不表示未知语义已通过。22自身专项research/4395-independent-v3.log22/22；当前公共research/4395-public-current-v1.log63/63含本只22、4394的20和公共规则21，重叠不累计。真实单第五35994/88a155a8含1179、1355、1356联动已测，698对方真实下只冰封完整延期；12440原atk_num=3保持，按已确认全局单目标一次忽略范围，未改为三连击。原v1/v2失败均保留，修正新夹具真实状态键/种子、源值和对照属性等，不删改旧正确断言。1391未答不运行注定失败完整验收，无正式部署。

### Q-N20-4395-001 — 1391“若对手使用属性技能则造成伤害前”的时机及未触发范围

冰洁明心27747/6b0ee5bd实例2，1391[3,15]/e7877ba6。完整原文、参数和URL/hash如下：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1613",
    "data": {
      "id": 1613,
      "desc": "回合开始时，若自身满体力则当回合攻击技能必定打出致命一击，且当次攻击造成的伤害若高于400则100%使对手冰封；|战斗阶段结束时，若自身满体力则下回合自身所有技能先制+1，若自身未满体力则恢复自身最大体力的1/3并造成等量百分比伤害（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身满体力则：\r\n<indent=32><sprite=4><indent=48>当回合攻击技能<color=#64F9FA>必定打出致命一击</color>\r\n<indent=32><sprite=4><indent=48>当次攻击造成的伤害若高于400则100%<color=#64F9FA>使对手冰封</color>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身满体力则下回合自身所有技能<b>先制</b>+1\r\n<indent=32><sprite=4><indent=48>若自身未满体力则<color=#64F9FA>恢复</color>自身最大体力的1/3并造成等量<b>百分比伤害</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4395,
          "url": "https://api.seerapi.com/v1/pet/4395"
        }
      ],
      "effect": {
        "effect_args": [
          400,
          100,
          1,
          3,
          1
        ],
        "effect": {
          "id": 2000,
          "url": "https://api.seerapi.com/v1/eid_effect/2000"
        }
      },
      "effect_alias": "alias_2000_400_100_1_3_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 11,
          "url": "https://api.seerapi.com/v1/soulmark_tag/11"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "c6d33591"
    },
    "loadedAt": "2026-10-21T22:09:52.417Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/27747",
    "data": {
      "id": 27747,
      "name": "冰洁明心",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹异常状态了；自身受到过高的伤害则恢复自身全部体力并造成等同于恢复量的固定伤害；对手使用属性技能则进入冰封",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "3回合内受到的伤害大于300则主动恢复自身全部体力并造成等同于恢复量的固定伤害",
          "analyze_info": "[sprite name=iconHit]3回合内受到的伤害大于300则主动恢复自身全部体力并造成等同于恢复量的[color=#52a5f2]固定伤害[/color]",
          "args": [
            3,
            300
          ],
          "effect": {
            "id": 1073,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1073"
          }
        },
        {
          "info": "3回合内若对手使用属性技能则造成伤害前令对手冰封，未触发则消除对手回合类效果",
          "analyze_info": "[sprite name=iconHit]3回合内若对手使用属性技能则造成伤害前令对手[color=#57c975]冰封[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
          "args": [
            3,
            15
          ],
          "effect": {
            "id": 1391,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1391"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "6b0ee5bd"
    },
    "loadedAt": "2026-10-21T22:10:50.951Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1391",
    "data": {
      "id": 1391,
      "args_num": 2,
      "info": "{0}回合内若对手使用属性技能则造成伤害前令对手{1}，未触发则消除对手回合类效果",
      "info_formatting_adjustment": "{0}回合内<condition>若对手使用属性技能</condition>则令对手{1}\r\n--><condition>未触发</condition>则消除对手回合类效果",
      "analyze_info": "[sprite name=iconHit]{0}回合内若对手使用属性技能则造成伤害前令对手[color=#57c975]{1}[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
      "pve_effective": false,
      "param": [
        {
          "position": 1,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 26377,
          "url": "https://api.seerapi.com/v1/skill/26377"
        },
        {
          "id": 26518,
          "url": "https://api.seerapi.com/v1/skill/26518"
        },
        {
          "id": 26539,
          "url": "https://api.seerapi.com/v1/skill/26539"
        },
        {
          "id": 26580,
          "url": "https://api.seerapi.com/v1/skill/26580"
        },
        {
          "id": 26917,
          "url": "https://api.seerapi.com/v1/skill/26917"
        },
        {
          "id": 27747,
          "url": "https://api.seerapi.com/v1/skill/27747"
        },
        {
          "id": 28357,
          "url": "https://api.seerapi.com/v1/skill/28357"
        },
        {
          "id": 28409,
          "url": "https://api.seerapi.com/v1/skill/28409"
        },
        {
          "id": 28998,
          "url": "https://api.seerapi.com/v1/skill/28998"
        },
        {
          "id": 29413,
          "url": "https://api.seerapi.com/v1/skill/29413"
        }
      ],
      "tag": [
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        },
        {
          "id": 30442,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/30442"
        }
      ],
      "hash": "e7877ba6"
    },
    "loadedAt": "2026-10-21T22:10:57.397Z",
    "storage": "refreshed"
  }
]
```

API raw/analyze与Wiki效果1391/revision349352同文，精灵359854、魂印320150未补充。research/4395-wiki-source.json最初错误标题“技能效果:1391”缺失不作为有效机制证据；已改查真实“效果:1391”保存在4395-extra-source.json。精确检索无新增说明，eid2000/fa8d90f为魂印真实五参数[400,100,1,3,1]独立已核。已查全部现有确认文件，未发现1391的用户回答。

已独立实现：3回合时限；对手此前已实际用属性、己方随后攻击造成伤害前施加冰封；免疫冰封失败才清对手回合效果，含保护/状态与真实阶段。存在分歧的尚未出手或未用属性时明确抛问题，原输入不改，正式编译拒绝，不伪成完整实现。其余21招全部独立分支、该技能191反弹/1073高伤回满固定反击、整个本体魂印已完成成功失败边界交互。

缺口：“使用”是否包括本回合已选择但尚未出手的属性招；“未触发”只指条件内冰封失败还是包括对手没有使用属性。这两种阅读会影响己方先手攻击时是否能冰封、对方未用属性时是否清回合。未给无依据的伤害阶段优先级。

明确问题：1391按对手本回合实际已使用的属性技能触发，还是按已选择的属性技能预判；“未触发清回合”是否也适用于对手没使用属性技能的情况？

我的回答：还是按已选择的属性技能预判；不适用


## 4400 圣律剑灵 — 第二批首只全部独立工作完成、关联原公共疑问

2026-10-21T22:31:50.356Z。17真实技能/43项逐实例审查，独立严格审核0错误，缺失/失效0；20自身专项，research/4400-independent-final-v6.log129/129含自身20、旧4321/3945/4184/4278的88和公共21。各中间104/106/129有重叠不累计，原失败保留。暂未正式部署：1128/1827击败后后续封锁目标仍未核实，未知指令不注册为空实现、不按ID直接延期。

### 关联主问题 Q-N20-4354-007 — 新1827击败后属性技能无效的目标（续用同一主问题）

28030圣律·寰宇合/e5af0d7d实例2，1128[1]/1b3b7422，原文“击败对手则令对手下1次使用的攻击技能无效”；28031圣律·大一统/8e13cc2实例2，1827[1]/8a3d6982，原文“击败对手则令对手下1次使用的属性技能无效”。API未说明被击败者复活是否保留或指真实后继，Wiki相关只重复词条；不复问主问题，追加这两个真实实例请分别纳入答案。完整来源版本如下：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1617",
    "data": {
      "id": 1617,
      "desc": "1.作为至序圣华发动处决的力量之源，圣律剑灵每次登场时对手每存在1层处决印记，则登场2回合内自身受到的伤害减少20%（包括固定伤害、百分比伤害），同时为对手在场精灵附加1层处决印记（最多2层）；|2.作为至序圣华召唤圣剑的力量之源，圣律剑灵每次登场时都会根据双方场上的圣剑总数开启如下效果，持续到自身下场：|1柄：造成的攻击伤害提升10%，每增加1柄额外提升10%；|2柄：受到的攻击伤害减少10%，每增加1柄额外减少10%；|3柄：所有技能先制额外+1；|4柄及以上：免疫所有异常状态；|3.圣律剑灵在场且处于己方圣剑重铸期间时，令对手所有体力恢复效果减少100%且使用体力药剂时效果变成减少相应的体力，同时所有技能造成的攻击伤害不会出现微弱且对手每存在1层处决印记额外附加100点真实伤害；|4.圣律剑灵每次击败对手时，若对手存在处决印记则令自身全属性+1，若对手不存在处决印记则为对手下只出战精灵附加1层处决印记|（所有特效boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>作为至序圣华的神力之源，圣律剑灵每次登场时：\r\n<indent=32><sprite=4><indent=48>根据对手所处的处决印记数量触发<color=#64F9FA>对应</color>的效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>0层：为对手附加1层<color=#FFF779>处决印记</color>\r\n<indent=32><sprite=4><sprite=4><indent=64>1层：为对手附加1层处决印记；2回合内受到的<b>攻击伤害、固定伤害、百分比伤害<color=#64F9FA></b>减少</color>20% \r\n<indent=32><sprite=4><sprite=4><indent=64>2层：为对手附加1层处决印记；2回合内受到的<b>攻击伤害、固定伤害、百分比伤害<color=#64F9FA></b>减少</color>40% \r\n<indent=32><sprite=4><indent=48>根据双方场上的圣剑数量总和触发<color=#64F9FA>累计</color>的效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>1柄：造成的<b>攻击伤害<color=#64F9FA></b>提升</color>10%，每超出1柄都额外提升10%\r\n<indent=32><sprite=4><sprite=4><indent=64>2柄：受到的<b>攻击伤害<color=#64F9FA></b>减少</color>10%，每超出1柄都额外减少10%\r\n<indent=32><sprite=4><sprite=4><indent=64>3柄：所有技能<b>先制</b>+1\r\n<indent=32><sprite=4><sprite=4><indent=64>4柄及以上：<color=#64F9FA>免疫</color>所有<b>异常状态</b>\r\n\r\n<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>圣律剑灵在场且处于己方圣剑重铸期间时：\r\n<indent=32><sprite=4><indent=48>令对手<b>体力恢复效果<color=#64F9FA></b>减少</color>100%且<color=#64F9FA>药剂效果中的体力增加变为体力减少</color>\r\n<indent=32><sprite=4><indent=48>自身所有技能<color=#64F9FA>附加</color>等同于对手所处的处决印记数量*100的<b>真实伤害</b>且造成的<b>攻击伤害<color=#64F9FA></b>不会出现微弱</color>\r\n\r\n<indent=0><sprite=0><indent=16>击败效果：\r\n<indent=16><sprite=3><indent=32>圣律剑灵每次击败对手时：\r\n<indent=32><sprite=4><indent=48>若对手存在处决印记则令自身<color=#64F9FA>全属性+1</color>\r\n<indent=32><sprite=4><indent=48>若对手不存在处决印记则为对手下只出战精灵附加1层处决印记\r\n\r\n<indent=0><sprite=5><indent=15>处决印记（上限2层，下场保留）：\r\n<indent=16><sprite=6><indent=32>至序圣华、圣律剑灵用以触发额外效果的条件\r\n<indent=16><sprite=6><indent=32>持有精灵被击败时清空",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4400,
          "url": "https://api.seerapi.com/v1/pet/4400"
        }
      ],
      "effect": {
        "effect_args": [
          2,
          100,
          3,
          1
        ],
        "effect": {
          "id": 1972,
          "url": "https://api.seerapi.com/v1/eid_effect/1972"
        }
      },
      "effect_alias": "alias_1972_2_100_3_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 4,
          "url": "https://api.seerapi.com/v1/soulmark_tag/4"
        },
        {
          "id": 5,
          "url": "https://api.seerapi.com/v1/soulmark_tag/5"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "db6c9a19"
    },
    "loadedAt": "2026-10-21T22:18:24.292Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28030",
    "data": {
      "id": 28030,
      "name": "圣律·寰宇合",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始以圣灵之力裁决对手了；体力开始快速恢复了；若对手被裁决则其后继之人的攻击技能也将遭受封印",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "使对手直接受到200点圣灵系伤害，双方场上每有1柄圣剑则造成的伤害提升10%，若未命中则造成的伤害额外翻倍",
          "analyze_info": "[sprite name=iconHit]使对手直接受到200点圣灵系伤害，双方场上每有1柄[color=#f35555]圣剑[/color]则造成的伤害提升10%，若未命中则造成的伤害额外翻倍",
          "args": [
            200,
            10
          ],
          "effect": {
            "id": 1825,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1825"
          }
        },
        {
          "info": "2回合内每回合使用技能恢复自身最大体力的1/1并造成等量百分比伤害",
          "analyze_info": "[sprite name=iconHit]2回合内每回合使用技能恢复自身最大体力的1/1并造成等量[color=#52a5f2]百分比伤害[/color]（boss有效）",
          "args": [
            2,
            1
          ],
          "effect": {
            "id": 532,
            "url": "https://api.seerapi.com/v1/skill_effect_type/532"
          }
        },
        {
          "info": "击败对手则令对手下1次使用的攻击技能无效",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下1次使用的攻击技能无效",
          "args": [
            1
          ],
          "effect": {
            "id": 1128,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1128"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "e5af0d7d"
    },
    "loadedAt": "2026-10-21T22:19:07.126Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1128",
    "data": {
      "id": 1128,
      "args_num": 1,
      "info": "击败对手则令对手下{0}次使用的攻击技能无效",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下{0}次使用的攻击技能无效",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28030,
          "url": "https://api.seerapi.com/v1/skill/28030"
        },
        {
          "id": 30469,
          "url": "https://api.seerapi.com/v1/skill/30469"
        },
        {
          "id": 30515,
          "url": "https://api.seerapi.com/v1/skill/30515"
        },
        {
          "id": 31025,
          "url": "https://api.seerapi.com/v1/skill/31025"
        },
        {
          "id": 31041,
          "url": "https://api.seerapi.com/v1/skill/31041"
        },
        {
          "id": 31123,
          "url": "https://api.seerapi.com/v1/skill/31123"
        },
        {
          "id": 31179,
          "url": "https://api.seerapi.com/v1/skill/31179"
        },
        {
          "id": 31341,
          "url": "https://api.seerapi.com/v1/skill/31341"
        },
        {
          "id": 31519,
          "url": "https://api.seerapi.com/v1/skill/31519"
        },
        {
          "id": 31529,
          "url": "https://api.seerapi.com/v1/skill/31529"
        },
        {
          "id": 31847,
          "url": "https://api.seerapi.com/v1/skill/31847"
        },
        {
          "id": 32233,
          "url": "https://api.seerapi.com/v1/skill/32233"
        },
        {
          "id": 33105,
          "url": "https://api.seerapi.com/v1/skill/33105"
        },
        {
          "id": 34034,
          "url": "https://api.seerapi.com/v1/skill/34034"
        },
        {
          "id": 35793,
          "url": "https://api.seerapi.com/v1/skill/35793"
        },
        {
          "id": 36427,
          "url": "https://api.seerapi.com/v1/skill/36427"
        },
        {
          "id": 36611,
          "url": "https://api.seerapi.com/v1/skill/36611"
        },
        {
          "id": 36857,
          "url": "https://api.seerapi.com/v1/skill/36857"
        },
        {
          "id": 37064,
          "url": "https://api.seerapi.com/v1/skill/37064"
        },
        {
          "id": 38010,
          "url": "https://api.seerapi.com/v1/skill/38010"
        },
        {
          "id": 38348,
          "url": "https://api.seerapi.com/v1/skill/38348"
        },
        {
          "id": 38497,
          "url": "https://api.seerapi.com/v1/skill/38497"
        }
      ],
      "tag": [
        {
          "id": 44313,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
        }
      ],
      "hash": "1b3b7422"
    },
    "cacheFile": "research/3652-source-check-external.json",
    "loadedAt": "2026-10-13T14:32:48.482Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28031",
    "data": {
      "id": 28031,
      "name": "圣律·大一统",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始以神秘能量裁决对手了；活力开始快速恢复了；若对手被裁决则其后继之人的属性技能也将遭受封印",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "使对手直接受到200点神秘系伤害，双方场上每有1柄圣剑则造成的伤害提升10%，若未命中则造成的伤害额外翻倍",
          "analyze_info": "[sprite name=iconHit]使对手直接受到200点神秘系伤害，双方场上每有1柄[color=#f35555]圣剑[/color]则造成的伤害提升10%，若未命中则造成的伤害额外翻倍",
          "args": [
            200,
            10
          ],
          "effect": {
            "id": 1826,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1826"
          }
        },
        {
          "info": "2回合内每回合结束后降低对手所有技能1点PP值并恢复自身所有技能1点PP值",
          "analyze_info": "[sprite name=iconHit]2回合内每[color=#57c975]回合结束后[/color]降低对手所有技能1点PP值并恢复自身所有技能1点PP值",
          "args": [
            2,
            1,
            1
          ],
          "effect": {
            "id": 1655,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1655"
          }
        },
        {
          "info": "击败对手则令对手下1次使用的属性技能无效",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下1次使用的属性技能无效",
          "args": [
            1
          ],
          "effect": {
            "id": 1827,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1827"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "8e13cc2"
    },
    "loadedAt": "2026-10-21T22:19:25.767Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1827",
    "data": {
      "id": 1827,
      "args_num": 1,
      "info": "击败对手则令对手下{0}次使用的属性技能无效",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则令对手下{0}次使用的属性技能无效",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28031,
          "url": "https://api.seerapi.com/v1/skill/28031"
        },
        {
          "id": 36289,
          "url": "https://api.seerapi.com/v1/skill/36289"
        },
        {
          "id": 36427,
          "url": "https://api.seerapi.com/v1/skill/36427"
        },
        {
          "id": 36482,
          "url": "https://api.seerapi.com/v1/skill/36482"
        },
        {
          "id": 36566,
          "url": "https://api.seerapi.com/v1/skill/36566"
        },
        {
          "id": 36612,
          "url": "https://api.seerapi.com/v1/skill/36612"
        },
        {
          "id": 37203,
          "url": "https://api.seerapi.com/v1/skill/37203"
        },
        {
          "id": 37511,
          "url": "https://api.seerapi.com/v1/skill/37511"
        }
      ],
      "tag": [
        {
          "id": 44313,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
        }
      ],
      "hash": "8a3d6982"
    },
    "loadedAt": "2026-10-21T22:19:37.932Z",
    "storage": "refreshed"
  }
]
```

已完成：两招不同圣灵/神秘200属性直伤、当前双方1758生成圣剑后按每柄10%增为220、真实非必中未命中研究分支翻倍、被封锁不伪成未命中；实际源两招必中属性不会被攻击用失明打断，测试明确以研究去必中夹具覆盖未命中分支，未把修改夹具冒充正式源表现。532满回复实际等量粉伤与1655回合末双方PP、当前标记所有强化/威力/击败分支、全第五盾罩消除和全技能状态均已实现。被阻塞只为两个封锁的后继目标语义及正常全部加载验收。

新增公共实现证据：旧4321的1758能在当前双方造圣剑，已实现其真实场地计数；PP保护只阻止削PP，不阻止造剑。1617入场造成当前处决印记，因此1760/1765全条件不能继续延期，已改为完整单精灵分支，并保留旧断言补当前交互。受击回血406是技能效果，补齐skill回复来源使禁疗正确拦截，旧3945/4184/4278已专项回归，待当前稳定代码重新认证。最初说明曾误写受影响旧目标4275，实际来源核对为4321，未据错误编号修改目标数据。

真正延期：1617真实再登场、己方同队1547死亡后重铸及队伍资源生命周期、无印记击败后的对方真实下只标记；1830真实己方重铸条件下解放圣剑为对方下只随机异常。完整原文/ID/参数/hash由统一MULTI-PET-TODO保存，不把当前1758场地造剑、当前标记强化或属性直伤比例算延期。重铸来源依赖本地真实4321/1547/2a1c0673，敌方1758单独造剑不等于己方进入重铸，未伪造该状态。


## 4401 破世之拳·特罗斯 — 全24技能逐项独立工作完成，未回答分支保留

2026-10-21T22:47:16.038Z。82项审查登记，缺失/失效0，独立严格结构错误0；31自身专项。research/4401-independent-final-v6.log147/147含自身31、旧3524/3954的53、4400的20、4395的22与公共21，来源绑定后旧泛枚举断言保留；随后为技能battleStart补公共资源上下文（不放宽编译），research/4401-resource-context-current.log52/52含本只31和公共21。两日志有重叠不相加，未进行正式全源接入/完整验收。

已完成新普通机制：1836低体不吸取、不回复，改双倍粉伤；半体及以上吸取并理论回复。2035真实下次攻击命中后清该招的剩余实际PP并按每1点全弱1，0余额也消费一次、免弱不免自身成本、命中附效关闭不清PP、属性/控制/MISS不消费。此处“命中时所使用攻击技能”明确成本阶段，未把该实现当作4387-001关于所有技能PP阈值的用户答案。1191自降、1837真实束缚28及原/伙伴/追加第五其余全部明确分支已完成。

原失败日志保留：v1新夹具错误把1245误当吸取，实际源明确是正级反馈/失败随机2PP0；现用真实状态断言正确机制。942前置可清粉免本身会使清回合成功，已换不可清固有抗性隔离失败分支；原第五攻击穿盾但后续3000百分比吸取会消费盾，整链保留正确盾耗尽结果，不改正确公共规则。补测到期时曾让对手在第3次被吸死，改为粉免以合法覆盖第4/5回合；0与-0新断言表示差异纠正为实际0。

全部原始版本、参数和来源URL/hash如下。Wiki精灵359845、魂印320155、效果1836/344294、1837/344295、2594/388792、伙伴38582/388748及2035/344493，保存research/4401-wiki-source.json、4401-extra-source.json。

```json
[
  {
    "url": "https://api.seerapi.com/v1/pet/4401",
    "data": {
      "id": 4401,
      "name": "破世之拳·特罗斯",
      "yielding_exp": 140,
      "catch_rate": 0,
      "evolving_lv": 0,
      "releaseable": false,
      "fusion_master": false,
      "fusion_sub": false,
      "has_resistance": true,
      "resource_id": 4401,
      "enemy_resource_id": null,
      "type": {
        "id": 73,
        "url": "https://api.seerapi.com/v1/element_type_combination/73"
      },
      "gender": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/pet_gender/2"
      },
      "base_stats": {
        "atk": 146,
        "def": 111,
        "sp_atk": 70,
        "sp_def": 111,
        "spd": 138,
        "hp": 174,
        "percent": false,
        "total": 750
      },
      "pet_class": {
        "id": 3061,
        "url": "https://api.seerapi.com/v1/pet_class/3061"
      },
      "evolution_chain_index": 0,
      "yielding_ev": {
        "atk": 0,
        "def": 0,
        "sp_atk": 0,
        "sp_def": 0,
        "spd": 0,
        "hp": 0,
        "percent": false,
        "total": 0
      },
      "vipbuff": null,
      "mount_type": null,
      "diy_stats": null,
      "skill": [
        {
          "learning_level": 1,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 10611,
            "url": "https://api.seerapi.com/v1/skill/10611"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 5,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 21119,
            "url": "https://api.seerapi.com/v1/skill/21119"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 9,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 11904,
            "url": "https://api.seerapi.com/v1/skill/11904"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 13,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 11088,
            "url": "https://api.seerapi.com/v1/skill/11088"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 17,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 22870,
            "url": "https://api.seerapi.com/v1/skill/22870"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 21,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35555,
            "url": "https://api.seerapi.com/v1/skill/35555"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 25,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 15250,
            "url": "https://api.seerapi.com/v1/skill/15250"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 29,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 20156,
            "url": "https://api.seerapi.com/v1/skill/20156"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 33,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 15247,
            "url": "https://api.seerapi.com/v1/skill/15247"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 37,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35556,
            "url": "https://api.seerapi.com/v1/skill/35556"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 41,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27809,
            "url": "https://api.seerapi.com/v1/skill/27809"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 45,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35557,
            "url": "https://api.seerapi.com/v1/skill/35557"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 49,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27810,
            "url": "https://api.seerapi.com/v1/skill/27810"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 53,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35558,
            "url": "https://api.seerapi.com/v1/skill/35558"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 57,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 27811,
            "url": "https://api.seerapi.com/v1/skill/27811"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 61,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 35559,
            "url": "https://api.seerapi.com/v1/skill/35559"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 71,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 36018,
            "url": "https://api.seerapi.com/v1/skill/36018"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 72,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 28032,
            "url": "https://api.seerapi.com/v1/skill/28032"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 73,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 36019,
            "url": "https://api.seerapi.com/v1/skill/36019"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 74,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 28033,
            "url": "https://api.seerapi.com/v1/skill/28033"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 75,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 36020,
            "url": "https://api.seerapi.com/v1/skill/36020"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 0,
          "is_special": true,
          "is_advanced": false,
          "is_fifth": false,
          "skill": {
            "id": 38582,
            "url": "https://api.seerapi.com/v1/skill/38582"
          },
          "skill_activation_item": {
            "id": 1728536,
            "url": "https://api.seerapi.com/v1/skill_activation_item/1728536"
          }
        },
        {
          "learning_level": 76,
          "is_special": false,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 36021,
            "url": "https://api.seerapi.com/v1/skill/36021"
          },
          "skill_activation_item": null
        },
        {
          "learning_level": 77,
          "is_special": true,
          "is_advanced": false,
          "is_fifth": true,
          "skill": {
            "id": 28355,
            "url": "https://api.seerapi.com/v1/skill/28355"
          },
          "skill_activation_item": {
            "id": 1725369,
            "url": "https://api.seerapi.com/v1/skill_activation_item/1725369"
          }
        }
      ],
      "soulmark": [
        {
          "id": 1618,
          "url": "https://api.seerapi.com/v1/soulmark/1618"
        }
      ],
      "factor": [
        {
          "id": 2400139,
          "url": "https://api.seerapi.com/v1/factor/2400139"
        }
      ],
      "encyclopedia_entry": {
        "id": 4401,
        "url": "https://api.seerapi.com/v1/pet_encyclopedia_entry/4401"
      },
      "archive_story_entry": {
        "id": 456,
        "url": "https://api.seerapi.com/v1/pet_archive_story_entry/456"
      },
      "peak_pool": null,
      "peak_expert_pool": null,
      "peak_cost_pool": null,
      "advance": null,
      "hash": "85a8e9b0"
    },
    "loadedAt": "2026-10-21T22:31:55.327Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1618",
    "data": {
      "id": 1618,
      "desc": "自身造成的攻击伤害提升50%，攻击技能命中前每损失10%体力则增伤效果提升10%；若攻击技能命中前自身体力低于最大体力的1/2则额外附加造成伤害100%的百分比伤害，额外恢复造成伤害100%的体力值；|回合开始时若自身不处于能力提升状态，则当回合攻击技能必定致命、必定命中；|战斗阶段结束时若自身处于能力下降状态，则消除对手能力提升状态并附加给对手等同于自身的能力下降状态，若对手免疫此次能力下降则双倍反转自身能力下降状态并为自身附加300点护罩|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>自身造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%，使用攻击技能时每损失10%体力则效果额外提升10%\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>使用攻击技能时若自身体力低于最大体力的1/2则当次攻击：\r\n<indent=32><sprite=4><indent=48><color=#64F9FA>附加</color>造成伤害100%的<b>百分比伤害</b>\r\n<indent=32><sprite=4><indent=48><color=#64F9FA>恢复</color>造成伤害100%的<b>体力值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时若自身不处于能力提升状态，则当回合攻击技能<color=#64F9FA>必定致命、必定命中</color>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若自身处于能力下降状态，则<color=#64F9FA>消除</color>对手<b>能力提升状态</b>并给予对手相同的<b>能力下降</b></b>状态\r\n<indent=32><sprite=4><indent=48>若对手<color=#64F9FA>免疫</color>此次<b>能力下降</b>则双倍<color=#64F9FA>反转</color>自身<b>能力下降状态</b>并<color=#64F9FA>获得</color>300点<b>护罩</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4401,
          "url": "https://api.seerapi.com/v1/pet/4401"
        }
      ],
      "effect": {
        "effect_args": [
          50,
          10,
          10,
          2,
          100,
          100,
          300,
          1
        ],
        "effect": {
          "id": 2005,
          "url": "https://api.seerapi.com/v1/eid_effect/2005"
        }
      },
      "effect_alias": "alias_2005_50_10_10_2_100_100_300_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 13,
          "url": "https://api.seerapi.com/v1/soulmark_tag/13"
        },
        {
          "id": 15,
          "url": "https://api.seerapi.com/v1/soulmark_tag/15"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "3fc997ef"
    },
    "loadedAt": "2026-10-21T22:32:01.725Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/38582",
    "data": {
      "id": 38582,
      "name": "厄目瞑眴",
      "power": 90,
      "max_pp": 5,
      "accuracy": 100,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 73,
        "url": "https://api.seerapi.com/v1/element_type_combination/73"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "战斗开始时，自身获得50只巫祖之眸",
          "analyze_info": "[sprite name=iconInherent]战斗开始时，自身获得50只[color=#f35555]巫祖之眸[/color]（boss有效）",
          "args": [],
          "effect": {
            "id": 2594,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2594"
          }
        },
        {
          "info": "自身处于能力提升状态时造成的伤害提升50%，先出手时效果翻倍",
          "analyze_info": "[sprite name=iconHit]自身处于能力提升状态时造成的伤害提升50%，先出手时效果翻倍（boss有效）",
          "args": [
            50
          ],
          "effect": {
            "id": 1472,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1472"
          }
        },
        {
          "info": "消除双方能力上升、下降状态，消除成功则附加消除总段数乘以30的固定伤害",
          "analyze_info": "[sprite name=iconHit]消除双方能力上升、下降状态（boss有效），消除成功则附加消除总段数乘[color=#52a5f2]以[/color]30的[color=#52a5f2]固定伤害[/color]",
          "args": [
            30
          ],
          "effect": {
            "id": 1209,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1209"
          }
        },
        {
          "info": "本回合打出致命一击则令对手2回合属性技能无效",
          "analyze_info": "[sprite name=iconHit]本回合打出[color=#52a5f2]致命一击[/color]则令对手2回合属性技能无效",
          "args": [
            2
          ],
          "effect": {
            "id": 1483,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1483"
          }
        },
        {
          "info": "击败对手则恢复自身全部体力和所有技能PP值",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则恢复自身全部体力和所有技能PP值（boss有效）",
          "args": [],
          "effect": {
            "id": 1156,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1156"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "9cd5f1f2"
    },
    "loadedAt": "2026-10-21T22:33:42.057Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/2594",
    "data": {
      "id": 2594,
      "args_num": 0,
      "info": "战斗开始时，自身获得50只巫祖之眸",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconInherent]战斗开始时，自身获得50只[color=#f35555]巫祖之眸[/color]（boss有效）",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 38582,
          "url": "https://api.seerapi.com/v1/skill/38582"
        }
      ],
      "tag": [],
      "hash": "fd54169d"
    },
    "loadedAt": "2026-10-21T22:33:48.253Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_activation_item/1728536",
    "data": {
      "id": 1728536,
      "name": "魇龙纹",
      "item_number": 1,
      "item": {
        "id": 1728536,
        "url": "https://api.seerapi.com/v1/item/1728536"
      },
      "skill": {
        "id": 38582,
        "url": "https://api.seerapi.com/v1/skill/38582"
      },
      "pet": {
        "id": 4401,
        "url": "https://api.seerapi.com/v1/pet/4401"
      },
      "hash": "ecf36036"
    },
    "loadedAt": "2026-10-21T22:33:54.279Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28355",
    "data": {
      "id": 28355,
      "name": "止戾·飒空龙心",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "消除对手回合类效果，消除成功则自身出手变得更快了；全身充满了活力；接下来的攻击将倾注全力",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则自身下2回合所有技能先制+3",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则自身下2回合所有[color=#52a5f2]技能先制[/color]+3",
          "args": [
            2,
            3
          ],
          "effect": {
            "id": 979,
            "url": "https://api.seerapi.com/v1/skill_effect_type/979"
          }
        },
        {
          "info": "恢复自身所有PP值",
          "analyze_info": "[sprite name=iconHit]恢复自身所有PP值（boss有效）",
          "args": [],
          "effect": {
            "id": 87,
            "url": "https://api.seerapi.com/v1/skill_effect_type/87"
          }
        },
        {
          "info": "下2回合若打出致命一击则造成的攻击伤害提升100%",
          "analyze_info": "[sprite name=iconHit]下2回合若打出[color=#52a5f2]致命一击[/color]则造成的攻击伤害提升100%",
          "args": [
            2,
            100
          ],
          "effect": {
            "id": 1558,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1558"
          }
        },
        {
          "info": "下2回合若打出致命一击则必定恢复全部体力",
          "analyze_info": "[sprite name=iconHit]下2回合若打出[color=#52a5f2]致命一击[/color]则必定恢复全部体力（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 702,
            "url": "https://api.seerapi.com/v1/skill_effect_type/702"
          }
        },
        {
          "info": "下1次攻击命中时消耗所使用攻击技能的全部PP值，每消耗1点令对手全属性-1",
          "analyze_info": "[sprite name=iconHit]下1次攻击命中时消耗所使用攻击技能的全部PP值，每消耗1点令对手[color=#52a5f2]全属性[/color]-1",
          "args": [
            1,
            1,
            1
          ],
          "effect": {
            "id": 2035,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2035"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "64f1a24b"
    },
    "loadedAt": "2026-10-21T22:34:07.631Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/2035",
    "data": {
      "id": 2035,
      "args_num": 3,
      "info": "下{0}次攻击命中时消耗所使用攻击技能的全部PP值，每消耗{1}点令对手全属性-{2}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]下{0}次攻击命中时消耗所使用攻击技能的全部PP值，每消耗{1}点令对手[color=#52a5f2]全属性[/color]-{2}",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28355,
          "url": "https://api.seerapi.com/v1/skill/28355"
        },
        {
          "id": 28501,
          "url": "https://api.seerapi.com/v1/skill/28501"
        },
        {
          "id": 28743,
          "url": "https://api.seerapi.com/v1/skill/28743"
        },
        {
          "id": 29349,
          "url": "https://api.seerapi.com/v1/skill/29349"
        },
        {
          "id": 38114,
          "url": "https://api.seerapi.com/v1/skill/38114"
        }
      ],
      "tag": [
        {
          "id": 35733,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35733"
        }
      ],
      "hash": "ac41ca34"
    },
    "loadedAt": "2026-10-21T22:34:13.763Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_activation_item/1725369",
    "data": {
      "id": 1725369,
      "name": "龙吟咖啡",
      "item_number": 3,
      "item": {
        "id": 1725369,
        "url": "https://api.seerapi.com/v1/item/1725369"
      },
      "skill": {
        "id": 28355,
        "url": "https://api.seerapi.com/v1/skill/28355"
      },
      "pet": {
        "id": 4401,
        "url": "https://api.seerapi.com/v1/pet/4401"
      },
      "hash": "b7c9c4ef"
    },
    "loadedAt": "2026-10-21T22:34:19.915Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4401-001 — 1618命中前HP快照与低体多段附伤/回复单位

魂印1618/3fc997ef，eid2005/898119c9，参数[50,10,10,2,100,100,300,1]。原文“自身造成的攻击伤害提升50%，攻击技能命中前每损失10%体力则增伤效果提升10%；若攻击技能命中前自身体力低于最大体力的1/2则额外附加造成伤害100%的百分比伤害，额外恢复造成伤害100%的体力值”。API格式化写“使用攻击技能时”，Wiki与原文同文未解释多段。24招中真实11904/15247均4~6段。现有用户确认没有特罗斯答案，已有4333-003的多段问题并未回答且实例不同，不重复套作确认。

有据阅读差异：按整次使用在首命中前取HP快照，后续用整个攻击伤害结算一次；或每段命中前动态HP，各段分别附伤/回复。例9000最大HP、4000HP、首段结算500：逐段分支先回复至4500后不再满足严格低半，整次快照分支可能全部段数继续参与，两者的增伤阶梯/粉伤及回复均不同。这里只列来源措辞所支持的差别，不自造概率和新倍率。

已完成单击全条件、HP不变高体多段、完整结算与实际HP损失区分、粉免/技能禁疗/保命/过量攻击、魂印末弱化反馈及自身反转等独立部分。低体多段或多段间HP变化明确拒绝且原输入完整保留，不以注册/基础31通过代替魂印多段认证。

明确问题：1618对4~6段攻击的HP判断及50%+阶梯增伤按整次技能首命中快照还是逐段更新；低体100%附伤和回复按整次攻击伤害结算一次还是逐段结算？

我的回答：首命中快照；整攻击结算一次

### Q-N20-4401-002 — 伙伴2594/巫祖之眸的自身行为定义缺失

38582厄目瞑眴/9cd5f1f2实例0，2594[]/fd54169d，完整原文“战斗开始时，自身获得50只巫祖之眸”。获取物1728536魇龙纹/ecf36036，API明确pet4401、skill38582；名称不当作机制证据，不因伙伴身份延期。API与Wiki38582/388748、2594/388792一致给50，没有后续资源说明；Wiki全站“巫祖之眸”只返回这两页，独立资源页/模块缺失，模板:效果说明357047全文没有该词；原始检索完整保存4401-extra-source.json，没有凭别的精灵猜效果。

已知取得50的启动状态真实实现，技能启动上下文补齐，研究用真实战斗状态执行已知启动阶段；但未知资源消耗/被动规则未实现，正式编译明确拒绝2594为完成状态。伙伴其余1472/1209/1483/1156全真实组合状态已测，包括90固定、暴击封属性、击败全HP/PP。没有把50计数变化宣称整条完整认证，也不把未知语义登记多精灵延期。

明确问题：本伙伴取得的“巫祖之眸”除记录50计数外还有哪些自身可触发的效果或消耗规则，请给明确说明或可核查来源；若确实只有计数也请明确确认。

我的回答：巫祖之眸
自身的第五技能为属性技能时，自身进入的害怕状态转化为砥砺，自身的第五技能为攻击技能时，自身进入的诅咒类转化为狂暴；自身每次使用攻击技能时，自身巫祖之眸的只数增加10%，自身使用属性技能时，自身巫祖之眸的只数减少与上限差值的10%；自身巫祖之眸的数量达到100只时，本次战斗自身的属性技能无效且打出致命一击后令对手诅咒，自身失去所有巫祖之眸时，本场战斗令对手无法解除、反转、反馈能力下降状态；上限100只

### Q-N20-4401-003 — 原/追加第五精确接入授权

原36021极戾·破世龙拳/a1afa9d4，追加28355止戾·飒空龙心/64f1a24b，来源pet4401/85a8e9b0、魂印1618/3fc997ef，获取物1725369龙吟咖啡/b7c9c4ef，所需数量3。两组各保留一真实第五，伙伴38582是独立常规技能、加入两组但不是第五。完整最小方案research/4401-exact-additional-fifth-proposal.json，implemented:false；原始sourceFlags与pet快照完整保留，不扩大既有hash/参数授权。研究两组实际技能链通过，正常版本选择仍受精确来源审核门槛限制。

明确问题：是否授权该精确方案绑定4401来源、1618魂印及36021/28355真实hash的最小双第五版本接入兼容？

我的回答：授权

### 关联公共主问题 Q-N20-4373-002 — 魂印再给300护罩

1618/3fc997ef原文“若对手免疫此次能力下降则双倍反转自身能力下降状态并为自身附加300点护罩”。已确认无护罩时的300和双倍反转（-2→+4）、禁强/不可解除反转时不妨碍独立300分支，以及敌负六封顶不当成免疫。已有护罩时共存/重复授予/触发消费归属尚未答，本源明确拒绝，继续合并原主问题，不照搬4275获准LIFO特例。


## 4408 派利尔 — 全17技能/魂印逐项独立工作完成，1新边界问题及既有时序关联

2026-10-21T23:05:46.318Z。48项审查登记，缺失/失效0、独立严格结构错误0；20自身状态专项。research/4408-independent-final-v4.log161/161包含本只20、旧3741/3815/4318的69、4401的31、4400的20和公共21；中间64/161重叠不累计，旧失败日志保留。正常全源接入/完整验收未跑：魂印目的max边界与833未答，未部署。

新增990真实清回合成功附300固定、1844按敌方实时已损失HP附40%粉伤；948束缚28按真实36055/e4d428b6/实例0绑定，不扩大旧泛枚举范围。479原直接赋值漏体力损失事件，已改走公共direct HP-loss通路，体力不足阈值留1、等阈值可0并同条仍对敌造成固定伤害，损失不伪作伤害；旧3741/3815专项已回归，二者已在必要重新认证队列不重复新增。

已核复用：1522/fcc966a9普通合法参数[200,200]沿已有公共“本次技能完整攻击伤害”机制，参考4318-085原答案和同版本审核；本实例阈值200与旧300分别核对，新增真实200/201与1HP实际0测试，不把本条200固定自计入阈值，不扩大任何精确参数兼容授权。22[40,2]真实说明疲惫3回合，代码公共p1+1与实际状态3已验证。

重要真实交互：1626战阶末沉默随后在同回合发生最大HP1/8粉伤，可能把交换后1000HP目标击败，或者消耗1125护罩。新夹具初次漏掉这项已纠正，保留完整伤害1125/实际损失1000及盾罩数值，未削弱公共异常规则。减伤对1680不会从1000变500，因其已有明确bypass路径，未为新魂印破坏正确真实伤害穿透。

完整原始词条、名称ID参数、URL/hash/版本：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1626",
    "data": {
      "id": 1626,
      "desc": "战斗阶段结束时与对手互换当前双方的体力值，之后若自身体力高于对手则100%令对手沉默且解除自身异常状态，若自身体力低于对手则下回合自身攻击技能先制+1且受到的伤害减少50%（包括固定伤害、百分比伤害）（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时与对手<color=#64F9FA>交换</color><b>体力值</b>，然后：\r\n<indent=32><sprite=4><indent=48>若自身体力高于对手则100%<color=#64F9FA>令对手沉默</color>且<color=#64F9FA>解除</color>自身<b>异常状态</b>\r\n<indent=32><sprite=4><indent=48>若自身体力低于对手则下回合自身攻击技能<b>先制</b>+1且受到的<b>固定伤害、百分比伤害</b><color=#64F9FA>减少</color>50%",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4408,
          "url": "https://api.seerapi.com/v1/pet/4408"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          1,
          50,
          1
        ],
        "effect": {
          "id": 2012,
          "url": "https://api.seerapi.com/v1/eid_effect/2012"
        }
      },
      "effect_alias": "alias_2012_100_1_50_1",
      "tag": [
        {
          "id": 4,
          "url": "https://api.seerapi.com/v1/soulmark_tag/4"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "d2f7eed"
    },
    "loadedAt": "2026-10-21T22:47:27.217Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28051",
    "data": {
      "id": 28051,
      "name": "启明之辰",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹异常状态了；用启明之辰的力量创造护盾和护罩来庇护自身",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若对手当回合使用的技能为攻击技能则自身额外先制+1",
          "analyze_info": "[sprite name=iconInherent]若对手[color=#52a5f2]当回合[/color]使用的技能为攻击技能则自身额外[color=#52a5f2]先制[/color]+1",
          "args": [],
          "effect": {
            "id": 1774,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1774"
          }
        },
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "为自身附加400点护盾",
          "analyze_info": "[sprite name=iconHit]为自身附加400点[color=#57c975]护盾[/color]（boss有效）",
          "args": [
            400
          ],
          "effect": {
            "id": 847,
            "url": "https://api.seerapi.com/v1/skill_effect_type/847"
          }
        },
        {
          "info": "为自身附加400点护罩",
          "analyze_info": "[sprite name=iconHit]为自身附加400点[color=#57c975]护罩[/color]（boss有效）",
          "args": [
            400
          ],
          "effect": {
            "id": 1342,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1342"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "c231824e"
    },
    "loadedAt": "2026-10-21T22:48:06.309Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28052",
    "data": {
      "id": 28052,
      "name": "领航之光",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "全属性都提升了；消耗自身体力以释放领航之光重创对手；未击败对手则额外吸取对手体力",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "全属性+1，后出手时自身强化效果翻倍",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，后出手时自身强化效果翻倍（boss有效）",
          "args": [
            1
          ],
          "effect": {
            "id": 1344,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1344"
          }
        },
        {
          "info": "损失自身500点体力，给对手造成500点固定伤害，若自身体力不足500则剩下1点体力",
          "analyze_info": "[sprite name=iconHit]损失自身500点体力，给对手造成500点[color=#52a5f2]固定伤害[/color]，若自身体力不足500则剩下1点体力（boss有效）",
          "args": [
            500,
            500,
            500,
            1
          ],
          "effect": {
            "id": 479,
            "url": "https://api.seerapi.com/v1/skill_effect_type/479"
          }
        },
        {
          "info": "当回合若未击败对手则吸取对手最大体力的1/3",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则[color=#52a5f2]吸取[/color]对手最大体力的1/3",
          "args": [
            3
          ],
          "effect": {
            "id": 833,
            "url": "https://api.seerapi.com/v1/skill_effect_type/833"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "537cc6a9"
    },
    "loadedAt": "2026-10-21T22:48:18.624Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/479",
    "data": {
      "id": 479,
      "args_num": 4,
      "info": "损失自身{0}点体力，给对手造成{1}点固定伤害，若自身体力不足{2}则剩下{3}点体力",
      "info_formatting_adjustment": "损失自身{0}点体力，给对手造成{1}点固定伤害\r\n--><condition>若自身体力不足{2}</condition>则剩下{3}点体力",
      "analyze_info": "[sprite name=iconHit]损失自身{0}点体力，给对手造成{1}点[color=#52a5f2]固定伤害[/color]，若自身体力不足{2}则剩下{3}点体力（boss有效）",
      "pve_effective": true,
      "param": null,
      "hash": "8dd6d5a2"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/833",
    "data": {
      "id": 833,
      "args_num": 1,
      "info": "当回合若未击败对手则吸取对手最大体力的1/{0}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit][color=#52a5f2]当回合[/color]若未[color=#57c975]击败[/color]对手则[color=#52a5f2]吸取[/color]对手最大体力的1/{0}",
      "pve_effective": false,
      "param": null,
      "hash": "d68ad255"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36058",
    "data": {
      "id": 36058,
      "name": "穿云入梦",
      "power": 150,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 102,
        "url": "https://api.seerapi.com/v1/element_type_combination/102"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "先出手时50%的概率打出致命一击，未触发则令对手全属性-1",
          "analyze_info": "[sprite name=iconComp]先出手时[sprite name=iconInherent] 50%的概率打出[color=#52a5f2]致命一击[/color]，[color=#52a5f2]未触发[/color]则[sprite name=iconHit] 令对手[color=#52a5f2]全属性[/color]-1（boss有效）",
          "args": [
            1
          ],
          "effect": {
            "id": 1465,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1465"
          }
        },
        {
          "info": "附加200点固定伤害，若当回合造成的伤害高于200则固伤效果翻倍",
          "analyze_info": "[sprite name=iconHit]附加200点[color=#52a5f2]固定伤害[/color]，若[color=#52a5f2]当回合[/color]造成的伤害高于200则固伤效果翻倍（boss有效）",
          "args": [
            200,
            200
          ],
          "effect": {
            "id": 1522,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1522"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "25851907"
    },
    "loadedAt": "2026-10-21T22:48:24.593Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1522",
    "data": {
      "id": 1522,
      "args_num": 2,
      "info": "附加{0}点固定伤害，若当回合造成的伤害高于{1}则固伤效果翻倍",
      "info_formatting_adjustment": "附加{0}点固定伤害\r\n--><condition>若当回合造成的伤害高于</condition>{1}则效果翻倍",
      "analyze_info": "[sprite name=iconHit]附加{0}点[color=#52a5f2]固定伤害[/color]，若[color=#52a5f2]当回合[/color]造成的伤害高于{1}则固伤效果翻倍（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 33811,
          "url": "https://api.seerapi.com/v1/skill/33811"
        },
        {
          "id": 34277,
          "url": "https://api.seerapi.com/v1/skill/34277"
        },
        {
          "id": 34372,
          "url": "https://api.seerapi.com/v1/skill/34372"
        },
        {
          "id": 34622,
          "url": "https://api.seerapi.com/v1/skill/34622"
        },
        {
          "id": 34716,
          "url": "https://api.seerapi.com/v1/skill/34716"
        },
        {
          "id": 35198,
          "url": "https://api.seerapi.com/v1/skill/35198"
        },
        {
          "id": 35293,
          "url": "https://api.seerapi.com/v1/skill/35293"
        },
        {
          "id": 35598,
          "url": "https://api.seerapi.com/v1/skill/35598"
        },
        {
          "id": 36058,
          "url": "https://api.seerapi.com/v1/skill/36058"
        },
        {
          "id": 36157,
          "url": "https://api.seerapi.com/v1/skill/36157"
        },
        {
          "id": 36173,
          "url": "https://api.seerapi.com/v1/skill/36173"
        },
        {
          "id": 36435,
          "url": "https://api.seerapi.com/v1/skill/36435"
        },
        {
          "id": 36778,
          "url": "https://api.seerapi.com/v1/skill/36778"
        },
        {
          "id": 36992,
          "url": "https://api.seerapi.com/v1/skill/36992"
        },
        {
          "id": 37165,
          "url": "https://api.seerapi.com/v1/skill/37165"
        },
        {
          "id": 37503,
          "url": "https://api.seerapi.com/v1/skill/37503"
        },
        {
          "id": 37708,
          "url": "https://api.seerapi.com/v1/skill/37708"
        },
        {
          "id": 38055,
          "url": "https://api.seerapi.com/v1/skill/38055"
        },
        {
          "id": 38303,
          "url": "https://api.seerapi.com/v1/skill/38303"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "fcc966a9"
    },
    "cacheFile": "research/4318-source-check.json",
    "loadedAt": "2026-10-20T12:21:21.325Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36059",
    "data": {
      "id": 36059,
      "name": "霞宇天灵阵",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 102,
        "url": "https://api.seerapi.com/v1/element_type_combination/102"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若对手处于异常状态则先制+1",
          "analyze_info": "[sprite name=iconInherent]若对手处于异常状态则[color=#52a5f2]先制[/color]+1（boss有效）",
          "args": [
            1
          ],
          "effect": {
            "id": 1002,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1002"
          }
        },
        {
          "info": "消除对手回合类效果，消除成功则附加300点固定伤害",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则附加300点[color=#52a5f2]固定伤害[/color]",
          "args": [
            300
          ],
          "effect": {
            "id": 990,
            "url": "https://api.seerapi.com/v1/skill_effect_type/990"
          }
        },
        {
          "info": "附加已损失体力值40%的百分比伤害",
          "analyze_info": "[sprite name=iconHit]附加[color=#52a5f2]已损失体力[/color]值40%的[color=#52a5f2]百分比伤害[/color]（boss有效）",
          "args": [
            40
          ],
          "effect": {
            "id": 436,
            "url": "https://api.seerapi.com/v1/skill_effect_type/436"
          }
        },
        {
          "info": "附加对手已损失体力值40%的百分比伤害",
          "analyze_info": "[sprite name=iconHit]附加对手[color=#52a5f2]已损失体力[/color]值40%的[color=#52a5f2]百分比伤害[/color]",
          "args": [
            40
          ],
          "effect": {
            "id": 1844,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1844"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "c3e9f2ad"
    },
    "loadedAt": "2026-10-21T22:48:31.218Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4408-001 — 1626绝对体力互换超出目的上限

魂印1626/d2f7eed，eid2012/105dc84e，参数[100,1,50,1]。完整原文“战斗阶段结束时与对手互换当前双方的体力值，之后若自身体力高于对手则100%令对手沉默且解除自身异常状态，若自身体力低于对手则下回合自身攻击技能先制+1且受到的伤害减少50%（包括固定伤害、百分比伤害）（boss无效）”。API与Wiki魂印320163同文；原文/Wiki写全伤含固粉，格式化仅列固粉、未明确排除攻击，保持两份原文并依完整描述实现已核公共全伤减免。

普通范围的绝对值对调及之后高/低/等分支已完整实现测试：直接调整数值，无伤害/回复表述，因此交换本身不生成伤害/体力损失事件、不受禁疗或护盾拦；之后沉默仍正常产生自身独立持续伤害。未拿旧705代码当作来源。已查Wiki效果705/revision343165只写“与对手互换当前体力”、独立体力交换页缺失；现有4147-035明确百分比对调与取整/保留1，但不是本绝对值交换的超上限授权，不机械扩大；3683旧2496确认仅概率/触发不补上限规则。

缺口只在交换数值超过接收方最大HP时：3000最大HP、当前1000，与9000最大HP、当前5000交换。字面原数值交换可令前者得到5000；按各自上限限制则最多3000，会改变之后高低比较与沉默/先制减伤分支。API、Wiki没有给出该边界，不自行编造扩最大HP机制。当前遇此边界明确拒绝且原输入保留，不按旧代码猜截断；其余全部独立分支与全第五链已完成。

明确问题：1626交换当前HP后若接收值超过该精灵自己的maxHP，应按原数值保留，还是截断到接收方maxHP？

我的回答：截断

### 关联主问题 Q-N20-4373-004 — 新833未击败时序

28052领航之光/537cc6a9实例2，833[3]/d68ad255，完整原文“当回合若未击败对手则吸取对手最大体力的1/3”。与4373/4376同主问题尚未答，继续关联，不把旧注册表即时行为当作用户答案，不因ID错误延期为多精灵。1344全强化和479自损固定全成功/失败/边界/关键交互已完成，整招研究只执行这两条已明确部分。需要主问题答案分别涵盖该实例的当回合判定时点。

### 关联公共观察 Q-N20-4373-002 — 1342与来源回调护罩的分配

28051启明之辰/c231824e实例3，1342[400]，原文“为自身附加400点护罩”。本源普通400值与实际防护已实现；给定先前真实1809[200,100,6]来源护罩再加400并吸收150的研究互作，数值450，但来源回调归属仍显式记录pendingBarrierLoss=Q-N20-4373-002，不把未定义的害怕触发猜成成功或失败，也不扩大4275的LIFO授权。本词条没有新增自身消失回调；该观察不把普通400授予本身假称未实现，原公共分配问题仍保留。


## 4421 赤胆游龙·赵云 — 全17技能/58项审核及全部独立工作完成，2条技能语义待确认

2026-10-21T23:54:13.950Z。35自身真实状态专项，research/4421-independent-final-v6.log195/195包括自身35、旧3673与594三个已认证目标3580/4001/4068的67、公开界面相关旧4004/4147/4169/4258的72、公共21；中间119/124/195有重叠不累计。正常全源本地接入/验证器及完整npm未运行，因为529、1858仍有未答分歧，未部署。魂印全部当前自身分支逐项审核完成，无新增需用户裁决的魂印疑问；真实下场扣胆/再登场单独完整延期。

已实现1638全部自身强化：首入场免异常和封对方攻击附效（魂印自身效果不伪作技能本体）；回合初状态先制2；命中随机3项降1与按实际变化对应自升、封顶不补抽；失败末实时负级2倍作为提升量（不是双倍反转）；当前状态三分支累计、每负项30真实伤害与下回合6项、异常吸最大1/4；龙胆每得1即当前起2回合免异、最多7、满7免异/免基础PP，跨7本次已付不退，PP0仍不能使用、外部削PP不被免。0/7资源、临时免异和满层文字已在公开状态展示。

资料解决而非提问：research/4421-source-differences.json完整保留API与Wiki原文/hash/rev。Wiki魂印320175把失败弱化补偿写成命中时记录快照，免异常起点写当回合结束；API1638/baef8d5a与格式化明确战阶末当前负级、当回合战斗阶段起2回合。按既有用户API优先规则实现API，不要求再次裁决。Wiki用括号单列延后补偿后在主句说明之后的三状态，补充了命中后即时状态处理结构而不覆盖API实时值。真实测试-2被对手当轮再降为-3后补偿变+3，非旧快照+1；已有不可解除/反转不阻止普通能力提升，禁强化才拦。

新普通924/1857/1859和纯多精灵934均实现/分拆；594疲惫7按真实36129/101321a9实例0/[300,100,7]绑定，保留旧23、30、5枚举正确拒绝与语义。470真实参数[3,100,6]、API词条4回合按已核公共p0+1处理，当次攻击即可附害怕；新夹具最初误认为当次不附已纠正，原失败日志保留。真实36130自带+3先制，后手PP边界测试用对方临时先制覆盖而没有改源优先；敌2PP先支付1变低2时135→180威力、250→500吸取，敌满胆免付时仍2PP、威力135与吸取250。

529的旧3673/32339可用版本及向下取整正确旧断言完整保留；新源只允许全部取整解释相同的正整数交换结果。hpExchangePolicy为本地研究约束，不是上游新字段；正式源由limitations阻止部署，研究实际执行点遇小数/低于1明确拒绝，不在回合开始错用早快照。其他旧来源无该研究约束仍保持原行为。未将4147-035关于1633的回答冒充新529的授权。

入场状态界面原写死所有精灵为“星皇之佑余4-round”，使1回合免异错误显示3；现按真实entryAilmentRounds显示，标签由通用元数据给出，原星皇单独保留已存在名称和3回合，旧正确断言未修改。该公共显示修正没有改变其他已认证目标的战斗数值，公开显示与旧专项当前通过。

完整新问题来源名称、ID/hash、原文、参数：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1638",
    "data": {
      "id": 1638,
      "desc": "自身每次登场首回合免疫异常状态并令对手攻击技能的附加效果失效|回合开始时若自身处于能力提升、能力下降或异常状态则当回合所有技能先制+2|自身技能命中时令对手3项能力等级-1，触发成功则自身获得等量的能力提升，未触发则则当回合战斗阶段结束时自身获得当前能力下降2倍的能力提升，然后根据自身所处的状态额外触发以下效果：|能力提升状态：获得1枚龙胆|能力下降状态：每处于1种能力下降状态附加30点真实伤害，下回合前述效果中减少的能力等级项数改为6|异常状态：吸取对手最大体力的1/4|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身每次登场后当回合免疫<b>异常状态</b>并令对手<b>攻击技能</b>的<color=#64F9FA>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时若自身处于能力提升、能力下降或异常状态则当回合所有技能<b>先制</b>+2\r\n\r\n<indent=0><sprite=0><indent=16>技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身技能命中时降低对手3项能力1级并附加到自身\r\n<indent=32><sprite=4><indent=48>未触发则当回合战斗阶段结束时<color=#64F9FA>获得</color>此时自身所处能力下降2倍的<b>能力提升</b>\r\n<indent=32><sprite=4><indent=48>然后根据自身状态额外触发累计的如下效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>处于能力提升则获得1层<color=#FFF779>龙胆</color>\r\n<indent=32><sprite=4><sprite=4><indent=64>处于能力下降则每处于1项都<color=#64F9FA>附加</color>30点<b>真实伤害</b>，且下回合上述降低能力等级效果改为降低6项\r\n<indent=32><sprite=4><sprite=4><indent=64>处于异常状态则<color=#64F9FA>吸取</color>对手最大体力的1/4 \r\n\r\n<indent=0><sprite=5><indent=15>龙胆（上限7枚，下场保留）：\r\n<indent=16><sprite=6><indent=32>每次获得后，当回合战斗阶段起2回合内<color=#64F9FA>免疫</color>受到的<b>异常状态</b>\r\n<indent=16><sprite=6><indent=32>自身下场后，每经过1回合龙胆减少1层\r\n<indent=16><sprite=6><indent=32>当龙胆层数为7时触发龙胆世无双：自身开始<color=#64F9FA>免疫</color><b>异常状态</b>且使用技能不再消耗PP值直到龙胆数低于7",
      "analyze_desc": "[sprite name=dot4]自身每次[color=#57c975]登场[/color]首回合[color=#57c975]免疫[/color][color=#52a5f2]异常状态[/color]并令[color=#52a5f2]对手[/color]攻击技能的附加效果失效|[sprite name=dot4][color=#57c975]回合开始时[/color]若自身处于能力提升、能力下降或[color=#52a5f2]异常状态[/color]则[color=#52a5f2]当回合[/color]所有[color=#52a5f2]技能先制[/color]+2|[sprite name=dot4]自身技能命中时令[color=#52a5f2]对手[/color]3项能力等级-1，触发成功则自身获得等量的能力提升，[color=#52a5f2]未触发[/color]则则[color=#52a5f2]当回合[/color][color=#57c975]战斗阶段结束时[/color]自身获得当前能力下降2倍的能力提升，[color=#52a5f2]然后[/color]根据自身所处的状态额外触发以下效果：|[sprite name=dot5][color=#52a5f2]能力提升状态[/color]：获得1枚[color=#f35555]龙胆[/color]|[sprite name=dot5][color=#52a5f2]能力下降状态[/color]：每处于1种[color=#52a5f2]能力下降状态[/color]附加30点[color=#52a5f2]真实伤害[/color]，下回合前述效果中减少的能力等级项数改为6|[sprite name=dot5][color=#52a5f2]异常状态[/color]：[color=#52a5f2]吸取[/color][color=#52a5f2]对手[/color]最大体力的1/4",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4421,
          "url": "https://api.seerapi.com/v1/pet/4421"
        }
      ],
      "effect": {
        "effect_args": [
          2,
          30,
          4,
          2,
          1,
          1
        ],
        "effect": {
          "id": 2020,
          "url": "https://api.seerapi.com/v1/eid_effect/2020"
        }
      },
      "effect_alias": "alias_2020_2_30_4_2_1_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 8,
          "url": "https://api.seerapi.com/v1/soulmark_tag/8"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "baef8d5a"
    },
    "loadedAt": "2026-10-21T23:05:56.984Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28087",
    "data": {
      "id": 28087,
      "name": "绝境龙魂",
      "power": 0,
      "max_pp": 10,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "对调了双方的体力百分比；进攻开始额外吸取对手一些体力",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "使自身体力百分比与对手体力百分比对调",
          "analyze_info": "[sprite name=iconHit]使自身体力百分比与对手体力百分比对调",
          "args": [],
          "effect": {
            "id": 529,
            "url": "https://api.seerapi.com/v1/skill_effect_type/529"
          }
        },
        {
          "info": "下2回合攻击技能吸取对手1/3最大体力值",
          "analyze_info": "[sprite name=iconHit]下2回合攻击技能[color=#52a5f2]吸取[/color]对手1/3最大体力值",
          "args": [
            2,
            3
          ],
          "effect": {
            "id": 924,
            "url": "https://api.seerapi.com/v1/skill_effect_type/924"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "666527f7"
    },
    "loadedAt": "2026-10-21T23:06:35.534Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/529",
    "data": {
      "id": 529,
      "args_num": 0,
      "info": "使自身体力百分比与对手体力百分比对调",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]使自身体力百分比与对手体力百分比对调",
      "pve_effective": false,
      "param": null,
      "hash": "bdd91488"
    },
    "cacheFile": "research/selected-3711-3716-3724-3737-3739-3740-3741-3763-3788-3807.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28088",
    "data": {
      "id": 28088,
      "name": "长缨破阵",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始慢慢持续吸取对手体力了；攻击变得更加犀利了；根据自身能力提升、能力下降、异常状态的数量附加固定伤害，若数量少于龙胆数，则由龙胆数代替",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "5回合内每回合使用技能吸取对手最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
          "analyze_info": "[sprite name=iconHit]5回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
          "args": [
            5,
            3,
            2
          ],
          "effect": {
            "id": 717,
            "url": "https://api.seerapi.com/v1/skill_effect_type/717"
          }
        },
        {
          "info": "下2回合自身造成的攻击伤害翻倍",
          "analyze_info": "[sprite name=iconHit]下2回合自身造成的攻击伤害翻倍（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 776,
            "url": "https://api.seerapi.com/v1/skill_effect_type/776"
          }
        },
        {
          "info": "自身每处于一种能力提升、能力下降、异常状态则附加50点固定伤害，自身每有1层龙胆视为自身至少处于一种",
          "analyze_info": "[sprite name=iconHit]自身每处于一种能力提升、能力下降、异常状态则附加50点[color=#52a5f2]固定伤害[/color]，自身每有1层[color=#f35555]龙胆[/color]视为自身至少处于一种",
          "args": [
            50
          ],
          "effect": {
            "id": 1858,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1858"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "ec0c7445"
    },
    "loadedAt": "2026-10-21T23:06:54.892Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1858",
    "data": {
      "id": 1858,
      "args_num": 1,
      "info": "自身每处于一种能力提升、能力下降、异常状态则附加{0}点固定伤害，自身每有1层龙胆视为自身至少处于一种",
      "info_formatting_adjustment": "自身每处于一种能力提升、能力下降、异常状态则附加{0}点固定伤害\r\n-->自身每有1层龙胆视为自身至少处于一种",
      "analyze_info": "[sprite name=iconHit]自身每处于一种能力提升、能力下降、异常状态则附加{0}点[color=#52a5f2]固定伤害[/color]，自身每有1层[color=#f35555]龙胆[/color]视为自身至少处于一种",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28088,
          "url": "https://api.seerapi.com/v1/skill/28088"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "c4d6dea"
    },
    "loadedAt": "2026-10-21T23:07:01.278Z",
    "storage": "refreshed"
  }
]
```

### Q-N20-4421-001 — 新529的非整数/不足1HP交换边界与既有1633确认范围

28087绝境龙魂/666527f7实例0，529[]，完整原文“使自身体力百分比与对手体力百分比对调”。API模板/实例与Wiki效果529/rev342990、技能28087/rev306472相同，未说明整数映射与不足1HP。参考已有Q-A60-4147-035已明确1633/27395：向上取整、至少1、直接调整HP；该原问题绑定另一效果与技能，不默认为所有529新源。旧3673/32339原529当前实现向下取整，但代码和既有测试不当作新真实来源或用户答案，不以改旧断言来绕过。

已完成：新源双方交换后数值为正整数时，体力比例按各自max对调、不当伤害/回复、不受禁疗/护盾；新源小数/低于1结果明确拒绝且原输入保留。924下2回攻击实际命中吸取1/3全部成功失败边界及关键交互已实现，包括粉免/技能禁疗、同击击败理论回复、属性/MISS/控制不触、到期。未完成仅529所缺边界及正常全源接入。

最小可审核方案：仅本次新529/28087/666527f7应用此前1633同类交换已确认的向上取整/至少1/直接调整；旧3673不自动变更。示例对方1/8000、本方max9000时理论1.125，向上为2、旧向下为1；理论不足1时是否保留1会决定生死。这里向下仅列旧行为差异，不伪称上游已支持它。

明确问题：是否确认本新529也采用向上取整、至少保留1HP、直接调整HP的规则（若不适用，请明确本源规则和适用范围）？

我的回答：是

### Q-N20-4421-002 — 1858的“状态种类”统计单位

28088长缨破阵/ec0c7445实例2，1858[50]/c4d6dea。完整原文“自身每处于一种能力提升、能力下降、异常状态则附加50点固定伤害，自身每有1层龙胆视为自身至少处于一种”。API及Wiki效果1858/rev344316同文，无计数例子；精确资料检索无新增解释，保留4421-extra-source.json。现有3670/519确认回答的是使用后回复时机，记录虽采用非零能力种类统计，不能当作新1858计数的用户回答。

有据解释：按每个具体能力非零项与每个异常种类逐项统计；或按能力提升、能力下降、异常三个状态类别是否存在统计。例只有ATK+1、DEF+1、无异常、0胆时分别2种=100固定或1类=50固定。龙胆原文“至少”作为种数下限；两口径一致的0/1种、三个类别各恰好一种或龙胆下限已支配时，真实固定伤害已实现验证。分歧区间明确拒绝，不选择某一计数结果伪装完成。没有虚构额外概率、层数额外相加或总状态7上限。

已完成本条共同确定分支、全28088在0/7胆共同场景、717低体只翻回复不翻伤害与776次2攻伤翻倍、全魂印与其余技能。被阻塞为1858分歧区间及整只正常验收；未知语义不归多精灵延期。

明确问题：1858每一种应统计具体能力项和每个异常种类，还是只统计提升/下降/异常三个类别；请明确计数单位及龙胆作为至少种数下限的关系。

我的回答：后者；龙胆
每次获得的回合结束时，使自身2回合内免疫受到的异常状态；最多获得7枚，获得7枚时触发龙胆世无双；自身下场之后每回合减少1枚

龙胆世无双
直到龙胆的数量减少至7枚以下，自身免疫异常状态且使用技能不再消耗PP值


## 4422 天奔流·东辉 — 全17技能/68逐项审核与独立工作完成，关联既有公共问题

2026-10-22T00:09:41.084Z。23项自身真实状态专项；research/4422-independent-final-v5.log91/91（自身23+4421的35+4354的27+公共注册6），退出0。未运行全源正常接入/验证器/整库npm，因为以下三项公共语义未答；未部署。逐项审核完成，无新增独立主问题编号，不改旧回答，新增关联如下。

1639/577ee58f/eid2025/[3,100,20,1,3,1]：API格式化已明确首回合检查对手无正，观察对手实际攻击使用（MISS也算，控制未实际使用不算），清回合成功才疲惫，末给自身max1/3护盾；没有把给盾绑定清除成功。末按恢复前非满PP技能项数每项20%粉减至次回末，全部非满则各恢复1并独立释罪四项（消强、自回max1/3、解除弱化类异常、免弱化类异常至次回末）。弱化类来自data/statuses/statuses.json原分类、Wiki对战机制rev388558/hash d02d88a71a46d25e295970528bfc4e9760aa751b7f7d9a9d7352c32b223291e8，不把能力负级当异常、不移除控制类；19种含凝滞保留其弱化类身份，用户限制类分类不抹掉原弱化身份，魇昧白板也仍保留异常身份。真实再登场独立完整延期。

普通新增1860/1861/1862/1419/1855/1863/1737/1178及889/1122/1400/1613新真实实例已实现；既有兼容授权不扩大，新来源精确绑定真实技能ID/hash/索引/参数。1855采用API原模板“额外恢复”和实际[4,1,3]，即maxHP/1，不擅改分母3；与Wiki344313少“额外”等措辞完整保留于4422-wiki-source.json，API优先。1863及1737按执行点当前实际PP，费用先支付后计算；5PP规则不是本体实际7PP，本次36147实源PP7保留。连击7+每非满项7、每命中真实源链与击败恢复全HP/PP均验证。

### 关联 Q-N20-4329-006（不另建主问题）

36139天奔六式/36[6]与36140天奔七式/62[7]：概率6%、无免疫普通死亡共同结局、7回合延迟和可清计时已做；“秒杀/死亡”经何种伤害或直接死亡结算、免疫及保命差异仍关联原公共主问题。没有把当前true/bypass代码当成用户确认。阻塞仅未答类型交互及整只正式验收，其余已完成。明确问题沿用原主问题：请明确这些死亡/秒杀实例的结算类型及与免疫、保命的交互。

我的回答：直接将体力降为0；受保命时体力降为1

### 关联 Q-N20-4358-003（不另建主问题）

36141静默/1861[]：完整原文“技能无效时，消除对手回合类效果且100%令对手沉默3回合”。Wiki348827仅额外BOSS限制（当前PVP无冲突）。明确被封锁无效时独立清回合、无论清成功均沉默3已实现；MISS/失明/闪避等范围差异未定，研究路径明确拒绝，不猜。889清回合成功沉默和1613无正先后手固定理论吸取均已完成。明确问题沿用原主问题：1861的技能无效是否包括MISS/失明/闪避等未命中，分别哪些事件触发？

我的回答：都包括

### 关联 Q-N20-4373-003（不另建主问题）

36136天奔三式/1257[3]：完整原文“对手不处于异常状态则吸取对手最大体力的1/3”。普通足HP未免疫、未截断共同场景3000粉伤和3000回复以及对手有异常不触已实现；对手剩HP不足或免伤时自身回复是理论量还是实际HP损失，仍与既有对手max比例吸取主问题同缺口，未把仅己方max比例的全局确认自动扩成新答案。明确问题：请在原公共主问题中明确本对手max比例吸取的回复基数及适用范围。

我的回答：理论值

完整关联实例的API原文、参数、来源URL/hash、本地路径research/4422-source-check.json（模板和Wiki另见4422-reviewed-snapshot.json、4422-wiki-source.json）：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1639",
    "data": {
      "id": 1639,
      "desc": "每次登场首回合开始时若对手不处于能力提升状态且当回合使用攻击技能，则使用后消除对手回合类效果且战斗阶段结束时获得等同于自身最大体力1/3的护盾，若消除成功则额外100%令对手疲惫；|战斗阶段结束时自身每有1项技能PP值不为满，则直至下回合结束受到的固定伤害和百分比伤害减少20%，若自身所有技能PP值均不为满，则恢复自身所有技能1点PP值并触发天奔释罪：消除对手能力提升状态、恢复自身最大体力的1/3、解除自身弱化类异常状态且直至下回合结束免疫所有受到的弱化类异常状态|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>回合开始时，若对手不处于能力提升状态，则当回合对手使用攻击技能后：\r\n<indent=32><sprite=4><indent=48><color=#64F9FA>消除</color>对手<b>回合类效果</b>\r\n<indent=32><sprite=4><sprite=4><indent=64>若消除成功，100%<color=#64F9FA>令对手疲惫</color>\r\n<indent=32><sprite=4><indent=48>战斗阶段结束时<color=#64F9FA>获得</color>等于自身最大体力1/3的<b>护盾</b>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身每有1项技能PP值不满，直至下回合结束后，受到的<b>固定伤害</b>和<b>百分比伤害</b><color=#64F9FA>减少</color>20%\r\n<indent=32><sprite=4><indent=48>若所有技能PP值均不满，则<color=#64F9FA>恢复</color>所有技能1点PP值并触发<color=#FFF779>天奔释罪</color>\r\n\r\n<indent=0><sprite=5><indent=15>天奔释罪：\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>消除</color>对手<color=#64F9FA>能力提升</color>状态\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>恢复</color>自身最大体力的1/3\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>解除</color>自身<b>弱化类异常状态</b>\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>免疫</color>所有<b>弱化类异常状态</b>，直至下回合结束",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4422,
          "url": "https://api.seerapi.com/v1/pet/4422"
        }
      ],
      "effect": {
        "effect_args": [
          3,
          100,
          20,
          1,
          3,
          1
        ],
        "effect": {
          "id": 2025,
          "url": "https://api.seerapi.com/v1/eid_effect/2025"
        }
      },
      "effect_alias": "alias_2025_3_100_20_1_3_1",
      "tag": [
        {
          "id": 9,
          "url": "https://api.seerapi.com/v1/soulmark_tag/9"
        },
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "577ee58f"
    },
    "loadedAt": "2026-10-21T23:54:24.019Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36136",
    "data": {
      "id": 36136,
      "name": "天奔三式",
      "power": 33,
      "max_pp": 7,
      "accuracy": 33,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/element_type_combination/2"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "自身不处于能力提升状态时先制+1且必定命中",
          "analyze_info": "[sprite name=iconInherent]自身不处于能力提升状态时[color=#52a5f2]先制[/color]+1且[color=#52a5f2]必定命中[/color]（boss有效）",
          "args": [],
          "effect": {
            "id": 1860,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1860"
          }
        },
        {
          "info": "对手不处于异常状态则吸取对手最大体力的1/3",
          "analyze_info": "[sprite name=iconHit]对手不处于异常状态则[color=#52a5f2]吸取[/color]对手最大体力的1/3",
          "args": [
            3
          ],
          "effect": {
            "id": 1257,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1257"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "c95f0bb4"
    },
    "loadedAt": "2026-10-21T23:55:02.317Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1257",
    "data": {
      "id": 1257,
      "args_num": 1,
      "info": "对手不处于异常状态则吸取对手最大体力的1/{0}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]对手不处于异常状态则[color=#52a5f2]吸取[/color]对手最大体力的1/{0}",
      "pve_effective": false,
      "param": null,
      "hash": "21530abb"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36139",
    "data": {
      "id": 36139,
      "name": "天奔六式",
      "power": 66,
      "max_pp": 7,
      "accuracy": 66,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 116,
        "url": "https://api.seerapi.com/v1/element_type_combination/116"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "自身不处于能力提升状态时先制+1且必定命中",
          "analyze_info": "[sprite name=iconInherent]自身不处于能力提升状态时[color=#52a5f2]先制[/color]+1且[color=#52a5f2]必定命中[/color]（boss有效）",
          "args": [],
          "effect": {
            "id": 1860,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1860"
          }
        },
        {
          "info": "命中时6%的概率秒杀对方",
          "analyze_info": "[sprite name=iconHit]命中时6%的概率[color=#52a5f2]秒杀[/color]对方（boss有效）",
          "args": [
            6
          ],
          "effect": {
            "id": 36,
            "url": "https://api.seerapi.com/v1/skill_effect_type/36"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "ab886bf6"
    },
    "loadedAt": "2026-10-21T23:55:21.569Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/36",
    "data": {
      "id": 36,
      "args_num": 1,
      "info": "命中时{0}%的概率秒杀对方",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]命中时{0}%的概率[color=#52a5f2]秒杀[/color]对方（boss有效）",
      "pve_effective": true,
      "param": null,
      "hash": "5aa84601"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36140",
    "data": {
      "id": 36140,
      "name": "天奔七式",
      "power": 77,
      "max_pp": 7,
      "accuracy": 77,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 116,
        "url": "https://api.seerapi.com/v1/element_type_combination/116"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "自身不处于能力提升状态时先制+1且必定命中",
          "analyze_info": "[sprite name=iconInherent]自身不处于能力提升状态时[color=#52a5f2]先制[/color]+1且[color=#52a5f2]必定命中[/color]（boss有效）",
          "args": [],
          "effect": {
            "id": 1860,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1860"
          }
        },
        {
          "info": "7回合后若对方没有将自己击败，则对方死亡",
          "analyze_info": "[sprite name=iconHit]7回合后若对方没有将自己[color=#57c975]击败[/color]，则对方死亡（boss有效）",
          "args": [
            7
          ],
          "effect": {
            "id": 62,
            "url": "https://api.seerapi.com/v1/skill_effect_type/62"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "f687d9fc"
    },
    "loadedAt": "2026-10-21T23:55:27.946Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/62",
    "data": {
      "id": 62,
      "args_num": 1,
      "info": "{0}回合后若对方没有将自己击败，则对方死亡",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合后若对方没有将自己[color=#57c975]击败[/color]，则对方死亡（boss有效）",
      "pve_effective": true,
      "param": null,
      "hash": "ceb47cfb"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36141",
    "data": {
      "id": 36141,
      "name": "静默",
      "power": 85,
      "max_pp": 7,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 116,
        "url": "https://api.seerapi.com/v1/element_type_combination/116"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "自身不处于能力提升状态时先制+1且必定命中",
          "analyze_info": "[sprite name=iconInherent]自身不处于能力提升状态时[color=#52a5f2]先制[/color]+1且[color=#52a5f2]必定命中[/color]（boss有效）",
          "args": [],
          "effect": {
            "id": 1860,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1860"
          }
        },
        {
          "info": "技能无效时，消除对手回合类效果且100%令对手沉默3回合",
          "analyze_info": "[sprite name=iconInherent]技能无效时，消除对手[color=#52a5f2]回合类效果[/color]且100%令对手[color=#57c975]沉默[/color]3回合",
          "args": [],
          "effect": {
            "id": 1861,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1861"
          }
        },
        {
          "info": "消除对手回合类效果，消除成功则令对手沉默",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则令对手[color=#57c975]沉默[/color]",
          "args": [
            30
          ],
          "effect": {
            "id": 889,
            "url": "https://api.seerapi.com/v1/skill_effect_type/889"
          }
        },
        {
          "info": "自身不处于能力提升状态则吸取对手200点体力，若先出手则额外吸取200点体力",
          "analyze_info": "[sprite name=iconHit]自身不处于能力提升状态则[color=#52a5f2]吸取[/color]对手200点体力，若先出手则额外[color=#52a5f2]吸取[/color]200点体力",
          "args": [
            200,
            200
          ],
          "effect": {
            "id": 1613,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1613"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "38d93981"
    },
    "loadedAt": "2026-10-21T23:55:34.169Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1861",
    "data": {
      "id": 1861,
      "args_num": 0,
      "info": "技能无效时，消除对手回合类效果且100%令对手沉默3回合",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconInherent]技能无效时，消除对手[color=#52a5f2]回合类效果[/color]且100%令对手[color=#57c975]沉默[/color]3回合",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28751,
          "url": "https://api.seerapi.com/v1/skill/28751"
        },
        {
          "id": 29328,
          "url": "https://api.seerapi.com/v1/skill/29328"
        },
        {
          "id": 36141,
          "url": "https://api.seerapi.com/v1/skill/36141"
        },
        {
          "id": 36288,
          "url": "https://api.seerapi.com/v1/skill/36288"
        },
        {
          "id": 38060,
          "url": "https://api.seerapi.com/v1/skill/38060"
        }
      ],
      "tag": [
        {
          "id": 30442,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/30442"
        },
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        }
      ],
      "hash": "db7ab820"
    },
    "loadedAt": "2026-10-21T23:55:40.305Z",
    "storage": "refreshed"
  }
]
```


## 4430 极光仙子 — 逐项审核完成，无新增疑问；无待用户确认问题

2026-10-22T00:20:54.555Z。正式队列第202行；17技能/43审核全部完成，唯一原魂印1645/c8d2f54e/eid2031/[200,50,2,1]。API pet4430/6bcd2c30及全部技能、效果类型、属性克制原始URL/hash/参数与原文见research/4430-source-check.json、4430-reviewed-snapshot.json；Wiki精灵rev359785/魂印320182/1177rev349773/1871rev344329补充全文见4430-wiki-source.json。自身所有分支实现与具名成功失败边界交互已完成：回合初严格低体快照、双方最大体力差非负绝对值的0/100/正负500及200威力上限；攻击伤害50%回复按完整结算、过量与保留1HP实际0损失；MISS/免疫0回复但实际用攻未击败仍特攻2，属性与控制未用不触；禁疗/禁强/回复倍率区分。普通1177正级翻倍/封顶和1871低体最大HP差护盾正常实现；1333新束缚28只绑定真实28111/4907d482/索引3/[100,28]，不扩大旧兼容授权。

全部17真实技能已逐招配入正式5槽包含36189第五，完成assess/prepare/初始化、原名ID/版本/初始PP与完整真实执行；验证器另通过真实HTTP本地搜索和加载。源“对方下只出战精灵首次使用的属性技能无效”完整登记多精灵延期，未误施加当前尸体；单精灵完成不等于全部机制完成。

当前正式验收：research/next40-4430-gate-v4.log退出0并passed(single-stage)，各内部子检查真实结果：

```json
[
  {
    "log": "research/next40-4430-gate-v4-child-1.log",
    "tests": 18,
    "passed": 18,
    "exitCode": 0,
    "command": "--test C:\\Users\\villa\\Desktop\\seer-battle-lab\\tests\\deployed-4430.test.cjs",
    "internalValidator": true
  },
  {
    "log": "research/next40-4430-gate-v4-child-2.log",
    "tests": 1,
    "passed": 1,
    "exitCode": 0,
    "command": "--test C:\\Users\\villa\\Desktop\\seer-battle-lab\\tests\\local-integration.test.cjs",
    "internalValidator": true
  },
  {
    "log": "research/next40-4430-gate-v4-child-3.log",
    "tests": 5856,
    "passed": 5856,
    "exitCode": 0,
    "command": "/d /s /c npm test",
    "internalValidator": true
  }
]
```

这次完整npm由验证器内部执行，未另重复一次；自身独立文件16项在完整npm和正式入口导入有重叠，不把重叠当额外语义覆盖。

完整回归曾发现旧4189/37621/c4c59e64/449[100,15]回归，5854/5856的两个失败为同一旧正确断言被重复调用。原因是本轮较早4372增加睡眠8时的新执行守卫误拒原已授权冰封15，而且泛范围[8,27]误接纳坏hash的15。现仅恢复原精确来源的15执行与原精确validate入口，通用仍只8/27，错误hash/索引的旧正确断言完整保留。专项research/4430-449-repair-current-v2.log70/70，当前整库随本次验收通过；证据见4430-full-regression-failure-analysis.json。4189列入后续必要重新认证队列。


## 4432 恶咒巫师·科萨斯 — 全17技能/50项逐项审核及独立工作完成，关联3个既有公共问题

2026-10-22T00:32:29.065Z。research/4432-independent-final-v4.log88/88（自身19、旧3512与4037及公共专项；非完整整库），退出0；未部署、未跑已知不完整正式验证。API pet/soul1647/ca4b444a/eid2033参数[90,180,1,90,1,1]与17技能所有原文、实例、URL/hash在4432-source-check.json、4432-reviewed-snapshot.json；Wiki精灵359783/魂印320184和效果1463/343922、1418/343877、1875/344333、1877/344335全文见4432-wiki-source.json。

已答复用而非新提问：research/DEPLOY-3940-4068-USER-CONFIRMATIONS.json的Q-R3940-4037-001，原问题明确“同效果未来实例复用问题，不重复询问”，原回答“仍按未翻倍结算；基数不变……高于1/2则实际恢复量，低于1/2附加4500”。本1875[4,3,3]逐实例分母/阈值保持真实来源：高体按实际回复，低于自身1/3时恢复翻倍6000、附伤仍未翻倍基数3000，禁疗或90%削减不改低体明确的未翻倍理论基数；高体禁疗则0伤。没有把本来源改成旧[4,2,2]。

全部自身已确定分支实现：首次被攻击命中后对手出手流程末启动全部恢复削减90%，技能/魂印/死亡时技能回复均走公共回复倍率；首次被属性命中后对手流程末180固定且免固才下一次闪避威力低90攻击，威力读原技能字段，严格89/90和必中穿透仍消费、MISS/控制不消费都测。免攻击伤害0仍算实际命中，控制未使用/MISS不触；各首次资格独立。末HP≤初始次回仅属性先制1，HP增加时次回攻击增伤按实际增加点数%至180；同值属于≤，不拿HP比例代替增加值。空护盾与空护罩各按实际损HP发放最多400；有另一类别存量不阻独立空类别发放。

普通1463按明确“先手本回合下次死亡恢复全部体力并解除异常和能力下降”实现一次性死亡时技能回复事件；保留正级、PP和其他效果，没有重置未写明状态；90%倍率/禁疗遵守“所有体力恢复”和技能来源，失败仍消费，负级锁按公共机制。1418、1276的自耗为真实直接HP损失，不冒充真实伤害，1276追加按实际消耗一半粉伤，可双方同归；旧3512正确专项原断言仍通过，旧2995/3512为旧版数据不冒充新认证。普通1586真实四参数[100,1,1,3]完整保留，与公共同名异常最大剩余时间刷新一致；未截成三参。新147害怕6、1187诅咒23、572毒转诅咒23精确绑定本技能/hash/原索引/参数，不扩大旧兼容授权；1187执行守卫也保留其余源旧严格枚举。1877清回合/基础250回复独立，清成功额外固定理论吸取250，禁疗只拦回复；临时粉免若被清除就不再免伤，魂印免固仍免且理论回复不减。

### 关联 Q-N20-4345-001 与 Q-N20-4373-002 — 本1647不可叠加护盾／护罩的已有存量更新（不新建主问题）

完整魂印原文及来源JSON附后。原文明确“护盾、护罩均不可叠加，最高400点”，但未写已有同源/其他来源护盾或护罩如何替换、保留较大值或刷新，普通层的回调/消费如何归属。API格式化省略非叠加与400仅概括，并非否定原始原文；两份均保存，采用原始明示上限与非叠加。

已完成：两个空类别按当前已损体力独立各0至400，某类别已有存量不会阻塞另一空类别发放；所有其他独立魂印和17招均完成。被阻塞：已有存量类别在战阶末应如何处理，本分支记录pendingCorsasNonstack而不猜额外累加或刷新，不把它延期成多精灵；故整只未验收。例当前盾300、本轮额度400，可能需要更新为400或保留原300，决定下回伤害，不能套用另一精灵的非叠加回答。需要在原主问题中明确：本源再次给予非叠加盾/护罩时，已有同源及其他来源存量分别如何更新、共存和归属？

### 关联 Q-N20-4329-006 — 34301暗射残击/456[200]（不新建主问题）

完整原文“若对手体力不足200则直接秒杀”。绑定本技能及hash见后原始记录，当前普通基础攻击与严格阈值条目已审核；秒杀类型和免疫/保命公共交互仍待原主问题，旧true默认不作用户答案，不把未知死亡当多精灵。明确问题沿用原主问题，请一并明确本“直接秒杀”的结算类型与保命交互。

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1647",
    "data": {
      "id": 1647,
      "desc": "每次登场首次被攻击技能命中后，当回合对手出手流程结束时直至自身下场前自身所有体力恢复效果减少90%，且每个战斗阶段结束时为自身附加额度等同于当前已损失体力的护盾和护罩（护盾、护罩均不可叠加，最高400点）；|每次登场首次被属性技能命中后，当回合对手出手流程结束时附加给对手180点固定伤害，若对手免疫固定伤害则自身闪避下1次威力低于90的攻击技能；|战斗阶段结束时，若自身体力不高于回合开始时则下回合属性技能先制+1，若自身体力高于回合开始时则下回合攻击技能造成的伤害提升n%（n=上述体力值之差，上限为180）|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>每次登场首次被攻击技能命中后：\r\n<indent=32><sprite=4><indent=48>自身所有<b>体力恢复效果</b><color=#64F9FA>减少</color>90%直至下场\r\n<indent=32><sprite=4><indent=48>每战斗阶段结束时<color=#64F9FA>获得</color>额度等同于当前已损失体力的<b>护盾</b>和<b>护罩</b>\r\n<indent=16><sprite=3><indent=32>每次登场首次被属性技能命中后：\r\n<indent=32><sprite=4><indent=48><color=#64F9FA>附加</color>180点<b>固定伤害</b>\r\n<indent=32><sprite=4><sprite=4><indent=64>若对手免疫固定伤害则自身<color=#64F9FA>闪避</color>下1次威力低于90的<b>攻击技能</b>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若自身体力不高于回合开始时则下回合属性技能<b>先制</b>+1\r\n<indent=32><sprite=4><indent=48>若自身体力高于回合开始时则下回合造成的<b>攻击伤害</b><color=#64F9FA>提升</color>n%（n=上述体力值之差，上限为180）",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4432,
          "url": "https://api.seerapi.com/v1/pet/4432"
        }
      ],
      "effect": {
        "effect_args": [
          90,
          180,
          1,
          90,
          1,
          1
        ],
        "effect": {
          "id": 2033,
          "url": "https://api.seerapi.com/v1/eid_effect/2033"
        }
      },
      "effect_alias": "alias_2033_90_180_1_90_1_1",
      "tag": [
        {
          "id": 3,
          "url": "https://api.seerapi.com/v1/soulmark_tag/3"
        },
        {
          "id": 17,
          "url": "https://api.seerapi.com/v1/soulmark_tag/17"
        },
        {
          "id": 18,
          "url": "https://api.seerapi.com/v1/soulmark_tag/18"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "ca4b444a"
    },
    "loadedAt": "2026-10-22T00:21:04.355Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/34301",
    "data": {
      "id": 34301,
      "name": "暗射残击",
      "power": 120,
      "max_pp": 10,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 92,
        "url": "https://api.seerapi.com/v1/element_type_combination/92"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若对手体力不足200则直接秒杀",
          "analyze_info": "[sprite name=iconHit]若对手体力不足200则直接[color=#52a5f2]秒杀[/color]（boss有效）",
          "args": [
            200
          ],
          "effect": {
            "id": 456,
            "url": "https://api.seerapi.com/v1/skill_effect_type/456"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "c86c9d1e"
    },
    "cacheFile": "research/4069-source-check.json",
    "loadedAt": "2026-10-19T18:01:08.090Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/456",
    "data": {
      "id": 456,
      "args_num": 1,
      "info": "若对手体力不足{0}则直接秒杀",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若对手体力不足{0}则直接[color=#52a5f2]秒杀[/color]（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 13739,
          "url": "https://api.seerapi.com/v1/skill/13739"
        },
        {
          "id": 13740,
          "url": "https://api.seerapi.com/v1/skill/13740"
        },
        {
          "id": 13741,
          "url": "https://api.seerapi.com/v1/skill/13741"
        },
        {
          "id": 13742,
          "url": "https://api.seerapi.com/v1/skill/13742"
        },
        {
          "id": 13743,
          "url": "https://api.seerapi.com/v1/skill/13743"
        },
        {
          "id": 13841,
          "url": "https://api.seerapi.com/v1/skill/13841"
        },
        {
          "id": 16047,
          "url": "https://api.seerapi.com/v1/skill/16047"
        },
        {
          "id": 16341,
          "url": "https://api.seerapi.com/v1/skill/16341"
        },
        {
          "id": 16407,
          "url": "https://api.seerapi.com/v1/skill/16407"
        },
        {
          "id": 16764,
          "url": "https://api.seerapi.com/v1/skill/16764"
        },
        {
          "id": 17099,
          "url": "https://api.seerapi.com/v1/skill/17099"
        },
        {
          "id": 17174,
          "url": "https://api.seerapi.com/v1/skill/17174"
        },
        {
          "id": 17274,
          "url": "https://api.seerapi.com/v1/skill/17274"
        },
        {
          "id": 17355,
          "url": "https://api.seerapi.com/v1/skill/17355"
        },
        {
          "id": 17475,
          "url": "https://api.seerapi.com/v1/skill/17475"
        },
        {
          "id": 17505,
          "url": "https://api.seerapi.com/v1/skill/17505"
        },
        {
          "id": 17583,
          "url": "https://api.seerapi.com/v1/skill/17583"
        },
        {
          "id": 17635,
          "url": "https://api.seerapi.com/v1/skill/17635"
        },
        {
          "id": 17685,
          "url": "https://api.seerapi.com/v1/skill/17685"
        },
        {
          "id": 17702,
          "url": "https://api.seerapi.com/v1/skill/17702"
        },
        {
          "id": 17761,
          "url": "https://api.seerapi.com/v1/skill/17761"
        },
        {
          "id": 17861,
          "url": "https://api.seerapi.com/v1/skill/17861"
        },
        {
          "id": 17874,
          "url": "https://api.seerapi.com/v1/skill/17874"
        },
        {
          "id": 17890,
          "url": "https://api.seerapi.com/v1/skill/17890"
        },
        {
          "id": 17926,
          "url": "https://api.seerapi.com/v1/skill/17926"
        },
        {
          "id": 17965,
          "url": "https://api.seerapi.com/v1/skill/17965"
        },
        {
          "id": 17979,
          "url": "https://api.seerapi.com/v1/skill/17979"
        },
        {
          "id": 18000,
          "url": "https://api.seerapi.com/v1/skill/18000"
        },
        {
          "id": 18041,
          "url": "https://api.seerapi.com/v1/skill/18041"
        },
        {
          "id": 18117,
          "url": "https://api.seerapi.com/v1/skill/18117"
        },
        {
          "id": 18143,
          "url": "https://api.seerapi.com/v1/skill/18143"
        },
        {
          "id": 18148,
          "url": "https://api.seerapi.com/v1/skill/18148"
        },
        {
          "id": 18251,
          "url": "https://api.seerapi.com/v1/skill/18251"
        },
        {
          "id": 18382,
          "url": "https://api.seerapi.com/v1/skill/18382"
        },
        {
          "id": 19020,
          "url": "https://api.seerapi.com/v1/skill/19020"
        },
        {
          "id": 19062,
          "url": "https://api.seerapi.com/v1/skill/19062"
        },
        {
          "id": 19110,
          "url": "https://api.seerapi.com/v1/skill/19110"
        },
        {
          "id": 19133,
          "url": "https://api.seerapi.com/v1/skill/19133"
        },
        {
          "id": 19198,
          "url": "https://api.seerapi.com/v1/skill/19198"
        },
        {
          "id": 19213,
          "url": "https://api.seerapi.com/v1/skill/19213"
        },
        {
          "id": 19246,
          "url": "https://api.seerapi.com/v1/skill/19246"
        },
        {
          "id": 19272,
          "url": "https://api.seerapi.com/v1/skill/19272"
        },
        {
          "id": 19328,
          "url": "https://api.seerapi.com/v1/skill/19328"
        },
        {
          "id": 19338,
          "url": "https://api.seerapi.com/v1/skill/19338"
        },
        {
          "id": 19348,
          "url": "https://api.seerapi.com/v1/skill/19348"
        },
        {
          "id": 19360,
          "url": "https://api.seerapi.com/v1/skill/19360"
        },
        {
          "id": 19368,
          "url": "https://api.seerapi.com/v1/skill/19368"
        },
        {
          "id": 19416,
          "url": "https://api.seerapi.com/v1/skill/19416"
        },
        {
          "id": 19453,
          "url": "https://api.seerapi.com/v1/skill/19453"
        },
        {
          "id": 19463,
          "url": "https://api.seerapi.com/v1/skill/19463"
        },
        {
          "id": 19467,
          "url": "https://api.seerapi.com/v1/skill/19467"
        },
        {
          "id": 24639,
          "url": "https://api.seerapi.com/v1/skill/24639"
        },
        {
          "id": 30013,
          "url": "https://api.seerapi.com/v1/skill/30013"
        },
        {
          "id": 30016,
          "url": "https://api.seerapi.com/v1/skill/30016"
        },
        {
          "id": 30612,
          "url": "https://api.seerapi.com/v1/skill/30612"
        },
        {
          "id": 30690,
          "url": "https://api.seerapi.com/v1/skill/30690"
        },
        {
          "id": 30747,
          "url": "https://api.seerapi.com/v1/skill/30747"
        },
        {
          "id": 31599,
          "url": "https://api.seerapi.com/v1/skill/31599"
        },
        {
          "id": 31744,
          "url": "https://api.seerapi.com/v1/skill/31744"
        },
        {
          "id": 32156,
          "url": "https://api.seerapi.com/v1/skill/32156"
        },
        {
          "id": 32285,
          "url": "https://api.seerapi.com/v1/skill/32285"
        },
        {
          "id": 32615,
          "url": "https://api.seerapi.com/v1/skill/32615"
        },
        {
          "id": 32750,
          "url": "https://api.seerapi.com/v1/skill/32750"
        },
        {
          "id": 32761,
          "url": "https://api.seerapi.com/v1/skill/32761"
        },
        {
          "id": 32821,
          "url": "https://api.seerapi.com/v1/skill/32821"
        },
        {
          "id": 32903,
          "url": "https://api.seerapi.com/v1/skill/32903"
        },
        {
          "id": 33017,
          "url": "https://api.seerapi.com/v1/skill/33017"
        },
        {
          "id": 33496,
          "url": "https://api.seerapi.com/v1/skill/33496"
        },
        {
          "id": 33787,
          "url": "https://api.seerapi.com/v1/skill/33787"
        },
        {
          "id": 33817,
          "url": "https://api.seerapi.com/v1/skill/33817"
        },
        {
          "id": 33844,
          "url": "https://api.seerapi.com/v1/skill/33844"
        },
        {
          "id": 33871,
          "url": "https://api.seerapi.com/v1/skill/33871"
        },
        {
          "id": 34100,
          "url": "https://api.seerapi.com/v1/skill/34100"
        },
        {
          "id": 34138,
          "url": "https://api.seerapi.com/v1/skill/34138"
        },
        {
          "id": 34197,
          "url": "https://api.seerapi.com/v1/skill/34197"
        },
        {
          "id": 34238,
          "url": "https://api.seerapi.com/v1/skill/34238"
        },
        {
          "id": 34268,
          "url": "https://api.seerapi.com/v1/skill/34268"
        },
        {
          "id": 34301,
          "url": "https://api.seerapi.com/v1/skill/34301"
        },
        {
          "id": 34359,
          "url": "https://api.seerapi.com/v1/skill/34359"
        },
        {
          "id": 34420,
          "url": "https://api.seerapi.com/v1/skill/34420"
        },
        {
          "id": 34448,
          "url": "https://api.seerapi.com/v1/skill/34448"
        },
        {
          "id": 34503,
          "url": "https://api.seerapi.com/v1/skill/34503"
        },
        {
          "id": 34588,
          "url": "https://api.seerapi.com/v1/skill/34588"
        },
        {
          "id": 34620,
          "url": "https://api.seerapi.com/v1/skill/34620"
        },
        {
          "id": 34676,
          "url": "https://api.seerapi.com/v1/skill/34676"
        },
        {
          "id": 34692,
          "url": "https://api.seerapi.com/v1/skill/34692"
        },
        {
          "id": 34711,
          "url": "https://api.seerapi.com/v1/skill/34711"
        },
        {
          "id": 34714,
          "url": "https://api.seerapi.com/v1/skill/34714"
        },
        {
          "id": 34731,
          "url": "https://api.seerapi.com/v1/skill/34731"
        },
        {
          "id": 34808,
          "url": "https://api.seerapi.com/v1/skill/34808"
        },
        {
          "id": 34826,
          "url": "https://api.seerapi.com/v1/skill/34826"
        },
        {
          "id": 34839,
          "url": "https://api.seerapi.com/v1/skill/34839"
        },
        {
          "id": 34949,
          "url": "https://api.seerapi.com/v1/skill/34949"
        },
        {
          "id": 34969,
          "url": "https://api.seerapi.com/v1/skill/34969"
        },
        {
          "id": 35085,
          "url": "https://api.seerapi.com/v1/skill/35085"
        },
        {
          "id": 35092,
          "url": "https://api.seerapi.com/v1/skill/35092"
        },
        {
          "id": 35127,
          "url": "https://api.seerapi.com/v1/skill/35127"
        },
        {
          "id": 35279,
          "url": "https://api.seerapi.com/v1/skill/35279"
        },
        {
          "id": 35436,
          "url": "https://api.seerapi.com/v1/skill/35436"
        },
        {
          "id": 35488,
          "url": "https://api.seerapi.com/v1/skill/35488"
        },
        {
          "id": 35549,
          "url": "https://api.seerapi.com/v1/skill/35549"
        },
        {
          "id": 35998,
          "url": "https://api.seerapi.com/v1/skill/35998"
        },
        {
          "id": 36118,
          "url": "https://api.seerapi.com/v1/skill/36118"
        },
        {
          "id": 36454,
          "url": "https://api.seerapi.com/v1/skill/36454"
        },
        {
          "id": 36645,
          "url": "https://api.seerapi.com/v1/skill/36645"
        },
        {
          "id": 36658,
          "url": "https://api.seerapi.com/v1/skill/36658"
        },
        {
          "id": 37101,
          "url": "https://api.seerapi.com/v1/skill/37101"
        },
        {
          "id": 37460,
          "url": "https://api.seerapi.com/v1/skill/37460"
        },
        {
          "id": 37779,
          "url": "https://api.seerapi.com/v1/skill/37779"
        },
        {
          "id": 38497,
          "url": "https://api.seerapi.com/v1/skill/38497"
        },
        {
          "id": 38511,
          "url": "https://api.seerapi.com/v1/skill/38511"
        }
      ],
      "tag": [
        {
          "id": 29062,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/29062"
        }
      ],
      "hash": "58eeaad1"
    },
    "cacheFile": "research/3652-source-check-external.json",
    "loadedAt": "2026-10-13T14:31:27.317Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1463",
    "data": {
      "id": 1463,
      "args_num": 0,
      "info": "先出手时本回合自身下次死亡时恢复全部体力并解除自身的异常状态和能力下降状态",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]先出手时本回合自身下次死亡时恢复全部体力并解除自身的异常状态和能力下降状态",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 27564,
          "url": "https://api.seerapi.com/v1/skill/27564"
        },
        {
          "id": 28054,
          "url": "https://api.seerapi.com/v1/skill/28054"
        },
        {
          "id": 28957,
          "url": "https://api.seerapi.com/v1/skill/28957"
        },
        {
          "id": 33211,
          "url": "https://api.seerapi.com/v1/skill/33211"
        },
        {
          "id": 35005,
          "url": "https://api.seerapi.com/v1/skill/35005"
        },
        {
          "id": 36196,
          "url": "https://api.seerapi.com/v1/skill/36196"
        },
        {
          "id": 36296,
          "url": "https://api.seerapi.com/v1/skill/36296"
        },
        {
          "id": 37457,
          "url": "https://api.seerapi.com/v1/skill/37457"
        }
      ],
      "tag": [
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        },
        {
          "id": 37134,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/37134"
        },
        {
          "id": 63137,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/63137"
        }
      ],
      "hash": "9f6eec9"
    },
    "loadedAt": "2026-10-22T00:21:37.474Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1875",
    "data": {
      "id": 1875,
      "args_num": 3,
      "info": "{0}回合内每回合使用技能恢复自身最大体力的1/{1}并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/{2}则恢复效果翻倍",
      "info_formatting_adjustment": "{0}回合内每回合使用技能恢复自身最大体力的1/{1}并造成等量百分比伤害\r\n-->恢复体力时<condition>若自身体力低于最大体力的1/{2}</condition>则恢复效果翻倍",
      "analyze_info": "[sprite name=iconHit]{0}回合内每回合使用技能恢复自身最大体力的1/{1}并造成等量[color=#52a5f2]百分比伤害[/color]，恢复体力时若自身体力低于最大体力的1/{2}则恢复效果翻倍",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28117,
          "url": "https://api.seerapi.com/v1/skill/28117"
        },
        {
          "id": 28201,
          "url": "https://api.seerapi.com/v1/skill/28201"
        },
        {
          "id": 28339,
          "url": "https://api.seerapi.com/v1/skill/28339"
        },
        {
          "id": 28425,
          "url": "https://api.seerapi.com/v1/skill/28425"
        },
        {
          "id": 28481,
          "url": "https://api.seerapi.com/v1/skill/28481"
        },
        {
          "id": 28517,
          "url": "https://api.seerapi.com/v1/skill/28517"
        },
        {
          "id": 28547,
          "url": "https://api.seerapi.com/v1/skill/28547"
        },
        {
          "id": 28698,
          "url": "https://api.seerapi.com/v1/skill/28698"
        },
        {
          "id": 28744,
          "url": "https://api.seerapi.com/v1/skill/28744"
        },
        {
          "id": 28792,
          "url": "https://api.seerapi.com/v1/skill/28792"
        },
        {
          "id": 29173,
          "url": "https://api.seerapi.com/v1/skill/29173"
        },
        {
          "id": 29181,
          "url": "https://api.seerapi.com/v1/skill/29181"
        },
        {
          "id": 29274,
          "url": "https://api.seerapi.com/v1/skill/29274"
        },
        {
          "id": 29286,
          "url": "https://api.seerapi.com/v1/skill/29286"
        },
        {
          "id": 29355,
          "url": "https://api.seerapi.com/v1/skill/29355"
        },
        {
          "id": 29436,
          "url": "https://api.seerapi.com/v1/skill/29436"
        },
        {
          "id": 29447,
          "url": "https://api.seerapi.com/v1/skill/29447"
        },
        {
          "id": 29479,
          "url": "https://api.seerapi.com/v1/skill/29479"
        }
      ],
      "tag": [
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        },
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "73de7007"
    },
    "cacheFile": "research/4037-source-check.json",
    "loadedAt": "2026-10-19T11:18:06.799Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1418",
    "data": {
      "id": 1418,
      "args_num": 1,
      "info": "损失自身{0}点体力",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]损失自身{0}点体力（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 32758,
          "url": "https://api.seerapi.com/v1/skill/32758"
        },
        {
          "id": 36198,
          "url": "https://api.seerapi.com/v1/skill/36198"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "54f03826"
    },
    "loadedAt": "2026-10-22T00:22:09.218Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1877",
    "data": {
      "id": 1877,
      "args_num": 2,
      "info": "消除对手回合类效果且恢复自身{0}点体力，消除成功则额外吸取对手{1}点体力",
      "info_formatting_adjustment": "消除对手回合类效果且恢复自身{0}点体力\r\n--><condition>消除成功</condition>则额外吸取对手{1}点体力",
      "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]且恢复自身{0}点体力，消除成功则额外[color=#52a5f2]吸取[/color]对手{1}点体力",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 36199,
          "url": "https://api.seerapi.com/v1/skill/36199"
        },
        {
          "id": 36529,
          "url": "https://api.seerapi.com/v1/skill/36529"
        },
        {
          "id": 36599,
          "url": "https://api.seerapi.com/v1/skill/36599"
        },
        {
          "id": 37109,
          "url": "https://api.seerapi.com/v1/skill/37109"
        },
        {
          "id": 37304,
          "url": "https://api.seerapi.com/v1/skill/37304"
        },
        {
          "id": 38026,
          "url": "https://api.seerapi.com/v1/skill/38026"
        },
        {
          "id": 38380,
          "url": "https://api.seerapi.com/v1/skill/38380"
        }
      ],
      "tag": [
        {
          "id": 30442,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/30442"
        },
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        },
        {
          "id": 35850,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
        }
      ],
      "hash": "329f9433"
    },
    "loadedAt": "2026-10-22T00:22:22.119Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1586",
    "data": {
      "id": 1586,
      "args_num": 4,
      "info": "{0}%令对手{1}，若对手已处于{2}状态则将此状态刷新至{3}回合",
      "info_formatting_adjustment": "{0}%令对手{1}\r\n--><condition>若对手已处于{2}状态</condition>则将此状态刷新至{3}回合",
      "analyze_info": "[sprite name=iconHit]{0}%令对手[color=#57c975]{1}[/color]，若对手已处于[color=#57c975]{2}[/color]状态则将此状态刷新至{3}回合",
      "pve_effective": false,
      "param": [
        {
          "position": 1,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        },
        {
          "position": 2,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 27180,
          "url": "https://api.seerapi.com/v1/skill/27180"
        },
        {
          "id": 28196,
          "url": "https://api.seerapi.com/v1/skill/28196"
        },
        {
          "id": 28444,
          "url": "https://api.seerapi.com/v1/skill/28444"
        },
        {
          "id": 28476,
          "url": "https://api.seerapi.com/v1/skill/28476"
        },
        {
          "id": 34772,
          "url": "https://api.seerapi.com/v1/skill/34772"
        },
        {
          "id": 36149,
          "url": "https://api.seerapi.com/v1/skill/36149"
        },
        {
          "id": 36199,
          "url": "https://api.seerapi.com/v1/skill/36199"
        },
        {
          "id": 36705,
          "url": "https://api.seerapi.com/v1/skill/36705"
        }
      ],
      "tag": [
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        }
      ],
      "hash": "a4d29caa"
    },
    "loadedAt": "2026-10-22T00:22:28.375Z",
    "storage": "refreshed"
  }
]
```

4432审核证据补充：research/4432-independent-complete-v5.log自身20/20退出0，新增456在无免疫共同子域的199/200/201严格阈值、MISS和控制未用真实状态测试；隔离基础伤害只为核对实例条件，不伪装真实技能威力为0或解决未知类型。原19项包含于20，不与先前88重叠累计。代码及来源未变，原公共类型问题仍未答，审核已关联新具名证据。


## 4438 银椋·奥雷莫德 — 全17技能/45项逐项审核与全部独立工作完成，2条新语义问题

2026-10-22T00:43:39.616Z。17自身状态专项+4432当前20/注册与魂印公共专项，research/4438-independent-final-v2.log58/58退出0（中间重叠不累计）。自身召唤的天雷银椋/银雷椋翼是本体自身强化，初始1级、升级最多3和所有在场等级分支均已实现，不登记为多精灵；只有真实下场保留等级/再登场读取完整延期。API1656/223421d8/eid2038/[300,3,300,400,1]与Wiki魂印320193完整原文、skill/effect模板与实例URL/hash保存于4438-source-check.json、4438-reviewed-snapshot.json、4438-wiki-source.json、4438-terms-source.json。正式原第五36234/28e0aee?版本以原始快照为准（此处不另造版本），单技能组无额外授权问题；未答普通技能未部署。

1级按正攻击伤害事件触发低300麻痹/害怕，完全免伤0不触、1HP实际0损失但完整299仍触；2/3级原文明写使用攻击后，按整次使用完整攻击合计低300/400，MISS/结算0仍为已使用而触、控制未使用/属性不触。战阶按当回合造成/受到各自攻击伤害合计高300升级1，上限3；双方各200不相加，粉伤不算，多段180×3与全部伤害值及等级窗口均真实测试。公开界面显示1/3级，未以测试期望替代来源。

公共代码为damageDealt补充真实type元数据，保留完整伤害和实际HP减少，旧5个damageDealt魂印回调均不读取type，未改变原行为；仅新1656借此排除粉伤升级。新1884按对手实际用攻击流程后所有PP减2，MISS算、控制与属性不算、PP保护只拦额外削减不拦自己基础费用；1842使用时比较当前HP350/250固定理论吸取，禁疗/免伤/回复上限遵公共已答。1624按全PVP异常池和免疫不补抽已实现。所有其他确定招式成功失败边界与交互已做。

### Q-N20-4438-001 — 798的“造成的伤害不超过280”包含的类型及多段单位

36229银鸣实例1，798[2,280]，模板hash1f1b026f；完整原文“若对手处于能力提升状态，则对手2回合内造成的伤害不超过280”。源URL/hash和全招见后JSON。API技能和效果类型、Wiki效果798/rev343258、技能36229/rev313793同文，没有伤害类型或多段例子。已查公共伤害/HP损失和已有命中判定及来源，没有此条明确授权。

已完成：仅当对手有正能力时创建可消回合的2回合上限；单段纯攻击实际完整伤害1000被限为280，条件不符不设限。未完成：固定、百分比、真实伤害是否也限制；多段各段上限还是整招攻击合计上限。例固定500若含则280、不含则500；两段各200若逐段则合计400、按整招则最多280。未知非攻击伤害或多段遇到时明确拒绝，不默认不生效或随意选逐段。798正式编译标不完整，不把它注册通过当完成。

明确问题：请明确798上限适用哪些伤害类型，以及多段是各段还是整招合计不超过280（若攻击以外有不同单位，也请说明）。

我的回答：请给上轮列出的关联机制分别标明“每段／整招／整回合”：上限与阈值按整回合累计，概率按整回合抽取，一次免疫／转盾／增伤按整回合消费

### Q-N20-4438-002 — 1458概率封属性未触发后的麻痹施加时点

28135雷裁之心实例2，1458[2,50,100,0]，模板hash1a05177b；完整原文“2回合内每回合50%对手属性技能无效，未触发则100%令对手麻痹”。API技能/模板与Wiki效果1458/rev343917、技能28135/rev306520同文，未说明失败麻痹在对方准备行动、此次属性招已使用后还是哪一结算时点施加；没有可靠补充时序说明，故不编造有来源支持的候选。

已完成：真实2回合状态、全局战斗随机接口50%单回合判定与成功时真实封属性、按普通技能无效规则PP仍支付，控制未实际使用不触；成功与失败判定都有专项，失败只明示待答且整个原输入保留。当前每回合失败麻痹节点未猜，不能称整技能完成，正式1458编译标不完整。其余191反弹、1884实际用攻削PP、1475粉减25及全部独立工作已完成。

具体影响：失败后的麻痹若在准备行动前施加，可能阻止当前行动；若使用后施加则主要影响后续，PP消费与麻痹反弹产生的交互也可能不同。已有“前置未满足不补偿”通则继续保留，不以代码当前行为当用户答案。

明确问题：1458的50%判定及未触发后麻痹具体在何时结算，麻痹是否有机会阻止对手这次属性技能、该次PP是否照常消耗？

我的回答：使用技能后

完整API来源原文/版本/参数/实例证据（本地4438-source-check.json；Wiki补充全文在上述两文件）：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1656",
    "data": {
      "id": 1656,
      "desc": "奥雷莫德在战斗中会召唤天雷银椋助战，每个战斗阶段结束时若当回合自身造成或受到的攻击伤害高于300则天雷银椋升级（天雷银椋初始为1级，最高可升至3级，下场后保留等级，boss无效）|1级天雷银椋：自身受到的攻击伤害低于300则100%令对手麻痹；自身造成的攻击伤害低于300则100%令对手害怕|2级天雷银椋：对手使用攻击技能后，自身受到的攻击伤害低于300则100%令对手麻痹；自身使用攻击技能后，造成的攻击伤害低于300则100%令对手害怕|3级天雷银椋：对手使用攻击技能后，自身受到的攻击伤害低于400则100%令对手麻痹；自身使用攻击技能后，造成的攻击伤害低于400则100%令对手害怕",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身首次登场后开启<color=#FFF779>银雷椋翼</color>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若当回合自身造成或受到的攻击伤害高于300则升级银雷椋翼\r\n\r\n<indent=0><sprite=5><indent=15>银雷椋翼（上限3级，下场保留）：\r\n<indent=16><sprite=6><indent=32>初始为1级，满足特定的条件可以升级\r\n<indent=16><sprite=6><indent=32>根据当前的等级，触发<color=#64F9FA>对应</color>的效果：\r\n<indent=32><sprite=4><indent=48>1级：自身受到的攻击伤害低于300则100%<color=#64F9FA>令对手麻痹</color>；自身造成的攻击伤害低于300则100%<color=#64F9FA>令对手害怕</color>\r\n<indent=32><sprite=4><indent=48>2级：对手使用攻击技能后，自身受到的攻击伤害低于300则100%<color=#64F9FA>令对手麻痹</color>；自身使用攻击技能后，造成的攻击伤害低于300则100%<color=#64F9FA>令对手害怕</color>\r\n<indent=32><sprite=4><indent=48>3级：对手使用攻击技能后，自身受到的攻击伤害低于400则100%<color=#64F9FA>令对手麻痹</color>；自身使用攻击技能后，造成的攻击伤害低于400则100%<color=#64F9FA>令对手害怕</color>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4438,
          "url": "https://api.seerapi.com/v1/pet/4438"
        }
      ],
      "effect": {
        "effect_args": [
          300,
          3,
          300,
          400,
          1
        ],
        "effect": {
          "id": 2038,
          "url": "https://api.seerapi.com/v1/eid_effect/2038"
        }
      },
      "effect_alias": "alias_2038_300_3_300_400_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 11,
          "url": "https://api.seerapi.com/v1/soulmark_tag/11"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "223421d8"
    },
    "loadedAt": "2026-10-22T00:32:38.996Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36229",
    "data": {
      "id": 36229,
      "name": "银鸣",
      "power": 85,
      "max_pp": 10,
      "accuracy": 97,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 104,
        "url": "https://api.seerapi.com/v1/element_type_combination/104"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则下回合自身造成的攻击伤害额外提升100%",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则下回合自身造成的攻击[color=#52a5f2]伤害额外提升[/color]100%（boss有效）",
          "args": [
            100
          ],
          "effect": {
            "id": 913,
            "url": "https://api.seerapi.com/v1/skill_effect_type/913"
          }
        },
        {
          "info": "若对手处于能力提升状态，则对手2回合内造成的伤害不超过280",
          "analyze_info": "[sprite name=iconHit]若对手处于能力提升状态，则对手2回合内造成的伤害不超过280",
          "args": [
            2,
            280
          ],
          "effect": {
            "id": 798,
            "url": "https://api.seerapi.com/v1/skill_effect_type/798"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "c686aa22"
    },
    "loadedAt": "2026-10-22T00:32:51.767Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/798",
    "data": {
      "id": 798,
      "args_num": 2,
      "info": "若对手处于能力提升状态，则对手{0}回合内造成的伤害不超过{1}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若对手处于能力提升状态，则对手{0}回合内造成的伤害不超过{1}",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 17772,
          "url": "https://api.seerapi.com/v1/skill/17772"
        },
        {
          "id": 33362,
          "url": "https://api.seerapi.com/v1/skill/33362"
        },
        {
          "id": 35691,
          "url": "https://api.seerapi.com/v1/skill/35691"
        },
        {
          "id": 36229,
          "url": "https://api.seerapi.com/v1/skill/36229"
        },
        {
          "id": 37618,
          "url": "https://api.seerapi.com/v1/skill/37618"
        }
      ],
      "tag": [
        {
          "id": 64371,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/64371"
        }
      ],
      "hash": "1f1b026f"
    },
    "loadedAt": "2026-10-22T00:32:58.013Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28135",
    "data": {
      "id": 28135,
      "name": "雷裁之心",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹异常状态了；对手使用攻击技能则降低对手PP值；对手使用属性技能会有概率失效，未触发则陷入麻痹；自身受到的固定伤害和百分比伤害开始减少了",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "2回合内若对手使用攻击技能则令对手所有技能PP值-2",
          "analyze_info": "[sprite name=iconHit]2回合内若对手使用攻击技能则令对手所有技能PP值-2",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 1884,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1884"
          }
        },
        {
          "info": "2回合内每回合50%对手属性技能无效，未触发则100%令对手麻痹",
          "analyze_info": "[sprite name=iconHit]2回合内每回合50%对手属性技能无效，[color=#52a5f2]未触发[/color]则100%令对手[color=#57c975]麻痹[/color]",
          "args": [
            2,
            50,
            100,
            0
          ],
          "effect": {
            "id": 1458,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1458"
          }
        },
        {
          "info": "3回合内自身受到的固定伤害和百分比伤害减少25%",
          "analyze_info": "[sprite name=iconHit]3回合内自身受到的[color=#52a5f2]固定伤害[/color]和[color=#52a5f2]百分比伤害[/color]减少25%（boss有效）",
          "args": [
            3,
            25
          ],
          "effect": {
            "id": 1475,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1475"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "326ad86"
    },
    "loadedAt": "2026-10-22T00:33:37.690Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1458",
    "data": {
      "id": 1458,
      "args_num": 4,
      "info": "{0}回合内每回合{1}%对手属性技能无效，未触发则{2}%令对手{3}",
      "info_formatting_adjustment": "{0}回合内每回合{1}%对手属性技能无效\r\n--><condition>未触发</condition>则{2}%令对手{3}",
      "analyze_info": "[sprite name=iconHit]{0}回合内每回合{1}%对手属性技能无效，[color=#52a5f2]未触发[/color]则{2}%令对手[color=#57c975]{3}[/color]",
      "pve_effective": false,
      "param": [
        {
          "position": 3,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 26641,
          "url": "https://api.seerapi.com/v1/skill/26641"
        },
        {
          "id": 27281,
          "url": "https://api.seerapi.com/v1/skill/27281"
        },
        {
          "id": 28135,
          "url": "https://api.seerapi.com/v1/skill/28135"
        },
        {
          "id": 28378,
          "url": "https://api.seerapi.com/v1/skill/28378"
        },
        {
          "id": 29205,
          "url": "https://api.seerapi.com/v1/skill/29205"
        },
        {
          "id": 35363,
          "url": "https://api.seerapi.com/v1/skill/35363"
        },
        {
          "id": 36400,
          "url": "https://api.seerapi.com/v1/skill/36400"
        },
        {
          "id": 36516,
          "url": "https://api.seerapi.com/v1/skill/36516"
        },
        {
          "id": 37407,
          "url": "https://api.seerapi.com/v1/skill/37407"
        }
      ],
      "tag": [
        {
          "id": 44313,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
        },
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        }
      ],
      "hash": "1a05177b"
    },
    "loadedAt": "2026-10-22T00:33:50.543Z",
    "storage": "refreshed"
  }
]
```

4438版本记录勘误：上段36234后的“28e0aee?”是本地记录误写，不是任何实际来源版本，不作为证据。本技能唯一真实API hash为 c5d46030，来源 undefined，以4438-source-check.json对应skill/36234原始返回及快照为证；未改来源、参数、实现或用户回答。


## 4442 眠降·玛缇娜 — 全17技能/43项逐项审核及独立工作完成，2新问题及2既有公共关联

2026-10-22T00:57:20.921Z。research/4442-public-repair-current-v2.log76/76（含当时17自身与旧影响源）；当前research/4442-independent-final-v3.log41/41（18自身+4438的17+公共6），均退出0，有重叠不累计。API魂印1658/2ee7e0e0/eid2042/[2,400,2,8,100,2,40,1]及全部17技能真实URL/hash/有序参数/原文见4442-source-check.json、4442-reviewed-snapshot.json；Wiki魂印320195、精灵359762、相关技能效果原文在4442-wiki-source.json与4442-terms-source.json。未部署且不跑已知缺口正式验收。

已实现：攻击2次起、低含400每实际使用后+2至8，MISS/免伤0仍实际使用而增长，控制与属性不增长；纯攻击整次完整400/402及保留1HP实际0损失均验证；高伤重置2及同额百分比追加不按剩余HP截断。所有低阈值解释共同增长、高阈值共同重置与未知追加额分开记录；跨400的区间不选择连击增长或重置。双防比较共识组较低项+2，回合初等值当轮40%攻击增伤；比较等级口径冲突时记录并明确拒绝攻击而不随便选基数。

1886回合被消除后仅对手下1回合攻击额外减100%，定时/保护清失败/粉伤不受/到期均验证；404双方回满与自身麻痹/睡眠3回合各实例实际执行，控制已施加不取消同技能后续404，双方各自技能禁疗生效，未擅清异常。173睡眠8及547麻痹0/睡眠8只精确绑定本真实技能/hash/原索引/参数，旧兼容授权未扩大。819两真实实例特攻40%和速度40%均不计能力等级，正/零/负级同为72/200；出手时本轮未受正攻击才附加，完全免伤0与保留1HP实际0损失但完整正伤区分，粉伤不冒充攻击；普通足额百分比结算共同回复及禁疗已做，结算不足的回复另提问。934只有“对手下只出场”真实分支完整延期，基础第五及819/1218未一起延期。

公共修复见4442-public-impact.json：输出倍率0先前被基础Math.max1抬成1，现通用倍率0保0，仍保留原来明确特殊最低伤害机制；128/1043生成的技能攻击转治疗原未标技能来源，禁疗未拦，现加入skill元数据并在heal调用传来源，魂印转换保留soul，不机械禁所有转换。旧3883/4321/3763及旧版2987/3000/3170/3481当前专项原断言全通过，3763追加必要重新认证；旧来源与参数、正确断言及验证器均未修改。

### Q-N20-4442-001 — 1658使用后400阈值与100%追加的“造成伤害”统计范围

完整原文及API原始/格式化/hash/8参数附后，Wiki魂印320195同文，没有统计例子。“自身使用攻击技能会连击2次，若使用后造成的伤害不高于400则之后每次使用连击次数+2（上限为8次），若使用后造成的伤害高于400则重置自身连击次数并附加造成伤害100%的百分比伤害”。虽限定使用攻击技能，阈值和追加基数这两处未写“攻击伤害”，不默认为只计攻击，也不把本招附加固/粉/真及被动反弹全部合并作来源答案。

已完成：本次仅有攻击伤害时，全部完整结算合计与100%追加；只有低伤时两统计口径均≤400，下一次连击共识+2；两口径均>400时共同重置2，若基数有差且对手仍活则未知追加只保存pendingMartinaExtra。若攻击360+固定100时，单攻击为360≤400而混合460>400，连击增长/重置和伤害都会不同，仅保存pendingMartinaCounter，不猜。攻击402+固定100时，两解释都重置，但百分比追加可能402或502。HP损失与完整伤害按既有确认分离，问题不涉及是否按剩余HP截断。

明确问题：1658的400判断与100%追加基数分别统计本招攻击段、哪些附加伤害、是否含本体被动或反弹；请明确伤害类型／来源范围，两处是否一致？

我的回答：400是整回合红伤；1658的100%追加基数是当回合造成红伤，2085、1522、2132、1569统计或放大红伤、使用技能后计算，1522不计入正在计算的自身固定附伤；2132和1569仍分别加成本次／下次指定攻击的红伤，在伤害结算时使用倍率，而“使用技能后计算”仅指伤害统计

### Q-N20-4442-002 — 819面板百分比伤害在免疫／抵挡后恢复等量的基数

36251白金摄心枪实例0/1，819[2,40]与[4,40]，模板hash3688ac8b。完整原文分别“出手时本回合若未受到攻击伤害，则附加自身特攻值40%的百分比伤害，并恢复等量体力”“出手时本回合若未受到攻击伤害，则附加自身速度值40%的百分比伤害，并恢复等量体力”。API与Wiki效果819/rev343279、技能36251同文，无免伤/抵挡回复例。已有统一理论回复确认明示的是自身最大HP百分比附伤并回复，以及固定数值吸取；本源为特攻/速度面板比例，不自动扩大该旧确认。面板比例不计能力级的统一确认已完整落实，仅问此处回复口径。

已完成：出手时本轮未受正攻击快照、两个真实面板基数与伤害，完整结算达到理论额时的共同回复，技能禁疗及倍率/上限按公共回复；已有正攻击不触，粉伤不阻，完全免伤0允许条件触发，1HP保命完整正伤则不触。结算不足时伤害已实施，pendingPanel819Heal保留原索引、理论额、完整结算额及问题，不默认0回复为已确认结果。例面板特攻180理论72，目标百分比免疫时完整结算0，理论回复可72而按结算则0；护盾／其他抵挡也可出现不同结算。普通目标剩HP不足时完整伤害继续保留，与实际HP损失区分规则不变。

明确问题：819的等量回复取面板百分比理论数值，还是经过免疫／抵挡等处理后的完整百分比结算伤害（并请明确对既有理论回复确认的适用范围）？

我的回答：理论值

### 关联 Q-N20-4358-001 — 1658自身防御值与特防值比较的等级参与（不建新主问题）

API格式化已经明确回合初比较并给当轮等值40%攻击增伤，时点资料可解决，不再问。尚缺为“防御值／特防值”是否计能力等级；本源是自己两项比较，关联原公共数值比较问题并列明本实例，未把旧4327限定回答扩大。例DEF面板200、SPD300但DEF+2时，裸面板较低DEF而等级修正后较低SPD，强化项和等值条件可能不同。共识组全部真实实现验证，冲突时不猜。请在原主问题一并明确本1658比较是否计能力等级。

### 关联 Q-N20-4354-006 — 36246真实之影/692[2]直接扣除的类型（不建新主问题）

原文“2回合内免疫受到的致命一击伤害并直接扣除对手等量体力”。本源/hash/原索引见后完整JSON。免暴击伤害已实现，普通非暴击仍伤；未知直接扣除只记录pendingCriticalHPReturn，不按旧true默认假装确认，也不擅按另一来源授权改类型。其余948实吸强及麻痹独立完成。明确问题沿用原主问题：本692返还是何种HP处理／伤害类型及与免疫保命交互？

完整API原始版本、原文、参数及来源URL：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1658",
    "data": {
      "id": 1658,
      "desc": "自身使用攻击技能会连击2次，若使用后造成的伤害不高于400则之后每次使用连击次数+2（上限为8次），若使用后造成的伤害高于400则重置自身连击次数并附加造成伤害100%的百分比伤害；|在战斗中令自身防御值和特防值中较低的一项每回合开始时提升2级，若自身防御值和特防值相同则造成的攻击伤害提升40%|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能会<color=#64F9FA>连击</color>2次\r\n<indent=32><sprite=4><indent=48>若使用后造成的伤害不高于400则之后每次使用连击次数+2（上限为8次）\r\n<indent=32><sprite=4><indent=48>若使用后造成的伤害高于400则重置自身连击次数并<color=#64F9FA>附加</color>造成伤害100%的<b>百分比伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身防御值和特防值不同则<b>其中较低的一项</b><color=#64F9FA>提升</color>2级\r\n<indent=32><sprite=4><indent=48>若自身防御值和特防值相同则当回合造成的<b>攻击伤害</b><color=#64F9FA>提升</color>40%</color></b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4442,
          "url": "https://api.seerapi.com/v1/pet/4442"
        }
      ],
      "effect": {
        "effect_args": [
          2,
          400,
          2,
          8,
          100,
          2,
          40,
          1
        ],
        "effect": {
          "id": 2042,
          "url": "https://api.seerapi.com/v1/eid_effect/2042"
        }
      },
      "effect_alias": "alias_2042_2_400_2_8_100_2_40_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 15,
          "url": "https://api.seerapi.com/v1/soulmark_tag/15"
        },
        {
          "id": 12,
          "url": "https://api.seerapi.com/v1/soulmark_tag/12"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "2ee7e0e0"
    },
    "loadedAt": "2026-10-22T00:43:49.471Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36246",
    "data": {
      "id": 36246,
      "name": "真实之影",
      "power": 40,
      "max_pp": 10,
      "accuracy": 97,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 95,
        "url": "https://api.seerapi.com/v1/element_type_combination/95"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "吸取对手能力提升状态，吸取成功则对手麻痹",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态（boss有效），[color=#52a5f2]吸取[/color]成功则对手[color=#57c975]麻痹[/color]",
          "args": [
            0
          ],
          "effect": {
            "id": 948,
            "url": "https://api.seerapi.com/v1/skill_effect_type/948"
          }
        },
        {
          "info": "2回合内免疫受到的致命一击伤害并直接扣除对手等量体力",
          "analyze_info": "[sprite name=iconHit]2回合内免疫受到的[color=#52a5f2]致命一击[/color]伤害并直接扣除对手等量体力",
          "args": [
            2
          ],
          "effect": {
            "id": 692,
            "url": "https://api.seerapi.com/v1/skill_effect_type/692"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "8cc10e83"
    },
    "loadedAt": "2026-10-22T00:44:08.927Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/692",
    "data": {
      "id": 692,
      "args_num": 1,
      "info": "{0}回合内免疫受到的致命一击伤害并直接扣除对手等量体力",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内免疫受到的[color=#57c975]致命一击[/color]伤害并直接扣除对手等量体力",
      "pve_effective": false,
      "param": null,
      "hash": "cd9a528c"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36251",
    "data": {
      "id": 36251,
      "name": "白金摄心枪",
      "power": 80,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 95,
        "url": "https://api.seerapi.com/v1/element_type_combination/95"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "出手时本回合若未受到攻击伤害，则附加自身特攻值40%的百分比伤害，并恢复等量体力",
          "analyze_info": "[sprite name=iconHit]出手时本回合若未受到攻击伤害，则附加自身特攻值40%的[color=#52a5f2]百分比伤害[/color]，并恢复等量体力（boss有效）",
          "args": [
            2,
            40
          ],
          "effect": {
            "id": 819,
            "url": "https://api.seerapi.com/v1/skill_effect_type/819"
          }
        },
        {
          "info": "出手时本回合若未受到攻击伤害，则附加自身速度值40%的百分比伤害，并恢复等量体力",
          "analyze_info": "[sprite name=iconHit]出手时本回合若未受到攻击伤害，则附加自身速度值40%的[color=#52a5f2]百分比伤害[/color]，并恢复等量体力（boss有效）",
          "args": [
            4,
            40
          ],
          "effect": {
            "id": 819,
            "url": "https://api.seerapi.com/v1/skill_effect_type/819"
          }
        },
        {
          "info": "未击败对手则下2回合自身先制+2",
          "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则下2回合自身[color=#52a5f2]先制[/color]+2（boss有效）",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 1218,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1218"
          }
        },
        {
          "info": "击败对手则对手下只出场精灵2回合内先制-2",
          "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则对手下只出场精灵2回合内[color=#52a5f2]先制[/color]-2",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 934,
            "url": "https://api.seerapi.com/v1/skill_effect_type/934"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "a888b27b"
    },
    "loadedAt": "2026-10-22T00:45:07.089Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/819",
    "data": {
      "id": 819,
      "args_num": 2,
      "info": "出手时本回合若未受到攻击伤害，则附加自身{0}值{1}%的百分比伤害，并恢复等量体力",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]出手时本回合若未受到攻击伤害，则附加自身{0}值{1}%的[color=#52a5f2]百分比伤害[/color]，并恢复等量体力（boss有效）",
      "pve_effective": true,
      "param": [
        {
          "position": 0,
          "param": {
            "id": 2,
            "url": "https://api.seerapi.com/v1/skill_effect_param/2"
          }
        }
      ],
      "skill": [
        {
          "id": 17953,
          "url": "https://api.seerapi.com/v1/skill/17953"
        },
        {
          "id": 29125,
          "url": "https://api.seerapi.com/v1/skill/29125"
        },
        {
          "id": 32586,
          "url": "https://api.seerapi.com/v1/skill/32586"
        },
        {
          "id": 33086,
          "url": "https://api.seerapi.com/v1/skill/33086"
        },
        {
          "id": 33864,
          "url": "https://api.seerapi.com/v1/skill/33864"
        },
        {
          "id": 35165,
          "url": "https://api.seerapi.com/v1/skill/35165"
        },
        {
          "id": 35345,
          "url": "https://api.seerapi.com/v1/skill/35345"
        },
        {
          "id": 35697,
          "url": "https://api.seerapi.com/v1/skill/35697"
        },
        {
          "id": 36251,
          "url": "https://api.seerapi.com/v1/skill/36251"
        },
        {
          "id": 36251,
          "url": "https://api.seerapi.com/v1/skill/36251"
        },
        {
          "id": 36905,
          "url": "https://api.seerapi.com/v1/skill/36905"
        },
        {
          "id": 36952,
          "url": "https://api.seerapi.com/v1/skill/36952"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        },
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        }
      ],
      "hash": "3688ac8b"
    },
    "loadedAt": "2026-10-22T00:45:13.438Z",
    "storage": "refreshed"
  }
]
```


### 4422既有确认复核纠正 — 1257不再关联Q-N20-4373-003，原主问题1709不受影响

继续核对旧用户确认时发现research/2026-10-15-drain-rule-correction.json已明确“吸取对手最大体力的1/2”恢复按对手最大HP理论量且与实际伤害脱钩，meaning/scopeNote明确最大体力比例吸取；这包括本1257[3]“吸取对手最大体力的1/3”。此前把本1257误关联到1709“附加伤害并恢复等量”的未答公共问题，关联不成立，现撤销本1257的待问关联。原Q-N20-4373-003绑定1709并非最大HP比例“吸取”，其原文、回答栏、状态全部保留未擅填；不把本纠正当作其新答案。这里复用的是既有已通知用户确认，不是处理本轮未经通知的新填写文本。

1257实现本来已走公共drainPercent理论回复，代码及来源/hash/参数均未改；补足真实低HP/基础攻击先击败/粉免/护罩/技能禁疗/半回复倍率专项，research/4422-existing-confirmation-correction-v6.log24/24退出0（含原23，不与91重复累计）。移除的是本地误列limitations和审核问号，不改原始来源或用户回答。4422仍待另两公共问题，因此继续部分实现/待确认，未伪装正式验收。


## 4444 百罗鬼帝 — 18技能/58项逐项审核、全部独立工作完成

2026-10-22T03:58:46.918Z。当前专项86/86退出0，30自身，完整日志research/4444-independent-final-v9.log；其余为4438和旧3056/3586/3020及公共回归，有重叠不累计。全部真实原文、来源URL、版本hash和实例参数见4444-source-check.json及4444-reviewed-snapshot.json；补充Wiki原文4444-wiki-source.json、4444-terms-source.json，命名定义完整哈希证据4444-ghost-terms-evidence.json。仅API现行2085/ef96b725，不把其他精灵1660误作本体旧版本。未部署，不宣称正式验收通过。

已完成全部无依赖分支：四鬼祰真实不同增益及次回合结束到期/同名刷新、实际双方攻击250各自取得四种；使用后200/201/299/300严格边界，MISS使用与控制未用区分；入场有效附属转4回合诅咒与免疫转换/非附属不转，已知比例减伤忽略不穿免疫、真正死亡被击败效果抑制。基础18技能全部真实PP物特与控制；清回合、反转、保护、禁强、随机全PVP池、理论最大HP吸取及当前HP实际吸取、PP保护、先制、回血禁疗、臣服失败、狂暴、按负能力种类增威力、未KO完整攻击伤害回复，全部具名状态证据见审核注册表。2469零至三种完整第五及独立四种消费回复/PP/四杀，2472当前对手4起未受正结算乘4并封顶、保留1HP实际0但完整正伤不误乘均完成。真正队伍阵亡2473、队伍回血/其他队伍伤害、主动换宠与离场入口按原文完整延期；未知单体语义未延期。

### Q-N20-4444-001 — 入场按第五PP获得／失去鬼祰的种类选择与重复规则

精灵4444，魂印2085/ef96b725/eid2507/[1,0]。API与Wiki均只说明每1PP获得或失去1种鬼祰，没有选择顺序、概率或重复处理说明。完整原文和来源快照附后；查询Wiki命名定义已解决四种各自效果，但不能解决选择。不得自行假定随机、无放回或按固定顺序，也不能因第五4PP就假设必得四种。已实现来源可确定结果：对方PP足以移除全部时为空；自己0PP且原无鬼祰为空；实际攻击条件确定的各具体鬼祰完整工作。有正获得或非全量移除的分支保存pendingGhostEntryChoice并拒绝依赖未知资源的攻击/消费，不编造数量或种类。

明确问题：按第五PP每点获得或失去的鬼祰具体怎样选择；已经持有的种类是否允许重复取得，重复与移除如何处理？

我的回答：按魑魅魍魉的顺序获得和失去；不许重复取得，重复就没影响
鬼祰
鬼祰・魑、鬼祰・魅、鬼祰・魍、鬼祰・魉的总称

鬼祰・魑
直到下回合结束自身造成的攻击伤害翻倍

鬼祰・魅
直到下回合结束自身抵挡对手的攻击

鬼祰・魍
直到下回合结束对手受到的百分比伤害提升 1/4

鬼祰・魉
直到下回合结束自身攻击无视对手伤害限制效果

四杀鬼囹
4 回合内，双方无法主动切换精灵，无法附加异常状态，无法恢复体力，所有技能命中效果失效

### Q-N20-4444-002 — 2469达到四道产生四杀对当前同招后续命中效果的时点

38384第五原索引1/2469[]，原文“消耗自身的鬼祰，每消耗1道自身恢复最大体力的1/4与所有技能1点PP值，达到4道时为双方进入四杀鬼囹”。定义四杀4回合双方不能主动切换、附加异常、回血，所有技能命中效果失效；模板357047完整定义附后。API与补充定义未说明当前技能执行到中途生成四杀，剩余2472固定伤害、1843害怕和820先制是否立即失效还是本招结束才被限制。两种时点会改变本次第五后半的真实状态。已完成0至3道真实完整第五、四道独立节点的真实消费/回复/PP与双方4回合领域、禁HP不禁PP/药剂、禁异常含魂印尝试、保留基本攻击/固有先制/魂印资源。四道完整链在变更前明确拒绝，保留原输入战局，不靠默认顺序猜。

明确问题：38384本次消费四道开启四杀时，本次技能后续2472、1843和820是否立即被四杀禁用，还是从本招结束后生效？

我的回答：从本招结束

### Q-N20-4444-003 — 魂印入场诅咒后“无视对手伤害减少效果”的类型范围

2085同版本同实例，原文见后。API/Wiki未列定额、额外及非攻击减伤的适用清单。已按明确共同范围实现攻击比例减伤无视并测至无减伤基线；完全攻击免疫仍免，不擅穿免。对实际定额/额外及粉/真等非攻击减伤遇到分歧，记录本问题并拒绝计算，未选普通89或无视109等结果；无相关减伤的固定附加仍正常，完整免粉仍免。四种鬼祰定义已有真实来源，不为其再提问题。

明确问题：此处无视伤害减少是否涵盖定额与额外减少，以及固定／百分比／真实伤害的减伤，具体按哪些类别执行？

我的回答：全部涵盖

### 既有公共问题关联（不另建主问题）

Q-N20-4442-001：2085自己与对方“本次攻击造成的技能伤害”分别用于200/300鬼祰阈值，攻击段与全技能伤害同侧时确定授予；跨阈值保存pending，不擅定只计攻击或全部附加。请原主问题同时明确本2085技能伤害所计类型/来源。

Q-N20-4438-001：24701实例1/800[3,2,250]、29345实例1/800[4,2,250]所受伤害250上限类型与多段单位；当前纯单段攻击实际封顶及属性观察时点完成，非攻击/多段未知拒绝，明确鬼魉无视伤害限制仍可正常穿过。

Q-N20-4358-003：29346实例3/1794[2,1,50]技能无效时半HP回血及下一次攻伤减半，已验证明确技能封锁分支和一次消费；MISS是否算无效沿用原公共问题，精确本hash/索引守卫，未扩大旧授权。

完整API原始词条、URL/hash/实例参数：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/2085",
    "data": {
      "id": 2085,
      "desc": "自身登场时，若对手处于异常状态则将对手所处的有效果的附属类异常状态转化为4回合诅咒，若对手不处于异常状态则自身第五技能每有1点PP自身获得1种鬼祰、对手第五技能每有1点PP值自身失去1种鬼祰，然后若对手处于诅咒状态，本次在场自身无视对手伤害减少效果且其无法触发被击败效果|对手使用攻击技能后，若本次攻击造成的技能伤害低于300则自身获得鬼祰·魑，高于200则自身获得鬼祰·魅；自身使用攻击技能后，若本次攻击造成的技能伤害低于300则自身获得鬼祰·魍，高于200则自身获得鬼祰·魉|（boss无效）",
      "desc_formatting_adjustment": null,
      "analyze_desc": "[sprite name=dot4]自身[color=#52a5f2]登场时[/color]，若对手处于异常状态则将对手所处的有效果的附属类异常状态[color=#52a5f2]转化[/color]为4回合[color=#57c975]诅咒[/color]，若对手不处于异常状态则自身第五技能每有1点PP自身获得1种[color=#f35555]鬼祰[/color]、对手第五技能每有1点PP值自身失去1种[color=#f35555]鬼祰[/color]，[color=#52a5f2]然后[/color]若对手处于[color=#57c975]诅咒[/color]状态，本次在场自身无视对手伤害减少效果且其无法触发[color=#57c975]被击败[/color]效果|[sprite name=dot4]对手使用攻击技能后，若本次攻击造成的技能伤害低于300则自身获得[color=#f35555]鬼祰·魑[/color]，高于200则自身获得[color=#f35555]鬼祰·魅[/color]；自身使用攻击技能后，若本次攻击造成的技能伤害低于300则自身获得[color=#f35555]鬼祰·魍[/color]，高于200则自身获得[color=#f35555]鬼祰·魉[/color]",
      "pve_effective": true,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4444,
          "url": "https://api.seerapi.com/v1/pet/4444"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          0
        ],
        "effect": {
          "id": 2507,
          "url": "https://api.seerapi.com/v1/eid_effect/2507"
        }
      },
      "effect_alias": "alias_2507_1_0",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 11,
          "url": "https://api.seerapi.com/v1/soulmark_tag/11"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "ef96b725"
    },
    "loadedAt": "2026-10-22T00:57:31.189Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/24701",
    "data": {
      "id": 24701,
      "name": "暴君降临",
      "power": 0,
      "max_pp": 5,
      "accuracy": 100,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "免疫并反弹异常状态；若对手使用属性技能，则锁定受到的伤害；若受到攻击则自身全属性都提升",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "3回合内若对手使用属性技能，则下2回合自身受到的伤害不超过250",
          "analyze_info": "[sprite name=iconHit]3回合内若对手使用属性技能，则下2回合自身受到的伤害不超过250",
          "args": [
            3,
            2,
            250
          ],
          "effect": {
            "id": 800,
            "url": "https://api.seerapi.com/v1/skill_effect_type/800"
          }
        },
        {
          "info": "3回合内若对手使用攻击技能则使用后令自身全属性+1",
          "analyze_info": "[sprite name=iconHit]3回合内若对手使用攻击技能则使用后令自身[color=#52a5f2]全属性[/color]+1",
          "args": [
            3,
            1
          ],
          "effect": {
            "id": 806,
            "url": "https://api.seerapi.com/v1/skill_effect_type/806"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "327b8005"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/800",
    "data": {
      "id": 800,
      "args_num": 3,
      "info": "{0}回合内若对手使用属性技能，则下{1}回合自身受到的伤害不超过{2}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内若对手使用属性技能，则下{1}回合自身受到的伤害不超过{2}",
      "pve_effective": false,
      "param": null,
      "hash": "897aa499"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/29345",
    "data": {
      "id": 29345,
      "name": "冥灾鬼烙",
      "power": 0,
      "max_pp": 4,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹受到的异常状态了；若对手使用属性技能，则锁定受到的伤害；攻击变得更加犀利了；开始降低对手所有技能PP值并恢复自身所有技能PP值了；先出手则令对手的属性技能开始无效",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "4回合内若对手使用属性技能，则下2回合自身受到的伤害不超过250",
          "analyze_info": "[sprite name=iconHit]4回合内若对手使用属性技能，则下2回合自身受到的伤害不超过250",
          "args": [
            4,
            2,
            250
          ],
          "effect": {
            "id": 800,
            "url": "https://api.seerapi.com/v1/skill_effect_type/800"
          }
        },
        {
          "info": "下3回合，每回合攻击技能造成的伤害不少于250",
          "analyze_info": "[sprite name=iconHit]下3回合，每回合攻击技能造成的伤害不少于250（boss有效）",
          "args": [
            3,
            250
          ],
          "effect": {
            "id": 871,
            "url": "https://api.seerapi.com/v1/skill_effect_type/871"
          }
        },
        {
          "info": "4回合内每回合结束后降低对手所有技能1点PP值并恢复自身所有技能1点PP值",
          "analyze_info": "[sprite name=iconHit]4回合内每[color=#57c975]回合结束后[/color]降低对手所有技能1点PP值并恢复自身所有技能1点PP值",
          "args": [
            4,
            1,
            1
          ],
          "effect": {
            "id": 1655,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1655"
          }
        },
        {
          "info": "先出手时使对手2回合属性技能无效",
          "analyze_info": "[sprite name=iconHit]先出手时使对手2回合属性技能无效",
          "args": [
            2
          ],
          "effect": {
            "id": 1284,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1284"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "d919435b"
    },
    "loadedAt": "2026-10-22T00:57:50.262Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/29346",
    "data": {
      "id": 29346,
      "name": "血海行傀",
      "power": 0,
      "max_pp": 4,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "全属性提升了；开始吸取对手的体力了；开始免疫攻击技能了；出手变得更快了",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "全属性+1，双方处于异常状态时效果翻倍，对手处于时将其解除且对手2回合内无法主动切换精灵，自身处于时将其解除并恢复己方所有精灵自身最大体力的1/4",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，双方处于异常状态时效果翻倍，对手处于时将其解除且对手2回合内无法[color=#52a5f2]主动切换[/color]精灵，自身处于时将其解除并恢复[color=#52a5f2]己方[/color]所有精灵自身最大体力的1/4",
          "args": [
            1,
            2,
            4
          ],
          "effect": {
            "id": 2367,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2367"
          }
        },
        {
          "info": "4回合内每回合吸取对手当前体力的1/4",
          "analyze_info": "[sprite name=iconHit]4回合内每回合[color=#52a5f2]吸取[/color]对手当前体力的1/4",
          "args": [
            4,
            4
          ],
          "effect": {
            "id": 796,
            "url": "https://api.seerapi.com/v1/skill_effect_type/796"
          }
        },
        {
          "info": "4回合内每回合使用技能吸取对手最大体力的1/4，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
          "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/4，[color=#52a5f2]吸取[/color]体力时若自身体力低于最大体力的1/2则[color=#52a5f2]吸取[/color]效果翻倍",
          "args": [
            4,
            4,
            2
          ],
          "effect": {
            "id": 971,
            "url": "https://api.seerapi.com/v1/skill_effect_type/971"
          }
        },
        {
          "info": "技能无效时，恢复自身最大体力的1/2且下1次受到的攻击伤害额外减少50%",
          "analyze_info": "[sprite name=iconInherent]技能无效时，恢复自身最大体力的1/2且下1次受到的攻击[color=#52a5f2]伤害额外减少[/color]50%",
          "args": [
            2,
            1,
            50
          ],
          "effect": {
            "id": 1794,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1794"
          }
        },
        {
          "info": "下2回合令自身所有技能先制+2",
          "analyze_info": "[sprite name=iconHit]下2回合令自身所有[color=#52a5f2]技能先制[/color]+2（boss有效）",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 843,
            "url": "https://api.seerapi.com/v1/skill_effect_type/843"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "a6d06239"
    },
    "loadedAt": "2026-10-22T00:57:56.847Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1794",
    "data": {
      "id": 1794,
      "args_num": 3,
      "info": "技能无效时，恢复自身最大体力的1/2且下1次受到的攻击伤害额外减少50%",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconInherent]技能无效时，恢复自身最大体力的1/2且下1次受到的攻击[color=#52a5f2]伤害额外减少[/color]50%",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 28933,
          "url": "https://api.seerapi.com/v1/skill/28933"
        },
        {
          "id": 29025,
          "url": "https://api.seerapi.com/v1/skill/29025"
        },
        {
          "id": 29213,
          "url": "https://api.seerapi.com/v1/skill/29213"
        },
        {
          "id": 29346,
          "url": "https://api.seerapi.com/v1/skill/29346"
        },
        {
          "id": 29398,
          "url": "https://api.seerapi.com/v1/skill/29398"
        },
        {
          "id": 29447,
          "url": "https://api.seerapi.com/v1/skill/29447"
        },
        {
          "id": 35813,
          "url": "https://api.seerapi.com/v1/skill/35813"
        },
        {
          "id": 36005,
          "url": "https://api.seerapi.com/v1/skill/36005"
        },
        {
          "id": 36304,
          "url": "https://api.seerapi.com/v1/skill/36304"
        },
        {
          "id": 36846,
          "url": "https://api.seerapi.com/v1/skill/36846"
        },
        {
          "id": 37439,
          "url": "https://api.seerapi.com/v1/skill/37439"
        },
        {
          "id": 38144,
          "url": "https://api.seerapi.com/v1/skill/38144"
        },
        {
          "id": 38378,
          "url": "https://api.seerapi.com/v1/skill/38378"
        },
        {
          "id": 38490,
          "url": "https://api.seerapi.com/v1/skill/38490"
        }
      ],
      "tag": [
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        },
        {
          "id": 46009,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/46009"
        }
      ],
      "hash": "8650c556"
    },
    "cacheFile": "research/4037-source-check.json",
    "loadedAt": "2026-10-19T11:18:20.394Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/38384",
    "data": {
      "id": 38384,
      "name": "蔑天行·戾杀",
      "power": 160,
      "max_pp": 4,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 1,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 60,
        "url": "https://api.seerapi.com/v1/element_type_combination/60"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "下2回合若对手先出手，则令对手当回合使用的攻击技能无效",
          "analyze_info": "[sprite name=iconHit]下2回合若对手先出手，则令对手[color=#52a5f2]当回合[/color]使用的攻击技能无效",
          "args": [
            2
          ],
          "effect": {
            "id": 726,
            "url": "https://api.seerapi.com/v1/skill_effect_type/726"
          }
        },
        {
          "info": "消耗自身的鬼祰，每消耗1道自身恢复最大体力的1/4与所有技能1点PP值，达到4道时为双方进入四杀鬼囹",
          "analyze_info": "[sprite name=iconHit]消耗自身的[color=#f35555]鬼祰[/color]，每消耗1道自身恢复最大体力的1/4与所有技能1点PP值，达到4道时为双方进入[color=#f35555]四杀鬼囹[/color]",
          "args": [],
          "effect": {
            "id": 2469,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2469"
          }
        },
        {
          "info": "对对方所有精灵附加4点固定伤害，然后对手每有一只精灵未受到此伤害，本场战斗此伤害额外乘4，最高不超过自身的最大体力",
          "analyze_info": "[sprite name=iconHit]对对方所有精灵附加4点[color=#52a5f2]固定伤害[/color]，然后对手每有一只精灵未受到此伤害，本场战斗此伤害额外乘4，最高不超过自身的最大体力",
          "args": [],
          "effect": {
            "id": 2472,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2472"
          }
        },
        {
          "info": "造成的攻击伤害若高于250则100%令对手害怕",
          "analyze_info": "[sprite name=iconHit]造成的攻击伤害若高于250则100%令对手[color=#57c975]害怕[/color]",
          "args": [
            250,
            100,
            6
          ],
          "effect": {
            "id": 1843,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1843"
          }
        },
        {
          "info": "未击败对手时，下2回合自身技能先制+1",
          "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手时，下2回合自身[color=#52a5f2]技能先制[/color]+1（boss有效）",
          "args": [
            2,
            1
          ],
          "effect": {
            "id": 820,
            "url": "https://api.seerapi.com/v1/skill_effect_type/820"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "861ebb39"
    },
    "loadedAt": "2026-10-22T00:58:28.048Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/2469",
    "data": {
      "id": 2469,
      "args_num": 0,
      "info": "消耗自身的鬼祰，每消耗1道自身恢复最大体力的1/4与所有技能1点PP值，达到4道时为双方进入四杀鬼囹",
      "info_formatting_adjustment": "消耗自身的鬼祰，每消耗1道自身恢复最大体力的1/4与所有技能1点PP值\r\n--><condition>达到4道时</condition>为双方进入四杀鬼囹",
      "analyze_info": "[sprite name=iconHit]消耗自身的[color=#f35555]鬼祰[/color]，每消耗1道自身恢复最大体力的1/4与所有技能1点PP值，达到4道时为双方进入[color=#f35555]四杀鬼囹[/color]",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 38384,
          "url": "https://api.seerapi.com/v1/skill/38384"
        }
      ],
      "tag": [
        {
          "id": 62114,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
        }
      ],
      "hash": "d880af2e"
    },
    "loadedAt": "2026-10-22T00:58:34.281Z",
    "storage": "refreshed"
  }
]
```

补充定义原文及URL/revision/hash/本地路径：

```json
[
  {
    "url": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E6%A8%A1%E6%9D%BF%3A%E6%95%88%E6%9E%9C%E8%AF%B4%E6%98%8E%7C%E6%A8%A1%E5%9D%97%3A%E6%95%88%E6%9E%9C%E8%AF%B4%E6%98%8E%7C%E5%B7%AB%E7%A5%96%E4%B9%8B%E7%9C%B8%7C%E6%95%88%E6%9E%9C%3A2035",
    "loadedAt": "2026-10-21T22:35:26.363Z",
    "title": "模板:效果说明",
    "revision": 357047,
    "fullLocalEvidence": "research/4401-extra-source.json",
    "sha256": "44fbea1579d3259437446d769e61b8bd8e36f5d70068f1c1ee92d76b0615e919",
    "terms": {
      "鬼祰·魑": "|鬼祰·魑=直到下回合结束自身造成的攻击伤害翻倍",
      "鬼祰·魅": "|鬼祰·魅=直到下回合结束自身抵挡对手的攻击",
      "鬼祰·魍": "|鬼祰·魍=直到下回合结束对手受到的百分比伤害提升1/4",
      "鬼祰·魉": "|鬼祰·魉=直到下回合结束自身攻击无视对手伤害限制效果",
      "鬼祰": "|鬼祰=鬼祰·魑、鬼祰·魅、鬼祰·魍、鬼祰·魉的总称",
      "四杀鬼囹": "|四杀鬼囹=4回合内，双方无法主动切换精灵，无法附加异常状态，无法恢复体力，所有技能命中效果失效"
    }
  }
]
```


## 4445 古温婆婆 — 17技能/43项逐项审核，全部独立工作完成，无新增主问题

2026-10-22T04:04:54.069Z。API魂印1660/9c0ed9b6/eid2045/[100,360,100,1]及唯一第五36262/7e835c62；无额外原版强化或伙伴版本。原始API完整原文、hash、有序实例与URL见4445-source-check.json、4445-reviewed-snapshot.json；补充Wiki见4445-wiki-source.json。51/51当前专项退出0，含15自身+4444的30+公共6，日志4445-independent-final-v3.log，不累计重复覆盖。

回合初100%中毒，未触发解除自身异常并360点魂印回复（技能禁疗不误拦）；战阶仍中毒寄生、已解毒或免毒时清回合，保护失败和行动前解除控制真实执行。17基本行为及全部当前技能条款成功/失败/边界/交互已完成：两5实例、57五回用招六分一回复、48真实五回免异常、10两概率实例、544只清烧冻毒；1292严格当前HP低于敌+2且保留原技能固有+2；1777清后无回合才感染27与保护；986先手/1357后手60%；1387来源护盾240消失固定240；1422首次护罩240耗尽回240受技能禁疗；1814每次用招毒失败按确认理论敌maxHP四分一吸取，免伤不减回复；1144随机固定60至360按现有完整结算等量回复，不擅归为“固定吸取”来扩大理论确认；585/191/791/963/1103/1767虚拟防御负级不改真实等级/1056反转成功封属/863后手下轮封攻/1785自己的理论吸取均测试。真实主动切换1702与1785场下队友回血完整延期，不能影响当前分支完成。

### 关联 Q-N20-4373-002 — 28146曲径通幽/1422[240,240]护罩重复授予与消失回调（续原主问题）

原文“获得240点护罩，护罩消失时恢复自身240点体力”。该词条单源初次授予及抵挡到0时240技能回复、禁疗拦回复已实现。重复已有护罩时保留现值并记录pendingBarrierRegrant，未擅按旧代码累加或覆盖；多来源分配与“消失”触发归属沿用原问题，不把4275专属LIFO推广。Wiki效果1422与技能28146同文没有重复/来源分配细则。其余全部独立词条已审核实现测试，未部署/未正式验收，正式游标不动。明确问题沿原主问题：请同时明确本1422护罩重复授予的更新方式、240来源耗尽还是总护罩消失触发，以及多来源／重复授予的回调次数。

不替填答案，请在原主问题回答。原始资料完整实例：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/28146",
    "data": {
      "id": 28146,
      "name": "曲径通幽",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "创造一些护盾和护罩以庇护自身；开始持续令对手陷入中毒状态了",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "获得240点护盾，护盾消失时附加240点固定伤害",
          "analyze_info": "[sprite name=iconHit]获得240点[color=#57c975]护盾[/color]，[color=#57c975]护盾[/color]消失时附加240点[color=#52a5f2]固定伤害[/color]（boss有效）",
          "args": [
            240,
            240
          ],
          "effect": {
            "id": 1387,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1387"
          }
        },
        {
          "info": "获得240点护罩，护罩消失时恢复自身240点体力",
          "analyze_info": "[sprite name=iconHit]获得240点[color=#57c975]护罩[/color]，[color=#57c975]护罩[/color]消失时恢复自身240点体力（boss有效）",
          "args": [
            240,
            240
          ],
          "effect": {
            "id": 1422,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1422"
          }
        },
        {
          "info": "4回合内每回合使用技能100%令对手中毒，未触发则吸取对手最大体力的1/4",
          "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能100%令对手[color=#57c975]中毒[/color]，[color=#52a5f2]未触发[/color]则[color=#52a5f2]吸取[/color]对手最大体力的1/4",
          "args": [
            4,
            100,
            1,
            4
          ],
          "effect": {
            "id": 1814,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1814"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "53b86079"
    },
    "loadedAt": "2026-10-22T04:00:21.047Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1422",
    "data": {
      "id": 1422,
      "args_num": 2,
      "info": "获得{0}点护罩，护罩消失时恢复自身{1}点体力",
      "info_formatting_adjustment": "获得{0}点护罩\r\n--><condition>护罩消失时</condition>恢复自身{1}点体力",
      "analyze_info": "[sprite name=iconHit]获得{0}点[color=#57c975]护罩[/color]，[color=#57c975]护罩[/color]消失时恢复自身{1}点体力（boss有效）",
      "pve_effective": true,
      "param": null,
      "hash": "3f30d2b8"
    },
    "cacheFile": "research/selected-3711-3716-3724-3737-3739-3740-3741-3763-3788-3807.json",
    "storage": "existing-cache"
  }
]
```


## 4450 逐界苍星 — 18技能/53项逐项审核与全部独立工作完成

2026-10-22T04:25:20.636Z。当前91/91退出0（22自身、前两目标及公共24，覆盖重叠不累计），日志4450-independent-final-v6.log。完整API词条/hash/18技能有序实例见4450-source-check.json与4450-reviewed-snapshot.json。API1664/46f1182e/eid2041/[1,3,1,3,1,1,1]，原短desc遗漏的免异消费/末层消回合消强/解析禁选均由同hash格式化字段及Wiki359745核实实现，不忽略。

API组合118查询先后JSON解析错误、ECONNRESET、备用curl SEC_E_NO_CREDENTIALS，具体原始错误已保留，未无限重试。其余资料继续取得；本地BWIKI补充首次TLS断开也保留。web只读回退从真实Wiki精灵4450/rev359745确认机械神秘，证据4450-wiki-web-fallback.json及本地内容SHA256 962934bedb84d03a953ee87318d62520f88f7d800053fadd77b3f1756861ce78，不是伪造API118返回或hash；克制基础关系仍API全表。补充未与API现有字段冲突。

已实现：首次实际用技能命中前解析且当前招继续执行，后续真实合法选择禁选，MISS仍为已使用而控制未用不触；奇点0至3封顶、异免每次消费与末层消回合消强（保护失败不退层）；回合初快照1层禁敌速度正级不改真实级且负级保留/全系本系加成，2层不耗PP但0PP仍不可选/无视护盾不消盾，3层敌先制封3/每技能后非第五各回1；新获得/移除不追改当轮快照，速度/HP共识比较与战阶强化时点均测试。全部基础及890/423/81/513/57/525/1887/1750/781/1471/1463/727/1908/1255/31/656/37/1323/1888/1884/1890/1891/1892/843/881/1289/1893/1895/1896/984/1811独立分支有真实状态成功失败边界交互。1889正常疲惫失败200真伤与明确封锁400真补偿实施，未知MISS保留公共问题。1894无解析/同名300真伤及足额结算等量回复、属性再现后其他PP+1（含已核实域禁回PP）、攻击再现50%组件分别完成；后两是独立组件状态测试，不冒充完整再现链。

### Q-N20-4450-001 — 两个真实第五组合的新增正式接入授权

36302彼空·真理重塑/8458786c和36303彼空·根源重释/9ce8cd45，API36303原is_fifth=true、is_special=true，激活物1724967/f83c73f2“魔盒·苍星之理”明确该技能和4450。已保存真实rawPet、原标记、魂印与第五两组合研究skillVersions；完整实例与全部已知自身分支分别测试。当前正式额外第五白名单尚无本源，未扩大既有兼容授权/修改自动化来绕过。最小方案：审核research/4450-exact-additional-fifth-proposal.json后，精确限定本精灵、魂印1664/hash、两个第五ID/hash/原标记及版本组合接入，不作通配。

明确问题：是否授权按该精确来源方案纳入4450的36302／36303两套第五版本选择；实际使用时是二选一还是还存在来源未写明的共同携带／替换条件？

我的回答：授权

### Q-N20-4450-002 — 1894“再现”的主体范围、原招关系及免伤后等量回复

36303原索引0/1894[]/模板cc388b28，完整API原文附后；技能含固有标识。“再现本次登场所解析的技能（当回合触发的先制修改效果无法再现）”没有进一步定义如何复制基础属性、威力、技能类别、命中、原技能效果时序，以及当前160威力基础攻击是被替换还是另一次攻击。Wiki精灵4450/rev359745与效果说明相同，没有再现例子；本地没有该词的已确认共通规则。不能仅因尚无复制引擎就提问：此处具体未明的是要实现的真实行为范围，复制执行本身将按回答正常实现。

已完成无解析或同名时300真实追加与足额结算300回复；免疫/抵挡造成结算不足时记录pendingReplayFallbackHeal，不把全局“固定吸取”或“自身maxHP百分比附伤回复”扩大为本真伤附加。解析属性后的其他技能PP+1和禁回PP、再现攻击50%增伤分别独立实现并作HP/PP状态测试；完整再现未知分支明确拒绝，未空处理或仅注册宣称完成。原输入战局不被失败过程污染。被阻塞的是完整重放规则以及真伤不足额回复基数，不是其他17招或本招已确定组件。

明确问题：请定义1894再现会复制哪些基础属性与效果、是否替换36303自己的基础攻击及如何执行时序/PP；另请明确无解析/同名300真伤被免疫或减免时等量回复取理论300还是完整结算量？

我的回答：再现所有效果，比如威力先制必中和词条；不替换而是在此基础上增加，先执行再现的效果，再执行该技能的效果，pp依旧是该技能的pp；理论量

### 既有公共问题关联（不新建主问题）

Q-N20-4358-001：1664回合初自身与对手速度值比较参与能力等级的范围，本源与旧4327限定回答不等同。裸面板和等级口径同向时已实现先制1，反向时拒绝不猜；体力高低明确是当前HP，已完成，不重复提问。

Q-N20-4358-003：28166/c78c3497实例1/1889[100,7,200]，明确封属失效时疲惫加400真伤与正常疲惫失败200真伤均实现。MISS是否属于“技能无效”仍关联原问题，无效范围未猜。

来源原文、URL/hash/参数与激活物证据：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1664",
    "data": {
      "id": 1664,
      "desc": "星解：逐界苍星每次登场之后对手首次使用技能时，若对手不存在技能被解析则解析该技能并为自身附加1层未来奇点|星烁：回合开始时，逐界苍星根据自身未来奇点达到的层数依次获得以下效果：|1层：当回合对手的速度能力提升效果失效且自身计算攻击伤害时获得本系加成|2层：当回合对手的护盾效果失效且自身使用技能不会消耗PP值|3层：当回合对手的先制等级最高为3且自身使用技能后第五技能外所有技能恢复1点PP值|星辉：回合开始时，若自身速度值高于对手则当回合自身所有技能先制+1，若自身体力值高于对手则当回合战斗阶段结束时自身全属性+1|星别：自身下场后解放所解析的技能，若为攻击技能则恢复自身1/3的最大体力，死亡下场时改为己方下只出场精灵体力等于最大体力的100%，若为属性技能则恢复自身所有技能1点PP值，死亡下场时改为己方下只出场精灵恢复全部PP值|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>星解：\r\n<indent=16><sprite=3><indent=32>逐界苍星每次登场对手首次使用技能命中前，若对手不存在技能被解析则<color=#64F9FA>解析</color>该技能并为自身<color=#64F9FA>附加</color>1层<color=#FFF779>未来奇点</color>\r\n<indent=32><sprite=4><indent=48>被解析的技能<color=#64F9FA>无法选择</color>直到逐界苍星下场\r\n\r\n<indent=0><sprite=0><indent=16>星烁：\r\n<indent=16><sprite=3><indent=32>未来奇点可以帮助逐界苍星<color=#64F9FA>免疫</color>所受到的<b>异常状态</b>，每次免疫成功后未来奇点移除1层\r\n<indent=32><sprite=4><indent=48>最后1层未来奇点被移除时，<color=#64F9FA>消除</color>对手<b>回合类效果</b>与<b>能力提升状态</b>\r\n<indent=16><sprite=3><indent=32>回合开始时逐界苍星根据自身未来奇点的层数获得累计的效果：\r\n<indent=32><sprite=4><indent=48>1层：当回合对手的<b>速度</b><color=#64F9FA>能力提升效果失效</color>且自身计算攻击伤害时<color=#64F9FA>获得</color><b>本系属性加成</b>\r\n<indent=32><sprite=4><indent=48>2层：当回合对手的<color=#64F9FA>护盾效果失效</color>且自身<color=#64F9FA>使用技能不会消耗PP值</color>\r\n<indent=32><sprite=4><indent=48>3层：当回合对手的<b>先制</b>等级最高为3且自身使用技能后<color=#64F9FA>恢复</color>第五技能外所有技能<b>PP值</b>1点\r\n\r\n<indent=0><sprite=0><indent=16>星辉：\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身<b>速度值</b>高于对手则当回合自身所有技能<b>先制</b>+1\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身<b>体力值</b>高于对手则当回合战斗阶段结束时自身<color=#64F9FA>全属性+1</color>\r\n\r\n<indent=0><sprite=0><indent=16>星别：\r\n<indent=16><sprite=3><indent=32>自身下场后解放所解析的技能\r\n<indent=32><sprite=4><indent=48>若为攻击技能则<color=#64F9FA>恢复</color>自身1/3的最大体力，死亡下场时修改为己方下只出场精灵体力<color=#64F9FA>等于</color>最大体力的100%\r\n<indent=32><sprite=4><indent=48>若为属性技能则<color=#64F9FA>恢复</color>自身所有技能1点PP值，死亡下场时修改为己方下只出场精灵<color=#64F9FA>恢复</color>全部<b>PP值</b>\r\n\r\n<indent=0><sprite=5><indent=15>未来奇点（上限3层，下场保留）：\r\n<indent=16><sprite=6><indent=32>逐界苍星用以触发额外效果的条件",
      "analyze_desc": "[sprite name=dot4]星解：逐界苍星每次[color=#57c975]登场[/color][color=#52a5f2]之后[/color][color=#52a5f2]对手[/color][color=#52a5f2]首次[/color]使用技能时，若[color=#52a5f2]对手[/color]不存在技能被[color=#f35555]解析[/color]则[color=#f35555]解析[/color]该技能并为自身附加1层[color=#f35555]未来奇点[/color]|[sprite name=dot4]星烁：[color=#57c975]回合开始时[/color]，逐界苍星根据自身[color=#f35555]未来奇点[/color][color=#52a5f2]达到[/color]的层数依次获得以下效果：|[sprite name=dot5]1层：[color=#52a5f2]当回合[/color][color=#52a5f2]对手[/color]的速度[color=#52a5f2]能力提升效果失效[/color]且自身计算攻击伤害时获得[color=#52a5f2]本系加成[/color]|[sprite name=dot5]2层：[color=#52a5f2]当回合[/color][color=#52a5f2]对手[/color]的[color=#52a5f2]护盾效果[/color]失效且自身使用技能不会消耗PP值|[sprite name=dot5]3层：[color=#52a5f2]当回合[/color][color=#52a5f2]对手的先制[/color]等级最高为3且自身[color=#57c975]使用技能后[/color]第五技能外所有技能恢复1点PP值|[sprite name=dot4]星辉：[color=#57c975]回合开始时[/color]，若自身速度值高于[color=#52a5f2]对手[/color]则[color=#52a5f2]当回合[/color]自身所有[color=#52a5f2]技能先制[/color]+1，若自身体力值高于[color=#52a5f2]对手[/color]则[color=#52a5f2]当回合[/color][color=#57c975]战斗阶段结束时[/color]自身[color=#52a5f2]全属性[/color]+1|[sprite name=dot4]星别：自身[color=#57c975]下场后[/color]解放所[color=#f35555]解析[/color]的技能，若为攻击技能则恢复自身1/3的最大体力，死亡[color=#57c975]下场时[/color]改为[color=#52a5f2]己方[/color]下只出场精灵体力等于最大体力的100%，若为属性技能则恢复自身所有技能1点PP值，死亡[color=#57c975]下场时[/color]改为[color=#52a5f2]己方[/color]下只出场精灵恢复全部PP值",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4450,
          "url": "https://api.seerapi.com/v1/pet/4450"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          3,
          1,
          3,
          1,
          1,
          1
        ],
        "effect": {
          "id": 2041,
          "url": "https://api.seerapi.com/v1/eid_effect/2041"
        }
      },
      "effect_alias": "alias_2041_1_3_1_3_1_1_1",
      "tag": [
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        },
        {
          "id": 5,
          "url": "https://api.seerapi.com/v1/soulmark_tag/5"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "46f1182e"
    },
    "loadedAt": "2026-10-22T04:05:04.993Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36303",
    "data": {
      "id": 36303,
      "name": "彼空·根源重释",
      "power": 160,
      "max_pp": 1,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "再现了自身解析的技能",
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 118,
        "url": "https://api.seerapi.com/v1/element_type_combination/118"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "再现本次登场所解析的技能（当回合触发的先制修改效果无法再现），若本次登场尚未解析技能或解析的技能与本技能同名，则附加300点真实伤害并恢复等量体力，若再现的技能为攻击技能，则造成的攻击伤害提升50%，若再现的技能为属性技能，则恢复自身所有其他技能1点PP值",
          "analyze_info": "[sprite name=iconInherent]再现本次[color=#57c975]登场[/color]所[color=#f35555]解析[/color]的技能（[color=#52a5f2]当回合[/color]触发的[color=#52a5f2]先制[/color]修改效果无法再现），若本次[color=#57c975]登场[/color]尚未[color=#f35555]解析[/color]技能或[color=#f35555]解析[/color]的技能与本技能同名，则附加300点[color=#52a5f2]真实伤害[/color]并恢复等量体力，若再现的技能为攻击技能，则造成的攻击伤害提升50%，若再现的技能为属性技能，则恢复自身所有其他技能1点PP值",
          "args": [],
          "effect": {
            "id": 1894,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1894"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "9ce8cd45"
    },
    "loadedAt": "2026-10-22T04:12:06.508Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1894",
    "data": {
      "id": 1894,
      "args_num": 0,
      "info": "再现本次登场所解析的技能（当回合触发的先制修改效果无法再现），若本次登场尚未解析技能或解析的技能与本技能同名，则附加300点真实伤害并恢复等量体力，若再现的技能为攻击技能，则造成的攻击伤害提升50%，若再现的技能为属性技能，则恢复自身所有其他技能1点PP值",
      "info_formatting_adjustment": "再现本次登场所解析的技能（当回合触发的先制修改效果无法再现）\r\n--><condition>若本次登场尚未解析技能</condition>或<condition>解析的技能与本技能同名</condition>，则附加300点真实伤害并恢复等量体力\r\n--><condition>若再现的技能为攻击技能</condition>，则造成的攻击伤害提升50%\r\n--><condition>若再现的技能为属性技能</condition>，则恢复自身所有其他技能1点PP值",
      "analyze_info": "[sprite name=iconInherent]再现本次[color=#57c975]登场[/color]所[color=#f35555]解析[/color]的技能（[color=#52a5f2]当回合[/color]触发的[color=#52a5f2]先制[/color]修改效果无法再现），若本次[color=#57c975]登场[/color]尚未[color=#f35555]解析[/color]技能或[color=#f35555]解析[/color]的技能与本技能同名，则附加300点[color=#52a5f2]真实伤害[/color]并恢复等量体力，若再现的技能为攻击技能，则造成的攻击伤害提升50%，若再现的技能为属性技能，则恢复自身所有其他技能1点PP值",
      "pve_effective": false,
      "param": null,
      "skill": [
        {
          "id": 36303,
          "url": "https://api.seerapi.com/v1/skill/36303"
        }
      ],
      "tag": [],
      "hash": "cc388b28"
    },
    "loadedAt": "2026-10-22T04:12:12.605Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_activation_item/1724967",
    "data": {
      "id": 1724967,
      "name": "魔盒·苍星之理",
      "item_number": 1,
      "item": {
        "id": 1724967,
        "url": "https://api.seerapi.com/v1/item/1724967"
      },
      "skill": {
        "id": 36303,
        "url": "https://api.seerapi.com/v1/skill/36303"
      },
      "pet": {
        "id": 4450,
        "url": "https://api.seerapi.com/v1/pet/4450"
      },
      "hash": "f83c73f2"
    },
    "loadedAt": "2026-10-22T04:12:18.711Z",
    "storage": "refreshed"
  }
]
```


## 4452 兔兔警探 — 逐项审核完成，无新增疑问

2026-10-22T04:36:04.238Z。API1679/6d797bbd/eid2065/[300,3,1]、14真实技能与唯一第五36382/4e1210d5原文/版本/有序实例完整保存research/4452-source-check.json、4452-reviewed-snapshot.json。全部34项语义审核无缺失/失效，12状态专项加正式全部14真实ID本地配招/prepare/初始化版本/技能执行、正式HTTP搜索加载及完整npm均由未改动验证器执行，退出0 passed(single-stage)，结果research/next40-4452-gate-v2-result.json及各child日志。无第二阶段分支。

已实现并验证奇数技能使用后固定吸取300、偶数百分比敌maxHP三分一，理论回复面对免疫/HP不足仍独立，伤害类型不混；MISS已使用触发、控制/药剂不触、保留1HP实际0与完整正伤区分；1523消回合成功才固定吸取、1925半maxHP吸取、1924每用回复300之后附实际回复等量固定（满HP溢出、禁疗、50%倍率），532先回血再等量粉伤及1924/532同时发生顺序有真实HP验证；其余全部4/58/52/1062/870/191/47/884/585/843/1022/942/1895/1885原实例逐项覆盖。无资料语义待确认，不以已有代码当来源；普通缺口已正常实现。4452独立验收通过不越过前方4329推进正式连续游标。


## 4454 爵刻·黑沃德 — 17技能/42项逐项审核，全部独立工作完成

2026-10-22T04:52:05.299Z。API1668/38bc5af7/eid2052/[40,100,200,400,1]，唯一第五36313/a15038e3；完整原文、来源URL/hash及实例参数见4454-source-check.json、4454-reviewed-snapshot.json；补充Wiki4454-wiki-source.json。初次魂印请求JSON错误后一次串行重试成功，失败原样保留。当前96/96退出0含18自身，日志4454-independent-final-v5.log，与其他目标/历史覆盖重叠不累计。未正式部署/未验收，正式游标不动。

魂印首次无场下目标n=1的流血1回合及爵刻1枚在正常初始化真实执行；公共entrySelfAilment复用异常attempt、真实55%抗性与等时免异，不仅设置占位状态；抗性成功不影响爵刻。当前已有0/1/6枚上限、技能先制1、实际使用后理论maxHP三分一吸取并耗1、MISS与控制/药剂区分均完成。攻击40%本次攻伤翻倍，未触发一次随机200至400固定吸取，完整使用只判一次且两段共用，两个端点、免伤仍理论回、魂印不被技能禁疗误拦和回复倍率已测。真实场下数量额外贡献、再次入场/离场保留和场下精灵100回复完整延期，未把当前本体n1和资源使用一起延期。

全部其余独立词条真实HP/等级/PP/异常/消费/持续期验证，包括524三回合被对手击败疲惫2，不误当自身50%粉伤死亡；免疫、过期、已有禁止被击败效果守卫；846 30%抽2控制无放回独立2/3时长且免疫不补抽；1908真实50/50自己或对方半maxHP粉伤；1909按来源直接设定HP而非治疗，禁疗不拦，严格前HP高半才回合末再设；1208反转失败不封、962无强翻倍、1842理论250/350吸取、1169异常加伤与回合末解除、1233每实际使用20/30/40/40%理论吸取、双方流血3/594低300/1258高300等全部原实例已测。547流血16、1111沉默30、594害怕6仅精确绑定本真实hash/原索引/参数，未扩大旧兼容授权。

### Q-N20-4454-001 — 公共1111未触发后的增伤何时作用当前攻击（关联4384）

4454诡契·寂/36308/9efcfc0d实例1，1111[100,30,1,150]；模板原文“{0}%令对手{1}，未触发则{2}回合内自身造成的攻击伤害额外提升{3}%”，实例“100%令对手沉默，未触发则1回合内自身造成的攻击伤害额外提升150%”。Wiki技能36308/rev313872、效果1111/rev349195同文，无先后时点或伤害示例。普通“N回合”包含当前回合已有公共时间规则，但该条件是在本次攻击的异常判定后，来源没有明确当前攻击的伤害是否也应获得补偿，不能把旧实现“伤害之后才登记倍率”当成答案。

关联已处理4384真·龙啸归吟/27990/a3704523实例1，1111[100,28,2,100]，原文“100%令对手束缚，未触发则2回合内自身造成的攻击伤害额外提升100%”。两实例同模板主问题合并，4384其余独立工作不回退/不重复开发，但审核和待确认列表追加关联。

已完成：真实沉默/束缚施加、免疫导致未触发、明确倍率2.5/2与持续1/2回合的公共增伤状态组件、MISS/控制不施加，倍率存在时的真实伤害；后续仍在明确窗口内的增伤可正常工作。未知分支记录pending1111DamageTiming，不把1回合登记后没有实际收益当作完整效果，也不擅自追改已结算伤害或改为下回合。例本次本应100攻击且沉默免疫，若补偿作用本次则本次应250；若命中后才生效且不延长，一回合单次使用会无后续收益；若从下回合算又改变结束时点。这些是待澄清的战斗差异，不把其中任何解释编造成来源选项。

明确问题：1111的未触发增伤是否参与触发它的本次攻击伤害计算；若不参与，具体从哪个时点至哪个回合结束生效？请同时覆盖这两个真实实例。

我的回答：不参与；从下回合开始

### 关联 Q-N20-4329-006 — 36311缔灵之触/691[15]秒杀类型

36311/17a1f1a5实例0，原文“命中后15%秒杀对手”。完整真实源在下面JSON，主问题沿原691/36等秒杀类型范围。本实例基础攻击、MISS/控制与15%成功失败判断已实现，触发时只保存pendingInstantKill，不猜true或直接HP归零，不把未发生死亡称成功；所有其他本体分支已完成。明确问题沿原主问题：本691秒杀应是哪种伤害/HP处理类型及免疫保命交互？

完整原始API记录：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/36308",
    "data": {
      "id": 36308,
      "name": "诡契·寂",
      "power": 85,
      "max_pp": 20,
      "accuracy": 97,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 113,
        "url": "https://api.seerapi.com/v1/element_type_combination/113"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手能力提升状态，消除成功则令对手随机1项技能PP值归零",
          "analyze_info": "[sprite name=iconHit]消除对手能力提升状态（boss有效），消除成功则令对手随机1项技能PP值归零",
          "args": [
            1
          ],
          "effect": {
            "id": 805,
            "url": "https://api.seerapi.com/v1/skill_effect_type/805"
          }
        },
        {
          "info": "100%令对手沉默，未触发则1回合内自身造成的攻击伤害额外提升150%",
          "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]沉默[/color]，[color=#52a5f2]未触发[/color]则1回合内自身造成的攻击[color=#52a5f2]伤害额外提升[/color]150%",
          "args": [
            100,
            30,
            1,
            150
          ],
          "effect": {
            "id": 1111,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1111"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "9efcfc0d"
    },
    "loadedAt": "2026-10-22T04:36:32.284Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1111",
    "data": {
      "id": 1111,
      "args_num": 4,
      "info": "{0}%令对手{1}，未触发则{2}回合内自身造成的攻击伤害额外提升{3}%",
      "info_formatting_adjustment": "{0}%令对手{1}\r\n--><condition>未触发</condition>则{2}回合内自身造成的攻击伤害额外提升{3}%",
      "analyze_info": "[sprite name=iconHit]{0}%令对手[color=#57c975]{1}[/color]，[color=#52a5f2]未触发[/color]则{2}回合内自身造成的攻击[color=#52a5f2]伤害额外提升[/color]{3}%",
      "pve_effective": false,
      "param": [
        {
          "position": 1,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 25325,
          "url": "https://api.seerapi.com/v1/skill/25325"
        },
        {
          "id": 26081,
          "url": "https://api.seerapi.com/v1/skill/26081"
        },
        {
          "id": 26838,
          "url": "https://api.seerapi.com/v1/skill/26838"
        },
        {
          "id": 26990,
          "url": "https://api.seerapi.com/v1/skill/26990"
        },
        {
          "id": 27085,
          "url": "https://api.seerapi.com/v1/skill/27085"
        },
        {
          "id": 27868,
          "url": "https://api.seerapi.com/v1/skill/27868"
        },
        {
          "id": 27990,
          "url": "https://api.seerapi.com/v1/skill/27990"
        },
        {
          "id": 29388,
          "url": "https://api.seerapi.com/v1/skill/29388"
        },
        {
          "id": 36308,
          "url": "https://api.seerapi.com/v1/skill/36308"
        },
        {
          "id": 36530,
          "url": "https://api.seerapi.com/v1/skill/36530"
        },
        {
          "id": 36737,
          "url": "https://api.seerapi.com/v1/skill/36737"
        },
        {
          "id": 36750,
          "url": "https://api.seerapi.com/v1/skill/36750"
        },
        {
          "id": 37359,
          "url": "https://api.seerapi.com/v1/skill/37359"
        },
        {
          "id": 37977,
          "url": "https://api.seerapi.com/v1/skill/37977"
        },
        {
          "id": 38079,
          "url": "https://api.seerapi.com/v1/skill/38079"
        },
        {
          "id": 38153,
          "url": "https://api.seerapi.com/v1/skill/38153"
        },
        {
          "id": 38455,
          "url": "https://api.seerapi.com/v1/skill/38455"
        }
      ],
      "tag": [
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        },
        {
          "id": 18673,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/18673"
        }
      ],
      "hash": "fa0e3411"
    },
    "cacheFile": "research/3847-source-check.json",
    "loadedAt": "2026-10-16T08:46:02.579Z",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36311",
    "data": {
      "id": 36311,
      "name": "缔灵之触",
      "power": 140,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 113,
        "url": "https://api.seerapi.com/v1/element_type_combination/113"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "命中后15%秒杀对手",
          "analyze_info": "[sprite name=iconHit]命中后15%[color=#52a5f2]秒杀[/color]对手",
          "args": [
            15
          ],
          "effect": {
            "id": 691,
            "url": "https://api.seerapi.com/v1/skill_effect_type/691"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "17a1f1a5"
    },
    "loadedAt": "2026-10-22T04:37:16.660Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/691",
    "data": {
      "id": 691,
      "args_num": 1,
      "info": "命中后{0}%秒杀对手",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]命中后{0}%[color=#52a5f2]秒杀[/color]对手",
      "pve_effective": false,
      "param": null,
      "hash": "f46dfccf"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  }
]
```


4454本次记录勘误（保留上文历史，不更改用户回答）：Q-N20-4454-001关联4384的27990真实技能名为“双生禁锢”，hash为a3704523；上一段手写的“真·龙啸归吟”名称错误，以本条与完整API原文为准。效果1111、参数[100,28,2,100]、原索引1及具体问题不变。该勘误是来源名称纠正，不是用户回答。


## 4459 恶鬼·图伽 — 17技能/47项逐项审核，全部独立工作完成

2026-10-22T05:15:34.443Z。原API1672/4254ff4c/eid2058/[2,3,1,100,1]及17真实技能/唯一第五36340/9dca4014原文/有序实例/hash完整保存4459-source-check.json、4459-reviewed-snapshot.json。数次不同资源ECONNRESET后串行续接成功，错误保留；不是同一问题无限重试。Wiki原始/版本见4459-wiki-source.json及下列版本清单。当前111/111退出0含17自身，旧1922/768专项71/71、417旧影响源99/99退出0，有重叠不累计。未部署/未正式验收，正式游标保持4329。

已完整实现：回合初异常种数快照，每次实际使用后按种数100固定理论吸取，MISS使用但控制/药剂不触；裁视无异常计0，后续新增不追增；战阶弱化随机2无放回且分别独立2/3回合、限制凝滞与白板魇昧保留、免疫不补抽，衰弱固定3刷新沿已确认特殊规则；都成功无补偿，都失败一次maxHP三分一理论吸取，混合结果留pending。770异常条件正常技能回满与禁疗不同于直接设HP；816下一攻击免伤按完整免疫量返真、一次消费且不顺带免附加固定；9连续90/110/130封顶与中断复位、498概率增幅成功失败、491攻击与固粉真输出四成、1652释放时9.99/10%损失边界增威力、攻特攻速度双方等级变化、417三回攻伤回复、先制/无视正防/KO回PP/1922/1257/768全部真实原实例当前分支完成。1654只有真实对手下只登场首技能附效失效纯延期，当前攻击基础行为未延期。557全部依赖下述待答语义，原文参数保留，不注册空处理器，研究夹具只编译同招已审核191/47。

### Q-N20-4459-001 — 1672战阶随机2弱化异常仅1种施加成功时的未触发补偿

完整原文及来源hash/参数附后，API及Wiki魂印同文。已查既有确认：3667公共Q034明确的是效果1348一成一败不触发清回合；Q-A60-4219-054明确的是1992双异常任意失败即补偿。二者具体来源及效果不同，不能选一个当本1672答案，也不能无授权扩展限定回答。来源本1672未说明混合结果，“战斗阶段结束时随机附加2种弱化类异常状态，未触发则吸取对手最大体力的1/3”。

已完成全部随机池/概率/无放回/时长/免疫不补抽，双成功无补偿、双失败一次理论maxHP三分一吸取，以及回合初计数后的100/种固定吸取。一个免疫次数真实拦第一个异常而另一个成功时，pendingTugaMixedStatuses保存两项实际结果，不默认把未回复当答案。若任一失败即补偿，本例应额外吸取maxHP三分一并按理论量回复；若必须两种都失败，本例不补偿，HP和伤害明显不同。

明确问题：1672随机2弱化异常只有1种成功时，是否也触发本条一次maxHP三分一吸取补偿，还是必须两种都未成功才触发？

我的回答：也触发

### Q-N20-4459-002 — 557“正先制技能时”的判断基准、施加时点与当前动作

28184荒蛮囚笼/96cc2864实例2，557/ee1b4082/[4,100,6]。完整原文“4回合内对手使用正先制的技能时100%令对手害怕”；Wiki效果557/rev343018相同，API全部字段与参数枚举没有额外时点说明。已查Q-A60-4169-094只有1644/特定技能实例确认“整招结束后”；不能擅扩展为本557。

具体缺口：正先制使用技能的判断取技能固有先制，还是本回合包含魂印/技能强化/异常等后的实际行动先制；在对手行动选择、准备使用、命中前还是技能执行后施加害怕；新害怕是否打断本次已选动作，以及PP是否已消耗。例固有0经增益为+1，或固有+1被降成0，会改变是否反制；害怕先于本次行动与仅影响以后会改变本次HP/PP与施加回合。均为来源未说明的实际差异，不把当前引擎某挂钩位置当来源答案。

已完成同招191免反和47免弱的全部当前状态测试、技能基础PP/命中/控制及真实原文保留。557整体仍为单体待确认，不是队伍延期；没有创建只有计时不执行的伪完成规则，不重复跑已知不完整的部署门槛。

明确问题：557按固有先制还是本回合最终行动先制判正值，具体在哪个时点施加害怕，并是否打断本次动作/是否消耗本次PP？

我的回答：最终行动先制；使用技能时，打断，不消耗

### 公共实现纠正与已有目标复核（不是新问题）

1922源明确“对手属性技能命中效果失效”，旧statusBlock错误地整招封锁，现改公共属性命中载荷失效：普通PP使用、真实固有先制/必中和魂印保留，正面测试以实际PP/先制/回复与魂印吸取区分；旧3716/3979错误状态名称断言按原文校正、源文件归档，前置清成功/失败/保护断言保留，未删除正确行为断言。

768异常种数按已确认裁视无异常规则为0，原实际异常扣血/刷新/免疫等不改；旧4216定向通过。

417明确“自身攻击技能造成伤害的100%会恢复自身体力”，按已确认完整伤害与HP损失区分，回复使用已过防御/减免/免疫/护盾的完整攻击结算，而不是未经结算理论量或实际HP减少；免攻0结算不回，1HP保命完整500实际损失0仍回500。只为417状态标明settled-attack基数，旧技能1和其他未标记依实际损失的既有机制不机械切换，实际HP损失0的技能1仍不回。旧3592/3642/3788/3847/4058/4289及旧版2998/3227原专项99/99通过；现代目标必要复验，旧版无现代逐项覆盖者不冒称重新认证。

新增1292/1887的API analyze明确iconInherent先制，现补公共保留beforeOrder，以免命中负载失效误封固有先制；本轮4445/4450当前专项已回归。详情4459-public-impact.json。3979、4216、3592新增必要重新认证，其他受影响现代目标已在队列，不重复添加或用旧日志冒当前通过。

Wiki版本：

```json
[
  {
    "title": "精灵:4459",
    "revision": 359728
  },
  {
    "title": "技能:36340",
    "revision": 313904
  },
  {
    "title": "魂印:1672",
    "revision": 320209
  },
  {
    "title": "效果:557",
    "revision": 343018
  },
  {
    "title": "效果:770",
    "revision": 343230
  },
  {
    "title": "效果:1922",
    "revision": 344380
  }
]
```

完整API原始记录：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1672",
    "data": {
      "id": 1672,
      "desc": "战斗阶段结束时随机附加2种弱化类异常状态，未触发则{吸取}对手最大{体力}的1/3；回合开始时对手每处于1种异常状态则当回合自身使用技能后{吸取}对手100点{体力}（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时随机附加2种弱化类<b>异常状态</b>\r\n<indent=32><sprite=4><indent=48>未触发则<color=#64F9FA>吸取</color>对手最大体力的1/3\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时对手每处于1种异常状态则当回合自身使用技能后<color=#64F9FA>吸取</color>对手100点<b>体力</b>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4459,
          "url": "https://api.seerapi.com/v1/pet/4459"
        }
      ],
      "effect": {
        "effect_args": [
          2,
          3,
          1,
          100,
          1
        ],
        "effect": {
          "id": 2058,
          "url": "https://api.seerapi.com/v1/eid_effect/2058"
        }
      },
      "effect_alias": "alias_2058_2_3_1_100_1",
      "tag": [
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        },
        {
          "id": 15,
          "url": "https://api.seerapi.com/v1/soulmark_tag/15"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "4254ff4c"
    },
    "loadedAt": "2026-10-22T04:52:43.102Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28184",
    "data": {
      "id": 28184,
      "name": "荒蛮囚笼",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "开始免疫并反弹异常状态了；开始免疫能力下降状态了；一定回合内若对手使用先手技能则害怕",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "4回合内免疫并反弹所有受到的异常状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 191,
            "url": "https://api.seerapi.com/v1/skill_effect_type/191"
          }
        },
        {
          "info": "4回合内免疫能力下降状态",
          "analyze_info": "[sprite name=iconHit]4回合内免疫能力下降状态（boss有效）",
          "args": [
            4
          ],
          "effect": {
            "id": 47,
            "url": "https://api.seerapi.com/v1/skill_effect_type/47"
          }
        },
        {
          "info": "4回合内对手使用正先制的技能时100%令对手害怕",
          "analyze_info": "[sprite name=iconHit]4回合内对手使用正[color=#52a5f2]先制[/color]的技能时100%令对手[color=#57c975]害怕[/color]（boss有效）",
          "args": [
            4,
            100,
            6
          ],
          "effect": {
            "id": 557,
            "url": "https://api.seerapi.com/v1/skill_effect_type/557"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "96cc2864"
    },
    "loadedAt": "2026-10-22T04:54:05.610Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/557",
    "data": {
      "id": 557,
      "args_num": 3,
      "info": "{0}回合内对手使用正先制的技能时{1}%令对手{2}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内对手使用正[color=#52a5f2]先制[/color]的技能时{1}%令对手[color=#57c975]{2}[/color]（boss有效）",
      "pve_effective": true,
      "param": [
        {
          "position": 2,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "skill": [
        {
          "id": 17521,
          "url": "https://api.seerapi.com/v1/skill/17521"
        },
        {
          "id": 18149,
          "url": "https://api.seerapi.com/v1/skill/18149"
        },
        {
          "id": 22923,
          "url": "https://api.seerapi.com/v1/skill/22923"
        },
        {
          "id": 26859,
          "url": "https://api.seerapi.com/v1/skill/26859"
        },
        {
          "id": 27265,
          "url": "https://api.seerapi.com/v1/skill/27265"
        },
        {
          "id": 27542,
          "url": "https://api.seerapi.com/v1/skill/27542"
        },
        {
          "id": 27546,
          "url": "https://api.seerapi.com/v1/skill/27546"
        },
        {
          "id": 27737,
          "url": "https://api.seerapi.com/v1/skill/27737"
        },
        {
          "id": 27759,
          "url": "https://api.seerapi.com/v1/skill/27759"
        },
        {
          "id": 27878,
          "url": "https://api.seerapi.com/v1/skill/27878"
        },
        {
          "id": 28184,
          "url": "https://api.seerapi.com/v1/skill/28184"
        },
        {
          "id": 28592,
          "url": "https://api.seerapi.com/v1/skill/28592"
        },
        {
          "id": 28794,
          "url": "https://api.seerapi.com/v1/skill/28794"
        },
        {
          "id": 36758,
          "url": "https://api.seerapi.com/v1/skill/36758"
        },
        {
          "id": 37427,
          "url": "https://api.seerapi.com/v1/skill/37427"
        }
      ],
      "tag": [
        {
          "id": 813,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
        }
      ],
      "hash": "ee1b4082"
    },
    "loadedAt": "2026-10-22T04:54:30.849Z",
    "storage": "refreshed"
  }
]
```


## 4467 冥契·格斯塔丝：17技能/50项逐项审核，独立工作完成

2026-10-22T05:26:55.116Z。原始API URL/hash/参数/词条见4467-source-check.json，Wiki精灵359713、魂印320214、第五313941、766/348862、1559/344018、1875/344333，完整原始见4467-wiki-source.json。源1677/bdb1b98d/eid2063/[1,100,100,4,1,2,1]，当前回合结束未KO次回攻击必暴/KO攻击先制1；真实敌切换后触发PP及全队回复、两条场下最低体力首位回复独立登记延期。698仅真实后继束缚纯延期，当前第五攻击与1628自己KO回满/PP重置/每次增威50均已实现。当前86/86退出0含15自身；未部署未正式验收。

全部无需答案部分：766清强成功2回攻击最多300、非攻击固定400不受限，保护/无强失败不授予；687害怕完整攻击500/实际HP损失0仍回500、免伤0不回与禁疗、裁视无异常；1875按已确认未来复用Q-R3940-4037-001，阈值1/2/分母3保持本源，低体回复双而附伤未翻倍理论，高体按实际回复；1695满体粉伤三分一/非满实际回复等量；1828实际消除剩余盾罩量；966害怕/失败全强、907反转弱化成功随机2PP归零、1559正常使用后4回免消费但0PP不能用、1283/776/834/843与三种无视和1443连续威力上限全部当前真实状态。

关联公共Q-N20-4438-001：36372伶仃孤月/d6a883ae/i0，766/51b97af8/[2,300]明确只限攻击，固粉真不纳入上限；多段逐段或整招累计单位资料未给，原公共问题补充本实例，不新建重复主问题。

### Q-N20-4467-001 — 834“能力提升被消除或吸取”是否包含纯反转

28203遗歌彻夜/e37ebbe/i3，834[4,2]完整原文“4回合内自身能力提升状态被消除或吸取时，2回合内对手属性技能无效”。完整源hash与URL附后。API/Wiki没有说明强化被143等直接反转为弱化是否也视为本条消除。已有Q-A60-4163-038解释一明确原问题“仅限定这两个魂印的词条，不扩大成全局反转规则”，覆盖1389/1690，不是834答案。旧公共代码内部先清强不能当来源；当前已对本真实来源设置反转待确认防护，正常清除/吸取反制正常完成。

差异：若反转算消除，则触发对方接下来2回属性技能封锁；若只是反转不算，则只有己方等级改变，不封锁对方。已完成本招其他4效果、834正常清除/吸取与无正等级/控制未用、持续时间和真实PP/技能效果封锁；仅纯反转交互待答，不影响下一只独立开发。

明确问题：本834被强化反转为弱化时，是否也触发2回合对手属性技能无效？

我的回答：不触发

完整来源记录（未改写原文）：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1677",
    "data": {
      "id": 1677,
      "desc": "每次对手主动切换下场则对方下只精灵出战时自身恢复所有技能1点PP值，若自身所有技能PP值均为满则恢复己方所有精灵100点体力；|回合结束后若自身未击败对手则下回合攻击技能100%打出致命一击并为场下体力最低的首位精灵恢复1/4的最大体力，若自身击败对手则下回合攻击技能先制+1并为场下体力最低的首位精灵恢复1/2的最大体力|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>每次对手主动切换下场则对方下只精灵出战时自身<color=#64F9FA>恢复</color>所有技能1点<b>PP值</b>\r\n<indent=32><sprite=4><indent=48>若自身所有技能PP值均为满则<color=#64F9FA>恢复</color>己方所有精灵100点<b>体力</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>若自身未击败对手则下回合攻击技能100%<color=#64F9FA>打出致命一击</color>并为场下体力最低的精灵<color=#64F9FA>恢复</color>1/4的最大体力\r\n<indent=16><sprite=3><indent=32>若自身击败对手则下回合攻击技能先制+1并为场下体力最低的精灵<color=#64F9FA>恢复</color>1/2的最大体力",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4467,
          "url": "https://api.seerapi.com/v1/pet/4467"
        }
      ],
      "effect": {
        "effect_args": [
          1,
          100,
          100,
          4,
          1,
          2,
          1
        ],
        "effect": {
          "id": 2063,
          "url": "https://api.seerapi.com/v1/eid_effect/2063"
        }
      },
      "effect_alias": "alias_2063_1_100_100_4_1_2_1",
      "tag": [
        {
          "id": 5,
          "url": "https://api.seerapi.com/v1/soulmark_tag/5"
        },
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 10,
          "url": "https://api.seerapi.com/v1/soulmark_tag/10"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "bdb1b98d"
    },
    "loadedAt": "2026-10-22T05:16:31.219Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36372",
    "data": {
      "id": 36372,
      "name": "伶仃孤月",
      "power": 90,
      "max_pp": 20,
      "accuracy": 97,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 99,
        "url": "https://api.seerapi.com/v1/element_type_combination/99"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手能力提升状态，消除成功则2回合内对手造成的攻击伤害不超过300点",
          "analyze_info": "[sprite name=iconHit]消除对手能力提升状态，消除成功则2回合内对手造成的攻击伤害不超过300点（boss有效）",
          "args": [
            2,
            300
          ],
          "effect": {
            "id": 766,
            "url": "https://api.seerapi.com/v1/skill_effect_type/766"
          }
        },
        {
          "info": "若当前HP低于对手，则技能威力翻倍",
          "analyze_info": "[sprite name=iconHit]若当前HP低于对手，则技能[color=#52a5f2]威力[/color]翻倍（boss有效）",
          "args": [],
          "effect": {
            "id": 132,
            "url": "https://api.seerapi.com/v1/skill_effect_type/132"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "d6a883ae"
    },
    "loadedAt": "2026-10-22T05:16:37.258Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/766",
    "data": {
      "id": 766,
      "args_num": 2,
      "info": "消除对手能力提升状态，消除成功则{0}回合内对手造成的攻击伤害不超过{1}点",
      "info_formatting_adjustment": "消除对手能力提升状态\r\n--><condition>消除成功</condition>则{0}回合内对手造成的攻击伤害不超过{1}点",
      "analyze_info": "[sprite name=iconHit]消除对手能力提升状态，消除成功则{0}回合内对手造成的攻击伤害不超过{1}点（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 17357,
          "url": "https://api.seerapi.com/v1/skill/17357"
        },
        {
          "id": 30591,
          "url": "https://api.seerapi.com/v1/skill/30591"
        },
        {
          "id": 30996,
          "url": "https://api.seerapi.com/v1/skill/30996"
        },
        {
          "id": 31893,
          "url": "https://api.seerapi.com/v1/skill/31893"
        },
        {
          "id": 32143,
          "url": "https://api.seerapi.com/v1/skill/32143"
        },
        {
          "id": 32234,
          "url": "https://api.seerapi.com/v1/skill/32234"
        },
        {
          "id": 32836,
          "url": "https://api.seerapi.com/v1/skill/32836"
        },
        {
          "id": 33062,
          "url": "https://api.seerapi.com/v1/skill/33062"
        },
        {
          "id": 33186,
          "url": "https://api.seerapi.com/v1/skill/33186"
        },
        {
          "id": 33429,
          "url": "https://api.seerapi.com/v1/skill/33429"
        },
        {
          "id": 33529,
          "url": "https://api.seerapi.com/v1/skill/33529"
        },
        {
          "id": 33638,
          "url": "https://api.seerapi.com/v1/skill/33638"
        },
        {
          "id": 33660,
          "url": "https://api.seerapi.com/v1/skill/33660"
        },
        {
          "id": 33846,
          "url": "https://api.seerapi.com/v1/skill/33846"
        },
        {
          "id": 33913,
          "url": "https://api.seerapi.com/v1/skill/33913"
        },
        {
          "id": 34354,
          "url": "https://api.seerapi.com/v1/skill/34354"
        },
        {
          "id": 34458,
          "url": "https://api.seerapi.com/v1/skill/34458"
        },
        {
          "id": 34679,
          "url": "https://api.seerapi.com/v1/skill/34679"
        },
        {
          "id": 35715,
          "url": "https://api.seerapi.com/v1/skill/35715"
        },
        {
          "id": 35855,
          "url": "https://api.seerapi.com/v1/skill/35855"
        },
        {
          "id": 35911,
          "url": "https://api.seerapi.com/v1/skill/35911"
        },
        {
          "id": 36368,
          "url": "https://api.seerapi.com/v1/skill/36368"
        },
        {
          "id": 36372,
          "url": "https://api.seerapi.com/v1/skill/36372"
        },
        {
          "id": 36836,
          "url": "https://api.seerapi.com/v1/skill/36836"
        },
        {
          "id": 37213,
          "url": "https://api.seerapi.com/v1/skill/37213"
        },
        {
          "id": 37427,
          "url": "https://api.seerapi.com/v1/skill/37427"
        },
        {
          "id": 37485,
          "url": "https://api.seerapi.com/v1/skill/37485"
        },
        {
          "id": 37919,
          "url": "https://api.seerapi.com/v1/skill/37919"
        },
        {
          "id": 37931,
          "url": "https://api.seerapi.com/v1/skill/37931"
        },
        {
          "id": 38158,
          "url": "https://api.seerapi.com/v1/skill/38158"
        },
        {
          "id": 38164,
          "url": "https://api.seerapi.com/v1/skill/38164"
        },
        {
          "id": 38166,
          "url": "https://api.seerapi.com/v1/skill/38166"
        },
        {
          "id": 38181,
          "url": "https://api.seerapi.com/v1/skill/38181"
        },
        {
          "id": 38309,
          "url": "https://api.seerapi.com/v1/skill/38309"
        },
        {
          "id": 38346,
          "url": "https://api.seerapi.com/v1/skill/38346"
        },
        {
          "id": 38417,
          "url": "https://api.seerapi.com/v1/skill/38417"
        }
      ],
      "tag": [
        {
          "id": 63508,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/63508"
        },
        {
          "id": 64371,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/64371"
        }
      ],
      "hash": "51b97af8"
    },
    "loadedAt": "2026-10-22T05:16:43.243Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/28203",
    "data": {
      "id": 28203,
      "name": "遗歌彻夜",
      "power": 0,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": null,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": "全属性都提升了；攻击变得更加犀利了；一定回合内自身释放技能不再消耗PP值；一定回合内若自身能力强化状态消失则对手无法使用属性技能；出手变得更快了",
      "category": {
        "id": 4,
        "url": "https://api.seerapi.com/v1/skill_category/4"
      },
      "type": {
        "id": 8,
        "url": "https://api.seerapi.com/v1/element_type_combination/8"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "全属性+1，先出手时自身强化效果翻倍",
          "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，先出手时自身强化效果翻倍（boss有效）",
          "args": [
            1
          ],
          "effect": {
            "id": 1283,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1283"
          }
        },
        {
          "info": "下2回合自身造成的攻击伤害翻倍",
          "analyze_info": "[sprite name=iconHit]下2回合自身造成的攻击伤害翻倍（boss有效）",
          "args": [
            2
          ],
          "effect": {
            "id": 776,
            "url": "https://api.seerapi.com/v1/skill_effect_type/776"
          }
        },
        {
          "info": "4回合内自身释放技能100%不消耗PP值",
          "analyze_info": "[sprite name=iconHit]4回合内自身释放技能100%不消耗PP值",
          "args": [
            4,
            100
          ],
          "effect": {
            "id": 1559,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1559"
          }
        },
        {
          "info": "4回合内自身能力提升状态被消除或吸取时，2回合内对手属性技能无效",
          "analyze_info": "[sprite name=iconHit]4回合内自身能力提升状态被消除或[color=#52a5f2]吸取[/color]时，2回合内对手属性技能无效",
          "args": [
            4,
            2
          ],
          "effect": {
            "id": 834,
            "url": "https://api.seerapi.com/v1/skill_effect_type/834"
          }
        },
        {
          "info": "下2回合令自身所有技能先制+2",
          "analyze_info": "[sprite name=iconHit]下2回合令自身所有[color=#52a5f2]技能先制[/color]+2（boss有效）",
          "args": [
            2,
            2
          ],
          "effect": {
            "id": 843,
            "url": "https://api.seerapi.com/v1/skill_effect_type/843"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "e37ebbe"
    },
    "loadedAt": "2026-10-22T05:17:21.583Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/834",
    "data": {
      "id": 834,
      "args_num": 2,
      "info": "{0}回合内自身能力提升状态被消除或吸取时，{1}回合内对手属性技能无效",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内自身能力提升状态被消除或[color=#52a5f2]吸取[/color]时，{1}回合内对手属性技能无效",
      "pve_effective": false,
      "param": null,
      "hash": "90c81cf0"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  }
]
```

4467验证补充：4467-independent-final-v4.log87/87含16自身退出0，补760实际微弱转普通、828正级/无正级行动顺序、776真实两倍及1559到期恢复PP消费；与先前86重复不累计。无新用户答案。


## 4468 始皇帝·嬴政：17技能/49项逐项审核，全部独立工作完成

2026-10-22T05:41:45.156Z。API原始URL/hash/参数/格式化完整见4468-source-check.json及4468-reviewed-snapshot.json，额外eid2057/c5dd58c0只给args_num6没有语义补充，保存4468-extra-source.json。Wiki精灵359709、魂印320215、36392/313956、36384/313948、36391/313955、效果35/342694、1767/344225、1906/344364完整记录分别4468-wiki-source.json和4468-wiki-formula-source.json。网络补充检索https://wiki.biligame.com/seer/技能:36384亦只有同文，未补公式。当前90/90含19自身退出0，入场公共入口旧专项33/33与90有重叠；未正式部署/验收。

已完成：入场2玺及正常初始化臣服100%通过异常入口2/3回、天生免臣服；0–6玺快照、1层11%每玺攻击加成、2层每玺37固定/实际使用含MISS不含控制未用、3层221魂印回复及0PP回1共同分支、4层只免控制、5层敌最终先制不高于自身、6层君临每次在场一次6回必暴必中/攻击使用后221真/期满PP0直接降HP1。真实切换/再登场额外资源、主动换宠限制分别延期。技能全部无需答案词条包括双方回合清除不能短路、双方正负等级清除、下一次双倍/百分比计次、真实等级视转换、冻结资源7回/KO和期满直接代价，均状态验证。1767实际多余参数原样保留，没有私改源或正式兼容，通用1767[]核心以真实防御等级和HP验证仅作独立核心证据。

### Q-N20-4468-001 — 三玺PP恢复API内部冲突

1678/7b65acca/eid2057/[11,37,221,1,221,1]。完整原词条：自身免疫臣服且首次登场时100%令对手臣服|自身每次登场时获得2方永昌玺，若登场上回合对方进行了主动切换则额外获得2方永昌玺|战斗阶段结束时，若当回合对手使用了技能则消耗1方永昌玺，若当回合对手未使用技能则获得1方永昌玺|每回合开始时根据自身永昌玺达到的方数依次获得以下效果|1方：每拥有1方永昌玺，则当回合造成的攻击伤害提升11%|2方：每拥有1方永昌玺，则当回合使用攻击技能后附加37点固定伤害|3方：当回合战斗阶段结束时自身恢复221点体力且所有技能PP值恢复至1|4方：当回合免疫受到的控制类异常状态|5方：当回合令对手的先制等级无法高于自身|6方：下回合令对手无法主动切换精灵|（boss无效）

同API格式化详文原句“3方：战斗阶段结束时恢复自身221点体力和所有PP值为0的技能1点PP值”；上面原始desc则说“所有技能PP值恢复至1”。Wiki魂印320215支持仅0回1，但API自身两个字段冲突仍须确认，不能拿Wiki覆盖API。0PP→1两者一致且已完成；当前PP5的技能若全部设1会变1，若仅0回1则保留5，差异影响后续可用次数。正PP分支写pendingEmperorPPRestore，不猜。

明确问题：三玺战阶恢复PP应只把0PP技能恢复到1，还是把所有技能PP都改为1？

来源证据：

```json
{
  "url": "https://api.seerapi.com/v1/soulmark/1678",
  "revision": "7b65acca",
  "path": "research/4468-source-check.json",
  "formatted": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>天生<color=#64F9FA>免疫</color>臣服异常状态\r\n\r\n<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>首次登场时100%<color=#64F9FA>令对手臣服</color>\r\n<indent=16><sprite=3><indent=32>每次登场时获得2方<color=#FFF779>永昌玺</color>\r\n<indent=32><sprite=4><indent=48>若登场上回合对方选择主动切换精灵则额外获得2方永昌玺\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若当回合对手使用了技能则失去1方永昌玺\r\n<indent=32><sprite=4><indent=48>若当回合对手未使用技能则获得1方永昌玺\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>根据当前持有的永昌玺数量，当回合自身获得累计的效果：\r\n<indent=32><sprite=4><sprite=4><indent=64>1方：每持有1方永昌玺，则自身造成的<b>攻击伤害</b><color=#64F9FA>提升</color>11%\r\n<indent=32><sprite=4><sprite=4><indent=64>2方：每持有1方永昌玺，则自身使用攻击技能后<color=#64F9FA>附加</color>37点<b>固定伤害</b>\r\n<indent=32><sprite=4><sprite=4><indent=64>3方：战斗阶段结束时<color=#64F9FA>恢复</color>自身221点<b>体力</b>和所有PP值为0的技能1点<b>PP值</b>\r\n<indent=32><sprite=4><sprite=4><indent=64>4方：<color=#64F9FA>免疫</color>受到的<b>控制类异常状态</b>\r\n<indent=32><sprite=4><sprite=4><indent=64>5方：对手的先制等级无法高于自身\r\n<indent=32><sprite=4><sprite=4><indent=64>6方：下回合对手<color=#64F9FA>无法主动切换精灵</color>\r\n<indent=32><sprite=4><indent=48>若自身当前持有6方永昌玺，则自身触发君临天下（每次在场限1次）\r\n\r\n<indent=0><sprite=5><indent=15>永昌玺（上限6方）：\r\n<indent=16><sprite=6><indent=32>嬴政用以触发部分效果的条件\r\n<indent=16><sprite=6><indent=32>击败对手后清空\r\n\r\n<indent=0><sprite=5><indent=15>君临天下：\r\n<indent=16><sprite=6><indent=32>6回合内自身所有攻击技能<color=#64F9FA>必定致命、必定命中</color>，且使用后将额外<color=#64F9FA>附加</color>221点<b>真实伤害</b>\r\n<indent=16><sprite=6><indent=32>效果结束后：\r\n<indent=32><sprite=4><indent=48>清空自身所有技能PP值\r\n<indent=32><sprite=4><indent=48>将自身体力值降为1点\r\n<indent=32><sprite=4><indent=48>自身下回合自身<color=#64F9FA>无法主动切换精灵</color>"
}
```

我的回答：前者

### Q-N20-4468-002 — 夷灭1767多余参数的精确兼容授权

36391夷灭/f88eb61a全部原文：若自身处于能力下降状态则技能先制+3；若对手处于能力提升状态则先制+3；自身拥有的永昌玺数量≥3方时忽略对手37%的双防值；攻击时将自身的能力下降状态视为相应的能力提升状态；攻击时将对手的能力提升状态视为相应的能力下降状态

零基实例4的1767/ d25219b2声明args_num0，但API实例实际[3,37]；1905零参数模板已写三玺/37%，不能擅移或丢两个参数。API技能/效果与Wiki效果1767/344225都未解释此多余参数，已有21741/58等精确兼容不能扩展。

已完成其他四效果及1767[]公共核心真实HP；本[3,37]正式绑定未完成，不运行必然失败验收。最小方案仅对skill36391/hash f88eb61a/index4/effect1767/[3,37]保留原始参数另显式兼容零参语义，仍拒其他hash/实例/额外参数，不篡改源。

明确问题：是否授权仅此精确实例按1767零参语义兼容多余[3,37]，还是需要按另一具体机制处理这两个数？

来源证据：

```json
{
  "skill": {
    "url": "https://api.seerapi.com/v1/skill/36391",
    "data": {
      "id": 36391,
      "name": "夷灭",
      "power": 150,
      "max_pp": 5,
      "accuracy": 100,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 221,
        "url": "https://api.seerapi.com/v1/element_type_combination/221"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "若自身处于能力下降状态则技能先制+3",
          "analyze_info": "[sprite name=iconInherent]若自身处于能力下降状态则[color=#52a5f2]技能先制[/color]+3（boss有效）",
          "args": [],
          "effect": {
            "id": 881,
            "url": "https://api.seerapi.com/v1/skill_effect_type/881"
          }
        },
        {
          "info": "若对手处于能力提升状态则先制+3",
          "analyze_info": "[sprite name=iconInherent]若对手处于能力提升状态则[color=#52a5f2]先制[/color]+3（boss有效）",
          "args": [],
          "effect": {
            "id": 1904,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1904"
          }
        },
        {
          "info": "自身拥有的永昌玺数量≥3方时忽略对手37%的双防值",
          "analyze_info": "[sprite name=iconInherent]自身拥有的[color=#f35555]永昌玺[/color]数量≥3方时忽略对手37%的双防值",
          "args": [],
          "effect": {
            "id": 1905,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1905"
          }
        },
        {
          "info": "攻击时将自身的能力下降状态视为相应的能力提升状态",
          "analyze_info": "[sprite name=iconInherent]攻击时将自身的能力下降状态视为相应的能力提升状态",
          "args": [],
          "effect": {
            "id": 1874,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1874"
          }
        },
        {
          "info": "攻击时将对手的能力提升状态视为相应的能力下降状态",
          "analyze_info": "[sprite name=iconInherent]攻击时将对手的能力提升状态视为相应的能力下降状态（boss有效）",
          "args": [
            3,
            37
          ],
          "effect": {
            "id": 1767,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1767"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "f88eb61a"
    },
    "loadedAt": "2026-10-22T05:29:51.155Z",
    "storage": "refreshed"
  },
  "effect": {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1767",
    "data": {
      "id": 1767,
      "args_num": 0,
      "info": "攻击时将对手的能力提升状态视为相应的能力下降状态",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconInherent]攻击时将对手的能力提升状态视为相应的能力下降状态（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 35598,
          "url": "https://api.seerapi.com/v1/skill/35598"
        },
        {
          "id": 35896,
          "url": "https://api.seerapi.com/v1/skill/35896"
        },
        {
          "id": 36261,
          "url": "https://api.seerapi.com/v1/skill/36261"
        },
        {
          "id": 36391,
          "url": "https://api.seerapi.com/v1/skill/36391"
        },
        {
          "id": 36509,
          "url": "https://api.seerapi.com/v1/skill/36509"
        },
        {
          "id": 36668,
          "url": "https://api.seerapi.com/v1/skill/36668"
        },
        {
          "id": 37124,
          "url": "https://api.seerapi.com/v1/skill/37124"
        },
        {
          "id": 37234,
          "url": "https://api.seerapi.com/v1/skill/37234"
        },
        {
          "id": 37360,
          "url": "https://api.seerapi.com/v1/skill/37360"
        },
        {
          "id": 37465,
          "url": "https://api.seerapi.com/v1/skill/37465"
        },
        {
          "id": 37737,
          "url": "https://api.seerapi.com/v1/skill/37737"
        },
        {
          "id": 37872,
          "url": "https://api.seerapi.com/v1/skill/37872"
        },
        {
          "id": 37994,
          "url": "https://api.seerapi.com/v1/skill/37994"
        },
        {
          "id": 38040,
          "url": "https://api.seerapi.com/v1/skill/38040"
        },
        {
          "id": 38079,
          "url": "https://api.seerapi.com/v1/skill/38079"
        },
        {
          "id": 38135,
          "url": "https://api.seerapi.com/v1/skill/38135"
        },
        {
          "id": 38393,
          "url": "https://api.seerapi.com/v1/skill/38393"
        },
        {
          "id": 38411,
          "url": "https://api.seerapi.com/v1/skill/38411"
        },
        {
          "id": 38422,
          "url": "https://api.seerapi.com/v1/skill/38422"
        },
        {
          "id": 38451,
          "url": "https://api.seerapi.com/v1/skill/38451"
        },
        {
          "id": 38510,
          "url": "https://api.seerapi.com/v1/skill/38510"
        },
        {
          "id": 38577,
          "url": "https://api.seerapi.com/v1/skill/38577"
        }
      ],
      "tag": [],
      "hash": "d25219b2"
    },
    "cacheFile": "research/3896-source-check.json",
    "loadedAt": "2026-10-19T03:16:54.495Z",
    "storage": "existing-cache"
  }
}
```

我的回答：授权

### Q-N20-4468-003 — 泰阿盛威新多目标来源的最小精确适配授权

36388泰阿盛威/1ea5cdc8，特殊、王、威力100、PP15、命中100、先制0、atk_num6，无独立效果词条。已确认Q-A60-4004-008“所有多目标攻击当做无词条处理，我们的对战没有多目标攻击”；但MULTI-TARGET-USER-SCOPE.json明确现有ID/hash/数量约束不变，seerapi.reviewedTargets不包含此新源，且本轮禁止扩大兼容授权，故未擅加名单。

真实源参数6保留，当前目标一次攻击/PP及控制未用独立完成；需要正式适配仍待授权，不虚称六段或把用户已排除的多目标变成队伍待办。最小方案仅新增36388/1ea5cdc8/atk_num6精确来源，沿用公共忽略范围、当前目标一次攻击，其他约束不动。

明确问题：是否授权按现有多目标全局规则，新增36388/1ea5cdc8/6这一个精确来源适配？

来源证据：

```json
{
  "url": "https://api.seerapi.com/v1/skill/36388",
  "data": {
    "id": 36388,
    "name": "泰阿盛威",
    "power": 100,
    "max_pp": 15,
    "accuracy": 100,
    "crit_rate": 6.25,
    "priority": 0,
    "must_hit": false,
    "atk_num": 6,
    "info": null,
    "category": {
      "id": 2,
      "url": "https://api.seerapi.com/v1/skill_category/2"
    },
    "type": {
      "id": 221,
      "url": "https://api.seerapi.com/v1/element_type_combination/221"
    },
    "learned_by_pet": [],
    "skill_effect": [],
    "friend_skill_effect": [],
    "hide_effect": null,
    "advance": null,
    "hash": "1ea5cdc8"
  },
  "loadedAt": "2026-10-22T05:28:23.415Z",
  "storage": "refreshed"
}
```

我的回答：授权

### Q-N20-4468-004 — 第五恢复PP后重复使用的基础攻击范围

36392八方无人来朝/24e29745，1906/36d2c302/[]。完整原文：每场战斗中该技能仅可成功使用1次，生效后立即消除对手回合类效果、护盾效果、护罩效果，自身恢复全部体力和所有技能PP值并将当前拥有的永昌玺数量变为6方，且7回合内自身在场时若未击败对手则拥有的永昌玺数量将不再消耗，但击败对手或自身在场7回合后，则会清空自身所有技能PP值，将自身当前体力降为1点，且下回合自身无法主动切换精灵

API与Wiki1906同文，仅说“仅可成功使用1次”，没有解释首次成功已经恢复该技能PP后再次选择，是否整招不成功（包括基础170威力攻击），还是只1906附效不再生效而仍攻击。两者敌HP/我方PP明显不同，不把当前挂钩位置当来源。首次全部明确效果、MISS/控制未用不记成功、7回冻结、KO或期满PP0/HP1，以及真实下回禁切换延期已独立完成；重复使用显式待答，不执行假定基础伤害后装作完整。

明确问题：第一次成功且PP已恢复后再次使用此第五，是整招都无效，还是仍造成普通攻击伤害而1906不再触发（并请说明该次PP是否正常消耗）？

来源证据：

```json
{
  "url": "https://api.seerapi.com/v1/skill_effect_type/1906",
  "data": {
    "id": 1906,
    "args_num": 0,
    "info": "每场战斗中该技能仅可成功使用1次，生效后立即消除对手回合类效果、护盾效果、护罩效果，自身恢复全部体力和所有技能PP值并将当前拥有的永昌玺数量变为6方，且7回合内自身在场时若未击败对手则拥有的永昌玺数量将不再消耗，但击败对手或自身在场7回合后，则会清空自身所有技能PP值，将自身当前体力降为1点，且下回合自身无法主动切换精灵",
    "info_formatting_adjustment": "每场战斗中该技能仅可成功使用1次，生效后立即消除对手回合类效果、护盾效果、护罩效果，自身恢复全部体力和所有技能PP值并将当前拥有的永昌玺数量变为6方，且7回合内自身在场时若未<condition>击败对手</condition>则拥有的永昌玺数量将不再消耗\r\n-->但<condition>击败对手</condition>或<condition>自身在场7回合后</condition>，则会清空自身所有技能PP值，将自身当前体力降为1点，且下回合自身无法主动切换精灵",
    "analyze_info": "[sprite name=iconHit]每场战斗中该技能仅可成功使用1次，生效后立即消除对手[color=#52a5f2]回合类效果[/color]、[color=#57c975]护盾[/color]效果、[color=#57c975]护罩[/color]效果，自身恢复全部体力和所有技能PP值并将当前拥有的[color=#f35555]永昌玺[/color]数量变为6方，且7回合内自身在场时若未[color=#57c975]击败[/color]对手则拥有的[color=#f35555]永昌玺[/color]数量将不再消耗，但[color=#57c975]击败[/color]对手或自身在场7回合后，则会清空自身所有技能PP值，将自身当前体力降为1点，且下回合自身无法[color=#52a5f2]主动切换[/color]精灵",
    "pve_effective": false,
    "param": null,
    "skill": [
      {
        "id": 36392,
        "url": "https://api.seerapi.com/v1/skill/36392"
      }
    ],
    "tag": [],
    "hash": "36d2c302"
  },
  "loadedAt": "2026-10-22T05:30:17.450Z",
  "storage": "refreshed"
}
```

我的回答：直接废除此技能，无法再次点击

### Q-N20-4468-005 — 35惩罚的真实增威公式与参与能力范围

36384挥剑决/76f1330e/i0，35/94f7d2fb/[]完整原文“惩罚，对方能力等级越高，此技能威力越大”。API与Wiki效果35/342694、技能36384/313948均无系数或属性范围，站内/定向检索没有可靠定量补充。旧代码按物/特攻击对应敌双攻防正等级每级20威力，但这是旧实现，不能当真实来源；命中+3并不增伤，直接暴露范围缺口。未擅修改旧目标35行为，当前本新源遇正级显式待答；无正级实际60威力、PP和控制未用已完成。

尚不具来源证据的公式不作为可选真值推荐。影响本36384与其他35实例，既有3576/13100、4184/13100、4222和4288/10930需核对真实公式，旧代码一致不代表已确认；4184当前必要复验标明该语义前置，不跑形式通过后谎称公式已核实。

明确问题：35惩罚具体累计对手哪些能力等级、如何按等级增加威力（每级数值/负级/上限）？

来源证据：

```json
{
  "url": "https://api.seerapi.com/v1/skill_effect_type/35",
  "data": {
    "id": 35,
    "args_num": 0,
    "info": "惩罚，对方能力等级越高，此技能威力越大",
    "info_formatting_adjustment": null,
    "analyze_info": "[sprite name=iconHit]惩罚，对方能力等级越高，此技能[color=#52a5f2]威力[/color]越大（boss有效）",
    "pve_effective": true,
    "param": null,
    "hash": "94f7d2fb"
  },
  "cacheFile": "research/selected-current-batch.json",
  "storage": "existing-cache"
}
```

我的回答：累计对手六项能力的正等级、每级威力+1、负等级不抵扣且没有额外威力上限



## 4472 夜罗·琉彩：17技能/43项逐项审核，全部独立工作完成

2026-10-22T05:51:57.678Z。源1681/6267b18b/eid2070/[3,100,1]和全部17真实技能原文/参数/URL/hash完整见4472-source-check.json、4472-reviewed-snapshot.json。Wiki精灵359701/魂印320218/第五313976/648-343108/956-343415/1126-349206原始内容见4472-wiki-source.json，没有补齐下述歧义。当前87/87含17自身退出0，命令重复同文件Node已按文件去重，不额外累计。未部署未正式验收，扫描4474，正式仍4329。

已完成：受正完整攻击伤害回复三分一、回复后严格比较HP授次回闪避、免伤0不回血与保1实际损失0仍触、魂印禁疗/回复倍率；未受攻击完整伤害才次回必暴，固定不混同攻击；所有技能无需答案词条包括清强后攻击免疫、随机150–300回复端点、每次使用20/25/30/35封顶粉伤、低半弱化双倍、反转弱化混乱、真实已用攻击含MISS和控制未用的延迟害怕/失败属性一次无效、次回天敌250/500固定、满HP强化/增威、次3攻击理论maxHP三分一吸取、沉默与次回降先制、清回合2回攻击MISS、非暴随机250–350固定/暴击300–400理论吸取均真实状态验证。旧精确允许14045/d84245f6/atk_num3按已答全局忽略范围，当前攻击一次，不登记已排除的多目标延期；本身没有真正多精灵延期。

公共1126缺少PP保护是普通代码缺口，已正常修复，不当待答问题。现代4258/35282与4338/35709同源关联，原专项通过但新增下述语义前置，保留原始可用部署/历史通过日志，不冒称当下已重新正式验收；旧3311/30468没有现代完整审核，不能伪称现代复验。

### Q-N20-4472-001 — 1126先使用技能、之后同回合才受攻击时额外清PP的时点

36407夜驻/4128a34f/i1，1126/f903a459/[1,1]。完整原文：消除对手能力提升，消除成功可以抵挡2回合内对手的攻击伤害；使对手随机1项技能PP值归零，若当回合受到攻击则额外使对手随机1项技能PP值归零。API格式化“使对手随机1项技能PP值归零 → 若当回合受到攻击则额外使对手随机1项技能PP值归零”，Wiki效果1126/rev349206同文，没有补何时评估当回合。

已经明确完成：先受正完整攻击伤害再使用时，随机两项PP归零、无放回且只从正PP选择；未先受攻击时，确定的基础随机1即时完成；PP保护挡全部。未知是自身先使用后，随后同回合对手才正伤命中，是否在受击后/战阶末补额外随机1，还是只在使用当下判断不补。若补清则敌两项PP归零，不补则只一项；不能把当前实现只即时检查当来源。当前source-bound pending1126AttackTiming保存未决前置，不猜额外分支。

关联所有已找到同效果实例：4258/35282、4338/35709、旧3311/30468，原生来源各自保留，公共问题不重复建。

明确问题：1126先使用后同回合才受到对手正数攻击伤害时，是否补清额外技能PP；若补，应在受击后还是战斗阶段结束时结算？

我的回答：否

### 公共Q-N20-4359-003补充关联1126（不新建重复主问题）

上述1126完整词条也使用“若当回合受到攻击”。已用攻击但经免疫/护盾后完整伤害0、或MISS，是否满足额外随机清1，沿原公共“受到攻击”的零伤/MISS判据问题收集。正完整攻击包括保1实际0已测；不将普通代码判断roundSettledAttackDamage>0自动当用户答案。当前额外分支标待确认，基础随机1/保护已完成。关联4472/36407、4258/35282、4338/35709、旧3311/30468，不扩大现有用户回答。

### Q-N20-4472-002 — 648下次攻击“未命中”是否包括失明导致技能失效

36412掠影极空断/ae1cc7d3/i2，648/34751469/[6]。完整原技能词条：消除对手回合类效果，消除成功则对手2回合内攻击技能MISS；随机附加给对手250-350点固定伤害，若打出致命一击则效果转变为吸取对手300-400点体力；若对手下次使用的攻击技能未命中则令对手害怕。648原文“若对手下次使用的攻击技能未命中则令对手害怕”；API/Wiki效果648/rev343108都没有定义失明50%导致的“失效”是否等价于未命中。已有“技能无效是否包含MISS”及2080“闪避成功”的问题均未答且表述不同，不代替本实例分类答案。

普通命中率MISS/强制MISS下次攻击消费一次并害怕，命中但免攻击伤害0不害怕，控制未使用不消费、状态技能不消费，均按明确分支实现；失明发生时显式guard保留问题，不自行决定害怕。若算未命中会附害怕，若只算失效则不附，实际后续行动不同。

明确问题：648的“下次使用的攻击技能未命中”是否包括失明导致的技能失效，并应否因此附害怕？

我的回答：4489的72和4501的1715都把失明算未命中，整招被封锁时又按未命中执行自损或清PP

来源原始记录（原文/参数未改写）：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/36407",
    "data": {
      "id": 36407,
      "name": "夜驻",
      "power": 85,
      "max_pp": 20,
      "accuracy": 97,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 110,
        "url": "https://api.seerapi.com/v1/element_type_combination/110"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手能力提升，消除成功可以抵挡2回合内对手的攻击伤害",
          "analyze_info": "[sprite name=iconHit]消除对手能力提升，消除成功可以抵挡2回合内对手的攻击伤害",
          "args": [
            2
          ],
          "effect": {
            "id": 794,
            "url": "https://api.seerapi.com/v1/skill_effect_type/794"
          }
        },
        {
          "info": "使对手随机1项技能PP值归零，若当回合受到攻击则额外使对手随机1项技能PP值归零",
          "analyze_info": "[sprite name=iconHit]使对手随机1项技能PP值归零，若[color=#52a5f2]当回合[/color]受到攻击则额外使对手随机1项技能PP值归零",
          "args": [
            1,
            1
          ],
          "effect": {
            "id": 1126,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1126"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "4128a34f"
    },
    "loadedAt": "2026-10-22T05:42:14.247Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1126",
    "data": {
      "id": 1126,
      "args_num": 2,
      "info": "使对手随机{0}项技能PP值归零，若当回合受到攻击则额外使对手随机{1}项技能PP值归零",
      "info_formatting_adjustment": "使对手随机{0}项技能PP值归零\r\n--><condition>若当回合受到攻击</condition>则额外使对手随机{1}项技能PP值归零",
      "analyze_info": "[sprite name=iconHit]使对手随机{0}项技能PP值归零，若[color=#52a5f2]当回合[/color]受到攻击则额外使对手随机{1}项技能PP值归零",
      "pve_effective": false,
      "param": null,
      "hash": "f903a459"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36412",
    "data": {
      "id": 36412,
      "name": "掠影极空断",
      "power": 160,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": true,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 110,
        "url": "https://api.seerapi.com/v1/element_type_combination/110"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则对手2回合内攻击技能MISS",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]（boss有效），消除成功则对手2回合内攻击技能MISS",
          "args": [
            2
          ],
          "effect": {
            "id": 950,
            "url": "https://api.seerapi.com/v1/skill_effect_type/950"
          }
        },
        {
          "info": "随机附加给对手250-350点固定伤害，若打出致命一击则效果转变为吸取对手300-400点体力",
          "analyze_info": "[sprite name=iconHit]随机附加给对手250-350点[color=#52a5f2]固定伤害[/color]，若打出[color=#52a5f2]致命一击[/color]则效果转变为[color=#52a5f2]吸取[/color]对手300-400点体力（boss有效）",
          "args": [
            250,
            350,
            300,
            400
          ],
          "effect": {
            "id": 1659,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1659"
          }
        },
        {
          "info": "若对手下次使用的攻击技能未命中则令对手害怕",
          "analyze_info": "[sprite name=iconHit]若对手下次使用的攻击技能未命中则令对手[color=#57c975]害怕[/color]",
          "args": [
            6
          ],
          "effect": {
            "id": 648,
            "url": "https://api.seerapi.com/v1/skill_effect_type/648"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "ae1cc7d3"
    },
    "loadedAt": "2026-10-22T05:43:10.976Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/648",
    "data": {
      "id": 648,
      "args_num": 1,
      "info": "若对手下次使用的攻击技能未命中则令对手{0}",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]若对手下次使用的攻击技能未命中则令对手[color=#57c975]{0}[/color]",
      "pve_effective": false,
      "param": [
        {
          "position": 0,
          "param": {
            "id": 1,
            "url": "https://api.seerapi.com/v1/skill_effect_param/1"
          }
        }
      ],
      "hash": "34751469"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  },
  {
    "url": "https://api.seerapi.com/v1/soulmark/1681",
    "data": {
      "id": 1681,
      "desc": "自身受到攻击伤害后恢复自身最大体力的1/3，然后若自身体力低于对手，则下回合100%闪避对手的攻击技能；战斗阶段结束时，若自身当回合未受到攻击伤害，则下回合攻击技能必定打出致命一击（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身受到技能伤害后<color=#64F9FA>恢复</color>自身最大体力的1/3\r\n<indent=32><sprite=4><indent=48>然后若自身体力低于对手则下回合100%<color=#64F9FA>闪避</color>对手的<b>攻击技能</b>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时，若自身未受到技能伤害则下回合<b>攻击技能</b>必定<color=#64F9FA>打出致命一击</color>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4472,
          "url": "https://api.seerapi.com/v1/pet/4472"
        }
      ],
      "effect": {
        "effect_args": [
          3,
          100,
          1
        ],
        "effect": {
          "id": 2070,
          "url": "https://api.seerapi.com/v1/eid_effect/2070"
        }
      },
      "effect_alias": "alias_2070_3_100_1",
      "tag": [
        {
          "id": 6,
          "url": "https://api.seerapi.com/v1/soulmark_tag/6"
        },
        {
          "id": 18,
          "url": "https://api.seerapi.com/v1/soulmark_tag/18"
        },
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "6267b18b"
    },
    "loadedAt": "2026-10-22T05:42:07.539Z",
    "storage": "refreshed"
  }
]
```

4472补充验证：4472-supplement-v4.log18/18退出0，包含648控制未用/属性使用不消费、1126有限PP池不重复抽；与87重叠不累加。无新增用户回答。


## 4474 妤玫：17技能/44项逐项审核，全部独立工作完成

2026-10-22T06:04:30.057Z。所有真实源URL/hash/原始格式化/参数和两次不同资源非JSON响应错误，保留4474-source-check.json；后续成功续接，无猜数/无限重试。17技能完整快照4474-reviewed-snapshot.json；Wiki精灵359697/魂印320220/第五313987/1927-344385，保留4474-wiki-source.json。Soul1683/9a471d8c/eid2067/[1,100,100,1]，无强化版来源。当前联合123/123退出0含自身18；问题编号拆分后当前自身18/18退出0，与123重复不累计。未部署未正式验收。

已完成：回合初敌无正级双方全1/双方禁强独立、敌有正级攻击翻倍快照；共同肯定的双方全强时攻击/属性闪避与必中穿、自己全强且明确成功命中前清敌强/强化保护失败；技能所有无需答案分支包括本系补偿、死后战阶粉伤、先手穿免和清回合/无回合增伤、束缚真实新枚举、1927低半300/600固定理论吸取与4回到期、反转/回满/禁强禁疗、960正级用后焚烬含MISS、1129/1694概率/理论吸取随机端点、1928原本有强才吸强/原本无强理论maxHP三分一、795每次当前25/50/75/100封顶均状态验证。11332/f5bd9dfa/范围4沿既有精确授权按全局忽略多目标，不变四段，不新建队伍延期；本源没有真实多精灵延期。

### Q-N20-4474-001 — 魂印闪避条件“处于全属性提升状态”的主语

完整原词条：回合开始时若对手不处于能力提升状态则令双方全属性+1，若对手处于能力提升状态则当回合自身造成的攻击伤害提升100%；|对手技能命中前若处于全属性提升状态则自身100%闪避，自身技能命中前若处于全属性提升状态则消除对手能力提升状态|（boss无效）

格式化原句“对手使用技能时若处于全属性提升状态则自身100%将其闪避”；原始“对手技能命中前若处于全属性提升状态则自身100%闪避”。API和Wiki320220均省略若处于的明确主语；eid2067参数只有[1,100,100,1]不能推断主语。已查当前确认没有适用于本1683的回答，不能用旧代码当来源。

若判断自身全强：自己六项都正、敌只有部分正级时仍闪避；若判断对手全强：该例不闪避，而敌全强/自己不全强时反过来。两者改变攻击HP、属性效果和后续能力。双方都全强或都不全强不依赖答案，已完成相应共同行为/必中穿和当前强化/攻击倍率；只有一方全强时显式guard，不猜。

明确问题：1683闪避判定要求自身六项能力全部提升，还是要求对手六项能力全部提升？

我的回答：对手

### Q-N20-4474-002 — 自身清强在“命中前”还是“使用时”，MISS/整招无效是否触发

同1683/9a471d8c/eid2067原始“自身技能命中前若处于全属性提升状态则消除对手能力提升状态”，格式化“自身使用技能时若处于全属性提升状态则消除对手能力提升状态”。完整原词条、所有参数及URL/hash见本节和下方原始记录，Wiki320220为前者，没有补充MISS时点。

自己全强且明确成功命中前清敌强已通过真实伤害前等级/HP测试；强化保护不清也已测。若使用即可，即便攻击MISS或被整招封锁也应清敌强，且会影响后续双方技能；若仅成功命中流程，则这些情况不清。当前这些情形保存pendingYumeiMissClear，不把没有清强当最终答案；普通技能和其他魂印确定分支完成。

明确问题：1683自身全强清敌强是否在实际使用时就执行（包含MISS/整体无效），还是只在成功命中前执行？

我的回答：前者

来源原始完整记录（未改写）：

```json
{
  "url": "https://api.seerapi.com/v1/soulmark/1683",
  "data": {
    "id": 1683,
    "desc": "回合开始时若对手不处于能力提升状态则令双方全属性+1，若对手处于能力提升状态则当回合自身造成的攻击伤害提升100%；|对手技能命中前若处于全属性提升状态则自身100%闪避，自身技能命中前若处于全属性提升状态则消除对手能力提升状态|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手不处于能力提升状态则<color=#64F9FA>令双方全属性+1</color>\r\n<indent=32><sprite=4><indent=48>若对手处于能力提升状态则当回合自身造成的<b>攻击伤害</b><color=#64F9FA>提升</color>100%\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用技能时若处于全属性提升状态则自身100%将其<color=#64F9FA>闪避</color>\r\n<indent=16><sprite=3><indent=32>自身使用技能时若处于全属性提升状态则<color=#64F9FA>消除</color>对手<b>能力提升状态</b>",
    "analyze_desc": "",
    "pve_effective": false,
    "intensified": false,
    "is_adv": false,
    "pet": [
      {
        "id": 4474,
        "url": "https://api.seerapi.com/v1/pet/4474"
      }
    ],
    "effect": {
      "effect_args": [
        1,
        100,
        100,
        1
      ],
      "effect": {
        "id": 2067,
        "url": "https://api.seerapi.com/v1/eid_effect/2067"
      }
    },
    "effect_alias": "alias_2067_1_100_100_1",
    "tag": [
      {
        "id": 12,
        "url": "https://api.seerapi.com/v1/soulmark_tag/12"
      },
      {
        "id": 2,
        "url": "https://api.seerapi.com/v1/soulmark_tag/2"
      },
      {
        "id": 18,
        "url": "https://api.seerapi.com/v1/soulmark_tag/18"
      }
    ],
    "intensified_to": null,
    "from": null,
    "advance": null,
    "hash": "9a471d8c"
  },
  "loadedAt": "2026-10-22T05:52:30.745Z",
  "storage": "refreshed"
}
```


## 4477 启源·伊洛特斯：17技能/43项逐项审核，全部独立工作完成

2026-10-22T06:21:10.278Z。全部真实原文/URL/hash/参数及格式化资料在4477-source-check.json、4477-reviewed-snapshot.json；Wiki359691/320224/313999/314003/343981/344180原始内容在4477-wiki-source.json。1687/e6fb4d84/eid2072/[100,1,100,1]无其他强化来源。联合126/126含18自身、当前自身19/19退出0（重叠不累计），4467 attackOnly修复专项17/17重叠不累加。未部署未正式验收；原两批40只独立工作已完成，直接继续原已授权追加10只4482起，不停等回答。

本只没有新增问题主编号，但有关联未回答公共问题Q-N20-4442-001。已完成：未实际使用技能（含药剂/控制未用）自麻痹、真实施加失败不授下回视图；次回若敌无任何真实负级，自身观察敌防速-1，行动顺序/防御伤害生效，不改敌真实等级也不当弱化/不被免弱挡，真实降低仍基于原值；回合初成功清麻痹当回必暴，格式化缩进明确实际攻击未造成完整攻击伤害才补麻痹，MISS/免攻击0/零威力固定招属于0攻击，保1完整正伤实际0不属于0攻击；状态使用/控制未用不会绕过实际攻击前置。

全部无需答案技能分支：新失明1734/麻痹1187精确源、纯攻击1522阈值200/201、随机清PP和战后未KO全PP减2、全PVP属性使用反制随机异常（当前回合事件与累计历史分开）、先手禁疗、弱化反转并给敌等量弱化、敌强才maxHP粉伤、后手强化、低半回复改理论吸取、0威力攻击与防御固定、其它攻击2回必暴、暴击伤害倍率、命中未暴2回仅攻击先制、1928互斥分支，均实际状态测试。没有真正多精灵延期。

### 公共Q-N20-4442-001追加关联1522（保留原问题、原回答，不新建重复主问题）

36435瞬烬/b4162dac/i1，1522/fcc966a9/[150,200]完整原词条“附加150点固定伤害，若当回合造成的伤害高于200则固伤效果翻倍”。API原始、格式化、分析都只说“当回合造成的伤害”，Wiki效果1522/rev343981相同，未定义按本次纯攻击、当回合累计完整攻击，还是含固定/百分比/真实伤害，以及统计时点。

明确纯单段攻击200不翻/201翻已完成，以防御减免后的完整量而非HP减少：1HP保命实际损失0、完整201仍按201分支。不把当前旧实现只读c.settledDamage当来源。若本次攻击100、之前有300固定，当回合总400按总伤应附300，而按当前攻击100则只附150；这些候选确会改变HP，当前跨阈值分歧显式guard。请在原公共伤害统计范围问题中同时明确本1522的累计时点/类型及是否计入本条正在计算的附加固定，不替填写答案、不自动扩大将来的回答范围。

公共修复（非问题）：新引入attackOnly标记此前只保存未被id984读取，真实状态/属性行动顺序测试揭示后已正常修复，只约束明确标记的状态，旧全技能状态不变；受影响本轮1677/1628/1722回归，查询已部署数据没有1628或1722且没有1677，不虚构旧目标影响。抗性窗口旧公共规则是按这次异常抽得2/3回决定，对应失效窗口2或3，错误假设固定1/2的夹具已依据真实规则纠正，原生产抗性行为未改；断言仍要求55%成功失败均出现及失败不授视图，不弱化正确行为。

完整来源记录：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1687",
    "data": {
      "id": 1687,
      "desc": "战斗阶段结束时，若当回合自身未使用技能则100%令自身麻痹，触发成功后下回合若对手不处于能力下降状态，则自身将对手的防御、速度等级视为-1；|回合开始时解除自身所处的麻痹状态，解除成功则当回合攻击技能必定打出致命一击，若当回合攻击技能未造成伤害，则100%令对手麻痹|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若当回合自身未使用技能则100%<color=#64F9FA>令自身麻痹</color>\r\n<indent=32><sprite=4><indent=48>触发成功后下回合若对手不处于能力下降状态，则自身将对手的防御、速度等级<color=#64F9FA>视为</color>-1\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时<color=#64F9FA>解除</color>自身所处的麻痹状态\r\n<indent=32><sprite=4><indent=48>解除成功则当回合自身攻击技能必定<color=#64F9FA>打出致命一击</color>\r\n<indent=32><sprite=4><sprite=4><indent=64>若当回合攻击未造成攻击伤害，则100%<color=#64F9FA>令对手麻痹</color>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4477,
          "url": "https://api.seerapi.com/v1/pet/4477"
        }
      ],
      "effect": {
        "effect_args": [
          100,
          1,
          100,
          1
        ],
        "effect": {
          "id": 2072,
          "url": "https://api.seerapi.com/v1/eid_effect/2072"
        }
      },
      "effect_alias": "alias_2072_100_1_100_1",
      "tag": [
        {
          "id": 11,
          "url": "https://api.seerapi.com/v1/soulmark_tag/11"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        },
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "e6fb4d84"
    },
    "loadedAt": "2026-10-22T06:04:40.275Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill/36435",
    "data": {
      "id": 36435,
      "name": "瞬烬",
      "power": 80,
      "max_pp": 5,
      "accuracy": 97,
      "crit_rate": 6.25,
      "priority": 3,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 1,
        "url": "https://api.seerapi.com/v1/skill_category/1"
      },
      "type": {
        "id": 76,
        "url": "https://api.seerapi.com/v1/element_type_combination/76"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "消除对手回合类效果，消除成功则100%令对手失明，若对手不处于回合类效果则造成的攻击伤害提升100%",
          "analyze_info": "[sprite name=iconHit]消除对手[color=#52a5f2]回合类效果[/color]，消除成功则100%令对手[color=#57c975]失明[/color]，若对手不处于[color=#52a5f2]回合类效果[/color]则造成的攻击伤害提升100%",
          "args": [
            100,
            20,
            100
          ],
          "effect": {
            "id": 1734,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1734"
          }
        },
        {
          "info": "附加150点固定伤害，若当回合造成的伤害高于200则固伤效果翻倍",
          "analyze_info": "[sprite name=iconHit]附加150点[color=#52a5f2]固定伤害[/color]，若[color=#52a5f2]当回合[/color]造成的伤害高于200则固伤效果翻倍（boss有效）",
          "args": [
            150,
            200
          ],
          "effect": {
            "id": 1522,
            "url": "https://api.seerapi.com/v1/skill_effect_type/1522"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "b4162dac"
    },
    "loadedAt": "2026-10-22T06:04:53.363Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/1522",
    "data": {
      "id": 1522,
      "args_num": 2,
      "info": "附加{0}点固定伤害，若当回合造成的伤害高于{1}则固伤效果翻倍",
      "info_formatting_adjustment": "附加{0}点固定伤害\r\n--><condition>若当回合造成的伤害高于</condition>{1}则效果翻倍",
      "analyze_info": "[sprite name=iconHit]附加{0}点[color=#52a5f2]固定伤害[/color]，若[color=#52a5f2]当回合[/color]造成的伤害高于{1}则固伤效果翻倍（boss有效）",
      "pve_effective": true,
      "param": null,
      "skill": [
        {
          "id": 33811,
          "url": "https://api.seerapi.com/v1/skill/33811"
        },
        {
          "id": 34277,
          "url": "https://api.seerapi.com/v1/skill/34277"
        },
        {
          "id": 34372,
          "url": "https://api.seerapi.com/v1/skill/34372"
        },
        {
          "id": 34622,
          "url": "https://api.seerapi.com/v1/skill/34622"
        },
        {
          "id": 34716,
          "url": "https://api.seerapi.com/v1/skill/34716"
        },
        {
          "id": 35198,
          "url": "https://api.seerapi.com/v1/skill/35198"
        },
        {
          "id": 35293,
          "url": "https://api.seerapi.com/v1/skill/35293"
        },
        {
          "id": 35598,
          "url": "https://api.seerapi.com/v1/skill/35598"
        },
        {
          "id": 36058,
          "url": "https://api.seerapi.com/v1/skill/36058"
        },
        {
          "id": 36157,
          "url": "https://api.seerapi.com/v1/skill/36157"
        },
        {
          "id": 36173,
          "url": "https://api.seerapi.com/v1/skill/36173"
        },
        {
          "id": 36435,
          "url": "https://api.seerapi.com/v1/skill/36435"
        },
        {
          "id": 36778,
          "url": "https://api.seerapi.com/v1/skill/36778"
        },
        {
          "id": 36992,
          "url": "https://api.seerapi.com/v1/skill/36992"
        },
        {
          "id": 37165,
          "url": "https://api.seerapi.com/v1/skill/37165"
        },
        {
          "id": 37503,
          "url": "https://api.seerapi.com/v1/skill/37503"
        },
        {
          "id": 37708,
          "url": "https://api.seerapi.com/v1/skill/37708"
        },
        {
          "id": 38055,
          "url": "https://api.seerapi.com/v1/skill/38055"
        },
        {
          "id": 38303,
          "url": "https://api.seerapi.com/v1/skill/38303"
        }
      ],
      "tag": [
        {
          "id": 60828,
          "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
        }
      ],
      "hash": "fcc966a9"
    },
    "cacheFile": "research/4318-source-check.json",
    "loadedAt": "2026-10-20T12:21:21.325Z",
    "storage": "existing-cache"
  }
]
```


## 4482 冥霞：新增来源疑问（开发与逐项审核继续中，尚未记独立完成）

2026-10-22T06:42:17.501Z。原始API数据和全部17技能有序实例见4482-source-check.json、4482-reviewed-snapshot.json；Wiki359680/320231/314034/349311/344085/344392见4482-wiki-source.json。当前联合4482-independent-final-v2.log121/121退出0含自身16；不是完整验收。新问题只追加本文件，所有回答留空，建议不等于回答。

### Q-N20-4482-001 — 1694双方共计强化/弱化种数是否按能力名跨双方去重

1694/4d6b196b/eid2079/[5,5,1]，完整原文：回合开始时若对手处于能力提升或自身处于能力下降，则当回合自身免疫并反弹受到的异常状态且使用技能无视对手能力提升状态、无视自身能力下降状态；|战斗阶段结束时若双方共计处于5种或以上的能力提升与5种或以上的能力下降，则令双方所处的能力提升与能力下降等级翻倍，且下回合对手无法主动切换精灵|（boss无效）

API/Wiki魂印320231都只说“双方共计处于5种或以上的能力提升与5种或以上的能力下降”，没有说明双方同为攻击提升是否算2项还是同1种，也未说明同名弱化是否跨双方去重。按双方各6槽正负状态分别相加时，同一能力在两方均正算2项；按能力名去重算1种。例双方均攻防特攻+1、特防速命-1：计槽各6满足条件会全翻倍；去重各3不满足，不翻倍。两者真实等级/HP与后续速度不同。

已完成所有无分歧情形：两种方法都达到5/5时翻倍（3/4等封顶6、-3/-4封底-6），两者都不满足时不翻；判据分歧存pendingMingxiaKindCount，不把未翻当最终答案。回合初免反与技能忽略自身弱化/敌强化已完成；下回合真实禁切换按原文独立延期。

明确问题：1694的5种强化且5种弱化，是按双方各自能力槽相加，还是对能力名称跨双方去重后分别计数？

完整源记录：

```json
[
  {
    "url": "https://api.seerapi.com/v1/soulmark/1694",
    "data": {
      "id": 1694,
      "desc": "回合开始时若对手处于能力提升或自身处于能力下降，则当回合自身免疫并反弹受到的异常状态且使用技能无视对手能力提升状态、无视自身能力下降状态；|战斗阶段结束时若双方共计处于5种或以上的能力提升与5种或以上的能力下降，则令双方所处的能力提升与能力下降等级翻倍，且下回合对手无法主动切换精灵|（boss无效）",
      "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时若对手处于能力提升或自身处于能力下降，则当回合自身<color=#64F9FA>无视</color>对手<b>能力提升</b>与自身<b>能力下降</b>且<color=#64F9FA>免疫并反弹</color>受到的<b>异常状态</b>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若双方共计处于5种或以上的能力提升与5种或以上的能力下降，则令该能力提升与能力下降翻倍，且下回合对手<color=#64F9FA>无法主动切换精灵</color>",
      "analyze_desc": "",
      "pve_effective": false,
      "intensified": false,
      "is_adv": false,
      "pet": [
        {
          "id": 4482,
          "url": "https://api.seerapi.com/v1/pet/4482"
        }
      ],
      "effect": {
        "effect_args": [
          5,
          5,
          1
        ],
        "effect": {
          "id": 2079,
          "url": "https://api.seerapi.com/v1/eid_effect/2079"
        }
      },
      "effect_alias": "alias_2079_5_5_1",
      "tag": [
        {
          "id": 2,
          "url": "https://api.seerapi.com/v1/soulmark_tag/2"
        },
        {
          "id": 8,
          "url": "https://api.seerapi.com/v1/soulmark_tag/8"
        },
        {
          "id": 19,
          "url": "https://api.seerapi.com/v1/soulmark_tag/19"
        }
      ],
      "intensified_to": null,
      "from": null,
      "advance": null,
      "hash": "4d6b196b"
    },
    "loadedAt": "2026-10-22T06:21:20.027Z",
    "storage": "refreshed"
  }
]
```

我的回答：后者

### Q-N20-4482-002 — 公共62延迟“对方死亡”的结算路径与保命

4482/36468誓约/7f66fdc7/i1，62[5]。完整技能原文：5回合内若被对手击败则对手损失500点体力，造成致命伤害时，对手剩余1点体力；5回合后若对方没有将自己击败，则对方死亡

效果62完整原文“5回合后若对方没有将自己击败，则对方死亡”。API没有将死亡标注为真实/固定/百分比伤害，不能把旧代码以剩余HP真伤结算当来源；已查Q-A60-4287-071“直接令hp为0，只受保留1hp影响”明确对应魂印456，未授权扩到62，故不套用。现有直接死亡原语与伤害原语会影响伤害事件/临终反击/保命次数等，差异必须确认。仅有“死亡”的明确文字不足以自行决定它还产生哪类伤害和哪些事件。

已完成本实例计时/自身存活前置与到期识别，未到触发时点不改变HP；到期明确pending/guard，尚未执行或测试未知终结路径，不用虚假真伤替代死亡。旧3066/23344同62实例列为来源关联，原可用部署不改。最小建议是直接触发死亡并不伪造伤害事件，但这只是建议，保命和受击/死亡事件仍需答案。

明确问题：62应直接使对手HP归0而不产生伤害事件吗，保留1HP、其他保命及被击败事件分别是否适用？

完整源记录：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/36468",
    "data": {
      "id": 36468,
      "name": "誓约",
      "power": 140,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 62,
        "url": "https://api.seerapi.com/v1/element_type_combination/62"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "5回合内若被对手击败则对手损失500点体力，造成致命伤害时，对手剩余1点体力",
          "analyze_info": "[sprite name=iconHit]5回合内若被对手[color=#57c975]击败[/color]则对手损失500点体力，造成致命伤害时，对手剩余1点体力（boss有效）",
          "args": [
            5,
            500
          ],
          "effect": {
            "id": 587,
            "url": "https://api.seerapi.com/v1/skill_effect_type/587"
          }
        },
        {
          "info": "5回合后若对方没有将自己击败，则对方死亡",
          "analyze_info": "[sprite name=iconHit]5回合后若对方没有将自己[color=#57c975]击败[/color]，则对方死亡（boss有效）",
          "args": [
            5
          ],
          "effect": {
            "id": 62,
            "url": "https://api.seerapi.com/v1/skill_effect_type/62"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "7f66fdc7"
    },
    "loadedAt": "2026-10-22T06:22:17.593Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/62",
    "data": {
      "id": 62,
      "args_num": 1,
      "info": "{0}回合后若对方没有将自己击败，则对方死亡",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合后若对方没有将自己[color=#57c975]击败[/color]，则对方死亡（boss有效）",
      "pve_effective": true,
      "param": null,
      "hash": "ceb47cfb"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  }
]
```

我的回答：否，视为秒杀对手；可以被免死响应（该效果为绑定双方的回合类效果，任意一方切换或者被消回合则效果失效）文档已列的495、456、36、62、691、1627、1318统一直接归零HP、只受免死影响且不产生伤害事件

### Q-N20-4482-003 — 公共587“损失体力、造成致命伤害”的类型与事件

4482/36468誓约/7f66fdc7/i0，587[5,500]。完整效果原文“5回合内若被对手击败则对手损失500点体力，造成致命伤害时，对手剩余1点体力”。前句称损失体力、后句又称致命伤害，没有真实/固定/百分比或直接HP损失类型；API未附免疫/护盾/受伤事件定义。旧代码直接修改HP并保1仅为既有实现，不能当来源答案。当前全局完整伤害/HP损失区分不额外定义本词条类型。

直接HP损失、按某伤害类型结算会改变对应免疫/护盾/受伤与死亡反击，不能列无依据的某一种当推荐真值。明确的5回合窗口、必须被对手击败、数值500和最低1HP已作为触发诊断核对；实际HP处分支完整依赖类型，未宣称实施或验收完成，不拿只记录参数当状态伤害测试。触发时pending587Damage保留源参数而不执行猜测值；同招基础攻击和其他独立部分继续。关联全部已找到同587实例：旧3240/17391、3561/31760及现代3954/33755，保持其来源/历史可用版本，不把某个旧实现当新全局确认。

明确问题：587应按哪类伤害还是直接HP损失结算，其500点是否受对应免疫/护盾影响、是否触发受伤事件（最低1HP保持原文）？

完整源记录：

```json
[
  {
    "url": "https://api.seerapi.com/v1/skill/36468",
    "data": {
      "id": 36468,
      "name": "誓约",
      "power": 140,
      "max_pp": 5,
      "accuracy": 95,
      "crit_rate": 6.25,
      "priority": 0,
      "must_hit": false,
      "atk_num": 1,
      "info": null,
      "category": {
        "id": 2,
        "url": "https://api.seerapi.com/v1/skill_category/2"
      },
      "type": {
        "id": 62,
        "url": "https://api.seerapi.com/v1/element_type_combination/62"
      },
      "learned_by_pet": [],
      "skill_effect": [
        {
          "info": "5回合内若被对手击败则对手损失500点体力，造成致命伤害时，对手剩余1点体力",
          "analyze_info": "[sprite name=iconHit]5回合内若被对手[color=#57c975]击败[/color]则对手损失500点体力，造成致命伤害时，对手剩余1点体力（boss有效）",
          "args": [
            5,
            500
          ],
          "effect": {
            "id": 587,
            "url": "https://api.seerapi.com/v1/skill_effect_type/587"
          }
        },
        {
          "info": "5回合后若对方没有将自己击败，则对方死亡",
          "analyze_info": "[sprite name=iconHit]5回合后若对方没有将自己[color=#57c975]击败[/color]，则对方死亡（boss有效）",
          "args": [
            5
          ],
          "effect": {
            "id": 62,
            "url": "https://api.seerapi.com/v1/skill_effect_type/62"
          }
        }
      ],
      "friend_skill_effect": [],
      "hide_effect": null,
      "advance": null,
      "hash": "7f66fdc7"
    },
    "loadedAt": "2026-10-22T06:22:17.593Z",
    "storage": "refreshed"
  },
  {
    "url": "https://api.seerapi.com/v1/skill_effect_type/587",
    "data": {
      "id": 587,
      "args_num": 2,
      "info": "{0}回合内若被对手击败则对手损失{1}点体力，造成致命伤害时，对手剩余1点体力",
      "info_formatting_adjustment": null,
      "analyze_info": "[sprite name=iconHit]{0}回合内若被对手[color=#57c975]击败[/color]则对手损失{1}点体力，造成致命伤害时，对手剩余1点体力（boss有效）",
      "pve_effective": true,
      "param": null,
      "hash": "7839430a"
    },
    "cacheFile": "research/selected-current-batch.json",
    "storage": "existing-cache"
  }
]
```

我的回答：真实伤害；触发

### 已有公共问题追加本只实例（不重复建立主问题，不扩展既有回答）

- Q-N20-4329-006：36465合十/79a04e43/i2，1627[1,5,10]“1回合做5-10次攻击，若本回合攻击次数达到最大则必定秒杀对手”；36470温柔触摸/29d9983f/i0，1318[10,1]“10%的概率秒杀对手，未触发则令对手全属性-1”。完整原文/模板hash/有序参数见原始源记录及下方本节。已完成5–10段随机攻击及控制未用、1318概率未触发90%全弱；最大10与概率成功10%的秒杀结算/时点/保命/伤害事件未知，仅保留pending，不假装秒杀已实现，也不在尝试未明后自猜补偿。请在原公共问题中明确这两实例各自范围，不能自动把以后针对495的回答扩大成所有死亡机制。
- Q-N20-4359-003：28245长梦/3a41d98/i0，1188[4,8,3]“4回合内自身受到攻击则使对手睡眠，未触发则吸取对手最大体力的1/3”。正完整攻击触发睡眠、免睡失败理论maxHP三分一吸取/禁疗/免粉已完成；完整攻击0或MISS是否满足受到攻击仍未答，显式guard，前置未成立不猜补偿。
- Q-N20-4438-001：36466烙印/1a370171/i0，874[3,500]“3回合内若对手造成的伤害低于500则免疫该伤害”；28246残霞/56ee6c45/i3，800[3,3,500]“3回合内若对手使用属性技能，则下3回合自身受到的伤害不超过500”。874免疫阈值不等于798上限，分别保留具体源：明确纯单段攻击499被免、500不免以及800条件触发次3回上限500已经完成；非攻击类型和多段按段/合计单位仍需分别说明，不自动推广以后针对798的回答。874旧3001/24661、现代4114/27316同词条仅作来源关联，不动旧源或可用版本。

已查Wiki效果1318/349311模板“全属性-&#123;1&#125;”仅编码差异，API为正常模板；按API参数[10,1]而不改写原Wiki来源。1934[50]明确己方场下每死亡一只精灵的攻击增伤，属于真正队伍死亡计数，当前技能基础攻击已实做，延期条目将保留全部原文/参数/hash/触发条件。

4482处理状态更新：2026-10-22T06:49:23.079Z，全部17技能/47项逐项审核完成，124/124含19自身与现代3705/3673/3867退出0；旧版3482/公共47/47退出0，重叠不累计。所有不依赖未答问题的单体代码与状态专项完成；587/62实际HP处分支明确未实现并留下10项待答审核缺口，不用窗口/诊断代替伤害验收。原3新问题与3公共关联继续留空，不修改回答。1934真实场下死亡数与魂印真实禁切换原文/参数/hash单独延期，不能豁免其余单体。未正式部署未验收，继续4489。普通978/1359公共修复只新增旧现代3673/3705/3867必要复验，旧正确断言未删改，范围/参数授权未扩大；详细4482-public-impact.json。

## 4489 普鲁修托逐项审核与新增问题（2026-10-22T07:47:46.383Z）

来源：research/4489-source-check.json、4489-reviewed-snapshot.json、4489-wiki-source.json、4489-tag813-source.json；魂印https://api.seerapi.com/v1/soulmark/1700 hash5682455e/eid2088/[3,3,300,100,300,100,1,1]，宠物hash6bcc03a3。Wiki精灵359667/魂印320237/28265=306650/37022=314580。SeerAPI优先，未改写来源。

完整关联原文/版本/有序实例：
```json
[
  {
    "id": 1700,
    "hash": "5682455e",
    "description": "每次登场时若自身属性克制对手则为自身附加持续3回合的回能Ⅰ（若自身已持有回能Ⅰ则将回合数刷新至3回合），若对手属性微弱自身则为对手附加持续3回合的失能Ⅰ（若对手已持有失能Ⅰ则将回合数刷新至3回合）；|回合开始时若自身持有回能Ⅰ，则当回合自身免疫受到的麻痹、害怕、疲惫异常状态且战斗阶段结束时恢复自身300点体力，若当回合结束后自身持有的回能Ⅰ消失则下回合自身造成的攻击伤害提升100%；|回合开始时若对手持有失能Ⅰ，则当回合自身免疫受到的冰封、焚烬、感染异常状态且战斗阶段结束时附加给对手300点固定伤害，若当回合结束后对手持有的失能Ⅰ消失则下回合自身造成的固定伤害、百分比伤害提升100%|（所有特效boss无效）|回能Ⅰ：持有精灵使用技能后恢复所有技能1点PP值，下场不保留|失能Ⅰ：持有精灵使用技能后降低所有技能1点PP值，下场不保留",
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1700",
      "revision": "5682455e",
      "loadedAt": "2026-10-22T06:49:33.446Z"
    }
  },
  {
    "id": 36503,
    "name": "守一",
    "hash": "65b15f06",
    "description": "自身持有回能标记时先制+2；对手持有失能标记时先制+2；消除对手回合类效果，消除成功则2回合内对手属性技能命中效果失效；吸取对手能力提升状态，吸取成功则2回合内对手攻击技能无法造成伤害且命中效果失效",
    "effectInstances": [
      {
        "id": 1940,
        "args": [],
        "description": "自身持有回能标记时先制+2"
      },
      {
        "id": 1941,
        "args": [],
        "description": "对手持有失能标记时先制+2"
      },
      {
        "id": 1922,
        "args": [
          2
        ],
        "description": "消除对手回合类效果，消除成功则2回合内对手属性技能命中效果失效"
      },
      {
        "id": 1776,
        "args": [
          2
        ],
        "description": "吸取对手能力提升状态，吸取成功则2回合内对手攻击技能无法造成伤害且命中效果失效"
      }
    ]
  },
  {
    "id": 36506,
    "name": "无为·魂切",
    "hash": "fea1f5a7",
    "description": "命中时100%的概率秒杀对方；若没有命中对手则自己失去全部体力",
    "effectInstances": [
      {
        "id": 36,
        "args": [
          100
        ],
        "description": "命中时100%的概率秒杀对方"
      },
      {
        "id": 72,
        "args": [],
        "description": "若没有命中对手则自己失去全部体力"
      }
    ]
  },
  {
    "id": 28265,
    "name": "天下之赜",
    "hash": "21f70f0",
    "description": "全属性+1，后出手时自身强化效果翻倍；解放自身当前持有的回能Ⅰ，解放成功则随机附加麻痹、害怕、疲惫中的1种异常状态；解放对手当前持有的失能Ⅰ，解放成功则随机附加冰封、焚烬、感染中的1种异常状态；下1回合令自身所有技能先制+3",
    "effectInstances": [
      {
        "id": 1344,
        "args": [
          1
        ],
        "description": "全属性+1，后出手时自身强化效果翻倍"
      },
      {
        "id": 1942,
        "args": [
          1
        ],
        "description": "解放自身当前持有的回能Ⅰ，解放成功则随机附加麻痹、害怕、疲惫中的1种异常状态"
      },
      {
        "id": 1943,
        "args": [
          1
        ],
        "description": "解放对手当前持有的失能Ⅰ，解放成功则随机附加冰封、焚烬、感染中的1种异常状态"
      },
      {
        "id": 843,
        "args": [
          1,
          3
        ],
        "description": "下1回合令自身所有技能先制+3"
      }
    ]
  },
  {
    "id": 36507,
    "name": "咒始·光影诞",
    "hash": "519c9d41",
    "description": "若自身未持有回能Ⅰ则为自身附加持续3回合的回能Ⅰ，若自身已持有回能Ⅰ则将回合数刷新至3回合；若对手未持有失能Ⅰ则为对手附加持续3回合的失能Ⅰ，若对手已持有失能Ⅰ则将回合数刷新至3回合",
    "effectInstances": [
      {
        "id": 1944,
        "args": [
          3,
          3
        ],
        "description": "若自身未持有回能Ⅰ则为自身附加持续3回合的回能Ⅰ，若自身已持有回能Ⅰ则将回合数刷新至3回合"
      },
      {
        "id": 1945,
        "args": [
          3,
          3
        ],
        "description": "若对手未持有失能Ⅰ则为对手附加持续3回合的失能Ⅰ，若对手已持有失能Ⅰ则将回合数刷新至3回合"
      }
    ]
  },
  {
    "id": 37022,
    "name": "玄一",
    "hash": "790c834f",
    "description": "对手持有失能时必定命中且无视攻击免疫效果；自身持有回能时先制+1且附加对手最大体力1/4的百分比伤害；消除对手回合类效果，消除成功则2回合内对手属性技能命中效果失效；吸取对手能力提升状态，吸取成功则2回合内对手攻击技能无法造成伤害且命中效果失效",
    "effectInstances": [
      {
        "id": 2130,
        "args": [],
        "description": "对手持有失能时必定命中且无视攻击免疫效果"
      },
      {
        "id": 2131,
        "args": [
          4
        ],
        "description": "自身持有回能时先制+1且附加对手最大体力1/4的百分比伤害"
      },
      {
        "id": 1922,
        "args": [
          2
        ],
        "description": "消除对手回合类效果，消除成功则2回合内对手属性技能命中效果失效"
      },
      {
        "id": 1776,
        "args": [
          2
        ],
        "description": "吸取对手能力提升状态，吸取成功则2回合内对手攻击技能无法造成伤害且命中效果失效"
      }
    ]
  }
]
```

### Q-N20-4489-001 解放的操作与成功条件

关联4489原版魂印1700及技能28265、36503、37022、36507实例，原文/参数/hash见上方及原始快照。

已查资料、缺口与战斗差异：1942/f0e0ceb3/[1]与1943/d024de7f/[1]的API原文只说解放，Wiki344400/344401重复同义原文，名词页解放/回能Ⅰ/失能Ⅰ不存在，API tag813/648f1617只有施加异常分类，没有操作定义。已完成同技1344/843、两限定异常池公共机制；这两完整实例尚未实现，不注册空处理器。消耗并移除标记与其他操作会改变当次PP回能/失能及魂印结束后增伤，因此不猜任一选项。

问题：请明确这里解放标记执行什么操作、何时算成功，以及是否立即移除对应标记？

我的回答：解放：直接删除对应标记。成功删除就算成功；立即移除；1995同时解放多种三色龙鳞时奖励持续回合逐种累加，解放白鳞同时触发其消失四清

### Q-N20-4489-002 特殊PP标记是否属于可消回合

关联4489原版魂印1700及技能28265、36503、37022、36507实例，原文/参数/hash见上方及原始快照。

已查资料、缺口与战斗差异：魂印1700与1944/1945写3回合与下场不保留，没有明确普通消回合是否影响。已查API/Wiki；现有特殊标记的个别用户答案不扩展。给予/刷新/使用后PP/自然到期、快照免疫/300体力/300固定和次回增伤已实做；只有清回合目标持标记且无保护时显式待答。若能清，应触发对应消失分支；若不能清，不能单凭标记判消除成功。

问题：回能Ⅰ和失能Ⅰ能否被普通消除回合类效果清除，并计入清除成功？

我的回答：不可以，回体Ⅰ、失体Ⅰ和白色龙鳞也都不能被普通消回合清除

### Q-N20-4489-003 回能标记的PP回复来源分类

关联4489原版魂印1700及技能28265、36503、37022、36507实例，原文/参数/hash见上方及原始快照。

已查资料、缺口与战斗差异：标记可来自魂印或技能，源只描述持有者用技能后回复PP，未说明对仅阻止技能恢复PP的领域如何分类。普通无阻止场景已实现实际PP变化；遇仅技能PP恢复阻止且持有回能时显式guard，不按获取途径猜当前恢复属于技能/魂印或独立状态。

问题：回能Ⅰ触发的PP恢复是否会被仅阻止通过技能恢复PP的效果阻止，还是独立标记回复（是否随获取来源不同）？

我的回答：独立标记回复；	回体Ⅰ也是独立标记回复，失体Ⅰ的100固定伤害归持有者自身受伤

已有公共问题关联：Q-N20-4329-006：36506无为·魂切/fea1f5a7/i0，36[100]命中时100%的概率秒杀对方；成功分支死亡类型/保命/事件待答，当前普通MISS执行72直接失去全部体力已实做。Q-N20-4472-002：同技i1，72[]若没有命中对手则自己失去全部体力；普通命中率MISS已实做，失明或整招失效是否算未命中仍待答，不自动扩张以后648的回答。

玄一37022是普通追加技能，激活道具1725861/7f269e5f；来源is_fifth=false，全部18招仅36508为第五，不建不必要的双第五授权问题。原版/强化来源核对未发现另一个魂印版本。

4489处理状态：2026-10-22T07:47:46.383Z 固定50只42只独立工作完成；4489全18招/52项审核，147/147含20自身与8旧目标，追加自身21/21退出0（重叠不累计）。3新问题与2公共关联仅追加原MD；解放未知全实例明确未实现，不拿诊断代替。未部署未验收，扫描4494，正式4329；剩8只，必要复验52中3语义前置待答，最终整库待完成，停止4505。

## 4494 嫉妒·哲利斯（2026-10-22T08:03:22.474Z）

API源research/4494-source-check.json（第一次非JSON失败、第二次缓存续查完成），完整快照research/4494-reviewed-snapshot.json；Wiki research/4494-wiki-source.json及4494-jealousy-wiki-source.json，额外道具和标签research/4494-jealousy-extra-source.json。API宠物d0747521，魂印1708/3f3faf99/eid2094/[50,25,1,500,1,1]。普通伙伴29476/e9952093，道具1728538/48b68ab，实体道具48d6b515只说开启技能。Wiki精灵359658/技能36532=314096、29476=388738、效果1500=370483、2596=388794，模板效果说明357047无嫉妒定义。

完整关联原文、有序效果与参数、来源版本：
```json
[
  {
    "id": 1708,
    "description": "回合开始时若对手的最大体力值高于自身，则当回合自身造成的攻击伤害提升50%，受到的攻击伤害减少25%；|回合开始时若对手的速度值高于自身，则令对手防御、速度等级-1；|自身被击败时，己方每阵亡一只精灵附加给对手500点固定伤害，造成致死伤害时消除对手回合类效果|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手的最大体力值高于自身，则当回合自身造成的<b>攻击伤害</b><color=#64F9FA>提升</color>50%，受到的<b>攻击伤害</b><color=#64F9FA>减少</color>25%\r\n<indent=32><sprite=4><indent=48>若对手的速度值高于自身，则令对手防御、速度等级-1\r\n\r\n<indent=0><sprite=0><indent=16>被击败效果：\r\n<indent=16><sprite=3><indent=32>自身被击败时己方当前每阵亡一只精灵<color=#64F9FA>附加</color>给对手500点<b>固定伤害</b>\r\n<indent=32><sprite=4><indent=48>造成致死伤害时额外<color=#64F9FA>消除</color>对手<b>回合类效果</b>",
    "analyze_desc": "",
    "hash": "3f3faf99",
    "eid": 2094,
    "args": [
      50,
      25,
      1,
      500,
      1,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1708",
      "revision": "3f3faf99",
      "loadedAt": "2026-10-22T07:48:04.808Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 24525,
    "name": "无尽索取",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      57,
      125,
      48
    ],
    "effectInstances": [
      {
        "id": 57,
        "args": [
          3,
          3
        ],
        "description": "3回合内每回合使用技能恢复自身最大体力的1/3"
      },
      {
        "id": 125,
        "args": [
          2,
          280
        ],
        "description": "2回合内每回合被攻击所受到的伤害不超过280"
      },
      {
        "id": 48,
        "args": [
          4
        ],
        "description": "4回合内免疫所有受到的异常状态"
      }
    ],
    "description": "3回合内每回合使用技能恢复自身最大体力的1/3；2回合内每回合被攻击所受到的伤害不超过280；4回合内免疫所有受到的异常状态",
    "revision": "seerapi:8ca8a504",
    "hash": "8ca8a504",
    "level": 49,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 18265,
    "name": "罪恶锁链",
    "type": "暗影神秘",
    "kind": "physical",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      3,
      587
    ],
    "effectInstances": [
      {
        "id": 3,
        "args": [],
        "description": "解除自身的能力下降状态"
      },
      {
        "id": 587,
        "args": [
          2,
          500
        ],
        "description": "2回合内若被对手击败则对手损失500点体力，造成致命伤害时，对手剩余1点体力"
      }
    ],
    "description": "解除自身的能力下降状态；2回合内若被对手击败则对手损失500点体力，造成致命伤害时，对手剩余1点体力",
    "revision": "seerapi:a14633b9",
    "hash": "a14633b9",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28276,
    "name": "灼魂炼骸",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      191,
      1067,
      1834,
      843
    ],
    "effectInstances": [
      {
        "id": 191,
        "args": [
          4
        ],
        "description": "4回合内免疫并反弹所有受到的异常状态"
      },
      {
        "id": 1067,
        "args": [
          4,
          3,
          2,
          3
        ],
        "description": "4回合内每回合使用技能恢复自身最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果转变为吸取对手最大体力的1/3"
      },
      {
        "id": 1834,
        "args": [
          1,
          280,
          100
        ],
        "description": "自身下1次受到的攻击伤害不超过280，并反弹给对手原本超出部分100%的百分比伤害"
      },
      {
        "id": 843,
        "args": [
          2,
          2
        ],
        "description": "下2回合令自身所有技能先制+2"
      }
    ],
    "description": "4回合内免疫并反弹所有受到的异常状态；4回合内每回合使用技能恢复自身最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果转变为吸取对手最大体力的1/3；自身下1次受到的攻击伤害不超过280，并反弹给对手原本超出部分100%的百分比伤害；下2回合令自身所有技能先制+2",
    "revision": "seerapi:886ad712",
    "hash": "886ad712",
    "level": 72,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36532,
    "name": "千骨剐心",
    "type": "暗影神秘",
    "kind": "special",
    "power": 1,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1500,
      1661
    ],
    "effectInstances": [
      {
        "id": 1500,
        "args": [
          100,
          140,
          280
        ],
        "description": "1回合做100-140次攻击，自身处于护盾状态下连击上限为280"
      },
      {
        "id": 1661,
        "args": [
          280,
          100,
          6
        ],
        "description": "获得280点护盾，护盾消失时100%的概率使对手害怕"
      }
    ],
    "description": "1回合做100-140次攻击，自身处于护盾状态下连击上限为280；获得280点护盾，护盾消失时100%的概率使对手害怕",
    "revision": "seerapi:ec3ee8cd",
    "hash": "ec3ee8cd",
    "level": 73,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 29476,
    "name": "残心静火",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      2595,
      1338,
      2596,
      776,
      2540
    ],
    "effectInstances": [
      {
        "id": 2595,
        "args": [
          50,
          6,
          15,
          1,
          1
        ],
        "description": "50%令对手害怕，未触发则吸取对手最大体力的15%，自身每有1种能力值低于对手此效果重复1次"
      },
      {
        "id": 1338,
        "args": [
          1
        ],
        "description": "全属性+1，对手处于能力下降状态时强化效果翻倍"
      },
      {
        "id": 2596,
        "args": [],
        "description": "解除自身所处的异常状态并获得3回合嫉妒，每解除1种异常状态，额外获得1回合"
      },
      {
        "id": 776,
        "args": [
          2
        ],
        "description": "下2回合自身造成的攻击伤害翻倍"
      },
      {
        "id": 2540,
        "args": [
          0,
          1,
          1
        ],
        "description": "双方每有1方精灵先制为0，对手下1回合技能先制-1"
      }
    ],
    "description": "50%令对手害怕，未触发则吸取对手最大体力的15%，自身每有1种能力值低于对手此效果重复1次；全属性+1，对手处于能力下降状态时强化效果翻倍；解除自身所处的异常状态并获得3回合嫉妒，每解除1种异常状态，额外获得1回合；下2回合自身造成的攻击伤害翻倍；双方每有1方精灵先制为0，对手下1回合技能先制-1",
    "revision": "seerapi:e9952093",
    "hash": "e9952093",
    "level": 0,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": true,
      "skill_activation_item": {
        "id": 1728538,
        "url": "https://api.seerapi.com/v1/skill_activation_item/1728538"
      },
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4494-001 高连击精确源的参数授权

36532/5753fb3b/i0，1500/ebd0c3e1/[100,140,280]。API和Wiki均明确100–140、有盾280，技能威力1，不按常见5–10改写。当前规则1500参数各1..10，真实源编译拒绝。最小方案仅允许该技能ID/hash/实例序号/精确数组，保留其它参数拒绝；本轮禁止扩大既有兼容授权，未自行实施。其余1661护盾/害怕和该招基础威力1已实现状态测试。

问题：是否授权仅为36532/5753fb3b/i0的1500[100,140,280]增加精确参数兼容，并按源实施100–140、有盾上限280次？

我的回答：授权

### Q-N20-4494-002 嫉妒状态没有实际效果定义

29476/e9952093/i2，2596/7333272f/[]。原文只有解除异常并获得3回合嫉妒、每解一种额外1回，没有嫉妒效果。API自身技能、效果、激活道具/物品、分类标签37134仅解除异常；Wiki技能与效果相同，嫉妒独立页面缺失、模板效果说明无项。定向站内网页检索仅找到精灵同词条，不以PVE关卡因子当此标记定义。已经实际解除异常并按真实解除数量算时长，尚未实施嫉妒状态本身，也不以计数诊断冒充状态完成。

问题：请给出此处嫉妒状态的完整效果、触发时机和交互定义（或可核实的来源）？

我的回答：嫉妒
自身的攻击将对手的能力提升状态视为能力下降状态；自身使用攻击技能时，若对手处于回合类效果，则当回合造成的攻击伤提升100%

### Q-N20-4494-003 能力值比较的计算基数与范围

1708回合初速度值比较及29476/i0，2595/9392b542/[50,6,15,1,1]“自身每有1种能力值低于对手此效果重复1次”。源没有说明比较是否计能力等级、重复计哪些能力（体力是否计入，命中是否计入）。当前仅在明确五项攻防速面板比较与含等级比较计数相同且体力不构成额外低项时执行共同结果；魂印两比较结论一致时降敌防速。每次独立50%害怕，失败理论敌maxHP15%吸取，禁疗/免粉仍公共；不同计算导致不同次数和吸取，不猜字段范围。

问题：请明确这两处能力值/速度值比较是否计能力等级，以及2595计入的具体能力项目？

我的回答：不计入；双攻双防速度体力

公共关联不新编号：Q-N20-4482-003：18265/a14633b9/i1，587[2,500]，500损失类型/保1路径待答，当前仅明确2回窗口和被击败前置，不用诊断冒充HP实现；Q-N20-4438-001：24525/8ca8a504/i1，125[2,280]的每回合被攻击所受伤害上限之多段逐段/合计单位，以及28276/886ad712/i2，1834[1,280,100]下次受击按段/整招的消费单位。单段正攻击1834实际限280并百分比反弹超额，固定不消费；Q-N20-4359-003关联1834完整0（免疫或盾全抵挡）是否消费次数，显式guard而非猜测。

魂印死亡自身当次阵亡对应500固定伤害、致死成功清回合已完成；额外队友阵亡数量延期，不能把当前自身500一起延期。

4494处理状态：2026-10-22T08:03:22.474Z 固定50只43只独立工作完成；4494全23招/70项逐项审核，118/118含21自身及受影响旧目标退出0（重叠不累计）。3新问题及3公共关联只追加原MD；1500未授权/嫉妒未知/587实际HP类型未实施，明确保留审核缺口。未部署未验收；扫描4496，正式4329；剩7只。必要旧复验54中3已知前置待答，最终整库待完成，停止4505。

## 4496 箫澈逐项审核与公共问题关联（2026-10-22T08:15:40.002Z）

来源research/4496-source-check.json、4496-reviewed-snapshot.json、4496-wiki-source.json；魂印https://api.seerapi.com/v1/soulmark/1711，hash58b6e759/eid2099/[300,1,3,300,1,3,1]。无新增主问题，复用Q-N20-4438-001但不擅自扩大将来的具体回答。源原文和参数：
```json
[
  {
    "id": 1711,
    "description": "每次自身受到≥300的攻击伤害则会触发哀霆之声：免疫下1次受到的固定伤害、百分比伤害且附加对手最大体力1/3的百分比伤害；|每次自身受到≥300的固定伤害、百分比伤害则会触发悲龙之鸣：免疫下1次受到的攻击伤害且恢复自身最大体力的1/3；|战斗阶段结束时，若当回合自身均未受到攻击伤害、固定伤害、百分比伤害，则消除对手回合类效果和能力提升状态，消除任意一项成功则随机附加麻痹或害怕中的1种异常状态|（哀霆之声与悲龙之鸣在自身体力为0时不会触发，所有特效boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>每次自身受到≥300的攻击伤害时会触发哀霆之声：<color=#64F9FA>免疫</color>下1次受到的<b>固定伤害、百分比伤害</b>且<color=#64F9FA>附加</color>对手最大体力1/3的<b>百分比伤害</b>，体力为0时不触发\r\n<indent=16><sprite=3><indent=32>每次自身受到≥300的固定伤害、百分比伤害时会触发悲龙之鸣：<color=#64F9FA>抵挡</color>下1次受到的<b>攻击</b>且<color=#64F9FA>恢复</color>自身最大体力的1/3，体力为0时不触发\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时，若当回合自身均未受到攻击伤害、固定伤害、百分比伤害，则<color=#64F9FA>消除</color>对手<b>回合类效果</b>和<b>能力提升状态</b>\r\n<indent=32><sprite=4><indent=48>消除任意一项成功则随机附加麻痹或害怕中的1种<b>异常状态</b>",
    "analyze_desc": "",
    "hash": "58b6e759",
    "eid": 2099,
    "args": [
      300,
      1,
      3,
      300,
      1,
      3,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1711",
      "revision": "58b6e759",
      "loadedAt": "2026-10-22T08:03:32.675Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 36543,
    "name": "记往岁",
    "type": "电",
    "kind": "special",
    "power": 85,
    "pp": 20,
    "priority": 3,
    "accuracy": 97,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1768,
      1835
    ],
    "effectInstances": [
      {
        "id": 1768,
        "args": [
          1,
          300
        ],
        "description": "将自身下1次受到的攻击伤害转化为等量护盾，最多获得300点"
      },
      {
        "id": 1835,
        "args": [
          1
        ],
        "description": "100%令对手全属性+1"
      }
    ],
    "description": "将自身下1次受到的攻击伤害转化为等量护盾，最多获得300点；100%令对手全属性+1",
    "revision": "seerapi:baf2b4d6",
    "hash": "baf2b4d6",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

关联 Q-N20-4438-001：1711“每次自身受到≥300的攻击伤害”在多段攻击时按每段还是整次攻击合计；悲龙之鸣“免疫下1次受到的攻击伤害”及36543记往岁/baf2b4d6/i0，1768[1,300]“将自身下1次受到的攻击伤害转化为等量护盾，最多获得300点”的多段消费单位。API及Wiki措辞相同，没有段/整招说明；现有公共框架行为不当作用户答案。已实现并测试单段299/300边界、完整伤害/实际HP损失、HP0不触/保1实际0仍触、固粉恢复和对应免疫、战阶三类正伤快照/清除两项不短路/限定随机无补抽、1768单次已知转盾。多段出现解释差异时显式guard，未部署验收。其余17技能全部有序效果逐项核对，无额外新疑问；真正多精灵分支未发现，不以未来队伍为由延期当前效果。

固有先制1634/1782与威力1946/有罩1870在仅命中载荷失效时保留，命中附效仍被封；当前旧4321及前两只/public专项真实通过，未扩大参数兼容授权。

4496状态：2026-10-22T08:15:40.002Z 固定50只44只独立工作完成；4496全17招/43项逐项审核，144/144含18自身、旧4321及前两只/public退出0（重叠不累计）。无新增主问题，仅原MD关联公共4438-001具体多段实例；未部署未验收。扫描4498、正式4329，剩6只，必要旧正式复验54（3前置待答），最终整库仍待完成，停止4505。

## 4498 天后·弗丽嘉逐项审核（2026-10-22T08:36:46.643Z）

来源research/4498-source-check.json、4498-reviewed-snapshot.json、4498-wiki-source.json及4498-heal-wiki-source.json。魂印https://api.seerapi.com/v1/soulmark/1713 hash12e539ee/eid2098/[1,0]；Wiki魂印320250、1952=344410、1641=344099、技能36556=314120、效果105=348927，三个预言独立页缺失，魂印本身明确其效果。所有原文/格式化字段/参数/版本不改写：
```json
[
  {
    "id": 1713,
    "description": "每次登场时为对手附加挫折预言与迷失预言，之后每个战斗阶段结束时若对手当前精灵所持有的两种预言都已通过使用技能消耗，则为自身附加凯旋预言；|回合开始时若自身体力高于最大体力的50%，则下回合开始时解除自身所处的异常状态与能力下降状态，解除成功任意一项则当回合自身所有技能先制+1；|战斗阶段结束时若自身体力低于最大体力的50%，则与己方场下体力最高的首位精灵交换体力并恢复自身所有技能1点PP值|挫折预言：下次攻击技能不计算属性克制倍数与本系属性加成且使用后受到150点真实伤害|迷失预言：下次属性技能消耗的PP值翻倍且使用后受到3回合混乱|凯旋预言：下次击败对手时恢复自身全部体力和所有技能PP值，下场保留|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时为对手附加<color=#FFF779>挫折预言</color>与<color=#FFF779>迷失预言</color>\r\n<indent=32><sprite=4><indent=48>之后每个战斗阶段结束时若本回合对手的两种预言都已消耗，则为自身附加<color=#FFF779>凯旋预言</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时若自身体力高于最大体力的50%，则下回合开始时<color=#64F9FA>解除</color>自身所处的<b>异常状态</b>与<b>能力下降状态</b>\r\n<indent=32><sprite=4><indent=48>解除成功任意一项则当回合自身所有技能<b>先制</b>+1\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若自身体力低于最大体力的50%，则与己方场下体力最高的精灵<color=#64F9FA>交换</color><b>体力值</b>并<color=#64F9FA>恢复</color>自身所有技能1点<b>PP值</b>\r\n\r\n<indent=0><sprite=5><indent=15>挫折预言：\r\n<indent=16><sprite=6><indent=32>下次使用的攻击技能<color=#64F9FA>不计算</color><b>属性克制倍数</b>与<b>本系加成</b>且使用后受到150点<b>真实伤害</b>\r\n\r\n<indent=0><sprite=5><indent=15>迷失预言：\r\n<indent=16><sprite=6><indent=32>下次使用的属性技能消耗的<b>PP值</b>翻倍且使用后受到3回合混乱\r\n\r\n<indent=0><sprite=5><indent=15>凯旋预言（下场保留）：\r\n<indent=16><sprite=6><indent=32>下次击败对手时<color=#64F9FA>恢复</color>自身全部<b>体力</b>和所有技能<b>PP值</b> ",
    "analyze_desc": "",
    "hash": "12e539ee",
    "eid": 2098,
    "args": [
      1,
      0
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1713",
      "revision": "12e539ee",
      "loadedAt": "2026-10-22T08:15:49.736Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 36554,
    "name": "神眷之惠",
    "type": "自然",
    "kind": "special",
    "power": 80,
    "pp": 20,
    "priority": 3,
    "accuracy": 98,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1164,
      1952
    ],
    "effectInstances": [
      {
        "id": 1164,
        "args": [],
        "description": "反转对手能力提升状态，若该效果未满足条件或反转失败则消除对手能力提升状态和回合类效果"
      },
      {
        "id": 1952,
        "args": [
          100,
          8
        ],
        "description": "无视对手能力提升状态，无视成功则100%令对手睡眠"
      }
    ],
    "description": "反转对手能力提升状态，若该效果未满足条件或反转失败则消除对手能力提升状态和回合类效果；无视对手能力提升状态，无视成功则100%令对手睡眠",
    "revision": "seerapi:302aad3e",
    "hash": "302aad3e",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36556,
    "name": "诸神黎明",
    "type": "自然",
    "kind": "special",
    "power": 130,
    "pp": 10,
    "priority": 0,
    "accuracy": 97,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      968,
      1641
    ],
    "effectInstances": [
      {
        "id": 968,
        "args": [
          50,
          31
        ],
        "description": "命中对手后有50%使对手臣服，先出手时概率翻倍"
      },
      {
        "id": 1641,
        "args": [
          100,
          2
        ],
        "description": "自身处于能力提升状态时造成伤害的100%恢复自身体力值，当前体力低于最大体力的1/2时附加等量百分比伤害"
      }
    ],
    "description": "命中对手后有50%使对手臣服，先出手时概率翻倍；自身处于能力提升状态时造成伤害的100%恢复自身体力值，当前体力低于最大体力的1/2时附加等量百分比伤害",
    "revision": "seerapi:16d4be19",
    "hash": "16d4be19",
    "level": 45,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36558,
    "name": "海雾宫之扉",
    "type": "自然",
    "kind": "special",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1964,
      1305,
      1934
    ],
    "effectInstances": [
      {
        "id": 1964,
        "args": [],
        "description": "自身拥有凯旋预言时先制+1"
      },
      {
        "id": 1305,
        "args": [
          100,
          100
        ],
        "description": "己方每有一只精灵存活则恢复100点体力，每有一只精灵死亡则附加100点固定伤害"
      },
      {
        "id": 1934,
        "args": [
          30
        ],
        "description": "己方场下每死亡一只精灵则造成的攻击伤害提升30%"
      }
    ],
    "description": "自身拥有凯旋预言时先制+1；己方每有一只精灵存活则恢复100点体力，每有一只精灵死亡则附加100点固定伤害；己方场下每死亡一只精灵则造成的攻击伤害提升30%",
    "revision": "seerapi:8ec4d01a",
    "hash": "8ec4d01a",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36559,
    "name": "千万时之眸",
    "type": "自然",
    "kind": "special",
    "power": 160,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      699,
      1032,
      1798,
      1965
    ],
    "effectInstances": [
      {
        "id": 699,
        "args": [],
        "description": "无视攻击免疫效果"
      },
      {
        "id": 1032,
        "args": [
          1
        ],
        "description": "消除对手回合类效果，消除成功则下1回合令对手使用的攻击技能无效"
      },
      {
        "id": 1798,
        "args": [
          100,
          8,
          1
        ],
        "description": "下回合对手未使用攻击技能则100%令对手睡眠，未触发则令对手下1次属性技能失效"
      },
      {
        "id": 1965,
        "args": [
          30
        ],
        "description": "附加己方存活精灵共计已损失体力30%的百分比伤害，自身持有凯旋预言时转化为真实伤害，且当回合击败对手后恢复己方场下体力最低的首位精灵全部体力和所有技能PP值"
      }
    ],
    "description": "无视攻击免疫效果；消除对手回合类效果，消除成功则下1回合令对手使用的攻击技能无效；下回合对手未使用攻击技能则100%令对手睡眠，未触发则令对手下1次属性技能失效；附加己方存活精灵共计已损失体力30%的百分比伤害，自身持有凯旋预言时转化为真实伤害，且当回合击败对手后恢复己方场下体力最低的首位精灵全部体力和所有技能PP值",
    "revision": "seerapi:c8c8c258",
    "hash": "c8c8c258",
    "level": 76,
    "fifth": true,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "fifth"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4498-001 凯旋给予条件的API内部矛盾

原desc是“之后每个战斗阶段结束时若对手当前精灵所持有的两种预言都已通过使用技能消耗”，格式化字段则为“若本回合对手的两种预言都已消耗”。Wiki同原desc，无独立说明能裁决API内部冲突。按累计，先一回用攻击、次回用属性即可凯旋，之后战阶还涉及是否反复补给；按同回合则普通一回只一次行动通常不能满足。已做两原预言真实使用后消费、前者无克制/本系和150真伤，后者PP双倍/3回混乱；两种都在当前回合通过真实使用（另一项为可控前置）的共同结果给予凯旋，并实测凯旋KO满HP/PP/一次消费。跨回合分歧只记pending，不猜授予。

问题：请明确凯旋条件按累计消耗还是必须同一回合，以及满足一次后之后每回合是否仍重新给予凯旋？

我的回答：按累计消耗；只给一次

### Q-N20-4498-002 1952无视成功的判据

36554/302aad3e/i1，1952/d51269ca/[100,8]。API及Wiki只说无视能力提升状态、无视成功睡眠，未定义成功是存在任一正级还是必须实际影响该次技能计算。已完成该次伤害防御正级确实被忽略且非暴击时睡眠、无正级不睡；只有攻击/速度等其它正级、暴击本就不计算防御正级等条件会产生解释差异，显式待答，不拿旧1952代码作来源。原1164反转仍在命中后执行，无视是否成功取伤害计算前原状态，不能被之后反转/吸强抹掉。

问题：1952的无视成功要求哪项能力提升实际被本次计算忽略，还是只要敌有任一正级即可（包括本次暴击本就无视防御的情况）？

我的回答：必须实际忽略正特防或正速度才算成功、暴击本已忽略防御时不判定特防，以及4114物理伙伴技能改按防御或速度判断

### Q-N20-4498-003 1641回复基数是否按完整结算伤害

36556/16d4be19/i1，1641/dfd53381/[100,2]。API、Wiki技能314120/效果344099均只写造成伤害的100%恢复，未区分过量/保留1HP时完整伤害与实际HP损失。现有完整伤害/实际损失规则要求独立保留并禁止机械全替换，汲取/固定吸取/自身maxHP粉伤等量回复确认未明确覆盖这个伤害吸血。普通未截断的共同数值回复和回复后低半体附等量粉、禁疗/无强化失败已实测；当前实例两种伤量分歧时guard。不改旧1641可用版本，先列实例关联。

问题：请明确1641的百分比回复以完整结算伤害还是实际扣除目标HP为基数，保1实际损失0但完整正伤时是否仍回复？

我的回答：完整结算伤害；回复

本只单体已做：原魂印当前初次入场、两预言真实使用消耗及负效、已持有凯旋的KO全回复、上回合严格高半体安排下回合解除/仅真实成功给当前先制、低半体自身PP+1；所有17招及源有序实例逐项审核。延期只保留真实再次登场、凯旋下场保留、与场下最高HP首位交换体力；1305队伍其它成员存活/死亡贡献（当前自身回复100已做）；1934场下死亡增伤；1965其它存活精灵已损HP贡献和凯旋KO恢复场下最低首位（当前自身已损HP30%的粉/真分支已做）。

公共1305混合词条修复：旧3550/31581/[100,100]和3705/36944/[80,80]当前自身存活一只回复分别100/80，全部保留源和参数，不编造队友。旧3705原“全部纯延期、自身不回复”断言不符合当前混合词条规则，旧断言归档research/3705-before-4498-1305-mixed.test.cjs.archive，具体失败与修正research/4498-1305-prior-assertion-analysis.json；原敌HP/无先制/1934/2017/延期断言仍保留。

4498处理状态：2026-10-22T08:38:30.045Z 固定50只45只独立工作完成；4498全17招/49项审核，93/93含18自身、旧3550/3705与前两只退出0（重叠不累计）。3新问题只追加原MD，未知分支未部署未验收；当前自身混合词条1305/1965独立分支已做，真队伍部分原文登记。扫描4499，正式4329；剩5只。必要旧正式复验55中3前置待答，最终整库待完成，停止4505。

4498审核补记：苍鹭幻翎28289/4d3b6568的1669[1,50]当前自身存活贡献为50%全属性1或2，971[4,3,2]原实例理论吸取，81[2]及843[2,2]次两回合真实执行均专项覆盖；额外背包队友贡献独立登记延期，不把当前自身概率一起延期。最新93/93含18自身，日志research/4498-independent-final-v6.log（与旧目标记录重叠不累计）。

## 4499 德布比特逐项审核（2026-10-22T09:04:02.388Z）

主证据research/4499-source-check.json、4499-reviewed-snapshot.json、4499-wiki-source.json。网络非JSON分别记录28286/1970/2133，28286第三次原始响应请求成功a3d661d6（4499-28286-raw-response.json），其余恢复后全部API资料齐全，没有遗留外部阻塞或伪造版本。魂印https://api.seerapi.com/v1/soulmark/1714 hash5cd3c296/eid2101/[1,0]；Wiki魂印320251、28285=306670、28286=306671、36552=314116、37021=314579，1966–1971 revisions344424–344429，1972=348844；回体Ⅰ/失体Ⅰ/解放独立页缺失。完整原文、原API格式字段、所有效果有序实例与参数：
```json
[
  {
    "id": 1714,
    "description": "每次登场时根据双方当前场下的阵亡精灵总数获得如下效果：|≥2只：为自身附加持续3回合的回体Ⅰ（若自身已持有回体Ⅰ则将回合数刷新至3回合），为对手附加持续3回合的失体Ⅰ（若对手已持有失体Ⅰ则将回合数刷新至3回合）；|≥4只：当回合免疫受到的能力下降状态；|≥6只：当回合免疫受到的异常状态；|≥8只：当回合所有技能必定先出手；|≥10只：当回合令对手使用的技能无效；|回合开始时若自身持有回体Ⅰ，则当前己方场下每有一只精灵阵亡，当回合自身造成的攻击伤害提升20%，若当回合结束后自身持有的回体Ⅰ消失则消除对手回合类效果，消除成功则令对手下回合使用的攻击技能无效；|回合开始时若对手持有失体Ⅰ，则当前对方场下每有一只精灵阵亡，当回合自身造成的固定伤害、百分比伤害提升10%，若当回合结束后对手持有的失体Ⅰ消失则消除对手能力提升状态，消除成功则令对手下回合使用的属性技能无效|（所有特效boss无效）|回体Ⅰ：持有精灵使用技能后恢复自身100点体力，下场不保留|失体Ⅰ：持有精灵使用技能后受到100点固定伤害，下场不保留",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时根据双方当前场下的阵亡精灵总数获得如下效果：\r\n<indent=32><sprite=4><indent=48>≥2只：为自身附加持续3回合的<color=#FFF779>回体</color>，为对手附加持续3回合的<color=#FFF779>失体</color>\r\n<indent=32><sprite=4><indent=48>≥4只：当回合<color=#64F9FA>免疫</color>受到的<b>能力下降状态</b>\r\n<indent=32><sprite=4><indent=48>≥6只：当回合<color=#64F9FA>免疫</color>受到的<b>异常状态</b>\r\n<indent=32><sprite=4><indent=48>≥8只：当回合<b>所有技能</b><color=#64F9FA>必定先出手</color>\r\n<indent=32><sprite=4><indent=48>≥10只：当回合令对手使用的技能<color=#64F9FA>无效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身持有回体，则当前己方场下每有一只阵亡精灵，当回合自身造成的<b>攻击伤害</b><color=#64F9FA>提升</color>20%\r\n<indent=32><sprite=4><sprite=4><indent=64>若当回合结束后自身持有的回体消失则<color=#64F9FA>消除</color>对手<b>回合类效果</b>\r\n<indent=32><sprite=4><sprite=4><sprite=4><indent=80>消除成功则令对手下回合使用的<b>攻击技能</b><color=#64F9FA>无效</color>\r\n<indent=32><sprite=4><indent=48>若对手持有失体，则当前对方场下每有一只阵亡精灵，当回合自身造成的<b>固定伤害</b>、<b>百分比</b><color=#64F9FA>提升</color>20%\r\n<indent=32><sprite=4><sprite=4><indent=64>若当回合结束后对手持有的失体消失则<color=#64F9FA>消除</color>对手<b>能力提升状态</b>\r\n<indent=32><sprite=4><sprite=4><sprite=4><indent=80>消除成功则令对手下回合使用的<b>属性技能</b><color=#64F9FA>无效</color>\r\n\r\n<indent=0><sprite=5><indent=15>回体：\r\n<indent=16><sprite=6><indent=32>使用技能后<color=#64F9FA>恢复</color>100点<b>体力</b>\r\n\r\n<indent=0><sprite=5><indent=15>失体：\r\n<indent=16><sprite=6><indent=32>使用技能后<color=#64F9FA>受到</color>100点<b>固定伤害</b>",
    "analyze_desc": "",
    "hash": "5cd3c296",
    "eid": 2101,
    "args": [
      1,
      0
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1714",
      "revision": "5cd3c296",
      "loadedAt": "2026-10-22T08:38:40.575Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 22661,
    "name": "痛苦压制",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      125
    ],
    "effectInstances": [
      {
        "id": 125,
        "args": [
          3,
          250
        ],
        "description": "3回合内每回合被攻击所受到的伤害不超过250"
      }
    ],
    "description": "3回合内每回合被攻击所受到的伤害不超过250",
    "revision": "seerapi:9f8af798",
    "hash": "9f8af798",
    "level": 13,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36548,
    "name": "归一",
    "type": "圣灵轮回",
    "kind": "special",
    "power": 85,
    "pp": 20,
    "priority": 3,
    "accuracy": 98,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1138,
      1966
    ],
    "effectInstances": [
      {
        "id": 1138,
        "args": [
          100,
          7,
          100,
          6
        ],
        "description": "消除对手回合类效果，消除成功则100%令对手疲惫，未触发则100%令对手害怕"
      },
      {
        "id": 1966,
        "args": [
          100,
          50
        ],
        "description": "消除对手能力提升状态，若消除成功且自身持有回体Ⅰ则下回合造成的攻击伤害提升100%，若消除成功且对手持有失体Ⅰ则下回合造成的固定伤害、百分比伤害提升50%"
      }
    ],
    "description": "消除对手回合类效果，消除成功则100%令对手疲惫，未触发则100%令对手害怕；消除对手能力提升状态，若消除成功且自身持有回体Ⅰ则下回合造成的攻击伤害提升100%，若消除成功且对手持有失体Ⅰ则下回合造成的固定伤害、百分比伤害提升50%",
    "revision": "seerapi:b683e2c6",
    "hash": "b683e2c6",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 22637,
    "name": "禁忌魔光",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      406
    ],
    "effectInstances": [
      {
        "id": 406,
        "args": [
          5,
          100,
          150
        ],
        "description": "5回合内受到攻击100%概率恢复150点体力"
      }
    ],
    "description": "5回合内受到攻击100%概率恢复150点体力",
    "revision": "seerapi:9a191895",
    "hash": "9a191895",
    "level": 33,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28285,
    "name": "诸行无常",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1967,
      1968,
      191,
      971
    ],
    "effectInstances": [
      {
        "id": 1967,
        "args": [
          2
        ],
        "description": "若自身持有回体标记则2回合内自身回合类效果无法被消除（后出手则延续1回合）"
      },
      {
        "id": 1968,
        "args": [
          3,
          3
        ],
        "description": "若对手未持有失体Ⅰ则为对手附加持续3回合的失体Ⅰ，若对手已持有失体Ⅰ则将回合数刷新至3回合"
      },
      {
        "id": 191,
        "args": [
          4
        ],
        "description": "4回合内免疫并反弹所有受到的异常状态"
      },
      {
        "id": 971,
        "args": [
          4,
          3,
          2
        ],
        "description": "4回合内每回合使用技能吸取对手最大体力的1/3，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
      }
    ],
    "description": "若自身持有回体标记则2回合内自身回合类效果无法被消除（后出手则延续1回合）；若对手未持有失体Ⅰ则为对手附加持续3回合的失体Ⅰ，若对手已持有失体Ⅰ则将回合数刷新至3回合；4回合内免疫并反弹所有受到的异常状态；4回合内每回合使用技能吸取对手最大体力的1/3，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
    "revision": "seerapi:7a3272f2",
    "hash": "7a3272f2",
    "level": 49,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36551,
    "name": "空·魂觉",
    "type": "圣灵轮回",
    "kind": "physical",
    "power": 0,
    "pp": 1,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      404,
      1237
    ],
    "effectInstances": [
      {
        "id": 404,
        "args": [],
        "description": "恢复双方全部体力"
      },
      {
        "id": 1237,
        "args": [],
        "description": "使双方精灵所有技能PP值归零；消除双方能力提升、下降状态以及回合类效果"
      }
    ],
    "description": "恢复双方全部体力；使双方精灵所有技能PP值归零；消除双方能力提升、下降状态以及回合类效果",
    "revision": "seerapi:b95882e4",
    "hash": "b95882e4",
    "level": 53,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28286,
    "name": "诸法无我",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1969,
      1970,
      1283,
      843
    ],
    "effectInstances": [
      {
        "id": 1969,
        "args": [
          2
        ],
        "description": "若对手持有失体标记则2回合内自身的能力提升状态无法被消除或吸取（后出手则延续1回合）"
      },
      {
        "id": 1970,
        "args": [
          3,
          3
        ],
        "description": "若自身未持有回体Ⅰ则为自身附加持续3回合的回体Ⅰ，若自身已持有回体Ⅰ则将回合数刷新至3回合"
      },
      {
        "id": 1283,
        "args": [
          1
        ],
        "description": "全属性+1，先出手时自身强化效果翻倍"
      },
      {
        "id": 843,
        "args": [
          2,
          2
        ],
        "description": "下2回合令自身所有技能先制+2"
      }
    ],
    "description": "若对手持有失体标记则2回合内自身的能力提升状态无法被消除或吸取（后出手则延续1回合）；若自身未持有回体Ⅰ则为自身附加持续3回合的回体Ⅰ，若自身已持有回体Ⅰ则将回合数刷新至3回合；全属性+1，先出手时自身强化效果翻倍；下2回合令自身所有技能先制+2",
    "revision": "seerapi:a3d661d6",
    "hash": "a3d661d6",
    "level": 57,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36552,
    "name": "缘起·苍生聚",
    "type": "圣灵轮回",
    "kind": "special",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      881,
      1221,
      1971,
      1156
    ],
    "effectInstances": [
      {
        "id": 881,
        "args": [],
        "description": "若自身处于能力下降状态则技能先制+3"
      },
      {
        "id": 1221,
        "args": [
          1
        ],
        "description": "反转自身能力下降状态，反转成功则自身免疫下1次受到的异常状态"
      },
      {
        "id": 1971,
        "args": [],
        "description": "未击败对手则解放自身当前持有的回体Ⅰ和对手当前持有的失体Ⅰ，解放成功任意一项则令对手下回合无法主动切换精灵且先制效果失效"
      },
      {
        "id": 1156,
        "args": [],
        "description": "击败对手则恢复自身全部体力和所有技能PP值"
      }
    ],
    "description": "若自身处于能力下降状态则技能先制+3；反转自身能力下降状态，反转成功则自身免疫下1次受到的异常状态；未击败对手则解放自身当前持有的回体Ⅰ和对手当前持有的失体Ⅰ，解放成功任意一项则令对手下回合无法主动切换精灵且先制效果失效；击败对手则恢复自身全部体力和所有技能PP值",
    "revision": "seerapi:16962886",
    "hash": "16962886",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36553,
    "name": "缘尽·鬼神散",
    "type": "圣灵轮回",
    "kind": "special",
    "power": 160,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      699,
      1568,
      1934,
      1972
    ],
    "effectInstances": [
      {
        "id": 699,
        "args": [],
        "description": "无视攻击免疫效果"
      },
      {
        "id": 1568,
        "args": [],
        "description": "无视护盾效果"
      },
      {
        "id": 1934,
        "args": [
          20
        ],
        "description": "己方场下每死亡一只精灵则造成的攻击伤害提升20%"
      },
      {
        "id": 1972,
        "args": [
          100
        ],
        "description": "对方场下每死亡一只精灵则附加给对手100点固定伤害"
      }
    ],
    "description": "无视攻击免疫效果；无视护盾效果；己方场下每死亡一只精灵则造成的攻击伤害提升20%；对方场下每死亡一只精灵则附加给对手100点固定伤害",
    "revision": "seerapi:d136aee3",
    "hash": "d136aee3",
    "level": 76,
    "fifth": true,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "fifth"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 37021,
    "name": "缘结·浮世诵",
    "type": "圣灵轮回",
    "kind": "special",
    "power": 160,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      699,
      1568,
      2132,
      2133,
      837
    ],
    "effectInstances": [
      {
        "id": 699,
        "args": [],
        "description": "无视攻击免疫效果"
      },
      {
        "id": 1568,
        "args": [],
        "description": "无视护盾效果"
      },
      {
        "id": 2132,
        "args": [],
        "description": "对手持有失体时造成伤害提升100%，否则为对手附加3回合的失体并令对手害怕"
      },
      {
        "id": 2133,
        "args": [],
        "description": "自身持有回体时先制+1，否则为自身附加3回合的回体并令对手疲惫"
      },
      {
        "id": 837,
        "args": [
          200,
          100,
          400
        ],
        "description": "吸取对手200点固定体力，每次使用额外附加100点，最高400点"
      }
    ],
    "description": "无视攻击免疫效果；无视护盾效果；对手持有失体时造成伤害提升100%，否则为对手附加3回合的失体并令对手害怕；自身持有回体时先制+1，否则为自身附加3回合的回体并令对手疲惫；吸取对手200点固定体力，每次使用额外附加100点，最高400点",
    "revision": "seerapi:6c8a3945",
    "hash": "6c8a3945",
    "level": 77,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": true,
      "skill_activation_item": {
        "id": 1725860,
        "url": "https://api.seerapi.com/v1/skill_activation_item/1725860"
      },
      "classification": "activation-skill"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4499-001 真实追加第五37021精确接入授权

来源https://api.seerapi.com/v1/skill/37021 hash6c8a3945，宠物学习原始is_fifth=true、is_special=true，激活道具1725860/bb3acf4c般若偈佗；原第五36553/d136aee3，魂印1714/5cd3c296。转换器派生fifth=false不等于源普通技能，sourceFlags原true完整保留，不能照搬4489/37022原始false的普通追加结论。最小方案research/4499-exact-additional-fifth-proposal.json：只该pet/soul/hash/两个技能hash与原始参数，原第五和追加第五两互斥版本，各普通技能共享，不混装，不扩大白名单其它来源。研究隔离状态测试不代表已正式加载这两个版本；未修改转换器/授权白名单/正式部署校验。

问题：是否授权按该精确提案接入36553与37021两个互斥第五版本并走原正式部署校验？

我的回答：授权

### Q-N20-4499-002 1714真正队伍分支的API固粉每只10%/20%冲突（仅第二阶段）

魂印原desc写有失体Ⅰ时对方场下每阵亡一只“当回合自身造成的固定伤害、百分比伤害提升10%”，格式化字段相同分支为20%。Wiki原文同desc，不能用Wiki裁决API自身内部矛盾。该系数明确依赖对方真实场下阵亡数量，当前零场下0贡献两种均0；并不豁免当前技能给予标记、100体力/100固定与自然消失后清除/封招，这些已实做。10/20留作多精灵延期的待回答来源系数，不当单精灵pending或外部阻塞。

问题：第二阶段该失体Ⅰ分支按对方每阵亡一只10%还是20%固粉增伤？

我的回答：20%

### 已有公共问题关联（不另建主问题、不扩旧回答范围）

- Q-N20-4489-001：36552/16962886/i2，1971/96aae6c/[]，“未击败对手则解放自身当前持有的回体Ⅰ和对手当前持有的失体Ⅰ，解放成功任意一项则令对手下回合无法主动切换精灵且先制效果失效”。解放操作/成功仍无定义，1971完整当前单体分支未实现，未注册空处理器；换宠部分虽真多精灵，当前解放和先制失效不能整条豁免。请主问题分别明确本实例，不自动把以后1942/1943回答扩到所有解放。
- Q-N20-4489-002：回体Ⅰ/失体Ⅰ同为3回特殊标记，普通消回合是否能清/算成功仍未说明。给予/刷新/自然到期及到期后魂印清除/次回封招实际实现，普通主动清除场景显式guard，不猜能清或不能清。
- Q-N20-4489-003：回体Ⅰ的100回复来自独立标记还是获取来源的技能/魂印，会改变技能禁疗/转伤；失体Ⅰ100固定究竟归施加者输出还是持有者自行受伤，会改变输出倍率、事件归属等。当前无修饰共同100回复/固定已做，技能回复阻止或双方输出修正造成差异时guard；不把PP标记未来答案自动覆盖体力标记。请分别明确回体回复与失体固定的来源归类。
- Q-N20-4442-001：37021/6c8a3945/i2，2132/8a2fd890/[]“对手持有失体时造成伤害提升100%，否则为对手附加3回合的失体并令对手害怕”。纯攻击倍率2已做，无标记的给予/害怕已做；同技i4，837[200,100,400]固定吸取是否也翻倍、倍率何时作用尚待答，不用当前代码攻击分支推断所有类型。两标记条件的前后分支分别按原时点核对。
- Q-N20-4438-001：22661/9f8af798/i0，125[3,250]的每回合受攻上限，单段250和到期实做，多段逐段/整招/回合单位待答并对该源guard；同样补齐4494/24525/8ca8a504/[2,280]源guard。

406无新增问题：22637/9a191895/i0/[5,100,150]与已确认4278所用原技能身份/版本/参数完全相同，定向核对research/FIXED60-ANSWER-USER-CONFIRMATIONS.json对应instanceBindings及归档公共4075-012/4114-021，当前相同源独立验证正完整伤害每回合一次、完整0不回、保1实际0仍回、多段不重复，不把该绑定扩大到其它技能或不同参数。1138 API格式明确“消回合成功→疲惫未触发→害怕”三级条件，清回合失败不执行害怕补偿，有据部分无需用户重问。

4499处理状态：2026-10-22T09:04:02.388Z 固定50只46只独立工作完成；4499全18招/54项逐项审核，100/100含21自身与前四只退出0（重叠不累计）。新增精确第五授权及仅多精灵10/20冲突问题，5公共问题关联追加原MD；1971实际解放/当前先制分支未实现不占位，不因换宠字样整条豁免。未部署未验收；扫描4500、正式4329，剩4只。必要旧复验55中3前置待答，最终整库待完成，停止4505。

## 4500 武心婵逐项审核（2026-10-22T10:04:55.709Z）

资料：research/4500-source-check.json、4500-reviewed-snapshot.json、4500-extra-source.json、4500-wiki-source.json、4500-type-block-wiki-source.json。SeerAPI串行缓存查询已全部成功；此前1986非JSON原错误保留并恢复成功。魂印1724/77c3c93c/eid2115/[1,0]；真实17招、唯一第五28328/eae7ef2e。原魂印未与旧蓝金黑龙鳞混合。Wiki魂印及全部指定效果原文/revision见原证据JSON，613 revision343074、1999 revision344457；红黄蓝白龙鳞独立页不存在；skill_effect_param/22 hash7bb66695 infos=null，无法补足复合类型判据。完整原文和全部真实效果实例参数/版本如下：
```json
[
  {
    "id": 1724,
    "description": "自身位于出战背包时，双方场下的精灵体力、PP值均不会减少|自身的龙系技能获得本系加成|自身首次出战登场时获得红色龙鳞、黄色龙鳞、蓝色龙鳞，自身失去所有龙鳞时，自身获得3回合的白色龙鳞，同时解封第五技能|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>常驻效果：\r\n<indent=16><sprite=3><indent=32>武心婵身为瓏域公主：\r\n<indent=32><sprite=4><indent=48>拥有着神秘的感知：位于出战背包时，双方<b>不在场精灵</b>的体力与PP值均不会减少\r\n<indent=32><sprite=4><indent=48>流淌着龙族的血脉：使用龙系技能时会获得<b>本系属性加成</b>\r\n<indent=32><sprite=4><indent=48>受制于皇家的戒律：<color=#64F9FA>无法选择使用</color><b>第五技能</b>\r\n\r\n<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>武心婵首次出战的当次登场时会获得<color=#FFF779>红、黄、蓝三色龙鳞</color>，该三色龙鳞在满足特定的条件而消失之前持续存在\r\n\r\n<indent=0><sprite=0><indent=16>限定效果（每场战斗限1次）：\r\n<indent=16><sprite=3><indent=32>回合结束后，若红、黄、蓝三色龙鳞均已消失，则：\r\n<indent=32><sprite=4><indent=48>获得持续3回合的<color=#FFF779>白色龙鳞</color>\r\n<indent=32><sprite=4><indent=48>本场战斗内<b>第五技能</b><color=#64F9FA>开放选择使用</color>\r\n\r\n<indent=0><sprite=5><indent=15>红色龙鳞（下场保留）：\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>免疫</color>受到的<b>攻击伤害、固定伤害、百分比伤害</b>\r\n<indent=32><sprite=4><indent=48>成功触发免疫后，若自身未被击败则龙鳞消失，消失时<color=#64F9FA>消除</color>对手<b>回合类效果</b>\r\n\r\n<indent=0><sprite=5><indent=15>黄色龙鳞（下场保留）：\r\n<indent=16><sprite=6><indent=32>持有精灵<color=#64F9FA>免疫</color>受到的<b>异常状态</b>\r\n<indent=32><sprite=4><indent=48>成功触发免疫后，若自身未被击败则龙鳞消失，消失时<color=#64F9FA>消除</color>对手<b>能力提升状态</b>\r\n\r\n<indent=0><sprite=5><indent=15>蓝色龙鳞（下场保留）：\r\n<indent=16><sprite=6><indent=32>持有精灵<color=#64F9FA>免疫</color>受到的<b>能力下降状态</b>\r\n<indent=32><sprite=4><indent=48>成功触发免疫后，若自身未被击败则龙鳞消失，消失时<color=#64F9FA>消除</color>对手<b>护盾、护罩类效果</b>\r\n\r\n<indent=0><sprite=5><indent=15>白色龙鳞：\r\n<indent=16><sprite=6><indent=32><color=#64F9FA>免疫</color>受到的<b>攻击伤害、固定伤害、百分比伤害、异常状态、能力下降</b>状态\r\n<indent=16><sprite=6><indent=32>每个战斗阶段结束时，根据本回合内成功免疫的项目，触发<b>对应</b>的效果：\r\n<indent=32><sprite=4><indent=48>成功免疫了<b>攻击伤害</b>：令自身下1次造成的<b>攻击伤害</b><color=#64F9FA>提升</color>100%\r\n<indent=32><sprite=4><indent=48>成功免疫了<b>固定伤害</b>：<color=#64F9FA>附加</color>给对手300点<b>固定伤害</b>\r\n<indent=32><sprite=4><indent=48>成功免疫了<b>百分比伤害</b>：<color=#64F9FA>附加</color>给对手自身最大体力30%的<b>百分比伤害</b>\r\n<indent=32><sprite=4><indent=48>成功免疫了<b>异常状态</b>：随机<color=#64F9FA>附加</color>2种<b>控制类异常状态</b>\r\n<indent=32><sprite=4><indent=48>成功免疫了<b>能力下降状态</b>：<color=#64F9FA>令对手全属性-2</color>\r\n<indent=16><sprite=6><indent=32>消失时<color=#64F9FA>消除</color>对手<b>回合类效果、能力提升状态、护盾类效果、护罩类效果</b>",
    "analyze_desc": "[sprite name=dot4]自身位于出战背包时，双方场下的精灵体力、PP值均不会减少|[sprite name=dot4]自身的龙系技能获得[color=#52a5f2]本系加成[/color]|[sprite name=dot4]自身[color=#52a5f2]首次[/color]出战[color=#57c975]登场时[/color]获得[color=#f35555]红色龙鳞[/color]、[color=#f35555]黄色龙鳞[/color]、[color=#f35555]蓝色龙鳞[/color]，自身失去所有龙鳞时，自身获得3回合的[color=#f35555]白色龙鳞[/color]，同时解封第五技能",
    "hash": "77c3c93c",
    "eid": 2115,
    "args": [
      1,
      0
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1724",
      "revision": "77c3c93c",
      "loadedAt": "2026-10-22T09:04:12.992Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 36629,
    "name": "梦启",
    "type": "普通",
    "kind": "physical",
    "power": 50,
    "pp": 40,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      613,
      1999
    ],
    "effectInstances": [
      {
        "id": 613,
        "args": [
          5,
          221
        ],
        "description": "5回合内自身令对手使用的王系攻击技能无效"
      },
      {
        "id": 1999,
        "args": [
          5,
          3
        ],
        "description": "5回合内自身使用的攻击技能对火系精灵无效"
      }
    ],
    "description": "5回合内自身令对手使用的王系攻击技能无效；5回合内自身使用的攻击技能对火系精灵无效",
    "revision": "seerapi:c0550e38",
    "hash": "c0550e38",
    "level": 1,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36630,
    "name": "梦示",
    "type": "普通",
    "kind": "physical",
    "power": 50,
    "pp": 40,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      613,
      1999
    ],
    "effectInstances": [
      {
        "id": 613,
        "args": [
          5,
          224
        ],
        "description": "5回合内自身令对手使用的轮回系攻击技能无效"
      },
      {
        "id": 1999,
        "args": [
          5,
          1
        ],
        "description": "5回合内自身使用的攻击技能对草系精灵无效"
      }
    ],
    "description": "5回合内自身令对手使用的轮回系攻击技能无效；5回合内自身使用的攻击技能对草系精灵无效",
    "revision": "seerapi:88f6bc34",
    "hash": "88f6bc34",
    "level": 5,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36631,
    "name": "梦录",
    "type": "普通",
    "kind": "physical",
    "power": 50,
    "pp": 40,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      613,
      1999
    ],
    "effectInstances": [
      {
        "id": 613,
        "args": [
          5,
          223
        ],
        "description": "5回合内自身令对手使用的神灵系攻击技能无效"
      },
      {
        "id": 1999,
        "args": [
          5,
          2
        ],
        "description": "5回合内自身使用的攻击技能对水系精灵无效"
      }
    ],
    "description": "5回合内自身令对手使用的神灵系攻击技能无效；5回合内自身使用的攻击技能对水系精灵无效",
    "revision": "seerapi:28bb5473",
    "hash": "28bb5473",
    "level": 9,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28321,
    "name": "红之初醒",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1996
    ],
    "effectInstances": [
      {
        "id": 1996,
        "args": [],
        "description": "为自身附加红色龙鳞"
      }
    ],
    "description": "为自身附加红色龙鳞",
    "revision": "seerapi:8e894fc",
    "hash": "8e894fc",
    "level": 13,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28322,
    "name": "黄之初醒",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1997
    ],
    "effectInstances": [
      {
        "id": 1997,
        "args": [],
        "description": "为自身附加黄色龙鳞"
      }
    ],
    "description": "为自身附加黄色龙鳞",
    "revision": "seerapi:27fc0ca2",
    "hash": "27fc0ca2",
    "level": 17,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28323,
    "name": "蓝之初醒",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1998
    ],
    "effectInstances": [
      {
        "id": 1998,
        "args": [],
        "description": "为自身附加蓝色龙鳞"
      }
    ],
    "description": "为自身附加蓝色龙鳞",
    "revision": "seerapi:3dc1fac0",
    "hash": "3dc1fac0",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28324,
    "name": "红之初释",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      479
    ],
    "effectInstances": [
      {
        "id": 479,
        "args": [
          300,
          300,
          300,
          1
        ],
        "description": "损失自身300点体力，给对手造成300点固定伤害，若自身体力不足300则剩下1点体力"
      }
    ],
    "description": "损失自身300点体力，给对手造成300点固定伤害，若自身体力不足300则剩下1点体力",
    "revision": "seerapi:264886f0",
    "hash": "264886f0",
    "level": 25,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28325,
    "name": "黄之初释",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1865,
      786
    ],
    "effectInstances": [
      {
        "id": 1865,
        "args": [
          1
        ],
        "description": "为自身附加1种异常状态"
      },
      {
        "id": 786,
        "args": [
          1
        ],
        "description": "随机附加1种异常状态"
      }
    ],
    "description": "为自身附加1种异常状态；随机附加1种异常状态",
    "revision": "seerapi:564872e2",
    "hash": "564872e2",
    "level": 29,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28326,
    "name": "蓝之初释",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1191,
      749
    ],
    "effectInstances": [
      {
        "id": 1191,
        "args": [
          1
        ],
        "description": "100%令自身全属性-1"
      },
      {
        "id": 749,
        "args": [
          100,
          1
        ],
        "description": "100%令对手全属性-1"
      }
    ],
    "description": "100%令自身全属性-1；100%令对手全属性-1",
    "revision": "seerapi:4ecc74c4",
    "hash": "4ecc74c4",
    "level": 33,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36632,
    "name": "瓏灵·绯",
    "type": "自然圣灵",
    "kind": "special",
    "power": 100,
    "pp": 10,
    "priority": 3,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      180,
      1984,
      1475,
      1985,
      1986,
      1987
    ],
    "effectInstances": [
      {
        "id": 180,
        "args": [],
        "description": "消除对手回合类效果"
      },
      {
        "id": 1984,
        "args": [
          5,
          100
        ],
        "description": "5回合内自身受到的攻击伤害额外减少100%"
      },
      {
        "id": 1475,
        "args": [
          5,
          100
        ],
        "description": "5回合内自身受到的固定伤害和百分比伤害减少100%"
      },
      {
        "id": 1985,
        "args": [
          50
        ],
        "description": "造成的攻击伤害提升50%，若自身持有红色或白色龙鳞则增伤效果翻倍"
      },
      {
        "id": 1986,
        "args": [
          150
        ],
        "description": "附加150点固定伤害，若自身持有红色或白色龙鳞则附加的固定伤害翻倍"
      },
      {
        "id": 1987,
        "args": [
          15
        ],
        "description": "附加自身最大体力15%的百分比伤害，若自身持有红色或白色龙鳞则附加的百分比伤害翻倍"
      }
    ],
    "description": "消除对手回合类效果；5回合内自身受到的攻击伤害额外减少100%；5回合内自身受到的固定伤害和百分比伤害减少100%；造成的攻击伤害提升50%，若自身持有红色或白色龙鳞则增伤效果翻倍；附加150点固定伤害，若自身持有红色或白色龙鳞则附加的固定伤害翻倍；附加自身最大体力15%的百分比伤害，若自身持有红色或白色龙鳞则附加的百分比伤害翻倍",
    "revision": "seerapi:18369c70",
    "hash": "18369c70",
    "level": 37,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36633,
    "name": "瓏灵·缃",
    "type": "自然圣灵",
    "kind": "special",
    "power": 100,
    "pp": 10,
    "priority": 3,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      33,
      48,
      1988
    ],
    "effectInstances": [
      {
        "id": 33,
        "args": [],
        "description": "消除对手能力提升状态"
      },
      {
        "id": 48,
        "args": [
          5
        ],
        "description": "5回合内免疫所有受到的异常状态"
      },
      {
        "id": 1988,
        "args": [
          2
        ],
        "description": "随机附加2种异常状态，若自身持有黄色或白色龙鳞则改为附加控制类异常状态"
      }
    ],
    "description": "消除对手能力提升状态；5回合内免疫所有受到的异常状态；随机附加2种异常状态，若自身持有黄色或白色龙鳞则改为附加控制类异常状态",
    "revision": "seerapi:7efb6d7c",
    "hash": "7efb6d7c",
    "level": 41,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36634,
    "name": "瓏灵·缥",
    "type": "自然圣灵",
    "kind": "special",
    "power": 100,
    "pp": 10,
    "priority": 3,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1989,
      47,
      1990
    ],
    "effectInstances": [
      {
        "id": 1989,
        "args": [],
        "description": "消除对手护盾、护罩类效果"
      },
      {
        "id": 47,
        "args": [
          5
        ],
        "description": "5回合内免疫能力下降状态"
      },
      {
        "id": 1990,
        "args": [
          1
        ],
        "description": "令对手全属性-1，若自身持有蓝色或白色龙鳞则弱化效果翻倍"
      }
    ],
    "description": "消除对手护盾、护罩类效果；5回合内免疫能力下降状态；令对手全属性-1，若自身持有蓝色或白色龙鳞则弱化效果翻倍",
    "revision": "seerapi:eafcd6fa",
    "hash": "eafcd6fa",
    "level": 45,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28327,
    "name": "玲·沧吟星海",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1991,
      1992,
      57,
      1993,
      1994
    ],
    "effectInstances": [
      {
        "id": 1991,
        "args": [
          1
        ],
        "description": "全属性+1，自身持有龙鳞时强化效果翻倍"
      },
      {
        "id": 1992,
        "args": [],
        "description": "若自身当前未持有龙鳞，则为自身附加三色龙鳞"
      },
      {
        "id": 57,
        "args": [
          4,
          1
        ],
        "description": "4回合内每回合使用技能恢复自身最大体力的1/1"
      },
      {
        "id": 1993,
        "args": [
          4,
          300
        ],
        "description": "4回合内每回合使用技能附加给对手300点真实伤害"
      },
      {
        "id": 1994,
        "args": [
          2,
          1,
          2
        ],
        "description": "自身当前每持有一种三色龙鳞则令自身下2回合所有技能先制+1，若当前持有白色龙鳞则令对手下2回合无法主动切换精灵且先制效果失效"
      }
    ],
    "description": "全属性+1，自身持有龙鳞时强化效果翻倍；若自身当前未持有龙鳞，则为自身附加三色龙鳞；4回合内每回合使用技能恢复自身最大体力的1/1；4回合内每回合使用技能附加给对手300点真实伤害；自身当前每持有一种三色龙鳞则令自身下2回合所有技能先制+1，若当前持有白色龙鳞则令对手下2回合无法主动切换精灵且先制效果失效",
    "revision": "seerapi:232175e",
    "hash": "232175e",
    "level": 49,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36635,
    "name": "瓏啸·绛",
    "type": "龙",
    "kind": "special",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      180,
      1984,
      1475,
      1985,
      1986,
      1987
    ],
    "effectInstances": [
      {
        "id": 180,
        "args": [],
        "description": "消除对手回合类效果"
      },
      {
        "id": 1984,
        "args": [
          5,
          100
        ],
        "description": "5回合内自身受到的攻击伤害额外减少100%"
      },
      {
        "id": 1475,
        "args": [
          5,
          100
        ],
        "description": "5回合内自身受到的固定伤害和百分比伤害减少100%"
      },
      {
        "id": 1985,
        "args": [
          50
        ],
        "description": "造成的攻击伤害提升50%，若自身持有红色或白色龙鳞则增伤效果翻倍"
      },
      {
        "id": 1986,
        "args": [
          150
        ],
        "description": "附加150点固定伤害，若自身持有红色或白色龙鳞则附加的固定伤害翻倍"
      },
      {
        "id": 1987,
        "args": [
          15
        ],
        "description": "附加自身最大体力15%的百分比伤害，若自身持有红色或白色龙鳞则附加的百分比伤害翻倍"
      }
    ],
    "description": "消除对手回合类效果；5回合内自身受到的攻击伤害额外减少100%；5回合内自身受到的固定伤害和百分比伤害减少100%；造成的攻击伤害提升50%，若自身持有红色或白色龙鳞则增伤效果翻倍；附加150点固定伤害，若自身持有红色或白色龙鳞则附加的固定伤害翻倍；附加自身最大体力15%的百分比伤害，若自身持有红色或白色龙鳞则附加的百分比伤害翻倍",
    "revision": "seerapi:4763f742",
    "hash": "4763f742",
    "level": 53,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36636,
    "name": "瓏啸·缊",
    "type": "龙",
    "kind": "special",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      33,
      48,
      1988
    ],
    "effectInstances": [
      {
        "id": 33,
        "args": [],
        "description": "消除对手能力提升状态"
      },
      {
        "id": 48,
        "args": [
          5
        ],
        "description": "5回合内免疫所有受到的异常状态"
      },
      {
        "id": 1988,
        "args": [
          2
        ],
        "description": "随机附加2种异常状态，若自身持有黄色或白色龙鳞则改为附加控制类异常状态"
      }
    ],
    "description": "消除对手能力提升状态；5回合内免疫所有受到的异常状态；随机附加2种异常状态，若自身持有黄色或白色龙鳞则改为附加控制类异常状态",
    "revision": "seerapi:ba0e22fb",
    "hash": "ba0e22fb",
    "level": 57,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36637,
    "name": "瓏啸·绀",
    "type": "龙",
    "kind": "special",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1989,
      47,
      1990
    ],
    "effectInstances": [
      {
        "id": 1989,
        "args": [],
        "description": "消除对手护盾、护罩类效果"
      },
      {
        "id": 47,
        "args": [
          5
        ],
        "description": "5回合内免疫能力下降状态"
      },
      {
        "id": 1990,
        "args": [
          1
        ],
        "description": "令对手全属性-1，若自身持有蓝色或白色龙鳞则弱化效果翻倍"
      }
    ],
    "description": "消除对手护盾、护罩类效果；5回合内免疫能力下降状态；令对手全属性-1，若自身持有蓝色或白色龙鳞则弱化效果翻倍",
    "revision": "seerapi:ece1378a",
    "hash": "ece1378a",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28328,
    "name": "婵·命定星缘",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 1,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1995,
      43,
      87
    ],
    "effectInstances": [
      {
        "id": 1995,
        "args": [],
        "description": "该技能在战斗中需要通过武心婵专属特性解封后才可选择使用；解放自身当前持有的全部龙鳞：每解放成功一种三色龙鳞则令自身1回合内的回合类效果无法被消除、令自身1回合内的能力提升状态无法被消除或吸取、令对手1回合内的能力下降状态无法被解除或反转；若解放成功白色龙鳞则令自身下1次攻击技能造成的伤害提升100%、附加给对手300点固定伤害、附加自身最大体力30%的百分比伤害、随机附加2种控制类异常状态、令对手全属性-2"
      },
      {
        "id": 43,
        "args": [
          1
        ],
        "description": "恢复自身最大体力的1/1"
      },
      {
        "id": 87,
        "args": [],
        "description": "恢复自身所有PP值"
      }
    ],
    "description": "该技能在战斗中需要通过武心婵专属特性解封后才可选择使用；解放自身当前持有的全部龙鳞：每解放成功一种三色龙鳞则令自身1回合内的回合类效果无法被消除、令自身1回合内的能力提升状态无法被消除或吸取、令对手1回合内的能力下降状态无法被解除或反转；若解放成功白色龙鳞则令自身下1次攻击技能造成的伤害提升100%、附加给对手300点固定伤害、附加自身最大体力30%的百分比伤害、随机附加2种控制类异常状态、令对手全属性-2；恢复自身最大体力的1/1；恢复自身所有PP值",
    "revision": "seerapi:eae7ef2e",
    "hash": "eae7ef2e",
    "level": 76,
    "fifth": true,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "fifth"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4500-001 同类免疫重叠时的龙鳞消耗/反馈优先级

来源https://api.seerapi.com/v1/soulmark/1724 hash77c3c93c及对应1996/1997/1998技能给予龙鳞；全部效果hash和URL保留在上方原文及source-check。红黄蓝成功免疫后若存活消失并分别清回合/强化/盾罩，白按当回合成功免疫类型反馈。真实技能可在白期重新给予三色，或先获得普通免异常/免弱/固粉免疫。原API/Wiki未说明同类免疫谁先触发，是否均算成功。旧其它魂印特例确认不能扩到1724。若仅三色先触发会消鳞/清除，白先则白记项目；若均触发则两者均反馈，战斗差异明确但没有来源可选定。独立无重叠三色/白免疫、正伤/0伤/MISS/真伤、存活、各类别反馈、自然到期与真实解锁链均已实现并测试，重叠路径显式待答。

问题：1724三色与白或其它同类免疫同时存在时，分别按什么顺序判定，哪些算成功并消耗/反馈？

我的回答：先判定其他同类免疫；只有没有其他同类免疫时才判定龙鳞；白无法与其他三色同时存在；有白的时候无法获得其他三色

### Q-N20-4500-002 指定类型禁制是否包含复合属性

36629/c0550e38、36630/88f6bc34、36631/28bb5473的i0=613[5,221/224/223]指定王/轮回/神灵攻击无效，i1=1999[5,3/1/2]自身对火/草/水系精灵攻击无效；原效果模板、hash、URL与实例全文在上方来源中。API参数22无infos，Wiki613/1999仅重复原文，未给复合属性示例。仅完整单属性匹配还是包含对应成分均匹配，会影响复合属性技能/精灵的攻击是否有效。单属性命中/非匹配/属性技能与5回到期均已实现，相关复合边界guard，不拿现有字符串实现当答案。

问题：613指定类型技能和1999指定类型精灵各自是否包含带该成分的复合属性？

我的回答：不包含

### 已有主问题精确关联

- Q-N20-4489-001：28328/eae7ef2e/i0=1995/e03ddf2d/[]，解放自身全部龙鳞；三色每解放一种1回免断/强保/对手弱化锁，白解放则下次攻击+100%、300固定、自身maxHP30%百分比、随机2控制、全-2。解放操作及成功未定义，RGB期限逐种叠加还是刷新1回、白解放是否触发消失四清也未说明。当前源自带第五选择限制与已真实解锁后无龙鳞的共同无对象分支、43满回复/87PP全回已实做；非空解放全部自身载荷未猜测，不能因解放已有1942词条就扩用户未来答复。请主问题明确本1995实例这些操作与消失反应。
- Q-N20-4489-002：白色龙鳞明确持续3回，普通消回合是否清除并触发消失四清未定义；自然到期先移除自身白鳞再四清已独立实现。三色原文明示一直到条件消失，无时限，不机械混入普通回合类。请主问题分别确认白鳞分类及主动消失反应。
- Q-N20-4438-001：红鳞成功免攻消失和白鳞下次攻击+100%的多段消费单位待答，单段/零伤已实做；不把多段处理当多精灵延期。

真正多精灵仅：魂印双方不在场精灵HP/PP不得减少、三色下场保留/非首次再登场以及1994白期对手下2回合主动换宠限制；1994当前对手所有先制效果失效已实做。

4500处理状态：2026-10-22T10:04:55.709Z 固定50只47只独立工作完成；4500全17招/64项审核，216/216专项含24自身退出0。新增4500-001/002及公共解放/白分类/多段关联原MD。未部署未验收，扫描4501、正式4329，剩4501/4503/4505；必要旧复验57中3前置待答，最终整库待完成，停止4505。

## 4501 普达戈尔逐项审核（2026-10-22T10:17:05.399Z）

真实资料research/4501-source-check.json、4501-reviewed-snapshot.json、4501-source-manifest.json、4501-wiki-source.json；22招、原第五36568/cb96041e，无追加/觉醒版本。魂印1715/f91439c9/eid2102/[100,3,2,400,1]，Wiki魂印320252、精灵359645、1526=388446、1827=344285、1845=344303、1486=343945、1662=344120、1231=349265、993=348831。原API优先，Wiki没有补足下列缺口，完整原文/原始参数/hash/URL均保留：
```json
[
  {
    "id": 1715,
    "description": "自身使用技能后100%令对手沉默，若命中则额外附加对手最大体力1/3的百分比伤害，若未命中则额外降低对手所有技能2点PP值；|战斗阶段结束时若对手不处于沉默状态则消除对手回合类效果，若对手处于沉默状态则为自身附加400点护盾|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身使用技能后100%令对手沉默\r\n<indent=32><sprite=4><indent=48>若该技能命中则额外<color=#64F9FA>附加</color>对手最大体力1/3的<b>百分比伤害</b>\r\n<indent=32><sprite=4><indent=48>若该技能未命中则额外<color=#64F9FA>降低</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时：\r\n<indent=32><sprite=4><indent=48>若对手不处于沉默状态则<color=#64F9FA>消除</color>对手<b>回合类效果</b>\r\n<indent=32><sprite=4><indent=48>若对手处于沉默状态则为自身<color=#64F9FA>附加</color>400点<b>护盾</b>",
    "analyze_desc": "",
    "hash": "f91439c9",
    "eid": 2102,
    "args": [
      100,
      3,
      2,
      400,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1715",
      "revision": "f91439c9",
      "loadedAt": "2026-10-22T10:05:17.159Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 10127,
    "name": "叩击",
    "type": "普通",
    "kind": "physical",
    "power": 40,
    "pp": 40,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [],
    "effectInstances": [],
    "description": "",
    "revision": "seerapi:fb5a2c8",
    "hash": "fb5a2c8",
    "level": 1,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 20030,
    "name": "加速",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 35,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      4
    ],
    "effectInstances": [
      {
        "id": 4,
        "args": [
          4,
          100,
          1
        ],
        "description": "技能使用成功时，100%改变自身速度等级+1"
      }
    ],
    "description": "技能使用成功时，100%改变自身速度等级+1",
    "revision": "seerapi:1ca93a56",
    "hash": "1ca93a56",
    "level": 5,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 13601,
    "name": "弹力射线",
    "type": "普通",
    "kind": "special",
    "power": 50,
    "pp": 30,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [],
    "effectInstances": [],
    "description": "",
    "revision": "seerapi:c80909b5",
    "hash": "c80909b5",
    "level": 9,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 12541,
    "name": "光速突击",
    "type": "光",
    "kind": "physical",
    "power": 70,
    "pp": 25,
    "priority": 1,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [],
    "effectInstances": [],
    "description": "",
    "revision": "seerapi:6bdbc4e3",
    "hash": "6bdbc4e3",
    "level": 13,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 20053,
    "name": "怨念",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      5
    ],
    "effectInstances": [
      {
        "id": 5,
        "args": [
          3,
          100,
          -2
        ],
        "description": "技能使用成功时，100%改变对手特防等级-2"
      }
    ],
    "description": "技能使用成功时，100%改变对手特防等级-2",
    "revision": "seerapi:543c9b5b",
    "hash": "543c9b5b",
    "level": 17,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36287,
    "name": "严于律己",
    "type": "光",
    "kind": "physical",
    "power": 70,
    "pp": 25,
    "priority": 2,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      797,
      756
    ],
    "effectInstances": [
      {
        "id": 797,
        "args": [
          2
        ],
        "description": "消除对手回合类效果，消除成功2回合内对手无法通过自身技能恢复体力"
      },
      {
        "id": 756,
        "args": [
          100,
          30
        ],
        "description": "命中后100%令对手沉默"
      }
    ],
    "description": "消除对手回合类效果，消除成功2回合内对手无法通过自身技能恢复体力；命中后100%令对手沉默",
    "revision": "seerapi:528732f4",
    "hash": "528732f4",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10634,
    "name": "聚光波",
    "type": "光",
    "kind": "special",
    "power": 80,
    "pp": 15,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      2
    ],
    "effectInstances": [
      {
        "id": 2,
        "args": [],
        "description": "对方体力小于1/2时威力加倍"
      }
    ],
    "description": "对方体力小于1/2时威力加倍",
    "revision": "seerapi:c560aaf2",
    "hash": "c560aaf2",
    "level": 25,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 14036,
    "name": "破晓之击",
    "type": "光",
    "kind": "physical",
    "power": 90,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      40
    ],
    "effectInstances": [
      {
        "id": 40,
        "args": [],
        "description": "先出手的话威力为2倍"
      }
    ],
    "description": "先出手的话威力为2倍",
    "revision": "seerapi:21f95bf1",
    "hash": "21f95bf1",
    "level": 29,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 22155,
    "name": "眩光之盾",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 10,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      4,
      4
    ],
    "effectInstances": [
      {
        "id": 4,
        "args": [
          1,
          100,
          1
        ],
        "description": "技能使用成功时，100%改变自身防御等级+1"
      },
      {
        "id": 4,
        "args": [
          3,
          100,
          1
        ],
        "description": "技能使用成功时，100%改变自身特防等级+1"
      }
    ],
    "description": "技能使用成功时，100%改变自身防御等级+1；技能使用成功时，100%改变自身特防等级+1",
    "revision": "seerapi:8d4d043c",
    "hash": "8d4d043c",
    "level": 33,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 14038,
    "name": "灵光天闪",
    "type": "光",
    "kind": "special",
    "power": 100,
    "pp": 15,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      33
    ],
    "effectInstances": [
      {
        "id": 33,
        "args": [],
        "description": "消除对手能力提升状态"
      }
    ],
    "description": "消除对手能力提升状态",
    "revision": "seerapi:c76a2270",
    "hash": "c76a2270",
    "level": 37,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 14037,
    "name": "光动强击",
    "type": "光",
    "kind": "physical",
    "power": 120,
    "pp": 10,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      3
    ],
    "effectInstances": [
      {
        "id": 3,
        "args": [],
        "description": "解除自身的能力下降状态"
      }
    ],
    "description": "解除自身的能力下降状态",
    "revision": "seerapi:a478e7cb",
    "hash": "a478e7cb",
    "level": 41,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36288,
    "name": "乐善好施",
    "type": "光",
    "kind": "physical",
    "power": 115,
    "pp": 10,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1526,
      1861
    ],
    "effectInstances": [
      {
        "id": 1526,
        "args": [
          50,
          100
        ],
        "description": "随机附加50-100点固定伤害，技能无效时减少对手所有技能PP1点"
      },
      {
        "id": 1861,
        "args": [],
        "description": "技能无效时，消除对手回合类效果且100%令对手沉默3回合"
      }
    ],
    "description": "随机附加50-100点固定伤害，技能无效时减少对手所有技能PP1点；技能无效时，消除对手回合类效果且100%令对手沉默3回合",
    "revision": "seerapi:8ababbd",
    "hash": "8ababbd",
    "level": 45,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28159,
    "name": "兢兢业业",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      847,
      868,
      1046
    ],
    "effectInstances": [
      {
        "id": 847,
        "args": [
          400
        ],
        "description": "为自身附加400点护盾"
      },
      {
        "id": 868,
        "args": [
          3
        ],
        "description": "消除对手能力提升状态，消除成功则令对手下回合所有技能先制-3"
      },
      {
        "id": 1046,
        "args": [
          3
        ],
        "description": "若对手不处于异常状态则附加对手最大体力1/3的百分比伤害"
      }
    ],
    "description": "为自身附加400点护盾；消除对手能力提升状态，消除成功则令对手下回合所有技能先制-3；若对手不处于异常状态则附加对手最大体力1/3的百分比伤害",
    "revision": "seerapi:3055058d",
    "hash": "3055058d",
    "level": 49,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36289,
    "name": "矜贫救厄",
    "type": "光",
    "kind": "special",
    "power": 130,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1827
    ],
    "effectInstances": [
      {
        "id": 1827,
        "args": [
          1
        ],
        "description": "击败对手则令对手下1次使用的属性技能无效"
      }
    ],
    "description": "击败对手则令对手下1次使用的属性技能无效",
    "revision": "seerapi:e33544d2",
    "hash": "e33544d2",
    "level": 53,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28160,
    "name": "勤勤恳恳",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      813,
      806,
      843
    ],
    "effectInstances": [
      {
        "id": 813,
        "args": [],
        "description": "将自身的能力下降状态双倍反馈给对手"
      },
      {
        "id": 806,
        "args": [
          3,
          1
        ],
        "description": "3回合内若对手使用攻击技能则使用后令自身全属性+1"
      },
      {
        "id": 843,
        "args": [
          2,
          1
        ],
        "description": "下2回合令自身所有技能先制+1"
      }
    ],
    "description": "将自身的能力下降状态双倍反馈给对手；3回合内若对手使用攻击技能则使用后令自身全属性+1；下2回合令自身所有技能先制+1",
    "revision": "seerapi:10529a4",
    "hash": "10529a4",
    "level": 57,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36290,
    "name": "宽以待人",
    "type": "光",
    "kind": "physical",
    "power": 145,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      713,
      795
    ],
    "effectInstances": [
      {
        "id": 713,
        "args": [
          50
        ],
        "description": "附加自身能力提升等级总和X50的固定伤害"
      },
      {
        "id": 795,
        "args": [
          10,
          50
        ],
        "description": "每次使用则当回合造成的攻击伤害额外提升10%，最高额外提升50%"
      }
    ],
    "description": "附加自身能力提升等级总和X50的固定伤害；每次使用则当回合造成的攻击伤害额外提升10%，最高额外提升50%",
    "revision": "seerapi:4029a52e",
    "hash": "4029a52e",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36565,
    "name": "重躯疾滚",
    "type": "光战斗",
    "kind": "physical",
    "power": 85,
    "pp": 20,
    "priority": 3,
    "accuracy": 97,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      797,
      1231
    ],
    "effectInstances": [
      {
        "id": 797,
        "args": [
          3
        ],
        "description": "消除对手回合类效果，消除成功3回合内对手无法通过自身技能恢复体力"
      },
      {
        "id": 1231,
        "args": [
          100,
          30,
          3
        ],
        "description": "100%令对手沉默，未触发则附加对手最大体力1/3的百分比伤害"
      }
    ],
    "description": "消除对手回合类效果，消除成功3回合内对手无法通过自身技能恢复体力；100%令对手沉默，未触发则附加对手最大体力1/3的百分比伤害",
    "revision": "seerapi:ec639327",
    "hash": "ec639327",
    "level": 71,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28292,
    "name": "灵气护佑",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      191,
      1755,
      1207,
      43
    ],
    "effectInstances": [
      {
        "id": 191,
        "args": [
          4
        ],
        "description": "4回合内免疫并反弹所有受到的异常状态"
      },
      {
        "id": 1755,
        "args": [
          400,
          1
        ],
        "description": "获得400点护盾，护盾消失时使对手下1次攻击技能无效"
      },
      {
        "id": 1207,
        "args": [
          2,
          2
        ],
        "description": "双倍吸取对手能力提升状态，吸取成功则使对手下2回合先制-2"
      },
      {
        "id": 43,
        "args": [
          2
        ],
        "description": "恢复自身最大体力的1/2"
      }
    ],
    "description": "4回合内免疫并反弹所有受到的异常状态；获得400点护盾，护盾消失时使对手下1次攻击技能无效；双倍吸取对手能力提升状态，吸取成功则使对手下2回合先制-2；恢复自身最大体力的1/2",
    "revision": "seerapi:bb9d70b",
    "hash": "bb9d70b",
    "level": 72,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36566,
    "name": "熠熠生辉",
    "type": "光战斗",
    "kind": "special",
    "power": 140,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1845,
      1827
    ],
    "effectInstances": [
      {
        "id": 1845,
        "args": [
          2,
          1
        ],
        "description": "对手每损失2点体力则额外附加1点固定伤害"
      },
      {
        "id": 1827,
        "args": [
          1
        ],
        "description": "击败对手则令对手下1次使用的属性技能无效"
      }
    ],
    "description": "对手每损失2点体力则额外附加1点固定伤害；击败对手则令对手下1次使用的属性技能无效",
    "revision": "seerapi:612aed0f",
    "hash": "612aed0f",
    "level": 73,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28293,
    "name": "修缘巨力",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1260,
      993,
      1617,
      843
    ],
    "effectInstances": [
      {
        "id": 1260,
        "args": [
          4
        ],
        "description": "将自身能力下降状态双倍反馈给对手，反馈成功则4回合内免疫能力下降效果"
      },
      {
        "id": 993,
        "args": [
          1,
          30
        ],
        "description": "全属性+1，对手处于沉默状态时强化效果翻倍"
      },
      {
        "id": 1617,
        "args": [
          4,
          100,
          7,
          1
        ],
        "description": "4回合内受到攻击后100%使对手疲惫，未触发则自身全属性+1"
      },
      {
        "id": 843,
        "args": [
          2,
          2
        ],
        "description": "下2回合令自身所有技能先制+2"
      }
    ],
    "description": "将自身能力下降状态双倍反馈给对手，反馈成功则4回合内免疫能力下降效果；全属性+1，对手处于沉默状态时强化效果翻倍；4回合内受到攻击后100%使对手疲惫，未触发则自身全属性+1；下2回合令自身所有技能先制+2",
    "revision": "seerapi:52b74bae",
    "hash": "52b74bae",
    "level": 74,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36567,
    "name": "极光反冲",
    "type": "光",
    "kind": "physical",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "3/16",
    "effectIds": [
      828,
      1486,
      795
    ],
    "effectInstances": [
      {
        "id": 828,
        "args": [],
        "description": "若自身处于能力提升状态则先制+1"
      },
      {
        "id": 1486,
        "args": [
          50
        ],
        "description": "50%的概率造成伤害翻倍，自身处于护盾状态时概率翻倍"
      },
      {
        "id": 795,
        "args": [
          20,
          100
        ],
        "description": "每次使用则当回合造成的攻击伤害额外提升20%，最高额外提升100%"
      }
    ],
    "description": "若自身处于能力提升状态则先制+1；50%的概率造成伤害翻倍，自身处于护盾状态时概率翻倍；每次使用则当回合造成的攻击伤害额外提升20%，最高额外提升100%",
    "revision": "seerapi:7095c817",
    "hash": "7095c817",
    "level": 75,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36568,
    "name": "炫影仙尘踏",
    "type": "光战斗",
    "kind": "physical",
    "power": 160,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1924,
      713,
      1662
    ],
    "effectInstances": [
      {
        "id": 1924,
        "args": [
          4,
          300
        ],
        "description": "4回合内每回合使用技能恢复自身300点体力并造成等量固定伤害"
      },
      {
        "id": 713,
        "args": [
          50
        ],
        "description": "附加自身能力提升等级总和X50的固定伤害"
      },
      {
        "id": 1662,
        "args": [],
        "description": "消耗自身所有护盾值并附加等量固定伤害，若对手体力未变化则恢复自身等量体力值"
      }
    ],
    "description": "4回合内每回合使用技能恢复自身300点体力并造成等量固定伤害；附加自身能力提升等级总和X50的固定伤害；消耗自身所有护盾值并附加等量固定伤害，若对手体力未变化则恢复自身等量体力值",
    "revision": "seerapi:cb96041e",
    "hash": "cb96041e",
    "level": 76,
    "fifth": true,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "fifth"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4501-001 击败后的1827目标与承接机制

36289/e33544d2/i0、36566/612aed0f/i1，效果1827/8a3d6982/[1]：“击败对手则令对手下1次使用的属性技能无效”。API效果全部字段与Wiki344285均只写对手，未写下只出场或队伍继承；不能擅改为下一只或把未知语义登记多精灵。被击败对象当前无法再行动，需确认封锁究竟承接给谁，或是否仅复活/重新上场后保留。该整实例无依据处理器，未注册占位；当前真实基础技能和其它词条全部独立实现与状态测试。

问题：1827击败对手后，下一次属性技能无效具体施加给哪个对象、在何种后续事件中生效？

我的回答：对手整个队伍都继承；只要对手上场精灵使用了属性就消耗这次次数并无效之

### Q-N20-4501-002 1845实际HP损失的统计区间

36566/612aed0f/i0，1845/f9ab8af8/[2,1]：“对手每损失2点体力则额外附加1点固定伤害”。API/Wiki344303未明确统计是否只取本次技能攻击、是否含同回合其它HP损失或附伤；不能把“损失体力”改成完整结算伤害。同次单段攻击是当回合唯一损失时共同部分已实做，实际损失每2向下取整加1固定，完整正伤而保1实际0不追加。若敌先行动已损HP，按当前攻击或累计包含它会产生不同固定附伤，当前显式guard；不无限重试、不把未知语义当多精灵。

问题：1845每损失体力具体统计什么时间区间及哪些来源，是否只取该技能本次攻击的实际HP减少量？

我的回答：使用该技能的对手快照；当时与最大体力每差2点就附加一点固伤

### 公共问题关联（不扩已有回答）

- Q-N20-4472-002：1715魂印每次真正用技100%沉默，原命中则敌maxHP三分一百分比、未命中则敌全PP减2；普通命中/普通MISS/PP保护、控制未用均完成，失明与整招封锁是否算“未命中”待答。沉默本身回合损失maxHP八分一与魂印三分一分开测试，不混计为魂印附伤。请原主问题明确1715失效分类。
- Q-N20-4358-003：36288/8ababbd/i0，1526/4363bcbe/[50,100]随机固定及技能无效敌全PP减1；i1=1861/db7ab820/[]无效清回合+沉默3。明确封锁分支已实现，普通MISS/失明属于无效的边界沿主问题收集；普通命中随机固定50与100两个边界均真实抽到。
- Q-N20-4438-001：1845多段损失取整单位、1486/36567/7095c817/i1/[50]概率多段抽样单位，以及28293/52b74bae/i2/1617[4,100,7,1]同回多次受攻，单段已实做。
- Q-N20-4359-003：同1617新实例完整0/MISS是否算“受到攻击”待答。已定向查research/FIXED60-ANSWER-USER-CONFIRMATIONS.json：4114/27316/[3,100,6,1]和4163/27437/[4,100,9,1]只特定实例确认正完整及整回最多1，不能扩大到本新疲惫实例；本实例正完整（包括保1实际0）/疲惫失败全1已实现，零伤/重复边界guard。

公共修复：813/1260反馈尊重自身弱化不可解除反转，不能只禁止清自身却先复制给敌；1755盾层分别记录来源，其来源被耗尽（即使旧普通盾仍在）才触发下一攻无效，不是其它盾消失误触发。影响清单research/4501-feedback-shield-existing-impact.json；现代需复验3665/3907/4048/4186/4215，遗留3476等仅相关专项不伪造现代正式认证。当前真实配招5技能/版本/初始化连续灵气护佑→第五护盾消耗与源技能执行已测，不是正式本地HTTP部署。未知1827未豁免为多精灵；本目标暂无可确认的新增真实多精灵延期。

4501处理状态：2026-10-22T10:17:05.399Z 固定50只48只独立工作完成；4501全22招/62项审核，202/202专项含20自身退出0。新增4501-001/002及公共关联原MD。未部署未验收，扫描4503、正式4329，剩4503/4505；必要旧复验59中3前置待答，最终整库待完成，停止4505。

## 4503 库坦逐项审核（2026-10-22T10:29:12.584Z）

真实SeerAPI资料research/4503-source-check.json、4503-reviewed-snapshot.json、4503-source-manifest.json；Wiki补充4503-wiki-source.json。魂印1717/98b92253/eid2108/[2,2,0,100,1]，17招唯一原第五36579/b6a080ad原标记true/PP6，保留真实PP6不改成5。Wiki魂印320254、精灵359640、第五314143、1594=344053、1297=349302、1862=344320、1981=344439。API1297格式明确三级条件：先清回合→成功才害怕→害怕失败才吸取，清失败不吸，无需重问已有明确层级。所有完整原词条、有序实例参数、hash和URL：
```json
[
  {
    "id": 1717,
    "description": "回合开始时令自身攻击+2、防御+2，战斗阶段结束时若自身不处于能力提升状态则令对手下回合无法主动切换精灵；|双方任意一方使用技能后若自身存在技能PP值为0则100%令对手流血，未触发则恢复自身所有技能PP值且令对手下回合使用的技能附加效果失效|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时令自身攻击+2、防御+2\r\n\r\n<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时若自身不处于能力提升状态则令对手下回合<color=#64F9FA>无法主动切换精灵</color>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>双方任意一方使用技能后若自身存在技能PP值为0则100%<color=#64F9FA>令对手流血</color>\r\n<indent=32><sprite=4><indent=48>未触发则<color=#64F9FA>恢复</color>自身所有技能<b>PP值</b>且令对手下回合<b>所有技能</b><color=#64F9FA>命中效果失效</color>",
    "analyze_desc": "",
    "hash": "98b92253",
    "eid": 2108,
    "args": [
      2,
      2,
      0,
      100,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1717",
      "revision": "98b92253",
      "loadedAt": "2026-10-22T10:17:15.950Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 10074,
    "name": "愤怒",
    "type": "普通",
    "kind": "physical",
    "power": 40,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      9
    ],
    "effectInstances": [
      {
        "id": 9,
        "args": [
          20,
          80
        ],
        "description": "连续使用每次威力增加20，最高威力80"
      }
    ],
    "description": "连续使用每次威力增加20，最高威力80",
    "revision": "seerapi:a76170ff",
    "hash": "a76170ff",
    "level": 1,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 21325,
    "name": "高速姿态",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 30,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      4
    ],
    "effectInstances": [
      {
        "id": 4,
        "args": [
          4,
          100,
          1
        ],
        "description": "技能使用成功时，100%改变自身速度等级+1"
      }
    ],
    "description": "技能使用成功时，100%改变自身速度等级+1",
    "revision": "seerapi:1955bc57",
    "hash": "1955bc57",
    "level": 5,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10391,
    "name": "暗流击",
    "type": "暗影",
    "kind": "physical",
    "power": 60,
    "pp": 30,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      15
    ],
    "effectInstances": [
      {
        "id": 15,
        "args": [
          5
        ],
        "description": "命中后5%令对方害怕"
      }
    ],
    "description": "命中后5%令对方害怕",
    "revision": "seerapi:d133ec17",
    "hash": "d133ec17",
    "level": 9,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10366,
    "name": "双刃刀光",
    "type": "战斗",
    "kind": "special",
    "power": 75,
    "pp": 35,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      5
    ],
    "effectInstances": [
      {
        "id": 5,
        "args": [
          3,
          15,
          -1
        ],
        "description": "技能使用成功时，15%改变对手特防等级-1"
      }
    ],
    "description": "技能使用成功时，15%改变对手特防等级-1",
    "revision": "seerapi:38d23d64",
    "hash": "38d23d64",
    "level": 13,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 20816,
    "name": "黑暗掩护",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 15,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      5
    ],
    "effectInstances": [
      {
        "id": 5,
        "args": [
          5,
          100,
          -2
        ],
        "description": "技能使用成功时，100%改变对手命中等级-2"
      }
    ],
    "description": "技能使用成功时，100%改变对手命中等级-2",
    "revision": "seerapi:bd0d2b0a",
    "hash": "bd0d2b0a",
    "level": 17,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36575,
    "name": "残戮砍杀",
    "type": "战斗暗影",
    "kind": "physical",
    "power": 90,
    "pp": 6,
    "priority": 3,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1209,
      1737
    ],
    "effectInstances": [
      {
        "id": 1209,
        "args": [
          50
        ],
        "description": "消除双方能力上升、下降状态，消除成功则附加消除总段数乘以50的固定伤害"
      },
      {
        "id": 1737,
        "args": [
          30
        ],
        "description": "附加自身已损失PP值总和x30的固定伤害，对手免疫固定伤害时额外附加等量的真实伤害"
      }
    ],
    "description": "消除双方能力上升、下降状态，消除成功则附加消除总段数乘以50的固定伤害；附加自身已损失PP值总和x30的固定伤害，对手免疫固定伤害时额外附加等量的真实伤害",
    "revision": "seerapi:dc3711a2",
    "hash": "dc3711a2",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10465,
    "name": "烈震天冲",
    "type": "战斗",
    "kind": "physical",
    "power": 105,
    "pp": 15,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      4
    ],
    "effectInstances": [
      {
        "id": 4,
        "args": [
          0,
          20,
          1
        ],
        "description": "技能使用成功时，20%改变自身攻击等级+1"
      }
    ],
    "description": "技能使用成功时，20%改变自身攻击等级+1",
    "revision": "seerapi:91ec7b3b",
    "hash": "91ec7b3b",
    "level": 25,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 21253,
    "name": "意念操控",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      5,
      5
    ],
    "effectInstances": [
      {
        "id": 5,
        "args": [
          1,
          100,
          -1
        ],
        "description": "技能使用成功时，100%改变对手防御等级-1"
      },
      {
        "id": 5,
        "args": [
          3,
          100,
          -1
        ],
        "description": "技能使用成功时，100%改变对手特防等级-1"
      }
    ],
    "description": "技能使用成功时，100%改变对手防御等级-1；技能使用成功时，100%改变对手特防等级-1",
    "revision": "seerapi:97f13e0d",
    "hash": "97f13e0d",
    "level": 29,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 11308,
    "name": "灵魂震荡",
    "type": "暗影",
    "kind": "physical",
    "power": 110,
    "pp": 10,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [],
    "effectInstances": [],
    "description": "",
    "revision": "seerapi:afbd79a2",
    "hash": "afbd79a2",
    "level": 33,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 32421,
    "name": "战魂爆裂",
    "type": "战斗暗影",
    "kind": "special",
    "power": 120,
    "pp": 10,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      5,
      5
    ],
    "effectInstances": [
      {
        "id": 5,
        "args": [
          1,
          100,
          -2
        ],
        "description": "技能使用成功时，100%改变对手防御等级-2"
      },
      {
        "id": 5,
        "args": [
          3,
          100,
          -2
        ],
        "description": "技能使用成功时，100%改变对手特防等级-2"
      }
    ],
    "description": "技能使用成功时，100%改变对手防御等级-2；技能使用成功时，100%改变对手特防等级-2",
    "revision": "seerapi:1c3ce70c",
    "hash": "1c3ce70c",
    "level": 37,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28298,
    "name": "衰竭骷骨",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 10,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1348
    ],
    "effectInstances": [
      {
        "id": 1348,
        "args": [
          3,
          1
        ],
        "description": "3回合内若对手使用属性技能则随机附加1种异常状态，未触发则消除对手回合类效果"
      }
    ],
    "description": "3回合内若对手使用属性技能则随机附加1种异常状态，未触发则消除对手回合类效果",
    "revision": "seerapi:ce3848c6",
    "hash": "ce3848c6",
    "level": 41,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36576,
    "name": "刚猛强击",
    "type": "战斗暗影",
    "kind": "physical",
    "power": 130,
    "pp": 10,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1549
    ],
    "effectInstances": [
      {
        "id": 1549,
        "args": [
          2
        ],
        "description": "后出手时下回合攻击技能先制+2"
      }
    ],
    "description": "后出手时下回合攻击技能先制+2",
    "revision": "seerapi:92a5b61b",
    "hash": "92a5b61b",
    "level": 45,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28299,
    "name": "恶兽邪心",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      191,
      1862,
      693
    ],
    "effectInstances": [
      {
        "id": 191,
        "args": [
          4
        ],
        "description": "4回合内免疫并反弹所有受到的异常状态"
      },
      {
        "id": 1862,
        "args": [
          100,
          16,
          5
        ],
        "description": "100%令对手流血，未触发则降低自身所有技能5点PP值"
      },
      {
        "id": 693,
        "args": [
          2,
          100
        ],
        "description": "下2回合造成的攻击伤害额外提升100%"
      }
    ],
    "description": "4回合内免疫并反弹所有受到的异常状态；100%令对手流血，未触发则降低自身所有技能5点PP值；下2回合造成的攻击伤害额外提升100%",
    "revision": "seerapi:7c001c87",
    "hash": "7c001c87",
    "level": 49,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36577,
    "name": "黑死魔能",
    "type": "战斗暗影",
    "kind": "special",
    "power": 140,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1319
    ],
    "effectInstances": [
      {
        "id": 1319,
        "args": [
          2,
          2,
          0,
          0,
          0,
          0
        ],
        "description": "自身下次被击败后下一只出场的精灵攻击+2，防御+2"
      }
    ],
    "description": "自身下次被击败后下一只出场的精灵攻击+2，防御+2",
    "revision": "seerapi:9b36bc58",
    "hash": "9b36bc58",
    "level": 53,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28300,
    "name": "鬣魂觉醒",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      993,
      1065,
      843
    ],
    "effectInstances": [
      {
        "id": 993,
        "args": [
          1,
          16
        ],
        "description": "全属性+1，对手处于流血状态时强化效果翻倍"
      },
      {
        "id": 1065,
        "args": [
          4,
          3,
          3
        ],
        "description": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/3则恢复效果和百分比伤害翻倍"
      },
      {
        "id": 843,
        "args": [
          2,
          2
        ],
        "description": "下2回合令自身所有技能先制+2"
      }
    ],
    "description": "全属性+1，对手处于流血状态时强化效果翻倍；4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/3则恢复效果和百分比伤害翻倍；下2回合令自身所有技能先制+2",
    "revision": "seerapi:d8fea29c",
    "hash": "d8fea29c",
    "level": 57,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36578,
    "name": "伏影碎灭斩",
    "type": "战斗暗影",
    "kind": "physical",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1775,
      1594
    ],
    "effectInstances": [
      {
        "id": 1775,
        "args": [
          1
        ],
        "description": "令对手下1次使用的技能PP值归零"
      },
      {
        "id": 1594,
        "args": [
          3,
          50,
          1,
          100,
          1
        ],
        "description": "3回合内受到攻击则50%使自身全属性+1，未触发则100%使对手全属性-1"
      }
    ],
    "description": "令对手下1次使用的技能PP值归零；3回合内受到攻击则50%使自身全属性+1，未触发则100%使对手全属性-1",
    "revision": "seerapi:d75cc3e1",
    "hash": "d75cc3e1",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36579,
    "name": "狂厉攫命劈",
    "type": "战斗暗影",
    "kind": "physical",
    "power": 160,
    "pp": 6,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1297,
      1981,
      444
    ],
    "effectInstances": [
      {
        "id": 1297,
        "args": [
          6,
          3
        ],
        "description": "消除对手回合类效果，消除成功则令对手害怕，未触发则吸取对手最大体力的1/3"
      },
      {
        "id": 1981,
        "args": [
          16,
          2
        ],
        "description": "若对手处于流血状态则2回合内攻击技能无法造成伤害且命中效果失效"
      },
      {
        "id": 444,
        "args": [],
        "description": "降低对手所有PP一点，并恢复自身所有PP一点"
      }
    ],
    "description": "消除对手回合类效果，消除成功则令对手害怕，未触发则吸取对手最大体力的1/3；若对手处于流血状态则2回合内攻击技能无法造成伤害且命中效果失效；降低对手所有PP一点，并恢复自身所有PP一点",
    "revision": "seerapi:b6a080ad",
    "hash": "b6a080ad",
    "level": 76,
    "fifth": true,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "fifth"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4503-001 1594新来源概率成功但强化未生效是否执行全弱

36578/d75cc3e1/i1，1594/9d76f03d/[3,50,1,100,1]：“3回合内受到攻击则50%使自身全属性+1，未触发则100%使对手全属性-1”。API/Wiki344053未定义50%抽中但禁强化或全+6没有实际变化时“未触发”指概率失败还是强化未生效。research/FIXED60-ANSWER-USER-CONFIRMATIONS.json公共4075-012明确绑定27229/df23ee7f，同参数不同技能版本，不能把有限确认自行扩大到新来源36578。单次正受攻的概率成功/概率失败已真实测试；禁强化与满级无实际提升显式guard。若按概率失败则无全弱，按强化未生效则敌全-1。

问题：是否对本36578/1594新实例也按强化没有实际提升就执行敌全-1，还是只有50%抽取失败才执行？

我的回答：没提升就执行

### Q-N20-4503-002 1065回复并造成等量百分比的基数

28300/d8fea29c/i1，1065/8a968e14/[4,3,3]：“4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/3则恢复效果和百分比伤害翻倍”。API/Wiki词条未说明禁疗/溢出时“等量”按实际还是理论回复。已有全局理论规则明确的是“附加maxHP百分比伤害并回复等量体力”和固定吸取，不擅自把方向相反的“回复并造成等量伤害”扩大为确认；本轮未自动读取新答案当授权。恢复前严格低于三分一双倍、等于不双、无禁疗且无溢出时实际=理论的共同回复与百分比已实做；回复被阻/溢出等两基数不同场景显式guard。满HP时理论3000、实际0，对手附伤可能3000或0，差异明确。

问题：1065这种先恢复再造成等量百分比的词条，在禁疗和溢出时按理论回复量还是实际回复量附伤？

我的回答：按实际回复量

### 既有公共问题关联与已确认机制实做

- Q-N20-4438-001：同36578/d75cc3e1/i1的1594，同回多段/多次受攻抽取及触发单位仍关联原主问题；未自动扩4075特定实例的整回一次。
- Q-N20-4359-003：同1594新实例完整0与MISS是否“受到攻击”待答，完整正且保1实际0共同分支已测，不把完整0豁免当前分支。
- 1717无新增自身问题：双方任一实际用技之后检查自己是否存在0PP，100%流血失败才回满全PP并令对手次回所有技能命中效果失效，保留固有词条；实际PP消耗至0/控制未用/普通MISS/保护等已测。无强化时禁止主动换宠是真多精灵，完整登记；1319[2,2,0,0,0,0]下次被击败后下一只攻击/防御+2也只多精灵延期。
- 随机异常执行发现旧通用衰弱3回覆盖已抽中的2回：按AGENTS最新用户随机规则修复公共randomSelection参数，抽样2/3时长真正应用并保留同名最大剩余，非随机衰弱原规则保留；原来源/旧用户确认未改。实际1348抽衰弱2与免疫不补抽状态已测，其他明确限定异常不含衰弱的来源没有影响。影响审计research/4503-random-duration-existing-impact.json区分19必要现代目标与27阴性候选；不是因为代码本来如此才宣称来源确认。

4503处理状态：2026-10-22T10:29:12.584Z 固定50只49只独立工作完成；4503全17招/44项审核，96/96专项含16自身退出0。新增4503-001/002及公共关联原MD，扫描4505、正式4329。必要旧复验69中3前置待答，尚需4505、旧复验与最终整库，停止4505。

## 4505 婕克拉德逐项审核（2026-10-22T10:45:24.112Z）

真实证据research/4505-source-check.json、4505-reviewed-snapshot.json、4505-source-manifest.json、4505-extra-source.json、4505-wiki-source.json、4505-extra-wiki-source.json、4505-net-stage-search.json；API1569非JSON原错误保留，续查成功7bc13bd3，其余全部真实源齐。魂印1719/f04d5267/eid2110[1,0]；eid2110/6927151a仅args_num2，不含n公式。Wiki精灵359635、魂印320256、1569=344028、1881=344339、1982=344440、6=342672、1135=349007、1148=349220、1983=344441；净能力变化值/能力等级/能力变化精确页均缺失，净能力变化值全文检索0条，srnamespace104被忽略警告原样保留。17招唯一原第五36589/377b935c，全部原文/实例/参数/哈希/URL：
```json
[
  {
    "id": 1719,
    "description": "回合开始时令对手命中-2，之后根据对手当前的净能力变化值n获得如下效果：|n≥2：100%令对手寄生；|n≥6：若对手处于全属性提升状态则令对手全属性+1，若对手处于全属性下降状态则令对手全属性-1，之后二者中任意一项效果满足触发条件则复制对手当前的能力等级状态；|n≥12：双方任意一方使用技能后重置对手当前的能力等级状态，每重置1级则当回合战斗阶段结束时{吸取}对手100点{体力}|（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时令对手命中-2，然后根据对手当前的净能力变化值n获得如下效果：\r\n<indent=32><sprite=4><indent=48>n≥2：100%<color=#64F9FA>令对手寄生</color>\r\n<indent=32><sprite=4><indent=48>n≥6：若对手处于全属性提升状态则<color=#64F9FA>令对手全属性+1</color>，若对手处于全属性下降状态则令对手<color=#64F9FA>全属性-1</color>\r\n<indent=32><sprite=4><sprite=4><indent=64>然后上述任意一项效果满足触发条件则<color=#64F9FA>复制</color>对手当前的<b>能力等级</b>状态\r\n<indent=32><sprite=4><indent=48>n≥12：双方任意一方使用技能后<color=#64F9FA>重置</color>对手当前的<b>能力等级</b>状态\r\n<indent=32><sprite=4><sprite=4><indent=64>每变化1级则当回合战斗阶段结束时<color=#64F9FA>吸取</color>对手100点<b>体力</b>",
    "analyze_desc": "",
    "hash": "f04d5267",
    "eid": 2110,
    "args": [
      1,
      0
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1719",
      "revision": "f04d5267",
      "loadedAt": "2026-10-22T10:29:28.067Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  {
    "id": 10018,
    "name": "飞击",
    "type": "飞行",
    "kind": "physical",
    "power": 35,
    "pp": 35,
    "priority": 0,
    "accuracy": 96,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [],
    "effectInstances": [],
    "description": "",
    "revision": "seerapi:195cf4b6",
    "hash": "195cf4b6",
    "level": 1,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 20001,
    "name": "缩头",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 40,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      4
    ],
    "effectInstances": [
      {
        "id": 4,
        "args": [
          1,
          100,
          1
        ],
        "description": "技能使用成功时，100%改变自身防御等级+1"
      }
    ],
    "description": "技能使用成功时，100%改变自身防御等级+1",
    "revision": "seerapi:5aa2e4ae",
    "hash": "5aa2e4ae",
    "level": 5,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10022,
    "name": "乱突",
    "type": "普通",
    "kind": "physical",
    "power": 15,
    "pp": 20,
    "priority": 0,
    "accuracy": 85,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      31
    ],
    "effectInstances": [
      {
        "id": 31,
        "args": [
          2,
          5
        ],
        "description": "1回合做2~5次攻击"
      }
    ],
    "description": "1回合做2~5次攻击",
    "revision": "seerapi:fc4b1dc4",
    "hash": "fc4b1dc4",
    "level": 9,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10054,
    "name": "旋风",
    "type": "飞行",
    "kind": "special",
    "power": 40,
    "pp": 35,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [],
    "effectInstances": [],
    "description": "",
    "revision": "seerapi:ede622b1",
    "hash": "ede622b1",
    "level": 13,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 20154,
    "name": "扰乱",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      5
    ],
    "effectInstances": [
      {
        "id": 5,
        "args": [
          5,
          100,
          -1
        ],
        "description": "技能使用成功时，100%改变对手命中等级-1"
      }
    ],
    "description": "技能使用成功时，100%改变对手命中等级-1",
    "revision": "seerapi:275b222f",
    "hash": "275b222f",
    "level": 17,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36585,
    "name": "羽落凄凄",
    "type": "混沌飞行",
    "kind": "physical",
    "power": 85,
    "pp": 20,
    "priority": 3,
    "accuracy": 94,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1002,
      1423
    ],
    "effectInstances": [
      {
        "id": 1002,
        "args": [
          1
        ],
        "description": "若对手处于异常状态则先制+1"
      },
      {
        "id": 1423,
        "args": [
          100,
          8,
          2
        ],
        "description": "消除对手回合类效果，消除成功则100%令对手睡眠，未触发则恢复自身最大体力的1/2"
      }
    ],
    "description": "若对手处于异常状态则先制+1；消除对手回合类效果，消除成功则100%令对手睡眠，未触发则恢复自身最大体力的1/2",
    "revision": "seerapi:49c875c5",
    "hash": "49c875c5",
    "level": 21,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10056,
    "name": "空气切裂",
    "type": "飞行",
    "kind": "special",
    "power": 75,
    "pp": 20,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      29
    ],
    "effectInstances": [
      {
        "id": 29,
        "args": [
          60
        ],
        "description": "额外附加60点固定伤害"
      }
    ],
    "description": "额外附加60点固定伤害",
    "revision": "seerapi:9f0fb242",
    "hash": "9f0fb242",
    "level": 25,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 20369,
    "name": "虚招",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 30,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      4
    ],
    "effectInstances": [
      {
        "id": 4,
        "args": [
          5,
          100,
          1
        ],
        "description": "技能使用成功时，100%改变自身命中等级+1"
      }
    ],
    "description": "技能使用成功时，100%改变自身命中等级+1",
    "revision": "seerapi:489bc3c",
    "hash": "489bc3c",
    "level": 29,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 10199,
    "name": "飞空冲撞",
    "type": "飞行",
    "kind": "physical",
    "power": 90,
    "pp": 20,
    "priority": 0,
    "accuracy": 100,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      6
    ],
    "effectInstances": [
      {
        "id": 6,
        "args": [
          4
        ],
        "description": "对方所受伤害的1/4会反弹给自己"
      }
    ],
    "description": "对方所受伤害的1/4会反弹给自己",
    "revision": "seerapi:f49ccb7c",
    "hash": "f49ccb7c",
    "level": 33,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 35673,
    "name": "极速升空",
    "type": "混沌飞行",
    "kind": "special",
    "power": 120,
    "pp": 10,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1467
    ],
    "effectInstances": [
      {
        "id": 1467,
        "args": [
          3,
          1
        ],
        "description": "随机使自身3项能力值+1，先出手时提升效果翻倍"
      }
    ],
    "description": "随机使自身3项能力值+1，先出手时提升效果翻倍",
    "revision": "seerapi:d39b09c4",
    "hash": "d39b09c4",
    "level": 37,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28303,
    "name": "邪翅送葬",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 10,
    "priority": 0,
    "accuracy": 91,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1566
    ],
    "effectInstances": [
      {
        "id": 1566,
        "args": [
          3
        ],
        "description": "3回合内每回合结束后反转对手能力提升状态"
      }
    ],
    "description": "3回合内每回合结束后反转对手能力提升状态",
    "revision": "seerapi:3e62739f",
    "hash": "3e62739f",
    "level": 41,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36586,
    "name": "恶毒噬心",
    "type": "混沌飞行",
    "kind": "physical",
    "power": 130,
    "pp": 10,
    "priority": 0,
    "accuracy": 90,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1865
    ],
    "effectInstances": [
      {
        "id": 1865,
        "args": [
          2
        ],
        "description": "为自身附加2种异常状态"
      }
    ],
    "description": "为自身附加2种异常状态",
    "revision": "seerapi:f982bf19",
    "hash": "f982bf19",
    "level": 45,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28304,
    "name": "化鸠为鸩",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1687,
      1569,
      1135
    ],
    "effectInstances": [
      {
        "id": 1687,
        "args": [
          4
        ],
        "description": "4回合内免疫并反弹所有受到的控制类异常状态"
      },
      {
        "id": 1569,
        "args": [
          100,
          4,
          1,
          4,
          1
        ],
        "description": "100%令对手寄生，若触发则自身下1次攻击技能造成的伤害提升100%，若未触发则令自身寄生且免疫下1次对手的攻击"
      },
      {
        "id": 1135,
        "args": [
          2
        ],
        "description": "若自身当前体力低于最大体力的1/2则恢复自身全部体力并造成等量固定伤害"
      }
    ],
    "description": "4回合内免疫并反弹所有受到的控制类异常状态；100%令对手寄生，若触发则自身下1次攻击技能造成的伤害提升100%，若未触发则令自身寄生且免疫下1次对手的攻击；若自身当前体力低于最大体力的1/2则恢复自身全部体力并造成等量固定伤害",
    "revision": "seerapi:a3b5d6fb",
    "hash": "a3b5d6fb",
    "level": 49,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36587,
    "name": "诡魅哀歌",
    "type": "混沌飞行",
    "kind": "special",
    "power": 140,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      835,
      1148
    ],
    "effectInstances": [
      {
        "id": 835,
        "args": [],
        "description": "反转自身能力下降状态，反转成功则恢复自身全部体力"
      },
      {
        "id": 1148,
        "args": [
          240,
          320
        ],
        "description": "随机吸取对手240-320点体力"
      }
    ],
    "description": "反转自身能力下降状态，反转成功则恢复自身全部体力；随机吸取对手240-320点体力",
    "revision": "seerapi:1385da14",
    "hash": "1385da14",
    "level": 53,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 28305,
    "name": "欺罔之视",
    "type": "普通",
    "kind": "status",
    "power": 0,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      970,
      1338,
      1438
    ],
    "effectInstances": [
      {
        "id": 970,
        "args": [
          3
        ],
        "description": "双倍反转对手能力提升状态，反转成功则下回合自身所有技能先制+3，反转失败则消除对手能力提升状态"
      },
      {
        "id": 1338,
        "args": [
          1
        ],
        "description": "全属性+1，对手处于能力下降状态时强化效果翻倍"
      },
      {
        "id": 1438,
        "args": [
          2
        ],
        "description": "若对手处于能力下降状态，则2回合内令对手使用的属性技能无效"
      }
    ],
    "description": "双倍反转对手能力提升状态，反转成功则下回合自身所有技能先制+3，反转失败则消除对手能力提升状态；全属性+1，对手处于能力下降状态时强化效果翻倍；若对手处于能力下降状态，则2回合内令对手使用的属性技能无效",
    "revision": "seerapi:6a8963df",
    "hash": "6a8963df",
    "level": 57,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36588,
    "name": "异变始源",
    "type": "混沌",
    "kind": "physical",
    "power": 240,
    "pp": 2,
    "priority": 0,
    "accuracy": 93,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      1982
    ],
    "effectInstances": [
      {
        "id": 1982,
        "args": [],
        "description": "双方6项能力等级状态全部相同时造成的攻击伤害翻倍"
      }
    ],
    "description": "双方6项能力等级状态全部相同时造成的攻击伤害翻倍",
    "revision": "seerapi:708776cd",
    "hash": "708776cd",
    "level": 61,
    "fifth": false,
    "sourceFlags": {
      "is_fifth": false,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "regular"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  },
  {
    "id": 36589,
    "name": "舐翼妩魔曲",
    "type": "混沌飞行",
    "kind": "physical",
    "power": 160,
    "pp": 5,
    "priority": 0,
    "accuracy": 95,
    "alwaysHit": true,
    "critical": "1/16",
    "effectIds": [
      1169,
      1881,
      1983,
      843
    ],
    "effectInstances": [
      {
        "id": 1169,
        "args": [
          100
        ],
        "description": "若自身处于异常状态则造成的攻击伤害额外提升100%且回合结束后解除自身所有异常状态"
      },
      {
        "id": 1881,
        "args": [],
        "description": "若命中前对手处于异常状态则将其能力提升状态视为相应的能力下降状态"
      },
      {
        "id": 1983,
        "args": [
          4,
          320
        ],
        "description": "4回合内每回合使用技能吸取对手320点体力"
      },
      {
        "id": 843,
        "args": [
          2,
          2
        ],
        "description": "下2回合令自身所有技能先制+2"
      }
    ],
    "description": "若自身处于异常状态则造成的攻击伤害额外提升100%且回合结束后解除自身所有异常状态；若命中前对手处于异常状态则将其能力提升状态视为相应的能力下降状态；4回合内每回合使用技能吸取对手320点体力；下2回合令自身所有技能先制+2",
    "revision": "seerapi:377b935c",
    "hash": "377b935c",
    "level": 76,
    "fifth": true,
    "sourceFlags": {
      "is_fifth": true,
      "is_special": false,
      "skill_activation_item": null,
      "classification": "fifth"
    },
    "provider": "seerapi",
    "sourceTargetCount": 1,
    "deferredEffects": [],
    "limitations": [],
    "advanced": false
  }
]
```

### Q-N20-4505-001 1719净能力变化值n缺少定义

魂印1719原文在上方，回合初敌命中-2后根据“当前的净能力变化值n”按≥2/6/12触发。原API/eid只有[1,0]及参数个数，无计算公式，Wiki精确术语及全文检索未补足；未在已有用户确认中找到明确公式。这里不把正负和/绝对值和/是否包含命中等代码选项伪称上游支持的解释。不同公式会让初始仅命中-2时触发寄生与否不同，影响全部后续阈值。当前命中-2/免弱/封顶已实现并测；所有未知阈值自动触发保持pending，不猜n。

不依赖公式的当前载荷已实现为魂印qualifiedBands条件能力：给定明确n≥2前提则实际寄生，给定≥6则六项全正/全负才敌再±1并复制真实等级，给定≥12则双方实际用后重置、累计已变化等级每级100固定吸取战阶结算并理论回复。专项在测试内显式注入已满足阈值的前提，再经真实引擎状态验证；这不是已验证未知n，不是正式版本的阈值自动触发，也不表示魂印已完整完成。所有需等n的真实触发仍被阻塞。

问题：1719的净能力变化值n准确公式是什么，计算哪些能力及如何处理正负等级，是否按回合初命中-2后的状态计算？

我的回答：变化后能力值与变化前的差值的绝对值，比如变化前双攻双防各加一；变化后双攻双防各减一，则n为8；是

### Q-N20-4505-002 能力等级特殊操作与保护/免弱/反制交互

关联1719/f04d5267的n≥6复制当前等级与n≥12重置；28303/3e62739f/i0=1566/b22f0ab/[3]每回合末反转强化；28305/6a8963df/i0=970/367ebcd6/[3]双倍反转强化成功次回先制3/失败消强。原文以上方完整来源为准。现有普通清强保护仅定义“消除或吸取”，反转、复制、重置不是相同文字，未找到本新实例的用户确认或资料，不能把旧1474等特定反转反制扩为全局。

无保护、无相关反制的明确自身载荷已实现并状态测试；复制“满足触发条件”与实际±1被阻分开，满足全正条件但敌禁强化时仍复制敌实际等级，不能误写成强化实际成功才复制。复制接收者的免弱/禁强化、重置对象强保/负锁/免弱及旧能力消失反制、1566/970目标强保/免弱边界均待答guard。若重置是否算消除不同，可能导致消强反制/保护、变化级数和战阶吸取量不同。没有把旧代码的先清后降造成-2当作双倍反转的真实依据。

问题：请明确上述复制、重置、1566反转和970双倍反转各自是否受强保/负锁/免弱/禁强化影响，以及是否触发消强或清弱反制，重置每级如何统计？

我的回答：复制是把对手的覆盖给自己，受己方免弱禁强化影响；重置受这些影响；反转和双倍反转受这些影响；触发；重置就是变成0

### Q-N20-4505-003 效果6反弹的伤害类型和基数

10199/f49ccb7c/i0=6/3b6e7cac/[4]：“对方所受伤害的1/4会反弹给自己”。API全部字段与Wiki342672同文，未标伤害类型或完整/实际基数，现有处理器真伤只是实现基线，不能当真实依据。攻击免疫完整0时无反弹共同分支已验证；正伤害反弹尚未确认且显式guard。完整伤害800、敌实际失去200会分别得到200或50；反弹伤害类型也影响自身免疫/护盾/事件。此处仅举两种已存在数量概念的差异，不编造上游支持的选项，不把“反弹”随意改成直接HP损失。

问题：本效果6对自身反弹属于什么伤害/体力损失类型，按敌方本次完整结算伤害还是实际HP减少量计算？

我的回答：真实伤害；完整结算；“变化前”具体指回合开始，对攻击、防御、特攻、特防、速度、命中六项逐项计算前后等级差的绝对值再求和

### 关联公共 Q-N20-4442-001

28304/a3b5d6fb/i1=1569/7bc13bd3/[100,4,1,4,1]寄生成功后下1次攻击技能“造成的伤害提升100%”；攻击本体翻倍、状态/控制未用不消耗、失败自身寄生并免下一攻均实做。下一攻击包含固定/百分比/真实附伤时是否也提升属于已有泛伤害范围问题，不能把已知攻击翻倍扩大到所有类型；公共事件携带精确源问题只作用新1569奖励，旧既有来源无该字段行为不变。普通新第五1983[4,320]固定吸取按已确认理论固定数值回复；未改成汲取真伤。1135“回复全部”明确按当前缺失HP的实际恢复值附固定，不把请求maxHP参数当理论源。

1881复用已有正级视负的公共视图：源命中前快照，只本次当前技能/附效视图，真实对手等级不反转，命中前无异常不生效，暴击与命中载荷失效交互已测；1982逐个比较六项，不能只比较总和。无新增真实多精灵分支；n和保护疑问不作为多精灵延期。

4505处理状态：2026-10-22T10:45:24.112Z 固定50只全部独立工作完成（不等于正式完成）；4505全17招/42项审核，140/140专项含19自身退出0。n真实触发未接入、条件载荷需明确前提，所有新增问题原MD。扫描已到226行4505、下一227行4509未开始，正式4329不动。后续继续69必要旧目标复验（3语义前置待答）及最终完整npm，尚未结束。

4505反弹研究处理补充：全局6旧处理器保留既有可用版本，不以新增待确认守卫破坏它；4505研究隔离编译整实例6排除，审核implementation/tests留空，非正反弹已实现。发现3697以及遗留2988/2996/2997使用相同10199/f49ccb7c源，关联Q-N20-4505-003；3697加入必要回访的语义前置待答，不以旧原代码/测试证明新语义。遗留目标不虚构现代认证。

### Q-N20-4498-002 追加关联既有4114伙伴实例（不重编号/不代填回答）

4114/真实伙伴技能38453/ad75b4ba/i3=1952[100,6]，“无视对手能力提升状态，无视成功则100%令对手害怕”。来源既有data/species/4114.json完整SeerAPI快照，research/4498-1952-existing-impact.json及fixed50-additional-semantic-findings.json。与4498/36554/302aad3e同模板的“无视成功”判据关联；不同技能/异常参数不合并来源哈希。定向检索FIXED60-ANSWER-USER-CONFIRMATIONS.json没有1952确认，旧审核无userConfirmation，本轮不把旧代码任意正级即成功当新答案。原可用版本保留、未修改其源或实现，此项作为语义回访待答，不强行再认证。需要主问题答复分别覆盖本实例，不自动扩大其它旧确认。

## 固定50只执行结束状态（不填写用户答案）

2026-10-22T14:02:15.035Z 固定50只全部独立工作完成，2只单精灵验收通过保留有效认证，47只部分待答及4338旧验收后待答，合计48只当前未正式完成；外部阻塞0/跳过0。2598项审核无缺失/失效或独立结构错误。66旧目标正式复验均退出0/passed(single-stage)，每次内部6330/6330；5旧语义回访待答。最后独立完整npm6330/6330退出0，运行时/测试705文件hash未变。扫描4505第226行，正式首未过4329第177行，下一4509第227行未开始。本轮已停止，无后台续跑。
原95延期与现93+2历史来源依赖对照：research/fixed50-prior60-deferred-count-audit.json；完整交付及逐只状态：research/BATCH-4329-FIXED50-FINAL.md。


### Q-N20-4329-007 — 真实追加第五36696精确接入授权（落实时新增）

原始pet4329/81dec1d0，魂印1555/90557811、1735/763e1182；原第五35665与伙伴追加第五36696/62da0896。两技能均is_fifth=true，36696另is_special=true，激活道具1725370。旧转换派生fifth=false不能替代来源标记。精确提案与完整技能版本、来源见research/4329-exact-additional-fifth-proposal.json，候选research/4329-confirmed-version-candidate.json。既有审核名单没有4329，未套用其他精灵授权。

问题：是否授权该提案限定的4329及原始版本，使用既有additionalFifthIssues审核名单接入两魂印×两互斥第五四组合，普通技能共享，不跨版本混装，不放宽其他参数或精灵？

我的回答：授权该精确方案

确认来源：用户于本聊天通过问题回复明确授权，记录时间2026-10-22T17:24:22.699Z。仅新增该精确授权，原104项审核结论和回答原样保留。


### Q-N20-4333-004 — 真实追加第五37398精确接入授权

完整来源、两魂印/两第五hash和四互斥组合见research/4333-exact-additional-fifth-proposal.json；原37398的is_fifth=true/is_special=true及激活1726094均保留。001只授权58参数，未扩大既有授权。

我的回答：授权该精确方案

用户在本聊天明确回复，记录时间2026-10-22T17:41:43.509Z。

### Q-N20-4333-005 — 公共攻击免疫与伤害前状态载荷的依赖顺序

实际36696/62da0896实例1959[100,8]在清除攻击伤害免疫后附睡眠、造成伤害的重现，原始来源及最小替代方案均见research/4333-public-immunity-order-evidence.json。原001–003及4329睡眠确认不曾给出这种免疫顺序。

问题：采用先用候选伤害确定并锁定免疫、取消载荷，还是先执行状态效果再判断免疫？

我的回答：先执行状态效果再判断免疫

用户在本聊天明确回复，记录时间2026-10-22T17:41:43.509Z。当前实现依真实阶段先执行状态载荷，随后记录实际免疫事实并阻止后续技能命中载荷；不以零伤推断免疫，不回滚已经执行的状态效果，魂印明确例外独立保留。该说明是实现对应关系，不替用户改写原回答。


## Q-N20-4347-003：追加第五精确审核范围授权

来源4347/pet6297de96，原第五35755/ba76568d与伙伴第五36519/38eefafb均为is_fifth=true。仅请求research/4347-exact-additional-fifth-proposal.json所列两魂印1571/dad708c7、1786/d0e7ec19与两第五建立四个互斥组合并接入现有精确名单，不扩大参数或其他目标授权。

用户回答：待回答（新授权问题，不覆盖已有机制回答）。


### Q-N20-4347-003 用户授权补充记录（2026-10-23T01:35:04.714Z）

来源：本聊天用户对精确授权问题的直接答复。

用户原答：授权该精确方案

授权范围：仅research/4347-exact-additional-fifth-proposal.json所列4347/pet6297de96，魂印1571/dad708c7及1786/d0e7ec19，第五35755/ba76568d及36519/38eefafb，四互斥组合；不扩其他目标或参数。此为用户兼容授权，不改写SeerAPI来源。


## 4354 已审核回答落实中的精确补充（2026-10-23T02:08:02.380Z）

### Q-N20-4354-008 — 1128攻击封锁的继承对象

关联35793/e0502df4实例3及38348/3bc89db0实例4，1128/1b3b7422/[1]。原文“击败对手则令对手下1次使用的攻击技能无效”。原Q007回答“826下回合随机异常由整个队伍继续承接”完整保留并仅用于826；独立Q4501-001的1827队伍属性封锁确认不扩大到1128。已查API与Wiki只重复对手，不能据旧空处理或延期标签推断对象。

具体新问题：1128封锁由对手整个队伍继承（哪个上场精灵首次实际使用攻击便消耗一次并无效），还是仅被击败的原对手复活后承接，或仅下一只出场精灵承接？请明确对象与消费条件。

我的回答：[待补充；不改变原Q007回答]

### Q-N20-4354-009 — 黯穹之尘的克制级数数值映射

关联2079/82ea8f8b及38348/3bc89db0实例0的2439/a73b832/[]。原Q001完整定义已保留，其“攻击技能先制增加自身对对手的克制系数的级数”没有列出数值映射；API/Wiki只有状态名称，既有确认与引擎无公共映射。不能擅自用log2、取整或旧尘固定+1替代。

具体新问题：自身对对手克制为0、0.25、0.5、1、2、4倍时，分别增加几级攻击先制？是否允许负先制？其他已明确尘分支继续实现并验证，不重新询问。

我的回答：[待补充；不改变原Q001回答]


## 4354新增问题用户直接答复记录（2026-10-23T03:54:06.615Z）

来源：本聊天用户回复，逐字保留；原问题与待补充历史不覆盖。

### Q-N20-4354-008 用户补充回答

用户原答：对手整个队伍继承；首次实际使用攻击技能时消耗并无效

### Q-N20-4354-009 用户补充回答

用户原答：级数就是克制倍数向下取整：你得这些情况分别加0,0,0,1,2,4，再一个例子：2.375倍时先制加2；不允许负先制


### Q-N20-4359-004 — 两魂印属性技能封锁范围API内部差异

魂印1584/ca815c0a/eid1943[2,1,1,1]与1852/be392f9a/eid2246[3,1,1,1]；普通desc为“下回合无法使用属性技能”，格式化为“下回合属性技能命中效果失效”。原Q001/002/003未问此项。串行重新查询API同hash仍保持差异，Wiki检索无补充，证据research/4359-property-lock-source-followup.json。

我的回答：按格式化：允许使用并扣PP，仅属性技能命中效果失效


---

## 部署中定向查证后新增语义项（2026-10-23T11:17:26.941Z，不修改既有问题与回答）

### Q-N20-4444-004：800 的伤害类型范围

绑定原实例：4444，24701/327b8005/i1，800/897aa499/[3,2,250]；29345/d919435b/i1，[4,2,250]。API原文“受到的伤害”，未限定类型；Wiki效果:800 revision343260 同文。Q-N20-4438-001最新回答明确整回合计量单位，没有定义800的伤害类型；历史“只有红伤；累计不超过”针对798，不能扩用。

新问题：800的整回合伤害上限适用于哪些类型：攻击红伤、固定伤害、百分比伤害、真实伤害？请指定全部或具体子集。这里只问类型，不重复已答的整回合计量单位。

我的回答：仅攻击红伤

证据：research/parallel-drafts/4444/800-TYPE-EVIDENCE.json；research/4444-800-latest-audit-targeted-evidence.json；research/fixed50-800-1144-wiki-followup.2026-10-23.json。

### Q-N20-4445-001：1144的等量回复基数

绑定原实例：4445，36260/fed752eb/i0，1144/284d178a/[60,360]。API原文“附加60~360点固定伤害并恢复等量体力”；Wiki技能:36260 revision313824同文。原文不含“吸取”，既有固定吸取理论回复统一规则不能直接代入；1709的精确确认也没有授权本实例。

新问题：1144的回复取随机理论数值、经减免/免疫/护罩后的完整结算固定伤害，还是实际HP损失？例如随机292、目标50HP、100护罩且免死留1，三者分别292/192/49；固定伤害免疫时分别292/0/0。禁疗、回复倍率等既有规则继续沿用。

我的回答：随机理论数值（292/292）

证据：research/parallel-drafts/4445/1144-source-and-scope-evidence.json；research/parallel-drafts/4445/1144-observed-boundaries.json；research/fixed50-800-1144-wiki-followup.2026-10-23.json。


### Q-N20-4472-003：1681两处“攻击伤害／技能伤害”的API自身字段冲突

精确绑定4472，魂印1681/6267b18b，eid2070/a40b86fc，[3,100,1]。普通desc：“自身受到攻击伤害后恢复自身最大体力的1/3……战斗阶段结束时，若自身当回合未受到攻击伤害，则下回合攻击技能必定打出致命一击”；同hash格式化两处均为“技能伤害”。主代理重新串行查询两端点HTTP200，仍冲突；eid仅ID/参数数/hash，Wiki魂印1681按攻击伤害，不能裁定API自身字段。旧Q4472-001/002分别是1126和648，648历史“包括失明”已找回，不重复问。

新问题：1681的受伤后回复/低体闪避，以及战阶末未受伤必暴，两处按普通desc只统计攻击红伤，还是按格式化统计所有真实技能来源伤害（红伤、固定、百分比、真实；不把魂印独立伤害当技能）？若两处口径不同，请分别说明。仅问类型/来源范围，其余既有完整结算/实际HP、触发与回合规则保持。

我的回答：两处均只统计攻击红伤

证据：research/4472-new-soul-field-question-evidence.json。
