'use strict';
const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const base='research/parallel-drafts/next50-4620-',read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),hash=t=>crypto.createHash('sha256').update(t).digest('hex'),out={},changes=[];
assert.ok(!fs.existsSync('research/4620-production-integration.json'),'already integrated');
for(const kind of ['soul','skills']){const files=json(base+kind+'/FREEZE.json').files;for(const e of Array.isArray(files)?files:Object.entries(files).map(([file,sha256])=>({file,sha256})))assert.equal(hash(fs.readFileSync(base+kind+'/'+(e.file??e.path))),e.sha256,kind+'/'+(e.file??e.path));}
for(const p of ['dist/souls.js','dist/range-souls.js','dist/range-effects.js','dist/effect-registry.js'])out[p]=read(p).replace(/\r\n/g,'\n');
for(const kind of ['soul','skills'])for(const[i,p]of json(base+kind+'/souls.production-edits.json').entries()){const n=out['dist/souls.js'].split(p.old).length-1;assert.equal(n,1,kind+' patch '+i);out['dist/souls.js']=out['dist/souls.js'].replace(p.old,p.replacement);changes.push({kind,index:i,old:p.old,matches:n});}
for(const[p,file,anchor,marker]of [['dist/range-souls.js',base+'soul/range-souls.production-fragment.js','\n}\n\n});','registry[1826]='],['dist/range-effects.js',base+'skills/range-effects.production-fragment.js','\n});','const bindings4620='],['dist/effect-registry.js',base+'skills/effect-registry.production-fragment.js','return Object.freeze({statusDeclarations,registry:','source4620=']]){if(p==='dist/effect-registry.js'&&!fs.existsSync(file))continue;const at=out[p].lastIndexOf(anchor);assert.ok(at>0,p);assert.ok(!out[p].includes(marker),'duplicate '+p);out[p]=out[p].slice(0,at)+'\n'+read(file)+'\n'+out[p].slice(at);}
// Test copying is deliberately completed only after inspecting each frozen private loader.
const instructions=json(base+'soul/production-test-copy.json');
for(const item of instructions.files){let text=read(base+'soul/'+item.from);for(const edit of item.edits??[]){assert.ok(text.includes(edit.old),item.from);text=text.replace(edit.old,edit.replacement);}out[item.to]=text;}
out['tests/helpers/4620-battle.cjs']=read(base+'skills/4620-battle.cjs').replaceAll('../../../dist/','../../dist/').replaceAll('../../../research/','../../research/');
out['tests/next50-4620-skills.test.cjs']=read(base+'skills/4620-skills.test.cjs').replace("require('./4620-battle.cjs')","require('./helpers/4620-battle.cjs')").replaceAll('../../../dist/','../dist/').replaceAll('../../../data/','../data/');
for(const[p,t]of Object.entries(out)){if(p.endsWith('.js')||p.endsWith('.cjs'))new Function(t);assert.ok(!p.startsWith('tests/')||!t.includes("require('./preload-production.cjs')"),'private preload copied');}
for(const[p,t]of Object.entries(out))fs.writeFileSync(p,t);
fs.writeFileSync('research/4620-production-integration.json',JSON.stringify({at:new Date().toISOString(),changes,files:Object.fromEntries(Object.entries(out).map(([p,t])=>[p,hash(t)])),note:'所有源绑定与原始arity阻塞保留；不改变旧确认范围；新填MD答案未读取落实'},null,2)+'\n');
console.log(JSON.stringify({files:Object.keys(out),patches:changes.length}));
