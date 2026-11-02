'use strict';const fs=require('fs'),assert=require('node:assert/strict'),source=require('./4169-reviewed-snapshot.json');
function replace(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p+' unique '+a.slice(0,65));fs.writeFileSync(p,s.replace(a,b));}
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});');assert.ok(at>0);let code='\n';for(const id of [1428,549,1642,1643,1645,1646,1648,1649,1650,1654]){const m=source.effects.find(x=>x.id===id);code+='metadata['+id+']='+JSON.stringify({info:m.template,args_num:m.argsNum})+';\n';}
code+=`
add(1428,'afterHit',(c,p)=>{if(roll(c,p[0]))c.stage(c.t,-1);c.timed(c.a,'每回合弱化对手',p[1],{stages:p.slice(2)});},[pct,turns,...Array(6).fill(stage)]);
add(549,'afterHit',(c,p)=>c.randomAilmentsFrom(p[0],['烧伤','冻伤','中毒','害怕','疲惫','麻痹'],549),[[1,6]]);
add(1642,'afterHit',(c,p)=>{if(c.clearBoost(c.t)&&roll(c,p[0])){c.a.soulState.fatalScatterPending={effectId:1642,count:p[1],round:c.round};c.emit('1642清强已执行；致命印记散布分配待Q-A60-4169-039，未猜测随机放置。');}},[pct,[1,99]]);
registry[1642]=Object.freeze({...registry[1642],partial:true,unimplemented:['Q-A60-4169-039：致命印记分配']});
add(1643,'afterHit',(c,p)=>{const n=c.fatalCracks(c.t);if(n>0&&c.t.hp>0)c.hurt(c.t,n*p[0],c.m.name+'裂痕追加','true');},[[0,99999]]);
add(1645,'afterHit',(c,p)=>c.timed(c.a,'属性技反制减伤',p[0],{count:p[1],fraction:p[2]/100}),[turns,[1,99],pct]);
add(1646,'afterHit',(c,p)=>c.stage(c.a,p[0]*(c.fatalCracks(c.t)>0?2:1)),[[1,6]]);
add(1648,'afterHit',(c,p)=>{const n=c.a.stats.maxHp*p[0]/100;if(c.t.hp>0)c.hurt(c.t,n,c.m.name+'额外伤害',c.fatalCracks(c.t)>0?'true':'percent');if(c.a.hp>0)c.heal(c.a,n,c.m.name+'等量回复');},[pct]);
add(1649,'beforeDamage',(c,p)=>{if(roll(c,Math.min(100,p[0]+c.fatalCracks(c.t)*p[2])))c.modifier*=p[1];else c.timed(c.t,'statusBlock',p[3],{});},[pct,[1,10],pct,turns]);
add(1654,'afterHit',()=>{},[[1,1]],'当回合击败对手后的下一只登场精灵首次技能附加效果失效；仅真实后继精灵及换宠流程延期');
{const old=registry[733];registry[733]=Object.freeze({...old,validate(p,m,index){if(m?.id===34811&&m.hash==='35250f3c'&&index===1&&JSON.stringify(p)==='[23]')return;old.validate(p,m,index);}});}
`;
fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
p='dist/souls.js';replace(p,"  const effectiveStage=","  const fatalCracks=f=>Math.min(3,Math.max(0,f.soulState?.fatalCracks??0));\n  const effectiveStage=");
replace(p,"round:r,skillPhase,currentActorSide,ppReductionBlocked:","round:r,skillPhase,currentActorSide,fatalCracks,ppReductionBlocked:");
replace(p,"let modifier=(on(a,'全伤害翻倍')?2:1)","let modifier=(fatalCracks(a)>=2?.75:1)*(fatalCracks(t)>=1?1.25:1)*(on(a,'全伤害翻倍')?2:1)");
replace(p,"amount:n*(on(f,'所受伤害倍增')?", "amount:n*(['attack','fixed','percent'].includes(type)&&fatalCracks(f)>=1?1.25:1)*(on(f,'所受伤害倍增')?");
replace(p,"return hurt(t,n*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比减伤输出')?", "return hurt(t,n*(['attack','fixed','percent'].includes(type)&&fatalCracks(a)>=2?.75:1)*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比减伤输出')?");
replace(p,"fs.forEach((f,i)=>{if(battleMoves[choices[i]].kind==='status'&&on(f,'属性技能先制'))", "fs.forEach((f,i)=>{if(battleMoves[choices[i]].kind!=='item'&&fatalCracks(f)>=3)priorities[i]--;if(battleMoves[choices[i]].kind==='status'&&on(f,'属性技能先制'))");
replace(p,"if(!rage&&t.counts.nextAttackReductionUses>0)","if(!rage&&t.counts.luoAttackReduction>0){modifier*=1-(t.soulState.luoAttackReductionFraction??0)*(1-damageReductionIgnore);t.counts.luoAttackReduction--;}if(!rage&&t.counts.nextAttackReductionUses>0)");
replace(p,"E.SOULS.run('opponentBeforeUse',{...context(t,a,m),first});", "if(m.kind==='status'&&on(t,'属性技反制减伤')){const e=t.effects['属性技反制减伤'];t.counts.luoAttackReduction=(t.counts.luoAttackReduction??0)+e.count;t.soulState.luoAttackReductionFraction=e.fraction;}E.SOULS.run('opponentBeforeUse',{...context(t,a,m),first});");
replace(p,"used[side]=true;a.soulState.skillUses??={};", "if((a.soulState.fatalMarks?.[m.id]??0)>=3)throw Error('3枚致命印记命中效果失效范围待公共Q-A60-4125-027');used[side]=true;a.soulState.skillUses??={};");
replace(p,"function endAction(a,t,m,successful=false){a.soulState.actionEndedRound=r;", "function endAction(a,t,m,successful=false){if(used[a.side]&&m.kind!=='item'&&a.soulState.fatalMarks?.[m.id]>0){const n=a.soulState.fatalMarks[m.id];delete a.soulState.fatalMarks[m.id];if(n===2&&!on(a,'PP保护')&&!on(a,'免疫PP削减')&&!E.SOULS.trait(a,'ppReductionImmune'))a.pp[m.id]=Math.max(0,a.pp[m.id]-1);if(a.hp>0)inflict(t,a,a.stats.maxHp/(n===1?6:5),'致命印记使用后','true');}a.soulState.actionEndedRound=r;");
replace(p,"if(f.hp>0)delete f.soulState.deathResolved;}","if(f.hp>0)delete f.soulState.deathResolved;else{if(f.soulState.fatalMarks)delete f.soulState.fatalMarks;if(f.soulState.fatalCracks)f.soulState.fatalCracks=0;}}");
replace(p,"nextAttackPriority:'攻击先制提升',", "nextAttackPriority:'攻击先制提升',luoAttackReduction:'属性技能反制减伤',");
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');at=s.lastIndexOf('\n});');assert.ok(at>0);code=`
registry[1394]={name:'弑序神罗',sourceHash:'770c601d',partial:true,unimplemented:['Q-A60-4169-039：首次致命印记分配','Q-A60-4125-027②：3枚印记命中效果失效范围'],traits:{skillPriority:f=>f.soulState.luoPriority?1:0},hooks:{roundStart(c){c.a.soulState.luoStartHp=c.a.hp;c.a.soulState.luoPriority=c.on(c.a,'弑序次回合先制');if(c.round===1){c.timed(c.a,'免异常',1,{});c.timed(c.a,'免弱',1,{});const n=c.fatalCracks(c.t);if(n>=1)c.timed(c.a,'致命一击免疫',1,{});if(n>=2)c.timed(c.a,'攻击伤害免疫',1,{});if(n>=3)c.timed(c.t,'attackBlock',1,{});c.a.soulState.fatalInitialScatterPending=5;}},combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp>c.a.soulState.luoStartHp)c.timed(c.a,'protect',2,{});else if(c.a.hp<c.a.soulState.luoStartHp)c.timed(c.a,'弑序次回合先制',1,{},c.round+1);if(c.a.hp<c.a.stats.maxHp/2)c.timed(c.a,'固定百分比免疫',1,{},c.round+1);}}};
`;fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
console.log('4169 actual independent effects/entry/end-stage/cracks/1-2 marks implemented; scatter and ambiguous1644 remain unregistered or explicitly partial; public1647 not yet changed');
