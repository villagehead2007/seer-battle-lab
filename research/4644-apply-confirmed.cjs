'use strict';const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),base='research/next50-answer-takeover-2026-10-26T17-09-55-144Z/',dir=base+'4644-before/';fs.mkdirSync(dir,{recursive:true});for(const p of ['dist/souls.js','dist/range-effects.js','dist/range-souls.js',...fs.readdirSync('tests').filter(x=>x.includes('4644')&&x.endsWith('.cjs')).map(x=>'tests/'+x)])fs.copyFileSync(p,dir+path.basename(p));
function edit(p,a,b){const s=fs.readFileSync(p,'utf8');assert.equal(s.split(a).length,2,a.slice(0,120));fs.writeFileSync(p,s.replace(a,b));}
const soul='dist/range-souls.js',effects='dist/range-effects.js',core='dist/souls.js';
edit(soul,'policy=c.a.soulState.qualifiedGuardPP1845;','policy=c.a.soulState.qualifiedGuardPP1845??\'per-missing\';');
edit(soul,'const p=f.soulState.qualifiedConstructPriority1845;','const p=f.soulState.qualifiedConstructPriority1845??\'per-construction\';');
edit(soul,'const p=c.a.soulState.qualifiedNoPPExtra1845;','const p=c.a.soulState.qualifiedNoPPExtra1845??\'eligible\';');
edit(soul,'function extraAction1845(c,policy=c.a.soulState.qualifiedExtra1845){','function extraAction1845(c,policy=c.a.soulState.qualifiedExtra1845??{shield:\'source-refresh\',typed:\'independent-typed\'}){');
edit(soul,"!['add','replace','maximum'].includes(policy?.shield)","!['add','replace','maximum','source-refresh'].includes(policy?.shield)");
edit(soul,"if(policy?.shield==='replace')c.a.suitState.shield=300;","if(policy?.shield==='source-refresh')c.refreshShield(c.a,300,'soul:1845:extraAction');else if(policy?.shield==='replace')c.a.suitState.shield=300;");
// Construction acquisition is an actual-use event. Its conditional payload remains separate.
let s=fs.readFileSync(effects,'utf8');const a=s.indexOf('function constructI4644(c)'),b=s.indexOf('function constructII4644(c)',a);assert.ok(a>0&&b>a);s=s.slice(0,a)+'function constructI4644(c){return c.clear(c.t);}\n'+s.slice(b);const ia=s.indexOf('function constructIV4644(c)'),ib=s.indexOf('metadata[2149]',ia);assert.ok(ia>0&&ib>ia);s=s.slice(0,ia)+'function constructIV4644(c){c.modifier*=1.5;}\n'+s.slice(ib);fs.writeFileSync(effects,s);
edit(effects,"add4644(2149,'afterHit',c=>{if(c.a.side===c.first)constructI4644(c);});","add4644(2149,'afterHit',c=>{if(c.a.side===c.first)constructI4644(c);},[],undefined,{beforeConsume(c){grant4644(c,1);}});");
edit(effects,"add4644(2150,'afterHit',c=>{if(c.a.side===c.first)constructII4644(c);});","add4644(2150,'afterHit',c=>{if(c.a.side===c.first)constructII4644(c);},[],undefined,{beforeConsume(c){grant4644(c,2);}});");
edit(effects,"add4644(2151,'beforeConsume',c=>{if(c.a.side===c.first)constructIII4644(c);}","add4644(2151,'beforeConsume',c=>{grant4644(c,3);if(c.a.side===c.first)constructIII4644(c);}");
edit(effects,"{afterDamageResolved:settleIV4644}","{beforeConsume(c){grant4644(c,4);}}");
edit(effects,',afterDamageResolved:settleIV4644,onMiss:missIII4644',',onMiss:missIII4644');
// All three failure modes explicitly retain III PP exemption; fifth reuse follows it.
s=fs.readFileSync(effects,'utf8');s=s.replaceAll("c.a.soulState.qualified2151Failure4644!=='all-actual-use'","(c.a.soulState.qualified2151Failure4644??'all-actual-use')!=='all-actual-use'");fs.writeFileSync(effects,s);
edit(effects,'const scope=c.a.soulState.qualified1323Basis4644;','const scope=c.a.soulState.qualified1323Basis4644??\'settled\';');
edit(core,'const policy=a.soulState.qualified2150Scope4644,','const policy=a.soulState.qualified2150Scope4644??\'red-only\',');
const p=base+'4644-user-confirmations.json',c=JSON.parse(fs.readFileSync(p));c.implemented=['001 per-missing PP/per-construction priority','002 noPP extra action','010 constructions acquired on actual use independent of payload','011 III retains freePP on actual failed use and fifth reuse','typed soul attack uses shared typed channel','shield refresh per-source newest-first','1323 settled red basis','2150 red-only per compact question29'];c.pending=['1876反馈及次数重授','2150与1419/1747重授','1444公式','1892首触','2154晚杀1156奖励'];c.status='answered-branches-implemented-awaiting-tests';fs.writeFileSync(p,JSON.stringify(c,null,2)+'\n');console.log(c.implemented);
