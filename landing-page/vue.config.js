// https://github.com/bootstrap-vue/bootstrap-vue/issues/5954#issuecomment-714934578
const BootstrapVueLoader = require('bootstrap-vue-loader')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    lintOnSave: false,
    devServer: {
        // Required for hot reload with docker container on Windows 10
        watchOptions: {
            ignored: /node_modules/,
            poll: 1000
        },
        // https://cli.vuejs.org/config/#devserver-proxy
        proxy: {
            '^/api/v2/service/citysearch': {
                target: "http://backend.cityvizor.cesko.digital:8080",
                changeOrigin: true,
                secure: false,
                logLevel: "debug"
            },
            '^/api/public/profiles': {
                target: "http://server.cityvizor.cesko.digital:3000",
                changeOrigin: true,
                secure: false,
                logLevel: "debug"
            }
        }
    },
    configureWebpack: {
        plugins: [
            new BootstrapVueLoader(),
            new CopyPlugin(
                [
                    {from: "cfg", to: "cfg"}
                ]
            )
        ],
        module: {
            rules: [
            {
                test: /\.md$/i,
                use: 'raw-loader',
            },
            ],
        },
    },
    publicPath: process.env.VUE_PUBLIC_PATH || "/landing"
}
