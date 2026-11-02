'use strict';
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
function annihilate1764(c,target=c.t,releasePolicy='unknown'){
 const marks=marks1764(target),h=marks.holy.find(x=>!x.annihilationUsed),e=marks.evil.find(x=>!x.annihilationUsed);
 if(!h||!e||target.hp<=0)return false;
 if(target.soulState.oracleAnnihilation1764?.round===c.round)throw Error('Q-N50-4554-001/ANNIHILATION：同回合再次湮灭的独立伤害与结束减层未确认');
 h.annihilationUsed=true;e.annihilationUsed=true;
 target.soulState.oracleAnnihilation1764={round:c.round,holyId:h.id,evilId:e.id,releasePolicy};
 c.hurt(target,238,'湮灭','true');return true;
}
function endAnnihilation1764(c,target){const current=target.soulState.oracleAnnihilation1764;if(!current||current.ended||current.round!==c.round)return;if(current.releasePolicy==='unknown')throw Error('Q-N50-4554-001/ANNIHILATION：湮灭效果结束减层时点未确认');const marks=marks1764(target);marks.holy=marks.holy.filter(x=>x.id!==current.holyId);marks.evil=marks.evil.filter(x=>x.id!==current.evilId);current.ended=true;}
// A qualified response receives a settled attack result and an explicit layer
// selection. It never equates the unresolved evil-drain type to true/fixed.
function respond1764(c,payload={}){
 const target=payload.target??c.t,marks=marks1764(target),damage=payload.settledDamage,power=payload.power;
 if(target.soulState.oracleAnnihilation1764?.round===c.round&&target.soulState.oracleAnnihilation1764.releasePolicy==='unknown')throw Error('Q-N50-4554-001/ANNIHILATION：湮灭减层时点影响后续受攻响应未确认');
 if(!Number.isFinite(damage)||damage<0||!Number.isFinite(power)||power<0)throw Error('标记受攻须明确结算伤害与技能威力');
 for(const kind of['holy','evil']){
  const unused=marks[kind].filter(x=>!x.triggerUsed);if(!unused.length)continue;
  if(unused.length>1&&!payload.layers?.[kind])throw Error('Q-N50-4554-001/LAYERS：多层每层一次的单次受攻响应单位未确认');
  const chosen=payload.layers?.[kind]?unused.filter(x=>payload.layers[kind].includes(x.id)):unused;
  for(const mark of chosen){
   if(kind==='evil'&&damage>0&&!payload.evilDrain)throw Error('Q-N50-4554-002/DRAIN：伤害70%吸取的伤害类型和回复基数未确认');
   mark.triggerUsed=true;
   if(kind==='holy'){if(c.random()<c.statusProbability(70)/100)c.ailment(target,'疲惫',c.a,false,false,null,{probabilityPercent:70});}
   else if(damage>0){const p=payload.evilDrain;if(!['fixed','percent','true'].includes(p.type)||!Number.isFinite(p.amount)||p.amount<0||!Number.isFinite(p.healAmount)||p.healAmount<0)throw Error('须明确邪诲伤害与回复负载');c.hurt(target,p.amount,'邪诲吸取',p.type);c.heal(c.a,p.healAmount,'邪诲吸取回复');}
  }
 }
 if(damage>power){for(const kind of['holy','evil']){if(marks[kind].length>1&&marks[kind].some(x=>x.triggerUsed)!==marks[kind].every(x=>x.triggerUsed)&&!payload.removeIds?.[kind])throw Error('Q-N50-4554-001/LAYERS：伤害高于威力时混合已响应/未响应层的减层选择未确认');const id=payload.removeIds?.[kind]??marks[kind][0]?.id;if(id!==undefined)marks[kind]=marks[kind].filter(x=>x.id!==id);}}
}
module.exports={name:'圣谕邪魇',sourceHash:'196ef534',partial:true,unimplemented:['圣诰/邪诲受攻多层单位与时序','邪诲伤害70%吸取的类型/回复基数','同回合多次湮灭结算'],
 traits:{ailmentImmune:f=>form1764(f)==='holy',weaknessImmune:f=>form1764(f)==='evil',attackPriority:f=>f.soulState.oracleNextAttack1764?1:0,attackAlwaysHit:f=>!!(f.soulState.oracleNextAttack1764||f.soulState.oracleAttackThis1764)},
 abilities:{setForm:setForm1764,grantMark:grant1764,annihilate:annihilate1764,qualifiedAnnihilate(c,target=c.t){return annihilate1764(c,target,'roundEnd');},protectRemoval:protectRemoval1764,qualifiedMarkResponse:respond1764,endAnnihilation:endAnnihilation1764},
 deferred:['每次真实再次登场获得下次攻击先制+1/必中/穿免；当前初登场与切形完全独立实现','圣诰/邪诲标记真实下场保留与回场继续响应次数'],
 hooks:{battleStart(c){c.a.soulState.oracleForm1764='holy';c.a.soulState.oracleNextAttack1764=true;},roundStart(c){c.a.soulState.oracleNoSkillOpponent1764=c.selectedSkill(c.t)?0:c.round;c.a.soulState.oracleSelectedSkill1764=c.selectedSkill(c.a);},
 beforeUse(c){if(!['physical','special'].includes(c.m.kind))return;c.a.soulState.oracleAttackThis1764=!!c.a.soulState.oracleNextAttack1764;c.a.soulState.oracleNextAttack1764=false;},beforeDamage(c){if(c.a.soulState.oracleAttackThis1764)c.ignoreImmunity=true;},
 beforeIncomingDamage(c){if(c.type===(form1764(c.a)==='holy'?'fixed':'percent')){c.amount=0;c.immune=true;}},
 afterHit(c){if(['physical','special'].includes(c.m.kind)&&c.a.soulState.oracleSelectedSkill1764&&c.t.hp>0){if(!c.a.soulState.oracleQualifiedGrantTiming1764)throw Error('Q-N50-4554-001/TIMING：本次攻击新层是否参与本次受攻响应/阈值减层未确认');grant1764(c,c.a.soulState.oracleForm1764);}},afterUse(c){delete c.a.soulState.oracleAttackThis1764;},roundEnd(c){endAnnihilation1764(c,c.a);endAnnihilation1764(c,c.t);}}};
