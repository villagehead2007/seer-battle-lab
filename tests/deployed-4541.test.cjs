'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/4541-battle.cjs');
const {E,make,turn,timer,key,source}=H,e=id=>H.pick(id)[0];

test('4541用户001：来源护罩有效时回合初即分支，敌无回合束缚、有回合全强；免疫和禁强遵守公共规则',()=>{
 for(const mode of ['none','timed','immune','ban']){
  const s=make({moveId:20045,index:-1},{soul:1751});if(mode==='timed'||mode==='ban')timer(s,1,'测试回合');if(mode==='immune')timer(s,1,'免异常');if(mode==='ban')timer(s,0,'禁强化');
  let observed;const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='roundStart'&&c.a.side===1)observed={bound:!!c.a.ailments['束缚'],stages:{...c.t.stages}};}};
  let o;try{o=turn(s);}finally{E.SOULS=old;}
  assert.equal(observed.bound,mode==='none');assert.deepEqual(Object.values(observed.stages),Array(6).fill(mode==='timed'||mode==='immune'?1:0));assert.equal(o.fighters[0].soulState.mortarionActiveRound,1);
 }
});

test('4541用户002：回合末害怕要求成功用招，控制无PP整招无效和MISS不触发，命中词条封锁不封魂印',()=>{
 for(const mode of ['normal','control','noPP','blocked','miss','hit-seal','item','attack-immune']){
  const move=mode==='attack-immune'?10127:20045;const s=make({moveId:move,index:-1},{soul:1751});if(mode==='attack-immune')timer(s,1,'攻击伤害免疫');s.fighters[1].stages.atk=-1;
  if(mode==='control')s.fighters[0].ailments['疲惫']=2;if(mode==='blocked')timer(s,0,'skillBlock');if(mode==='hit-seal')timer(s,0,'属性技能命中效果失效');
  if(mode==='miss'){delete s.fighters[0].effects['属性必中'];s.moveDefinitions[key(move)].accuracy=0;s.moveDefinitions[key(move)].alwaysHit=false;}
  const old=E.SOULS;E.SOULS={...old,run(event,c){old.run(event,c);if(event==='roundStart'&&c.a.side===0&&mode==='noPP')c.a.pp[key(move)]=0;}};
  let o;try{o=mode==='item'?E.resolveTurn(s,['potion:hp',key(920041)]):turn(s);}finally{E.SOULS=old;}
  const success=mode==='normal'||mode==='hit-seal'||mode==='attack-immune';assert.equal(!!o.fighters[1].ailments['害怕'],success);assert.equal(o.fighters[0].soulState.mortarionSuccessfulRound,success?1:undefined);
  assert.equal(o.fighters[0].pp[key(move)],mode==='noPP'?0:s.fighters[0].pp[key(move)]-(mode==='control'||mode==='item'?0:1));
 }
});

test('4541用户002边界：回末害怕先于免异常到期，后续回合重新判定，异常晚杀不向死者施加',()=>{
 let s=make({moveId:20045,index:-1},{soul:1751});s.fighters[1].stages.atk=-1;timer(s,1,'免异常',{},1,1);s=turn(s);assert.equal(s.fighters[1].ailments['害怕'],undefined);assert.equal(s.fighters[1].effects['免异常'],undefined);s=turn(s);assert.ok(s.fighters[1].ailments['害怕']);
 const q=make({moveId:20045,index:-1},{soul:1751,targetHp:500});q.fighters[1].stages.atk=-1;q.fighters[1].ailments['中毒']=1;const o=turn(q);assert.equal(o.fighters[0].soulState.mortarionSuccessfulRound,1);assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[1].ailments['害怕'],undefined);
});

test('4541用户003：531奇数差先取整，真实害怕状态在1%边界两侧变化，279伤害为零概率',()=>{
 const x=e(531);
 for(const [n,roll,want]of [[277,.009,true],[277,.01,false],[279,0,false],[280,0,false],[80,.99,true]]){
  const s=make(x,{omit:true}),old=E.SOULS;let done=false;
  E.SOULS={...old,run(event,c){old.run(event,c);if(event==='roundStart'&&c.a.side===0&&!done){done=true;E.WIKI.effectsEngine.registry[531].execute({...c,m:s.moveDefinitions[key(x.moveId)],settledDamage:n,random:()=>roll,statusProbability:v=>v,ailment:(f,k,actor)=>c.ailment(f,k,actor,false,false,null,{origin:'skill'})},[]);}}};
  let o;try{o=turn(s);}finally{E.SOULS=old;}
  assert.equal(!!o.fighters[1].ailments['害怕'],want);assert.equal(o.fighters[1].pp[key(920041)],want?99:98);
 }
});

test('4541用户004：744采用伤前HP资格，红伤跨阈值不追认，先被敌攻击降HP则按出手时比较',()=>{
 let s=make(e(744),{hp:4990,targetHp:5000});let o=turn(s);assert.ok(o.fighters[1].hp<4990);assert.equal(o.fighters[0].soulState.mota744High,false);assert.equal((o.damageEvents??[]).filter(x=>x.sourceSide===0&&x.type==='fixed').length,0);
 s=make(e(744),{hp:5010,targetHp:5000,aStats:{spe:1},bStats:{atk:9000}});o=turn(s,undefined,920040);assert.ok(o.fighters[0].hp<5000);assert.equal(o.fighters[0].soulState.mota744High,false);assert.equal((o.damageEvents??[]).filter(x=>x.sourceSide===0&&x.type==='fixed').length,0);
});

test('4541全部17真实技能与原魂印1751：完整原效果、合法第五、真实使用和PP消费',()=>{
 const other=require('../research/4509-reviewed-snapshot.json');assert.equal(source.moves.length,17);
 for(const m of source.moves){
  const ids=[m.id,...E.WIKI.defaultMoves(source)].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);if(!ids.includes(36791))ids[ids.length-1]=36791;
  const s=E.createBattle({wikiSnapshots:[source,other],wikiLoadouts:[ids,E.WIKI.defaultMoves(other)],criticals:false,builds:[{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:500}},{overrides:{maxHp:9000,atk:180,spa:180,def:300,spd:300,spe:100}}]});
  timer(s,0,'攻击必中');timer(s,0,'属性必中');const enemy=other.moves.find(x=>x.kind==='status'&&s.fighters[1].moves.includes(key(x.id)));assert.ok(enemy);
  const o=E.resolveTurn(s,[key(m.id),key(enemy.id)]);assert.equal(s.fighters[0].soulId,1751);assert.equal(o.fighters[0].soulState.skillUses[key(m.id)],1);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1);
 }
});
