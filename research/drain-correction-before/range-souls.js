(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.RangeSouls=factory;})(typeof globalThis!=='undefined'?globalThis:this,function(registry){
'use strict';
const positive=f=>Object.values(f.stages).filter(n=>n>0).length;
const energy=f=>f.soulState?.energy??0;
for(const [id,max,hash] of [[372,5,'c05d5cf3'],[574,6,'b9703945']])registry[id]={name:max===6?'神耀 · 强化':'神耀',sourceHash:hash,deferred:['阵亡后复活队友',...(max===6?['击败后面对下一只精灵的先制奖励']:[])],traits:{energyMax:max,attackReduction:f=>energy(f)*.08,ailmentImmune:f=>energy(f)>=2,weaknessImmune:f=>energy(f)>=2,fixedReflect:f=>energy(f)>=4,attackPriority:f=>energy(f)>=5?1:0},hooks:{afterUse(c){if(max===6&&c.t.hp<=0)c.energy(-energy(c.a));},beforeDamage(c){if(energy(c.a)>=6)c.modifier*=1.6;},roundEnd(c){if(c.used[c.a.side]&&energy(c.a)>=3)c.heal(c.a,c.a.stats.maxHp/3,'神耀回复');}}};
registry[373]={name:'疾',sourceHash:'2b8653d7',traits:{speedGrowthToHp:true},hooks:{roundStart(c){c.a.soulState.highHp=c.a.hp>c.t.hp;c.a.soulState.lowHp=c.a.hp<c.t.hp;}}};
registry[369]={name:'懒',sourceHash:'c44bf3c3',traits:{},hooks:{receivedAttack(c){c.timed(c.a,'soul369',2,{},c.round+1);}}};
registry[370]={name:'葬',sourceHash:'9b9708dd',traits:{},hooks:{afterUse(c){if(c.a.hp<=0)return;if(c.a.side===c.first&&c.t.hp>0)c.hurt(c.t,200,'魂印先手追加','fixed');else if(c.a.side!==c.first)c.heal(c.a,200,'魂印后手回复');}}};
registry[368]={name:'诞',sourceHash:'49a24346',traits:{},hooks:{afterUse(c){if(c.a.hp<=0)return;if(c.m.kind==='status')c.heal(c.a,200,'魂印回复');else if(c.t.hp>0)c.hurt(c.t,(c.a.stats.maxHp-c.a.hp)/2,'魂印追加','fixed');}}};
registry[367]={name:'海',sourceHash:'bc605ecc',traits:{},hooks:{beforeUse(c){c.a.soulState.powerDouble=c.a.hp>c.t.hp;c.a.soulState.drain=c.a.hp<c.t.hp;},beforeDamage(c){if(c.a.soulState.powerDouble)c.power*=2;},afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.drain)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/4,'海神吸取','percent'),'海神吸取');}}};
registry[374]={name:'樱',sourceHash:'eceb56f4',traits:{},hooks:{afterAttack(c){if(c.t.hp>0&&c.random()<.2+.1*positive(c.t))c.ailment(c.t,'冰封',c.a);}}};
registry[375]={name:'夜',sourceHash:'c2c567ed',traits:{},hooks:{roundStart(c){c.a.soulState.fixedTriggered=false;},afterAttack(c){const n=positive(c.a);if(n&&c.t.hp>0){c.a.soulState.fixedTriggered=true;c.hurt(c.t,50*n,'千夜魂印追加','fixed');}},roundEnd(c){if(!c.a.soulState.fixedTriggered&&c.a.hp>0&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,200,'千夜魂印吸取','fixed'),'千夜魂印吸取');}}};
registry[377]={name:'逍',sourceHash:'d2ba1235',traits:{},hooks:{afterAttack(c){if(c.dealt>300&&c.t.hp>0&&c.random()<.5)c.ailment(c.t,'害怕',c.a);else if(c.dealt<300)c.heal(c.a,200,'圣逍魂印回复');}}};
registry[376]={name:'宙',sourceHash:'3ae1b041',traits:{},hooks:{orderResolved(c){c.a.soulState.zeusFirst=c.a.side===c.first;},beforeUse(c){c.a.soulState.zeusHigher=c.a.hp>c.t.hp;},afterHit(c){if(c.a.soulState.zeusHigher&&c.t.hp>0){const id=c.t.moves[Math.floor(c.random()*c.t.moves.length)];c.t.pp[id]=0;c.emit(`${c.name(c.a)} 宙斯魂印：对手一项技能PP归零。`);}},afterUse(c){if(c.a.hp>0&&c.a.side!==c.first){const n=Math.floor(c.a.stats.maxHp/4);c.heal(c.a,n,'宙斯后手回复');if(c.t.hp>0)c.hurt(c.t,n,'宙斯后手追加','fixed');}}}};
registry[378]={name:'西亚',sourceHash:'9952ed16',traits:{},hooks:{orderResolved(c){c.a.soulState.lateReduction=c.a.side!==c.first;},afterUse(c){if(c.a.side!==c.first)c.heal(c.a,200,'真龙塔西亚后手回复');}}};
registry[381]={name:'幽',sourceHash:'acb669c2',traits:{},hooks:{afterAttack(c){if(c.crit)c.timed(c.a,'免异常',2,{});else c.timed(c.a,'暴击概率增加',1,{chance:.5},c.round+1);}}};
registry[379]={name:'沌',sourceHash:'e2792c06',traits:{},hooks:{beforeUse(c){const positive=Object.entries(c.a.stages).filter(([,n])=>n>0);if(positive.length)for(const [k,n]of positive)c.stage(c.t,-n,[k]);else c.hurt(c.t,c.t.stats.maxHp/4,'混沌魂印','percent');}}};
registry[380]={name:'瑞',sourceHash:'3ff56644',traits:{},hooks:{roundEnd(c){c.stage(c.a,1,['def','spd']);},afterAttack(c){if(c.t.hp>0)c.hurt(c.t,(Math.max(0,c.a.stages.def)+Math.max(0,c.a.stages.spd))*50,'海拉瑞德魂印','fixed');}}};
registry[166]={name:'玄武反伤',sourceHash:'2c6013b9',traits:{},hooks:{attackDamageTaken(c){if(c.t.hp>0){const amount=c.a.hp<=0?Math.min(c.dealt*.5,Math.max(0,c.t.hp-1)):c.dealt*.5;c.hurt(c.t,amount,'玄武魂印反伤','fixed');}}}};
registry[384]={name:'血',sourceHash:'c78935d0',traits:{},hooks:{beforeUse(c){if(c.m.kind!=='status'){if(c.random()<.5)c.ailment(c.t,'烧伤',c.a);if(c.random()<.3)c.ailment(c.t,'麻痹',c.a);}},beforeDamage(c){if(Object.values(c.t.ailments).some(end=>end>=c.round))c.power*=2;}}};
registry[383]={name:'时空',sourceHash:'8cebde62',traits:{skillPriority:f=>f.soulState.halfLow?1:0},hooks:{roundStart(c){c.a.soulState.halfLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.halfHigh=c.a.hp>c.a.stats.maxHp/2;},beforeDamage(c){if(c.a.soulState.halfHigh)c.modifier*=1.5;}}};
registry[382]={name:'佑',sourceHash:'5049fbfa',traits:{},hooks:{afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.m.kind!=='status')c.hurt(c.t,(c.a.previousDamageTaken??0)*.5,'炽天使魂印','fixed');},roundEnd(c){c.heal(c.a,200,'炽天使回合回复');}}};
registry[385]={name:'塞维',sourceHash:'aa2901b6',traits:{},hooks:{roundEnd(c){c.stage(c.a,1,['atk','spe']);},beforeDamage(c){if(c.a.side===c.first)c.minimumDamage=Math.max(c.minimumDamage??0,280);}}};

registry[387]={name:'塔克',sourceHash:'548f5341',traits:{},hooks:{roundEnd(c){c.stage(c.a,2,['def','spd']);},damageDealt(c){c.heal(c.a,c.dealt*.6,'塔克林魂印吸血');}}};
registry[390]={name:'维',sourceHash:'dd267438',traits:{},hooks:{damageDealt(c){c.heal(c.a,c.dealt*Math.min(.6,.4+(c.round-1)*.1),'伊维特魂印吸血');}}};
registry[391]={name:'鬼',sourceHash:'d72577f2',traits:{},hooks:{damageTaken(c){const next=k=>{const start=c.on(c.a,k)?c.a.effects[k].start:c.round+1;c.timed(c.a,k,c.round+2-start,{},start);};if(c.dealt>200)next('鬼王攻击免疫');if(c.dealt>0&&c.dealt<300)next('鬼王威力翻倍');}}};

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
registry[410]={name:'圣甲战',sourceHash:'30d4ab29',traits:{},hooks:{afterUse(c){c.a.soulState.gaiaRecovery=true;},roundEnd(c){if(c.a.soulState.gaiaRecovery)c.heal(c.a,c.a.stats.maxHp/3,'圣甲盖亚回合回复');},damageTaken(c){if(!c.skillPhase||c.a.hp>0||c.a.level!==100||c.a.soulState.deathRetaliating)return;c.a.soulState.deathRetaliating=true;try{c.hurt(c.t,c.a.roundSkillDamageTaken??0,'圣甲盖亚临终反击','true');if(c.t.hp===0){c.a.hp=1;c.emit(c.name(c.a)+' 圣甲盖亚魂印：恢复1点体力。');}}finally{c.a.soulState.deathRetaliating=false;}}}};
registry[416]={name:'鬼焰',sourceHash:'b4cc9a0',traits:{skillPriority:f=>f.soulState.luxunBurning?1:0},hooks:{roundStart(c){c.a.soulState.luxunBurning=c.t.ailments['烧伤']>=c.round;},beforeDamage(c){if(c.t.ailments['烧伤']>=c.round)c.power*=2;}}};
registry[421]={name:'圣甲瞳',sourceHash:'b20ecbb5',traits:{},hooks:{roundEnd(c){c.stage(c.a,1,['spa','spe']);if(c.a.hp>0&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,150,'圣甲缪斯吸取','fixed'),'圣甲缪斯吸取');}}};
registry[425]={name:'圣甲雷',sourceHash:'ba3a5753',traits:{},hooks:{beforeUse(c){if(c.a.hp>c.a.stats.maxHp/2&&c.random()<.5)c.ailment(c.t,'麻痹',c.a);},afterAttack(c){if(c.a.hp>0&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp*(c.a.hp<c.a.stats.maxHp/2?.4:.2),'圣甲雷伊吸取','percent'),'圣甲雷伊吸取');}}};
registry[424]={name:'秘',sourceHash:'ed87a141',deferred:['切换后第二次登场触发封属与惩罚；等待多精灵对战'],traits:{entryStatusBlockRounds:2},hooks:{opponentBeforeUse(c){if(c.round<=2&&c.m.kind==='status'){c.hurt(c.t,350,'米斯蒂克封属惩罚','fixed');if(c.t.hp>0)c.t.counts.nextDamageDouble=1;}},roundEnd(c){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<2;i++)c.stage(c.t,-1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);}}};
for(const [id,hash] of [[449,'dd0063a7'],[456,'15fe0576']])registry[id]={name:id===456?'武神 · 伙伴版':'武神',sourceHash:hash,deferred:id===456?['战神兄弟伙伴的攻击与体力各+50；等待多精灵队伍条件']:[],traits:{},hooks:{roundStart(c){c.a.soulState.ruierHigh=c.a.hp>c.t.hp;if(c.a.hp<c.t.hp)c.a.soulState.ruierHealNext=true;},beforeUse(c){const f=c.a.soulState;f.ruierHealThis=!!f.ruierHealNext;f.ruierHealNext=false;f.ruierFixedThis=f.ruierFixedNext??0;f.ruierFixedNext=0;},beforeDamage(c){if(c.a.soulState.ruierHigh)c.modifier*=2;},afterAttack(c){c.timed(c.t,'statusBlock',2,{});if(c.a.soulState.ruierHealThis){const before=c.a.hp;c.heal(c.a,c.dealt,'武神魂印吸血');c.a.soulState.ruierFixedNext=Math.max(0,c.a.hp-before);}},afterUse(c){const n=c.a.soulState.ruierFixedThis??0;c.a.soulState.ruierFixedThis=0;if(n>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,n,'武神魂印后续固伤','fixed');}}};
registry[448]={name:'四九',sourceHash:'cb6a6d9b',traits:{damageMultiplier:f=>f.soulState.sijiuHigh?1.49:1,allDamageReduction:f=>f.soulState.sijiuLow?.49:0},hooks:{roundStart(c){c.a.soulState.sijiuHigh=c.a.hp>c.t.hp;c.a.soulState.sijiuLow=c.a.hp<c.t.hp;}}};
for(const [id,hash,priority] of [[480,'2abaceaa',2],[611,'312a1a2f',3]])registry[id]={name:id===611?'冥 · 强化':'冥',sourceHash:hash,traits:{firstRoundSurvive:true,skillPriority:f=>f.soulState.hadesLow?2:0,attackPriority:f=>f.soulState.hadesBonus?priority:0},hooks:{roundStart(c){c.a.soulState.hadesLow=c.a.hp<c.t.hp;c.a.soulState.hadesBonus=c.a.soulState.hadesRewardRound===c.round;},receivedAttack(c){if(c.a.soulState.hadesLow)c.ailment(c.t,'害怕',c.a);},afterAttack(c){if(c.a.soulState.hadesBonus&&c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/3,'哈迪斯保命后追加','fixed');}}};

for(const [id,hash,bonus] of [[492,'21b67b02',.5],[528,'5989e77b',.75]])registry[id]={name:id===528?'雷祖 · 强化':'雷祖',sourceHash:hash,traits:{},hooks:{roundStart(c){c.a.soulState.glauriLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.glauriHigh=c.a.hp>c.a.stats.maxHp/2;},roundEnd(c){if(c.a.soulState.glauriLow&&c.t.hp>0)c.ailment(c.t,'麻痹',c.a,false,false,2);if(c.a.soulState.glauriHigh&&c.a.hp>0)c.timed(c.a,'id913',1,{bonus},c.round+1);}}};

for(const [id,hash,shield] of [[501,'2bcfd945',200],[529,'4ff96476',250]])registry[id]={name:id===529?'王地 · 强化':'王地',sourceHash:hash,traits:{},hooks:{orderResolved(c){if(c.a.side===c.first)c.t.soulState.skillInvalidRound=c.round;},roundEnd(c){if(c.a.hp>0&&c.a.side!==c.first){c.a.suitState.shield+=shield;c.emit(c.name(c.a)+' 王·卡修斯魂印：获得 '+shield+' 点护盾。');c.timed(c.a,'id984',1,{amount:2},c.round+1);}}}};

for(const [id,hash,shield] of [[505,'c7df212',300],[530,'d7aec6f4',400]])registry[id]={name:id===530?'莱茵 · 强化':'莱茵',sourceHash:hash,traits:{shieldBreakDamage:shield},hooks:{roundEnd(c){if(c.a.soulState.boostRemovedRound===c.round&&c.a.hp>0){c.a.suitState.shield+=shield;c.emit(c.name(c.a)+' 莱茵哈特魂印：获得 '+shield+' 点护盾。');}}}};

for(const [id,hash,fear,fixed] of [[516,'62152f62',50,.25],[531,'3b9299af',65,.30]])registry[id]={name:id===531?'王夜 · 强化':'王夜',sourceHash:hash,traits:{dodgeChance:.7,dodgeFearChance:fear,attackFixedFraction:fixed},hooks:{}};

registry[519]={name:'魔王',sourceHash:'bb8d683c',traits:{},deferred:['每击败一只精灵，攻击命中时的秒杀概率提高 2%；等待多精灵队伍击败计数和换宠流程'],hooks:{
  attackDamageTaken(c){if(c.a.hp+c.dealt===c.a.stats.maxHp&&c.a.soulState.chakAttackRound!==c.round){c.a.soulState.chakAttackRound=c.round;c.stage(c.t,-1);c.timed(c.a,'id984',1,{amount:1},c.round+1);}},
  afterAttack(c){if(c.t.hp>0&&c.random()<.15)c.hurt(c.t,c.t.hp,'魔王魂印秒杀','true',true);}
}};

for(const [id,hash,turns] of [[523,'40d8f8b9',1],[532,'ac2bb518',2]])registry[id]={name:id===532?'冥王 · 强化':'冥王',sourceHash:hash,traits:{},hooks:{roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.a.stats.maxHp/2)c.ailment(c.t,'害怕',c.a);else if(c.a.hp>c.a.stats.maxHp/2)c.timed(c.a,'免异常',turns,{},c.round+1);}}};

for(const [id,hash,sleep,clear] of [[535,'f112a7d3',35,50],[548,'c07f8985',40,60]])registry[id]={name:id===548?'王瞳 · 强化':'王瞳',sourceHash:hash,traits:{},hooks:{
  beforeUse(c){if(c.m.kind!=='status')c.a.soulState.museSleepingAtAttack=c.t.ailments['睡眠']>=c.round;},
  afterAttack(c){if(c.a.soulState.museSleepingAtAttack&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/3,'王瞳魂印追加','fixed');if(c.t.hp<=0)return;if(c.random()<sleep/100)c.ailment(c.t,'睡眠',c.a);else{c.stage(c.a,1,['spa','spe']);if(c.random()<clear/100)c.clear(c.t);}}
}};

for(const [id,hash,reduction] of [[538,'a8acaca7',.5],[549,'ecbf5ffd',.65]])registry[id]={name:id===549?'超能 · 强化':'超能',sourceHash:hash,traits:{},hooks:{
  attackDamageTaken(c){if(c.a.hp+c.dealt===c.a.stats.maxHp&&c.a.soulState.hathawayAttackRound!==c.round){c.a.soulState.hathawayAttackRound=c.round;c.a.soulState.nextDamageReductionFraction=reduction;}},
  afterAttack(c){if(c.a.hp>0&&c.a.hp<c.a.stats.maxHp/2&&c.t.hp>0){const n=c.hurt(c.t,c.t.stats.maxHp/3,'海瑟薇魂印吸取','percent');c.heal(c.a,n,'海瑟薇魂印吸取');}}
}};

registry[543]={name:'四九',sourceHash:'7c7e8c71',traits:{},hooks:{roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const n=Math.min(270,90+90*(c.a.soulState.fortyNineDrains??0));c.a.soulState.fortyNineDrains=(c.a.soulState.fortyNineDrains??0)+1;const taken=c.hurt(c.t,n,'四九魂印吸取','true');c.heal(c.a,taken,'四九魂印吸取');}}};

for(const [id,hash,bonus] of [[558,'d120b40f',.30],[566,'e78ded43',.35]])registry[id]={name:id===566?'斗战 · 强化':'斗战',sourceHash:hash,traits:{},deferred:['下场时保留本次战斗累计的攻击增伤；等待换宠与再次上场流程'],hooks:{roundEnd(c){c.a.soulState.arslanBonus=Math.min(bonus*5,(c.a.soulState.arslanBonus??0)+bonus);c.emit(c.name(c.a)+' 阿尔斯兰魂印：攻击增伤累计至 '+Math.round(c.a.soulState.arslanBonus*100)+'%。');}}};

for(const [id,hash,fraction] of [[552,'b3f44030',.5],[553,'75ae6462',.6]])registry[id]={name:id===553?'月辉 · 伙伴':'月辉',sourceHash:hash,traits:{},hooks:{afterAttack(c){if(c.t.hp>0)c.hurt(c.t,(c.effective(c.t,'def')+c.effective(c.t,'spd'))*fraction,'月辉魂印追加','fixed');if(c.a.hp>0)c.heal(c.a,(c.effective(c.a,'def')+c.effective(c.a,'spd'))*fraction,'月辉魂印回复');}}};

registry[560]={name:'明王',sourceHash:'c32d6a71',traits:{},hooks:{
  attackDamageTaken(c){if(c.dealt>300)c.a.soulState.mingReductionRound=c.round+1;},
  damageTaken(c){if(c.a.hp>0||c.a.soulState.mingDeathTriggered||c.t.hp<=0)return;c.a.soulState.mingDeathTriggered=true;c.t.hp=Math.min(c.t.hp,1);c.clear(c.t);for(const [k,n] of Object.entries(c.t.stages))if(n>0)c.t.stages[k]=-n;c.emit(c.name(c.a)+' 明王魂印：被击败后将对手体力降至 1，并反转其强化。');}
}};

registry[564]={name:'邪灵王',sourceHash:'2e5b4a29',traits:{},hooks:{afterAttack(c){if(c.dealt<280)c.timed(c.a,'id984',1,{amount:3},c.round+1);if(c.a.hp>0&&c.dealt>0)c.heal(c.a,c.dealt*(c.a.hp<c.a.stats.maxHp/2?.6:.4),'邪灵王魂印吸血');}}};

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
  afterAttack(c){if(c.a.hp>0&&c.t.hp>0)c.hurt(c.t,(c.t.lastAttackDamage??0)/2,'圣光灵神魂印追加','fixed');},
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
  roundStart(c){c.a.soulState.xilanAilment=Object.values(c.t.ailments).some(end=>end>=c.round);},
  beforeDamage(c){if(c.a.soulState.xilanAilment)c.modifier*=2;},
  beforeUse(c){if(!advanced&&!c.a.soulState.xilanAilment&&c.t.hp>0&&c.random()<.35)c.ailment(c.t,'害怕',c.a);},
  afterUse(c){if(!advanced||c.a.soulState.xilanAilment||c.t.hp<=0)return;if(c.random()<.35)c.ailment(c.t,'害怕',c.a);else c.timed(c.a,'攻击先制',1,{amount:1},c.round+1);},
  afterAttack(c){if(c.dealt<300&&c.t.hp>0)c.hurt(c.t,(advanced?c.t.stats.maxHp:c.t.hp)/3,'昔兰尼加魂印追加','percent');}
}};
registry[708]={name:'马尔修斯',sourceHash:'885e7248',traits:{skillPriority:f=>f.soulState.marsForm==='speed'?1:0},hooks:{
  roundStart(c){const s=c.a.soulState;if(!s.marsForm){s.marsForm='speed';s.marsShield=300;c.a.counts.immune=(c.a.counts.immune??0)+1;}if(s.marsNextForm){s.marsForm=s.marsNextForm;delete s.marsNextForm;c.emit(c.name(c.a)+' 马尔修斯切换为'+(s.marsForm==='speed'?'极速':'毁灭')+'形态。');}if(!s.marsShield&&s.marsShieldRestoreRound<=c.round){s.marsShield=300;delete s.marsShieldRestoreRound;}s.marsExecute=s.marsForm==='destruction'&&c.t.hp<c.t.stats.maxHp*.25;},
  beforeUse(c){if(c.a.soulState.marsExecute&&c.t.hp>0)c.hurt(c.t,c.t.hp,'马尔修斯毁灭形态秒杀','true',true);},
  beforeDamage(c){if(c.a.soulState.marsForm==='destruction')c.modifier*=1.7;else if(c.a.side===c.first){const key=c.round+':'+c.m.id;if(c.a.soulState.marsDebuffKey!==key){c.a.soulState.marsDebuffKey=key;c.stage(c.t,-1);}}},
  afterUse(c){if(!['25555','wiki:25555'].includes(String(c.m.id))||!c.successful||c.a.hp<=0)return;const s=c.a.soulState;if(s.marsForm==='speed'){if(c.t.hp>0){const amount=c.t.hp<c.t.stats.maxHp/2?c.t.hp/2:c.t.stats.maxHp/3;c.hurt(c.t,amount,'王·异甲同心追加','percent');}s.marsNextForm='destruction';}else{if(c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/3,'王·异甲同心吸取','percent'),'王·异甲同心吸取');s.marsNextForm='speed';}c.emit(c.name(c.a)+' 马尔修斯将在下回合切换为'+(s.marsNextForm==='speed'?'极速':'毁灭')+'形态。');},
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
  roundEnd(c){if(c.a.soulState.holyReyAwakened||c.a.hp<=0||c.t.hp<=0||c.a.hp>=c.t.hp||c.a.hp>=c.a.stats.maxHp/3)return;c.a.soulState.holyReyAwakened=true;c.heal(c.a,c.a.stats.maxHp,'圣霆雷伊魂印回满');c.clearNegative(c.a);c.clearAilments(c.a);c.clear(c.t);c.t.suitState.shield=0;c.t.suitState.barrier=0;c.a.counts.nextSoulSkillBoost=3;c.emit(c.name(c.a)+' 圣霆雷伊魂印：下3次技能先制+3、伤害翻倍。');}
}};
registry[722]={name:'格劳恩斯',sourceHash:'fb9c82d4',traits:{attackPriority:f=>f.soulState.glaHigh?1:0},hooks:{
  roundStart(c){c.a.soulState.glaHigh=c.a.hp>c.t.hp;c.a.soulState.glaTargetAiling=Object.values(c.t.ailments).some(end=>end>=c.round);},
  beforeDamage(c){if(c.a.soulState.glaHigh)c.modifier*=1.5;},
  afterAttack(c){if(c.a.soulState.glaBurnNext>0&&c.t.hp>0){c.a.soulState.glaBurnNext--;if(c.random()<.8)c.ailment(c.t,'焚烬',c.a);}},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.t.hp){if(c.ailment(c.t,'麻痹',c.a,false,false,2))c.ailment(c.t,'烧伤',c.a,false,false,3);else{c.a.counts.nextAttackPriority=(c.a.counts.nextAttackPriority??0)+2;c.a.soulState.nextAttackPriorityAmount=2;c.a.soulState.glaBurnNext=2;}}if(c.a.soulState.glaTargetAiling){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'格劳恩斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'格劳恩斯魂印追加','percent');}}
}};
registry[2093]={name:'格劳恩斯 · 强化',sourceHash:'1d8519cd',deferred:['下场时九劫之痕和百炼之炎层数传给下一只队友；等待多精灵换宠流程'],traits:{attackPriority:f=>f.soulState.glaHigh?1:0},hooks:{
  roundStart(c){c.a.soulState.glaHigh=c.a.hp>c.t.hp;},
  afterUse(c){if(c.a.soulState.glaHigh&&c.a.hp>0){c.a.soulState.lightningReleaseEnd=c.round+2;c.a.soulState.nineScars=(c.a.soulState.nineScars??0)+1;}},
  afterAttack(c){if(c.a.soulState.glaBurnNext>0&&c.t.hp>0){c.a.soulState.glaBurnNext--;c.ailment(c.t,'焚烬',c.a);}},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;if(c.a.hp<c.t.hp){if(c.ailment(c.t,'麻痹',c.a,false,false,3))c.ailment(c.t,'烧伤',c.a,false,false,3);else c.a.soulState.hundredFires=(c.a.soulState.hundredFires??0)+1;}if(Object.values(c.a.ailments).some(end=>end>=c.round)||Object.values(c.t.ailments).some(end=>end>=c.round))c.heal(c.a,c.a.stats.maxHp/3,'格劳恩斯强化魂印回复');if(c.a.hp>c.t.hp&&!(c.a.soulState.lightningReleaseEnd>=c.round)){c.t.soulState.nextStatusPriorityPenalty=(c.t.soulState.nextStatusPriorityPenalty??0)+2;c.t.soulState.nextStatusNoAilment=(c.t.soulState.nextStatusNoAilment??0)+2;}if(c.a.hp<c.t.hp&&!(c.t.ailments['烧伤']>=c.round)){c.a.counts.nextAttackPriority=(c.a.counts.nextAttackPriority??0)+2;c.a.soulState.nextAttackPriorityAmount=2;c.a.soulState.glaBurnNext=2;}}
}};
registry[728]={name:'混沌魔君索伦森',sourceHash:'1a406215',traits:{},hooks:{
  roundStart(c){const s=c.a.soulState;if(!s.sorenEntered){s.sorenEntered=true;if(c.clearBoost(c.t)){c.timed(c.t,'禁强化',2,{});c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;}}for(const k of ['atk','def','spa','spd','spe','acc'])if(c.t.stages[k]>c.a.stages[k])c.t.stages[k]=c.a.stages[k];s.sorenNoBoost=!Object.values(c.a.stages).some(n=>n>0);s.sorenImmuneAttack=s.sorenNoBoost&&c.random()<.5;s.sorenReduceAttack=s.sorenNoBoost&&!s.sorenImmuneAttack;},
  beforeDamage(c){if(c.t.soulState.sorenReduceAttack)c.modifier*=.5;},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;for(const k of ['atk','def','spa','spd','spe','acc'])if(c.t.stages[k]>c.a.stages[k])c.t.stages[k]=c.a.stages[k];if(Object.values(c.a.stages).some(n=>n>0)){const lost=c.a.stats.maxHp-c.a.hp,n=Math.min(c.a.stats.maxHp/3,lost);c.heal(c.a,n,'索伦森魂印回复');if(c.t.hp>0)c.hurt(c.t,n,'索伦森魂印追加','percent');}}
}};
for(const [id,hash,pink,reduction,healPart]of [[732,'6c364eb3',.25,.5,4],[1031,'3d1d7a6d',.3,.6,3]])registry[id]={name:id===1031?'圣灵之魂迈尔斯 · 强化':'圣灵之魂迈尔斯',sourceHash:hash,traits:{attackReduction:f=>f.soulState.milesHigh?reduction:0},hooks:{
  roundStart(c){c.a.soulState.milesHigh=c.a.hp>c.a.stats.maxHp/2;},
  afterAttack(c){if(c.dealt>0&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp*pink,'迈尔斯魂印追加','percent');},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0||c.a.hp>=c.a.stats.maxHp/2)return;const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/healPart,'迈尔斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'迈尔斯魂印等量追加','percent');}
}};
for(const [id,hash,bonus]of [[740,'c4233dc1',.5],[1030,'f7c4dc3b',1]])registry[id]={name:id===1030?'圣灵守护奥斯卡 · 强化':'圣灵守护奥斯卡',sourceHash:hash,deferred:['三种加护在奥斯卡下场后暂停、再登场后恢复；等待多精灵换宠流程'],traits:{},hooks:{
  opponentBeforeUse(c){if(c.m.kind!=='status')return;const s=c.a.soulState,guaranteed=s.oscarGuaranteed&&(id===1030||s.oscarGuaranteeRound===c.round),chance=c.a.moves.includes('wiki:37198')?1:.5;if(guaranteed||c.random()<chance){c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;s.oscarGuaranteed=false;delete s.oscarGuaranteeRound;}else{s.oscarGuaranteed=true;s.oscarGuaranteeRound=c.round+1;}},
  afterAttack(c){if(c.a.hp<=0)return;const s=c.a.soulState,amount=c.dealt*(s.oscarDoubleHeal?1:.5),before=c.a.hp;c.heal(c.a,amount,'奥斯卡魂印吸血');if(c.a.hp-before<300){c.a.counts.nextAttackBoost=(c.a.counts.nextAttackBoost??0)+1;c.a.soulState.nextAttackBoostFraction=bonus;s.oscarDoubleHeal=true;}else s.oscarDoubleHeal=false;}
}};
registry[744]={name:'星域之魂',sourceHash:'a9e77a10',traits:{},hooks:{
  roundStart(c){const s=c.a.soulState;s.starReduction=Object.values(c.a.ailments).some(end=>end>=c.round)?(c.a.hp<c.t.hp?.8:.3):0;},
  afterUse(c){if(!c.successful||c.a.hp<=0)return;const s=c.a.soulState;s.starImmuneKind=c.m.kind==='status'?'special':'physical';s.starImmuneRound=c.round+1;if(c.a.hp<c.a.stats.maxHp*.3&&c.t.hp>0){c.hurt(c.t,c.t.hp,'星域之魂低体力斩杀','true',true);for(const id of c.a.moves)c.a.pp[id]=0;c.a.effects={};c.emit(c.name(c.a)+' 星域魂印：清空全部技能 PP 与回合效果。');}}
}};
registry[750]={name:'天父·奥丁',sourceHash:'814a5974',traits:{skillPriority:f=>f.soulState.odinPriorityRound===f.soulState.currentRound?1:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;if(c.random()<.5){const pool=['烧伤','冻伤','中毒','麻痹','害怕','睡眠'];c.ailment(c.t,pool[Math.floor(c.random()*pool.length)],c.a);}else s.odinFailedRound=c.round;},
  afterAttack(c){if(c.dealt<=0||c.t.hp<=0)return;const count=Object.values(c.t.ailments).filter(end=>end>=c.round).length;if(count)c.heal(c.a,c.hurt(c.t,150*count,'奥丁魂印吸取','fixed'), '奥丁魂印吸取');},
  roundEnd(c){if(c.a.hp<=0)return;const s=c.a.soulState;if(s.odinFailedRound===c.round){c.heal(c.a,c.a.stats.maxHp/3,'奥丁魂印回复');s.odinPriorityRound=c.round+1;}if(c.t.hp>0&&c.a.hp>c.t.hp)for(const k of Object.keys(c.t.ailments))if(c.t.ailments[k]>=c.round)c.t.ailments[k]=c.round+3;}
}};
for(const [id,hash,bonus,chance] of [[752,'53893d99',.5,.5],[1209,'a6340139',.6,.6]])registry[id]={name:id===1209?'艾欧丽娅 · 羁绊强化':'艾欧丽娅',sourceHash:hash,traits:{},hooks:{
  beforeUse(c){c.a.soulState.aioLow=c.a.hp<c.t.hp;},
  beforeDamage(c){c.modifier*=1+bonus+(c.a.soulState.aioLow?.25:0);c.ignoreDefenseBoost=true;},
  afterAttack(c){if(c.dealt>0&&c.t.hp>0&&c.random()<chance)c.hurt(c.t,c.dealt*.5,'艾欧丽娅魂印追加','percent');},
  afterUse(c){if(c.a.soulState.aioLow&&c.t.hp>0){const n=c.hurt(c.t,200,'艾欧丽娅魂印吸取','fixed');c.heal(c.a,n,'艾欧丽娅魂印吸取');}delete c.a.soulState.aioLow;}
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
  afterHit(c){if(c.m.kind!=='status'&&c.dealt>0&&c.a.soulState.museTargetAsleep&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/3,'圣瞳缪斯睡眠追加','percent');},
  afterAttack(c){if(c.t.hp<=0)return;if(c.random()<.4){if(c.ailment(c.t,'睡眠',c.a))return;}c.a.soulState.musePriorityRound=c.round+1;},
  opponentAfterUse(c){if(c.m.kind==='status'||c.a.hp<=0||c.t.hp<=0)return;if(c.random()<.5){if(c.ailment(c.t,'睡眠',c.a))return;}const n=c.hurt(c.t,c.t.stats.maxHp/3,'圣瞳缪斯魂印吸取','percent');c.heal(c.a,n,'圣瞳缪斯魂印吸取');},
  roundEnd(c){if(c.a.hp<=0)return;const before=c.a.hp;c.heal(c.a,150,'圣瞳缪斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'圣瞳缪斯魂印等量追加','fixed');if(c.a.hp===c.a.stats.maxHp)c.stage(c.a,1,['spa','spe']);}
}};
registry[772]={name:'圣光斯嘉丽',sourceHash:'7d545ebe',traits:{attackReduction:f=>f.soulState.scarLowRound===f.soulState.currentRound?1/3:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;if(c.a.hp>c.t.hp){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<2;i++){const key=pool.splice(Math.floor(c.random()*pool.length),1)[0];c.stage(c.a,1,[key]);c.stage(c.t,-1,[key]);}}else if(c.a.hp<c.t.hp){s.scarLowRound=c.round;s.scarPinkReduction=true;}},
  afterUse(c){if(c.m.kind==='status'||c.a.hp<=0||c.t.hp<=0)return;const s=c.a.soulState,uses=(s.scarAttackUses??0)+1;s.scarAttackUses=uses;if(c.random()<Math.min(1,.7+.1*(uses-1))){c.ailment(c.t,'失明',c.a);return;}if(c.clear(c.t))c.emit(c.name(c.a)+' 圣光斯嘉丽魂印：消除对手回合效果。');c.timed(c.a,'id913',1,{bonus:1},c.round+1);}
}};
registry[789]={name:'X博士奥古斯特',sourceHash:'ccc56101',traits:{},hooks:{
  roundStart(c){const s=c.a.soulState;s.xConvertRound=Object.values(c.a.ailments).some(end=>end>=c.round)?c.round:0;if(s.xRetaliateRound===c.round){if(c.random()<.5)c.ailment(c.t,'害怕',c.a);else c.stage(c.a,2,['spa']);}},
  beforeUse(c){if(c.m.kind!=='status')c.a.soulState.xDoubleSkill=c.random()<.6;},
  beforeDamage(c){if(c.a.soulState.xDoubleSkill)c.power*=2;},
  afterAttack(c){if(!c.a.soulState.xDoubleSkill&&c.dealt>0&&c.t.hp>0)c.hurt(c.t,c.dealt*.6,'奥古斯特魂印未触发追加','fixed');},
  roundEnd(c){if(c.a.hp>0&&c.t.hp>0)c.a.soulState.xRetaliateRound=c.round+1;}
}};
registry[795]={name:'圣战盖亚',sourceHash:'2d87d7ef',traits:{allDamageReduction:f=>f.soulState.gaiaAilingRound===f.soulState.currentRound?.5:0,skillPriority:f=>f.soulState.gaiaPriorityRound===f.soulState.currentRound?2:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.gaiaAilingRound=Object.values(c.a.ailments).some(end=>end>=c.round)?c.round:0;s.gaiaHealRound=s.gaiaAilingRound?0:c.round;s.gaiaPowerDouble=(s.gaiaLastDamage??0)<200;},
  beforeDamage(c){if(c.a.soulState.gaiaPowerDouble)c.modifier*=2;c.ignoreDefenseBoost=true;c.a.soulState.gaiaNoDefBoost=c.t.stages.def<=0&&c.t.stages.spd<=0;},
  afterAttack(c){if(c.t.hp>0&&c.a.soulState.gaiaLastDamage)c.hurt(c.t,c.a.soulState.gaiaLastDamage*.5,'圣战盖亚上回合伤害追加','fixed');if(c.a.soulState.gaiaNoDefBoost)c.a.soulState.gaiaPriorityRound=c.round+1;},
  roundEnd(c){const s=c.a.soulState;if(c.a.hp>0&&s.gaiaHealRound===c.round)c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.4,'圣战盖亚魂印回复');s.gaiaLastDamage=c.a.roundDamageDealt??0;}
}};
registry[792]={name:'圣战瑞尔斯',sourceHash:'c7ad1f39',traits:{damageMultiplier:f=>f.soulState.rielsHighRound===f.soulState.currentRound?2:1},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.rielsHighRound=c.a.hp>c.t.hp?c.round:0;s.rielsLowRound=c.a.hp<c.t.hp?c.round:0;},
  afterUse(c){if(c.m.kind==='status')c.a.soulState.rielsStatusRound=c.round;else c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;},
  opponentAfterUse(c){if(c.m.kind!=='status'&&c.on(c.a,'对手攻击后全属性提升'))c.stage(c.a,c.a.effects['对手攻击后全属性提升'].amount);},
  attackDamageTaken(c){if(c.dealt<=0||c.a.hp<=0||c.t.hp<=0)return;const n=c.hurt(c.t,c.dealt/4,'圣战瑞尔斯魂印反馈','percent');if(n>100)c.stage(c.a,1);},
  roundEnd(c){if(c.a.hp<=0||c.t.hp<=0)return;const s=c.a.soulState;if(s.rielsStatusRound===c.round){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3*(c.a.hp<c.a.stats.maxHp/2?2:1),'圣战瑞尔斯属性技能回复');c.hurt(c.t,c.a.hp-before,'圣战瑞尔斯属性技能等量追加','percent');}if(s.rielsLowRound===c.round){const before=c.a.hp;c.heal(c.a,c.a.roundDamageDealt,'圣战瑞尔斯低体回复');c.hurt(c.t,c.a.hp-before,'圣战瑞尔斯低体等量追加','percent');}}
}};

for(const [id,hash,threshold,healAmount,drain] of [[804,'9b498ef7',.5,250,false],[1736,'7cc3ff93',1/3,300,true]])registry[id]={name:id===804?'梦天睡神·修普诺斯':'梦天睡神·修普诺斯·强化',sourceHash:hash,traits:{attackReduction:f=>f.soulState.hypnosReductionRound===f.soulState.currentRound&&!f.soulState.hypnosReflected?.75:0,damageMultiplier:f=>f.soulState.hypnosReductionRound===f.soulState.currentRound&&f.soulState.hypnosReflected?1.75:1},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.hypnosLowRound=c.a.hp<c.a.stats.maxHp/3?c.round:0;s.hypnosReductionRound=c.a.hp>c.a.stats.maxHp*threshold?c.round:0;},
  roundEnd(c){if(c.a.hp<=0||c.a.soulState.hypnosLowRound!==c.round)return;if(drain){const n=c.hurt(c.t,healAmount,'修普诺斯魂印吸取','fixed');c.heal(c.a,n,'修普诺斯魂印吸取');}else c.heal(c.a,healAmount,'修普诺斯魂印回复');}
}};
registry[846]={name:'混沌布莱克',sourceHash:'a123f1ec',traits:{damageMultiplier:f=>f.soulState.chaosDodgeBuffRound===f.soulState.currentRound?1.5:1},hooks:{
  roundStart(c){c.a.soulState.currentRound=c.round;},
  opponentBeforeUse(c){if(c.m.kind==='status')c.a.counts.immune=(c.a.counts.immune??0)+1;},
  roundEnd(c){const s=c.a.soulState;if(s.chaosDeathSaveRound===c.round&&c.t.hp>0)c.ailment(c.t,'害怕',c.a);if(s.chaosDodgeFailedRound===c.round&&c.t.hp>0)c.hurt(c.t,c.effective(c.a,'atk')*.5,'混沌布莱克闪避未触发追加','percent');}
}};
for(const [id,hash,priority] of [[819,'8107d84e',2],[1685,'802a26cc',3]])registry[id]={name:id===819?'惊涛海皇·波塞冬':'惊涛海皇·波塞冬·强化',sourceHash:hash,traits:{damageMultiplier:f=>f.soulState.poseidonHighRound===f.soulState.currentRound?2:1,attackReduction:f=>f.soulState.poseidonLowRound===f.soulState.currentRound?.5:0,skillPriority:f=>f.soulState.poseidonPriorityRound===f.soulState.currentRound?priority:0},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.poseidonHighRound=c.a.hp>c.t.hp?c.round:0;s.poseidonLowRound=c.a.hp<c.t.hp?c.round:0;},
  beforeDamage(c){if(id===1685&&c.a.soulState.poseidonHighRound===c.round)c.ignoreDefenseBoost=true;},
  attackDamageTaken(c){if(c.dealt>300&&c.t.hp>0)c.ailment(c.t,'冰封',c.a);},
  afterAttack(c){if(c.dealt>300)c.a.soulState.poseidonPriorityRound=c.round+1;},
  afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.poseidonLowRound===c.round){const n=c.hurt(c.t,c.t.stats.maxHp/3,'波塞冬魂印吸取','percent');c.heal(c.a,n,'波塞冬魂印吸取');}}
}};
registry[836]={name:'幻世·海瑟薇',sourceHash:'ed285c8d',traits:{attackReduction:f=>f.soulState.hathawayHighRound===f.soulState.currentRound?f.soulState.hathawayFullRound===f.soulState.currentRound?.5:.35:0,skillPriority:f=>f.soulState.hathawayHighRound===f.soulState.currentRound&&f.soulState.hathawayStatusChoice?1:0},hooks:{
  choiceLocked(c){c.a.soulState.hathawayStatusChoice=c.m?.kind==='status';},
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.hathawayLowRound=c.a.hp<c.a.stats.maxHp/2?c.round:0;s.hathawayHighRound=c.a.hp>c.a.stats.maxHp/2?c.round:0;s.hathawayFullRound=c.a.hp===c.a.stats.maxHp?c.round:0;},
  afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.hathawayLowRound===c.round){const n=c.hurt(c.t,c.t.stats.maxHp/3,'海瑟薇魂印吸取','percent');c.heal(c.a,n,'海瑟薇魂印吸取');}},
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
  roundEnd(c){if(c.a.soulState.hunterLowRound===c.round&&c.t.hp>0){const n=c.hurt(c.t,c.t.stats.maxHp/3,'弑神猎皇魂印吸取','percent');c.heal(c.a,n,'弑神猎皇魂印吸取');}}
}};

for(const [id,hash,count,reduction,healing] of [[567,'3ec901d1',2,.5,.30],[568,'8663574c',4,.6,.35]])registry[id]={name:id===568?'武 · 强化':'武',sourceHash:hash,traits:{},hooks:{
  roundStart(c){if(!Object.values(c.a.ailments).some(end=>end>=c.round))return;const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<count;i++)c.stage(c.t,-1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);c.t.soulState.kingGaiaDamageReductionRound=c.round;c.t.soulState.kingGaiaDamageReduction=reduction;},
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
 roundStart(c){const s=c.a.soulState;s.thunderWings={round:c.round,shield:c.a.hp<c.t.hp,boost:positive(c.a)>0,drop:Object.values(c.t.ailments).some(end=>end>=c.round),fear:Object.values(c.t.stages).some(n=>n<0)};if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'必定暴击',1,{});},
 beforeUse(c){const w=c.a.soulState.thunderWings;if(w?.round!==c.round)return;if(w.shield)c.a.suitState.shield+=300;if(w.boost)c.stage(c.a,1);if(w.drop&&c.t.hp>0)c.stage(c.t,-1);},
 afterUse(c){if(c.a.side===c.first&&c.t.hp>0){const n=c.hurt(c.t,c.a.stats.spe*.5,'守护者强化魂印','percent');c.heal(c.a,n,'守护者强化魂印');}else if(c.a.side!==c.first)c.timed(c.a,'id984',1,{amount:2},c.round+1);if(c.t.hp>0&&c.a.soulState.thunderWings?.round===c.round&&c.a.soulState.thunderWings.fear)c.ailment(c.t,'害怕',c.a);}
}};
registry[862]={name:'邪灵主宰',sourceHash:'d9571d43',traits:{},hooks:{afterAttack(c){if(c.t.hp<=0)return;if(c.dealt>300)c.ailment(c.t,'害怕',c.a);else c.timed(c.a,'魂印先制',1,{amount:3},c.round+1);},roundEnd(c){if(c.t.hp>0)c.hurt(c.t,c.a.hp<c.t.hp?300:150,'邪灵主宰魂印','fixed');}}};
registry[852]={name:'灵天圣君',sourceHash:'cc915423',traits:{},hooks:{afterUse(c){const boosts=Object.values(c.a.stages).filter(x=>x>0).length+Object.values(c.t.stages).filter(x=>x>0).length;if(c.m.kind==='status')c.heal(c.a,70*boosts,'灵天圣君魂印');else if(c.t.hp>0)c.hurt(c.t,70*boosts,'灵天圣君魂印','fixed');},roundEnd(c){for(const k of Object.keys(c.a.stages))if(c.a.stages[k]<0)c.a.stages[k]=Math.min(0,c.a.stages[k]*-2);}}};

for(const [id,hash,chance,multiplier] of [[864,'8b107b1',.6,2],[912,'741d06d2',.7,2.5]])registry[id]={name:'霸'+(id===912?' · 强化':''),sourceHash:hash,traits:{skillPriority:f=>f.soulState.xiangPriority?1:0},hooks:{roundStart(c){const boosted=Object.values(c.t.stages).some(n=>n>0);c.a.soulState.xiangPriority=!boosted;if(boosted){c.clearBoost(c.t);if(c.random()<chance)c.ailment(c.t,'焚烬',c.a);}},beforeUse(c){c.a.soulState.xiangDouble=c.m.kind!=='status'&&c.random()<.4;},beforeDamage(c){if(c.a.soulState.xiangDouble)c.modifier*=multiplier;},afterAttack(c){if(!c.a.soulState.xiangDouble)c.timed(c.t,'statusBlock',2,{});}}};

registry[870]={name:'圣地卡修斯',sourceHash:'9b9717ab',traits:{ailmentImmune:f=>f.soulState?.cassisImmuneRound===f.soulState?.currentRound,attackPriority:f=>f.suitState?.shield>0?1:0},hooks:{roundStart(c){const s=c.a.soulState;s.currentRound=c.round;if(!s.cassisEntered){s.cassisEntered=true;c.a.suitState.shield+=Math.floor(c.a.stats.maxHp/2);c.emit(c.name(c.a)+' 圣地卡修斯魂印：获得最大体力一半护盾。');}s.cassisImmuneRound=c.round;},roundEnd(c){}}};

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
  attackDamageTaken(c){if(c.dealt>0&&c.a.hp>0){c.a.counts.nextAttackBoost=Math.max(1,c.a.counts.nextAttackBoost??0);c.a.soulState.nextAttackBoostFraction=1;}},
  roundEnd(c){if(c.a.hp<=0||c.a.hp>=c.a.stats.maxHp/2)return;c.timed(c.a,'id984',1,{amount:2},c.round+1);if(c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/3,'普拉曼达魂印低体吸取','percent'),'普拉曼达魂印低体吸取');}
}};

// 875 · 终末之灭·天邪龙王.  The conversion roll is made once at the
// beginning of each round.  Attack damage is tracked separately from other
// damage so fixed/percent follow-up effects are not converted or reflected.
registry[875]={name:'终末之灭·天邪龙王',sourceHash:'ea9790b0',traits:{
  attackPriority:f=>f.soulState?.endDragonHighRound===f.soulState?.currentRound?1:0,
  damageMultiplier:f=>f.soulState?.endDragonHighRound===f.soulState?.currentRound?1.5:1
},hooks:{
  roundStart(c){const s=c.a.soulState;s.currentRound=c.round;s.endDragonHighRound=c.a.hp>c.t.hp?c.round:0;s.endDragonConvert=c.random()<.4;s.endDragonAttackTaken=0;c.emit(c.name(c.a)+' 终末之灭魂印：'+(s.endDragonHighRound===c.round?'体力较高，本回合攻击先制 +1、伤害提升 50%。':'体力比较未触发高体分支。')+(s.endDragonConvert?'触发 40% 受击转化。':'未触发 40% 受击转化。'));},
  attackDamageTaken(c){const s=c.a.soulState;if(c.dealt<=0)return;s.endDragonAttackTaken=(s.endDragonAttackTaken??0)+c.dealt;if(s.endDragonConvert&&c.a.hp>0){c.heal(c.a,c.dealt,'终末之灭魂印受击转化');}else if(s.endDragonConvert&&c.a.hp<=0){c.a.hp=Math.min(c.a.stats.maxHp,c.dealt);c.emit(c.name(c.a)+' 终末之灭魂魂印将致死攻击伤害转化为体力。','heal');}},
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
 beforeDamage(c){if(c.on(c.a,'圣雷华冠')&&Object.values(c.t.ailments).some(end=>end>=c.round))c.modifier*=1.5;},
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
 afterAttack(c){c.a.soulState.leopardDamage=c.dealt;},
 afterUse(c){if(c.m.kind==='status'||c.a.hp<=0)return;const damage=c.a.soulState.leopardDamage??0;if(damage>300){if(c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/3,'豹尊高伤追加','percent');c.heal(c.a,c.a.stats.maxHp/3,'豹尊高伤回复');}else if(damage<300&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/3,'豹尊低伤吸取','percent'),'豹尊低伤吸取');}
}};
registry[968]={name:'混沌魔尊',sourceHash:'df54e4b1',deferred:['之后每次登场随机令对手进入异常状态'],traits:{attackPriority:f=>f.soulState.chaosPriorityRound===f.soulState.currentRound?1:0},hooks:{
roundStart(c){c.a.soulState.currentRound=c.round;if(!c.a.soulState.chaosEntered){c.a.soulState.chaosEntered=true;c.randomFromSharedPool(1,true);}},
beforeUse(c){if(c.m.kind!=='status')c.a.soulState.chaosDamage=0;},
afterAttack(c){c.a.soulState.chaosDamage=c.dealt;},
afterUse(c){if(c.a.hp<=0||c.m.kind==='status')return;const dealt=c.a.soulState.chaosDamage??0;if(dealt>280&&c.t.hp>0)c.randomFromSharedPool(1,false);else if(dealt<280){c.a.soulState.chaosPriorityRound=c.round+1;c.timed(c.a,'必定暴击',1,{},c.round+1);}}
}};
registry[969]={name:'妖族元皇·兰蒂斯',sourceHash:'88cd1320',traits:{specialAlwaysHit:true},hooks:{
beforeDamage(c){if(c.a.side===c.first)c.modifier*=c.a.hp<c.t.hp?2:1.5;},
afterAttack(c){if(c.a.hp>0&&c.m.kind==='special')c.heal(c.a,c.dealt*.5,'妖皇魂印特攻回复');},
opponentBeforeUse(c){if(c.a.hp<c.t.hp)c.stage(c.a,1);if(c.t.side===c.first){c.hurt(c.t,c.t.stats.maxHp/3,'妖皇魂印先手惩罚','percent');if(c.t.hp<=0){c.clear(c.t);c.timed(c.t,'skillBlock',1,{});}}}
}};

registry[1017]={name:'玛洛迪斯',sourceHash:'c80900bd',traits:{},hooks:{
death(c){if(c.a.soulState.rebirthAttempted)return;c.a.soulState.rebirthAttempted=true;if(c.random()<.5){c.a.hp=c.a.stats.maxHp;c.restorePP(c.a,Infinity);c.clearBoost(c.t);c.clear(c.t);}else c.timed(c.t,'statusBlock',3,{});},
afterAttack(c){if(c.a.hp<=0)return;if(c.dealt>300&&c.t.hp>0){const n=c.hurt(c.t,300,'玛洛迪斯魂印吸取','fixed');c.heal(c.a,n,'玛洛迪斯魂印吸取');}else if(c.dealt<300)c.timed(c.a,'必定暴击',1,{},c.round+1);}
}};

registry[1014]={name:'怒涛·沧岚',sourceHash:'ab79edfc',traits:{skillPriority:f=>(f.suitState.shield+(f.soulState.attackShield??0)+(f.soulState.marsShield??0))>0?1:0},hooks:{
battleStart(c){c.a.suitState.shield+=400;},
beforeUse(c){if(c.m.kind!=='status')c.a.soulState.waveGrowth=Math.min(4,(c.a.soulState.waveGrowth??0)+1);},
beforeDamage(c){c.modifier*=1+(c.a.soulState.waveGrowth??0)*.25;},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.roundAttackDamage>0)c.a.counts.attackNullify=Math.max(1,c.a.counts.attackNullify??0);else{const before=c.a.hp;c.heal(c.a,250,'沧岚战阶回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'沧岚战阶追加','fixed');}}
}};
});
