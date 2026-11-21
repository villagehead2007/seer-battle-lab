'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),H=require('./helpers/report-restriction-native.cjs'),{loadout}=require('./helpers/3001-native.cjs'),{T,member,pp}=H;
const defs=[{id:3020,move:19220,denominator:3},{id:3529,move:37313,denominator:2}],traces=[];
function sourceMember(d,stats={}){const raw=H.S.species(d.id),snapshot=E.WIKI.versionSnapshots(raw).find(v=>E.WIKI.defaultMoves(v).includes(d.move))??raw;return{snapshot,moves:loadout(snapshot,[d.move]),build:member(d.id,[],stats).build};}
function bothKo(i,immune=false){const d=defs[i],amount=9000/d.denominator;for(const entrySpeed of[100,4000]){let found=false;for(let seed=1;seed<=32;seed++){
 const target=member(3008,[],{spe:entrySpeed});target.build.resistance.percent=immune?100:0;
 let g=T.create([[sourceMember(d,{atk:1000,spa:1000,spe:100}),member(3002,[],{def:1,spe:1000}),member(3008)],[member(3575,[10234,23812],{atk:180,def:1,spd:1,spe:2000}),target,member(3004)]],[1,0],{seed,criticals:false});
 g=T.turn(g,[pp,'wiki:10234']);const injuredHp=g.battle.fighters[0].hp;if(injuredHp<=0||9000-injuredHp<amount)continue;
 g=T.turn(g,[{switchTo:0},pp]);assert.equal(g.slots[0][1].fighter.hp,injuredHp);
 g=T.turn(g,['wiki:'+d.move,'wiki:23812']);assert.equal(g.battle.turns.at(-1).first,1);if(g.phase!=='replace'||g.battle.fighters[0].hp!==0||g.battle.fighters[1].hp!==0)continue;
 assert.deepEqual(g.pending,[0,1]);assert.ok(g.battle.teamEntryGrants[1].some(x=>x.effectId===840&&x.denominator===d.denominator&&x.remaining===1));assert.equal(g.slots[0][1].fighter.hp,injuredHp);
 g=T.replace(g,[1,1]);assert.equal(g.battle.fighters[0].number,'3002');assert.equal(g.slots[0][0].fighter.hp,0);assert.equal(g.battle.fighters[0].hp,injuredHp+amount,'actual ally present receives original nominal drain recovery');assert.equal(g.battle.fighters[1].hp,immune?9000:9000-amount);assert.equal(g.slots[0][2].fighter.hp,9000);assert.equal(g.slots[1][2].fighter.hp,9000);assert.equal((g.battle.teamEntryGrants[1]??[]).some(x=>x.effectId===840),false);
 const healed=g.battle.fighters[0].hp;g=T.turn(g,[pp,{switchTo:2}]);assert.equal(g.battle.fighters[1].hp,9000);assert.equal(g.battle.fighters[0].hp,healed);g=T.turn(g,[pp,{switchTo:1}]);assert.equal(g.battle.fighters[1].hp,immune?9000:9000-amount);assert.equal(g.battle.fighters[0].hp,healed);
 traces.push({id:d.id,move:d.move,seed,entrySpeed,immune,injuredHp,amount,actualAlly:'3002',originalCasterDead:true,noMidBattleWrites:true,noRngReplacement:true});found=true;break;
 }assert.equal(found,true,'natural attack+875reflection must produce genuine simultaneousKO and current-ally recovery');}return{amount,entryOrders:2};}
function noKo(i){const d=defs[i];let g=T.create([[sourceMember(d,{atk:1,spa:1}),member(3002)],[member(3002,[],{spe:100}),member(3008)]],[0,0],{seed:14,criticals:false});g=T.turn(g,['wiki:'+d.move,pp]);assert.equal(g.phase,'action');assert.ok(g.battle.fighters[1].hp>0);assert.equal((g.battle.teamEntryGrants?.[1]??[]).some(x=>x.effectId===840),false);g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.battle.fighters[0].hp,9000);assert.equal(g.battle.fighters[1].hp,9000);return{foeHp:g.battle.fighters[1].hp};}
test('3020原840真实KO与875原生反击同时阵亡，双方指定补位两种入场顺序均由当前己方恢复3000且只吸一次',()=>{const r=bothKo(0);assert.equal(r.amount,3000);assert.equal(r.entryOrders,2);});
test('3529强化37313原840同样真实双阵亡后按1/2由当前己方恢复4500且不复制给其他替补',()=>{const r=bothKo(1);assert.equal(r.amount,4500);assert.equal(r.entryOrders,2);});
test('3020原840真实双阵亡后对手合法初始100百分比抗性免伤，当前己方仍恢复理论3000且不重授',()=>{const r=bothKo(0,true);assert.equal(r.amount,3000);});
test('3020原840实际未击败不预约吸取，双方再真实换人时不产生伪造授予',()=>{const r=noKo(0);assert.equal(r.foeHp,9000);});
test('3529强化原840实际未击败不预约1/2吸取，双方换人后原目标之外无伪造扣血',()=>{const r=noKo(1);assert.equal(r.foeHp,9000);});
test.after(()=>console.log('ALLY840_NATIVE_TRACES '+JSON.stringify(traces)));
