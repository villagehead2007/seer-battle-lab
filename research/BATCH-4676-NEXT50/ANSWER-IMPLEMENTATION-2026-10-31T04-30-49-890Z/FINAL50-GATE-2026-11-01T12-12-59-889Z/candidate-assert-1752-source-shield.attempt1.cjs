'use strict';
const assert=require('node:assert/strict'),sourced=require('./sourced-583-1647-battle.cjs'),shield=require('../../dist/shield-rules.js');
module.exports=function(id){let last;for(const mode of ['ordinary','protected','immune','other-layer','double-grant']){
 const {s,turn,key,instance,E}=sourced(id,1752);s.fighters[0].hp=1000;
 if(mode==='other-layer')shield.add(s.fighters[0],800,'independent-old-layer');
 if(mode==='immune')s.fighters[1].effects['固定百分比免疫']={start:1,end:99};
 let o=turn(s);const firstHp=o.fighters[0].hp;
 if(mode==='double-grant'){o=turn(o);assert.equal(o.fighters[0].hp,firstHp,'same-source refresh must not trigger disappearance');assert.equal(o.fighters[0].suitState.shield,instance.args[0]);assert.equal(Object.keys(o.fighters[0].soulState.sourceShieldReactions).length,1);}
 if(mode==='protected')o.fighters[1].effects['PP保护']={start:1,end:99};
 function attack(z,k){const m=z.moveDefinitions[k];m.kind='physical';m.type='普通';m.power=9999;m.accuracy=100;m.alwaysHit=true;m.operations=[];z.fighters[1].effects['攻击输出上限']={start:z.round,end:z.round+99,amount:instance.args[0]};return E.resolveTurn(z,[key(980031),k]);}
 const old=o.fighters[0].hp;o=attack(o,key(980040));
 assert.equal(o.fighters[0].hp,old+instance.args[1]);
 assert.equal(Object.values(o.fighters[1].pp).filter(n=>n===0).length,mode==='protected'?0:2);
 assert.equal(o.fighters[0].suitState.shield,mode==='other-layer'?800:0);
 assert.equal(Object.keys(o.fighters[0].soulState.sourceShieldReactions??{}).length,0);
 if(mode==='double-grant'){const before=o.fighters[0].hp,next=o.fighters[1].moves.find(k=>o.fighters[1].pp[k]>0);o=attack(o,next);assert.equal(o.fighters[0].hp,before-instance.args[0],'refreshed source breaks once and has no second reaction');assert.equal(Object.keys(o.fighters[0].soulState.sourceShieldReactions??{}).length,0);}
 if(mode==='immune')assert.equal(o.fighters[1].hp,9000);
 last=o;
}return last;};
