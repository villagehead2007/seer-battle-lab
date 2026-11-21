'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const archive = 'research/BATCH-4676-NEXT50/IMPLEMENTATION-SANDBOX-4765-v1';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

module.exports = function historicalBytes(file, expected) {
 const current = fs.readFileSync(path.resolve(root, file));
 if (hash(current) === expected || !/^data\/species\/\d+\.json$/.test(file)) return current;
 // The caller checks the original audit digest before parsing either source.
 return fs.readFileSync(path.join(root, archive, file));
};
