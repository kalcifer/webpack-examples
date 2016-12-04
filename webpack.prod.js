var path = require('path');
var Extract = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var webpack = require('webpack');
var externals = require('./webpack/vendor').externals;

var PROD = process.env.NODE_ENV === 'production';
var DEV = !PROD;

var config = {
	entry: './client.js',
	output: {
		path: path.join(__dirname, 'build'),
		publicPath: DEV ? '/' : '\/\/cdn\/url',
		filename: DEV
			? 'js/app.js'
			: 'js/app.[chunkhash:6].js',
		libraryTarget: 'umd'
	},
	externals: externals,
	__prod: PROD,
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: DEV
					? Extract.extract('style', 'css?localIdentName=[name]_[local]_[hash:base64:6]&modules!postcss')
					: Extract.extract('style', 'css?localIdentName=[hash:base64:6]&modules!postcss')
			},
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: ['react', 'es2015'],
					plugins: ['transform-object-assign', 'transform-class-properties', 'transform-object-rest-spread']
				}
			},
			{
				test: /\.svg$/,
				loader: DEV
					? 'url?limit=3000&name=img/[name].[ext]'
					: 'url?limit=3000&name=img/[name]_[hash:6].[ext]'
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: DEV
					? 'url?limit=1000&name=img/[name].[ext]'
					: 'url?limit=1000&name=img/[name]_[hash:6].[ext]'
			},
			{
				test: /\.hbs$/,
				loader: 'handlebars'
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(ttf|woff|woff2)$/,
				loader: 'file?name=fonts/[name].[ext]'
			}
		]
	},
	postcss: [
		require('postcss-import')({
			path: __dirname
		}),
		require('postcss-cssnext')({
			browsers: ['Chrome >= 31', 'Firefox >= 31', 'IE >= 9'],
			url: false
		}),
		require('postcss-nested')
	],
	plugins: [
		new webpack.DefinePlugin({
			__DEV__: DEV,
			__PROD__: PROD,
			'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
			__API_HOST__: JSON.stringify(process.env.API_HOST)
		}),
		new Extract(DEV
				? 'css/bundle.css'
				: 'css/bundle.[contenthash:6].css',
			{ allChunks: true }),
		new HtmlWebpackPlugin({
			template: 'index.hbs',
			inject: false,
			filename: 'server.hbs'
		})
	],
	resolve: {
		root: path.resolve(__dirname)
	}
};

PROD && config.plugins.push(
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	})
);

PROD && config.plugins.push(
	new CompressionPlugin({
		asset: '[path][query]',
		test: /\.js$|\.css/
	})
);

DEV && (config.devtool = 'source-map');

module.exports = config;
