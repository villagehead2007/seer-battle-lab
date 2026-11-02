'use strict';
// Source-backed grouping only; never rewrite a skill, fifth flag or effect.
module.exports=function(s){
  const pet=require('./seerapi-cache/3613/pet-3613.json');
  const assert=require('node:assert/strict');
  assert.equal(s.source.revision,pet.hash);
  assert.deepEqual(s.moves.map(m=>[m.id,m.advanced,m.fifth]),pet.skill.map(x=>[x.skill.id,x.is_advanced,x.is_fifth]));
  return ['original','awakened'].map(id=>{
    const awakened=id==='awakened',soul=s.souls.find(x=>x.isAdvanced===awakened);
    const raw=require('./seerapi-cache/3613/soulmark-'+soul.id+'.json');
    assert.equal(raw.hash,soul.hash);
    if(awakened){assert.equal(raw.from.id,s.souls.find(x=>!x.isAdvanced).id);assert.equal(raw.advance.id,s.advance.id);}
    return {id,soulId:soul.id,soulHash:soul.hash,
      source:awakened?{url:s.advance.source.url,revision:s.advance.hash}:{url:s.source.url,revision:s.source.revision},
      moveIds:s.moves.filter(m=>awakened?m.advanced||!m.fifth:!m.advanced).map(m=>m.id)};
  });
};
