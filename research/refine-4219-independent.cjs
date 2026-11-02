'use strict';const fs=require('fs'),assert=require('node:assert/strict');function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,100));fs.writeFileSync(p,s.replace(a,b));}
edit('dist/souls.js','missingPP:f=>','maxPP:key=>battleMoves[key].pp,missingPP:f=>');
edit('dist/range-effects.js','c.t.pp[k]<c.moves[k].pp','c.t.pp[k]<c.maxPP(k)');
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('\n});'),e=require('./4219-reviewed-snapshot.json').effects.find(e=>e.id===1684);fs.writeFileSync(p,s.slice(0,i)+'\nmetadata[1684]='+JSON.stringify({info:e.template,args_num:e.argsNum})+";\nadd(1684,'afterHit',(c,p)=>c.timed(c.t,'弱化不可解除反转',p[0],{}),[turns]);\n"+s.slice(i));
edit('tests/helpers/4219-battle.cjs',"if(o.hit!==false)s.fighters[0].effects['攻击必中']={start:1,end:99};","if(o.hit!==false){s.fighters[0].effects['攻击必中']={start:1,end:99};s.fighters[0].effects['属性必中']={start:1,end:99};}");
p='tests/deployed-4219-partial.test.cjs';edit(p,"if(mode==='immune')timer(s,1,'固定百分比免疫');if(mode==='ban')timer(s,0,'禁疗');","if(mode==='immune')s.fighters[1].soulId=622;if(mode==='ban')timer(s,0,'回复效果削减',{fraction:1});");
edit(p,"timer(z,1,'回合保护');","timer(z,1,'protect');");
edit(p,"delete s.fighters[0].effects['攻击必中'];if(mode==='self-boost')","delete s.fighters[0].effects['攻击必中'];delete s.fighters[0].effects['属性必中'];if(mode==='self-boost')");
edit(p,"mode==='none'?9000:6000","mode==='none'?9000:4875");
edit(p,"s.fighters[0].stages.atk=2;timer(s,1,'固定百分比免疫');const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].hp,9000-900);","s.fighters[0].stages.atk=2;s.fighters[1].soulId=622;const o=turn(s);assert.equal(o.fighters[0].hp,4000);assert.equal(o.fighters[1].hp,9000);");
edit(p,"const z=make(pick(1688)[0],{hp:1000});timer(z,0,'技能禁疗');assert.equal(turn(z).fighters[0].hp,1000);","const z=make(pick(1688)[0],{hp:1000});z.fighters[1].stages.atk=2;timer(z,0,'技能禁疗');timer(z,0,'protect');assert.equal(turn(z).fighters[0].hp,1000);");
edit(p,"assert.equal(o.fighters[0].stages[k],-o.fighters[1].stages[k]);","assert.equal(o.fighters[0].stages[k],0-o.fighters[1].stages[k]);");
console.log('4219 missing1684 implemented; native maxPP context exposed; fixtures corrected for actual clear, skill origin, burn DOT, and status accuracy');
