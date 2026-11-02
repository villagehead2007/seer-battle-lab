const exact4586=(m,i,b,p)=>!!m&&(m.wikiId??m.id)===b.moveId&&(m.hash===b.hash||m.hash===undefined&&typeof m.id==='string'&&m.id.startsWith('wiki:'))&&m.revision==='seerapi:'+b.hash&&i===b.index&&JSON.stringify(p)===JSON.stringify(b.args);
metadata[2086]={"info":"空元之诗·渍：若技能无效，则消除对手回合类效果、能力提升效果，消除成功任意一项则令对手诅咒","args_num":0};
metadata[2087]={"info":"空元之诗·镀：若对手处于控制类异常状态，则己方免疫下2次受到的异常状态","args_num":0};
metadata[2088]={"info":"空元之诗·柱：若对手处于回合类效果，则对手每有1个技能PP值不为满附加50点次元·龙系伤害且对手下回合无法主动切换精灵","args_num":0};
metadata[2089]={"info":"空元之诗·烙：若自身为先出手，则此技能每剩余1点PP值附加50点次元·龙系伤害，下次击败对手后恢复自身全部体力与PP值","args_num":0};
metadata[2090]={"info":"空元之诗·均：附加双方体力上限差值50%的次元·龙系伤害，自身体力上限高于对手时额外吸取对手第五技能剩余的PP值，自身体力上限低于对手时附加伤害翻倍","args_num":0};
metadata[2092]={"info":"全属性+{0}并将空妄诗章补充至与自身先制等级相等，自身没有空妄诗章时额外书写{1}篇，拥有时强化效果翻倍","args_num":2};
metadata[2094]={"info":"自身每有1篇空妄诗章造成的攻击伤害提升{0}%，若空妄诗章的篇数高于{1}则每有1篇额外附加{2}点真实伤害","args_num":3};
metadata[2095]={"info":"自身为满体力时{0}%令对手{1}，未触发则下{2}回合对手所有技能先制-{3}","args_num":4};
metadata[2097]={"info":"自身不为满体力时{0}回合内对手属性技能无效","args_num":1};
metadata[2099]={"info":"{0}回合内对手使用属性技能后，自身恢复最大体力的1/{1}并造成等量百分比伤害","args_num":2};

const verse4586=c=>c.a.soulState.emptyVerses1791??0;
const timedEnemy4586=c=>Object.values(c.t.effects).some(e=>conditionStatusRules.timedPresent(e,c.round));
const poemReady4586=c=>c.poem1791===true&&c.a.hp>0&&c.t.hp>0;
const typedPoem4586=(c,n)=>{if(n<=0)return;if(!c.qualifiedTypedPoem1791)throw Error('Q-N50-4586-006：次元龙附加伤害结算机制待确认');if(c.qualifiedTypedPoem1791==='attack')c.typedAttack(n,'次元龙');else if(['fixed','percent','true'].includes(c.qualifiedTypedPoem1791))c.hurt(c.t,n,'明确诗附伤载荷',c.qualifiedTypedPoem1791);else throw Error('invalid qualified poem type');};
add(2086,'poem1791',c=>{if(!poemReady4586(c)||!registry[2086].poemCondition(c))return;const a=c.clear(c.t),b=c.clearBoost(c.t);if(a||b)c.ailment(c.t,'诅咒',c.a);});
add(2087,'poem1791',c=>{if(!poemReady4586(c)||!registry[2087].poemCondition(c))return;if(c.a.counts.immune>0||c.a.soulState.immunity1757Charges?.length||c.a.soulState.oracle2059Charges?.length||c.a.soulState.jiege1819Charges>0)throw Error('Q-N50-4511-006：诗免疫次数与其他来源授予待确认');c.a.counts.immune=2;c.a.soulState.emptyPoemImmune1791=2;});
add(2088,'poem1791',c=>{if(!poemReady4586(c)||!registry[2088].poemCondition(c))return;typedPoem4586(c,c.t.moves.filter(k=>c.t.pp[k]<c.maxPP(k)).length*50);c.timed(c.t,'禁止主动切换',1,{},c.round+1);},[],'诗柱下回合无法主动切换精灵：真实换宠拦截延期，当前附加次元龙伤害已实现');
add(2089,'poem1791',c=>{if(!poemReady4586(c)||!registry[2089].poemCondition(c))return;typedPoem4586(c,(c.a.pp[c.m.id]??0)*50);c.a.counts.emptyPoemDefeatRestore1791=(c.a.counts.emptyPoemDefeatRestore1791??0)+1;});
add(2090,'poem1791',c=>{if(!poemReady4586(c))return;const diff=c.a.stats.maxHp-c.t.stats.maxHp;if(diff>0)c.absorbFifthPP(c.a,c.t);typedPoem4586(c,Math.abs(diff)*.5*(diff<0?2:1));});
for(const [id,condition]of [[2086,c=>{const o=c.poemOutcome1791;if(!o||o.invalid===undefined)throw Error('Q-N50-4514-001：诗渍技能无效判定待确认');return o.invalid===true;}],[2087,c=>Object.keys(c.t.ailments).some(k=>c.t.ailments[k]>=c.round&&c.isControlAilment(k))],[2088,timedEnemy4586],[2089,c=>c.first===c.a.side],[2090,()=>true]])registry[id]=Object.freeze({...registry[id],poemCondition:condition});

