'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3237-native.cjs');
test('3237不动之天1065先按严格低半翻倍回复，再仅按实际恢复量造成百分比，满体禁疗封顶与免粉独立',()=>{
 for(const hp of[1000,4499,4500,4501,8950,9000])for(const mode of['normal','ban','percent-immune']){const s=H.turn(H.make(25171,{aHp:hp,aEffects:mode==='ban'?{技能禁疗:{start:1,end:5}}:{},bGear:mode==='percent-immune'?{resistance:{percent:100}}:{}}),25171),healed=mode==='ban'?0:Math.min(9000-hp,hp<4500?6000:3000);assert.equal(s.fighters[0].hp,hp+healed);assert.equal(H.damage(s,'percent'),mode==='percent-immune'?0:healed);assert.equal(s.fighters[1].hp,9000-(mode==='percent-immune'?0:healed));}
});
test('3237不动之天1065原四回用招回复粉伤，药剂不回不伤，最后一轮恢复实际6000且第五轮过期',()=>{
 let s=H.turn(H.make(25171,{aHp:1000,extraMoves:[22411],aEffects:{技能禁疗:{start:1,end:3}}}),25171);assert.equal(s.fighters[0].hp,1000);assert.equal(H.damage(s,'percent'),0);s=H.turn(s,'potion:pp');assert.equal(H.damage(s,'percent'),0);s=H.turn(s,22411);assert.equal(s.fighters[0].hp,1000);assert.equal(H.damage(s,'percent'),0);s=H.turn(s,22411);assert.equal(s.fighters[0].hp,7000);assert.equal(H.damage(s,'percent'),6000);s=H.turn(s,22411);assert.equal(s.fighters[0].hp,7000);assert.equal(H.damage(s,'percent'),0);assert.equal(s.fighters[0].effects.用招低体双倍回血粉伤,undefined);
});
test('3237异域魔界452原三回只按完整红伤吸血，保1实际零损失仍回，技能禁疗与到期不回',()=>{
 for(const ban of[false,true]){let s=H.turn(H.make(22194,{aHp:1000,extraMoves:[14102],aStages:{acc:6},bHp:1,bEffects:{致命保留:{start:1,end:6,hp:1}},aEffects:ban?{技能禁疗:{start:2,end:3}}:{}}),22194);assert.equal(s.fighters[0].hp,1000);for(let r=2;r<=4;r++){const before=s.fighters[0].hp;s=H.turn(s,14102);const red=H.damage(s,'attack');assert.ok(red>0);assert.equal(s.fighters[1].hp,1);assert.equal(s.fighters[0].hp,before+(!ban&&r<=3?red:0));}}
});
test('3237灵魂之歌136真实自然MISS才恢复四分一，命中害怕不回血，技能禁疗阻回复',()=>{
 for(const ban of[false,true]){let found=false;for(let seed=1;seed<=24&&!found;seed++){let s=H.turn(H.make(22410,{seed,aHp:1000,aStages:{acc:-6},aEffects:ban?{技能禁疗:{start:1,end:1}}:{}}),22410);if(s.fighters[1].ailments.害怕)continue;found=true;assert.equal(s.fighters[0].hp,ban?1000:3250);assert.equal(s.fighters[0].pp['wiki:22410'],9);}assert.ok(found);}const hit=H.turn(H.make(22410,{aHp:1000,aStages:{acc:6}}),22410);assert.ok(hit.fighters[1].ailments.害怕);assert.equal(hit.fighters[0].hp,1000);
});
test('3237原大智善心明660清强成功才回满，空正保护不回且技能禁疗阻回复，其他原附伤保留',()=>{
 for(const mode of['normal','empty','protect','ban']){const s=H.turn(H.make(30134,{aHp:1000,aStages:{acc:6},bStages:mode==='empty'?{}:{atk:2,def:1,spa:-1},bEffects:mode==='protect'?{强化保护:{start:1,end:5}}:{},aEffects:mode==='ban'?{技能禁疗:{start:1,end:5}}:{}}),30134);assert.equal(s.fighters[0].hp,mode==='normal'?9000:1000);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(s.fighters[1].stages.spa,mode==='empty'?0:-1);}
});
