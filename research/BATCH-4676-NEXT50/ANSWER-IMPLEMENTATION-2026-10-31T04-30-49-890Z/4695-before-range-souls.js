(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.RangeSouls=factory;})(typeof globalThis!=='undefined'?globalThis:this,function(registry){
'use strict';
const conditionStatusRules=typeof module==='object'&&module.exports?require('./status-rules.js'):new Proxy({}, {get:(_target,key)=>globalThis.BattleStatusRules[key]});
const soulStatusPools=typeof module==='object'&&module.exports?require('./status-pools.js'):new Proxy({}, {get:(_target,key)=>globalThis.BattleStatusPools[key]});
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
  afterAttack(c){if(c.t.hp>0&&c.random()<.15)c.soulInstantKill4706(c.t,'魔王魂印秒杀');}
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
  beforeUse(c){if(c.a.soulState.marsExecute&&c.t.hp>0)c.soulInstantKill4706(c.t,'马尔修斯毁灭形态秒杀');},
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
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.t.hp){if(c.ailment(c.t,'麻痹',c.a,false,false,2))c.ailment(c.t,'烧伤',c.a,false,false,3);else{c.grantAttackPriority(c.a,2,2,'soul:'+c.a.soulId,false);c.a.soulState.glaBurnNext=2;}}if(c.a.soulState.glaTargetAiling){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'格劳恩斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'格劳恩斯魂印追加','percent');}}
}};
registry[2093]={name:'格劳恩斯 · 强化',sourceHash:'1d8519cd',deferred:['下场时九劫之痕和百炼之炎层数传给下一只队友；等待多精灵换宠流程'],traits:{attackPriority:f=>f.soulState.glaHigh?1:0},hooks:{
  roundStart(c){c.a.soulState.glaHigh=c.a.hp>c.t.hp;},
  afterUse(c){if(c.a.soulState.glaHigh&&c.a.hp>0){c.a.soulState.lightningReleaseEnd=c.round+2;c.a.soulState.nineScars=(c.a.soulState.nineScars??0)+1;}},
  afterAttack(c){if(c.a.soulState.glaBurnNext>0&&c.t.hp>0){c.a.soulState.glaBurnNext--;c.ailment(c.t,'焚烬',c.a);}},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.t.hp){if(c.ailment(c.t,'麻痹',c.a,false,false,3))c.ailment(c.t,'烧伤',c.a,false,false,3);else c.a.soulState.hundredFires=(c.a.soulState.hundredFires??0)+1;}if(conditionStatusRules.conditionPresent(c.a,c.round)||conditionStatusRules.conditionPresent(c.t,c.round))c.heal(c.a,c.a.stats.maxHp/3,'格劳恩斯强化魂印回复');if(c.a.hp>c.t.hp&&!(c.a.soulState.lightningReleaseEnd>=c.round)){c.t.soulState.nextStatusPriorityPenalty=(c.t.soulState.nextStatusPriorityPenalty??0)+2;c.t.soulState.nextStatusNoAilment=(c.t.soulState.nextStatusNoAilment??0)+2;}if(c.a.hp<c.t.hp&&!(c.t.ailments['烧伤']>=c.round)){c.grantAttackPriority(c.a,2,2,'soul:'+c.a.soulId,false);c.a.soulState.glaBurnNext=2;}}
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
registry[1678]={name:'始皇帝·嬴政',sourceHash:'7b65acca',traits:{immuneAilments:['臣服'],attackAlwaysHit:f=>(f.soulState.emperorReignEnd??0)>=(f.soulState.emperorRound??Infinity)},abilities:{gainSeals:emperorSeals},deferred:['真实再次登场获得2方永昌玺；登场上回合对手真实主动切换额外2方，资源离场/后继处理','6方时对方下回合无法真实主动换宠；君临结束及第五到期自身下回合无法真实主动换宠'],hooks:{battleStart(c){emperorSeals(c,2);c.entryAilment(c.t,'臣服');},roundStart(c){const st=c.a.soulState;st.emperorRound=c.round;st.emperorRoundSeals=st.yongchang??0;if(st.emperorRoundSeals>=6&&!st.emperorReignUsed){st.emperorReignUsed=true;st.emperorReignEnd=c.round+5;}},beforeDamage(c){const n=c.a.soulState.emperorRoundSeals??0;if(n>=1)c.modifier*=1+n*.11;},beforeCrit(c){if((c.a.soulState.emperorReignEnd??0)>=c.round)c.forceCrit=true;},beforeAilment(c){if((c.a.soulState.emperorRoundSeals??0)>=4&&conditionStatusRules.isControl(c.status))c.blocked=true;},opponentPriority(c){if((c.a.soulState.emperorRoundSeals??0)>=5)c.priority=Math.min(c.priority,c.ownPriority);},afterUse(c){if(c.a.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const n=c.a.soulState.emperorRoundSeals??0;if(n>=2&&c.t.hp>0)c.hurt(c.t,n*37,'永昌玺攻击后附加','fixed');if((c.a.soulState.emperorReignEnd??0)>=c.round&&c.t.hp>0)c.hurt(c.t,221,'君临天下使用后附加','true');},combatEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState,n=st.emperorRoundSeals??0;if(n>=3){c.heal(c.a,221,'永昌玺三方回复');for(const k of c.a.moves)if(c.a.pp[k]===0)c.a.pp[k]=1;}if(c.t.hp<=0){st.yongchang=0;if(st.emperorFreezeEnd>=c.round){emperorExhaust(c);delete st.emperorFreezeEnd;}}else if(!c.used[c.t.side])emperorSeals(c,1);else if(!(st.emperorFreezeEnd>=c.round))emperorSeals(c,-1);},roundEnd(c){const st=c.a.soulState;if(c.a.hp<=0)return;if(st.emperorReignEnd===c.round||st.emperorFreezeEnd===c.round){emperorExhaust(c);if(st.emperorFreezeEnd===c.round)delete st.emperorFreezeEnd;}}}};

registry[1681]={name:'夜罗·琉彩',sourceHash:'6267b18b',traits:{dodgeChance:f=>(f.soulState.liucaiDodgeRound??0)===(f.soulState.liucaiRound??-1)?1:0},hooks:{roundStart(c){c.a.soulState.liucaiRound=c.round;},attackDamageTaken(c){if(c.a.hp<=0||c.settledDamage<=0)return;c.heal(c.a,c.a.stats.maxHp/3,'夜罗受攻回复');if(c.a.hp<c.t.hp)c.a.soulState.liucaiDodgeRound=c.round+1;},combatEnd(c){if(c.a.hp>0&&(c.a.roundSettledAttackDamage??0)===0)c.timed(c.a,'必定暴击',1,{},c.round+1);}}};
const allSixBoosted=f=>['atk','def','spa','spd','spe','acc'].every(k=>f.stages[k]>0);
registry[1683]={name:'妤玫',sourceHash:'9a471d8c',traits:{},hooks:{roundStart(c){const had=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.yumeiDoubleRound=had?c.round:0;if(!had){c.stage(c.a,1);c.stage(c.t,1);}},beforeDamage(c){if(c.a.soulState.yumeiDoubleRound===c.round)c.modifier*=2;},beforeSkillDodge(c){if(!c.alwaysHit&&allSixBoosted(c.t))c.dodge=true;},beforeUse(c){if(allSixBoosted(c.a))c.clearBoost(c.t);}}};
registry[1687]={name:'启源·伊洛特斯',sourceHash:'e6fb4d84',traits:{},hooks:{roundStart(c){if(c.a.ailments['麻痹']>=c.round&&c.clearAilment(c.a,'麻痹')){c.a.soulState.iluoParalysisClearedRound=c.round;c.timed(c.a,'必定暴击',1,{});}},afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.iluoParalysisClearedRound===c.round&&!['status','item'].includes(c.m.kind)&&c.actionAttackDamage===0)c.ailment(c.t,'麻痹',c.a,false,false,null,{probabilityPercent:100});},combatEnd(c){if(c.a.hp>0&&!c.usedSkillThisRound(c.a)&&c.ailment(c.a,'麻痹',c.a,false,false,null,{probabilityPercent:100}))c.a.soulState.iluoDefenseSpeedRound=c.round+1;}}};
registry[1694]={name:'冥霞',sourceHash:'4d6b196b',traits:{},deferred:['战阶阈值满足后下回合对手无法真实主动切换精灵，当前双方能力翻倍分支不随该真实换宠依赖延期'],hooks:{roundStart(c){const active=Object.values(c.t.stages).some(n=>n>0)||Object.values(c.a.stages).some(n=>n<0);c.a.soulState.mingxiaActiveRound=active?c.round:0;if(active){c.a.soulState.ignoreOwnWeakThis=true;c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;}},beforeAilment(c){if(c.a.soulState.mingxiaActiveRound===c.round){c.blocked=true;if(!c.reflected)c.reflect();}},combatEnd(c){if(c.a.hp<=0)return;const pos=[],neg=[];for(const f of [c.a,c.t])for(const [k,n]of Object.entries(f.stages)){if(n>0)pos.push(k);if(n<0)neg.push(k);}const unique=new Set(pos).size>=5&&new Set(neg).size>=5;if(unique){for(const f of [c.a,c.t])for(const [k,n]of Object.entries({...f.stages}))if(n)c.stage(f,n,[k]);c.a.soulState.mingxiaSwitchBlockPending={round:c.round+1,deferred:true};}}}};
registry[1700]={name:'普鲁修托',sourceHash:'5682455e',traits:{immuneAilments:f=>{const st=f.soulState;if(st.puRound!==st.calculationRound)return [];return [...(st.puRec?['麻痹','害怕','疲惫']:[]),...(st.puDis?['冰封','焚烬','感染']:[])];}},deferred:['真实每次再次登场重新判断双方属性，克制则自身回能Ⅰ3回、反向微弱则敌失能Ⅰ3回，已有则刷新3；首次真实初始化已独立实现','回能Ⅰ/失能Ⅰ持有者真实下场不保留，按持有者而非施加者离场清除，等待真实换宠体系'],hooks:{battleStart(c){const own=c.typeEffectiveness(c.a.type,c.t.type),foe=c.typeEffectiveness(c.t.type,c.a.type),source={origin:'soul',sourceSide:c.a.side,url:'https://api.seerapi.com/v1/soulmark/1700',revision:'5682455e',soulId:1700};c.a.soulState.puEntryAffinity={own,foe};if(own>1)c.grantPPState(c.a,'回能Ⅰ',3,source);if(foe<1)c.grantPPState(c.t,'失能Ⅰ',3,source);},roundStart(c){const st=c.a.soulState;st.puRound=c.round;st.puRec=!!c.ppState(c.a,'回能Ⅰ');st.puDis=!!c.ppState(c.t,'失能Ⅰ');},combatEnd(c){if(c.a.hp<=0)return;if(c.a.soulState.puRec)c.heal(c.a,300,'回能回合初快照回复');if(c.a.soulState.puDis&&c.t.hp>0)c.hurt(c.t,300,'失能回合初快照固定','fixed');},roundEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState,rec=c.ppState(c.a,'回能Ⅰ'),dis=c.ppState(c.t,'失能Ⅰ');if(st.puRec&&(!rec||rec.end<=c.round))c.timed(c.a,'回能Ⅰ消失攻击增伤',1,{damageMultipliers:{attack:2}},c.round+1);if(st.puDis&&(!dis||dis.end<=c.round))c.timed(c.a,'失能Ⅰ消失固粉增伤',1,{damageMultipliers:{fixed:2,percent:2}},c.round+1);}}};
registry[1708]={name:'嫉妒·哲利斯',sourceHash:'3f3faf99',partial:false,unimplemented:[],deferred:['自身被击败时己方额外已阵亡队友每只500固定伤害；当前自身这次死亡对应500固定与致死清回合已实现'],traits:{attackMultiplier:f=>f.soulState.jealousHealthRound===f.soulState.calculationRound?1.5:1,attackReduction:f=>f.soulState.jealousHealthRound===f.soulState.calculationRound?.25:0},hooks:{roundStart(c){const st=c.a.soulState;st.jealousHealthRound=c.t.stats.maxHp>c.a.stats.maxHp?c.round:0;const p=panel(c,c.t,'spe')>panel(c,c.a,'spe');if(p)c.stage(c.t,-1,['def','spe']);},death(c){if(c.a.soulState.jealousDeathDone||c.t.hp<=0)return;c.a.soulState.jealousDeathDone=true;const before=c.t.hp;c.hurt(c.t,500,'嫉妒自身阵亡一只','fixed');if(before>0&&c.t.hp<=0)c.clear(c.t);}}};

registry[1711]={name:'箫澈',sourceHash:'58b6e759',traits:{},hooks:{damageTaken(c){if(c.a.hp<=0)return;const type=c.type??'attack',n=c.settledDamage??0,st=c.a.soulState;if(n>0&&['attack','fixed','percent'].includes(type))st.xiaoPositiveDamageRound=c.round;if(type==='attack'){if((c.a.roundSettledAttackDamage??0)<300||st.xiaoAttackThresholdRound===c.round)return;st.xiaoAttackThresholdRound=c.round;c.a.counts.nextPinkImmunity=(c.a.counts.nextPinkImmunity??0)+1;if(c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'哀霆之声','percent');}else if(n>=300&&['fixed','percent'].includes(type)){c.a.counts.xiaoAttackImmunity=(c.a.counts.xiaoAttackImmunity??0)+1;c.heal(c.a,c.a.stats.maxHp/3,'悲龙之鸣回复');}},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.soulState.xiaoPositiveDamageRound===c.round)return;const rounds=c.clear(c.t),boost=c.clearBoost(c.t);if(rounds||boost)c.randomAilmentsFrom(1,['麻痹','害怕'],2099);},attackDamageTaken(c){if((c.settledDamage??0)>0)c.a.soulState.xiaoPositiveDamageRound=c.round;}}};

registry[1713]={name:'天后·弗丽嘉',sourceHash:'12e539ee',deferred:['真实再次登场施加两预言；首次初始化已实现','低半体与己方场下体力最高的首位精灵交换体力，自身回1PP独立已做','凯旋预言下场保留'],traits:{},hooks:{battleStart(c){const marks=c.t.soulState.prophecies??={};for(const k of ['frustration','lost'])marks[k]={sourceSide:c.a.side,revision:'12e539ee',url:'https://api.seerapi.com/v1/soulmark/1713'};},beforeRoundStart(c){const st=c.a.soulState;if(st.friggClearRound!==c.round)return;delete st.friggClearRound;const abnormal=Object.values(c.a.ailments).some(n=>n>=c.round),negative=Object.values(c.a.stages).some(n=>n<0)&&c.canRemoveNegative(c.a);c.clearAilments(c.a);c.clearNegative(c.a);if(abnormal&&!Object.values(c.a.ailments).some(n=>n>=c.round)||negative&&!Object.values(c.a.stages).some(n=>n<0))c.timed(c.a,'id984',1,{amount:1});},roundStart(c){if(c.a.hp>c.a.stats.maxHp/2)c.a.soulState.friggClearRound=c.round+1;},combatEnd(c){if(c.a.hp<=0)return;const hist=c.t.soulState.prophecyHistory??{},a=hist.frustration,b=hist.lost;if(!c.a.soulState.friggTriumphGranted&&a?.sourceSide===c.a.side&&b?.sourceSide===c.a.side){c.a.soulState.friggTriumphGranted=true;(c.a.soulState.prophecies??={}).triumph={sourceSide:c.a.side,revision:'12e539ee'};}if(c.a.hp<c.a.stats.maxHp/2)c.restorePP(c.a,1);}}};

registry[1714]={name:'德布比特',sourceHash:'5cd3c296',partial:false,unimplemented:[],deferred:['真实入场按双方场下阵亡数≥2/4/6/8/10触发标记与免弱/免异常/必先/敌技能无效，当前初次零队友不伪造计数','有回体时按己方场下阵亡每只20%攻击增伤；有失体按对方场下每只20%固粉增伤（用户Q4499-002，原API10/20差异保留），真实队伍计数第二阶段','体力标记持有者真实下场清除'],traits:{},hooks:{roundStart(c){c.a.soulState.debuMarkRound=c.round;c.a.soulState.debuRec=!!c.healthState(c.a,'回体Ⅰ');c.a.soulState.debuDis=!!c.healthState(c.t,'失体Ⅰ');},afterStateExpiry(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(st.debuMarkRound!==c.round)return;if(st.debuRec&&!c.healthState(c.a,'回体Ⅰ')&&c.t.hp>0&&c.clear(c.t))c.timed(c.t,'attackBlock',1,{},c.round+1);if(st.debuDis&&!c.healthState(c.t,'失体Ⅰ')&&c.t.hp>0&&c.clearBoost(c.t))c.timed(c.t,'statusBlock',1,{},c.round+1);}}};

const royalGuards=typeof module==='object'&&module.exports?require('./guard-states.js'):globalThis.BattleGuardStates;
registry[1724]={name:'武心婵',sourceHash:'77c3c93c',deferred:['位于出战背包时双方真实场下精灵HP/PP不减少','红黄蓝三色龙鳞真实下场保留、后续再次入场不重新获得首次三色'],traits:{fifthLocked:f=>!f.soulState.royalScaleContract?.unlocked},hooks:{battleStart(c){const source={origin:'soul',sourceSide:c.a.side,url:'https://api.seerapi.com/v1/soulmark/1724',revision:'77c3c93c'};c.a.soulState.royalScaleContract={armed:true,unlocked:false,whiteIssued:false,source};for(const k of ['red','yellow','blue'])royalGuards.grant(c.a,k,c.round,source);},beforeDamage(c){if(c.m.type==='龙')c.stab=1.5;}}};

registry[1715]={name:'普达戈尔',sourceHash:'f91439c9',partial:false,unimplemented:[],traits:{},hooks:{afterUse(c){if(c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0)return;c.ailment(c.t,'沉默',c.a,false,false,null,{probabilityPercent:100});if(c.successful)c.hurt(c.t,c.t.stats.maxHp/3,'普达戈尔命中附伤','percent');else if(!c.ppReductionBlocked(c.t))for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-2);},combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.t.ailments['沉默']>=c.round)c.addShield(c.a,400,'soul1715:'+c.round);else c.clear(c.t);}}};
function kutanAfterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item'||!c.a.moves.some(k=>c.a.pp[k]===0))return;if(!c.ailment(c.t,'流血',c.a,false,false,null,{probabilityPercent:100})){for(const k of c.a.moves)c.a.pp[k]=c.maxPP(k);c.timed(c.t,'技能命中效果失效',1,{},c.round+1);}}
registry[1717]={name:'库坦',sourceHash:'98b92253',traits:{},deferred:['真实战斗阶段结束自身无能力提升时禁止对手下回合主动切换精灵'],hooks:{roundStart(c){c.stage(c.a,2,['atk','def']);},afterUse:kutanAfterUse,opponentAfterUse:kutanAfterUse}};
function wingQualifiedBands(c,bands){if(!Array.isArray(bands)||bands.some(n=>![2,6,12].includes(n)))throw Error('1719阈值前提无效');if(c.a.hp<=0||c.t.hp<=0)return;if(bands.includes(2))c.ailment(c.t,'寄生',c.a,false,false,null,{probabilityPercent:100});if(c.a.hp<=0||c.t.hp<=0)return;if(bands.includes(6)){const keys=['atk','def','spa','spd','spe','acc'],up=keys.every(k=>c.t.stages[k]>0),down=keys.every(k=>c.t.stages[k]<0);if(up||down){c.stage(c.t,up?1:-1);if(c.a.hp<=0||c.t.hp<=0)return;c.rewriteStageValues(c.a,{...c.t.stages},'copy');}}if(bands.includes(12))c.a.soulState.wingResetEnabledRound=c.round;}
function wingReset(c){if(c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0||c.a.soulState.wingResetEnabledRound!==c.round)return;const values=Object.fromEntries(Object.keys(c.t.stages).map(k=>[k,0])),result=c.rewriteStageValues(c.t,values,'reset');c.a.soulState.wingResetCount=(c.a.soulState.wingResetCount??0)+result.changedLevels;}
registry[1719]={name:'婕克拉德',sourceHash:'f04d5267',traits:{},abilities:{qualifiedBands:wingQualifiedBands},hooks:{roundStart(c){const st=c.a.soulState;st.wingResetCount=0;st.wingResetEnabledRound=0;const before=c.roundStartStages(c.t);c.stage(c.t,-2,['acc']);const n=['atk','def','spa','spd','spe','acc'].reduce((v,k)=>v+Math.abs(c.t.stages[k]-before[k]),0);st.wingNetStage={round:c.round,before,after:{...c.t.stages},n};wingQualifiedBands(c,[2,6,12].filter(k=>n>=k));},afterUse:wingReset,opponentAfterUse:wingReset,combatEnd(c){const n=c.a.soulState.wingResetCount??0;if(n>0&&c.a.hp>0&&c.t.hp>0)healthRules.drainFixed(c,n*100,'婕克拉德重置等级战阶吸取');}}};

registry[1722]={name:'梅林',sourceHash:'3a599098',traits:{},hooks:{
 roundStart(c){c.a.soulState.merlinAttackOut=0;c.a.soulState.merlinAttackIn=0;},
 damageDealt(c){if(c.type==='attack')c.a.soulState.merlinAttackOut=(c.a.soulState.merlinAttackOut??0)+(c.settledDamage??0);},
 attackDamageTaken(c){c.a.soulState.merlinAttackIn=(c.a.soulState.merlinAttackIn??0)+(c.settledDamage??0);},
 combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;
  if(c.t.hp*c.a.stats.maxHp>c.a.hp*c.t.stats.maxHp)healthRules.drainPercent(c,c.t.stats.maxHp/3,'魔祖之渎');
  if(c.a.hp<=0||c.t.hp<=0)return;
  if(['atk','def','spa','spd','spe','acc'].some(k=>c.t.stages[k]>c.a.stages[k])){c.stage(c.a,1);c.stage(c.t,-1);}
  if(c.a.hp>0&&c.t.hp>0&&(c.a.soulState.merlinAttackIn??0)>(c.a.soulState.merlinAttackOut??0))c.randomFromSharedPool(2,false,1722);
 }
}};



{
'use strict';
const shield='weiyue:1723:embrace',barrier='weiyue:1723:insulate';
// Q-N50-4510-002: ownership is a mark, independent of its opening capacity.
function hasShield(f){return f.soulState.weiyueShieldHeld===true;}
function hasBarrier(f){return f.soulState.weiyueBarrierHeld===true;}
function open(c,kind){if(c.a.hp<=0)return false;if(kind==='shield'){if(hasShield(c.a))return false;c.addShield(c.a,300,shield);c.a.soulState.weiyueShieldHeld=true;}else{if(hasBarrier(c.a))return false;c.addBarrier(c.a,300,barrier);c.a.soulState.weiyueBarrierHeld=true;}return true;}
function release(c){const a=hasShield(c.a),b=hasBarrier(c.a);if(a){c.a.soulState.weiyueShieldHeld=false;c.refreshShield(c.a,0,shield);}if(b){c.a.soulState.weiyueBarrierHeld=false;c.refreshBarrier(c.a,0,barrier);}return {shield:a,barrier:b};}
function entry(c){const st=c.a.soulState;st.weiyueEntryRound=c.round??1;st.weiyueEnemyUsed=false;delete st.weiyueBothRound;}
registry[1723]={name:'卫岳',sourceHash:'667a59a9',partial:false,unimplemented:[],traits:{
 panelStatMinSources:{def:['atk','spa'],spd:['atk','spa']},
 opponentHealingMultiplier:f=>f.hp>0?.5:1,
 attackMultiplier:f=>hasShield(f)?1.5:1,
 pinkDamageMultiplier:f=>hasBarrier(f)?1.25:1,
 immuneAilments:f=>[...(hasShield(f)?['臣服']:[]),...(hasBarrier(f)?['麻痹']:[])]
},abilities:{openShield:c=>open(c,'shield'),openBarrier:c=>open(c,'barrier'),hasShield,hasBarrier,release},deferred:['再次真实登场的首回合响应，当前首次在场已实现','死亡后己方其他精灵攻击伤害提升100%/固百提升50%的两回合承接','双解放后对方其他精灵的2回合禁疗，当前对手禁疗已实现'],hooks:{
 battleStart:entry,entryTriggered:entry,
 roundStart(c){if(c.a.soulState.weiyueBothRound===c.round){delete c.a.soulState.weiyueBothRound;open(c,'shield');open(c,'barrier');}},
 opponentBeforeUse(c){const st=c.a.soulState;if(c.a.hp<=0||c.round!==st.weiyueEntryRound||c.m.kind==='item')return;st.weiyueEnemyUsed=true;open(c,c.m.kind==='status'?'barrier':'shield');},
 combatEnd(c){const st=c.a.soulState;if(c.a.hp>0&&c.round===st.weiyueEntryRound&&!st.weiyueEnemyUsed)st.weiyueBothRound=c.round+1;},
 death(c){const st=c.a.soulState;if(st.weiyueReleased)return;const a=hasShield(c.a),b=hasBarrier(c.a);st.weiyueReleased={round:c.round,shield:a,barrier:b};if(a){c.a.soulState.weiyueShieldHeld=false;c.refreshShield(c.a,0,shield);}if(b){c.a.soulState.weiyueBarrierHeld=false;c.refreshBarrier(c.a,0,barrier);}if(a&&b)c.timed(c.t,'回复效果削减',2,{fraction:1});}
}};



}

{
const statuses=conditionStatusRules,pools=soulStatusPools;
const keys=['atk','def','spa','spd','spe','acc'],controls=()=>pools.pool().map(x=>x.name).filter(statuses.isControl);
function entry(c){c.a.soulState.nanEntryRound=c.round??1;c.stage(c.a,1);c.stage(c.t,1);c.a.soulState.nanEntryDifferent=keys.some(k=>c.a.stages[k]!==c.t.stages[k]);}
// Payloads isolated from the unresolved entry-window/condition snapshot trigger.
function qualifiedCopy(c){if(c.a.hp<=0||c.t.hp<=0)return false;const values=Object.fromEntries(keys.filter(k=>c.t.stages[k]>0).map(k=>[k,c.t.stages[k]]));const result=c.rewriteStageValues(c.a,values,'copyNan1725');const ok=result.changedLevels>0;if(ok){c.ailment(c.a,'凝滞',c.a,false,false,null,{probabilityPercent:100});c.ailment(c.t,'凝滞',c.a,false,false,null,{probabilityPercent:100});}return ok;}
function qualifiedBarrier(c,positiveLevelSum){if(!Number.isInteger(positiveLevelSum)||positiveLevelSum<0||positiveLevelSum>36)throw Error('魂印1725护罩正级总和无效');if(c.a.hp>0)c.addBarrier(c.a,positiveLevelSum*60,'nan1725-copy:'+c.round);}
function punish(c){const st=c.a.soulState;st.nanPunishRound=c.round+1;st.nanControlImmuneUntil=c.round+1;for(const k of Object.keys(c.a.ailments))if(statuses.isControl(k))c.clearAilment(c.a,k);}
registry[1725]={name:'不破帝·南霜',sourceHash:'7224df48',partial:false,unimplemented:[],deferred:['真实再次换宠登场：双方全属性+1并重新建立来源登场条件'],traits:{attackMultiplier:f=>{if(f.soulState.nanDamageRound!==f.soulState.calculationRound)return 1;return 1+(f.soulState.nanDamageBonus??0);},immuneAilments:f=>(f.soulState.nanControlImmuneUntil??0)>=(f.soulState.calculationRound??1)?controls():[]},abilities:{qualifiedCopy,qualifiedBarrier,punish},hooks:{
 battleStart:entry,entryTriggered:entry,
 opponentBeforeUse(c){if(c.a.hp>0&&c.round===c.a.soulState.nanEntryRound&&c.a.soulState.nanEntryDifferent&&!['status','item'].includes(c.m.kind))qualifiedCopy(c);},
 opponentSkillResolved(c){if(c.a.hp>0&&c.round===c.a.soulState.nanEntryRound&&c.a.soulState.nanEntryDifferent&&!['status','item'].includes(c.m.kind))qualifiedBarrier(c,Object.values(c.t.stages).reduce((n,v)=>n+Math.max(0,v),0));},
 choiceLocked(c){if(c.a.soulState.nanPunishRound===c.round&&c.m.kind!=='item')c.a.soulState.opponentBoostsAsWeakThis=true;},
 opponentPriority(c){if(c.a.soulState.nanPunishRound===c.round)c.priority=Math.min(c.priority,c.ownPriority);},
 combatEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const n=c.shieldValue(c.t),st=c.a.soulState;st.nanDamageRound=c.round+1;delete st.nanDamageUnresolved;st.nanDamageBonus=Math.floor(n/30)*.06;if(n>=300){c.consumeShields(c.t,c.a,false);if(c.t.hp>0)c.addShield(c.t,n-300,'nan1725-remainder:'+c.round);if(c.a.hp>0)punish(c);}}
}};



}

{
const status=conditionStatusRules,health=healthRules;
registry[1726]={name:'灼云',sourceHash:'c406c6e1',partial:false,unimplemented:[],traits:{},hooks:{
 roundStart(c){c.a.soulState.zhuoyunConfusionRound=!status.active(c.t,'烧伤',c.round)?c.round:0;},
 beforeSkillHit(c){if(c.a.hp<=0||c.t.hp<=0||['status','item'].includes(c.m.kind)||c.a.soulState.zhuoyunConfusionRound!==c.round)return;const ok=c.ailment(c.t,'混乱',c.a,false,false,null,{probabilityPercent:100});if(!ok)c.a.soulState.ignoreImmunityThis=true;},
 combatEnd(c){if(c.a.hp<=0||c.t.hp<=0||!status.active(c.t,'烧伤',c.round))return;health.drainPercent(c,c.t.stats.maxHp/3,'灼云烧伤吸取');if(c.t.hp<=0||!c.usedSkillThisRound(c.t)||c.ppReductionBlocked(c.t))return;const type=c.selectedMove(c.t)?.kind;if(!type||type==='item')return;for(const id of c.t.moves){const kind=c.moveKind(id);if(type==='status'?kind==='status':['physical','special'].includes(kind))c.t.pp[id]=0;}}
}};


}

{

const attack=m=>m&&!['status','item'].includes(m.kind);
const getForm=f=>f.soulState.huoguangForm??'strong';
function hasFrenzy(c){return (c.a.soulState.huoguangFrenzyEnd??0)>=c.round;}
function setForm(c,form){if(!['strong','unbound','break'].includes(form))throw Error('1727非法形态');c.a.soulState.huoguangForm=form;}
registry[1727]={name:'霍光',sourceHash:'3832fb4a',partial:false,unimplemented:[],deferred:['威破形态对手主动换宠后为新精灵附加束缚/狂刃改害怕','武器与战斗形态下场保留、再登场持续；真实换宠后的狂刃跨对手状态保存/调用（当前在场载荷已实现）'],traits:{},abilities:{setForm,getForm:c=>getForm(c.a),hasFrenzy},hooks:{
 battleStart(c){c.a.soulState.huoguangForm='strong';},
 beforeCrit(c){if(attack(c.m))c.forceCrit=true;},
 beforeDamage(c){if(!attack(c.m))return;const frenzy=hasFrenzy(c),form=getForm(c.a);if(form==='strong'&&c.crit)c.modifier*=frenzy?2:1.5;if(form==='unbound')c.affinity=Math.max(frenzy?2:1,c.affinity);},
 damageDealt(c){if(c.a.hp<=0||c.t.hp>0||!c.t.soulState.deathResolved)return;const st=c.a.soulState;if(st.huoguangLastDefeatedRound===c.round&&st.huoguangLastDefeatedSide===c.t.side)return;st.huoguangLastDefeatedRound=c.round;st.huoguangLastDefeatedSide=c.t.side;st.huoguangDefeatAttackDamage=c.outgoingAttackEvents().reduce((n,e)=>n+e.settledDamage,0);st.huoguangFrenzyEnd=c.round+3;},
 afterUse(c){if(c.a.hp<=0||c.t.hp<=0||!attack(c.m)||!hasFrenzy(c))return;c.hurt(c.t,c.a.soulState.huoguangDefeatAttackDamage??0,'北冥狂刃追加','true');},
 combatEnd(c){const st=c.a.soulState;if(st.huoguangLastDefeatedRound===c.round)st.huoguangDefeatAttackDamage=c.outgoingAttackEvents().reduce((n,e)=>n+e.settledDamage,0);}
}};


}

{
const status=conditionStatusRules;
registry[1728]={name:'帕妮丝',sourceHash:'d77466a7',partial:false,unimplemented:[],traits:{opponentPercentDamageMultiplier:f=>{const st=f.soulState;return st.panisSnapshotRound>0&&(st.panisEnemyAbnormal||st.panisExplicitEnemyVulnerabilityRound===st.panisSnapshotRound)?1.5:1;}},abilities:{qualifiedVulnerability(c,recipient){if(recipient!==c.a&&recipient!==c.t)throw Error('1728明确易伤载荷受者必须为在场双方');c.a.soulState[recipient===c.a?'panisExplicitSelfVulnerabilityRound':'panisExplicitEnemyVulnerabilityRound']=c.round;}},hooks:{
 roundStart(c){const st=c.a.soulState;st.panisSnapshotRound=c.round;st.panisOwnAbnormal=status.conditionPresent(c.a,c.round);st.panisEnemyAbnormal=status.conditionPresent(c.t,c.round);},
 beforeIncomingDamage(c){if(c.type!=='percent'||c.a.soulState.panisSnapshotRound!==c.round)return;const st=c.a.soulState;if(st.panisExplicitSelfVulnerabilityRound===c.round)c.amount*=1.5;if(st.panisOwnAbnormal&&(c.damageReductionIgnore??0)<1)c.amount=0;},
 afterUse(c){if(c.a.hp<=0||c.m.kind==='item')return;const st=c.a.soulState;if(c.m.kind!=='status'){st.panisStatusStreak=0;delete st.panisStatusRound;return;}if(st.panisStatusRound!==c.round){st.panisStatusStreak=st.panisStatusRound===c.round-1?Math.min(4,(st.panisStatusStreak??0)+1):1;st.panisStatusRound=c.round;}if(c.t.hp>0)c.hurt(c.t,(c.panelStat(c.a,'def')+c.panelStat(c.a,'spd'))*.25*st.panisStatusStreak,'帕妮丝双防附加','percent');}
}};

}

{
const status=conditionStatusRules,health=healthRules;
const attack=m=>m&&!['status','item'].includes(m.kind);const useKey=(c,f)=>c.round+':'+c.m?.id+':'+(f.soulState.skillUses?.[c.m?.id]??0);
function attempt(c,name,boostKey){const st=c.a.soulState,chance=st[boostKey]?100:50;st[boostKey]=false;c.markStatusEffect?.();const effective=c.statusProbability?.(chance)??chance;const applied=c.random()<effective/100&&c.ailment(c.t,name,c.a,false,false,null,{probabilityPercent:chance});if(!applied)st[boostKey]=true;return {applied:!!applied,chance};}
function fear(c){c.a.soulState.whirlpoolFearAttemptKey=useKey(c,c.a);const out=attempt(c,'害怕','whirlpoolFearNextDouble');c.a.soulState.whirlpoolAttackBoost={round:c.round,move:c.m?.id,boost:!out.applied};return out;}
function freeze(c){c.a.soulState.whirlpoolIceAttemptKey=useKey(c,c.t);const out=attempt(c,'冰封','whirlpoolIceNextDouble');if(!out.applied&&c.a.hp>0&&c.t.hp>0)health.drainPercent(c,c.t.stats.maxHp/3,'涡锋冰封失败吸取');return out;}
registry[1733]={name:'涡锋',sourceHash:'5859cd07',partial:false,unimplemented:[],deferred:['击败异常对手先制叠层下场保留及后续真实对手继续叠加；当前对手击败获得一层已实现'],traits:{skillPriority:f=>f.soulState.whirlpoolPriority??0},abilities:{qualifiedFear:fear,qualifiedFreeze:freeze},hooks:{
 beforeAttackDamage(c){if(!attack(c.m)||c.a.hp<=0||c.t.hp<=0||(c.a.soulState.currentAttackSegment??0)>0)return;const had=status.active(c.a,'害怕',c.round);fear(c);if(!had&&status.active(c.a,'害怕',c.round))c.interruptBeforeDamage?.('1733害怕反弹');},
 beforeDamage(c){const x=c.a.soulState.whirlpoolAttackBoost;if(attack(c.m)&&x?.round===c.round&&x.move===c.m.id&&x.boost)c.modifier*=2;},
 beforeOpponentAttack(c){if(!attack(c.m)||c.a.hp<=0||c.t.hp<=0||(c.t.soulState.currentAttackSegment??0)>0)return;const out=freeze(c);if(out.applied)c.interruptBeforeDamage?.('1733伤害前冰封');},
 
 
 damageDealt(c){if(c.a.hp<=0||c.t.hp>0||!c.t.soulState.deathResolved||!status.conditionPresent(c.t,c.round))return;const st=c.a.soulState;if(st.whirlpoolDefeatRound===c.round&&st.whirlpoolDefeatSide===c.t.side)return;st.whirlpoolDefeatRound=c.round;st.whirlpoolDefeatSide=c.t.side;st.whirlpoolPriority=(st.whirlpoolPriority??0)+1;}
}};

}

{
const status=conditionStatusRules;
const active=f=>(f.soulState.wukongSaintEnd??0)>=(f.soulState.calculationRound??f.soulState.wukongRound??1);
function saint(c){const st=c.a.soulState;st.wukongSaintSpent=true;st.wukongSaintEnd=c.round+2;c.clearAilments(c.a);for(const id of c.a.moves)c.a.pp[id]=c.maxPP(id);c.a.hp=c.a.stats.maxHp;}
registry[1738]={name:'孙悟空',sourceHash:'615c5edb',partial:false,unimplemented:[],deferred:['法天象地·圣下场消失，需要真实换宠；每场一次的跨下场消费保留'],traits:{weaknessImmune:true,immuneAilments:['焚烬','烧伤'],ailmentImmune:f=>active(f),skillPriority:f=>(f.soulState.wukongLow?1:0)+(active(f)?1:0)},abilities:{qualifiedSaint:saint},hooks:{
 roundStart(c){const st=c.a.soulState;st.wukongRound=c.round;st.wukongHigh=c.t.hp>c.t.stats.maxHp/2;st.wukongLow=c.t.hp<c.t.stats.maxHp/2;if(c.a.hp>0&&!st.wukongSaintSpent&&c.a.hp<c.a.stats.maxHp/2&&status.conditionPresent(c.a,c.round))saint(c);},
 beforeCrit(c){if(c.m&&!['status','item'].includes(c.m.kind)&&active(c.a))c.forceCrit=true;},
 beforeDamage(c){if(c.a.soulState.wukongHigh&&c.m&&!['status','item'].includes(c.m.kind))c.modifier*=c.crit?2:1.5;},
 afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.m.kind!=='item'&&c.a.soulState.wukongLow)c.hurt(c.t,c.t.stats.maxHp/3,'孙悟空低体对手追加','percent');}
}};



}

{

function reverse(c){const values=Object.fromEntries(Object.entries(c.t.stages).filter(([,v])=>v>0).map(([k,v])=>[k,-v]));if(!Object.keys(values).length)return false;return c.rewriteStageValues(c.t,values,'reverse').removedPositive.length>0;}
function payload(c,n){if(c.a.hp<=0||c.m.kind==='item')return;if(n<=0){if((c.a.roundSettledAttackDamage??0)>0)c.a.counts.immune=(c.a.counts.immune??0)+1;else if(c.t.hp>0)c.stage(c.t,-1);}if(n>=3){if(c.m.kind==='status')c.heal(c.a,n*100,'堕息迹先制回复');else if(c.t.hp>0)c.hurt(c.t,n*100,'堕息迹先制附加','fixed');}}
registry[1745]={name:'堕息·迹',sourceHash:'b7d38834',traits:{},partial:false,unimplemented:[],deferred:['真实再次入场2回合无视强化与先制上限、首次痕不能再次授予','自身死亡后己方下一只精灵出场获得刻；当前技能2051获得刻及当前攻击后转痕/攻免已实现','痕持有者死亡后其下一只精灵入场随机疲惫/害怕；刻痕真实下场保留'],abilities:{grantKe(c){c.a.soulState.jiKe1745=true;},grantHen(c){c.t.soulState.jiHen1745=true;},qualifiedReverse:reverse,qualifiedPriorityPayload:payload},hooks:{battleStart(c){c.a.soulState.jiEntryEnd=c.round+1;c.t.soulState.jiHen1745=true;},roundStart(c){if(c.round<=(c.a.soulState.jiEntryEnd??0))c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;},opponentPriority(c){if(c.round<=(c.a.soulState.jiEntryEnd??0))c.priority=Math.min(c.priority,3);},afterUse(c){const a=c.a.soulState.resolvedPriority,t=c.t.soulState.resolvedPriority;if(a?.round!==c.round||t?.round!==c.round)throw Error('1745缺少当回合最终先制数据');payload(c,a.value+t.value);if(c.a.hp>0&&c.t.hp>0&&['physical','special'].includes(c.m.kind)&&c.a.soulState.jiKe1745){delete c.a.soulState.jiKe1745;if(c.t.soulState.jiHen1745){c.grantSoulAttackNullify(c.a,1,1745,'b7d38834','1745-ke');}else c.t.soulState.jiHen1745=true;}},death(c){reverse(c);c.a.soulState.jiNextKeDeferred=true;}}};



}

{

function entry(c){if(c.t.hp>0&&c.clearBoost(c.t)){const apply=(f,k)=>c.entryAilment?c.entryAilment(f,k):c.ailment(f,k,c.a);if(!apply(c.t,'害怕'))apply(c.t,'束缚');}}
function grantGuiFu(c,n=1,target=c.t){if(!Number.isInteger(n)||n<0)throw Error('诡符层数须为非负整数');target.soulState.guiFu1747=Math.min(4,(target.soulState.guiFu1747??0)+n);return target.soulState.guiFu1747;}
registry[1747]={name:'诡魅浮踪·幽美',sourceHash:'ea4444ed',traits:{attackReduction:f=>f.soulState.youmeiReduction1747??0},abilities:{grantGuiFu,releaseGuiFu(c,target=c.t){const n=target.soulState.guiFu1747??0;delete target.soulState.guiFu1747;return n;},qualifiedEntry:entry},deferred:['真实再次登场消强/害怕失败束缚；当前初登场已实现','本次登场回合对方选择主动切换时战斗阶段结束额外加1道诡符','诡符真实下场保留与主动切换前每道直接扣50HP并保1；当前最高4层受暴击每层增15%已实现'],hooks:{battleStart:entry,roundStart(c){c.a.soulState.youmeiReduction1747=Object.values(c.a.stages).some(v=>v>0)?0:.5;},combatEnd(c){if(c.a.hp>0&&Object.values(c.a.stages).some(v=>v>0))c.heal(c.a,c.a.stats.maxHp/3,'幽美战阶正强化回复');}}};


}

{

const shields=typeof module==='object'&&module.exports?require('./shield-rules.js'):globalThis.BattleShieldRules;const source='mortarion:1751:entry';
function entry(c){if(c.a.hp<=0)return false;if(c.refreshBarrier)c.refreshBarrier(c.a,300,source);else shields.refreshBarrier(c.a,300,source);return true;}
function branch(c){if(c.t.hp<=0)return;const has=Object.values(c.t.effects).some(e=>e.start<=c.round&&e.end>=c.round);if(has)c.stage(c.a,1);else c.ailment(c.t,'束缚',c.a);}
function fear(c){if(c.a.hp>0&&c.t.hp>0&&Object.values(c.t.stages).some(n=>n<0))return c.ailment(c.t,'害怕',c.a);return false;}
function reward(c){if(c.a.hp<=0)return false;entry(c);c.grantSoulAttackNullify(c.a,1,1751,'db78b900','1751');return true;}
registry[1751]={name:'莫塔里安',sourceHash:'db78b900',partial:false,unimplemented:[],traits:{ailmentImmune:f=>(f.soulState.mortarionActiveRound??0)>0&&f.soulState.mortarionActiveRound===f.soulState.calculationRound},abilities:{entry,qualifiedRoundBranch:branch,qualifiedFear:fear,qualifiedDefeatReward:reward},deferred:['真实再次登场获得来源护罩；当前初始与击败再触发自身入场已实现','击败后下一次真正后继对手攻击的场间免攻保存；当前免攻状态及消费已实现'],hooks:{battleStart:entry,roundStart(c){c.a.soulState.mortarionActiveRound=c.barrierSourceValue(c.a,source)>0?c.round:0;if(c.a.soulState.mortarionActiveRound===c.round){branch(c);}},opponentAfterUse(c){if(c.a.soulState.mortarionActiveRound===c.round&&['physical','special'].includes(c.m.kind)&&c.a.hp>0&&c.t.hp>0)c.stage(c.t,-2,['spe']);},afterUse(c){if(c.successful)c.a.soulState.mortarionSuccessfulRound=c.round;},lateRoundEnd(c){if(c.a.soulState.mortarionSuccessfulRound===c.round)fear(c);},damageDealt(c){if(c.a.hp<=0||c.t.hp>0||!c.t.soulState.deathResolved)return;const st=c.a.soulState;if(st.mortarionRewardRound===c.round&&st.mortarionRewardSide===c.t.side)return;reward(c);st.mortarionRewardRound=c.round;st.mortarionRewardSide=c.t.side;}}};




}

{

function entryPayload(c,armBefore){
  if(typeof armBefore!=='boolean')throw Error('Q-N50-4553-001/ENTRY：登场混乱和记录启用顺序未确认');
  const st=c.a.soulState;st.beiniaoCaptureArmed=armBefore;
  const apply=(f)=>c.entryAilment?c.entryAilment(f,'混乱',2):c.ailment(f,'混乱',c.a,false,false,2);
  apply(c.t);if(apply(c.a)&&armBefore)capture(c,'混乱');
  if(!armBefore)st.beiniaoCaptureArmed=true;
}
function capture(c,status){
  const st=c.a.soulState;if(!st.beiniaoCaptureArmed)return;
  st.beiniaoCaptureArmed=false;st.beiniaoRecorded={name:status};
  c.convertAilment(c.a,status,'混乱',3);
}
function springCry(c){
  let n=0;for(const f of[c.a,c.t])for(const[k,end]of Object.entries({...f.ailments}))if(end>=c.round&&c.clearAilment(f,k))n++;
  if(n&&c.t.hp>0)c.stage(c.t,-n);
  c.a.soulState.beiniaoSpringCry={round:c.round,removed:n};
  return n;
}
function settleTotal(c,total){
  if(!Number.isInteger(total)||total<0)throw Error('异常回合数负载必须为非负整数');
  if(c.a.hp<=0)return;
  c.a.soulState.beiniaoSettlementDoneRound=c.round;
  c.heal(c.a,total*60,'万里春双方异常回合回复');
  if(total>5)springCry(c);
}
function attackRecord(c){
  const rec=c.a.soulState.beiniaoRecorded;if(!rec||c.a.hp<=0||c.t.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;
  if(!c.ailment(c.t,rec.name,c.a,false,false,null))c.timed(c.t,'statusBlock',2,{});
}
registry[1763]={name:'万里春·北鸟',sourceHash:'e0721474',partial:false,unimplemented:[],traits:{attackReduction:f=>f.soulState.beiniaoRecorded?0:.3},
  abilities:{qualifiedEntry:entryPayload,capture,qualifiedSettlement:settleTotal,springCry,
    resolveRecordDuration(c,n){if(!c.a.soulState.beiniaoRecorded)throw Error('不存在记录');if(!Number.isInteger(n)||n<1)throw Error('异常时长必须为正整数');c.a.soulState.beiniaoRecorded.duration=n;},
    attackRecord},
  deferred:['每次真实再次登场重新令双方混乱2回合并赋予下次异常记录/转化；当前初登场先施双方混乱后启用捕获已按用户确认实现',
    '万里春啼实际解除计数后，下回合对手精灵真实出战时附加同等数量非限制类异常；成功且自身仍在场时清除自身记录并附加目标。真实换宠事件及继任目标尚缺，当前解除/每项全属性-1已实现'],
  hooks:{battleStart(c){entryPayload(c,false);},
    roundStart(c){if([c.a,c.t].some(f=>Object.values(f.ailments).some(end=>end>=c.round)))c.a.soulState.beiniaoAbnormalHistory=true;},
    ailmentApplied(c){capture(c,c.status);},afterUse:attackRecord,
    combatEnd(c){if(c.a.hp<=0||c.a.soulState.beiniaoSettlementDoneRound===c.round)return;const total=[c.a,c.t].reduce((sum,f)=>sum+Object.entries(f.ailments).filter(([k,end])=>end>=c.round&&conditionStatusRules.active(f,k,c.round)).reduce((n,[,end])=>n+end-c.round+1,0),0);settleTotal(c,total);}}};

}

{

const kind1764=k=>['holy','圣告','圣诰'].includes(k)?'holy':['evil','邪诲'].includes(k)?'evil':(()=>{throw Error('未知圣诰/邪诲种类');})();
const form1764=f=>f.soulState.oracleForm1764??'holy';
function marks1764(f){return f.soulState.oracleMarks1764??={holy:[],evil:[]};}
function grant1764(c,kind,n=1,target=c.t){kind=kind1764(kind);if(!Number.isInteger(n)||n<0)throw Error('标记层数须非负整数');if(target.hp<=0)return 0;if(target.soulState.oracleAnnihilation1764?.round===c.round&&target.soulState.oracleAnnihilation1764.releasePolicy==='unknown')throw Error('Q-N50-4554-001/ANNIHILATION：湮灭减层时点影响后续加层容量未确认');const marks=marks1764(target)[kind],added=Math.min(n,3-marks.length);for(let i=0;i<added;i++){target.soulState.oracleMarkSerial1764=(target.soulState.oracleMarkSerial1764??0)+1;marks.push({id:target.soulState.oracleMarkSerial1764,triggerUsed:false,annihilationUsed:false});}return added;}
function setForm1764(c,form){form=kind1764(form);if(c.a.soulState.oracleForm1764===form)return false;c.a.soulState.oracleForm1764=form;c.a.soulState.oracleNextAttack1764=true;return true;}
function protectRemoval1764(c,kind){
 if(c.a.soulId!==1764||c.a.hp<=0||c.a.soulState.oracleNoSkillOpponent1764!==c.round)return false;
 const present=kind==='boost'?Object.values(c.a.stages).some(v=>v>0):Object.values(c.a.effects).some(e=>e.start<=c.round&&e.end>=c.round);
 if(!present)return false;grant1764(c,c.a.soulState.oracleForm1764==='evil'?'holy':'evil');return true;
}
function annihilate1764(c,target=c.t,releasePolicy='immediate'){
 const marks=marks1764(target),h=marks.holy.find(x=>!x.annihilationUsed),e=marks.evil.find(x=>!x.annihilationUsed);
 if(!h||!e||target.hp<=0)return false;
 h.annihilationUsed=true;e.annihilationUsed=true;const prior=target.soulState.oracleAnnihilation1764;
 target.soulState.oracleAnnihilation1764={round:c.round,holyId:h.id,evilId:e.id,releasePolicy,count:prior?.round===c.round?(prior.count??1)+1:1};
 c.hurt(target,238,'湮灭','true');endAnnihilation1764(c,target);return true;
}
function endAnnihilation1764(c,target){const current=target.soulState.oracleAnnihilation1764;if(!current||current.ended||current.round!==c.round)return;const marks=marks1764(target);marks.holy=marks.holy.filter(x=>x.id!==current.holyId);marks.evil=marks.evil.filter(x=>x.id!==current.evilId);current.ended=true;}
function respond1764(c,payload={}){
 const target=payload.target??c.t,marks=marks1764(target),damage=payload.settledDamage,power=payload.power;
 if(!Number.isFinite(damage)||damage<0||!Number.isFinite(power)||power<0)throw Error('标记受攻须明确结算伤害与技能威力');
 for(const kind of['holy','evil']){
  const mark=marks[kind].find(x=>!x.triggerUsed);if(!mark)continue;mark.triggerUsed=true;
  if(kind==='holy'){if(c.random()<c.statusProbability(70)/100)c.ailment(target,'疲惫',c.a,false,false,null,{probabilityPercent:70});}
  else if(damage>0){const n=damage*.7;c.hurt(target,n,'邪诲吸取','percent');c.heal(c.a,n,'邪诲吸取回复');}
 }
 if(damage>power)for(const kind of['holy','evil']){const mark=marks[kind].find(x=>x.triggerUsed)??marks[kind][0];if(mark)marks[kind]=marks[kind].filter(x=>x.id!==mark.id);}
}
registry[1764]={name:'圣谕邪魇',sourceHash:'196ef534',partial:false,unimplemented:[],
 traits:{ailmentImmune:f=>form1764(f)==='holy',weaknessImmune:f=>form1764(f)==='evil',attackPriority:f=>f.soulState.oracleNextAttack1764?1:0,attackAlwaysHit:f=>!!(f.soulState.oracleNextAttack1764||f.soulState.oracleAttackThis1764)},
 abilities:{setForm:setForm1764,grantMark:grant1764,annihilate:annihilate1764,qualifiedAnnihilate(c,target=c.t){return annihilate1764(c,target,'immediate');},protectRemoval:protectRemoval1764,qualifiedMarkResponse:respond1764,endAnnihilation:endAnnihilation1764},
 deferred:['每次真实再次登场获得下次攻击先制+1/必中/穿免；当前初登场与切形完全独立实现','圣诰/邪诲标记真实下场保留与回场继续响应次数'],
 hooks:{battleStart(c){c.a.soulState.oracleForm1764='holy';c.a.soulState.oracleNextAttack1764=true;},roundStart(c){c.a.soulState.oracleNoSkillOpponent1764=c.selectedSkill(c.t)?0:c.round;c.a.soulState.oracleSelectedSkill1764=c.selectedSkill(c.a);},
 beforeUse(c){if(!['physical','special'].includes(c.m.kind))return;c.a.soulState.oracleAttackThis1764=!!c.a.soulState.oracleNextAttack1764;c.a.soulState.oracleNextAttack1764=false;},beforeDamage(c){if(c.a.soulState.oracleAttackThis1764)c.ignoreImmunity=true;},
 beforeIncomingDamage(c){if(c.type===(form1764(c.a)==='holy'?'fixed':'percent')){c.amount=0;c.immune=true;}},
 afterHit(c){if(['physical','special'].includes(c.m.kind)&&c.a.soulState.oracleSelectedSkill1764&&c.t.hp>0){grant1764(c,c.a.soulState.oracleForm1764);}},afterUse(c){delete c.a.soulState.oracleAttackThis1764;},roundEnd(c){endAnnihilation1764(c,c.a);endAnnihilation1764(c,c.t);}}};

}

{
{
function priorityBranch1778(c,eligible){if(eligible){c.clearAilments(c.a);c.a.soulState.jiegePriorityRound1778=c.round;}else delete c.a.soulState.jiegePriorityRound1778;}
function start1778(c){
 delete c.a.soulState.jiegePriorityRound1778;
 if(c.a.hp<c.t.hp)c.stage(c.t,-1);
 c.a.soulState.jiegeSegments1778=Object.values(c.t.stages).reduce((n,x)=>n+Math.abs(x),0);
 c.a.soulState.jiegeRound1778=c.round;
 const raw=Object.values(c.t.stages).every(n=>n===0),formatted=!conditionStatusRules.conditionPresent(c.t,c.round)&&!Object.values(c.t.stages).some(n=>n<0);
 
 priorityBranch1778(c,raw);
}
function grant1778(c){c.grantSoulAttackNullify(c.a,1,1778,'6d1a1ef4','1778');}

function received1778(c){
 if(c.a.hp<=0)return;
 const damage=c.settledDamage;if(!Number.isFinite(damage)||damage<0)throw Error('1778受攻须传递完整结算攻击伤害');
 const amount=c.t.stats.maxHp*(damage<300?.4:.2);
 healthRules.drainPercent(c,amount,'杰格受攻击吸取','杰格受攻击回复');
 if(damage>300&&c.a.hp>0)grant1778(c);
}
registry[1778]={name:'幽魅之影·杰格',sourceHash:'6d1a1ef4',partial:false,unimplemented:[],deferred:[],
 traits:{attackMultiplier:f=>1+(f.soulState.jiegeSegments1778??0)*.1,skillPriority:f=>Number.isInteger(f.soulState.jiegeRound1778)&&f.soulState.jiegePriorityRound1778===f.soulState.jiegeRound1778?1:0},
 abilities:{qualifiedPriority:priorityBranch1778,qualifiedReceivedAttack(c,settledDamage){return received1778({...c,settledDamage});},grantNullify:grant1778},hooks:{roundStart:start1778,attackDamageTaken:received1778}};

}

}

{
{
const slot1791=(c,m=c.m)=>m?c.a.moves.indexOf(m.id)+1:0;
function count1791(c){return c.a.soulState.emptyVerses1791??0;}
function grant1791(c,n){if(!Number.isInteger(n)||n<0)throw Error('空妄诗章须非负整数');return c.a.soulState.emptyVerses1791=count1791(c)+n;}
function ensure1791(c,n){if(!Number.isInteger(n)||n<0)throw Error('诗章补足目标须非负整数');const add=Math.max(0,n-count1791(c));grant1791(c,add);return add;}
function clearThird1791(c,eligible){if(eligible)c.clearAilments(c.a);}
function fourth1791(c){if(c.a.hp<=0)return;healthRules.drainPercent(c,c.t.stats.maxHp*.4,'空元卌铭文吸取','空元卌铭文回复');c.t.soulState.emptyNextAttackOutput1791=.4;}
function fifth1791(c,repeatMode=null){if(c.a.hp<=0)return;const prior=c.a.soulState.emptyFifthWins1791??0;if(repeatMode===null)repeatMode='stack';c.reduceMaxHp(c.a,c.a.stats.maxHp*.2,'空元卪铭文降低自身上限');c.a.soulState.emptyFifthWins1791=repeatMode==='refresh'?1:prior+1;}
function fatal1791(c){
 const st=c.a.soulState;if(c.a.hp<=0||!(c.amount>0))return;
 if(st.emptyPreserveRound1791===c.round){c.hpFloor=Math.max(c.hpFloor??0,1);return;}
 if(st.emptyProfane1791||c.amount<c.a.hp)return;
 st.emptyProfane1791=true;st.emptyVerses1791=0;st.emptyPreserveRound1791=c.round;c.hpFloor=Math.max(c.hpFloor??0,1);c.clearAilments(c.a);
}
function poem1791(c,options={}){
 if(c.a.hp<=0)return {performed:false,reason:'dead'};
 const move=options.move??c.m;if(!move||!Array.isArray(move.operations))return {performed:false,reason:'no-poem'};
 const outcome=options.outcome??{},patch={...(options.contextPatch??{}),...(options.qualifiedLifecycle&&options.poemEffectEnabled===true?{hitEffectsDisabled:false}:null)};
 if(options.poemEffectEnabled===false)return {performed:false,reason:'poem-disabled'};
 const free=!!c.a.soulState.emptyProfane1791;if(!free&&count1791(c)<1)return {performed:false,reason:'no-verses'};
 const entries=c.poemEntries1791(move,outcome,patch);if(!entries.length)return {performed:false,reason:'condition-false'};
 if(options.poemEffectEnabled!==true||!options.qualifiedLifecycle)throw Error('Q-N50-4586-001：空元之诗额外行动载荷/结束时点/递归生命周期未确认');
 const before=count1791(c);if(!free)c.a.soulState.emptyVerses1791=before-1;
 const event={round:c.round,moveId:move.wikiId??move.id,moveKey:move.id,sourceRevision:move.revision,poemIds:entries.map(x=>x.effectId),free,cost:free?0:1,before,after:count1791(c),qualifiedLifecycle:true};
 (c.a.soulState.emptyPoemEvents1791??=[]).push(event);c.executePoem1791(move,outcome,patch);return {performed:true,...event};
}
function naturalEnd1791(c,ownerAction){
 if(!ownerAction||c.a.hp<=0||c.t.hp<=0)return;
 const move=c.selectedMove(c.a),saved=c.a.soulState.emptyOwnOutcome1791;
 if(!move||move.kind==='item')return;
 const outcome=saved?.round===c.round&&saved.moveKey===move.id?saved.outcome:{successful:false,invalid:false,miss:false};
 poem1791(c,{move,outcome,qualifiedLifecycle:true,poemEffectEnabled:c.poemEnabled1791(move),contextPatch:{first:c.first,actionOwnerSide:c.a.side}});
}
registry[1791]={name:'空元行者',sourceHash:'e1c0f316',partial:false,unimplemented:[],
 traits:{secondSlotIgnorePP:true,skillPriority:f=>f.soulState.emptySelectedSlot1791===1?1:0,ailmentImmune:f=>f.soulState.emptyPreserveRound1791===f.soulState.calculationRound&&Number.isInteger(f.soulState.emptyPreserveRound1791),attackMultiplier:f=>1+.1*(f.soulState.emptyFifthWins1791??0),attackReduction:f=>Math.min(1,.1*(f.soulState.emptyFifthWins1791??0))},
 abilities:{verseCount:count1791,grantVerses:grant1791,ensureVerses:ensure1791,qualifiedThird:clearThird1791,qualifiedFourth:fourth1791,qualifiedFifth:fifth1791,attemptPoem:poem1791},
 deferred:['空元之录：自身存活于出战背包时，双方已阵亡且不在场精灵消逝，转1篇空妄诗章，并按该精灵因此减少的最大HP10%增加自身上限，每次上限自身maxHP10%。需要真实背包/场下死亡/消逝精灵身份和上限；自身普通技能获诗、致死解锁免费诗、所有铭文及当前诗载荷不延期。'],
 hooks:{choiceLocked(c){const slot=slot1791(c);c.a.soulState.emptySelectedSlot1791=slot;if(slot===1){c.a.soulState.ignoreOwnWeakThis=true;c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;}},
 roundStart(c){if(c.a.soulState.emptySelectedSlot1791===3)c.clearAilments(c.a);},
 beforeFatalDamage:fatal1791,
 afterHit(c){if(slot1791(c)===2&&c.a.hp>0)c.absorbPP(c.a,c.t,1);},
 afterUse(c){if(slot1791(c)===4)fourth1791(c);c.a.soulState.emptyOwnOutcome1791={round:c.round,moveKey:c.m.id,outcome:{successful:c.successful===true,invalid:!!(c.invalidReason?.blocked||c.invalidReason?.miss||c.invalidReason?.blind||c.invalidReason?.forcedMiss||c.invalidReason?.evaded),invalidReason:c.invalidReason??null,miss:!!(c.invalidReason?.miss||c.invalidReason?.blind||c.invalidReason?.forcedMiss||c.invalidReason?.evaded)}};},
 opponentDefeated(c){if(c.fromActualSkill1791&&slot1791(c)===5)fifth1791(c);},
 actionEnd(c){naturalEnd1791(c,true);},opponentActionEnd(c){naturalEnd1791(c,false);},
 roundEnd(c){if(!c.a.soulState.emptyProfane1791||c.a.hp<=0)return;if(c.a.stats.maxHp<=200){c.a.stats.maxHp=0;c.defeat(c.a,'空元之渎上限耗尽');return;}c.reduceMaxHp(c.a,200,'空元之渎每回合削减');}}};

}

}
{
const burning4589=(f,r)=>Number.isInteger(f.ailments['烧伤'])&&f.ailments['烧伤']>=r;
function entry4589(c){if(c.a.hp<=0||c.t.hp!==c.t.stats.maxHp)return false;const duration=1+c.t.moves.filter(id=>c.t.pp[id]===c.maxPP(id)).length;return c.entryAilment?c.entryAilment(c.t,'烧伤',duration):c.ailment(c.t,'烧伤',c.a,false,false,duration);}
function protect4589(c,operation){return c.t!==c.a&&c.t.side!==c.a.side&&burning4589(c.t,c.round)&&(operation==='clear'||operation==='steal'&&c.a.soulId===1864);}
function payload4589(c){if(c.a.hp<=0||!['physical','special'].includes(c.m.kind))return;const burn=burning4589(c.t,c.round);if(c.t.hp>0){c.ailment(c.t,burn?'失明':'烧伤',c.a);if((c.actionAttackDamage??0)===0||burning4589(c.a,c.round))c.ailment(c.t,'焚烬',c.a);}if(c.a.soulId===1864){const count=Object.values(c.t.ailments).filter(end=>end>=c.round).length;if(count)healthRules.drainFixed(c,200*count,'曜焰万象每种异常吸取');}}
function qualifiedHeal4589(c,amount){if(!Number.isFinite(amount)||amount<0)throw Error('抵挡回复载荷须非负数');return c.heal(c.a,amount,'曜焰万象低体抵挡回复');}
const out={};for(const [id,hash] of [[1797,'bd24d5d4'],[1864,'4ba357b8']])out[id]={name:'曜焰万象·文森特'+(id===1864?'·强化':''),sourceHash:hash,partial:false,unimplemented:[],deferred:['真实再次登场时重新检查对手满体及满PP数量施加烧伤；当前首次已实现'],traits:{},abilities:{qualifiedEntry:entry4589,protectBoost:protect4589,qualifiedBlockedHeal:qualifiedHeal4589},hooks:{battleStart:entry4589,roundStart(c){if(id===1864)c.a.soulState.vincentLowAtRoundStart4589=c.a.hp<c.t.hp;},lateRoundEnd(c){const u=c.a.soulState.vincentFifthUse4589;if(u?.round===c.round&&u.lateSoulKO&&u.skillPayloadEnabled&&!u.lateResolved&&c.a.hp>0){u.lateResolved=true;c.ailment(c.a,'烧伤',c.a,false,false,null,{origin:'skill',probabilityPercent:100});}},afterUse:payload4589,blockedAttack4589(c){if(id===1864&&c.a.soulState.vincentLowAtRoundStart4589&&c.amount>0)c.heal(c.a,c.amount,'曜焰万象抵挡前等量回复');},beforeIncomingAttack(c){if(burning4589(c.a,c.round)){c.immuneAttack=true;c.vincentBlock4589=true;}},beforeIncomingDamage(c){if(c.type==='attack'&&burning4589(c.a,c.round)){if(id===1864&&c.a.soulState.vincentLowAtRoundStart4589&&c.amount>0)c.heal(c.a,c.amount,'曜焰万象抵挡前等量回复');c.amount=0;}}}};
Object.assign(registry,out);

}

{
function levels1805(c){const s=c.a.soulState;if(!Number.isInteger(s.ming1805)||!Number.isInteger(s.fall1805)||s.ming1805<0||s.fall1805<0||s.ming1805+s.fall1805!==4)throw Error('1805命起魂落缺少真实初始化或破坏恒4');return {ming:s.ming1805,fall:s.fall1805};}
function transfer1805(c,from,n=1){if(!['ming','fall'].includes(from)||!Number.isInteger(n)||n<0)throw Error('1805转移层参数无效');const old=levels1805(c);if(old[from]<n)return old;c.a.soulState.ming1805=old.ming+(from==='fall'?n:-n);c.a.soulState.fall1805=old.fall+(from==='ming'?n:-n);return levels1805(c);}
function swap1805(c){const old=levels1805(c);c.a.soulState.ming1805=old.fall;c.a.soulState.fall1805=old.ming;return levels1805(c);}
const token1805=c=>({round:c.round,attackerSide:c.t.side,moveId:c.m.id,use:c.t.soulState.skillUses?.[c.m.id]});
const same1805=(a,b)=>a&&a.round===b.round&&a.attackerSide===b.attackerSide&&a.moveId===b.moveId&&a.use===b.use;
function incoming1805(c,power){if(!Number.isFinite(power)||power<0)throw Error('1805明确威力输入无效');const l=levels1805(c),eligible=power<=l.ming*40;if(!eligible)return {eligible:false,immune:false,...l};transfer1805(c,'ming');c.a.soulState.incomingDone1805=token1805(c);const slept=c.ailment(c.t,'睡眠',c.a);if(!slept)c.a.soulState.attackImmune1805={round:c.round,attackerSide:c.t.side,moveId:c.m.id,use:c.t.soulState.skillUses?.[c.m.id]};return {eligible:true,slept,immune:!slept,...levels1805(c)};}
function outgoing1805(c,power){if(!Number.isFinite(power)||power<0)throw Error('1805明确威力输入无效');const l=levels1805(c),eligible=power<=l.fall*40;if(!eligible)return {eligible:false,...l};transfer1805(c,'fall');const slept=c.ailment(c.t,'睡眠',c.a);if(!slept)c.hurt(c.t,c.t.stats.maxHp/3,'魂落睡眠未触发追加','percent');return {eligible:true,slept,...levels1805(c)};}
function reward1805(c,notDefeated){if(typeof notDefeated!=='boolean')throw Error('1805未击败明确条件须布尔');if(!notDefeated||c.a.hp<=0)return {applied:false};const l=levels1805(c),result={applied:true,hp:0,pp:null,immune:false};if(l.ming>=l.fall)result.hp=c.heal(c.a,c.a.stats.maxHp/4,'命起未击败回复');if(l.fall>=l.ming)result.pp=c.restorePP(c.a,1);if(l.ming===l.fall){c.grantOracleImmunity(c.a,1,'soul:1805:61c58f40','1805');result.immune=true;}return result;}

function nativeIncoming1805(c){if(!['physical','special'].includes(c.m.kind)||!['physical','special'].includes(c.selectedMove(c.t)?.kind)||c.m.typedDirect1791)return;const tok=token1805(c);if(!same1805(c.a.soulState.incomingDone1805,tok)){const result=incoming1805(c,c.m.power);if(result.slept&&(c.t.soulState.currentAttackSegment??0)===0)c.interruptBeforeDamage?.('睡眠');}if(same1805(c.a.soulState.attackImmune1805,tok))c.immuneAttack=true;}
function nativeAfter1805(c){if(c.a.hp<=0||c.m.kind==='item'||c.a.soulState.basePPCostThisUse?.round===c.round&&c.a.soulState.basePPCostThisUse.controlRefunded)return;if(['physical','special'].includes(c.m.kind)){if(c.invalidReason&&(c.invalidReason.blocked||c.invalidReason.miss||c.invalidReason.blind||c.invalidReason.forcedMiss||c.invalidReason.evaded)){if(c.m.power<=levels1805(c).fall*40)transfer1805(c,'fall');return;}outgoing1805(c,c.m.power);}}
function failedIncoming1805(c){if(c.a.hp<=0||!['physical','special'].includes(c.m.kind)||!c.usedSkillThisRound(c.t)||c.t.soulState.basePPCostThisUse?.round===c.round&&c.t.soulState.basePPCostThisUse.controlRefunded)return;const tok=token1805(c);if(same1805(c.a.soulState.incomingDone1805,tok))return;c.a.soulState.incomingDone1805=tok;if(c.m.power<=levels1805(c).ming*40)transfer1805(c,'ming');}
function roundReward1805(c){if(c.a.hp<=0||!c.usedSkillThisRound(c.a)||c.a.soulState.basePPCostThisUse?.round===c.round&&c.a.soulState.basePPCostThisUse.controlRefunded)return;reward1805(c,c.a.soulState.defeatedOpponentRound1805!==c.round);}
registry[1805]={name:'灵巢之主·索杰德尔',sourceHash:'61c58f40',partial:false,unimplemented:[],deferred:['真实己方上只下场异常快照→自身登场2回合对应免疫，>=4种全异常；无上只的当前首次不凭空免疫','击败对手下场异常/能力下降快照转给真实下只出战精灵'],traits:{},abilities:{levelCount:levels1805,swapLayers:swap1805,transferLayer:transfer1805,qualifiedIncoming:incoming1805,qualifiedOutgoing:outgoing1805,qualifiedNotDefeated:reward1805},hooks:{battleStart(c){c.a.soulState.ming1805=2;c.a.soulState.fall1805=2;},beforeOpponentAttack:nativeIncoming1805,beforeIncomingAttack:nativeIncoming1805,opponentActionEnd:failedIncoming1805,afterUse:nativeAfter1805,lateRoundEnd:roundReward1805}};

}

{
// 1806 has no self target in the current single-fighter context. Every deferred
// branch below names an actual other party member, switch recipient, or shared
// party ledger. Do not fabricate a link on the owner to execute those branches.
registry[1806]={name:'斯布林蒂',sourceHash:'4b2b51e2',deferred:[
'战斗开始为己方所有其他精灵附加3级未来链接，链接参与未来奇点/未来指令结算；需要真实己方其他成员名单和每成员链接账本，原文排除本体',
'斯布林蒂背包存活时，链接成员受攻击忽略原克制并取己方链接成员最低被克制系数，消费对应成员1级；需要真实队伍链接成员/属性和消费，不凭空授本体链接',
'本体主动下场后按下只链接达到等级依次同步3级体力上限、2级当前体力、1级PP；需要真实主动换宠及下只对象',
'己方其他精灵被击败失去全部未来链接；需要真实其他成员死亡事件',
'本体被击败时清除己方所有未来链接，每实际消除1级给对应成员回300HP/全部PP+1；需要队伍实际链接账本及对应成员，当前本体无链接不凭空复活/恢复'
],traits:{},hooks:{}};

const commands1809=f=>f.soulState.futureInstructions1809??3;
const collapsed1809=f=>f.soulState.collapsedSkills1809??{};
function pending1809(c,id,details){const e={questionId:'Q-N50-4604-'+id,round:c.round,moveId:c.m?.wikiId??c.m?.id,...details};(c.a.soulState.pending1809??=[]).push(e);return e;}
function refresh1809(c){const active=commands1809(c.a)>=2;c.a.soulState.ignoreOwnWeakThis=active;if(active)c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;else if(c.a.soulState.ignoreTargetBoostWhenActingRound===c.round)delete c.a.soulState.ignoreTargetBoostWhenActingRound;}
function grant1809(c,n){if(!Number.isInteger(n)||n<0)throw Error('未来指令增量须非负整数');c.a.soulState.futureInstructions1809=Math.min(3,commands1809(c.a)+n);refresh1809(c);return commands1809(c.a);}
function tiers1809(c){refresh1809(c);const own=c.effective(c.a,'spe'),enemy=c.effective(c.t,'spe');c.a.soulState.saffFast1809=commands1809(c.a)>=1&&own>enemy;return commands1809(c.a);}
function markCollapse1809(c,move){const old=collapsed1809(c.a);if(old[move.id])throw Error('技能已真实崩溃，不能重复消费');(c.a.soulState.collapsedSkills1809??={})[move.id]={wikiId:move.wikiId??move.id,revision:move.revision,round:c.round,triggeredBy:c.m?.id};c.a.soulState.collapsedCount1809=Object.keys(c.a.soulState.collapsedSkills1809).length;return c.a.soulState.collapsedCount1809;}
function collapse1809(c,options={}){const move=options.move??c.m;if(!move||move.kind==='item')throw Error('崩溃缺少真实技能');let target=move;if((move.operations??[]).some(op=>op.effectId===2115)){const id=c.a.moves.find(id=>id!==move.id&&!collapsed1809(c.a)[id]);if(!id){if(c.t.hp<=0)return {immune:true,finalCommand:false};return {immune:true,finalCommand:c.executeFinalCommand1809(move,options.finalContext)};}target=c.moveDefinition(id);}
 if(commands1809(c.a)>0){c.a.soulState.futureInstructions1809=commands1809(c.a)-1;refresh1809(c);return {cancelled:true,collapsed:false,targetId:target.id,remaining:commands1809(c.a)};}
 const count=markCollapse1809(c,target);c.executeCollapse1809(target);return {cancelled:false,collapsed:true,targetId:target.id,remaining:commands1809(c.a),count};}
function drain1809(c,amount){if(!Number.isFinite(amount)||amount<0)throw Error('吸取威力载荷须非负数');if(c.a.hp<=0)return {amount,skippedDead:true};const loss=healthRules.drainFixed(c,amount,'萨芙凯特威力吸取');if(loss===0&&amount>0)c.hurt(c.t,amount,'萨芙凯特未减少体力补偿','true');return {amount,hpLoss:loss};}
function share1809(c,amount){if(amount<=0||c.t.hp<=0)return null;const entry={amount,originRound:c.round,from:c.round+1,until:c.round+2,moveId:c.m.wikiId??c.m.id,use:c.a.soulState.skillUses?.[c.m.id]};(c.a.soulState.saffIndependentShares1809??=[]).push(entry);return entry;}
function after1809(c){if(!c.m||c.m.kind==='item'||c.a.hp<=0||c.a.soulState.basePPCostThisUse?.round===c.round&&c.a.soulState.basePPCostThisUse.controlRefunded)return;const invalid=Object.values(c.invalidReason??{}).some(Boolean)||c.hitEffectsDisabled===true;if(invalid)forced1809(c,{phases:['afterHit'],contextPatch:{onlyMissing1809:true},qualifiedFinalLifecycle:true});if(c.a.hp<=0)return;const base=c.m.power??0,shares=(c.a.soulState.saffIndependentShares1809??[]).filter(x=>x.from<=c.round&&x.until>=c.round);drain1809(c,base+shares.reduce((n,e)=>n+e.amount,0));share1809(c,base);}
function forced1809(c,options){const previous=c.a.soulState.saffForcedUse1809,use=c.a.soulState.skillUses?.[c.m.id];if(previous?.round===c.round&&previous.move===c.m.id&&previous.use===use)return {alreadyDone:true};if(!options||!Array.isArray(options.phases)||!options.phases.length)throw Error('Q-N50-4604-003：须明确限定强制命中载荷阶段');for(const p of options.phases)if(!['beforeUse','afterHit','afterAttack','afterUse'].includes(p))throw Error('强制载荷阶段无效');c.executeForcedPayload1809(c.m,options.phases,options.contextPatch??{});const result=collapse1809(c,options);c.a.soulState.saffForcedUse1809={round:c.round,move:c.m.id,use};return result;}
registry[1809]={name:'萨芙凯特',sourceHash:'ec347375',partial:false,unimplemented:[],traits:{skillAlwaysHit:true,ignorePP:f=>commands1809(f)>=1,skillPriority:f=>(commands1809(f)>=1&&f.soulState.saffFast1809?1:0)+(f.soulState.saffCollapsePriority1809??0),attackMultiplier:f=>1+.4*(f.soulState.collapsedCount1809??0),immuneAilments:f=>f.soulState.saffControlImmune1809?soulStatusPools.pool(undefined,{includeRestricted:true}).filter(x=>conditionStatusRules.isControl(x.name)).map(x=>x.name):[]},abilities:{instructionCount:c=>commands1809(c.a),grantInstructions:grant1809,collapsedSkills:c=>({...collapsed1809(c.a)}),activeShares:c=>(c.a.soulState.saffIndependentShares1809??[]).filter(x=>x.from<=c.round&&x.until>=c.round).map(x=>({...x})),collapseSkill:collapse1809,qualifiedDrain:drain1809,qualifiedForcedHit:forced1809,qualifiedAccumulation(c,options){if(!options||!Number.isFinite(options.amount)||options.amount<0)throw Error('Q-N50-4604-002：累计载荷须明确本次理论数值');return drain1809(c,options.amount);},refreshTiers:tiers1809},hooks:{battleStart(c){c.a.soulState.futureInstructions1809=3;c.a.soulState.collapsedSkills1809={};c.a.soulState.collapsedCount1809=0;},choiceLocked:refresh1809,beforePriority1809:tiers1809,beforeDamage(c){if(commands1809(c.a)>=3){c.affinity=Math.max(1,c.affinity);c.ignoreShield=true;}},afterUse:after1809}};



function snapshot1810(c){const values=Object.values(c.a.stages),st=c.a.soulState;st.infinityRound1810=c.round;st.infinityPower1810=5*c.round;st.infinityPriority1810=Math.floor(c.round/10);st.infinityNoBoost1810=!values.some(n=>n>0);st.infinityNoWeak1810=!values.some(n=>n<0);st.infinityReduce1810=st.infinityNoWeak1810&&c.a.hp<c.t.hp;st.infinityIncrease1810=st.infinityNoWeak1810&&c.a.hp>c.t.hp;st.infinitySnapshot1810={round:c.round,stages:{...c.a.stages},ownHp:c.a.hp,targetHp:c.t.hp,noBoost:st.infinityNoBoost1810,noWeak:st.infinityNoWeak1810,reduce:st.infinityReduce1810,increase:st.infinityIncrease1810};if(st.infinityNoBoost1810)c.a.soulState.opponentBoostsAsWeakThis=true;}
registry[1810]={name:'无限·欧根尼克',sourceHash:'61bf371a',partial:false,unimplemented:[],traits:{pinkDamageMultiplier:f=>f.soulState.infinityIncrease1810?1.3:1,skillPriority:f=>f.soulState.infinityPriority1810??0},hooks:{roundStart:snapshot1810,beforeDamage(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.power+=c.a.soulState.infinityPower1810??5*c.round;},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&c.a.soulState.infinityReduce1810&&c.a.soulState.infinityRound1810===c.round&&(c.damageReductionIgnore??0)<1)c.amount*=.4;}}};



const fields1813=['atk','def','spa','spd','spe','acc'];
function protected1813(c,operation){if(c.a.hp<=c.t.hp)return false;return operation==='clear'||operation==='steal';}
function reverse1813(c){const t=c.opponent??c.t,positive=fields1813.filter(k=>t.stages[k]>0);if(!positive.length)return {success:false,removed:0};const values=Object.fromEntries(positive.map(k=>[k,-t.stages[k]])),out=c.rewriteStageValues(t,values,'reverse'),success=positive.some(k=>out.after[k]===values[k]&&out.before[k]!==out.after[k]);if(success)c.timed(t,'弱化不可解除反转',2,{sourceSoul:1813,sourceHash:'d48bd06c'});return {success,removed:out.removedPositive.length};}
registry[1813]={name:'尘息巨像',sourceHash:'d48bd06c',partial:false,unimplemented:[],traits:{entryMaxHp:200},abilities:{protectBoost:protected1813,qualifiedDeathReverse:reverse1813},hooks:{roundStart(c){if(c.a.hp<c.t.hp)c.stage(c.t,-2,['spe','def']);},death:reverse1813}};


const active1820=(f,r=f.soulState.calculationRound??f.soulState.availableRound??1)=>f.soulState.chordCleanRound1820===r;
const numericShield1820=f=>(f.suitState.shield??0)+(f.soulState.attackShield??0)+(f.soulState.marsShield??0);
const units1820=c=>Math.floor(c.shieldValue(c.a)/300);
function pending1820(c,id,details){const x={questionId:'Q-N50-4612-'+id,round:c.round,...details};(c.a.soulState.chordPending1820??=[]).push(x);return x;}
function pp1820(c,actor){if(c.a.hp<=0||!c.m||c.m.kind==='item')return;const result=c.absorbPP(c.a,c.t,1);const full=c.a.moves.every(id=>c.a.pp[id]===c.maxPP(id));if(full)c.addShield(c.a,300,'soul:1820');(c.a.soulState.chordPPEvents1820??=[]).push({round:c.round,triggerMove:c.m.wikiId??c.m.id,actor,result,full,shieldAdded:full?300:0});}
function orderGap1820(c){if(c.t.soulId===1820&&[c.a,c.t].every(f=>Object.values(c.roundStartStages(f)).some(n=>n>0)))return '双方1820均回合初有正等级，条件统一锁定或依次判断不同';for(const f of[c.a,c.t]){if(!Object.values(f.stages).some(n=>n>0))continue;const removableProtection=(c.on(f,'强化保护')||c.on(f,'幽蝶强化保护'))&&!c.on(f,'protect')&&!f.soulProtect;const oracle=f.soulId===1764&&f.soulState.oracleNoSkillOpponent1764===c.round;if(removableProtection&&!oracle&&!c.boostProtected1820(f))return '可清回合强化保护与正等级同时存在，先清回合/先清强最终等级不同';}return null;}
function clear1820(c,options={}){const initial=Object.values(c.roundStartStages(c.a)).some(n=>n>0),positive=Object.values(c.a.stages).some(n=>n>0),qualified=!!options.qualifiedOrder;if(!(qualified?positive:initial)&&!options.qualifiedPositiveCondition)return {triggered:false};const order=options.qualifiedOrder??'target-effects-own-effects-target-boosts-own-boosts';if(!['target-effects-own-effects-target-boosts-own-boosts','effects-then-boost','boost-then-effects'].includes(order))throw Error('明确清除顺序无效');const results={ownEffects:false,targetEffects:false,ownBoosts:false,targetBoosts:false},steps=[];const apply=(key,fn)=>{steps.push(key);results[key]=!!fn();};if(order==='target-effects-own-effects-target-boosts-own-boosts'){apply('targetEffects',()=>c.clear(c.t));apply('ownEffects',()=>c.clear(c.a));apply('targetBoosts',()=>c.clearBoost(c.t));apply('ownBoosts',()=>c.clearBoost(c.a));}else{const effects=()=>{apply('ownEffects',()=>c.clear(c.a));apply('targetEffects',()=>c.clear(c.t));},boosts=()=>{apply('ownBoosts',()=>c.clearBoost(c.a));apply('targetBoosts',()=>c.clearBoost(c.t));};if(order==='effects-then-boost'){effects();boosts();}else{boosts();effects();}}const success=Object.values(results).some(Boolean);if(success)c.a.soulState.chordCleanRound1820=c.round;(c.a.soulState.chordClearEvents1820??=[]).push({round:c.round,order,qualified,initialPositive:initial,steps,results,success});return {triggered:true,success,results};}

registry[1820]={name:'魂弦',sourceHash:'8771399c',partial:false,unimplemented:[],traits:{ailmentImmune:f=>active1820(f),attackMultiplier:f=>active1820(f)?1+.5*Math.floor(numericShield1820(f)/300):1},abilities:{qualifiedClear:clear1820,shieldUnits:units1820,qualifiedOutput(c,p){if(!p||!['ordinary-attack-only','all-damage'].includes(p.scope)||!['fixed','percent','true','typed'].includes(p.type)||!Number.isFinite(p.amount)||p.amount<0)throw Error('Q-N50-4612-001：须明确伤害范围与载荷');const n=p.amount*(p.scope==='all-damage'&&active1820(c.a,c.round)?1+.5*units1820(c):1);c.a.soulState.chordQualifiedOutput1820=true;try{return p.type==='typed'?c.typedAttack(n,'次元'):c.hurt(c.t,n,'明确1820伤害范围载荷',p.type);}finally{delete c.a.soulState.chordQualifiedOutput1820;}}},hooks:{roundStart(c){clear1820(c);},afterUse:c=>pp1820(c,c.a.side),opponentSkillResolved:c=>pp1820(c,c.t.side)}};


const gaze1824=f=>!!f.soulState.specialStates?.gaze1824;
const dragon1824=(c,f)=>c.typeParts(f.type).includes('龙')||gaze1824(f);
function pending1824(c,q,details){(c.a.soulState.gazePending1824??=[]).push({questionId:q,round:c.round,...details});}
function grant1824(c){c.addSpecialState(c.t,'gaze1824',{sourceSoul:1824,sourceHash:'af241f96',sourceSide:c.a.side});return true;}
function release1824(c){if(!gaze1824(c.t))return false;delete c.t.soulState.specialStates.gaze1824;return true;}
function trigger1824(c,policy={}){policy={...policy,drainType:policy.drainType??'fixed'};if(c.a.hp<=0)return {triggered:false};const had=gaze1824(c.t);if(!had){if(!['fixed','percent','true'].includes(policy.drainType))throw Error('Q-BATCH-004：1824固定300吸取伤害类型待直接确认');grant1824(c);c.hurt(c.t,300,'窥目固定数值吸取',policy.drainType);c.heal(c.a,300,'窥目固定数值吸取理论回复');return {triggered:true,branch:'grant'};}
 release1824(c);const ailments=Object.keys(c.t.ailments).filter(k=>c.t.ailments[k]>=c.round);if(!ailments.length){const applied=c.ailment(c.t,'害怕',c.a);return {triggered:true,branch:'fear',applied};}
 if(policy.curseDuration!==undefined&&(!Number.isInteger(policy.curseDuration)||policy.curseDuration<1))throw Error('1824 explicit curse duration invalid');const remaining=Object.fromEntries(ailments.map(k=>[k,c.t.ailments[k]-c.round+1]));for(const k of ailments)if(k!=='诅咒')c.convertAilment(c.t,k,'诅咒',policy.curseDuration??remaining[k]);if(ailments.length===1&&ailments[0]==='诅咒')return {triggered:true,branch:'curse',converted:0};return {triggered:true,branch:'curse',converted:ailments.filter(k=>k!=='诅咒').length};}
registry[1824]={name:'佩洛瑟斯',sourceHash:'af241f96',partial:false,unimplemented:[],traits:{ailmentImmune:f=>f.soulState.gazeImmuneRound1824===(f.soulState.calculationRound??f.soulState.availableRound??1)},abilities:{hasGaze:c=>gaze1824(c.t),countsAsDragon:c=>dragon1824(c,c.t),grantGaze:grant1824,releaseGaze:release1824,qualifiedTrigger:trigger1824,incomingAffinity(c){if(dragon1824(c,c.t)){c.affinity=1;c.stab=1;}},},hooks:{opponentBeforeUse(c){if(c.m?.kind==='status'&&dragon1824(c,c.t))c.a.soulState.gazeImmuneRound1824=c.round;},afterUse(c){if(['physical','special'].includes(c.m?.kind))trigger1824(c,c.a.soulState.qualifiedGaze1824??{});},attackDamageTaken(c){const root=c.m.replayRootMoveId??c.m.id,token=c.t.soulState.skillUses?.[root],key=c.round+':'+c.t.side+':'+root+':'+token;if(c.a.soulState.gazeIncoming1824?.key!==key)c.a.soulState.gazeIncoming1824={key,settled:0,segments:0,anyNonImmune:false};c.a.soulState.gazeIncoming1824.settled+=c.settledDamage;c.a.soulState.gazeIncoming1824.segments++;c.a.soulState.gazeIncoming1824.anyNonImmune ||= !c.attackImmune;},opponentSkillResolved(c){if(!['physical','special'].includes(c.m?.kind))return;const token=c.t.soulState.skillUses?.[c.m.id],key=c.round+':'+c.t.side+':'+c.m.id+':'+token,memo=c.a.soulState.gazeIncoming1824;if(!memo||memo.key!==key)return;if(!memo.anyNonImmune)return;if(c.a.soulState.gazeReceivedUse1824===key)return;c.a.soulState.gazeReceivedUse1824=key;trigger1824(c,c.a.soulState.qualifiedGaze1824??{});}}};


const lit1826=f=>f.soulState.candleLit1826!==false;
const ignite1826=c=>{const changed=!lit1826(c.a);c.a.soulState.candleLit1826=true;return changed;};
const extinguish1826=c=>{const changed=lit1826(c.a);c.a.soulState.candleLit1826=false;return changed;};
function pending1826(c,n,details){(c.a.soulState.candlePending1826??=[]).push({questionId:n==='shared-4618-001'?'Q-N50-4618-001':'Q-N50-4620-'+n,round:c.round,...details});}
function setOne1826(c,f,raiseZero){const blocked=c.ppReductionBlocked(f);for(const k of f.moves){if(f.pp[k]>1&&!blocked)f.pp[k]=1;else if(f.pp[k]===0&&raiseZero)f.pp[k]=1;}}
function entry1826(c,p={}){p={zeroPreservation:"raise-one",failureMeaning:"burn-failed",...p};if(p.zeroPreservation&&!['keep-zero','raise-one'].includes(p.zeroPreservation))throw Error('明确0PP保留策略无效');ignite1826(c);const blocked=c.ppReductionBlocked(c.t),slots=[];let deducted=0;for(const k of c.t.moves){const before=c.t.pp[k];if(!blocked)c.t.pp[k]=Math.max(0,before-2);const lost=before-c.t.pp[k];slots.push({id:k,before,after:c.t.pp[k],deducted:lost});deducted+=lost;}
 const event={round:c.round,blocked,slots,deducted,previousFighterRestore:{deferred:true,slots:slots.map(x=>({donorId:x.id,actual:x.deducted}))},restoredBoth:false};(c.a.soulState.candleEntry1826??=[]).push(event);
 if(deducted>=10){for(const f of[c.a,c.t])for(const k of f.moves)f.pp[k]=c.maxPP(k);event.restoredBoth=true;return event;}
 const hasZero=c.t.moves.some(k=>c.t.pp[k]===0);if(hasZero&&!p.zeroPreservation){pending1826(c,'003',{reason:'小于10保留1PP时真实0PP槽',slots});throw Error('Q-N50-4620-003：保留1PP对0PP槽如何处理待确认');}setOne1826(c,c.t,p.zeroPreservation==='raise-one');const burned=c.entryAilment?c.entryAilment(c.t,'烧伤'):c.ailment(c.t,'烧伤',c.a);event.burned=burned;if(!burned&&c.t.moves.some(k=>c.t.pp[k]===0)&&p.failureMeaning!=='burn-failed'){pending1826(c,'003',{reason:'未触发归属影响零PP是否归1',afterPreservation:{...c.t.pp}});throw Error('Q-N50-4620-003：未触发是否指烧伤失败及归1补偿待确认');}if(!burned)setOne1826(c,c.t,true);event.finalPP={...c.t.pp};return event;}

function rank1826(c,f,kind,p=c.a.soulState.qualifiedRank1826??{snapshot:"before-consume",ties:"all"}){const id=c.m?.id;if(!f.moves.includes(id))return false;const current={...f.pp},snap=c.a.soulState.candleRoundPP1826?.round===c.round?c.a.soulState.candleRoundPP1826[f.side]:null,before=f.soulState.basePPCostThisUse?.round===c.round&&f.soulState.basePPCostThisUse.move===id?f.soulState.ppBeforeUse:null;const states={current,'round-start':snap??current,'before-consume':before??current};const evaluate=pp=>{const pool=f.moves.filter(k=>kind!=='min'||pp[k]>0);if(!pool.length)return {selected:false,tied:false};const value=kind==='min'?Math.min(...pool.map(k=>pp[k])):Math.max(...pool.map(k=>pp[k])),members=pool.filter(k=>pp[k]===value);return {selected:members.includes(id),tied:members.length>1,members};};if(p.snapshot){if(!Object.hasOwn(states,p.snapshot))throw Error('明确PP排名快照无效');const v=evaluate(states[p.snapshot]);if(v.selected&&v.tied&&p.ties!=='all')throw Error('明确并列载荷须指定all');return v.selected;}
 const values=Object.entries(states).map(([snapshot,pp])=>({snapshot,...evaluate(pp)}));if(values.some(v=>v.selected!==values[0].selected)||values.some(v=>v.selected&&v.tied)){pending1826(c,'001',{reason:'真实PP排名并列或当前/回合初/扣除前不同',kind,move:id,targetSide:f.side,states,values});throw Error('Q-N50-4620-001：PP排行并列或读取时点实际产生差异');}return values[0].selected;}
function dark1826(c){if(lit1826(c.a))return {min:false,max:false};return {min:rank1826(c,c.a,'min'),max:rank1826(c,c.a,'max')};}
function end1826(c,p={}){if(c.a.hp<=0||!lit1826(c.a)||!(c.t.ailments['烧伤']>=c.round))return false;extinguish1826(c);return c.convertAilment(c.t,'烧伤','焚烬',Number.isInteger(p.duration)?p.duration+1:undefined);}
registry[1826]={name:'孤烛灯使',sourceHash:'b5a2035a',traits:{},partial:false,unimplemented:[],deferred:['恢复至己方上只精灵的逐槽PP恢复；需要真实上只身份/离场记录与槽位。当前扣敌PP、点烛及阈值分支不延期'],abilities:{candleLit:c=>lit1826(c.a),ignite:ignite1826,extinguish:extinguish1826,qualifiedEntry:entry1826,qualifiedExtinguishConversion:end1826,rank:rank1826,blocksHitEffects(c){return lit1826(c.a)&&rank1826(c,c.t,'max');}},hooks:{battleStart:entry1826,roundStart(c){c.a.soulState.candleRoundPP1826={round:c.round,[c.a.side]:{...c.a.pp},[c.t.side]:{...c.t.pp}};},opponentBeforeUse(c){if(lit1826(c.a))rank1826(c,c.t,'min');},opponentPriority(c){if(lit1826(c.a)&&rank1826(c,c.t,'min'))c.priority=0;},beforeUse(c){if(lit1826(c.a))return;const q=dark1826(c);if(q.min){c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;c.a.soulState.candleIgnoresBoost1826=true;}},beforeAttackDamage(c){if(lit1826(c.a))return;if(dark1826(c).min){c.a.soulState.ignoreTargetBoostWhenActingRound=c.round;c.a.soulState.candleIgnoresBoost1826=true;}},beforeDamage(c){const q=dark1826(c);if(q.min)c.ignoreImmunity=true;if(q.max){c.ignoreShield=true;c.power*=2;}},afterUse(c){if(c.a.soulState.candleIgnoresBoost1826){delete c.a.soulState.ignoreTargetBoostWhenActingRound;delete c.a.soulState.candleIgnoresBoost1826;}},roundEnd(c){end1826(c,c.a.soulState.qualifiedBurnConversion1826??{});}}};


const intent1829=f=>Math.max(0,Math.min(20,f.soulState.intent1829??0));
const fate1829=f=>!!f.soulState.fateProtection1829;
function pending1829(c,id,details){(c.a.soulState.intentPending1829??=[]).push({questionId:id,round:c.round,...details});}
function gain1829(c,n){if(!Number.isInteger(n)||n<0)throw Error('战意获得层数必须为非负整数');const before=intent1829(c.a);c.a.soulState.intent1829=Math.min(20,before+n);if(intent1829(c.a)>=10){c.a.soulState.fateProtection1829=true;if(c.a.soulState.resistanceProfile1829)c.a.soulState.resistanceProfile1829.fullBonus=0;}return {before,after:intent1829(c.a),gained:intent1829(c.a)-before,ward:fate1829(c.a)};}
function configure1829(c,p){if(!p||![0,.05].includes(p.fullBonus)||typeof p.includedInConfigured!=='boolean')throw Error('1829局部抗性配置须明确fullBonus=0或0.05及configured是否已含bonus');c.a.soulState.resistanceProfile1829={originalFullBonus:p.fullBonus,fullBonus:fate1829(c.a)?0:p.fullBonus,includedInConfigured:p.includedInConfigured};return {...c.a.soulState.resistanceProfile1829};}
function resistance1829(c,k,base){const configured=c.a.build.resistance.major===k||c.a.build.resistance.minor===k,p=c.a.soulState.resistanceProfile1829;if(fate1829(c.a))return configured?1:0;if(!p)return base;const specific=Math.max(0,base-(configured&&p.includedInConfigured?p.originalFullBonus:0));return Math.min(1,specific+p.fullBonus);}

function end1829(c){if(c.a.hp<=0)return;const before=intent1829(c.a),burned=c.t.ailments['烧伤']>=c.round;if(burned&&before>0)c.hurt(c.t,before*10,'希拓烧伤战意真实伤害','true');if(c.a.hp>0)gain1829(c,2);(c.a.soulState.intentEndEvents1829??=[]).push({round:c.round,before,burned,trueDamage:burned?before*10:0,after:intent1829(c.a),ward:fate1829(c.a)});}
registry[1829]={name:'希拓',sourceHash:'13cc07dd',partial:false,unimplemented:[],deferred:['场下每只系别含火精灵使回合末额外获得1层战意；当前独立+2层已实现','战意/命运庇护真实下场保留与再登场；不把当前资源/能力延期'],traits:{attackMultiplier:f=>1+.05*intent1829(f)},abilities:{intentCount:c=>intent1829(c.a),fateProtection:c=>fate1829(c.a),gainIntent:gain1829,configureResistance:configure1829,resistanceChance:resistance1829,qualifiedRoundEnd:end1829},hooks:{battleStart(c){c.a.soulState.intent1829=0;c.a.soulState.fateProtection1829=false;},roundStart(c){if(c.a.hp>0&&c.t.hp>0)c.ailment(c.t,'烧伤',c.a,false,false,null,{probabilityPercent:100});},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&(c.damageReductionIgnore??0)<1)c.amount*=Math.round((1-.04*intent1829(c.a))*1e12)/1e12;},roundEnd:end1829}};


const rockActive1830=f=>f.soulState.rockOrder1830?.round===(f.soulState.calculationRound??f.soulState.availableRound??1);
function pending1830(c,id,details){(c.a.soulState.rockPending1830??=[]).push({questionId:id,round:c.round,...details});}
function shield1830(c,p={}){p={basis:"settled",cap:"round-granted-own",...p};if(c.type!=='attack'||c.settledDamage<=0||!rockActive1830(c.a)||!c.a.soulState.rockOrder1830?.first)return {granted:0};const source='soul:1830',own=c.shieldSourceValue(c.a,source),total=c.shieldValue(c.a),ever=c.a.soulState.rockShieldEver1830??0,roundRecord=c.a.soulState.rockShieldRound1830,roundGiven=roundRecord?.round===c.round?roundRecord.n:0,bases=p.basis?[p.basis]:['settled','hp-loss'],caps=p.cap?[p.cap]:['current-own','total-granted-own','current-total','round-granted-own'];if(bases.some(x=>!['settled','hp-loss'].includes(x))||caps.some(x=>!['current-own','total-granted-own','current-total','round-granted-own'].includes(x)))throw Error('1830明确盾基数/累计策略无效');const calc=(basis,cap)=>Math.max(0,Math.min(basis==='settled'?c.settledDamage:c.hpLoss??c.dealt,300-(cap==='current-own'?own:cap==='current-total'?total:cap==='total-granted-own'?ever:roundGiven))),values=bases.flatMap(basis=>caps.map(cap=>({basis,cap,n:calc(basis,cap)})));if(values.some(x=>x.n!==values[0].n)){const basisDiff=!p.basis&&caps.some(cap=>calc('settled',cap)!==calc('hp-loss',cap)),q=basisDiff?'Q-N50-4623-001':'Q-N50-4623-002';pending1830(c,q,{reason:basisDiff?'盾取完整结算/实际HP损失产生差异':'盾累计上限的当前/整场/当轮/其他盾范围产生差异',settled:c.settledDamage,hpLoss:c.hpLoss??c.dealt,own,total,ever,roundGiven,values});throw Error(q+'：1830护盾载荷未确认');}const n=values[0].n;if(n>0){c.addShield(c.a,n,source);c.a.soulState.rockShieldEver1830=ever+n;c.a.soulState.rockShieldRound1830={round:c.round,n:roundGiven+n};}return {granted:n,values};}
function convert1830(c,p={}){if(c.a.hp<=0||c.settledDamage<=0||!rockActive1830(c.a)||c.a.soulState.rockOrder1830?.first)return;const from=Object.keys(c.a.ailments).filter(k=>k!=='流血'&&c.a.ailments[k]>=c.round);for(const k of from)c.convertAilment(c.a,k,'流血',Number.isInteger(p.duration)?p.duration:undefined);}
function next1830(c,mode="refresh"){const old=c.a.soulState.rockNext1830??0;if(old&&!mode){pending1830(c,'Q-N50-4511-006',{reason:'旧下次技能奖励未消费再次授予',old});throw Error('Q-N50-4511-006：未消费下次先制/必暴重授是否叠加未定');}if(mode&&!['refresh','stack'].includes(mode))throw Error('明确下次资源重授策略无效');c.a.soulState.rockNext1830=mode==='stack'?old+1:1;return c.a.soulState.rockNext1830;}
function end1830(c,p={}){if(c.a.hp<=0)return;if(c.a.hp===c.a.stats.maxHp){c.stage(c.a,1);const restored=[];for(const k of c.a.moves)if(['physical','special'].includes(c.moveKind(k))){const before=c.a.pp[k];c.a.pp[k]=Math.min(c.maxPP(k),before+1);restored.push({id:k,before,after:c.a.pp[k]});}c.a.soulState.rockLastFull1830={round:c.round,restored};}else next1830(c,p.regrant);}
registry[1830]={name:'裂岩·艾克特希',sourceHash:'3462c88c',partial:false,unimplemented:[],traits:{attackMultiplier:f=>rockActive1830(f)&&f.soulState.rockOrder1830.first?1.5:1,skillPriority:f=>f.soulState.rockNext1830??0},abilities:{qualifiedShield:shield1830,qualifiedConversion:convert1830,qualifiedEnd:end1830,qualifiedNextReward:next1830},hooks:{orderResolved(c){c.a.soulState.rockOrder1830={round:c.round,first:c.a.side===c.first};},beforeIncomingAttack(c){if(rockActive1830(c.a)&&!c.a.soulState.rockOrder1830.first)c.reduction+=.2;},beforeIncomingDamage(c){if(c.type==='percent'&&(c.damageReductionIgnore??0)<1&&rockActive1830(c.a)&&!c.a.soulState.rockOrder1830.first)c.amount*=.8;},damageDealt(c){shield1830(c,c.a.soulState.qualifiedShield1830??{});},attackDamageTaken(c){convert1830(c,c.a.soulState.qualifiedBleed1830??{});},beforeUse(c){const n=c.a.soulState.rockNext1830;if(n){c.a.soulState.rockUsingNext1830={round:c.round,move:c.m.id,priority:n};delete c.a.soulState.rockNext1830;}},beforeCrit(c){const v=c.a.soulState.rockUsingNext1830;if(v?.round===c.round&&v.move===c.m.id)c.forceCrit=true;},afterUse(c){delete c.a.soulState.rockUsingNext1830;},roundEnd(c){end1830(c,c.a.soulState.qualifiedNext1830??{});}}};


const lifeKinds1831=['lost','return'];
function marks1831(f){return f.soulState.lifeMarks1831??={};}
function has1831(c,f,kind){if(!lifeKinds1831.includes(kind))throw Error('1831 mark kind');const x=marks1831(f)[kind];return !!x&&x.start<=c.round&&x.end>=c.round;}
function grant1831(c,f,kind,n=3){if(!Number.isInteger(n)||n<1)throw Error('1831 duration');const x={start:c.round,end:c.round+n-1,sourceSide:c.a.side};marks1831(f)[kind]=x;return {...x};}
function removed1831(c,f,kind,reason){(f.soulState.lifeRemoved1831??=[]).push({round:c.round,kind,reason});}
function transfer1831(c,from,to,kind){if(!has1831(c,from,kind))return false;const original=marks1831(from)[kind],policy=c.a.soulState.qualifiedLifeTransfer1831??'preserve',x={...original,...(policy==='renew3'?{start:c.round,end:c.round+2}:{})};delete marks1831(from)[kind];removed1831(c,from,kind,'transfer');marks1831(to)[kind]={...x};return true;}
function reduce1831(c,f,kind,n=1){if(!has1831(c,f,kind))return false;const x=marks1831(f)[kind];x.end-=n;if(x.end<c.round){delete marks1831(f)[kind];removed1831(c,f,kind,'reduced-to-zero');}return true;}
function remove1831(c,f,kind){if(!has1831(c,f,kind))return false;delete marks1831(f)[kind];removed1831(c,f,kind,'qualified-removal');return true;}
function entry1831(c){c.a.soulState.lifeEntry1831={round:c.round,halfDifference:Math.abs(c.a.hp-c.t.hp)/2};if(c.a.hp>=c.t.hp||c.a.hp<=0)return false;grant1831(c,c.a,'lost',3);grant1831(c,c.t,'return',3);return true;}
function healing1831(c,p={}){const lost=has1831(c,c.a,'lost'),ret=has1831(c,c.a,'return');if(lost&&ret){const policy=p.policy??c.a.soulState.qualifiedLifeHealing1831??"add";if(!policy)throw Error('Q-N50-4625-002：失命与回命同时存在的回复加乘关系待确认');if(!['add','multiply'].includes(policy))throw Error('1831 healing policy');return policy==='add'?1:0;}return lost?0:ret?2:1;}

function pendingLife1831(c,id,detail){(c.a.soulState.lifePending1831??=[]).push({questionId:id,round:c.round,...detail});throw Error(id+'：1831机制待确认');}
function sample1831(c,record,kind){const policy=c.a.soulState.qualifiedLifeSample1831??c.t?.soulState.qualifiedLifeSample1831;return policy==='current'?Math.abs(c.a.hp-c.t.hp)/2:policy==='round-start'?record.halfDifference:(record.ownerSide===c.a.side?c.a:record.ownerSide===c.t?.side?c.t:c.a).soulState.lifeEntry1831?.halfDifference??record.entryHalfDifference;}
function round1831(c){const record={round:c.round,halfDifference:Math.abs(c.a.hp-c.t.hp)/2,entryHalfDifference:c.a.soulState.lifeEntry1831?.halfDifference??Math.abs(c.a.hp-c.t.hp)/2};c.a.soulState.lifeAttack1831={...record,active:has1831(c,c.a,'lost')};c.t.soulState.lifeReduction1831={...record,active:has1831(c,c.t,'return'),ownerSide:c.a.side};}
function reduction1831(c,incoming=Infinity){const v=c.a.soulState.lifeReduction1831;if(v?.round!==c.round||!v.active)return 0;return sample1831(c,v,'return-red-reduction');}
function payload1831(c,u,policy){const now=Math.abs(c.a.hp-c.t.hp)/2,values={entry:c.a.soulState.lifeEntry1831?.halfDifference??u.entryHalfDifference,'round-start':u.startHalfDifference,'before-attack':u.beforeHalfDifference,'after-attack':now};if(!Object.hasOwn(values,policy.sample))throw Error('1831明确采样策略无效');const amount=values[policy.sample];if(amount>0){c.a.soulState.lifeAdditionalResolving1831={round:c.round,move:c.m.id,use:c.effectUseCount(),phase:policy.phase};try{c.hurt(c.t,amount,'失命用攻击附加','percent');}finally{delete c.a.soulState.lifeAdditionalResolving1831;}}u.executed=true;c.a.soulState.lifeLastAdditional1831={round:c.round,move:c.m.id,amount,phase:policy.phase,sample:policy.sample};}
function use1831(c){const v=c.a.soulState.lifeAttack1831;if(v?.round!==c.round||!v.active||!['physical','special'].includes(c.m.kind))return;const u={round:c.round,move:c.m.id,entryHalfDifference:v.entryHalfDifference,startHalfDifference:v.halfDifference,beforeHalfDifference:Math.abs(c.a.hp-c.t.hp)/2};c.a.soulState.lifeUse1831=u;const policy=c.a.soulState.qualifiedLifeUse1831;if(policy?.phase==='before'){if(policy.miss!=='used'||policy.sample==='after-attack')throw Error('1831伤前执行须明确实际用招触发及非伤后采样');payload1831(c,u,policy);}}
function afterUse1831(c){const u=c.a.soulState.lifeUse1831;if(u?.round!==c.round||u.move!==c.m.id||u.executed)return;const now=Math.abs(c.a.hp-c.t.hp)/2,policy=c.a.soulState.qualifiedLifeUse1831??{phase:'after',sample:'entry',miss:'hit'};if(!policy){if(u.startHalfDifference===0&&u.beforeHalfDifference===0&&now===0){c.a.soulState.lifeLastAdditional1831={round:c.round,move:c.m.id,amount:0,phase:'common-zero'};return;}pendingLife1831(c,'Q-N50-4625-001',{kind:'lost-use-amount-and-execution-point',start:u.startHalfDifference,before:u.beforeHalfDifference,after:now,successful:c.successful,invalidReason:c.invalidReason});}if(policy.phase!=='after')throw Error('1831明确附伤结算阶段无效');if(!c.successful&&policy.miss!=='used'&&policy.miss!=='hit')pendingLife1831(c,'Q-N50-4625-001',{kind:'lost-MISS-or-invalid'});if(!c.successful&&policy.miss==='hit')return;payload1831(c,u,policy);}
function reverse1831(c,f,kind){const before=f.hp,next=f.stats.maxHp-before;if(before<=0)return false;if(next!==0){f.hp=next;c.emit?.('失命回命反转体力：'+before+'→'+f.hp);(f.soulState.lifeReversals1831??=[]).push({round:c.round,kind,before,after:f.hp});return true;}const policy=f.soulState.qualifiedLifeZero1831??c.a.soulState.qualifiedLifeZero1831??"healing",multiplier=c.lifeHealingMultiplier1831(f),blocked=!!f.effects['四杀鬼囹']&&f.effects['四杀鬼囹'].start<=c.round&&f.effects['四杀鬼囹'].end>=c.round,mirror=c.on?.(f===c.a?c.t:c.a,'斯布林蒂镜像回复');if((multiplier!==1||blocked||mirror)&&!['healing','forced-one'].includes(policy))pendingLife1831(c,'Q-N50-4625-003',{kind,before,next,multiplier,blocked,mirror:!!mirror});f.hp=0;if(policy==='forced-one')f.hp=1;else c.lifeZeroHeal1831(f,1);(f.soulState.lifeReversals1831??=[]).push({round:c.round,kind,before,after:f.hp,zeroPolicy:policy??'common-one'});return true;}
function end1831(c){for(const f of[c.a,c.t])for(const kind of lifeKinds1831){const x=marks1831(f)[kind];if(x&&x.end<=c.round){delete marks1831(f)[kind];removed1831(c,f,kind,'expiry');}}for(const [f,kind]of[[c.a,'lost'],[c.t,'return']]){const list=f.soulState.lifeRemoved1831??[];if(list.some(x=>x.round===c.round&&x.kind===kind)&&f.soulState.lifeReverseRound1831?.[kind]!==c.round){reverse1831(c,f,kind);(f.soulState.lifeReverseRound1831??={})[kind]=c.round;}}}
registry[1831]={name:'伏尔格安',sourceHash:'ee3314d',partial:false,unimplemented:[],traits:{},abilities:{hasMark:has1831,grantMark:grant1831,transferMark:transfer1831,reduceMark:reduce1831,qualifiedRemoveMark:remove1831,invokeEntry:entry1831,healingFactor:healing1831,attackReduction:reduction1831,qualifiedReverse:reverse1831},hooks:{battleStart:entry1831,roundStart:round1831,beforeUse:use1831,afterUse:afterUse1831,afterRoundEnd:end1831}};


function count1833(c){return Math.max(0,Math.min(7,c.a.soulState.guardedFlame1833??0));}
function grant1833(c,n){if(!Number.isInteger(n)||n<0)throw Error('1833灼火层数必须非负整数');const before=count1833(c),after=Math.min(7,before+n);c.a.soulState.guardedFlame1833=after;return {before,after,gained:after-before};}
function consume1833(c){const n=count1833(c);c.a.soulState.guardedFlame1833=0;return n;}

function burn1833(f,r){const end=f.ailments['烧伤'];return Number.isFinite(end)&&end>=r?end-r+1:0;}
function pending1833(c,id,details){(c.a.soulState.hestiaPending1833??=[]).push({questionId:id,round:c.round,...details});throw Error(id+'：1833资料待确认');}
function enter1833(c){(c.t.soulState.specialStates??={})['炙光火种']={sourceSide:c.a.side,sourceSoul:1833,sourceHash:'7d4fbbb',start:c.round};}
function start1833(c){const n=burn1833(c.a,c.round);c.a.soulState.hestiaStart1833={round:c.round,burn:n,bind:burn1833(c.t,c.round)===0};if(n)c.stage(c.a,n,['spa','spe']);}
function extendBurn1833(c,record){const n=record.burn,after=Math.max(n,Math.min(7,n+2));c.a.ailments['烧伤']=c.round+after-1;record.extended=true;c.a.soulState.hestiaExtension1833={round:c.round,before:n,after};}
function extensionChoice1833(c,record){if(record.extended)return;const policy=c.a.soulState.qualifiedBurnScope1833??"always";if(record.dodged||policy==='always'){extendBurn1833(c,record);return;}if(record.burn>=7){record.extended=true;c.a.soulState.hestiaExtension1833={round:c.round,before:record.burn,after:record.burn};return;}if(policy==='with-dodge'){record.extended=true;c.a.soulState.hestiaExtension1833={round:c.round,before:record.burn,after:record.burn};return;}pending1833(c,'Q-N50-4627-002',{reason:'70%是否同时支配烧伤+2',before:record.burn,dodged:!!record.dodged});}
function incoming1833(c){if(!['physical','special'].includes(c.m?.kind))return;const n=burn1833(c.a,c.round),record={round:c.round,enabled:n>0,burn:n,move:c.m.id,use:c.t.soulState.skillUses?.[c.m.id]};c.a.soulState.hestiaDodge1833=record;if(!n){const self=c.ailment(c.a,'烧伤',c.a,false,false,3),foe=c.ailment(c.t,'烧伤',c.a,false,false,3);c.a.soulState.hestiaBurnAttempt1833={round:c.round,self,foe};return;}if((c.a.soulState.qualifiedBurnScope1833??'always')==='always')extendBurn1833(c,record);}
function dodge1833(c){const record=c.a.soulState.hestiaDodge1833;if(record?.round!==c.round||!record.enabled)return;record.dodged=!c.alwaysHit&&c.random()<.7;if(record.dodged)c.dodge=true;extensionChoice1833(c,record);}
function resolved1833(c){const record=c.a.soulState.hestiaDodge1833;if(record?.round===c.round&&record.enabled&&!record.extended)extensionChoice1833(c,record);delete c.a.soulState.hestiaDodge1833;}
function used1833(c){if(c.m?.kind==='item')return;if(c.a.soulState.hestiaStart1833?.round!==c.round||!c.a.soulState.hestiaStart1833.bind)return;c.ailment(c.t,'束缚',c.a);c.stage(c.t,-1,['spd','spe']);}
function death1833(c,p={}){const marked=c.t.soulState.specialStates?.['炙光火种'];if(marked?.sourceSide!==c.a.side||marked.sourceSoul!==1833||c.defeater1833?.side!==c.t.side)return;if(c.a.soulState.hestiaDeath1833?.round===c.round)return;const n=burn1833(c.a,c.round),cleared=c.clear(c.t),applied=c.ailment(c.t,'焚烬',c.a);if(n)c.clearAilment(c.a,'烧伤');c.a.soulState.hestiaDeath1833={round:c.round,burn:n,cleared,burned:applied,killerSide:c.t.side};if(!n)return;const side=p.recipient??c.a.soulState.qualifiedFlameRecipient1833??"owner";if(!['owner','killer'].includes(side))pending1833(c,'Q-N50-4627-001',{reason:'炙光火种定义内对方获得灼火的持有侧',burn:n});const receiver=side==='owner'?c.a:c.t;const result=grant1833({...c,a:receiver},n);c.a.soulState.hestiaDeath1833.grant={side:receiver.side,...result};}
registry[1833]={name:'赫斯提亚',sourceHash:'7d4fbbb',partial:false,unimplemented:[],deferred:['真实下场后炙光火种消失的换宠调度','对赫斯提亚以外己方其他精灵使用攻击时消耗共享灼火并给予当轮免异常与攻击者烧伤；当前自身2146获得及2147消耗均已独立实现接口'],traits:{},abilities:{layerCount:count1833,grantLayers:grant1833,consumeAll:consume1833,qualifiedDeath:death1833},hooks:{battleStart:enter1833,roundStart:start1833,opponentBeforeUse:incoming1833,beforeDodge:dodge1833,afterUse:used1833,opponentSkillResolved:resolved1833,death:death1833}};


function bleeding1835(f,r=f.soulState.calculationRound??f.soulState.availableRound??1){return Number.isFinite(f.ailments['流血'])&&f.ailments['流血']>=r;}
function pending1835(c,id,detail){(c.a.soulState.hebroPending1835??=[]).push({questionId:id,round:c.round,...detail});throw Error(id+'：1835机制待确认');}
function self1835(c){if(c.m?.kind!=='status')return;const active=bleeding1835(c.a,c.round),n=active?c.a.ailments['流血']-c.round+1:0,p=c.a.soulState.qualifiedSelfBleed1835??"normal";if(active&&!p&&n<3&&!c.on(c.a,'免异常'))pending1835(c,'Q-N50-4628-002',{reason:'血态常驻免异与再次属性自流血3',remaining:n});if(p&&!['normal','bypass-own-trait'].includes(p))throw Error('1835自流血明确策略错误');if(p==='bypass-own-trait')c.a.soulState.hebroSelfApplying1835=true;try{const applied=c.ailment(c.a,'流血',c.a,false,false,3);c.a.soulState.hebroSelfAttempt1835={round:c.round,move:c.m.id,applied,before:n,after:bleeding1835(c.a,c.round)?c.a.ailments['流血']-c.round+1:0,policy:p??'ordinary-common'};}finally{delete c.a.soulState.hebroSelfApplying1835;}}
function shield1835(c){if(!bleeding1835(c.a,c.round))return;if(c.a.soulState.qualifiedShield1835===undefined)return c.refreshShield(c.a,300,'soul:1835');const ordinary=c.a.suitState.shield??0,policy=c.a.soulState.qualifiedShield1835;if(ordinary>0&&!['add','replace-total'].includes(policy))pending1835(c,'Q-N50-4600-005',{reason:'1835流血每轮再获300与已有普通盾重授',ordinary});if(policy==='replace-total'&&ordinary>0)c.consumeOrdinaryShield(c.a);c.addShield(c.a,300,'soul:1835');}
function absorb1835(c,p={}){if(!['physical','special'].includes(c.m?.kind)||!bleeding1835(c.t,c.round)||c.a.hp<=0)return;const bases={'attack-settled':c.actionAttackDamage??0,'attack-hp-loss':c.actionAttackHpLoss??0,'all-settled':c.actionSettledDamage??0,'all-hp-loss':c.actionHpLoss??0},values=Object.values(bases);if(values.every(n=>n===0)){c.a.soulState.hebroAbsorb1835={round:c.round,move:c.m.id,amount:0,common:true};return;}if(!Object.hasOwn(bases,p.basis)||!['fixed','percent','true'].includes(p.type)||!['nominal','hp-loss','settled'].includes(p.heal))pending1835(c,'Q-N50-4628-001',{reason:'等同造成伤害100%吸取的基数、类型与回复量',bases});const amount=bases[p.basis],result=p.heal==='settled'?(c.t.hp>0?c.absorbResult1835(c.t,amount):{hpLoss:0,settledDamage:0}):{hpLoss:c.t.hp>0?(c.hurt(c.t,amount,'圣血猎者伤害值吸取',p.type)??0):0},hpLoss=result.hpLoss;const recovered=c.heal(c.a,p.heal==='nominal'?amount:p.heal==='settled'?result.settledDamage:hpLoss,'圣血猎者伤害值吸取回复','soul')??0;c.a.soulState.hebroAbsorb1835={round:c.round,move:c.m.id,amount,hpLoss,settledDamage:result.settledDamage,recovered,policy:{...p}};}
registry[1835]={name:'圣血猎者·赫布洛',sourceHash:'4570c4a4',partial:false,unimplemented:[],traits:{ailmentImmune:f=>bleeding1835(f)&&!f.soulState.hebroSelfApplying1835},abilities:{qualifiedAbsorb:absorb1835},hooks:{beforeUse:self1835,roundStart:shield1835,afterUse(c){absorb1835(c,c.a.soulState.qualifiedAbsorb1835??{basis:'attack-settled',type:'percent',heal:'settled'});}}};


function reward1838(c,p={}){const st=c.a.soulState;let base;if(p.basis==='current')base=c.a.stats.maxHp;else if(p.basis==='initial')base=st.kawiInitialMax1838;else if(!p.basis&&c.a.stats.maxHp===st.kawiInitialMax1838)base=c.a.stats.maxHp;else throw Error('Q-N50-4632-001：1838增加体力上限的基数待确认');const gain=Math.floor(base*.1);c.a.stats.maxHp+=gain;st.kawiReward1838={round:c.round,gain,base,policy:{...p},pendingCurrent:!['unchanged','gain','heal'].includes(p.current)};if(st.kawiReward1838.pendingCurrent)throw Error('Q-N50-4632-001：1838增加体力上限后当前HP变化待确认');if(p.current==='gain')c.a.hp=Math.min(c.a.stats.maxHp,c.a.hp+gain);else if(p.current==='heal')c.heal(c.a,gain,'卡威治获得上限明确回复载荷','soul');return gain;}
registry[1838]={name:'卡威治',sourceHash:'1bedc6c1',partial:false,unimplemented:[],traits:{},abilities:{qualifiedMaxReward:reward1838},hooks:{battleStart(c){c.a.soulState.kawiInitialMax1838=c.a.stats.maxHp;},roundStart(c){const st=c.a.soulState;if(!Object.values(c.a.ailments).some(n=>Number.isFinite(n)&&n>=c.round))return;const removed=c.clearAilments(c.a);if(!removed.length||(st.kawiClears1838??0)>=4)return;st.kawiClears1838=(st.kawiClears1838??0)+1;c.stage(c.a,1);reward1838(c,st.qualifiedMax1838??{basis:'current',current:'unchanged'});},afterUse(c){if(c.a.hp<=0||c.m?.kind==='item')return;if(c.a.hp>c.t.hp)c.hurt(c.t,(c.a.hp-c.t.hp)*.3,'卡威治体力差附伤','percent');else if(c.a.hp<c.t.hp)c.randomAilmentsFrom(1,['烧伤','冻伤','中毒'],1838);}}};


function sums1839(c){const result=c.carriedPower1839(c.a);if(!Number.isFinite(result.sum)||result.sum<0)throw Error('1839真实配招威力数据无效');return result;}
function native1839(c){return !c.a.soulState.qualifiedCapUnit1839&&!c.a.soulState.qualifiedCapShield1839;}
function nativeCap1839(c){const st=c.a.soulState;if(c.type!=="attack"||st.clawrCapRound1839!==c.round||c.ignoreLimit||c.amount<=0)return;let e=st.clawrNativeBudget1839;if(e?.round!==c.round)e=st.clawrNativeBudget1839={round:c.round,spent:0};c.amount=Math.min(c.amount,Math.max(0,st.clawrPower1839.sum-e.spent));e.spent+=c.amount;}
function cap1839(c){if(native1839(c))return;const st=c.a.soulState;if(c.type!=='attack'||st.clawrCapRound1839!==c.round||c.ignoreLimit||c.amount<=0)return;const sum=st.clawrPower1839.sum,prior=c.a.roundSettledAttackDamage??0,key=c.round+':'+c.t.side+':'+c.m.id+':'+(c.t.soulState.skillUses?.[c.m.id]??0);if(st.clawrCapUse1839?.key!==key)st.clawrCapUse1839={key,start:prior};const unit=st.qualifiedCapUnit1839,limits={event:sum,use:Math.max(0,sum-(prior-st.clawrCapUse1839.start)),round:Math.max(0,sum-prior)},results=Object.values(limits).map(n=>Math.min(c.amount,n));if(!['event','use','round'].includes(unit)&&!results.every(n=>n===results[0]))throw Error('Q-N50-4633-001：1839技能伤害上限统计单位待确认');c.amount=Math.min(c.amount,limits[unit]??sum);}
function attempt1839(c,k){const before=c.t.ailments[k]??0,applied=c.ailment(c.t,k,c.a);if(applied&&before>=c.round&&(c.t.ailments[k]??0)<=before){const policy=c.a.soulState.qualifiedRefresh1839??"success";if(!['success','untriggered'].includes(policy))throw Error('Q-N50-4627-010：1839同名异常未延长是否未触发待确认');return policy==='success';}return applied;}
function shieldCap1839(c){if(native1839(c))return nativeCap1839(c);const st=c.a.soulState;if(st.clawrCapRound1839!==c.round||c.ignoreLimit||c.amount<=0)return;const shield=c.shieldValue(c.a),sum=st.clawrPower1839.sum,policy=st.qualifiedCapShield1839,unit=st.qualifiedCapUnit1839;const key=c.round+':'+c.t.side+':'+c.m.id+':'+(c.t.soulState.skillUses?.[c.m.id]??0);if(st.clawrShieldLedger1839?.round===c.round&&unit!=='event'&&!(unit==='use'&&st.clawrShieldLedger1839.key!==key))throw Error('Q-N50-4633-001：盾前限伤后的整招/整轮额度核销待确认');if(shield<=0||c.amount<=sum)return;if(!['before-shield','after-shield'].includes(policy))throw Error('Q-N50-4633-001：1839红限伤与真实护盾消费顺序待确认');if(policy==='before-shield'){cap1839(c);if(unit!=='event')st.clawrShieldLedger1839={round:c.round,key};}}
function reaction1839(c){if(c.m?.kind==='item'||c.a.hp<=0)return;const weak=Object.values(c.a.stages).some(n=>n<0),abnormal=conditionStatusRules.conditionPresent(c.a,c.round);if(weak){const applied=attempt1839(c,'寄生');if(!applied)c.heal(c.a,abnormal?400:200,'腐坏幽魔寄生未触发回复','soul');}if(abnormal){const applied=attempt1839(c,'流血');if(!applied)for(const k of Object.keys(c.a.ailments)){const old=c.a.ailments[k];if(Number.isFinite(old)&&old>=c.round)c.a.ailments[k]=Math.max(c.round,old-(weak?2:1));}}}
registry[1839]={name:'腐坏幽魔·克劳里菲',sourceHash:'fe9ff428',partial:false,unimplemented:[],traits:{skillPriority:f=>f.soulState.clawrDrainRound1839===f.soulState.calculationRound?1:0},abilities:{powerSum:sums1839,qualifiedCap:cap1839,qualifiedReaction:reaction1839},hooks:{roundStart(c){const st=c.a.soulState;st.clawrPower1839=sums1839(c);st.clawrDrainRound1839=!conditionStatusRules.conditionPresent(c.t,c.round)?c.round:0;st.clawrCapRound1839=!Object.values(c.t.stages).some(n=>n<0)?c.round:0;if(st.clawrCapRound1839===c.round)c.stage(c.t,-3,['spe']);},beforeAttackShields1839:shieldCap1839,beforeHealthDamage:cap1839,afterUse(c){if(c.a.hp<=0||c.m?.kind==='item'||c.a.soulState.clawrDrainRound1839!==c.round)return;const n=c.a.soulState.clawrPower1839.sum;if(c.t.hp>0)c.hurt(c.t,n,'腐坏幽魔携带威力吸取','fixed');c.heal(c.a,n,'腐坏幽魔携带威力理论回复','soul');},opponentAfterUse:reaction1839}};


// Preliminary source-bound draft; full source supplement/audit and tests pending.
function mapleNames1842(f,r){return Object.keys(f.ailments).filter(k=>Number.isFinite(f.ailments[k])&&f.ailments[k]>=r);}
function mapleReduction1842(f){return Math.min(1,.2*mapleNames1842(f,f.soulState.calculationRound??1).length);}
function mapleEntry1842(c){if(c.a.hp<=0)return;const result={ailments:[],restored:[]};for(const k of ['寄生','流血'])result.ailments.push({name:k,applied:c.entrySelfAilment?c.entrySelfAilment(k,2):c.ailment(c.a,k,c.a,false,false,2)});for(const f of [c.a,c.t]){const slots=c.restorePP?c.restorePP(f,Infinity):c.entryRestorePP1842(f),amount=slots.reduce((n,x)=>n+x.restored,0),healed=c.heal?c.heal(f,amount*50,'枫落殇登场实际恢复PP回复','soul'):c.entryHeal1842(f,amount*50);result.restored.push({side:f.side,slots,pp:amount,theoreticalHP:amount*50,healed});}c.a.soulState.mapleEntry1842=result;return result;}
function mapleSorrow1842(c){const removed=c.clearAilments(c.a);c.a.soulState.mapleSorrowRound1842=c.round+1;return {removed,rewardRound:c.round+1};}
function mapleEnd1842(c){if(c.a.hp<=0)return;const names=mapleNames1842(c.a,c.round),weak=names.filter(conditionStatusRules.isWeakening).length,shortened=[];for(const k of names)if(conditionStatusRules.isControl(k)){const before=c.a.ailments[k];c.a.ailments[k]=Math.max(c.round,before-weak);shortened.push({name:k,before,after:c.a.ailments[k]});}c.a.soulState.mapleEnd1842={round:c.round,weak,shortened,count:names.length};if(names.length>=4){const cleared=c.clear(c.t);return {cleared,...mapleSorrow1842(c)};}return {shortened};}
registry[1842]={name:'枫落殇·西叶',sourceHash:'749ba2f6',partial:false,unimplemented:[],deferred:['双方真实阵亡数量使登场寄生/流血时长增加：需要双方队伍阵亡计数，当前首次2回合已实现','真实换宠后再次登场触发自身异常及双方PP/HP恢复：当前首次登场及在场明确入口已实现'],traits:{attackReduction:mapleReduction1842,ignorePP:f=>(f.soulState.mapleSorrowRound1842??0)>0&&f.soulState.mapleSorrowRound1842===f.soulState.calculationRound},abilities:{entry:mapleEntry1842,sorrow:mapleSorrow1842,phaseEnd:mapleEnd1842},hooks:{battleStart:mapleEntry1842,beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&(c.damageReductionIgnore??0)<1)c.amount*=Math.round((1-mapleReduction1842(c.a))*1e12)/1e12;},beforeDamage(c){if(['physical','special'].includes(c.m.kind)&&c.a.soulState.mapleSorrowRound1842===c.round){c.ignoreImmunity=true;c.ignoreLimit=true;}},battlePhaseEnd:mapleEnd1842}};


function blackSelect1843(c){const st=c.a.soulState;st.blackLowRound1843=c.a.hp<c.a.stats.maxHp?c.round:0;if(c.selectedMove(c.a)?.kind==='status')st.blackAttackRound1843=c.round+1;}
function blackUse1843(c){if(c.a.hp<=0||c.m?.kind==='item')return;const st=c.a.soulState;if(c.m.kind!=='status'){st.blackStatusStreak1843=0;st.blackStatusLastRound1843=0;return;}const prior=st.blackStatusLastRound1843;st.blackStatusStreak1843=prior===c.round?(st.blackStatusStreak1843??1):prior===c.round-1?(st.blackStatusStreak1843??0)+1:1;st.blackStatusLastRound1843=c.round;c.timed(c.t,'哀目黑子禁止回复',2,{sourceSoul1843:true});if(st.blackStatusStreak1843>=2)c.timed(c.a,'免异常',2,{sourceSoul1843:true});if(st.blackStatusStreak1843>=3)c.timed(c.a,'攻击伤害免疫',2,{sourceSoul1843:true});}
registry[1843]={name:'逆世之瞳·哀目黑子',sourceHash:'9f03757f',partial:false,unimplemented:[],deferred:['战阶敌睡眠/失神时下回合无法主动切换精灵；需真实主动切换选择/执行门禁，当前自身战阶三项强化全部实现'],traits:{},abilities:{select:blackSelect1843,used:blackUse1843},hooks:{roundStart:blackSelect1843,beforeCrit(c){if(['physical','special'].includes(c.m?.kind)&&c.a.soulState.blackAttackRound1843===c.round)c.forceCrit=true;},afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.blackAttackRound1843===c.round){if(c.a.soulState.blackAilmentAttempt1843===c.round)return;c.a.soulState.blackAilmentAttempt1843=c.round;c.ailment(c.t,'失神',c.a);}},afterUse:blackUse1843,battlePhaseEnd(c){if(c.a.hp>0&&c.a.soulState.blackLowRound1843===c.round)c.stage(c.a,1,['def','spd','acc']);}}};


}


function profile1844(c,p){
 if(!p||typeof p.entries!=='object'||Array.isArray(p.entries)||![0,.05].includes(p.fullBonus??0))throw Error('1844实际抗性配置须entries和独立fullBonus(0或0.05)');
 const valid=new Set(soulStatusPools.pool(undefined,{includeRestricted:true}).map(x=>x.name)),entries={};
 for(const [k,v]of Object.entries(p.entries)){if(!valid.has(k)||!Number.isFinite(v)||v<0||v>.5)throw Error('1844实际异常抗性项目/概率非法 '+k);entries[k]=v;}
 c.a.soulState.resistanceProfile1844={entries,fullBonus:p.fullBonus??0,source:{page:'培养机制',revision:389166,configuration:'source-bound actual specific probabilities, fullBonus excluded from entries'}};
 return structuredClone(c.a.soulState.resistanceProfile1844);
}
function record1844(c){
 const f=c.a,st=f.soulState,p=st.resistanceProfile1844;
 const entries=p?{...p.entries}:Object.fromEntries([[f.build.resistance.major,.55],[f.build.resistance.minor,.18]].filter(([k])=>k));
 const maximum=Math.max(0,...Object.values(entries)),highest=Object.keys(entries).filter(k=>entries[k]===maximum);
 st.starRecord1844=maximum>0&&highest.length===1?highest[0]:null;
 st.starRecordProfile1844={entries,fullBonus:p?.fullBonus??0,mode:p?'explicit-source-bound':'existing-gear-profile'};
 st.starActive1844=true;st.starEntryMaxHP1844=f.stats.maxHp;
}
function chance1844(c,k,base){const p=c.a.soulState.resistanceProfile1844;return p?Math.min(1,(p.entries[k]??0)+p.fullBonus):base;}
function recordName1844(c,f=c.a){return f.soulState.starActive1844?f.soulState.starRecord1844??null:null;}
function death1844(c){
 const f=c.a,st=f.soulState;if(st.starBearer1844||st.vanished)return;
 const enemy=c.defeater1833?.side===1-f.side,qualified=st.qualifiedSelfDefeat1844??'defeated';
 if(!enemy&&!['defeated','not-defeated'].includes(qualified))throw Error('Q-N50-4643-001：1844被击败是否包含37350自身百分比致死待确认');
 if(!enemy&&qualified==='not-defeated')return;
 if((c.on(f,'死亡时技能回复')||st.kingRevivalRound)&&st.qualifiedVanish1844!=='before-revival')throw Error('Q-N50-4604-007：1844消逝与已授临死复活的先后待确认');
 st.starActive1844=false;
 const initial=st.starEntryMaxHP1844; if(!Number.isFinite(initial)||initial<=0)throw Error('1844缺少本次登场最大体力快照');
 c.vanish1844(f);st.starBearer1844={initialEnergy:initial,energy:initial,sourceSoul:1844,sourceHash:'552e3440',awaitingAllyCarrier:true};
}
registry[1844]={name:'蓓丽安特',sourceHash:'552e3440',traits:{},partial:false,unimplemented:[],deferred:['己方其他精灵被击败使星执者增加300能量，需要真实队伍死亡事件','本体消逝后其他在场己方精灵的全异常转星赐及使用后消耗15%能量附等量真实伤害、回合末消耗15%回复和最少150，需要真实后继载体与队伍共享能量'],abilities:{configureResistance:profile1844,resistanceChance:chance1844,recordedAilment:recordName1844,recordedKind(c,f=c.a){const k=recordName1844(c,f);return k===null?null:conditionStatusRules.isControl(k)?'control':'non-control';},entryMaximum:c=>c.a.soulState.starEntryMaxHP1844,qualifiedDeath:death1844},hooks:{beforeBattleStart:record1844,death:death1844}};


registry[1845]=(()=>{

// Resource-only frozen draft. Not tested; contains no natural damage, PP restoration or extra-action hooks.
const ids1845=c=>{const ids=c.a.soulState.constructions1845??[];if(!Array.isArray(ids)||ids.some(x=>!Number.isInteger(x)||x<1||x>4)||new Set(ids).size!==ids.length)throw Error('1845 malformed sourced construction set');return ids;};
const mode1845=c=>ids1845(c).length>=2?'active':'guard';
const resource1845={name:'克雷弗德·德莱赫默资源接口（隔离草稿）',sourceHash:'c687be18',traits:{},abilities:{
  constructionIds(c){return ids1845(c).slice();},
  constructionCount(c){return ids1845(c).length;},
  mode(c){return mode1845(c);},
  grantConstruction(c,id){
    if(!Number.isInteger(id)||id<1||id>4)throw Error('1845 construction id must be sourced I–IV');
    const current=ids1845(c),before=current.length,added=!current.includes(id);
    if(added)c.a.soulState.constructions1845=[...current,id].sort((a,b)=>a-b);
    return{before,after:ids1845(c).length,added,mode:mode1845(c)};
  }
},hooks:{battleStart(c){c.a.soulState.constructions1845=[];}}};


// STATIC ONLY: no test execution authorized yet. Pure resource API is separately frozen.
const base=resource1845,count=c=>base.abilities.constructionCount(c),mode=c=>base.abilities.mode(c);
function snapshot1845(c){const n=count(c);c.a.soulState.constructionRound1845={round:c.round,count:n,missing:4-n,mode:mode(c)};}
function extraAction1845(c,policy=c.a.soulState.qualifiedExtra1845??{shield:'source-refresh',typed:'independent-typed'}){
  if(c.a.hp<=0)return{performed:false,reason:'owner-dead'};
  const state=mode(c);
  if(state==='guard'){
    const paralysis=c.ailment(c.t,'麻痹',c.a,false,false,null,{probabilityPercent:100,origin:'soul'});
    const existing=c.a.suitState?.shield??0;
    if(existing>0&&!['add','replace','maximum','source-refresh'].includes(policy?.shield))throw Error('Q-N50-4600-005：1845守备300盾与真实已有普通盾的同源/多源重授待确认');
    if(policy?.shield==='source-refresh')c.refreshShield(c.a,300,'soul:1845:extraAction');else if(policy?.shield==='replace')c.a.suitState.shield=300;
    else if(policy?.shield==='maximum')c.a.suitState.shield=Math.max(existing,300);
    else c.addShield(c.a,300);
    return{performed:true,state,paralysis,shieldBefore:existing,shieldAfter:c.a.suitState.shield};
  }
  const candidates=['电','机械','电机械'].map(type=>({type,multiplier:c.typeAffinity(type,c.t.type)})),maximum=Math.max(...candidates.map(x=>x.multiplier)),best=candidates.filter(x=>x.multiplier===maximum);
  if(policy?.typed!=='independent-typed')throw Error('Q-N50-4586-006：1845核威强袭以最高克制系别造成300的独立通道/防御暴击/减免待确认');
  const selected=best.find(x=>x.type===policy.type)??best[0];
  c.a.soulState.extraResolving1845={round:c.round,move:c.m?.id,use:c.effectUseCount(),beforeHP:c.t.hp,state};
  let hpLoss;try{hpLoss=c.typedSoulAttack1845(300,selected.type);}finally{delete c.a.soulState.extraResolving1845;}
  return{performed:true,state,candidates,best,type:selected.type,nominal:300,hpLoss,qualified:true};
}
function endRestore1845(c){
  const e=c.a.soulState.constructionRound1845;if(c.a.hp<=0||e?.round!==c.round||e.mode!=='guard')return;
  const moves=c.a.moves.filter(k=>['physical','special'].includes(c.moveKind(k))),policy=c.a.soulState.qualifiedGuardPP1845??'per-missing';
  if(!['once','per-missing'].includes(policy)&&moves.some(k=>c.maxPP(k)-c.a.pp[k]>1))throw Error('Q-N50-4644-001：每空缺构造是否也使回末攻击PP恢复按空缺数累加');
  const amount=policy==='per-missing'?e.missing:1;
  const rows=c.restorePP({...c.a,moves},amount,'soul');
  (c.a.soulState.constructPPRestores1845??=[]).push({round:c.round,missing:e.missing,policy:policy??'common-cap-at-most-one',amount,rows});
}
return {...base,name:'克雷弗德',partial:true,unimplemented:['Q-N50-4644-001：守备PP每空缺作用域','Q-N50-4586-006：核威强袭300系别伤害核算','Q-N50-4600-005：守备300普通盾重授'],deferred:['构造数下场重置：仅真实下场与再次登场流程延期；当前自身构造收集、守备/激发和额外行动全部单体'],traits:{
  attackReduction:f=>f.soulState.constructionRound1845?.mode==='guard'?f.soulState.constructionRound1845.missing*.1:0,
  attackPriority:f=>f.soulState.constructionRound1845?.mode==='active'?1:0
},abilities:{...base.abilities,extraAction:extraAction1845},hooks:{
  battleStart:base.hooks.battleStart,
  roundStart:snapshot1845,
  beforeDamage(c){const e=c.a.soulState.constructionRound1845;if(e?.round===c.round&&e.mode==='active')c.modifier*=1+e.count*.15;},
  actionSkipped(c){if(c.m&&c.m.kind!=='item')c.a.soulState.constructSkipped1845={round:c.round,move:c.m.id,reason:c.reason};},
  actionEnd(c){const e=c.a.soulState.constructSkipped1845;if(e?.round!==c.round||e.move!==c.m?.id)return;delete c.a.soulState.constructSkipped1845;const event=extraAction1845(c);(c.a.soulState.constructExtraEvents1845??=[]).push({round:c.round,reason:e.reason,...event});},
  roundEnd:endRestore1845
}};

})();

// Exact1845 correction only. Old frozen module/test evidence remains unchanged.
const oldSoul1845Scope=registry[1845];
registry[1845]={...oldSoul1845Scope,partial:false,
  unimplemented:[],
  traits:{...oldSoul1845Scope.traits,attackPriority(f){const e=f.soulState.constructionRound1845;if(e?.mode!=='active')return 0;const p=f.soulState.qualifiedConstructPriority1845??'per-construction';if(p==='once')return 1;if(p==='per-construction')return e.count;const err=Error('Q-N50-4644-001：每拥有1种构造是否也使攻击先制按构造数累加');err.constructPriority1845={count:e.count,round:e.round,hp:f.hp,pp:{...f.pp}};throw err;}},
  hooks:{...oldSoul1845Scope.hooks,actionEnd(c){const e=c.a.soulState.constructSkipped1845;if(e?.round===c.round&&e.move===c.m?.id&&e.reason==='noPP'){const p=c.a.soulState.qualifiedNoPPExtra1845??'eligible';if(!['eligible','ineligible'].includes(p)){const err=Error('Q-N50-4644-002：合法选择后PP被清零导致未使用是否属于选择技能且无法行动');err.constructNoPP1845={round:c.round,move:c.m.id,pp:c.a.pp[c.m.id],hp:c.a.hp,shield:c.a.suitState?.shield??0,enemyHP:c.t.hp,enemyPP:{...c.t.pp},enemyAilments:{...c.t.ailments}};throw err;}if(p==='ineligible'){delete c.a.soulState.constructSkipped1845;return;}}return oldSoul1845Scope.hooks.actionEnd(c);}}
};




(()=>{
'use strict';
// Static preparation only. No test has run and no source scope has been inferred from old runtime behavior.
const statusRules=conditionStatusRules;
function frame1846(c){const high=c.a.hp>c.t.hp,low=c.a.hp<c.t.hp;c.a.soulState.clockFrame1846={round:c.round,high,low};}
function guardMixedImmunity1846(c){}
function beforeAilment1846(c){const e=c.a.soulState.clockFrame1846;if(e?.round!==c.round||!(e.low||e.high&&statusRules.isWeakening(c.status)))return;guardMixedImmunity1846(c);c.blocked=true;}
function endUsed1846(c){if(!c.m||c.m.kind==='item'||c.a.pp[c.m.id]!==0)return;
  if(c.m.kind==='status'){
    const policy=c.a.soulState.qualifiedFloorStatusScope1846??'all-skills';
    if(!['attack-only','all-skills'].includes(policy))throw Error('Q-N50-4646-001：formatted攻击技能额外效果标题是否限定属性技能PP0不累加下限');
    if(policy==='attack-only')return;
  }
  const token=c.round+':'+c.m.id+':'+c.effectUseCount();if(c.a.soulState.clockFloorToken1846===token)return;
  c.a.soulState.clockFloorToken1846=token;
  const before=c.a.soulState.clockFloor1846??0;c.a.soulState.clockFloor1846=Math.min(600,before+150);
  (c.a.soulState.clockFloorEvents1846??=[]).push({round:c.round,move:c.m.id,use:c.effectUseCount(),pp:0,before,after:c.a.soulState.clockFloor1846});
}
function resolveFloorConflict1846(c){const floor=c.a.soulState.clockFloor1846??0;if(!floor||!(c.amount>0)||!(c.cap<floor)||c.ignoreLimit)return c.amount;
  const policy=c.a.soulState.qualifiedFloorCap1846??'cap-priority';
  if(policy==='cap-priority')return c.amount;
  if(policy==='floor-priority')return Math.max(c.amount,floor);
  const err=Error('Q-N50-4646-002：1846已授伤害下限与真实较低攻击上限同时成立优先关系待确认');
  err.clockFloorConflict1846={round:c.round,move:c.m.id,floor,cap:c.cap,beforeHP:c.t.hp,pp:c.a.pp[c.m.id],postCapDamage:c.amount};throw err;
}
registry[1846]={name:'时钟试炼官·极',sourceHash:'ddacacad',partial:false,unimplemented:[],traits:{
  attackReduction:f=>f.soulState.clockFrame1846?.low?.3:0,
  ignorePP:f=>f.soulState.clockFreePPRound1846===f.soulState.calculationRound,
  minimumAttackDamage:f=>f.soulState.clockFloor1846??0
},abilities:{floor:c=>c.a.soulState.clockFloor1846??0,resolveFloorConflict:resolveFloorConflict1846,guardMixedImmunity:guardMixedImmunity1846},hooks:{
  roundStart:frame1846,
  opponentPriority(c){if(c.a.soulState.clockFrame1846?.round===c.round&&c.a.soulState.clockFrame1846.high)c.priority-=1;},
  beforeAilment:beforeAilment1846,
  afterAttack(c){if(c.settledDamage>300)c.a.soulState.clockFreePPRound1846=c.round+1;},
  afterUse:endUsed1846
}};

})();


(()=>{
'use strict';

const mark1847=(f,r)=>{const e=f.soulState.starEntangle1847;return e?.sourceHash==='5521fbf2'&&e.start<=r&&e.end>=r?e:null;};
function grant1847(c,target=c.t){const previous=mark1847(target,c.round);target.soulState.starEntangle1847={start:c.round,end:Math.max(previous?.end??0,c.round+2),sourceSide:c.a.side,sourceHash:'5521fbf2'};return{...target.soulState.starEntangle1847};}
function received1847(c){const e=mark1847(c.t,c.round);if(!e||!(c.settledDamage>0))return;
  const nominalPercent=c.settledDamage*.5,hpBefore=c.t.hp,percentLoss=c.hurt(c.t,nominalPercent,'星芳之缠附加百分比','percent');
  const holderOpponentFire=c.isFireType1847(c.a),publisherOpponentFire=c.isFireType1847(c.t),policy=c.a.soulState.qualifiedStarFireView1847??'holder-opponent';
  let fire;if(holderOpponentFire===publisherOpponentFire)fire=holderOpponentFire;else if(policy==='holder-opponent')fire=holderOpponentFire;else if(policy==='publisher-opponent')fire=publisherOpponentFire;else{const err=Error('Q-N50-4647-001：星芳之缠对手为火系的状态拥有者或施加者视角待确认');err.starFireView1847={round:c.round,sourceSide:e.sourceSide,attackerType:c.a.type,holderType:c.t.type,holderOpponentFire,publisherOpponentFire,settledDamage:c.settledDamage,hpBefore,percentLoss,hpAfterPercent:c.t.hp,attackerPP:c.a.pp[c.m.id],mark:{...e}};throw err;}
  let trueLoss=0;if(fire){delete c.t.soulState.starEntangle1847;trueLoss=c.hurt(c.t,c.settledDamage,'星芳之缠火系额外真实','true');}
  (c.a.soulState.starEntangleEvents1847??=[]).push({round:c.round,move:c.m.id,holderSide:c.t.side,settledDamage:c.settledDamage,nominalPercent,percentLoss,fire,policy:policy??'common',trueNominal:fire?c.settledDamage:0,trueLoss,hpBefore,hpAfter:c.t.hp});
}
registry[1847]={name:'星光·丽莎布布',sourceHash:'5521fbf2',partial:false,unimplemented:[],deferred:['每次登场的真实再次上场触发：仅换宠/再入场调度延期，初次登场与当前双方所有星芳分支单精灵'],traits:{attackReduction:f=>f.soulState.starRound1847?.high?.5:0},abilities:{
  grantEntangle:grant1847,hasEntangle:(c,target=c.t)=>!!mark1847(target,c.round),receivedAttack:received1847,
  outgoingMultiplier(c){return mark1847(c.a,c.round)?.sourceHash==='5521fbf2'?.5:1;}
},hooks:{
  battleStart(c){if(c.typeEffectiveness(c.a.type,c.t.type)>1)grant1847(c);},
  roundStart(c){c.a.soulState.starRound1847={round:c.round,high:c.a.hp>c.t.hp,low:c.a.hp<c.t.hp};},
  afterUse(c){if(['physical','special'].includes(c.m?.kind))grant1847(c);},
  roundEnd(c){if(c.a.soulState.starRound1847?.round===c.round&&c.a.soulState.starRound1847.low&&c.a.hp>0)c.heal(c.a,c.a.stats.maxHp*.35,'星芳低HP回末回复');}
}};


})();


(()=>{
'use strict';
const frame1850=(f,r)=>f.soulState.stormRound1850?.round===r?f.soulState.stormRound1850:null;
registry[1850]={name:'风暴龙灵',sourceHash:'68420e15',traits:{
 attackReduction:f=>f.soulState.stormRound1850?.noEnemyBoost?.4:0,
 attackPriority:f=>f.soulState.stormPriority1850?.round===f.soulState.calculationRound?f.soulState.stormPriority1850.amount:0
},hooks:{
 roundStart(c){c.a.soulState.stormRound1850={round:c.round,low:c.a.hp<c.t.hp,noEnemyBoost:!Object.values(c.t.stages).some(x=>x>0)};},
 beforePriority1850(c){const e=frame1850(c.a,c.round);c.a.soulState.stormPriority1850={round:c.round,amount:0};if(!e||!['physical','special'].includes(c.m?.kind))return;const probability=e.low?1:.5,roll=c.random(),amount=roll<probability?1:0;c.a.soulState.stormPriority1850={round:c.round,amount,probability,roll};},
 beforeConsume1850(c){const e=frame1850(c.a,c.round);if(!e||c.m?.kind!=='status')return;const probability=e.low?1:.5,roll=c.random(),free=roll<probability;if(free)c.noPPConsumption=true;c.a.soulState.stormPP1850={round:c.round,move:c.m.id,probability,roll,free};},
 roundEnd(c){const e=frame1850(c.a,c.round);if(e?.noEnemyBoost&&c.a.hp>0)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.4,'风暴龙灵已损体力回复');}
}};
})();


(()=>{
'use strict';
// Static only, untested. Natural lethal lifecycle is deliberately not guessed.
const soak1848=(f,r)=>{const e=f.soulState.starSoak1848;return e?.sourceHash==='206637ec'&&e.start<=r&&e.end>=r?e:null;};
function grant1848(c,target=c.t){const old=soak1848(target,c.round);target.soulState.starSoak1848={start:c.round,end:Math.max(old?.end??0,c.round+2),sourceSide:c.a.side,sourceHash:'206637ec'};return{...target.soulState.starSoak1848};}
function received1848(c){const mark=soak1848(c.t,c.round);if(!mark||!(c.settledDamage>0))return;const n=c.settledDamage,hpBefore=c.t.hp,percentLoss=c.hurt(c.t,n*.5,'星海之浸附加百分比','percent'),holderOpponentGrass=c.isGrassType1848(c.a),publisherOpponentGrass=c.isGrassType1848(c.t),policy=c.a.soulState.qualifiedStarGrassView1848??'holder-opponent';
  let grass;if(holderOpponentGrass===publisherOpponentGrass)grass=holderOpponentGrass;else if(policy==='holder-opponent')grass=holderOpponentGrass;else if(policy==='publisher-opponent')grass=publisherOpponentGrass;else{const error=Error('Q-N50-4647-001：1848星海之浸对手为草系的视角待确认');error.starGrassView1848={round:c.round,attackerType:c.a.type,holderType:c.t.type,holderOpponentGrass,publisherOpponentGrass,settledDamage:n,hpBefore,percentLoss,hpAfterPercent:c.t.hp,pp:c.a.pp[c.m.id],mark:{...mark}};throw error;}
  let trueLoss=0;if(grass){delete c.t.soulState.starSoak1848;trueLoss=c.hurt(c.t,n,'星海之浸草系额外真实','true');}(c.a.soulState.starSoakEvents1848??=[]).push({round:c.round,move:c.m.id,settledDamage:n,nominalPercent:n*.5,percentLoss,grass,trueNominal:grass?n:0,trueLoss,hpBefore,hpAfter:c.t.hp});
}
function payload1848(c,qualification){if(!qualification?.confirmedLethalPayload)throw Error('1848致死载荷须明确研究输入，不能冒充自然死亡时序');
  if(c.a.level!==100||c.a.soulState.starLethalUsed1848)return{performed:false,reason:c.a.level!==100?'not-level100':'already-used'};
  if(c.a.hp<=0&&!qualification.explicitZeroHPRecovery)throw Error('1848实际HP0回复时序未确认');
  c.a.soulState.starLethalUsed1848=true;
  const clearBoost=c.clearBoost(c.t),clearRound=c.clear(c.t),hpBefore=c.a.hp,ppBefore={...c.a.pp};
  if(c.a.hp<=0)c.qualifiedZeroHeal1848(c.a,c.a.stats.maxHp);else c.heal(c.a,c.a.stats.maxHp,'星海限1次恢复全部体力');
  const ppRows=c.restorePP(c.a,Infinity,'soul'),amount=c.a.hp,shieldBefore=c.a.suitState.shield??0,barrierBefore=c.a.suitState.barrier??0,policy=c.a.soulState.qualifiedStarShields1848??'add';
  if((shieldBefore>0||barrierBefore>0)&&!['add','replace','maximum'].includes(policy)){const error=Error('Q-N50-4600-005：1848一次致死回复后按当前HP授盾罩与真实既有来源重授关系');error.starShields1848={round:c.round,amount,hpBefore,hpAfter:c.a.hp,ppBefore,ppAfter:{...c.a.pp},shieldBefore,barrierBefore,clearBoost,clearRound};throw error;}
  if(policy==='replace'){c.a.suitState.shield=amount;c.a.suitState.barrier=amount;}else if(policy==='maximum'){c.a.suitState.shield=Math.max(shieldBefore,amount);c.a.suitState.barrier=Math.max(barrierBefore,amount);}else{c.addShield(c.a,amount);c.addBarrier(c.a,amount);}
  const e={round:c.round,clearBoost,clearRound,hpBefore,hpAfter:c.a.hp,ppBefore,ppAfter:{...c.a.pp},ppRows,amount,shieldBefore,barrierBefore,shieldAfter:c.a.suitState.shield,barrierAfter:c.a.suitState.barrier,qualified:true};(c.a.soulState.starLethalEvents1848??=[]).push(e);return{performed:true,...e};
}
function beginFatal1848(c){if(c.a.level!==100||c.a.soulState.starLethalUsed1848||c.a.hp<=0||!(c.amount>c.a.hp))return;
 c.a.soulState.starPendingLethal1848={round:c.round,amount:c.amount,type:c.type,hpBefore:c.a.hp,policy:c.a.soulState.qualifiedStarLethalPhase1848??'before-death'};
}
function finishFatal1848(c,phase){const e=c.a.soulState.starPendingLethal1848;if(!e||e.round!==c.round)return;
 if(c.a.hp>0){if(phase!=='before-death')return;delete c.a.soulState.starPendingLethal1848;const result=payload1848(c,{confirmedLethalPayload:true});(c.a.soulState.starLethalLifecycles1848??=[]).push({...e,phase:'common-survived-positive-lethal',hpLoss:c.hpLoss,deathRound:null,hpAfter:c.a.hp,result});return;}
 if(!['before-death','after-death'].includes(e.policy)){const error=Error('Q-N50-4648-001：1848受到致死伤害时恢复与死亡结算先后待确认');error.starLethal1848={...e,hpAfterDamage:c.a.hp,hpLoss:c.hpLoss,pp:{...c.a.pp},used:!!c.a.soulState.starLethalUsed1848};throw error;}
 if(phase!==e.policy)return;delete c.a.soulState.starPendingLethal1848;
 let result;if(e.policy==='before-death')c.a.soulState.starRecoveringBeforeDeath1848={round:c.round};
 try{result=payload1848(c,{confirmedLethalPayload:true,explicitZeroHPRecovery:true});}finally{delete c.a.soulState.starRecoveringBeforeDeath1848;}
 if(e.policy==='after-death'&&c.a.hp>0)c.a.soulState.deathResolved=false;
 (c.a.soulState.starLethalLifecycles1848??=[]).push({...e,phase,hpLoss:c.hpLoss,deathRound:c.a.soulState.lastDefeatRound??null,hpAfter:c.a.hp,result});
}
registry[1848]={name:'星光·鲁斯王',sourceHash:'206637ec',partial:false,unimplemented:[],deferred:['每次登场的再次上场天敌附星海：仅真实换宠/再入场调度延期；当前初登场和在场标记自身分支立即做'],traits:{},abilities:{
  grantSoak:grant1848,hasSoak:(c,target=c.t)=>!!soak1848(target,c.round),receivedAttack:received1848,
  statusBlocked(c){return c.m?.kind==='status'&&!!soak1848(c.a,c.round);},qualifiedLethalPayload:payload1848,finishFatal:finishFatal1848
},hooks:{battleStart(c){if(c.typeEffectiveness(c.a.type,c.t.type)>1)grant1848(c);},beforeCrit(c){c.forceCrit=true;},beforeFatalDamage:beginFatal1848,afterUse(c){if(['physical','special'].includes(c.m?.kind))grant1848(c);}}};


})();


(()=>{
'use strict';
const live1849=(f,r)=>{const x=f.soulState.starFlare1849;return x?.sourceHash==='8e17ffc7'&&x.start<=r&&x.end>=r?x:null;};
function grant1849(c,target=c.t){const old=live1849(target,c.round);target.soulState.starFlare1849={start:c.round,end:Math.max(old?.end??0,c.round+2),sourceSide:c.a.side,sourceHash:'8e17ffc7'};return{...target.soulState.starFlare1849};}
function received1849(c){const mark=live1849(c.t,c.round);if(!mark||!(c.settledDamage>0))return;
 const hpBefore=c.t.hp,nominalPercent=c.settledDamage*.5,percentLoss=c.hurt(c.t,nominalPercent,'星火之灼附加百分比','percent');
 const holderOpponentWater=c.isWaterType1849(c.a),publisherOpponentWater=c.isWaterType1849(c.t),policy=c.a.soulState.qualifiedStarWaterView1849??'publisher-opponent';
 let water;if(holderOpponentWater===publisherOpponentWater)water=holderOpponentWater;else if(policy==='holder-opponent')water=holderOpponentWater;else if(policy==='publisher-opponent')water=publisherOpponentWater;else{const err=Error('Q-N50-4647-001：星火之灼对手为水系的拥有者或施加者视角待确认');err.starWaterView1849={round:c.round,sourceSide:mark.sourceSide,attackerType:c.a.type,holderType:c.t.type,holderOpponentWater,publisherOpponentWater,settledDamage:c.settledDamage,hpBefore,percentLoss,hpAfterPercent:c.t.hp,attackerPP:c.a.pp[c.m.id],mark:{...mark}};throw err;}
 let trueLoss=0;if(water){delete c.t.soulState.starFlare1849;trueLoss=c.hurt(c.t,c.settledDamage,'星火之灼水系额外真实','true');}
 (c.a.soulState.starFlareEvents1849??=[]).push({round:c.round,move:c.m.id,holderSide:c.t.side,settledDamage:c.settledDamage,nominalPercent,percentLoss,water,policy:policy??'common',trueNominal:water?c.settledDamage:0,trueLoss,hpBefore,hpAfter:c.t.hp});
}
registry[1849]={name:'星光·魔焰猩猩',sourceHash:'8e17ffc7',partial:false,unimplemented:[],deferred:['每次登场的真实换宠再入场触发；初次登场及当前双方星火完整单精灵'],traits:{},abilities:{grantFlare:grant1849,hasFlare:(c,target=c.t)=>!!live1849(target,c.round),receivedAttack:received1849,healingFactor:(c,target=c.a)=>live1849(target,c.round)?0:1},hooks:{
 battleStart(c){c.a.soulState.starFixedPanel1849=Math.max(c.a.stats.atk,c.a.stats.spa);if(c.typeEffectiveness(c.a.type,c.t.type)>1)grant1849(c);},
 beforeDamage(c){if(!['physical','special'].includes(c.m?.kind))return;const f=c.a,raw=k=>{if(!f.soulState.qualifiedAttackBasis1849&&f.soulState.starFixedPanel1849!==undefined)return f.soulState.starFixedPanel1849;const e=f.effects['面板数值设定'];return e&&e.start<=c.round&&e.end>=c.round&&Object.hasOwn(e.values??{},k)?e.values[k]:f.stats[k];},mul=n=>n>=0?(2+n)/2:2/(2-n),kind=c.m.kind==='physical'?'atk':'spa',beforeStages=Math.max(1,Math.floor(Math.max(raw('atk'),raw('spa'))*mul(f.stages[kind]))),effectiveHighest=Math.max(1,Math.floor(raw('atk')*mul(f.stages.atk)),Math.floor(raw('spa')*mul(f.stages.spa))),policy=f.soulState.qualifiedAttackBasis1849??'panels-before-stages';if(beforeStages!==effectiveHighest&&!['panels-before-stages','effective-highest'].includes(policy)){const err=Error('Q-N50-4649-001：原本双攻最高值与各自能力等级的应用基准待确认');err.attackBasis1849={round:c.round,move:c.m.id,kind:c.m.kind,atk:raw('atk'),spa:raw('spa'),atkStage:f.stages.atk,spaStage:f.stages.spa,beforeStages,effectiveHighest,pp:f.pp[c.m.id]};throw err;}if(policy==='effective-highest')c.attackOverride=effectiveHighest;f.soulState.starAttackBasis1849={round:c.round,move:c.m.id,beforeStages,effectiveHighest,policy:policy??'common'};},
 afterUse(c){if(!['physical','special'].includes(c.m?.kind))return;grant1849(c);const nominal=c.a.stats.maxHp/3;if(c.m.kind==='physical'){const actual=c.heal(c.a,nominal,'星火物攻后回复');(c.a.soulState.starUseEvents1849??=[]).push({round:c.round,move:c.m.id,kind:c.m.kind,nominal,actual});}else{const actual=c.hurt(c.t,nominal,'星火特攻后附加','percent');(c.a.soulState.starUseEvents1849??=[]).push({round:c.round,move:c.m.id,kind:c.m.kind,nominal,actual});}}
}};

})();


(()=>{
'use strict';
const focus1856=f=>f.soulState.tideFocus1856?.sourceHash==='a7d6d9a0'?f.soulState.tideFocus1856:null;
function grant1856(c,target=c.t){if(focus1856(target)){c.timed(target,'技能命中效果失效',1,{});return{added:false,invalid:true};}target.soulState.tideFocus1856={sourceHash:'a7d6d9a0',sourceSide:c.a.side,round:c.round};return{added:true,invalid:false};}
function consumed1856(c){if(!focus1856(c.t)||!c.crit)return;let consume=c.settledDamage>0,policy=c.a.soulState.qualifiedTideZeroCrit1856??'consume';if(!consume){if(policy==='consume')consume=true;else if(policy!=='retain'){const e=Error('Q-N50-4618-002：浪潮聚焦受到致命一击但完整结算0的消耗待确认');e.tideZeroCrit1856={round:c.round,move:c.m.id,settledDamage:c.settledDamage,hpLoss:c.hpLoss,hp:c.t.hp,pp:c.a.pp[c.m.id],critical:c.crit,mark:{...focus1856(c.t)}};throw e;}}if(consume)delete c.t.soulState.tideFocus1856;(c.a.soulState.tideConsumeEvents1856??=[]).push({round:c.round,move:c.m.id,settledDamage:c.settledDamage,hpLoss:c.hpLoss,consumed:consume,policy:policy??'positive-common'});}
function absorb1856(c){const candidates=c.t.moves.map(key=>({key,power:c.moveDefinition(key).power,pp:c.t.pp[key]})),max=Math.max(...candidates.map(x=>x.power)),top=candidates.filter(x=>x.power===max),policy=c.a.soulState.qualifiedTideHighest1856??'first';let selected=top;
 if(top.length>1){if(policy==='first')selected=[top[0]];else if(policy==='last')selected=[top.at(-1)];else if(policy!=='all'){const e=Error('Q-N50-4654-001：最高威力技能并列时吸取PP目标选择待确认');e.tideHighest1856={round:c.round,move:c.m.id,candidates:top.map(x=>({...x})),ownPP:c.a.pp[c.m.id],enemyPP:{...c.t.pp}};throw e;}}
 const results=selected.map(x=>c.absorbSelectedPP1856(x.key));(c.a.soulState.tidePPEvents1856??=[]).push({round:c.round,move:c.m.id,highestPower:max,policy:policy??'unique',results});return results;
}
registry[1856]={name:'鲸沫',sourceHash:'a7d6d9a0',partial:false,unimplemented:[],deferred:['真实换宠再次登场时重施浪潮/既有浪潮改封命中；浪潮下场保留与跨出场目标，当前初次登场及被击败均已实现'],traits:{skillPriority:f=>f.soulState.tidePriority1856===f.soulState.calculationRound?1:0},abilities:{grantFocus:grant1856,hasFocus:(c,target=c.t)=>!!focus1856(target),receivedCritical:consumed1856,forceCritical(c){if(focus1856(c.t)&&(c.isWhale1856(c.a)||c.typeEffectiveness(c.a.type,c.t.type)>1))c.forceCrit=true;}},hooks:{
 battleStart:grant1856,
 death(c){const e=c.a.soulState.whaleSelfSpend1456;if(e?.round===c.round&&e.move==='wiki:28754'&&e.hash==='13a1a421'){const policy=c.a.soulState.qualified1456SelfDefeat4654??'include';if(!['include','exclude'].includes(policy)){const err=Error('Q-N50-4643-001：4654/1456主动耗尽是否属于魂1856被击败待确认');err.whaleSelfSpend1456={...e,hp:c.a.hp,pp:c.a.pp[e.move],targetHp:c.t.hp};throw err;}if(policy==='exclude')return;}return grant1856(c);},
 afterAttack(c){c.a.soulState.tideLastAttack1856={round:c.round,move:c.m.id,use:c.effectUseCount(),crit:!!c.crit};},
 afterUse(c){if(c.m.kind==='item'||c.a.hp<=0&&(c.a.soulState.qualified1456AfterDeath4654??'stop')==='stop')return;const self=c.a.soulState.whaleSelfUsed1456;if(c.a.hp<=0&&self?.round===c.round&&self.move===c.m.id&&self.use===c.effectUseCount()&&self.hash==='13a1a421'&&(c.m.wikiId??c.m.id)===28754&&c.m.revision==='seerapi:13a1a421'){const policy=c.a.soulState.qualified1456AfterDeath4654??'stop';if(!['continue','stop'].includes(policy)){const err=Error('Q-N50-4654-012：1456耗尽自身后魂1856普通使用后效果是否继续待确认');err.whaleAfterSelfDeath4654={...self,hp:c.a.hp,targetHp:c.t.hp,pp:c.a.pp[c.m.id]};throw err;}if(policy==='stop')return;}const last=c.a.soulState.tideLastAttack1856,critical=last?.round===c.round&&last.move===c.m.id&&last.use===c.effectUseCount()&&last.crit;if(critical){absorb1856(c);return;}const nominal=c.t.stats.maxHp/3,loss=c.hurt(c.t,nominal,'鲸沫非致命最大体力吸取','percent'),healed=c.heal(c.a,nominal,'鲸沫非致命理论吸取回复');c.a.soulState.tidePriority1856=c.round+1;(c.a.soulState.tideDrainEvents1856??=[]).push({round:c.round,move:c.m.id,nominal,loss,healed,nextPriority:c.round+1});}
}};

})();

(()=>{
'use strict';
const shields1859=typeof module==='object'&&module.exports?require('./shield-rules.js'):globalThis.BattleShieldRules;
const attack1859=m=>['physical','special'].includes(m?.kind);
function entry1859(c){const own=c.shieldValue?c.shieldValue(c.a):(c.a.suitState.shield??0)+(c.a.soulState.attackShield??0)+(c.a.soulState.marsShield??0),incoming=(c.t.suitState.shield??0)+(c.t.soulState.attackShield??0)+(c.t.soulState.marsShield??0);if(incoming>0&&own>0&&!['add','replace'].includes(c.a.soulState.qualifiedShield1859??'add'))throw Error('Q-N50-4600-005：1859已有普通护盾时吸取再获得待确认');const shield=c.consumeShields(c.t,c.a),barrier=c.consumeBarrier(c.t);if(shield>0){if(c.a.soulState.qualifiedShield1859==='replace')c.consumeShields(c.a,c.t);c.addShield(c.a,shield,'1859/9482d536/entry');}if(barrier>0)shields1859.addBarrier(c.a,barrier,'1859/9482d536/entry');(c.a.soulState.bladeEntry1859??=[]).push({round:c.round,shield,barrier});}
function probability1859(c,kind){const frame=c.a.soulState.bladeProbabilityFrame1859;if(frame?.round===c.round)return frame[kind];const carries=c.a.soulState.bladeCarries1859??{},up=(carries.partner?1:0)+(kind==='fire'?carries.sun?1:0:carries.moon?1:0),down=kind==='fire'?carries.moon?1:0:carries.sun?1:0;if(!up&&!down)return .5;const policy=c.a.soulState.qualifiedBladeProbability1859??'points';if(!['points','relative'].includes(policy)){const e=Error('Q-N50-4657-001：携带概率提升/减少50%的运算与叠加待确认');e.bladeProbability1859={round:c.round,kind,base:.5,up,down,carries:{...carries}};throw e;}const amount=policy==='points'?.5+.5*up-.5*down:.5*Math.pow(1.5,up)*Math.pow(.5,down);return Math.max(0,Math.min(1,amount));}
function used1859(c,incoming=false){if(!attack1859(c.m)||c.a.hp<=0)return;const kind=incoming?'ice':'fire',resource=incoming?(c.a.suitState.barrier??0):c.shieldValue(c.a);if(resource<=0)return;let guaranteed=!!c.m.alwaysHit;const user=incoming?c.t:c.a,conditional=(c.m.wikiId??c.m.id)===37431&&(c.m.hash==='5d6b37db'||c.m.revision==='seerapi:5d6b37db')&&c.m.operations?.some(op=>op.effectId===2197&&op.index===1&&op.params?.length===0)&&(user.suitState.barrier??0)>0;if(!guaranteed&&conditional){const policy=c.a.soulState.qualifiedConditionalHit1859??'actual-guarantee';if(policy==='raw-only')return;if(policy==='actual-guarantee')guaranteed=true;else{const err=Error('Q-N50-4657-004：37431护罩2197本次必中是否属于1859必中攻击技能待确认');err.conditional1859={round:c.round,incoming,move:c.m.id,userSide:user.side,userHp:user.hp,userPP:user.pp[c.m.id],userBarrier:user.suitState.barrier,resource,rawAlwaysHit:!!c.m.alwaysHit};throw err;}}if(!guaranteed)return;const probability=probability1859(c,kind),roll=c.random(),triggered=roll<probability;const e={round:c.round,move:c.m.id,incoming,resource,probability,roll,triggered};(c.a.soulState.bladeUseEvents1859??=[]).push(e);if(!triggered)return;if(incoming)c.a.soulState.frostRound1859=c.round;else c.a.soulState.fireRound1859=c.round;e.applied=c.ailment(c.t,incoming?'冰封':'焚烬',c.a,false,false,null,{probabilityPercent:100});}
function spent1859(c){if(!attack1859(c.m)||c.a.hp<=0||!Object.values(c.t.ailments).some(end=>end>=c.round))return;const shield=c.consumeShields(c.a,c.t),barrier=c.consumeBarrier(c.a),amount=shield+barrier;const loss=amount>0?c.hurt(c.t,amount,'卓尔布异常后消费全部盾罩','fixed'):0;(c.a.soulState.bladeSpendEvents1859??=[]).push({round:c.round,move:c.m.id,shield,barrier,amount,loss});}
registry[1859]={name:'浮掠双刃·卓尔布',sourceHash:'9482d536',partial:false,unimplemented:[],deferred:['真实再次登场吸取当前敌方护盾护罩；当前初次登场与当前在场消费/双刃已实现'],traits:{attackReduction:f=>f.soulState.frostRound1859===f.soulState.calculationRound?.5:0,attackMultiplier:f=>f.soulState.fireRound1859===f.soulState.calculationRound?1.5:1},abilities:{entry:entry1859,actualUse:used1859,probability:probability1859},hooks:{battleStart:entry1859,roundStart(c){delete c.a.soulState.bladeProbabilityFrame1859;const fire=probability1859(c,'fire'),ice=probability1859(c,'ice');c.a.soulState.bladeProbabilityFrame1859={round:c.round,fire,ice};},afterUse:spent1859}};
})();



function ensure1860(c){const st=c.a.soulState;if(!st.memory1860)st.memory1860={entryRound:c.round??1,records:[],conversions:[],sourceHash:'f822be8f'};return st.memory1860;}
function admitted1860(c,k,n){const st=ensure1860(c);if(c.a.hp<=0||c.round>st.entryRound+2)return null;
 const repeated=k==='沉默'&&c.a.ailments['沉默']>=c.round,policy=c.a.soulState.qualifiedSilenceRefresh1860??'record';
 if(repeated&&st.records.length<4&&!['record','no-record'].includes(policy)){const e=Error('Q-N50-4658-001：1860已有沉默的成功同名刷新是否再记录待确认');e.memory1860={round:c.round,original:k,requestedDuration:n,records:structuredClone(st.records),silenceEnd:c.a.ailments['沉默']};throw e;}
 const record=!repeated||policy!=='no-record';if(record&&st.records.length<4)st.records.push({name:k,enteredRound:c.round,requestedDuration:n});
 st.conversions.push({round:c.round,from:k,to:'沉默',duration:3,recorded:record,records:st.records.length});return {kind:'沉默',duration:3};
}
function drain1860(c){const st=ensure1860(c);if(c.a.hp<=0||!['physical','special'].includes(c.m?.kind)||c.round<=st.entryRound+2||!st.records.length)return;
 const removed=st.records.shift(),nominal=c.t.stats.maxHp/3,dealt=healthRules.drainPercent(c,nominal,'仿生兽记录FIFO百分比吸取');(st.drains??=[]).push({round:c.round,move:c.m.id,removed,nominal,dealt,remaining:st.records.length});
}
registry[1860]={name:'仿生兽·库比',sourceHash:'f822be8f',partial:false,unimplemented:[],deferred:['自身真实下场清除记录并依次附加给己方下只出战精灵：需要真实离场/队伍/后继精灵载体，当前在场记录、转化、增伤、回复与FIFO消费均当前实现'],traits:{},abilities:{admitted:admitted1860,recordCount:c=>ensure1860(c).records.length,records:c=>structuredClone(ensure1860(c).records)},hooks:{beforeBattleStart:ensure1860,battleStart:ensure1860,beforeDamage(c){if(['physical','special'].includes(c.m?.kind))c.modifier*=1+ensure1860(c).records.length*.3;},afterUse:drain1860,roundEnd(c){if(c.a.hp>0){const n=ensure1860(c).records.length;if(n)c.heal(c.a,c.a.stats.maxHp*.15*n,'仿生兽每记录回合末回复');}}}};



// Static implementation draft. Requires the source-qualified engine seams in SEAM-PLAN.md.
// No test/production completion claim; source is 1862/9320d014 only.
const statKeys=['maxHp','atk','def','spa','spd','spe'];
const soul1862Factory=function soul1862Factory(){
 function state(c){return c.a.soulState.wuwei1862??=( {cancelled:[],power:0,events:[]} );}
 function start(c){const st=state(c);if(st.started)return;const before=Object.fromEntries(statKeys.map(k=>[k,c.a.stats[k]]));if(Object.values(before).some(n=>!Number.isFinite(n)||n<1))throw Error('1862 requires actual grown six stats; zero race is not zero panel');const sum=Object.values(before).reduce((a,b)=>a+b,0),policy=c.a.soulState.qualifiedSumHalf1862??'ceil';if(sum%2&&!['floor','ceil'].includes(policy)){const error=Error('Q-N50-4661-001：1862六项面板之和为奇数时一半取整待确认');error.wuweiSumHalf1862={before,sum,hp:c.a.hp};throw error;}const value=policy==='ceil'?Math.ceil(sum/2):Math.floor(sum/2);st.started=true;st.initial={before,sum,value};for(const k of statKeys)c.a.stats[k]=value;c.a.hp=value;st.events.push({kind:'start',...st.initial});}
 function beginUse(c){if(!c.m||c.m.kind==='item')return null;const st=state(c),pp=c.a.soulState.ppBeforeUse?.[c.m.id]??c.a.pp[c.m.id]??0;st.use={round:c.round,move:c.m.id,use:c.effectUseCount(),ppBefore:pp,zero:pp===0};return st.use;}
 function pendingImmune(c,reason){const error=Error('Q-N50-4511-006：1862下次免异与实际次数/回合免异反弹混源');error.wuweiImmunity1862={round:c.round,reason,status:c.status,ownerHP:c.a.hp,ownerPP:{...c.a.pp},enemyHP:c.t.hp,enemyPP:{...c.t.pp},immune:c.a.counts.immune??0,ailments:{...c.a.ailments}};throw error;}
 function positiveUse(c){const u=currentUse(c);if(!u||u.zero)return;c.clearAilments(c.a);c.grantOracleImmunity(c.a,1,'soul:1862:9320d014:positive-PP','wuwei-1862');c.a.soulState.wuweiImmune1862=true;}
 function currentUse(c){const u=state(c).use;return u?.round===c.round&&u.move===c.m?.id&&u.use===c.effectUseCount()?u:null;}
 function active(c,index){return (c.m?.wikiId??c.m?.id)===37460&&(c.m.hash==='25df57a6'||c.m.revision==='seerapi:25df57a6')&&state(c).cancelled.includes(index);}
 function forcedBoundary(c){const u=currentUse(c);if(!u?.zero||!(c.invalid||c.hitEffectsDisabled))return false;const policy=c.a.soulState.qualifiedForced1862??'effects-only-at-use-end';if(policy!=='effects-only-at-use-end'){const error=Error('Q-N50-4604-003：1862实际PP0强制执行命中效果的失效范围待确认');error.wuweiForced1862={round:c.round,move:c.m.id,pp:c.a.pp[c.m.id],zeroSnapshot:u.ppBefore,invalid:!!c.invalid,hitEffectsDisabled:!!c.hitEffectsDisabled,attackImmune:!!c.attackImmune,targetHP:c.t.hp};throw error;}u.pendingForced=true;return true;}
 function invert(c){const u=currentUse(c);if(!u||u.inverted)return;const max=c.maxPP(c.m.id),before=c.a.pp[c.m.id]??0;if(!Number.isFinite(max)||max<0||before<0||before>max)throw Error('1862 PP current/max source invariant');c.a.pp[c.m.id]=max-before;u.inverted=true;state(c).events.push({kind:'invert',round:c.round,move:c.m.id,usedPP:u.ppBefore,currentBefore:before,max,after:c.a.pp[c.m.id]});}
 function progress(c){const st=state(c),u=currentUse(c);if(!u?.zero||u.koOrder==='reset-last')return;const next=[0,1,2,3,4,5].find(i=>!st.cancelled.includes(i));if(next===undefined){const policy=c.a.soulState.qualifiedExhausted1862??'increase50';if(!['increase50','stop'].includes(policy)){const error=Error('Q-N50-4661-002：1862第五六条条件已全取消后再触万相是否继续提升50待确认');error.wuweiExhausted1862={round:c.round,move:c.m.id,use:u.use,actorHP:c.a.hp,targetHP:c.t.hp,actorPP:{...c.a.pp},cancelled:st.cancelled.slice(),power:st.power};throw error;}if(policy==='stop')return;}else st.cancelled.push(next);st.power+=50;st.events.push({kind:'progress',round:c.round,move:c.m.id,index:next??null,power:st.power});}
 function reset(c){const st=state(c),u=c.m?currentUse(c):null;if(u?.zero){const policy=c.a.soulState.qualifiedKOOrder1862??'reset-last';if(!['reset-last','progress-last'].includes(policy)){const error=Error('Q-N50-4661-003：1862同次PP0实际击败的万相进阶与重置先后待确认');error.wuweiKOOrder1862={round:c.round,move:c.m.id,use:u.use,targetHP:c.t.hp,actorHP:c.a.hp,actorPP:{...c.a.pp},defeatSnapshot:c.a.soulState.fifthDefeat4564661?{...c.a.soulState.fifthDefeat4564661}:null,cancelled:st.cancelled.slice(),power:st.power};throw error;}u.koOrder=policy;}const before={cancelled:st.cancelled.slice(),power:st.power};st.cancelled=[];st.power=0;st.events.push({kind:'actual-KO-reset',round:c.round,before});}
 function endUnused(c){if(c.a.hp<=0||c.used[c.a.side])return;for(const key of c.a.moves){const move=c.moveDefinition(key);for(const op of move.operations??[]){if(op.effectId!==2190||op.phase!=='wuwei1862')continue;c.executeWuwei1862(move,op);}}}
 return {name:'无为觉者',sourceHash:'9320d014',partial:false,unimplemented:[],deferred:['对方真实场下阵亡精灵消逝需队伍阵亡列表与目标移除；当前自身KO重置应独立实现'],traits:{ignorePP:true,skillAlwaysHit:f=>f.soulState.wuwei1862?.use?.zero&&f.soulState.wuwei1862.use.round===f.soulState.calculationRound},abilities:{start,beginUse,positiveUse,currentUse,forcedBoundary,conditionCancelled:active,invert,progress,reset,endUnused},hooks:{battleStart:start,otherAilmentImmunity(c){},beforeDamage(c){if((c.m.wikiId??c.m.id)===37460&&c.m.revision==='seerapi:25df57a6')c.power+=state(c).power;},afterUse(c){const u=currentUse(c);if(u?.pendingForced&&!u.forced){c.executeForcedPayload1862(c.m,['afterHit','afterAttack'],{first:c.first});u.forced=true;}invert(c);progress(c);},battlePhaseEnd:endUnused}};
};

registry[1862]=soul1862Factory();



function snow1866(c){return c.a.soulState.snow1866??={nextCritRound:0,nextFreezeRound:0,criticalRound:0,attacks:[],received:[]};}
function snowRound1866(c){const s=snow1866(c);if(s.nextCritRound===c.round){s.criticalRound=c.round;c.clearAilments(c.a);}if(s.nextFreezeRound===c.round&&c.a.hp>0){const frost=c.ailment(c.t,'冻伤',c.a,false,false,2);if(!frost)c.ailment(c.t,'凝滞',c.a,false,false,2);}}
function useSnow1866(c){const memory=snow1866(c);memory.attackStreak=['physical','special'].includes(c.m?.kind)?(memory.attackStreak??0)+1:0;if(!['physical','special'].includes(c.m?.kind))return;const s=memory,abnormal=conditionStatusRules.conditionPresent(c.t,c.round);s.attack={round:c.round,move:c.m.id,use:c.effectUseCount(),abnormal,basePower:c.m.power};}
function currentSnow1866(c){const s=snow1866(c),e=s.attack;return e?.round===c.round&&e.move===c.m?.id&&e.use===c.effectUseCount()?e:null;}
function dealtSnow1866(c){const s=snow1866(c);if(!c.crit||c.a.hp<=0)return;const n=c.settledDamage??0;if(n===0){const p=c.a.soulState.qualifiedZeroCritical1866??(c.attackImmune?'not-critical':'critical');if(!['critical','not-critical'].includes(p)){const e=Error('Q-N50-4618-002：1866完整红0时是否打出致命一击待确认');e.snow1866={round:c.round,move:c.m.id,crit:true,settledDamage:n,pp:c.a.pp[c.m.id],hp:c.a.hp};throw e;}if(p==='not-critical')return;}s.nextCritRound=c.round+1;}
function receivedSnow1866(c){if(c.a.hp<=0||c.crit||!['physical','special'].includes(c.m?.kind))return;const n=c.settledDamage??0;if(n===0){const p=c.a.soulState.qualifiedZeroReceived1866??(c.attackImmune?'not-received':'received');if(!['received','not-received'].includes(p)){const e=Error('Q-N50-4618-002：1866完整攻击0是否实际受到非致命一击待确认');e.snowReceived1866={round:c.round,move:c.m.id,settledDamage:n,attackImmune:!!c.attackImmune,hp:c.a.hp,enemyPP:c.t.pp[c.m.id]};throw e;}if(p==='not-received')return;}const s=snow1866(c);s.nextFreezeRound=c.round+1;s.received.push({round:c.round,move:c.m.id,crit:false,settledDamage:n,hpLoss:c.hpLoss});}
function finishSnow1866(c){const e=currentSnow1866(c);if(!e?.abnormal||c.a.hp<=0)return;const memo=c.a.soulState.actualPower1866,actual=memo?.round===c.round&&memo.move===c.m.id&&memo.use===e.use?memo.powers[0]:e.basePower,p=c.a.soulState.qualifiedPowerBasis1866??'base';if(actual!==e.basePower&&!['base','actual'].includes(p))throw Error('Q-N50-4604-001：1866威力值2倍真实附伤基础/实算威力差异待确认');const power=p==='actual'?actual:e.basePower,amount=power*2;c.hurt(c.t,amount,'雷瀑飞雪异常目标使用后威力两倍追加','true');snow1866(c).attacks.push({...e,actualPower:actual,selectedPower:power,trueAmount:amount});}
registry[1866]={name:'雷瀑飞雪·桑多姆',sourceHash:'8773f24b',partial:false,unimplemented:[],traits:{},abilities:{current:currentSnow1866},hooks:{roundStart:snowRound1866,beforeUse:useSnow1866,beforeCrit(c){if(snow1866(c).criticalRound===c.round)c.forceCrit=true;},beforeDamage(c){const e=currentSnow1866(c);if(!e)return;if(e.abnormal)c.cancelAttackDamage1866=true;else {const affinity=c.typeAffinity(c.m.type,c.t.type);c.modifier*=1+(affinity>0&&affinity<1?1:.5);}},afterAttack:dealtSnow1866,attackDamageTaken:receivedSnow1866,afterUse:finishSnow1866}};



(()=>{
'use strict';
function state1867(c){return c.a.soulState.tiger1867??(c.a.soulState.tiger1867={layers:0,postCapUses:0,capReached:false,sourceHash:'c1e16cab'});}
function probability1867(c){const e=state1867(c);let arrival=0;if(e.capReached){const p=c.a.soulState.qualified1867CapProbability??'arrival';if(!['arrival','subsequent'].includes(p))throw Error('Q-N50-4663-001：首次达到120%时是否同时增加焚烬概率待确认');arrival=p==='arrival'?1:0;}return Math.min(1,.5+.1*(e.postCapUses+arrival));}
function use1867(c){if(!['physical','special'].includes(c.m?.kind)||c.a.hp<=0)return;const e=state1867(c),before=e.layers;if(before>=3)e.postCapUses++;else e.layers++;if(e.layers===3)e.capReached=true;(e.uses??=[]).push({round:c.round,move:c.m.id,before,layers:e.layers,postCapUses:e.postCapUses});
 if(e.burnStart&&c.round>=e.burnStart){let apply=c.round===e.burnStart;if(!apply){const p=c.a.soulState.qualified1867BurnDuration??'next-round';if(!['next-round','persistent'].includes(p))throw Error('Q-N50-4663-002：未触发补偿的用攻烧伤是否仅下回合待确认');apply=p==='persistent';}if(apply)c.ailment(c.t,'烧伤',c.a,false,false,null,{probabilityPercent:100});}}
registry[1867]={name:'凌虎·关银屏',sourceHash:'c1e16cab',partial:false,unimplemented:[],deferred:['真实换下和再次登场：本次在场攻击增伤重置与本场概率增量保留；当前在场叠层/概率/异常/先制均单精灵实现'],traits:{skillPriority:f=>f.soulState.tiger1867?.priorityRound===f.soulState.calculationRound?1:0},abilities:{actualUse:use1867,probability:probability1867},hooks:{battleStart:state1867,beforeDamage(c){c.modifier*=1+.4*state1867(c).layers;},battlePhaseEnd(c){if(c.a.hp<=0||c.t.hp<=0||(c.t.roundSettledAttackDamage??0)>0)return;const e=state1867(c),probability=probability1867(c),roll=c.random(),applied=roll<probability&&c.ailment(c.t,'焚烬',c.a,false,false,null,{probabilityPercent:probability*100});(e.rolls??=[]).push({round:c.round,probability,roll,applied:!!applied});if(!applied){e.priorityRound=c.round+1;e.burnStart=c.round+1;}}}};
})();


(()=>{'use strict';
function memory1868(c){return c.a.soulState.rebirth1868??(c.a.soulState.rebirth1868={sourceHash:'6b41a90d'});}
registry[1868]={name:'重塑之子·利塞特',sourceHash:'6b41a90d',partial:false,unimplemented:[],traits:{},hooks:{
battleStart:memory1868,
afterAttack(c){if(c.a.hp<=0)return;const n=c.settledDamage??c.dealt;if(n===0){const p=c.a.soulState.qualified1868Zero??(c.attackImmune?'skip':'trigger');if(!['trigger','skip'].includes(p))throw Error('Q-N50-4665-001：完整结算0是否触发造成攻击伤害低于300待确认');if(p==='skip')return;}if(n<300&&c.t.hp>0)c.timed(c.t,'statusBlock',2,{});if(n>300)c.timed(c.a,'攻击伤害免疫',2,{});(memory1868(c).thresholds??=[]).push({round:c.round,damage:n,branch:n<300?'below':n>300?'above':'equal'});},
opponentAfterUse(c){if(!c.actualUsed)return;const reason=c.invalidReason??{},known=!!reason.blocked,ambiguous=!known&&(!!(reason.miss||reason.blind||reason.forcedMiss||reason.evaded)||!!c.hitEffectsDisabled||c.m?.kind!=='status'&&c.attackDamage===0&&!c.payloadAllowed);memory1868(c).opponent={round:c.round,knownInvalid:known,ambiguous,move:c.m.wikiId??c.m.id,reason};},
roundStart(c){const e=memory1868(c).opponent;if(!e||e.round!==c.round-1)return;let trigger=e.knownInvalid;if(e.ambiguous){const p=c.a.soulState.qualified1868Invalid??(e.reason.miss||e.reason.blind||e.reason.forcedMiss||e.reason.evaded?'invalid':'not-invalid');if(!['invalid','not-invalid'].includes(p))throw Error('Q-N50-4514-001：1868上轮MISS/命中效果失效/免攻是否技能无效待确认');trigger=p==='invalid';}if(trigger){const applied=c.ailment(c.a,'狂暴',c.a);(memory1868(c).rages??=[]).push({round:c.round,applied:!!applied});}},
beforeDamage(c){if((c.a.ailments['狂暴']??0)>=c.round)c.modifier*=1.5;}
}};
})();


function markReturn1872(c){return registry[1831].abilities.hasMark(c,c.t,'return');}
function ember1872(c){if(c.entryAilment)return c.entryAilment(c.t,'焚烬');return c.ailment(c.t,'焚烬',c.a);}
function entry1872(c){if(!markReturn1872(c)){registry[1831].abilities.grantMark(c,c.t,'return',3);return {granted:true};}const prior=c.t.soulState.lifeMarks1831.return,refresh=c.a.soulState.qualifiedEntryReturnRefresh1872??'renew3';if(prior.end!==c.round+2&&!['retain','renew3'].includes(refresh))throw Error('Q-N50-4511-006：1872已有短剩余回命登场是否重授3回合待确认');if(refresh==='renew3')c.t.soulState.lifeMarks1831.return={...prior,start:c.round,end:c.round+2};const active=k=>c.on?c.on(c.t,k):!!c.t.effects[k]&&c.t.effects[k].start<=c.round&&c.t.effects[k].end>=c.round;const conflict=Object.values(c.t.stages).some(n=>n>0)&&(active('强化保护')||active('幽蝶强化保护'))&&!active('protect'),q=c.a.soulState.qualifiedEntryClearOrder1872??'round-first';if(conflict&&!['boost-first','round-first'].includes(q))throw Error('Q-N50-4612-002：1872已有回命登场清强/清回合面对可清保护的顺序待确认');let boost,round;if(q==='round-first'){round=c.clear(c.t);boost=c.clearBoost(c.t);}else{boost=c.clearBoost(c.t);round=c.clear(c.t);}if(boost||round)ember1872(c);return {granted:false,boost:!!boost,round:!!round};}
function use1872(c){if(!['physical','special'].includes(c.m?.kind))return;if(markReturn1872(c)){if(c.clear(c.t))c.a.soulState.emberRedBoost1872=c.round;return;}const target=c.a.soulState.qualifiedNoReturnReceiver1872??'enemy';if(!['self','enemy'].includes(target))throw Error('Q-N50-4669-001：1872对手无回命时2回合恢复削减的主体待确认');c.timed(target==='self'?c.a:c.t,'紫烬回复削减',2,{source1872:true});}
function expireReturn1872(c){const x=c.t.soulState.lifeMarks1831?.return;if(x&&x.end<=c.round)registry[1831].abilities.qualifiedRemoveMark(c,c.t,'return');}
registry[1872]={name:'紫烬魔兽',sourceHash:'d1f2710a',partial:false,unimplemented:[],deferred:['真实再次登场的调度依赖换宠；首次附回命、已有回命的清强清回合焚烬和当前攻击分支均自身实现'],traits:{},abilities:{entry:entry1872,hasReturn:markReturn1872},hooks:{battleStart:entry1872,beforeUse:use1872,beforeDamage(c){if(c.a.soulState.emberRedBoost1872===c.round)c.modifier*=2;},afterRoundEnd:expireReturn1872}};


function clawSnapshot1873(c){const st=c.a.soulState;let previous=st.clawPreviousStartHP1873;if(previous===undefined){if(st.qualifiedFirstReference1873===undefined){st.clawFast1873=0;st.clawDrain1873=0;st.clawPreviousStartHP1873=c.a.hp;return;}const q=st.qualifiedFirstReference1873;if(!Number.isFinite(q)||q<0)throw Error('Q-N50-4671-001：首次回合开始没有上回合体力参考，比较基准待确认');previous=q;}const current=c.a.hp;st.clawFast1873=current>=previous?c.round:0;st.clawDrain1873=current<previous?c.round:0;st.clawPreviousStartHP1873=current;}
function clawHit1873(c){if(c.m?.kind==='status'){c.absorbPP(c.a,c.t,2);return;}if(!['physical','special'].includes(c.m?.kind))return;if((c.a.soulState.attackSegmentsThisUse??1)>1&&(c.a.soulState.qualifiedHitUnit1873??'first-hit-once')!=='first-hit-once')throw Error('Q-N50-4642-010：1873多段攻击命中时吸能力的触发单位待确认');const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<4;i++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0],before=c.actualStage(c.t,k);c.stage(c.t,-1,[k]);const applied=Math.max(0,before-c.actualStage(c.t,k));if(applied)c.stage(c.a,applied,[k]);}}
function clawAfter1873(c){if(c.m?.kind==='item'||c.a.soulState.clawDrain1873!==c.round)return;if(c.a.hp<=0)return;c.a.soulState.clawListenerResolving4671={round:c.round,move:c.m.id};try{healthRules.drainPercent(c,c.t.stats.maxHp/3,'噬夜疾袭低于上回合体力吸取');}finally{delete c.a.soulState.clawListenerResolving4671;}}
registry[1873]={name:'噬夜疾袭·库拉塔克',sourceHash:'ffc2de4b',partial:false,unimplemented:[],traits:{skillPriority:f=>f.soulState.clawFast1873===f.soulState.calculationRound?1:0,skillAlwaysHit:f=>f.soulState.clawFast1873===f.soulState.calculationRound},abilities:{snapshot:clawSnapshot1873,hitPayload:clawHit1873},hooks:{roundStart:clawSnapshot1873,afterHit:clawHit1873,afterUse:clawAfter1873}};


(()=>{'use strict';
function state1876(f){return f.soulState.polar1876??(f.soulState.polar1876={sourceHash:'92b69ae1',pending:0});}
function record1876(c){const st=state1876(c.a),delta=Math.max(0,c.unreducedRaw-c.reducedRaw);if(!delta)return;let amount=delta;if(c.settledDamage!==c.reducedRaw){const mode=c.a.soulState.qualified1876Accounting??'raw-stage';if(!['raw-stage','positive-settled-only'].includes(mode)){const err=Error('Q-N50-4674-001：1876本魂减免转附伤遇后续上限/护盾/免疫时统计基数待确认');err.polarAccounting={round:c.round,raw:c.reducedRaw,unreducedRaw:c.unreducedRaw,settledDamage:c.settledDamage,delta};throw err;}if(mode==='positive-settled-only'&&c.settledDamage===0)amount=0;}(st.reductions??=[]).push({round:c.round,unreducedRaw:c.unreducedRaw,reducedRaw:c.reducedRaw,settledDamage:c.settledDamage,amount});st.pending+=amount;}
registry[1876]={name:'无极使者',sourceHash:'92b69ae1',partial:false,unimplemented:[],deferred:['真正再次登场时首回合命中效果失效；当前首次在场已实现'],traits:{skillPriority:f=>state1876(f).full?1:0},abilities:{recordReduction:record1876},hooks:{
battleStart(c){state1876(c.a);c.t.effects['攻击技能命中效果失效']={start:1,end:1,source1876:true};},
roundStart(c){const st=state1876(c.a);st.round=c.round;st.full=c.a.hp===c.a.stats.maxHp;},
beforeIncomingAttack(c){const st=state1876(c.a);if(st.round===c.round&&!st.full){c.reduction=1-(1-c.reduction)*.5;c.polar1876=true;}},
beforeUse(c){if(!['physical','special'].includes(c.m.kind))return;const st=state1876(c.a);if(st.pending>0){st.using={round:c.round,amount:st.pending,move:c.m.id};st.pending=0;}},
afterHit(c){if(!['physical','special'].includes(c.m.kind))return;const st=state1876(c.a),u=st.using;if(!u||u.round!==c.round||u.move!==c.m.id)return;u.executed=true;if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,u.amount,'无极减免转下次固定','fixed');},
afterUse(c){const st=state1876(c.a),u=st.using;if(!u||u.round!==c.round||u.move!==c.m.id)return;if(!u.executed){const mode=c.a.soulState.qualified1876FailedNext??'retain';if(!['consume','retain'].includes(mode))throw Error('Q-N50-4511-006：1876下次附伤未命中/整招无效时消费待确认');if(mode==='retain')st.pending+=u.amount;}delete st.using;}
}};
})();

// SeerAPI soulmark/1878 hash 41007a05; raw source remains in source.json.
function lock1878(c,n){const old=c.t.soulState.chiyong1878??{layers:0,sourceSide:c.a.side,sourceHash:'41007a05'};old.layers=Math.min(3,old.layers+n);c.t.soulState.chiyong1878=old;}
function entry1878(c){c.t.effects.statusBlock={start:c.round,end:c.round+1};c.t.effects['神觉攻击禁异常弱化']={start:c.round,end:c.round+1,sourceSoul:1878};c.a.soulState.entryRound1878=c.round;}
function opponentUse1878(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;const pool=['atk','def','spa','spd','spe','acc'],chosen=[];let changes=0;for(let i=0;i<2;i++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0],before=c.actualStage(c.t,k);chosen.push(k);c.stage(c.t,-1,[k]);changes+=Math.max(0,before-c.actualStage(c.t,k));}if(!changes)c.a.soulState.reductionRound1878=c.round;(c.a.soulState.uses1878??=[]).push({round:c.round,move:c.m.id,chosen,changes});if(c.m.kind==='status'){c.hurt(c.t,c.t.stats.maxHp/3,'神觉对手用属性追加','percent');c.t.counts.nextDamageDouble=1;}else c.a.soulState.priorityRound1878=c.round+1;}
registry[1878]={name:'神觉·米斯蒂克',sourceHash:'41007a05',partial:false,unimplemented:[],deferred:['再次登场的调度；米斯蒂克离场后蚩庸之锁逐回合减层、属性无效及攻击禁异常分支'],traits:{skillPriority:f=>f.soulState.priorityRound1878===f.soulState.calculationRound?1:0,skillAlwaysHit:f=>f.soulState.priorityRound1878===f.soulState.calculationRound},abilities:{grantLock:lock1878,entry:entry1878,opponentUse:opponentUse1878},hooks:{battleStart:entry1878,opponentAfterUse:opponentUse1878,beforeIncomingAttack(c){if(c.a.soulState.reductionRound1878===c.round)c.reduction=1-(1-c.reduction)*.5;},beforeIncomingDamage(c){if(c.a.soulState.reductionRound1878===c.round&&['fixed','percent'].includes(c.type))c.amount*=.5;},battlePhaseEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.entryRound1878===c.round&&!c.selectedSkill(c.t))lock1878(c,2);}}};

function state1879(f){return f.soulState.astrolabe1879??(f.soulState.astrolabe1879={ticks:0,rewinding:false,sourceHash:'aee7a3b6'});}
function enlighten1879(c){if(c.clearAilments)c.clearAilments(c.a);const atk=c.panelStat?c.panelStat(c.a,'atk'):c.a.stats.atk,spa=c.panelStat?c.panelStat(c.a,'spa'):c.a.stats.spa;const kind=atk>spa?'星赐':atk<spa?'星哲':null;if(kind){if(c.entrySelfAilment)c.entrySelfAilment(kind,2);else c.ailment(c.a,kind,c.a,false,false,2);}state1879(c.a).lastEnlightenment={round:c.round,atk,spa,kind};}
registry[1879]={name:'星辰万象·天启星魂',sourceHash:'aee7a3b6',partial:false,unimplemented:[],deferred:['真实再次登场星启与星盘下场保留依赖换宠；当前初次登场星启单独实现'],traits:{skillPriority:f=>f.soulState.specialPriority1879??0,immuneAilments:f=>{const r=f.soulState.calculationRound??1,gift=f.ailments['星赐']>=r,philosophy=f.ailments['星哲']>=r;return gift&&philosophy?soulStatusPools.pool(undefined,{includeRestricted:true}).filter(x=>conditionStatusRules.isControl(x.name)).map(x=>x.name):gift?['疲惫']:philosophy?['害怕']:[];}},abilities:{enlighten:enlighten1879,state:state1879},hooks:{choiceLocked(c){c.a.soulState.specialPriority1879=c.m.kind==='special'?1:0;},battleStart(c){state1879(c.a);enlighten1879(c);},beforeDamage(c){if(!['physical','special'].includes(c.m.kind))return;c.attackOverride=c.combinedAttack1879(c.m.kind);},afterUse(c){if(c.m.kind==='physical')registry[1879].abilities.physicalAbsorb(c);}}};


{const old=registry[1879];registry[1879]={...old,traits:{...old.traits,attackImmune:f=>state1879(f).rewinding},hooks:{...old.hooks,combatEnd(c){registry[1879].abilities.resolveRewind(c);},ailmentEnded1879(c){state1879(c.a).endedRound=c.round;},beforeIncomingAttack(c){old.hooks.beforeIncomingAttack?.(c);if(state1879(c.a).shieldRound===c.round)c.reduction=1-(1-c.reduction)*.01;if(state1879(c.a).rewinding)c.immuneAttack=true;},beforeIncomingDamage(c){if(state1879(c.a).shieldRound===c.round&&['fixed','percent'].includes(c.type))c.amount*=.01;},battlePhaseEnd(c){const s=state1879(c.a);if(s.shieldRound!==c.round||c.a.hp<=0||c.t.hp<=0||c.ppReductionBlocked(c.t))return;const pool=c.t.moves.filter(k=>c.t.pp[k]>0);if(pool.length)c.t.pp[pool[Math.floor(c.random()*pool.length)]]=0;},afterRoundEnd(c){const s=state1879(c.a);if(c.a.hp<=0)return;if(s.enlightenAt===c.round){delete s.enlightenAt;enlighten1879(c);}if(s.endedRound===c.round&&!s.rewinding){s.ticks=Math.min(12,s.ticks+1);s.shieldRound=c.round+1;s.enlightenAt=c.round+1;if(s.ticks===12)s.rewinding=true;}}}};}

{const old=registry[1879];registry[1879]={...old,abilities:{...old.abilities,resolveRewind(c){const s=state1879(c.a);if(!s.rewinding||s.ticks<=0||c.a.hp<=0||c.t.hp<=0)return 0;const result=c.typedSoulAttack1879();s.ticks--;if(s.ticks===0)s.rewinding=false;return result;}}};}

{const old=registry[1879];registry[1879]={...old,abilities:{...old.abilities,physicalAbsorb(c){const amount=Math.floor((panel(c,c.t,'def')+panel(c,c.t,'spd'))*.3),loss=c.hurt(c.t,amount,'天启星魂物攻后吸取','percent');c.heal(c.a,amount,'天启星魂物攻后吸取回复');return {amount,loss};}}};}
function restore1884(c,when){if(c.round>3||when!=='end')return;c.heal(c.a,300,'迪迦首三轮回复');c.restorePP(c.a,2);}
registry[1884]={name:'迪迦奥特曼',sourceHash:'8ca7010a',partial:false,unimplemented:[],traits:{entryWeaknessRounds:3,ailmentImmune:f=>(f.soulState.calculationRound??1)<=3},hooks:{roundStart(c){restore1884(c,'start');},afterRoundEnd(c){restore1884(c,'end');},beforeUse(c){const id=c.m.wikiId??c.m.id;if(id===37518)c.timed(c.a,'迪迦强力增伤',2,{});if(id===37517)c.timed(c.a,'迪迦空中附伤',2,{});},beforeDamage(c){if(c.on(c.a,'迪迦强力增伤'))c.modifier*=2;},afterUse(c){if(c.m.kind==='item'||!c.on(c.a,'迪迦空中附伤')||c.a.hp<=0||c.t.hp<=0)return;const speed=c.panelStat(c.a,'spe'),nominal=c.t.stats.maxHp*.1,amount=Math.min(nominal,speed*2);c.hurt(c.t,amount,'迪迦空中附伤','percent');}}};

function radiant1885(f){const st=f.soulState.radiant1885??(f.soulState.radiant1885={energy:0,sourceHash:'2c72d978'});st.energy=Math.max(0,Math.min(f.stats.maxHp,st.energy));return st;}
function setRadiant1885(c,amount){const st=radiant1885(c.a);st.energy=Math.max(0,Math.min(c.a.stats.maxHp,Math.floor(amount)));return st.energy;}
function compareRadiant1885(c,now,previous,round){if(previous===undefined)return;const st=radiant1885(c.a);if(now>previous){st.bonusRound=round;st.priorityRound=round;}else if(now<previous)st.reductionRound=round;}
registry[1885]={name:'赛罗奥特曼',sourceHash:'2c72d978',partial:false,unimplemented:[],traits:{skillPriority:f=>radiant1885(f).priorityRound===f.soulState.calculationRound?1:0,ailmentImmune:f=>radiant1885(f).energy>f.stats.maxHp*.5,weaknessImmune:f=>radiant1885(f).energy>f.stats.maxHp*.5},abilities:{state:radiant1885,setEnergy:setRadiant1885},hooks:{battleStart(c){setRadiant1885(c,c.a.stats.maxHp);},roundStart(c){const st=radiant1885(c.a),before=st.energy;compareRadiant1885(c,before,st.previousAfterDeduction,c.round);st.lastStart=before;setRadiant1885(c,before-c.a.stats.maxHp*.2);st.previousAfterDeduction=st.energy;},beforeDamage(c){if(radiant1885(c.a).bonusRound===c.round)c.modifier*=1.5;},beforeIncomingAttack(c){if(radiant1885(c.a).reductionRound===c.round)c.reduction=1-(1-c.reduction)*.5;},afterUse(c){if(['physical','special'].includes(c.m.kind)&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,radiant1885(c.a).energy*.5,'赛罗光辉能量附伤','percent');},afterRoundEnd(c){const st=radiant1885(c.a);if(c.a.hp<=0)return;c.heal(c.a,st.energy*.5,'赛罗能量回合末回复');st.previousEnd=st.energy;}}};

const curseKinds1886=['诅咒','烈焰诅咒','致命诅咒','虚弱诅咒'];
function curses1886(f,r){return curseKinds1886.filter(k=>(f.ailments[k]??0)>=r);}
function spread1886(c){const st=c.a.soulState.belial1886;if(c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0||st?.activeRound!==c.round)return;const list=curses1886(c.a,c.round);const applied=list.map(k=>({kind:k,duration:c.a.ailments[k]-c.round+1,applied:c.ailment(c.t,k,c.a,false,false,c.a.ailments[k]-c.round+1)}));if(!applied.some(x=>x.applied))c.timed(c.a,'贝利亚传播未触发减伤',1,{});(st.spreads??=[]).push({round:c.round,actor:c.currentActorSide,applied});}
registry[1886]={name:'贝利亚奥特曼',sourceHash:'741b1239',partial:false,unimplemented:[],deferred:['击败诅咒或附属诅咒对手后对方真实下只出战精灵附加诅咒；当前击败提升自身最大HP单独实现','真实每次再次登场附加三种附属诅咒'],traits:{},abilities:{admitted(c,k){return conditionStatusRules.isControl(k)?{kind:'诅咒',duration:2}:null;},curseKinds:curses1886},hooks:{battleStart(c){c.a.soulState.belial1886={};for(const k of curseKinds1886.slice(1))c.entrySelfAilment(k,3);},roundStart(c){const st=c.a.soulState.belial1886??(c.a.soulState.belial1886={});st.activeRound=curses1886(c.a,c.round).length?c.round:0;st.enemyCount=curses1886(c.t,c.round).length;st.round=c.round;},afterUse:spread1886,opponentAfterUse:spread1886,beforeIncomingAttack(c){if(c.on(c.a,'贝利亚传播未触发减伤'))c.reduction=1-(1-c.reduction)*.5;},beforeDamage(c){if(c.on(c.a,'贝利亚满体下轮增伤'))c.modifier*=2;},afterRoundEnd(c){const st=c.a.soulState.belial1886;if(c.a.hp<=0||!st||st.round!==c.round||!st.enemyCount)return;c.heal(c.a,st.enemyCount*200,'贝利亚敌方诅咒种数回复');if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'贝利亚满体下轮增伤',1,{},c.round+1);},opponentDefeated(c){const kinds=[...new Set([...curses1886(c.t,c.round),...(c.t.soulState.roundDefeatAilments??[]).filter(k=>curseKinds1886.includes(k))])];if(!kinds.length)return;const n=kinds.length*50;c.a.stats.maxHp+=n;c.a.soulState.belialMaxHP1886=(c.a.soulState.belialMaxHP1886??0)+n;c.a.soulState.belialNextCurse1886={kind:'诅咒',sourceHash:'741b1239',status:'deferred-next-opponent-entry',kinds};}}};


registry[1881]={name:'空洄星徒',sourceHash:'6d434578',traits:{},hooks:{roundStart(c){const odd=c.a.hp%2===1;c.a.soulState.parity1881={round:c.round,odd};if(!odd)c.timed(c.t,'攻击技能命中效果失效',1,{});},beforeDamage(c){if(c.a.soulState.parity1881?.round===c.round&&c.a.soulState.parity1881.odd)c.modifier*=1.5;},afterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0&&(c.actionAttackDamage??0)===0)c.hurt(c.t,c.t.stats.maxHp/3,'空洄未造成攻击伤害附伤','percent');},opponentAfterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0&&(c.attackDamage??0)===0&&!c.ppReductionBlocked(c.t)){const keys=c.t.moves.slice();if(keys.length)c.t.pp[keys[Math.floor(c.random()*keys.length)]]=0;}}}};


function water1882(c){return c.typeParts(c.m.type).includes('水');}
registry[1882]={name:'帕诺·海啸武装',sourceHash:'7678821e',partial:false,unimplemented:[],traits:{},hooks:{roundStart(c){c.a.soulState.tsunami1882={round:c.round,boosted:Object.values(c.a.stages).some(n=>n>0)};},beforeIncomingAttack(c){if(water1882(c)&&!c.attackImmunityIgnored){c.immuneAttack=true;c.wholeAttackImmune=true;c.a.soulState.tsunamiNext1882=true;}if(c.a.soulState.tsunami1882?.boosted)c.reduction=1-(1-c.reduction)*.5;},beforeDamage(c){if(c.a.soulState.tsunamiNext1882)c.modifier*=2;},afterAttack(c){c.a.soulState.tsunamiNext1882=false;},opponentBeforeUse(c){if(!['physical','special'].includes(c.m.kind)||water1882(c)||c.a.hp<=0)return;for(const k of c.a.moves)c.a.pp[k]=Math.max(0,c.a.pp[k]-2);c.clearBoost(c.t);},afterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0&&!c.a.soulState.tsunami1882?.boosted)c.ailment(c.t,'冻伤',c.a);}}};


function cloud1888(f){return f.soulState.cloud1888??(f.soulState.cloud1888={layers:0,total:0,lastAttack:0});}
registry[1888]={name:'云盈',sourceHash:'1a1b8d94',partial:false,unimplemented:[],deferred:['真实下场重置氤氲蛰影，记录下场前层数；下次真实登场时每层令对手混乱1回合'],traits:{skillPriority:f=>cloud1888(f).layers},hooks:{battleStart(c){cloud1888(c.a);},roundStart(c){const st=cloud1888(c.a);if(c.round===1||st.lastAttack===c.round-1||st.layers>=3||st.total>=3)return;st.layers++;st.total++;},beforeDamage(c){c.modifier*=1+cloud1888(c.a).layers*.25;},afterRoundEnd(c){if(c.a.hp>0)c.heal(c.a,c.a.stats.maxHp*.1*cloud1888(c.a).layers,'云盈氤氲蛰影回复');},attackDamageTaken(c){const st=cloud1888(c.a),n=c.settledDamage??c.dealt;if(c.a.hp<=0)return;const layers=st.layers;st.lastAttack=c.round;st.layers=0;if(c.t.hp>0){c.hurt(c.t,n*Math.max(0,1.5-layers*.25),'云盈受击附加百分比伤害','percent');if(!c.ppReductionBlocked(c.t)){const pool=c.t.moves.slice();for(let i=0;i<layers&&pool.length;i++)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;}}}}};


registry[1889]={name:'帕诺·绿光武装',sourceHash:'77e5fe0d',partial:false,unimplemented:[],traits:{},hooks:{roundStart(c){c.a.soulState.green1889={round:c.round,count:Object.values(c.t.ailments).filter(v=>v>=c.round).length};},beforeIncomingAttack(c){if(c.typeParts(c.m.type).includes('草')&&!c.attackImmunityIgnored){c.immuneAttack=true;c.wholeAttackImmune=true;c.a.soulState.grassHeal1889=true;}},beforeUse(c){if(['physical','special'].includes(c.m.kind)&&c.a.soulState.grassHeal1889){delete c.a.soulState.grassHeal1889;c.heal(c.a,c.a.stats.maxHp,'绿光草系免疫下次攻击全回复');}},beforeDamage(c){c.modifier*=1+(c.a.soulState.green1889?.count??0)*.5;},opponentBeforeUse(c){if(!['physical','special'].includes(c.m.kind)||c.typeParts(c.m.type).includes('草')||c.a.hp<=0)return;for(const k of c.a.moves)c.a.pp[k]=Math.max(0,c.a.pp[k]-2);for(const k of Object.keys(c.a.ailments))if(conditionStatusRules.isControl(k))c.clearAilment(c.a,k);},afterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0&&(c.a.soulState.green1889?.count??0)===0)c.ailment(c.t,'中毒',c.a);}}};


const crocStats1892=['atk','def','spa','spd','spe'];
registry[1892]={name:'变异鳄兰',sourceHash:'e725e8fa',partial:false,unimplemented:[],traits:{pinkDamageMultiplier:f=>1+(f.soulState.croc1892?.higher??0)*.2},hooks:{battleStart(c){c.a.soulState.crocBase1892={...c.a.stats};},roundStart(c){const signs=crocStats1892.map(k=>Math.sign(c.panelStat(c.a,k)-c.panelStat(c.t,k)));signs.push(Math.sign(c.a.stats.maxHp-c.t.stats.maxHp));c.a.soulState.croc1892={round:c.round,higher:signs.filter(n=>n>0).length,lower:signs.filter(n=>n<0).length};},beforeDamage(c){c.modifier*=1+(c.a.soulState.croc1892?.higher??0)*.2;},afterRoundEnd(c){if(c.a.hp>0)c.heal(c.a,(c.a.soulState.croc1892?.lower??0)*100,'变异鳄兰低能力回复');},opponentDefeated(c){const st=c.a.soulState;st.crocKO1892=(st.crocKO1892??0)+1;st.crocBase1892??={...c.a.stats};for(const k of[...crocStats1892,'maxHp'])c.a.stats[k]=Math.floor(st.crocBase1892[k]*(1+.1*st.crocKO1892));}}};


function guards1895(f){return f.soulState.fireGuards1895??(f.soulState.fireGuards1895=[]);}
function grant1895(c,source,count){c.latestAttackNullifyOrder?.(c.a);const entries=guards1895(c.a);c.a.soulState.fireGuards1895=entries.filter(e=>e.source!==source);const order=c.a.soulState.defensiveGrantOrder=(c.a.soulState.defensiveGrantOrder??0)+1;c.a.soulState.fireGuards1895.push({source,count,fireType:'火',order});}
registry[1895]={name:'星光·蘑菇怪',sourceHash:'e7edd7ca',partial:false,unimplemented:[],traits:{},abilities:{grant:grant1895,prepare(c){if(!['physical','special'].includes(c.m.kind)||!c.typeParts(c.m.type).includes('火'))return;c.a.soulState.fireGuards1895=[];delete c.a.soulState.guard1895Use;},incoming(c){if(c.attackImmunityIgnored||c.typeParts(c.m.type).includes('火'))return;const key=c.round+':'+c.t.side+':'+c.m.id+':'+(c.t.soulState.skillUses?.[c.m.id]??0);if(c.a.soulState.guard1895Use===key){c.immuneAttack=true;c.wholeAttackImmune=true;c.guardImmunity=true;return;}if(c.a.soulState.nullifyUse===c.round+':'+c.t.side+':'+(c.m.replayRootMoveId??c.m.id))return;const entries=guards1895(c.a);if(!entries.length||c.immuneAttack||c.on(c.a,'攻击伤害免疫'))return;const last=entries.at(-1),other=c.latestAttackNullifyOrder(c.a);if(c.a.counts.attackNullify>0&&other>(last.order??0))return;if(--last.count===0)entries.pop();c.a.soulState.guard1895Use=key;c.immuneAttack=true;c.wholeAttackImmune=true;c.guardImmunity=true;}},hooks:{battleStart(c){grant1895(c,'soul:1895:e7edd7ca',1);},roundStart(c){const own=Object.values(c.a.ailments).filter(v=>v>=c.round).length,foe=Object.values(c.t.ailments).filter(v=>v>=c.round).length;c.a.soulState.mycoReduction1895={round:c.round,factor:Math.pow(.67,foe)};if(!own)return;const pool=['中毒','寄生','感染'],results=pool.slice(0,Math.min(own,3)).map(name=>c.randomAilmentsFrom(1,[name],null)[0]),count=results.every(e=>!e.applied)?1:0,before=c.a.soulState.mycoGrowth1895??0,growth=Math.min(1000-before,count*100);c.a.stats.maxHp+=growth;c.a.soulState.mycoGrowth1895=before+growth;(c.a.soulState.mycoDraws1895??=[]).push({round:c.round,sourceHash:'e7edd7ca',results,growth});},beforeIncomingAttack(c){const st=c.a.soulState.mycoReduction1895;if(st?.round===c.round)c.reduction=1-(1-c.reduction)*st.factor;}}};


function energyCost1896(c){const before=c.a.hp,paid=c.hurt(c.a,before,'西塔全部体力消耗','direct',true);c.hurt(c.t,paid,'西塔全部体力等量固定伤害','fixed');(c.a.soulState.energyCosts1896??=[]).push({round:c.round,move:c.m.id,before,paid,timing:c.a.soulState.costTiming1896});}
registry[1896]={name:'西塔·能源型',sourceHash:'f16285e5',partial:true,unimplemented:['Q-4695-001：战前当前HP同步与反震上限变化顺序','Q-4695-002：耗尽体力和本次技能执行时序','Q-4685-002：致死攻击后的反震'],traits:{},hooks:{battleStart(c){const policy=c.a.soulState.entryHp1896;if(!['keep','fill'].includes(policy))throw Error('Q-4695-001：战斗开始加400上限时当前HP是否同步待确认');const before=c.a.stats.maxHp;c.a.stats.maxHp+=400;if(policy==='fill')c.a.hp+=400;c.a.soulState.energy1896={baseMax:before,used:0};},roundStart(c){const st=c.a.soulState.energy1896;st.round=c.round;st.higher=c.a.stats.maxHp>c.t.stats.maxHp;st.lower=c.a.stats.maxHp<c.t.stats.maxHp;},beforeIncomingDamage(c){const st=c.a.soulState.energy1896;if(st?.round===c.round&&st.higher&&['fixed','percent'].includes(c.type)&&(c.damageReductionIgnore??0)<1)c.amount*=.4;},beforeUse(c){const st=c.a.soulState.energy1896;if(!st?.lower||!['physical','special'].includes(c.m.kind)||c.a.hp<=0)return;const timing=c.a.soulState.costTiming1896;if(!['before-red','after-skill'].includes(timing))throw Error('Q-4695-002：消耗全部HP后本次红伤和技能词条是否继续待确认');if(timing==='before-red')energyCost1896(c);},afterUse(c){if(c.actualUsed&&['physical','special'].includes(c.m.kind)&&c.a.soulState.energy1896?.lower&&c.a.soulState.costTiming1896==='after-skill'&&c.a.hp>0)energyCost1896(c);},attackDamageTaken(c){const st=c.a.soulState.energy1896;if(!st||st.used>=4||(c.settledDamage??c.dealt)<=300)return;if(c.a.hp<=0){if(typeof c.a.soulState.lethalReaction1896!=='boolean')throw Error('Q-4685-002：致死攻击后的西塔双方固伤与减上限待确认');if(!c.a.soulState.lethalReaction1896)return;}const mode=c.a.soulState.reactionHp1896,order=c.a.soulState.reactionOrder1896;if(!['keep-clamp','ratio'].includes(mode)||!['damage-first','max-first'].includes(order))throw Error('Q-4695-001：双方固伤和降低体上限的次序与当前HP同步待确认');st.used++;const drop=()=>{const old=c.a.stats.maxHp,next=Math.max(1,old-100);const hp=mode==='ratio'?Math.floor(c.a.hp*next/old):Math.min(c.a.hp,next);if(c.a.hp>0&&hp===0)throw Error('Q-4695-001：按比例降低上限将1HP取整为0的生命处理待确认');c.a.stats.maxHp=next;c.a.hp=hp;};if(order==='max-first')drop();const self=c.hurt(c.a,300,'西塔反震自身固定伤害','fixed'),other=c.hurt(c.t,300,'西塔反震对手固定伤害','fixed');if(order==='damage-first')drop();(st.reactions??=[]).push({round:c.round,input:c.settledDamage??c.dealt,request:300,selfHpLoss:self,otherHpLoss:other,used:st.used,mode,order,maxHp:c.a.stats.maxHp});}}};


registry[1897]={name:'绮影罗心·织焰',sourceHash:'29bf0260',partial:true,unimplemented:['Q-4696-001：API百分比与格式化绝对体力冲突','Q-4696-002：交换取整及调整HP交互'],traits:{},hooks:{opponentAfterUse(c){if(!c.actualUsed||c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0||![c.a,c.t].some(f=>f.ailments['烧伤']>=c.round))return;const mode=c.a.soulState.exchange1897;if(!['percent','absolute'].includes(mode))throw Error('Q-4696-001：魂印百分比与绝对HP交换来源冲突');const a=c.a.hp,t=c.t.hp,am=c.a.stats.maxHp,tm=c.t.stats.maxHp;let na=mode==='percent'?am*t/tm:t,nt=mode==='percent'?tm*a/am:a;const policy=c.a.soulState.exchangeBoundary1897;if((!Number.isInteger(na)||!Number.isInteger(nt)||na<1||nt<1||na>am||nt>tm)&&!['ceil-clamp','floor-clamp'].includes(policy))throw Error('Q-4696-002：交换非整数、低于1或超过上限边界待确认');if(policy){const round=policy==='ceil-clamp'?Math.ceil:Math.floor;na=Math.max(1,Math.min(am,round(na)));nt=Math.max(1,Math.min(tm,round(nt)));}if([c.a,c.t].some(f=>c.on(f,'技能禁疗')||c.on(f,'禁疗')||c.on(f,'四杀鬼囹')||c.on(f,'回复翻倍')||f.suitState.shield>0||f.suitState.barrier>0)&&c.a.soulState.exchangeAdjustment1897!=='direct')throw Error('Q-4696-002：交换是否直接调整HP及免疫回复交互待确认');c.a.hp=na;c.t.hp=nt;(c.a.soulState.exchanges1897??=[]).push({round:c.round,mode,before:[a,t],after:[na,nt]});},roundEnd(c){if(c.a.hp>0&&[c.a,c.t].some(f=>!(f.ailments['烧伤']>=c.round)))c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.3,'织焰已失体力回复');}}};


registry[1898]={name:'华光之翼·杰洛恩',sourceHash:'4eb214da',partial:true,unimplemented:['Q-4697-001：既有异常不满PP与满PP时点','Q-4697-002：转睡眠范围时长免疫','Q-4697-003：回合末半体判断时点'],traits:{skillPriority:f=>f.soulState.priority1898Round===f.soulState.calculationRound?1:0},hooks:{afterHit(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;const existing=Object.keys(c.t.ailments).filter(k=>c.t.ailments[k]>=c.round);if(existing.length){const before=c.a.soulState.ppBeforeBase4697;const pre=before?.round===c.round&&before.move===c.m.id?before.value===c.m.pp:undefined,post=c.a.pp[c.m.id]===c.m.pp;let full=post;if(pre!==post){const q=c.a.soulState.fullPP1898;if(!['before-cost','after-cost'].includes(q))throw Error('Q-4697-001：技能PP满在消耗前或命中后判定待确认');full=q==='before-cost'?pre:post;}if(full){const duration=c.a.soulState.convertDuration1898,removal=c.a.soulState.convertRemoval1898;if(!['preserve-max','normal'].includes(duration)||!['clear-before','clear-on-success'].includes(removal))throw Error('Q-4697-002：转睡眠时长及免疫失败原异常保留待确认');const end=Math.max(...existing.map(k=>c.t.ailments[k])),n=duration==='preserve-max'?end-c.round+1:undefined;if(removal==='clear-before')for(const k of existing)if(k!=='睡眠')c.clearAilment(c.t,k);const ok=c.ailment(c.t,'睡眠',c.a,false,false,n);if(ok&&removal==='clear-on-success')for(const k of existing)if(k!=='睡眠')c.clearAilment(c.t,k);return;}const policy=c.a.soulState.existingNonfull1898;if(!['apply','skip'].includes(policy))throw Error('Q-4697-001：已有异常但PP不满是否继续失明或失神待确认');if(policy==='skip')return;}c.ailment(c.t,c.m.kind==='status'?'失神':'失明',c.a);},afterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.hp>0&&c.a.soulState.fixed1898Round===c.round)c.hurt(c.t,350,'杰洛恩下回合用招固定伤害','fixed');},roundEnd(c){if(c.a.hp<=0)return;const before=c.a.hp,half=c.a.stats.maxHp/2;c.heal(c.a,350,'杰洛恩回合末回复');const relation=x=>x<half?'low':x>half?'high':'equal',pre=relation(before),post=relation(c.a.hp);let selected=post;if(pre!==post){const q=c.a.soulState.endComparison1898;if(!['before-heal','after-heal'].includes(q))throw Error('Q-4697-003：回复跨越半体阈值时判断时点待确认');selected=q==='before-heal'?pre:post;}if(selected==='low')c.a.soulState.priority1898Round=c.round+1;if(selected==='high')c.a.soulState.fixed1898Round=c.round+1;}}};


function refreshGigan1908(f,r){const st=f.soulState.gigan1908;if(!st||st.round!==r)return;st.attackCount=st.flipped?st.remaining:st.missing;st.fixedCount=st.flipped?st.missing:st.remaining;}
registry[1908]={name:'吉甘提卡',sourceHash:'81c675f9',partial:true,unimplemented:['Q-4704-001：第五交换应用于当前招或后续时点','下场重置交换态依赖真实换宠，第二阶段'],traits:{attackMultiplier:f=>1+(f.soulState.gigan1908?.attackCount??0)/10,attackReduction:f=>(f.soulState.gigan1908?.attackCount??0)/10},hooks:{roundStart(c){const old=c.a.soulState.gigan1908??{};c.a.soulState.gigan1908={flipped:old.flipped??false,round:c.round,missing:Math.floor((c.a.stats.maxHp-c.a.hp)*10/c.a.stats.maxHp),remaining:Math.floor(c.a.hp*10/c.a.stats.maxHp)};refreshGigan1908(c.a,c.round);},beforeUse(c){if(!c.m.fifth||c.a.hp<=0)return;const st=c.a.soulState.gigan1908,q=c.a.soulState.swapTiming1908;if(st.missing!==st.remaining&&!['before-red','after-use','next-round'].includes(q))throw Error('Q-4704-001：第五交换在本招红伤前、招后还是下一回合生效待确认');if(q==='before-red'||st.missing===st.remaining){st.flipped=!st.flipped;refreshGigan1908(c.a,c.round);}else st.pendingFlip=!st.pendingFlip;},afterUse(c){const st=c.a.soulState.gigan1908;if(!c.actualUsed||c.m.kind==='item'||c.a.hp<=0)return;if(st.pendingFlip&&c.a.soulState.swapTiming1908==='after-use'){st.flipped=!st.flipped;st.pendingFlip=false;refreshGigan1908(c.a,c.round);}if(st.fixedCount>0)c.hurt(c.t,st.fixedCount*30,'吉甘提卡剩余体力用招固定伤害','fixed');},roundEnd(c){const st=c.a.soulState.gigan1908;if(st.pendingFlip){st.pendingFlip=false;st.flipped=!st.flipped;}}}};


const opheliaIds4706=[1901,1940],opheliaControls4706=()=>soulStatusPools.pool(undefined,{includeRestricted:true}).map(x=>x.name).filter(conditionStatusRules.isControl);
function opheliaState4706(f){return f.soulState.ophelia4706??(f.soulState.ophelia4706={stars:0,cap:f.soulId===1940?5:4,firstExecutionUsed:false,soleActive:false,soleUsed:false,doubleCharges:0});}
function opheliaGain4706(c,kind){const st=opheliaState4706(c.a);if(c.a.soulId===1901&&st.soleActive){const q=c.a.soulState.gainSole1901;if(!['gain','no-gain'].includes(q))throw Error('Q-4706-002：原魂印唯一存活自援是否不再获得晨星来源冲突');if(q==='no-gain')return;}st.stars=Math.min(st.cap,st.stars+1);(st.events??=[]).push({round:c.round,kind,stars:st.stars});}
function opheliaSupport4706(c,kind){const st=opheliaState4706(c.a);if(!st.soleActive||st.stars>=st.cap)return 0;if(c.a.soulId===1901&&!['gain','no-gain'].includes(c.a.soulState.gainSole1901))throw Error('Q-4706-002：原魂印唯一存活自援是否获星待确认');let factor=1;if(st.doubleCharges>0){let can=['invalid','ailment','knockout','critical'].includes(kind);if(kind==='death'&&c.a.soulId===1940){const q=c.a.soulState.doubleDeath4706;if(typeof q!=='boolean')throw Error('Q-4706-003：可翻倍支援是否包含强化死亡PP归零待确认');can=q;}if(can){st.doubleCharges--;factor=2;}}return factor;}
function opheliaActivate4706(c){const st=opheliaState4706(c.a);if(st.soleUsed)return false;if(c.a.soulState.qualifiedSole4706!==true)throw Error('4706真实唯一存活条件尚未由队伍机制核实，不能从当前仅一个在场对象推断');st.soleUsed=true;st.soleActive=true;c.heal(c.a,c.a.stats.maxHp,'奥菲利娅唯一存活登场恢复');c.restorePP(c.a,Infinity);c.transformOpheliaFifth4706(c.a);return true;}
function opheliaImmune4706(c){const st=opheliaState4706(c.a);if(st.firstExecutionUsed||c.a.hp<=0)return false;st.firstExecutionUsed=true;c.grantOracleImmunity(c.a,2,'soul:'+c.a.soulId+':'+registry[c.a.soulId].sourceHash+':first-execution','ophelia-execution');(st.executions??=[]).push({round:c.round,blocked:true});return true;}
function opheliaCrit4706(c){if(c.a.soulId!==1940||!c.crit)return 1;const st=opheliaState4706(c.a),n=st.stars,factor=opheliaSupport4706(c,'critical');if(!factor)return 1;const q=c.a.soulState.critStack4706;if(n>0&&!['add','multiply'].includes(q))throw Error('Q-4706-004：天命之耀与现有晨星攻击增伤按加或乘待确认');const amount=.35*factor,result=q==='add'?(1+n*.1+amount)/(1+n*.1):1+amount;opheliaGain4706(c,'critical');return result;}
for(const[id,hash]of[[1901,'ebd20772'],[1940,'a19357a1']])registry[id]={name:'奥菲利娅·'+(id===1901?'原魂印':'强化魂印'),sourceHash:hash,partial:true,unimplemented:['Q-4706-001：命运晨星减层时点','Q-4706-002：原魂印唯一存活后获星矛盾','Q-4706-003：可翻倍支援清单/重授','Q-4706-004：天命之耀与晨星叠加','Q-4706-005：强化首次进入异常范围'],deferred:['为真正其他在场队友支援及背包存活来源、场下支援获星','队伍唯一存活条件与真实登场限定触发；已满足该条件的自身载荷另有实际实现','真实下场保留晨星层数及再次出场衔接'],traits:{minimumAfterReductions:f=>f.soulState.opheliaInvalidFloor4706?.round===f.soulState.calculationRound,pinkDamageMultiplier:f=>1+opheliaState4706(f).stars*.1,attackMultiplier:f=>1+opheliaState4706(f).stars*.1,attackReduction:f=>opheliaState4706(f).stars*.1,immuneAilments:f=>opheliaState4706(f).stars>0?opheliaControls4706():[]},abilities:{activateSole:opheliaActivate4706,immuneExecution:opheliaImmune4706,critical:opheliaCrit4706,stars:opheliaState4706},hooks:{battleStart(c){opheliaState4706(c.a);},roundStart(c){const st=opheliaState4706(c.a);if(st.stars>0){const q=c.a.soulState.decay4706;if(!['start','end'].includes(q))throw Error('Q-4706-001：命运晨星每回合减1层的时点未明确');if(q==='start'){st.stars--;st.decayedRound=c.round;}}},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&(c.damageReductionIgnore??0)<1)c.amount*=1-opheliaState4706(c.a).stars*.1;},opheliaInvalid4706(c){if(c.m.kind==='status'||c.m.kind==='item'||c.a.hp<=0||c.t.hp<=0)return;const factor=opheliaSupport4706(c,'invalid');if(!factor)return;c.a.soulState.opheliaInvalidFloor4706={round:c.round,minimum:(id===1901?300:350)*factor};opheliaGain4706(c,'invalid');},ailmentApplied(c){const st=opheliaState4706(c.a);if(id===1940){if(st.ailmentSupportRound===c.round)return;if(c.hadAny4706){const q=c.a.soulState.enterAilment4706;if(!['first-attachment','empty-to-any'].includes(q))throw Error('Q-4706-005：强化每回合首次进入异常是否含原有异常刷新/再附加待确认');if(q==='empty-to-any')return;}}const factor=opheliaSupport4706(c,'ailment');if(!factor)return;st.ailmentSupportRound=c.round;const amount=(id===1901?100:140)*factor,key='soul:'+id+':'+hash+':ailment-support';c.refreshShield(c.a,amount,key);c.refreshBarrier(c.a,amount,key);opheliaGain4706(c,'ailment');},opponentDefeated(c){const factor=opheliaSupport4706(c,'knockout');if(!factor||c.a.hp<=0)return;c.heal(c.a,c.a.stats.maxHp*(id===1901?.3:.35)*factor,'奥菲利娅终命支援');opheliaGain4706(c,'knockout');},death(c){const factor=opheliaSupport4706(c,'death');if(!factor)return;c.clear(c.t,false,c.a);if(id===1940&&!c.ppReductionBlocked(c.t)){const all=c.t.moves.slice(),positive=all.filter(k=>c.t.pp[k]>0);let pool=positive;if(positive.length<all.length){const q=c.a.soulState.ppZeroPool;if(!['all-slots','positive-only'].includes(q))throw Error('Q-4685-002：强化死亡随机归零PP是否包括已0技能待确认');if(q==='all-slots')pool=all;}const candidates=pool.slice(),chosen=[];for(let n=0;n<factor&&pool.length;n++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0];chosen.push(k);c.t.pp[k]=0;}(opheliaState4706(c.a).ppDraws??=[]).push({round:c.round,candidates,chosen});}opheliaGain4706(c,'death');},roundEnd(c){const st=opheliaState4706(c.a);if(st.stars>0){const q=c.a.soulState.decay4706;if(!['start','end'].includes(q))throw Error('Q-4706-001：本回合新增晨星是否在回合末减层待确认');if(q==='end'){st.stars--;st.decayedRound=c.round;}}if(id===1940&&st.decayedRound===c.round&&c.a.hp>0)c.heal(c.a,st.stars*100,'奥菲利娅晨星减少当轮剩余层回复');}}};


function resetKata1910(f){const st=f.soulState.kata1910??(f.soulState.kata1910={epoch:0});st.epoch++;st.attackReady=true;st.statusReady=true;}
registry[1910]={name:'卡塔·武装型',sourceHash:'4b86ec8f',partial:true,unimplemented:['Q-4707-001：首次攻击MISS/零红是否消费首攻增伤','真实再次出场重置依赖换宠，击败当场重置另已实现'],abilities:{reset:resetKata1910},traits:{},hooks:{battleStart(c){resetKata1910(c.a);},beforeUse(c){const st=c.a.soulState.kata1910;st.useEpoch=st.epoch;st.hit=false;st.positive=false;},beforeDamage(c){if(c.a.soulState.kata1910.attackReady)c.modifier*=2;},afterAttack(c){const st=c.a.soulState.kata1910;st.hit=true;st.positive ||= (c.settledDamage??c.dealt)>0;},afterUse(c){if(!c.actualUsed||c.m.kind==='item')return;const st=c.a.soulState.kata1910;if(st.useEpoch!==st.epoch)return;if(c.m.kind==='status'){if(!st.statusReady)return;st.statusReady=false;if(c.t.hp>0&&c.random()<.7)c.ailment(c.t,'瘫痪',c.a);}else if(st.attackReady){if(st.positive){st.attackReady=false;return;}const q=c.a.soulState.firstAttack1910;if(!['use','hit','positive'].includes(q))throw Error('Q-4707-001：首次攻击MISS或零红是否消费待确认');if(q==='use'||q==='hit'&&st.hit)st.attackReady=false;}},opponentDefeated(c){resetKata1910(c.a);}}};


function prophecyUse1912(c){if(!c.a.soulState.prophecy1912?.low||c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;const ok=c.ailment(c.t,'麻痹',c.a);if(ok)return;const a=c.a.hp,t=c.t.hp,am=c.a.stats.maxHp,tm=c.t.stats.maxHp;let na=am*t/tm,nt=tm*a/am;const q=c.a.soulState.exchangeBoundary1912;if((!Number.isInteger(na)||!Number.isInteger(nt)||na<1||nt<1)&&!['ceil-clamp','floor-clamp'].includes(q))throw Error('Q-4696-002：1912百分比交换取整与1HP边界待确认');if(q){const round=q==='ceil-clamp'?Math.ceil:Math.floor;na=Math.max(1,Math.min(am,round(na)));nt=Math.max(1,Math.min(tm,round(nt)));}if([c.a,c.t].some(f=>c.on(f,'技能禁疗')||c.on(f,'禁疗')||c.on(f,'四杀鬼囹')||c.on(f,'回复翻倍')||f.suitState.shield>0||f.suitState.barrier>0)&&c.a.soulState.exchangeAdjustment1912!=='direct')throw Error('Q-4696-002：1912百分比交换与护盾禁疗是否直接调整HP待确认');c.a.hp=na;c.t.hp=nt;(c.a.soulState.exchanges1912??=[]).push({round:c.round,before:[a,t],after:[na,nt],mode:'percent'});}
registry[1912]={name:'原始预言·吉尼亚斯',sourceHash:'dff9a46',partial:true,unimplemented:['Q-4709-001：低体用招麻痹/百分比交换时序','Q-4696-002：HP百分比交换边界及直接调整交互'],deferred:['击败麻痹对手后的真实下场异常转移到下一只精灵'],traits:{},hooks:{roundStart(c){c.a.soulState.prophecy1912={round:c.round,low:c.a.hp<c.a.stats.maxHp/2};},beforeUse(c){if(!c.a.soulState.prophecy1912?.low||c.m.kind==='item')return;const q=c.a.soulState.useTiming1912;if(!['before-payload','after-use'].includes(q))throw Error('Q-4709-001：用招麻痹与失败交换时序待确认');if(q==='before-payload')prophecyUse1912(c);},afterUse(c){if(c.actualUsed&&c.a.soulState.useTiming1912==='after-use')prophecyUse1912(c);}}};


function solver1913(f){return f.soulState.solver1913??(f.soulState.solver1913={red:0,pink:0,uses:[]});}
registry[1913]={name:'奇塔·解算型',sourceHash:'e16db901',partial:true,unimplemented:['Q-4711-001：无盾罩的判定在消耗前或后、消耗顺序','Q-4685-002：致死攻击后消耗反击'],traits:{attackReduction:f=>solver1913(f).red*.1},hooks:{battleStart(c){solver1913(c.a);},opponentBeforeUse(c){if(c.a.hp<=0||c.m.kind==='item')return;const value=c.carriedPower1839(c.t),key='soul:1913:e16db901';c.refreshShield(c.a,value.sum,key);c.refreshBarrier(c.a,value.sum,key);solver1913(c.a).lastGrant={round:c.round,...value};},opponentAfterUse(c){if(!c.actualUsed||c.m.kind==='item')return;const st=solver1913(c.a);if(c.a.hp<=0){const q=c.a.soulState.lethalSettlement1913;if(typeof q!=='boolean')throw Error('Q-4685-002：1913致死后是否仍消耗盾罩反击待确认');if(!q)return;}const before={shield:c.shieldValue(c.a),barrier:c.a.suitState.barrier},q=c.a.soulState.reductionCheck1913;if((before.shield>0||before.barrier>0)&&!['before-consume','after-consume'].includes(q))throw Error('Q-4711-001：无盾罩减伤检查在消耗前或后待确认');const order=c.a.soulState.consumeOrder1913??(before.shield===0&&before.barrier===0?'shield-first':null);if(!['shield-first','barrier-first'].includes(order))throw Error('Q-4711-001：消耗盾罩顺序待确认');let shield=0,barrier=0;if(order==='shield-first'){shield=c.consumeShields(c.a,c.t);barrier=c.consumeBarrier(c.a);}else{barrier=c.consumeBarrier(c.a);shield=c.consumeShields(c.a,c.t);}const checked=q==='after-consume'?{shield:c.shieldValue(c.a),barrier:c.a.suitState.barrier}:before;if(checked.shield===0)st.red=Math.min(3,st.red+1);if(checked.barrier===0)st.pink=Math.min(3,st.pink+1);st.uses.push({round:c.round,before,consumed:{shield,barrier},checked,red:st.red,pink:st.pink});if(shield+barrier>0)c.hurt(c.t,(shield+barrier)/2,'解算消耗盾罩一半附伤','percent');},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)){const ignored=Math.max(0,Math.min(1,c.damageReductionIgnore??0));c.amount*=1-solver1913(c.a).pink*.1*(1-ignored);}}}};


function dragon1914(f){return f.soulState.dragon1914??(f.soulState.dragon1914={selected:0,chosenRound:0,previousStart:null});}
function contract1914(c,target){if(!/^wiki:4373(?::|$)/.test(String(target.species)))throw Error('1914契约目标必须为已核实4373龙焉');if(target.soulState.contract1914)return false;const axes=c.a.soulState.contractAxes1914;if(!['five','six'].includes(axes))throw Error('Q-4712-005：龙焉全能力70是否包括最大HP待确认');const before={...target.stats},hp=target.hp;for(const k of['atk','def','spa','spd','spe'])target.stats[k]+=70;if(axes==='six'){const q=c.a.soulState.contractHp1914;if(!['keep','plus-delta','ratio'].includes(q))throw Error('Q-4695-001：契约加70最大HP时当前HP同步待确认');target.stats.maxHp+=70;if(q==='plus-delta')target.hp=Math.min(target.stats.maxHp,hp+70);if(q==='ratio')target.hp=Math.floor(hp*target.stats.maxHp/before.maxHp);}target.soulState.contract1914={ownerSide:c.a.side,sourceHash:'386605d1',axes,before,after:{...target.stats},ignoreShield:true,shieldScope:c.a.soulState.contractShieldScope1914};return true;}
registry[1914]={name:'龙琰',sourceHash:'386605d1',partial:true,unimplemented:['Q-4712-001：虐龙古咒类型附伤通道/无效路径','Q-4712-003：首回合基线及回合免异被清后的持续/回血','Q-4712-005：冥龙之契敌我范围与70能力维度'],deferred:['真实再次登场重新触发虐龙古咒，是否重置选择序数需第二阶段出入场审核；不把未核实伙伴范围登记为已确认队伍依赖'],abilities:{applyContract:contract1914},traits:{},hooks:{battleStart(c){const st=dragon1914(c.a);st.entryHp=c.a.hp;st.activeCurse=true;if(/^wiki:4373(?::|$)/.test(String(c.t.species))){const scope=c.a.soulState.contractScope1914;if(!['friendly-team','any-present'].includes(scope))throw Error('Q-4712-005：冥龙之契是否会影响当前敌方龙焉待确认');if(scope==='any-present')contract1914(c,c.t);}},roundStart(c){const st=dragon1914(c.a),now=c.a.hp;let previous=st.previousStart;if(previous===null){const q=c.a.soulState.firstRound1914;if(!['inactive','entry-hp'].includes(q))throw Error('Q-4712-003：首回合没有上回合起点，免异与回血是否触发待确认');previous=q==='entry-hp'?st.entryHp:null;}st.frame={round:c.round,eligible:previous!==null&&now<=previous,startHp:now,previous};st.previousStart=now;if(st.frame.eligible)c.timed(c.a,'龙琰本回合免异',1,{source1914:true});},dragonChoice1914(c){const st=dragon1914(c.a);if(c.m.kind==='status'&&st.chosenRound!==c.round){st.chosenRound=c.round;st.selected++;st.choice={round:c.round,move:c.m.id,serial:st.selected,type:st.selected%2?'龙':'邪灵'};}},beforeUse(c){const st=dragon1914(c.a);if(c.m.kind!=='status'||st.choice?.round!==c.round||st.choice.move!==c.m.id)return;if(st.choice.serial%2)c.clear(c.t);else c.clearBoost(c.t);},afterUse(c){const st=dragon1914(c.a);if(!c.actualUsed||c.m.kind!=='status'||st.choice?.round!==c.round||st.choice.move!==c.m.id||c.a.hp<=0||c.t.hp<=0)return;const gate=c.a.soulState.curseUse1914;if(!['actual-use','landed'].includes(gate))throw Error('Q-4712-001：属性原招无效时古咒附伤是否仍执行待确认');if(gate==='landed'&&!c.successful)return;const channel=c.a.soulState.typedChannel1914;if(!['ordinary-physical','ordinary-special','direct'].includes(channel))throw Error('Q-4712-001：250元素伤害使用何种通道待确认');c.typedSoul1914(250,st.choice.type,channel);},roundEnd(c){const frame=dragon1914(c.a).frame;if(frame?.round!==c.round||!frame.eligible||c.a.hp<=0)return;if(!c.on(c.a,'龙琰本回合免异')&&c.a.hp<c.a.stats.maxHp){const q=c.a.soulState.endHeal1914;if(!['trigger-locked','marker-active'].includes(q))throw Error('Q-4712-003：回初标记被清后回血是否保留待确认');if(q==='marker-active')return;}c.heal(c.a,c.a.stats.maxHp/3,'龙琰回合末回复','soul');}}};


function entry1916(c){const st=c.a.soulState;st.entryHp1916=c.a.hp;st.entryRecord1916={round:c.round,hp:c.a.hp,hash:'47faf2db'};}
function fatal1916(c){if(c.type!=='attack'||c.a.hp<=0||!(c.amount>=c.a.hp)||c.a.soulState.rewindUsed1916)return;c.a.soulState.rewindPending1916={round:c.round,hpBefore:c.a.hp,settled:c.amount,recorded:c.a.soulState.entryHp1916};}
function finish1916(c,phase){const st=c.a.soulState,e=st.rewindPending1916;if(!e||e.round!==c.round||st.rewindUsed1916)return;if(c.a.hp>0){if(phase!=='before-death')return;const q=st.floorRewind1916;if(!['prevention-first','return-record'].includes(q))throw Error('Q-4713-001：致死攻击被其他保命挡住时是否仍消费回归待确认');if(q==='prevention-first'){delete st.rewindPending1916;return;}}else{const q=st.fatalTiming1916;if(!['before-death','after-death'].includes(q))throw Error('Q-4713-001：致死攻击回归与死亡结算先后待确认');if(phase!==q)return;}const before=c.a.hp;c.a.hp=Math.max(0,Math.min(c.a.stats.maxHp,e.recorded));st.rewindUsed1916=true;delete st.rewindPending1916;if(phase==='after-death'&&c.a.hp>0)st.deathResolved=false;(st.rewindEvents1916??=[]).push({...e,phase,hpLoss:c.hpLoss,hpAfterDamage:before,hpAfter:c.a.hp,absoluteReturn:true});c.emit(c.name(c.a)+' 体力回归登场记录 '+c.a.hp+'。');}
registry[1916]={name:'伊塔·回溯型',sourceHash:'47faf2db',partial:true,unimplemented:['Q-4713-001：回归与死亡/其他保命先后'],deferred:['真实再次登场记录新HP；被击败后己方下只出场首回合免攻，触发成功后令当前对手瘫痪。'],traits:{},abilities:{entry:entry1916,finishFatal:finish1916},hooks:{battleStart:entry1916,beforeFatalDamage:fatal1916}};


function full1915(f){const pp=f.soulState.maxPP1915??{};return f.moves.filter(k=>f.pp[k]===pp[k]);}
function hp1915(c){const st=c.a.soulState.robot1915;if(!st)throw Error('1915缺少真实逐技能HP记录');const n=Object.values(st.slots).filter(Boolean).length;let factor=1+n*.2;if(n>1){const q=c.a.soulState.hpStack1915;if(!['sum','compound'].includes(q))throw Error('Q-4714-001：多个满PP技能20%最大HP相加或连乘待确认');if(q==='compound')factor=Math.pow(1.2,n);}const before=c.a.stats.maxHp,next=Math.floor(st.baseMaxHp*factor);if(before!==next){const q=c.a.soulState.hpChange1915;if(!['keep','plus-delta','ratio'].includes(q))throw Error('Q-4695-001：最大HP变化的当前HP同步待确认');const old=c.a.hp;c.a.stats.maxHp=next;c.a.hp=Math.max(0,Math.min(next,q==='ratio'?Math.floor(old*next/before):q==='plus-delta'?old+next-before:old));(st.hpEvents??=[]).push({round:c.round,active:n,before,after:next,hpBefore:old,hpAfter:c.a.hp,stack:c.a.soulState.hpStack1915,sync:q});}return next;}
registry[1915]={name:'古代巨型机器人',sourceHash:'30b86366',partial:true,unimplemented:['Q-4714-001：满PP对应最大HP加成叠加','Q-4714-002：随机能力重复及满级候选池','Q-4695-001：当前HP同步'],deferred:[],traits:{},abilities:{hasFull:full1915,protectBoost(c,operation){return ['clear','steal'].includes(operation)&&full1915(c.a).length>0;},activateAll(c){const st=c.a.soulState.robot1915;if(!st)throw Error('2251必须有真实1915技能对应HP记录');for(const k of c.a.moves)st.slots[k]=true;return hp1915(c);}},hooks:{battleStart(c){c.a.soulState.robot1915={baseMaxHp:c.a.stats.maxHp,slots:Object.fromEntries(c.a.moves.map(k=>[k,c.a.pp[k]===c.a.soulState.maxPP1915[k]]))};hp1915(c);},roundStart(c){const st=c.a.soulState.robot1915;for(const k of c.a.moves)if(c.a.pp[k]===0)st.slots[k]=false;hp1915(c);const n=full1915(c.a).length;if(!n)return;const all=['atk','def','spa','spd','spe','acc'];let pool=all.slice();if(n>1&&!['with-replacement','without-replacement'].includes(c.a.soulState.randomStages1915))throw Error('Q-4714-002：每项满PP随机强化能否重复待确认');if(all.some(k=>c.a.stages[k]===6)&&all.some(k=>c.a.stages[k]<6)){const q=c.a.soulState.cappedPool1915;if(!['all-six','below-cap'].includes(q))throw Error('Q-4714-002：随机强化是否预先排除满级能力待确认');if(q==='below-cap')pool=pool.filter(k=>c.a.stages[k]<6);}const candidates=pool.slice(),chosen=[];for(let i=0;i<n&&pool.length;i++){const index=Math.floor(c.random()*pool.length),k=pool[index];chosen.push(k);if(c.a.soulState.randomStages1915==='without-replacement')pool.splice(index,1);c.stage(c.a,1,[k]);}(st.draws??=[]).push({round:c.round,full:n,candidates,chosen});}}};


function shenji1920(c){if(c.a.hp<=0||c.m.kind==='item')return;const st=c.a.soulState.elder1920;if(!st)throw Error('1920真实登场记录缺失');let repeated=c.on(c.a,'长老尽发神祭');if(repeated&&c.hitEffectsDisabled){const q=c.a.soulState.sealed2256;if(!['base-only','allow-loop'].includes(q))throw Error('Q-4716-003：既授连续神祭在本招命中效果被封锁时是否仍循环待确认');repeated=q==='allow-loop';}const events=[];do{const paid=c.consumeShenji1920();if(!paid.success){events.push({...paid,applied:false});break;}const lost=Math.max(0,c.maxPP(c.m.id)-paid.after),chance=Math.min(100,lost*20)/100,roll=c.random(),passed=roll<chance;let self=false,target=false,extended=false;if(passed){if((c.a.ailments['麻痹']??0)>=c.round){c.a.ailments['麻痹']++;self=true;extended=true;}else self=c.ailment(c.a,'麻痹',c.a,false,false,3);target=c.ailment(c.t,'麻痹',c.a,false,false,3);}if(!target&&c.t.hp>0)c.hurt(c.t,70,'赫尔卡长老神祭未附麻痹固定伤害','fixed');events.push({...paid,lost,chance,roll,passed,self,target,extended});}while(repeated&&c.a.hp>0&&(c.a.pp[c.m.id]??0)>0);(st.festivals??=[]).push({round:c.round,move:c.m.id,repeated,events});}
registry[1920]={name:'赫尔卡长老',sourceHash:'dab093b5',partial:true,unimplemented:['Q-4716-003：命中效果封锁时既授连续神祭是否循环'],deferred:['真实再次登场重新授首回合固粉70上限与按满PP数量的先制时长','主动下场时按盾罩和回血，以及场下按零PP技能数量持续每回合恢复所有PP'],traits:{skillPriority:f=>{const e=f.soulState.elder1920,r=f.soulState.calculationRound??1;return e&&e.entryRound<=r&&e.priorityUntil>=r?1:0;}},abilities:{festival:shenji1920},hooks:{battleStart(c){const full=c.a.moves.filter(k=>c.a.pp[k]===c.maxPP(k)).length;c.a.soulState.elder1920={entryRound:c.round,priorityUntil:c.round+full-1,fullAtEntry:full};},afterHit:shenji1920,roundEnd(c){if(c.a.hp<=0)return;const active=k=>(c.a.ailments[k]??0)>=c.round;if(!active('麻痹')&&!active('超频'))return;const before={...c.a.ailments};for(const k of Object.keys(c.a.ailments))if(k!=='超频'&&active(k))c.convertAilment(c.a,k,'超频');const turns=active('超频')?c.a.ailments['超频']-c.round+1:0;if(c.a.soulState.selfCap1920==='hp')throw Error('1920来源明确伤害最高HP-1，不允许以宽泛格式化改成可致死HP');const n=Math.min(turns*70,Math.max(0,c.a.hp-1));if(n>0)c.hurt(c.a,n,'赫尔卡长老超频回末真实伤害','true');(c.a.soulState.elder1920.conversions??=[]).push({round:c.round,before,after:{...c.a.ailments},turns,amount:n,hpAfter:c.a.hp});}}};


function max1919(c,next,label){const before=c.a.stats.maxHp,hp=c.a.hp;next=Math.max(1,Math.floor(next));if(next===before)return 0;const q=c.a.soulState.hpChange1919;if(!['keep','plus-delta','ratio'].includes(q))throw Error('Q-4695-001：体力上限变化时当前HP同步待确认');c.a.stats.maxHp=next;c.a.hp=Math.max(0,Math.min(next,q==='ratio'?Math.floor(hp*next/before):q==='plus-delta'?hp+next-before:hp));(c.a.soulState.hpChanges1919??=[]).push({round:c.round,label,before,after:next,hpBefore:hp,hpAfter:c.a.hp,sync:q});return before-next;}
registry[1919]={name:'原始黑洞·尤纳斯',sourceHash:'84183901',partial:true,unimplemented:['Q-4717-001：连续体力上限变化基数','Q-4695-001：当前HP同步'],deferred:['回合开始与真实己方全队体力上限总和一半比较，不把单挑在场人数当队伍'],traits:{attackImmune:f=>!f.soulState.void1919?.broken},abilities:{changeMax:max1919},hooks:{beforeIncomingAttack(c){if(!c.a.soulState.void1919?.broken)c.immuneAttack=true;},battleStart(c){c.a.soulState.void1919={entryMax:c.a.stats.maxHp,broken:false};},roundStart(c){const st=c.a.soulState.void1919;if(c.a.soulState.qualifiedTeamHalf1919===true)st.broken=true;const rate=st.broken?-.10:.01,q=c.a.soulState.hpBasis1919;if(!['current','entry'].includes(q))throw Error('Q-4717-001：逐回合上限提升和减少按当前还是登场基数待确认');const base=q==='current'?c.a.stats.maxHp:st.entryMax;max1919(c,c.a.stats.maxHp+base*rate,st.broken?'魂印逐回合减少10%':'魂印逐回合增加1%');},damageTaken(c){if((c.a.roundActualSettledSkillDamageTaken??0)>0&&!c.a.soulState.void1919.broken){c.a.soulState.void1919.broken=true;c.a.soulState.void1919.brokenAt={round:c.round,type:c.type,settled:c.settledDamage};}},attackDamageTaken(c){if((c.a.roundActualSettledSkillDamageTaken??0)>0&&!c.a.soulState.void1919.broken){c.a.soulState.void1919.broken=true;c.a.soulState.void1919.brokenAt={round:c.round,type:'attack',settled:c.settledDamage};}}}};


function react1925(c,n){if(!(n>0)||n===400)return;if(c.a.hp<=0){const q=c.a.soulState.lethal1925;if(typeof q!=='boolean')throw Error('Q-4685-002：花灯仙子致死技能伤害后魂印反制资格待确认');if(!q)return;}const st=c.a.soulState.lantern1925;if(n>400){const roll=c.random(),passed=roll<.8,applied=passed&&c.t.hp>0&&c.ailment(c.t,'睡眠',c.a,false,false,undefined,{probabilityPercent:80});const healed=applied?0:c.heal(c.a,400,'花灯魂印睡眠未触发回复','soul')??0;(st.reactions??=[]).push({round:c.round,amount:n,branch:'high',roll,passed,applied,healed});}else{c.timed(c.t,'statusBlock',1,{source1925:c.a.side},c.round+1);(st.reactions??=[]).push({round:c.round,amount:n,branch:'low',start:c.round+1});}}
function receive1925(c){if(!c.receivedSkill||!(c.settledDamage>0)||c.t.side===c.a.side)return;const unit=c.a.soulState.damageUnit1925;if(!['packet','move'].includes(unit))throw Error('Q-4725-001：400技能伤害门槛按逐段逐项还是整招合计待确认');if(unit==='packet'||!c.skillPhase)return react1925(c,c.settledDamage);const m=c.selectedMove(c.t),token=c.round+':'+c.t.side+':'+m?.id+':'+c.t.soulState.skillUses?.[m?.id],st=c.a.soulState.lantern1925;if(st.pending?.token!==token)st.pending={token,amount:0};st.pending.amount+=c.settledDamage;}
registry[1925]={name:'花灯仙子',sourceHash:'f6e222da',partial:true,unimplemented:['Q-4725-001：技能伤害门槛统计单位','Q-4725-002：HP差增伤不足80的余数','Q-4685-002：致死受伤反制资格'],traits:{skillPriority:f=>f.soulState.lantern1925?.priority??0,attackMultiplier:f=>1+(f.soulState.lantern1925?.bonus??0)},hooks:{battleStart(c){c.a.soulState.lantern1925={};},roundStart(c){const st=c.a.soulState.lantern1925,gap=Math.max(0,c.t.hp-c.a.hp),q=c.a.soulState.gapUnits1925;if(gap>0&&gap%80&&!['floor','fractional'].includes(q))throw Error('Q-4725-002：每差80点40%不足80余数是否计入待确认');const units=q==='fractional'?gap/80:Math.floor(gap/80);st.frame={round:c.round,hp:c.a.hp,foeHp:c.t.hp,gap,units};st.priority=c.a.hp<c.a.stats.maxHp?1:0;st.bonus=Math.min(160,units*40)/100;},damageTaken:receive1925,attackDamageTaken:receive1925,opponentAfterUse(c){const st=c.a.soulState.lantern1925;if(c.a.soulState.damageUnit1925==='move'&&st.pending){const n=st.pending.amount;delete st.pending;react1925(c,n);}const e=c.t.effects.statusBlock;if(c.a.hp>0&&c.actualUsed&&c.m.kind==='status'&&c.invalidReason?.blocked&&c.on(c.t,'statusBlock')&&e.source1925===c.a.side)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.8,'花灯魂印属性无效成功回复','soul');}}};


function live1926(c){if(c.a.hp>0)return true;const q=c.a.soulState.lethal1926;if(typeof q!=='boolean')throw Error('Q-4685-002：卡尔玛致死后反制或用招后吸取资格待确认');return q;}
function attacks1926(c,f){const q=c.a.soulState.attackBasis1926,changed=['atk','spa'].some(k=>c.actualStage(f,k)!==0);if(changed&&!['panel','effective'].includes(q))throw Error('Q-4726-001：双攻差与降数值是否计能力等级待确认');return Object.fromEntries(['atk','spa'].map(k=>[k,q==='effective'?c.stageStat(f,k):c.panelStat(f,k)]));}
function reward1926(c,loss){if(!(loss>0))return;const st=c.a.soulState.core1926,q=c.a.soulState.rewardUnits1926,shieldMode=typeof q==='object'?q?.shield:q,bonusMode=typeof q==='object'?q?.bonus:q;if(loss%2&&!['per-event-floor','cumulative-floor'].includes(shieldMode)||loss%8&&!['per-event-floor','cumulative-floor','fractional'].includes(bonusMode))throw Error('Q-4726-003：每减少2点与8点的余数分别跨次累计或连续增伤比例待确认');const before=st.totalLoss;st.totalLoss+=loss;const count=(unit,mode)=>mode==='fractional'?loss/unit:mode==='cumulative-floor'?Math.floor(st.totalLoss/unit)-Math.floor(before/unit):Math.floor(loss/unit),shield=count(2,shieldMode),bonus=count(8,bonusMode)/100;if(shield>0)c.refreshShield(c.a,shield,'soul1926:fee31b6e');if(bonus>0)st.bonusByRound[c.round+1]=(st.bonusByRound[c.round+1]??0)+bonus;return {shield,bonus};}
function drain1926(c){if(!c.actualUsed||c.m.kind==='item'||!live1926(c))return;const st=c.a.soulState.core1926,a=attacks1926(c,c.a),t=attacks1926(c,c.t),difference=Math.max(0,Math.abs(a.atk-a.spa)-Math.abs(t.atk-t.spa));if(!difference)return;const kind=c.a.soulState.drainKind1926;if(!['fixed','percent','true'].includes(kind))throw Error('Q-4726-002：按双攻差吸取的伤害类型待确认');const loss=c.t.hp>0?c.hurt(c.t,difference,'机魂核心双攻差吸取',kind):0;let heal=difference;if(kind!=='fixed'&&loss!==difference){const q=c.a.soulState.replyBasis1926;if(!['actual','nominal'].includes(q))throw Error('Q-4713-002：动态吸取在非固定候选下的理论或实际回复待确认');if(q==='actual')heal=loss;}const restored=c.heal(c.a,heal,'机魂核心双攻差吸取回复','soul')??0,rewards=reward1926(c,loss);st.drains.push({round:c.round,afterSide:c.m.actorSide??c.t.side,a,t,difference,kind,hpLoss:loss,restored,...rewards});}
registry[1926]={name:'机魂核心·卡尔玛',sourceHash:'fee31b6e',partial:true,unimplemented:['Q-4726-001：双攻值口径','Q-4726-002：动态吸取类型','Q-4726-003：奖励余数单位','Q-4726-004：首次受伤未减值消费'],traits:{attackMultiplier:f=>1+(f.soulState.core1926?.activeBonus??0)},hooks:{battleStart(c){c.a.soulState.core1926={reduced:false,totalLoss:0,bonusByRound:{},drains:[]};},roundStart(c){c.a.soulState.core1926.activeBonus=c.a.soulState.core1926.bonusByRound[c.round]??0;},attackDamageTaken(c){const st=c.a.soulState.core1926;if(st.reduced||!(c.settledDamage>0)||!live1926(c))return;const values=attacks1926(c,c.t),key=values.atk>values.spa?'atk':values.spa>values.atk?'spa':null,gap=Math.abs(values.atk-values.spa),amount=key?Math.min(gap,Math.floor(values[key]/10)):0;if(!amount){const q=c.a.soulState.emptyReduction1926;if(!['on-damage','on-reduce'].includes(q))throw Error('Q-4726-004：首次正受伤但双攻相等或减值0时限次是否消费待确认');if(q==='on-damage')st.reduced=true;return;}if(c.panelStat(c.t,key)!==c.t.stats[key])throw Error('Q-4726-001：已有面板覆盖时永久减双攻的作用层待确认');const before=c.t.stats[key],effective=c.a.soulState.attackBasis1926==='effective',rank=c.actualStage(c.t,key),mult=rank>=0?(2+rank)/2:2/(2-rank);c.t.stats[key]=Math.max(1,effective?Math.ceil((values[key]-amount)/mult):before-amount);st.reduced=true;st.reduction={round:c.round,key,before,after:c.t.stats[key],amount,values,basis:effective?'effective':'panel'};},afterUse:drain1926,opponentAfterUse:drain1926}};


function feathers1930(c){const n=c.a.soulState.feathers1930;if(!Number.isInteger(n)||n<0||n>7)throw Error('1930神羽真实数量缺失或超过0至7');return n;}
registry[1930]={name:'闪光皮神',sourceHash:'394e3e0d',partial:true,unimplemented:['Q-4685-002：耗尽神羽后致死用攻的睡眠资格'],deferred:['真实己方其他存活精灵及皮皮比波波克尔身份决定减伤增伤吸血；无其他成员不能凭在场单挑推队伍','己方其他精灵回合结束低半且低于自身时消耗神羽令其HP增加至自身；共享所有权、真实下场保留与资源路由'],traits:{},abilities:{consumeOne(c){const before=feathers1930(c);if(before===0)return false;c.a.soulState.feathers1930=before-1;if(before===1)c.a.soulState.lostFeathers1930=true;(c.a.soulState.featherEvents1930??=[]).push({round:c.round,before,after:before-1,dispatch:'explicit-resource-consumption'});return true;}},hooks:{battleStart(c){c.a.soulState.feathers1930=7;c.a.soulState.lostFeathers1930=false;},roundEnd(c){if(c.a.hp>0)c.heal(c.a,feathers1930(c)*50,'神羽每片回末回复50','soul');},afterUse(c){if(!c.actualUsed||!['physical','special'].includes(c.m.kind)||!c.a.soulState.lostFeathers1930||feathers1930(c)!==0||c.t.hp<=0)return;if(c.a.hp<=0){const q=c.a.soulState.lethal1930;if(typeof q!=='boolean')throw Error('Q-4685-002：耗尽神羽后致死用攻是否仍睡眠待确认');if(!q)return;}c.ailment(c.t,'睡眠',c.a);}}};


registry[1933]={name:'参天巨型仙人掌',sourceHash:'684cb2d',partial:true,unimplemented:['Q-4734-001：回复跨500时是否同战阶增加回复效果','Q-4706-008：先回后等量固定伤害受阻基数','Q-N20-4505-003：反馈类型与基数','Q-4685-002：致死受攻反馈资格'],deferred:['本次在场回复加成在真实下场再入场时的清除与重置'],traits:{healingMultiplier:f=>1+(f.soulState.cactus1933?.healingBonus??0)},hooks:{battleStart(c){c.a.soulState.cactus1933={healingBonus:0,phases:[],feedbacks:[]};},beforeIncomingAttack(c){if(c.first!==c.a.side)c.reduction=1-(1-c.reduction)*.75;},attackDamageTaken(c){if(c.first!==c.a.side||!(c.settledDamage>0)||c.t.hp<=0)return;if(c.a.hp<=0){const live=c.a.soulState.lethal1933;if(typeof live!=='boolean')throw Error('Q-4685-002：仙人掌致死受攻反馈资格待确认');if(!live)return;}const q=c.a.soulState.reflection1933;if(!q||!['true','fixed','percent','direct'].includes(q.type)||!['settled','hp-loss'].includes(q.basis))throw Error('Q-N20-4505-003：先手反馈攻击伤害25%的类型与完整/实际基数待确认');const n=(q.basis==='settled'?c.settledDamage:c.hpLoss)*.25;if(n>0)c.reflect1933(n,q.type);c.a.soulState.cactus1933.feedbacks.push({round:c.round,settled:c.settledDamage,hpLoss:c.hpLoss,nominal:n,...q});},battlePhaseEnd(c){if(c.a.hp<=0)return;const st=c.a.soulState.cactus1933,before=c.a.hp,bonusBefore=st.healingBonus;let nominal=0,actual=0,damage=0;if(before<500){nominal=500-before;actual=c.heal(c.a,nominal,'仙人掌战阶不足500回复','soul')??0;damage=actual;if(actual!==nominal){const q=c.a.soulState.replyBasis1933;if(!['actual','nominal'].includes(q))throw Error('Q-4706-008：战阶先回复再等量固定伤害的实际或理论基数待确认');if(q==='nominal')damage=nominal;}if(damage>0&&c.t.hp>0)c.hurt(c.t,damage,'仙人掌战阶等量固定伤害','fixed');}let high=before>500;if(before<500&&c.a.hp>500){const q=c.a.soulState.phaseBranch1933;if(!['entry','sequential'].includes(q))throw Error('Q-4734-001：回复越500后本战阶高体分支是否再触发待确认');high=q==='sequential';}if(high)st.healingBonus=Math.min(100,Math.round(st.healingBonus*100)+20)/100;st.phases.push({round:c.round,before,after:c.a.hp,nominal,actual,damage,bonusBefore,bonusAfter:st.healingBonus});}}};


function mirror1946(c,phase){if(!['physical','special'].includes(c.m?.kind))return;const mode=c.a.soulState.mirrorTiming1946;if(!['before-use','after-hit','after-use'].includes(mode))throw Error('Q-4743-001：纳多雷攻击附弱时点待确认');if(mode!==phase)return;if(c.hitEffectsDisabled){const q=c.a.soulState.sealedMirror1946;if(!['independent','suppress'].includes(q))throw Error('Q-4716-003：纳多雷攻击附弱遇命中封锁资格待确认');if(q==='suppress')return;}if(c.t.hp<=0)return;if(c.a.hp<=0){const q=c.a.soulState.lethal1946;if(typeof q!=='boolean')throw Error('Q-4685-002：纳多雷致死攻击后附弱资格待确认');if(!q)return;}const values=Object.entries(c.a.stages).filter(([,n])=>n>0),out=[];for(const[k,n]of values){const before=c.t.stages[k];c.stage(c.t,-n,[k]);out.push(c.t.stages[k]<before);}let failed=!out.some(Boolean);if(out.some(Boolean)&&out.some(v=>!v)){const q=c.a.soulState.mirrorFailure1946;if(!['any-failed','all-failed'].includes(q))throw Error('Q-4697-007：多项附弱部分失败的未触发补偿待确认');failed=q==='any-failed';}if(failed)c.refreshShield(c.t,200,'soul:1946:2ab2ee9b:mirror');(c.a.soulState.mirrors1946??=[]).push({round:c.round,phase,values,out,failed});}
registry[1946]={name:'星光·纳多雷',sourceHash:'2ab2ee9b',partial:true,unimplemented:['Q-4743-001：攻击附弱时点','Q-4697-007：部分附弱失败补偿','Q-4693-002：多异常减伤叠加'],traits:{},hooks:{roundStart(c){c.stage(c.a,1,Object.keys(c.a.stages).some(k=>c.a.stages[k]>0)?undefined:[]);},beforeUse(c){mirror1946(c,'before-use');},afterHit(c){mirror1946(c,'after-hit');},afterUse(c){if(c.actualUsed)mirror1946(c,'after-use');},battlePhaseEnd(c){if(c.a.hp<=0)return;const kinds=Object.keys(c.a.ailments).filter(k=>c.a.ailments[k]>=c.round);if(kinds.length)c.timed(c.a,'纳多雷异常减伤',1,{count:kinds.length,stone:kinds.includes('石化')},c.round+1);},beforeIncomingAttack(c){const e=c.a.effects['纳多雷异常减伤'];if(!e||e.start>c.round||e.end<c.round||c.damageReductionIgnore>=1)return;let factor=1-e.count*.1;if(e.count>1){const q=c.a.soulState.reduction1946;if(!['sum','product'].includes(q))throw Error('Q-4693-002：每种异常10%减伤叠加待确认');if(q==='product')factor=.9**e.count;}c.reduction=1-(1-c.reduction)*Math.max(0,factor);},beforeIncomingDamage(c){if(!['fixed','percent'].includes(c.type))return;const e=c.a.effects['纳多雷异常减伤'];if(!e||e.start>c.round||e.end<c.round||c.damageReductionIgnore>=1)return;let factor=1-e.count*.1;if(e.count>1){const q=c.a.soulState.reduction1946;if(!['sum','product'].includes(q))throw Error('Q-4693-002：每种异常10%减伤叠加待确认');if(q==='product')factor=.9**e.count;}c.amount*=Math.max(0,factor);},beforeHealthDamage(c){const e=c.a.effects['纳多雷异常减伤'];if(c.type!=='attack'||!e?.stone||e.start>c.round||e.end<c.round||c.ignoreImmunity)return;const n=c.amount;c.amount=0;c.immune=true;if(n>0)c.reflectStone1946(n);}}};
registry[1946].hooks.roundStart=c=>{if(Object.values(c.a.stages).some(n=>n>0))c.stage(c.a,1);else c.stage(c.a,2,['def','spd']);};


const hunt1948=f=>(f.soulState.hunt1948??={souls:0,mark:null});
function hpModel1948(c,f,max,phase){const before=f.stats.maxHp,hp=f.hp,q=c.a.soulState.hpChange1948;if(!['keep','delta','ratio'].includes(q))throw Error('Q-4695-001：狩杀标记变更体力上限时当前HP同步待确认');f.stats.maxHp=max;if(hp<=0)f.hp=0;else if(q==='delta')f.hp=Math.max(0,Math.min(max,hp+max-before));else if(q==='ratio')f.hp=Math.min(max,Math.floor(hp*max/before));else f.hp=Math.min(max,hp);(c.a.soulState.huntHp1948??=[]).push({round:c.round,phase,before,max,hp,after:f.hp,policy:q});}
function shieldMark1948(c,f,mark){const n=Math.max(0,Math.floor(f.hp));c.refreshShield(f,n,mark.key);c.refreshBarrier(f,n,mark.key);mark.granted=true;mark.grantedHP=n;}
function mark1948(c){if(c.t.hp<=0)return false;const st=hunt1948(c.a);if(st.mark?.side===c.t.side){const q=c.a.soulState.markRefresh1948;if(!['ignore','refresh'].includes(q))throw Error('Q-4745-001：同一目标再次狩杀标记是否刷新待确认');if(q==='ignore')return false;}const q=c.a.soulState.markGrant1948;if(!['immediate','round-end'].includes(q))throw Error('Q-4745-002：狩杀标记的盾罩授予时点待确认');const old=st.mark;if(old&&!old.restored&&old.side===c.t.side)hpModel1948(c,c.t,old.max,'旧标记恢复');const max=c.t.stats.maxHp,mark={side:c.t.side,owner:c.a.side,key:'soul:1948:69377815:mark:'+c.a.side,round:c.round,max,restored:false,granted:false};st.mark=mark;c.t.soulState.mark1948={owner:c.a.side,key:mark.key};hpModel1948(c,c.t,Math.max(1,Math.floor(max*.4)),'授标记');if(q==='immediate')shieldMark1948(c,c.t,mark);return true;}
function endMark1948(c){const st=hunt1948(c.a),m=st.mark;if(!m||m.side!==c.t.side||m.restored||m.round!==c.round)return;hpModel1948(c,c.t,m.max,'回合结束恢复');m.restored=true;if(!m.granted)shieldMark1948(c,c.t,m);}
function attack1948(c,phase){if(!['physical','special'].includes(c.m?.kind))return;const st=hunt1948(c.a),f=st.frame;if(!f||f.round!==c.round||!f.positive)return;const mode=c.a.soulState.attackTiming1948;if(!['before-use','after-hit','after-use'].includes(mode))throw Error('Q-4743-001：1948使用攻击触发时点待确认');if(mode!==phase)return;if(c.hitEffectsDisabled){const q=c.a.soulState.sealed1948;if(!['independent','suppress'].includes(q))throw Error('Q-4716-003：1948攻击载荷遇命中封锁资格待确认');if(q==='suppress')return;}if(c.a.hp<=0){const q=c.a.soulState.lethal1948;if(typeof q!=='boolean')throw Error('Q-4685-002：1948致死攻击后载荷资格待确认');if(!q)return;}if(f.executedUse===(c.a.soulState.skillUses?.[c.m.id]??0)&&f.executedMove===c.m.id)return;if(st.souls<=0&&!f.both)return;f.executedMove=c.m.id;f.executedUse=c.a.soulState.skillUses?.[c.m.id]??0;if(!f.both)st.souls--;if(f.low)st.bonusRound=c.round;if(f.high&&c.t.hp>0){const q=c.a.soulState.sameTarget1948;if(!['once','twice'].includes(q))throw Error('Q-4745-003：对手与狩杀之的是同一对象时真实伤害结算次数待确认');for(let i=0;i<(q==='twice'?2:1)&&c.t.hp>0;i++)c.hurt(c.t,c.m.power,'狩杀之魂威力真实','true');}}
registry[1948]={name:'阿尔忒弥斯',sourceHash:'69377815',partial:true,unimplemented:['标记授盾罩时点/同目标刷新/上限同步','使用攻击附伤时点、同目标双称呼是否重复'],deferred:['真实己方其他精灵击败类魂印继承与每只或每种计层','真实其他对手的标记与场下保留1HP、换宠标记生命周期'],traits:{pinkDamageMultiplier:f=>hunt1948(f).bonusRound===f.soulState.calculationRound?1.4:1},abilities:{mark:mark1948,endMark:endMark1948,grantResource(c,n){if(!Number.isInteger(n)||n<0)throw Error('狩杀之魂层数必须非负整数');const st=hunt1948(c.a);st.souls+=n;return st.souls;}},hooks:{battleStart(c){hunt1948(c.a);mark1948(c);},roundStart(c){const st=hunt1948(c.a);delete st.bonusRound;const marked=st.mark?.side===c.t.side;st.frame={round:c.round,positive:st.souls>0,high:marked,low:marked,both:marked};},beforeUse(c){attack1948(c,'before-use');},afterHit(c){attack1948(c,'after-hit');},afterUse(c){if(c.actualUsed)attack1948(c,'after-use');}}};


const active1950=(f,k)=>{const e=f.effects[k],r=f.soulState.calculationRound??1;return e&&e.start<=r&&e.end>=r?e:null;};
function enter1950(c){if(c.a.hp<=0)return false;const own=c.clearAilments(c.a),other=c.clearAilments(c.t),success=own.length+other.length>0;if(success&&c.a.hp>0)c.timed(c.a,'圣颖登场免攻',2,{});c.a.soulState.entry1950={own,other,success};return success;}
function use1950(c,phase){if(!['physical','special'].includes(c.m?.kind)||!c.a.soulState.frame1950?.foeHigh)return;const q=c.a.soulState.attackTiming1950;if(!['before-use','after-hit','after-use'].includes(q))throw Error('Q-4743-001：圣颖使用攻击附伤时点待确认');if(q!==phase)return;if(c.hitEffectsDisabled){const seal=c.a.soulState.sealed1950;if(!['independent','suppress'].includes(seal))throw Error('Q-4716-003：圣颖攻击载荷遇命中封锁待确认');if(seal==='suppress')return;}if(c.a.hp<=0){const alive=c.a.soulState.lethal1950;if(typeof alive!=='boolean')throw Error('Q-4685-002：圣颖致死攻击后载荷资格待确认');if(!alive)return;}if(c.t.hp<=0)return;const model=c.a.soulState.hpBasis1950;if(!['current-use','current-start','max'].includes(model))throw Error('Q-4747-001：对手体力三分之一基数与读取时点待确认');const frame=c.a.soulState.frame1950,n=(model==='max'?c.t.stats.maxHp:model==='current-start'?frame.foeHP:c.t.hp)/3*(frame.selfHigh?2:1);c.hurt(c.t,n,'圣颖回合开始合格攻击附粉','percent');}
registry[1950]={name:'圣颖',sourceHash:'aedd5fff',partial:true,unimplemented:['对手体力三分之一的基数/读取时点','攻击载荷时点及独立粉固提升叠加'],deferred:['真实再次登场时解除当前双方既有异常与条件免攻，换宠生命周期'],traits:{pinkDamageMultiplier:f=>{const e=active1950(f,'圣颖魂印粉固提升');if(!e)return 1;const skill=active1950(f,'固定百分比增伤');if(!skill)return 1+e.fraction;const q=f.soulState.pinkStack1950;if(!['sum','product'].includes(q))throw Error('Q-4747-002：魂印与技能粉固增伤叠加待确认');return q==='product'?1+e.fraction:(1+e.fraction+skill.fraction)/(1+skill.fraction);}},abilities:{entry:enter1950},hooks:{battleStart:enter1950,roundStart(c){c.a.soulState.frame1950={round:c.round,foeHigh:c.t.hp>c.t.stats.maxHp/2,selfHigh:c.a.hp>c.a.stats.maxHp/2,foeHP:c.t.hp};},beforeUse(c){use1950(c,'before-use');},afterHit(c){use1950(c,'after-hit');},afterUse(c){if(c.actualUsed)use1950(c,'after-use');},beforeIncomingAttack(c){if(c.on(c.a,'圣颖登场免攻')&&!c.attackImmunityIgnored)c.immuneAttack=true;},battlePhaseEnd(c){if(c.a.hp>0&&c.t.hp>0&&c.t.hp<c.t.stats.maxHp/2)c.timed(c.a,'圣颖魂印粉固提升',2,{fraction:c.a.hp<c.a.stats.maxHp/2?1:.5});}}};


function rank1951(f){if(f.moves.length<4)throw Error('1951需要真实前四技能槽');const p=f.moves.slice(0,4).map(k=>f.pp[k]);if(p.some(n=>!Number.isInteger(n)||n<0))throw Error('1951前四技能PP必须非负整数');return p.every(n=>n===0)?0:p[0]*p[3]===p[1]*p[2]?1:2;}
registry[1951]={name:'超算鲁比克',sourceHash:'ee7dc14a',partial:true,unimplemented:['随机PP归零池沿Q-4685-002','死亡战阶恢复资格沿Q-4685-002'],traits:{},abilities:{rank:rank1951},hooks:{beforeDamage(c){if(rank1951(c.a)===2){c.modifier*=2;c.ignoreImmunity=true;}},beforeIncomingAttack(c){if(rank1951(c.a)===1)c.reduction=1-(1-c.reduction)*.5;},beforeHealthDamage(c){if(c.type==='attack'&&!c.ignoreImmunity&&rank1951(c.a)===0){const n=c.amount;c.amount=0;c.immune=true;if(n>0)c.reflect1951(n);}},battlePhaseEnd(c){const rank=rank1951(c.a);(c.a.soulState.matrixPhases1951??=[]).push({round:c.round,rank,pp:c.a.moves.map(k=>c.a.pp[k])});if(c.a.hp<=0){const q=c.a.soulState.lethal1951;if(typeof q!=='boolean')throw Error('Q-4685-002：超算死亡后战阶恢复/归零资格待确认');if(!q)return;}if(rank===0){c.heal(c.a,c.a.stats.maxHp,'超算零秩恢复全部体力','soul');c.restorePP(c.a,Infinity,'soul');}if(rank===1)c.emptyPP1951();}}};


const active1953=(f,k)=>{const e=f.effects[k],r=f.soulState.calculationRound??1;return e&&e.start<=r&&e.end>=r;};
function opponent1953(c,phase){if(c.t.hp<=0||c.m?.kind==='item'||phase==='after-use'&&!c.actualUsed)return;const q=c.a.soulState.timing1953;if(!['before-use','after-use'].includes(q))throw Error('Q-4743-001：肯扎特对手使用技能弱化时点待确认');if(q!==phase)return;if(c.a.hp<=0){const q=c.a.soulState.lethal1953;if(typeof q!=='boolean')throw Error('Q-4685-002：肯扎特死亡后的对手用招载荷资格待确认');if(!q)return;}const before=['def','spe'].map(k=>c.t.stages[k]);c.stage(c.t,-1,['def','spe']);const changed=['def','spe'].map((k,i)=>c.t.stages[k]<before[i]);let success=changed.every(Boolean);if(changed.some(Boolean)&&!success){const p=c.a.soulState.partial1953;if(!['any','all'].includes(p))throw Error('Q-4697-007：双项弱化部分成功是否触发待确认');success=p==='any';}c.a.soulState.trigger1953={round:c.round,before,after:['def','spe'].map(k=>c.t.stages[k]),success};if(success)c.timed(c.a,'肯扎特下轮强化',1,{},c.round+1);else c.a.soulState.failed1953=c.round;}
registry[1953]={name:'对神兵器肯扎特',sourceHash:'2ed83a1d',partial:true,unimplemented:['双向克制/微弱组合条件','实际用招弱化时点与部分成功口径'],traits:{skillPriority:f=>active1953(f,'肯扎特下轮强化')?1:0,ailmentImmune:f=>f.soulState.mutualFrame1953===f.soulState.calculationRound,weaknessImmune:f=>f.soulState.mutualFrame1953===f.soulState.calculationRound,dodgeChance:f=>f.soulState.failed1953===f.soulState.calculationRound?1:0},hooks:{roundStart(c){const own=c.typeEffectiveness1953(c.a.type,c.t.type),other=c.typeEffectiveness1953(c.t.type,c.a.type),a=own>1?1:own<1?-1:0,b=other>1?1:other<1?-1:0;let yes=a!==0&&a===b;if(a*b===-1){const q=c.a.soulState.mutual1953;if(!['matched','any-nonneutral'].includes(q))throw Error('Q-4749-001：双向克制/微弱条件是否包含一强一弱待确认');yes=q==='any-nonneutral';}c.a.soulState.mutualFrame1953=yes?c.round:0;c.a.soulState.affinityFrame1953={round:c.round,own,other,immune:yes};},beforeDamage(c){const n=c.typeEffectiveness1953(c.t.type,c.a.type);if(n>0&&n<1)c.modifier/=n;if(c.on(c.a,'肯扎特下轮强化'))c.modifier*=2;},opponentBeforeUse(c){opponent1953(c,'before-use');},opponentAfterUse(c){opponent1953(c,'after-use');},battlePhaseEnd(c){if(c.t.hp<=0)return;const advantage=c.typeEffectiveness1953(c.a.type,c.t.type)>1,fallback=c.a.soulState.failed1953===c.round;if(!advantage&&!fallback)return;if(c.a.hp<=0){const q=c.a.soulState.lethal1953;if(typeof q!=='boolean')throw Error('Q-4685-002：肯扎特死亡后战阶PP吸取资格待确认');if(!q)return;}if(advantage){c.absorbPP(c.a,c.t,1,'soul');c.heal(c.a,c.a.stats.maxHp/3,'肯扎特克制独立回复','soul');}if(c.a.soulState.failed1953===c.round&&c.clear(c.t))c.clearAilments(c.a);}}};


registry[1954]={name:'云境归真·始祖灵兽',sourceHash:'596c2e69',partial:true,unimplemented:['琼花仙荼分类与同名/中毒效果共存','先回复等量伤害的基数及死亡后资格'],deferred:['存活于真实场下出战背包时替换对手中毒效果','攻击未击败且对手体力不低于回合开始时的真实主动换宠限制'],traits:{},hooks:{roundStart(c){c.a.soulState.frame1954={round:c.round,selfHP:c.a.hp,foeHP:c.t.hp};},afterUse(c){if(!c.actualUsed||!['physical','special'].includes(c.m.kind)||c.t.hp<=0||c.a.soulState.koUse4750===c.round+':'+c.m.id)return;if(c.a.hp<=0){const q=c.a.soulState.lethal1954;if(typeof q!=='boolean')throw Error('Q-4685-002：始祖死后攻击未KO载荷资格待确认');if(!q)return;}if(c.hitEffectsDisabled){const q=c.a.soulState.sealed1954;if(!['independent','suppress'].includes(q))throw Error('Q-4716-003：始祖魂印载荷与命中效果封锁待确认');if(q==='suppress')return;}if(c.t.hp<c.a.soulState.frame1954.foeHP)c.timed(c.a,'必定暴击',2,{});else c.a.soulState.deferredSwitch1954={round:c.round,turns:1,targetSide:c.t.side,sourceHash:'596c2e69'};},battlePhaseEnd(c){if(c.a.hp<=0){const q=c.a.soulState.lethal1954;if(typeof q!=='boolean')throw Error('Q-4685-002：始祖死后战阶载荷资格待确认');if(!q)return;}const frame=c.a.soulState.frame1954;if(c.a.hp>frame.selfHP){c.stage(c.a,1);c.stage(c.a,2,['def','spd']);if(c.a.hp>c.a.stats.maxHp/2&&c.t.hp>0)c.flower1954(c.t,3,'soul','soul:1954:596c2e69');}else{const low=c.a.hp<c.a.stats.maxHp/2,nominal=c.a.stats.maxHp/3*(low?2:1),actual=c.heal(c.a,nominal,'云境战阶回复','soul')??0;if(low&&c.t.hp>0){let n=actual;if(actual!==nominal){const q=c.a.soulState.reply1954;if(!['actual','nominal'].includes(q))throw Error('Q-4706-008：云境先回复等量粉伤基数待确认');if(q==='nominal')n=nominal;}if(n>0)c.hurt(c.t,n,'云境低体等量百分比','percent');}}}}};


function use1956(c,phase){const st=c.a.soulState;if(c.m?.kind==='item'||c.t.hp<=0)return;if(c.a.hp<=0){const q=st.lethal1956;if(typeof q!=='boolean')throw Error('Q-4685-002：镇魂死后实际用招载荷资格待确认');if(!q)return;}const sealed=c.hitEffectsDisabled??st.sealUse1956?.disabled;if(sealed){const q=st.sealed1956;if(!['independent','suppress'].includes(q))throw Error('Q-4716-003：镇魂魂印载荷与命中封锁待确认');if(q==='suppress')return;}const token=c.round+':'+c.m.id+':'+(st.skillUses?.[c.m.id]??0);if(['physical','special'].includes(c.m.kind)){const q=st.frostTiming1956;if(!['before-use','after-hit','after-use'].includes(q))throw Error('Q-4743-001：使用攻击附冻伤时点待确认');if(q===phase&&st.frostUse1956!==token){st.frostUse1956=token;if(c.t.ailments['冻伤']>=c.round)c.t.ailments['冻伤']+=2;else c.ailment(c.t,'冻伤',c.a);}}if(c.on(c.a,'镇魂下轮全技能附粉')){const q=st.payloadTiming1956;if(!['before-use','after-hit','after-use'].includes(q))throw Error('Q-4743-001：下轮所有技能附粉执行时点待确认');if(q===phase&&st.payloadUse1956!==token){st.payloadUse1956=token;c.hurt(c.t,c.t.stats.maxHp,'镇魂下轮全技能百分比','percent');}}}
registry[1956]={name:'镇魂约凡撒',sourceHash:'a34419e4',partial:true,unimplemented:['阶段结束冻伤回合数读取时点','攻击/全技能载荷时点及命中封锁/死亡资格'],traits:{},hooks:{beforeUse(c){c.a.soulState.sealUse1956={round:c.round,move:c.m.id,disabled:c.hitEffectsDisabled};use1956(c,'before-use');},afterHit(c){use1956(c,'after-hit');},afterUse(c){if(c.actualUsed)use1956(c,'after-use');},beforeCrit(c){if(c.on(c.a,'镇魂下轮必暴'))c.forceCrit=true;},battlePhaseEnd(c){if(c.a.hp<=0){const q=c.a.soulState.lethal1956;if(typeof q!=='boolean')throw Error('Q-4685-002：镇魂死后战阶资格待确认');if(!q)return;}const end=c.t.ailments['冻伤']??0,inclusive=Math.max(0,end-c.round+1),after=Math.max(0,end-c.round);let yes=inclusive>=5;if(yes!==(after>=5)){const q=c.a.soulState.frostCount1956;if(!['inclusive','after-round'].includes(q))throw Error('Q-4752-001：战阶结束冻伤5回合是否含当前轮待确认');yes=q==='inclusive';}c.a.soulState.frostPhase1956={round:c.round,end,inclusive,after,qualified:yes};if(yes)c.timed(c.a,'镇魂下轮全技能附粉',1,{},c.round+1);else{c.heal(c.a,c.a.stats.maxHp/3,'镇魂冻伤不足五轮回复','soul');c.timed(c.a,'镇魂下轮必暴',1,{},c.round+1);}}}};


const keys1957=['atk','def','spa','spd','spe','acc'],sum1957=f=>keys1957.reduce((n,k)=>n+f.stages[k],0);
function compare1957(c){const score=(f,p)=>keys1957.reduce((n,k)=>n+(p==='absolute'?Math.abs(f.stages[k]):p==='positive'?Math.max(0,f.stages[k]):f.stages[k]),0),values=Object.fromEntries(['signed','absolute','positive'].map(p=>[p,[score(c.a,p),score(c.t,p)]])),orders=Object.fromEntries(Object.entries(values).map(([p,[a,b]])=>[p,Math.sign(a-b)])),q=c.a.soulState.total1957;if(new Set(Object.values(orders)).size>1&&!Object.hasOwn(orders,q))throw Error('Q-4753-001：能力总级数是否计入负级/绝对级待确认');return {values,orders,model:q??'equivalent',order:orders[q]??orders.signed};}
function high1957(c){if(c.a.soulState.highRound1957!==c.round)return false;if(c.on(c.a,'命运当轮减伤'))return true;const q=c.a.soulState.roundGrant1957;if(!['snapshot','timed'].includes(q))throw Error('Q-4753-004：当回合魂印效果被清后是否仍生效待确认');return q==='snapshot';}
registry[1957]={name:'命运玛酷索',sourceHash:'d8d56ab8',partial:true,unimplemented:['能力总级数口径','负速度等级对应下降值','取消触发条件范围','当回合授予的消除规则'],traits:{},abilities:{high:high1957},hooks:{roundStart(c){for(const f of[c.t,c.a])c.stage(f,-1,['spe']);for(const f of[c.t,c.a])c.stage(f,1,keys1957.filter(k=>k!=='spe'));const frame=compare1957(c);c.a.soulState.frame1957={round:c.round,...frame};let high=frame.order>0,low=frame.order<0,forceFallback=false;if(c.a.soulState.unlocked1957){const q=c.a.soulState.unlockScope1957;if(!['comparisons','comparisons-and-fallback'].includes(q))throw Error('Q-4753-003：取消触发条件是否包含未触发补偿待确认');high=low=true;forceFallback=q==='comparisons-and-fallback';}if(high){c.a.soulState.highRound1957=c.round;c.timed(c.a,'命运当轮减伤',1,{});c.timed(c.t,'命运当轮封属',1,{sourceSide:c.a.side});}if(low){const speed=c.a.stages.spe;let amount=speed;if(speed<0){const q=c.a.soulState.negativeSpeed1957;if(!['absolute','positive-only'].includes(q))throw Error('Q-4753-002：负速度等级如何对应下降量待确认');amount=q==='absolute'?-speed:0;}const before=keys1957.map(k=>c.t.stages[k]);if(amount>0)c.stage(c.t,-amount);const changed=keys1957.map((k,i)=>c.t.stages[k]<before[i]);let success=changed.every(Boolean);if(changed.some(Boolean)&&!success){const q=c.a.soulState.partial1957;if(!['any','all'].includes(q))throw Error('Q-4697-007：全属性下降部分成功判据待确认');success=q==='any';}c.a.soulState.down1957={round:c.round,speed,amount,changed,success};if(!success||forceFallback){c.ailment(c.t,'麻痹',c.a);c.ailment(c.t,'睡眠',c.a);}}},opponentBeforeUse(c){if(c.m.kind!=='status'||c.a.soulState.highRound1957!==c.round||c.on(c.t,'命运当轮封属'))return;const q=c.a.soulState.roundGrant1957;if(!['snapshot','timed'].includes(q))throw Error('Q-4753-004：封属被清后是否仍当回合锁定待确认');if(q==='snapshot')c.timed(c.t,'命运当轮封属',1,{sourceSide:c.a.side});},beforeIncomingAttack(c){if(high1957(c))c.reduction=1-(1-c.reduction)*.5;},battlePhaseEnd(c){if(c.a.hp<=0){const q=c.a.soulState.lethal1957;if(typeof q!=='boolean')throw Error('Q-4685-002：命运死亡后战阶资格待确认');if(!q)return;}if(sum1957(c.a)===36)c.a.soulState.unlocked1957=true;if(sum1957(c.t)===36){c.a.soulState.lost1957={round:c.round,soulId:1957,sourceHash:'d8d56ab8'};c.a.soulId=null;}}}};


const frame1963=c=>{const f=c.a.soulState.attack1963;return f?.round===c.round&&f.move===(c.m.replayRootMoveId??c.m.id)&&f.use===c.a.soulState.skillUses?.[f.move]?f:null;};
registry[1963]={name:'梦魇尼斯克',sourceHash:'e0dc47b6',partial:true,unimplemented:['每1%损失附5点固定伤害的取整顺序','死亡后战阶资格'],traits:{},hooks:{beforeUse(c){c.a.soulState.attack1963={round:c.round,move:c.m.replayRootMoveId??c.m.id,use:c.a.soulState.skillUses?.[c.m.replayRootMoveId??c.m.id],armed:['physical','special'].includes(c.m.kind),positive:Object.values(c.a.stages).some(n=>n>0),targetAbnormal:conditionStatusRules.conditionPresent(c.t,c.round)};},beforeCrit(c){const f=frame1963(c);if(f?.armed&&f.positive)c.forceCrit=true;},beforeDamage(c){const f=frame1963(c);if(f?.armed&&f.targetAbnormal)c.modifier*=2;},battlePhaseEnd(c){if(c.a.hp<=0){const q=c.a.soulState.lethal1963;if(typeof q!=='boolean')throw Error('Q-4685-002：梦魇死后战阶伤害资格待确认');if(!q)return;}const lost=c.a.stats.maxHp-c.a.hp,step=Math.floor(lost*100/c.a.stats.maxHp)*5,continuous=Math.floor(lost*500/c.a.stats.maxHp);let n=step;if(step!==continuous){const q=c.a.soulState.rounding1963;if(!['floor-step','continuous'].includes(q))throw Error('Q-4755-001：每损失1%附5伤害的取整顺序待确认');if(q==='continuous')n=continuous;}c.a.soulState.phase1963={round:c.round,lost,step,continuous,amount:n};if(c.t.hp>0&&n>0)c.hurt(c.t,n,'梦魇缺失体力固定追加','fixed');if(c.t.hp<c.a.hp)c.heal(c.a,c.a.stats.maxHp,'梦魇附伤后体力优势回满','soul');}}};


const comparisonPetEffects1972=[{"id":1027,"name":"瞬杀","desc":"进攻类技能有3%几率秒杀对方","effect":{"effect_args":[3,0],"effect":{"id":32,"url":"https://api.seerapi.com/v1/eid_effect/32"}},"effect_alias":"32_3_0","star_level":0,"effect_group":{"id":21,"url":"https://api.seerapi.com/v1/pet_effect_group/21"},"hash":"7015ff6e","source":{"url":"https://api.seerapi.com/v1/pet_effect/1027","revision":"7015ff6e","loadedAt":"2026-10-30T07:57:29.805Z","listUrl":"https://api.seerapi.com/v1/pet_effect?name=%E7%9E%AC%E6%9D%80&limit=100&expand=true"}},{"id":1413,"name":"瞬杀","desc":"进攻类技能有3.5%几率秒杀对方","effect":{"effect_args":[13,0],"effect":{"id":151,"url":"https://api.seerapi.com/v1/eid_effect/151"}},"effect_alias":"151_13_0","star_level":1,"effect_group":{"id":21,"url":"https://api.seerapi.com/v1/pet_effect_group/21"},"hash":"34075c73","source":{"url":"https://api.seerapi.com/v1/pet_effect/1413","revision":"34075c73","loadedAt":"2026-10-30T07:57:29.805Z","listUrl":"https://api.seerapi.com/v1/pet_effect?name=%E7%9E%AC%E6%9D%80&limit=100&expand=true"}},{"id":1414,"name":"瞬杀","desc":"进攻类技能有4.0%几率秒杀对方","effect":{"effect_args":[15,0],"effect":{"id":151,"url":"https://api.seerapi.com/v1/eid_effect/151"}},"effect_alias":"151_15_0","star_level":2,"effect_group":{"id":21,"url":"https://api.seerapi.com/v1/pet_effect_group/21"},"hash":"e4884671","source":{"url":"https://api.seerapi.com/v1/pet_effect/1414","revision":"e4884671","loadedAt":"2026-10-30T07:57:29.805Z","listUrl":"https://api.seerapi.com/v1/pet_effect?name=%E7%9E%AC%E6%9D%80&limit=100&expand=true"}},{"id":1415,"name":"瞬杀","desc":"进攻类技能有5.0%几率秒杀对方","effect":{"effect_args":[20,0],"effect":{"id":151,"url":"https://api.seerapi.com/v1/eid_effect/151"}},"effect_alias":"151_20_0","star_level":3,"effect_group":{"id":21,"url":"https://api.seerapi.com/v1/pet_effect_group/21"},"hash":"ef0ddc2f","source":{"url":"https://api.seerapi.com/v1/pet_effect/1415","revision":"ef0ddc2f","loadedAt":"2026-10-30T07:57:29.805Z","listUrl":"https://api.seerapi.com/v1/pet_effect?name=%E7%9E%AC%E6%9D%80&limit=100&expand=true"}},{"id":2121,"name":"瞬杀","desc":"进攻类技能有6.0%几率秒杀对方","effect":{"effect_args":[25,0],"effect":{"id":151,"url":"https://api.seerapi.com/v1/eid_effect/151"}},"effect_alias":"151_25_0","star_level":4,"effect_group":{"id":21,"url":"https://api.seerapi.com/v1/pet_effect_group/21"},"hash":"f62067a1","source":{"url":"https://api.seerapi.com/v1/pet_effect/2121","revision":"f62067a1","loadedAt":"2026-10-30T07:57:29.805Z","listUrl":"https://api.seerapi.com/v1/pet_effect?name=%E7%9E%AC%E6%9D%80&limit=100&expand=true"}},{"id":2122,"name":"瞬杀","desc":"进攻类技能有7.0%几率秒杀对方","effect":{"effect_args":[30,0],"effect":{"id":151,"url":"https://api.seerapi.com/v1/eid_effect/151"}},"effect_alias":"151_30_0","star_level":5,"effect_group":{"id":21,"url":"https://api.seerapi.com/v1/pet_effect_group/21"},"hash":"4f4e0514","source":{"url":"https://api.seerapi.com/v1/pet_effect/2122","revision":"4f4e0514","loadedAt":"2026-10-30T07:57:29.805Z","listUrl":"https://api.seerapi.com/v1/pet_effect?name=%E7%9E%AC%E6%9D%80&limit=100&expand=true"}}];
function dreamState1972(f){return f.soulState.dream1972??={crisis:1,flower:null,hope:false,destroyed:false};}
function dreamEntry1972(c){const st=c.a.soulState;st.entries1972??=[];const previous=st.entries1972.filter(x=>x.round===c.round);if(previous.length){const q=st.entryRepeat1972;if(!['refresh','independent'].includes(q))throw Error('Q-4761-001：同轮再次触发登场的回复判定是否独立待确认');if(q==='refresh')st.entries1972=st.entries1972.filter(x=>x.round!==c.round);}st.entries1972.push({round:c.round,immune:false,ambiguous:[]});c.a.effects['琉梦登场反弹']={start:c.round,end:c.round,dream1972:true};}
registry[1972]={name:'琉梦',sourceHash:'1286a2d9',partial:true,unimplemented:['真实全队希望/危机感共享与后续出场','同轮登场重触发共存','希望首次进入异常边界','魔王咒怨概率和伤害下限边界'],traits:{skillPriority:f=>f.soulState.priority1972?.round===f.soulState.calculationRound?1:0},abilities:{state:dreamState1972,entry:dreamEntry1972,configureComparison(f,refs){if(!Array.isArray(refs)||new Set(refs.map(x=>x.id)).size!==refs.length)throw Error('通用特性条件研究来源列表无效');f.soulState.comparisonPetEffects1972=refs.map(ref=>{const found=comparisonPetEffects1972.find(x=>x.id===ref.id&&x.hash===ref.hash);if(!found)throw Error('通用瞬杀特性ID/hash未核实');return {...found,comparisonOnly:true};});},
  phase(c){for(const e of c.a.soulState.entries1972??[]){if(e.round!==c.round)continue;let immune=e.immune;if(!immune&&e.ambiguous.length){const q=c.a.soulState.entryResistance1972;if(!['immunity-only','all-resistance'].includes(q))throw Error('Q-4761-002：登场补偿的抗性抵抗是否计免疫待确认');immune=q==='all-resistance';}if(!immune)c.heal(c.a,c.a.stats.maxHp/3,'琉梦未免疫登场补偿','soul');}c.a.soulState.entries1972=(c.a.soulState.entries1972??[]).filter(x=>x.round>c.round);},
  grow(c){const d=c.a.soulState.dream1972;if(d?.flower!=null&&!d.destroyed&&!d.hope){d.flower=Math.min(100,d.flower+2*d.crisis);if(d.flower===100){d.flower=null;d.hope=true;}}},
  entered(c){const d=c.a.soulState.dream1972;if(!d?.hope||c.a.soulState.hopeClearRound1972===c.round)return;let qualifies=!c.hadAny;if(!qualifies){const q=c.a.soulState.enteredStatus1972;if(!['new-name','from-none','any-applied'].includes(q))throw Error('Q-4761-003：希望首次进入异常的同名刷新及已有其他异常待确认');qualifies=q==='any-applied'||q==='new-name'&&!c.hadSame;}if(qualifies){c.a.soulState.hopeClearRound1972=c.round;c.clear(c.t);}},
  curseOutgoing(c){const n=c.a.soulState.magicCurse1973??0;if(!n)return;c.modifier*=1+n*.05;const q=c.a.soulState.curseProbability1973;if(n>1&&!['linear','independent'].includes(q))throw Error('Q-4761-004：多层魔王咒怨3%概率叠加待确认');const chance=q==='independent'?1-Math.pow(.97,n):Math.min(1,n*.03);if(c.random()<chance){const scope=c.a.soulState.curseMinimum1973;if(!['before-flat-reductions','after-flat-reductions'].includes(scope))throw Error('Q-4761-005：魔王咒怨最大体力最低伤害适用结算位置待确认');c.minimumDamage=Math.max(c.minimumDamage??0,c.t.stats.maxHp);c.magicMinimumAfter1973=scope==='after-flat-reductions';}},
  curseIncoming(c){const n=c.a.soulState.magicCurse1973??0;if(n)c.reduction=1-(1-c.reduction)*Math.max(0,1-n*.05);}
},hooks:{battleStart(c){const d=dreamState1972(c.a);d.flower=0;const text=c.opponentSoulText1972??'',n=(c.t.soulId!==1972&&text.includes('秒杀')?1:0)+(c.t.soulState.comparisonPetEffects1972??[]).filter(x=>x.desc.includes('秒杀')).length;if(n>1){const q=c.a.soulState.crisisCount1972;if(!['per-trait','per-pet'].includes(q))throw Error('Q-4761-008：同只对手魂印和通用特性均含秒杀时危机计数待确认');d.crisis+=q==='per-pet'?1:n;}else d.crisis+=n;dreamEntry1972(c);},roundStart(c){const own=c.affinity(c.a.type,c.t.type),foe=c.affinity(c.t.type,c.a.type);c.a.soulState.reduction1972={round:c.round,active:foe>1};c.a.soulState.priority1972={round:c.round,active:own>1};if(own>1)c.restorePP(c.a,1,'soul');if(own<=1)delete c.a.soulState.priority1972;},beforeIncomingAttack(c){if(c.a.soulState.reduction1972?.round===c.round&&c.a.soulState.reduction1972.active)c.reduction=1-(1-c.reduction)*.5;},battlePhaseEnd(c){if(c.a.hp<=0){const q=c.a.soulState.lethal1972;if(typeof q!=='boolean')throw Error('Q-4685-002：琉梦死后登场回复资格待确认');if(!q)return;}registry[1972].abilities.phase(c);}}};


function useShield1973(c){if(c.a.hp<=0)return;const st=c.a.soulState;if(c.a.hp===c.a.stats.maxHp){c.clear(c.t);c.clearBoost(c.t);}else{const n=Math.floor((c.a.stats.maxHp-c.a.hp)/2);c.refreshShield(c.a,n,'soul1973/6ebfeebe');c.refreshBarrier(c.a,n,'soul1973/6ebfeebe');const old=st.shieldHeal1973;st.shieldHeal1973={round:c.round,grants:old?.round===c.round?old.grants+1:1};}}
registry[1973]={name:'湮灭之主·咤克斯',sourceHash:'6ebfeebe',partial:true,unimplemented:['跨精灵出战背包秒杀替换/初始全队瞬杀扫描','真实下场保留咒怨','对手使用技能触发时序','多次授盾后的阶段回复次数','立即重生与被击败载荷资格'],traits:{},abilities:{used:useShield1973,kill(c){for(const k of ['maxHp','atk','def','spa','spd','spe'])c.a.stats[k]+=35;c.a.soulState.magicCurse1973=(c.a.soulState.magicCurse1973??0)+2;c.a.soulState.killCount1973=(c.a.soulState.killCount1973??0)+1;},died(c){const before=c.t.stats.maxHp,amount=c.reduceMaxHp(c.t,before*.35,'咤克斯被击败体力上限削减');(c.a.soulState.deathEvents1973??=[]).push({round:c.round,before,amount,after:c.t.stats.maxHp});}},hooks:{battleStart(c){c.a.soulState.magicCurse1973=(c.t.soulState.comparisonPetEffects1972??[]).some(x=>x.name==='瞬杀')?1:0;},opponentBeforeUse(c){const q=c.a.soulState.useTiming1973;if(!['before','after'].includes(q))throw Error('Q-4762-007：咤克斯对手使用时清除/授盾的实际时点待确认');if(q==='before')useShield1973(c);},opponentAfterUse(c){if(c.actualUsed&&c.a.soulState.useTiming1973==='after')useShield1973(c);},battlePhaseEnd(c){const e=c.a.soulState.shieldHeal1973;if(c.a.hp<=0||e?.round!==c.round)return;let count=1;if(e.grants>1){const q=c.a.soulState.shieldHealCount1973;if(!['once','per-grant'].includes(q))throw Error('Q-4762-001：本轮多次授盾的阶段回复次数待确认');if(q==='per-grant')count=e.grants;}const amount=c.shieldValue(c.a)+(c.a.suitState.barrier??0);for(let i=0;i<count;i++)c.heal(c.a,amount,'咤克斯战阶现有护盾护罩之和','soul');delete c.a.soulState.shieldHeal1973;},death(c){registry[1973].abilities.died(c);}}};


registry[1974]={name:'魇魔',sourceHash:'1ab671f2',partial:true,unimplemented:['2243立即重生前被击败载荷资格'],traits:{},abilities:{died(c){const applied=c.ailment(c.t,'害怕',c.a,false,false,null,{probabilityPercent:100});if(!applied)c.clear(c.t);(c.a.soulState.deathEvents1974??=[]).push({round:c.round,applied});}},hooks:{roundStart(c){if(!conditionStatusRules.conditionPresent(c.t,c.round))return;c.restorePP(c.a,Infinity,'soul');const keys=c.fifthKeys1974(c.t);if(!c.ppReductionBlocked(c.t))for(const k of keys)c.t.pp[k]=0;if(keys.length&&keys.every(k=>c.t.pp[k]===0))c.ailment(c.t,'害怕',c.a);},death(c){registry[1974].abilities.died(c);}}};


const leiState1966=f=>f.soulState.lei1966??={sourceHash:'ea01fd9',stars:[],connections:[],last:null};
const leiActive1966=(f,r=f.soulState?.calculationRound??f.soulState?.availableRound??1)=>{const a=f.soulState?.lei1966?.awake;return !!a&&a.start<=r&&a.end>=r;};
function resetLei1966(f){const st=leiState1966(f);st.stars=[];st.connections=[];st.last=null;delete st.pending;}
function liveLei1966(c){if(c.a.hp>0)return true;const q=c.a.soulState.lethal1966;if(typeof q!=='boolean')throw Error('Q-4685-002：1966死后点亮/觉醒结算资格待确认');return q;}
function crownedLei1966(c){const slot=c.a.moves.indexOf(c.m.replayRootMoveId??c.m.id);if(slot<0||slot>3||c.a.soulState.lei1966?.stars.includes(slot)||!c.m.name.startsWith('雷'))return -1;if(!c.m.name.startsWith('雷·')){const q=c.a.soulState.crowned1966;if(!['prefix-dot','starts-lei'].includes(q))throw Error('Q-4765-002：以雷冠名是否包括雷祭/雷电击等原本名称待确认');if(q==='prefix-dot')return -1;}return slot;}
function lightLei1966(c){const slot=crownedLei1966(c);if(slot<0||!liveLei1966(c))return;const st=leiState1966(c.a),token=c.round+':'+c.m.id+':'+(c.a.soulState.skillUses?.[c.m.replayRootMoveId??c.m.id]??0);if(st.lastUse===token||st.stars.includes(slot))return;st.lastUse=token;if(st.last!==null)st.connections.push([st.last,slot]);st.stars.push(slot);st.last=slot;c.ailment(c.t,'麻痹',c.a);if(!liveLei1966(c))return;c.restorePP(c.a,1,'soul');if(st.stars.length!==4)return;const paths=c.a.soulState.leiPaths1966;if(!Array.isArray(paths)||paths.some(p=>!Array.isArray(p)||p.length!==4||new Set(p).size!==4||p.some(n=>!Number.isInteger(n)||n<0||n>3)))throw Error('Q-4765-001：ㄣ形有效点亮顺序未核实，必须提供显式研究路径集合');const good=paths.some(p=>p.every((n,i)=>n===st.stars[i]));if(good)st.pending={round:c.round,kind:'awake'};else{const q=c.a.soulState.badShapeTiming1966;if(!['immediate','round-end'].includes(q))throw Error('Q-4765-003：非ㄣ形回满和重置在点亮时或回合结束时待确认');if(q==='immediate'){c.heal(c.a,c.a.stats.maxHp,'雷辰错误形状回满','soul');resetLei1966(c.a);}else st.pending={round:c.round,kind:'bad'};}}
registry[1966]={name:'怒雷神裁·雷伊',sourceHash:'ea01fd9',partial:true,unimplemented:['ㄣ形确切顺序','冠名范围','点亮及错误形状结算时点','觉醒技能吸血基数与范围','命中效果强制生效的免疫边界'],traits:{skillPriority:f=>f.soulState.leiParalysisRound1966===f.soulState.calculationRound?1:0},abilities:{active:leiActive1966,count:f=>f.soulState.lei1966?.stars.length??0,
 trait(f,key,value){if(!leiActive1966(f))return value;if(['ailmentImmune','weaknessImmune','ignorePP','skillAlwaysHit'].includes(key))return true;if(key==='skillPriority')return(value??0)+1;return value;},
 light:lightLei1966,
 end(c){const st=c.a.soulState.lei1966;if(!st)return;if(st.awake?.end===c.round&&!st.awake.resetDone){resetLei1966(c.a);st.awake.resetDone=true;}const pending=st.pending;if(pending?.round!==c.round)return;delete st.pending;if(!liveLei1966(c))return;if(pending.kind==='bad'){c.heal(c.a,c.a.stats.maxHp,'雷辰错误形状回合末回满','soul');resetLei1966(c.a);return;}c.clearAilments(c.a);c.clearNegative(c.a);st.awake={start:c.round+1,end:c.round+3,sourceHash:'ea01fd9'};},
 damage(c){if(!leiActive1966(c.a,c.round)||c.origin1966!=='skill'||c.a.hp<=0)return;const scope=c.a.soulState.awakeHealScope1966;if(c.type!=='attack'){if(!['red-only','all-skill'].includes(scope))throw Error('Q-4765-005：觉醒吸血是否包含非红技能伤害待确认');if(scope==='red-only')return;}const full=c.settledDamage??c.dealt,loss=c.hpLoss??c.dealt;let n=loss;if(full!==loss){const q=c.a.soulState.awakeHealBasis1966;if(!['settled','hp-loss'].includes(q))throw Error('Q-4765-005：觉醒吸血按完整结算伤害或实际HP减少待确认');if(q==='settled')n=full;}if(n>0)c.heal(c.a,n,'觉醒技能伤害额外回复','soul');}
},hooks:{battleStart(c){leiState1966(c.a);},roundStart(c){const st=leiState1966(c.a);if(st.awake?.end<c.round){if(!st.awake.resetDone)resetLei1966(c.a);delete st.awake;}if(c.a.ailments['麻痹']>=c.round){c.clearAilment(c.a,'麻痹');if(!(c.a.ailments['麻痹']>=c.round))c.a.soulState.leiParalysisRound1966=c.round;}},beforeUse(c){if(!c.m||c.m.kind==='item'||crownedLei1966(c)<0)return;const q=c.a.soulState.pointTiming1966;if(!['before','after'].includes(q))throw Error('Q-4765-004：点亮相对本招技能效果时点待确认');if(q==='before')lightLei1966(c);},afterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.soulState.pointTiming1966==='after')lightLei1966(c);}}};


const forward1967=['blood','evil','sky','blood'];
function state1967(f){return f.soulState.wudao1967;}
function live1967(c){if(c.a.hp>0)return true;const q=c.a.soulState.lethal1967;if(typeof q!=='boolean')throw Error('Q-4685-002：1967死后武道/附伤/反馈载荷资格待确认');return q;}
function evolve1967(c){const st=state1967(c.a);if(!st||st.closed)return false;if(st.nextBoost){const n=st.nextBoost;st.nextBoost=0;c.stage(c.a,n);}if(st.index+1>=st.sequence.length){st.closed=true;return true;}st.index++;if(st.index===st.sequence.length-1)c.restorePP(c.a,Infinity,'soul');return true;}
function phase1967(f){const st=state1967(f);return st&&!st.closed?st.sequence[st.index]:null;}
function use1967(c,when){const q=c.a.soulState.usePhase1967;if(!['before','after'].includes(q))throw Error('Q-4766-005：1967使用技能附伤的伤前或伤后时点待确认');if(q!==when||c.m.kind==='item'||!live1967(c))return;const n=c.t.stats.maxHp/6*(phase1967(c.a)==='evil'?2:1);if(c.t.hp>0)c.hurt(c.t,n,'武道技能使用附加','percent');}
function heal1967(c,when){const q=c.a.soulState.healPhase1967;if(!['round-end','battle-phase-end'].includes(q))throw Error('Q-4766-006：1967战斗阶段结束与格式化回合结束的字段差异待确认');if(q===when&&c.a.hp>0)c.heal(c.a,c.a.stats.maxHp/6*(phase1967(c.a)==='blood'?2:1),'武道结束恢复','soul');}
function qualify1967(c){const st=state1967(c.a);if(!st||st.closed)return false;const p=phase1967(c.a);return p==='blood'?st.fieldRounds<=10:p==='evil'?c.round-(c.t.soulState.enteredRound??1)+1>2:!c.crit;}
function incoming1967(c){const st=state1967(c.a);if(!st||st.closed)return;const unit=c.a.soulState.triggerUnit1967;if(!['segment','action'].includes(unit))throw Error('Q-4766-003：武道抵挡/衍化按攻击每段或整次技能待确认');const token=c.round+':'+c.m.id+':'+c.t.side+':'+(c.t.soulState.skillUses?.[c.m.id]??0);let event=st.incoming;if(unit==='segment'||event?.token!==token){event=st.incoming={token,round:c.round,move:c.m.id,qualified:qualify1967(c),direction:st.direction,total:0,triggered:false};}if(event.qualified&&event.direction==='forward')c.immuneAttack=true;}
function blocked1967(c){const st=state1967(c.a),e=st?.incoming;if(!e||e.round!==c.round||e.move!==c.m.id||!e.qualified||e.direction!=='forward'||c.amount<=0)return;st.blocked+=c.amount;e.triggered=true;if(c.a.soulState.triggerUnit1967==='segment')evolve1967(c);}
function reflected1967(c){if(c.type&&c.type!=='attack')return;const st=state1967(c.a),e=st?.incoming;if(!e||e.round!==c.round||e.move!==c.m.id||!e.qualified||e.direction!=='reverse')return;const full=c.settledDamage??c.dealt,loss=c.hpLoss??c.dealt;let n=loss;if(full!==loss){const q=c.a.soulState.reflectBasis1967;if(!['settled','hp-loss'].includes(q))throw Error('Q-4766-004：逆轨迹百分比反弹伤害基数待确认');if(q==='settled')n=full;}if(full<=0)return;e.triggered=true;if(c.a.soulState.triggerUnit1967==='segment'){if(live1967(c)){if(n>0&&c.t.hp>0)c.hurt(c.t,n,'逆转武道攻击反馈','percent');evolve1967(c);}}else e.total+=n;}
registry[1967]={name:'灭战神决·盖亚',sourceHash:'86c26636',partial:true,unimplemented:['逆转/复原的轨迹位置语义','每段或整招衍化','反弹基数','API自身结束时点字段差异','真实再入场累计计时'],traits:{},abilities:{phase:phase1967,evolve:evolve1967,skillCritical(c){if(Number(c.a.number)===4766&&c.qualifiedCrit1748(c.crit,c.settledDamage??c.dealt))c.a.soulState.criticalRound1967=c.round;},endSkills(c){const e=c.a.soulState.pending1748;if(e?.round!==c.round)return;delete c.a.soulState.pending1748;if(c.a.hp>0&&c.a.soulState.criticalRound1967!==c.round)c.timed(c.a,'必定暴击',e.turns,{},c.round+1);}},hooks:{battleStart(c){c.a.soulState.wudao1967={sourceHash:'86c26636',sequence:[...forward1967],index:0,direction:'forward',closed:false,fieldRounds:0,blocked:0};},roundStart(c){const st=state1967(c.a);if(st&&st.countedRound!==c.round){st.countedRound=c.round;st.fieldRounds++;}},beforeDamage(c){c.modifier*=1+.5*(phase1967(c.a)==='sky'?2:1);},beforeIncomingAttack:incoming1967,attackImmunityApplied:blocked1967,damageTaken:reflected1967,beforeUse(c){use1967(c,'before');},afterUse(c){if(c.actualUsed)use1967(c,'after');},opponentAfterUse(c){const st=state1967(c.a),e=st?.incoming;if(c.a.soulState.triggerUnit1967!=='action'||e?.round!==c.round||e.move!==c.m.id||!e.triggered||e.done)return;e.done=true;if(!live1967(c))return;if(e.direction==='reverse'&&e.total>0&&c.t.hp>0)c.hurt(c.t,e.total,'逆转武道整招反馈','percent');evolve1967(c);},roundEnd(c){heal1967(c,'round-end');},battlePhaseEnd(c){heal1967(c,'battle-phase-end');}}};


registry[1977]={name:'布贝巴拉',sourceHash:'480fc859',partial:true,unimplemented:['吸取回复后自身死亡的后续载荷资格'],traits:{},hooks:{roundStart(c){if(c.a.ailments['疲惫']>=c.round){c.timed(c.a,'攻击伤害免疫',1,{});c.timed(c.t,'statusBlock',1,{});}},beforeUse(c){if(!['physical','special'].includes(c.m.kind))return;const token=c.round+':'+c.m.id+':'+(c.a.soulState.skillUses?.[c.m.id]??0);if(c.a.soulState.use1977===token)return;c.a.soulState.use1977=token;if(!conditionStatusRules.conditionPresent(c.t,c.round)){c.timed(c.a,'布贝当回合攻击提升',1,{bonus:.5});return;}const n=c.t.stats.maxHp/3;if(c.t.hp>0)c.hurt(c.t,n,'布贝有异常目标理论吸取','percent');c.heal(c.a,n,'布贝理论比例吸取回复','soul');if(c.a.hp<=0){const q=c.a.soulState.lethal1977;if(typeof q!=='boolean')throw Error('Q-4685-002：布贝吸取后自身死亡是否继续附疲惫待确认');if(!q)return;}if(c.t.hp>0)c.ailment(c.t,'疲惫',c.a);}}};


function state1982(f){return f.soulState.ming1982??=( {drainPercent:1,power:0} );}
function crisis1982(f){return f.soulState.crisis1982??1;}
function reverse1982(c,f){const values=Object.fromEntries(Object.entries(f.stages).filter(([,v])=>v>0).map(([k,v])=>[k,-v]));return c.rewriteStageValues(f,values,'reverse');}
registry[1982]={name:'铭唤',sourceHash:'926df70b',traits:{},partial:true,unimplemented:['真实出入场痴愚全队资格、场下PP、阵亡精灵消逝及危机感队伍共享生命周期'],abilities:{factor(a,t,type){if(a===t||!a.soulState.chiyu1982||Number(t.number)!==4785||!['attack','fixed','percent'].includes(type))return 1;const crisis=crisis1982(a);if(crisis>7){const q=a.soulState.crisisOverflow1982;if(!['floor','signed'].includes(q))throw Error('Q-4785-001：危机感超过7点后的减伤下限待确认');if(q==='signed')return .3+.1*crisis;}return Math.min(1,.3+.1*crisis);},crisis:crisis1982},hooks:{battleStart(c){state1982(c.a);c.a.soulState.crisis1982??=1;c.t.soulState.crisis1982??=1;if(!c.t.soulState.chiyu1982)c.t.soulState.chiyu1982={sourceSide:c.a.side};},roundStart(c){const st=state1982(c.a);if(c.t.hp<=0&&c.t.soulState.chiyu1982){const n=c.t.soulState.crisisGained1982??0;st.drainPercent=1;st.power+=Math.min(60,10*n);c.t.soulState.crisis1982=crisis1982(c.t)-n;c.t.soulState.crisisGained1982=0;c.t.stats.maxHp=0;c.t.hp=0;c.t.soulState.disappeared1982=true;}},roundEnd(c){if(c.a.hp<=0)return;if(c.t.hp>0&&c.t.soulState.chiyu1982){const st=state1982(c.a),n=c.t.stats.maxHp*st.drainPercent/100;c.hurt(c.t,n,'铭唤痴愚汲取','true');c.heal(c.a,n,'铭唤痴愚汲取回复','soul');if(c.a.hp<=0){const q=c.a.soulState.lethal1982;if(typeof q!=='boolean')throw Error('Q-4685-002：1982汲取回复后死亡的翻倍与危机载荷待确认');if(!q)return;}st.drainPercent*=2;c.t.soulState.crisis1982=crisis1982(c.t)+1;c.t.soulState.crisisGained1982=(c.t.soulState.crisisGained1982??0)+1;}},afterRoundEnd(c){if(c.a.soulState.chiyu1982&&c.a.hp>0&&c.random()*100<crisis1982(c.a)*5){delete c.a.soulState.chiyu1982;reverse1982(c,c.a);reverse1982(c,c.t);}}}};


registry[1982].abilities.release=registry[1982].hooks.afterRoundEnd;delete registry[1982].hooks.afterRoundEnd;

function reply1983(c){const before=c.a.hp,missing=c.a.stats.maxHp-before,requested=c.a.stats.maxHp,healed=c.heal(c.a,requested,'钢牙鲨回满','soul')??0,mode=c.a.soulState.fullReply1983;if(!['net-hp','healed','missing-before','requested-max'].includes(mode))throw Error('Q-4780-002：1983恢复全部体力后恢复量粉伤基数待确认');const n=mode==='net-hp'?Math.max(0,c.a.hp-before):mode==='healed'?healed:mode==='missing-before'?missing:requested;if(before>0&&c.a.hp<=0){const q=c.a.soulState.lethal1983;if(typeof q!=='boolean')throw Error('Q-4685-002：1983回复触发死亡后附伤资格待确认');if(!q)return;}c.hurt(c.t,n,'钢牙鲨回满等量附伤','percent');}
registry[1983]={name:'机械钢牙鲨',sourceHash:'eb66af3d',traits:{},partial:true,unimplemented:['双易燃自耗死亡后第二分支资格','回满恢复量附伤沿Q4780-002'],hooks:{roundStart(c){if(c.a.ailments['流血']>=c.round){c.ailment(c.t,'易燃',c.a);c.ailment(c.t,'中毒',c.a);}},afterUse(c){if(!c.actualUsed||!['physical','special'].includes(c.m.kind))return;if(c.a.hp<=0){const q=c.a.soulState.lethal1983;if(typeof q!=='boolean')throw Error('Q-4685-002：1983技能阶段先死亡后的魂印载荷资格待确认');if(!q)return;}const token=c.round+':'+c.m.id+':'+(c.a.soulState.skillUses?.[c.m.id]??0);if(c.a.soulState.used1983===token)return;c.a.soulState.used1983=token;const self=c.a.ailments['易燃']>=c.round,foe=c.t.ailments['易燃']>=c.round;if(self){c.hurt(c.a,c.a.hp,'钢牙鲨全部体力消耗','direct',true);c.hurt(c.t,c.a.stats.maxHp,'钢牙鲨自耗最大体力附伤','true');}if(foe){if(c.a.hp<=0){const q=c.a.soulState.lethalSecond1983;if(typeof q!=='boolean')throw Error('Q-4685-002：1983自耗死亡后第二回满附伤分支资格待确认');if(!q)return;}reply1983(c);}}}};


function computeStart1987(c){const e=c.a.soulState.compute1987;if(!e||c.a.hp<=0)return;let funded=e.points>=50;if(!funded){const q=c.a.soulState.computeFunding1987;if(!['require-full','spend-remaining'].includes(q))throw Error('Q-4797-002：不足50算力时是否触发乱流待确认');funded=q==='spend-remaining'&&e.points>0;}if(funded){e.points=Math.max(0,e.points-50);e.turbulenceRound=c.round;}
 const catalog=typeof module==='object'&&module.exports?require('./characteristic-catalog.js'):globalThis.BattleCharacteristicCatalog;
 const own=catalog.normalize(c.a.build?.characteristic),foe=catalog.normalize(c.t.build?.characteristic);if(!own.groupId||own.groupId!==foe.groupId||![20,21,22].includes(own.groupId))return;
 const mode=c.a.soulState.computeResonance1987,current=c.a.soulState.temporaryCurrent1987;if(!['once-per-entry','refresh-base','stack-current'].includes(mode))throw Error('Q-4797-003：重复共振临时上限规则待确认');if(!['cap-only','add-direct','as-heal'].includes(current))throw Error('Q-4797-004：临时上限是否增加当前体力待确认');e.limited=false;if(e.resonated&&mode==='once-per-entry')return;
 const old=e.hpBonus??0,base=c.a.stats.maxHp-old,newBonus=mode==='stack-current'?old+Math.floor(c.a.stats.maxHp*.1):Math.floor(base*.1),delta=newBonus-old;e.hpBonus=newBonus;e.resonated=true;c.a.stats.maxHp+=delta;if(delta>0&&current==='add-direct')c.a.hp=Math.min(c.a.stats.maxHp,c.a.hp+delta);if(delta>0&&current==='as-heal')c.heal(c.a,delta,'算力共振临时体力','soul');c.a.hp=Math.min(c.a.hp,c.a.stats.maxHp);
}

function computeEnd1987(c){
 const state=c.a.soulState.compute1987;if(!state||c.a.hp<=0)return;
 let chance=.2;
 if(state.turbulenceRound===c.round){const scope=c.a.soulState.computeScope1987;if(!['pet-only','soul-and-pet'].includes(scope))throw Error('Q-4797-001：算力乱流是否包含魂印概率待确认');if(scope==='soul-and-pet')chance=1;}
 const rolls=Array.from({length:5},()=>c.random()<chance);state.lastEndRolls=rolls;
 if(rolls[0])c.clearAilments(c.a);
 if(rolls[1])c.restorePP(c.a,1);
 if(rolls[2]&&!c.ppReductionBlocked(c.t))for(const key of c.t.moves)c.t.pp[key]=Math.max(0,c.t.pp[key]-1);
 if(rolls[3])c.stage(c.a,1);
 if(rolls[4]){const basis=c.a.soulState.computeHealBasis1987;if(!['actual','nominal'].includes(basis))throw Error('Q-4706-008：200回复后等量固定伤害基数待确认');const healed=c.heal(c.a,200,'算力回合末回复','soul')??0;if(c.a.hp<=0){const q=c.a.soulState.computePosthumous1987;if(typeof q!=='boolean')throw Error('Q-4685-002：回复后死亡的附伤资格待确认');if(!q)return;}c.hurt(c.t,basis==='actual'?healed:200,'算力回合末等量附伤','fixed');}
 if(!rolls.some(Boolean))state.points+=20;
}
registry[1987]={name:'极渊DS-001',sourceHash:'cdaba0e1',traits:{},partial:true,unimplemented:['算力乱流支付及共振临时体力语义待审核','出入场生命周期第二阶段'],hooks:{battleStart(c){c.a.soulState.compute1987={points:100,limited:true,turbulenceRound:null};},roundStart:computeStart1987,roundEnd:computeEnd1987}};

registry[1988]={name:'霸颚鲛',sourceHash:'a85b5549',traits:{},partial:true,unimplemented:['普通与格式化描述先手触发范围差异'],hooks:{roundStart(c){c.stage(c.a,2,['atk','spe']);c.a.soulState.boostReaction1988=c.round;},boostRemoved(c){if(c.a.soulState.boostReaction1988===c.round&&['clear','steal'].includes(c.method)){if(c.a.hp<=0){const q=c.a.soulState.lethal1988;if(typeof q!=='boolean')throw Error('Q-4685-002：清强反应死亡资格待确认');if(!q)return;}c.ailment(c.t,'流血',c.a);c.ailment(c.t,'冻伤',c.a);}},beforeUse(c){if(c.a.side!==c.first||c.m.kind==='item')return;if(c.m.kind==='status'){const q=c.a.soulState.firstScope1988;if(!['attack-only','all-skills'].includes(q))throw Error('Q-4798-001：先手强化翻倍是否包含属性技能待确认');if(q==='attack-only')return;}const positive=Object.entries(c.a.stages).filter(([,n])=>n>0),overflow=positive.some(([,n])=>n*2>6);for(const[k,n]of positive)c.stage(c.a,n,[k]);c.a.soulState.overflow1988={round:c.round,move:c.m.id,use:c.a.soulState.skillUses?.[c.m.id],active:overflow};},beforeDamage(c){const e=c.a.soulState.overflow1988;if(e?.active&&e.round===c.round&&e.move===c.m.id&&e.use===c.a.soulState.skillUses?.[c.m.id])c.modifier*=1.5;if(c.a.soulState.ignoreShield1988===c.round)c.ignoreShield=true;},beforeIncomingAttack(c){if(c.a.soulState.block1988===c.round)c.immuneAttack=true;},battlePhaseEnd(c){if(c.a.hp<=0)return;if(c.t.ailments['流血']>=c.round)c.a.soulState.ignoreShield1988=c.round+1;if(c.t.ailments['冻伤']>=c.round)c.a.soulState.block1988=c.round+1;}}};

registry[2009]={name:'无极圣武',sourceHash:'df7fa90e',traits:{ignoreTargetBoost:true},partial:true,deferred:['英雄之耀依赖其他队友的特性计数；武诛及层数条件依赖由该真实队伍计数授予的英雄之耀','替补状态双边入场及重新入场'],hooks:{battleStart(c){c.a.soulState.heroGlory2009=0;for(const f of[c.a,c.t]){const ok=c.entryAilment(f,'砥砺',1,c.a);f.soulState[ok?'bright2009':'awe2009']=3;}},roundStart(c){if(['physical','special'].includes(c.selectedMove(c.a).kind))c.a.soulState.ignoreTargetBoostRound=c.round;},beforeDamage(c){c.ignoreBoost=true;c.ignoreShield=true;c.ignoreImmunity=true;}}};

registry[1999]={name:'米修莉',sourceHash:'b2685152',momo:{"id":13749,"name":"摸摸","type":"普通","kind":"physical","power":0,"pp":40,"priority":0,"accuracy":100,"alwaysHit":false,"critical":"1/16","effectIds":[450],"effectInstances":[{"id":450,"args":[88,331],"description":"随机恢复88到331点生命值"}],"description":"随机恢复88到331点生命值","revision":"seerapi:99c7b664","hash":"99c7b664","level":72,"fifth":false,"sourceFlags":{"is_fifth":false,"is_special":false,"skill_activation_item":null,"classification":"regular"},"provider":"seerapi","sourceTargetCount":1,"deferredEffects":[],"limitations":[],"advanced":false},momoEffect:{"id":450,"argsNum":2,"template":"随机恢复{0}到{1}点生命值","revision":"seerapi:4eb7557b"},partial:true,unimplemented:['入魅PP转换与未击败触发范围待确认'],traits:{attackPriority:f=>3-(f.soulState.declines1999??0)+(f.soulState.highHP1999?1:0),statusPriority:f=>f.soulState.lowPriority1999??0},hooks:{battleStart(c){c.a.soulState.declines1999=0;},roundStart(c){const st=c.a.soulState;st.lowPP1999=0;st.lowPriority1999=0;st.highHP1999=c.a.hp>c.t.hp;st.damage1999=0;if(c.a.hp<c.t.hp){const n=c.t.moves.filter(k=>c.moveKind(k)==='status').length;st.lowPP1999=1+n;const q=st.countScope1999;if(n&&!['pp-only','priority-and-pp'].includes(q))throw Error('Q-4808-002：敌方属性技能数是否同时提升属性先制待确认');st.lowPriority1999=q==='priority-and-pp'?1+n:1;}if(st.highHP1999)st.damage1999=.2*(1+c.t.moves.filter(k=>['physical','special'].includes(c.moveKind(k))).length);},beforeUse(c){if(['physical','special'].includes(c.m.kind)&&(c.a.soulState.declines1999??0)<3&&c.clear(c.t))c.ailment(c.t,'流血',c.a);},beforeDamage(c){c.modifier*=1+(c.a.soulState.damage1999??0);},afterUse(c){if(!c.actualUsed||c.m.kind==='item')return;if(c.a.hp<=0){const q=c.a.soulState.lethal1999;if(typeof q!=='boolean')throw Error('Q-4685-002：米修莉死后实际用招载荷资格待确认');if(!q)return;}if(['physical','special'].includes(c.m.kind))healthRules.drainPercent(c,c.t.stats.maxHp*(.5-.1*(c.a.soulState.declines1999??0)),'米修莉入场吸取');else{const q=c.a.soulState.nonKoScope1999;if(!['attack-only','all-skills'].includes(q))throw Error('Q-4808-003：未击败入魅是否包括属性技能待确认');if(q==='attack-only')return;}const ko=c.a.soulState.actualKo1999;if(c.t.hp<=0||ko?.round===c.round&&ko.move===c.m.id)return;if(c.t.ailments['流血']>=c.round)c.grantCharm1999();else{c.timed(c.a,'攻击必中',1,{},c.round+1);c.timed(c.a,'属性必中',1,{},c.round+1);}},afterRoundEnd(c){if(c.a.hp<=0)return;if((c.a.soulState.declines1999??0)<3){c.a.soulState.declines1999++;c.heal(c.a,240,'米修莉衰减回复','soul');}if(c.a.soulState.lowPP1999)c.restorePP(c.a,c.a.soulState.lowPP1999);}}};

registry[2006]={name:"娜诺",sourceHash:'e0b859',traits:{},partial:true,deferred:['己方场下非满体精灵体力不下降'],hooks:{roundStart(c){if(c.t.gender===undefined)throw Error('2006缺少对手真实性别来源');c.a.soulState.reduction2006=c.t.gender!==2?(Object.values(c.t.stages).some(n=>n>0)?.6:.3):0;},beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type))c.amount*=1-(c.a.soulState.reduction2006??0);},afterUse(c){if(!c.actualUsed||c.m.kind==='item')return;if(c.a.hp<=0){const q=c.a.soulState.lethal2006;if(typeof q!=='boolean')throw Error('Q-4685-002：2006死后用招资格待确认');if(!q)return;}if(c.affinity(c.a.type,c.t.type)===1&&!c.ailment(c.t,'流血',c.a))c.clear(c.t);},afterRoundEnd(c){if(c.a.hp>0&&c.affinity(c.a.type,c.t.type)<1)c.heal(c.a,c.a.stats.maxHp/3,'微弱对手回复','soul');},battlePhaseEnd(c){if(c.a.hp>0&&c.affinity(c.a.type,c.t.type)>1){c.restorePP(c.a,2,'soul');c.rewriteStageValues(c.t,Object.fromEntries(Object.entries(c.t.stages).filter(([,v])=>v>0).map(([k,v])=>[k,-v])),'reverse');}}}};
});
