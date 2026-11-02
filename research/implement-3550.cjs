'use strict';
const fs=require('fs'),report=require('./3550-source-check.json');
fs.writeFileSync('research/3550-user-confirmed-rules.json',JSON.stringify({species:3550,confirmedAt:new Date().toISOString(),sourceDistinction:'User confirmation does not alter API/Wiki originals',rules:[{effect:1300,args:[3,50,280,2],answer:'是；是；前者',meaning:'Compare actual post-reduction total attack damage for this attack, strictly >280. Dynamic nonrestricted PVP pool uniform without replacement, each default2/3 independently, no redraw. Clear attacker timed effects only if threshold passed and any sampled ailment failed.'},{effect:1297,args:[6,3],answer:'害怕未成功',meaning:'Drain when fear failed, including no removable effect, removal blocked, or fear immune; scoped to3550/31577 parameter6,3.'}]},null,2)+'\n');
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8');
const ids=[1298,505,1299,1300,1316,1302,1303,1304,1306,1307,1308];
const meta=ids.map(id=>{const e=report.records.find(x=>x.url.endsWith('/skill_effect_type/'+id)).data;return 'metadata['+id+']='+JSON.stringify({info:e.info,args_num:e.args_num})+';';}).join('\n');
const code=`
// 3550: exact SeerAPI templates and user-confirmed1300 semantics.
${meta}
add(1298,'afterHit',c=>c.clearBoost(c.t),[],'消强成功后扣除对方场下随机精灵体力并保留1点');
add(505,'afterAttack',(c,p)=>{if(c.crit)c.heal(c.a,c.dealt*p[0]/100,c.m.name+'暴击回复');},[pct]);
add(1299,'afterHit',()=>{},[],'3回合对手攻击低伤或使用属性技能时，对双方场下精灵扣血或回复，致死保留1点');
add(1300,'afterHit',(c,p)=>c.timed(c.a,'减伤高伤随机异常',p[0],{fraction:p[1]/100,threshold:p[2],count:p[3]}),[turns,pct,[0,99999],[1,30]]);
add(1316,'afterHit',(c,p)=>{if(c.a.side!==c.first)return;const pool=[...stats];for(let i=0;i<p[0]&&pool.length;i++)c.stage(c.a,p[1],[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);},[[1,6],[1,6]]);
add(1302,'afterHit',(c,p)=>{const doubled=c.random()<p[1]/100;c.stage(c.a,p[0]*(doubled?2:1));if(!doubled)c.steal(c.a,c.t,c.m.name);},[[1,6],pct]);
add(1303,'afterHit',c=>c.timed(c.a,'用招低体双吸',4,{denominator:3}),[],'吸取时自身满体力则为己方所有不在场精灵恢复100点体力');
add(1304,'afterHit',(c,p)=>c.timed(c.a,'攻击忽略双防',p[0],{fraction:p[1]/100},c.round+1),[turns,pct]);
add(1306,'afterAttack',()=>{},[],'低于350伤害时扣对手未出场精灵100体力，致死保留1点');
add(1307,'afterAttack',()=>{},[],'未击败对手时回复己方场下精灵100体力');
add(1308,'afterAttack',()=>{},[],'击败对手后下次登场不削弱帝君之罚与帝君之赐');
`;
if(s.includes('// 3550: exact'))throw Error('already applied');s=s.replace(/\}\);\s*$/,code+'\n});\n');
s=s.replace("else if(cleared)c.ailment(c.t,ailments[p[0]],c.a);else{", "else if(p[0]===6&&p[1]===3&&c.a.number==='3550'){if(!(cleared&&c.ailment(c.t,'害怕',c.a)))healthRules.drainPercent(c,c.t.stats.maxHp/3,c.m.name+'害怕未触发吸取');}else if(cleared)c.ailment(c.t,ailments[p[0]],c.a);else{");
fs.writeFileSync(p,s);
p='dist/souls.js';s=fs.readFileSync(p,'utf8');s=s.replace("if(on(a,'咤克斯忽略双防'))", "if(on(a,'攻击忽略双防'))defense=Math.max(1,Math.floor(defense*(1-a.effects['攻击忽略双防'].fraction)));\n      if(on(a,'咤克斯忽略双防'))");
s=s.replace("if(!rage&&on(t,'分类攻击减伤'))", "if(!rage&&on(t,'减伤高伤随机异常'))modifier*=1-t.effects['减伤高伤随机异常'].fraction*(1-damageReductionIgnore);\n      if(!rage&&on(t,'分类攻击减伤'))");
const anchor="if(t.hp>0&&a.hp>0)E.SOULS.run('opponentAfterUse',{...context(t,a,m),first,attackDamage:useAttackDamage});";
if(!s.includes(anchor))throw Error('missing anchor');
s=s.replace(anchor,anchor+"\n      if(t.hp>0&&a.hp>0&&m.kind!=='status'&&on(t,'减伤高伤随机异常')&&useAttackDamage>t.effects['减伤高伤随机异常'].threshold){const c=context(t,a,m),result=c.randomFromSharedPool(t.effects['减伤高伤随机异常'].count,false,1300);if(result.some(x=>!x.applied))c.clear(a);}");fs.writeFileSync(p,s);
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');s=s.replace(/\}\);\s*$/,`
registry[849]={name:'天启帝君',sourceHash:'29f34d63',traits:{pinkImmune:true,ailmentImmune:true},deferred:['帝君之罚与帝君之赐的场下扣血回复、非首次登场削弱','帝君之援给予其他队员的入场先制','按队伍死亡和场下存活数增减伤与回复追加','最后存活队员免断与敌方最后存活禁疗','被击败后令敌方场下精灵死亡'],hooks:{
battleStart(c){c.a.build.resistance.fixed=100;c.a.build.resistance.percent=100;if(c.a.hp===c.a.stats.maxHp)c.timed(c.a,'id984',1,{amount:1});}
}};
});\n`);fs.writeFileSync(p,s);
