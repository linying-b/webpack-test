const path = require('path')//nodejs核心模块，专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    //相对路径
    entry: './src/main.js',
    output: {
        //文件的输出路径（绝对路径）
        //__dirname nodejs的变量，代表当前文件的文件夹目录
        path: path.resolve(__dirname, "dist"),
        filename: "static/js/main.js",
        clean: true
        //自动清空上次打包的内容
        //原理:在打包前，将path整个目录内容清空，再进行打包
    },
    //加载器
    module: {
        rules: [
            //loader的配置
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
                exclude: /node_modules/,//排除node_modules中的js文件不处理
                loader: 'babel-loader',
                // options: {
                //     presets: ['@babel/preset-env'],
                //     plugins: ['@babel/plugin-proposal-object-rest-spread']
                // }

            }
        ]
    },
    //插件
    plugins: [new ESLintPlugin(
        {
            //检测哪些文件
            context: path.resolve(__dirname, "src")
        }
    )],
    //模式
    mode: 'development'
}