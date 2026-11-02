'use strict';
const fs=require('fs'),assert=require('node:assert/strict');let engine=fs.readFileSync('dist/souls.js','utf8');
const anchor='    function context(a,t,m=null)';assert.ok(engine.includes(anchor));
engine=engine.replace(anchor,`    function scatterFatalMarks(f,count,source,effectId=null){
      if(!Number.isInteger(count)||count<0)throw Error('致命印记数量必须为非负整数');if(f.hp<=0)return 0;
      const marks=f.soulState.fatalMarks??(f.soulState.fatalMarks={});let total=Object.values(marks).reduce((sum,n)=>sum+n,0),added=0;
      while(added<count&&total<5){const pool=f.moves.filter(id=>(marks[id]??0)<3);if(!pool.length)break;
        const id=pool[Math.floor(rng(s)*pool.length)],before=marks[id]??0;marks[id]=before+1;total++;added++;
        s.fatalMarkEvents??=[];s.fatalMarkEvents.push({round:r,sourceSide:source?.side,targetSide:f.side,effectId,skillId:id,before,count:marks[id],total,candidates:pool.slice()});
        emit(name(f)+' '+battleMoves[id].name+'获得1枚致命印记（技能'+marks[id]+'，当前精灵'+total+'）。');
      }return added;
    }
`+anchor);
const contextPart='moveKind:key=>battleMoves[key]?.kind,';assert.ok(engine.includes(contextPart));engine=engine.replace(contextPart,contextPart+'scatterFatalMarks:(f,n,effectId=null)=>scatterFatalMarks(actualFighter(f),n,a,effectId),');
const hit="hitEffectsDisabled:on(a,'技能命中效果失效'),";assert.ok(engine.includes(hit));engine=engine.replace(hit,"hitEffectsDisabled:on(a,'技能命中效果失效')||(a.soulState.fatalMarks?.[m.id]??0)>=3,");
const pending="if((a.soulState.fatalMarks?.[m.id]??0)>=3)throw Error('3枚致命印记命中效果失效范围待公共Q-A60-4125-027');";assert.ok(engine.includes(pending));engine=engine.replace(pending,'');
const fraction="a.stats.maxHp/(n===1?6:5),'致命印记使用后'";assert.ok(engine.includes(fraction));engine=engine.replace(fraction,"a.stats.maxHp/(n===1?6:n===2?5:4),'致命印记使用后'");fs.writeFileSync('dist/souls.js',engine);
let souls=fs.readFileSync('dist/range-souls.js','utf8'),from=souls.indexOf("registry[1394]={name:'弑序神罗'"),to=souls.indexOf('\n',from);assert.ok(from>0&&to>from);let rule=souls.slice(from,to);
rule=rule.replace('partial:true,','').replace("unimplemented:['Q-A60-4169-039：首次致命印记分配','Q-A60-4125-027②：3枚印记命中效果失效范围'],",'');
rule=rule.replace('当前在场5枚仍待039，不以多目标延期豁免','当前在场5枚已按039逐枚随机实现，仅真实其他精灵与总存活数15枚分支延期');
assert.ok(rule.includes('c.a.soulState.fatalInitialScatterPending=5;'));rule=rule.replace('c.a.soulState.fatalInitialScatterPending=5;',"c.scatterFatalMarks(c.t,5,'soul:1394');");souls=souls.slice(0,from)+rule+souls.slice(to);fs.writeFileSync('dist/range-souls.js',souls);
let effects=fs.readFileSync('dist/range-effects.js','utf8');const a=effects.indexOf("add(1642,'afterHit'"),b=effects.indexOf("add(1643,'afterHit'",a);assert.ok(a>0&&b>a);
effects=effects.slice(0,a)+"add(1642,'afterHit',(c,p)=>{if(c.a.hp>0&&c.clearBoost(c.t)&&c.a.hp>0&&roll(c,p[0]))c.scatterFatalMarks(c.t,p[1],1642);},[pct,[1,99]]);\n"+effects.slice(b);
effects=effects.replace("if(n>0&&c.t.hp>0)c.hurt(c.t,n*p[0],c.m.name+'裂痕追加'","if(n>0&&c.a.hp>0&&c.t.hp>0)c.hurt(c.t,n*p[0],c.m.name+'裂痕追加'");
effects=effects.replace("add(1648,'afterHit',(c,p)=>{const n=","add(1648,'afterHit',(c,p)=>{if(c.a.hp<=0)return;const n=");
const next="add(1654,'afterHit'";assert.ok(effects.includes(next));effects=effects.replace(next,"add(1650,'afterHit',(c,p)=>{if(c.a.hp>0&&c.t.hp>0&&roll(c,p[0]))c.scatterFatalMarks(c.t,p[1]+(c.fatalCracks(c.t)>=p[2]?p[3]:0),1650);},[pct,[1,5],[1,3],[1,5]]);\n"+next);fs.writeFileSync('dist/range-effects.js',effects);
const helperFile='tests/helpers/4169-battle.cjs';if(!fs.existsSync('research/4169-helper-before-answers.txt'))fs.copyFileSync(helperFile,'research/4169-helper-before-answers.txt');let h=fs.readFileSync(helperFile,'utf8');assert.ok(h.includes('unknown=[1644,1650]'));h=h.replace('unknown=[1644,1650]','unknown=[1644]');h=h.replace('criticals:o.criticals??false,builds:','criticals:o.criticals??false,seed:o.initialSeed,builds:');fs.writeFileSync(helperFile,h);
console.log('4169魂印当前5枚、1642/1650与公共3枚失效已实现；1644仅时序094仍待回答，未注册占位。');
