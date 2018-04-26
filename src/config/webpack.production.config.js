var path = require('path');
var webpack = require("webpack");
var nodeModules = path.resolve(__dirname, '../node_modules');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: path.resolve(__dirname, '../app/bootstrap.js'),
    context: path.join(__dirname, '../app'),
    output: {
        path: path.resolve(__dirname, '../release'),
        filename: 'bundle_release.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            moment: 'moment',
            getokrchart: 'getokrchart',
            humanizeDuration: 'humanize-duration',
            XLSX: 'xlsx'
        }),
        new CopyWebpackPlugin([{
                from: 'index_release.html',
                to: 'index.html'
            },
            {
                from: 'favicon.ico',
                to: 'favicon.ico'
            },
            {
                from: 'splash/getokrchart.js',
                to: 'splash/getokrchart.js'
            },
            {
                from: 'splash/homer.js',
                to: 'splash/homer.js'
            },
            {
                from: 'splash/jquery.min.js',
                to: 'splash/jquery.min.js'
            },
            {
                from: 'splash/metisMenu.js',
                to: 'splash/metisMenu.js'
            },
            {
                from: 'images/loading-bars.svg',
                to: 'images/loading-bars.svg'
            }
        ]),
        new ExtractTextPlugin("style.css"),
        new webpack.DefinePlugin({
            DEBUG: false
        })
    ],
    module: {
        loaders: [{
                test: /\.html$/,
                loader: 'ngtemplate!html'
            }, {
                test: /\.js$/,
                loader: 'ng-annotate'
            }, {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.png(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.jpg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    "style",
                    "css!sass")
            }
        ]
    },
    node: {
        fs: 'empty'
    },
    externals: [{
        './cptable': 'var cptable'
    }]
};

module.exports = config;
