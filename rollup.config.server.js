export default {
	entry: './src/server.js',
	dest: './dist/server.js',
	format: 'cjs',
	external: [
		'ical.js',
		'express',
		'node-fetch',
		'body-parser'
	]
};
