const fs=require('fs');function edit(f,a,b){let s=fs.readFileSync(f,'utf8');if(!s.includes(a))throw Error('missing '+a);fs.writeFileSync(f,s.replace(a,b));}
const f='dist/range-effects.js',a=require('./3724-source-audit.json');let s=fs.readFileSync(f,'utf8'),extra='\n';for(const id of [1394,1839,2054,2028,2055,1605,1225]){const d=a.records.find(r=>r.url.endsWith('/skill_effect_type/'+id)).data;extra+=`metadata[${id}]=${JSON.stringify({info:d.info,args_num:d.args_num})};\n`;}
extra+=`add(1394,'afterHit',(c,p)=>c.timed(c.a,'对手属性随机异常',p[0],{count:p[1]}),[turns,[1,6]]);
add(1839,'afterHit',(c,p)=>{c.timed(c.a,'id57',p[0],{fraction:1/p[1]});c.timed(c.a,'回合末最大体力吸取',p[0],{fraction:1/p[2]});},[turns,[1,9999],[1,9999]]);
add(2054,'afterHit',(c,p)=>c.timed(c.a,'暴击后异常免疫次数',p[0],{count:p[1]},c.round+1),[turns,[1,99]]);
add(2028,'beforeAccuracy',c=>{if(c.typeAffinity(c.a.type,c.t.type)>1)c.alwaysHit=true;});
add(2055,'afterHit',c=>{if(c.typeAffinity(c.t.type,c.a.type)>1)c.clear(c.t);});
add(1605,'afterHit',(c,p)=>{if(statusRoll(c,p[0]))c.ailment(c.t,ailments[p[1]],c.a);},[pct,[2,6]]);
add(1225,'afterHit',(c,p)=>{if(Object.values(c.t.stages).some(n=>n<0)&&c.t.hp>0)c.heal(c.a,c.hurt(c.t,c.t.stats.maxHp/p[0],c.m.name+'弱化吸取','percent'),c.m.name+'弱化吸取');},[[1,9999]]);
`;const at=s.lastIndexOf('});');fs.writeFileSync(f,s.slice(0,at)+extra+s.slice(at));
edit('dist/souls.js','      const alwaysHit=m.alwaysHit||',"      const accuracyContext={...context(a,t,m),alwaysHit:false};E.WIKI.effectsEngine.run('beforeAccuracy',m.operations,accuracyContext);\n      const alwaysHit=accuracyContext.alwaysHit||m.alwaysHit||");
edit('dist/souls.js',"      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'对手属性后随机异常清回合'))", "      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'对手属性随机异常'))statusRules.randomAilments({a:t,t:a,round:r,random:()=>rng(s),ailment,record:event=>{s.randomStatusEvents??=[];s.randomStatusEvents.push(event);}},t.effects['对手属性随机异常'].count,1394);\n      if(t.hp>0&&a.hp>0&&m.kind==='status'&&on(t,'对手属性后随机异常清回合'))");
edit('dist/souls.js',"        a.lastAttackDamage=m.kind==='status'?", "        if(m.kind!=='status'&&crit&&on(a,'暴击后异常免疫次数'))a.counts.immune=(a.counts.immune??0)+a.effects['暴击后异常免疫次数'].count;\n        a.lastAttackDamage=m.kind==='status'?");
edit('dist/souls.js',"    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'回合末当前体力吸取'))", "    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'回合末最大体力吸取')){const target=fs[1-f.side],n=inflict(f,target,target.stats.maxHp*f.effects['回合末最大体力吸取'].fraction,'回合末最大体力吸取','percent');heal(f,n,'回合末最大体力吸取','skill');}\n    if(!s.finished)for(const f of fs)if(f.hp>0&&fs[1-f.side].hp>0&&on(f,'回合末当前体力吸取'))");
let h=fs.readFileSync('tests/helpers/3716-battle.cjs','utf8').replaceAll('3716','3724').replace('moveId:10193','moveId:10001');const source=require('./3724-reviewed-snapshot.json');h=h.replace('moveId:10001','moveId:'+source.moves[0].id);fs.writeFileSync('tests/helpers/3724-battle.cjs',h);

