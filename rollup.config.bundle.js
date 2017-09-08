import * as path from 'path';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

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
		buble({
			transforms: {
				dangerousForOf: true
			}
		}),
		nodeResolve({
			jsnext: true
		})
	],
	external: [
		path.resolve('./.env.json')
	]
};
