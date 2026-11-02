'use strict';
const fs=require('node:fs');
function edit(file,fn){const old=fs.readFileSync(file,'utf8'),next=fn(old);if(next===old)throw Error('no edit '+file);fs.writeFileSync(file,next);}
edit('dist/status-rules.js',s=>s.replace('  function validateDuration(n)',`  // Q-A60-4004-007: only aggregate abnormal-condition checks are masked.
  // Attachment, action blocking, damage, timers, removal and conversion use real ailments.
  function conditionPresent(f,r){return !(f.soulState?.holyVerdict>0)&&Object.values(f.ailments??{}).some(end=>end>=r);}
  function validateDuration(n)`).replace('sourceRevision:388558,active,','sourceRevision:388558,conditionPresent,active,'));
for(const file of ['dist/range-effects.js','dist/range-souls.js'])edit(file,s=>{
 s=s.replace("'use strict';","'use strict';\nconst conditionStatusRules=typeof module==='object'&&module.exports?require('./status-rules.js'):globalThis.BattleStatusRules;");
 // Boolean abnormal-status predicates only; no state lists/removal/behavior are replaced.
 s=s.replace(/Object\.values\((c\.[at])\.ailments\)\.some\((end|v|n)=>\2>=c\.round\)/g,'conditionStatusRules.conditionPresent($1,c.round)');
 if(file.endsWith('range-effects.js'))s=s.split('\n').map(line=>line.startsWith("add(2548,")?`add(2548,'afterHit',(c,p)=>{const foePresent=conditionStatusRules.conditionPresent(c.t,c.round),base=c.t.stats.def+c.t.stats.spd;const own=c.clearAilments(c.a),foe=c.clearAilments(c.t);if(own?.length||foe?.length)c.hurt(c.t,base*p[0]/100,c.m.name+'解除成功真实追加','true');if(!foePresent)healthRules.drainPercent(c,base*p[1]/100,c.m.name+'无异常百分比吸取');},[pct,pct]);`:line).join('\n');
 else {s=s.replace("partial:true,unimplemented:['Q-A60-4004-007：荣光之裁视为无异常的判定/行为/计时/清除范围仍需确认'],",'');
 s=s.replace(/roundStart\(c\)\{if\(\(c\.t\.soulState\.holyVerdict[\s\S]*?\}\},choiceLocked\(c\)/,"choiceLocked(c)");
 s=s.replace(/if\(\(c\.t\.soulState\.holyVerdict\?\?0\)>0&&conditionStatusRules\.conditionPresent\(c\.t,c\.round\)\)\{st\.holyVerdictViewUnresolved=true;[^}]*return;\}/,'');
 s=s.replace('首次已保存真实1层神圣之霆，未知荣光之裁效果不冒称实现','首次神圣之霆、荣光之裁及异常条件视同已按用户确认实现');
 }
 return s;
});
edit('dist/souls.js',s=>s.replace(/Object\.values\(([ft]|c\.[at])\.ailments\)\.some\(end=>end>=r\)/g,'statusRules.conditionPresent($1,r)'));
