'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const member=require('./helpers/browser-member.cjs');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const p=await browser.newPage();
    p.on('pageerror',err=>console.error(err.message));
    await p.addInitScript(()=>{
      window.decisions=[];window.positions=[];
      const Native=Worker;
      window.Worker=class extends Native{
        postMessage(data){if(data.game)positions.push(data.game);super.postMessage(data);}
        constructor(...args){super(...args);this.addEventListener('message',({data})=>{
          if(data.error)console.error(data.error);
          if(data.done)window.decisions.push(data);
        });}
      };
    });
    p.on('console',msg=>{if(msg.type()==='error')console.error(msg.text());});
    await p.goto(process.argv[2]+'/modes.html');
    await p.getByRole('link',{name:'进入人机对战'}).click();
    const strong={atk:9999,spa:9999,spe:9999,maxHp:9999},weak={def:1,spd:1,spe:1,maxHp:40};
    const begin=()=>p.getByRole('button',{name:'开始队伍对战'}).click();
    const submit=async(key)=>{
      const old=await p.locator('.team-roundbar h2').innerText();
      await p.locator('[data-side="0"][data-team-choice="'+key+'"]').click();
      await p.locator('[data-team-resolve]').click();
      await p.waitForFunction(old=>document.querySelector('.team-roundbar h2')?.textContent!==old,old,{timeout:10000});
    };
    await member(p,0,3886,strong);await member(p,1,2988,weak);await p.evaluate(()=>{
      const create=TeamBattle.create;
      TeamBattle.create=(...args)=>{
        const result=create(...args);
        if(window.dualKO){
          result.phase='replace';result.pending=[0,1];result.battle.fighters.forEach(f=>f.hp=0);
        }
        window.actual=result;window.before=JSON.stringify(result);return result;
      };
      const native=crypto.getRandomValues.bind(crypto);
      crypto.getRandomValues=buf=>buf instanceof Uint32Array&&buf.length===1?(buf[0]=1729,buf):native(buf);
    });
    await begin();
    assert.equal(await p.locator('[data-side="1"][data-team-choice]:enabled').count(),0);
    assert.equal(await p.evaluate(()=>actual.battle.fighters[0].stats.atk),9999);
    await p.locator('[data-side="0"][data-team-choice="potion:hp"]').click();
    await p.waitForFunction(()=>decisions.length===1);
    const first=await p.evaluate(()=>decisions[0].action);
    assert.ok(await p.evaluate(()=>JSON.stringify(actual)===before));
    await submit('wiki:37809');await p.getByRole('heading',{name:'A 方获胜'}).waitFor();
    await p.getByRole('button',{name:'重新开局'}).click();
    await p.getByRole('heading',{name:'第 1 回合',exact:true,level:2}).waitFor();
    await p.locator('[data-side="0"][data-team-choice="wiki:37809"]').click();
    await p.waitForFunction(()=>decisions.length===2);
    assert.deepEqual(await p.evaluate(()=>decisions.at(-1).action),first);
    await p.getByRole('button',{name:'返回组队'}).click();
    await member(p,0,20001,strong);await member(p,1,3056,weak);
    await begin();
    await submit('potion:pp');
    await submit('switch/1');
    await p.locator('.team-move > summary[data-move-detail="wiki:2000101"]').click();
    await submit('sp-mars-fifth:swift');
    for(let i=0;i<8&&await p.locator('[data-team-resolve]').count();i++){
      const btn=p.locator('[data-side="0"].team-move[data-team-choice]:enabled').first();
      await submit(await btn.getAttribute('data-team-choice'));
    }
    await p.getByRole('heading',{name:'A 方获胜'}).waitFor();
    assert.ok(await p.evaluate(()=>positions.some(g=>g.phase==='replace'&&g.pending.includes(1))));
    console.log('Standard UI decisions',await p.evaluate(()=>decisions.map(d=>[d.action,d.samples,Math.round(d.elapsed)])));
    await p.getByRole('button',{name:'返回组队'}).click();
    for(const side of [0,1]){
      for(const id of side?[20001,3886,2987,3010]:[2988,3056,2987,3010])await member(p,side,id,{maxHp:1800},async()=>{
        if(id!==2987)return;
        await p.locator('[data-soul-side="'+side+'"]').selectOption('372');
        await p.locator('[data-wiki-order-side="'+side+'"][data-order-index="1"][data-order-delta="-1"]').click();
        const order=await p.locator('#wiki-detail-'+side+' [data-order-skill]').evaluateAll(rows=>rows.map(n=>'wiki:'+n.dataset.orderSkill));
        await p.evaluate(order=>window.expectedOrder=order,order);
      });
      await p.locator('.team-roster').nth(side).locator('.roster-entry').last().getByRole('button',{name:'设为首发'}).click();
    }
    for(const level of ['practice','standard','hard']){
      await p.getByLabel('电脑难度').selectOption(level);
      const index=await p.evaluate(()=>decisions.length);
      await begin();
      await p.waitForFunction(i=>decisions.length>i,index);
      const decision=await p.evaluate(()=>decisions.at(-1));
      console.log('6v6',level,decision);
      assert.equal(decision.deepSamples>0,level==='hard');
      assert.ok(await p.evaluate(()=>JSON.stringify(actual)===before&&
        actual.slots.every(row=>{
          const f=row.find(s=>s.config.snapshot.id===2987).fighter;
          return f.soulId===372&&JSON.stringify(f.moves)===JSON.stringify(expectedOrder);
        })&&actual.active.every(n=>n===5)&&actual.slots.every(row=>row.length===6)&&
        actual.slots.flat().every(slot=>slot.config.moves.length&&slot.fighter.soulId===slot.config.snapshot.souls.find(s=>s.id===slot.fighter.soulId)?.id)));
      await submit('potion:hp');
      if(level==='standard'){
        for(let turn=1;turn<50&&await p.locator('[data-team-resolve]').count();turn++){
          const replacement=p.locator('[data-side="0"][data-replacement-member]').first();
          if(await replacement.count())await replacement.click();
          const moves=p.locator('[data-side="0"].team-move[data-team-choice]:enabled');
          const key=await moves.evaluateAll(buttons=>(buttons.find(b=>b.querySelector('.action-icon.physical,.action-icon.special'))??buttons[0])?.dataset.teamChoice);
          await submit(key??'potion:pp');
        }
        await p.locator('.team-roundbar h2').filter({hasText:/获胜|平局/}).waitFor();
        console.log('6v6 full match',await p.locator('.team-roundbar h2').innerText(),await p.locator('.log-turn h3').first().innerText(),
          await p.evaluate(i=>decisions.slice(i).length,index));
      }
      await p.getByRole('button',{name:'返回组队'}).click();
    }
    // Two private replacements from the same public fixture, including a re-selection before lock.
    await p.getByLabel('电脑难度').selectOption('practice');
    for(const side of [0,1]){
      const roster=p.locator('.team-roster').nth(side);
      while(await roster.locator('.roster-entry').count()>(side?2:3))await roster.getByRole('button',{name:'移除'}).last().click();
    }
    await p.evaluate(()=>window.dualKO=true);
    const outcomes=[];
    for(const target of [1,2]){
      const index=await p.evaluate(()=>decisions.length);
      await begin();
      const jobs=await p.evaluate(()=>positions.length);
      for(const pos of [3-target,target])await p.locator('[data-side="0"][data-replacement-member="'+pos+'"]').click();
      assert.equal(await p.evaluate(()=>positions.length),jobs);
      await p.locator('[data-side="0"][data-team-choice="potion:hp"]').click();
      await p.waitForFunction(i=>decisions.length>i,index);
      assert.equal(await p.locator('[data-side="1"][data-replacement-member]').count(),0);
      const result=await p.evaluate(()=>decisions.at(-1).action);
      outcomes.push(result);assert.ok(result.target!==null);
      await submit('potion:hp');
      await p.getByRole('button',{name:'返回组队'}).click();
    }
    assert.deepEqual(outcomes[0],outcomes[1]);
    assert.ok(await p.evaluate(()=>{
      const cases=positions.filter(g=>g.slots[0].length===3&&g.phase==='replace'&&g.pending.length===2);
      return cases.length===2&&JSON.stringify(cases[0])===JSON.stringify(cases[1]);
    }));
    console.log('Private replacement trials',outcomes);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
