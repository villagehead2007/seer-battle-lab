'use strict';
const native=value=>JSON.parse(JSON.stringify(value));
const fallback=Symbol('native-json-copy');
module.exports=function jsonCopy(value){
 try{
  if(Object.getOwnPropertyDescriptor(Object.prototype,'toJSON')||Object.getOwnPropertyDescriptor(Array.prototype,'toJSON'))return native(value);
  const ancestors=new Set();
  function visit(v){
   if(v===null)return null;
   if(typeof v==='string'||typeof v==='boolean')return v;
   if(typeof v==='number')return Number.isFinite(v)?v===0?0:v:null;
   if(typeof v==='undefined'||typeof v==='symbol')return undefined;
   if(typeof v!=='object')throw fallback;
   const array=Array.isArray(v),proto=Object.getPrototypeOf(v),custom=Object.getOwnPropertyDescriptor(v,'toJSON');
   if(array?proto!==Array.prototype:proto!==Object.prototype&&proto!==null)throw fallback;
   if(custom&&(custom.get||custom.set||typeof custom.value==='function'))throw fallback;
   if(ancestors.has(v))throw fallback;ancestors.add(v);
   const out=array?new Array(v.length):{};
   const keys=array?null:Object.keys(v);
   const count=array?v.length:keys.length;
   for(let i=0;i<count;i++){
    const key=array?String(i):keys[i],d=Object.getOwnPropertyDescriptor(v,key);
    if(!d){if(key in v)throw fallback;out[key]=null;continue;}
    if(d.get||d.set)throw fallback;
    const child=visit(d.value);
    if(child===undefined){if(array)out[key]=null;continue;}
    if(key==='__proto__')Object.defineProperty(out,key,{value:child,writable:true,enumerable:true,configurable:true});else out[key]=child;
   }
   ancestors.delete(v);return out;
  }
  const result=visit(value);return result===undefined?native(value):result;
 }catch{return native(value);}
};
