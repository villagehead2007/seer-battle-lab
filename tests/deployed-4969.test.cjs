'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/engine.js');
const T=require('../dist/team-engine.js');
const local=require('../local-species.cjs');
const source=local.species(4969);
const target=local.species(4765),reserve=local.species(2987);
const key=id=>'wiki:'+id;
const pp='potion:pp';
const config={seed:4,criticals:false};
function member(snapshot,moves,patch={}){
  return {snapshot,moves:moves??E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000,atk:180,spa:180,def:1200,spd:1200,spe:300,...patch}}};
}
function milinna(moves=[38658,38656,29522,29523,38657],patch={}){return member(source,moves,patch);}
function foe(patch={}){return member(target,[10171,20006,20085,10006,37908],patch);}
function duel(a=milinna(),b=foe({spe:80})){
  return E.createBattle({...config,wikiSnapshots:[a.snapshot,b.snapshot],wikiLoadouts:[a.moves,b.moves],builds:[a.build,b.build]});
}
function withMove(id,patch={}){
  const moves=[38658,38656,29522,29523,38657];
  if(!moves.includes(id))moves[1]=id;
  const state=duel(milinna(moves,patch));
  state.fighters[0].effects['攻击必中']={start:1,end:1};
  return state;
}

test('4969 精灵快照 21 招编译并逐招进入正式技能槽位，1 次当前目标不冒充 3 段',()=>{
  const b=foe({spe:80});
  for(const m of source.moves){
    const moves=E.WIKI.defaultMoves(source);
    if(!moves.includes(m.id))moves[moves.findIndex(id=>source.moves.find(x=>x.id===id).fifth===m.fifth)]=m.id;
    const s=duel(milinna(moves),b);
    assert.equal(s.fighters[0].pp[key(m.id)],m.pp);
    assert.equal(s.moveDefinitions[key(m.id)].wikiId,m.id);
    assert.equal(s.moveDefinitions[key(m.id)].priority,m.priority);
    s.fighters[0].effects['攻击必中']={start:1,end:1};
    const used=E.resolveTurn(s,[key(m.id),pp]);
    assert.equal(used.fighters[0].pp[key(m.id)],m.pp-1);
    if(m.id===14404){
      assert.equal(used.damageEvents.filter(e=>e.type==='attack'&&e.sourceSide===0&&e.targetSide===1).length,1);
    }
  }
});

test('4969 旧配招的单点能力、风铃先手固伤、同生共死和突进反伤按实际条件结算',()=>{
  for(const [id,side,stat,n] of [[20002,1,'atk',-1],[20015,1,'acc',-1],[20016,1,'spe',-1],[20017,0,'spe',2]]){
    const out=E.resolveTurn(withMove(id),[key(id),pp]);
    assert.equal(out.fighters[side].stages[stat],n);
  }
  const stealer=withMove(38644);
  stealer.fighters[1].stages.atk=2;
  const bells=E.resolveTurn(stealer,[key(38644),pp]);
  assert.equal(bells.fighters[0].stages.atk,2);
  assert.equal(bells.fighters[1].stages.atk,0);
  assert.ok(bells.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===250));
  const life=withMove(10036);life.fighters[0].hp=5000;
  const equal=E.resolveTurn(life,[key(10036),pp]);
  assert.equal(equal.fighters[1].hp,5000);
  const recoil=E.resolveTurn(withMove(10038),[key(10038),pp]);
  const red=recoil.damageEvents.find(e=>e.type==='attack'&&e.targetSide===1);
  assert.ok(red?.settledDamage>0);
  assert.ok(recoil.damageEvents.some(e=>e.targetSide===0&&e.hpLoss===Math.floor(red.settledDamage/4)));
});

test('4969 简装护盾、家书低体回复、答复反弱睡眠与叩心门消强吸取皆由实际用招触发',()=>{
  const plain=E.resolveTurn(withMove(29512),[key(29512),pp]);
  assert.equal(plain.fighters[0].suitState.shield,300);
  assert.ok(plain.fighters[0].effects['免异常']);
  const mail=withMove(29513);mail.fighters[0].hp=2500;
  const received=E.resolveTurn(mail,[key(29513),pp]);
  assert.ok(Object.values(received.fighters[0].stages).every(n=>n===2));
  assert.ok(Object.values(received.fighters[0].effects).some(e=>e.amount===1&&e.start===2));
  const reply=withMove(38645);reply.fighters[0].stages.atk=-2;
  const reversed=E.resolveTurn(reply,[key(38645),pp]);
  assert.equal(reversed.fighters[0].stages.atk,2);
  assert.ok(reversed.fighters[1].ailments['睡眠']>=2);
  assert.ok(reversed.damageEvents.some(e=>e.type==='percent'&&e.settledDamage===3000));
  const knock=withMove(38656);knock.fighters[0].hp=6000;
  knock.fighters[1].stages.atk=1;knock.fighters[1].effects['电系伤害翻倍']={start:1,end:2};
  const opened=E.resolveTurn(knock,[key(38656),pp]);
  assert.equal(opened.fighters[1].stages.atk,0);
  assert.ok(opened.fighters[1].ailments['睡眠']>=2);
  assert.ok(opened.damageEvents.some(e=>e.type==='fixed'&&e.settledDamage===400));
  assert.equal(opened.fighters[1].effects['电系伤害翻倍'],undefined);
});

test('4969 魂印先手增伤后生效、上限四层，受先手攻击后闪避且返场重置，仅未受红伤回复',()=>{
  let s=duel(milinna([38658,38656,29522,29523,10001]),foe({spe:80}));
  s.fighters[0].hp=4000;
  s=E.resolveTurn(s,[key(10001),pp]);
  assert.equal(s.fighters[0].soulState.milinnaAttackLayers,1);
  assert.equal(s.fighters[0].hp,7000);
  for(let i=0;i<4;i++)s=E.resolveTurn(s,[key(10001),pp]);
  assert.equal(s.fighters[0].soulState.milinnaAttackLayers,4);
  let g=T.create([[milinna([38658,38656,29522,29523,10001],{spe:30}),member(reserve)],[foe({spe:900})]],[0,0],config);
  g.battle.fighters[0].hp=4000;
  g=T.turn(g,[pp,key(10006)]);
  assert.ok(g.battle.fighters[0].hp<4000);
  assert.equal(g.battle.fighters[0].soulState.milinnaDodgeLayers,1);
  g=T.turn(T.turn(g,[{switchTo:1},pp]),[{switchTo:0},pp]);
  assert.equal(g.battle.fighters[0].soulState.milinnaDodgeLayers,0);
  assert.equal(g.battle.teamMilinnaHats[0],2);
});

test('4969 盛装反异常与红伤转回复，思念先手双倍强化并在后续用招触发',()=>{
  let a=duel();a.fighters[0].hp=4000;
  a=E.resolveTurn(a,[key(29522),key(10006)]);
  assert.ok(a.fighters[0].effects.reflect);
  assert.ok(Object.values(a.fighters[0].effects).some(effect=>effect.ailment==='睡眠'));
  assert.equal(a.damageEvents.filter(event=>event.type==='attack'&&event.targetSide===0).reduce((n,e)=>n+e.hpLoss,0),0);
  let b=duel();b.fighters[0].hp=3000;
  b=E.resolveTurn(b,[key(29523),pp]);
  assert.ok(Object.values(b.fighters[0].stages).every(value=>value===2));
  const after=E.resolveTurn(b,[key(38656),pp]);
  assert.ok(after.damageEvents.some(event=>event.round===2&&event.type==='percent'&&event.targetSide===1));
});

test('4969 风循众愿主动离场为真实后继回复 300，步延星空击败睡眠敌后让其真实后继睡眠',()=>{
  let g=T.create([[milinna(),member(reserve)],[foe({spe:80})]],[0,0],config);
  g.slots[0][1].fighter.hp=5000;
  g=T.turn(g,[key(38657),pp]);
  assert.ok(g.battle.fighters[0].soulState.onVoluntaryExit);
  g=T.turn(g,[{switchTo:1},pp]);
  assert.equal(g.battle.fighters[0].hp,5300);
  let h=T.create([[milinna(undefined,{atk:5000,spa:5000})],[foe({spe:80}),member(reserve)]],[0,0],config);
  h.battle.fighters[1].hp=1;
  h.battle.fighters[1].ailments['睡眠']=3;
  h=T.turn(h,[key(38658),pp]);
  assert.equal(h.phase,'replace');
  h=T.replace(h,[null,1]);
  assert.ok(h.battle.fighters[1].ailments['睡眠']>=h.battle.round);
});

test('4969 步延星空消回合、两种弱化状态、存活先制及消回合再触发睡眠',()=>{
  let s=withMove(38658);
  s.fighters[1].effects['电系伤害翻倍']={start:1,end:3};
  s=E.resolveTurn(s,[key(38658),pp]);
  assert.equal(s.fighters[1].effects['电系伤害翻倍'],undefined);
  const draws=s.randomStatusEvents.filter(event=>event.type==='draw'&&event.effectId===2061);
  assert.equal(draws.length,2);
  assert.ok(draws.every(result=>E.STATUS_RULES.isWeakening(result.name)));
  assert.equal(new Set(draws.map(result=>result.name)).size,2);
  assert.ok(Object.values(s.fighters[0].effects).some(e=>e.amount===2&&e.start===2));
  assert.ok(Object.values(s.fighters[1].effects).some(e=>e.start===2));
  s.fighters[1].effects['电系伤害翻倍']={start:2,end:3};
  s.fighters[0].effects['攻击必中']={start:2,end:2};
  s=E.resolveTurn(s,[key(38656),pp]);
  assert.ok(s.fighters[1].ailments['睡眠']>=4);
});

test('4969 队伍帽子最多四顶，可主动换时保留，全部实际换人入口封锁时免疫红伤并消耗',()=>{
  let g=T.create([[milinna(),member(reserve)],[foe({atk:2000})]],[0,0],config);
  for(const count of [2,4,4]){
    g=T.turn(g,[{switchTo:1},pp]);
    assert.equal(g.battle.teamMilinnaHats[0],count);
    g=T.turn(g,[{switchTo:0},pp]);
  }
  g=T.turn(g,[{switchTo:1},pp]);
  const open=T.turn(g,[pp,key(10006)]);
  assert.equal(open.battle.teamMilinnaHats[0],4);
  const round=open.battle.round;
  open.battle.fighters[0].effects['不能主动切换']={start:round,end:round};
  assert.deepEqual(T.candidates(open,0),[]);
  const closed=T.turn(open,[pp,key(10006)]);
  assert.equal(closed.battle.teamMilinnaHats[0],3);
  assert.equal(closed.battle.damageEvents.filter(e=>e.round===round&&e.type==='attack'&&e.targetSide===0).reduce((n,e)=>n+e.hpLoss,0),0);
});
