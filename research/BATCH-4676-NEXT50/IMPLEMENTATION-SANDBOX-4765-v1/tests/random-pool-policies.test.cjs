'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const P=require('../dist/status-pools.js'),H=require('./helpers/public-status.cjs'),db=require('../status-database.cjs');
test('1348用户确认复用2074公共池，未知效果仍拒绝抽样',()=>{
 const p=P.configuration(1348);assert.equal(p.status,'confirmed-project-rule');assert.deepEqual(p.candidates,P.pool());assert.deepEqual(P.drawForEffect(1348,2,()=>0),P.drawForEffect(2074,2,()=>0));assert.equal(P.configuration(123456),null);assert.throws(()=>P.drawForEffect(123456,1,()=>assert.fail()),/needs-source/);const config=require('../data/random-pools/effects.json').effects[1348];assert.equal(config.apiHash,'52ea44b4');assert.equal(config.wikiRevision,349330);assert.equal(config.legacyObservation.authoritative,false);assert.equal(config.sharedPoolEffectId,2074);assert.ok(config.historicalInstances.length>0);assert.equal(P.pool().length,38);assert.equal(P.drawForEffect(2074,1,()=>0)[0].duration,2);
});

test('睡眠保留Wiki原字段null，当前用户规则单独确认为二或三回合',()=>{
 const r=db.getByName('睡眠'),p=H.S.durationPolicy('睡眠');assert.equal(r.defaultDurationTurns,null);assert.equal(p.defaultDurationTurns,null);assert.equal(p.projectRule.sourceType,'user_confirmed');assert.equal(p.projectRule.min,2);assert.equal(p.projectRule.max,3);assert.deepEqual(p.effectScoped[0].range,[2,3]);assert.equal(p.compatibility.isSource,false);const s=H.game(),f=s.fighters[0];f.counts.immune=1;assert.equal(H.S.attempt(f,'睡眠',1,{random:()=>assert.fail()}).reason,'count-immunity');assert.equal(f.counts.immune,0);assert.deepEqual(f.ailments,{});assert.equal(H.S.attempt(f,'睡眠',1,{random:()=>.5}).applied,true);assert.equal(f.ailments['睡眠'],3);p.projectRule.min=9;assert.equal(H.S.durationPolicy('睡眠').projectRule.min,2);
});

test('PP吸取核实保留真实阈值及来源，回复分配失败规则不猜造',()=>{
 const r=require('../research/pp-absorption-review.json'),sources=require('../research/public-status-expansion-sources.json'),raw=sources.records.find(x=>x.url.endsWith('/soulmark/1935')).data;
 assert.equal(r.soulHash,raw.hash);assert.deepEqual(r.args,raw.effect.effect_args);assert.equal(r.confirmed.low.comparison,'<=');assert.equal(r.confirmed.low.threshold,300);assert.equal(r.confirmed.low.opponentAmountPerMove,1);assert.equal(r.confirmed.high.opponentAmountPerMove,2);assert.ok(Object.values(r.unconfirmed).every(v=>v===null));assert.equal(r.conclusionHistory[0].status,'source-incomplete-not-implemented');assert.equal(r.currentProjectImplementation.rules.mapping,'逐槽对应实际扣除');assert.equal(r.currentProjectImplementation.sourceType,'user_confirmed');
 for(const record of sources.records)assert.equal(record.sha256,crypto.createHash('sha256').update(JSON.stringify(record.data)).digest('hex'));
});
test('扩展状态逐条记录来源及缺口，浏览器目录与更新数据库相同',()=>{
 const review=require('../research/public-status-expansion-review.json'),catalog=require('../dist/status-catalog.js');assert.equal(Object.keys(review.states).length,16);assert.equal(Object.values(review.states).filter(s=>s.implemented.length).length,16);assert.equal(catalog.databaseHash,crypto.createHash('sha256').update(fs.readFileSync('data/statuses/statuses.json')).digest('hex'));
 const sources=require('../research/public-status-expansion-sources.json'),page=sources.records.flatMap(r=>Object.values(r.data.query?.pages??{})).find(p=>p.title==='对战机制'),text=page.revisions[0].slots.main['*'];assert.equal(page.revisions[0].revid,review.evidence.revision);
 for(const name of Object.keys(review.states)){const row=db.getByName(name);assert.equal(row.defaultDurationTurns,null);assert.deepEqual(row.publicBehaviorReview.implemented,review.states[name].implemented);if(row.description)assert.ok(text.includes(row.description));else assert.equal(row.publicBehaviorReview.source,null);assert.equal(H.S.behaviorCoverage(name),review.states[name].implemented.length?'existing-partial':'not-implemented');}
});
test('2074真实施加狂信、沉默和超频接入公共行为，反弹绑定实际来源',()=>{
 for(const name of ['狂信','沉默','超频']){let found;for(let seed=0;seed<1024;seed++){const s=H.game([[2074,[1]]]);s.rng=seed;const o=H.turn(s,1,4),d=o.randomStatusEvents?.find(e=>e.type==='draw');if(d.name===name&&d.duration===3){found={s,o};break;}}assert.ok(found,name);const {s,o}=found;assert.equal(o.fighters[1].ailments[name],3);
  if(name==='狂信'){assert.equal(o.fighters[1].statusState.faithSourceSide,0);assert.equal(o.fighters[1].pp[H.key(1,4)],30);const reflected=structuredClone(s);H.timer(reflected,1,'reflect');const ro=H.turn(reflected,1,2);assert.equal(ro.fighters[0].statusState.faithSourceSide,1);assert.equal(ro.fighters[1].ailments['狂信'],undefined);}
  if(name==='沉默'){assert.equal(o.fighters[1].hp,1400);assert.equal(o.fighters[0].hp,1600);assert.equal(o.fighters[1].pp[H.key(1,4)],29);}
  if(name==='超频'){assert.ok(!o.pendingStatusBehaviors?.some(e=>e.name==='超频'));o.fighters[1].pp[H.key(1,0)]=1;const next=H.turn(o,2,0);assert.equal(next.turns.at(-1).first,1);assert.equal(next.fighters[1].pp[H.key(1,0)],29);}
  const immune=structuredClone(s);immune.fighters[1].counts.immune=1;const im=H.turn(immune,1);assert.equal(im.fighters[1].ailments[name],undefined);assert.equal(im.fighters[1].counts.immune,0);assert.equal(im.randomStatusEvents.filter(e=>e.type==='draw').length,1);
 }
});
