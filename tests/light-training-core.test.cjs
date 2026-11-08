'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),candidate=require('../research/LIGHT-SP-2026-11-07/candidate-3311.json');
function make({soul=true,enemyAttack=300,enemySpeed=100}={}){
 const a=structuredClone(candidate),b=structuredClone(candidate);a.souls=soul?a.souls:[];if(!soul){delete a.trainingCompatibility;delete a.skillVersions;}b.souls=[];delete b.trainingCompatibility;delete b.skillVersions;b.id=900001;b.name='神途对照';
 const base=structuredClone(a.moves[0]);const neutral=(id,kind,power)=>({...base,id,name:'神途对照'+id,kind,power,pp:99,alwaysHit:true,priority:0,critical:'0/16',fifth:false,effectIds:[],effectInstances:[],description:''});
 b.moves=[neutral(900101,'status',0),neutral(900102,'physical',80)];
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[[38635,38633,29506,29507,38634],b.moves.map(x=>x.id)],criticals:false,seed:'divine-training',builds:[{overrides:{maxHp:900,atk:160,spa:100,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:enemyAttack,spa:100,def:300,spd:300,spe:enemySpeed}}]});return s;
}
const turn=(s,move=38635,enemy=900101)=>E.resolveTurn(s,['wiki:'+move,'wiki:'+enemy]);
test('神途第五初始化保存七招真实效果，按当前层数继承威力和状态',()=>{
 const s=make({soul:false});assert.deepEqual(s.fighters[0].soulState.divineJourney.inherited.map(x=>x.wikiId),[16684,16688,23771,17908,17955,30466,30469]);
 const zero=turn(s);assert.equal(zero.fighters[1].hp,9000);
 const two=make({soul:false});two.fighters[0].soulState.divineJourney.layers=2;two.fighters[1].stages.atk=2;two.fighters[0].hp=200;const out=turn(two);assert.equal(out.fighters[1].stages.atk,0);assert.equal(out.fighters[0].hp,900);assert.ok(out.fighters[0].effects['免异常']);assert.ok(out.fighters[1].hp<9000);assert.equal(out.fighters[0].soulState.divineJourney.layers,2);
});
test('神途普通形态保存层数，神灵形态回合开始向下减半并在零层恢复原系',()=>{
 const original=make({soul:false});original.fighters[0].soulState.divineJourney.layers=3;assert.equal(turn(original,38633).fighters[0].soulState.divineJourney.layers,5);
 const s=make({soul:false});s.fighters[0].soulState.divineJourney.layers=3;s.fighters[0].soulState.divineJourney.deity=true;s.fighters[0].type='神灵';const one=turn(s);assert.equal(one.fighters[0].soulState.divineJourney.layers,1);assert.equal(one.fighters[0].type,'神灵');const zero=turn(one);assert.equal(zero.fighters[0].soulState.divineJourney.layers,0);assert.equal(zero.fighters[0].type,'远古 圣灵');
});
test('神途神灵形态零PP可使用但正PP照常消耗，固定和百分比转为真实伤害',()=>{
 const s=make({soul:false});const f=s.fighters[0];f.type='神灵';f.soulState.divineJourney.deity=true;f.soulState.divineJourney.layers=7;for(const id of f.moves)f.pp[id]=0;assert.ok(E.availableMoves(f).includes('wiki:38635'));const out=turn(s);assert.equal(out.fighters[0].pp['wiki:38635'],0);assert.equal(out.fighters[0].type,'神灵');assert.ok(out.damageEvents.some(x=>x.sourceSide===0&&x.type==='attack'));
 const fixed=make({soul:false});fixed.fighters[0].type='神灵';Object.assign(fixed.fighters[0].soulState.divineJourney,{deity:true,layers:7});fixed.fighters[1].stages.atk=1;const converted=turn(fixed,38634);assert.equal(converted.fighters[0].pp['wiki:38634'],4);assert.ok(converted.damageEvents.some(x=>x.sourceSide===0&&x.type==='true'&&x.settledDamage===70));assert.equal(converted.damageEvents.filter(x=>x.sourceSide===0&&x.type==='fixed').length,0);
});
test('新638按自身上次完整受攻追加，重生获得神途层、解异常并变神灵，原版来源仍可加载',()=>{
 const s=make({enemyAttack:500,enemySpeed:800});s.fighters[0].hp=1;s.fighters[0].ailments['烧伤']=4;const out=turn(s,29507,900102);assert.equal(out.fighters[0].soulState.holyReborn,true);assert.equal(out.fighters[0].type,'神灵');assert.ok(out.fighters[0].soulState.divineJourney.layers>=1);assert.equal(out.fighters[0].ailments['烧伤'],undefined);assert.ok(out.fighters[0].lastIncomingSettledAttackDamage>0);assert.equal(require('../research/LIGHT-SP-2026-11-07/original-3311.json').snapshot.souls[0].hash,'1abcf460');
});
test('Q-LIGHT-009真实伤害穿过全伤免疫和小额伤害免疫，保留1HP仍限制最终HP',()=>{
 for(const immune of ['当回合免伤','小额伤害免疫','低伤免疫返还']){const s=make({soul:false});s.fighters[0].type='神灵';Object.assign(s.fighters[0].soulState.divineJourney,{deity:true,layers:7});s.fighters[1].stages.atk=1;s.fighters[1].effects[immune]={start:1,end:5,threshold:99999};const out=turn(s,38634);assert.ok(out.damageEvents.some(e=>e.sourceSide===0&&e.type==='true'&&e.settledDamage===70),immune);}
 const s=make({soul:false});s.fighters[0].type='神灵';Object.assign(s.fighters[0].soulState.divineJourney,{deity:true,layers:7});s.fighters[1].stages.atk=1;s.fighters[1].effects['当回合免伤']={start:1,end:5};s.fighters[1].effects['致命保留']={start:1,end:5,hp:1};s.fighters[1].hp=10;const out=turn(s,38634);assert.equal(out.fighters[1].hp,1);const event=out.damageEvents.find(e=>e.sourceSide===0&&e.type==='true');assert.equal(event.settledDamage,70);assert.equal(event.hpLoss,9);
});
test('Q-LIGHT-012第五出手快照不因反伤重生新增第三招效果，Q-LIGHT-013耗尽恢复固有系',()=>{
 const H=require('./helpers/light-source-battle.cjs'),s=H.make(38635,{soul:true,hp:1});s.fighters[0].type='龙';s.fighters[0].soulState.divineJourney.layers=2;H.timer(s,1,'受击反弹',{fraction:100},1);const reborn=H.turn(s);assert.equal(reborn.fighters[0].soulState.holyReborn,true);assert.equal(reborn.fighters[0].soulState.divineJourney.layers,3);assert.equal(reborn.fighters[0].type,'神灵');assert.equal(reborn.fighters[0].effects['每回合强化'],undefined);const next=H.turn(reborn,H.WAIT);assert.equal(next.fighters[0].soulState.divineJourney.layers,1);const expired=H.turn(next,H.WAIT);assert.equal(expired.fighters[0].soulState.divineJourney.layers,0);assert.equal(expired.fighters[0].type,'远古 圣灵');
});
test('神途神灵条件按当前系别生效，被外部改为龙系时停用零PP与固粉转真并保留层数',()=>{
 const H=require('./helpers/light-source-battle.cjs'),s=H.make(38635,{soul:true});Object.assign(s.fighters[0].soulState.divineJourney,{deity:true,layers:3});s.fighters[0].type='龙';s.fighters[0].pp['wiki:38635']=0;assert.equal(E.availableMoves(s.fighters[0]).includes('wiki:38635'),false);const out=H.turn(s,H.WAIT);assert.equal(out.fighters[0].soulState.divineJourney.layers,3);assert.equal(out.fighters[0].type,'龙');
});
module.exports={make,turn};
test('神途七层继承实际执行旧七招，三层回退去掉后四招且不保留已解锁效果',()=>{
 const H=require('./helpers/light-source-battle.cjs'),seven=H.make(38635,{hp:100});seven.fighters[0].soulState.divineJourney.layers=7;seven.fighters[1].lastSettledAttackDamage=800;const full=H.turn(seven);assert.equal(full.fighters[0].hp,900);assert.equal(full.fighters[0].effects['每回合强化'].end,3);assert.ok(full.fighters[0].effects['免异常']);assert.equal(full.fighters[1].effects['技能禁疗'].end,3);assert.equal(full.fighters[0].stages.atk,2);assert.equal(H.sum(full,'fixed'),800);
 const three=H.make(38635,{hp:100});three.fighters[0].soulState.divineJourney.layers=3;three.fighters[1].lastSettledAttackDamage=800;const back=H.turn(three);assert.equal(back.fighters[1].effects['技能禁疗'],undefined);assert.equal(H.sum(back,'fixed'),0);assert.equal(back.fighters[0].stages.atk,1);assert.ok(H.sum(full,'attack')>H.sum(back,'attack'));
});
