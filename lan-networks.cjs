'use strict';
const os=require('node:os');
const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const privateAddress=ip=>/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.)/.test(ip);
const virtual=/virtual|vmware|vmnet|hyper-v|vethernet|wsl|virtualbox|vbox|vpn|tunnel|wireguard|wintun|tailscale|mullvad|zerotier|docker|tap-windows|hamachi|loopback/i;
function interfaces(){
  return Object.entries(os.networkInterfaces()).flatMap(([name,rows])=>rows.filter(n=>n.family==='IPv4'&&!n.internal&&privateAddress(n.address)).map(n=>({name,ip:n.address})));
}
async function windowsAdapters(){
  if(process.platform!=='win32')return [];
  const script=`
    [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)
    $hardware=@{}
    try { Get-NetAdapter -ErrorAction Stop | ForEach-Object { $hardware[$_.Name]=[bool]$_.HardwareInterface } } catch {}
    $rows=foreach($nic in [Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces()){
      if($nic.OperationalStatus -ne 'Up'){continue}
      $props=$nic.GetIPProperties()
      foreach($v4 in $props.UnicastAddresses){
        if($v4.Address.AddressFamily -ne 'InterNetwork'){continue}
        [pscustomobject]@{ip=$v4.Address.ToString();type=$nic.NetworkInterfaceType.ToString();description=$nic.Description;physical=$hardware[$nic.Name];gateway=[bool]($props.GatewayAddresses | Where-Object {$_.Address.AddressFamily -eq 'InterNetwork'})}
      }
    }
    ConvertTo-Json -Compress -InputObject @($rows)`;
  try{
    const {stdout}=await promisify(execFile)('powershell.exe',['-NoProfile','-NonInteractive','-Command',script],{windowsHide:true,timeout:7000});
    return JSON.parse(stdout.trim());
  }catch{return [];}
}
function rank(rows,adapters){
  return rows.map(({ip,name})=>{
    const meta=adapters.find(n=>n.ip===ip)??{};
    const wireless=meta.type==='Wireless80211'||/^(wl(an|p)|wi-?fi|无线)/i.test(name);
    const wired=meta.type==='Ethernet'||/^(eth|en[opsx]|Ethernet|以太网)/i.test(name);
    const isVirtual=meta.physical===false||virtual.test(name+' '+(meta.description??''))||['Tunnel','Ppp'].includes(meta.type);
    const physical=!isVirtual&&(meta.physical===true||wireless||wired);
    const kind=physical?(wireless?'wifi':wired?'ethernet':'physical'):'other';
    const score=(physical?10:0)+(kind==='wifi'?4:0)+(physical&&meta.gateway?1:0)-(isVirtual?10:0);
        const identity=name+' '+(meta.description??'');
    const purpose=/vmware|vmnet/i.test(identity)?'VMware 虚拟机':/\bWSL\b/i.test(identity)?'WSL 虚拟网络':/vpn|tunnel|wireguard|wintun|tailscale|mullvad/i.test(identity)?'VPN':null;
    return {ip,name,kind,purpose,physical,score};
  }).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)||a.ip.localeCompare(b.ip));
}
async function networks(rows=interfaces()){return rank(rows,await windowsAdapters());}
module.exports={interfaces,networks,rank};
