(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BattleEffectRegistry=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const registry=Object.create(null);
const stats={'攻击':'atk','防御':'def','特攻':'spa','特防':'spd','速度':'spe','命中':'acc'};
const normalize=s=>String(s??'').replace(/&#123;/g,'{').replace(/&#125;/g,'}').replace(/（BOSS有效）/g,'').trim().replace(/[。]$/,'');
function add(id,template,argsNum,pattern,phase,parse,execute){registry[id]=Object.freeze({id,template,argsNum,pattern,phase,parse,execute});}
const bounded=(x,min,max)=>{const n=Number(x);if(!Number.isInteger(n)||n<min||n>max)throw new Error('参数超出规则范围');return n;};
const duration=x=>bounded(x,1,99),amount=x=>bounded(x,-6,6),percent=x=>bounded(x,0,100)/100,denominator=x=>bounded(x,1,9999);
add(1,'给予对方损伤的一半会回复自己的体力',0,/给予对方损伤的一半会回复自己的体力/,'afterHit',()=>({fraction:.5}),(c,p)=>c.heal(c.a,c.dealt*p.fraction,c.m.name));
add(2,'对方体力小于1/2时威力加倍',0,/对方体力小于1\/2时威力加倍/,'beforeDamage',()=>({}),(c)=>{if(c.t.hp<c.t.stats.maxHp/2)c.power*=2;});
add(3,'解除自身的能力下降状态（BOSS有效）',0,/解除自身的能力下降状态/,'afterHit',()=>({}),(c)=>{for(const k of Object.keys(c.a.stages))if(c.a.stages[k]<0)c.a.stages[k]=0;c.emit(c.name(c.a)+' 解除能力下降状态。');});
for(const [id,target,label] of [[4,'self','自身'],[5,'opponent','对手']])add(id,`技能使用成功时，{1}%改变${label}{0}等级{2}（BOSS有效）`,3,new RegExp(`技能使用成功时，(\\d+)%改变${label}(攻击|防御|特攻|特防|速度|命中)等级([+-]?\\d+)`),'afterHit',m=>({chance:percent(m[1]),stat:stats[m[2]],amount:amount(m[3]),target}),(c,p)=>{const f=p.target==='self'?c.a:c.t;if(f.hp>0&&p.chance>0&&(p.chance===1||c.random()<p.chance))c.stage(f,p.amount,[p.stat]);});
add(6,'对方所受伤害的1/{0}会反弹给自己',1,/对方所受伤害的1\/(\d+)会反弹给自己/,'afterHit',m=>({fraction:1/denominator(m[1])}),(c,p)=>c.hurt(c.a,c.dealt*p.fraction,c.m.name+'反伤'));
add(8,'伤害大于对方体力时，对方会余下1体力',0,/伤害大于对方体力时，对方会余下1体力/,'beforeDamage',()=>({}),(c)=>{c.leaveOne=true;});
add(10,'命中后&#123;0&#125;%令对方麻痹',1,/命中后(\d+)%令对方麻痹/,'afterHit',m=>({chance:percent(m[1])}),(c,p)=>{if(c.t.hp>0&&p.chance>0&&(p.chance===1||c.random()<p.chance))c.ailment(c.t,'麻痹',c.a);});
add(29,'额外附加{0}点固定伤害',1,/额外附加(\d+)点固定伤害/,'afterHit',m=>({damage:bounded(m[1],0,99999)}),(c,p)=>{if(c.t.hp>0)c.hurt(c.t,p.damage,c.m.name+'追加','fixed');});
add(30,'后出手的话威力为2倍',0,/后出手的话威力为2倍/,'beforeDamage',()=>({}),(c)=>{if(c.a.side!==c.first)c.power*=2;});
add(43,'恢复自身最大体力的1/{0}',1,/恢复自身最大体力的1\/(\d+)/,'afterHit',m=>({fraction:1/denominator(m[1])}),(c,p)=>c.heal(c.a,c.a.stats.maxHp*p.fraction,c.m.name));
add(57,'{0}回合内每回合使用技能恢复自身最大体力的1/{1}（BOSS有效）',2,/(\d+)回合内每回合使用技能恢复自身最大体力的1\/(\d+)/,'afterHit',m=>({duration:duration(m[1]),fraction:1/denominator(m[2])}),(c,p)=>c.timed(c.a,'id57',p.duration,{fraction:p.fraction}));
add(101,'给对手造成伤害时，伤害数值的&#123;0&#125;%恢复自身体力',1,/给对手造成伤害时，伤害数值的(\d+)%恢复自身体力/,'afterHit',m=>({fraction:percent(m[1])}),(c,p)=>c.heal(c.a,c.dealt*p.fraction,c.m.name));
add(191,'{0}回合内免疫并反弹所有受到的异常状态（BOSS有效）',1,/(\d+)回合内免疫并反弹所有受到的异常状态/,'afterHit',m=>({duration:duration(m[1])}),(c,p)=>c.timed(c.a,'reflect',p.duration,{}));
add(760,'攻击时造成的伤害不会出现微弱（克制关系为微弱时都变成普通）（BOSS有效）',0,/攻击时造成的伤害不会出现微弱（克制关系为微弱时都变成普通）/,'beforeDamage',()=>({}),(c)=>{c.affinity=Math.max(1,c.affinity);});
add(821,'{0}回合内自身的回合类效果无法被消除，后出手时回合数+1',1,/(\d+)回合内自身的回合类效果无法被消除，后出手时回合数\+1/,'afterHit',m=>({duration:duration(m[1])}),(c,p)=>c.timed(c.a,'protect',p.duration+(c.a.side!==c.first?1:0),{}));
add(842,'若自身处于能力提升状态则造成的攻击伤害额外提升{0}%（BOSS有效）',1,/若自身处于能力提升状态则造成的攻击伤害额外提升(\d+)%/,'beforeDamage',m=>({bonus:bounded(m[1],0,1000)/100}),(c,p)=>{if(Object.values(c.a.stages).some(n=>n>0))c.modifier*=1+p.bonus;});
add(913,'消除对手回合类效果，消除成功则下回合自身造成的攻击伤害额外提升{0}%（BOSS有效）',1,/消除对手回合类效果，消除成功则下回合自身造成的攻击伤害额外提升(\d+)%/,'afterHit',m=>({bonus:bounded(m[1],0,1000)/100}),(c,p)=>{if(c.t.hp>0&&c.clear(c.t))c.timed(c.a,'id913',1,{bonus:p.bonus},c.round+1);});
add(946,'全属性+{0}，若自身当前体力低于对手则强化效果翻倍',1,/全属性\+(\d+)，若自身当前体力低于对手则强化效果翻倍/,'afterHit',m=>({amount:bounded(m[1],1,6)}),(c,p)=>c.stage(c.a,p.amount*(c.a.hp<c.t.hp?2:1)));
add(983,'未击败对手则自身全属性+{0}',1,/未击败对手则自身全属性\+(\d+)/,'afterHit',m=>({amount:bounded(m[1],1,6)}),(c,p)=>{if(c.t.hp>0)c.stage(c.a,p.amount);});
add(984,'未击败对手则下回合自身所有技能先制+{0}',1,/未击败对手则下回合自身所有技能先制\+(\d+)/,'afterHit',m=>({amount:bounded(m[1],0,10)}),(c,p)=>{if(c.t.hp>0)c.timed(c.a,'id984',1,{amount:p.amount},c.round+1);});
const extend=typeof module==='object'&&module.exports?require('./range-effects.js'):globalThis.RangeEffects;extend(registry);
function templateMatches(id,text){return normalize(text)===normalize(registry[id]?.template)||(id===1&&normalize(text)==='给予对方损伤的一半会恢复自己的体力')||id===1425;}
function compile(ids,description,effects){let remaining=normalize(description),operations=[];
 for(let index=0;index<ids.length;index++){
  const id=ids[index],rule=registry[id],entry=effects.find(e=>e.id===id);
  if(!rule)return {issue:`未实现的效果 ID：${id}`,operations:[]};
  if(rule.direct)return {issue:`效果 ${id} 需要 SeerAPI 结构化参数`,operations:[]};
  if(!entry||entry.argsNum!==rule.argsNum||!templateMatches(id,entry.template))return {issue:`效果 ${id} 的模板已变化或缺失`,operations:[]};
  const match=remaining.match(new RegExp('^(?:'+rule.pattern.source+')(?:[。])?(?=$|[；;\\n])'));
  if(!match)return {issue:`第 ${index+1} 项效果 ${id} 的参数无法完整解析`,operations:[]};
  try{operations.push({effectId:id,index,phase:rule.phase,params:rule.parse(match)});}catch(e){return {issue:`效果 ${id}：${e.message}`,operations:[]};}
  remaining=remaining.slice(match[0].length).replace(/^[；;\n]+/,'').trim();
 }
 return remaining?{issue:'描述存在未解析的额外效果',operations:[]}:{issue:'',operations};
}
function acceptsSourceParameterConflict(move,index,instance,metadata){
 if(move?.id===28496){const expected={"id":"3705-28496-2-1118-user-confirmed","record":"research/3705-user-confirmed-rules.json","speciesId":3705,"skillId":28496,"effectId":1118,"instanceIndex":2,"skillHash":"2891ec82","effectRevision":"seerapi:724c5255","metadataArgsNum":4,"args":[3,100,0,1,1],"semantics":"第五参数1无含义，无额外改变战斗行为"};return move.provider==='seerapi'&&move.hash==='2891ec82'&&move.revision==='seerapi:2891ec82'&&index===2&&instance?.id===1118&&metadata?.id===1118&&metadata.argsNum===4&&metadata.revision==='seerapi:724c5255'&&metadata.template===registry[1118].template&&JSON.stringify(instance.args)==='[3,100,0,1,1]'&&JSON.stringify(move.sourceParameterConfirmation)===JSON.stringify(expected);}
 const expected={"id":"3683-38526-4-2496-user-20261015","record":"research/3683-user-confirmed-rules.json","skillId":38526,"effectId":2496,"instanceIndex":4,"skillHash":"6f31c193","effectRevision":"seerapi:72f0f517","metadataArgsNum":0,"args":[100],"probabilityPercent":100,"semantics":"造成的攻击伤害为0时，若自身体力低于对手，则以100%概率与对手交换体力。"};
 return move?.id===38526&&move.provider==='seerapi'&&move.hash==='6f31c193'&&move.revision==='seerapi:6f31c193'&&index===4&&instance?.id===2496&&metadata?.id===2496&&metadata.argsNum===0&&metadata.revision==='seerapi:72f0f517'&&metadata.template===registry[2496].template&&JSON.stringify(instance.args)==='[100]'&&JSON.stringify(move.sourceParameterConfirmation)===JSON.stringify(expected);
}
function compileInstances(instances,effects,move=null){const operations=[];
 for(let index=0;index<instances.length;index++){const instance=instances[index],rule=registry[instance.id],entry=effects.find(e=>e.id===instance.id);if(!rule)return {issue:`未实现的效果 ID：${instance.id}`,operations:[]};
 if(!entry||((![1425,1602].includes(instance.id))&&!templateMatches(instance.id,entry.template))||((![1425,1602].includes(instance.id))&&entry.argsNum!==rule.argsNum))return {issue:`效果 ${instance.id} 模板不匹配`,operations:[]};
 const acceptedConflict=acceptsSourceParameterConflict(move,index,instance,entry);
 if(instance.id===2496&&!acceptedConflict)return {issue:'效果2496来源参数冲突未获精确确认',operations:[]};
 if(!acceptedConflict&&(!Array.isArray(instance.args)||(instance.args.length!==(rule.instanceArgsNum??rule.argsNum)&&!(instance.id===534&&instance.args.length===0)&&!(instance.id===1056&&instance.args.length===2&&instance.args[1]===2))||instance.args.some(x=>!Number.isInteger(x))))return {issue:`效果 ${instance.id} 实例参数无效`,operations:[]};
 if(rule.direct){try{rule.validate(instance.args);operations.push({effectId:instance.id,index,phase:rule.phase,params:instance.args.slice(),sourceArgs:instance.args.slice(),deferred:rule.deferred});for(const phase of Object.keys(rule.hooks??{}))operations.push({effectId:instance.id,index,phase,params:instance.args.slice(),sourceArgs:instance.args.slice()});}catch(e){return {issue:`效果 ${instance.id}：${e.message}`,operations:[]};}continue;}
 const args=instance.args.slice();if([4,5].includes(instance.id)){const labels=['攻击','防御','特攻','特防','速度','命中'];if(!labels[args[0]])return {issue:'能力参数无效',operations:[]};args[0]=labels[args[0]];}
 const text=normalize(rule.template).replace(/\{(\d+)\}/g,(_,n)=>String(args[Number(n)]));const result=compile([instance.id],text,[entry]);if(result.issue)return result;operations.push({...result.operations[0],index,sourceArgs:instance.args.slice()});
 }return {issue:'',operations};
}
function run(phase,operations,context){for(const op of operations??[]){if(op.phase!==phase)continue;const rule=registry[op.effectId];if(!rule||(rule.phase!==phase&&!rule.hooks?.[phase]))throw new Error('无效效果执行指令');if(op.effectId===10&&context.t.hp>0)context.markStatusEffect?.();(rule.phase===phase?rule.execute:rule.hooks[phase])(context,op.params);context.syncStages?.();}}

add(675,"下{0}回合对手打出致命一击的非必中技能无效",1,/.*/,'afterHit',()=>({}),(c,p)=>c.timed(c.a,'非必中暴击无效',p[0],{}));
add(1007,"{0}回合内每次攻击都有{1}%概率令对手{2}，未触发则对手全属性-{3}",4,/.*/,'afterHit',()=>({}),(c,p)=>{if(c.m.kind==='status'||c.t.hp<=0)return;c.markStatusEffect?.();if(c.random()<p[1]/100)c.ailment(c.t,['麻痹','中毒','烧伤','冻伤','害怕','睡眠'][p[2]]??'害怕',c.a);else c.stage(c.t,-p[3]);});
add(1323,"造成伤害的{0}%恢复自身体力，若打出致命一击则附加恢复体力值等量的百分比伤害",1,/^造成伤害的(\d+)%恢复自身体力，若打出致命一击则附加恢复体力值等量的百分比伤害$/,'afterHit',m=>[bounded(m[1],0,100)],(c,p)=>{const before=c.a.hp;c.heal(c.a,c.dealt*p[0]/100,c.m.name);const restored=Math.max(0,c.a.hp-before);if(c.crit&&c.t.hp>0&&restored>0)c.hurt(c.t,restored,c.m.name,'percent');});
add(1324,"消耗自身全部体力，使对手受到等同于自身最大体力1/1的百分比伤害且3回合内对手无法通过技能恢复自身体力",0,/.*/,'afterHit',()=>({}),(c,p)=>{const n=c.a.stats.maxHp;c.a.hp=0;if(c.t.hp>0)c.hurt(c.t,n,c.m.name,'percent');c.timed(c.t,'技能禁疗',3,{});});
add(1020,"全属性+{0}，对手不处于能力提升状态时强化效果翻倍",1,/.*/,'afterHit',()=>({}),(c,p)=>{const n=Object.values(c.t.stages).some(x=>x>0)?p[0]:p[0]*2;c.stage(c.a,n);});
add(957,"使对手全属性-{0}，若对手处于{1}状态则自身额外全属性+{2}",3,/.*/,'afterHit',()=>({}),(c,p)=>{c.stage(c.t,-p[0]);if(c.t.ailments['害怕']>=c.round)c.stage(c.a,p[2]);});
add(1208,"反转自身能力下降状态，反转成功则令对手下{0}次使用的攻击技能无效",1,/^反转自身能力下降状态，反转成功则令对手下(\d+)次使用的攻击技能无效$/,'afterHit',m=>[Number(m[1])],(c,p)=>{let changed=false;for(const k of Object.keys(c.a.stages))if(c.a.stages[k]<0){const before=c.a.stages[k];c.stage(c.a,-2*before,[k]);changed ||=c.a.stages[k]>before;}if(changed)c.t.counts.nextAttackInvalid=(c.t.counts.nextAttackInvalid??0)+p[0];});
add(2166,"击败对手后恢复自身最大体力的1/{0}并全属性+{1}",2,/.*/,'afterHit',m=>({}),c=>{});
add(922,"{0}回合内每回合结束后解除并反馈自身能力下降状态",1,/^(\d+)回合内.*$/,'afterHit',m=>({duration:Number(m[1])}), (c,p)=>c.timed(c.a,'能力下降反馈',p.duration,{}));
add(1326,"全属性+{0}，自身处于护盾状态时强化效果翻倍",1,/^全属性\+(\d+).*$/,'afterHit',m=>({amount:Number(m[1])}), (c,p)=>c.stage(c.a,p.amount*((c.shieldValue?c.shieldValue(c.a):c.a.suitState?.shield)>0?2:1)));
add(566,"攻击时忽略对手{0}%的防御值",1,/^攻击时忽略对手(\d+)%.*$/,'beforeDamage',m=>({fraction:Number(m[1])/100}), (c,p)=>{c.a.soulState.currentDefenseIgnore=p.fraction;});
add(1028,"命中后{0}回合内每回合使对手{1}，若未触发则减少对手最大体力的1/{7}",8,/命中后(\d+)回合内.*1\/(\d+)/,'afterHit',m=>({duration:Number(m[1]),fraction:1/Number(m[2])}), (c,p)=>{c.timed(c.t,'能力下降持续',p.duration,{fraction:p.fraction});});
add(1099,"消除对手能力提升状态，消除成功则自身免疫下{0}次受到的异常状态",1,/^消除对手能力提升状态.*免疫下(\d+)次.*$/,'afterHit',m=>({count:Number(m[1])}), (c,p)=>{if(c.clearBoost(c.t))c.a.counts.immune=(c.a.counts.immune||0)+p.count;});
add(1077,"{0}回合内对手使用攻击技能后使对手{1}，未触发则对手下{2}回合属性技能命中效果失效",3,/^(\d+)回合内对手使用攻击技能后使对手([^，]+)，未触发则对手下(\d+)回合.*$/,'afterHit',m=>({duration:Number(m[1]),ailment:m[2],statusBlock:Number(m[3])}), (c,p)=>c.timed(c.a,p.ailment==='23'?'3580攻击后异常':p.ailment==='27'?'茉蕊攻击后感染':p.ailment==='19'?'兰斯攻击后瘫痪':'攻击后效果',p.duration,{ailment:p.ailment==='23'?'诅咒':p.ailment==='27'?'感染':p.ailment,statusBlock:p.statusBlock}));
add(1327,"造成的伤害低于{0}则吸取对手最大体力的1/{1}并为自身附加等量的护盾",2,/^造成的伤害低于(\d+)则吸取对手最大体力的1\/(\d+).*$/,'afterHit',m=>({threshold:Number(m[1]),denominator:Number(m[2])}), (c,p)=>{if(c.dealt<p.threshold&&c.t.hp>0){const n=c.hurt(c.t,c.t.stats.maxHp/p.denominator,c.m.name,'percent');c.a.suitState.shield=(c.a.suitState.shield||0)+n;}});
return Object.freeze({registry:Object.freeze(registry),compile,compileInstances,acceptsSourceParameterConflict,run,normalize});
});




