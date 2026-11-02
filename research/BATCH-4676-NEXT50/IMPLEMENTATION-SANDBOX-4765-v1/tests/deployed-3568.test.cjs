const {test}=require('node:test');
const assert=require('node:assert/strict');
const store=require('../local-species.cjs');
const E=require('../dist/engine.js');
const source=store.species(3568);
function loadout(move){const a=E.WIKI.defaultMoves(source);if(!a.includes(move)){const i=a.findIndex(id=>!source.moves.find(x=>x.id===id).fifth);a[i]=move;}return a;}
test('3568 快照完整、18 个技能逐招可开局结算',()=>{
  assert.deepEqual(store.issues(source),[]);
  assert.equal(source.moves.length,18);assert.equal(source.moves.filter(m=>m.fifth).length,1);
  for(const move of source.moves){const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[loadout(move.id),E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);assert.equal(t.round,2,move.name);assert.ok(t.fighters.every(f=>f.hp>=0&&f.hp<=f.stats.maxHp),move.name);}
});
test('3568 魂印870入场护盾、异常免疫与护盾消失清理',()=>{
  let s=E.createBattle({wikiSnapshots:[source,source],criticals:false,builds:[{overrides:{maxHp:1000,spe:900}},{overrides:{maxHp:1000,spe:1}}]});
  s=E.resolveTurn(s,['wiki:26005','potion:hp']);
  assert.equal(s.fighters[0].soulId,870);assert.ok(s.fighters[0].suitState.shield>0);
  s.fighters[0].ailments={};s=E.resolveTurn(s,['potion:hp','wiki:31796']);
  assert.deepEqual(s.fighters[0].ailments,{});
});
test('3568 特殊效果实际改变状态',()=>{
  const ids=[922,1326,566,1028,1099,1077,1327];for(const id of ids)assert.ok(source.effects.some(e=>e.id===id),`缺少 ${id}`);
  const opponent={...source,souls:[]};
  const s=E.createBattle({wikiSnapshots:[source,opponent],criticals:false,builds:[{overrides:{maxHp:1000,spe:900}},{overrides:{maxHp:1000,spe:1}}]});
  const t=E.resolveTurn(s,['wiki:26005','potion:hp']);assert.ok(t.fighters[0].effects['能力下降反馈']);
  const u=E.resolveTurn(t,['wiki:26006','potion:hp']);assert.ok(u.fighters[0].stages.atk>0);
});
test('3568 效果1077石化分支在攻击后生效并持续到回合边界',()=>{
  const opponent={...source,souls:[]};let s=E.createBattle({wikiSnapshots:[source,opponent],wikiLoadouts:[E.WIKI.defaultMoves(source),[37196,31797,31796,31795,31794]],seed:'s1',criticals:false,builds:[{overrides:{spe:900}},{overrides:{spe:1}}]});
  s=E.resolveTurn(s,['wiki:26006','potion:hp']);s=E.resolveTurn(s,['potion:hp','wiki:37196']);
  assert.equal(s.fighters[1].ailments['石化'],3);
  assert.equal(s.fighters[1].effects['属性技能命中效果失效'],undefined);
});
test('3568 效果1077未触发时封锁属性技能，持续两回合后解除',()=>{
  const opponent={...source,souls:[]};let s=E.createBattle({wikiSnapshots:[source,opponent],wikiLoadouts:[E.WIKI.defaultMoves(source),[37196,31797,26005,31795,31794]],seed:'s0',criticals:false,builds:[{overrides:{spe:900}},{overrides:{spe:1}}]});
  s=E.resolveTurn(s,['wiki:26006','potion:hp']);s.fighters[1].effects['免异常']={start:2,end:4};s=E.resolveTurn(s,['potion:hp','wiki:37196']);
  assert.equal(s.fighters[1].ailments['石化'],undefined);
  assert.equal(s.fighters[1].effects['属性技能命中效果失效'].end,4);
  const ppBefore=s.fighters[1].pp['wiki:26005'];s=E.resolveTurn(s,['potion:hp','wiki:26005']);
  assert.equal(s.fighters[1].stages.atk,0);assert.equal(s.fighters[1].stages.spa,0);assert.equal(s.fighters[1].pp['wiki:26005'],ppBefore-1);assert.equal(s.fighters[1].effects.statusBlock,undefined);
  assert.deepEqual(s.fighters[0].ailments,{});
  s=E.resolveTurn(s,['potion:hp','potion:hp']);
  assert.equal(s.fighters[1].effects['属性技能命中效果失效'],undefined);
});

const {make,turn,timer,pick,key,keys}=require('./helpers/3568-battle.cjs');const e=id=>pick(id)[0];

test('3568 当前18招基础PP伤害MISS控制和封招完整验证',()=>{for(const m of source.moves){const q=make({moveId:m.id,index:null},{omit:true}),n=turn(q);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.power>0)assert.ok(n.fighters[0].lastAttackDamage>0);q.fighters[0].ailments['疲惫']=2;assert.equal(turn(q).fighters[0].pp[key(m.id)],m.pp);q.fighters[0].ailments={};timer(q,0,'skillBlock');assert.equal(turn(q).fighters[1].hp,9000);if(!m.alwaysHit){const p=make({moveId:m.id,index:null},{omit:true,hit:false});p.moveDefinitions[key(m.id)].accuracy=0;assert.equal(turn(p).fighters[1].hp,9000);}}});

test('3568 4与5真实每个实例正负等级、免疫和六级上限',()=>{for(const id of [4,5])for(const x of pick(id)){const q=make(x),side=id===4?0:1,k=keys[x.params[0]];assert.equal(turn(q).fighters[side].stages[k],x.params[2]);timer(q,side,id===4?'禁强化':'免弱');assert.equal(turn(q).fighters[side].stages[k],0);q.fighters[side].stages[k]=id===4?6:-6;assert.equal(turn(q).fighters[side].stages[k],id===4?6:-6);}});

test('3568 870开战入场半体盾、仅登场首回合免异常及回合初盾攻击先制锁定',()=>{const q=make(undefined,{soul:870});assert.equal(q.fighters[0].suitState.shield,4500);q.moveDefinitions[key(900041)].operations=[{effectId:603,index:0,phase:'afterHit',params:[100,2,2],sourceArgs:[100,2,2]}];let n=turn(q,900031);assert.equal(n.fighters[0].ailments['烧伤'],undefined);n=turn(n,900031);assert.ok(n.fighters[0].ailments['烧伤']>=3);const p=make(undefined,{soul:870,aStats:{spe:1}});p.moveDefinitions[key(10223)].priority=0;assert.equal(turn(p,undefined,900040).turns[0].first,0);assert.equal(turn(p,900031,900040).turns[0].first,1);p.fighters[0].suitState.shield=0;p.fighters[0].soulState.shieldLayers=[];assert.equal(turn(p,undefined,900040).turns[0].first,1);});

test('3568 870总盾归零才清强清回合清正PP、普通消盾与攻击盾及同回合两次消失',()=>{const q=make(undefined,{soul:870,opponentMove:31795,opponentEffectId:1215});q.fighters[1].stages.atk=2;timer(q,1,'免弱');q.fighters[1].pp[key(900040)]=0;const n=turn(q,900031,900042);assert.equal(n.fighters[0].suitState.shield,0);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[1].effects['免弱'],undefined);assert.equal(Object.values(n.fighters[1].pp).filter(v=>v===0).length,3);const p=make(undefined,{soul:870});p.fighters[0].suitState.shield=0;p.fighters[0].soulState.shieldLayers=[];p.fighters[0].soulState.attackShield=1;p.fighters[1].stages.atk=2;assert.equal(turn(p,900031,900040).fighters[1].stages.atk,0);const r=make(undefined,{soul:870});r.fighters[0].suitState.shield=1;r.fighters[0].soulState.shieldLayers=[];r.fighters[0].soulState.attackShield=10000;r.moveDefinitions[key(900040)].power=1;r.fighters[1].stages.atk=2;const z=turn(r,900031,900040);assert.equal(z.fighters[1].stages.atk,2);assert.ok(z.fighters[0].soulState.attackShield>0);
 const multi=make({moveId:31797,index:null},{soul:870});multi.fighters[0].suitState.shield=10;multi.fighters[0].suitState.shieldLayers=[];multi.moveDefinitions[key(31797)].operations=[{effectId:1017,index:0,phase:'afterHit',params:[],sourceArgs:[]},{effectId:1327,index:1,phase:'afterHit',params:{threshold:300,denominator:3},sourceArgs:[300,3]},{effectId:1017,index:2,phase:'afterHit',params:[],sourceArgs:[]}];const out=turn(multi);assert.equal(out.turns[0].events.filter(x=>x.text.startsWith('A 方 圣地卡修斯魂印：全部护盾消失')).length,2);assert.equal(Object.values(out.fighters[1].pp).filter(x=>x===0).length,4);
});

test('3568 15害怕5%成功失败和免疫、85吸强与143反强失败保护',()=>{let yes=0,no=0;for(let seed=0;seed<120;seed++){const n=turn(make(e(15),{seed}));if(n.fighters[1].ailments['害怕'])yes++;else no++;}assert.ok(yes&&no);for(const id of [85,143]){const q=make(e(id));q.fighters[1].stages.atk=2;const n=turn(q);assert.equal(n.fighters[1].stages.atk,id===143?-2:0);if(id===85)assert.equal(n.fighters[0].stages.atk,2);timer(q,1,'强化保护');assert.equal(turn(q).fighters[1].stages.atk,2);}});

test('3568 889清回合疲惫成功失败与837累计理论回复全局确认',()=>{const q=make(e(889));timer(q,1,'免弱');assert.ok(turn(q).fighters[1].ailments['疲惫']);assert.equal(turn(make(e(889))).fighters[1].ailments['疲惫'],undefined);let p=make(e(837),{hp:1000});for(const amount of [100,200,300,300]){p.fighters[1].build.resistance.fixed=100;const before=p.fighters[0].hp;p=turn(p);assert.equal(p.fighters[0].hp-before,amount);}const r=make(e(837),{hp:1000});r.fighters[1].build.resistance.fixed=100;r.moveDefinitions[key(31792)].revision='changed';assert.equal(turn(r).fighters[0].hp,1100);});

test('3568 447最低240仍受免攻、679禁技能回血两回合与570免攻一次',()=>{const q=make(e(447));assert.equal(turn(q).fighters[0].lastAttackDamage,240);q.fighters[1].counts.attackNullify=1;assert.equal(turn(q).fighters[0].lastAttackDamage,0);const p=make(e(679),{opponentMove:26006,opponentEffectId:1065,targetHp:1000});const pn=turn(p,undefined,900042);assert.equal(pn.fighters[1].hp+pn.fighters[0].lastAttackDamage,1000);const r=make(e(570)),n=turn(r,undefined,900040);assert.equal(n.fighters[0].hp,9000);assert.equal(n.fighters[0].counts.attackNullify,0);assert.ok(turn(n,900031,900040).fighters[0].hp<9000);});

test('3568 191四回合免反和922真实解除反馈、免弱与不可解除边界',()=>{const q=make(e(191),{opponentMove:11923,opponentEffectId:15});q.moveDefinitions[key(900042)].operations[0].params=[100];const n=turn(q,undefined,900042);assert.equal(n.fighters[0].ailments['害怕'],undefined);assert.ok(n.fighters[1].ailments['害怕']);assert.equal(n.fighters[0].effects.reflect.end,4);const p=make(e(922));p.fighters[0].stages.atk=-2;let a=turn(p);assert.equal(a.fighters[0].stages.atk,0);assert.equal(a.fighters[1].stages.atk,-2);timer(p,1,'免弱');assert.equal(turn(p).fighters[1].stages.atk,0);timer(p,0,'弱化不可解除反转');assert.equal(turn(p).fighters[0].stages.atk,-2);});

test('3568 1004用招200高体400与等体、1215消所有盾成功全弱及低体翻倍',()=>{for(const hp of [8000,9000]){const q=make(e(1004),{hp,targetHp:8000}),n=turn(q);assert.equal(n.fighters[1].hp,8000-(hp>8000?400:200));assert.equal(n.fighters[0].effects['用招高体固伤'].end,3);}for(const hp of [1000,9000]){const q=make(e(1215),{hp});q.fighters[1].suitState.shield=10000;q.fighters[1].soulState.attackShield=20000;const n=turn(q);assert.equal(n.fighters[1].suitState.shield,0);assert.equal(n.fighters[1].soulState.attackShield,0);assert.ok(Object.values(n.fighters[1].stages).every(v=>v===(hp<9000?-2:-1)));}assert.ok(Object.values(turn(make(e(1215))).fighters[1].stages).every(v=>v===0));});

test('3568 1326盾全2无盾全1、1065半体阈值实际回复粉伤与禁疗',()=>{for(const shield of [false,true]){const q=make(e(1326));if(shield)q.fighters[0].soulState.attackShield=10;assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===(shield?2:1)));timer(q,0,'禁强化');assert.ok(Object.values(turn(q).fighters[0].stages).every(v=>v===0));}for(const hp of [4499,4500,9000]){const q=make(e(1065),{hp}),n=turn(q),actual=Math.min(9000-hp,hp<4500?6000:3000);assert.equal(n.fighters[0].hp,hp+actual);assert.equal(n.fighters[1].hp,9000-actual);timer(q,0,'技能禁疗');assert.equal(turn(q).fighters[1].hp,9000);}});

test('3568 1077每次敌攻击后必石化、失败下两回合禁属性且属性不触发',()=>{const q=make(e(1077)),n=turn(q,undefined,900040);assert.ok(n.fighters[1].ailments['石化']);const p=make(e(1077));timer(p,1,'免异常');const a=turn(p,undefined,900040);assert.equal(a.fighters[1].effects['属性技能命中效果失效'].start,2);assert.equal(a.fighters[1].effects['属性技能命中效果失效'].end,3);assert.equal(turn(make(e(1077))).fighters[1].ailments['石化'],undefined);});

test('3568 566忽略40防御真实伤害和792两实例先手攻击无效后手不封',()=>{const q=make(e(566)),p=make(e(566),{omit:true});assert.ok(turn(q).fighters[0].lastAttackDamage>turn(p).fighters[0].lastAttackDamage*1.5);for(const x of pick(792)){const a=make(x),n=turn(a,undefined,900040);assert.equal(n.fighters[0].hp,9000);const b=make(x);b.moveDefinitions[key(900040)].priority=8;assert.ok(turn(b,undefined,900040).fighters[0].hp<9000);}});

test('3568 1028持续效果对正确敌方降防速、任一项失败粉伤及期限免疫',()=>{const q=make(e(1028));let n=turn(q);assert.equal(n.fighters[0].stages.def,0);assert.equal(n.fighters[1].stages.def,-1);assert.equal(n.fighters[1].stages.spe,-1);n=turn(n,900031);assert.equal(n.fighters[1].stages.def,-2);n=turn(n,900031);assert.equal(n.fighters[1].stages.def,-3);assert.equal(turn(n,900031).fighters[1].stages.def,-3);const p=make(e(1028));p.fighters[1].stages.def=-6;const a=turn(p);assert.equal(a.fighters[1].stages.def,-6);assert.equal(a.fighters[1].stages.spe,-1);assert.equal(9000-a.fighters[1].hp-a.fighters[0].lastAttackDamage,3000);p.fighters[1].build.resistance.percent=100;assert.equal(9000-turn(p).fighters[1].hp,turn(p).fighters[0].lastAttackDamage);});

test('3568 796当前体力四分之一每回合实际吸取、粉伤免疫与四回合',()=>{const q=make(e(796),{hp:1000}),n=turn(q),remaining=9000-n.fighters[0].lastAttackDamage,amount=Math.floor(remaining/4);assert.equal(n.fighters[1].hp,remaining-amount);assert.equal(n.fighters[0].hp,1000+amount);assert.equal(n.fighters[0].effects['回合末当前体力吸取'].end,4);q.fighters[1].build.resistance.percent=100;assert.equal(turn(q).fighters[0].hp,1000);});

test('3568 760取消微弱、1099清强免异常一次、689严格高300和1327严格低300理论盾',()=>{const q=make(e(760)),p=make(e(760),{omit:true});q.fighters[1].type='神灵';p.fighters[1].type='神灵';assert.ok(turn(q).fighters[0].lastAttackDamage>=turn(p).fighters[0].lastAttackDamage);const r=make(e(1099));r.fighters[1].stages.atk=2;const n=turn(r);assert.equal(n.fighters[1].stages.atk,0);assert.equal(n.fighters[0].counts.immune,1);assert.equal(turn(make(e(1099))).fighters[0].counts.immune??0,0);const high=make(e(689),{hp:1000});high.moveDefinitions[key(31797)].power=2000;assert.equal(turn(high).fighters[0].hp,4000);assert.equal(turn(make(e(689),{hp:1000})).fighters[0].hp,1000);const low=make(e(1327),{hp:1000});low.fighters[1].build.resistance.percent=100;const z=turn(low);assert.equal(z.fighters[0].hp,4000);assert.equal(z.fighters[0].suitState.shield,3000);low.moveDefinitions[key(31797)].revision='changed';assert.equal(turn(low).fighters[0].suitState.shield,0);});

test('3568 当前标准正式保存18招本地搜索加载配招魂印初始化与真实ID效果',()=>{const s=store.species(3568);assert.equal(s.source.storage,'local');assert.equal(s.deployment.scope,'single');assert.ok(store.search('3568').results.some(x=>x.id===3568));for(const m of s.moves){const ids=[m.id,31797,...s.moves.map(x=>x.id)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5),q=E.createBattle({wikiSnapshots:[s,s],wikiLoadouts:[ids,ids],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});q.fighters[0].effects['攻击必中']={start:1,end:99};assert.equal(q.fighters[0].soulId,870);assert.equal(q.fighters[0].suitState.shield,4500);const n=E.resolveTurn(q,[key(m.id),'potion:hp']);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);if(m.id===26006)assert.equal(n.fighters[0].stages.atk,2);if(m.id===37196){assert.equal(n.fighters[1].stages.def,-1);assert.equal(n.fighters[0].stages.def,0);}}});

test('3568 原始历史字节保留、重新部署矩阵与所有旧别名仍符合正式属性库',()=>{const fs=require('fs'),crypto=require('crypto'),old=fs.readFileSync('research/3568-before-historical-recertification.json'),a=JSON.parse(old).snapshot,b=store.species(3568),D=require('../type-database.cjs');assert.equal(crypto.createHash('sha256').update(old).digest('hex'),'71701d83316a8177b0bfa48578264bc1ef4a37cad4de790c2eaf6db7da9a6f0c');assert.deepEqual(b.typeChart.rows,a.typeChart.rows);for(const [name,parts]of Object.entries(a.typeChart.aliases))assert.deepEqual(D.getCombination(name).types.map(id=>D.getType(id).name),parts);});

test('3568 第五300严格边界不授予1327盾也不回复689、301只触发689',()=>{for(const amount of [300,301]){const q=make({moveId:31797,index:null},{hp:1000});q.moveDefinitions[key(31797)].power=0;q.moveDefinitions[key(31797)].operations=[{effectId:447,index:0,phase:'beforeDamage',params:[amount],sourceArgs:[amount]},...q.moveDefinitions[key(31797)].operations.filter(x=>[689,1327].includes(x.effectId))];const n=turn(q);assert.equal(n.fighters[0].lastAttackDamage,amount);assert.equal(n.fighters[0].suitState.shield,0);assert.equal(n.fighters[0].hp,amount===301?4000:1000);}});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3568 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3568);assert.equal(o.fighters[0].hp,8960);});}
