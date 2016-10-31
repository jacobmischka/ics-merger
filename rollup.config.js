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
	external: [
		'ical.js'
	],
	plugins: [
		json()
	]
};
