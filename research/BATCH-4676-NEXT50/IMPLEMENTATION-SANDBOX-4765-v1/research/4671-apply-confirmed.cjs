'use strict';const fs=require('fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',dir=base+'4671-before/';fs.mkdirSync(dir,{recursive:true});function edit(file,pairs){let s=fs.readFileSync(file,'utf8');fs.writeFileSync(dir+file.split('/').pop(),s,{flag:'wx'});for(const[a,b]of pairs){assert.ok(s.includes(a),a);s=s.replace(a,b);}fs.writeFileSync(file,s);}
edit('dist/range-souls.js',[
 ["if(previous===undefined){const q=st.qualifiedFirstReference1873;","if(previous===undefined){if(st.qualifiedFirstReference1873===undefined){st.clawFast1873=0;st.clawDrain1873=0;st.clawPreviousStartHP1873=c.a.hp;return;}const q=st.qualifiedFirstReference1873;"],
 ["c.a.soulState.qualifiedHitUnit1873!=='first-hit-once'","(c.a.soulState.qualifiedHitUnit1873??'first-hit-once')!=='first-hit-once'"],
 ["if(c.a.hp<=0)throw Error('Q-N50-4654-012：1873实际用招后自身HP0是否执行比例吸取待确认');","if(c.a.hp<=0)return;"]]);
edit('dist/range-effects.js',[
 ["const n=c.a.soulState.qualifiedConversionDuration4671;","const n=c.a.soulState.qualifiedConversionDuration4671??(c.t.ailments['烧伤']-c.round+1);"],
 ["if((c.a.counts.immune??0)>0)throw Error('Q-N50-4511-006：4671吸强成功后免异重授待确认');c.a.counts.immune=p[0];c.a.soulState.clawImmune4671=p[0];","c.grantOracleImmunity(c.a,p[0],'4671/37526/1159','generic');"],
 ["if(c.on(c.a,name))throw Error('Q-N50-4511-006：4671同名持续载荷重授待确认');",''],
 ["const q=c.a.soulState.qualifiedFirst4671?.[e.id4671];","const q=c.a.soulState.qualifiedFirst4671?.[e.id4671]??'immediate';"],
 ["if(c.a.hp<=0)throw Error('Q-N50-4654-012：4671自身HP0的实际用招后载荷资格待确认');","if(c.a.hp<=0)break;"],
 ["if((c.a.counts.nextAttackBoost??0)>0)throw Error('Q-N50-4511-006：4671下次攻击增伤未消费重授待确认');",''],
 ["if(c.a.counts.nextAttackDodge>0)throw Error('Q-N50-4511-006：4671下两次闪避未消费重授待确认');",'']]);
edit('dist/souls.js',[
 ["q=f.soulState.qualifiedHealCutCount4671;","q=f.soulState.qualifiedHealCutCount4671??'effective';"],
 ["if(!bypass&&on(t,'reflect')&&t.effects.reflect.claw1914671&&(t.counts.immune>0||on(t,'免异常')||E.SOULS.trait(t,'ailmentImmune')||t.soulState.immunity1757Charges?.length||t.soulState.oracle2059Charges?.length))throw Error('Q-N50-4511-006：4671反弹与其他免异消费待确认');",''],
 ["if(defeater.soulState.clawHealCut4671?.count>0)throw Error('Q-N50-4511-006：4671被击败后对手回复削减次数重授待确认');",''],
 ["if(!e.skillKO&&reward?.round===r&&reward.move===move.id&&reward.use===use)throw Error('Q-N50-4589-004：4671本体未KO此前用后吸取末杀归属待确认');","if(!e.skillKO&&reward?.round===r&&reward.move===move.id&&reward.use===use)reward.lateKOWithoutBonus=true;"],
 ["a.soulState.qualified427Unit4671!=='whole-use'","(a.soulState.qualified427Unit4671??'whole-use')!=='whole-use'"]]);
const c=JSON.parse(fs.readFileSync('research/batch5-answer-preparation-2026-10-29/4671-index.json'));Object.assign(c,{accepted:false,status:'state-testing',pending:[],proofs:[],testRenames:[],implementedAnswers:{1873:'首轮仅记录HP、不触发比较分支；攻击命中吸能力整招一次；自身HP0停止普通用后吸取',427:'多段攻击整招一次降双防',2117:'继承烧伤剩余时间',2071:'本来回复0的请求不消费次数；同源重授刷新3次',1159:'吸强成功免异同源刷新1，异源后得先消费',191:'回合免反优先不消费次数',1927:'授予当次触发、同源刷新持续时间；HP0停止；理论固定量回复',1255:'授予当次触发、同源刷新持续时间，HP0停止',1393:'授予当次触发、同源刷新持续时间',2161:'授予当次触发、同源刷新持续时间；失败奖励刷新1次',991:'未击败授予闪避次数，同源刷新2；独立监听晚杀不追加奖励',1268:'本体击败才授下轮异常；独立用后晚杀不新增奖励'}});c.commonRuleReference=base+'COMMON-SHIELD-IMMUNITY-2026-10-29.json';fs.writeFileSync(base+'4671-user-confirmations.json',JSON.stringify(c,null,2)+'\n');
console.log('4671 confirmed semantics applied');
