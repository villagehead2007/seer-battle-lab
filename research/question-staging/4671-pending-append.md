

## 4671 · 原固定第49只

65项逐审、132来源检查0；生产349/349 exit0，本只52项。全部独立工作完成，部分实现待确认；多精灵延期1项。未正式部署/验收。用户编辑期间仅暂存。

### Q-N50-4671-001

```json
{
  "id": "Q-N50-4671-001",
  "species": 4671,
  "source": {
    "id": 1873,
    "description": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
    "analyze_desc": "",
    "hash": "ffc2de4b",
    "eid": 2273,
    "args": [
      4,
      1,
      2,
      1,
      3,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1873",
      "revision": "ffc2de4b",
      "loadedAt": "2026-10-26T08:05:24.393Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  "checked": [
    {
      "snapshot": {
        "file": "research/4671-reviewed-snapshot.json",
        "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
      },
      "supplement": {
        "file": "research/4671-source-supplement-audit.json",
        "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
      },
      "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
    },
    {
      "title": "魂印:1873",
      "pageid": 161541,
      "missing": false,
      "revision": 320408,
      "timestamp": "2025-10-21T05:10:04Z",
      "sourceURL": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E9%AD%82%E5%8D%B0%3A1873%7C%E7%B2%BE%E7%81%B5%3A4671%7C%E5%99%AC%E5%A4%9C%E7%96%BE%E8%A2%AD%C2%B7%E5%BA%93%E6%8B%89%E5%A1%94%E5%85%8B%7C%E6%95%88%E6%9E%9C%3A5%7C%E6%95%88%E6%9E%9C%3A15%7C%E6%95%88%E6%9E%9C%3A12%7C%E6%95%88%E6%9E%9C%3A4%7C%E6%95%88%E6%9E%9C%3A931%7C%E6%95%88%E6%9E%9C%3A1108%7C%E6%95%88%E6%9E%9C%3A428%7C%E6%95%88%E6%9E%9C%3A2059%7C%E6%95%88%E6%9E%9C%3A718%7C%E6%95%88%E6%9E%9C%3A191%7C%E6%95%88%E6%9E%9C%3A914%7C%E6%95%88%E6%9E%9C%3A886%7C%E6%95%88%E6%9E%9C%3A1393%7C%E6%95%88%E6%9E%9C%3A2071%7C%E6%95%88%E6%9E%9C%3A991%7C%E6%95%88%E6%9E%9C%3A946%7C%E6%95%88%E6%9E%9C%3A1927%7C%E6%95%88%E6%9E%9C%3A427%7C%E6%95%88%E6%9E%9C%3A843%7C%E6%95%88%E6%9E%9C%3A2068%7C%E6%95%88%E6%9E%9C%3A431%7C%E6%95%88%E6%9E%9C%3A1268%7C%E6%95%88%E6%9E%9C%3A2189%7C%E6%95%88%E6%9E%9C%3A1159%7C%E6%95%88%E6%9E%9C%3A2161%7C%E6%95%88%E6%9E%9C%3A1255%7C%E6%95%88%E6%9E%9C%3A2117%7C%E6%95%88%E6%9E%9C%3A2027%7C%E6%95%88%E6%9E%9C%3A1959%7C%E6%95%88%E6%9E%9C%3A1257%7C%E6%95%88%E6%9E%9C%3A1589%7C%E6%95%88%E6%9E%9C%3A2023%7C%E6%8A%80%E8%83%BD%3A10047%7C%E6%8A%80%E8%83%BD%3A21739%7C%E6%8A%80%E8%83%BD%3A10391%7C%E6%8A%80%E8%83%BD%3A10413%7C%E6%8A%80%E8%83%BD%3A21329%7C%E6%8A%80%E8%83%BD%3A36818%7C%E6%8A%80%E8%83%BD%3A11984%7C%E6%8A%80%E8%83%BD%3A20043%7C%E6%8A%80%E8%83%BD%3A10408%7C%E6%8A%80%E8%83%BD%3A32652",
      "sha256": "b7afdf825badb6ea71a729204b65de8ef48be64f094c0f84ff4930be03ff341e",
      "text": "{{魂印\n|魂印ID=1873\n|相关精灵=4671\n|魂印图标=1873\n|效果IDs=2273\n|kind=12 15 9 14\n|魂印效果=自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）\n}}"
    }
  ],
  "gap": "回合开始时比较上回合开始HP，但首回合没有上回合。首次不触发比较分支、以初始当前HP为参考等解释会改变首轮所有技能先制1/必中或吸取资格。",
  "question": "1873首次回合开始时，上回合开始体力的参考值如何确定；首轮应触发哪一分支？",
  "answer": "",
  "rawSourceRecords": [
    {
      "url": "https://api.seerapi.com/v1/soulmark/1873",
      "data": {
        "id": 1873,
        "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
        "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
        "analyze_desc": "",
        "pve_effective": false,
        "intensified": false,
        "is_adv": false,
        "pet": [
          {
            "id": 4671,
            "url": "https://api.seerapi.com/v1/pet/4671"
          }
        ],
        "effect": {
          "effect_args": [
            4,
            1,
            2,
            1,
            3,
            1
          ],
          "effect": {
            "id": 2273,
            "url": "https://api.seerapi.com/v1/eid_effect/2273"
          }
        },
        "effect_alias": "alias_2273_4_1_2_1_3_1",
        "tag": [
          {
            "id": 13,
            "url": "https://api.seerapi.com/v1/soulmark_tag/13"
          },
          {
            "id": 16,
            "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
        "from": null,
        "advance": null,
        "hash": "ffc2de4b"
      },
      "loadedAt": "2026-10-26T08:05:24.393Z",
      "storage": "refreshed"
    }
  ]
}
```

明确问题：1873首次回合开始时，上回合开始体力的参考值如何确定；首轮应触发哪一分支？

我的回答：

### Q-N50-4671-010

```json
{
  "id": "Q-N50-4671-010",
  "species": 4671,
  "source": {
    "move": {
      "id": 36820,
      "name": "漫雾敛息",
      "type": "火暗影",
      "kind": "special",
      "power": 140,
      "pp": 5,
      "priority": 0,
      "accuracy": 95,
      "alwaysHit": false,
      "critical": "1/16",
      "effectIds": [
        2071,
        991
      ],
      "effectInstances": [
        {
          "id": 2071,
          "args": [
            3,
            100
          ],
          "description": "自身被击败后，对手下3次体力恢复效果减少100%"
        },
        {
          "id": 991,
          "args": [
            2,
            70
          ],
          "description": "未击败对手则对方下2次攻击技能将70%被己方闪避"
        }
      ],
      "description": "自身被击败后，对手下3次体力恢复效果减少100%；未击败对手则对方下2次攻击技能将70%被己方闪避",
      "revision": "seerapi:23ca72e0",
      "hash": "23ca72e0",
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
    "index": 0,
    "instance": {
      "id": 2071,
      "args": [
        3,
        100
      ],
      "description": "自身被击败后，对手下3次体力恢复效果减少100%"
    },
    "effect": {
      "id": 2071,
      "argsNum": 2,
      "template": "自身被击败后，对手下{0}次体力恢复效果减少{1}%",
      "revision": "seerapi:a78d8b85"
    }
  },
  "checked": [
    {
      "snapshot": {
        "file": "research/4671-reviewed-snapshot.json",
        "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
      },
      "supplement": {
        "file": "research/4671-source-supplement-audit.json",
        "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
      },
      "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
    },
    {
      "title": "效果:2071",
      "pageid": 176680,
      "missing": false,
      "revision": 344529,
      "timestamp": "2026-04-17T07:04:37Z",
      "sourceURL": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E9%AD%82%E5%8D%B0%3A1873%7C%E7%B2%BE%E7%81%B5%3A4671%7C%E5%99%AC%E5%A4%9C%E7%96%BE%E8%A2%AD%C2%B7%E5%BA%93%E6%8B%89%E5%A1%94%E5%85%8B%7C%E6%95%88%E6%9E%9C%3A5%7C%E6%95%88%E6%9E%9C%3A15%7C%E6%95%88%E6%9E%9C%3A12%7C%E6%95%88%E6%9E%9C%3A4%7C%E6%95%88%E6%9E%9C%3A931%7C%E6%95%88%E6%9E%9C%3A1108%7C%E6%95%88%E6%9E%9C%3A428%7C%E6%95%88%E6%9E%9C%3A2059%7C%E6%95%88%E6%9E%9C%3A718%7C%E6%95%88%E6%9E%9C%3A191%7C%E6%95%88%E6%9E%9C%3A914%7C%E6%95%88%E6%9E%9C%3A886%7C%E6%95%88%E6%9E%9C%3A1393%7C%E6%95%88%E6%9E%9C%3A2071%7C%E6%95%88%E6%9E%9C%3A991%7C%E6%95%88%E6%9E%9C%3A946%7C%E6%95%88%E6%9E%9C%3A1927%7C%E6%95%88%E6%9E%9C%3A427%7C%E6%95%88%E6%9E%9C%3A843%7C%E6%95%88%E6%9E%9C%3A2068%7C%E6%95%88%E6%9E%9C%3A431%7C%E6%95%88%E6%9E%9C%3A1268%7C%E6%95%88%E6%9E%9C%3A2189%7C%E6%95%88%E6%9E%9C%3A1159%7C%E6%95%88%E6%9E%9C%3A2161%7C%E6%95%88%E6%9E%9C%3A1255%7C%E6%95%88%E6%9E%9C%3A2117%7C%E6%95%88%E6%9E%9C%3A2027%7C%E6%95%88%E6%9E%9C%3A1959%7C%E6%95%88%E6%9E%9C%3A1257%7C%E6%95%88%E6%9E%9C%3A1589%7C%E6%95%88%E6%9E%9C%3A2023%7C%E6%8A%80%E8%83%BD%3A10047%7C%E6%8A%80%E8%83%BD%3A21739%7C%E6%8A%80%E8%83%BD%3A10391%7C%E6%8A%80%E8%83%BD%3A10413%7C%E6%8A%80%E8%83%BD%3A21329%7C%E6%8A%80%E8%83%BD%3A36818%7C%E6%8A%80%E8%83%BD%3A11984%7C%E6%8A%80%E8%83%BD%3A20043%7C%E6%8A%80%E8%83%BD%3A10408%7C%E6%8A%80%E8%83%BD%3A32652",
      "sha256": "c6f1caa1c01f66507963ba803a0af7b7d34e76425edbc60f77a61f0532d32aab",
      "text": "{{技能效果\n|id=2071\n|argsNum=2\n|info=自身被击败后，对手下{0}次体力恢复效果减少{1}%\n|param=\n}}"
    },
    {
      "title": "技能:36820",
      "pageid": 128424,
      "missing": false,
      "revision": 314379,
      "timestamp": "2025-10-10T06:41:37Z",
      "sourceURL": "https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles=%E6%8A%80%E8%83%BD%3A28420%7C%E6%8A%80%E8%83%BD%3A36819%7C%E6%8A%80%E8%83%BD%3A28421%7C%E6%8A%80%E8%83%BD%3A36820%7C%E6%8A%80%E8%83%BD%3A28422%7C%E6%8A%80%E8%83%BD%3A36821%7C%E6%8A%80%E8%83%BD%3A37526%7C%E6%8A%80%E8%83%BD%3A28818%7C%E6%8A%80%E8%83%BD%3A28819%7C%E6%8A%80%E8%83%BD%3A37527%7C%E6%8A%80%E8%83%BD%3A37528%7C%E6%8A%80%E8%83%BD%E5%91%BD%E4%B8%AD",
      "sha256": "4df9d50bb4e27c0d919662a01e1224e686e3a976387167241c12d59c8ff06fb5",
      "text": "{{技能\n|技能序号=36820\n|技能名称=漫雾敛息\n|技能类型=特殊攻击\n|技能属性=火暗影\n|威力=140\n|次数=5\n|先制=0\n|命中率=95%\n|暴击概率=1/16\n|效果ID=2071 991\n|技能效果=自身被击败后，对手下3次体力恢复效果减少100%；未击败对手则对方下2次攻击技能将70%被己方闪避\n}}"
    }
  ],
  "gap": "被真实敌击败后遗留3次100%回复削减，回复请求本来就会因满HP或其它阻止而实际0时是否消费次数未说明；例如满HP请求100，按请求计次余2，按可产生实际恢复的事件计次仍余3。",
  "question": "2071下3次回复效果减少100%，遇满HP或其它禁疗导致原本实际回复0时是否消耗一次？",
  "answer": "",
  "rawSourceRecords": [
    {
      "url": "https://api.seerapi.com/v1/skill/36820",
      "data": {
        "id": 36820,
        "name": "漫雾敛息",
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
          "id": 101,
          "url": "https://api.seerapi.com/v1/element_type_combination/101"
        },
        "learned_by_pet": [],
        "skill_effect": [
          {
            "info": "自身被击败后，对手下3次体力恢复效果减少100%",
            "analyze_info": "[sprite name=iconHit]自身[color=#57c975]被击败[/color]后，对手下3次体力恢复效果减少100%（boss有效）",
            "args": [
              3,
              100
            ],
            "effect": {
              "id": 2071,
              "url": "https://api.seerapi.com/v1/skill_effect_type/2071"
            }
          },
          {
            "info": "未击败对手则对方下2次攻击技能将70%被己方闪避",
            "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则对方下2次攻击技能将70%被[color=#52a5f2]己方[/color]闪避（boss有效）",
            "args": [
              2,
              70
            ],
            "effect": {
              "id": 991,
              "url": "https://api.seerapi.com/v1/skill_effect_type/991"
            }
          }
        ],
        "friend_skill_effect": [],
        "hide_effect": null,
        "advance": null,
        "hash": "23ca72e0"
      },
      "loadedAt": "2026-10-26T08:06:03.169Z",
      "storage": "refreshed"
    },
    {
      "url": "https://api.seerapi.com/v1/skill_effect_type/2071",
      "data": {
        "id": 2071,
        "args_num": 2,
        "info": "自身被击败后，对手下{0}次体力恢复效果减少{1}%",
        "info_formatting_adjustment": null,
        "analyze_info": "[sprite name=iconHit]自身[color=#57c975]被击败[/color]后，对手下{0}次体力恢复效果减少{1}%（boss有效）",
        "pve_effective": true,
        "param": null,
        "skill": [
          {
            "id": 36820,
            "url": "https://api.seerapi.com/v1/skill/36820"
          },
          {
            "id": 36826,
            "url": "https://api.seerapi.com/v1/skill/36826"
          }
        ],
        "tag": [
          {
            "id": 45247,
            "url": "https://api.seerapi.com/v1/skill_effect_type_tag/45247"
          }
        ],
        "hash": "a78d8b85"
      },
      "loadedAt": "2026-10-26T08:06:09.817Z",
      "storage": "refreshed"
    }
  ]
}
```

明确问题：2071下3次回复效果减少100%，遇满HP或其它禁疗导致原本实际回复0时是否消耗一次？

我的回答：

### Q-N50-4642-010 · 4671新增关联

```json
{
  "id": "Q-N50-4642-010",
  "instances": [
    {
      "id": "Q-N50-4642-010",
      "associatedInstances": [
        {
          "soul": {
            "id": 1873,
            "description": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "hash": "ffc2de4b",
            "eid": 2273,
            "args": [
              4,
              1,
              2,
              1,
              3,
              1
            ],
            "isAdvanced": false,
            "source": {
              "url": "https://api.seerapi.com/v1/soulmark/1873",
              "revision": "ffc2de4b",
              "loadedAt": "2026-10-26T08:05:24.393Z"
            },
            "from": null,
            "intensifiedTo": null
          },
          "relatedMoves": [
            {
              "id": 36818,
              "name": "月蛰",
              "type": "火暗影",
              "kind": "physical",
              "power": 15,
              "pp": 20,
              "priority": 3,
              "accuracy": 96,
              "alwaysHit": false,
              "critical": "1/16",
              "effectIds": [
                931,
                1108
              ],
              "effectInstances": [
                {
                  "id": 931,
                  "args": [
                    2
                  ],
                  "description": "吸取对手能力提升状态，吸取成功则对手随机2项技能PP值归零"
                },
                {
                  "id": 1108,
                  "args": [
                    1,
                    1
                  ],
                  "description": "自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1"
                }
              ],
              "description": "吸取对手能力提升状态，吸取成功则对手随机2项技能PP值归零；自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1",
              "revision": "seerapi:21ebd1d7",
              "hash": "21ebd1d7",
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
              "id": 37526,
              "name": "月下伏",
              "type": "火暗影",
              "kind": "physical",
              "power": 15,
              "pp": 5,
              "priority": 3,
              "accuracy": 97,
              "alwaysHit": false,
              "critical": "1/16",
              "effectIds": [
                2189,
                1159,
                1108
              ],
              "effectInstances": [
                {
                  "id": 2189,
                  "args": [
                    100,
                    22
                  ],
                  "description": "自身的PP值总和高于对手时100%令对手焚烬"
                },
                {
                  "id": 1159,
                  "args": [
                    1
                  ],
                  "description": "吸取对手能力提升状态，吸取成功则自身免疫下1次受到的异常状态"
                },
                {
                  "id": 1108,
                  "args": [
                    1,
                    1
                  ],
                  "description": "自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1"
                }
              ],
              "description": "自身的PP值总和高于对手时100%令对手焚烬；吸取对手能力提升状态，吸取成功则自身免疫下1次受到的异常状态；自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1",
              "revision": "seerapi:1b3b4fcf",
              "hash": "1b3b4fcf",
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
            }
          ]
        },
        {
          "species": 4671,
          "skillId": 28422,
          "effectId": 427,
          "index": 2,
          "args": [
            3,
            -1
          ],
          "fullText": "3回合内每次直接攻击都会使对手防御和特防-1",
          "sourceBinding": {
            "key": "4671:skill:28422:2",
            "sourceDigest": "7914883a07c4a3c038186fa34cccacd776a63511135c8ccf08d334e8f5e92da7",
            "source": {
              "snapshot": {
                "provider": "seerapi",
                "url": "https://api.seerapi.com/v1/pet/4671",
                "revision": "ba15bbe4",
                "loadedAt": "2026-10-26T08:05:18.340Z"
              },
              "skillRevision": "seerapi:6a0a4a4e"
            },
            "raw": {
              "instance": {
                "id": 427,
                "args": [
                  3,
                  -1
                ],
                "description": "3回合内每次直接攻击都会使对手防御和特防-1"
              },
              "index": 2,
              "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍；4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍；3回合内每次直接攻击都会使对手防御和特防-1；下2回合令自身所有技能先制+2",
              "metadata": {
                "id": 427,
                "argsNum": 2,
                "template": "{0}回合内每次直接攻击都会使对手防御和特防{1}",
                "revision": "seerapi:2f62dfa3"
              }
            },
            "petHash": "ba15bbe4",
            "skillHash": "6a0a4a4e",
            "effectHash": "seerapi:2f62dfa3",
            "index": 2,
            "args": [
              3,
              -1
            ]
          },
          "codeProtection": "research/main-drafts/next50-4671-production-followup/427/record.json"
        }
      ],
      "gap": "1873攻击技能命中时随机4项能力吸取，在1108真实多段整招一次或逐段会导致不同能力总变化；当前first-hit-once仅显式研究，不作为自然答案。；28422/427每次直接攻击与原生1108多段组合时，整招降双防一次和逐段降低会改变能力等级与后续段伤害，未有可适用确认，现首段伤害前保护。",
      "checkedFrozen": "4359/780、1126以及4114/1727局部命中定义不扩大；未找到1873多段触发单位的泛适用确认。；427已查单招首授4625-011及既有428/427具名记录，不把首授确认扩为多段单位；原资料未明确该单位。",
      "source": {
        "snapshot": {
          "file": "research/4671-reviewed-snapshot.json",
          "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
        },
        "supplement": {
          "file": "research/4671-source-supplement-audit.json",
          "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
        },
        "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
      },
      "rawSourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1873",
          "data": {
            "id": 1873,
            "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4671,
                "url": "https://api.seerapi.com/v1/pet/4671"
              }
            ],
            "effect": {
              "effect_args": [
                4,
                1,
                2,
                1,
                3,
                1
              ],
              "effect": {
                "id": 2273,
                "url": "https://api.seerapi.com/v1/eid_effect/2273"
              }
            },
            "effect_alias": "alias_2273_4_1_2_1_3_1",
            "tag": [
              {
                "id": 13,
                "url": "https://api.seerapi.com/v1/soulmark_tag/13"
              },
              {
                "id": 16,
                "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
            "from": null,
            "advance": null,
            "hash": "ffc2de4b"
          },
          "loadedAt": "2026-10-26T08:05:24.393Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28422",
          "data": {
            "id": 28422,
            "name": "跃影绫锋",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；开始吸取对手的体力了；攻击开始弱化对手的防御能力；出手变得更快了",
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
                "info": "全属性+1，若自身当前体力低于对手则强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1（boss有效），若自身当前体力低于对手则强化效果翻倍",
                "args": [
                  1
                ],
                "effect": {
                  "id": 946,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/946"
                }
              },
              {
                "info": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能则[color=#52a5f2]吸取[/color]对手300点体力，[color=#52a5f2]吸取[/color]体力时若自身体力低于最大体力的1/2则[color=#52a5f2]吸取[/color]效果翻倍（boss有效）",
                "args": [
                  4,
                  300,
                  2
                ],
                "effect": {
                  "id": 1927,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1927"
                }
              },
              {
                "info": "3回合内每次直接攻击都会使对手防御和特防-1",
                "analyze_info": "[sprite name=iconHit]3回合内每次直接攻击都会使对手防御和特防-1（boss有效）",
                "args": [
                  3,
                  -1
                ],
                "effect": {
                  "id": 427,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/427"
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
            "hash": "6a0a4a4e"
          },
          "loadedAt": "2026-10-26T08:06:15.963Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill_effect_type/427",
          "data": {
            "id": 427,
            "args_num": 2,
            "info": "{0}回合内每次直接攻击都会使对手防御和特防{1}",
            "info_formatting_adjustment": null,
            "analyze_info": "[sprite name=iconHit]{0}回合内每次直接攻击都会使对手防御和特防{1}（boss有效）",
            "pve_effective": true,
            "param": null,
            "skill": [
              {
                "id": 21880,
                "url": "https://api.seerapi.com/v1/skill/21880"
              },
              {
                "id": 22713,
                "url": "https://api.seerapi.com/v1/skill/22713"
              },
              {
                "id": 23268,
                "url": "https://api.seerapi.com/v1/skill/23268"
              },
              {
                "id": 23449,
                "url": "https://api.seerapi.com/v1/skill/23449"
              },
              {
                "id": 26502,
                "url": "https://api.seerapi.com/v1/skill/26502"
              },
              {
                "id": 26822,
                "url": "https://api.seerapi.com/v1/skill/26822"
              },
              {
                "id": 26962,
                "url": "https://api.seerapi.com/v1/skill/26962"
              },
              {
                "id": 27052,
                "url": "https://api.seerapi.com/v1/skill/27052"
              },
              {
                "id": 27053,
                "url": "https://api.seerapi.com/v1/skill/27053"
              },
              {
                "id": 27261,
                "url": "https://api.seerapi.com/v1/skill/27261"
              },
              {
                "id": 27486,
                "url": "https://api.seerapi.com/v1/skill/27486"
              },
              {
                "id": 27534,
                "url": "https://api.seerapi.com/v1/skill/27534"
              },
              {
                "id": 27612,
                "url": "https://api.seerapi.com/v1/skill/27612"
              },
              {
                "id": 27737,
                "url": "https://api.seerapi.com/v1/skill/27737"
              },
              {
                "id": 28422,
                "url": "https://api.seerapi.com/v1/skill/28422"
              },
              {
                "id": 37007,
                "url": "https://api.seerapi.com/v1/skill/37007"
              },
              {
                "id": 37382,
                "url": "https://api.seerapi.com/v1/skill/37382"
              },
              {
                "id": 37677,
                "url": "https://api.seerapi.com/v1/skill/37677"
              },
              {
                "id": 37798,
                "url": "https://api.seerapi.com/v1/skill/37798"
              },
              {
                "id": 38072,
                "url": "https://api.seerapi.com/v1/skill/38072"
              }
            ],
            "tag": [
              {
                "id": 35733,
                "url": "https://api.seerapi.com/v1/skill_effect_type_tag/35733"
              }
            ],
            "hash": "2f62dfa3"
          },
          "cacheFile": "research/4649-source-check.json",
          "loadedAt": "2026-10-26T03:28:30.760Z",
          "storage": "existing-cache"
        }
      ],
      "question": "1873的攻击命中吸能力和28422/427的每次直接攻击降双防，分别在1108原生多段中按整招一次还是逐段触发？",
      "answer": ""
    }
  ]
}
```

我的回答：

### Q-N50-4618-001 · 4671新增关联

```json
{
  "id": "Q-N50-4618-001",
  "instances": [
    {
      "id": "Q-N50-4618-001",
      "associatedInstances": [
        {
          "move": {
            "id": 37527,
            "name": "影中艳",
            "type": "火暗影",
            "kind": "physical",
            "power": 150,
            "pp": 5,
            "priority": 0,
            "accuracy": 97,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2117,
              431,
              2027
            ],
            "effectInstances": [
              {
                "id": 2117,
                "args": [
                  2,
                  22
                ],
                "description": "将对手所处的烧伤转化为焚烬"
              },
              {
                "id": 431,
                "args": [],
                "description": "若对手处于能力下降状态，则威力翻倍"
              },
              {
                "id": 2027,
                "args": [
                  2
                ],
                "description": "击败对手则对方下只精灵出战时降低所有技能2点PP值"
              }
            ],
            "description": "将对手所处的烧伤转化为焚烬；若对手处于能力下降状态，则威力翻倍；击败对手则对方下只精灵出战时降低所有技能2点PP值",
            "revision": "seerapi:d87cad61",
            "hash": "d87cad61",
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
          "index": 0,
          "instance": {
            "id": 2117,
            "args": [
              2,
              22
            ],
            "description": "将对手所处的烧伤转化为焚烬"
          },
          "effect": {
            "id": 2117,
            "argsNum": 2,
            "template": "将对手所处的{0}转化为{1}",
            "revision": "seerapi:e557fcdb"
          }
        }
      ],
      "gap": "烧伤转换焚烬新状态时长未注明；Q017只定义准入转换不定义时长。",
      "source": {
        "snapshot": {
          "file": "research/4671-reviewed-snapshot.json",
          "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
        },
        "supplement": {
          "file": "research/4671-source-supplement-audit.json",
          "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
        },
        "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
      },
      "rawSourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1873",
          "data": {
            "id": 1873,
            "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4671,
                "url": "https://api.seerapi.com/v1/pet/4671"
              }
            ],
            "effect": {
              "effect_args": [
                4,
                1,
                2,
                1,
                3,
                1
              ],
              "effect": {
                "id": 2273,
                "url": "https://api.seerapi.com/v1/eid_effect/2273"
              }
            },
            "effect_alias": "alias_2273_4_1_2_1_3_1",
            "tag": [
              {
                "id": 13,
                "url": "https://api.seerapi.com/v1/soulmark_tag/13"
              },
              {
                "id": 16,
                "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
            "from": null,
            "advance": null,
            "hash": "ffc2de4b"
          },
          "loadedAt": "2026-10-26T08:05:24.393Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/37527",
          "data": {
            "id": 37527,
            "name": "影中艳",
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
              "id": 101,
              "url": "https://api.seerapi.com/v1/element_type_combination/101"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "将对手所处的烧伤转化为焚烬",
                "analyze_info": "[sprite name=iconHit]将对手所处的[color=#57c975]烧伤[/color][color=#52a5f2]转化[/color]为[color=#57c975]焚烬[/color]",
                "args": [
                  2,
                  22
                ],
                "effect": {
                  "id": 2117,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2117"
                }
              },
              {
                "info": "若对手处于能力下降状态，则威力翻倍",
                "analyze_info": "[sprite name=iconHit]若对手处于能力下降状态，则[color=#52a5f2]威力[/color]翻倍（boss有效）",
                "args": [],
                "effect": {
                  "id": 431,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/431"
                }
              },
              {
                "info": "击败对手则对方下只精灵出战时降低所有技能2点PP值",
                "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则对方下只精灵[color=#57c975]出战时[/color]降低所有技能2点PP值",
                "args": [
                  2
                ],
                "effect": {
                  "id": 2027,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2027"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "d87cad61"
          },
          "loadedAt": "2026-10-26T08:07:04.391Z",
          "storage": "refreshed"
        }
      ]
    }
  ]
}
```

我的回答：

### Q-N50-4625-011 · 4671新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "associatedInstances": [
        {
          "move": {
            "id": 28421,
            "name": "灼光绮丽",
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
              914,
              886,
              1393
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
                "id": 914,
                "args": [
                  2,
                  2,
                  100
                ],
                "description": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效"
              },
              {
                "id": 886,
                "args": [
                  40
                ],
                "description": "下次攻击忽略对手双防值的40%"
              },
              {
                "id": 1393,
                "args": [
                  3,
                  1,
                  1,
                  3
                ],
                "description": "3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害"
              }
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态；若对手处于烧伤状态则2回合内100%令对手使用的技能无效；下次攻击忽略对手双防值的40%；3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害",
            "revision": "seerapi:890489ac",
            "hash": "890489ac",
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
          "index": 3,
          "instance": {
            "id": 1393,
            "args": [
              3,
              1,
              1,
              3
            ],
            "description": "3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害"
          },
          "effect": {
            "id": 1393,
            "argsNum": 4,
            "template": "{0}回合内每回合使用技能则造成伤害前令对手防御-{1}、速度-{2}，未触发则附加对手最大体力1/{3}的百分比伤害",
            "revision": "seerapi:8c3764df"
          }
        },
        {
          "move": {
            "id": 28422,
            "name": "跃影绫锋",
            "type": "普通",
            "kind": "status",
            "power": 0,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": true,
            "critical": "1/16",
            "effectIds": [
              946,
              1927,
              427,
              843
            ],
            "effectInstances": [
              {
                "id": 946,
                "args": [
                  1
                ],
                "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍"
              },
              {
                "id": 1927,
                "args": [
                  4,
                  300,
                  2
                ],
                "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
              },
              {
                "id": 427,
                "args": [
                  3,
                  -1
                ],
                "description": "3回合内每次直接攻击都会使对手防御和特防-1"
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
            "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍；4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍；3回合内每次直接攻击都会使对手防御和特防-1；下2回合令自身所有技能先制+2",
            "revision": "seerapi:6a0a4a4e",
            "hash": "6a0a4a4e",
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
          "index": 1,
          "instance": {
            "id": 1927,
            "args": [
              4,
              300,
              2
            ],
            "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
          },
          "effect": {
            "id": 1927,
            "argsNum": 3,
            "template": "{0}回合内每回合使用技能则吸取对手{1}点体力，吸取体力时若自身体力低于最大体力的1/{2}则吸取效果翻倍",
            "revision": "seerapi:c5cd9cbb"
          }
        },
        {
          "move": {
            "id": 28818,
            "name": "灼眼焰华",
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
              914,
              886,
              2161
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
                "id": 914,
                "args": [
                  2,
                  2,
                  100
                ],
                "description": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效"
              },
              {
                "id": 886,
                "args": [
                  50
                ],
                "description": "下次攻击忽略对手双防值的50%"
              },
              {
                "id": 2161,
                "args": [
                  3,
                  -1,
                  -1,
                  -1,
                  0,
                  -1,
                  0,
                  1,
                  100
                ],
                "description": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%"
              }
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态；若对手处于烧伤状态则2回合内100%令对手使用的技能无效；下次攻击忽略对手双防值的50%；3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%",
            "revision": "seerapi:f49a8c30",
            "hash": "f49a8c30",
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
          "index": 3,
          "instance": {
            "id": 2161,
            "args": [
              3,
              -1,
              -1,
              -1,
              0,
              -1,
              0,
              1,
              100
            ],
            "description": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%"
          },
          "effect": {
            "id": 2161,
            "argsNum": 9,
            "template": "{0}回合内使用技能令对手{1}，未触发则自身下{7}次攻击造成伤害提升{8}%",
            "revision": "seerapi:cf822ee6"
          }
        },
        {
          "move": {
            "id": 28819,
            "name": "炙血封喉",
            "type": "普通",
            "kind": "status",
            "power": 0,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": true,
            "critical": "1/16",
            "effectIds": [
              946,
              1927,
              1255,
              843
            ],
            "effectInstances": [
              {
                "id": 946,
                "args": [
                  1
                ],
                "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍"
              },
              {
                "id": 1927,
                "args": [
                  4,
                  300,
                  2
                ],
                "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
              },
              {
                "id": 1255,
                "args": [
                  3,
                  100,
                  2,
                  3
                ],
                "description": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害"
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
            "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍；4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍；3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害；下2回合令自身所有技能先制+2",
            "revision": "seerapi:866dfe82",
            "hash": "866dfe82",
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
          "index": 1,
          "instance": {
            "id": 1927,
            "args": [
              4,
              300,
              2
            ],
            "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
          },
          "effect": {
            "id": 1927,
            "argsNum": 3,
            "template": "{0}回合内每回合使用技能则吸取对手{1}点体力，吸取体力时若自身体力低于最大体力的1/{2}则吸取效果翻倍",
            "revision": "seerapi:c5cd9cbb"
          }
        },
        {
          "move": {
            "id": 28819,
            "name": "炙血封喉",
            "type": "普通",
            "kind": "status",
            "power": 0,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": true,
            "critical": "1/16",
            "effectIds": [
              946,
              1927,
              1255,
              843
            ],
            "effectInstances": [
              {
                "id": 946,
                "args": [
                  1
                ],
                "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍"
              },
              {
                "id": 1927,
                "args": [
                  4,
                  300,
                  2
                ],
                "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
              },
              {
                "id": 1255,
                "args": [
                  3,
                  100,
                  2,
                  3
                ],
                "description": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害"
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
            "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍；4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍；3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害；下2回合令自身所有技能先制+2",
            "revision": "seerapi:866dfe82",
            "hash": "866dfe82",
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
          "index": 2,
          "instance": {
            "id": 1255,
            "args": [
              3,
              100,
              2,
              3
            ],
            "description": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害"
          },
          "effect": {
            "id": 1255,
            "argsNum": 4,
            "template": "{0}回合内每回合使用技能则{1}%令对手{2}，未触发则附加对手最大体力1/{3}的百分比伤害",
            "revision": "seerapi:e2d97873"
          }
        }
      ],
      "gap": "持续用招词条首授当次触发时点；before-damage与after-use实例分别保留真实阶段，不机械扩大旧首触答案。",
      "source": {
        "snapshot": {
          "file": "research/4671-reviewed-snapshot.json",
          "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
        },
        "supplement": {
          "file": "research/4671-source-supplement-audit.json",
          "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
        },
        "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
      },
      "rawSourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1873",
          "data": {
            "id": 1873,
            "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4671,
                "url": "https://api.seerapi.com/v1/pet/4671"
              }
            ],
            "effect": {
              "effect_args": [
                4,
                1,
                2,
                1,
                3,
                1
              ],
              "effect": {
                "id": 2273,
                "url": "https://api.seerapi.com/v1/eid_effect/2273"
              }
            },
            "effect_alias": "alias_2273_4_1_2_1_3_1",
            "tag": [
              {
                "id": 13,
                "url": "https://api.seerapi.com/v1/soulmark_tag/13"
              },
              {
                "id": 16,
                "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
            "from": null,
            "advance": null,
            "hash": "ffc2de4b"
          },
          "loadedAt": "2026-10-26T08:05:24.393Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28421",
          "data": {
            "id": 28421,
            "name": "灼光绮丽",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态；对手处于烧伤则开始无效对手的技能；下次攻击变得更加凌厉；对手的防御、速度开始逐渐降低",
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
                "info": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效",
                "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]烧伤[/color]状态则2回合内100%令对手使用的技能无效",
                "args": [
                  2,
                  2,
                  100
                ],
                "effect": {
                  "id": 914,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/914"
                }
              },
              {
                "info": "下次攻击忽略对手双防值的40%",
                "analyze_info": "[sprite name=iconHit]下次攻击忽略对手双防值的40%（boss有效）",
                "args": [
                  40
                ],
                "effect": {
                  "id": 886,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/886"
                }
              },
              {
                "info": "3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害",
                "analyze_info": "[sprite name=iconHit]3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，[color=#52a5f2]未触发[/color]则附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
                "args": [
                  3,
                  1,
                  1,
                  3
                ],
                "effect": {
                  "id": 1393,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1393"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "890489ac"
          },
          "loadedAt": "2026-10-26T08:05:56.374Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28422",
          "data": {
            "id": 28422,
            "name": "跃影绫锋",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；开始吸取对手的体力了；攻击开始弱化对手的防御能力；出手变得更快了",
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
                "info": "全属性+1，若自身当前体力低于对手则强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1（boss有效），若自身当前体力低于对手则强化效果翻倍",
                "args": [
                  1
                ],
                "effect": {
                  "id": 946,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/946"
                }
              },
              {
                "info": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能则[color=#52a5f2]吸取[/color]对手300点体力，[color=#52a5f2]吸取[/color]体力时若自身体力低于最大体力的1/2则[color=#52a5f2]吸取[/color]效果翻倍（boss有效）",
                "args": [
                  4,
                  300,
                  2
                ],
                "effect": {
                  "id": 1927,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1927"
                }
              },
              {
                "info": "3回合内每次直接攻击都会使对手防御和特防-1",
                "analyze_info": "[sprite name=iconHit]3回合内每次直接攻击都会使对手防御和特防-1（boss有效）",
                "args": [
                  3,
                  -1
                ],
                "effect": {
                  "id": 427,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/427"
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
            "hash": "6a0a4a4e"
          },
          "loadedAt": "2026-10-26T08:06:15.963Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28818",
          "data": {
            "id": 28818,
            "name": "灼眼焰华",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态；对手处于烧伤则开始无效对手的技能；下次攻击变得更加凌厉；对手的能力开始逐渐降低",
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
                "info": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效",
                "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]烧伤[/color]状态则2回合内100%令对手使用的技能无效",
                "args": [
                  2,
                  2,
                  100
                ],
                "effect": {
                  "id": 914,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/914"
                }
              },
              {
                "info": "下次攻击忽略对手双防值的50%",
                "analyze_info": "[sprite name=iconHit]下次攻击忽略对手双防值的50%（boss有效）",
                "args": [
                  50
                ],
                "effect": {
                  "id": 886,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/886"
                }
              },
              {
                "info": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%",
                "analyze_info": "[sprite name=iconHit]3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，[color=#52a5f2]未触发[/color]则自身下1次攻击造成伤害提升100%",
                "args": [
                  3,
                  -1,
                  -1,
                  -1,
                  0,
                  -1,
                  0,
                  1,
                  100
                ],
                "effect": {
                  "id": 2161,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2161"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "f49a8c30"
          },
          "loadedAt": "2026-10-26T08:06:50.472Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28819",
          "data": {
            "id": 28819,
            "name": "炙血封喉",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；开始令对手烧伤了；出手变得更快了",
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
                "info": "全属性+1，若自身当前体力低于对手则强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1（boss有效），若自身当前体力低于对手则强化效果翻倍",
                "args": [
                  1
                ],
                "effect": {
                  "id": 946,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/946"
                }
              },
              {
                "info": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能则[color=#52a5f2]吸取[/color]对手300点体力，[color=#52a5f2]吸取[/color]体力时若自身体力低于最大体力的1/2则[color=#52a5f2]吸取[/color]效果翻倍（boss有效）",
                "args": [
                  4,
                  300,
                  2
                ],
                "effect": {
                  "id": 1927,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1927"
                }
              },
              {
                "info": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害",
                "analyze_info": "[sprite name=iconHit]3回合内每回合使用技能则100%令对手[color=#57c975]烧伤[/color]，[color=#52a5f2]未触发[/color]则附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
                "args": [
                  3,
                  100,
                  2,
                  3
                ],
                "effect": {
                  "id": 1255,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1255"
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
            "hash": "866dfe82"
          },
          "loadedAt": "2026-10-26T08:06:57.575Z",
          "storage": "refreshed"
        }
      ]
    }
  ]
}
```

我的回答：

### Q-N50-4511-006 · 4671新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "associatedInstances": [
        {
          "move": {
            "id": 28420,
            "name": "掠影窃窃",
            "type": "普通",
            "kind": "status",
            "power": 0,
            "pp": 10,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2059
            ],
            "effectInstances": [
              {
                "id": 2059,
                "args": [
                  1,
                  150
                ],
                "description": "自身免疫下1次受到的异常状态，每次免疫成功吸取对手150点体力"
              }
            ],
            "description": "自身免疫下1次受到的异常状态，每次免疫成功吸取对手150点体力",
            "revision": "seerapi:71681d42",
            "hash": "71681d42",
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
          "index": 0,
          "instance": {
            "id": 2059,
            "args": [
              1,
              150
            ],
            "description": "自身免疫下1次受到的异常状态，每次免疫成功吸取对手150点体力"
          },
          "effect": {
            "id": 2059,
            "argsNum": 2,
            "template": "自身免疫下{0}次受到的异常状态，每次免疫成功吸取对手{1}点体力",
            "revision": "seerapi:d4070e3d"
          }
        },
        {
          "move": {
            "id": 28421,
            "name": "灼光绮丽",
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
              914,
              886,
              1393
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
                "id": 914,
                "args": [
                  2,
                  2,
                  100
                ],
                "description": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效"
              },
              {
                "id": 886,
                "args": [
                  40
                ],
                "description": "下次攻击忽略对手双防值的40%"
              },
              {
                "id": 1393,
                "args": [
                  3,
                  1,
                  1,
                  3
                ],
                "description": "3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害"
              }
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态；若对手处于烧伤状态则2回合内100%令对手使用的技能无效；下次攻击忽略对手双防值的40%；3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害",
            "revision": "seerapi:890489ac",
            "hash": "890489ac",
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
          "index": 0,
          "instance": {
            "id": 191,
            "args": [
              4
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态"
          },
          "effect": {
            "id": 191,
            "argsNum": 1,
            "template": "{0}回合内免疫并反弹所有受到的异常状态",
            "revision": "seerapi:ebdb8dc2"
          }
        },
        {
          "move": {
            "id": 28818,
            "name": "灼眼焰华",
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
              914,
              886,
              2161
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
                "id": 914,
                "args": [
                  2,
                  2,
                  100
                ],
                "description": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效"
              },
              {
                "id": 886,
                "args": [
                  50
                ],
                "description": "下次攻击忽略对手双防值的50%"
              },
              {
                "id": 2161,
                "args": [
                  3,
                  -1,
                  -1,
                  -1,
                  0,
                  -1,
                  0,
                  1,
                  100
                ],
                "description": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%"
              }
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态；若对手处于烧伤状态则2回合内100%令对手使用的技能无效；下次攻击忽略对手双防值的50%；3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%",
            "revision": "seerapi:f49a8c30",
            "hash": "f49a8c30",
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
          "index": 0,
          "instance": {
            "id": 191,
            "args": [
              4
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态"
          },
          "effect": {
            "id": 191,
            "argsNum": 1,
            "template": "{0}回合内免疫并反弹所有受到的异常状态",
            "revision": "seerapi:ebdb8dc2"
          }
        },
        {
          "move": {
            "id": 37526,
            "name": "月下伏",
            "type": "火暗影",
            "kind": "physical",
            "power": 15,
            "pp": 5,
            "priority": 3,
            "accuracy": 97,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2189,
              1159,
              1108
            ],
            "effectInstances": [
              {
                "id": 2189,
                "args": [
                  100,
                  22
                ],
                "description": "自身的PP值总和高于对手时100%令对手焚烬"
              },
              {
                "id": 1159,
                "args": [
                  1
                ],
                "description": "吸取对手能力提升状态，吸取成功则自身免疫下1次受到的异常状态"
              },
              {
                "id": 1108,
                "args": [
                  1,
                  1
                ],
                "description": "自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1"
              }
            ],
            "description": "自身的PP值总和高于对手时100%令对手焚烬；吸取对手能力提升状态，吸取成功则自身免疫下1次受到的异常状态；自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1",
            "revision": "seerapi:1b3b4fcf",
            "hash": "1b3b4fcf",
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
          "index": 1,
          "instance": {
            "id": 1159,
            "args": [
              1
            ],
            "description": "吸取对手能力提升状态，吸取成功则自身免疫下1次受到的异常状态"
          },
          "effect": {
            "id": 1159,
            "argsNum": 1,
            "template": "吸取对手能力提升状态，吸取成功则自身免疫下{0}次受到的异常状态",
            "revision": "seerapi:4559b40e"
          }
        },
        {
          "move": {
            "id": 36820,
            "name": "漫雾敛息",
            "type": "火暗影",
            "kind": "special",
            "power": 140,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2071,
              991
            ],
            "effectInstances": [
              {
                "id": 2071,
                "args": [
                  3,
                  100
                ],
                "description": "自身被击败后，对手下3次体力恢复效果减少100%"
              },
              {
                "id": 991,
                "args": [
                  2,
                  70
                ],
                "description": "未击败对手则对方下2次攻击技能将70%被己方闪避"
              }
            ],
            "description": "自身被击败后，对手下3次体力恢复效果减少100%；未击败对手则对方下2次攻击技能将70%被己方闪避",
            "revision": "seerapi:23ca72e0",
            "hash": "23ca72e0",
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
          "index": 1,
          "instance": {
            "id": 991,
            "args": [
              2,
              70
            ],
            "description": "未击败对手则对方下2次攻击技能将70%被己方闪避"
          },
          "effect": {
            "id": 991,
            "argsNum": 2,
            "template": "未击败对手则对方下{0}次攻击技能将{1}%被己方闪避",
            "revision": "seerapi:1578abe3"
          }
        },
        {
          "move": {
            "id": 36820,
            "name": "漫雾敛息",
            "type": "火暗影",
            "kind": "special",
            "power": 140,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2071,
              991
            ],
            "effectInstances": [
              {
                "id": 2071,
                "args": [
                  3,
                  100
                ],
                "description": "自身被击败后，对手下3次体力恢复效果减少100%"
              },
              {
                "id": 991,
                "args": [
                  2,
                  70
                ],
                "description": "未击败对手则对方下2次攻击技能将70%被己方闪避"
              }
            ],
            "description": "自身被击败后，对手下3次体力恢复效果减少100%；未击败对手则对方下2次攻击技能将70%被己方闪避",
            "revision": "seerapi:23ca72e0",
            "hash": "23ca72e0",
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
          "index": 0,
          "instance": {
            "id": 2071,
            "args": [
              3,
              100
            ],
            "description": "自身被击败后，对手下3次体力恢复效果减少100%"
          },
          "effect": {
            "id": 2071,
            "argsNum": 2,
            "template": "自身被击败后，对手下{0}次体力恢复效果减少{1}%",
            "revision": "seerapi:a78d8b85"
          }
        }
      ],
      "gap": "未消费次数与反弹/免异混源及持续载荷同名重授，精确到当前资源实例；未回答部分保护，不用字段赋值代替答案。",
      "source": {
        "snapshot": {
          "file": "research/4671-reviewed-snapshot.json",
          "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
        },
        "supplement": {
          "file": "research/4671-source-supplement-audit.json",
          "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
        },
        "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
      },
      "rawSourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1873",
          "data": {
            "id": 1873,
            "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4671,
                "url": "https://api.seerapi.com/v1/pet/4671"
              }
            ],
            "effect": {
              "effect_args": [
                4,
                1,
                2,
                1,
                3,
                1
              ],
              "effect": {
                "id": 2273,
                "url": "https://api.seerapi.com/v1/eid_effect/2273"
              }
            },
            "effect_alias": "alias_2273_4_1_2_1_3_1",
            "tag": [
              {
                "id": 13,
                "url": "https://api.seerapi.com/v1/soulmark_tag/13"
              },
              {
                "id": 16,
                "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
            "from": null,
            "advance": null,
            "hash": "ffc2de4b"
          },
          "loadedAt": "2026-10-26T08:05:24.393Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28420",
          "data": {
            "id": 28420,
            "name": "掠影窃窃",
            "power": 0,
            "max_pp": 10,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": false,
            "atk_num": 1,
            "info": "免疫下1次受到的异常状态",
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
                "info": "自身免疫下1次受到的异常状态，每次免疫成功吸取对手150点体力",
                "analyze_info": "[sprite name=iconHit]自身免疫下1次受到的异常状态，每次免疫成功[color=#52a5f2]吸取[/color]对手150点体力",
                "args": [
                  1,
                  150
                ],
                "effect": {
                  "id": 2059,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2059"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "71681d42"
          },
          "loadedAt": "2026-10-26T08:05:42.835Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28421",
          "data": {
            "id": 28421,
            "name": "灼光绮丽",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态；对手处于烧伤则开始无效对手的技能；下次攻击变得更加凌厉；对手的防御、速度开始逐渐降低",
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
                "info": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效",
                "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]烧伤[/color]状态则2回合内100%令对手使用的技能无效",
                "args": [
                  2,
                  2,
                  100
                ],
                "effect": {
                  "id": 914,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/914"
                }
              },
              {
                "info": "下次攻击忽略对手双防值的40%",
                "analyze_info": "[sprite name=iconHit]下次攻击忽略对手双防值的40%（boss有效）",
                "args": [
                  40
                ],
                "effect": {
                  "id": 886,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/886"
                }
              },
              {
                "info": "3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，未触发则附加对手最大体力1/3的百分比伤害",
                "analyze_info": "[sprite name=iconHit]3回合内每回合使用技能则造成伤害前令对手防御-1、速度-1，[color=#52a5f2]未触发[/color]则附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
                "args": [
                  3,
                  1,
                  1,
                  3
                ],
                "effect": {
                  "id": 1393,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1393"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "890489ac"
          },
          "loadedAt": "2026-10-26T08:05:56.374Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/36820",
          "data": {
            "id": 36820,
            "name": "漫雾敛息",
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
              "id": 101,
              "url": "https://api.seerapi.com/v1/element_type_combination/101"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "自身被击败后，对手下3次体力恢复效果减少100%",
                "analyze_info": "[sprite name=iconHit]自身[color=#57c975]被击败[/color]后，对手下3次体力恢复效果减少100%（boss有效）",
                "args": [
                  3,
                  100
                ],
                "effect": {
                  "id": 2071,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2071"
                }
              },
              {
                "info": "未击败对手则对方下2次攻击技能将70%被己方闪避",
                "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则对方下2次攻击技能将70%被[color=#52a5f2]己方[/color]闪避（boss有效）",
                "args": [
                  2,
                  70
                ],
                "effect": {
                  "id": 991,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/991"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "23ca72e0"
          },
          "loadedAt": "2026-10-26T08:06:03.169Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/37526",
          "data": {
            "id": 37526,
            "name": "月下伏",
            "power": 15,
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
              "id": 101,
              "url": "https://api.seerapi.com/v1/element_type_combination/101"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "自身的PP值总和高于对手时100%令对手焚烬",
                "analyze_info": "[sprite name=iconHit]自身的PP值总和高于对手时100%令对手[color=#57c975]焚烬[/color]",
                "args": [
                  100,
                  22
                ],
                "effect": {
                  "id": 2189,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2189"
                }
              },
              {
                "info": "吸取对手能力提升状态，吸取成功则自身免疫下1次受到的异常状态",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]吸取[/color]对手能力提升状态，[color=#52a5f2]吸取[/color]成功则自身免疫下1次受到的异常状态（boss有效）",
                "args": [
                  1
                ],
                "effect": {
                  "id": 1159,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1159"
                }
              },
              {
                "info": "自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1",
                "analyze_info": "[sprite name=iconHit]自身每处于一种能力提升状态则技能连击数+1，对手每处于一种弱化状态则技能连击数+1",
                "args": [
                  1,
                  1
                ],
                "effect": {
                  "id": 1108,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1108"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "1b3b4fcf"
          },
          "loadedAt": "2026-10-26T08:06:42.760Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28818",
          "data": {
            "id": 28818,
            "name": "灼眼焰华",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态；对手处于烧伤则开始无效对手的技能；下次攻击变得更加凌厉；对手的能力开始逐渐降低",
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
                "info": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效",
                "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]烧伤[/color]状态则2回合内100%令对手使用的技能无效",
                "args": [
                  2,
                  2,
                  100
                ],
                "effect": {
                  "id": 914,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/914"
                }
              },
              {
                "info": "下次攻击忽略对手双防值的50%",
                "analyze_info": "[sprite name=iconHit]下次攻击忽略对手双防值的50%（boss有效）",
                "args": [
                  50
                ],
                "effect": {
                  "id": 886,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/886"
                }
              },
              {
                "info": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%",
                "analyze_info": "[sprite name=iconHit]3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，[color=#52a5f2]未触发[/color]则自身下1次攻击造成伤害提升100%",
                "args": [
                  3,
                  -1,
                  -1,
                  -1,
                  0,
                  -1,
                  0,
                  1,
                  100
                ],
                "effect": {
                  "id": 2161,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2161"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "f49a8c30"
          },
          "loadedAt": "2026-10-26T08:06:50.472Z",
          "storage": "refreshed"
        }
      ]
    }
  ]
}
```

我的回答：

### Q-N50-4589-004 · 4671新增关联

```json
{
  "id": "Q-N50-4589-004",
  "instances": [
    {
      "id": "Q-N50-4589-004",
      "associatedInstances": [
        {
          "move": {
            "id": 36820,
            "name": "漫雾敛息",
            "type": "火暗影",
            "kind": "special",
            "power": 140,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2071,
              991
            ],
            "effectInstances": [
              {
                "id": 2071,
                "args": [
                  3,
                  100
                ],
                "description": "自身被击败后，对手下3次体力恢复效果减少100%"
              },
              {
                "id": 991,
                "args": [
                  2,
                  70
                ],
                "description": "未击败对手则对方下2次攻击技能将70%被己方闪避"
              }
            ],
            "description": "自身被击败后，对手下3次体力恢复效果减少100%；未击败对手则对方下2次攻击技能将70%被己方闪避",
            "revision": "seerapi:23ca72e0",
            "hash": "23ca72e0",
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
          "index": 1,
          "instance": {
            "id": 991,
            "args": [
              2,
              70
            ],
            "description": "未击败对手则对方下2次攻击技能将70%被己方闪避"
          },
          "effect": {
            "id": 991,
            "argsNum": 2,
            "template": "未击败对手则对方下{0}次攻击技能将{1}%被己方闪避",
            "revision": "seerapi:1578abe3"
          }
        },
        {
          "move": {
            "id": 36821,
            "name": "影绞",
            "type": "火暗影",
            "kind": "physical",
            "power": 150,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": false,
            "critical": "1/16",
            "effectIds": [
              2068,
              431,
              1268
            ],
            "effectInstances": [
              {
                "id": 2068,
                "args": [
                  100,
                  2
                ],
                "description": "100%令对手烧伤，未触发则回合结束后消除对手回合类效果"
              },
              {
                "id": 431,
                "args": [],
                "description": "若对手处于能力下降状态，则威力翻倍"
              },
              {
                "id": 1268,
                "args": [
                  2
                ],
                "description": "击败对手则下回合开始后随机附加烧伤、冻伤、中毒中的2种异常状态"
              }
            ],
            "description": "100%令对手烧伤，未触发则回合结束后消除对手回合类效果；若对手处于能力下降状态，则威力翻倍；击败对手则下回合开始后随机附加烧伤、冻伤、中毒中的2种异常状态",
            "revision": "seerapi:d1eedf7a",
            "hash": "d1eedf7a",
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
          "index": 2,
          "instance": {
            "id": 1268,
            "args": [
              2
            ],
            "description": "击败对手则下回合开始后随机附加烧伤、冻伤、中毒中的2种异常状态"
          },
          "effect": {
            "id": 1268,
            "argsNum": 1,
            "template": "击败对手则下回合开始后随机附加烧伤、冻伤、中毒中的{0}种异常状态",
            "revision": "seerapi:41db69c8"
          }
        },
        {
          "id": 1873,
          "description": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
          "analyze_desc": "",
          "hash": "ffc2de4b",
          "eid": 2273,
          "args": [
            4,
            1,
            2,
            1,
            3,
            1
          ],
          "isAdvanced": false,
          "source": {
            "url": "https://api.seerapi.com/v1/soulmark/1873",
            "revision": "ffc2de4b",
            "loadedAt": "2026-10-26T08:05:24.393Z"
          },
          "from": null,
          "intensifiedTo": null
        }
      ],
      "gap": "此前1927/1255/2161载荷或魂比例吸取在本体未击败后造成末杀时本技能奖励归属；当前实际本体KO独立实现。",
      "source": {
        "snapshot": {
          "file": "research/4671-reviewed-snapshot.json",
          "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
        },
        "supplement": {
          "file": "research/4671-source-supplement-audit.json",
          "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
        },
        "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
      },
      "rawSourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1873",
          "data": {
            "id": 1873,
            "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4671,
                "url": "https://api.seerapi.com/v1/pet/4671"
              }
            ],
            "effect": {
              "effect_args": [
                4,
                1,
                2,
                1,
                3,
                1
              ],
              "effect": {
                "id": 2273,
                "url": "https://api.seerapi.com/v1/eid_effect/2273"
              }
            },
            "effect_alias": "alias_2273_4_1_2_1_3_1",
            "tag": [
              {
                "id": 13,
                "url": "https://api.seerapi.com/v1/soulmark_tag/13"
              },
              {
                "id": 16,
                "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
            "from": null,
            "advance": null,
            "hash": "ffc2de4b"
          },
          "loadedAt": "2026-10-26T08:05:24.393Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/36820",
          "data": {
            "id": 36820,
            "name": "漫雾敛息",
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
              "id": 101,
              "url": "https://api.seerapi.com/v1/element_type_combination/101"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "自身被击败后，对手下3次体力恢复效果减少100%",
                "analyze_info": "[sprite name=iconHit]自身[color=#57c975]被击败[/color]后，对手下3次体力恢复效果减少100%（boss有效）",
                "args": [
                  3,
                  100
                ],
                "effect": {
                  "id": 2071,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2071"
                }
              },
              {
                "info": "未击败对手则对方下2次攻击技能将70%被己方闪避",
                "analyze_info": "[sprite name=iconHit]未[color=#57c975]击败[/color]对手则对方下2次攻击技能将70%被[color=#52a5f2]己方[/color]闪避（boss有效）",
                "args": [
                  2,
                  70
                ],
                "effect": {
                  "id": 991,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/991"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "23ca72e0"
          },
          "loadedAt": "2026-10-26T08:06:03.169Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/36821",
          "data": {
            "id": 36821,
            "name": "影绞",
            "power": 150,
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
              "id": 101,
              "url": "https://api.seerapi.com/v1/element_type_combination/101"
            },
            "learned_by_pet": [],
            "skill_effect": [
              {
                "info": "100%令对手烧伤，未触发则回合结束后消除对手回合类效果",
                "analyze_info": "[sprite name=iconHit]100%令对手[color=#57c975]烧伤[/color]，[color=#52a5f2]未触发[/color]则[color=#57c975]回合结束后[/color]消除对手[color=#52a5f2]回合类效果[/color]",
                "args": [
                  100,
                  2
                ],
                "effect": {
                  "id": 2068,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2068"
                }
              },
              {
                "info": "若对手处于能力下降状态，则威力翻倍",
                "analyze_info": "[sprite name=iconHit]若对手处于能力下降状态，则[color=#52a5f2]威力[/color]翻倍（boss有效）",
                "args": [],
                "effect": {
                  "id": 431,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/431"
                }
              },
              {
                "info": "击败对手则下回合开始后随机附加烧伤、冻伤、中毒中的2种异常状态",
                "analyze_info": "[sprite name=iconHit][color=#57c975]击败[/color]对手则下回合开始后随机附加[color=#57c975]烧伤[/color]、[color=#57c975]冻伤[/color]、[color=#57c975]中毒[/color]中的2种异常状态",
                "args": [
                  2
                ],
                "effect": {
                  "id": 1268,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1268"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "d1eedf7a"
          },
          "loadedAt": "2026-10-26T08:06:22.510Z",
          "storage": "refreshed"
        }
      ]
    }
  ]
}
```

我的回答：

### Q-N50-4654-012 · 4671新增关联

```json
{
  "id": "Q-N50-4654-012",
  "instances": [
    {
      "id": "Q-N50-4654-012",
      "associatedInstances": [
        {
          "id": 1873,
          "description": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
          "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
          "analyze_desc": "",
          "hash": "ffc2de4b",
          "eid": 2273,
          "args": [
            4,
            1,
            2,
            1,
            3,
            1
          ],
          "isAdvanced": false,
          "source": {
            "url": "https://api.seerapi.com/v1/soulmark/1873",
            "revision": "ffc2de4b",
            "loadedAt": "2026-10-26T08:05:24.393Z"
          },
          "from": null,
          "intensifiedTo": null
        },
        {
          "move": {
            "id": 28422,
            "name": "跃影绫锋",
            "type": "普通",
            "kind": "status",
            "power": 0,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": true,
            "critical": "1/16",
            "effectIds": [
              946,
              1927,
              427,
              843
            ],
            "effectInstances": [
              {
                "id": 946,
                "args": [
                  1
                ],
                "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍"
              },
              {
                "id": 1927,
                "args": [
                  4,
                  300,
                  2
                ],
                "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
              },
              {
                "id": 427,
                "args": [
                  3,
                  -1
                ],
                "description": "3回合内每次直接攻击都会使对手防御和特防-1"
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
            "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍；4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍；3回合内每次直接攻击都会使对手防御和特防-1；下2回合令自身所有技能先制+2",
            "revision": "seerapi:6a0a4a4e",
            "hash": "6a0a4a4e",
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
          "index": 1,
          "instance": {
            "id": 1927,
            "args": [
              4,
              300,
              2
            ],
            "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
          },
          "effect": {
            "id": 1927,
            "argsNum": 3,
            "template": "{0}回合内每回合使用技能则吸取对手{1}点体力，吸取体力时若自身体力低于最大体力的1/{2}则吸取效果翻倍",
            "revision": "seerapi:c5cd9cbb"
          }
        },
        {
          "move": {
            "id": 28819,
            "name": "炙血封喉",
            "type": "普通",
            "kind": "status",
            "power": 0,
            "pp": 5,
            "priority": 0,
            "accuracy": 95,
            "alwaysHit": true,
            "critical": "1/16",
            "effectIds": [
              946,
              1927,
              1255,
              843
            ],
            "effectInstances": [
              {
                "id": 946,
                "args": [
                  1
                ],
                "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍"
              },
              {
                "id": 1927,
                "args": [
                  4,
                  300,
                  2
                ],
                "description": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍"
              },
              {
                "id": 1255,
                "args": [
                  3,
                  100,
                  2,
                  3
                ],
                "description": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害"
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
            "description": "全属性+1，若自身当前体力低于对手则强化效果翻倍；4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍；3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害；下2回合令自身所有技能先制+2",
            "revision": "seerapi:866dfe82",
            "hash": "866dfe82",
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
          "index": 2,
          "instance": {
            "id": 1255,
            "args": [
              3,
              100,
              2,
              3
            ],
            "description": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害"
          },
          "effect": {
            "id": 1255,
            "argsNum": 4,
            "template": "{0}回合内每回合使用技能则{1}%令对手{2}，未触发则附加对手最大体力1/{3}的百分比伤害",
            "revision": "seerapi:e2d97873"
          }
        },
        {
          "move": {
            "id": 28818,
            "name": "灼眼焰华",
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
              914,
              886,
              2161
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
                "id": 914,
                "args": [
                  2,
                  2,
                  100
                ],
                "description": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效"
              },
              {
                "id": 886,
                "args": [
                  50
                ],
                "description": "下次攻击忽略对手双防值的50%"
              },
              {
                "id": 2161,
                "args": [
                  3,
                  -1,
                  -1,
                  -1,
                  0,
                  -1,
                  0,
                  1,
                  100
                ],
                "description": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%"
              }
            ],
            "description": "4回合内免疫并反弹所有受到的异常状态；若对手处于烧伤状态则2回合内100%令对手使用的技能无效；下次攻击忽略对手双防值的50%；3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%",
            "revision": "seerapi:f49a8c30",
            "hash": "f49a8c30",
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
          "index": 3,
          "instance": {
            "id": 2161,
            "args": [
              3,
              -1,
              -1,
              -1,
              0,
              -1,
              0,
              1,
              100
            ],
            "description": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%"
          },
          "effect": {
            "id": 2161,
            "argsNum": 9,
            "template": "{0}回合内使用技能令对手{1}，未触发则自身下{7}次攻击造成伤害提升{8}%",
            "revision": "seerapi:cf822ee6"
          }
        }
      ],
      "gap": "实际使用后自身HP0时持续载荷资格；当前没有原生自损技能，不将研究交互当自然答案。",
      "source": {
        "snapshot": {
          "file": "research/4671-reviewed-snapshot.json",
          "sha256": "bc5893e9f2990761a5db74df68d5b811ef198aeef665e99aa410f9bc1feaa82c"
        },
        "supplement": {
          "file": "research/4671-source-supplement-audit.json",
          "sha256": "e2eed0dd84d4ee1881544a663f327136d7e741e3f37fe6bc7887a8d3cea4f291"
        },
        "oldAnswersRead": "frozen confirmation JSON only; no live MD read"
      },
      "rawSourceRecords": [
        {
          "url": "https://api.seerapi.com/v1/soulmark/1873",
          "data": {
            "id": 1873,
            "desc": "自身攻击技能命中时吸取对手4项能力1级，自身属性技能命中时吸取对手所有技能2点PP值；回合开始时，若自身体力不低于上回合开始则当回合所有技能先制+1且必定命中，若自身体力低于上回合开始则当回合自身使用技能后吸取对手最大体力的1/3（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身攻击技能命中时令对手随机4项能力等级-1\r\n<indent=32><sprite=4><indent=48>触发成功则自身获得等量的能力提升\r\n<indent=16><sprite=3><indent=32>自身属性技能命中时<color=#64F9FA>吸取</color>对手所有技能2点<b>PP值</b>\r\n\r\n<indent=0><sprite=0><indent=16>回合开始效果：\r\n<indent=16><sprite=3><indent=32>回合开始时：\r\n<indent=32><sprite=4><indent=48>若自身体力不低于上回合开始则当回合所有技能<b>先制</b>+1且<color=#64F9FA>必定命中</color>\r\n<indent=32><sprite=4><indent=48>若自身体力低于上回合开始则当回合自身使用技能后<color=#64F9FA>吸取</color>对手最大体力的1/3",
            "analyze_desc": "",
            "pve_effective": false,
            "intensified": false,
            "is_adv": false,
            "pet": [
              {
                "id": 4671,
                "url": "https://api.seerapi.com/v1/pet/4671"
              }
            ],
            "effect": {
              "effect_args": [
                4,
                1,
                2,
                1,
                3,
                1
              ],
              "effect": {
                "id": 2273,
                "url": "https://api.seerapi.com/v1/eid_effect/2273"
              }
            },
            "effect_alias": "alias_2273_4_1_2_1_3_1",
            "tag": [
              {
                "id": 13,
                "url": "https://api.seerapi.com/v1/soulmark_tag/13"
              },
              {
                "id": 16,
                "url": "https://api.seerapi.com/v1/soulmark_tag/16"
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
            "from": null,
            "advance": null,
            "hash": "ffc2de4b"
          },
          "loadedAt": "2026-10-26T08:05:24.393Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28422",
          "data": {
            "id": 28422,
            "name": "跃影绫锋",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；开始吸取对手的体力了；攻击开始弱化对手的防御能力；出手变得更快了",
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
                "info": "全属性+1，若自身当前体力低于对手则强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1（boss有效），若自身当前体力低于对手则强化效果翻倍",
                "args": [
                  1
                ],
                "effect": {
                  "id": 946,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/946"
                }
              },
              {
                "info": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能则[color=#52a5f2]吸取[/color]对手300点体力，[color=#52a5f2]吸取[/color]体力时若自身体力低于最大体力的1/2则[color=#52a5f2]吸取[/color]效果翻倍（boss有效）",
                "args": [
                  4,
                  300,
                  2
                ],
                "effect": {
                  "id": 1927,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1927"
                }
              },
              {
                "info": "3回合内每次直接攻击都会使对手防御和特防-1",
                "analyze_info": "[sprite name=iconHit]3回合内每次直接攻击都会使对手防御和特防-1（boss有效）",
                "args": [
                  3,
                  -1
                ],
                "effect": {
                  "id": 427,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/427"
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
            "hash": "6a0a4a4e"
          },
          "loadedAt": "2026-10-26T08:06:15.963Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28818",
          "data": {
            "id": 28818,
            "name": "灼眼焰华",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "开始免疫并反弹受到的异常状态；对手处于烧伤则开始无效对手的技能；下次攻击变得更加凌厉；对手的能力开始逐渐降低",
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
                "info": "若对手处于烧伤状态则2回合内100%令对手使用的技能无效",
                "analyze_info": "[sprite name=iconHit]若对手处于[color=#57c975]烧伤[/color]状态则2回合内100%令对手使用的技能无效",
                "args": [
                  2,
                  2,
                  100
                ],
                "effect": {
                  "id": 914,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/914"
                }
              },
              {
                "info": "下次攻击忽略对手双防值的50%",
                "analyze_info": "[sprite name=iconHit]下次攻击忽略对手双防值的50%（boss有效）",
                "args": [
                  50
                ],
                "effect": {
                  "id": 886,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/886"
                }
              },
              {
                "info": "3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，未触发则自身下1次攻击造成伤害提升100%",
                "analyze_info": "[sprite name=iconHit]3回合内使用技能令对手攻击-1，防御-1，特攻-1，速度-1，[color=#52a5f2]未触发[/color]则自身下1次攻击造成伤害提升100%",
                "args": [
                  3,
                  -1,
                  -1,
                  -1,
                  0,
                  -1,
                  0,
                  1,
                  100
                ],
                "effect": {
                  "id": 2161,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/2161"
                }
              }
            ],
            "friend_skill_effect": [],
            "hide_effect": null,
            "advance": null,
            "hash": "f49a8c30"
          },
          "loadedAt": "2026-10-26T08:06:50.472Z",
          "storage": "refreshed"
        },
        {
          "url": "https://api.seerapi.com/v1/skill/28819",
          "data": {
            "id": 28819,
            "name": "炙血封喉",
            "power": 0,
            "max_pp": 5,
            "accuracy": 95,
            "crit_rate": null,
            "priority": 0,
            "must_hit": true,
            "atk_num": 1,
            "info": "全属性提升了；开始吸取对手的体力了；开始令对手烧伤了；出手变得更快了",
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
                "info": "全属性+1，若自身当前体力低于对手则强化效果翻倍",
                "analyze_info": "[sprite name=iconHit][color=#52a5f2]全属性[/color]+1（boss有效），若自身当前体力低于对手则强化效果翻倍",
                "args": [
                  1
                ],
                "effect": {
                  "id": 946,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/946"
                }
              },
              {
                "info": "4回合内每回合使用技能则吸取对手300点体力，吸取体力时若自身体力低于最大体力的1/2则吸取效果翻倍",
                "analyze_info": "[sprite name=iconHit]4回合内每回合使用技能则[color=#52a5f2]吸取[/color]对手300点体力，[color=#52a5f2]吸取[/color]体力时若自身体力低于最大体力的1/2则[color=#52a5f2]吸取[/color]效果翻倍（boss有效）",
                "args": [
                  4,
                  300,
                  2
                ],
                "effect": {
                  "id": 1927,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1927"
                }
              },
              {
                "info": "3回合内每回合使用技能则100%令对手烧伤，未触发则附加对手最大体力1/3的百分比伤害",
                "analyze_info": "[sprite name=iconHit]3回合内每回合使用技能则100%令对手[color=#57c975]烧伤[/color]，[color=#52a5f2]未触发[/color]则附加对手最大体力1/3的[color=#52a5f2]百分比伤害[/color]",
                "args": [
                  3,
                  100,
                  2,
                  3
                ],
                "effect": {
                  "id": 1255,
                  "url": "https://api.seerapi.com/v1/skill_effect_type/1255"
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
            "hash": "866dfe82"
          },
          "loadedAt": "2026-10-26T08:06:57.575Z",
          "storage": "refreshed"
        }
      ]
    }
  ]
}
```

我的回答：
