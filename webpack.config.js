/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => ({
	entry: {
		bundle: argv.mode === 'production'
		? [
			'./src/web.js',
			'./src/google-analytics.js'
		]
		: './src/web.js'
	},
	output: {
		path: path.resolve(__dirname, './public/'),
		filename: argv.mode === 'production'
		? 'js/[name].[chunkhash].js'
		: 'js/[name].js'
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /element-dataset/,
				use: 'apply-loader'
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|gif)$/,
				include: /node_modules/,
				use: {
					loader: 'file-loader',
					options: {
						name: '/assets/[path][name].[ext]',
						context: './node_modules'
					}
				}
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|gif)$/,
				include: /assets/,
				use: {
					loader: 'file-loader',
					options: {
						name: '/assets/[path][name].[ext]',
						context: './assets'
					}
				}
			}
		]
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsFilename: 'stats.json'
		}),
		new MiniCssExtractPlugin({
			filename: argv.mode === 'production'
			? 'css/style.[contenthash].css'
			: 'css/style.css'
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			title: 'Calendar',
			template: './src/index.ejs',
			xhtml: true
		})
	],
	devtool: 'source-map',
	devServer: {
		index: '',
		proxy: {
			context: () => true,
			target: 'http://localhost:4444',
		}
	}
});
