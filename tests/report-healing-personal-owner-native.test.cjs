'use strict';const test=require('node:test'),assert=require('node:assert/strict'),T=require('../dist/team-engine.js'),S=require('../local-species.cjs'),{loadout}=require('./helpers/3001-native.cjs');const traces=[];function member(id,moves=[],spe=1000){const snapshot=S.species(id);return{snapshot,moves:loadout(snapshot,moves),build:{overrides:{maxHp:9000,atk:180,spa:180,def:4000,spd:4000,spe},resistance:{critical:0,fixed:0,percent:0,major:'',minor:''}}};}function make(seed){return T.create([[member(3482,[31357,20164]),member(3788,[32907])],[member(3002,[21684]),member(3008)]],[0,0],{seed,criticals:false});}function applied(seed){let g=make(seed);g=T.turn(g,['potion:pp','wiki:21684']);g=T.turn(g,['wiki:31357','potion:pp']);assert.equal(g.battle.fighters[1].effects['技能禁疗']?.start,2);assert.equal(g.battle.fighters[1].effects['技能禁疗']?.end,4);assert.equal(g.battle.fighters[0].effects['技能禁疗'],undefined);return g;}
 test('报告禁疗原生施放者离场不撤销原对手效果，己方继任神泣真实断回合获得成功收益',()=>{let result;for(let seed=1;seed<=32;seed++){let g=applied(seed);g=T.turn(g,[{switchTo:1},'potion:pp']);assert.equal(g.battle.fighters[1].effects['技能禁疗']?.end,4);assert.equal(g.battle.fighters[0].effects['技能禁疗'],undefined);g=T.turn(g,['wiki:32907','potion:pp']);if(!(g.battle.damageEvents??[]).some(e=>e.round===4&&e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0))continue;result=g;break;}assert.ok(result,'actual successful normal hit required');const f=result.battle.fighters[1];assert.equal(f.effects['技能禁疗'],undefined);assert.equal(f.effects['所受伤害倍增']?.multiple,2);assert.equal(f.effects['所受伤害倍增']?.start,5);assert.equal(f.effects['所受伤害倍增']?.end,6);traces.push({scenario:'caster-left-real-clear-success',round:result.battle.round,effects:f.effects,noMidBattleWrites:true});});
 test('报告禁疗原生目标离场不传新目标，神泣无可清回合不获奖励且原目标返场不恢复旧禁疗',()=>{let result;for(let seed=1;seed<=32;seed++){let g=applied(seed);g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.battle.fighters[1].number,'3008');assert.equal(g.battle.fighters[1].effects['技能禁疗'],undefined);g=T.turn(g,['wiki:32907','potion:pp']);if(!(g.battle.damageEvents??[]).some(e=>e.round===4&&e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0))continue;assert.equal(g.battle.fighters[1].effects['所受伤害倍增'],undefined);g=T.turn(g,['potion:pp',{switchTo:0}]);result=g;break;}assert.ok(result);assert.equal(result.battle.fighters[1].number,'3002');assert.equal(result.battle.fighters[1].effects['技能禁疗'],undefined);traces.push({scenario:'target-left-no-inheritance-no-reward-return-clean',round:result.battle.round,noMidBattleWrites:true});});
 test('报告禁疗原生到期后不再提供神泣断回合成功收益',()=>{let result;for(let seed=1;seed<=32;seed++){let g=applied(seed);g=T.turn(g,[{switchTo:1},'potion:pp']);g=T.turn(g,['potion:pp','potion:pp']);assert.equal(g.battle.round,5);g=T.turn(g,['wiki:32907','potion:pp']);if(!(g.battle.damageEvents??[]).some(e=>e.round===5&&e.sourceSide===0&&e.type==='attack'&&e.settledDamage>0))continue;result=g;break;}assert.ok(result);assert.equal(result.battle.fighters[1].effects['所受伤害倍增'],undefined);traces.push({scenario:'expired-no-reward',round:result.battle.round,noMidBattleWrites:true});});test.after(()=>console.log('REPORT_HEALING_PERSONAL_OWNER_NATIVE_TRACES '+JSON.stringify(traces)));

for (const [id, move, index, name] of [
  [3815, 29134, 4, '殷痕血幕'],
  [4516, 28337, 1, '陷入沉思']
]) {
  test('附录D ' + name + '的两回合回复削减是施术者自身代价', () => {
    const source = member(id, [move]);
    const {effectInstances} = source.snapshot.moves.find(entry => entry.id === move);
    const {id: effectId, args} = effectInstances[index];
    assert.equal(effectId, 2019);
    assert.deepEqual(args, [2, 100]);

    const action = 'wiki:' + move;
    const key = '回复效果削减';
    const pp = 'potion:pp';
    const initial = T.create([[source, member(3008)], [member(3002), member(3008)]],
      [0, 0], {seed: 13, criticals: false});
    const cast = T.turn(initial, [action, pp]);
    const [caster, target] = cast.battle.fighters;
    assert.equal(caster.pp[action], initial.battle.fighters[0].pp[action] - 1);
    assert.deepEqual(caster.effects[key], {start: 1, end: 2, fraction: 1});
    assert.equal(target.effects[key], undefined);

    const targetLeaves = T.turn(cast, [pp, {switchTo: 1}]);
    assert.deepEqual(targetLeaves.active, [0, 1]);
    assert.equal(targetLeaves.battle.round, 3);
    assert.equal(targetLeaves.battle.fighters[0].effects[key], undefined);
    assert.equal(targetLeaves.battle.fighters[1].effects[key], undefined);

    const casterLeaves = T.turn(cast, [{switchTo: 1}, pp]);
    assert.deepEqual(casterLeaves.active, [1, 0]);
    assert.equal(casterLeaves.battle.fighters[0].effects[key], undefined);
    assert.equal(casterLeaves.battle.fighters[1].effects[key], undefined);
    assert.equal(casterLeaves.slots[0][0].fighter.effects[key], undefined);
  });
}
