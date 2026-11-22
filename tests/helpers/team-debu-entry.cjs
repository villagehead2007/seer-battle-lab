'use strict';
const E=require('../../dist/engine.js'),T=require('../../dist/team-engine.js'),store=require('../../local-species.cjs');
function member(id,skills=[],stats={}){const snapshot=store.species(id),moves=E.WIKI.defaultMoves(snapshot);let index=1;for(const skill of skills)if(!moves.includes(skill))moves[index++]=skill;return {snapshot,moves,build:{overrides:{maxHp:9000,atk:180,spa:180,def:2000,spd:2000,spe:500,...stats}}};}
function entry(deaths,{foeId=3056,foeSkills=[10127,20117],killSkill=10127,ownStats={},ownSkills=[],ownFallen=null,ownHp=null}={}){
 const own=[member(3056),member(4499,ownSkills,ownStats),...[2988,2995,3102,3223].map(id=>member(id))],foe=[member(foeId,foeSkills,{atk:9999,spa:9999,spe:9999}),...[2988,2995,3102,3223,3311].filter(id=>id!==foeId).map(id=>member(id))];
 if(foe.length!==6)throw Error('测试需六名不同真实成员');let g=T.create([own,foe],[deaths===0?1:0,0],{seed:14,criticals:false});if(ownHp!==null)g.slots[0][1].fighter.hp=ownHp;if(deaths===0)return g;
 if(ownFallen==null){const candidates=[...g.slots[0].slice(2),...g.slots[1].slice(1)];for(const slot of candidates.slice(0,deaths-1))slot.fighter.hp=0;}else{if(ownFallen<1||ownFallen>5||deaths-ownFallen<0||deaths-ownFallen>5)throw Error('场下阵亡分配无效');for(const slot of g.slots[0].slice(2,ownFallen+1))slot.fighter.hp=0;for(const slot of g.slots[1].slice(1,1+deaths-ownFallen))slot.fighter.hp=0;}
 g.battle.fighters[0].hp=1;g=T.turn(g,['potion:pp','wiki:'+killSkill]);if(g.phase!=='replace'||!g.pending.includes(0))throw Error('未实际击败原首发');return T.replace(g,[1,null]);
}
module.exports={E,T,member,entry};
