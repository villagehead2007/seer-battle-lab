'use strict';

const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const archive='research/POST-V9-20261121/before-full-fixture-corrections';
const archivedInputs=Object.fromEntries([
  'ally-side-41-fire-native.test.cjs',
  'ally-side-2572-chen-law-native.test.cjs',
].map(file=>['tests/'+file,`${archive}/${file}.txt`]));

function hash(file){return createHash('sha256').update(fs.readFileSync(path.resolve(root,file))).digest('hex');}

function assertHistoricalInput(file,expected){
  const relative=path.relative(root,path.resolve(root,file));
  if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('Invalid historical evidence path: '+file);
  if(hash(file)===expected)return file;
  const stored=archivedInputs[file];
  if(stored&&hash(stored)===expected)return stored;
  throw Error('Ownership supplement evidence changed: '+file);
}

module.exports={assertHistoricalInput,archiveFiles:Object.values(archivedInputs)};
