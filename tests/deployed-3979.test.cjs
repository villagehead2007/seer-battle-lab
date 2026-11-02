'use strict';const {test}=require('node:test'),assert=require('node:assert/strict');


test("3979 持续比例吸取在基础攻击击败后仍按理论量回复，免疫/溢出/禁疗分开",()=>{const o=require('./helpers/assert-597-nominal-after-kill.cjs')(3979);assert.equal(o.fighters[0].hp,1000);assert.equal(o.fighters[1].hp,0);});
