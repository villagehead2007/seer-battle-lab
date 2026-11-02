'use strict';
const fs=require('fs'),assert=require('node:assert/strict');
const A=__dirname+'/',base='tests/next50-4765.test.cjs',native='tests/deployed-4765.test.cjs';
const names=[...fs.readFileSync(native,'utf8').matchAll(/test\('([^']+)'/g)].map(x=>x[1]);
assert.equal(names.length,37);
const ref=(...ids)=>ids.map(i=>({file:native,name:names[i-1]}));
const extraTests={move:ref(1),soul:ref(2,3,4,5,6,7,8,9,10,11,12,37)};
const byMove={20006:[15],20004:[14],10172:[12,13],20085:[11,13],10010:[13],10168:[12,15],10173:[13],29049:[16],10169:[13],10174:[14],37915:[35,36,37],29050:[17,34],37916:[18,19],37917:[20],37918:[21],37906:[22,23],29043:[24,25,26,27],29044:[4,28],37907:[29,30,11],37908:[31,32,33]};
const snapshot=JSON.parse(fs.readFileSync('research/BATCH-4676-NEXT50/4765/snapshot.json'));
for(const m of snapshot.moves)for(const [i]of m.effectInstances.entries())extraTests[`4765:skill:${m.id}:${i}`]=ref(...byMove[m.id]);
const decisions={'4765:skill:37908:1':{scope:'mixed',singleBehavior:'当前唯一己方存活者且0星时最低完整红伤100；有星按当前每星160增威；攻击免疫仍0，保留正常命中载荷。',deferredBehavior:'若自身未点亮雷辰，按己方完整队伍每存活1只精灵提高最低攻击伤害100；当前单在场之外的真实队伍存活数统计延期。',dependencyEvidence:[{kind:'team-state',quote:'若自身未点亮雷辰则己方每存活1只精灵造成的攻击伤害不低于100'}],trigger:'自身未点亮雷辰，攻击结算最低伤害时读取真实己方存活精灵数。',futureMechanisms:['完整己方队伍与真实存活标记','按真实存活数实时计算攻击最低值']}};
const plan={id:4765,reviewed:true,oldTestFile:A+'4765-before-next50-4765.test.cjs',testFile:base,extraTests,decisions,
 rationale:'独立核对pet4765/ebd2164a、魂印1966/ea01fd9/eid2376[3,1,1]、完整24招45有序实例，未改原文参数版本。原1完整结算技能红伤回复不含固定百分比真实及非技能来源；原2当前1249/532/2060只按对应一次回复的非负净HP增加附粉；保留旧4246精确例外。原112四条且仅四条路径（反向已包括）；113仅四冠名招；114错误第四点END才回满重置；115先点亮再当招载荷；116只穿命中效果封锁，不改概率条件及免异反弹免弱禁强保护PP保护整招无效；117充电下轮一轮；118反转负级正常强化准入、失败不免异；原23死者普通载荷停止、37立即2243非KO保留HP/PP状态、123已命中零红暴击702回满均有原生组合。全部35原状态测试保留并按位置显式标题对应，37原生测试完整操作原魂印与完整技能；HP/PP/能力/异常/回合/消费与免疫保护失败及真实到期断言可追溯。真正队伍存活数2289单独混合延期，不延期自身雷辰和最低100。无额外觉醒魂印版本或伙伴技能被藏在延期。',
 soulBehavior:'真实1966四冠名槽位东南西北，用招前点亮未亮槽、麻痹并全PP1；控制道具不点亮，重复不重授。四条已答闪电路径第四点END解除异常负级并下轮起觉醒3轮，否则END魂印回满并重置。原麻痹roundStart解除才本轮先制1。觉醒免耗PP含0PP、必中必暴免异免弱、自身先制1压敌先制0保速度排序，仅穿命中效果封锁且保概率条件与基础准入。技能完整红伤独立魂印回复、技能禁疗不封魂印而全禁疗封；固定百分比真实及非技能不计；到期重置进度，普通死亡停止载荷。'};
fs.writeFileSync(A+'4765-review-plan.json',JSON.stringify(plan,null,2)+'\n',{flag:'wx'});
console.log('4765 explicit 70 item plan prepared');
