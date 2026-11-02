const fs=require('fs');function edit(f,a,b){let s=fs.readFileSync(f,'utf8');if(!s.includes(a))throw Error(f+' missing '+a);fs.writeFileSync(f,s.replace(a,b));}
const u='research/3711-user-confirmed-rules.json',r=JSON.parse(fs.readFileSync(u));r.confirmations.push({at:new Date().toISOString(),source:'当前用户回答：是；是；是',soul2072:'未选技能但免疫沉默时仍消耗1层，并触发系别比较',effect2380:'暴击强制命中可突破封招；受控未行动不触发'});fs.writeFileSync(u,JSON.stringify(r,null,2)+'\n');
edit('dist/soul-registry.js',"choiceLocked(c){c.a.soulState.selectedSkill=c.m.kind!=='item';}}},",`choiceLocked(c){c.a.soulState.selectedSkill=c.m.kind!=='item';},roundEnd(c){const n=c.a.soulState.ningjie??0;if(n<=0||c.a.hp<=0)return;const duration=n===5?3:2;let applied=false;if(!c.selectedSkill(c.t)){c.a.soulState.ningjie=n-1;applied=c.ailment(c.t,'沉默',c.a,false,false,duration);}if(!applied)c.timed(c.a,'最优对手系别',duration,{},c.round+1);}}},`);
const file='dist/range-effects.js',audit=require('./3711-source-audit.json');let src=fs.readFileSync(file,'utf8');const ids=[1382,1383,1384,1385,1386,2428,1558,2380,1485,2429,1054,2425,2432,2430];let append='\n';for(const id of ids){const d=audit.records.find(r=>r.url.includes('skill_effect_type/')&&r.data.id===id).data;append+=`metadata[${id}]=${JSON.stringify({info:d.info,args_num:d.args_num})};\n`;}
append+=`function natureBlessing(c,n){c.a.soulState.natureBlessings=Math.max(0,Math.min(4,(c.a.soulState.natureBlessings??0)+n));}
add(1382,'afterHit',(c,p)=>natureBlessing(c,p[0]+(c.dealt>p[1]?p[2]:0)),[[0,4],[0,99999],[0,4]]);
add(1383,'afterHit',(c,p)=>c.stage(c.a,p[0]*((c.a.soulState.natureBlessings??0)>0?2:1)),[[0,6]]);
add(1384,'afterHit',(c,p)=>natureBlessing(c,p[0]),[[0,4]]);
add(1385,'afterHit',c=>{const n=c.a.soulState.natureBlessings??0;natureBlessing(c,-n);if(c.on(c.t,'PP保护')||c.on(c.t,'免疫PP削减'))return;for(let i=0;i<n;i++)c.t.pp[c.t.moves[Math.floor(c.random()*c.t.moves.length)]]=0;});
add(1386,'afterAttack',(c,p)=>{if(c.t.hp<=0&&c.dealt>0)c.a.soulState.natureBlessingEndLoss=(c.a.soulState.natureBlessingEndLoss??0)+p[0];},[[0,4]]);
add(2428,'afterHit',()=>{},[],'宁界之律与己方琼华之庇队伍共享层数比较及获得');
add(1558,'afterHit',(c,p)=>c.timed(c.a,'暴击攻击增伤',p[0],{fraction:p[1]/100},c.round+1),[turns,[0,1000]]);
add(2380,'afterHit',(c,p)=>{c.a.counts.criticalForceHit=(c.a.counts.criticalForceHit??0)+p[0];},[[1,99]]);
add(1485,'afterHit',(c,p)=>{if(!(Object.values(c.t.stages).some(n=>n>0)&&statusRoll(c,p[0])&&c.ailment(c.t,ailments[p[1]],c.a))&&statusRoll(c,p[2]))c.ailment(c.t,ailments[p[3]],c.a);},[pct,[8,8],pct,[40,40]]);
add(2429,'afterHit',(c,p)=>{if(!Object.values(c.t.effects).some(e=>e.start<=c.round&&e.end>=c.round)||c.on(c.t,'PP保护')||c.on(c.t,'免疫PP削减'))return;const pool=c.t.moves.slice();for(let i=0;i<p[0]&&pool.length;i++)c.t.pp[pool.splice(Math.floor(c.random()*pool.length),1)[0]]=0;},[[1,5]]);
add(1054,'afterHit',(c,p)=>{let changed=false;for(const k of stats)if(c.a.stages[k]<0){const before=c.a.stages[k];c.stage(c.a,-2*before,[k]);changed ||=c.a.stages[k]>before;}if(changed)c.ailment(c.t,ailments[p[0]],c.a);},[[40,40]]);
add(2425,'beforeDamage',(c,p)=>{const n=[c.a,c.t].reduce((sum,f)=>sum+f.moves.filter(id=>f.pp[id]<=p[2]).length,0);c.modifier*=1+(p[0]+Math.floor(n/p[1])*p[3])/100;},[[0,1000],[1,99],[0,99],[0,1000]]);
add(2432,'afterAttack',()=>{},[[1,99],[0,99]],'己方下只精灵出战时恢复PP');
add(2430,'afterAttack',(c,p)=>{if(c.dealt===0&&c.t.hp>0){c.clear(c.t);c.ailment(c.t,ailments[p[0]],c.a);}},[[40,40]]);
`;
const at=src.lastIndexOf('});');src=src.slice(0,at)+append+src.slice(at);src=src.replace('![6,19,23].includes(p[1])','![6,8,19,23].includes(p[1])');fs.writeFileSync(file,src);
edit('dist/souls.js',"      if(a.ailments['虚弱诅咒']>=r)","      if(crit&&on(a,'暴击攻击增伤'))modifier*=1+a.effects['暴击攻击增伤'].fraction;\n      if(a.ailments['虚弱诅咒']>=r)");
edit('dist/souls.js',"    for(const f of fs)E.SOULS.run('battlePhaseEnd'", "    for(const f of fs)if(f.soulState.natureBlessingEndLoss){f.soulState.natureBlessings=Math.max(0,(f.soulState.natureBlessings??0)-f.soulState.natureBlessingEndLoss);delete f.soulState.natureBlessingEndLoss;}\n    for(const f of fs)E.SOULS.run('battlePhaseEnd'");
