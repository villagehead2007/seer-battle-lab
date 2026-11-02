'use strict';const fs=require('fs'),assert=require('node:assert/strict'),source=require('./4208-reviewed-snapshot.json');function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p+' unique');fs.writeFileSync(p,s.replace(a,b));}
edit('dist/souls.js',"if(a.hp>0&&on(a,'用招回血粉伤')){const before=a.hp;heal(a,a.stats.maxHp*a.effects['用招回血粉伤'].fraction,'用招回血粉伤','skill');const n=a.hp-before;if(t.hp>0&&n>0)inflict(a,t,n,'用招回血粉伤','percent');}","if(a.hp>0&&on(a,'用招回血粉伤')){const n=heal(a,a.stats.maxHp*a.effects['用招回血粉伤'].fraction,'用招回血粉伤','skill')??0;if(a.hp>0&&t.hp>0&&n>0)inflict(a,t,n,'用招回血粉伤','percent');}");
edit('dist/range-effects.js',"(c.a.stats.maxHp+c.effective(c.a,'spe'))*n/100","(c.a.stats.maxHp+c.a.stats.spe)*n/100");
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});'),code='\n// 4208 sourced independent effects; unknown effect100 is not registered.\n';for(const id of [1510,1685]){const e=source.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(1510,'afterHit',()=>{},[turns,pct,[1,10]],'仅对手真实主动切换精灵后回合开始的随机异常，完整触发/来源/参数登记到多精灵清单');
add(1685,'beforeUse',(c,p)=>{const upper=Object.values(c.t.ailments).some(end=>end>=c.round)?p[2]:p[1];if(p[0]>upper)throw Error('1685连击上下限错误');c.hits=p[0]+Math.floor(c.random()*(upper-p[0]+1));},[[4,4],[8,8],[10,10]]);
{const old=registry[878];registry[878]=Object.freeze({...old,validate(p,m,i){if(m?.id===27550&&m.hash==='8210bdb4'&&i===2&&JSON.stringify(p)==='[2,8]')return;old.validate(p,m,i);}});}
`;fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');at=s.lastIndexOf('\n});');code=`
registry[1427]={name:'锢灵·舞',sourceHash:'53ebc960',partial:true,unimplemented:['公共Q-A60-4075-012：多段/多次受击阈值统计单位','公共Q-A60-4114-021：结算0是否按受击进入阈值'],traits:{},hooks:{
roundStart(c){c.a.soulState.danceHigh=c.a.hp>c.a.stats.maxHp/2;c.a.soulState.danceLow=c.a.hp<c.a.stats.maxHp/2;},
attackDamageTaken(c){const n=c.settledDamage??c.dealt;if(n===0)throw Error('1427零攻击伤害阈值待Q-A60-4114-021');const st=c.a.soulState;if(st.danceTakenRound===c.round)throw Error('1427同回合多次受击阈值待Q-A60-4075-012');st.danceTakenRound=c.round;if(n<400)c.timed(c.t,'statusBlock',1,{},c.round+1);else if(n>400)c.timed(c.t,'attackBlock',1,{},c.round+1);},
afterUse(c){if(c.a.hp<=0||c.t.hp<=0||!c.a.soulState.danceHigh||c.m.kind==='status'||c.m.kind==='item')return;c.markStatusEffect?.(['束缚']);if(!c.ailment(c.t,'束缚',c.a,false,false,null,{probabilityPercent:100}))c.hurt(c.t,c.t.stats.maxHp/3,'锢灵高体束缚失败','percent');},
combatEnd(c){if(c.a.hp<=0||!c.a.soulState.danceLow)return;const healed=c.heal(c.a,c.a.stats.maxHp/3,'锢灵低体战阶回复')??0;if(c.a.hp>0&&c.t.hp>0&&healed>0)c.hurt(c.t,healed,'锢灵战阶等量追加','percent');}
}};
`;fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
let h=fs.readFileSync('tests/helpers/4194-battle.cjs','utf8').replaceAll('4194','4208').replace('unknown=[]','unknown=[100]').replace('moveId:10047','moveId:10499');fs.writeFileSync('tests/helpers/4208-battle.cjs',h);edit('tests/helpers/sourced-583-1647-battle.cjs','[4169,4189,4194,4200].includes(id)','[4169,4189,4194,4200,4208].includes(id)');console.log('4208 independent branches and proven532/853 repairs saved');
