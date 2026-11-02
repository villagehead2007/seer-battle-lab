{
function priorityBranch1778(c,eligible){if(eligible){c.clearAilments(c.a);c.a.soulState.jiegePriorityRound1778=c.round;}else delete c.a.soulState.jiegePriorityRound1778;}
function start1778(c){
 delete c.a.soulState.jiegePriorityRound1778;
 if(c.a.hp<c.t.hp)c.stage(c.t,-1);
 c.a.soulState.jiegeSegments1778=Object.values(c.t.stages).reduce((n,x)=>n+Math.abs(x),0);
 c.a.soulState.jiegeRound1778=c.round;
 const raw=Object.values(c.t.stages).every(n=>n===0),formatted=!conditionStatusRules.conditionPresent(c.t,c.round)&&!Object.values(c.t.stages).some(n=>n<0);
 if(raw!==formatted)throw Error('Q-N50-4568-001：1778 SeerAPI原始与格式化无状态先制条件矛盾');
 priorityBranch1778(c,raw);
}
function grant1778(c){
 if(c.a.counts.attackNullify>0||c.a.counts.attackReflect>0||c.a.counts.nextAttackShieldConversion>0)throw Error('Q-N50-4511-006：1778下次免攻重复/混合来源与转化待确认');
 c.a.counts.attackNullify=1;c.a.soulState.jiegeNullify1778=1;
}
function received1778(c){
 if(c.a.hp<=0)return;
 const damage=c.settledDamage;if(!Number.isFinite(damage)||damage<0)throw Error('1778受攻须传递完整结算攻击伤害');
 const amount=c.t.stats.maxHp*(damage<300?.4:.2);
 healthRules.drainPercent(c,amount,'杰格受攻击吸取','杰格受攻击回复');
 if(damage>300&&c.a.hp>0)grant1778(c);
}
registry[1778]={name:'幽魅之影·杰格',sourceHash:'6d1a1ef4',partial:true,unimplemented:['Q-N50-4568-001：API自身无状态先制条件矛盾','Q-N50-4511-006：与已有免攻/反弹/转换混合与重复授予'],deferred:[],
 traits:{attackMultiplier:f=>1+(f.soulState.jiegeSegments1778??0)*.1,skillPriority:f=>Number.isInteger(f.soulState.jiegeRound1778)&&f.soulState.jiegePriorityRound1778===f.soulState.jiegeRound1778?1:0},
 abilities:{qualifiedPriority:priorityBranch1778,qualifiedReceivedAttack(c,settledDamage){return received1778({...c,settledDamage});},grantNullify:grant1778},hooks:{roundStart:start1778,attackDamageTaken:received1778}};

}
