'use strict';
const fs=require('fs'),crypto=require('crypto'),assert=require('assert/strict'),db=require('../data/statuses/statuses.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const files=fs.readdirSync('dist').filter(x=>x.endsWith('.js')).map(x=>'dist/'+x);
const code=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8').split(/\r?\n/)]));
function refs(file,needle){return code[file].flatMap((text,i)=>text.includes(needle)&&!text.includes('/*META*/')?[{file,line:i+1,text}]:[]);}
const core={};function implemented(names,observation,needle){for(const name of names){core[name]??=[];const evidence=refs('dist/souls.js',needle);assert.ok(evidence.length,needle);core[name].push({observation,evidence});}}
implemented(['麻痹','疲惫','害怕','睡眠','石化','冰封','瘫痪','焚烬','神游','诅咒','感染'],'受控制跳过行动，不消耗PP。','受控制无法行动');
implemented(['中毒','烧伤','冻伤'],'存活对局回合末按最大体力1/8调用percent伤害。',"for(const k of ['中毒','烧伤','冻伤'])");
implemented(['寄生'],'回合末扣最大体力1/8并回复对手实际扣血量。',"f.ailments['寄生']");
implemented(['流血'],'在对手行动流程内扣80点fixed伤害；不据此认证Wiki每回合的准确时点。',"t.ailments['流血']");
implemented(['混乱'],'攻击命中乘0.2，回合末5%调用50点fixed伤害。',"a.ailments['混乱']");implemented(['混乱'],'5%扣血分支。',"f.ailments['混乱']");
implemented(['失明'],'攻击技能50%判定失明。',"a.ailments['失明']");
implemented(['狂暴'],'攻击伤害倍率乘2。',"a.ailments['狂暴']");
implemented(['睡眠'],'在攻击伤害流程中删除睡眠，具体边界仍需逐项核对。',"delete t.ailments['睡眠']");
implemented(['烈焰诅咒'],'回合末最大体力1/8百分比伤害。',"f.ailments['烈焰诅咒']");
implemented(['致命诅咒','虚弱诅咒'],'攻击伤害倍率分别乘1.5/0.5。',"a.ailments['虚弱诅咒']");
implemented(['星哲'],'固定/百分比伤害乘1.3，并在回合末恢复最大体力1/4。',"a.ailments['星哲']");implemented(['星哲'],'回合末回复分支。',"f.ailments['星哲']");
implemented(['感染','焚烬','诅咒','神游','渐冻'],'到期时有转化分支；其中感染/诅咒直接写入目标状态，焚烬/神游/渐冻走施加入口。',"if(k==='感染'");
const explicitGaps={
'烧伤':['已有扣血，未找到状态本身导致攻击技能威力减少50%的处理。'],
'冰封':['已有无法行动，未找到结束后转为冻伤及速度-1的处理。'],
'瘫痪':['只有无法行动；主动切换限制需要未来换宠系统，本次不实现。'],
'神游':['转为失神已有分支，但失神的属性技能50%无效未找到。'],
'渐冻':['转为3回合冰封已有分支，但冰封结束后的后续规则缺失。'],
'感染':['当前转化中毒硬编码后续2回合；Wiki本表未给出中毒持续时间。'],
'焚烬':['当前转化烧伤传2回合；Wiki本表未给出烧伤持续时间。'],
'诅咒':['当前随机三选一并写后续2回合；本表未给选择权重与转化后的持续时间。'],
'山神守护':['只有SeerAPI枚举名；缺少状态本体规则来源，不能直接实现。']};
const mapLine=code['dist/range-effects.js'].find(x=>x.startsWith('const ailments='));
const registryMap=[...mapLine.matchAll(/(\d+):'([^']+)'/g)].map(m=>({id:Number(m[1]),name:m[2]}));
const resistanceLine=code['dist/equipment.js'].find(x=>x.includes('const AILMENTS='));
const resistanceNames=[...resistanceLine.matchAll(/'([^']+)'/g)].map(m=>m[1]);
const tests=fs.readdirSync('tests').filter(x=>x.endsWith('.test.cjs')&&x!=='status-database.test.cjs').map(x=>({file:'tests/'+x,text:fs.readFileSync('tests/'+x,'utf8')}));
const records=db.records.map(row=>({id:row.id,name:row.name,assessment:core[row.name]?'behavior-observed-not-completeness-certified':'no-state-specific-behavior-found',observedBehavior:core[row.name]??[],knownGaps:explicitGaps[row.name]??(core[row.name]?['本次只读审查；未认证全部成功/失败/边界/交互分支。']:['可以被泛用字典存储或出现在技能文本，不等于状态规则已实现。']),registryEnumMapped:registryMap.some(x=>x.name===row.name),resistanceOption:resistanceNames.includes(row.name),codeMentions:files.flatMap(f=>refs(f,row.name)),testFilesMentioningName:tests.filter(x=>x.text.includes(row.name)).map(x=>x.file),testEvidenceMeaning:'仅定位既有测试；文本出现不代表状态完整性认证。'}));
const report={generatedAt:new Date().toISOString(),scope:'只读静态检查dist全部JS，手工区分状态行为与施加入口/枚举/文本；没有执行或修改战斗逻辑。',database:'data/statuses/statuses.json',summary:{namedStatuses:db.records.length,withObservedBehavior:records.filter(x=>core[x.name]).length,withoutSpecificBehavior:records.filter(x=>!core[x.name]).map(x=>x.name),registryMapCount:registryMap.length,resistanceOptions:resistanceNames.length},currentStorage:{file:'dist/souls.js',shape:'fighter.ailments[name] = absoluteEndRound',application:refs('dist/souls.js','function ailment('),defaultDuration:refs('dist/souls.js','duration??'),immunityAndReflection:'统一入口检查魂印/回合免疫、次数免疫、抗性；状态转化有直接赋值和调用入口两条路径。',clearing:'context.clearAilments直接清空字典；结束清理按end<=round；转化集中在回合末。',experimentalContract:'RULES.md明确未注明时长随机1–3回合为实验约定，不能回填为来源规则。'},registryMap,resistanceNames,records,
integrationPlan:[
{step:1,scope:'已完成：纯数据',action:'status-database.cjs按数值编码或精确名称只读查询，返回冻结数据；未知/保留编码返回null，不导入dist，不注册效果。'},
{step:2,scope:'后续数据完善',action:'确认山神守护、默认时长、免疫/清除条件；为每条新增事实保留来源版本与原文。若Wiki与词条提示时点不同，保留版本并显式审核，不静默覆盖。'},
{step:3,scope:'后续获准接入时',action:'建立独立状态处理注册表，按状态ID及规则来源hash绑定处理器；目录存在不等于可执行，缺处理器或未知必要参数应明确拒绝，不套默认值。'},
{step:4,scope:'后续获准接入时',action:'将施加/免疫、行动限制、命中/威力、行动前后、回合末、自然到期、主动清除与转化分开定义；保留现有名字字典的显式适配层，逐项验证后迁移。'},
{step:5,scope:'后续获准接入时',action:'逐状态覆盖成功、失败、边界和交互；特别验证烧伤威力、冰封结束链、状态免疫与转化路径，再运行已完成精灵回归。当前不做这些实现变更。'},
{step:6,scope:'持续约束',action:'状态全集和分类永远不能自动充当2074或其它随机效果的池。3667/3670保持暂停，验证器和自动化保持原样。'}],
sourceCaveats:['来源为页游/seer；手游/seerm规则已排除。','Wiki状态表有40行，SeerAPI枚举有41个有名项；这说明采集覆盖范围，不是全游戏所有时代状态的穷尽保证。','新增数据库只陈述证据，不改变原实验时序或已完成精灵。'],
codeManifest:files.map(file=>({file,sha256:sha(fs.readFileSync(file))}))};
const sources=require('../data/statuses/sources.json');report.sourceAccess={wiki:db.sources['wiki-mechanics'],enum:db.sources['seerapi-status-enum'],failures:sources.failures,cooldown:sources.cooldown??null,note:'Wiki实时刷新HTTP567，使用已保存的页游修订388558；不声明实时刷新成功。SeerAPI枚举已实时刷新。'};
fs.writeFileSync('research/status-system-audit.json',JSON.stringify(report,null,2)+'\n');console.log(report.summary);
