import * as path from 'path';
import json from 'rollup-plugin-json';

export default {
	entry: './src/index.js',
	targets: [
		{
			dest: './dist/ical-merger.js',
			format: 'es'
		},
		{
			dest: './dist/ical-merger.cjs.js',
			format: 'cjs'
		}
	],
	plugins: [
		json()
	],
	external: [
		path.resolve('./.env.json'),
		'ical.js'
	]
};
