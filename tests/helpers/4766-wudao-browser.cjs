'use strict';
const assert=require('node:assert/strict');
const gaia={maxHp:9000,def:3000,spd:3000,atk:120,spa:120,spe:99};
const foe={maxHp:9000,def:3000,spd:3000,atk:600,spa:120,spe:100};
const hp='potion:hp',pp='potion:pp',other='wiki:19121';

module.exports=async function wudao({a,b,member,lock,state,base}){
  const button=(page,name)=>page.getByRole('button',{name,exact:true});
  async function verify(page,team,direction,path){
    const card=page.locator(team?'.team-fighter.side-a':'#fighter-0');
    await card.getByText(new RegExp('武道[： ·]*'+direction+' · '+path)).first().waitFor();
  }
  async function localTurn(page,team,round,first,second){
    const attr=team?'data-team-choice':'data-move';
    for(const [side,key] of [first,second].entries())await page.locator(`[data-side="${side}"][${attr}="${key}"]`).click();
    await page.locator(team?'[data-team-resolve]':'#resolve').click();
    await page.locator(team?'.team-roundbar h2':'#round-label').filter({hasText:new RegExp('第 0?'+(round+1)+' 回合')}).waitFor();
  }
  async function loadSolo(page,side,id,stats){
    const query=page.locator('#wiki-query-'+side);
    await query.fill(String(id));await query.press('Enter');
    await page.locator(`[data-load-side="${side}"][data-id="${id}"]`).click();
    await page.locator('#wiki-detail-'+side+' .wiki-moves').waitFor();
    const details=page.locator('.growth-card').nth(side).locator('details.override');
    if(!await details.evaluate(el=>el.open))await details.locator('summary').click();
    for(const [key,value] of Object.entries(stats))await details.locator(`[name="${side}-override-${key}"]`).fill(String(value));
  }
  for(const team of [true,false]){
    const page=await a.context().newPage();
    page.setDefaultTimeout(15000);
    try{
      await page.goto(base+(team?'/?mode=team':'/'));
      const load=team?member:loadSolo;
      await load(page,0,4766,gaia);await load(page,1,2988,foe);
      await page.locator('#criticals').uncheck();
      await page.locator('#seed').fill('14');
      if(team)await button(page,'开始队伍对战').click();
      else await page.locator('#wiki-start').click();
      await verify(page,team,'正转','血道');
      const move=team?'wiki:37911':'wiki:37910';
      const expected=team?['邪道','邪道','天道','血道','邪道']:['血道','天道','邪道','血道','天道'];
      for(const [i,next] of expected.entries()){
        await localTurn(page,team,i+1,i===0?move:hp,!team&&i===0?pp:other);
        await verify(page,team,team?'正转':'逆转',next);
        const j=page.locator(team?'.team-journal':'#battle-log').locator('.log-turn').first();
        const hit=j.locator('[data-damage-type=attack]').filter({hasText:/灭战神决·盖亚/});
        if(team){
          assert.equal(await hit.count(),1);
          assert.equal(await hit.evaluate(el=>el.classList.contains('log-hp-zero')),i!==1);
        }
        const attr=team?'data-team-choice':'data-move';
        assert.match(await page.locator(`[data-side="0"][${attr}="${move}"]`).innerText(),new RegExp('PP '+(i<3?4:5)+' / 5'));
      }
      console.log('Edge '+(team?'队伍战正转，验证未挡分支':'单精灵逆转')+'，已验证每回武道和回满 PP。');
    }finally{await page.close();}
  }
  await member(a,0,4766,gaia);await member(b,1,2988,foe);
  await Promise.all([a,b].map(page=>button(page,'准备开战').click()));
  await Promise.all([a,b].map(page=>verify(page,true,'正转','血道')));
  await lock(b,pp);await lock(a,'wiki:37910');
  await Promise.all([a,b].map(page=>verify(page,true,'逆转','血道')));
  await lock(a,hp);await lock(b,other);
  await Promise.all([a,b].map(page=>verify(page,true,'逆转','天道')));
  const model=async page=>(await state(page)).panels[0].head.display.items.find(item=>item.name==='武道').value;
  assert.equal(await model(a),'逆转 · 天道');
  assert.equal(await model(b),'逆转 · 天道');
  await b.reload();await verify(b,true,'逆转','天道');
  assert.equal(await model(b),await model(a));
  console.log('Edge 独立联机房间房主与房客武道同步，房客刷新保留状态。');
};
