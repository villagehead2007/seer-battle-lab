'use strict';const fs=require('fs'),assert=require('node:assert/strict');
function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,100));fs.writeFileSync(p,s.replace(a,b));}function append(p,c){const s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('\n});');assert.ok(i>0);fs.writeFileSync(p,s.slice(0,i)+'\n'+c+s.slice(i));}
const p='research/4258-reviewed-snapshot.json',s=JSON.parse(fs.readFileSync(p)),report=require('./4258-source-check.json'),rawPet=report.records.find(r=>r.url.endsWith('/pet/4258')).data;
for(const m of s.moves){const raw=rawPet.skill.find(x=>x.skill.id===m.id);m.fifth=raw.is_fifth;}
s.additionalFifths={rawPet,source:{url:s.source.url,revision:rawPet.hash}};
s.skillVersions=s.souls.flatMap(soul=>[35288,38515].map(id=>({id:'soul-'+soul.id+'-fifth-'+id,soulId:soul.id,soulHash:soul.hash,moveIds:s.moves.filter(m=>!m.fifth||m.id===id).map(m=>m.id),source:{url:s.source.url,revision:rawPet.hash}})));
s.moves.find(m=>m.id===35191).limitations.push('Q-A60-4258-066：461从下回合开始必暴的结束及是否可清除尚未明确');
fs.writeFileSync(p,JSON.stringify(s,null,2)+'\n');let code='';for(const id of [1717,2565,2566]){const e=s.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(1717,'afterHit',(c,p)=>c.timed(c.a,'对手属性后减攻监听',p[0],{duration:p[1],amount:p[2]}),[turns,turns,[0,99999]]);
add(2565,'afterHit',c=>{const lost=stats.filter(k=>c.a.stages[k]<0).map(k=>[k,-c.a.stages[k]]);if(lost.length){for(const [k,n]of lost)c.stage(c.a,n,[k]);}else c.clear(c.t);},[]);
const zeroSource4258={id:35288,hash:'dbc86eea',effects:[{id:494,args:[],phase:'beforeOrder'},{id:1295,args:[2],phase:'afterHit'},{id:1718,args:[100,50],phase:'beforeDamage'},{id:1709,args:[3],phase:'afterHit'}]};
function inherited4258(c,phase){for(const x of zeroSource4258.effects)if(x.phase===phase)registry[x.id].execute(c,x.args);}
add(2566,'beforeOrder',c=>{if(c.a.soulId===2139)throw Error('Q-A60-4258-065：执行者免伤及取消全部触发条件未明确');inherited4258(c,'beforeOrder');},[],undefined,undefined,{beforeDamage(c){inherited4258(c,'beforeDamage');},afterHit(c){inherited4258(c,'afterHit');}});
registry[2566]=Object.freeze({...registry[2566],partial:true,unimplemented:['Q-A60-4258-065：执行者免疫下取消触发条件']});
{const old=registry[636];registry[636]=Object.freeze({...old,validate(p,m,index){if((m?.wikiId??m?.id)===35285&&(m?.hash==='6466b49'||m?.revision==='seerapi:6466b49')&&index===1&&JSON.stringify(p)==='[0,0]')return;old.validate(p,m,index);},execute(c,p){if((c.m.wikiId??c.m.id)===35285&&c.m.revision==='seerapi:6466b49'&&JSON.stringify(p)==='[0,0]'){if(c.clearBoost(c.t))c.ailment(c.t,'麻痹',c.a);return;}old.execute(c,p);}});}
{const old=registry[1122];registry[1122]=Object.freeze({...old,validate(p,m,index){if((m?.wikiId??m?.id)===27680&&(m?.hash==='d664cfe7'||m?.revision==='seerapi:d664cfe7')&&index===1&&JSON.stringify(p)==='[1,0]')return;old.validate(p,m,index);}});}
`;
append('dist/range-effects.js',code);
edit('dist/souls.js',"if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后异常'))", "if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后减攻监听')){const e=t.effects['对手属性后减攻监听'];timed(a,'自身攻击输出定额减少',e.duration,{amount:e.amount},r+1);}\n      if(t.hp>0&&m.kind==='status'&&on(t,'对手属性后异常'))");
edit('dist/souls.js',"if(!rage&&!effectContext.ignoreLimit)remaining=Math.max(0,remaining-(E.SOULS.trait(t,'flatAttackReduction')??0));","if(!rage&&!effectContext.ignoreLimit)remaining=Math.max(0,remaining-(E.SOULS.trait(t,'flatAttackReduction')??0));\n      if(!rage&&on(a,'自身攻击输出定额减少'))remaining=Math.max(0,remaining-a.effects['自身攻击输出定额减少'].amount);");
append('dist/range-souls.js',`registry[1482]={name:'环·源',sourceHash:'e8fc42fa',partial:true,unimplemented:['Q-A60-4258-063：多段归零及诡雷叠加单位'],hooks:{
afterAttack(c){if(c.a.hp<=0)return;const n=c.settledDamage??c.dealt;if((c.hitCount??1)>1)throw Error('Q-A60-4258-063：归零强袭多段单位');const amount=n*.8;if(c.t.hp>0)c.hurt(c.t,amount,'归零强袭追加','percent');c.heal(c.a,amount,'归零强袭回复');if(n<300)c.timed(c.t,'statusBlock',1,{},c.round+1);else if(n>300)c.timed(c.t,'attackBlock',1,{},c.round+1);},
afterUse(c){if(c.a.hp<=0||c.m.kind!=='status')return;if(c.a.soulState.zeroMinePending||c.a.soulState.zeroMineTriggeredRound===c.round)throw Error('Q-A60-4258-063：归零诡雷重复叠加');c.a.soulState.zeroMinePending=true;},
opponentAfterUse(c){if(c.a.soulState.zeroMinePending){delete c.a.soulState.zeroMinePending;c.a.soulState.zeroMineTriggeredRound=c.round;}},
attackDamageTaken(c){const n=c.settledDamage??c.dealt;if(c.a.hp<=0||n<=0)return;const st=c.a.soulState;if(st.zeroTakenRound===c.round)throw Error('Q-A60-4075-012：归零屏障多次受击单位');st.zeroTakenRound=c.round;if(n<300)st.zeroLowPPRound=c.round;else if(n>300)c.timed(c.t,'priorityAll',1,{amount:-1},c.round+1);},
combatEnd(c){const st=c.a.soulState;if(st.zeroMineTriggeredRound===c.round){delete st.zeroMineTriggeredRound;if(c.t.hp>0)c.hurt(c.t,300,'归零诡雷','fixed');}if(c.a.hp>0&&st.zeroLowPPRound===c.round){delete st.zeroLowPPRound;c.restorePP(c.a,1);if(!c.ppReductionBlocked(c.t))for(const id of c.t.moves)c.t.pp[id]=Math.max(0,c.t.pp[id]-1);}}
}};
registry[2139]={name:'环·源·执行者',sourceHash:'f102f34c',partial:true,unimplemented:['Q-A60-4258-064：执行者及源式三效果缺少载荷'],hooks:{battleStart(c){c.a.soulState.executors=5;},afterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')throw Error('Q-A60-4258-064：源式崩坏具体效果未明确');},opponentAfterUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')throw Error('Q-A60-4258-064：源式光垒具体效果未明确');},combatEnd(){throw Error('Q-A60-4258-064：源式阵列条件/执行者存量及来源免伤未明确');}}};`);
fs.writeFileSync('tests/helpers/4258-battle.cjs',fs.readFileSync('tests/helpers/4247-battle.cjs','utf8').replaceAll('4247','4258').replace('unknown=[]','unknown=[461]'));
console.log('4258 independent source-bound enum,1717,2565,normal2566,1482; unknown461/2139 conditions explicitly pending');
