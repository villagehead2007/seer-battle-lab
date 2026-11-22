'use strict';const test=require('node:test'),assert=require('node:assert/strict'),H=require('./helpers/3240-native.cjs');
test('3240堕落绝语与万妖朝拜132只在出招当前HP严格低于对手时威力翻倍，等体与高体不翻',()=>{
 for(const[move,power]of[[15882,130],[30145,85]])for(const hp of[4499,4500,4501]){const seen=[],old=H.E.WIKI.effectsEngine;H.E.WIKI.effectsEngine={...old,run(phase,ops,c){const out=old.run(phase,ops,c);if(phase==='beforeDamage'&&c.a.side===0&&(c.m.wikiId??c.m.id)===move)seen.push(c.power);return out;}};let s;try{s=H.turn(H.make(move,{aHp:hp,bHp:4500,aStages:{acc:6}}),move);}finally{H.E.WIKI.effectsEngine=old;}assert.deepEqual(seen,[power*(hp<4500?2:1)]);assert.ok(H.damage(s,'attack')>0);assert.equal(s.fighters[0].pp['wiki:'+move],H.source.moves.find(m=>m.id===move).pp-1);}
});
test('3240堕落绝语原33清正留负，无正不改；普通防消吸仍阻消强而不阻本招红伤及低体增威',()=>{
 for(const mode of['boost','none','protect']){const s=H.turn(H.make(15882,{aHp:1000,bStages:mode==='none'?{def:-1}:{atk:2,def:-1},bEffects:mode==='protect'?{强化保护:{start:1,end:4}}:{},aStages:{acc:6}}),15882);assert.equal(s.fighters[1].stages.atk,mode==='protect'?2:0);assert.equal(s.fighters[1].stages.def,-1);assert.ok(H.damage(s,'attack')>0);}
});
