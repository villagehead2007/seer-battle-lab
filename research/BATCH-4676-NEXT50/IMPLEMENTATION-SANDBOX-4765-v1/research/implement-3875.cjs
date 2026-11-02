const fs=require('fs'),r=require('./3875-source-check.json').records;
const meta=id=>r.find(x=>x.url.endsWith('/skill_effect_type/'+id)).data;
const append=(file,text)=>{let s=fs.readFileSync(file,'utf8');const at=s.lastIndexOf('});');if(at<0)throw Error(file);fs.writeFileSync(file,s.slice(0,at)+text+'\n'+s.slice(at));};
const metadata=[200,513,1341,967,2389,1606].map(id=>`metadata[${id}]=${JSON.stringify({info:meta(id).info,args_num:meta(id).args_num})};`).join('\n');
append('dist/range-effects.js',metadata+`
add(200,'afterHit',(c,p)=>{if(Object.values(c.t.stages).some(v=>v>0)&&statusRoll(c,p[0]))c.ailment(c.t,'害怕',c.a);},[pct,[6,6]]);
add(513,'beforeDamage',c=>{if(['烧伤','中毒','冻伤'].some(k=>c.a.ailments[k]>=c.round))c.power*=2;},[],undefined,undefined,{afterHit(c){for(const k of ['烧伤','中毒','冻伤'])c.clearAilment(c.a,k);}});
add(1341,'afterAttack',(c,p)=>{if(c.dealt>p[0])c.heal(c.a,c.a.stats.maxHp/p[1],c.m.name+'高伤回复');},[[0,99999],[1,9999]]);
add(967,'afterHit',(c,p)=>c.hurt(c.t,(c.t.stats.def+c.t.stats.spd)*p[0]/100,c.m.name+'双防追加','percent'),[pct]);
add(2389,'beforeDamage',c=>{if(Object.values(c.a.stages).some(v=>v>0))c.affinity=Math.max(1,c.affinity);},[]);
add(1606,'afterHit',(c,p)=>{if(c.canRemoveNegative?.(c.a)===false)return;let changed=false;for(const k of stats){const before=c.a.stages[k];if(before<0){c.stage(c.a,-2*before,[k]);changed ||=c.a.stages[k]===-before;}}if(changed)healthRules.drainPercent(c,c.t.stats.maxHp/p[0],c.m.name+'反弱吸取');},[[1,9999]]);
`);
let s=fs.readFileSync('dist/range-effects.js','utf8');const old="const uses=c.a.soulState.skillUses?.[c.m.id]??1,n=Math.min(p[2],p[0]+(uses-1)*p[1]);";if(!s.includes(old))throw Error('1233 missing');s=s.replace(old,"const confirmed=c.a.number==='3875'&&c.m.id==='wiki:38234';if(confirmed)c.a.soulState.darkWarDrainHits=(c.a.soulState.darkWarDrainHits??0)+1;const uses=confirmed?c.a.soulState.darkWarDrainHits:(c.a.soulState.skillUses?.[c.m.id]??1),n=Math.min(p[2],p[0]+(uses-1)*p[1]);");fs.writeFileSync('dist/range-effects.js',s);
append('dist/range-souls.js',`
for(const [id,hash,priority,critical]of [[1145,'b03fdda2',1,.5],[1446,'2945f022',2,1]])registry[id]={name:'暗战·艾辛格斯'+(id===1446?'·强化':''),sourceHash:hash,traits:{skillPriority:f=>f.soulState.darkWarBoosted?priority:0},hooks:{
roundStart(c){c.a.soulState.darkWarLow=c.a.hp<c.a.stats.maxHp/2;c.a.soulState.darkWarBoosted=[c.a,c.t].some(f=>Object.values(f.stages).some(v=>v>0));},
beforeUse(c){if(c.m.kind!=='status'&&c.m.kind!=='item')c.a.soulState.darkWarLastDamage=0;},
beforeDamage(c){if(c.a.soulState.darkWarBoosted)c.modifier*=2;},
beforeCrit(c){if(!c.a.soulState.darkWarBoosted){c.chance=critical;if(critical===1)c.forceCrit=true;}},
afterAttack(c){c.a.soulState.darkWarLastDamage=c.dealt;if(c.a.hp>0)c.heal(c.a,c.dealt*.5,'暗战攻击回复');},
combatEnd(c){if(c.a.hp<=0)return;if(c.a.soulState.darkWarLow&&c.t.hp>0)c.hurt(c.t,(c.a.soulState.darkWarLastDamage??0)*.5,'暗战低体战阶追加','percent');if(!c.a.soulState.darkWarBoosted){const pool=['atk','def','spa','spd','spe','acc'];for(let i=0;i<3;i++)c.stage(c.a,1,[pool.splice(Math.floor(c.random()*pool.length),1)[0]]);}}
}};
`);
const auth=require('./3875-user-confirmed-rules.json').additionalFifthAuthorization;
const reviewed={pet:auth.petHash,souls:auth.souls,fifths:auth.fifths,skills:auth.skills};s=fs.readFileSync('dist/wiki-support.js','utf8');if(!s.includes('const reviewed={3847:'))throw Error('whitelist missing');s=s.replace('const reviewed={3847:',`const reviewed={3875:${JSON.stringify(reviewed)},3847:`);fs.writeFileSync('dist/wiki-support.js',s);
let p=fs.readFileSync('research/prepare-3875.cjs','utf8');p=p.replace("fs.writeFileSync('research/3875-reviewed-snapshot.json'",`s.additionalFifths={source:{url:s.source.url,revision:p.hash},rawPet:p};
s.skillVersions=s.souls.flatMap(soul=>s.moves.filter(m=>m.fifth).map(fifth=>({id:'soul-'+soul.id+'-fifth-'+fifth.id,soulId:soul.id,soulHash:soul.hash,fifthId:fifth.id,source:{url:s.source.url,revision:p.hash},moveIds:s.moves.filter(m=>!m.fifth||m.id===fifth.id).map(m=>m.id)})));
fs.writeFileSync('research/3875-reviewed-snapshot.json'`);fs.writeFileSync('research/prepare-3875.cjs',p);
let h=fs.readFileSync('tests/helpers/3875-battle.cjs','utf8').replace('moveId:10001','moveId:10127').replace('delete b.skillVersions;','delete b.skillVersions;delete a.additionalFifths;delete b.additionalFifths;');h=h.split('\n').filter(l=>!l.includes('options.partner')).join('\n');fs.writeFileSync('tests/helpers/3875-battle.cjs',h);
