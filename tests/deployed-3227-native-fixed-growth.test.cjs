'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3227-native.cjs');
test('3227两魂强袭月光60当前三回合每回合固定150，药剂不暂停，407特攻从下回合增三次且禁强截断',()=>{
 for(const soul of[552,553])for(const mode of['normal','cap','ban','fixed-immune']){let s=H.turn(H.make(24578,{soul,extraMoves:[20013],aStages:mode==='cap'?{spa:5}:{},aEffects:mode==='ban'?{禁强化:{start:3,end:3}}:{},bGear:mode==='fixed-immune'?{resistance:{fixed:100}}:{}}),24578);assert.equal(H.damage(s,'fixed'),mode==='fixed-immune'?0:150);assert.equal(s.fighters[0].stages.spa,mode==='cap'?5:0);for(let r=2;r<=5;r++){s=H.turn(s,r===3?20013:'potion:pp');assert.equal(H.damage(s,'fixed'),mode==='fixed-immune'||r>3?0:150);assert.equal(s.fighters[0].stages.spa,mode==='cap'?6:mode==='ban'?r===2||r===3?1:2:Math.min(r-1,3));}}
});
test('3227两魂原突袭强决29固定200不随自身特攻等级变动，与独立对方双防魂印附伤分别遵守免固',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]])for(const stage of[-6,0,6])for(const resistance of[0,50,100]){const s=H.turn(H.make(19087,{soul,aStages:{spa:stage},bStats:{def:1000,spd:1000},bGear:{resistance:{fixed:resistance}}}),19087);assert.equal(H.damage(s,'fixed'),(200+2000*fraction)*(1-resistance/100));}
});
test('3227两魂巨月撞击683真实随机附固100至200含两端，独立魂印附固不混进随机区间且免固阻伤',()=>{
 for(const[soul,fraction]of[[552,.5],[553,.6]]){const seen=new Set;for(let seed=1;seed<=512&&!(seen.has(100)&&seen.has(200));seed++){const s=H.turn(H.make(18368,{soul,seed,aStages:{acc:6},bStats:{def:1000,spd:1000}}),18368),extra=H.damage(s,'fixed')-2000*fraction;assert.ok(Number.isInteger(extra)&&extra>=100&&extra<=200);seen.add(extra);}assert.ok(seen.has(100)&&seen.has(200),'真实初始种子端点');const immune=H.turn(H.make(18368,{soul,aStages:{acc:6},bStats:{def:1000,spd:1000},bGear:{resistance:{fixed:100}}}),18368);assert.equal(H.damage(immune,'fixed'),0);}
});
