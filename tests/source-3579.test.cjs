'use strict';
// Source/policy checks only. These are NOT deployed battle-state evidence.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'../research/seerapi-cache/3579');
const pet=require('../research/seerapi-cache/3579/pet-3579.json');
const manifest=require('../research/seerapi-cache/3579/manifest.json');
const audit=require('../research/3579-review-audit.json');
test('3579 无魂印来源及现行跳过策略不冒充本地部署',()=>{
  assert.equal(pet.id,3579);assert.equal(pet.name,'秦小宝');assert.deepEqual(pet.soulmark,[]);
  const result=require('../local-species.cjs').save({id:pet.id,souls:pet.soulmark});
  assert.equal(result.saved,false);assert.equal(result.skipped,true);
  assert.equal(fs.existsSync(path.join(__dirname,'../data/species/3579.json')),false);
  assert.equal(audit.status,'skipped');assert.equal(audit.completion.singleStage,false);assert.equal(audit.completion.advanceAllowed,false);
});
test('3579 全部来源哈希URL与逐招效果实例参数完整保留',()=>{
  assert.equal(pet.skill.length,17);assert.deepEqual(audit.skills.map(x=>x.raw.id),pet.skill.map(x=>x.skill.id));
  for(const record of manifest.records){const raw=JSON.parse(fs.readFileSync(path.join(dir,record.file),'utf8'));assert.equal(raw.hash,record.hash);assert.equal(new URL(record.url).hostname,'api.seerapi.com');assert.ok(Number.isFinite(Date.parse(record.loadedAt)));}
  for(const m of audit.skills){assert.deepEqual(m.effects.map(x=>({id:x.id,args:x.args,description:x.description})),m.raw.skill_effect.map(x=>({id:x.effect.id,args:x.args,description:x.info})));for(const e of m.effects){assert.equal(e.args.length,e.metadata.args_num);assert.equal(e.source.hash,e.metadata.hash);assert.equal(e.classification,'single');assert.equal(e.implementationStatus,'not-certified-species-skipped');}}
  assert.equal(audit.classificationSummary.multiplayer,0);
});
test('3579 无强化来源时不虚构伙伴魂印，赛尔豆奖励不归为多精灵',()=>{
  assert.equal(pet.advance,null);assert.deepEqual(audit.enhancements.additionalSkills,[]);assert.deepEqual(audit.enhancements.friendEffects,[]);
  const reward=audit.skills.flatMap(x=>x.effects).find(x=>x.id===445);assert.deepEqual(reward.args,[]);assert.equal(reward.nonCombatReward,true);assert.equal(reward.classification,'single');assert.match(reward.description,/500赛尔豆/);
  const power=audit.skills.flatMap(x=>x.effects).find(x=>x.id===70);assert.deepEqual(power.args,[]);assert.match(power.description,/150~220/);
});
