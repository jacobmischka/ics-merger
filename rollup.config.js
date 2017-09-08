import * as path from 'path';
import json from 'rollup-plugin-json';

export default {
	input: './src/index.js',
	output: [
		{
			file: './dist/ical-merger.js',
			format: 'es'
		},
		{
			file: './dist/ical-merger.cjs.js',
			format: 'cjs'
		}
	],
	plugins: [
		json()
	],
	external: [
		path.resolve('./.env.json'),
		'ical.js'
	],
	preferConst: true
};
