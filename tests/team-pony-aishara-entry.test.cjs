'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const store=require('../local-species.cjs'),E=require('../dist/engine.js'),T=require('../dist/team-engine.js');
function member(id){
  const snapshot=store.species(id);
  return {snapshot,moves:E.WIKI.defaultMoves(snapshot),build:{overrides:{maxHp:9000}}};
}
const potion='potion:pp';
function start(id){return T.create([[member(id),member(3056)],[member(2988)]],[0,0],{seed:13});}
test('圣灵谱尼每次真实返场消回合成功封下次整招，空场不封，道具不消耗',()=>{
  let g=start(5000);
  assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,undefined);
  for(let entry=0;entry<2;entry++){
    g=T.turn(g,[{switchTo:1},'wiki:24650']);
    assert.ok(Object.keys(g.battle.fighters[1].effects).length);
    g=T.turn(g,[{switchTo:0},potion]);
    assert.deepEqual(g.battle.fighters[1].effects,{});
    assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,1);
    const round=g.battle.round;
    g=T.turn(g,[potion,'wiki:19123']);
    assert.equal(g.battle.fighters[1].counts.nextSkillInvalid,undefined);
    assert.ok(!(g.battle.damageEvents??[]).some(e=>e.round===round&&e.sourceSide===1&&e.type==='attack'&&e.hpLoss>0));
  }
});
test('艾夏拉主动返场当回合消强并施加睡眠，回合末对手可重新获得一级强化',()=>{
  let g=T.turn(start(3673),[{switchTo:1},'wiki:24650']);
  const before=g.battle.fighters[1];
  assert.equal(before.stages.atk,1);assert.equal(before.ailments['睡眠'],undefined);
  g=T.turn(g,[{switchTo:0},potion]);
  assert.equal(g.battle.fighters[0].soulId,959);
  assert.ok(g.battle.fighters[1].ailments['睡眠']>=g.battle.round);
  assert.equal(g.battle.fighters[1].stages.atk,1);
});

test('队伍中的瀚宇星皇给帝皇之戎持续授赐，首发佑依统一下场规则清除且返场不重发',()=>{
  for(const lead of [0,1]){
    let g=T.create([[member(4950),member(3291)],[member(2988)]],[lead,0],{seed:13});
    if(lead===1)g=T.turn(g,[{switchTo:0},potion]);
    const f=g.battle.fighters[0],st=f.soulState.group2149;
    assert.equal(st.starGift.sourceSoulHash,'2f1e3f2');
    assert.equal(st.starBlessing?.remaining,lead===0?3:undefined);
    g=T.turn(g,[{switchTo:1},potion]);
    g=T.turn(g,[{switchTo:0},potion]);
    const after=g.battle.fighters[0].soulState.group2149;
    assert.equal(after.starGift.sourceSoulHash,'2f1e3f2');
    assert.equal(after.starBlessing,undefined);
  }
});
test('星皇留在替补席也授赐，敌方有双成员帝皇之戎时普通目标不能获赐',()=>{
  for(const [enemy,expected] of [[2988,5125],[4950,4000]]){
    let g=T.create([[member(3056),member(3291)],[member(enemy)]],[0,0],{seed:13});
    g.battle.fighters[0].hp=4000;
    g=T.turn(g,[potion,potion]);
    assert.equal(g.battle.fighters[0].hp,expected);
  }
});
test('原首发星皇之佑前三回合免弱化和疲惫，第四回合到期',()=>{
  for(const [enemy,move,kind] of [[2988,'wiki:19121','weak'],[5000,'wiki:25678','ailment']]){
    let g=T.create([[member(3056),member(3291)],[member(enemy)]],[0,0],{seed:13});
    for(let round=1;round<=4;round++){
      g=T.turn(g,[potion,move]);
      const f=g.battle.fighters[0];
      if(kind==='weak')assert.equal(f.stages.atk,round===4?-1:0);
      else assert.equal((f.ailments['疲惫']??0)>=round,round===4);
    }
  }
});
test('修罗正气真实指定场下信仰者，平分意念回复并跨换位保留信仰与未消费意念',()=>{
  const shura=member(4933);Object.assign(shura.build.overrides,{atk:500,spa:100});
  let g=T.create([[shura,member(3056)],[member(2988)]],[0,0],{seed:13});
  const [active,bench]=g.slots[0].map(x=>x.fighter);
  assert.equal(bench.statusState.faithSourceName,active.name);
  active.soulState.shura2128.thought=400;
  active.hp=5000;bench.hp=3000;
  g=T.turn(g,[potion,potion]);
  assert.deepEqual(g.slots[0].map(x=>x.fighter.hp),[5200,3200]);
  // Separate legal initial unspent-resource boundary; the first scenario proves the 400-point split.
  g=T.create([[shura,member(3056)],[member(2988)]],[0,0],{seed:13});g.battle.fighters[0].soulState.shura2128.thought=100;g.battle.fighters[0].hp=5200;g.slots[0][1].fighter.hp=3200;
  g=T.turn(g,[{switchTo:1},potion]);
  assert.equal(g.slots[0][0].fighter.soulState.shura2128.thought,100);
  assert.equal(g.battle.fighters[0].statusState.faithSourceNumber,active.number);
  g=T.turn(g,[{switchTo:0},potion]);
  assert.deepEqual(g.slots[0].map(x=>x.fighter.hp),[5250,3250]);
});
test('教皇让两个真实对手依次狂信，下一回合开始取得本场免疫，换下再换入仍保留',()=>{
  let g=T.create([[member(4898),member(3056)],[member(2988),member(3056)]],[0,0],{seed:13});
  g=T.turn(g,['wiki:29339',potion]);
  assert.equal(g.battle.fighters[1].statusState.faithSourceNumber,g.battle.fighters[0].number);
  assert.ok(!g.battle.fighters[0].soulState.pope4898.immunity);
  g=T.turn(g,['wiki:29339',{switchTo:1}]);
  assert.equal(g.battle.fighters[1].statusState.faithSourceNumber,g.battle.fighters[0].number);
  g=T.turn(g,[potion,potion]);
  assert.equal(g.battle.fighters[0].soulState.pope4898.immunity,true);
  g=T.turn(g,[{switchTo:1},potion]);
  g=T.turn(g,[{switchTo:0},potion]);
  assert.equal(g.battle.fighters[0].soulState.pope4898.immunity,true);
});
test('修罗只向存活信仰者平分300意念，阵亡信仰者不改变本次受击的减伤档位',()=>{
  function scenario(extra){
    const shura=member(4933);Object.assign(shura.build.overrides,{atk:500,spa:100});
    const roster=[shura,member(3056)];
    if(extra)roster.push(member(2987));
    let g=T.create([roster,[member(2988)]],[0,0],{seed:13,criticals:false});
    const [owner,friend,fallen]=g.slots[0].map(slot=>slot.fighter);
    if(fallen){assert.equal(fallen.statusState.faithSourceNumber,owner.number);fallen.hp=0;}
    owner.hp=5000;friend.hp=3000;owner.soulState.shura2128.thought=300;
    g=T.turn(g,[potion,potion]);
    assert.deepEqual(g.slots[0].map(slot=>slot.fighter.hp),extra?[5150,3150,0]:[5150,3150]);
    g=T.turn(g,[potion,'wiki:19123']);
    const damage=g.battle.damageEvents.filter(e=>e.round===2&&e.sourceSide===1&&e.type==='attack').reduce((sum,e)=>sum+e.hpLoss,0);
    assert.ok(damage>0);return damage;
  }
  assert.equal(scenario(true),scenario(false));
});
test('教皇两招分别判定唯一无信仰或唯一有信仰的存活对手，另有同类时保留常规分支',()=>{
  for(const hasFaith of [false,true]){
    for(const alsoMatches of [false,true]){
      let g=T.create([[member(4898)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
      const [target,bench]=g.slots[1].map(slot=>slot.fighter);
      function assign(f){Object.assign(f.statusState??={},{faithSourceSide:0,faithSourceNumber:g.battle.fighters[0].number});}
      if(hasFaith)assign(target);
      if(alsoMatches===hasFaith)assign(bench);
      g=T.turn(g,[hasFaith?'wiki:38375':'wiki:38374',potion]);
      assert.equal(g.battle.fighters[1].hp===0,!alsoMatches,'目标有信仰 '+hasFaith+'，另有同类 '+alsoMatches);
    }
  }
});
test('霍光死亡补位的限招只在次回合生效，威破形态在主动换下后保留',()=>{
  for(const [id,key] of [[36655,'attackBlock'],[36656,'statusBlock']]){
    const huo=member(4515);Object.assign(huo.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[huo,member(3056)],[member(2988,{maxHp:1}),member(3056)]],[0,0],{seed:13});
    g.battle.fighters[1].hp=1;
    g=T.turn(g,['wiki:'+id,potion]);
    assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);
    assert.equal(g.battle.fighters[1].effects[key].end,g.battle.round);
    assert.ok(g.battle.fighters[0].soulState.huoguangFrenzyEnd>=g.battle.round);
  }
  let g=T.create([[member(4515),member(3056)],[member(3056),member(2988)]],[0,0],{seed:13});
  g=T.turn(g,['wiki:28335',potion]);assert.equal(g.battle.fighters[0].soulState.huoguangForm,'break');
  g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);
  assert.equal(g.battle.fighters[0].soulState.huoguangForm,'break');
  g=T.turn(g,[potion,{switchTo:1}]);
  assert.ok(g.battle.fighters[1].ailments['束缚']>=g.battle.round-1);
});
test('3311满体用招为所有存活场下队友恢复180，未满体时只恢复使用者',()=>{
  for(const full of [false,true]){
    let g=T.create([[member(3311),member(3056),member(2987),member(3223)],[member(2988)]],[0,0],{seed:13});
    const [a,b,c,d]=g.slots[0].map(slot=>slot.fighter);
    if(!full)a.hp-=100;
    b.hp-=500;c.hp-=70;d.hp=0;
    g=T.turn(g,['wiki:29506',potion]);
    assert.deepEqual(g.slots[0].slice(1).map(slot=>slot.fighter.hp),full?[8680,9000,0]:[8500,8930,0]);
  }
});
test('爵刻按真实非满体替补计数，换下保留并在下次攻击消耗时回复各替补',()=>{
  let g=T.create([[member(3056),member(4454),member(2987)],[member(2988)]],[0,0],{seed:13});
  g.battle.fighters[0].hp=8000;g.slots[0][2].fighter.hp=8500;
  g=T.turn(g,[{switchTo:1},potion]);
  assert.equal(g.battle.fighters[0].soulState.jueke,3);
  assert.equal(g.battle.fighters[0].ailments['流血'],3);
  g=T.turn(g,['wiki:36312',potion]);
  assert.equal(g.battle.fighters[0].soulState.jueke,2);
  assert.deepEqual([g.slots[0][0].fighter.hp,g.slots[0][2].fighter.hp],[8100,8600]);
  g=T.turn(g,[{switchTo:0},potion]);
  assert.equal(g.slots[0][1].fighter.soulState.jueke,2);
  g=T.turn(g,[{switchTo:1},potion]);
  assert.equal(g.battle.fighters[0].soulState.jueke,5);
});
test('乔列尼德两版切入按实际存活与阵亡重新结算护盾和攻击次数',()=>{
  for(const soul of [832,2005]){
    const pet=member(3524);pet.snapshot=E.WIKI.versionSnapshots(pet.snapshot).find(v=>v.selectedSoulId===soul);pet.moves=E.WIKI.defaultMoves(pet.snapshot);
    let g=T.create([[member(3056),pet,member(2987),member(3223)],[member(2988)]],[0,0],{seed:13});
    g.slots[0][2].fighter.hp=0;g.slots[0][3].fighter.hp=0;
    g=T.turn(g,[{switchTo:1},potion]);const f=g.battle.fighters[0];
    assert.equal(f.soulId,soul);assert.equal(f.soulState.jolieEntryBonus,20);
    assert.equal(f.soulState.jolieClearCrit,1);
    assert.equal(f.soulState.jolieReduceCharges,soul===832?2:1);
    assert.ok(E.describeEffects(f,g.battle.round).join(' ').includes('200'));
    const atk=f.moves.find(k=>g.battle.moveDefinitions[k].kind==='physical'||g.battle.moveDefinitions[k].kind==='special');
    g=T.turn(g,[atk,potion]);
    assert.equal(g.battle.fighters[0].soulState.jolieClearCrit,0);
  }
});
test('霍光狂刃威破在对手主动换入时附害怕，普通阵亡补位不触发',()=>{
  const huo=member(4515);Object.assign(huo.build.overrides,{atk:9999,spa:9999,spe:9999});
  let g=T.create([[huo,member(3223)],[member(2988),member(3056),member(2987)]],[0,0],{seed:13});
  g.battle.fighters[1].hp=500;
  g=T.turn(g,['wiki:28335',potion]);
  g=T.turn(g,['wiki:36655',potion]);g=T.replace(g,[null,1]);
  assert.equal(g.battle.fighters[1].ailments['害怕'],undefined);
  g=T.turn(g,[potion,{switchTo:2}]);
  assert.ok(g.battle.fighters[1].ailments['害怕']>=g.battle.round-1);
});
test('觉醒乔列尼德六存活只结束一次衍化异常；感染结束立刻转化为中毒',()=>{
  const joe=member(3524);joe.snapshot=E.WIKI.versionSnapshots(joe.snapshot).find(v=>v.selectedSoulId===2005);joe.moves=E.WIKI.defaultMoves(joe.snapshot);
  const enemy=member(4633);if(!enemy.moves.includes(28699))enemy.moves[1]=28699;
  let g=T.create([[joe,...[2987,2988,3056,3223,3311].map(member)],[enemy]],[0,0],{seed:13});
  assert.equal(g.battle.fighters[0].soulState.jolieEvolutionEnds,1);
  g=T.turn(g,[potion,'wiki:28699']);
  const f=g.battle.fighters[0];assert.equal(f.soulState.jolieEvolutionEnds,0);
  assert.equal(f.ailments['感染'],undefined);assert.ok(f.ailments['中毒']>=1);
});
test('荒古之慑两层对2000体力接替者逐层结算两笔180固伤',()=>{
  const reserve=member(3056);reserve.build.overrides.maxHp=2000;
  let g=T.create([[member(2988),reserve],[member(3524)]],[0,0],{seed:13});
  g.battle.fighters[0].soulState.ancientDread=2;
  g=T.turn(g,[{switchTo:1},potion]);
  const damage=g.battle.damageEvents.filter(e=>e.targetSide===0&&e.type==='fixed');
  assert.deepEqual(damage.map(e=>e.hpLoss),[180,180]);assert.equal(g.battle.fighters[0].hp,1640);
});
test('咤克斯在场下统计两名实装瞬杀的对手，拦截秒杀后层数给本人',()=>{
  const pope=member(4898),other=member(3056);for(const m of [pope,other])m.build.characteristic={groupId:21,star:0};
  let g=T.create([[member(2988),member(4762)],[pope,other]],[0,0],{seed:13});
  const owner=g.slots[0][1].fighter;
  assert.equal(owner.soulState.magicCurse1973,2);
  (owner.statusState??={}).faithSourceSide=1;
  g=T.turn(g,[potion,'wiki:38374']);
  assert.ok(g.battle.fighters[0].hp>0);
  assert.ok(g.slots[0][1].fighter.soulState.magicCurse1973>=3);
  assert.equal(g.battle.fighters[0].soulState.magicCurse1973,undefined);
});
test('咤克斯按原始位置选最低上限，替补首次上场仍有改动但真实下场重置六面板及封顶HP',()=>{
  for(const lead of [0,2]){
    const foes=[2988,3056,3223,2987].map(id=>member(id));
    for(const [index,max] of [8000,2000,2000,1000].entries())foes[index].build.overrides.maxHp=max;
    let g=T.create([[member(4762)],foes],[0,lead],{seed:13});
    g.slots[1][3].fighter.hp=0;
    const chosen=g.slots[1][1].fighter;chosen.hp=1100;
    const atk=chosen.stats.atk;
    g=T.turn(g,['wiki:37913',potion]);
    assert.equal(g.slots[1][1].fighter.stats.maxHp,9000);assert.equal(g.slots[1][1].fighter.hp,8100);
    assert.equal(g.slots[1][1].fighter.stats.atk,atk-50);
    assert.equal(g.slots[1][2].fighter.stats.maxHp,2000);
    assert.equal(g.slots[1][3].fighter.hp,0);
    g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.fighters[1].stats.maxHp,9000);assert.equal(g.battle.fighters[1].stats.atk,atk-50);g=T.turn(g,[potion,{switchTo:0}]);
    assert.equal(g.slots[1][1].fighter.stats.maxHp,2000);assert.equal(g.slots[1][1].fighter.stats.atk,atk);assert.equal(g.slots[1][1].fighter.hp,2000);assert.equal(g.slots[1][1].fighter.soulState.teamPanel2296,undefined);
  }
});
test('咤克斯第五最低红伤计入对方全队上限，已废除技能跨换位仍不可用',()=>{
  const curse=member(4762),target=member(2988),enemyOwner=member(4762);
  target.build.characteristic={groupId:21,star:0};
  let g=T.create([[curse,member(3056)],[target,enemyOwner]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,['wiki:37914',potion]);
  const red=g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===0&&e.type==='attack');
  assert.ok(red.some(e=>e.settledDamage>=18000));
  assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);
  g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);
  assert.ok(!E.availableMoves(g.battle.fighters[0],g.battle.round).includes('wiki:37914'));
});
test('缔笙存活在场下仍触发第十一回合浪潮，两只对手分别收到各自4和6回合的印记',()=>{
  let g=T.create([[member(3056),member(4386)],[member(2988),member(3056)]],[0,0],{seed:13});
  for(let round=1;round<=11;round++)g=T.turn(g,[potion,round===5?{switchTo:1}:potion]);
  assert.deepEqual(g.slots[1].map(slot=>slot.fighter.soulState.tieMarksBySource[0].count),[4,6]);
  g=T.turn(g,[{switchTo:1},{switchTo:0}]);
  assert.equal(g.battle.fighters[0].soulState.dishengLayers,4);
  const key='wiki:19123',pp=g.battle.fighters[1].pp[key];
  g=T.turn(g,[potion,key]);assert.equal(g.battle.fighters[1].pp[key],pp-2);
});
test('洛基在替补席依真实敌方攻击叠层，1/5以下清当次招PP，等于1/5结算真伤',()=>{
  for(const [hp,clears] of [[1799,true],[1800,false]]){
    const loki=member(4361);loki.snapshot.selectedSoulId=1586;loki.moves=E.WIKI.defaultMoves(loki.snapshot);loki.build.overrides.spa=500;
    let g=T.create([[member(3056),loki],[member(2988)]],[0,0],{seed:13});
    g.battle.fighters[1].hp=hp;
    g=T.turn(g,[potion,'wiki:19123']);
    assert.equal(g.slots[0][1].fighter.soulState.lokiLayers,1);
    assert.equal(g.battle.fighters[1].pp['wiki:19123']===0,clears);
    if(!clears)assert.ok(g.battle.damageEvents.some(e=>e.targetSide===1&&e.type==='true'&&e.hpLoss===100));
    g=T.turn(g,[{switchTo:1},potion]);
    const f=g.battle.fighters[0];
    assert.equal(f.soulState.lokiEntryLayers,1);assert.equal(f.suitState.shield,100);assert.equal(f.suitState.barrier,100);
    g=T.turn(g,[{switchTo:0},potion]);
    assert.equal(g.slots[0][1].fighter.soulState.lokiLayers,1);
  }
});



test("3575真实击败后接替者承受来源技能31835的异常或PP削减",()=>{const id=3575,skill=31835,effect=1331,amount=6;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test("3954真实击败后接替者承受来源技能36670的异常或PP削减",()=>{const id=3954,skill=36670,effect=2027,amount=2;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test("4646真实击败后接替者承受来源技能37371的异常或PP削减",()=>{const id=4646,skill=37371,effect=1663,amount=3;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test("4671真实击败后接替者承受来源技能37527的异常或PP削减",()=>{const id=4671,skill=37527,effect=2027,amount=2;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test("4693真实击败后接替者承受来源技能37667的异常或PP削减",()=>{const id=4693,skill=37667,effect=1663,amount=2;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test("4704真实击败后接替者承受来源技能37712的异常或PP削减",()=>{const id=4704,skill=37712,effect=2027,amount=2;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test("4800真实击败后接替者承受来源技能38101的异常或PP削减",()=>{const id=4800,skill=38101,effect=1663,amount=5;    const attacker=member(id);if(!attacker.moves.includes(skill))attacker.moves[1]=skill;
    Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;
    const before={...g.slots[1][1].fighter.pp};
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[null,1]);const f=g.battle.fighters[1];
    if(effect===1331)assert.ok(f.ailments['害怕']>=g.battle.round);
    if(effect===1663)assert.equal(f.moves.filter(k=>f.pp[k]===0).length,amount);
    if(effect===2027)for(const k of f.moves)assert.equal(f.pp[k],before[k]-amount);
  
if(id===3575){const low=member(id);if(!low.moves.includes(skill))low.moves[1]=skill;low.build.overrides.atk=180;let un=T.create([[low],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});un=T.turn(un,['wiki:'+skill,potion]);assert.deepEqual(un.pending,[]);un=T.turn(un,[potion,{switchTo:1}]);assert.equal(un.battle.fighters[1].ailments.害怕,undefined);}
});
test('4628当回合用招时对手流血才使击败接替者害怕',()=>{
  for(const bleed of [false,true]){
    const attacker=member(4628);Object.assign(attacker.build.overrides,{atk:9999,spa:9999,spe:9999});
    if(!attacker.moves.includes(37258))attacker.moves[1]=37258;
    let g=T.create([[attacker],[member(2988),member(3056)]],[0,0],{seed:13});
    g.battle.fighters[1].hp=1;if(bleed)g.battle.fighters[1].ailments['流血']=2;
    g=T.turn(g,['wiki:37258',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);
    assert.equal((g.battle.fighters[1].ailments['害怕']??0)>=g.battle.round,bleed);
  }
});
test('肃霜之禁主动换人按对手寂杀之魄扣除，阵亡换入清空，冰王换下保留三道魄',()=>{
  const king=member(3886);king.snapshot.selectedSoulId=1971;king.moves=E.WIKI.defaultMoves(king.snapshot);
  let g=T.create([[king,member(3056)],[member(2988),member(3056)]],[0,0],{seed:13});
  g.slots[1][1].fighter.hp=1;g.battle.fighters[0].soulState.coldEssence=3;g.battle.fighters[1].soulState.coldBan=200;
  g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.fighters[1].soulState.coldBan,150);
  g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.coldEssence,3);
  const hit=g.battle.fighters[0].moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
  g=T.turn(g,[hit,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,0]);assert.equal(g.battle.fighters[1].soulState.coldBan??0,0);
});
test("3001献祭技能23108让真正接替者获得并消耗先手必中",()=>{const [id,skill]=[3001,23108];
    const giver=member(id),receiver=member(3056);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    receiver.build.overrides.spe=1;
    let g=T.create([[giver,receiver],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[1,null]);const f=g.battle.fighters[0],attack=f.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
    assert.equal(skill===19142?f.soulState.nextAttack873:f.soulState.ji574NextSkill,true);
    g=T.turn(g,[attack,'wiki:19123']);
    const resolved=g.battle.turns.at(-1);assert.equal(resolved.first,0);
    const detail=resolved.events.find(e=>e.damage?.sourceSide===0&&e.damage?.type==='attack')?.detail;
    if(skill!==19142)assert.match(detail,/暴击 (?:1\.5|2)/);
    const red=g.battle.damageEvents.filter(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0);
    assert.ok(red.some(e=>e.hpLoss>0));assert.ok(!g.battle.fighters[0].soulState.nextAttack873);
    assert.ok(!g.battle.fighters[0].soulState.ji574NextSkill);
  });

test("3001献祭技能19142让真正接替者获得并消耗先手必中",()=>{const [id,skill]=[3001,19142];
    const giver=member(id),receiver=member(3056);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    receiver.build.overrides.spe=1;
    let g=T.create([[giver,receiver],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[1,null]);const f=g.battle.fighters[0],attack=f.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
    assert.equal(skill===19142?f.soulState.nextAttack873:f.soulState.ji574NextSkill,true);
    g=T.turn(g,[attack,'wiki:19123']);
    const resolved=g.battle.turns.at(-1);assert.equal(resolved.first,0);
    const detail=resolved.events.find(e=>e.damage?.sourceSide===0&&e.damage?.type==='attack')?.detail;
    if(skill!==19142)assert.match(detail,/暴击 (?:1\.5|2)/);
    const red=g.battle.damageEvents.filter(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0);
    assert.ok(red.some(e=>e.hpLoss>0));assert.ok(!g.battle.fighters[0].soulState.nextAttack873);
    assert.ok(!g.battle.fighters[0].soulState.ji574NextSkill);
  });

test("4532献祭技能28384让真正接替者获得并消耗先手必中",()=>{const [id,skill]=[4532,28384];
    const giver=member(id),receiver=member(3056);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    receiver.build.overrides.spe=1;
    let g=T.create([[giver,receiver],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[1,null]);const f=g.battle.fighters[0],attack=f.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
    assert.equal(skill===19142?f.soulState.nextAttack873:f.soulState.ji574NextSkill,true);
    g=T.turn(g,[attack,'wiki:19123']);
    const resolved=g.battle.turns.at(-1);assert.equal(resolved.first,0);
    const detail=resolved.events.find(e=>e.damage?.sourceSide===0&&e.damage?.type==='attack')?.detail;
    if(skill!==19142)assert.match(detail,/暴击 (?:1\.5|2)/);
    const red=g.battle.damageEvents.filter(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0);
    assert.ok(red.some(e=>e.hpLoss>0));assert.ok(!g.battle.fighters[0].soulState.nextAttack873);
    assert.ok(!g.battle.fighters[0].soulState.ji574NextSkill);
  });

test("4888献祭技能23108让真正接替者获得并消耗先手必中",()=>{const [id,skill]=[4888,23108];
    const giver=member(id),receiver=member(3056);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    receiver.build.overrides.spe=1;
    let g=T.create([[giver,receiver],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
    g=T.replace(g,[1,null]);const f=g.battle.fighters[0],attack=f.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
    assert.equal(skill===19142?f.soulState.nextAttack873:f.soulState.ji574NextSkill,true);
    g=T.turn(g,[attack,'wiki:19123']);
    const resolved=g.battle.turns.at(-1);assert.equal(resolved.first,0);
    const detail=resolved.events.find(e=>e.damage?.sourceSide===0&&e.damage?.type==='attack')?.detail;
    if(skill!==19142)assert.match(detail,/暴击 (?:1\.5|2)/);
    const red=g.battle.damageEvents.filter(e=>e.round===2&&e.type==='attack'&&e.sourceSide===0);
    assert.ok(red.some(e=>e.hpLoss>0));assert.ok(!g.battle.fighters[0].soulState.nextAttack873);
    assert.ok(!g.battle.fighters[0].soulState.ji574NextSkill);
  });

test("3512献祭后对手主动换入仍处于5回合属性技能失效窗口",()=>{const [id,skill,n]=[3512,25861,5];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056)],[member(3056),member(2988)]],[0,0],{seed:13});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.teamStatusBlock753[1].end,n);
    g=T.turn(g,[potion,'wiki:24651']);assert.equal(g.battle.fighters[1].stages.atk,0);
    while(g.battle.round<=n)g=T.turn(g,[potion,potion]);
    g=T.turn(g,[potion,'wiki:24651']);assert.ok(g.battle.fighters[1].stages.atk>0);
  });

test("4384献祭后对手主动换入仍处于3回合属性技能失效窗口",()=>{const [id,skill,n]=[4384,35932,3];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056)],[member(3056),member(2988)]],[0,0],{seed:13});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.teamStatusBlock753[1].end,n);
    g=T.turn(g,[potion,'wiki:24651']);assert.equal(g.battle.fighters[1].stages.atk,0);
    while(g.battle.round<=n)g=T.turn(g,[potion,potion]);
    g=T.turn(g,[potion,'wiki:24651']);assert.ok(g.battle.fighters[1].stages.atk>0);
  });

test('3512献祭后接替者两次技能先手必暴，药剂不消耗次数',()=>{
  const giver=member(3512);if(!giver.moves.includes(31505))giver.moves[1]=31505;
  let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,['wiki:31505',potion]);g=T.replace(g,[1,null]);g=T.turn(g,[potion,potion]);
  assert.equal(g.battle.fighters[0].soulState.teamFirstCrit1275,2);
  const f=g.battle.fighters[0],hit=f.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
  for(const expected of [1,0]){g=T.turn(g,[hit,'wiki:19123']);const tr=g.battle.turns.at(-1);assert.equal(tr.first,0);assert.match(tr.events.find(e=>e.damage?.sourceSide===0&&e.damage.type==='attack')?.detail,/暴击 (?:1\.5|2)/);assert.equal(g.battle.fighters[0].soulState.teamFirstCrit1275,expected);}
});
test('米斯蒂克献祭给第一只接替者500护盾，未用免异常随换人且全队只消耗一次',()=>{
  const giver=member(3082),enemy=member(4454);enemy.build.overrides.spa=1300;
  if(!giver.moves.includes(19473))giver.moves[1]=19473;
  if(!enemy.moves.includes(36313))enemy.moves[1]=36313;
  let g=T.create([[giver,member(2988),member(3056)],[enemy]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,['wiki:19473',potion]);assert.equal(g.phase,'replace');
  g=T.replace(g,[1,null]);const initial=g.battle.fighters[0];
  assert.equal(initial.suitState.shieldLayers.find(e=>e.source==='904:19473:a092987a:0').amount,500);
  assert.equal(g.battle.teamStatusBlock753[1].end,g.battle.round+2);
  g=T.turn(g,[{switchTo:2},potion]);
  assert.equal(g.battle.fighters[0].counts.immune,1);
  assert.ok(!g.battle.fighters[0].suitState.shieldLayers?.some(e=>e.source==='904:19473:a092987a:0'));
  g=T.turn(g,[potion,'wiki:36313']);assert.ok(!g.battle.fighters[0].ailments['流血']);assert.ok(!g.battle.fighters[0].counts.immune,JSON.stringify(g.battle.turns.at(-1).events));
  g=T.turn(g,[potion,'wiki:36313']);assert.ok(g.battle.fighters[0].ailments['流血']>=g.battle.round);
});
test('终末之光的三次奇迹之力仅命中攻击消耗，属性与未命中都保留次数',()=>{
  let g=T.create([[member(3383),member(3056)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,['wiki:30819',potion]);assert.equal(g.phase,'replace');
  g=T.replace(g,[1,null]);const n=()=>g.battle.fighters[0].soulState.miracleCharges1182;
  assert.equal(n(),3);
  const m=g.battle.fighters[0].moves,status=m.find(k=>g.battle.moveDefinitions[k].kind==='status');
  g=T.turn(g,[status,{switchTo:1}]);assert.equal(n(),3);
  const f=g.battle.fighters[0];f.effects['攻击必失']={start:g.battle.round,end:g.battle.round};
  g=T.turn(g,['wiki:19368',potion]);assert.equal(n(),3);
  const r=g.battle.round;g=T.turn(g,['wiki:19368',potion]);assert.equal(n(),2);
  assert.ok(g.battle.damageEvents.some(e=>e.round===r&&e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===3000));
});
test('赤瞳不灭幻击败对手后，真实补位者只降速度和命中各一级',()=>{
  const giver=member(3075);if(!giver.moves.includes(19453))giver.moves[1]=19453;
  let g=T.create([[giver],[member(2988),member(3056)]],[0,0],{seed:13});
  g.battle.fighters[1].hp=2;g=T.turn(g,['wiki:19453',potion]);assert.equal(g.phase,'replace');
  g=T.replace(g,[null,1]);assert.deepEqual(g.battle.fighters[1].stages,{atk:0,def:0,spa:0,spd:0,spe:-1,acc:-1});
});
test('3221献祭技能25144给接替者独立的限时增伤与先制',()=>{const [id,skill,duration,percent]=[3221,25144,3,49];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    const f=g.battle.fighters[0],buff=f.effects['九死增伤与先制'];assert.equal(buff.bonus,percent/100);assert.equal(buff.end,g.battle.round+duration-1);assert.equal(buff.priority,1);
    const no=structuredClone(g);delete no.battle.fighters[0].effects['九死增伤与先制'];
    const key='wiki:19369',r=g.battle.round;const result=state=>T.turn(state,[key,potion]).battle.damageEvents.find(e=>e.round===r&&e.type==='attack'&&e.sourceSide===0)?.settledDamage;
    const a=result(g),b=result(no);assert.ok(Math.abs(a-b*(1+percent/100))<2,'实测伤害 '+a+' / '+b);
});
test('4373献祭技能27972给接替者独立的限时增伤与先制',()=>{const [id,skill,duration,percent]=[4373,27972,2,50];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    const f=g.battle.fighters[0],buff=f.effects['九死增伤与先制'];assert.equal(buff.bonus,percent/100);assert.equal(buff.end,g.battle.round+duration-1);assert.equal(buff.priority,1);
    const no=structuredClone(g);delete no.battle.fighters[0].effects['九死增伤与先制'];
    const key='wiki:19369',r=g.battle.round;const result=state=>T.turn(state,[key,potion]).battle.damageEvents.find(e=>e.round===r&&e.type==='attack'&&e.sourceSide===0)?.settledDamage;
    const a=result(g),b=result(no);assert.ok(Math.abs(a-b*(1+percent/100))<2,'实测伤害 '+a+' / '+b);
});
test('4887献祭技能29301给接替者独立的限时增伤与先制',()=>{const [id,skill,duration,percent]=[4887,29301,2,50];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    const f=g.battle.fighters[0],buff=f.effects['九死增伤与先制'];assert.equal(buff.bonus,percent/100);assert.equal(buff.end,g.battle.round+duration-1);assert.equal(buff.priority,1);
    const no=structuredClone(g);delete no.battle.fighters[0].effects['九死增伤与先制'];
    const key='wiki:19369',r=g.battle.round;const result=state=>T.turn(state,[key,potion]).battle.damageEvents.find(e=>e.round===r&&e.type==='attack'&&e.sourceSide===0)?.settledDamage;
    const a=result(g),b=result(no);assert.ok(Math.abs(a-b*(1+percent/100))<2,'实测伤害 '+a+' / '+b);
});
test('克罗诺斯下场加护只限普通攻击，先受100固伤不消耗，强制补位也授予',()=>{
  for(const forced of [false,true]){
    const attacker=member(3465);if(!attacker.moves.includes(12912))attacker.moves[1]=12912;Object.assign(attacker.build.overrides,{atk:1800,spa:1800});
    let g=T.create([[member(3443),member(3056)],[attacker]],[0,0],{seed:13,criticals:false});
    const hit='wiki:12912';g.battle.fighters[1].stages.acc=6;
    if(forced){g.battle.fighters[0].hp=1;g=T.turn(g,[potion,hit]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);}
    else {g.battle.fighters[1].hp-=100;g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.battle.damageEvents.some(e=>e.type==='fixed'&&e.hpLoss===100&&e.targetSide===0));}
    assert.equal(g.battle.fighters[0].soulState.kronRedCap,250);
    const r=g.battle.round;g=T.turn(g,[potion,hit]);
    assert.ok(g.battle.damageEvents.some(e=>e.round===r&&e.type==='attack'&&e.sourceSide===1&&e.settledDamage===250));
    assert.ok(!g.battle.fighters[0].soulState.kronRedCap);
  }
});
test('天弓啸月先手击败后，仅在下一回合封接替者低于门槛的攻击',()=>{
  const hunter=member(3514),next=member(2988);if(!hunter.moves.includes(36200))hunter.moves[1]=36200;
  next.moves[1]=10018;
  let g=T.create([[hunter],[member(3056),next]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:36200','wiki:19369']);assert.equal(g.phase,'replace');
  g=T.replace(g,[null,1]);const low='wiki:10018',r=g.battle.round;assert.ok(g.battle.fighters[1].soulState.hunterAttackBlockPower>=70);
  g=T.turn(g,[potion,low]);assert.ok(!g.battle.damageEvents.some(e=>e.round===r&&e.moveKey===low&&e.type==='attack'));
  g=T.turn(g,[potion,low]);assert.ok(g.battle.damageEvents.some(e=>e.round===r+1&&e.moveKey===low&&e.type==='attack'));
});
test('觉醒洛基场下将非致死真伤转弧光，吸5PP随机分3和2，非空槽不参与',()=>{
  const seen=new Set();
  for(let seed=1;seed<=20&&seen.size<2;seed++){
    const loki=member(4361);loki.snapshot.selectedSoulId=2055;loki.build.overrides.spa=500;
    let g=T.create([[member(3056),loki],[member(2988),member(3056)]],[0,0],{seed,criticals:false});
    const own=g.battle.fighters[0],enemy=g.battle.fighters[1],empty=own.moves.slice(0,2),key='wiki:19123';
    for(const k of empty)own.pp[k]=0;enemy.pp[key]=6;
    g=T.turn(g,['potion:hp',key]);
    const a=g.battle.fighters[0],t=g.battle.fighters[1],pair=empty.map(k=>a.pp[k]);seen.add(pair.join(','));
    assert.deepEqual(pair.slice().sort(),[2,3]);assert.equal(t.pp[key],0);assert.equal(t.soulState.lokiFalseArc,100);
    assert.equal(g.slots[0][1].fighter.soulState.lokiLayers,1);assert.ok(!g.battle.damageEvents.some(e=>e.sourceSide===0&&e.type==='true'));
    g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.lokiFalseArc,100);
  }
  assert.deepEqual([...seen].sort(),['2,3','3,2']);
});
test('献祭19142立即清敌强化和回合效果，接替者首攻实测双倍，后续恢复',()=>{
  const giver=member(3001);if(!giver.moves.includes(19142))giver.moves[1]=19142;
  let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,[potion,'wiki:24650']);const enemy=g.battle.fighters[1];assert.ok(Object.keys(enemy.effects).length);
  enemy.stages.def=2;
  g=T.turn(g,['wiki:19142',potion]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].stages.def,0);assert.deepEqual(g.battle.fighters[1].effects,{});
  g=T.replace(g,[1,null]);const control=structuredClone(g);delete control.battle.fighters[0].soulState.nextAttack873;
  const key='wiki:19369',r=g.battle.round;
  const dmg=state=>state.battle.damageEvents.find(e=>e.moveKey===key&&e.round===r&&e.type==='attack').settledDamage;
  // Both variants act first against the slower opposing attack so the RNG sequence is identical.
  for(const game of [control,g]){game.battle.fighters[0].stats.spe=9999;game.battle.fighters[1].stats.spe=1;}
  const actions=[key,'wiki:19123'];const actual=T.turn(g,actions),normal=T.turn(control,actions);
  assert.equal(actual.battle.turns.at(-1).first,0);assert.equal(normal.battle.turns.at(-1).first,0);
  assert.ok(Math.abs(dmg(actual)-2*dmg(normal))<=2,'实伤 '+dmg(actual)+' 与 '+dmg(normal));
  assert.ok(!actual.battle.fighters[0].soulState.nextAttack873);
});
test('觉醒洛基三层登场盾消失，主动换下后接替者实际免攻击，免疫重置弧光和场下神祇',()=>{
  const loki=member(4361),attacker=member(3056);loki.snapshot.selectedSoulId=2055;loki.build.overrides.spa=500;attacker.build.overrides.atk=1200;
  let g=T.create([[member(2988),loki],[attacker]],[0,0],{seed:13,criticals:false});
  for(let i=0;i<3;i++)g=T.turn(g,['potion:hp','wiki:19369']);
  assert.equal(g.slots[0][1].fighter.soulState.lokiLayers,3);assert.equal(g.battle.fighters[1].soulState.lokiFalseArc,300);
  g=T.turn(g,[{switchTo:1},'wiki:19369']);assert.equal(g.battle.fighters[0].soulState.lokiEntryLayers,3);
  assert.equal(g.battle.teamLokiGuard[0].round,g.battle.round);
  const r=g.battle.round;g=T.turn(g,[{switchTo:0},'wiki:19369']);
  assert.ok(!g.battle.damageEvents.some(e=>e.round===r&&e.type==='attack'&&e.sourceSide===1&&e.hpLoss>0));
  // 免疫先重置；该次敌方攻击结束后，存活的场下洛基重新发动一次神诗叙诡。
  assert.equal(g.slots[0][1].fighter.soulState.lokiLayers,1);assert.equal(g.battle.fighters[1].soulState.lokiFalseArc,100);
});
test("4676真实献祭技能19473按来源传指定护盾、全队免异常和封属时间",()=>{const [id,skill,shield,guard,turns]=[4676,19473,500,1,3];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056),member(2988)],[member(3056)]],[0,0],{seed:13});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    const f=g.battle.fighters[0];assert.equal(f.suitState.shieldLayers.filter(x=>x.source.startsWith('904:')).reduce((v,x)=>v+x.amount,0),shield);
    assert.equal(f.counts.immune,guard);assert.equal(g.battle.teamStatusBlock753[1].end,g.battle.round+turns-1);
    g=T.turn(g,[{switchTo:2},potion]);assert.equal(g.battle.fighters[0].counts.immune,guard);
  });

test("4895真实献祭技能38366按来源传指定护盾、全队免异常和封属时间",()=>{const [id,skill,shield,guard,turns]=[4895,38366,777,2,2];
    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    let g=T.create([[giver,member(3056),member(2988)],[member(3056)]],[0,0],{seed:13});
    g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
    const f=g.battle.fighters[0];assert.equal(f.suitState.shieldLayers.filter(x=>x.source.startsWith('904:')).reduce((v,x)=>v+x.amount,0),shield);
    assert.equal(f.counts.immune,guard);assert.equal(g.battle.teamStatusBlock753[1].end,g.battle.round+turns-1);
    g=T.turn(g,[{switchTo:2},potion]);assert.equal(g.battle.fighters[0].counts.immune,guard);
  });

test("3549满体用招回复按来源29392奶场下，开始回复时未满只奶本人",()=>{const id=3549,skill=29392,hp=200;    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    for(const full of [false,true]){
      let g=T.create([[giver,member(2988),member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
      g.slots[0][1].fighter.hp=8000;g.slots[0][2].fighter.hp=8999;g.slots[0][3].fighter.hp=0;
      if(!full)g.battle.fighters[0].hp=8750;
      g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.slots[0].slice(1).map(e=>e.fighter.hp),full?[8000+hp,9000,0]:[8000,8999,0]);
      assert.equal(g.battle.fighters[0].hp,9000);
    }
  
});
test("4135满体用招回复按来源27364奶场下，开始回复时未满只奶本人",()=>{const id=4135,skill=27364,hp=100;    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    for(const full of [false,true]){
      let g=T.create([[giver,member(2988),member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
      g.slots[0][1].fighter.hp=8000;g.slots[0][2].fighter.hp=8999;g.slots[0][3].fighter.hp=0;
      if(!full)g.battle.fighters[0].hp=8750;
      g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.slots[0].slice(1).map(e=>e.fighter.hp),full?[8000+hp,9000,0]:[8000,8999,0]);
      assert.equal(g.battle.fighters[0].hp,9000);
    }
  
});
test("4239满体用招回复按来源27631奶场下，开始回复时未满只奶本人",()=>{const id=4239,skill=27631,hp=100;    const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
    for(const full of [false,true]){
      let g=T.create([[giver,member(2988),member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
      g.slots[0][1].fighter.hp=8000;g.slots[0][2].fighter.hp=8999;g.slots[0][3].fighter.hp=0;
      if(!full)g.battle.fighters[0].hp=8750;
      g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.slots[0].slice(1).map(e=>e.fighter.hp),full?[8000+hp,9000,0]:[8000,8999,0]);
      assert.equal(g.battle.fighters[0].hp,9000);
    }
  
});
test('天地尽灭消强后随机扣一个存活替补上限四分之一且保1，不消强不扣',()=>{
 const giver=member(3550);if(!giver.moves.includes(31577))giver.moves[1]=31577;
 for(const boosted of [false,true]){
   let g=T.create([[giver],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
   const [current,...bench]=g.slots[1].map(s=>s.fighter);current.stages.atk=boosted?2:0;
   for(const f of bench)f.hp=200;
   g=T.turn(g,['wiki:31577',potion]);assert.deepEqual(g.slots[1].slice(1).map(s=>s.fighter.hp).sort((a,b)=>a-b),boosted?[1,200]:[200,200]);
 }
});
test('轮回之狱让对方属性招回复己方场下，低伤攻击扣敌方场下至1',()=>{
 const giver=member(3550),attacker=member(3056);attacker.build.overrides.atk=100;
 if(!giver.moves.includes(25898))giver.moves[1]=25898;
 let g=T.create([[giver,member(3056)],[attacker,member(2988)]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.hp=8000;g.slots[1][1].fighter.hp=90;
 g=T.turn(g,['wiki:25898',potion]);g=T.turn(g,[potion,'wiki:24780']);assert.equal(g.slots[0][1].fighter.hp,8100);
 g=T.turn(g,[potion,'wiki:19369']);assert.equal(g.slots[1][1].fighter.hp,1);
});
test('纵横三千界按当前场下选人：原首发与未出场者同扣100，在场者只受本次攻击',()=>{
  const emperor=member(3550);if(!emperor.moves.includes(31582))emperor.moves[1]=31582;
  for(const low of [true,false]){
    emperor.build.overrides.atk=emperor.build.overrides.spa=low?40:3000;
    let g=T.create([[emperor],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
    g=T.turn(g,[potion,{switchTo:1}]);const before=g.slots[1].map(x=>x.fighter.hp),r=g.battle.round;
    g=T.turn(g,['wiki:31582',potion]);
    const attack=g.battle.damageEvents.find(x=>x.round===r&&x.type==='attack'&&x.sourceSide===0);
    assert.equal(attack.settledDamage<350,low);assert.equal(g.slots[1][0].fighter.hp,before[0]-(low?100:0));assert.equal(g.slots[1][2].fighter.hp,before[2]-(low?100:0));
  }
});
test('帝君之罚赐首次三分一、再入九分一，纵横三千界击败后下次返场恢复三分一',()=>{
 for(const boost of [false,true]){
  const emperor=member(3550);if(!emperor.moves.includes(31582))emperor.moves[1]=31582;
  let g=T.create([[member(2988),emperor],[member(3056),member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
  g.battle.fighters[0].hp=4000;if(boost)g.battle.fighters[1].hp=1;g=T.turn(g,[{switchTo:1},potion]);
  assert.equal(g.slots[0][0].fighter.hp,7000);assert.equal(g.slots[1][2].fighter.hp,6000);
  if(boost){g=T.turn(g,['wiki:31582',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);}
  g=T.turn(g,[{switchTo:0},potion]);const before=g.slots[1][2].fighter.hp;
  const ownBefore=g.battle.fighters[0].hp;assert.ok(ownBefore<8000);g=T.turn(g,[{switchTo:1},potion]);
  assert.equal(g.slots[0][0].fighter.hp,Math.min(9000,ownBefore+(boost?3000:1000)));assert.equal(g.slots[1][2].fighter.hp,before-(boost?3000:1000));
 }
});
test('帝君之阵按当前存活替补实际回复，满体不附粉，用药不触发',()=>{
  for(const hp of [7000,8500,9000]){
    let g=T.create([[member(3550)],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
    const f=g.battle.fighters[0];f.hp=hp;
    const status=f.moves.find(k=>g.battle.moveDefinitions[k].kind==='status'&&k!=='wiki:25899');
    g=T.turn(g,[status,potion]);
    const restored=Math.min(9000-hp,1800);
    assert.equal(g.battle.fighters[0].hp,hp+restored);
    const damage=(g.battle.damageEvents??[]).filter(e=>e.type==='percent'&&e.sourceSide===0);
    assert.equal(damage.reduce((sum,e)=>sum+e.settledDamage,0),restored);
    // Separate legal initial potion-negative profile.
    g=T.create([[member(3550)],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].hp=7000;g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].hp,7000);
  }
});
test('帝君之殒对方在场不受影响，阵亡触发时只击败一名存活替补',()=>{
 const outcomes=new Set();
 for(let seed=1;seed<=36&&outcomes.size<3;seed++){
   let g=T.create([[member(3550),member(3056)],[member(2988),member(3056),member(2987)]],[0,0],{seed,criticals:false});
   g.battle.fighters[0].hp=1;
   g=T.turn(g,[potion,'wiki:19123']);
   assert.equal(g.phase,'replace');assert.ok(g.battle.fighters[1].hp>0);
   const dead=g.slots[1].slice(1).flatMap((slot,i)=>slot.fighter.hp===0?[i]:[]);
   assert.ok(dead.length<=1);outcomes.add(dead.join(','));
 }
 assert.deepEqual([...outcomes].sort(),['','0','1']);
});
test('觉醒莱茵哈特用38009获得封邪与蛊，换下后两层使500护盾抵挡600，蛊随持有人下场与返场',()=>{
 const king=member(3516);king.snapshot.selectedSoulId=1985;if(!king.moves.includes(38009))king.moves[1]=38009;
 const foe=member(3056);foe.build.overrides.atk=2300;
 let g=T.create([[king,member(2988)],[foe,member(2988)]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.suitState.shield=500;g.battle.fighters[1].build.resistance.percent=100;
 for(let i=0;i<2;i++)g=T.turn(g,['wiki:38009',potion]);
 assert.equal(g.battle.fighters[0].soulState.sealLayers,2);
 assert.ok(g.battle.fighters[1].soulState.soulGu.length>=2);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.slots[0][0].fighter.soulState.sealLayers,2);
 const bugs=g.slots[1][0].fighter.soulState.soulGu.length;g=T.turn(g,[potion,{switchTo:0}]);
 assert.equal(g.battle.fighters[1].soulState.soulGu.length,bugs);
 g=T.turn(g,[potion,'wiki:19369']);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('护盾抵挡 600 点')));assert.equal(g.battle.fighters[0].suitState.shield,0);
 // Separate legal initial Gu/healing boundary; real earning, two seals and holder leave/return are asserted above.
 const earnedGu=structuredClone(g.battle.fighters[1].soulState.soulGu);g=T.create([[king,member(2988)],[foe,member(2988)]],[1,0],{seed:13,criticals:false});g.slots[0][0].fighter.soulState.sealLayers=2;g.battle.fighters[1].soulState.soulGu=earnedGu;g.battle.fighters[1].hp=4500;g.battle.fighters[0].hp=5000;const r=g.battle.round;
 g=T.turn(g,[potion,'potion:hp']);assert.equal(g.battle.fighters[0].hp,5000);
 assert.ok(g.battle.damageEvents.some(e=>e.round===r&&e.type==='true'&&e.hpLoss===40));
});
test('帝君之威按敌我各自最后存活者分开判定清回合和禁技能回复',()=>{
 for(const last of [false,true])for(const enemyLast of [false,true]){
  const other=member(3056);if(!other.moves.includes(23285))other.moves[1]=23285;
  let g=T.create([[member(3550),member(2988)],[other,member(2988)]],[0,0],{seed:13,criticals:false});
  if(last)g.slots[0][1].fighter.hp=0; if(enemyLast)g.slots[1][1].fighter.hp=0;
  const f=g.battle.fighters[0];f.effects['攻击伤害倍数']={start:1,end:5,multiple:1.5};
  g=T.turn(g,[potion,'wiki:19369']);assert.equal(!!g.battle.fighters[0].effects['攻击伤害倍数'],last);
  // Independent initial HP/last-member recovery boundary; the clear-effect native attack has already been asserted.
  g=T.create([[member(3550),member(2988)],[other,member(2988)]],[0,0],{seed:13,criticals:false});if(last)g.slots[0][1].fighter.hp=0;if(enemyLast)g.slots[1][1].fighter.hp=0;g.battle.fighters[1].hp=4000;g=T.turn(g,[potion,'wiki:23285']);assert.equal(g.battle.fighters[1].hp,enemyLast?7000:9000,JSON.stringify(g.battle.turns.at(-1).events.map(e=>e.text)));
 }
});
test('封邪护盾被大地之疵无视，一层回200，两层回400，盾不扣除',()=>{
 for(const layers of [0,1,2]){
  const king=member(3516);king.snapshot.selectedSoulId=1985;
  const attacker=member(3716);if(!attacker.moves.includes(36878))attacker.moves[1]=36878;
  let g=T.create([[member(3056),king],[attacker]],[0,0],{seed:13,criticals:false});
  g.slots[0][1].fighter.soulState.sealLayers=layers;
  const holder=g.battle.fighters[0];holder.hp=5000;holder.suitState.shield=500;
  g=T.turn(g,[potion,'wiki:36878']);assert.equal(g.battle.fighters[0].suitState.shield,500);
  const heals=g.battle.turns.at(-1).events.filter(e=>e.text.includes('封邪之嶂')&&e.kind==='heal');
  assert.equal(heals.length,layers?1:0);
  if(layers)assert.ok(heals[0].text.includes('回复 '+layers*200+' 点体力'),heals[0].text);
 }
});
test("3665魂印951连续击败两名不同对手累计两次，最新统一规则下场返场清零",()=>{const [id,soul,field]=[3665,951,"zakKills"];
    const owner=member(id);owner.snapshot.selectedSoulId=soul;owner.build.overrides.atk=owner.build.overrides.spa=2500;
    let g=T.create([[owner,member(3056)],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
    for(let i=0;i<2;i++){
      g.battle.fighters[1].hp=1;const attacker=g.battle.fighters[0];const move=attacker.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
      g=T.turn(g,[move,potion]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState[field],i+1);
      g=T.replace(g,[null,i+1]);
    }
    const kept=id===3665?0:2;
    g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState[field]??0,kept);
    g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState[field]??0,kept);
  });

test("3865魂印1137连续击败两名不同对手累计两次，明确切换保留下场返场仍两次",()=>{const [id,soul,field]=[3865,1137,"shivaDefeats"];
    const owner=member(id);owner.snapshot.selectedSoulId=soul;owner.build.overrides.atk=owner.build.overrides.spa=2500;
    let g=T.create([[owner,member(3056)],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
    g.battle.fighters[1].hp=1;g.slots[1][1].fighter.hp=1;
    for(let i=0;i<2;i++){
      const attacker=g.battle.fighters[0];const move=attacker.moves.find(k=>['physical','special'].includes(g.battle.moveDefinitions[k].kind));
      g=T.turn(g,[move,potion]);assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[0].soulState[field],i+1);
      g=T.replace(g,[null,i+1]);
    }
    const kept=id===3665?0:2;
    g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState[field]??0,kept);
    g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState[field]??0,kept);
  });

test('奥佩娅首发和第一次返场可封属性招，第三次登场用完两次机会',()=>{
 let g=T.create([[member(3626),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(let i=0;i<3;i++){
   g=T.turn(g,[i?{switchTo:0}:potion,'wiki:19123']);
   assert.equal(g.battle.fighters[1].counts.nextStatusInvalid??0,i<2?1:0);
   g=T.turn(g,[{switchTo:1},'wiki:24651']);
 }
});
for(const soul of [1165,1959])test('伽玛星魂'+soul+'核对连续三次真实登场的免弱窗口',()=>{
 const gamma=member(3896),enemy=member(2988);gamma.snapshot.selectedSoulId=soul;enemy.moves[1]=19116;
 let g=T.create([[gamma,member(3056)],[enemy]],[0,0],{seed:13,criticals:false});
 for(let entry=1;entry<=3;entry++){
   g=T.turn(g,[entry===1?potion:{switchTo:0},'wiki:19116']);
   assert.equal(g.battle.fighters[0].stages.def,soul===1165&&entry===3?-1:0);
   g=T.turn(g,[{switchTo:1},potion]);
 }
});
test("托鲁克931后手所得先制下场清零，返场重新按速度行动",()=>{const soul=931; const toruk=member(3642);toruk.snapshot.selectedSoulId=soul;toruk.build.overrides.spe=1;
 let g=T.create([[toruk,member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const key='wiki:32204';g=T.turn(g,[key,'wiki:19367']);assert.equal(g.battle.turns.at(-1).first,1);
 assert.equal(g.battle.fighters[0].soulState.torukPending,1);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.torukPending??0,0);
 g=T.turn(g,[{switchTo:0},potion]);g=T.turn(g,[key,'wiki:19367']);
 assert.equal(g.battle.turns.at(-1).first,1);assert.equal(g.battle.fighters[0].soulState.torukPending,1);

});
test("托鲁克1473后手所得先制下场清零，返场重新按速度行动",()=>{const soul=1473; const toruk=member(3642);toruk.snapshot.selectedSoulId=soul;toruk.build.overrides.spe=1;
 let g=T.create([[toruk,member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const key='wiki:32204';g=T.turn(g,[key,'wiki:19367']);assert.equal(g.battle.turns.at(-1).first,1);
 assert.equal(g.battle.fighters[0].soulState.torukPending,1);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.torukPending??0,0);
 g=T.turn(g,[{switchTo:0},potion]);g=T.turn(g,[key,'wiki:19367']);
 assert.equal(g.battle.turns.at(-1).first,1);assert.equal(g.battle.fighters[0].soulState.torukPending,1);

});
test('3840魂印1113在对手真实补位时吸取三分一，并按魂印强化或催眠',()=>{const [id,soul]=[3840,1113];
 const owner=member(id);owner.snapshot.selectedSoulId=soul;owner.build.overrides.atk=owner.build.overrides.spa=1800;const plain=E.WIKI.availableMoves(owner.snapshot).find(m=>m.power>0&&!m.effectInstances.length&&!m.fifth);assert.ok(plain);if(!owner.moves.includes(plain.id))owner.moves[1]=plain.id;
 const outcomes=new Set();
 for(let seed=1;seed<=15&&outcomes.size<(soul===1157?2:1);seed++){
  let g=T.create([[owner],[member(3056),member(2988)]],[0,0],{seed,criticals:false});
  g.battle.fighters[1].hp=1;g.battle.fighters[0].hp=3000;const hit='wiki:'+plain.id;
  g=T.turn(g,[hit,potion]);assert.equal(g.phase,'replace');
  const before={...g.battle.fighters[0].stages},beforeHp=g.battle.fighters[0].hp;
  const reflected=g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='true');assert.equal(reflected.length,1);assert.ok(reflected[0].hpLoss>0);assert.equal(beforeHp,3000-reflected[0].hpLoss);
  g=T.replace(g,[null,1]);const f=g.battle.fighters[0],t=g.battle.fighters[1];
  assert.equal(f.hp,beforeHp+3000);assert.equal(t.hp,6000);
  if(soul===1113)for(const k of Object.keys(before))assert.equal(f.stages[k],Math.min(6,before[k]+1));
  outcomes.add(!!t.ailments['睡眠']);
 }
 if(soul===1561)assert.ok(outcomes.has(true));if(soul===1157)assert.equal(outcomes.size,2);
});
test('3888魂印1157在对手真实补位时吸取三分一，并按魂印强化或催眠',()=>{const [id,soul]=[3888,1157];
 const owner=member(id);owner.snapshot.selectedSoulId=soul;owner.build.overrides.atk=owner.build.overrides.spa=1800;const plain=E.WIKI.availableMoves(owner.snapshot).find(m=>m.power>0&&!m.effectInstances.length&&!m.fifth);assert.ok(plain);if(!owner.moves.includes(plain.id))owner.moves[1]=plain.id;
 const outcomes=new Set();
 for(let seed=1;seed<=15&&outcomes.size<(soul===1157?2:1);seed++){
  let g=T.create([[owner],[member(3056),member(2988)]],[0,0],{seed,criticals:false});
  g.battle.fighters[1].hp=1;g.battle.fighters[0].hp=3000;const hit='wiki:'+plain.id;
  g=T.turn(g,[hit,potion]);assert.equal(g.phase,'replace');
  const before={...g.battle.fighters[0].stages},beforeHp=g.battle.fighters[0].hp;
  const reflected=g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='true');assert.equal(reflected.length,1);assert.ok(reflected[0].hpLoss>0);assert.equal(beforeHp,3000-reflected[0].hpLoss);
  g=T.replace(g,[null,1]);const f=g.battle.fighters[0],t=g.battle.fighters[1];
  assert.equal(f.hp,beforeHp+3000);assert.equal(t.hp,6000);
  if(soul===1113)for(const k of Object.keys(before))assert.equal(f.stages[k],Math.min(6,before[k]+1));
  outcomes.add(!!t.ailments['睡眠']);
 }
 if(soul===1561)assert.ok(outcomes.has(true));if(soul===1157)assert.equal(outcomes.size,2);
});
test('3888魂印1561在对手真实补位时吸取三分一，并按魂印强化或催眠',()=>{const [id,soul]=[3888,1561];
 const owner=member(id);owner.snapshot.selectedSoulId=soul;owner.build.overrides.atk=owner.build.overrides.spa=1800;const plain=E.WIKI.availableMoves(owner.snapshot).find(m=>m.power>0&&!m.effectInstances.length&&!m.fifth);assert.ok(plain);if(!owner.moves.includes(plain.id))owner.moves[1]=plain.id;
 const outcomes=new Set();
 for(let seed=1;seed<=15&&outcomes.size<(soul===1157?2:1);seed++){
  let g=T.create([[owner],[member(3056),member(2988)]],[0,0],{seed,criticals:false});
  g.battle.fighters[1].hp=1;g.battle.fighters[0].hp=3000;const hit='wiki:'+plain.id;
  g=T.turn(g,[hit,potion]);assert.equal(g.phase,'replace');
  const before={...g.battle.fighters[0].stages},beforeHp=g.battle.fighters[0].hp;
  const reflected=g.battle.damageEvents.filter(e=>e.round===1&&e.sourceSide===1&&e.targetSide===0&&e.type==='true');assert.equal(reflected.length,1);assert.ok(reflected[0].hpLoss>0);assert.equal(beforeHp,3000-reflected[0].hpLoss);
  g=T.replace(g,[null,1]);const f=g.battle.fighters[0],t=g.battle.fighters[1];
  assert.equal(f.hp,beforeHp+3000);assert.equal(t.hp,6000);
  if(soul===1113)for(const k of Object.keys(before))assert.equal(f.stages[k],Math.min(6,before[k]+1));
  outcomes.add(!!t.ailments['睡眠']);
 }
 if(soul===1561)assert.ok(outcomes.has(true));if(soul===1157)assert.equal(outcomes.size,2);
});
test('凌波清芙1157阵亡回复存活替补三分之一，实际补位者得400盾罩',()=>{const soul=1157;
 const lotus=member(3888);lotus.snapshot.selectedSoulId=soul;
 let g=T.create([[lotus,member(2988),member(3056),member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;g.slots[0][1].fighter.hp=5000;g.slots[0][2].fighter.hp=8000;g.slots[0][3].fighter.hp=0;
 g=T.turn(g,[potion,'wiki:19369']);assert.equal(g.phase,'replace');
 assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),[8000,9000,0]);
 g=T.replace(g,[2,null]);const f=g.battle.fighters[0];assert.equal(f.suitState.shield,400);assert.equal(f.suitState.barrier,400);
});
test('凌波清芙1561阵亡回复存活替补三分之一，实际补位者得400盾罩',()=>{const soul=1561;
 const lotus=member(3888);lotus.snapshot.selectedSoulId=soul;
 let g=T.create([[lotus,member(2988),member(3056),member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;g.slots[0][1].fighter.hp=5000;g.slots[0][2].fighter.hp=8000;g.slots[0][3].fighter.hp=0;
 g=T.turn(g,[potion,'wiki:19369']);assert.equal(g.phase,'replace');
 assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),[8000,9000,0]);
 g=T.replace(g,[2,null]);const f=g.battle.fighters[0];assert.equal(f.suitState.shield,400);assert.equal(f.suitState.barrier,400);
});
test('墨影1197每次登场封当前对手并为实际月照累计10%至50%',()=>{const soul=1197;
 const ink=member(3932);ink.snapshot.selectedSoulId=soul;
 let g=T.create([[ink,member(3866)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 for(let visit=1;visit<=6;visit++){
   assert.equal(g.battle.teamMoonPower[0],Math.min(visit,5));
   const foe=g.battle.fighters[1];assert.ok(foe.effects.statusBlock.end>=g.battle.round);
   g=T.turn(g,[{switchTo:1},potion]);
   if(visit===1){
     const ctrl=structuredClone(g);ctrl.battle.teamMoonPower[0]=0;
     const f=g.battle.fighters[0],hit=f.moves.find(k=>g.battle.moveDefinitions[k].power>0);
     const dmg=state=>T.turn(state,[hit,potion]).battle.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack')?.settledDamage;
     const normal=dmg(ctrl),boosted=dmg(g);assert.ok(Math.abs(boosted-normal*1.1)<2,'实测 '+boosted+' / '+normal);
   }
   if(visit<6)g=T.turn(g,[{switchTo:0},potion]);
 }
});
test('墨影1436每次登场封当前对手并为实际月照累计10%至50%',()=>{const soul=1436;
 const ink=member(3932);ink.snapshot.selectedSoulId=soul;
 let g=T.create([[ink,member(3866)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 for(let visit=1;visit<=6;visit++){
   assert.equal(g.battle.teamMoonPower[0],Math.min(visit,5));
   const foe=g.battle.fighters[1];assert.ok(foe.effects.statusBlock.end>=g.battle.round);
   g=T.turn(g,[{switchTo:1},potion]);
   if(visit===1){
     const ctrl=structuredClone(g);ctrl.battle.teamMoonPower[0]=0;
     const f=g.battle.fighters[0],hit=f.moves.find(k=>g.battle.moveDefinitions[k].power>0);
     const dmg=state=>T.turn(state,[hit,potion]).battle.damageEvents.find(e=>e.sourceSide===0&&e.type==='attack')?.settledDamage;
     const normal=dmg(ctrl),boosted=dmg(g);assert.ok(Math.abs(boosted-normal*1.1)<2,'实测 '+boosted+' / '+normal);
   }
   if(visit<6)g=T.turn(g,[{switchTo:0},potion]);
 }
});
test('X·神迹重复登场按当回合对手出招类别封下一回合，攻防两类层数换下保留',()=>{
 let g=T.create([[member(3672),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const m=g.battle.fighters[0].moves,defs=g.battle.moveDefinitions;
 const attack='wiki:32333',status=m.find(k=>defs[k].kind==='status');
 g=T.turn(g,[attack,'wiki:19123']);assert.equal(g.battle.fighters[1].effects.statusBlock.end,g.battle.round);
 g=T.turn(g,[status,potion]);g=T.turn(g,[{switchTo:1},potion]);
 const saved=g.slots[0][0].fighter.soulState;assert.equal(saved.miracleAttacks,1);assert.equal(saved.miracleStatuses,1);
 g=T.turn(g,[{switchTo:0},'wiki:24651']);assert.equal(g.battle.fighters[1].effects.attackBlock.end,g.battle.round);
 assert.equal(g.battle.fighters[0].soulState.miracleAttacks,1);
});
test('倪克斯1555再次入场按当前强化重判首回合，离场清除本次幕的对手先制限制',()=>{const soul=1555;
 const nyx=member(4329);nyx.snapshot.selectedSoulId=soul;
 let g=T.create([[member(3056),nyx],[member(2988)]],[0,0],{seed:13,criticals:false});
 Object.assign(g.battle.fighters[1].stages,{def:6,spd:6});
 for(let visit=0;visit<2;visit++){
   g=T.turn(g,[{switchTo:1},potion]);const f=g.battle.fighters[0];assert.ok(f.soulState.nyxEntryReduction);
   assert.equal(g.battle.fighters[1].effects.statusBlock.end,g.battle.round);
   if(soul===1735){assert.ok(f.effects['谧夜之幕']);assert.equal(g.battle.fighters[1].effects['攻击先制效果失效'].nyxOwner,0);}
   g=T.turn(g,[{switchTo:0},potion]);if(soul===1735)assert.ok(!g.battle.fighters[1].effects['攻击先制效果失效']);
 }
});
test('倪克斯1735再次入场按当前强化重判首回合，离场清除本次幕的对手先制限制',()=>{const soul=1735;
 const nyx=member(4329);nyx.snapshot.selectedSoulId=soul;
 let g=T.create([[member(3056),nyx],[member(2988)]],[0,0],{seed:13,criticals:false});
 Object.assign(g.battle.fighters[1].stages,{def:6,spd:6});
 for(let visit=0;visit<2;visit++){
   g=T.turn(g,[{switchTo:1},potion]);const f=g.battle.fighters[0];assert.ok(f.soulState.nyxEntryReduction);
   assert.equal(g.battle.fighters[1].effects.statusBlock.end,g.battle.round);
   if(soul===1735){assert.ok(f.effects['谧夜之幕']);assert.equal(g.battle.fighters[1].effects['攻击先制效果失效'].nyxOwner,0);}
   g=T.turn(g,[{switchTo:0},potion]);if(soul===1735)assert.ok(!g.battle.fighters[1].effects['攻击先制效果失效']);
 }
});
test("贝狄薇尔1408主动登场倍率只作用当回合实际使用技能，再入按500边界重选领域",()=>{const [soul,amount]=[1408,5];
 const bed=member(4184);bed.snapshot.selectedSoulId=soul;
 const foe=member(2988);foe.moves[1]=10018;
 let g=T.create([[member(3056),bed],[foe]],[0,0],{seed:13,criticals:false});
 const key='wiki:10018',before=g.battle.fighters[1].pp[key];
 g=T.turn(g,[{switchTo:1},key]);assert.equal(g.battle.fighters[1].pp[key],before-amount);
 assert.ok(g.battle.fighters[0].effects['机械领域']);
 g=T.turn(g,[{switchTo:0},key]);assert.equal(g.battle.fighters[1].pp[key],before-amount-1);
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.battle.fighters[0].effects['机械领域']);
 // Independent low-HP domain boundary begins before its first action.
 g=T.create([[member(3056),bed],[foe]],[0,0],{seed:13,criticals:false});g.battle.fighters[1].hp=500;g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.battle.fighters[0].effects['次元领域']);assert.ok(!g.battle.fighters[0].effects['机械领域']);
});

test("贝狄薇尔1580主动登场倍率只作用当回合实际使用技能，再入按500边界重选领域",()=>{const [soul,amount]=[1580,20];
 const bed=member(4184);bed.snapshot.selectedSoulId=soul;
 const foe=member(2988);foe.moves[1]=10018;
 let g=T.create([[member(3056),bed],[foe]],[0,0],{seed:13,criticals:false});
 const key='wiki:10018',before=g.battle.fighters[1].pp[key];
 g=T.turn(g,[{switchTo:1},key]);assert.equal(g.battle.fighters[1].pp[key],before-amount);
 assert.ok(g.battle.fighters[0].effects['机械领域']);
 g=T.turn(g,[{switchTo:0},key]);assert.equal(g.battle.fighters[1].pp[key],before-amount-1);
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.battle.fighters[0].effects['机械领域']);
 // Independent low-HP domain boundary begins before its first action.
 g=T.create([[member(3056),bed],[foe]],[0,0],{seed:13,criticals:false});g.battle.fighters[1].hp=500;g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.battle.fighters[0].effects['次元领域']);assert.ok(!g.battle.fighters[0].effects['机械领域']);
});

test('鲨鱼辣椒两次返场分别按当下30%分档，已有流血加时并从本回合授同档免弱',()=>{
 const shark=member(4830);
 let g=T.create([[member(3056),shark],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=2700;
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(!g.battle.fighters[0].effects['免弱']);
 g=T.turn(g,[{switchTo:0},potion]);
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(!g.battle.fighters[0].effects['免弱']);
 // Independent high-HP/preexisting-bleed initial entry boundary; no HP is changed on the native low-HP return path.
 g=T.create([[member(3056),shark],[member(3056)]],[0,0],{seed:13,criticals:false});const r=g.battle.round;g.battle.fighters[1].hp=5400;g.battle.fighters[1].ailments['流血']=r+3;
 g=T.turn(g,[{switchTo:1},potion]);
 const immune=g.battle.fighters[0].effects['免弱'];assert.equal(immune.start,r);assert.equal(immune.end,r+1);assert.equal(g.battle.fighters[1].ailments['流血'],r+5);
});
test('帝皇之戎额外星皇仅计存活和授予加护，六个队位不变，无法补位或延续胜负',()=>{
 const group=member(4950);if(!group.moves.includes(38567))group.moves[1]=38567;
 let g=T.create([[group,...[3056,2988,2987,3524,3550].map(member)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.slots[0][5].fighter.hp=1000;g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:38567',potion]);assert.equal(g.phase,'replace');
 assert.equal(g.battle.extraStar2584[0].number,3291);assert.equal(g.slots[0].length,6);assert.ok(g.battle.fighters[0].soulState.group2149.starGift);
 g=T.replace(g,[null,1]);const entrant=4;

 g=T.turn(g,[{switchTo:entrant},potion]);assert.ok(g.battle.fighters[0].soulState.teamStar622);
 const receiver=g.slots[0][5].fighter;
 g=T.turn(g,[{switchTo:5},potion]);assert.ok(g.battle.fighters[0].hp<8300);
 const ctrl=structuredClone(g);ctrl.battle.extraStar2584[0]=null;
 const skill='wiki:31581';assert.ok(receiver.moves.includes(skill));
 const healValue=game=>T.turn(game,[skill,potion]).battle.turns.at(-1).events.find(e=>e.text.includes('己方存活回复')).text;
 assert.match(healValue(g),/回复 700 点/);assert.match(healValue(ctrl),/回复 600 点/);
 // Independent legal previously-summoned star / dead summoner / sole real living teammate boundary. No mid-battle team deaths are fabricated.
 const star=structuredClone(g.battle.extraStar2584[0]),foe=member(2988);foe.build.overrides.atk=9999;foe.build.overrides.spe=9999;g=T.create([[group,member(3056)],[foe]],[1,0],{seed:13,criticals:false});g.slots[0][0].fighter.hp=0;g.battle.fighters[0].hp=1;g.battle.extraStar2584??=[null,null];g.battle.extraStar2584[0]=star;assert.equal(g.slots[0].length,2);assert.deepEqual(T.candidates(g,0,true),[]);
 g.battle.fighters[1].effects['攻击必中']={start:1,end:3};g=T.turn(g,[potion,'wiki:19122']);assert.equal(g.battle.fighters[0].hp,0,JSON.stringify(g.battle.turns.at(-1)));assert.ok(g.battle.damageEvents.some(e=>e.sourceSide===1&&e.targetSide===0&&e.type==='attack'&&e.hpLoss===1));assert.equal(g.phase,'finished');assert.equal(g.battle.winner,1);
});
test('帝皇之戎已经拥有实体星皇时不另计，重复击败也只计一个额外星皇',()=>{
 for(const hasStar of [false,true]){
   const group=member(4950);if(!group.moves.includes(38567))group.moves[1]=38567;
   let g=T.create([[group,member(hasStar?3291:3056)],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
   g.battle.fighters[1].hp=1;g.slots[1][1].fighter.hp=1;for(let i=0;i<2;i++){
     assert.equal(g.battle.fighters[1].hp,1);g=T.turn(g,['wiki:38567',potion]);assert.equal(g.phase,'replace');
     assert.equal(!!g.battle.extraStar2584?.[0],!hasStar);assert.equal(g.slots[0].length,2);
     g=T.replace(g,[null,i+1]);
   }
 }
});
test('赫尔卡长老主动离场按盾罩回复，场下按零PP数逐回合回复，返场重算满PP技能',()=>{
 let g=T.create([[member(4716),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const f=g.battle.fighters[0],keys=f.moves.slice(0,2);for(const key of keys)f.pp[key]=0;
 f.hp=5000;f.suitState.shield=220;f.suitState.barrier=180;
 g=T.turn(g,[{switchTo:1},potion]);const reserve=()=>g.slots[0][0].fighter;
 assert.equal(reserve().hp,5400);assert.deepEqual(keys.map(k=>reserve().pp[k]),[1,1]);
 g=T.turn(g,[potion,potion]);assert.deepEqual(keys.map(k=>reserve().pp[k]),[2,2]);
 g=T.turn(g,[potion,potion]);assert.deepEqual(keys.map(k=>reserve().pp[k]),[2,2]);
 const r=g.battle.round;g=T.turn(g,[{switchTo:0},potion]);
 assert.equal(g.battle.fighters[0].soulState.elder1920.priorityUntil,r+2);
});
test('讨只给实际场下效果提供者连诛，两次授予不叠加；留在场下每次受一笔1/8真伤，换上后禁技能回血',()=>{
 const group=member(4950),king=member(3516);king.snapshot.selectedSoulId=1985;
 const high=member(3056);let g=T.create([[group],[high,king,member(2988)]],[0,0],{seed:13,criticals:false});
 const f=g.battle.fighters[0],hit=f.moves.find(k=>g.battle.moveDefinitions[k].power>0&&k!=='wiki:38568');g.slots[1][1].fighter.soulState.sealLayers=2;
 g=T.turn(g,[hit,potion]);assert.ok(g.battle.fighters[1].soulState.tao2149);
 for(let i=0;i<2;i++){
   const t=g.battle.fighters[1];t.suitState.shield=500;t.hp=8000;
   const before=g.slots[1][1].fighter.hp;
   g=T.turn(g,[hit,potion]);assert.ok(g.slots[1][1].fighter.soulState.lianzhu2149);assert.ok(!g.battle.fighters[1].soulState.lianzhu2149);
   assert.equal(g.slots[1][1].fighter.hp,before-1125);
 }
 g=T.turn(g,[potion,{switchTo:1}]);assert.ok(g.battle.fighters[1].soulState.lianzhu2149);assert.equal(g.slots[1][0].fighter.soulState.tao2149,undefined);
 const before=g.battle.fighters[1].hp;g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[1].hp,before);
});
test("黄金天马956获得圣辉之羽，主动换下即消失且接替者不继承",()=>{const soul=956; const horse=member(3670);horse.snapshot.selectedSoulId=soul;horse.moves=E.WIKI.defaultMoves(horse.snapshot);
 let g=T.create([[horse,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(let tries=0;tries<5&&!g.battle.fighters[0].effects['圣辉之羽'];tries++)g=T.turn(g,[potion,'wiki:24651']);assert.ok(g.battle.fighters[0].effects['圣辉之羽']);
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(!g.slots[0][0].fighter.effects['圣辉之羽']);assert.ok(!g.battle.fighters[0].effects['圣辉之羽']);
 if(soul===1710){
   g=T.turn(g,[{switchTo:0},potion]);assert.ok(g.battle.fighters[0].effects['圣雷华冠']);
   g=T.turn(g,[{switchTo:1},potion]);assert.ok(!g.slots[0][0].fighter.effects['圣雷华冠']);assert.ok(!g.battle.fighters[0].effects['圣雷华冠']);
 }

});
test("黄金天马1710获得圣辉之羽，主动换下即消失且接替者不继承",()=>{const soul=1710; const horse=member(3670);horse.snapshot.selectedSoulId=soul;horse.moves=E.WIKI.defaultMoves(horse.snapshot);
 let g=T.create([[horse,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 for(let tries=0;tries<5&&!g.battle.fighters[0].effects['圣辉之羽'];tries++)g=T.turn(g,[potion,'wiki:24651']);assert.ok(g.battle.fighters[0].effects['圣辉之羽']);
 g=T.turn(g,[{switchTo:1},potion]);assert.ok(!g.slots[0][0].fighter.effects['圣辉之羽']);assert.ok(!g.battle.fighters[0].effects['圣辉之羽']);
 if(soul===1710){
   g=T.turn(g,[{switchTo:0},potion]);assert.ok(g.battle.fighters[0].effects['圣雷华冠']);
   g=T.turn(g,[{switchTo:1},potion]);assert.ok(!g.slots[0][0].fighter.effects['圣雷华冠']);assert.ok(!g.battle.fighters[0].effects['圣雷华冠']);
 }

});
test('3983的29193解除对手异常后实际拦换，窗口过后准许换人',()=>{const [id,skill]=[3983,29193];
 const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
 let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].ailments['流血']=5;g=T.turn(g,['wiki:'+skill,potion]);
 const t=g.battle.fighters[1];assert.ok(!t.ailments['流血']);const end=t.effects['不能主动切换'].end;
 assert.deepEqual(T.candidates(g,1),[]);assert.throws(()=>T.turn(g,[potion,{switchTo:1}]));
 while(g.battle.round<=end)g=T.turn(g,[potion,potion]);g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.active[1],1);
});
test('4444的29346解除对手异常后实际拦换，窗口过后准许换人',()=>{const [id,skill]=[4444,29346];
 const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
 let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].ailments['流血']=5;g=T.turn(g,['wiki:'+skill,potion]);
 const t=g.battle.fighters[1];assert.ok(!t.ailments['流血']);const end=t.effects['不能主动切换'].end;
 assert.deepEqual(T.candidates(g,1),[]);assert.throws(()=>T.turn(g,[potion,{switchTo:1}]));
 while(g.battle.round<=end)g=T.turn(g,[potion,potion]);g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.active[1],1);
});
test('无为孑身诫未出招时耗尽实际技能PP，封对手下一回合主动换人',()=>{
 let g=T.create([[member(4661)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].ailments['睡眠']=1;g.battle.fighters[1].ailments['睡眠']=1;
 g=T.turn(g,['wiki:37458','wiki:19369']);assert.equal(g.battle.fighters[0].pp['wiki:37458'],0);
 assert.deepEqual(T.candidates(g,1),[]);assert.equal(g.battle.fighters[1].effects['不能主动切换'].end,g.battle.round);
 g=T.turn(g,[potion,potion]);g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.active[1],1);
});
test('3983解除自身异常时以使用者900上限回复实际替补，封顶且不复活',()=>{const [id,skill,amount]=[3983,29193,300];
 for(const ailment of [false,true]){
  const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;caster.build.overrides.maxHp=900;
  const reserve=member(2988);reserve.build.overrides.maxHp=1800;
  let g=T.create([[caster,reserve,member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
  g.slots[0][1].fighter.hp=800;g.slots[0][2].fighter.hp=8990;g.slots[0][3].fighter.hp=0;
  if(ailment)g.battle.fighters[0].ailments['流血']=3;
  g=T.turn(g,['wiki:'+skill,potion]);
  assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),ailment?[800+amount,9000,0]:[800,8990,0]);
 }
});
test('4444解除自身异常时以使用者900上限回复实际替补，封顶且不复活',()=>{const [id,skill,amount]=[4444,29346,225];
 for(const ailment of [false,true]){
  const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;caster.build.overrides.maxHp=900;
  const reserve=member(2988);reserve.build.overrides.maxHp=1800;
  let g=T.create([[caster,reserve,member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
  g.slots[0][1].fighter.hp=800;g.slots[0][2].fighter.hp=8990;g.slots[0][3].fighter.hp=0;
  if(ailment)g.battle.fighters[0].ailments['流血']=3;
  g=T.turn(g,['wiki:'+skill,potion]);
  assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),ailment?[800+amount,9000,0]:[800,8990,0]);
 }
});
test('呼唤君名选场下PP损失最大者，同值按原始队位，汲取致死保1',()=>{
 for(const [lostFirst,lostSecond,expected] of [[3,5,2],[5,5,1],[0,0,1]]){
  const owner=member(4785);if(!owner.moves.includes(37985))owner.moves[1]=37985;
  let g=T.create([[owner],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
  for(const [slot,lost] of [[1,lostFirst],[2,lostSecond]]){const f=g.slots[1][slot].fighter;f.pp[f.moves[0]]-=lost;f.hp=100;}
  g.battle.fighters[0].hp=3000;g=T.turn(g,['wiki:37985',potion]);
  assert.equal(g.slots[1][expected].fighter.hp,1);assert.equal(g.slots[1][3-expected].fighter.hp,100);
  const amount=150+Math.max(lostFirst,lostSecond)*20;
  assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('场下汲取')&&e.text.includes('回复 '+amount+' 点')));
 }
});
test('狩杀之的29004按场下克制系数择人，并列按原始位置，排除当前标记',()=>{const [skill,highest]=[29004,true];
 const hunt=member(4745);if(!hunt.moves.includes(skill))hunt.moves[1]=skill;
 let g=T.create([[hunt],[member(3056),member(2988),member(2996),member(3008),member(3322)]],[0,0],{seed:13,criticals:false});
 const actor=g.battle.fighters[0],pool=g.slots[1].slice(1).map(s=>s.fighter);
 const ratio=f=>E.typeEffectiveness(f.type,actor.type,g.battle.typeChart);
 const eligible=pool.slice().sort((a,b)=>(highest?-1:1)*(ratio(a)-ratio(b))||a.teamPosition-b.teamPosition);
 assert.equal(ratio(eligible[0]),ratio(eligible[1]));assert.notEqual(ratio(eligible[0]),ratio(eligible.at(-1)));
 g=T.turn(g,['wiki:'+skill,potion]);const marked=()=>g.slots[1].flatMap((s,i)=>s.fighter.soulState.mark1948?[i]:[]);
 assert.deepEqual(marked(),[eligible[0].teamPosition]);assert.equal(g.slots[1][eligible[0].teamPosition].fighter.stats.maxHp,9000);
 g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(marked(),[eligible[1].teamPosition]);
 g=T.turn(g,[potion,{switchTo:eligible[1].teamPosition}]);assert.ok(g.battle.fighters[1].soulState.mark1948);
});
test('狩杀之的29006按场下克制系数择人，并列按原始位置，排除当前标记',()=>{const [skill,highest]=[29006,false];
 const hunt=member(4745);if(!hunt.moves.includes(skill))hunt.moves[1]=skill;
 let g=T.create([[hunt],[member(3056),member(2988),member(2996),member(3008),member(3322)]],[0,0],{seed:13,criticals:false});
 const actor=g.battle.fighters[0],pool=g.slots[1].slice(1).map(s=>s.fighter);
 const ratio=f=>E.typeEffectiveness(f.type,actor.type,g.battle.typeChart);
 const eligible=pool.slice().sort((a,b)=>(highest?-1:1)*(ratio(a)-ratio(b))||a.teamPosition-b.teamPosition);
 assert.equal(ratio(eligible[0]),ratio(eligible[1]));assert.notEqual(ratio(eligible[0]),ratio(eligible.at(-1)));
 g=T.turn(g,['wiki:'+skill,potion]);const marked=()=>g.slots[1].flatMap((s,i)=>s.fighter.soulState.mark1948?[i]:[]);
 assert.deepEqual(marked(),[eligible[0].teamPosition]);assert.equal(g.slots[1][eligible[0].teamPosition].fighter.stats.maxHp,9000);
 g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(marked(),[eligible[1].teamPosition]);
 g=T.turn(g,[potion,{switchTo:eligible[1].teamPosition}]);assert.ok(g.battle.fighters[1].soulState.mark1948);
});test('阿尔忒弥斯对非标记者用森语百兽谣，附伤按真正场下标记者的当前体力',()=>{
 const hunt=member(4745);hunt.moves=[37864,29004,37863,29006,37860];
 let g=T.create([[hunt],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g.slots[1][1].fighter.hp=800;
 g=T.turn(g,['wiki:29004',potion]);assert.ok(g.slots[1][1].fighter.soulState.mark1948);
 const barrier=g.battle.fighters[1].suitState.barrier;
 g=T.turn(g,['wiki:37863',potion]);assert.equal(g.battle.fighters[1].suitState.barrier,barrier-600);assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('狩杀之的场下体力附伤')));
});
test('击败狩杀之的时阿尔忒弥斯给对方真实后继授标和盾罩，不击败不转移',()=>{
 const hunt=member(4745);if(!hunt.moves.includes(37864))hunt.moves[1]=37864;
 let g=T.create([[hunt],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 const start=g.battle.fighters[1];assert.ok(start.soulState.mark1948);
 start.hp=1;start.suitState.shield=0;start.suitState.barrier=0;
 g=T.turn(g,['wiki:37864',potion]);assert.equal(g.phase,'replace');
 g=T.replace(g,[null,1]);const target=g.battle.fighters[1];
 assert.ok(target.soulState.mark1948);assert.equal(target.stats.maxHp,3600);assert.equal(target.suitState.shield,3600);assert.equal(target.suitState.barrier,3600);
 assert.ok(!g.slots[1][0].fighter.soulState.mark1948);
});
test('克丽娅1362重生成功时保留替补血量，未重生时回复所有存活替补',()=>{const soul=1362;
 const results=new Set();for(let seed=1;seed<=30&&results.size<2;seed++){
   const cleric=member(4135);cleric.snapshot.selectedSoulId=soul;cleric.moves=E.WIKI.defaultMoves(cleric.snapshot);
   let g=T.create([[cleric,member(2988),member(3056),member(2987)],[member(3056)]],[0,0],{seed,criticals:false});
   g.battle.fighters[0].hp=1;g.slots[0][1].fighter.hp=4000;g.slots[0][2].fighter.hp=8990;g.slots[0][3].fighter.hp=0;
   g=T.turn(g,[potion,'wiki:19369']);const died=g.battle.fighters[0].hp<=0;results.add(died);
   assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),died?[soul===1362?4300:9000,9000,0]:[4000,8990,0]);
   if(!died){g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.slots[0][0].fighter.soulState.cleriaRebirthAttempted);}
 }assert.equal(results.size,2);
});
test('克丽娅1787重生成功时保留替补血量，未重生时回复所有存活替补',()=>{const soul=1787;
 const results=new Set();for(let seed=1;seed<=30&&results.size<2;seed++){
   const cleric=member(4135);cleric.snapshot.selectedSoulId=soul;cleric.moves=E.WIKI.defaultMoves(cleric.snapshot);
   let g=T.create([[cleric,member(2988),member(3056),member(2987)],[member(3056)]],[0,0],{seed,criticals:false});
   g.battle.fighters[0].hp=1;g.slots[0][1].fighter.hp=4000;g.slots[0][2].fighter.hp=8990;g.slots[0][3].fighter.hp=0;
   g=T.turn(g,[potion,'wiki:19369']);const died=g.battle.fighters[0].hp<=0;results.add(died);
   assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),died?[soul===1362?4300:9000,9000,0]:[4000,8990,0]);
   if(!died){g=T.turn(g,[{switchTo:1},potion]);assert.ok(g.slots[0][0].fighter.soulState.cleriaRebirthAttempted);}
 }assert.equal(results.size,2);
});test('觉醒圣光格劳瑞真下场清神圣之霆，返场新一层按新对手附裁且旧持有者保留原标记',()=>{
 const glory=member(4004);glory.snapshot.selectedSoulId=2121;glory.moves=E.WIKI.defaultMoves(glory.snapshot);
 let g=T.create([[glory,member(3056)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].soulState.holyThunder,1);assert.equal(g.battle.fighters[1].soulState.holyVerdict,1);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.holyVerdict,1);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.holyThunder,1);
 assert.equal(g.battle.fighters[1].soulState.holyVerdict,1);
});
test('暴乱格劳瑞初登场首攻必暴，再登场首攻50%只判一次，必暴与未暴都保留首次百分比追加',()=>{
 const rerolls=new Set();for(let seed=1;seed<=30&&rerolls.size<2;seed++){
  let g=T.create([[member(3994),member(3056)],[member(2988)]],[0,0],{seed,criticals:false});
  const f=g.battle.fighters[0],hit=f.moves.find(k=>g.battle.moveDefinitions[k].power>0),crit=game=>game.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail.match(/暴击 ([\d.]+)/)?.[1];
  g=T.turn(g,[hit,potion]);assert.ok(Number(crit(g))>1);
  g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);
  g=T.turn(g,[hit,potion]);rerolls.add(Number(crit(g))>1);
  assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('狂怒雷电首次攻击追加')));
 }assert.equal(rerolls.size,2);
});
test('堕魂格特鲁德只在确有阵亡队友且全员阵亡时追加四分一真伤，单宠不触发',()=>{
 const owner=member(4182);
 for(const roster of [[],[true],[false],[true,false]]){
  let g=T.create([[owner,...[3056,2988].slice(0,roster.length).map(member)],[member(3056)]],[0,0],{seed:13,criticals:false});
  for(const [i,dead] of roster.entries())if(dead)g.slots[0][i+1].fighter.hp=0;
  const f=g.battle.fighters[0],hit=f.moves.find(k=>g.battle.moveDefinitions[k].power>0);
  g=T.turn(g,[hit,potion]);const truth=(g.battle.damageEvents??[]).filter(e=>e.type==='true'&&e.sourceSide===0&&e.settledDamage===2250);
  assert.equal(truth.length,roster.length>0&&roster.every(Boolean)?1:0);
 }
});
test('镇世乔特鲁德按真正其他存活成员授入场盾；末员保护跨再次登场保留',()=>{
 const dragon=member(4186);dragon.snapshot.selectedSoulId=1409;dragon.moves=E.WIKI.defaultMoves(dragon.snapshot);
 let g=T.create([[member(3056),dragon,member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].suitState.shield,450);assert.ok(!g.battle.fighters[0].soulState.townLastProtection);
 g=T.turn(g,[{switchTo:0},potion]);g.slots[0][2].fighter.hp=0;g.battle.fighters[0].hp=1;
 g=T.turn(g,[potion,'wiki:19369']);g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].suitState.shield,250);assert.equal(g.battle.fighters[0].soulState.townLastProtection,true);
});
test('混灵莱茵哈特登场按双方阵亡取三层，阵亡后下回合对手不能主动换人',()=>{
 let g=T.create([[member(3056),member(4287),member(2988),member(2987)],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 for(const [side,i] of [[0,2],[0,3],[1,2]])g.slots[side][i].fighter.hp=0;
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].soulState.lastWhisperLayers,3);
 g.battle.fighters[0].hp=1;g=T.turn(g,[potion,'wiki:19369']);g=T.replace(g,[0,null]);
 assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[potion,potion]);assert.deepEqual(T.candidates(g,1),[1]);
});
test('额外两龙参与队伍存亡和龙系计数，玄源之㡣献祭后增加20%上限，当前体力原值',()=>{
 const d=member(4186);d.snapshot.selectedSoulId=2028;d.moves=E.WIKI.defaultMoves(d.snapshot);d.build.overrides.maxHp=1000;d.build.overrides.atk=1;
 let g=T.create([[d,member(3056)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.slots[0].length,2);assert.equal(g.battle.fighters[0].suitState.shield,400);
 const f=g.battle.fighters[0],t=g.battle.fighters[1];f.hp=300;t.hp=190;t.stats.def=4000;
 const hit='wiki:34898';g=T.turn(g,[hit,potion]);assert.equal(g.battle.teamDragons2028[0].dark,false);assert.equal(g.phase,'replace');
 assert.equal(g.battle.fighters[0].stats.maxHp,1200);assert.equal(g.battle.fighters[0].hp,300);
 g=T.replace(g,[null,1]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.stats.maxHp,1000);assert.equal(g.slots[0][0].fighter.hp,300);assert.equal(g.battle.teamDragons2028[0].dark,false);
});
test('金祖之龍在超过登场盾值的致死攻击上牺牲一次，保留20%体力',()=>{
 const d=member(4186);d.snapshot.selectedSoulId=2028;d.moves=E.WIKI.defaultMoves(d.snapshot);d.build.overrides.maxHp=1000;d.build.overrides.def=10;
 const foe=member(3056);foe.moves[1]=10127;foe.build.overrides.atk=3000;
 let g=T.create([[d],[foe]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.battle.teamDragons2028[0].gold,false);assert.equal(g.phase,'action');assert.equal(g.battle.fighters[0].hp,200);assert.equal(g.slots[0].length,1);
});
test('环源阵亡把执行者留在场上，补位者复制免疫，每批结束扣一架，存活只加一只',()=>{
 const ring=member(4258);ring.snapshot.selectedSoulId=2139;ring.moves=E.WIKI.defaultMoves(ring.snapshot);
 const enemy=member(3550);enemy.build.overrides.atk=2000;
 let g=T.create([[ring,member(3056)],[enemy,member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1;const hit=g.battle.fighters[1].moves.find(k=>g.battle.moveDefinitions[k].power>0);
 g=T.turn(g,[potion,hit]);assert.equal(g.phase,'replace');const count=g.battle.fieldExecutors[0].count;assert.ok(count>=2);g=T.replace(g,[1,null]);
 const cap=g.battle.fighters[0].stats.maxHp;
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fieldExecutors[0].count,count-1);
 assert.equal(g.battle.fighters[0].stats.maxHp,cap);assert.equal(g.slots[0].length,2);
 assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('执行者复制免疫')));
});
test('觉醒月冕生成血月，分属两方时高体侧实际收不到场下星皇回复',()=>{
 const moon=member(4147);moon.snapshot.selectedSoulId=2110;moon.moves=E.WIKI.defaultMoves(moon.snapshot);
 let g=T.create([[moon,member(3291)],[member(3056)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.celestials.some(e=>e.name==='血月'));g.battle.fighters[1].hp=3000;
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.celestials.find(e=>e.name==='血月').side,0);
 g.battle.fighters[0].hp=7000;g.battle.fighters[1].hp=3000;
 g=T.turn(g,[potion,potion]);assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
});
test('真实技能29465把敌方血月转至己方后己方场下星皇不能以施法者为目标',()=>{
 const caster=member(3432);if(!caster.moves.includes(29465))caster.moves[1]=29465;
 let g=T.create([[caster,member(3291)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.celestials=[{name:'血月',side:1,start:1,end:10}];g.battle.fighters[0].hp=6000;g.battle.fighters[1].hp=6000;
 g=T.turn(g,['wiki:29465',potion]);
 assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
});
test('莫伊莱观察对手主动换人，当回合恒和界的四种真实效果全部触发',()=>{
 let g=T.create([[member(4275)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=4000;g=T.turn(g,[potion,{switchTo:1}]);const [own,foe]=g.battle.fighters;
 assert.equal(own.soulState.moiraiHeng.branch,3);assert.equal(own.soulState.moiraiJie.branch,3);
 assert.equal(own.suitState.shield,200);assert.equal(own.suitState.barrier,200);assert.equal(own.hp,7000);
 assert.equal(foe.moves.filter(k=>foe.pp[k]===0).length,1);assert.equal(foe.stages.atk,-1);
 assert.equal(foe.effects['命运界固定粉伤易伤'].start,g.battle.round);assert.equal(own.effects.id984.amount,1);
});
test('异维拉伯克在敌主动换入时清该成员一个PP槽，自身随后两次真实攻击必暴',()=>{
 let g=T.create([[member(4289)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[potion,{switchTo:1}]);const own=g.battle.fighters[0],foe=g.battle.fighters[1];
 assert.equal(foe.moves.filter(k=>foe.pp[k]===0).length,1);assert.equal(own.soulState.laberSwitchCrit,2);
 const hit=own.moves.find(k=>g.battle.moveDefinitions[k].power>0);
 for(const n of [1,0]){g=T.turn(g,[hit,potion]);assert.equal(g.battle.fighters[0].soulState.laberSwitchCrit,n);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail,/暴击 (?:1\.5|2)/);}
});
test('卡托娜仅主动换下且护盾严格超过600时，接替者继承正等级',()=>{
 for(const shield of [600,601]){
  let g=T.create([[member(4345),member(2988)],[member(3056)]],[0,0],{seed:13});
  const f=g.battle.fighters[0];f.suitState.shield=shield;Object.assign(f.stages,{def:2,spd:3,atk:-1});
  g=T.turn(g,[{switchTo:1},potion]);const dst=g.battle.fighters[0];assert.equal(dst.stages.def,shield>600?2:0);assert.equal(dst.stages.spd,shield>600?3:0);assert.equal(dst.stages.atk,0);
 }
});
for(const soul of [1559,1851])test('哀·拉伯克'+soul+'对敌主动换入清一个槽并授必暴，阵亡补位仅强化版触发',()=>{
 const owner=member(4333);owner.snapshot.selectedSoulId=soul;owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 let g=T.create([[owner],[member(3056),member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.battle.fighters[0].counts.nextCrit,2);assert.equal(g.battle.fighters[1].moves.filter(k=>g.battle.fighters[1].pp[k]===0).length,1);
 g.battle.fighters[1].hp=1;const hit=g.battle.fighters[0].moves.find(k=>g.battle.moveDefinitions[k].power>0);
 g=T.turn(g,[hit,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,2]);
 assert.equal(g.battle.fighters[1].moves.filter(k=>g.battle.fighters[1].pp[k]===0).length,soul===1851?1:0);
});
test('王左兵右1603当回合已经用招后阵亡，未重生则实际接替者全属性各加一',()=>{
 const king=member(4384);king.snapshot.selectedSoulId=1603;king.moves=E.WIKI.defaultMoves(king.snapshot);Object.assign(king.build.overrides,{spe:9999,maxHp:900,def:1});
 const foe=member(3056);foe.moves[1]=10127;foe.build.overrides.atk=9999;
 let g=T.create([[king,member(2988)],[foe]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].hp=1;
 const f=g.battle.fighters[0],hit=f.moves.find(k=>g.battle.moveDefinitions[k].power>0);g=T.turn(g,[hit,'wiki:10127']);
 assert.equal(g.phase,'replace',JSON.stringify(g.battle.turns.at(-1).events.map(e=>e.text)));g=T.replace(g,[1,null]);assert.deepEqual(Object.values(g.battle.fighters[0].stages),[1,1,1,1,1,1]);
});
test("尤莉米特1588真离场清群芳旧层，新队员首次登场重新授层且旧队员不重授",()=>{const soul=1588;
 const owner=member(4364);owner.snapshot.selectedSoulId=soul;owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 let g=T.create([[member(3056),owner,member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const layers=()=>g.slots[0][1].fighter.soulState.yuliFangLayers;
 assert.equal(layers(),1);g=T.turn(g,[{switchTo:1},potion]);assert.equal(layers(),1);
 g=T.turn(g,[{switchTo:2},potion]);assert.equal(layers(),1);
 g=T.turn(g,[{switchTo:0},potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(layers(),1);
});

test("尤莉米特2080真离场清群芳旧层，新队员首次登场重新授层且旧队员不重授",()=>{const soul=2080;
 const owner=member(4364);owner.snapshot.selectedSoulId=soul;owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 let g=T.create([[member(3056),owner,member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const layers=()=>g.slots[0][1].fighter.soulState.yuliFangLayers;
 assert.equal(layers(),1);g=T.turn(g,[{switchTo:1},potion]);assert.equal(layers(),1);
 g=T.turn(g,[{switchTo:2},potion]);assert.equal(layers(),1);
 g=T.turn(g,[{switchTo:0},potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(layers(),1);
});

test('苏璃面对有核对性别的旧图鉴凡尔斯，返场重获首次用招；失心迷阵随目标换下解除',()=>{
 const fox=member(4372),male=member(2988);assert.equal(male.snapshot.gender.id,1);
 let g=T.create([[fox,member(3056)],[male,member(4361)]],[0,0],{seed:13,criticals:false});
 assert.ok(g.battle.fighters[1].soulState.specialStates['失心迷阵']);
 const f=g.battle.fighters[0],skill=f.moves.find(k=>g.battle.moveDefinitions[k].kind==='status');g=T.turn(g,[skill,potion]);
 assert.ok(g.battle.fighters[0].soulState.foxFirstSkillDone);
 g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.ok(!g.slots[1][0].fighter.soulState.specialStates?.['失心迷阵']);
 g=T.turn(g,[{switchTo:0},potion]);assert.ok(!g.battle.fighters[0].soulState.foxFirstSkillDone);assert.ok(g.battle.fighters[1].soulState.specialStates?.['失心迷阵']);
 g=T.turn(g,[skill,potion]);assert.ok(g.battle.fighters[0].soulState.foxFirstSkillDone);
});
test('原洛基仅在本源盾罩均消失时离场重置，仍有其一时保留三层，额外盾不充当本源盾',()=>{
 const shields=require('../dist/shield-rules.js');
 for(const keepBarrier of [false,true]){
  const loki=member(4361);loki.snapshot.selectedSoulId=1586;loki.moves=E.WIKI.defaultMoves(loki.snapshot);
  let g=T.create([[member(3056),loki],[member(2988)]],[0,0],{seed:13,criticals:false});
  for(let i=0;i<3;i++)g=T.turn(g,['potion:hp','wiki:19123']);
  g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].soulState.lokiEntryLayers,3);
  // Numeric origin-shield component cloned from the genuinely earned three-layer entry. Native no-removal leave is verified separately.
  const nativeExit=T.turn(g,[{switchTo:0},potion]);assert.equal(nativeExit.slots[0][1].fighter.soulState.lokiLayers,3);g=structuredClone(g);const f=g.battle.fighters[0];shields.consume(f);if(!keepBarrier)shields.consumeBarrier(f);shields.add(f,400,'另一来源');
  g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.slots[0][1].fighter.soulState.lokiLayers,keepBarrier?3:0);
 }
});
test('觉醒洛基在场下的真伤达到对手现有体力时直接击败，无空PP槽不吸PP',()=>{
 const loki=member(4361);loki.snapshot.selectedSoulId=2055;loki.moves=E.WIKI.defaultMoves(loki.snapshot);loki.build.overrides.spa=500;
 const foe=member(3056);foe.moves[1]=10127;
 let g=T.create([[member(2988),loki],[foe,member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=100;
 const before=g.battle.fighters[1].pp['wiki:10127'];g=T.turn(g,['potion:hp','wiki:10127']);
 assert.equal(g.phase,'replace');assert.equal(g.battle.fighters[1].hp,0);assert.equal(g.battle.fighters[1].pp['wiki:10127'],before-1);
 assert.ok(g.battle.damageEvents.some(e=>e.type==='true'&&e.targetSide===1&&e.hpLoss===100));
});
test("尤莉米特1588两层群芳给替补每槽2PP，继任者1000记录只打一笔400粉伤",()=>{const soul=1588;
 const yuli=member(4364);yuli.snapshot.selectedSoulId=soul;yuli.moves=E.WIKI.defaultMoves(yuli.snapshot);
 const enemy=member(3056);enemy.moves[1]=10127;
 let g=T.create([[member(3056),yuli,member(2988)],[enemy]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.hp=1;for(const k of g.slots[0][2].fighter.moves)g.slots[0][2].fighter.pp[k]=0;for(const i of [2,1])g=T.turn(g,[{switchTo:i},potion]);
 const y=g.battle.fighters[0];assert.equal(y.soulState.yuliFangLayers,2);
 
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');assert.deepEqual(Object.values(g.slots[0][2].fighter.pp),[2,2,2,2,2]);
 const recorded=g.battle.fighters[0].soulState.yuliLastHitDamage;assert.ok(recorded>0);const expected=Math.floor(recorded*.4);g=T.replace(g,[2,null]);assert.equal(g.battle.fighters[0].soulState.yuliFirstSkillBonus,expected);g=T.turn(g,[potion,potion]);
 assert.equal(g.battle.fighters[0].soulState.yuliFirstSkillBonus,expected);const r=g.battle.round;g=T.turn(g,['wiki:24651',potion]);
 assert.deepEqual(g.battle.damageEvents.filter(e=>e.round===r&&e.type==='percent'&&e.sourceSide===0).map(e=>e.settledDamage),[expected]);assert.ok(!g.battle.fighters[0].soulState.yuliFirstSkillBonus);
 // Independent legal previously-recorded 1000-damage / already-consumed guard boundary, after the true earning/recording/KO path above.
 g=T.create([[yuli,member(2988)],[enemy]],[0,0],{seed:13,criticals:false});Object.assign(g.battle.fighters[0].soulState,{yuliFangLayers:2,yuliActiveKnown:false,yuliLastHitDamage:1000});g.battle.fighters[0].hp=1;for(const k of g.slots[0][1].fighter.moves)g.slots[0][1].fighter.pp[k]=0;g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulState.yuliFirstSkillBonus,400);const boundaryRound=g.battle.round;g=T.turn(g,['wiki:24651',potion]);assert.deepEqual(g.battle.damageEvents.filter(e=>e.round===boundaryRound&&e.type==='percent'&&e.sourceSide===0).map(e=>e.settledDamage),[400]);assert.ok(!g.battle.fighters[0].soulState.yuliFirstSkillBonus);
});

test("尤莉米特2080两层群芳给替补每槽2PP，继任者1000记录只打一笔400粉伤",()=>{const soul=2080;
 const yuli=member(4364);yuli.snapshot.selectedSoulId=soul;yuli.moves=E.WIKI.defaultMoves(yuli.snapshot);
 const enemy=member(3056);enemy.moves[1]=10127;
 let g=T.create([[member(3056),yuli,member(2988)],[enemy]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.hp=1;for(const k of g.slots[0][2].fighter.moves)g.slots[0][2].fighter.pp[k]=0;for(const i of [2,1])g=T.turn(g,[{switchTo:i},potion]);
 const y=g.battle.fighters[0];assert.equal(y.soulState.yuliFangLayers,2);
 
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');assert.deepEqual(Object.values(g.slots[0][2].fighter.pp),[2,2,2,2,2]);
 const recorded=g.battle.fighters[0].soulState.yuliLastHitDamage;assert.ok(recorded>0);const expected=Math.floor(recorded*.4);g=T.replace(g,[2,null]);assert.equal(g.battle.fighters[0].soulState.yuliFirstSkillBonus,expected);g=T.turn(g,[potion,potion]);
 assert.equal(g.battle.fighters[0].soulState.yuliFirstSkillBonus,expected);const r=g.battle.round;g=T.turn(g,['wiki:24651',potion]);
 assert.deepEqual(g.battle.damageEvents.filter(e=>e.round===r&&e.type==='percent'&&e.sourceSide===0).map(e=>e.settledDamage),[expected]);assert.ok(!g.battle.fighters[0].soulState.yuliFirstSkillBonus);
 // Independent legal previously-recorded 1000-damage / already-consumed guard boundary, after the true earning/recording/KO path above.
 g=T.create([[yuli,member(2988)],[enemy]],[0,0],{seed:13,criticals:false});Object.assign(g.battle.fighters[0].soulState,{yuliFangLayers:2,yuliActiveKnown:false,yuliLastHitDamage:1000});g.battle.fighters[0].hp=1;for(const k of g.slots[0][1].fighter.moves)g.slots[0][1].fighter.pp[k]=0;g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].soulState.yuliFirstSkillBonus,400);const boundaryRound=g.battle.round;g=T.turn(g,['wiki:24651',potion]);assert.deepEqual(g.battle.damageEvents.filter(e=>e.round===boundaryRound&&e.type==='percent'&&e.sourceSide===0).map(e=>e.settledDamage),[400]);assert.ok(!g.battle.fighters[0].soulState.yuliFirstSkillBonus);
});

test('教皇404先回再打全队，以结算后损失体力的所有并列众数保留目标',()=>{
 let g=T.create([[member(4898)],[3056,2988,2987,3001,3672].map(member)],[0,0],{seed:13,criticals:false});
 const losses=[1000,1000,2000,2000,3000];
 for(const [i,slot] of g.slots[1].entries()){slot.fighter.hp-=losses[i];Object.assign(slot.fighter.statusState??={},{faithSourceSide:0,faithSourceNumber:4898});}
 g=T.turn(g,['wiki:29339',potion]);const after=g.slots[1].map(s=>s.fighter.hp);
 assert.deepEqual(after,[8000,8000,7000,7000,0]);
 assert.equal(g.battle.damageEvents.filter(e=>e.type==='fixed'&&e.settledDamage===404).length,5);
});
test("38373全队信仰时在技能和命中效果封锁下仍执行本招命中附效，单个有信仰不触发",()=>{
 const [id,match]=[38373,/转移|吸取|削弱/];  for(const all of [false,true]){
   const caster=member(4898);if(!caster.moves.includes(id))caster.moves[1]=id;
   let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
   for(const slot of g.slots[1].slice(0,all?2:1))Object.assign(slot.fighter.statusState??={},{faithSourceSide:0,faithSourceNumber:4898});
   const [a,t]=g.battle.fighters;a.effects.skillBlock={start:1,end:1};a.effects['技能命中效果失效']={start:1,end:1};t.stages.def=1;t.ailments['流血']=2;
   g=T.turn(g,['wiki:'+id,potion]);
   const events=g.battle.turns.at(-1).events.map(e=>e.text).filter(x=>!/(教皇对手本回合|PP 药|到期|流血：损失)/.test(x));
   assert.equal(!!g.battle.fighters[0].soulState.force2474,all);
   const current=g.battle.fighters,damage=g.battle.damageEvents??[];
   if(id===38373){assert.equal(current[0].stages.def,all?1:0);assert.equal(current[1].stages.def,all?0:1);}
   if(id===29339)assert.equal(damage.filter(e=>e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===404).length,all?2:0);
   if(id===29340)assert.equal(current[0].stages.atk,all?1:0);
   if(id===38375)assert.equal(damage.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===3000).length,all?1:0);
   if(all&&id===38374){const foe=g.battle.fighters[1];assert.ok(foe.moves.every(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp-1));}
   else if(all)assert.ok(events.some(x=>match.test(x)),events.join(' / '));
   else assert.ok(events.some(x=>x.includes('技能被封锁')),events.join(' / '));
  }
 });

test("29339全队信仰时在技能和命中效果封锁下仍执行本招命中附效，单个有信仰不触发",()=>{
 const [id,match]=[29339,/免疫反弹|反弹异常|全队固伤/];  for(const all of [false,true]){
   const caster=member(4898);if(!caster.moves.includes(id))caster.moves[1]=id;
   let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
   for(const slot of g.slots[1].slice(0,all?2:1))Object.assign(slot.fighter.statusState??={},{faithSourceSide:0,faithSourceNumber:4898});
   const [a,t]=g.battle.fighters;a.effects.skillBlock={start:1,end:1};a.effects['技能命中效果失效']={start:1,end:1};t.stages.def=1;t.ailments['流血']=2;
   g=T.turn(g,['wiki:'+id,potion]);
   const events=g.battle.turns.at(-1).events.map(e=>e.text).filter(x=>!/(教皇对手本回合|PP 药|到期|流血：损失)/.test(x));
   assert.equal(!!g.battle.fighters[0].soulState.force2474,all);
   const current=g.battle.fighters,damage=g.battle.damageEvents??[];
   if(id===38373){assert.equal(current[0].stages.def,all?1:0);assert.equal(current[1].stages.def,all?0:1);}
   if(id===29339)assert.equal(damage.filter(e=>e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===404).length,all?2:0);
   if(id===29340)assert.equal(current[0].stages.atk,all?1:0);
   if(id===38375)assert.equal(damage.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===3000).length,all?1:0);
   if(all&&id===38374){const foe=g.battle.fighters[1];assert.ok(foe.moves.every(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp-1));}
   else if(all)assert.ok(events.some(x=>match.test(x)),events.join(' / '));
   else assert.ok(events.some(x=>x.includes('技能被封锁')),events.join(' / '));
  }
 });

test("29340全队信仰时在技能和命中效果封锁下仍执行本招命中附效，单个有信仰不触发",()=>{
 const [id,match]=[29340,/攻击等级/];  for(const all of [false,true]){
   const caster=member(4898);if(!caster.moves.includes(id))caster.moves[1]=id;
   let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
   for(const slot of g.slots[1].slice(0,all?2:1))Object.assign(slot.fighter.statusState??={},{faithSourceSide:0,faithSourceNumber:4898});
   const [a,t]=g.battle.fighters;a.effects.skillBlock={start:1,end:1};a.effects['技能命中效果失效']={start:1,end:1};t.stages.def=1;t.ailments['流血']=2;
   g=T.turn(g,['wiki:'+id,potion]);
   const events=g.battle.turns.at(-1).events.map(e=>e.text).filter(x=>!/(教皇对手本回合|PP 药|到期|流血：损失)/.test(x));
   assert.equal(!!g.battle.fighters[0].soulState.force2474,all);
   const current=g.battle.fighters,damage=g.battle.damageEvents??[];
   if(id===38373){assert.equal(current[0].stages.def,all?1:0);assert.equal(current[1].stages.def,all?0:1);}
   if(id===29339)assert.equal(damage.filter(e=>e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===404).length,all?2:0);
   if(id===29340)assert.equal(current[0].stages.atk,all?1:0);
   if(id===38375)assert.equal(damage.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===3000).length,all?1:0);
   if(all&&id===38374){const foe=g.battle.fighters[1];assert.ok(foe.moves.every(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp-1));}
   else if(all)assert.ok(events.some(x=>match.test(x)),events.join(' / '));
   else assert.ok(events.some(x=>x.includes('技能被封锁')),events.join(' / '));
  }
 });

test("38374全队信仰时在技能和命中效果封锁下仍执行本招命中附效，单个有信仰不触发",()=>{
 const [id,match]=[38374,/能力等级|攻击等级|回合效果|吸取/];  for(const all of [false,true]){
   const caster=member(4898);if(!caster.moves.includes(id))caster.moves[1]=id;
   let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
   for(const slot of g.slots[1].slice(0,all?2:1))Object.assign(slot.fighter.statusState??={},{faithSourceSide:0,faithSourceNumber:4898});
   const [a,t]=g.battle.fighters;a.effects.skillBlock={start:1,end:1};a.effects['技能命中效果失效']={start:1,end:1};t.stages.def=1;t.ailments['流血']=2;
   g=T.turn(g,['wiki:'+id,potion]);
   const events=g.battle.turns.at(-1).events.map(e=>e.text).filter(x=>!/(教皇对手本回合|PP 药|到期|流血：损失)/.test(x));
   assert.equal(!!g.battle.fighters[0].soulState.force2474,all);
   const current=g.battle.fighters,damage=g.battle.damageEvents??[];
   if(id===38373){assert.equal(current[0].stages.def,all?1:0);assert.equal(current[1].stages.def,all?0:1);}
   if(id===29339)assert.equal(damage.filter(e=>e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===404).length,all?2:0);
   if(id===29340)assert.equal(current[0].stages.atk,all?1:0);
   if(id===38375)assert.equal(damage.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===3000).length,all?1:0);
   if(all&&id===38374){const foe=g.battle.fighters[1];assert.ok(foe.moves.every(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp-1));}
   else if(all)assert.ok(events.some(x=>match.test(x)),events.join(' / '));
   else assert.ok(events.some(x=>x.includes('技能被封锁')),events.join(' / '));
  }
 });

test("38375全队信仰时在技能和命中效果封锁下仍执行本招命中附效，单个有信仰不触发",()=>{
 const [id,match]=[38375,/吸取|恢复|回复/];  for(const all of [false,true]){
   const caster=member(4898);if(!caster.moves.includes(id))caster.moves[1]=id;
   let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
   for(const slot of g.slots[1].slice(0,all?2:1))Object.assign(slot.fighter.statusState??={},{faithSourceSide:0,faithSourceNumber:4898});
   const [a,t]=g.battle.fighters;a.effects.skillBlock={start:1,end:1};a.effects['技能命中效果失效']={start:1,end:1};t.stages.def=1;t.ailments['流血']=2;
   g=T.turn(g,['wiki:'+id,potion]);
   const events=g.battle.turns.at(-1).events.map(e=>e.text).filter(x=>!/(教皇对手本回合|PP 药|到期|流血：损失)/.test(x));
   assert.equal(!!g.battle.fighters[0].soulState.force2474,all);
   const current=g.battle.fighters,damage=g.battle.damageEvents??[];
   if(id===38373){assert.equal(current[0].stages.def,all?1:0);assert.equal(current[1].stages.def,all?0:1);}
   if(id===29339)assert.equal(damage.filter(e=>e.type==='fixed'&&e.sourceSide===0&&e.settledDamage===404).length,all?2:0);
   if(id===29340)assert.equal(current[0].stages.atk,all?1:0);
   if(id===38375)assert.equal(damage.filter(e=>e.type==='percent'&&e.sourceSide===0&&e.settledDamage===3000).length,all?1:0);
   if(all&&id===38374){const foe=g.battle.fighters[1];assert.ok(foe.moves.every(k=>foe.pp[k]===g.battle.moveDefinitions[k].pp-1));}
   else if(all)assert.ok(events.some(x=>match.test(x)),events.join(' / '));
   else assert.ok(events.some(x=>x.includes('技能被封锁')),events.join(' / '));
  }
 });
for(const [id,skill,status] of [[4364,35847,'束缚'],[4605,37135,'束缚'],[4898,29339,'狂信']])test(id+'技能'+skill+'首次异常成功才使对手真实主动换入者获得'+status,()=>{
 for(const immune of [false,true]){
  const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
  let g=T.create([[caster,member(2988)],[member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
  if(immune)g.battle.fighters[1].effects['免异常']={start:1,end:1};
  g.battle.fighters[0].effects['攻击必中']={start:1,end:1};
  g=T.turn(g,['wiki:'+skill,potion]);
  assert.equal(Object.values(g.battle.teamSwitchWindows?.[1]??{}).some(w=>w.effectId===1562),!immune,JSON.stringify(g.battle.turns.at(-1).events.map(e=>e.text)));
  g=T.turn(g,[{switchTo:1},{switchTo:1}]);assert.equal(!!g.battle.fighters[1].ailments[status],!immune);
  if(id===4898&&!immune)assert.equal(Number(g.battle.fighters[1].statusState.faithSourceNumber),4898);
 }
});
test('赵云换下龙胆每轮减一，返场按余数退出满层并重获首轮免异常',()=>{
 let g=T.create([[member(4421),member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].soulState.dragonGall=7;g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.dragonGall,6);
 g=T.turn(g,[potion,potion]);assert.equal(g.slots[0][0].fighter.soulState.dragonGall,5);
 const r=g.battle.round;g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.dragonGall,5);assert.equal(E.SOULS.trait(g.battle.fighters[0],'entryAilmentRounds'),r);
});
for(const [skill,kind] of [[19367,'special'],[24780,'status']])test('逐界苍星星别解放真实'+kind+'招式，按主动或死亡下场给正确成员回复',()=>{
 for(const forced of [false,true]){
  const foe=member(3056);foe.moves[1]=10127;foe.build.overrides.atk=9999;
  let g=T.create([[member(4450),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
  g=T.turn(g,[potion,'wiki:'+skill]);const owner=g.battle.fighters[0],reserve=g.slots[0][1].fighter;
  assert.ok(g.battle.fighters[1].soulState.parsedSkills['wiki:'+skill]);assert.equal(owner.soulState.futureSingularity,1);
  owner.hp=forced?1:4000;reserve.hp=5000;for(const key of owner.moves)owner.pp[key]=1;for(const key of reserve.moves)reserve.pp[key]=1;
  if(forced){g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);}
  else g=T.turn(g,[{switchTo:1},potion]);
  assert.ok(!g.battle.fighters[1].soulState.parsedSkills?.['wiki:'+skill]);
  const affected=forced?g.battle.fighters[0]:g.slots[0][0].fighter;
  if(kind==='special')assert.equal(affected.hp,forced?9000:7000);
  else for(const key of affected.moves)assert.equal(affected.pp[key],forced?affected.teamPPDefinitions[key].pp:2);
 }
});
test('龙械图腾霸之庇护真实禁换一回合，召唤者换下后两回合为队友各授300盾',()=>{
 let g=T.create([[member(4288),member(2988)],[member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 const f=g.battle.fighters[0],key=f.moves.find(k=>!g.battle.moveDefinitions[k].fifth);f.pp[key]=0;
 g=T.turn(g,['potion:hp',potion]);assert.ok(g.battle.fighters[0].soulState.dragonTotem.blessings.dominion);assert.deepEqual(T.candidates(g,1),[]);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].suitState.shield,300);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].suitState.shield,300);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].suitState.shield,300);
});
test("4725己方必暴随换人传剩余次数，只消耗接替者实际攻击",()=>{
 const [id,skill,n]=[4725,37790,2]; const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
 let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].counts.nextCrit,n);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].counts.nextCrit,n);
 g=T.turn(g,['wiki:19369',potion]);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail,/暴击 (?:1\.5|2)/);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].counts.nextCrit??0,n-1);
});

test("4732己方必暴随换人传剩余次数，只消耗接替者实际攻击",()=>{
 const [id,skill,n]=[4732,37812,1]; const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
 let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].counts.nextCrit,n);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].counts.nextCrit,n);
 g=T.turn(g,['wiki:19369',potion]);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail,/暴击 (?:1\.5|2)/);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].counts.nextCrit??0,n-1);
});

test("4748己方必暴随换人传剩余次数，只消耗接替者实际攻击",()=>{
 const [id,skill,n]=[4748,37879,2]; const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
 let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].counts.nextCrit,n);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].counts.nextCrit,n);
 g=T.turn(g,['wiki:19369',potion]);assert.match(g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0)?.detail,/暴击 (?:1\.5|2)/);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].counts.nextCrit??0,n-1);
});
test("4712献祭后派出的实际成员获两回合增伤且对手第一次攻击无效",()=>{
 const [id,skill,pct]=[4712,37741,50]; const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
 let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],buff=f.effects['献祭攻击增伤'];assert.equal(buff.bonus,pct/100);assert.equal(buff.end,g.battle.round+1);const r=g.battle.round;
 g=T.turn(g,['wiki:19369','wiki:19123']);assert.ok(!g.battle.damageEvents.some(e=>e.round===r&&e.type==='attack'&&e.sourceSide===1));
 g=T.turn(g,[potion,'wiki:19123']);assert.ok(g.battle.damageEvents.some(e=>e.round===r+1&&e.type==='attack'&&e.sourceSide===1));
});

test("4717献祭后派出的实际成员获两回合增伤且对手第一次攻击无效",()=>{
 const [id,skill,pct]=[4717,37750,100]; const giver=member(id);if(!giver.moves.includes(skill))giver.moves[1]=skill;
 let g=T.create([[giver,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],buff=f.effects['献祭攻击增伤'];assert.equal(buff.bonus,pct/100);assert.equal(buff.end,g.battle.round+1);const r=g.battle.round;
 g=T.turn(g,['wiki:19369','wiki:19123']);assert.ok(!g.battle.damageEvents.some(e=>e.round===r&&e.type==='attack'&&e.sourceSide===1));
 g=T.turn(g,[potion,'wiki:19123']);assert.ok(g.battle.damageEvents.some(e=>e.round===r+1&&e.type==='attack'&&e.sourceSide===1));
});
test("4510献祭技能28318按本次实际清回合和消强分别恢复继任者HP与PP",()=>{const id=4510,skill=28318;for(const [timed,boost] of [[false,true],[true,false],[true,true],[false,false]]){
  const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
  let g=T.create([[caster,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
  const bench=g.slots[0][1].fighter,foe=g.battle.fighters[1];bench.hp=5000;for(const k of bench.moves)bench.pp[k]=0;
  if(timed)foe.effects['必定暴击']={start:1,end:4};if(boost)foe.stages.def=2;
  g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
  const before=g.slots[0][1].fighter.hp;g=T.replace(g,[1,null]);const f=g.battle.fighters[0];
  assert.equal(f.hp,timed?9000:before);for(const k of f.moves)assert.equal(f.pp[k],boost?f.teamPPDefinitions[k].pp:0);
 }

});
test("4713献祭技能37755按本次实际清回合和消强分别恢复继任者HP与PP",()=>{const id=4713,skill=37755;for(const [timed,boost] of [[false,true],[true,false],[true,true],[false,false]]){
  const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
  let g=T.create([[caster,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
  const bench=g.slots[0][1].fighter,foe=g.battle.fighters[1];bench.hp=5000;for(const k of bench.moves)bench.pp[k]=0;
  if(timed)foe.effects['必定暴击']={start:1,end:4};if(boost)foe.stages.def=2;
  g=T.turn(g,['wiki:'+skill,potion]);assert.equal(g.phase,'replace');
  const before=g.slots[0][1].fighter.hp;g=T.replace(g,[1,null]);const f=g.battle.fighters[0];
  assert.equal(f.hp,timed?9000:before);for(const k of f.moves)assert.equal(f.pp[k],boost?f.teamPPDefinitions[k].pp:0);
 }

});

test("4184技能20264献祭授予实际接替者3056",()=>{const id=4184,move=20264,heir=3056; const caster=member(id);if(!caster.moves.includes(move))caster.moves[1]=move;
 let g=T.create([[caster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 if(id===3699)g.battle.fighters[1].effects['闪避']={start:1,end:1,chance:100};
 g=T.turn(g,['wiki:'+move,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],round=g.battle.round;
 if(id===4184)assert.deepEqual(f.stages,{atk:0,def:1,spa:1,spd:0,spe:0,acc:0});
 if(id===3932)assert.equal(f.effects['免异常'].end-round+1,heir===3866?5:3);
 if(id===3699){
   assert.equal(f.effects['冰之祝福'].end-round+1,3);
   g=T.turn(g,['wiki:19369',potion]);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.type==='fixed'&&e.sourceSide===0));
 }

if(id===3699){const hitCaster=member(id);if(!hitCaster.moves.includes(move))hitCaster.moves[1]=move;let hit=T.create([[hitCaster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});hit.battle.fighters[0].effects.攻击必中={start:1,end:1};hit=T.turn(hit,['wiki:'+move,potion]);assert.ok(hit.battle.fighters[0].hp>0);assert.deepEqual(hit.pending,[1]);hit=T.replace(hit,[null,1]);hit=T.turn(hit,[{switchTo:1},potion]);assert.equal(hit.battle.fighters[0].effects['冰之祝福'],undefined);}
});
test("3932技能33652献祭授予实际接替者3056",()=>{const id=3932,move=33652,heir=3056; const caster=member(id);if(!caster.moves.includes(move))caster.moves[1]=move;
 let g=T.create([[caster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 if(id===3699)g.battle.fighters[1].effects['闪避']={start:1,end:1,chance:100};
 g=T.turn(g,['wiki:'+move,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],round=g.battle.round;
 if(id===4184)assert.deepEqual(f.stages,{atk:0,def:1,spa:1,spd:0,spe:0,acc:0});
 if(id===3932)assert.equal(f.effects['免异常'].end-round+1,heir===3866?5:3);
 if(id===3699){
   assert.equal(f.effects['冰之祝福'].end-round+1,3);
   g=T.turn(g,['wiki:19369',potion]);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.type==='fixed'&&e.sourceSide===0));
 }

if(id===3699){const hitCaster=member(id);if(!hitCaster.moves.includes(move))hitCaster.moves[1]=move;let hit=T.create([[hitCaster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});hit.battle.fighters[0].effects.攻击必中={start:1,end:1};hit=T.turn(hit,['wiki:'+move,potion]);assert.ok(hit.battle.fighters[0].hp>0);assert.deepEqual(hit.pending,[1]);hit=T.replace(hit,[null,1]);hit=T.turn(hit,[{switchTo:1},potion]);assert.equal(hit.battle.fighters[0].effects['冰之祝福'],undefined);}
});
test("3932技能33652献祭授予实际接替者3866",()=>{const id=3932,move=33652,heir=3866; const caster=member(id);if(!caster.moves.includes(move))caster.moves[1]=move;
 let g=T.create([[caster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 if(id===3699)g.battle.fighters[1].effects['闪避']={start:1,end:1,chance:100};
 g=T.turn(g,['wiki:'+move,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],round=g.battle.round;
 if(id===4184)assert.deepEqual(f.stages,{atk:0,def:1,spa:1,spd:0,spe:0,acc:0});
 if(id===3932)assert.equal(f.effects['免异常'].end-round+1,heir===3866?5:3);
 if(id===3699){
   assert.equal(f.effects['冰之祝福'].end-round+1,3);
   g=T.turn(g,['wiki:19369',potion]);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.type==='fixed'&&e.sourceSide===0));
 }

if(id===3699){const hitCaster=member(id);if(!hitCaster.moves.includes(move))hitCaster.moves[1]=move;let hit=T.create([[hitCaster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});hit.battle.fighters[0].effects.攻击必中={start:1,end:1};hit=T.turn(hit,['wiki:'+move,potion]);assert.ok(hit.battle.fighters[0].hp>0);assert.deepEqual(hit.pending,[1]);hit=T.replace(hit,[null,1]);hit=T.turn(hit,[{switchTo:1},potion]);assert.equal(hit.battle.fighters[0].effects['冰之祝福'],undefined);}
});
test("3699技能32450献祭授予实际接替者3056",()=>{const id=3699,move=32450,heir=3056; const caster=member(id);if(!caster.moves.includes(move))caster.moves[1]=move;
 let g=T.create([[caster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});
 if(id===3699)g.battle.fighters[1].effects['闪避']={start:1,end:1,chance:100};
 g=T.turn(g,['wiki:'+move,potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 const f=g.battle.fighters[0],round=g.battle.round;
 if(id===4184)assert.deepEqual(f.stages,{atk:0,def:1,spa:1,spd:0,spe:0,acc:0});
 if(id===3932)assert.equal(f.effects['免异常'].end-round+1,heir===3866?5:3);
 if(id===3699){
   assert.equal(f.effects['冰之祝福'].end-round+1,3);
   g=T.turn(g,['wiki:19369',potion]);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.type==='fixed'&&e.sourceSide===0));
 }

if(id===3699){const hitCaster=member(id);if(!hitCaster.moves.includes(move))hitCaster.moves[1]=move;let hit=T.create([[hitCaster,member(heir)],[member(2988),member(2987)]],[0,0],{seed:13,criticals:false});hit.battle.fighters[0].effects.攻击必中={start:1,end:1};hit=T.turn(hit,['wiki:'+move,potion]);assert.ok(hit.battle.fighters[0].hp>0);assert.deepEqual(hit.pending,[1]);hit=T.replace(hit,[null,1]);hit=T.turn(hit,[{switchTo:1},potion]);assert.equal(hit.battle.fighters[0].effects['冰之祝福'],undefined);}
});
test('洪荒列奥尼达异常时只回复最近真正离场的存活精灵',()=>{
 const caster=member(4125);caster.moves[1]=29253;
 let g=T.create([[member(2987),caster,member(3056)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=3000;g.slots[0][2].fighter.hp=4000;g.slots[0][1].fighter.ailments['流血']=3;
 g=T.turn(g,[{switchTo:2},potion]);g=T.turn(g,[{switchTo:1},potion]);
 const a=g.slots[0][0].fighter.hp,b=g.slots[0][2].fighter.hp;
 g=T.turn(g,['wiki:29253',potion]);assert.equal(g.slots[0][0].fighter.hp,a);assert.equal(g.slots[0][2].fighter.hp,b+3000);
});
test('鬼面阎罗技能37419只在实际击败时给对方选择的接替者一层致命裂痕',()=>{
 const caster=member(4238);caster.snapshot=E.WIKI.versionSnapshots(caster.snapshot).find(v=>E.WIKI.defaultMoves(v).includes(37419));caster.moves=E.WIKI.defaultMoves(caster.snapshot);
 for(const kill of [false,true]){
 let g=T.create([[caster],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 if(kill)g.battle.fighters[1].hp=1;
 g.battle.fighters[0].effects['攻击必中']={start:1,end:1};g=T.turn(g,['wiki:37419',potion]);
 if(kill){assert.equal(g.phase,'replace');g=T.replace(g,[null,2]);}
 else g=T.turn(g,[potion,{switchTo:2}]);
 assert.equal(g.battle.fighters[1].soulState.fatalCracks??0,Number(kill));assert.equal(g.slots[1][1].fighter.soulState.fatalCracks??0,0);
 }
});
test('混灵莱茵哈特王万象还虚按亡语层数吸取接替者，敌队换人仍消耗下一次攻击无效',()=>{
 const caster=member(4287);caster.snapshot=E.WIKI.versionSnapshots(caster.snapshot).find(v=>E.WIKI.defaultMoves(v).includes(37274));caster.moves=E.WIKI.defaultMoves(caster.snapshot);
 let g=T.create([[member(2987),caster,member(2988)],[member(2988),member(2987),member(3056)]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=0;g.slots[0][1].fighter.hp=4000;g.battle.fighters[1].hp=1;g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].soulState.lastWhisperLayers,1);
 g=T.turn(g,['wiki:37274',potion]);assert.equal(g.phase,'replace');const hp=g.battle.fighters[0].hp;
 assert.equal(g.battle.fighters[0].counts.opponentAttackInvalid1128,1);
 g=T.replace(g,[null,1]);assert.equal(g.battle.fighters[1].hp,8100);assert.equal(g.battle.fighters[0].hp,hp+900);
 g=T.turn(g,[potion,{switchTo:2}]);const round=g.battle.round;
 g=T.turn(g,[potion,'wiki:19369']);assert.equal(g.battle.fighters[0].counts.opponentAttackInvalid1128,0);
 assert.ok(!g.battle.damageEvents.some(e=>e.round===round&&e.sourceSide===1&&e.type==='attack'));
});
test('圣光莫妮卡王圣语空心连续两次造成攻击伤害使实际接替者各技能恢复2PP',()=>{
 let g=T.create([[member(3711),member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 const bench=g.slots[0][1].fighter;for(const key of bench.moves)bench.pp[key]=0;
 for(let n=0;n<2;n++)g=T.turn(g,['wiki:38319',potion]);
 g=T.turn(g,[{switchTo:1},potion]);const f=g.battle.fighters[0];for(const key of f.moves)assert.equal(f.pp[key],2);
 g=T.turn(g,[{switchTo:2},potion]);assert.equal(g.battle.teamEntryGrants[0].length,0);
});
test('龙械图腾贤与威在召唤者下场后分别给接替者回复和护罩，两回合期满',()=>{
 let g=T.create([[member(4288),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 const owner=g.battle.fighters[0];owner.ailments['害怕']=3;owner.stages.def=-1;g.slots[0][1].fighter.hp=4000;
 g=T.turn(g,[potion,potion]);assert.deepEqual(g.battle.fighters[0].soulState.dragonTotem.recordedControls,['害怕']);
 assert.ok(g.battle.fighters[0].soulState.dragonTotem.blessings.might);
 g=T.turn(g,[{switchTo:1},potion]);
 assert.equal(g.battle.fighters[0].hp,4300);assert.equal(g.battle.fighters[0].suitState.barrier,300);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].hp,4600);assert.equal(g.battle.fighters[0].suitState.barrier,300);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].hp,4600);assert.equal(g.battle.fighters[0].suitState.barrier,300);
});
test('觉醒圣光莫妮卡登场对照上只实际队友的零PP槽逐位交换，同次只授一道琼华之庇',()=>{
 let g=T.create([[member(3056),member(3711),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 let f=g.battle.fighters[0];for(const i of [1,3])f.pp[f.moves[i]]=0;
 const untouched=f.moves[2];f.pp[untouched]=2;const other=g.slots[0][2].fighter;other.pp[other.moves[1]]=0;
 g=T.turn(g,[{switchTo:1},potion]);const prev=g.slots[0][0].fighter;f=g.battle.fighters[0];
 assert.equal(prev.soulState.qionghua,1);assert.equal(prev.pp[untouched],2);
 for(const i of [1,3]){assert.equal(f.pp[f.moves[i]],0);assert.equal(prev.pp[prev.moves[i]],prev.teamPPDefinitions[prev.moves[i]].pp);}
 assert.equal(g.slots[0][2].fighter.pp[other.moves[1]],0);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.qionghua,1);
});
test('繁嚣此寂按场下2与3道庇将1道律补至5，下场清律且返场不保旧满层回末为3',()=>{
 const caster=member(3711);caster.moves[1]=29299;
 let g=T.create([[caster,member(3056),member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].soulState.ningjie=1;g.slots[0][1].fighter.soulState.qionghua=2;g.slots[0][2].fighter.soulState.qionghua=3;
 g=T.turn(g,['wiki:29299',potion]);assert.equal(g.battle.fighters[0].soulState.ningjie,5);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.ningjie,undefined);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.ningjie,3);
});
test('圣光莫妮卡击败对手后，实际接替者及再次中切者在剩余宁界之律回合内不能造成伤害',()=>{
 let g=T.create([[member(3711)],[member(2988),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=1;g.battle.fighters[0].soulState.ningjie=5;
 g=T.turn(g,['wiki:38319',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,2]);
 const until=g.battle.teamOutputBlock2426[1];assert.equal(until,g.battle.round+4);
 g=T.turn(g,[potion,{switchTo:1}]);const start=g.battle.round;
 while(g.battle.round<=until)g=T.turn(g,[potion,'wiki:19369']);
 assert.ok(!(g.battle.damageEvents??[]).some(e=>e.round>=start&&e.sourceSide===1&&e.settledDamage>0));
 g=T.turn(g,[potion,'wiki:19369']);assert.ok(g.battle.damageEvents.some(e=>e.round===until+1&&e.sourceSide===1&&e.type==='attack'&&e.settledDamage>0));
});
test('薇尔诗把入场所免的束缚学给全队，场下星皇在薇尔诗存活时无法指定在场者',()=>{
 const foe=member(4995);foe.moves[1]=38549;
 let g=T.create([[member(4000),member(3291),member(3056)],[foe]],[0,0],{seed:13,criticals:false});
 assert.equal(g.battle.fighters[0].counts.immune,1);assert.equal(g.battle.fighters[1].counts.immune,1);
 g.battle.fighters[0].hp=6500;g=T.turn(g,[potion,'wiki:38549']);
 assert.ok(!g.battle.turns.at(-1).events.some(e=>e.text.includes('星皇之赐：回复')));
 assert.ok(g.battle.fighters[0].soulState.verse2098.entryImmuneHistory.includes('束缚'));
 g.battle.fighters[0].ailments['束缚']=g.battle.round+2;
 g=T.turn(g,['wiki:29371',potion]);assert.ok(g.slots[0][2].fighter.soulState.permanentAilments2497.includes('束缚'));
 g=T.turn(g,[{switchTo:2},'wiki:38549']);assert.equal(g.battle.fighters[0].ailments['束缚'],undefined);
});
test('薇尔诗阵亡只有存活队友获得黄金万象，实际补位时清除对手强化并消耗',()=>{
 const foe=member(3056);foe.moves[1]=10127;
 let g=T.create([[member(4000),member(2987),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 g.slots[0][2].fighter.hp=0;g.battle.fighters[0].hp=1;g.battle.fighters[1].stages.atk=2;
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');
 assert.equal(g.slots[0][1].fighter.soulState.verse2098.golden,true);assert.ok(!g.slots[0][2].fighter.soulState.verse2098?.golden);
 g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[1].stages.atk,0);assert.equal(g.battle.fighters[0].soulState.verse2098.golden,false);assert.equal(g.battle.fighters[0].effects['免异常'].end,g.battle.round);
});
test('薇尔诗在原始二号位，邻位存活才在受击后回复并结算26%溢出真伤，邻位阵亡得到免弱',()=>{
 const foe=member(3056);foe.moves[1]=10127;
 for(const living of [true,false]){
 let g=T.create([[member(2987),member(4000),member(2988)],[foe]],[1,0],{seed:13,criticals:false});
 if(!living)for(const i of [0,2])g.slots[0][i].fighter.hp=0;
 g=T.turn(g,[potion,'wiki:10127']);const f=g.battle.fighters[0];
 const attacks=g.battle.damageEvents.filter(e=>e.sourceSide===1&&e.type==='attack');assert.equal(attacks.length,1);
 const overflow=g.battle.damageEvents.filter(e=>e.sourceSide===0&&e.type==='true');
 if(living){assert.equal(f.hp,9000);assert.equal(overflow.length,1);assert.equal(overflow[0].settledDamage,Math.floor((3000-attacks[0].hpLoss)*.26));}
 else{assert.ok(f.hp<9000);assert.equal(overflow.length,0);assert.equal(f.soulState.verse2098.weaknessImmune,true);assert.equal(f.soulState.verse2098.fixedImmune,true);assert.equal(f.soulState.verse2098.percentImmune,true);}
 }
});
test('五道宁界之律仅在持有者在场时保护场下成员，下场清律后纵横三千界正常扣100',()=>{
 const caster=member(3550);if(!caster.moves.includes(31582))caster.moves[1]=31582;caster.build.overrides.spa=caster.build.overrides.atk=40;
 for(const layers of [4,5])for(const leave of [false,true]){
 let g=T.create([[caster],[member(3711),member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].soulState.ningjie=layers;if(leave){g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.ningjie,undefined);}
 const before=g.slots[1][2].fighter.hp;g=T.turn(g,['wiki:31582',potion]);
 const protectedNow=!leave&&layers===5;
 assert.equal(g.slots[1][2].fighter.hp,before-(protectedNow?0:100));
 assert.equal(g.battle.turns.at(-1).events.some(e=>e.text.includes('纵横三千界')&&e.text.includes('扣除 100')),!protectedNow);
 }
});
test('琼华之庇实际遭子时将至清PP时逐槽保留两点，清除方到下回合结束先制失效',()=>{
 const foe=member(3932);if(!foe.moves.includes(33652))foe.moves[1]=33652;
 let g=T.create([[member(3056),member(3711)],[foe,member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].soulState.qionghua=2;
 g=T.turn(g,[potion,'wiki:33652']);assert.equal(g.phase,'replace');const f=g.battle.fighters[0];assert.equal(f.moves.filter(k=>f.pp[k]===2).length,2);
 assert.equal(g.battle.fighters[1].effects['先制效果失效'].end,2);
});
test('混沌魔尊再次登场只对当前未受控制的对手封下一次属性技能',()=>{
 for(const controlled of [false,true]){
 let g=T.create([[member(3683),member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[potion,potion]);g=T.turn(g,[{switchTo:1},potion]);
 if(controlled)g.battle.fighters[1].ailments['害怕']=g.battle.round+1;
 const old=g.battle.fighters[1].counts.nextStatusInvalid??0;
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[1].counts.nextStatusInvalid??0,old+Number(!controlled));
 }
});
test('辛的无尽八荒和无视状态在换下后均清理，再次用招从第一段重新开始',()=>{
 const owner=member(3964);owner.snapshot=E.WIKI.versionSnapshots(owner.snapshot).find(v=>E.WIKI.defaultMoves(v).includes(37334));owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 const target=member(2988);Object.assign(target.build.overrides,{def:9999,spd:9999});let g=T.create([[owner,member(2987)],[target,member(3056)]],[0,0],{seed:13,criticals:false});
 for(let i=0;i<2;i++){g=T.turn(g,['wiki:37334',potion]);}
 assert.ok(g.battle.fighters[0].soulState.wildIgnore);g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},potion]);
 const st=g.battle.fighters[0].soulState;assert.ok(!st.wildPermanent&&!st.wildIgnore);
 g=T.turn(g,['wiki:37334',potion]);assert.ok(g.battle.fighters[0].soulState.wildPermanent);assert.ok(!g.battle.fighters[0].soulState.wildIgnore);
});
test('环源的低体持续必暴在换下和重新登场时消失',()=>{
 const owner=member(4258);owner.moves[1]=35191;
 let g=T.create([[owner,member(2987)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].hp=1000;g=T.turn(g,['wiki:35191',potion]);assert.ok(g.battle.fighters[0].effects['低体持续必暴'].untilSwitch);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.effects['低体持续必暴'],undefined);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].effects['低体持续必暴'],undefined);
});
test('苍茫树海跟随己方场地，玛洛迪斯在替补时承担威力真伤并回复PP，返场不重复加上限',()=>{
 const caster=member(3739);caster.moves[1]=29211;caster.build.overrides.maxHp=1000;
 const foe=member(3056);foe.moves[1]=10127;foe.build.overrides.atk=1200;
 let g=T.create([[caster,member(2987)],[foe]],[0,0],{seed:13,criticals:false});
 let f=g.battle.fighters[0];assert.equal(f.stats.maxHp,1210);const key=f.moves[2];f.pp[key]=0;
 g=T.turn(g,[{switchTo:1},'wiki:10127']);f=g.slots[0][0].fighter;
 assert.equal(f.stats.maxHp,1210);assert.equal(f.hp,1170);assert.equal(f.pp[key],2);assert.equal(f.soulState.forest.life,210);
 assert.ok(g.battle.fighters[1].stages.spd<0);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].stats.maxHp,1210);
 for(let n=0;g.battle.fighters[0].hp>1000&&n<20;n++)g=T.turn(g,[potion,'wiki:10127']);assert.ok(g.battle.fighters[0].hp>0&&g.battle.fighters[0].hp<=1000,JSON.stringify({hp:g.battle.fighters.map(f=>f.hp),turn:g.battle.turns.at(-1)}));g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.stats.maxHp,1000);assert.equal(g.slots[0][0].fighter.soulState.forest,undefined);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].stats.maxHp,1210);
});
test("4239盾罩消耗后的实际体力平分给场下存活队友，阵亡者不占份额",()=>{
 const [id,skill]=[4239,29012]; const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
 let g=T.create([[caster,member(3056),member(2987),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].suitState.barrier=300;for(const i of [1,2])g.slots[0][i].fighter.hp=4000;g.slots[0][3].fighter.hp=0;
 const expected=4000+(id===4239?1650:150);
 g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),[expected,expected,0]);
});

test("4908盾罩消耗后的实际体力平分给场下存活队友，阵亡者不占份额",()=>{
 const [id,skill]=[4908,29364]; const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
 let g=T.create([[caster,member(3056),member(2987),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[0].suitState.barrier=300;for(const i of [1,2])g.slots[0][i].fighter.hp=4000;g.slots[0][3].fighter.hp=0;
 const expected=4000+(id===4239?1650:150);
 g=T.turn(g,['wiki:'+skill,potion]);assert.deepEqual(g.slots[0].slice(1).map(s=>s.fighter.hp),[expected,expected,0]);
});
test("3870技能29329初次异常成功后由离场者向所选接替者再次施加睡眠",()=>{
 const [id,skill,status]=[3870,29329,'睡眠']; const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
 for(const blocked of [false,true]){
 let g=T.create([[caster],[member(3056),member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
 if(blocked)g.battle.fighters[1].effects['免异常']={start:1,end:1};
 g=T.turn(g,['wiki:'+skill,potion]);assert.equal(!!g.battle.fighters[1].soulState.repeatOnExit2403,!blocked);
 g=T.turn(g,[potion,{switchTo:2}]);assert.equal(!!g.battle.fighters[1].ailments[status],!blocked);assert.equal(g.slots[1][1].fighter.ailments[status],undefined);
 }
});

test("4865技能29252初次异常成功后由离场者向所选接替者再次施加束缚",()=>{
 const [id,skill,status]=[4865,29252,'束缚']; const caster=member(id);if(!caster.moves.includes(skill))caster.moves[1]=skill;
 for(const blocked of [false,true]){
 let g=T.create([[caster],[member(3056),member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
 if(blocked)g.battle.fighters[1].effects['免异常']={start:1,end:1};
 g=T.turn(g,['wiki:'+skill,potion]);assert.equal(!!g.battle.fighters[1].soulState.repeatOnExit2403,!blocked);
 g=T.turn(g,[potion,{switchTo:2}]);assert.equal(!!g.battle.fighters[1].ailments[status],!blocked);assert.equal(g.slots[1][1].fighter.ailments[status],undefined);
 }
});
test('天循道携带魂罪恶支骸开战已有一具，每次登场最多双方各消逝一只再召一具',()=>{
 const owner=member(3847);owner.snapshot=E.WIKI.versionSnapshots(owner.snapshot).find(v=>E.WIKI.defaultMoves(v).includes(38455));owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 for(const [own,enemy] of [[0,0],[0,2],[2,0],[2,2]]){
 let g=T.create([[member(2987),owner,member(3056),member(2988)],[member(3056),member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
 assert.equal(g.slots[0][1].fighter.soulState.corpseCount,1);
 for(let i=0;i<own;i++)g.slots[0][2+i].fighter.hp=0;
 for(let i=0;i<enemy;i++)g.slots[1][1+i].fighter.hp=0;
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].soulState.corpseCount,1+Number(own+enemy>0));
 for(const [i,n] of [[0,own],[1,enemy]])assert.equal(g.slots[i].filter(s=>s.fighter.soulState.vanished).length,Number(n>0));
 g=T.turn(g,[{switchTo:0},potion]);g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.battle.fighters[0].soulState.corpseCount,1+2*Number(own+enemy>0));
 }
});
test('天道宁论实际抽中瘫痪封换，期满后被剥离者主动离场并恢复原系别',()=>{
 const caster=member(3847);caster.moves[1]=29011;
 let g=T.create([[caster],[member(3056),member(2988)]],[0,0],{seed:8,criticals:false});const type=g.battle.fighters[1].type;
 g=T.turn(g,['wiki:29011',potion]);assert.equal(g.battle.fighters[1].type,'普通');const until=g.battle.fighters[1].ailments['瘫痪'];assert.ok(until>=g.battle.round);
 assert.deepEqual(T.candidates(g,1),[]);while(g.battle.round<=until)g=T.turn(g,[potion,potion]);
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.type,type);
 g=T.turn(g,[potion,{switchTo:0}]);assert.equal(g.battle.fighters[1].type,type);
});
test('荒予咒缚的伙伴强化在库贝萨换回后重新生效，回合内从满体受击转低体即可回复',()=>{
 const caster=member(3741);caster.moves[1]=29246;
 const foe=member(3056);foe.moves[1]=10127;foe.build.overrides.atk=1500;
 let g=T.create([[caster,member(2987)],[foe]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[{switchTo:0},'wiki:10127']);
 assert.equal(g.battle.fighters[0].soulState.kubesaPartner,true);
 assert.ok(g.battle.turns.at(-1).events.some(e=>e.text.includes('库贝萨战阶回复')));
});
test('索杰德尔魂殒若梦令敌方全部阵亡替补消逝，两只与一只均不代打轮回属性附伤',()=>{
 for(const count of [1,2]){
 let g=T.create([[member(4599)],[member(3056),member(2987),member(2988)]],[0,0],{seed:13,criticals:false});
 for(let i=1;i<=count;i++)g.slots[1][i].fighter.hp=0;
 g=T.turn(g,['wiki:28584',potion]);assert.equal(g.slots[1].filter(s=>s.fighter.soulState.vanished).length,count);
 assert.ok(!(g.battle.damageEvents??[]).some(e=>e.type==='attack'&&e.sourceSide===0));
 }
});
test('鲸落让选定的接替者前两回合免疫攻击伤害，第三回合实际扣血',()=>{
 const enemy=member(3056);enemy.moves[1]=10127;
 let g=T.create([[member(4654),member(2988)],[enemy]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:28754',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);const start=g.battle.round;
 for(let n=0;n<3;n++){g=T.turn(g,[potion,'wiki:10127']);const hpLoss=(g.battle.damageEvents??[]).filter(e=>e.type==='attack'&&e.sourceSide===1&&e.round===start+n).reduce((sum,e)=>sum+e.hpLoss,0);assert.equal(hpLoss>0,n===2);}
});
test('堕之盛响实际消耗3000体力使选定的接替者获得1500护盾和1500护罩',()=>{
 let g=T.create([[member(4676),member(2988)],[member(3056)]],[0,0],{seed:13,criticals:false});g.battle.fighters[0].hp=3000;
 g=T.turn(g,['wiki:37510',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[1,null]);
 assert.equal(g.battle.fighters[0].suitState.shield,1500);assert.equal(g.battle.fighters[0].suitState.barrier,1500);
});
test('千万时之眸凯旋击败后选择原位置最靠前的最低现体替补回复全HP和各槽PP',()=>{
 let g=T.create([[member(4498),member(3056),member(2987)],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 for(const slot of g.slots[0].slice(1)){slot.fighter.hp=1000;for(const key of slot.fighter.moves)slot.fighter.pp[key]=0;}
 g.battle.fighters[0].soulState.prophecies={triumph:{}};g.battle.fighters[1].hp=1;
 g=T.turn(g,['wiki:36559',potion]);assert.equal(g.phase,'replace');
 const saved=g.slots[0][1].fighter;assert.equal(saved.hp,9000);for(const key of saved.moves)assert.equal(saved.pp[key],saved.teamPPDefinitions[key].pp);assert.equal(g.slots[0][2].fighter.hp,1000);
});
test('4499技能36552实战满足条件后限制主动换人，到期允许实际换入',()=>{const [id,skill,turns]=[4499,36552,1];
 let g=T.create([[member(id)],[member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 if(id===4499)require('../dist/health-rules.js').grantState(g.battle.fighters[1],'失体Ⅰ',3,1,{sourceSide:0,origin:'soul',revision:'5cd3c296'});
 else require('../dist/guard-states.js').grant(g.battle.fighters[0],'white',1,{origin:'soul',sourceSide:0,revision:'77c3c93c'},{turns:3});
 g=T.turn(g,['wiki:'+skill,potion]);for(let i=0;i<turns;i++){assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[potion,potion]);}
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.active[1],1);
});
test('4500技能28327实战满足条件后限制主动换人，到期允许实际换入',()=>{const [id,skill,turns]=[4500,28327,2];
 let g=T.create([[member(id)],[member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 if(id===4499)require('../dist/health-rules.js').grantState(g.battle.fighters[1],'失体Ⅰ',3,1,{sourceSide:0,origin:'soul',revision:'5cd3c296'});
 else require('../dist/guard-states.js').grant(g.battle.fighters[0],'white',1,{origin:'soul',sourceSide:0,revision:'77c3c93c'},{turns:3});
 g=T.turn(g,['wiki:'+skill,potion]);for(let i=0;i<turns;i++){assert.deepEqual(T.candidates(g,1),[]);g=T.turn(g,[potion,potion]);}
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.active[1],1);
});test('奥妙寒棱闪实际消强后随机扣一位存活替补四分一，低血保一，消强失败不扣',()=>{
 const owner=member(4516);if(!owner.moves.includes(36662))owner.moves[1]=36662;
 const hit=new Set();for(let seed=1;seed<25&&hit.size<2;seed++){
 let g=T.create([[owner],[member(3056),member(2987),member(2988)]],[0,0],{seed,criticals:false});
 const b=g.slots[1];b[1].fighter.hp=500;g.battle.fighters[1].stages.def=1;
 g=T.turn(g,['wiki:36662',potion]);const values=g.slots[1].slice(1).map(s=>s.fighter.hp);
 if(values[0]===1){assert.equal(values[1],9000);hit.add(1);}else{assert.deepEqual(values,[500,6750]);hit.add(2);}
 }assert.equal(hit.size,2);
 let g=T.create([[owner],[member(3056),member(2987)]],[0,0],{seed:1,criticals:false});g=T.turn(g,['wiki:36662',potion]);assert.equal(g.slots[1][1].fighter.hp,9000);
});
test('雷神天明闪没有雷辰时用真实己方存活数计算最低红伤',()=>{
 for(const alive of [1,2,3]){
 const caster=member(4765);caster.build.overrides.atk=1;const target=member(3056);target.build.overrides.def=9000;
 let g=T.create([[caster,member(2987),member(2988)],[target]],[0,0],{seed:13,criticals:false});
 for(let i=alive;i<3;i++)g.slots[0][i].fighter.hp=0;
 g.battle.fighters[0].soulState.lei1966={stars:[]};g=T.turn(g,['wiki:37908',potion]);
 assert.equal(g.battle.damageEvents.find(e=>e.type==='attack'&&e.sourceSide===0)?.settledDamage,alive*100);
 }
});
test('无为觉者千秋虔击败臣服者才令实际下一只臣服',()=>{
 const owner=member(4661);if(!owner.moves.includes(37459))owner.moves[1]=37459;
 for(const submitted of [false,true]){
 let g=T.create([[owner],[member(2988),member(3056)]],[0,0],{seed:13,criticals:false});
 g.battle.fighters[1].hp=1;if(submitted)g.battle.fighters[1].ailments['臣服']=3;
 g=T.turn(g,['wiki:37459',potion]);assert.equal(g.phase,'replace');g=T.replace(g,[null,1]);assert.equal(!!g.battle.fighters[1].ailments['臣服'],submitted);
 }
});
test('未来链接最低克制并列总按原始队伍位置扣级，包括在场者和两个替补并列',()=>{
 const attack=member(3056);attack.moves[1]=10127;
 for(const lead of [0,1]){
 let g=T.create([[member(2987),member(2988),member(3311),member(4600)],[attack]],[lead,0],{seed:13,criticals:false});
 assert.deepEqual(g.slots[0].map(s=>s.fighter.soulState.futureLink??0),[3,3,3,0]);
 g=T.turn(g,[potion,'wiki:10127']);assert.deepEqual(g.slots[0].map(s=>s.fighter.soulState.futureLink??0),[2,3,3,0]);
 }
});
test('斯布林蒂主动换下时三级同步上限、体力及逐槽PP，阵亡清除各人的实存等级并分别回复',()=>{
 const caster=member(4600);caster.build.overrides.maxHp=6000;const foe=member(3056);foe.moves[1]=10127;
 let g=T.create([[caster,member(2987),member(2988)],[foe]],[0,0],{seed:13,criticals:false});
 const a=g.battle.fighters[0];a.hp=3000;for(const key of a.moves)a.pp[key]=1;
 g=T.turn(g,[{switchTo:1},potion]);const synced=g.battle.fighters[0];assert.equal(synced.stats.maxHp,6000);assert.equal(synced.hp,3000);assert.ok(synced.moves.every(k=>synced.pp[k]===1));
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.slots[0][1].fighter.soulState.futureLink,undefined);g.battle.fighters[0].hp=1;const other=g.slots[0][2].fighter;other.hp=4000;other.soulState.futureLink=1;for(const key of other.moves)other.pp[key]=0;
 g=T.turn(g,[potion,'wiki:10127']);assert.equal(g.phase,'replace');
 assert.equal(g.slots[0][1].fighter.hp,3000);assert.equal(g.slots[0][2].fighter.hp,4300);
 for(const [i,n] of [[1,1],[2,1]]){const f=g.slots[0][i].fighter;assert.ok(!f.soulState.futureLink);for(const k of f.moves)assert.equal(f.pp[k],Math.min(n,f.teamPPDefinitions[k].pp));}
});
test('誓约延迟决胜由任意一方换下解除双方绑定，到原期限不秒杀新目标',()=>{
 for(const side of [0,1]){
 let g=T.create([[member(4482),member(2987)],[member(3056),member(2988)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,['wiki:36468',potion]);assert.ok(g.battle.fighters[0].effects['延迟决胜']);assert.ok(g.battle.fighters[1].effects['延迟决胜绑定']);
 const choices=[potion,potion];choices[side]={switchTo:1};g=T.turn(g,choices);assert.ok(!g.battle.fighters[0].effects['延迟决胜']&&!g.battle.fighters[1].effects['延迟决胜绑定']);
 while(g.battle.round<=7)g=T.turn(g,[potion,potion]);assert.equal(g.phase,'action');assert.ok(g.battle.fighters[1].hp>0);
 }
});
test('萨芙凯特真实用溯洄触发崩溃，对手离场清除属性技能封锁',()=>{
 const owner=member(4604);if(!owner.moves.includes(37110))owner.moves[1]=37110;
 let g=T.create([[owner],[member(3056),member(2987)]],[0,0],{seed:13,criticals:false});
 const f=g.battle.fighters[0];f.soulState.futureInstructions1809=0;f.effects.attackBlock={start:1,end:1};
 g=T.turn(g,['wiki:37110',potion]);assert.equal(g.battle.fighters[1].soulState.saff2111Source?.move,37110);
 g=T.turn(g,[potion,{switchTo:1}]);assert.equal(g.slots[1][0].fighter.soulState.saff2111Source,undefined);
 g=T.turn(g,[potion,{switchTo:0}]);assert.equal(g.battle.fighters[1].soulState.saff2111Source,undefined);
});
test('斯布林蒂第五读场下与对方相同系别的实际链接等级，每级克制系数增加半点',()=>{
 for(const level of [0,1,3]){
 let g=T.create([[member(4600),member(2988)],[member(2988)]],[0,0],{seed:13,criticals:false});
 g.slots[0][1].fighter.soulState.futureLink=level;g=T.turn(g,['wiki:37094',potion]);
 const hit=g.battle.turns.at(-1).events.find(e=>e.damage?.type==='attack'&&e.damage.sourceSide===0);
 const base=E.typeEffectiveness(g.battle.moveDefinitions['wiki:37094'].type,g.battle.fighters[1].type,g.battle.typeChart);
 assert.ok(hit.detail.includes('× 属性 '+(base+level*.5)+' ×'),hit.detail);
 }
});
test('混沌魔尊首登抽控制池，换回后实际能抽到非控制异常',()=>{
 const caster=member(3683);caster.moves=caster.moves.map(k=>k===38526?10006:k);
 let found=false;const rules=require('../dist/status-rules.js');
 for(let seed=1;seed<=18&&!found;seed++){
 let g=T.create([[caster,member(2987)],[member(3056)]],[0,0],{seed,criticals:false});
 g=T.turn(g,[potion,potion]);let first=g.battle.randomStatusEvents.find(e=>e.type==='draw');assert.ok(rules.isControl(first.name));
 g=T.turn(g,[{switchTo:1},potion]);const r=g.battle.round;
 g=T.turn(g,[{switchTo:0},potion]);found=g.battle.randomStatusEvents.some(e=>e.round===r&&e.type==='draw'&&!rules.isControl(e.name));
 }assert.ok(found);
});
test('擎空凡尔斯用招先制随己方真实阵亡数上升，五只阵亡时为加五',()=>{
 for(const n of [0,2,5]){
 let g=T.create([[3697,2987,2988,3056,3102,3311].map(member),[member(3056)]],[0,0],{seed:13,criticals:false});
 for(let i=1;i<=n;i++)g.slots[0][i].fighter.hp=0;
 const move=g.battle.fighters[0].moves.find(k=>g.battle.moveDefinitions[k].priority===0);
 g=T.turn(g,[move,potion]);assert.equal(g.battle.fighters[0].soulState.resolvedPriority.value,n);
 }
});
test('守护者艾里克五项雷翼按阵亡数依词条顺序无视条件',()=>{
 for(const n of [0,1,2,3,4,5]){
 const owner=member(3705);owner.snapshot.selectedSoulId=1781;owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 let g=T.create([[owner,...[2987,2988,3102,3311,3697].map(member)],[member(3056)]],[0,0],{seed:13,criticals:false});
 for(let i=1;i<=n;i++)g.slots[0][i].fighter.hp=0;
 g.battle.fighters[0].hp=6000;g.battle.fighters[1].hp=5000;
 g=T.turn(g,[potion,potion]);const w=g.battle.fighters[0].soulState.thunderWings;
 assert.deepEqual([w.shield,w.boost,w.drop,w.fear],[2,3,4,5].map(limit=>n>=limit));
 assert.equal(g.battle.turns[0].events.some(e=>e.text.includes('获得必定暴击')),n>=1);
 }
});
test('混沌哈肯萨首次出战统计敌方两只龙系，含龙神哈莫时翻倍，返场保留',()=>{
 const owner=member(3724);owner.snapshot.selectedSoulId=1756;owner.moves=E.WIKI.defaultMoves(owner.snapshot);
 assert.ok(owner.snapshot.moves.some(m=>m.id===10234));if(!owner.moves.includes(10234))owner.moves[1]=10234;
 const dragon=member(4186);dragon.snapshot.selectedSoulId=1409;dragon.moves=E.WIKI.defaultMoves(dragon.snapshot);
 let g=T.create([[owner,member(2987)],[member(3056),member(3809),dragon]],[0,0],{seed:13,criticals:false});
 const expected=40;assert.equal(g.battle.fighters[0].soulState.darkDragonHatred,expected);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].soulState.fallenDragonResentment,1);
 g=T.turn(g,[{switchTo:1},potion]);assert.equal(g.slots[0][0].fighter.soulState.darkDragonHatred,expected);assert.equal(g.slots[0][0].fighter.soulState.fallenDragonResentment,1);
 g=T.turn(g,[potion,potion]);assert.equal(g.slots[0][0].fighter.soulState.fallenDragonResentment,1);
 g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.darkDragonHatred,expected);assert.equal(g.battle.fighters[0].soulState.fallenDragonResentment,4,'原文按全局战斗回合刷新，不按本人在场累计');
 const round=g.battle.round;g=T.turn(g,['wiki:10234',potion]);assert.equal(g.battle.fighters[0].soulState.fallenDragonResentment,5);assert.ok(g.battle.damageEvents.some(e=>e.round===round&&e.sourceSide===0&&e.type==='fixed'&&e.settledDamage===100));
});
test('极战阿尔斯兰离场保留已有增伤，替补回合不增长，返场第二回合继续叠加',()=>{
 let g=T.create([[member(4327),member(2987)],[member(3056)]],[0,0],{seed:13,criticals:false});
 g=T.turn(g,[potion,potion]);g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].soulState.arslanGrowth,.2);
 g=T.turn(g,[{switchTo:1},potion]);g=T.turn(g,[potion,potion]);g=T.turn(g,[{switchTo:0},potion]);assert.equal(g.battle.fighters[0].soulState.arslanGrowth,.2);
 g=T.turn(g,[potion,potion]);assert.equal(g.battle.fighters[0].soulState.arslanGrowth,.4);
});

test('卡托娜原1570持601盾且有正等级时真实阵亡补位不触发主动离场继承',()=>{
 const caster=member(4345),enemy=member(3056);Object.assign(caster.build.overrides,{atk:1200,spe:9000});Object.assign(enemy.build.overrides,{def:4000,spe:100});const raw=caster.snapshot.moves.find(m=>m.kind!=='status'&&!m.fifth&&m.effectInstances.length===0);assert.ok(raw);if(!caster.moves.includes(raw.id))caster.moves[1]=raw.id;
 let g=T.create([[caster,member(2988)],[enemy]],[0,0],{seed:13,criticals:false});const a=g.battle.fighters[0];a.hp=1;a.suitState.shield=601;Object.assign(a.stages,{def:2,spd:3});g.battle.fighters[1].hp=1;g=T.turn(g,['wiki:'+raw.id,potion]);assert.equal(g.slots[0][0].fighter.hp,0);assert.deepEqual(g.pending,[0]);g=T.replace(g,[1,null]);assert.equal(g.battle.fighters[0].stages.def,0);assert.equal(g.battle.fighters[0].stages.spd,0);assert.ok(g.battle.damageEvents.some(e=>e.type==='true'&&e.sourceSide===1&&e.hpLoss===1));
});
