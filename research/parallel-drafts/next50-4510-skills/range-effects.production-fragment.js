// 4510 exact sourced skill additions. Insert inside range-effects factory before final close.
{
const reg=registry,shields=typeof module==='object'&&module.exports?require('./shield-rules.js'):globalThis.BattleShieldRules;
const SH='weiyue:1723:embrace',BA='weiyue:1723:insulate';
function hasHeld(f,key,barrier){const n=barrier?shields.barrierSourceValue(f,key):shields.sourceValue(f,key);if(n<=0&&f.soulState[barrier?'weiyueBarrierHeld':'weiyueShieldHeld'])throw Error('Q-N50-4510-002：盾罩容量耗尽后的持有语义待确认');return n>0;}
const hasSh=c=>hasHeld(c.a,SH,false),hasBa=c=>hasHeld(c.a,BA,true);
const skillMetadata={"1973":{"template":"若自身未持有拥君之盾则开启拥君之盾，若自身未持有绝缘之罩则开启绝缘之罩","argsNum":0},"1974":{"template":"消除对手能力提升状态，消除成功则恢复自身所有技能PP值","argsNum":0},"1976":{"template":"自身持有拥君之盾时先制+1且造成的攻击伤害翻倍","argsNum":0},"1977":{"template":"自身持有绝缘之罩时先制+1且附加自身最大体力1/{0}的百分比伤害","argsNum":1},"1979":{"template":"消耗自身全部体力，消除对手回合类效果，消除成功则令己方下只精灵出战时恢复全部体力，消除对手能力提升状态，消除成功则令己方下只精灵出战时恢复所有技能PP值","argsNum":0}};
const exactRows=[{"id":1128,"moveId":36611,"revision":"seerapi:f0de9f27","index":1,"args":[1]},{"id":1827,"moveId":36612,"revision":"seerapi:f794b023","index":1,"args":[1]},{"id":1973,"moveId":28316,"revision":"seerapi:3df68c9a","index":1,"args":[]},{"id":1974,"moveId":28316,"revision":"seerapi:3df68c9a","index":3,"args":[]},{"id":1975,"moveId":28317,"revision":"seerapi:c1773021","index":2,"args":[4,100,31,0]},{"id":1976,"moveId":36613,"revision":"seerapi:5d08ee3f","index":0,"args":[]},{"id":1959,"moveId":36613,"revision":"seerapi:5d08ee3f","index":1,"args":[100,31]},{"id":1977,"moveId":36614,"revision":"seerapi:c5d213fc","index":0,"args":[3]},{"id":1979,"moveId":28318,"revision":"seerapi:12534ce8","index":0,"args":[]}];
const exact=(id,p,m,i)=>exactRows.some(e=>e.id===id&&(m.wikiId??m.id)===e.moveId&&m.revision===e.revision&&i===e.index&&JSON.stringify(p)===JSON.stringify(e.args));
function register(id,phase,execute,hooks,deferred){const e=skillMetadata[id];reg[id]=Object.freeze({id,template:e.template,argsNum:e.argsNum,instanceArgsNum:e.argsNum,direct:true,phase,execute,hooks,deferred,validate(p,m,i){if(!exact(id,p,m,i))throw Error('4510精确来源不匹配 '+id);}});}
register(1973,'afterHit',c=>{c.soulAbility(1723,'openShield');c.soulAbility(1723,'openBarrier');});
register(1974,'afterHit',c=>{if(c.clearBoost(c.t))c.restorePP(c.a,99);});
register(1976,'beforeOrder',c=>{if(hasSh(c))c.priority++;},{beforeDamage(c){if(hasSh(c))c.modifier*=2;}});
register(1977,'beforeOrder',c=>{if(hasBa(c))c.priority++;},{afterHit(c,p){if(hasBa(c)&&c.t.hp>0)c.hurt(c.t,c.a.stats.maxHp/p[0],c.m.name+'绝缘之罩附加','percent');}});
register(1979,'afterHit',c=>{if(c.a.soulId===1723&&(hasSh(c)||hasBa(c)))throw Error('Q-N50-4510-003：自身消耗与死亡解放及清回合顺序待确认');if(c.a.hp>0){c.a.hp=0;c.emit(c.name(c.a)+' 消耗全部体力。');}const clearedTurns=c.clear(c.t),clearedBoost=c.clearBoost(c.t);c.a.soulState.weiyueSuccessorPreparation={round:c.round,restoreHp:clearedTurns,restorePP:clearedBoost};},undefined,'真实己方下只出场精灵在两项分别消除成功时全体力/全PP恢复；当前消耗及两种消除独立实现');
for(const id of [1975,1959]){const old=reg[id];reg[id]=Object.freeze({...old,validate(p,m,i){if(exact(id,p,m,i))return;old.validate(p,m,i);}});}
// 1959 draft uses actual new status31臣服; old sources retain original handling.
{const old=reg[1959];reg[1959]=Object.freeze({...old,execute(c,p){if(!exact(1959,p,c.m,c.effectInstanceIndex))return old.execute(c,p);const clear=c.clear(c.t),applied=!!(clear&&c.ailment(c.t,'臣服',c.a,false,false,null,{probabilityPercent:100}));c.a.soulState.clearSleep1959={round:c.round,move:c.m.id,doubled:clear&&!applied};}});}
// New single-stage 1128/1827 branches retain exact source binding and old executors.
for(const [id,key]of [[1128,'nextAttackInvalid1128'],[1827,'nextStatusInvalid1827']]){const old=reg[id];reg[id]=Object.freeze({...old,validate(p,m,i){if(exact(id,p,m,i))return;old.validate(p,m,i);},execute(c,p){if(!exact(id,p,c.m,c.effectInstanceIndex))return old.execute(c,p);},hooks:{...(old.hooks??{}),afterUse(c,p){if(exact(id,p,c.m,c.effectInstanceIndex)){if(c.t.hp<=0)c.t.counts[key]=(c.t.counts[key]??0)+p[0];}else old.hooks?.afterUse?.(c,p);}}});}
}
