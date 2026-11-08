'use strict';
const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json'),ids=[822,1232,173],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const bindings4876=${JSON.stringify(bindings)},metadata4876=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))},source4876=(c,id)=>bindings4876.some(x=>x.id===id&&c.m.wikiId===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index),handlers4876={
822(c){c.stealReverseWhale978();},
1232(c){const before={...c.a.stages},values=Object.fromEntries(Object.entries(before).filter(([,n])=>n<0).map(([k,n])=>[k,-n])),out=c.rewriteStageValues(c.a,values,'reverse');for(const k of out.removedNegative)c.stage(c.t,before[k],[k]);},
173(c,p){if(c.a.side===c.first&&statusRoll(c,p[0]))c.ailment(c.t,'害怕',c.a);}
};
for(const id of ${JSON.stringify(ids)}){const old=registry[id],meta=metadata4876.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase:'afterHit',validate(p,m,index){const rows=bindings4876.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(rows.length){if(!rows.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&index===x.index&&JSON.stringify(p)===JSON.stringify(x.args)))throw Error('4876 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,index);},execute(c,p){if(source4876(c,id))return handlers4876[id](c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);}});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8'),i=t.lastIndexOf('});');assert.ok(!t.includes('const bindings4876='));fs.writeFileSync(p,t.slice(0,i)+block+t.slice(i));
p='dist/souls.js';t=fs.readFileSync(p,'utf8');const old="&&!((m?.wikiId??m?.id)===38055&&m.revision==='seerapi:475956df'))throw Error('confirmed978 source required');";assert.equal(t.split(old).length,2);t=t.replace(old,"&&!((m?.wikiId??m?.id)===38055&&m.revision==='seerapi:475956df')&&!((m?.wikiId??m?.id)===38285&&m.revision==='seerapi:5acd2cb9'))throw Error('confirmed978 source required');");fs.writeFileSync(p,t);
const soul=`
const source2063=c=>'soul2063:f339f486:owner'+c.a.side,randomStages2063=(c,f,delta)=>{const pool=Object.keys(f.stages),selected=[];for(let i=0;i<3;i++){const k=pool.splice(Math.floor(c.random()*pool.length),1)[0];selected.push(k);c.stage(f,delta,[k]);}return selected;};
registry[2063]={name:'方术·悠悠',sourceHash:'f339f486',traits:{},hooks:{
roundStart(c){const values=[...Object.values(c.a.stages),...Object.values(c.t.stages)],positive=values.reduce((n,v)=>n+Math.max(0,v),0),negative=values.reduce((n,v)=>n+Math.max(0,-v),0),source=source2063(c);if(positive>=negative)for(const f of[c.a,c.t])c.refreshShield(f,positive*15,source);if(positive<=negative)for(const f of[c.a,c.t])c.refreshBarrier(f,negative*15,source);(c.a.soulState.balanceRound2063??=[]).push({round:c.round,positive,negative,shield:positive>=negative?positive*15:null,barrier:positive<=negative?negative*15:null,sourceHash:'f339f486'});},
afterHit(c){if(c.m.kind==='item')return;const slot=c.a.moves.indexOf(c.m.id);if(slot<0||slot>3)return;let chosen;if(slot===0||slot===2){c.refreshShield(c.a,200,source2063(c));chosen=randomStages2063(c,c.t,-1);}else{c.heal(c.a,200,'方术悠悠偶数格魂印回复','soul');chosen=randomStages2063(c,c.a,1);}(c.a.soulState.slotHits2063??=[]).push({round:c.round,slot:slot+1,move:c.m.id,chosen,kind:slot%2===0?'shield-and-weak':'heal-and-boost',sourceHash:'f339f486'});}
}};
`;
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');i=t.lastIndexOf('});');assert.ok(!t.includes('const source2063='));fs.writeFileSync(p,t.slice(0,i)+soul+t.slice(i));
const E=require('../../../dist/engine.js');console.log({id:4876,issues:E.WIKI.assess(s,[38285,29277,29278,38286,38287]).issues});
