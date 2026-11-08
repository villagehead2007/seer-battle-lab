'use strict';
const fs=require('fs'),crypto=require('crypto'),zlib=require('zlib'),assert=require('assert/strict'),id=Number(process.argv[2]),batch=require('./STATUS.json');assert.ok(batch.ids.includes(id),'outside fixed range');
const file='data/species/'+id+'.json',dir='research/BATCH-4816-REMAINING/'+id,record=JSON.parse(fs.readFileSync(file)),source=JSON.parse(fs.readFileSync(dir+'/source.json')),pet=source.records.find(r=>r.resourceKey==='pet/'+id)?.data;
assert.equal(record.snapshot.id,id);assert.equal(record.snapshot.source.revision,pet.hash);assert.equal(source.complete,true);const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const inputs=['source.json','reference-research.json','damage-classification-reference.json','supplement.json'].filter(name=>fs.existsSync(dir+'/'+name)),archives=inputs.map(name=>{const bytes=fs.readFileSync(dir+'/'+name),compressed=zlib.gzipSync(bytes,{level:9});assert.ok(zlib.gunzipSync(compressed).equals(bytes));return {file:dir+'/'+name,encoding:'gzip-base64',bytes:bytes.length,sha256:sha(bytes),content:compressed.toString('base64')};});
// Keep complete source bytes in the local species file without copying raw API
// catalog/reference lists into every battle-state clone returned by the store.
record.sourceSnapshots=archives;fs.writeFileSync(file,JSON.stringify(record,null,2)+'\n');
const persisted=JSON.parse(fs.readFileSync(file));for(const a of persisted.sourceSnapshots)assert.ok(zlib.gunzipSync(Buffer.from(a.content,'base64')).equals(fs.readFileSync(a.file)));
assert.deepEqual(require('../../local-species.cjs').species(id),record.snapshot);
fs.writeFileSync(dir+'/LOCAL-SOURCE-ARCHIVE.json',JSON.stringify({at:new Date().toISOString(),id,file,insideLocalSpeciesFile:true,archives:archives.map(({content,...meta})=>({...meta,decodedByteHashVerified:true})),snapshotReturnedByStoreUnchanged:true,accepted:false},null,2)+'\n');console.log(JSON.stringify({id,archives:archives.length,sourceBytes:archives.reduce((n,a)=>n+a.bytes,0),accepted:false}));
