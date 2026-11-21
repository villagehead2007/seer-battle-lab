(()=>{
  if(location.search!=='?mode=team')return;
  const E=window.BattleEngine,T=window.TeamBattle;
  const teams=[[],[]],leads=[0,0],sides=[0,1],$=id=>document.getElementById(id);
  let game=null,initialMatch=null;
  const expandedResources=new Set();
  function el(tag,text){
    const node=document.createElement(tag);
    if(text!=null)node.textContent=text;
    return node;
  }
  function button(label,fn){
    const b=el('button',label);b.type='button';b.className='button secondary';
    b.onclick=async()=>{try{b.disabled=true;await fn();notice.textContent='';}catch(e){notice.textContent=e.message;}finally{b.disabled=false;}};
    return b;
  }
  const notice=el('p');notice.setAttribute('role','alert');
  const panel=el('section');panel.className='settings';
  document.querySelector('.heading').replaceChildren(el('h1','多精灵基础实验台'));
  const picker=document.querySelector('.wiki-picker'),growth=document.querySelector('.growth-settings');
  picker.before(panel);panel.after(notice);
  for(const selector of ['.workspace','.rules','#wiki-start','#wiki-pair-status','#settings-form button[type=submit]','.wiki-picker > p','.growth-settings .settings-note']){
    document.querySelectorAll(selector).forEach(n=>n.style.display='none');
  }
  $('settings-form').addEventListener('submit',event=>{
    event.preventDefault();event.stopImmediatePropagation();
  },true);
  $('data-provider').value='local';$('data-provider').disabled=true;
  document.querySelector('.brand').href='modes.html';
  document.title='多精灵基础实验台';
  sides.forEach(i=>{
    const add=button('将当前配招和养成加入 '+(i?'B':'A')+' 队',async()=>{
      if(game||teams[i].length>=6)throw Error('每方最多 6 只');
      const m=window.teamReadMember(i);
      if(teams[i].some(slot=>slot.snapshot.id===m.snapshot.id))throw Error('队内已有相同编号');
      const response=await fetch('/api/local/team-notes?id='+m.snapshot.id);
      if(!response.ok)throw Error('读取延期清单失败，请重试');
      const soul=E.WIKI.profileFor(m.snapshot).soul;
      const rows=(await response.json()).filter(n=>window.teamReviewNoteCurrent?.(m.snapshot,n)).filter(n=>n.skill?m.moves.some(id=>E.WIKI.selectedMove(m.snapshot,id)?.id===n.skill):n.soul===soul);
      const notes=rows.map(n=>(n.displayStatus??'队伍分支待核验')+' · '+n.text);
      if(!rows.some(n=>n.soul===soul && n.soul!=null)){
        for(const text of E.SOULS.registry[soul]?.deferred??[])notes.push('待审核 · '+text);
      }
      for(const id of m.moves){
        const move=E.WIKI.selectedMove(m.snapshot,id);
        for(const d of E.WIKI.compile(move,m.snapshot).deferred??[]){
          if(!rows.some(n=>n.skill===id && n.ruleId===d.effectId))notes.push('待审核 · '+move.name+' · '+d.description);
        }
      }
      m.notes=[...new Set(notes)];
      if(game||teams[i].length>=6||teams[i].some(slot=>slot.snapshot.id===m.snapshot.id))throw Error('队伍已变化，请重新选择成员');
      teams[i].push(m);render();
    });
    $('wiki-detail-'+i).after(add);
  });
  const sideName = side => side === 0 ? 'A 方' : 'B 方';
  let choices = [null, null];
  const skin = document.createElement('link');
  skin.rel = 'stylesheet';
  skin.href = 'team.css';
  document.head.append(skin);
  document.body.classList.add('team-mode');

  function node(tag, cls, text) {
    const n = el(tag, text);
    n.className = cls;
    return n;
  }

  function health(fighter, compact = false) {
    const box = node('div', compact ? 'team-hp compact' : 'team-hp');
    const label = node('div', 'hp-row');
    label.append(el('span', 'HP'), node('strong', 'hp-numbers', fighter.hp + ' / ' + fighter.stats.maxHp));
    const value = Math.max(0, Math.min(100, 100 * fighter.hp / (fighter.stats.maxHp || 1)));
    const track = node('div', 'hp-track');
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-label', fighter.name + '体力');
    track.setAttribute('aria-valuemin','0');
    track.setAttribute('aria-valuemax',String(Math.max(1,fighter.stats.maxHp)));
    track.setAttribute('aria-valuenow',String(fighter.hp));
    const fill = node('div', 'hp-fill' + (value <= 25 ? ' danger' : value <= 50 ? ' low' : ''));
    fill.style.width = value + '%';
    track.append(fill);box.append(label, track);
    return box;
  }

  function setup() {
    panel.className = 'settings team-setup';
    panel.append(el('h2','队伍与首发'));
    const grid = node('div','team-setup-grid');
    panel.append(grid);
    for(const side of sides) {
      const card = node('section','team-roster');
      card.append(el('h3', sideName(side) + ' · ' + teams[side].length + ' / 6'));
      if(!teams[side].length)card.append(node('p','effect-empty','从下方图鉴选择精灵并加入队伍'));
      teams[side].forEach((m,i) => {
        const row = node('div','roster-entry');
        row.append(el('strong',m.snapshot.name),node('span','type-pill',i === leads[side] ? '首发' : '替补'));
        if(i !== leads[side])row.append(button('设为首发',()=>{leads[side]=i;render();}));
        row.append(button('移除',()=>{teams[side].splice(i,1);if(i===leads[side])leads[side]=0;else if(i<leads[side])leads[side]--;render();}));
        row.append(node('p','roster-moves',m.moves.map(id=>{const move=E.WIKI.selectedMove(m.snapshot,id);return move.selectionName??move.name;}).join(' · ')));
        if(m.notes.length){
          const notes=el('details');notes.append(el('summary','词条状态 · '+m.notes.length));
          for(const note of m.notes)notes.append(el('p',note));
          row.append(notes);
        }
        card.append(row);
      });
      grid.append(card);
    }
    const start=button('开始队伍对战',()=>{
      expandedResources.clear();
      initialMatch=structuredClone({teams,leads,settings:{seed:$('seed').value,criticals:$('criticals').checked}});
      game=T.create(initialMatch.teams,initialMatch.leads,initialMatch.settings);
      choices=[null,null];render();
    });
    start.disabled=teams.some(team=>!team.length);start.className='button primary';panel.append(start);
  }

  function updateSelection() {
    for(const b of panel.querySelectorAll('[data-team-choice]')){
      b.setAttribute('aria-pressed',String(b.dataset.teamChoice===choices[Number(b.dataset.side)]));
    }
    for(const side of sides){
      const value=choices[side],label=panel.querySelector('[data-selection="'+side+'"]');
      if(!label)continue;
      const form=E.SpMars.fifthForm(game.battle.fighters[side],value);
      label.textContent = value ? (value==='switch/random'?'驱逐换人（随机）':value.startsWith('switch/') ? '换入 '+teams[side][Number(value.slice(7))].snapshot.name : form?game.battle.moveDefinitions[E.SpMars.FIFTH_KEY].name+' · '+E.SpMars.LABELS[form]:game.battle.moveDefinitions[value].name)
        : game.phase==='finished'?'已结束':game.phase==='replace'&&!game.pending.includes(side)?'等待对方补位':'待选择';
    }
    const resolve=panel.querySelector('[data-team-resolve]');
    if(resolve)resolve.disabled=(game.phase==='replace'?game.pending:sides).some(i=>!choices[i]);
  }

  function choice(side,key,cls,label,reason='') {
    const b=node('button',cls);
    b.type='button';b.dataset.side=String(side);b.dataset.teamChoice=key;
    b.setAttribute('aria-label',sideName(side)+' '+label+(reason?' · '+reason:''));
    b.setAttribute('aria-pressed','false');b.disabled=Boolean(reason);b.title=reason||label;
    b.onclick=()=>{choices[side]=key;updateSelection();notice.textContent='';};
    return b;
  }

  function fighterPanel(side) {
    const f=game.battle.fighters[side],active=game.active[side],phase=game.phase;
    const card=node('article','fighter team-fighter '+(side?'side-b':'side-a'));
    card.setAttribute('aria-label',sideName(side)+' '+f.name);
    const head=node('div','fighter-head'),line=node('div','side-label');
    line.append(el('span',sideName(side)+' · '+(f.soulState.vanished?'已消逝':f.hp?'在场':'阵亡')),node('span','type-pill',f.type));
    const names=node('div','name-row');names.append(el('h2',f.name),node('span','level','Lv.'+f.level));
    head.append(line,names);
    const P=window.BattlePresentation,snapshot=game.slots[side][active].config.snapshot;
    const affinity=P.affinity(f,game.battle.fighters[1-side],game.battle),typeBox=node('div','affinity-summary');
    typeBox.setAttribute('aria-label',sideName(side)+'属性克制');
    typeBox.append(el('span',affinity.from+' → '+affinity.to),el('strong','×'+affinity.multiplier),el('small',affinity.note));head.append(typeBox);
    const soul=P.soul(f,snapshot),soulBox=node('details','soul-card');
    soulBox.append(el('summary','魂印 · '+soul.name));if(soul.id)soulBox.append(el('small','版本 '+soul.id+' · '+soul.hash),el('p',soul.text));head.append(soulBox);
    const gear=P.equipment(f),gearBox=node('details','equipment-summary');
    gearBox.setAttribute('aria-label',sideName(side)+'特性抗性与套装');
    gearBox.append(el('summary','特性 · '+gear.characteristic+' / 套装 · '+gear.suit),el('p',gear.characteristicEffect),el('p',gear.resistance),el('p',gear.ailments),el('p',gear.suitEffect));head.append(gearBox);
    const display=window.BattleDisplay.fighter(f,game.battle.round,game.battle.moveDefinitions,game.battle);
    if(!display.group)head.append(health(f));
    for(const member of [...(display.group?.members??[]),...display.companions]){
      const body=node('section','team-body');
      body.append(el('strong',member.role+' · '+member.name),health({name:member.name,hp:member.hp,stats:{maxHp:member.maxHp}},true));
      head.append(body);
    }
    if(display.group?.vacant)head.append(node('small','effect-empty','副位空缺'));
    const stats=node('div','team-stages');stats.setAttribute('aria-label','能力等级');
    for(const [key,n] of Object.entries(f.stages)){
      const chip=node('span',n>0?'up':n<0?'down':'neutral',E.STAGE_LABELS[key]+' '+(n>0?'+':'')+n);
      stats.append(chip);
    }
    head.append(stats);
    const teamItems=window.BattleDisplay.team(game,side);
    for(const [title,items] of [['专属状态',display.items],['队伍效果',teamItems]]){
      if(!items.length)continue;
      const section=node('section','team-resources');
      section.append(el('h4',title));
      const labels=node('div','effect-list');
      const chip=item=>{const label=node('span','effect-chip',item.name+' · '+item.value);label.title=window.BattlePresentation.explain(item,f,game.battle,game.slots.flat().map(s=>s.config.snapshot));label.tabIndex=0;return label;};
      labels.append(...items.slice(0,3).map(chip));section.append(labels);
      if(items.length>3){
        const key=side+':'+active+':'+title,details=node('details','team-more'),summary=el('summary');
        const rest=node('div','effect-list');rest.append(...items.slice(3).map(chip));
        details.open=expandedResources.has(key);
        const caption=()=>{summary.textContent=details.open?'收起其余'+(items.length-3)+'项':'展开其余'+(items.length-3)+'项';};
        caption();details.ontoggle=()=>{if(!details.isConnected)return;if(details.open)expandedResources.add(key);else expandedResources.delete(key);caption();};
        details.append(summary,rest);section.append(details);
      }
      head.append(section);
    }
    const explicit=new Set(display.items.map(item=>item.name+' · '+item.value));
    const effects=E.describeEffects(f,game.battle.round).filter(text=>!explicit.has(text)),list=node('div','effect-list team-effects');
    list.setAttribute('aria-label','持续效果与异常');
    if(effects.length)for(const text of effects){const chip=node('span','effect-chip',text);chip.title=window.BattlePresentation.explain(text,f,game.battle,game.slots.flat().map(s=>s.config.snapshot));chip.tabIndex=0;list.append(chip);}
    else if(!display.items.length&&!teamItems.length)list.append(node('span','effect-empty','暂无持续效果'));
    if(list.childElementCount)head.append(list);card.append(head);
    const area=node('div','move-area'),heading=node('div','move-heading'),selected=el('strong');
    selected.dataset.selection=String(side);heading.append(el('span','本回合行动'),selected);area.append(heading);
    const legal=E.availableMoves(f,game.battle.round),moves=node('div','team-moves');
    for(const key of [...new Set([...f.moves,...legal.filter(k=>k!=='team:switch'&&!k.startsWith('potion:'))])]){
      const move=game.battle.moveDefinitions[key];
      if(!move)continue;
      const currentPp=E.SpMars.projectedBody(f,game.battle.round)?.pp??f.pp;
      const reason=phase!=='action'?(phase==='replace'?'补位期间不能用招':'对战结束'):!legal.includes(key)?(f.soulState.collapsedSkills1809?.[key]?'本场已崩溃':currentPp[key]===0?'PP 已耗尽':'当前不可用'):'';
      if(E.SpMars.owns(f)&&key===E.SpMars.FIFTH_KEY){
        const group=node('details','move team-move');
        const summary=el('summary',`${move.name} · PP ${currentPp[key]} / ${move.pp}`);
        summary.dataset.spMarsDetail=key;
        group.append(summary);
        for(const form of E.SpMars.legalForms(f)){
          const label=E.SpMars.LABELS[form];
          const button=choice(side,E.SpMars.choiceKey(form),'button secondary',label,reason);
          button.textContent=label;
          button.dataset.spMarsDetail=key;
          button.dataset.spMarsForm=form;
          button.removeAttribute('title');
          group.append(button);
        }
        moves.append(group);
        continue;
      }
      const b=choice(side,key,'move team-move',move.name,reason);
      const mark=node('span','action-icon '+move.kind,move.kind==='status'?'◎':move.kind==='physical'?'⚔':'✦');mark.setAttribute('aria-hidden','true');
      const info=node('span','action-info');
      info.append(node('strong','move-name',move.name),node('small','move-pp',key==='struggle'?'不限 PP':'PP '+currentPp[key]+' / '+move.pp));
      if(E.SpMars.owns(f)&&Object.values(E.SpMars.MOVES).includes(move.wikiId)){
        b.dataset.spMarsDetail=key;
        b.removeAttribute('title');
      }else b.title=reason||[move.name,move.description].filter(Boolean).join(' · ');
      b.append(mark,info);moves.append(b);
    }
    area.append(moves);
    const potions=node('div','potion-actions team-potions');
    for(const key of ['potion:hp','potion:pp']){
      const move=game.battle.moveDefinitions[key],label=move.name,reason=phase!=='action'||!legal.includes(key)?'当前不可用':'';
      const b=choice(side,key,'button secondary team-potion',label,reason);
      const icon=node('span','bottle-icon '+(key==='potion:hp'?'hp-bottle':'pp-bottle'));icon.setAttribute('aria-hidden','true');
      b.append(icon,el('span',label));potions.append(b);
    }
    area.append(potions);
    const bench=node('div','team-bench');bench.setAttribute('aria-label',sideName(side)+'场下精灵');
    const canChoose=phase==='action'||phase==='replace'&&game.pending.includes(side);
    const allowed=canChoose?T.candidates(game,side,phase==='replace'):[],driven=phase==='action'&&T.switchMode(game,side)==='expelled';
    teams[side].forEach((m,i)=>{
      if(i===active)return;
      const reserve=game.slots[side][i].fighter;
      const reason=reserve.soulState.vanished?'已消逝':allowed.includes(i)?'':reserve.hp<=0?'已阵亡':phase==='finished'?'对战结束':phase==='replace'?'无需补位':'无法主动切换';
      const b=choice(side,'switch/'+i,'team-reserve', '换入 '+m.snapshot.name, reason);
      if(driven&&allowed.includes(i))b.append(node('small','bench-state','主动更换视为驱逐，可指定此队友')); 
      b.append(el('strong',m.snapshot.name),health(reserve,true));
      if(reason)b.append(node('small','bench-state',reason));
      bench.append(b);
    });
    area.append(node('h4','bench-title',phase==='replace'&&game.pending.includes(side)?'选择补位精灵':'场下精灵'));
    if(!bench.children.length)bench.append(node('span','effect-empty','无场下成员'));
    area.append(bench);card.append(area);
    if(E.SpMars.owns(f))P.bindSpMarsMoveDetails(card,snapshot);
    return card;
  }

  function journal() {
    const log=node('aside','log-panel team-journal');log.setAttribute('aria-label','回合详情');
    const title=node('div','log-header');title.append(el('h2','回合详情'));log.append(title);
    const body=node('div','battle-log'),groups=new Map(),details=new Map();
    for(const turn of game.battle.turns)for(const [turnEventIndex,event] of turn.events.entries()){
      const key=turn.round+'|'+event.text;
      if(!details.has(key))details.set(key,[]);
      details.get(key).push({...event,turnEventIndex});
    }
    for(const line of game.history){
      const match=/^第 (\d+) 回合 · ([\s\S]+)$/.exec(line);
      const round=match?Number(match[1]):null,text=match?match[2]:line;
      if(!groups.has(round))groups.set(round,[]);
      const rich=details.get(round+'|'+text)?.shift();
      groups.get(round).push(rich??{text,kind:''});
    }
    for(const [round,events] of [...groups].reverse()){
      const section=node('section','log-turn');section.append(el('h3',round===null?'对战记录':'第 '+round+' 回合'));
      for(const event of window.BattleDisplay.logEvents(events)){
        const item=node('div','log-event '+event.kind,event.segments?'':event.text);
        if(event.segments){
          const disclosure=el('details');disclosure.append(el('summary',event.text));
          for(const hit of event.segments){
            const row=el('div','第 '+(hit.segment.index+1)+' 段 · '+hit.text);
            if(hit.detail)row.append(node('small','event-detail',hit.detail));
            disclosure.append(row);
          }
          item.append(disclosure);
        }else if(event.detail)item.append(node('small','event-detail',event.detail));
        section.append(item);
      }
      body.append(section);
    }
    body.tabIndex=0;log.append(body);
    const notes=el('details');notes.className='team-notes';
    const content=el('div');
    for(const team of teams)for(const member of team)for(const note of member.notes)
      content.append(el('p',member.snapshot.name+' · '+note));
    if(content.children.length){notes.append(el('summary','配招词条状态'),content);log.append(notes);}
    return log;
  }

  function render() {
    picker.hidden=!!game;growth.hidden=!!game;
    document.body.classList.toggle('team-in-battle',!!game);panel.replaceChildren();
    if(!game){setup();return;}
    panel.className='team-combat';
    const arena=node('section','team-arena'),bar=node('div','team-roundbar');
    bar.append(el('h2',game.phase==='finished'?(game.battle.winner==='draw'?'平局':(game.battle.winner?'B':'A')+' 方获胜'):'第 '+game.battle.round+' 回合'));
    const host=node('span','growth-help team-host-label','房主 '+sideName(game.battle.challengedSide)+' · 同档必先优先');host.title='本场开始时随机确定，换人后保持不变';bar.append(host);
    const actions=node('div','team-actions');
    if(game.phase!=='finished'){
      const submit=button(game.phase==='replace'?'确认补位':'结算回合',()=>{
        const selected=choices.map(value=>value==='switch/random'?{switchTo:'random'}:value?.startsWith('switch/')?{switchTo:Number(value.slice(7))}:value);
        game=game.phase==='replace'?T.replace(game,selected.map(a=>a?.switchTo??null)):T.turn(game,selected);
        choices=[null,null];render();
      });
      submit.className='button primary';submit.dataset.teamResolve='';actions.append(submit);
    }
    actions.append(button('重新开局',()=>{
      expandedResources.clear();choices=[null,null];
      const initial=structuredClone(initialMatch);
      game=T.create(initial.teams,initial.leads,initial.settings);render();
    }));
    actions.append(button('返回组队',()=>{game=null;choices=[null,null];render();}));
    bar.append(actions);arena.append(bar);
    const cards=node('div','team-cards');for(const side of sides)cards.append(fighterPanel(side));
    arena.append(cards);panel.append(arena,journal());updateSelection();
  }
  render();
})();
