/* eslint-env node */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: [
		'babel-polyfill',
		'es6-promise',
		'whatwg-fetch',
		'classlist-polyfill',
		'element-dataset',
		'./src/web.js'
	],
	output: {
		path: './public/js/',
		publicPath: '/js/',
		filename: 'bundle.js'
	},
	target: 'web',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /element-dataset/,
				loader: 'apply-loader'
			}
		]
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: 'stats.json'
		})
	],
	devtool: 'source-map'
};
