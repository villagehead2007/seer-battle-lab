'use strict';
// Passive reference data. This module must not register battle handlers.
const fs=require('fs'),path=require('path');
function freeze(value){if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;}
const database=freeze(JSON.parse(fs.readFileSync(path.join(__dirname,'data/statuses/statuses.json'),'utf8')));
const byId=new Map(database.records.map(row=>[row.id,row]));
const byName=new Map(database.records.map(row=>[row.name,row]));
module.exports=Object.freeze({
  database,
  list(){return database.records;},
  getById(id){if(!Number.isInteger(id)||id<0)throw new TypeError('状态ID必须是非负整数的SeerAPI异常参数编码');return byId.get(id)??null;},
  getByName(name){if(typeof name!=='string')throw new TypeError('状态名称必须是字符串');return byName.get(name)??null;}
});
