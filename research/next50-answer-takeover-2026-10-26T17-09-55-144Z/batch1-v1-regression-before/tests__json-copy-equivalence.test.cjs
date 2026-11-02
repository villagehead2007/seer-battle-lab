'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process'),path=require('node:path');
const E=require('../dist/engine.js'),native=v=>JSON.parse(JSON.stringify(v));

test('战斗JSON复制等价：undefined空洞非有限数负零与真实战斗完整状态保持原JSON规则',()=>{
 const cases=[null,true,'中文\uD800',-0,NaN,Infinity,{a:undefined,b:NaN,c:[undefined,,Infinity]},Object.assign(Object.create(null),{x:1}),JSON.parse('{"__proto__":{"polluted":true}}')];
 const H=require('./helpers/4511-battle.cjs');let s=H.make(H.pick(2006)[0],{hit:false});s.moveDefinitions[H.key(s.auditMoveId)].accuracy=0;s.moveDefinitions[H.key(s.auditMoveId)].alwaysHit=false;s=H.turn(s);cases.push(s,H.turn(s,920031,920040));
 for(const v of cases)assert.deepEqual(E.copyBattleJSON(v),native(v));
 assert.equal(Object.hasOwn(E.copyBattleJSON({a:undefined}),'a'),false);
 assert.equal(Object.is(E.copyBattleJSON(-0),-0),false);
 assert.equal(E.copyBattleJSON({c:[,]}).c[0],null);
});
test('战斗JSON复制隔离：共享引用分开复制、冻结来源不共享、原型键不污染或改变输出原型',()=>{
 const shared={n:1},input={a:shared,b:shared,frozen:Object.freeze({n:2})},copy=E.copyBattleJSON(input);
 assert.notEqual(copy.a,copy.b);copy.a.n=3;copy.frozen.n=4;assert.equal(copy.b.n,1);assert.equal(input.a.n,1);assert.equal(input.frozen.n,2);
 const proto=E.copyBattleJSON(JSON.parse('{"__proto__":{"polluted":true}}'));
 assert.equal(Object.hasOwn(proto,'__proto__'),true);assert.equal(Object.getPrototypeOf(proto),Object.prototype);assert.equal(Object.prototype.polluted,undefined);
});
test('战斗JSON复制回退：getter与toJSON各只执行原有一次，日期函数及循环BigInt保留原结果和拒绝',()=>{
 let calls=0;const getter={get x(){calls++;return 2;}};assert.deepEqual(E.copyBattleJSON(getter),{x:2});assert.equal(calls,1);
 calls=0;const custom={toJSON(){calls++;return {x:3};}};assert.deepEqual(E.copyBattleJSON(custom),{x:3});assert.equal(calls,1);
 const fn=function(){};fn.toJSON=()=>7;assert.equal(E.copyBattleJSON(fn),7);
 for(const v of [new Date('2020-01-01T00:00:00Z'),new Map([['x',1]]),/a/g,{fn(){},x:4},[()=>1,Symbol('x')]])assert.deepEqual(E.copyBattleJSON(v),native(v));
 const cycle={};cycle.self=cycle;assert.throws(()=>E.copyBattleJSON(cycle),TypeError);assert.throws(()=>E.copyBattleJSON({x:1n}),TypeError);assert.throws(()=>E.copyBattleJSON(undefined),SyntaxError);
});
test('战斗复制前后真实回放完全一致：17原生技能两种种子及2006/2008/保1红伤的全状态摘要相同',()=>{
 const code=String.raw`
 const fs=require('fs'),path=require('path'),Module=require('module'),crypto=require('crypto'),assert=require('assert/strict');
 if(process.argv[1]==='baseline'){
  const filename=require.resolve('./dist/souls.js'),old=new Module(filename,module);old.filename=filename;old.paths=Module._nodeModulePaths(path.dirname(filename));
  old._compile(fs.readFileSync('research/next50-performance-before-20min-2026-10-27/dist__souls.js','utf8'),filename);require.cache[filename]=old;
 }
 const H=require('./tests/helpers/4511-battle.cjs'),E=H.E,source=H.source,merlin=require('./research/4509-reviewed-snapshot.json'),results=[];
 const record=(name,s)=>results.push({name,hash:crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'),hp:s.fighters.map(f=>f.hp),round:s.round});
 for(const m of source.moves)for(const seed of [0,7]){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36628))ids[ids.length-1]=36628;
  const s=E.createBattle({wikiSnapshots:[source,merlin],wikiLoadouts:[ids,[28313,10223,36605,28314,36610]],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});s.rng=seed;H.timer(s,0,'攻击必中');H.timer(s,0,'属性必中');const o=E.resolveTurn(s,[H.key(m.id),H.key(28313)]);const uses=o.fighters[0].soulState.skillUses[H.key(m.id)]??0;assert.ok(uses===0||uses===1);if(seed===0)assert.equal(o.fighters[0].pp[H.key(m.id)],m.pp-1,'native original PP assertion '+m.id);record('native:'+m.id+':'+seed,o);
 }
 let s=H.make(H.pick(2006)[0],{hit:false});s.moveDefinitions[H.key(s.auditMoveId)].accuracy=0;s.moveDefinitions[H.key(s.auditMoveId)].alwaysHit=false;s=H.turn(H.turn(s));s=H.turn(s,920031,920040);assert.equal(s.fighters[0].counts.attackNullify,0);record('2006',s);
 s=H.make(H.pick(2008)[0]);s.fighters[0].stages.atk=2;H.op(s,33,[]);s=H.turn(s,undefined,920042);assert.equal(s.fighters[0].counts.immune,1);record('2008',s);
 s=H.make(H.pick(807)[0],{hp:1});H.timer(s,0,'致命保留',{hp:1});s=H.turn(s,920031,920040);assert.equal(s.fighters[0].hp,1);s=H.turn(s);record('807-preserve1',s);
 process.stdout.write(JSON.stringify(results));
 `;
 const run=mode=>{const r=cp.spawnSync(process.execPath,['-e',code,mode],{cwd:path.resolve(__dirname,'..'),encoding:'utf8',windowsHide:true,timeout:120000,maxBuffer:8*1024*1024});assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
 const before=run('baseline'),after=run('optimized');assert.equal(before.length,37);assert.deepEqual(after,before);assert.ok(after.some(x=>x.hp.some(h=>h<9000)));
});
