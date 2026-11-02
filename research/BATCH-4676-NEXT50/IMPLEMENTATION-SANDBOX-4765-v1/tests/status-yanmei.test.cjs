'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/public-status.cjs'),{E,S,key,game,turn,apply,timer}=H;
test('魇昧白板保留异常名称与回合显示，不遮蔽双方能力及其它异常',()=>{
 const s=game();apply(s,0,'魇昧',3);apply(s,1,'中毒',2);s.fighters[0].stages.atk=2;
 for(const side of [0,1]){const v=S.view(s.fighters,side,1);assert.equal(v[0].masked,false);assert.equal(v[0].stages.atk,2);assert.deepEqual(v[0].ailments,[{name:'魇昧',remaining:3}]);assert.deepEqual(v[1].ailments,[{name:'中毒',remaining:2}]);}
 assert.ok(E.describeEffects(s.fighters[0],1).includes('魇昧 · 余 3 回合'));
});
test('魇昧白板不改变行动顺序、攻击命中伤害、能力、PP及回合血量',()=>{
 for(const [a,b]of [[0,0],[1,1],[3,3],[4,4]]){const baseline=game(),s=structuredClone(baseline);apply(s,0,'魇昧',2);apply(s,1,'魇昧',2);let x=turn(baseline,a,b),y=turn(s,a,b);assert.equal(x.turns[0].first,y.turns[0].first);
 for(let i=0;i<2;i++){assert.equal(y.fighters[i].hp,x.fighters[i].hp);assert.deepEqual(y.fighters[i].pp,x.fighters[i].pp);assert.deepEqual(y.fighters[i].stages,x.fighters[i].stages);assert.equal(y.fighters[i].ailments['魇昧'],2);}
 x=turn(x);y=turn(y);for(let i=0;i<2;i++){assert.equal(y.fighters[i].ailments['魇昧'],undefined);assert.equal(y.fighters[i].hp,x.fighters[i].hp);assert.deepEqual(y.fighters[i].ailments,{});}}
});
test('魇昧白板仍计入异常条件，遵守刷新、清除和公共免疫',()=>{
 const s=game([[2240,[0]]]);s.moveDefinitions[key(0,0)].operations=s.moveDefinitions[key(0,1)].operations;apply(s,0,'魇昧',3);assert.equal(S.attempt(s.fighters[0],'魇昧',2,{duration:1}).endRound,3);const out=turn(s,0);assert.deepEqual(out.fighters[0].ailments,{});assert.ok(out.fighters[1].hp<1600);
 const f=game().fighters[0];f.counts.immune=1;assert.equal(S.attempt(f,'魇昧',1,{duration:3}).reason,'count-immunity');assert.equal(f.counts.immune,0);assert.deepEqual(f.ailments,{});assert.equal(S.attempt(f,'魇昧',1,{duration:2,gate:()=>false}).applied,false);assert.equal(S.attempt(f,'魇昧',1,{duration:2,resistanceChance:()=>1,random:()=>0}).reason,'resisted');assert.deepEqual(f.ailments,{});
});
test('2074抽中魇昧保留白板异常，免疫反弹正常且不登记虚假未实现',()=>{
 let chosen;for(let seed=0;seed<1024;seed++){const s=game([[2074,[1]]]);s.rng=seed;const o=turn(s,1);if(o.randomStatusEvents[0].name==='魇昧'&&o.randomStatusEvents[0].duration===3){chosen={s,o};break;}}assert.ok(chosen);const {s,o}=chosen;assert.equal(o.fighters[1].ailments['魇昧'],3);assert.equal(o.fighters[1].hp,1600);assert.equal(o.fighters[1].pp[key(1,2)],29);assert.ok(!o.pendingStatusBehaviors?.some(x=>x.name==='魇昧'));
 const im=structuredClone(s);timer(im,1,'reflect');const r=turn(im,1);assert.equal(r.fighters[1].ailments['魇昧'],undefined);assert.equal(r.fighters[0].ailments['魇昧'],3);assert.equal(r.fighters[0].hp,1600);
});
