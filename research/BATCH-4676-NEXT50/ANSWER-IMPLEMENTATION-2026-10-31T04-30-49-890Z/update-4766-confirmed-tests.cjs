'use strict';const fs=require('fs'),assert=require('node:assert/strict');
const p='tests/next50-4766.test.cjs';let s=fs.readFileSync(p,'utf8');
function line(fragment,fn){const lines=s.split('\n'),i=lines.findIndex(x=>x.includes(fragment));assert(i>=0,fragment);lines[i]=fn(lines[i]);s=lines.join('\n');}
line('魂印每段或整招研究',x=>x.replace('每段或整招研究模型实际多段HP/衍化不同','整招使用原武道挡全部段且招后仅衍化一次，旧候选无效').replace("assert.equal(sum(s,'attack',1)>0,unit==='segment')","assert.equal(sum(s,'attack',1),0)"));
line('魂印使用附伤伤前与伤后',x=>x.replace('使用附伤伤前与伤后研究模型保留真实先后','使用附伤固定在红伤前，旧模型不改已答时序').replace("phase==='before'?'percent':'attack'","'percent'"));
line('/2292逆转保持武道或位置',x=>x.replace('逆转保持武道或位置、正转累计固定反馈150%上限、消费/保留候选','逆转保留位置、正转累计固定反馈150%上限并消费，旧模型无效').replace("q==='same-index'?1:2","1").replace("mode==='consume'?0:100","0").replace(".blocked,123)",".blocked,0)"));
line('/532和1065实际使用',x=>x.replace('两种回复基数','回复净HP基数').replace("policy==='nominal'?3000:1","1"));
line('/2298没有正级',x=>x.replace("scope==='caps-and-immunity'","true"));
line('/1748未暴击',x=>x.replace('本招与整轮研究模型、零红暴击旧问题独立','只检查当前本招且零红暴击仍算，旧模型无效').replace("!!s.fighters[0].effects['必定暴击'],!counts","!!s.fighters[0].effects['必定暴击'],false"));
line('/1664严格',x=>x.replace('真实击败含2243立即重生才延续次轮','真实击败才延续次轮，2243立即回满非KO').replace("assert.deepEqual(ko.fighters[0].effects['低威力攻击无效'],{start:1,end:2,power:160})","assert.deepEqual(ko.fighters[0].effects['低威力攻击无效'],revive?undefined:{start:1,end:2,power:160})").replace("assert.equal(sum(ko,'attack',1),0)","assert.ok(sum(ko,'attack',1)>0)"));
line('/2220最高双攻',x=>x.replace('最高双攻面板先选与等级后选候选真实不同','最高双攻统一按面板选，旧等级后选候选无效').replace('assert.ok(values[1]>values[0])','assert.equal(values[1],values[0])'));
line('/2293重复授予',x=>x.replace('刷新或叠加模型，未确认时无默认','同源刷新一次，旧叠加和未设模型均不改已答规则').replace("if(mode===undefined){assert.throws(()=>turn(s),/Q-4766-009/);continue;}",'').replace("(mode==='stack'?2:1)",'1'));
line('/733负级反正与禁强化',x=>x.replace('统一候选，负级锁优先、没有默认','正常强化准入，旧模型无效且负级锁优先').replace("if(mode===undefined){assert.throws(()=>turn(s),/Q-4765-009/);continue;}",'').replace("mode==='stage'?-2:2","-2").replace("mode==='rewrite'","false"));
line('魂印保1完整正伤',x=>x.replace('反馈基数候选仅改变伤害量','反馈固定完整结算红伤，旧HP模型无效').replace("1500+(basis==='settled'?red:0)",'1500+red'));
line('魂印逆转致死后的',x=>x.replace('载荷资格复用旧确认问题，false不反馈不衍化、true反馈但不自我复活','停止反馈及衍化，旧候选不绕过普通死亡').replace('1500+(active?10:0)','1500').replace('active?1:0','0'));
line('4766原生全部24招完整',x=>x.replace('4766原生全部24招完整','4766隔离组件全部24招完整'));
fs.writeFileSync(p,s);
let h=fs.readFileSync('tests/helpers/4766-battle.cjs','utf8');const a=h.indexOf('for(const f of s.fighters)Object.assign(f.soulState,'),b=h.indexOf('if(o.index!==-1)',a);assert(a>0&&b>a);h=h.slice(0,a)+'// Explicit caller negative-control fields do not select production semantics.\nfor(const f of s.fighters)Object.assign(f.soulState,o.models??{});'+h.slice(b);fs.writeFileSync('tests/helpers/4766-battle.cjs',h);
console.log('35 cases retained; candidate assertions updated to actual answers');
