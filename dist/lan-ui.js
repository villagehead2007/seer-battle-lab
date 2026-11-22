(() => {
  if(location.pathname!=='/room')return;
  const $=selector=>document.querySelector(selector);
  const C=window.TeamComponents,{node,el}=C,expanded=new Set();
  const skin=el('link');skin.rel='stylesheet';skin.href='team.css';document.head.append(skin);
  document.body.classList.add('team-mode');
  const head=$('.heading'),panel=el('section'),notice=el('p'),connection=el('p');
  panel.className='settings';notice.setAttribute('role','alert');connection.setAttribute('role','status');
  head.replaceChildren(el('h1','局域网双人对战'));head.after(connection,notice,panel);
  document.title='局域网双人对战';$('.brand').removeAttribute('href');$('.version').textContent='局域网联机';
  const picker=$('.wiki-picker'),growth=$('.growth-settings');
  for(const n of document.querySelectorAll('.workspace,.rules,.setting-bottom,.settings-note,#wiki-start,#wiki-pair-status,.wiki-picker > p,.wiki-picker > label'))n.style.display='none';
  $('#settings-form').onsubmit=e=>e.preventDefault();
  picker.hidden=growth.hidden=true;
  $('#data-provider').value='local';$('#data-provider').disabled=true;
  let etag=null;
  let state,stamp='',selected=null,target=null,inFlight=false,sequence=0;
  function button(text,fn){
    const b=el('button',text);b.type='button';b.className='button secondary';
    b.onclick=async()=>{try{notice.textContent='';await fn();}catch(e){notice.textContent=e.message;}};return b;
  }
  async function update(data){
    const serial=++sequence;
    const res=await fetch(data?'/command':'/state',data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{headers:etag?{'If-None-Match':etag}:{}});
    if(serial!==sequence)return;
    if(res.status===304){if(state)connected(state);return;}
    const next=await res.json();
    if(!res.ok)throw Error(next.error||'房间已关闭');
    if(serial!==sequence)return;
    etag=res.headers.get('ETag');connected(next);
    const signature=JSON.stringify([next.epoch,next.edit,next.joined,next.locked,next.ready,next.phase]);
    if(signature===stamp)return;
    if(!state||state.epoch!==next.epoch){selected=null;target=null;}
    if(state?.matchId!==next.matchId)expanded.clear();
    state=next;stamp=signature;render();
  }
  function connected(s){connection.textContent='你是 '+'AB'[s.side]+' 方 · '+(s.joined[1-s.side]?'对手已加入':'等待对手加入');}
  async function command(op,extra={}){
    if(inFlight)return;
    inFlight=true;
    try{await update({op,edit:state.edit,epoch:state.epoch,matchId:state.matchId,...extra});}finally{inFlight=false;}
  }
  const notesById=JSON.parse(sessionStorage.getItem('teamNotes')??'{}');
  const add=button('将当前配招和养成加入我的队伍',async()=>{
    const m=window.teamReadMember(state.side);
    const ticket={edit:state.edit,matchId:state.matchId};
    const notes=await C.memberNotes(m);
    await command('add',{...ticket,member:{id:m.snapshot.id,soul:m.snapshot.selectedSoulId,version:m.snapshot.selectedSkillVersion,moves:m.moves,build:m.build}});
    notesById[m.snapshot.id]=notes;sessionStorage.setItem('teamNotes',JSON.stringify(notesById));render();
  });
  function setup(s){
    panel.className='settings team-setup';panel.append(el('h2','队伍与首发'));
    const grid=node('div','team-setup-grid');panel.append(grid);
    for(const side of [0,1]){
      const roster=node('section','team-roster');grid.append(roster);
      const own=side===s.side;
      roster.append(el('h3','AB'[side]+' 方 · '+(own?'我的队伍 · '+s.team.length+' / 6':'对手队伍')));
      if(!own){roster.append(node('p','effect-empty',s.ready[side]?'已准备':s.joined[side]?'正在编队':'等待加入'));continue;}
      if(!s.team.length)roster.append(node('p','effect-empty','从下方图鉴选择精灵并加入队伍'));
      s.team.forEach((member,index)=>{
        const controls=[];
        if(!s.ready[side]){
          if(s.lead!==index)controls.push(button('设为首发',()=>command('lead',{index})));
          controls.push(button('移除',()=>command('remove',{index})));
        }
        roster.append(C.rosterEntry(member.name,index===s.lead,member.moves??[],notesById[member.id]??[],controls));
      });
    }
    if(s.ready[s.side])panel.append(el('p','已准备，等待对手。'));
    else{const ready=button('准备开战',()=>command('ready'));ready.className='button primary';ready.disabled=!s.team.length;panel.append(ready);}
  }
  function combat(s){
    window.BattlePresentation.closeMoveDetails();
    panel.className='team-combat';
    const arena=node('section','team-arena'),bar=node('div','team-roundbar'),actions=node('div','team-actions');
    const done=s.phase==='finished',locked=s.locked[s.side],mine=s.side;
    const projected=locked?s.ownTarget:target,group=s.options.find(row=>row.target===projected);
    if(group?.actions.length===1&&group.actions[0].key==='pass')selected='pass';
    const selectedAction=group?.actions.find(a=>a.key===selected);
    bar.append(el('h2',done?(s.winner==='draw'?'平局':'AB'[s.winner]+' 方获胜'):'第 '+s.round+' 回合'),
      node('span','growth-help team-host-label','房主 '+'AB'[s.challengedSide]+' 方 · 同档必先优先'));
    if(!done){
      if(locked)actions.append(el('span','已私下锁定，等待对手。'));
      else{
        const submit=button('锁定本回合行动',()=>command('lock',{target,key:selected}));
        submit.className='button primary';submit.disabled=!selectedAction;actions.append(submit);
      }
    }
    if(s.matchId!=null){
      if(done){
        if(s.finishReason)actions.append(el('span',s.finishReason));
        if(mine===0){
          actions.append(button('快速重开',()=>command('rematch')),button('返回队伍选择',()=>command('lobby')));
        }else actions.append(el('span','等待房主选择下一局'));
      }else if(s.round>=11){
        actions.append(button('投降',()=>{
          if(confirm('确认投降？本局立即结束，对方获胜。'))return command('surrender');
        }));
      }
    }
    bar.append(actions);arena.append(bar);
    const cards=node('div','team-cards');arena.append(cards);
    for(const side of [0,1]){
      const own=side===mine;
      const model=(own&&s.previews[projected])||s.panels[side];
      let head=model.head;
      const preview=s.previews[projected]?.head.affinity;
      if(!own&&preview?.incoming!=null){
        head={...head,affinity:{...preview,from:preview.to,to:preview.from,multiplier:preview.incoming,incoming:preview.multiplier}};
      }
      const card=C.fighterHead(side,head,expanded);cards.append(card);
      const area=node('div','move-area'),heading=node('div','move-heading');
      card.append(area);area.append(heading);
      const label=done?'已结束':own?(s.ownLock??selectedAction?.name??'待选择'):s.locked[side]?'已锁定':'待选择';
      heading.append(el('span','本回合行动'),el('strong',label));
      if(!own)continue;
      if(!locked&&s.options.some(row=>row.target!=null)){
        area.append(node('h4','bench-title','选择补位成员和本回合行动'));
        const bench=node('div','team-bench');
        for(const row of s.options){
          const b=button('补位 '+row.name,()=>{target=row.target;selected=null;render();});
          const reserve=s.bench.find(f=>f.index===row.target);
          b.setAttribute('aria-label','补位 '+row.name);
          if(reserve)b.append(...C.reserveHealth({...reserve,stats:{maxHp:reserve.maxHp}},reserve.affinity));
          b.setAttribute('aria-pressed',String(target===row.target));bench.append(b);
        }
        area.append(bench);
        if(!group)continue;
      }
      function choice(side,key,cls,label,reason){
        const b=button('',()=>{
          selected=key;
          for(const option of area.querySelectorAll('[data-team-choice]'))option.setAttribute('aria-pressed',String(option.dataset.teamChoice===key));
          heading.lastElementChild.textContent=group.actions.find(a=>a.key===key).name;
          actions.querySelector('button').disabled=false;
        });b.className=cls;b.dataset.teamChoice=key;b.dataset.side=String(side);
        b.setAttribute('aria-label','AB'[side]+' 方 '+label);b.setAttribute('aria-pressed',String(key===selected));
        b.disabled=!!reason||!group?.actions.some(a=>a.key===key);return b;
      }
      const moves=node('div','team-moves');area.append(moves);
      for(const m of model.skills){
        if(m.forms.length){
          const forms=node('details','move team-move'),summary=el('summary',m.name+' · PP '+m.current+' / '+m.pp);
          summary.dataset.moveDetail=m.key;forms.append(summary);
          for(const f of m.forms){
            const b=choice(side,f.key,'button secondary',f.label,m.reason);b.textContent=f.label;b.dataset.moveDetail=m.key;b.dataset.moveForm=f.form;forms.append(b);
          }
          moves.append(forms);
        }else moves.append(C.skillButton(side,m.key,m,m.current,choice,m.reason));
      }
      const potions=node('div','potion-actions team-potions');
      for(const [key,name] of [['potion:hp','血药'],['potion:pp','PP 药']])potions.append(C.potionButton(side,key,name,choice,''));
      area.append(potions,node('h4','bench-title','场下精灵'));
      const bench=node('div','team-bench');area.append(bench);
      for(const f of s.bench.filter(f=>f.index!==projected)){
        const b=choice(side,'switch/'+f.index,'team-reserve','换入 '+f.name,'');
        b.replaceChildren(el('strong',f.name),...C.reserveHealth({...f,stats:{maxHp:f.maxHp}},f.affinity));bench.append(b);
      }
      if(!bench.childElementCount)bench.append(node('span','effect-empty','无场下成员'));
      window.BattlePresentation.bindPreparedDetails(card,(key,form)=>{
        const m=model.skills.find(m=>m.key===key);return form?m?.forms.find(f=>f.form===form)?.detail:m?.detail;
      });
    }
    panel.append(arena,C.journal(s));
  }
  function render(){
    const s=state,i=s.side;
    panel.replaceChildren();picker.hidden=growth.hidden=Boolean(s.phase||s.ready[i]);
    for(const [index,n] of [...document.querySelectorAll('.wiki-side')].entries())n.hidden=index!==i;
    for(const [index,n] of [...document.querySelectorAll('.growth-card')].entries())n.hidden=index!==i;
    $('#wiki-detail-'+i).after(add);
    document.body.classList.toggle('team-in-battle',!!s.phase);
    if(!s.phase){setup(s);return;}
    if(s.panels){combat(s);return;}
    // Rooms opened by the previous server retain their original wire format.
    panel.append(el('h2',s.phase==='finished'?(s.winner==='draw'?'平局':'AB'[s.winner]+' 方获胜'):'第 '+s.round+' 回合'));
    panel.append(el('p','同档必先优先 · '+'AB'[s.challengedSide]+' 方'));
    s.fighters.forEach((f,side)=>{
      panel.append(el('h3','AB'[side]+' 方 · '+f.name+' · HP '+f.hp+' / '+f.maxHp));
      for(const body of f.bodies)panel.append(el('p',body.role+' · '+body.name+' · HP '+body.hp+' / '+body.maxHp));
      const stages=Object.entries(f.stages).filter(([,v])=>v).map(([k,v])=>window.BattleEngine.STAGE_LABELS[k]+' '+v);
      if(stages.length||f.resources.length||f.effects.length)panel.append(el('p',[...stages,...f.resources,...f.effects].join(' · ')));
    });
    if(s.bench.length)panel.append(el('p','我的替补 · '+s.bench.map(f=>f.name+'（'+f.hp+'/'+f.maxHp+'）').join('、')));
    if(s.locked[i])panel.append(el('p','已私下锁定，等待对手。'),el('small',s.ownLock));
    if(s.options.length){
      const group=s.options.find(row=>row.target===target);
      if(s.options[0].target!=null){
        panel.append(el('h3','选择补位成员和本回合行动'));
        for(const row of s.options){
          const b=button('补位 '+row.name,()=>{target=row.target;selected=null;render();});
          b.setAttribute('aria-pressed',String(row===group));panel.append(b);
        }
      }
      if(group){
        const field=el('p'),select=el('select');select.setAttribute('aria-label','本回合行动');
        select.append(new Option('选择本回合行动',''));
        for(const action of group.actions)select.append(new Option(action.name,action.key));
        select.value=selected||'';
        const lock=button('锁定本回合行动',()=>command('lock',{target,key:selected}));
        select.onchange=()=>{selected=select.value;lock.disabled=!selected;};
        lock.disabled=!selected;field.append(select,lock);panel.append(field);
      }
    }
    panel.append(el('h3','对战记录'));
    for(const line of s.history)panel.append(el('p',line));
  }
  async function poll(){
    try{if(!inFlight)await update();}catch(e){connection.textContent='连接中断 · '+e.message+'。恢复连接后会自动同步。';}
    finally{setTimeout(poll,850);}
  }
  poll();
})();
