'use strict';
// Log the unmodified gate's child results; return every real process result intact.
const fs=require('fs'),cp=require('child_process'),path=require('path');
const id=Number(process.argv[2]),tag=process.argv[3];
if(!Number.isInteger(id)||!/^[-a-zA-Z0-9]+$/.test(tag))throw Error('invalid gate log arguments');
const prefix='research/'+tag,run=cp.spawnSync,children=[];
cp.spawnSync=function(command,args,options){
 const result=run.call(cp,command,args,options),n=children.length+1;
 const log=prefix+'-child-'+n+'.log',output=String(result.stdout??'')+'\n'+String(result.stderr??'');
 fs.writeFileSync(log,output);children.push({command,args,status:result.status,signal:result.signal,error:result.error?.message??null,log,tests:Number(output.match(/[ℹ#] tests (\d+)/)?.[1]??0),passed:Number(output.match(/[ℹ#] pass (\d+)/)?.[1]??0)});
 return result;
};
process.on('exit',code=>fs.writeFileSync(prefix+'-result.json',JSON.stringify({id,exitCode:code,children},null,2)+'\n'));
process.argv=[process.execPath,path.resolve('automation-validate.cjs'),String(id)];
require('../automation-validate.cjs');
