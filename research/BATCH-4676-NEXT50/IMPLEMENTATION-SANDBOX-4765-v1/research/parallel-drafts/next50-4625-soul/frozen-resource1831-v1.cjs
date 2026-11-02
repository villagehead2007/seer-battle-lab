'use strict';
const lifeKinds1831=['lost','return'];
function marks1831(f){return f.soulState.lifeMarks1831??={};}
function has1831(c,f,kind){if(!lifeKinds1831.includes(kind))throw Error('1831 mark kind');const x=marks1831(f)[kind];return !!x&&x.start<=c.round&&x.end>=c.round;}
function grant1831(c,f,kind,n=3){if(!Number.isInteger(n)||n<1)throw Error('1831 duration');const old=has1831(c,f,kind)?marks1831(f)[kind]:null,end=c.round+n-1;if(old&&old.end!==end)throw Error('Q-N50-4511-006：1831已有失命/回命资源重授期限待确认');const x=old??{start:c.round,end,sourceSide:c.a.side};marks1831(f)[kind]=x;return {...x};}
function removed1831(c,f,kind,reason){(f.soulState.lifeRemoved1831??=[]).push({round:c.round,kind,reason});}
function transfer1831(c,from,to,kind){if(!has1831(c,from,kind))return false;const x=marks1831(from)[kind],old=has1831(c,to,kind)?marks1831(to)[kind]:null;if(old&&old.end!==x.end)throw Error('Q-N50-4511-006：1831转移与既存同名资源重合待确认');delete marks1831(from)[kind];removed1831(c,from,kind,'transfer');marks1831(to)[kind]={...x};return true;}
function reduce1831(c,f,kind,n=1){if(!has1831(c,f,kind))return false;const x=marks1831(f)[kind];x.end-=n;if(x.end<c.round){delete marks1831(f)[kind];removed1831(c,f,kind,'reduced-to-zero');}return true;}
function remove1831(c,f,kind){if(!has1831(c,f,kind))return false;delete marks1831(f)[kind];removed1831(c,f,kind,'qualified-removal');return true;}
function entry1831(c){if(c.a.hp>=c.t.hp||c.a.hp<=0)return false;for(const [f,k]of[[c.a,'lost'],[c.t,'return']])if(has1831(c,f,k)&&marks1831(f)[k].end!==c.round+2)throw Error('Q-N50-4511-006：1831登场同名资源重授期限待确认');grant1831(c,c.a,'lost',3);grant1831(c,c.t,'return',3);return true;}
function healing1831(c,p={}){const lost=has1831(c,c.a,'lost'),ret=has1831(c,c.a,'return');if(lost&&ret){const policy=p.policy??c.a.soulState.qualifiedLifeHealing1831;if(!policy)throw Error('Q-N50-4625-002：失命与回命同时存在的回复加乘关系待确认');if(!['add','multiply'].includes(policy))throw Error('1831 healing policy');return policy==='add'?1:0;}return lost?0:ret?2:1;}
module.exports={name:'伏尔格安',sourceHash:'ee3314d',partial:true,unimplemented:['1831完整调度仍在独占编写，非最终冻结'],traits:{},abilities:{hasMark:has1831,grantMark:grant1831,transferMark:transfer1831,reduceMark:reduce1831,qualifiedRemoveMark:remove1831,invokeEntry:entry1831,healingFactor:healing1831},hooks:{}};
