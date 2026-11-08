'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../research/BATCH-4816-REMAINING/4816/snapshot.json'),neutral=require('../research/BATCH-4676-NEXT50/4766/snapshot.json');
// Isolated real-instance state tests. Native 4816 deployment remains unverified.
function make(moveId,index){
 const snapshots=[structuredClone(neutral),structuredClone(neutral)];for(const x of snapshots)x.souls=[];
 const ids=[20117,10127,10716,20309,37911],s=E.createBattle({wikiSnapshots:snapshots,wikiLoadouts:[ids,ids],criticals:false,builds:[{suit:'none',overrides:{maxHp:9000,spe:500}},{suit:'none',overrides:{maxHp:9000,spe:50}}]});
 const raw=source.moves.find(x=>x.id===moveId),compiled=E.WIKI.effectsEngine.compileInstances(raw.effectInstances.slice(0,index+1),source.effects,raw);assert.equal(compiled.issue,'');
 const key='wiki:'+moveId;s.moveDefinitions[key]={...raw,id:key,wikiId:moveId,criticalChance:1/16,operations:compiled.operations.filter(x=>x.index===index)};s.fighters[0].moves[0]=key;s.fighters[0].pp[key]=raw.pp;
 Object.assign(s.typeChart.aliases,structuredClone(source.typeChart.aliases));for(const f of s.fighters){f.effects['攻击必中']={start:1,end:99};f.effects['属性必中']={start:1,end:99};}s.rng=0x9e3779b9;return s;
}
function turn(s,id){return Object.assign(s,E.resolveTurn(s,['wiki:'+id,'wiki:20117']));}
test('4816/889真实36沸涌：消除成功施加、无回合效果不施加、免异失败仍保留消除结果',()=>{
 for(const mode of ['success','empty','immune']){const s=make(38083,0);s.fighters[1].effects={};if(mode!=='empty')s.fighters[1].effects['攻击必中']={start:1,end:99};if(mode==='immune')s.fighters[1].counts.immune=1;turn(s,38083);assert.equal(s.fighters[1].effects['攻击必中'],undefined);assert.equal(!!s.fighters[1].ailments['沸涌'],mode==='success');if(mode==='immune')assert.equal(s.fighters[1].counts.immune,0);}
});
test('4816/1054真实19瘫痪：负等级反转、零正级不触发、免弱不可解除与免异交互',()=>{
 for(const mode of ['negative','zero','positive','locked','immune']){const s=make(38084,2);s.fighters[0].stages.def=mode==='zero'?0:mode==='positive'?2:-2;if(mode==='locked')s.fighters[0].effects['弱化不可解除反转']={start:1,end:99};if(mode==='immune')s.fighters[1].counts.immune=1;turn(s,38084);assert.equal(s.fighters[0].stages.def,mode==='locked'?-2:mode==='zero'?0:2);assert.equal(!!s.fighters[1].ailments['瘫痪'],mode==='negative');if(mode==='immune')assert.equal(s.fighters[1].counts.immune,0);}
});
test('4816/1932真实35超频：4回合反弹中毒、排除超频由次数免异挡且反弹不耗次数',()=>{
 const s=make(29147,0);turn(s,29147);assert.equal(s.fighters[0].effects['免异常反弹除超频'].end,4);
 const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='beforeUse'&&c.a.side===1){c.t.counts.immune=2;assert.equal(c.ailment(c.t,'中毒',c.a,false,false,2),false);assert.equal(c.t.counts.immune,2);assert.ok(c.a.ailments['中毒']>=c.round);assert.equal(c.ailment(c.t,'超频',c.a,false,false,2),false);assert.equal(c.t.counts.immune,1);assert.equal(c.a.ailments['超频'],undefined);}}};try{turn(s,29147);}finally{E.SOULS=old;}
});
test('4816精确枚举兼容拒绝参数或版本漂移',()=>{
 for(const [move,index]of [[38083,0],[29147,0],[38084,2]]){const m=structuredClone(source.moves.find(x=>x.id===move));m.hash='changed';m.revision='seerapi:changed';assert.notEqual(E.WIKI.effectsEngine.compileInstances(m.effectInstances,source.effects,m).issue,'');const n=structuredClone(source.moves.find(x=>x.id===move));n.effectInstances[index].args[n.effectInstances[index].args.length-1]=99;assert.notEqual(E.WIKI.effectsEngine.compileInstances(n.effectInstances,source.effects,n).issue,'');}
});
