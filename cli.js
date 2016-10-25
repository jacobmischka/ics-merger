#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs');
const merge = require('./dist/ical-merger.cjs.js');

const files = process.argv.slice(2);
let inputs = [];
for(const file of files){
	try {
		inputs.push(fs.readFileSync(file, 'utf8'));
	} catch(e){
		console.error(`Error reading file ${file}: ${e}`);
	}
}

console.log(merge(inputs));
