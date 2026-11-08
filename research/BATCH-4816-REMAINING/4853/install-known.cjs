'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json');
const ids=[2022,563,131,704,916,2096,2371,2372,2373,2374,2375,2376,2377,2378,2382,2383,2384],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id)),metas=s.effects.filter(e=>ids.includes(e.id));
const block=`
// 4853 exact source instances. Unknown source semantics are explicit pending branches.
const bindings4853=${JSON.stringify(bindings)},metadata4853=${JSON.stringify(metas)},lyricIds4853=[2372,2373,2374,2375];
const lyricState4853=f=>f.soulState.lyrics4853??={list:[],gainedRound:0,equipped:{}};
const lyricCount4853=(f,id)=>(lyricState4853(f).equipped[id]??0)+lyricState4853(f).list.filter(x=>x===id).length;
function gainLyric4853(c,id){if(!lyricIds4853.includes(id))throw Error('Q-4853-004：非四首技能的对应唱词待确认');const st=lyricState4853(c.a);st.list.push(id);st.gainedRound=c.round;c.emit?.('梅赫维特获得唱词 '+id);return id;}
function passiveLyric4853(event,c){if(c.a.hp<=0)return;const n=id=>lyricCount4853(c.a,id);if(event==='afterUse'&&c.actualUsed&&c.m.kind!=='item'&&conditionStatusRules.conditionPresent(c.t,c.round))for(let i=0;i<n(2372);i++)c.stage(c.a,1);if(event==='combatEnd'&&c.a.hp<c.t.hp)for(let i=0;i<n(2373);i++)c.restorePP(c.a,1,'skill');if(event==='damageTaken'&&c.type==='attack'&&c.settledDamage>0&&Object.values(c.t.stages).some(x=>x>0)&&n(2374))c.timed(c.t,'id984',1,{amount:-n(2374)},c.round+1);if(event==='timedCleared'&&Object.values(c.t.effects).some(e=>conditionStatusRules.timedPresent(e,c.round)))for(let i=0;i<n(2375);i++)c.heal(c.a,c.a.stats.maxHp/6,'摇篮曲回合被清回复','skill');}
const handlers4853={
2022(c,p){if(conditionStatusRules.active(c.t,ailments[p[0]],c.round))c.timed(c.t,'属性技能命中效果失效',p[1],{});},
563(c,p){c.timed(c.t,'特攻伤害后烧伤4853',p[0],{sourceSide:c.a.side});},
131(c,p){if(c.t.gender===p[0])c.timed(c.a,'攻击伤害免疫',1,{});},
704(c,p){c.heal(c.a,c.a.hp<p[1]?c.a.stats.maxHp:p[0],c.m.name+'回复','skill');},
916(c,p){if(!statusRoll(c,p[0])||!c.ailment(c.t,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]}))c.heal(c.a,c.a.stats.maxHp,c.m.name+'未触发回满','skill');},
2096(c,p){const had=conditionStatusRules.active(c.t,'烧伤',c.round),ok=statusRoll(c,p[0])&&c.ailment(c.t,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]});if(had||!ok)c.timed(c.a,'攻击伤害免疫',p[3],{});},
2371(c,p){if(statusRoll(c,p[0])&&c.ailment(c.a,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]}))refreshCounter4599(c,'attackNullify',p[2],'2371:'+c.a.side+':'+c.m.id+':'+c.m.revision);},
2372(c){lyricState4853(c.a).equipped[2372]=1;},2373(c){lyricState4853(c.a).equipped[2373]=1;},2374(c){lyricState4853(c.a).equipped[2374]=1;},2375(c){lyricState4853(c.a).equipped[2375]=1;},
2376(c){c.stage(c.a,lyricState4853(c.a).list.length?1:2);},
2377(c,p){c.power+=Object.values(c.t.stages).filter(x=>x<0).length*p[0];},
2378(c){const pool=lyricIds4853.filter(id=>!lyricState4853(c.a).list.includes(id));if(!pool.length)throw Error('Q-4853-004：未持有唱词候选耗尽待确认');gainLyric4853(c,pool[Math.floor(c.random()*pool.length)]);},
2382(c){if(c.t.soulState.exposure4853)c.priority++;},
2383(c){c.ignoreShield=true;if((c.t.suitState?.shield??0)>0)throw Error('Q-4853-005：无视盾点数与下次增伤计算待确认');},
2384(c){if(c.t.soulState.exposure4853&&conditionStatusRules.active(c.t,'烧伤',c.round))c.convertAilment4853(c.t,'烧伤','焚烬');}
};
for(const[idText,fn]of Object.entries(handlers4853)){const id=+idText,old=registry[id],meta=metadata4853.find(e=>e.id===id),phase=lyricIds4853.includes(id)?'battleStart':[2377,2383].includes(id)?'beforeDamage':id===2382?'beforeOrder':'afterHit';registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase,...(lyricIds4853.includes(id)?{preEntry:true}:{}),...(id===2382?{hooks:{...old?.hooks,beforeAccuracy(c){if((c.m.wikiId??c.m.id)===38171&&c.m.revision==='seerapi:fecd243e'){if(c.t.soulState.exposure4853)c.alwaysHit=true;return;}return old?.hooks?.beforeAccuracy?.(c);}}}:{}),validate(p,m,i){const b=bindings4853.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4853 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,i);},execute(c,p){if(bindings4853.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index))return fn(c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);},...(id===2378?{lyricState4853,lyricCount4853,gainLyric4853,passiveLyric4853}:{}),...(id===2383?{partial:true,deploymentPendingFor(p,m,i){return (m.wikiId??m.id)===38173?'效果2383待确认Q-4853-005':old?.deploymentPendingFor?.(p,m,i);}}:{})});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('const bindings4853='));let at=t.lastIndexOf('});');assert.ok(at>0);t=t.slice(0,at)+block+t.slice(at);fs.writeFileSync(p,t);
const soul=`
registry[2038]={name:'梅赫维特',sourceHash:'5382550b',partial:true,unimplemented:[],deferred:['真实主动换宠使用1号位技能及唱词、再次登场曝回复与免反、下场后己方下只登场免反；破黯穿穹重复唱词的场下队友回复'],traits:{},abilities:{expose(c){if(c.t.hp>0){c.t.soulState.exposure4853={sourceSoul:2038,sourceSide:c.a.side};c.t.soulState.defeatEffectsSuppressed={sourceSoul:2038,sourceSide:c.a.side};}}},hooks:{
roundStart(c){const list=E.WIKI.effectsEngine.registry[2378].lyricState4853(c.a).list;c.a.soulState.lyricFrame4853={round:c.round,count:list.length};},
beforeIncomingAttack(c){const e=c.a.soulState.lyricFrame4853;if(e?.round===c.round)c.reduction=1-(1-c.reduction)*(1-Math.min(1,e.count*.15));},
actionEnd(c){if(E.WIKI.effectsEngine.registry[2378].lyricState4853(c.a).list.length>=4)throw Error('Q-4853-002：破黯穿穹系别伤害与额外行动结算待确认');},
roundEnd(c){if(c.used[c.a.side]&&!c.used[c.t.side])throw Error('Q-4853-001：眷颂原文与格式化时点和本回合已得唱词条件冲突');}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');assert.ok(!t.includes('registry[2038]='));at=t.lastIndexOf('});');fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));
p='dist/souls.js';t=fs.readFileSync(p,'utf8');function replace(a,b){assert.ok(t.includes(a),a.slice(0,100));t=t.replace(a,b);}
replace("statusProbability(n){return", "statusProbability(n){if(t.soulId===2038&&n<=50)E.SOULS.registry[2038].abilities.expose({...context(t,a,m),a:t,t:a});return");
replace("function ailment(t,k,source,bypass=false,reflected=false,duration=null,statusPolicy=null){", "function ailment(t,k,source,bypass=false,reflected=false,duration=null,statusPolicy=null){if(source&&source!==t&&t.soulId===2038&&statusPolicy?.probabilityPercent<=50)E.SOULS.registry[2038].abilities.expose(context(t,source));if(t.soulState.exposure4853)throw Error('Q-4853-003：曝减抗计算待确认');");
replace("E.SOULS.run('afterUse',{...context(a,t,m),", "E.WIKI.effectsEngine.registry[2378].passiveLyric4853('afterUse',{...context(a,t,m),actualUsed:!!used[a.side]});E.SOULS.run('afterUse',{...context(a,t,m),");
replace("for(const f of fs)if(f.hp>0)E.SOULS.run('combatEnd',{...context(f,fs[1-f.side]),first});", "for(const f of fs)if(f.hp>0){E.WIKI.effectsEngine.registry[2378].passiveLyric4853('combatEnd',context(f,fs[1-f.side]));E.SOULS.run('combatEnd',{...context(f,fs[1-f.side]),first});}");
replace("function recordDamage(target,source,type,settledDamage,hpLoss){", "function recordDamage(target,source,type,settledDamage,hpLoss){if(source&&type==='attack'&&settledDamage>0)E.WIKI.effectsEngine.registry[2378].passiveLyric4853('damageTaken',{...context(target,source),type,settledDamage});");
replace("restoreCopiedType(f);restoreSwappedTypes();emit(", "restoreCopiedType(f);restoreSwappedTypes();E.WIKI.effectsEngine.registry[2378].passiveLyric4853('timedCleared',context(f,by??fs[1-f.side]));emit(");
replace("function context(a,t,m=null,ailmentOrigin='soul'){", "function context(a,t,m=null,ailmentOrigin='soul'){");
replace("return {a,t,m,grantOutput4714:", "return {a,t,m,convertAilment4853(f,from,to){const end=f.ailments[from];if(!(end>=r))return false;statusRules.clear(f,from,n=>statusRemoved(f,n));f.ailments[to]=Math.max(f.ailments[to]??0,end);return true;},grantOutput4714:");
// 563 watches the target's actual special red damage, not physical or non-red events.
replace("if(settledDamage>0&&t.soulState.starFlare1849", "if(settledDamage>0&&m.kind==='special'&&on(t,'特攻伤害后烧伤4853'))ailment(t,'烧伤',fs[t.effects['特攻伤害后烧伤4853'].sourceSide],false,false,null,{probabilityPercent:100});if(settledDamage>0&&t.soulState.starFlare1849");
fs.writeFileSync(p,t);console.log({id:4853,bindings:bindings.length});
