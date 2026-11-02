'use strict';const fs=require('fs'),assert=require('node:assert/strict');
function edit(p,a,b){let s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,90));fs.writeFileSync(p,s.replace(a,b));}function append(p,c){const s=fs.readFileSync(p,'utf8'),i=s.lastIndexOf('\n});');assert.ok(i>0);fs.writeFileSync(p,s.slice(0,i)+'\n'+c+s.slice(i));}
const p='research/4238-reviewed-snapshot.json',s=JSON.parse(fs.readFileSync(p)),raw=require('./4238-source-check.json').records.find(x=>x.url.endsWith('/pet/4238')).data;s.moves.find(m=>m.id===37419).fifth=true;s.additionalFifths={rawPet:raw,source:{url:s.source.url,revision:raw.hash}};s.skillVersions=[35176,37419].map(fifthId=>({id:'fifth-'+fifthId,soulId:1457,soulHash:'a43f4529',fifthId,source:{url:s.source.url,revision:s.source.revision},moveIds:s.moves.filter(m=>!m.fifth||m.id===fifthId).map(m=>m.id)}));s.moves.find(m=>m.id===27629).limitations.push('Q-A60-4163-038：573纯反转是否属于清除/吸取仍待确认');fs.writeFileSync(p,JSON.stringify(s,null,2)+'\n');
let code='';for(const id of [1696,1639,2194]){const e=s.effects.find(e=>e.id===id);code+='metadata['+id+']='+JSON.stringify({info:e.template,args_num:e.argsNum})+';\n';}
code+=`add(1696,'afterHit',(c,p)=>{if(c.fatalCracks(c.t)===0&&!c.ppReductionBlocked(c.t))randomEmpty(c,p[0]);},[[1,5]]);
add(1639,'beforeCrit',c=>{if(stats.some(k=>c.a.stages[k]>0))c.forceCrit=true;},[]);
add(2194,'afterHit',()=>{},[],'击败后对方下一只真实出战精灵附加1层致命裂痕；依赖下一只出场流程，当前对手不替代下一只');
`;
for(const [id,mid,hash,index,args]of [[1372,27628,'87891c7f',1,[4,100,28]],[573,27629,'187fa9aa',2,[3,100,23,2]],[1054,35175,'34357b63',1,[23]],[2193,37419,'627a9455',2,[100,6,3,0,1,0,0,0,1,0,2]]]){
 const bound=`(m?.wikiId??m?.id)===${mid}&&(m?.hash==='${hash}'||m?.revision==='seerapi:${hash}')&&index===${index}&&JSON.stringify(p)==='${JSON.stringify(args)}'`;
 code+=`{const old=registry[${id}];registry[${id}]=Object.freeze({...old,validate(p,m,index){if(${bound})return;old.validate(p,m,index);}`;
 if(id===2193)code+=`,execute(c,p){if((c.m.wikiId??c.m.id)===37419&&c.m.revision==='seerapi:627a9455'){if(stats.some(k=>c.a.stages[k]>0))return;if(c.ailment(c.t,'害怕',c.a,false,false,null,{probabilityPercent:100}))c.timed(c.a,'hypnosGrowth',p[2],{stages:p.slice(4,10)},c.round);else c.timed(c.t,'statusBlock',p[10],{});return;}old.execute(c,p);}`;
 if(id===573)code+=`,execute(c,p){old.execute(c,p);if((c.m.wikiId??c.m.id)===27629&&c.m.revision==='seerapi:187fa9aa')c.a.effects['强化被清惩罚'].pendingReverseQuestion='Q-A60-4163-038';}`;
 code+='});}\n';
}
append('dist/range-effects.js',code);
edit('dist/souls.js',"if(on(f,'强化被清惩罚')){const e=f.effects['强化被清惩罚'];if(rng(s)<e.chance/100)","if(on(f,'强化被清惩罚')){const e=f.effects['强化被清惩罚'];if(operation==='reverse'&&e.pendingReverseQuestion)throw Error('Q-A60-4163-038：573纯反转反制范围待确认');if(rng(s)<e.chance/100)");
append('dist/range-souls.js',`registry[1457]={name:'鬼面阎罗',sourceHash:'a43f4529',traits:{attackPriority:f=>f.soulState.yanluoRound?.priority?1:0},hooks:{roundStart(c){const ks=['atk','def','spa','spd','spe','acc'],count=ks.filter(k=>c.a.stages[k]>=c.t.stages[k]).length;c.a.soulState.yanluoRound={round:c.round,count,priority:ks.reduce((n,k)=>n+Math.max(0,c.a.stages[k]),0)>=12};},beforeDamage(c){c.modifier*=1+(c.a.soulState.yanluoRound?.count??0)*.15;},afterUse(c){if(c.a.hp<=0||c.t.hp<=0||c.m.kind==='status'||c.m.kind==='item')return;const n=c.a.soulState.yanluoRound?.count??0;c.hurt(c.t,n*(n>3?80:160),'鬼面回合初比较追加','fixed');},combatEnd(c){if(c.a.hp>0&&(c.a.soulState.yanluoRound?.count??6)<=3)c.stage(c.a,1);}}};`);
const helper=fs.readFileSync('tests/helpers/4233-battle.cjs','utf8').replaceAll('4233','4238').replace('moveId:10086','moveId:10001');fs.writeFileSync('tests/helpers/4238-battle.cjs',helper);
console.log('4238 exact-source bindings, two true fifths, soul1457,1696,1639,2194; Q038 preserved');
