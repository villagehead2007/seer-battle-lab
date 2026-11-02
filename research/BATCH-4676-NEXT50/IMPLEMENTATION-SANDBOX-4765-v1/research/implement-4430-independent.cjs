const fs=require('fs'),snapshot=require('./4430-reviewed-snapshot.json');let p='dist/range-souls.js',s=fs.readFileSync(p,'utf8'),end=s.lastIndexOf('\n});');s=s.slice(0,end)+`
registry[1645]={name:'极光仙子',sourceHash:'c8d2f54e',traits:{},deferred:['击败对手后令其真实下只出场精灵首次属性技能无效，当前对手不作后继目标'],hooks:{
roundStart(c){c.a.soulState.auroraPowerRound=c.a.hp<c.t.hp?c.round:0;c.a.soulState.auroraExtraPower=Math.min(200,Math.abs(c.a.stats.maxHp-c.t.stats.maxHp));},
beforeDamage(c){if(c.a.soulState.auroraPowerRound===c.round)c.power+=c.a.soulState.auroraExtraPower;},
afterAttack(c){if(c.a.hp>0)c.heal(c.a,c.settledDamage*.5,'极光攻击伤害回复');},
afterUse(c){if(c.a.hp>0&&c.t.hp>0&&!['status','item'].includes(c.m.kind))c.stage(c.a,2,['spa']);}
}};
`+s.slice(end);fs.writeFileSync(p,s);p='dist/range-effects.js';s=fs.readFileSync(p,'utf8');end=s.lastIndexOf('\n});');s=s.slice(0,end)+`
metadata[1177]={info:'自身处于能力提升状态则使自身能力提升状态翻倍',args_num:0};add(1177,'afterHit',c=>{for(const k of stats){const n=c.a.stages[k];if(n>0)c.stage(c.a,n,[k]);}});
metadata[1871]={info:'若自身当前体力低于对手则为自身附加等同于双方最大体力差值的护盾',args_num:0};add(1871,'afterHit',c=>{if(c.a.hp<c.t.hp)c.addShield(c.a,Math.abs(c.a.stats.maxHp-c.t.stats.maxHp),'aurora-maxhp-difference');});
`+s.slice(end);fs.writeFileSync(p,s);fs.writeFileSync('tests/helpers/4430-battle.cjs',fs.readFileSync('tests/helpers/4421-battle.cjs','utf8').replaceAll('4421','4430').replace('moveId:10074','moveId:12897'));console.log({id:4430,issues:require('../local-species.cjs').issues(snapshot)});
