'use strict';const fs=require('fs'),assert=require('node:assert/strict'),source=require('./4182-reviewed-snapshot.json');
function replace(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p+' unique '+a.slice(0,90));fs.writeFileSync(p,s.replace(a,b));}
if(!fs.readFileSync('dist/range-effects.js','utf8').includes("m?.id===34884&&m.hash==='5340d02a'"))replace('dist/range-effects.js',`add(732,'afterHit',(c,p)=>{if(!c.crit&&c.a.hp>0)c.stage(c.a,p[0],["atk"]);},[[1,6],...[Array(5).fill([0,0])]]);`,`add(732,'afterHit',(c,p)=>{if(!c.crit&&c.a.hp>0)p.forEach((n,i)=>{if(n)c.stage(c.a,n,[stats[i]]);});},[[1,6],...Array(5).fill([0,0])]);
{const old=registry[732];registry[732]=Object.freeze({...old,validate(p,m,index){if(m?.id===34884&&m.hash==='5340d02a'&&index===2&&JSON.stringify(p)==='[1,1,1,1,1,1]')return;old.validate(p,m,index);}});}`);
replace('dist/souls.js',"if(!(rng(s)<e.chance&&ailment(a,e.ailment,t,false,false,null,{probabilityPercent:e.chance??100})))stage(a,-e.drop);","if(!(rng(s)<e.chance&&ailment(a,e.ailment,t,false,false,null,{probabilityPercent:(e.chance??1)*100})))stage(a,-e.drop);");
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});'),code='\n// 4182: source-bound independent current-combat clauses.\n';
for(const id of [1664,1665,1481]){const e=source.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(1664,'afterHit',(c,p)=>{if(c.a.side===c.first){c.timed(c.a,'低威力攻击无效',1,{power:p[0]});c.a.soulState.lowPowerBlockKillExtension={round:c.round,power:p[0]};}},[[0,9999]]);
add(1665,'afterHit',(c,p)=>c.stage(c.a,p[0]),[[1,6],pct],'仅背包内真实其他阵亡精灵带来的强化翻倍概率；自身基础全属性强化已实现');
add(1481,'beforeDamage',(c,p)=>{if(roll(c,Math.min(100,p[0]*(Object.values(c.t.stages).some(n=>n<0)?2:1))))c.modifier*=2;},[pct]);\n`;
fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
replace('dist/souls.js',"const blocked=runeBlocked||","const blocked=(m.kind!=='status'&&on(t,'低威力攻击无效')&&m.power<t.effects['低威力攻击无效'].power)||runeBlocked||");
replace('dist/souls.js','    for(const f of fs){const st=f.soulState;if(st.roundKillRestorePP===r)',"    for(const f of fs){const e=f.soulState.lowPowerBlockKillExtension;if(e?.round===r){delete f.soulState.lowPowerBlockKillExtension;if(f.hp>0&&fs[1-f.side].hp<=0)timed(f,'低威力攻击无效',1,{power:e.power},r+1);}}\n    for(const f of fs){const st=f.soulState;if(st.roundKillRestorePP===r)");
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');const end=s.lastIndexOf('\n});');assert.ok(end>0);
code=`\nregistry[1406]={name:'堕魂·格特鲁德',sourceHash:'ef0a34b6',partial:true,unimplemented:['Q-A60-4182-041：未触发害怕后的忽防生效时机'],deferred:['真实背包其他精灵阵亡数量的10%增伤及全阵亡时25%最大体力真实附伤'],traits:{},hooks:{roundStart(c){c.a.soulState.fallenDragonAilmentRound=Object.values(c.t.ailments).some(end=>end>=c.round)?c.round:0;},beforeDamage(c){c.modifier*=1.25;if(c.a.soulState.fallenDragonAilmentRound===c.round)c.affinity=Math.max(1,c.affinity);}}};\n`;
fs.writeFileSync(p,s.slice(0,end)+code+s.slice(end));
