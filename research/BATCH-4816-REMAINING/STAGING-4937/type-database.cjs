'use strict';
// Passive local database. Loading it does not register or change battle rules.
module.exports=require('./dist/type-rules.js').create(require('./data/types/types.json'));
