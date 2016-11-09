import * as path from 'path';
import json from 'rollup-plugin-json';

export default {
	entry: './src/server.js',
	dest: './dist/server.js',
	format: 'cjs',
	plugins: [
		json()
	],
	external: [
		path.resolve('./.env.json'),
		'ical.js',
		'express',
		'node-fetch',
		'body-parser'
	]
};
