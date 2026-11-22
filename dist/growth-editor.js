(function(root){
  'use strict';
  const G=root.BattleGrowthPresets,keys=Object.keys(G.teamBonus);
  const labels={atk:'攻击',spa:'特攻',def:'防御',spd:'特防',spe:'速度',maxHp:'体力',total:'六维总和'};
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const field=name=>document.getElementById('settings-form').elements.namedItem(name);
  const nameFor=(side,kind,slot)=>side+'-'+kind+(kind==='marks'?'-'+slot:'');
  const empty={marks:'手动填写',titles:'不装备称号',eyes:'不装备目镜'};
  const kinds={marks:'刻印预设',titles:'能力称号',eyes:'能力目镜'};
  function fill(select){
    const {side,kind,slot}=select.dataset,name=nameFor(side,kind,slot);
    const search=field(name+'-search'),sort=field(name+'-sort')?.value??'total';
    const selected=Number(select.dataset.selected)||null;
    const angles=Number(field(name+'-angles')?.value)||0;
    const options=G.candidates(kind,search.value,sort,angles,selected);
    const order=sort==='total'?keys:[sort,...keys.filter(k=>k!==sort)];
    function candidateText(x){
      const detail=kind==='marks'
        ? order.map(k=>labels[k]+' '+x.stats[k]).join('　')+' · 六维总和 '+G.total(x.stats)
        : x.effect;
      if(kind==='marks'){
        const ids=[x.id,...G.aliases(x.id).filter(id=>id!==x.id)];
        return x.name+' · '+x.angles+'角 · '+detail+' · '+ids.map(id=>'#'+id).join(' / ');
      }
      return x.name+' · '+detail+' · #'+x.id;
    }
    select.innerHTML='<option value="">'+empty[kind]+'</option>'+options.map(x=>
      '<option value="'+x.id+'">'+esc(candidateText(x))+'</option>').join('');
    select.value=selected??'';
    if(selected&&select.selectedIndex<0){
      const current=new Option('当前：'+candidateText(G.item(kind,selected))+'（筛选范围外）','current',true,true);
      current.hidden=true;select.prepend(current);select.value='current';
    }
  }
  function picker(side,kind,id,slot=0){
    const name=nameFor(side,kind,slot),label=kinds[kind];
    return '<div class="preset-picker"><label>搜索'+label+'<input type="search" data-filter="'+name+'" name="'+name+'-search" placeholder="名称或 ID"></label>'+
      (kind==='marks'?'<label>角数<select name="'+name+'-angles" data-filter="'+name+'">'+[0,5,4,3,2].map(n=>'<option value="'+n+'">'+(n?n+'角':'全部')+'</option>').join('')+'</select></label><label>排序<select name="'+name+'-sort" data-filter="'+name+'">'+[...keys,'total'].map(k=>'<option value="'+k+'" '+(k==='total'?'selected':'')+'>'+labels[k]+' ↓</option>').join('')+'</select></label>':'')+
      '<label>'+label+'<select name="'+name+'" data-growth-picker data-kind="'+kind+'" data-side="'+side+'" data-slot="'+slot+'" data-selected="'+(id??'')+'"></select></label>'+(kind==='eyes'?'<small id="'+side+'-eye-lock" hidden>腐蚀者套装占用目镜位</small>':'')+'</div>';
  }
  function bundles(side){
    return '<label>三槽一键套用<select name="'+side+'-bundle"><option value="">选择打法</option>'+G.sets.map((set,i)=>'<option value="'+i+'">'+set.name+' · '+esc(G.item('marks',set.ids[0]).name)+' ×2 ＋ '+esc(G.item('marks',set.ids[2]).name)+'</option>').join('')+'</select></label><button type="button" class="button secondary" data-apply-bundle="'+side+'">套用到三槽</button>';
  }
  function toggles(side,b){
    return '<section class="inscription-editor"><label><input type="checkbox" name="'+side+'-annual" '+(b.annualBonus?'checked':'')+'>年费加成 · 六维各 +10</label><h3>战队加成</h3><div class="inscription-grid">'+keys.map(k=>'<label><input type="checkbox" name="'+side+'-team-'+k+'" '+(b.teamBonus?.[k]?'checked':'')+'>'+labels[k]+' +'+G.teamBonus[k]+'</label>').join('')+'</div></section>';
  }
  function read(side){
    return {titleId:Number(field(side+'-titles').dataset.selected)||null,eyeId:Number(field(side+'-eyes').dataset.selected)||null,
      annualBonus:field(side+'-annual').checked,teamBonus:Object.fromEntries(keys.map(k=>[k,field(side+'-team-'+k).checked])),
      inscriptionPresetIds:[0,1,2].map(j=>Number(field(nameFor(side,'marks',j)).dataset.selected)||null)};
  }
  function refresh(side){
    const eye=field(side+'-eyes'),locked=field(side+'-suit').value==='corrosion';
    eye.disabled=field(side+'-eyes-search').disabled=locked;
    document.getElementById(side+'-eye-lock').hidden=!locked;
    if(locked&&(eye.dataset.selected||field(side+'-eyes-search').value)){eye.dataset.selected='';field(side+'-eyes-search').value='';fill(eye);}
    for(let j=0;j<3;j++){
      const select=field(nameFor(side,'marks',j)),mark=G.item('marks',Number(select.dataset.selected));
      const stats=Object.fromEntries(keys.map(k=>[k,field(side+'-inscription-'+j+'-'+k).valueAsNumber]));
      if(mark&&keys.some(k=>mark.stats[k]!==stats[k])){select.dataset.selected='';fill(select);}
      const sum=G.total(stats);
      document.getElementById(side+'-slot-total-'+j).textContent='本槽总和 '+(Number.isFinite(sum)?sum:'—');
    }
  }
  function applyMark(side,slot,id){
    const select=field(nameFor(side,'marks',slot)),mark=G.item('marks',id);
    if(!mark)return;

    select.dataset.selected=id;fill(select);
    for(const k of keys)field(side+'-inscription-'+slot+'-'+k).value=mark.stats[k];
  }
  function bind(container,preview){
    container.addEventListener('input',event=>{
      if(event.target.dataset.filter)fill(field(event.target.dataset.filter));
    });
    container.addEventListener('change',event=>{
      const select=event.target;
      if(select.dataset.filter){fill(field(select.dataset.filter));return;}
      if(!select.hasAttribute('data-growth-picker'))return;
      if(select.value==='current')return;
      select.dataset.selected=select.value;
      if(select.dataset.kind==='marks')applyMark(select.dataset.side,select.dataset.slot,Number(select.value));
    });
    container.addEventListener('click',event=>{
      const button=event.target.closest('[data-apply-bundle]');
      if(!button)return;
      const side=button.dataset.applyBundle,value=field(side+'-bundle').value;
      if(value==='')return;
      G.sets[Number(value)].ids.forEach((id,j)=>applyMark(side,j,id));
      preview();
    });
  }
  root.BattleGrowthEditor={picker,bundles,toggles,read,refresh,bind,fill};
})(globalThis);
