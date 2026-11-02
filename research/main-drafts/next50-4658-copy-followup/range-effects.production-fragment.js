// Append after the original4658 fragment. Full copied-object model is explicitly qualified research; natural lifecycle remains010.
{const previous=registry[1619];registry[1619]=Object.freeze({...previous,execute(c,p){
 if(!sourced4658(c,1619)||c.a.soulState.qualifiedCopy16194658!=='single-use-after-root')return previous.execute(c,p);
 if(c.random()>=.5){c.heal(c.a,c.a.stats.maxHp/2,c.m.name+'未触发回复','skill');c.stage(c.t,-1);return;}
 if(!c.usedSkillThisRound(c.t))throw Error('Q-N50-4658-010：单次复制研究模型要求对手已实际用招，未用招流程仍待确认');
 const parsed=c.selectedMove(c.t);if(!parsed||parsed.operations?.some(op=>op.effectId===1619))throw Error('Q-N50-4658-010：实际复制对象递归生命周期待确认');
 c.a.soulState.effectiveCopy16194658={round:c.round,root:c.m.id,move:{...parsed,wikiId:parsed.wikiId??parsed.id},researchLifecycle:'single-use-after-root/root-PP/no-reorder'};
 c.a.soulState.copyIdentityAudit16194658={round:c.round,root:c.m.wikiId??c.m.id,copied:parsed.wikiId??parsed.id,kind:parsed.kind,type:parsed.type,power:parsed.power};
 c.reproduceSkillComponent(parsed);
}});}
