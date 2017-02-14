/* eslint-env node */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: {
		bundle: process.env.NODE_ENV === 'production'
			? [
				'./src/web.js',
				'./src/google-analytics.js'
			]
			: './src/web.js'
	},
	output: {
		path: './public/js/',
		publicPath: '/js/',
		filename: process.env.NODE_ENV === 'production'
			? '[name].[chunkhash].js'
			: '[name].js'
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
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: {
						loader: 'css-loader',
						query: {
							sourceMap: true
						}
					}
				})
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				include: /node_modules/,
				loader: 'file-loader',
				options: {
					name: '../assets/[path][name].[ext]'
				}
			}
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['main', 'manifest']
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: 'stats.json'
		}),
		new ExtractTextPlugin({
			filename: process.env.NODE_ENV === 'production'
				? '../css/style.[contenthash].css'
				: '../css/style.css'
		}),
		new HtmlWebpackPlugin({
			filename: '../index.html',
			title: 'Calendar',
			template: './src/index.ejs',
			xhtml: true
		})
	],
	devtool: 'source-map'
};
