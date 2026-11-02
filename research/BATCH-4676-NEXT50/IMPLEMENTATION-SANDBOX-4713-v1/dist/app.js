(() => {
  'use strict';
  const E = window.BattleEngine;
  let state = E.createBattle();
  let selected = [null, null];
  const $ = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sideName = i => i === 0 ? 'A 方' : 'B 方';
  const statLabels = { maxHp: '体力上限', ...E.STAT_LABELS };
  function renderXin(f, i) {
    if (f.soulId !== 1061) return '';
    const xin = f.soulState.xin;
    const label = !xin ? '未生成' : xin.hp > 0 ? '存活' : f.soulState.xinFusion ? '已死亡 · 荒神融合' : '已死亡';
    return `<div class="xin-health" role="status" aria-label="${sideName(i)}辛血量"><div class="hp-row"><span>辛 · ${label}</span>${xin ? `<span class="hp-numbers"><b>${xin.hp}</b> / ${xin.maxHp}</span>` : ''}</div>${xin ? `<div class="hp-track" role="progressbar" aria-label="${sideName(i)}辛体力" aria-valuenow="${xin.hp}" aria-valuemin="0" aria-valuemax="${xin.maxHp}"><div class="hp-fill ${xin.hp === 0 ? 'danger' : ''}" style="width:${Math.max(0, Math.min(100, xin.hp / xin.maxHp * 100))}%"></div></div>` : ''}</div>`;
  }
  function renderFighter(i) {
    const f = state.fighters[i];
    const opponent=state.fighters[1-i];
    const affinityHtml=`<div class="affinity-summary" aria-label="${sideName(i)}属性克制"><span>${escape(f.type)} → ${escape(opponent.type)}</span><strong>×${E.typeEffectiveness(f.type,opponent.type,state.typeChart)}</strong><small>${f.species==='king'?'王·万霆朝宗无视微弱，按 ×1 结算':'本系攻击的属性克制倍率'}</small></div>`;
    const pct = f.hp / f.stats.maxHp * 100;
    const status = Object.entries(f.stages).filter(([, n]) => n !== 0).map(([s, n]) => `<span class="stage-chip">${E.STAGE_LABELS[s]} ${n > 0 ? '+' : ''}${n}</span>`).join('') || '<span>能力等级正常</span>';
    const soul = E.SPECIES[f.species];
    const effects = E.describeEffects(f,state.round);
    const marsFormHtml=f.soulId===708?`<div class="mars-form" role="status" aria-label="${sideName(i)}马尔修斯当前形态"><strong>当前：${f.soulState.marsForm==='destruction'?'毁灭形态':'极速形态'}</strong>${f.soulState.marsNextForm?`<span>下回合切换：${f.soulState.marsNextForm==='destruction'?'毁灭形态':'极速形态'}</span>`:''}<span>坚壁护盾：${f.soulState.marsShield??0} / 300</span></div>`:'';
    const soulHtml = soul.soul ? `<details class="soul-card"><summary>魂印 · ${escape(soul.soul)}<span>查看效果</span></summary><p>${escape(soul.soulText)}</p>${(E.SOULS.registry[f.soulId]?.deferred??[]).map(text=>`<p class="growth-help">多精灵待实现：${escape(text)}</p>`).join('')}</details><div class="effect-list" aria-label="${sideName(i)}持续效果">${effects.length ? effects.map(text=>`<span class="effect-chip">${escape(text)}</span>`).join('') : '<span class="effect-empty">暂无额外持续效果</span>'}</div>` : '';
    const equipmentHtml=`<div class="equipment-summary"><strong>套装 · ${E.GEAR.SUITS[f.build.suit].name}</strong><span>抗性 暴击 ${f.build.resistance.critical}% / 固伤 ${f.build.resistance.fixed}% / 百分比 ${f.build.resistance.percent}%</span><span>异常 ${f.build.resistance.major?`${f.build.resistance.major} 55%`:'55% 未设置'} · ${f.build.resistance.minor?`${f.build.resistance.minor} 18%`:'18% 未设置'}</span></div>`;
    const legal = E.availableMoves(f);
    const ids = [...f.moves, ...(legal.includes('struggle') ? ['struggle'] : [])];
    const el = $(`fighter-${i}`);
    el.setAttribute('aria-label', `${sideName(i)}${escape(f.name)}`);
    el.classList.toggle('winner', state.finished && state.winner === i);
    el.innerHTML = `<div class="fighter-head"><div class="side-label"><span>${sideName(i)} / ${i === 0 ? 'ALPHA' : 'BRAVO'}</span><span class="type-pill">${escape(f.type)}</span></div><div class="name-row"><h2>${escape(f.name)}</h2><span class="level">Lv.${f.level} · No.${escape(f.number)}</span></div>${marsFormHtml}<div class="hp-row"><span>${f.hp === 0 ? '已倒下' : '体力 HP'}</span><span class="hp-numbers"><b>${f.hp}</b> / ${f.stats.maxHp}</span></div><div class="hp-track" role="progressbar" aria-label="${sideName(i)}体力" aria-valuenow="${f.hp}" aria-valuemin="0" aria-valuemax="${f.stats.maxHp}"><div class="hp-fill ${pct <= 25 ? 'danger' : pct <= 50 ? 'low' : ''}" style="width:${pct}%"></div></div>${renderXin(f,i)}<div class="stats">${Object.entries(E.STAT_LABELS).map(([key, label]) => `<div class="stat ${f.stages[key] ? 'changed' : ''}"><span>${label}</span><strong>${E.effective(f, key)}</strong></div>`).join('')}</div><div class="status-row">${status}</div>${affinityHtml}${soulHtml}${equipmentHtml}</div><div class="move-area"><div class="move-heading"><span>本回合技能</span><span>${state.finished ? '对战结束' : selected[i] ? '已选择 · 可更改' : '等待选择'}</span></div><div class="moves">${ids.map(id => {
      const m = (state.moveDefinitions??E.MOVES)[id];
      return `<button class="move" data-side="${i}" data-move="${id}" aria-label="${sideName(i)} ${escape(m.name)}" aria-pressed="${selected[i] === id}" ${state.finished || !legal.includes(id) ? 'disabled' : ''}><span class="move-top"><span class="move-name">${escape(m.name)}</span><span class="move-pp">${id === 'struggle' ? '不限 PP' : `PP ${f.pp[id]} / ${m.pp}`}</span></span><span class="move-meta"><span class="${m.type === '草' ? 'grass' : ''}">${m.kind === "status" ? "属性技能" : `${escape(m.slot || m.category)} · ${escape(m.type)} · ${escape(m.category)}`}</span><span>威力 ${m.power || '—'}</span><span>${m.alwaysHit ? "必中" : `命中 ${m.accuracy}%`}</span>${m.priority ? `<span>先制 +${m.priority}</span>` : ""}</span><span class="move-description">${escape(m.description)}</span>${m.deferredEffects?.length?`<span class="move-description">多精灵待实现：${m.deferredEffects.map(x=>escape(x.description)).join("；")}</span>`:""}</button>`;
    }).join('')}</div><div class="potion-actions"><span>本回合药剂</span>${['potion:hp','potion:pp'].map(id=>`<button class="button secondary" data-side="${i}" data-move="${id}" aria-label="${sideName(i)} ${escape(E.MOVES[id].name)}" aria-pressed="${selected[i]===id}" ${state.finished?'disabled':''}>${escape(E.MOVES[id].name)} · 无限</button>`).join('')}</div></div>`;
  }
  function renderLogs() {
    $('battle-log').innerHTML = state.turns.length ? state.turns.slice().reverse().map(turn => `<section class="log-turn"><h3>ROUND ${String(turn.round).padStart(2, '0')} · 第 ${turn.round} 回合</h3>${turn.events.map(event => `<div class="log-event ${event.kind}">${escape(event.text)}${event.detail ? `<details><summary>查看伤害计算</summary><div class="calculation">${escape(event.detail)}</div></details>` : ''}</div>`).join('')}</section>`).join('') : '<div class="empty-log"><div class="empty-symbol" aria-hidden="true">≡</div><strong>对战已就绪</strong><p>先为 A 方和 B 方各选择一个技能，再点击“结算回合”。行动顺序和结算结果会显示在这里。</p></div>';
  }
  function render() {
    renderFighter(0); renderFighter(1);
    document.querySelector('.heading h1').textContent=state.fighters.map(f=>f.name).join(' × ');
    document.querySelector('.arena').classList.toggle('finished', state.finished);
    $('round-label').textContent = state.finished ? `对战结束 · 共 ${state.turns.length} 回合` : `第 ${String(state.round).padStart(2, '0')} 回合`;
    const count = selected.filter(Boolean).length;
    $('phase-label').textContent = state.finished ? state.winner === 'draw' ? '平局' : `${sideName(state.winner)}获胜` : count === 2 ? '双方已选招' : `等待选招 · ${count} / 2`;
    $('selection-summary').textContent = state.finished ? state.winner === 'draw' ? '双方同时倒下，平局' : `${sideName(state.winner)}${state.fighters[state.winner].name}获胜` : count ? selected.map((id, i) => `${sideName(i)}：${id ? (state.moveDefinitions??E.MOVES)[id].name : '未选择'}`).join('　/　') : '选择双方本回合的技能';
    $('selection-hint').textContent = state.finished ? '点击“重新开局”可用相同设置再战。' : '两边均由你控制。药剂占用本方行动，血药回 250 体力，PP 药回满全部技能 PP；均可无限使用。';
    $('resolve').disabled = state.finished || count !== 2;
  }
  function choose(side, move) {
    if (![0, 1].includes(side) || state.finished || !E.availableMoves(state.fighters[side]).includes(move)) throw new Error('当前无法选择该技能。');
    selected[side] = move; render();
    const button = document.querySelector(`[data-side="${side}"][data-move="${move}"]`);
    if (button) button.focus({ preventScroll: true });
  }
  function settle() {
    state = E.resolveTurn(state, selected);
    selected = [null, null];
    render(); renderLogs();
    $('battle-log').scrollTop = 0;
    $('announcement').textContent = `第 ${state.turns.length} 回合已结算。A 方体力 ${state.fighters[0].hp}，B 方体力 ${state.fighters[1].hp}。${state.finished ? '对战结束。' : '请选择下一回合技能。'}`;
    document.querySelector('[data-side="0"]:not(:disabled)')?.focus({ preventScroll: true });
  }
  function restart(options = state.initial) {
    state = E.createBattle(options); selected = [null, null]; render(); renderLogs();
    $('announcement').textContent = '新对局已就绪，双方体力与 PP 已恢复。';
  }
  document.querySelector('.fighters').addEventListener('click', event => {
    const button = event.target.closest('button[data-move]');
    if (button && !button.disabled) choose(Number(button.dataset.side), button.dataset.move);
  });
  $('resolve').addEventListener('click', settle);
  $('restart').addEventListener('click', () => { restart(); syncSettings(); $('settings-error').textContent = ''; });
  const natureDescription = name => {
    const n = E.NATURES[name];
    return n.up ? `${E.STAT_LABELS[n.up]} +10% / ${E.STAT_LABELS[n.down]} −10%` : '平衡 · 无增减';
  };
  function numberField(name, value, min, max, label, optional = false) {
    return `<input type="number" name="${name}" value="${value ?? ''}" min="${min}" max="${max}" step="1" aria-label="${label}" ${optional ? '' : 'required'}>`;
  }
  function ailmentSelect(i,slot,value,rate) {
    return `<label>${rate}% 免疫<select name="${i}-res-${slot}" aria-label="${sideName(i)}${rate}%异常抗性"><option value="">不设置</option>${E.GEAR.AILMENTS.map(k=>`<option value="${k}" ${value===k?'selected':''}>${k}</option>`).join('')}</select></label>`;
  }
  function syncSettings() {
    $('stats-editors').innerHTML = state.fighters.map((f, i) => {
      const b = f.build, data = E.SPECIES[f.species];
      return `<fieldset class="growth-card side-${i ? 'b' : 'a'}"><legend>${sideName(i)} · ${escape(f.name)}</legend>
        <p class="species-meta">${escape(f.type)}系 · 原始种族值 ${Object.values(data.base).reduce((a,b)=>a+b,0)} · 不含特训</p>
        <section class="equipment-editor"><label>套装<select name="${i}-suit" aria-label="${sideName(i)}套装">${Object.entries(E.GEAR.SUITS).map(([id,v])=>`<option value="${id}" ${b.suit===id?'selected':''}>${v.name}</option>`).join('')}</select></label><p id="suit-note-${i}" class="suit-note"></p><details class="suit-passive"><summary>套装战斗被动</summary><p id="suit-passive-${i}"></p></details></section>
        <section class="resistance-editor"><div class="ev-heading"><strong>伤害抗性</strong><span>伤害减免 %</span></div><div class="resistance-damage">${Object.entries(E.GEAR.DAMAGE_LABELS).map(([k,v])=>`<label>${v}${numberField(`${i}-res-${k}`,b.resistance[k],0,100,`${sideName(i)}${v}抗性`)}</label>`).join('')}</div><p class="growth-help">实验范围 0–100%；35 表示对应伤害减免 35%。暴击抗性不降低暴击概率。</p><div class="ev-heading"><strong>异常抗性</strong><span>选择两种不同异常</span></div><div class="resistance-status">${ailmentSelect(i,'major',b.resistance.major,55)}${ailmentSelect(i,'minor',b.resistance.minor,18)}</div><p class="growth-help">仅这两个槽生效，不额外加全免 5%；当前配招与套装涉及麻痹、疲惫、失明。成功抵抗后获得等时长异常免疫。</p></section>
        <div class="growth-top"><label>等级${numberField(`${i}-level`, b.level, 1, 100, `${sideName(i)}等级`)}</label><label>个体值<select name="${i}-iv" aria-label="${sideName(i)}个体值">${Array.from({length:32},(_,n)=>`<option value="${n}" ${n === b.iv ? 'selected' : ''}>${n}</option>`).join('')}</select></label><label class="nature-select">性格<select name="${i}-nature" aria-label="${sideName(i)}性格">${Object.keys(E.NATURES).map(n=>`<option value="${n}" ${n === b.nature ? 'selected' : ''}>${n} · ${natureDescription(n)}</option>`).join('')}</select></label></div>
        <p class="nature-note" id="nature-note-${i}">${natureDescription(b.nature)}；性格不影响体力。</p>
        <div class="ev-heading"><strong>学习力分配</strong><span id="ev-total-${i}" aria-live="polite"></span></div><div class="ev-track"><div id="ev-fill-${i}"></div></div>
        <div class="ev-presets"><button type="button" data-preset="speed" data-side="${i}">攻速 255 / 255</button><button type="button" data-preset="hp" data-side="${i}">攻体 255 / 255</button><button type="button" data-preset="clear" data-side="${i}">清空学习力</button></div>
        <div class="growth-table-wrap"><table class="growth-table"><thead><tr><th scope="col">能力 / 种族</th><th scope="col">学习力</th><th scope="col">额外加成</th><th scope="col">套装</th><th scope="col">最终值</th></tr></thead><tbody>${Object.entries(statLabels).map(([key,name])=>`<tr><th scope="row">${name}<small>${data.base[key]}</small></th><td>${numberField(`${i}-ev-${key}`,b.evs[key],0,255,`${sideName(i)}${name}学习力`)}</td><td>${numberField(`${i}-bonus-${key}`,b.bonuses[key],0,999,`${sideName(i)}${name}额外加成`)}</td><td class="suit-gain"><output id="suit-gain-${i}-${key}"></output></td><td><output id="preview-${i}-${key}"></output></td></tr>`).join('')}</tbody></table></div>
        <p class="growth-help">个体值作用于全部六项。学习力单项 ≤255、合计 ≤510；额外加成在性格计算后相加，可填写体力上限药剂等其他加成；刻印在下方单独填写。</p>
        <section class="inscription-editor"><h3>刻印数值 <small>三组合计加入面板</small></h3><p class="growth-help">每组自主填写六项数值，默认 0。已填入刻印的加成无需再填到“额外加成”。</p>${b.inscriptions.map((slot,j)=>`<fieldset class="inscription-slot"><legend>刻印 ${j+1}</legend><div class="inscription-grid">${Object.entries(statLabels).map(([key,name])=>`<label>${name}${numberField(`${i}-inscription-${j}-${key}`,slot[key],0,999,`${sideName(i)}刻印${j+1}${name}`)}</label>`).join('')}</div></fieldset>`).join('')}<p class="inscription-total" id="inscription-total-${i}"></p></section>
        <p id="growth-error-${i}" class="growth-error" role="alert"></p>
        <details class="override"><summary>直接调整最终数值 <span>留空使用养成计算</span></summary><p class="growth-help">填写后覆盖该项含套装与三组刻印的最终值，不再追加加成；橙色最终值表示手动覆盖。</p><div class="editor-grid">${Object.entries(statLabels).map(([key,name])=>`<label>${name}${numberField(`${i}-override-${key}`,b.overrides[key],1,9999,`${sideName(i)}${name}直接数值`,true)}</label>`).join('')}</div><button type="button" data-auto="${i}" class="text-button">清除覆盖，恢复自动计算</button></details>
      </fieldset>`;
    }).join('');
    $('seed').value = state.seed; $('criticals').checked = state.criticals;
    updateGrowthPreview();
  }
  function readBuild(i) {
    const fields = $('settings-form').elements;
    const number = key => { const raw = fields.namedItem(`${i}-${key}`).value; return raw === '' ? NaN : Number(raw); };
    return { suit: fields.namedItem(`${i}-suit`).value, resistance: { ...Object.fromEntries(Object.keys(E.GEAR.DAMAGE_LABELS).map(k=>[k,number(`res-${k}`)])), major:fields.namedItem(`${i}-res-major`).value, minor:fields.namedItem(`${i}-res-minor`).value }, level: number('level'), iv: number('iv'), nature: fields.namedItem(`${i}-nature`).value,
      evs: Object.fromEntries(Object.keys(statLabels).map(key=>[key,number(`ev-${key}`)])),
      inscriptions: Array.from({length:3},(_,j)=>Object.fromEntries(Object.keys(statLabels).map(key=>[key,number(`inscription-${j}-${key}`)]))),
      bonuses: Object.fromEntries(Object.keys(statLabels).map(key=>[key,number(`bonus-${key}`)])),
      overrides: Object.fromEntries(Object.keys(statLabels).filter(key=>fields.namedItem(`${i}-override-${key}`).value !== '').map(key=>[key,number(`override-${key}`)])) };
  }
  function updateGrowthPreview() {
    let valid = true;
    state.fighters.forEach((f,i)=>{
      const b = readBuild(i), sum = Object.values(b.evs).reduce((a,n)=>a+(Number.isFinite(n)?n:0),0);
      $('ev-total-'+i).textContent = `${sum} / 510 · ${sum <= 510 ? `剩余 ${510-sum}` : `超出 ${sum-510}`}`;
      $('ev-total-'+i).classList.toggle('invalid',sum>510);
      $('ev-fill-'+i).style.width = `${Math.max(0,Math.min(100,sum/510*100))}%`;
      $('ev-fill-'+i).classList.toggle('invalid',sum>510);
      $('nature-note-'+i).textContent = `${natureDescription(b.nature)}；性格不影响体力。`;
      $('suit-note-'+i).textContent=E.GEAR.SUITS[b.suit].statsText;
      $('suit-passive-'+i).textContent=E.GEAR.SUITS[b.suit].passive;
      for(const [slot,other]of [['major','minor'],['minor','major']]) for(const opt of $('settings-form').elements.namedItem(`${i}-res-${slot}`).options) opt.disabled=Boolean(opt.value&&opt.value===b.resistance[other]);
      try {
        const result = E.calculateStats(f.species,b);
        $('inscription-total-'+i).textContent='刻印合计：'+Object.entries(statLabels).map(([key,label])=>`${label} +${result.build.inscriptions.reduce((sum,slot)=>sum+slot[key],0)}`).join(' · ');
        for (const key of Object.keys(statLabels)) {
          const out = $(`preview-${i}-${key}`), manual = Object.hasOwn(result.build.overrides,key);
          $(`suit-gain-${i}-${key}`).textContent=result.suitBonuses[key]?`+${result.suitBonuses[key]}`:'—';
          $(`suit-gain-${i}-${key}`).classList.toggle('overridden',manual);
          $(`suit-gain-${i}-${key}`).title=manual?'已被直接最终数值覆盖':'套装自动加成';
          out.textContent = result.stats[key]; out.classList.toggle('manual',manual);
          out.title = manual ? `养成计算 ${result.calculated[key]}；手动覆盖 ${result.stats[key]}` : `自动计算 ${result.stats[key]}`;
          $('settings-form').elements.namedItem(`${i}-override-${key}`).placeholder = result.calculated[key];
        }
        $('growth-error-'+i).textContent = '';
      } catch(error) {
        valid = false; $('growth-error-'+i).textContent = error.message;
        for (const key of Object.keys(statLabels)) $(`preview-${i}-${key}`).textContent = '—';
      }
    });
    $('apply-settings').disabled = !valid;
    $('settings-error').textContent = valid ? '' : '请修正养成参数后再应用。';
  }
  $('stats-editors').addEventListener('input',updateGrowthPreview);
  $('stats-editors').addEventListener('change',updateGrowthPreview);
  $('stats-editors').addEventListener('click',event=>{
    const preset = event.target.closest('[data-preset]'), auto = event.target.closest('[data-auto]');
    if (preset) {
      const i = Number(preset.dataset.side), mode = preset.dataset.preset;
      for (const key of Object.keys(statLabels)) $('settings-form').elements.namedItem(`${i}-ev-${key}`).value = mode === 'clear' ? 0 : key === 'atk' || key === (mode === 'speed' ? 'spe' : 'maxHp') ? 255 : 0;
      updateGrowthPreview();
    }
    if (auto) { for (const key of Object.keys(statLabels)) $('settings-form').elements.namedItem(`${auto.dataset.auto}-override-${key}`).value = ''; updateGrowthPreview(); }
  });
  $('settings-form').addEventListener('submit', event => {
    event.preventDefault();
    try {
      restart({ wikiSnapshots:state.initial.wikiSnapshots,wikiLoadouts:state.initial.wikiLoadouts,species: state.fighters.map(f=>f.species), builds: [readBuild(0),readBuild(1)], seed: $('seed').value, criticals: $('criticals').checked });
      syncSettings(); $('settings-error').textContent = '';
    } catch (error) { $('settings-error').textContent = error.message; }
  });
  $('export').addEventListener('click', () => {
    const record = { app: '赛尔号对战实验台', version: E.VERSION, rules: 'experimental-v10', ...state };
    $('export-content').value = JSON.stringify(record, null, 2);
    $('download-status').textContent = '';
    $('export-dialog').showModal();
  });
  $('close-export').addEventListener('click', () => $('export-dialog').close());
  $('download-export').addEventListener('click', () => {
    const blob = new Blob([$('export-content').value], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = `seer-battle-${state.turns.length}-rounds.json`; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('download-status').textContent = '已发起下载。若浏览器没有保存文件，请选中上方文本并复制保存。';
  });
  window.addEventListener('wiki-start-battle',event=>{try{const {snapshots,loadouts}=event.detail;const species=snapshots.map(s=>E.WIKI.profileFor(s).key);restart({species,builds:[readBuild(0),readBuild(1)],wikiSnapshots:snapshots,wikiLoadouts:loadouts,seed:$('seed').value,criticals:$('criticals').checked});syncSettings();$('wiki-pair-status').textContent='在线阵容已生效；本局使用加载时的数据快照。';}catch(error){$('wiki-pair-status').textContent='未开局：'+error.message;}});
  render(); renderLogs(); syncSettings();
  const context = document.modelContext;
  if (context?.registerTool) {
    const lifecycle = new AbortController();
    const register = tool => { try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch (_) {} };
    const snapshot = () => ({ round: state.round, finished: state.finished, winner: state.winner, selected: [...selected], fighters: state.fighters, lastTurn: state.turns.at(-1) ?? null });
    register({ name: 'read_battle', description: '读取双方血量、PP、能力等级、选招和最近回合。', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: snapshot });
    register({ name: 'stage_battle_moves', description: '为双方选择本回合技能，不结算回合。', inputSchema: { type: 'object', properties: { a: { type: 'string' }, b: { type: 'string' } }, required: ['a', 'b'], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) {
      if (!input || state.finished || !E.availableMoves(state.fighters[0]).includes(input.a) || !E.availableMoves(state.fighters[1]).includes(input.b)) throw new Error('双方技能必须合法且有 PP。');
      selected = [input.a, input.b]; render(); return snapshot();
    } });
    register({ name: 'resolve_battle_turn', description: '结算双方已经选定的技能，推进一个回合。', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute() { settle(); return snapshot(); } });
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  }
})();
