const fs=require('fs'),assert=require('assert/strict');
const files=['dist/range-effects.js','dist/souls.js'];fs.writeFileSync('research/3705-runtime-before.json',JSON.stringify(Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')])),null,2));
let s=fs.readFileSync(files[0],'utf8');
function change(a,b){assert.ok(s.includes(a),a);s=s.replace(a,b);}
change("add(1372,'afterHit',(c,p)=>c.timed(c.t,'艾里克反应',p[0],{chance:p[1]/100,ailment:'害怕'}),[[1,10],[0,100],[0,20]]);","add(1372,'afterHit',(c,p)=>c.timed(c.a,'对手用攻异常或清回合',p[0],{chance:p[1],ailment:ailments[p[2]]}),[turns,pct,[0,0]]);");
change("add(1376,'afterHit',(c,p)=>{if(c.t.hp>0&&(c.markStatusEffect?.(),c.random())<p[1]/100)c.ailment(c.t,'害怕',c.a);else if(c.t.hp>0)c.hurt(c.t,c.t.stats.maxHp/(p[3]||1),c.m.name+'吸取','percent');},[[1,10],[0,100],[0,20],[1,9999]]);","add(1376,'afterHit',(c,p)=>c.timed(c.a,'自身用攻异常或吸取',p[0],{chance:p[1],ailment:ailments[p[2]],denominator:p[3]}),[turns,pct,[6,6],[1,9999]]);");
change("add(1539,'afterHit',(c,p)=>{if(c.dealt>p[0]&&(c.markStatusEffect?.(),c.random())<p[1]/100)c.ailment(c.t,(['害怕','麻痹','睡眠'][p[2]]??'害怕'),c.a);else c.clear(c.t);},[[0,9999],[0,100],[0,20]]);","add(1539,'afterAttack',(c,p)=>{if(!(c.dealt>p[0]&&statusRoll(c,p[1])&&c.ailment(c.t,ailments[p[2]],c.a)))c.clear(c.t);},[[0,9999],pct,[0,0]]);");
change("add(1425,'afterHit',(c,p)=>{if(c.dealt<p[0]){if(p[1]===0)c.stage(c.a,1);else c.heal(c.a,p[1]);}},[[0,9999],[0,9999]]);","metadata[1425]={info:'造成的伤害低于{0}则自身{1}',args_num:7};\nadd(1425,'afterAttack',(c,p)=>{if(c.dealt<p[0])p.slice(1).forEach((n,i)=>{if(n)c.stage(c.a,n,[stats[i]]);});},[[0,99999],stage,stage,stage,stage,stage,stage]);");
fs.writeFileSync(files[0],s);
s=fs.readFileSync(files[1],'utf8');const anchor="      // 1329 observes a use even on a miss. Control preventing the use exits earlier.";assert.ok(s.includes(anchor));s=s.replace(anchor,`      // 持续用攻分支：复用公共异常判定、实际吸取与技能回复，未行动在此阶段之前退出。
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&on(a,'自身用攻异常或吸取')){const e=a.effects['自身用攻异常或吸取'];statusRules.markExecution(a,r);if(!((e.chance>=100||e.chance>0&&rng(s)<e.chance/100)&&ailment(t,e.ailment,a))){const n=inflict(a,t,t.stats.maxHp/e.denominator,'用攻异常未触发吸取','percent');heal(a,n,'用攻异常未触发吸取','skill');}}
      if(a.hp>0&&t.hp>0&&m.kind!=='status'&&on(t,'对手用攻异常或清回合')){const e=t.effects['对手用攻异常或清回合'];if(!((e.chance>=100||e.chance>0&&rng(s)<e.chance/100)&&ailment(a,e.ailment,t)))clear(a);}
`+anchor);fs.writeFileSync(files[1],s);
let h=fs.readFileSync('tests/helpers/3699-battle.cjs','utf8').replaceAll('3699','3705').replace('moveId:10200','moveId:10157');fs.writeFileSync('tests/helpers/3705-battle.cjs',h);
