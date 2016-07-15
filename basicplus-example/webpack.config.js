var path = require('path');

console.log(__dirname)
module.exports = {
	entry: './index.js',

	output: {
		path: __dirname + '/../dist',
		filename: 'bundle.js'
	}
}
