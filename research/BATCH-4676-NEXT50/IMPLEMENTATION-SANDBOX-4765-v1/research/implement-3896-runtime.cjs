const fs=require('fs');let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('});');s=s.replace("add(1478,'afterHit',()=>{},[turns]", "add(1478,'afterHit',(c,p)=>c.timed(c.t,'不能主动切换',p[0],{},c.round+1),[turns]");s=s.slice(0,s.lastIndexOf('});'))+`
metadata[1214]={info:'对手处于异常状态则吸取对手{0}点体力',args_num:1};
metadata[1784]={info:'{0}回合内对手使用技能时自身免疫对手下{1}次非致命一击造成的攻击伤害',args_num:2};
add(1214,'afterHit',(c,p)=>{if(c.t.hp>0&&Object.values(c.t.ailments).some(n=>n>=c.round))healthRules.drainFixed(c,p[0],c.m.name+'异常吸取');},[[0,99999]]);
`+s.slice(s.lastIndexOf('});'));
// API1784 has one instance argument; the template's next-one count is literal.
const raw=require('./3896-reviewed-snapshot.json').effects.find(x=>x.id===1784);s=s.replace("metadata[1784]={info:'{0}回合内对手使用技能时自身免疫对手下{1}次非致命一击造成的攻击伤害',args_num:2};",'metadata[1784]='+JSON.stringify({info:raw.template,args_num:raw.argsNum})+';');i=s.lastIndexOf('});');s=s.slice(0,i)+"\nadd(1784,'afterHit',(c,p)=>c.timed(c.a,'下次非暴击免疫',p[0],{count:1}),[turns]);\n"+s.slice(i);fs.writeFileSync(p,s);
p='dist/souls.js';s=fs.readFileSync(p,'utf8');s=s.replace("!!E.SOULS.trait(t,'criticalReflectType')||on(t,'致命伤害反射')", "!!E.SOULS.trait(t,'criticalReflectType')||!!E.SOULS.trait(t,'criticalImmune')||on(t,'致命伤害反射')");const marker="      if(!effectContext.ignoreImmunity&&crit&&E.SOULS.trait(t,'criticalReflectType'))";s=s.replace(marker,"      if(!effectContext.ignoreImmunity&&crit&&remaining>0&&E.SOULS.trait(t,'criticalImmune')){E.SOULS.run('criticalImmuneTriggered',{...context(t,a,m),amount:remaining,first});remaining=0;}\n      if(!effectContext.ignoreImmunity&&!crit&&on(t,'下次非暴击免疫')){const e=t.effects['下次非暴击免疫'],k=r+':'+a.side+':'+m.id;if(e.usedKey===k||e.count>0){if(e.usedKey!==k){e.count--;e.usedKey=k;}remaining=0;}}\n"+marker);fs.writeFileSync(p,s);
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');i=s.lastIndexOf('});');s=s.slice(0,i)+`
function gammaBaseRound(c){const st=c.a.soulState;st.currentRound=c.round;st.gammaLow=c.a.hp<c.t.hp;st.gammaHigh=c.a.hp>c.t.hp;st.gammaDifference=Math.abs(c.a.hp-c.t.hp);}
function gammaFear(c,chance){if(c.a.hp>0&&c.t.hp>0&&c.m.kind!=='status'&&c.m.kind!=='item'&&c.a.soulState.gammaHigh&&!(c.random()*100<chance&&c.ailment(c.t,'害怕',c.a)))c.clear(c.t);}
registry[1165]={name:'伽玛星魂',sourceHash:'1187ada2',deferred:['前两次登场的再登场首回合暴击与能力下降防护；当前首次登场已实现'],traits:{attackPriority:f=>f.soulState.gammaLow?1:0,criticalImmune:f=>f.soulState.gammaEntryRound===f.soulState.currentRound,weaknessImmune:f=>f.soulState.gammaEntryRound===f.soulState.currentRound},hooks:{
roundStart(c){gammaBaseRound(c);if(!c.a.soulState.gammaEntered){c.a.soulState.gammaEntered=true;c.a.soulState.gammaEntryRound=c.round;}},
afterAttack(c){if(c.a.soulState.gammaLow&&c.t.hp>0)c.hurt(c.t,c.a.soulState.gammaDifference,'伽玛低体差值追加','fixed');},
afterUse(c){gammaFear(c,80);}
}};
registry[1959]={name:'伽玛星魂·强化',sourceHash:'86df2ecc',deferred:['换宠再登场重新获得首次暴击抵挡；在场无法主动切换分支本阶段已实现'],traits:{attackPriority:f=>f.soulState.gammaLow?1:0,criticalImmune:f=>!!f.soulState.gammaCritReady,weaknessImmune:f=>!!f.soulState.gammaCritReady},hooks:{
roundStart(c){const st=c.a.soulState;if(!st.gammaEntered){st.gammaEntered=true;st.gammaCritReady=true;}if(c.a.ailments['瘫痪']>=c.round||c.a.ailments['凝滞']>=c.round||c.on(c.a,'不能主动切换')){st.gammaCritReady=true;const list=Object.entries(c.a.ailments).filter(([,end])=>end>=c.round);for(const [k,end]of list)if(c.t.hp>0)c.ailment(c.t,k,c.a,false,false,end-c.round+1);c.clearAilments(c.a);}gammaBaseRound(c);},
criticalImmuneTriggered(c){c.a.soulState.gammaCritReady=false;c.clearAilments(c.a);c.ailment(c.a,'超频',c.a,false,false,3);},
beforeHealthDamage(c){if(c.a.ailments['超频']>=c.round&&c.a.hp>0&&c.amount>0&&c.amount>=c.a.hp){c.hpFloor=1;for(const k of Object.keys(c.a.ailments))if(k!=='超频')c.clearAilment(c.a,k);}},
beforeUse(c){if(c.a.soulState.gammaLow&&c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,Math.floor(Math.abs(c.a.hp-c.t.hp)*.7),'伽玛强化低体差值追加','true');},
afterUse(c){gammaFear(c,100);}
}};
`+s.slice(i);fs.writeFileSync(p,s);

