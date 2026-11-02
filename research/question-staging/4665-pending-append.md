

## 4665 · 原固定第47只

49项逐审、104来源检查0；生产278/278 exit0，本只52项。全部独立工作完成，部分实现待确认；多精灵延期0项。未正式部署/验收。用户编辑期间仅暂存。

### Q-N50-4665-001

```json
{
  "id": "Q-N50-4665-001",
  "species": 4665,
  "version": "6b41a90d",
  "effectInstance": "魂印1868/eid2264；关联4663技能1120",
  "fullDescription": "自身造成的攻击伤害低于300时，对手2回合内属性技能无效，自身造成的攻击伤害高于300时，2回合内自身免疫对手的攻击|回合开始，若对手上回合使用的技能无效，则为自身附加狂暴；自身处于狂暴状态时造成的攻击伤害提升50%|（boss无效）",
  "fullFormattedDescription": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身造成的攻击伤害低于300时，对手2回合内<b>属性技能<color=#64F9FA></b>无效</color>\r\n<indent=16><sprite=3><indent=32>自身造成的攻击伤害高于300时，2回合内自身<color=#64F9FA>免疫</color>对手的<b>攻击</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手上回合使用的技能无效，则为自身附加狂暴\r\n<indent=32><sprite=4><sprite=4><indent=64>自身处于狂暴状态时造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
  "args": [
    300,
    2,
    300,
    2,
    1
  ],
  "sources": [
    {
      "url": "https://api.seerapi.com/v1/soulmark/1868",
      "data": {
        "id": 1868,
        "desc": "自身造成的攻击伤害低于300时，对手2回合内属性技能无效，自身造成的攻击伤害高于300时，2回合内自身免疫对手的攻击|回合开始，若对手上回合使用的技能无效，则为自身附加狂暴；自身处于狂暴状态时造成的攻击伤害提升50%|（boss无效）",
        "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身造成的攻击伤害低于300时，对手2回合内<b>属性技能<color=#64F9FA></b>无效</color>\r\n<indent=16><sprite=3><indent=32>自身造成的攻击伤害高于300时，2回合内自身<color=#64F9FA>免疫</color>对手的<b>攻击</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手上回合使用的技能无效，则为自身附加狂暴\r\n<indent=32><sprite=4><sprite=4><indent=64>自身处于狂暴状态时造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
        "analyze_desc": "",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4665,
            "url": "https://api.seerapi.com/v1/pet/4665"
          }
        ],
        "effect": {
          "effect_args": [
            300,
            2,
            300,
            2,
            1
          ],
          "effect": {
            "id": 2264,
            "url": "https://api.seerapi.com/v1/eid_effect/2264"
          }
        },
        "effect_alias": "alias_2264_300_2_300_2_1",
        "tag": [
          {
            "id": 2,
            "url": "https://api.seerapi.com/v1/soulmark_tag/2"
          },
          {
            "id": 14,
            "url": "https://api.seerapi.com/v1/soulmark_tag/14"
          }
        ],
        "intensified_to": null,
        "from": null,
        "advance": null,
        "hash": "6b41a90d"
      },
      "loadedAt": "2026-10-26T07:54:54.812Z",
      "storage": "refreshed"
    }
  ],
  "checked": [
    "SeerAPI原文、格式化原文、eid2264和缓存Wiki补充未说明完整0伤阈值",
    "Q-DAMAGE-001规定零结算不触发正伤害事件，但未直接定义低于阈值分支",
    "不扩大3847魂印1120特定回复确认到技能效果1120；两者编号域不同"
  ],
  "gap": "完整结算0是否算造成攻击伤害低于300；另关联护盾吸尽而技能载荷有效的技能1120",
  "difference": "0伤后封对手属性2回合或不封；4663对应授300护盾或不授",
  "question": "完整结算攻击伤害为0时，1868的低于300分支是否触发；同样是否适用于护盾吸尽后仍允许执行的技能1120低于300分支？",
  "answer": ""
}
```

明确问题：完整结算攻击伤害为0时，1868的低于300分支是否触发；同样是否适用于护盾吸尽后仍允许执行的技能1120低于300分支？

我的回答：

### Q-N50-4514-001 · 4665新增关联

```json
{
  "id": "Q-N50-4514-001",
  "instances": [
    {
      "id": "Q-N50-4514-001",
      "gap": "魂1868上轮技能无效的范围，MISS/失明/强制MISS/命中效果失效/免攻是否计入；护盾吸尽但载荷有效已明确区别",
      "relatedSources": [],
      "sources": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1868",
          "data": {
            "id": 1868,
            "desc": "自身造成的攻击伤害低于300时，对手2回合内属性技能无效，自身造成的攻击伤害高于300时，2回合内自身免疫对手的攻击|回合开始，若对手上回合使用的技能无效，则为自身附加狂暴；自身处于狂暴状态时造成的攻击伤害提升50%|（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>自身造成的攻击伤害低于300时，对手2回合内<b>属性技能<color=#64F9FA></b>无效</color>\r\n<indent=16><sprite=3><indent=32>自身造成的攻击伤害高于300时，2回合内自身<color=#64F9FA>免疫</color>对手的<b>攻击</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若对手上回合使用的技能无效，则为自身附加狂暴\r\n<indent=32><sprite=4><sprite=4><indent=64>自身处于狂暴状态时造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4665,
                "url": "https://api.seerapi.com/v1/pet/4665"
              }
            ],
            "effect": {
              "effect_args": [
                300,
                2,
                300,
                2,
                1
              ],
              "effect": {
                "id": 2264,
                "url": "https://api.seerapi.com/v1/eid_effect/2264"
              }
            },
            "effect_alias": "alias_2264_300_2_300_2_1",
            "tag": [
              {
                "id": 2,
                "url": "https://api.seerapi.com/v1/soulmark_tag/2"
              },
              {
                "id": 14,
                "url": "https://api.seerapi.com/v1/soulmark_tag/14"
              }
            ],
            "intensified_to": null,
            "from": null,
            "advance": null,
            "hash": "6b41a90d"
          },
          "loadedAt": "2026-10-26T07:54:54.812Z",
          "storage": "refreshed"
        }
      ],
      "checked": [
        "现有冻结公共问题及确认范围；没有把代码行为视为答案",
        "本次SeerAPI+Wiki缓存，研究模型仅证明实际差异"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4511-006 · 4665新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "gap": "反转授免异尚未消费再授、除狂暴免异反弹与其他免异资源并存的消费关系",
      "relatedSources": [
        {
          "moveId": 28790,
          "name": "天道复苏",
          "index": 0,
          "args": [
            1
          ],
          "description": "反转自身能力下降状态，反转成功则自身免疫下1次受到的异常状态",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28790",
            "data": {
              "id": 28790,
              "name": "天道复苏",
              "power": 0,
              "max_pp": 10,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "反转了自身的能力下降状态",
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
                  "info": "反转自身能力下降状态，反转成功则自身免疫下1次受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]反转自身能力下降状态，反转成功则自身免疫下1次受到的异常状态（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 1221,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1221"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "b8a55591"
            },
            "loadedAt": "2026-10-26T07:55:35.417Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1221",
            "data": {
              "id": 1221,
              "args_num": 1,
              "info": "反转自身能力下降状态，反转成功则自身免疫下{0}次受到的异常状态",
              "info_formatting_adjustment": "反转自身能力下降状态\r\n--><condition>反转成功</condition>则自身免疫下{0}次受到的异常状态",
              "analyze_info": "[sprite name=iconHit]反转自身能力下降状态，反转成功则自身免疫下{0}次受到的异常状态（boss有效）",
              "pve_effective": true,
              "param": null,
              "hash": "ff7ec3df"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:55:35.430Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        },
        {
          "moveId": 28791,
          "name": "新生烙印",
          "index": 0,
          "args": [
            4,
            14
          ],
          "description": "4回合内免疫并反弹除狂暴外所有受到的异常状态",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28791",
            "data": {
              "id": 28791,
              "name": "新生烙印",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；获得了护盾、护罩；为对手的属性技能附加了限制",
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
                  "info": "4回合内免疫并反弹除狂暴外所有受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]除[color=#57c975]狂暴[/color]外所有受到的异常状态",
                  "args": [
                    4,
                    14
                  ],
                  "effect": {
                    "id": 1932,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1932"
                  }
                },
                {
                  "info": "为自身附加300点护盾",
                  "analyze_info": "[sprite name=iconHit]为自身附加300点[color=#57c975]护盾[/color]（boss有效）",
                  "args": [
                    300
                  ],
                  "effect": {
                    "id": 847,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/847"
                  }
                },
                {
                  "info": "为自身附加300点护罩",
                  "analyze_info": "[sprite name=iconHit]为自身附加300点[color=#57c975]护罩[/color]（boss有效）",
                  "args": [
                    300
                  ],
                  "effect": {
                    "id": 1342,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1342"
                  }
                },
                {
                  "info": "3回合内若对手成功使用属性技能则受到300点固定伤害",
                  "analyze_info": "[sprite name=iconHit]3回合内若对手成功使用属性技能则受到300点[color=#52a5f2]固定伤害[/color]（boss有效）",
                  "args": [
                    3,
                    300
                  ],
                  "effect": {
                    "id": 526,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/526"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "cbda5605"
            },
            "loadedAt": "2026-10-26T07:55:48.257Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1932",
            "data": {
              "id": 1932,
              "args_num": 2,
              "info": "{0}回合内免疫并反弹除{1}外所有受到的异常状态",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]{0}回合内免疫并[color=#52a5f2]反弹[/color]除[color=#57c975]{1}[/color]外所有受到的异常状态",
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
                  "id": 28249,
                  "url": "https://api.seerapi.com/v1/skill/28249"
                },
                {
                  "id": 28337,
                  "url": "https://api.seerapi.com/v1/skill/28337"
                },
                {
                  "id": 28653,
                  "url": "https://api.seerapi.com/v1/skill/28653"
                },
                {
                  "id": 28791,
                  "url": "https://api.seerapi.com/v1/skill/28791"
                },
                {
                  "id": 29000,
                  "url": "https://api.seerapi.com/v1/skill/29000"
                },
                {
                  "id": 29094,
                  "url": "https://api.seerapi.com/v1/skill/29094"
                },
                {
                  "id": 29143,
                  "url": "https://api.seerapi.com/v1/skill/29143"
                },
                {
                  "id": 29147,
                  "url": "https://api.seerapi.com/v1/skill/29147"
                },
                {
                  "id": 29165,
                  "url": "https://api.seerapi.com/v1/skill/29165"
                },
                {
                  "id": 29171,
                  "url": "https://api.seerapi.com/v1/skill/29171"
                },
                {
                  "id": 29179,
                  "url": "https://api.seerapi.com/v1/skill/29179"
                },
                {
                  "id": 29188,
                  "url": "https://api.seerapi.com/v1/skill/29188"
                },
                {
                  "id": 29221,
                  "url": "https://api.seerapi.com/v1/skill/29221"
                },
                {
                  "id": 29247,
                  "url": "https://api.seerapi.com/v1/skill/29247"
                },
                {
                  "id": 29378,
                  "url": "https://api.seerapi.com/v1/skill/29378"
                },
                {
                  "id": 29448,
                  "url": "https://api.seerapi.com/v1/skill/29448"
                }
              ],
              "tag": [
                {
                  "id": 34256,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/34256"
                }
              ],
              "hash": "b17912dc"
            },
            "cacheFile": "research/4516-source-check.json",
            "loadedAt": "2026-10-24T05:14:59.276Z",
            "storage": "existing-cache"
          }
        }
      ],
      "sources": [],
      "checked": [
        "现有冻结公共问题及确认范围；没有把代码行为视为答案",
        "本次SeerAPI+Wiki缓存，研究模型仅证明实际差异"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4600-005 · 4665新增关联

```json
{
  "id": "Q-N50-4600-005",
  "instances": [
    {
      "id": "Q-N50-4600-005",
      "gap": "已有护盾/护罩再获得300时的合并方式",
      "relatedSources": [
        {
          "moveId": 28791,
          "name": "新生烙印",
          "index": 1,
          "args": [
            300
          ],
          "description": "为自身附加300点护盾",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28791",
            "data": {
              "id": 28791,
              "name": "新生烙印",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；获得了护盾、护罩；为对手的属性技能附加了限制",
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
                  "info": "4回合内免疫并反弹除狂暴外所有受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]除[color=#57c975]狂暴[/color]外所有受到的异常状态",
                  "args": [
                    4,
                    14
                  ],
                  "effect": {
                    "id": 1932,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1932"
                  }
                },
                {
                  "info": "为自身附加300点护盾",
                  "analyze_info": "[sprite name=iconHit]为自身附加300点[color=#57c975]护盾[/color]（boss有效）",
                  "args": [
                    300
                  ],
                  "effect": {
                    "id": 847,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/847"
                  }
                },
                {
                  "info": "为自身附加300点护罩",
                  "analyze_info": "[sprite name=iconHit]为自身附加300点[color=#57c975]护罩[/color]（boss有效）",
                  "args": [
                    300
                  ],
                  "effect": {
                    "id": 1342,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1342"
                  }
                },
                {
                  "info": "3回合内若对手成功使用属性技能则受到300点固定伤害",
                  "analyze_info": "[sprite name=iconHit]3回合内若对手成功使用属性技能则受到300点[color=#52a5f2]固定伤害[/color]（boss有效）",
                  "args": [
                    3,
                    300
                  ],
                  "effect": {
                    "id": 526,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/526"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "cbda5605"
            },
            "loadedAt": "2026-10-26T07:55:48.257Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/847",
            "data": {
              "id": 847,
              "args_num": 1,
              "info": "为自身附加{0}点护盾",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]为自身附加{0}点[color=#57c975]护盾[/color]（boss有效）",
              "pve_effective": true,
              "param": null,
              "skill": [
                {
                  "id": 18361,
                  "url": "https://api.seerapi.com/v1/skill/18361"
                },
                {
                  "id": 19446,
                  "url": "https://api.seerapi.com/v1/skill/19446"
                },
                {
                  "id": 25164,
                  "url": "https://api.seerapi.com/v1/skill/25164"
                },
                {
                  "id": 25355,
                  "url": "https://api.seerapi.com/v1/skill/25355"
                },
                {
                  "id": 25542,
                  "url": "https://api.seerapi.com/v1/skill/25542"
                },
                {
                  "id": 25835,
                  "url": "https://api.seerapi.com/v1/skill/25835"
                },
                {
                  "id": 25881,
                  "url": "https://api.seerapi.com/v1/skill/25881"
                },
                {
                  "id": 26379,
                  "url": "https://api.seerapi.com/v1/skill/26379"
                },
                {
                  "id": 26523,
                  "url": "https://api.seerapi.com/v1/skill/26523"
                },
                {
                  "id": 26732,
                  "url": "https://api.seerapi.com/v1/skill/26732"
                },
                {
                  "id": 26823,
                  "url": "https://api.seerapi.com/v1/skill/26823"
                },
                {
                  "id": 27019,
                  "url": "https://api.seerapi.com/v1/skill/27019"
                },
                {
                  "id": 27033,
                  "url": "https://api.seerapi.com/v1/skill/27033"
                },
                {
                  "id": 27054,
                  "url": "https://api.seerapi.com/v1/skill/27054"
                },
                {
                  "id": 27056,
                  "url": "https://api.seerapi.com/v1/skill/27056"
                },
                {
                  "id": 27218,
                  "url": "https://api.seerapi.com/v1/skill/27218"
                },
                {
                  "id": 27331,
                  "url": "https://api.seerapi.com/v1/skill/27331"
                },
                {
                  "id": 27436,
                  "url": "https://api.seerapi.com/v1/skill/27436"
                },
                {
                  "id": 28051,
                  "url": "https://api.seerapi.com/v1/skill/28051"
                },
                {
                  "id": 28159,
                  "url": "https://api.seerapi.com/v1/skill/28159"
                },
                {
                  "id": 28284,
                  "url": "https://api.seerapi.com/v1/skill/28284"
                },
                {
                  "id": 28302,
                  "url": "https://api.seerapi.com/v1/skill/28302"
                },
                {
                  "id": 28418,
                  "url": "https://api.seerapi.com/v1/skill/28418"
                },
                {
                  "id": 28639,
                  "url": "https://api.seerapi.com/v1/skill/28639"
                },
                {
                  "id": 28774,
                  "url": "https://api.seerapi.com/v1/skill/28774"
                },
                {
                  "id": 28791,
                  "url": "https://api.seerapi.com/v1/skill/28791"
                },
                {
                  "id": 28897,
                  "url": "https://api.seerapi.com/v1/skill/28897"
                },
                {
                  "id": 28927,
                  "url": "https://api.seerapi.com/v1/skill/28927"
                },
                {
                  "id": 29109,
                  "url": "https://api.seerapi.com/v1/skill/29109"
                },
                {
                  "id": 29225,
                  "url": "https://api.seerapi.com/v1/skill/29225"
                },
                {
                  "id": 29308,
                  "url": "https://api.seerapi.com/v1/skill/29308"
                },
                {
                  "id": 29364,
                  "url": "https://api.seerapi.com/v1/skill/29364"
                },
                {
                  "id": 29365,
                  "url": "https://api.seerapi.com/v1/skill/29365"
                },
                {
                  "id": 29478,
                  "url": "https://api.seerapi.com/v1/skill/29478"
                },
                {
                  "id": 30075,
                  "url": "https://api.seerapi.com/v1/skill/30075"
                },
                {
                  "id": 35713,
                  "url": "https://api.seerapi.com/v1/skill/35713"
                },
                {
                  "id": 36128,
                  "url": "https://api.seerapi.com/v1/skill/36128"
                },
                {
                  "id": 36674,
                  "url": "https://api.seerapi.com/v1/skill/36674"
                },
                {
                  "id": 37139,
                  "url": "https://api.seerapi.com/v1/skill/37139"
                },
                {
                  "id": 37322,
                  "url": "https://api.seerapi.com/v1/skill/37322"
                },
                {
                  "id": 37432,
                  "url": "https://api.seerapi.com/v1/skill/37432"
                },
                {
                  "id": 37787,
                  "url": "https://api.seerapi.com/v1/skill/37787"
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
                  "id": 38214,
                  "url": "https://api.seerapi.com/v1/skill/38214"
                },
                {
                  "id": 38253,
                  "url": "https://api.seerapi.com/v1/skill/38253"
                }
              ],
              "tag": [
                {
                  "id": 40695,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/40695"
                }
              ],
              "hash": "11270ab4"
            },
            "cacheFile": "research/4657-source-check.json",
            "loadedAt": "2026-10-26T04:40:51.868Z",
            "storage": "existing-cache"
          }
        },
        {
          "moveId": 28791,
          "name": "新生烙印",
          "index": 2,
          "args": [
            300
          ],
          "description": "为自身附加300点护罩",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28791",
            "data": {
              "id": 28791,
              "name": "新生烙印",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；获得了护盾、护罩；为对手的属性技能附加了限制",
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
                  "info": "4回合内免疫并反弹除狂暴外所有受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]4回合内免疫并[color=#52a5f2]反弹[/color]除[color=#57c975]狂暴[/color]外所有受到的异常状态",
                  "args": [
                    4,
                    14
                  ],
                  "effect": {
                    "id": 1932,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1932"
                  }
                },
                {
                  "info": "为自身附加300点护盾",
                  "analyze_info": "[sprite name=iconHit]为自身附加300点[color=#57c975]护盾[/color]（boss有效）",
                  "args": [
                    300
                  ],
                  "effect": {
                    "id": 847,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/847"
                  }
                },
                {
                  "info": "为自身附加300点护罩",
                  "analyze_info": "[sprite name=iconHit]为自身附加300点[color=#57c975]护罩[/color]（boss有效）",
                  "args": [
                    300
                  ],
                  "effect": {
                    "id": 1342,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1342"
                  }
                },
                {
                  "info": "3回合内若对手成功使用属性技能则受到300点固定伤害",
                  "analyze_info": "[sprite name=iconHit]3回合内若对手成功使用属性技能则受到300点[color=#52a5f2]固定伤害[/color]（boss有效）",
                  "args": [
                    3,
                    300
                  ],
                  "effect": {
                    "id": 526,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/526"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "cbda5605"
            },
            "loadedAt": "2026-10-26T07:55:48.257Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1342",
            "data": {
              "id": 1342,
              "args_num": 1,
              "info": "为自身附加{0}点护罩",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]为自身附加{0}点[color=#57c975]护罩[/color]（boss有效）",
              "pve_effective": true,
              "param": null,
              "skill": [
                {
                  "id": 26732,
                  "url": "https://api.seerapi.com/v1/skill/26732"
                },
                {
                  "id": 27218,
                  "url": "https://api.seerapi.com/v1/skill/27218"
                },
                {
                  "id": 27331,
                  "url": "https://api.seerapi.com/v1/skill/27331"
                },
                {
                  "id": 27636,
                  "url": "https://api.seerapi.com/v1/skill/27636"
                },
                {
                  "id": 28051,
                  "url": "https://api.seerapi.com/v1/skill/28051"
                },
                {
                  "id": 28284,
                  "url": "https://api.seerapi.com/v1/skill/28284"
                },
                {
                  "id": 28302,
                  "url": "https://api.seerapi.com/v1/skill/28302"
                },
                {
                  "id": 28398,
                  "url": "https://api.seerapi.com/v1/skill/28398"
                },
                {
                  "id": 28418,
                  "url": "https://api.seerapi.com/v1/skill/28418"
                },
                {
                  "id": 28791,
                  "url": "https://api.seerapi.com/v1/skill/28791"
                },
                {
                  "id": 28927,
                  "url": "https://api.seerapi.com/v1/skill/28927"
                },
                {
                  "id": 29109,
                  "url": "https://api.seerapi.com/v1/skill/29109"
                },
                {
                  "id": 29225,
                  "url": "https://api.seerapi.com/v1/skill/29225"
                },
                {
                  "id": 29364,
                  "url": "https://api.seerapi.com/v1/skill/29364"
                },
                {
                  "id": 32042,
                  "url": "https://api.seerapi.com/v1/skill/32042"
                },
                {
                  "id": 35713,
                  "url": "https://api.seerapi.com/v1/skill/35713"
                },
                {
                  "id": 36128,
                  "url": "https://api.seerapi.com/v1/skill/36128"
                },
                {
                  "id": 37322,
                  "url": "https://api.seerapi.com/v1/skill/37322"
                },
                {
                  "id": 37432,
                  "url": "https://api.seerapi.com/v1/skill/37432"
                },
                {
                  "id": 37787,
                  "url": "https://api.seerapi.com/v1/skill/37787"
                },
                {
                  "id": 37969,
                  "url": "https://api.seerapi.com/v1/skill/37969"
                }
              ],
              "tag": [
                {
                  "id": 61613,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/61613"
                }
              ],
              "hash": "67e307de"
            },
            "cacheFile": "research/4657-source-check.json",
            "loadedAt": "2026-10-26T04:40:58.305Z",
            "storage": "existing-cache"
          }
        }
      ],
      "sources": [],
      "checked": [
        "现有冻结公共问题及确认范围；没有把代码行为视为答案",
        "本次SeerAPI+Wiki缓存，研究模型仅证明实际差异"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4625-011 · 4665新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "gap": "持续每回合用招回复是否包含授予当次",
      "relatedSources": [
        {
          "moveId": 28792,
          "name": "终末神湮",
          "index": 1,
          "args": [
            4,
            3,
            2
          ],
          "description": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28792",
            "data": {
              "id": 28792,
              "name": "终末神湮",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "全属性提升了；开始恢复体力并附加百分比伤害了；出手变得更快了",
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
                  "info": "全属性+1，50%概率强化效果翻倍，未触发则吸取对手能力提升状态",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，50%概率强化效果翻倍，[color=#52a5f2]未触发[/color]则[color=#52a5f2]吸取[/color]对手能力提升状态（boss有效）",
                  "args": [
                    1,
                    50
                  ],
                  "effect": {
                    "id": 1302,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1302"
                  }
                },
                {
                  "info": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                  "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能恢复自身最大体力的1/3并造成等量[color=#52a5f2]百分比伤害[/color]，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                  "args": [
                    4,
                    3,
                    2
                  ],
                  "effect": {
                    "id": 1875,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1875"
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
              "hash": "4e34669a"
            },
            "loadedAt": "2026-10-26T07:56:01.504Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
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
          }
        }
      ],
      "sources": [],
      "checked": [
        "现有冻结公共问题及确认范围；没有把代码行为视为答案",
        "本次SeerAPI+Wiki缓存，研究模型仅证明实际差异"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N20-4503-002 · 4665新增关联

```json
{
  "id": "Q-N20-4503-002",
  "instances": [
    {
      "id": "Q-N20-4503-002",
      "gap": "先回复再等量粉伤在禁疗/溢出时取请求量或实际回复量；不扩大反方向附伤后等量回复全局确认",
      "relatedSources": [
        {
          "moveId": 28792,
          "name": "终末神湮",
          "index": 1,
          "args": [
            4,
            3,
            2
          ],
          "description": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28792",
            "data": {
              "id": 28792,
              "name": "终末神湮",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "全属性提升了；开始恢复体力并附加百分比伤害了；出手变得更快了",
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
                  "info": "全属性+1，50%概率强化效果翻倍，未触发则吸取对手能力提升状态",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，50%概率强化效果翻倍，[color=#52a5f2]未触发[/color]则[color=#52a5f2]吸取[/color]对手能力提升状态（boss有效）",
                  "args": [
                    1,
                    50
                  ],
                  "effect": {
                    "id": 1302,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1302"
                  }
                },
                {
                  "info": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                  "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能恢复自身最大体力的1/3并造成等量[color=#52a5f2]百分比伤害[/color]，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                  "args": [
                    4,
                    3,
                    2
                  ],
                  "effect": {
                    "id": 1875,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1875"
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
              "hash": "4e34669a"
            },
            "loadedAt": "2026-10-26T07:56:01.504Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
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
          }
        },
        {
          "moveId": 37483,
          "name": "生死盘灵",
          "index": 2,
          "args": [
            2,
            2
          ],
          "description": "自身体力低于1/2时，恢复自身最大体力的1/2并造成等量百分比伤害",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/37483",
            "data": {
              "id": 37483,
              "name": "生死盘灵",
              "power": 150,
              "max_pp": 5,
              "accuracy": 97,
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
                "id": 69,
                "url": "https://api.seerapi.com/v1/element_type_combination/69"
              },
              "learned_by_pet": [],
              "skill_effect": [
                {
                  "info": "连续使用时先制+1",
                  "analyze_info": "[sprite name=iconInherent]连续使用时[color=#52a5f2]先制[/color]+1",
                  "args": [],
                  "effect": {
                    "id": 1080,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1080"
                  }
                },
                {
                  "info": "自身体力高于1/2时，附加自身当前体力30%的百分比伤害",
                  "analyze_info": "[sprite name=iconHit]自身体力高于1/2时，附加自身当前体力30%的[color=#52a5f2]百分比伤害[/color]",
                  "args": [
                    2,
                    30
                  ],
                  "effect": {
                    "id": 996,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/996"
                  }
                },
                {
                  "info": "自身体力低于1/2时，恢复自身最大体力的1/2并造成等量百分比伤害",
                  "analyze_info": "[sprite name=iconHit]自身体力低于1/2时，恢复自身最大体力的1/2并造成等量[color=#52a5f2]百分比伤害[/color]",
                  "args": [
                    2,
                    2
                  ],
                  "effect": {
                    "id": 997,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/997"
                  }
                },
                {
                  "info": "击败对手则100%令自身狂暴",
                  "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则100%令自身[color=#57c975]狂暴[/color]",
                  "args": [
                    100,
                    14
                  ],
                  "effect": {
                    "id": 1933,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1933"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "fd29ea0b"
            },
            "loadedAt": "2026-10-26T07:56:07.657Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/997",
            "data": {
              "id": 997,
              "args_num": 2,
              "info": "自身体力低于1/{0}时，恢复自身最大体力的1/{1}并造成等量百分比伤害",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]自身体力低于1/{0}时，恢复自身最大体力的1/{1}并造成等量[color=#52a5f2]百分比伤害[/color]",
              "pve_effective": false,
              "param": null,
              "skill": [
                {
                  "id": 19784,
                  "url": "https://api.seerapi.com/v1/skill/19784"
                },
                {
                  "id": 28468,
                  "url": "https://api.seerapi.com/v1/skill/28468"
                },
                {
                  "id": 31068,
                  "url": "https://api.seerapi.com/v1/skill/31068"
                },
                {
                  "id": 31714,
                  "url": "https://api.seerapi.com/v1/skill/31714"
                },
                {
                  "id": 31952,
                  "url": "https://api.seerapi.com/v1/skill/31952"
                },
                {
                  "id": 32435,
                  "url": "https://api.seerapi.com/v1/skill/32435"
                },
                {
                  "id": 32599,
                  "url": "https://api.seerapi.com/v1/skill/32599"
                },
                {
                  "id": 33223,
                  "url": "https://api.seerapi.com/v1/skill/33223"
                },
                {
                  "id": 37245,
                  "url": "https://api.seerapi.com/v1/skill/37245"
                },
                {
                  "id": 37483,
                  "url": "https://api.seerapi.com/v1/skill/37483"
                },
                {
                  "id": 37729,
                  "url": "https://api.seerapi.com/v1/skill/37729"
                },
                {
                  "id": 37836,
                  "url": "https://api.seerapi.com/v1/skill/37836"
                },
                {
                  "id": 38429,
                  "url": "https://api.seerapi.com/v1/skill/38429"
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
              "hash": "6dfab861"
            },
            "loadedAt": "2026-10-26T07:56:13.662Z",
            "storage": "refreshed"
          }
        }
      ],
      "sources": [],
      "checked": [
        "现有冻结公共问题及确认范围；没有把代码行为视为答案",
        "本次SeerAPI+Wiki缓存，研究模型仅证明实际差异"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4589-004 · 4665新增关联

```json
{
  "id": "Q-N50-4589-004",
  "instances": [
    {
      "id": "Q-N50-4589-004",
      "gap": "1875持续载荷在1933后击败时是否承接当前招击败奖励",
      "relatedSources": [
        {
          "moveId": 28792,
          "name": "终末神湮",
          "index": 1,
          "args": [
            4,
            3,
            2
          ],
          "description": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/28792",
            "data": {
              "id": 28792,
              "name": "终末神湮",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "全属性提升了；开始恢复体力并附加百分比伤害了；出手变得更快了",
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
                  "info": "全属性+1，50%概率强化效果翻倍，未触发则吸取对手能力提升状态",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，50%概率强化效果翻倍，[color=#52a5f2]未触发[/color]则[color=#52a5f2]吸取[/color]对手能力提升状态（boss有效）",
                  "args": [
                    1,
                    50
                  ],
                  "effect": {
                    "id": 1302,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1302"
                  }
                },
                {
                  "info": "4回合内每回合使用技能恢复自身最大体力的1/3并造成等量百分比伤害，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                  "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能恢复自身最大体力的1/3并造成等量[color=#52a5f2]百分比伤害[/color]，恢复体力时若自身体力低于最大体力的1/2则恢复效果翻倍",
                  "args": [
                    4,
                    3,
                    2
                  ],
                  "effect": {
                    "id": 1875,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1875"
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
              "hash": "4e34669a"
            },
            "loadedAt": "2026-10-26T07:56:01.504Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
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
          }
        },
        {
          "moveId": 37483,
          "name": "生死盘灵",
          "index": 3,
          "args": [
            100,
            14
          ],
          "description": "击败对手则100%令自身狂暴",
          "fullSource": {
            "url": "https://api.seerapi.com/v1/skill/37483",
            "data": {
              "id": 37483,
              "name": "生死盘灵",
              "power": 150,
              "max_pp": 5,
              "accuracy": 97,
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
                "id": 69,
                "url": "https://api.seerapi.com/v1/element_type_combination/69"
              },
              "learned_by_pet": [],
              "skill_effect": [
                {
                  "info": "连续使用时先制+1",
                  "analyze_info": "[sprite name=iconInherent]连续使用时[color=#52a5f2]先制[/color]+1",
                  "args": [],
                  "effect": {
                    "id": 1080,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1080"
                  }
                },
                {
                  "info": "自身体力高于1/2时，附加自身当前体力30%的百分比伤害",
                  "analyze_info": "[sprite name=iconHit]自身体力高于1/2时，附加自身当前体力30%的[color=#52a5f2]百分比伤害[/color]",
                  "args": [
                    2,
                    30
                  ],
                  "effect": {
                    "id": 996,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/996"
                  }
                },
                {
                  "info": "自身体力低于1/2时，恢复自身最大体力的1/2并造成等量百分比伤害",
                  "analyze_info": "[sprite name=iconHit]自身体力低于1/2时，恢复自身最大体力的1/2并造成等量[color=#52a5f2]百分比伤害[/color]",
                  "args": [
                    2,
                    2
                  ],
                  "effect": {
                    "id": 997,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/997"
                  }
                },
                {
                  "info": "击败对手则100%令自身狂暴",
                  "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则100%令自身[color=#57c975]狂暴[/color]",
                  "args": [
                    100,
                    14
                  ],
                  "effect": {
                    "id": 1933,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1933"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "fd29ea0b"
            },
            "loadedAt": "2026-10-26T07:56:07.657Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1933",
            "data": {
              "id": 1933,
              "args_num": 2,
              "info": "击败对手则{0}%令自身{1}",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则{0}%令自身[color=#57c975]{1}[/color]",
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
                  "id": 36476,
                  "url": "https://api.seerapi.com/v1/skill/36476"
                },
                {
                  "id": 36628,
                  "url": "https://api.seerapi.com/v1/skill/36628"
                },
                {
                  "id": 37039,
                  "url": "https://api.seerapi.com/v1/skill/37039"
                },
                {
                  "id": 37483,
                  "url": "https://api.seerapi.com/v1/skill/37483"
                },
                {
                  "id": 37665,
                  "url": "https://api.seerapi.com/v1/skill/37665"
                },
                {
                  "id": 37969,
                  "url": "https://api.seerapi.com/v1/skill/37969"
                },
                {
                  "id": 38022,
                  "url": "https://api.seerapi.com/v1/skill/38022"
                },
                {
                  "id": 38035,
                  "url": "https://api.seerapi.com/v1/skill/38035"
                },
                {
                  "id": 38377,
                  "url": "https://api.seerapi.com/v1/skill/38377"
                }
              ],
              "tag": [
                {
                  "id": 813,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/813"
                }
              ],
              "hash": "d2d2edd9"
            },
            "cacheFile": "research/4511-source-check.json",
            "loadedAt": "2026-10-24T04:33:33.798Z",
            "storage": "existing-cache"
          }
        }
      ],
      "sources": [],
      "checked": [
        "现有冻结公共问题及确认范围；没有把代码行为视为答案",
        "本次SeerAPI+Wiki缓存，研究模型仅证明实际差异"
      ],
      "answer": ""
    }
  ]
}
```

我的回答：
