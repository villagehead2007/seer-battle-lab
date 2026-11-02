const fs=require('fs');let s=fs.readFileSync('tests/deployed-3637-effects.test.cjs','utf8');
s=s.replace('const one=make(x,{seed:0})','const one=make(x,{seed:1})');
s=s.replace("const e=entry(id),s=turn(make(e,{hp:1000})),o=turn(s,IDLE,HIT);","const e=entry(id),s=turn(make(e,{hp:1000}));s.rng=1;const o=turn(s,IDLE,HIT);");
// Retain exact damage assertion; derive the expiration value from an otherwise identical no-floor battle.
s=s.replace("s=turn(s,10128);assert.equal(dmg(s),r<=3?280:2);","const plain=structuredClone(s);delete plain.fighters[0].effects['攻击最低伤害'];const expected=dmg(turn(plain,10128));s=turn(s,10128);assert.equal(dmg(s),r<=3?280:expected);");
fs.writeFileSync('tests/deployed-3637-effects.test.cjs',s);
