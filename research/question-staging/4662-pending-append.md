

## 4662 · 原固定第45只

49项逐审、104来源检查0；生产727/727 exit0，本只45项。全部独立工作完成，部分实现待确认；多精灵延期1项。未正式部署/验收。用户编辑期间仅暂存。

### Q-N50-4662-010

```json
{
  "id": "Q-N50-4662-010",
  "species": 4662,
  "instance": {
    "moveId": 37468,
    "hash": "46804645",
    "index": 0,
    "id": 181,
    "args": [
      60,
      0,
      20,
      100
    ],
    "description": "60%概率令对手麻痹，连续攻击每次提高20%概率，最多提高100%"
  },
  "sourceRecords": [
    {
      "url": "https://api.seerapi.com/v1/skill/37468",
      "data": {
        "id": 37468,
        "name": "雷瀑幻电",
        "power": 130,
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
          "id": 34,
          "url": "https://api.seerapi.com/v1/element_type_combination/34"
        },
        "learned_by_pet": [],
        "skill_effect": [
          {
            "info": "60%概率令对手麻痹，连续攻击每次提高20%概率，最多提高100%",
            "analyze_info": "[sprite name=iconHit]60%概率令对手[color=#57c975]麻痹[/color]，连续攻击每次提高20%概率，最多提高100%（boss有效）",
            "args": [
              60,
              0,
              20,
              100
            ],
            "effect": {
              "id": 181,
              "url": "https://api.seerapi.com/v1/skill_effect_type/181"
            }
          }
        ],
        "friend_skill_effect": [],
        "hide_effect": null,
        "advance": null,
        "hash": "46804645"
      },
      "loadedAt": "2026-10-26T07:09:05.442Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/181",
      "data": {
        "id": 181,
        "args_num": 4,
        "info": "{0}%概率令对手{1}，连续攻击每次提高{2}%概率，最多提高{3}%",
        "info_formatting_adjustment": "{0}%概率令对手{1}\r\n--><condition>连续攻击</condition>每次提高{2}%概率，最多提高{3}%",
        "analyze_info": "[sprite name=iconHit]{0}%概率令对手[color=#57c975]{1}[/color]，连续攻击每次提高{2}%概率，最多提高{3}%（boss有效）",
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
        "hash": "638b3747"
      },
      "cacheFile": "research/selected-current-batch.json",
      "storage": "existing-cache",
      "originalLoadedAt": null,
      "loadedAt": "2026-10-26T07:09:05.452Z",
      "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
    }
  ],
  "wikiPages": [
    {
      "title": "技能:37468",
      "pageid": 161093,
      "missing": false,
      "revision": 315025,
      "timestamp": "2025-10-10T06:45:02Z",
      "sourceURL": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E9%AD%82%E5%8D%B0%3A1866%7C%E7%B2%BE%E7%81%B5%3A4662%7C%E9%9B%B7%E7%80%91%E9%A3%9E%E9%9B%AA%C2%B7%E6%A1%91%E5%A4%9A%E5%A7%86%7C%E6%95%88%E6%9E%9C%3A4%7C%E6%95%88%E6%9E%9C%3A47%7C%E6%95%88%E6%9E%9C%3A948%7C%E6%95%88%E6%9E%9C%3A2189%7C%E6%95%88%E6%9E%9C%3A1483%7C%E6%95%88%E6%9E%9C%3A14%7C%E6%95%88%E6%9E%9C%3A58%7C%E6%95%88%E6%9E%9C%3A29%7C%E6%95%88%E6%9E%9C%3A1144%7C%E6%95%88%E6%9E%9C%3A181%7C%E6%95%88%E6%9E%9C%3A191%7C%E6%95%88%E6%9E%9C%3A1115%7C%E6%95%88%E6%9E%9C%3A1401%7C%E6%95%88%E6%9E%9C%3A1655%7C%E6%95%88%E6%9E%9C%3A1002%7C%E6%95%88%E6%9E%9C%3A423%7C%E6%95%88%E6%9E%9C%3A2165%7C%E6%95%88%E6%9E%9C%3A1478%7C%E6%95%88%E6%9E%9C%3A911%7C%E6%95%88%E6%9E%9C%3A717%7C%E6%95%88%E6%9E%9C%3A1204%7C%E6%95%88%E6%9E%9C%3A843%7C%E6%95%88%E6%9E%9C%3A2173%7C%E6%95%88%E6%9E%9C%3A1256%7C%E6%95%88%E6%9E%9C%3A1659%7C%E6%95%88%E6%9E%9C%3A2020%7C%E6%95%88%E6%9E%9C%3A2205%7C%E6%95%88%E6%9E%9C%3A1878%7C%E6%95%88%E6%9E%9C%3A2158%7C%E6%8A%80%E8%83%BD%3A10250%7C%E6%8A%80%E8%83%BD%3A21684%7C%E6%8A%80%E8%83%BD%3A10200%7C%E6%8A%80%E8%83%BD%3A10104%7C%E6%8A%80%E8%83%BD%3A21517%7C%E6%8A%80%E8%83%BD%3A37467%7C%E6%8A%80%E8%83%BD%3A10276%7C%E6%8A%80%E8%83%BD%3A21344%7C%E6%8A%80%E8%83%BD%3A13609%7C%E6%8A%80%E8%83%BD%3A19818%7C%E6%8A%80%E8%83%BD%3A28783%7C%E6%8A%80%E8%83%BD%3A37468%7C%E6%8A%80%E8%83%BD%3A28784",
      "sha256": "7f64e35e666a1a9b6f855251ec725396d33f194d742408ac364cd983517932fb",
      "text": "{{技能\n|技能序号=37468\n|技能名称=雷瀑幻电\n|技能类型=物理攻击\n|技能属性=电冰\n|威力=130\n|次数=10\n|先制=0\n|命中率=95%\n|暴击概率=1/16\n|效果ID=181\n|技能效果=60%概率令对手麻痹，连续攻击每次提高20%概率，最多提高100%\n}}"
    }
  ],
  "checked": [
    "181-existing-confirmation-scope.json",
    "mechanic-value-source-extract.json"
  ],
  "gap": "连续攻击是否仅相同技能连续使用，或任意攻击技能连续使用均累积。首次60%相同；先使用其它攻击再用此招，60%与80%在70%抽样值时结果实际不同。100%共同封顶不另造问题。",
  "question": "37468/181的连续攻击，是只统计连续使用本技能，还是连续使用任意攻击技能均提高本技能麻痹概率？",
  "answer": ""
}
```

明确问题：37468/181的连续攻击，是只统计连续使用本技能，还是连续使用任意攻击技能均提高本技能麻痹概率？

我的回答：

### Q-N50-4618-002 · 4662新增关联

```json
{
  "id": "Q-N50-4618-002",
  "instances": [
    {
      "id": "Q-N50-4618-002",
      "instances": [
        "soul1866",
        "37467/1483",
        "37470/1659"
      ],
      "gap": "完整攻击0时是否打出暴击/实际受到非暴；正完整结算分支照常，不扩大旧780答案",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1866",
          "data": {
            "id": 1866,
            "desc": "若当回合自身攻击打出了致命一击，则下回合攻击必定打出致命一击且回合开始时解除所处的异常状态，若当回合对手攻击未打出致命一击，则下回合开始时令对手冻伤2回合，未触发则凝滞2回合|自身使用攻击技能时，若对手处于异常状态，则本次攻击不会造成攻击伤害并在使用后附加威力值2倍的真实伤害，若对手不处于异常状态则本次攻击造成的伤害提升50%，本次攻击微弱对手时效果翻倍|（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身打出致命一击后，下回合必定<color=#64F9FA>打出致命一击</color>且回合开始<color=#64F9FA>解除</color>所处的<b>异常状态</b>\r\n<indent=16><sprite=3><indent=32>自身受到非致命一击后，则下回合开始时<color=#64F9FA>令对手冻伤</color>2回合\r\n<indent=32><sprite=4><indent=48>未触发则<color=#64F9FA>令对手凝滞</color>2回合\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能时：\r\n<indent=32><sprite=4><indent=48>若对手处于异常状态，则本次攻击不会造成攻击伤害并在使用后<color=#64F9FA>附加</color>威力值2倍的<b>真实伤害</b>\r\n<indent=32><sprite=4><indent=48>若对手不处于异常状态则本次攻击造成的<b>攻击伤害</b><color=#64F9FA>提升</color>50%，自身微弱对手时效果翻倍",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4662,
                "url": "https://api.seerapi.com/v1/pet/4662"
              }
            ],
            "effect": {
              "effect_args": [
                2,
                2,
                2,
                50,
                1
              ],
              "effect": {
                "id": 2261,
                "url": "https://api.seerapi.com/v1/eid_effect/2261"
              }
            },
            "effect_alias": "alias_2261_2_2_2_50_1",
            "tag": [
              {
                "id": 2,
                "url": "https://api.seerapi.com/v1/soulmark_tag/2"
              },
              {
                "id": 19,
                "url": "https://api.seerapi.com/v1/soulmark_tag/19"
              }
            ],
            "intensified_to": null,
            "from": null,
            "advance": null,
            "hash": "8773f24b"
          },
          "loadedAt": "2026-10-26T06:56:38.349Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/37467",
          "data": {
            "id": 37467,
            "name": "断瀑",
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "吸取对手能力提升状态，吸取成功则对手冻伤",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态（boss有效），[color=#52a5f2]吸取[/color]成功则对手[color=#57c975]冻伤[/color]",
                "args": [
                  5
                ],
                "effect": {
                  "id": 948,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/948"
                }
              },
              {
                "info": "自身的PP值总和高于对手时100%令对手冰封",
                "analyze_info": "[sprite name=iconHit]自身的PP值总和高于对手时100%令对手[color=#57c975]冰封[/color]",
                "args": [
                  100,
                  15
                ],
                "effect": {
                  "id": 2189,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2189"
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
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "c3f92a16"
          },
          "loadedAt": "2026-10-26T07:08:32.493Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1483",
          "data": {
            "id": 1483,
            "args_num": 1,
            "info": "本回合打出致命一击则令对手{0}回合属性技能无效",
            "info_formatting_adjustment": null,
            "analyze_info": "[sprite name=iconHit]本回合打出[color=#52a5f2]致命一击[/color]则令对手{0}回合属性技能无效",
            "pve_effective": false,
            "param": null,
            "skill": [
              {
                "id": 33439,
                "url": "https://api.seerapi.com/v1/skill/33439"
              },
              {
                "id": 33648,
                "url": "https://api.seerapi.com/v1/skill/33648"
              },
              {
                "id": 33760,
                "url": "https://api.seerapi.com/v1/skill/33760"
              },
              {
                "id": 33854,
                "url": "https://api.seerapi.com/v1/skill/33854"
              },
              {
                "id": 34067,
                "url": "https://api.seerapi.com/v1/skill/34067"
              },
              {
                "id": 34140,
                "url": "https://api.seerapi.com/v1/skill/34140"
              },
              {
                "id": 34197,
                "url": "https://api.seerapi.com/v1/skill/34197"
              },
              {
                "id": 34941,
                "url": "https://api.seerapi.com/v1/skill/34941"
              },
              {
                "id": 35056,
                "url": "https://api.seerapi.com/v1/skill/35056"
              },
              {
                "id": 35071,
                "url": "https://api.seerapi.com/v1/skill/35071"
              },
              {
                "id": 35517,
                "url": "https://api.seerapi.com/v1/skill/35517"
              },
              {
                "id": 35559,
                "url": "https://api.seerapi.com/v1/skill/35559"
              },
              {
                "id": 35588,
                "url": "https://api.seerapi.com/v1/skill/35588"
              },
              {
                "id": 35726,
                "url": "https://api.seerapi.com/v1/skill/35726"
              },
              {
                "id": 36727,
                "url": "https://api.seerapi.com/v1/skill/36727"
              },
              {
                "id": 37362,
                "url": "https://api.seerapi.com/v1/skill/37362"
              },
              {
                "id": 37467,
                "url": "https://api.seerapi.com/v1/skill/37467"
              },
              {
                "id": 37886,
                "url": "https://api.seerapi.com/v1/skill/37886"
              },
              {
                "id": 37898,
                "url": "https://api.seerapi.com/v1/skill/37898"
              },
              {
                "id": 38160,
                "url": "https://api.seerapi.com/v1/skill/38160"
              },
              {
                "id": 38300,
                "url": "https://api.seerapi.com/v1/skill/38300"
              },
              {
                "id": 38582,
                "url": "https://api.seerapi.com/v1/skill/38582"
              }
            ],
            "tag": [
              {
                "id": 44313,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
              }
            ],
            "hash": "88fee4b1"
          },
          "cacheFile": "research/3932-source-check.json",
          "loadedAt": "2026-10-19T03:41:51.462Z",
          "storage": "existing-cache"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/37470",
          "data": {
            "id": 37470,
            "name": "窃骨·影鸣",
            "power": 150,
            "max_pp": 5,
            "accuracy": 98,
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
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
                "info": "将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "args": [
                  2
                ],
                "effect": {
                  "id": 2173,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2173"
                }
              },
              {
                "info": "造成的伤害低于300时令对手麻痹，未触发则自身下1次攻击造成的伤害额外提升50%",
                "analyze_info": "[sprite name=iconHit]造成的伤害低于300时令对手[color=#57c975]麻痹[/color]，[color=#52a5f2]未触发[/color]则自身下1次攻击造成的[color=#52a5f2]伤害额外提升[/color]50%",
                "args": [
                  300,
                  0,
                  1,
                  50
                ],
                "effect": {
                  "id": 1256,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1256"
                }
              },
              {
                "info": "随机附加给对手200-300点固定伤害，若打出致命一击则效果转变为吸取对手300-400点体力",
                "analyze_info": "[sprite name=iconHit]随机附加给对手200-300点[color=#52a5f2]固定伤害[/color]，若打出[color=#52a5f2]致命一击[/color]则效果转变为[color=#52a5f2]吸取[/color]对手300-400点体力（boss有效）",
                "args": [
                  200,
                  300,
                  300,
                  400
                ],
                "effect": {
                  "id": 1659,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1659"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "506812be"
          },
          "loadedAt": "2026-10-26T07:09:31.696Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1659",
          "data": {
            "id": 1659,
            "args_num": 4,
            "info": "随机附加给对手{0}-{1}点固定伤害，若打出致命一击则效果转变为吸取对手{2}-{3}点体力",
            "info_formatting_adjustment": "随机附加给对手{0}-{1}点固定伤害\r\n--><condition>若打出致命一击</condition>则效果转变为吸取对手{2}-{3}点体力",
            "analyze_info": "[sprite name=iconHit]随机附加给对手{0}-{1}点[color=#52a5f2]固定伤害[/color]，若打出[color=#52a5f2]致命一击[/color]则效果转变为[color=#52a5f2]吸取[/color]对手{2}-{3}点体力（boss有效）",
            "pve_effective": true,
            "param": null,
            "skill": [
              {
                "id": 34853,
                "url": "https://api.seerapi.com/v1/skill/34853"
              },
              {
                "id": 35252,
                "url": "https://api.seerapi.com/v1/skill/35252"
              },
              {
                "id": 35464,
                "url": "https://api.seerapi.com/v1/skill/35464"
              },
              {
                "id": 36412,
                "url": "https://api.seerapi.com/v1/skill/36412"
              },
              {
                "id": 36518,
                "url": "https://api.seerapi.com/v1/skill/36518"
              },
              {
                "id": 36760,
                "url": "https://api.seerapi.com/v1/skill/36760"
              },
              {
                "id": 36861,
                "url": "https://api.seerapi.com/v1/skill/36861"
              },
              {
                "id": 37227,
                "url": "https://api.seerapi.com/v1/skill/37227"
              },
              {
                "id": 37412,
                "url": "https://api.seerapi.com/v1/skill/37412"
              },
              {
                "id": 37470,
                "url": "https://api.seerapi.com/v1/skill/37470"
              },
              {
                "id": 37773,
                "url": "https://api.seerapi.com/v1/skill/37773"
              },
              {
                "id": 37899,
                "url": "https://api.seerapi.com/v1/skill/37899"
              },
              {
                "id": 38042,
                "url": "https://api.seerapi.com/v1/skill/38042"
              },
              {
                "id": 38176,
                "url": "https://api.seerapi.com/v1/skill/38176"
              },
              {
                "id": 38327,
                "url": "https://api.seerapi.com/v1/skill/38327"
              }
            ],
            "tag": [
              {
                "id": 60828,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/60828"
              },
              {
                "id": 35850,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
              }
            ],
            "hash": "25bfb0d5"
          },
          "cacheFile": "research/4219-source-check.json",
          "loadedAt": "2026-10-20T06:03:13.391Z",
          "storage": "existing-cache"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：完整攻击0时是否打出暴击/实际受到非暴；正完整结算分支照常，不扩大旧780答案。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4604-001 · 4662新增关联

```json
{
  "id": "Q-N50-4604-001",
  "instances": [
    {
      "id": "Q-N50-4604-001",
      "instances": [
        "soul1866"
      ],
      "gap": "威力两倍真伤基数基础或实算威力仅真实不同时",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1866",
          "data": {
            "id": 1866,
            "desc": "若当回合自身攻击打出了致命一击，则下回合攻击必定打出致命一击且回合开始时解除所处的异常状态，若当回合对手攻击未打出致命一击，则下回合开始时令对手冻伤2回合，未触发则凝滞2回合|自身使用攻击技能时，若对手处于异常状态，则本次攻击不会造成攻击伤害并在使用后附加威力值2倍的真实伤害，若对手不处于异常状态则本次攻击造成的伤害提升50%，本次攻击微弱对手时效果翻倍|（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身打出致命一击后，下回合必定<color=#64F9FA>打出致命一击</color>且回合开始<color=#64F9FA>解除</color>所处的<b>异常状态</b>\r\n<indent=16><sprite=3><indent=32>自身受到非致命一击后，则下回合开始时<color=#64F9FA>令对手冻伤</color>2回合\r\n<indent=32><sprite=4><indent=48>未触发则<color=#64F9FA>令对手凝滞</color>2回合\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能时：\r\n<indent=32><sprite=4><indent=48>若对手处于异常状态，则本次攻击不会造成攻击伤害并在使用后<color=#64F9FA>附加</color>威力值2倍的<b>真实伤害</b>\r\n<indent=32><sprite=4><indent=48>若对手不处于异常状态则本次攻击造成的<b>攻击伤害</b><color=#64F9FA>提升</color>50%，自身微弱对手时效果翻倍",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4662,
                "url": "https://api.seerapi.com/v1/pet/4662"
              }
            ],
            "effect": {
              "effect_args": [
                2,
                2,
                2,
                50,
                1
              ],
              "effect": {
                "id": 2261,
                "url": "https://api.seerapi.com/v1/eid_effect/2261"
              }
            },
            "effect_alias": "alias_2261_2_2_2_50_1",
            "tag": [
              {
                "id": 2,
                "url": "https://api.seerapi.com/v1/soulmark_tag/2"
              },
              {
                "id": 19,
                "url": "https://api.seerapi.com/v1/soulmark_tag/19"
              }
            ],
            "intensified_to": null,
            "from": null,
            "advance": null,
            "hash": "8773f24b"
          },
          "loadedAt": "2026-10-26T06:56:38.349Z",
          "storage": "refreshed"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：威力两倍真伤基数基础或实算威力仅真实不同时。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4628-001 · 4662新增关联

```json
{
  "id": "Q-N50-4628-001",
  "instances": [
    {
      "id": "Q-N50-4628-001",
      "instances": [
        "28783/1144[240,360]"
      ],
      "gap": "附固定伤害并恢复等量，理论/完整/实际HP恢复基数；此文非吸取，不机械套固定吸取确认",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/skill/28783",
          "data": {
            "id": 28783,
            "name": "霜冻冰隔",
            "power": 0,
            "max_pp": 10,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": false,
            "atk_num": 1,
            "info": "恢复了一定的体力",
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
                "info": "附加240~360点固定伤害并恢复等量体力",
                "analyze_info": "[sprite name=iconHit]附加240~360点[color=#52a5f2]固定伤害[/color]并恢复等量体力（boss有效）",
                "args": [
                  240,
                  360
                ],
                "effect": {
                  "id": 1144,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1144"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "57dd290a"
          },
          "loadedAt": "2026-10-26T07:08:58.400Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1144",
          "data": {
            "id": 1144,
            "args_num": 2,
            "info": "附加{0}~{1}点固定伤害并恢复等量体力",
            "info_formatting_adjustment": null,
            "analyze_info": "[sprite name=iconHit]附加{0}~{1}点[color=#52a5f2]固定伤害[/color]并恢复等量体力（boss有效）",
            "pve_effective": true,
            "param": null,
            "hash": "284d178a"
          },
          "cacheFile": "research/selected-current-batch.json",
          "storage": "existing-cache",
          "originalLoadedAt": null,
          "loadedAt": "2026-10-26T07:08:58.405Z",
          "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：附固定伤害并恢复等量，理论/完整/实际HP恢复基数；此文非吸取，不机械套固定吸取确认。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4643-011 · 4662新增关联

```json
{
  "id": "Q-N50-4643-011",
  "instances": [
    {
      "id": "Q-N50-4643-011",
      "instances": [
        "37470/1256[300,0,1,50]"
      ],
      "gap": "本招粉白附伤与1866后附真伤能使低300红/全部结果不同",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/skill/37470",
          "data": {
            "id": 37470,
            "name": "窃骨·影鸣",
            "power": 150,
            "max_pp": 5,
            "accuracy": 98,
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
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
                "info": "将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "args": [
                  2
                ],
                "effect": {
                  "id": 2173,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2173"
                }
              },
              {
                "info": "造成的伤害低于300时令对手麻痹，未触发则自身下1次攻击造成的伤害额外提升50%",
                "analyze_info": "[sprite name=iconHit]造成的伤害低于300时令对手[color=#57c975]麻痹[/color]，[color=#52a5f2]未触发[/color]则自身下1次攻击造成的[color=#52a5f2]伤害额外提升[/color]50%",
                "args": [
                  300,
                  0,
                  1,
                  50
                ],
                "effect": {
                  "id": 1256,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1256"
                }
              },
              {
                "info": "随机附加给对手200-300点固定伤害，若打出致命一击则效果转变为吸取对手300-400点体力",
                "analyze_info": "[sprite name=iconHit]随机附加给对手200-300点[color=#52a5f2]固定伤害[/color]，若打出[color=#52a5f2]致命一击[/color]则效果转变为[color=#52a5f2]吸取[/color]对手300-400点体力（boss有效）",
                "args": [
                  200,
                  300,
                  300,
                  400
                ],
                "effect": {
                  "id": 1659,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1659"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "506812be"
          },
          "loadedAt": "2026-10-26T07:09:31.696Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1256",
          "data": {
            "id": 1256,
            "args_num": 4,
            "info": "造成的伤害低于{0}时令对手{1}，未触发则自身下{2}次攻击造成的伤害额外提升{3}%",
            "info_formatting_adjustment": "<condition>造成的攻击伤害低于{0}</condition>则对手{1}\r\n--><condition>未触发</condition>则自身下{2}次攻击技能造成的伤害额外提升{3}%",
            "analyze_info": "[sprite name=iconHit]造成的伤害低于{0}时令对手[color=#57c975]{1}[/color]，[color=#52a5f2]未触发[/color]则自身下{2}次攻击造成的[color=#52a5f2]伤害额外提升[/color]{3}%",
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
            "hash": "955ed20b"
          },
          "cacheFile": "research/selected-current-batch.json",
          "storage": "existing-cache",
          "originalLoadedAt": null,
          "loadedAt": "2026-10-26T07:09:31.710Z",
          "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：本招粉白附伤与1866后附真伤能使低300红/全部结果不同。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4633-010 · 4662新增关联

```json
{
  "id": "Q-N50-4633-010",
  "instances": [
    {
      "id": "Q-N50-4633-010",
      "instances": [
        "37469/2165[350]",
        "37470/2173[2]"
      ],
      "gap": "转移免疫/同名实际成功与原状态移除计数",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/skill/37469",
          "data": {
            "id": 37469,
            "name": "窃念·滢留",
            "power": 140,
            "max_pp": 5,
            "accuracy": 97,
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
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
                "info": "直接造成等同于对手防御值的固定伤害",
                "analyze_info": "[sprite name=iconHit]直接造成等同于对手防御值的[color=#52a5f2]固定伤害[/color]（boss有效）",
                "args": [],
                "effect": {
                  "id": 423,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/423"
                }
              },
              {
                "info": "将对手所处的异常状态转移给自身，每转移一项吸取对手350点体力",
                "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项[color=#52a5f2]吸取[/color]对手350点体力",
                "args": [
                  350
                ],
                "effect": {
                  "id": 2165,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2165"
                }
              },
              {
                "info": "下1回合令对手无法主动切换精灵",
                "analyze_info": "[sprite name=iconHit]下1回合令对手无法[color=#52a5f2]主动切换[/color]精灵",
                "args": [
                  1
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
            "hash": "b4d29fee"
          },
          "loadedAt": "2026-10-26T07:09:18.462Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/2165",
          "data": {
            "id": 2165,
            "args_num": 1,
            "info": "将对手所处的异常状态转移给自身，每转移一项吸取对手{0}点体力",
            "info_formatting_adjustment": "将对手所处的异常状态转移给自身\r\n-->每转移一项吸取对手{0}点体力",
            "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项[color=#52a5f2]吸取[/color]对手{0}点体力",
            "pve_effective": false,
            "param": null,
            "skill": [
              {
                "id": 28925,
                "url": "https://api.seerapi.com/v1/skill/28925"
              },
              {
                "id": 37300,
                "url": "https://api.seerapi.com/v1/skill/37300"
              },
              {
                "id": 37469,
                "url": "https://api.seerapi.com/v1/skill/37469"
              },
              {
                "id": 37667,
                "url": "https://api.seerapi.com/v1/skill/37667"
              },
              {
                "id": 38373,
                "url": "https://api.seerapi.com/v1/skill/38373"
              }
            ],
            "tag": [
              {
                "id": 35850,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
              }
            ],
            "hash": "33993522"
          },
          "cacheFile": "research/4633-source-check.json",
          "loadedAt": "2026-10-25T22:19:28.003Z",
          "storage": "existing-cache"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/37470",
          "data": {
            "id": 37470,
            "name": "窃骨·影鸣",
            "power": 150,
            "max_pp": 5,
            "accuracy": 98,
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
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
                "info": "将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "args": [
                  2
                ],
                "effect": {
                  "id": 2173,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2173"
                }
              },
              {
                "info": "造成的伤害低于300时令对手麻痹，未触发则自身下1次攻击造成的伤害额外提升50%",
                "analyze_info": "[sprite name=iconHit]造成的伤害低于300时令对手[color=#57c975]麻痹[/color]，[color=#52a5f2]未触发[/color]则自身下1次攻击造成的[color=#52a5f2]伤害额外提升[/color]50%",
                "args": [
                  300,
                  0,
                  1,
                  50
                ],
                "effect": {
                  "id": 1256,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1256"
                }
              },
              {
                "info": "随机附加给对手200-300点固定伤害，若打出致命一击则效果转变为吸取对手300-400点体力",
                "analyze_info": "[sprite name=iconHit]随机附加给对手200-300点[color=#52a5f2]固定伤害[/color]，若打出[color=#52a5f2]致命一击[/color]则效果转变为[color=#52a5f2]吸取[/color]对手300-400点体力（boss有效）",
                "args": [
                  200,
                  300,
                  300,
                  400
                ],
                "effect": {
                  "id": 1659,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1659"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "506812be"
          },
          "loadedAt": "2026-10-26T07:09:31.696Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/2173",
          "data": {
            "id": 2173,
            "args_num": 1,
            "info": "将对手所处的异常状态转移给自身，每转移一项令对手随机{0}项技能PP值归零",
            "info_formatting_adjustment": null,
            "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项令对手随机{0}项技能PP值归零",
            "pve_effective": false,
            "param": null,
            "skill": [
              {
                "id": 29055,
                "url": "https://api.seerapi.com/v1/skill/29055"
              },
              {
                "id": 37320,
                "url": "https://api.seerapi.com/v1/skill/37320"
              },
              {
                "id": 37470,
                "url": "https://api.seerapi.com/v1/skill/37470"
              }
            ],
            "tag": [
              {
                "id": 46440,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/46440"
              }
            ],
            "hash": "18162335"
          },
          "cacheFile": "research/4635-source-check.json",
          "loadedAt": "2026-10-25T23:24:49.651Z",
          "storage": "existing-cache"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：转移免疫/同名实际成功与原状态移除计数。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4589-002 · 4662新增关联

```json
{
  "id": "Q-N50-4589-002",
  "instances": [
    {
      "id": "Q-N50-4589-002",
      "instances": [
        "37467/948[5]"
      ],
      "gap": "吸强两端cap/禁强联动",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/skill/37467",
          "data": {
            "id": 37467,
            "name": "断瀑",
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "吸取对手能力提升状态，吸取成功则对手冻伤",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态（boss有效），[color=#52a5f2]吸取[/color]成功则对手[color=#57c975]冻伤[/color]",
                "args": [
                  5
                ],
                "effect": {
                  "id": 948,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/948"
                }
              },
              {
                "info": "自身的PP值总和高于对手时100%令对手冰封",
                "analyze_info": "[sprite name=iconHit]自身的PP值总和高于对手时100%令对手[color=#57c975]冰封[/color]",
                "args": [
                  100,
                  15
                ],
                "effect": {
                  "id": 2189,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2189"
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
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "c3f92a16"
          },
          "loadedAt": "2026-10-26T07:08:32.493Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/948",
          "data": {
            "id": 948,
            "args_num": 1,
            "info": "吸取对手能力提升状态，吸取成功则对手{0}",
            "info_formatting_adjustment": "吸取对手能力提升状态\r\n--><condition>吸取成功</condition>则对手{0}$Boss$",
            "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态（boss有效），[color=#52a5f2]吸取[/color]成功则对手[color=#57c975]{0}[/color]",
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
                "id": 19622,
                "url": "https://api.seerapi.com/v1/skill/19622"
              },
              {
                "id": 19690,
                "url": "https://api.seerapi.com/v1/skill/19690"
              },
              {
                "id": 19752,
                "url": "https://api.seerapi.com/v1/skill/19752"
              },
              {
                "id": 19797,
                "url": "https://api.seerapi.com/v1/skill/19797"
              },
              {
                "id": 19812,
                "url": "https://api.seerapi.com/v1/skill/19812"
              },
              {
                "id": 19877,
                "url": "https://api.seerapi.com/v1/skill/19877"
              },
              {
                "id": 19978,
                "url": "https://api.seerapi.com/v1/skill/19978"
              },
              {
                "id": 30281,
                "url": "https://api.seerapi.com/v1/skill/30281"
              },
              {
                "id": 30295,
                "url": "https://api.seerapi.com/v1/skill/30295"
              },
              {
                "id": 30352,
                "url": "https://api.seerapi.com/v1/skill/30352"
              },
              {
                "id": 30563,
                "url": "https://api.seerapi.com/v1/skill/30563"
              },
              {
                "id": 30658,
                "url": "https://api.seerapi.com/v1/skill/30658"
              },
              {
                "id": 30764,
                "url": "https://api.seerapi.com/v1/skill/30764"
              },
              {
                "id": 30792,
                "url": "https://api.seerapi.com/v1/skill/30792"
              },
              {
                "id": 30892,
                "url": "https://api.seerapi.com/v1/skill/30892"
              },
              {
                "id": 30899,
                "url": "https://api.seerapi.com/v1/skill/30899"
              },
              {
                "id": 30918,
                "url": "https://api.seerapi.com/v1/skill/30918"
              },
              {
                "id": 31225,
                "url": "https://api.seerapi.com/v1/skill/31225"
              },
              {
                "id": 31996,
                "url": "https://api.seerapi.com/v1/skill/31996"
              },
              {
                "id": 32539,
                "url": "https://api.seerapi.com/v1/skill/32539"
              },
              {
                "id": 33605,
                "url": "https://api.seerapi.com/v1/skill/33605"
              },
              {
                "id": 34277,
                "url": "https://api.seerapi.com/v1/skill/34277"
              },
              {
                "id": 34360,
                "url": "https://api.seerapi.com/v1/skill/34360"
              },
              {
                "id": 34890,
                "url": "https://api.seerapi.com/v1/skill/34890"
              },
              {
                "id": 36055,
                "url": "https://api.seerapi.com/v1/skill/36055"
              },
              {
                "id": 36246,
                "url": "https://api.seerapi.com/v1/skill/36246"
              },
              {
                "id": 36399,
                "url": "https://api.seerapi.com/v1/skill/36399"
              },
              {
                "id": 36489,
                "url": "https://api.seerapi.com/v1/skill/36489"
              },
              {
                "id": 37418,
                "url": "https://api.seerapi.com/v1/skill/37418"
              },
              {
                "id": 37467,
                "url": "https://api.seerapi.com/v1/skill/37467"
              },
              {
                "id": 37505,
                "url": "https://api.seerapi.com/v1/skill/37505"
              },
              {
                "id": 37839,
                "url": "https://api.seerapi.com/v1/skill/37839"
              },
              {
                "id": 37888,
                "url": "https://api.seerapi.com/v1/skill/37888"
              },
              {
                "id": 38039,
                "url": "https://api.seerapi.com/v1/skill/38039"
              },
              {
                "id": 38091,
                "url": "https://api.seerapi.com/v1/skill/38091"
              },
              {
                "id": 38187,
                "url": "https://api.seerapi.com/v1/skill/38187"
              },
              {
                "id": 38202,
                "url": "https://api.seerapi.com/v1/skill/38202"
              },
              {
                "id": 38373,
                "url": "https://api.seerapi.com/v1/skill/38373"
              },
              {
                "id": 38394,
                "url": "https://api.seerapi.com/v1/skill/38394"
              },
              {
                "id": 38505,
                "url": "https://api.seerapi.com/v1/skill/38505"
              },
              {
                "id": 38559,
                "url": "https://api.seerapi.com/v1/skill/38559"
              }
            ],
            "tag": [
              {
                "id": 3090,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/3090"
              },
              {
                "id": 813,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
              }
            ],
            "hash": "f7594b7c"
          },
          "cacheFile": "research/3631-source-check-external.json",
          "loadedAt": "2026-10-13T13:43:15.784Z",
          "storage": "existing-cache"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：吸强两端cap/禁强联动。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4625-011 · 4662新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "instances": [
        "28785/717[4,3,2]"
      ],
      "gap": "持续用招吸取首授当次使用后是否触发",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/skill/28785",
          "data": {
            "id": 28785,
            "name": "凛光迅势",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；攻击变得更加凌厉了；出手变得更快了",
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
                "info": "全属性+1，自身处于能力提升状态时强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，自身处于能力提升状态时强化效果翻倍（boss有效）",
                "args": [
                  1
                ],
                "effect": {
                  "id": 911,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/911"
                }
              },
              {
                "info": "4回合内每回合使用技能吸取对手最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                "args": [
                  4,
                  3,
                  2
                ],
                "effect": {
                  "id": 717,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/717"
                }
              },
              {
                "info": "自身下1次攻击必定致命一击",
                "analyze_info": "[sprite name=iconHit]自身下1次攻击必定[color=#52a5f2]致命一击[/color]（boss有效）",
                "args": [
                  1
                ],
                "effect": {
                  "id": 1204,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1204"
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
            "hash": "16476458"
          },
          "loadedAt": "2026-10-26T07:09:24.773Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/717",
          "data": {
            "id": 717,
            "args_num": 3,
            "info": "{0}回合内每回合使用技能吸取对手最大体力的1/{1}，恢复体力时若自身体力低于最大体力的1/{2}则恢复效果翻倍",
            "info_formatting_adjustment": "{0}回合内每回合使用技能吸取对手最大体力的1/{1}\r\n--><condition>恢复体力时若自身体力低于最大体力的1/{2}</condition>则恢复效果翻倍",
            "analyze_info": "[sprite name=iconHit]{0}回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/{1}，恢复体力时若自身体力低于最大体力的1/{2}则恢复效果翻倍",
            "pve_effective": false,
            "param": null,
            "skill": [
              {
                "id": 23870,
                "url": "https://api.seerapi.com/v1/skill/23870"
              },
              {
                "id": 24765,
                "url": "https://api.seerapi.com/v1/skill/24765"
              },
              {
                "id": 24837,
                "url": "https://api.seerapi.com/v1/skill/24837"
              },
              {
                "id": 25003,
                "url": "https://api.seerapi.com/v1/skill/25003"
              },
              {
                "id": 25970,
                "url": "https://api.seerapi.com/v1/skill/25970"
              },
              {
                "id": 26261,
                "url": "https://api.seerapi.com/v1/skill/26261"
              },
              {
                "id": 26291,
                "url": "https://api.seerapi.com/v1/skill/26291"
              },
              {
                "id": 26328,
                "url": "https://api.seerapi.com/v1/skill/26328"
              },
              {
                "id": 26355,
                "url": "https://api.seerapi.com/v1/skill/26355"
              },
              {
                "id": 26371,
                "url": "https://api.seerapi.com/v1/skill/26371"
              },
              {
                "id": 26376,
                "url": "https://api.seerapi.com/v1/skill/26376"
              },
              {
                "id": 26436,
                "url": "https://api.seerapi.com/v1/skill/26436"
              },
              {
                "id": 26472,
                "url": "https://api.seerapi.com/v1/skill/26472"
              },
              {
                "id": 26509,
                "url": "https://api.seerapi.com/v1/skill/26509"
              },
              {
                "id": 26554,
                "url": "https://api.seerapi.com/v1/skill/26554"
              },
              {
                "id": 26588,
                "url": "https://api.seerapi.com/v1/skill/26588"
              },
              {
                "id": 26606,
                "url": "https://api.seerapi.com/v1/skill/26606"
              },
              {
                "id": 26618,
                "url": "https://api.seerapi.com/v1/skill/26618"
              },
              {
                "id": 26639,
                "url": "https://api.seerapi.com/v1/skill/26639"
              },
              {
                "id": 26644,
                "url": "https://api.seerapi.com/v1/skill/26644"
              },
              {
                "id": 26658,
                "url": "https://api.seerapi.com/v1/skill/26658"
              },
              {
                "id": 26766,
                "url": "https://api.seerapi.com/v1/skill/26766"
              },
              {
                "id": 26869,
                "url": "https://api.seerapi.com/v1/skill/26869"
              },
              {
                "id": 26878,
                "url": "https://api.seerapi.com/v1/skill/26878"
              },
              {
                "id": 26918,
                "url": "https://api.seerapi.com/v1/skill/26918"
              },
              {
                "id": 27005,
                "url": "https://api.seerapi.com/v1/skill/27005"
              },
              {
                "id": 27073,
                "url": "https://api.seerapi.com/v1/skill/27073"
              },
              {
                "id": 27125,
                "url": "https://api.seerapi.com/v1/skill/27125"
              },
              {
                "id": 27178,
                "url": "https://api.seerapi.com/v1/skill/27178"
              },
              {
                "id": 27212,
                "url": "https://api.seerapi.com/v1/skill/27212"
              },
              {
                "id": 27282,
                "url": "https://api.seerapi.com/v1/skill/27282"
              },
              {
                "id": 27315,
                "url": "https://api.seerapi.com/v1/skill/27315"
              },
              {
                "id": 27347,
                "url": "https://api.seerapi.com/v1/skill/27347"
              },
              {
                "id": 27413,
                "url": "https://api.seerapi.com/v1/skill/27413"
              },
              {
                "id": 27517,
                "url": "https://api.seerapi.com/v1/skill/27517"
              },
              {
                "id": 27571,
                "url": "https://api.seerapi.com/v1/skill/27571"
              },
              {
                "id": 27661,
                "url": "https://api.seerapi.com/v1/skill/27661"
              },
              {
                "id": 27798,
                "url": "https://api.seerapi.com/v1/skill/27798"
              },
              {
                "id": 27986,
                "url": "https://api.seerapi.com/v1/skill/27986"
              },
              {
                "id": 28012,
                "url": "https://api.seerapi.com/v1/skill/28012"
              },
              {
                "id": 28088,
                "url": "https://api.seerapi.com/v1/skill/28088"
              },
              {
                "id": 28317,
                "url": "https://api.seerapi.com/v1/skill/28317"
              },
              {
                "id": 28364,
                "url": "https://api.seerapi.com/v1/skill/28364"
              },
              {
                "id": 28374,
                "url": "https://api.seerapi.com/v1/skill/28374"
              },
              {
                "id": 28407,
                "url": "https://api.seerapi.com/v1/skill/28407"
              },
              {
                "id": 28490,
                "url": "https://api.seerapi.com/v1/skill/28490"
              },
              {
                "id": 28611,
                "url": "https://api.seerapi.com/v1/skill/28611"
              },
              {
                "id": 28631,
                "url": "https://api.seerapi.com/v1/skill/28631"
              },
              {
                "id": 28680,
                "url": "https://api.seerapi.com/v1/skill/28680"
              },
              {
                "id": 28769,
                "url": "https://api.seerapi.com/v1/skill/28769"
              },
              {
                "id": 28782,
                "url": "https://api.seerapi.com/v1/skill/28782"
              },
              {
                "id": 28785,
                "url": "https://api.seerapi.com/v1/skill/28785"
              },
              {
                "id": 28811,
                "url": "https://api.seerapi.com/v1/skill/28811"
              },
              {
                "id": 29016,
                "url": "https://api.seerapi.com/v1/skill/29016"
              },
              {
                "id": 29024,
                "url": "https://api.seerapi.com/v1/skill/29024"
              },
              {
                "id": 29116,
                "url": "https://api.seerapi.com/v1/skill/29116"
              },
              {
                "id": 29133,
                "url": "https://api.seerapi.com/v1/skill/29133"
              },
              {
                "id": 29144,
                "url": "https://api.seerapi.com/v1/skill/29144"
              },
              {
                "id": 29148,
                "url": "https://api.seerapi.com/v1/skill/29148"
              },
              {
                "id": 29164,
                "url": "https://api.seerapi.com/v1/skill/29164"
              },
              {
                "id": 29185,
                "url": "https://api.seerapi.com/v1/skill/29185"
              },
              {
                "id": 29192,
                "url": "https://api.seerapi.com/v1/skill/29192"
              },
              {
                "id": 29203,
                "url": "https://api.seerapi.com/v1/skill/29203"
              },
              {
                "id": 29241,
                "url": "https://api.seerapi.com/v1/skill/29241"
              },
              {
                "id": 29248,
                "url": "https://api.seerapi.com/v1/skill/29248"
              },
              {
                "id": 29263,
                "url": "https://api.seerapi.com/v1/skill/29263"
              },
              {
                "id": 29266,
                "url": "https://api.seerapi.com/v1/skill/29266"
              },
              {
                "id": 29298,
                "url": "https://api.seerapi.com/v1/skill/29298"
              },
              {
                "id": 29327,
                "url": "https://api.seerapi.com/v1/skill/29327"
              },
              {
                "id": 29329,
                "url": "https://api.seerapi.com/v1/skill/29329"
              },
              {
                "id": 29350,
                "url": "https://api.seerapi.com/v1/skill/29350"
              },
              {
                "id": 37216,
                "url": "https://api.seerapi.com/v1/skill/37216"
              },
              {
                "id": 38321,
                "url": "https://api.seerapi.com/v1/skill/38321"
              },
              {
                "id": 38598,
                "url": "https://api.seerapi.com/v1/skill/38598"
              }
            ],
            "tag": [
              {
                "id": 35850,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
              }
            ],
            "hash": "44c7542e"
          },
          "cacheFile": "research/4510-source-check.json",
          "loadedAt": "2026-10-24T04:23:57.252Z",
          "storage": "existing-cache"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：持续用招吸取首授当次使用后是否触发。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4511-006 · 4662新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "instances": [
        "28784/191[4]",
        "28784/1115[1]",
        "28785/1204[1]",
        "37470/1256[300,0,1,50]"
      ],
      "gap": "真实混源或尚未消费的下次资源重授；不同来源未来答案不自动互扩",
      "sourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/skill/28784",
          "data": {
            "id": 28784,
            "name": "银牙斥夜",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态了；解除了自身的能力下降状态；后出手时令对手麻痹了；对手开始失去活力",
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
                "info": "解除自身能力下降状态，解除成功则令对手下1次使用的攻击技能无效",
                "analyze_info": "[sprite name=iconHit]解除自身能力下降状态（boss有效），解除成功则令对手下1次使用的攻击技能无效",
                "args": [
                  1
                ],
                "effect": {
                  "id": 1115,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1115"
                }
              },
              {
                "info": "后出手时100%令对手对手麻痹，未触发则使自身下2回合必定致命一击",
                "analyze_info": "[sprite name=iconHit]后出手时100%令对手对手[color=#57c975]麻痹[/color]，[color=#52a5f2]未触发[/color]则使自身下2回合必定[color=#52a5f2]致命一击[/color]",
                "args": [
                  100,
                  0,
                  2
                ],
                "effect": {
                  "id": 1401,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1401"
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
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "451a6ab1"
          },
          "loadedAt": "2026-10-26T07:09:11.512Z",
          "storage": "refreshed"
        },
        {
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
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28784",
          "data": {
            "id": 28784,
            "name": "银牙斥夜",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态了；解除了自身的能力下降状态；后出手时令对手麻痹了；对手开始失去活力",
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
                "info": "解除自身能力下降状态，解除成功则令对手下1次使用的攻击技能无效",
                "analyze_info": "[sprite name=iconHit]解除自身能力下降状态（boss有效），解除成功则令对手下1次使用的攻击技能无效",
                "args": [
                  1
                ],
                "effect": {
                  "id": 1115,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1115"
                }
              },
              {
                "info": "后出手时100%令对手对手麻痹，未触发则使自身下2回合必定致命一击",
                "analyze_info": "[sprite name=iconHit]后出手时100%令对手对手[color=#57c975]麻痹[/color]，[color=#52a5f2]未触发[/color]则使自身下2回合必定[color=#52a5f2]致命一击[/color]",
                "args": [
                  100,
                  0,
                  2
                ],
                "effect": {
                  "id": 1401,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1401"
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
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "451a6ab1"
          },
          "loadedAt": "2026-10-26T07:09:11.512Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1115",
          "data": {
            "id": 1115,
            "args_num": 1,
            "info": "解除自身能力下降状态，解除成功则令对手下{0}次使用的攻击技能无效",
            "info_formatting_adjustment": "解除自身能力下降状态\r\n--><condition>解除成功</condition>则令对手下{0}次使用的攻击技能无效$Boss$",
            "analyze_info": "[sprite name=iconHit]解除自身能力下降状态（boss有效），解除成功则令对手下{0}次使用的攻击技能无效",
            "pve_effective": false,
            "param": null,
            "skill": [
              {
                "id": 28435,
                "url": "https://api.seerapi.com/v1/skill/28435"
              },
              {
                "id": 28784,
                "url": "https://api.seerapi.com/v1/skill/28784"
              },
              {
                "id": 28910,
                "url": "https://api.seerapi.com/v1/skill/28910"
              },
              {
                "id": 29089,
                "url": "https://api.seerapi.com/v1/skill/29089"
              },
              {
                "id": 29321,
                "url": "https://api.seerapi.com/v1/skill/29321"
              },
              {
                "id": 30444,
                "url": "https://api.seerapi.com/v1/skill/30444"
              },
              {
                "id": 30763,
                "url": "https://api.seerapi.com/v1/skill/30763"
              },
              {
                "id": 30916,
                "url": "https://api.seerapi.com/v1/skill/30916"
              },
              {
                "id": 31368,
                "url": "https://api.seerapi.com/v1/skill/31368"
              },
              {
                "id": 31539,
                "url": "https://api.seerapi.com/v1/skill/31539"
              },
              {
                "id": 31636,
                "url": "https://api.seerapi.com/v1/skill/31636"
              },
              {
                "id": 31663,
                "url": "https://api.seerapi.com/v1/skill/31663"
              },
              {
                "id": 32051,
                "url": "https://api.seerapi.com/v1/skill/32051"
              },
              {
                "id": 33980,
                "url": "https://api.seerapi.com/v1/skill/33980"
              },
              {
                "id": 35439,
                "url": "https://api.seerapi.com/v1/skill/35439"
              },
              {
                "id": 36198,
                "url": "https://api.seerapi.com/v1/skill/36198"
              },
              {
                "id": 37004,
                "url": "https://api.seerapi.com/v1/skill/37004"
              }
            ],
            "tag": [
              {
                "id": 63137,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/63137"
              },
              {
                "id": 44313,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/44313"
              }
            ],
            "hash": "9dd1301d"
          },
          "cacheFile": "research/4553-source-check.json",
          "loadedAt": "2026-10-24T07:01:56.048Z",
          "storage": "existing-cache"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28785",
          "data": {
            "id": 28785,
            "name": "凛光迅势",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；攻击变得更加凌厉了；出手变得更快了",
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
                "info": "全属性+1，自身处于能力提升状态时强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，自身处于能力提升状态时强化效果翻倍（boss有效）",
                "args": [
                  1
                ],
                "effect": {
                  "id": 911,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/911"
                }
              },
              {
                "info": "4回合内每回合使用技能吸取对手最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/3，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                "args": [
                  4,
                  3,
                  2
                ],
                "effect": {
                  "id": 717,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/717"
                }
              },
              {
                "info": "自身下1次攻击必定致命一击",
                "analyze_info": "[sprite name=iconHit]自身下1次攻击必定[color=#52a5f2]致命一击[/color]（boss有效）",
                "args": [
                  1
                ],
                "effect": {
                  "id": 1204,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1204"
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
            "hash": "16476458"
          },
          "loadedAt": "2026-10-26T07:09:24.773Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1204",
          "data": {
            "id": 1204,
            "args_num": 1,
            "info": "自身下{0}次攻击必定致命一击",
            "info_formatting_adjustment": null,
            "analyze_info": "[sprite name=iconHit]自身下{0}次攻击必定[color=#52a5f2]致命一击[/color]（boss有效）",
            "pve_effective": true,
            "param": null,
            "skill": [
              {
                "id": 25566,
                "url": "https://api.seerapi.com/v1/skill/25566"
              },
              {
                "id": 25882,
                "url": "https://api.seerapi.com/v1/skill/25882"
              },
              {
                "id": 27394,
                "url": "https://api.seerapi.com/v1/skill/27394"
              },
              {
                "id": 27959,
                "url": "https://api.seerapi.com/v1/skill/27959"
              },
              {
                "id": 27978,
                "url": "https://api.seerapi.com/v1/skill/27978"
              },
              {
                "id": 28279,
                "url": "https://api.seerapi.com/v1/skill/28279"
              },
              {
                "id": 28331,
                "url": "https://api.seerapi.com/v1/skill/28331"
              },
              {
                "id": 28367,
                "url": "https://api.seerapi.com/v1/skill/28367"
              },
              {
                "id": 28550,
                "url": "https://api.seerapi.com/v1/skill/28550"
              },
              {
                "id": 28619,
                "url": "https://api.seerapi.com/v1/skill/28619"
              },
              {
                "id": 28634,
                "url": "https://api.seerapi.com/v1/skill/28634"
              },
              {
                "id": 28657,
                "url": "https://api.seerapi.com/v1/skill/28657"
              },
              {
                "id": 28744,
                "url": "https://api.seerapi.com/v1/skill/28744"
              },
              {
                "id": 28785,
                "url": "https://api.seerapi.com/v1/skill/28785"
              },
              {
                "id": 28868,
                "url": "https://api.seerapi.com/v1/skill/28868"
              },
              {
                "id": 29027,
                "url": "https://api.seerapi.com/v1/skill/29027"
              },
              {
                "id": 29326,
                "url": "https://api.seerapi.com/v1/skill/29326"
              },
              {
                "id": 31312,
                "url": "https://api.seerapi.com/v1/skill/31312"
              },
              {
                "id": 36084,
                "url": "https://api.seerapi.com/v1/skill/36084"
              },
              {
                "id": 36706,
                "url": "https://api.seerapi.com/v1/skill/36706"
              },
              {
                "id": 37416,
                "url": "https://api.seerapi.com/v1/skill/37416"
              },
              {
                "id": 38030,
                "url": "https://api.seerapi.com/v1/skill/38030"
              },
              {
                "id": 38209,
                "url": "https://api.seerapi.com/v1/skill/38209"
              }
            ],
            "tag": [
              {
                "id": 8553,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/8553"
              }
            ],
            "hash": "fdfa4f7c"
          },
          "cacheFile": "research/4147-source-check.json",
          "loadedAt": "2026-10-19T21:58:48.803Z",
          "storage": "existing-cache"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/37470",
          "data": {
            "id": 37470,
            "name": "窃骨·影鸣",
            "power": 150,
            "max_pp": 5,
            "accuracy": 98,
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
              "id": 34,
              "url": "https://api.seerapi.com/v1/element_type_combination/34"
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
                "info": "将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "analyze_info": "[sprite name=iconHit]将对手所处的异常状态转移给自身，每转移一项令对手随机2项技能PP值归零",
                "args": [
                  2
                ],
                "effect": {
                  "id": 2173,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2173"
                }
              },
              {
                "info": "造成的伤害低于300时令对手麻痹，未触发则自身下1次攻击造成的伤害额外提升50%",
                "analyze_info": "[sprite name=iconHit]造成的伤害低于300时令对手[color=#57c975]麻痹[/color]，[color=#52a5f2]未触发[/color]则自身下1次攻击造成的[color=#52a5f2]伤害额外提升[/color]50%",
                "args": [
                  300,
                  0,
                  1,
                  50
                ],
                "effect": {
                  "id": 1256,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1256"
                }
              },
              {
                "info": "随机附加给对手200-300点固定伤害，若打出致命一击则效果转变为吸取对手300-400点体力",
                "analyze_info": "[sprite name=iconHit]随机附加给对手200-300点[color=#52a5f2]固定伤害[/color]，若打出[color=#52a5f2]致命一击[/color]则效果转变为[color=#52a5f2]吸取[/color]对手300-400点体力（boss有效）",
                "args": [
                  200,
                  300,
                  300,
                  400
                ],
                "effect": {
                  "id": 1659,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1659"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "506812be"
          },
          "loadedAt": "2026-10-26T07:09:31.696Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/1256",
          "data": {
            "id": 1256,
            "args_num": 4,
            "info": "造成的伤害低于{0}时令对手{1}，未触发则自身下{2}次攻击造成的伤害额外提升{3}%",
            "info_formatting_adjustment": "<condition>造成的攻击伤害低于{0}</condition>则对手{1}\r\n--><condition>未触发</condition>则自身下{2}次攻击技能造成的伤害额外提升{3}%",
            "analyze_info": "[sprite name=iconHit]造成的伤害低于{0}时令对手[color=#57c975]{1}[/color]，[color=#52a5f2]未触发[/color]则自身下{2}次攻击造成的[color=#52a5f2]伤害额外提升[/color]{3}%",
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
            "hash": "955ed20b"
          },
          "cacheFile": "research/selected-current-batch.json",
          "storage": "existing-cache",
          "originalLoadedAt": null,
          "loadedAt": "2026-10-26T07:09:31.710Z",
          "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
        }
      ],
      "checked": [
        "confirmation-scope-audit.preliminary.json",
        "181-existing-confirmation-scope.json",
        "SOURCE-SCOPE-NOTES.json"
      ],
      "question": "请按该精确新实例说明：真实混源或尚未消费的下次资源重授；不同来源未来答案不自动互扩。",
      "answer": ""
    }
  ]
}
```

我的回答：
