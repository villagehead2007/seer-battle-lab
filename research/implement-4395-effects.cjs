const fs=require('fs');let p='dist/range-effects.js',s=fs.readFileSync(p,'utf8'),at=s.lastIndexOf('\n});');s=s.slice(0,at)+`
metadata[1832]={info:'{0}回合内{1}%闪避对手攻击，若本次技能造成的伤害高于{2}则闪避效果延长{3}回合',args_num:4};
add(1832,'afterHit',(c,p)=>c.timed(c.a,'概率闪避',p[0]+((c.settledDamage??c.dealt)>p[2]?p[3]:0),{chance:p[1]}),[turns,pct,[0,99999],turns]);
metadata[1391]={info:'{0}回合内若对手使用属性技能则造成伤害前令对手{1}，未触发则消除对手回合类效果',args_num:2};
add(1391,'afterHit',(c,p)=>c.timed(c.a,'属性条件伤前异常',p[0],{ailment:ailments[p[1]],question:'Q-N20-4395-001'}),[turns,[15,15]]);
registry[1391]=Object.freeze({...registry[1391],singleStagePending:'Q-N20-4395-001：条件不满足及尚未实际出手时的未触发范围待确认'});
`+s.slice(at);fs.writeFileSync(p,s);p='dist/souls.js';s=fs.readFileSync(p,'utf8');const anchor="      const effectContext={...skillContext(a,t,m),crit,power,affinity,";if(!s.includes(anchor))throw Error('anchor');s=s.replace(anchor,`      if(on(a,'属性条件伤前异常')){const c=skillContext(a,t,m),e=a.effects['属性条件伤前异常'],foe=c.selectedMove(t);if(!c.usedSkillThisRound(t)||foe?.kind!=='status')throw Error(e.question+'：未实际使用属性技能时的未触发与时机未核实');if(!c.ailment(t,e.ailment,a)&&a.hp>0)c.clear(t);}
`+anchor);fs.writeFileSync(p,s);p='tests/helpers/4395-battle.cjs';s=fs.readFileSync(p,'utf8').replace('unknown=[1391]','unknown=[]');fs.writeFileSync(p,s);
