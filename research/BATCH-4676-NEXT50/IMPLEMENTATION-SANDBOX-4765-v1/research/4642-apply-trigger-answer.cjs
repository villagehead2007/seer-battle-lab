'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
assert.ok(fs.existsSync('research/zero-hit-affected-v1-result.json'),'Wait for frozen affected regression to finish');
const manifest=JSON.parse(fs.readFileSync('research/zero-damage-hit-2026-10-29/affected-code-frozen.json'));
const mismatches=manifest.files.filter(x=>crypto.createHash('sha256').update(fs.readFileSync(x.path)).digest('hex')!==x.sha256);
assert.deepEqual(mismatches,[],'Frozen input changed');
fs.writeFileSync('research/zero-damage-hit-2026-10-29/affected-freeze-verification.json',JSON.stringify({at:new Date().toISOString(),checked:manifest.files.length,mismatches},null,2)+'\n');
const file='dist/souls.js';let text=fs.readFileSync(file,'utf8');
fs.mkdirSync('research/zero-damage-hit-2026-10-29/4642-before',{recursive:true});
fs.copyFileSync(file,'research/zero-damage-hit-2026-10-29/4642-before/trigger-answer-souls.js');
function replace(a,b){assert.equal(text.split(a).length,2,a);text=text.replace(a,b);}
replace("if(on(f,'强化被清追加')&&f.effects['强化被清追加'].ayami4642&&operation==='reverse'||on(f,'强化被清吸取')&&f.effects['强化被清吸取'].ayami4642&&(method==='steal'||operation==='reverse'))throw Error('Q-N50-4511-002：4642纯反转/吸取是否触发对应消强反制待确认');",'');
replace("if(on(f,'强化被清追加')){const e=f.effects['强化被清追加'];","if(on(f,'强化被清追加')&&(!f.effects['强化被清追加'].ayami4642||operation!=='reverse')){const e=f.effects['强化被清追加'];");
replace("if(on(f,'强化被清吸取')&&(by.hp>0||f.effects['强化被清吸取'].ayami4642)){","if(on(f,'强化被清吸取')&&(by.hp>0||f.effects['强化被清吸取'].ayami4642)&&(!f.effects['强化被清吸取'].ayami4642||(method==='clear'&&operation!=='reverse'))){");
fs.writeFileSync(file,text);
const test='tests/next50-4642-skills.test.cjs';fs.copyFileSync(test,'research/zero-damage-hit-2026-10-29/4642-before/trigger-answer-skills.test.cjs');
fs.appendFileSync(test,`\ntest('4642确认783消除或吸取触发而1109仅消除触发且纯反转均不触发',()=>{for(const id of [783,1109])for(const mode of ['clear','steal','reverse']){const s=make(e(id),{hp:1000});s.fighters[0].stages.atk=2;turn(s);const o=qualified(s,c=>{if(mode==='clear')c.clearBoost(c.a);else if(mode==='steal')c.steal(c.t,c.a,'明确吸取');else c.rewriteStageValues(c.a,{atk:-2},'reverse');});const triggered=mode==='clear'||id===783&&mode==='steal';assert.equal(o.fighters[0].stages.atk,mode==='reverse'?-2:0);assert.equal(o.fighters[1].stages.atk,mode==='steal'?2:0);assert.equal(sum(o,'percent'),triggered?3000:0);assert.equal(o.fighters[1].hp,triggered?6000:9000);assert.equal(o.fighters[0].hp,id===1109&&triggered?4000:1000);}});\n`);
const answerFile='research/4642-direct-trigger-answer-2026-10-29.json',answer=JSON.parse(fs.readFileSync(answerFile));answer.implementationStatus='已实现，专项状态验证待执行';fs.writeFileSync(answerFile,JSON.stringify(answer,null,2)+'\n');
console.log('Applied 4642 trigger scope; frozen inputs verified; state tests pending');
