'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json'),ids=[2327,2403,2404,2405,922,54,579,1060],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const bindings4865=${JSON.stringify(bindings)},metadata4865=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))};
const handlers4865={
2403(){throw Error('Q-4865-002：2403真实四参数与三参数模板矛盾待确认');},
2404(c,p){if(c.t.hp>c.t.stats.maxHp*p[0]/100)c.power*=1+p[1]/100;},
2405(c,p){const before={...c.t.stages};c.stage(c.t,-p[0]);(c.a.soulState.deferred2405??=[]).push({round:c.round,moveId:c.m.wikiId??c.m.id,revision:c.m.revision,args:p.slice(),before,after:{...c.t.stages},nextPetImplemented:false});},
922(c,p){c.timed(c.a,'能力下降反馈',p[0],{source9224865:true});},
54(c,p){c.timed(c.t,'伤害输出降低',p[0],{fraction:1-1/p[1],scopeRed4865:true});},
579(c,p){(c.a.soulState.ji579Replies??=[]).push({round:c.round,denominator:p[0],label:c.m.name,moveId:c.m.wikiId??c.m.id,sourceRevision:c.m.revision});},
1060(c,p){const before={...c.t.stages},prior=c.t.effects.attackBlock;c.steal(c.a,c.t,'技能');if(stats.some(k=>before[k]>0&&c.t.stages[k]<before[k])){c.timed(c.t,'attackBlock',p[0],{},c.round+1);if(prior&&prior.start<=c.round&&prior.end>=c.round)c.t.effects.attackBlock.start=prior.start;}}
};
for(const id of [2327,2403,2404,2405,922,54,579,1060]){const old=registry[id],meta=metadata4865.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:id===2403?4:meta.argsNum,direct:true,phase:id===2327?old.phase:id===2404?'beforeDamage':'afterHit',...(id===2403?{partial:true,deploymentPendingFor(p,m,i){if((m.wikiId??m.id)===29252)return 'Q-4865-002：来源参数矛盾待答';return old?.deploymentPendingFor?.(p,m,i);},deferred:'触发成功则2回合内对手真实下场时，对真实下只出战精灵执行此效果；当前初次束缚的四参数矛盾仍是单精灵待答，不延期豁免。'}:{}),...(id===2405?{deferred:'当前令对手全属性-1已实现；未触发后真实对方下只精灵登场100%混乱、束缚需第二阶段，保留实例全部参数。'}:{}),validate(p,m,i){const b=bindings4865.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4865 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,i);},execute(c,p){if(bindings4865.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index)&&handlers4865[id])return handlers4865[id](c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);}});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const bindings4865='));let at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+block+t.slice(at));
const soul=`
const spacetime2050=f=>f.soulState.spacetime2050??={windows:[],acceleration:[]};
registry[2050]={name:'超维·瑞泽',sourceHash:'d8494469',partial:true,unimplemented:['Q-4865-001时空交错结算与HP减少量不等时基数'],deferred:['时空乱流的真实其他阵亡精灵上限合计与全阵亡队列消逝；当前对手已阵亡仍按单精灵处理','时空交错低于200分支真实禁止主动换宠2回合'],traits:{priority:f=>spacetime2050(f).windows.filter(w=>w.start<=f.soulState.calculationRound&&w.end>=f.soulState.calculationRound).length},hooks:{
beforeUse(c){if(!['physical','special'].includes(c.m.kind)||c.a.hp<=0)return;const st=spacetime2050(c.a),before=c.outgoingSettledDamage('percent');if(c.t.hp>0)c.hurt(c.t,c.panelStat(c.a,'spe')*.6,'时空加速面板速度60%百分比','percent');st.acceleration.push({round:c.round,settledDamage:Math.max(0,c.outgoingSettledDamage('percent')-before)});st.windows.push({start:c.round+1,end:c.round+2});},
opponentAfterUse(c){if(c.a.hp<=0||!c.actualUsed||!c.successful||!['physical','special'].includes(c.m.kind)||c.t.hp>0||c.t.soulState.vanished)return;const currentDefeatedMax=c.t.stats.maxHp;if(c.attackDamage>currentDefeatedMax*.6)c.vanish2050(c.t);},
combatEnd(c){if(c.a.hp<=0)return;const before=c.a.hp;c.heal(c.a,(c.a.stats.maxHp-c.a.hp)*.6,'时空折跃已损60%回复','soul');const restored=Math.max(0,c.a.hp-before);if(c.t.hp>0&&restored>0)c.hurt(c.t,restored,'时空折跃实际回复等量百分比','percent');if(restored<=200){if(c.t.hp>0)c.ailment(c.t,'神游',c.a);c.clearAilments(c.a);}},
roundEnd(c){if(c.a.hp<=0||c.t.hp<=0||spacetime2050(c.a).acceleration.some(e=>e.round===c.round&&e.settledDamage>0))return;const before=c.outgoingSettledDamage('fixed'),loss=c.hurt(c.t,1000,'时空交错敌固定伤害','fixed'),settled=c.outgoingSettledDamage('fixed')-before;if(settled!==1000||loss!==1000)throw Error('Q-4865-001：时空交错首段减免/过量的回复或阈值基数待答');c.heal(c.a,1000,'时空交错首段等量回复','soul');const secondBefore=c.outgoingSettledDamage('fixed'),selfLoss=c.hurt(c.a,1000,'时空交错自身固定伤害','fixed'),secondSettled=c.outgoingSettledDamage('fixed')-secondBefore;if(secondSettled!==1000||selfLoss!==1000)throw Error('Q-4865-001：时空交错自身段减免/过量的对手主动等量回复基数待答');if(c.t.hp>0)c.heal(c.t,1000,'时空交错对手主动等量回复','soul');}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('registry[2050]='));at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));
p='dist/souls.js';t=fs.readFileSync(p,'utf8');function replace(a,b){assert.equal(t.split(a).length,2,a);t=t.replace(a,b);}
replace("vanish1844(f){if(f.soulId!==1844)","vanish2050(f){if(a.soulId!==2050||f.hp>0)throw Error('2050当前已阵亡目标来源不匹配');return statusRules.vanish(s,f,r);},vanish1844(f){if(f.soulId!==1844)");
replace("a!==t&&!bypass&&on(a,'伤害输出降低')?","a!==t&&!bypass&&on(a,'伤害输出降低')&&(!a.effects['伤害输出降低'].scopeRed4865||type==='attack')?");
replace("if((t.hp>0&&(a.hp>0||t.soulId===1839))||","if((t.hp>0&&(a.hp>0||t.soulId===1839||t.soulId===2050))||");
replace("||t.soulId===2048)E.SOULS.run('opponentAfterUse'","||t.soulId===2048||t.soulId===2050)E.SOULS.run('opponentAfterUse'");
const begin="if(reflect&&reflect.start<=r&&reflect.end>=r&&!on(f,'弱化不可解除反转')){const before={...f.stages};";
replace(begin,"if(reflect?.source9224865&&reflect.start<=r&&reflect.end>=r&&!on(f,'弱化不可解除反转')){const before={...f.stages};clearNegative(f);if(fs[1-f.side].hp>0)for(const k of Object.keys(before))if(before[k]<0&&f.stages[k]>before[k])stage(fs[1-f.side],before[k]-f.stages[k],[k]);}else "+begin);fs.writeFileSync(p,t);console.log({installed:4865,bindings:bindings.length});
