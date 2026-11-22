'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3242-native.cjs');
test('3242不灭天尊780原50概率随机清一非零PP，零红命中仍触发，MISS无效属性保护不触发，三回合到期',()=>{
 for(const mode of ['normal','zero','shield','last','miss','invalid','status','protect','expired']){let yes=0,no=0;for(let seed=1;seed<=20;seed++){
 let s=H.make(24119,{seed,enemyMoves:[10086,20355],aStats:{spe:4000},bStages:{acc:6},aEffects:mode==='zero'?{攻击伤害免疫:{start:1,end:4}}:{},bEffects:mode==='miss'?{攻击必失:{start:1,end:4}}:mode==='invalid'?{skillBlock:{start:1,end:4}}:mode==='protect'?{PP保护:{start:1,end:4}}:{}});
 if(mode==='shield')s.fighters[0].suitState.shield=9000;
 if(['last','expired'].includes(mode)){for(let r=1;r<=(mode==='last'?2:3);r++)s=H.turn(s,r===1?24119:'potion:pp');s=H.turn(s,'potion:pp',10086);}else s=H.turn(s,24119,mode==='status'?20355:10086);
 const cleared=s.turns.at(-1).events.some(e=>e.text.includes('受击随机清空对手技能 PP'));if(cleared){yes++;assert.equal(Object.values(s.fighters[1].pp).filter(n=>n===0).length,1);}else no++;
 if(['zero','shield','miss','invalid'].includes(mode))assert.equal(H.damage(s,'attack',1),0);
 }if(['normal','zero','shield','last'].includes(mode)){assert.ok(yes>0&&no>0,mode);}else assert.equal(yes,0,mode);}
});
test('3242战神狂怒585全能力一阶与433三回合攻击成长独立，禁强化只挡等级，48四回免异第五回到期',()=>{
 for(const ban of [false,true]){let s=H.make(24120,{aEffects:ban?{禁强化:{start:1,end:5}}:{}});for(let r=1;r<=4;r++){s=H.turn(s,r===1?24120:'potion:pp');assert.equal(s.fighters[0].stages.atk,ban?0:Math.min(r+1,4));for(const k of ['def','spa','spd','spe','acc'])assert.equal(s.fighters[0].stages[k],ban?0:1);}}
 let s=H.make(24120,{enemyId:3205,enemyMoves:[22053],aStats:{spe:4000},bStages:{acc:6}});for(let r=1;r<=5;r++){s=H.turn(s,r===1?24120:'potion:pp',22053);assert.equal(Boolean(s.fighters[0].ailments.睡眠),r===5);}
});
test('3242战神狂怒690监听下三回合，强化消失当回封属直至第四回，第五回恢复',()=>{
 let s=H.make(24120,{enemyId:3242,enemyMoves:[10715,20308],aStats:{spe:4000},bStages:{acc:6}});
 s=H.turn(s,24120,10715);assert.equal(s.fighters[1].effects.statusBlock,undefined,'使用当回尚未监听');
 s=H.turn(s,'potion:pp',10715);assert.equal(s.fighters[1].effects.statusBlock.start,2);assert.equal(s.fighters[1].effects.statusBlock.end,4);
 for(let r=3;r<=5;r++){s=H.turn(s,'potion:pp',20308);assert.equal(s.fighters[1].stages.spa,r===5?1:0);}
});
test('3242战神狂怒690真实消回合后不再监听，随后消强不授封属',()=>{
 let s=H.make(24120,{enemyId:3242,enemyMoves:[17489,10715],aStats:{spe:4000},bStages:{acc:6}});s=H.turn(s,24120);s=H.turn(s,'potion:pp',17489);s=H.turn(s,'potion:pp',10715);assert.equal(s.fighters[1].effects.statusBlock,undefined);assert.equal(s.fighters[0].stages.atk,0);
});
