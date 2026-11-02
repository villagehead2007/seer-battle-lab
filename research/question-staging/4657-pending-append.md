

## 4657 浮掠双刃·卓尔布 · 原固定第42只审核与问题

50项逐审、108来源检查0错误。生产定向451/451 exit0，本只81（59技能、22魂印携带版本），其余370。不是完整npm或正式验收。4个新问题与公共关联待确认，1项真实再次登场分支延期；所有独立工作完成。用户编辑期间本节仅暂存，不读写原MD、不处理新答案。

### Q-N50-4657-001

```json
{
  "id": "Q-N50-4657-001",
  "sources": [
    {
      "speciesId": 4657,
      "version": "original",
      "skill": {
        "url": "https://api.seerapi.com/v1/skill/28764",
        "data": {
          "id": 28764,
          "name": "月轮·极阴",
          "power": 0,
          "max_pp": 0,
          "accuracy": 0,
          "crit_rate": null,
          "priority": 0,
          "must_hit": false,
          "atk_num": 1,
          "info": null,
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
              "info": "携带此技能时，霜浮之刃触发概率提升50%，灼掠之刃触发概率减少50%",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，霜浮之刃触发概率提升50%，灼掠之刃触发概率减少50%",
              "args": [
                2
              ],
              "effect": {
                "id": 2190,
                "url": "https://api.seerapi.com/v1/skill_effect_type/2190"
              }
            }
          ],
          "friend_skill_effect": [],
          "hide_effect": null,
          "advance": null,
          "hash": "fd6c5917"
        },
        "loadedAt": "2026-10-26T04:39:23.912Z",
        "storage": "refreshed"
      },
      "soul": {
        "url": "https://api.seerapi.com/v1/soulmark/1859",
        "data": {
          "id": 1859,
          "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
          "analyze_desc": "",
          "pve_effective": false,
          "intensified": false,
          "is_adv": false,
          "pet": [
            {
              "id": 4657,
              "url": "https://api.seerapi.com/v1/pet/4657"
            }
          ],
          "effect": {
            "effect_args": [
              50,
              100,
              50,
              50,
              100,
              50,
              1
            ],
            "effect": {
              "id": 2254,
              "url": "https://api.seerapi.com/v1/eid_effect/2254"
            }
          },
          "effect_alias": "alias_2254_50_100_50_50_100_50_1",
          "tag": [
            {
              "id": 3,
              "url": "https://api.seerapi.com/v1/soulmark_tag/3"
            },
            {
              "id": 11,
              "url": "https://api.seerapi.com/v1/soulmark_tag/11"
            }
          ],
          "intensified_to": null,
          "from": null,
          "advance": null,
          "hash": "9482d536"
        },
        "loadedAt": "2026-10-26T04:37:41.613Z",
        "storage": "refreshed"
      },
      "effect": {
        "url": "https://api.seerapi.com/v1/skill_effect_type/2190",
        "data": {
          "id": 2190,
          "args_num": 1,
          "info": "{0}",
          "info_formatting_adjustment": null,
          "analyze_info": "[sprite name=iconInherent]{0}",
          "pve_effective": true,
          "param": [
            {
              "position": 0,
              "param": {
                "id": 26,
                "url": "https://api.seerapi.com/v1/skill_effect_param/26"
              }
            }
          ],
          "skill": [
            {
              "id": 28745,
              "url": "https://api.seerapi.com/v1/skill/28745"
            },
            {
              "id": 28764,
              "url": "https://api.seerapi.com/v1/skill/28764"
            },
            {
              "id": 28780,
              "url": "https://api.seerapi.com/v1/skill/28780"
            },
            {
              "id": 28781,
              "url": "https://api.seerapi.com/v1/skill/28781"
            },
            {
              "id": 29133,
              "url": "https://api.seerapi.com/v1/skill/29133"
            },
            {
              "id": 29134,
              "url": "https://api.seerapi.com/v1/skill/29134"
            },
            {
              "id": 29211,
              "url": "https://api.seerapi.com/v1/skill/29211"
            },
            {
              "id": 29245,
              "url": "https://api.seerapi.com/v1/skill/29245"
            },
            {
              "id": 37429,
              "url": "https://api.seerapi.com/v1/skill/37429"
            },
            {
              "id": 37458,
              "url": "https://api.seerapi.com/v1/skill/37458"
            },
            {
              "id": 37459,
              "url": "https://api.seerapi.com/v1/skill/37459"
            },
            {
              "id": 38064,
              "url": "https://api.seerapi.com/v1/skill/38064"
            },
            {
              "id": 38186,
              "url": "https://api.seerapi.com/v1/skill/38186"
            }
          ],
          "tag": [],
          "hash": "69b9259b"
        },
        "loadedAt": "2026-10-26T04:39:30.481Z",
        "storage": "refreshed"
      },
      "instances": [
        {
          "info": "携带此技能时，霜浮之刃触发概率提升50%，灼掠之刃触发概率减少50%",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，霜浮之刃触发概率提升50%，灼掠之刃触发概率减少50%",
          "args": [
            2
          ],
          "effect": {
            "id": 2190,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2190"
          }
        }
      ]
    },
    {
      "speciesId": 4657,
      "version": "original",
      "skill": {
        "url": "https://api.seerapi.com/v1/skill/37429",
        "data": {
          "id": 37429,
          "name": "日轮·极阳",
          "power": 0,
          "max_pp": 0,
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
            "id": 3,
            "url": "https://api.seerapi.com/v1/element_type_combination/3"
          },
          "learned_by_pet": [],
          "skill_effect": [
            {
              "info": "携带此技能时，灼掠之刃触发概率提升50%，霜浮之刃触发概率减少50%",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，灼掠之刃触发概率提升50%，霜浮之刃触发概率减少50%",
              "args": [
                1
              ],
              "effect": {
                "id": 2190,
                "url": "https://api.seerapi.com/v1/skill_effect_type/2190"
              }
            }
          ],
          "friend_skill_effect": [],
          "hide_effect": null,
          "advance": null,
          "hash": "2e648f3c"
        },
        "loadedAt": "2026-10-26T04:39:36.539Z",
        "storage": "refreshed"
      },
      "soul": {
        "url": "https://api.seerapi.com/v1/soulmark/1859",
        "data": {
          "id": 1859,
          "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
          "analyze_desc": "",
          "pve_effective": false,
          "intensified": false,
          "is_adv": false,
          "pet": [
            {
              "id": 4657,
              "url": "https://api.seerapi.com/v1/pet/4657"
            }
          ],
          "effect": {
            "effect_args": [
              50,
              100,
              50,
              50,
              100,
              50,
              1
            ],
            "effect": {
              "id": 2254,
              "url": "https://api.seerapi.com/v1/eid_effect/2254"
            }
          },
          "effect_alias": "alias_2254_50_100_50_50_100_50_1",
          "tag": [
            {
              "id": 3,
              "url": "https://api.seerapi.com/v1/soulmark_tag/3"
            },
            {
              "id": 11,
              "url": "https://api.seerapi.com/v1/soulmark_tag/11"
            }
          ],
          "intensified_to": null,
          "from": null,
          "advance": null,
          "hash": "9482d536"
        },
        "loadedAt": "2026-10-26T04:37:41.613Z",
        "storage": "refreshed"
      },
      "effect": {
        "url": "https://api.seerapi.com/v1/skill_effect_type/2190",
        "data": {
          "id": 2190,
          "args_num": 1,
          "info": "{0}",
          "info_formatting_adjustment": null,
          "analyze_info": "[sprite name=iconInherent]{0}",
          "pve_effective": true,
          "param": [
            {
              "position": 0,
              "param": {
                "id": 26,
                "url": "https://api.seerapi.com/v1/skill_effect_param/26"
              }
            }
          ],
          "skill": [
            {
              "id": 28745,
              "url": "https://api.seerapi.com/v1/skill/28745"
            },
            {
              "id": 28764,
              "url": "https://api.seerapi.com/v1/skill/28764"
            },
            {
              "id": 28780,
              "url": "https://api.seerapi.com/v1/skill/28780"
            },
            {
              "id": 28781,
              "url": "https://api.seerapi.com/v1/skill/28781"
            },
            {
              "id": 29133,
              "url": "https://api.seerapi.com/v1/skill/29133"
            },
            {
              "id": 29134,
              "url": "https://api.seerapi.com/v1/skill/29134"
            },
            {
              "id": 29211,
              "url": "https://api.seerapi.com/v1/skill/29211"
            },
            {
              "id": 29245,
              "url": "https://api.seerapi.com/v1/skill/29245"
            },
            {
              "id": 37429,
              "url": "https://api.seerapi.com/v1/skill/37429"
            },
            {
              "id": 37458,
              "url": "https://api.seerapi.com/v1/skill/37458"
            },
            {
              "id": 37459,
              "url": "https://api.seerapi.com/v1/skill/37459"
            },
            {
              "id": 38064,
              "url": "https://api.seerapi.com/v1/skill/38064"
            },
            {
              "id": 38186,
              "url": "https://api.seerapi.com/v1/skill/38186"
            }
          ],
          "tag": [],
          "hash": "69b9259b"
        },
        "loadedAt": "2026-10-26T04:39:30.481Z",
        "storage": "refreshed"
      },
      "instances": [
        {
          "info": "携带此技能时，灼掠之刃触发概率提升50%，霜浮之刃触发概率减少50%",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，灼掠之刃触发概率提升50%，霜浮之刃触发概率减少50%",
          "args": [
            1
          ],
          "effect": {
            "id": 2190,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2190"
          }
        }
      ]
    },
    {
      "speciesId": 4657,
      "version": "partner",
      "skill": {
        "url": "https://api.seerapi.com/v1/skill/38296",
        "data": {
          "id": 38296,
          "name": "日月轮·着天",
          "power": 160,
          "max_pp": 2,
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
            "id": 86,
            "url": "https://api.seerapi.com/v1/element_type_combination/86"
          },
          "learned_by_pet": [],
          "skill_effect": [
            {
              "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
              "args": [],
              "effect": {
                "id": 2424,
                "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
              }
            },
            {
              "info": "无视伤害限制效果",
              "analyze_info": "[sprite name=iconInherent]无视伤害限制效果（boss有效）",
              "args": [],
              "effect": {
                "id": 697,
                "url": "https://api.seerapi.com/v1/skill_effect_type/697"
              }
            },
            {
              "info": "2回合内对手恢复体力时恢复效果减少50%",
              "analyze_info": "[sprite name=iconHit]2回合内对手恢复体力时恢复效果减少50%（boss有效）",
              "args": [
                2,
                50
              ],
              "effect": {
                "id": 761,
                "url": "https://api.seerapi.com/v1/skill_effect_type/761"
              }
            }
          ],
          "friend_skill_effect": [],
          "hide_effect": null,
          "advance": null,
          "hash": "ccf63b08"
        },
        "loadedAt": "2026-10-26T04:41:04.746Z",
        "storage": "refreshed"
      },
      "soul": {
        "url": "https://api.seerapi.com/v1/soulmark/1859",
        "data": {
          "id": 1859,
          "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
          "analyze_desc": "",
          "pve_effective": false,
          "intensified": false,
          "is_adv": false,
          "pet": [
            {
              "id": 4657,
              "url": "https://api.seerapi.com/v1/pet/4657"
            }
          ],
          "effect": {
            "effect_args": [
              50,
              100,
              50,
              50,
              100,
              50,
              1
            ],
            "effect": {
              "id": 2254,
              "url": "https://api.seerapi.com/v1/eid_effect/2254"
            }
          },
          "effect_alias": "alias_2254_50_100_50_50_100_50_1",
          "tag": [
            {
              "id": 3,
              "url": "https://api.seerapi.com/v1/soulmark_tag/3"
            },
            {
              "id": 11,
              "url": "https://api.seerapi.com/v1/soulmark_tag/11"
            }
          ],
          "intensified_to": null,
          "from": null,
          "advance": null,
          "hash": "9482d536"
        },
        "loadedAt": "2026-10-26T04:37:41.613Z",
        "storage": "refreshed"
      },
      "effect": {
        "url": "https://api.seerapi.com/v1/skill_effect_type/2424",
        "data": {
          "id": 2424,
          "args_num": 0,
          "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "info_formatting_adjustment": "携带此技能时：\r\n-->自身触发霜浮之刃与灼掠之刃的概率提升50%\r\n-->每回合开始时减少自身体力上限的1%并获得等量的护盾、护罩，可叠加，然后己方获得等量的暖雪",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
          "pve_effective": false,
          "param": null,
          "skill": [
            {
              "id": 38296,
              "url": "https://api.seerapi.com/v1/skill/38296"
            }
          ],
          "tag": [
            {
              "id": 40695,
              "url": "https://api.seerapi.com/v1/skill_effect_type_tag/40695"
            },
            {
              "id": 61613,
              "url": "https://api.seerapi.com/v1/skill_effect_type_tag/61613"
            }
          ],
          "hash": "2255679f"
        },
        "loadedAt": "2026-10-26T04:41:11.090Z",
        "storage": "refreshed"
      },
      "instances": [
        {
          "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
          "args": [],
          "effect": {
            "id": 2424,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
          }
        }
      ]
    }
  ],
  "checked": {
    "primary": "research/4657-source-check.json",
    "supplement": "research/4657-source-supplement-audit.json",
    "definitions": "research/4657-cached-status-definition-extract.json",
    "parameter": "research/4657-extra-parameter-source.json",
    "frozenProbability": [
      "research/DEPLOY-3940-4068-USER-CONFIRMATIONS.json#confirmations[14]",
      "research/Q-R3940-4001-001-4058-user-confirmation.json"
    ],
    "frozenCost": "research/4394-user-confirmed-rules.json",
    "scope": "4001/4058 probability and 4394/764 cost answers only cover their listed sources, no global extension to 4657"
  },
  "gap": "提升/减少50%未定义百分点或相对乘法；两个携带与伙伴同时装备时的叠加、截断次序未说明",
  "difference": "裸50%；只携日轮火刃可100%或75%，双日月可50%或37.5%，再加伙伴可能100%或56.25%；影响实际异常及当轮红增减触发",
  "question": "这三处50%概率增减应如何计算，日轮、月轮与伙伴同时携带时如何叠加并限制到0–100%？",
  "answer": ""
}
```

明确问题：这三处50%概率增减应如何计算，日轮、月轮与伙伴同时携带时如何叠加并限制到0–100%？

我的回答：

### Q-N50-4657-002

```json
{
  "id": "Q-N50-4657-002",
  "sources": [
    {
      "speciesId": 4657,
      "version": "partner",
      "skill": {
        "url": "https://api.seerapi.com/v1/skill/38296",
        "data": {
          "id": 38296,
          "name": "日月轮·着天",
          "power": 160,
          "max_pp": 2,
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
            "id": 86,
            "url": "https://api.seerapi.com/v1/element_type_combination/86"
          },
          "learned_by_pet": [],
          "skill_effect": [
            {
              "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
              "args": [],
              "effect": {
                "id": 2424,
                "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
              }
            },
            {
              "info": "无视伤害限制效果",
              "analyze_info": "[sprite name=iconInherent]无视伤害限制效果（boss有效）",
              "args": [],
              "effect": {
                "id": 697,
                "url": "https://api.seerapi.com/v1/skill_effect_type/697"
              }
            },
            {
              "info": "2回合内对手恢复体力时恢复效果减少50%",
              "analyze_info": "[sprite name=iconHit]2回合内对手恢复体力时恢复效果减少50%（boss有效）",
              "args": [
                2,
                50
              ],
              "effect": {
                "id": 761,
                "url": "https://api.seerapi.com/v1/skill_effect_type/761"
              }
            }
          ],
          "friend_skill_effect": [],
          "hide_effect": null,
          "advance": null,
          "hash": "ccf63b08"
        },
        "loadedAt": "2026-10-26T04:41:04.746Z",
        "storage": "refreshed"
      },
      "soul": {
        "url": "https://api.seerapi.com/v1/soulmark/1859",
        "data": {
          "id": 1859,
          "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
          "analyze_desc": "",
          "pve_effective": false,
          "intensified": false,
          "is_adv": false,
          "pet": [
            {
              "id": 4657,
              "url": "https://api.seerapi.com/v1/pet/4657"
            }
          ],
          "effect": {
            "effect_args": [
              50,
              100,
              50,
              50,
              100,
              50,
              1
            ],
            "effect": {
              "id": 2254,
              "url": "https://api.seerapi.com/v1/eid_effect/2254"
            }
          },
          "effect_alias": "alias_2254_50_100_50_50_100_50_1",
          "tag": [
            {
              "id": 3,
              "url": "https://api.seerapi.com/v1/soulmark_tag/3"
            },
            {
              "id": 11,
              "url": "https://api.seerapi.com/v1/soulmark_tag/11"
            }
          ],
          "intensified_to": null,
          "from": null,
          "advance": null,
          "hash": "9482d536"
        },
        "loadedAt": "2026-10-26T04:37:41.613Z",
        "storage": "refreshed"
      },
      "effect": {
        "url": "https://api.seerapi.com/v1/skill_effect_type/2424",
        "data": {
          "id": 2424,
          "args_num": 0,
          "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "info_formatting_adjustment": "携带此技能时：\r\n-->自身触发霜浮之刃与灼掠之刃的概率提升50%\r\n-->每回合开始时减少自身体力上限的1%并获得等量的护盾、护罩，可叠加，然后己方获得等量的暖雪",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
          "pve_effective": false,
          "param": null,
          "skill": [
            {
              "id": 38296,
              "url": "https://api.seerapi.com/v1/skill/38296"
            }
          ],
          "tag": [
            {
              "id": 40695,
              "url": "https://api.seerapi.com/v1/skill_effect_type_tag/40695"
            },
            {
              "id": 61613,
              "url": "https://api.seerapi.com/v1/skill_effect_type_tag/61613"
            }
          ],
          "hash": "2255679f"
        },
        "loadedAt": "2026-10-26T04:41:11.090Z",
        "storage": "refreshed"
      },
      "instances": [
        {
          "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
          "args": [],
          "effect": {
            "id": 2424,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
          }
        }
      ]
    }
  ],
  "checked": {
    "primary": "research/4657-source-check.json",
    "supplement": "research/4657-source-supplement-audit.json",
    "definitions": "research/4657-cached-status-definition-extract.json",
    "parameter": "research/4657-extra-parameter-source.json",
    "frozenProbability": [
      "research/DEPLOY-3940-4068-USER-CONFIRMATIONS.json#confirmations[14]",
      "research/Q-R3940-4001-001-4058-user-confirmation.json"
    ],
    "frozenCost": "research/4394-user-confirmed-rules.json",
    "scope": "4001/4058 probability and 4394/764 cost answers only cover their listed sources, no global extension to 4657"
  },
  "gap": "减少自身体力上限的1%是否降低maxHP或减少当前HP、后者的伤害/体力损失类型、名义量与实际量不同的等量授予基数未明；API原文与格式化顺序均原样保留",
  "difference": "maxHP9000/HP5000首轮可max8910/HP5000或max9000/HP4910；若百分伤免疫，实际自耗0而名义90，盾罩/暖雪是否仍各90影响资源",
  "question": "2424的1%是降低体力上限还是扣当前体力；若扣当前体力按什么类型结算，盾罩和暖雪按名义1%还是实际减少量获得？",
  "answer": ""
}
```

明确问题：2424的1%是降低体力上限还是扣当前体力；若扣当前体力按什么类型结算，盾罩和暖雪按名义1%还是实际减少量获得？

我的回答：

### Q-N50-4657-003

```json
{
  "id": "Q-N50-4657-003",
  "sources": [
    {
      "speciesId": 4657,
      "version": "partner",
      "skill": {
        "url": "https://api.seerapi.com/v1/skill/38296",
        "data": {
          "id": 38296,
          "name": "日月轮·着天",
          "power": 160,
          "max_pp": 2,
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
            "id": 86,
            "url": "https://api.seerapi.com/v1/element_type_combination/86"
          },
          "learned_by_pet": [],
          "skill_effect": [
            {
              "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
              "args": [],
              "effect": {
                "id": 2424,
                "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
              }
            },
            {
              "info": "无视伤害限制效果",
              "analyze_info": "[sprite name=iconInherent]无视伤害限制效果（boss有效）",
              "args": [],
              "effect": {
                "id": 697,
                "url": "https://api.seerapi.com/v1/skill_effect_type/697"
              }
            },
            {
              "info": "2回合内对手恢复体力时恢复效果减少50%",
              "analyze_info": "[sprite name=iconHit]2回合内对手恢复体力时恢复效果减少50%（boss有效）",
              "args": [
                2,
                50
              ],
              "effect": {
                "id": 761,
                "url": "https://api.seerapi.com/v1/skill_effect_type/761"
              }
            }
          ],
          "friend_skill_effect": [],
          "hide_effect": null,
          "advance": null,
          "hash": "ccf63b08"
        },
        "loadedAt": "2026-10-26T04:41:04.746Z",
        "storage": "refreshed"
      },
      "soul": {
        "url": "https://api.seerapi.com/v1/soulmark/1859",
        "data": {
          "id": 1859,
          "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
          "analyze_desc": "",
          "pve_effective": false,
          "intensified": false,
          "is_adv": false,
          "pet": [
            {
              "id": 4657,
              "url": "https://api.seerapi.com/v1/pet/4657"
            }
          ],
          "effect": {
            "effect_args": [
              50,
              100,
              50,
              50,
              100,
              50,
              1
            ],
            "effect": {
              "id": 2254,
              "url": "https://api.seerapi.com/v1/eid_effect/2254"
            }
          },
          "effect_alias": "alias_2254_50_100_50_50_100_50_1",
          "tag": [
            {
              "id": 3,
              "url": "https://api.seerapi.com/v1/soulmark_tag/3"
            },
            {
              "id": 11,
              "url": "https://api.seerapi.com/v1/soulmark_tag/11"
            }
          ],
          "intensified_to": null,
          "from": null,
          "advance": null,
          "hash": "9482d536"
        },
        "loadedAt": "2026-10-26T04:37:41.613Z",
        "storage": "refreshed"
      },
      "effect": {
        "url": "https://api.seerapi.com/v1/skill_effect_type/2424",
        "data": {
          "id": 2424,
          "args_num": 0,
          "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "info_formatting_adjustment": "携带此技能时：\r\n-->自身触发霜浮之刃与灼掠之刃的概率提升50%\r\n-->每回合开始时减少自身体力上限的1%并获得等量的护盾、护罩，可叠加，然后己方获得等量的暖雪",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
          "pve_effective": false,
          "param": null,
          "skill": [
            {
              "id": 38296,
              "url": "https://api.seerapi.com/v1/skill/38296"
            }
          ],
          "tag": [
            {
              "id": 40695,
              "url": "https://api.seerapi.com/v1/skill_effect_type_tag/40695"
            },
            {
              "id": 61613,
              "url": "https://api.seerapi.com/v1/skill_effect_type_tag/61613"
            }
          ],
          "hash": "2255679f"
        },
        "loadedAt": "2026-10-26T04:41:11.090Z",
        "storage": "refreshed"
      },
      "instances": [
        {
          "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
          "args": [],
          "effect": {
            "id": 2424,
            "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
          }
        }
      ]
    }
  ],
  "definition": {
    "at": "2026-10-26T05:14:33.936Z",
    "file": "research/4494-jealousy-wiki-source.json",
    "url": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E5%AB%89%E5%A6%92%7CTemplate%3A%E6%95%88%E6%9E%9C%E8%AF%B4%E6%98%8E%7C%E6%95%88%E6%9E%9C%E8%AF%B4%E6%98%8E%2F%E5%AB%89%E5%A6%92",
    "loadedAt": "2026-10-22T07:52:02.345Z",
    "title": "模板:效果说明",
    "revision": 357047,
    "pageTextSha256": "44fbea1579d3259437446d769e61b8bd8e36f5d70068f1c1ee92d76b0615e919",
    "excerpts": [
      "|冰封=控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤与速度等级-1",
      "|焚烬=控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤与命中等级-1",
      "|霜浮之刃=100%令对手冰封且当回合受到的攻击伤害减少50%",
      "|灼掠之刃=100%令对手焚烬且当回合造成的攻击伤害提升50%",
      "|暖雪=己方免疫受到的烧伤、焚烬、冻伤、冰封，免疫成功则减少50片"
    ],
    "sourcePriority": "Wiki supplements API missing definitions; API retains precedence"
  },
  "checked": {
    "primary": "research/4657-source-check.json",
    "supplement": "research/4657-source-supplement-audit.json",
    "definitions": "research/4657-cached-status-definition-extract.json",
    "parameter": "research/4657-extra-parameter-source.json",
    "frozenProbability": [
      "research/DEPLOY-3940-4068-USER-CONFIRMATIONS.json#confirmations[14]",
      "research/Q-R3940-4001-001-4058-user-confirmation.json"
    ],
    "frozenCost": "research/4394-user-confirmed-rules.json",
    "scope": "4001/4058 probability and 4394/764 cost answers only cover their listed sources, no global extension to 4657"
  },
  "gap": "暖雪原文免疫成功减少50片，没有说明剩1–49片是否还可免疫及扣减下界",
  "difference": "剩40片受冰封，可附加成功且保留40，或免疫并归0，或免疫后-10；>=50自然免疫和每次扣50已实现状态测试",
  "question": "暖雪剩余不足50片时是否仍能免疫，若能则扣至0还是允许按50片扣成负数？",
  "answer": ""
}
```

明确问题：暖雪剩余不足50片时是否仍能免疫，若能则扣至0还是允许按50片扣成负数？

我的回答：

### Q-N50-4657-004

```json
{
  "id": "Q-N50-4657-004",
  "answer": "",
  "gap": "技能本身非必中但2197有护罩本次必定命中，1859必中攻击技能是否包括这类条件必中效果",
  "question": "真实37431灼霜 must_hit=false、accuracy97，原index1效果2197在使用者拥有护罩时必定命中。此时1859的自身灼掠与对手霜浮是否按本次实际必中纳入，还是仅原始must_hit属性为true的技能？请分别明确两方向；无护罩或魂对应盾罩资源0时共同不触。",
  "sourceRefs": [
    "research/4657-reviewed-snapshot.json",
    "research/4657-source-check.json",
    "research/4657-cached-status-definition-extract.json"
  ],
  "instances": [
    {
      "speciesId": 4657,
      "moveId": 37431,
      "moveHash": "5d6b37db",
      "index": 1,
      "effectId": 2197,
      "effectHash": "a6cbec4e",
      "args": [],
      "description": "自身处于护罩状态时必定命中",
      "skillURL": "https://api.seerapi.com/v1/skill/37431",
      "effectURL": "https://api.seerapi.com/v1/skill_effect_type/2197"
    },
    {
      "speciesId": 4657,
      "soulId": 1859,
      "soulHash": "9482d536",
      "soulURL": "https://api.seerapi.com/v1/soulmark/1859",
      "scope": "自身使用必中攻击且有盾，或对手使用必中攻击且自己有罩"
    }
  ],
  "checkedSources": [
    {
      "file": "research/4494-jealousy-wiki-source.json",
      "revision": 357047,
      "excerpt": "闪避=只有没有必定命中效果、必中属性的技能可以成为闪避的对象",
      "scope": "只明确闪避准入区别效果/属性，不裁定1859词条是否两类全含"
    }
  ],
  "researchPolicies": [
    "raw-only",
    "actual-guarantee"
  ]
}
```

明确问题：真实37431灼霜 must_hit=false、accuracy97，原index1效果2197在使用者拥有护罩时必定命中。此时1859的自身灼掠与对手霜浮是否按本次实际必中纳入，还是仅原始must_hit属性为true的技能？请分别明确两方向；无护罩或魂对应盾罩资源0时共同不触。

我的回答：

### Q-N50-4600-005 · 4657新增关联

```json
{
  "id": "Q-N50-4600-005",
  "instances": [
    {
      "id": "Q-N50-4600-005",
      "sources": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1859",
          "data": {
            "id": 1859,
            "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4657,
                "url": "https://api.seerapi.com/v1/pet/4657"
              }
            ],
            "effect": {
              "effect_args": [
                50,
                100,
                50,
                50,
                100,
                50,
                1
              ],
              "effect": {
                "id": 2254,
                "url": "https://api.seerapi.com/v1/eid_effect/2254"
              }
            },
            "effect_alias": "alias_2254_50_100_50_50_100_50_1",
            "tag": [
              {
                "id": 3,
                "url": "https://api.seerapi.com/v1/soulmark_tag/3"
              },
              {
                "id": 11,
                "url": "https://api.seerapi.com/v1/soulmark_tag/11"
              }
            ],
            "intensified_to": null,
            "from": null,
            "advance": null,
            "hash": "9482d536"
          },
          "loadedAt": "2026-10-26T04:37:41.613Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/eid_effect/2254",
          "data": {
            "id": 2254,
            "args_num": 7,
            "hash": "1987933f"
          },
          "loadedAt": "2026-10-26T04:54:02.716Z"
        }
      ],
      "question": "1859已有普通护盾时入场吸取额外普通盾应如何合并？",
      "gap": "仅追加本1859精确实例，不将2424明示可叠加泛化到该吸取"
    },
    {
      "id": "Q-N50-4600-005",
      "answer": "",
      "notAnswered": true,
      "instances": [
        {
          "key": "4657:skill:28766:2",
          "kind": "effect-instance",
          "moveId": 28766,
          "index": 2,
          "effectId": 1661,
          "args": [
            300,
            100,
            2
          ],
          "description": "获得300点护盾，护盾消失时100%的概率使对手烧伤",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4600-005"
          ],
          "source": {
            "moveHash": "e8739ed",
            "effectHash": "seerapi:a45387db",
            "skillURL": "https://api.seerapi.com/v1/skill/28766",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/1661",
            "effectTemplate": "获得{0}点护盾，护盾消失时{1}%的概率使对手{2}",
            "effectArgsNum": 3,
            "moveRevision": "seerapi:e8739ed"
          },
          "rawSkillDescription": "全属性+1，自身拥有护罩时强化效果翻倍；4回合内每回合使用技能吸取对手250点体力，吸取体力时若自身当前体力低于对手则吸取效果提升至350点；获得300点护盾，护盾消失时100%的概率使对手烧伤；下2回合令自身所有技能先制+2"
        },
        {
          "key": "4657:skill:37432:0",
          "kind": "effect-instance",
          "moveId": 37432,
          "index": 0,
          "effectId": 847,
          "args": [
            200
          ],
          "description": "为自身附加200点护盾",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4600-005"
          ],
          "source": {
            "moveHash": "e134d5d5",
            "effectHash": "seerapi:11270ab4",
            "skillURL": "https://api.seerapi.com/v1/skill/37432",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/847",
            "effectTemplate": "为自身附加{0}点护盾",
            "effectArgsNum": 1,
            "moveRevision": "seerapi:e134d5d5"
          },
          "rawSkillDescription": "为自身附加200点护盾；为自身附加200点护罩；无视伤害限制效果；对手不处于异常状态时对手2回合内体力恢复效果减少50%"
        }
      ],
      "gap": "原847普通200盾与实际前授1661普通盾并存/重授的来源合并；父1661消失载荷原精确问题保留，2424明示可叠加不泛化847。"
    }
  ]
}
```

明确问题：1859已有普通护盾时入场吸取额外普通盾应如何合并？；原847普通200盾与实际前授1661普通盾并存/重授的来源合并；父1661消失载荷原精确问题保留，2424明示可叠加不泛化847。

我的回答：

### Q-N50-4511-006 · 4657新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "sources": [
        {
          "speciesId": 4657,
          "version": "partner",
          "skill": {
            "url": "https://api.seerapi.com/v1/skill/38296",
            "data": {
              "id": 38296,
              "name": "日月轮·着天",
              "power": 160,
              "max_pp": 2,
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
                "id": 86,
                "url": "https://api.seerapi.com/v1/element_type_combination/86"
              },
              "learned_by_pet": [],
              "skill_effect": [
                {
                  "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
                  "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
                  "args": [],
                  "effect": {
                    "id": 2424,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
                  }
                },
                {
                  "info": "无视伤害限制效果",
                  "analyze_info": "[sprite name=iconInherent]无视伤害限制效果（boss有效）",
                  "args": [],
                  "effect": {
                    "id": 697,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/697"
                  }
                },
                {
                  "info": "2回合内对手恢复体力时恢复效果减少50%",
                  "analyze_info": "[sprite name=iconHit]2回合内对手恢复体力时恢复效果减少50%（boss有效）",
                  "args": [
                    2,
                    50
                  ],
                  "effect": {
                    "id": 761,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/761"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "ccf63b08"
            },
            "loadedAt": "2026-10-26T04:41:04.746Z",
            "storage": "refreshed"
          },
          "soul": {
            "url": "https://api.seerapi.com/v1/soulmark/1859",
            "data": {
              "id": 1859,
              "desc": "每次登场时，吸取对手的护盾、护罩；自身使用攻击技能后，若对手处于异常状态，则消耗自身所有护盾、护罩并造成等量固定伤害|对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%令对手冰封且当回合受到的攻击伤害减少50%|自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%令对手焚烬且当回合造成的攻击伤害提升50%（boss无效）",
              "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>每次登场时，<color=#64F9FA>吸取</color>对手的<b>护盾、护罩</b>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能后若对手处于异常状态，则<color=#64F9FA>消耗</color>自身所有<b>护盾、护罩</b>并<color=#64F9FA>造成</color>等量<b>固定伤害</b>\r\n\r\n<indent=0><sprite=0><indent=16>触发效果：\r\n<indent=16><sprite=3><indent=32>对手使用必中攻击技能时，若自身拥有护罩则50%触发霜浮之刃：100%<color=#64F9FA>令对手冰封</color>且当回合受到的<b>攻击伤害<color=#64F9FA></b>减少</color>50%\r\n<indent=16><sprite=3><indent=32>自身使用必中攻击技能时，若自身拥有护盾则50%触发灼掠之刃：100%<color=#64F9FA>令对手焚烬</color>且当回合造成的<b>攻击伤害<color=#64F9FA></b>提升</color>50%",
              "analyze_desc": "",
              "pve_effective": false,
              "intensified": false,
              "is_adv": false,
              "pet": [
                {
                  "id": 4657,
                  "url": "https://api.seerapi.com/v1/pet/4657"
                }
              ],
              "effect": {
                "effect_args": [
                  50,
                  100,
                  50,
                  50,
                  100,
                  50,
                  1
                ],
                "effect": {
                  "id": 2254,
                  "url": "https://api.seerapi.com/v1/eid_effect/2254"
                }
              },
              "effect_alias": "alias_2254_50_100_50_50_100_50_1",
              "tag": [
                {
                  "id": 3,
                  "url": "https://api.seerapi.com/v1/soulmark_tag/3"
                },
                {
                  "id": 11,
                  "url": "https://api.seerapi.com/v1/soulmark_tag/11"
                }
              ],
              "intensified_to": null,
              "from": null,
              "advance": null,
              "hash": "9482d536"
            },
            "loadedAt": "2026-10-26T04:37:41.613Z",
            "storage": "refreshed"
          },
          "effect": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/2424",
            "data": {
              "id": 2424,
              "args_num": 0,
              "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
              "info_formatting_adjustment": "携带此技能时：\r\n-->自身触发霜浮之刃与灼掠之刃的概率提升50%\r\n-->每回合开始时减少自身体力上限的1%并获得等量的护盾、护罩，可叠加，然后己方获得等量的暖雪",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
              "pve_effective": false,
              "param": null,
              "skill": [
                {
                  "id": 38296,
                  "url": "https://api.seerapi.com/v1/skill/38296"
                }
              ],
              "tag": [
                {
                  "id": 40695,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/40695"
                },
                {
                  "id": 61613,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/61613"
                }
              ],
              "hash": "2255679f"
            },
            "loadedAt": "2026-10-26T04:41:11.090Z",
            "storage": "refreshed"
          },
          "instances": [
            {
              "info": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
              "analyze_info": "[sprite name=iconInherent]携带此技能时，自身触发[color=#f35555]霜浮之刃[/color]与[color=#f35555]灼掠之刃[/color]的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的[color=#f35555]暖雪[/color]、自身获得等量的[color=#57c975]护盾[/color]与[color=#57c975]护罩[/color]，均可叠加",
              "args": [],
              "effect": {
                "id": 2424,
                "url": "https://api.seerapi.com/v1/skill_effect_type/2424"
              }
            }
          ]
        }
      ],
      "definition": {
        "at": "2026-10-26T05:14:33.936Z",
        "file": "research/4494-jealousy-wiki-source.json",
        "url": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E5%AB%89%E5%A6%92%7CTemplate%3A%E6%95%88%E6%9E%9C%E8%AF%B4%E6%98%8E%7C%E6%95%88%E6%9E%9C%E8%AF%B4%E6%98%8E%2F%E5%AB%89%E5%A6%92",
        "loadedAt": "2026-10-22T07:52:02.345Z",
        "title": "模板:效果说明",
        "revision": 357047,
        "pageTextSha256": "44fbea1579d3259437446d769e61b8bd8e36f5d70068f1c1ee92d76b0615e919",
        "excerpts": [
          "|冰封=控制类异常状态，该状态下精灵无法行动，冰封结束后会转化为冻伤与速度等级-1",
          "|焚烬=控制类异常状态，该状态下精灵无法行动，焚烬结束后会转化为烧伤与命中等级-1",
          "|霜浮之刃=100%令对手冰封且当回合受到的攻击伤害减少50%",
          "|灼掠之刃=100%令对手焚烬且当回合造成的攻击伤害提升50%",
          "|暖雪=己方免疫受到的烧伤、焚烬、冻伤、冰封，免疫成功则减少50片"
        ],
        "sourcePriority": "Wiki supplements API missing definitions; API retains precedence"
      },
      "question": "2424暖雪与其它免异或反弹并存时按何顺序及资源消费？",
      "gap": "仅追加当前四种暖雪免疫实际混源实例"
    },
    {
      "id": "Q-N50-4511-006",
      "answer": "",
      "notAnswered": true,
      "instances": [
        {
          "key": "4657:skill:28765:1",
          "kind": "effect-instance",
          "moveId": 28765,
          "index": 1,
          "effectId": 191,
          "args": [
            4
          ],
          "description": "4回合内免疫并反弹所有受到的异常状态",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4511-006"
          ],
          "source": {
            "moveHash": "b465520",
            "effectHash": "seerapi:ebdb8dc2",
            "skillURL": "https://api.seerapi.com/v1/skill/28765",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/191",
            "effectTemplate": "{0}回合内免疫并反弹所有受到的异常状态",
            "effectArgsNum": 1,
            "moveRevision": "seerapi:b465520"
          },
          "rawSkillDescription": "附加自身当前护盾值等量的固定伤害；4回合内免疫并反弹所有受到的异常状态；获得300点护罩，护罩消失时恢复自身350点体力；100%令对手冻伤，未触发则令对手威力最高的攻击技能PP值归0"
        },
        {
          "key": "4657:skill:38296:0",
          "kind": "effect-instance",
          "moveId": 38296,
          "index": 0,
          "effectId": 2424,
          "args": [],
          "description": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4657-001",
            "Q-N50-4657-002",
            "Q-N50-4657-003",
            "Q-N50-4511-006"
          ],
          "source": {
            "moveHash": "ccf63b08",
            "effectHash": "seerapi:2255679f",
            "skillURL": "https://api.seerapi.com/v1/skill/38296",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/2424",
            "effectTemplate": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加",
            "effectArgsNum": 0,
            "moveRevision": "seerapi:ccf63b08"
          },
          "rawSkillDescription": "携带此技能时，自身触发霜浮之刃与灼掠之刃的概率提升50%，每回合开始时减少自身体力上限的1%，然后己方获得等量的暖雪、自身获得等量的护盾与护罩，均可叠加；无视伤害限制效果；2回合内对手恢复体力时恢复效果减少50%"
        }
      ],
      "gap": "本191回合免反与已有次数免异常真实消费冲突；2424暖雪已由父精确问题登记，不扩大为所有概率/PP规则。"
    }
  ]
}
```

明确问题：2424暖雪与其它免异或反弹并存时按何顺序及资源消费？；本191回合免反与已有次数免异常真实消费冲突；2424暖雪已由父精确问题登记，不扩大为所有概率/PP规则。

我的回答：

### Q-N50-4627-010 · 4657新增关联

```json
{
  "id": "Q-N50-4627-010",
  "instances": [
    {
      "id": "Q-N50-4627-010",
      "answer": "",
      "notAnswered": true,
      "instances": [
        {
          "key": "4657:skill:28765:3",
          "kind": "effect-instance",
          "moveId": 28765,
          "index": 3,
          "effectId": 2176,
          "args": [
            100,
            5
          ],
          "description": "100%令对手冻伤，未触发则令对手威力最高的攻击技能PP值归0",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4627-010",
            "Q-N50-4635-012"
          ],
          "source": {
            "moveHash": "b465520",
            "effectHash": "seerapi:20399d0e",
            "skillURL": "https://api.seerapi.com/v1/skill/28765",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/2176",
            "effectTemplate": "{0}%令对手{1}，未触发则令对手威力最高的攻击技能PP值归0",
            "effectArgsNum": 2,
            "moveRevision": "seerapi:b465520"
          },
          "rawSkillDescription": "附加自身当前护盾值等量的固定伤害；4回合内免疫并反弹所有受到的异常状态；获得300点护罩，护罩消失时恢复自身350点体力；100%令对手冻伤，未触发则令对手威力最高的攻击技能PP值归0"
        }
      ],
      "gap": "2176冻伤同名较长不延长时是否未触发并清最高威力攻击PP；沿同缺口精确新实例，未来只答原1582不自动扩大。"
    }
  ]
}
```

明确问题：2176冻伤同名较长不延长时是否未触发并清最高威力攻击PP；沿同缺口精确新实例，未来只答原1582不自动扩大。

我的回答：

### Q-N50-4635-012 · 4657新增关联

```json
{
  "id": "Q-N50-4635-012",
  "instances": [
    {
      "id": "Q-N50-4635-012",
      "answer": "",
      "notAnswered": true,
      "instances": [
        {
          "key": "4657:skill:28765:3",
          "kind": "effect-instance",
          "moveId": 28765,
          "index": 3,
          "effectId": 2176,
          "args": [
            100,
            5
          ],
          "description": "100%令对手冻伤，未触发则令对手威力最高的攻击技能PP值归0",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4627-010",
            "Q-N50-4635-012"
          ],
          "source": {
            "moveHash": "b465520",
            "effectHash": "seerapi:20399d0e",
            "skillURL": "https://api.seerapi.com/v1/skill/28765",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/2176",
            "effectTemplate": "{0}%令对手{1}，未触发则令对手威力最高的攻击技能PP值归0",
            "effectArgsNum": 2,
            "moveRevision": "seerapi:b465520"
          },
          "rawSkillDescription": "附加自身当前护盾值等量的固定伤害；4回合内免疫并反弹所有受到的异常状态；获得300点护罩，护罩消失时恢复自身350点体力；100%令对手冻伤，未触发则令对手威力最高的攻击技能PP值归0"
        }
      ],
      "gap": "新2176敌方实际装备的最高威力攻击并列选择，仅当前真实装配；原问不同效果/实例答案不自动扩。"
    }
  ]
}
```

明确问题：新2176敌方实际装备的最高威力攻击并列选择，仅当前真实装配；原问不同效果/实例答案不自动扩。

我的回答：

### Q-N50-4625-011 · 4657新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "answer": "",
      "notAnswered": true,
      "instances": [
        {
          "key": "4657:skill:28766:1",
          "kind": "effect-instance",
          "moveId": 28766,
          "index": 1,
          "effectId": 1842,
          "args": [
            4,
            250,
            350
          ],
          "description": "4回合内每回合使用技能吸取对手250点体力，吸取体力时若自身当前体力低于对手则吸取效果提升至350点",
          "scope": "single",
          "status": "static-unverified",
          "pending": [
            "Q-N50-4625-011"
          ],
          "source": {
            "moveHash": "e8739ed",
            "effectHash": "seerapi:aa464d25",
            "skillURL": "https://api.seerapi.com/v1/skill/28766",
            "effectURL": "https://api.seerapi.com/v1/skill_effect_type/1842",
            "effectTemplate": "{0}回合内每回合使用技能吸取对手{1}点体力，吸取体力时若自身当前体力低于对手则吸取效果提升至{2}点",
            "effectArgsNum": 3,
            "moveRevision": "seerapi:e8739ed"
          },
          "rawSkillDescription": "全属性+1，自身拥有护罩时强化效果翻倍；4回合内每回合使用技能吸取对手250点体力，吸取体力时若自身当前体力低于对手则吸取效果提升至350点；获得300点护盾，护盾消失时100%的概率使对手烧伤；下2回合令自身所有技能先制+2"
        }
      ],
      "gap": "新1842持续用技能固定250/350吸取的同次授予是否立即首触；明确次招/立即研究不是自然答案。"
    }
  ]
}
```

明确问题：新1842持续用技能固定250/350吸取的同次授予是否立即首触；明确次招/立即研究不是自然答案。

我的回答：
