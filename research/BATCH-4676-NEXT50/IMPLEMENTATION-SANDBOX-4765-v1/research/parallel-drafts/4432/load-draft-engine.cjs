'use strict';
const fs=require('fs'),path=require('path'),Module=require('node:module');
const root=path.resolve(__dirname,'../../..'),spec=require('./implementation-replacements.json'),previous=Module._extensions['.js'];
Module._extensions['.js']=function(mod,filename){const patches=spec.patches.filter(p=>path.resolve(root,p.file)===filename);if(!patches.length)return previous(mod,filename);let text=fs.readFileSync(filename,'utf8');for(const p of patches){if(text.split(p.needle).length!==2)throw Error('Draft source anchor drift: '+p.file);text=text.replace(p.needle,p.insert);}mod._compile(text,filename);};
module.exports=require(path.join(root,'dist/engine.js'));
