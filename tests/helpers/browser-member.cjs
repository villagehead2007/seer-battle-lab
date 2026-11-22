'use strict';
module.exports=async function member(page,side,id,overrides={},configure){
  await page.locator('#wiki-query-'+side).fill(String(id));
  await page.locator('#wiki-search-'+side+' button').click();
  await page.locator('[data-load-side="'+side+'"][data-id="'+id+'"]').click();
  await page.locator('#wiki-detail-'+side+' .wiki-moves').waitFor();
  if(configure)await configure(page,side);
  const fields=page.locator('.growth-card').nth(side);
  const details=fields.locator('details.override');
  if(!await details.evaluate(n=>n.open))await details.locator('summary').click();
  for(const [k,v] of Object.entries(overrides))await fields.locator('[name="'+side+'-override-'+k+'"]').fill(String(v));
  if(new URL(page.url()).pathname!=='/room'){
    const entries=page.locator('.team-roster').nth(side).locator('.roster-entry'),count=await entries.count();
    await page.getByRole('button',{name:'将当前配招和养成加入 '+'AB'[side]+' 队'}).click();
    await entries.nth(count).waitFor();return;
  }
  const count=(await page.evaluate(()=>fetch('/state').then(r=>r.json()))).team.length;
  await page.getByRole('button',{name:'将当前配招和养成加入我的队伍'}).click();
  await page.waitForFunction(async count=>(await (await fetch('/state')).json()).team?.length===count+1,count);
};
