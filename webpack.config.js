/* eslint-env node */

module.exports = {

    mode : 'production',

    entry : {
        app : __dirname + '/src/js/app.js'
    },

    output: {
        filename      : '[name].js',
        chunkFilename : '[name].[hash].chunk.js',
        publicPath    : __dirname + '/public/',
        path          : __dirname + '/public/js/',
        libraryTarget : 'window'
    },

    optimization: {
        minimize: true
    },

    resolve: {
        extensions: [".js"],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },

    module: {
        rules: [{
            test: /\.handlebars$/,
            loader: "html-loader"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
};
