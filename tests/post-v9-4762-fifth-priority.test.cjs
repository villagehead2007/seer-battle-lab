'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const local=require('../local-species.cjs');

test('4762 实装的绝灭·万物哀鸣基础先制 +1，真实排序仍计先制和速度',()=>{
  const caster=local.species(4762),target=local.species(4765);
  const raw=caster.moves.find(m=>m.fifth);
  assert.deepEqual([raw.id,raw.hash,raw.priority],[37914,'dcb0a3a4',1]);
  const first={snapshot:caster,moves:E.WIKI.defaultMoves(caster),build:{overrides:{maxHp:9000,spe:50}}};
  const second={snapshot:target,moves:[10006,10167,10166,20006,37908],build:{overrides:{maxHp:9000,spe:500}}};
  const options={seed:11,criticals:false};
  for(const [opposing,priority,winner] of [[10006,0,0],[10167,1,1],[10166,2,1]]){
    for(const mode of ['single','team']){
      const selected=['wiki:37914','wiki:'+opposing];
      const s=mode==='team'?T.turn(T.create([[first],[second]],[0,0],options),selected).battle:
        E.resolveTurn(E.createBattle({...options,wikiSnapshots:[caster,target],wikiLoadouts:[first.moves,second.moves],builds:[first.build,second.build]}),selected);
      assert.equal(s.moveDefinitions['wiki:37914'].priority,1);
      assert.equal(s.fighters[0].soulState.resolvedPriority.value,1);
      assert.equal(s.fighters[1].soulState.resolvedPriority.value,priority);
      assert.equal(s.turns.at(-1).first,winner);
      assert.match(s.turns.at(-1).events[0].text,new RegExp('先制 1 / '+priority));
    }
  }
});
