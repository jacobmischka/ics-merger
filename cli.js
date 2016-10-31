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

let options = {};

if(process.env.CALNAME)
	options.calname = process.env.CALNAME;
if(process.env.TIMEZONE)
	options.timezone = process.env.TIMEZONE;
if(process.env.CALDESC)
	options.caldesc = process.env.CALDESC;

console.log(merge(inputs, options));
