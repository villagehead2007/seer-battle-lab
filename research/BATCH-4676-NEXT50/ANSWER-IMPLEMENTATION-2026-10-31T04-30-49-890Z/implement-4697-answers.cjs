const fs=require('fs'),A=__dirname;
function edit(f,fn){fs.copyFileSync(f,A+'/4697-before-'+f.split('/').pop(),fs.constants.COPYFILE_EXCL);fs.writeFileSync(f,fn(fs.readFileSync(f,'utf8')));}
edit('dist/range-souls.js',s=>s.replace(/registry\[1898\]=[^\n]+/,`registry[1898]={name:'华光之翼·杰洛恩',sourceHash:'4eb214da',partial:false,unimplemented:[],traits:{skillPriority:f=>f.soulState.priority1898Round===f.soulState.calculationRound?1:0},hooks:{afterHit(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='item')return;const existing=Object.keys(c.t.ailments).filter(k=>c.t.ailments[k]>=c.round),before=c.a.soulState.ppBeforeBase4697,full=before?.round===c.round&&before.move===c.m.id&&before.value===c.m.pp;if(existing.length&&full){const duration=existing.reduce((n,k)=>n+c.t.ailments[k]-c.round+1,0);if(c.ailment(c.t,'睡眠',c.a,false,false,duration))for(const k of existing)if(k!=='睡眠')c.clearAilment(c.t,k);return;}c.ailment(c.t,c.m.kind==='status'?'失神':'失明',c.a);},afterUse(c){if(c.actualUsed&&c.m.kind!=='item'&&c.a.hp>0&&c.a.soulState.fixed1898Round===c.round)c.hurt(c.t,350,'杰洛恩下回合用招固定伤害','fixed');},roundEnd(c){if(c.a.hp<=0)return;const before=c.a.hp,half=c.a.stats.maxHp/2;c.heal(c.a,350,'杰洛恩回合末回复');if(before<half)c.a.soulState.priority1898Round=c.round+1;if(before>half)c.a.soulState.fixed1898Round=c.round+1;}}};`));
edit('dist/range-effects.js',s=>{
 s=s.replace(/let count=post;if\(pre!==post\)\{const q=c.a.soulState.ppCount1863;[^}]+\}c.hits=p\[0\]\+p\[1\]\*count;/,"c.hits=p[0]+p[1]*pre;");
 s=s.replace(/const turns=c.a.soulState.duration4174697;if\(!\[2,3\].includes\(turns\)\)throw Error\('[^']+'\);/,"const turns=3;");
 s=s.replace(/const policy=c.a.soulState.failure1294;if\(!\['any-failed','all-failed','clear-only'\].includes\(policy\)\)throw Error\('[^']+'\);fallback=policy==='any-failed'\|\|policy==='all-failed'&&ok===0;/,"fallback=true;");
 s=s.replace(/function damageHeal4697\([^\n]+/,"function damageHeal4697(c,fraction,label){c.heal(c.a,(c.settledDamage??c.dealt)*fraction,label);}");
 s=s.replace(/const basis=c.a.soulState.heal4384697;[^}]+c.m.name\+'明确基数候选回复'\);/,"if(roll(c,p[0]))c.heal(c.a,c.a.stats.maxHp/p[1],c.m.name+'最大体力回复');");
 return s;
});
edit('dist/souls.js',s=>{
 const old="if(f.hp<=0&&!f.soulState.deathResolved&&!f.soulState.vanished&&deathKind!=='direct'&&f.soulState.rebirth2243?.armed){if(f.soulState.rebirthMode2243!=='immediate-full')throw Error('Q-4697-005：2243重生节点及HP/PP/状态保留待确认');f.soulState.rebirth2243.armed=false;f.soulState.rebirth2243.usedRound=r;f.hp=f.stats.maxHp;ppRules.restore(f,battleMoves,Infinity);return;}";
 if(!s.includes(old))throw Error('missing original revival');
 s=s.replace(old,'');return s.replace('function resolveDeath(f,defeater=null,deathKind=null){',"function resolveDeath(f,defeater=null,deathKind=null){if(f.hp<=0&&!f.soulState.deathResolved&&!f.soulState.vanished&&deathKind!=='direct'&&f.soulState.rebirth2243?.armed){f.soulState.rebirth2243.armed=false;f.soulState.rebirth2243.usedRound=r;f.hp=f.stats.maxHp;ppRules.restore(f,battleMoves,Infinity);return;}");
});
