'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {E,source,key,keys,entries,make,turn,pick,timer}=require('./helpers/3670-battle.cjs');
const e=id=>pick(id)[0];

test('3670 两版魂印回合初强化或降级必暴，觉醒粉伤按自身最大体力',()=>{
 for(const soul of [956,1710]){
  const variants=[];for(let seed=0;seed<20;seed++){const s=make({moveId:10068,index:null},{soul,omit:true,seed,hp:5000,bStats:{maxHp:9900}});const o=turn(s,900030);variants.push(o);
   if(o.fighters[0].stages.atk===1){assert.equal(o.fighters[1].stages.atk,0);assert.equal(9900-o.fighters[1].hp-o.fighters[0].lastAttackDamage,soul===1710?3000:0);}
   else{assert.equal(o.fighters[1].stages.atk,-1);assert.equal(o.fighters[0].stages.atk,0);assert.ok(o.turns[0].events.some(x=>JSON.stringify(x).includes('致命')));}
  }assert.ok(variants.some(o=>o.fighters[0].stages.atk===1));if(soul===956)assert.ok(variants.some(o=>o.fighters[1].stages.atk===-1));
 }
 const s=make({moveId:10068,index:null},{soul:1710,omit:true});s.fighters[0].stages.def=1;const o=turn(s,900030);assert.equal(o.fighters[0].stages.atk,0);assert.equal(o.fighters[1].stages.atk,-1);assert.equal(9000-o.fighters[1].hp,o.fighters[0].lastAttackDamage);
 const status=turn(make({moveId:10068,index:null},{soul:1710,omit:true}),900031);assert.equal(status.fighters[1].hp,9000);
});

test('3670 两版魂印回合末比较等级，圣辉之羽次回合免弱免异常并将攻击转治疗',()=>{
 for(const soul of [956,1710]){
  const s=make({moveId:10068,index:null},{soul,omit:true,opponentMove:20164,hp:5000,seed:0});
  const first=turn(s,900031,900042);assert.equal(first.fighters[0].effects['圣辉之羽'].start,2);assert.equal(first.fighters[0].effects['圣辉之羽'].end,2);
  const hit=turn(first,900031,900040);assert.ok(hit.fighters[0].hp>first.fighters[0].hp);assert.equal(hit.fighters[1].lastAttackDamage,0);
  assert.equal(hit.fighters[0].effects['圣辉之羽'],undefined);
  const lethal=structuredClone(first);lethal.fighters[0].hp=1;lethal.fighters[1].stats.spa=999999;const saved=turn(lethal,900031,900040);assert.equal(saved.fighters[0].hp,9000);assert.equal(saved.finished,false);
 }
});

test('3670 圣雷华冠只在无等级升高分支授予，攻击先制和异常增伤可到期',()=>{
 let s=make({moveId:10068,index:null},{soul:1710,omit:true,aStats:{spe:1},bStats:{spe:999}});s=turn(s,900031);assert.equal(s.fighters[0].effects['圣雷华冠'].start,2);
 const no=structuredClone(s);delete no.fighters[0].effects['圣雷华冠'];const plain=turn(no,900030,900040),crowned=turn(s,900030,900040);assert.equal(plain.turns[1].first,1);assert.equal(crowned.turns[1].first,0);
 const ail=structuredClone(s);ail.fighters[1].ailments['魇昧']=3;const out=turn(ail,900030);const ref=turn(s,900030);assert.ok(out.fighters[0].lastAttackDamage>=ref.fighters[0].lastAttackDamage*1.5-1);assert.ok(out.fighters[0].lastAttackDamage<=ref.fighters[0].lastAttackDamage*1.5+1);
 const status=turn(s,900031);assert.equal(status.turns[1].first,1);
 const original=turn(make({moveId:10068,index:null},{soul:956,omit:true}),900031);assert.equal(original.fighters[0].effects['圣雷华冠'],undefined);
});

test('3670 1957圣辉回复与禁疗，1958圣雷翻倍仅限有效窗口',()=>{
 for(const id of [1957,1958]){
  const x=e(id),s=make(x,{hp:1000});timer(s,0,id===1957?'圣辉之羽':'圣雷华冠',{},1,1);const o=turn(s);
  if(id===1957){assert.equal(o.fighters[0].hp,9000);const ban=structuredClone(s);timer(ban,0,'技能禁疗');assert.equal(turn(ban).fighters[0].hp,1000);assert.equal(turn(make(x,{hp:1000})).fighters[0].hp,1000);}
  else{const ref=turn(make(x));assert.ok(o.fighters[0].lastAttackDamage>=2*ref.fighters[0].lastAttackDamage);assert.ok(o.fighters[0].lastAttackDamage<=2*ref.fighters[0].lastAttackDamage+1);}
  const expired=make(x,{hp:1000});timer(expired,0,id===1957?'圣辉之羽':'圣雷华冠',{},0,0);const ex=turn(expired),normal=turn(make(x,{hp:1000}));assert.equal(ex.fighters[0].hp,normal.fighters[0].hp);assert.equal(ex.fighters[1].hp,normal.fighters[1].hp);
 }
});

test('3670 956未击败次回合使用属性或攻击后固伤，天敌翻倍且到期',()=>{
 for(const x of pick(956)){
  const s=make(x);let o=turn(s);assert.equal(o.fighters[0].effects['用招天敌固伤'].start,2);assert.equal(o.fighters[0].effects['用招天敌固伤'].end,2);
  for(const type of ['普通','电'])for(const move of [900030,900031]){const ready=structuredClone(o);ready.fighters[1].type=type;const out=turn(ready,move);assert.equal(ready.fighters[1].hp-out.fighters[1].hp-(move===900030?out.fighters[0].lastAttackDamage:0),type==='电'?600:300);const again=turn(out,900031);assert.equal(again.fighters[1].hp,out.fighters[1].hp);}
  const defeated=turn(make(x,{targetHp:1}));assert.equal(defeated.fighters[0].effects['用招天敌固伤'],undefined);
  const controlled=structuredClone(o);controlled.fighters[0].ailments['疲惫']=2;assert.equal(turn(controlled,900031).fighters[1].hp,o.fighters[1].hp);
 }
});

test('3670 圣辉免异常与免弱只在窗口内，负等级提高也触发羽翼',()=>{
 for(const soul of [956,1710])for(const opponentMove of [20768,26265]){
  const s=make({moveId:10068,index:null},{soul,omit:true,opponentMove,seed:0});timer(s,0,'圣辉之羽',{},1,1);const o=turn(s,900031,900042);assert.equal(o.fighters[0].stages.acc,1);assert.equal(o.fighters[0].ailments['麻痹'],undefined);
  const no=make({moveId:10068,index:null},{soul,omit:true,opponentMove,seed:0});const n=turn(no,900031,900042);if(opponentMove===20768)assert.equal(n.fighters[0].stages.acc,(1)-2);
 }
 const s=make({moveId:10068,index:null},{soul:1710,omit:true,opponentMove:20164});s.fighters[1].stages.spe=-2;const o=turn(s,900031,900042);assert.equal(o.fighters[1].stages.spe,-1);assert.ok(o.fighters[0].effects['圣辉之羽']);
});

test('3670 基础28招伤害、PP、零PP拒绝、封招与控制逐招验证',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},s=make(x,{omit:true}),o=turn(s);assert.equal(o.fighters[0].pp[key(m.id)],m.pp-1,String(m.id));if(m.kind==='status'||m.power===0)assert.equal(o.fighters[1].hp,9000);else{const base=Math.floor(Math.floor(42*m.power*180/300)/50)+2;const stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*.89),String(m.id));}
 const zero=make(x,{omit:true});zero.fighters[0].pp[key(m.id)]=0;assert.throws(()=>turn(zero));
 const no=make(x,{omit:true});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,9000);assert.equal(n.fighters[0].pp[key(m.id)],m.pp-1);
 const control=make(x,{omit:true});control.fighters[0].ailments['疲惫']=2;const co=turn(control);assert.equal(co.fighters[0].pp[key(m.id)],m.pp);assert.equal(co.fighters[1].hp,9000);
 }
});

test('3670 基础28招先制、命中失败、必暴伤害及本系属性按来源执行',()=>{
 for(const m of source.moves){const x={moveId:m.id,index:null},slow=make(x,{omit:true,aStats:{spe:1},bStats:{spe:999}});assert.equal(turn(slow).turns[0].first,m.priority>0?0:1,String(m.id));
 const s=make(x,{omit:true}),plain=turn(s);timer(s,0,'必定暴击');const crit=turn(s);if(m.kind!=='status'&&m.power>0){const n=plain.fighters[0].lastAttackDamage;assert.ok(crit.fighters[0].lastAttackDamage>=n*2&&crit.fighters[0].lastAttackDamage<=n*2+1,String(m.id));}
 if(!m.alwaysHit){let miss=false;for(let seed=0;seed<40&&!miss;seed++){const no=make(x,{omit:true,hit:false,seed});no.fighters[0].stages.acc=-6;const out=turn(no);if(out.turns[0].events.some(ev=>JSON.stringify(ev).includes('未命中'))){assert.equal(out.fighters[1].hp,9000);assert.equal(out.fighters[0].pp[key(m.id)],m.pp-1);miss=true;}}assert.ok(miss,String(m.id));}
 }
});

test('3670 4和5有序实例能力变化、概率失败、六级截断和免弱',()=>{
 for(const x of [...pick(4),...pick(5)]){const side=x.id===4?0:1,k=keys[x.params[0]],n=x.params[2];let success,failed;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[side].stages[k]===n)success={s,o};if(o.fighters[side].stages[k]===0)failed=o;}assert.ok(success);assert.equal(success.o.fighters[side].stages[k],n);if(x.params[1]<100)assert.ok(failed);
 const cap=structuredClone(success.s);cap.fighters[side].stages[k]=n>0?6:-6;assert.equal(turn(cap).fighters[side].stages[k],n>0?6:-6);
 if(side===1){const im=structuredClone(success.s);timer(im,1,'免弱');assert.equal(turn(im).fighters[side].stages[k],0);}
 const no=structuredClone(success.s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[side].stages[k],0);
 }
});

test('3670 12和14异常概率、免疫反弹、持续到期和真实灼冻扣血',()=>{
 for(const x of [...pick(12),...pick(14)]){const status=x.id===12?'烧伤':'冻伤';let yes,no;for(let seed=0;seed<60;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[1].ailments[status]>=1)yes={s,o};else if(o.fighters[1].hp===9000-o.fighters[0].lastAttackDamage)no=o;}assert.ok(yes&&no);assert.ok(9000-yes.o.fighters[1].hp>yes.o.fighters[0].lastAttackDamage);
 const im=structuredClone(yes.s);timer(im,1,'免异常');assert.equal(turn(im).fighters[1].ailments[status],undefined);
 const refl=structuredClone(yes.s);timer(refl,1,'reflect');const ro=turn(refl);assert.equal(ro.fighters[1].ailments[status],undefined);assert.ok(ro.fighters[0].hp<9000);
 let end=structuredClone(yes.o);for(let r=0;r<4;r++)end=turn(end,900031);assert.equal(end.fighters[1].ailments[status],undefined);
 }
});

test('3670 3清弱与907及1232反转分支、保留正等级、清PP和免弱交互',()=>{
 for(const id of [3,907,1232]){const x=e(id),s=make(x);s.fighters[0].stages.atk=-2;s.fighters[0].stages.acc=-6;s.fighters[0].stages.def=3;const o=turn(s);assert.equal(o.fighters[0].stages.atk,id===3?0:2);assert.equal(o.fighters[0].stages.acc,id===3?0:6);assert.equal(o.fighters[0].stages.def,3);if(id===907)assert.equal(Object.values(o.fighters[1].pp).filter(n=>n===0).length,1);if(id===1232){assert.equal(o.fighters[1].stages.atk,-2);assert.equal(o.fighters[1].stages.acc,-6);const im=structuredClone(s);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);}
 const empty=turn(make(x));assert.equal(Object.values(empty.fighters[1].pp).filter(n=>n===0).length,0);assert.equal(empty.fighters[0].stages.atk,0);const no=structuredClone(s);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].stages.atk,-2);
 }
});

test('3670 962和1014强化条件、半血严格边界、禁强化与六级上限',()=>{
 for(const id of [962,1014]){const x=e(id);for(const [hp,boost,expected]of id===962?[[4500,0,2],[4500,1,1]]:[[4501,0,2],[4500,0,1],[4499,0,1]]){const s=make(x,{hp});s.fighters[0].stages.atk=boost;const o=turn(s);assert.equal(o.fighters[0].stages.spa,expected);assert.equal(o.fighters[0].stages.atk,boost+expected);}
 const cap=make(x);keys.forEach(k=>cap.fighters[0].stages[k]=6);assert.deepEqual(turn(cap).fighters[0].stages,cap.fighters[0].stages);
 const no=make(x);timer(no,0,'禁强化');assert.deepEqual(turn(no).fighters[0].stages,no.fighters[0].stages);const blocked=make(x);timer(blocked,0,'skillBlock');assert.deepEqual(turn(blocked).fighters[0].stages,blocked.fighters[0].stages);
 }
});

test('3670 40先手双威力、195忽略双防正等级、494忽略速度及防御强化',()=>{
 const x=e(40);const fast=turn(make(x)),slow=turn(make(x,{aStats:{spe:1},bStats:{spe:999}}));assert.ok(fast.fighters[0].lastAttackDamage>slow.fighters[0].lastAttackDamage);assert.equal(fast.turns[0].first,0);assert.equal(slow.turns[0].first,1);
 for(const id of [195,494])for(const x of pick(id)){const s=make(x),base=turn(s);s.fighters[1].stages.spd=6;s.fighters[1].stages.def=6;assert.equal(turn(s).fighters[0].lastAttackDamage,base.fighters[0].lastAttackDamage);s.fighters[1].stages.spd=-1;assert.ok(turn(s).fighters[0].lastAttackDamage>base.fighters[0].lastAttackDamage);const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);if(id===494){const speed=make(x,{aStats:{spe:200},bStats:{spe:100}});speed.fighters[1].stages.spe=6;assert.equal(turn(speed).turns[0].first,0);assert.equal(turn(speed,900031).turns[0].first,1);}}
});

test('3670 50物理减伤、127全伤害减半及54输出削弱的真实攻击与期限',()=>{
 for(const id of [50,127,54])for(const physical of [true,false]){const x=e(id),s=make(x,{bPhysical:physical}),active=turn(s);const out=turn(active,900031,900040),ref=structuredClone(active);delete ref.fighters[0].effects['分类攻击减伤'];delete ref.fighters[0].effects['全伤害减半'];delete ref.fighters[1].effects['伤害输出降低'];const normal=turn(ref,900031,900040);const n=active.fighters[0].hp-normal.fighters[0].hp,d=active.fighters[0].hp-out.fighters[0].hp;if(id!==50||physical)assert.equal(d,Math.floor(n/2));else assert.equal(d,n);
 let expired=active;const duration=id===50?5:2;for(let i=2;i<=duration;i++)expired=turn(expired,900031);const er=turn(expired,900031,900040),rr=structuredClone(expired);delete rr.fighters[0].effects['分类攻击减伤'];delete rr.fighters[0].effects['全伤害减半'];delete rr.fighters[1].effects['伤害输出降低'];assert.equal(er.fighters[0].hp,turn(rr,900031,900040).fighters[0].hp);
 const blocked=make(x);timer(blocked,0,'skillBlock');const b=turn(blocked);assert.equal(b.fighters[0].effects['分类攻击减伤'],undefined);assert.equal(b.fighters[0].effects['全伤害减半'],undefined);assert.equal(b.fighters[1].effects['伤害输出降低'],undefined);
 }
});

test('3670 47免弱及48和191免疫反弹按真实攻击施加与到期',()=>{
 for(const id of [47,48,191])for(const x of pick(id)){
 const s=make(x,{opponentMove:id===47?20768:28278});let o=turn(s,undefined,900042);if(id===47)assert.equal(o.fighters[0].stages.acc,0);else assert.equal(o.fighters[0].ailments['麻痹'],undefined);
 const k=id===47?'免弱':id===48?'免异常':'reflect';assert.equal(o.fighters[0].effects[k].end,x.params[0]);
 const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects[k],undefined);
 for(let r=2;r<=x.params[0];r++)o=turn(o,900031);assert.equal(o.fighters[0].effects[k],undefined);
 }
});

test('3670 1003与936控制成功失败和免疫补偿、弱化与属性封锁',()=>{
 for(const id of [1003,936])for(const x of pick(id)){const status=id===1003?'害怕':'麻痹';let yes,no;for(let seed=0;seed<60;seed++){const s=make(x,{seed}),o=turn(s);if(o.fighters[1].ailments[status]>=1)yes=o;else if(id===1003?o.fighters[1].stages.atk===-1:o.fighters[1].effects.statusBlock)no=o;}assert.ok(yes);assert.ok(yes.fighters[1].ailments[status]>=1);
 if(x.params[0]<100){assert.ok(no);if(id===1003)assert.equal(no.fighters[1].stages.atk,-1);else assert.ok(no.fighters[1].effects.statusBlock);}
 const im=make(x);timer(im,1,'免异常');const io=turn(im);assert.equal(io.fighters[1].ailments[status],undefined);if(id===1003){assert.equal(io.fighters[1].stages.atk,-1);timer(im,1,'免弱');assert.equal(turn(im).fighters[1].stages.atk,0);}else{assert.equal(io.fighters[1].effects.statusBlock.end,2);const out=turn(io,900031);assert.equal(out.fighters[1].pp[key(900041)],97);assert.equal(out.fighters[1].effects.statusBlock,undefined);}
 const blocked=make(x);timer(blocked,0,'skillBlock');const b=turn(blocked);assert.equal(b.fighters[1].stages.atk,0);assert.equal(b.fighters[1].effects.statusBlock,undefined);assert.equal(b.fighters[1].ailments[status],undefined);
 }
});

test('3670 1010消强后与693及776后续增伤、失败保护和到期',()=>{
 for(const id of [1010,693,776]){const x=e(id),s=make(x);if(id===1010)s.fighters[1].stages.atk=2;let o=turn(s);const k=id===776?'doubleDamage':'id913';assert.equal(o.fighters[0].effects[k].start,2);assert.equal(o.fighters[0].effects[k].end,3);if(id===1010)assert.equal(o.fighters[1].stages.atk,0);
 for(let r=2;r<=3;r++){const ref=structuredClone(o);delete ref.fighters[0].effects[k];const normal=turn(ref,900030);o=turn(o,900030);const n=normal.fighters[0].lastAttackDamage;assert.ok(o.fighters[0].lastAttackDamage>=2*n&&o.fighters[0].lastAttackDamage<=2*n+1);}
 const expired=turn(o,900030);assert.equal(expired.fighters[0].effects[k],undefined);
 const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects[k],undefined);
 if(id===1010){assert.equal(turn(make(x)).fighters[0].effects[k],undefined);const protectedTarget=structuredClone(s);timer(protectedTarget,1,'幽蝶强化保护');const p=turn(protectedTarget);assert.equal(p.fighters[1].stages.atk,2);assert.equal(p.fighters[0].effects[k],undefined);}
 }
});

test('3670 843下两回合先制改变行动顺序而施放回合与到期无加成',()=>{
 for(const x of pick(843)){const s=make(x,{aStats:{spe:1},bStats:{spe:999}});let o=turn(s);assert.equal(o.turns[0].first,1);assert.equal(o.fighters[0].effects.id984.amount,2);for(let r=2;r<=4;r++){o=turn(o,900031);assert.equal(o.turns[r-1].first,r<=3?0:1);}
 const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[0].effects.id984,undefined);
 }
});

test('3670 456斩杀严格阈值和447最低伤害仍受攻击免疫',()=>{
 const x=e(456);for(const hp of [299,300,301]){const s=make(x,{targetHp:hp});timer(s,1,'攻击伤害免疫');const o=turn(s);assert.equal(o.fighters[1].hp,hp<300?0:hp);}
 const y=e(447),s=make(y),o=turn(s);assert.equal(o.fighters[0].lastAttackDamage,300);assert.equal(o.fighters[1].hp,8700);
 const im=make(y);timer(im,1,'攻击伤害免疫');assert.equal(turn(im).fighters[1].hp,9000);
 for(const z of [x,y]){const no=make(z);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);}
});

test('3670 93概率固定伤害成败与护罩消费，1131强化前后随机区间',()=>{
 const x=e(93);let yes,no;for(let seed=0;seed<80;seed++){const s=make(x,{seed}),o=turn(s),extra=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;if(extra===500)yes={s,o};else{assert.equal(extra,0);no=o;}}assert.ok(yes&&no);const shield=structuredClone(yes.s);shield.fighters[1].suitState.barrier=600;const sh=turn(shield);assert.equal(sh.fighters[1].suitState.barrier,100);assert.equal(9000-sh.fighters[1].hp,sh.fighters[0].lastAttackDamage);
 const y=e(1131);for(const boost of [false,true]){const seen=new Set();for(let seed=0;seed<1500&&seen.size<101;seed++){const s=make(y,{seed});if(boost)s.fighters[0].stages.atk=1;const o=turn(s),extra=9000-o.fighters[1].hp-o.fighters[0].lastAttackDamage;assert.ok(extra>=(boost?250:150)&&extra<=(boost?350:250));seen.add(extra);}assert.equal(seen.size,101);}
 for(const z of [x,y]){const no=make(z);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);}
});

test('3670 532和1065持续回复粉伤、半血边界、满血禁疗与到期',()=>{
 for(const id of [532,1065]){const x=e(id);for(const hp of [1000,4499,4500,8999,9000]){const s=make(x,{hp}),o=turn(s),nominal=id===1065&&hp<4500?6000:3000,recovered=Math.min(9000-hp,nominal);assert.equal(o.fighters[0].hp,hp+recovered);assert.equal(o.fighters[1].hp,9000-recovered);}
 let s=make(x,{hp:1000});s=turn(s);for(let r=2;r<=5;r++){s.fighters[0].hp=1000;s.fighters[1].hp=9000;s=turn(s,900031);assert.equal(s.fighters[0].hp,r<=4?(id===1065?7000:4000):1000);assert.equal(s.fighters[1].hp,r<=4?(id===1065?3000:6000):9000);}
 const ban=make(x,{hp:1000});timer(ban,0,'技能禁疗');const b=turn(ban);assert.equal(b.fighters[0].hp,1000);assert.equal(b.fighters[1].hp,9000);
 const no=make(x,{hp:1000});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[0].hp,1000);assert.equal(n.fighters[1].hp,9000);
 }
});

test('3670 604连续随机威力增长、上限、换招重置及封招',()=>{
 const random=seed=>{let t=(seed+0x6D2B79F5)>>>0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
 for(const x of pick(604)){for(const uses of [0,1,10])for(let seed=0;seed<12;seed++){const s=make(x,{seed});s.fighters[0].previousMoveId=key(x.moveId);s.fighters[0].consecutiveUses=uses;const o=turn(s),m=source.moves.find(m=>m.id===x.moveId),power=Math.min(x.params[3],x.params[0]+Math.floor(random(seed)*(x.params[1]-x.params[0]+1))+uses*x.params[2]);const roll=85+Math.floor(random((seed+0x6D2B79F5)>>>0)*16),base=Math.floor(Math.floor(42*power*180/300)/50)+2,stab=require('./helpers/source-stab.cjs')(m.type,s.fighters[0].type,s.typeChart);assert.equal(9000-o.fighters[1].hp,Math.floor(base*stab*E.typeEffectiveness(m.type,s.fighters[1].type,s.typeChart)*roll/100));}
 let s=turn(make(x));s=turn(s,900031);s.rng=0;const o=turn(s),ref=turn(make(x));assert.equal(o.fighters[0].consecutiveUses,1);assert.equal(o.fighters[0].lastAttackDamage,ref.fighters[0].lastAttackDamage);const no=make(x);timer(no,0,'skillBlock');assert.equal(turn(no).fighters[1].hp,9000);
 }
});

test('3670 1138及889消回合后异常分支、无效果和保护失败、免疫消耗',()=>{
 for(const id of [1138,889]){const x=e(id);let blind,burn;for(let seed=0;seed<40;seed++){const s=make(x,{seed});timer(s,1,'doubleDamage');const o=turn(s);assert.equal(o.fighters[1].effects.doubleDamage,undefined);if(o.fighters[1].ailments['失明']>=1)blind={s,o};if(o.fighters[1].ailments['焚烬']>=1)burn={s,o};}assert.ok(burn);if(id===1138)assert.ok(blind);
 const plain=turn(make(x));assert.deepEqual(plain.fighters[1].ailments,{});const protectedTarget=make(x);timer(protectedTarget,1,'doubleDamage');timer(protectedTarget,1,'protect');const po=turn(protectedTarget);assert.ok(po.fighters[1].effects.doubleDamage);assert.deepEqual(po.fighters[1].ailments,{});
 const im=structuredClone(id===1138?blind.s:burn.s);im.fighters[1].counts.immune=1;const io=turn(im);assert.equal(io.fighters[1].counts.immune,0);if(id===1138)assert.ok(io.fighters[1].ailments['焚烬']>=1);else assert.equal(io.fighters[1].ailments['焚烬'],undefined);
 }
});

test('3670 1960当前击败授予强化保护，未击败或未行动不授予',()=>{
 const x=e(1960),s=make(x,{targetHp:1}),o=turn(s);assert.equal(o.fighters[1].hp,0);assert.equal(o.fighters[0].effects['幽蝶强化保护'].start,1);assert.equal(o.fighters[0].effects['幽蝶强化保护'].end,3);assert.equal(turn(make(x)).fighters[0].effects['幽蝶强化保护'],undefined);
 const no=make(x,{targetHp:1});timer(no,0,'skillBlock');const n=turn(no);assert.equal(n.fighters[1].hp,1);assert.equal(n.fighters[0].effects['幽蝶强化保护'],undefined);
 // Verify the shared protection against an actual opponent dispel, without
 // pretending the single-opponent battle can continue after its opponent dies.
 const protectedState=make({moveId:10068,index:null},{omit:true,opponentMove:32320});protectedState.fighters[0].stages.atk=3;protectedState.fighters[0].effects['幽蝶强化保护']=structuredClone(o.fighters[0].effects['幽蝶强化保护']);const p=turn(protectedState,900031,900042);assert.equal(p.fighters[0].stages.atk,3);assert.equal(p.fighters[1].effects.doubleDamage,undefined);
});

test('3670 191真实反弹麻痹及519被对手消回合后停止回复',()=>{
 for(const x of pick(191)){const s=make(x,{seed:1,opponentMove:28278,opponentEffectId:936}),o=turn(s,undefined,900042);assert.equal(o.fighters[0].ailments['麻痹'],undefined);assert.ok(o.fighters[1].ailments['麻痹']>=1);assert.equal(o.fighters[1].pp[key(900042)],4);}
 const x=e(519),s=make(x,{hp:1000,opponentMove:36537,opponentEffectId:889});s.fighters[0].stages.atk=1;const o=turn(s,undefined,900042);assert.equal(o.fighters[0].effects['用招按能力种类回复'],undefined);o.fighters[0].hp=1000;o.fighters[0].ailments={};const next=turn(o,900031);assert.equal(next.fighters[0].hp,1000);
});

test('3670 全部技能与两魂印版本保持来源原文参数和属性字段',()=>{
 const records=require('../research/3670-source-manifest.json').records,raw=(kind,id)=>records.find(x=>x.url==='https://api.seerapi.com/v1/'+kind+'/'+id).data;
 for(const m of source.moves){const r=raw('skill',m.id);assert.equal(m.hash,r.hash);assert.equal(m.name,r.name);assert.equal(m.power,r.power);assert.equal(m.pp,r.max_pp);assert.equal(m.accuracy,r.accuracy);assert.equal(m.priority,r.priority);assert.equal(m.sourceTargetCount,r.atk_num);assert.deepEqual(m.effectInstances,r.skill_effect.map(x=>({id:x.effect.id,args:x.args,description:x.info})));}
 for(const soul of source.souls){const r=raw('soulmark',soul.id);assert.equal(soul.hash,r.hash);assert.equal(soul.description,r.desc);assert.deepEqual(soul.args,r.effect.effect_args);}
 const local=require('../data/species/3670.json').snapshot;for(const soulId of [956,1710]){const view={...structuredClone(local),selectedSoulId:soulId};assert.deepEqual(E.WIKI.assess(view).issues,[]);const version=E.WIKI.availableMoves(view);assert.equal(version.filter(m=>m.fifth).length,1);assert.ok(version.some(m=>m.id===(soulId===956?32323:36537)));}
});

{const test=require('node:test').test,assert=require('node:assert/strict');test('3670 1065公共修复真实来源成功失败边界交互重新验证',()=>{const o=require('./helpers/assert-1065-atomic-heal.cjs')(3670);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3670 532原子回复或无能力等级面板百分比公共修复',()=>{const o=require('./helpers/assert-4208-public-rules.cjs')(3670,532);assert.equal(o.fighters[0].hp,8960);});}

{const test=require('node:test').test,assert=require('node:assert/strict');test('3670 32321效果907公共反转事件或PP保护真实回归',()=>{const o=require('./helpers/assert-656-907-protection.cjs')(3670,907,32321);assert.ok(o.fighters[0].hp>0);});}
