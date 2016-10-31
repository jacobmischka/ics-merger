import json from 'rollup-plugin-json';

export default {
	entry: './src/server.js',
	dest: './dist/server.js',
	format: 'cjs',
	external: [
		'ical.js',
		'express',
		'node-fetch',
		'body-parser'
	],
	plugins: [
		json()
	]
};
