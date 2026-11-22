'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),sourceDir=path.join(root,'data/species');
const dest=path.join(root,'data','team-gender-evidence.json');
const evidence=fs.existsSync(dest)?JSON.parse(fs.readFileSync(dest,'utf8')):{records:{},unmatched:{}};
const client=require('../../wiki-client.cjs').createClient(async url=>{
  const res=await fetch(url,{headers:{Accept:'application/json','User-Agent':'SeerBattleLab/0.8 (personal battle simulator; read-only data client)'},signal:AbortSignal.timeout(30000)});
  const text=await res.text();
  if(!res.ok)return {status:res.status,retryAfter:res.headers.get('retry-after'),body:{}};
  try{return {status:200,body:JSON.parse(text)};}catch{throw Error('资料服务未返回 JSON：'+url);}

},{interval:1500,label:'SeerAPI'});
async function main(){
  for(const file of fs.readdirSync(sourceDir).filter(f=>/^\d+\.json$/.test(f))){
    const local=JSON.parse(fs.readFileSync(path.join(sourceDir,file),'utf8')).snapshot;
    if(local.gender||evidence.records[local.id]?.localRevision===local.source.revision)continue;
    const url='https://api.seerapi.com/v1/pet/'+local.id;
    let response;
    for(let tries=0;tries<3;tries++){
      try{response=await client.request(url);break;}catch(error){
        if(tries===2)throw error;
        const seconds=error.retryAfter??60;console.log(local.id,error.message,'等待',seconds,'秒');
        await new Promise(resolve=>setTimeout(resolve,(seconds+1)*1000));
      }
    }
    const pet=response.data??response;
    const stats={maxHp:'hp',atk:'atk',def:'def',spa:'sp_atk',spd:'sp_def',spe:'spd'};
    const matches=pet.id===local.id&&pet.name===local.name&&(pet.hash===local.source.revision||Object.entries(stats).every(([k,v])=>Number(pet.base_stats?.[v])===local.base[k]));
    if(matches&&[0,1,2,3].includes(pet.gender?.id)&&pet.gender.url?.endsWith('/pet_gender/'+pet.gender.id)&&pet.hash){
      evidence.records[local.id]={name:local.name,localRevision:local.source.revision,genderId:pet.gender.id,genderUrl:pet.gender.url,url,sourceRevision:pet.hash};
      delete evidence.unmatched[local.id];
    }else evidence.unmatched[local.id]={url,sourceRevision:pet.hash,reason:'编号、名称、种族值或性别来源不匹配'};
    const temp=dest+'.tmp';fs.writeFileSync(temp,JSON.stringify(evidence,null,2)+'\n');fs.renameSync(temp,dest);
  }
  console.log('核对成功',Object.keys(evidence.records).length,'未匹配',Object.keys(evidence.unmatched).length);
}
main().catch(err=>{console.error(err.message);process.exitCode=1;});
