'use strict';

const fs=require('node:fs');
const path=require('node:path');
const certification=require('./team-note-certification.cjs');
const directory='research/POST-V9-20261121';
const targets=new Set([20001,4969,3592,3396]);

function current(id,read){
  if(!targets.has(id))return null;
  try{
    const rows=read(`${directory}/current-team-rows.json`).records.filter(row=>row.speciesId===id);
    const entries=read(`${directory}/current-team-proof.json`).entries;
    return {rows,entries};
  }catch{return null;}
}

function accepted(id,read){
  if(!targets.has(id))return [];
  try{
    return fs.readdirSync(path.join(__dirname,directory)).filter(name=>/^formal-[a-f0-9]{16}$/.test(name)).flatMap(folder=>{
      const base=`${directory}/${folder}`;
      try{
        const receipt=read(`${base}/team-note-receipt.json`),result=read(`${base}/result.json`);
        return certification.acceptedSpecies(result,receipt.fingerprint).has(id)?[receipt.rows]:[];
      }catch{return [];}
    });
  }catch{return [];}
}

module.exports={current,accepted};
