'use strict';
const byId=id=>document.getElementById(id);
const launch=byId('open-room'),info=byId('room-info');
const feedback=byId('room-feedback'),copy=byId('copy-invite');

async function manage(op){
  const res=await fetch('/api/lan/'+op,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
  if(op==='current'&&res.status===404)return {};
  const data=await res.json();if(!res.ok)throw Error(data.error||'无法管理房间');return data;
}
async function networkList(room){
  if(room.networks)return room.networks;
  // An already running launcher can serve this page while its room still uses the old API.
  try{
    const [snapshot,health]=await Promise.all(['/lan-adapters.local.json','/api/launcher/health'].map(async url=>(await fetch(url,{cache:'no-store'})).json()));
    if(snapshot.pid===health.pid&&snapshot.revision===health.revision)return snapshot.networks;
  }catch{}
  return [];
}
async function copyField(field){
  let copied=false;
  try{await navigator.clipboard.writeText(field.value);copied=true;}catch{
    field.focus();field.select();try{copied=document.execCommand('copy');}catch{}
  }
  feedback.textContent=copied?'已复制邀请链接，发给朋友即可。':'请手动复制已选中的邀请链接。';
}
function purpose(item){
  if(item.kind==='wifi')return '发给连接同一 Wi-Fi 的朋友';
  if(item.kind==='ethernet')return '发给连接同一有线局域网的朋友';
  return item.purpose?'通过'+item.purpose+'加入':'发给连接同一网络的朋友';
}
async function render(room){
  feedback.textContent='';
  if(!room.host){info.hidden=true;launch.hidden=false;return;}
  const adapters=await networkList(room);
  const urls=new Map(room.join.map(url=>[new URL(url).hostname,url]));
  const links=[];
  for(const item of adapters){
    if(!urls.has(item.ip))continue;
    links.push({...item,url:urls.get(item.ip)});urls.delete(item.ip);
  }
  for(const [ip,url] of urls)links.push({ip,url,name:ip});
  byId('enter-host').href=room.host;byId('local-guest').href=room.localJoin;
  const [main,...others]=links;
  byId('invitation').hidden=!main;
  if(main){
    byId('invite-purpose').textContent=purpose(main);byId('network-name').textContent=main.name;
    byId('invite-url').value=main.url;copy.onclick=()=>copyField(byId('invite-url'));
  }else feedback.textContent='未检测到局域网 IPv4 地址。';
  const alternatives=byId('alternatives');alternatives.replaceChildren();
  others.forEach((item,index)=>{
    const label=document.createElement('label'),row=document.createElement('div'),field=document.createElement('textarea'),button=document.createElement('button');
    label.textContent=[item.purpose??(item.physical?purpose(item):''),item.name].filter(Boolean).join(' · ');
    field.id='alt-url-'+index;label.htmlFor=field.id;field.readOnly=true;field.rows=2;field.spellcheck=false;field.value=item.url;
    row.className='invite-row';button.className='button secondary';button.textContent='复制';button.onclick=()=>copyField(field);
    row.append(field,button);alternatives.append(label,row);
  });
  byId('other-networks').open=false;byId('other-networks').hidden=!others.length;
  launch.hidden=true;info.hidden=false;
}
async function change(op){
  launch.disabled=true;
  try{await render(await manage(op));}catch(e){feedback.textContent=e.message;}finally{launch.disabled=false;}
}
launch.onclick=()=>change('open');
byId('close-room').onclick=async()=>{
  if(!confirm('结束当前战局并关闭局域网房间？'))return;
  const close=byId('close-room');close.disabled=true;
  try{await change('close');}finally{close.disabled=false;}
};
change('current');
