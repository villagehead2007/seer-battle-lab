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
    return out;
  }
  function suitBonus(id,key,value){if(!Object.hasOwn(SUITS,id))throw new Error('请选择有效套装。');const suit=SUITS[id];return (suit.flat[key]??0)+Math.floor(value*(suit.percent[key]??0)/100);}
  function resistanceChance(f,k){return f.build.resistance.major===k?.55:f.build.resistance.minor===k?.18:0;}
  // Pure shared calculation: damage resistance applies to the whole matching damage.
  function mitigate(f,amount,type,{bypass=false}={}){
    let n=Math.max(0,amount);if(bypass)return Math.floor(n);
    if(['fixed','percent'].includes(type)&&(f.soulId===622||(f.soulId==null&&f.species==='emperor')))return 0;
    n*=1-(f.build.resistance[type]??0)/100;
    if(['fixed','percent'].includes(type)&&f.build.suit==='judgment')n*=1-(f.suitState?.judgmentReduction??0);
    if(['fixed','percent'].includes(type)&&f.build.suit==='destiny')n*=1-.02*(f.suitState?.stacks??0);
    return Math.max(0,Math.floor(n));
  }
  return {SUITS,AILMENTS,DAMAGE_LABELS,normalizeResistance,suitBonus,resistanceChance,mitigate};
});
