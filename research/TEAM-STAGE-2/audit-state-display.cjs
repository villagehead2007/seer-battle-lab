'use strict';
// Run with node --expose-internals to use the parser bundled with Node.
const fs=require('node:fs'),path=require('node:path');
const acorn=require('internal/deps/acorn/acorn/dist/acorn');
const root=path.resolve(__dirname,'../..'),catalog=new Map(),dynamic=[];
const domains=new Set(['soulState','counts','effects','ailments','statusState','suitState','celestials','teamEntryGrants','teamRoundAilments','teamSwitchWindows','teamBlocks','teamOscarBlessings','teamAttackBlock','teamBench','teamDeathOrder']);
const ui=new Set(['app.js','team-ui.js','battle-display.js']);
const files=fs.readdirSync(path.join(root,'dist')).filter(n=>n.endsWith('.js')&&!['wiki-ui.js','wiki-request.js','type-catalog.js','status-catalog.js','characteristic-catalog.js','wiki-verified.js'].includes(n));
function children(n){
  const result=[];for(const [k,v] of Object.entries(n)){
    if(['start','end','loc','range'].includes(k)||!v||typeof v!=='object')continue;
    if(Array.isArray(v)){for(const item of v)if(item?.type)result.push(item);}
    else if(v.type)result.push(v);
  }return result;
}
function prop(n){return !n.computed&&n.property?.type==='Identifier'?n.property.name:n.property?.type==='Literal'?String(n.property.value):'*';}
for(const file of files){
 const source=fs.readFileSync(path.join(root,'dist',file),'utf8'),ast=acorn.parse(source,{ecmaVersion:'latest',locations:true,sourceType:'script'});
 const helpers=new Map(),displayRanges=[];
 function resolve(n,env){
   if(!n)return null;if(n.type==='ChainExpression')return resolve(n.expression,env);
   if(n.type==='Identifier')return env.get(n.name)??null;
   if(n.type==='AssignmentExpression')return resolve(n.left,env);
   if(n.type==='LogicalExpression')return resolve(n.left,env)??resolve(n.right,env);
   if(n.type==='MemberExpression'){const k=prop(n),base=resolve(n.object,env);return base?base+'.'+k:domains.has(k)?k:null;}
   if(n.type==='CallExpression'&&n.callee.type==='Identifier')return helpers.get(n.callee.name)??null;
   return null;
 }
 function hit(key,n,mode){
   if(!key)return;
   const row=catalog.get(key)??{path:key,read:0,write:0,clear:0,existingView:0,locations:{}};
   const isDisplay=ui.has(file)||displayRanges.some(([first,last])=>n.start>=first&&n.end<=last);
   const bucket=isDisplay?'existingView':mode;
   row[bucket]++;
   const ref='dist/'+file+':'+n.loc.start.line;
   if(!(row.locations[bucket]??=[]).includes(ref)&&row.locations[bucket].length<4)row.locations[bucket].push(ref);
   catalog.set(key,row);
 }
 function objectFields(n,key){
   if(!key||n?.type!=='ObjectExpression')return;
   for(const p of n.properties)if(p.type==='Property'&&!p.method&&p.kind==='init'){
     const name=p.key.name??p.key.value;if(name==null)continue;hit(key+'.'+name,p,'write');objectFields(p.value,key+'.'+name);
   }
 }
 function walk(n,env,parent=null){
   if(/Function/.test(n.type)||n.type==='BlockStatement')env=new Map(env);
   if(n.type==='VariableDeclarator'&&n.id.type==='Identifier'){
     const k=resolve(n.init,env);env.set(n.id.name,k);
   }
   if(n.type==='VariableDeclarator'&&n.id.type==='ObjectPattern'){
     const base=resolve(n.init,env);
     if(base)for(const item of n.id.properties)if(item.type==='Property'&&item.value.type==='Identifier')env.set(item.value.name,base+'.'+(item.key.name??item.key.value));
   }
   if(n.type==='MemberExpression'){
     const key=resolve(n,env),assign=parent?.type==='AssignmentExpression'&&parent.left===n;
     const mode=assign||parent?.type==='UpdateExpression'?'write':parent?.type==='UnaryExpression'&&parent.operator==='delete'?'clear':'read';
     if(!(parent?.type==='CallExpression'&&parent.callee===n)&&prop(n)!=='length')hit(key,n,mode);if(assign)objectFields(parent.right,key);
     if(key?.includes('*')&&(mode==='write'||mode==='clear'))dynamic.push({key,mode,file,line:n.loc.start.line,expression:source.slice(n.start,n.end).slice(0,240)});
   }
   if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'){
     const method=prop(n.callee);
     if(['push','pop','shift','unshift','splice','fill','set','delete','add','clear'].includes(method))hit(resolve(n.callee.object,env),n,method==='clear'||method==='delete'?'clear':'write');
     const domain=({timed:'effects',ailment:'ailments',grantState:'statusState',addSpecialState:'soulState.specialStates'})[method];
     if(domain&&n.arguments[1]?.type==='Literal')hit(domain+'.'+n.arguments[1].value,n,'write');
   }
   for(const child of children(n))walk(child,env,n);
 }
 // Named accessors return a state object used by a different hook in this module.
 function discover(n){
   if(n.type==='AssignmentExpression'&&n.left.type==='MemberExpression'&&prop(n.left)==='describeEffects')displayRanges.push([n.right.start,n.right.end]);
   if(n.type==='VariableDeclarator'&&n.id.type==='Identifier'&&n.init?.type==='ArrowFunctionExpression'){
     const k=resolve(n.init.body,new Map());if(k)helpers.set(n.id.name,k);
   }
   if(n.type==='FunctionDeclaration'&&n.id){
     const ret=n.body.body.find(x=>x.type==='ReturnStatement'),k=resolve(ret?.argument,new Map());if(k)helpers.set(n.id.name,k);
   }
   for(const child of children(n))discover(child);
 }
 discover(ast);walk(ast,new Map());
}
const rows=[...catalog.values()].sort((a,b)=>a.path.localeCompare(b.path));
const report={files,method:'AST成员路径、局部别名、状态获取函数、字面量状态注册、写入/读取/清除和展示位置；动态键保留表达式待逐来源核验。引用不等于可展示或已实现。',rows,dynamic};
fs.writeFileSync(path.join(__dirname,'state-display-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log('modules',files.length,'paths',rows.length,'dynamic writes',dynamic.length);
