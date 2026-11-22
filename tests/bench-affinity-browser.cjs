'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {spawn}=require('node:child_process'),{once}=require('node:events');
const {chromium}=require('playwright'),member=require('./helpers/browser-member.cjs');
async function run(){
  const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'0'},windowsHide:true});
  let browser;
  try{
    const origin=String((await once(server.stdout,'data'))[0]).match(/http:\/\/127\.0\.0\.1:\d+/)[0];
    browser=await chromium.launch({channel:'msedge'});
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(origin);
    const rates=locator=>locator.locator('.affinity-direction strong').allTextContents();
    assert.deepEqual(await rates(page.locator('#fighter-0')),['×4','×0.5']);
    assert.deepEqual(await rates(page.locator('#fighter-1')),['×0.5','×4']);
    for(const mode of ['team','team#cpu']){
      await page.goto('about:blank');
      await page.goto(origin+'/index.html?mode='+mode);
      for(const [side,ids] of [[3056,3291],[3142,2988]].entries())for(const id of ids)await member(page,side,id);
      await page.getByRole('button',{name:'开始队伍对战'}).click();
      const cards=page.locator('.team-cards .team-fighter');
      const bench=i=>cards.nth(i).locator('.team-hp + .reserve-affinity');
      assert.deepEqual(await rates(bench(0)),['×4','×0.5']);
      assert.deepEqual(await rates(bench(1)),['×2','×1']);
      assert.match(await bench(0).innerText(),/进攻.*自然\s*圣灵.*→.*电/);
      assert.match(await bench(0).innerText(),/受击.*电.*→.*自然\s*圣灵/);
      if(mode==='team'){
        await cards.nth(0).locator('[data-team-choice="potion:pp"]').click();
        await cards.nth(1).locator('[data-team-choice="switch/1"]').click();
        await page.locator('[data-team-resolve]').click();
        await cards.nth(1).getByRole('heading',{name:'凡尔斯'}).waitFor();
        assert.deepEqual(await rates(bench(0)),['×1.5','×0.75']);
        assert.deepEqual(await rates(cards.nth(1).locator('.affinity-summary')),['×2','×1']);
      }
    }
    assert.deepEqual(errors,[]);
    console.log('单精灵、同屏、人机双向面板与血条下倍率通过；主动换宠后 ×4/×0.5 更新为 ×1.5/×0.75。');
  }finally{try{await browser?.close();}finally{server.kill();}}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
