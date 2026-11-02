(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.RangeSouls=factory;})(typeof globalThis!=='undefined'?globalThis:this,function(registry){
'use strict';
const conditionStatusRules=typeof module==='object'&&module.exports?require('./status-rules.js'):globalThis.BattleStatusRules;
const soulStatusPools=typeof module==='object'&&module.exports?require('./status-pools.js'):globalThis.BattleStatusPools;
const panel=(c,f,k)=>c.panelStat?c.panelStat(f,k):f.stats[k];
const healthRules=typeof module==='object'&&module.exports?require('./health-rules.js'):globalThis.BattleHealthRules;
const positive=f=>Object.values(f.stages).filter(n=>n>0).length;
const energy=f=>f.soulState?.energy??0;
// Flat panel changes preserve other panel sources and never heal the holder.
function setExecutors(f,count){
 if(!Number.isInteger(count)||count<0)throw Error('执行者数量必须为非负整数');
 const n=Math.min(5,count),bonus=n*8,delta=bonus-(f.soulState.executorStatBonus??0);
 for(const key of ['maxHp','atk','def','spa','spd','spe'])f.stats[key]+=delta;
 f.hp=Math.min(f.hp,f.stats.maxHp);
 f.soulState.executors=n;f.soulState.executorStatBonus=bonus;
}
// Q-A60-4069-009/010: the current-opponent branch is resolved after the attack
// action, including used attacks that missed or were invalidated.
for(const [id,hash,attacks] of [[1315,'1af3ca71',1],[1562,'fb665ec1',2]])registry[id]={
 name:'缥缈幽芙'+(id===1562?'·强化':''),sourceHash:hash,
 deferred:['击败后的对方下只登场失神及随机2技能PP归零','死亡后己方不在场存活精灵回复1PP；己方下只精灵前'+attacks+'次攻击先制+1并攻击增伤100%'],traits:{},
 hooks:{actionEnd(c){if(c.m.kind==='status'||c.m.kind==='item'||!c.usedSkillThisRound(c.a)||c.a.hp<=0||c.t.hp<=0)return;
  c.ailment(c.t,'失明',c.a);
  if(id===1562)healthRules.drainPercent(c,c.t.stats.maxHp/3,'幽冥之荷百分比吸取');
  else c.hurt(c.t,c.t.stats.maxHp/3,'幽冥之荷百分比追加','percent');
 }}
};
for(const [id,max,hash] of [[372,5,'c05d5cf3'],[574,6,'b9703945']])registry[id]={name:max===6?'神耀 · 强化':'神耀',sourceHash:hash,deferred:['阵亡后复活队友',...(max===6?['击败后面对下一只精灵的先制奖励']:[])],traits:{energyMax:max,attackReduction:f=>energy(f)*.08,ailmentImmune:f=>energy(f)>=2,weaknessImmune:f=>energy(f)>=2,fixedReflect:f=>energy(f)>=4,attackPriority:f=>energy(f)>=5?1:0},hooks:{afterUse(c){if(max===6&&c.t.hp<=0)c.energy(-energy(c.a));},beforeDamage(c){if(energy(c.a)>=6)c.modifier*=1.6;},roundEnd(c){if(c.used[c.a.side]&&energy(c.a)>=3)c.heal(c.a,c.a.stats.maxHp/3,'神耀回复');}}};
registry[373]={name:'疾',sourceHash:'2b8653d7',traits:{speedGrowthToHp:true},hooks:{roundStart(c){c.a.soulState.highHp=c.a.hp>c.t.hp;c.a.soulState.lowHp=c.a.hp<c.t.hp;}}};
registry[369]={name:'懒',sourceHash:'c44bf3c3',traits:{},hooks:{receivedAttack(c){c.timed(c.a,'soul369',2,{},c.round+1);}}};
registry[370]={name:'葬',sourceHash:'9b9708dd',traits:{},hooks:{afterUse(c){if(c.a.hp<=0)return;if(c.a.side===c.first&&c.t.hp>0)c.hurt(c.t,200,'魂印先手追加','fixed');else if(c.a.side!==c.first)c.heal(c.a,200,'魂印后手回复');}}};
registry[368]={name:'诞',sourceHash:'49a24346',traits:{},hooks:{afterUse(c){if(c.a.hp<=0)return;if(c.m.kind==='status')c.heal(c.a,200,'魂印回复');else if(c.t.hp>0)c.hurt(c.t,(c.a.stats.maxHp-c.a.hp)/2,'魂印追加','fixed');}}};
registry[367]={name:'海',sourceHash:'bc605ecc',traits:{},hooks:{beforeUse(c){c.a.soulState.powerDouble=c.a.hp>c.t.hp;c.a.soulState.drain=c.a.hp<c.t.hp;},beforeDamage(c){if(c.a.soulState.powerDouble)c.power*=2;},afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.drain)healthRules.drainPercent(c,c.t.stats.maxHp/4,'海神吸取','海神吸取');}}};
registry[374]={name:'樱',sourceHash:'eceb56f4',traits:{},hooks:{afterAttack(c){if(c.t.hp>0&&c.random()<.2+.1*positive(c.t))c.ailment(c.t,'冰封',c.a);}}};
registry[375]={name:'夜',sourceHash:'c2c567ed',traits:{},hooks:{roundStart(c){c.a.soulState.fixedTriggered=false;},afterAttack(c){const n=positive(c.a);if(n&&c.t.hp>0){c.a.soulState.fixedTriggered=true;c.hurt(c.t,50*n,'千夜魂印追加','fixed');}},roundEnd(c){if(!c.a.soulState.fixedTriggered&&c.a.hp>0&&c.t.hp>0)healthRules.drainFixed(c,200,'千夜魂印吸取','千夜魂印吸取');}}};
registry[377]={name:'逍',sourceHash:'d2ba1235',traits:{},hooks:{afterAttack(c){if((c.settledDamage??c.dealt)>300&&c.t.hp>0&&c.random()<.5)c.ailment(c.t,'害怕',c.a);else if((c.settledDamage??c.dealt)<300)c.heal(c.a,200,'圣逍魂印回复');}}};
registry[376]={name:'宙',sourceHash:'3ae1b041',traits:{},hooks:{orderResolved(c){c.a.soulState.zeusFirst=c.a.side===c.first;},beforeUse(c){c.a.soulState.zeusHigher=c.a.hp>c.t.hp;},afterHit(c){if(c.a.soulState.zeusHigher&&c.t.hp>0){const id=c.t.moves[Math.floor(c.random()*c.t.moves.length)];c.t.pp[id]=0;c.emit(`${c.name(c.a)} 宙斯魂印：对手一项技能PP归零。`);}},afterUse(c){if(c.a.hp>0&&c.a.side!==c.first){const n=Math.floor(c.a.stats.maxHp/4);c.heal(c.a,n,'宙斯后手回复');if(c.t.hp>0)c.hurt(c.t,n,'宙斯后手追加','fixed');}}}};
registry[378]={name:'西亚',sourceHash:'9952ed16',traits:{},hooks:{orderResolved(c){c.a.soulState.lateReduction=c.a.side!==c.first;},afterUse(c){if(c.a.side!==c.first)c.heal(c.a,200,'真龙塔西亚后手回复');}}};
registry[381]={name:'幽',sourceHash:'acb669c2',traits:{},hooks:{afterAttack(c){if(c.crit)c.timed(c.a,'免异常',2,{});else c.timed(c.a,'暴击概率增加',1,{chance:.5},c.round+1);}}};
registry[379]={name:'沌',sourceHash:'e2792c06',traits:{},hooks:{beforeUse(c){const positive=Object.entries(c.a.stages).filter(([,n])=>n>0);if(positive.length)for(const [k,n]of positive)c.stage(c.t,-n,[k]);else c.hurt(c.t,c.t.stats.maxHp/4,'混沌魂印','percent');}}};
registry[380]={name:'瑞',sourceHash:'3ff56644',traits:{},hooks:{roundEnd(c){c.stage(c.a,1,['def','spd']);},afterAttack(c){if(c.t.hp>0)c.hurt(c.t,(Math.max(0,c.a.stages.def)+Math.max(0,c.a.stages.spd))*50,'海拉瑞德魂印','fixed');}}};
registry[166]={name:'玄武反伤',sourceHash:'2c6013b9',traits:{},hooks:{attackDamageTaken(c){if(c.t.hp>0){const amount=c.a.hp<=0?Math.min((c.settledDamage??c.dealt)*.5,Math.max(0,c.t.hp-1)):(c.settledDamage??c.dealt)*.5;c.hurt(c.t,amount,'玄武魂印反伤','fixed');}}}};
registry[384]={name:'血',sourceHash:'c78935d0',traits:{},hooks:{beforeUse(c){if(c.m.kind!=='status'){if(c.random()<.5)c.ailment(c.t,'烧伤',c.a);if(c.random()<.3)c.ailment(c.t,'麻痹',c.a);}},beforeDamage(c){if(conditionStatusRules.conditionPresent(c.t,c.round))c.power*=2;}}};
registry[383]={name:'时空',sourceHash:'8cebde62',traits:{skillPriority:f=>f.soulState.halfLow?1:0},hooks:{roundStart(c){c.a.soulState.halfLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.halfHigh=c.a.hp>c.a.stats.maxHp/2;},beforeDamage(c){if(c.a.soulState.halfHigh)c.modifier*=1.5;}}};
registry[382]={name:'佑',sourceHash:'5049fbfa',traits:{},hooks:{afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.m.kind!=='status')c.hurt(c.t,((c.a.previousSettledDamageTaken??c.a.previousDamageTaken)??0)*.5,'炽天使魂印','fixed');},roundEnd(c){c.heal(c.a,200,'炽天使回合回复');}}};
registry[385]={name:'塞维',sourceHash:'aa2901b6',traits:{},hooks:{roundEnd(c){c.stage(c.a,1,['atk','spe']);},beforeDamage(c){if(c.a.side===c.first)c.minimumDamage=Math.max(c.minimumDamage??0,280);}}};

registry[387]={name:'塔克',sourceHash:'548f5341',traits:{},hooks:{roundEnd(c){c.stage(c.a,2,['def','spd']);},damageDealt(c){c.heal(c.a,c.dealt*.6,'塔克林魂印吸血');}}};
registry[390]={name:'维',sourceHash:'dd267438',traits:{},hooks:{damageDealt(c){c.heal(c.a,c.dealt*Math.min(.6,.4+(c.round-1)*.1),'伊维特魂印吸血');}}};
registry[391]={name:'鬼',sourceHash:'d72577f2',traits:{},hooks:{damageTaken(c){const next=k=>{const start=c.on(c.a,k)?c.a.effects[k].start:c.round+1;c.timed(c.a,k,c.round+2-start,{},start);};if((c.settledDamage??c.dealt)>200)next('鬼王攻击免疫');if((c.settledDamage??c.dealt)>0&&(c.settledDamage??c.dealt)<300)next('鬼王威力翻倍');}}};

registry[386]={name:'乾',sourceHash:'903c994d',traits:{},hooks:{damageTaken(c){c.heal(c.a,c.dealt*.3,'龙马受伤回复');},afterUse(c){if(c.m.kind!=='status'&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,150,'龙马攻击追加','fixed');}}};

for(const [id,hash,extra] of [[395,'7cd3227',false],[396,'b9452702',true]])registry[id]={name:extra?'王龙 · 强化':'王龙',sourceHash:hash,traits:{maxHpMultiplier:extra?1.2:1,attackReduction:f=>1-(1-Math.max(0,.75-.15*Math.floor((f.stats.maxHp-f.hp)*10/f.stats.maxHp)))*(extra?.8:1),ailmentImmune:f=>!!f.soulState.hamoHigher},hooks:{roundStart(c){c.a.soulState.hamoHigher=c.a.hp>c.t.hp;c.a.soulState.hamoLower=c.a.hp<c.t.hp;},roundEnd(c){if(c.a.soulState.hamoLower)c.heal(c.a,c.a.stats.maxHp/3,'王龙魂印回复');}}};
registry[389]={name:'炽',sourceHash:'6de770f4',traits:{},hooks:{beforeUse(c){if(c.random()<(c.m.kind==='status'?.8:.2))c.ailment(c.t,c.m.kind==='status'?'烧伤':'麻痹',c.a);}}};

registry[388]={name:'幻',sourceHash:'36e2d4b2',traits:{attackReduction:f=>Math.min(.6,.3+.1*(f.soulState.attacksReceived??0))},hooks:{attackDamageTaken(c){c.a.soulState.attacksReceived=(c.a.soulState.attacksReceived??0)+1;}}};

registry[394]={name:'焰',sourceHash:'8f1e18c',traits:{},hooks:{beforeUse(c){if(Object.values(c.t.stages).some(n=>n>0))c.ailment(c.t,'烧伤',c.a);},afterUse(c){if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,150,'克拉德诺魂印追加','fixed');}}};

registry[400]={name:'鬼神',sourceHash:'14d6f005',traits:{ailmentImmune:f=>!!f.soulState.lubuFull,weaknessImmune:f=>!!f.soulState.lubuFull,damageMultiplier:f=>f.soulState.lubuFull?1.5:1},hooks:{roundStart(c){c.a.soulState.lubuFull=c.a.hp===c.a.stats.maxHp;},damageDealt(c){c.heal(c.a,c.dealt*.5,'鬼神魂印吸血');}}};

registry[392]={name:'威',sourceHash:'49f42234',traits:{},hooks:{beforeUse(c){if(c.a.side===c.first&&c.random()<.3)c.ailment(c.t,'害怕',c.a);},afterUse(c){if(c.a.side!==c.first&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,150,'神威后手追加','fixed');}}};
registry[393]={name:'佛',sourceHash:'161bd595',deferred:['被击败后吸取强化传递给下一只己方精灵，再清对手PP及回合效果；整条等待多精灵对战'],traits:{},hooks:{}};

for(const [id,hash,extra]of [[398,'5edce8dd',false],[399,'fbe05c02',true]])registry[id]={name:extra?'乔 · 强化':'乔',sourceHash:hash,deferred:['存活队友增加入场护盾','阵亡队友增加伤害'],traits:{entryAttackShield:100,maxHpMultiplier:extra?1.2:1,allDamageReduction:extra?.2:0},hooks:{}};
registry[402]={name:'武',sourceHash:'8bfb525c',traits:{allDamageReduction:.5,opponentAccuracyMultiplier:.5},hooks:{}};
registry[404]={name:'战龙',sourceHash:'706b6859',traits:{damageMultiplier:f=>1+Math.max(0,.5-.1*Math.floor((f.stats.maxHp-f.hp)*10/f.stats.maxHp)),ailmentImmune:f=>!!f.soulState.warHigh,damageCap:f=>f.soulState.warLow?250:Infinity},hooks:{roundStart(c){c.a.soulState.warHigh=c.a.hp>c.a.stats.maxHp/2;c.a.soulState.warLow=c.a.hp<c.a.stats.maxHp/2;}}};
registry[410]={name:'圣甲战',sourceHash:'30d4ab29',traits:{},hooks:{afterUse(c){c.a.soulState.gaiaRecovery=true;},roundEnd(c){if(c.a.soulState.gaiaRecovery)c.heal(c.a,c.a.stats.maxHp/3,'圣甲盖亚回合回复');},damageTaken(c){if(!c.skillPhase||c.a.hp>0||c.a.level!==100||c.a.soulState.deathRetaliating)return;c.a.soulState.deathRetaliating=true;try{c.hurt(c.t,c.a.roundSettledSkillDamageTaken??0,'圣甲盖亚临终反击','true');if(c.t.hp===0){c.a.hp=1;c.emit(c.name(c.a)+' 圣甲盖亚魂印：恢复1点体力。');}}finally{c.a.soulState.deathRetaliating=false;}}}};
registry[416]={name:'鬼焰',sourceHash:'b4cc9a0',traits:{skillPriority:f=>f.soulState.luxunBurning?1:0},hooks:{roundStart(c){c.a.soulState.luxunBurning=c.t.ailments['烧伤']>=c.round;},beforeDamage(c){if(c.t.ailments['烧伤']>=c.round)c.power*=2;}}};
registry[421]={name:'圣甲瞳',sourceHash:'b20ecbb5',traits:{},hooks:{roundEnd(c){c.stage(c.a,1,['spa','spe']);if(c.a.hp>0&&c.t.hp>0)healthRules.drainFixed(c,150,'圣甲缪斯吸取','圣甲缪斯吸取');}}};
registry[425]={name:'圣甲雷',sourceHash:'ba3a5753',traits:{},hooks:{beforeUse(c){if(c.a.hp>c.a.stats.maxHp/2&&c.random()<.5)c.ailment(c.t,'麻痹',c.a);},afterAttack(c){if(c.a.hp>0&&c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp*(c.a.hp<c.a.stats.maxHp/2?.4:.2),'圣甲雷伊吸取','圣甲雷伊吸取');}}};
registry[424]={name:'秘',sourceHash:'ed87a141',deferred:['切换后第二次登场触发封属与惩罚；等待多精灵对战'],traits:{entryStatusBlockRounds:2},hooks:{opponentBeforeUse(c){if(c.round<=2&&c.m.kind==='status'){c.hurt(c.t,350,'米斯蒂克封属惩罚','fixed');if(c.t.hp>0)c.t.counts.nextDamageDouble=1;}},roundEnd(c){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<2;i++)c.stage(c.t,-1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);}}};
for(const [id,hash] of [[449,'dd0063a7'],[456,'15fe0576']])registry[id]={name:id===456?'武神 · 伙伴版':'武神',sourceHash:hash,deferred:id===456?['战神兄弟伙伴的攻击与体力各+50；等待多精灵队伍条件']:[],traits:{},hooks:{roundStart(c){c.a.soulState.ruierHigh=c.a.hp>c.t.hp;if(c.a.hp<c.t.hp)c.a.soulState.ruierHealNext=true;},beforeUse(c){const f=c.a.soulState;f.ruierHealThis=!!f.ruierHealNext;f.ruierHealNext=false;f.ruierFixedThis=f.ruierFixedNext??0;f.ruierFixedNext=0;},beforeDamage(c){if(c.a.soulState.ruierHigh)c.modifier*=2;},afterAttack(c){c.timed(c.t,'statusBlock',2,{});if(c.a.soulState.ruierHealThis){const before=c.a.hp;c.heal(c.a,c.dealt,'武神魂印吸血');c.a.soulState.ruierFixedNext=Math.max(0,c.a.hp-before);}},afterUse(c){const n=c.a.soulState.ruierFixedThis??0;c.a.soulState.ruierFixedThis=0;if(n>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,n,'武神魂印后续固伤','fixed');}}};
registry[448]={name:'四九',sourceHash:'cb6a6d9b',traits:{damageMultiplier:f=>f.soulState.sijiuHigh?1.49:1,allDamageReduction:f=>f.soulState.sijiuLow?.49:0},hooks:{roundStart(c){c.a.soulState.sijiuHigh=c.a.hp>c.t.hp;c.a.soulState.sijiuLow=c.a.hp<c.t.hp;}}};
for(const [id,hash,priority] of [[480,'2abaceaa',2],[611,'312a1a2f',3]])registry[id]={name:id===611?'冥 · 强化':'冥',sourceHash:hash,traits:{firstRoundSurvive:true,skillPriority:f=>f.soulState.hadesLow?2:0,attackPriority:f=>f.soulState.hadesBonus?priority:0},hooks:{roundStart(c){c.a.soulState.hadesLow=c.a.hp<c.t.hp;c.a.soulState.hadesBonus=c.a.soulState.hadesRewardRound===c.round;},receivedAttack(c){if(c.a.soulState.hadesLow)c.ailment(c.t,'害怕',c.a);},afterAttack(c){if(c.a.soulState.hadesBonus&&c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'哈迪斯保命后追加','fixed');}}};

for(const [id,hash,bonus] of [[492,'21b67b02',.5],[528,'5989e77b',.75]])registry[id]={name:id===528?'雷祖 · 强化':'雷祖',sourceHash:hash,traits:{},hooks:{roundStart(c){c.a.soulState.glauriLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.glauriHigh=c.a.hp>c.a.stats.maxHp/2;},roundEnd(c){if(c.a.soulState.glauriLow&&c.t.hp>0)c.ailment(c.t,'麻痹',c.a,false,false,2);if(c.a.soulState.glauriHigh&&c.a.hp>0)c.timed(c.a,'id913',1,{bonus},c.round+1);}}};

for(const [id,hash,shield] of [[501,'2bcfd945',200],[529,'4ff96476',250]])registry[id]={name:id===529?'王地 · 强化':'王地',sourceHash:hash,traits:{},hooks:{orderResolved(c){if(c.a.side===c.first)c.t.soulState.skillInvalidRound=c.round;},roundEnd(c){if(c.a.hp>0&&c.a.side!==c.first){c.a.suitState.shield+=shield;c.emit(c.name(c.a)+' 王·卡修斯魂印：获得 '+shield+' 点护盾。');c.timed(c.a,'id984',1,{amount:2},c.round+1);}}}};

for(const [id,hash,shield] of [[505,'c7df212',300],[530,'d7aec6f4',400]])registry[id]={name:id===530?'莱茵 · 强化':'莱茵',sourceHash:hash,traits:{shieldBreakDamage:shield},hooks:{roundEnd(c){if(c.a.soulState.boostRemovedRound===c.round&&c.a.hp>0){c.a.suitState.shield+=shield;c.emit(c.name(c.a)+' 莱茵哈特魂印：获得 '+shield+' 点护盾。');}}}};

for(const [id,hash,fear,fixed] of [[516,'62152f62',50,.25],[531,'3b9299af',65,.30]])registry[id]={name:id===531?'王夜 · 强化':'王夜',sourceHash:hash,traits:{dodgeChance:.7,dodgeFearChance:fear,attackFixedFraction:fixed},hooks:{}};

registry[519]={name:'魔王',sourceHash:'bb8d683c',traits:{},deferred:['每击败一只精灵，攻击命中时的秒杀概率提高 2%；等待多精灵队伍击败计数和换宠流程'],hooks:{
  attackDamageTaken(c){if(c.a.hp+(c.hpLoss??c.dealt)===c.a.stats.maxHp&&c.a.soulState.chakAttackRound!==c.round){c.a.soulState.chakAttackRound=c.round;c.stage(c.t,-1);c.timed(c.a,'id984',1,{amount:1},c.round+1);}},
  afterAttack(c){if(c.t.hp>0&&c.random()<.15)c.hurt(c.t,c.t.hp,'魔王魂印秒杀','true',true);}
}};

for(const [id,hash,turns] of [[523,'40d8f8b9',1],[532,'ac2bb518',2]])registry[id]={name:id===532?'冥王 · 强化':'冥王',sourceHash:hash,traits:{},hooks:{roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.a.stats.maxHp/2)c.ailment(c.t,'害怕',c.a);else if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'免异常',turns,{},c.round+1);}}};

for(const [id,hash,sleep,clear] of [[535,'f112a7d3',35,50],[548,'c07f8985',40,60]])registry[id]={name:id===548?'王瞳 · 强化':'王瞳',sourceHash:hash,traits:{},hooks:{
  beforeUse(c){if(c.m.kind!=='status')c.a.soulState.museSleepingAtAttack=c.t.ailments['睡眠']>=c.round;},
  afterAttack(c){if(c.a.soulState.museSleepingAtAttack&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/3,'王瞳魂印追加','fixed');if(c.t.hp<=0)return;if(c.random()<sleep/100)c.ailment(c.t,'睡眠',c.a);else{c.stage(c.a,1,['spa','spe']);if(c.random()<clear/100)c.clear(c.t);}}
}};

for(const [id,hash,reduction] of [[538,'a8acaca7',.5],[549,'ecbf5ffd',.65]])registry[id]={name:id===549?'超能 · 强化':'超能',sourceHash:hash,traits:{},hooks:{
  attackDamageTaken(c){if(c.a.hp+(c.hpLoss??c.dealt)===c.a.stats.maxHp&&c.a.soulState.hathawayAttackRound!==c.round){c.a.soulState.hathawayAttackRound=c.round;c.a.soulState.nextDamageReductionFraction=reduction;}},
  afterAttack(c){if(c.a.hp>0&&c.a.hp<c.a.stats.maxHp/2&&c.t.hp>0){const n=healthRules.drainPercent(c,c.t.stats.maxHp/3,'海瑟薇魂印吸取','海瑟薇魂印吸取');}}
}};

registry[543]={name:'四九',sourceHash:'7c7e8c71',traits:{},hooks:{roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const n=Math.min(270,90+90*(c.a.soulState.fortyNineDrains??0));c.a.soulState.fortyNineDrains=(c.a.soulState.fortyNineDrains??0)+1;const taken=c.hurt(c.t,n,'四九魂印吸取','true');c.heal(c.a,taken,'四九魂印吸取');}}};

for(const [id,hash,bonus] of [[558,'d120b40f',.30],[566,'e78ded43',.35]])registry[id]={name:id===566?'斗战 · 强化':'斗战',sourceHash:hash,traits:{},deferred:['下场时保留本次战斗累计的攻击增伤；等待换宠与再次上场流程'],hooks:{roundEnd(c){c.a.soulState.arslanBonus=Math.min(bonus*5,(c.a.soulState.arslanBonus??0)+bonus);c.emit(c.name(c.a)+' 阿尔斯兰魂印：攻击增伤累计至 '+Math.round(c.a.soulState.arslanBonus*100)+'%。');}}};

for(const [id,hash,fraction] of [[552,'b3f44030',.5],[553,'75ae6462',.6]])registry[id]={name:id===553?'月辉 · 伙伴':'月辉',sourceHash:hash,traits:{},hooks:{afterAttack(c){if(c.t.hp>0)c.hurt(c.t,(c.effective(c.t,'def')+c.effective(c.t,'spd'))*fraction,'月辉魂印追加','fixed');if(c.a.hp>0)c.heal(c.a,(c.effective(c.a,'def')+c.effective(c.a,'spd'))*fraction,'月辉魂印回复');}}};

registry[560]={name:'明王',sourceHash:'c32d6a71',traits:{},hooks:{
  attackDamageTaken(c){if((c.settledDamage??c.dealt)>300)c.a.soulState.mingReductionRound=c.round+1;},
  damageTaken(c){if(c.a.hp>0||c.a.soulState.mingDeathTriggered||c.t.hp<=0)return;c.a.soulState.mingDeathTriggered=true;c.t.hp=Math.min(c.t.hp,1);c.clear(c.t);for(const [k,n] of Object.entries(c.t.stages))if(n>0)c.t.stages[k]=-n;c.emit(c.name(c.a)+' 明王魂印：被击败后将对手体力降至 1，并反转其强化。');}
}};

registry[564]={name:'邪灵王',sourceHash:'2e5b4a29',traits:{},hooks:{afterAttack(c){if((c.settledDamage??c.dealt)<280)c.timed(c.a,'id984',1,{amount:3},c.round+1);if(c.a.hp>0&&c.dealt>0)c.heal(c.a,c.dealt*(c.a.hp<c.a.stats.maxHp/2?.6:.4),'邪灵王魂印吸血');}}};

registry[618]={name:'天苍玄魂',sourceHash:'91aacf10',deferred:['再次登场后令对手当前在场精灵 2 回合属性技能失效；等待多精灵换宠流程'],traits:{},hooks:{
  opponentBeforeUse(c){if(c.round===1&&c.m.kind!=='status')c.t.soulState.skillInvalidRound=c.round;},
  opponentAfterUse(c){if(c.m.kind==='status'||c.a.hp<=0||c.t.hp<=0)return;const lower=c.a.hp<c.t.hp,amount=lower?c.a.stats.maxHp/3:c.a.hp>c.t.hp?c.a.hp/2:0;if(amount>0){const dealt=c.hurt(c.t,amount,'天苍玄魂追加','percent');if(lower)c.heal(c.a,dealt,'天苍玄魂回复');}}
}};
registry[622]={...registry[622],sourceHash:'2f1e3f2',deferred:['星皇位于出战背包时为己方精灵提供星皇之赐，首发精灵获得星皇之佑；等待多精灵队伍流程']};
registry[631]={name:'圣尊啸傲',sourceHash:'e7813aed',traits:{equalAttackStats:true},hooks:{
  beforeDamage(c){c.ignoreDefenseBoost=true;},
  opponentAfterUse(c){if(c.m.kind==='status')return;c.a.soulState.whiteTigerAttackedRound=c.round;if(c.on(c.a,'受物攻概率麻痹')&&c.m.kind==='physical'&&c.random()<c.a.effects['受物攻概率麻痹'].chance/100)c.ailment(c.t,'麻痹',c.a);},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.soulState.whiteTigerAttackedRound===c.round){if(c.random()<.6)c.ailment(c.t,'麻痹',c.a);}else c.a.counts.nextCrit=(c.a.counts.nextCrit??0)+1;}
}};
registry[635]={name:'万世北溟',sourceHash:'b43568fc',traits:{ailmentImmune:f=>f.stages.def<=0&&f.stages.spd<=0},hooks:{
  afterUse(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.side===c.first){const pool=c.t.moves.filter(id=>c.t.pp[id]>0);if(pool.length){const id=pool[Math.floor(c.random()*pool.length)];c.t.pp[id]=0;c.emit(c.name(c.a)+' 玄武魂印：对手随机技能 PP 归零。');}}else{const n=(c.effective(c.a,'def')+c.effective(c.a,'spd'))*.25;c.heal(c.a,c.hurt(c.t,n,'玄武双防吸取','fixed'),'玄武双防吸取');}}
}};
registry[638]={name:'圣光灵神',sourceHash:'1abcf460',traits:{},hooks:{
  afterAttack(c){if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,((c.t.lastSettledAttackDamage??c.t.lastAttackDamage)??0)/2,'圣光灵神魂印追加','fixed');},
  damageTaken(c){if(c.a.hp>0||c.a.soulState.holyReborn)return;c.a.soulState.holyReborn=true;c.a.hp=c.a.stats.maxHp;const boost=c.clearBoost(c.t),rounds=c.clear(c.t);if(boost||rounds)c.a.counts.immune=(c.a.counts.immune??0)+1;c.timed(c.a,'灵神重生威力',2,{},c.round+1);c.emit(c.name(c.a)+' 圣光灵神魂印：重生并恢复全部体力。');}
}};
registry[643]={name:'圣光麒麟',sourceHash:'d6ff6a84',traits:{},hooks:{
  roundStart(c){c.a.soulState.qilinStartHp=c.a.hp;c.a.soulState.qilinOpponentStartHp=c.t.hp;},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.t.hp>c.a.soulState.qilinOpponentStartHp){c.timed(c.a,'id984',1,{amount:3},c.round+1);c.timed(c.a,'doubleDamage',1,{},c.round+1);}if(c.a.soulState.qilinStartHp-c.a.hp>400){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'圣光麒麟魂印回复');c.hurt(c.t,c.a.hp-before,'圣光麒麟魂印追加','fixed');}if(c.a.side===c.first)c.clearAilments(c.a);else c.hurt(c.t,c.a.hp/3,'圣光麒麟后手追加','fixed');}
}};
registry[645]={name:'炽羽炎凰',sourceHash:'31d027da',traits:{},hooks:{
  roundEnd(c){if(c.a.hp>0)c.stage(c.a,2,['spe']);},
  damageTaken(c){if(c.a.hp>0||c.a.soulState.phoenixReborn)return;c.a.soulState.phoenixReborn=true;c.a.hp=c.a.stats.maxHp;c.a.counts.attackNullify=(c.a.counts.attackNullify??0)+2;c.emit(c.name(c.a)+' 朱雀魂印：浴火重生，抵挡下两次攻击。');}
}};
registry[647]={name:'茉蕊儿',sourceHash:'afc83e18',deferred:['自身阵亡后令下一只出场精灵获得500点护盾并免疫1次异常状态；等待多精灵换宠流程'],traits:{damageCap:f=>f.soulState.moruirAttack?f.stats.maxHp/2:Infinity,ailmentImmune:f=>!!f.soulState.moruirStatus},hooks:{
  roundStart(c){c.a.soulState.moruirAttack=['physical','special'].includes(c.m?.kind);c.a.soulState.moruirStatus=c.m?.kind==='status';},
  roundEnd(c){if(c.a.soulState.moruirStatus)c.clearNegative(c.a);}
}};
registry[652]={name:'圣王·萨格罗斯',sourceHash:'3e805f9e',traits:{},hooks:{
  roundStart(c){if(c.a.soulState.sagrosHealRound===c.round){c.clearAilments(c.a);c.clearNegative(c.a);c.timed(c.a,'免异常',2,{});c.timed(c.a,'免弱',2,{});c.timed(c.a,'圣王回血增威',2,{});}},
  beforeDamage(c){if(c.on(c.a,'圣王回血增威')&&c.random()<.5)c.power*=2;},
  afterUse(c){if(c.m.kind==='status')c.restorePP(c.a,1);},
  opponentAfterUse(c){if(c.m.kind==='status'){const pool=c.t.moves.filter(id=>c.t.pp[id]>0);if(pool.length)c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}}
}};
registry[660]={name:'欧德奈瑞',sourceHash:'c4639dc8',traits:{},hooks:{
  beforeUse(c){if(c.a.side===c.first){const chance=Object.values(c.a.stages).some(n=>n>0)?.65:.5;if(c.random()<chance)c.t.soulState.skillInvalidRound=c.round;else{c.a.suitState.shield+=300;c.emit(c.name(c.a)+' 魂印：获得300点护盾。');}}else if(c.random()<.5)c.a.soulState.oudeDamageMultiplier=1.5+c.random();else c.a.soulState.oudeGrowRound=c.round;},
  beforeDamage(c){if(c.a.soulState.oudeDamageMultiplier)c.modifier*=c.a.soulState.oudeDamageMultiplier;},
  roundEnd(c){if(c.a.soulState.oudeGrowRound===c.round&&c.a.hp>0)c.stage(c.a,1);c.a.soulState.oudeDamageMultiplier=0;}
}};
registry[672]={name:'莫妮卡',sourceHash:'605bba60',traits:{},hooks:{
  roundStart(c){if(c.clearBoost(c.t))c.timed(c.t,'statusBlock',2,{});},
  opponentBeforeUse(c){if(c.m.kind==='status')return;for(const id of c.t.moves)c.t.pp[id]=Math.max(0,c.t.pp[id]-1-Math.floor(c.random()*2));},
  roundEnd(c){if(c.a.roundAttackDamage>0)return;const pool=c.t.moves;if(pool.length){const id=pool[Math.floor(c.random()*pool.length)];c.t.pp[id]=0;c.emit(c.name(c.a)+' 莫妮卡魂印：对手随机技能 PP 归零。');}}
}};
registry[689]={name:'列奥尼达',sourceHash:'5367c859',traits:{skillPriority:f=>f.soulState.leoSame?1:0},hooks:{
  choiceLocked(c){const last=c.a.soulState.leoLastKind;c.a.soulState.leoSame=last!=null&&last===c.m.kind;c.a.soulState.leoDifferent=last!=null&&last!==c.m.kind;},
  beforeDamage(c){if(c.a.soulState.leoSame)c.modifier*=1.5;},
  afterUse(c){if(c.a.soulState.leoDifferent&&c.a.hp>0&&c.t.hp>0){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'列奥尼达魂印回复');c.hurt(c.t,c.a.hp-before,'列奥尼达魂印追加','fixed');}if((c.a.soulState.leoSame||c.a.soulState.leoDifferent)&&c.t.hp>0){if(c.random()<.5){const pool=['麻痹','烧伤','害怕','疲惫','睡眠','冰封'];c.ailment(c.t,pool[Math.floor(c.random()*pool.length)],c.a);}else c.a.soulState.leoFixedRound=c.round;}c.a.soulState.leoLastKind=c.m.kind;},
  roundEnd(c){if(c.a.soulState.leoFixedRound===c.round&&c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'列奥尼达魂印补偿','fixed');}
}};
registry[697]={name:'无限自由',sourceHash:'8c328ce7',traits:{},hooks:{
  roundStart(c){if(c.a.hp<c.t.hp&&c.clear(c.t))c.a.counts.immune=(c.a.counts.immune??0)+2;},
  afterUse(c){if(c.a.hp>0&&c.t.hp<=0){c.heal(c.a,c.a.stats.maxHp,'无限自由击败回复');c.restorePP(c.a,99);}}
}};
for(const [id,hash,advanced]of [[701,'ee6d9233',false],[1697,'a063bbe1',true]])registry[id]={name:advanced?'昔兰尼加 · 强化':'昔兰尼加',sourceHash:hash,traits:{},hooks:{
  roundStart(c){c.a.soulState.xilanAilment=conditionStatusRules.conditionPresent(c.t,c.round);},
  beforeDamage(c){if(c.a.soulState.xilanAilment)c.modifier*=2;},
  beforeUse(c){if(!advanced&&!c.a.soulState.xilanAilment&&c.t.hp>0&&c.random()<.35)c.ailment(c.t,'害怕',c.a);},
  afterUse(c){if(!advanced||c.a.soulState.xilanAilment||c.t.hp<=0)return;if(c.random()<.35)c.ailment(c.t,'害怕',c.a);else c.timed(c.a,'攻击先制',1,{amount:1},c.round+1);},
  afterAttack(c){if((c.settledDamage??c.dealt)<300&&c.t.hp>0)c.hurt(c.t,(advanced?c.t.stats.maxHp:c.t.hp)/3,'昔兰尼加魂印追加','percent');}
}};
registry[708]={name:'马尔修斯',sourceHash:'885e7248',traits:{skillPriority:f=>f.soulState.marsForm==='speed'?1:0},hooks:{
  roundStart(c){const s=c.a.soulState;if(!s.marsForm){s.marsForm='speed';s.marsShield=300;c.a.counts.immune=(c.a.counts.immune??0)+1;}if(s.marsNextForm){s.marsForm=s.marsNextForm;delete s.marsNextForm;c.emit(c.name(c.a)+' 马尔修斯切换为'+(s.marsForm==='speed'?'极速':'毁灭')+'形态。');}if(!s.marsShield&&s.marsShieldRestoreRound<=c.round){s.marsShield=300;delete s.marsShieldRestoreRound;}s.marsExecute=s.marsForm==='destruction'&&c.t.hp<c.t.stats.maxHp*.25;},
  beforeUse(c){if(c.a.soulState.marsExecute&&c.t.hp>0)c.hurt(c.t,c.t.hp,'马尔修斯毁灭形态秒杀','true',true);},
  beforeDamage(c){if(c.a.soulState.marsForm==='destruction')c.modifier*=1.7;else if(c.a.side===c.first){const key=c.round+':'+c.m.id;if(c.a.soulState.marsDebuffKey!==key){c.a.soulState.marsDebuffKey=key;c.stage(c.t,-1);}}},
  afterUse(c){if(!['25555','wiki:25555'].includes(String(c.m.id))||!c.successful||c.a.hp<=0)return;const s=c.a.soulState;if(s.marsForm==='speed'){if(c.t.hp>0){const amount=c.t.hp<c.t.stats.maxHp/2?c.t.hp/2:c.t.stats.maxHp/3;c.hurt(c.t,amount,'王·异甲同心追加','percent');}s.marsNextForm='destruction';}else{if(c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'王·异甲同心吸取','王·异甲同心吸取');s.marsNextForm='speed';}c.emit(c.name(c.a)+' 马尔修斯将在下回合切换为'+(s.marsNextForm==='speed'?'极速':'毁灭')+'形态。');},
  roundEnd(c){if(c.a.hp>0&&!c.a.soulState.marsShield)c.heal(c.a,c.a.stats.maxHp/3,'马尔修斯坚壁回复');}
}};
registry[709]={name:'灾厄女神潘多拉',sourceHash:'fddc594e',traits:{weaknessImmune:true,skillPriority:f=>f.soulState.pandoraHigh?1:0},hooks:{
  choiceLocked(c){c.a.soulState.pandoraChosenSkill=c.m.kind!=='item';},
  roundStart(c){if(c.a.soulState.pandoraStartHp==null)c.a.soulState.pandoraStartHp=c.a.hp;if(c.a.soulState.pandoraChosenSkill&&Object.values(c.t.stages).every(n=>n>=0))c.stage(c.t,-1);c.a.soulState.pandoraHigh=c.a.hp>c.t.hp;},
  beforeDamage(c){if(c.a.soulState.pandoraHigh)c.modifier*=1.5;},
  opponentBeforeUse(c){if(c.m.kind==='status'||!c.on(c.a,'对手攻击概率失效'))return;const e=c.a.effects['对手攻击概率失效'];if(c.random()<e.chance/100)c.t.soulState.skillInvalidRound=c.round;else c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+e.statusUses;},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const base=c.a.soulState.pandoraLastEndHp??c.a.soulState.pandoraStartHp;if(c.a.hp<base/2){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'潘多拉魂印回复');c.hurt(c.t,c.a.hp-before,'潘多拉魂印追加','percent');}c.a.soulState.pandoraLastEndHp=c.a.hp;}
}};
registry[718]={name:'圣霆雷伊',sourceHash:'5fdbece1',traits:{attackPriority:f=>f.soulState.holyReyNoBoost?1:0},hooks:{
  roundStart(c){const count=Object.values(c.t.stages).filter(n=>n>0).length;c.a.soulState.holyReyFixed=count*65;c.a.soulState.holyReyNoBoost=count===0;},
  afterAttack(c){if(c.t.hp<=0)return;if(c.a.soulState.holyReyFixed)c.hurt(c.t,c.a.soulState.holyReyFixed,'圣霆雷伊魂印追加','fixed');else if(c.random()<c.t.hp/c.t.stats.maxHp)c.ailment(c.t,'麻痹',c.a);},
  roundEnd(c){if(c.a.soulState.holyReyAwakened||c.a.hp<=0||c.t.hp<=0||c.a.hp>=c.t.hp||c.a.hp>=c.a.stats.maxHp/3)return;c.a.soulState.holyReyAwakened=true;c.heal(c.a,c.a.stats.maxHp,'圣霆雷伊魂印回满');c.clearNegative(c.a);c.clearAilments(c.a);c.clear(c.t);c.t.suitState.shield=0;c.consumeOrdinaryShield?.(c.t);c.t.suitState.barrier=0;c.a.counts.nextSoulSkillBoost=3;c.emit(c.name(c.a)+' 圣霆雷伊魂印：下3次技能先制+3、伤害翻倍。');}
}};
registry[722]={name:'格劳恩斯',sourceHash:'fb9c82d4',traits:{attackPriority:f=>f.soulState.glaHigh?1:0},hooks:{
  roundStart(c){c.a.soulState.glaHigh=c.a.hp>c.t.hp;c.a.soulState.glaTargetAiling=conditionStatusRules.conditionPresent(c.t,c.round);},
  beforeDamage(c){if(c.a.soulState.glaHigh)c.modifier*=1.5;},
  afterAttack(c){if(c.a.soulState.glaBurnNext>0&&c.t.hp>0){c.a.soulState.glaBurnNext--;if(c.random()<.8)c.ailment(c.t,'焚烬',c.a);}},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.t.hp){if(c.ailment(c.t,'麻痹',c.a,false,false,2))c.ailment(c.t,'烧伤',c.a,false,false,3);else{c.a.counts.nextAttackPriority=(c.a.counts.nextAttackPriority??0)+2;c.a.soulState.nextAttackPriorityAmount=2;c.a.soulState.glaBurnNext=2;}}if(c.a.soulState.glaTargetAiling){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'格劳恩斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'格劳恩斯魂印追加','percent');}}
}};
registry[2093]={name:'格劳恩斯 · 强化',sourceHash:'1d8519cd',deferred:['下场时九劫之痕和百炼之炎层数传给下一只队友；等待多精灵换宠流程'],traits:{attackPriority:f=>f.soulState.glaHigh?1:0},hooks:{
  roundStart(c){c.a.soulState.glaHigh=c.a.hp>c.t.hp;},
  afterUse(c){if(c.a.soulState.glaHigh&&c.a.hp>0){c.a.soulState.lightningReleaseEnd=c.round+2;c.a.soulState.nineScars=(c.a.soulState.nineScars??0)+1;}},
  afterAttack(c){if(c.a.soulState.glaBurnNext>0&&c.t.hp>0){c.a.soulState.glaBurnNext--;c.ailment(c.t,'焚烬',c.a);}},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.t.hp){if(c.ailment(c.t,'麻痹',c.a,false,false,3))c.ailment(c.t,'烧伤',c.a,false,false,3);else c.a.soulState.hundredFires=(c.a.soulState.hundredFires??0)+1;}if(conditionStatusRules.conditionPresent(c.a,c.round)||conditionStatusRules.conditionPresent(c.t,c.round))c.heal(c.a,c.a.stats.maxHp/3,'格劳恩斯强化魂印回复');if(c.a.hp>c.t.hp&&!(c.a.soulState.lightningReleaseEnd>=c.round)){c.t.soulState.nextStatusPriorityPenalty=(c.t.soulState.nextStatusPriorityPenalty??0)+2;c.t.soulState.nextStatusNoAilment=(c.t.soulState.nextStatusNoAilment??0)+2;}if(c.a.hp<c.t.hp&&!(c.t.ailments['烧伤']>=c.round)){c.a.counts.nextAttackPriority=(c.a.counts.nextAttackPriority??0)+2;c.a.soulState.nextAttackPriorityAmount=2;c.a.soulState.glaBurnNext=2;}}
}};
registry[728]={name:'混沌魔君索伦森',sourceHash:'1a406215',traits:{},hooks:{
  roundStart(c){const s=c.a.soulState;if(!s.sorenEntered){s.sorenEntered=true;if(c.clearBoost(c.t)){c.timed(c.t,'禁强化',2,{});c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;}}for(const k of ['atk','def','spa','spd','spe','acc'])if(c.t.stages[k]>c.a.stages[k])c.t.stages[k]=c.a.stages[k];s.sorenNoBoost=!Object.values(c.a.stages).some(n=>n>0);s.sorenImmuneAttack=s.sorenNoBoost&&c.random()<.5;s.sorenReduceAttack=s.sorenNoBoost&&!s.sorenImmuneAttack;},
  beforeDamage(c){if(c.t.soulState.sorenReduceAttack)c.modifier*=.5;},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;for(const k of ['atk','def','spa','spd','spe','acc'])if(c.t.stages[k]>c.a.stages[k])c.t.stages[k]=c.a.stages[k];if(Object.values(c.a.stages).some(n=>n>0)){const lost=c.a.stats.maxHp-c.a.hp,n=Math.min(c.a.stats.maxHp/3,lost);c.heal(c.a,n,'索伦森魂印回复');if(c.t.hp>0)c.hurt(c.t,n,'索伦森魂印追加','percent');}}
}};
for(const [id,hash,pink,reduction,healPart]of [[732,'6c364eb3',.25,.5,4],[1031,'3d1d7a6d',.3,.6,3]])registry[id]={name:id===1031?'圣灵之魂迈尔斯 · 强化':'圣灵之魂迈尔斯',sourceHash:hash,traits:{attackReduction:f=>f.soulState.milesHigh?reduction:0},hooks:{
  roundStart(c){c.a.soulState.milesHigh=c.a.hp>c.a.stats.maxHp/2;},
  afterAttack(c){if((c.settledDamage??c.dealt)>0&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp*pink,'迈尔斯魂印追加','percent');},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0||c.a.hp>=c.a.stats.maxHp/2)return;const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/healPart,'迈尔斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'迈尔斯魂印等量追加','percent');}
}};
for(const [id,hash,bonus]of [[740,'c4233dc1',.5],[1030,'f7c4dc3b',1]])registry[id]={name:id===1030?'圣灵守护奥斯卡 · 强化':'圣灵守护奥斯卡',sourceHash:hash,deferred:['三种加护在奥斯卡下场后暂停、再登场后恢复；等待多精灵换宠流程'],traits:{},hooks:{
  opponentBeforeUse(c){if(c.m.kind!=='status')return;const s=c.a.soulState,guaranteed=s.oscarGuaranteed&&(id===1030||s.oscarGuaranteeRound===c.round),chance=c.a.moves.includes('wiki:37198')?1:.5;if(guaranteed||c.random()<chance){c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;s.oscarGuaranteed=false;delete s.oscarGuaranteeRound;}else{s.oscarGuaranteed=true;s.oscarGuaranteeRound=c.round+1;}},
  afterAttack(c){if(c.a.hp<=0)return;const s=c.a.soulState,amount=c.dealt*(s.oscarDoubleHeal?1:.5),before=c.a.hp;c.heal(c.a,amount,'奥斯卡魂印吸血');if(c.a.hp-before<300){c.a.counts.nextAttackBoost=(c.a.counts.nextAttackBoost??0)+1;c.a.soulState.nextAttackBoostFraction=bonus;s.oscarDoubleHeal=true;}else s.oscarDoubleHeal=false;}
}};
registry[744]={name:'星域之魂',sourceHash:'a9e77a10',traits:{},hooks:{
  roundStart(c){const s=c.a.soulState;s.starReduction=conditionStatusRules.conditionPresent(c.a,c.round)?(c.a.hp<c.t.hp?.8:.3):0;},
  afterUse(c){if(!c.successful||c.a.hp<=0)return;const s=c.a.soulState;s.starImmuneKind=c.m.kind==='status'?'special':'physical';s.starImmuneRound=c.round+1;if(c.a.hp<c.a.stats.maxHp*.3&&c.t.hp>0){c.hurt(c.t,c.t.hp,'星域之魂低体力斩杀','true',true);for(const id of c.a.moves)c.a.pp[id]=0;c.a.effects={};c.emit(c.name(c.a)+' 星域魂印：清空全部技能 PP 与回合效果。');}}
}};
registry[750]={name:'天父·奥丁',sourceHash:'814a5974',traits:{skillPriority:f=>f.soulState.odinPriorityRound===f.soulState.currentRound?1:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;if(c.random()<.5){const pool=['烧伤','冻伤','中毒','麻痹','害怕','睡眠'];c.ailment(c.t,pool[Math.floor(c.random()*pool.length)],c.a);}else s.odinFailedRound=c.round;},
  afterAttack(c){if(c.dealt<=0||c.t.hp<=0)return;const count=Object.values(c.t.ailments).filter(end=>end>=c.round).length;if(count)healthRules.drainFixed(c,150*count,'奥丁魂印吸取','奥丁魂印吸取');},
  roundEnd(c){if(c.a.hp<=0)return;const s=c.a.soulState;if(s.odinFailedRound===c.round){c.heal(c.a,c.a.stats.maxHp/3,'奥丁魂印回复');s.odinPriorityRound=c.round+1;}if(c.t.hp>0&&c.a.hp>c.t.hp)for(const k of Object.keys(c.t.ailments))if(c.t.ailments[k]>=c.round)c.t.ailments[k]=c.round+3;}
}};
for(const [id,hash,bonus,chance] of [[752,'53893d99',.5,.5],[1209,'a6340139',.6,.6]])registry[id]={name:id===1209?'艾欧丽娅 · 羁绊强化':'艾欧丽娅',sourceHash:hash,traits:{},hooks:{
  beforeUse(c){c.a.soulState.aioLow=c.a.hp<c.t.hp;},
  beforeDamage(c){c.modifier*=1+bonus+(c.a.soulState.aioLow?.25:0);c.ignoreDefenseBoost=true;},
  afterAttack(c){if((c.settledDamage??c.dealt)>0&&c.t.hp>0&&c.random()<chance)c.hurt(c.t,(c.settledDamage??c.dealt)*.5,'艾欧丽娅魂印追加','percent');},
  afterUse(c){if(c.a.soulState.aioLow&&c.t.hp>0){healthRules.drainFixed(c,200,'艾欧丽娅魂印吸取','艾欧丽娅魂印吸取');}delete c.a.soulState.aioLow;}
}};
registry[758]={name:'万神寂灭·克罗诺斯',sourceHash:'4ae48345',deferred:['下场后使下一只出场精灵首回合免异常，且下次受伤不超过250；等待多精灵换宠流程'],traits:{specialAlwaysHit:true},hooks:{
  roundStart(c){c.a.soulState.kronFearChance=Math.min(1,.4+.1*(c.round-1));},
  afterHit(c){if(c.m.kind==='special'&&c.t.hp>0)c.timed(c.t,'对手属性失效',1,{chance:50},c.round+1);},
  afterAttack(c){if(c.t.hp>0&&c.random()<c.a.soulState.kronFearChance&&c.ailment(c.t,'害怕',c.a))c.a.soulState.kronFearRound=c.round;},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0||c.a.soulState.kronFearRound===c.round)return;const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'克罗诺斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'克罗诺斯魂印等量追加','fixed');}
}};
registry[778]={name:'圣瞳缪斯',sourceHash:'f3a8c023',traits:{skillPriority:f=>f.soulState.musePriorityRound===f.soulState.currentRound?2:0},hooks:{
  roundStart(c){c.a.soulState.currentRound=c.round;},
  beforeDamage(c){c.a.soulState.museTargetAsleep=c.t.ailments['睡眠']>=c.round;},
  afterHit(c){if(c.m.kind!=='status'&&(c.settledDamage??c.dealt)>0&&c.a.soulState.museTargetAsleep&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/3,'圣瞳缪斯睡眠追加','percent');},
  afterAttack(c){if(c.t.hp<=0)return;if(c.random()<.4){if(c.ailment(c.t,'睡眠',c.a))return;}c.a.soulState.musePriorityRound=c.round+1;},
  opponentAfterUse(c){if(c.m.kind==='status'||c.a.hp<=0||c.t.hp<=0)return;if(c.random()<.5){if(c.ailment(c.t,'睡眠',c.a))return;}const n=healthRules.drainPercent(c,c.t.stats.maxHp/3,'圣瞳缪斯魂印吸取','圣瞳缪斯魂印吸取');},
  roundEnd(c){if(c.a.hp<=0)return;const before=c.a.hp;c.heal(c.a,150,'圣瞳缪斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'圣瞳缪斯魂印等量追加','fixed');if(c.a.hp===c.a.stats.maxHp)c.stage(c.a,1,['spa','spe']);}
}};
registry[772]={name:'圣光斯嘉丽',sourceHash:'7d545ebe',traits:{attackReduction:f=>f.soulState.scarLowRound===f.soulState.currentRound?1/3:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;if(c.a.hp>c.t.hp){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<2;i++){const key=pool.splice(Math.floor(c.random()*pool.length),1)[0];c.stage(c.a,1,[key]);c.stage(c.t,-1,[key]);}}else if(c.a.hp<c.t.hp){s.scarLowRound=c.round;s.scarPinkReduction=true;}},
  afterUse(c){if(c.m.kind==='status'||c.a.hp<=0||c.t.hp<=0)return;const s=c.a.soulState,uses=(s.scarAttackUses??0)+1;s.scarAttackUses=uses;if(c.random()<Math.min(1,.7+.1*(uses-1))){c.ailment(c.t,'失明',c.a);return;}if(c.clear(c.t))c.emit(c.name(c.a)+' 圣光斯嘉丽魂印：消除对手回合效果。');c.timed(c.a,'id913',1,{bonus:1},c.round+1);}
}};
registry[789]={name:'X博士奥古斯特',sourceHash:'ccc56101',traits:{},hooks:{
  roundStart(c){const s=c.a.soulState;s.xConvertRound=conditionStatusRules.conditionPresent(c.a,c.round)?c.round:0;if(s.xRetaliateRound===c.round){if(c.random()<.5)c.ailment(c.t,'害怕',c.a);else c.stage(c.a,2,['spa']);}},
  beforeUse(c){if(c.m.kind!=='status')c.a.soulState.xDoubleSkill=c.random()<.6;},
  beforeDamage(c){if(c.a.soulState.xDoubleSkill)c.power*=2;},
  afterAttack(c){if(!c.a.soulState.xDoubleSkill&&(c.settledDamage??c.dealt)>0&&c.t.hp>0)c.hurt(c.t,(c.settledDamage??c.dealt)*.6,'奥古斯特魂印未触发追加','fixed');},
  roundEnd(c){if(c.a.hp>0&&c.t.hp>0)c.a.soulState.xRetaliateRound=c.round+1;}
}};
registry[795]={name:'圣战盖亚',sourceHash:'2d87d7ef',traits:{allDamageReduction:f=>f.soulState.gaiaAilingRound===f.soulState.currentRound?.5:0,skillPriority:f=>f.soulState.gaiaPriorityRound===f.soulState.currentRound?2:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.gaiaAilingRound=conditionStatusRules.conditionPresent(c.a,c.round)?c.round:0;s.gaiaHealRound=s.gaiaAilingRound?0:c.round;s.gaiaPowerDouble=(s.gaiaLastDamage??0)<200;},
  beforeDamage(c){if(c.a.soulState.gaiaPowerDouble)c.modifier*=2;c.ignoreDefenseBoost=true;c.a.soulState.gaiaNoDefBoost=c.t.stages.def<=0&&c.t.stages.spd<=0;},
  afterAttack(c){if(c.t.hp>0&&c.a.soulState.gaiaLastDamage)c.hurt(c.t,c.a.soulState.gaiaLastDamage*.5,'圣战盖亚上回合伤害追加','fixed');if(c.a.soulState.gaiaNoDefBoost)c.a.soulState.gaiaPriorityRound=c.round+1;},
  roundEnd(c){const s=c.a.soulState;if(c.a.hp>0&&s.gaiaHealRound===c.round)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.4,'圣战盖亚魂印回复');s.gaiaLastDamage=c.a.roundSettledDamageDealt??c.a.roundDamageDealt??0;}
}};
registry[792]={name:'圣战瑞尔斯',sourceHash:'c7ad1f39',traits:{damageMultiplier:f=>f.soulState.rielsHighRound===f.soulState.currentRound?2:1},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.rielsHighRound=c.a.hp>c.t.hp?c.round:0;s.rielsLowRound=c.a.hp<c.t.hp?c.round:0;},
  afterUse(c){if(c.m.kind==='status')c.a.soulState.rielsStatusRound=c.round;else c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;},
  opponentAfterUse(c){if(c.m.kind!=='status'&&c.on(c.a,'对手攻击后全属性提升'))c.stage(c.a,c.a.effects['对手攻击后全属性提升'].amount);},
  attackDamageTaken(c){if((c.settledDamage??c.dealt)<=0||c.a.hp<=0||c.t.hp<=0)return;const n=c.hurt(c.t,(c.settledDamage??c.dealt)/4,'圣战瑞尔斯魂印反馈','percent');if(n>100)c.stage(c.a,1);},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const s=c.a.soulState;if(s.rielsStatusRound===c.round){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3*(c.a.hp<c.a.stats.maxHp/2?2:1),'圣战瑞尔斯属性技能回复');c.hurt(c.t,c.a.hp-before,'圣战瑞尔斯属性技能等量追加','percent');}if(s.rielsLowRound===c.round){const before=c.a.hp;c.heal(c.a,c.a.roundDamageDealt,'圣战瑞尔斯低体回复');c.hurt(c.t,c.a.hp-before,'圣战瑞尔斯低体等量追加','percent');}}
}};

for(const [id,hash,threshold,healAmount,drain] of [[804,'9b498ef7',.5,250,false],[1736,'7cc3ff93',1/3,300,true]])registry[id]={name:id===804?'梦天睡神·修普诺斯':'梦天睡神·修普诺斯·强化',sourceHash:hash,traits:{attackReduction:f=>f.soulState.hypnosReductionRound===f.soulState.currentRound&&!f.soulState.hypnosReflected?.75:0,damageMultiplier:f=>f.soulState.hypnosReductionRound===f.soulState.currentRound&&f.soulState.hypnosReflected?1.75:1},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.hypnosLowRound=c.a.hp<c.a.stats.maxHp/3?c.round:0;s.hypnosReductionRound=c.a.hp>c.a.stats.maxHp*threshold?c.round:0;},
  roundEnd(c){if(c.a.hp<=0||c.a.soulState.hypnosLowRound!==c.round)return;if(drain){healthRules.drainFixed(c,healAmount,'修普诺斯魂印吸取','修普诺斯魂印吸取');}else c.heal(c.a,healAmount,'修普诺斯魂印回复');}
}};
registry[846]={name:'混沌布莱克',sourceHash:'a123f1ec',traits:{damageMultiplier:f=>f.soulState.chaosDodgeBuffRound===f.soulState.currentRound?1.5:1},hooks:{
  roundStart(c){c.a.soulState.currentRound=c.round;},
  opponentBeforeUse(c){if(c.m.kind==='status')c.a.counts.immune=(c.a.counts.immune??0)+1;},
  roundEnd(c){const s=c.a.soulState;if(s.chaosDeathSaveRound===c.round&&c.t.hp>0)c.ailment(c.t,'害怕',c.a);if(s.chaosDodgeFailedRound===c.round&&c.t.hp>0)c.hurt(c.t,c.effective(c.a,'atk')*.5,'混沌布莱克闪避未触发追加','percent');}
}};
for(const [id,hash,priority] of [[819,'8107d84e',2],[1685,'802a26cc',3]])registry[id]={name:id===819?'惊涛海皇·波塞冬':'惊涛海皇·波塞冬·强化',sourceHash:hash,traits:{damageMultiplier:f=>f.soulState.poseidonHighRound===f.soulState.currentRound?2:1,attackReduction:f=>f.soulState.poseidonLowRound===f.soulState.currentRound?.5:0,skillPriority:f=>f.soulState.poseidonPriorityRound===f.soulState.currentRound?priority:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.poseidonHighRound=c.a.hp>c.t.hp?c.round:0;s.poseidonLowRound=c.a.hp<c.t.hp?c.round:0;},
  beforeDamage(c){if(id===1685&&c.a.soulState.poseidonHighRound===c.round)c.ignoreDefenseBoost=true;},
  attackDamageTaken(c){if((c.settledDamage??c.dealt)>300&&c.t.hp>0)c.ailment(c.t,'冰封',c.a);},
  afterAttack(c){if((c.settledDamage??c.dealt)>300)c.a.soulState.poseidonPriorityRound=c.round+1;},
  afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.poseidonLowRound===c.round){const n=healthRules.drainPercent(c,c.t.stats.maxHp/3,'波塞冬魂印吸取','波塞冬魂印吸取');}}
}};
registry[836]={name:'幻世·海瑟薇',sourceHash:'ed285c8d',traits:{attackReduction:f=>f.soulState.hathawayHighRound===f.soulState.currentRound?f.soulState.hathawayFullRound===f.soulState.currentRound?.5:.35:0,skillPriority:f=>f.soulState.hathawayHighRound===f.soulState.currentRound&&f.soulState.hathawayStatusChoice?1:0},hooks:{
  choiceLocked(c){c.a.soulState.hathawayStatusChoice=c.m?.kind==='status';},
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.hathawayLowRound=c.a.hp<c.a.stats.maxHp/2?c.round:0;s.hathawayHighRound=c.a.hp>c.a.stats.maxHp/2?c.round:0;s.hathawayFullRound=c.a.hp===c.a.stats.maxHp?c.round:0;},
  afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.hathawayLowRound===c.round){const n=healthRules.drainPercent(c,c.t.stats.maxHp/3,'海瑟薇魂印吸取','海瑟薇魂印吸取');}},
  roundEnd(c){if(c.a.hp>0&&c.t.hp>350&&c.a.hp<c.t.hp)c.hurt(c.t,c.t.hp-350,'海瑟薇魂印体力降至350','true');}
}};
registry[821]={name:'帝皇之御',sourceHash:'11674b59',deferred:['被击败后为己方下只出场精灵提供2回合攻击及固定伤害减免'],traits:{ailmentImmune:f=>f.soulState.currentRound<=2,skillPriority:f=>f.soulState.currentRound<=2?2:0},hooks:{
  roundStart(c){c.a.soulState.currentRound=c.round;},
  attackDamageTaken(c){const n=c.a.soulState.emperorDeathReflect;if(n&&c.t.hp>0){delete c.a.soulState.emperorDeathReflect;c.hurt(c.t,n,'帝皇之御致死伤害反弹','fixed');}}
}};
for(const [id,hash] of [[822,'b207be0c'],[1646,'7e90dae7']])registry[id]={name:id===822?'弑神猎皇':'弑神猎皇·强化',sourceHash:hash,traits:{ailmentImmune:f=>f.soulState.hunterHighRound===f.soulState.currentRound,skillPriority:f=>f.soulState.hunterHighRound===f.soulState.currentRound?1:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.hunterHighRound=c.a.hp>c.t.hp?c.round:0;s.hunterLowRound=c.a.hp<c.t.hp?c.round:0;},
  beforeDamage(c){if(c.m.kind==='status')return;if(id===822)c.a.soulState.currentDefenseIgnore=Math.min(.45,.25+.1*Math.max(0,(c.a.soulState.hunterAttackChain??1)-1));},
  afterAttack(c){if(id===1646)c.a.soulState.hunterArrows=(c.a.soulState.hunterArrows??0)+1;else c.a.soulState.hunterAttackChain=(c.a.soulState.hunterAttackChain??0)+1;},
  roundEnd(c){if(c.a.soulState.hunterLowRound===c.round&&c.t.hp>0){const n=healthRules.drainPercent(c,c.t.stats.maxHp/3,'弑神猎皇魂印吸取','弑神猎皇魂印吸取');}}
}};

for(const [id,hash,count,reduction,healing] of [[567,'3ec901d1',2,.5,.30],[568,'8663574c',4,.6,.35]])registry[id]={name:id===568?'武 · 强化':'武',sourceHash:hash,traits:{},hooks:{
  roundStart(c){if(!conditionStatusRules.conditionPresent(c.a,c.round))return;const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<count;i++)c.stage(c.t,-1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);c.t.soulState.kingGaiaDamageReductionRound=c.round;c.t.soulState.kingGaiaDamageReduction=reduction;},
  beforeDamage(c){if(c.a.hp<c.a.stats.maxHp&&c.random()<(c.a.stats.maxHp-c.a.hp)/c.a.stats.maxHp)c.power*=2;},
  roundEnd(c){if(c.a.hp>0)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*healing,'王·盖亚魂印回复');}
}};
registry[527]={...registry[527],sourceHash:'831a557'};
registry[484]={name:'雷',sourceHash:'43eb4d2d',traits:{},hooks:{roundStart:registry[527].hooks.roundStart,roundEnd(c){c.steal(c.a,c.t,'回合结束');if(c.a.soulHigh)c.boost(c.a,2,['atk']);}}};
registry[976]={name:'擎空',sourceHash:'d0ef8b39',deferred:['背包每死亡一只精灵先制+1，最高+5'],traits:{speedGrowthToHp:true,ailmentImmune:f=>f.soulState?.skyHigh===true,attackReduction:f=>f.soulState?.skyLow?.5:0,fixedReduction:f=>f.soulState?.skyLow?.5:0},hooks:{roundStart(c){const high=c.a.hp>c.t.hp,low=c.a.hp<c.t.hp;c.a.soulState.skyHigh=high;c.a.soulState.skyLow=low;if(low||high&&c.random()<.5)c.stage(c.t,-1);}}};
registry[978]={name:'冰之契约',sourceHash:'f2f0e8c3',traits:{attackReduction:f=>f.soulState?.iceReduction??.2,fixedReduction:f=>f.soulState?.iceReduction??.2},hooks:{roundStart(c){c.a.soulState.iceReduction=Math.min(.5,.2+.1*(c.round-1));},beforeDamage(c){if(c.m.kind==='special')c.ignoreDefenseBoost=true;const success=c.a.soulState.iceDoubleRound===c.round||c.random()<.5;if(success)c.modifier*=2;else c.a.soulState.iceDoubleRound=c.round+1;}}};
registry[984]={name:'守护者',sourceHash:'406c6ed4',traits:{},hooks:{
 beforeUse(c){const n=Math.floor(c.random()*5);c.a.soulState.guardianCritical=n===4&&c.m.kind!=='status';if(n===0)c.stage(c.t,-1);else if(n===1)c.stage(c.a,1);else if(n===2){if(c.random()<.6)c.ailment(c.t,'害怕',c.a);}else if(n===3)c.a.suitState.shield+=300;},
 beforeCrit(c){if(c.a.soulState.guardianCritical)c.forceCrit=true;},
 afterUse(c){c.a.soulState.guardianCritical=false;if(c.a.side===c.first&&c.t.hp>0)c.hurt(c.t,c.a.stats.spe*.5,'守护者魂印','percent');else if(c.a.side!==c.first)c.timed(c.a,'id984',1,{amount:2},c.round+1);}
}};
registry[1781]={name:'守护者·强化',sourceHash:'b323d8d',deferred:['己方每阵亡1只精灵，千灭雷翼的前1条无视触发条件'],traits:{},hooks:{
 roundStart(c){const s=c.a.soulState;s.thunderWings={round:c.round,shield:c.a.hp<c.t.hp,boost:positive(c.a)>0,drop:conditionStatusRules.conditionPresent(c.t,c.round),fear:Object.values(c.t.stages).some(n=>n<0)};if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'必定暴击',1,{});},
 beforeUse(c){const w=c.a.soulState.thunderWings;if(w?.round!==c.round)return;if(w.shield)c.a.suitState.shield+=300;if(w.boost)c.stage(c.a,1);if(w.drop&&c.t.hp>0)c.stage(c.t,-1);},
 afterUse(c){if(c.a.side===c.first&&c.t.hp>0){const n=c.hurt(c.t,c.a.stats.spe*.5,'守护者强化魂印','percent');c.heal(c.a,n,'守护者强化魂印');}else if(c.a.side!==c.first)c.timed(c.a,'id984',1,{amount:2},c.round+1);if(c.t.hp>0&&c.a.soulState.thunderWings?.round===c.round&&c.a.soulState.thunderWings.fear)c.ailment(c.t,'害怕',c.a);}
}};
registry[862]={name:'邪灵主宰',sourceHash:'d9571d43',traits:{},hooks:{afterAttack(c){if(c.t.hp<=0)return;if((c.settledDamage??c.dealt)>300)c.ailment(c.t,'害怕',c.a);else c.timed(c.a,'魂印先制',1,{amount:3},c.round+1);},roundEnd(c){if(c.t.hp>0)c.hurt(c.t,c.a.hp<c.t.hp?300:150,'邪灵主宰魂印','fixed');}}};
// 四象门共享每回合一次魂印触发，原始来源不改；用户确认单独保存。
function salmonTrigger(c){if(c.a.soulState.salmonGate){if(c.a.soulState.salmonSoulRound===c.round)return false;c.a.soulState.salmonSoulRound=c.round;}return true;}
registry[852]={name:'灵天圣君',sourceHash:'cc915423',traits:{},hooks:{afterUse(c){if(!salmonTrigger(c))return;const boosts=Object.values(c.a.stages).filter(x=>x>0).length+Object.values(c.t.stages).filter(x=>x>0).length;if(c.m.kind==='status')c.heal(c.a,70*boosts,'灵天圣君魂印');else if(c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,70*boosts,'灵天圣君魂印','fixed');},combatEnd(c){if(!salmonTrigger(c)||c.canRemoveNegative?.(c.a)===false)return;for(const [k,n]of Object.entries(c.a.stages))if(n<0)c.stage(c.a,-3*n,[k]);}}};

for(const [id,hash,chance,multiplier] of [[864,'8b107b1',.6,2],[912,'741d06d2',.7,2.5]])registry[id]={name:'霸'+(id===912?' · 强化':''),sourceHash:hash,traits:{skillPriority:f=>f.soulState.xiangPriority?1:0},hooks:{roundStart(c){const boosted=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.xiangPriority=!boosted;if(boosted){c.clearBoost(c.t);if(c.random()<chance)c.ailment(c.t,'焚烬',c.a);}},beforeUse(c){c.a.soulState.xiangDouble=c.m.kind!=='status'&&c.random()<.4;},beforeDamage(c){if(c.a.soulState.xiangDouble)c.modifier*=multiplier;},afterAttack(c){if(!c.a.soulState.xiangDouble)c.timed(c.t,'statusBlock',2,{});}}};

registry[870]={name:'圣地卡修斯',sourceHash:'9b9717ab',traits:{ailmentImmune:f=>f.soulState?.cassisImmuneRound===f.soulState?.currentRound,attackPriority:f=>f.soulState.cassisShieldAtStart?1:0},hooks:{battleStart(c){c.addShield(c.a,Math.floor(c.a.stats.maxHp/2),'魂印870入场');c.a.soulState.cassisEntered=true;c.a.soulState.currentRound=1;c.a.soulState.cassisImmuneRound=1;},allShieldsGone(c){if(c.a.hp<=0||c.t.hp<=0)return;c.clear(c.t);c.clearBoost(c.t);const pool=c.t.moves.filter(id=>c.t.pp[id]>0);for(let i=0;i<2&&pool.length;i++)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;c.emit(c.name(c.a)+' 圣地卡修斯魂印：全部护盾消失，清回合清强并随机清空正PP技能两项。');},roundStart(c){c.a.soulState.currentRound=c.round;c.a.soulState.cassisShieldAtStart=c.shieldValue(c.a)>0;}}};

// 877 · 大轮明王.  The current fighter handles the attack-before-hit and
// end-of-round transfer branches.  The next-ally entry buff remains deferred
// until team replacement events exist.
registry[877]={name:'大轮明王',sourceHash:'7962bd41',deferred:['自身死亡后己方下只精灵出战时全属性+1并免疫下1次异常'],traits:{},hooks:{
  beforeOpponentAttack(c){if(c.m?.kind!=='status'&&c.t.hp>0)c.stage(c.t,-1);},
  roundEnd(c){
    const activeAilments=Object.entries(c.a.ailments??{}).filter(([,end])=>end>=c.round);
    const weakened=Object.entries(c.a.stages??{}).filter(([,level])=>level<0);
    if(!activeAilments.length&&!weakened.length)return;
    c.clear(c.t);
    for(const [stat,level] of weakened)c.stage(c.t,level,[stat]);
    for(const [ailment,end] of activeAilments)c.ailment(c.t,ailment,c.a,false,false,Math.max(1,end-c.round+1));
  }
}};

// 882 · 普拉曼达, SeerAPI soulmark hash 38d520d. Only current combatants.
registry[882]={name:'普拉曼达',sourceHash:'38d520d',traits:{},hooks:{
  roundStart(c){if(c.a.hp>c.a.stats.maxHp/2)c.stage(c.a,1,['atk','spe']);},
  attackDamageTaken(c){if((c.settledDamage??c.dealt)>0&&c.a.hp>0){c.a.counts.nextAttackBoost=Math.max(1,c.a.counts.nextAttackBoost??0);c.a.soulState.nextAttackBoostFraction=1;}},
  roundEnd(c){if(c.a.hp<=0||c.a.hp>=c.a.stats.maxHp/2)return;c.timed(c.a,'id984',1,{amount:2},c.round+1);if(c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'普拉曼达魂印低体吸取','普拉曼达魂印低体吸取');}
}};

// 875 · 终末之灭·天邪龙王.  The conversion roll is made once at the
// beginning of each round.  Attack damage is tracked separately from other
// damage so fixed/percent follow-up effects are not converted or reflected.
registry[875]={name:'终末之灭·天邪龙王',sourceHash:'ea9790b0',traits:{
  attackPriority:f=>f.soulState?.endDragonHighRound===f.soulState?.currentRound?1:0,
  damageMultiplier:f=>f.soulState?.endDragonHighRound===f.soulState?.currentRound?1.5:1
},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.endDragonHighRound=c.a.hp>c.t.hp?c.round:0;s.endDragonConvert=c.random()<.4;s.endDragonAttackTaken=0;c.emit(c.name(c.a)+' 终末之灭魂印：'+(s.endDragonHighRound===c.round?'体力较高，本回合攻击先制 +1、伤害提升 50%。':'体力比较未触发高体分支。')+(s.endDragonConvert?'触发 40% 受击转化。':'未触发 40% 受击转化。'));},
  attackDamageTaken(c){const s=c.a.soulState,amount=c.settledDamage??c.dealt;if(amount<=0)return;s.endDragonAttackTaken=(s.endDragonAttackTaken??0)+amount;if(s.endDragonConvert&&c.a.hp>0){c.heal(c.a,amount,'终末之灭魂印受击转化');}else if(s.endDragonConvert&&c.a.hp<=0){c.a.hp=Math.min(c.a.stats.maxHp,amount);c.emit(c.name(c.a)+' 终末之灭魂魂印将致死攻击伤害转化为体力。','heal');}},
  roundEnd(c){const s=c.a.soulState;if(!s.endDragonConvert&&s.endDragonAttackTaken>0&&c.t.hp>0)c.hurt(c.t,s.endDragonAttackTaken,'终末之灭魂印反击','fixed');}
}};


// SeerAPI 956/d412985b and 1710/1f9f6d09; end-of-round trigger:
// BWIKI soul revisions 319493/320247. API wins the enhanced HP-base conflict.
const pegasusActive=(f,key)=>{const e=f.effects[key],r=f.soulState.currentRound;return !!e&&e.start<=r&&e.end>=r;};
for(const [id,hash,awakened]of [[956,'d412985b',false],[1710,'1f9f6d09',true]])registry[id]={name:awakened?'圣耀之光·黄金天马·觉醒':'圣耀之光·黄金天马',sourceHash:hash,deferred:['圣辉之羽'+(awakened?'和圣雷华冠':'')+'下场不保留'],traits:{
 ailmentImmune:f=>pegasusActive(f,'圣辉之羽'),weaknessImmune:f=>pegasusActive(f,'圣辉之羽'),attackDamageToHealing:f=>pegasusActive(f,'圣辉之羽'),attackPriority:f=>pegasusActive(f,'圣雷华冠')?1:0
},hooks:{
 choiceLocked(c){c.a.soulState.currentRound=c.round;c.a.soulState.pegasusOpponentStart={...c.t.stages};},
 roundStart(c){const grant=awakened?!Object.values(c.a.stages).some(n=>n>0):c.random()<.5;c.a.soulState.pegasusPercentRound=awakened&&grant?c.round:0;if(grant)c.stage(c.a,1);else{c.stage(c.t,-1);c.timed(c.a,'必定暴击',1,{});}},
 beforeDamage(c){if(c.on(c.a,'圣雷华冠')&&conditionStatusRules.conditionPresent(c.t,c.round))c.modifier*=1.5;},
 afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.pegasusPercentRound===c.round)c.hurt(c.t,c.a.stats.maxHp/3,'圣耀魂印追加','percent');},
 roundEnd(c){if(c.a.hp<=0)return;const start=c.a.soulState.pegasusOpponentStart;if(!start)return;const higher=Object.keys(start).some(k=>c.t.stages[k]>start[k]);if(higher)c.timed(c.a,'圣辉之羽',1,{},c.round+1);else if(awakened)c.timed(c.a,'圣雷华冠',1,{},c.round+1);}
}};

registry[957]={name:'X·神迹',sourceHash:'4d676d24',deferred:['再次登场触发封锁；攻击增伤与减伤层数下场后保留'],traits:{attackMultiplier:f=>1+.4*(f.soulState.miracleAttacks??0),attackReduction:f=>.2*(f.soulState.miracleStatuses??0)},hooks:{
 beforeUse(c){const key=c.m.kind==='status'?'miracleStatuses':'miracleAttacks';c.a.soulState[key]=Math.min(3,(c.a.soulState[key]??0)+1);},
 opponentAfterUse(c){if(c.round===1&&c.a.hp>0&&c.t.hp>0)c.timed(c.t,c.m.kind==='status'?'attackBlock':'statusBlock',1,{},c.round+1);}
}};

registry[959]={name:'艾夏拉',sourceHash:'128269af',traits:{skillPriority:f=>f.soulState.aisharaPriority?1:0,attackMultiplier:f=>f.soulState.aisharaFirst?1.5:1,attackReduction:f=>f.soulState.aisharaFirst===false?.5:0},hooks:{
 roundStart(c){const boosted=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.aisharaPriority=!boosted;if(boosted&&c.clearBoost(c.t))c.ailment(c.t,'睡眠',c.a);},
 orderResolved(c){c.a.soulState.aisharaFirst=c.a.side===c.first;},
 battlePhaseEnd(c){if(c.a.hp>0||c.t.hp<=0)return;const cleared=c.clear(c.t),boosts=c.clearBoost(c.t);if(cleared||boosts)c.ailment(c.t,'睡眠',c.a);}
}};

registry[965]={name:'鬼蚀豹尊',sourceHash:'9ba3285',traits:{attackPriority:f=>f.soulState.leopardPriority?1:0},hooks:{
 beforeUse(c){if(c.m.kind==='status')return;const s=c.a.soulState;s.leopardDamage=0;s.leopardPriority=false;const chance=s.leopardChance??30;s.leopardMultiplier=c.random()<chance/100?2+Math.floor(c.random()*3):1;if(s.leopardMultiplier>1)s.leopardChance=30;else{s.leopardChance=Math.min(100,chance+20);s.leopardPriority=true;}},
 beforeDamage(c){c.modifier*=c.a.soulState.leopardMultiplier??1;},
 afterAttack(c){c.a.soulState.leopardDamage=c.settledDamage??c.dealt;},
 afterUse(c){if(c.m.kind==='status'||c.a.hp<=0)return;const damage=c.a.soulState.leopardDamage??0;if(damage>300){if(c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/3,'豹尊高伤追加','percent');c.heal(c.a,c.a.stats.maxHp/3,'豹尊高伤回复');}else if(damage<300&&c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'豹尊低伤吸取','豹尊低伤吸取');}
}};
registry[968]={name:'混沌魔尊',sourceHash:'df54e4b1',deferred:['之后每次登场随机令对手进入异常状态'],traits:{attackPriority:f=>f.soulState.chaosPriorityRound===f.soulState.currentRound?1:0},hooks:{
roundStart(c){c.a.soulState.currentRound=c.round;if(!c.a.soulState.chaosEntered){c.a.soulState.chaosEntered=true;c.randomFromSharedPool(1,true);}},
beforeUse(c){if(c.m.kind!=='status')c.a.soulState.chaosDamage=0;},
afterAttack(c){c.a.soulState.chaosDamage=c.settledDamage??c.dealt;},
afterUse(c){if(c.a.hp<=0||c.m.kind==='status')return;const dealt=c.a.soulState.chaosDamage??0;if(dealt>280&&c.t.hp>0)c.randomFromSharedPool(1,false);else if(dealt<280){c.a.soulState.chaosPriorityRound=c.round+1;c.timed(c.a,'必定暴击',1,{},c.round+1);}}
}};
registry[969]={name:'妖族元皇·兰蒂斯',sourceHash:'88cd1320',traits:{specialAlwaysHit:true},hooks:{
beforeDamage(c){if(c.a.side===c.first)c.modifier*=c.a.hp<c.t.hp?2:1.5;},
afterAttack(c){if(c.a.hp>0&&c.m.kind==='special')c.heal(c.a,c.dealt*.5,'妖皇魂印特攻回复');},
opponentBeforeUse(c){if(c.a.hp<c.t.hp)c.stage(c.a,1);if(c.t.side===c.first){c.hurt(c.t,c.t.stats.maxHp/3,'妖皇魂印先手惩罚','percent');if(c.t.hp<=0){c.clear(c.t);c.timed(c.t,'skillBlock',1,{});}}}
}};

registry[1017]={name:'玛洛迪斯',sourceHash:'c80900bd',traits:{},hooks:{
death(c){if(c.a.soulState.rebirthAttempted)return;c.a.soulState.rebirthAttempted=true;if(c.random()<.5){c.a.hp=c.a.stats.maxHp;c.restorePP(c.a,Infinity);c.clearBoost(c.t);c.clear(c.t);}else c.timed(c.t,'statusBlock',3,{});},
afterAttack(c){if(c.a.hp<=0)return;if((c.settledDamage??c.dealt)>300&&c.t.hp>0){healthRules.drainFixed(c,300,'玛洛迪斯魂印吸取','玛洛迪斯魂印吸取');}else if((c.settledDamage??c.dealt)<300)c.timed(c.a,'必定暴击',1,{},c.round+1);}
}};

registry[1014]={name:'怒涛·沧岚',sourceHash:'ab79edfc',traits:{skillPriority:f=>(f.suitState.shield+(f.soulState.attackShield??0)+(f.soulState.marsShield??0))>0?1:0},hooks:{
battleStart(c){c.a.suitState.shield+=400;},
beforeUse(c){if(c.m.kind!=='status')c.a.soulState.waveGrowth=Math.min(4,(c.a.soulState.waveGrowth??0)+1);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.waveGrowth??0)*.25;},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.roundAttackDamage>0)c.a.counts.attackNullify=Math.max(1,c.a.counts.attackNullify??0);else{const before=c.a.hp;c.heal(c.a,250,'沧岚战阶回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'沧岚战阶追加','fixed');}}
}};

registry[1932]={name:'怒涛·沧岚·觉醒',sourceHash:'ed0e3e1c',deferred:['永恒之水达到8道后下场保留；蚀砚之泪下场保留'],traits:{skillPriority:f=>(f.suitState.shield+(f.soulState.attackShield??0)+(f.soulState.marsShield??0))>0?1:0,noPPConsumption:f=>(f.suitState.shield+(f.soulState.attackShield??0)+(f.soulState.marsShield??0))===0},hooks:{
battleStart(c){c.addShield(c.a,400,'canglan-entry');},
beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&c.shieldSourceValue(c.a,'canglan-entry')>0)c.amount=Math.min(c.amount,c.shieldValue(c.a));},
beforeUse(c){if(c.m.kind!=='status'&&c.shieldValue(c.a)>0)c.a.soulState.eternalWater=Math.min(8,(c.a.soulState.eternalWater??0)+1);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.eternalWater??0)*.25;},
afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.shieldValue(c.a)===0){c.t.soulState.inkTears=Math.min(4,(c.t.soulState.inkTears??0)+1);c.t.soulState.inkTearsSource=c.a.side;}},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.roundAttackDamage>0)c.a.counts.attackNullify=Math.max(1,c.a.counts.attackNullify??0);else{const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp*.25,'沧岚觉醒战阶回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'沧岚觉醒战阶追加','percent');}if((c.a.soulState.eternalWater??0)>0&&(c.t.soulState.inkTears??0)>0)c.timed(c.t,'弱化不可解除反转',2,{});},
death(c){if(c.t.soulState.inkTearsSource===c.a.side){delete c.t.soulState.inkTears;delete c.t.soulState.inkTearsSource;}}
}};

registry[1016]={name:'上古魔尊·库贝萨',sourceHash:'ce7b3c7',traits:{},hooks:{
roundStart(c){const st=c.a.soulState;st.kubesaSurvive=conditionStatusRules.conditionPresent(c.a,c.round);st.kubesaHigh=c.a.hp>c.t.hp;st.kubesaLow=c.a.hp<c.t.hp;},
death(c){if((c.a.soulState.kubesaPartner||c.a.soulState.kubesaSurvive)&&conditionStatusRules.conditionPresent(c.a,c.round)){c.a.hp=1;c.clearAilments(c.a);}},
beforeUse(c){if(c.a.soulState.kubesaPartner?c.a.hp>c.t.hp:c.a.soulState.kubesaHigh)c.hurt(c.t,(c.t.stats.maxHp-c.t.hp)*(20+Math.floor(c.random()*21))/100,'库贝萨损失体力追加','percent');},
beforeDamage(c){if(c.a.soulState.kubesaPartner?c.a.hp>c.t.hp:c.a.soulState.kubesaHigh)c.modifier*=1.5;},
beforeIncomingAttack(c){if(c.a.soulState.kubesaPartner?c.a.hp<c.t.hp:c.a.soulState.kubesaLow)c.reduction=.5;},
combatEnd(c){if(c.a.hp>0&&(c.a.soulState.kubesaPartner?c.a.hp<c.t.hp:c.a.soulState.kubesaLow))c.heal(c.a,200+Math.floor(c.random()*201),'库贝萨战阶回复');}
}};

registry[1043]={name:'乌瑞娅',sourceHash:'38b44fb2',deferred:['己方场下存活数量增伤；对方场下阵亡数量闪避'],traits:{},hooks:{
roundStart(c){if(c.round===1){c.timed(c.a,'免异常',1,{});c.timed(c.a,'攻击转治疗',1,{});}},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp>c.t.hp)c.timed(c.a,'reflect',2,{});else if(c.a.hp<c.t.hp){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'乌瑞娅战阶回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'乌瑞娅战阶追加','percent');}}
}};
registry[1816]={name:'乌瑞娅·强化',sourceHash:'564c8af3',deferred:['重新登场的山祇恩怜或300护盾；己方场下存活与对方场下阵亡数量'],traits:{},hooks:{
roundStart(c){if(c.round===1){c.timed(c.a,'reflect',1,{});c.a.counts.nextAttackHealing=1;}},
combatEnd(c){if(c.round===1){c.a.soulState.mountainGraceLost=c.a.soulState.nextAttackHealingConsumedRound!==1;c.a.counts.nextAttackHealing=0;}if(c.a.hp<=0)return;const extra=c.a.soulState.mountainGraceLost?c.shieldValue(c.a)+(c.a.suitState.barrier??0):0;if(c.a.hp+extra>c.t.hp)c.timed(c.a,'reflect',2,{});else if(c.a.hp+extra<c.t.hp){const before=c.a.hp;c.heal(c.a,(c.a.stats.maxHp+extra)/3,'乌瑞娅强化战阶回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'乌瑞娅强化战阶追加','percent');}}
}};

registry[1061]={name:'混元天尊',sourceHash:'e7c06bfc',deferred:['首发封换与驱逐；辛死亡下回合驱逐；自身死亡后的队伍辛之印记；队伍阵亡数量及英雄圣殿对象闪避'],traits:{pinkImmune:f=>!!f.soulState.xinFusion,weaknessImmune:f=>!!f.soulState.xinFusion},hooks:{
battleStart(c){c.a.soulState.xin={hp:c.a.stats.maxHp,maxHp:c.a.stats.maxHp};},
roundStart(c){const xin=c.a.soulState.xin;c.a.soulState.xinBonus=0;c.a.soulState.xinEndDamage=false;if(!xin||xin.hp<=0)return;c.a.soulState.xinBonus=Math.floor((xin.maxHp-xin.hp)*5/xin.maxHp)*.1;if(conditionStatusRules.conditionPresent(c.a,c.round)){const pool=c.t.moves.filter(id=>c.t.pp[id]>0);if(pool.length)c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}c.a.soulState.xinEndDamage=Object.values(c.a.stages).some(n=>n<0);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.xinBonus??0);},
beforeHealthDamage(c){const xin=c.a.soulState.xin;if(!xin||xin.hp<=0||!['attack','fixed','percent'].includes(c.type)||c.amount<=0)return;const share=Math.floor(c.amount*.6);xin.hp=Math.max(0,xin.hp-share);c.amount-=share;if(xin.hp===0)xin.deadRound=c.round;},
combatEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.xinEndDamage)c.hurt(c.t,c.t.stats.maxHp/4,'辛弱化战阶追加','percent');},
roundCompleted(c){if(c.a.hp>0&&c.a.soulState.xin?.hp===0){c.a.soulState.xinFusion=true;c.a.build.resistance.fixed=100;c.a.build.resistance.percent=100;}},
death(c){if(c.a.soulState.xin){c.a.soulState.xin.hp=0;c.a.soulState.xin.deadRound=c.round;}}
}};
registry[1082]={name:'非凡·欧德内里',sourceHash:'523cda45',traits:{skillPriority:f=>f.soulState.extraordinaryBoosted?0:1},hooks:{
roundStart(c){c.a.soulState.extraordinaryBoosted=positive(c.a)>0;},
beforeUse(c){const st=c.a.soulState,n=st.extraordinaryTriggers??0;if(c.a.side!==c.first||n>=4)return;if(c.random()<1-n*.25){st.extraordinaryTriggers=n+1;c.t.soulState.skillInvalidRound=c.round;if(n===3){const pool=c.t.moves.filter(id=>c.t.pp[id]>0);for(let i=0;i<2&&pool.length;i++)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;}}},
beforeDamage(c){c.modifier*=1+(c.a.soulState.extraordinaryTriggers??0)*.25+(c.a.soulState.extraordinaryBoosted?.5:0);}
}};
registry[1084]={name:'龙神哈莫',sourceHash:'a142e08f',traits:{},hooks:{
roundStart(c){const st=c.a.soulState,tiers=Math.floor((c.a.stats.maxHp-c.a.hp)*10/c.a.stats.maxHp);st.hamoBonus=.5+tiers*.1;st.hamoReduction=Math.max(0,.5-tiers*.1);st.dragonSubmission=c.sameType('龙',c.t.type)&&c.random()<.5;st.hamoRetaliation=false;if(st.dragonSubmission)c.timed(c.t,'万龙臣服',1,{});},
beforeDamage(c){c.additiveAttackFraction=(c.additiveAttackFraction??0)+(c.a.soulState.hamoBonus??.5);},
beforeIncomingAttack(c){c.reduction=1-(1-(c.a.soulState.hamoReduction??.5))*(c.a.soulState.dragonSubmission?.75:1);},
opponentBeforeUse(c){if(c.m.kind==='status'){c.timed(c.a,'免异常',1,{});c.timed(c.a,'免弱',1,{});}else if(c.m.kind!=='item')c.a.soulState.hamoRetaliation=true;},
combatEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.hamoRetaliation)c.hurt(c.t,150+Math.floor(c.random()*151),'龙神哈莫攻击反应','fixed');}
}};
for(const [id,hash,retaliation,bonus]of [[1088,'9df0817b',.5,.5],[1130,'78276e82',.8,.6]])registry[id]={name:id===1088?'哀伤公爵':'哀伤公爵·强化',sourceHash:hash,traits:{immuneAilments:['麻痹']},hooks:{
receivedAttack(c){c.a.soulState.sorrowLastDamage=c.settledDamage??c.dealt;if(c.t.hp>0&&c.random()<retaliation)c.ailment(c.t,'失神',c.a);},
afterUse(c){if(!c.successful||c.a.hp<=0||c.t.hp<=0)return;if(c.m.kind!=='status'){c.t.counts.nextStatusInvalid=Math.max(1,c.t.counts.nextStatusInvalid??0);return;}c.hurt(c.t,(c.a.soulState.sorrowLastDamage??0)*bonus,'哀伤公爵属性追加','percent');if(c.t.hp<=0)return;const chance=c.a.soulState.sorrowFearChance??bonus;if(c.random()<chance&&c.ailment(c.t,'害怕',c.a))c.a.soulState.sorrowFearChance=bonus;else c.a.soulState.sorrowFearChance=Math.min(1,chance+.2);}
}};
for(const [id,hash,threshold]of [[1090,'ede70670',3],[1129,'45049101',2]])registry[id]={name:id===1090?'鲜血女王':'鲜血女王·强化',sourceHash:hash,traits:{},hooks:{
roundStart(c){const n=Math.floor((c.a.stats.maxHp-c.a.hp)*100/c.a.stats.maxHp);c.a.soulState.bloodBonus=n*.02*(c.a.hp<c.a.stats.maxHp/threshold?2:1);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.bloodBonus??0);},
afterAttack(c){if(c.a.soulState.bloodBurnRound===c.round)c.heal(c.a,c.dealt*.5,'燃血攻击回复');},
combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0||c.a.hp>=c.a.stats.maxHp/threshold||(st.bloodBurnUses??0)>=2)return;st.bloodBurnUses=(st.bloodBurnUses??0)+1;st.bloodBurnRound=c.round+1;c.clearAilments(c.a);c.clearNegative(c.a);c.timed(c.a,'所有技能必定先手',1,{},c.round+1);}
}};
registry[1113]={name:'战争猎魔',sourceHash:'c85f7577',deferred:['对手死亡后的下一只登场时己方在场精灵吸取最大体力1/3且全属性+1'],traits:{},hooks:{
roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<3;i++)c.stage(c.a,1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);if(!(c.random()<.5&&c.ailment(c.t,'害怕',c.a))&&c.random()<.5)c.ailment(c.t,'瘫痪',c.a);}
}};

for(const [id,hash,fraction]of [[1120,'25657a99',.8],[1620,'9448f0d7',1]])registry[id]={name:id===1120?'魂帝·天循道':'魂帝·天循道·强化',sourceHash:hash,traits:{},hooks:{
roundStart(c){c.a.soulState.soulEmperorDrain=conditionStatusRules.conditionPresent(c.t,c.round);c.a.soulState.soulEmperorAttacked=false;},
opponentBeforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.soulEmperorAttacked=true;},
afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.soulEmperorDrain)healthRules.drainPercent(c,c.t.stats.maxHp/3,'魂帝异常吸取');},
roundEnd(c){if(c.a.hp<=0||!c.a.soulState.soulEmperorAttacked)return;const n=c.a.roundSettledAttackDamage??c.a.roundAttackDamage;if(n>300&&c.t.hp>0){if(id===1620)c.clear(c.t);c.hurt(c.t,n*fraction,'魂帝回合反伤','percent');if(c.t.hp>0&&c.random()<fraction)c.ailment(c.t,'疲惫',c.a);}else if(n<300){c.timed(c.a,'id984',1,{amount:1},c.round+1);c.timed(c.a,'攻击伤害倍数',1,{multiple:1+fraction},c.round+1);}}
}};

registry[849]={name:'天启帝君',sourceHash:'29f34d63',traits:{pinkImmune:true,ailmentImmune:true},deferred:['帝君之罚与帝君之赐的场下扣血回复、非首次登场削弱','帝君之援给予其他队员的入场先制','按队伍死亡和场下存活数增减伤与回复追加','最后存活队员免断与敌方最后存活禁疗','被击败后令敌方场下精灵死亡'],hooks:{
battleStart(c){c.a.build.resistance.fixed=100;c.a.build.resistance.percent=100;if(c.a.hp===c.a.stats.maxHp)c.a.effects.id984={start:1,end:1,amount:1};}
}};
for(const [id,hash,rounds]of [[1138,'497b798c',1],[1437,'4ac952e5',2]])registry[id]={name:'月照星魂'+(id===1437?'·强化':''),sourceHash:hash,traits:{},hooks:{
battleStart(c){c.a.soulState.moonEntryTriggers=1;c.a.soulState.moonEntryLimit=id===1437?3:2;},
roundStart(c){if(c.round<=rounds){if(id===1437)c.timed(c.a,'protect',1,{});c.timed(c.a,'免异常',1,{});c.timed(c.a,'免弱',1,{});c.timed(c.a,'必定暴击',1,{});}},
afterAttack(c){if((c.settledDamage??c.dealt)<300)c.timed(c.a,'必定暴击',1,{},c.round+1);if(c.crit&&c.t.hp>0&&!c.ailment(c.t,'失明',c.a))c.hurt(c.t,c.a.stats.maxHp/3,'月照失明未触发','percent');}
}};
for(const [id,hash,denominator,priority]of [[1139,'82ce05ed',3,1],[1447,'bb368e84',2,2]])registry[id]={name:'暗岩·格莱奥丹'+(id===1447?'·强化':''),sourceHash:hash,traits:{},hooks:{
opponentAfterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const positive=Object.keys(c.t.stages).filter(k=>c.t.stages[k]>0);if(positive.length){c.steal(c.a,c.t,'暗岩魂印');if(positive.some(k=>c.t.stages[k]===0)){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/denominator,'暗岩吸强回复');if(c.a.hp>before)c.hurt(c.t,c.a.hp-before,'暗岩回复等量','fixed');c.timed(c.a,'id984',2,{amount:priority},c.round+1);}}else if(!(c.random()<.5&&c.ailment(c.t,'石化',c.a)))c.timed(c.t,'statusBlock',2,{},c.round+1);}
}};
for(const [id,hash,amount,chance]of [[1142,'d7585d49',80,.5],[1449,'48c996e1',100,.6]])registry[id]={name:'暗瞳·魔眼凯兮'+(id===1449?'·强化':''),sourceHash:hash,traits:{attackPriority:f=>f.soulState.darkEyeCleansed?1:0},hooks:{
roundStart(c){const had=Object.values(c.a.stages).some(v=>v<0);c.clearNegative(c.a);c.a.soulState.darkEyeCleansed=had&&!Object.values(c.a.stages).some(v=>v<0);c.a.soulState.darkEyeBonus=(c.a.soulState.darkEyeCleansed?.5:0)+(c.a.soulState.darkEyeBonusRound===c.round?.5:0);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.darkEyeBonus??0);},
afterAttack(c){if(c.a.hp<=0||c.t.hp<=0)return;const count=Object.values(c.t.stages).filter(v=>v>0).length;if(count)c.hurt(c.t,count*amount,'暗瞳强化追加','fixed');else if(!(c.random()<chance&&c.ailment(c.t,'石化',c.a)))c.a.soulState.darkEyeBonusRound=c.round+1;}
}};
registry[1137]={name:'希瓦',sourceHash:'73f4b77e',traits:{skillPriority:f=>f.soulState.shivaHigh?1:0,dodgeChance:f=>Math.min(1,(f.soulState.shivaDefeats??0)*.1)},deferred:['切换后保留击败累计暴击与闪避提升，后续对手出场继续累计'],hooks:{
choiceLocked(c){const id=c.opponentMove?.id;if(!id||c.opponentMove.kind==='item')return;const st=c.a.soulState;st.shivaDrainRound=st.shivaLastChoice===id?c.round:0;st.shivaLastChoice=id;if(st.shivaDrainRound===c.round&&c.random()<.3)c.t.soulState.skillInvalidRound=c.round;},
roundStart(c){c.a.soulState.shivaHigh=c.a.hp>c.t.hp;if(c.a.soulState.shivaHigh)c.stage(c.t,-1);},
roundEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.shivaDrainRound===c.round){c.hurt(c.t,300,'希瓦重复选招吸取','fixed');c.heal(c.a,300,'希瓦重复选招吸取');}},
damageDealt(c){if(c.t.hp<=0&&!c.a.soulState.shivaDefeatRecorded){c.a.soulState.shivaDefeatRecorded=true;c.a.soulState.shivaDefeats=(c.a.soulState.shivaDefeats??0)+1;}},
beforeCrit(c){c.chance=Math.min(1,c.chance+(c.a.soulState.shivaDefeats??0)*.1);}
}};

for(const [id,hash,priority,critical]of [[1145,'b03fdda2',1,.5],[1446,'2945f022',2,1]])registry[id]={name:'暗战·艾辛格斯'+(id===1446?'·强化':''),sourceHash:hash,traits:{skillPriority:f=>f.soulState.darkWarBoosted?priority:0},hooks:{
roundStart(c){c.a.soulState.darkWarLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.darkWarBoosted=[c.a,c.t].some(f=>Object.values(f.stages).some(v=>v>0));},
beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.darkWarLastDamage=0;},
beforeDamage(c){if(c.a.soulState.darkWarBoosted)c.modifier*=2;},
beforeCrit(c){if(!c.a.soulState.darkWarBoosted){c.chance=critical;if(critical===1)c.forceCrit=true;}},
afterAttack(c){c.a.soulState.darkWarLastDamage=c.settledDamage??c.dealt;if(c.a.hp>0)c.heal(c.a,c.dealt*.5,'暗战攻击回复');},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.soulState.darkWarLow&&c.t.hp>0)c.hurt(c.t,(c.a.soulState.darkWarLastDamage??0)*.5,'暗战低体战阶追加','percent');if(!c.a.soulState.darkWarBoosted){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<3;i++)c.stage(c.a,1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);}}
}};

for(const [id,hash]of [[1148,'3c9e4b04'],[1445,'c7c26046']])registry[id]={name:'暗霆·伊修兰迪'+(id===1445?'·强化':''),sourceHash:hash,traits:{},hooks:{
roundStart(c){c.a.soulState.darkThunderHealth=Math.sign(c.a.hp-c.t.hp);},
beforeAttackDamage(c){const positive=Object.keys(c.t.stages).filter(k=>c.t.stages[k]>0);if(!positive.length){if(id===1445&&c.t.hp>0){c.hurt(c.t,250,'暗霆无强化吸取','fixed');c.heal(c.a,250,'暗霆无强化吸取');}return;}let changed=false;for(const k of positive){const before=c.t.stages[k];c.stage(c.t,-2*before,[k]);changed ||=c.t.stages[k]<before;}if(!changed){c.steal(c.a,c.t,'暗霆反转失败');c.timed(c.a,'魂印先制',1,{amount:3},c.round+1);}},
attackDamageTaken(c){if((c.settledDamage??c.dealt)<=0||c.a.hp<=0||c.t.hp<=0)return;if(c.a.soulState.darkThunderHealth>0)c.clear(c.t);else if(c.a.soulState.darkThunderHealth<0)c.ailment(c.t,'麻痹',c.a);}
}};

for(const [id,hash,chance]of [[1152,'8375e9ba',.5],[1448,'e7307947',1]])registry[id]={name:'暗夜·诺伊尔顿'+(id===1448?'·强化':''),sourceHash:hash,traits:{skillPriority:f=>f.soulState.darkNightLost>0?1:0},hooks:{
roundStart(c){c.a.soulState.darkNightLost=c.a.stats.maxHp-c.a.hp;},
opponentBeforeUse(c){if(c.m.kind==='status'&&c.a.soulState.darkNightLost===0&&(chance===1||c.random()<chance))c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;},
afterAttack(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.soulState.darkNightLost>0)c.hurt(c.t,c.a.soulState.darkNightLost*.5,'暗夜损失体力追加','fixed');if(c.t.hp>0&&c.a.soulState.darkNightCurseRound===c.round&&c.random()<.5)c.ailment(c.t,'诅咒',c.a);},
attackDamageTaken(c){if((c.settledDamage??c.dealt)<=0||c.a.hp<=0||c.t.hp<=0)return;if(!(c.random()<.5&&c.ailment(c.t,'害怕',c.a))){c.stage(c.t,-1);c.a.soulState.darkNightCurseRound=c.round+1;}}
}};
registry[748]={name:'柯尔霍德',sourceHash:'40aac93b',traits:{skillPriority:f=>f.soulState.keColdLow?1:0},hooks:{
roundStart(c){c.a.soulState.keColdLow=c.a.hp<c.a.stats.maxHp/2;},
beforeDamage(c){if(c.a.soulState.keColdLow)c.modifier*=2;},
afterAttack(c){if(c.a.soulState.keColdLow&&c.a.hp>0)c.heal(c.a,c.dealt*.5,'柯尔霍德低体吸血');},
beforeHealthDamage(c){if(c.type==='attack'&&c.amount>c.a.hp/2)c.amount=Math.floor(c.amount*(1-.5*((c.damageReductionIgnore??0)>=1?0:1)));},
roundEnd(c){if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'reflect',2,{});}
}};
registry[2150]={name:'柯尔霍德·觉醒',sourceHash:'ae15e4fb',traits:{skillPriority:f=>f.soulState.keMirrorLow?1:0},hooks:{
roundStart(c){c.a.soulState.keMirrorLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.keMirrorHigh=c.a.hp>c.a.stats.maxHp/2;},
beforeDamage(c){if(c.a.soulState.keMirrorLow)c.modifier*=2;},
beforeHealthDamage(c){if(c.type!=='attack')return;const saved=Math.floor(c.amount*Math.min(.5,Math.floor(c.amount*100/c.a.stats.maxHp)/100)*((c.damageReductionIgnore??0)>=1?0:1));c.amount-=saved;c.gainMirror(c.a,saved);},
afterAttack(c){if(c.a.hp<=0)return;const n=Math.floor(c.dealt*Math.min(.5,Math.floor(c.dealt*100/c.a.stats.maxHp)/100)),before=c.a.hp;c.heal(c.a,n,'弥沦之镜攻击回复');c.gainMirror(c.a,c.a.hp-before);},
combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const pool=Object.keys(c.t.ailments).filter(k=>c.t.ailments[k]>=c.round&&c.auxiliaryAilments.includes(k)),n=c.mirrorCount(c.a);if(n===0){for(const k of pool)c.clearAilment(c.t,k);return;}for(let i=0;i<n&&pool.length;i++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0],duration=c.t.ailments[k]-c.round+1;c.clearAilment(c.t,k);c.ailment(c.a,k,c.t,true,false,duration);c.heal(c.a,c.a.stats.maxHp*.3,'弥沦之镜转移回复');c.restorePP(c.a,1);}},
roundEnd(c){if(c.a.hp<=0||c.t.hp<=0||!c.a.soulState.keMirrorHigh)return;const history=c.t.statusState?.executedAilments;if(history?.round===c.round)for(const k of history.names)c.ailment(c.t,k,c.a);const own=Object.keys(c.a.ailments).filter(k=>c.a.ailments[k]>=c.round),other=Object.keys(c.t.ailments).filter(k=>c.t.ailments[k]>=c.round);if(own.length!==other.length){for(const k of own)c.clearAilment(c.a,k);if(own.length)c.addMoon('没夜之月',c.t.side,own.length*2);}}
}};
registry[782]={name:'不灭·艾恩斯',sourceHash:'a1de8fe9',traits:{},hooks:{
roundStart(c){c.a.soulState.ainsHigh=c.a.hp>c.t.hp;},
beforeHealthDamage(c){const st=c.a.soulState;if(c.type==='attack'&&c.amount>0&&st.ainsHigh&&c.t.hp>0&&!c.ailment(c.t,'焚烬',c.a))c.clear(c.t);if(c.amount>=c.a.hp&&c.a.hp>0&&!st.ainsSaved&&c.skillPhase&&c.currentActorSide===c.t.side&&c.a.side!==c.t.side){st.ainsSaved=true;st.ainsSurvivalRound=c.round;c.clearBoost(c.a);c.clearBoost(c.t);c.clear(c.a);c.clear(c.t);c.ailment(c.t,'烧伤',c.a,false,false,2);}if(st.ainsSurvivalRound===c.round)c.hpFloor=1;},
death(c){if(c.a.soulState.ainsSurvivalRound===c.round)c.a.hp=1;},
combatEnd(c){if(c.a.hp>0&&c.a.hp<c.t.hp)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)/2,'不灭失血回复');}
}};
function rhRound(c,amount){const boosted=positive(c.a)>0;c.a.soulState.rhDrain=!boosted;if(boosted)c.refreshShield(c.a,amount,'soul:'+c.a.soulId+':roundStart');}
function rhDrain(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.rhDrain){const amount=c.t.stats.maxHp/3;healthRules.drainPercent(c,amount,'莱茵哈特吸取');c.addShield(c.a,Math.min(400,Math.floor(amount)),'soul:'+c.a.soulId+':drain');}}
function guDeath(c){const list=c.t.soulState.soulGu??[],at=list.findIndex(g=>g.sourceSide===c.a.side);if(at>=0)list.splice(at,1);}
registry[828]={name:'混沌地王莱茵哈特',sourceHash:'efb9f566',traits:{},hooks:{
roundStart(c){rhRound(c,300);},combatEnd:rhDrain,
shieldBroken(c){if(c.a.hp<=0||c.t.hp<=0||c.shieldValue(c.a)>0)return;c.a.soulState.rhNextUseReduction=true;c.hurt(c.t,c.t.stats.maxHp/3,'莱茵哈特破盾','percent');},
opponentBeforeUse(c){if(c.m.kind!=='status'&&c.a.soulState.rhNextUseReduction){delete c.a.soulState.rhNextUseReduction;c.a.soulState.rhReductionRound=c.round;}},
beforeIncomingAttack(c){if(c.a.soulState.rhReductionRound===c.round)c.reduction=Math.max(c.reduction,.5);},death:guDeath
}};
registry[1985]={name:'觉醒·混沌地王莱茵哈特',sourceHash:'303f4dd6',traits:{},hooks:{
roundStart(c){rhRound(c,400);},
combatEnd(c){rhDrain(c);const n=c.shieldValue(c.a);if(c.a.hp>0&&c.t.hp>0&&n>0&&n%400===0)c.plantGu(c.t);},
shieldBroken(c){if(c.a.hp<=0||c.t.hp<=0)return;c.a.soulState.rhNextReduction=true;c.hurt(c.t,c.t.stats.maxHp/3,'莱茵哈特破盾','percent');},
beforeIncomingAttack(c){if(c.a.soulState.rhNextReduction){delete c.a.soulState.rhNextReduction;c.reduction=Math.max(c.reduction,.5);}},
boostRemoved(c){if(['clear','steal'].includes(c.method)&&c.a.hp>0){c.addSeal(c.a);c.addShield(c.a,400,'soul:1985:boostRemoved');}},
damageTaken(c){if(['fixed','percent'].includes(c.type)&&(c.settledDamage??c.dealt)>c.a.stats.maxHp/3&&c.a.hp>0)c.heal(c.a,c.shieldValue(c.a),'莱茵哈特高粉伤回复');},
attackDamageTaken(c){if(c.a.hp>0&&c.t.hp>0&&((c.settledDamage??c.dealt)>0||c.shieldDamage>0)&&(c.a.soulState.sealLayers??0)>0&&c.shieldValue(c.t)>c.shieldValue(c.a))c.consumeShields(c.t,c.a,false);},death:guDeath
}};

registry[832]={name:'乔列尼德',sourceHash:'2488dc58',traits:{skillPriority:f=>f.soulState.jolieSame?1:0},hooks:{
roundStart(c){const st=c.a.soulState,m=c.selectedMove(c.a);st.jolieSame=false;if(m.kind==='item'||!st.joliePreviousKind)return;st.jolieSame=m.kind===st.joliePreviousKind;if(!st.jolieSame){const before=c.a.hp;c.heal(c.a,Math.min(c.a.stats.maxHp/3,c.a.stats.maxHp-before),'乔列尼德回合初');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'乔列尼德回合初追加','percent');}},
afterUse(c){if(c.successful&&c.m.kind!=='item')c.a.soulState.joliePreviousKind=c.m.kind;}
}};
registry[2005]={name:'乔列尼德·觉醒',sourceHash:'4efb73e8',traits:{skillPriority:f=>f.soulState.jolieSame?1:0},hooks:{
roundStart(c){const st=c.a.soulState,m=c.selectedMove(c.a);st.jolieSame=false;st.jolieRecovered=0;st.jolieHasPrevious=!!st.joliePreviousKind;st.jolieSelected=m.kind!=='item';if(!st.jolieSelected||!st.jolieHasPrevious)return;st.jolieSame=m.kind===st.joliePreviousKind;if(st.jolieSame)c.restorePP(c.a,1);else{const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'乔列尼德回合初');st.jolieRecovered=c.a.hp-before;}},
opponentAfterUse(c){if(c.successful&&c.a.hp>0&&c.a.soulState.jolieSelected&&!c.a.soulState.jolieHasPrevious)c.gainInverse(c.a);},
afterUse(c){const st=c.a.soulState;if(c.a.hp<=0||c.m.kind==='item')return;if(st.jolieHasPrevious&&c.t.hp>0){if(c.successful&&st.jolieRecovered>0)c.hurt(c.t,st.jolieRecovered,'乔列尼德行动后追加','percent');c.addDread(c.t);}if(c.successful)st.joliePreviousKind=c.m.kind;},
actionSkipped(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.jolieHasPrevious)c.addDread(c.t);}
}};

registry[841]={name:'堕落泰坦',sourceHash:'16af30c8',traits:{},hooks:{
death(c){if(c.round<=2&&c.t.soulState.actionEndedRound!==c.round)c.a.soulState.titanRevivalPendingRound=c.round;},
opponentActionEnd(c){if(c.round>2||c.a.hp>0)return;c.a.hp=c.a.stats.maxHp;delete c.a.soulState.deathResolved;delete c.a.soulState.titanRevivalPendingRound;c.t.counts.nextAttackInvalid=(c.t.counts.nextAttackInvalid??0)+1;c.clear(c.t);c.clearBoost(c.t);c.emit(c.name(c.a)+' 堕落泰坦魂印：对手行动结束后重置体力至最大值。','heal');},
beforeAilment(c){if(c.random()*100<(c.a.soulState.soulProbabilityOverride??50)){c.blocked=true;c.reflect();}else c.a.soulState.titanAilmentFailedRound=c.round;},
combatEnd(c){if(c.a.soulState.titanAilmentFailedRound===c.round&&c.t.hp>0)c.stage(c.t,-1);}
}};

registry[847]={name:'魔灵王·斯摩亚蒂',sourceHash:'eb7203d',traits:{skillPriority:f=>f.soulState.demonLow?1:0},hooks:{roundStart(c){const st=c.a.soulState;if(!st.demonEntered){st.demonEntered=true;c.t.counts.nextAttackInvalid=(c.t.counts.nextAttackInvalid??0)+1;if(c.clear(c.t))c.ailment(c.t,'害怕',c.a);}st.demonLow=c.a.hp<c.a.stats.maxHp/2;if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'protect',1,{});},combatEnd(c){if(c.a.soulState.demonLow)c.heal(c.a,c.a.stats.maxHp/3,'魔灵王魂印低体回复');}}};

// 凌波清芙：两真实版本；仅后继出场和场下队友分支延期。
for(const [id,hash,bonus]of [[1157,'f4eb9ef9',.5],[1561,'7efe32b8',1]])registry[id]={name:id===1157?'凌波清芙':'凌波清芙·强化',sourceHash:hash,deferred:['当回合攻击击败对手后，吸取对方下只登场精灵最大体力1/3并按原版50%或强化100%令其睡眠','死亡后恢复己方不在场且存活精灵最大体力1/3，并使己方下只登场精灵获得400点护盾和400点护罩'],traits:{skillPriority:f=>f.soulState.lotusBonusRound===f.soulState.currentRound?1:0,damageMultiplier:f=>f.soulState.lotusBonusRound===f.soulState.currentRound?1+bonus:1},hooks:{roundStart(c){c.a.soulState.currentRound=c.round;},afterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0)c.a.soulState.lotusBonusRound=c.round+1;}}};

// 3907 partial: attack reduction is verified; other damage types await Q-3907-001.
for(const [id,hash,highDamage,highReduction]of [[1174,'7235899d',400,.6],[1365,'2f320b3c',450,.65]])registry[id]={name:id===1174?'缚影·炼狱魔神':'缚影·炼狱魔神·强化',sourceHash:hash,traits:{},hooks:{
roundStart(c){c.a.soulState.shadowHigh=c.a.hp>c.t.hp;},
afterUse(c){if(c.a.hp<=0||c.m.kind==='item')return;const st=c.a.soulState;if(c.a.side===c.first){if(c.t.hp>0)c.hurt(c.t,st.shadowHigh?highDamage:300,'缚影魂印先手追加','fixed');}else{st.shadowReductionRound=c.round+1;st.shadowReduction=st.shadowHigh?highReduction:.5;}},
beforeIncomingAttack(c){if(c.a.soulState.shadowReductionRound===c.round)c.reduction=1-(1-c.reduction)*(1-c.a.soulState.shadowReduction);},
attackDamageTaken(c){if((c.settledDamage??c.dealt)>300)c.t.counts.nextAttackInvalid=(c.t.counts.nextAttackInvalid??0)+1;}
}};

for(const [id,hash,priority]of [[1197,'c02e45d0',1],[1436,'6a7f6b31',2]])registry[id]={name:id===1197?'墨影星魂':'墨影星魂·强化',sourceHash:hash,deferred:['每次登场令己方月照星魂本场伤害提升10%，最高50%；需要队伍指定精灵与跨登场累计'],traits:{attackPriority:f=>f.soulState.inkLow?priority:0},hooks:{roundStart(c){if(!c.a.soulState.inkEntered){c.a.soulState.inkEntered=true;c.timed(c.t,'statusBlock',2,{});}c.a.soulState.inkLow=c.t.hp<300;c.a.soulState.inkHigh=c.t.hp>300;},afterHit(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0&&c.a.soulState.inkHigh)healthRules.drainFixed(c,id===1197?300:350,'墨影高体吸取');},beforeCrit(c){if(c.a.soulState.inkLow)c.forceCrit=true;}}};

registry[1155]={name:'冰魄·柯尔德',sourceHash:'8603e5bf',traits:{},hooks:{
roundStart(c){c.a.soulState.ignoreTargetBoostRound=c.round;},
beforeHealthDamage(c){if(c.type!=='attack'||c.amount<=0)return;const st=c.a.soulState;if(st.coldNextCap){c.amount=Math.min(c.amount,200);delete st.coldNextCap;}const n=c.amount;if(n>c.a.stats.maxHp/2)c.amount=Math.floor(n*(1-.6*((c.damageReductionIgnore??0)>=1?0:1)));else if(n<c.a.stats.maxHp/2)st.coldReflect=(st.coldReflect??0)+n;},
attackDamageTaken(c){const n=c.a.soulState.coldReflect??0;delete c.a.soulState.coldReflect;if(n>0&&c.t.hp>0)c.hurt(c.t,n,'冰魄低伤反弹','percent');},
afterHit(c){if(c.m.kind==='status'||!Object.values(c.t.stages).some(n=>n>0))return;if(!c.ailment(c.t,'冰封',c.a))c.a.soulState.coldNextCap=true;}
}};
registry[1971]={name:'冰魄·柯尔德·觉醒',sourceHash:'8360a956',deferred:['寂杀之魄下场保留；主动切换及己方在场精灵死亡清理肃霜之禁'],traits:{ignoreOpponentPriorityUpTo:f=>f.soulState.coldPriorityCap??0},hooks:{
roundStart(c){const st=c.a.soulState;st.coldSaved=0;st.coldNoEssence=!(st.coldEssence>0);st.coldPriorityCap=(conditionStatusRules.conditionPresent(c.a,c.round)||conditionStatusRules.conditionPresent(c.t,c.round))?(st.coldEssence??0)*(conditionStatusRules.conditionPresent(c.a,c.round)?3:1):0;const m=c.selectedMove(c.a);if(st.coldNoEssence||m.kind!=='status'&&m.kind!=='item')st.ignoreTargetBoostRound=c.round;},
beforeHealthDamage(c){if(!['attack','fixed','percent'].includes(c.type)||!c.skillPhase||c.currentActorSide!==c.t.side||c.amount<=0)return;const before=c.amount;c.amount=Math.floor(before*(1-.6*((c.damageReductionIgnore??0)>=1?0:1)));c.a.soulState.coldSaved=(c.a.soulState.coldSaved??0)+before-c.amount;},
damageTaken(c){if(c.type==='true'&&(c.settledDamage??0)>0)c.a.soulState.coldEssence=Math.min(3,(c.a.soulState.coldEssence??0)+1);},
afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0||!Object.values(c.t.stages).some(n=>n>0))return;const applied=c.ailment(c.t,'冰封',c.a);if(c.a.soulState.coldNoEssence||!applied)c.t.soulState.coldBan=200;},
combatEnd(c){const n=c.a.soulState.coldSaved??0;c.a.soulState.coldSaved=0;if(n>0&&n<200)c.feedbackPair(n);else if(n>200&&c.a.soulState.coldEssence>0&&c.t.hp>0)c.ailment(c.t,'冻伤',c.a,false,false,3);}
}};


function gammaBaseRound(c){const st=c.a.soulState;st.currentRound=c.round;st.gammaLow=c.a.hp<c.t.hp;st.gammaHigh=c.a.hp>c.t.hp;st.gammaDifference=Math.abs(c.a.hp-c.t.hp);}
function gammaFear(c,chance){if(c.a.hp>0&&c.t.hp>0&&c.m.kind!=='status'&&c.m.kind!=='item'&&c.a.soulState.gammaHigh&&!(c.random()*100<chance&&c.ailment(c.t,'害怕',c.a)))c.clear(c.t);}
registry[1165]={name:'伽玛星魂',sourceHash:'1187ada2',deferred:['前两次登场的再登场首回合暴击与能力下降防护；当前首次登场已实现'],traits:{attackPriority:f=>f.soulState.gammaLow?1:0,criticalImmune:f=>f.soulState.gammaEntryRound===f.soulState.currentRound,weaknessImmune:f=>f.soulState.gammaEntryRound===f.soulState.currentRound},hooks:{
roundStart(c){gammaBaseRound(c);if(!c.a.soulState.gammaEntered){c.a.soulState.gammaEntered=true;c.a.soulState.gammaEntryRound=c.round;}},
afterAttack(c){if(c.a.soulState.gammaLow&&c.t.hp>0)c.hurt(c.t,c.a.soulState.gammaDifference,'伽玛低体差值追加','fixed');},
afterUse(c){gammaFear(c,80);}
}};
registry[1959]={name:'伽玛星魂·强化',sourceHash:'86df2ecc',deferred:['换宠再登场重新获得首次暴击抵挡；在场无法主动切换分支本阶段已实现'],traits:{attackPriority:f=>f.soulState.gammaLow?1:0,criticalImmune:f=>!!f.soulState.gammaCritReady,weaknessImmune:f=>!!f.soulState.gammaCritReady},hooks:{
roundStart(c){const st=c.a.soulState;if(!st.gammaEntered){st.gammaEntered=true;st.gammaCritReady=true;}if(c.a.ailments['瘫痪']>=c.round||c.a.ailments['凝滞']>=c.round||c.on(c.a,'不能主动切换')){st.gammaCritReady=true;const list=Object.entries(c.a.ailments).filter(([,end])=>end>=c.round);for(const [k,end]of list)if(c.t.hp>0)c.ailment(c.t,k,c.a,false,false,end-c.round+1);c.clearAilments(c.a);}gammaBaseRound(c);},
criticalImmuneTriggered(c){c.a.soulState.gammaCritReady=false;c.clearAilments(c.a);c.ailment(c.a,'超频',c.a,false,false,3);},
beforeHealthDamage(c){if(c.a.ailments['超频']>=c.round&&c.a.hp>0&&c.amount>0&&c.amount>=c.a.hp){c.hpFloor=1;for(const k of Object.keys(c.a.ailments))if(k!=='超频')c.clearAilment(c.a,k);}},
beforeUse(c){if(c.a.soulState.gammaLow&&c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,Math.floor(Math.abs(c.a.hp-c.t.hp)*.7),'伽玛强化低体差值追加','true');},
afterUse(c){gammaFear(c,100);}
}};
for(const [id,hash]of [[1189,'df9cfd69'],[1366,'23429ae1']])registry[id]={name:id===1189?'凛戾·寂灭魔神':'凛戾·寂灭魔神·强化',sourceHash:hash,traits:{skillPriority:f=>f.soulState.silencePriorityRound===f.soulState.currentRound?1:0},hooks:{roundStart(c){c.a.soulState.currentRound=c.round;},beforeUse(c){if(c.m.kind==='item')return;const st=c.a.soulState;st.silenceLateFailure=false;if(c.a.side===c.first){c.stage(c.a,1);if(c.a.hp>c.a.stats.maxHp/2){c.stage(c.a,1,['atk','spe']);}}else st.silenceLateFailure=!c.clear(c.t);},afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState;if(c.m.kind!=='status'&&c.actionSettledDamage===0){if(c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'寂灭无伤吸取');st.silencePriorityRound=c.round+1;}if(st.silenceLateFailure){st.silenceLateFailure=false;if(id===1366){if(c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'寂灭强化后手吸取');}else{const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'寂灭后手回复');const n=c.a.hp-before;if(c.t.hp>0&&n>0)c.hurt(c.t,n,'寂灭后手等量百分比','percent');}}}}};

for(const [id,hash,multiple]of [[1203,'db60df2a',.5],[1241,'3502ae00',1]])registry[id]={name:id===1203?'鬼神无双·吕布':'鬼神无双·吕布·强化',sourceHash:hash,traits:{ailmentImmune:f=>!!f.soulState.lubuFull,weaknessImmune:f=>!!f.soulState.lubuFull,attackPriority:f=>id===1203&&f.soulState.lubuTurn?3:0,skillPriority:f=>id===1241&&(f.soulState.lubuUses??0)>0?3:0},hooks:{roundStart(c){c.a.soulState.lubuFull=c.a.hp===c.a.stats.maxHp;c.a.soulState.lubuTurn=id===1203&&c.round===c.a.soulState.lubuRound;},beforeCrit(c){if(c.a.soulState.lubuFull)c.forceCrit=true;},afterAttack(c){if(!c.a.soulState.lubuFull&&c.a.hp>0)c.heal(c.a,c.dealt*multiple,'吕布非满体吸血');},beforeUse(c){c.a.soulState.lubuBuffThis=id===1241?(c.a.soulState.lubuUses??0)>0:!!c.a.soulState.lubuTurn;if(id===1241&&c.m.kind!=='item'&&c.a.soulState.lubuBuffThis)c.a.soulState.lubuUses--;},beforeDamage(c){if(c.a.soulState.lubuBuffThis)c.modifier*=2;},combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&c.a.hp<c.a.stats.maxHp/3&&!st.lubuSwept){st.lubuSwept=true;c.clearAilments(c.a);c.clearNegative(c.a);if(id===1241)st.lubuUses=3;else st.lubuRound=c.round+1;}}}};

function hoderLow(c){if(c.a.hp>0&&c.a.hp<c.a.stats.maxHp/2&&c.t.hp>0&&!c.ailment(c.t,'害怕',c.a))healthRules.drainPercent(c,c.t.stats.maxHp/3,'霍德尔未控吸取');}
registry[1204]={name:'混沌暗王霍德尔',sourceHash:'40bde35e',deferred:['击败拥有黑暗之种的对手令对方下一只出场随机2个技能PP归零'],traits:{},hooks:{combatEnd(c){if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'reflect',2,{});else hoderLow(c);},death(c){if(c.t.hp>0&&c.t.soulState.darkSeed)c.ailment(c.t,'害怕',c.a);}}};
registry[1834]={name:'混沌暗王霍德尔·觉醒',sourceHash:'3a44f47c',deferred:['击败对手按晦暗之根给对方下一只出场精灵随机技能PP归零；晦暗之因/根下场保留和场下吸取PP'],traits:{},hooks:{roundStart(c){if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'霍德尔害怕反弹',2,{});},beforeAilment(c){if(c.on(c.a,'霍德尔害怕反弹')){c.blocked=true;if(!c.reflected&&c.t!==c.a&&c.t.hp>0)c.ailment(c.t,'害怕',c.a,false,true);}},combatEnd:hoderLow,afterHit(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0&&(c.a.soulState.darkRoots??0)>0)c.hurt(c.t,80*c.a.soulState.darkRoots,'晦暗之根层数追加','true');},death(c){if(c.t.hp<=0)return;c.ailment(c.t,'害怕',c.a);const n=c.t.soulState.darkCause?.level??0,pool=c.t.moves.slice();for(let i=0;i<n;i++){if(pool.length)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;if(c.random()<.2)c.ailment(c.t,'诅咒',c.a);}}}};

for(const [id,hash,def]of [[1208,'759c6257',1],[1367,'50638b6e',2]])registry[id]={name:id===1208?'屠戮·毁灭魔神':'屠戮·毁灭魔神·强化',sourceHash:hash,traits:{},hooks:{roundStart(c){c.a.soulState.slaughterIncomingRound=0;c.a.soulState.slaughterFallback=false;},beforeIncomingAttack(c){const st=c.a.soulState;if(st.slaughterIncomingRound!==c.round){st.slaughterIncomingRound=c.round;st.slaughterReduced=c.random()<.5;st.slaughterFallback=!st.slaughterReduced;}if(st.slaughterReduced)c.reduction=1-(1-c.reduction)*.5;},combatEnd(c){if(c.a.hp>0&&c.a.soulState.slaughterFallback){c.a.soulState.slaughterFallback=false;c.heal(c.a,c.a.stats.maxHp/3,'毁灭未减伤回复');c.stage(c.a,def,['def','spd']);}},afterHit(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.a.stats.maxHp/2)healthRules.drainPercent(c,c.t.stats.maxHp/3,'毁灭低体吸取');else c.hurt(c.t,c.a.stats.maxHp/3,'毁灭高体追加','percent');}}};

for(const [id,hash]of [[1218,'7188823c'],[1730,'c3689ff3']])registry[id]={name:id===1218?'枫眠':'枫眠·觉醒',sourceHash:hash,traits:{},hooks:{roundStart(c){const had=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.mapleCrit=!had;if(had&&c.clearBoost(c.t)&&!c.ailment(c.t,'烧伤',c.a)&&id===1730)c.clear(c.t);},beforeCrit(c){if(c.a.soulState.mapleCrit)c.forceCrit=true;},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0||![c.a,c.t].some(f=>Object.values(f.ailments).some(end=>end>=c.round)))return;const ppImmune=registry[c.t.soulId]?.traits?.ppReductionImmune;if(!c.on(c.t,'PP保护')&&!c.on(c.t,'免疫PP削减')&&!(typeof ppImmune==='function'?ppImmune(c.t):ppImmune))for(const m of c.t.moves)c.t.pp[m]=Math.max(0,c.t.pp[m]-2);if(id===1730)c.heal(c.a,300,'枫眠异常战阶回复'); }}};

registry[1229]={name:'辛',sourceHash:'2f9a892d',deferred:['之后每次再次登场当回合使用技能削减80点对手体力上限，等待换宠再登场；当前首次100点已实现'],traits:{skillPriority:f=>f.soulState.wildLow?1:0},hooks:{roundStart(c){const st=c.a.soulState;if(!st.wildEntered){st.wildEntered=true;st.wildEntryRound=c.round;}st.wildHigh=c.a.hp>c.t.hp;st.wildLow=c.a.hp<c.t.hp;st.wildLowRound=st.wildLow?c.round:0;},beforeUse(c){if(c.m.kind!=='item'&&c.a.soulState.wildEntryRound===c.round&&c.t.hp>0)c.reduceMaxHp(c.t,100,'辛首次登场');},receivedAttack(c){if(c.a.soulState.wildHigh&&c.t.hp>0)c.ailment(c.t,'害怕',c.a);}}};


registry[1235]={name:'鳄',sourceHash:'c06eb8ae',traits:{entryMaxHp:200,skillPriority:f=>f.soulState.crocAttackChain?1:0},hooks:{choiceLocked(c){c.a.soulState.crocAttackChain=c.m.kind!=='status'&&c.m.kind!=='item'&&c.a.soulState.crocLastType==='attack';},beforeUse(c){if(c.a.soulState.crocAttackChain&&c.t.hp>0){const pool=c.t.moves;if(pool.length)c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}if(c.m.kind!=='item'){const chain=c.m.kind==='status'&&c.a.soulState.crocLastType==='status',base=Math.abs(c.t.stats.maxHp-c.a.stats.maxHp),amount=base*(chain?2:1);if(c.t.hp>0)c.hurt(c.t,amount,'蛮荒差值百分比追加','percent');if(chain)c.heal(c.a,amount*.5,'蛮荒连续属性理论回复');}},afterUse(c){if(c.m.kind!=='item')c.a.soulState.crocLastType=c.m.kind==='status'?'status':'attack';}}};

for(const [id,hash,reduction,bonus]of [[1243,'4946c8eb',.25,1],[1368,'262ce263',.30,1.2]])registry[id]={name:id===1243?'炽魂':'炽魂·强化',sourceHash:hash,traits:{attackReduction:f=>f.soulState.evilReducedRound===f.soulState.currentRound?reduction:0},hooks:{roundStart(c){c.a.soulState.currentRound=c.round;c.a.soulState.evilBurnSnapshot=c.t.ailments['烧伤']>=c.round;},beforeDamage(c){if(c.a.soulState.evilBurnSnapshot)c.modifier*=1+bonus;},afterHit(c){if(c.m.kind!=='status'&&!c.a.soulState.evilBurnSnapshot&&c.t.hp>0)c.ailment(c.t,'烧伤',c.a);},afterUse(c){c.timed(c.t,'技能禁疗',1,{});if(c.a.side===c.first){c.a.soulState.evilReducedRound=c.round;c.timed(c.a,'固定百分比减伤',1,{fraction:reduction});}else c.timed(c.a,'id984',1,{amount:1},c.round+1);}}};

for(const [id,hash]of [[1245,'33086155'],[2030,'20d9251']])registry[id]={name:id===1245?'辰坤':'辰坤·强化',sourceHash:hash,deferred:['后续再次登场触发护盾（原版限第二次），等待真实换宠流程；当前首次登场已实现'],traits:{attackReduction:f=>f.soulState.chenAttackReduction??0,fixedReduction:f=>f.soulState.chenFixedReduction??0},hooks:{battleStart(c){c.addShield(c.a,Math.floor(c.a.stats.maxHp/3),'chen-entry');},roundStart(c){const a=c.a,st=a.soulState,reborn=!!st.chenReborn;if(id===2030&&c.round===1&&c.shieldSourceValue(a,'chen-entry')>0){if(!c.ailment(c.t,'星赎',a,false,false,3))c.ailment(a,'砥砺',a,false,false,3);}const abnormal=f=>Object.values(f.ailments).some(end=>end>=c.round),own=abnormal(a),other=abnormal(c.t),bad=own||(reborn&&other),good=!own||(reborn&&!other),dual=a.stats.def+a.stats.spd,multiple=id===1245?.4:reborn?3/5:5/10;st.chenAttackReduction=bad?Math.min(1,multiple*dual/a.stats.maxHp):0;st.chenFixedReduction=id===1245&&bad?Math.min(1,multiple*a.stats.maxHp/dual):0;st.chenOtherReduction=id===2030&&bad?Math.min(1,multiple*a.stats.maxHp/dual):0;st.chenAbnormalRound=bad?c.round:0;if(good){let n=a.stats.maxHp/(reborn?2:3);if(id===2030)n+=c.missingPP(c.t)*c.t.stats.maxHp/(reborn?50:100);const grant=Math.floor(n);a.suitState.barrier=Math.max(a.suitState.barrier,grant);st.chenBarrierRound=c.round;st.chenBarrierAmount=grant;}},beforeHealthDamage(c){if(c.type==='attack'&&(c.damageReductionIgnore??0)===0&&(c.a.soulState.chenAttackReduction??0)>=1)c.amount=0;},beforeIncomingDamage(c){if(id===2030&&['fixed','percent'].includes(c.type))c.amount*=1-(c.a.soulState.chenOtherReduction??0)*((c.damageReductionIgnore??0)>=1?0:1);},death(c){const a=c.a,st=a.soulState;if(id!==2030||st.chenReborn||c.shieldSourceValue(a,'chen-entry')<=0)return;st.chenReborn=true;st.chenRebornThisDamage=true;for(const k of ['maxHp','atk','spa','def','spd','spe'])a.stats[k]=Math.max(1,Math.floor(a.stats[k]/2));a.hp=a.stats.maxHp;c.restorePP(a,999);c.emit('辰坤消耗六项面板能力值50%重生，回复至新上限并回满PP，辰星石不再触发。');},combatEnd(c){const st=c.a.soulState;if(id===1245&&st.chenBarrierRound===c.round&&c.a.suitState.barrier===0)c.heal(c.a,c.a.stats.maxHp/3,'辰坤护罩消失');if(id===2030&&!st.chenReborn&&!st.chenShieldPPRestored&&c.shieldSourceValue(c.a,'chen-entry')===0){st.chenShieldPPRestored=true;c.restorePP(c.a,999);}if(id===2030&&st.chenAbnormalRound===c.round&&c.t.hp>0&&!c.ailment(c.t,'星赎',c.a))st.chenNextStone=true;},afterAttack(c){if(id===2030&&c.a.soulState.chenNextStone&&c.t.hp>0){delete c.a.soulState.chenNextStone;c.ailment(c.t,'石化',c.a);}},damageTaken(c){const st=c.a.soulState;if(st.chenRebornThisDamage){delete st.chenRebornThisDamage;return;}if(id!==2030||c.type!=='true'||c.a.hp<=0||st.chenBarrierRound!==c.round)return;c.a.suitState.barrier=Math.max(c.a.suitState.barrier,st.chenBarrierAmount??0);let changed=false;for(const k of Object.keys(c.t.stages))if(c.t.stages[k]>0){c.t.stages[k]*=-1;changed=true;}if(changed)c.ailment(c.t,'砥砺',c.a);}}};

registry[1246]={name:'启灵元神',sourceHash:'4faedf27',deferred:['神殇：放逐对方存活不在场精灵，按存活队伍数量决定范围和上限','神印：对手主动切换登场附加1层上限3层的神圣印记，登场首战阶按1/8、1/6、1/4受真伤，下场保留','神谕：己方不在场且低于半体精灵免受削减体力','神照：己方其他首发精灵获得启灵元神最大体力30%护盾；当前自己作为首发的30%盾已实现'],traits:{ailmentImmune:f=>f.soulState.originHigh,weaknessImmune:f=>f.soulState.originHigh},hooks:{battleStart(c){c.addShield(c.a,Math.floor(c.a.stats.maxHp*.3),'origin-first-entry');},roundStart(c){c.a.soulState.originHigh=c.a.hp>c.a.stats.maxHp/2;if(c.a.hp<c.a.stats.maxHp/2)c.addShield(c.a,Math.floor(c.a.stats.maxHp*.3),'origin-low:'+c.round);}}};

registry[1253]={name:'狂怒雷电',sourceHash:'b5b94b07',deferred:['后续再次登场首次攻击致命一击概率50%，并保留真实后续登场附加描述；首次100%分支已实现'],traits:{},hooks:{roundStart(c){c.a.soulState.chaosGloryHigh=c.a.hp>c.a.stats.maxHp/2;c.a.soulState.chaosGloryLow=c.a.hp<c.a.stats.maxHp/2;},beforeUse(c){c.a.soulState.chaosGloryFirstAttack=c.m.kind!=='status'&&c.m.kind!=='item'&&!c.a.soulState.chaosGlorySpent;},beforeCrit(c){if(c.a.soulState.chaosGloryFirstAttack)c.forceCrit=true;},beforeDamage(c){if(c.a.soulState.chaosGloryHigh)c.modifier*=c.a.side===c.first?2:1.5;},afterAttack(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.soulState.chaosGloryFirstAttack)c.hurt(c.t,(c.settledDamage??c.dealt)*.5,'狂怒雷电首次攻击追加','percent');if(c.t.hp>0&&c.a.soulState.chaosGloryLow)c.hurt(c.t,(c.a.stats.maxHp-c.a.hp)*(c.a.side===c.first?1:.5),'狂怒雷电低体追加','percent');},afterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'){c.a.soulState.chaosGlorySpent=true;c.a.soulState.chaosGloryFirstAttack=false;}}}};

registry[1257]={name:'无上万魔',sourceHash:'d2637fa8',traits:{immuneAilments:['害怕'],dodgeChance:f=>{const e=f.effects['无上万魔失败闪避'],r=f.soulState.demonCurrentRound;return e&&e.start<=r&&e.end>=r?1:0;}},hooks:{roundStart(c){c.a.soulState.demonIncomingRound=0;c.a.soulState.demonCurrentRound=c.round;},beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.demonFearChance=c.a.hp/c.a.stats.maxHp;},beforeIncomingAttack(c){const st=c.a.soulState;if(st.demonIncomingRound!==c.round){st.demonIncomingRound=c.round;st.demonIncomingImmune=c.random()<(st.demonCarry&&c.crit?1:.5);}else if(st.demonCarry&&c.crit)st.demonIncomingImmune=true;if(st.demonIncomingImmune){c.timed(c.a,'攻击免疫反弹',1,{fraction:st.demonCarry?0:.5});const e=c.a.effects['无上万魔失败闪避'];if(e?.start===c.round+1)delete c.a.effects['无上万魔失败闪避'];}else c.timed(c.a,'无上万魔失败闪避',1,{chance:100},c.round+1);},afterAttack(c){if(c.a.hp<=0||c.t.hp<=0)return;if(!(c.random()<(c.a.soulState.demonFearChance??0)&&c.ailment(c.t,'害怕',c.a))){c.heal(c.a,c.a.stats.maxHp/3,'无上万魔害怕未触发');c.timed(c.a,'id984',1,{amount:1},c.round+1);}}}};

registry[1258]={name:'御象蓄力',sourceHash:'79155698',deferred:['不在场时每回合蓄力+1至9层，切换下场蓄力和短暂免异常状态保留，等待队伍/场下/换宠事件；已有层数在场增伤消费、当前首次登场>=6免异常及死亡清零已实现'],traits:{attackMultiplier:f=>1+.3*Math.max(0,Math.min(9,f.soulState.elephantCharge??0))},hooks:{roundStart(c){const st=c.a.soulState;if(!st.elephantEntered){st.elephantEntered=true;if((st.elephantCharge??0)>=6)c.timed(c.a,'免异常',1,{});}},choiceLocked(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.timed(c.a,'御象忽略双防强化',1,{});},beforeUse(c){c.a.soulState.elephantConsume=c.m.kind!=='status'&&c.m.kind!=='item'&&(c.a.soulState.elephantCharge??0)>0;},beforeDamage(c){if(c.on(c.a,'御象忽略双防强化'))c.ignoreDefenseBoost=true;},afterAttack(c){if(c.a.hp>0&&(c.settledDamage??c.dealt)>0&&(c.settledDamage??c.dealt)<300)c.timed(c.a,'id984',1,{amount:1},c.round+1);},afterUse(c){const st=c.a.soulState;if(!st.elephantConsume)return;st.elephantConsume=false;st.elephantCharge=Math.max(0,(st.elephantCharge??0)-1);st.elephantConsumed={round:c.round,amount:1};if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/4,'御象蓄力附加','percent');},death(c){c.a.soulState.elephantCharge=0;}}};

registry[1260]={name:'神圣雷电',sourceHash:'e31fa57c',deferred:['后续再次登场神圣雷电首次攻击效果概率50%；初次100%分支已实现'],traits:{},hooks:{beforeUse(c){c.a.soulState.holyFirstThis=c.m.kind!=='status'&&c.m.kind!=='item'&&!c.a.soulState.holyFirstSpent;},beforeDamage(c){if(c.a.soulState.holyFirstThis)c.ignoreImmunity=true;if(c.on(c.a,'圣光次回合增伤'))c.modifier*=1+c.a.effects['圣光次回合增伤'].bonus;},afterAttack(c){if(c.a.soulState.holyFirstThis&&c.a.hp>0&&c.t.hp>0)c.ailment(c.t,'麻痹',c.a);},afterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'){c.a.soulState.holyFirstSpent=true;c.a.soulState.holyFirstThis=false;}},combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp<c.a.stats.maxHp/2&&c.t.hp>0){if(!c.ailment(c.t,'麻痹',c.a))c.clear(c.t);}else if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'圣光次回合增伤',1,{bonus:(50+Math.floor(c.random()*51))/100},c.round+1);}}};
registry[2121]={name:'圣光格劳瑞·觉醒',sourceHash:'33a5fd64',deferred:['后续再次登场再次获得神圣之霆并按已有层数给下一只当前对手赋予状态；首次神圣之霆、荣光之裁及异常条件视同已按用户确认实现'],traits:{},hooks:{battleStart(c){const st=c.a.soulState;st.holyEntered=true;st.holyThunder=Math.min(6,(st.holyThunder??0)+1+(st.holyThunderGainBonus??0));st.holyAttackPending=st.holyThunder;st.holyStatusPending=st.holyThunder;st.holyUnusedPending=true;c.t.soulState.holyVerdict=Math.min(3,(c.t.soulState.holyVerdict??0)+st.holyThunder);},choiceLocked(c){const st=c.a.soulState;if(c.opponentMove.kind==='status'&&st.holyStatusPending>0){st.holyStatusPending--;c.ailment(c.t,'麻痹',c.a,false,false,1);}},opponentBeforeUse(c){const st=c.a.soulState;if(c.m.kind==='status'||c.m.kind==='item'||!(st.holyAttackPending>0))return;st.holyAttackPending--;const duration=Object.values(c.t.ailments).filter(end=>end>=c.round).reduce((n,end)=>n+end-c.round+1,0)*3;c.clearAilments(c.t);if(duration>0)c.ailment(c.t,'麻痹',c.a,false,false,duration);},beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.holyThunderAtUse=c.a.soulState.holyThunder??0;},afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState,n=st.holyThunderAtUse??st.holyThunder??0;delete st.holyThunderAtUse;if(n<6)st.holyThunder=Math.max(0,(st.holyThunder??0)-n);if(c.t.hp>0)for(let i=0;i<n;i++){if(c.ailment(c.t,'麻痹',c.a))st.holyThunderGainBonus=(st.holyThunderGainBonus??0)+1;else c.t.soulState.holyVerdict=Math.min(3,(c.t.soulState.holyVerdict??0)+1);}if(st.holyThunderKillGain){st.holyThunder=Math.min(6,(st.holyThunder??0)+st.holyThunderKillGain);delete st.holyThunderKillGain;}},combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;if(c.a.hp>c.a.stats.maxHp/2){c.a.counts.nextAttackBoost=1;st.nextAttackBoostFraction=.5;}else if(c.a.hp<c.a.stats.maxHp/2&&c.t.hp>0)c.ailment(c.t,'麻痹',c.a);if(c.t.soulState.holyParalysisImmuneRound===c.round||st.holyParalysisReceivedRound===c.round)st.holyCleanseRound=c.round;},afterRoundEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;if(st.holyUnusedPending&&(!c.used[c.t.side]||c.selectedMove(c.t).kind==='item')){st.holyUnusedPending=false;c.timed(c.t,'圣光攻击先制上限',1,{},c.round+1);}if(st.holyCleanseRound===c.round){delete st.holyCleanseRound;c.clearAilments(c.a);c.clear(c.t);c.clearBoost(c.t);st.noAilmentLastEnd=!Object.values(c.a.ailments).some(end=>end>c.round);}}}};

for(const [id,hash]of [[1286,'d67f5c4c'],[1540,'2577d58f']])registry[id]={name:id===1286?'海洋庇护':'海洋庇护·强化',sourceHash:hash,traits:{},hooks:{roundStart(c){c.a.soulState.oceanWrathEligible=id===1540||c.a.hp>c.t.hp;c.a.soulState.oceanAttackTaken=0;},attackDamageTaken(c){if(c.a.soulState.oceanWrathEligible)c.a.soulState.oceanAttackTaken+=(c.settledDamage??c.dealt);},combatEnd(c){if(c.a.hp<=0)return;const low=c.a.hp<c.a.stats.maxHp/2,n=(200+Math.floor(c.random()*101))*(low?2:1);if(c.t.hp>0){if(id===1540)healthRules.drainFixed(c,n,'强化海洋庇护吸取');else{c.hurt(c.t,n,'海洋庇护附伤','fixed');c.heal(c.a,n,'海洋庇护名义等量回复');}}const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<3;i++)c.stage(c.a,low?2:1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);if(c.a.soulState.oceanWrathEligible&&c.a.soulState.oceanAttackTaken>300&&c.a.soulState.oceanShieldGrantRound!==c.round){c.a.soulState.oceanShieldGrantRound=c.round;c.addShield(c.a,300,'ocean-wrath');}}}};

registry[1288]={name:'六界御神',sourceHash:'41a5664e',traits:{skillPriority:f=>f.soulState.sixRealmTimeRound===f.soulState.sixRealmRound?1:0,ailmentImmune:f=>f.soulState.sixRealmBoosted===true,attackMultiplier:f=>f.soulState.sixRealmBoosted?1.5:1},hooks:{roundStart(c){c.a.soulState.sixRealmRound=c.round;c.a.soulState.sixRealmBoosted=Object.values(c.a.stages).some(n=>n>0);},beforeHealthDamage(c){if(c.type==='attack'&&!c.ignoreImmunity&&c.on(c.a,'天玄大伤免疫')&&c.amount>400){c.immune=true;c.amount=0;}},combatEnd(c){if(c.a.hp<=0)return;if(!c.a.soulState.sixRealmBoosted){c.stage(c.a,1);c.timed(c.a,'id984',1,{amount:2},c.round+1);}const chosen=Math.floor(c.random()*6);c.a.soulState.sixRealmLast=chosen;if(chosen===0){c.addShield(c.a,200,'soul:1288:earth');c.a.suitState.barrier+=200;}if(chosen===1&&c.t.hp>0){c.hurt(c.t,200,'瀚海秘法','fixed');c.heal(c.a,200,'瀚海秘法名义等量回复');}if(chosen===2&&c.t.hp>0&&!c.ppReductionBlocked(c.t)){const pool=c.t.moves;c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}if(chosen===3)c.timed(c.a,'必定暴击',1,{},c.round+1);if(chosen===4)c.timed(c.a,'天玄大伤免疫',1,{},c.round+1);if(chosen===5){c.a.soulState.sixRealmTimeRound=c.round+1;c.timed(c.a,'时空秘法先制',1,{amount:1},c.round+1);}}}};

for(const [id,hash,step]of [[1292,'d1c9bfa1',10],[1541,'d127cdf7',20]])registry[id]={name:'天玄啸风'+(id===1541?'·强化':''),sourceHash:hash,deferred:['切换下场后重置叠加的攻击先制；当前在场高体逐次+1最高3已实现'],traits:{attackPriority:f=>f.soulState.skyWindHigh?(f.soulState.skyWindPriority??0):0},hooks:{roundStart(c){const st=c.a.soulState;st.skyWindChance??=40;st.skyWindHigh=c.a.hp>c.t.hp;if(st.skyWindHigh){c.stage(c.a,1);st.skyWindPriority=Math.min(3,(st.skyWindPriority??0)+1);}},beforeDamage(c){if(c.a.side===c.first&&c.random()<(c.a.soulState.skyWindChance??40)/100){c.modifier*=2;c.a.soulState.skyWindChance=Math.min(100,(c.a.soulState.skyWindChance??40)+step);}}}};

for(const [id,hash,base,cap]of [[1298,'cc7f642',20,35],[1542,'f6068bf6',25,40]])registry[id]={name:'群星逆转'+(id===1542?'·强化':''),sourceHash:hash,traits:{},hooks:{roundStart(c){if(c.on(c.a,'幻境次回合减攻'))c.timed(c.a,'幻境本回合减攻',1,{fraction:c.a.effects['幻境次回合减攻'].fraction});},beforeHealthDamage(c){const st=c.a.soulState;if(!st.illusionReverseUsed&&['fixed','percent'].includes(c.type)&&c.amount>0&&c.amount>=c.a.hp){const n=c.amount;st.illusionReverseUsed=true;st.illusionReverseRound=c.round;c.immune=true;c.amount=0;c.heal(c.a,n*1.5,'群星逆转转化');c.timed(c.a,'必定暴击',3,{},c.round+1);}},afterAttack(c){if(c.a.hp>0&&c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp*(c.a.soulState.illusionAttackPercent??base)/100,'幻境命中吸取');},afterHit(c){if(c.m.kind==='status'&&c.a.hp>0)c.timed(c.a,'幻境次回合减攻',1,{fraction:(c.a.soulState.illusionStatusPercent??base)/100},c.round+1);},afterUse(c){const st=c.a.soulState;if(c.m.kind==='status')st.illusionStatusPercent=Math.min(cap,(st.illusionStatusPercent??base)+5);else if(c.m.kind!=='item')st.illusionAttackPercent=Math.min(cap,(st.illusionAttackPercent??base)+5);}}};

for(const [id,hash,limit]of [[1299,'e638f9f6',1],[1543,'f512012e',2]])registry[id]={name:'时空跃迁'+(limit===2?'·强化':''),sourceHash:hash,traits:{skillPriority:f=>f.soulState.spacetimeLow?1:0,dodgeChance:f=>{const e=f.effects['时空跃迁闪避'],r=f.soulState.spacetimeRound;return e&&e.start<=r&&e.end>=r?1:0;}},hooks:{roundStart(c){const st=c.a.soulState;st.spacetimeRound=c.round;st.spacetimeHigh=c.a.hp>c.a.stats.maxHp/2;st.spacetimeLow=c.a.hp<c.a.stats.maxHp/2;if(st.spacetimeHigh&&c.t.hp>0&&!c.ppReductionBlocked(c.t)){const pool=c.t.moves;c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}else if(st.spacetimeLow&&c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'时空低体吸取');},beforeCrit(c){if(c.a.soulState.spacetimeHigh)c.forceCrit=true;},beforeHealthDamage(c){const st=c.a.soulState;if(c.type==='attack'&&!c.ignoreImmunity&&c.amount>0&&c.amount>=c.a.hp&&(st.spacetimeJumps??0)<limit){st.spacetimeJumps=(st.spacetimeJumps??0)+1;st.spacetimeJumpRound=c.round;c.immune=true;c.amount=0;c.clearAilments(c.a);const previous=c.a.effects?.['时空跃迁闪避'],start=previous&&previous.start<=c.round&&previous.end>=c.round?previous.start:c.round+1;c.timed(c.a,'时空跃迁闪避',c.round+4-start,{},start);}}}};

for(const [id,hash,priority,step]of [[1305,'7b9734fd',1,20],[1493,'472a21c',2,30]])registry[id]={name:'魏武孤梦'+(id===1493?'·强化':''),sourceHash:hash,traits:{},hooks:{
roundStart(c){const st=c.a.soulState;st.weiDream=conditionStatusRules.conditionPresent(c.a,c.round);st.weiDreamSleep=c.a.ailments['睡眠']>=c.round;for(const side of ['Incoming','Outgoing']){st['wei'+side+'Round']=0;st['wei'+side+'Fail']=false;st['wei'+side+'Success']=false;st['wei'+side+'Chance']=st['wei'+side+'BonusRound']===c.round?Math.min(100,50+(st['wei'+side+'RawStep']??0)):50;}},
beforeIncomingAttack(c){const st=c.a.soulState;if(st.weiIncomingRound!==c.round){st.weiIncomingRound=c.round;st.weiIncomingSuccess=c.random()<st.weiIncomingChance/100;st.weiIncomingFail=!st.weiIncomingSuccess;if(st.weiIncomingSuccess){st.weiIncomingRawStep=0;st.weiIncomingBonusRound=0;c.timed(c.t,'id984',1,{amount:-priority},c.round+1);}}if(st.weiIncomingSuccess)c.reduction=1-(1-c.reduction)*.5;},
beforeDamage(c){const st=c.a.soulState;if(st.weiOutgoingRound!==c.round){st.weiOutgoingRound=c.round;st.weiOutgoingSuccess=c.random()<st.weiOutgoingChance/100;st.weiOutgoingFail=!st.weiOutgoingSuccess;if(st.weiOutgoingSuccess){st.weiOutgoingRawStep=0;st.weiOutgoingBonusRound=0;c.timed(c.a,'id984',1,{amount:priority},c.round+1);}}if(st.weiOutgoingSuccess)c.modifier*=2;},
opponentAfterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.weiEnemyAttackRound=c.round;},
combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;if(st.weiDream&&st.weiEnemyAttackRound===c.round&&c.t.hp>0){if(c.random()<(st.weiDreamSleep?.2:.1))c.hurt(c.t,c.t.hp,'孤梦噬魂直接死亡','true',true);else c.stage(c.t,-1);}if(st.weiIncomingFail&&st.weiIncomingCompensatedRound!==c.round){st.weiIncomingCompensatedRound=c.round;c.heal(c.a,c.a.stats.maxHp/3,'魏武未减伤回复');st.weiIncomingBonusRound=c.round+1;st.weiIncomingRawStep=Math.min(50,Math.max(0,st.weiIncomingChance-50)+step);}if(st.weiOutgoingFail&&st.weiOutgoingCompensatedRound!==c.round){st.weiOutgoingCompensatedRound=c.round;if(c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'魏武未增伤惩罚','percent');st.weiOutgoingBonusRound=c.round+1;st.weiOutgoingRawStep=Math.min(50,Math.max(0,st.weiOutgoingChance-50)+step);}}}};

registry[1314]={name:'苍穹之望·艾希丝',sourceHash:'67893b42',traits:{},hooks:{roundStart(c){if((c.a.soulState.erosionWindWindow??c.round)<c.round)delete c.a.soulState.erosionWindWindow;if(c.a.hp>c.t.hp){c.stage(c.a,1);c.timed(c.t,'技能禁疗',1,{});}},opponentBeforeUse(c){if(c.m.kind==='status'&&c.t.ailments['冻伤']>=c.round){c.t.soulState.skillInvalidRound=c.round;c.a.soulState.erosionWindWindow=c.round+1;}},combatEnd(c){if(c.a.hp>0&&c.a.hp<c.t.hp){c.timed(c.a,'id984',1,{amount:1},c.round+1);c.timed(c.a,'id913',1,{bonus:.5},c.round+1);}}}};


for(const [id,hash,value,count]of [[1320,'d775d7d8',60,1],[1544,'ab685132',70,2]])registry[id]={name:'混沌界神'+(id===1544?'·强化':''),sourceHash:hash,traits:{},hooks:{roundStart(c){c.a.soulState.chaosOwnBoostKinds=Object.values(c.a.stages).filter(n=>n>0).length;c.a.soulState.chaosFoeWeakKinds=Object.values(c.t.stages).filter(n=>n<0).length;},afterUse(c){if(c.a.hp<=0||c.t.hp<=0)return;c.steal(c.a,c.t,'魂印');if(c.a.hp<=0||c.t.hp<=0)return;const positive=Object.entries(c.a.stages).filter(([,n])=>n>0);let failed=positive.length===0;for(const [key,n]of positive){const before=c.t.stages[key];c.stage(c.t,-n,[key]);if(c.t.stages[key]===before)failed=true;}if(failed&&c.a.hp>0&&c.t.hp>0){healthRules.drainPercent(c,c.t.stats.maxHp/3,'混沌弱化免疫百分比吸取');if(c.a.hp<=0)return;if(!c.ppReductionBlocked(c.t)){const pool=c.t.moves.slice();for(let i=0;i<count&&pool.length;i++)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;}}},combatEnd(c){if(c.a.hp<=0)return;const heal=(c.a.soulState.chaosOwnBoostKinds??0)*value,hurt=(c.a.soulState.chaosFoeWeakKinds??0)*value;if(heal>0)c.heal(c.a,heal,'混沌回合初强化回复');if(hurt>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,hurt,'混沌回合初弱化附伤','fixed');}}};

registry[1340]={name:'沉睡之眼',sourceHash:'26e0fa1f',traits:{attackPriority:f=>f.soulState.eyeBoosted?0:1,attackReduction:f=>f.soulState.eyeBoosted?.5:0},hooks:{roundStart(c){c.a.soulState.eyeBoosted=Object.values(c.a.stages).some(n=>n>0);},beforeUse(c){delete c.a.soulState.eyeQuarterPending;},beforeDamage(c){if(c.on(c.a,'魔眼下回合攻击增伤'))c.modifier*=1+c.a.effects['魔眼下回合攻击增伤'].bonus;if(!c.a.soulState.eyeBoosted&&!c.a.soulState.eyeQuarterPending)c.a.soulState.eyeQuarterPending={round:c.round,move:c.m.id,amount:c.t.hp/4};},afterAttack(c){const e=c.a.soulState.eyeQuarterPending;delete c.a.soulState.eyeQuarterPending;if(e?.round===c.round&&e.move===c.m.id&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,e.amount,'沉睡之眼当前体力百分比追加','percent');},combatEnd(c){if(c.a.hp<=0)return;const negative=Object.keys(c.a.stages).filter(k=>c.a.stages[k]<0);if(negative.length){if(c.canRemoveNegative?.(c.a)!==false){for(const k of negative)c.a.stages[k]*=-1;c.timed(c.a,'reflect',1,{},c.round+1);}}else c.timed(c.a,'魔眼下回合攻击增伤',1,{bonus:(50+Math.floor(c.random()*51))/100},c.round+1);}}};
registry[1342]={name:'魔剪·塞泽丝',sourceHash:'7f131a6',traits:{},hooks:{roundStart(c){const missing=Math.floor((c.a.stats.maxHp-c.a.hp)*100/c.a.stats.maxHp);c.a.soulState.scissorBonus=missing*(c.a.hp<c.a.stats.maxHp/2?2:1)/100;},beforeDamage(c){c.modifier*=1+(c.a.soulState.scissorBonus??0);},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0||!c.outgoingAttackEvents().length)return;const damage=c.outgoingSettledDamage('attack'),threshold=c.t.stats.maxHp/3;if(damage<threshold)c.hurt(c.t,threshold,'魔剪低伤百分比追加','percent');else if(damage>threshold){const restored=c.heal(c.a,c.a.stats.maxHp/3,'魔剪高伤回复')??0;if(restored>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,restored,'魔剪实际回复等量百分比追加','percent');}}}};

registry[1345]={name:'风之子·岚',sourceHash:'958c4a4d',traits:{weaknessImmune:true,noPPConsumption:true,attackReduction:f=>f.soulState.windChildReduce?.5:0,skillPriority:f=>f.soulState.windChildPriority?1:0},hooks:{roundStart(c){c.a.soulState.windChildReduce=c.on(c.a,'风神次回合减伤');c.a.soulState.windChildPriority=c.on(c.a,'风神次回合先制');},afterUse(c){if(c.m.kind==='item')return;const kind=c.m.kind==='status'?'status':'attack',st=c.a.soulState,chain=st.windChildLastKind===kind;st.windChildLastKind=kind;if(!chain||c.a.hp<=0)return;if(kind==='status'){c.timed(c.a,'风神次回合减伤',1,{fraction:.5},c.round+1);c.timed(c.a,'风神次回合先制',1,{amount:1},c.round+1);}else if(c.t.hp>0&&!(c.random()<.5&&c.ailment(c.t,'睡眠',c.a))){c.clear(c.t);healthRules.drainFixed(c,300,'风神连续攻击吸取');}}}};

registry[1346]={name:'科罗丽娜',sourceHash:'2f595cea',traits:{skillPriority:f=>f.soulState.corolinaLow?2:0,attackReduction:f=>f.soulState.corolinaLow?.5:0},hooks:{roundStart(c){const st=c.a.soulState;st.corolinaLow=c.a.hp<c.t.hp;st.corolinaHigh=c.a.hp>c.t.hp;st.corolinaDrainDenominator=c.a.hp<c.a.stats.maxHp/3?2:3;st.corolinaBonus=st.corolinaHigh?(50+Math.floor(c.random()*51))/100:0;},beforeDamage(c){c.modifier*=1+(c.a.soulState.corolinaBonus??0);},attackDamageTaken(c){if((c.settledDamage??c.dealt)>0&&c.a.hp>0&&c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/(c.a.soulState.corolinaDrainDenominator??3),'科罗丽娜受攻吸取');}}};

// Q022-024 and Q093 are user confirmations; retained API hashes are unchanged.
for(const [id,hash]of [[1356,'481aa018'],[2051,'bc438361']])registry[id]={
 name:id===1356?'洪荒·列奥尼达':'洪荒·列奥尼达·觉醒',sourceHash:hash,
 traits:{skillPriority:f=>f.soulState.leonSame?1:0},hooks:{
 roundStart(c){const st=c.a.soulState;
  st.leonRoundAbnormal=conditionStatusRules.conditionPresent(c.a,c.round)||conditionStatusRules.conditionPresent(c.t,c.round);
  st.leonShieldHeal=!st.leonRoundAbnormal;st.leonOriginalRandomDue=0;st.leonFailedRandom=0;
  if(st.leonRoundAbnormal){c.addShield(c.a,c.a.stats.maxHp/3,'leon:'+id+':'+c.round);
   if(id===1356){st.leonOriginalRandomDue++;if(!c.ppReductionBlocked(c.t)){const pool=c.t.moves.filter(k=>c.t.pp[k]>0);if(pool.length)c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;}}
   else c.addCosmic(c.t,1);
  }
  if(id===2051){st.leonOldDialUses??=st.leonOldDialLayers??0;
   if((st.leonOldDialLayers??0)>0&&c.missingPP(c.a)>=12-(st.leonOldDialThresholdReduction??0)){
    c.heal(c.a,c.a.stats.maxHp,'旧日之晷回满体力');c.restorePP(c.a,Infinity);st.leonOldDialUses++;
   }
  }
 },
 choiceLocked(c){const st=c.a.soulState;st.leonSame=c.m.kind!=='item'&&!!st.leonLastKind&&st.leonLastKind===c.m.kind;
  st.leonDifferent=c.m.kind!=='item'&&!!st.leonLastKind&&st.leonLastKind!==c.m.kind;st.leonAttackBonus=0;
 },
 opponentBeforeUse(c){if(id!==2051||c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState;if(!(st.leonOldDialUses>0))return;
  const before=c.t.soulState.ppBeforeUse??c.t.pp;
  if(c.t.moves.some(key=>before[key]===1&&c.moveKind(key)===c.m.kind)){st.leonOldDialUses--;c.t.soulState.skillInvalidRound=c.round;c.emit('旧日之晷按扣除前PP判定，消耗1次无效机会。');}
 },
 beforeUse(c){if(c.a.soulState.leonSame)c.a.soulState.leonAttackBonus=id===2051?.5:(50+Math.floor(c.random()*51))/100;},
 beforeDamage(c){c.modifier*=1+(c.a.soulState.leonAttackBonus??0);},
 afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState,had=!!st.leonLastKind,different=had&&st.leonLastKind!==c.m.kind;
  st.leonLastKind=c.m.kind;
  if(id===1356){if(had)st.leonOriginalRandomDue++;if(different)st.leonOriginalHealAfterAction=c.round;return;}
  if(!had){const old=st.leonOldDialLayers??0;st.leonOldDialLayers=Math.min(5,old+1);st.leonOldDialUses=(st.leonOldDialUses??0)+st.leonOldDialLayers-old;st.leonOldDialObtained=true;return;}
  if(different){const healed=c.heal(c.a,c.a.stats.maxHp/3,'觉醒不同类回复')??0;if(c.a.hp<=0)return;if(c.t.hp>0)c.hurt(c.t,healed,'觉醒不同类恢复量附伤','percent');if(c.a.hp<=0)return;}
  if(c.t.hp>0&&!c.randomNonRestrictedPvpAilments(1,2470).some(x=>x.applied))healthRules.drainPercent(c,c.t.stats.maxHp/3,'觉醒随机异常未触发吸取');
 },
 actionEnd(c){if(id!==1356||c.m.kind==='item'||!c.usedSkillThisRound(c.a)||c.a.hp<=0)return;const st=c.a.soulState;
  if(st.leonOriginalHealAfterAction===c.round){delete st.leonOriginalHealAfterAction;const healed=c.heal(c.a,c.a.stats.maxHp/3,'原版不同类流程末回复')??0;if(c.a.hp<=0)return;if(c.t.hp>0)c.hurt(c.t,healed,'原版不同类恢复量附伤','percent');if(c.a.hp<=0)return;}
  const count=st.leonOriginalRandomDue??0;st.leonOriginalRandomDue=0;
  for(let i=0;i<count&&c.a.hp>0&&c.t.hp>0;i++)if(!c.randomAllPvpAilments(1,1715).some(x=>x.applied))st.leonFailedRandom++;
 },
 combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;
  if(id===1356){for(let i=0;i<(st.leonFailedRandom??0)&&c.t.hp>0;i++)healthRules.drainPercent(c,c.t.stats.maxHp/3,'原版随机异常未触发战阶吸取');return;}
  if(st.leonShieldHeal)c.heal(c.a,c.shieldValue(c.a)+c.shieldValue(c.t),'觉醒无异常双方护盾回复');
  if(!st.leonOldDialObtained&&c.t.hp>0&&!c.ailment(c.t,'衰弱',c.a,false,false,1))c.addCosmic(c.t,3);
 }
}};

for(const [id,hash,denominator]of [[1362,'56119652',3],[1787,'18701ac4',2]])registry[id]={name:id===1362?'愈灵·克丽娅':'愈灵·克丽娅·强化',sourceHash:hash,
 traits:{attackReduction:f=>f.soulState.cleriaReduce?.5:0},hooks:{
 roundStart(c){c.a.soulState.cleriaStartHp=c.a.hp;c.a.soulState.cleriaReduce=c.on(c.a,'克丽娅次回合减攻伤')||c.on(c.a,'克丽娅重生减攻伤');},
 combatEnd(c){if(c.a.hp<=0)return;const before=c.a.hp,low=before<c.a.stats.maxHp/2;if(before<c.a.soulState.cleriaStartHp)c.heal(c.a,c.a.stats.maxHp/denominator,'克丽娅战阶回复');if(low)c.timed(c.a,'克丽娅次回合减攻伤',1,{fraction:.5},c.round+1);},
 death(c){const st=c.a.soulState;if(st.cleriaRebirthAttempted||st.vanished)return;st.cleriaRebirthAttempted=true;if(c.random()>=.5)return;
  c.a.hp=c.a.stats.maxHp;c.restorePP(c.a,Infinity);c.timed(c.a,'克丽娅重生减攻伤',3,{fraction:.5});st.cleriaReduce=true;c.emit('克丽娅唯一重生判定成功，恢复满体力与全部PP，原有状态保留。');
 }
}};


registry[1376]={name:'月冕',sourceHash:'f8f409d4',traits:{attackPriority:f=>f.soulState.moonAttackPriority?1:0},hooks:{roundStart(c){c.a.soulState.moonStartHp=c.a.hp;c.a.soulState.moonAttackPriority=c.on(c.a,'月冕次回合攻击先制');},afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0)return;const chance=c.statusProbability(50),applied=c.t.hp>0&&c.random()<chance/100&&c.ailment(c.t,'冰封',c.a,false,false,null,{probabilityPercent:50});if(applied){c.timed(c.a,'必定暴击',1,{},c.round+1);return;}const loss=c.hurt(c.t,c.t.stats.maxHp*.3,'月冕冰封未触发固定','fixed');if(c.a.hp<c.a.stats.maxHp*.3)c.heal(c.a,loss,'月冕低体实际HP损失等量回复');},combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp>c.a.soulState.moonStartHp)c.stage(c.a,1);else if(c.a.hp<c.a.soulState.moonStartHp)c.timed(c.a,'月冕次回合攻击先制',1,{amount:1},c.round+1);}}};
registry[2110]={name:'月冕·血月寒月',sourceHash:'d9891927',traits:{skillPriority:f=>f.soulState.moonAllPriority?1:0},hooks:{battleStart(c){c.addMoon('血月',null);c.addMoon('寒月',null);},roundStart(c){c.a.soulState.moonStartHp=c.a.hp;c.a.soulState.moonAllPriority=c.on(c.a,'月冕次回合全技能先制');},afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0)return;const has=name=>c.celestials.some(x=>x.name===name&&x.side===c.a.side&&x.start<=c.round&&x.end>=c.round);if(has('血月'))healthRules.drainPercent(c,c.t.stats.maxHp*.3,'月冕血月吸取');if(has('寒月')&&c.t.hp>0)c.ailment(c.t,'冰封',c.a,false,false,null,{probabilityPercent:100});},beforeIncomingAttack(c){if(!c.celestials.some(x=>x.name==='血月'&&x.side===c.a.side&&x.start<=c.round&&x.end>=c.round)&&c.priorityValueOf(c.t)>0)c.reduction=1-(1-c.reduction)*.5;},
opponentPriority(c){if(c.m.kind!=='status'||c.priority<=0||c.celestials.some(x=>x.name==='寒月'&&x.side===c.a.side&&x.start<=c.round&&x.end>=c.round))return;const base=c.m.priority??0;c.priority+=Math.ceil(base/2)-base;},combatEnd(c){if(c.a.hp<=0)return;const start=c.a.soulState.moonStartHp;if(c.a.hp>start){c.clearAilments(c.a);c.stage(c.a,1);}else if(c.a.hp<start){if(c.t.hp>0)c.ailment(c.t,'渐冻',c.a,false,false,1,{probabilityPercent:100});c.timed(c.a,'月冕次回合全技能先制',1,{amount:1},c.round+1);}else c.restorePP(c.a,1);}}};


for(const [id,hash]of [[1389,'d8add77a'],[1690,'f16fe6ef']])registry[id]={name:id===1389?'逆魂·佩特菲德':'逆魂·佩特菲德·强化',sourceHash:hash,traits:{},hooks:{battleStart(c){if(id===1690){c.a.stages.def=Math.min(6,c.a.stages.def+1);c.a.stages.spd=Math.min(6,c.a.stages.spd+1);}},boostRemoved(c){if(c.a.hp<=0||!['clear','steal'].includes(c.method))return;if(!(c.t.hp>0&&c.ailment(c.t,'石化',c.a,false,false,null,{probabilityPercent:100}))){c.clear(c.t);c.addShield(c.a,c.a.stats.maxHp/3,'petefield-'+id+'-'+c.round);}},afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0)return;const shield=c.shieldValue(c.a)>0;if(id===1690&&shield){healthRules.drainPercent(c,c.shieldValue(c.a)*.7,'逆魂护盾70%吸取');if(c.a.hp<=0)return;if(c.t.hp>0){const chance=c.statusProbability(70);if(!(c.random()<chance/100&&c.ailment(c.t,'石化',c.a,false,false,null,{probabilityPercent:70})))c.stage(c.a,1);}}const n=Object.values(c.a.stages).reduce((sum,n)=>sum+Math.max(0,n),0)*(id===1690||shield?30:25);if(c.t.hp>0)c.hurt(c.t,n,'逆魂强化段数固定','fixed');if(id===1389&&shield&&c.a.hp>0&&c.t.hp>0){const chance=c.statusProbability(50);if(!(c.random()<chance/100&&c.ailment(c.t,'石化',c.a,false,false,null,{probabilityPercent:50})))c.stage(c.a,1);}},combatEnd(c){if(id===1690&&c.a.hp>0&&!Object.values(c.a.stages).some(n=>n>0))c.clearAilments(c.a);}}};

registry[1394]={name:'弑序神罗',sourceHash:'770c601d',deferred:['首次跨对方其他存活精灵散布及存活数高于3时15枚；当前在场5枚已按039逐枚随机实现，仅真实其他精灵与总存活数15枚分支延期','出战背包中对方击败己方其他精灵时创建裂痕；裂痕当前伤害/先制已实现','真实换宠再次登场首回合重触发及下场裂痕保留'],traits:{ailmentImmune:f=>f.soulState.luoOpeningRound===1,weaknessImmune:f=>f.soulState.luoOpeningRound===1,skillPriority:f=>f.soulState.luoPriority?1:0},hooks:{battleStart(c){c.a.soulState.luoOpeningRound=1;c.scatterFatalMarks(c.t,5,'soul:1394');},beforeRoundStart(c){c.a.soulState.luoOpeningRound=c.round;if(c.round===1){const n=c.fatalCracks(c.t);if(n>=1)c.timed(c.a,'致命攻击免疫',1,{});if(n>=2)c.timed(c.a,'攻击伤害免疫',1,{});if(n>=3)c.timed(c.t,'attackBlock',1,{});}},roundStart(c){c.a.soulState.luoStartHp=c.a.hp;c.a.soulState.luoPriority=c.on(c.a,'弑序次回合先制');},combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp>c.a.soulState.luoStartHp)c.timed(c.a,'protect',2,{});else if(c.a.hp<c.a.soulState.luoStartHp)c.timed(c.a,'弑序次回合先制',1,{},c.round+1);if(c.a.hp<c.a.stats.maxHp/2)c.timed(c.a,'固定百分比免疫',1,{},c.round+1);}}};

registry[1406]={name:'堕魂·格特鲁德',sourceHash:'ef0a34b6',deferred:['真实背包其他精灵阵亡数量的10%增伤及全阵亡时25%最大体力真实附伤'],traits:{skillPriority:f=>f.soulState.fallenDragonAttackChoice&&f.soulState.fallenDragonPriorityRound===f.soulState.currentRound?1:0},hooks:{choiceLocked(c){c.a.soulState.fallenDragonAttackChoice=c.m.kind!=='status'&&c.m.kind!=='item';},roundStart(c){c.a.soulState.currentRound=c.round;c.a.soulState.fallenDragonAilmentRound=conditionStatusRules.conditionPresent(c.t,c.round)?c.round:0;},beforeDamage(c){c.modifier*=1.25;if(c.a.soulState.fallenDragonAilmentRound===c.round)c.affinity=Math.max(1,c.affinity);else{const success=c.random()<c.statusProbability(50)/100&&c.ailment(c.t,'害怕',c.a,false,false,null,{probabilityPercent:50});if(!success){const fraction=(15+Math.floor(c.random()*16))/100;c.defenseIgnoreFraction=fraction;c.a.soulState.fallenDragonLastIgnore={round:c.round,move:c.m.id,fraction};c.a.soulState.fallenDragonPriorityRound=c.round+1;}}}}};

function bedEntry(c,cap){for(const k of ['机械领域','次元领域'])delete c.a.effects[k];const name=c.t.hp>500?'机械领域':'次元领域';c.a.effects[name]={start:c.round??1,end:(c.round??1)+2,fraction:cap};}
for(const [id,hash,pp,cap,priority]of [[1408,'d5009596',1,.6,1],[1580,'d7a83ed',2,.4,2]])registry[id]={name:id===1408?'贝狄薇尔':'贝狄薇尔·强化',sourceHash:hash,deferred:['真实主动切换登场时对手所选技能PP消耗5/20倍；真实再次登场重新选择3回合领域；自身2229原地触发登场效果已实现'],traits:{skillPriority:f=>{const e=f.effects['领域次回合全技能先制'];return e&&e.start<=f.soulState.currentRound&&e.end>=f.soulState.currentRound?e.amount:0;}},hooks:{battleStart(c){c.a.soulState.currentRound=1;bedEntry(c,cap);},beforeRoundStart(c){c.a.soulState.currentRound=c.round;},entryTriggered(c){bedEntry(c,cap);},beforeUse(c){if(c.m.kind==='item'||c.ppReductionBlocked(c.t))return;if(c.a.side===c.first)for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-pp);else if(c.t.moves.length)c.t.pp[c.t.moves[Math.floor(c.random()*c.t.moves.length)]]=0;},combatEnd(c){if(c.a.hp<=0)return;const mech=c.on(c.a,'机械领域'),dim=c.on(c.a,'次元领域');if(!mech&&!dim)return;const e=c.a.effects[mech?'机械领域':'次元领域'];if((c.a.roundSettledAttackDamage??0)>0){if(mech)c.timed(c.a,'领域次回合全技能先制',1,{amount:priority},c.round+1);else if(c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'次元领域吸取','次元领域吸取');}if(c.a.hp>0&&e.end===c.round){c.addShield(c.a,500,'bed-domain-expiry');c.a.suitState.barrier+=500;}}}};

registry[1409]={name:'镇世·乔特鲁德',sourceHash:'bc8d9057',deferred:['其他真实存活精灵每只增加100盾；其他精灵全部阵亡的25%固定/百分比减伤；当前基础250盾已实现'],traits:{},hooks:{battleStart(c){c.addShield(c.a,250,'town-dragon-entry');},roundStart(c){c.a.soulState.dragonAbnormalSnapshotRound=conditionStatusRules.conditionPresent(c.a,c.round)?c.round:0;c.a.soulState.dragonReactionRound=0;},attackDamageTaken(c){if(c.a.soulState.dragonAbnormalSnapshotRound===c.round||c.a.hp<=0||c.t.hp<=0||!(c.settledDamage>0)||c.a.soulState.dragonReactionRound===c.round)return;c.a.soulState.dragonReactionRound=c.round;if(c.random()<.5)c.hurt(c.t,150+Math.floor(c.random()*151),'镇世受击反击','fixed');else{const n=1+Math.floor(c.random()*2);c.a.soulState.dragonFailurePPAmount=n;if(!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-n);}},combatEnd(c){if(c.a.hp>0&&c.a.soulState.dragonAbnormalSnapshotRound===c.round)c.heal(c.a,c.a.stats.maxHp/3,'镇世异常回合回复');}}};
function townAwakenedAbsorb(c,start){const out=c.absorbPP(c.a,c.t,1);if(out.slots.some(x=>x.deducted>0&&c.t.pp[x.donorId]===0))c.timed(c.t,'attackBlock',1,{},start);}
registry[2028]={name:'镇世·乔特鲁德·觉醒',sourceHash:'a5405e3b',deferred:['真实额外龙精灵金祖之龍、玄源之㡣加入队伍并参与存亡/龙系计数、死亡代价、代保命/斩杀、臣服或疲惫回合异常免疫、死亡后的非真减伤/体力上限；当前自身存活及本身龙系的一份100盾/10%攻击贡献独立实现'],traits:{attackMultiplier:1.1},hooks:{battleStart(c){c.addShield(c.a,100,'town-awakened-current-self');},roundStart(c){if(conditionStatusRules.conditionPresent(c.a,c.round))c.a.soulState.dragonAilmentReceivedRound=c.round;},attackDamageTaken(c){if(!(c.settledDamage>0)||c.a.hp<=0||c.t.hp<=0||c.a.soulState.dragonAilmentReceivedRound===c.round)return;c.hurt(c.t,c.a.stats.maxHp*.2,'镇世觉醒未受异常反击','percent');if(c.a.hp>0&&c.t.hp>0)townAwakenedAbsorb(c,c.round);},roundEnd(c){if(c.a.hp>0&&c.a.soulState.dragonAilmentReceivedRound===c.round){c.heal(c.a,c.a.stats.maxHp*.2,'镇世受异常回合回复');if(c.a.hp>0&&c.t.hp>0)townAwakenedAbsorb(c,c.round+1);}}}};

function sakuraRescue(c){if(!c.a.soulState.sakuraRescuePending||c.a.hp<=0)return;delete c.a.soulState.sakuraRescuePending;c.clearAilments(c.a);c.clearNegative(c.a);c.heal(c.a,(c.opponent??c.t).hp,'寒晶之护保留1HP后回复');}
registry[1416]={name:'露姆莉亚',sourceHash:'6334471d',traits:{skillPriority:f=>f.soulState.lumAttackChoice&&f.soulState.lumPriorityRound===f.soulState.currentRound?1:0},hooks:{roundStart(c){c.a.soulState.currentRound=c.round;},choiceLocked(c){c.a.soulState.lumAttackChoice=c.m.kind!=='status'&&c.m.kind!=='item';},beforeDamage(c){c.power*=1+Math.min(1.2,(c.a.soulState.lumAttackChain??0)*.3);},afterUse(c){if(c.a.hp>0&&c.m.kind!=='status'&&c.m.kind!=='item'&&c.successful)c.a.soulState.lumAttackChain=(c.a.soulState.lumAttackChain??0)+1;},combatEnd(c){if(c.a.hp<=0||!c.usedSkillThisRound(c.a)||c.selectedMove(c.a).kind==='status')return;const n=c.outgoingAttackEvents().filter(e=>e.targetSide===c.t.side).reduce((v,e)=>v+e.settledDamage,0);if(n>0&&n<300)c.timed(c.a,'必定暴击',1,{},c.round+1);else if(n>300){if(c.random()<.5){if(c.t.hp>0)c.hurt(c.t,panel(c,c.a,'atk')*.5,'露姆莉亚回合高伤固定追加','fixed');}else c.a.soulState.lumPriorityRound=c.round+1;}}}};
registry[1411]={name:'凌雪·樱',sourceHash:'97027026',traits:{},hooks:{afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const prev=c.a.soulState.sakuraLastRawKind,now=c.m.kind;c.a.soulState.sakuraLastRawKind=now;if(prev===undefined)return;if(prev===now){const n=200+Math.floor(c.random()*201);if(c.a.hp<c.a.stats.maxHp/2)healthRules.drainFixed(c,n,'凌雪同类吸取','凌雪同类回复');else if(c.t.hp>0)c.hurt(c.t,n,'凌雪同类追加','fixed');}else if(!(c.random()<c.statusProbability(50)/100&&c.ailment(c.t,'冰封',c.a,false,false,null,{probabilityPercent:50})))c.timed(c.a,'id984',1,{amount:1},c.round+1);},beforeHealthLoss(c){const t=c.opponent??c.t;if(c.a.hp>0&&c.amount>=c.a.hp&&t.hp<=300){c.hpFloor=Math.max(c.hpFloor??0,1);c.a.soulState.sakuraRescuePending=true;}},damageTaken:sakuraRescue,healthLost:sakuraRescue,death(c){const t=c.opponent??c.t;if(t.hp<=300&&c.a.stats.maxHp>0){c.a.hp=1;c.clearAilments(c.a);c.clearNegative(c.a);c.heal(c.a,t.hp,'寒晶之护直接死亡保留1HP后回复');}}}};

for(const [id,hash]of [[1422,'ce698ab3'],[1762,'7af0cb07']])registry[id]={name:'阿莱克托'+(id===1762?'·强化':''),sourceHash:hash,traits:{},hooks:{
roundStart(c){const st=c.a.soulState;st.alectoBonus=st.alectoTakenRound===c.round-1&&st.alectoOpponentId===c.t.id?Math.floor(st.alectoTaken*100/c.a.stats.maxHp)*.02:0;st.alectoCritRolls=[];delete st.alectoAttackCrit;delete st.alectoCompensationPending;},
attackDamageTaken(c){const st=c.a.soulState,n=c.settledDamage??c.dealt;if(n<=0)return;if(st.alectoTakenRound!==c.round||st.alectoOpponentId!==c.t.id){st.alectoTakenRound=c.round;st.alectoOpponentId=c.t.id;st.alectoTaken=0;}st.alectoTaken+=n;},
beforeDamage(c){c.modifier*=1+(c.a.soulState.alectoBonus??0);},
beforeCrit(c){if(c.a.side!==c.first)return;if(id===1762){c.forceCrit=true;return;}const st=c.a.soulState;if(!st.alectoCritRolls.length)st.alectoCritRolls.push(c.random()<.5);const success=st.alectoCritRolls[0];c.forceCrit=!!c.forceCrit||success;c.chance=0;},
afterAttack(c){c.a.soulState.alectoAttackCrit=(c.a.soulState.alectoAttackCrit??false)||!!c.crit;},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(c.a.side!==c.first){c.timed(c.a,'id984',1,{amount:1},c.round+1);return;}if(id===1762||st.alectoAttackCrit===false)c.stage(c.a,2,['atk','spe']);}
}};

registry[1427]={name:'锢灵·舞',sourceHash:'53ebc960',traits:{},hooks:{
roundStart(c){c.a.soulState.danceHigh=c.a.hp>c.a.stats.maxHp/2;c.a.soulState.danceLow=c.a.hp<c.a.stats.maxHp/2;},
afterUse(c){if(c.a.hp<=0||c.t.hp<=0||!c.a.soulState.danceHigh||c.m.kind==='status'||c.m.kind==='item')return;c.markStatusEffect?.(['束缚']);if(!c.ailment(c.t,'束缚',c.a,false,false,null,{probabilityPercent:100}))c.hurt(c.t,c.t.stats.maxHp/3,'锢灵高体束缚失败','percent');},
combatEnd(c){if(c.a.hp<=0)return;const n=c.a.roundSettledAttackDamage??0;if(n>0&&c.t.hp>0){c.a.soulState.danceTakenRound=c.round;if(n<400)c.timed(c.t,'statusBlock',1,{},c.round+1);else if(n>400)c.timed(c.t,'attackBlock',1,{},c.round+1);}if(!c.a.soulState.danceLow)return;const healed=c.heal(c.a,c.a.stats.maxHp/3,'锢灵低体战阶回复')??0;if(c.a.hp>0&&c.t.hp>0&&healed>0)c.hurt(c.t,healed,'锢灵战阶等量追加','percent');}
}};

function campbellInitialWeak(c){if(c.stage)return c.stage(c.t,-1);const f=c.t,r=c.round??1,on=k=>f.effects[k]&&f.effects[k].start<=r&&f.effects[k].end>=r,raw=registry[f.soulId]?.traits?.weaknessImmune,immune=typeof raw==='function'?raw(f):raw;if(f.hp<=0||on('免弱')||immune)return;if(f.soulState.dragonScales?.blue){f.soulState.dragonScaleTriggered='blue';return;}for(const k of ['atk','def','spa','spd','spe','acc'])f.stages[k]=Math.max(-6,f.stages[k]-1);}
function campbellEntry(c){const st=c.a.soulState,round=c.round??1,full=c.a.hp===c.a.stats.maxHp,key='campbell-entry:'+round+':'+((st.campbellEntryCount??0)+1);st.campbellEntryCount=(st.campbellEntryCount??0)+1;c.addShield(c.a,300,key);c.a.suitState.barrier+=300;st.campbellEntries??=[];st.campbellEntries.push({round,source:key,barrierGone:false});if(full)campbellInitialWeak(c);else if(c.heal)c.heal(c.a,c.a.stats.maxHp/3,'坎贝尔登场回复');else st.campbellInitialHealPending=true;}
registry[1433]={name:'撼地之力·坎贝尔',sourceHash:'996b2094',traits:{},hooks:{battleStart:campbellEntry,entryTriggered:campbellEntry,beforeRoundStart(c){if(c.a.soulState.campbellInitialHealPending){delete c.a.soulState.campbellInitialHealPending;c.heal(c.a,c.a.stats.maxHp/3,'坎贝尔登场回复');}},
opponentBeforeUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item'||c.m.power<=120)return;c.timed(c.a,'必定暴击',2,{});c.markStatusEffect?.(['烧伤']);if(!c.ailment(c.t,'烧伤',c.a,false,false,null,{probabilityPercent:100})&&!c.ppReductionBlocked(c.t))c.t.pp[c.m.id]=Math.max(0,c.t.pp[c.m.id]-1);},
combatEnd(c){const entries=c.a.soulState.campbellEntries??[];for(const e of entries.filter(e=>e.round===c.round)){if(c.shieldSourceValue(c.a,e.source)===0||e.barrierGone||c.a.suitState.barrier===0)c.ailment(c.t,'焚烬',c.a,false,false,null,{probabilityPercent:100});}c.a.soulState.campbellEntries=entries.filter(e=>e.round>c.round);}
}};

// Initialize the already-confirmed first-round immunity before any entrant's opening debuff.
{const old=registry[1394];registry[1394]={...old,hooks:{...old.hooks,beforeBattleStart(c){c.a.soulState.luoOpeningRound=1;}}};}

for(const [id,hash,chance]of [[1434,'39a21510',20],[1703,'a82db158',30]])registry[id]={name:id===1434?'拉克希斯':'拉克希斯·强化',sourceHash:hash,traits:{},hooks:{
afterUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;let applied=false;for(const name of ['中毒','烧伤','冻伤','麻痹','睡眠','害怕'])if(c.random()<c.statusProbability(chance)/100){if(c.ailment(c.t,name,c.a,false,false,null,{probabilityPercent:chance}))applied=true;}if(!applied&&c.a.hp>0){c.stage(c.a,1);c.selfRandomAilmentsFrom(1,['中毒','烧伤','冻伤'],'soul:'+id);}},
combatEnd(c){if(c.a.hp>0&&conditionStatusRules.conditionPresent(c.a,c.round))c.a.soulState.lachesisCleanseRound=c.round+1;},
beforeRoundStart(c){if(c.a.soulState.lachesisCleanseRound!==c.round)return;delete c.a.soulState.lachesisCleanseRound;c.clearAilments(c.a);c.timed(c.a,'必定暴击',1,{});}
}};
function ankaCombatEnd(c,upgraded){if(c.a.hp<=0||c.t.hp<=0)return;if(c.t.ailments['烧伤']>=c.round){if(upgraded){for(const k of ['atk','def','spa','spd','spe','acc'])c.stage(c.t,Math.min(-1,-1-c.t.stages[k]),[k]);}else c.stage(c.t,-1);c.timed(c.a,'id984',1,{amount:1},c.round+1);return;}if(c.clear(c.t))return;const before=c.a.hp,healed=c.heal(c.a,c.a.stats.maxHp/3,'安卡战阶回复')??0;if(c.a.hp>0&&c.t.hp>0&&healed>0)c.hurt(c.t,healed,'安卡战阶实际回复追加','percent');if(upgraded&&c.a.hp>0&&c.t.hp>0&&before+healed<c.a.stats.maxHp&&!c.ppReductionBlocked(c.t)){const fifth=c.t.moves.find(k=>c.isFifthSkill(k));if(fifth!==undefined){const base=Math.max(0,c.t.pp[fifth]-1);c.t.pp[fifth]=base;for(const k of c.t.moves)if(k!==fifth)c.t.pp[k]=Math.max(0,Math.min(c.t.pp[k]-1,base));}}}
registry[1438]={name:'红莲之誓·安卡',sourceHash:'eec535e4',traits:{},hooks:{boostRemoved(c){if(c.a.hp<=0)return;if(!c.ailment(c.opponent,'焚烬',c.a,false,false,null,{probabilityPercent:100}))c.a.soulState.ankaHeartPending={round:c.round+1};},choiceLocked(c){const p=c.a.soulState.ankaHeartPending;if(p&&p.round<=c.round){delete c.a.soulState.ankaHeartPending;if(p.round===c.round&&c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.ankaHeartThis={round:c.round,move:c.m.id};}},combatEnd(c){ankaCombatEnd(c,false);}}};
registry[1992]={name:'红莲之誓·安卡·强化',sourceHash:'d91b07c',traits:{},hooks:{battleStart(c){c.a.soulState.ankaSun=true;},entryTriggered(c){c.a.soulState.ankaSun=true;},boostRemoved(c){if(c.a.hp<=0)return;const burn=c.ailment(c.opponent,'烧伤',c.a,false,false,null,{probabilityPercent:100}),burnup=c.ailment(c.opponent,'焚烬',c.a,false,false,null,{probabilityPercent:100});if(!burn||!burnup)c.a.soulState.ankaSun=true;},combatEnd(c){ankaCombatEnd(c,true);}}};
function terminalShieldEvent(c,active){const st=c.a.soulState;st.terminalShieldActive=active;const e=st.terminalStrike;if(e?.remaining>0){e.remaining--;st.terminalStrikeQueue??=[];st.terminalStrikeQueue.push({round:c.round??1,amount:e.amount});}}
function terminalShieldEntry(c){c.a.soulState.terminalEntryRound=c.round??1;terminalShieldEvent(c,true);}
registry[1441]={name:'核爆·机械塔克林',sourceHash:'c11dc5f8',traits:{},hooks:{battleStart:terminalShieldEntry,entryTriggered:terminalShieldEntry,
beforeAilment(c){if(!c.a.soulState.terminalShieldActive)return;c.blocked=true;terminalShieldEvent(c,false);c.a.soulState.terminalConsumedRound=c.round;c.refreshShield(c.a,300,'soul:1441:terminal');},
beforeUse(c){if(!c.m.fifth)return;const st=c.a.soulState;st.terminalFifth={round:c.round,move:c.m.id,activeBefore:!!st.terminalShieldActive};if(!st.terminalShieldActive)terminalShieldEvent(c,true);},
beforeCrit(c){const e=c.a.soulState.terminalFifth;if(c.m.fifth&&e?.round===c.round&&e.move===c.m.id&&e.activeBefore)c.forceCrit=true;},
beforeDamage(c){if(c.a.soulState.terminalShieldActive)c.modifier*=1.5;},
afterHit(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.soulState.terminalShieldActive||c.a.hp<=0||c.t.hp<=0)return;c.hurt(c.t,(c.effective(c.a,'def')+c.effective(c.a,'spd'))*.5,'终阶源盾未激活双防追加','fixed');},
combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&st.terminalEntryRound===c.round&&st.terminalConsumedRound===c.round&&!st.terminalShieldActive)terminalShieldEvent(c,true);},
roundEnd(c){const st=c.a.soulState,queue=st.terminalStrikeQueue??[];st.terminalStrikeQueue=queue.filter(x=>x.round>c.round);for(const e of queue.filter(x=>x.round===c.round))if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,e.amount,'终阶源盾变化回合结束追加','fixed');}
}};
for(const [id,hash,chance]of [[1453,'c7d7a05c',10],[1704,'2da17aea',16]])registry[id]={name:id===1453?'克洛托':'克洛托·强化',sourceHash:hash,traits:{},hooks:{
roundStart(c){const count=Object.values(c.a.stages).filter(n=>n>0).length;c.a.soulState.clothoRound={round:c.round,count,chance:count*chance,none:count===0};},
beforeCrit(c){if(c.a.soulState.clothoRound?.none)c.forceCrit=true;},
afterHit(c){if(c.m.kind==='status'||c.m.kind==='item'||!c.a.soulState.clothoRound?.none)return;c.stage(c.a,-1);c.stage(c.t,-1);},
afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const e=c.a.soulState.clothoRound;if(e?.count>0&&c.random()<c.statusProbability(e.chance)/100)c.ailment(c.t,'麻痹',c.a,false,false,null,{probabilityPercent:e.chance});},
combatEnd(c){if(c.a.hp<=0)return;const negative=Object.keys(c.a.stages).filter(k=>c.a.stages[k]<0);if(negative.length){if(c.canRemoveNegative(c.a)){for(const k of negative)c.a.stages[k]*=-1;}}else if(id===1704)c.timed(c.a,'id984',1,{amount:1},c.round+1);}
}};
registry[1454]={name:'寒吟·龙裳',sourceHash:'f420cae1',traits:{minimumAttackDamage:300,flatAttackReduction:300,minimumAfterReductions:true},hooks:{combatEnd(c){if(c.a.hp<=0)return;c.hurt(c.t,300,'寒吟战阶固定吸取','fixed');c.heal(c.a,300*(c.a.hp<c.a.stats.maxHp/3?2:1),'寒吟战阶理论吸取回复');}}};
registry[1457]={name:'鬼面阎罗',sourceHash:'a43f4529',traits:{attackPriority:f=>f.soulState.yanluoRound?.priority?1:0},hooks:{roundStart(c){const ks=['atk','def','spa','spd','spe','acc'],count=ks.filter(k=>c.a.stages[k]>=c.t.stages[k]).length;c.a.soulState.yanluoRound={round:c.round,count,priority:ks.reduce((n,k)=>n+Math.max(0,c.a.stages[k]),0)>=12};},beforeDamage(c){c.modifier*=1+(c.a.soulState.yanluoRound?.count??0)*.15;},afterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const n=c.a.soulState.yanluoRound?.count??0;c.hurt(c.t,n*(n>3?80:160),'鬼面回合初比较追加','fixed');},combatEnd(c){if(c.a.hp>0&&(c.a.soulState.yanluoRound?.count??6)<=3)c.stage(c.a,1);}}};
registry[1458]={name:'浩渺之源·努恩',sourceHash:'2006bca1',traits:{},hooks:{beforeRoundStart(c){const st=c.a.soulState;if(st.oceanTideNextRound<=c.round){const scheduled=st.oceanTideNextRound;delete st.oceanTideNextRound;if(scheduled===c.round&&c.selectedMove(c.a).kind!=='status'&&c.selectedMove(c.a).kind!=='item'){c.timed(c.a,'无视对手强化',1,{});st.oceanTideThis={round:c.round,origin:'soul'};}}},roundStart(c){const st=c.a.soulState,hadShield=c.shieldValue(c.a)>0;if(!hadShield){c.addShield(c.a,Math.floor(c.a.stats.maxHp/3),'soul1458');c.restorePP(c.a,1);}else{c.a.suitState.barrier=Math.floor(c.t.stats.maxHp/3);if(!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-1);}st.oceanShieldAtStart=c.shieldValue(c.a);st.oceanBarrierAtStart=c.a.suitState.barrier;delete st.oceanShieldLostRound;delete st.oceanBarrierLostRound;},allShieldsGone(c){c.a.soulState.oceanShieldLostRound=c.round;},barrierGone(c){c.a.soulState.oceanBarrierLostRound=c.round;},combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState,shieldGone=(st.oceanShieldAtStart>0||st.oceanShieldLostRound===c.round)&&c.shieldValue(c.a)===0,barrierGone=(st.oceanBarrierAtStart>0||st.oceanBarrierLostRound===c.round)&&c.a.suitState.barrier===0;if(shieldGone||barrierGone){c.a.counts.immune=(c.a.counts.immune??0)+1;st.oceanTideNextRound=c.round+1;}}}};
for(const [id,hash,chance,strong]of [[1466,'143d598e',70,false],[1761,'5413c61d',80,true]])registry[id]={name:strong?'墨纪拉·强化':'墨纪拉',sourceHash:hash,traits:{skillPriority:f=>(strong?f.soulState.mokilaAnyTimed:f.soulState.mokilaFoeTimed)?1:0,attackReduction:f=>f.soulState.mokilaReduceRound!==undefined&&f.soulState.mokilaReduceRound===f.soulState.mokilaCurrentRound?.5:0},hooks:{beforeRoundStart(c){c.a.soulState.mokilaCurrentRound=c.round;},roundStart(c){const active=f=>Object.values(f.effects).some(e=>conditionStatusRules.timedActive(e,c.round));c.a.soulState.mokilaCurrentRound=c.round;c.a.soulState.mokilaFoeTimed=active(c.t);c.a.soulState.mokilaOwnTimed=active(c.a);c.a.soulState.mokilaAnyTimed=active(c.t)||active(c.a);},afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;if(c.a.side===c.first){c.a.soulState.mokilaReduceRound=c.round;}if(!(strong?c.a.soulState.mokilaAnyTimed:c.a.soulState.mokilaOwnTimed))return;const success=c.random()<c.statusProbability(chance)/100&&c.ailment(c.t,'焚烬',c.a,false,false,null,{probabilityPercent:chance});if(!success)c.timed(c.t,'技能禁疗',2,{});},combatEnd(c){if(c.a.hp<=0||c.a.side!==c.first)return;const n=c.t.stats.maxHp/3;if(strong)healthRules.drainPercent(c,n,'墨纪拉强化先手战阶吸取','墨纪拉强化先手理论回复');else if(c.t.hp>0)c.hurt(c.t,n,'墨纪拉先手战阶百分比','percent');}}};
registry[1467]={name:'森娅',sourceHash:'f0923561',traits:{attackReduction:f=>{const r=f.soulState.senyaCurrentRound,e=f.effects['森娅溢出增益@'+r];return e&&e.start<=r&&e.end>=r?e.units/100:0;}},hooks:{beforeRoundStart(c){c.a.soulState.senyaCurrentRound=c.round;},beforeDamage(c){const key='森娅溢出增益@'+c.round;if(c.on(c.a,key))c.modifier*=1+c.a.effects[key].units*.02;},afterHit(c){if(c.a.hp>0&&c.a.side!==c.first)c.clear(c.t);},afterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;const key='森娅溢出增益@'+c.round;if(c.on(c.a,key))c.hurt(c.t,c.t.stats.maxHp*c.a.effects[key].units/100,'森娅溢出用招追加','percent');},combatEnd(c){if(c.a.hp<=0||c.a.side===c.first)return;const maxHp=c.a.stats.maxHp,requested=Math.floor(maxHp*.35*c.healingMultiplier(c.a)),healed=c.heal(c.a,maxHp*.35,'森娅后手战阶回复')??0;if(c.a.hp<=0)return;const overflow=Math.max(0,requested-healed);if(overflow===0)return;const units=overflow*100/maxHp,integer=Math.ceil(units);c.a.soulState.senyaLastOverflow={round:c.round,requested,healed,overflow,units};c.timed(c.a,'森娅溢出增益@'+(c.round+1),1,{units:integer},c.round+1);}}};
registry[1482]={name:'环·源',sourceHash:'e8fc42fa',traits:{},hooks:{afterAttack(c){if(c.a.hp<=0)return;const n=c.settledDamage??c.dealt,amount=n*.8;if(c.t.hp>0)c.hurt(c.t,amount,'归零强袭追加','percent');c.heal(c.a,amount,'归零强袭回复');if(n<300)c.timed(c.t,'statusBlock',1,{},c.round+1);else if(n>300)c.timed(c.t,'attackBlock',1,{},c.round+1);},afterUse(c){if(c.a.hp>0&&c.m.kind==='status')c.a.soulState.zeroMinePending=true;},opponentAfterUse(c){if(c.m.kind==='item')return;if(c.a.soulState.zeroMinePending){delete c.a.soulState.zeroMinePending;c.a.soulState.zeroMineTriggeredRound=c.round;}},attackDamageTaken(c){const n=c.settledDamage??c.dealt;if(c.a.hp<=0||n<=0)return;const st=c.a.soulState;if(st.zeroTakenRound!==c.round){st.zeroTakenRound=c.round;st.zeroTakenDamage=0;}st.zeroTakenDamage+=n;},combatEnd(c){const st=c.a.soulState;if(st.zeroMineTriggeredRound===c.round){delete st.zeroMineTriggeredRound;if(c.t.hp>0)c.hurt(c.t,300,'归零诡雷','fixed');}if(c.a.hp>0&&st.zeroTakenRound===c.round){const n=st.zeroTakenDamage;if(n>0&&n<300){c.restorePP(c.a,1);if(!c.ppReductionBlocked(c.t))for(const id of c.t.moves)c.t.pp[id]=Math.max(0,c.t.pp[id]-1);}else if(n>300)c.timed(c.t,'id984',1,{amount:-1},c.round+1);}}}};
registry[2139]={name:'环·源·执行者',sourceHash:'f102f34c',traits:{attackAlwaysHit:true},partial:false,unimplemented:[],hooks:{battleStart(c){setExecutors(c.a,5);},afterUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const n=c.actionAttackDamage??0,amount=n*.4;if(c.t.hp>0)c.hurt(c.t,amount,'源式崩坏真实追加','true');if(c.a.hp>0)c.heal(c.a,amount*2,'源式崩坏翻倍回复');if(c.t.hp>0)c.timed(c.t,n>300?'attackBlock':'statusBlock',2,{},c.round);},opponentAfterUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const n=c.attackDamage??0;if(n<=300)c.a.soulState.executorPPRound=c.round;else c.timed(c.t,'id984',1,{amount:-1},c.round+1);},combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(st.executorPPRound===c.round){for(const k of c.a.moves)c.restorePP({...c.a,moves:[k]},Math.floor(c.maxPP(k)*.4));delete st.executorPPRound;}if((!c.used[c.a.side]||!c.used[c.t.side])&&c.round>=(st.executorArrayNextRound??1)){setExecutors(c.a,(st.executors??0)+1);st.executorArrayCooldown=Math.min(4,(st.executorArrayCooldown??0)+1);st.executorArrayNextRound=c.round+st.executorArrayCooldown+1;}},timedEffectEnded(c){const e=c.effect;if(!e?.executorBatch||e.executorBatchConsumed)return;e.executorBatchConsumed=true;setExecutors(c.a,Math.max(0,(c.a.soulState.executors??0)-1));}}};
// An immunity declaration is copied even while its condition is false. The
// declaration is evaluated for its new holder; unrelated soul payloads (heals,
// reflection, stages, rebirth, etc.) are deliberately not acquired with it.
// This table contains only damage-immunity clauses, not ailment/weakness guards.
const immunityTraitTypes={pinkImmune:['fixed','percent'],fixedReflect:['fixed'],criticalImmune:['critical'],criticalReflectType:['critical'],attackDamageToHealing:['attack']};
const derivedImmunityTypes={391:['attack'],645:['attack'],728:['attack'],744:['physical','special'],789:['attack'],804:['attack'],1736:['attack'],1014:['attack'],1932:['attack'],1257:['attack'],1288:['attack'],1298:['fixed','percent'],1542:['fixed','percent'],1394:['critical','attack','fixed','percent'],1553:['attack','fixed','percent']};
function copiedImmunityTypes(id){const src=registry[id];return [...new Set([...(derivedImmunityTypes[id]??[]),...Object.entries(immunityTraitTypes).flatMap(([k,v])=>src?.traits?.[k]===undefined?[]:v)])];}
function executorCopyEvent(event,c){
 if(event==='roundStart'){
  setExecutors(c.a,c.a.soulState.executors??0);
  if(c.a.hp<=0||(c.a.soulState.executors??0)<=1||Number(c.t.number)===4258||[1482,2139].includes(c.t.soulId))return;
  const id=c.t.soulId??(c.t.species==='emperor'?622:null),types=copiedImmunityTypes(id);if(!types.length)return;
  const states=c.a.soulState.executorImmunityStates??(c.a.soulState.executorImmunityStates={}),st=states[id]??(states[id]={});
  c.timed(c.a,'执行者复制免疫',1,{executorSource:true,executorBatch:true,sourceSoulId:id,sourceSoulHash:registry[id]?.sourceHash??c.soulSource?.(c.t)?.hash,types,state:st});
  st.currentRound=c.round;st.startHp=c.a.hp;st.opponentStages={...c.t.stages};
  if([804,1736].includes(id))st.low=c.a.hp<c.a.stats.maxHp/3;
  if(id===728){st.sorenReady=!Object.values(c.a.stages).some(n=>n>0)&&c.random()<.5;}
  if(id===789)st.xConvert=conditionStatusRules.conditionPresent(c.a,c.round);
  if(id===1959&&st.gammaCritReady===undefined)st.gammaCritReady=true;
 }
 const e=c.a.effects['执行者复制免疫'];if(!e||!conditionStatusRules.timedActive(e,c.round))return;
 const id=e.sourceSoulId,st=e.state;
 if(event==='afterUse'&&id===744&&c.successful&&c.m.kind!=='item'){st.starKind=c.m.kind==='status'?'special':'physical';st.starRound=c.round+1;}
 if(event==='opponentBeforeUse'&&id===1553&&st.warReady&&c.m.kind!=='status'&&c.m.kind!=='item'){
  st.warReady=false;st.warUse={round:c.round,move:c.m.id,serial:c.t.soulState.skillUses?.[c.m.id]??0};
  if(c.t.soulState.ppBeforeUse?.[c.m.id]===c.maxPP(c.m.id))st.warPink=(st.warPink??0)+1;
 }
 if(event==='damageTaken'&&id===391&&(c.settledDamage??c.dealt)>200){if(!(st.ghostStart<=c.round&&st.ghostEnd>=c.round))st.ghostStart=c.round+1;st.ghostEnd=c.round+2;}
 if(event==='combatEnd'&&id===1288&&Math.floor(c.random()*6)===4)st.tianxuanRound=c.round+1;
 if(event==='combatEnd'&&id===1394&&c.a.hp<c.a.stats.maxHp/2)st.pinkRound=c.round+1;
 if(event==='combatEnd'&&[1014,1932].includes(id)&&c.a.roundAttackDamage>0)st.attackNullify=1;
 if(event==='combatEnd'&&id===1553&&conditionStatusRules.conditionPresent(c.a,c.round))st.warReady=true;
 if(event==='roundEnd'&&[956,1710].includes(id)&&Object.keys(st.opponentStages??{}).some(k=>c.t.stages[k]>st.opponentStages[k]))st.wingRound=c.round+1;
}
function executorCopiedDamageImmune(c){
 const e=c.a.effects['执行者复制免疫'];if(!e||!conditionStatusRules.timedActive(e,c.round))return false;
 const id=e.sourceSoulId,st=e.state,type=c.type,attack=type==='attack',critical=attack&&c.crit,src=registry[id];
 const view={...c.a,soulId:id,soulState:{...c.a.soulState,...st,currentRound:c.round}};
 for(const [key,types]of Object.entries(immunityTraitTypes)){
  if(!types.includes(type)&&!(critical&&types.includes('critical')))continue;
  let value=src?.traits?.[key];
  if(id===1165&&key==='criticalImmune')value=c.round===1;
  else if(id===1959&&key==='criticalImmune')value=st.gammaCritReady!==false;
  else if([956,1710].includes(id)&&key==='attackDamageToHealing')value=st.wingRound===c.round;
  else if(typeof value==='function')value=value(view);
  if(value){if(id===1959&&c.consume)st.gammaCritReady=false;return true;}
 }
 if(id===391&&attack)return st.ghostStart<=c.round&&st.ghostEnd>=c.round;
 if(id===645&&attack)return !!c.a.soulState.phoenixReborn&&(c.a.counts.attackNullify??0)>0;
 if(id===728&&attack&&st.sorenReady){if(c.consume)st.sorenReady=false;return true;}
 if(id===744&&attack)return st.starRound===c.round&&st.starKind===c.m?.kind;
 if(id===789&&attack)return st.xConvert;
 if([804,1736].includes(id)&&attack)return st.low;
 if(id===1288&&attack)return c.immunityPhase==='health'&&st.tianxuanRound===c.round&&c.amount>400;
 if([1014,1932].includes(id)&&attack){const serial=c.t.soulState.skillUses?.[c.m?.id]??0,use=st.nullifyUse;if(use?.round===c.round&&use.move===c.m?.id&&use.serial===serial)return true;if(st.attackNullify>0){if(c.consume){st.attackNullify--;st.nullifyUse={round:c.round,move:c.m?.id,serial};}return true;}return false;}
 if([1298,1542].includes(id)&&c.immunityPhase==='health'&&['fixed','percent'].includes(type)&&!st.illusionReverseUsed&&c.amount>0&&c.amount>=c.a.hp){if(c.consume)st.illusionReverseUsed=true;return true;}
 if(id===1394){const cracks=c.fatalCracks(c.t);return c.round===1&&attack&&(critical&&cracks>=1||cracks>=2)||['fixed','percent'].includes(type)&&st.pinkRound===c.round;}
 if(id===1257&&attack){if(st.demonIncomingRound!==c.round){st.demonIncomingRound=c.round;st.demonIncomingImmune=c.random()<.5;}return st.demonIncomingImmune;}
 if(id===1553){if(attack){const use=st.warUse;return !!use&&use.round===c.round&&use.move===c.m?.id&&use.serial===(c.t.soulState.skillUses?.[c.m?.id]??0);}if(['fixed','percent'].includes(type)&&st.warPink>0){if(c.consume)st.warPink--;return true;}}
 return false;
}
registry[2139].copyImmunityEvent=executorCopyEvent;
registry[2139].copiedDamageImmune=executorCopiedDamageImmune;
registry[1488]={name:'库莱姆斯',sourceHash:'ab024ebe',traits:{skillPriority:f=>f.soulState.cruelStartHigh?1:0},hooks:{roundStart(c){c.a.soulState.cruelStartHigh=c.a.hp>c.a.stats.maxHp/2;},beforeDamage(c){if(c.a.soulState.cruelStartHigh)c.modifier*=1.5;},beforeIncomingAttack(c){if(c.on(c.a,'邪龙无生次回合减攻'))c.reduction=1-(1-c.reduction)*.7;},damageTaken(c){if(c.fromSkillPhase&&['fixed','percent','true'].includes(c.type)&&(c.settledDamage??c.dealt)>0&&c.t.side!==c.a.side)c.a.soulState.cruelOtherSkillDamageRound=c.round;},attackDamageTaken(c){if((c.settledDamage??c.dealt)<=0||c.a.hp<=0)return;c.a.soulState.cruelAttackRound=c.round;const e=c.t.effects['攻击技能命中效果失效'],start=conditionStatusRules.timedActive(e,c.round)?e.start:c.round+1;c.timed(c.t,'攻击技能命中效果失效',c.round+2-start,{},start);},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0||c.a.soulState.cruelAttackRound===c.round)return;if(!(c.random()<c.statusProbability(50)/100&&c.ailment(c.t,'诅咒',c.a,false,false,null,{probabilityPercent:50})))c.timed(c.a,'邪龙无生次回合减攻',1,{},c.round+1);}}};
function tisiSameKind4270(c,old,kind){return old!==undefined&&old===kind;}
for(const [id,hash,pp,base]of [[1492,'681e1ef0',1,30],[1760,'1bd7f356',2,50]])registry[id]={name:id===1492?'提西弗涅':'提西弗涅·强化',sourceHash:hash,traits:{},hooks:{roundStart(c){const st=c.a.soulState;st.tisiFearChance=base+c.a.moves.filter(k=>c.a.pp[k]>=5).length*10;},afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState,same=tisiSameKind4270(c,st.tisiOwnKind,c.m.kind);st.tisiOwnLastRound=c.round;st.tisiOwnKind=c.m.kind;st.tisiOwnInterrupted=false;if(same){healthRules.drainPercent(c,c.t.stats.maxHp/3,'提西弗涅连续同类吸取');c.restorePP(c.a,pp);}if(c.a.hp<=0||c.t.hp<=0)return;const chance=c.statusProbability(st.tisiFearChance);if(chance>=100||chance>0&&c.random()<chance/100)c.ailment(c.t,'害怕',c.a,false,false,null,{probabilityPercent:st.tisiFearChance});},opponentAfterUse(c){if(c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0)return;const st=c.a.soulState,same=tisiSameKind4270(c,st.tisiFoeKind,c.m.kind);st.tisiFoeLastRound=c.round;st.tisiFoeKind=c.m.kind;st.tisiFoeInterrupted=false;if(same&&!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-pp);}}};
registry[1499]={name:'命运之轮·莫伊莱',sourceHash:'7e32803e',deferred:['对手主动切换后该下一只登场当回合两轮全部触发'],traits:{},hooks:{roundStart(c){if(c.a.hp<=0||c.t.hp<=0)return;const branch=c.random()<.5?1:2;c.a.soulState.moiraiHeng={round:c.round,branch};if(branch===1){c.stage(c.a,1);c.refreshShield(c.a,200,'moirai-heng');c.refreshBarrier(c.a,200,'moirai-heng');}else{if(!c.ppReductionBlocked(c.t)){const pool=c.t.moves.slice();const key=pool[Math.floor(c.random()*pool.length)];c.t.pp[key]=0;}c.timed(c.t,'技能禁疗',1,{});}},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const branch=c.random()<.5?1:2;c.a.soulState.moiraiJie={round:c.round,branch};if(branch===1){c.stage(c.t,-1);c.timed(c.t,'命运界固定粉伤易伤',1,{},c.round+1);}else{c.heal(c.a,c.a.stats.maxHp/3,'命运之轮界回复');c.timed(c.a,'id984',1,{amount:1},c.round+1);}}}};
for(const [id,hash,priority]of [[1502,'bbdeca73',1],[1705,'34cada19',2]])registry[id]={name:id===1502?'阿特洛波斯':'阿特洛波斯·强化',sourceHash:hash,traits:{skillPriority:f=>f.soulState.atroposStartBoost?priority:0},hooks:{roundStart(c){c.a.soulState.atroposStartBoost=Object.values(c.a.stages).some(n=>n>0);},beforeIncomingAttack(c){if(c.on(c.a,'阿特洛波斯次回合减攻'))c.reduction=1-(1-c.reduction)*.5;},opponentBeforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.atroposSawAttackRound=c.round;},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&c.a.soulState.atroposSawAttackRound===c.round)c.amount*=1-(id===1502?.3:.5)*((c.damageReductionIgnore??0)>=1?0:1);},opponentAfterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0)return;const n=c.attackDamage;if(n>300)c.timed(c.a,'阿特洛波斯次回合减攻',1,{},c.round+1);else if(n<300)c.a.soulState.atroposDrainRound=c.round;},combatEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.atroposDrainRound===c.round)healthRules.drainPercent(c,c.t.stats.maxHp/3,'阿特洛波斯低攻击伤害吸取');}}};
function lastWhisper1508(f){const n=f.soulState.lastWhisperLayers??0;if(!Number.isInteger(n)||n<0||n>6)throw Error('逝者亡语层数必须为0至6整数');return n;}
registry[1508]={name:'混灵·莱茵哈特',sourceHash:'a7ad3e9d',deferred:['真实历史队伍阵亡数量生成入场层数及后续入场同步','被击败时达到3层限制真实主动换宠1回合'],traits:{skillPriority:f=>lastWhisper1508(f)>=6?1:0},hooks:{battleStart(c){c.a.soulState.lastWhisperLayers=0;},orderResolved(c){if(c.a.side===c.first)c.timed(c.t,'技能禁疗',1,{});},beforeDamage(c){c.power*=1+lastWhisper1508(c.a)*.1;},attackDamageTaken(c){if((c.settledDamage??c.dealt)>0)c.a.soulState.lastWhisperAttackRound=c.round;},afterUse(c){if(c.m.kind!=='status'||c.a.hp<=0||c.t.hp<=0)return;const n=lastWhisper1508(c.a);const probability=n*10;if(n>0&&c.random()<c.statusProbability(probability)/100)c.ailment(c.t,'诅咒',c.a,false,false,null,{probabilityPercent:probability});},combatEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.a.side!==c.first&&c.a.soulState.lastWhisperAttackRound!==c.round)c.clear(c.t);},death(c){if(c.t.hp>0&&c.clearBoost(c.t))c.ailment(c.t,'石化',c.a,false,false,null,{probabilityPercent:100});}}};
function beginDragonTotem1509(c){if(c.a.soulState.dragonTotem?.active)return;c.a.soulState.dragonTotem={active:true,entryRound:c.round??1,blessings:{sage:false,might:false,dominion:false},everOpened:{sage:false,might:false,dominion:false},openedRounds:{},recordedControls:[],usedFifth:false};}
registry[1509]={name:'龙仪·机械塔克林',sourceHash:'6bf22e3',deferred:['下场后场地独立图腾继续存在2回合并作用真实队友','霸开启后对手下回合不能真实主动换宠'],traits:{maxIncomingAffinity:f=>f.soulState.dragonTotem?.active?2:0,immuneAilments:f=>f.soulState.dragonTotem?.active&&f.soulState.dragonTotem.blessings.sage?f.soulState.dragonTotem.recordedControls:[]},hooks:{battleStart:beginDragonTotem1509,entryTriggered:beginDragonTotem1509,beforeUse(c){const t=c.a.soulState.dragonTotem;if(t?.active&&(c.m.wikiId??c.m.id)===35442)t.usedFifth=true;},roundStart(c){const t=c.a.soulState.dragonTotem;if(!t?.active)return;if(t.blessings.might)c.a.suitState.barrier+=300;if(t.blessings.dominion)c.addShield(c.a,300,'dragon-totem-dominion:'+c.round);},combatEnd(c){const t=c.a.soulState.dragonTotem;if(!t?.active||c.a.hp<=0)return;const controls=Object.keys(c.a.ailments).filter(k=>c.a.ailments[k]>=c.round&&c.isControlAilment(k)),conditions={sage:controls.length>0,might:Object.values(c.a.stages).some(n=>n<0),dominion:c.a.moves.some(k=>!c.isFifthSkill(k)&&c.a.pp[k]===0)},opened=[],reopen=[];for(const kind of ['sage','might','dominion']){if(!conditions[kind]||t.blessings[kind])continue;t.blessings[kind]=true;t.everOpened[kind]=true;t.openedRounds[kind]=c.round;opened.push(kind);if(kind==='sage'){const cleared=[];for(const k of controls)if(c.clearAilment(c.a,k))cleared.push(k);const pool=cleared.slice();t.recordedControls=[];while(t.recordedControls.length<3&&pool.length)t.recordedControls.push(pool.splice(Math.floor(c.random()*pool.length),1)[0]);}if(kind==='might')c.timed(c.t,'id984',1,{amount:-1},c.round+1);}if(opened.length&&t.entryRound===c.round){t.openedAtEntry=true;t.entryOpeningRound=c.round;c.timed(c.t,'额外正向先制失效',1,{},c.round+1);}if(t.blessings.sage){c.heal(c.a,300,'贤之庇护持续回复');}if(!t.usedFifth)c.restorePP(c.a,1);}}};
registry[1510]={name:'异维·拉伯克',sourceHash:'c93ec17e',deferred:['对手主动换宠后登场目标随机PP0及自身下2次攻击必定致命'],traits:{},hooks:{afterAttack(c){if(c.crit){if(!c.ppReductionBlocked(c.t)&&c.a.hp>0&&c.t.hp>0)c.t.pp[c.t.moves[Math.floor(c.random()*c.t.moves.length)]]=0;return;}if(c.a.hp<=0)return;const amount=c.t.stats.maxHp/3;if(c.t.hp>0)c.hurt(c.t,amount,'异维非暴击追加','percent');if(c.a.hp>0&&conditionStatusRules.conditionPresent(c.t,c.round))c.heal(c.a,amount,'异维非暴击异常理论回复');}}};

registry[1528]={name:'时钟诛机',sourceHash:'1a7d16a9',traits:{skillPriority:f=>f.soulState.clockPriority??0},hooks:{roundStart(c){c.a.soulState.clockExtraCooldown=c.a.hp<c.a.stats.maxHp/2?1:0;const boosted=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.clockPriority=boosted?1:0;if(!boosted)c.stage(c.a,1,['atk','def','spa','spd','spe','acc']);},opponentBeforeUse(c){const m=c.m,id=m.wikiId??m.id,entry=c.t.soulState.clockCooldown?.[id];if(!entry||entry.end<c.round||entry.start>c.round)return;c.t.soulState.clockSkillInvalidRound=c.round;c.t.soulState.clockInvalidMoveId=id;},opponentAfterUse(c){const id=c.m.wikiId??c.m.id;if(c.m.kind==='item')return;c.t.soulState.clockCooldown??={};c.t.soulState.clockCooldown[id]={start:c.round+1,end:c.round+1+(c.a.soulState.clockExtraCooldown??0),sourceSide:c.a.side};}}};

function avalanche4318(c,enhanced){const threshold=enhanced?120:140;if(!c.m||(enhanced?c.m.power<threshold:c.m.power<=threshold)||c.a.hp<=0||c.defeatedByAttack||c.a.soulState.avalancheSeenRound===c.round)return;c.a.soulState.avalancheSeenRound=c.round;const before={...c.a.stages},has=Object.values(before).some(n=>n>0);if(!has||!c.clearBoost(c.a)||c.a.hp<=0||c.t.hp<=0)return;for(const k of ['atk','def','spa','spd','spe','acc'])if(before[k]>0&&c.a.stages[k]<before[k])c.stage(c.t,before[k]-Math.max(0,c.a.stages[k]),[k]);if(c.a.hp<=0||c.t.hp<=0)return;const all=Object.values(c.t.stages).every(n=>n>0);if(all){c.clear(c.t);if(c.a.hp>0&&c.t.hp>0)c.ailment(c.t,'冻伤',c.a,false,false,null,{probabilityPercent:100});}c.a.soulState.avalancheEvents=[{round:c.round,amount:Object.values(c.t.stages).reduce((n,v)=>n+Math.max(0,v),0)*(enhanced?40:30)}];}
function avalancheStart4318(c,enhanced){c.a.soulState.avalancheEvents=[];c.stage(c.a,1,['def','spd']);const total=f=>Object.values(f.stages).reduce((a,b)=>a+b,0),a=total(c.a),b=total(c.t);if(a<b){c.stage(c.a,1,['def','spd']);c.timed(c.a,'概率闪避',1,{chance:100});}else if(a>b){const before=c.t.stages.spe;c.stage(c.t,-1,['spe']);if(c.t.stages.spe===before){if(enhanced){c.addShield(c.a,200,'enhanced-avalanche:'+c.round);c.a.suitState.barrier+=200;}else c.refreshBarrier(c.a,200,'original-avalanche');}}}
for(const [id,hash,enhanced]of [[1545,'6033b2c8',false],[1903,'1e3b3684',true]])registry[id]={name:enhanced?'布蕾里克强化':'布蕾里克',sourceHash:hash,traits:{},hooks:{roundStart(c){avalancheStart4318(c,enhanced);},attackDamageTaken(c){avalanche4318(c,enhanced);},combatEnd(c){const e=c.a.soulState.avalancheEvents?.[0];if(!e||c.a.hp<=0||c.t.hp<=0)return;const amount=Object.values(c.t.stages).reduce((n,v)=>n+Math.max(0,v),0)*(enhanced?40:30);e.amount=amount;healthRules.drainFixed(c,amount,enhanced?'天寒雪崩吸取':'天寒雪崩固定伤害', '天寒雪崩理论回复');}}};

registry[1547]={name:'至序圣华',sourceHash:'2a1c0673',deferred:['裁决场下最高HP随机对象印记/3回合处决与离场终止、2层场下禁疗','首次在场/场下死亡为己方共享场地附圣剑及开启圣剑重铸、真实队友持剑先制/消费/击败复活','真实再登场PP回复及离场印记、对手两层印记使登场免疫时长+1'],traits:{ppReductionFloor:f=>({amount:1,end:f.soulState.coronationEnd??1}),entryAilmentRounds:f=>f.soulState.coronationEnd??1,entryWeaknessRounds:f=>f.soulState.coronationEnd??1},hooks:{battleStart(c){c.a.soulState.coronationEnd=1;for(const k of c.a.moves)if(c.a.pp[k]===0)c.a.pp[k]=1;},combatEnd(c){if(c.a.hp<=0)return;if(c.t.hp>c.t.stats.maxHp/2)c.timed(c.a,'id984',1,{amount:1},c.round+1);if(c.a.hp<c.a.stats.maxHp/2)c.timed(c.a,'protect',3,{},c.round);}}};

registry[1553]={name:'极战·阿尔斯兰',sourceHash:'bb8f7fef',deferred:['下场后保留攻击增伤，并在真实再入场后继续累积至100%'],traits:{skillPriority:f=>f.soulState.arslanPriority??0,damageMultiplier:f=>1+(f.soulState.arslanGrowth??0)},hooks:{battleStart(c){c.a.soulState.arslanEntryRound=1;c.a.soulState.arslanGrowth=0;},roundStart(c){c.a.soulState.arslanPriority=panel(c,c.a,'atk')>panel(c,c.t,'atk')?1:0;c.a.soulState.arslanGrowth=Math.min(1,Math.max(0,c.round-(c.a.soulState.arslanEntryRound??1))*.2);},afterUse(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0)return;const attack=c.actionAttackDamage??0;if(!c.successful||attack>=300)return;c.hurt(c.t,panel(c,c.a,'atk')*.3,'战神之魂低伤追加','true');},combatEnd(c){if(c.a.hp<=0||!conditionStatusRules.conditionPresent(c.a,c.round))return;if(c.a.hp<c.a.stats.maxHp*.6)c.clear(c.t);if(c.a.hp>0&&c.t.hp>0)c.activateWar1770(c.a);}}};

// These sourced clauses are triggered by defeat/death, not by a positive
// damage event. Direct execution may invoke them without inventing damage.
for(const id of [560,638,645,879]){const old=registry[id];registry[id]={...old,hooks:{...old.hooks,executionDefeat:old.hooks.damageTaken}};}

// User confirmations Q-N20-4329-001/002/004, preserved independently of API hashes.
function nyxNight(c){c.timed(c.a,'谧夜之幕',3,{});c.timed(c.a,'攻击必中',3,{});c.timed(c.t,'攻击先制效果失效',3,{});}
function nyxNightEnd(c){const e=c.a.effects['谧夜之幕'];if(e&&e.start<=c.round&&e.end>=c.round)c.restorePP(c.a,999);}
for(const [id,hash,strong] of [[1555,'90557811',false],[1735,'763e1182',true]])registry[id]={name:'倪克斯'+(strong?'·强化':''),sourceHash:hash,deferred:strong?['真实再次登场重置首回合判定；谧夜之幕离场消失']:['真实再次登场重置首回合判定'],abilities:{night:nyxNight},traits:{attackReduction:f=>f.soulState.nyxEntryReduction?.5:0},hooks:{
roundStart(c){const st=c.a.soulState;st.nyxStartHp=c.a.hp;st.nyxEntryReduction=c.round===1&&Object.values(c.t.stages).some(n=>n>0);if(st.nyxEntryReduction){c.timed(c.t,'statusBlock',1,{},c.round+1);if(strong)c.timed(c.a,'固定百分比减伤',1,{fraction:.5});}},
beforeUse(c){if(strong&&c.a.soulState.nyxHighRewardRound===c.round&&c.m.kind!=='status'&&c.m.kind!=='item')c.stage(c.t,-1);},
afterUse(c){if(strong&&c.a.soulState.nyxHighRewardRound===c.round&&c.m.kind==='status'&&c.usedSkillThisRound(c.a)&&c.a.hp>0&&c.t.hp>0)c.ailment(c.t,'沉默',c.a);},
combatEnd(c){if(c.a.hp<=0)return;const diff=Object.keys(c.a.stages).reduce((n,k)=>n+Math.abs(c.a.stages[k]-c.t.stages[k]),0);if(c.round===1&&diff>=(strong?12:3)){if(strong){c.clearAilments(c.a);nyxNight(c);}else{c.timed(c.a,'倪克斯结界PP',2,{});c.timed(c.a,'攻击必中',2,{},c.round+1);c.timed(c.t,'攻击先制效果失效',2,{},c.round+1);}}const pp=c.a.effects['倪克斯结界PP'];if(pp&&pp.start<=c.round&&pp.end>=c.round)c.restorePP(c.a,1);nyxNightEnd(c);const start=c.a.soulState.nyxStartHp;if(c.a.hp>start){c.timed(c.a,'必定暴击',1,{},c.round+1);if(strong)c.a.soulState.nyxHighRewardRound=c.round+1;}else if(strong){const healed=c.heal(c.a,c.a.stats.maxHp/3,'倪克斯强化魂印回复')??0;if(c.t.hp>0)c.hurt(c.t,healed,'倪克斯强化等量追加','percent');c.timed(c.a,'id984',1,{amount:1},c.round+1);}else if(c.a.hp===start)c.timed(c.a,'攻击先制',1,{amount:1},c.round+1);else c.heal(c.a,c.a.stats.maxHp/3,'倪克斯魂印回复');}
}};

for(const [id,hash,strong]of [[1559,'5f62f895',false],[1851,'feedc462',true]])registry[id]={name:'哀·拉伯克'+(strong?'·强化':''),sourceHash:hash,deferred:strong?['真实再次登场重新应用2回合低PP命中封锁；对手真实再次登场随机清PP及2次必暴']:['对手真实主动切换触发次元之镜：2次必暴、随机清PP、对应攻击技能减伤或自身回复；自身真实再次登场重新应用零PP技能效果封锁'],traits:{attackReduction:f=>f.soulState.laberMatrixAttack?.5:0,fixedReduction:f=>f.soulState.laberMatrixAttack?.5:0},hooks:{
battleStart(c){const st=c.a.soulState;if(!st.laberEntry){st.laberEntry={round:c.round,blocked:c.t.moves.filter(k=>c.t.pp[k]<=(strong?Math.ceil(c.maxPP(k)/3):0)),pp:{...c.t.pp}};if(strong){if(!c.ppReductionBlocked(c.t)&&c.t.moves.length)c.t.pp[c.t.moves[Math.floor(c.random()*c.t.moves.length)]]=0;c.a.counts.nextCrit=(c.a.counts.nextCrit??0)+2;}}},
roundStart(c){if(strong){c.a.soulState.laberMatrixAttack=c.t.moves.some(k=>c.moveKind(k)!=='status'&&c.t.pp[k]<=Math.ceil(c.maxPP(k)/3));c.a.soulState.laberMatrixHeal=c.t.moves.some(k=>c.moveKind(k)==='status'&&c.t.pp[k]<=Math.ceil(c.maxPP(k)/3));}},
combatEnd(c){if(strong&&c.a.hp>0&&c.a.soulState.laberMatrixHeal)c.heal(c.a,c.a.stats.maxHp/3,'逆维矩阵回复');},
afterAttack(c){if(c.a.hp<=0||c.t.hp<=0)return;c.a.soulState.laberLastAttack={round:c.round,mixed:!!c.crit&&!!c.anyNonCritical};if(c.crit&&!c.anyNonCritical){if(!c.ppReductionBlocked(c.t)&&c.t.moves.length)c.t.pp[c.t.moves[Math.floor(c.random()*c.t.moves.length)]]=0;}else healthRules.drainPercent(c,c.t.stats.maxHp/3,'哀·拉伯克未暴击吸取');}
}};

registry[1564]={name:'星礼',sourceHash:'2a0cb57',traits:{attackMultiplier:f=>1+(f.soulState.stargiftDouble?.3:.15),attackReduction:f=>f.soulState.stargiftDouble?.3:.15},hooks:{roundStart(c){c.a.soulState.stargiftDouble=(c.typeAffinity(c.t.type,c.a.type)>0&&c.typeAffinity(c.t.type,c.a.type)<1)||c.typeAffinity(c.a.type,c.t.type)>1;const full=Object.values(c.a.stages).every(n=>n>0);if(!full)c.stage(c.a,1);else c.a.soulState.ignoreTargetBoostRound=c.round;},combatEnd(c){if(c.a.hp>0)c.heal(c.a,c.a.stats.maxHp*(c.a.soulState.stargiftDouble?.3:.15),'星礼战阶回复');}}};

registry[1570]={name:'圣心女皇·卡托娜',sourceHash:'3f5caca3',deferred:['自身真实主动切换下场且当前护盾量严格高于600时将自身能力提升附加给己方下只出场精灵'],traits:{},hooks:{combatEnd(c){if(c.a.hp<=0)return;const attacked=c.usedSkillThisRound(c.t)&&c.selectedMove(c.t).kind!=='status'&&c.selectedMove(c.t).kind!=='item';const nominal=(attacked?c.a.stats.maxHp:c.t.stats.maxHp)/3,n=Math.floor(nominal);const old=c.shieldSourceValue(c.a,'holy-empress-1570');c.addShield(c.a,Math.max(0,n-old),'holy-empress-1570');if(attacked){c.heal(c.a,nominal,'圣心女皇等量回复');c.timed(c.a,'属性技能先制',1,{amount:2},c.round+1);}else{c.stage(c.a,1,['def','spd']);c.timed(c.t,'statusBlock',1,{},c.round+1);}}}};


for(const [id,hash,strong]of [[1571,'dad708c7',false],[1786,'d0e7ec19',true]])registry[id]={name:'裁罪魔剪·塞泽丝'+(strong?'·强化':''),sourceHash:hash,traits:{fixedReduction:f=>f.soulState.verdictPinkReduction??0,percentReduction:f=>f.soulState.verdictPinkReduction??0},hooks:{
roundStart(c){const st=c.a.soulState,missing=Math.floor((c.a.stats.maxHp-c.a.hp)*100/c.a.stats.maxHp);st.verdictBonus=missing*(c.a.hp<c.a.stats.maxHp/2?2:1)/100;st.verdictPinkReduction=strong?Math.floor(c.t.hp*100/c.t.stats.maxHp)*.005:(st.verdictNextPinkReduction??0);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.verdictBonus??0);},
afterAttack(c){if(c.a.hp<=0)return;const n=c.settledDamage??c.dealt,threshold=strong?350:c.t.stats.maxHp/3;if(n<threshold){if(c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'裁罪低伤追加','percent');c.timed(c.a,'属性技能先制',1,{amount:1},c.round+1);}else if(n>threshold){const restored=c.heal(c.a,c.a.stats.maxHp/3,'裁罪高伤回复')??0;if(restored>0&&c.t.hp>0)c.hurt(c.t,restored,'裁罪实际回复追加','percent');c.timed(c.a,'攻击先制',1,{amount:1},c.round+1);}},
afterUse(c){if(!strong||c.a.hp<=0||!['physical','special'].includes(c.m?.kind)||c.successful)return;registry[1786].hooks.afterAttack({...c,settledDamage:c.actionAttackDamage??0});},
combatEnd(c){if(!strong&&c.a.hp>0)c.a.soulState.verdictNextPinkReduction=Math.floor(c.t.hp*100/c.t.stats.maxHp)*.004;}
}};


registry[1577]={name:'花寅',sourceHash:'178d88fb',traits:{},hooks:{
opponentAfterUse(c){if(c.t.side===c.first&&c.m.kind!=='item')c.timed(c.t,'攻击先制效果失效',1,{},c.round+1);},
beforeUse(c){if(c.m.kind==='item'||c.a.side!==c.first||c.a.hp<=0||c.t.hp<=0)return;if(c.t.hp>c.t.stats.maxHp/2)healthRules.drainPercent(c,c.t.stats.maxHp/3,'花寅先手命中前吸取');},beforeDamage(c){if(c.a.side===c.first)c.modifier*=2;},
combatEnd(c){if(c.a.hp>0&&c.a.hp<c.t.hp){c.stage(c.a,1);c.timed(c.a,'id984',1,{amount:1},c.round+1);}}
}};

// Q-N20-4354-001: persistent non-stacking dust; every grant rechecks low HP.
function grantDarkFirmamentDust(c,origin='soul'){if(c.a.hp<=0)return;c.a.soulState.darkFirmamentDust??={origin};if(c.a.hp<c.a.stats.maxHp/2)c.clear(c.t);}
for(const [id,hash,strong]of [[1578,'fa7a82b4',false],[2079,'82ea8f8b',true]])registry[id]={name:'狂沙之主·萨特'+(strong?'·觉醒':''),sourceHash:hash,abilities:strong?{dust:grantDarkFirmamentDust,dustPriority:c=>Math.max(0,Math.floor(c.typeAffinity(c.a.type,c.t.type)))}:{},partial:false,unimplemented:[],traits:{attackDamageCap:f=>!strong&&f.soulState.sandHigh?Math.max(0,Math.floor(f.stats.maxHp/2)-(f.soulState.sandAttackReceived??0)):Infinity},hooks:{
battleStart(c){if(strong)grantDarkFirmamentDust(c);},
roundStart(c){const st=c.a.soulState;st.sandAttackReceived=0;st.sandHigh=c.a.hp>c.a.stats.maxHp/2;st.sandLow=c.a.hp<c.a.stats.maxHp/2;if(strong&&st.sandLow){c.timed(c.a,'id984',1,{amount:2});const fifth=c.a.moves.find(k=>c.isFifthSkill(k)),m=fifth&&c.moveDefinition(fifth)?.type;if(m&&c.typeAffinity(c.a.type,c.t.type)>c.typeAffinity(m,c.a.type))c.clearAilments(c.a);}},
beforeHealthDamage(c){if(!strong||!c.a.soulState.sandHigh||c.type!=='attack'||c.ignoreLimit)return;const fifth=c.t.moves.find(k=>c.isFifthSkill(k)),fifthType=fifth&&c.moveDefinition?.(fifth)?.type,affinity=c.typeAffinity(c.m?.type??c.selectedMove(c.t).type,c.a.type),quarter=!!fifthType&&affinity>c.typeAffinity(fifthType,c.a.type),cap=Math.max(0,Math.floor(c.a.stats.maxHp/(quarter?4:2))-c.incomingSettledDamage('attack'));if(c.amount>cap){c.amount=cap;if(quarter)c.heal(c.a,c.a.stats.maxHp/2,'黯沙觉醒限制回复');}},
damageTaken(c){c.a.soulState.sandAttackReceived=c.incomingSettledDamage('attack');},
opponentAfterUse(c){if(c.m.kind==='item')return;const st=c.a.soulState,previous=st.sandPreviousFoeKind;st.sandPreviousFoeKind=c.m.kind;if(previous===undefined)return;if(previous===c.m.kind)c.a.counts.immune=(c.a.counts.immune??0)+1;else{st.sandChangedRound=c.round;if(!strong)c.timed(c.a,'黯天之尘',1,{},c.round+1);}},
combatEnd(c){if(c.a.hp<=0)return;if(!strong&&c.a.hp<c.a.stats.maxHp/2){c.timed(c.a,'id984',1,{amount:2},c.round+1);if(c.a.soulState.sandChangedRound===c.round)c.clear(c.t);}if(strong&&c.a.soulState.sandChangedRound===c.round)grantDarkFirmamentDust(c);}
}};

// Wiki魂印1579 revision320116 supplements API: each moment once per round;
// early activation replaces the combat-end activation, and shields/barriers stack.
function angelChastise1579(c,start){if(c.a.hp<=0||Object.values(c.a.stages).some(n=>n>0)||c.a.soulState.angelChastiseRound===c.round)return;c.a.soulState.angelChastiseRound=c.round;const shield=c.consumeShields(c.t,c.a),barrier=c.consumeBarrier(c.t);if(shield>0)c.addShield(c.a,shield,'angel-chastise');if(barrier>0)c.a.suitState.barrier+=barrier;if(Object.values(c.t.stages).some(n=>n>0)){const immune=c.weaknessBlocked(c.t);c.stage(c.t,-2,['def','spd']);if(immune&&c.clearBoost(c.t))c.timed(c.t,'面板数值设定',1,{values:{atk:0,spa:0}},start);}}
function angelForgive1579(c){if(c.a.hp<=0||c.a.hp>=c.a.stats.maxHp/2||c.a.soulState.angelForgiveRound===c.round)return;c.a.soulState.angelForgiveRound=c.round;const abnormal=conditionStatusRules.conditionPresent(c.a,c.round);c.heal(c.a,c.a.stats.maxHp/3*(abnormal?2:1),'宽恕之刻');if(abnormal)for(const k of ['疲惫','害怕'])c.clearAilment(c.a,k);}
registry[1579]={name:'终末大天使',sourceHash:'3ffab5b0',traits:{dodgeChance:f=>Object.values(f.stages).some(n=>n>0)?0:1,skillPriority:f=>f.hp<f.stats.maxHp/2?2:0},hooks:{opponentBeforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')angelChastise1579(c,c.round);},receivedAttack(c){const m=c.selectedMove(c.t);if(m.kind!=='status'&&m.kind!=='item')angelForgive1579(c);},combatEnd(c){angelChastise1579(c,c.round+1);angelForgive1579(c);}}};

for(const [id,hash,strong]of [[1583,'84dc0c15',false],[1905,'b805865a',true]])registry[id]={name:'杰特洛'+(strong?'·强化':''),sourceHash:hash,partial:false,unimplemented:[],traits:{skillPriority:f=>f.soulState.jetPriorityRound===f.soulState.calculationRound?(f.soulState.jetPriority??0):0},hooks:{
beforeDamage(c){const n=c.typeAffinity(c.t.type,c.a.type);if(n>1)c.modifier*=Math.min(2,n);},beforeIncomingAttack(c){const m=c.typeAffinity(c.a.type,c.t.type);if(m>1)c.reduction+=1-1/Math.min(2,m);},
roundStart(c){const st=c.a.soulState;st.jetRound=c.round;st.jetPriorityRound=c.round;st.jetPriority=0;st.jetFailures=[];st.jetUnknown=[];const groups=[['spe','acc'],['atk','spa'],['def','spd']],values=f=>[f.hp+panel(c,f,'spe'),panel(c,f,'atk')+panel(c,f,'spa'),panel(c,f,'def')+panel(c,f,'spd')],a=values(c.a),b=values(c.t);for(let i=0;i<3;i++){if(!(a[i]<b[i])){st.jetFailures.push(i);continue;}const before=groups[i].map(k=>c.t.stages[k]);c.stage(c.t,-1,groups[i]);if(!groups[i].every((k,j)=>c.t.stages[k]<before[j]))st.jetFailures.push(i);}
const min=st.jetFailures.length,max=min+st.jetUnknown.length;st.jetFailureBounds={min,max};if(!strong){if(min>=2)st.jetPriority=1;}else if(min===max&&min>=2)st.jetPriority=min;if(min===3&&max===3){c.clear(c.t);if(strong)st.jetPPAbsorption=c.absorbPP(c.a,c.t,1);}},
combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0||st.jetRound!==c.round)return;const {min,max}=st.jetFailureBounds;if(!strong&&min>=1)c.heal(c.a,c.a.stats.maxHp/3,'杰特洛未触发回复');if(strong&&min===max&&min>=1)c.heal(c.a,c.a.stats.maxHp*.2*min,'杰特洛强化未触发回复');}
}};

for(const [id,hash,strong]of [[1584,'ca815c0a',false],[1852,'be392f9a',true]])registry[id]={name:'隙之门·基卢'+(strong?'·强化':''),sourceHash:hash,partial:false,unimplemented:[],traits:{skillPriority:f=>f.soulState.giluPriority??0},hooks:{
roundStart(c){const st=c.a.soulState,threshold=strong?3:2;st.giluPriority=c.t.moves.filter(k=>c.t.pp[k]<=threshold).length+(strong?c.a.moves.filter(k=>c.a.pp[k]<=threshold).length:0);delete st.giluUnknownPriority;},
opponentAfterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.giluLastEnemyAttack={id:c.m.wikiId??c.m.id,power:c.m.power};},
beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'){const st=c.a.soulState;st.giluAttackUses=(st.giluAttackUses??0)+1;st.giluPowerThisUse=st.giluLastEnemyAttack?.power??0;delete st.giluUnknownPower;}},
beforeDamage(c){c.power+=c.a.soulState.giluPowerThisUse??0;},
afterUse(c){if(c.m.kind==='status')c.timed(c.t,'属性技能命中效果失效',1,{},c.round+1);},
combatEnd(c){if(c.a.hp<=0||c.t.hp<=0||c.a.hp>=c.t.hp)return;if(strong)c.absorbPP(c.a,c.t,1);else if(!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-1);}
}};

function lokiEntry1586(c){const st=c.a.soulState;st.lokiLayers=Math.min(3,Math.max(0,Math.floor(st.lokiLayers??0)));st.lokiResetBase??=0;st.lokiEntryRound=c.round??1;st.lokiEntryLayers=st.lokiLayers;st.lokiEntryCount=(st.lokiEntryCount??0)+1;st.lokiShieldSource='loki-entry:'+st.lokiEntryCount;if(st.lokiLayers>=1){c.addShield(c.a,st.lokiLayers*100,st.lokiShieldSource);c.addBarrier(c.a,st.lokiLayers*100,st.lokiShieldSource);}}
function lokiLostProtection(c){const st=c.a.soulState;return !!st.lokiShieldSource&&(c.shieldSourceValue(c.a,st.lokiShieldSource)===0||c.barrierSourceValue(c.a,st.lokiShieldSource)===0);}
function lokiPunish1586(c){const st=c.a.soulState;if(c.a.hp<=0||c.t.hp<=0||st.lokiEntryLayers<3||c.round>=st.lokiEntryRound+2||!lokiLostProtection(c))return;c.t.counts.nextAttackInvalid=Math.max(1,c.t.counts.nextAttackInvalid??0);st.lokiPunishmentConsumed=true;delete st.pendingLokiRepeat;}
registry[1586]={name:'洛基',sourceHash:'ce8136cf',partial:false,unimplemented:[],deferred:['自身真实存活于场下时对方攻击后获得堕恶神祇并施放诡计神罚：特攻20%真实伤害或低于1/5令该攻击PP归0，上限3；需真实场下/敌方行动监听','真实下场且本魂印盾罩均消失时按当前重置基数重置层数，重新入场保留层数与本场判定消耗；当场在场分支已实现'],traits:{incomingAilmentReplacement:f=>f.soulState.lokiConvertRound===f.soulState.calculationRound?'流血':null},hooks:{battleStart(c){c.a.soulState.lokiLayers=0;c.a.soulState.lokiResetBase=0;lokiEntry1586(c);},entryTriggered:lokiEntry1586,roundStart(c){const st=c.a.soulState;st.lokiConvertRound=st.lokiShieldSource&&c.shieldSourceValue(c.a,st.lokiShieldSource)>0&&c.barrierSourceValue(c.a,st.lokiShieldSource)>0?c.round:0;lokiPunish1586(c);},combatEnd:lokiPunish1586}};
registry[2055]={name:'洛基·强化',sourceHash:'39e0b383',partial:false,unimplemented:[],deferred:['自身真实存活于场下时对方攻击后获得神祇并发动神诗叙诡：自身特攻面板20%真实伤害，不足致死则不减HP且转为虚饰弧光累计至对手；场下施法者吸取对手当回合所用技能全部PP平均分配己方在场零PP技能；需真实场下/敌方行动监听','真实下场/再次入场及虚饰弧光下场保留，免疫向己方后续精灵承接；洛基自身不在场免疫成功额外重置神祇层数'],traits:{incomingAilmentReplacement:f=>f.soulState.lokiConvertRound===f.soulState.calculationRound?'流血':null},hooks:{battleStart(c){c.a.soulState.lokiLayers=0;c.a.soulState.lokiResetBase=0;lokiEntry1586(c);},entryTriggered:lokiEntry1586,roundStart(c){const st=c.a.soulState;st.lokiConvertRound=st.lokiShieldSource&&c.shieldSourceValue(c.a,st.lokiShieldSource)>0&&c.barrierSourceValue(c.a,st.lokiShieldSource)>0?c.round:0;},combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&st.lokiEntryLayers>=3&&c.round<st.lokiEntryRound+2&&lokiLostProtection(c)){c.timed(c.a,'攻击伤害免疫',1,{lokiArcReset:true},c.round+1);delete st.pendingLokiArcReset;}},attackDamageTaken(c){if(c.attackImmune&&c.on(c.a,'攻击伤害免疫')&&c.a.effects['攻击伤害免疫'].lokiArcReset)c.t.soulState.lokiFalseArc=0;}}};

function yuliObserveTimed(c){c.a.soulState.yuliFoeTimed=Object.values(c.t.effects).some(e=>conditionStatusRules.timedPresent(e,c.round));}
function yuliPulse2080(c){const st=c.a.soulState,layers=st.yuliFangLayers??0;if(layers<=0||c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;const own=c.a.hp,foe=c.t.hp;c.hurt(c.a,1,'群芳加护自身固定伤害','fixed');if(c.a.hp<=0)return;c.hurt(c.t,1,'群芳加护对手固定伤害','fixed');if(c.a.hp<=0)return;if(c.t.hp===foe)st.yuliAttackGrowth=Math.min(layers,(st.yuliAttackGrowth??0)+1);if(c.a.hp===own)st.yuliPinkGrowth=Math.min(layers,(st.yuliPinkGrowth??0)+1);}
for(const [id,hash,strong]of [[1588,'d3a9f290',false],[2080,'fa61a6cf',true]])registry[id]={name:'尤莉米特'+(strong?'·强化':''),sourceHash:hash,partial:false,unimplemented:[],deferred:['己方其他真实精灵首次出战获得群芳加护层数，需队伍成员首次出场去重；自身群辉不作为群芳层数','自身被击败消耗群芳，每层令己方所有不在场精灵全部技能恢复1PP，下一只登场后首次技能附加群辉所记当回合完整技能伤害20%的百分比伤害','群辉消耗后下回合以回合效果禁止对方真实主动换宠；当前全先制归零已实现'],traits:{skillDodgeChance:f=>f.soulState.yuliActiveKnown===true&&f.soulState.yuliFoeTimed?1:0,pinkDamageMultiplier:f=>1+(f.soulState.yuliPinkGrowth??0)*.2},hooks:{battleStart(c){const st=c.a.soulState;st.yuliActiveKnown=true;st.yuliEvades=0;st.yuliAttackGrowth=0;st.yuliPinkGrowth=0;st.yuliTeamLayers=0;st.yuliFangLayers=0;},roundStart:yuliObserveTimed,opponentBeforeUse:yuliObserveTimed,beforeDamage(c){c.modifier*=1+(c.a.soulState.yuliAttackGrowth??0)*.2;},afterUse(c){if(strong)yuliPulse2080(c);},opponentAfterUse(c){if(strong)yuliPulse2080(c);},attackDamageTaken(c){const st=c.a.soulState,original=c.selectedMove(c.t);if(st.yuliActiveKnown!==true||!original||original.kind==='status'||original.kind==='item')return;st.yuliGuardConsumedRound=c.round;st.yuliLastHitDamage=c.a.roundActualSettledSkillDamageTaken??0;st.yuliActiveKnown=false;const count=c.t.moves.filter(k=>c.moveKind(k)!==original.kind).length;c.heal(c.a,count*120,'尤莉米特异类技能回复');c.timed(c.t,'先制效果失效',1,{},c.round+1);c.timed(c.t,'不能主动切换',1,{},c.round+1);},opponentSkillResolved(c){const st=c.a.soulState;if(c.m.kind==='item'||st.yuliActiveKnown!==true)return;if(c.successful){if(c.m.kind!=='status')return;const count=c.t.moves.filter(k=>c.moveKind(k)!==c.m.kind).length;c.heal(c.a,count*120,'尤莉米特异类技能回复');}else if(strong){const reason=c.invalidReason??{};if(!reason.blocked&&!reason.blind&&!reason.forcedMiss&&(reason.miss||reason.soulEvaded&&st.yuliFoeTimed)){st.yuliEvades++;healthRules.drainFixed(c,st.yuliEvades*120,'尤莉米特累计闪避吸取');}}}}};

function foxMaze1597(c){c.addSpecialState(c.t,'失心迷阵',{sourceSide:c.a.side,potionHPReversed:true,clearOnSwitch:true,releaseWhen:'both-stages-zero',releaseEffects:[{key:'攻击伤害易伤',duration:1,params:{fraction:1.2}},{key:'不能主动切换',duration:1,params:{}},{key:'先制效果失效',duration:1,params:{}}]});}
registry[1597]={name:'幻魅灵狐·苏璃',sourceHash:'d8f17d91',partial:false,unimplemented:[],deferred:['真实重新登场时重新获得首次技能睡眠；当前首次确定命中分支已实现','失心迷阵在目标真实下场后不保留，解除后下回合以回合效果禁止主动换宠'],abilities:{maze:foxMaze1597},traits:{attackReduction:f=>f.soulState.foxModeRound===f.soulState.calculationRound&&f.soulState.foxMazeMode?.3:0},hooks:{
battleStart(c){c.a.soulState.foxFirstSkillDone=false;if(c.t.gender===undefined)c.a.soulState.pendingFoxGender=true;else if(c.t.gender===1)foxMaze1597(c);},
roundStart(c){const st=c.a.soulState;if(st.pendingFoxGender)throw Error('1597入场缺少对手真实性别来源');st.foxModeRound=c.round;st.foxMazeMode=!!c.specialState(c.t,'失心迷阵');if(st.foxMazeMode)c.stage(c.a,1,['def','spd','acc']);else c.stage(c.t,-1,['def','spd','acc']);},
beforeDamage(c){if(c.a.soulState.foxModeRound===c.round&&!c.a.soulState.foxMazeMode)c.modifier*=1.3;},
beforeUse(c){const st=c.a.soulState;if(st.foxFirstSkillDone||c.m.kind==='item')return;st.foxFirstSkillDone=true;if(!c.ailment(c.t,'睡眠',c.a,false,false,null,{probabilityPercent:100})&&c.a.hp>0)c.clear(c.t);}
}};
registry[1598]={name:'龙焉',sourceHash:'bd54e01d',hooks:{
roundStart(c){const st=c.a.soulState;st.longyanImmuneRound=c.round===1||!st.longyanPreviousAttack?c.round:0;st.longyanImmuneCount=0;const m=c.selectedMove(c.a);st.longyanAttackMode=0;if(m&&m.kind!=='status'&&m.kind!=='item'){st.longyanChoices=(st.longyanChoices??0)+1;st.longyanAttackMode=st.longyanChoices%2?1:2;}},
beforeDamage(c){if(c.a.soulState.longyanAttackMode===1)c.modifier*=1.5;},
beforeAilment(c){const st=c.a.soulState;if(st.longyanImmuneRound===c.round){st.longyanImmuneCount++;c.blocked=true;}},
afterUse(c){if(c.m.kind==='status'||c.m.kind==='item')return;const st=c.a.soulState;st.longyanActualAttackRound=c.round;if(st.longyanAttackMode===2&&c.a.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'渎龙轮舞吸取','渎龙轮舞回复');},
combatEnd(c){const st=c.a.soulState;if(c.a.hp<=0||st.longyanImmuneRound!==c.round)return;const n=st.longyanImmuneCount;if(n>0)c.heal(c.a,c.a.stats.maxHp*n/3,'渎龙轮舞免疫回复');else for(const key of c.a.moves)if(!['status','item'].includes(c.moveKind(key)))c.a.pp[key]=Math.min(c.maxPP(key),c.a.pp[key]+2);},
afterRoundEnd(c){c.a.soulState.longyanPreviousAttack=c.a.soulState.longyanActualAttackRound===c.round;}
},traits:{attackPriority:f=>f.soulState.longyanAttackMode===1?-1:f.soulState.longyanAttackMode===2?1:0}};

function holyWindReductionActive(f,round){return Number.isInteger(round)&&round>0&&(f.soulState.holyWindReduceRound===round||(f.soulState.holyWindReduceRounds??[]).includes(round));}
registry[1600]={name:'圣谕之风·岚',sourceHash:'6580ffe6',traits:{weaknessImmune:true,noPPConsumption:true,skillPriority:f=>holyWindReductionActive(f,f.soulState.calculationRound)?1:0,attackReduction:f=>holyWindReductionActive(f,f.soulState.calculationRound)?.5:0},hooks:{
beforeDamage(c){c.stab=c.stabValue(c.a.type,c.a.type);},
beforeIncomingAttack(c){if(c.attackImmunityIgnored)return;c.immuneAttack=!c.sameType(c.m.type,c.t.type);},
beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&holyWindReductionActive(c.a,c.round))c.amount*=1-.5*((c.damageReductionIgnore??0)>=1?0:1);},
afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;const st=c.a.soulState,kind=c.m.kind==='status'?'status':'attack',same=st.holyWindLastKind===kind;st.holyWindLastKind=kind;st.holyWindUsedRound=c.round;st.holyWindChainRound=same?c.round:0;if(!same)return;if(kind==='status'){st.holyWindReduceRounds=[...new Set([...(st.holyWindReduceRounds??[]),st.holyWindReduceRound,c.round+1].filter(n=>Number.isInteger(n)&&n>=c.round))];st.holyWindReduceRound=c.round+1;}else if(c.t.hp>0&&!c.ailment(c.t,'睡眠',c.a,false,false,null,{probabilityPercent:100})){if(c.a.hp>0)c.clear(c.t);if(c.a.hp>0)healthRules.drainFixed(c,300,'圣谕连续攻击吸取');}},
combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&c.t.hp>0&&st.holyWindUsedRound===c.round&&st.holyWindChainRound!==c.round)c.hurt(c.t,100,'圣谕未满足连用条件','true');}
}};

function kingReborn1603(c){if(c.a.hp<=0)throw Error('1603重生成功条件尚未成立');const st=c.a.soulState;if(c.usedSkillThisRound(c.t)){const move=c.selectedMove(c.t);if(move.kind!=='item'&&!c.ppReductionBlocked(c.t))c.t.pp[move.id]=0;}else st.kingPPZeroRound=c.round;c.timed(c.t,'攻击伤害倍数',2,{multiple:.5},c.round+1);}
registry[1603]={name:'王左兵右',sourceHash:'bc2323a2',traits:{},deferred:['未重生时己方真实下只登场精灵全属性+1；当场随机2技能PP归0已实现'],abilities:{reborn:kingReborn1603},hooks:{
beforeRoundStart(c){const st=c.a.soulState;if(st.kingRevivalRound!==c.round)return;delete st.kingRevivalRound;c.a.hp=c.a.stats.maxHp;delete st.deathResolved;for(const id of c.a.moves)c.a.pp[id]=st.kingRevivalPP[id];delete st.kingRevivalPP;kingReborn1603(c);},
afterUse(c){if(c.m.kind==='item'||c.a.hp<=0)return;c.heal(c.a,c.a.stats.maxHp/3,'王左兵右用招回复');if(c.a.hp>0&&c.a.hp===c.a.stats.maxHp&&c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'王左兵右满体附伤','percent');},
death(c){const st=c.a.soulState;if(st.kingDeathAttempted)return;st.kingDeathAttempted=true;if(!c.usedSkillThisRound(c.a)){st.kingRevivalRound=c.round+1;return;}if(!c.ppReductionBlocked(c.t)){const pool=c.t.moves.slice();for(let n=0;n<2&&pool.length;n++)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;}},
opponentAfterUse(c){const st=c.a.soulState;if(st.kingPPZeroRound!==c.round||c.m.kind==='item')return;delete st.kingPPZeroRound;if(!c.ppReductionBlocked(c.t))c.t.pp[c.m.id]=0;},
afterRoundEnd(c){delete c.a.soulState.kingPPZeroRound;}
}};

registry[1605]={name:'缔笙',sourceHash:'85e76e53',traits:{opponentAttackMultiplier:f=>f.hp>0&&(f.soulState.dishengLayers??0)>=3?.7:1,opponentPinkDamageMultiplier:f=>f.hp>0&&(f.soulState.dishengLayers??0)>=5?.7:1,opponentSkillHealingConversion:f=>f.hp>0&&(f.soulState.dishengLayers??0)>=7?{fraction:1/3,type:'true',sourceLabel:'缔结印记回复转伤害',conflictPolicy:'block-without-conversion',confirmation:'Q-N20-4386-001'}:null},deferred:['自身真实场下存活时仍每10回合产生浪潮，对手不同出场精灵的历史在场回合与独立10回合印记；当前双方一直在场的真实浪潮/印记/阈值完整实现'],hooks:{
roundStart(c){const st=c.a.soulState,all=c.t.soulState.tieMarksBySource??={};let marks=all[c.a.side];if(marks&&marks.expiresRound<c.round){delete all[c.a.side];marks=null;}if(c.round>1&&(c.round-1)%10===0){const count=st.dishengElapsedFieldTurns??0;all[c.a.side]={count,expiresRound:c.round+9,sourceSide:c.a.side};marks=all[c.a.side];st.dishengElapsedFieldTurns=0;}st.dishengLayers=marks?.count??0;st.dishengStartHp=c.t.hp;st.dishengFullRound=c.a.hp===c.a.stats.maxHp?c.round:0;st.dishengIgnoreDefenseRound=st.dishengFullRound?0:c.round;if(st.dishengLayers>=1)c.timed(c.t,'PP消耗倍增',1,{multiple:2});},
beforeAilment(c){if(c.a.soulState.dishengFullRound===c.round)c.blocked=true;},
beforeDamage(c){if(c.a.soulState.dishengIgnoreDefenseRound===c.round)c.ignoreDefenseBoost=true;},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(c.t.hp<=st.dishengStartHp)c.timed(c.a,'id984',1,{amount:1},c.round+1);if(c.t.hp>=st.dishengStartHp)c.heal(c.a,c.a.stats.maxHp/3,'缔笙不低于初始回复');},
roundCompleted(c){if(c.a.hp>0&&c.t.hp>0)c.a.soulState.dishengElapsedFieldTurns=(c.a.soulState.dishengElapsedFieldTurns??0)+1;}
}};

registry[1606]={name:'坦普瑞',sourceHash:'ccbff4fd',traits:{skillPriority:f=>(f.soulState.tampPriorityRound??0)>0&&f.soulState.tampPriorityRound===f.soulState.calculationRound?1:0},hooks:{
roundStart(c){if(conditionStatusRules.conditionPresent(c.t,c.round))c.a.soulState.tampPriorityRound=c.round;else if(!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-1);},
roundEnd(c){if(c.a.hp<=0)return;const count=c.a.moves.filter(k=>c.a.pp[k]===0).length;if(!count)return;c.restorePP(c.a,1);const healed=c.heal(c.a,c.a.stats.maxHp/3,'坦普瑞零PP回复')??0;if(c.a.hp<=0)return;if(healed>0&&c.t.hp>0)c.hurt(c.t,healed,'坦普瑞实际回复等量附伤','percent');if(c.a.hp<=0||c.t.hp<=0)return;if(count>=3){c.clear(c.t);if(c.a.hp>0)c.ailment(c.t,'沉默',c.a,false,false,null,{probabilityPercent:100});}}
}};

registry[1612]={name:'祭空墟祖',sourceHash:'7a3cbc9d',traits:{attackMultiplier:f=>(f.soulState.ruinFullRound??0)>0&&f.soulState.ruinFullRound===f.soulState.calculationRound?2:1},hooks:{
roundStart(c){c.a.soulState.ruinFullRound=c.a.hp===c.a.stats.maxHp?c.round:0;},
beforeAilment(c){if(c.a.soulState.ruinFullRound===c.round)c.blocked=true;},
combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(conditionStatusRules.conditionPresent(c.a,c.round)){healthRules.drainPercent(c,c.t.stats.maxHp/3,'祭空墟祖异常吸取');if(c.a.hp>0)c.timed(c.t,'statusBlock',1,{},c.round+1);}else c.hurt(c.t,c.a.stats.maxHp/3,'祭空墟祖无异常附伤','percent');}
}};

registry[1613]={name:'海棠教皇·未明',sourceHash:'c6d33591',traits:{},hooks:{
roundStart(c){c.a.soulState.haitangFullRound=c.a.hp===c.a.stats.maxHp?c.round:0;},
beforeCrit(c){if(c.a.soulState.haitangFullRound===c.round)c.forceCrit=true;},
afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.haitangFullRound===c.round&&(c.settledDamage??c.dealt)>400)c.ailment(c.t,'冰封',c.a,false,false,null,{probabilityPercent:100});},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'id984',1,{amount:1},c.round+1);else{const healed=c.heal(c.a,c.a.stats.maxHp/3,'海棠教皇未满体回复')??0;if(healed>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,healed,'海棠教皇实际回复等量附伤','percent');}}
}};

registry[1617]={name:'圣律剑灵',sourceHash:'db6c9a19',traits:{attackMultiplier:f=>1+(f.soulState.swordEntryCount??0)*.1,attackReduction:f=>1-(1-(f.soulState.swordEntryEnd>=f.soulState.calculationRound?(f.soulState.swordEntryReduction??0):0))*(1-Math.max(0,(f.soulState.swordEntryCount??0)-1)*.1),skillPriority:f=>(f.soulState.swordEntryCount??0)>=3?1:0,ailmentImmune:f=>(f.soulState.swordEntryCount??0)>=4},deferred:['真实再登场按既有处决印记给予2回合减伤；当前首次登场为对手合法添加1层印记已实现','真实换宠再登场按当时圣剑数量重新取快照；当前首次登场计数0、已有场地状态的0/1/2/3/4柄强化逻辑已实现且不随随后1758生成改变快照','己方圣剑重铸期间禁回复/药剂转扣HP、非微弱及印记层数真实伤害，须真实共享场地和重铸生命周期','击败未持有印记的对手后为对方下只出战精灵附加1层；击败当前持印记对手自强已实现'],hooks:{
battleStart(c){const n=c.executionMarks(c.t);c.a.soulState.swordEntryCount=c.holySwordCount();c.a.soulState.swordEntryReduction=n*.2;c.a.soulState.swordEntryEnd=2;c.addExecutionMark(c.t,1);},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&c.round<=c.a.soulState.swordEntryEnd)c.amount*=1-c.a.soulState.swordEntryReduction*((c.damageReductionIgnore??0)>=1?0:1);},
afterUse(c){const st=c.a.soulState,d=c.t.soulState.executionMarksOnDefeat;if(c.a.hp<=0||c.t.hp>0||d?.round!==c.round||!d.count||st.swordMarkKillRound===c.round)return;st.swordMarkKillRound=c.round;c.stage(c.a,1);}
}};

registry[1618]={name:'破世之拳·特罗斯',sourceHash:'3fc997ef',traits:{attackAlwaysHit:f=>(f.soulState.telosNoBoostRound??0)>0&&f.soulState.telosNoBoostRound===f.soulState.calculationRound},hooks:{
roundStart(c){c.a.soulState.telosNoBoostRound=Object.values(c.a.stages).some(n=>n>0)?0:c.round;},
beforeUse(c){const st=c.a.soulState;delete st.telosFirstHitHp;delete st.telosFirstHitMaxHp;delete st.telosLowHit;delete st.telosHitMultiplier;st.telosPendingSnapshot=true;},
beforeCrit(c){if(c.a.soulState.telosNoBoostRound===c.round)c.forceCrit=true;},
beforeDamage(c){const st=c.a.soulState;if(st.telosPendingSnapshot){delete st.telosPendingSnapshot;st.telosFirstHitSegment=st.currentAttackSegment;st.telosFirstHitHp=c.a.hp;st.telosFirstHitMaxHp=c.a.stats.maxHp;st.telosLowHit=c.a.hp<c.a.stats.maxHp/2;st.telosHitMultiplier=1.5+Math.floor((c.a.stats.maxHp-c.a.hp)*10/c.a.stats.maxHp)*.1;}c.modifier*=st.telosHitMultiplier;},
afterAttack(c){if(!c.a.soulState.telosLowHit||c.a.hp<=0)return;const amount=c.settledDamage??c.dealt;if(c.t.hp>0)c.hurt(c.t,amount,'破世之拳低体附伤','percent');if(c.a.hp>0)c.heal(c.a,amount,'破世之拳低体回复');},
combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const keys=['atk','def','spa','spd','spe','acc'],negative=keys.filter(k=>c.a.stages[k]<0);if(!negative.length)return;c.clearBoost(c.t);if(c.weaknessBlocked(c.t)){if(c.canRemoveNegative(c.a)!==false)for(const k of negative)c.stage(c.a,-3*c.a.stages[k],[k]);c.refreshBarrier(c.a,300,'soul:1618:3fc997ef');}else for(const k of negative)c.stage(c.t,c.a.stages[k],[k]);}
}};

registry[1626]={name:'派利尔',sourceHash:'d2f7eed',partial:false,unimplemented:[],traits:{attackPriority:f=>(f.soulState.palielDefenceRound??0)>0&&f.soulState.palielDefenceRound===f.soulState.calculationRound?1:0,allDamageReduction:f=>(f.soulState.palielDefenceRound??0)>0&&f.soulState.palielDefenceRound===f.soulState.calculationRound?.5:0},hooks:{
combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;c.swapCurrentHP();if(c.a.hp>c.t.hp){c.ailment(c.t,'沉默',c.a,false,false,null,{probabilityPercent:100});if(c.a.hp>0)c.clearAilments(c.a);}else if(c.a.hp<c.t.hp)c.a.soulState.palielDefenceRound=c.round+1;}
}};

function gainDragonGall(c,n=1){const st=c.a.soulState,before=st.dragonGall??0;st.dragonGall=Math.min(7,before+n);if(st.dragonGall>before)st.dragonGallImmunityPendingRound=c.round;c.emit?.('龙胆 '+before+' → '+st.dragonGall+'/7；获得的回合结束时给予后2回合异常免疫。');}
registry[1638]={name:'赤胆游龙·赵云',sourceHash:'baef8d5a',traits:{entryAilmentRounds:1,opponentAttackHitEffectsDisabled:f=>f.soulState.calculationRound===1,skillPriority:f=>(f.soulState.zhaoPriorityRound??0)>0&&f.soulState.zhaoPriorityRound===f.soulState.calculationRound?2:0,ailmentImmune:f=>(f.soulState.dragonGall??0)>=7||(f.soulState.dragonGallImmuneUntil??0)>0&&f.soulState.calculationRound>=(f.soulState.dragonGallImmuneFrom??1)&&f.soulState.calculationRound<=f.soulState.dragonGallImmuneUntil,noPPConsumption:f=>(f.soulState.dragonGall??0)>=7},deferred:['自身真实再次登场重获首回合免异常及敌攻击命中效果失效','自身下场后每经过1回合龙胆减少1枚、下场保留与重新登场读取；当前在场龙胆取得/上限7/两回合免疫/满层免PP与少于7退出逻辑已实现'],abilities:{gainDragonGall},hooks:{
battleStart(c){c.a.soulState.dragonGall=0;},
roundStart(c){const st=c.a.soulState;st.zhaoReductionCount=st.zhaoSixRound===c.round?6:3;st.zhaoPriorityRound=Object.values(c.a.stages).some(n=>n!==0)||conditionStatusRules.conditionPresent(c.a,c.round)?c.round:0;},
afterHit(c){if(c.a.hp<=0||c.m.kind==='item')return;const st=c.a.soulState,pool=['atk','def','spa','spd','spe','acc'];let changed=0;for(let n=0;n<(st.zhaoReductionCount??3)&&pool.length&&c.a.hp>0;n++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0],before=c.t.stages[k];c.stage(c.t,-1,[k]);const delta=Math.max(0,before-c.t.stages[k]);changed+=delta;if(delta&&c.a.hp>0)c.stage(c.a,delta,[k]);}if(c.a.hp<=0)return;if(!changed)st.zhaoFailureRound=c.round;if(Object.values(c.a.stages).some(n=>n>0))gainDragonGall(c);const negative=Object.values(c.a.stages).filter(n=>n<0).length;if(negative){if(c.t.hp>0)c.hurt(c.t,negative*30,'龙胆负能力种类附伤','true');st.zhaoSixRound=c.round+1;}if(c.a.hp>0&&conditionStatusRules.conditionPresent(c.a,c.round))healthRules.drainPercent(c,c.t.stats.maxHp/4,'龙胆异常吸取');},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(st.dragonGallImmunityPendingRound===c.round){const oldUntil=st.dragonGallImmuneUntil??0;st.dragonGallImmuneFrom=oldUntil>=c.round?Math.min(st.dragonGallImmuneFrom??1,c.round+1):c.round+1;st.dragonGallImmuneUntil=Math.max(oldUntil,c.round+2);delete st.dragonGallImmunityPendingRound;}if(st.zhaoFailureRound!==c.round)return;for(const k of ['atk','def','spa','spd','spe','acc'])if(c.a.stages[k]<0)c.stage(c.a,-2*c.a.stages[k],[k]);}
}};

registry[1639]={name:'天奔流·东辉',sourceHash:'577ee58f',traits:{},deferred:['真实再次登场重新检查登场首回合条件，当前首次登场全部自身分支已实现'],hooks:{
roundStart(c){if(c.round===1)c.a.soulState.donghuiEntryReady=!Object.values(c.t.stages).some(n=>n>0);},
opponentSkillResolved(c){if(c.round!==1||!c.a.soulState.donghuiEntryReady||['status','item'].includes(c.m.kind))return;c.a.soulState.donghuiShieldRound=c.round;if(c.clear(c.t))c.ailment(c.t,'疲惫',c.a);},
beforeIncomingDamage(c){const st=c.a.soulState;if(['fixed','percent'].includes(c.type)&&c.round<=(st.donghuiReductionUntil??0))c.amount*=Math.max(0,1-(st.donghuiReduction??0)*((c.damageReductionIgnore??0)>=1?0:1));},
beforeAilment(c){if(c.round<=(c.a.soulState.donghuiWeakImmuneUntil??0)&&conditionStatusRules.isWeakening(c.status))c.blocked=true;},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(st.donghuiShieldRound===c.round)c.addShield(c.a,Math.floor(c.a.stats.maxHp/3),'donghui-entry');const n=c.a.moves.filter(k=>c.a.pp[k]<c.maxPP(k)).length;if(n){st.donghuiReduction=n*.2;st.donghuiReductionUntil=c.round+1;}if(n===c.a.moves.length){c.restorePP(c.a,1);c.clearBoost(c.t);c.heal(c.a,c.a.stats.maxHp/3,'天奔释罪');for(const k of Object.keys(c.a.ailments))if(conditionStatusRules.isWeakening(k))c.clearAilment(c.a,k);st.donghuiWeakImmuneUntil=c.round+1;}}
}};

registry[1645]={name:'极光仙子',sourceHash:'c8d2f54e',traits:{},deferred:['击败对手后令其真实下只出场精灵首次属性技能无效，当前对手不作后继目标'],hooks:{
roundStart(c){c.a.soulState.auroraPowerRound=c.a.hp<c.t.hp?c.round:0;c.a.soulState.auroraExtraPower=Math.min(200,Math.abs(c.a.stats.maxHp-c.t.stats.maxHp));},
beforeDamage(c){if(c.a.soulState.auroraPowerRound===c.round)c.power+=c.a.soulState.auroraExtraPower;},
afterAttack(c){if(c.a.hp>0)c.heal(c.a,c.settledDamage*.5,'极光攻击伤害回复');},
afterUse(c){if(c.a.hp>0&&c.t.hp>0&&!['status','item'].includes(c.m.kind))c.stage(c.a,2,['spa']);}
}};

registry[1647]={name:'恶咒巫师·科萨斯',sourceHash:'ca4b444a',traits:{healingMultiplier:f=>f.soulState.corsasAttackTriggered?.1:1,statusPriority:f=>(f.soulState.corsasStatusRound??0)>0&&f.soulState.corsasStatusRound===f.soulState.calculationRound?1:0,attackMultiplier:f=>1+(f.soulState.corsasDamageRound===f.soulState.calculationRound?(f.soulState.corsasDamageBonus??0)/100:0)},deferred:['真实再次登场重置首次被攻击/属性命中资格，首次在场已完整实现'],hooks:{
roundStart(c){c.a.soulState.corsasStartHP=c.a.hp;},
opponentSkillResolved(c){if(!c.successful||c.a.hp<=0||c.m.kind==='item')return;const st=c.a.soulState;if(c.m.kind==='status'){if(st.corsasStatusTriggered)return;st.corsasStatusTriggered=true;const immune=c.damageImmune(c.t,'fixed');if(c.t.hp>0)c.hurt(c.t,180,'科萨斯首次被属性命中','fixed');if(immune)st.corsasPowerDodge=1;}else if(!st.corsasAttackTriggered)st.corsasAttackTriggered=true;},
beforeDodge(c){if(c.a.soulState.corsasPowerDodge>0&&c.m.power<90){c.a.soulState.corsasPowerDodge--;c.dodge=!c.alwaysHit;}},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState,diff=c.a.hp-st.corsasStartHP;if(diff<=0)st.corsasStatusRound=c.round+1;else{st.corsasDamageBonus=Math.min(180,diff);st.corsasDamageRound=c.round+1;}if(!st.corsasAttackTriggered)return;const n=Math.min(400,c.a.stats.maxHp-c.a.hp);st.corsasRequestedShield=n;const source='corsas-nonstack',old=c.shieldSourceValue(c.a,source);c.addShield(c.a,Math.max(0,n-old),source);c.refreshBarrier(c.a,n,source);}
}};

registry[1656]={name:'银椋·奥雷莫德',sourceHash:'223421d8',traits:{},deferred:['真实下场后保留天雷银椋等级，再次登场沿用该等级；当前自身召唤/初始1/升级至3及各级当前双方分支立即实现'],hooks:{
battleStart(c){c.a.soulState.thunderStarling=1;},roundStart(c){c.a.soulState.starlingAttackOut=0;c.a.soulState.starlingAttackIn=0;},
damageDealt(c){if(c.type!=='attack')return;const st=c.a.soulState;st.starlingAttackOut=(st.starlingAttackOut??0)+c.settledDamage;if(st.thunderStarling===1&&c.settledDamage>0&&c.settledDamage<300&&c.t.hp>0)c.ailment(c.t,'害怕',c.a);},
attackDamageTaken(c){const st=c.a.soulState;st.starlingAttackIn=(st.starlingAttackIn??0)+c.settledDamage;if(c.a.hp>0&&c.t.hp>0&&st.thunderStarling===1&&c.settledDamage>0&&c.settledDamage<300)c.ailment(c.t,'麻痹',c.a);},
afterUse(c){const n=c.a.soulState.thunderStarling;if(c.a.hp>0&&c.t.hp>0&&n>=2&&!['status','item'].includes(c.m.kind)&&c.actionAttackDamage<(n===3?400:300))c.ailment(c.t,'害怕',c.a);},
opponentSkillResolved(c){const n=c.a.soulState.thunderStarling;if(c.a.hp>0&&c.t.hp>0&&n>=2&&!['status','item'].includes(c.m.kind)&&c.attackDamage<(n===3?400:300))c.ailment(c.t,'麻痹',c.a);},
combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(st.starlingAttackOut>300||st.starlingAttackIn>300)st.thunderStarling=Math.min(3,st.thunderStarling+1);}
}};

registry[1658]={name:'眠降·玛缇娜',sourceHash:'2ee7e0e0',traits:{attackHitCount:f=>f.soulState.martinaHits??2,attackMultiplier:f=>f.soulState.martinaEqualDefenseRound===f.soulState.calculationRound?1.4:1},hooks:{
battleStart(c){c.a.soulState.martinaHits=2;},
roundStart(c){const st=c.a.soulState,comparison=Math.sign(c.panelStat(c.a,'def')-c.panelStat(c.a,'spd'));st.martinaEqualDefenseRound=0;st.martinaDefensePendingRound=0;if(comparison===0)st.martinaEqualDefenseRound=c.round;else c.stage(c.a,2,[comparison<0?'def':'spd']);},
afterUse(c){if(c.a.hp<=0||['status','item'].includes(c.m.kind))return;const st=c.a.soulState,attack=c.outgoingSettledDamage('attack');if(attack<=400){st.martinaHits=Math.min(8,st.martinaHits+2);return;}st.martinaHits=2;if(c.t.hp>0)c.hurt(c.t,attack,'眠降高伤百分比追加','percent');}
}};

const ghostActive=(f,k)=>{const e=f.effects['鬼祰·'+k],r=f.soulState.calculationRound??1;return !!e&&e.start<=r&&e.end>=r;};
function ghostEntry(c){const st=c.a.soulState;if(conditionStatusRules.conditionPresent(c.t,c.round)){for(const k of Object.keys(c.t.ailments))if(c.t.ailments[k]>=c.round&&conditionStatusRules.isAuxiliary(k))c.convertAilment(c.t,k,'诅咒',4);}else{const own=c.fifthPP(c.a),foe=c.fifthPP(c.t);for(const k of c.ghostKinds.slice(0,Math.max(0,own)))if(!ghostActive(c.a,k))c.gainGhost(c.a,k);let left=Math.max(0,foe);for(const k of c.ghostKinds)if(left>0&&ghostActive(c.a,k)){delete c.a.effects['鬼祰·'+k];left--;}st.ghostEntryKnownFinal=c.ghostCount(c.a);}if(c.t.ailments['诅咒']>=c.round){st.ghostEntryCurse=true;c.t.soulState.defeatEffectsSuppressed={sourceSoul:2085,sourceSide:c.a.side};}}
function ghostThreshold(c,own){const attack=own?(c.actionAttackDamage??0):(c.attackDamage??0),low=own?'魍':'魑',high=own?'魉':'魅';if(attack<300)c.gainGhost(c.a,low);if(attack>200)c.gainGhost(c.a,high);}
registry[2085]={name:'百罗鬼帝',sourceHash:'ef96b725',traits:{damageReductionIgnore:f=>f.soulState.ghostEntryCurse?1:0,attackMultiplier:f=>ghostActive(f,'魑')?2:1,opponentPercentDamageMultiplier:f=>f.hp>0&&ghostActive(f,'魍')?1.25:1},deferred:['真实再次登场按届时双方第五PP及异常重新执行入场；当前首次入场确定分支已做','本次在场的无视减伤/禁被击败标记在真实下场时结束；鬼祰直到下回合结束的当前时限已完整实施'],abilities:{entry:ghostEntry,gainGhost:(c,k)=>c.gainGhost(c.a,k)},hooks:{
battleStart:ghostEntry,
beforeDamage(c){if(ghostActive(c.a,'魉'))c.ignoreLimit=true;},
beforeIncomingAttack(c){if(ghostActive(c.a,'魅'))c.immuneAttack=true;},
afterUse(c){if(c.a.hp>0&&!['status','item'].includes(c.m.kind))ghostThreshold(c,true);},
opponentSkillResolved(c){if(c.a.hp>0&&!['status','item'].includes(c.m.kind))ghostThreshold(c,false);}
}};

// Death-only callbacks retain their original timing; the common defeat gate blocks only these classified hooks.
for(const id of [410,560,638,645,879])registry[id]={...registry[id],defeatOnlyHooks:Object.freeze(['damageTaken'])};


registry[1660]={name:'古温婆婆',sourceHash:'9c0ed9b6',traits:{},hooks:{roundStart(c){if(c.a.hp<=0||c.t.hp<=0)return;if(!c.ailment(c.t,'中毒',c.a)){c.clearAilments(c.a);c.heal(c.a,360,'古温婆婆中毒未触发回复');}},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(conditionStatusRules.active(c.t,'中毒',c.round))c.ailment(c.t,'寄生',c.a);else c.clear(c.t);}}};


function gainFutureSingularity(c,n=1){c.a.soulState.futureSingularity=Math.min(3,(c.a.soulState.futureSingularity??0)+n);}
registry[1664]={name:'逐界苍星',sourceHash:'46f1182e',partial:false,unimplemented:[],deferred:['真实再次登场重新记录首次使用技能并解析','自身真实下场解放所解析技能，攻击恢复自己最大HP三分一、属性自己各PP回1；死亡下场改为己方下只精灵HP满或全PP，未来奇点下场保留'],traits:{noPPConsumption:f=>(f.soulState.futureRoundLayers??0)>=2,skillPriority:f=>f.soulState.futureSpeedHigher?1:0},abilities:{gainFutureSingularity},hooks:{
roundStart(c){const st=c.a.soulState;st.futureRoundLayers=st.futureSingularity??0;if(st.futureRoundLayers>=1)c.timed(c.t,'速度强化失效',1,{});const p=Math.sign(panel(c,c.a,'spe')-panel(c,c.t,'spe'));st.futureSpeedHigher=p>0;st.futureSpeedComparisonPending=false;st.futureHpHigher=c.a.hp>c.t.hp;},
opponentPriority(c){if((c.a.soulState.futureRoundLayers??0)>=3)c.priority=Math.min(3,c.priority);},
opponentBeforeUse(c){if(c.m.kind==='item'||c.a.soulState.futureFirstUsed||c.a.hp<=0)return;c.a.soulState.futureFirstUsed=true;if(Object.keys(c.t.soulState.parsedSkills??{}).length)return;(c.t.soulState.parsedSkills??={})[c.m.id]={sourceSide:c.a.side,soulId:1664,round:c.round};c.a.soulState.futureParsedMove={id:c.m.id,name:c.m.name,kind:c.m.kind};gainFutureSingularity(c);},
beforeAilment(c){const st=c.a.soulState;if((st.futureSingularity??0)<=0)return;st.futureSingularity--;c.blocked=true;if(st.futureSingularity===0){c.clear(c.t);c.clearBoost(c.t);}},
beforeDamage(c){const n=c.a.soulState.futureRoundLayers??0;if(n>=1)c.stab=1.5;if(n>=2)c.ignoreShield=true;},
afterUse(c){if(c.m.kind==='item'||(c.a.soulState.futureRoundLayers??0)<3)return;for(const k of c.a.moves)if(!c.isFifthSkill(k))c.a.pp[k]=Math.min(c.maxPP(k),c.a.pp[k]+1);},
combatEnd(c){if(c.a.hp>0&&c.a.soulState.futureHpHigher)c.stage(c.a,1);}
}};


registry[1679]={name:'兔兔警探',sourceHash:'6d797bbd',traits:{},hooks:{afterUse(c){if(c.a.hp<=0||c.m.kind==='item')return;if(c.round%2)healthRules.drainFixed(c,300,'兔兔警探奇数回合吸取');else healthRules.drainPercent(c,c.t.stats.maxHp/3,'兔兔警探偶数回合吸取');}}};


function gainJueke(c,n=1){c.a.soulState.jueke=Math.min(6,(c.a.soulState.jueke??0)+n);}
registry[1668]={name:'爵刻·黑沃德',sourceHash:'38bc5af7',traits:{skillPriority:f=>(f.soulState.jueke??0)>0?1:0},abilities:{gainJueke},deferred:['真实场下非满HP精灵数量对首次入场n的额外贡献；无场下目标时n=1已实现流血1回合与爵刻1枚','真实再次登场按真实n重新附加流血并增加爵刻至6，爵刻离场保留','消耗爵刻后己方所有真实不在场精灵恢复100HP；当前自身吸取最大HP三分一与消费1枚已实现'],hooks:{battleStart(c){gainJueke(c);c.entrySelfAilment('流血',1);},beforeUse(c){if(['status','item'].includes(c.m.kind))return;const st=c.a.soulState;st.juekeDoubleAttack=c.random()<.4;st.juekeAttackRound=c.round;st.juekeAttackMove=c.m.id;},beforeDamage(c){const st=c.a.soulState;if(st.juekeDoubleAttack&&st.juekeAttackRound===c.round&&st.juekeAttackMove===c.m.id)c.modifier*=2;},afterUse(c){if(c.a.hp<=0||c.m.kind==='item')return;const st=c.a.soulState;if(c.m.kind!=='status'&&st.juekeAttackRound===c.round&&st.juekeAttackMove===c.m.id&&!st.juekeDoubleAttack)healthRules.drainFixed(c,200+Math.floor(c.random()*201),'爵刻攻击未触发随机吸取');if((st.jueke??0)>0){healthRules.drainPercent(c,c.t.stats.maxHp/3,'爵刻消费百分比吸取');st.jueke--;}}}};


registry[1672]={name:'恶鬼·图伽',sourceHash:'4254ff4c',deferred:['战阶随机弱化池抽中并施加凝滞后的真实主动切换限制与切换生命周期；当前双方异常施加、持续和凝滞免控制分支不延期'],traits:{},hooks:{roundStart(c){c.a.soulState.tugaStartAilments=conditionStatusRules.conditionPresent(c.t,c.round)?Object.values(c.t.ailments).filter(end=>end>=c.round).length:0;},afterUse(c){const n=c.a.soulState.tugaStartAilments??0;if(c.a.hp>0&&c.m.kind!=='item'&&n>0)healthRules.drainFixed(c,n*100,'恶鬼回合初异常种数吸取');},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const names=soulStatusPools.pool(undefined,{includeRestricted:true}).map(x=>x.name).filter(conditionStatusRules.isWeakening),result=c.randomAilmentsFrom(2,names,null),success=result.filter(x=>x.applied).length;if(success<result.length)healthRules.drainPercent(c,c.t.stats.maxHp/3,'恶鬼双异常未触发吸取');}}};

registry[1677]={name:'冥契·格斯塔丝',sourceHash:'bdb1b98d',traits:{},deferred:['对手真实主动切换并真实下只出战时，自身恢复所有技能1PP，已全满则恢复己方所有精灵100HP；触发本身依赖真实切换/登场','回合结束未击败时，为场下体力最低首位精灵回复最大HP四分一；击败时改为二分一。当前自身次回必暴/攻击先制独立实现'],hooks:{combatEnd(c){if(c.a.hp<=0)return;if(c.t.hp>0)c.timed(c.a,'必定暴击',1,{},c.round+1);else c.timed(c.a,'id984',1,{amount:1,attackOnly:true},c.round+1);}}};
function emperorSeals(c,n){c.a.soulState.yongchang=Math.max(0,Math.min(6,(c.a.soulState.yongchang??0)+n));}
function emperorExhaust(c){for(const k of c.a.moves)c.a.pp[k]=0;c.a.hp=Math.min(1,c.a.hp);c.a.soulState.emperorExhaustedAt=c.round;}
registry[1678]={name:'始皇帝·嬴政',sourceHash:'7b65acca',partial:true,unimplemented:['Q-N20-4468-001：魂印三玺恢复PP字段冲突'],traits:{immuneAilments:['臣服'],attackAlwaysHit:f=>(f.soulState.emperorReignEnd??0)>=(f.soulState.emperorRound??Infinity)},abilities:{gainSeals:emperorSeals},deferred:['真实再次登场获得2方永昌玺；登场上回合对手真实主动切换额外2方，资源离场/后继处理','6方时对方下回合无法真实主动换宠；君临结束及第五到期自身下回合无法真实主动换宠'],hooks:{battleStart(c){emperorSeals(c,2);c.entryAilment(c.t,'臣服');},roundStart(c){const st=c.a.soulState;st.emperorRound=c.round;st.emperorRoundSeals=st.yongchang??0;if(st.emperorRoundSeals>=6&&!st.emperorReignUsed){st.emperorReignUsed=true;st.emperorReignEnd=c.round+5;}},beforeDamage(c){const n=c.a.soulState.emperorRoundSeals??0;if(n>=1)c.modifier*=1+n*.11;},beforeCrit(c){if((c.a.soulState.emperorReignEnd??0)>=c.round)c.forceCrit=true;},beforeAilment(c){if((c.a.soulState.emperorRoundSeals??0)>=4&&conditionStatusRules.isControl(c.status))c.blocked=true;},opponentPriority(c){if((c.a.soulState.emperorRoundSeals??0)>=5)c.priority=Math.min(c.priority,c.ownPriority);},afterUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const n=c.a.soulState.emperorRoundSeals??0;if(n>=2&&c.t.hp>0)c.hurt(c.t,n*37,'永昌玺攻击后附加','fixed');if((c.a.soulState.emperorReignEnd??0)>=c.round&&c.t.hp>0)c.hurt(c.t,221,'君临天下使用后附加','true');},combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState,n=st.emperorRoundSeals??0;if(n>=3){c.heal(c.a,221,'永昌玺三方回复');const conflicts=[];for(const k of c.a.moves){if(c.a.pp[k]===0)c.a.pp[k]=1;else if(c.a.pp[k]!==1)conflicts.push({move:k,pp:c.a.pp[k]});}if(conflicts.length)st.pendingEmperorPPRestore={question:'Q-N20-4468-001',round:c.round,conflicts};}if(c.t.hp<=0){st.yongchang=0;if(st.emperorFreezeEnd>=c.round){emperorExhaust(c);delete st.emperorFreezeEnd;}}else if(!c.used[c.t.side])emperorSeals(c,1);else if(!(st.emperorFreezeEnd>=c.round))emperorSeals(c,-1);},roundEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;if(st.emperorReignEnd===c.round||st.emperorFreezeEnd===c.round){emperorExhaust(c);if(st.emperorFreezeEnd===c.round)delete st.emperorFreezeEnd;}}}};

registry[1681]={name:'夜罗·琉彩',sourceHash:'6267b18b',traits:{dodgeChance:f=>(f.soulState.liucaiDodgeRound??0)===(f.soulState.liucaiRound??-1)?1:0},hooks:{roundStart(c){c.a.soulState.liucaiRound=c.round;},attackDamageTaken(c){if(c.a.hp<=0||c.settledDamage<=0)return;c.heal(c.a,c.a.stats.maxHp/3,'夜罗受攻回复');if(c.a.hp<c.t.hp)c.a.soulState.liucaiDodgeRound=c.round+1;},combatEnd(c){if(c.a.hp>0&&(c.a.roundSettledAttackDamage??0)===0)c.timed(c.a,'必定暴击',1,{},c.round+1);}}};
const allSixBoosted=f=>['atk','def','spa','spd','spe','acc'].every(k=>f.stages[k]>0);
registry[1683]={name:'妤玫',sourceHash:'9a471d8c',partial:true,unimplemented:['Q-N20-4474-001：闪避全属性提升主语','Q-N20-4474-002：命中前/使用时的MISS清强时点'],traits:{},hooks:{roundStart(c){const had=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.yumeiDoubleRound=had?c.round:0;if(!had){c.stage(c.a,1);c.stage(c.t,1);}},beforeDamage(c){if(c.a.soulState.yumeiDoubleRound===c.round)c.modifier*=2;},beforeSkillDodge(c){if(c.alwaysHit)return;const own=allSixBoosted(c.a),foe=allSixBoosted(c.t);if(own!==foe)throw Error('Q-N20-4474-001：1683闪避条件主语未确认');if(own&&foe)c.dodge=true;},beforeUse(c){c.a.soulState.yumeiClearCandidate={round:c.round,move:c.m.id,boosted:allSixBoosted(c.a)};},beforeSkillHit(c){if(allSixBoosted(c.a)){c.a.soulState.yumeiClearHit={round:c.round,move:c.m.id};c.clearBoost(c.t);}},afterUse(c){const candidate=c.a.soulState.yumeiClearCandidate,hit=c.a.soulState.yumeiClearHit;if(candidate?.round===c.round&&candidate.move===c.m.id&&candidate.boosted&&!(hit?.round===c.round&&hit.move===c.m.id))c.a.soulState.pendingYumeiMissClear={question:'Q-N20-4474-002',round:c.round,move:c.m.id};}}};
registry[1687]={name:'启源·伊洛特斯',sourceHash:'e6fb4d84',traits:{},hooks:{roundStart(c){if(c.a.ailments['麻痹']>=c.round&&c.clearAilment(c.a,'麻痹')){c.a.soulState.iluoParalysisClearedRound=c.round;c.timed(c.a,'必定暴击',1,{});}},afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.iluoParalysisClearedRound===c.round&&!['status','item'].includes(c.m.kind)&&c.actionAttackDamage===0)c.ailment(c.t,'麻痹',c.a,false,false,null,{probabilityPercent:100});},combatEnd(c){if(c.a.hp>0&&!c.usedSkillThisRound(c.a)&&c.ailment(c.a,'麻痹',c.a,false,false,null,{probabilityPercent:100}))c.a.soulState.iluoDefenseSpeedRound=c.round+1;}}};
registry[1694]={name:'冥霞',sourceHash:'4d6b196b',partial:true,unimplemented:['Q-N20-4482-001：双方强化/弱化种类是否去重'],traits:{},deferred:['战阶阈值满足后下回合对手无法真实主动切换精灵，当前双方能力翻倍分支不随该真实换宠依赖延期'],hooks:{roundStart(c){const active=Object.values(c.t.stages).some(n=>n>0)||Object.values(c.a.stages).some(n=>n<0);c.a.soulState.mingxiaActiveRound=active?c.round:0;if(active){c.a.soulState.ignoreOwnWeakThis=true;c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;}},beforeAilment(c){if(c.a.soulState.mingxiaActiveRound===c.round){c.blocked=true;if(!c.reflected)c.reflect();}},combatEnd(c){if(c.a.hp<=0)return;const pos=[],neg=[];for(const f of [c.a,c.t])for(const [k,n]of Object.entries(f.stages)){if(n>0)pos.push(k);if(n<0)neg.push(k);}const sum=pos.length>=5&&neg.length>=5,unique=new Set(pos).size>=5&&new Set(neg).size>=5;if(sum!==unique){c.a.soulState.pendingMingxiaKindCount={question:'Q-N20-4482-001',round:c.round,positiveSlots:pos.length,negativeSlots:neg.length,positiveKinds:new Set(pos).size,negativeKinds:new Set(neg).size};return;}if(sum){for(const f of [c.a,c.t])for(const [k,n]of Object.entries({...f.stages}))if(n)c.stage(f,n,[k]);c.a.soulState.mingxiaSwitchBlockPending={round:c.round+1,deferred:true};}}}};
registry[1700]={name:'普鲁修托',sourceHash:'5682455e',traits:{immuneAilments:f=>{const st=f.soulState;if(st.puRound!==st.calculationRound)return [];return [...(st.puRec?['麻痹','害怕','疲惫']:[]),...(st.puDis?['冰封','焚烬','感染']:[])];}},deferred:['真实每次再次登场重新判断双方属性，克制则自身回能Ⅰ3回、反向微弱则敌失能Ⅰ3回，已有则刷新3；首次真实初始化已独立实现','回能Ⅰ/失能Ⅰ持有者真实下场不保留，按持有者而非施加者离场清除，等待真实换宠体系'],hooks:{battleStart(c){const own=c.typeEffectiveness(c.a.type,c.t.type),foe=c.typeEffectiveness(c.t.type,c.a.type),source={origin:'soul',sourceSide:c.a.side,url:'https://api.seerapi.com/v1/soulmark/1700',revision:'5682455e',soulId:1700};c.a.soulState.puEntryAffinity={own,foe};if(own>1)c.grantPPState(c.a,'回能Ⅰ',3,source);if(foe<1)c.grantPPState(c.t,'失能Ⅰ',3,source);},roundStart(c){const st=c.a.soulState;st.puRound=c.round;st.puRec=!!c.ppState(c.a,'回能Ⅰ');st.puDis=!!c.ppState(c.t,'失能Ⅰ');},combatEnd(c){if(c.a.hp<=0)return;if(c.a.soulState.puRec)c.heal(c.a,300,'回能回合初快照回复');if(c.a.soulState.puDis&&c.t.hp>0)c.hurt(c.t,300,'失能回合初快照固定','fixed');},roundEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState,rec=c.ppState(c.a,'回能Ⅰ'),dis=c.ppState(c.t,'失能Ⅰ');if(st.puRec&&(!rec||rec.end<=c.round))c.timed(c.a,'回能Ⅰ消失攻击增伤',1,{damageMultipliers:{attack:2}},c.round+1);if(st.puDis&&(!dis||dis.end<=c.round))c.timed(c.a,'失能Ⅰ消失固粉增伤',1,{damageMultipliers:{fixed:2,percent:2}},c.round+1);}}};
registry[1708]={name:'嫉妒·哲利斯',sourceHash:'3f3faf99',partial:false,unimplemented:[],deferred:['自身被击败时己方额外已阵亡队友每只500固定伤害；当前自身这次死亡对应500固定与致死清回合已实现'],traits:{attackMultiplier:f=>f.soulState.jealousHealthRound===f.soulState.calculationRound?1.5:1,attackReduction:f=>f.soulState.jealousHealthRound===f.soulState.calculationRound?.25:0},hooks:{roundStart(c){const st=c.a.soulState;st.jealousHealthRound=c.t.stats.maxHp>c.a.stats.maxHp?c.round:0;const p=panel(c,c.t,'spe')>panel(c,c.a,'spe');if(p)c.stage(c.t,-1,['def','spe']);},death(c){if(c.a.soulState.jealousDeathDone||c.t.hp<=0)return;c.a.soulState.jealousDeathDone=true;const before=c.t.hp;c.hurt(c.t,500,'嫉妒自身阵亡一只','fixed');if(before>0&&c.t.hp<=0)c.clear(c.t);}}};

registry[1711]={name:'箫澈',sourceHash:'58b6e759',partial:true,unimplemented:['Q-N20-4438-001：每次受伤与下一次免疫的多段单位待答'],traits:{},hooks:{damageTaken(c){if(c.a.hp<=0)return;const type=c.type??'attack',n=c.settledDamage??0;if(n>0&&['attack','fixed','percent'].includes(type))c.a.soulState.xiaoPositiveDamageRound=c.round;if(n<300)return;if(type==='attack'){if((c.t.soulState.attackSegmentsThisUse??1)>1)throw Error('Q-N20-4438-001：1711多段阈值单位待答');c.a.counts.nextPinkImmunity=(c.a.counts.nextPinkImmunity??0)+1;if(c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'哀霆之声','percent');}else if(['fixed','percent'].includes(type)){c.a.counts.attackNullify=(c.a.counts.attackNullify??0)+1;c.heal(c.a,c.a.stats.maxHp/3,'悲龙之鸣回复');}},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const st=c.a.soulState;if(st.xiaoPositiveDamageRound===c.round)return;const rounds=c.clear(c.t),boost=c.clearBoost(c.t);if(rounds||boost)c.randomAilmentsFrom(1,['麻痹','害怕'],2099);},attackDamageTaken(c){if((c.settledDamage??0)>0)c.a.soulState.xiaoPositiveDamageRound=c.round;}}};

registry[1713]={name:'天后·弗丽嘉',sourceHash:'12e539ee',partial:true,unimplemented:['Q-N20-4498-001：累计或本回合消耗两预言API内部冲突'],deferred:['真实再次登场施加两预言；首次初始化已实现','低半体与己方场下体力最高的首位精灵交换体力，自身回1PP独立已做','凯旋预言下场保留'],traits:{},hooks:{battleStart(c){const marks=c.t.soulState.prophecies??={};for(const k of ['frustration','lost'])marks[k]={sourceSide:c.a.side,revision:'12e539ee',url:'https://api.seerapi.com/v1/soulmark/1713'};},beforeRoundStart(c){const st=c.a.soulState;if(st.friggClearRound!==c.round)return;delete st.friggClearRound;const abnormal=Object.values(c.a.ailments).some(n=>n>=c.round),negative=Object.values(c.a.stages).some(n=>n<0)&&c.canRemoveNegative(c.a);c.clearAilments(c.a);c.clearNegative(c.a);if(abnormal&&!Object.values(c.a.ailments).some(n=>n>=c.round)||negative&&!Object.values(c.a.stages).some(n=>n<0))c.timed(c.a,'id984',1,{amount:1});},roundStart(c){if(c.a.hp>c.a.stats.maxHp/2)c.a.soulState.friggClearRound=c.round+1;},combatEnd(c){if(c.a.hp<=0)return;const hist=c.t.soulState.prophecyHistory??{},a=hist.frustration,b=hist.lost;if(a?.sourceSide===c.a.side&&b?.sourceSide===c.a.side){if(a.round===c.round&&b.round===c.round){(c.a.soulState.prophecies??={}).triumph={sourceSide:c.a.side,revision:'12e539ee'};}else c.a.soulState.pendingTriumph={question:'Q-N20-4498-001',round:c.round,frustration:a.round,lost:b.round};}if(c.a.hp<c.a.stats.maxHp/2)c.restorePP(c.a,1);}}};

registry[1714]={name:'德布比特',sourceHash:'5cd3c296',partial:true,unimplemented:['Q-N20-4489-002/003：特殊持续标记清除/回复来源交互待答'],deferred:['真实入场按双方场下阵亡数≥2/4/6/8/10触发标记与免弱/免异常/必先/敌技能无效，当前初次零队友不伪造计数','有回体时按己方场下阵亡每只20%攻击增伤；有失体按对方场下每只10%或20%固粉增伤原文存在API内部冲突，当前零计数共同结果0，完整冲突留档','体力标记持有者真实下场清除'],traits:{},hooks:{roundStart(c){c.a.soulState.debuMarkRound=c.round;c.a.soulState.debuRec=!!c.healthState(c.a,'回体Ⅰ');c.a.soulState.debuDis=!!c.healthState(c.t,'失体Ⅰ');},afterStateExpiry(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(st.debuMarkRound!==c.round)return;if(st.debuRec&&!c.healthState(c.a,'回体Ⅰ')&&c.t.hp>0&&c.clear(c.t))c.timed(c.t,'attackBlock',1,{},c.round+1);if(st.debuDis&&!c.healthState(c.t,'失体Ⅰ')&&c.t.hp>0&&c.clearBoost(c.t))c.timed(c.t,'statusBlock',1,{},c.round+1);}}};

const royalGuards=typeof module==='object'&&module.exports?require('./guard-states.js'):globalThis.BattleGuardStates;
registry[1724]={name:'武心婵',sourceHash:'77c3c93c',partial:true,unimplemented:['Q-N20-4500-001：龙鳞和其它同类免疫重叠的触发顺序待答','Q-N20-4489-001：第五解放当前龙鳞的操作定义待答'],deferred:['位于出战背包时双方真实场下精灵HP/PP不减少','红黄蓝三色龙鳞真实下场保留、后续再次入场不重新获得首次三色'],traits:{fifthLocked:f=>!f.soulState.royalScaleContract?.unlocked},hooks:{battleStart(c){const source={origin:'soul',sourceSide:c.a.side,url:'https://api.seerapi.com/v1/soulmark/1724',revision:'77c3c93c'};c.a.soulState.royalScaleContract={armed:true,unlocked:false,whiteIssued:false,source};for(const k of ['red','yellow','blue'])royalGuards.grant(c.a,k,c.round,source);},beforeDamage(c){if(c.m.type==='龙')c.stab=1.5;}}};

registry[1715]={name:'普达戈尔',sourceHash:'f91439c9',partial:true,unimplemented:['Q-N20-4472-002：失明/封锁是否算未命中待答'],traits:{},hooks:{afterUse(c){if(c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0)return;c.ailment(c.t,'沉默',c.a,false,false,null,{probabilityPercent:100});if(c.successful)c.hurt(c.t,c.t.stats.maxHp/3,'普达戈尔命中附伤','percent');else if(c.invalidReason?.blind||c.invalidReason?.blocked)throw Error('Q-N20-4472-002：1715失明/整招失效是否算未命中待确认');else if(!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-2);},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.t.ailments['沉默']>=c.round)c.addShield(c.a,400,'soul1715:'+c.round);else c.clear(c.t);}}};
function kutanAfterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item'||!c.a.moves.some(k=>c.a.pp[k]===0))return;if(!c.ailment(c.t,'流血',c.a,false,false,null,{probabilityPercent:100})){for(const k of c.a.moves)c.a.pp[k]=c.maxPP(k);c.timed(c.t,'技能命中效果失效',1,{},c.round+1);}}
registry[1717]={name:'库坦',sourceHash:'98b92253',traits:{},deferred:['真实战斗阶段结束自身无能力提升时禁止对手下回合主动切换精灵'],hooks:{roundStart(c){c.stage(c.a,2,['atk','def']);},afterUse:kutanAfterUse,opponentAfterUse:kutanAfterUse}};
function wingQualifiedBands(c,bands){if(!Array.isArray(bands)||bands.some(n=>![2,6,12].includes(n)))throw Error('1719阈值前提无效');if(bands.includes(2))c.ailment(c.t,'寄生',c.a,false,false,null,{probabilityPercent:100});if(bands.includes(6)){const keys=['atk','def','spa','spd','spe','acc'],up=keys.every(k=>c.t.stages[k]>0),down=keys.every(k=>c.t.stages[k]<0);if(up||down){c.stage(c.t,up?1:-1);if(c.on(c.a,'免弱')||c.on(c.a,'禁强化')||c.on(c.a,'弱化不可解除反转')||c.on(c.a,'强化保护')||c.on(c.a,'幽蝶强化保护'))throw Error('Q-N20-4505-002：复制等级的保护/免疫交互待答');for(const k of keys){const d=c.t.stages[k]-c.a.stages[k];if(d)c.stage(c.a,d,[k]);}}}if(bands.includes(12))c.a.soulState.wingResetEnabledRound=c.round;}
function wingReset(c){if(c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0||c.a.soulState.wingResetEnabledRound!==c.round)return;const st=c.t.soulState;if(c.on(c.t,'强化保护')||c.on(c.t,'幽蝶强化保护')||c.on(c.t,'弱化不可解除反转')||c.on(c.t,'免弱')||c.on(c.t,'禁强化')||c.soulTrait(c.t,'weaknessImmune')||c.soulTrait(c.t,'entryWeaknessRounds')>=c.round||['消强按项反击','强化消失清回合','强化消失封属','强化被清封属','强化被清弱化','强化被清追加','强化被清吸取','强化被清惩罚'].some(k=>c.on(c.t,k)))throw Error('Q-N20-4505-002：重置与免疫/清除反制交互待答');const count=Object.values(c.t.stages).reduce((n,v)=>n+Math.abs(v),0);for(const k of Object.keys(c.t.stages))c.t.stages[k]=0;c.a.soulState.wingResetCount=(c.a.soulState.wingResetCount??0)+count;}
registry[1719]={name:'婕克拉德',sourceHash:'f04d5267',partial:true,unimplemented:['Q-N20-4505-001：净能力变化值n无来源公式，不猜阈值触发','Q-N20-4505-002：复制/重置特殊保护交互待答'],traits:{},abilities:{qualifiedBands:wingQualifiedBands},hooks:{roundStart(c){const st=c.a.soulState;st.wingResetCount=0;st.wingResetEnabledRound=0;c.stage(c.t,-2,['acc']);st.pendingNetStageDefinition={question:'Q-N20-4505-001',round:c.round,stages:{...c.t.stages}};},afterUse:wingReset,opponentAfterUse:wingReset,combatEnd(c){const n=c.a.soulState.wingResetCount??0;if(n>0&&c.a.hp>0&&c.t.hp>0)healthRules.drainFixed(c,n*100,'婕克拉德重置等级战阶吸取');}}};
});
