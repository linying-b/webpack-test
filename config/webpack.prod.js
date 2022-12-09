const path = require('path')//nodejs核心模块，专门用来处理路径问题
const os = require('os')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')

const threads = os.cpus().length;//cpu核数

function getStyleLoader(pre) {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",  //将css资源编译成commonjs的模块到js中
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        pre
    ].filter(Boolean)//去除数组中为假的元素 0、undefined、null、NaN、''、false
}
module.exports = {
    //相对路径
    entry: './src/main.js',
    output: {
        //文件的输出路径（绝对路径）
        //__dirname nodejs的变量，代表当前文件的文件夹目录
        path: path.resolve(__dirname, "../dist"),
        filename: "static/js/main.js",
        clean: true
        //自动清空上次打包的内容
        //原理:在打包前，将path整个目录内容清空，再进行打包
    },
    //加载器
    module: {
        rules: [
            {
                oneOf: [
                    //loader的配置
                    {
                        test: /\.css$/,   //只检测.css文件
                        //执行顺序，从右到左（从下到上）
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoader('less-loader')
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: getStyleLoader("sass-loader")
                    },
                    {
                        test: /\.styl$/,
                        use: getStyleLoader('stylus-loader')

                    },
                    {
                        test: /\.(png|jpe?g|gif|webp|svg)$/,
                        type: 'asset',//转化成base64
                        parser: {
                            dataUrlCondition: {
                                //小于10kb的图片转base64
                                //优点：减少请求数量 缺点：体积会更大
                                maxSize: 10 * 1024 // 4kb
                            }
                        },
                        generator: {
                            //输出图片名称
                            //[hash:10] hash取前10位
                            filename: 'static/images/[hash:10][ext][query]'
                        }
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                        type: 'asset/resource',
                        generator: {
                            //输出图片名称
                            //[hash:10] hash取前10位
                            filename: 'static/media/[hash:10][ext][query]'
                        }
                    },
                    {
                        test: /\.js$/,
                        // exclude: /node_modules/,//排除node_modules中的js文件不处理
                        include: path.resolve(__dirname, "../src"),//只处理src下的文件，其他文件里的不处理
                        use: [{
                            loader: 'thread-loader',//开启多进程
                            options: {
                                workers: threads,

                            }
                        }, {
                            loader: 'babel-loader',
                            options: {
                                // presets: ['@babel/preset-env'],
                                // plugins: ['@babel/plugin-proposal-object-rest-spread']
                                cacheDirectory: true,//开启babel缓存
                                cacheCompression: false,//关闭缓存文件压缩
                                plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                            }
                        }]


                    }
                ]
            }
        ]
    },
    //插件
    plugins: [
        new ESLintPlugin(
            {
                //检测哪些文件
                context: path.resolve(__dirname, "../src"),
                exclude: "node_modules",
                cache: true,
                cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
                threads//开启多进程和设置进程数量
            },

        ),
        new HtmlWebpackPlugin({
            //模版，以public下面的index.html文件创建新的html文件
            // 新的html文件特点：1.结构与原来一致 2.自动引入打包输出的资源
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new MiniCssExtractPlugin({       //将css文件单独打包到一个文件
            filename: "static/css/main.css"
        }),
    ],
    optimization: {
        //压缩的操作
        minimizer: [
            //压缩css
            new CssMinimizerPlugin(),//将css代码压缩成一行
            //压缩js
            new TerserWebpackPlugin({
                parallel: threads//开启多进程和设置进程数量
            })
        ]
    },
    devtool: "source-map",
    //模式
    mode: 'production'
}