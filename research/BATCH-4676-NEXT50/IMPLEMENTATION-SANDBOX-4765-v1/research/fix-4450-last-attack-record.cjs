'use strict';
const fs=require('fs'),assert=require('node:assert/strict');const p='dist/souls.js',old=fs.readFileSync(p,'utf8');let s=old;
for(const [a,b] of [
 ['let useAttackDamage=0,actionLanded=false','let useAttackDamage=0,useAttackHpLoss=0,actionLanded=false'],
 ['useAttackDamage+=totalSettled;const skillPayloadAllowed','useAttackDamage+=totalSettled;useAttackHpLoss+=total;const skillPayloadAllowed'],
 ['else executeHitComponent(m,cachedCrit,forceCriticalHit,accuracyContext);\n      if(actionPayloadAllowed','else executeHitComponent(m,cachedCrit,forceCriticalHit,accuracyContext);\n      if(actionLanded&&m.kind!==\'status\'&&m.kind!==\'item\'){a.lastAttackDamage=useAttackHpLoss;a.lastSettledAttackDamage=useAttackDamage;}\n      if(actionPayloadAllowed']
]){assert.equal(s.split(a).length,2,a);s=s.replace(a,b);}
const at=new Date().toISOString();fs.writeFileSync('research/4450-souls-before-last-attack-fix.js',old);fs.writeFileSync(p,s);fs.writeFileSync('research/4450-last-attack-record-correction.json',JSON.stringify({at,reason:'One actual replay use must expose all copied and own red components to existing last-attack consumers; HP loss stays separate.',before:{recorded:120,settledTotal:360,log:'research/4450-last-attack-before-fix.log'},supersededGate:'research/fixed50-answered-4450-gate-v1-result.json',sourceUnchanged:true},null,2)+'\n');
