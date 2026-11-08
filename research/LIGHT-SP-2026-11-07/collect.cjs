'use strict';
const {out,get}=require('./query.cjs');
async function saved(key){const url='https://api.seerapi.com/v1/'+key,record=out.records.find(x=>x.url===url);return record?.data??await get(key);}
(async()=>{
 const pet=await saved('pet/3311');
 await saved('soulmark/2162');await saved('eid_effect/922');
 const souls=out.records.find(x=>x.url.endsWith('/soulmark/2162'))?.data;
 if(souls?.effect?.effect?.id)await saved('eid_effect/'+souls.effect.effect.id);
 await saved('element_type/?limit=30&expand=true');
 const ids=[...new Set([...pet.skill.map(x=>x.skill.id),38624,29502,29503,38625,38626])];
 for(const id of ids){const m=await saved('skill/'+id);if(!m)continue;await saved('element_type_combination/'+m.type.id);for(const e of m.skill_effect??[])await saved('skill_effect_type/'+e.effect.id);}
 console.log('COLLECTION COMPLETE',ids.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
