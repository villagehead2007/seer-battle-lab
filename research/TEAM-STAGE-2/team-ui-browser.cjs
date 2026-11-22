'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const {chromium} = require('playwright');

async function main() {
  const server = spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'../..'),env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let browser;
  try {
    const origin = await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('测试服务启动超时')),30000);
      server.once('error',reject);server.stdout.on('data',buf=>{
        const match=String(buf).match(/Local: (http:\/\/127\.0\.0\.1:\d+)/);
        if(match){clearTimeout(timer);resolve(match[1]);}
      });
    });
    browser=await chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    page.setDefaultTimeout(30000);
    await page.goto(origin+'/index.html?mode=team');
    await page.locator('.team-setup-grid').waitFor();
    async function load(side,id){
      const input=page.locator('#wiki-query-'+side);await input.fill(String(id));await input.press('Enter');
      await page.locator('#wiki-results-'+side+' [data-id="'+id+'"]').click();
      await page.waitForFunction(([side,id])=>document.querySelector('#wiki-detail-'+side+' h4')?.textContent.includes('#'+id),[side,id]);
    }
    async function add(side,id,overrides={},soul=null,skills=[]){
      await load(side,id);
      if(soul!=null){
        const selector=page.locator('[data-soul-side="'+side+'"]');
        if(await selector.count())await selector.selectOption(String(soul));
        else {const souls=require('../../local-species.cjs').species(id).souls;assert.equal(souls.length,1);assert.equal(souls[0].id,soul);}
      }
      for(const skill of skills){
        const picker=page.locator('#wiki-detail-'+side),choice=picker.locator('input[value="'+skill+'"]');
        if(!await choice.isChecked()){
          const replaced=await picker.locator('input[data-wiki-side]:checked').last().getAttribute('value');
          await picker.locator('input[value="'+replaced+'"]').uncheck();await choice.check();
        }
      }
      for(const [key,value] of Object.entries(overrides)){
        const input=page.locator('[name="'+side+'-override-'+key+'"]');
        await input.evaluate(e=>{for(let n=e.parentElement;n;n=n.parentElement)if(n.tagName==='DETAILS')n.open=true;});
        await input.fill(String(value));
      }
      const before=await page.locator('.team-roster').nth(side).locator('.roster-entry').count();
      await page.getByRole('button',{name:'将当前配招和养成加入 '+(side?'B':'A')+' 队'}).click();
      await page.waitForFunction(([side,before])=>document.querySelectorAll('.team-roster')[side].querySelectorAll('.roster-entry').length===before+1,[side,before]);
    }
    const command=(side,key)=>page.locator('[data-side="'+side+'"][data-team-choice="'+key+'"]');
    const resolve=()=>page.locator('[data-team-resolve]').click();
    async function visibleResource(card, pattern) {
      const disclosure=card.locator('.team-resources .team-more').filter({hasText:pattern});
      if(await disclosure.count()===1 && !await disclosure.evaluate(node=>node.open)){
        await disclosure.locator('summary').click();
      }
      assert.match(await card.innerText(),pattern);
    }
    if(process.env.SEER_UI_FOCUS!=='bench-guard'){
    await add(0,4662,{maxHp:5000,atk:260,spa:260,spe:600});
    await add(1,2988,{maxHp:5000,atk:400,spa:400,spe:100});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await page.locator('.team-fighter').first().waitFor();
    assert.equal(await page.locator('.team-bench button').count(),0);
    assert.ok(await page.locator('[data-team-resolve]').isDisabled());
    await command(0,'potion:hp').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await page.locator('.team-roundbar').innerText(),/第 2 回合/);
    await command(0,'potion:hp').click();await command(1,'wiki:24651').click();await resolve();
    assert.ok(await page.locator('.team-fighter').nth(1).locator('.team-stages .up').count()>0);
    await page.getByRole('button',{name:'返回组队'}).click();
    for(const [i,id] of [3056,2987,3223,3576,3506].entries()){
      await add(0,id,{maxHp:4000});await add(1,id,{maxHp:4000});
      if(i<4){
        await page.getByRole('button',{name:'开始队伍对战'}).click();
        assert.equal(await page.locator('.team-bench button').count(),2*(i+1));
        await page.getByRole('button',{name:'返回组队'}).click();
      }
    }
    // The real picker must present both item-fifth options on both souls.
    for(const soul of ['819','1685']){
      await page.locator('[data-soul-side="0"]').selectOption(soul);
      const fifth=page.locator('[data-fifth-side="0"]');
      assert.equal(await fifth.locator('option').count(),2);
      await fifth.selectOption('soul-'+soul+'-fifth-37278');
    }
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    assert.equal(await page.locator('.team-bench button').count(),10);
    const hp=async side=>Number(await page.locator('.team-fighter').nth(side).locator('.fighter-head [role=meter]').getAttribute('aria-valuenow'));
    const priorHP=await hp(1);
    await command(0,'wiki:37469').click();await command(1,'potion:hp').click();
    assert.equal(await command(0,'wiki:37469').getAttribute('aria-pressed'),'true');
    await resolve();
    assert.ok(await hp(1)<priorHP);
    assert.ok(await command(1,'switch/1').isDisabled());
    assert.match(await command(1,'switch/1').innerText(),/无法主动切换/);
    assert.match(await page.locator('.team-journal').innerText(),/第 1 回合/);
    await command(0,'potion:pp').click();
    await page.screenshot({path:path.join(__dirname,'team-ui-desktop.png')});
    await command(0,'potion:pp').click();await command(1,'potion:pp').click();await resolve();
    assert.ok(await command(1,'switch/1').isEnabled());
    const priorName=await page.locator('.team-fighter .name-row h2').first().innerText();
    await command(0,'switch/1').click();
    assert.equal(await page.locator('.team-fighter .name-row h2').first().innerText(),priorName);
    await command(1,'switch/1').click();await resolve();
    assert.match(await page.locator('.team-fighter .name-row h2').first().innerText(),/圣甲/);
    await page.setViewportSize({width:390,height:844});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(__dirname,'team-ui-mobile.png'),fullPage:true});
    await page.setViewportSize({width:1440,height:1000});
    // A fresh setup uses the normal search, build and start controls for a real KO.
    await page.reload();
    await add(0,4662,{maxHp:5000,atk:9999,spa:9999,spe:9999});
    await add(1,2988,{maxHp:1,def:1,spd:1,spe:1});await add(1,3056,{maxHp:4000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await command(0,'wiki:37469').click();await command(1,'potion:pp').click();await resolve();
    await page.getByRole('button',{name:'确认补位'}).waitFor();
    assert.ok(await command(0,'potion:hp').isDisabled());
    assert.ok(await command(1,'potion:pp').isDisabled());
    await command(1,'switch/1').click();await resolve();
    assert.ok(await command(1,'switch/0').isDisabled());
    assert.match(await command(1,'switch/0').innerText(),/已阵亡/);
    await page.reload();
    await add(0,4950,{maxHp:9000});
    await add(1,4762,{maxHp:9000});await add(1,3056);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    const groupCard=page.locator('.team-fighter').nth(0);
    const marks=page.locator('.team-fighter').nth(1).locator('.team-resources').filter({hasText:'魔王咒怨'});
    assert.match(await groupCard.locator('.team-body').first().innerText(),/主位 · 帝皇之钺/);
    assert.match(await marks.innerText(),/魔王咒怨 · 0 层/);
    await command(0,'wiki:38568').click();await command(1,'wiki:37914').click();await resolve();
    assert.match(await groupCard.locator('.team-body').first().innerText(),/主位 · 帝皇之御/);
    const curse=(await marks.innerText()).match(/魔王咒怨 · ([0-9]+) 层/)[1];
    assert.ok(Number(curse)>0);
    await page.screenshot({path:path.join(__dirname,'team-ui-group.png')});
    await command(0,'potion:pp').click();await command(1,'switch/1').click();await resolve();
    await command(0,'potion:pp').click();await command(1,'switch/0').click();await resolve();
    assert.match(await marks.innerText(),new RegExp('魔王咒怨 · '+curse+' 层'));
    await page.reload();
    await add(0,4662,{atk:9999,spa:9999,spe:9999,maxHp:9000});
    await add(1,4950,{maxHp:1,def:1,spd:1,spe:1});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await command(0,'wiki:37469').click();await command(1,'potion:pp').click();await resolve();
    const promoted=page.locator('.team-fighter').nth(1);
    assert.match(await promoted.locator('.team-body').first().innerText(),/主位 · 帝皇之御/);
    assert.match(await promoted.innerText(),/副位空缺/);
    assert.equal(await promoted.getByRole('meter',{name:'帝皇之钺体力'}).getAttribute('aria-valuenow'),'0');
    await page.reload();
    await add(0,4454,{maxHp:9000});
    await add(1,3740,{maxHp:9000},1932);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    const own=page.locator('.team-fighter').nth(0),awakened=page.locator('.team-fighter').nth(1);
    assert.match(await own.innerText(),/爵刻 · 1 \/ 6 枚/);
    await command(0,'wiki:36312').click();await command(1,'wiki:32668').click();await resolve();
    assert.match(await own.innerText(),/爵刻 · 0 \/ 6 枚/);
    assert.match(await awakened.innerText(),/永恒之水 · [1-8] \/ 8 道/);
    await page.screenshot({path:path.join(__dirname,'team-ui-awakened-marks.png')});
    await page.reload();
    for(const side of [0,1])for(const id of [3524,3056,2988,4454,4386,4762])await add(side,id,{},id===3524?2005:null);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    const folds=page.locator('.team-more').filter({hasText:'结束衍化类异常'});
    assert.equal(await folds.count(),2);
    const opened=i=>folds.nth(i).evaluate(e=>e.open);
    assert.equal(await opened(0),false);await folds.first().locator('summary').click();assert.equal(await opened(0),true);assert.equal(await opened(1),false);
    await command(0,'potion:pp').click();await command(1,'potion:pp').click();await resolve();
    assert.equal(await opened(0),true);assert.equal(await opened(1),false);
    await page.reload();
    await add(0,4950,{maxHp:9000,atk:2400,spa:2400});
    await add(1,3056,{maxHp:1,def:1,spd:1});await add(1,2988);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await command(0,'wiki:38567').click();await command(1,'potion:pp').click();await resolve();
    await page.getByRole('button',{name:'确认补位'}).waitFor();
    const emperorCard=page.locator('.team-fighter').first();
    assert.match(await emperorCard.textContent(),/额外瀚宇星皇.*存活计数 \+1/);
    assert.equal(await emperorCard.locator('.team-bench button').count(),0);
    await command(1,'switch/1').click();await resolve();
    assert.match(await emperorCard.textContent(),/星皇之赐/);
    await page.reload();
    await add(0,4745,{maxHp:9000});
    await add(1,3056,{maxHp:9000});await add(1,2988,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    const opposing=page.locator('.team-fighter').nth(1);
    assert.match(await opposing.textContent(),/狩杀之的 · 已标记/);
    await command(0,'wiki:29006').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await opposing.locator('.team-resources').filter({hasText:'队伍效果'}).textContent(),/凡尔斯 · 狩杀之的/);
    await command(0,'potion:pp').click();await command(1,'switch/1').click();await resolve();
    assert.match(await opposing.locator('.team-resources').filter({hasText:'专属状态'}).textContent(),/狩杀之的 · 已标记/);
    await page.screenshot({path:path.join(__dirname,'team-ui-hunt-entry.png')});
    await page.reload();
    await add(0,4600,{maxHp:9000});await add(0,3056,{maxHp:9000});await add(0,2988,{maxHp:9000});
    await add(1,4956,{maxHp:9000});await add(1,2987,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    const linked=page.locator('.team-fighter').first(),plot=page.locator('.team-fighter').nth(1);
    assert.match(await linked.textContent(),/未来链接.*3 \/ 3 级/);assert.match(await plot.textContent(),/起承转合.*起/);
    await command(0,'switch/1').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await linked.locator('.team-resources').filter({hasText:'专属状态'}).textContent(),/未来链接.*3 \/ 3 级/);
    await page.screenshot({path:path.join(__dirname,'team-ui-links-and-plot.png')});
    await page.reload();await load(0,4004);
    const prayerPicker=page.locator('#wiki-detail-0');
    for(const [key,tier] of [['38472','0–4只'],['38472@5','5只'],['38472@6','6只']]){
      const choice=prayerPicker.locator('label').filter({has:page.locator('input[value="'+key+'"]')});
      assert.match(await choice.textContent(),new RegExp('待命背包精灵王 '+tier));
    }
    const six=prayerPicker.locator('input[value="38472@6"]');
    if(!await six.isChecked()){
      const replaced=await prayerPicker.locator('input[data-wiki-side]:checked').last().getAttribute('value');
      await prayerPicker.locator('input[value="'+replaced+'"]').uncheck();
      await six.check();
    }
    await page.getByRole('button',{name:'将当前配招和养成加入 A 队'}).click();await add(1,2988,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await command(0,'wiki:38472@6').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await page.locator('.team-fighter').first().locator('.hp-numbers').innerText(),/^1 \/ /);
    await page.screenshot({path:path.join(__dirname,'team-ui-prayer-six.png')});
    await page.goto(origin+'/index.html?mode=team');
    await add(0,4677,{maxHp:9000,atk:500,spa:100});await add(0,3056,{maxHp:9000});await add(1,2988,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    for(let turn=0;turn<2;turn++){await command(0,'potion:pp').click();await command(1,'potion:pp').click();await resolve();}
    const astrolabe=page.locator('.team-fighter').first().locator('.team-resources').filter({hasText:'星盘'});
    assert.match(await astrolabe.innerText(),/星盘 · 1 \/ 12 刻 · 前进/);
    await command(0,'switch/1').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await page.locator('.team-fighter').first().innerText(),/星辰万象·天启星魂 · 星盘 · 1 \/ 12 刻 · 前进/);
    await command(0,'switch/0').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await page.locator('.team-fighter').first().innerText(),/星盘 · 1 \/ 12 刻 · 前进/);
    await page.screenshot({path:path.join(__dirname,'team-ui-astrolabe-recovery.png')});
    await page.goto(origin+'/index.html?mode=team');
    await add(0,3432,{maxHp:9000},null,[29465]);await add(0,3291,{maxHp:9000});await add(1,4147,{maxHp:4000},2110);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    assert.match(await page.locator('.team-fighter').first().innerText(),/血月 · 中立，等待归属/);
    await command(0,'wiki:29465').click();await command(1,'potion:pp').click();await resolve();
    assert.match(await page.locator('.team-fighter').first().innerText(),/血月 · 暂停，余 2 回合/);
    await page.screenshot({path:path.join(__dirname,'team-ui-bloodmoon-recovery.png')});
    await page.goto(origin+'/index.html?mode=team');
    await add(0,3056,{maxHp:9000});await add(0,4186,{maxHp:9000},2028);await add(1,4468,{maxHp:9000},null,[36386]);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await visibleResource(page.locator('.team-fighter').first(),/额外龙守护 · 己方当回合免疫异常/);
    await page.screenshot({path:path.join(__dirname,'team-ui-town-dragon-guard.png')});
    await command(0,'potion:pp').click();await command(1,'potion:pp').click();await resolve();
    assert.doesNotMatch(await page.locator('.team-fighter').first().textContent(),/额外龙守护 · 己方当回合免疫异常/);
    await page.goto(origin+'/index.html?mode=team');
    await add(0,3739,{maxHp:1000},null,[29211]);await add(0,2988,{maxHp:9000});await add(1,3056,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await visibleResource(page.locator('.team-fighter').first(),/苍茫树海 · 生命力 210 · 每次触发 1 次/);
    await command(0,'switch/1').click();await command(1,'potion:pp').click();await resolve();
    await visibleResource(page.locator('.team-fighter').first(),/玛洛迪斯 · 苍茫树海 · 生命力 210/);
    await page.screenshot({path:path.join(__dirname,'team-ui-forest-recovery.png')});
    await page.goto(origin+'/index.html?mode=team');
    await add(0,3056,{maxHp:9000});await add(0,3986,{maxHp:6000});await add(1,2987,{maxHp:9000});await add(1,2988,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await command(0,'potion:pp').click();await command(1,'switch/1').click();await resolve();
    await visibleResource(page.locator('.team-fighter').nth(1),/神印 · 1 \/ 3 层/);
    await command(0,'potion:pp').click();await command(1,'switch/0').click();await resolve();
    await visibleResource(page.locator('.team-fighter').nth(1),/凡尔斯 · 神印 · 1 \/ 3 层/);
    await page.screenshot({path:path.join(__dirname,'team-ui-origin-recovery.png')});
    await page.goto(origin+'/index.html?mode=team');
    await add(0,4372,{maxHp:9000});await add(0,3056,{maxHp:9000});await add(1,3289,{maxHp:9000},null,[23556]);await add(1,2988,{maxHp:9000});
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await visibleResource(page.locator('.team-fighter').first(),/本次在场首次技能 · 睡眠判定待触发/);
    await command(0,'potion:pp').click();await command(1,'wiki:23556').click();await resolve();
    assert.ok(await command(1,'switch/1').isDisabled());
    await page.screenshot({path:path.join(__dirname,'team-ui-fox-release.png')});
    await command(0,'potion:pp').click();await command(1,'potion:pp').click();await resolve();assert.ok(await command(1,'switch/1').isEnabled());
    await page.goto(origin+'/index.html?mode=team');
    await add(0,4321,{maxHp:100,def:1});await add(0,3056,{maxHp:9000});await add(1,3056,{maxHp:9000,atk:9999},null,[10127]);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await visibleResource(page.locator('.team-fighter').first(),/圣铸资格 · 本场首次死亡可触发/);
    await command(0,'potion:pp').click();await command(1,'wiki:10127').click();await resolve();
    await page.getByRole('button',{name:'确认补位'}).waitFor();
    await visibleResource(page.locator('.team-fighter').first(),/圣铸资格 · 本场已触发 · 不再授剑/);
    await page.screenshot({path:path.join(__dirname,'team-ui-holy-first-death.png')});
    for(const [id,soul,seed,status]of [[4125,1356,12,'凝滞'],[4459,1672,4,'凝滞'],[4509,1722,27,'瘫痪']]){
      await page.goto(origin+'/index.html?mode=team');
      await add(0,id,{maxHp:9000},soul,id===4125?[14102]:[]);await add(0,2987,{maxHp:9000});await add(1,3056,{maxHp:9000},null,[10127]);await add(1,2988,{maxHp:9000});
      await page.locator('#seed').fill(String(seed));await page.locator('#criticals').uncheck();await page.getByRole('button',{name:'开始队伍对战'}).click();
      for(let turn=0;turn<(id===4125?2:1);turn++){await command(0,id===4125?'wiki:14102':'potion:pp').click();await command(1,id===4509?'wiki:10127':'potion:pp').click();await resolve();}
      assert.match(await page.locator('.team-fighter').nth(1).innerText(),new RegExp(status));assert.ok(await command(1,'switch/1').isDisabled());
      await page.screenshot({path:path.join(__dirname,'team-ui-random-soul-'+id+'.png')});
      await command(0,'switch/1').click();await command(1,'potion:pp').click();await resolve();
      for(let turn=0;turn<4;turn++){if(await command(1,'switch/1').isEnabled())break;await command(0,'potion:pp').click();await command(1,'potion:pp').click();await resolve();}
      assert.ok(await command(1,'switch/1').isEnabled());await command(0,'potion:pp').click();await command(1,'switch/1').click();await resolve();
      assert.match(await page.locator('.team-fighter').nth(1).innerText(),/凡尔斯/);
    }
    }
    await page.goto(origin+'/index.html?mode=team');
    await add(0,4500,{maxHp:9000});await add(0,2988,{maxHp:9000});await add(1,4516,{maxHp:9000},null,[36662,20060]);
    await page.locator('#seed').fill('13');await page.locator('#criticals').uncheck();await page.getByRole('button',{name:'开始队伍对战'}).click();
    for(const move of [36662,20060]){await command(0,'potion:pp').click();await command(1,'wiki:'+move).click();await resolve();}
    await visibleResource(page.locator('.team-fighter').first(),/第五技能 · 已解封/);
    await command(0,'switch/1').click();await command(1,'potion:pp').click();await resolve();await command(0,'switch/0').click();await command(1,'potion:pp').click();await resolve();
    await visibleResource(page.locator('.team-fighter').first(),/首次三色龙鳞 · 本场已获得 · 返场不重授/);
    await visibleResource(page.locator('.team-fighter').first(),/第五技能 · 已解封/);
    for(const card of await page.locator('.team-fighter').all())await visibleResource(card,/来源 A 方 武心婵/);
    const activeScales=page.locator('.team-fighter').first().locator('.effect-chip').filter({
      hasText:/^(红色龙鳞|黄色龙鳞|蓝色龙鳞|白色龙鳞) · /,
    });
    assert.equal(await activeScales.count(),0);
    await page.screenshot({path:path.join(__dirname,'team-ui-royal-return.png')});
    await page.goto(origin+'/index.html?mode=team');
    await add(0,3056,{maxHp:9000},null,[20117]);await add(0,4814,{maxHp:9000});await add(1,4516,{maxHp:9000},null,[36662]);
    await page.locator('#seed').fill('13');await page.locator('#criticals').uncheck();await page.getByRole('button',{name:'开始队伍对战'}).click();
    for(let hit=0;hit<2;hit++){
      await command(0,'wiki:20117').click();await command(1,'potion:pp').click();await resolve();await command(0,'potion:pp').click();await command(1,'wiki:36662').click();await resolve();
      await visibleResource(page.locator('.team-fighter').first(),/娜诺场下守护 · 己方场下非满体精灵体力不会下降/);
      assert.match(await page.locator('.team-fighter').first().locator('.team-bench').innerText(),/6750 \/ 9000/);
    }
    await page.screenshot({path:path.join(__dirname,'team-ui-nano-bench-guard.png')});
    await page.goto(origin+'/index.html?mode=single');
    await page.locator('#fighter-0 .move').first().click();await page.locator('#fighter-1 .move').first().click();await page.locator('#resolve').click();
    assert.match(await page.locator('#battle-log').innerText(),/第 1 回合/);
    assert.deepEqual(errors,[]);
    if(process.env.SEER_UI_FOCUS==='bench-guard'){console.log('Edge focused browser passed: Royal scale lifecycle and source ownership; Nano real bench HP guard; single mode.');return;}
    console.log('Edge browser passed: all six roster sizes; versions; skills; both potions; selection; HP; switch lock and expiry; simultaneous switch; forced replacement; fainted reserve; responsive viewport; primary and reserve bodies; promotion; awakened resources; independent status expansion after turn; extra Star Emperor buff without a reserve button; marked opponent on the bench and in battle; single mode.');
  }finally{
    if(browser)await browser.close();
    if(server.exitCode===null){const done=once(server,'exit');server.kill();await done;}
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});


