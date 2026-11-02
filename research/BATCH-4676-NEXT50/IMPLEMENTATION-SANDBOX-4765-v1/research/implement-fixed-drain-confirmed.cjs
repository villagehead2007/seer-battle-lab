const fs=require('fs');let p='dist/health-rules.js',s=fs.readFileSync(p,'utf8');s=s.replace('return Object.freeze({drainPercent});',`// Q-BATCH-004: fixed-quantity drain heals the requested amount, not HP loss.
function drainFixed(c,amount,damageSource,healSource=damageSource){
 if(!Number.isFinite(amount)||amount<0)throw Error('无效固定吸取量');
 const dealt=c.hurt(c.t,amount,damageSource,'fixed');c.heal(c.a,amount,healSource);return dealt;
}
return Object.freeze({drainPercent,drainFixed});`);fs.writeFileSync(p,s);
for(const p of ['dist/range-effects.js','dist/range-souls.js','dist/soul-registry.js']){let s=fs.readFileSync(p,'utf8');let count=0;s=s.replace(/c\.heal\(c\.a,c\.hurt\(c\.t,([^,]+),([^,]+),'fixed'\),\s*([^;]+)\);/g,(_,amount,damageLabel,healLabel)=>{count++;return `healthRules.drainFixed(c,${amount},${damageLabel},${healLabel});`;});s=s.replace(/const (n|dealt)=c\.hurt\(c\.t,([^,;]+),([^,;]+),'fixed'\);c\.heal\(c\.a,\1,([^;]+)\);/g,(_,name,amount,damageLabel,healLabel)=>{count++;return `healthRules.drainFixed(c,${amount},${damageLabel},${healLabel});`;});s=s.replace("const dealt=c.hurt(c.t,p[0],c.m.name+'吸取','fixed');c.heal(c.a,c.a.number==='3865'&&c.m.wikiId===33299?p[0]:dealt,c.m.name+'吸取');","healthRules.drainFixed(c,p[0],c.m.name+'吸取');");fs.writeFileSync(p,s);console.log(p,count);}
p='dist/souls.js';s=fs.readFileSync(p,'utf8');s=s.replace("heal(f,n,'未受攻定额吸取');", "heal(f,f.effects['未受攻定额吸取'].drain,'未受攻定额吸取');").replace("heal(f,n,'先手固定吸取');","heal(f,f.effects['先手固定吸取'].amount,'先手固定吸取');");fs.writeFileSync(p,s);
