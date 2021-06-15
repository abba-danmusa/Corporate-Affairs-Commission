const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const javascript = {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: [{
        loader: 'babel-loader',
        // options: { presets: ['@babel/preset-env'] }
    }],
}
const styles = {
    test: /\.(css)$/i,
    use: ExtractTextPlugin.extract(['css-loader']),
}

module.exports = {
    node: {
        global: true,
        __filename: true,
        __dirname: true
    },
    entry: {
        App: './public/javascripts/index-app.js',
    },
    output: {
        path: path.resolve(__dirname, 'public', 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [javascript, styles]
    },
    resolve: {
        modules: ['node_modules']
    },
    mode: 'development',
    watch: true
}

process.noDeprecation = true