import * as path from 'path';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
	input: './src/server.js',
	output: {
		file: './dist/server.js',
		format: 'cjs'
	},
	plugins: [
		json(),
		babel({
			exclude: 'node_modules/**'
		})
	],
	external: [
		path.resolve('./.env.json'),
		'ical.js',
		'express',
		'node-fetch',
		'body-parser',
		'color-string',
		'moment'
	],
	preferConst: true
};
