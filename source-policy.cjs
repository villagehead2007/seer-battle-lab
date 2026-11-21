'use strict';
const seals={"13311":"13c4ccf5e3f47b0def69a9fdadb4f5e1bf415f7556e917a41a84f7d853c4be7c","20001":"fe3f21a969bbed596b66661c3a332d7d6f4ffcb270cab5859c889a1fbd488979"};
function check(snapshot){return require('node:crypto').createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')===seals[snapshot.id]?[]:['本地精灵资料与发行快照不一致'];}
module.exports={originalIssues:check,compositeIssues:check};
