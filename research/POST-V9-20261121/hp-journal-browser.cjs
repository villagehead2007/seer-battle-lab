'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const {chromium}=require('playwright');

async function check(page,origin,team){
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+(team?'/?mode=team':'/'));
  async function load(side,id,stats){
    const query=page.locator('#wiki-query-'+side);
    await query.fill(String(id));await query.press('Enter');
    await page.locator(`#wiki-results-${side} [data-id="${id}"]`).click();
    await page.waitForFunction(([side,id])=>document.querySelector('#wiki-detail-'+side+' h4')?.textContent.includes('#'+id),[side,id]);
    const details=page.locator('.growth-card').nth(side).locator('.override');
    if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
    for(const [name,value] of Object.entries(stats))await details.locator(`[name="${side}-override-${name}"]`).fill(String(value));
  }
  const button=name=>page.getByRole('button',{name,exact:true});
  await load(0,3056,{maxHp:150,spd:9999,spe:100});
  if(team)await button('将当前配招和养成加入 A 队').click();
  await load(1,3017,{maxHp:2000,spa:180,spe:999});
  const fourth=page.locator('#wiki-detail-1 input[value="19207"]');
  if(await fourth.isChecked())await fourth.uncheck();
  await page.locator('#wiki-detail-1 input[value="10761"]').check();
  if(team){
    await button('将当前配招和养成加入 B 队').click();
    await button('开始队伍对战').click();
  }else await page.locator('#wiki-start').click();

  const moveAttr=team?'data-team-choice':'data-move';
  const journal=page.locator(team?'.team-journal':'#battle-log');
  const latest=journal.locator('.log-turn').filter({has:page.locator('h3').filter({hasText:/第 \d+ 回合/})}).first();
  async function turn(a,b){
    for(const [side,key] of [a,b].entries())await page.locator(`[data-side="${side}"][${moveAttr}="${key}"]`).click();
    if(team)await button('结算回合').click();
    else await page.locator('#resolve').click();
    return latest.locator('[data-hp-change]');
  }

  const hp='potion:hp',pp='potion:pp',mixed='wiki:10761';
  let changes=await turn(hp,mixed);
  assert.equal(await changes.count(),4);
  assert.deepEqual(await changes.evaluateAll(rows=>rows.map(row=>[row.dataset.hpChange,row.dataset.damageType])),
    [['loss','attack'],['gain',undefined],['loss','fixed'],['gain',undefined]]);
  const [red,drain,fixed,heal]=await changes.locator('.log-hp-headline').allTextContents();
  assert.match(red,/受伤.*攻击伤害.*A 方 · 圣甲·盖亚 −\d+ HP/);
  assert.match(drain,/回复体力.*B 方 · 真龙·塔克林 0 HP.*未恢复/);
  assert.match(fixed,/固定伤害.*A 方 · 圣甲·盖亚 −75 HP/);
  assert.match(heal,/回复体力.*A 方 · 圣甲·盖亚 \+\d+ HP/);
  const ordinary=latest.locator('.log-event').filter({hasText:/先制/}).first();
  assert.equal(await ordinary.getAttribute('data-hp-change'),null);
  const typography=await latest.evaluate(el=>{
    const style=selector=>getComputedStyle(el.querySelector(selector));
    return [style('.log-hp-target').fontSize,style('.log-hp-detail').fontSize,style('[data-hp-change=loss] .log-hp-target').color,
      style('[data-hp-change=gain] .log-hp-target').color];
  });
  assert.ok(parseFloat(typography[0])>parseFloat(typography[1]));
  assert.notEqual(typography[2],typography[3]);
  if(process.env.HP_JOURNAL_SCREENSHOTS)await latest.screenshot({path:path.join(process.env.HP_JOURNAL_SCREENSHOTS,team?'seer-team-hp-journal.png':'seer-solo-hp-journal.png')});

  changes=await turn(hp,hp);
  assert.equal(await changes.count(),2);
  assert.equal(await changes.and(latest.locator('.log-hp-zero')).count(),2);
  assert.match(await changes.first().locator('.log-hp-headline').innerText(),/0 HP[\s\S]*未恢复/);
  await turn(pp,mixed);
  changes=await turn(pp,mixed);
  const damage=changes.and(latest.locator('[data-damage-type]'));
  assert.deepEqual(await damage.evaluateAll(rows=>rows.map(row=>row.dataset.damageType)),['attack','fixed','true']);
  const finalFixed=(await damage.nth(1).innerText()).match(/−(\d+) HP[\s\S]*结算伤害 75/);
  assert.ok(finalFixed&&Number(finalFixed[1])<75);
  assert.match(await damage.nth(2).innerText(),/真实伤害[\s\S]*B 方 · 真龙·塔克林 −\d+ HP[\s\S]*圣甲盖亚临终反击/);
  if(team)assert.match(await page.locator('.team-fighter').first().innerText(),/已受攻击伤害/);
  assert.deepEqual(errors,[]);
}

async function main(){
  const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'../..'),env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let browser;
  try{
    const [output]=await Promise.race([once(server.stdout,'data'),once(server,'exit').then(([code])=>{throw Error('测试服务器启动失败：'+code);})]);
    const origin=String(output).match(/Local: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
    assert.ok(origin,String(output));
    browser=await chromium.launch({channel:'msedge',headless:true});
    for(const team of [false,true]){
      const page=await browser.newPage({viewport:{width:1440,height:1000}});
      page.setDefaultTimeout(12000);
      try{await check(page,origin,team);}finally{await page.close();}
      console.log('通过：'+(team?'队伍战':'单精灵')+'实际回合伤害分类、回复、0 HP 和临终真伤');
    }
  }finally{
    if(browser)await browser.close();
    server.kill();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
