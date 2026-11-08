'use strict';const fs=require('fs');
function mutate(file,fn){const before=fs.readFileSync(file,'utf8'),after=fn(before);if(before===after)throw Error('No changes '+file);fs.writeFileSync(file,after);}
function one(t,a,b){if(t.split(a).length!==2)throw Error('Expected one '+a);return t.replace(a,b);}
if(!process.argv.includes('--remaining'))mutate('dist/souls.js',t=>{
 t=one(t,"return {a,t,m,signalLethal()", "return {a,t,m,isLethal(amount,type){return amount>0&&(amount>=a.hp||E.SOULS.registry[2162].abilities.deemedLethal(t,a,amount,type));},signalLethal()");
 t=one(t,"function healthLossFloor(f,source,amount,type,bypass)","function deemedLethal(source,target,amount,type){return !!source&&E.SOULS.registry[2162].abilities.deemedLethal(source,target,amount,type);}\n    function damageClassification(receiver,source,amount,type,m=null){const c={...context(source,receiver,m),amount,type,lethal:amount>0&&amount>=receiver.hp};E.SOULS.run('classifyDamage',c);return !!c.lethal;}\n    function reportDamageImmunity(receiver,source,amount,type,m=null){if(receiver.soulId===2162&&amount>0)E.SOULS.run('damageImmuneResolved',{...context(receiver,source??fs[1-receiver.side],m),amount,type});}\n    function healthLossFloor(f,source,amount,type,bypass)");
 t=one(t,"function preventLethal(f,n,damage=true)","function preventLethal(f,n,damage=true,deemed=false)");
 const p=t.indexOf('function preventLethal('),end=t.indexOf('function ',p+10),part=t.slice(p,end).replaceAll('n>=f.hp','(deemed||n>=f.hp)').replaceAll('return Math.max(0,f.hp-1);','return Math.min(n,Math.max(0,f.hp-1));');t=t.slice(0,p)+part+t.slice(end);
 t=one(t,'preventLethal(f,settledDamage)','preventLethal(f,settledDamage,true,deemedLethal(origin,f,settledDamage,type))');
 t=one(t,'preventLethal(t,settledDamage)','preventLethal(t,settledDamage,true,deemedLethal(a,t,settledDamage,\'attack\'))');
 t=t.replaceAll('settledDamage>=f.hp',"(settledDamage>=f.hp||deemedLethal(origin,f,settledDamage,type))").replaceAll('settledDamage>=t.hp',"(settledDamage>=t.hp||deemedLethal(a,t,settledDamage,'attack'))");
 t=one(t,"E.WIKI.effectsEngine.registry[2610].lethal(shared);E.SOULS.run('beforeHealthDamage',shared);if(resolution", "shared.lethal=damageClassification(f,origin??fs[1-f.side],shared.amount,type);E.WIKI.effectsEngine.registry[2610].lethal(shared);E.SOULS.run('beforeHealthDamage',shared);if(resolution");
 t=one(t,"E.WIKI.effectsEngine.registry[2610].lethal(shared);E.SOULS.run('beforeHealthDamage',shared);remaining=voidBlocked753", "const immunityBeforeHealth=shared.amount;shared.lethal=damageClassification(t,a,shared.amount,'attack',m);E.WIKI.effectsEngine.registry[2610].lethal(shared);E.SOULS.run('beforeHealthDamage',shared);if(shared.immune===true)immuneAmount2162=Math.max(immuneAmount2162,immunityBeforeHealth);remaining=voidBlocked753");
 // Each concrete zeroing clause was audited below: skill invalidity and
 // conversion to healing/shields are distinct from damage immunity.
 const token='remaining=(hitImmune=true,minimumSuppressed=true,0)',pieces=t.split(token);if(pieces.length!==34)throw Error('Red immunity inventory changed');
 const immunity=new Set([1,2,3,4,5,6,7,8,9,12,15,16,17,18,19,20,21,22,23,24,25,26,27,31]);
 t=pieces.map((piece,i)=>piece+(i===33?'':immunity.has(i)?'remaining=(immuneAmount2162=Math.max(immuneAmount2162,remaining),hitImmune=true,minimumSuppressed=true,0)':token)).join('');
 t=one(t,'let minimumSuppressed=limited2322,hitImmune=false;', 'let minimumSuppressed=limited2322,hitImmune=false,immuneAmount2162=0;');
 t=one(t,"if(prior>0&&remaining===0){hitImmune=true;", "if(prior>0&&remaining===0){immuneAmount2162=Math.max(immuneAmount2162,prior);hitImmune=true;");
 t=one(t,'const settledDamage=Math.max(0,remaining);if(settledDamage>0)',"const settledDamage=Math.max(0,remaining);reportDamageImmunity(t,a,immuneAmount2162,'attack',m);if(settledDamage>0)");
 // Non-red immunity paths already publish an explicit resolution flag.
 // Observe it once at its actual stage, preserving the current numeric amount.
 t=one(t,"if(f.hp<=0)return 0;\n      if(origin?.soulId===2099", "if(f.hp<=0)return 0;let amount=Math.max(0,Math.floor(n));if(f.soulId===2162){let reported=false;resolution=new Proxy(resolution??{},{set(target,key,value){target[key]=value;if(key==='immune'&&value&&!reported&&amount>0){reported=true;reportDamageImmunity(f,origin,amount,type);}return true;}});}\n      if(origin?.soulId===2099");
 t=one(t,'let amount;if(capOwner2146&&!bypass&&!ignoreReductions)', 'if(capOwner2146&&!bypass&&!ignoreReductions)');
 return t;
});
mutate('dist/range-souls.js',t=>{
 // Only exact lethal comparisons are replaced; no numerical thresholds,
 // strict greater-than conditions or HP-based damage calculations are changed.
 t=t.replace(/c\.amount>=c\.a\.hp(?![\w./])/g,'lethalDamage(c)').replace(/c\.amount<c\.a\.hp(?![\w./])/g,'!lethalDamage(c)');
 return one(t,"'use strict';\nconst clearRules2125", "'use strict';\nconst lethalDamage=c=>c.amount>0&&(c.lethal===true||c.isLethal?.(c.amount,c.type)===true||c.amount>=c.a.hp);\nconst clearRules2125");
});
mutate('dist/characteristics.js',t=>one(t,"c.type==='attack'&&c.amount>=c.a.hp", "c.type==='attack'&&(c.isLethal?.(c.amount,c.type)??c.amount>=c.a.hp)"));
console.log('classified damage and concrete immunity notifications integrated');
