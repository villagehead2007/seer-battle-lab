'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const local=require('../local-species.cjs');
const source=local.species(3396);
const foe=local.species(4765),neutral=local.species(2987);
const pp='potion:pp',key=id=>'wiki:'+id,opt={seed:6,criticals:false};
function member(snapshot,moves,overrides={}){
  return {snapshot,moves:moves??E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:300,spa:300,def:1600,spd:1600,spe:500,...overrides}}};
}
function panda(soul,options){return member({...source,selectedSoulId:soul},[30895,10001,25553,25554,29525],options);}
function battle(a,b){return E.createBattle({...opt,wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves,b.moves],builds:[a.build,b.build]});}
function withMove(id,options={}){
  const raw=source.moves.find(m=>m.id===id),a=panda(709,options);
  if(!a.moves.includes(id))a.moves[raw.fifth?0:1]=id;
  if(raw.fifth)a.snapshot.selectedSkillVersion=`soul-709-fifth-${id}`;
  const b=member(foe,[10171,20006,20085,10006,37908],{spe:80});
  return battle(a,b);
}

test('3396 正式目录两魂两第五，每招实装后扣 PP；封招扣 PP 而不执行对应技能效果',()=>{
  const b=member(foe,[10171,20006,20085,10006,37908],{spe:80});
  const checked=new Set();
  for(const snapshot of E.WIKI.versionSnapshots(source)){
    for(const raw of E.WIKI.selectableMoves(snapshot)){
      const id=raw.id,a=panda(snapshot.selectedSoulId),legal=E.WIKI.defaultMoves(snapshot);
      a.snapshot=snapshot;a.moves=legal.slice();
      if(!a.moves.includes(id))a.moves[a.moves.findIndex(key=>snapshot.moves.find(m=>m.id===key).fifth===raw.fifth)]=id;
      const initial=battle(a,b);
      initial.fighters[0].effects['攻击必中']={start:1,end:1};
      const out=E.resolveTurn(initial,[key(id),pp]);
      assert.equal(out.fighters[0].pp[key(id)],raw.pp-1);
      assert.equal(out.moveDefinitions[key(id)].revision,raw.revision);
      checked.add(`${snapshot.selectedSoulId}:${id}`);
      if(id===29525){
        initial.fighters[0].counts.nextStatusInvalid=1;
        const blocked=E.resolveTurn(initial,[key(id),pp]);
        assert.equal(blocked.fighters[0].pp[key(id)],raw.pp-1);
        assert.equal(blocked.fighters[0].effects.reflect,undefined);
      }
    }
  }
  assert.equal(checked.size,58);
});

test('3396 夜暝渊墟新技能可以配旧魂印，反异常、害怕、后续双触发依实际用招分类',()=>{
  for(const soul of [709,2170]){
    const b=member(foe,[10171,20006,20085,10006,37908],{spe:1});
    let s=battle(panda(soul),b);
    s=E.resolveTurn(s,[key(29525),pp]);
    assert.equal(s.fighters[0].soulId,soul);
    assert.equal(s.fighters[0].pp[key(29525)],4);
    assert.ok(s.fighters[0].effects.reflect);
    assert.ok(s.fighters[1].ailments['害怕']>=2);
    const before={...s.fighters[1].stages};
    s=E.resolveTurn(s,[key(10001),pp]);
    assert.equal(s.fighters[1].stages.def,before.def-1);
    const spa=s.fighters[0].stages.spa;
    s=E.resolveTurn(s,[key(29525),pp]);
    assert.equal(s.fighters[0].stages.spa,spa+1);
  }
  const blocked=battle(panda(2170),member(foe,[10171,20006,20085,10006,37908],{spe:1}));
  blocked.fighters[1].effects['免异常']={start:1,end:1};
  const immune=E.resolveTurn(blocked,[key(29525),key(10006)]);
  assert.ok(immune.fighters[1].effects.attackBlock);
  assert.ok(!immune.damageEvents?.some(event=>event.sourceSide===1&&event.type==='attack'&&event.hpLoss>0));
});

test('3396 新魂印登场分流，免弱失败的最优系别取输出最大和承伤最小，换人重判',()=>{
  const normal=battle(panda(2170),member(neutral));
  assert.equal(normal.fighters[0].soulState.pandora2170Entry,'weakness');
  assert.ok(Object.values(normal.fighters[1].stages).every(x=>x===-1));
  const shielded=battle(panda(2170),panda(709,{spe:1}));
  assert.equal(shielded.fighters[0].soulState.pandora2170Entry,'affinity');
  const combat=E.resolveTurn(shielded,[key(30895),key(30895)]);
  assert.deepEqual(combat.optimalAffinityEvents2117.map(e=>[e.attack,e.defense,e.chosen]),[[true,false,2.375],[false,true,.75]]);
  let game=T.create([[panda(2170),member(neutral)],[panda(709),member(foe)]],[0,0],opt);
  game=T.turn(game,[{switchTo:1},{switchTo:1}]);
  game=T.turn(game,[{switchTo:0},pp]);
  assert.equal(game.battle.fighters[0].soulState.pandora2170Entry,'weakness');
  assert.ok(Object.values(game.battle.fighters[1].stages).every(n=>n===-1));
});

test('3396 新魂印回初高血提高先制，战斗阶段末低于回初一半才回复并附等量粉伤',()=>{
  const neutralFoe=member(foe,[10171,20006,20085,10006,37908],{spe:80,atk:2400});
  const high=battle(panda(2170),neutralFoe);
  high.fighters[1].hp=5000;
  high.fighters[0].effects['攻击必中']={start:1,end:1};
  const first=E.resolveTurn(high,[key(10001),pp]);
  assert.equal(first.fighters[0].soulState.pandora2170High,true);
  assert.equal(first.fighters[0].soulState.resolvedPriority.value,1);
  const low=battle(panda(2170,{def:100}),neutralFoe);
  low.fighters[0].hp=800;
  const out=E.resolveTurn(low,[pp,key(10006)]);
  const red=out.damageEvents.find(e=>e.type==='attack'&&e.targetSide===0);
  assert.ok(red.hpLoss>400&&red.hpLoss<800);
  assert.equal(out.fighters[0].hp,800-red.hpLoss+3000);
  assert.ok(out.damageEvents.some(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===3000));
});

test('3396 既有技能的单点能力、随机变动、盾及最低攻击伤害用正式配招验证',()=>{
  for(const [id,side,stat,change] of [[20288,1,'acc',-1],[20044,0,'def',1],[23376,1,'acc',-2],[18361,1,'atk',-2]]){
    const s=withMove(id);s.fighters[0].effects['攻击必中']={start:1,end:1};
    const next=E.resolveTurn(s,[key(id),pp]);
    const baseline=side===1?-1:0;
    assert.equal(next.fighters[side].stages[stat],baseline+change);
    if(id===18361){assert.equal(next.fighters[1].stages.spa,-3);assert.equal(next.fighters[0].suitState.shield,500);}
  }
  const drain=withMove(16321);
  drain.fighters[0].effects['攻击必中']={start:1,end:1};
  drain.fighters[1].stages.atk=2;
  const cleared=E.resolveTurn(drain,[key(16321),pp]);
  assert.equal(cleared.fighters[1].stages.atk,0);
  assert.equal(cleared.fighters[1].stages.acc,-3);
  const moved=withMove(16325);moved.fighters[0].effects['攻击必中']={start:1,end:1};
  const rolled=E.resolveTurn(moved,[key(16325),pp]);
  assert.equal(Object.values(rolled.fighters[0].stages).filter(n=>n===1).length,1);
  assert.equal(Object.values(rolled.fighters[1].stages).filter(n=>n===-2).length,1);
  const floor=withMove(18360,{atk:10});floor.fighters[0].effects['攻击必中']={start:1,end:1};
  const dealt=E.resolveTurn(floor,[key(18360),pp]);
  assert.equal(dealt.fighters[0].lastSettledAttackDamage,280);
});

test('3396 既有技能的恢复、持续回复、回合保护和旧第五两种固粉路径',()=>{
  const guard=withMove(23482);guard.fighters[0].hp=2000;
  const healed=E.resolveTurn(guard,[key(23482),pp]);
  assert.equal(healed.fighters[0].hp,6500);
  assert.ok(healed.fighters[0].effects['免异常']);
  assert.ok(Object.values(healed.fighters[0].effects).some(e=>e.chance===80));
  const dance=E.resolveTurn(withMove(23483),[key(23483),pp]);
  assert.equal(dance.fighters[0].stages.atk,0);
  assert.equal(dance.fighters[0].stages.spd,1);
  assert.ok(dance.damageEvents.some(e=>e.type==='fixed'&&e.hpLoss===100));
  const block=withMove(16323);block.fighters[0].effects['攻击必中']={start:1,end:1};
  const next=E.resolveTurn(block,[key(16323),key(20006)]);
  assert.ok(!next.fighters[1].effects['电系伤害翻倍']);
  for(const id of [30895,37363]){
    const s=withMove(id);s.fighters[0].hp=3000;
    s.fighters[1].effects['电系伤害翻倍']={start:1,end:2};
    const out=E.resolveTurn(s,[key(id),pp]);
    assert.equal(out.fighters[1].effects['电系伤害翻倍'],undefined);
    assert.ok(out.damageEvents.some(event=>event.type==='fixed'&&event.hpLoss>0));
    assert.ok(out.damageEvents.some(event=>event.type==='percent'&&event.hpLoss>0));
    assert.ok(out.fighters[0].hp>3000);
  }
});

test('3396 既有技能的多段、消弱、吸强、随机回复、护盾碎裂及持续词条进入各自结算',()=>{
  function use(id,setup=()=>{},enemy=pp){
    const s=withMove(id);
    s.fighters[0].effects['攻击必中']={start:1,end:1};
    setup(s.fighters[0],s.fighters[1]);
    return E.resolveTurn(s,[key(id),enemy]);
  }
  const multi=use(16322),hits=multi.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0).length;
  assert.ok(hits>=1&&hits<=3);
  const weak=use(23484,(a,b)=>{a.stages.atk=-2;b.stages.spe=-1;});
  assert.equal(weak.fighters[0].stages.atk,0);
  assert.equal(weak.fighters[1].stages.spe,-3);
  const chance=use(16324);
  assert.ok([ -1,-2 ].includes(chance.fighters[1].stages.spe));
  assert.ok([ -1,-2 ].includes(chance.fighters[1].stages.spd));
  const stolen=use(18359,(a,b)=>{a.hp=2000;b.stages.atk=3;});
  assert.ok(stolen.fighters[0].hp>2000);
  assert.ok(stolen.fighters[0].stages.atk>0);
  assert.equal(stolen.fighters[1].stages.atk,0);
  const light=use(16132);
  assert.ok(light.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===75));
  const recovered=use(30893,a=>{a.hp=2000;});
  assert.ok(recovered.fighters[0].hp>=2200&&recovered.fighters[0].hp<=2400);
  const look=use(30892,(_a,b)=>{b.stages.atk=3;});
  assert.ok(look.fighters[0].stages.atk>=2);
  assert.ok(look.fighters[1].ailments['害怕']>=2);
  assert.ok(Object.values(look.fighters[0].stages).filter(n=>n>=2).length>=2);
  const shield=use(30894);
  assert.equal(shield.fighters[0].suitState.shield,500);
  assert.ok(Object.values(shield.fighters[1].stages).every(n=>n===-2));
  assert.ok(Object.values(shield.fighters[0].soulState.sourceShieldReactions).some(e=>e.damage===300&&e.attacks===1));
  shield.fighters[0].stats.def=100;
  shield.fighters[1].stats.atk=7000;
  const broken=E.resolveTurn(shield,[pp,key(10006)]);
  assert.equal(broken.fighters[0].suitState.shield,0);
  assert.ok(broken.damageEvents.some(e=>e.round===2&&e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===300));
  const abyss=use(24574,a=>{a.hp=2000;});
  assert.equal(abyss.fighters[0].hp,5000);
  assert.equal(abyss.fighters[0].effects.id57.fraction,1/3);
  assert.equal(abyss.fighters[0].effects['用招前随机吸强'].count,3);
  const dream=use(24575);
  assert.ok(Object.values(dream.fighters[0].stages).every(n=>n===1));
  assert.ok(dream.fighters[0].effects['免异常']);
  assert.ok(Object.values(dream.fighters[0].effects).some(e=>e.chance===50));
  const queen=use(25553);
  assert.ok(queen.fighters[0].effects.reflect);
  assert.ok(queen.fighters[0].effects['对手攻击概率失效']);
  const elegy=use(25554);
  assert.ok(Object.values(elegy.fighters[0].stages).every(n=>n===2));
  assert.equal(elegy.fighters[0].effects['用招低体双吸'].fraction,1/3);
  assert.ok(Object.values(elegy.fighters[0].effects).some(e=>e.amount===2&&e.start===2));
});
