'use strict';const fs=require('fs'),{createClient}=require('../wiki-client.cjs'),url='https://wiki.biligame.com/seer/api.php?action=query&format=json&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&titles='+encodeURIComponent('精灵:4270|魂印:1492|魂印:1760|提西弗涅');const c=createClient(async u=>{const r=await fetch(u,{signal:AbortSignal.timeout(25000)});return{status:r.status,body:await r.json()};},{interval:5000,label:'BWIKI'});(async()=>{const o={records:[],failures:[]};try{o.records.push({url,loadedAt:new Date().toISOString(),data:await c.request(url)});}catch(e){o.failures.push({url,error:e.message});process.exitCode=1;}fs.writeFileSync('research/4270-wiki-source.json',JSON.stringify(o,null,2)+'\n');console.log({records:o.records.length,failures:o.failures});})();





