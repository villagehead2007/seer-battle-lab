'use strict';
// Run with Playwright available on NODE_PATH. Uses two isolated Edge contexts.
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {once}=require('node:events');
const {chromium}=require('playwright');
const path=require('node:path');
const local=spawn(process.execPath,['server.cjs'],{cwd:path.join(__dirname,'..'),env:{...process.env,PORT:'0'},stdio:['ignore','pipe','inherit']});
const state=page=>page.evaluate(()=>fetch('/state').then(r=>r.json()));
const retry=async(page,key,target=null,epoch)=>{
  const {matchId}=await state(page);
  return page.evaluate(async data=>(await fetch('/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})).status,
    {op:'lock',matchId,key,target,epoch});
};
const member=require('./helpers/browser-member.cjs');
async function lock(page,key){
  await page.locator('[data-team-choice="'+key+'"]:enabled').click();
  await page.getByRole('button',{name:'锁定本回合行动'}).click();
}
(async()=>{
 let browser;
 try{
  const [line]=await once(local.stdout,'data'),base=line.toString().trim().split(' ').at(-1);
  browser=await chromium.launch({channel:'msedge',headless:true});
  const ctxA=await browser.newContext(),ctxB=await browser.newContext();
  const modes=await ctxA.newPage();await modes.goto(base+'/modes.html');
  for(const selector of ['a[href="./"]','a[href="index.html?mode=team"]']){
    const p=await ctxA.newPage();await p.goto(new URL(await modes.locator(selector).getAttribute('href'),base).href);
    await p.locator(selector.includes('team')?'.team-setup':'#resolve').waitFor();await p.close();
  }
  await modes.getByRole('button',{name:'局域网开房'}).click();
  const host=modes.getByRole('link',{name:'房主进入 A 方'});await host.waitFor();
  const copy=modes.getByRole('button',{name:'复制邀请链接'});
  await ctxA.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
  await modes.waitForFunction(()=>!document.querySelector('#room-info').hidden);
  let join;
  if(await copy.isVisible()){
    await copy.click();await modes.getByText(/已复制邀请链接/).waitFor();
    join=await modes.evaluate(()=>navigator.clipboard.readText());
  }else join=await modes.getByRole('link',{name:'本机 B 方入口'}).getAttribute('href');
  if(process.argv.includes('--lobby-only')){await require('./helpers/lan-lobby-browser.cjs')(modes,browser,join,base);return;}
  const a=await ctxA.newPage(),b=await ctxB.newPage();
  for(const p of [a,b]){p.on('pageerror',err=>console.error('Browser:',err.message));p.setDefaultTimeout(60000);}
  await Promise.all([a.goto(await host.getAttribute('href')),b.goto(join)]);
  await Promise.all([a,b].map(p=>p.getByRole('heading',{name:/我的队伍/}).waitFor()));
  assert.equal((await state(a)).side,0);assert.equal((await state(b)).side,1);
  assert.equal(await a.locator('#wiki-query-1').isVisible(),false);assert.equal(await b.locator('#wiki-query-0').isVisible(),false);
  console.log('Independent seats through mode picker; guest used '+new URL(join).hostname);
  assert.equal((await b.request.get(new URL('/api/launcher/health',join).href)).status(),403);
  if(process.argv.includes('--match-controls')){await require('./helpers/lan-match-browser.cjs')({a,b,member,lock,state});return;}
  if(process.argv.includes('--wudao')){await require('./helpers/4766-wudao-browser.cjs')({a,b,member,lock,state,base});return;}
  const solo=await ctxA.newPage();await solo.goto(base+'/index.html?mode=team');
  for(const p of [solo,a,b]){assert.equal(await p.locator('.team-setup .team-roster').count(),2);assert.ok(await p.locator('.growth-card:visible').count());}
  const attacker={atk:200,spa:200,spe:9999,maxHp:9999},fallen={def:200,spd:200,spe:1,maxHp:40};
  await member(solo,0,3886,attacker);await member(solo,1,2988,fallen);await member(solo,1,3056,{maxHp:30});
  await solo.getByRole('button',{name:'开始队伍对战'}).click();
  await solo.locator('[data-team-choice="wiki:37809"][data-side="0"]').click();
  await solo.locator('[data-team-choice="potion:pp"][data-side="1"]').click();
  await solo.locator('[data-team-resolve]').click();
  await solo.locator('.log-hit-details').first().waitFor();
  await member(a,0,3886,attacker);
  await member(b,1,2988,fallen);
  await member(b,1,3056,{def:1,spd:1,spe:1,maxHp:30});
  assert.equal((await state(a)).team.length,1);
  await Promise.all([a,b].map(p=>p.getByRole('button',{name:'准备开战'}).click()));
  for(const [p,own] of [[a,0],[b,1]]){
    await p.locator('.team-combat .team-move').first().waitFor();
    assert.equal(await p.locator('.team-fighter').nth(1-own).locator('button').count(),0);
    const move=p.locator('.team-fighter').nth(own).locator('.team-move[data-move-detail]').first();
    await move.hover();await p.getByRole('tooltip').waitFor();
  }
  await lock(b,'potion:pp');await lock(a,'wiki:37809');
  await b.getByRole('heading',{name:'选择补位成员和本回合行动'}).waitFor();
  for(const p of [solo,a,b]){
    assert.equal(await p.locator('.team-cards .team-fighter').count(),2);
    for(const selector of ['.team-hp','.team-stages','.soul-card','.equipment-summary','.affinity-summary'])assert.ok(await p.locator(selector).count()>0);
    const j=p.locator('.team-journal'),hit=j.locator('.log-hit-details').first();await hit.locator('summary').click();
    assert.ok(await hit.locator('.log-hit-segments li').count()>1);
    assert.ok(await hit.locator('.log-hp-target').innerText().then(x=>x.includes('HP')));
    const arena=await p.locator('.team-arena').boundingBox(),journal=await j.boundingBox();assert.ok(journal.x>=arena.x+arena.width-1);
    if(process.argv.includes('--screens')){
      await p.evaluate(()=>document.querySelector('.team-combat').scrollIntoView());
      await p.screenshot({path:path.join(require('node:os').tmpdir(),'seer-team-compare-'+([solo,a,b].indexOf(p))+'.png')});
    }
    await p.setViewportSize({width:390,height:844});
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const first=await p.locator('.team-fighter').first().boundingBox(),second=await p.locator('.team-fighter').nth(1).boundingBox();
    assert.ok(second.y>=first.y+first.height-1);
  }
  const before=await state(a),pending=await state(b);
  await b.getByRole('button',{name:/^补位 /}).click();
  await lock(b,pending.options[0].actions.find(x=>x.key.startsWith('wiki:')).key);
  await b.getByText('已私下锁定，等待对手。').waitFor();
  const after=await state(a);
  assert.deepEqual(after,{...before,locked:[false,true]});
  assert.ok(!JSON.stringify(after).includes(pending.options[0].name));
  assert.equal(await retry(b,'potion:pp',1,before.epoch),400);
  await ctxB.setOffline(true);await b.getByText(/连接中断/).waitFor();await ctxB.setOffline(false);await b.reload();
  await b.getByText('已私下锁定，等待对手。').waitFor();assert.equal((await state(b)).side,1);
  await lock(a,'wiki:37809');
  await a.getByRole('heading',{name:/^[AB] 方获胜$/}).waitFor();await b.getByRole('heading',{name:/^[AB] 方获胜$/}).waitFor();
  const final=await state(a);assert.equal(final.winner,(await state(b)).winner);assert.equal(final.epoch,before.epoch+1);
  assert.equal(await retry(a,'wiki:37809',null,before.epoch),400);
  assert.deepEqual((await state(b)).history,final.history);assert.deepEqual((await state(b)).fighters,final.fighters);
  modes.once('dialog',dialog=>dialog.accept());await modes.getByRole('button',{name:'关闭房间'}).click();
  await host.waitFor({state:'detached'});await assert.rejects(()=>b.request.get(new URL('/state',join).href));
  assert.equal((await modes.request.get(base+'/api/launcher/health')).status(),200);
  console.log('Passed roster, KO blind lock, private response, refresh, duplicate lock, stale retry, synchronized victory and local entries.');
 }finally{await browser?.close();local.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
