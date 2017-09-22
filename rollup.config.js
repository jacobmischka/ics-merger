import * as path from 'path';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

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
		json(),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		})
	],
	external: [
		path.resolve('./.env.json'),
		'ical.js'
	],
	preferConst: true
};
