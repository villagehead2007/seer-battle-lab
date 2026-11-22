'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process'),{once}=require('node:events');
const {chromium}=require('playwright'),G=require('../dist/growth-presets'),member=require('./helpers/browser-member.cjs');
const keys=['atk','spa','def','spd','spe','maxHp'];
async function run(){
  const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'0'},windowsHide:true});
  let browser;
  try{
    const origin=String((await once(server.stdout,'data'))[0]).match(/http:\/\/127\.0\.0\.1:\d+/)[0];
    browser=await chromium.launch({channel:'msedge'});
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);
    const field=(n,p=page)=>p.locator('[name="'+n+'"]');
    const values=sel=>sel.evaluate(e=>Array.from(e.options).map(o=>Number(o.value)).filter(n=>n>0));
    const slots=async p=>p.evaluate(()=>[0,1,2].map(j=>{
      const el=document.querySelector('[name="0-marks-'+j+'"]');
      return {id:Number(el.dataset.selected),stats:Object.fromEntries(['atk','spa','def','spd','spe','maxHp'].map(k=>[k,Number(document.querySelector('[name="0-inscription-'+j+'-'+k+'"]').value)])),
        total:document.getElementById('0-slot-total-'+j).textContent};
    }));
    const labels=['攻击','特攻','防御','特防','速度','体力'];
    function expected(mark,sort){
      const order=sort==='total'?keys:[sort,...keys.filter(k=>k!==sort)];
      return mark.name+' · '+mark.angles+'角 · '+order.map(k=>labels[keys.indexOf(k)]+' '+mark.stats[k]).join('　')+
        ' · 六维总和 '+G.total(mark.stats)+' · '+[mark.id,...G.aliases(mark.id).filter(id=>id!==mark.id)].map(id=>'#'+id).join(' / ');
    }
    const picker=field('0-marks-0');
    for(const [primary,alias] of [[42372,45043],[42373,45044]]){
      const search=field('0-marks-0-search'),name=G.item('marks',alias).name;
      await search.fill(String(alias));await picker.selectOption(String(alias));
      await page.locator('#apply-settings').click();
      assert.equal(await picker.inputValue(),String(alias));
      assert.equal((await values(picker)).length,871);
      for(const query of [name,String(primary),'#'+alias]){
        await search.fill(query);
        await field('0-marks-0-angles').selectOption('5');
        await field('0-marks-0-sort').selectOption('spe');
        assert.deepEqual(await values(picker),[alias]);assert.equal(await picker.inputValue(),String(alias));
        assert.equal(await picker.locator('option[value="current"]').count(),0);
        assert.equal(await picker.locator('option:checked').textContent(),expected(G.item('marks',alias),'spe'));
      }
      await field('0-marks-0-angles').selectOption('4');assert.deepEqual(await values(picker),[]);
      await field('0-marks-0-angles').selectOption('0');assert.equal(await picker.inputValue(),String(alias));
      await picker.selectOption('');await search.fill('');
    }
    for(const width of [1280,375]){
      await page.setViewportSize({width,height:800});
      await field('0-marks-0-sort').selectOption('spe');
      await field('0-marks-0-search').fill('特级全能刻印');
      await field('0-marks-0-angles').selectOption('5');
      const matches=G.candidates('marks','特级全能刻印','spe',5);
      assert.ok(matches.some(m=>m.id===40127)&&matches.some(m=>m.id===40128));
      assert.deepEqual(await picker.locator('option').allTextContents(),['手动填写',...matches.map(m=>expected(m,'spe'))]);
      await picker.click();
      const fits=await picker.evaluate(el=>{
        if(!el.matches(':open'))return false;
        const option=el.querySelector('option[value="40127"]'),box=option.getBoundingClientRect();
        const range=document.createRange();range.selectNodeContents(option);
        return box.width>0&&[...range.getClientRects()].every(r=>r.left>=0&&r.right<=innerWidth+1&&
          r.left>=box.left-1&&r.right<=box.right+1&&r.top>=box.top-1&&r.bottom<=box.bottom+1);
      });
      assert.ok(fits,'完整候选文本应位于 '+width+'px 视口和选项边界内');
      await page.keyboard.press('Escape');
      await field('0-marks-0-search').fill('');await field('0-marks-0-angles').selectOption('0');
      await field('0-marks-0-sort').selectOption('total');
    }
    await page.setViewportSize({width:1280,height:800});
    for(const [i,set] of G.sets.entries()){
      await field('0-bundle').selectOption(String(i));
      await page.locator('[data-apply-bundle="0"]').click();
      for(const [j,slot] of (await slots(page)).entries()){
        const mark=G.item('marks',set.ids[j]);assert.deepEqual(slot,{id:mark.id,stats:mark.stats,total:'本槽总和 '+G.total(mark.stats)});
      }
    }
    for(let j=0;j<3;j++){
      const name='0-marks-'+j,selected=field(name),before=(await slots(page))[j];
      const angleOptions=await field(name+'-angles').locator('option').allTextContents();
      assert.deepEqual(angleOptions,['全部','5角','4角','3角','2角']);
      for(const n of [5,4,3,2,0]){
        await field(name+'-angles').selectOption(String(n));
        assert.deepEqual(await values(selected),G.candidates('marks','','total',n).map(x=>x.id));
        assert.deepEqual((await slots(page))[j],before);
      }
      await field(name+'-angles').selectOption('5');
      await field(name+'-search').fill('圣战之');
      for(const key of [...keys,'total']){
        await field(name+'-sort').selectOption(key);
        const matches=G.candidates('marks','圣战之',key,5);
        assert.deepEqual(await values(selected),matches.map(x=>x.id));
        assert.deepEqual(await selected.locator('option').evaluateAll(opts=>opts.filter(o=>Number(o.value)>0).map(o=>o.textContent)),matches.map(m=>expected(m,key)));
      }
      await field(name+'-search').fill('alpha');const alpha=await values(selected);
      await field(name+'-search').fill('α');assert.deepEqual(await values(selected),alpha);assert.ok(alpha.includes(42315));
      await selected.selectOption('42315');assert.equal((await slots(page))[j].id,42315);
      await field('0-inscription-'+j+'-atk').fill('7');const edited=(await slots(page))[j];
      assert.equal(edited.id,0);assert.equal(edited.total,'本槽总和 247');
    }
    await field('0-titles-search').fill('爱好者');await field('0-titles').selectOption('151');
    await field('0-eyes-search').fill('鹰眼');await field('0-eyes').selectOption('1300773');
    await field('0-suit').selectOption('corrosion');assert.ok(await field('0-eyes').isDisabled());
    await field('0-suit').selectOption('none');assert.equal(await field('0-eyes').inputValue(),'');
    await field('0-eyes').selectOption('1300773');await field('0-annual').check();
    for(const key of keys)await field('0-team-'+key).check();
    await page.locator('#apply-settings').click();await page.locator('#export').click();
    const state=JSON.parse(await page.locator('#export-content').inputValue());await page.locator('#close-export').click();
    assert.equal(state.fighters[0].build.titleId,151);assert.equal(state.fighters[0].build.eyeId,1300773);
    assert.equal(state.fighters[1].build.titleId,null);
    for(const key of keys)assert.equal(Number(await page.locator('#preview-0-'+key).textContent()),state.fighters[0].stats[key]);
    const install=async(p,side)=>{
      await field(side+'-titles',p).selectOption('151');await field(side+'-eyes',p).selectOption('1301040');
      await field(side+'-annual',p).check();await field(side+'-team-maxHp',p).check();
      await field(side+'-bundle',p).selectOption('6');await p.locator('[data-apply-bundle="'+side+'"]').click();
    };
    // Same species on both sides exposes the exact equipment HP delta: 342+10+40+10+30.
    async function verifyHP(p,lan){
      const meters=p.locator('.team-fighter .team-hp:not(.compact) [role="meter"]');await meters.first().waitFor();
      const max=await meters.evaluateAll(els=>els.map(e=>Number(e.getAttribute('aria-valuemax'))));
      // 凡尔斯 additionally counts the three inscriptions’ 80 speed as HP.
      assert.equal(max[0]-max[1],lan?512:432,(lan?'LAN':'同屏/人机')+'面板 '+max);
    }
    for(const mode of ['team','team#cpu']){
      await page.goto('about:blank');await page.goto(origin+'/index.html?mode='+mode);
      await member(page,0,3056,{},install);await member(page,1,3056);await page.getByRole('button',{name:'开始队伍对战'}).click();
      await verifyHP(page,false);
    }
    const lobby=await browser.newPage();await lobby.goto(origin+'/modes.html');
    await lobby.getByRole('button',{name:'局域网开房'}).click();
    const link=lobby.getByRole('link',{name:'房主进入 A 方'});await link.waitFor();
    const a=await browser.newPage(),b=await browser.newPage();
    await a.goto(await link.getAttribute('href'));await b.goto(await lobby.locator('#local-guest').getAttribute('href'));
    await member(a,0,2988,{},install);await member(b,1,2988);
    await Promise.all([a,b].map(p=>p.getByRole('button',{name:'准备开战'}).click()));
    await verifyHP(a,true);await verifyHP(b,true);await b.reload();await verifyHP(b,true);
    lobby.once('dialog',d=>d.accept());await lobby.getByRole('button',{name:'关闭房间'}).click();
    assert.deepEqual(errors,[]);console.log('八套、三槽搜索/角数/排序、手改合计、互斥与单宠/同屏/人机/局域网实际面板通过');
  }finally{try{await browser?.close();}finally{server.kill();}}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
