import * as path from 'path';
import json from 'rollup-plugin-json';

export default {
	entry: './src/server.js',
	dest: './dist/server.js',
	format: 'cjs',
	plugins: [
		json()
	],
	external: [
		path.resolve('./.env.json'),
		path.resolve('./service-account-key.json'),
		'ical.js',
		'express',
		'node-fetch',
		'body-parser',
		'color-string',
		'firebase-admin',
		'mailgun-js'
	],
	preferConst: true
};
