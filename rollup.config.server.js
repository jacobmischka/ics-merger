import commonjs from 'rollup-plugin-commonjs';
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
		commonjs(),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		})
	],
	external: [
		'ical.js',
		'express',
		'node-fetch',
		'body-parser',
		'color-string',
		'moment'
	],
	preferConst: true
};
