'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4840/snapshot.json');
const {make,turn,timer,key}=require('./helpers/remaining-battle.cjs')(source);
test('4840已答2033：全强实际攻击在命中前断回合吸强，正常MISS整招无效与命中效果封锁均执行',()=>{
 for(const mode of ['normal','miss','whole','hit-block']){const s=make({move:38163,index:-1,soul:true});for(const k of Object.keys(s.fighters[0].stages))s.fighters[0].stages[k]=1;s.fighters[1].stages.atk=3;if(mode==='miss'){delete s.fighters[0].effects['攻击必中'];timer(s,0,'攻击必失');}if(mode==='whole')timer(s,0,'skillBlock');if(mode==='hit-block')timer(s,0,'技能命中效果失效');turn(s,38163,20309);assert.equal(s.fighters[1].effects['攻击必中'],undefined,mode);assert.equal(s.fighters[1].stages.atk,0,mode);assert.equal(s.fighters[0].stages.atk,4,mode);assert.equal(s.fighters[0].pp[key(38163)],source.moves.find(m=>m.id===38163).pp-1);}
});
test('4840已答2033：未全强快照、属性、控制未用和药剂不发动攻击前载荷，吸强保护失败保留敌强化',()=>{
 const statusMove=source.moves.find(m=>m.kind==='status').id;
 for(const mode of ['not-full','status','control','potion','protected']){const move=mode==='status'?statusMove:38163,s=make({move,index:-1,soul:true});if(mode!=='not-full')for(const k of Object.keys(s.fighters[0].stages))s.fighters[0].stages[k]=1;s.fighters[1].stages.atk=3;
 if(mode==='control')s.fighters[0].ailments['疲惫']=3;if(mode==='protected'){timer(s,1,'幽蝶强化保护');timer(s,1,'protect');}turn(s,mode==='potion'?null:move,20309);
 assert.equal(s.fighters[1].stages.atk,3,mode);assert.ok(s.fighters[1].effects['攻击必中'],mode);assert.equal(s.fighters[0].stages.atk,mode==='not-full'?1:1,mode);}
});
