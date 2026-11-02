'use strict';
// Installs only process-local module compilation overrides. No production writes.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../../..'),spec=require('./implementation-replacements.json');
const previous=Module._extensions['.js'];
Module._extensions['.js']=function(mod,filename){const matches=spec.patches.filter(x=>path.resolve(root,x.file)===filename);if(!matches.length)return previous(mod,filename);let code=fs.readFileSync(filename,'utf8');for(const p of matches){if(code.split(p.needle).length!==2)throw Error('Draft anchor drift: '+p.file+' '+p.why);code=code.replace(p.needle,p.insert);}mod._compile(code,filename);};
module.exports=require(path.join(root,'dist/engine.js'));
