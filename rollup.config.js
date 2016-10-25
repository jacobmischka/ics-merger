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
	]
};
