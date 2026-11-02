'use strict';
// Builds passive, evidence-backed data. No rule here executes a battle effect.
const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const sources=require('../data/statuses/sources.json');
const classification=require('./status-classification.cjs');
const enumRecord=sources.records.filter(x=>x.key==='status-enum').at(-1);
const wikiRecord=sources.records.filter(x=>x.key==='wiki-mechanics').at(-1);
const page=Object.values(wikiRecord.data.query.pages).find(x=>x.title==='对战机制');
const revision=page.revisions[0],text=revision.slots.main['*'];
const start=text.indexOf('|+ 异常状态'),end=text.indexOf('|}',start);assert.ok(start>=0&&end>start);
const table=text.slice(start,end),rows=[];let current=null,shared=null,remaining=0;
for(const rawLine of table.split(/\r?\n/)){const line=rawLine.trim();if(line.startsWith('! ')&&!line.includes('!!')){const name=line.slice(2).trim();current={name,description:null};rows.push(current);if(remaining>0){current.description=shared;remaining--;}}
else if(line.startsWith('| ')&&current){const span=line.match(/^\| rowspan=(\d+)\|(.+)$/);current.description=span?span[2]:line.slice(2);if(span){remaining=Number(span[1])-1;shared=span[2];}}}
assert.ok(rows.length>30);assert.ok(rows.every(x=>x.description));
const wikiSource={url:'https://wiki.biligame.com/seer/index.php?oldid='+revision.revid,pageUrl:'https://wiki.biligame.com/seer/对战机制',revision:revision.revid,revisionTimestamp:revision.timestamp,hash:sha(text),hashAlgorithm:'sha256 of revision wikitext (local content digest)',loadedAt:wikiRecord.loadedAt,origin:wikiRecord.origin,file:'data/statuses/sources.json',pointer:'/records/'+sources.records.indexOf(wikiRecord)+'/data/query/pages/'+page.pageid+'/revisions/0/slots/main/*'};
const enumSource={url:enumRecord.url,revision:null,hash:enumRecord.data.hash,loadedAt:enumRecord.loadedAt,origin:enumRecord.origin,file:'data/statuses/sources.json',pointer:'/records/'+sources.records.indexOf(enumRecord)+'/data/infos'};
const evidence=(name,quote)=>{const row=rows.find(x=>x.name===name);assert.ok(row&&row.description.includes(quote),name+': '+quote);return {source:'wiki-mechanics',statusName:name,quote};};
const facts={};function add(name,field,quote,from=name,scope='state-rule'){(facts[name]??={})[field]??=[];facts[name][field].push({text:quote,scope,evidence:evidence(from,quote)});}
// Explicitly reviewed source phrases, not rules guessed from state names.
for(const n of ['中毒','冻伤','烧伤','寄生'])add(n,'damageRules','每回合都会扣除等同于最大体力的1/8的体力');
add('烧伤','damageRules','攻击技能的威力会减少50%');add('流血','damageRules','每回合都会扣除80点体力');
add('混乱','damageRules','每回合都会有5%的概率扣除50点体力');add('混乱','behaviorRules','攻击技能的命中率减少80%');
add('衰弱','damageRules','若衰弱的回合数为1/2/3/4/5及以上，则受到的攻击伤害额外提升25%/50%/100%/250%/500%');
add('寄生','interactions','同时对手会恢复扣除量的体力');
for(const n of ['麻痹','疲惫','害怕','石化','睡眠','感染','冰封','瘫痪','焚烬','诅咒','神游','空定'])add(n,'behaviorRules','精灵无法行动');
add('睡眠','clearConditions','对手使用攻击技能且未MISS时解除');
const transitions=[['感染','中毒','感染结束后会转化为中毒、攻击、特攻等级-1'],['冰封','冻伤','冰封结束后会转化为冻伤、速度等级-1'],['易燃','烧伤','受到火系攻击后转化为烧伤'],['焚烬','烧伤','焚烬结束后会转化为烧伤、命中等级-1'],['神游','失神','神游结束后会转化为失神'],['超频','瘫痪','超频结束后会转化为1~2回合的瘫痪'],['空定','沉默','空定结束后会转化为2回合沉默'],['渐冻','冰封','渐冻结束后会转化为3回合冰封']];
for(const [from,to,quote]of transitions){add(from,'interactions',quote);add(to,'triggerMethods',quote,from,'known-acquisition-route-only');if(['超频','空定','渐冻'].includes(from))add(to,'durationRules',quote,from,'duration-only-for-this-transition');}
const curse='诅咒结束后会转化为烈焰诅咒、致命诅咒、虚弱诅咒中的一个';add('诅咒','interactions',curse);for(const n of ['烈焰诅咒','致命诅咒','虚弱诅咒'])add(n,'triggerMethods',curse,'诅咒','known-acquisition-route-only');
add('束缚','behaviorRules','先制等级始终视为0');add('束缚','damageRules','束缚解除时受到自身最大体力1/8的百分比伤害');
add('失神','behaviorRules','使用属性技能50%无效');add('瘫痪','behaviorRules','精灵无法行动、主动切换');
add('失明','behaviorRules','精灵使用攻击技能50%MISS，若为必中技能则50%命中效果失效且无法造成攻击伤害');
add('易燃','behaviorRules','攻击技能命中率降低30%');add('狂暴','damageRules','造成的攻击伤害翻倍');
for(const n of ['烈焰诅咒','沉默'])add(n,'damageRules','每回合受到最大体力1/8的百分比伤害');
add('致命诅咒','damageRules','受到的攻击伤害提升50%');add('虚弱诅咒','damageRules','造成的攻击伤害降低50%');
add('沉默','behaviorRules','第五技能无效');add('臣服','damageRules','无法对对手造成攻击伤害、固定伤害、百分比伤害');
add('凝滞','behaviorRules','精灵无法切换');add('凝滞','immunityConditions','免疫受到的控制类异常状态','凝滞','immunity-granted-while-this-state-is-active');add('凝滞','interactions','免疫受到的控制类异常状态');
add('星赐','damageRules','造成的攻击伤害提升30%');add('星赐','behaviorRules','每回合结束时恢复2点PP值');
add('星哲','damageRules','造成的固定伤害、百分比伤害提升30%');add('星哲','behaviorRules','每回合结束时恢复最大体力的1/4');
add('超频','behaviorRules','技能先制+1且行动开始时恢复所选择技能的全部PP值');
add('沸涌','damageRules','受到的攻击伤害至少为其最大体力的30%，对手打出致命一击时效果提升至50%');
add('砥砺','behaviorRules','受到真实伤害后若本回合未执行过附加异常状态的效果则增加此伤害值80%的体力');
add('星赎','behaviorRules','体力恢复效果提升30%');add('星赎','interactions','每回合结束时所有非限制类异常状态的回合数+1');
add('狂信','behaviorRules','对手为信仰对象时自身无法行动');add('狂信','interactions','进入狂信状态时，若自身没有信仰对象，则本次狂信状态的来源成为自身信仰对象');
add('雷解','damageRules','自身造成攻击伤害后，附加伤害值60%的真实伤害');
add('魇昧','behaviorRules','场上的异常状态，能力等级状态对己方均展示为无回合数的魇昧');
const fieldNames=['triggerMethods','durationRules','damageRules','immunityConditions','clearConditions','interactions','behaviorRules'];
const enumNames=enumRecord.data.infos,records=enumNames.flatMap((name,id)=>{if(!name||name==='XX')return [];const row=rows.find(x=>x.name===name);return [{id,idNamespace:'seerapi.skill_effect_param/1.infos.index',name,description:row?.description??null,sourceRefs:row?['seerapi-status-enum','wiki-mechanics']:['seerapi-status-enum'],sourceUrls:row?[enumSource.url,wikiSource.url]:[enumSource.url],revision:row?revision.revid:null,hashes:{enum:enumRecord.data.hash,wiki:row?wikiSource.hash:null},idEvidence:{source:'seerapi-status-enum',arrayIndex:id,rawValue:name},descriptionEvidence:row?evidence(name,row.description):null,category:row?.description.match(/^(弱化类|控制类|附属类)异常状态/)?.[1]??null,explicitRestricted:/^(?:弱化类|控制类|附属类)异常状态，限制类异常状态(?:，|$)/.test(row?.description??'')?{value:true,evidence:evidence(name,'限制类异常状态')}:null,...Object.fromEntries(fieldNames.map(field=>[field,facts[name]?.[field]??null])),defaultDurationTurns:null,unknownFields:fieldNames.filter(field=>!facts[name]?.[field]),completeness:row?'wiki-description-imported-rules-partial':'name-and-enum-only'}];});
const unmapped=rows.filter(x=>!enumNames.includes(x.name));assert.equal(unmapped.length,0,'Wiki names without enum IDs must be reviewed, not assigned invented IDs');
const database={schemaVersion:1,kind:'seer-web-status-reference-data',runtimeEnabled:false,sources:{'seerapi-status-enum':enumSource,'wiki-mechanics':wikiSource},semantics:{id:'SeerAPI异常参数枚举数组的零基索引；与技能效果ID、魂印ID分属不同命名空间。',null:'没有在所引来源中确认；不表示零、无效果、无免疫或没有清除方法。',rules:'只保存原文证据片段，非可执行处理器；已列触发方式不代表穷尽所有技能/魂印。',immunityConditions:'scope区分状态赋予的免疫与此状态自身不能被施加的条件，禁止混用。',duration:'initial/default duration remains null; conditional durations are scoped to the cited transition.',taxonomy:'未标限制类不自动等于已确认非限制类，更不构成2074候选池。'},summary:{enumSlots:enumNames.length,namedStatuses:records.length,wikiTableStatuses:rows.length,enumOnly:records.filter(x=>!x.description).map(x=>x.name),reservedSlots:enumNames.map((name,id)=>({id,rawValue:name})).filter(x=>!x.rawValue||x.rawValue==='XX')},records,sourceTableRows:rows,missingEvidence:['绝大多数状态的初始持续回合、施加条件和完整免疫/清除条件未在本表说明。','到期转化后的持续时间仅有部分明确值；未知值不得沿用引擎随机1~3回合。','状态本体定义不等于任意随机效果的候选集合。','山神守护仅有枚举名，未找到本表描述。']};
database.classificationSchemaVersion=1;
database.classificationSemantics=classification.semantics;
for(const record of records)Object.assign(record,classification.classify(record,wikiSource));
fs.writeFileSync('data/statuses/statuses.json',JSON.stringify(database,null,2)+'\n');console.log(database.summary);
