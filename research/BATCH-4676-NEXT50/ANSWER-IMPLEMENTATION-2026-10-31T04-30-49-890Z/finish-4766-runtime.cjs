'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')));}
function replace(s,a,b){assert(s.includes(a),a.slice(0,90));return s.replace(a,b);}
edit('dist/range-souls.js',s=>{
 s=replace(s,"partial:true,unimplemented:['逆转/复原的轨迹位置语义','每段或整招衍化','反弹基数','API自身结束时点字段差异','真实再入场累计计时']","partial:false,deferred:['真实离场/再登场的武道初始化、本场累计在场前10回合及对手每次在场超过2回合计时']");
 return replace(s,"if(c.a.soulState.triggerUnit1967!=='action'||e?.round!==c.round","if(e?.round!==c.round");
});
edit('dist/range-effects.js',s=>{
 const start=s.indexOf('function rewritePath4766('),end=s.indexOf('\nconst handlers4766=',start);assert(start>0&&end>start);
 s=s.slice(0,start)+`function rewritePath4766(c,reverse){const st=bloodPath4766(c);if(!st)return;const current=st.closed?null:st.sequence[st.index];if(reverse){st.sequence=['blood','sky','evil','blood'];st.direction='reverse';}else{st.sequence=['blood','evil','sky','blood'];st.direction='forward';if(current&&current!=='blood')st.index=st.sequence.indexOf(current);st.blocked=0;st.pendingBlocked=0;}}`+s.slice(end);
 const replaceHandler=(id,body)=>{const re=new RegExp('^'+id+'\\(c(?:,p)?\\)\\{.*$','m');assert(re.test(s));s=s.replace(re,()=>id+'(c,p){'+body+'},');};
 replaceHandler(1748,"if(!c.qualifiedCrit1748(c.crit,c.settledDamage??c.dealt))c.timed(c.a,'必定暴击',p[0],{},c.round+1);");
 replaceHandler(2293,"rewritePath4766(c,false);const st=bloodPath4766(c);if(st)st.nextBoost=p[0];");
 replaceHandler(2292,"const st=bloodPath4766(c);if(!st)return;const n=Math.min(st.blocked,c.a.stats.maxHp*p[0]/100);rewritePath4766(c,true);st.blocked=0;if(n>0&&c.t.hp>0)c.hurt(c.t,n,c.m.name+'正转累计固定反馈','fixed');");
 replaceHandler(2300,"const e=c.a.soulState.attackRestriction1967;if(e?.round!==c.round||e.move!==c.m.id||e.use!==c.effectUseCount())return;if((e.cap||e.block)&&statusRoll(c,p[0]))c.ailment(c.t,'害怕',c.a,false,false,null,{probabilityPercent:p[0]});");
 const startUsed=s.indexOf("{const old=registry[1693];registry[1693]=Object.freeze({...old,used4766(c)");assert(startUsed>0);
 const endUsed=s.indexOf('\n',startUsed);let line=s.slice(startUsed,endUsed);
 line=replace(line,"actual=c.heal(c.a,nominal,'盖亚实际使用技能回复','skill')??0;let n=actual;if(nominal!==actual){const q=c.a.soulState.healThenEqual4766;if(!['nominal','actual-heal'].includes(q))throw Error('Q-4706-008：盖亚回复后等量粉伤理论或实际基数待确认');if(q==='nominal')n=nominal;}","before=c.a.hp;c.heal(c.a,nominal,'盖亚实际使用技能回复','skill');const n=Math.max(0,c.a.hp-before);");
 return s.slice(0,startUsed)+line+s.slice(endUsed);
});
edit('dist/souls.js',s=>{
 s=replace(s,"qualifiedCrit1748(crit,amount){if(!crit)return false;","qualifiedCrit1748(crit,amount){if(Number(a.number)===4766)return !!crit;if(!crit)return false;");
 s=replace(s,"cap:false,immune:false};return e;}function capAttack1967","cap:false,immune:false,block:false};return e;}function capAttack1967");
 // Explicit blocking immunity is distinct from shield absorption, healing conversion,
 // ordinary reduction, HP truncation and entire-skill invalidation.
 const anchor="if(hitImmune&&total>0){const e=restriction1967(a,m);if(e)e.immune=true;}";
 s=replace(s,anchor,"if(hitImmune&&total>0){const e=restriction1967(a,m);if(e){e.immune=true;e.block=on(t,'攻击伤害免疫')||on(t,'当回合免伤')||effectContext.incomingSoulImmune&&!effectContext.incomingWholeAttackImmune;}}");
 return s;
});
console.log('4766 confirmed runtime applied; no source edits');
