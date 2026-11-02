const fs=require('fs');function edit(f,a,b){let s=fs.readFileSync(f,'utf8');if(!s.includes(a))throw Error('missing '+a);fs.writeFileSync(f,s.replace(a,b));}
if(!fs.readFileSync('dist/soul-registry.js','utf8').includes(' 999:{'))edit('dist/soul-registry.js','const registry={',`const registry={
 999:{name:'混沌·哈肯萨·原魂印',sourceHash:'829dc61',traits:{},hooks:{beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,c.round*18,'混沌哈肯萨原魂印追加','fixed');}}},
 1756:{name:'混沌·哈肯萨·觉醒魂印',sourceHash:'ee3379dc',deferred:['首次登场按对方出战背包龙系数量及龙神哈莫计算黯龙余恨；两种层数下场保留'],traits:{attackMultiplier:f=>1+(f.soulState.darkDragonHatred??0)*.02},hooks:{
 roundStart(c){c.a.soulState.fallenDragonResentment=Math.min(c.round,Math.max(0,50-(c.a.soulState.darkDragonHatred??0)));},
 beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item'&&c.t.hp>0)c.hurt(c.t,(c.a.soulState.fallenDragonResentment??0)*20,'混沌哈肯萨觉醒追加','fixed');}
 }},`);
const f='dist/range-effects.js',a=require('./3724-source-audit.json');let s=fs.readFileSync(f,'utf8');const d=a.records.find(r=>r.url.endsWith('/skill_effect_type/2056')).data;const extra=`\nmetadata[2056]=${JSON.stringify({info:d.info,args_num:d.args_num})};
add(2056,'afterAttack',(c,p)=>{if(c.t.hp<=0){c.heal(c.a,c.a.stats.maxHp,c.m.name+'击败回满');const fallen=c.a.soulState.fallenDragonResentment??0;c.a.soulState.darkDragonHatred=Math.min(Math.max(0,50-fallen),(c.a.soulState.darkDragonHatred??0)+Math.floor(fallen/p[0])*p[1]);}},[[1,50],[1,50]]);
`;const at=s.lastIndexOf('});');s=s.slice(0,at)+extra+s.slice(at);s=s.replace("if(id===1118&&", "if(id===1605&&![2,6].includes(args[1]))throw Error('1605 异常枚举尚未核对');if(id===1118&&");fs.writeFileSync(f,s);
edit('dist/souls.js','hitIndex===0?cachedCrit:null,forceCriticalHit)','hitIndex===0?cachedCrit:null,forceCriticalHit||accuracyContext.alwaysHit)');
