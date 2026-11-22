'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const classify=require('./status-classification.cjs').classify;
const page=require('../data/statuses/wiki-391713.json').query.pages[143433];
const revision=page.revisions[0],text=revision.slots.main['*'];
const sourceKey='wiki-mechanics-391713';
module.exports=function applyCurseClassification(db){
  assert.equal(revision.revid,391713);
  const source={url:'https://wiki.biligame.com/seer/index.php?oldid=391713',revision:revision.revid,
    revisionTimestamp:revision.timestamp,hash:crypto.createHash('sha256').update(text).digest('hex'),
    file:'data/statuses/wiki-391713.json',pointer:'/query/pages/143433/revisions/0/slots/main/*',key:sourceKey};
  db.sources[sourceKey]=source;
  for(const name of ['诅咒','烈焰诅咒','致命诅咒','虚弱诅咒']){
    const record=db.records.find(r=>r.name===name);
    const match=text.match(new RegExp('^! '+name+'\\s*\\n\\| ([^\\r\\n]+)','m'));
    assert.ok(match,name);
    const description=match[1],category=description.match(/^(控制类|附属类)异常状态/)[1];
    record.sourceRefs=[...new Set([...record.sourceRefs,sourceKey])];
    record.sourceUrls=[...new Set([...record.sourceUrls,source.url])];
    Object.assign(record,{description,category,revision:source.revision,
      descriptionEvidence:{source:sourceKey,statusName:name,quote:description}});
    if(name==='诅咒')record.derivable=description.includes('衍化类异常状态');
    record.hashes.wiki=source.hash;
    Object.assign(record,classify(record,source));
  }
};
