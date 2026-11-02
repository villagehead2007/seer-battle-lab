// Diagnostic preload: retain test callbacks/assertions and report the active test.
const Module=require('node:module'),load=Module._load;
Module._load=function(id,...args){const value=load.call(this,id,...args);if(id!=='node:test')return value;
 const wrapped=function(name,...rest){const i=rest.findLastIndex(x=>typeof x==='function');if(i>=0){const fn=rest[i];rest[i]=function(...a){process.stderr.write('BEGIN '+name+'\n');const result=fn.apply(this,a);if(result?.then)return result.finally(()=>process.stderr.write('END '+name+'\n'));process.stderr.write('END '+name+'\n');return result;};}return value(name,...rest);};Object.assign(wrapped,value);return wrapped;
};
