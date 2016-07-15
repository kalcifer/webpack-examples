var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './main.js',

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
	}
  // },
	//
  // plugins: [
	// 	new webpack.ProvidePlugin({
	// 		'moment': 'moment'
	// 	})
  // ]
}
