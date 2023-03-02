const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const devMode = false;
module.exports = {
    entry: {
        main: './src/js/app.ts',
    },
    devServer: {
        static: './dist',
    },
    // mode: devMode ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    // Translates CSS into CommonJS
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    // 'resolve-url-loader',
                    // Compiles Sass to CSS
                    {
                        loader: "sass-loader", options: {
                            sourceMap: false
                        },
                    }
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: 'assets/images/',
                            name: '[name].[ext]',
                            outputPath: 'assets/images/'
                        }
                    },
                ],
            },
            // {
            //     test: require.resolve("jquery"),
            //     loader: "expose-loader",
            //     options: {
            //         exposes: ["$", "jQuery"],
            //     },
            // },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: 'files'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css',
            chunkFilename: 'assets/css/[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/data', to: 'assets/data' },
            ],
        }),
    ],
    output: {
        filename: 'assets/js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxSize: 2000,
            minRemainingSize: 0,
            minSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    name: 'vendors',
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            // new CssMinimizerPlugin(),
        ],
    },
};
//# sourceMappingURL=webpack.config.js.map