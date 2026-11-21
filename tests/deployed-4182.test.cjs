'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const H=require('./helpers/4182-battle.cjs'),{make,pick,turn,keys,timer,E,key}=H;
test('4182 732真实第五非暴击六项强化及暴击、封顶、禁强化边界',()=>{
 const entry=pick(732)[0];assert.deepEqual(entry.params,[1,1,1,1,1,1]);
 const s=turn(make(entry));for(const k of keys)assert.equal(s.fighters[0].stages[k],1,k);
 const cap=make(entry);for(const k of keys)cap.fighters[0].stages[k]=6;const c=turn(cap);for(const k of keys)assert.equal(c.fighters[0].stages[k],6);
 const blocked=make(entry);timer(blocked,0,'禁强化');const b=turn(blocked);for(const k of keys)assert.equal(b.fighters[0].stages[k],0);
 const crit=make(entry,{criticals:true});timer(crit,0,'必定暴击');const t=turn(crit);for(const k of keys)assert.equal(t.fighters[0].stages[k],0);
});
