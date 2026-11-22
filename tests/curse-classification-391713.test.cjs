'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/engine.js'),T=require('../dist/team-engine.js'),local=require('../local-species.cjs');
const db=require('../status-database.cjs'),{createRoom}=require('../lan-room.cjs');
const curses=['烈焰诅咒','致命诅咒','虚弱诅咒'];
const canonical=require('../data/statuses/wiki-391713.json').query.pages[143433].revisions[0];
function oldResistance(slot,curse){
  const slots=['狂信','诅咒','沸涌'].map((name,i)=>({name:i===slot?curse:name,chance:[55,18,64][i]}));
  return {major:slots[0].name,minor:slots[1].name,slots,fixed:23};
}
test('391713四行逐字对应现行记录，三槽排除衍生异常',()=>{
  assert.equal(canonical.revid,391713);
  for(const [i,name] of ['诅咒',...curses].entries()){
    const row=db.getById(23+i);
    assert.equal(row.name,name);assert.equal(row.revision,canonical.revid);
    assert.ok(canonical.slots.main['*'].includes('! '+name+'\n| '+row.description));
    assert.equal(row.category,i?'附属类':'控制类');
    assert.equal(E.STATUS_RULES.isAuxiliary(name),!!i);assert.equal(E.STATUS_RULES.isWeakening(name),false);
    assert.equal(E.GEAR.AILMENTS.includes(name),!i);
    if(!i)assert.equal(row.derivable,true);
  }
  const s=local.species(2988),room=createRoom();
  for(const side of [0,1])for(let slot=0;slot<3;slot++)for(const name of curses){
    const resistance=oldResistance(slot,name);
    assert.throws(()=>E.createBattle({builds:[{resistance},{resistance}]}),/异常抗性槽|有效的异常抗性/);
    assert.throws(()=>room.mutate(side,{op:'add',edit:room.view(side).edit,member:{id:s.id,moves:E.WIKI.defaultMoves(s),build:{resistance}}}),/异常抗性槽|有效的异常抗性/);
  }
});
test('旧开局快照与旧队伍保留其它槽、档位、合法配招及成员',()=>{
  const snap=E.createBattle().initial;delete snap.resistanceRevision;
  const snapshot=local.species(2988),moves=E.WIKI.defaultMoves(snapshot);
  for(let i=0;i<3;i++){
    const r=oldResistance(i,curses[i]),expected=r.slots.map((v,j)=>({...v,name:j===i?'':v.name}));
    assert.equal(E.GEAR.resistanceChance({build:{resistance:r}},curses[i]),0);
    snap.builds.forEach(build=>{build.resistance=r;});
    const member={snapshot,moves,build:{resistance:r}},game=T.create([[member],[member]]);
    const restored=E.createBattle(JSON.parse(JSON.stringify(snap)));
    for(const side of [0,1]){
      const slot=game.slots[side][0];assert.deepEqual(slot.config.moves,moves);assert.equal(slot.config.snapshot.id,2988);
      for(const f of [restored.fighters[side],slot.config,slot.base,slot.fighter,game.battle.fighters[side]]){
        assert.deepEqual(f.build.resistance.slots,expected);assert.equal(f.build.resistance.fixed,23);
        assert.equal(E.GEAR.resistanceChance(f,curses[i]),0);
        for(const entry of expected.filter(v=>v.name))assert.equal(E.GEAR.resistanceChance(f,entry.name),entry.chance/100);
      }
    }
    assert.equal(member.build.resistance.slots[i].name,curses[i]);
  }
  snap.builds[1].resistance={major:'致命诅咒',minor:'诅咒'};
  assert.equal(E.createBattle(snap).fighters[1].build.resistance.major,'');
  assert.equal(E.createBattle(snap).fighters[1].build.resistance.minor,'诅咒');
});
test('弥沦之镜实际回合末清除三个附属诅咒，同时保留弱化类流血',()=>{
  const mirror=local.species(3432);
  mirror.selectedSoulId=2150;
  const battle=E.createBattle({wikiSnapshots:[mirror,local.species(2988)],seed:13,criticals:false});
  for(const name of [...curses,'流血'])battle.fighters[1].ailments[name]=4;
  const after=E.resolveTurn(battle,['potion:pp','potion:pp']);
  assert.equal(after.fighters[0].soulId,2150);
  for(const name of curses)assert.equal(after.fighters[1].ailments[name],undefined);
  assert.equal(after.fighters[1].ailments.流血,4);
});

test('旧战斗中途读入，两方的首发、替补与开局记录同步迁移',()=>{
  const team=[2988,3056].map(id=>{const snapshot=local.species(id);return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{}};});
  const game=T.create([team,team]);delete game.battle.initial.resistanceRevision;
  const builds=[...game.battle.initial.builds,...game.battle.fighters.map(f=>f.build)];
  for(const slot of game.slots.flat())builds.push(slot.fighter.build,slot.base.build,slot.config.build);
  for(const build of builds)build.resistance=oldResistance(2,'虚弱诅咒');
  const next=T.turn(JSON.parse(JSON.stringify(game)),[{switchTo:1},'potion:pp']);
  assert.deepEqual(next.active,[1,0]);
  for(const slot of next.slots.flat())for(const member of [slot.config,slot.base,slot.fighter])assert.deepEqual(member.build.resistance.slots[2],{name:'',chance:64});
  assert.ok(next.battle.fighters.every(f=>E.GEAR.resistanceChance(f,'虚弱诅咒')===0));
});
