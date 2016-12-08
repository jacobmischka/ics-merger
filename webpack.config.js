/* eslint-env node */
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: [
		'babel-polyfill',
		'es6-promise',
		'whatwg-fetch',
		'classlist-polyfill',
		'element-dataset',
		'iframe-resizer/js/iframeResizer.contentWindow.js',
		'./src/web.js'
	],
	output: {
		path: './public/js/',
		publicPath: '/js/',
		filename: 'bundle.js'
	},
	target: 'web',
	module: {
		rules: [
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
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: 'stats.json'
		})
	],
	devtool: 'source-map'
};
