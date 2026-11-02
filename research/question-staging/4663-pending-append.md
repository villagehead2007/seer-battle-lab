

## 4663 · 原固定第46只

66项逐审、136来源检查0；生产282/282 exit0，本只65项。全部独立工作完成，部分实现待确认；多精灵延期1项。未正式部署/验收。用户编辑期间仅暂存。

### Q-N50-4663-001

```json
{
  "id": "Q-N50-4663-001",
  "gap": "使用第三次攻击达到120%这一刻是否立即增加焚烬概率10个百分点，还是从已经达到120%后的第四次攻击开始增加？",
  "difference": "首次三次攻击后发生无攻击伤害回合，焚烬概率分别为60%或50%；之后封顶100%。",
  "sources": [
    {
      "url": "https://api.seerapi.com/v1/soulmark/1867",
      "data": {
        "id": 1867,
        "desc": "战斗阶段结束时，若当回合对手未受到攻击伤害则50%令对手焚烬，未触发自身下回合先制+1且使用攻击技能时100%令对手烧伤|使用攻击技能时本次在场造成的伤害提升40%，每次使用增加40%，最高120%，若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100%|（boss无效）",
        "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时，若当回合对手未受到攻击伤害则50%<color=#64F9FA>令对手焚烬</color>\r\n<indent=32><sprite=4><indent=48>未触发自身下回合<b>先制</b>+1且使用攻击技能时100%<color=#64F9FA>令对手烧伤</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>使用攻击技能时本次在场造成的<b>攻击伤害<color=#64F9FA></b>提升</color>40%，每次使用增加40%，最高120%\r\n<indent=32><sprite=4><indent=48>若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100% ",
        "analyze_desc": "",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4663,
            "url": "https://api.seerapi.com/v1/pet/4663"
          }
        ],
        "effect": {
          "effect_args": [
            100,
            40,
            40,
            120,
            1
          ],
          "effect": {
            "id": 2262,
            "url": "https://api.seerapi.com/v1/eid_effect/2262"
          }
        },
        "effect_alias": "alias_2262_100_40_40_120_1",
        "tag": [
          {
            "id": 11,
            "url": "https://api.seerapi.com/v1/soulmark_tag/11"
          },
          {
            "id": 2,
            "url": "https://api.seerapi.com/v1/soulmark_tag/2"
          }
        ],
        "intensified_to": null,
        "from": null,
        "advance": null,
        "hash": "c1e16cab"
      },
      "loadedAt": "2026-10-26T07:18:29.222Z",
      "storage": "refreshed"
    }
  ],
  "fullDescription": "战斗阶段结束时，若当回合对手未受到攻击伤害则50%令对手焚烬，未触发自身下回合先制+1且使用攻击技能时100%令对手烧伤|使用攻击技能时本次在场造成的伤害提升40%，每次使用增加40%，最高120%，若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100%|（boss无效）",
  "fullFormattedDescription": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时，若当回合对手未受到攻击伤害则50%<color=#64F9FA>令对手焚烬</color>\r\n<indent=32><sprite=4><indent=48>未触发自身下回合<b>先制</b>+1且使用攻击技能时100%<color=#64F9FA>令对手烧伤</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>使用攻击技能时本次在场造成的<b>攻击伤害<color=#64F9FA></b>提升</color>40%，每次使用增加40%，最高120%\r\n<indent=32><sprite=4><indent=48>若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100% ",
  "args": [
    100,
    40,
    40,
    120,
    1
  ],
  "version": "c1e16cab",
  "sourceURL": "https://api.seerapi.com/v1/soulmark/1867",
  "supplement": [
    {
      "title": "魂印:1867",
      "pageid": 161090,
      "missing": false,
      "revision": 320402,
      "timestamp": "2025-10-21T05:09:58Z",
      "sourceURL": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E9%AD%82%E5%8D%B0%3A1867%7C%E7%B2%BE%E7%81%B5%3A4663%7C%E5%87%8C%E8%99%8E%C2%B7%E5%85%B3%E9%93%B6%E5%B1%8F%7C%E6%95%88%E6%9E%9C%3A44%7C%E6%95%88%E6%9E%9C%3A12%7C%E6%95%88%E6%9E%9C%3A31%7C%E6%95%88%E6%9E%9C%3A879%7C%E6%95%88%E6%9E%9C%3A1048%7C%E6%95%88%E6%9E%9C%3A4%7C%E6%95%88%E6%9E%9C%3A5%7C%E6%95%88%E6%9E%9C%3A983%7C%E6%95%88%E6%9E%9C%3A48%7C%E6%95%88%E6%9E%9C%3A1200%7C%E6%95%88%E6%9E%9C%3A570%7C%E6%95%88%E6%9E%9C%3A3%7C%E6%95%88%E6%9E%9C%3A885%7C%E6%95%88%E6%9E%9C%3A597%7C%E6%95%88%E6%9E%9C%3A843%7C%E6%95%88%E6%9E%9C%3A1248%7C%E6%95%88%E6%9E%9C%3A1046%7C%E6%95%88%E6%9E%9C%3A494%7C%E6%95%88%E6%9E%9C%3A1956%7C%E6%95%88%E6%9E%9C%3A191%7C%E6%95%88%E6%9E%9C%3A47%7C%E6%95%88%E6%9E%9C%3A1604%7C%E6%95%88%E6%9E%9C%3A1009%7C%E6%95%88%E6%9E%9C%3A1392%7C%E6%95%88%E6%9E%9C%3A1199%7C%E6%95%88%E6%9E%9C%3A1019%7C%E6%95%88%E6%9E%9C%3A1120%7C%E6%95%88%E6%9E%9C%3A1320%7C%E6%8A%80%E8%83%BD%3A10001%7C%E6%8A%80%E8%83%BD%3A20456%7C%E6%8A%80%E8%83%BD%3A10007%7C%E6%8A%80%E8%83%BD%3A10049%7C%E6%8A%80%E8%83%BD%3A10646%7C%E6%8A%80%E8%83%BD%3A31206%7C%E6%8A%80%E8%83%BD%3A11509%7C%E6%8A%80%E8%83%BD%3A11173%7C%E6%8A%80%E8%83%BD%3A20746%7C%E6%8A%80%E8%83%BD%3A31207%7C%E6%8A%80%E8%83%BD%3A25712%7C%E6%8A%80%E8%83%BD%3A31208%7C%E6%8A%80%E8%83%BD%3A25713%7C%E6%8A%80%E8%83%BD%3A31209",
      "sha256": "a3b223292f9054c012e322f0119590a9a60de77cee52db64d6d5fe0130665050",
      "text": "{{魂印\n|魂印ID=1867\n|相关精灵=4663\n|魂印图标=1867\n|效果IDs=2262\n|kind=10 1\n|魂印效果=战斗阶段结束时，若当回合对手未受到攻击伤害则50%令对手焚烬，未触发自身下回合先制+1且使用攻击技能时100%令对手烧伤<br>使用攻击技能时本次在场造成的伤害提升40%，每次使用增加40%，最高120%，若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100%<br>（boss无效）\n}}"
    }
  ],
  "checked": [
    {
      "path": "research/untriggered-rule-user-confirmation.json",
      "sha256": "3cf58a8e23b4d7b187ee257f8db43e2d94bdd1af95cc25cf50054264787a96b9"
    },
    {
      "path": "research/Q-DAMAGE-001-user-confirmation.json",
      "sha256": "decaa5c5463693df5b0178ec3dd089d5ec0cfa83e7a00cdc6c229dc4717d4815"
    },
    {
      "path": "research/damage-settlement-user-confirmed.json",
      "sha256": "9dd99cb2edfb7ea73757adf2e456fecf35076f92086085b9fbfb19183468a470"
    },
    {
      "path": "research/FIXED50-ANSWER-USER-CONFIRMATIONS.json",
      "sha256": "30869dd414fe87fdab95778091f7fdcce50b8faacd986aa66830f1cc0f53f650"
    },
    {
      "path": "research/FIXED60-ANSWER-USER-CONFIRMATIONS.json",
      "sha256": "19214432c2e911d203171d42a9261f1484b317bc7ea793fc5d1742f7e310ba45"
    }
  ],
  "question": "使用第三次攻击达到120%这一刻是否立即增加焚烬概率10个百分点，还是从已经达到120%后的第四次攻击开始增加？",
  "answer": ""
}
```

明确问题：使用第三次攻击达到120%这一刻是否立即增加焚烬概率10个百分点，还是从已经达到120%后的第四次攻击开始增加？

我的回答：

### Q-N50-4663-002

```json
{
  "id": "Q-N50-4663-002",
  "gap": "未触发焚烬后的使用攻击技能100%烧伤是否只在紧接的下回合有效，还是从下回合起持续有效？",
  "difference": "补偿次回合共同生效；再下一回合及以后实际用攻是否继续施加烧伤不同。",
  "sources": [
    {
      "url": "https://api.seerapi.com/v1/soulmark/1867",
      "data": {
        "id": 1867,
        "desc": "战斗阶段结束时，若当回合对手未受到攻击伤害则50%令对手焚烬，未触发自身下回合先制+1且使用攻击技能时100%令对手烧伤|使用攻击技能时本次在场造成的伤害提升40%，每次使用增加40%，最高120%，若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100%|（boss无效）",
        "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时，若当回合对手未受到攻击伤害则50%<color=#64F9FA>令对手焚烬</color>\r\n<indent=32><sprite=4><indent=48>未触发自身下回合<b>先制</b>+1且使用攻击技能时100%<color=#64F9FA>令对手烧伤</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>使用攻击技能时本次在场造成的<b>攻击伤害<color=#64F9FA></b>提升</color>40%，每次使用增加40%，最高120%\r\n<indent=32><sprite=4><indent=48>若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100% ",
        "analyze_desc": "",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4663,
            "url": "https://api.seerapi.com/v1/pet/4663"
          }
        ],
        "effect": {
          "effect_args": [
            100,
            40,
            40,
            120,
            1
          ],
          "effect": {
            "id": 2262,
            "url": "https://api.seerapi.com/v1/eid_effect/2262"
          }
        },
        "effect_alias": "alias_2262_100_40_40_120_1",
        "tag": [
          {
            "id": 11,
            "url": "https://api.seerapi.com/v1/soulmark_tag/11"
          },
          {
            "id": 2,
            "url": "https://api.seerapi.com/v1/soulmark_tag/2"
          }
        ],
        "intensified_to": null,
        "from": null,
        "advance": null,
        "hash": "c1e16cab"
      },
      "loadedAt": "2026-10-26T07:18:29.222Z",
      "storage": "refreshed"
    }
  ],
  "fullDescription": "战斗阶段结束时，若当回合对手未受到攻击伤害则50%令对手焚烬，未触发自身下回合先制+1且使用攻击技能时100%令对手烧伤|使用攻击技能时本次在场造成的伤害提升40%，每次使用增加40%，最高120%，若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100%|（boss无效）",
  "fullFormattedDescription": "<indent=0><sprite=0><indent=16>战阶结束效果：\r\n<indent=16><sprite=3><indent=32>战斗阶段结束时，若当回合对手未受到攻击伤害则50%<color=#64F9FA>令对手焚烬</color>\r\n<indent=32><sprite=4><indent=48>未触发自身下回合<b>先制</b>+1且使用攻击技能时100%<color=#64F9FA>令对手烧伤</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>使用攻击技能时本次在场造成的<b>攻击伤害<color=#64F9FA></b>提升</color>40%，每次使用增加40%，最高120%\r\n<indent=32><sprite=4><indent=48>若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100% ",
  "args": [
    100,
    40,
    40,
    120,
    1
  ],
  "version": "c1e16cab",
  "sourceURL": "https://api.seerapi.com/v1/soulmark/1867",
  "supplement": [
    {
      "title": "魂印:1867",
      "pageid": 161090,
      "missing": false,
      "revision": 320402,
      "timestamp": "2025-10-21T05:09:58Z",
      "sourceURL": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E9%AD%82%E5%8D%B0%3A1867%7C%E7%B2%BE%E7%81%B5%3A4663%7C%E5%87%8C%E8%99%8E%C2%B7%E5%85%B3%E9%93%B6%E5%B1%8F%7C%E6%95%88%E6%9E%9C%3A44%7C%E6%95%88%E6%9E%9C%3A12%7C%E6%95%88%E6%9E%9C%3A31%7C%E6%95%88%E6%9E%9C%3A879%7C%E6%95%88%E6%9E%9C%3A1048%7C%E6%95%88%E6%9E%9C%3A4%7C%E6%95%88%E6%9E%9C%3A5%7C%E6%95%88%E6%9E%9C%3A983%7C%E6%95%88%E6%9E%9C%3A48%7C%E6%95%88%E6%9E%9C%3A1200%7C%E6%95%88%E6%9E%9C%3A570%7C%E6%95%88%E6%9E%9C%3A3%7C%E6%95%88%E6%9E%9C%3A885%7C%E6%95%88%E6%9E%9C%3A597%7C%E6%95%88%E6%9E%9C%3A843%7C%E6%95%88%E6%9E%9C%3A1248%7C%E6%95%88%E6%9E%9C%3A1046%7C%E6%95%88%E6%9E%9C%3A494%7C%E6%95%88%E6%9E%9C%3A1956%7C%E6%95%88%E6%9E%9C%3A191%7C%E6%95%88%E6%9E%9C%3A47%7C%E6%95%88%E6%9E%9C%3A1604%7C%E6%95%88%E6%9E%9C%3A1009%7C%E6%95%88%E6%9E%9C%3A1392%7C%E6%95%88%E6%9E%9C%3A1199%7C%E6%95%88%E6%9E%9C%3A1019%7C%E6%95%88%E6%9E%9C%3A1120%7C%E6%95%88%E6%9E%9C%3A1320%7C%E6%8A%80%E8%83%BD%3A10001%7C%E6%8A%80%E8%83%BD%3A20456%7C%E6%8A%80%E8%83%BD%3A10007%7C%E6%8A%80%E8%83%BD%3A10049%7C%E6%8A%80%E8%83%BD%3A10646%7C%E6%8A%80%E8%83%BD%3A31206%7C%E6%8A%80%E8%83%BD%3A11509%7C%E6%8A%80%E8%83%BD%3A11173%7C%E6%8A%80%E8%83%BD%3A20746%7C%E6%8A%80%E8%83%BD%3A31207%7C%E6%8A%80%E8%83%BD%3A25712%7C%E6%8A%80%E8%83%BD%3A31208%7C%E6%8A%80%E8%83%BD%3A25713%7C%E6%8A%80%E8%83%BD%3A31209",
      "sha256": "a3b223292f9054c012e322f0119590a9a60de77cee52db64d6d5fe0130665050",
      "text": "{{魂印\n|魂印ID=1867\n|相关精灵=4663\n|魂印图标=1867\n|效果IDs=2262\n|kind=10 1\n|魂印效果=战斗阶段结束时，若当回合对手未受到攻击伤害则50%令对手焚烬，未触发自身下回合先制+1且使用攻击技能时100%令对手烧伤<br>使用攻击技能时本次在场造成的伤害提升40%，每次使用增加40%，最高120%，若已叠加至最高则本场战斗内上述焚烬附加概率提升10%，最高100%<br>（boss无效）\n}}"
    }
  ],
  "checked": [
    {
      "path": "research/untriggered-rule-user-confirmation.json",
      "sha256": "3cf58a8e23b4d7b187ee257f8db43e2d94bdd1af95cc25cf50054264787a96b9"
    },
    {
      "path": "research/Q-DAMAGE-001-user-confirmation.json",
      "sha256": "decaa5c5463693df5b0178ec3dd089d5ec0cfa83e7a00cdc6c229dc4717d4815"
    },
    {
      "path": "research/damage-settlement-user-confirmed.json",
      "sha256": "9dd99cb2edfb7ea73757adf2e456fecf35076f92086085b9fbfb19183468a470"
    },
    {
      "path": "research/FIXED50-ANSWER-USER-CONFIRMATIONS.json",
      "sha256": "30869dd414fe87fdab95778091f7fdcce50b8faacd986aa66830f1cc0f53f650"
    },
    {
      "path": "research/FIXED60-ANSWER-USER-CONFIRMATIONS.json",
      "sha256": "19214432c2e911d203171d42a9261f1484b317bc7ea793fc5d1742f7e310ba45"
    }
  ],
  "question": "未触发焚烬后的使用攻击技能100%烧伤是否只在紧接的下回合有效，还是从下回合起持续有效？",
  "answer": ""
}
```

明确问题：未触发焚烬后的使用攻击技能100%烧伤是否只在紧接的下回合有效，还是从下回合起持续有效？

我的回答：

### Q-N50-4511-006 · 4663新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "instances": [
        {
          "species": 4663,
          "moveId": 25713,
          "moveName": "迷离身姿",
          "moveHash": "a5606888",
          "index": 2,
          "effectId": 570,
          "args": [
            1
          ],
          "description": "免疫下1次对手的攻击",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/25713",
            "data": {
              "id": 25713,
              "name": "迷离身姿",
              "power": 0,
              "max_pp": 5,
              "accuracy": 100,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始抵抗异常状态了；受到攻击则使对手焚烬，未触发则消除对手回合类效果；免疫受到的攻击",
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
                  "info": "3回合内免疫所有受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]3回合内免疫所有受到的异常状态（boss有效）",
                  "args": [
                    3
                  ],
                  "effect": {
                    "id": 48,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/48"
                  }
                },
                {
                  "info": "4回合内受到攻击则70%对手焚烬，未触发则消除对手回合类效果",
                  "analyze_info": "[sprite name=iconHit]4回合内受到攻击则70%对手[color=#57c975]焚烬[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
                  "args": [
                    4,
                    70,
                    22
                  ],
                  "effect": {
                    "id": 1200,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1200"
                  }
                },
                {
                  "info": "免疫下1次对手的攻击",
                  "analyze_info": "[sprite name=iconHit]免疫下1次对手的攻击（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 570,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/570"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "a5606888"
            },
            "loadedAt": "2026-10-26T07:48:00.893Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/570",
            "data": {
              "id": 570,
              "args_num": 1,
              "info": "免疫下{0}次对手的攻击",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]免疫下{0}次对手的攻击（boss有效）",
              "pve_effective": true,
              "param": null,
              "hash": "7a6c2f71"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:48:01.080Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        },
        {
          "species": 4663,
          "moveId": 28786,
          "moveName": "无踪绰影",
          "moveHash": "26b6d6a3",
          "index": 3,
          "effectId": 570,
          "args": [
            1
          ],
          "description": "免疫下1次对手的攻击",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/28786",
            "data": {
              "id": 28786,
              "name": "无踪绰影",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；开始免疫能力下降状态了；开始免疫对手的攻击了；自身被火焰所保护",
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
                  "info": "4回合内受到攻击则100%对手焚烬，未触发则消除对手回合类效果",
                  "analyze_info": "[sprite name=iconHit]4回合内受到攻击则100%对手[color=#57c975]焚烬[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
                  "args": [
                    4,
                    100,
                    22
                  ],
                  "effect": {
                    "id": 1200,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1200"
                  }
                },
                {
                  "info": "免疫下1次对手的攻击",
                  "analyze_info": "[sprite name=iconHit]免疫下1次对手的攻击（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 570,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/570"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "26b6d6a3"
            },
            "loadedAt": "2026-10-26T07:48:33.821Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/570",
            "data": {
              "id": 570,
              "args_num": 1,
              "info": "免疫下{0}次对手的攻击",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]免疫下{0}次对手的攻击（boss有效）",
              "pve_effective": true,
              "param": null,
              "hash": "7a6c2f71"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:48:01.080Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        }
      ],
      "gap": "未消费免攻重复授予及多来源消费范围",
      "checked": [
        "当前SeerAPI完整实例及Wiki补源",
        "冻结历史确认未扩大范围，未读取原问题MD新增回答"
      ],
      "question": "请按该公共问题确认上述4663真实来源实例的未消费免攻重复授予及多来源消费范围。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4625-011 · 4663新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "instances": [
        {
          "species": 4663,
          "moveId": 25714,
          "moveName": "武圣之后",
          "moveHash": "dbb95493",
          "index": 1,
          "effectId": 597,
          "args": [
            4,
            3
          ],
          "description": "4回合内每回合使用技能吸取对手最大体力的1/3",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/25714",
            "data": {
              "id": 25714,
              "name": "武圣之后",
              "power": 0,
              "max_pp": 5,
              "accuracy": 100,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "全属性都提升了，自身体力高于对手时强化效果翻倍；开始慢慢吸取对手体力了；出手变得更快了",
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
                  "info": "全属性+1，自身当前体力高于对手时强化效果翻倍",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，自身当前体力高于对手时强化效果翻倍（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 885,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/885"
                  }
                },
                {
                  "info": "4回合内每回合使用技能吸取对手最大体力的1/3",
                  "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/3",
                  "args": [
                    4,
                    3
                  ],
                  "effect": {
                    "id": 597,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/597"
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
              "hash": "dbb95493"
            },
            "loadedAt": "2026-10-26T07:48:14.324Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/597",
            "data": {
              "id": 597,
              "args_num": 2,
              "info": "{0}回合内每回合使用技能吸取对手最大体力的1/{1}",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]{0}回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/{1}",
              "pve_effective": false,
              "param": null,
              "skill": [
                {
                  "id": 23373,
                  "url": "https://api.seerapi.com/v1/skill/23373"
                },
                {
                  "id": 23490,
                  "url": "https://api.seerapi.com/v1/skill/23490"
                },
                {
                  "id": 23669,
                  "url": "https://api.seerapi.com/v1/skill/23669"
                },
                {
                  "id": 23707,
                  "url": "https://api.seerapi.com/v1/skill/23707"
                },
                {
                  "id": 23739,
                  "url": "https://api.seerapi.com/v1/skill/23739"
                },
                {
                  "id": 23741,
                  "url": "https://api.seerapi.com/v1/skill/23741"
                },
                {
                  "id": 23781,
                  "url": "https://api.seerapi.com/v1/skill/23781"
                },
                {
                  "id": 23819,
                  "url": "https://api.seerapi.com/v1/skill/23819"
                },
                {
                  "id": 23950,
                  "url": "https://api.seerapi.com/v1/skill/23950"
                },
                {
                  "id": 24038,
                  "url": "https://api.seerapi.com/v1/skill/24038"
                },
                {
                  "id": 24067,
                  "url": "https://api.seerapi.com/v1/skill/24067"
                },
                {
                  "id": 24142,
                  "url": "https://api.seerapi.com/v1/skill/24142"
                },
                {
                  "id": 24172,
                  "url": "https://api.seerapi.com/v1/skill/24172"
                },
                {
                  "id": 24188,
                  "url": "https://api.seerapi.com/v1/skill/24188"
                },
                {
                  "id": 24234,
                  "url": "https://api.seerapi.com/v1/skill/24234"
                },
                {
                  "id": 24316,
                  "url": "https://api.seerapi.com/v1/skill/24316"
                },
                {
                  "id": 24433,
                  "url": "https://api.seerapi.com/v1/skill/24433"
                },
                {
                  "id": 24449,
                  "url": "https://api.seerapi.com/v1/skill/24449"
                },
                {
                  "id": 24501,
                  "url": "https://api.seerapi.com/v1/skill/24501"
                },
                {
                  "id": 24506,
                  "url": "https://api.seerapi.com/v1/skill/24506"
                },
                {
                  "id": 24528,
                  "url": "https://api.seerapi.com/v1/skill/24528"
                },
                {
                  "id": 24562,
                  "url": "https://api.seerapi.com/v1/skill/24562"
                },
                {
                  "id": 24602,
                  "url": "https://api.seerapi.com/v1/skill/24602"
                },
                {
                  "id": 24713,
                  "url": "https://api.seerapi.com/v1/skill/24713"
                },
                {
                  "id": 24786,
                  "url": "https://api.seerapi.com/v1/skill/24786"
                },
                {
                  "id": 24792,
                  "url": "https://api.seerapi.com/v1/skill/24792"
                },
                {
                  "id": 24803,
                  "url": "https://api.seerapi.com/v1/skill/24803"
                },
                {
                  "id": 24831,
                  "url": "https://api.seerapi.com/v1/skill/24831"
                },
                {
                  "id": 24849,
                  "url": "https://api.seerapi.com/v1/skill/24849"
                },
                {
                  "id": 24866,
                  "url": "https://api.seerapi.com/v1/skill/24866"
                },
                {
                  "id": 24882,
                  "url": "https://api.seerapi.com/v1/skill/24882"
                },
                {
                  "id": 24898,
                  "url": "https://api.seerapi.com/v1/skill/24898"
                },
                {
                  "id": 24948,
                  "url": "https://api.seerapi.com/v1/skill/24948"
                },
                {
                  "id": 25000,
                  "url": "https://api.seerapi.com/v1/skill/25000"
                },
                {
                  "id": 25092,
                  "url": "https://api.seerapi.com/v1/skill/25092"
                },
                {
                  "id": 25105,
                  "url": "https://api.seerapi.com/v1/skill/25105"
                },
                {
                  "id": 25116,
                  "url": "https://api.seerapi.com/v1/skill/25116"
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
                  "id": 25165,
                  "url": "https://api.seerapi.com/v1/skill/25165"
                },
                {
                  "id": 25184,
                  "url": "https://api.seerapi.com/v1/skill/25184"
                },
                {
                  "id": 25194,
                  "url": "https://api.seerapi.com/v1/skill/25194"
                },
                {
                  "id": 25215,
                  "url": "https://api.seerapi.com/v1/skill/25215"
                },
                {
                  "id": 25226,
                  "url": "https://api.seerapi.com/v1/skill/25226"
                },
                {
                  "id": 25254,
                  "url": "https://api.seerapi.com/v1/skill/25254"
                },
                {
                  "id": 25282,
                  "url": "https://api.seerapi.com/v1/skill/25282"
                },
                {
                  "id": 25297,
                  "url": "https://api.seerapi.com/v1/skill/25297"
                },
                {
                  "id": 25307,
                  "url": "https://api.seerapi.com/v1/skill/25307"
                },
                {
                  "id": 25319,
                  "url": "https://api.seerapi.com/v1/skill/25319"
                },
                {
                  "id": 25331,
                  "url": "https://api.seerapi.com/v1/skill/25331"
                },
                {
                  "id": 25346,
                  "url": "https://api.seerapi.com/v1/skill/25346"
                },
                {
                  "id": 25356,
                  "url": "https://api.seerapi.com/v1/skill/25356"
                },
                {
                  "id": 25364,
                  "url": "https://api.seerapi.com/v1/skill/25364"
                },
                {
                  "id": 25389,
                  "url": "https://api.seerapi.com/v1/skill/25389"
                },
                {
                  "id": 25392,
                  "url": "https://api.seerapi.com/v1/skill/25392"
                },
                {
                  "id": 25413,
                  "url": "https://api.seerapi.com/v1/skill/25413"
                },
                {
                  "id": 25416,
                  "url": "https://api.seerapi.com/v1/skill/25416"
                },
                {
                  "id": 25428,
                  "url": "https://api.seerapi.com/v1/skill/25428"
                },
                {
                  "id": 25433,
                  "url": "https://api.seerapi.com/v1/skill/25433"
                },
                {
                  "id": 25450,
                  "url": "https://api.seerapi.com/v1/skill/25450"
                },
                {
                  "id": 25464,
                  "url": "https://api.seerapi.com/v1/skill/25464"
                },
                {
                  "id": 25498,
                  "url": "https://api.seerapi.com/v1/skill/25498"
                },
                {
                  "id": 25508,
                  "url": "https://api.seerapi.com/v1/skill/25508"
                },
                {
                  "id": 25523,
                  "url": "https://api.seerapi.com/v1/skill/25523"
                },
                {
                  "id": 25533,
                  "url": "https://api.seerapi.com/v1/skill/25533"
                },
                {
                  "id": 25557,
                  "url": "https://api.seerapi.com/v1/skill/25557"
                },
                {
                  "id": 25603,
                  "url": "https://api.seerapi.com/v1/skill/25603"
                },
                {
                  "id": 25627,
                  "url": "https://api.seerapi.com/v1/skill/25627"
                },
                {
                  "id": 25639,
                  "url": "https://api.seerapi.com/v1/skill/25639"
                },
                {
                  "id": 25647,
                  "url": "https://api.seerapi.com/v1/skill/25647"
                },
                {
                  "id": 25644,
                  "url": "https://api.seerapi.com/v1/skill/25644"
                },
                {
                  "id": 25674,
                  "url": "https://api.seerapi.com/v1/skill/25674"
                },
                {
                  "id": 25682,
                  "url": "https://api.seerapi.com/v1/skill/25682"
                },
                {
                  "id": 25691,
                  "url": "https://api.seerapi.com/v1/skill/25691"
                },
                {
                  "id": 25705,
                  "url": "https://api.seerapi.com/v1/skill/25705"
                },
                {
                  "id": 25708,
                  "url": "https://api.seerapi.com/v1/skill/25708"
                },
                {
                  "id": 25714,
                  "url": "https://api.seerapi.com/v1/skill/25714"
                },
                {
                  "id": 25716,
                  "url": "https://api.seerapi.com/v1/skill/25716"
                },
                {
                  "id": 25722,
                  "url": "https://api.seerapi.com/v1/skill/25722"
                },
                {
                  "id": 25731,
                  "url": "https://api.seerapi.com/v1/skill/25731"
                },
                {
                  "id": 25737,
                  "url": "https://api.seerapi.com/v1/skill/25737"
                },
                {
                  "id": 25762,
                  "url": "https://api.seerapi.com/v1/skill/25762"
                },
                {
                  "id": 25765,
                  "url": "https://api.seerapi.com/v1/skill/25765"
                },
                {
                  "id": 25768,
                  "url": "https://api.seerapi.com/v1/skill/25768"
                },
                {
                  "id": 25796,
                  "url": "https://api.seerapi.com/v1/skill/25796"
                },
                {
                  "id": 25823,
                  "url": "https://api.seerapi.com/v1/skill/25823"
                },
                {
                  "id": 25838,
                  "url": "https://api.seerapi.com/v1/skill/25838"
                },
                {
                  "id": 25845,
                  "url": "https://api.seerapi.com/v1/skill/25845"
                },
                {
                  "id": 25849,
                  "url": "https://api.seerapi.com/v1/skill/25849"
                },
                {
                  "id": 25851,
                  "url": "https://api.seerapi.com/v1/skill/25851"
                },
                {
                  "id": 25859,
                  "url": "https://api.seerapi.com/v1/skill/25859"
                },
                {
                  "id": 25906,
                  "url": "https://api.seerapi.com/v1/skill/25906"
                },
                {
                  "id": 25916,
                  "url": "https://api.seerapi.com/v1/skill/25916"
                },
                {
                  "id": 25925,
                  "url": "https://api.seerapi.com/v1/skill/25925"
                },
                {
                  "id": 25942,
                  "url": "https://api.seerapi.com/v1/skill/25942"
                },
                {
                  "id": 25958,
                  "url": "https://api.seerapi.com/v1/skill/25958"
                },
                {
                  "id": 25978,
                  "url": "https://api.seerapi.com/v1/skill/25978"
                },
                {
                  "id": 26014,
                  "url": "https://api.seerapi.com/v1/skill/26014"
                },
                {
                  "id": 26021,
                  "url": "https://api.seerapi.com/v1/skill/26021"
                },
                {
                  "id": 26035,
                  "url": "https://api.seerapi.com/v1/skill/26035"
                },
                {
                  "id": 26043,
                  "url": "https://api.seerapi.com/v1/skill/26043"
                },
                {
                  "id": 26060,
                  "url": "https://api.seerapi.com/v1/skill/26060"
                },
                {
                  "id": 26063,
                  "url": "https://api.seerapi.com/v1/skill/26063"
                },
                {
                  "id": 26117,
                  "url": "https://api.seerapi.com/v1/skill/26117"
                },
                {
                  "id": 26123,
                  "url": "https://api.seerapi.com/v1/skill/26123"
                },
                {
                  "id": 26131,
                  "url": "https://api.seerapi.com/v1/skill/26131"
                },
                {
                  "id": 26149,
                  "url": "https://api.seerapi.com/v1/skill/26149"
                },
                {
                  "id": 26155,
                  "url": "https://api.seerapi.com/v1/skill/26155"
                },
                {
                  "id": 26169,
                  "url": "https://api.seerapi.com/v1/skill/26169"
                },
                {
                  "id": 26175,
                  "url": "https://api.seerapi.com/v1/skill/26175"
                },
                {
                  "id": 26184,
                  "url": "https://api.seerapi.com/v1/skill/26184"
                },
                {
                  "id": 26186,
                  "url": "https://api.seerapi.com/v1/skill/26186"
                },
                {
                  "id": 26192,
                  "url": "https://api.seerapi.com/v1/skill/26192"
                },
                {
                  "id": 26198,
                  "url": "https://api.seerapi.com/v1/skill/26198"
                },
                {
                  "id": 26204,
                  "url": "https://api.seerapi.com/v1/skill/26204"
                },
                {
                  "id": 26226,
                  "url": "https://api.seerapi.com/v1/skill/26226"
                },
                {
                  "id": 26233,
                  "url": "https://api.seerapi.com/v1/skill/26233"
                },
                {
                  "id": 26269,
                  "url": "https://api.seerapi.com/v1/skill/26269"
                },
                {
                  "id": 26315,
                  "url": "https://api.seerapi.com/v1/skill/26315"
                },
                {
                  "id": 26357,
                  "url": "https://api.seerapi.com/v1/skill/26357"
                },
                {
                  "id": 26362,
                  "url": "https://api.seerapi.com/v1/skill/26362"
                },
                {
                  "id": 26418,
                  "url": "https://api.seerapi.com/v1/skill/26418"
                },
                {
                  "id": 26433,
                  "url": "https://api.seerapi.com/v1/skill/26433"
                },
                {
                  "id": 26453,
                  "url": "https://api.seerapi.com/v1/skill/26453"
                },
                {
                  "id": 26572,
                  "url": "https://api.seerapi.com/v1/skill/26572"
                },
                {
                  "id": 26666,
                  "url": "https://api.seerapi.com/v1/skill/26666"
                },
                {
                  "id": 26672,
                  "url": "https://api.seerapi.com/v1/skill/26672"
                },
                {
                  "id": 26675,
                  "url": "https://api.seerapi.com/v1/skill/26675"
                },
                {
                  "id": 26733,
                  "url": "https://api.seerapi.com/v1/skill/26733"
                },
                {
                  "id": 26763,
                  "url": "https://api.seerapi.com/v1/skill/26763"
                },
                {
                  "id": 26787,
                  "url": "https://api.seerapi.com/v1/skill/26787"
                },
                {
                  "id": 26813,
                  "url": "https://api.seerapi.com/v1/skill/26813"
                },
                {
                  "id": 26844,
                  "url": "https://api.seerapi.com/v1/skill/26844"
                },
                {
                  "id": 26875,
                  "url": "https://api.seerapi.com/v1/skill/26875"
                },
                {
                  "id": 26939,
                  "url": "https://api.seerapi.com/v1/skill/26939"
                },
                {
                  "id": 26944,
                  "url": "https://api.seerapi.com/v1/skill/26944"
                },
                {
                  "id": 26949,
                  "url": "https://api.seerapi.com/v1/skill/26949"
                },
                {
                  "id": 26996,
                  "url": "https://api.seerapi.com/v1/skill/26996"
                },
                {
                  "id": 27000,
                  "url": "https://api.seerapi.com/v1/skill/27000"
                },
                {
                  "id": 27011,
                  "url": "https://api.seerapi.com/v1/skill/27011"
                },
                {
                  "id": 27031,
                  "url": "https://api.seerapi.com/v1/skill/27031"
                },
                {
                  "id": 27036,
                  "url": "https://api.seerapi.com/v1/skill/27036"
                },
                {
                  "id": 27062,
                  "url": "https://api.seerapi.com/v1/skill/27062"
                },
                {
                  "id": 27076,
                  "url": "https://api.seerapi.com/v1/skill/27076"
                },
                {
                  "id": 27104,
                  "url": "https://api.seerapi.com/v1/skill/27104"
                },
                {
                  "id": 27136,
                  "url": "https://api.seerapi.com/v1/skill/27136"
                },
                {
                  "id": 27185,
                  "url": "https://api.seerapi.com/v1/skill/27185"
                },
                {
                  "id": 27189,
                  "url": "https://api.seerapi.com/v1/skill/27189"
                },
                {
                  "id": 27215,
                  "url": "https://api.seerapi.com/v1/skill/27215"
                },
                {
                  "id": 27273,
                  "url": "https://api.seerapi.com/v1/skill/27273"
                },
                {
                  "id": 27351,
                  "url": "https://api.seerapi.com/v1/skill/27351"
                },
                {
                  "id": 27361,
                  "url": "https://api.seerapi.com/v1/skill/27361"
                },
                {
                  "id": 27396,
                  "url": "https://api.seerapi.com/v1/skill/27396"
                },
                {
                  "id": 27552,
                  "url": "https://api.seerapi.com/v1/skill/27552"
                },
                {
                  "id": 27629,
                  "url": "https://api.seerapi.com/v1/skill/27629"
                },
                {
                  "id": 27698,
                  "url": "https://api.seerapi.com/v1/skill/27698"
                },
                {
                  "id": 27712,
                  "url": "https://api.seerapi.com/v1/skill/27712"
                },
                {
                  "id": 27724,
                  "url": "https://api.seerapi.com/v1/skill/27724"
                },
                {
                  "id": 27745,
                  "url": "https://api.seerapi.com/v1/skill/27745"
                },
                {
                  "id": 27757,
                  "url": "https://api.seerapi.com/v1/skill/27757"
                },
                {
                  "id": 27763,
                  "url": "https://api.seerapi.com/v1/skill/27763"
                },
                {
                  "id": 27785,
                  "url": "https://api.seerapi.com/v1/skill/27785"
                },
                {
                  "id": 27872,
                  "url": "https://api.seerapi.com/v1/skill/27872"
                },
                {
                  "id": 27893,
                  "url": "https://api.seerapi.com/v1/skill/27893"
                },
                {
                  "id": 27899,
                  "url": "https://api.seerapi.com/v1/skill/27899"
                },
                {
                  "id": 27937,
                  "url": "https://api.seerapi.com/v1/skill/27937"
                },
                {
                  "id": 27942,
                  "url": "https://api.seerapi.com/v1/skill/27942"
                },
                {
                  "id": 27950,
                  "url": "https://api.seerapi.com/v1/skill/27950"
                },
                {
                  "id": 27991,
                  "url": "https://api.seerapi.com/v1/skill/27991"
                },
                {
                  "id": 28018,
                  "url": "https://api.seerapi.com/v1/skill/28018"
                },
                {
                  "id": 28048,
                  "url": "https://api.seerapi.com/v1/skill/28048"
                },
                {
                  "id": 28068,
                  "url": "https://api.seerapi.com/v1/skill/28068"
                },
                {
                  "id": 28101,
                  "url": "https://api.seerapi.com/v1/skill/28101"
                },
                {
                  "id": 28139,
                  "url": "https://api.seerapi.com/v1/skill/28139"
                },
                {
                  "id": 28174,
                  "url": "https://api.seerapi.com/v1/skill/28174"
                },
                {
                  "id": 28214,
                  "url": "https://api.seerapi.com/v1/skill/28214"
                },
                {
                  "id": 28247,
                  "url": "https://api.seerapi.com/v1/skill/28247"
                },
                {
                  "id": 28272,
                  "url": "https://api.seerapi.com/v1/skill/28272"
                },
                {
                  "id": 28376,
                  "url": "https://api.seerapi.com/v1/skill/28376"
                },
                {
                  "id": 28400,
                  "url": "https://api.seerapi.com/v1/skill/28400"
                },
                {
                  "id": 28514,
                  "url": "https://api.seerapi.com/v1/skill/28514"
                },
                {
                  "id": 28553,
                  "url": "https://api.seerapi.com/v1/skill/28553"
                },
                {
                  "id": 28555,
                  "url": "https://api.seerapi.com/v1/skill/28555"
                },
                {
                  "id": 28660,
                  "url": "https://api.seerapi.com/v1/skill/28660"
                },
                {
                  "id": 28687,
                  "url": "https://api.seerapi.com/v1/skill/28687"
                },
                {
                  "id": 28753,
                  "url": "https://api.seerapi.com/v1/skill/28753"
                },
                {
                  "id": 28787,
                  "url": "https://api.seerapi.com/v1/skill/28787"
                },
                {
                  "id": 28820,
                  "url": "https://api.seerapi.com/v1/skill/28820"
                },
                {
                  "id": 28876,
                  "url": "https://api.seerapi.com/v1/skill/28876"
                },
                {
                  "id": 28902,
                  "url": "https://api.seerapi.com/v1/skill/28902"
                },
                {
                  "id": 28951,
                  "url": "https://api.seerapi.com/v1/skill/28951"
                },
                {
                  "id": 28965,
                  "url": "https://api.seerapi.com/v1/skill/28965"
                },
                {
                  "id": 28986,
                  "url": "https://api.seerapi.com/v1/skill/28986"
                },
                {
                  "id": 29104,
                  "url": "https://api.seerapi.com/v1/skill/29104"
                },
                {
                  "id": 29132,
                  "url": "https://api.seerapi.com/v1/skill/29132"
                },
                {
                  "id": 29146,
                  "url": "https://api.seerapi.com/v1/skill/29146"
                },
                {
                  "id": 29195,
                  "url": "https://api.seerapi.com/v1/skill/29195"
                },
                {
                  "id": 29402,
                  "url": "https://api.seerapi.com/v1/skill/29402"
                },
                {
                  "id": 29408,
                  "url": "https://api.seerapi.com/v1/skill/29408"
                },
                {
                  "id": 29475,
                  "url": "https://api.seerapi.com/v1/skill/29475"
                },
                {
                  "id": 36830,
                  "url": "https://api.seerapi.com/v1/skill/36830"
                },
                {
                  "id": 37985,
                  "url": "https://api.seerapi.com/v1/skill/37985"
                }
              ],
              "tag": [
                {
                  "id": 35850,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
                }
              ],
              "hash": "9905d388"
            },
            "cacheFile": "research/3629-source-check-external.json",
            "loadedAt": "2026-10-13T13:34:20.104Z",
            "storage": "existing-cache"
          }
        },
        {
          "species": 4663,
          "moveId": 28787,
          "moveName": "破阵燎原",
          "moveHash": "715c230",
          "index": 2,
          "effectId": 597,
          "args": [
            4,
            3
          ],
          "description": "4回合内每回合使用技能吸取对手最大体力的1/3",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/28787",
            "data": {
              "id": 28787,
              "name": "破阵燎原",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "全属性提升了；消除了对手的能力提升状态；开始吸取对手的体力了；出手变得更快了",
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
                  "info": "全属性+1，自身当前体力高于对手时强化效果翻倍",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1，自身当前体力高于对手时强化效果翻倍（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 885,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/885"
                  }
                },
                {
                  "info": "消除对手能力提升状态，消除成功则对手全属性-1",
                  "analyze_info": "[sprite name=iconHit]消除对手能力提升状态（boss有效），消除成功则对手[color=#52a5f2]全属性[/color]-1",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 1009,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1009"
                  }
                },
                {
                  "info": "4回合内每回合使用技能吸取对手最大体力的1/3",
                  "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/3",
                  "args": [
                    4,
                    3
                  ],
                  "effect": {
                    "id": 597,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/597"
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
              "hash": "715c230"
            },
            "loadedAt": "2026-10-26T07:48:47.236Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/597",
            "data": {
              "id": 597,
              "args_num": 2,
              "info": "{0}回合内每回合使用技能吸取对手最大体力的1/{1}",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]{0}回合内每回合使用技能[color=#52a5f2]吸取[/color]对手最大体力的1/{1}",
              "pve_effective": false,
              "param": null,
              "skill": [
                {
                  "id": 23373,
                  "url": "https://api.seerapi.com/v1/skill/23373"
                },
                {
                  "id": 23490,
                  "url": "https://api.seerapi.com/v1/skill/23490"
                },
                {
                  "id": 23669,
                  "url": "https://api.seerapi.com/v1/skill/23669"
                },
                {
                  "id": 23707,
                  "url": "https://api.seerapi.com/v1/skill/23707"
                },
                {
                  "id": 23739,
                  "url": "https://api.seerapi.com/v1/skill/23739"
                },
                {
                  "id": 23741,
                  "url": "https://api.seerapi.com/v1/skill/23741"
                },
                {
                  "id": 23781,
                  "url": "https://api.seerapi.com/v1/skill/23781"
                },
                {
                  "id": 23819,
                  "url": "https://api.seerapi.com/v1/skill/23819"
                },
                {
                  "id": 23950,
                  "url": "https://api.seerapi.com/v1/skill/23950"
                },
                {
                  "id": 24038,
                  "url": "https://api.seerapi.com/v1/skill/24038"
                },
                {
                  "id": 24067,
                  "url": "https://api.seerapi.com/v1/skill/24067"
                },
                {
                  "id": 24142,
                  "url": "https://api.seerapi.com/v1/skill/24142"
                },
                {
                  "id": 24172,
                  "url": "https://api.seerapi.com/v1/skill/24172"
                },
                {
                  "id": 24188,
                  "url": "https://api.seerapi.com/v1/skill/24188"
                },
                {
                  "id": 24234,
                  "url": "https://api.seerapi.com/v1/skill/24234"
                },
                {
                  "id": 24316,
                  "url": "https://api.seerapi.com/v1/skill/24316"
                },
                {
                  "id": 24433,
                  "url": "https://api.seerapi.com/v1/skill/24433"
                },
                {
                  "id": 24449,
                  "url": "https://api.seerapi.com/v1/skill/24449"
                },
                {
                  "id": 24501,
                  "url": "https://api.seerapi.com/v1/skill/24501"
                },
                {
                  "id": 24506,
                  "url": "https://api.seerapi.com/v1/skill/24506"
                },
                {
                  "id": 24528,
                  "url": "https://api.seerapi.com/v1/skill/24528"
                },
                {
                  "id": 24562,
                  "url": "https://api.seerapi.com/v1/skill/24562"
                },
                {
                  "id": 24602,
                  "url": "https://api.seerapi.com/v1/skill/24602"
                },
                {
                  "id": 24713,
                  "url": "https://api.seerapi.com/v1/skill/24713"
                },
                {
                  "id": 24786,
                  "url": "https://api.seerapi.com/v1/skill/24786"
                },
                {
                  "id": 24792,
                  "url": "https://api.seerapi.com/v1/skill/24792"
                },
                {
                  "id": 24803,
                  "url": "https://api.seerapi.com/v1/skill/24803"
                },
                {
                  "id": 24831,
                  "url": "https://api.seerapi.com/v1/skill/24831"
                },
                {
                  "id": 24849,
                  "url": "https://api.seerapi.com/v1/skill/24849"
                },
                {
                  "id": 24866,
                  "url": "https://api.seerapi.com/v1/skill/24866"
                },
                {
                  "id": 24882,
                  "url": "https://api.seerapi.com/v1/skill/24882"
                },
                {
                  "id": 24898,
                  "url": "https://api.seerapi.com/v1/skill/24898"
                },
                {
                  "id": 24948,
                  "url": "https://api.seerapi.com/v1/skill/24948"
                },
                {
                  "id": 25000,
                  "url": "https://api.seerapi.com/v1/skill/25000"
                },
                {
                  "id": 25092,
                  "url": "https://api.seerapi.com/v1/skill/25092"
                },
                {
                  "id": 25105,
                  "url": "https://api.seerapi.com/v1/skill/25105"
                },
                {
                  "id": 25116,
                  "url": "https://api.seerapi.com/v1/skill/25116"
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
                  "id": 25165,
                  "url": "https://api.seerapi.com/v1/skill/25165"
                },
                {
                  "id": 25184,
                  "url": "https://api.seerapi.com/v1/skill/25184"
                },
                {
                  "id": 25194,
                  "url": "https://api.seerapi.com/v1/skill/25194"
                },
                {
                  "id": 25215,
                  "url": "https://api.seerapi.com/v1/skill/25215"
                },
                {
                  "id": 25226,
                  "url": "https://api.seerapi.com/v1/skill/25226"
                },
                {
                  "id": 25254,
                  "url": "https://api.seerapi.com/v1/skill/25254"
                },
                {
                  "id": 25282,
                  "url": "https://api.seerapi.com/v1/skill/25282"
                },
                {
                  "id": 25297,
                  "url": "https://api.seerapi.com/v1/skill/25297"
                },
                {
                  "id": 25307,
                  "url": "https://api.seerapi.com/v1/skill/25307"
                },
                {
                  "id": 25319,
                  "url": "https://api.seerapi.com/v1/skill/25319"
                },
                {
                  "id": 25331,
                  "url": "https://api.seerapi.com/v1/skill/25331"
                },
                {
                  "id": 25346,
                  "url": "https://api.seerapi.com/v1/skill/25346"
                },
                {
                  "id": 25356,
                  "url": "https://api.seerapi.com/v1/skill/25356"
                },
                {
                  "id": 25364,
                  "url": "https://api.seerapi.com/v1/skill/25364"
                },
                {
                  "id": 25389,
                  "url": "https://api.seerapi.com/v1/skill/25389"
                },
                {
                  "id": 25392,
                  "url": "https://api.seerapi.com/v1/skill/25392"
                },
                {
                  "id": 25413,
                  "url": "https://api.seerapi.com/v1/skill/25413"
                },
                {
                  "id": 25416,
                  "url": "https://api.seerapi.com/v1/skill/25416"
                },
                {
                  "id": 25428,
                  "url": "https://api.seerapi.com/v1/skill/25428"
                },
                {
                  "id": 25433,
                  "url": "https://api.seerapi.com/v1/skill/25433"
                },
                {
                  "id": 25450,
                  "url": "https://api.seerapi.com/v1/skill/25450"
                },
                {
                  "id": 25464,
                  "url": "https://api.seerapi.com/v1/skill/25464"
                },
                {
                  "id": 25498,
                  "url": "https://api.seerapi.com/v1/skill/25498"
                },
                {
                  "id": 25508,
                  "url": "https://api.seerapi.com/v1/skill/25508"
                },
                {
                  "id": 25523,
                  "url": "https://api.seerapi.com/v1/skill/25523"
                },
                {
                  "id": 25533,
                  "url": "https://api.seerapi.com/v1/skill/25533"
                },
                {
                  "id": 25557,
                  "url": "https://api.seerapi.com/v1/skill/25557"
                },
                {
                  "id": 25603,
                  "url": "https://api.seerapi.com/v1/skill/25603"
                },
                {
                  "id": 25627,
                  "url": "https://api.seerapi.com/v1/skill/25627"
                },
                {
                  "id": 25639,
                  "url": "https://api.seerapi.com/v1/skill/25639"
                },
                {
                  "id": 25647,
                  "url": "https://api.seerapi.com/v1/skill/25647"
                },
                {
                  "id": 25644,
                  "url": "https://api.seerapi.com/v1/skill/25644"
                },
                {
                  "id": 25674,
                  "url": "https://api.seerapi.com/v1/skill/25674"
                },
                {
                  "id": 25682,
                  "url": "https://api.seerapi.com/v1/skill/25682"
                },
                {
                  "id": 25691,
                  "url": "https://api.seerapi.com/v1/skill/25691"
                },
                {
                  "id": 25705,
                  "url": "https://api.seerapi.com/v1/skill/25705"
                },
                {
                  "id": 25708,
                  "url": "https://api.seerapi.com/v1/skill/25708"
                },
                {
                  "id": 25714,
                  "url": "https://api.seerapi.com/v1/skill/25714"
                },
                {
                  "id": 25716,
                  "url": "https://api.seerapi.com/v1/skill/25716"
                },
                {
                  "id": 25722,
                  "url": "https://api.seerapi.com/v1/skill/25722"
                },
                {
                  "id": 25731,
                  "url": "https://api.seerapi.com/v1/skill/25731"
                },
                {
                  "id": 25737,
                  "url": "https://api.seerapi.com/v1/skill/25737"
                },
                {
                  "id": 25762,
                  "url": "https://api.seerapi.com/v1/skill/25762"
                },
                {
                  "id": 25765,
                  "url": "https://api.seerapi.com/v1/skill/25765"
                },
                {
                  "id": 25768,
                  "url": "https://api.seerapi.com/v1/skill/25768"
                },
                {
                  "id": 25796,
                  "url": "https://api.seerapi.com/v1/skill/25796"
                },
                {
                  "id": 25823,
                  "url": "https://api.seerapi.com/v1/skill/25823"
                },
                {
                  "id": 25838,
                  "url": "https://api.seerapi.com/v1/skill/25838"
                },
                {
                  "id": 25845,
                  "url": "https://api.seerapi.com/v1/skill/25845"
                },
                {
                  "id": 25849,
                  "url": "https://api.seerapi.com/v1/skill/25849"
                },
                {
                  "id": 25851,
                  "url": "https://api.seerapi.com/v1/skill/25851"
                },
                {
                  "id": 25859,
                  "url": "https://api.seerapi.com/v1/skill/25859"
                },
                {
                  "id": 25906,
                  "url": "https://api.seerapi.com/v1/skill/25906"
                },
                {
                  "id": 25916,
                  "url": "https://api.seerapi.com/v1/skill/25916"
                },
                {
                  "id": 25925,
                  "url": "https://api.seerapi.com/v1/skill/25925"
                },
                {
                  "id": 25942,
                  "url": "https://api.seerapi.com/v1/skill/25942"
                },
                {
                  "id": 25958,
                  "url": "https://api.seerapi.com/v1/skill/25958"
                },
                {
                  "id": 25978,
                  "url": "https://api.seerapi.com/v1/skill/25978"
                },
                {
                  "id": 26014,
                  "url": "https://api.seerapi.com/v1/skill/26014"
                },
                {
                  "id": 26021,
                  "url": "https://api.seerapi.com/v1/skill/26021"
                },
                {
                  "id": 26035,
                  "url": "https://api.seerapi.com/v1/skill/26035"
                },
                {
                  "id": 26043,
                  "url": "https://api.seerapi.com/v1/skill/26043"
                },
                {
                  "id": 26060,
                  "url": "https://api.seerapi.com/v1/skill/26060"
                },
                {
                  "id": 26063,
                  "url": "https://api.seerapi.com/v1/skill/26063"
                },
                {
                  "id": 26117,
                  "url": "https://api.seerapi.com/v1/skill/26117"
                },
                {
                  "id": 26123,
                  "url": "https://api.seerapi.com/v1/skill/26123"
                },
                {
                  "id": 26131,
                  "url": "https://api.seerapi.com/v1/skill/26131"
                },
                {
                  "id": 26149,
                  "url": "https://api.seerapi.com/v1/skill/26149"
                },
                {
                  "id": 26155,
                  "url": "https://api.seerapi.com/v1/skill/26155"
                },
                {
                  "id": 26169,
                  "url": "https://api.seerapi.com/v1/skill/26169"
                },
                {
                  "id": 26175,
                  "url": "https://api.seerapi.com/v1/skill/26175"
                },
                {
                  "id": 26184,
                  "url": "https://api.seerapi.com/v1/skill/26184"
                },
                {
                  "id": 26186,
                  "url": "https://api.seerapi.com/v1/skill/26186"
                },
                {
                  "id": 26192,
                  "url": "https://api.seerapi.com/v1/skill/26192"
                },
                {
                  "id": 26198,
                  "url": "https://api.seerapi.com/v1/skill/26198"
                },
                {
                  "id": 26204,
                  "url": "https://api.seerapi.com/v1/skill/26204"
                },
                {
                  "id": 26226,
                  "url": "https://api.seerapi.com/v1/skill/26226"
                },
                {
                  "id": 26233,
                  "url": "https://api.seerapi.com/v1/skill/26233"
                },
                {
                  "id": 26269,
                  "url": "https://api.seerapi.com/v1/skill/26269"
                },
                {
                  "id": 26315,
                  "url": "https://api.seerapi.com/v1/skill/26315"
                },
                {
                  "id": 26357,
                  "url": "https://api.seerapi.com/v1/skill/26357"
                },
                {
                  "id": 26362,
                  "url": "https://api.seerapi.com/v1/skill/26362"
                },
                {
                  "id": 26418,
                  "url": "https://api.seerapi.com/v1/skill/26418"
                },
                {
                  "id": 26433,
                  "url": "https://api.seerapi.com/v1/skill/26433"
                },
                {
                  "id": 26453,
                  "url": "https://api.seerapi.com/v1/skill/26453"
                },
                {
                  "id": 26572,
                  "url": "https://api.seerapi.com/v1/skill/26572"
                },
                {
                  "id": 26666,
                  "url": "https://api.seerapi.com/v1/skill/26666"
                },
                {
                  "id": 26672,
                  "url": "https://api.seerapi.com/v1/skill/26672"
                },
                {
                  "id": 26675,
                  "url": "https://api.seerapi.com/v1/skill/26675"
                },
                {
                  "id": 26733,
                  "url": "https://api.seerapi.com/v1/skill/26733"
                },
                {
                  "id": 26763,
                  "url": "https://api.seerapi.com/v1/skill/26763"
                },
                {
                  "id": 26787,
                  "url": "https://api.seerapi.com/v1/skill/26787"
                },
                {
                  "id": 26813,
                  "url": "https://api.seerapi.com/v1/skill/26813"
                },
                {
                  "id": 26844,
                  "url": "https://api.seerapi.com/v1/skill/26844"
                },
                {
                  "id": 26875,
                  "url": "https://api.seerapi.com/v1/skill/26875"
                },
                {
                  "id": 26939,
                  "url": "https://api.seerapi.com/v1/skill/26939"
                },
                {
                  "id": 26944,
                  "url": "https://api.seerapi.com/v1/skill/26944"
                },
                {
                  "id": 26949,
                  "url": "https://api.seerapi.com/v1/skill/26949"
                },
                {
                  "id": 26996,
                  "url": "https://api.seerapi.com/v1/skill/26996"
                },
                {
                  "id": 27000,
                  "url": "https://api.seerapi.com/v1/skill/27000"
                },
                {
                  "id": 27011,
                  "url": "https://api.seerapi.com/v1/skill/27011"
                },
                {
                  "id": 27031,
                  "url": "https://api.seerapi.com/v1/skill/27031"
                },
                {
                  "id": 27036,
                  "url": "https://api.seerapi.com/v1/skill/27036"
                },
                {
                  "id": 27062,
                  "url": "https://api.seerapi.com/v1/skill/27062"
                },
                {
                  "id": 27076,
                  "url": "https://api.seerapi.com/v1/skill/27076"
                },
                {
                  "id": 27104,
                  "url": "https://api.seerapi.com/v1/skill/27104"
                },
                {
                  "id": 27136,
                  "url": "https://api.seerapi.com/v1/skill/27136"
                },
                {
                  "id": 27185,
                  "url": "https://api.seerapi.com/v1/skill/27185"
                },
                {
                  "id": 27189,
                  "url": "https://api.seerapi.com/v1/skill/27189"
                },
                {
                  "id": 27215,
                  "url": "https://api.seerapi.com/v1/skill/27215"
                },
                {
                  "id": 27273,
                  "url": "https://api.seerapi.com/v1/skill/27273"
                },
                {
                  "id": 27351,
                  "url": "https://api.seerapi.com/v1/skill/27351"
                },
                {
                  "id": 27361,
                  "url": "https://api.seerapi.com/v1/skill/27361"
                },
                {
                  "id": 27396,
                  "url": "https://api.seerapi.com/v1/skill/27396"
                },
                {
                  "id": 27552,
                  "url": "https://api.seerapi.com/v1/skill/27552"
                },
                {
                  "id": 27629,
                  "url": "https://api.seerapi.com/v1/skill/27629"
                },
                {
                  "id": 27698,
                  "url": "https://api.seerapi.com/v1/skill/27698"
                },
                {
                  "id": 27712,
                  "url": "https://api.seerapi.com/v1/skill/27712"
                },
                {
                  "id": 27724,
                  "url": "https://api.seerapi.com/v1/skill/27724"
                },
                {
                  "id": 27745,
                  "url": "https://api.seerapi.com/v1/skill/27745"
                },
                {
                  "id": 27757,
                  "url": "https://api.seerapi.com/v1/skill/27757"
                },
                {
                  "id": 27763,
                  "url": "https://api.seerapi.com/v1/skill/27763"
                },
                {
                  "id": 27785,
                  "url": "https://api.seerapi.com/v1/skill/27785"
                },
                {
                  "id": 27872,
                  "url": "https://api.seerapi.com/v1/skill/27872"
                },
                {
                  "id": 27893,
                  "url": "https://api.seerapi.com/v1/skill/27893"
                },
                {
                  "id": 27899,
                  "url": "https://api.seerapi.com/v1/skill/27899"
                },
                {
                  "id": 27937,
                  "url": "https://api.seerapi.com/v1/skill/27937"
                },
                {
                  "id": 27942,
                  "url": "https://api.seerapi.com/v1/skill/27942"
                },
                {
                  "id": 27950,
                  "url": "https://api.seerapi.com/v1/skill/27950"
                },
                {
                  "id": 27991,
                  "url": "https://api.seerapi.com/v1/skill/27991"
                },
                {
                  "id": 28018,
                  "url": "https://api.seerapi.com/v1/skill/28018"
                },
                {
                  "id": 28048,
                  "url": "https://api.seerapi.com/v1/skill/28048"
                },
                {
                  "id": 28068,
                  "url": "https://api.seerapi.com/v1/skill/28068"
                },
                {
                  "id": 28101,
                  "url": "https://api.seerapi.com/v1/skill/28101"
                },
                {
                  "id": 28139,
                  "url": "https://api.seerapi.com/v1/skill/28139"
                },
                {
                  "id": 28174,
                  "url": "https://api.seerapi.com/v1/skill/28174"
                },
                {
                  "id": 28214,
                  "url": "https://api.seerapi.com/v1/skill/28214"
                },
                {
                  "id": 28247,
                  "url": "https://api.seerapi.com/v1/skill/28247"
                },
                {
                  "id": 28272,
                  "url": "https://api.seerapi.com/v1/skill/28272"
                },
                {
                  "id": 28376,
                  "url": "https://api.seerapi.com/v1/skill/28376"
                },
                {
                  "id": 28400,
                  "url": "https://api.seerapi.com/v1/skill/28400"
                },
                {
                  "id": 28514,
                  "url": "https://api.seerapi.com/v1/skill/28514"
                },
                {
                  "id": 28553,
                  "url": "https://api.seerapi.com/v1/skill/28553"
                },
                {
                  "id": 28555,
                  "url": "https://api.seerapi.com/v1/skill/28555"
                },
                {
                  "id": 28660,
                  "url": "https://api.seerapi.com/v1/skill/28660"
                },
                {
                  "id": 28687,
                  "url": "https://api.seerapi.com/v1/skill/28687"
                },
                {
                  "id": 28753,
                  "url": "https://api.seerapi.com/v1/skill/28753"
                },
                {
                  "id": 28787,
                  "url": "https://api.seerapi.com/v1/skill/28787"
                },
                {
                  "id": 28820,
                  "url": "https://api.seerapi.com/v1/skill/28820"
                },
                {
                  "id": 28876,
                  "url": "https://api.seerapi.com/v1/skill/28876"
                },
                {
                  "id": 28902,
                  "url": "https://api.seerapi.com/v1/skill/28902"
                },
                {
                  "id": 28951,
                  "url": "https://api.seerapi.com/v1/skill/28951"
                },
                {
                  "id": 28965,
                  "url": "https://api.seerapi.com/v1/skill/28965"
                },
                {
                  "id": 28986,
                  "url": "https://api.seerapi.com/v1/skill/28986"
                },
                {
                  "id": 29104,
                  "url": "https://api.seerapi.com/v1/skill/29104"
                },
                {
                  "id": 29132,
                  "url": "https://api.seerapi.com/v1/skill/29132"
                },
                {
                  "id": 29146,
                  "url": "https://api.seerapi.com/v1/skill/29146"
                },
                {
                  "id": 29195,
                  "url": "https://api.seerapi.com/v1/skill/29195"
                },
                {
                  "id": 29402,
                  "url": "https://api.seerapi.com/v1/skill/29402"
                },
                {
                  "id": 29408,
                  "url": "https://api.seerapi.com/v1/skill/29408"
                },
                {
                  "id": 29475,
                  "url": "https://api.seerapi.com/v1/skill/29475"
                },
                {
                  "id": 36830,
                  "url": "https://api.seerapi.com/v1/skill/36830"
                },
                {
                  "id": 37985,
                  "url": "https://api.seerapi.com/v1/skill/37985"
                }
              ],
              "tag": [
                {
                  "id": 35850,
                  "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35850"
                }
              ],
              "hash": "9905d388"
            },
            "cacheFile": "research/3629-source-check-external.json",
            "loadedAt": "2026-10-13T13:34:20.104Z",
            "storage": "existing-cache"
          }
        }
      ],
      "gap": "持续使用技能吸取效果是否包含授予当次",
      "checked": [
        "当前SeerAPI完整实例及Wiki补源",
        "冻结历史确认未扩大范围，未读取原问题MD新增回答"
      ],
      "question": "请按该公共问题确认上述4663真实来源实例的持续使用技能吸取效果是否包含授予当次。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4600-005 · 4663新增关联

```json
{
  "id": "Q-N50-4600-005",
  "instances": [
    {
      "id": "Q-N50-4600-005",
      "instances": [
        {
          "species": 4663,
          "moveId": 37475,
          "moveName": "溃煞腾龙舞",
          "moveHash": "7eb4b679",
          "index": 2,
          "effectId": 1120,
          "args": [
            300,
            300
          ],
          "description": "造成的伤害低于300则为自身附加300点护盾",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/37475",
            "data": {
              "id": 37475,
              "name": "溃煞腾龙舞",
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
                "id": 47,
                "url": "https://api.seerapi.com/v1/element_type_combination/47"
              },
              "learned_by_pet": [],
              "skill_effect": [
                {
                  "info": "吸取对手能力提升状态，吸取成功则对手2回合内无法通过自身技能恢复体力",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态，[color=#52a5f2]吸取[/color]成功则对手2回合内[color=#52a5f2]无法通过自身技能恢复体力[/color]（boss有效）",
                  "args": [
                    2
                  ],
                  "effect": {
                    "id": 1199,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1199"
                  }
                },
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
                  "info": "造成的伤害低于300则为自身附加300点护盾",
                  "analyze_info": "[sprite name=iconHit]造成的伤害低于300则为自身附加300点[color=#57c975]护盾[/color]（boss有效）",
                  "args": [
                    300,
                    300
                  ],
                  "effect": {
                    "id": 1120,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1120"
                  }
                },
                {
                  "info": "3回合内若对手攻击MISS则回合结束时吸取对手最大体力的1/3",
                  "analyze_info": "[sprite name=iconHit]3回合内若对手攻击MISS则[color=#57c975]回合结束时[/color][color=#52a5f2]吸取[/color]对手最大体力的1/3（boss有效）",
                  "args": [
                    3,
                    3
                  ],
                  "effect": {
                    "id": 1320,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1320"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "7eb4b679"
            },
            "loadedAt": "2026-10-26T07:49:07.218Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1120",
            "data": {
              "id": 1120,
              "args_num": 2,
              "info": "造成的伤害低于{0}则为自身附加{1}点护盾",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]造成的伤害低于{0}则为自身附加{1}点[color=#57c975]护盾[/color]（boss有效）",
              "pve_effective": true,
              "param": null,
              "hash": "bbcadb3d"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:49:07.419Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        }
      ],
      "gap": "已有护盾时再授300盾的合并/覆盖范围",
      "checked": [
        "当前SeerAPI完整实例及Wiki补源",
        "冻结历史确认未扩大范围，未读取原问题MD新增回答"
      ],
      "question": "请按该公共问题确认上述4663真实来源实例的已有护盾时再授300盾的合并/覆盖范围。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4618-002 · 4663新增关联

```json
{
  "id": "Q-N50-4618-002",
  "instances": [
    {
      "id": "Q-N50-4618-002",
      "instances": [
        {
          "species": 4663,
          "moveId": 25713,
          "moveName": "迷离身姿",
          "moveHash": "a5606888",
          "index": 1,
          "effectId": 1200,
          "args": [
            4,
            70,
            22
          ],
          "description": "4回合内受到攻击则70%对手焚烬，未触发则消除对手回合类效果",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/25713",
            "data": {
              "id": 25713,
              "name": "迷离身姿",
              "power": 0,
              "max_pp": 5,
              "accuracy": 100,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始抵抗异常状态了；受到攻击则使对手焚烬，未触发则消除对手回合类效果；免疫受到的攻击",
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
                  "info": "3回合内免疫所有受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]3回合内免疫所有受到的异常状态（boss有效）",
                  "args": [
                    3
                  ],
                  "effect": {
                    "id": 48,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/48"
                  }
                },
                {
                  "info": "4回合内受到攻击则70%对手焚烬，未触发则消除对手回合类效果",
                  "analyze_info": "[sprite name=iconHit]4回合内受到攻击则70%对手[color=#57c975]焚烬[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
                  "args": [
                    4,
                    70,
                    22
                  ],
                  "effect": {
                    "id": 1200,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1200"
                  }
                },
                {
                  "info": "免疫下1次对手的攻击",
                  "analyze_info": "[sprite name=iconHit]免疫下1次对手的攻击（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 570,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/570"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "a5606888"
            },
            "loadedAt": "2026-10-26T07:48:00.893Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1200",
            "data": {
              "id": 1200,
              "args_num": 3,
              "info": "{0}回合内受到攻击则{1}%对手{2}，未触发则消除对手回合类效果",
              "info_formatting_adjustment": "{0}回合内受到攻击则{1}%对手{2}\r\n--><condition>未触发</condition>则消除对手回合类效果",
              "analyze_info": "[sprite name=iconHit]{0}回合内受到攻击则{1}%对手[color=#57c975]{2}[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
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
              "hash": "26920ba9"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:48:01.016Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        },
        {
          "species": 4663,
          "moveId": 28786,
          "moveName": "无踪绰影",
          "moveHash": "26b6d6a3",
          "index": 2,
          "effectId": 1200,
          "args": [
            4,
            100,
            22
          ],
          "description": "4回合内受到攻击则100%对手焚烬，未触发则消除对手回合类效果",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/28786",
            "data": {
              "id": 28786,
              "name": "无踪绰影",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；开始免疫能力下降状态了；开始免疫对手的攻击了；自身被火焰所保护",
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
                  "info": "4回合内受到攻击则100%对手焚烬，未触发则消除对手回合类效果",
                  "analyze_info": "[sprite name=iconHit]4回合内受到攻击则100%对手[color=#57c975]焚烬[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
                  "args": [
                    4,
                    100,
                    22
                  ],
                  "effect": {
                    "id": 1200,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1200"
                  }
                },
                {
                  "info": "免疫下1次对手的攻击",
                  "analyze_info": "[sprite name=iconHit]免疫下1次对手的攻击（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 570,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/570"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "26b6d6a3"
            },
            "loadedAt": "2026-10-26T07:48:33.821Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1200",
            "data": {
              "id": 1200,
              "args_num": 3,
              "info": "{0}回合内受到攻击则{1}%对手{2}，未触发则消除对手回合类效果",
              "info_formatting_adjustment": "{0}回合内受到攻击则{1}%对手{2}\r\n--><condition>未触发</condition>则消除对手回合类效果",
              "analyze_info": "[sprite name=iconHit]{0}回合内受到攻击则{1}%对手[color=#57c975]{2}[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
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
              "hash": "26920ba9"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:48:01.016Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        }
      ],
      "gap": "实际完整零伤/MISS/整招无效是否算受到攻击",
      "checked": [
        "当前SeerAPI完整实例及Wiki补源",
        "冻结历史确认未扩大范围，未读取原问题MD新增回答"
      ],
      "question": "请按该公共问题确认上述4663真实来源实例的实际完整零伤/MISS/整招无效是否算受到攻击。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-A60-4075-012 · 4663新增关联

```json
{
  "id": "Q-A60-4075-012",
  "instances": [
    {
      "id": "Q-A60-4075-012",
      "instances": [
        {
          "species": 4663,
          "moveId": 25713,
          "moveName": "迷离身姿",
          "moveHash": "a5606888",
          "index": 1,
          "effectId": 1200,
          "args": [
            4,
            70,
            22
          ],
          "description": "4回合内受到攻击则70%对手焚烬，未触发则消除对手回合类效果",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/25713",
            "data": {
              "id": 25713,
              "name": "迷离身姿",
              "power": 0,
              "max_pp": 5,
              "accuracy": 100,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始抵抗异常状态了；受到攻击则使对手焚烬，未触发则消除对手回合类效果；免疫受到的攻击",
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
                  "info": "3回合内免疫所有受到的异常状态",
                  "analyze_info": "[sprite name=iconHit]3回合内免疫所有受到的异常状态（boss有效）",
                  "args": [
                    3
                  ],
                  "effect": {
                    "id": 48,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/48"
                  }
                },
                {
                  "info": "4回合内受到攻击则70%对手焚烬，未触发则消除对手回合类效果",
                  "analyze_info": "[sprite name=iconHit]4回合内受到攻击则70%对手[color=#57c975]焚烬[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
                  "args": [
                    4,
                    70,
                    22
                  ],
                  "effect": {
                    "id": 1200,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1200"
                  }
                },
                {
                  "info": "免疫下1次对手的攻击",
                  "analyze_info": "[sprite name=iconHit]免疫下1次对手的攻击（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 570,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/570"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "a5606888"
            },
            "loadedAt": "2026-10-26T07:48:00.893Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1200",
            "data": {
              "id": 1200,
              "args_num": 3,
              "info": "{0}回合内受到攻击则{1}%对手{2}，未触发则消除对手回合类效果",
              "info_formatting_adjustment": "{0}回合内受到攻击则{1}%对手{2}\r\n--><condition>未触发</condition>则消除对手回合类效果",
              "analyze_info": "[sprite name=iconHit]{0}回合内受到攻击则{1}%对手[color=#57c975]{2}[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
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
              "hash": "26920ba9"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:48:01.016Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        },
        {
          "species": 4663,
          "moveId": 28786,
          "moveName": "无踪绰影",
          "moveHash": "26b6d6a3",
          "index": 2,
          "effectId": 1200,
          "args": [
            4,
            100,
            22
          ],
          "description": "4回合内受到攻击则100%对手焚烬，未触发则消除对手回合类效果",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/28786",
            "data": {
              "id": 28786,
              "name": "无踪绰影",
              "power": 0,
              "max_pp": 5,
              "accuracy": 95,
              "crit_rate": null,
              "priority": 0,
              "must_hit": true,
              "atk_num": 1,
              "info": "开始免疫并反弹受到的异常状态了；开始免疫能力下降状态了；开始免疫对手的攻击了；自身被火焰所保护",
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
                  "info": "4回合内受到攻击则100%对手焚烬，未触发则消除对手回合类效果",
                  "analyze_info": "[sprite name=iconHit]4回合内受到攻击则100%对手[color=#57c975]焚烬[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
                  "args": [
                    4,
                    100,
                    22
                  ],
                  "effect": {
                    "id": 1200,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1200"
                  }
                },
                {
                  "info": "免疫下1次对手的攻击",
                  "analyze_info": "[sprite name=iconHit]免疫下1次对手的攻击（boss有效）",
                  "args": [
                    1
                  ],
                  "effect": {
                    "id": 570,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/570"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "26b6d6a3"
            },
            "loadedAt": "2026-10-26T07:48:33.821Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1200",
            "data": {
              "id": 1200,
              "args_num": 3,
              "info": "{0}回合内受到攻击则{1}%对手{2}，未触发则消除对手回合类效果",
              "info_formatting_adjustment": "{0}回合内受到攻击则{1}%对手{2}\r\n--><condition>未触发</condition>则消除对手回合类效果",
              "analyze_info": "[sprite name=iconHit]{0}回合内受到攻击则{1}%对手[color=#57c975]{2}[/color]，[color=#52a5f2]未触发[/color]则消除对手[color=#52a5f2]回合类效果[/color]",
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
              "hash": "26920ba9"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:48:01.016Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        }
      ],
      "gap": "真实多段攻击时受攻反应的逐段或整招单位",
      "checked": [
        "当前SeerAPI完整实例及Wiki补源",
        "冻结历史确认未扩大范围，未读取原问题MD新增回答"
      ],
      "question": "请按该公共问题确认上述4663真实来源实例的真实多段攻击时受攻反应的逐段或整招单位。",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4665-001 · 4663新增关联

```json
{
  "id": "Q-N50-4665-001",
  "instances": [
    {
      "id": "Q-N50-4665-001",
      "instances": [
        {
          "species": 4663,
          "moveId": 37475,
          "moveName": "溃煞腾龙舞",
          "moveHash": "7eb4b679",
          "index": 2,
          "effectId": 1120,
          "args": [
            300,
            300
          ],
          "description": "造成的伤害低于300则为自身附加300点护盾",
          "fullMove": {
            "url": "https://api.seerapi.com/v1/skill/37475",
            "data": {
              "id": 37475,
              "name": "溃煞腾龙舞",
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
                "id": 47,
                "url": "https://api.seerapi.com/v1/element_type_combination/47"
              },
              "learned_by_pet": [],
              "skill_effect": [
                {
                  "info": "吸取对手能力提升状态，吸取成功则对手2回合内无法通过自身技能恢复体力",
                  "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态，[color=#52a5f2]吸取[/color]成功则对手2回合内[color=#52a5f2]无法通过自身技能恢复体力[/color]（boss有效）",
                  "args": [
                    2
                  ],
                  "effect": {
                    "id": 1199,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1199"
                  }
                },
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
                  "info": "造成的伤害低于300则为自身附加300点护盾",
                  "analyze_info": "[sprite name=iconHit]造成的伤害低于300则为自身附加300点[color=#57c975]护盾[/color]（boss有效）",
                  "args": [
                    300,
                    300
                  ],
                  "effect": {
                    "id": 1120,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1120"
                  }
                },
                {
                  "info": "3回合内若对手攻击MISS则回合结束时吸取对手最大体力的1/3",
                  "analyze_info": "[sprite name=iconHit]3回合内若对手攻击MISS则[color=#57c975]回合结束时[/color][color=#52a5f2]吸取[/color]对手最大体力的1/3（boss有效）",
                  "args": [
                    3,
                    3
                  ],
                  "effect": {
                    "id": 1320,
                    "url": "https://api.seerapi.com/v1/skill_effect_type/1320"
                  }
                }
              ],
              "friend_skill_effect": [],
              "hide_effect": null,
              "advance": null,
              "hash": "7eb4b679"
            },
            "loadedAt": "2026-10-26T07:49:07.218Z",
            "storage": "refreshed"
          },
          "fullTemplate": {
            "url": "https://api.seerapi.com/v1/skill_effect_type/1120",
            "data": {
              "id": 1120,
              "args_num": 2,
              "info": "造成的伤害低于{0}则为自身附加{1}点护盾",
              "info_formatting_adjustment": null,
              "analyze_info": "[sprite name=iconHit]造成的伤害低于{0}则为自身附加{1}点[color=#57c975]护盾[/color]（boss有效）",
              "pve_effective": true,
              "param": null,
              "hash": "bbcadb3d"
            },
            "cacheFile": "research/selected-current-batch.json",
            "storage": "existing-cache",
            "originalLoadedAt": null,
            "loadedAt": "2026-10-26T07:49:07.419Z",
            "loadedAtMeaning": "本次读取真实历史API缓存的时间；历史上游请求时间缺失，不伪称本次网络查询"
          }
        }
      ],
      "gap": "与魂1868的完整0低于阈值共用判断缺口；1120攻击免疫阻断全部普通技能载荷已明确不触发，此关联限护盾吸尽后的载荷可执行分支",
      "checked": [
        "当前1120原文造成的伤害低于300",
        "Q-DAMAGE-001只明确0不触发正伤害事件，未明确此低于阈值判断；不把3847魂1120的零伤反击特定确认误当技能1120通则"
      ],
      "question": "护盾完全抵挡令本次完整结算伤害0，但技能载荷仍可执行时，1120低于300的护盾分支是否触发？",
      "answer": ""
    }
  ]
}
```

我的回答：
