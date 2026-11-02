

## 4669 · 原固定第48只

49项逐审、104来源检查0；生产358/358 exit0，本只49项。全部独立工作完成，部分实现待确认；多精灵延期2项。未正式部署/验收。用户编辑期间仅暂存。

### Q-N50-4669-001

```json
{
  "id": "Q-N50-4669-001",
  "species": 4669,
  "version": {
    "id": 1872,
    "description": "自身登场时为对手附加3回合的回命，若对手已处于回命则消除对手的能力提升与回合类效果，消除成功任意一项则令对手焚烬；自身使用攻击技能时，若对手处于回命，则消除对手回合类效果，消除成功则当回合造成的攻击伤害提升100%，若对手不处于回命，则2回合内体力恢复效果减少100%（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场时为对手附加回命，若对手已处于回命则<color=#64F9FA>消除</color>对手的<b>能力提升</b>与<b>回合类效果</b>，消除成功任意一项则<color=#64F9FA>令对手焚烬</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能时：\r\n<indent=32><sprite=4><indent=48>若对手处于回命则<color=#64F9FA>消除</color>对手<b>回合类效果</b>，消除成功则当回合造成的<b>攻击伤害</b>提升100%\r\n<indent=32><sprite=4><indent=48>若对手不处于回命则2回合内<b>体力恢复效果<color=#64F9FA></b>减少</color>100%",
    "analyze_desc": "",
    "hash": "d1f2710a",
    "eid": 2267,
    "args": [
      100,
      2,
      100,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1872",
      "revision": "d1f2710a",
      "loadedAt": "2026-10-26T08:00:25.409Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  "effectInstance": "1872非回命分支",
  "source": {
    "id": 1872,
    "description": "自身登场时为对手附加3回合的回命，若对手已处于回命则消除对手的能力提升与回合类效果，消除成功任意一项则令对手焚烬；自身使用攻击技能时，若对手处于回命，则消除对手回合类效果，消除成功则当回合造成的攻击伤害提升100%，若对手不处于回命，则2回合内体力恢复效果减少100%（boss无效）",
    "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场时为对手附加回命，若对手已处于回命则<color=#64F9FA>消除</color>对手的<b>能力提升</b>与<b>回合类效果</b>，消除成功任意一项则<color=#64F9FA>令对手焚烬</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能时：\r\n<indent=32><sprite=4><indent=48>若对手处于回命则<color=#64F9FA>消除</color>对手<b>回合类效果</b>，消除成功则当回合造成的<b>攻击伤害</b>提升100%\r\n<indent=32><sprite=4><indent=48>若对手不处于回命则2回合内<b>体力恢复效果<color=#64F9FA></b>减少</color>100%",
    "analyze_desc": "",
    "hash": "d1f2710a",
    "eid": 2267,
    "args": [
      100,
      2,
      100,
      1
    ],
    "isAdvanced": false,
    "source": {
      "url": "https://api.seerapi.com/v1/soulmark/1872",
      "revision": "d1f2710a",
      "loadedAt": "2026-10-26T08:00:25.409Z"
    },
    "from": null,
    "intensifiedTo": null
  },
  "checked": [
    {
      "snapshot": "research/4669-reviewed-snapshot.json",
      "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
      "supplement": "research/4669-source-supplement-audit.json",
      "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
    },
    "全部API文本与Wiki均省略回复减少的主体；未取得适用冻结确认。"
  ],
  "gap": "自身使用攻击技能且敌不处于回命时，回复效果减少100%的作用方省略；自身禁疗与敌方禁疗会导致不同真实HP。",
  "question": "对手不处于回命时，2回合体力恢复效果减少100%作用于自身还是对手？",
  "answer": ""
}
```

明确问题：对手不处于回命时，2回合体力恢复效果减少100%作用于自身还是对手？

我的回答：

### Q-N50-4669-011

```json
{
  "id": "Q-N50-4669-011",
  "species": 4669,
  "skill": {
    "id": 37503,
    "name": "祸肆·摧朽",
    "type": "远古火",
    "kind": "physical",
    "power": 150,
    "pp": 5,
    "priority": 0,
    "accuracy": 97,
    "alwaysHit": false,
    "critical": "1/16",
    "effectIds": [
      541,
      1522,
      54,
      619
    ],
    "effectInstances": [
      {
        "id": 541,
        "args": [
          300,
          400
        ],
        "description": "造成的攻击伤害若低于300则恢复自身400点体力"
      },
      {
        "id": 1522,
        "args": [
          220,
          300
        ],
        "description": "附加220点固定伤害，若当回合造成的伤害高于300则固伤效果翻倍"
      },
      {
        "id": 54,
        "args": [
          2,
          2
        ],
        "description": "2回合使对方攻击伤害是正常状态下的1/2倍"
      },
      {
        "id": 619,
        "args": [
          1,
          1
        ],
        "description": "下1回合令对手所有技能先制-1"
      }
    ],
    "description": "造成的攻击伤害若低于300则恢复自身400点体力；附加220点固定伤害，若当回合造成的伤害高于300则固伤效果翻倍；2回合使对方攻击伤害是正常状态下的1/2倍；下1回合令对手所有技能先制-1",
    "revision": "seerapi:cbdee065",
    "hash": "cbdee065",
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
  "instance": {
    "moveId": 37503,
    "hash": "cbdee065",
    "index": 1,
    "id": 1522,
    "args": [
      220,
      300
    ],
    "description": "附加220点固定伤害，若当回合造成的伤害高于300则固伤效果翻倍"
  },
  "effect": {
    "id": 1522,
    "argsNum": 2,
    "template": "附加{0}点固定伤害，若当回合造成的伤害高于{1}则固伤效果翻倍",
    "revision": "seerapi:fcc966a9"
  },
  "checked": [
    {
      "snapshot": "research/4669-reviewed-snapshot.json",
      "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
      "supplement": "research/4669-source-supplement-audit.json",
      "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
    },
    {
      "file": "research/FIXED60-ANSWER-USER-CONFIRMATIONS.json",
      "scope": "Q-A60-4318-085仅35598/[200,300]本次完整攻击伤害，不能自动扩至当前37503/[220,300]。"
    }
  ],
  "gap": "当前原文当回合造成伤害是否在判高于300时包含该条基础220；本体红100时不包含为220，包含为440。",
  "question": "37503的1522[220,300]判定当回合伤害高于300时，统计哪些已结算伤害，是否计入本条基础220？",
  "answer": ""
}
```

明确问题：37503的1522[220,300]判定当回合伤害高于300时，统计哪些已结算伤害，是否计入本条基础220？

我的回答：

### Q-N50-4511-006 · 4669新增关联

```json
{
  "id": "Q-N50-4511-006",
  "instances": [
    {
      "id": "Q-N50-4511-006",
      "gap": "回命已有短时重授、191免异反弹混源、933未消费必暴重授",
      "associatedInstances": [
        {
          "key": "4669:soul:1872",
          "sourceDigest": "d85aba4507ef1dca840d23a62f35de3a2e46be4978c292fbaab532fcd6f34312",
          "source": {
            "provider": "seerapi",
            "url": "https://api.seerapi.com/v1/pet/4669",
            "revision": "466dade9",
            "loadedAt": "2026-10-26T08:00:18.349Z"
          },
          "raw": {
            "id": 1872,
            "description": "自身登场时为对手附加3回合的回命，若对手已处于回命则消除对手的能力提升与回合类效果，消除成功任意一项则令对手焚烬；自身使用攻击技能时，若对手处于回命，则消除对手回合类效果，消除成功则当回合造成的攻击伤害提升100%，若对手不处于回命，则2回合内体力恢复效果减少100%（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场时为对手附加回命，若对手已处于回命则<color=#64F9FA>消除</color>对手的<b>能力提升</b>与<b>回合类效果</b>，消除成功任意一项则<color=#64F9FA>令对手焚烬</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能时：\r\n<indent=32><sprite=4><indent=48>若对手处于回命则<color=#64F9FA>消除</color>对手<b>回合类效果</b>，消除成功则当回合造成的<b>攻击伤害</b>提升100%\r\n<indent=32><sprite=4><indent=48>若对手不处于回命则2回合内<b>体力恢复效果<color=#64F9FA></b>减少</color>100%",
            "analyze_desc": "",
            "hash": "d1f2710a",
            "eid": 2267,
            "args": [
              100,
              2,
              100,
              1
            ],
            "isAdvanced": false,
            "source": {
              "url": "https://api.seerapi.com/v1/soulmark/1872",
              "revision": "d1f2710a",
              "loadedAt": "2026-10-26T08:00:25.409Z"
            },
            "from": null,
            "intensifiedTo": null
          },
          "petHash": "466dade9",
          "soulHash": "d1f2710a"
        },
        {
          "key": "4669:skill:28803:0",
          "sourceDigest": "8ec891bcd4330384fdefdf8a9f92f907a48ee920b88002fb149ba9170ef4dd87",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:d2e80c40"
          },
          "raw": {
            "instance": {
              "id": 191,
              "args": [
                4
              ],
              "description": "4回合内免疫并反弹所有受到的异常状态"
            },
            "index": 0,
            "description": "4回合内免疫并反弹所有受到的异常状态；对手未持有回命时为对手附加3回合的回命，若对手持有回命且剩余回合数大于1则回合数-1；3回合内对手使用技能消耗的PP值变为2倍；3回合内每回合使用技能100%令对手烧伤，未触发则令对手所有技能PP值-2",
            "metadata": {
              "id": 191,
              "argsNum": 1,
              "template": "{0}回合内免疫并反弹所有受到的异常状态",
              "revision": "seerapi:ebdb8dc2"
            }
          },
          "petHash": "466dade9",
          "skillHash": "d2e80c40",
          "effectHash": "seerapi:ebdb8dc2",
          "index": 0,
          "args": [
            4
          ]
        },
        {
          "key": "4669:skill:37504:2",
          "sourceDigest": "7efc6e589df78368d0c3d6278e84211d0c7921b9d0d9aba51d76d42caec3e452",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:7b54bfab"
          },
          "raw": {
            "instance": {
              "id": 933,
              "args": [
                1
              ],
              "description": "未击败对手则己方下1次攻击技能必定打出致命一击"
            },
            "index": 2,
            "description": "消除对手回合类效果，若对手不处于回合类效果则100%令对手烧伤；打出致命一击则附加对手最大体力1/3的百分比伤害；未击败对手则己方下1次攻击技能必定打出致命一击；击败对手则下1回合自身造成的攻击伤害提升75%，若以致命一击击败对手则伤害再提升75%",
            "metadata": {
              "id": 933,
              "argsNum": 1,
              "template": "未击败对手则己方下{0}次攻击技能必定打出致命一击",
              "revision": "seerapi:f2e9e9be"
            }
          },
          "petHash": "466dade9",
          "skillHash": "7b54bfab",
          "effectHash": "seerapi:f2e9e9be",
          "index": 2,
          "args": [
            1
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:28803:0",
        "4669:skill:37504:2"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4612-002 · 4669新增关联

```json
{
  "id": "Q-N50-4612-002",
  "instances": [
    {
      "id": "Q-N50-4612-002",
      "gap": "1872已有回命清强与清回合遇可清强化保护的顺序",
      "associatedInstances": [
        {
          "key": "4669:soul:1872",
          "sourceDigest": "d85aba4507ef1dca840d23a62f35de3a2e46be4978c292fbaab532fcd6f34312",
          "source": {
            "provider": "seerapi",
            "url": "https://api.seerapi.com/v1/pet/4669",
            "revision": "466dade9",
            "loadedAt": "2026-10-26T08:00:18.349Z"
          },
          "raw": {
            "id": 1872,
            "description": "自身登场时为对手附加3回合的回命，若对手已处于回命则消除对手的能力提升与回合类效果，消除成功任意一项则令对手焚烬；自身使用攻击技能时，若对手处于回命，则消除对手回合类效果，消除成功则当回合造成的攻击伤害提升100%，若对手不处于回命，则2回合内体力恢复效果减少100%（boss无效）",
            "desc_formatting_adjustment": "<indent=0><sprite=0><indent=16>登场效果：\r\n<indent=16><sprite=3><indent=32>自身登场时为对手附加回命，若对手已处于回命则<color=#64F9FA>消除</color>对手的<b>能力提升</b>与<b>回合类效果</b>，消除成功任意一项则<color=#64F9FA>令对手焚烬</color>\r\n\r\n<indent=0><sprite=0><indent=16>攻击技能额外效果：\r\n<indent=16><sprite=3><indent=32>自身使用攻击技能时：\r\n<indent=32><sprite=4><indent=48>若对手处于回命则<color=#64F9FA>消除</color>对手<b>回合类效果</b>，消除成功则当回合造成的<b>攻击伤害</b>提升100%\r\n<indent=32><sprite=4><indent=48>若对手不处于回命则2回合内<b>体力恢复效果<color=#64F9FA></b>减少</color>100%",
            "analyze_desc": "",
            "hash": "d1f2710a",
            "eid": 2267,
            "args": [
              100,
              2,
              100,
              1
            ],
            "isAdvanced": false,
            "source": {
              "url": "https://api.seerapi.com/v1/soulmark/1872",
              "revision": "d1f2710a",
              "loadedAt": "2026-10-26T08:00:25.409Z"
            },
            "from": null,
            "intensifiedTo": null
          },
          "petHash": "466dade9",
          "soulHash": "d1f2710a"
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:10251:0"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4589-002 · 4669新增关联

```json
{
  "id": "Q-N50-4589-002",
  "instances": [
    {
      "id": "Q-N50-4589-002",
      "gap": "978两端能力吸取cap与禁强化联动",
      "associatedInstances": [
        {
          "key": "4669:skill:37500:0",
          "sourceDigest": "d2a6f617af73181eb0acc15dfed1e7979285e63d3426904921be28f7c4035c05",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:5d330a91"
          },
          "raw": {
            "instance": {
              "id": 978,
              "args": [],
              "description": "吸取并反转对手能力提升状态"
            },
            "index": 0,
            "description": "吸取并反转对手能力提升状态；攻击对手时若对手处于烧伤状态，则100%使对手焚烬；若对手不处于烧伤状态则吸取对手1/3最大体力",
            "metadata": {
              "id": 978,
              "argsNum": 0,
              "template": "吸取并反转对手能力提升状态",
              "revision": "seerapi:5a46e29d"
            }
          },
          "petHash": "466dade9",
          "skillHash": "5d330a91",
          "effectHash": "seerapi:5a46e29d",
          "index": 0,
          "args": []
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:37500:0"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4511-002 · 4669新增关联

```json
{
  "id": "Q-N50-4511-002",
  "instances": [
    {
      "id": "Q-N50-4511-002",
      "gap": "978能力保护与反转交叉",
      "associatedInstances": [
        {
          "key": "4669:skill:37500:0",
          "sourceDigest": "d2a6f617af73181eb0acc15dfed1e7979285e63d3426904921be28f7c4035c05",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:5d330a91"
          },
          "raw": {
            "instance": {
              "id": 978,
              "args": [],
              "description": "吸取并反转对手能力提升状态"
            },
            "index": 0,
            "description": "吸取并反转对手能力提升状态；攻击对手时若对手处于烧伤状态，则100%使对手焚烬；若对手不处于烧伤状态则吸取对手1/3最大体力",
            "metadata": {
              "id": 978,
              "argsNum": 0,
              "template": "吸取并反转对手能力提升状态",
              "revision": "seerapi:5a46e29d"
            }
          },
          "petHash": "466dade9",
          "skillHash": "5d330a91",
          "effectHash": "seerapi:5a46e29d",
          "index": 0,
          "args": []
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:37500:0"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4625-011 · 4669新增关联

```json
{
  "id": "Q-N50-4625-011",
  "instances": [
    {
      "id": "Q-N50-4625-011",
      "gap": "1766与1924首授当次实际用招是否触发",
      "associatedInstances": [
        {
          "key": "4669:skill:28803:3",
          "sourceDigest": "f35445437c4a3c4da7711cd2b2ee28fb6878d4204dc36863e60d400f8120767a",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:d2e80c40"
          },
          "raw": {
            "instance": {
              "id": 1766,
              "args": [
                3,
                100,
                2,
                2
              ],
              "description": "3回合内每回合使用技能100%令对手烧伤，未触发则令对手所有技能PP值-2"
            },
            "index": 3,
            "description": "4回合内免疫并反弹所有受到的异常状态；对手未持有回命时为对手附加3回合的回命，若对手持有回命且剩余回合数大于1则回合数-1；3回合内对手使用技能消耗的PP值变为2倍；3回合内每回合使用技能100%令对手烧伤，未触发则令对手所有技能PP值-2",
            "metadata": {
              "id": 1766,
              "argsNum": 4,
              "template": "{0}回合内每回合使用技能{1}%令对手{2}，未触发则令对手所有技能PP值-{3}",
              "revision": "seerapi:f67799ab"
            }
          },
          "petHash": "466dade9",
          "skillHash": "d2e80c40",
          "effectHash": "seerapi:f67799ab",
          "index": 3,
          "args": [
            3,
            100,
            2,
            2
          ]
        },
        {
          "key": "4669:skill:28804:1",
          "sourceDigest": "44f38e218a1d507971c22e2053e99095475b59a236ba7c2dad851bf1ba95376c",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:3d8b3f25"
          },
          "raw": {
            "instance": {
              "id": 1924,
              "args": [
                4,
                400
              ],
              "description": "4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害"
            },
            "index": 1,
            "description": "全属性+1，对手处于烧伤状态时强化效果翻倍；4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害；下2回合造成的攻击伤害额外提升50%；下2回合令自身所有技能先制+2",
            "metadata": {
              "id": 1924,
              "argsNum": 2,
              "template": "{0}回合内每回合使用技能恢复自身{1}点体力并造成等量固定伤害",
              "revision": "seerapi:beeb77e"
            }
          },
          "petHash": "466dade9",
          "skillHash": "3d8b3f25",
          "effectHash": "seerapi:beeb77e",
          "index": 1,
          "args": [
            4,
            400
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:20267:0",
        "4669:skill:10251:0",
        "4669:skill:20307:0",
        "4669:skill:28803:3",
        "4669:skill:28804:1"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4503-002 · 4669新增关联

```json
{
  "id": "Q-N50-4503-002",
  "instances": [
    {
      "id": "Q-N50-4503-002",
      "gap": "1924回复请求400与实际回复差异时等量固伤基数",
      "associatedInstances": [
        {
          "key": "4669:skill:28804:1",
          "sourceDigest": "44f38e218a1d507971c22e2053e99095475b59a236ba7c2dad851bf1ba95376c",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:3d8b3f25"
          },
          "raw": {
            "instance": {
              "id": 1924,
              "args": [
                4,
                400
              ],
              "description": "4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害"
            },
            "index": 1,
            "description": "全属性+1，对手处于烧伤状态时强化效果翻倍；4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害；下2回合造成的攻击伤害额外提升50%；下2回合令自身所有技能先制+2",
            "metadata": {
              "id": 1924,
              "argsNum": 2,
              "template": "{0}回合内每回合使用技能恢复自身{1}点体力并造成等量固定伤害",
              "revision": "seerapi:beeb77e"
            }
          },
          "petHash": "466dade9",
          "skillHash": "3d8b3f25",
          "effectHash": "seerapi:beeb77e",
          "index": 1,
          "args": [
            4,
            400
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:20267:0",
        "4669:skill:10251:0",
        "4669:skill:20307:0",
        "4669:skill:28804:1"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4612-001 · 4669新增关联

```json
{
  "id": "Q-N50-4612-001",
  "instances": [
    {
      "id": "Q-N50-4612-001",
      "gap": "1472本源75%/先手150%对此前1924非红固伤范围",
      "associatedInstances": [
        {
          "key": "4669:skill:37501:0",
          "sourceDigest": "172525f9c9f6441a3c33d7ce23a594117c7ba01d6ac7f8910583fa0f7855dd66",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:598f45a8"
          },
          "raw": {
            "instance": {
              "id": 1472,
              "args": [
                75
              ],
              "description": "自身处于能力提升状态时造成的伤害提升75%，先出手时效果翻倍"
            },
            "index": 0,
            "description": "自身处于能力提升状态时造成的伤害提升75%，先出手时效果翻倍",
            "metadata": {
              "id": 1472,
              "argsNum": 1,
              "template": "自身处于能力提升状态时造成的伤害提升{0}%，先出手时效果翻倍",
              "revision": "seerapi:f71f22fa"
            }
          },
          "petHash": "466dade9",
          "skillHash": "598f45a8",
          "effectHash": "seerapi:f71f22fa",
          "index": 0,
          "args": [
            75
          ]
        },
        {
          "key": "4669:skill:28804:1",
          "sourceDigest": "44f38e218a1d507971c22e2053e99095475b59a236ba7c2dad851bf1ba95376c",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:3d8b3f25"
          },
          "raw": {
            "instance": {
              "id": 1924,
              "args": [
                4,
                400
              ],
              "description": "4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害"
            },
            "index": 1,
            "description": "全属性+1，对手处于烧伤状态时强化效果翻倍；4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害；下2回合造成的攻击伤害额外提升50%；下2回合令自身所有技能先制+2",
            "metadata": {
              "id": 1924,
              "argsNum": 2,
              "template": "{0}回合内每回合使用技能恢复自身{1}点体力并造成等量固定伤害",
              "revision": "seerapi:beeb77e"
            }
          },
          "petHash": "466dade9",
          "skillHash": "3d8b3f25",
          "effectHash": "seerapi:beeb77e",
          "index": 1,
          "args": [
            4,
            400
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:20267:0",
        "4669:skill:10251:0",
        "4669:skill:20307:0",
        "4669:skill:22358:0",
        "4669:skill:22358:1",
        "4669:skill:37501:0",
        "4669:skill:28804:1"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4618-002 · 4669新增关联

```json
{
  "id": "Q-N50-4618-002",
  "instances": [
    {
      "id": "Q-N50-4618-002",
      "gap": "1356本源暴击且完整红0时是否附加",
      "associatedInstances": [
        {
          "key": "4669:skill:37504:1",
          "sourceDigest": "4c089dbf888c8ca0708185a6c8814fc3ffb1ebdba5d78ab8073d64f64100113b",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:7b54bfab"
          },
          "raw": {
            "instance": {
              "id": 1356,
              "args": [
                3
              ],
              "description": "打出致命一击则附加对手最大体力1/3的百分比伤害"
            },
            "index": 1,
            "description": "消除对手回合类效果，若对手不处于回合类效果则100%令对手烧伤；打出致命一击则附加对手最大体力1/3的百分比伤害；未击败对手则己方下1次攻击技能必定打出致命一击；击败对手则下1回合自身造成的攻击伤害提升75%，若以致命一击击败对手则伤害再提升75%",
            "metadata": {
              "id": 1356,
              "argsNum": 1,
              "template": "打出致命一击则附加对手最大体力1/{0}的百分比伤害",
              "revision": "seerapi:4daf0872"
            }
          },
          "petHash": "466dade9",
          "skillHash": "7b54bfab",
          "effectHash": "seerapi:4daf0872",
          "index": 1,
          "args": [
            3
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:22358:0",
        "4669:skill:22358:1",
        "4669:skill:37504:1"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4589-004 · 4669新增关联

```json
{
  "id": "Q-N50-4589-004",
  "instances": [
    {
      "id": "Q-N50-4589-004",
      "gap": "37504本体未KO而此前1924用后载荷晚杀归属",
      "associatedInstances": [
        {
          "key": "4669:skill:37504:2",
          "sourceDigest": "7efc6e589df78368d0c3d6278e84211d0c7921b9d0d9aba51d76d42caec3e452",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:7b54bfab"
          },
          "raw": {
            "instance": {
              "id": 933,
              "args": [
                1
              ],
              "description": "未击败对手则己方下1次攻击技能必定打出致命一击"
            },
            "index": 2,
            "description": "消除对手回合类效果，若对手不处于回合类效果则100%令对手烧伤；打出致命一击则附加对手最大体力1/3的百分比伤害；未击败对手则己方下1次攻击技能必定打出致命一击；击败对手则下1回合自身造成的攻击伤害提升75%，若以致命一击击败对手则伤害再提升75%",
            "metadata": {
              "id": 933,
              "argsNum": 1,
              "template": "未击败对手则己方下{0}次攻击技能必定打出致命一击",
              "revision": "seerapi:f2e9e9be"
            }
          },
          "petHash": "466dade9",
          "skillHash": "7b54bfab",
          "effectHash": "seerapi:f2e9e9be",
          "index": 2,
          "args": [
            1
          ]
        },
        {
          "key": "4669:skill:37504:3",
          "sourceDigest": "190a8debef2bff5538e88849dbe6a89fae8ab5e324484b4ddb51875498b43d54",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:7b54bfab"
          },
          "raw": {
            "instance": {
              "id": 1719,
              "args": [
                1,
                75,
                75
              ],
              "description": "击败对手则下1回合自身造成的攻击伤害提升75%，若以致命一击击败对手则伤害再提升75%"
            },
            "index": 3,
            "description": "消除对手回合类效果，若对手不处于回合类效果则100%令对手烧伤；打出致命一击则附加对手最大体力1/3的百分比伤害；未击败对手则己方下1次攻击技能必定打出致命一击；击败对手则下1回合自身造成的攻击伤害提升75%，若以致命一击击败对手则伤害再提升75%",
            "metadata": {
              "id": 1719,
              "argsNum": 3,
              "template": "击败对手则下{0}回合自身造成的攻击伤害提升{1}%，若以致命一击击败对手则伤害再提升{2}%",
              "revision": "seerapi:6e5cc471"
            }
          },
          "petHash": "466dade9",
          "skillHash": "7b54bfab",
          "effectHash": "seerapi:6e5cc471",
          "index": 3,
          "args": [
            1,
            75,
            75
          ]
        },
        {
          "key": "4669:skill:28804:1",
          "sourceDigest": "44f38e218a1d507971c22e2053e99095475b59a236ba7c2dad851bf1ba95376c",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:3d8b3f25"
          },
          "raw": {
            "instance": {
              "id": 1924,
              "args": [
                4,
                400
              ],
              "description": "4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害"
            },
            "index": 1,
            "description": "全属性+1，对手处于烧伤状态时强化效果翻倍；4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害；下2回合造成的攻击伤害额外提升50%；下2回合令自身所有技能先制+2",
            "metadata": {
              "id": 1924,
              "argsNum": 2,
              "template": "{0}回合内每回合使用技能恢复自身{1}点体力并造成等量固定伤害",
              "revision": "seerapi:beeb77e"
            }
          },
          "petHash": "466dade9",
          "skillHash": "3d8b3f25",
          "effectHash": "seerapi:beeb77e",
          "index": 1,
          "args": [
            4,
            400
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:20267:0",
        "4669:skill:10251:0",
        "4669:skill:20307:0",
        "4669:skill:22358:0",
        "4669:skill:22358:1",
        "4669:skill:28804:1"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：

### Q-N50-4654-012 · 4669新增关联

```json
{
  "id": "Q-N50-4654-012",
  "instances": [
    {
      "id": "Q-N50-4654-012",
      "gap": "已用技能本体自损至0后1766/1924监听是否继续",
      "associatedInstances": [
        {
          "key": "4669:skill:28803:3",
          "sourceDigest": "f35445437c4a3c4da7711cd2b2ee28fb6878d4204dc36863e60d400f8120767a",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:d2e80c40"
          },
          "raw": {
            "instance": {
              "id": 1766,
              "args": [
                3,
                100,
                2,
                2
              ],
              "description": "3回合内每回合使用技能100%令对手烧伤，未触发则令对手所有技能PP值-2"
            },
            "index": 3,
            "description": "4回合内免疫并反弹所有受到的异常状态；对手未持有回命时为对手附加3回合的回命，若对手持有回命且剩余回合数大于1则回合数-1；3回合内对手使用技能消耗的PP值变为2倍；3回合内每回合使用技能100%令对手烧伤，未触发则令对手所有技能PP值-2",
            "metadata": {
              "id": 1766,
              "argsNum": 4,
              "template": "{0}回合内每回合使用技能{1}%令对手{2}，未触发则令对手所有技能PP值-{3}",
              "revision": "seerapi:f67799ab"
            }
          },
          "petHash": "466dade9",
          "skillHash": "d2e80c40",
          "effectHash": "seerapi:f67799ab",
          "index": 3,
          "args": [
            3,
            100,
            2,
            2
          ]
        },
        {
          "key": "4669:skill:28804:1",
          "sourceDigest": "44f38e218a1d507971c22e2053e99095475b59a236ba7c2dad851bf1ba95376c",
          "source": {
            "snapshot": {
              "provider": "seerapi",
              "url": "https://api.seerapi.com/v1/pet/4669",
              "revision": "466dade9",
              "loadedAt": "2026-10-26T08:00:18.349Z"
            },
            "skillRevision": "seerapi:3d8b3f25"
          },
          "raw": {
            "instance": {
              "id": 1924,
              "args": [
                4,
                400
              ],
              "description": "4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害"
            },
            "index": 1,
            "description": "全属性+1，对手处于烧伤状态时强化效果翻倍；4回合内每回合使用技能恢复自身400点体力并造成等量固定伤害；下2回合造成的攻击伤害额外提升50%；下2回合令自身所有技能先制+2",
            "metadata": {
              "id": 1924,
              "argsNum": 2,
              "template": "{0}回合内每回合使用技能恢复自身{1}点体力并造成等量固定伤害",
              "revision": "seerapi:beeb77e"
            }
          },
          "petHash": "466dade9",
          "skillHash": "3d8b3f25",
          "effectHash": "seerapi:beeb77e",
          "index": 1,
          "args": [
            4,
            400
          ]
        }
      ],
      "source": {
        "snapshot": "research/4669-reviewed-snapshot.json",
        "snapshotSHA256": "071d24ea3bb368dfdac439031fb2b21aafb507324c6b4501fba6d1fb2244127f",
        "supplement": "research/4669-source-supplement-audit.json",
        "supplementSHA256": "022048aa89d143930c6056e6dd9b7eabc9b2b37fb435d99b7d5c9bc44193091f"
      },
      "scope": "New exact instances only; future answers to old instances do not automatically authorize these.",
      "originalAssociatedKeys": [
        "4669:skill:20267:0",
        "4669:skill:10251:0",
        "4669:skill:20307:0",
        "4669:skill:28803:3",
        "4669:skill:28804:1"
      ],
      "mappingCorrection": "Explicit exact source guard audit replaces numeric substring-generated false associations. Original frozen question draft unchanged."
    }
  ]
}
```

我的回答：
