'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),E=require('../dist/engine.js');
const source=require('../data/species-pending/3670.json').snapshot;
const key=id=>'wiki:'+id;
function make(moveId,effectId,seed=0){
 const a=structuredClone(source),b=structuredClone(source);
 const move=structuredClone(a.moves.find(m=>m.id===moveId));move.effectInstances=move.effectInstances.filter(e=>e.id===effectId);move.effectIds=move.effectInstances.map(e=>e.id);if(!move.effectIds.length)move.description="";
 const neutral=(id,kind,power,fifth=false)=>({...structuredClone(move),id,name:'3670独立测试'+id,kind,power,priority:0,pp:99,accuracy:100,alwaysHit:true,fifth,effectIds:[],effectInstances:[],description:'',sourceFlags:{is_fifth:fifth,is_special:false,classification:'regular'}});
 a.souls=[];b.souls=[];a.moves=[move,neutral(900030,'special',100,true),neutral(900031,'status',0),neutral(900032,'status',0),neutral(900033,'status',0)];b.id=900670;b.name='3670对照';b.moves=[neutral(900040,'special',40,true),neutral(900041,'status',0),neutral(900042,'status',0),neutral(900043,'status',0),neutral(900044,'status',0)];
 const stats={maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100};
 const s=E.createBattle({wikiSnapshots:[a,b],wikiLoadouts:[a.moves.map(m=>m.id),b.moves.map(m=>m.id)],criticals:false,builds:[{overrides:stats},{overrides:{...stats,spe:900}}]});s.rng=seed;s.fighters[0].effects['攻击必中']={start:1,end:99};return s;
}
const turn=(s,m,other=900041)=>E.resolveTurn(s,[key(m),key(other)]);
function random(seed){let t=(seed+0x6D2B79F5)>>>0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
function expected(s,power,roll,multiplier=1,type){const base=Math.floor(Math.floor(42*power*180/300)/50)+2;return Math.floor(base*require('./helpers/source-stab.cjs')(type,s.fighters[0].type,s.typeChart)*E.typeEffectiveness(type,s.fighters[1].type,s.typeChart)*roll/100*multiplier);}

test('3670 公共70两招随机威力全部71档对应实际伤害及PP',()=>{
 for(const id of [12646,32287]){const seen=new Set();for(let seed=0;seed<2000&&seen.size<71;seed++){const power=150+Math.floor(random(seed)*71);if(seen.has(power))continue;seen.add(power);const s=make(id,70,seed),o=turn(s,id);const roll=85+Math.floor(random((seed+0x6D2B79F5)>>>0)*16);const damage=expected(s,power,roll,1,source.moves.find(m=>m.id===id).type);assert.equal(9000-o.fighters[1].hp,damage,`${id}/${power}`);assert.equal(o.fighters[0].pp[key(id)],source.moves.find(m=>m.id===id).pp-1);}assert.equal(seen.size,71);assert.ok(seen.has(150)&&seen.has(220));}
});

test('3670 公共70封招不伤害且减伤作用于随机威力结算后',()=>{
 for(const id of [12646,32287]){const s=make(id,70);s.fighters[0].effects.skillBlock={start:1,end:1};const o=turn(s,id);assert.equal(o.fighters[1].hp,9000);assert.equal(o.fighters[0].pp[key(id)],source.moves.find(m=>m.id===id).pp-1);const reduced=make(id,70);reduced.fighters[1].effects['全伤害减半']={start:1,end:1};const normal=turn(make(id,70),id);const r=turn(reduced,id);assert.equal(9000-r.fighters[1].hp,Math.floor((9000-normal.fighters[1].hp)/2));}
});

test('3670 公共827两招消强后下一回合强制先手和翻倍到期',()=>{
 for(const id of [32320,36535]){const s=make(id,827);s.fighters[1].stages.atk=2;s.fighters[1].stages.def=-1;let o=turn(s,id);assert.equal(o.fighters[1].stages.atk,0);assert.equal(o.fighters[1].stages.def,-1);assert.equal(o.turns[0].first,0);assert.equal(o.fighters[0].effects.doubleDamage.start,2);assert.equal(o.fighters[0].effects.doubleDamage.end,2);
 const ref=structuredClone(o);delete ref.fighters[0].effects.doubleDamage;const normal=turn(ref,900030);const boosted=turn(o,900030);assert.equal(boosted.turns[1].first,0);assert.ok(boosted.fighters[0].lastAttackDamage>=normal.fighters[0].lastAttackDamage*2);assert.ok(boosted.fighters[0].lastAttackDamage<=normal.fighters[0].lastAttackDamage*2+1);assert.equal(o.fighters[1].hp-boosted.fighters[1].hp,boosted.fighters[0].lastAttackDamage);
 const expired=turn(boosted,900030);assert.equal(expired.turns[2].first,1);assert.equal(expired.fighters[0].effects.doubleDamage,undefined);
 const status=turn(o,900031);assert.equal(status.turns[1].first,0);assert.equal(status.fighters[1].hp,o.fighters[1].hp);
 }
});

test('3670 公共827无强化、强化保护、封招均无先手和增伤奖励',()=>{
 for(const id of [32320,36535])for(const mode of ['empty','protected','blocked']){const s=make(id,827);s.fighters[1].stages.def=-2;if(mode!=='empty')s.fighters[1].stages.atk=6;if(mode==='protected')s.fighters[1].effects['幽蝶强化保护']={start:1,end:3};if(mode==='blocked')s.fighters[0].effects.skillBlock={start:1,end:1};const o=turn(s,id);assert.equal(o.fighters[1].stages.atk,mode==='empty'?0:6);assert.equal(o.fighters[1].stages.def,-2);assert.equal(o.fighters[0].effects.doubleDamage,undefined);assert.equal(o.fighters[0].effects['所有技能必定先手'],undefined);if(mode==='blocked')assert.equal(o.fighters[1].hp,9000);}
});


test('3670 公共713和1772按六项等级总和追加固伤、忽略反向等级及护罩',()=>{
 for(const effectId of [713,1772]){
  const s=make(36536,effectId),side=effectId===713?0:1,sign=effectId===713?1:-1;
  s.fighters[side].stages={atk:6*sign,def:2*sign,spa:-sign,spd:0,spe:3*sign,acc:sign};
  const o=turn(s,36536);assert.equal(9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage,360);
  const zero=turn(make(36536,effectId),36536);assert.equal(9000-zero.fighters[1].hp,zero.fighters[0].lastAttackDamage);
  const blocked=structuredClone(s);blocked.fighters[0].effects.skillBlock={start:1,end:1};assert.equal(turn(blocked,36536).fighters[1].hp,9000);
  const cap=make(36536,effectId);for(const k of Object.keys(cap.fighters[side].stages))cap.fighters[side].stages[k]=6*sign;const co=turn(cap,36536);assert.equal(9000-co.fighters[1].hp-co.fighters[0].lastAttackDamage,1080);
  const immune=structuredClone(s);immune.fighters[1].suitState.barrier=1000;const io=turn(immune,36536);assert.equal(9000-io.fighters[1].hp,io.fighters[0].lastAttackDamage);assert.equal(io.fighters[1].suitState.barrier,640);
 }
});

test('3670 公共1328累计使用概率40/60/80/100及上限，跨技能保留且封招扣PP记使用但无伤害',()=>{
 const id=32320;
 for(const uses of [0,1,2,3,10])for(let seed=0;seed<15;seed++){
  const s=make(id,1328,seed);s.fighters[0].soulState.skillUses={[key(id)]:uses};
  const chance=Math.min(100,40+uses*20),yes=chance===100||random(seed)<chance/100;
  const ref=make(id,-1,chance===100?seed:(seed+0x6D2B79F5)>>>0);const expectedTurn=turn(ref,id),o=turn(s,id);
  const n=expectedTurn.fighters[0].lastAttackDamage,actual=o.fighters[0].lastAttackDamage;
  assert.ok(actual>=(yes?n*2:n)&&actual<=(yes?n*2+1:n),String({uses,seed,yes,actual,n}));assert.equal(9000-o.fighters[1].hp,actual);
  assert.equal(o.fighters[0].soulState.skillUses[key(id)],uses+1);
 }
 let s=turn(make(id,1328),id);s=turn(s,900031);assert.equal(s.fighters[0].soulState.skillUses[key(id)],1);s.fighters[0].effects.skillBlock={start:3,end:3};const b=turn(s,id);assert.equal(b.fighters[0].soulState.skillUses[key(id)],2);assert.equal(b.fighters[0].pp[key(id)],s.fighters[0].pp[key(id)]-1);assert.equal(b.fighters[1].hp,s.fighters[1].hp);
});

test('3670 公共519使用技能后按非零能力种类回复并持续五回合',()=>{
 let s=make(22588,519);s.fighters[0].hp=1000;s.fighters[0].stages={atk:6,def:-2,spa:0,spd:1,spe:0,acc:-6};
 s=turn(s,22588);assert.equal(s.fighters[0].hp,1160);assert.equal(s.fighters[0].effects['用招按能力种类回复'].end,5);
 for(let r=2;r<=6;r++){s.fighters[0].hp=1000;s=turn(s,r%2?900030:900031);assert.equal(s.fighters[0].hp,r<=5?1160:1000,'round '+r);}
 assert.equal(s.fighters[0].effects['用招按能力种类回复'],undefined);
});

test('3670 公共519无等级不回复、动态种类计数、体力上限及技能禁疗',()=>{
 let s=make(22588,519);s.fighters[0].hp=1000;s=turn(s,22588);assert.equal(s.fighters[0].hp,1000);
 s.fighters[0].stages.atk=6;let o=turn(s,900031);assert.equal(o.fighters[0].hp,1040);
 s.fighters[0].stages.atk=-6;o=turn(s,900031);assert.equal(o.fighters[0].hp,1040);
 for(const k of Object.keys(s.fighters[0].stages))s.fighters[0].stages[k]=1;
 o=turn(s,900031);assert.equal(o.fighters[0].hp,1240);
 const cap=structuredClone(s);cap.fighters[0].hp=8999;assert.equal(turn(cap,900031).fighters[0].hp,9000);
 const ban=structuredClone(s);ban.fighters[0].effects['技能禁疗']={start:2,end:2};assert.equal(turn(ban,900031).fighters[0].hp,1000);
});

test('3670 公共519施放失效不登记、不能行动不回复且持续可被清除',()=>{
 const s=make(22588,519);s.fighters[0].hp=1000;s.fighters[0].stages.atk=1;s.fighters[0].effects.skillBlock={start:1,end:1};let o=turn(s,22588);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].effects['用招按能力种类回复'],undefined);
 delete s.fighters[0].effects.skillBlock;const active=turn(s,22588);active.fighters[0].hp=1000;active.fighters[0].ailments['疲惫']=3;o=turn(active,900031);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[0].pp[key(900031)],99);
 delete active.fighters[0].ailments['疲惫'];delete active.fighters[0].effects['用招按能力种类回复'];assert.equal(turn(active,900031).fighters[0].hp,1000);
});
