'use strict';const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json');
const soul=`
const torus4887=f=>f.soulState.torus4887??={capBase:f.soulId===2103?.8:1,opponentPriority:0,capFraction:f.soulId===2103?.8:1,floorFraction:.4};
for(const [id,hash,base]of[[2074,'415a302a',1],[2103,'b64aeeca',.8]])registry[id]={name:'托勒斯'+(id===2103?'·第二版本':''),sourceHash:hash,traits:{attackDamageCap:f=>f.stats.maxHp*torus4887(f).capFraction},hooks:{
 beforeBattleStart(c){torus4887(c.a).capBase=base;},
 orderResolved(c){const st=torus4887(c.a),p=c.t.soulState.resolvedPriority?.value??0;if(p<0||base-.15*p<0)throw Error('Q-4887-001：负先制或承伤比例低于零的边界待核实');Object.assign(st,{round:c.round,opponentPriority:p,capFraction:base-.15*p,floorFraction:.4+.05*p});},
 beforeDamage(c){c.minimumDamage=Math.max(c.minimumDamage??0,c.t.stats.maxHp*torus4887(c.a).floorFraction);},
 receivedAttack(c){if((c.settledDamage??c.dealt)>0&&c.a.hp>0)c.heal(c.a,200*(2-torus4887(c.a).capFraction),'托勒斯受攻击后魂印回复');},
 afterAttack(c){if((c.settledDamage??c.dealt)>0&&c.a.hp>0)c.hurt(c.t,500*torus4887(c.a).floorFraction,'托勒斯造成攻击伤害后固定追加','fixed');},
 death(c){if(c.t.hp>0)c.timed(c.t,'先制效果失效',1,{source4887:true},c.round+1);}
}};
`;
const rows=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({moveId:m.id,hash:m.hash,index,id:e.id,args:e.args}))).filter(x=>[2142,2299,1778,1637,864].includes(x.id));
const effects=`
const rows4887=${JSON.stringify(rows)};
const exact4887=(p,m,i,id)=>rows4887.some(x=>x.id===id&&(m?.wikiId??m?.id)===x.moveId&&m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(p)===JSON.stringify(x.args));
for(const id of[2142,2299]){const old=registry[id];registry[id]=Object.freeze({...old,validate(p,m,i){if(exact4887(p,m,i,id))return;return old.validate(p,m,i);},execute(c,p){if(!exact4887(p,c.m,c.effectInstanceIndex,id))return old.execute(c,p);if(id===2142){c.ignoreOpponentPositivePriority=true;return;}if(c.clear(c.t)&&!c.ppReductionBlocked?.(c.t))for(const k of c.t.moves)if(c.moveKind(c.t,k)!=='status')c.t.pp[k]=0;}});}
${[1778,1637].map(id=>{const x=s.effects.find(e=>e.id===id);return 'metadata['+id+']='+JSON.stringify({info:x.template,args_num:x.argsNum})+';';}).join('\n')}
add(1778,'afterHit',(c,p)=>{c.a.soulState.pending17784887={round:c.round,turns:p[0],amount:p[1]};},[turns,[0,10]]);
{const old=registry[1778];registry[1778]=Object.freeze({...old,validate(p,m,i){if(!exact4887(p,m,i,1778))throw Error('1778 exact source mismatch');},finish4887(c){const e=c.a.soulState.pending17784887;if(!e||e.round!==c.round)return;delete c.a.soulState.pending17784887;if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.attackedRound17784887!==c.round)c.timed(c.t,'属性技能先制',e.turns,{amount:-e.amount,source4887:true},c.round+1);},received4887(c){c.a.soulState.attackedRound17784887=c.round;}});}
add(1637,'afterHit',(c,p)=>c.timed(c.a,'托勒斯对手属性后封命中',p[0],{duration:p[1]}),[turns,turns]);
{const old=registry[1637];registry[1637]=Object.freeze({...old,validate(p,m,i){if(!exact4887(p,m,i,1637))throw Error('1637 exact source mismatch');},opponent4887(c){if(c.a.hp>0&&c.actualUsed&&c.m?.kind==='status'&&c.on(c.a,'托勒斯对手属性后封命中'))c.timed(c.t,'属性技能命中效果失效',c.a.effects['托勒斯对手属性后封命中'].duration,{},c.round+1);}});}
{const old=registry[864];registry[864]=Object.freeze({...old,execute(c,p){if(!exact4887(p,c.m,c.effectInstanceIndex,864))return old.execute(c,p);c.a.soulState.pending8644887={round:c.round,turns:p[0],fraction:1/p[1]};},finish4887(c){const e=c.a.soulState.pending8644887;if(!e||e.round!==c.round)return;delete c.a.soulState.pending8644887;if(c.a.hp>0&&c.t.hp>0&&c.a.soulState.koRound8644887!==c.round)c.timed(c.a,'受击反弹',e.turns,{fraction:e.fraction,source4734:true,source4887:true},c.round+1);}});}
`;
function append(file,code){let t=fs.readFileSync(file,'utf8');assert.ok(!t.includes('const torus4887=')&&!t.includes('const rows4887='));const p=t.lastIndexOf('});');assert.ok(p>0);fs.writeFileSync(file,t.slice(0,p)+code+t.slice(p));}
append('dist/range-souls.js',soul);append('dist/range-effects.js',effects);
let t=fs.readFileSync('dist/souls.js','utf8');function replace(a,b){assert.equal(t.split(a).length-1,1,a);t=t.replace(a,b);}
replace("fs.forEach((f,i)=>{f.soulState.resolvedPriority={round:r,value:priorities[i]};});","fs.forEach((f,i)=>{if([2074,2103].includes(f.soulId)&&selectedBattleMove(i).kind!=='item')priorities[i]=Math.min(0,priorities[i]);f.soulState.resolvedPriority={round:r,value:priorities[i]};});");
replace("if(!rage&&t.hp>0)E.SOULS.run('receivedAttack'","if(!rage)E.WIKI.effectsEngine.registry[1778].received4887(context(t,a,m));if(!rage&&t.hp>0)E.SOULS.run('receivedAttack'");
replace("if(on(t,'命运命中双控'))","E.WIKI.effectsEngine.registry[1637].opponent4887({...skillContext(t,a,m),actualUsed:!!used[a.side]});if(on(t,'命运命中双控'))");
const anchor='s.round++;for(const f of fs)',p=t.lastIndexOf(anchor);assert.ok(p>0);t=t.slice(0,p)+"for(const f of fs){E.WIKI.effectsEngine.registry[1778].finish4887(context(f,fs[1-f.side]));E.WIKI.effectsEngine.registry[864].finish4887(context(f,fs[1-f.side]));}"+t.slice(p);
// Attribute actual deaths independently of temporary revival state.
replace('function resolveDeath(f,defeater', 'function resolveDeath(f,defeater');
fs.writeFileSync('dist/souls.js',t);console.log('installed source-bound 4887 rules');
