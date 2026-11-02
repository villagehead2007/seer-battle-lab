const fs=require('fs');function edit(f,a,b){let s=fs.readFileSync(f,'utf8');if(!s.includes(a))throw Error('missing '+a);fs.writeFileSync(f,s.replace(a,b));}
edit('dist/souls.js',"if(on(t,'免异常')||E.SOULS.trait(t,'ailmentImmune')||t.soulState?.highHp)","if(on(t,'免异常')||E.SOULS.trait(t,'ailmentImmune')||(E.SOULS.trait(t,'immuneAilments')??[]).includes(k)||t.soulState?.highHp)");
edit('dist/souls.js',"||m.kind==='physical'&&on(t,'物理攻击闪避'));","||m.kind==='physical'&&on(t,'物理攻击闪避')||m.kind==='special'&&on(t,'特殊攻击闪避'));");
edit('dist/soul-registry.js','const registry={',`const registry={
 1769:{name:'该洛西斯·觉醒魂印',sourceHash:'ab627512',traits:{immuneAilments:['石化']},hooks:{
 afterUse(c){if(c.a.hp<=0||c.m.kind==='item')return;c.timed(c.a,c.m.kind==='status'?'特殊攻击闪避':'物理攻击闪避',2,{});if(c.on(c.a,'物理攻击闪避')&&c.on(c.a,'特殊攻击闪避')&&c.t.hp>0)c.ailment(c.t,'疲惫',c.a);},
 combatEnd(c){if(c.a.hp<=0)return;if(c.a.hp>c.t.hp)c.a.suitState.shield+=Math.floor(c.a.stats.maxHp/3);else if(c.a.hp<c.t.hp){const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/3,'该洛西斯魂印回复');if(c.t.hp>0)c.hurt(c.t,c.a.hp-before,'该洛西斯魂印追加','percent');}}
 }},`);
