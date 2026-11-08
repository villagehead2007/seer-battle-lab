'use strict';const fs=require('fs'),assert=require('assert/strict'),source=require('./snapshot.json');
const soul=`
const ria2075=f=>f.soulState.ria2075??={history:[],gates:[],gateEvents:[],sourceHash:'9fb02d17'};
const riaAbilities2075={
 freeChoice(f,key){return f.soulId===2075&&['wiki:29303','wiki:29304','wiki:29305'].some((move,index)=>key===move&&ria2075(f).gates.includes(index));},
 entered(c){if(c.a.side===c.t.side||c.a.hp<=0||!conditionStatusRules.isAuxiliary(c.status))return;const st=ria2075(c.a),index=[0,1,2].find(n=>!st.gates.includes(n));if(index===undefined)return;st.gates.push(index);st.gateEvents.push({round:c.round,status:c.status,opened:index,sourceHash:'9fb02d17',glossaryHash:['79e06234','d58a2bec','34b55dc3'][index]});},
 end(c){const st=ria2075(c.a),current=c.selectedMove(c.a).kind==='item'?0:(c.a.soulState.resolvedPriority?.value??0),previous=st.history.at(-1)?.priority;if(previous===undefined)throw Error('Q-4888-001：首回合先制历史基准未确认');if(current!==previous){st.nextPriorityRound=c.round+1;if(current>previous)c.heal(c.a,c.a.stats.maxHp*.3,'瑞亚先制高于上回合魂印回复');else c.clearAilments(c.a);}if(st.history.every(x=>x.priority!==current)){st.nextDamageRound=c.round+1;st.nextDamageBoost=st.history.length*.3;}else{st.nextDamageRound=null;st.nextDamageBoost=0;}st.history.push({round:c.round,priority:current});}
};
registry[2075]={name:'慈辉永颂·瑞亚',sourceHash:'9fb02d17',partial:true,unimplemented:['Q-4888-001首回合历史基准'],deferred:['本人真实场下位于出战背包时，观察其他己方在场精灵对手的附属异常并打开队伍神域之门；当前本人在场的打开与个人技能选择免PP限制已实现','其他己方精灵附属异常触发回合结束关门','天之门为场下所有精灵恢复PP；地之门为场下所有精灵恢复体力；神之门向对方场下所有精灵附加真实伤害'],abilities:riaAbilities2075,traits:{skillPriority:f=>ria2075(f).nextPriorityRound===f.soulState.calculationRound?1:0,attackMultiplier:f=>1+(ria2075(f).nextDamageRound===f.soulState.calculationRound?(ria2075(f).nextDamageBoost??0):0)},hooks:{
 beforeBattleStart(c){ria2075(c.a);},
 roundStart(c){const st=ria2075(c.a);st.cleanAtStart=!conditionStatusRules.conditionPresent(c.a,c.round);st.weakAttack=false;if(!st.cleanAtStart&&c.clearBoost(c.t))c.ailment(c.t,'疲惫',c.a,false,false,null,{probabilityPercent:100});},
 orderResolved(c){const m=c.selectedMove(c.t);ria2075(c.a).weakAttack=['physical','special'].includes(m.kind)&&c.typeAffinity(m.type,c.a.type)<1;},
 beforeIncomingAttack(c){const st=ria2075(c.a);if(st.cleanAtStart&&!st.weakAttack)c.reduction=1-(1-c.reduction)*.7;},
 beforeIncomingDamage(c){const st=ria2075(c.a);if(st.cleanAtStart&&st.weakAttack&&['fixed','percent'].includes(c.type))c.amount*=1-.3*((c.damageReductionIgnore??0)>=1?0:1);},
 combatEnd(c){if(c.a.hp>0)riaAbilities2075.end(c);}
}};
`;
const rows=source.moves.flatMap(m=>m.effectInstances.map((e,index)=>({moveId:m.id,hash:m.hash,index,id:e.id,args:e.args}))).filter(x=>[613,1462,2205,574,1625,2436,2437,2433,2434,2435].includes(x.id));
const effects=`
const rows4888=${JSON.stringify(rows)};
const exact4888=(p,m,i,id)=>rows4888.some(x=>x.id===id&&(m?.wikiId??m?.id)===x.moveId&&(m.hash===x.hash||m.revision==='seerapi:'+x.hash)&&i===x.index&&JSON.stringify(p)===JSON.stringify(x.args));
for(const id of[613,1462,2205,574]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(exact4888(p,m,i,id))return;return old.validate(p,m,i);},execute(c,p){if(!exact4888(p,c.m,c.effectInstanceIndex,id))return old.execute(c,p);if(id===613){c.timed(c.a,'指定系别攻击无效',3,{type:'暗影神秘'});return;}if(id===2205){if(conditionStatusRules.conditionPresent(c.a,c.round))c.affinity=Math.max(c.typeAffinity(c.a.type,c.t.type),c.typeAffinity(c.t.type,c.a.type));return;}if(id===574){c.a.soulState.ji574NextSkill=true;c.a.soulState.ji574NextLandedCrit=true;c.hurt(c.a,c.a.hp,c.m.name+'消耗全部体力','direct',true);return;}return old.execute(c,p);}});}
${[1625,2436,2437,2433,2434,2435].map(id=>{const m=source.effects.find(x=>x.id===id);return 'metadata['+id+']='+JSON.stringify({info:m.template,args_num:m.argsNum})+';';}).join('\n')}
add(1625,'afterAttack',(c,p)=>{if((c.settledDamage??c.dealt)>p[0]&&statusRoll(c,p[1]))c.stage(c.a,p[2]);},[[300,300],[100,100],[3,3]]);
add(2436,'beforeOrder',c=>{const p=c.a.soulState.previousPriority4888;if(p===undefined)throw Error('Q-4888-001：2436首回合上回合先制基准未确认');if(p<0)throw Error('Q-4888-003：2436上回合负先制的计算未确认');c.priority+=Math.min(3,p);});
add(2437,'afterHit',c=>{if(Object.values(c.t.stages).some(n=>n>0))throw Error('Q-4888-002：2437无视成功判定与范围待确认');});
add(2433,'afterHit',(c,p)=>{const a=c.clear(c.a),t=c.clear(c.t);if(a||t)c.timed(c.t,'statusBlock',p[0],{});},[turns]);
add(2434,'afterHit',(c,p)=>{const a=c.clearBoost(c.a),t=c.clearBoost(c.t);if(a||t)c.timed(c.t,'attackBlock',p[0],{});},[turns]);
add(2435,'afterHit',(c,p)=>{const before=[c.a,c.t].reduce((n,f)=>n+Object.values(f.ailments).filter(end=>end>=c.round).length,0);c.clearAilments(c.a);c.clearAilments(c.t);const after=[c.a,c.t].reduce((n,f)=>n+Object.values(f.ailments).filter(end=>end>=c.round).length,0);if(after<before)c.timed(c.a,'免异常',p[0],{});},[turns]);
for(const id of[1625,2436,2437,2433,2434,2435]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(!exact4888(p,m,i,id))throw Error('4888 exact source mismatch '+id);}});}
`;
function append(file,code){let t=fs.readFileSync(file,'utf8');const i=t.lastIndexOf('});');assert.ok(i>0);fs.writeFileSync(file,t.slice(0,i)+code+t.slice(i));}append('dist/range-souls.js',soul);append('dist/range-effects.js',effects);
let t=fs.readFileSync('dist/souls.js','utf8');function replace(a,b){assert.equal(t.split(a).length-1,1,a);t=t.replace(a,b);}
const helpers=`
function gateSnapshot4888(f,r){return new Set(Object.keys(f.ailments).filter(k=>statusRules.isAuxiliary(k)&&f.ailments[k]>=r));}
function notifyDoors4888(s,target,before,r){for(const status of gateSnapshot4888(target,r))if(!before.has(status))for(const observer of s.fighters)if(observer.soulId===2075)E.SOULS.registry[2075].abilities.entered({a:observer,t:target,status,round:r});}
function freeDoorChoice4888(f,key){return f.soulId===2075&&E.SOULS.registry[2075].abilities.freeChoice(f,key);}
`;
replace("const entryRemoval1950=Symbol('entry-removal-1950');","const entryRemoval1950=Symbol('entry-removal-1950');"+helpers);
replace('entryAilment(f,k,n=null,entrySource=a,entryReflected=false){const windEntry=','entryAilment(f,k,n=null,entrySource=a,entryReflected=false){const gateBefore4888=gateSnapshot4888(f,1);const windEntry=');
replace('})();windCompleted=true;return result;}finally{windAttached2058(s,entrySource,windEntry,windCompleted);}','})();windCompleted=true;if(result)notifyDoors4888(s,f,gateBefore4888,1);return result;}finally{windAttached2058(s,entrySource,windEntry,windCompleted);}');
replace('function ailment(t,k,source,...args){const entry=','function ailment(t,k,source,...args){const gateBefore4888=gateSnapshot4888(t,r);const entry=');
replace('const result=ailmentPayload2058(t,k,source,...args);completed=true;return result;','const result=ailmentPayload2058(t,k,source,...args);completed=true;if(result)notifyDoors4888(s,t,gateBefore4888,r);return result;');
t=t.replaceAll("(id===f.moves[1]&&!!E.SOULS.trait(f,'secondSlotIgnorePP'))","freeDoorChoice4888(f,id)||(id===f.moves[1]&&!!E.SOULS.trait(f,'secondSlotIgnorePP'))");t=t.replaceAll("(m.id===a.moves[1]&&!!E.SOULS.trait(a,'secondSlotIgnorePP'))","freeDoorChoice4888(a,m.id)||(m.id===a.moves[1]&&!!E.SOULS.trait(a,'secondSlotIgnorePP'))");
let i=t.lastIndexOf('s.round++;for(const f of fs)');assert.ok(i>0);t=t.slice(0,i)+"for(const f of fs)if(Number(f.number)===4888)f.soulState.previousPriority4888=selectedBattleMove(f.side).kind==='item'?0:priorities[f.side];"+t.slice(i);fs.writeFileSync('dist/souls.js',t);
console.log('installed 4888 known source rules with explicit pending guards');
