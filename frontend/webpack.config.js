const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

const cssPlugin = new ExtractTextPlugin("[name].styles.[hash].css");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./index.html",
    filename: "./index.html"
});

const copyConfig = new CopyWebpackPlugin([{
    from: "./production.js",
    to: "./config.js",
    toType: "file"
}]);

const cleanPlugin = new CleanWebpackPlugin();

const definePlugin = new webpack.DefinePlugin({
    "process.env": {
        APP_HOST: JSON.stringify(process.env.APP_HOST)
    }
});

module.exports = {
    entry: {
        index: "./index.jsx"

        // map: './map/map.js'
    },
    context: __dirname + "/src",
    output: {
        filename: "[name].bundle.[hash].js",
        path: __dirname + "/dist"
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },

    // watchOptions: {
    //     poll: 1000,
    //     ignored: ["node_modules"]
    // },

    mode: "development",

    // Enable sourcemaps for debugging webpack"s output.

    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"]
    },

    plugins: [htmlPlugin, copyConfig, cssPlugin, cleanPlugin, definePlugin],

    module: {
        rules: [{
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        babelrc: false,
                        presets: [
                                // "@babel/preset-flow",
                                "@babel/preset-env",
                                "@babel/preset-react"
                            ]
                            // plugins: ["babel-plugin-relay"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|gif)$/,
                loader: "url-loader?limit=1000000"
            },
            {
                test: /\.(jpeg|png|jpg)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[ext]"
                    }
                }]
            }
        ]
    }
};
