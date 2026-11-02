'use strict';
const fs=require('node:fs');
const p='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/4632-user-confirmations.json';
const c=JSON.parse(fs.readFileSync(p,'utf8'));
c.failedRuns.push({proof:'research/4632-final-confirmed-v1-result.json',tests:186,pass:185,fail:1,reason:'新增完整技能测试将敌方快照ID改为929632但保留pet/4632来源URL，1744真实装备资格校验正确拒绝不一致资料；修复夹具为真实4632身份，保留原状态断言及生产资格校验。',introducedBy:'本次新增测试夹具',impact:'仅该测试夹具；生产代码未修改',repairAttempts:1});
fs.writeFileSync(p,JSON.stringify(c,null,2)+'\n');
