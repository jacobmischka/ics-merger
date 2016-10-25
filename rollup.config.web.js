import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: './src/index.js',
	dest: './dist/ical-merger.bundle.js',
	format: 'umd',
	moduleName: 'icalMerger',
	plugins: [
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
