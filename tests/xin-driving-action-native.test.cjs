'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),store=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');
const traces=[];
function member(id,moves=[],stats={}){const snapshot=store.species(id);return {snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe:1000,...stats},resistance:{critical:0,fixed:0,percent:0,major:'',minor:''}}};}
function view(g){return {round:g.battle.round,active:g.active.slice(),fighters:g.battle.fighters.map(f=>({number:f.number,hp:f.hp,pp:{...f.pp},uses:{...f.soulState.skillUses},xin:f.soulState.xin?{...f.soulState.xin}:null})),turn:g.battle.turns.at(-1)};}
test('天尊首发成功驱逐占敌方第一回合行动，主人仍用招且第二回合恢复正常行动',()=>{
 let g;for(let seed=1;seed<=32;seed++){const candidate=T.create([[member(3788,[10001])],[member(2989,[10086]),member(3056,[10127])]],[0,0],{seed,criticals:false});if(candidate.battle.teamDrivenEvents[0].triggered){g=candidate;break;}}
 assert.ok(g,'must exercise actual successful random driving');const before=view(g),enemyPp=g.battle.fighters[1].pp['wiki:10127'],ownerPp=g.battle.fighters[0].pp['wiki:10001'];
 g=T.turn(g,['wiki:10001','wiki:10127']);const first=view(g);traces.push({scenario:'lead',before,first,noMidBattleWrites:true});
 assert.equal(g.battle.fighters[0].pp['wiki:10001'],ownerPp-1);assert.equal(g.battle.fighters[1].pp['wiki:10127'],enemyPp,'driven side cannot use skill in round1');assert.equal(g.battle.fighters[1].soulState.skillUses?.['wiki:10127']??0,0);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[1].pp['wiki:10127'],enemyPp-1,'round2 must not inherit consumed round1 action');
});
for(const enemySpe of [2000,100])test('辛被'+(enemySpe===2000?'先手':'后手')+'真实击杀后天尊当回合可用招，次回驱逐占对手行动且再下一回恢复',()=>{
 let g,seedUsed;for(let seed=1;seed<=30;seed++){
  let candidate=T.create([[member(3788,[10001],{def:1})],[member(2989,[10086],{atk:500,spe:enemySpe}),member(3102,[10127],{spe:enemySpe})]],[0,0],{seed,criticals:false});
  if(candidate.battle.teamDrivenEvents[0].triggered)continue;
  candidate=T.turn(candidate,['wiki:10001','wiki:10086']);const owner=candidate.battle.fighters[0];if(owner.hp>0&&owner.soulState.xin?.hp===0){g=candidate;seedUsed=seed;break;}
 }
 assert.ok(g,'must use real attack to kill xin while owner survives');const first=view(g);traces.push({scenario:enemySpe===2000?'faster-killer':'slower-killer',seed:seedUsed,first,noMidBattleWrites:true});
 assert.equal(g.battle.fighters[0].soulState.xin.deadRound,1);assert.equal(g.battle.fighters[0].soulState.skillUses?.['wiki:10001'],1,'owner acts in xin death round');assert.equal(g.active[1],1,'next-round driving uses actual random living substitute');assert.equal(g.battle.round,2);
 const enemyPp=g.battle.fighters[1].pp['wiki:10127'],ownerPp=g.battle.fighters[0].pp['wiki:10001'];g=T.turn(g,['wiki:10001','wiki:10127']);traces.at(-1).second=view(g);
 assert.equal(g.battle.fighters[0].pp['wiki:10001'],ownerPp-1);assert.equal(g.battle.fighters[1].pp['wiki:10127'],enemyPp,'round2 opponent action is occupied by driving');assert.equal(g.battle.fighters[1].soulState.skillUses?.['wiki:10127']??0,0);
 g=T.turn(g,['potion:pp','wiki:10127']);assert.equal(g.battle.fighters[1].pp['wiki:10127'],enemyPp-1,'round3 opponent acts normally');
});
test.after(()=>console.log('XIN_DRIVING_ACTION_NATIVE_TRACES '+JSON.stringify(traces)));
