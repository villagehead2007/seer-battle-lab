'use strict';
const fs=require('fs'),assert=require('assert/strict');
let file='dist/range-souls.js',t=fs.readFileSync(file,'utf8');assert.ok(!t.includes('const mirage2119='));const i=t.lastIndexOf('});');
const code=`
const mirage2119=f=>f.soulState.mirage2119??={remaining:4,cities:[],sourceHash:'cb360285'},city2119=(f,name)=>mirage2119(f).cities.findIndex(e=>e.name===name);
const mirageAbilities2119={
after(f,a,b){const x=city2119(f,a),y=city2119(f,b);return x>=0&&y>=0&&x>y;},
has(f,name){return !!f.soulState.mirage2119?.cities.some(e=>e.name===name);},
admitted(f,k,n,r){if(!conditionStatusRules.isControl(k)||conditionStatusRules.active(f,k,r))return null;const resistance=f.build?.resistance??f.resistance??{},names=resistance.slots?.map(x=>x.name)??[resistance.major,resistance.minor];if(!names.includes(k))return null;const st=mirage2119(f);if(st.remaining>0){const mapping={'wiki:29395':'序','wiki:29396':'源','wiki:29397':'逐','wiki:38460':'理'},order=f.moves.slice(0,4).map(id=>mapping[id]);if(order.some(x=>!x))throw Error('Q-4923-001：非四个对应技能的蜃楼转化顺序待确认');const next=order.find(name=>!st.cities.some(e=>e.name===name));if(!next)throw Error('蜃楼四种顺序状态不一致');st.cities.push({name:next,round:r,sequence:st.cities.length+1});st.remaining--;}(st.conversions??=[]).push({round:r,from:k,to:'超频',duration:3});return {kind:'超频',duration:3};}
};
registry[2119]={name:'莫缇',sourceHash:'cb360285',partial:true,unimplemented:['Q-4923-001：未携带四个对应技能时蜃楼顺序'],deferred:['蜃都之序真正队伍首末位条件；蜃都之源真实主动下场改驱逐；蜃楼及蜃都的真实跨队伍承接。当前转化、逐、理及技能条件不延期'],traits:{},abilities:mirageAbilities2119,hooks:{
battleStart(c){c.a.soulState.mirage2119={remaining:4,cities:[],sourceHash:'cb360285'};},
roundStart(c){const st=mirage2119(c.a);st.round=c.round;st.enemyKind=c.m&&c.m.kind!=='item'?c.m.kind:null;if(!st.enemyKind)st.defenseUntil=c.round+1;},
beforeIncomingAttack(c){if((mirage2119(c.a).defenseUntil??0)>=c.round)c.reduction=1-(1-c.reduction)*.5;},
afterUse(c){const st=mirage2119(c.a);if(c.actualUsed&&c.m.kind!=='item'&&st.round===c.round&&st.enemyKind===c.m.kind&&c.a.hp>0&&c.t.hp>0)c.ailment(c.t,'石化',c.a,false,false,1);}
}};
`;
fs.writeFileSync(file,t.slice(0,i)+code+t.slice(i));
file='dist/souls.js';t=fs.readFileSync(file,'utf8');
function replace(a,b){assert.ok(t.includes(a),a);t=t.replace(a,b);}
replace("function freeDoorChoice4888(f,key){return f.soulId===2075&&E.SOULS.registry[2075].abilities.freeChoice(f,key);}","function freeDoorChoice4888(f,key){return (key==='wiki:29395'&&E.SOULS.registry[2119]?.abilities.after(f,'序','理'))||(f.soulId===2075&&E.SOULS.registry[2075].abilities.freeChoice(f,key));}\nfunction cityActive2119(fighters,name){return fighters.some(f=>E.SOULS.registry[2119]?.abilities.has(f,name));}");
replace("admissionTransform:t.soulId===2062?","durationBonus:cityActive2119(fs,'逐')?1:0,admissionTransform:t.soulId===2119?(f,k,n,r)=>E.SOULS.registry[2119].abilities.admitted(f,k,n,r):t.soulId===2062?");
replace("admissionTransform:f.soulId===2062?","durationBonus:cityActive2119(s.fighters,'逐')?1:0,admissionTransform:f.soulId===2119?(f,k,n,r)=>E.SOULS.registry[2119].abilities.admitted(f,k,n,r):f.soulId===2062?");
replace("if(!bypass&&!ignoreReductions&&type==='fixed')amount=", "if(!bypass&&!ignoreReductions&&['fixed','percent'].includes(type)&&(f.soulState.mirage2119?.defenseUntil??0)>=r)amount=Math.floor(amount*.5);\n      if(!bypass&&!ignoreReductions&&type==='fixed')amount=");
replace("E.SOULS.run('beforeIncomingAttack',incoming);", "E.SOULS.run('beforeIncomingAttack',incoming);");
// Priority runs on the selected skill after roundStart has captured the enemy choice.
const priorityAnchor="E.WIKI.effectsEngine.run('beforeOrder',m.operations";let pos=t.indexOf(priorityAnchor);assert.ok(pos>=0);console.log('priority hook vicinity',t.slice(pos-250,pos+240));
replace("for(const f of fs)if(f.hp>0)E.SOULS.run('afterRoundEnd',context(f,fs[1-f.side]));", "if(cityActive2119(fs,'理'))for(const f of fs)if(f.hp>0){const allowed=E.availableMoves(f,r);for(const id of f.moves)if(!allowed.includes(id)){const before=f.pp[id];f.pp[id]=Math.min(battleMoves[id].pp,before+1);(f.soulState.miragePPRestored2119??=[]).push({round:r,move:id,amount:f.pp[id]-before});}}\n    for(const f of fs)if(f.hp>0)E.SOULS.run('afterRoundEnd',context(f,fs[1-f.side]));");
fs.writeFileSync(file,t);
file='dist/status-rules.js';t=fs.readFileSync(file,'utf8');replace("adjustResistanceChance=(f,k,n)=>n}={})","adjustResistanceChance=(f,k,n)=>n,durationBonus=0}={})");replace("const n=k==='衰弱'&&!randomSelection?3:(duration??durationFallback.resolve(random));validateDuration(n);","if(!Number.isInteger(durationBonus)||durationBonus<0)throw Error('异常时长附加值无效');const n=(k==='衰弱'&&!randomSelection?3:(duration??durationFallback.resolve(random)))+durationBonus;validateDuration(n);");replace("appliedKind==='衰弱'&&!randomSelection?3:merge===","appliedKind==='衰弱'&&!randomSelection?3+durationBonus:merge===");fs.writeFileSync(file,t);
fs.writeFileSync('tests/helpers/remaining-4923.cjs',"'use strict';module.exports=require('./remaining-battle.cjs')(require('../../research/BATCH-4816-REMAINING/4923/snapshot.json'));\n");
