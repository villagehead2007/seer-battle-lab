'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js');
const local=require('../local-species.cjs'),records=require('../data/statuses/statuses.json').records;
const {loadout}=require('./helpers/3001-native.cjs');
const {createRoom}=require('../lan-room.cjs');

test('异常抗性逐项对照源表，三个槽均按相同分类校验',()=>{
  for(const category of ['控制类','弱化类']){
    assert.deepEqual(E.GEAR.AILMENT_GROUPS[category],records.filter(r=>r.category===category).map(r=>r.name));
  }
  for(const record of records)for(let i=0;i<3;i++){
    const slots=[55,18,72].map((chance,j)=>({name:i===j?record.name:'',chance}));
    if(['控制类','弱化类'].includes(record.category))assert.deepEqual(E.GEAR.normalizeResistance({slots}).slots,slots);
    else assert.throws(()=>E.GEAR.normalizeResistance({slots}),/异常抗性槽/);
  }
});

test('原技能29339施加狂信，三个槽分别抵抗并获两回合免疫',()=>{
  const snapshots=[4898,4750].map(id=>local.species(id));
  for(const defender of [0,1])for(let i=0;i<3;i++){
    const bySide=pair=>defender===1?pair:pair.reverse();
    const slots=[55,18,100].map((chance,j)=>({name:i===j?'狂信':'',chance}));
    const battle=E.createBattle({wikiSnapshots:bySide([...snapshots]),wikiLoadouts:bySide([loadout(snapshots[0],[29339]),loadout(snapshots[1],[])]),
      builds:bySide([{overrides:{spe:9000}},{overrides:{maxHp:9999},resistance:{slots}}]),seed:4,criticals:false});
    const replay=E.createBattle(JSON.parse(JSON.stringify(battle.initial)));
    assert.deepEqual(replay.fighters[defender].build.resistance.slots,slots);
    const after=E.resolveTurn(replay,bySide(['wiki:29339','potion:pp']));
    assert.equal(after.fighters[defender].ailments.狂信,undefined);
    assert.equal(after.fighters[defender].resistUntil,2);
    assert.ok(after.turns[0].events.some(e=>e.text.includes('狂信抗性 '+slots[i].chance+'%：成功抵抗')));
  }
});

test('旧队伍与开局快照保留自定义普通顺序，实时配招和房间校验拒绝错位',()=>{
  const s=local.species(2988),[a,b,c,d,fifth]=E.WIKI.defaultMoves(s);
  const expected=[d,b,a,c,fifth],legacy=[d,fifth,b,a,c],member={snapshot:s,moves:legacy,build:{}};
  assert.equal(E.WIKI.assess(s,expected).supported,true);
  assert.equal(E.WIKI.assess(s,legacy).supported,false);
  const room=createRoom();
  assert.throws(()=>room.mutate(0,{op:'add',edit:room.view(0).edit,member:{id:s.id,moves:legacy}}),/号位/);
  const game=T.create([[member],[member]]);
  assert.deepEqual(game.slots[0][0].config.moves,expected);
  assert.deepEqual(member.moves,legacy);
  const restored=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[legacy,expected]});
  assert.deepEqual(restored.initial.wikiLoadouts,[expected,expected]);
  assert.deepEqual(restored.fighters[0].moves,expected.map(id=>'wiki:'+id));
  const alternate=s.moves.find(m=>!m.fifth&&!expected.includes(m.id)).id;
  assert.throws(()=>E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[[a,b,c,d,alternate],expected]}),/第5号位/);
  const dual=local.species(3388),both=dual.moves.filter(m=>m.fifth).map(m=>m.id);
  const dualMoves=E.WIKI.defaultMoves(dual);
  assert.equal(dualMoves[4],36483);
  assert.equal(E.WIKI.assess(dual,[...dualMoves.slice(0,4),30851]).supported,true);
  const ambiguous=[both[0],...dualMoves.slice(0,3),both[1]];
  assert.throws(()=>E.createBattle({wikiSnapshots:[dual,s],wikiLoadouts:[ambiguous,expected]}),/多个第五技能/);
  const versions=E.WIKI.versionSnapshots(local.species(4657));
  const partner=versions.find(v=>v.selectedSkillVersion==='partner'),original=versions.find(v=>v.selectedSkillVersion==='original');
  const partnerMoves=E.WIKI.defaultMoves(partner);
  assert.equal(partnerMoves[4],38296);
  assert.equal(E.WIKI.defaultMoves(original)[4],37432);
  assert.throws(()=>E.WIKI.prepare([original,partner],[partnerMoves,partnerMoves]),/当前版本/);
});
