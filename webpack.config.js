/* eslint-env node */

module.exports = {

    entry : {
        app : __dirname + '/src/js/app.js'
    },

    output: {
        filename      : '[name].js',
        chunkFilename : '[name].[hash].chunk.js',
        publicPath    : __dirname + '/src/views/js/',
        path          : __dirname + '/src/views/js/',
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
