'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname;
const files=['server.cjs','runtime-revision.cjs','local-species.cjs','seerapi.cjs',...fs.readdirSync(path.join(root,'dist')).filter(name=>name.endsWith('.js')).map(name=>'dist/'+name)].sort();
module.exports=()=>{const hash=crypto.createHash('sha256');for(const file of files){hash.update(file);hash.update(fs.readFileSync(path.join(root,file)));}return hash.digest('hex');};
