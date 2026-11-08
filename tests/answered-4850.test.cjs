'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),source=require('../research/BATCH-4816-REMAINING/4850/snapshot.json');
const H=require('./helpers/remaining-battle.cjs')(source),{E,make,turn,timer,sum}=H;
const enemyLoadout=[11188,...source.moves.filter(m=>!m.fifth&&m.id!==11188).slice(0,3).map(m=>m.id),source.moves.find(m=>m.fifth).id];
function observe(fn,run){const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);fn(event,c);}};try{return run();}finally{E.SOULS=old;}}
test('已答21：4850真实多段红伤回合末仅汇总反弹一次百分伤，受击时尚未反弹且源参数不改',()=>{
 const s=make({move:20070,enemySource:source,enemyLoadout}),seen=[];observe((event,c)=>{if(event==='afterAttack'&&c.a.side===1)seen.push(c.a.hp);},()=>turn(s,20070,11188));
 const reds=s.damageEvents.filter(e=>e.round===1&&e.type==='attack'&&e.targetSide===0),total=reds.reduce((n,e)=>n+e.settledDamage,0),pink=s.damageEvents.filter(e=>e.round===1&&e.type==='percent'&&e.sourceSide===0);assert.ok(reds.length>=2);assert.ok(seen.every(hp=>hp===9000));assert.equal(pink.length,1);assert.equal(pink[0].settledDamage,Math.floor(total/4));assert.equal(s.fighters[1].hp,9000-Math.floor(total/4));assert.equal(s.fighters[0].soulState.counterStormHistory21[0].total,total);
});
test('已答21：保1按完整红伤汇总而非HP损失，免红不累计，固粉真不累计，反弹受百分免疫',()=>{
 const over=make({move:20070,enemySource:source,enemyLoadout,hp:200,bStats:{atk:5000}});timer(over,0,'致命保留',{hp:1});turn(over,20070,11188);const red=sum(over,'attack',1),loss=over.damageEvents.filter(e=>e.round===1&&e.targetSide===0&&e.type==='attack').reduce((n,e)=>n+e.hpLoss,0);assert.equal(loss,199);assert.ok(red>loss);assert.equal(sum(over,'percent'),Math.floor(red/4));assert.equal(over.fighters[0].hp,1);
 const immune=make({move:20070});timer(immune,0,'攻击伤害免疫');turn(immune,20070,10127);assert.equal(sum(immune,'percent'),0);assert.equal(immune.fighters[0].soulState.counterStorm21,undefined);
 const others=make({move:20070});observe((event,c)=>{if(event==='afterUse'&&c.a.side===1)for(const type of ['fixed','percent','true'])c.hurt(c.t,100,'反击风暴排除其他类型',type);},()=>turn(others,20070,20309));assert.equal(sum(others,'percent'),0);assert.equal(others.fighters[0].hp,8700);
 const pink=make({move:20070});timer(pink,1,'固定百分比免疫');turn(pink,20070,10127);assert.ok(pink.fighters[0].soulState.counterStormHistory21[0].amount>0);assert.equal(sum(pink,'percent'),0);
});
test('已答21：最后有效回合仍反弹，到期后不反弹，受伤后被断回合则不在回末发动，死亡不反弹',()=>{
 const s=make({move:20070});turn(s,20070,20309);const end=s.fighters[0].effects['反击风暴'].end,idle=s.fighters[0].moves.find(k=>k!=='wiki:20070'&&!s.moveDefinitions[k].fifth);s.moveDefinitions[idle].operations=[];
 for(let r=2;r<=end+1;r++){turn(s,Number(idle.slice(5)),10127);assert.equal(sum(s,'percent')>0,r<=end,'round '+r);}assert.equal(s.fighters[0].soulState.counterStormHistory21.at(-1).round,end);
 const cleared=make({move:20070});observe((event,c)=>{if(event==='afterAttack'&&c.a.side===1)c.clear(c.t);},()=>turn(cleared,20070,10127));assert.equal(sum(cleared,'percent'),0);assert.ok(sum(cleared,'attack',1)>0);
 const dead=make({move:20070,hp:1});turn(dead,20070,10127);assert.equal(dead.fighters[0].hp,0);assert.equal(sum(dead,'percent'),0);
});
test('已答21：明确关联4925真实20571保持2到3回合及三分一比例，严格拒绝版本参数漂移',()=>{
 const raw=require('../research/BATCH-4816-REMAINING/4925/snapshot.json'),h=require('./helpers/remaining-battle.cjs')(raw),s=h.make({move:20571});h.turn(s,20571,10127);assert.ok([2,3].includes(s.fighters[0].effects['反击风暴'].end));assert.equal(s.fighters[0].effects['反击风暴'].fraction,1/3);assert.equal(h.sum(s,'percent'),Math.floor(h.sum(s,'attack',1)/3));
 for(const original of [source.moves.find(m=>m.id===20070),raw.moves.find(m=>m.id===20571)]){const changed=structuredClone(original);changed.revision='seerapi:00000000';assert.notEqual(E.WIKI.effectsEngine.compileInstances(changed.effectInstances,(original.id===20070?source:raw).effects,changed).issue,'');}assert.deepEqual(source.moves.find(m=>m.id===20070).effectInstances[0].args,[4,5,4]);
});
