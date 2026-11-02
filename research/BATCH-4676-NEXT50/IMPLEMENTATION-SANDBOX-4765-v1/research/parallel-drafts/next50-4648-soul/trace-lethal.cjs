'use strict';
require('./preload-production.cjs');const path=require('path'),Module=require('module'),old=Module.prototype._compile;
Module.prototype._compile=function(code,file){if(path.resolve(file)===path.resolve(__dirname,'../../../dist/souls.js'))code=code.replace('function resolveDeath(f,defeater=null){',"function resolveDeath(f,defeater=null){if(f.soulId===1848&&f.hp<=0)process.stderr.write('TRACE1848 '+JSON.stringify({hp:f.hp,stage:f.soulState.starLethalUsed1848,policy:f.soulState.qualifiedStarLethalPhase1848})+' '+new Error().stack+'\\n');");return old.call(this,code,file);};
