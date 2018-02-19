/**
 * Webpack config file
 * @module
 * @author: Alexander Luksidadi
 */

var gulpConfig = require('./gulp.config.js'),
	webpack = require('webpack');
//autoprefixer = require('autoprefixer');

// --release flag
var RELEASE = gulpConfig.release;

var plugins = [
    // new webpack.DefinePlugin({
	// 	"process.env": {
	// 		'CUSTOMER_API_URL': JSON.stringify(process.env.CUSTOMER_API_URL || '172.17.42.1:8008')
    //     }
    // }),
    new webpack.NoErrorsPlugin()

];
if (RELEASE) {
	plugins = plugins.concat([
        // assign the module and chunk ids by occurrence count. Ids that are used often get lower (shorter) ids. This make ids predictable, reduces to total file size and is recommended.
        new webpack.optimize.OccurenceOrderPlugin(),
        // make sure no duplicates
        new webpack.optimize.DedupePlugin(),
        // uglify
        new webpack.optimize.UglifyJsPlugin(),
        // optimize merge
        new webpack.optimize.AggressiveMergingPlugin()
    ]);
}

var config = {
	entry: './src/scripts/app.js',

	output: {
		path: './dist/static/scripts/',
		filename: 'app.js',
		publicPath: '/scripts/'
	},

	bail: true,

	cache: !RELEASE,
	debug: !RELEASE,
	devtool: !RELEASE ? '#inline-source-map' : false,

	stats: {
		colors: true,
		reasons: !RELEASE
	},

	plugins: plugins,

	resolve: {
		modulesDirectories: ['node_modules', 'src/scripts', 'src/styles'],
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
	},

	module: {
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader?{failOnError:true}'
            }
        ],
		loaders: [
          /*{
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
          },*/
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
          },
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					cacheDirectory: true,
					presets: ['es2015', 'stage-0', 'react']
				}
          }
        ]
	}
	/*,

	    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ] 
	    */
};

module.exports = config;
