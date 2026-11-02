const fs=require('fs'),assert=require('assert/strict');const file='dist/range-souls.js',s=fs.readFileSync(file,'utf8');fs.writeFileSync('research/3705-range-souls-before.txt',s);
const old=s.split('\n').find(x=>x.startsWith('registry[1781]='));assert.ok(old);
const next=`registry[1781]={name:'守护者·强化',sourceHash:'b323d8d',deferred:['己方每阵亡1只精灵，千灭雷翼的前1条无视触发条件'],traits:{},hooks:{
 roundStart(c){const s=c.a.soulState;s.thunderWings={round:c.round,shield:c.a.hp<c.t.hp,boost:positive(c.a)>0,drop:Object.values(c.t.ailments).some(end=>end>=c.round),fear:Object.values(c.t.stages).some(n=>n<0)};if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'必定暴击',1,{});},
 beforeUse(c){const w=c.a.soulState.thunderWings;if(w?.round!==c.round)return;if(w.shield)c.a.suitState.shield+=300;if(w.boost)c.stage(c.a,1);if(w.drop&&c.t.hp>0)c.stage(c.t,-1);},
 afterUse(c){if(c.a.side===c.first&&c.t.hp>0){const n=c.hurt(c.t,c.a.stats.spe*.5,'守护者强化魂印','percent');c.heal(c.a,n,'守护者强化魂印');}else if(c.a.side!==c.first)c.timed(c.a,'id984',1,{amount:2},c.round+1);if(c.t.hp>0&&c.a.soulState.thunderWings?.round===c.round&&c.a.soulState.thunderWings.fear)c.ailment(c.t,'害怕',c.a);}
}};`;
fs.writeFileSync(file,s.replace(old,next));
