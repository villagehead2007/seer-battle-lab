'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs'),pp='potion:pp';
function make(mode,seed,{opponent=false,immune=false}={}){
 const a=S.species(3465),b=S.species(2989),stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000},s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[10499,20491]),loadout(b,[10086,20889])],builds:[{overrides:stats},{overrides:stats}],seed,criticals:false});assert.equal(s.fighters[0].soulId,778);assert.equal(s.fighters[0].soulHash,'f3a8c023');s.fighters[0].hp=5000;
 const user=s.fighters[opponent?1:0],target=s.fighters[opponent?0:1];if(mode==='miss')user.effects['攻击必失']={start:1,end:1};if(mode==='invalid')user.effects.skillBlock={start:1,end:1};if(mode==='zero')target.effects['攻击伤害免疫']={start:1,end:1};if(mode==='stopped')user.ailments['疲惫']=3;if(immune)s.fighters[1].effects['免异常']={start:1,end:9};return s;
}
function turn(s,a,b=pp){const old=E.SOULS,calls=[],drains=[];E.SOULS={...old,run(event,c){if(c.a.soulId!==778)return old.run(event,c);return old.run(event,{...c,ailmentRoll4853(chance,value){const result=c.ailmentRoll4853?c.ailmentRoll4853(chance,value):value;calls.push({event,chance,value,result});return result;},hurt(f,n,label,...rest){if(label==='圣瞳缪斯魂印吸取')drains.push({event,n});return c.hurt(f,n,label,...rest);}});}};try{return {out:E.resolveTurn(s,[a,b]),calls,drains};}finally{E.SOULS=old;}}
test('778原攻击实际使用的40睡眠在命中零伤及MISS整招无效均只判一次，免异失败授次回先制且不补抽',()=>{
 let success=0,failure=0;
 for(const mode of ['normal','zero','miss','invalid'])for(let i=1;i<=24;i++)for(const immune of [false,true]){const x=turn(make(mode,Math.imul(i,2654435761)>>>0,{immune}),'wiki:10499'),calls=x.calls.filter(c=>c.chance===40);assert.equal(calls.length,1,mode+' own40 actual use');const rolled=calls[0].result<.4,asleep=x.out.fighters[1].ailments['睡眠']>=1;if(rolled&&!immune){success++;assert.ok(asleep,mode);assert.equal(x.out.fighters[0].soulState.musePriorityRound,undefined);}else{failure++;assert.ok(!asleep,mode);assert.equal(x.out.fighters[0].soulState.musePriorityRound,2);}assert.equal(x.out.fighters[0].pp['wiki:10499'],S.species(3465).moves.find(m=>m.id===10499).pp-1);if(['miss','invalid'].includes(mode))assert.ok(!(x.out.damageEvents??[]).some(e=>e.sourceSide===0&&e.type==='attack'));}
 assert.ok(success>0&&failure>0);
});
test('778原属性真实哀叹和PP药及疲惫未出攻击均不抽40也不授攻击用后先制',()=>{
 for(const mode of ['status','item','stopped'])for(let seed=1;seed<=8;seed++){const x=turn(make(mode,seed),mode==='status'?'wiki:20491':mode==='item'?pp:'wiki:10499');assert.equal(x.calls.filter(c=>c.chance===40).length,0,mode);assert.equal(x.out.fighters[0].soulState.musePriorityRound,undefined);assert.equal(x.out.fighters[1].ailments['睡眠'],undefined);}
});
test('778对手原攻击实际用招的50反制含MISS整招无效与零伤，原属性PP药未出阴性且每次仅原判定一次',()=>{
 let slept=0,failed=0;
 for(const mode of ['normal','zero','miss','invalid','status','item','stopped'])for(let i=1;i<=24;i++){const attack=!['status','item','stopped'].includes(mode),x=turn(make(mode,Math.imul(i,2654435761)>>>0,{opponent:true}),pp,mode==='status'?'wiki:20889':mode==='item'?pp:'wiki:10086'),calls=x.calls.filter(c=>c.chance===50);assert.equal(calls.length,attack?1:0,mode);assert.equal(x.calls.filter(c=>c.chance===40).length,0);if(!attack){assert.equal(x.out.fighters[1].ailments['睡眠'],undefined);continue;}if(calls[0].result<.5){slept++;assert.ok(x.out.fighters[1].ailments['睡眠']>=1);}else{failed++;assert.equal(x.out.fighters[1].ailments['睡眠'],undefined);assert.equal(x.drains.length,1);assert.equal(x.drains[0].n,3000);}}
 assert.ok(slept>0&&failed>0);
});
test('778真实MISS且免异未触发所得先制在次回合原属性实际为加二，第三回合自然到期',()=>{
 const first=turn(make('miss',14,{immune:true}),'wiki:10499');assert.equal(first.out.fighters[0].soulState.musePriorityRound,2);
 const second=turn(first.out,'wiki:20491');assert.equal(second.out.fighters[0].soulState.resolvedPriority.value,2);assert.equal(second.calls.filter(c=>c.chance===40).length,0);
 const third=turn(second.out,'wiki:20491');assert.equal(third.out.fighters[0].soulState.resolvedPriority.value,0);assert.equal(third.calls.filter(c=>c.chance===40).length,0);
});
