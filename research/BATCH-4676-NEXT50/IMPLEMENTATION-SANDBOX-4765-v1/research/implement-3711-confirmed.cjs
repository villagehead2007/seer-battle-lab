const fs=require('fs');
function edit(f,a,b){let s=fs.readFileSync(f,'utf8');if(!s.includes(a))throw Error(f+' missing '+a);fs.writeFileSync(f,s.replace(a,b));}
const u='research/3711-user-confirmed-rules.json',r=JSON.parse(fs.readFileSync(u));r.confirmations.push({at:new Date().toISOString(),source:'当前用户明确授权',answer:'授权该最小公共支持',proposal:'research/3711-zero-pp-proposal.json'});fs.writeFileSync(u,JSON.stringify(r,null,2)+'\n');
edit('seerapi.cjs',"pp:int(m.max_pp,'PP',1,100)","pp:int(m.max_pp,'PP',0,100)");
edit('dist/wiki-support.js','m.pp<1||m.pp>100','m.pp<0||m.pp>100');
edit('dist/wiki-support.js','(?:[1-9]|1[0-6])','(?:[0-9]|1[0-6])');
edit('dist/pp-rules.js','  return Object.freeze({restore,absorb,',`  function usable(f,id,ignorePP=false){return f.moves.includes(id)&&(ignorePP||f.pp[id]>0);}
  function consume(f,id,amount,ignorePP=false){if(!Number.isInteger(amount)||amount<0)throw new RangeError('PP消耗必须为非负整数');if(!usable(f,id,ignorePP))return false;f.pp[id]=Math.max(0,f.pp[id]-amount);return true;}
  return Object.freeze({restore,absorb,usable,consume,`);
edit('dist/souls.js','  E.PP_RULES=ppRules;',`  E.PP_RULES=ppRules;
  E.availableMoves=function(f){const moves=f.moves.filter(id=>ppRules.usable(f,id,!!E.SOULS.trait(f,'ignorePP')));return [...(moves.length?moves:['struggle']),'potion:hp','potion:pp'];};`);
edit('dist/souls.js',"if(m.id!=='struggle'&&a.pp[m.id]<=0)","if(m.id!=='struggle'&&!ppRules.usable(a,m.id,!!E.SOULS.trait(a,'ignorePP')))");
edit('dist/souls.js',"if(m.id!=='struggle')a.pp[m.id]=Math.max(0,a.pp[m.id]-(on(a,'PP消耗倍增')?a.effects['PP消耗倍增'].multiple:1));","if(m.id!=='struggle')ppRules.consume(a,m.id,on(a,'PP消耗倍增')?a.effects['PP消耗倍增'].multiple:1,!!E.SOULS.trait(a,'ignorePP'));");
edit('dist/souls.js','    for(const a of s.fighters)for(const id of a.moves)',"    for(const a of s.fighters)E.SOULS.run('battleStart',{a,t:s.fighters[1-a.side]});\n    for(const a of s.fighters)for(const id of a.moves)");
edit('dist/souls.js','emit,name,steal,boost,on,used,effective,','emit,name,steal,boost,on,used,selectedSkill:f=>battleMoves[choices[f.side]].kind!==\'item\',effective,');
edit('dist/souls.js',"if(on(t,'reflect')){", "const immunityChance=E.SOULS.trait(t,'ailmentImmunityChance')??0;if(immunityChance>0&&rng(s)<immunityChance)return false;\n        if(on(t,'reflect')){");
edit('dist/souls.js',"      E.SOULS.run('roundEnd',c);", "      if(f.hp>0&&on(f,'回合末设定体力'))f.hp=Math.min(f.stats.maxHp,Math.floor(f.stats.maxHp*f.effects['回合末设定体力'].fraction));\n      E.SOULS.run('roundEnd',c);");
const file='dist/range-effects.js',audit=require('./3711-source-audit.json');let src=fs.readFileSync(file,'utf8');const ids=[1909,2426,2427];let append='\n// 3711 user-confirmed timing and rounding; raw metadata is preserved.\n';for(const id of ids){const d=audit.records.find(r=>r.url.includes('skill_effect_type/')&&r.data.id===id).data;append+=`metadata[${id}]=${JSON.stringify({info:d.info,args_num:d.args_num})};\n`;}
append+=`add(1909,'afterHit',(c,p)=>{if(c.a.hp<=0)return;const repeat=c.a.hp>c.a.stats.maxHp*p[1]/100;c.a.hp=Math.min(c.a.stats.maxHp,Math.floor(c.a.stats.maxHp*p[0]/100));if(repeat)c.timed(c.a,'回合末设定体力',1,{fraction:p[0]/100});},[pct,pct]);
add(2427,'afterHit',c=>{const n=c.a.soulState.ningjie??0;const remaining=n-Math.floor(n/2);c.a.soulState.ningjie=remaining;if(remaining)c.timed(c.t,'statusBlock',remaining,{});});
add(2426,'afterAttack',c=>{if(c.t.hp<=0&&c.dealt>0){const n=c.a.soulState.ningjie??0;c.a.soulState.ningjie=n-Math.floor(n/2);}},[],'击败后的对方后续精灵无法造成伤害、附加异常状态；自身层数消耗已实现');
`;
const at=src.lastIndexOf('});');src=src.slice(0,at)+append+src.slice(at);fs.writeFileSync(file,src);
const soulfile='dist/soul-registry.js';edit(soulfile,'const registry={',`const registry={
 987:{name:'圣光莫妮卡·原魂印',sourceHash:'19c8b803',deferred:['之后每次登场获得2层自然祝福；下场清空自然祝福'],traits:{attackPriority:f=>f.soulState.natureBlessings??0,attackReduction:f=>(f.soulState.natureBlessings??0)*.08,ailmentImmunityChance:f=>(f.soulState.natureBlessings??0)*.25},hooks:{
  battleStart(c){c.a.soulState.natureBlessings=4;},
  combatEnd(c){const n=c.a.soulState.natureBlessings??0;c.a.soulState.natureBlessings=Math.max(0,Math.min(4,n+(c.used[c.a.side]?-1:1)));}
 }},
 2072:{name:'圣光莫妮卡·觉醒魂印',sourceHash:'43159cba',deferred:['上只在场队友PP恢复与琼华之庇；对方上只精灵参与最优系别比较'],traits:{ignorePP:f=>(f.soulState.ningjie??0)>0},hooks:{battleStart(c){c.a.soulState.ningjie=4;},choiceLocked(c){c.a.soulState.selectedSkill=c.m.kind!=='item';}}},`);
