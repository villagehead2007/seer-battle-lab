'use strict';const status=require('../../../dist/status-rules.js'),health=require('../../../dist/health-rules.js');
module.exports={name:'灼云',sourceHash:'c406c6e1',partial:true,unimplemented:['Q-N50-4514-003：实际使用物理或特殊后另一攻击类别是否同类PP归零待确认'],traits:{},hooks:{
 roundStart(c){c.a.soulState.zhuoyunConfusionRound=!status.active(c.t,'烧伤',c.round)?c.round:0;},
 beforeSkillHit(c){if(c.a.hp<=0||c.t.hp<=0||['status','item'].includes(c.m.kind)||c.a.soulState.zhuoyunConfusionRound!==c.round)return;const ok=c.ailment(c.t,'混乱',c.a,false,false,null,{probabilityPercent:100});if(!ok)c.a.soulState.ignoreImmunityThis=true;},
 combatEnd(c){if(c.a.hp<=0||c.t.hp<=0||!status.active(c.t,'烧伤',c.round))return;health.drainPercent(c,c.t.stats.maxHp/3,'灼云烧伤吸取');if(c.t.hp<=0||!c.usedSkillThisRound(c.t)||c.ppReductionBlocked(c.t))return;const type=c.selectedMove(c.t)?.kind;if(!type||type==='item')return;for(const id of c.t.moves)if(c.moveKind(id)===type)c.t.pp[id]=0;if(['physical','special'].includes(type)){const other=c.t.moves.filter(id=>['physical','special'].includes(c.moveKind(id))&&c.moveKind(id)!==type&&c.t.pp[id]>0);if(other.length){c.a.soulState.zhuoyunPendingPPClass={questionId:'Q-N50-4514-003',round:c.round,usedKind:type,moveIds:other};c.emit?.('Q-N50-4514-003：另一攻击类别PP未猜测处理；已完成确定同类PP归零。');}};}
}};

