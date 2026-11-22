'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {spawn}=require('node:child_process'),{once}=require('node:events'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),records=require('../../data/statuses/statuses.json').records;
async function run(){
  const server=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'0'},windowsHide:true});
  let browser;
  try{
    const origin=String((await once(server.stdout,'data'))[0]).match(/http:\/\/127\.0\.0\.1:\d+/)[0];
    browser=await chromium.launch({executablePath:process.env.CHROME_PATH});
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(origin);
    const slots=['major','minor','third'];
    const select=(side,slot)=>page.locator('[name="'+side+'-res-'+slot+'"]');
    for(const names of [['狂信','空定','神游'],['沸涌','魇昧','凝滞']]){
      for(const side of [0,1]){
        for(const [i,slot] of slots.entries()){
          const field=select(side,slot);
          const actual=await field.evaluate(el=>Array.from(el.children,c=>c.tagName==='OPTION'?c.textContent:[c.label,Array.from(c.children,o=>o.value)]));
          assert.deepEqual(actual,['不设置',...['控制类','弱化类'].map(c=>[c+'异常',records.filter(r=>r.category===c).map(r=>r.name)])]);
          await field.selectOption(names[i]);
        }
        await page.locator('[name="'+side+'-res-third-chance"]').fill('73');
      }
      await page.locator('#apply-settings').click();
      await page.locator('#export').click();
      const record=JSON.parse(await page.locator('#export-content').inputValue());
      for(const side of [0,1]){
        for(const [i,slot] of slots.entries())assert.equal(await select(side,slot).inputValue(),names[i]);
        assert.deepEqual(record.fighters[side].build.resistance.slots,names.map((name,i)=>({name,chance:[55,18,73][i]})));
      }
      await page.locator('#close-export').click();
    }
    for(const mode of ['single','team','team#cpu']){
      await page.goto('about:blank');
      await page.goto(mode==='single'?origin:origin+'/index.html?mode='+mode);
      for(const [side,id] of [20001,2988].entries()){
        const query=page.locator('#wiki-query-'+side);
        await query.fill(String(id));await query.press('Enter');
        await page.locator('#wiki-results-'+side+' [data-id="'+id+'"]').click();
        const rows=page.locator('#wiki-detail-'+side+' [data-order-skill]');
        await rows.nth(4).waitFor();
        const ids=()=>rows.evaluateAll(items=>items.map(item=>item.dataset.orderSkill));
        const [a,b,c,d,fifth]=await ids();
        await rows.first().getByRole('button',{name:/下移/}).click();
        assert.deepEqual(await ids(),[b,a,c,d,fifth]);
        assert.ok(await rows.nth(3).getByRole('button',{name:/下移/}).isDisabled());
        assert.ok(await rows.nth(4).getByRole('button',{name:/上移/}).isDisabled());
        const fifthBox=page.locator('#wiki-detail-'+side+' input[value="'+fifth+'"]');
        await fifthBox.uncheck();
        if(id===2988){
          const extra=page.locator('#wiki-detail-1 input[data-wiki-side]:enabled:not(:checked):not([value="'+fifth+'"])').first();
          await extra.click();assert.equal(await extra.isChecked(),false);
        }
        await fifthBox.check();
        const normal=page.locator('#wiki-detail-'+side+' input[value="'+d+'"]');
        await normal.uncheck();await normal.check();
        assert.deepEqual(await ids(),[b,a,c,d,fifth]);
        if(mode!=='single')await page.getByRole('button',{name:'将当前配招和养成加入 '+(side?'B':'A')+' 队',exact:true}).click();
      }
      if(mode==='single'){
        await page.locator('#wiki-start').click();
        await page.locator('#export').click();
        const battle=JSON.parse(await page.locator('#export-content').inputValue());
        assert.equal(battle.fighters[0].moves[4],'wiki:2000101');
        assert.deepEqual(battle.fighters[0].moves,battle.initial.wikiLoadouts[0].map(id=>'wiki:'+id));
        continue;
      }
      await page.getByRole('button',{name:'开始队伍对战',exact:true}).click();
      await page.locator('.team-fighter').first().waitFor();
      assert.match(await page.locator('.team-fighter').first().innerText(),/马尔修斯/);
    }
    assert.deepEqual(errors,[]);
    console.log('双方3槽×2类逐项、应用回显及导出；同屏和人机组队、手选、换序及SP第五进场通过');
  }finally{try{await browser?.close();}finally{server.kill();}}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
