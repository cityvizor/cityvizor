module.exports = {
    lintOnSave: false,
    devServer: {
        // https://cli.vuejs.org/config/#devserver-proxy
        proxy: {
            '^/api/v2/service/citysearch': {
                target: "http://backend.cityvizor.cesko.digital:8080",
                changeOrigin: true,
                secure: false,
                logLevel: "debug"
            }
        }
    },
    configureWebpack: {
        module: {
            rules: [
            {
                test: /\.md$/i,
                use: 'raw-loader',
            },
            ],
        },
    }
}
