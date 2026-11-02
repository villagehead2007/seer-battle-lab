const fs=require('fs');
fs.writeFileSync('research/3865-user-confirmed-rules.json',JSON.stringify({confirmedAt:new Date().toISOString(),species:3865,source:'human-user',answers:['是','加算','是；结算前','回复300点'],rules:{soul1137:'重复选择同一技能必定登记回合末吸取300；失效独立30%；控制不能行动仍更新选择并判定',skill33304:'986与1152的50%增伤相加',skill26732:'1297[6,3]害怕未成功均吸取，含无可清、免断、免害怕',skill33303:'1415[25,50]伤害结算前比较体力',fixedDrain:'1137与33299的1354固定吸取回复理论300，不依赖实际扣血'},scope:'仅上述3865来源与词条；不改写API/Wiki，不推广其他参数或精灵'},null,2)+'\n');
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8');
s=s.replace("p[1]===3&&c.a.number==='3550'","p[1]===3&&['3550','3865'].includes(c.a.number)");
s=s.replace("c.heal(c.a,c.hurt(c.t,p[0],c.m.name+'吸取','fixed'),c.m.name+'吸取');},[[0,99999],[1,6]]);","{const dealt=c.hurt(c.t,p[0],c.m.name+'吸取','fixed');c.heal(c.a,c.a.number==='3865'&&c.m.wikiId===33299?p[0]:dealt,c.m.name+'吸取');}},[[0,99999],[1,6]]);");
s=s.replace("if(c.a.side===c.first)c.modifier*=1+p[0]/100;},[pct]);","if(c.a.side===c.first){if(c.a.number==='3865'&&c.m.wikiId===33304)c.additiveAttackFraction=(c.additiveAttackFraction??0)+p[0]/100;else c.modifier*=1+p[0]/100;}},[pct]);");
s=s.replace("if(Object.values(c.a.stages).every(n=>n<=0))c.modifier*=1+p[0]/100;},[pct]);","if(Object.values(c.a.stages).every(n=>n<=0)){if(c.a.number==='3865'&&c.m.wikiId===33304)c.additiveAttackFraction=(c.additiveAttackFraction??0)+p[0]/100;else c.modifier*=1+p[0]/100;}},[pct]);");
const at=s.lastIndexOf('\n});');s=s.slice(0,at)+`
metadata[1415]={info:'造成伤害的{0}%恢复自身体力，若自身体力低于对手则效果提升至{1}%',args_num:2};
add(1415,'afterAttack',(c,p)=>c.heal(c.a,c.dealt*(c.a.soulState.effect1415Low?p[1]:p[0])/100,c.m.name+'吸血'),[pct,pct],undefined,undefined,{beforeDamage(c){c.a.soulState.effect1415Low=c.a.hp<c.t.hp;}});
`+s.slice(at);fs.writeFileSync(p,s);
