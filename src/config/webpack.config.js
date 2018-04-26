var path = require('path');
var openBrowserPlugin = require('open-browser-webpack-plugin');
var webpack = require("webpack");
var nodeModules = path.resolve(__dirname, '../../node_modules');
var pathToAngular = path.resolve(nodeModules, 'angular/angular.min.js');
var pathToUiBootstrap = path.resolve(nodeModules, 'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js');
var pathToMetisMenu = path.resolve(nodeModules, 'metismenu/dist/metisMenu.min.js');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: ['webpack/hot/dev-server', path.resolve(__dirname, '../app/bootstrap.js')],
    context: path.join(__dirname, '../app'),
    resolve: {
        alias: {
            'angular': pathToAngular,
            'angular-ui-bootstrap': pathToUiBootstrap,
            'metismenu': pathToMetisMenu
        }
    },
    output: {
        path: path.resolve(__dirname, '../dev'),
        filename: 'bundle_dev.js'
    },
    plugins: [
        new openBrowserPlugin({
            url: 'http://localhost:8080'
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            moment: 'moment',
            getokrchart: 'getokrchart',
            humanizeDuration: 'humanize-duration',
            XLSX: 'xlsx'
        }),
        new CopyWebpackPlugin([{
                from: 'index_dev.html',
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
            DEBUG: true
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
