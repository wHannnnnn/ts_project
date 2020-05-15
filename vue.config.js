const webpack = require("webpack");
const merge = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");
module.exports = {
    //configureWebpack 是Vue CLI3.0 中用于配置 webpack 插件参数的地方，你在这里设置，会新建或者覆盖 webpack 默认配置。
    //webpack ProvidePlugin 的含义是创建一个全局的变量，使这个变量在 webpack 各个模块内都可以使用。这里的配置含义是创建 '$'、'jQuery'、'window.jQuery' 三个变量指向 jquery 依赖，创建 'Popper' 变量指向 popper.js 依赖。
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ],
    },

    lintOnSave: false,
    chainWebpack: config => {
        config.module
            .rule("ts")
            .use("ts-loader")
            .tap(options => {
                options = merge(options, {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [
                            tsImportPluginFactory({
                                libraryName: "vant",
                                libraryDirectory: "es",
                                style: true
                            })
                        ]
                    }),
                    compilerOptions: {
                        module: "es2015"
                    }
                });
                return options;
            });
    },
    publicPath: '/dist',
    devServer: {
        host: "0.0.0.0",
        port: '8080'
    },

    css: {
        loaderOptions: {
            stylus: {
                'resolve url': true,
                'import': []
            }
        }
    },

    pluginOptions: {
        'cube-ui': {
            postCompile: false,
            theme: false
        }
    }
}
