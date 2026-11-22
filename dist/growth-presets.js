(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./growth-catalog.js'));
  else root.BattleGrowthPresets=factory(root.BattleGrowthCatalog);
})(globalThis,function(catalog){
  'use strict';
  const teamBonus={atk:15,spa:15,def:15,spd:15,spe:10,maxHp:30};
  const sets=[
    ['物攻爆速',42310,41286],['特攻爆速',42311,41287],
    ['物攻爆攻',42312,41288],['特攻爆攻',42313,41289],
    ['物攻爆盾',42316,41292],['特攻爆盾',42317,41293],
    ['物攻爆体',42314,41290],['特攻爆体',42315,41291]
  ].map(([name,pair,single])=>({name,ids:[pair,pair,single]}));
  const indexes=Object.fromEntries(['marks','titles','eyes'].map(k=>[k,new Map(catalog[k].map(item=>[item.id,item]))]));
  const total=stats=>Object.values(stats).reduce((sum,n)=>sum+n,0);
  const normalizeText=text=>String(text).normalize('NFKC').toLowerCase().replaceAll('alpha','α').trim();
  // All catalog marks share the same use restrictions and have no skill or extra effect.
  // The generator checks those invariants before publishing the six-stat records.
  const markGroups=new Map(),markIds=new Map();
  for(const mark of [...catalog.marks].sort((a,b)=>a.id-b.id)){
    const key=JSON.stringify([mark.name,mark.angles,...Object.keys(teamBonus).map(k=>mark.stats[k])]);
    if(!markGroups.has(key))markGroups.set(key,[]);
    const ids=markGroups.get(key);
    ids.push(mark.id);
    markIds.set(mark.id,ids);
  }
  function candidates(kind,query='',sort='total',angles=0,selected=null){
    const needle=normalizeText(query);
    if(kind!=='marks')return catalog[kind].filter(x=>normalizeText(x.name).includes(needle)||String(x.id).includes(needle)).sort((a,b)=>a.id-b.id);
    const matches=[];
    const idQuery=needle.replace(/^#/,'');
    for(const ids of markGroups.values()){
      const first=item('marks',ids[0]);
      if(angles&&first.angles!==angles)continue;
      const matchingId=ids.find(id=>String(id).includes(idQuery));
      if(!matchingId&&!normalizeText(first.name).includes(needle))continue;
      const id=ids.includes(selected)?selected:matchingId??first.id;
      matches.push(item('marks',id));
    }
    const value=x=>sort==='total'?total(x.stats):x.stats[sort];
    return matches.sort((a,b)=>value(b)-value(a)||markIds.get(a.id)[0]-markIds.get(b.id)[0]);
  }
  function item(kind,id){return indexes[kind].get(id);}
  function equipped(kind,id){
    if(id==null||id===0)return null;
    const entry=item(kind,id);
    if(!entry)throw Error(kind==='titles'?'能力称号无效':'能力目镜无效');
    return entry;
  }
  function flag(value){
    if(value==null)return false;
    if(typeof value!=='boolean')throw Error('面板加成开关无效');
    return value;
  }
  function normalize(build,input){
    build.titleId=equipped('titles',input.titleId)?.id??null;
    build.eyeId=build.suit==='corrosion'?null:equipped('eyes',input.eyeId)?.id??null;
    build.annualBonus=flag(input.annualBonus);
    build.teamBonus=Object.fromEntries(Object.keys(teamBonus).map(k=>[k,flag(input.teamBonus?.[k])]));
    build.inscriptionPresetIds=build.inscriptions.map((stats,i)=>{
      const mark=item('marks',input.inscriptionPresetIds?.[i]);
      return mark&&Object.keys(teamBonus).every(k=>mark.stats[k]===stats[k])?mark.id:null;
    });
  }
  function extra(build,key){
    let n=(build.annualBonus?10:0)+(build.teamBonus[key]?teamBonus[key]:0);
    for(const entry of [item('titles',build.titleId),item('eyes',build.eyeId)]){
      // All eligible entries in the pinned catalog are flat. A percentage requires a reviewed base.
      if(entry?.percent)throw Error('百分比装备尚未核对计算基数');
      n+=entry?.stats[key]??0;
    }
    return n;
  }
  return {aliases:id=>markIds.get(id),catalog,sets,teamBonus,total,candidates,item,normalize,extra};
});
