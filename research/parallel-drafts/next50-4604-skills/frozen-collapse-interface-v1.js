const exact4604=(m,i,x,p)=>!!m&&(m.wikiId??m.id)===x.moveId&&m.revision==='seerapi:'+x.hash&&(m.wikiId||m.hash===x.hash)&&i===x.index&&JSON.stringify(p)===JSON.stringify(x.args);
metadata[2111]={"info":"崩溃：对手直到下场属性技能无效","args_num":0};
metadata[2112]={"info":"崩溃：萨芙凯特直到战斗结束免疫受到的控制类异常状态","args_num":0};
metadata[2113]={"info":"崩溃：萨芙凯特直到战斗结束先制+1","args_num":0};
metadata[2114]={"info":"崩溃：萨芙凯特获得2道未来指令","args_num":0};
metadata[2115]={"info":"此技能不会崩溃，每次强制执行后由未崩溃的首位其他技能代替崩溃，若其他技能均已崩溃且对手存活则额外进行一次行动以发起最终指令：自身消耗全部体力并消逝，消除对手回合类效果、能力提升效果并附加自身所有能力值之和的水·次元系伤害","args_num":0};
add(2111,'collapse1809',c=>{c.t.soulState.saff2111Source={move:c.m.wikiId??c.m.id,hash:c.m.hash??c.m.revision.slice(8)};},[],'当前敌方直到真实下场的属性技能无效已完成；真实切换时清除此来源状态延期');
add(2112,'collapse1809',c=>{c.a.soulState.saffControlImmune1809=true;},[]);
add(2113,'collapse1809',c=>{c.a.soulState.saffCollapsePriority1809=1;},[]);
add(2114,'collapse1809',c=>c.soulAbility(1809,'grantInstructions',2),[]);
add(2115,'finalCommand1809',c=>{const p=c.finalCommand1809Input;if(!p)throw Error('4604最终指令消逝/基数与属性伤害载荷待确认');registry[2115].qualifiedFinalCommand(c,p);},[]);
registry[2115]=Object.freeze({...registry[2115],qualifiedFinalCommand(c,p){if(!p||!Number.isFinite(p.basis)||p.basis<0||!['independent-typed','direct-typed'].includes(p.channel)||p.disappearance!=='direct-no-death')throw Error('4604最终指令必须明确消逝、基数与伤害通道');const before=c.a.hp;c.a.hp=0;c.a.soulState.saffFinalDisappeared1809=true;c.clear(c.t);c.clearBoost(c.t);const amount=p.channel==='independent-typed'?c.typedAttack(p.basis,'水次元'):c.hurt(c.t,p.basis,'明确最终指令属性伤害','true');return {consumed:before,basis:p.basis,amount};}});
{const old=registry[2111],b=[{"moveId":37110,"hash":"bf5c1452","index":2,"id":2111,"args":[]}];registry[2111]=Object.freeze({...old,validate(p,m,i){if(b.some(x=>exact4604(m,i,x,p)))return;throw Error('4604 exact source mismatch');}});}
{const old=registry[2112],b=[{"moveId":28598,"hash":"2e0afb7f","index":4,"id":2112,"args":[]}];registry[2112]=Object.freeze({...old,validate(p,m,i){if(b.some(x=>exact4604(m,i,x,p)))return;throw Error('4604 exact source mismatch');}});}
{const old=registry[2113],b=[{"moveId":28599,"hash":"430b59f2","index":5,"id":2113,"args":[]}];registry[2113]=Object.freeze({...old,validate(p,m,i){if(b.some(x=>exact4604(m,i,x,p)))return;throw Error('4604 exact source mismatch');}});}
{const old=registry[2114],b=[{"moveId":37113,"hash":"a29ef978","index":3,"id":2114,"args":[]}];registry[2114]=Object.freeze({...old,validate(p,m,i){if(b.some(x=>exact4604(m,i,x,p)))return;throw Error('4604 exact source mismatch');}});}
{const old=registry[2115],b=[{"moveId":37114,"hash":"db027470","index":3,"id":2115,"args":[]}];registry[2115]=Object.freeze({...old,validate(p,m,i){if(b.some(x=>exact4604(m,i,x,p)))return;throw Error('4604 exact source mismatch');}});}
