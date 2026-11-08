'use strict';const fs=require('fs');
function replace(file,a,b){let t=fs.readFileSync(file,'utf8');if(t.split(a).length!==2)throw Error(file+' match '+a);fs.writeFileSync(file,t.replace(a,b));}
replace('dist/souls.js',"function copiedImmune(f,type,amount=0,m=null,crit=false,consume=false,immunityPhase='type'){", "function copiedImmune(f,type,amount=0,m=null,crit=false,consume=false,immunityPhase='type'){if(type==='true')return false;");
replace('dist/souls.js',"function damageImmune(f,type,ignoreGuard=false){", "function damageImmune(f,type,ignoreGuard=false){if(type==='true')return false;");
replace('dist/souls.js',"if(!bypass&&on(f,'当回合免伤'))", "if(type!=='true'&&!bypass&&on(f,'当回合免伤'))");
replace('dist/souls.js',"if(!bypass&&on(f,'小额伤害免疫')&&f.effects['小额伤害免疫'].pendingOtherTypesQuestion&&['fixed','percent','true'].includes(type))", "if(!bypass&&on(f,'小额伤害免疫')&&f.effects['小额伤害免疫'].pendingOtherTypesQuestion&&['fixed','percent'].includes(type))");
replace('dist/souls.js',"if(!bypass&&on(f,'小额伤害免疫')&&(type==='attack'||!f.effects['小额伤害免疫'].attackOnly)", "if(type!=='true'&&!bypass&&on(f,'小额伤害免疫')&&(type==='attack'||!f.effects['小额伤害免疫'].attackOnly)");
replace('dist/souls.js',"if(!bypass&&amount>0&&on(f,'低伤免疫返还')", "if(type!=='true'&&!bypass&&amount>0&&on(f,'低伤免疫返还')");
replace('dist/characteristics.js',"if(e.kind==='void'&&roll(c,c.a,e)){c.amount=0;c.immune=true;}", "if(c.type!=='true'&&e.kind==='void'&&roll(c,c.a,e)){c.amount=0;c.immune=true;}");
replace('dist/range-souls.js',"lethal(c){if(c.a.hp<=0||c.a.type==='神灵'||!(c.lethal||c.amount>0&&c.amount>=c.a.hp))", "lethal(c){if(c.type==='true'||c.a.hp<=0||c.a.type==='神灵'||!(c.lethal||c.amount>0&&c.amount>=c.a.hp))");
console.log('Q-LIGHT-009 true damage immunity gates updated without bypassing reductions or shields');
