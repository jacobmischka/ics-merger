import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
	entry: './src/index.js',
	dest: './dist/ical-merger.bundle.js',
	format: 'umd',
	moduleName: 'icalMerger',
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
	]
};
