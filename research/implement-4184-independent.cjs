'use strict';const fs=require('fs'),assert=require('node:assert/strict'),s0=require('./4184-reviewed-snapshot.json');
function replace(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,p+' '+a.slice(0,85));fs.writeFileSync(p,s.replace(a,b));}
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});'),code='\n// 4184 real current-combat clauses; unknown vortex semantics remain explicit.\n';
for(const id of [59,1666,1667,1668,2229,2539]){const e=s0.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(59,'afterHit',c=>c.hurt(c.a,c.a.hp,c.m.name+'消耗全部体力','direct'),[[0,5],[0,5]],'仅下一只真实出场精灵的指定能力+1延期；当前自身全部体力消耗已实现');
add(1666,'beforeUse',(c,p)=>{const upper=c.hasBedDomain(c.a)?p[2]:p[1];c.hits=p[0]+Math.floor(c.random()*(upper-p[0]+1));},[[1,60],[1,60],[1,60]]);
{const old=registry[1666];registry[1666]=Object.freeze({...old,validate(p,m,i){old.validate(p,m,i);if(!(p[0]<=p[1]&&p[1]<=p[2]))throw Error('领域连击区间颠倒');}});}
add(2229,'afterHit',(c,p)=>c.timed(c.a,'用招强化登场反应',p[0],{}),[turns]);
registry[2229]=Object.freeze({...registry[2229],partial:true,unimplemented:['公共Q-A60-4163-038：纯反转是否等同消除/吸取；明确消除和吸取已实现']});
add(2539,'battleStart',c=>{c.a.soulState.bedPartnerPP=true;},[]);
add(1667,'afterHit',c=>c.ailment(c.t,'束缚',c.a),[],'仅下2回合对手无法主动切换的真实换宠分支延期；当前束缚已实现，时空漩涡与领域的关系仍待Q-A60-4184-043');
registry[1667]=Object.freeze({...registry[1667],partial:true,unimplemented:['Q-A60-4184-043：时空漩涡与领域关系/持续时间']});
add(1668,'afterHit',(c,p)=>{const n=c.missingPP(c.t)*p[0],before=c.damageTotal(c.t,'fixed');if(c.t.hp>0)c.hurt(c.t,n,c.m.name+'PP已损固定','fixed');if(c.a.hp>0&&c.t.hp>0&&c.damageTotal(c.t,'fixed')===before)c.hurt(c.t,n,c.m.name+'未受固定补真','true');},[[0,99999]]);
`;
fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
p='dist/souls.js';
replace(p,'    function healingMultiplier(f)',"    const hasBedDomain=f=>on(f,'机械领域')||on(f,'次元领域');\n    const skillPPRestoreBlocked=f=>{const owner=fs[1-f.side];return owner.hp>0&&owner.soulState.bedPartnerPP&&hasBedDomain(owner);};\n    function reactivateBedEntry(f){if(f.hp>0)E.SOULS.run('entryTriggered',context(f,fs[1-f.side]));}\n    function healingMultiplier(f)");
replace(p,"if(origin==='skill'&&on(f,'技能禁疗'))","if(origin==='skill'&&(on(f,'技能禁疗')||on(fs[1-f.side],'次元领域')))");
replace(p,"amount=Math.min(amount,E.SOULS.trait(t,'damageCap')??Infinity);}","amount=Math.min(amount,E.SOULS.trait(t,'damageCap')??Infinity,on(t,'机械领域')?t.stats.maxHp*t.effects['机械领域'].fraction:Infinity);}");
replace(p,"remaining=Math.min(remaining,E.SOULS.trait(t,'damageCap')??Infinity);","remaining=Math.min(remaining,E.SOULS.trait(t,'damageCap')??Infinity,on(t,'机械领域')?t.stats.maxHp*t.effects['机械领域'].fraction:Infinity);");
replace(p,'skillPhase,currentActorSide,fatalCracks,ppReductionBlocked:',"skillPhase,currentActorSide,fatalCracks,hasBedDomain,ppRestorationBlocked:skillPPRestoreBlocked,ppReductionBlocked:");
replace(p,"restorePP(f,n){return ppRules.restore(f,battleMoves,n);}","restorePP(f,n,origin='soul'){return origin==='skill'&&skillPPRestoreBlocked(f)?[]:ppRules.restore(f,battleMoves,n);}");
replace(p,'return {...c,t:view,stage:',"return {...c,t:view,restorePP:(f,n)=>c.restorePP(f===view?t:f,n,'skill'),absorbPP:(receiver,donor,n)=>ppRules.absorb(receiver===view?t:receiver,donor===view?t:donor,n,battleMoves,{blocked:c.ppReductionBlocked(donor===view?t:donor),restoreBlocked:skillPPRestoreBlocked(receiver===view?t:receiver)}),stage:");
replace(p,"move.operations,{...context(a,t,move),heal:","move.operations,{...context(a,t,move),restorePP:(f,n)=>context(a,t,move).restorePP(f,n,'skill'),heal:");
{let t=fs.readFileSync(p,'utf8'),q="!!E.SOULS.trait(a,'ignorePP')||on(a,'不受PP限制')";assert.equal(t.split(q).length,3);fs.writeFileSync(p,t.replaceAll(q,q+"||(a.soulState.bedPartnerPP&&hasBedDomain(a))"));}
replace(p,"const removedReaction=on(f,'回合被清追加异常')?", "const bedEntryReaction=on(f,'用招强化登场反应');const removedReaction=on(f,'回合被清追加异常')?");
replace(p,"maxHpOnRemoval(f);restoreCopiedType(f);", "maxHpOnRemoval(f);if(bedEntryReaction)reactivateBedEntry(f);restoreCopiedType(f);");
replace(p,"f.soulState.boostRemovedRound=r;", "if(on(f,'用招强化登场反应')){if(operation==='reverse')throw Error('纯反转是否触发2229登场反应待公共Q-A60-4163-038');reactivateBedEntry(f);}f.soulState.boostRemovedRound=r;");
replace(p,"      E.WIKI.effectsEngine.run('afterUse',m.operations,", "      if(a.hp>0&&on(a,'用招强化登场反应'))stage(a,1);\n      E.WIKI.effectsEngine.run('afterUse',m.operations,");
replace(p,"c.restorePP(f,f.effects['茉蕊回合末PP'].amount)","c.restorePP(f,f.effects['茉蕊回合末PP'].amount,'skill')");
replace(p,'c.restorePP(f,2);for(let i=0;',"c.restorePP(f,2,'skill');for(let i=0;");
p='dist/pp-rules.js';replace(p,'{blocked=false}={}', '{blocked=false,restoreBlocked=false}={}');
replace(p,'const restored=receiverId===null?0:', 'const restored=receiverId===null||restoreBlocked?0:');
p='dist/range-souls.js';s=fs.readFileSync(p,'utf8');at=s.lastIndexOf('\n});');
code=`
function bedEntry(c,cap){for(const k of ['机械领域','次元领域'])delete c.a.effects[k];const name=c.t.hp>500?'机械领域':'次元领域';c.a.effects[name]={start:c.round??1,end:(c.round??1)+2,fraction:cap};}
for(const [id,hash,pp,cap,priority]of [[1408,'d5009596',1,.6,1],[1580,'d7a83ed',2,.4,2]])registry[id]={name:id===1408?'贝狄薇尔':'贝狄薇尔·强化',sourceHash:hash,deferred:['真实主动切换登场时对手所选技能PP消耗5/20倍；真实再次登场重新选择3回合领域；自身2229原地触发登场效果已实现'],traits:{skillPriority:f=>{const e=f.effects['领域次回合全技能先制'];return e&&e.start<=f.soulState.currentRound&&e.end>=f.soulState.currentRound?e.amount:0;}},hooks:{battleStart(c){c.a.soulState.currentRound=1;bedEntry(c,cap);},beforeRoundStart(c){c.a.soulState.currentRound=c.round;},entryTriggered(c){bedEntry(c,cap);},beforeUse(c){if(c.m.kind==='item'||c.ppReductionBlocked(c.t))return;if(c.a.side===c.first)for(const k of c.t.moves)c.t.pp[k]=Math.max(0,c.t.pp[k]-pp);else if(c.t.moves.length)c.t.pp[c.t.moves[Math.floor(c.random()*c.t.moves.length)]]=0;},combatEnd(c){if(c.a.hp<=0)return;const mech=c.on(c.a,'机械领域'),dim=c.on(c.a,'次元领域');if(!mech&&!dim)return;const e=c.a.effects[mech?'机械领域':'次元领域'];if((c.a.roundSettledAttackDamage??0)>0){if(mech)c.timed(c.a,'领域次回合全技能先制',1,{amount:priority},c.round+1);else if(c.t.hp>0)healthRules.drainPercent(c,c.t.stats.maxHp/3,'次元领域吸取','次元领域吸取');}if(c.a.hp>0&&e.end===c.round){c.addShield(c.a,500,'bed-domain-expiry');c.a.suitState.barrier+=500;}}}};
`;
fs.writeFileSync(p,s.slice(0,at)+code+s.slice(at));
replace('seerapi.cjs',"const entry={13983:","const entry={11680:['71f52076',3],13983:");
// Re-convert only the newly supported real multi-target source; preserve every raw return.
const raw=require('./4184-source-check.json').records.find(r=>r.url.endsWith('skill/11680')).data,learn=require('./4184-source-check.json').records[0].data.skill.find(x=>x.skill.id===11680),m=s0.moves.find(x=>x.id===11680),converted=require('../seerapi.cjs').convertMove(raw,learn,m.type,{deferTeamEffects:true});
Object.assign(m,converted,{effectIds:raw.skill_effect.map(e=>e.effect.id),effectInstances:raw.skill_effect.map(e=>({id:e.effect.id,args:e.args,description:e.info})),description:raw.skill_effect.map(e=>e.info).join('；'),sourceTargetCount:raw.atk_num});
fs.writeFileSync('research/4184-reviewed-snapshot.json',JSON.stringify(s0,null,2)+'\n');
