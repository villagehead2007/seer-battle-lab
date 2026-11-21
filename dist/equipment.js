(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BattleEquipment=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SUITS={
    none:{name:'不穿套装',flat:{},percent:{},statsText:'无面板加成',passive:'无套装被动。'},
    royal:{name:'皇御',flat:{maxHp:105,def:55,spd:55,spe:55},percent:{},statsText:'体力 +105，防御、特防、速度各 +55',passive:'受击不足300反击300固伤，否则下次攻击增伤40%；首回合受击后回合末回复1/4体力；整回合未受击则下回合攻击附加自身最大体力15%的百分比伤害。'},
    destiny:{name:'胜天之命',flat:{atk:75,spa:75,spe:65},percent:{},statsText:'攻击、特攻各 +75，速度 +65',passive:'用招后回合末获得1层胜天之力，对手未用招则2层，上限10层；每层攻击增伤4%、固伤和百分比减伤2%；攻击不足300时每层吸取对手2%最大体力，否则每层附加本次伤害4%的百分比伤害。'},
    dawn:{name:'晨曦',flat:{maxHp:60,spe:60},percent:{},statsText:'体力、速度各 +60',passive:'无异常时回合开始忽略对手10速度；攻击增伤10%、附加100固伤，高于半血翻倍；受击减伤10%，低于半血翻倍；对手攻击后回血100，回复前低于半血则200。'},
    judgment:{name:'裁决',flat:{atk:60,spa:60,spe:80},percent:{},statsText:'攻击、特攻各 +60，速度 +80',passive:'攻击增伤40%；首回合末每损失10%体力获得50护罩（最多300），按当时每50护罩再增加10%攻击伤害（最多40%，本次在场保留）；回合开始无护罩时固伤、百分比减伤5%，每损失15%体力再加5%，最多25%。'},
    corrosion:{name:'腐蚀',flat:{},percent:{atk:10,spa:10},statsText:'攻击、特攻各 +10%（换算后加入面板）',passive:'攻击忽略对手15%双防；受击且存活时登记腐蚀，下回合令对手麻痹1回合，未成功则造成对手最大体力1/6的百分比伤害。'}
  };
  const AILMENTS=['麻痹','疲惫','害怕','睡眠','石化','冰封','瘫痪','焚烬','诅咒','感染','中毒','烧伤','冻伤','易燃','流血','失明','束缚','失神','沉默'];
  const DAMAGE_LABELS={critical:'暴击伤害',fixed:'固定伤害',percent:'百分比伤害'};
  function normalizeResistance(input={}){
    const out={};for(const k of Object.keys(DAMAGE_LABELS)){const v=input[k]??0;if(!Number.isInteger(v)||v<0||v>100)throw new Error(`${DAMAGE_LABELS[k]}抗性必须是 0–100 的整数。`);out[k]=v;}
    out.major=input.major??'';out.minor=input.minor??'';
    if([out.major,out.minor].some(k=>k!==''&&!AILMENTS.includes(k)))throw new Error('请选择有效的异常抗性。');
    if(out.major&&out.major===out.minor)throw new Error('55% 与 18% 抗性不能选择同一种异常。');
    if(input.slots!==undefined){if(!Array.isArray(input.slots)||input.slots.length!==3)throw new Error('异常抗性顺序配置必须恰有三个槽位。');out.slots=input.slots.map((slot,index)=>{if(!slot||typeof slot!=='object'||typeof slot.name!=='string'||(slot.name&&!AILMENTS.includes(slot.name))||!Number.isInteger(slot.chance)||slot.chance<0||slot.chance>100)throw new Error('第'+(index+1)+'异常抗性槽必须提供有效异常与0–100整数概率。');return {name:slot.name,chance:slot.chance};});const names=out.slots.map(x=>x.name).filter(Boolean);if(new Set(names).size!==names.length)throw new Error('三个抗性槽不能重复选择异常。');out.major=out.slots[0].name;out.minor=out.slots[1].name;}return out;
  }
  function suitBonus(id,key,value){if(!Object.hasOwn(SUITS,id))throw new Error('请选择有效套装。');const suit=SUITS[id];return (suit.flat[key]??0)+Math.floor(value*(suit.percent[key]??0)/100);}
  function resistanceChance(f,k){const r=f.build.resistance,base=r.slots?(r.slots.find(x=>x.name===k)?.chance??0)/100:r.major===k?.55:r.minor===k?.18:0,mark=f.soulState?.fiveMarks2125?.火土,round=f.soulState?.availableRound??1;if(f.soulState?.heroOath2009){const slots=r.slots??[{name:r.major,chance:55},{name:r.minor,chance:18}];const best=Math.max(0,...slots.filter(slot=>slot.name).map(slot=>slot.chance));if(best&&slots.some(slot=>slot.name===k&&slot.chance===best))return 1;}if(mark&&mark.start<=round&&mark.end>=round){const slots=r.slots??[{name:r.major,chance:55},{name:r.minor,chance:18}],valid=slots.filter(x=>x.name),max=Math.max(0,...valid.map(x=>x.chance)),best=valid.filter(x=>x.chance===max);if(max>0&&best.length===1&&best[0].name===k)return 1;}return Math.min(1,base+(f.soulState?.curtainResistance2046?.status===k?f.soulState.curtainResistance2046.bonus:0));}
  function damageResistance(f,type){
    if(['fixed','percent'].includes(type)&&(f.soulId===622||(f.soulId==null&&f.species==='emperor')))return 100;
    const mark=f.soulState?.teamXinMark1061,round=f.soulState?.xinMarkRound1061??f.soulState?.calculationRound??f.soulState?.availableRound??1;
    if(['fixed','percent'].includes(type)&&mark?.sourceHash==='e7c06bfc'&&mark.start<=round&&mark.end>=round)return 100;
    return f.build.resistance[type]??0;
  }
  // Pure shared calculation: damage resistance applies to the whole matching damage.
  function mitigate(f,amount,type,{bypass=false,ignoreImmunity=false,ignoreResistance=false}={}){
    let n=Math.max(0,amount);if(bypass)return Math.floor(n);
    if(!ignoreImmunity&&['fixed','percent'].includes(type)&&(f.soulId===622||(f.soulId==null&&f.species==='emperor')))return 0;
    if(!ignoreResistance)n*=1-damageResistance(f,type)/100;
    if(['fixed','percent'].includes(type)&&f.build.suit==='judgment')n*=1-(f.suitState?.judgmentReduction??0);
    if(['fixed','percent'].includes(type)&&f.build.suit==='destiny')n*=1-.02*(f.suitState?.stacks??0);
    return Math.max(0,Math.floor(n));
  }
  return {SUITS,AILMENTS,DAMAGE_LABELS,normalizeResistance,suitBonus,resistanceChance,damageResistance,mitigate};
});
