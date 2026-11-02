'use strict';const fs=require('fs'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/';let s=fs.readFileSync('research/4662-finalize-confirmed.cjs','utf8').replaceAll('4662','4663').replaceAll('1866','1867').replace("c.proofs=['research/4663-confirmed-v3-result.json','research/4663-native-v1-result.json']","c.proofs=['research/4663-final-v4-result.json']").replaceAll('雷瀑飞雪·桑多姆','凌虎·关银屏').replaceAll('8773f24b','c1e16cab').replace('限制真实主动切换精灵按来源独立登记延期','真实下场叠层重置、再次登场概率保留按队伍依赖独立登记延期');
// Preserve the registry's source-bound multiplayer declaration while clearing only resolved questions.
s=s.replace("end=txt.indexOf('traits:',start)","end=txt.indexOf('deferred:',start)");
fs.writeFileSync('research/4663-finalize-confirmed.cjs',s);
