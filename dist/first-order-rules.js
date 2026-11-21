(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FirstOrderRules=factory();})(globalThis,function(){
  'use strict';
  // User-designated chart, 2026-11-12. Effect IDs and soul IDs are separate namespaces.
  const effectRanks=Object.freeze({83:2,666:2,777:2,801:2,827:2,1310:2,1552:2,1630:2,1817:2,1275:3,435:4,574:4,754:4,1812:5,873:6,694:7,823:8,1251:9,1634:10,1412:11});
  const soulHashes=Object.freeze({753:'2b305c24',1714:'5cd3c296',1090:'ede70670',1129:'45049101'});
  const timedKeys=new Set(['所有技能必定先手','攻击必定先手']),trueHit=new Set([574,873,1552,1812]),pseudoHit=new Set([435,754,1275]),allScopeErrata=new Set([435,666,754,801,1275,1552]);
  const attack=m=>m&&['physical','special'].includes(m.kind),live=(e,r)=>e&&e.start<=r&&e.end>=r;
  function profile(namespace,id,metadata={}){
    const rank=namespace==='skill-effect'?effectRanks[id]:namespace==='soul'&&soulHashes[id]===metadata.hash?1:null;
    if(!rank)throw Error('必先来源尚未分档：'+namespace+':'+id);
    return {...metadata,namespace,id:Number(id),rank,hit:namespace==='skill-effect'?(trueHit.has(+id)?'true':pseudoHit.has(+id)?'pseudo':null):null,critical:namespace==='skill-effect'&&[666,1552].includes(+id)};
  }
  function sourceFromContext(actor,move,index,origin,key){
    if(!timedKeys.has(key))return null;
    if(Number.isInteger(index)&&move?.operations){const op=move.operations.find(op=>op.index===index);if(op&&effectRanks[op.effectId])return profile('skill-effect',op.effectId,{label:move.name,moveId:move.wikiId??move.id,revision:move.revision,index,sourceArgs:op.sourceArgs??op.params});}
    if(origin==='soul'&&[1090,1129].includes(actor.soulId)&&soulHashes[actor.soulId]===actor.soulHash)return profile('soul',actor.soulId,{hash:actor.soulHash,label:'燃血'});
    throw Error('必先回合效果缺少已核对来源：'+(move?.name??actor.name)+' / '+key);
  }
  function legacyTimed(f,key,e){
    if(e?.sourceSoul===1714&&f.soulId===1714&&f.soulHash===soulHashes[1714])return profile('soul',1714,{hash:f.soulHash,label:'德布比特登场'});
    if([1090,1129].includes(f.soulId)&&f.soulHash===soulHashes[f.soulId])return profile('soul',f.soulId,{hash:f.soulHash,label:'燃血'});
    return null;
  }
  function grantTimed(f,key,n,data={},start,source,write){
    if(!timedKeys.has(key))return write(f,key,n,data,start);
    if(!Number.isInteger(n)||n<1||!Number.isInteger(start))throw Error('必先持续回合无效');
    const scope=source.namespace==='skill-effect'&&allScopeErrata.has(source.id)?'all':key==='攻击必定先手'?'attack':'all',storage=scope==='attack'?'攻击必定先手':'所有技能必定先手',old=f.effects[storage];
    const prior=old?.firstOrderSources?.map(x=>({...x}))??(old?[(legacyTimed(f,storage,old)??{namespace:'unknown',id:null,rank:null,label:'缺少来源的旧必先',scope}),].map(x=>({...x,start:old.start,end:old.end})):[]);
    const identity=source.namespace+':'+source.id+':'+(source.moveId??source.hash??'')+':'+(source.index??''),next={...source,identity,scope,start,end:start+n-1};
    const sources=[...prior.filter(x=>x.identity!==identity),next];write(f,storage,n,data,start);Object.assign(f.effects[storage],{start:Math.min(...sources.map(x=>x.start)),end:Math.max(...sources.map(x=>x.end)),firstOrderSources:sources});
    return f.effects[storage];
  }
  function grantCount(f,id,n,metadata={}){
    if(!Number.isInteger(n)||n<1||n>99)throw Error('必先次数无效');f.soulState??={};
    if(id===1275){f.soulState.teamFirstCrit1275=n;f.soulState.teamFirstCritAttack1275=n;f.soulState.teamFirstSource1275={...metadata,effectId:1275};return;}
    const p=profile('skill-effect',id,{...metadata,label:metadata.label??('效果'+id)}),rows=f.soulState.firstOrderCountSources??=[];
    if(![435,754,1812].includes(id))throw Error('该来源不是已定义的次数必先：'+id);
    const record={...p,scope:metadata.scope??'all',remaining:n,criticalRemaining:id===754?n:0};const i=rows.findIndex(x=>x.id===id);if(i<0)rows.push(record);else rows[i]=record;
  }
  function candidates(f,m,r,selectedEffects=[],allowUnknown=false){
    if(m?.kind==='item'||f.hp<=0)return [];const rows=[],accept=p=>{if((p.scope??'all')==='attack'&&m&&!attack(m))return;if(!Number.isInteger(p.rank)&&!allowUnknown)throw Error('必先来源未归档，不能猜测档位：'+(p.label??p.id));rows.push(p);};
    for(const key of timedKeys){const e=f.effects[key];if(!live(e,r))continue;const values=e.firstOrderSources??[{...(legacyTimed(f,key,e)??{namespace:'unknown',id:null,rank:null,label:'缺少来源的旧必先'}),start:e.start,end:e.end,scope:key==='攻击必定先手'?'attack':'all'}];for(const p of values)if(live(p,r))accept(p);}
    const st=f.soulState??{};
    if(f.soulId===753&&f.soulHash===soulHashes[753]&&st.pony753?.firstRound===r)accept(profile('soul',753,{hash:f.soulHash,label:'永恒',scope:'all',start:r,end:r}));
    if(st.teamFirstCrit1275>0)accept(profile('skill-effect',1275,{label:'守御八方',scope:'all',remaining:st.teamFirstCrit1275,criticalRemaining:st.teamFirstCritAttack1275??st.teamFirstCrit1275,...st.teamFirstSource1275}));
    if(st.ji574NextSkill)accept(profile('skill-effect',574,{label:'下次技能必先（效果574）',scope:'all',remaining:1,...st.ji574Source}));
    if(st.nextAttack873)accept(profile('skill-effect',873,{label:'下次攻击必先（效果873）',scope:'attack',remaining:1,...st.nextAttackSource873}));
    for(const p of st.firstOrderCountSources??[])if(p.remaining>0)accept(p);
    for(const id of selectedEffects)accept(profile('skill-effect',id,{label:m?.name??('效果'+id),scope:'selected-skill',start:r,end:r}));
    return rows;
  }
  function assignChallengedSide(requested,seed){
    if(requested!==undefined&&requested!==null){if(requested!==0&&requested!==1)throw Error('房主方必须是A或B');return requested;}
    // A separate seeded coin avoids changing the existing combat probability stream.
    let h=2166136261;for(const c of 'challenged-side:'+String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}let t=(h+0x6D2B79F5)>>>0;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)<0x80000000?0:1;
  }
  const rank=rows=>{const values=rows.map(x=>x.rank).filter(Number.isInteger);return values.length?Math.min(...values):null;};
  function choose(left,right,challengedSide){const a=rank(left),b=rank(right);if(a===null&&b===null)return null;if(a===null)return 1;if(b===null)return 0;if(a!==b)return a<b?0:1;if(challengedSide!==0&&challengedSide!==1)throw Error('同档必先需要明确房主／被挑战方');return challengedSide;}
  function beginUse(f,m,r){
    if(m.kind==='item')return {hit:null,critical1275:false,additionalCritical:false,sources:[]};const st=f.soulState,rows=candidates(f,m,r),isAttack=attack(m),count1275=st.teamFirstCrit1275??0;
    if(!Number.isInteger(st.teamFirstCritAttack1275))st.teamFirstCritAttack1275=Math.max(0,count1275);
    const critical1275=isAttack&&st.teamFirstCritAttack1275>0,extraCounts=(st.firstOrderCountSources??[]),additionalCritical=isAttack&&(rows.some(x=>x.critical)||extraCounts.some(x=>x.criticalRemaining>0)),hit=rows.some(x=>x.hit==='true')?'true':rows.some(x=>x.hit==='pseudo')?'pseudo':null;
    if(count1275>0&&!rows.some(x=>x.namespace==='skill-effect'&&x.id===1552))st.teamFirstCrit1275--;
    if(critical1275)st.teamFirstCritAttack1275--;
    for(const p of extraCounts){const eligible=p.scope!=='attack'||isAttack;if(eligible&&p.remaining>0&&!(p.id===1812&&count1275>0))p.remaining--;if(isAttack&&p.criticalRemaining>0)p.criticalRemaining--;}
    return {hit,critical1275,additionalCritical,sources:rows};
  }
  return Object.freeze({effectRanks,soulHashes,isTimedKey:key=>timedKeys.has(key),assignChallengedSide,profile,sourceFromContext,grantTimed,grantCount,candidates,rank,choose,beginUse});
});
