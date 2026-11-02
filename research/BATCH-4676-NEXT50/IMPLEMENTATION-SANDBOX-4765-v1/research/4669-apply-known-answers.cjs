'use strict';const fs=require('fs'),assert=require('node:assert/strict'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',dir=base+'4669-before/';fs.mkdirSync(dir,{recursive:true});function edit(file,pairs){let s=fs.readFileSync(file,'utf8');fs.writeFileSync(dir+file.split('/').pop(),s,{flag:'wx'});for(const[a,b]of pairs){assert.ok(s.includes(a),a);s=s.replace(a,b);}fs.writeFileSync(file,s);}
edit('dist/range-souls.js',[
 ['q=c.a.soulState.qualifiedEntryClearOrder1872;',"q=c.a.soulState.qualifiedEntryClearOrder1872??'round-first';"],
 ['const target=c.a.soulState.qualifiedNoReturnReceiver1872;',"const target=c.a.soulState.qualifiedNoReturnReceiver1872??'enemy';"]]);
edit('dist/range-effects.js',[
 ['q=c.a.soulState.qualifiedFirst4669?.[id];',"q=c.a.soulState.qualifiedFirst4669?.[id]??'immediate';"],
 ['q=c.a.soulState.qualified1924HealBasis4669;',"q=c.a.soulState.qualified1924HealBasis4669??'actual';"],
 ['const scope=c.a.soulState.qualified1472Scope4669;',"const scope=c.a.soulState.qualified1472Scope4669??'red-only';"],
 ["q=c.a.soulState.qualified1522Basis4669;const options={'current-red':red", "q=c.a.soulState.qualified1522Basis4669??'round-red';const options={'round-red':c.whaleDamageRound4654(c.a,c.round),'current-red':red"],
 ["if(c.crit){if((c.settledDamage??c.dealt??0)===0&&!['critical','not-critical'].includes(c.a.soulState.qualifiedZeroCrit4669))", "if(c.crit){const zero=c.a.soulState.qualifiedZeroCrit4669??(c.attackImmune?'not-critical':'critical');if((c.settledDamage??c.dealt??0)===0&&!['critical','not-critical'].includes(zero))"],
 ["c.a.soulState.qualifiedZeroCrit4669==='critical'","zero==='critical'"]]);
edit('dist/souls.js',[
 ["if(!bypass&&on(t,'reflect')&&t.effects.reflect.ember1914669&&(t.counts.immune>0||on(t,'免异常')||E.SOULS.trait(t,'ailmentImmune')||t.soulState.immunity1757Charges?.length||t.soulState.oracle2059Charges?.length))throw Error('Q-N50-4511-006：4669反弹与其他免异消费待确认');",''],
 ["if(used[a.side]&&m.kind!=='item'&&(on(a,'紫烬用招烧伤失败扣PP')||on(a,'紫烬用招回复等量固伤'))){if(a.hp<=0)throw Error('Q-N50-4654-012：4669此前持续用招载荷在自身HP0后是否继续待确认');","if(used[a.side]&&a.hp>0&&m.kind!=='item'&&(on(a,'紫烬用招烧伤失败扣PP')||on(a,'紫烬用招回复等量固伤'))){"],
 ["const error=Error('Q-N50-4589-004：4669此前1924末杀是否承接当前37504的933/1719击败条件待确认');error.emberLate4669={round:r,move:move.id,use,hp:f.hp,reward:{...reward}};throw error;","reward.lateKOWithoutBonus=true;"]]);
const c=JSON.parse(fs.readFileSync('research/batch5-answer-preparation-2026-10-29/4669-index.json'));Object.assign(c,{accepted:false,status:'implementing-confirmed-subset',pending:['魂印已有回命重授时长','978保护与两端独立','933重授次数'],testRenames:[],proofs:[],implementedAnswers:{1872:'无回命禁疗对象为敌方；已有回命先清回合再清强化',1522:'统计本回合完整结算红伤，不计固伤和本条待结算220',1356:'护盾归零算暴击，攻击免疫归零不算',1766:'授予当次触发；自身HP0停止',1924:'授予当次触发；实际回复量作为固伤；HP0停止',1472:'仅放大红伤',1719:'独立用后监听晚杀不新增奖励，已授未击败奖励保留',191:'沿用用户统一规则，回合免反优先不消费次数'}});fs.writeFileSync(base+'4669-user-confirmations.json',JSON.stringify(c,null,2)+'\n');console.log('4669 known answers applied; remaining guards retained');
