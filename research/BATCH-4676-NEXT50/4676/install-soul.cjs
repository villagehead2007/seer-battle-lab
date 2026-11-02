'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),root=path.resolve(__dirname,'../../..');process.chdir(root);
const before=path.join(__dirname,'before-soul');fs.mkdirSync(before,{recursive:true});
for(const file of ['dist/range-souls.js','dist/souls.js']){const dest=path.join(before,path.basename(file));if(!fs.existsSync(dest))fs.copyFileSync(file,dest);}
let rs=fs.readFileSync('dist/range-souls.js','utf8');assert.ok(!rs.includes('function lock1878('));const p=rs.lastIndexOf('});');assert.ok(p>0);rs=rs.slice(0,p)+fs.readFileSync(path.join(__dirname,'soul-fragment.js'),'utf8')+'\n'+rs.slice(p);fs.writeFileSync('dist/range-souls.js',rs);
let s=fs.readFileSync('dist/souls.js','utf8');
const old='stage:(f,...args)=>c.stage(f===view?t:f,...args)';assert.equal(s.split(old).length,2);s=s.replace(old,"stage:(f,...args)=>{if(args[0]<0&&['physical','special'].includes(m.kind)&&on(a,'神觉攻击禁异常弱化'))return;return c.stage(f===view?t:f,...args);}");
const ail='ailment:(f,k,source,...args)=>c.ailment(f===view?t:f,k,source===view?t:source,...args)';assert.equal(s.split(ail).length,2);s=s.replace(ail,"ailment:(f,k,source,...args)=>{if(['physical','special'].includes(m.kind)&&on(a,'神觉攻击禁异常弱化'))return false;return c.ailment(f===view?t:f,k,source===view?t:source,...args);}");
const hook='    function skillContext(a,t,m)';assert.ok(s.includes(hook));s=s.replace(hook,"    function accuracyStage1878(a){const value=actionStage(a,'acc'),lock=a.soulState.chiyong1878,owner=lock?fs[lock.sourceSide]:null;if(!lock?.layers||owner?.soulId!==1878||owner.hp<=0)return value;if(value!==0&&!['subtract','replace'].includes(owner.soulState.lockStagePolicy1878))throw Error('Q-4676-001：蚩庸之锁与已有命中等级的计算方式待核实');return owner.soulState.lockStagePolicy1878==='replace'?-lock.layers:Math.max(-6,value-lock.layers);}\n"+hook);
const calc="ignoresBoosts(a)?Math.min(0,actionStage(a,'acc')):(actionStage(a,'acc'))";assert.equal(s.split(calc).length,3);s=s.replaceAll(calc,"ignoresBoosts(a)?Math.min(0,accuracyStage1878(a)):accuracyStage1878(a)");fs.writeFileSync('dist/souls.js',s);
console.log('Installed source-bound partial soul1878; acceptance remains false');
