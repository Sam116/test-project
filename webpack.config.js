const path = require('path')

module.exports = {
    entry: {
        scripts: './src/js/main.js',
    },
    output: {
        path: path.resolve(__dirname, './dist/js'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules(?![/|\\](dom7|swiper))/],
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    devtool: 'eval-source-map',
    optimization: {
        usedExports: true
    },
    mode: 'development',
    externals: {
        jquery: 'jQuery',
    },
    plugins: []
}
