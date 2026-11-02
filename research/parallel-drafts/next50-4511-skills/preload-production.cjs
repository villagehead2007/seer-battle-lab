'use strict';
// Private validation loader only. Integration test itself contains no private runtime hooks.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
function install(file,transform){const p=require.resolve('../../../dist/'+file),text=fs.readFileSync(p,'utf8'),m=new Module(p,module);m.filename=p;m.paths=Module._nodeModulePaths(path.dirname(p));require.cache[p]=m;m._compile(transform(text),p);}
install('range-effects.js',t=>{let fragment=fs.readFileSync(path.join(__dirname,'range-effects.production-fragment.js'),'utf8');if(t.includes(fragment.trim()))return t;const q=fragment.indexOf('// Q006:');if(q>=0&&t.includes(fragment.slice(0,q).trim()))fragment=fragment.slice(q);const i=t.lastIndexOf('\n});');if(i<0)throw Error('range end missing');return t.slice(0,i)+'\n'+fragment+t.slice(i);});
install('souls.js',t=>{for(const e of require('./souls.production-edits.json')){if(t.includes(e.replacement))continue;if(t.split(e.old).length!==2)throw Error('nonunique engine anchor '+e.reason);t=t.replace(e.old,e.replacement);}return t;});
