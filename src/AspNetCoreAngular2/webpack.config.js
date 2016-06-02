var webpack = require("webpack");

module.exports = {
    entry: {
        "vendor": "./wwwroot/app/vendor",
        "app": "./wwwroot/app/boot"
    },
    output: {
        path: __dirname,
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    devtool: 'source-map',
    module: {
        loaders: [
          {
              test: /\.ts/,
              loaders: ['ts-loader'],
              exclude: /node_modules/
          }
        ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ]
}