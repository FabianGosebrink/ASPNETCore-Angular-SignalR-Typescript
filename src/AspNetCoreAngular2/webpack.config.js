var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        "vendor": "./wwwroot/app/vendor",
        "polyfills": "./wwwroot/app/polyfills",
        "app": "./wwwroot/app/boot"
    },
    output: {
        path: __dirname,
        filename: "[name]-[hash:8].bundle.js"
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.html']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            { test: /jquery/, loader: 'expose?$!expose?jQuery' },
            {
                test: /\.ts/,
                loaders: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.css$/,
                loader: 'raw'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["app", "vendor", "polyfills"]
        })
    ]
}