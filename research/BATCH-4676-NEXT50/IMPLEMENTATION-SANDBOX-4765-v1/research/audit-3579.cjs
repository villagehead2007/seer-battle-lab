'use strict';
// Source audit only: project policy skips species with no soulmark.
const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'seerapi-cache','3579');
const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const pet=read('pet-3579.json'),manifest=read('manifest.json');
const E=require('../dist/engine.js');
const verified=new Set([3575,3576,3577,3578].flatMap(id=>require('../data/species/'+id+'.json').snapshot.moves.flatMap(m=>m.effectIds)));
const evidence=file=>manifest.records.find(x=>x.file===file);
const skills=pet.skill.map(learn=>{
  const m=read('skill-'+learn.skill.id+'.json');
  return {learning:learn,raw:m,source:evidence('skill-'+m.id+'.json'),effects:m.skill_effect.map((e,index)=>({
    key:`3579:skill:${m.id}:${index}`,id:e.effect.id,args:e.args,description:e.info,
    metadata:read('skill_effect_type-'+e.effect.id+'.json'),source:evidence('skill_effect_type-'+e.effect.id+'.json'),
    classification:'single',classificationLabel:'单精灵范围（当前无魂印策略跳过，未认证实现）',
    rationale:e.effect.id===445?'原文为本次使用技能后战斗结算发放赛尔豆和每日上限，属于账号奖励，不依赖队伍、替补或换宠；不能冒充多精灵延期，也不能声称已有战斗状态实现。':'原文仅涉及当前在场双方的能力、体力、PP、异常、伤害或回合状态，没有队伍、替补、下一只出场或换宠依赖。',
    nonCombatReward:e.effect.id===445,
    reuse:verified.has(e.effect.id)?'3575–3578已有相同效果ID；本实例仍需独立状态测试才能认证':E.WIKI.effectsEngine.registry[e.effect.id]?'存在规则入口，尚未为3579验证':'当前注册表缺少规则入口',
    implementationStatus:'not-certified-species-skipped'
  }))};
});
const audit={species:3579,name:pet.name,status:'skipped',reason:'SeerAPI pet.soulmark=[]；按AGENTS.md与local-species.cjs无魂印策略跳过，不部署、不认定阶段完成。',source:evidence('pet-3579.json'),sourceManifest:manifest,soulmarks:pet.soulmark,baseStats:pet.base_stats,type:read('element_type_combination-'+pet.type.id+'.json'),skills,
  enhancements:{advance:pet.advance,additionalSkills:pet.skill.filter(x=>x.is_special||x.is_advanced),friendEffects:skills.flatMap(x=>x.raw.friend_skill_effect??[]),decision:'来源未列伙伴、羁绊、觉醒强化，不虚构版本或技能。'},
  classificationSummary:{single:skills.reduce((n,m)=>n+m.effects.length,0),multiplayer:0,enhancement:0},
  completion:{singleStage:false,fullyComplete:false,advanceAllowed:false},
  limitations:['本次为资料审核及无魂印跳过记录，不是战斗状态实现认证。','效果445为赛尔豆结算，不能归入多精灵延期；效果70为原文150~220随机威力。两者当前缺少规则入口，未忽略或伪造实现。']};
fs.writeFileSync(path.join(__dirname,'3579-review-audit.json'),JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify({id:pet.id,name:pet.name,status:audit.status,skills:skills.length,...audit.classificationSummary}));
