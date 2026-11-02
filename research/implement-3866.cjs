const fs=require('fs');
fs.writeFileSync('research/3866-user-confirmed-rules.json',JSON.stringify({species:3866,confirmedAt:new Date().toISOString(),source:'human-user',answers:['是；是；实际扣血；是','是'],rules:{effect2312:'回复取实际回复，0不生成；本招与后续实际用招含MISS触发；本次追加实际扣血为0则随机异常；动态非限制PVP池等概率无放回，每种独立2/3回合、免疫不补抽',effect2355Authorization:'仅新增枚举8睡眠，与原10混乱并存，其他值拒绝'},sourceHashes:{skill29170:'aca5730d',effect2312:'7af89066',effect2355:'b98b3a3e'}},null,2)+'\n');
fs.writeFileSync('research/3866-talent-source.json',JSON.stringify({checkedAt:new Date().toISOString(),effect:1470,formula:[[0,10,100],[11,20,120],[21,25,140],[26,30,160],[31,31,180]],sources:[{url:'https://www.bilibili.com/read/cv21287575/',title:'月影清舞，先发制人 月照星魂精灵解析及配置',evidence:'0-10 100威力 11-20 120威力 21-25 140威力 26-30 160威力 31 180威力'},{url:'https://bkso.baidu.com/item/月照星魂/23453080',evidence:'同一五档天赋威力表'}],note:'API与BWIKI未列公式；两个可核查外部资料一致，未改写API原文'},null,2)+'\n');
let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8');
s=s.replace("add(2355,'afterHit',(c,p)=>c.timed(c.a,'对手回合被清追加异常',p[0],{ailment:'混乱',duration:p[2]}),[turns,[10,10],turns]);","add(2355,'afterHit',(c,p)=>{if(![8,10].includes(p[1]))throw Error('2355 异常枚举尚未核对');c.timed(c.a,'对手回合被清追加异常',p[0],{ailment:p[1]===8?'睡眠':'混乱',duration:p[2]});},[turns,[8,10],turns]);");
const at=s.lastIndexOf('\n});');s=s.slice(0,at)+`
metadata[844]={info:'若攻击未打出致命一击则吸取对手最大体力的1/{0}',args_num:1};
metadata[1251]={info:'自身体力低于200时必定先手',args_num:0};
metadata[1469]={info:'{0}回合内自身造成的固定伤害、百分比伤害提升{1}%',args_num:2};
metadata[1470]={info:'自身天赋值越高则技能威力越大',args_num:0};
metadata[2312]={info:'恢复自身最大体力的1/{0}，恢复成功则{1}回合内自身技能额外附加恢复量{2}%的百分比伤害，对手未受到百分比伤害时随机附加{3}种非限制类异常状态',args_num:4};
add(844,'afterAttack',(c,p)=>{if(!c.crit)healthRules.drainPercent(c,c.t.stats.maxHp/p[0],c.m.name+'未暴击吸取');},[[1,9999]]);
add(1251,'beforeOrder',c=>{if(c.a.hp<200)c.forceFirst=true;},[]);
add(1469,'afterHit',(c,p)=>c.timed(c.a,'固定百分比增伤',p[0],{fraction:p[1]/100}),[turns,pct]);
add(1470,'beforeDamage',c=>{const iv=c.a.build.iv;c.power=iv<=10?100:iv<=20?120:iv<=25?140:iv<=30?160:180;},[]);
add(2312,'afterHit',(c,p)=>{const before=c.a.hp;c.heal(c.a,c.a.stats.maxHp/p[0],c.m.name+'回复');const recovered=c.a.hp-before;if(recovered>0)c.timed(c.a,'技能回复量追加',p[1],{amount:recovered*p[2]/100,count:p[3]});},[[1,9999],turns,pct,[1,30]]);
`+s.slice(at);fs.writeFileSync(p,s);
p='dist/souls.js';s=fs.readFileSync(p,'utf8');s=s.replace("return hurt(t,n*(a!==t&&a.soulId===1825", "return hurt(t,n*(a!==t&&['fixed','percent'].includes(type)&&on(a,'固定百分比增伤')?1+a.effects['固定百分比增伤'].fraction:1)*(a!==t&&a.soulId===1825");
s=s.replace("if(a.hp>0&&t.hp>0&&on(a,'用招失明或粉伤'))", "if(a.hp>0&&t.hp>0&&on(a,'技能回复量追加')){const e=a.effects['技能回复量追加'];if(inflict(a,t,e.amount,'技能回复量追加','percent')===0)context(a,t,m).randomFromSharedPool(e.count,false,2312);}\n      if(a.hp>0&&t.hp>0&&on(a,'用招失明或粉伤'))");fs.writeFileSync(p,s);
