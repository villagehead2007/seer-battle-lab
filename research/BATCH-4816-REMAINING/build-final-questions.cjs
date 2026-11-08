'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),base=__dirname,batch=JSON.parse(fs.readFileSync(path.join(base,'STATUS.json'))),root=path.resolve(base,'../..'),snapshots=new Map(batch.targets.map(t=>[t.id,JSON.parse(fs.readFileSync(path.join(base,String(t.id),'snapshot.json')))])),byId=new Map(),scope=new Map(),assets=new Map(),link=(label,file)=>`[${label}](<${path.resolve(root,file).replaceAll('\\','/')}>)`;
for(const t of batch.targets){const d=path.join(base,String(t.id)),qf=path.join(d,'questions.json'),config=fs.existsSync(path.join(d,'audit-config.json'))?JSON.parse(fs.readFileSync(path.join(d,'audit-config.json'))):{};let q=fs.existsSync(qf)?JSON.parse(fs.readFileSync(qf)):{};for(const item of q.questions??[])if(!byId.has(item.id)||item.id.startsWith('Q-'+t.id+'-'))byId.set(item.id,{...item,owner:t.id});for(const id of t.questions??[]){if(!scope.has(id))scope.set(id,[]);scope.get(id).push(t.id);const rows=assets.get(id)??[];for(const[k,ids]of Object.entries(config.pendingByKey??{}))if(ids.includes(id)){const[,kind,mid,index]=k.split(':'),s=snapshots.get(t.id);if(kind==='soul'){const soul=s.souls.find(x=>x.id===+mid);if(soul)rows.push({species:t.id,name:'魂印',description:soul.description});}else{const m=s.moves.find(x=>x.id===+mid);if(m)rows.push({species:t.id,name:m.name,description:kind==='skill'?m.effectInstances[+index]?.description:m.description});}}assets.set(id,rows);}}
const dataIds=new Set(['Q-4865-002','Q-4872-002','Q-4947-001','Q-5000-002','Q-4000-005']);
const overrides={
"Q-4903-009":"攻击时把对手正强化视作对应负强化，是否仅用于基础伤害计算？同招按敌方正强化翻倍、反转敌方正强化并复制给自己的词条，读取原等级还是视作负强化后的等级？",
"Q-4921-004":"将对手攻击、特攻最高值计入自身对应属性值，是相加还是替代？最高值按面板还是能力等级修正后的数值？同招把敌方强化视作弱化、自身弱化视作强化时，各按什么数值计算？",
"Q-4909-003":"坚壁强化授予的下回合受击反制，在多段或同回合多次攻击时，是每段、每次完整技能，还是整回合只触发一次？",
"Q-5000-003":"虚无的“两回合若本方先手攻击，使对方技能失效”，仅指物理、特殊攻击，还是也包括属性技能及虚无本身？",
'Q-4875-004':'神惧劫炎调整对手已损失PP时，是否受免疫PP降低、免疫PP清除或PP保留下限保护影响？',
'Q-4888-001':'首回合没有上回合时，魂印及技能的上回合先制比较基准分别怎样取？魂印比较本次在场所有回合时，首回合算全新数值吗？',
'Q-4854-001':'第五技能追加的300点伤害，具体属于固定、百分比、真实还是其他伤害？',
'Q-4853-006':'先出手后的等量回复遇残血击杀或保留1体力时，按完整结算红伤还是实际扣血回复？',
'Q-4870-003':'使用“岩石之躯”后的受击监听持续到什么时候，重复使用怎样刷新？遇吸强、反转、清强失败或已命中零伤时，哪些算符合触发条件？',
'Q-4871-001':'“数量加50并除以概率”是先加50再除，还是先算50除以概率再加原数量？原数量1、概率50%时分别是102和101；概率为零或结果有小数时怎样处理？',
'Q-4898-003':'“本回合未打出暴击”是在本次攻击结束时判断，还是统计整回合所有攻击后判断？同回合一招暴击、一招没暴击时，PP在什么时候恢复或扣除？',
'Q-4902-001':'按体力计算出的随机PP范围有小数时，怎样取整并确定端点？下界高于封顶10的上界时怎样处理？正常整数范围是否包含两端、每招独立等概率抽取？',
'Q-4903-003':'按已确认的红伤范围，这项一半伤害的回复按完整结算伤害还是实际扣血计算，并在逐次受伤、用招后、战斗阶段末或回合末哪个时点回复？',
'Q-4911-001':'每170速度对应一次冰封额度，是否向下取整？速度计算是否含能力等级，额度何时随速度变化，冰封被免疫是否仍消费次数？',
'Q-4921-002':'临时上限的封顶限制的是新增量，还是增加后的最大体力总额？禁疗或回复倍率怎样影响可转成上限的溢出量？',
'Q-4921-003':'“自身最优系别”是从自身当前属性及子属性中选，还是从全部属性中选？这两处若不同，请分别说明。',
'Q-4946-001':'未触发麻痹后吸取或汲取的70%，以对手当前体力还是最大体力计算？',
'Q-4946-002':'多个减伤叠加时，30%上限分别限制每项还是限制合计；与无视部分减伤并存时先处理哪一步；养成抗性、套装减伤是否也纳入？',
'Q-4946-004':'辰律当回合结束后是否保留点数，同回合获得多点时逐点触发还是只触发一次？额外视为点亮的雷辰是否占槽、参与连线并能被末位雷辰消耗？',
'Q-4995-002':'未造成红伤时附加的防御值固定伤害，是否计入防御能力等级的强化或弱化？',
'Q-4995-005':'第五技能击败后封锁“对手下回合攻击”，指原对手复活后的攻击，还是对方下一只精灵的攻击？',
'Q-5000-001':'虚无的说明分别出现“技能伤害”和“攻击伤害”。免疫是否还覆盖属性附伤、固定、百分比和真实伤害？',
'Q-4000-001':'上回合受到多次攻击、对应攻击值不同时，选哪一次攻击值计算冰系附伤翻倍？',
'Q-4000-002':'自身先制为负数时，先制翻倍这一段按零层、反向减半，还是其他方式计算？',
'Q-4000-003':'每260点特攻使威力翻倍时，特攻值是否计入能力等级？',
'Q-4000-004':'因MISS、失明或闪避而无效后，重新计算的伤害直接生效，还是仍需再判断命中？',
'Q-4951-001':'获得临时体力上限所用的速度，是速度面板，还是含能力等级修正后的速度？',
'Q-4951-002':'每次攻击获得的临时上限独立叠加，还是刷新本魂印原先授予的数额？',
'Q-4956-001':'谋死A/B/C所说的技能首字，是否按中文第一个字的拼音首字母判断，例如暗祓A、白夜B、残秽C？具体包括哪些技能？',
'Q-4956-002':'“视为致死伤害”只让致死条件成立而不改伤害，还是会改变实际伤害数值？完全免伤或被盾挡完时，还算视为致死吗？',
'Q-4956-003':'反馈异常后，自身异常保留还是转移清除？对手免疫该异常时，自身是否仍解除？',
'Q-4963-001':'同回合受到两次500红伤，是每次各减300、共受400，还是整回合只减300、共受700？',
'Q-4963-002':'同时有其他攻击免疫时，魂印是否仍算免疫成功并授盾？若有次数免疫，先消费哪份？'
};
const commonTitles={'Q-4854-002':'一回合内多次限伤','Q-4903-009':'把正强化视为负强化的读取范围','Q-4940-001':'双方没有盾罩时的相等判断','Q-4921-003':'自身最优系别的候选范围'};
function clean(text){let s=String(text??'').trim();const last=s.lastIndexOf('？');if(last>=0)s=s.slice(0,last+1);s=s.replace(/\d{5}\/[a-f\d]{7,8}(?:\/(?:index)?\d+)?/gi,'对应技能').replace(/\/[a-f\d]{7,8}/gi,'').replace(/(?:效果|魂印|术语)(?:ID)?\s*\d{3,4}/g,m=>m.replace(/(?:ID)?\s*\d{3,4}/,'' )).replace(/(第五(?:技能)?|技能)\d{3,5}/g,'$1').replace(/^\d{3,5}(?=[“「])/,'').replace(/\b(?:index|实例)\s*\d+/g,'').replace(/\s+/g,' ');return s;}
const stop=new Set(['自身','对手','技能','回合','效果','状态','触发','是否','体力','当前','造成','本次','受到','没有','明确','如何','还是','如果']);
function score(a,b){const chunks=[...String(a).matchAll(/[\u4e00-\u9fff]{2,}/g)].flatMap(x=>Array.from({length:x[0].length-1},(_,i)=>x[0].slice(i,i+2))).filter(x=>!stop.has(x));return new Set(chunks.filter(x=>b.includes(x))).size;}
function context(id,q){let rows=assets.get(id)??[],ids=scope.get(id)??[q.owner];if(!rows.length){const s=snapshots.get(q.owner),src=q.source??{},encoded=JSON.stringify(src),soulIds=[...encoded.matchAll(/soulmark\/(\d+)/g)].map(m=>+m[1]);if(typeof src.soul==='number')soulIds.push(src.soul);if(typeof src.soulId==='number')soulIds.push(src.soulId);for(const soul of s.souls)if(soulIds.includes(soul.id))rows.push({species:q.owner,name:'魂印',description:soul.description});const moveIds=[...encoded.matchAll(/skill\/(\d+)/g)].map(m=>+m[1]);for(const k of['moveId','move','skillId','skill'])if(typeof src[k]==='number')moveIds.push(src[k]);for(const m of s.moves)if(moveIds.includes(m.id))rows.push({species:q.owner,name:m.name,description:Number.isInteger(src.index)?m.effectInstances[src.index]?.description:m.description});for(const m of s.moves)if(q.question?.includes(m.name))rows.push({species:q.owner,name:m.name,description:m.description});if(!rows.length&&/魂印/.test(q.question??''))for(const soul of s.souls)rows.push({species:q.owner,name:'魂印',description:soul.description});if(!rows.length)rows=s.moves.filter(m=>m.fifth).map(m=>({species:q.owner,name:m.name,description:m.description}));}
 const names=[...new Set(rows.map(x=>x.name))],title=commonTitles[id]?`共用规则 · ${commonTitles[id]}`:`${snapshots.get(q.owner).name} · ${names.join('／')||'当前效果'}`;
 const candidates=rows.flatMap(x=>(x.description??'').split(/[|；]/)).map(x=>x.trim()).filter(x=>x&&!/boss无效/.test(x));candidates.sort((a,b)=>score(q.question??'',b)-score(q.question??'',a));let background=candidates[0]??'';if(background.length>90)background=background.slice(0,90)+'…';return {title,background,range:[...new Set(ids)].map(id=>snapshots.get(id).name),assets:rows};}
const questions=[],data=[];for(const[id,ids]of scope){const q=byId.get(id);if(!q)throw Error('missing question body '+id);if(/resolved/.test(q.status??''))continue;const ctx=context(id,q);if(dataIds.has(id)){data.push({key:id,id,owner:q.owner,...ctx,source:'research/BATCH-4816-REMAINING/'+q.owner+'/questions.json'});continue;}questions.push({key:id,id,owner:q.owner,...ctx,question:overrides[id]??clean(q.question),source:'research/BATCH-4816-REMAINING/'+q.owner+'/questions.json'});if(id==='Q-4946-001')questions.push({key:id+'-healing',id:id+'（回复基数补充）',owner:4946,title:'共用规则 · 吸取、汲取的回复基数',background:'雷伊会按比例吸取或汲取；薇尔诗的自由之荣光按恢复PP量汲取体力。',range:[snapshots.get(4946).name,snapshots.get(4000).name],question:'目标残血、护盾或免伤使几个数值不同时，雷伊的普通吸取、真实汲取和薇尔诗的真实汲取，回复分别按理论量、完整结算伤害还是实际扣血？',source:'research/BATCH-4816-REMAINING/4946/questions.json'});}
questions.push({key:'COMMON-TEMP-HP-001',id:'Q-4921-002／Q-4951-002（共同部分）',owner:4951,title:'共用规则 · 临时体力上限与当前体力',background:'天堂极龙兽会把溢出回复转为临时上限；维德弗尼尔会按速度获得临时上限。',range:[snapshots.get(4921).name,snapshots.get(4951).name],question:'这两处增加临时上限时，当前体力各保持不变，还是同步增加相同数值？若规则不同，请分别说明。',source:'research/BATCH-4816-REMAINING/4951/questions.json'});

const glossary=JSON.parse(fs.readFileSync(path.join(base,'COMMON-GLOSSARY-SOURCE.json'))).entries;
const mechanics={'Q-4816-001':'赛博共振器','Q-4853-001':'眷颂','Q-4853-002':'破黯穿穹','Q-4853-003':'曝','Q-4853-007':'永沐','Q-4861-002':'幕','Q-4861-003':'红幕','Q-4861-004':'黄幕','Q-4871-001':'风龙结','Q-4872-001':'怀生','Q-4875-003':'神惧劫炎','Q-4875-004':'神惧劫炎','Q-4895-001':'音符','Q-4895-002':'中音','Q-4912-002':'渐烬','Q-4912-003':'渐烬','Q-4915-002':'事象观测','Q-4915-003':'事象观测','Q-4930-001':'五行印记','Q-4930-002':'金之肃革','Q-4930-004':'五行印记','Q-4930-005':'木之伸曲','Q-4933-004':'邪气'};
const forceSoul=new Set(['Q-4823-001','Q-4830-001','Q-4834-001','Q-4857-001','Q-4870-001','Q-4870-002','Q-4902-002','Q-4903-002','Q-4903-005','Q-4921-002','Q-4933-001']);
for(const q of questions){if(forceSoul.has(q.key)||mechanics[q.key]){const s=snapshots.get(q.owner),term=mechanics[q.key];q.title=s.name+' · '+(q.key==='Q-4816-001'?'赛博共振器':'魂印'+(term?'（'+term+'）':''));let candidates=s.souls.flatMap(x=>x.description.split(/[|；]/));let entry=term&&glossary.find(x=>x.name===term);if(entry)candidates=[entry.desc];candidates.sort((a,b)=>score(q.question,b)-score(q.question,a));q.background=(candidates[0]??q.background).slice(0,110);if((candidates[0]??'').length>110)q.background+='…';}
if(q.key==='Q-4816-001')q.background='赛博共振器开启时，场上伊芙有技能PP为零，会恢复该技能的PP并反转对手强化。';
if(q.key==='Q-4834-002')q.question='本招先清除对手强化；若清完后已无强化，是否还会消除回合效果，还是只有出招前就无强化才会消除？';
if(q.key==='Q-4830-002')q.question='反弹的百分伤按本次攻击经过防御、减免后，自己免疫前的伤害计算吗？护盾或其他免伤在取基数之前还是之后处理？';
if(q.key==='Q-4870-001')q.question='PP均分出现小数或单槽上限不足时，余数怎样分配？这次均分算直接设置，还是回复和削减，会不会受PP保护及回复封锁影响？';
if(q.key==='Q-4872-001')q.question='怀生在使用技能后附加的弱化类异常，是给自身还是当前对手？';
if(q.key==='Q-4875-001')q.question='每种非烧伤异常会让回复减少多少比例？双方同名异常是否分别计数，总比例最多多少？';
if(q.key==='Q-4875-003')q.background='神惧劫炎在自己先出手时，持续回合数减一，并让对手烧伤回合数加一。';
if(q.key==='Q-4875-004')q.background='神惧劫炎会在回合结束后，把对手对应技能已损失的PP调整为自己已损失的数值。';
if(q.key==='Q-4946-001'){q.title=snapshots.get(4946).name+' · 魂印（七成吸取）';q.range=[snapshots.get(4946).name];q.background='未触发麻痹时，会按对手体力的70%吸取或汲取。';}
if(q.key==='Q-4871-003'){q.title='共用规则 · 反弹异常的执行概率';q.range=[snapshots.get(4871).name,snapshots.get(4853).name];}
if(q.key==='Q-4853-004')q.title=snapshots.get(4853).name+' · 魂印／合奏·常昼大诰';
if(q.key==='Q-4912-004')q.title=snapshots.get(4912).name+' · 魂印／告天堂的残灰';
}

const conciseBackgrounds={
  "Q-4823-001": "对手每次使用攻击技能时，自身冻伤的剩余回合数减半。",
  "Q-4834-003": "魂印的无强化分支会在回合结束时恢复自身体力。",
  "Q-4840-001": "魂印在回合初满足全能力提升条件后，赋予断回合、吸取强化的效果。",
  "Q-4853-002": "破黯穿穹消耗所有唱词，每句不同唱词附加50点远古·光系伤害。",
  "Q-4854-002": "本批多处效果限制每回合被攻击所受的伤害，但数值、持续时间各不相同。",
  "Q-4865-001": "时空交错包含双方承受1000点固定伤害并为另一方等量回复的分支。",
  "Q-4871-001": "对手执行异常附加后，风龙结按“数量加50并除以附加概率”增加。",
  "Q-4871-003": "异常被反弹时，会由反弹方执行异常附加；两只精灵还会读取执行概率。",
  "Q-4872-001": "怀生状态包含使用技能后附加弱化类异常的效果。",
  "Q-4875-001": "技能解除双方异常后，按其中非烧伤异常的个数降低对手回复。",
  "Q-4888-002": "该招无视对手能力提升，无视成功则消除对手回合效果。",
  "Q-4888-003": "该招按上回合每级先制增加本招先制，最高增加3级。",
  "Q-4895-003": "技能恢复自身技能PP，并按每恢复所有技能7点触发对手全属性下降。",
  "Q-4898-003": "技能包含按本回合是否打出暴击恢复或扣除PP的分支。",
  "Q-4902-001": "魂印在回合结束后，按体力对应的区间为每招随机设置PP。",
  "Q-4902-002": "魂印为每招随机设置PP，抽到的数值可能超过该招原PP上限。",
  "Q-4903-003": "该效果会按受到伤害的一半恢复体力。",
  "Q-4903-006": "第五技能按双方第五技能的PP差抽取异常，并有未清除回合效果的补偿。",
  "Q-4903-007": "第五技能会按双方第五技能PP差决定随机异常的次数。",
  "Q-4903-008": "该效果按对手异常剩余回合，每回合吸取60点体力。",
  "Q-4909-001": "魂印在战斗阶段结束时，将防御、特防等级转为攻击、特攻等级。",
  "Q-4909-002": "满足自身处于能力提升状态时，魂印转化两防能力等级。",
  "Q-4912-002": "渐烬包含受到致死伤害时消耗层数、主动回血及授予天烬海的分支。",
  "Q-4912-003": "渐烬的致死回复可能与其他保命或重生效果同时满足条件。",
  "Q-4921-001": "魂印阶段末回复最大体力的四分之一，“上述效果每满足过1次”再增加四分之一。",
  "Q-4921-002": "魂印会把溢出回复转成临时体力上限，并设有封顶。",
  "Q-4921-003": "天堂极龙兽与珀萝都有以自身最优系别造成伤害的效果。",
  "Q-4921-004": "该招将对手攻击、特攻中的最高值计入自身对应属性值。",
  "Q-4933-004": "邪气在回合初消耗法之意念，获得回血和下次攻击附伤。",
  "Q-4946-002": "魂印在对手无强化时，把对手的减伤比例限制为不超过30%。",
  "Q-4946-003": "魂印包含获得、转化、点亮雷辰以及按连线消耗雷辰的机制。",
  "Q-4946-004": "辰律、雷辰机制包含点数增加和额外视为点亮的分支。",
  "Q-4947-002": "不武会在获得的当回合结束时执行清除及害怕效果，并与武道相互消除。",
  "Q-4956-001": "谋死A、B、C分别按技能首字为A、B、C判断。",
  "Q-4956-002": "剧情状态中的谋死效果可让符合条件的伤害“视为致死伤害”。",
  "Q-4956-003": "魂印会在符合条件时向对手反馈自身异常。"
};
for(const q of questions){if(conciseBackgrounds[q.key])q.background=conciseBackgrounds[q.key];q.background=q.background.replace(/\[\/?color[^\]]*\]/g,'');q.question=q.question.replace(/(?:2436|2476|2283|2524|1767|2171|1061|1874|715)(?:中)?/g,'');}

if(new Set(questions.map(q=>q.key)).size!==questions.length)throw Error('duplicate human question key');
let md='# 本批待答问题 · 最终精简版\n\n固定范围52只，按正式名单位置整理。共同问题只列一次并标明范围；原填写文档及原始资料保留。\n\n请直接填“我的回答”。新回答不会未经通知自动实施。资料自身的参数冲突单列在文末，不需要你猜参数。\n\n“完整结算伤害”与“实际扣血”分开：剩200体力受到800结算伤害时，两者分别是800和200。\n\n';
for(let i=0;i<questions.length;i++){const q=questions[i];md+=`## ${i+1}. ${q.title}\n\n`;if(q.range.length>1)md+='适用：'+q.range.join('、')+'。\n\n';if(q.background)md+='背景：'+(q.background.endsWith('。')?q.background:q.background+'。')+'\n\n';md+=q.question+'\n\n我的回答：\n\n追溯：'+q.id+'；'+link('来源与核查记录',q.source)+'。\n\n';}
md+='## 资料待核查（无需作答）\n\n以下'+data.length+'项属于来源参数与说明不一致，等待可靠资料补足，不要求你猜程序参数。其已知独立分支和原始资料继续保留，未冒充完整实现。\n\n';
const descriptions={'Q-4865-002':'技能说明只定义三项信息，实际记录有四项，最后一项的含义缺失。','Q-4872-002':'说明不需要额外数值，实际记录却多出一个数值，尚不能确定是否影响行为。','Q-4947-001':'击败后恢复体力和PP的说明没有数值项，实际记录另带一个数值，含义未确认。','Q-5000-002':'技能说明只定义一项信息，实际记录有两项，第二项含义缺失。','Q-4000-005':'技能说明只定义五项信息，实际记录有七项，额外两项含义缺失。'};
for(const q of data)md+='### '+q.title+'\n\n'+descriptions[q.id]+'\n\n追溯：'+q.id+'；'+link('技术证据',q.source)+'。\n\n';
md+='## 已有答案不再重复提问\n\n雷·神天明闪的一回合增伤已按旧统一时长回答落实为授予当回合生效；充电的已确认下回合例外保留。技能复制、多目标字段、汲取伤害类型、随机异常池、盾罩刷新等已确认规则不重复出题。\n\n'+link('逐只状态、测试、来源与延期记录','research/BATCH-4816-REMAINING/FINAL-TECHNICAL-REPORT.md')+'。\n';
const output=path.join(base,'待答问题-最终精简版.md');if(fs.existsSync(output)){const prior=JSON.parse(fs.readFileSync(path.join(base,'FINAL-QUESTION-MANIFEST.json'))),current=fs.readFileSync(output);if(crypto.createHash('sha256').update(current).digest('hex')!==prior.sha256)throw Error('answer document changed externally; refusing overwrite');const backup=path.join(base,'QUESTION-DRAFT-'+prior.sha256.slice(0,12)+'.archive.md');if(!fs.existsSync(backup))fs.writeFileSync(backup,current,{flag:'wx'});}fs.writeFileSync(output,md);const manifest={at:new Date().toISOString(),output:path.relative(root,output),sha256:crypto.createHash('sha256').update(md).digest('hex'),activeTechnicalIds:scope.size,gameplayQuestions:questions.length,sourceProblems:data.length,questions,data,originalAnswerDocument:'research/BATCH-4816-REMAINING/待答问题.md',originalUntouchedByThisBuilder:true};fs.writeFileSync(path.join(base,'FINAL-QUESTION-MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');console.log({gameplayQuestions:questions.length,sourceProblems:data.length,activeTechnicalIds:scope.size,bytes:Buffer.byteLength(md),output});
