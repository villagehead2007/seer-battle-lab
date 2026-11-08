'use strict';const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json');
function append(file,code){const text=fs.readFileSync(file,'utf8'),i=text.lastIndexOf('});');assert.ok(i>0);fs.writeFileSync(file,text.slice(0,i)+code+'\n'+text.slice(i));}
append('dist/range-souls.js',`
const pope4898=f=>f.soulState.pope4898??={sourceHash:'86e95364',events:[]};
registry[2084]={name:'教皇',sourceHash:'86e95364',partial:true,unimplemented:['Q-4898-001抵挡暴击后的信仰对象代词','Q-4898-002抵挡免疫量的结算口径'],deferred:['其他对方队伍成员信仰自身时的逐只伤害加减贡献；当前对手贡献已实现','对方全部精灵信仰自身的真实队伍判定，成立后本场免异常/免弱/免固定/免百分比'],traits:{},hooks:{
 beforeBattleStart(c){pope4898(c.a);},
 beforeDamage(c){if(c.t.statusState.faithSourceSide===c.a.side)c.modifier*=1.2;},
 beforeIncomingAttack(c){const st=pope4898(c.a);if(c.crit){st.opponentCritRound=c.round;throw Error('Q-4898-001 / Q-4898-002：教皇抵挡暴击的对象与免疫量待确认');}if(c.t.statusState.faithSourceSide===c.a.side)c.reduction=1-(1-c.reduction)*.9;},
 combatEnd(c){if(c.a.hp>0&&pope4898(c.a).opponentCritRound!==c.round)c.heal(c.a,c.a.stats.maxHp/4,'教皇对手本回合无致命一击魂印回复');}
}};
`);
const ids=[2474,2475,2464,2465,2466,2467,2165,948,1562,993,1689,1843],rows=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({moveId:m.id,hash:m.hash,index,id:e.id,args:e.args}))).filter(e=>ids.includes(e.id));
append('dist/range-effects.js',`
const rows4898=${JSON.stringify(rows)};
const exact4898=(p,m,i,id)=>rows4898.some(x=>x.id===id&&(m?.wikiId??m?.id)===x.moveId&&(m.hash===x.hash||m.revision==='seerapi:'+x.hash)&&i===x.index&&JSON.stringify(p)===JSON.stringify(x.args));
${[2474,2475,2464,2465,2466,2467].map(id=>{const e=s.effects.find(e=>e.id===id);return 'metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';';}).join('\n')}
add(2474,'beforeUse',()=>{},[],'真实对方全部精灵均拥有信仰对象的队伍条件与强制命中协议；不从当前一个对手推断全队');
add(2475,'afterHit',()=>{},[],'真实对方全部拥有信仰对象时逐个回复404/固定404，统计全队已损失体力众数并对非众数执行秒杀');
add(2464,'beforeDamage',(c,p)=>{if(c.t.statusState.faithSourceSide===undefined)c.power*=1+p[0]/100;},[[100,100]],'真实存活队伍中唯一没有信仰对象时改为秒杀；当前没有信仰对象的威力提升已实现');
add(2465,'afterHit',(c,p)=>{if(c.t.statusState.faithSourceSide!==undefined)healthRules.drainPercent(c,c.t.stats.maxHp/p[0],c.m.name+'拥有信仰对象吸取','教皇按理论比例等量回复');},[[3,3]],'真实存活队伍中唯一拥有信仰对象时改为秒杀；当前拥有信仰对象的比例吸取已实现');
add(2466,'afterAttack',c=>{if(c.crit){c.clear(c.t);c.clearBoost(c.t);}});
add(2467,'afterHit',(c,p)=>{if(!Object.values(c.t.ailments).some(end=>end>=c.round))c.timed(c.t,'statusBlock',p[0],{});},[[2,2]]);
for(const id of[2474,2475,2464,2465,2466,2467]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(!exact4898(p,m,i,id))throw Error('4898 exact source mismatch '+id);}});}
for(const id of[2165,948,1562,993,1689,1843]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(exact4898(p,m,i,id))return;return old.validate(p,m,i);},execute(c,p){if(!exact4898(p,c.m,c.effectInstanceIndex,id))return old.execute(c,p);
 if(id===2165){const prior=c.a.soulState.qualifiedTransfer2165;c.a.soulState.qualifiedTransfer2165={immune:'normal',same:'success',remove:'success'};try{return old.execute(c,p);}finally{if(prior===undefined)delete c.a.soulState.qualifiedTransfer2165;else c.a.soulState.qualifiedTransfer2165=prior;}}
 if(id===948){if(c.steal(c.a,c.t,'技能'))c.ailment(c.t,'狂信',c.a,false,false,null,{probabilityPercent:100});return;}
 if(id===1562){if(statusRoll(c,p[0])&&c.ailment(c.t,'狂信',c.a,false,false,null,{probabilityPercent:p[0]}))c.a.soulState.pendingSwitchFaith4898={round:c.round,turns:p[2],chance:p[3],ailment:'狂信',sourceHash:'2831e154'};return;}
 if(id===993){c.stage(c.a,p[0]*(conditionStatusRules.active(c.t,'狂信',c.round)?2:1));return;}
 if(id===1689){if(!c.crit)throw Error('Q-4898-003：本回合未暴击的PP结算时点及整回合统计待确认');return;}
 if(id===1843){if((c.settledDamage??c.dealt)>p[0]&&statusRoll(c,p[1]))c.ailment(c.t,'疲惫',c.a,false,false,null,{probabilityPercent:p[1]});return;}
 },...(id===1689?{deploymentPendingFor(p,m,i){if(exact4898(p,m,i,id))return 'Q-4898-003：本回合未暴击PP结算待确认';}}:{}),...(id===1562?{deferredFor(p,m,i){if(exact4898(p,m,i,id))return '当前狂信已真实施加；后续主动切换后的回合开始施加狂信依赖真实换宠';return old.deferredFor?.(p,m,i)??old.deferred;}}:{})});}
`);
console.log('installed 4898 known current-opponent branches; unknown branches remain explicit');
