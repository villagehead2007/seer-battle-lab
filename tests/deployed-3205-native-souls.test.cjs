'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{E,source,make,turn}=require('./helpers/3205-native.cjs');
const fixed=s=>(s.damageEvents??[]).filter(e=>e.round===s.round-1&&e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0);
test('3205两魂原35或40睡眠成功不强化，实际抽签未触发则双强且50或60清回合，首次新睡眠不追溯固定',()=>{
 for(const soul of[535,548]){let success=false,failedClear=false,failedKeep=false;for(let seed=1;seed<=64&&!(success&&failedClear&&failedKeep);seed++){const s=turn(make(10499,{soul,seed,bEffects:{'能力保护':{start:1,end:9}}}),10499),a=s.fighters[0],t=s.fighters[1];assert.equal(fixed(s),0);if(t.ailments['睡眠']){success=true;assert.equal(a.stages.spa,0);assert.equal(a.stages.spe,0);assert.ok(t.effects['能力保护']);}else{assert.equal(a.stages.spa,1);assert.equal(a.stages.spe,1);if(t.effects['能力保护'])failedKeep=true;else failedClear=true;}}assert.ok(success&&failedClear&&failedKeep);}
});
test('3205两魂睡眠被真实初始免异常阻挡也算未触发，仍特攻速度一并独立判定清回合',()=>{
 for(const soul of[535,548])for(let seed=1;seed<=12;seed++){const s=turn(make(10499,{soul,seed,bEffects:{'免异常':{start:1,end:9}}}),10499);assert.equal(s.fighters[1].ailments['睡眠'],undefined);assert.equal(s.fighters[0].stages.spa,1,'soul '+soul+' seed '+seed);assert.equal(s.fighters[0].stages.spe,1);}
});
test('3205两魂命中原有睡眠才加自身最大体力三分之一固定，属性技能不触发魂印攻击分支',()=>{
 for(const soul of[535,548]){const asleep=turn(make(10499,{soul,bAilments:{'睡眠':9}}),10499);assert.equal(fixed(asleep),3000);const status=turn(make(22053,{soul}),22053);assert.ok(status.fighters[1].ailments['睡眠']);assert.equal(fixed(status),0);assert.equal(status.fighters[0].stages.spa,0);assert.equal(status.fighters[0].stages.spe,0);}
});
test('3205两魂真实MISS不附睡眠固定或失败强化，零PP与疲惫不触发攻击魂印',()=>{
 for(const soul of[535,548]){let missed;for(let seed=1;seed<=32&&!missed;seed++){const s=turn(make(10499,{soul,seed,aStages:{acc:-6},bAilments:{'睡眠':9}}),10499);if(!(s.damageEvents??[]).some(e=>e.sourceSide===0)){missed=s;}}assert.ok(missed);assert.equal(fixed(missed),0);assert.equal(missed.fighters[0].stages.spa,0);const empty=make(10499,{soul});empty.fighters[0].pp['wiki:10499']=0;const before=structuredClone(empty);assert.throws(()=>turn(empty,10499),/有 PP/);assert.deepEqual(empty,before);const s=turn(make(10499,{soul,aAilments:{'疲惫':9}}),10499);assert.equal(s.fighters[0].stages.spa,0);assert.equal(fixed(s),0);assert.equal(s.fighters[1].hp,9000);}
});
