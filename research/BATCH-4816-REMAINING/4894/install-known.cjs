'use strict';const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json');
const soul=`
const ansel4894=f=>f.soulState.ansel4894??={attackCount:0,statusCount:0,records:[],sourceHash:f.soulId===2104?'d9f1d4cd':'c352c628'};
for(const[id,hash,maximum,start,minimum]of[[2081,'c352c628',400,40,20],[2104,'d9f1d4cd',500,50,30]])registry[id]={name:'安瑟伦'+(id===2104?'·第二版本':''),sourceHash:hash,traits:{},hooks:{
 beforeBattleStart(c){ansel4894(c.a);},
 opponentAfterUse(c){if(c.actualUsed&&['physical','special','status'].includes(c.m?.kind))ansel4894(c.a).thisRound={round:c.round,kind:c.m.kind,moveId:c.m.wikiId??c.m.id};},
 combatEnd(c){if(c.a.hp<=0)return;const st=ansel4894(c.a),event=st.thisRound;if(event?.round!==c.round)return;const same=event.kind===st.lastType;st.lastType=event.kind;st.records.push({...event,same});if(same)c.timed(c.t,'同类技能先制降低4894',1,{kind:event.kind,amount:1,sourceSoul:id,sourceHash:hash},c.round+1);else c.ailment(c.t,'害怕',c.a,false,false,3,{probabilityPercent:100});},
 afterAttack(c){if(c.a.hp<=0||!conditionStatusRules.active(c.t,'害怕',c.round))return;const st=ansel4894(c.a),amount=Math.min(maximum,200+100*st.attackCount);if(!c.changeFear4894(c.t,-1))return;st.attackCount++;c.hurt(c.t,amount,'安瑟伦命中害怕后递增固定','fixed');(st.hitEvents??=[]).push({round:c.round,kind:c.m.kind,amount,count:st.attackCount});},
 afterHit(c){if(c.a.hp<=0||c.m?.kind!=='status'||!conditionStatusRules.active(c.t,'害怕',c.round))return;const st=ansel4894(c.a),pct=Math.max(minimum,start-10*st.statusCount);if(!c.changeFear4894(c.t,1))return;st.statusCount++;healthRules.drainPercent(c,c.t.stats.maxHp*pct/100,'安瑟伦属性命中害怕后递减吸取','安瑟伦理论等量魂印回复');(st.hitEvents??=[]).push({round:c.round,kind:c.m.kind,pct,count:st.statusCount});}
}};
`;
const rows=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({moveId:m.id,hash:m.hash,index,id:e.id,args:e.args}))).filter(e=>[1380,1195,2081,1399,1897].includes(e.id));
const meta=s.effects.find(e=>e.id===1380);
const effects=`
const rows4894=${JSON.stringify(rows)};
const exact4894=(p,m,i,id)=>rows4894.some(x=>x.id===id&&(m?.wikiId??m?.id)===x.moveId&&(m.hash===x.hash||m.revision==='seerapi:'+x.hash)&&i===x.index&&JSON.stringify(p)===JSON.stringify(x.args));
metadata[1380]=${JSON.stringify({info:meta.template,args_num:meta.argsNum})};
add(1380,'afterHit',(c,p)=>{c.hurt(c.a,c.a.hp,c.m.name+'牺牲全部体力','direct',true);c.stage(c.t,-p[0]);c.timed(c.t,'次回合先制降低',p[1],{amount:p[2],source4894:true},c.round+1);},[[1,1],[2,2],[2,2]]);
for(const id of[1380,1195,2081,1399,1897]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(exact4894(p,m,i,id))return;if(id===1380)throw Error('1380 exact source mismatch');return old.validate(p,m,i);},execute(c,p){if(!exact4894(p,c.m,c.effectInstanceIndex,id))return old.execute(c,p);if(id===1195){c.timed(c.a,'安瑟伦受击害怕或固伤',p[0],{chance:p[1],amount:p[3],sourceHash:'881f3ceb'});return;}if(id===2081){if(!conditionStatusRules.conditionPresent(c.t,c.round)&&!c.ppReductionBlocked(c.t))randomEmpty(c,p[0]);return;}if(id===1399){if(!(c.clear(c.t)&&c.ailment(c.t,'害怕',c.a)))refreshCounter4599(c,'immune',p[1],'1399:57f7210d:0:'+c.a.side);return;}if(id===1897){const had=Object.values(c.t.stages).some(n=>n>0);if(c.clearBoost(c.t))c.timed(c.t,'攻击输出上限',p[0],{amount:p[1],perRoundAttackOutput:true,source4894:true});else if(!had)c.timed(c.t,'回复效果削减',p[2],{fraction:p[3]/100});return;}return old.execute(c,p);}});}
{const old=registry[1195];registry[1195]=Object.freeze({...old,received4894(c){if(c.a.hp<=0||c.t.hp<=0||!c.on(c.a,'安瑟伦受击害怕或固伤'))return;const e=c.a.effects['安瑟伦受击害怕或固伤'];if(!(statusRoll(c,e.chance)&&c.ailment(c.t,'害怕',c.a,false,false,null,{probabilityPercent:e.chance})))c.hurt(c.t,e.amount,'涤罪荆棘受击害怕失败固定','fixed');}});}
`;
function append(file,code){let t=fs.readFileSync(file,'utf8');const i=t.lastIndexOf('});');assert.ok(i>0);fs.writeFileSync(file,t.slice(0,i)+code+t.slice(i));}append('dist/range-souls.js',soul);append('dist/range-effects.js',effects);
let t=fs.readFileSync('dist/souls.js','utf8');function replace(a,b){assert.equal(t.split(a).length-1,1,a);t=t.replace(a,b);}
replace("function context(a,t,m=null,ailmentOrigin='soul'){", "function context(a,t,m=null,ailmentOrigin='soul'){");
replace('return {a,t,m,flushAilmentExecutions2058:',"return {a,t,m,changeFear4894(f,delta){if(![2081,2104].includes(a.soulId)||![-1,1].includes(delta))throw Error('4894 fear duration source mismatch');f=actualFighter(f);if(!statusRules.active(f,'害怕',r))return false;f.ailments['害怕']+=delta;if(f.ailments['害怕']<r)statusRules.clear(f,'害怕',name=>statusRemoved(f,name));return true;},flushAilmentExecutions2058:");
replace("fs.forEach((f,i)=>{if(selectedBattleMove(i).kind!=='item'&&on(f,'次回合先制降低'))priorities[i]-=f.effects['次回合先制降低'].amount;});","fs.forEach((f,i)=>{const m=selectedBattleMove(i);if(m.kind!=='item'&&on(f,'次回合先制降低'))priorities[i]-=f.effects['次回合先制降低'].amount;if(m.kind!=='item'&&on(f,'同类技能先制降低4894')&&m.kind===f.effects['同类技能先制降低4894'].kind)priorities[i]-=f.effects['同类技能先制降低4894'].amount;});");
replace("if(!rage&&t.hp>0)E.SOULS.run('receivedAttack'","if(!rage&&t.hp>0)E.WIKI.effectsEngine.registry[1195].received4894(skillContext(t,a,m));if(!rage&&t.hp>0)E.SOULS.run('receivedAttack'");
fs.writeFileSync('dist/souls.js',t);console.log('installed source-bound two-version 4894');
