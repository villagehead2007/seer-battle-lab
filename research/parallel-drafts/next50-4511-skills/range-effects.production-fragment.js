// Insert in range-effects.js factory before its closing line.
{
metadata[2000]={info:'若对手处于能力提升状态则先制+1且必定命中',args_num:0};
add(2000,'beforeOrder',c=>{if(Object.values(c.t.stages).some(n=>n>0))c.priority++;},[],undefined,undefined,{beforeAccuracy(c){if(Object.values(c.t.stages).some(n=>n>0))c.alwaysHit=true;}});
metadata[2002]={info:'若对手不处于能力提升状态则消除对手回合类效果，消除成功则令对手{0}',args_num:1};
add(2002,'afterHit',(c,p)=>{if(!Object.values(c.t.stages).some(n=>n>0)&&c.clear(c.t))c.ailment(c.t,ailments[p[0]],c.a);},[[31,31]]);
metadata[2003]={info:'若对手处于能力提升状态则造成的攻击伤害提升{0}%，先出手时提升效果翻倍',args_num:1};
add(2003,'beforeDamage',(c,p)=>{if(Object.values(c.t.stages).some(n=>n>0))c.modifier*=1+p[0]/100*(c.a.side===c.first?2:1);},[pct]);
metadata[2004]={info:'若对手不处于能力提升状态则{0}%令对手{1}',args_num:2};
add(2004,'afterHit',(c,p)=>{if(!Object.values(c.t.stages).some(n=>n>0)&&statusRoll(c,p[0]))c.ailment(c.t,'凝滞',c.a);},[pct,[32,32]]);
metadata[2005]={info:'{0}%令对手{1}，未触发则为对手附加{2}点护盾',args_num:3};
add(2005,'afterHit',(c,p)=>{if(!(statusRoll(c,p[0])&&c.ailment(c.t,ailments[p[1]],c.a)))c.addShield(c.t,p[2]);},[pct,[6,6],[0,99999]]);
metadata[2006]={info:'技能无效时，免疫下1次对手的攻击，免疫成功则令对手全属性+1',args_num:0};
add(2006,'onInvalid',c=>{if(c.a.soulState.nanShuangInvalidNullify>0)throw Error('Q-N50-4511-006：重复2006授予叠加或覆盖待确认');c.a.counts.attackNullify=(c.a.counts.attackNullify??0)+1;c.a.soulState.nanShuangInvalidNullify=(c.a.soulState.nanShuangInvalidNullify??0)+1;});
metadata[2007]={info:'{0}回合内每回合使用技能恢复自身最大体力的1/{1}，每回合结束后若对手处于能力提升状态则吸取对手{2}点体力且为对手附加等量护盾',args_num:3};
add(2007,'afterHit',(c,p)=>{c.timed(c.a,'id57',p[0],{fraction:1/p[1]});c.timed(c.a,'南霜回合末吸取授盾',p[0],{amount:p[2]});},[turns,[1,9999],[0,99999]]);
metadata[2008]={info:'{0}回合内若自身能力提升状态被消除或吸取则令自身免疫下{1}次受到的异常状态',args_num:2};
add(2008,'afterHit',(c,p)=>c.timed(c.a,'南霜清强免异常',p[0],{count:p[1]}),[turns,[1,99]]);
// Source-specific enum extension; older 2001 instances retain validation.
{const old=registry[2001];registry[2001]=Object.freeze({...old,validate(p,m,i){if((m.wikiId??m.id)===36622&&m.hash==='8c89c2cf'&&m.revision==='seerapi:8c89c2cf'&&i===1&&JSON.stringify(p)==='[100,31,3]')return;old.validate(p,m,i);}});}
}
{
metadata[2009]={info:'若对手处于异常状态则{0}回合内令对手使用的属性技能无效',args_num:1};add(2009,'afterHit',(c,p)=>{if(conditionStatusRules.conditionPresent(c.t,c.round))c.timed(c.t,'statusBlock',p[0],{});},[turns]);
metadata[2010]={info:'对手每存在{0}点护盾则造成的攻击伤害提升{1}倍',args_num:2};add(2010,'beforeDamage',(c,p)=>{if(c.shieldValue(c.t)>0)throw Error('Q-N50-4511-003：效果2010正护盾分档与提升倍数待确认');},[[1,99999],[0,9999]]);
metadata[1933]={info:'击败对手则{0}%令自身{1}',args_num:2};add(1933,'afterAttack',(c,p)=>{if(c.t.hp<=0&&c.a.hp>0&&statusRoll(c,p[0]))c.ailment(c.a,'凝滞',c.a);},[pct,[32,32]]);
}
// Q006: actual existing 46 source overwrites the shared counter directly.
{const old=registry[46];registry[46]=Object.freeze({...old,execute(c,p){if(c.a.soulState.nanShuangInvalidNullify>0)throw Error('Q-N50-4511-006：效果46覆盖2006免伤奖励来源时的规则待确认');return old.execute(c,p);}});}
