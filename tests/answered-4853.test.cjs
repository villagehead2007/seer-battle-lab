'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4853/snapshot.json');
const H=require('./helpers/remaining-battle.cjs')(source),{E,make,turn,timer,key,sum}=H,lyric=()=>E.WIKI.effectsEngine.registry[2378];
const loadout=[38171,29215,29216,38172,38173];
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);fn(event,c);}};try{return run();}finally{E.SOULS=old;}}
test('4853已答眷颂：结束后才得对应唱词，当回合已得不再授，非四首无唱词且未用不授',()=>{
 const s=make({move:38171,index:-1,soul:true,loadout});let before;observe((event,c)=>{if(event==='roundEnd'&&c.a.side===0)before=lyric().lyricState4853(c.a).list.length;},()=>turn(s,38171,null));assert.equal(before,0);assert.deepEqual(lyric().lyricState4853(s.fighters[0]).list,[2372]);
 const gained=make({move:38173,index:0,soul:true,loadout});turn(gained,38173,null);assert.equal(lyric().lyricState4853(gained.fighters[0]).list.length,1);
 const other=make({move:38206,index:-1,soul:true});turn(other,38206,null);assert.deepEqual(lyric().lyricState4853(other.fighters[0]).list,[]);
 const unused=make({move:38171,index:-1,soul:true,loadout});unused.fighters[0].ailments['疲惫']=3;turn(unused,38171,null);assert.deepEqual(lyric().lyricState4853(unused.fighters[0]).list,[]);
});
test('4853已答破黯穿穹：只按不同唱词与远古光克制附属性直伤，防御减伤盾罩免伤及倍率均不参与，不额外扣PP',()=>{
 for(const mode of ['plain','guarded']){const s=make({move:29215,index:-1,soul:true,loadout}),a=s.fighters[0],b=s.fighters[1];lyric().lyricState4853(a).list=[2372,2372,2373,2374];if(mode==='guarded'){b.stats.def=9999;b.stats.spd=9999;b.suitState.shield=5000;b.suitState.barrier=5000;timer(s,1,'当回合免伤');timer(s,1,'全伤害减半');timer(s,1,'所受伤害倍增',{multiple:3});timer(s,0,'全伤害翻倍');b.counts.attackNullify=2;}
 const pp={...a.pp},expected=Math.floor(150*E.typeEffectiveness('远古光',b.type,s.typeChart));turn(s,29215,20309);const events=s.damageEvents.filter(e=>e.type==='attack'&&e.redCategory==='attribute'&&e.sourceSide===0);assert.equal(events.length,1);assert.equal(events[0].settledDamage,expected,mode);assert.equal(s.fighters[0].soulState.lyricBursts4853[0].different,3);assert.equal(lyric().lyricState4853(s.fighters[0]).list.length,0);for(const k of a.moves)assert.equal(s.fighters[0].pp[k],pp[k]-(k===key(29215)?1:0));if(mode==='guarded'){assert.equal(s.fighters[1].suitState.shield,5000);assert.equal(s.fighters[1].suitState.barrier,5000);assert.equal(s.fighters[1].counts.attackNullify,2);}}
});
test('4853补答008：仅原本已有曝才得四号位唱词，首次附曝不授，四号位非四首不授，曝只有一层',()=>{
 for(const mode of ['new','existing','no-lyric','killed']){const ids=mode==='no-lyric'?[38171,29215,29216,38206,38173]:loadout,s=make({move:29215,index:-1,soul:true,loadout:ids});lyric().lyricState4853(s.fighters[0]).list=[2372,2373,2374,2375];if(mode!=='new')s.fighters[1].soulState.exposure4853={sourceSoul:2038,sourceSide:0};if(mode==='killed')s.fighters[1].hp=1;turn(s,29215,20309);if(mode!=='killed')assert.ok(s.fighters[1].soulState.exposure4853);assert.deepEqual(lyric().lyricState4853(s.fighters[0]).list,['existing','killed'].includes(mode)?[2375]:[]);const mark=s.fighters[1].soulState.exposure4853;assert.equal(E.SOULS.registry[2038].abilities.expose({a:s.fighters[0],t:s.fighters[1]}),false);assert.equal(s.fighters[1].soulState.exposure4853,mark);}
});
test('4853已答第五无盾量不补抽唱词：四种已齐不再获得，部分候选等概率且不重复已有唱词',()=>{
 const full=make({move:38173,index:0});lyric().lyricState4853(full.fighters[0]).list=[2372,2373,2374,2375];turn(full);assert.deepEqual(lyric().lyricState4853(full.fighters[0]).list,[2372,2373,2374,2375]);
 const seen=new Set();for(let seed=1;seed<=32;seed++){const s=make({move:38173,index:0,seed:Math.imul(seed,0x9e3779b1)>>>0});lyric().lyricState4853(s.fighters[0]).list=[2372,2373];turn(s);const id=lyric().lyricState4853(s.fighters[0]).list.at(-1);assert.ok([2374,2375].includes(id));seen.add(id);}assert.deepEqual(seen,new Set([2374,2375]));
});
test('4853已答2383：忽略实际盾承伤量向下计50档，零红不授；MISS保留且下一命中含免红消费',()=>{
 for(const shield of [49,50,99,150]){const s=make({move:38173,index:1,aStats:{spa:3000}});s.fighters[1].suitState.shield=shield;turn(s,38173,20309);assert.equal(s.fighters[1].suitState.shield,shield);const ignored=Math.min(shield,sum(s)),fraction=Math.floor(ignored/50)*.25;assert.equal(s.fighters[0].soulState.pendingShieldBoost4853?.fraction??0,fraction);if(!fraction)continue;const next=s.fighters[0].moves.find(k=>k!==key(38173)&&s.moveDefinitions[k].kind!=='status');s.moveDefinitions[next].operations=[];const baseline=structuredClone(s),boosted=structuredClone(s);delete baseline.fighters[0].soulState.pendingShieldBoost4853;for(const q of [baseline,boosted]){q.fighters[1].suitState.shield=0;q.fighters[1].suitState.shieldLayers=[];q.fighters[1].suitState.barrier=0;q.fighters[1].suitState.barrierLayers=[];q.fighters[1].hp=9000;}turn(baseline,Number(next.slice(5)),20309);turn(boosted,Number(next.slice(5)),20309);assert.ok(Math.abs(sum(boosted)-sum(baseline)*(1+fraction))<=2);assert.equal(boosted.fighters[0].soulState.pendingShieldBoost4853,undefined);delete s.fighters[0].effects['攻击必中'];timer(s,0,'攻击必失');turn(s,Number(next.slice(5)),20309);assert.equal(s.fighters[0].soulState.pendingShieldBoost4853.fraction,fraction);delete s.fighters[0].effects['攻击必失'];timer(s,0,'攻击必中');timer(s,1,'攻击伤害免疫');turn(s,Number(next.slice(5)),20309);assert.equal(s.fighters[0].soulState.pendingShieldBoost4853,undefined);assert.equal(sum(s),0);}
 const zero=make({move:38173,index:1});zero.fighters[1].suitState.shield=500;timer(zero,1,'攻击伤害免疫');turn(zero);assert.equal(zero.fighters[0].soulState.pendingShieldBoost4853,undefined);
});
test('4853已答458：完整红伤回复不按残血或保1截断，后手和技能禁疗保留各自限制',()=>{
 for(const mode of ['low','floor','ban','late']){const s=make({move:38213,index:0,hp:1000,aStats:{atk:2000,spe:mode==='late'?1:500},targetHp:1});if(mode==='floor')timer(s,1,'致命保留',{hp:1});if(mode==='ban')timer(s,0,'技能禁疗');turn(s,38213,20309);const red=sum(s);assert.ok(red>1);assert.equal(s.fighters[0].hp,['ban','late'].includes(mode)?1000:Math.min(9000,1000+red),mode);}
});
test('4853已答曝减抗：减20个百分点、零及负值钳零且只一层，18抗实战不能抵抗，超过50抗不变',()=>{
 const ability=E.SOULS.registry[2038].abilities;
 for(const [raw,expected]of [[-.1,0],[0,0],[.18,0],[.4,.2],[.5,.3],[.51,.51]]){const s=make({move:38206,index:-1});ability.expose({a:s.fighters[0],t:s.fighters[1]});assert.ok(Math.abs(ability.resistance(s.fighters[1],raw)-expected)<1e-12);ability.expose({a:s.fighters[0],t:s.fighters[1]});assert.ok(Math.abs(ability.resistance(s.fighters[1],raw)-expected)<1e-12);}
 const baselineResults=new Set();for(let seed=1;seed<=24;seed++){for(const exposed of [false,true]){const s=make({move:38206,index:-1,seed:Math.imul(seed,0x9e3779b1)>>>0});s.fighters[1].build.resistance.slots=[{name:'中毒',chance:18}];if(exposed)ability.expose({a:s.fighters[0],t:s.fighters[1]});let applied;observe((event,c)=>{if(event==='beforeUse'&&c.a.side===0)applied=c.ailment(c.t,'中毒',c.a,false,false,2);},()=>turn(s,38206,20309));if(exposed){assert.equal(applied,true);assert.ok(s.fighters[1].ailments['中毒']);}else baselineResults.add(applied);}}assert.deepEqual(baselineResults,new Set([false,true]));
});
test('4853已答永沐：最终概率跨50判资格，原始零不执行，寒月或亮封零仍曝且不强行附异常',()=>{
 for(const mode of ['zero','fifty','high','up','down','moon','bright']){const s=make({move:38206,index:-1,soul:true}),p=mode==='zero'?0:mode==='high'||mode==='down'?60:mode==='up'?40:50,old=E.CELESTIAL_RULES;let final,applied=false;
 if(mode==='moon')E.CELESTIAL_RULES.add(s,'寒月',1,2,1);if(mode==='bright')s.fighters[1].soulState.bright2009=2;
 if(mode==='up'||mode==='down')E.CELESTIAL_RULES={...old,probability:(state,f,n,r)=>mode==='up'?n*2:n/2};
 try{observe((event,c)=>{if(event==='beforeUse'&&c.a.side===1){const crossed=mode==='up'||mode==='down';final=crossed?E.CELESTIAL_RULES.probability(null,c.a,p,c.round):c.statusProbability(p);if(c.ailmentRoll4853(crossed?p:final,c.random())<final/100)applied=c.ailment(c.t,'中毒',c.a,false,false,2);}},()=>turn(s,38206,20309));}finally{E.CELESTIAL_RULES=old;}
 const expected=!['zero','high','up'].includes(mode);assert.equal(!!s.fighters[1].soulState.exposure4853,expected,mode);if(['zero','moon','bright'].includes(mode)){assert.equal(applied,false);assert.equal(s.fighters[0].ailments['中毒'],undefined);}if(mode==='up')assert.equal(final,80);if(mode==='down')assert.equal(final,30);
 }
});
