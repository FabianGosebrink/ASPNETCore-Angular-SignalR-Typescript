const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ngToolsWebpack = require('@ngtools/webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const helpers = require('./webpack.helpers');
const ROOT = path.resolve(__dirname, '..');

console.log('@@@@@@@@@ USING PRODUCTION @@@@@@@@@@@@@@@');

module.exports = {

    entry: {
        'vendor': './angularApp/vendor.ts',
        'polyfills': './angularApp/polyfills.ts',
        'app': './angularApp/main-aot.ts' // AoT compilation
    },

    output: {
        path: ROOT + '/wwwroot/',
        filename: '[name].[hash].bundle.js',
        chunkFilename: '[id].[hash].chunk.js',
        publicPath: ''
    },

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: '@ngtools/webpack'
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|ttf|svg|eot)$/,
                use: 'file-loader?name=assets/[name]-[hash:6].[ext]'
            },
            {
                test: /favicon.ico$/,
                use: 'file-loader?name=/[name].[ext]'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
        ],
        exprContextCritical: false
    },

    plugins: [
        // AoT plugin.
        new ngToolsWebpack.AotPlugin({
            tsConfigPath: './tsconfig-aot.json'
        }),
        new CleanWebpackPlugin(
            [
                './wwwroot/'
            ],
            { root: ROOT }
        ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJSPlugin({
            parallel: 2
        }),
        new webpack.optimize.CommonsChunkPlugin(
            {
                name: ['vendor', 'polyfills']
            }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: 'body',
            template: 'angularApp/index.html'
        })
    ]
};

