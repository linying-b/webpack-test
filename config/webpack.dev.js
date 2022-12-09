const path = require('path')//nodejs核心模块，专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    //相对路径
    entry: './src/main.js',
    output: {
        //文件的输出路径（绝对路径）
        //开发模式没有输出
        path: undefined,
        filename: "static/js/main.js",
    },
    //加载器
    module: {
        rules: [
            {
                //每个文件只能被其中一个loader配置处理
                oneOf: [     //loader的配置
                    {
                        test: /\.css$/,   //只检测.css文件
                        use: [//执行顺序，从右到左（从下到上）
                            "style-loader", //将js中css通过创建style标签添加到html文件中
                            "css-loader"  //将css资源编译成commonjs的模块到js中
                        ]
                    },
                    {
                        test: /\.less$/,
                        use: [
                            // compiles Less to CSS
                            'style-loader',
                            'css-loader',
                            'less-loader',
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: [
                            // compiles Less to CSS
                            'style-loader',
                            'css-loader',
                            'sass-loader',
                        ],
                    },
                    {
                        test: /\.styl$/,
                        use: [
                            // compiles Less to CSS
                            'style-loader',
                            'css-loader',
                            'stylus-loader',
                        ],
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
    },
    //插件
    plugins: [
        new ESLintPlugin(
            {
                //检测哪些文件
                context: path.resolve(__dirname, "../src"),
                exclude: "node_modules",
                cache: true,
                cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache")
            },

        ),
        new HtmlWebpackPlugin({
            //模版，以public下面的index.html文件创建新的html文件
            // 新的html文件特点：1.结构与原来一致 2.自动引入打包输出的资源
            template: path.resolve(__dirname, '../public/index.html')
        }),
    ],
    //开发服务器：不会输出资源，是在内存下打包的
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true//开启HMR 热模块替换
    },
    //模式
    devtool: "cheap-module-source-map",
    mode: 'development'
}