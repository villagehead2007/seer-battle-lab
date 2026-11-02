'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const H=require('./helpers/3613-battle.cjs');
const {source,keys,key,IDLE,WAIT,HIT,FEAR,make,turn,wait,timer,allStages,pick,seedCase}=H;
const hp=o=>o.fighters.map(f=>f.hp);

test('3613 来源快照与缓存的31招、70实例及魂印原文参数逐项一致',()=>{
  for(const m of source.moves){const raw=require('../research/seerapi-cache/3613/skill-'+m.id+'.json');
    assert.equal(m.hash,raw.hash);assert.equal(m.name,raw.name);assert.equal(m.power,raw.power);assert.equal(m.pp,raw.max_pp);assert.equal(m.priority,raw.priority);assert.equal(m.alwaysHit,raw.must_hit);
    assert.deepEqual(m.sourceEffectInstances??m.effectInstances,raw.skill_effect.map(e=>({id:e.effect.id,args:e.args,description:e.info})));
    for(const x of m.effectInstances){const meta=require('../research/seerapi-cache/3613/skill_effect_type-'+x.id+'.json'),saved=source.effects.find(e=>e.id===x.id);assert.equal(saved.template,meta.info);assert.equal(saved.revision,'seerapi:'+meta.hash);assert.equal(x.args.length,meta.args_num);if(x.id===954){assert.deepEqual(x.args,[]);assert.deepEqual(m.parameterNormalization.sourceArgs,[1]);assert.equal(m.parameterNormalization.skillHash,raw.hash);}}
  }
  for(const soul of source.souls){const raw=require('../research/seerapi-cache/3613/soulmark-'+soul.id+'.json');assert.equal(soul.description,raw.desc);assert.deepEqual(soul.args,raw.effect.effect_args);assert.equal(soul.hash,raw.hash);}
});

test('3613 基础31招真实扣PP、零PP拒绝、控制和封招阻止执行',()=>{
  for(const m of source.moves){const e={moveId:m.id,index:null},s=make(e,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,String(m.id));
    if(m.kind!=='status'&&m.power>0)assert.ok(o.fighters[0].lastAttackDamage>0,String(m.id));
    const empty=make(e);empty.fighters[0].pp[key(m.id)]=0;const before=structuredClone(empty);assert.throws(()=>turn(empty));assert.deepEqual(empty,before);
    const controlled=make(e);controlled.fighters[0].ailments['疲惫']=2;const c=turn(controlled);assert.equal(c.fighters[0].pp[key(m.id)],m.pp);assert.deepEqual(hp(c),[9000,9000]);
    const blocked=make(e);timer(blocked,0,'skillBlock');const b=turn(blocked);assert.equal(b.fighters[0].pp[key(m.id)],m.pp-1);assert.deepEqual(hp(b),[9000,9000]);assert.deepEqual(b.fighters[1].stages,blocked.fighters[1].stages);assert.deepEqual(b.fighters[1].ailments,{});
    assert.deepEqual(b.fighters[0].stages,blocked.fighters[0].stages);assert.deepEqual(b.fighters[0].effects,blocked.fighters[0].effects);assert.deepEqual(b.fighters[0].counts,blocked.fighters[0].counts);
  }
});

test('3613 基础31招原始威力分类、暴击倍数、先制与命中决定战斗结果',()=>{
  for(const m of source.moves){const e={moveId:m.id,index:null},s=make(e,{omit:true}),o=turn(s);
    const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2,affinity=H.E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart),stab=m.type===s.fighters[0].type?1.5:1;
    const expected=m.kind==='status'||m.power===0?0:Math.floor(base*affinity*stab*.89*(m.hiddenEffect?.id===1?2:1));assert.equal(9000-o.fighters[1].hp,expected,String(m.id));
    const slow=make(e,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
    if(m.kind!=='status') {const crit=make(e,{omit:true});timer(crit,0,'必定暴击');assert.equal(9000-turn(crit).fighters[1].hp,m.power===0?0:Math.floor(base*affinity*stab*2*.89));
      const wrong=make(e,{omit:true,aStats:m.kind==='physical'?{spa:900}:{atk:900}});assert.equal(turn(wrong).fighters[0].lastAttackDamage,expected);
      const miss=make(e,{omit:true,hit:false});timer(miss,0,'攻击必失');assert.equal(turn(miss).fighters[1].hp,m.alwaysHit?9000-expected:9000);
    }
    if(!m.alwaysHit){let seen=false;for(let seed=0;seed<32&&!seen;seed++){const miss=make(e,{seed,hit:false});miss.fighters[0].stages.acc=-6;const result=turn(miss);if(result.turns[0].events.some(x=>x.kind==='miss'&&x.text.startsWith('A 方'))){seen=true;assert.equal(result.fighters[0].pp[key(m.id)],m.pp-1);assert.equal(result.fighters[1].hp,9000);}}assert.equal(seen,true,String(m.id));}
  }
});

test('3613 属性4与5逐实例概率、六级边界及免弱禁强',()=>{
  for(const e of [...pick(4),...pick(5)]){const side=e.id===4?0:1,k=keys[e.params[0]],n=e.params[2];
    const yes=seedCase(e,o=>o.fighters[side].stages[k]===n);assert.equal(yes.out.fighters[side].stages[k],n);
    if(e.params[1]<100){const no=seedCase(e,o=>o.fighters[side].stages[k]===0);assert.equal(no.out.fighters[side].stages[k],0);}
    const cap=make(e,{seed:yes.seed});cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
    const block=make(e,{seed:yes.seed});timer(block,side,n>0?'禁强化':'免弱');assert.equal(turn(block).fighters[side].stages[k],0);
    const invalid=make(e);timer(invalid,0,'skillBlock');assert.deepEqual(turn(invalid).fighters.map(f=>f.stages),invalid.fighters.map(f=>f.stages));
  }
});


test('3613 939后手名义回复在伤害免疫溢出禁疗先手边界保持真实状态',()=>{const o=require('./helpers/assert-939-nominal-heal.cjs')(3613);assert.equal(o.fighters[0].hp,1000);});

test("3613 持续比例吸取在基础攻击击败后仍按理论量回复，免疫/溢出/禁疗分开",()=>{const o=require('./helpers/assert-597-nominal-after-kill.cjs')(3613);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,0);});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3613 1207公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1207-success.cjs')();assert.equal(o.fighters[0].stages.atk,0);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3613 583真实实例PP保护及免疫PP削减公共修复状态验证',()=>{const o=require('./helpers/assert-583-pp-protection.cjs')(3613);assert.ok(o.fighters[1].moves.every(k=>o.fighters[1].pp[k]>0));});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3613 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3613,532);assert.equal(o.fighters[0].hp,8960);});}
