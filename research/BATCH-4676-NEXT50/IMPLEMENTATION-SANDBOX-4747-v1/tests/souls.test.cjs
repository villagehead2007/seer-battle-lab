const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const battle=(options={})=>E.createBattle({seed:'souls-test',criticals:false,stats:[{maxHp:3000,atk:100,def:300,spe:400},{maxHp:3000,atk:100,def:300,spe:200}],...options});
const log=s=>s.turns.at(-1).events.map(e=>e.text).join('\n');

test('默认星皇与王雷伊，双方各第五、150、先手、两属性，面板取种族值',()=>{
  const s=E.createBattle();assert.deepEqual(s.fighters.map(f=>f.name),['瀚宇星皇','王·雷伊']);
  assert.deepEqual(s.fighters.map(f=>f.stats.maxHp),[481,443]);
  for(const f of s.fighters){assert.equal(f.moves.length,5);assert.equal(f.moves.filter(id=>E.MOVES[id].kind==='status').length,2);assert.equal(E.MOVES[f.moves[1]].power,150);assert.equal(E.MOVES[f.moves[2]].priority,3);}
});
test('强化魂印在开始和结束吸强，开始吸取的速度影响行动顺序',()=>{
  const s=battle();s.fighters[0].stages.spe=4;
  const out=E.resolveTurn(s,['cycle','inherit']);
  assert.equal(out.turns[0].first,1);assert.equal(out.fighters[0].stages.atk,0);
  assert.match(log(out),/回合开始吸取/);assert.match(log(out),/回合结束吸取/);
  assert.equal(s.fighters[0].stages.spe,4);
});
test('锁回合穿过免断保护，但不压缩次数与星皇之佑',()=>{
  const s=battle();s.fighters[0].effects={protect:{start:1,end:5},drain:{start:1,end:4}};s.fighters[0].counts.immune=2;
  const out=E.resolveTurn(s,['emperor5','inherit']);
  assert.equal(out.fighters[0].effects.drain,undefined);assert.equal(out.fighters[0].effects.protect,undefined);
  assert.equal(out.fighters[0].counts.immune,2);assert.ok(E.describeEffects(out.fighters[0],2).some(x=>x.includes('星皇之佑')));
  assert.match(log(out),/压缩至本回合结束/);
});
test('王雷伊低血魂印阻止断回合，不能阻止消强',()=>{
  const s=battle();s.fighters[1].hp=2000;s.fighters[1].effects.reflect={start:1,end:5};s.fighters[1].stages.atk=2;
  const out=E.resolveTurn(s,['emperorQuick','king150']);
  assert.ok(out.fighters[1].effects.reflect);assert.match(log(out),/免断保护，消除失败/);assert.match(log(out),/能力提升被清除/);
  assert.equal(out.fighters[1].pp.inherit,5);
});
test('王雷伊高血分支以回合开始体力为准，末尾攻+2速命+1',()=>{
  const s=battle();s.fighters[0].hp=1000;
  const out=E.resolveTurn(s,['gate','king150']);
  assert.equal(out.fighters[1].stages.atk,2);assert.equal(out.fighters[1].stages.spe,1);assert.equal(out.fighters[1].stages.acc,1);
});
test('先手封属仍扣PP；星皇技能失效仍能追加且只判定一次',()=>{
  let seen=false;
  for(let i=0;i<30;i++){
    const s=battle({seed:'invalid-'+i});s.fighters[0].counts.rageDouble=1;
    const out=E.resolveTurn(s,['gate','kingQuick']);
    if(!log(out).includes('技能被封锁'))continue;
    seen=true;assert.equal(out.fighters[0].pp.gate,4);assert.equal(out.fighters[0].effects.gate,undefined);
    assert.match(log(out),/星皇之怒判定 100%：触发/);assert.equal(out.fighters[0].effects.priority.start,2);
    assert.equal(out.turns[0].events.filter(e=>e.text.includes('星皇之怒判定')).length,1);break;
  }assert.ok(seen);
});
test('皇怒是独立追加，只扣原招一次PP，只回复一次星皇之赐',()=>{
  const s=battle();s.fighters[0].counts.rageDouble=1;
  const out=E.resolveTurn(s,['emperor5','inherit']);
  assert.equal(out.fighters[0].pp.emperor5,4);assert.equal(out.fighters[0].fifthUses,1);
  assert.equal(out.turns[0].events.filter(e=>e.text.includes('（星皇之怒）')).length,1);
  assert.equal(out.turns[0].events.filter(e=>e.text.includes('星皇之赐：')).length,1);
  assert.equal(out.fighters[0].counts.attackPriority,2);
});
test('皇怒无视反弹异常且不会反弹回星皇',()=>{
  let seen=false;
  for(let i=0;i<30;i++){
    const s=battle({seed:'blind-'+i});s.round=4;s.fighters[0].counts.rageDouble=1;s.fighters[1].effects.reflect={start:1,end:10};
    const out=E.resolveTurn(s,['emperor150','inherit']);
    if(log(out).includes('B 方 陷入失明')){seen=true;assert.ok(!out.fighters[0].ailments['失明']);break;}
  }assert.ok(seen);
});
test('星皇前3回合免麻痹，第4回合不再有首发保护',()=>{
  const run=round=>{const s=battle();s.round=round;for(const k of Object.keys(s.fighters[1].stages))s.fighters[1].stages[k]=1;return E.resolveTurn(s,['gate','king150']);};
  assert.match(log(run(1)),/星皇之佑免疫麻痹/);
  // Gate grants two immunities; after the lead buff expires these are consumed instead.
  assert.match(log(run(4)),/消耗 1 次异常免疫/);
});
test('被控制者不扣PP、不触发用招治疗或皇怒',()=>{
  const s=battle();s.round=4;s.fighters[0].ailments['麻痹']=5;s.fighters[0].hp=1000;s.fighters[0].effects.fullHeal={start:4,end:5};
  const out=E.resolveTurn(s,['cycle','inherit']);
  assert.equal(out.fighters[0].pp.cycle,5);assert.equal(out.fighters[0].hp,1000);assert.doesNotMatch(log(out),/星皇之怒判定/);
});
test('满回血是用招时触发，被控制时不会自动在回合末回血',()=>{
  const s=battle();s.fighters[1].hp=100;
  const out=E.resolveTurn(s,['gate','inherit']);assert.equal(out.fighters[1].hp,3000);
  out.fighters[1].hp=100;out.fighters[1].ailments['疲惫']=3;
  const next=E.resolveTurn(out,['gate','inherit']);assert.equal(next.fighters[1].hp,100);
});
test('技能成功消回合后随机清空两项PP，重新选择会排除零PP技能',()=>{
  const s=battle();s.fighters[0].hp=2000;s.fighters[1].effects.reflect={start:1,end:5};
  const out=E.resolveTurn(s,['emperorQuick','king150']);
  assert.equal(out.turns[0].events.filter(e=>e.text.includes('PP 归零')).length,2);
  for(const id of out.fighters[1].moves)if(out.fighters[1].pp[id]===0)assert.ok(!E.availableMoves(out.fighters[1]).includes(id));
});
test('自然圣灵对电4倍，电对自然圣灵0.5倍，第五按1倍',()=>{
  const out=E.resolveTurn(battle(),['emperor5','king150']);const details=out.turns[0].events.map(e=>e.detail).join('\n');
  assert.match(details,/属性 4 /);assert.match(details,/属性 0.5 /);
  assert.match(E.resolveTurn(battle(),['gate','king5']).turns[0].events.map(e=>e.detail).join('\n'),/属性 1 /);
});
test('相同种子复现所有魂印事件；重开清空次数、异常和效果',()=>{
  const s=battle();const a=E.resolveTurn(s,['cycle','stormKing']);assert.deepEqual(E.resolveTurn(s,['cycle','stormKing']),a);assert.deepEqual(E.createBattle(a.initial),s);
});
test('致死后不行动、不复活；大量合法对局保持HP、PP、次数和阶段边界',()=>{
  const s=E.createBattle({criticals:false});s.fighters[1].hp=1;
  const out=E.resolveTurn(s,['emperorQuick','inherit']);assert.equal(out.finished,true);assert.equal(out.fighters[1].pp.inherit,5);
  for(let n=0;n<50;n++){let x=battle({seed:'game-'+n});for(let r=0;r<80&&!x.finished;r++){
    const choices=x.fighters.map((f,i)=>{const m=E.availableMoves(f);return m[(n+r+i)%m.length];});x=E.resolveTurn(x,choices);
    for(const f of x.fighters){assert.ok(f.hp>=0&&f.hp<=f.stats.maxHp);for(const [id,p]of Object.entries(f.pp))assert.ok(p>=0&&p<=E.MOVES[id].pp);for(const v of Object.values(f.counts))assert.ok(v>=0);for(const v of Object.values(f.stages))assert.ok(v>=-6&&v<=6);}
  }assert.ok(x.finished);}
});
