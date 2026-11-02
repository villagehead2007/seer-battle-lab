'use strict';
// Diagnostic of existing local code only, not a test of the real game's distribution.
const fs=require('fs'),E=require('../dist/engine.js');
const draws=[.4,.9],calls=[],a={side:1,soulState:{},stats:{spe:100},shield:0},t={side:0,hp:1000};
E.SOULS.registry[984].hooks.afterUse({a,t,first:0,round:1,random:()=>{const n=draws.shift();calls.push(n);return n;},timed(){},stage(){},ailment(){throw Error('60% branch should not trigger with .9');},hurt(){}});
const result={kind:'implementation-only-observation',source:'dist/range-souls.js',soulId:984,sourceHash:E.SOULS.registry[984].sourceHash,draws:calls,selectedBranchInCurrentCode:2,branchDescription:'60%令对手害怕',innerChanceSucceeded:false,observedGuaranteedCrit:a.soulState.guaranteedCrit??0,finding:'选中害怕分支且60%判定失败时，else链落入必暴分支。应在公共选择设计中将外层分支选择与分支内部判定分离；本次只记录，不修改引擎。'};
fs.writeFileSync('research/random-effect-pools-choice-probe.json',JSON.stringify(result,null,2)+'\n');console.log(result);
