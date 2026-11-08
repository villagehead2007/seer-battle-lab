'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),{convertMove}=require('../seerapi.cjs');
const original=require('../research/LIGHT-SP-2026-11-07/original-3311.json').snapshot;
const records=require('../research/LIGHT-SP-2026-11-07/sources.json').records;
function raw(kind,id){const record=records.find(x=>x.url===`https://api.seerapi.com/v1/${kind}/${id}`);assert.ok(record,`missing real source ${kind}/${id}`);return record.data;}
function make(id,effectId,{hp=600,targetHp=9000}={}){
 const a=structuredClone(original),b=structuredClone(original);
 const data=raw('skill',id),m=convertMove(data,{learning_level:1},data.type.id===8?'普通':'远古 圣灵');
 m.fifth=false;m.effectInstances=[523,2533,1756].includes(effectId)?m.effectInstances.slice(0,m.effectInstances.findIndex(x=>x.id===effectId)+1):m.effectInstances.filter(x=>x.id===effectId);m.effectIds=m.effectInstances.map(x=>x.id);m.description=m.effectInstances.map(x=>x.description).join('；');
 const e=raw('skill_effect_type',effectId);
 a.effects=[...a.effects.filter(x=>!m.effectIds.includes(x.id)),...m.effectIds.map(id=>{const e=raw('skill_effect_type',id);return{id:e.id,argsNum:e.args_num,template:e.info,revision:'seerapi:'+e.hash};})];
 a.souls=[];b.souls=[];
 const idle={...structuredClone(original.moves[0]),id:900010,name:'测试等待',kind:'status',power:0,pp:99,priority:0,alwaysHit:true,effectIds:[],effectInstances:[],description:'',fifth:false};
 const hit={...structuredClone(original.moves[0]),id:900011,name:'测试攻击',kind:'physical',power:40,pp:99,priority:0,alwaysHit:true,effectIds:[],effectInstances:[],description:'',fifth:false};
 const boost={...structuredClone(original.moves.find(x=>x.id===20307)),id:900012,fifth:false};
 a.moves=[m,idle,hit];b.moves=[boost,hit];b.id=900001;b.name='无魂印对照';
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[a.moves.map(x=>x.id),b.moves.map(x=>x.id)],criticals:false,seed:'light-training-effects',builds:[{overrides:{maxHp:900,atk:100,def:300,spa:100,spd:300,spe:500}},{overrides:{maxHp:9000,atk:100,def:300,spa:100,spd:300,spe:100}}]});
 s.fighters[0].hp=hp;s.fighters[1].hp=targetHp;
 return s;
}
function turn(s,id,other=900012){return E.resolveTurn(s,['wiki:'+id,'wiki:'+other]);}
test('特训2613真实回血按低体边界翻倍，满体力不超上限，技能禁疗阻挡',()=>{
 for(const [hp,want] of [[449,900],[450,750],[600,900],[900,900]]){const out=turn(make(29506,2613,{hp}),29506);assert.equal(out.fighters[0].hp,want);}
 const s=make(29506,2613,{hp:100});s.fighters[0].effects['技能禁疗']={start:1,end:5};assert.equal(turn(s,29506).fighters[0].hp,100);
});
test('特训2621任一方异常强化翻倍并解除自身，正常强化及封强化保留公共交互',()=>{
 const normal=turn(make(29507,2621),29507);assert.equal(normal.fighters[0].stages.atk,1);
 const s=make(29507,2621);s.fighters[0].ailments['烧伤']=3;const out=turn(s,29507);assert.equal(out.fighters[0].stages.atk,2);assert.equal(out.fighters[0].ailments['烧伤'],undefined);
 const enemy=make(29507,2621);enemy.fighters[1].ailments['烧伤']=3;const e=turn(enemy,29507);assert.equal(e.fighters[0].stages.def,2);assert.ok(e.fighters[1].ailments['烧伤']>=1);
 const blocked=make(29507,2621);blocked.fighters[0].effects['禁强化']={start:1,end:4};assert.equal(turn(blocked,29507).fighters[0].stages.atk,0);
});
test('特训2616疲惫成功不封属，免异失败封属并实际阻止对手后手技能',()=>{
 const s=make(29506,2616);const out=turn(s,29506);assert.ok(out.fighters[1].ailments['疲惫']>=1);assert.equal(out.fighters[1].effects.statusBlock,undefined);
 const immune=make(29506,2616);immune.fighters[1].effects['免异常']={start:1,end:4};const fail=turn(immune,29506);assert.equal(fail.fighters[1].ailments['疲惫'],undefined);assert.equal(fail.fighters[1].effects.statusBlock.end,2);assert.equal(fail.fighters[1].pp['wiki:900012'],19);assert.equal(fail.fighters[1].stages.def,0);
 const control=turn(make(29507,2621),29507);assert.equal(control.fighters[1].stages.def,1);
});
test('特训2614低攻击伤害托底180，攻击免疫仍归零并执行命中效果',()=>{
 const out=turn(make(38634,2614),38634);const attacks=out.damageEvents.filter(x=>x.sourceSide===0&&x.type==='attack');assert.equal(attacks[0].settledDamage,180);
 const s=make(38634,2614);s.fighters[1].effects['攻击伤害免疫']={start:1,end:3};const blocked=turn(s,38634);assert.equal(blocked.fighters[1].hp,9000);assert.equal(blocked.damageEvents.filter(x=>x.sourceSide===0&&x.type==='attack').reduce((n,e)=>n+e.settledDamage,0),0);
});
test('SP2619非暴击真实回血，暴击不回复，禁疗阻挡非暴击回血',()=>{
 const out=turn(make(38625,2619,{hp:100}),38625);assert.equal(out.fighters[0].hp,400);
 const s=make(38625,2619,{hp:100});s.criticals=true;s.fighters[0].effects['必定暴击']={start:1,end:3};assert.equal(turn(s,38625).fighters[0].hp,100);
 const blocked=make(38625,2619,{hp:100});blocked.fighters[0].effects['技能禁疗']={start:1,end:3};assert.equal(turn(blocked,38625).fighters[0].hp,100);
});
test('特训2615普通攻击闪避，必中命中令攻击者臣服，攻击者免异不被臣服',()=>{
 const s=make(29506,2615);const hit=s.moveDefinitions['wiki:900011'];hit.alwaysHit=false;hit.accuracy=100;
 const miss=turn(s,29506,900011);assert.equal(miss.fighters[0].hp,600);assert.equal(miss.fighters[1].ailments['臣服'],undefined);
 const sure=turn(make(29506,2615),29506,900011);assert.ok(sure.fighters[0].hp<600);assert.ok(sure.fighters[1].ailments['臣服']>=1);
 const immune=make(29506,2615);immune.fighters[1].effects['免异常']={start:1,end:5};const out=turn(immune,29506,900011);assert.ok(out.fighters[0].hp<600);assert.equal(out.fighters[1].ailments['臣服'],undefined);
});
test('最新523模板仅接纳匹配来源，原第五在行动结束实际强化',()=>{
 const s=make(30469,523);assert.equal(turn(s,30469).fighters[0].stages.atk,1);
 const candidate=structuredClone(require('../research/LIGHT-SP-2026-11-07/candidate-3311.json'));
 const m=candidate.moves.find(x=>x.id===30469);m.hash='invalid';m.revision='seerapi:invalid';assert.match(E.WIKI.compile(m,candidate).issue,/模板不匹配/);
});
test('SP2533真实疲惫成功不回PP，免异失败恢复2PP且遵守上限',()=>{
 const success=make(29502,2533);success.fighters[0].pp['wiki:900011']=1;const a=turn(success,29502);assert.ok(a.fighters[1].ailments['疲惫']>=1);assert.equal(a.fighters[0].pp['wiki:900011'],1);assert.equal(a.fighters[0].pp['wiki:29502'],4);
 const fail=make(29502,2533);fail.fighters[0].pp['wiki:900011']=1;fail.fighters[1].effects['免异常']={start:1,end:4};const b=turn(fail,29502);assert.equal(b.fighters[1].ailments['疲惫'],undefined);assert.equal(b.fighters[0].pp['wiki:900011'],3);assert.equal(b.fighters[0].pp['wiki:29502'],5);
});
test('特训1756无回合效果时补偿封属，清除成功令对手臣服，参数来源不可冒用',()=>{
 const absent=turn(make(38633,1756),38633);assert.equal(absent.fighters[1].stages.def,0);assert.equal(absent.fighters[1].counts.nextStatusInvalid,0);
 const s=make(38633,1756);s.fighters[1].effects['攻击必中']={start:1,end:4};const out=turn(s,38633);assert.equal(out.fighters[1].effects['攻击必中'],undefined);assert.ok(out.fighters[1].ailments['臣服']>=1);
 const candidate=structuredClone(require('../research/LIGHT-SP-2026-11-07/candidate-3311.json'));const m=candidate.moves.find(x=>x.id===38633);m.revision='seerapi:invalid';assert.match(E.WIKI.compile(m,candidate).issue,/参数|枚举/);
});
test('特训2611/2617/2618首次生效各得2层，再次使用不重复获得，7层封顶',()=>{
 for(const [move,id] of [[38633,2611],[29506,2617],[29507,2618]]){const s=make(move,id);const out=turn(s,move);assert.equal(out.fighters[0].soulState.divineJourney.layers,2);const next=turn(out,move);assert.equal(next.fighters[0].soulState.divineJourney.layers,2);assert.equal(next.fighters[0].soulState.divineJourney.history.length,1);const cap=make(move,id);cap.fighters[0].soulState.divineJourney={layers:6,first:{},history:[]};assert.equal(turn(cap,move).fighters[0].soulState.divineJourney.layers,7);}
});
test('特训2620真实击败得2层，未击败不加层，已6层时封顶7',()=>{
 const survive=turn(make(38634,2620),38634);assert.equal(survive.fighters[0].soulState.divineJourney,undefined);
 const kill=turn(make(38634,2620,{targetHp:1}),38634);assert.equal(kill.fighters[1].hp,0);assert.equal(kill.fighters[0].soulState.divineJourney.layers,2);
 const cap=make(38634,2620,{targetHp:1});cap.fighters[0].soulState.divineJourney={layers:6,first:{},history:[]};assert.equal(turn(cap,38634).fighters[0].soulState.divineJourney.layers,7);
});
test('凯歌2612按双方分别计数真实消除状态，消除保护不计数，固定伤害免疫仍完成清除',()=>{
 const s=make(38634,2612);s.fighters[0].stages.atk=1;s.fighters[0].stages.def=-2;s.fighters[1].stages.atk=1;const out=turn(s,38634);assert.equal(out.fighters[0].stages.atk,0);assert.equal(out.fighters[0].stages.def,0);assert.equal(out.fighters[1].stages.atk,0);assert.equal(out.damageEvents.filter(e=>e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),210);
 const protectedState=make(38634,2612);protectedState.fighters[1].stages.atk=2;protectedState.fighters[1].effects['强化保护']={start:1,end:4};const held=turn(protectedState,38634);assert.equal(held.fighters[1].stages.atk,2);assert.equal(held.damageEvents.filter(e=>e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),0);
 const immune=make(38634,2612);immune.fighters[1].stages.atk=1;immune.fighters[1].effects['固定百分比免疫']={start:1,end:4};const cleared=turn(immune,38634);assert.equal(cleared.fighters[1].stages.atk,0);assert.equal(cleared.damageEvents.filter(e=>e.sourceSide===0&&e.type==='fixed').reduce((n,e)=>n+e.settledDamage,0),0);
});
test('盛凌1774攻击选择额外先制属于固有，命中封锁仍排序但2611与1756命中效果不生效',()=>{
 const H=require('./helpers/light-source-battle.cjs'),s=H.make(38633);s.moveDefinitions['wiki:'+H.HIT].priority=3;H.timer(s,0,'攻击技能命中效果失效');const out=H.turn(s,38633,H.HIT);assert.ok(out.turns[0].events[0].text.includes('A 方 先手'));assert.equal(out.fighters[0].soulState.divineJourney,undefined);assert.equal(out.fighters[1].counts.nextStatusInvalid??0,0);assert.ok(out.fighters[1].hp<9000);
 const status=H.make(38633,{index:0});status.moveDefinitions['wiki:'+H.WAIT].priority=4;assert.ok(H.turn(status,38633,H.WAIT).turns[0].events[0].text.includes('B 方 先手'));
});
test('诸魔1065低体严格边界，回复后等量粉伤按实际回复，禁疗和满HP不产生粉伤',()=>{
 const H=require('./helpers/light-source-battle.cjs');for(const [hp,heal]of[[100,600],[449,451],[450,300],[800,100],[900,0]]){const s=H.make(29507,{index:1,hp});const out=H.turn(s);assert.equal(out.fighters[0].hp,hp+heal);assert.equal(H.sum(out,'percent'),heal);}const s=H.make(29507,{index:1,hp:100});H.timer(s,0,'技能禁疗');const blocked=H.turn(s);assert.equal(blocked.fighters[0].hp,100);assert.equal(H.sum(blocked,'percent'),0);const immune=H.make(29507,{index:1,hp:100});H.timer(immune,1,'固定百分比免疫');const out=H.turn(immune);assert.equal(out.fighters[0].hp,700);assert.equal(out.fighters[1].hp,9000);
});
test('谳世191反弹优先于次数免异，不消费自己的免异次数，免异目标不会补抽异常',()=>{
 const H=require('./helpers/light-source-battle.cjs');let reflected=false;for(let i=1;i<=24&&!reflected;i++){const s=H.make(29506,{index:0,enemyMove:23685,enemySpeed:900});s.fighters[0].counts.immune=2;s.rng=(i*0x9e3779b9)>>>0;const out=H.turn(s,29506,23685);assert.equal(out.fighters[0].ailments['疲惫'],undefined);assert.equal(out.fighters[0].counts.immune,2);reflected=out.fighters[1].ailments['疲惫']>=1;}assert.equal(reflected,true);
});
test('Q-LIGHT-014凯歌417按完整红伤70%回复，保留1HP的零损血不截断回复，免攻和禁疗独立',()=>{
 const H=require('./helpers/light-source-battle.cjs'),s=H.make(38634,{index:3,hp:100,targetHp:1});H.timer(s,1,'致命保留',{hp:1});const out=H.turn(s),red=out.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack');assert.equal(red.hpLoss,0);assert.ok(red.settledDamage>1);assert.equal(out.fighters[0].hp,100+Math.floor(red.settledDamage*.7));assert.equal(out.fighters[1].hp,1);assert.equal(out.fighters[0].effects['攻击吸血'].end,3);
 const immune=H.make(38634,{index:3,hp:100});H.timer(immune,1,'攻击伤害免疫');assert.equal(H.turn(immune).fighters[0].hp,100);const blocked=H.make(38634,{index:3,hp:100});H.timer(blocked,0,'技能禁疗');assert.equal(H.turn(blocked).fighters[0].hp,100);
});
test('臣服真实封锁红固粉，神途神灵将固伤转真后仍能附伤且凯歌清除状态正常执行',()=>{
 const H=require('./helpers/light-source-battle.cjs');for(const deity of[false,true]){const s=H.make(38634);s.fighters[0].ailments['臣服']=3;s.fighters[1].stages.atk=1;if(deity){s.fighters[0].type='神灵';s.fighters[0].soulState.divineJourney={enabled:true,layers:7,deity:true,first:{},history:[],originalType:'远古 圣灵',inherited:[]};}const out=H.turn(s);assert.equal(H.sum(out,'attack'),0);assert.equal(out.fighters[1].stages.atk,0);assert.equal(H.sum(out,'fixed'),0);assert.equal(H.sum(out,'true'),deity?70:0);}
});
