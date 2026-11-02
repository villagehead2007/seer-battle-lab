(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleSoulRegistry=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
// Soul IDs have a distinct namespace from skill-effect IDs.
// Natural blessing is an owned buff; shared original skills can grant it in either version.
const natureBlessingTraits={attackPriority:f=>f.soulState.natureBlessings??0,attackReduction:f=>(f.soulState.natureBlessings??0)*.08,ailmentImmunityChance:f=>(f.soulState.natureBlessings??0)*.25};
const registry={
1015:{name:'加列韦',sourceHash:'f628ba9d',traits:{attackPriority:f=>f.ailments['烧伤']?1:0},hooks:{roundStart(c){if(c.random()<.5)c.ailment(c.t,'烧伤',c.a);if(c.random()<.5)c.ailment(c.a,'烧伤',c.a);},beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.ailments['烧伤']>=c.round)c.hurt(c.t,c.t.stats.maxHp/3,'加列韦烧伤追加','percent');},beforeDamage(c){if(c.a.ailments['烧伤']>=c.round)c.modifier*=2;}}},
 999:{name:'混沌·哈肯萨·原魂印',sourceHash:'829dc61',traits:{},hooks:{beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,c.round*18,'混沌哈肯萨原魂印追加','fixed');},combatEnd(c){if(c.a.hp<=0)return;if(c.t.hp>c.a.hp){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'哈肯萨原魂印回复');c.hurt(c.t,c.a.hp-before,'哈肯萨原魂印回复追加','percent');}if(c.t.hp<c.a.hp)c.timed(c.a,'id984',1,{amount:1},c.round+1);}}},
 1756:{name:'混沌·哈肯萨·觉醒魂印',sourceHash:'ee3379dc',deferred:['首次登场按对方出战背包龙系数量及龙神哈莫计算黯龙余恨；两种层数下场保留'],traits:{attackMultiplier:f=>1+(f.soulState.darkDragonHatred??0)*.02},hooks:{
 roundStart(c){c.a.soulState.fallenDragonResentment=Math.min(c.round,Math.max(0,50-(c.a.soulState.darkDragonHatred??0)));},
 beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,(c.a.soulState.fallenDragonResentment??0)*20,'混沌哈肯萨觉醒追加','fixed');},
 combatEnd(c){if(c.a.hp<=0)return;const total=(c.a.soulState.darkDragonHatred??0)+(c.a.soulState.fallenDragonResentment??0);if(c.t.hp>c.a.hp||total>30){const before=c.a.hp;c.heal(c.a,Math.min(c.a.stats.maxHp-c.a.hp,c.a.stats.maxHp/3),'哈肯萨觉醒回复');c.hurt(c.t,c.a.hp-before,'哈肯萨觉醒回复追加','percent');}if(c.t.hp<c.a.hp)c.timed(c.a,'id984',1,{amount:total>30?2:1},c.round+1);}
 }},
 993:{name:'该洛西斯·原魂印',sourceHash:'88fa5288',traits:{},hooks:{
 beforeUse(c){if(c.a.hp>0&&c.m.kind!=='item')c.timed(c.a,c.m.kind==='status'?'特殊攻击闪避':'物理攻击闪避',2,{});},
 combatEnd(c){if(c.a.hp<=0)return;const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'该洛西斯原魂印回复');if(c.a.hp<c.t.hp)c.hurt(c.t,c.a.hp-before,'该洛西斯原魂印追加','percent');}
 }},
 1769:{name:'该洛西斯·觉醒魂印',sourceHash:'ab627512',traits:{immuneAilments:['石化']},hooks:{
 beforeDamage(c){if(c.shieldValue(c.a)>c.shieldValue(c.t))c.modifier*=1.5;},
 beforeIncomingAttack(c){if(c.shieldValue(c.a)<c.shieldValue(c.t))c.reduction=.5;},
 beforeIncomingDamage(c){if(['fixed','percent'].includes(c.type)&&c.shieldValue(c.a)<c.shieldValue(c.t))c.amount*=.5;},
 afterUse(c){if(c.a.hp<=0||c.m.kind==='item')return;c.timed(c.a,c.m.kind==='status'?'特殊攻击闪避':'物理攻击闪避',2,{});if(c.on(c.a,'物理攻击闪避')&&c.on(c.a,'特殊攻击闪避')&&c.t.hp>0)c.ailment(c.t,'疲惫',c.a);},
 combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp>c.t.hp)c.a.suitState.shield+=Math.floor(c.a.stats.maxHp/3);else if(c.a.hp<c.t.hp){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'该洛西斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'该洛西斯魂印追加','percent');}}
 }},
 987:{name:'圣光莫妮卡·原魂印',sourceHash:'19c8b803',deferred:['之后每次登场获得2层自然祝福；下场清空自然祝福'],traits:{...natureBlessingTraits},hooks:{
  battleStart(c){c.a.soulState.natureBlessings=4;},
  combatEnd(c){const n=c.a.soulState.natureBlessings??0;c.a.soulState.natureBlessings=Math.max(0,Math.min(4,n+(c.used[c.a.side]?-1:1)));}
 }},
 2072:{name:'圣光莫妮卡·觉醒魂印',sourceHash:'43159cba',deferred:['上只在场队友PP恢复与琼华之庇；对方上只精灵参与最优系别比较'],traits:{...natureBlessingTraits,ignorePP:f=>(f.soulState.ningjie??0)>0},hooks:{battleStart(c){c.a.soulState.ningjie=4;},choiceLocked(c){c.a.soulState.selectedSkill=c.m.kind!=='item';},roundEnd(c){const n=c.a.soulState.ningjie??0;if(n<=0||c.a.hp<=0)return;const duration=n===5?3:2;let applied=false;if(!c.selectedSkill(c.t)){c.a.soulState.ningjie=n-1;applied=c.ailment(c.t,'沉默',c.a,false,false,duration);}if(!applied)c.timed(c.a,'最优对手系别',duration,{},c.round+1);}}},
 1935:{name:'混沌天蛇太祖·强化魂印',sourceHash:'cc25b75e',traits:{},hooks:{
  opponentAfterUse(c){
   if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;
   const low=c.attackDamage<=300;c.absorbPP(c.a,c.t,low?1:2);
   if(low){c.a.counts.nextAttackBoost=Math.max(1,c.a.counts.nextAttackBoost??0);c.a.soulState.nextAttackBoostFraction=1;}
   else{c.a.counts.nextAttackReductionUses=Math.max(1,c.a.counts.nextAttackReductionUses??0);c.a.soulState.nextAttackReductionFraction=.5;}
  },
  afterUse(c){
   if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;
   c.markStatusEffect?.();const chance=c.a.soulState.serpentEnhancedSleepChance??50;
   const applied=c.random()<chance/100&&c.ailment(c.t,'睡眠',c.a);
   c.a.soulState.serpentEnhancedSleepChance=applied?0:100;
  }
 }},
 955:{name:'混沌天蛇太祖·原魂印',sourceHash:'78b44dbf',traits:{},hooks:{
  roundStart(c){c.a.soulState.serpentSleepChance=Math.min(50,(c.a.soulState.serpentSleepChance??30)+10);},
  attackDamageTaken(c){
   if(c.a.hp<=0||c.t.hp<=0||c.dealt<=0||c.dealt===300)return;
   const low=c.dealt<300,n=low?1:2;
   for(const id of c.t.moves)c.t.pp[id]=Math.max(0,c.t.pp[id]-n);
   if(low){c.a.counts.nextAttackBoost=Math.max(1,c.a.counts.nextAttackBoost??0);c.a.soulState.nextAttackBoostFraction=1;}
   else{c.a.counts.nextAttackReductionUses=Math.max(1,c.a.counts.nextAttackReductionUses??0);c.a.soulState.nextAttackReductionFraction=.5;}
  },
  // Duration follows the shared Q001 user-confirmed project policy;
  // no species-specific duration or status behavior is introduced here.
  afterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;c.markStatusEffect?.();if(c.random()<(c.a.soulState.serpentSleepChance??30)/100)c.ailment(c.t,'睡眠',c.a);}
 }},
 951:{name:'厉魇魔王·咤克斯',sourceHash:'d235892e',deferred:['自身每击败一只精灵所获累计增伤、减伤及秒杀概率，在下一只对手出场后继续应用与叠加；当前对手击败获得的一层已实现'],traits:{attackMultiplier:f=>1.2+(f.soulState.zakKills??0)*.1,attackReduction:f=>Math.min(1,.2+(f.soulState.zakKills??0)*.1)},hooks:{
  beforeOpponentAttack(c){c.a.soulState.zakFullBeforeHit=c.a.hp===c.a.stats.maxHp;},
  attackDamageTaken(c){if(c.a.hp<=0)return;if(c.a.soulState.zakFullBeforeHit)c.timed(c.a,'id984',1,{amount:3},c.round+1);else c.heal(c.a,c.a.stats.maxHp/3,'咤克斯受击回复');},
  afterHit(c){if(c.m.kind!=='status'&&c.t.hp>0&&c.random()<.15+(c.a.soulState.zakKills??0)*.03)c.hurt(c.t,c.t.hp,'咤克斯魂印秒杀','true',true);},
  damageDealt(c){if(c.t.hp<=0&&!c.a.soulState.zakCurrentDefeat){c.a.soulState.zakCurrentDefeat=true;c.a.soulState.zakKills=(c.a.soulState.zakKills??0)+1;}}
 }},
 937:{name:'异星装甲·赛伯斯特·原魂印',sourceHash:'adb683c6',traits:{},hooks:{
  beforeCrit(c){c.forceCrit=c.random()<.5;c.chance=0;},
  afterAttack(c){if(c.a.hp<=0)return;if(!c.crit){c.timed(c.a,'必定暴击',1,{},c.round+1);c.timed(c.a,'id984',1,{amount:1},c.round+1);}const hp=c.a.hp;c.heal(c.a,c.dealt*.5,'赛伯魂印攻击回复');if(c.a.hp-hp<200&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/4,'赛伯魂印吸取','percent'),'赛伯魂印吸取');}
 }},
 1475:{name:'异星装甲·赛伯斯特·强化魂印',sourceHash:'6616741b',traits:{},hooks:{
  beforeCrit(c){c.forceCrit=c.random()<.7;c.chance=0;},
  afterAttack(c){if(c.a.hp<=0)return;if(!c.crit){c.timed(c.a,'必定暴击',1,{},c.round+1);c.timed(c.a,'id984',1,{amount:1},c.round+1);}const hp=c.a.hp;c.heal(c.a,c.dealt*.5,'赛伯魂印攻击回复');if(c.a.hp-hp<200&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/3,'赛伯魂印吸取','percent'),'赛伯魂印吸取');}
 }},
 931:{name:'极天之翼·托鲁克·原魂印',sourceHash:'1f447fc',deferred:['下场时清除累计先制，下场不保留'],traits:{skillPriority:f=>f.soulState.torukPriority??0},hooks:{
  roundStart(c){c.a.soulState.torukPriority=c.a.soulState.torukPending??0;},
  beforeUse(c){if(c.a.side===c.first){c.timed(c.a,'分类攻击减伤',1,{kind:2,fraction:.5});c.timed(c.a,'免异常',2,{});c.timed(c.a,'免弱',2,{});}else{c.heal(c.a,c.a.stats.maxHp/3,'托鲁克后手回复');c.a.soulState.torukPending=Math.min(3,(c.a.soulState.torukPending??0)+1);}}
 }},
 1473:{name:'极天之翼·托鲁克·强化魂印',sourceHash:'c2303528',deferred:['下场时清除累计先制，下场不保留'],traits:{skillPriority:f=>f.soulState.torukPriority??0},hooks:{
  roundStart(c){c.a.soulState.torukPriority=c.a.soulState.torukPending??0;},
  beforeUse(c){if(c.a.side===c.first){c.a.counts.nextAttackReductionUses=(c.a.counts.nextAttackReductionUses??0)+1;c.a.soulState.nextAttackReductionFraction=.5;c.timed(c.a,'免异常',2,{});c.timed(c.a,'免弱',2,{});}else{c.heal(c.a,c.a.stats.maxHp/3,'托鲁克后手回复');c.a.soulState.torukPending=Math.min(3,(c.a.soulState.torukPending??0)+1);}}
 }},
 928:{name:'不灭地威·萨瑞卡·原魂印',sourceHash:'7e7e253b',traits:{},hooks:{
  roundStart(c){c.stage(c.a,1,['def','spd','spe']);c.stage(c.t,-1,['def','spd','spe']);},
  attackDamageTaken(c){if(c.a.hp<=0||c.dealt<=0)return;if(c.dealt>350)c.heal(c.a,c.a.stats.maxHp,'萨瑞卡原魂印回满');else if(c.dealt<350&&c.t.hp>0)c.hurt(c.t,c.dealt*.5,'萨瑞卡原魂印反伤','fixed');}
 }},
 1474:{name:'不灭地威·萨瑞卡·强化魂印',sourceHash:'d9dc93f8',traits:{},hooks:{
  roundStart(c){c.stage(c.a,1,['def','spd','spe']);c.stage(c.t,-1,['def','spd','spe']);},
  attackDamageTaken(c){if(c.a.hp<=0||c.dealt<=0)return;if(c.dealt>340)c.heal(c.a,c.a.stats.maxHp,'萨瑞卡强化魂印回满');else if(c.dealt<340&&c.t.hp>0)c.hurt(c.t,c.dealt*.5,'萨瑞卡强化魂印反伤','fixed');}
 }},
 920:{name:'跃迁狂剑·兰斯洛特·原魂印',sourceHash:'463de87b',traits:{criticalReflectType:'fixed'},hooks:{
  criticalIncoming(c){c.hurt(c.t,c.amount,'兰斯原魂印暴击反弹','fixed');if(c.t.hp>0)c.heal(c.a,c.hurt(c.t,300,'兰斯原魂印吸取','fixed'),'兰斯原魂印吸取');c.timed(c.a,'id984',1,{amount:3},c.round+1);},
  boostRemoved(c){if(c.method==='steal')return;if(c.t.hp>0&&!c.ailment(c.t,'瘫痪',c.a)){c.clear(c.t);c.timed(c.t,'必定暴击',1,{},c.round+1);}}
 }},
 1581:{name:'跃迁狂剑·兰斯洛特·强化魂印',sourceHash:'cf9ef2a4',traits:{criticalReflectType:'percent'},hooks:{
  roundStart(c){c.a.soulState.lancelotBoosted=Object.values(c.a.stages).some(n=>n>0);},
  criticalIncoming(c){c.hurt(c.t,c.amount,'兰斯强化魂印暴击反弹','percent');if(c.t.hp>0)c.heal(c.a,c.hurt(c.t,300,'兰斯强化魂印真实追加','true'),'兰斯强化魂印等量回复');c.timed(c.a,'id984',1,{amount:3},c.round+1);},
  boostRemoved(c){if(c.t.hp>0&&!c.ailment(c.t,'瘫痪',c.a)){c.clear(c.t);c.t.counts.nextCrit=(c.t.counts.nextCrit??0)+1;}},
  beforeUse(c){if(c.m.kind!=='status'&&c.a.soulState.lancelotBoosted&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/3,'兰斯强化魂印吸取','percent'),'兰斯强化魂印吸取');}
 }},
 922:{name:'龙裳',sourceHash:'987c0ffa',traits:{minimumAttackDamage:260,flatAttackReduction:260},hooks:{
  combatEnd(c){if(c.a.hp>0)c.heal(c.a,c.a.hp<c.a.stats.maxHp/3?520:260,'龙裳战阶结束回复');}
 }},
 921:{name:'不羁·弗里德',sourceHash:'d0fa8ffc',traits:{attackMultiplier:f=>f.soulState.freedomFirst?1.5:1,attackReduction:f=>f.soulState.freedomLate?.5:0,ailmentImmune:f=>!!f.soulState.freedomLate,weaknessImmune:f=>!!f.soulState.freedomFirst},hooks:{
  roundStart(c){c.a.soulState.freedomFirst=false;c.a.soulState.freedomLate=false;},
  opponentBeforeUse(c){if(c.t.side===c.first)c.a.soulState.freedomLate=true;},
  beforeUse(c){if(c.a.side===c.first)c.a.soulState.freedomFirst=true;if(c.m.kind!=='status')c.clear(c.t);}
 }},
 919:{name:'奥佩娅',sourceHash:'94e9f841',deferred:['切换再次上场时触发第2次首回合攻击减伤/封属或免异常/封攻；每场战斗上限2次'],traits:{attackReduction:f=>f.soulState.opheaReduceRound===f.soulState.currentRound?.5:0,ailmentImmune:f=>f.soulState.opheaImmuneRound===f.soulState.currentRound},hooks:{
  roundStart(c){c.a.soulState.currentRound=c.round;},
  opponentBeforeUse(c){if(c.round!==1)return;if(c.m.kind==='status'){c.a.soulState.opheaImmuneRound=c.round;c.t.counts.nextAttackInvalid=(c.t.counts.nextAttackInvalid??0)+1;}else if(c.m.kind!=='item'){c.a.soulState.opheaReduceRound=c.round;c.t.counts.nextStatusInvalid=(c.t.counts.nextStatusInvalid??0)+1;}},
  beforeUse(c){if(c.m.kind==='status'&&c.t.hp>0&&!(c.random()<.5&&c.ailment(c.t,'害怕',c.a)))c.clear(c.t);}
 }},
 917:{name:'鬼面幽蝶·原魂印',sourceHash:'ca1e851b',traits:{skillPriority:f=>f.soulState.butterflyPriorityCurrent?2:0,dodgeChance:f=>f.soulState.butterflyDodge??0,attackReduction:f=>f.soulState.butterflyReduction??0},hooks:{
  choiceLocked(c){c.a.soulState.butterflyChoice=c.m.kind;},
  roundStart(c){const s=c.a.soulState;s.butterflyPriorityCurrent=s.butterflyPriorityRound===c.round;s.butterflyDodge=c.a.hp<c.t.hp?.8:.5;s.butterflyReduction=.5;if(s.butterflyChoice==='item')return;if(s.butterflyChoice==='status'){s.butterflyPriorityRound=c.round+1;return;}const pool=['atk','def','spa','spd','spe','acc'],chosen=[];for(let i=0;i<2;i++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0];chosen.push(k);c.stage(c.a,1,[k]);}if(chosen.includes('spa'))c.stage(c.a,2,['atk','spe']);}
 }},
 1863:{name:'鬼面幽蝶·觉醒魂印',sourceHash:'2b2da8ab',traits:{dodgeChance:f=>f.soulState.butterflyDodge??0,attackReduction:f=>f.soulState.butterflyReduction??0},hooks:{
  roundStart(c){c.a.soulState.butterflyDodge=0;c.a.soulState.butterflyReduction=0;},
  opponentBeforeUse(c){if(c.m.kind==='status'||c.m.kind==='item')return;c.a.soulState.butterflyDodge=c.a.hp<c.t.hp?.8:.5;c.a.soulState.butterflyReduction=c.a.hp>c.t.hp?.6:.5;},
  beforeUse(c){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<3;i++)c.stage(c.a,1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);const both=c.a.soulState.butterflyUnconditionalRound===c.round;if(c.m.kind!=='status'||both)c.stage(c.a,1,['atk','spe']);if(c.m.kind==='status'||both)c.timed(c.t,'id984',1,{amount:-2},c.round+1);},
  afterUse(c){if(!c.successful)c.a.soulState.butterflyUnconditionalRound=c.round+1;}
 }},
 909:{name:'芳馨·茉蕊儿·原魂印',sourceHash:'3318d0c8',deferred:['自身被击败后，己方下只出战精灵获得500点护盾、护罩并免疫下1次受到的异常状态'],traits:{ailmentImmune:f=>!!f.soulState.jasmineStatus,weaknessImmune:f=>!!f.soulState.jasmineStatus},hooks:{
  roundStart(c){c.a.soulState.jasmineStatus=c.m.kind==='status';c.a.soulState.jasmineCap=c.m.kind!=='item'&&c.m.kind!=='status'?c.a.stats.maxHp/2:null;if(c.a.soulState.jasmineCap!==null){const k=c.t.moves[Math.floor(c.random()*c.t.moves.length)];c.t.pp[k]=0;}}
 }},
 1825:{name:'芳馨·茉蕊儿·觉醒魂印',sourceHash:'22a49efe',deferred:['自身被击败后，使下只精灵获得芳馨之祝；灵茉之芯延长该祝福回合计数及下场保留分支延期'],traits:{ailmentImmune:f=>!!f.soulState.jasmineStatus,weaknessImmune:f=>!!f.soulState.jasmineStatus},hooks:{
  roundStart(c){c.a.soulState.jasmineStatus=c.m.kind==='status';c.a.soulState.jasmineCap=c.m.kind!=='item'&&c.m.kind!=='status'?c.a.stats.maxHp/3:null;if(c.a.soulState.jasmineCap!==null){const k=c.t.moves[Math.floor(c.random()*c.t.moves.length)];c.t.pp[k]=0;}if(c.m.kind==='item')c.a.soulState.jasmineCore=Math.min(3,(c.a.soulState.jasmineCore??0)+1);}
 }},
 886:{name:'幽冥帝尊·修罗',sourceHash:'4df358b3',deferred:['当回合击败对手则吸取对手下只出场精灵最大体力的1/3（boss无效）'],traits:{skillPriority:f=>f.soulState.netherFull?2:0,damageMultiplier:f=>f.soulState.netherFull===false?1.5:1},hooks:{
  roundStart(c){c.a.soulState.netherFull=c.a.hp===c.a.stats.maxHp;},
  afterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.a.hp>0&&c.t.hp>0)c.timed(c.a,'必定暴击',1,{},c.round+1);}
 }},
 879:{name:'战之狂热·英卡洛斯',sourceHash:'a0e3f40f',traits:{ailmentImmune:true,entryDamageResistance:15},hooks:{
  attackDamageTaken(c){if(c.a.hp<=0||c.t.hp<=0)return;const pool=['atk','def','spa','spd','spe','acc'];if(c.dealt<280){for(let i=0;i<3;i++)c.stage(c.a,1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);const moves=c.t.moves;if(moves.length)c.t.pp[moves[Math.floor(c.random()*moves.length)]]=0;}else if(c.dealt>280){for(let i=0;i<3;i++)c.stage(c.t,-1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);c.timed(c.a,'战狂下回合减伤',1,{},c.round+1);}},
  damageTaken(c){const st=c.a.soulState;if(c.a.hp>0||st.warBlessed&&st.warBlessingRound!==c.round)return;const first=!st.warBlessed;st.warBlessed=true;st.warBlessingRound=c.round;c.a.hp=Math.max(1,Math.floor(c.a.stats.maxHp/2));c.emit(c.name(c.a)+' 圣战祝福保留半数体力。');if(first&&c.t.hp>0){c.hurt(c.t,c.a.stats.maxHp/2,'圣战祝福','percent');c.clearBoost(c.t);c.clear(c.t);}}
 }},
 885:{name:'燃魂巨兽',sourceHash:'28315919',traits:{entryMaxHp:200},hooks:{
  beforeUse(c){if(c.m.kind!=='status'&&c.a.hp>0&&c.t.hp>0&&!(c.random()<.5&&c.ailment(c.t,'害怕',c.a)))c.a.soulState.beastPending=(c.a.soulState.beastPending??0)+1;},
  attackDamageTaken(c){if(c.dealt>0&&c.a.hp>0&&c.t.hp>0&&!(c.random()<.5&&c.ailment(c.t,'害怕',c.a)))c.a.soulState.beastPending=(c.a.soulState.beastPending??0)+1;},
  roundEnd(c){const n=c.a.soulState.beastPending??0;delete c.a.soulState.beastPending;for(let i=0;i<n&&c.a.hp>0&&c.t.hp>0;i++)c.hurt(c.t,c.a.stats.maxHp/3,'燃魂巨兽未触发追加','percent');}
 }},
 1:{name:'攻击减伤',sourceHash:'f130a901',traits:{attackReduction:.1},hooks:{}},
 2:{name:'攻击减伤',sourceHash:'808d4994',traits:{attackReduction:.1},hooks:{}},
 3:{name:'攻击减伤',sourceHash:'4f14b85a',traits:{attackReduction:.1},hooks:{}},
 6:{name:'回合回复',sourceHash:'4781ae94',traits:{},hooks:{roundEnd(c){if(c.a.hp>0)c.heal(c.a,c.a.stats.maxHp/10,'魂印回合回复');}}},
 7:{name:'回合回复',sourceHash:'6a81773a',traits:{},hooks:{roundEnd(c){if(c.a.hp>0)c.heal(c.a,c.a.stats.maxHp/10,'魂印回合回复');}}},
 622:{name:'皇',traits:{weaknessImmune:true,pinkImmune:true,entryAilmentRounds:3},hooks:{
  afterUse(c){if(c.a.hp>0&&c.t.hp>0&&c.m.id!=='struggle')c.rage();if(c.a.hp>0)c.heal(c.a,c.a.stats.maxHp/8,'星皇之赐');}
 }},
 527:{name:'雷 · 强化',traits:{},hooks:{
  roundStart(c){const {a,t,round,steal,emit,name}=c;steal(a,t,'回合开始');const shortened=Object.values(t.effects).filter(e=>e.end>round);for(const e of shortened){e.start=Math.min(e.start,round);e.end=round;}if(shortened.length)emit(`${name(a)} 魂印「雷」将对手 ${shortened.length} 项回合效果压缩至本回合结束（不属于消除）。`);a.soulHigh=a.hp>t.hp;a.soulProtect=a.hp<t.hp;if(a.soulProtect)emit(`${name(a)} 体力低于对手，魂印赋予本回合免断回合。`);if(a.soulHigh)emit(`${name(a)} 体力高于对手，登记回合末攻击 +2、速度与命中 +1。`);},
  roundEnd(c){c.steal(c.a,c.t,'回合结束');if(c.a.soulHigh){c.boost(c.a,2,['atk']);c.boost(c.a,1,['spe','acc']);}}
 }},
 881:{name:'光之惩戒·英卡洛斯',sourceHash:'90ddbd9b',traits:{skillPriority:1,weaknessImmune:true},hooks:{
  roundStart(c){c.a.soulState.lightPunishment=true;},
  beforeUse(c){
   const s=c.a.soulState;s.lightBlessingAttackThis=false;
   if(c.m.kind!=='item'&&c.m.kind!=='status'&&s.lightBlessingAttacks>0){s.lightBlessingAttacks--;s.lightBlessingAttackThis=true;}
  },
  beforeDamage(c){c.affinity=Math.max(2,c.affinity);if(c.a.soulState.lightBlessingAttackThis)c.modifier*=2.5;},
  roundEnd(c){if(c.a.hp>0&&c.a.soulState.lightBlessingRound===c.round){c.clearAilments(c.a);c.a.soulState.lightBlessingAttacks=3;}},
  afterAttack(c){
   if(c.a.hp<=0||c.t.hp<=0)return;
   if(c.dealt>280){c.hurt(c.t,c.t.stats.maxHp/3,'魂印光之惩戒追加','percent');c.timed(c.t,'statusBlock',1,{},c.round+1);}
   else if(c.dealt<280){const n=c.hurt(c.t,c.t.stats.maxHp/3,'魂印光之惩戒吸取','percent');c.heal(c.a,n,'魂印光之惩戒吸取');c.timed(c.a,'必定暴击',1,{},c.round+1);}
  }
 }},
 878:{name:'诅咒之神·狄修',sourceHash:'4cf3ebf6',traits:{},hooks:{
  roundStart(c){c.a.soulState.curseLow=c.a.hp<c.t.hp;c.a.soulState.curseHigh=c.a.hp>c.t.hp;},
  attackDamageTaken(c){if(c.a.soulState.curseLow)c.clear(c.t);},
  beforeUse(c){if(c.a.soulState.curseHigh&&c.m.kind==='status')c.clear(c.t);if(c.on(c.a,'咒怨反应')&&c.m.kind!=='status'){if(!(c.random()<.6&&c.ailment(c.t,'诅咒',c.a))){c.a.counts.nextSkillPriority=2;c.a.soulState.nextSkillPriorityAmount=1;}}},
  opponentBeforeUse(c){if(c.on(c.a,'强化诅咒')&&c.m.kind==='status')c.ailment(c.t,'诅咒',c.a);},
  roundEnd(c){if(c.a.hp<=0)return;if(!Object.values(c.a.stages).some(n=>n>0))c.timed(c.a,'咒怨反应',1,{},c.round+1);else c.timed(c.a,'强化诅咒',1,{},c.round+1);}
 }}
};
function id(f){return f.soulId??({emperor:622,king:527}[f.species]??null);}
function trait(f,key){const value=registry[id(f)]?.traits[key];return typeof value==='function'?value(f):value;}
function run(event,c){registry[id(c.a)]?.hooks[event]?.(c);c.syncStages?.();}
const extend=typeof module==='object'&&module.exports?require('./range-souls.js'):globalThis.RangeSouls;extend(registry);
for(const v of Object.values(registry)){Object.freeze(v.traits);Object.freeze(v.hooks);Object.freeze(v);}
return Object.freeze({registry:Object.freeze(registry),id,trait,run});
});
