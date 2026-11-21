'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const {chromium}=require('playwright');

async function main(){
  const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'../..'),env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let browser;
  try{
    const [output]=await Promise.race([once(server.stdout,'data'),once(server,'exit').then(([code])=>{throw Error('独立服务器退出 '+code);})]);
    const origin=String(output).match(/Local: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
    assert.ok(origin);
    browser=await chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage();
    page.setDefaultTimeout(12000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(origin+'/?mode=team');
    const button=name=>page.getByRole('button',{name,exact:true});
    async function add(side,id,stats){
      const input=page.locator('#wiki-query-'+side);
      await input.fill(String(id));await input.press('Enter');
      await page.locator(`#wiki-results-${side} [data-id="${id}"]`).click();
      await page.waitForFunction(([side,id])=>document.querySelector('#wiki-detail-'+side+' h4')?.textContent.includes('#'+id),[side,id]);
      const details=page.locator('.growth-card').nth(side).locator('.override');
      if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
      for(const [key,value] of Object.entries(stats))await details.locator(`[name="${side}-override-${key}"]`).fill(String(value));
      const entries=page.locator('.team-roster').nth(side).locator('.roster-entry'),count=await entries.count();
      await button('将当前配招和养成加入 '+(side?'B':'A')+' 队').click();
      await entries.nth(count).waitFor();
    }
    const choice=(side,key)=>page.locator(`[data-side="${side}"][data-team-choice="${key}"]`);
    await add(0,3577,{maxHp:9000,atk:9999,spe:9999});
    await add(1,2988,{maxHp:1,def:1});
    await add(1,3056,{maxHp:9000,atk:500});
    await button('开始队伍对战').click();
    await choice(0,'wiki:31847').click();
    await choice(1,'potion:pp').click();
    await button('结算回合').click();
    const caster=page.locator('.team-fighter.side-a');
    const opponent=page.locator('.team-fighter.side-b');
    assert.match(await caster.innerText(),/自身持有：令当前对手下次攻击技能无效/);
    assert.doesNotMatch(await opponent.innerText(),/下次攻击技能无效/);
    await opponent.locator('[data-replacement-member="1"]').click();
    await choice(1,'wiki:19369').click();
    await choice(0,'potion:pp').click();
    await button('确认补位并结算回合').click();
    const log=await page.locator('.team-journal').innerText();
    assert.match(log,/光之惩戒·英卡洛斯 · 光·断罪裁决：击杀盔 \+1 次/);
    assert.match(log,/光之惩戒·英卡洛斯 持有的击杀盔消耗 1 次.*圣甲·盖亚 的破釜沉舟战.*本次攻击技能无效/);
    assert.doesNotMatch(await opponent.innerText(),/下次攻击无效/);
    await choice(0,'potion:pp').click();
    await choice(1,'wiki:24779').click();
    await button('结算回合').click();
    assert.match(await opponent.innerText(),/自身持有：令当前对手属性技能无效/);
    await choice(0,'wiki:26032').click();
    await choice(1,'potion:pp').click();
    await button('结算回合').click();
    assert.match(await page.locator('.team-journal').innerText(),/圣甲·盖亚 持有的回合封招，使 A 方 光之惩戒·英卡洛斯 的无始源光无效/);
    assert.deepEqual(errors,[]);
    console.log('Edge 本机队伍战实测：击杀盔在英卡洛斯一侧，替补当回合消费有明确日志。');
  }finally{
    if(browser)await browser.close();
    server.kill();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
