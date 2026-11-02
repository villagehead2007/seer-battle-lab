'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {make,turn}=require('./helpers/3788-battle.cjs');
const app=fs.readFileSync(require.resolve('../dist/app.js'),'utf8');
const render=vm.runInNewContext(app.slice(app.indexOf('  function renderXin('),app.indexOf('  function renderFighter('))+';renderXin',{sideName:i=>i===0?'A 方':'B 方'});
function matches(f){const html=render(f,0);assert.ok(html.includes(`aria-valuenow="${f.soulState.xin.hp}"`));assert.ok(html.includes(`aria-valuemax="${f.soulState.xin.maxHp}"`));assert.ok(html.includes(`<b>${f.soulState.xin.hp}</b> / ${f.soulState.xin.maxHp}`));return html;}
test('辛面板读取生成、实际伤害分担及死亡融合后的引擎血量',()=>{
 let s=make(undefined,{soul:1061});matches(s.fighters[0]);const before=s.fighters[0].soulState.xin.hp;
 s=turn(s,900031,900040);assert.ok(s.fighters[0].soulState.xin.hp<before);matches(s.fighters[0]);
 s.fighters[0].soulState.xin.hp=1;s=turn(s,900031,900040);assert.equal(s.fighters[0].soulState.xin.hp,0);assert.equal(s.fighters[0].soulState.xinFusion,true);assert.match(matches(s.fighters[0]),/荒神融合/);
});
test('辛面板不存在时清除血量，其他魂印不显示；随状态更新而非缓存',()=>{
 const s=make(undefined,{soul:1061}),f=s.fighters[0];f.soulState.xin.hp=123;matches(f);f.soulState.xin.hp=456;matches(f);
 delete f.soulState.xin;assert.match(render(f,0),/未生成/);assert.doesNotMatch(render(f,0),/aria-valuenow|456/);f.soulId=0;assert.equal(render(f,0),'');
 assert.ok(app.includes('${renderXin(f,i)}'));
});
