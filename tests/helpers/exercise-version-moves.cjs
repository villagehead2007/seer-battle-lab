'use strict';
const assert = require('node:assert/strict');
const E = require('../../dist/engine.js');

module.exports = function exerciseVersionMoves(source) {
  const seen = new Set();
  for (const version of E.WIKI.versionSnapshots(source)) {
    const available = E.WIKI.availableMoves(version);
    for (const move of available) {
      const selected = E.WIKI.defaultMoves(version);
      if (!selected.includes(move.id)) {
        const slot = selected.findIndex(id => available.find(m => m.id === id).fifth === move.fifth);
        assert.ok(slot >= 0, move.name);
        selected[slot] = move.id;
      }
      const state = E.createBattle({
        wikiSnapshots: [version, version],
        wikiLoadouts: [selected, E.WIKI.defaultMoves(version)],
        criticals: false,
        builds: [{overrides: {maxHp: 9999}}, {overrides: {maxHp: 9999}}]
      });
      if (version.selectedSoulId != null) assert.equal(state.fighters[0].soulId, version.selectedSoulId);
      const result = E.resolveTurn(state, ['wiki:' + move.id, 'potion:hp']);
      assert.equal(result.round, 2, move.name);
      assert.ok(result.fighters.every(f => f.hp >= 0 && f.hp <= f.stats.maxHp), move.name);
      seen.add(move.id);
    }
  }
  assert.deepEqual([...seen].sort((a,b) => a-b), source.moves.map(m => m.id).sort((a,b) => a-b));
};
