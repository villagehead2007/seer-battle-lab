'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const {chromium}=require('playwright');

async function load(page,side,id){
  const query=page.locator('#wiki-query-'+side);
  await query.fill(String(id));await query.press('Enter');
  await page.locator(`#wiki-results-${side} [data-id="${id}"]`).click();
  await page.waitForFunction(([side,id])=>document.querySelector('#wiki-detail-'+side+' h4')?.textContent.includes('#'+id),[side,id]);
}
const button=(page,name)=>page.getByRole('button',{name,exact:true});
async function add(page,side,id,stats){
  await load(page,side,id);
  if(stats){
    const details=page.locator('.growth-card').nth(side).locator('.override');
    if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
    for(const [name,value] of Object.entries(stats))await details.locator(`[name="${side}-override-${name}"]`).fill(String(value));
  }
  await addCurrent(page,side);
}
async function addCurrent(page,side){
  await button(page,'将当前配招和养成加入 '+(side?'B':'A')+' 队').click();
}
function action(page,team,side,id){
  return page.locator(`[data-side="${side}"][${team?'data-team-choice':'data-move'}="${id}"]`);
}

async function checkReplacement(page,origin,fallen,opponentFirst){
  const survivor=1-fallen;
  await page.goto(origin+'/?mode=team');
  const base={maxHp:4000,atk:240,def:600,spe:200};
  await add(page,fallen,2988,{...base,maxHp:20,def:1,spe:1});
  await add(page,fallen,3056,base);
  await add(page,fallen,3291,base);
  await add(page,survivor,2988,{...base,atk:9999,spe:9999});
  await button(page,'开始队伍对战').click();
  const choose=(side,id)=>action(page,true,side,id);
  await choose(survivor,'wiki:19123').click();
  await choose(fallen,'potion:pp').click();
  await button(page,'结算回合').click();
  const submit=button(page,'确认补位并结算回合');
  const card=page.locator('.team-fighter').nth(fallen);
  const history=page.locator('.team-journal');
  const before=await history.innerText();
  assert.ok(await submit.isDisabled());
  assert.equal(await choose(fallen,'wiki:24780').count(),0);
  if(opponentFirst)await choose(survivor,'potion:pp').click();
  await card.locator('[data-replacement-member="1"]').click();
  await choose(fallen,'wiki:24780').click();
  assert.match(await card.innerText(),/圣甲·盖亚/);
  assert.equal(await history.innerText(),before);
  await card.locator('[data-replacement-member="2"]').click();
  assert.ok(await submit.isDisabled());
  assert.match(await card.innerText(),/瀚宇星皇/);
  await choose(fallen,'wiki:25295').click();
  if(!opponentFirst)await choose(survivor,'potion:pp').click();
  assert.ok(await submit.isEnabled());
  const ppBefore=(await choose(fallen,'wiki:25295').innerText()).match(/PP (\d+) \/ (\d+)/);
  assert.ok(ppBefore);
  await submit.click();
  assert.match(await page.locator('.team-roundbar h2').innerText(),/第 3 回合/);
  assert.match(await card.innerText(),/瀚宇星皇/);
  assert.match(await choose(fallen,'wiki:25295').innerText(),new RegExp('PP '+(Number(ppBefore[1])-1)+' / '+ppBefore[2]));
  assert.match(await history.innerText(),/瀚宇星皇 登场。/);
  assert.match(await history.innerText(),new RegExp((survivor?'B':'A')+' 方 使用了PP 药'));
}

async function checkDetails(page,origin,team){
  await page.goto(origin+(team?'/?mode=team':'/'));
  if(team){
    await add(page,0,2988);
    await load(page,1,4004);
  }else{
    await load(page,0,2988);
    await load(page,1,4004);
  }
  const soul=page.locator('select[data-soul-side="1"]');
  await soul.selectOption('2121');
  const unchecked=page.locator('#wiki-detail-1 input[data-wiki-side="1"][value="33993"]');
  if(await unchecked.isChecked())await unchecked.uncheck();
  await page.locator('#wiki-detail-1 input[data-wiki-side="1"][value="38472@5"]').check();
  if(team){
    await addCurrent(page,1);
    await button(page,'开始队伍对战').click();
  }else await page.locator('#wiki-start').click();
  const tooltip=page.getByRole('tooltip');
  async function hover(target,name,meta,lines){
    await target.hover();
    await tooltip.waitFor();
    assert.equal(await tooltip.locator(':scope > strong').innerText(),name);
    assert.match(await tooltip.locator('.move-tooltip-meta').innerText(),meta);
    const effects=await tooltip.locator('li').allTextContents();
    for(const [index,expected] of lines.entries())assert.match(effects[index],expected);
    return tooltip;
  }
  await hover(action(page,team,0,'wiki:19122'),'王·唯快不破',/物攻.*命中 100%.*基础先制 \+3/,
    [/消除对手回合/,/40%令对方害怕/,/能力提升效果转化/]);
  await page.keyboard.press('Escape');
  await hover(action(page,team,0,'wiki:19123'),'王·窥觊苍生',/威力 160.*PP 5.*必中.*基础先制 \+0/,
    [/伤害不会出现微弱/,/速度40%.*增加20%.*100%/,/未击败.*最大体力的1\/5/]);
  await page.keyboard.press('Escape');await tooltip.waitFor({state:'hidden'});
  await hover(action(page,team,0,'wiki:24651'),'驭鹰神力',/属性技能.*基础先制 \+0/,
    [/50%概率强化/,/4回合内免疫/,/下2回合.*攻击伤害翻倍/,/下2回合.*先制\+2/]);
  await page.keyboard.press('Escape');
  const versioned=action(page,team,1,'wiki:38472@5');
  const title=(await versioned.locator('.move-name').innerText());
  await page.setViewportSize({width:380,height:300});
  await hover(versioned,title,/物攻.*PP.*基础先制/,[
    /待命背包精灵王 5只.*首个可获得的标记补至上限/,
    /此效果每场战斗限1次.*消耗体力改为消耗至1点/,
  ]);
  assert.match(title,/5只/);
  assert.equal(await tooltip.evaluate(el=>el.scrollHeight>el.clientHeight),true);
  await tooltip.hover();
  await page.mouse.wheel(0,900);
  await page.waitForFunction(()=>{const el=document.querySelector('[role=tooltip]');return el.scrollTop+el.clientHeight>=el.scrollHeight-1;});
  assert.ok(await tooltip.evaluate(el=>{
    const box=el.getBoundingClientRect(),item=el.querySelector('li:last-child').getBoundingClientRect();
    const last=el.querySelector('ul:last-child li:last-child').getBoundingClientRect();
    return box.left>=0&&box.right<=innerWidth&&box.top>=0&&box.bottom<=innerHeight&&last.bottom<=box.bottom&&item.top<box.bottom;
  }));
}

async function main(){
  const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'../..'),env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let browser;
  try{
    const [output]=await Promise.race([
      once(server.stdout,'data'),
      once(server,'exit').then(([code])=>{throw Error('测试服务器启动失败，退出码 '+code);}),
    ]);
    const origin=String(output).match(/Local: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
    assert.ok(origin,String(output));
    browser=await chromium.launch({channel:'msedge',headless:true});
    for(const task of [
      ['A 方补位',page=>checkReplacement(page,origin,0,true)],
      ['B 方补位',page=>checkReplacement(page,origin,1,false)],
      ['单精灵悬停',page=>checkDetails(page,origin,false)],
      ['多精灵悬停',page=>checkDetails(page,origin,true)],
    ]){
      const page=await browser.newPage();
      page.setDefaultTimeout(12000);
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      try{await task[1](page);assert.deepEqual(errors,[]);}finally{await page.close();}
      process.stdout.write('通过：'+task[0]+'\n');
    }
  }finally{
    if(browser)await browser.close();
    server.kill();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
