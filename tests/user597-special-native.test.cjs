'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
function run(id,grant,mode){const a=store.species(id),b=store.species(2989),attack=a.moves.find(m=>m.power>0&&!m.fifth).id,stats={maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000};let s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[loadout(a,[grant,attack]),E.WIKI.defaultMoves(b)],seed:14,criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:100}}]});s.fighters[0].hp=1000;s.fighters[0].effects[mode==='invalid'?'skillBlock':'攻击必失']={start:2,end:2};s=E.resolveTurn(s,['wiki:'+grant,'potion:pp']);assert.equal(s.fighters[0].soulHash,a.souls[0].hash);const before=s.fighters[0].pp['wiki:'+attack];s=E.resolveTurn(s,['wiki:'+attack,'potion:pp']);assert.equal(s.fighters[0].pp['wiki:'+attack],before-1);assert.equal((s.damageEvents??[]).filter(e=>e.round===2&&e.sourceSide===0&&e.type==='attack').reduce((n,e)=>n+e.settledDamage,0),0);const percent=s.turns.at(-1).events.filter(e=>e.damage?.sourceSide===0&&e.damage.type==='percent');return{s,percent};}
test('597鲸沫原迎涛逆戟专属吸取在实际用招整招无效后仍结算3000，不混同原魂另一次吸取',()=>{
 const{s,percent}=run(4654,28753,'invalid'),events=percent.filter(e=>e.text.includes('鲸沫用招最大比例吸取'));assert.equal(events.reduce((n,e)=>n+e.damage.settledDamage,0),3000);assert.ok(s.fighters[0].hp>1000);
});
test('597凌虎两个完整原招的专属吸取在MISS或整招无效仍各结算3000，原魂控制与成长保留',()=>{
 for(const grant of[25714,28787])for(const mode of['miss','invalid']){const{percent}=run(4663,grant,mode),events=percent.filter(e=>e.text.includes('凌虎最大体力比例吸取'));assert.equal(events.reduce((n,e)=>n+e.damage.settledDamage,0),3000);}
});
test('597米罗原简式出装已授吸取，后续MISS或整招无效仍3000，独立实际用招分支不遗漏',()=>{
 for(const mode of['miss','invalid']){const{s,percent}=run(4925,29408,mode);assert.equal(percent.reduce((n,e)=>n+e.damage.settledDamage,0),3000);assert.equal(s.fighters[0].hp,7000);}
});
