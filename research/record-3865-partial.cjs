'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const log=fs.readFileSync('research/3865-partial-final-npm.log','utf8');
assert.match(log,/EXIT_CODE=0/);assert.match(log,/pass 1852/);
const baseline=require('./batch-3865-baseline.json');
for(const [p,hash]of Object.entries(baseline.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash,p);
const report={at:new Date().toISOString(),status:'partial-awaiting-user-confirmation',species:3865,name:'希瓦',order:baseline.order,nextAfterBatch:3879,source:'research/3865-source-manifest.json',wiki:'research/3865-wiki-source.json',sourcePetHash:'b379f0f1',soulHash:'73f4b77e',moves:17,effectInstances:30,reviewItems:48,deployed:false,gateRun:false,followingSpeciesStarted:false,implemented:[99,498],pendingSemantics:['1137重复选招及控制打断、固定吸取回复量','33304两项50%叠加','26732的1297害怕未成功吸取范围','33303的1415体力比较时点','33299的1354固定吸取回复量'],tests:{special:{log:'research/3865-independent-v4.log',passed:15},public:{log:'research/3865-independent-public.log',passed:75},full:{log:'research/3865-partial-final-npm.log',passed:1852,exitCode:0}},failures:[{log:'research/3865-source-query.log',reason:'受限环境curl7无法连接；允许联网后串行查询完成，原失败保留'},{log:'research/3865-independent-first.log',reason:'夹具错误读取攻击翻倍键；实际doubleDamage，已改并补实际有效期伤害断言'},{log:'research/3865-independent-expanded.log',reason:'夹具误把护罩当攻击盾、免伤边界输入未达到300、当回合封属在回合末已过期且技能无效仍扣PP；改用固伤护罩夹具、实际300攻击输入及日志/PP断言'},{log:'research/3865-independent-v3.log',reason:'未获得免异常计数为undefined而非0；断言实际未登记状态，已有消费及再次施加状态断言保留'}],formalCursor:3865,multiplayerTodoUnchanged:true,protectedFilesUnchanged:true,automationEnabled:false,gitUsed:false};
fs.writeFileSync('research/3865-source-audit.json',JSON.stringify(report,null,2)+'\n');
const text=`## 2026-10-16 恢复正式批次3865→3866→3867→3870→3875，3865部分实现待确认

核实上一轮3847、3291、3550独立gate退出0及最终1837/1837，3550仍为临时导入。正式队列本批如标题，批后3879；仅开始3865希瓦，后四只未开始。来源pet b379f0f1、魂印1137/73f4b77e，17招30实例共48审核项。串行SeerAPI及BWIKI快照、hash、原文完整保留（research/3865-source-manifest.json、3865-wiki-source.json），首个curl7连接失败另有日志；未把访问失败称为资料不存在。

公共新增效果99概率混乱（统一独立默认2/3回合）与498暴击率加1/N；没有放宽旧参数规则。独立专项15/15，公共合并75/75（当时8项专项+67公共），最终当前整库1852/1852退出0，日志research/3865-independent-v4.log、3865-independent-public.log、3865-partial-final-npm.log。保留失败日志及夹具修正原因于research/3865-source-audit.json；已有辛显示、3291、3550均在整库回归中通过。

待用户确认1137重复选招与控制打断、魂印及1354固定吸取回复量、33304两项50%增伤叠加、1297害怕失败范围、1415体力比较时点。不以代码作为语义证据，不扩展3550限定确认；疑问已提交。魂印1137和1415未实现，不依赖答案的当前15项状态专项已完成，仍需补齐完整审核与正式本地链路。未正式部署、未运行最终gate、未标single-stage完成；统一延期清单未改。正式游标仍3865，保护文件hash不变，自动化false、不使用Git。

`;
fs.writeFileSync('PROGRESS.md',text+fs.readFileSync('PROGRESS.md','utf8'));
console.log('recorded partial, no gate or cursor advancement');
