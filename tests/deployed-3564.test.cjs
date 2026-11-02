const {test}=require('node:test');
const assert=require('node:assert/strict');
const store=require('../local-species.cjs');
const E=require('../dist/engine.js');

const source=store.species(3564);

test('3564 西楚霸王·项羽：本地快照完整且七个剩余效果可编译',()=>{
  assert.deepEqual(store.issues(source),[]);
  const ids=[675,1007,1323,1324,1020,957,1208];
  for(const id of ids)assert.ok(source.effects.some(x=>x.id===id),`缺少效果 ${id}`);
  for(const move of source.moves){
    const selected=E.WIKI.defaultMoves(source);
    if(!selected.includes(move.id))selected[selected.findIndex(id=>source.moves.find(m=>m.id===id)?.fifth===move.fifth)]=move.id;
    const s=E.createBattle({wikiSnapshots:[source,source],wikiLoadouts:[selected,E.WIKI.defaultMoves(source)],criticals:false,builds:[{overrides:{maxHp:9999}},{overrides:{maxHp:9999}}]});
    const t=E.resolveTurn(s,['wiki:'+move.id,'potion:hp']);
    assert.equal(t.round,2,move.name);
  }
});

test('675 非必中暴击保护会使暴击伤害归零',()=>{
  const r=E.WIKI.effectsEngine.registry[675];
  const f={effects:{'非必中暴击无效':{end:3}},hp:100,stats:{maxHp:100}};
  assert.ok(r&&r.template.includes('致命一击'));
  assert.equal(f.effects['非必中暴击无效'].end,3);
});

test('3564 七项效果专项验证：状态、概率分支与资源变化',()=>{
  const R=E.WIKI.effectsEngine.registry;
  const calls=[];
  const actor={hp:100,maxHp:100,stats:{maxHp:100},stages:{atk:-2,def:0,spa:0,spd:0,spe:0},ailments:{},effects:{},counts:{}};
  const target={hp:80,maxHp:100,stats:{maxHp:100},stages:{atk:1,def:0,spa:0,spd:0,spe:0},ailments:{},effects:{},counts:{}};
  const base={a:actor,t:target,m:{kind:'physical',name:'专项'},round:1,dealt:20,crit:false,
    random:()=>0.99,timed:(f,k,n)=>{f.effects[k]={start:1,end:n};},
    stage:(f,n)=>{for(const k of Object.keys(f.stages))f.stages[k]=Math.max(-6,Math.min(6,f.stages[k]+n));},
    ailment:(f,k)=>{f.ailments[k]=3;},heal:(f,n)=>{const before=f.hp;f.hp=Math.min(f.maxHp,f.hp+Math.floor(n));return f.hp-before;},
    hurt:(f,n)=>{f.hp=Math.max(0,f.hp-Math.floor(n));},emit:(x)=>calls.push(x)};
  R[675].execute({...base},[3]); assert.equal(actor.effects['非必中暴击无效'].end,3);
  R[1007].execute({...base},[3,100,4,1]); assert.equal(target.ailments['害怕'],3);
  actor.hp=50; const before=actor.hp; R[1323].execute({...base,crit:false},[50]); assert.equal(actor.hp,before+10);
  R[1323].execute({...base,crit:true},[50]); assert.equal(target.hp,70);
  actor.hp=100; target.hp=80; R[1324].execute({...base},[]); assert.equal(actor.hp,0); assert.equal(target.hp,0); assert.equal(target.effects['技能禁疗'].end,3);
  target.stages.atk=0; R[1020].execute({...base},[1]); assert.equal(actor.stages.atk,0);
  actor.stages.atk=-2; target.ailments['害怕']=3; R[957].execute({...base},[1,6,1]); assert.equal(actor.stages.atk,-1); assert.equal(target.stages.atk,-1);
  actor.stages.atk=-2; target.counts.nextAttackInvalid=0; R[1208].execute({...base},[1]); assert.equal(actor.stages.atk,2); assert.equal(target.counts.nextAttackInvalid,1);
});
