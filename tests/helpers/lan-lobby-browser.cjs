'use strict';
const assert=require('node:assert/strict');
module.exports=async function checkLobby(modes,browser,join,base){
  const launch=modes.getByRole('button',{name:'局域网开房'}),copy=modes.getByRole('button',{name:'复制邀请链接'});
  const host=modes.getByRole('link',{name:'房主进入 A 方'}),details=modes.locator('#other-networks');
  const close=modes.getByRole('button',{name:'关闭房间'});
  const health=await (await modes.request.get(base+'/api/launcher/health')).json();
  const adapters=await require('../../lan-networks.cjs').networks();
  const displayed=await modes.locator('#network-name').innerText();
  assert.equal(new URL(join).hostname,adapters[0].ip);assert.ok(displayed.includes(adapters[0].name));
  assert.match(new URL(join).hash,/^#[0-9a-f]{48}$/);assert.equal(await launch.count(),0);
  assert.equal(await details.evaluate(n=>n.open),false);assert.equal(await modes.locator('textarea:visible').count(),1);
  assert.equal(await modes.locator('#invite-url').inputValue(),join);
  const expected=adapters[0].kind==='wifi'?'发给连接同一 Wi-Fi 的朋友':'发给连接同一有线局域网的朋友';
  assert.equal(await modes.locator('#invite-purpose').innerText(),expected);
  assert.ok(await modes.locator('#invite-url').evaluate(n=>n.labels[0].compareDocumentPosition(n)&Node.DOCUMENT_POSITION_FOLLOWING));
  assert.equal(await modes.getByText('在这台电脑上测试双人对战').isVisible(),true);
  assert.equal(await modes.getByRole('link',{name:'本机 B 方入口'}).isVisible(),true);
  const a=await browser.newPage(),b=await browser.newPage();
  await Promise.all([a.goto(await host.getAttribute('href')),b.goto(join)]);
  for(const [p,side] of [[a,0],[b,1]]){
    await p.getByRole('heading',{name:/我的队伍/}).waitFor();
    assert.equal(await p.evaluate(async()=>(await (await fetch('/state')).json()).side),side);
  }
  await modes.reload();await host.waitFor();assert.equal(await launch.count(),0);
  await modes.setViewportSize({width:360,height:800});
  assert.ok(await modes.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const ha=await modes.locator('#invite-url').boundingBox(),cb=await copy.boundingBox();assert.ok(cb.y>=ha.y+ha.height);
  if(adapters.length>1){
    await details.locator('summary').click();
    assert.equal(await modes.locator('textarea:visible').count(),adapters.length);
    const labels=await modes.locator('#alternatives label').allTextContents();
    for(const [index,item] of adapters.slice(1).entries()){
      assert.ok(labels[index].includes(item.name));
      if(item.purpose)assert.ok(labels[index].includes(item.purpose));
    }
    await modes.locator('#alternatives button').first().click();
    assert.equal(new URL(await modes.evaluate(()=>navigator.clipboard.readText())).hostname,adapters[1].ip);
  }
  async function closeRoom(){
    modes.once('dialog',d=>d.accept());await close.click();await launch.waitFor();
    assert.equal(await host.count(),0);assert.equal(await copy.count(),0);
  }
  await closeRoom();
  // Exercise a still-running, pre-update server on this same disposable port.
  await modes.route('**/api/lan/open',async route=>{
    const response=await route.fetch(),old=await response.json();delete old.networks;await route.fulfill({json:old});
  });
  await modes.route('**/lan-adapters.local.json',route=>route.fulfill({json:{pid:health.pid,revision:health.revision,networks:adapters}}));
  await launch.click();await host.waitFor();
  await modes.waitForFunction(ip=>new URL(document.querySelector('#invite-url').value).hostname===ip,adapters[0].ip);
  await copy.click();assert.equal(new URL(await modes.evaluate(()=>navigator.clipboard.readText())).hostname,adapters[0].ip);
  const localGuest=await browser.newPage();
  await localGuest.goto(await modes.getByRole('link',{name:'本机 B 方入口'}).getAttribute('href'));
  await localGuest.getByRole('heading',{name:/我的队伍/}).waitFor();
  assert.equal(await localGuest.evaluate(async()=>(await (await fetch('/state')).json()).side),1);
  await closeRoom();
  console.log('Passed invitation clipboard and guest join, loopback B, legacy and current room controls, 360px layout and adapter switching. Selected '+displayed);
};
