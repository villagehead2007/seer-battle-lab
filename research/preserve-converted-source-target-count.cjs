'use strict';
const fs=require('fs'),assert=require('node:assert/strict'),file='seerapi.cjs';let s=fs.readFileSync(file,'utf8');
const before="provider:'seerapi',deferredEffects:deferTeamEffects?",after="provider:'seerapi',sourceTargetCount:m.atk_num,deferredEffects:deferTeamEffects?";assert.equal(s.split(before).length-1,1);s=s.replace(before,after);fs.writeFileSync(file,s);console.log('API转换器显式保留真实atk_num到sourceTargetCount；原ID/hash/目标数量兼容约束完全不变。');
