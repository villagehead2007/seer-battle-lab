'use strict';
const fs=require('node:fs'),path=require('node:path');
const {specs,queuedLabels}=require('../../dist/battle-display.js');
const E=require('../../dist/engine.js');
const inventory=require('./state-display-inventory.json');
const wired=new Map();
for(const spec of specs){
  const key='soulState.'+spec.path;
  const records=wired.get(key)??[];
  records.push({label:spec.label,unit:spec.unit,versions:spec.ids?.map(id=>({id,hash:E.SOULS.registry[id]?.sourceHash}))??'实际效果持有者'});
  wired.set(key,records);
}
const rows=inventory.rows.map(r=>({path:r.path,status:wired.has(r.path)?'已接入数值展示':r.existingView?'界面有读取，待核对实际文案':'待逐项核对',display:wired.get(r.path),locations:r.locations}));
const summary={};
for(const r of rows)summary[r.status]=(summary[r.status]??0)+1;
const explicit={
  740:['低回复奖励的指定次回合：红伤+50%、按完整红伤100%回复、回合末失效及下场清除','仅下一回合封属100%保底、逾期及下场清除'],
  1030:['低回复奖励的指定次回合：红伤+100%、按完整红伤100%回复、回合末失效及下场清除','下次对手属性技能100%失效保底、下场清除'],
  638:['灵神重生可用次数','魂印下次攻击附伤','神途之熠层数和形态','三个技能本场首次加层是否已用','灵神重生威力翻倍期限'],
  1738:['法天象地·圣每场一次资格、当前强化剩余回合和离场消失'],
  1879:['星盘0–12刻、前进或回返、99%减伤窗口、再次星启时点及场下保存'],
  2044:['首次致死保命每场一次资格、本次在场命中计数及下次附伤所用防御或特防'],
  1845:['德莱赫默守备或激发状态、当前构造种类数量与I至IV列表'],
  2110:['中立双月、当前归属、持续期限、碰撞全部暂停与转移锁定'],
  1406:['25%登场增伤和每只阵亡10个百分点，真实全部阵亡时真伤资格'],
  1559:['原入场对手的PP封锁名单及期限、次元之镜绑定的技能名称与减伤期限'],
  1851:['原入场对手的PP封锁名单及期限'],
  1647:['两种首次命中资格、恢复削减、条件低威力闪避和下一回合先制或增伤'],
  1645:['击败后实际下一位的首次属性整招无效预告与消费次数'],
  1553:['战神之魂本场攻击增伤'],1781:['千灭雷翼本回合条件'],1806:['在场与替补成员的未来链接'],2098:['黄金万象、上次登场免疫与白皑之纷争'],2072:['琼华之庇、场下满层宁界之律、宁界封锁'],2153:['起承转合阶段、谋死持有人、全队免异常'],2141:['霜域血装支援'],2046:['虚之彩数量及每只行动末真伤'],1833:['全队佑灵灼火余数'],1017:['苍茫树海场下生命力'],

  849:['帝君之罚、赐返场倍率、之援与之阵、最后存活的之威'],1985:['场下封邪、队友护盾承伤及无视时回复比例'],1197:['月照星魂本场增伤'],1436:['月照星魂本场增伤'],1408:['主动登场后的用招 PP 消耗倍率'],1580:['主动登场后的用招 PP 消耗倍率'],2055:['神诗叙诡免攻窗口及场下神祇层数'],
  753:['轮回本场是否已用、虚无抵挡'],2139:['执行者补充剩余回合'],1586:['诡计神罚登场封招是否已用、场下堕恶神祇'],1973:['场下魔王咒怨'],622:['星皇之赐、星皇之佑及当前目标限制'],
  1727:['强击、无罔、威破形态','北冥之刃与北冥狂刃剩余回合'],1598:['下次攻击的先制与增伤或吸取'],
  2149:['主位和副位名称、各自当前体力、阵亡与空缺','星皇之赐与星皇之佑','额外瀚宇星皇：存活计数和加护'],
  1061:['召唤物辛的体力与融合'],708:['当前及下回合形态'],1764:['圣谕和邪魇形态与对应印记'],
  2059:['百天浮世络持续回合与累计受伤','怀生菩怜态与拒赦怒威态'],2128:['正气或邪气','法之意念及下次附伤'],
  2125:['金、木、水、火土的持有人与剩余回合'],1916:['回溯记录及是否已用'],2084:['全队信仰后的本场免疫'],
  1829:['命运庇护'],1816:['下次登场的山祇恩怜或护盾'],2099:['渐烬上限归零']
};
const speciesDir=path.resolve(__dirname,'../../data/species');
const species=fs.readdirSync(speciesDir).filter(n=>/^\d+\.json$/.test(n)).map(file=>{
  const pet=JSON.parse(fs.readFileSync(path.join(speciesDir,file))).snapshot;
  const teamSkillDisplays=[];
  for(const move of pet.moves){
    for(const [index,instance] of (move.effectInstances??[]).entries()){
      // This handwritten shared state belongs to the exact skill, not either soul.
      if(pet.id===3425&&move.id===38525&&move.hash==='a14337fd'&&index===0&&instance.id===2556&&instance.args.length===0){
        teamSkillDisplays.push({skill:move.id,name:move.name,sourceHash:move.hash,index,effect:instance.id,parameters:instance.args,label:'熔之加护、霜之加护、灿之加护各自可用或已消耗、等待奥斯卡重新登场',displaySource:'exact-skill-owned-handwritten-shared-team-state',statePath:'teamOscarBlessings',locations:['dist/battle-display.js:722','dist/battle-display.js:723']});
        continue;
      }
      const label=queuedLabels[instance.id];
      if(!label||!E.WIKI.effectsEngine.registry[instance.id]?.onTeamEntry)continue;
      teamSkillDisplays.push({skill:move.id,name:move.name,sourceHash:move.hash,index,effect:instance.id,parameters:instance.args,label});
    }
  }
    return {id:pet.id,name:pet.name,teamSkillDisplays,souls:pet.souls.map(soul=>{
    const bound=E.SOULS.acceptsSource(soul.id,soul.hash);
    const labels=bound?[...new Set([...specs.filter(spec=>spec.ids?.includes(soul.id)).map(spec=>spec.label),...(explicit[soul.id]??[])])]:[];
    return {id:soul.id,sourceHash:soul.hash,display:labels,status:labels.length?'已有明确展示项，剩余机制待逐项核对':'待核对原有展示及专属机制'};
  })};
});
fs.writeFileSync(path.join(__dirname,'state-display-coverage.json'),JSON.stringify({summary,displayTotals:{catalogSpecies:species.length,soulVersions:species.reduce((n,p)=>n+p.souls.length,0),speciesWithSoulLabels:species.filter(p=>p.souls.some(s=>s.display.length)).length,speciesWithTeamSkillLabels:species.filter(p=>p.teamSkillDisplays.length).length,teamSkillInstancesWithLabels:species.reduce((n,p)=>n+p.teamSkillDisplays.length,0)},teamSkillScope:'按图鉴版本逐条列出具有登场处理和中文提示的技能来源，及已精确绑定来源的手写队伍状态展示；3425三加护归真实38525/2556而非魂印。此表仅是显示映射，不是浏览器视觉或专项实战通过，结果另见逐条验收记录。',species,scope:'统计单位为静态访问路径。特殊形态、团体成员和队伍继承的手写展示尚未计入数值展示。',mechanismGaps:['帝皇铠甲的场下观察、跨成员共享五行印记和水之掩藏指定','讨与连诛已测护盾来源，其他场下效果来源逐项核对中'],dynamic:inventory.dynamic,rows},null,2)+'\n');
console.log(summary);
