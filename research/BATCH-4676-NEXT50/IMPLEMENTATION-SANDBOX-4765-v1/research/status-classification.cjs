'use strict';
// Source-backed metadata only. No engine rules or 2074 handler are registered.
const assert=require('node:assert/strict');
const fields=Object.freeze(['isAbnormal','restrictsSwitching','controlsAction','dealsPeriodicDamage','changesStats','allowsDurationRefresh','stackingRule','isRestrictedClass']);
const semantics=Object.freeze({
 isAbnormal:'原文明示该条目为异常状态；只有枚举名而没有定义时保持null。附属类同样属于异常，不按正负收益筛除。',
 restrictsSwitching:'该状态本体禁止或限制主动切换；限制类标签单独保存在isRestrictedClass，不能代替换宠行为证据。',
 controlsAction:'状态会阻止行动执行，包括有明确触发条件的无法行动。技能无效、MISS、不能造成伤害不自动等于无法行动。true不表示无条件，条件见逐字段证据。',
 dealsPeriodicDamage:'状态本体按回合重复扣血，包括概率扣血；解除伤害、受击增伤或攻击后附伤不等同持续伤害。',
 changesStats:'原文明示改变能力值或能力等级，包括该状态结束时的变化；不将威力、伤害倍率、命中率、先制、展示方式等同能力等级变化。',
 allowsDurationRefresh:'同名状态重新施加时能否刷新已有持续时间；其它状态延长回合不证明此项。',
 stackingRule:'同名状态重施的叠加/覆盖规则；无来源则null，2074用户指定的max规则单独保存在接入方案。',
 isRestrictedClass:'原文对本状态明确标注限制类/非限制类；不能从未标注推导false。',
 null:'未确认。与false不同。true只确认存在所引条件下的行为，不将条件性规则泛化。'
});
function classify(row,source){
 const values=Object.fromEntries(fields.map(k=>[k,null])),evidence=Object.fromEntries(fields.map(k=>[k,null]));
 function confirm(field,quote,scope='state-definition',condition=null){
  assert.ok(row.description?.includes(quote),row.name+': unsupported classification '+quote);
  values[field]=true;evidence[field]={source:'wiki-mechanics',statusName:row.name,quote,url:source.url,revision:source.revision,hash:source.hash,scope,condition};
 }
 const prefix=row.description?.match(/^(弱化类|控制类|附属类)异常状态/);
 if(prefix)confirm('isAbnormal',prefix[0]);
 // Match only the subject's explicit classification, never a referenced group.
 if(/^(?:弱化类|控制类|附属类)异常状态，限制类异常状态(?:，|$)/.test(row.description??''))confirm('isRestrictedClass',prefix[0]+'，限制类异常状态');
 if(row.name==='瘫痪')confirm('restrictsSwitching','精灵无法行动、主动切换','while-active');
 if(row.name==='凝滞')confirm('restrictsSwitching','精灵无法切换','while-active');
 for(const n of ['麻痹','疲惫','害怕','石化','睡眠','感染','冰封','瘫痪','焚烬','诅咒','神游','空定'])if(row.name===n)confirm('controlsAction','精灵无法行动','while-active');
 if(row.name==='狂信')confirm('controlsAction','对手为信仰对象时自身无法行动','conditional-while-active','对手为信仰对象');
 for(const n of ['中毒','冻伤','烧伤','寄生'])if(row.name===n)confirm('dealsPeriodicDamage','每回合都会扣除等同于最大体力的1/8的体力','each-round');
 if(row.name==='流血')confirm('dealsPeriodicDamage','每回合都会扣除80点体力','each-round');
 if(row.name==='混乱')confirm('dealsPeriodicDamage','每回合都会有5%的概率扣除50点体力','conditional-each-round','5%的概率');
 for(const n of ['烈焰诅咒','沉默'])if(row.name===n)confirm('dealsPeriodicDamage','每回合受到最大体力1/8的百分比伤害','each-round');
 const statQuotes={感染:'感染结束后会转化为中毒、攻击、特攻等级-1',冰封:'冰封结束后会转化为冻伤、速度等级-1',焚烬:'焚烬结束后会转化为烧伤、命中等级-1'};
 if(statQuotes[row.name])confirm('changesStats',statQuotes[row.name],'on-status-end',row.name+'结束');
 return {classification:values,classificationEvidence:evidence,classificationPending:fields.filter(k=>values[k]===null)};
}
module.exports={fields,semantics,classify};
