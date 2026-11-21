(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./engine.js'));
  else root.BattleDisplay=factory(root.BattleEngine);
})(globalThis,function(E){
  'use strict';
  // Read raw state only. Several engine ability getters initialize or consume their state.
  const pathValue=(object,path)=>path.split('.').reduce((value,k)=>value?.[k],object);
  const specs=[];
  function resource(ids,path,label,unit,options={}){
    specs.push({ids,path,label,unit,...options});
  }
  resource([1678],'yongchang','永昌玺','方',{max:6});
  resource([2092,2106],'sisy4905.nextCount','下次用招触发效果','项',{max:6});
  resource([2092,2106],'sisy4905.usesHere','本次在场已用技能','次');
  resource([2019],'kabuda2019.count','本次在场免疫或转化','次',{max:4});
  resource([1714],'debuEntry.total','本次登场双方场下阵亡','只');
  resource([1733,1948],'whirlpoolPriority','本场击败异常先制（下场保留）','级',{positive:true});
  resource([1892,1948],'crocKO1892','本次在场面板成长','次',{positive:true});
  resource([1805],'ming1805','命起','层',{max:4});
  resource([1805],'fall1805','魂落','层',{max:4});
  resource([1656],'thunderStarling','天雷银椋','级',{max:3});
  resource([976],'skyTeamPriority','阵亡队友先制加成','级',{max:5,positive:true});
  resource(null,'resistanceGain2379','继承伤害抗性','%',{positive:true});
  resource([1809],'futureInstructions1809','未来指令','道',{max:3});
  resource([1809],'collapsedCount1809','本次在场崩溃','个');
  resource([1972],'crisisCount1972','危机感','点');
  resource(null,'futureLink','未来链接','级',{max:3,positive:true});
  resource(null,'corpseCount','咽咎尸骸','具');
  resource(null,'leonCosmicLayers','宙变之殢','层',{max:5,positive:true});
  resource(null,'ankaHeartCharges','下次攻击的灼心之焰','次',{positive:true});
  resource([1973,1948],'magicCurse1973','魔王咒怨','层');
  resource([1972],'magicCurse1973','魔王咒怨','层');
  resource([1973,1948],'killCount1973','实际击败','次');
  resource([2121],'holyThunder','神圣之霆','道',{max:6});
  resource(null,'holyVerdict','荣光之裁','层',{max:3,positive:true});
  resource(null,'holyMarks','神印','层',{max:3,positive:true});
  resource([2121],'holyAttackPending','下次攻击转化麻痹','次',{positive:true});
  resource([2121],'holyStatusPending','属性技能触发麻痹','次',{positive:true});
  resource([1137],'shivaDefeats','累计击败','只');
  resource([957],'miracleAttacks','神迹攻击增伤','层',{max:3});
  resource([957],'miracleStatuses','神迹受击减伤','层',{max:3});
  resource([931,1473],'torukPending','后手累计先制','级',{max:3});
  resource([951],'zakKills','实际击败','次');
  resource([2093],'nineScars','九劫之痕','层');
  resource([2093],'hundredFires','百炼之炎','层');
  resource([1932],'eternalWater','永恒之水','道',{max:8});
  resource(null,'inkTears','蚀砚之泪','滴',{max:4,positive:true});
  resource([1971],'coldEssence','寂杀之魄','道',{max:3});
  resource(null,'coldBan','肃霜之禁','点',{max:200,positive:true});
  resource([1985],'sealLayers','封邪之嶂','层',{max:4});
  resource([1834],'darkRoots','晦暗之根','层',{max:5});
  resource(null,'darkCause.level','晦暗之因','级',{max:5,positive:true});
  resource([1756],'darkDragonHatred','黯龙余恨','层');
  resource([1756],'fallenDragonResentment','堕龙残怨','层');
  resource([987,2072],'natureBlessings','自然祝福','层');
  resource([2072],'ningjie','宁界之律','道',{max:5});
  resource(null,'qionghua','琼华之庇','道',{max:4,positive:true});
  resource([1825],'jasmineCore','灵茉之芯','点',{max:3});
  resource([1258],'elephantCharge','蓄力','层',{max:9});
  resource([1829],'intent1829','战意','层',{max:20});
  resource([1588],'yuliTeamLayers','群辉加护','层');
  resource([1588,2080],'yuliFangLayers','群芳加护','层');
  resource([2099],'moth2099.embers','渐烬','层');
  resource([2099],'moth2099.sea','天烬海','层');
  resource([2144],'xuan2144.layers','气吞山河','层',{max:5});
  resource([1061],'xin.hp','辛体力','点',{maxPath:'xin.maxHp'});
  resource([2038],'lyrics4853.list.length','唱词库存','句');
  resource([2097],'lastSurvival4911.lost','保命已损速度','点',{positive:true});
  resource([1862],'wuwei1862.power','万相乖离增威','点');
  resource([1862],'wuwei1862.cancelled.length','万相已取消条件','项',{max:6});
  resource([1901,1940],'ophelia4706.stars','命运晨星','层',{maxPath:'ophelia4706.cap'});
  resource([1901,1940],'ophelia4706.doubleCharges','支援效果翻倍','次',{positive:true});
  resource(null,'guiFu1747','诡符','道',{max:4,positive:true});
  resource(null,'chiyong1878.layers','蚩庸之锁','层',{max:3,positive:true});
  resource(null,'holyVerdict','神罚裁决','层',{max:3,positive:true});
  resource(null,'executionMarks','处决印记','层',{max:2,positive:true});
  resource([2009],'heroGlory2009','英雄之耀','层',{max:5});
  resource([1972],'dream1972.crisis','危机感','点');
  resource([1972],'dream1972.flower','希望之花','点',{max:100});
  resource([1292,1541],'skyWindPriority','啸风攻击先制','级',{max:3});
  resource([1292,1541],'skyWindChance','啸风翻倍概率','%');
  resource([519],'teamKills519','实际击败','只');
  resource([931,1473],'torukPriority','累计先制','级');
  resource([1668],'jueke','爵刻','枚',{max:6});
  resource([1664],'futureSingularity','未来奇点','层',{max:3});
  resource([1638],'dragonGall','龙胆','枚',{max:7});
  resource([372,574],'energy','神耀能量','层',{maxBySoul:{372:5,574:6}});

  resource([2139],'executors','执行者','个',{max:5});
  resource([708],'marsShield','形态护盾','点',{max:300});
  resource([2005],'inverseMight','逆命之威','层',{max:5});
  resource(null,'ancientDread','荒古之慑','层',{max:5,positive:true});
  resource([832,2005],'jolieEntryBonus','本次在场攻击增伤','%');
  resource([832,2005],'jolieClearCrit','攻击清回合并必定暴击','次',{positive:true});
  resource([2005],'jolieDreadBonus','荒古之慑额外层数','层',{positive:true});
  resource([2005],'jolieCritGuards','抵挡致命一击','次',{positive:true});
  resource([1508],'lastWhisperLayers','逝者亡语','层',{max:6});
  resource([2051],'leonOldDialLayers','旧日之晷','层',{max:5});
  resource([2051],'leonOldDialUses','旧日之晷剩余可用次数','次');
  resource(null,'dragonEaterStacks','邪龙之噬','道',{positive:true});
  resource([2005],'jolieEvolutionEnds','结束衍化类异常','次',{positive:true});
  resource([1586,2055],'lokiLayers','堕恶神祇','层',{max:3});
  resource([1586,2055],'lokiResetBase','神祇重置基数','层');
  const names2149={yue:'帝皇之钺',yu:'帝皇之御'};
  function group(f){
    const st=f.soulState?.group2149;
    if(f.soulId!==2149||f.soulHash!=='b694e4d9'||st?.sourceHash!==f.soulHash||!st.bodies?.[st.master])return null;
    const members=[];
    for(const [id,body] of Object.entries(st.bodies)){
      const name=names2149[id]??body.name;
      if(!name)continue;
      const main=id===st.master,hp=main?f.hp:body.hp;
      if(!Number.isFinite(hp))continue;
      // 2149 stores independent current HP and PP. Both bodies use this fighter's maximum.
      members.push({name,role:main?'主位':hp<=0?'阵亡成员':'副位',hp,maxHp:body.maxHp??f.stats.maxHp,main});
    }
    members.sort((a,b)=>Number(b.main)-Number(a.main));
    return {members,vacant:!members.some(m=>m.role==='副位')};
  }

  function thunderStars(f,moves={}){
    if(Number(f.number)!==4765||f.soulId!==1966||!E.SOULS.acceptsSource(1966,f.soulHash))return [];
    const state=f.soulState?.lei1966,stars=state?.stars??[],directions=['东','南','西','北'];
    const slots=directions.map((direction,index)=>{
      const id=f.moves?.[index],label=id?(moves[id]?.name??f.teamPPDefinitions?.[id]?.name??id):'空位';
      return direction+' '+label+' '+(stars.includes(index)?'已点亮':'未点亮');
    });
    const connections=(state?.connections??[]).map(([from,to])=>directions[from]+'→'+directions[to]);
    return [
      {name:'雷辰 · 四方向',value:slots.join(' / '),activeOnly:true},
      {name:'雷辰 · 连接',value:stars.length?(stars.map(slot=>directions[slot]).join('→')+
        (connections.length?' · 连线 '+connections.join('、'):' · 尚未连线')):'尚未点亮',activeOnly:true},
    ];
  }

  function reiStatuses(f,round,moves){
    const isOriginal=Number(f.number)===4765&&f.soulId===1966;
    const isLaw=Number(f.number)===4946&&f.soulId===2146;
    if ((!isOriginal&&!isLaw)||f.hp<=0||!E.SOULS.acceptsSource(f.soulId,f.soulHash)) return [];
    const items=isOriginal?thunderStars(f,moves):[];
    if(E.SOULS.registry[1966].abilities.active(f,round)){
      const end=f.soulState.lei1966.awake.end;
      items.push({name:'觉醒',value:`剩余 ${end-round+1} 回合`,activeOnly:true});
    }
    if(isLaw&&f.soulState.chenLaw2146>0)
      items.push({name:'辰律',value:`${f.soulState.chenLaw2146} / 4`,activeOnly:true});
    if(isOriginal&&f.ailments?.['麻痹']>=round)
      items.push({name:'技能先制 +1',value:'回合开始解除麻痹后生效',activeOnly:true});
    return items;
  }

  function spMarsStatuses(f,round){
    const items=[],rules=E.SpMars;
    const state=f.soulState?.spMars;
    if(rules.owns(f)&&state){
      const bodies=rules.FORMS.map(form=>{
        const main=form===state.lead,hp=main?f.hp:state.bodies[form].hp;
        return `${rules.LABELS[form]}${main?'（主位）':''} ${hp>0?hp+' / '+f.stats.maxHp:'已阵亡'}`;
      });
      items.push({name:'形态体力',value:bodies.join(' · '),activeOnly:true});
      if(state.pending)items.push({name:'预约切位',value:`第 ${state.pending.round} 回合 · ${rules.LABELS[state.pending.form]}`,activeOnly:true});
      if(state.mark1>0)items.push({name:'印记一',value:`${state.mark1} / 3 层`,activeOnly:true});
    }
    const inherited=f.soulState?.spMarsInheritance,layers=rules.mark2Layers(f,round);
    if(inherited?.layers)items.push({name:'继承印记一',value:`${rules.LABELS[inherited.form]} · ${inherited.layers} 层`,activeOnly:true});
    if(layers)items.push({name:'印记二',value:`${layers} 层 · 有效能力等级 −${layers}`,activeOnly:true});
    return items;
  }

  function fighter(f,round,moves={},battle=null){
    const state=f.soulState??{},items=[...reiStatuses(f,round,moves),...spMarsStatuses(f,round)];
    function add(name,value){items.push({name,value:String(value)});}
    function active(name,value){items.push({name,value:String(value),activeOnly:true});}
    if((f.counts?.mystic424NextRedDouble??0)>0)active('米斯蒂克 · 下次受红伤','×2 · 一次 · 固定、百分比、真实不消费');
    const validVersion=E.SOULS.acceptsSource(f.soulId,f.soulHash);
    const opponent=battle?.fighters?.[1-f.side];
    if(validVersion&&f.soulId===618){
      const nominal=Math.floor(f.stats.maxHp/3),entry=state.teamEntry??{number:1,round:1};
      active('天苍玄魂 · 登场保护',f.hp<=0?'已阵亡':entry.number===1&&round===entry.round?'首次登场当回合 · 对手攻击技能无效':'首次登场保护已结束');
      active('天苍玄魂 · 低体追击',nominal+' 点百分比伤害 · 基础回复 '+nominal+'（按理论值，仍受禁疗与回复上限影响）');
      active('天苍玄魂 · 高体追击',Math.floor(f.hp/2)+' 点百分比伤害 · 不回复');
      if(opponent)active('天苍玄魂 · 体力比较',f.hp<=0?'已阵亡':opponent.hp<=0?'目标已阵亡':(f.hp<opponent.hp?'当前低于对手':f.hp>opponent.hp?'当前高于对手':'当前与对手相等')+' · 对手攻击技能用后重新判定');
    }
    if(validVersion&&[535,548].includes(f.soulId)&&f.hp>0&&opponent?.hp>0){
      const sleeping=opponent.ailments?.['睡眠']>=round;
      active('王瞳 · 命中前睡眠条件',sleeping?'目标已睡眠 · 下次攻击有效命中追加 '+Math.floor(f.stats.maxHp/3)+' 点固定伤害':'目标未睡眠 · 当前不满足固定附伤条件');
    }
    if(validVersion&&[538,549].includes(f.soulId)&&f.hp>0){
      active('超能 · 吸取条件',f.hp<f.stats.maxHp/2?'当前低于半体 · 攻击命中后检查吸取条件':'当前未低于半体');
    }
    if(f.soulState?.nextDamageReductionFraction>0)active('下次红伤减伤',Math.round(f.soulState.nextDamageReductionFraction*100)+'% · 一次');
    const heal927=f.effects?.['用招低体回血粉伤'];
    if(heal927&&heal927.start<=round&&E.STATUS_RULES.timedPresent(heal927,round))active('用招回血附伤','技能用后回复 '+Math.floor(f.stats.maxHp*heal927.fraction)+' 点 · 回复前低体时按实际回复附百分比伤害');
    if(f.hp>0&&opponent?.hp>0)for(const key of f.moves??[]){const move=moves[key],op=move?.operations?.find(op=>op.effectId===1064);if(!op)continue;
      const eligible=E.WIKI.effectsEngine.registry[1064].eligibleTargetNumbers.includes(Number(opponent.number));
      active(move.name+' · 长老加成',eligible?'当前目标触发 · 本招红伤 +'+op.sourceArgs[0]+'%':'当前目标未触发本招长老加成');
    }
    const pending838=f.effects?.['命中技能附加固伤'];
    if(pending838&&pending838.start<=round&&E.STATUS_RULES.timedPresent(pending838,round))active('待用固定附伤',pending838.amount+' 点 · 本回合自身技能命中一次');
    const delayed62=f.effects?.['延迟决胜'];
    if(f.hp>0&&opponent?.hp>0&&delayed62?.end>=round&&delayed62.delayedExecutionToken===opponent.effects?.['延迟决胜绑定']?.delayedExecutionToken)active('延迟决胜 · 计时','第 '+delayed62.start+' 回合结算 · 任一方换人或被消回合即失效');
    if(validVersion&&f.soulId===416&&opponent)active('鬼焰 · 当前烧伤条件',opponent.ailments?.['烧伤']>=round?'对手烧伤：技能先制+1、攻击威力×2':'对手未烧伤：无魂印先制与威力加成');
    if(validVersion&&f.soulId===421&&f.hp>0)active('圣甲瞳 · 每回合','特攻、速度各+1 · 吸取对手 150 点体力');
    if(validVersion&&Number(f.number)===3425&&[740,1030].includes(f.soulId)&&f.hp>0){
      const due=state.oscarNextBonusRound,bonus=f.soulId===1030?100:50;
      if(state.oscarActiveBonusRound===round||due===round)active('奥斯卡 · 当回合奖励','第 '+round+' 回合可用 · 红伤 +'+bonus+'% · 按完整红伤100%回复 · 本回合结束失效 · 下场清除');
      if(due>round)active('奥斯卡 · 待生效奖励','第 '+due+' 回合可用 · 红伤 +'+bonus+'% · 按完整红伤100%回复 · 只限该回合 · 下场清除');
      if(state.oscarGuaranteed&&(f.soulId===1030||state.oscarGuaranteeRound>=round))active('奥斯卡 · 封属保底',f.soulId===1030?'下次对手属性技能100%失效 · 下场清除':'第 '+state.oscarGuaranteeRound+' 回合对手属性技能100%失效 · 逾期失效 · 下场清除');
    }
    if(validVersion&&Number(f.number)===3102&&[449,456].includes(f.soulId)&&f.hp>0){
      active('武神 · 最近回初判定',typeof state.ruierHigh==='boolean'?(state.ruierHigh?'高体：本回合红伤×2':'非高体：无本回合红伤加成'):'待回合开始比较双方体力');
      active('武神 · 待用攻击回血',state.ruierHealNext?'已储备 · 下次攻击命中按完整红伤回复 · 下场清除':'未储备 · 回合初低体时获得');
      active('武神 · 储备固伤',(state.ruierFixedNext??0)+' 点 · 实际魂印回复量 · 有效技能命中消费，失败保留 · 下场清除');
    }
    if(validVersion&&Number(f.number)===3141&&[480,611].includes(f.soulId)&&f.hp>0){
      const entryRound=state.teamEntry?.round??1,reward=state.hadesRewardRound,priority=f.soulId===611?3:2;
      active('冥 · 最近回初判定',typeof state.hadesLow==='boolean'?(state.hadesLow?'低体：全技能先制+2 · 受到攻击令对手害怕':'非低体：无低体先制与受击害怕'):'待回合开始比较双方体力');
      active('冥 · 登场保命','第 '+entryRound+' 回合登场 · '+(round===entryRound?'本回合致死保留1体力':'本次登场首回合已过'));
      if(reward>=round)active('冥 · 保命奖励',(reward===round?'本回合':'第 '+reward+' 回合')+'攻击先制+'+priority+' · 附加对手最大体力1/3固定伤害');
    }
    if(validVersion&&Number(f.number)===3142&&[484,527].includes(f.soulId)&&f.hp>0){
      if(opponent){const comparison=f.hp<opponent.hp?'低体':f.hp>opponent.hp?'高体':'等体',branch=comparison==='低体'?'本回合免断回合':comparison==='高体'?'战斗阶段末攻击+2'+(f.soulId===527?'、速度及命中+1':''):'无高低体分支';active('雷 · 待回初体力判定','当前'+comparison+' · 回初仍如此则'+branch);}
      active('雷 · 强化吸取','回合开始及结束各吸取对手能力提升');
      active('雷 · 对手回合效果','回初压缩至本回合结束 · 不属于消除');
      const electric=f.effects?.['电系伤害翻倍'];if(electric?.end>=round)active('充电 · 电系红伤',electric.start>round?'第 '+electric.start+' 回合生效 · ×2':'本回合 ×2 · 回合结束到期');
      if(f.moves?.includes('wiki:24970'))active('万鸣齐闪 · 属性直伤','260 电系基数 · 每种能力提升增加10% · 受攻击减免及免伤');
    }
    if(validVersion&&Number(f.number)===3665&&f.soulId===951&&f.hp>0){
      const kills=state.zakKills??0;active('厉魇魔王 · 击败成长',kills+' 层 · 下场重置');
      active('厉魇魔王 · 魂印秒杀',Math.min(100,15+3*kills)+'% · 攻击命中后');
    }
    if(validVersion&&Number(f.number)===4037&&[1292,1541].includes(f.soulId)&&f.hp>0){
      active('啸风 · 当前概率',(state.skyWindChance??40)+'% · 下场重置');
      active('啸风 · 累计攻击先制',(state.skyWindPriority??0)+' / 3 · 下场重置');
    }
    if(validVersion&&Number(f.number)===3200&&[523,532].includes(f.soulId)&&f.hp>0){
      const band=f.hp<f.stats.maxHp/2?'当前低于半体力':f.hp>f.stats.maxHp/2?'当前高于半体力':'当前恰半体力';
      active('霍德尔 · 当前体力',band+' · 分支以战阶末当时体力判定');
      active('霍德尔 · 高体分支','战阶末高体时授下'+(f.soulId===523?1:2)+'回合免异常');
      if(f.moves?.includes('wiki:19965')){const uses=state.effect497Uses?.['wiki:19965']??0;active('王绝影逆魂 · 下次基础附伤',Math.min(400,200+uses*100)+' 固定 · 天敌翻倍 · 下场重置');}
      const heal=f.effects?.['用招低体比例回满'];if(heal?.end>=round)active('低体用招回复','回复时低于半体力则回满，否则回最大体力1/3 · 剩 '+Math.max(0,heal.end-round+1)+' 回合');
    }
    if(validVersion&&Number(f.number)===3194&&f.soulId===519&&f.hp>0){
      const kills=state.teamKills519??0;active('魔王 · 自身击败',kills+' 只 · 离场重置');
      active('魔王 · 当前魂印秒杀',Math.min(100,15+2*kills)+'% · 攻击命中后');
      active('魔王 · 当前满体条件',f.hp===f.stats.maxHp?'当前满体力 · 受攻击时弱化并授下回合先制':'当前未满体力 · 无满体受击奖励');
      const next=f.effects?.id984;if(next?.end>=round)active('魔王 · 满体受击先制',(next.start>round?'第 '+next.start+' 回合':'本回合')+'技能先制+'+next.amount+' · 该回合结束到期');
      if(f.counts?.nextAttackFixed>0)active('待用攻击固定附伤',f.counts.nextAttackFixed+' 次 · 每次 '+(state.nextAttackFixedAmount??0)+' 固定');
    }
    if(validVersion&&Number(f.number)===3190&&[516,531].includes(f.soulId)&&f.hp>0){
      active('王夜 · 魂印闪避','受到攻击时70%闪避 · 必中依原规则');
      active('王夜 · 攻击附伤','攻击值'+(f.soulId===516?25:30)+'% 固定伤害');
      const next=state.blakeBuffRound;if(next>=round)active('王夜 · 闪避后奖励',(next>round?'第 '+next+' 回合':'本回合')+'攻击无视双防强化 · '+(f.soulId===516?50:65)+'%害怕');
      const burn=f.effects?.['持续攻击值粉伤'];if(burn?.end>=round)active('幻影魔能 · 持续附伤','面板攻击'+Math.round(burn.fraction*100)+'% 百分比 · 不计能力等级 · 剩 '+Math.max(0,burn.end-round+1)+' 回合');
    }
    if(validVersion&&Number(f.number)===3150&&[492,528].includes(f.soulId)&&f.hp>0){
      active('雷祖 · 最近回初判定',typeof state.glauriLow==='boolean'?(state.glauriLow?'低于半体力 · 对应回合末麻痹2回合':'未低于半体力 · 未登记末麻痹'):'待回合开始判定');
      active('雷祖 · 最近战阶判定',typeof state.glauriHigh==='boolean'?(state.glauriHigh?'高于半体力 · 已授对应次回合红伤+'+(f.soulId===492?50:75)+'%':'未高于半体力 · 无该次奖励'):'待战斗阶段结束判定');
      const reward=f.effects?.id913;if(reward?.end>=round)active('雷祖 · 红伤奖励',(reward.start>round?'第 '+reward.start+' 回合生效':'本回合')+'红伤+'+Math.round(reward.bonus*100)+'% · 回合结束到期');
    }
    if(validVersion&&f.soulId===424&&f.hp>0){
      const entry=state.teamEntry??{number:1,round:1},left=entry.number<=2?Math.max(0,entry.round+2-round):0;
      active('秘 · 登场封属性','第 '+entry.number+' 次登场 · '+(left?'剩 '+left+' 回合':'封属性已结束'));
      active('秘 · 属性技能惩罚',left?'350 固定 · 下次受红伤×2 · 剩 '+left+' 回合':entry.number>2?'本场前两次已用尽':'本次惩罚窗口已结束');
      active('秘 · 回合弱化','回合末随机2种不同能力各−1');
      if(f.moves?.includes('wiki:19476')){const uses=state.skillHitUses?.['wiki:19476']??0;active('神佛俱灭 · 下次附伤',Math.min(40,20+uses*10)+'% 对手最大体力 · 百分比伤害 · 下场重置');}
    }
    if(validVersion&&f.soulId===425&&f.hp>0){
      const low=f.hp<f.stats.maxHp/2,high=f.hp>f.stats.maxHp/2;
      active('圣甲雷 · 当前体力',high?'高于半血：技能50%麻痹 · 攻击吸取20%':low?'低于半血：无魂印麻痹 · 攻击吸取40%':'恰为半血：无魂印麻痹 · 攻击吸取20%');
      if(f.moves?.includes('wiki:16103'))active('雷皇乱舞 · 连击','下次 '+Math.min(5,2+(state.hitGrowth?.['wiki:16103']??0))+' 连击 · 命中后+1 · 下场重置');
      const electric=f.effects?.['电系伤害翻倍'];
      if(electric?.end>=round)active('电系伤害翻倍',electric.start>round?'第 '+electric.start+' 回合生效 · 电系红伤×2':'本回合生效 · 电系红伤×2');
    }
    if(validVersion&&Number(f.number)===3033&&f.soulId===393&&f.moves?.includes('wiki:19286')){
      const count=state.damageGrowth?.['wiki:19286']??0;
      active('佛晓跃金破 · 增伤',Math.min(120,count*30)+'% · 已使用 '+count+' 次 · 上限 120%');
    }
    if(validVersion&&f.soulId===400&&typeof state.lubuFull==='boolean')active('鬼神 · 最近回初满体',state.lubuFull?'已满足：红伤+50%、免异常、免弱':'未满足：无满体增伤与免疫');
    if(validVersion&&[398,399].includes(f.soulId)){
      if(Number.isFinite(state.fallenOnEntry))active('乔特鲁德 · 登场判定','阵亡队友 '+state.fallenOnEntry+' · 红伤+'+Math.min(50,state.fallenOnEntry*10)+'% · 返场重判');
      if(Number.isFinite(state.attackShield))active('乔特鲁德 · 红伤护盾',state.attackShield+' 点 · 固定、百分比及真实伤害不消耗');
      if(f.soulId===399)active('乔特鲁德 · 魂印红伤减免','20% · 固定、百分比及真实伤害不减');
      if(f.counts?.nextDamageReturn>0)active('乔特鲁德 · 下次红伤反馈',Math.round(f.counts.nextDamageReturn*100)+'% · 真实伤害 · 一次');
      if(f.counts?.nextDamageReduction>0)active('乔特鲁德 · 下次红伤减免',f.counts.nextDamageReduction+' 点 · 一次');
    }
    if(validVersion&&f.soulId===410){
      active('圣甲·盖亚 · 回合回复',f.hp<=0?'已阵亡：不回复':state.gaiaRecovery?'已启动：每回合回复 '+Math.floor(f.stats.maxHp/3)+' 点 · 下场清除':'未启动：使用技能后开启');
      active('圣甲·盖亚 · 临终反击',f.level===100?'100级 · 战斗阶段实际死亡时触发':f.level+'级 · 不触发临终反击');
      if((f.roundSettledSkillDamageTaken??0)>0)active('圣甲·盖亚 · 已受技能伤害',f.roundSettledSkillDamageTaken+' 点 · 完整结算');
    }
    if(validVersion&&[395,396].includes(f.soulId)){
      active('王龙 · 当前红伤减免',Math.round((E.SOULS.trait(f,'attackReduction')??0)*100)+'% · 固定、百分比及真实伤害不减');
      if(typeof state.hamoHigher==='boolean')active('王龙 · 最近回初判定',state.hamoHigher?'高体：免异常':state.hamoLower?'低体：战斗阶段末回复 '+Math.floor(f.stats.maxHp/3)+' 点':'等体：不免异常、不回复');
    }
    if(opponent&&f.hp>0&&f.soulId===374&&validVersion){
      const positiveKinds=Object.values(opponent.stages).filter(n=>n>0).length;
      const vesselPierce=E.vesselSupport2162(battle,f,opponent,'ailment');
      add('樱·攻击冰封概率',(20+10*positiveKinds)+'% · 对手 '+positiveKinds+' 种能力提升 · '+(vesselPierce?'神魂支援忽略对应免疫与抗性':'仍受异常免疫与抗性影响'));
    }
    if(f.counts?.nextStatusInvalid>0)add('下次属性技能无效',f.counts.nextStatusInvalid+' 次');
    if(validVersion&&f.soulId===543){const next=Math.min(270,90+90*(state.fortyNineDrains??0));add('四九 · 下次吸取',next+' 点固定伤害 · 基础回复 '+next+' · 下场重置');const opponent=battle?.fighters?.[1-f.side];if(opponent)add('四九 · 体力条件',f.hp<=0?'已阵亡，当前不触发':f.hp>opponent.hp?'当前高于对手 · 红伤提升49%':f.hp<opponent.hp?'当前低于对手 · 红伤减少49%':'当前与对手相等 · 无增减伤');}
    if(validVersion&&[552,553].includes(f.soulId)){const fraction=f.soulId===553?.6:.5,own=Math.floor((E.effective(f,'def')+E.effective(f,'spd'))*fraction),opponent=battle?.fighters?.[1-f.side];add('月辉 · 攻击回复','自身双防 '+Math.round(fraction*100)+'% · 基础回复 '+own);if(opponent)add('月辉 · 攻击附伤',opponent.hp>0?'对手双防 '+Math.round(fraction*100)+'% · '+Math.floor((E.effective(opponent,'def')+E.effective(opponent,'spd'))*fraction)+' 点固定伤害':'目标已阵亡，不再追加固定伤害');}
    if(validVersion&&f.soulId===560){add('明王 · 当前减伤',f.hp<=0?'已阵亡':state.mingReductionRound===round?'红伤减少50% · 本回合有效':'未生效 · 单次红伤高于300后下回合获得');add('明王 · 击败反制',state.mingDeathTriggered?'已触发 · 对手体力降至1，清回合并反转强化':f.hp>0?'待触发 · 自身被击败时生效':'未触发');}
    if(validVersion&&f.soulId===564){const count=(state.skillPrioritySources??[]).filter(e=>e.key==='soul:564').reduce((n,e)=>n+e.count,0);add('邪灵王 · 下次先制',f.hp<=0?'已阵亡':count?'技能先制+3 · '+count+' 次 · 下场重置':'未储备');add('邪灵王 · 当前吸血',f.hp<=0?'已阵亡':'完整红伤的'+(f.hp<f.stats.maxHp/2?60:40)+'%');}
    if(validVersion&&Number(f.number)===3240){const move=(f.moves??[]).map(k=>moves[k]).find(m=>m&&(m.wikiId??m.id)===15884&&m.revision==='seerapi:e8364209'&&(m.operations??[]).some(o=>o.effectId===465&&o.index===0&&JSON.stringify(o.params)==='[20,2,10,60]'));if(move){const hits=state.effect465Uses?.[move.id]??0;add('妖异扭曲术 · 下次疲惫','基础'+Math.min(60,20+hits*10)+'% · 最高60% · 已命中'+hits+'次 · 下场重置');}}
    if(validVersion&&[558,566].includes(f.soulId)){const cap=f.soulId===566?175:150;add('斗战 · 攻击增伤','+'+Math.round((state.arslanBonus??0)*100)+'% / '+cap+'% · 每次战斗阶段结束增加'+(f.soulId===566?35:30)+'% · 下场保留');}
    if(validVersion&&f.soulId===2097&&state.lastSurvival4911)add('保命剩余速度',f.stats.spe+' 点'+(f.stats.spe===0?' · 速度耗尽，保命失效':''));
    for(const spec of specs){
      if(spec.ids&&(!validVersion||!spec.ids.includes(f.soulId)))continue;
      if(validVersion&&Number(f.number)===4037&&[1292,1541].includes(f.soulId)&&['skyWindPriority','skyWindChance'].includes(spec.path))continue;
      if(validVersion&&Number(f.number)===3665&&f.soulId===951&&spec.path==='zakKills')continue;
      const n=pathValue(state,spec.path);
      if(!Number.isFinite(n)||(spec.positive&&n<=0))continue;
      const max=spec.max??spec.maxBySoul?.[f.soulId]??(spec.maxPath?pathValue(state,spec.maxPath):null);
      add(spec.label,n+(Number.isFinite(max)?' / '+max:'')+' '+spec.unit);
    }
    const remaining=(name,end)=>{if(Number.isInteger(end)&&end>=round)add(name,'余 '+(end-round+1)+' 回合');};
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedHuoguang&&state.huoguangFrenzyEnd>=round){remaining('继承北冥狂刃',state.huoguangFrenzyEnd);add('狂刃攻击附伤',(state.huoguangDefeatAttackDamage??0)+' 点真实伤害 · 上次击败回合红伤总量');}
    if(state.exposure4853)add('曝','低于或等于50%的异常抗性降低20个百分点 · 禁被击败效果，被击败时消逝');
    if(validVersion&&f.soulId===2038&&state.mehSwitchIn2038){const entry=state.mehSwitchIn2038;add('最近中切一号位','第'+entry.round+'回合自动选择 · '+(entry.lyricGranted?(entry.lyric?'回末已获对应唱词':'该技能无对应唱词'):'等待回末唱词'));}
    if(validVersion&&f.soulId===2038&&state.lyrics4853?.list.length){const names={2372:'莎木斯的赞颂',2373:'霍尔希德的欢歌',2374:'拉的叙事诗',2375:'舍麦什的摇篮曲'};add('已有唱词',state.lyrics4853.list.map(id=>names[id]??String(id)).join('、'));}
    if(validVersion&&f.soulId===2038&&state.lyricBursts4853?.length){const burst=state.lyricBursts4853.at(-1);add('最近破黯穿穹','第'+burst.round+'回合 · '+burst.different+'种不同、'+(burst.repeated??0)+'句重复 · 场下每位回复'+(burst.repeated??0)*50);}
    if(validVersion&&f.soulId===1061&&state.xinFusion)add('荒神融合','当前免固伤、百分比伤害和能力下降 · 固伤/百分比抗性100% · 下场重置');
    if(validVersion&&f.soulId===2144&&state.xuan2144?.entryPanel)add('玄武开战面板','速度外五项各 +'+state.xuan2144.entryPanel.amount+' · 本场保留，返场不重复提升');
    if(validVersion&&f.soulId===2009&&state.heroGloryPanel2009>0)
      add('英雄之耀面板',`体力、防御、特防、速度各 +${state.heroGloryPanel2009}`);
    if(state.emperor2144?.sourceHash==='ef05133e'){
      if(state.emperor2144.permanent)add('八方真武帝','永久 · 下场保留');
      else if(state.emperor2144.end>=round)add('八方真武帝','余 '+(state.emperor2144.end-round+1)+' 回合 · 下场清除');
    }
    remaining('亮节',state.bright2009);
    remaining('威怯',state.awe2009);
    remaining('武诛',state.wuzhu2009End);
    for(const [key,label,hash,rule]of [['starEntangle1847','星芳之缠','5521fbf2','攻击伤害 -50%'],['starSoak1848','星海之浸','206637ec','属性技能无效'],['starFlare1849','星火之灼','8e17ffc7','回复效果 -100%']]){
      const mark=state[key];if(mark?.sourceHash===hash&&mark.start<=round&&mark.end>=round)add(label,(mark.sourceSide===0?'A 方':'B 方')+' 施加 · 余 '+(mark.end-round+1)+' 回合 · '+rule+' · 受攻击伤害后附 50% 百分比伤害');
    }
    if(validVersion&&f.soulId===1848)add('星海致死回复',f.level!==100?'100级可触发':state.starLethalUsed1848?'本场已使用':'本场可用 1 次');
    if(validVersion&&f.soulId===2085&&state.ghostEntryCurse)add('本次在场诅咒入场','无视伤害减少 · 对手禁止被击败效果 · 下场清除');
    if(state.guiFu1747>0){const n=Math.min(4,state.guiFu1747);add('诡符下场扣血','下场保留 · '+n*50+' 点 · 至少剩1体力 · 受到暴击伤害 +'+n*15+'%');}
    if(validVersion&&f.soulId===1867&&state.tiger1867){
      const tiger=state.tiger1867,arrival=tiger.capReached&&(state.qualified1867CapProbability??'arrival')==='arrival'?1:0;
      add('本次在场攻击增伤',tiger.layers*40+'% · 下场清除');
      add('本场焚烬概率',Math.min(100,50+10*((tiger.priorProbabilitySteps??0)+tiger.postCapUses+arrival))+'% · 下场重置');
    }
    if(validVersion&&f.soulId===1678){
      add('八方无人来朝资格',state.emperorFifthUsed?'本场已成功使用':'本场可成功使用 1 次');
      const turns=state.emperorFreezeRemaining??Math.max(0,(state.emperorFreezeEnd??0)-round+1);
      if(turns>0)add('永昌玺消耗冻结','余 '+turns+' 个在场回合 · 场下暂停');
    }
    if(validVersion&&f.soulId===2019&&state.kabuda2019){
      add('攻击后吸取比例',20+10*state.kabuda2019.count+'%');
      remaining('登场麻痹免疫',state.kabuda2019.entryEnd);
    }
    const mirrorAttack=f.effects?.['次元之镜攻击减伤'];
    if(mirrorAttack?.start<=round&&mirrorAttack.end>=round)add('次元之镜 · 指定攻击减伤',(moves[mirrorAttack.move]?.name??f.teamPPDefinitions?.[mirrorAttack.move]?.name??'指定技能')+' · 攻击伤害 -50% · 余 '+(mirrorAttack.end-round+1)+' 回合');
    if(state.divineJourney?.enabled){
      const journey=state.divineJourney;
      add('神途之熠',journey.layers+' / 7 层 · '+(f.type==='神灵'&&journey.layers>0?'神灵形态':'原系形态'));
      for(const [effect,skill,name] of [[2611,38633,'盛凌'],[2617,29506,'谳世还生'],[2618,29507,'诸魔挽章']])
        if(f.moves.includes('wiki:'+skill))add(name+' · 首次加层',journey.first?.[effect]?'本场已使用':'可用 1 次');
    }
    remaining('芳馨之祝',state.jasmineBlessing?.end);
    remaining('九劫之痕与百炼之炎（继承）',state.glaInheritedThrough);
    remaining('神耀击败先制 +3',state.divineWingPriorityRound===round?round:null);
    if(state.arslanGrowth>0)add('战神之魂本场攻击增伤',Math.round(state.arslanGrowth*100)+'%');
    if(f.soulId===1781&&state.thunderWings?.round===round){
      const w=state.thunderWings,enabled=[w.shield&&'护盾',w.boost&&'全属性提升',w.drop&&'对手全属性下降',w.fear&&'害怕'].filter(Boolean);
      if(enabled.length)add('千灭雷翼',enabled.join('、'));
    }
    if(f.soulId===4911&&state.knightIce2505)add('冰封额度','余 '+Math.max(0,state.knightIce2505.quota-state.knightIce2505.used)+' / '+state.knightIce2505.quota+' 次');
    if(state.charm1999)add('入魅','下次用招为摸摸');
    if(validVersion&&f.soulId===1860){const records=state.memory1860?.records??[];add('库比异常记录',records.length+' / 4 项'+(records.length?' · '+records.map(e=>e.name+' '+e.requestedDuration+' 回合').join('、'):'')+' · 下场清空，按记录时长交接给所选后继');}
    if(validVersion&&f.soulId===2040&&state.pharaohBleedDue2040>=round)add('图特预约流血','第'+state.pharaohBleedDue2040+'回合回初流血1回合 · 已于战阶末检查条件');
    if(validVersion&&f.soulId===1617){const n=state.swordEntryCount??0;add('剑灵登场圣剑快照',n+' 柄 · 攻击伤害 +'+n*10+'%'+(n>=2?'、受到攻击伤害 -'+(n-1)*10+'%':'')+(n>=3?'、先制 +1':'')+(n>=4?'、免疫异常':'')+' · 下场清除，返场重取');if(state.swordEntryEnd>=round&&state.swordEntryReduction>0)add('处决印记登场减伤',Math.round(state.swordEntryReduction*100)+'% · 余 '+(state.swordEntryEnd-round+1)+' 回合');}
    if(validVersion&&f.soulId===2120)add('下次登场睡眠',(state.doctor2120?.sleepDuration??3)+' 回合 · 消强且睡眠成功才递减，最低1 · 背包观察双方复活后重置3');
    if(validVersion&&f.soulId===1967&&state.wudao1967)add('武道本场在场计时',state.wudao1967.fieldRounds+' 回合 · 场下暂停，返场重开血之道 · 血道仅前10回抵挡');
    if(validVersion&&f.soulId===1999)add('本次登场衰减',Math.min(3,state.declines1999??0)+' / 3 次 · 基础攻击先制 +'+(3-(state.declines1999??0))+'、吸取 '+(50-10*(state.declines1999??0))+'% · 返场重置');
    if(state.saff2111Source)add('溯洄崩溃','直到下场，属性技能无效');
    const named=state.specialStates??{};
    if(named['失心迷阵'])add('失心迷阵','使用体力药剂会扣除体力');
    if(named.gaze1824?.sourceHash==='af241f96')add('窥目','已附加');
    if(named['炙光火种']?.sourceHash==='7d4fbbb')add('炙光火种','已附加');
    if(state.tideFocus1856?.sourceHash==='a7d6d9a0')add('浪潮聚焦',(state.tideFocus1856.sourceSide===0?'A 方':'B 方')+'鲸沫 · 下场保留 · 天敌或鲸沫攻击必暴，暴击后消失');
    const flowers=named['琼花仙荼']?.layers?.filter(layer=>layer.start<=round&&layer.end>=round)??[];
    if(flowers.length)add('琼花仙荼',flowers.map(layer=>'余 '+(layer.end-round+1)+' 回合').join('、'));
    for(const [key,name] of [['return','回命'],['lost','失命']])remaining(name,state.lifeMarks1831?.[key]?.end);
    if(validVersion&&f.soulId===2117&&state.dragon2117){const d=state.dragon2117;add('极龙初始转换','已消耗上限 '+d.initialConsumed+' · 本场记录 '+d.recordedMax+' · 异常槽累计 '+d.triggerCount+' 次');add('极龙临时体力上限','增加 '+d.temporaryGain+' / '+d.recordedMax+' · 下场清除，返场不重复初始转换');}
    if(state.dragonPanel2117?.maxHp)add('极龙登场面板改变','体力上限累计 +'+state.dragonPanel2117.maxHp+' · 下场保留');
    if(validVersion&&f.soulId===2090&&state.emperor4903){const d=state.emperor4903,n=Math.min(6,d.entries);add('帝录出战次数',d.entries+' 次 · 表内 '+n+' 项'+(n===6?'，不授登场效果':' · 依次授予前 '+n+' 项'));remaining('帝录技能限伤',d.capUntil);remaining('帝录攻击翻倍',d.attackUntil);remaining('帝录抵挡致命一击',d.criticalUntil);remaining('帝录回末吸取PP',d.ppUntil);}
    if(validVersion&&f.soulId===2147&&state.battle2147?.victory)add('胜之道','已开启 · 抵挡具有武道对手的攻击后衍化');
    if(state.curtainResistance2046)add('红幕抗性强化',state.curtainResistance2046.status+' +20个百分点 · 下场清除');
    if(state.lokiPunishmentLost)add('诡计神罚登场封招','本场已用');
    if(state.lokiFalseArc>0)add('虚饰弧光',state.lokiFalseArc+' 点');
    if(validVersion&&f.soulId===1888&&state.cloud1888)add('氤氲蛰影',state.cloud1888.layers+' / 3 层 · 本次在场已触发 '+state.cloud1888.total+' / 3 次 · 下场重置');
    if(state.cloudConfusion1888>0)add('下次登场混乱','令当时对手混乱 '+state.cloudConfusion1888+' 回合 · 登场后消费');
    if(state.guardianParalysisImmune2140)add('古亚尼斯继承免麻','本场免疫麻痹 · 下场重置');
    if(state.contract1914?.sourceHash==='386605d1')add('冥龙之契',(state.contract1914.ownerSide===0?'A 方':'B 方')+'龙琰 · 六项+70 · 攻击红伤无视护盾 · 下场保留');
    if(state.belialMaxHP1886>0)add('诅咒击败体力上限','+'+state.belialMaxHP1886+' · 本场生效 · 下场重置');
    if(validVersion&&f.soulId===1919&&state.void1919){const e=state.void1919;add('黑洞状态',(e.broken?'本场已转态 · 每回初上限减少10%':'免攻击技能 · 每回初上限增加1%')+' · 转态资格本场保留 · 上限变化下场重置');if(e.teamTotalMax!=null)add('黑洞转态门槛','回初全队上限 '+e.teamTotalMax+' ÷ 2 = '+e.teamTotalMax/2);}
    if(validVersion&&f.soulId===1908&&state.gigan1908){const e=state.gigan1908;add('体力效果交换',(e.flipped?'已交换':'未交换')+' · 下场清除交换');if(e.round===round){add('体力攻击增减伤',e.attackCount*10+'% · 本回合');add('用招附加固定伤害',e.fixedCount*30+' 点 · 本回合');}}
    if(validVersion&&f.soulId===1910&&state.kata1910){add('首次攻击双倍',state.kata1910.attackReady?'本次登场可用':'本次登场已用');add('首次属性瘫痪',state.kata1910.statusReady?'本次登场可用 · 70%':'本次登场已用');}
    if(validVersion&&f.soulId===1933&&state.cactus1933)add('本次在场回复加成','+'+Math.round(state.cactus1933.healingBonus*100)+'% · 上限100% · 下场清除');
    if(validVersion&&f.soulId===1987&&state.compute1987){const e=state.compute1987;add('算力',e.points+' 点 · 每回合满50点触发乱流');add('算力限制',e.limited?'生效 · 瞬杀、回神、顽强无效':'已解除 · 共振生效');if(e.hpBonus>0)add('共振临时上限','+'+e.hpBonus+' · 下场移除');}
    if(validVersion&&f.soulId===1809){
      const lost=Object.entries(state.collapsedSkills1809??{}).map(([key,entry])=>moves[key]?.name??moves['wiki:'+entry.wikiId]?.name).filter(Boolean);
      if(lost.length)add('崩溃招式',lost.join('、')+' · 本场不可再用 · 下场保留');
      if(state.collapsedCount1809>0)add('崩溃攻击增伤','+'+state.collapsedCount1809*40+'% · 本次在场 · 下场重置');
      if(state.saffControlImmune1809)add('崩溃免控','本次在场 · 下场重置');
      if(state.saffCollapsePriority1809>0)add('崩溃先制','+'+state.saffCollapsePriority1809+' · 本次在场 · 下场重置');
    }
    if(state.mark1948)add('狩杀之的','已标记');
    if(state.hunt1948)add('狩杀之魂',state.hunt1948.souls+' 层');
    if(validVersion&&f.soulId===1948&&state.kata1910){add('卡塔继承·首次攻击',state.kata1910.attackReady?'可用 · 红伤+100%':'已用');add('卡塔继承·首次属性',state.kata1910.statusReady?'可用 · 70%瘫痪':'已用');}
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedSingleSources?.some(p=>p.soulId===574))add('继承神耀前提',(state.energy??0)+' / 6 层 · 不附送神耀获取效果');
    if(validVersion&&f.soulId===1948&&state.inheritedWingPriorityRound>=round)remaining('继承神耀击败先制',state.inheritedWingPriorityRound);
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedZakKills519>0){add('继承魔王咤克斯成长',state.hunt1948.inheritedZakKills519+' 次 · 秒杀+'+state.hunt1948.inheritedZakKills519*2+'%');add('继承秒杀总概率',Math.min(100,state.hunt1948.inheritedZakKills519*2+(state.hunt1948.inheritedZakKills??0)*3)+'% · 合并一次判定');}
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedShivaKills>0)add('继承希瓦击败成长',`${state.hunt1948.inheritedShivaKills} 次 · 暴击率+${Math.min(100,state.hunt1948.inheritedShivaKills*10)}% · 闪避${Math.min(100,state.hunt1948.inheritedShivaKills*10)}%`);
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedOpheliaCounters)for(const [id,counter]of Object.entries(state.hunt1948.inheritedOpheliaCounters))add('继承奥菲利娅'+(id==='1940'?'强化':'')+'支援计数',counter.count+' / '+counter.cap+' · 不随在场回合减少');
    if(validVersion&&f.soulId===1948&&state.yongchang!=null)add('继承清玺资源','永昌玺 '+state.yongchang+' 方 · 敌方阵亡回末清零');
    if(validVersion&&f.soulId===1948&&state.emptyFifthWins1791>0){add('继承空元卪成长',state.emptyFifthWins1791+' 次 · 红伤与减伤各+'+state.emptyFifthWins1791*10+'%');const n=state.emptyFifthWins1791+(state.hunt1948?.inheritedZakKills??0);add('继承同类增减伤合计','红伤×'+(1+n*.1).toFixed(1)+' · 受红×'+Math.max(0,1-n*.1).toFixed(1));}
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedZakKills>0)add('继承咤克斯击败成长',`${state.hunt1948.inheritedZakKills} 次 · 红伤+${state.hunt1948.inheritedZakKills*10}% · 减伤${Math.min(100,state.hunt1948.inheritedZakKills*10)}% · 秒杀${Math.min(100,state.hunt1948.inheritedZakKills*3)}%`);
    if(validVersion&&f.soulId===1948&&state.hunt1948?.inheritedSingleSources?.length)add('登场继承记录',state.hunt1948.inheritedSingleSources.map(p=>({1892:'变异鳄兰：击败后六项面板提升10%',1733:'涡锋：击败异常目标后技能先制+1，本场下场保留',697:'无限自由：击败后恢复全部体力及PP',951:'厉魇魔王·咤克斯：每击败红伤及减伤+10%、秒杀概率+3%（整句1种）',1137:'希瓦：每击败暴击率及闪避率+10%，下场保留',1946:'幽蝶：击败后3回合能力提升无法被消除或吸取',886:'幽冥修罗：攻击击败后吸取下一位最大体力1/3',1157:'凌波清芙：攻击击败后吸取下一位最大体力1/3且50%睡眠',1561:'凌波清芙强化：攻击击败后吸取下一位最大体力1/3且睡眠',1315:'缥缈幽芙：攻击击败后下一位失神并随机清2槽PP',1562:'缥缈幽芙强化：攻击击败后下一位失神并随机清2槽PP',1645:'极光仙子：攻击击败后下一位首次属性技能无效',1727:'霍光：击败后三回合北冥狂刃，攻击必暴并附上次击败回合红伤总量真伤',1751:'莫塔里安：击败后重授300护罩并抵挡下次攻击',1912:'吉尼亚斯：击败麻痹目标后全部异常转移给下一位',1617:'圣律剑灵：击败有处决印记者全属性+1，否则下一位附1层处决印记',1886:'贝利亚：击败诅咒类目标后每种体力上限+50，下一位诅咒',1973:'湮灭之主·咤克斯：击败后六项能力+35、魔王咒怨+2',1204:'霍德尔原版：击败黑暗之种目标后下一位随机2槽PP归零',1834:'霍德尔觉醒：击败后按自身实际秽黯之根清下一位PP，不附送根',1805:'索杰德尔：击败目标下场时全部异常和能力下降转移给下一位',519:'魔王·咤克斯：每击败秒杀概率+2%，与951增量合成一次判定',574:'重生之翼：实际6层神耀时击败后归零、次回先制+3，不附送能量',1713:'天后·弗丽嘉：持有凯旋预言时下次击败回满体力及PP，不附送预言',1677:'冥契：击败回合末次回攻击先制+1，场下最低体力首位回复最大体力1/2',1910:'卡塔：击败后重授首次攻击增伤100%与首次属性70%瘫痪，不附送初始入场资源',1862:'无为觉者：击败后重置已有万相乖离并消逝敌方阵亡精灵，不附送进阶',1791:'空元卪：实际第五槽技能击败后降低自身20%上限，红伤与减伤各+10%',1547:'至序圣华：原圣剑重铸存在时，己方击败令自身复活并回满体力及PP，不附送重铸',1113:'战争猎魔：敌方阵亡后，下一位登场吸取最大体力1/3且己方全属性+1',1678:'始皇帝嬴政：敌方阵亡回末清空实际永昌玺，不附送玺或其他能力',1901:'奥菲利娅：自身存活场下时队友击败回30%体力，支援计数上限4',1940:'奥菲利娅强化：自身存活场下时队友击败回35%体力，支援计数上限5'})[p.soulId]).join('；'));
    const gu=state.soulGu?.length??0;
    if(gu>0)add('留魂之蛊',gu+' / 4 只 · 本回合尚可汲取 '+state.soulGu.filter(bug=>bug.usedRound!==round).length+' 次');
    for(const mark of Object.values(state.tieMarksBySource??{}))
      if(mark.count>0&&mark.expiresRound>=round)add('缔结印记',mark.count+' 层 · 余 '+(mark.expiresRound-round+1)+' 回合');
    for(const name of ['金','木','水','火土']){
      const mark=state.fiveMarks2125?.[name];
      if(mark?.sourceHash==='4c65a1e0'&&mark.start<=round)remaining(name+'印记',mark.end);
    }
    if([0,1].includes(f.statusState?.faithSourceSide))
      add('信仰对象',(f.statusState.faithSourceSide===f.side?'己方':'对方')+(f.statusState.faithSourceName??''));
    if(validVersion&&f.soulId===753&&state.pony753){
      add('轮回',state.pony753.reincarnationUsed?'本场已用':'可用 1 次');
      if(state.pony753.voidCharge)add('虚无','可抵挡下次技能伤害');
    }
    if(validVersion&&f.soulId===2084&&state.pope4898?.immunity)add('全队信仰教皇','本场免异常、能力下降、固定及百分比伤害');
    const scales=[['blue','蓝色龙鳞'],['gold','金色龙鳞'],['black','玄色龙鳞']].filter(([key])=>state.dragonScales?.[key]);
    if(scales.length)add('持有龙鳞',scales.map(([,name])=>name).join('、'));
    for(const [id,window] of Object.entries(state.clockCooldown??{})){
      const move=moves['wiki:'+id]??moves[id];
      if(move?.name&&window.end>=round)add(move.name+'冷却',(window.start>round?'下回合起 · ':'')+'余 '+(window.end-Math.max(round,window.start)+1)+' 回合');
    }
    if(validVersion&&f.soulId===2139&&state.executorArrayNextRound>round)
      add('执行者补充冷却',(state.executorArrayNextRound-round)+' 回合');
    if(validVersion&&f.soulId===1598&&Number.isInteger(state.longyanChoices)){
      const odd=state.longyanChoices%2===0;
      add('下次选择攻击技能',odd?'先制 −1，伤害提升 50%':'先制 +1，吸取对手最大体力的 1/3');
    }
    if(validVersion&&f.soulId===1727&&state.huoguangForm){
      const forms={strong:'强击形态',unbound:'无罔形态',break:'威破形态'};
      add('战斗形态',forms[state.huoguangForm]);
      if(state.huoguangFrenzyEnd>=round)remaining('北冥狂刃',state.huoguangFrenzyEnd);
      else add('武器','北冥之刃');
    }
    if(validVersion&&f.soulId===2059){
      const lotus=state.lotus2059;
      const forms={mesh:'百天浮世络',pale:'怀生菩怜态',wrath:'拒赦怒威态'};
      if(forms[lotus?.form]){
        if(lotus.form==='mesh'){
          remaining(forms.mesh,lotus.meshEnd);
          add('期间累计受伤',lotus.receivedSettled+' 点');
        }else add('当前形态',forms[lotus.form]);
      }
    }
    if(validVersion&&f.soulId===2128&&state.shura2128){
      const st=state.shura2128;
      add('气势',({positive:'正气',evil:'邪气'})[st.form]??'未激活');
      add('法之意念',st.thought+' 点');
      if(st.extra>0)add('下次攻击附加固定伤害',st.extra+' 点');
    }
    if(validVersion){
      if(f.soulId===1647){
        add('首次攻击命中资格',state.corsasAttackTriggered?'本次在场已触发 · 体力恢复减少 90%':'可用 1 次，上场重置');
        add('首次属性命中反击',state.corsasStatusTriggered?'本次在场已使用':'可用 1 次，上场重置');
        if(state.corsasPowerDodge>0)add('低威力攻击闪避','余 '+state.corsasPowerDodge+' 次 · 威力低于 90，必中除外');
        if(state.corsasStatusRound===round)add('属性技能先制','本回合 +1');
        if(state.corsasDamageRound===round&&state.corsasDamageBonus>0)add('攻击伤害提升','本回合 +'+state.corsasDamageBonus+'%');
      }
      if([1559,1851].includes(f.soulId)&&state.laberEntry?.blocked?.length&&round<state.laberEntry.round+2){
        const entry=state.laberEntry,names=entry.blocked.map(key=>moves[key]?.name).filter(Boolean);
        add('入场附效封锁','原入场对手 '+entry.blocked.length+' 招 · 余 '+(entry.round+2-round)+' 回合'+(names.length?' · '+names.join('、'):''));
      }
      if(f.soulId===1845){
        const constructs=state.constructions1845??[];
        add('德莱赫默',constructs.length>=2?'激发状态':'守备状态');
        add('构造',constructs.length+' / 4 种'+(constructs.length?' · '+constructs.map(n=>['','I','II','III','IV'][n]).join('、'):''));
      }
      if(f.soulId===2044){
        add('首次致死保命',state.phalanx2044?.survivalUsed?'本场已使用':'可用 1 次');
        const hits=state.phalanx2044?.hits??0;
        add('本次在场攻击命中',hits+' 次 · 下次附伤按'+(hits%2?'特防':'防御')+'值的 50%');
      }
      if(f.soulId===1738){
        add('法天象地·圣',state.wukongSaintSpent?'本场已使用':'可用 1 次');
        if(state.wukongSaintEnd>=round)add('法天象地·圣强化','免异常、先制 +1、攻击必暴 · 余 '+(state.wukongSaintEnd-round+1)+' 回合');
      }
      if(f.soulId===1879&&state.astrolabe1879){
        const star=state.astrolabe1879;
        add('星盘',star.ticks+' / 12 刻 · '+(star.rewinding?'回返':'前进'));
        if(star.shieldRound===round)add('星盘减伤','本回合攻击、固定、百分比伤害减少 99%');
        if(star.enlightenAt>=round)add('再次星启','第 '+star.enlightenAt+' 回合结束后');
      }
      if(f.soulId===638){
        add('灵神重生',state.holyReborn?'本场已使用':'可用 1 次');
        if(f.soulHash==='53bf6afd'&&f.lastIncomingSettledAttackDamage>0)add('魂印攻击附伤',f.lastIncomingSettledAttackDamage/2+' 点固定伤害');
        const boost=f.effects?.['灵神重生威力'];
        if(boost?.end>=round)add('灵神重生 · 技能威力翻倍',boost.start>round?'下回合起，持续 '+(boost.end-boost.start+1)+' 回合':'余 '+(boost.end-round+1)+' 回合');
      }
      if(f.soulId===1916&&state.entryRecord1916){
        add('回溯记录',state.entryRecord1916.hp+' HP');
        add('致死回溯',state.rewindUsed1916?'已使用':'可用 1 次');
      }
      if(f.soulId===708&&state.marsForm){
        const forms={speed:'极速',destruction:'毁灭'};
        if(forms[state.marsForm])add('当前形态',forms[state.marsForm]);
        if(forms[state.marsNextForm])add('下回合形态',forms[state.marsNextForm]);
      }
      if(f.soulId===1764&&['holy','evil'].includes(state.oracleForm1764)){
        add('当前形态',state.oracleForm1764==='holy'?'圣谕':'邪魇');
        for(const [key,label] of [['holy','圣告'],['evil','邪诲']]){
          const marks=state.oracleMarks1764?.[key];
          if(Array.isArray(marks))add(label,marks.length+' / 3 层');
        }
      }
      if(f.soulId===1816&&typeof state.mountainGraceLost==='boolean')
        add('下次登场',state.mountainGraceLost?'获得 300 护盾':'山祇恩怜');
      if(f.soulId===1829&&state.fateProtection1829)add('命运庇护','生效');
      if(f.soulId===2099&&state.moth2099?.capZero)add('渐烬上限','归零');
      if(f.soulId===2099&&state.moth2099)add('渐烬触发',state.moth2099.timingFree?'本次在场每次使用攻击技能':state.moth2099.ownFirst?'本次在场首次攻击已使用':'本次在场首次攻击待触发');
      if(f.soulId===2149){
        const g=state.group2149;
        if(g?.starGift)add('星皇之赐','生效');
        if(g?.starBlessing?.remaining>0)add('星皇之佑',g.starBlessing.remaining+' 回合');
      }
    }
    if(state.tao2149?.sourceHash==='d97331c9')add('讨','已附加');
    if(state.lianzhu2149)add('连诛','已附加');
    if(state.teamFirstCrit1275>0)add('守御八方 · 必先','第3档 · 余 '+state.teamFirstCrit1275+' 次技能 · 伪必中');
    const attackCrit1275=state.teamFirstCritAttack1275??state.teamFirstCrit1275;
    if(attackCrit1275>0)add('守御八方 · 攻击必暴','余 '+attackCrit1275+' 次攻击');
    for(const source of E.FIRST_ORDER.candidates(f,null,round,[],true).filter(p=>![1275,574].includes(p.id))){
      const duration=source.remaining!==undefined?'余 '+source.remaining+' 次':source.end!==undefined?'余 '+(source.end-round+1)+' 回合':'';
      const hit=source.hit==='true'?' · 真必中':source.hit==='pseudo'?' · 伪必中':'';
      active('必先 · '+source.label,(source.rank?'第'+source.rank+'档':'档位待核对')+' · '+(source.scope==='attack'?'攻击技能':'所有技能')+' · '+duration+hit);
    }
    for(const key of ['所有技能必定先手','攻击必定先手'])for(const source of f.effects?.[key]?.firstOrderSources??[])if(source.start>round&&source.end>=round)
      add('待生效必先 · '+source.label,'第'+source.rank+'档 · 第'+source.start+'回合起 · '+(source.end-source.start+1)+'回合');
    if(!state.source12194695&&state.emperorConvertRound>=round)
      add('华光洗礼伤害转回复',state.emperorConvertRound===round?'本回合受到伤害转为体力回复':'下回合受到伤害转为体力回复');
    if(state.ji574NextSkill)add('下次技能','第4档必先 · 真必中');
    if(state.ji574NextLandedCrit)add('下次命中的攻击','必定暴击');
    if(f.hp>0&&Number(f.number)===3221){const move=Object.values(moves??{}).find(m=>m.wikiId===16602&&m.revision==='seerapi:9e93d082'),op=move?.operations?.find(o=>o.effectId===181&&o.index===0);if(JSON.stringify(op?.sourceArgs)==='[20,6,10,50]'){const previous=moves?.[f.previousMoveId],count=previous?.wikiId===16602?(state.hitConsecutiveUses??0):0;add('霸天斩 · 连用害怕','已连用 '+count+' 次 · 下次连续使用基础'+Math.min(70,20+Math.min(50,count*10))+'% · 最高70%');}}
    const previous3013=moves?.[f.previousMoveId];
    if(f.hp>0&&Number(f.number)===3013&&previous3013?.wikiId===19195&&previous3013.revision==='seerapi:d55fa861'&&(state.hitConsecutiveUses??0)>0){
      const op=previous3013.operations?.find(op=>op.effectId===429&&op.index===1);
      if(Array.isArray(op?.params)&&JSON.stringify(op.params)==='[100,50,250]')add('极空幻天斩连用附伤','已连用 '+state.hitConsecutiveUses+' 次 · 下次连续使用 '+Math.min(250,100+state.hitConsecutiveUses*50)+' 点固定伤害');
    }
    if(state.miracleCharges1182>0)add('奇迹之力','余 '+state.miracleCharges1182+' 次命中攻击');
    const previous3017=moves?.[f.previousMoveId];
    if(f.hp>0&&Number(f.number)===3017&&previous3017?.wikiId===19207&&previous3017.revision==='seerapi:7a63d594'&&(state.hitConsecutiveUses??0)>0){
      const op=previous3017.operations?.find(op=>op.effectId===9&&op.index===0);
      if(Array.isArray(op?.params)&&JSON.stringify(op.params)==='[30,240]')add('肉身离心吼连用威力','已连用 '+state.hitConsecutiveUses+' 次 · 下次连续使用威力 '+Math.min(240,150+state.hitConsecutiveUses*30));
    }
    const sacrificeBuff=f.effects?.['九死增伤与先制'];if(sacrificeBuff?.end>=round)add('接替者增益','攻击伤害 +'+Math.round(sacrificeBuff.bonus*100)+'% · 先制 +'+sacrificeBuff.priority+' · 余 '+(sacrificeBuff.end-round+1)+' 回合');
    if(state.kronEntryImmuneRound===round)add('克罗诺斯登场加护','本回合免疫异常');
    if(state.townLastProtection)add('镇世守护','本次在场固定、百分比伤害减少 25% · 下场清除');
    if(state.darkSeed)add('黑暗之种',(state.darkSeed.phase==='mature'?'已成熟':'成长 '+state.darkSeed.level+' / 5 级')+' · 来源 '+(state.darkSeed.sourceSide===0?'A 方':'B 方'));
    if(state.forest)add('苍茫树海','生命力 '+state.forest.life+' · 每次触发 '+Math.floor(state.forest.life/210)+' 次');
    if(state.repeatExecutionRound>=round)add('再次处决',state.repeatExecutionRound===round?'本回合开始时重新选择场下最高体力目标':'下回合开始时重新选择场下最高体力目标');
    if(f.soulId===1597&&validVersion)add('本次在场首次技能',state.foxFirstSkillDone?'已触发睡眠判定':'睡眠判定待触发');
    if(state.royalScaleContract){add('首次三色龙鳞','本场已获得 · 返场不重授');add('第五技能',state.royalScaleContract.unlocked?'已解封':'尚未解封');}
    if(state.darkCause?.level>=5)add('晦暗之因成熟','回复效果 -25%');
    if([832,2005].includes(f.soulId)&&validVersion&&state.jolieReduceCharges>0)add('受击减伤',state.jolieReduceCharges+' 次 · 对手用攻时当回合'+(f.soulId===832?'攻击伤害':'非真实伤害')+' -50%');
    if(state.kronRedCap>0)add('下次普通攻击伤害上限',state.kronRedCap+' 点');
    if(state.hunterAttackBlockRound===round)add('天弓啸月','本回合威力低于 '+state.hunterAttackBlockPower+' 的攻击无效');
    if(state.emperorAidRound849===round)add('帝君之援','本回合技能先制 +1');
    if(state.emperorFullEntry849)add('下次帝君之罚、帝君之赐','按最大体力的 1/3 生效');
    if(state.bedEntryPp?.round===round)add('本回合用招 PP 消耗',state.bedEntryPp.multiple+' 倍');
    if(state.laberSwitchCrit>0)add('异维下次攻击必暴','余 '+state.laberSwitchCrit+' 次');
    for(const [key,label] of [['moiraiHeng','命运之轮·恒'],['moiraiJie','命运之轮·界']]){
      const turn=state[key];if(turn?.round>=round-1)add(label,(turn.branch===3?'两种效果全部触发':'第 '+turn.branch+' 种效果')+' · 第 '+turn.round+' 回合');
    }
    if(state.yuliFirstSkillBonus>0)add('群芳加护 · 首次技能附伤',state.yuliFirstSkillBonus+' 点百分比伤害');
    if(state.nextAttack873)add('下次攻击','必定先手、必中、伤害翻倍');
    const companions=[];
    if(validVersion&&f.soulId===1061&&Number.isFinite(state.xin?.maxHp))
      companions.push({name:'辛',role:state.xinFusion?'已融合':'召唤物',hp:state.xin.hp,maxHp:state.xin.maxHp});
    return {group:group(f),companions,items};
  }

  const queuedLabels={67:'登场百分比伤害',883:'累计登场百分比伤害',892:'登场百分比伤害',840:'被在场对手吸取体力',
    1779:'被在场对手吸取体力',1654:'首次用招附效失效',2017:'首回合先制失效',934:'登场先制降低',
    910:'属性技能失效',1090:'攻击与附效失效',1128:'下次攻击无效',1827:'下次属性技能无效',1702:'登场回复',
    2551:'神圣之霆封锁属性命中效果',1830:'圣剑解放附加随机异常',1882:'抵挡攻击并附加自身异常',1937:'登场护盾',1911:'登场护罩',2148:'异常免疫',1319:'登场强化',
    574:'下次技能先手必中、下次命中攻击暴击',601:'登场能力下降',757:'登场异常',873:'下次攻击先手必中、伤害翻倍',
    904:'全队免异常',1059:'攻击增伤与先制',1182:'奇迹之力',1275:'出手必先、攻击必暴',1331:'登场异常',
    1510:'随机异常',1600:'登场异常',1663:'随机技能 PP 归零',59:'防御和特攻提升',1493:'接替者免疫异常',1374:'冰之祝福',2159:'逝者亡语吸取、队伍下次攻击无效',2326:'接替者入魅',2379:'接替者全伤害抗性提升',2405:'混乱、束缚',2411:'登场异常',185:'接替者臣服',1456:'接替者免疫攻击伤害',2213:'接替者获得盾罩',2403:'离场异常传递',2432:'接替者恢复 PP',2194:'致命裂痕',1979:'接替者恢复',1212:'接替者攻击增伤、对手下次攻击无效',933:'队伍下次攻击必暴',2279:'狩杀之的',1872:'低威力攻击无效',2012:'攻击技能无效',2013:'属性技能无效',
    2027:'全部技能扣 PP',2040:'登场异常',698:'登场异常',2162:'登场异常',2426:'宁界之律封锁预告',2481:'九劫之痕与百炼之炎'};
  function inheritedSoulLabel(g){
    switch(g.soulId){
      case 393:return '继承夺取的能力等级';
      case 647:return '500 护盾、免异常 1 次';
      case 758:return '首回合免异常，下次普通攻击伤害上限 250';
      case 821:return '两回合内受到的攻击和固定伤害减半';
      case 877:return '全属性 +1、免异常 1 次';
      case 886:return '被对方在场精灵吸取最大体力的 1/3';
      case 909:return '500 护盾、500 护罩、免异常 1 次';
      case 1113:return '被吸取最大体力的 1/3，对方在场精灵全属性 +1';
      case 1204:case 1834:return '霍德尔 · 随机 '+g.count+' 招 PP 归零';
      case 1157:case 1561:return g.ward?'神圣之荷 · 400 护盾和护罩':'被吸取最大体力的 1/3 并可能睡眠';
      case 1315:case 1562:return g.kind==='lotus-on-knockout'?'失神、随机两招 PP 归零':'前 '+(g.soulId===1315?1:2)+' 次攻击先制 +1、伤害翻倍';
      case 1825:return '芳馨之祝 · 500 护盾、护罩和体力上限';
      case 1588:case 2080:return '群芳加护 · 首次技能附伤 '+g.amount+' 点';
      case 1603:return '全属性 +1';
      case 1645:return '极光仙子 · 首次属性技能无效';
      case 1664:return g.kind==='status'?'星别 · 恢复全部 PP':'星别 · 回复全部体力';
      case 1570:return '继承卡托娜的能力提升';
      case 1916:return '免疫攻击伤害，免疫成功使对手瘫痪';
      case 2141:return '阿克希亚 · 冰呪 '+g.turns+' 回合，攻击必暴并无视20%减伤';
      case 2093:return '继承九劫之痕与百炼之炎';
    }
  }
  function team(game,side){
    const battle=game.battle,round=battle.round,items=[];
    const royalSources=game.slots.flatMap((slots,ownerSide)=>slots.filter(slot=>slot.fighter.soulId===1724&&!slot.fighter.soulState.vanished).map(slot=>(ownerSide===0?'A 方':'B 方')+' '+slot.fighter.name));
    const add=(name,value)=>items.push({name,value:String(value)});
    const victory=E.victoryPopulation50(battle,side);
    add('50回合存活计数',victory.total+' 只 · 实际存活 '+victory.real+' 只'+(victory.golden?' · 黄金万象视为存活 '+victory.golden+' 只':''));
    const f=battle.fighters[side];
    if(E.vesselSupport2162(battle,f,battle.fighters[1-side],'weakness'))add('神魂场下支援','能力下降无视对手免弱');
    for(const [record,name,label]of [['fixed','神魂固定支援','固定伤害'],['percent','神魂百分比支援','百分比伤害'],['ailment','神魂异常支援','异常状态']])if(E.vesselSupport2162(battle,f,battle.fighters[1-side],record))add(name,label+'无视对手对应免疫与抗性');
    if(battle.teamVessel2162?.[side]){const field=battle.teamVessel2162[side],st=field.state,names={ailment:'异常状态',weakness:'能力下降',percent:'百分比伤害',fixed:'固定伤害'};add('神魂之器',st.records.length?st.records.map(k=>names[k]).join('、'):'记录已耗尽');add('神魂已移除记录',st.removed+' 项 · 换人保留');}
    if(battle.curtains2046?.sides[side]!=null){const names={1:'白幕',2:'红幕',3:'蓝幕',4:'黄幕',5:'黑幕'},color=battle.curtains2046.sides[side];add('涂蝶队伍幕',names[color]+' · 本场出现 '+battle.curtains2046.history[side].map(x=>names[x]).join('、')+' · 各精灵登场结算幕附效');}
    if(battle.teamMoth2099?.[side]){const field=battle.teamMoth2099[side],st=field.state,present=f.soulId===2099&&f.teamPosition===field.sourcePosition&&f.hp>0&&!f.soulState.vanished;if(st.sea>0)add('队伍天烬海',st.sea+' 层 · 双方烧伤冻结，被击败后消逝 · '+(present?'灰蛾在场，不减层':'灰蛾不在场，回末减1层'));if(f.soulId===2099){const dead=E.teamPopulation(battle,0).dead+E.teamPopulation(battle,1).dead;add('渐烬队伍上限',st.capZero?'本场已归零':(5+5*dead)+' 层 · 双方阵亡 '+dead+' 只 · 下场渐烬清零');}}
    if(battle.teamGates2075?.[side]){const field=battle.teamGates2075[side],names=['天之门','地之门','神之门'];add('队伍神域之门',field.gates.length?[0,1,2].filter(n=>field.gates.includes(n)).map(n=>names[n]).join('、'):'均未开启');if(field.gates.length)add('神域之门用途','对应予天/予地/予神技能选择使用不受PP限制 · 固粉伤被对手免疫时，天回场下1PP、地回场下等量HP、神伤敌场下等量真伤');}
    if(game.slots[side].some(slot=>slot.fighter.soulId===2125&&E.SOULS.acceptsSource(2125,slot.fighter.soulHash)&&!slot.fighter.soulState.vanished))add('五行背包观察','帝皇铠甲位于背包 · 清PP授金、敌低概率异常授木、敌场下指定授水、己方免减至零授火土 · 阵亡仍有效');
    const star= battle.teamStar1844?.[side];if(star?.active)add('队伍星执','唯一最高抗性记录 '+(star.record??'无')+' · 对应异常进入后转3回星赐');if(star?.bearer?.energy>0)add('队伍星执者',star.bearer.energy+' 点能量 · 全异常进入后转3回星赐 · 用技能后真伤、回末回复各消耗15%，至少150 · 不足150仍按150结算');
    if(battle.teamBuwu2147?.[side]?.points>0)add('队伍不武',battle.teamBuwu2147[side].points+' / 4 分 · 换人保留 · 额外视为武道');
    const battleSupport=game.slots[side].filter((slot,index)=>index!==game.active[side]&&slot.fighter.soulId===2147&&E.SOULS.acceptsSource(2147,slot.fighter.soulHash)&&slot.fighter.hp>0&&!slot.fighter.soulState.vanished);
    if(battleSupport.length)add('战魂场下支援','敌触发不高于10%抗性、执行不高于10%通用特性时，敌队伍不武 +1');
    if(f.hp>0&&f.soulId===2059&&f.soulState.lotus2059?.form==='pale'){const n=game.slots[side].filter((slot,index)=>index!==game.active[side]&&slot.fighter.hp>0).length;add('怀生场下回复','用技能后随机弱化未触发，各回99 · 场下存活 '+n+' 名');}
    if(f.hp>0&&f.soulId===2118){const n=game.slots[side].filter((slot,index)=>index!==game.active[side]&&slot.fighter.hp>0).length;add('墟婆场下回复','场下存活 '+n+' 名 · 战阶消耗当前体力20%，各回复实耗量 · 扣后低于半体则自身回满');}
    if(f.hp>0&&f.soulId===2043){const n=E.teamPopulation(battle,side).live;add('背包存活贡献',n+' 只 · 攻击减伤 '+Math.min(100,n*5)+'% · 属性命中吸取 '+n*50+' 点');if(game.slots[side].some(slot=>Number(slot.fighter.number)===4850&&!slot.fighter.soulState.vanished))add('图特搭配护盾','图特摩斯位于背包 · 敌中毒时回初刷新300护盾');}
    const heroSources=game.slots.flatMap((slots,ownerSide)=>slots.filter(slot=>slot.fighter.soulId===2009&&!slot.fighter.soulState.vanished).map(slot=>(ownerSide===0?'A 方':'B 方')+' '+slot.fighter.name));
    if(heroSources.length)add('无极圣武背包效果',heroSources.join('、')+' · 双方登场砥砺 1 回合；成功亮节 3 回合，失败威怯 3 回合');
    const hasLiveLink=game.slots[side].some(slot=>slot.fighter.hp>0&&!slot.fighter.soulState.vanished&&slot.fighter.soulState.futureLink>0);
    if(f.soulId===1713&&f.hp>0&&f.hp<f.stats.maxHp/2){const n=game.slots[side].filter((slot,index)=>index!==game.active[side]&&slot.fighter.hp>0&&!slot.fighter.soulState.vanished).length;add('弗丽嘉低体交换',n?'与最高现体的首位存活替补交换 · 自身各技能PP+1':'无存活替补，不交换 · 自身各技能PP仍+1');}
    if(f.soulId===2050&&f.hp>0){const total=game.slots[1-side].filter(slot=>slot.fighter.hp<=0&&!slot.fighter.soulState.vanished).reduce((n,slot)=>n+slot.fighter.stats.maxHp,0);add('时空乱流门槛','敌方阵亡体力上限合计 '+total+' · 本次攻击伤害须大于 '+total*.6+'，消逝全部敌尸体');}
    if(f.soulId===2084&&f.hp>0){const roster=game.slots[1-side].map(slot=>slot.fighter).filter(member=>!member.soulState.vanished),n=roster.filter(member=>member.statusState?.faithSourceSide===side&&(member.statusState.faithSourceNumber==null||String(member.statusState.faithSourceNumber)===String(f.number))).length;add('教皇信仰贡献','归信 '+n+' / '+roster.length+' · 攻击伤害 +'+n*20+'% · 受到攻击伤害 -'+n*10+'% · 全员归信回初获得本场免疫');}
    if(game.phase==='replace'&&f.hp<=0&&f.soulId===2141&&f.soulState.iceInheritance2141?.eligible&&f.soulState.iceInheritance2141.reason==='actual-death')add('下只登场冰呪','阿克希亚 · 冰呪 3 回合，攻击必暴并无视20%减伤 · 仅选定后继');
    const flowersFrom=ownerSide=>game.slots[ownerSide].filter(slot=>slot.fighter.hp>0&&!slot.fighter.soulState.vanished&&slot.fighter.soulId===1954);
    if(flowersFrom(side).length)add('琼花中毒替换光环',flowersFrom(side).map(slot=>slot.fighter.name).join('、')+' · 存活背包生效 · 对手中毒改为琼花仙荼效果');
    if(f.hp>0&&f.ailments['中毒']>=round&&flowersFrom(1-side).length)add('中毒效果替换',flowersFrom(1-side).map(slot=>slot.fighter.name).join('、')+' · 对方行动时受自身上限1/6真伤 · HP药反转');
    const infernoSources=game.slots[side].filter(slot=>slot.fighter.hp>0&&!slot.fighter.soulState.vanished&&slot.fighter.soulId===2062);
    if(infernoSources.length)add('永烬烧伤光环',infernoSources.map(slot=>slot.fighter.name).join('、')+' · 存活背包生效 · 对手免弱期间视为烧伤');
    const cyberSources=game.slots[side].filter(slot=>slot.fighter.soulId===2008);
    if(cyberSources.length)add('赛博共振器',cyberSources.map(slot=>slot.fighter.name+' · '+(slot.fighter.hp>0&&slot.fighter.soulState.cyber2008?.open?'开启':'关闭')).join('、')+' · 伊芙下场关闭，返场开启');
    for(const grant of battle.teamEntryGrants?.[side]??[])if(grant.soulId===1948&&grant.kind==='inherited-attack-ko')add('继承击败·下次登场',grant.grants.map(g=>({886:'幽冥修罗：吸取最大体力1/3',1157:'凌波清芙：吸取最大体力1/3、50%睡眠',1561:'凌波清芙强化：吸取最大体力1/3、睡眠',1315:'缥缈幽芙：失神、随机清2槽PP',1562:'缥缈幽芙强化：失神、随机清2槽PP',1645:'极光仙子：首次属性技能无效'})[g.soulId]).join('；')+' · 指定后继登场消费');
    for(const grant of battle.teamEntryGrants?.[side]??[])if(grant.soulId===1886)add('下只登场诅咒',(grant.sourceSide===0?'A 方':'B 方')+'贝利亚奥特曼 · 选定后继登场施加一次');
    for(const grant of battle.teamEntryGrants?.[side]??[])if(grant.soulId===1912)add('下只登场异常转移',(grant.sourceSide===0?'A 方':'B 方')+'吉尼亚斯 · '+grant.ailments.map(e=>e.name+' '+e.duration+' 回合').join('、')+' · 登场消费');
    if(hasLiveLink){
      add('未来链接用途','计入未来奇点、未来指令层数 · 不用于免异或取消崩溃');
      const sources=game.slots[side].filter(slot=>slot.fighter.soulId===1806&&slot.fighter.hp>0&&!slot.fighter.soulState.vanished);
      if(sources.length)add('未来链接守护',sources.map(slot=>slot.fighter.name).join('、')+' · 己方链接者取最低受克制系数 · 对应精灵消耗 1 级');
    }
    if(f.soulState.chiyong1878?.layers>0&&f.soulState.chiyong1878.sourceHash==='41007a05'){
      const lock=f.soulState.chiyong1878,owner=battle.fighters[lock.sourceSide],present=Number(owner?.number)===4676&&owner.hp>0;
      add('蚩庸之锁来源',(lock.sourceSide===0?'A 方':'B 方')+' 米斯蒂克 · '+(present?'在场 · 命中等级 -'+lock.layers:'不在场 · 每回合减 1 层 · 属性技能无效、攻击不能附异常'));
    }
    if(f.soulId===1714&&E.SOULS.acceptsSource(f.soulId,f.soulHash)&&f.hp>0){
      const own=E.teamPopulation(battle,side),enemy=E.teamPopulation(battle,1-side),foe=battle.fighters[1-side];
      const rec=f.soulState.healthStates?.['回体Ⅰ'],lost=foe.soulState.healthStates?.['失体Ⅰ'];
      if(rec?.start<=round&&rec.end>=round)add('回体Ⅰ · 攻击增伤','+'+own.dead*20+'% · 己方场下阵亡 '+own.dead+' 只');
      if(lost?.start<=round&&lost.end>=round)add('失体Ⅰ · 固定、百分比增伤','+'+enemy.dead*20+'% · 对方场下阵亡 '+enemy.dead+' 只');
    }
    if(f.soulId===1406&&E.SOULS.acceptsSource(f.soulId,f.soulHash)&&f.hp>0){
      const population=E.teamPopulation(battle,side);
      add('堕魂攻击增伤','+'+(25+population.dead*10)+'% · 阵亡 '+population.dead+' 只');
      if(population.live===1&&population.dead>0)add('背包全阵亡附伤','攻击命中后 '+Math.floor(f.stats.maxHp/4)+' 点真实伤害');
    }
    for(const moon of battle.celestials??[]){
      if(!E.CELESTIAL_RULES.names.includes(moon.name)||moon.end<round||moon.side!=null&&moon.side!==side)continue;
      const duration=moon.end===Number.MAX_SAFE_INTEGER?'本场持续':'余 '+(moon.end-round+1)+' 回合';
      const state=moon.suspendedUntil>=round?'暂停，余 '+(moon.suspendedUntil-round+1)+' 回合':moon.side==null?'中立，等待归属':'己方持有';
      add(moon.name,state+' · '+duration+(moon.transferLocked?' · 转移已锁定':''));
    }
    const starProvider=game.slots[side].find((slot,index)=>index!==game.active[side]&&slot.fighter.soulId===622&&!slot.fighter.soulState.vanished)?.fighter;
    if(f.soulState.teamStar622&&f.soulId!==2149&&(starProvider||battle.extraStar2584?.[side])){
      const locked=(!battle.extraStar2584?.[side]&&!E.benchCanTarget(battle,starProvider,f))||battle.fighters.some(member=>member.hp>0&&member.soulId===2149&&member.soulState.group2149?.reserve);
      add('星皇之赐',locked?'当前目标受限':'出手后回复最大体力的 1/8');
      if(f.soulState.teamStar622.lead&&round<=3)add('星皇之佑',locked?'当前目标受限':'余 '+(4-round)+' 回合');
    }
    for(const record of f.soulState.ailmentImmuneSources??[])if(record.kind==='plot2153'&&record.count>0)add('起 · 全队免异常','余 '+record.count+' 次');else if(record.kind==='1805'&&record.count>0)add('命起魂落相等 · 全队免异常','余 '+record.count+' 次');else if(record.kind==='team904'&&record.count>0)add((record.key.includes(':37854:')?'飞尘击':record.key.includes(':38366:')?'最终杰作':'堕之绝响')+' · 全队免异常','余 '+record.count+' 次');
    const lokiGuard=battle.teamLokiGuard?.[side];if(lokiGuard?.round>=round)add('神诗叙诡护佑',lokiGuard.round===round?'本回合免疫对手攻击':'下回合免疫对手攻击');
    if(f.soulId===849&&f.soulHash==='29f34d63'&&f.hp>0){
      const reserves=i=>game.slots[i].filter((slot,index)=>index!==game.active[i]&&!slot.fighter.soulState.vanished);
      const allies=reserves(side),fallen=allies.filter(slot=>slot.fighter.hp<=0).length;
      const livingFoes=reserves(1-side).filter(slot=>slot.fighter.hp>0).length+Number(battle.extraStar2584?.[1-side]?.alive===true);
      if(fallen)add('帝君之阵','阵亡队友 '+fallen+' 只 · 增伤、减伤各 '+fallen*10+'%');
      if(livingFoes)add('帝君之阵回复','对方场下存活 '+livingFoes+' 只 · 用招回复上限 '+livingFoes*10+'%');
      if(fallen===allies.length&&!battle.extraStar2584?.[side]?.alive)add('帝君之威','自身回合效果受保护');
      if(!livingFoes)add('帝君之威','对手自身技能禁疗');
    }
    if(f.soulState.heroOath2009)add('英雄之诫','能力值 +65 · 下场保留');
    if(f.soulState.wuzhu2009End>=round)add('武诛','余 '+(f.soulState.wuzhu2009End-round+1)+' 回合');
    const released=battle.teamWeiyue1723?.[side];
    if(released?.end>=round)add('卫岳解放',[released.shield?'攻击伤害 +100%':'',released.barrier?'固定、百分比伤害 +50%':'',released.shield&&released.barrier?'对方全队禁疗':'','余 '+(released.end-round+1)+' 回合'].filter(Boolean).join(' · '));
    if(f.soulId===1982){const st=f.soulState.ming1982;if(st)add('铭唤当前积累','汲取 '+st.drainPercent+'% · 攻击技能威力 +'+st.power+' · 下场重置');}
    for(const holder of [f,...(battle.teamBench?.[side]??[])])if(holder.soulState.chiyu1982&&!holder.soulState.vanished)add('痴愚 · '+holder.name,(holder===f?'在场，回末解除概率 '+(5*(battle.teamDream1972?.[side]?.crisis??1))+'%':'场下保留，解除判定暂停')+' · 累计危机 '+(holder.soulState.crisisGained1982??0));
    for(const owner of [f,...(battle.teamBench?.[side]??[])])if([1901,1940].includes(owner.soulId)&&owner.hp>0&&!owner.soulState.vanished){const st=owner.soulState.ophelia4706??{stars:0,cap:owner.soulId===1940?5:4};add('命运晨星 · '+owner.name,st.stars+' / '+st.cap+' · '+(owner===f?'在场回末减1':'场下保留')+' · 首次秒杀免疫'+(st.firstExecutionUsed?'已用':'可用')+(st.soleActive?' · 本次在场自援已激活':st.soleUsed?' · 自援次数已用':''));}
    {const owner=[f,...(battle.teamBench?.[side]??[])].find(x=>x.soulId===1930&&x.hp>0&&!x.soulState.vanished);if(owner){add('队伍神羽',(owner.soulState.feathers1930??7)+' / 7 · '+owner.name+' · 其他在场队友低半且低于本人时消耗1片，体力增加至本人并受上限约束');if(f===owner){const weight=E.SOULS.registry[1930].abilities.weight([f,...(battle.teamBench?.[side]??[])],f);add('存活队友增益',Math.round(weight*100)+'% · 红伤增加、红伤减少、完整红伤吸血');}}}
    {const replacement=E.teamSwitchReplacement(battle);if(replacement)add('主动更换视为驱逐',replacement.city?'蜃都之源 · 双方仍指定存活替补，仍受主动换人限制，按驱逐离场处理':replacement.name+' 存活于背包 · 双方仍指定存活替补，仍受主动换人限制，按驱逐离场处理');}
    for(const owner of [f,...(battle.teamBench?.[side]??[])])if(owner.soulId===2038&&!owner.soulState.vanished)add('永沐来源',owner.name+(owner===f?'在场':owner.hp>0?'场下存活':'场下已阵亡，仍在背包')+' · 对方执行不高于50%的异常附加时尝试附曝，受场下指定限制');
    if(battle.teamMirage2119?.[side]){const state=battle.teamMirage2119[side].state;add('己方蜃楼',state.remaining+' / 4 座 · 已转化 '+(state.cities.map(e=>e.name).join(' → ')||'无'));}
    {const cities=[...new Set((battle.teamMirage2119??[]).flatMap(field=>field?.state.cities.map(e=>e.name)??[]))];if(cities.length)add('双方蜃都',cities.join('、')+' · '+cities.map(n=>({序:'首末位条件无视顺序',源:'主动更换视为驱逐，仍指定替补',逐:'异常时长+1',理:'无法选择的技能回末回1PP'}[n])).join('；'));}
    if(battle.teamXin1061?.[side]?.mark){const mark=battle.teamXin1061[side].mark;if(mark.start>battle.round)add('辛之印记','第 '+mark.start+' 回合起，持续3回合 · 本场已授予');else if(mark.end>=battle.round)add('辛之印记','余 '+(mark.end-battle.round+1)+' 回合 · 全队免异常/弱化/固伤/百分比伤害，固伤/百分比抗性100%，攻击必暴');else add('辛之印记','已结束 · 本场不能再次授予');}
    if(f.soulId===1061){const fallen=game.slots[side].filter(slot=>slot.fighter.hp<=0&&!slot.fighter.soulState.vanished).length;add('天尊阵亡闪避',Math.min(100,fallen*6*(E.heroTempleMember1061(battle.fighters[1-side])?2:1))+'% · '+fallen+'只阵亡队友'+(E.heroTempleMember1061(battle.fighters[1-side])?' · 英雄圣殿翻倍':''));}
    if(battle.teamXuan2144Guard?.[side])add('玄武队伍免异','共享剩余 '+battle.teamXuan2144Guard[side].count+' 次 · 全队共同消费');
    if(battle.teamLaw2146?.[side]){const field=battle.teamLaw2146[side];add('队伍辰律',field.law+' / 4 · 与真实雷辰共占四槽 · 获得当回末清敌回合/强化并麻痹一次 · 点数保留');const owner=(battle.teamBench?.[side]??[]).find(x=>x.soulId===2146&&x.hp>0&&!x.soulState.vanished);if(owner)add('万霆场下观察',owner.name+' · 本人体力 '+(100*owner.hp/owner.stats.maxHp).toFixed(2)+'% · 仅全技能冠雷且敌异常执行概率严格更低时授点');}
    if(f.soulId===2058){const st=f.soulState.wind2058;if(st)add('风龙结',st.count+' 个 · 下场重置'+(st.reverseDue?' · 第'+st.reverseDue+'回初反转':''));}
    const dream=battle.teamDream1972?.[side];
    if(dream){
      if(f.soulId!==1972)add('危机感',dream.crisis+' 点');
      if(dream.hope)add('希望','全队共享 · 免秒杀，攻击/固定/百分比伤害额外减25% · 每回首次受异常清敌回合');
      else if(dream.destroyed)add('希望之花','已摧毁');
      else if(f.soulId!==1972&&dream.flower!=null)add('希望之花',dream.flower+' / 100');
      if(dream.flower!=null&&!dream.destroyed&&!dream.hope)add('希望之花成长','全队共享，场下持续 · 每回每点危机感成长2，100转希望');
    }
    const gate=battle.salmonGates?.[side];
    if(gate)add(['','四象门','六芒阵','八方圻'][gate.tier],gate.tier===1?'已记录 '+Object.keys(gate.visited).length+' 只其他出战精灵':(f.soulId===852?'双方异常转为全属性下降':'萨尔蒙在场时转化异常')+(gate.tier===3?' · 对方消强视为失败':''));
    const lotus=game.slots[side].find((slot,i)=>i!==game.active[side]&&slot.fighter.hp>0&&[1157,1561].includes(slot.fighter.soulId)&&slot.fighter.moves.includes('wiki:38583'))?.fighter;
    if(lotus&&E.benchCanTarget(battle,lotus,f))add('圣荷慰心','击败对手时触发凌波清芙的被击败效果');
    const frostSupport=game.slots[side].find((slot,i)=>i!==game.active[side]&&slot.fighter.hp>0&&slot.fighter.soulId===2141)?.fighter;
    if(frostSupport&&E.benchCanTarget(battle,frostSupport,f))add('霜域血装','场下阿克希亚支援 · 阻止对手以伤害、回复之外的方式改变体力');
    const plot=battle.teamPlot2153?.[side];
    if(plot){add('起承转合',['起','承','转','合','无人生还'][plot.phase]+' · 全队共享 · 已推进 '+plot.transitions+' 次'+(plot.phase===4?' · 敌方有谋死的存活者按阵亡结算':''));if(plot.guardRed>0)add('承 · 免攻击伤害','队伍共享 · 余 '+plot.guardRed+' 次');if(plot.guardAttack>0)add('转 · 免攻击','队伍共享 · 余 '+plot.guardAttack+' 次');}
    if(f.soulState.murder2153?.length)add('谋死',f.soulState.murder2153.map(n=>'ABCD'[n]).join('、')+' · 下场重置');
    if(f.soulState.teamHeaven4895===3)add('天依常在此','对手臣服或附属异常时额外无法行动 · 下场重置');
    if(f.soulState.heavenWard4895)add('命运庇护（喧云）','已配置的异常抗性必定触发 · 失去全免抗性 · 下场保留');
    if(f.soulState.prevImmunity1805?.end>=round){const e=f.soulState.prevImmunity1805;add('命起进场免疫',(e.from?e.from+' · ':'')+(e.all?'全部异常':e.statuses.join('、'))+' · 余 '+(e.end-round+1)+' 回合');}
    if(f.soulState.guardedFlame1833>0)add('佑灵灼火',f.soulState.guardedFlame1833+' / 7 层');
    if(f.soulState.permanentAilments2497?.length)add('白皑之纷争','本场免疫'+f.soulState.permanentAilments2497.join('、'));
    if(f.soulState.verse2098?.entryImmuneHistory?.length)add('上次登场免疫',f.soulState.verse2098.entryImmuneHistory.join('、'));
    if(battle.voidColors2392?.[side]>0)add('混色神·虚之彩',battle.voidColors2392[side]+' 只 · 每只于己方行动后附加 200 真伤');
    if(battle.teamBenchTargetBlockThrough?.[side]>=round)add('场下效果限制','场下精灵不能指定在场者 · 余 '+(battle.teamBenchTargetBlockThrough[side]-round+1)+' 回合');
    if(battle.holySwords?.[side]>0||battle.swordReforge?.[side])add('圣剑',battle.holySwords[side]+' 柄'+(battle.swordReforge?.[side]?' · 重铸中':''));
    if(f.soulId===1617&&f.hp>0&&battle.swordReforge?.[side])add('剑灵重铸领域','对手禁回复、体力药剂反扣 · 攻击无微弱 · 每层处决印记附100真伤');
    if(f.moves.includes('wiki:38454')&&battle.holySwords?.[side]>0&&(battle.fighters[1-side].soulState.executionMarks??0)>0)add('天破百战附剑','对手有处决印记 · 附着己方最高 '+battle.holySwords[side]+' 号圣剑，消耗1柄');
    if(game.slots[side].some(slot=>slot.fighter.soulId===1547))add('圣铸资格',battle.swordReforgeUsed?.[side]?'本场已触发 · 不再授剑':'本场首次死亡可触发');
    if(royalSources.length)add('场下资源保护','双方场下精灵体力、PP值不会减少 · 来源 '+royalSources.join('、'));
    if(game.slots[side].some(slot=>slot.fighter.soulId===2006&&slot.fighter.hp>0&&!slot.fighter.soulState.vanished))add('娜诺场下守护','己方场下非满体精灵体力不会下降');
    const noOutput=battle.teamOutputBlock2426?.[side];
    if(noOutput>=round)add('宁界之律封锁','无法造成伤害、附加异常 · 余 '+(noOutput-round+1)+' 回合');
    const independent=battle.teamTotems?.[side];
    const totem=independent?.end>=round?independent.totem:f.soulState.dragonTotem;
    if(totem?.active){const active=['sage','might','dominion'].flatMap((key,index)=>totem.blessings[key]?[['贤','威','霸'][index]]:[]);
      add('龙械图腾',(active.length?active.join('、')+'之庇护':'已启动')+(independent?.end>=round?' · 独立剩 '+(independent.end-round+1)+' 回合':''));
    }
    const field=battle.fieldExecutors?.[side];
    if(field)add('场上执行者',field.count+' 架 · 计为 1 只机械系额外精灵 · 不出战、不计胜负');
    const dragons=battle.teamDragons2028?.[side];
    if(dragons){add('金祖之龍',dragons.gold?'存活':'已阵亡 · 乔特鲁德非真伤减免 20%');add('玄源之㡣',dragons.dark?'存活':'已阵亡 · 乔特鲁德体力上限 +20%');if(dragons.guardRound===round)add('额外龙守护','己方当回合免疫异常');}
    if(f.soulId===2028){add('龙系入场护盾','按当前队伍可获得 '+E.dragonEligible2028(battle,side,true)*100+' 点');add('龙系攻击增伤','+'+E.dragonEligible2028(battle,side,false)*10+'%');}
    if(battle.extraStar2584?.[side])add('额外瀚宇星皇','存活计数 +1 · 提供星皇加护');
    if(battle.teamMoonPower?.[side]>0)add('月照星魂本场增伤','+'+battle.teamMoonPower[side]*10+'% / 50%');
    const critRule=E.WIKI.effectsEngine.registry[933],charges=(f.soulState.nextCritSources4599??[]).filter(e=>critRule.teamSharedKey(e.key)).reduce((v,e)=>v+e.count,0);
    if(charges)add('队伍攻击必暴','余 '+charges+' 次');
    const statusBlock=battle.teamStatusBlock753?.[side];
    if(statusBlock?.end>=round)add('队伍属性技能失效','余 '+(statusBlock.end-round+1)+' 回合');
    const block=battle.teamAttackBlock?.[side];
    if(block?.end>=round)add('队伍攻击失效','余 '+(block.end-round+1)+' 回合');
    const oscar=battle.teamOscarBlessings?.[side];
    if(oscar)for(const [i,name] of ['熔之加护','霜之加护','灿之加护'].entries())add(name,oscar.spent[i]?'已消耗，等待重新登场':'可用');
    for(const [key,label] of [['nextAttackInvalid1128','下次攻击无效'],['nextStatusInvalid1827','下次属性技能无效']]){
      const n=battle.teamBlocks?.[side]?.[key];if(n>0)add(label,'队伍共享 · 余 '+n+' 次');
    }
    for(const grant of battle.teamEntryGrants?.[side]??[]){
      const label=queuedLabels[grant.effectId]??inheritedSoulLabel(grant);if(!label)continue;
      let value='下只登场';
      if(grant.effectId===2426)value+=' · 无法造成伤害、附加异常 '+grant.turns+' 回合';
      if(grant.restoreHp)value+=' · 全部体力';if(grant.restorePP)value+=' · 全部 PP';
      if(grant.shield)value+=' · '+grant.shield+' 护盾';
      if(grant.block)value+=' · 封属 '+grant.block+' 回合';
      if(grant.bonus)value+=' · 增伤 '+Math.round(grant.bonus*100)+'%';
      if(grant.priority)value+=' · 先制 +'+grant.priority;
      if(grant.power)value+=' · 威力低于 '+grant.power;
      if(grant.stages){
        const changes=Object.entries(E.STAGE_LABELS).flatMap(([key,name],i)=>grant.stages[i]?[name+(grant.stages[i]>0?' +':' ')+grant.stages[i]]:[]);
        if(changes.length)value+=' · '+changes.join('、');
      }
      if(grant.effectId===1663)value+=' · '+grant.amount+' 个技能';
      if(grant.effectId===2432)value+=' · 每招恢复 '+grant.amount+' PP';
      if(grant.effectId===2159)value+=' · 吸取最大体力的 '+grant.percent+'%';
      if(grant.effectId===2027)value+=' · 每招 '+grant.amount+' PP';
      if(grant.denominator)value+=' · 最大体力 '+(grant.numerator??1)+'/'+grant.denominator;
      if(grant.remaining>1)value+=' · 余 '+grant.remaining+' 次登场';
      if(grant.chance!=null)value+=' · '+grant.chance+'%';
      if(grant.turns>0)value+=' · '+grant.turns+' 回合';
      const unit={1702:' HP',1937:' 点护盾',1911:' 点护罩',1128:' 次',1827:' 次',910:' 回合',934:' 级'}[grant.effectId];
      if(unit&&grant.amount!=null)value+=' · '+grant.amount+unit;
      if(grant.status)value+=' · '+grant.status;
      if(grant.count)value+=' · '+grant.count+' 次';
      if(grant.groups!=null)value+=' · '+grant.groups+' 组';
      add(label,value);
    }
    for(const w of Object.values(battle.teamSwitchWindows?.[side]??{}))
      if(w.through>=round)add('主动换入', (w.status??('随机 '+w.count+' 种异常'))+' · 余 '+(w.through-round+1)+' 回合');
    for(const [index,slot] of game.slots[side].entries()){
      if(index===game.active[side])continue;
      const member=slot.fighter,st=member.soulState;
      if(st.vanished)continue;
      if(st.prophecies?.triumph)add(member.name+' · 凯旋预言','下次击败回复全部体力、PP · 下场保留');
      if([1586,2055].includes(member.soulId)&&st.lokiLayers>0)add(member.name+' · 堕恶神祇',st.lokiLayers+' / 3 层');
      if(member.soulId===1973&&Number.isFinite(st.magicCurse1973))add(member.name+' · 魔王咒怨',st.magicCurse1973+' 层');
      if(member.soulId===2128&&st.shura2128?.thought>0)add(member.name+' · 法之意念',st.shura2128.thought+' 点');
      if(st.jasmineBlessing?.end>=round)add(member.name+' · 芳馨之祝','余 '+(st.jasmineBlessing.end-round+1)+' 回合');
      if(member.hp>0&&member.soulId===1985&&st.sealLayers>0)add(member.name+' · 封邪之嶂',st.sealLayers+' / 4 层 · 队友护盾承伤 +'+st.sealLayers*10+'% · 被无视时回护盾值的 '+st.sealLayers*40+'% 体力');
      if(st.forest)add(member.name+' · 苍茫树海','生命力 '+st.forest.life+' · 为在场队友触发技能');
      const scales=['red','yellow','blue'].filter(key=>{const e=st.royalGuards?.[key];return e&&e.start<=round&&(e.untilRemoved||e.end>=round);}).map(key=>({red:'红色',yellow:'黄色',blue:'蓝色'})[key]);
      if(scales.length)add(member.name+' · 三色龙鳞',scales.join('、')+' · 下场保留');
      if(st.murder2153?.length)add(member.name+' · 谋死',st.murder2153.map(n=>'ABCD'[n]).join('、'));
      if(st.futureLink>0)add(member.name+' · 未来链接',st.futureLink+' / 3 级');
      if(st.cloudConfusion1888>0)add(member.name+' · 下次登场混乱','令当时对手混乱 '+st.cloudConfusion1888+' 回合 · 登场后消费');
      if(st.contract1914?.sourceHash==='386605d1')add(member.name+' · 冥龙之契',(st.contract1914.ownerSide===0?'A 方':'B 方')+'龙琰 · 六项+70 · 攻击红伤无视护盾 · 下场保留');
      if(battle.teamExile1246?.[side]?.positions.includes(index))add(member.name+' · 放逐','无法主动换入');
      if(st.execution1547?.end>=round)add(member.name+' · 处决','印记 '+(st.executionMarks??0)+' 层 · 余 '+(st.execution1547.end-round+1)+' 回合');
      if(st.verse2098?.golden)add(member.name+' · 黄金万象','下次登场清回合、消强');
      if(st.qionghua>0)add(member.name+' · 琼华之庇',st.qionghua+' / 4 道');
      if(st.darkCause)add(member.name+' · 晦暗之因',st.darkCause.level+' / 5 级 · '+(st.darkCause.level<5?'场下不扣PP、不成长':'已成熟 · 回复效果 -25%'));
      if(st.ningjie===5)add(member.name+' · 宁界之律','5 道 · 场下体力和 PP 受保护');
      if(st.elderBenchPpEnd>=round)add(member.name+' · 场下技能回复','每招 1 PP · 余 '+(st.elderBenchPpEnd-round+1)+' 回合');
      if(st.mark1948)add(member.name+' · 狩杀之的','已标记');
      if(st.lianzhu2149)add(member.name+' · 连诛','帝皇之戎攻击后受最大体力 1/8 真伤');
      if(st.soulGu?.length)add(member.name+' · 留魂之蛊',st.soulGu.length+' / 4 只');
      if(st.inkTears>0)add(member.name+' · 蚀砚之泪',st.inkTears+' 滴');
      if(member.statusState?.faithSourceName)add(member.name+' · 信仰对象',member.statusState.faithSourceName);
      if(st.murder2153?.length)add(member.name+' · 谋死',st.murder2153.map(n=>'ABCD'[n]).join('、')+' · 下场重置');
      if(st.chiyong1878?.layers>0)add(member.name+' · 锁的场下状态','保留 '+st.chiyong1878.layers+' 层 · 场下暂停减层，回场继续');
      for(const item of fighter(member,round,battle.moveDefinitions).items){
        if(item.activeOnly)continue;
        const name=member.name+' · '+item.name;
        if(!items.some(existing=>existing.name===name))add(name,item.value);
      }
    }
    return items;
  }
  function logEvents(events) {
    const byCast = new Map(), keys = new Map(), summarizedMoves = new Set();
    events.forEach((event, index)=>{
      const {segment,damage}=event;
      if (!segment || damage?.type!=='attack' || damage.redCategory!=='attack') return;
      const key=[segment.cast,damage.sourceSide,damage.targetSide,segment.slot].join(':');
      if (!byCast.has(key)) byCast.set(key,[]);
      byCast.get(key).push(event);
      keys.set(index,key);
      if (segment.moveLogIndex!=null) summarizedMoves.add(segment.moveLogIndex);
    });
    const sideName=side=>side===0?'A 方':'B 方';
    return events.flatMap((event,index)=>{
      if (event.kind==='move'&&summarizedMoves.has(event.turnEventIndex??index)) return [];
      const segments=byCast.get(keys.get(index));
      if (!segments) return [event];
      if (segments[0]!==event) return [];
      const hpLoss=segments.reduce((total,hit)=>total+hit.damage.hpLoss,0);
      const {sourceSide,targetSide}=event.damage;
      const text=`${sideName(sourceSide)}使用${event.segment.move}，命中 ${segments.length} 段，${sideName(targetSide)}共损失 ${hpLoss} 点体力。`;
      return [{kind:'damage',text,segments}];
    });
  }
  return Object.freeze({fighter,team,specs,reiStatuses,spMarsStatuses,logEvents,queuedLabels:Object.freeze(queuedLabels)});
});


