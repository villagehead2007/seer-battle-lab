'use strict';const{test}=require('node:test'),assert=require('node:assert/strict');
test('583全部22个旧真实来源归零被PP保护和免疫PP削减阻断，普通精确抽取参数数量且保持无放回',()=>{const rows=require('../research/583-PP-PROTECTION-INVENTORY.json');assert.equal(rows.length,22);for(const row of rows){const o=require('./helpers/assert-583-pp-protection.cjs')(row.id);assert.ok(o.fighters[1].moves.every(k=>o.fighters[1].pp[k]>0));}});
