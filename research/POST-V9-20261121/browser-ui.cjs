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
    const [output]=await once(server.stdout,'data');
    const origin=String(output).match(/Local: (http:\/\/127\.0\.0\.1:\d+)/)?.[1];
    assert.ok(origin);
    browser=await chromium.launch({channel:'msedge',headless:true});
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    page.setDefaultTimeout(12000);
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    async function load(side,id){
      const input=page.locator('#wiki-query-'+side);
      await input.fill(String(id));await input.press('Enter');
      await page.locator(`#wiki-results-${side} [data-id="${id}"]`).click();
      await page.waitForFunction(([side,id])=>document.querySelector('#wiki-detail-'+side+' h4')?.textContent.includes('#'+id),[side,id]);
    }
    async function add(side,id){
      await load(side,id);
      await page.getByRole('button',{name:`将当前配招和养成加入 ${side?'B':'A'} 队`}).click();
      await page.locator('.team-roster').nth(side).locator('.roster-entry').first().waitFor();
    }
    async function checkJournal(container){
      const log=page.locator(container);
      const summary=log.locator('details > summary').filter({hasText:/B 方使用凝寒止喧，命中 \d+ 段，A 方共损失 \d+ 点体力/});
      await summary.waitFor();
      assert.equal(await summary.count(),1);
      const row=summary.locator('..');
      assert.equal(await row.evaluate(n=>n.open),false);
      const text=await log.innerText();
      assert.match(text,/先制 -100 \/ [0-9]+/);
      const skillAt=text.indexOf('B 方使用凝寒止喧'),potionAt=text.indexOf('A 方 使用了血药');
      assert.ok(skillAt>=0&&potionAt>skillAt,text);
      await summary.click();
      assert.match(await row.innerText(),/第 1 段.*损失[\s\S]+完整结算/);
    }

    async function checkMarsDetails(mode){
      const attr=mode==='单精灵'?'data-move':'data-team-choice';
      const tip=page.getByRole('tooltip');
      async function expectTip(button,count,patterns){
        await button.hover();
        await tip.waitFor();
        const text=await tip.innerText();
        for(const pattern of patterns)assert.match(text,pattern);
        assert.equal(await tip.locator('li').count(),count);
        const metrics=await tip.evaluate(el=>({client:el.clientHeight,content:el.scrollHeight}));
        if(metrics.content>metrics.client){
          await tip.hover();
          await page.mouse.wheel(0,metrics.content);
          await page.waitForFunction(()=>{
            const el=document.querySelector('#sp-mars-move-tooltip');
            return el.scrollTop+el.clientHeight>=el.scrollHeight-1;
          });
        }
        assert.ok(await tip.locator('li').last().evaluate(el=>{
          const line=el.getBoundingClientRect(),panel=el.closest('[role="tooltip"]').getBoundingClientRect();
          return line.top>=panel.top&&line.bottom<=panel.bottom&&line.bottom<=innerHeight;
        }));
      }
      const move=id=>page.locator(`[data-side="0"][${attr}="${id}"]`);
      for(const [id,count,checks] of [
        [2000102,7,[/机械特攻 · 威力 150 · PP 5 · 必中 · 基础先制 \+0/,/每次使用且命中/,/极速担任主位.*额外延长 1 回合/,/伤害免疫和伤害限制/]],
        [2000103,6,[/机械特攻 · 威力 90 · PP 20 · 必中 · 基础先制 \+3/,/疲惫 1 回合/,/最大体力的 1\/4/,/技能无效时，仍消除/]],
        [2000104,5,[/属性技能 · 威力 0 · PP 5 · 必中 · 基础先制 \+0/,/4 回合内.*1\/3/,/下 2 回合先制 \+2/,/已阵亡的形态也会激活/]],
        [2000105,6,[/属性技能 · 威力 0/,/350 点体力/,/300 点护盾/,/技能无效时.*1\/2.*50%/]],
      ])await expectTip(move('wiki:'+id),count,checks);
      const fighter=mode==='单精灵'?'#fighter-0':'.team-fighter.side-a';
      const summary=page.locator(fighter+' summary[data-move-detail="wiki:2000101"]');
      await expectTip(summary,9,[/属性技能 · 威力 0 · PP 5 · 必中 · 基础先制 \+3/,/原第五 · 技能效果/,
        /5 回合内免疫并反弹/,/存活形态/,/1\/4 的真实伤害/,/下回合开始时换位/,/吸取对手最大体力的 1\/3/,
        /整招无效时仍执行.*魂印词条/]);
      await summary.click();
      for(const [form,count,checks] of [
        ['wall',13,[/坚壁分支/,/反弹异常状态效果不触发/,/不高于 200 点.*300 点护盾/,/免疫下一次受到的攻击/]],
        ['swift',12,[/极速分支/,/任一项消除成功/,/延长 1 回合.*不新建/,/附加 1 层印记二/]],
        ['ruin',13,[/毁灭分支/,/70% 的固定伤害/,/2 回合内对手无法主动切换/,/无视对手的伤害减少/,/伤害提高 100%/]],
      ])await expectTip(move('sp-mars-fifth:'+form),count,checks);
      await page.keyboard.press('Escape');
      await tip.waitFor({state:'hidden'});
      console.log(`Edge ${mode}实际鼠标悬停验证四个普通技能、第五主按钮和三种形态，滚动可读末行`);
    }

    await page.goto(origin+'/?mode=team');
    await add(0,4762);await add(1,3886);
    const notes=page.locator('.team-roster').first().locator('details').filter({hasText:'词条状态'});
    await notes.locator('summary').click();
    assert.equal(await notes.locator('p').filter({hasText:'已通过正式验收'}).count(),6);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    const combat=page.locator('.team-notes');
    await combat.locator('summary').click();
    assert.equal(await combat.locator('p').filter({hasText:/咤克斯.*已通过正式验收/}).count(),6);
    console.log('Edge 组队和对战均显示咤克斯 6 条正式验收');
    await page.locator('[data-side="0"][data-team-choice="potion:hp"]').click();
    await page.locator('[data-side="1"][data-team-choice="wiki:37809"]').click();
    await page.locator('[data-team-resolve]').click();
    await checkJournal('.team-journal .battle-log');
    console.log('Edge 多精灵对战单条连击，展开逐段并在血药前结算');

    await page.goto(origin+'/');
    await load(0,4762);await load(1,3886);
    await page.locator('#wiki-start').click();
    assert.match(await page.locator('[data-side="0"][data-move="wiki:37914"]').innerText(),/先制 \+1/);
    await page.locator('[data-side="0"][data-move="potion:hp"]').click();
    await page.locator('[data-side="1"][data-move="wiki:37809"]').click();
    await page.locator('#resolve').click();
    await checkJournal('#battle-log');
    console.log('Edge 单精灵对战单条连击，展开逐段并在血药前结算');

    await page.goto(origin+'/');
    await load(0,20001);await load(1,4765);
    await page.locator('#wiki-start').click();
    await checkMarsDetails('单精灵');
    await page.locator('[data-side="0"][data-move="sp-mars-fifth:swift"]').click();
    await page.locator('[data-side="1"][data-move="potion:pp"]').click();
    await page.locator('#resolve').click();
    assert.match(await page.getByLabel('A 方马尔修斯状态').innerText(),/预约切位.*极速/);
    await page.locator('[data-side="0"][data-move="potion:pp"]').click();
    await page.locator('[data-side="1"][data-move="potion:pp"]').click();
    await page.locator('#resolve').click();
    assert.match(await page.getByLabel('A 方马尔修斯状态').innerText(),/极速（主位）/);
    console.log('Edge 单精灵从正式目录载入 SP 马尔修斯，选择第五分支并实际切位');

    await page.goto(origin+'/?mode=team');
    await add(0,20001);await add(1,4969);
    await page.getByRole('button',{name:'开始队伍对战'}).click();
    await page.setViewportSize({width:1120,height:650});
    await checkMarsDetails('多精灵');
    await page.setViewportSize({width:1440,height:1000});
    await page.locator('[data-side="0"][data-team-choice="sp-mars-fifth:ruin"]').click();
    await page.locator('[data-side="1"][data-team-choice="potion:pp"]').click();
    await page.locator('[data-team-resolve]').click();
    assert.match(await page.locator('.team-fighter').first().innerText(),/预约切位.*毁灭/);
    await page.locator('[data-side="0"][data-team-choice="potion:pp"]').click();
    await page.locator('[data-side="1"][data-team-choice="potion:pp"]').click();
    await page.locator('[data-team-resolve]').click();
    assert.match(await page.locator('.team-fighter').first().innerText(),/毁灭（主位）/);
    console.log('Edge 多精灵从正式目录载入 SP 马尔修斯和米铃娜，选择第五分支并实际切位');

    for(const [id,oldSoul,newSoul,skill,name] of [[3592,886,2169,29524,'焦魂冥墟'],[3396,709,2170,29525,'夜暝渊墟']]){
      for(const soulId of [oldSoul,newSoul]){
        await page.goto(origin+'/?mode=team');
        await load(0,id);
        await page.locator('[data-soul-side="0"]').selectOption(String(soulId));
        const picker=page.locator('#wiki-detail-0'),skillBox=picker.locator(`input[value="${skill}"]`);
        if(!await skillBox.isChecked()){
          const old=await picker.locator('input[data-wiki-side]:checked').last().getAttribute('value');
          await picker.locator(`input[value="${old}"]`).uncheck();
          await skillBox.check();
        }
        await page.getByRole('button',{name:'将当前配招和养成加入 A 队'}).click();
        const configured=page.locator('.team-roster').first().locator('.roster-moves');
        await configured.waitFor();
        assert.match(await configured.innerText(),new RegExp(name));
      }
    }
    assert.deepEqual(errors,[]);
    console.log('Edge 修罗、潘多拉的新旧魂印都能选新技能并加入队伍');
  }finally{
    await browser?.close();
    if(server.exitCode===null)server.kill();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
