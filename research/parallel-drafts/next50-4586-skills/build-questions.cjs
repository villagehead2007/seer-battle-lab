const fs=require('fs'),D=__dirname,s=require('../../4586-reviewed-snapshot.json');
const texts={
 '004':{ids:[2092,2098],gap:'2092自身先制等级是否含原生、铭文与回合增减；补到先制后再判断拥有还是先判断拥有；2098赋予时定2/3还是未来各次用招重算。真实28535授予后选择阅世36998原生+3可导致差异。初始0篇且先制3：前查拥有得全+1/4篇，补后查得全+2/3篇。',question:'2092和2098的“自身先制等级”具体取哪些先制项、在何时读取，2092是在补诗前还是补诗后判断有无诗章、2098是在授予时定值还是未来每次用招重算？'},
 '005':{ids:[751],gap:'当前HP40%数值已知，未限定伤害种类；固定/百分/真实/独立属性伤害在免疫、护盾、克制和防御下产生不同真实HP损失。未找到可扩大到新751的泛确认，现代码percent不作用户答案。',question:'37001谬法无端的751“附加对手当前体力40%的伤害”属于哪种伤害类型？'},
 '006':{ids:[2088,2089,2090],gap:'原文仅写次元·龙系伤害，不明红伤、固定、百分比、真实或独立属性结算。现有typedAttack实现为独立数值属性管线、不计防御暴击、计克制与攻击减免；旧2552电圣灵确认仅旧实例，不能泛化。当前给定四种结算载荷做真实状态差异测试，未将任何一种当自然源答案。',question:'这三条次元·龙系附加伤害采用哪种伤害结算，是否计算防御、暴击、克制，并受哪些伤害免疫和减免影响？'}
};
const out=Object.entries(texts).map(([n,d])=>({questionId:'Q-N50-4586-'+n,creature:{id:s.id,name:s.name},instances:s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({m,e,index}))).filter(x=>d.ids.includes(x.e.id)).map(({m,e,index})=>({moveId:m.id,moveName:m.name,moveHash:m.hash,moveURL:'https://api.seerapi.com/v1/skill/'+m.id,index,effectId:e.id,effectArgs:e.args,description:e.description,fullSkillText:m.description,effectTemplate:s.effects.find(x=>x.id===e.id).template,effectHash:s.effects.find(x=>x.id===e.id).revision.replace(/^seerapi:/,''),effectURL:'https://api.seerapi.com/v1/skill_effect_type/'+e.id})),checked:'research/4586-source-supplement.json（API/Wiki同文，术语缺页）；本轮新填回答未读取',gap:d.gap,question:d.question,answer:''}));
fs.writeFileSync(D+'/4586-questions-draft.json',JSON.stringify(out,null,2));
