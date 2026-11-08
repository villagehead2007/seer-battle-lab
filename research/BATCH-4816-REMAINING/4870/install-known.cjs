'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json'),ids=[420,1863,2161,1323],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const bindings4870=${JSON.stringify(bindings)},metadata4870=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))};
const handlers4870={
420(){throw Error('Q-4870-003：420清强类攻击反制期限与触发范围待确认');},
1863(c,p){const before=c.a.soulState.ppBeforeUse,n=c.a.moves.filter(k=>(before?.[k]??c.a.pp[k])<c.maxPP(k)).length;c.hits=p[0]+n*p[1];},
2161(c,p){grantListener4671(c,p,'库拉塔克用招弱化失败增伤',2161,{sourceBoostKey:'2161:'+c.a.side+':'+(c.m.wikiId??c.m.id)+':'+c.m.revision+':'+c.effectInstanceIndex,stages:p.slice(1,7),count:p[7],fraction:p[8]/100});},
1323(c,p){const full=c.settledDamage??c.dealt,healed=c.heal(c.a,full*p[0]/100,c.m.name+'完整红伤比例回复','skill')??0;if(c.crit&&c.a.hp>0&&c.t.hp>0&&healed>0)c.hurt(c.t,healed,c.m.name+'暴击净回复等量百分比','percent');}
};
for(const id of[420,1863,2161,1323]){const old=registry[id],meta=metadata4870.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase:id===1863?'beforeUse':'afterHit',...(id===420?{partial:true,deploymentPendingFor(){return 'Q-4870-003：420监听期限和清强分类未核实';}}:{}),validate(p,m,i){const b=bindings4870.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4870 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,i);},execute(c,p){if(bindings4870.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index))return handlers4870[id](c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);}});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const bindings4870='));let at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+block+t.slice(at));
const soul=`
const ppTotal2057=f=>f.moves.reduce((n,k)=>n+f.pp[k],0),ppDistinct2057=f=>new Set(f.moves.map(k=>f.pp[k])).size===f.moves.length,ppFrame2057=f=>f.soulState.ppFrame2057??={};
for(const[id,hash,ratio,drop,cap]of[[2057,'ba071834',30,80,3],[2102,'a2690c22',40,40,4]])registry[id]={name:'康迪亚克·魂印'+id,sourceHash:hash,partial:true,unimplemented:['Q-4870-001非精确均分与PP封锁','Q-4870-002零PP分母'],deferred:[],traits:{skillPriority:f=>ppFrame2057(f).priorityRound===f.soulState.calculationRound?ppFrame2057(f).priority:0},hooks:{
roundStart(c){const st=ppFrame2057(c.a);st.round=c.round;st.equalAtStart=!ppDistinct2057(c.a);st.sourceHash=hash;},
beforeCrit(c){if(ppFrame2057(c.a).round===c.round&&!ppFrame2057(c.a).equalAtStart)c.forceCrit=true;},
beforeDamage(c){const own=ppTotal2057(c.a),foe=ppTotal2057(c.t);if(own===0)throw Error('Q-4870-002：自身总PP为0时倍率分母待确认');c.modifier*=1+Math.max(0,Math.floor(foe/own)-1)*ratio/100;},
afterHit(c){if(c.a.hp<=0||ppFrame2057(c.a).round!==c.round||!ppFrame2057(c.a).equalAtStart)return;const restored=c.restorePP(c.a,1,'soul').reduce((n,e)=>n+e.restored,0),n=Math.max(0,400-drop*restored);healthRules.drainFixed(c,n,'康迪亚克PP恢复后固定吸取','康迪亚克固定理论魂印回复');(c.a.soulState.ppSoulEvents2057??=[]).push({round:c.round,soulId:id,sourceHash:hash,restored,requestedDrain:n});},
combatEnd(c){if(c.a.hp<=0||!ppDistinct2057(c.a))return;const values=c.a.moves.map(k=>c.a.pp[k]),total=values.reduce((n,x)=>n+x,0),mean=total/values.length;if(!Number.isInteger(mean)||c.a.moves.some(k=>c.maxPP(k)<mean)||c.ppReductionBlocked(c.a))throw Error('Q-4870-001：PP非整数均值、上限冲突或保护下分配规则待答');for(const k of c.a.moves)c.a.pp[k]=mean;if(c.a.moves.some(k=>c.a.pp[k]!==mean))throw Error('Q-4870-001：PP设置受其他资源限制影响待答');const after=ppTotal2057(c.a),st=ppFrame2057(c.a);st.priorityRound=c.round+1;st.priority=Math.min(cap,Math.max(0,total-after));(c.a.soulState.ppMeanEvents2057??=[]).push({round:c.round,soulId:id,sourceHash:hash,before:values,after:c.a.moves.map(k=>c.a.pp[k]),mean,totalBefore:total,totalAfter:after,priority:st.priority});}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const ppTotal2057='));at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));console.log({installed:4870,bindings:bindings.length});
