'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json'),ids=[1978,1441,1414,1932,973,1370],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const bindings4863=${JSON.stringify(bindings)},metadata4863=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))};
const handlers4863={
1978(c,p){const cleared=c.clearBoost(c.t),ok=cleared&&statusRoll(c,p[0])&&c.ailment(c.t,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]});if(!ok)c.hurt(c.t,c.a.stats.maxHp/p[2],c.m.name+'未触发百分比附伤','percent');},
1441(c,p){const before={...c.a.stages};c.clearNegative(c.a);if(stats.some(k=>before[k]<0&&c.a.stages[k]>before[k])&&!c.ppReductionBlocked(c.t))randomEmpty(c,p[0]);},
1414(c,p){const left=c.clear(c.a),right=c.clear(c.t);if(left||right){c.ailment(c.a,ailments[p[0]],c.a);c.ailment(c.t,ailments[p[0]],c.a);}},
1932(c,p){c.timed(c.a,'免异常反弹除沉默',p[0],{});},
973(c,p){if(c.clear(c.t)&&statusRoll(c,p[0]))c.ailment(c.t,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]});},
1370(c,p){if(!(c.clear(c.t)&&c.ailment(c.t,ailments[p[0]],c.a)))c.timed(c.t,'技能禁疗',p[1],{});}
};
for(const id of [1978,1441,1414,1932,973,1370]){const old=registry[id],meta=metadata4863.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase:'afterHit',validate(p,m,i){const b=bindings4863.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4863 exact source mismatch '+id);return;}return old.validate(p,m,i);},execute(c,p){if(bindings4863.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index))return handlers4863[id](c,p);return old.execute(c,p);}});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const bindings4863='));let at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+block+t.slice(at));
const soul=`
const frame2048=f=>f.soulState.silenceFrame2048??={};
registry[2048]={name:'艾莉安娜',sourceHash:'3088bd58',partial:false,unimplemented:[],deferred:['真实再次登场重新尝试双方100%沉默'],traits:{attackPriority:f=>frame2048(f).nextPriorityRound===f.soulState.calculationRound?frame2048(f).nextPriority:0},hooks:{
battleStart(c){c.entryAilment(c.a,'沉默',null,c.a);c.entryAilment(c.t,'沉默',null,c.a);},
roundStart(c){const st=frame2048(c.a);st.round=c.round;st.opponentSilent=conditionStatusRules.active(c.t,'沉默',c.round);if(st.opponentSilent)c.timed(c.a,'固定百分比减伤',1,{fraction:.2,source2048:true});},
opponentAfterUse(c){if(c.actualUsed&&['physical','special'].includes(c.m.kind)&&c.a.hp>0&&frame2048(c.a).round===c.round&&!frame2048(c.a).opponentSilent)c.heal(c.a,300,'艾莉安娜回初非沉默敌攻击后回复','soul');},
combatEnd(c){const st=frame2048(c.a),m=c.selectedMove(c.t),opponentAttack=c.usedSkillThisRound(c.t)&&['physical','special'].includes(m.kind);st.nextPriorityRound=c.round+1;st.nextPriority=opponentAttack?1+(c.incomingOpponentRedDamage()===0?1:0):0;st.nextPercentRound=c.outgoingSettledDamage('attack')===0?c.round+1:null;},
afterAttack(c){if(c.a.hp>0&&c.t.hp>0&&frame2048(c.a).nextPercentRound===c.round){const n=(c.settledDamage??c.dealt??0)*.5;if(n>0)c.hurt(c.t,n,'艾莉安娜下回合攻击命中50%百分比附伤','percent');}}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('registry[2048]='));at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));
p='dist/souls.js';t=fs.readFileSync(p,'utf8');function replace(a,b){assert.equal(t.split(a).length,2,a);t=t.replace(a,b);}
replace("if(on(t,'免异常反弹除流血')&&k!=='流血')","if(on(t,'免异常反弹除沉默')&&k!=='沉默'){if(source&&source!==t&&!reflected)ailment(source,k,t,false,true,duration,{...statusPolicy,origin:'reflection'});return immuneGate();}if(on(t,'免异常反弹除流血')&&k!=='流血')");
replace("||t.soulId===1973)E.SOULS.run('opponentAfterUse'","||t.soulId===1973||t.soulId===2048)E.SOULS.run('opponentAfterUse'");fs.writeFileSync(p,t);console.log({installed:4863,bindings:bindings.length});
