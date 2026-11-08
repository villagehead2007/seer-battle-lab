const fs=require('fs'),assert=require('assert/strict'),s=require('./snapshot.json');
const ids=[803,2230,2068,2391,2392],bindings=s.moves.flatMap(m=>m.effectInstances.map((e,index)=>({id:e.id,moveId:m.id,hash:m.hash,index,args:e.args}))).filter(x=>ids.includes(x.id));
const block=`
const curtains2046={
state(c){return c.curtainState2046();},
create(c,side,color=1){const st=this.state(c);if(st.sides[side]!=null)return false;st.sides[side]=color;if(!st.history[side].includes(color))st.history[side].push(color);return true;},
change(c,side,color){const st=this.state(c);if(st.sides[side]==null||st.sides[side]===color)return false;const from=st.sides[side];st.sides[side]=color;if(!st.history[side].includes(color))st.history[side].push(color);st.changes.push({round:c.round,side,from,to:color,sourceSide:c.a.side,moveId:c.m?.wikiId??c.m?.id??null});return true;},
start(c){this.create(c,c.a.side);const name=c.firstMoveName2046(),color=name.includes('黄')?4:name.includes('蓝')?3:(name.includes('红')||name.includes('赤'))?2:name.includes('黑')?5:name.includes('白')?1:null;if(color!=null)this.change(c,c.a.side,color);},
entry(c){this.create(c,c.t.side);this.state(c).pendingInitial=true;},
finish(c){if(c.a.hp<=0)return;const changes=this.state(c).changes.filter(e=>e.round===c.round);if(changes.length>1)throw Error('Q-4861-001：同回合多次变色回复次数待确认');if(changes.length===1){c.heal(c.a,c.a.stats.maxHp/3,'涂蝶变色回末回复','soul');c.pp(c.a,1);}},
primaries(c){return [2,3,4].every(color=>this.state(c).history[c.a.side].includes(color));}
};
const bindings4861=${JSON.stringify(bindings)},metadata4861=${JSON.stringify(s.effects.filter(e=>ids.includes(e.id)))};
const handlers4861={
803(c,p){if(statusRoll(c,p[0])&&c.ailment(c.t,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]}))return;c.heal(c.a,c.a.stats.maxHp/p[2],c.m.name+'未触发回复','skill');c.timed(c.a,'伤害上限',p[3],{amount:p[4],polar803:true,attackOnly:true});},
2230(c,p){c.timed(c.a,'用招回复失败附沸涌',p[0],{denominator:p[1],chance:p[2],status:ailments[p[3]]});},
2068(c,p){if(!(statusRoll(c,p[0])&&c.ailment(c.t,ailments[p[1]],c.a,false,false,null,{probabilityPercent:p[0]})))c.timed(c.t,'回合结束后消回合',1,{});},
2391(c,p){curtains2046.change(c,p[0]===0?c.a.side:c.t.side,p[1]);},
2392(c){const st=curtains2046.state(c);(st.deferredSummons??=[]).push({round:c.round,side:c.a.side,eligible:curtains2046.primaries(c),effectId:2392,moveId:c.m.wikiId??c.m.id,revision:c.m.revision});}
};
for(const id of [803,2230,2068,2391,2392]){const old=registry[id],meta=metadata4861.find(e=>e.id===id);registry[id]=Object.freeze({...old,id,template:meta.template,argsNum:meta.argsNum,instanceArgsNum:meta.argsNum,direct:true,phase:'afterHit',...(id===2391?{abilities:curtains2046}:{}),...(id===2392?{deferred:'本场己方出现红黄蓝幕后召唤真实额外精灵虚之彩；额外单位独立行动、200真实伤害与主动下场/死亡消失需第二阶段，不以单次伤害占位。'}:{}),validate(p,m,i){const b=bindings4861.filter(x=>x.id===id&&(m.wikiId??m.id)===x.moveId);if(b.length){if(!b.some(x=>m.hash===x.hash&&m.revision==='seerapi:'+x.hash&&i===x.index&&JSON.stringify(x.args)===JSON.stringify(p)))throw Error('4861 exact source mismatch '+id);return;}if(!old)throw Error('unreviewed effect '+id);return old.validate(p,m,i);},execute(c,p){if(bindings4861.some(x=>x.id===id&&(c.m.wikiId??c.m.id)===x.moveId&&c.m.revision==='seerapi:'+x.hash&&c.effectInstanceIndex===x.index))return handlers4861[id](c,p);if(!old)throw Error('unreviewed effect '+id);return old.execute(c,p);}});}
`;
let p='dist/range-effects.js',t=fs.readFileSync(p,'utf8');let at=t.lastIndexOf('});');if(!t.includes('const bindings4861='))fs.writeFileSync(p,t.slice(0,at)+block+t.slice(at));
p='dist/range-souls.js';t=fs.readFileSync(p,'utf8');at=t.lastIndexOf('});');const soul=`
registry[2046]={name:'涂蝶',sourceHash:'a47ff0b3',partial:true,unimplemented:['Q-4861-001同回合多次变色回复次数','Q-4861-002首次登场顺序与白幕来源','Q-4861-003红幕抗性提升','Q-4861-004黄幕抵挡暴击'],deferred:['真实再次登场与其他队伍成员的幕附效；黑幕再次登场狂暴与失败减伤；虚之彩真实额外精灵生命周期'],traits:{},hooks:{battleStart(c){c.curtainAbilities2046().entry(c);}}};
`;if(!t.includes('registry[2046]='))fs.writeFileSync(p,t.slice(0,at)+soul+t.slice(at));
p='dist/souls.js';t=fs.readFileSync(p,'utf8');const replace=(a,b)=>{assert.equal(t.split(a).length,2,a);t=t.replace(a,b);};
const fields="curtainState2046:()=>s.curtains2046??={schema:1,sides:[null,null],history:[[],[]],changes:[],pendingInitial:false},curtainAbilities2046:()=>E.WIKI.effectsEngine.registry[2391].abilities,firstMoveName2046:()=>s.moveDefinitions[a.moves[0]]?.name??'',";
replace('function initialContext(a,source=s.fighters[1-a.side]){return {','function initialContext(a,source=s.fighters[1-a.side]){return {'+fields);
replace("for(const a of s.fighters)E.SOULS.run('battleStart'","for(const a of s.fighters)if(a.soulId===2046)E.WIKI.effectsEngine.registry[2391].abilities.start({...initialContext(a),a,t:s.fighters[1-a.side],round:1});\n    for(const a of s.fighters)E.SOULS.run('battleStart'");
replace("return {a,t,m,ailmentRoll4853:","return {a,t,m,"+fields+"ailmentRoll4853:");
replace("const entryOnly=entryOperation?.token===entryRemoval1950;if(entryOnly)","const entryOnly=entryOperation?.token===entryRemoval1950;if(!entryOnly&&previous.curtains2046?.pendingInitial)throw Error('Q-4861-002：首次幕附效结算顺序与来源待确认');if(entryOnly)");
replace("function endActionPayload4780(a,t,m,successful=false){","function endActionPayload4780(a,t,m,successful=false){if(used[a.side]&&m.kind!=='item'&&a.hp>0&&on(a,'用招回复失败附沸涌')){const e=a.effects['用招回复失败附沸涌'],before=a.hp;heal(a,a.stats.maxHp/e.denominator,'蓝染用招回复','skill');if(a.hp<=before&&t.hp>0){const c=skillContext(a,t,m),chance=c.statusProbability(e.chance);if(c.random()<chance/100)c.ailment(t,e.status,a,false,false,null,{resolvedProbabilityPercent:chance});}}");
replace("E.SOULS.registry[1948].abilities.endMark(context(f,fs[1-f.side]));s.round++;for(const f of fs){f.soulState.availableRound=s.round;","E.SOULS.registry[1948].abilities.endMark(context(f,fs[1-f.side]));if(!s.finished)for(const f of fs)if(f.soulId===2046)E.WIKI.effectsEngine.registry[2391].abilities.finish(context(f,fs[1-f.side]));s.round++;for(const f of fs){f.soulState.availableRound=s.round;");fs.writeFileSync(p,t);console.log({installed:4861,bindings:bindings.length});
