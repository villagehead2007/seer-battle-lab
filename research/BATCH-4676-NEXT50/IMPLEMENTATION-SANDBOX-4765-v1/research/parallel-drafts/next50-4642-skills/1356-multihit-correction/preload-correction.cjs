'use strict';
const fs=require('fs'),path=require('path'),Module=require('module'),old=Module.prototype._compile,source=path.resolve(__dirname,'../../../../dist/range-effects.js');
Module.prototype._compile=function(code,file){if(path.resolve(file)===source){const at=code.lastIndexOf('\n});');if(at<0)throw Error('range correction anchor');code=code.slice(0,at)+fs.readFileSync(path.join(__dirname,'1356.production-fragment.js'),'utf8')+'\n'+code.slice(at);}return old.call(this,code,file);};
