var path = require('path');

module.exports = {
	context: __dirname,
  entry: './main.js',

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
	},
	module:{
		loaders: [{
			test: /\.js$/,
			loader:'babel',
			query: {
				presets: ['es2015']
			},
			excludes: /node_modules$/
		}]
	}
}
