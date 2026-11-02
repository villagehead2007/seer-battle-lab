'use strict';
// Draft installer; writes in-memory registry only, never shared files.
module.exports=function(reg){const assert=require('node:assert/strict'),source=require('../../../research/4510-reviewed-snapshot.json'),shield=require('../../../dist/shield-rules.js');
const sh='weiyue:1723:embrace',ba='weiyue:1723:insulate',hasSh=c=>require('../next50-4510/soul1723.draft.cjs').abilities.hasShield(c.a),hasBa=c=>require('../next50-4510/soul1723.draft.cjs').abilities.hasBarrier(c.a);
const instances=id=>source.moves.flatMap(m=>m.effectInstances.map((x,i)=>({m,x,i}))).filter(e=>e.x.id===id),exact=(id,p,m,i)=>instances(id).some(e=>(m.wikiId??m.id)===e.m.id&&m.revision===e.m.revision&&i===e.i&&JSON.stringify(p)===JSON.stringify(e.x.args));
function register(id,phase,execute,hooks,deferred){const e=source.effects.find(e=>e.id===id);reg[id]=Object.freeze({id,template:e.template,argsNum:e.argsNum,instanceArgsNum:e.argsNum,direct:true,phase,execute,hooks,deferred,validate(p,m,i){assert.ok(exact(id,p,m,i),'4510 exact source '+id);}});}
register(1973,'afterHit',c=>{c.soulAbility(1723,'openShield');c.soulAbility(1723,'openBarrier');});
register(1974,'afterHit',c=>{if(c.clearBoost(c.t))c.restorePP(c.a,99);});
register(1976,'beforeOrder',c=>{if(hasSh(c))c.priority++;},{beforeDamage(c){if(hasSh(c))c.modifier*=2;}});
register(1977,'beforeOrder',c=>{if(hasBa(c))c.priority++;},{afterHit(c,p){if(hasBa(c)&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/p[0],c.m.name+'绝缘之罩附加','percent');}});
register(1979,'afterHit',c=>{if(c.a.soulId===1723&&(hasSh(c)||hasBa(c)))throw Error('4510自身消耗与死亡解放及清回合顺序待确认');if(c.a.hp>0){c.a.hp=0;c.emit(c.name(c.a)+' 消耗全部体力。');}const clearedTurns=c.clear(c.t),clearedBoost=c.clearBoost(c.t);c.a.soulState.weiyueSuccessorPreparation={round:c.round,restoreHp:clearedTurns,restorePP:clearedBoost};},undefined,'真实己方下只出场精灵在两项分别消除成功时全体力/全PP恢复；当前消耗及两种消除独立实现');
for(const id of [1975,1959]){const old=reg[id];reg[id]=Object.freeze({...old,validate(p,m,i){if(exact(id,p,m,i))return;old.validate(p,m,i);}});}
// 1959 draft uses actual new status31臣服; old sources retain original handling.
{const old=reg[1959];reg[1959]=Object.freeze({...old,execute(c,p){if(!exact(1959,p,c.m,c.effectInstanceIndex))return old.execute(c,p);const clear=c.clear(c.t),applied=!!(clear&&c.ailment(c.t,'臣服',c.a,false,false,null,{probabilityPercent:100}));c.a.soulState.clearSleep1959={round:c.round,move:c.m.id,doubled:clear&&!applied};}});}
// New single-stage 1128/1827 branches retain exact source binding and old executors.
for(const [id,key]of [[1128,'nextAttackInvalid1128'],[1827,'nextStatusInvalid1827']]){const old=reg[id];reg[id]=Object.freeze({...old,validate(p,m,i){if(exact(id,p,m,i))return;old.validate(p,m,i);},execute(c,p){if(!exact(id,p,c.m,c.effectInstanceIndex))return old.execute(c,p);},hooks:{...(old.hooks??{}),afterUse(c,p){if(exact(id,p,c.m,c.effectInstanceIndex)){if(c.t.hp<=0)c.t.counts[key]=(c.t.counts[key]??0)+p[0];}else old.hooks?.afterUse?.(c,p);}}});}
};



