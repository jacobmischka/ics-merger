import * as path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
	input: './src/index.js',
	output: {
		file: './dist/ical-merger.bundle.js',
		format: 'umd',
		name: 'icalMerger',
	},
	plugins: [
		json(),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
			plugins: ['external-helpers']
		}),
		nodeResolve({
			jsnext: true
		})
	],
	external: [
		path.resolve('./.env.json')
	]
};
