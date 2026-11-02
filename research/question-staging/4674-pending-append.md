

## 4674 · 原固定第50只

44项逐审、99来源检查0；生产332/332 exit0，本只48项。全部独立工作完成，部分实现待确认；多精灵延期2项。未正式部署/验收。用户编辑期间仅暂存。

### Q-N50-4674-001

```json
{
  "id": "Q-N50-4674-001",
  "species": 4674,
  "version": "92b69ae1",
  "effectInstance": "魂1876/eid2276，每减少1点攻击伤害则下次附加1固定",
  "fullDescription": "自身登场首回合令对手的攻击技能附加效果失效|回合开始时，若自身为满体力则当回合自身所有技能先制+1，若自身不为满体力则当回合受到的攻击伤害额外减少50%，每减少1点攻击伤害，自身下次攻击附加1点固定伤害|（boss无效）",
  "fullFormattedDescription": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场首回合令对手的<b>攻击技能<color=#64F9FA></b>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身为满体力则当回合自身所有技能<b>先制</b>+1；若自身不为满体力则当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%，每减少1点，自身下次攻击<color=#64F9FA>附加</color>1点<b>固定伤害</b>",
  "args": [
    1,
    50,
    1,
    1,
    1
  ],
  "sources": [
    {
      "url": "https://api.seerapi.com/v1/soulmark/1876",
      "data": {
        "id": 1876,
        "desc": "自身登场首回合令对手的攻击技能附加效果失效|回合开始时，若自身为满体力则当回合自身所有技能先制+1，若自身不为满体力则当回合受到的攻击伤害额外减少50%，每减少1点攻击伤害，自身下次攻击附加1点固定伤害|（boss无效）",
        "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场首回合令对手的<b>攻击技能<color=#64F9FA></b>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身为满体力则当回合自身所有技能<b>先制</b>+1；若自身不为满体力则当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%，每减少1点，自身下次攻击<color=#64F9FA>附加</color>1点<b>固定伤害</b>",
        "analyze_desc": "",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4674,
            "url": "https://api.seerapi.com/v1/pet/4674"
          }
        ],
        "effect": {
          "effect_args": [
            1,
            50,
            1,
            1,
            1
          ],
          "effect": {
            "id": 2276,
            "url": "https://api.seerapi.com/v1/eid_effect/2276"
          }
        },
        "effect_alias": "alias_2276_1_50_1_1_1",
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
        "hash": "92b69ae1"
      },
      "loadedAt": "2026-10-26T08:08:59.907Z",
      "storage": "refreshed"
    }
  ],
  "checked": [
    "SeerAPI原始、格式化、eid2276及Wiki魂1876 revision320411均未说明与其他减免叠加时的计量时点",
    "已查冻结旧确认，3983/1245等只明确该实例减伤基数，不扩大到1876",
    "本魂50%单独作用已按同次攻击公式同随机数、去除此减免的前后实际差值核实；完整结算与HP损失继续分开"
  ],
  "gap": "本魂减半之后又被护盾/伤害上限/免疫处理，累计的是本魂这一处理步差值，还是最终完整结算链中本魂实际贡献？",
  "difference": "原攻击800、本魂减至400，再被护盾完全挡住，候选可积攒400或0；不受其他处理时两模型共同400已完成",
  "question": "1876与护盾、伤害上限或免疫同时生效时，“每减少1点”应按哪个结算步骤的差值累计下次固定附伤？",
  "answer": ""
}
```

明确问题：1876与护盾、伤害上限或免疫同时生效时，“每减少1点”应按哪个结算步骤的差值累计下次固定附伤？

我的回答：

### Q-N50-4511-006 · 4674新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "gap": "191与未消费免异重叠；1876已有下次附伤但这次攻击MISS/整招无效时是否消耗",
      "relatedSources": [
        {
          "moveId": 28824,
          "name": "极星法环",
          "index": 0,
          "args": [
            4
          ],
          "description": "4回合内免疫并反弹所有受到的异常状态",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28824",
            "data": {
              "id": 28824,
              "name": "极星法环",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；令对手停止了；攻击变得更凌厉了",
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
                  "info": "命中后50%令对手瘫痪，未触发则恢复自身最大体力的1/2体力且3回合内自身受到的伤害不超过300",
                  "analyze_info": "[sprite name=iconHit]命中后50%令对手[color=#57c975]瘫痪[/color]，[color=#52a5f2]未触发[/color]则恢复自身最大体力的1/2体力且3回合内自身受到的伤害不超过300（boss有效）",
                  "args": [
                    50,
                    19,
                    2,
                    3,
                    300
                  ],
                  "effect": {
                    "id": 803,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/803"
                  }
                },
                {
                  "info": "下2回合造成的攻击伤害额外提升100%",
                  "analyze_info": "[sprite name=iconHit]下2回合造成的攻击[color=#52a5f2]伤害额外提升[/color]100%（boss有效）",
                  "args": [
                    2,
                    100
                  ],
                  "effect": {
                    "id": 693,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/693"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "413b9193"
            },
            "loadedAt": "2026-10-26T08:09:30.949Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/191",
            "data": {
              "id": 191,
              "args_num": 1,
              "info": "{0}回合内免疫并反弹所有受到的异常状态",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]{0}回合内免疫并[color=#52a5f2]反弹[/color]所有受到的异常状态（boss有效）",
              "pve_effective": true,
              "param": null,
              "skill": [
                {
                  "id": 16277,
                  "url": "https://api.seerapi.com/v1/skill/16277"
                },
                {
                  "id": 19143,
                  "url": "https://api.seerapi.com/v1/skill/19143"
                },
                {
                  "id": 21633,
                  "url": "https://api.seerapi.com/v1/skill/21633"
                },
                {
                  "id": 22132,
                  "url": "https://api.seerapi.com/v1/skill/22132"
                },
                {
                  "id": 22240,
                  "url": "https://api.seerapi.com/v1/skill/22240"
                },
                {
                  "id": 22362,
                  "url": "https://api.seerapi.com/v1/skill/22362"
                },
                {
                  "id": 22706,
                  "url": "https://api.seerapi.com/v1/skill/22706"
                },
                {
                  "id": 22714,
                  "url": "https://api.seerapi.com/v1/skill/22714"
                },
                {
                  "id": 22962,
                  "url": "https://api.seerapi.com/v1/skill/22962"
                },
                {
                  "id": 23004,
                  "url": "https://api.seerapi.com/v1/skill/23004"
                },
                {
                  "id": 23020,
                  "url": "https://api.seerapi.com/v1/skill/23020"
                },
                {
                  "id": 23169,
                  "url": "https://api.seerapi.com/v1/skill/23169"
                },
                {
                  "id": 23235,
                  "url": "https://api.seerapi.com/v1/skill/23235"
                },
                {
                  "id": 23240,
                  "url": "https://api.seerapi.com/v1/skill/23240"
                },
                {
                  "id": 23278,
                  "url": "https://api.seerapi.com/v1/skill/23278"
                },
                {
                  "id": 23305,
                  "url": "https://api.seerapi.com/v1/skill/23305"
                },
                {
                  "id": 23320,
                  "url": "https://api.seerapi.com/v1/skill/23320"
                },
                {
                  "id": 23324,
                  "url": "https://api.seerapi.com/v1/skill/23324"
                },
                {
                  "id": 23378,
                  "url": "https://api.seerapi.com/v1/skill/23378"
                },
                {
                  "id": 23531,
                  "url": "https://api.seerapi.com/v1/skill/23531"
                },
                {
                  "id": 23622,
                  "url": "https://api.seerapi.com/v1/skill/23622"
                },
                {
                  "id": 23653,
                  "url": "https://api.seerapi.com/v1/skill/23653"
                },
                {
                  "id": 23665,
                  "url": "https://api.seerapi.com/v1/skill/23665"
                },
                {
                  "id": 23769,
                  "url": "https://api.seerapi.com/v1/skill/23769"
                },
                {
                  "id": 23812,
                  "url": "https://api.seerapi.com/v1/skill/23812"
                },
                {
                  "id": 23829,
                  "url": "https://api.seerapi.com/v1/skill/23829"
                },
                {
                  "id": 23859,
                  "url": "https://api.seerapi.com/v1/skill/23859"
                },
                {
                  "id": 23870,
                  "url": "https://api.seerapi.com/v1/skill/23870"
                },
                {
                  "id": 23941,
                  "url": "https://api.seerapi.com/v1/skill/23941"
                },
                {
                  "id": 23942,
                  "url": "https://api.seerapi.com/v1/skill/23942"
                },
                {
                  "id": 23949,
                  "url": "https://api.seerapi.com/v1/skill/23949"
                },
                {
                  "id": 23958,
                  "url": "https://api.seerapi.com/v1/skill/23958"
                },
                {
                  "id": 23967,
                  "url": "https://api.seerapi.com/v1/skill/23967"
                },
                {
                  "id": 23973,
                  "url": "https://api.seerapi.com/v1/skill/23973"
                },
                {
                  "id": 23977,
                  "url": "https://api.seerapi.com/v1/skill/23977"
                },
                {
                  "id": 23979,
                  "url": "https://api.seerapi.com/v1/skill/23979"
                },
                {
                  "id": 23988,
                  "url": "https://api.seerapi.com/v1/skill/23988"
                },
                {
                  "id": 23989,
                  "url": "https://api.seerapi.com/v1/skill/23989"
                },
                {
                  "id": 23999,
                  "url": "https://api.seerapi.com/v1/skill/23999"
                },
                {
                  "id": 24002,
                  "url": "https://api.seerapi.com/v1/skill/24002"
                },
                {
                  "id": 24005,
                  "url": "https://api.seerapi.com/v1/skill/24005"
                },
                {
                  "id": 24030,
                  "url": "https://api.seerapi.com/v1/skill/24030"
                },
                {
                  "id": 24046,
                  "url": "https://api.seerapi.com/v1/skill/24046"
                },
                {
                  "id": 24049,
                  "url": "https://api.seerapi.com/v1/skill/24049"
                },
                {
                  "id": 24053,
                  "url": "https://api.seerapi.com/v1/skill/24053"
                },
                {
                  "id": 24094,
                  "url": "https://api.seerapi.com/v1/skill/24094"
                },
                {
                  "id": 24147,
                  "url": "https://api.seerapi.com/v1/skill/24147"
                },
                {
                  "id": 24164,
                  "url": "https://api.seerapi.com/v1/skill/24164"
                },
                {
                  "id": 24211,
                  "url": "https://api.seerapi.com/v1/skill/24211"
                },
                {
                  "id": 24245,
                  "url": "https://api.seerapi.com/v1/skill/24245"
                },
                {
                  "id": 24289,
                  "url": "https://api.seerapi.com/v1/skill/24289"
                },
                {
                  "id": 24374,
                  "url": "https://api.seerapi.com/v1/skill/24374"
                },
                {
                  "id": 24377,
                  "url": "https://api.seerapi.com/v1/skill/24377"
                },
                {
                  "id": 24384,
                  "url": "https://api.seerapi.com/v1/skill/24384"
                },
                {
                  "id": 24434,
                  "url": "https://api.seerapi.com/v1/skill/24434"
                },
                {
                  "id": 24445,
                  "url": "https://api.seerapi.com/v1/skill/24445"
                },
                {
                  "id": 24502,
                  "url": "https://api.seerapi.com/v1/skill/24502"
                },
                {
                  "id": 24508,
                  "url": "https://api.seerapi.com/v1/skill/24508"
                },
                {
                  "id": 24520,
                  "url": "https://api.seerapi.com/v1/skill/24520"
                },
                {
                  "id": 24534,
                  "url": "https://api.seerapi.com/v1/skill/24534"
                },
                {
                  "id": 24560,
                  "url": "https://api.seerapi.com/v1/skill/24560"
                },
                {
                  "id": 24586,
                  "url": "https://api.seerapi.com/v1/skill/24586"
                },
                {
                  "id": 24604,
                  "url": "https://api.seerapi.com/v1/skill/24604"
                },
                {
                  "id": 24636,
                  "url": "https://api.seerapi.com/v1/skill/24636"
                },
                {
                  "id": 24651,
                  "url": "https://api.seerapi.com/v1/skill/24651"
                },
                {
                  "id": 24657,
                  "url": "https://api.seerapi.com/v1/skill/24657"
                },
                {
                  "id": 24690,
                  "url": "https://api.seerapi.com/v1/skill/24690"
                },
                {
                  "id": 24696,
                  "url": "https://api.seerapi.com/v1/skill/24696"
                },
                {
                  "id": 24701,
                  "url": "https://api.seerapi.com/v1/skill/24701"
                },
                {
                  "id": 24704,
                  "url": "https://api.seerapi.com/v1/skill/24704"
                },
                {
                  "id": 24736,
                  "url": "https://api.seerapi.com/v1/skill/24736"
                },
                {
                  "id": 24742,
                  "url": "https://api.seerapi.com/v1/skill/24742"
                },
                {
                  "id": 24754,
                  "url": "https://api.seerapi.com/v1/skill/24754"
                },
                {
                  "id": 24760,
                  "url": "https://api.seerapi.com/v1/skill/24760"
                },
                {
                  "id": 24765,
                  "url": "https://api.seerapi.com/v1/skill/24765"
                },
                {
                  "id": 24773,
                  "url": "https://api.seerapi.com/v1/skill/24773"
                },
                {
                  "id": 24778,
                  "url": "https://api.seerapi.com/v1/skill/24778"
                },
                {
                  "id": 24780,
                  "url": "https://api.seerapi.com/v1/skill/24780"
                },
                {
                  "id": 24790,
                  "url": "https://api.seerapi.com/v1/skill/24790"
                },
                {
                  "id": 24792,
                  "url": "https://api.seerapi.com/v1/skill/24792"
                },
                {
                  "id": 24806,
                  "url": "https://api.seerapi.com/v1/skill/24806"
                },
                {
                  "id": 24825,
                  "url": "https://api.seerapi.com/v1/skill/24825"
                },
                {
                  "id": 24832,
                  "url": "https://api.seerapi.com/v1/skill/24832"
                },
                {
                  "id": 24838,
                  "url": "https://api.seerapi.com/v1/skill/24838"
                },
                {
                  "id": 24849,
                  "url": "https://api.seerapi.com/v1/skill/24849"
                },
                {
                  "id": 24850,
                  "url": "https://api.seerapi.com/v1/skill/24850"
                },
                {
                  "id": 24855,
                  "url": "https://api.seerapi.com/v1/skill/24855"
                },
                {
                  "id": 24868,
                  "url": "https://api.seerapi.com/v1/skill/24868"
                },
                {
                  "id": 24876,
                  "url": "https://api.seerapi.com/v1/skill/24876"
                },
                {
                  "id": 24881,
                  "url": "https://api.seerapi.com/v1/skill/24881"
                },
                {
                  "id": 24894,
                  "url": "https://api.seerapi.com/v1/skill/24894"
                },
                {
                  "id": 24896,
                  "url": "https://api.seerapi.com/v1/skill/24896"
                },
                {
                  "id": 24900,
                  "url": "https://api.seerapi.com/v1/skill/24900"
                },
                {
                  "id": 24906,
                  "url": "https://api.seerapi.com/v1/skill/24906"
                },
                {
                  "id": 24909,
                  "url": "https://api.seerapi.com/v1/skill/24909"
                },
                {
                  "id": 24910,
                  "url": "https://api.seerapi.com/v1/skill/24910"
                },
                {
                  "id": 24915,
                  "url": "https://api.seerapi.com/v1/skill/24915"
                },
                {
                  "id": 24927,
                  "url": "https://api.seerapi.com/v1/skill/24927"
                },
                {
                  "id": 24935,
                  "url": "https://api.seerapi.com/v1/skill/24935"
                },
                {
                  "id": 24937,
                  "url": "https://api.seerapi.com/v1/skill/24937"
                },
                {
                  "id": 24947,
                  "url": "https://api.seerapi.com/v1/skill/24947"
                },
                {
                  "id": 24949,
                  "url": "https://api.seerapi.com/v1/skill/24949"
                },
                {
                  "id": 24953,
                  "url": "https://api.seerapi.com/v1/skill/24953"
                },
                {
                  "id": 24965,
                  "url": "https://api.seerapi.com/v1/skill/24965"
                },
                {
                  "id": 24971,
                  "url": "https://api.seerapi.com/v1/skill/24971"
                },
                {
                  "id": 24973,
                  "url": "https://api.seerapi.com/v1/skill/24973"
                },
                {
                  "id": 24976,
                  "url": "https://api.seerapi.com/v1/skill/24976"
                },
                {
                  "id": 24981,
                  "url": "https://api.seerapi.com/v1/skill/24981"
                },
                {
                  "id": 24986,
                  "url": "https://api.seerapi.com/v1/skill/24986"
                },
                {
                  "id": 24993,
                  "url": "https://api.seerapi.com/v1/skill/24993"
                },
                {
                  "id": 24995,
                  "url": "https://api.seerapi.com/v1/skill/24995"
                },
                {
                  "id": 25002,
                  "url": "https://api.seerapi.com/v1/skill/25002"
                },
                {
                  "id": 25013,
                  "url": "https://api.seerapi.com/v1/skill/25013"
                },
                {
                  "id": 25017,
                  "url": "https://api.seerapi.com/v1/skill/25017"
                },
                {
                  "id": 25020,
                  "url": "https://api.seerapi.com/v1/skill/25020"
                },
                {
                  "id": 25022,
                  "url": "https://api.seerapi.com/v1/skill/25022"
                },
                {
                  "id": 25027,
                  "url": "https://api.seerapi.com/v1/skill/25027"
                },
                {
                  "id": 25033,
                  "url": "https://api.seerapi.com/v1/skill/25033"
                },
                {
                  "id": 25040,
                  "url": "https://api.seerapi.com/v1/skill/25040"
                },
                {
                  "id": 25053,
                  "url": "https://api.seerapi.com/v1/skill/25053"
                },
                {
                  "id": 25072,
                  "url": "https://api.seerapi.com/v1/skill/25072"
                },
                {
                  "id": 25076,
                  "url": "https://api.seerapi.com/v1/skill/25076"
                },
                {
                  "id": 25080,
                  "url": "https://api.seerapi.com/v1/skill/25080"
                },
                {
                  "id": 25084,
                  "url": "https://api.seerapi.com/v1/skill/25084"
                },
                {
                  "id": 25088,
                  "url": "https://api.seerapi.com/v1/skill/25088"
                },
                {
                  "id": 25098,
                  "url": "https://api.seerapi.com/v1/skill/25098"
                },
                {
                  "id": 25100,
                  "url": "https://api.seerapi.com/v1/skill/25100"
                },
                {
                  "id": 25113,
                  "url": "https://api.seerapi.com/v1/skill/25113"
                },
                {
                  "id": 25115,
                  "url": "https://api.seerapi.com/v1/skill/25115"
                },
                {
                  "id": 25117,
                  "url": "https://api.seerapi.com/v1/skill/25117"
                },
                {
                  "id": 25124,
                  "url": "https://api.seerapi.com/v1/skill/25124"
                },
                {
                  "id": 25126,
                  "url": "https://api.seerapi.com/v1/skill/25126"
                },
                {
                  "id": 25129,
                  "url": "https://api.seerapi.com/v1/skill/25129"
                },
                {
                  "id": 25142,
                  "url": "https://api.seerapi.com/v1/skill/25142"
                },
                {
                  "id": 25148,
                  "url": "https://api.seerapi.com/v1/skill/25148"
                },
                {
                  "id": 25154,
                  "url": "https://api.seerapi.com/v1/skill/25154"
                },
                {
                  "id": 25165,
                  "url": "https://api.seerapi.com/v1/skill/25165"
                },
                {
                  "id": 25166,
                  "url": "https://api.seerapi.com/v1/skill/25166"
                },
                {
                  "id": 25169,
                  "url": "https://api.seerapi.com/v1/skill/25169"
                },
                {
                  "id": 25171,
                  "url": "https://api.seerapi.com/v1/skill/25171"
                },
                {
                  "id": 25174,
                  "url": "https://api.seerapi.com/v1/skill/25174"
                },
                {
                  "id": 25176,
                  "url": "https://api.seerapi.com/v1/skill/25176"
                },
                {
                  "id": 25183,
                  "url": "https://api.seerapi.com/v1/skill/25183"
                },
                {
                  "id": 25185,
                  "url": "https://api.seerapi.com/v1/skill/25185"
                },
                {
                  "id": 25193,
                  "url": "https://api.seerapi.com/v1/skill/25193"
                },
                {
                  "id": 25201,
                  "url": "https://api.seerapi.com/v1/skill/25201"
                },
                {
                  "id": 25202,
                  "url": "https://api.seerapi.com/v1/skill/25202"
                },
                {
                  "id": 25205,
                  "url": "https://api.seerapi.com/v1/skill/25205"
                },
                {
                  "id": 25210,
                  "url": "https://api.seerapi.com/v1/skill/25210"
                },
                {
                  "id": 25214,
                  "url": "https://api.seerapi.com/v1/skill/25214"
                },
                {
                  "id": 25216,
                  "url": "https://api.seerapi.com/v1/skill/25216"
                },
                {
                  "id": 25226,
                  "url": "https://api.seerapi.com/v1/skill/25226"
                },
                {
                  "id": 25232,
                  "url": "https://api.seerapi.com/v1/skill/25232"
                },
                {
                  "id": 25236,
                  "url": "https://api.seerapi.com/v1/skill/25236"
                },
                {
                  "id": 25240,
                  "url": "https://api.seerapi.com/v1/skill/25240"
                },
                {
                  "id": 25241,
                  "url": "https://api.seerapi.com/v1/skill/25241"
                },
                {
                  "id": 25253,
                  "url": "https://api.seerapi.com/v1/skill/25253"
                },
                {
                  "id": 25259,
                  "url": "https://api.seerapi.com/v1/skill/25259"
                },
                {
                  "id": 25266,
                  "url": "https://api.seerapi.com/v1/skill/25266"
                },
                {
                  "id": 25273,
                  "url": "https://api.seerapi.com/v1/skill/25273"
                },
                {
                  "id": 25279,
                  "url": "https://api.seerapi.com/v1/skill/25279"
                },
                {
                  "id": 25287,
                  "url": "https://api.seerapi.com/v1/skill/25287"
                },
                {
                  "id": 25296,
                  "url": "https://api.seerapi.com/v1/skill/25296"
                },
                {
                  "id": 25298,
                  "url": "https://api.seerapi.com/v1/skill/25298"
                },
                {
                  "id": 25301,
                  "url": "https://api.seerapi.com/v1/skill/25301"
                },
                {
                  "id": 25303,
                  "url": "https://api.seerapi.com/v1/skill/25303"
                },
                {
                  "id": 25306,
                  "url": "https://api.seerapi.com/v1/skill/25306"
                },
                {
                  "id": 25314,
                  "url": "https://api.seerapi.com/v1/skill/25314"
                },
                {
                  "id": 25318,
                  "url": "https://api.seerapi.com/v1/skill/25318"
                },
                {
                  "id": 25322,
                  "url": "https://api.seerapi.com/v1/skill/25322"
                },
                {
                  "id": 25336,
                  "url": "https://api.seerapi.com/v1/skill/25336"
                },
                {
                  "id": 25340,
                  "url": "https://api.seerapi.com/v1/skill/25340"
                },
                {
                  "id": 25343,
                  "url": "https://api.seerapi.com/v1/skill/25343"
                },
                {
                  "id": 25347,
                  "url": "https://api.seerapi.com/v1/skill/25347"
                },
                {
                  "id": 25353,
                  "url": "https://api.seerapi.com/v1/skill/25353"
                },
                {
                  "id": 25363,
                  "url": "https://api.seerapi.com/v1/skill/25363"
                },
                {
                  "id": 25369,
                  "url": "https://api.seerapi.com/v1/skill/25369"
                },
                {
                  "id": 25372,
                  "url": "https://api.seerapi.com/v1/skill/25372"
                },
                {
                  "id": 25377,
                  "url": "https://api.seerapi.com/v1/skill/25377"
                },
                {
                  "id": 25382,
                  "url": "https://api.seerapi.com/v1/skill/25382"
                },
                {
                  "id": 25394,
                  "url": "https://api.seerapi.com/v1/skill/25394"
                },
                {
                  "id": 25399,
                  "url": "https://api.seerapi.com/v1/skill/25399"
                },
                {
                  "id": 25407,
                  "url": "https://api.seerapi.com/v1/skill/25407"
                },
                {
                  "id": 25410,
                  "url": "https://api.seerapi.com/v1/skill/25410"
                },
                {
                  "id": 25415,
                  "url": "https://api.seerapi.com/v1/skill/25415"
                },
                {
                  "id": 25420,
                  "url": "https://api.seerapi.com/v1/skill/25420"
                },
                {
                  "id": 25423,
                  "url": "https://api.seerapi.com/v1/skill/25423"
                },
                {
                  "id": 25433,
                  "url": "https://api.seerapi.com/v1/skill/25433"
                },
                {
                  "id": 25436,
                  "url": "https://api.seerapi.com/v1/skill/25436"
                },
                {
                  "id": 25439,
                  "url": "https://api.seerapi.com/v1/skill/25439"
                },
                {
                  "id": 25445,
                  "url": "https://api.seerapi.com/v1/skill/25445"
                },
                {
                  "id": 25446,
                  "url": "https://api.seerapi.com/v1/skill/25446"
                },
                {
                  "id": 25453,
                  "url": "https://api.seerapi.com/v1/skill/25453"
                },
                {
                  "id": 25456,
                  "url": "https://api.seerapi.com/v1/skill/25456"
                },
                {
                  "id": 25461,
                  "url": "https://api.seerapi.com/v1/skill/25461"
                },
                {
                  "id": 25469,
                  "url": "https://api.seerapi.com/v1/skill/25469"
                },
                {
                  "id": 25474,
                  "url": "https://api.seerapi.com/v1/skill/25474"
                },
                {
                  "id": 25484,
                  "url": "https://api.seerapi.com/v1/skill/25484"
                },
                {
                  "id": 25493,
                  "url": "https://api.seerapi.com/v1/skill/25493"
                },
                {
                  "id": 25496,
                  "url": "https://api.seerapi.com/v1/skill/25496"
                },
                {
                  "id": 25501,
                  "url": "https://api.seerapi.com/v1/skill/25501"
                },
                {
                  "id": 25507,
                  "url": "https://api.seerapi.com/v1/skill/25507"
                },
                {
                  "id": 25510,
                  "url": "https://api.seerapi.com/v1/skill/25510"
                },
                {
                  "id": 25513,
                  "url": "https://api.seerapi.com/v1/skill/25513"
                },
                {
                  "id": 25516,
                  "url": "https://api.seerapi.com/v1/skill/25516"
                },
                {
                  "id": 25529,
                  "url": "https://api.seerapi.com/v1/skill/25529"
                },
                {
                  "id": 25531,
                  "url": "https://api.seerapi.com/v1/skill/25531"
                },
                {
                  "id": 25536,
                  "url": "https://api.seerapi.com/v1/skill/25536"
                },
                {
                  "id": 25539,
                  "url": "https://api.seerapi.com/v1/skill/25539"
                },
                {
                  "id": 25551,
                  "url": "https://api.seerapi.com/v1/skill/25551"
                },
                {
                  "id": 25553,
                  "url": "https://api.seerapi.com/v1/skill/25553"
                },
                {
                  "id": 25556,
                  "url": "https://api.seerapi.com/v1/skill/25556"
                },
                {
                  "id": 25559,
                  "url": "https://api.seerapi.com/v1/skill/25559"
                },
                {
                  "id": 25565,
                  "url": "https://api.seerapi.com/v1/skill/25565"
                },
                {
                  "id": 25570,
                  "url": "https://api.seerapi.com/v1/skill/25570"
                },
                {
                  "id": 25572,
                  "url": "https://api.seerapi.com/v1/skill/25572"
                },
                {
                  "id": 25575,
                  "url": "https://api.seerapi.com/v1/skill/25575"
                },
                {
                  "id": 25581,
                  "url": "https://api.seerapi.com/v1/skill/25581"
                },
                {
                  "id": 25584,
                  "url": "https://api.seerapi.com/v1/skill/25584"
                },
                {
                  "id": 25587,
                  "url": "https://api.seerapi.com/v1/skill/25587"
                },
                {
                  "id": 25596,
                  "url": "https://api.seerapi.com/v1/skill/25596"
                },
                {
                  "id": 25604,
                  "url": "https://api.seerapi.com/v1/skill/25604"
                },
                {
                  "id": 25608,
                  "url": "https://api.seerapi.com/v1/skill/25608"
                },
                {
                  "id": 25613,
                  "url": "https://api.seerapi.com/v1/skill/25613"
                },
                {
                  "id": 25619,
                  "url": "https://api.seerapi.com/v1/skill/25619"
                },
                {
                  "id": 25621,
                  "url": "https://api.seerapi.com/v1/skill/25621"
                },
                {
                  "id": 25624,
                  "url": "https://api.seerapi.com/v1/skill/25624"
                },
                {
                  "id": 25627,
                  "url": "https://api.seerapi.com/v1/skill/25627"
                },
                {
                  "id": 25630,
                  "url": "https://api.seerapi.com/v1/skill/25630"
                },
                {
                  "id": 25635,
                  "url": "https://api.seerapi.com/v1/skill/25635"
                },
                {
                  "id": 25638,
                  "url": "https://api.seerapi.com/v1/skill/25638"
                },
                {
                  "id": 25641,
                  "url": "https://api.seerapi.com/v1/skill/25641"
                },
                {
                  "id": 25649,
                  "url": "https://api.seerapi.com/v1/skill/25649"
                },
                {
                  "id": 25652,
                  "url": "https://api.seerapi.com/v1/skill/25652"
                },
                {
                  "id": 25657,
                  "url": "https://api.seerapi.com/v1/skill/25657"
                },
                {
                  "id": 25663,
                  "url": "https://api.seerapi.com/v1/skill/25663"
                },
                {
                  "id": 25665,
                  "url": "https://api.seerapi.com/v1/skill/25665"
                },
                {
                  "id": 25670,
                  "url": "https://api.seerapi.com/v1/skill/25670"
                },
                {
                  "id": 25673,
                  "url": "https://api.seerapi.com/v1/skill/25673"
                },
                {
                  "id": 25680,
                  "url": "https://api.seerapi.com/v1/skill/25680"
                },
                {
                  "id": 25683,
                  "url": "https://api.seerapi.com/v1/skill/25683"
                },
                {
                  "id": 25690,
                  "url": "https://api.seerapi.com/v1/skill/25690"
                },
                {
                  "id": 25696,
                  "url": "https://api.seerapi.com/v1/skill/25696"
                },
                {
                  "id": 25704,
                  "url": "https://api.seerapi.com/v1/skill/25704"
                },
                {
                  "id": 25707,
                  "url": "https://api.seerapi.com/v1/skill/25707"
                },
                {
                  "id": 25715,
                  "url": "https://api.seerapi.com/v1/skill/25715"
                },
                {
                  "id": 25717,
                  "url": "https://api.seerapi.com/v1/skill/25717"
                },
                {
                  "id": 25725,
                  "url": "https://api.seerapi.com/v1/skill/25725"
                },
                {
                  "id": 25730,
                  "url": "https://api.seerapi.com/v1/skill/25730"
                },
                {
                  "id": 25736,
                  "url": "https://api.seerapi.com/v1/skill/25736"
                },
                {
                  "id": 25738,
                  "url": "https://api.seerapi.com/v1/skill/25738"
                },
                {
                  "id": 25741,
                  "url": "https://api.seerapi.com/v1/skill/25741"
                },
                {
                  "id": 25744,
                  "url": "https://api.seerapi.com/v1/skill/25744"
                },
                {
                  "id": 25752,
                  "url": "https://api.seerapi.com/v1/skill/25752"
                },
                {
                  "id": 25755,
                  "url": "https://api.seerapi.com/v1/skill/25755"
                },
                {
                  "id": 25758,
                  "url": "https://api.seerapi.com/v1/skill/25758"
                },
                {
                  "id": 25767,
                  "url": "https://api.seerapi.com/v1/skill/25767"
                },
                {
                  "id": 25769,
                  "url": "https://api.seerapi.com/v1/skill/25769"
                },
                {
                  "id": 25772,
                  "url": "https://api.seerapi.com/v1/skill/25772"
                },
                {
                  "id": 25783,
                  "url": "https://api.seerapi.com/v1/skill/25783"
                },
                {
                  "id": 25786,
                  "url": "https://api.seerapi.com/v1/skill/25786"
                },
                {
                  "id": 25798,
                  "url": "https://api.seerapi.com/v1/skill/25798"
                },
                {
                  "id": 25801,
                  "url": "https://api.seerapi.com/v1/skill/25801"
                },
                {
                  "id": 25803,
                  "url": "https://api.seerapi.com/v1/skill/25803"
                },
                {
                  "id": 25808,
                  "url": "https://api.seerapi.com/v1/skill/25808"
                },
                {
                  "id": 25810,
                  "url": "https://api.seerapi.com/v1/skill/25810"
                },
                {
                  "id": 25817,
                  "url": "https://api.seerapi.com/v1/skill/25817"
                },
                {
                  "id": 25820,
                  "url": "https://api.seerapi.com/v1/skill/25820"
                },
                {
                  "id": 25822,
                  "url": "https://api.seerapi.com/v1/skill/25822"
                },
                {
                  "id": 25825,
                  "url": "https://api.seerapi.com/v1/skill/25825"
                },
                {
                  "id": 25829,
                  "url": "https://api.seerapi.com/v1/skill/25829"
                },
                {
                  "id": 25837,
                  "url": "https://api.seerapi.com/v1/skill/25837"
                },
                {
                  "id": 25840,
                  "url": "https://api.seerapi.com/v1/skill/25840"
                },
                {
                  "id": 25842,
                  "url": "https://api.seerapi.com/v1/skill/25842"
                },
                {
                  "id": 25844,
                  "url": "https://api.seerapi.com/v1/skill/25844"
                },
                {
                  "id": 25846,
                  "url": "https://api.seerapi.com/v1/skill/25846"
                },
                {
                  "id": 25848,
                  "url": "https://api.seerapi.com/v1/skill/25848"
                },
                {
                  "id": 25856,
                  "url": "https://api.seerapi.com/v1/skill/25856"
                },
                {
                  "id": 25858,
                  "url": "https://api.seerapi.com/v1/skill/25858"
                },
                {
                  "id": 25862,
                  "url": "https://api.seerapi.com/v1/skill/25862"
                },
                {
                  "id": 25867,
                  "url": "https://api.seerapi.com/v1/skill/25867"
                },
                {
                  "id": 25869,
                  "url": "https://api.seerapi.com/v1/skill/25869"
                },
                {
                  "id": 25872,
                  "url": "https://api.seerapi.com/v1/skill/25872"
                },
                {
                  "id": 25875,
                  "url": "https://api.seerapi.com/v1/skill/25875"
                },
                {
                  "id": 25877,
                  "url": "https://api.seerapi.com/v1/skill/25877"
                },
                {
                  "id": 25880,
                  "url": "https://api.seerapi.com/v1/skill/25880"
                },
                {
                  "id": 25881,
                  "url": "https://api.seerapi.com/v1/skill/25881"
                },
                {
                  "id": 25886,
                  "url": "https://api.seerapi.com/v1/skill/25886"
                },
                {
                  "id": 25893,
                  "url": "https://api.seerapi.com/v1/skill/25893"
                },
                {
                  "id": 25895,
                  "url": "https://api.seerapi.com/v1/skill/25895"
                },
                {
                  "id": 25907,
                  "url": "https://api.seerapi.com/v1/skill/25907"
                },
                {
                  "id": 25910,
                  "url": "https://api.seerapi.com/v1/skill/25910"
                },
                {
                  "id": 25920,
                  "url": "https://api.seerapi.com/v1/skill/25920"
                },
                {
                  "id": 25925,
                  "url": "https://api.seerapi.com/v1/skill/25925"
                },
                {
                  "id": 25934,
                  "url": "https://api.seerapi.com/v1/skill/25934"
                },
                {
                  "id": 25937,
                  "url": "https://api.seerapi.com/v1/skill/25937"
                },
                {
                  "id": 25939,
                  "url": "https://api.seerapi.com/v1/skill/25939"
                },
                {
                  "id": 25950,
                  "url": "https://api.seerapi.com/v1/skill/25950"
                },
                {
                  "id": 25955,
                  "url": "https://api.seerapi.com/v1/skill/25955"
                },
                {
                  "id": 25957,
                  "url": "https://api.seerapi.com/v1/skill/25957"
                },
                {
                  "id": 25959,
                  "url": "https://api.seerapi.com/v1/skill/25959"
                },
                {
                  "id": 25965,
                  "url": "https://api.seerapi.com/v1/skill/25965"
                },
                {
                  "id": 25967,
                  "url": "https://api.seerapi.com/v1/skill/25967"
                },
                {
                  "id": 25969,
                  "url": "https://api.seerapi.com/v1/skill/25969"
                },
                {
                  "id": 25979,
                  "url": "https://api.seerapi.com/v1/skill/25979"
                },
                {
                  "id": 25984,
                  "url": "https://api.seerapi.com/v1/skill/25984"
                },
                {
                  "id": 25987,
                  "url": "https://api.seerapi.com/v1/skill/25987"
                },
                {
                  "id": 25991,
                  "url": "https://api.seerapi.com/v1/skill/25991"
                },
                {
                  "id": 25995,
                  "url": "https://api.seerapi.com/v1/skill/25995"
                },
                {
                  "id": 25997,
                  "url": "https://api.seerapi.com/v1/skill/25997"
                },
                {
                  "id": 25999,
                  "url": "https://api.seerapi.com/v1/skill/25999"
                },
                {
                  "id": 26005,
                  "url": "https://api.seerapi.com/v1/skill/26005"
                },
                {
                  "id": 26015,
                  "url": "https://api.seerapi.com/v1/skill/26015"
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
                  "id": 26029,
                  "url": "https://api.seerapi.com/v1/skill/26029"
                },
                {
                  "id": 26031,
                  "url": "https://api.seerapi.com/v1/skill/26031"
                },
                {
                  "id": 26040,
                  "url": "https://api.seerapi.com/v1/skill/26040"
                },
                {
                  "id": 26048,
                  "url": "https://api.seerapi.com/v1/skill/26048"
                },
                {
                  "id": 26051,
                  "url": "https://api.seerapi.com/v1/skill/26051"
                },
                {
                  "id": 26059,
                  "url": "https://api.seerapi.com/v1/skill/26059"
                },
                {
                  "id": 26070,
                  "url": "https://api.seerapi.com/v1/skill/26070"
                },
                {
                  "id": 26072,
                  "url": "https://api.seerapi.com/v1/skill/26072"
                },
                {
                  "id": 26079,
                  "url": "https://api.seerapi.com/v1/skill/26079"
                },
                {
                  "id": 26097,
                  "url": "https://api.seerapi.com/v1/skill/26097"
                },
                {
                  "id": 26108,
                  "url": "https://api.seerapi.com/v1/skill/26108"
                },
                {
                  "id": 26110,
                  "url": "https://api.seerapi.com/v1/skill/26110"
                },
                {
                  "id": 26119,
                  "url": "https://api.seerapi.com/v1/skill/26119"
                },
                {
                  "id": 26130,
                  "url": "https://api.seerapi.com/v1/skill/26130"
                },
                {
                  "id": 26133,
                  "url": "https://api.seerapi.com/v1/skill/26133"
                },
                {
                  "id": 26142,
                  "url": "https://api.seerapi.com/v1/skill/26142"
                },
                {
                  "id": 26153,
                  "url": "https://api.seerapi.com/v1/skill/26153"
                },
                {
                  "id": 26155,
                  "url": "https://api.seerapi.com/v1/skill/26155"
                },
                {
                  "id": 26158,
                  "url": "https://api.seerapi.com/v1/skill/26158"
                },
                {
                  "id": 26161,
                  "url": "https://api.seerapi.com/v1/skill/26161"
                },
                {
                  "id": 26168,
                  "url": "https://api.seerapi.com/v1/skill/26168"
                },
                {
                  "id": 26170,
                  "url": "https://api.seerapi.com/v1/skill/26170"
                },
                {
                  "id": 26175,
                  "url": "https://api.seerapi.com/v1/skill/26175"
                },
                {
                  "id": 26179,
                  "url": "https://api.seerapi.com/v1/skill/26179"
                },
                {
                  "id": 26193,
                  "url": "https://api.seerapi.com/v1/skill/26193"
                },
                {
                  "id": 26194,
                  "url": "https://api.seerapi.com/v1/skill/26194"
                },
                {
                  "id": 26213,
                  "url": "https://api.seerapi.com/v1/skill/26213"
                },
                {
                  "id": 26221,
                  "url": "https://api.seerapi.com/v1/skill/26221"
                },
                {
                  "id": 26223,
                  "url": "https://api.seerapi.com/v1/skill/26223"
                },
                {
                  "id": 26226,
                  "url": "https://api.seerapi.com/v1/skill/26226"
                },
                {
                  "id": 26229,
                  "url": "https://api.seerapi.com/v1/skill/26229"
                },
                {
                  "id": 26233,
                  "url": "https://api.seerapi.com/v1/skill/26233"
                },
                {
                  "id": 26238,
                  "url": "https://api.seerapi.com/v1/skill/26238"
                },
                {
                  "id": 26241,
                  "url": "https://api.seerapi.com/v1/skill/26241"
                },
                {
                  "id": 26244,
                  "url": "https://api.seerapi.com/v1/skill/26244"
                },
                {
                  "id": 26246,
                  "url": "https://api.seerapi.com/v1/skill/26246"
                },
                {
                  "id": 26252,
                  "url": "https://api.seerapi.com/v1/skill/26252"
                },
                {
                  "id": 26254,
                  "url": "https://api.seerapi.com/v1/skill/26254"
                },
                {
                  "id": 26260,
                  "url": "https://api.seerapi.com/v1/skill/26260"
                },
                {
                  "id": 26265,
                  "url": "https://api.seerapi.com/v1/skill/26265"
                },
                {
                  "id": 26271,
                  "url": "https://api.seerapi.com/v1/skill/26271"
                },
                {
                  "id": 26274,
                  "url": "https://api.seerapi.com/v1/skill/26274"
                },
                {
                  "id": 26280,
                  "url": "https://api.seerapi.com/v1/skill/26280"
                },
                {
                  "id": 26282,
                  "url": "https://api.seerapi.com/v1/skill/26282"
                },
                {
                  "id": 26285,
                  "url": "https://api.seerapi.com/v1/skill/26285"
                },
                {
                  "id": 26288,
                  "url": "https://api.seerapi.com/v1/skill/26288"
                },
                {
                  "id": 26291,
                  "url": "https://api.seerapi.com/v1/skill/26291"
                },
                {
                  "id": 26295,
                  "url": "https://api.seerapi.com/v1/skill/26295"
                },
                {
                  "id": 26297,
                  "url": "https://api.seerapi.com/v1/skill/26297"
                },
                {
                  "id": 26301,
                  "url": "https://api.seerapi.com/v1/skill/26301"
                },
                {
                  "id": 26304,
                  "url": "https://api.seerapi.com/v1/skill/26304"
                },
                {
                  "id": 26306,
                  "url": "https://api.seerapi.com/v1/skill/26306"
                },
                {
                  "id": 26314,
                  "url": "https://api.seerapi.com/v1/skill/26314"
                },
                {
                  "id": 26317,
                  "url": "https://api.seerapi.com/v1/skill/26317"
                },
                {
                  "id": 26319,
                  "url": "https://api.seerapi.com/v1/skill/26319"
                },
                {
                  "id": 26323,
                  "url": "https://api.seerapi.com/v1/skill/26323"
                },
                {
                  "id": 26325,
                  "url": "https://api.seerapi.com/v1/skill/26325"
                },
                {
                  "id": 26327,
                  "url": "https://api.seerapi.com/v1/skill/26327"
                },
                {
                  "id": 26333,
                  "url": "https://api.seerapi.com/v1/skill/26333"
                },
                {
                  "id": 26337,
                  "url": "https://api.seerapi.com/v1/skill/26337"
                },
                {
                  "id": 26344,
                  "url": "https://api.seerapi.com/v1/skill/26344"
                },
                {
                  "id": 26346,
                  "url": "https://api.seerapi.com/v1/skill/26346"
                },
                {
                  "id": 26354,
                  "url": "https://api.seerapi.com/v1/skill/26354"
                },
                {
                  "id": 26358,
                  "url": "https://api.seerapi.com/v1/skill/26358"
                },
                {
                  "id": 26363,
                  "url": "https://api.seerapi.com/v1/skill/26363"
                },
                {
                  "id": 26365,
                  "url": "https://api.seerapi.com/v1/skill/26365"
                },
                {
                  "id": 26370,
                  "url": "https://api.seerapi.com/v1/skill/26370"
                },
                {
                  "id": 26372,
                  "url": "https://api.seerapi.com/v1/skill/26372"
                },
                {
                  "id": 26375,
                  "url": "https://api.seerapi.com/v1/skill/26375"
                },
                {
                  "id": 26378,
                  "url": "https://api.seerapi.com/v1/skill/26378"
                },
                {
                  "id": 26382,
                  "url": "https://api.seerapi.com/v1/skill/26382"
                },
                {
                  "id": 26390,
                  "url": "https://api.seerapi.com/v1/skill/26390"
                },
                {
                  "id": 26392,
                  "url": "https://api.seerapi.com/v1/skill/26392"
                },
                {
                  "id": 26401,
                  "url": "https://api.seerapi.com/v1/skill/26401"
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
                  "id": 26417,
                  "url": "https://api.seerapi.com/v1/skill/26417"
                },
                {
                  "id": 26421,
                  "url": "https://api.seerapi.com/v1/skill/26421"
                },
                {
                  "id": 26425,
                  "url": "https://api.seerapi.com/v1/skill/26425"
                },
                {
                  "id": 26428,
                  "url": "https://api.seerapi.com/v1/skill/26428"
                },
                {
                  "id": 26429,
                  "url": "https://api.seerapi.com/v1/skill/26429"
                },
                {
                  "id": 26432,
                  "url": "https://api.seerapi.com/v1/skill/26432"
                },
                {
                  "id": 26435,
                  "url": "https://api.seerapi.com/v1/skill/26435"
                },
                {
                  "id": 26440,
                  "url": "https://api.seerapi.com/v1/skill/26440"
                },
                {
                  "id": 26444,
                  "url": "https://api.seerapi.com/v1/skill/26444"
                },
                {
                  "id": 26447,
                  "url": "https://api.seerapi.com/v1/skill/26447"
                },
                {
                  "id": 26450,
                  "url": "https://api.seerapi.com/v1/skill/26450"
                },
                {
                  "id": 26452,
                  "url": "https://api.seerapi.com/v1/skill/26452"
                },
                {
                  "id": 26457,
                  "url": "https://api.seerapi.com/v1/skill/26457"
                },
                {
                  "id": 26462,
                  "url": "https://api.seerapi.com/v1/skill/26462"
                },
                {
                  "id": 26465,
                  "url": "https://api.seerapi.com/v1/skill/26465"
                },
                {
                  "id": 26468,
                  "url": "https://api.seerapi.com/v1/skill/26468"
                },
                {
                  "id": 26471,
                  "url": "https://api.seerapi.com/v1/skill/26471"
                },
                {
                  "id": 26475,
                  "url": "https://api.seerapi.com/v1/skill/26475"
                },
                {
                  "id": 26478,
                  "url": "https://api.seerapi.com/v1/skill/26478"
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
                  "id": 26488,
                  "url": "https://api.seerapi.com/v1/skill/26488"
                },
                {
                  "id": 26491,
                  "url": "https://api.seerapi.com/v1/skill/26491"
                },
                {
                  "id": 26493,
                  "url": "https://api.seerapi.com/v1/skill/26493"
                },
                {
                  "id": 26496,
                  "url": "https://api.seerapi.com/v1/skill/26496"
                },
                {
                  "id": 26500,
                  "url": "https://api.seerapi.com/v1/skill/26500"
                },
                {
                  "id": 26505,
                  "url": "https://api.seerapi.com/v1/skill/26505"
                },
                {
                  "id": 26508,
                  "url": "https://api.seerapi.com/v1/skill/26508"
                },
                {
                  "id": 26511,
                  "url": "https://api.seerapi.com/v1/skill/26511"
                },
                {
                  "id": 26516,
                  "url": "https://api.seerapi.com/v1/skill/26516"
                },
                {
                  "id": 26518,
                  "url": "https://api.seerapi.com/v1/skill/26518"
                },
                {
                  "id": 26522,
                  "url": "https://api.seerapi.com/v1/skill/26522"
                },
                {
                  "id": 26527,
                  "url": "https://api.seerapi.com/v1/skill/26527"
                },
                {
                  "id": 26530,
                  "url": "https://api.seerapi.com/v1/skill/26530"
                },
                {
                  "id": 26532,
                  "url": "https://api.seerapi.com/v1/skill/26532"
                },
                {
                  "id": 26537,
                  "url": "https://api.seerapi.com/v1/skill/26537"
                },
                {
                  "id": 26548,
                  "url": "https://api.seerapi.com/v1/skill/26548"
                },
                {
                  "id": 26551,
                  "url": "https://api.seerapi.com/v1/skill/26551"
                },
                {
                  "id": 26553,
                  "url": "https://api.seerapi.com/v1/skill/26553"
                },
                {
                  "id": 26555,
                  "url": "https://api.seerapi.com/v1/skill/26555"
                },
                {
                  "id": 26558,
                  "url": "https://api.seerapi.com/v1/skill/26558"
                },
                {
                  "id": 26560,
                  "url": "https://api.seerapi.com/v1/skill/26560"
                },
                {
                  "id": 26565,
                  "url": "https://api.seerapi.com/v1/skill/26565"
                },
                {
                  "id": 26567,
                  "url": "https://api.seerapi.com/v1/skill/26567"
                },
                {
                  "id": 26571,
                  "url": "https://api.seerapi.com/v1/skill/26571"
                },
                {
                  "id": 26574,
                  "url": "https://api.seerapi.com/v1/skill/26574"
                },
                {
                  "id": 26578,
                  "url": "https://api.seerapi.com/v1/skill/26578"
                },
                {
                  "id": 26580,
                  "url": "https://api.seerapi.com/v1/skill/26580"
                },
                {
                  "id": 26582,
                  "url": "https://api.seerapi.com/v1/skill/26582"
                },
                {
                  "id": 26585,
                  "url": "https://api.seerapi.com/v1/skill/26585"
                },
                {
                  "id": 26587,
                  "url": "https://api.seerapi.com/v1/skill/26587"
                },
                {
                  "id": 26593,
                  "url": "https://api.seerapi.com/v1/skill/26593"
                },
                {
                  "id": 26595,
                  "url": "https://api.seerapi.com/v1/skill/26595"
                },
                {
                  "id": 26598,
                  "url": "https://api.seerapi.com/v1/skill/26598"
                },
                {
                  "id": 26605,
                  "url": "https://api.seerapi.com/v1/skill/26605"
                },
                {
                  "id": 26608,
                  "url": "https://api.seerapi.com/v1/skill/26608"
                },
                {
                  "id": 26610,
                  "url": "https://api.seerapi.com/v1/skill/26610"
                },
                {
                  "id": 26613,
                  "url": "https://api.seerapi.com/v1/skill/26613"
                },
                {
                  "id": 26615,
                  "url": "https://api.seerapi.com/v1/skill/26615"
                },
                {
                  "id": 26618,
                  "url": "https://api.seerapi.com/v1/skill/26618"
                },
                {
                  "id": 26627,
                  "url": "https://api.seerapi.com/v1/skill/26627"
                },
                {
                  "id": 26631,
                  "url": "https://api.seerapi.com/v1/skill/26631"
                },
                {
                  "id": 26635,
                  "url": "https://api.seerapi.com/v1/skill/26635"
                },
                {
                  "id": 26638,
                  "url": "https://api.seerapi.com/v1/skill/26638"
                },
                {
                  "id": 26644,
                  "url": "https://api.seerapi.com/v1/skill/26644"
                },
                {
                  "id": 26645,
                  "url": "https://api.seerapi.com/v1/skill/26645"
                },
                {
                  "id": 26647,
                  "url": "https://api.seerapi.com/v1/skill/26647"
                },
                {
                  "id": 26650,
                  "url": "https://api.seerapi.com/v1/skill/26650"
                },
                {
                  "id": 26655,
                  "url": "https://api.seerapi.com/v1/skill/26655"
                },
                {
                  "id": 26658,
                  "url": "https://api.seerapi.com/v1/skill/26658"
                },
                {
                  "id": 26661,
                  "url": "https://api.seerapi.com/v1/skill/26661"
                },
                {
                  "id": 26669,
                  "url": "https://api.seerapi.com/v1/skill/26669"
                },
                {
                  "id": 26671,
                  "url": "https://api.seerapi.com/v1/skill/26671"
                },
                {
                  "id": 26674,
                  "url": "https://api.seerapi.com/v1/skill/26674"
                },
                {
                  "id": 26677,
                  "url": "https://api.seerapi.com/v1/skill/26677"
                },
                {
                  "id": 26681,
                  "url": "https://api.seerapi.com/v1/skill/26681"
                },
                {
                  "id": 26683,
                  "url": "https://api.seerapi.com/v1/skill/26683"
                },
                {
                  "id": 26686,
                  "url": "https://api.seerapi.com/v1/skill/26686"
                },
                {
                  "id": 26687,
                  "url": "https://api.seerapi.com/v1/skill/26687"
                },
                {
                  "id": 26689,
                  "url": "https://api.seerapi.com/v1/skill/26689"
                },
                {
                  "id": 26693,
                  "url": "https://api.seerapi.com/v1/skill/26693"
                },
                {
                  "id": 26697,
                  "url": "https://api.seerapi.com/v1/skill/26697"
                },
                {
                  "id": 26702,
                  "url": "https://api.seerapi.com/v1/skill/26702"
                },
                {
                  "id": 26706,
                  "url": "https://api.seerapi.com/v1/skill/26706"
                },
                {
                  "id": 26711,
                  "url": "https://api.seerapi.com/v1/skill/26711"
                },
                {
                  "id": 26714,
                  "url": "https://api.seerapi.com/v1/skill/26714"
                },
                {
                  "id": 26717,
                  "url": "https://api.seerapi.com/v1/skill/26717"
                },
                {
                  "id": 26720,
                  "url": "https://api.seerapi.com/v1/skill/26720"
                },
                {
                  "id": 26723,
                  "url": "https://api.seerapi.com/v1/skill/26723"
                },
                {
                  "id": 26725,
                  "url": "https://api.seerapi.com/v1/skill/26725"
                },
                {
                  "id": 26729,
                  "url": "https://api.seerapi.com/v1/skill/26729"
                },
                {
                  "id": 26732,
                  "url": "https://api.seerapi.com/v1/skill/26732"
                },
                {
                  "id": 26735,
                  "url": "https://api.seerapi.com/v1/skill/26735"
                },
                {
                  "id": 26737,
                  "url": "https://api.seerapi.com/v1/skill/26737"
                },
                {
                  "id": 26739,
                  "url": "https://api.seerapi.com/v1/skill/26739"
                },
                {
                  "id": 26742,
                  "url": "https://api.seerapi.com/v1/skill/26742"
                },
                {
                  "id": 26744,
                  "url": "https://api.seerapi.com/v1/skill/26744"
                },
                {
                  "id": 26748,
                  "url": "https://api.seerapi.com/v1/skill/26748"
                },
                {
                  "id": 26750,
                  "url": "https://api.seerapi.com/v1/skill/26750"
                },
                {
                  "id": 26752,
                  "url": "https://api.seerapi.com/v1/skill/26752"
                },
                {
                  "id": 26762,
                  "url": "https://api.seerapi.com/v1/skill/26762"
                },
                {
                  "id": 26765,
                  "url": "https://api.seerapi.com/v1/skill/26765"
                },
                {
                  "id": 26770,
                  "url": "https://api.seerapi.com/v1/skill/26770"
                },
                {
                  "id": 26772,
                  "url": "https://api.seerapi.com/v1/skill/26772"
                },
                {
                  "id": 26775,
                  "url": "https://api.seerapi.com/v1/skill/26775"
                },
                {
                  "id": 26778,
                  "url": "https://api.seerapi.com/v1/skill/26778"
                },
                {
                  "id": 26780,
                  "url": "https://api.seerapi.com/v1/skill/26780"
                },
                {
                  "id": 26783,
                  "url": "https://api.seerapi.com/v1/skill/26783"
                },
                {
                  "id": 26786,
                  "url": "https://api.seerapi.com/v1/skill/26786"
                },
                {
                  "id": 26789,
                  "url": "https://api.seerapi.com/v1/skill/26789"
                },
                {
                  "id": 26792,
                  "url": "https://api.seerapi.com/v1/skill/26792"
                },
                {
                  "id": 26795,
                  "url": "https://api.seerapi.com/v1/skill/26795"
                },
                {
                  "id": 26798,
                  "url": "https://api.seerapi.com/v1/skill/26798"
                },
                {
                  "id": 26801,
                  "url": "https://api.seerapi.com/v1/skill/26801"
                },
                {
                  "id": 26806,
                  "url": "https://api.seerapi.com/v1/skill/26806"
                },
                {
                  "id": 26809,
                  "url": "https://api.seerapi.com/v1/skill/26809"
                },
                {
                  "id": 26812,
                  "url": "https://api.seerapi.com/v1/skill/26812"
                },
                {
                  "id": 26814,
                  "url": "https://api.seerapi.com/v1/skill/26814"
                },
                {
                  "id": 26817,
                  "url": "https://api.seerapi.com/v1/skill/26817"
                },
                {
                  "id": 26832,
                  "url": "https://api.seerapi.com/v1/skill/26832"
                },
                {
                  "id": 26836,
                  "url": "https://api.seerapi.com/v1/skill/26836"
                },
                {
                  "id": 26843,
                  "url": "https://api.seerapi.com/v1/skill/26843"
                },
                {
                  "id": 26853,
                  "url": "https://api.seerapi.com/v1/skill/26853"
                },
                {
                  "id": 26856,
                  "url": "https://api.seerapi.com/v1/skill/26856"
                },
                {
                  "id": 26860,
                  "url": "https://api.seerapi.com/v1/skill/26860"
                },
                {
                  "id": 26865,
                  "url": "https://api.seerapi.com/v1/skill/26865"
                },
                {
                  "id": 26868,
                  "url": "https://api.seerapi.com/v1/skill/26868"
                },
                {
                  "id": 26872,
                  "url": "https://api.seerapi.com/v1/skill/26872"
                },
                {
                  "id": 26874,
                  "url": "https://api.seerapi.com/v1/skill/26874"
                },
                {
                  "id": 26876,
                  "url": "https://api.seerapi.com/v1/skill/26876"
                },
                {
                  "id": 26878,
                  "url": "https://api.seerapi.com/v1/skill/26878"
                },
                {
                  "id": 26880,
                  "url": "https://api.seerapi.com/v1/skill/26880"
                },
                {
                  "id": 26883,
                  "url": "https://api.seerapi.com/v1/skill/26883"
                },
                {
                  "id": 26886,
                  "url": "https://api.seerapi.com/v1/skill/26886"
                },
                {
                  "id": 26889,
                  "url": "https://api.seerapi.com/v1/skill/26889"
                },
                {
                  "id": 26892,
                  "url": "https://api.seerapi.com/v1/skill/26892"
                },
                {
                  "id": 26895,
                  "url": "https://api.seerapi.com/v1/skill/26895"
                },
                {
                  "id": 26900,
                  "url": "https://api.seerapi.com/v1/skill/26900"
                },
                {
                  "id": 26907,
                  "url": "https://api.seerapi.com/v1/skill/26907"
                },
                {
                  "id": 26912,
                  "url": "https://api.seerapi.com/v1/skill/26912"
                },
                {
                  "id": 26914,
                  "url": "https://api.seerapi.com/v1/skill/26914"
                },
                {
                  "id": 26917,
                  "url": "https://api.seerapi.com/v1/skill/26917"
                },
                {
                  "id": 26919,
                  "url": "https://api.seerapi.com/v1/skill/26919"
                },
                {
                  "id": 26921,
                  "url": "https://api.seerapi.com/v1/skill/26921"
                },
                {
                  "id": 26923,
                  "url": "https://api.seerapi.com/v1/skill/26923"
                },
                {
                  "id": 26929,
                  "url": "https://api.seerapi.com/v1/skill/26929"
                },
                {
                  "id": 26931,
                  "url": "https://api.seerapi.com/v1/skill/26931"
                },
                {
                  "id": 26933,
                  "url": "https://api.seerapi.com/v1/skill/26933"
                },
                {
                  "id": 26935,
                  "url": "https://api.seerapi.com/v1/skill/26935"
                },
                {
                  "id": 26938,
                  "url": "https://api.seerapi.com/v1/skill/26938"
                },
                {
                  "id": 26940,
                  "url": "https://api.seerapi.com/v1/skill/26940"
                },
                {
                  "id": 26942,
                  "url": "https://api.seerapi.com/v1/skill/26942"
                },
                {
                  "id": 26946,
                  "url": "https://api.seerapi.com/v1/skill/26946"
                },
                {
                  "id": 26949,
                  "url": "https://api.seerapi.com/v1/skill/26949"
                },
                {
                  "id": 26958,
                  "url": "https://api.seerapi.com/v1/skill/26958"
                },
                {
                  "id": 26960,
                  "url": "https://api.seerapi.com/v1/skill/26960"
                },
                {
                  "id": 26963,
                  "url": "https://api.seerapi.com/v1/skill/26963"
                },
                {
                  "id": 26966,
                  "url": "https://api.seerapi.com/v1/skill/26966"
                },
                {
                  "id": 26969,
                  "url": "https://api.seerapi.com/v1/skill/26969"
                },
                {
                  "id": 26973,
                  "url": "https://api.seerapi.com/v1/skill/26973"
                },
                {
                  "id": 26975,
                  "url": "https://api.seerapi.com/v1/skill/26975"
                },
                {
                  "id": 26978,
                  "url": "https://api.seerapi.com/v1/skill/26978"
                },
                {
                  "id": 26981,
                  "url": "https://api.seerapi.com/v1/skill/26981"
                },
                {
                  "id": 26982,
                  "url": "https://api.seerapi.com/v1/skill/26982"
                },
                {
                  "id": 26988,
                  "url": "https://api.seerapi.com/v1/skill/26988"
                },
                {
                  "id": 26990,
                  "url": "https://api.seerapi.com/v1/skill/26990"
                },
                {
                  "id": 26993,
                  "url": "https://api.seerapi.com/v1/skill/26993"
                },
                {
                  "id": 26995,
                  "url": "https://api.seerapi.com/v1/skill/26995"
                },
                {
                  "id": 27000,
                  "url": "https://api.seerapi.com/v1/skill/27000"
                },
                {
                  "id": 27005,
                  "url": "https://api.seerapi.com/v1/skill/27005"
                },
                {
                  "id": 27008,
                  "url": "https://api.seerapi.com/v1/skill/27008"
                },
                {
                  "id": 27011,
                  "url": "https://api.seerapi.com/v1/skill/27011"
                },
                {
                  "id": 27013,
                  "url": "https://api.seerapi.com/v1/skill/27013"
                },
                {
                  "id": 27025,
                  "url": "https://api.seerapi.com/v1/skill/27025"
                },
                {
                  "id": 27030,
                  "url": "https://api.seerapi.com/v1/skill/27030"
                },
                {
                  "id": 27035,
                  "url": "https://api.seerapi.com/v1/skill/27035"
                },
                {
                  "id": 27037,
                  "url": "https://api.seerapi.com/v1/skill/27037"
                },
                {
                  "id": 27040,
                  "url": "https://api.seerapi.com/v1/skill/27040"
                },
                {
                  "id": 27043,
                  "url": "https://api.seerapi.com/v1/skill/27043"
                },
                {
                  "id": 27047,
                  "url": "https://api.seerapi.com/v1/skill/27047"
                },
                {
                  "id": 27057,
                  "url": "https://api.seerapi.com/v1/skill/27057"
                },
                {
                  "id": 27059,
                  "url": "https://api.seerapi.com/v1/skill/27059"
                },
                {
                  "id": 27062,
                  "url": "https://api.seerapi.com/v1/skill/27062"
                },
                {
                  "id": 27065,
                  "url": "https://api.seerapi.com/v1/skill/27065"
                },
                {
                  "id": 27066,
                  "url": "https://api.seerapi.com/v1/skill/27066"
                },
                {
                  "id": 27072,
                  "url": "https://api.seerapi.com/v1/skill/27072"
                },
                {
                  "id": 27076,
                  "url": "https://api.seerapi.com/v1/skill/27076"
                },
                {
                  "id": 27082,
                  "url": "https://api.seerapi.com/v1/skill/27082"
                },
                {
                  "id": 27085,
                  "url": "https://api.seerapi.com/v1/skill/27085"
                },
                {
                  "id": 27090,
                  "url": "https://api.seerapi.com/v1/skill/27090"
                },
                {
                  "id": 27093,
                  "url": "https://api.seerapi.com/v1/skill/27093"
                },
                {
                  "id": 27095,
                  "url": "https://api.seerapi.com/v1/skill/27095"
                },
                {
                  "id": 27102,
                  "url": "https://api.seerapi.com/v1/skill/27102"
                },
                {
                  "id": 27103,
                  "url": "https://api.seerapi.com/v1/skill/27103"
                },
                {
                  "id": 27106,
                  "url": "https://api.seerapi.com/v1/skill/27106"
                },
                {
                  "id": 27109,
                  "url": "https://api.seerapi.com/v1/skill/27109"
                },
                {
                  "id": 27111,
                  "url": "https://api.seerapi.com/v1/skill/27111"
                },
                {
                  "id": 27114,
                  "url": "https://api.seerapi.com/v1/skill/27114"
                },
                {
                  "id": 27118,
                  "url": "https://api.seerapi.com/v1/skill/27118"
                },
                {
                  "id": 27120,
                  "url": "https://api.seerapi.com/v1/skill/27120"
                },
                {
                  "id": 27124,
                  "url": "https://api.seerapi.com/v1/skill/27124"
                },
                {
                  "id": 27127,
                  "url": "https://api.seerapi.com/v1/skill/27127"
                },
                {
                  "id": 27132,
                  "url": "https://api.seerapi.com/v1/skill/27132"
                },
                {
                  "id": 27135,
                  "url": "https://api.seerapi.com/v1/skill/27135"
                },
                {
                  "id": 27137,
                  "url": "https://api.seerapi.com/v1/skill/27137"
                },
                {
                  "id": 27141,
                  "url": "https://api.seerapi.com/v1/skill/27141"
                },
                {
                  "id": 27142,
                  "url": "https://api.seerapi.com/v1/skill/27142"
                },
                {
                  "id": 27147,
                  "url": "https://api.seerapi.com/v1/skill/27147"
                },
                {
                  "id": 27155,
                  "url": "https://api.seerapi.com/v1/skill/27155"
                },
                {
                  "id": 27164,
                  "url": "https://api.seerapi.com/v1/skill/27164"
                },
                {
                  "id": 27165,
                  "url": "https://api.seerapi.com/v1/skill/27165"
                },
                {
                  "id": 27167,
                  "url": "https://api.seerapi.com/v1/skill/27167"
                },
                {
                  "id": 27171,
                  "url": "https://api.seerapi.com/v1/skill/27171"
                },
                {
                  "id": 27174,
                  "url": "https://api.seerapi.com/v1/skill/27174"
                },
                {
                  "id": 27177,
                  "url": "https://api.seerapi.com/v1/skill/27177"
                },
                {
                  "id": 27184,
                  "url": "https://api.seerapi.com/v1/skill/27184"
                },
                {
                  "id": 27186,
                  "url": "https://api.seerapi.com/v1/skill/27186"
                },
                {
                  "id": 27189,
                  "url": "https://api.seerapi.com/v1/skill/27189"
                },
                {
                  "id": 27194,
                  "url": "https://api.seerapi.com/v1/skill/27194"
                },
                {
                  "id": 27200,
                  "url": "https://api.seerapi.com/v1/skill/27200"
                },
                {
                  "id": 27204,
                  "url": "https://api.seerapi.com/v1/skill/27204"
                },
                {
                  "id": 27205,
                  "url": "https://api.seerapi.com/v1/skill/27205"
                },
                {
                  "id": 27208,
                  "url": "https://api.seerapi.com/v1/skill/27208"
                },
                {
                  "id": 27211,
                  "url": "https://api.seerapi.com/v1/skill/27211"
                },
                {
                  "id": 27214,
                  "url": "https://api.seerapi.com/v1/skill/27214"
                },
                {
                  "id": 27221,
                  "url": "https://api.seerapi.com/v1/skill/27221"
                },
                {
                  "id": 27227,
                  "url": "https://api.seerapi.com/v1/skill/27227"
                },
                {
                  "id": 27229,
                  "url": "https://api.seerapi.com/v1/skill/27229"
                },
                {
                  "id": 27233,
                  "url": "https://api.seerapi.com/v1/skill/27233"
                },
                {
                  "id": 27239,
                  "url": "https://api.seerapi.com/v1/skill/27239"
                },
                {
                  "id": 27241,
                  "url": "https://api.seerapi.com/v1/skill/27241"
                },
                {
                  "id": 27244,
                  "url": "https://api.seerapi.com/v1/skill/27244"
                },
                {
                  "id": 27248,
                  "url": "https://api.seerapi.com/v1/skill/27248"
                },
                {
                  "id": 27251,
                  "url": "https://api.seerapi.com/v1/skill/27251"
                },
                {
                  "id": 27258,
                  "url": "https://api.seerapi.com/v1/skill/27258"
                },
                {
                  "id": 27263,
                  "url": "https://api.seerapi.com/v1/skill/27263"
                },
                {
                  "id": 27267,
                  "url": "https://api.seerapi.com/v1/skill/27267"
                },
                {
                  "id": 27270,
                  "url": "https://api.seerapi.com/v1/skill/27270"
                },
                {
                  "id": 27278,
                  "url": "https://api.seerapi.com/v1/skill/27278"
                },
                {
                  "id": 27281,
                  "url": "https://api.seerapi.com/v1/skill/27281"
                },
                {
                  "id": 27285,
                  "url": "https://api.seerapi.com/v1/skill/27285"
                },
                {
                  "id": 27288,
                  "url": "https://api.seerapi.com/v1/skill/27288"
                },
                {
                  "id": 27295,
                  "url": "https://api.seerapi.com/v1/skill/27295"
                },
                {
                  "id": 27312,
                  "url": "https://api.seerapi.com/v1/skill/27312"
                },
                {
                  "id": 27314,
                  "url": "https://api.seerapi.com/v1/skill/27314"
                },
                {
                  "id": 27316,
                  "url": "https://api.seerapi.com/v1/skill/27316"
                },
                {
                  "id": 27319,
                  "url": "https://api.seerapi.com/v1/skill/27319"
                },
                {
                  "id": 27323,
                  "url": "https://api.seerapi.com/v1/skill/27323"
                },
                {
                  "id": 27333,
                  "url": "https://api.seerapi.com/v1/skill/27333"
                },
                {
                  "id": 27337,
                  "url": "https://api.seerapi.com/v1/skill/27337"
                },
                {
                  "id": 27341,
                  "url": "https://api.seerapi.com/v1/skill/27341"
                },
                {
                  "id": 27344,
                  "url": "https://api.seerapi.com/v1/skill/27344"
                },
                {
                  "id": 27347,
                  "url": "https://api.seerapi.com/v1/skill/27347"
                },
                {
                  "id": 27350,
                  "url": "https://api.seerapi.com/v1/skill/27350"
                },
                {
                  "id": 27355,
                  "url": "https://api.seerapi.com/v1/skill/27355"
                },
                {
                  "id": 27360,
                  "url": "https://api.seerapi.com/v1/skill/27360"
                },
                {
                  "id": 27363,
                  "url": "https://api.seerapi.com/v1/skill/27363"
                },
                {
                  "id": 27369,
                  "url": "https://api.seerapi.com/v1/skill/27369"
                },
                {
                  "id": 27376,
                  "url": "https://api.seerapi.com/v1/skill/27376"
                },
                {
                  "id": 27379,
                  "url": "https://api.seerapi.com/v1/skill/27379"
                },
                {
                  "id": 27384,
                  "url": "https://api.seerapi.com/v1/skill/27384"
                },
                {
                  "id": 27392,
                  "url": "https://api.seerapi.com/v1/skill/27392"
                },
                {
                  "id": 27396,
                  "url": "https://api.seerapi.com/v1/skill/27396"
                },
                {
                  "id": 27407,
                  "url": "https://api.seerapi.com/v1/skill/27407"
                },
                {
                  "id": 27411,
                  "url": "https://api.seerapi.com/v1/skill/27411"
                },
                {
                  "id": 27413,
                  "url": "https://api.seerapi.com/v1/skill/27413"
                },
                {
                  "id": 27418,
                  "url": "https://api.seerapi.com/v1/skill/27418"
                },
                {
                  "id": 27419,
                  "url": "https://api.seerapi.com/v1/skill/27419"
                },
                {
                  "id": 27429,
                  "url": "https://api.seerapi.com/v1/skill/27429"
                },
                {
                  "id": 27431,
                  "url": "https://api.seerapi.com/v1/skill/27431"
                },
                {
                  "id": 27438,
                  "url": "https://api.seerapi.com/v1/skill/27438"
                },
                {
                  "id": 27444,
                  "url": "https://api.seerapi.com/v1/skill/27444"
                },
                {
                  "id": 27446,
                  "url": "https://api.seerapi.com/v1/skill/27446"
                },
                {
                  "id": 27448,
                  "url": "https://api.seerapi.com/v1/skill/27448"
                },
                {
                  "id": 27455,
                  "url": "https://api.seerapi.com/v1/skill/27455"
                },
                {
                  "id": 27461,
                  "url": "https://api.seerapi.com/v1/skill/27461"
                },
                {
                  "id": 27464,
                  "url": "https://api.seerapi.com/v1/skill/27464"
                },
                {
                  "id": 27470,
                  "url": "https://api.seerapi.com/v1/skill/27470"
                },
                {
                  "id": 27475,
                  "url": "https://api.seerapi.com/v1/skill/27475"
                },
                {
                  "id": 27478,
                  "url": "https://api.seerapi.com/v1/skill/27478"
                },
                {
                  "id": 27481,
                  "url": "https://api.seerapi.com/v1/skill/27481"
                },
                {
                  "id": 27484,
                  "url": "https://api.seerapi.com/v1/skill/27484"
                },
                {
                  "id": 27488,
                  "url": "https://api.seerapi.com/v1/skill/27488"
                },
                {
                  "id": 27489,
                  "url": "https://api.seerapi.com/v1/skill/27489"
                },
                {
                  "id": 27494,
                  "url": "https://api.seerapi.com/v1/skill/27494"
                },
                {
                  "id": 27496,
                  "url": "https://api.seerapi.com/v1/skill/27496"
                },
                {
                  "id": 27499,
                  "url": "https://api.seerapi.com/v1/skill/27499"
                },
                {
                  "id": 27504,
                  "url": "https://api.seerapi.com/v1/skill/27504"
                },
                {
                  "id": 27506,
                  "url": "https://api.seerapi.com/v1/skill/27506"
                },
                {
                  "id": 27513,
                  "url": "https://api.seerapi.com/v1/skill/27513"
                },
                {
                  "id": 27516,
                  "url": "https://api.seerapi.com/v1/skill/27516"
                },
                {
                  "id": 27521,
                  "url": "https://api.seerapi.com/v1/skill/27521"
                },
                {
                  "id": 27524,
                  "url": "https://api.seerapi.com/v1/skill/27524"
                },
                {
                  "id": 27531,
                  "url": "https://api.seerapi.com/v1/skill/27531"
                },
                {
                  "id": 27539,
                  "url": "https://api.seerapi.com/v1/skill/27539"
                },
                {
                  "id": 27544,
                  "url": "https://api.seerapi.com/v1/skill/27544"
                },
                {
                  "id": 27549,
                  "url": "https://api.seerapi.com/v1/skill/27549"
                },
                {
                  "id": 27552,
                  "url": "https://api.seerapi.com/v1/skill/27552"
                },
                {
                  "id": 27560,
                  "url": "https://api.seerapi.com/v1/skill/27560"
                },
                {
                  "id": 27565,
                  "url": "https://api.seerapi.com/v1/skill/27565"
                },
                {
                  "id": 27567,
                  "url": "https://api.seerapi.com/v1/skill/27567"
                },
                {
                  "id": 27576,
                  "url": "https://api.seerapi.com/v1/skill/27576"
                },
                {
                  "id": 27579,
                  "url": "https://api.seerapi.com/v1/skill/27579"
                },
                {
                  "id": 27583,
                  "url": "https://api.seerapi.com/v1/skill/27583"
                },
                {
                  "id": 27585,
                  "url": "https://api.seerapi.com/v1/skill/27585"
                },
                {
                  "id": 27588,
                  "url": "https://api.seerapi.com/v1/skill/27588"
                },
                {
                  "id": 27591,
                  "url": "https://api.seerapi.com/v1/skill/27591"
                },
                {
                  "id": 27594,
                  "url": "https://api.seerapi.com/v1/skill/27594"
                },
                {
                  "id": 27599,
                  "url": "https://api.seerapi.com/v1/skill/27599"
                },
                {
                  "id": 27606,
                  "url": "https://api.seerapi.com/v1/skill/27606"
                },
                {
                  "id": 27609,
                  "url": "https://api.seerapi.com/v1/skill/27609"
                },
                {
                  "id": 27613,
                  "url": "https://api.seerapi.com/v1/skill/27613"
                },
                {
                  "id": 27625,
                  "url": "https://api.seerapi.com/v1/skill/27625"
                },
                {
                  "id": 27628,
                  "url": "https://api.seerapi.com/v1/skill/27628"
                },
                {
                  "id": 27631,
                  "url": "https://api.seerapi.com/v1/skill/27631"
                },
                {
                  "id": 27633,
                  "url": "https://api.seerapi.com/v1/skill/27633"
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
                  "id": 27643,
                  "url": "https://api.seerapi.com/v1/skill/27643"
                },
                {
                  "id": 27648,
                  "url": "https://api.seerapi.com/v1/skill/27648"
                },
                {
                  "id": 27651,
                  "url": "https://api.seerapi.com/v1/skill/27651"
                },
                {
                  "id": 27654,
                  "url": "https://api.seerapi.com/v1/skill/27654"
                },
                {
                  "id": 27658,
                  "url": "https://api.seerapi.com/v1/skill/27658"
                },
                {
                  "id": 27660,
                  "url": "https://api.seerapi.com/v1/skill/27660"
                },
                {
                  "id": 27663,
                  "url": "https://api.seerapi.com/v1/skill/27663"
                },
                {
                  "id": 27666,
                  "url": "https://api.seerapi.com/v1/skill/27666"
                },
                {
                  "id": 27668,
                  "url": "https://api.seerapi.com/v1/skill/27668"
                },
                {
                  "id": 27671,
                  "url": "https://api.seerapi.com/v1/skill/27671"
                },
                {
                  "id": 27678,
                  "url": "https://api.seerapi.com/v1/skill/27678"
                },
                {
                  "id": 27680,
                  "url": "https://api.seerapi.com/v1/skill/27680"
                },
                {
                  "id": 27685,
                  "url": "https://api.seerapi.com/v1/skill/27685"
                },
                {
                  "id": 27688,
                  "url": "https://api.seerapi.com/v1/skill/27688"
                },
                {
                  "id": 27691,
                  "url": "https://api.seerapi.com/v1/skill/27691"
                },
                {
                  "id": 27694,
                  "url": "https://api.seerapi.com/v1/skill/27694"
                },
                {
                  "id": 27696,
                  "url": "https://api.seerapi.com/v1/skill/27696"
                },
                {
                  "id": 27698,
                  "url": "https://api.seerapi.com/v1/skill/27698"
                },
                {
                  "id": 27701,
                  "url": "https://api.seerapi.com/v1/skill/27701"
                },
                {
                  "id": 27707,
                  "url": "https://api.seerapi.com/v1/skill/27707"
                },
                {
                  "id": 27711,
                  "url": "https://api.seerapi.com/v1/skill/27711"
                },
                {
                  "id": 27716,
                  "url": "https://api.seerapi.com/v1/skill/27716"
                },
                {
                  "id": 27719,
                  "url": "https://api.seerapi.com/v1/skill/27719"
                },
                {
                  "id": 27723,
                  "url": "https://api.seerapi.com/v1/skill/27723"
                },
                {
                  "id": 27726,
                  "url": "https://api.seerapi.com/v1/skill/27726"
                },
                {
                  "id": 27729,
                  "url": "https://api.seerapi.com/v1/skill/27729"
                },
                {
                  "id": 27731,
                  "url": "https://api.seerapi.com/v1/skill/27731"
                },
                {
                  "id": 27734,
                  "url": "https://api.seerapi.com/v1/skill/27734"
                },
                {
                  "id": 27747,
                  "url": "https://api.seerapi.com/v1/skill/27747"
                },
                {
                  "id": 27751,
                  "url": "https://api.seerapi.com/v1/skill/27751"
                },
                {
                  "id": 27752,
                  "url": "https://api.seerapi.com/v1/skill/27752"
                },
                {
                  "id": 27755,
                  "url": "https://api.seerapi.com/v1/skill/27755"
                },
                {
                  "id": 27756,
                  "url": "https://api.seerapi.com/v1/skill/27756"
                },
                {
                  "id": 27759,
                  "url": "https://api.seerapi.com/v1/skill/27759"
                },
                {
                  "id": 27762,
                  "url": "https://api.seerapi.com/v1/skill/27762"
                },
                {
                  "id": 27767,
                  "url": "https://api.seerapi.com/v1/skill/27767"
                },
                {
                  "id": 27769,
                  "url": "https://api.seerapi.com/v1/skill/27769"
                },
                {
                  "id": 27774,
                  "url": "https://api.seerapi.com/v1/skill/27774"
                },
                {
                  "id": 27781,
                  "url": "https://api.seerapi.com/v1/skill/27781"
                },
                {
                  "id": 27784,
                  "url": "https://api.seerapi.com/v1/skill/27784"
                },
                {
                  "id": 27787,
                  "url": "https://api.seerapi.com/v1/skill/27787"
                },
                {
                  "id": 27791,
                  "url": "https://api.seerapi.com/v1/skill/27791"
                },
                {
                  "id": 27794,
                  "url": "https://api.seerapi.com/v1/skill/27794"
                },
                {
                  "id": 27797,
                  "url": "https://api.seerapi.com/v1/skill/27797"
                },
                {
                  "id": 27800,
                  "url": "https://api.seerapi.com/v1/skill/27800"
                },
                {
                  "id": 27807,
                  "url": "https://api.seerapi.com/v1/skill/27807"
                },
                {
                  "id": 27810,
                  "url": "https://api.seerapi.com/v1/skill/27810"
                },
                {
                  "id": 27813,
                  "url": "https://api.seerapi.com/v1/skill/27813"
                },
                {
                  "id": 27816,
                  "url": "https://api.seerapi.com/v1/skill/27816"
                },
                {
                  "id": 27818,
                  "url": "https://api.seerapi.com/v1/skill/27818"
                },
                {
                  "id": 27823,
                  "url": "https://api.seerapi.com/v1/skill/27823"
                },
                {
                  "id": 27826,
                  "url": "https://api.seerapi.com/v1/skill/27826"
                },
                {
                  "id": 27829,
                  "url": "https://api.seerapi.com/v1/skill/27829"
                },
                {
                  "id": 27845,
                  "url": "https://api.seerapi.com/v1/skill/27845"
                },
                {
                  "id": 27848,
                  "url": "https://api.seerapi.com/v1/skill/27848"
                },
                {
                  "id": 27851,
                  "url": "https://api.seerapi.com/v1/skill/27851"
                },
                {
                  "id": 27856,
                  "url": "https://api.seerapi.com/v1/skill/27856"
                },
                {
                  "id": 27862,
                  "url": "https://api.seerapi.com/v1/skill/27862"
                },
                {
                  "id": 27865,
                  "url": "https://api.seerapi.com/v1/skill/27865"
                },
                {
                  "id": 27868,
                  "url": "https://api.seerapi.com/v1/skill/27868"
                },
                {
                  "id": 27871,
                  "url": "https://api.seerapi.com/v1/skill/27871"
                },
                {
                  "id": 27873,
                  "url": "https://api.seerapi.com/v1/skill/27873"
                },
                {
                  "id": 27876,
                  "url": "https://api.seerapi.com/v1/skill/27876"
                },
                {
                  "id": 27883,
                  "url": "https://api.seerapi.com/v1/skill/27883"
                },
                {
                  "id": 27886,
                  "url": "https://api.seerapi.com/v1/skill/27886"
                },
                {
                  "id": 27889,
                  "url": "https://api.seerapi.com/v1/skill/27889"
                },
                {
                  "id": 27892,
                  "url": "https://api.seerapi.com/v1/skill/27892"
                },
                {
                  "id": 27898,
                  "url": "https://api.seerapi.com/v1/skill/27898"
                },
                {
                  "id": 27900,
                  "url": "https://api.seerapi.com/v1/skill/27900"
                },
                {
                  "id": 27913,
                  "url": "https://api.seerapi.com/v1/skill/27913"
                },
                {
                  "id": 27920,
                  "url": "https://api.seerapi.com/v1/skill/27920"
                },
                {
                  "id": 27923,
                  "url": "https://api.seerapi.com/v1/skill/27923"
                },
                {
                  "id": 27925,
                  "url": "https://api.seerapi.com/v1/skill/27925"
                },
                {
                  "id": 27928,
                  "url": "https://api.seerapi.com/v1/skill/27928"
                },
                {
                  "id": 27936,
                  "url": "https://api.seerapi.com/v1/skill/27936"
                },
                {
                  "id": 27941,
                  "url": "https://api.seerapi.com/v1/skill/27941"
                },
                {
                  "id": 27944,
                  "url": "https://api.seerapi.com/v1/skill/27944"
                },
                {
                  "id": 27949,
                  "url": "https://api.seerapi.com/v1/skill/27949"
                },
                {
                  "id": 27952,
                  "url": "https://api.seerapi.com/v1/skill/27952"
                },
                {
                  "id": 27955,
                  "url": "https://api.seerapi.com/v1/skill/27955"
                },
                {
                  "id": 27960,
                  "url": "https://api.seerapi.com/v1/skill/27960"
                },
                {
                  "id": 27965,
                  "url": "https://api.seerapi.com/v1/skill/27965"
                },
                {
                  "id": 27968,
                  "url": "https://api.seerapi.com/v1/skill/27968"
                },
                {
                  "id": 27970,
                  "url": "https://api.seerapi.com/v1/skill/27970"
                },
                {
                  "id": 27979,
                  "url": "https://api.seerapi.com/v1/skill/27979"
                },
                {
                  "id": 27982,
                  "url": "https://api.seerapi.com/v1/skill/27982"
                },
                {
                  "id": 27985,
                  "url": "https://api.seerapi.com/v1/skill/27985"
                },
                {
                  "id": 27990,
                  "url": "https://api.seerapi.com/v1/skill/27990"
                },
                {
                  "id": 27993,
                  "url": "https://api.seerapi.com/v1/skill/27993"
                },
                {
                  "id": 27996,
                  "url": "https://api.seerapi.com/v1/skill/27996"
                },
                {
                  "id": 27999,
                  "url": "https://api.seerapi.com/v1/skill/27999"
                },
                {
                  "id": 28003,
                  "url": "https://api.seerapi.com/v1/skill/28003"
                },
                {
                  "id": 28007,
                  "url": "https://api.seerapi.com/v1/skill/28007"
                },
                {
                  "id": 28012,
                  "url": "https://api.seerapi.com/v1/skill/28012"
                },
                {
                  "id": 28017,
                  "url": "https://api.seerapi.com/v1/skill/28017"
                },
                {
                  "id": 28019,
                  "url": "https://api.seerapi.com/v1/skill/28019"
                },
                {
                  "id": 28022,
                  "url": "https://api.seerapi.com/v1/skill/28022"
                },
                {
                  "id": 28024,
                  "url": "https://api.seerapi.com/v1/skill/28024"
                },
                {
                  "id": 28032,
                  "url": "https://api.seerapi.com/v1/skill/28032"
                },
                {
                  "id": 28038,
                  "url": "https://api.seerapi.com/v1/skill/28038"
                },
                {
                  "id": 28049,
                  "url": "https://api.seerapi.com/v1/skill/28049"
                },
                {
                  "id": 28051,
                  "url": "https://api.seerapi.com/v1/skill/28051"
                },
                {
                  "id": 28057,
                  "url": "https://api.seerapi.com/v1/skill/28057"
                },
                {
                  "id": 28060,
                  "url": "https://api.seerapi.com/v1/skill/28060"
                },
                {
                  "id": 28064,
                  "url": "https://api.seerapi.com/v1/skill/28064"
                },
                {
                  "id": 28071,
                  "url": "https://api.seerapi.com/v1/skill/28071"
                },
                {
                  "id": 28074,
                  "url": "https://api.seerapi.com/v1/skill/28074"
                },
                {
                  "id": 28078,
                  "url": "https://api.seerapi.com/v1/skill/28078"
                },
                {
                  "id": 28079,
                  "url": "https://api.seerapi.com/v1/skill/28079"
                },
                {
                  "id": 28082,
                  "url": "https://api.seerapi.com/v1/skill/28082"
                },
                {
                  "id": 28089,
                  "url": "https://api.seerapi.com/v1/skill/28089"
                },
                {
                  "id": 28090,
                  "url": "https://api.seerapi.com/v1/skill/28090"
                },
                {
                  "id": 28093,
                  "url": "https://api.seerapi.com/v1/skill/28093"
                },
                {
                  "id": 28103,
                  "url": "https://api.seerapi.com/v1/skill/28103"
                },
                {
                  "id": 28111,
                  "url": "https://api.seerapi.com/v1/skill/28111"
                },
                {
                  "id": 28116,
                  "url": "https://api.seerapi.com/v1/skill/28116"
                },
                {
                  "id": 28120,
                  "url": "https://api.seerapi.com/v1/skill/28120"
                },
                {
                  "id": 28129,
                  "url": "https://api.seerapi.com/v1/skill/28129"
                },
                {
                  "id": 28135,
                  "url": "https://api.seerapi.com/v1/skill/28135"
                },
                {
                  "id": 28138,
                  "url": "https://api.seerapi.com/v1/skill/28138"
                },
                {
                  "id": 28141,
                  "url": "https://api.seerapi.com/v1/skill/28141"
                },
                {
                  "id": 28147,
                  "url": "https://api.seerapi.com/v1/skill/28147"
                },
                {
                  "id": 28152,
                  "url": "https://api.seerapi.com/v1/skill/28152"
                },
                {
                  "id": 28155,
                  "url": "https://api.seerapi.com/v1/skill/28155"
                },
                {
                  "id": 28157,
                  "url": "https://api.seerapi.com/v1/skill/28157"
                },
                {
                  "id": 28161,
                  "url": "https://api.seerapi.com/v1/skill/28161"
                },
                {
                  "id": 28171,
                  "url": "https://api.seerapi.com/v1/skill/28171"
                },
                {
                  "id": 28174,
                  "url": "https://api.seerapi.com/v1/skill/28174"
                },
                {
                  "id": 28176,
                  "url": "https://api.seerapi.com/v1/skill/28176"
                },
                {
                  "id": 28181,
                  "url": "https://api.seerapi.com/v1/skill/28181"
                },
                {
                  "id": 28184,
                  "url": "https://api.seerapi.com/v1/skill/28184"
                },
                {
                  "id": 28189,
                  "url": "https://api.seerapi.com/v1/skill/28189"
                },
                {
                  "id": 28191,
                  "url": "https://api.seerapi.com/v1/skill/28191"
                },
                {
                  "id": 28194,
                  "url": "https://api.seerapi.com/v1/skill/28194"
                },
                {
                  "id": 28197,
                  "url": "https://api.seerapi.com/v1/skill/28197"
                },
                {
                  "id": 28199,
                  "url": "https://api.seerapi.com/v1/skill/28199"
                },
                {
                  "id": 28202,
                  "url": "https://api.seerapi.com/v1/skill/28202"
                },
                {
                  "id": 28204,
                  "url": "https://api.seerapi.com/v1/skill/28204"
                },
                {
                  "id": 28211,
                  "url": "https://api.seerapi.com/v1/skill/28211"
                },
                {
                  "id": 28213,
                  "url": "https://api.seerapi.com/v1/skill/28213"
                },
                {
                  "id": 28215,
                  "url": "https://api.seerapi.com/v1/skill/28215"
                },
                {
                  "id": 28220,
                  "url": "https://api.seerapi.com/v1/skill/28220"
                },
                {
                  "id": 28223,
                  "url": "https://api.seerapi.com/v1/skill/28223"
                },
                {
                  "id": 28225,
                  "url": "https://api.seerapi.com/v1/skill/28225"
                },
                {
                  "id": 28228,
                  "url": "https://api.seerapi.com/v1/skill/28228"
                },
                {
                  "id": 28231,
                  "url": "https://api.seerapi.com/v1/skill/28231"
                },
                {
                  "id": 28236,
                  "url": "https://api.seerapi.com/v1/skill/28236"
                },
                {
                  "id": 28243,
                  "url": "https://api.seerapi.com/v1/skill/28243"
                },
                {
                  "id": 28246,
                  "url": "https://api.seerapi.com/v1/skill/28246"
                },
                {
                  "id": 28253,
                  "url": "https://api.seerapi.com/v1/skill/28253"
                },
                {
                  "id": 28255,
                  "url": "https://api.seerapi.com/v1/skill/28255"
                },
                {
                  "id": 28258,
                  "url": "https://api.seerapi.com/v1/skill/28258"
                },
                {
                  "id": 28260,
                  "url": "https://api.seerapi.com/v1/skill/28260"
                },
                {
                  "id": 28264,
                  "url": "https://api.seerapi.com/v1/skill/28264"
                },
                {
                  "id": 28267,
                  "url": "https://api.seerapi.com/v1/skill/28267"
                },
                {
                  "id": 28269,
                  "url": "https://api.seerapi.com/v1/skill/28269"
                },
                {
                  "id": 28271,
                  "url": "https://api.seerapi.com/v1/skill/28271"
                },
                {
                  "id": 28274,
                  "url": "https://api.seerapi.com/v1/skill/28274"
                },
                {
                  "id": 28276,
                  "url": "https://api.seerapi.com/v1/skill/28276"
                },
                {
                  "id": 28278,
                  "url": "https://api.seerapi.com/v1/skill/28278"
                },
                {
                  "id": 28280,
                  "url": "https://api.seerapi.com/v1/skill/28280"
                },
                {
                  "id": 28283,
                  "url": "https://api.seerapi.com/v1/skill/28283"
                },
                {
                  "id": 28285,
                  "url": "https://api.seerapi.com/v1/skill/28285"
                },
                {
                  "id": 28288,
                  "url": "https://api.seerapi.com/v1/skill/28288"
                },
                {
                  "id": 28290,
                  "url": "https://api.seerapi.com/v1/skill/28290"
                },
                {
                  "id": 28292,
                  "url": "https://api.seerapi.com/v1/skill/28292"
                },
                {
                  "id": 28295,
                  "url": "https://api.seerapi.com/v1/skill/28295"
                },
                {
                  "id": 28299,
                  "url": "https://api.seerapi.com/v1/skill/28299"
                },
                {
                  "id": 28309,
                  "url": "https://api.seerapi.com/v1/skill/28309"
                },
                {
                  "id": 28311,
                  "url": "https://api.seerapi.com/v1/skill/28311"
                },
                {
                  "id": 28315,
                  "url": "https://api.seerapi.com/v1/skill/28315"
                },
                {
                  "id": 28332,
                  "url": "https://api.seerapi.com/v1/skill/28332"
                },
                {
                  "id": 28342,
                  "url": "https://api.seerapi.com/v1/skill/28342"
                },
                {
                  "id": 28345,
                  "url": "https://api.seerapi.com/v1/skill/28345"
                },
                {
                  "id": 28350,
                  "url": "https://api.seerapi.com/v1/skill/28350"
                },
                {
                  "id": 28353,
                  "url": "https://api.seerapi.com/v1/skill/28353"
                },
                {
                  "id": 28357,
                  "url": "https://api.seerapi.com/v1/skill/28357"
                },
                {
                  "id": 28360,
                  "url": "https://api.seerapi.com/v1/skill/28360"
                },
                {
                  "id": 28363,
                  "url": "https://api.seerapi.com/v1/skill/28363"
                },
                {
                  "id": 28367,
                  "url": "https://api.seerapi.com/v1/skill/28367"
                },
                {
                  "id": 28370,
                  "url": "https://api.seerapi.com/v1/skill/28370"
                },
                {
                  "id": 28373,
                  "url": "https://api.seerapi.com/v1/skill/28373"
                },
                {
                  "id": 28378,
                  "url": "https://api.seerapi.com/v1/skill/28378"
                },
                {
                  "id": 28380,
                  "url": "https://api.seerapi.com/v1/skill/28380"
                },
                {
                  "id": 28382,
                  "url": "https://api.seerapi.com/v1/skill/28382"
                },
                {
                  "id": 28389,
                  "url": "https://api.seerapi.com/v1/skill/28389"
                },
                {
                  "id": 28390,
                  "url": "https://api.seerapi.com/v1/skill/28390"
                },
                {
                  "id": 28395,
                  "url": "https://api.seerapi.com/v1/skill/28395"
                },
                {
                  "id": 28400,
                  "url": "https://api.seerapi.com/v1/skill/28400"
                },
                {
                  "id": 28403,
                  "url": "https://api.seerapi.com/v1/skill/28403"
                },
                {
                  "id": 28406,
                  "url": "https://api.seerapi.com/v1/skill/28406"
                },
                {
                  "id": 28409,
                  "url": "https://api.seerapi.com/v1/skill/28409"
                },
                {
                  "id": 28418,
                  "url": "https://api.seerapi.com/v1/skill/28418"
                },
                {
                  "id": 28421,
                  "url": "https://api.seerapi.com/v1/skill/28421"
                },
                {
                  "id": 28426,
                  "url": "https://api.seerapi.com/v1/skill/28426"
                },
                {
                  "id": 28431,
                  "url": "https://api.seerapi.com/v1/skill/28431"
                },
                {
                  "id": 28435,
                  "url": "https://api.seerapi.com/v1/skill/28435"
                },
                {
                  "id": 28447,
                  "url": "https://api.seerapi.com/v1/skill/28447"
                },
                {
                  "id": 28450,
                  "url": "https://api.seerapi.com/v1/skill/28450"
                },
                {
                  "id": 28455,
                  "url": "https://api.seerapi.com/v1/skill/28455"
                },
                {
                  "id": 28458,
                  "url": "https://api.seerapi.com/v1/skill/28458"
                },
                {
                  "id": 28460,
                  "url": "https://api.seerapi.com/v1/skill/28460"
                },
                {
                  "id": 28463,
                  "url": "https://api.seerapi.com/v1/skill/28463"
                },
                {
                  "id": 28467,
                  "url": "https://api.seerapi.com/v1/skill/28467"
                },
                {
                  "id": 28480,
                  "url": "https://api.seerapi.com/v1/skill/28480"
                },
                {
                  "id": 28483,
                  "url": "https://api.seerapi.com/v1/skill/28483"
                },
                {
                  "id": 28486,
                  "url": "https://api.seerapi.com/v1/skill/28486"
                },
                {
                  "id": 28489,
                  "url": "https://api.seerapi.com/v1/skill/28489"
                },
                {
                  "id": 28494,
                  "url": "https://api.seerapi.com/v1/skill/28494"
                },
                {
                  "id": 28496,
                  "url": "https://api.seerapi.com/v1/skill/28496"
                },
                {
                  "id": 28500,
                  "url": "https://api.seerapi.com/v1/skill/28500"
                },
                {
                  "id": 28504,
                  "url": "https://api.seerapi.com/v1/skill/28504"
                },
                {
                  "id": 28513,
                  "url": "https://api.seerapi.com/v1/skill/28513"
                },
                {
                  "id": 28516,
                  "url": "https://api.seerapi.com/v1/skill/28516"
                },
                {
                  "id": 28528,
                  "url": "https://api.seerapi.com/v1/skill/28528"
                },
                {
                  "id": 28534,
                  "url": "https://api.seerapi.com/v1/skill/28534"
                },
                {
                  "id": 28537,
                  "url": "https://api.seerapi.com/v1/skill/28537"
                },
                {
                  "id": 28546,
                  "url": "https://api.seerapi.com/v1/skill/28546"
                },
                {
                  "id": 28549,
                  "url": "https://api.seerapi.com/v1/skill/28549"
                },
                {
                  "id": 28552,
                  "url": "https://api.seerapi.com/v1/skill/28552"
                },
                {
                  "id": 28554,
                  "url": "https://api.seerapi.com/v1/skill/28554"
                },
                {
                  "id": 28563,
                  "url": "https://api.seerapi.com/v1/skill/28563"
                },
                {
                  "id": 28565,
                  "url": "https://api.seerapi.com/v1/skill/28565"
                },
                {
                  "id": 28569,
                  "url": "https://api.seerapi.com/v1/skill/28569"
                },
                {
                  "id": 28577,
                  "url": "https://api.seerapi.com/v1/skill/28577"
                },
                {
                  "id": 28583,
                  "url": "https://api.seerapi.com/v1/skill/28583"
                },
                {
                  "id": 28587,
                  "url": "https://api.seerapi.com/v1/skill/28587"
                },
                {
                  "id": 28595,
                  "url": "https://api.seerapi.com/v1/skill/28595"
                },
                {
                  "id": 28610,
                  "url": "https://api.seerapi.com/v1/skill/28610"
                },
                {
                  "id": 28612,
                  "url": "https://api.seerapi.com/v1/skill/28612"
                },
                {
                  "id": 28619,
                  "url": "https://api.seerapi.com/v1/skill/28619"
                },
                {
                  "id": 28628,
                  "url": "https://api.seerapi.com/v1/skill/28628"
                },
                {
                  "id": 28630,
                  "url": "https://api.seerapi.com/v1/skill/28630"
                },
                {
                  "id": 28633,
                  "url": "https://api.seerapi.com/v1/skill/28633"
                },
                {
                  "id": 28636,
                  "url": "https://api.seerapi.com/v1/skill/28636"
                },
                {
                  "id": 28642,
                  "url": "https://api.seerapi.com/v1/skill/28642"
                },
                {
                  "id": 28644,
                  "url": "https://api.seerapi.com/v1/skill/28644"
                },
                {
                  "id": 28646,
                  "url": "https://api.seerapi.com/v1/skill/28646"
                },
                {
                  "id": 28648,
                  "url": "https://api.seerapi.com/v1/skill/28648"
                },
                {
                  "id": 28656,
                  "url": "https://api.seerapi.com/v1/skill/28656"
                },
                {
                  "id": 28661,
                  "url": "https://api.seerapi.com/v1/skill/28661"
                },
                {
                  "id": 28667,
                  "url": "https://api.seerapi.com/v1/skill/28667"
                },
                {
                  "id": 28668,
                  "url": "https://api.seerapi.com/v1/skill/28668"
                },
                {
                  "id": 28673,
                  "url": "https://api.seerapi.com/v1/skill/28673"
                },
                {
                  "id": 28676,
                  "url": "https://api.seerapi.com/v1/skill/28676"
                },
                {
                  "id": 28679,
                  "url": "https://api.seerapi.com/v1/skill/28679"
                },
                {
                  "id": 28684,
                  "url": "https://api.seerapi.com/v1/skill/28684"
                },
                {
                  "id": 28686,
                  "url": "https://api.seerapi.com/v1/skill/28686"
                },
                {
                  "id": 28690,
                  "url": "https://api.seerapi.com/v1/skill/28690"
                },
                {
                  "id": 28697,
                  "url": "https://api.seerapi.com/v1/skill/28697"
                },
                {
                  "id": 28700,
                  "url": "https://api.seerapi.com/v1/skill/28700"
                },
                {
                  "id": 28710,
                  "url": "https://api.seerapi.com/v1/skill/28710"
                },
                {
                  "id": 28718,
                  "url": "https://api.seerapi.com/v1/skill/28718"
                },
                {
                  "id": 28722,
                  "url": "https://api.seerapi.com/v1/skill/28722"
                },
                {
                  "id": 28725,
                  "url": "https://api.seerapi.com/v1/skill/28725"
                },
                {
                  "id": 28731,
                  "url": "https://api.seerapi.com/v1/skill/28731"
                },
                {
                  "id": 28734,
                  "url": "https://api.seerapi.com/v1/skill/28734"
                },
                {
                  "id": 28737,
                  "url": "https://api.seerapi.com/v1/skill/28737"
                },
                {
                  "id": 28740,
                  "url": "https://api.seerapi.com/v1/skill/28740"
                },
                {
                  "id": 28743,
                  "url": "https://api.seerapi.com/v1/skill/28743"
                },
                {
                  "id": 28746,
                  "url": "https://api.seerapi.com/v1/skill/28746"
                },
                {
                  "id": 28752,
                  "url": "https://api.seerapi.com/v1/skill/28752"
                },
                {
                  "id": 28756,
                  "url": "https://api.seerapi.com/v1/skill/28756"
                },
                {
                  "id": 28758,
                  "url": "https://api.seerapi.com/v1/skill/28758"
                },
                {
                  "id": 28759,
                  "url": "https://api.seerapi.com/v1/skill/28759"
                },
                {
                  "id": 28762,
                  "url": "https://api.seerapi.com/v1/skill/28762"
                },
                {
                  "id": 28765,
                  "url": "https://api.seerapi.com/v1/skill/28765"
                },
                {
                  "id": 28768,
                  "url": "https://api.seerapi.com/v1/skill/28768"
                },
                {
                  "id": 28784,
                  "url": "https://api.seerapi.com/v1/skill/28784"
                },
                {
                  "id": 28786,
                  "url": "https://api.seerapi.com/v1/skill/28786"
                },
                {
                  "id": 28797,
                  "url": "https://api.seerapi.com/v1/skill/28797"
                },
                {
                  "id": 28803,
                  "url": "https://api.seerapi.com/v1/skill/28803"
                },
                {
                  "id": 28808,
                  "url": "https://api.seerapi.com/v1/skill/28808"
                },
                {
                  "id": 28811,
                  "url": "https://api.seerapi.com/v1/skill/28811"
                },
                {
                  "id": 28818,
                  "url": "https://api.seerapi.com/v1/skill/28818"
                },
                {
                  "id": 28820,
                  "url": "https://api.seerapi.com/v1/skill/28820"
                },
                {
                  "id": 28822,
                  "url": "https://api.seerapi.com/v1/skill/28822"
                },
                {
                  "id": 28824,
                  "url": "https://api.seerapi.com/v1/skill/28824"
                },
                {
                  "id": 28831,
                  "url": "https://api.seerapi.com/v1/skill/28831"
                },
                {
                  "id": 28869,
                  "url": "https://api.seerapi.com/v1/skill/28869"
                },
                {
                  "id": 28921,
                  "url": "https://api.seerapi.com/v1/skill/28921"
                },
                {
                  "id": 28943,
                  "url": "https://api.seerapi.com/v1/skill/28943"
                },
                {
                  "id": 28960,
                  "url": "https://api.seerapi.com/v1/skill/28960"
                },
                {
                  "id": 28966,
                  "url": "https://api.seerapi.com/v1/skill/28966"
                },
                {
                  "id": 28972,
                  "url": "https://api.seerapi.com/v1/skill/28972"
                },
                {
                  "id": 28973,
                  "url": "https://api.seerapi.com/v1/skill/28973"
                },
                {
                  "id": 28981,
                  "url": "https://api.seerapi.com/v1/skill/28981"
                },
                {
                  "id": 28985,
                  "url": "https://api.seerapi.com/v1/skill/28985"
                },
                {
                  "id": 28989,
                  "url": "https://api.seerapi.com/v1/skill/28989"
                },
                {
                  "id": 28992,
                  "url": "https://api.seerapi.com/v1/skill/28992"
                },
                {
                  "id": 28994,
                  "url": "https://api.seerapi.com/v1/skill/28994"
                },
                {
                  "id": 29005,
                  "url": "https://api.seerapi.com/v1/skill/29005"
                },
                {
                  "id": 29007,
                  "url": "https://api.seerapi.com/v1/skill/29007"
                },
                {
                  "id": 29012,
                  "url": "https://api.seerapi.com/v1/skill/29012"
                },
                {
                  "id": 29014,
                  "url": "https://api.seerapi.com/v1/skill/29014"
                },
                {
                  "id": 29016,
                  "url": "https://api.seerapi.com/v1/skill/29016"
                },
                {
                  "id": 29017,
                  "url": "https://api.seerapi.com/v1/skill/29017"
                },
                {
                  "id": 29018,
                  "url": "https://api.seerapi.com/v1/skill/29018"
                },
                {
                  "id": 29022,
                  "url": "https://api.seerapi.com/v1/skill/29022"
                },
                {
                  "id": 29023,
                  "url": "https://api.seerapi.com/v1/skill/29023"
                },
                {
                  "id": 29030,
                  "url": "https://api.seerapi.com/v1/skill/29030"
                },
                {
                  "id": 29037,
                  "url": "https://api.seerapi.com/v1/skill/29037"
                },
                {
                  "id": 29039,
                  "url": "https://api.seerapi.com/v1/skill/29039"
                },
                {
                  "id": 29041,
                  "url": "https://api.seerapi.com/v1/skill/29041"
                },
                {
                  "id": 29043,
                  "url": "https://api.seerapi.com/v1/skill/29043"
                },
                {
                  "id": 29045,
                  "url": "https://api.seerapi.com/v1/skill/29045"
                },
                {
                  "id": 29049,
                  "url": "https://api.seerapi.com/v1/skill/29049"
                },
                {
                  "id": 29051,
                  "url": "https://api.seerapi.com/v1/skill/29051"
                },
                {
                  "id": 29053,
                  "url": "https://api.seerapi.com/v1/skill/29053"
                },
                {
                  "id": 29059,
                  "url": "https://api.seerapi.com/v1/skill/29059"
                },
                {
                  "id": 29075,
                  "url": "https://api.seerapi.com/v1/skill/29075"
                },
                {
                  "id": 29077,
                  "url": "https://api.seerapi.com/v1/skill/29077"
                },
                {
                  "id": 29082,
                  "url": "https://api.seerapi.com/v1/skill/29082"
                },
                {
                  "id": 29084,
                  "url": "https://api.seerapi.com/v1/skill/29084"
                },
                {
                  "id": 29086,
                  "url": "https://api.seerapi.com/v1/skill/29086"
                },
                {
                  "id": 29092,
                  "url": "https://api.seerapi.com/v1/skill/29092"
                },
                {
                  "id": 29102,
                  "url": "https://api.seerapi.com/v1/skill/29102"
                },
                {
                  "id": 29103,
                  "url": "https://api.seerapi.com/v1/skill/29103"
                },
                {
                  "id": 29107,
                  "url": "https://api.seerapi.com/v1/skill/29107"
                },
                {
                  "id": 29109,
                  "url": "https://api.seerapi.com/v1/skill/29109"
                },
                {
                  "id": 29113,
                  "url": "https://api.seerapi.com/v1/skill/29113"
                },
                {
                  "id": 29121,
                  "url": "https://api.seerapi.com/v1/skill/29121"
                },
                {
                  "id": 29123,
                  "url": "https://api.seerapi.com/v1/skill/29123"
                },
                {
                  "id": 29125,
                  "url": "https://api.seerapi.com/v1/skill/29125"
                },
                {
                  "id": 29127,
                  "url": "https://api.seerapi.com/v1/skill/29127"
                },
                {
                  "id": 29131,
                  "url": "https://api.seerapi.com/v1/skill/29131"
                },
                {
                  "id": 29135,
                  "url": "https://api.seerapi.com/v1/skill/29135"
                },
                {
                  "id": 29136,
                  "url": "https://api.seerapi.com/v1/skill/29136"
                },
                {
                  "id": 29142,
                  "url": "https://api.seerapi.com/v1/skill/29142"
                },
                {
                  "id": 29146,
                  "url": "https://api.seerapi.com/v1/skill/29146"
                },
                {
                  "id": 29150,
                  "url": "https://api.seerapi.com/v1/skill/29150"
                },
                {
                  "id": 29151,
                  "url": "https://api.seerapi.com/v1/skill/29151"
                },
                {
                  "id": 29153,
                  "url": "https://api.seerapi.com/v1/skill/29153"
                },
                {
                  "id": 29155,
                  "url": "https://api.seerapi.com/v1/skill/29155"
                },
                {
                  "id": 29159,
                  "url": "https://api.seerapi.com/v1/skill/29159"
                },
                {
                  "id": 29161,
                  "url": "https://api.seerapi.com/v1/skill/29161"
                },
                {
                  "id": 29169,
                  "url": "https://api.seerapi.com/v1/skill/29169"
                },
                {
                  "id": 29170,
                  "url": "https://api.seerapi.com/v1/skill/29170"
                },
                {
                  "id": 29173,
                  "url": "https://api.seerapi.com/v1/skill/29173"
                },
                {
                  "id": 29175,
                  "url": "https://api.seerapi.com/v1/skill/29175"
                },
                {
                  "id": 29181,
                  "url": "https://api.seerapi.com/v1/skill/29181"
                },
                {
                  "id": 29183,
                  "url": "https://api.seerapi.com/v1/skill/29183"
                },
                {
                  "id": 29186,
                  "url": "https://api.seerapi.com/v1/skill/29186"
                },
                {
                  "id": 29189,
                  "url": "https://api.seerapi.com/v1/skill/29189"
                },
                {
                  "id": 29191,
                  "url": "https://api.seerapi.com/v1/skill/29191"
                },
                {
                  "id": 29197,
                  "url": "https://api.seerapi.com/v1/skill/29197"
                },
                {
                  "id": 29203,
                  "url": "https://api.seerapi.com/v1/skill/29203"
                },
                {
                  "id": 29205,
                  "url": "https://api.seerapi.com/v1/skill/29205"
                },
                {
                  "id": 29213,
                  "url": "https://api.seerapi.com/v1/skill/29213"
                },
                {
                  "id": 29217,
                  "url": "https://api.seerapi.com/v1/skill/29217"
                },
                {
                  "id": 29227,
                  "url": "https://api.seerapi.com/v1/skill/29227"
                },
                {
                  "id": 29235,
                  "url": "https://api.seerapi.com/v1/skill/29235"
                },
                {
                  "id": 29240,
                  "url": "https://api.seerapi.com/v1/skill/29240"
                },
                {
                  "id": 29245,
                  "url": "https://api.seerapi.com/v1/skill/29245"
                },
                {
                  "id": 29249,
                  "url": "https://api.seerapi.com/v1/skill/29249"
                },
                {
                  "id": 29252,
                  "url": "https://api.seerapi.com/v1/skill/29252"
                },
                {
                  "id": 29263,
                  "url": "https://api.seerapi.com/v1/skill/29263"
                },
                {
                  "id": 29265,
                  "url": "https://api.seerapi.com/v1/skill/29265"
                },
                {
                  "id": 29271,
                  "url": "https://api.seerapi.com/v1/skill/29271"
                },
                {
                  "id": 29273,
                  "url": "https://api.seerapi.com/v1/skill/29273"
                },
                {
                  "id": 29275,
                  "url": "https://api.seerapi.com/v1/skill/29275"
                },
                {
                  "id": 29277,
                  "url": "https://api.seerapi.com/v1/skill/29277"
                },
                {
                  "id": 29284,
                  "url": "https://api.seerapi.com/v1/skill/29284"
                },
                {
                  "id": 29285,
                  "url": "https://api.seerapi.com/v1/skill/29285"
                },
                {
                  "id": 29287,
                  "url": "https://api.seerapi.com/v1/skill/29287"
                },
                {
                  "id": 29291,
                  "url": "https://api.seerapi.com/v1/skill/29291"
                },
                {
                  "id": 29297,
                  "url": "https://api.seerapi.com/v1/skill/29297"
                },
                {
                  "id": 29300,
                  "url": "https://api.seerapi.com/v1/skill/29300"
                },
                {
                  "id": 29317,
                  "url": "https://api.seerapi.com/v1/skill/29317"
                },
                {
                  "id": 29321,
                  "url": "https://api.seerapi.com/v1/skill/29321"
                },
                {
                  "id": 29326,
                  "url": "https://api.seerapi.com/v1/skill/29326"
                },
                {
                  "id": 29335,
                  "url": "https://api.seerapi.com/v1/skill/29335"
                },
                {
                  "id": 29337,
                  "url": "https://api.seerapi.com/v1/skill/29337"
                },
                {
                  "id": 29339,
                  "url": "https://api.seerapi.com/v1/skill/29339"
                },
                {
                  "id": 29345,
                  "url": "https://api.seerapi.com/v1/skill/29345"
                },
                {
                  "id": 29349,
                  "url": "https://api.seerapi.com/v1/skill/29349"
                },
                {
                  "id": 29351,
                  "url": "https://api.seerapi.com/v1/skill/29351"
                },
                {
                  "id": 29353,
                  "url": "https://api.seerapi.com/v1/skill/29353"
                },
                {
                  "id": 29356,
                  "url": "https://api.seerapi.com/v1/skill/29356"
                },
                {
                  "id": 29362,
                  "url": "https://api.seerapi.com/v1/skill/29362"
                },
                {
                  "id": 29365,
                  "url": "https://api.seerapi.com/v1/skill/29365"
                },
                {
                  "id": 29369,
                  "url": "https://api.seerapi.com/v1/skill/29369"
                },
                {
                  "id": 29372,
                  "url": "https://api.seerapi.com/v1/skill/29372"
                },
                {
                  "id": 29380,
                  "url": "https://api.seerapi.com/v1/skill/29380"
                },
                {
                  "id": 29382,
                  "url": "https://api.seerapi.com/v1/skill/29382"
                },
                {
                  "id": 29384,
                  "url": "https://api.seerapi.com/v1/skill/29384"
                },
                {
                  "id": 29388,
                  "url": "https://api.seerapi.com/v1/skill/29388"
                },
                {
                  "id": 29390,
                  "url": "https://api.seerapi.com/v1/skill/29390"
                },
                {
                  "id": 29393,
                  "url": "https://api.seerapi.com/v1/skill/29393"
                },
                {
                  "id": 29396,
                  "url": "https://api.seerapi.com/v1/skill/29396"
                },
                {
                  "id": 29400,
                  "url": "https://api.seerapi.com/v1/skill/29400"
                },
                {
                  "id": 29407,
                  "url": "https://api.seerapi.com/v1/skill/29407"
                },
                {
                  "id": 29413,
                  "url": "https://api.seerapi.com/v1/skill/29413"
                },
                {
                  "id": 29415,
                  "url": "https://api.seerapi.com/v1/skill/29415"
                },
                {
                  "id": 29417,
                  "url": "https://api.seerapi.com/v1/skill/29417"
                },
                {
                  "id": 29419,
                  "url": "https://api.seerapi.com/v1/skill/29419"
                },
                {
                  "id": 29421,
                  "url": "https://api.seerapi.com/v1/skill/29421"
                },
                {
                  "id": 29423,
                  "url": "https://api.seerapi.com/v1/skill/29423"
                },
                {
                  "id": 29425,
                  "url": "https://api.seerapi.com/v1/skill/29425"
                },
                {
                  "id": 29427,
                  "url": "https://api.seerapi.com/v1/skill/29427"
                },
                {
                  "id": 29429,
                  "url": "https://api.seerapi.com/v1/skill/29429"
                },
                {
                  "id": 29431,
                  "url": "https://api.seerapi.com/v1/skill/29431"
                },
                {
                  "id": 29433,
                  "url": "https://api.seerapi.com/v1/skill/29433"
                },
                {
                  "id": 29435,
                  "url": "https://api.seerapi.com/v1/skill/29435"
                },
                {
                  "id": 29438,
                  "url": "https://api.seerapi.com/v1/skill/29438"
                },
                {
                  "id": 29440,
                  "url": "https://api.seerapi.com/v1/skill/29440"
                },
                {
                  "id": 29444,
                  "url": "https://api.seerapi.com/v1/skill/29444"
                },
                {
                  "id": 29446,
                  "url": "https://api.seerapi.com/v1/skill/29446"
                },
                {
                  "id": 29449,
                  "url": "https://api.seerapi.com/v1/skill/29449"
                },
                {
                  "id": 29451,
                  "url": "https://api.seerapi.com/v1/skill/29451"
                },
                {
                  "id": 29453,
                  "url": "https://api.seerapi.com/v1/skill/29453"
                },
                {
                  "id": 29455,
                  "url": "https://api.seerapi.com/v1/skill/29455"
                },
                {
                  "id": 29457,
                  "url": "https://api.seerapi.com/v1/skill/29457"
                },
                {
                  "id": 29459,
                  "url": "https://api.seerapi.com/v1/skill/29459"
                },
                {
                  "id": 29463,
                  "url": "https://api.seerapi.com/v1/skill/29463"
                },
                {
                  "id": 29466,
                  "url": "https://api.seerapi.com/v1/skill/29466"
                },
                {
                  "id": 29468,
                  "url": "https://api.seerapi.com/v1/skill/29468"
                },
                {
                  "id": 30443,
                  "url": "https://api.seerapi.com/v1/skill/30443"
                },
                {
                  "id": 32308,
                  "url": "https://api.seerapi.com/v1/skill/32308"
                },
                {
                  "id": 32604,
                  "url": "https://api.seerapi.com/v1/skill/32604"
                },
                {
                  "id": 33070,
                  "url": "https://api.seerapi.com/v1/skill/33070"
                },
                {
                  "id": 35754,
                  "url": "https://api.seerapi.com/v1/skill/35754"
                },
                {
                  "id": 35814,
                  "url": "https://api.seerapi.com/v1/skill/35814"
                },
                {
                  "id": 35892,
                  "url": "https://api.seerapi.com/v1/skill/35892"
                },
                {
                  "id": 36044,
                  "url": "https://api.seerapi.com/v1/skill/36044"
                },
                {
                  "id": 36092,
                  "url": "https://api.seerapi.com/v1/skill/36092"
                },
                {
                  "id": 36644,
                  "url": "https://api.seerapi.com/v1/skill/36644"
                },
                {
                  "id": 36657,
                  "url": "https://api.seerapi.com/v1/skill/36657"
                },
                {
                  "id": 36663,
                  "url": "https://api.seerapi.com/v1/skill/36663"
                },
                {
                  "id": 36908,
                  "url": "https://api.seerapi.com/v1/skill/36908"
                },
                {
                  "id": 37023,
                  "url": "https://api.seerapi.com/v1/skill/37023"
                },
                {
                  "id": 37985,
                  "url": "https://api.seerapi.com/v1/skill/37985"
                },
                {
                  "id": 38226,
                  "url": "https://api.seerapi.com/v1/skill/38226"
                },
                {
                  "id": 38321,
                  "url": "https://api.seerapi.com/v1/skill/38321"
                },
                {
                  "id": 38358,
                  "url": "https://api.seerapi.com/v1/skill/38358"
                }
              ],
              "tag": [
                {
                  "id": 34256,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/34256"
                }
              ],
              "hash": "ebdb8dc2"
            },
            "cacheFile": "research/3667-source-check-external.json",
            "loadedAt": "2026-10-13T15:18:18.091Z",
            "storage": "existing-cache"
          }
        }
      ],
      "sources": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1876",
          "data": {
            "id": 1876,
            "desc": "自身登场首回合令对手的攻击技能附加效果失效|回合开始时，若自身为满体力则当回合自身所有技能先制+1，若自身不为满体力则当回合受到的攻击伤害额外减少50%，每减少1点攻击伤害，自身下次攻击附加1点固定伤害|（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场首回合令对手的<b>攻击技能<color=#64F9FA></b>命中效果失效</color>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时，若自身为满体力则当回合自身所有技能<b>先制</b>+1；若自身不为满体力则当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%，每减少1点，自身下次攻击<color=#64F9FA>附加</color>1点<b>固定伤害</b>",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4674,
                "url": "https://api.seerapi.com/v1/pet/4674"
              }
            ],
            "effect": {
              "effect_args": [
                1,
                50,
                1,
                1,
                1
              ],
              "effect": {
                "id": 2276,
                "url": "https://api.seerapi.com/v1/eid_effect/2276"
              }
            },
            "effect_alias": "alias_2276_1_50_1_1_1",
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
            "hash": "92b69ae1"
          },
          "loadedAt": "2026-10-26T08:08:59.907Z",
          "storage": "refreshed"
        }
      ],
      "checked": [
        "真实被控未用不消费已完成，真实命中后附伤被固定免疫仍消费已完成；不把未回答的失败消费模型当答案"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4625-011 · 4674新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "gap": "77持续用招回复、992持续攻击附伤的授予当次首触；触发词逐项保留，不扩大仅回答其他源",
      "relatedSources": [
        {
          "moveId": 28825,
          "name": "宙轨重回",
          "index": 1,
          "args": [
            4,
            400
          ],
          "description": "4回合内若使用技能则恢复400点体力值",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28825",
            "data": {
              "id": 28825,
              "name": "宙轨重回",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "全属性提升了；开始恢复体力了；出手变得更快了",
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
                  "info": "全属性+1，自身满体力时强化效果翻倍",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，自身满体力时强化效果翻倍（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 893,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/893"
                  }
                },
                {
                  "info": "4回合内若使用技能则恢复400点体力值",
                  "analyze_info": "[sprite name=iconHit]4回合内若使用技能则恢复400点体力值（boss有效）",
                  "args": [
                    4,
                    400
                  ],
                  "effect": {
                    "id": 77,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/77"
                  }
                },
                {
                  "info": "下2回合先出手则对手束缚",
                  "analyze_info": "[sprite name=iconHit]下2回合先出手则对手[color=#57c975]束缚[/color]",
                  "args": [
                    2,
                    28
                  ],
                  "effect": {
                    "id": 878,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/878"
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
              "hash": "86da18eb"
            },
            "loadedAt": "2026-10-26T08:09:43.154Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/77",
            "data": {
              "id": 77,
              "args_num": 2,
              "info": "{0}回合内若使用技能则恢复{1}点体力值",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]{0}回合内若使用技能则恢复{1}点体力值（boss有效）",
              "pve_effective": true,
              "param": null,
              "skill": [
                {
                  "id": 11366,
                  "url": "https://api.seerapi.com/v1/skill/11366"
                },
                {
                  "id": 11908,
                  "url": "https://api.seerapi.com/v1/skill/11908"
                },
                {
                  "id": 11953,
                  "url": "https://api.seerapi.com/v1/skill/11953"
                },
                {
                  "id": 12044,
                  "url": "https://api.seerapi.com/v1/skill/12044"
                },
                {
                  "id": 12069,
                  "url": "https://api.seerapi.com/v1/skill/12069"
                },
                {
                  "id": 16883,
                  "url": "https://api.seerapi.com/v1/skill/16883"
                },
                {
                  "id": 18328,
                  "url": "https://api.seerapi.com/v1/skill/18328"
                },
                {
                  "id": 19004,
                  "url": "https://api.seerapi.com/v1/skill/19004"
                },
                {
                  "id": 19475,
                  "url": "https://api.seerapi.com/v1/skill/19475"
                },
                {
                  "id": 20574,
                  "url": "https://api.seerapi.com/v1/skill/20574"
                },
                {
                  "id": 20606,
                  "url": "https://api.seerapi.com/v1/skill/20606"
                },
                {
                  "id": 22035,
                  "url": "https://api.seerapi.com/v1/skill/22035"
                },
                {
                  "id": 22089,
                  "url": "https://api.seerapi.com/v1/skill/22089"
                },
                {
                  "id": 22203,
                  "url": "https://api.seerapi.com/v1/skill/22203"
                },
                {
                  "id": 22291,
                  "url": "https://api.seerapi.com/v1/skill/22291"
                },
                {
                  "id": 22320,
                  "url": "https://api.seerapi.com/v1/skill/22320"
                },
                {
                  "id": 22518,
                  "url": "https://api.seerapi.com/v1/skill/22518"
                },
                {
                  "id": 22530,
                  "url": "https://api.seerapi.com/v1/skill/22530"
                },
                {
                  "id": 22537,
                  "url": "https://api.seerapi.com/v1/skill/22537"
                },
                {
                  "id": 22554,
                  "url": "https://api.seerapi.com/v1/skill/22554"
                },
                {
                  "id": 22587,
                  "url": "https://api.seerapi.com/v1/skill/22587"
                },
                {
                  "id": 22602,
                  "url": "https://api.seerapi.com/v1/skill/22602"
                },
                {
                  "id": 22731,
                  "url": "https://api.seerapi.com/v1/skill/22731"
                },
                {
                  "id": 22737,
                  "url": "https://api.seerapi.com/v1/skill/22737"
                },
                {
                  "id": 22775,
                  "url": "https://api.seerapi.com/v1/skill/22775"
                },
                {
                  "id": 22779,
                  "url": "https://api.seerapi.com/v1/skill/22779"
                },
                {
                  "id": 22790,
                  "url": "https://api.seerapi.com/v1/skill/22790"
                },
                {
                  "id": 22798,
                  "url": "https://api.seerapi.com/v1/skill/22798"
                },
                {
                  "id": 22812,
                  "url": "https://api.seerapi.com/v1/skill/22812"
                },
                {
                  "id": 22824,
                  "url": "https://api.seerapi.com/v1/skill/22824"
                },
                {
                  "id": 22883,
                  "url": "https://api.seerapi.com/v1/skill/22883"
                },
                {
                  "id": 22896,
                  "url": "https://api.seerapi.com/v1/skill/22896"
                },
                {
                  "id": 22900,
                  "url": "https://api.seerapi.com/v1/skill/22900"
                },
                {
                  "id": 22945,
                  "url": "https://api.seerapi.com/v1/skill/22945"
                },
                {
                  "id": 22964,
                  "url": "https://api.seerapi.com/v1/skill/22964"
                },
                {
                  "id": 23029,
                  "url": "https://api.seerapi.com/v1/skill/23029"
                },
                {
                  "id": 23077,
                  "url": "https://api.seerapi.com/v1/skill/23077"
                },
                {
                  "id": 23091,
                  "url": "https://api.seerapi.com/v1/skill/23091"
                },
                {
                  "id": 23105,
                  "url": "https://api.seerapi.com/v1/skill/23105"
                },
                {
                  "id": 23114,
                  "url": "https://api.seerapi.com/v1/skill/23114"
                },
                {
                  "id": 23127,
                  "url": "https://api.seerapi.com/v1/skill/23127"
                },
                {
                  "id": 23130,
                  "url": "https://api.seerapi.com/v1/skill/23130"
                },
                {
                  "id": 23134,
                  "url": "https://api.seerapi.com/v1/skill/23134"
                },
                {
                  "id": 23137,
                  "url": "https://api.seerapi.com/v1/skill/23137"
                },
                {
                  "id": 23150,
                  "url": "https://api.seerapi.com/v1/skill/23150"
                },
                {
                  "id": 23164,
                  "url": "https://api.seerapi.com/v1/skill/23164"
                },
                {
                  "id": 23180,
                  "url": "https://api.seerapi.com/v1/skill/23180"
                },
                {
                  "id": 23184,
                  "url": "https://api.seerapi.com/v1/skill/23184"
                },
                {
                  "id": 23198,
                  "url": "https://api.seerapi.com/v1/skill/23198"
                },
                {
                  "id": 23204,
                  "url": "https://api.seerapi.com/v1/skill/23204"
                },
                {
                  "id": 23208,
                  "url": "https://api.seerapi.com/v1/skill/23208"
                },
                {
                  "id": 23231,
                  "url": "https://api.seerapi.com/v1/skill/23231"
                },
                {
                  "id": 23234,
                  "url": "https://api.seerapi.com/v1/skill/23234"
                },
                {
                  "id": 23248,
                  "url": "https://api.seerapi.com/v1/skill/23248"
                },
                {
                  "id": 23254,
                  "url": "https://api.seerapi.com/v1/skill/23254"
                },
                {
                  "id": 23275,
                  "url": "https://api.seerapi.com/v1/skill/23275"
                },
                {
                  "id": 23294,
                  "url": "https://api.seerapi.com/v1/skill/23294"
                },
                {
                  "id": 23309,
                  "url": "https://api.seerapi.com/v1/skill/23309"
                },
                {
                  "id": 23321,
                  "url": "https://api.seerapi.com/v1/skill/23321"
                },
                {
                  "id": 23323,
                  "url": "https://api.seerapi.com/v1/skill/23323"
                },
                {
                  "id": 23327,
                  "url": "https://api.seerapi.com/v1/skill/23327"
                },
                {
                  "id": 23341,
                  "url": "https://api.seerapi.com/v1/skill/23341"
                },
                {
                  "id": 23343,
                  "url": "https://api.seerapi.com/v1/skill/23343"
                },
                {
                  "id": 23349,
                  "url": "https://api.seerapi.com/v1/skill/23349"
                },
                {
                  "id": 23353,
                  "url": "https://api.seerapi.com/v1/skill/23353"
                },
                {
                  "id": 23366,
                  "url": "https://api.seerapi.com/v1/skill/23366"
                },
                {
                  "id": 23368,
                  "url": "https://api.seerapi.com/v1/skill/23368"
                },
                {
                  "id": 23375,
                  "url": "https://api.seerapi.com/v1/skill/23375"
                },
                {
                  "id": 23382,
                  "url": "https://api.seerapi.com/v1/skill/23382"
                },
                {
                  "id": 23389,
                  "url": "https://api.seerapi.com/v1/skill/23389"
                },
                {
                  "id": 23402,
                  "url": "https://api.seerapi.com/v1/skill/23402"
                },
                {
                  "id": 23404,
                  "url": "https://api.seerapi.com/v1/skill/23404"
                },
                {
                  "id": 23411,
                  "url": "https://api.seerapi.com/v1/skill/23411"
                },
                {
                  "id": 23423,
                  "url": "https://api.seerapi.com/v1/skill/23423"
                },
                {
                  "id": 23441,
                  "url": "https://api.seerapi.com/v1/skill/23441"
                },
                {
                  "id": 23457,
                  "url": "https://api.seerapi.com/v1/skill/23457"
                },
                {
                  "id": 23467,
                  "url": "https://api.seerapi.com/v1/skill/23467"
                },
                {
                  "id": 23485,
                  "url": "https://api.seerapi.com/v1/skill/23485"
                },
                {
                  "id": 23493,
                  "url": "https://api.seerapi.com/v1/skill/23493"
                },
                {
                  "id": 23502,
                  "url": "https://api.seerapi.com/v1/skill/23502"
                },
                {
                  "id": 23505,
                  "url": "https://api.seerapi.com/v1/skill/23505"
                },
                {
                  "id": 23539,
                  "url": "https://api.seerapi.com/v1/skill/23539"
                },
                {
                  "id": 23588,
                  "url": "https://api.seerapi.com/v1/skill/23588"
                },
                {
                  "id": 23603,
                  "url": "https://api.seerapi.com/v1/skill/23603"
                },
                {
                  "id": 23609,
                  "url": "https://api.seerapi.com/v1/skill/23609"
                },
                {
                  "id": 23611,
                  "url": "https://api.seerapi.com/v1/skill/23611"
                },
                {
                  "id": 23625,
                  "url": "https://api.seerapi.com/v1/skill/23625"
                },
                {
                  "id": 23633,
                  "url": "https://api.seerapi.com/v1/skill/23633"
                },
                {
                  "id": 23645,
                  "url": "https://api.seerapi.com/v1/skill/23645"
                },
                {
                  "id": 23648,
                  "url": "https://api.seerapi.com/v1/skill/23648"
                },
                {
                  "id": 23660,
                  "url": "https://api.seerapi.com/v1/skill/23660"
                },
                {
                  "id": 23672,
                  "url": "https://api.seerapi.com/v1/skill/23672"
                },
                {
                  "id": 23674,
                  "url": "https://api.seerapi.com/v1/skill/23674"
                },
                {
                  "id": 23689,
                  "url": "https://api.seerapi.com/v1/skill/23689"
                },
                {
                  "id": 23693,
                  "url": "https://api.seerapi.com/v1/skill/23693"
                },
                {
                  "id": 23696,
                  "url": "https://api.seerapi.com/v1/skill/23696"
                },
                {
                  "id": 23700,
                  "url": "https://api.seerapi.com/v1/skill/23700"
                },
                {
                  "id": 23704,
                  "url": "https://api.seerapi.com/v1/skill/23704"
                },
                {
                  "id": 23709,
                  "url": "https://api.seerapi.com/v1/skill/23709"
                },
                {
                  "id": 23720,
                  "url": "https://api.seerapi.com/v1/skill/23720"
                },
                {
                  "id": 23723,
                  "url": "https://api.seerapi.com/v1/skill/23723"
                },
                {
                  "id": 23725,
                  "url": "https://api.seerapi.com/v1/skill/23725"
                },
                {
                  "id": 23737,
                  "url": "https://api.seerapi.com/v1/skill/23737"
                },
                {
                  "id": 23750,
                  "url": "https://api.seerapi.com/v1/skill/23750"
                },
                {
                  "id": 23753,
                  "url": "https://api.seerapi.com/v1/skill/23753"
                },
                {
                  "id": 23756,
                  "url": "https://api.seerapi.com/v1/skill/23756"
                },
                {
                  "id": 23775,
                  "url": "https://api.seerapi.com/v1/skill/23775"
                },
                {
                  "id": 23779,
                  "url": "https://api.seerapi.com/v1/skill/23779"
                },
                {
                  "id": 23789,
                  "url": "https://api.seerapi.com/v1/skill/23789"
                },
                {
                  "id": 23798,
                  "url": "https://api.seerapi.com/v1/skill/23798"
                },
                {
                  "id": 23801,
                  "url": "https://api.seerapi.com/v1/skill/23801"
                },
                {
                  "id": 23803,
                  "url": "https://api.seerapi.com/v1/skill/23803"
                },
                {
                  "id": 23810,
                  "url": "https://api.seerapi.com/v1/skill/23810"
                },
                {
                  "id": 23816,
                  "url": "https://api.seerapi.com/v1/skill/23816"
                },
                {
                  "id": 23829,
                  "url": "https://api.seerapi.com/v1/skill/23829"
                },
                {
                  "id": 23846,
                  "url": "https://api.seerapi.com/v1/skill/23846"
                },
                {
                  "id": 23852,
                  "url": "https://api.seerapi.com/v1/skill/23852"
                },
                {
                  "id": 23859,
                  "url": "https://api.seerapi.com/v1/skill/23859"
                },
                {
                  "id": 23868,
                  "url": "https://api.seerapi.com/v1/skill/23868"
                },
                {
                  "id": 23889,
                  "url": "https://api.seerapi.com/v1/skill/23889"
                },
                {
                  "id": 23904,
                  "url": "https://api.seerapi.com/v1/skill/23904"
                },
                {
                  "id": 23919,
                  "url": "https://api.seerapi.com/v1/skill/23919"
                },
                {
                  "id": 23932,
                  "url": "https://api.seerapi.com/v1/skill/23932"
                },
                {
                  "id": 23935,
                  "url": "https://api.seerapi.com/v1/skill/23935"
                },
                {
                  "id": 23946,
                  "url": "https://api.seerapi.com/v1/skill/23946"
                },
                {
                  "id": 23956,
                  "url": "https://api.seerapi.com/v1/skill/23956"
                },
                {
                  "id": 23968,
                  "url": "https://api.seerapi.com/v1/skill/23968"
                },
                {
                  "id": 23971,
                  "url": "https://api.seerapi.com/v1/skill/23971"
                },
                {
                  "id": 23983,
                  "url": "https://api.seerapi.com/v1/skill/23983"
                },
                {
                  "id": 23985,
                  "url": "https://api.seerapi.com/v1/skill/23985"
                },
                {
                  "id": 24000,
                  "url": "https://api.seerapi.com/v1/skill/24000"
                },
                {
                  "id": 24008,
                  "url": "https://api.seerapi.com/v1/skill/24008"
                },
                {
                  "id": 24014,
                  "url": "https://api.seerapi.com/v1/skill/24014"
                },
                {
                  "id": 24025,
                  "url": "https://api.seerapi.com/v1/skill/24025"
                },
                {
                  "id": 24028,
                  "url": "https://api.seerapi.com/v1/skill/24028"
                },
                {
                  "id": 24033,
                  "url": "https://api.seerapi.com/v1/skill/24033"
                },
                {
                  "id": 24044,
                  "url": "https://api.seerapi.com/v1/skill/24044"
                },
                {
                  "id": 24047,
                  "url": "https://api.seerapi.com/v1/skill/24047"
                },
                {
                  "id": 24058,
                  "url": "https://api.seerapi.com/v1/skill/24058"
                },
                {
                  "id": 24061,
                  "url": "https://api.seerapi.com/v1/skill/24061"
                },
                {
                  "id": 24075,
                  "url": "https://api.seerapi.com/v1/skill/24075"
                },
                {
                  "id": 24079,
                  "url": "https://api.seerapi.com/v1/skill/24079"
                },
                {
                  "id": 24084,
                  "url": "https://api.seerapi.com/v1/skill/24084"
                },
                {
                  "id": 24087,
                  "url": "https://api.seerapi.com/v1/skill/24087"
                },
                {
                  "id": 24098,
                  "url": "https://api.seerapi.com/v1/skill/24098"
                },
                {
                  "id": 24101,
                  "url": "https://api.seerapi.com/v1/skill/24101"
                },
                {
                  "id": 24107,
                  "url": "https://api.seerapi.com/v1/skill/24107"
                },
                {
                  "id": 24114,
                  "url": "https://api.seerapi.com/v1/skill/24114"
                },
                {
                  "id": 24123,
                  "url": "https://api.seerapi.com/v1/skill/24123"
                },
                {
                  "id": 24129,
                  "url": "https://api.seerapi.com/v1/skill/24129"
                },
                {
                  "id": 24135,
                  "url": "https://api.seerapi.com/v1/skill/24135"
                },
                {
                  "id": 24141,
                  "url": "https://api.seerapi.com/v1/skill/24141"
                },
                {
                  "id": 24149,
                  "url": "https://api.seerapi.com/v1/skill/24149"
                },
                {
                  "id": 24150,
                  "url": "https://api.seerapi.com/v1/skill/24150"
                },
                {
                  "id": 24151,
                  "url": "https://api.seerapi.com/v1/skill/24151"
                },
                {
                  "id": 24152,
                  "url": "https://api.seerapi.com/v1/skill/24152"
                },
                {
                  "id": 24153,
                  "url": "https://api.seerapi.com/v1/skill/24153"
                },
                {
                  "id": 24154,
                  "url": "https://api.seerapi.com/v1/skill/24154"
                },
                {
                  "id": 24157,
                  "url": "https://api.seerapi.com/v1/skill/24157"
                },
                {
                  "id": 24159,
                  "url": "https://api.seerapi.com/v1/skill/24159"
                },
                {
                  "id": 24176,
                  "url": "https://api.seerapi.com/v1/skill/24176"
                },
                {
                  "id": 24178,
                  "url": "https://api.seerapi.com/v1/skill/24178"
                },
                {
                  "id": 24182,
                  "url": "https://api.seerapi.com/v1/skill/24182"
                },
                {
                  "id": 24186,
                  "url": "https://api.seerapi.com/v1/skill/24186"
                },
                {
                  "id": 24197,
                  "url": "https://api.seerapi.com/v1/skill/24197"
                },
                {
                  "id": 24200,
                  "url": "https://api.seerapi.com/v1/skill/24200"
                },
                {
                  "id": 24203,
                  "url": "https://api.seerapi.com/v1/skill/24203"
                },
                {
                  "id": 24205,
                  "url": "https://api.seerapi.com/v1/skill/24205"
                },
                {
                  "id": 24221,
                  "url": "https://api.seerapi.com/v1/skill/24221"
                },
                {
                  "id": 24223,
                  "url": "https://api.seerapi.com/v1/skill/24223"
                },
                {
                  "id": 24225,
                  "url": "https://api.seerapi.com/v1/skill/24225"
                },
                {
                  "id": 24239,
                  "url": "https://api.seerapi.com/v1/skill/24239"
                },
                {
                  "id": 24242,
                  "url": "https://api.seerapi.com/v1/skill/24242"
                },
                {
                  "id": 24244,
                  "url": "https://api.seerapi.com/v1/skill/24244"
                },
                {
                  "id": 24249,
                  "url": "https://api.seerapi.com/v1/skill/24249"
                },
                {
                  "id": 24254,
                  "url": "https://api.seerapi.com/v1/skill/24254"
                },
                {
                  "id": 24256,
                  "url": "https://api.seerapi.com/v1/skill/24256"
                },
                {
                  "id": 24258,
                  "url": "https://api.seerapi.com/v1/skill/24258"
                },
                {
                  "id": 24268,
                  "url": "https://api.seerapi.com/v1/skill/24268"
                },
                {
                  "id": 24279,
                  "url": "https://api.seerapi.com/v1/skill/24279"
                },
                {
                  "id": 24281,
                  "url": "https://api.seerapi.com/v1/skill/24281"
                },
                {
                  "id": 24293,
                  "url": "https://api.seerapi.com/v1/skill/24293"
                },
                {
                  "id": 24298,
                  "url": "https://api.seerapi.com/v1/skill/24298"
                },
                {
                  "id": 24309,
                  "url": "https://api.seerapi.com/v1/skill/24309"
                },
                {
                  "id": 24311,
                  "url": "https://api.seerapi.com/v1/skill/24311"
                },
                {
                  "id": 24321,
                  "url": "https://api.seerapi.com/v1/skill/24321"
                },
                {
                  "id": 24324,
                  "url": "https://api.seerapi.com/v1/skill/24324"
                },
                {
                  "id": 24341,
                  "url": "https://api.seerapi.com/v1/skill/24341"
                },
                {
                  "id": 24348,
                  "url": "https://api.seerapi.com/v1/skill/24348"
                },
                {
                  "id": 24350,
                  "url": "https://api.seerapi.com/v1/skill/24350"
                },
                {
                  "id": 24364,
                  "url": "https://api.seerapi.com/v1/skill/24364"
                },
                {
                  "id": 24367,
                  "url": "https://api.seerapi.com/v1/skill/24367"
                },
                {
                  "id": 24369,
                  "url": "https://api.seerapi.com/v1/skill/24369"
                },
                {
                  "id": 24372,
                  "url": "https://api.seerapi.com/v1/skill/24372"
                },
                {
                  "id": 24380,
                  "url": "https://api.seerapi.com/v1/skill/24380"
                },
                {
                  "id": 24393,
                  "url": "https://api.seerapi.com/v1/skill/24393"
                },
                {
                  "id": 24395,
                  "url": "https://api.seerapi.com/v1/skill/24395"
                },
                {
                  "id": 24408,
                  "url": "https://api.seerapi.com/v1/skill/24408"
                },
                {
                  "id": 24412,
                  "url": "https://api.seerapi.com/v1/skill/24412"
                },
                {
                  "id": 24415,
                  "url": "https://api.seerapi.com/v1/skill/24415"
                },
                {
                  "id": 24437,
                  "url": "https://api.seerapi.com/v1/skill/24437"
                },
                {
                  "id": 24441,
                  "url": "https://api.seerapi.com/v1/skill/24441"
                },
                {
                  "id": 24467,
                  "url": "https://api.seerapi.com/v1/skill/24467"
                },
                {
                  "id": 24511,
                  "url": "https://api.seerapi.com/v1/skill/24511"
                },
                {
                  "id": 24590,
                  "url": "https://api.seerapi.com/v1/skill/24590"
                },
                {
                  "id": 24607,
                  "url": "https://api.seerapi.com/v1/skill/24607"
                },
                {
                  "id": 24612,
                  "url": "https://api.seerapi.com/v1/skill/24612"
                },
                {
                  "id": 24648,
                  "url": "https://api.seerapi.com/v1/skill/24648"
                },
                {
                  "id": 24654,
                  "url": "https://api.seerapi.com/v1/skill/24654"
                },
                {
                  "id": 24665,
                  "url": "https://api.seerapi.com/v1/skill/24665"
                },
                {
                  "id": 24678,
                  "url": "https://api.seerapi.com/v1/skill/24678"
                },
                {
                  "id": 24723,
                  "url": "https://api.seerapi.com/v1/skill/24723"
                },
                {
                  "id": 24725,
                  "url": "https://api.seerapi.com/v1/skill/24725"
                },
                {
                  "id": 24739,
                  "url": "https://api.seerapi.com/v1/skill/24739"
                },
                {
                  "id": 24745,
                  "url": "https://api.seerapi.com/v1/skill/24745"
                },
                {
                  "id": 24759,
                  "url": "https://api.seerapi.com/v1/skill/24759"
                },
                {
                  "id": 24783,
                  "url": "https://api.seerapi.com/v1/skill/24783"
                },
                {
                  "id": 24798,
                  "url": "https://api.seerapi.com/v1/skill/24798"
                },
                {
                  "id": 24812,
                  "url": "https://api.seerapi.com/v1/skill/24812"
                },
                {
                  "id": 24827,
                  "url": "https://api.seerapi.com/v1/skill/24827"
                },
                {
                  "id": 24865,
                  "url": "https://api.seerapi.com/v1/skill/24865"
                },
                {
                  "id": 24890,
                  "url": "https://api.seerapi.com/v1/skill/24890"
                },
                {
                  "id": 24905,
                  "url": "https://api.seerapi.com/v1/skill/24905"
                },
                {
                  "id": 24916,
                  "url": "https://api.seerapi.com/v1/skill/24916"
                },
                {
                  "id": 24931,
                  "url": "https://api.seerapi.com/v1/skill/24931"
                },
                {
                  "id": 25512,
                  "url": "https://api.seerapi.com/v1/skill/25512"
                },
                {
                  "id": 26027,
                  "url": "https://api.seerapi.com/v1/skill/26027"
                },
                {
                  "id": 26446,
                  "url": "https://api.seerapi.com/v1/skill/26446"
                },
                {
                  "id": 27426,
                  "url": "https://api.seerapi.com/v1/skill/27426"
                },
                {
                  "id": 27573,
                  "url": "https://api.seerapi.com/v1/skill/27573"
                },
                {
                  "id": 28537,
                  "url": "https://api.seerapi.com/v1/skill/28537"
                },
                {
                  "id": 28689,
                  "url": "https://api.seerapi.com/v1/skill/28689"
                },
                {
                  "id": 28757,
                  "url": "https://api.seerapi.com/v1/skill/28757"
                },
                {
                  "id": 28825,
                  "url": "https://api.seerapi.com/v1/skill/28825"
                },
                {
                  "id": 28879,
                  "url": "https://api.seerapi.com/v1/skill/28879"
                },
                {
                  "id": 28924,
                  "url": "https://api.seerapi.com/v1/skill/28924"
                },
                {
                  "id": 28980,
                  "url": "https://api.seerapi.com/v1/skill/28980"
                },
                {
                  "id": 28988,
                  "url": "https://api.seerapi.com/v1/skill/28988"
                },
                {
                  "id": 29078,
                  "url": "https://api.seerapi.com/v1/skill/29078"
                },
                {
                  "id": 29099,
                  "url": "https://api.seerapi.com/v1/skill/29099"
                },
                {
                  "id": 29126,
                  "url": "https://api.seerapi.com/v1/skill/29126"
                },
                {
                  "id": 29141,
                  "url": "https://api.seerapi.com/v1/skill/29141"
                },
                {
                  "id": 29294,
                  "url": "https://api.seerapi.com/v1/skill/29294"
                },
                {
                  "id": 29375,
                  "url": "https://api.seerapi.com/v1/skill/29375"
                },
                {
                  "id": 29389,
                  "url": "https://api.seerapi.com/v1/skill/29389"
                },
                {
                  "id": 30514,
                  "url": "https://api.seerapi.com/v1/skill/30514"
                }
              ],
              "tag": [
                {
                  "id": 62114,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
                }
              ],
              "hash": "c1d2aad"
            },
            "cacheFile": "research/3667-source-check-external.json",
            "loadedAt": "2026-10-13T15:16:31.973Z",
            "storage": "existing-cache"
          }
        },
        {
          "moveId": 37540,
          "name": "无极星灵阵",
          "index": 0,
          "args": [
            3,
            30
          ],
          "description": "3回合内攻击技能附加自身当前体力30%的百分比伤害",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/37540",
            "data": {
              "id": 37540,
              "name": "无极星灵阵",
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
                  "info": "3回合内攻击技能附加自身当前体力30%的百分比伤害",
                  "analyze_info": "[sprite name=iconHit]3回合内攻击技能附加自身当前体力30%的[color=#52a5f2]百分比伤害[/color]",
                  "args": [
                    3,
                    30
                  ],
                  "effect": {
                    "id": 992,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/992"
                  }
                },
                {
                  "info": "3回合内对手主动切换精灵出战时100%瘫痪",
                  "analyze_info": "[sprite name=iconHit]3回合内对手[color=#52a5f2]主动切换[/color]精灵[color=#57c975]出战时[/color]100%[color=#57c975]瘫痪[/color]",
                  "args": [
                    3,
                    100,
                    19
                  ],
                  "effect": {
                    "id": 2040,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/2040"
                  }
                },
                {
                  "info": "每次使用则当回合造成的攻击伤害额外提升30%，最高额外提升120%",
                  "analyze_info": "[sprite name=iconHit]每次使用则[color=#52a5f2]当回合[/color]造成的攻击[color=#52a5f2]伤害额外提升[/color]30%，最高额外提升120%（boss有效）",
                  "args": [
                    30,
                    120
                  ],
                  "effect": {
                    "id": 795,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/795"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "59d2f6d3"
            },
            "loadedAt": "2026-10-26T08:09:55.376Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/992",
            "data": {
              "id": 992,
              "args_num": 2,
              "info": "{0}回合内攻击技能附加自身当前体力{1}%的百分比伤害",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]{0}回合内攻击技能附加自身当前体力{1}%的[color=#52a5f2]百分比伤害[/color]",
              "pve_effective": false,
              "param": null,
              "hash": "7b9ca4f8"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T08:09:55.391Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        }
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4633-001 · 4674新增关联

```json
{
  "id": "Q-N50-4633-001",
  "instances": [
    {
      "id": "Q-N50-4633-001",
      "gap": "803泛伤害限300是每事件或整回合额度；与护盾护罩处理先后。泛伤害类型不另造疑问，真实固定/百分/真实各300已验证",
      "relatedSources": [
        {
          "moveId": 28824,
          "name": "极星法环",
          "index": 1,
          "args": [
            50,
            19,
            2,
            3,
            300
          ],
          "description": "命中后50%令对手瘫痪，未触发则恢复自身最大体力的1/2体力且3回合内自身受到的伤害不超过300",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28824",
            "data": {
              "id": 28824,
              "name": "极星法环",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；令对手停止了；攻击变得更凌厉了",
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
                  "info": "命中后50%令对手瘫痪，未触发则恢复自身最大体力的1/2体力且3回合内自身受到的伤害不超过300",
                  "analyze_info": "[sprite name=iconHit]命中后50%令对手[color=#57c975]瘫痪[/color]，[color=#52a5f2]未触发[/color]则恢复自身最大体力的1/2体力且3回合内自身受到的伤害不超过300（boss有效）",
                  "args": [
                    50,
                    19,
                    2,
                    3,
                    300
                  ],
                  "effect": {
                    "id": 803,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/803"
                  }
                },
                {
                  "info": "下2回合造成的攻击伤害额外提升100%",
                  "analyze_info": "[sprite name=iconHit]下2回合造成的攻击[color=#52a5f2]伤害额外提升[/color]100%（boss有效）",
                  "args": [
                    2,
                    100
                  ],
                  "effect": {
                    "id": 693,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/693"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "413b9193"
            },
            "loadedAt": "2026-10-26T08:09:30.949Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/803",
            "data": {
              "id": 803,
              "args_num": 5,
              "info": "命中后{0}%令对手{1}，未触发则恢复自身最大体力的1/{2}体力且{3}回合内自身受到的伤害不超过{4}",
              "info_formatting_adjustment": "命中后{0}%令对手{1}\r\n--><condition>未触发</condition>则恢复自身最大体力的1/{2}体力且{3}回合内自身受到的伤害不超过{4}",
              "analyze_info": "[sprite name=iconHit]命中后{0}%令对手[color=#57c975]{1}[/color]，[color=#52a5f2]未触发[/color]则恢复自身最大体力的1/{2}体力且{3}回合内自身受到的伤害不超过{4}（boss有效）",
              "pve_effective": true,
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
                  "id": 18174,
                  "url": "https://api.seerapi.com/v1/skill/18174"
                },
                {
                  "id": 24303,
                  "url": "https://api.seerapi.com/v1/skill/24303"
                },
                {
                  "id": 26229,
                  "url": "https://api.seerapi.com/v1/skill/26229"
                },
                {
                  "id": 26930,
                  "url": "https://api.seerapi.com/v1/skill/26930"
                },
                {
                  "id": 27273,
                  "url": "https://api.seerapi.com/v1/skill/27273"
                },
                {
                  "id": 27706,
                  "url": "https://api.seerapi.com/v1/skill/27706"
                },
                {
                  "id": 27813,
                  "url": "https://api.seerapi.com/v1/skill/27813"
                },
                {
                  "id": 28824,
                  "url": "https://api.seerapi.com/v1/skill/28824"
                },
                {
                  "id": 28993,
                  "url": "https://api.seerapi.com/v1/skill/28993"
                },
                {
                  "id": 29047,
                  "url": "https://api.seerapi.com/v1/skill/29047"
                },
                {
                  "id": 29341,
                  "url": "https://api.seerapi.com/v1/skill/29341"
                },
                {
                  "id": 30973,
                  "url": "https://api.seerapi.com/v1/skill/30973"
                },
                {
                  "id": 32367,
                  "url": "https://api.seerapi.com/v1/skill/32367"
                },
                {
                  "id": 33999,
                  "url": "https://api.seerapi.com/v1/skill/33999"
                },
                {
                  "id": 34365,
                  "url": "https://api.seerapi.com/v1/skill/34365"
                },
                {
                  "id": 36512,
                  "url": "https://api.seerapi.com/v1/skill/36512"
                },
                {
                  "id": 37904,
                  "url": "https://api.seerapi.com/v1/skill/37904"
                },
                {
                  "id": 38226,
                  "url": "https://api.seerapi.com/v1/skill/38226"
                }
              ],
              "tag": [
                {
                  "id": 813,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
                },
                {
                  "id": 62114,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/62114"
                },
                {
                  "id": 64371,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/64371"
                }
              ],
              "hash": "adcfdf4f"
            },
            "cacheFile": "research/3945-source-check.json",
            "loadedAt": "2026-10-19T07:58:54.004Z",
            "storage": "existing-cache"
          }
        }
      ],
      "answer": ""
    }
  ]
}
```

我的回答：
