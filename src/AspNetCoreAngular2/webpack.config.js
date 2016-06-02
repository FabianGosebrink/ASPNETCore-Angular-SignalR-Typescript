var webpack = require("webpack");

module.exports = {
    entry: {
        "vendor": "./wwwroot/app/vendor",
        "app": "./wwwroot/app/boot"
    },
    output: {
        path: __dirname,
        filename: ".temp/[name].bundle.js"
    },
    resolve: {
        extensions: ['', '.ts', '.js', '.html']
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.ts/,
                loaders: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'raw'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */".temp/vendor.bundle.js")
    ]
}