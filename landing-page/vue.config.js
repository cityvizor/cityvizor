// https://github.com/bootstrap-vue/bootstrap-vue/issues/5954#issuecomment-714934578
const BootstrapVueLoader = require('bootstrap-vue-loader')

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
        plugins: [
            new BootstrapVueLoader()

        ],
        module: {
            rules: [
            {
                test: /\.md$/i,
                use: 'raw-loader',
            },
            ],
        },
        externals: {
          consolidate: 'consolidate',
          sass: 'sass',
          stylus: 'stylus',
          less: 'less',
          module: 'module',
          'webpack/lib/rules/BasicEffectRulePlugin': 'webpack/lib/rules/BasicEffectRulePlugin',
          'webpack/lib/rules/BasicMatcherRulePlugin': 'webpack/lib/rules/BasicMatcherRulePlugin',
          'webpack/lib/rules/DescriptionDataMatcherRulePlugin': 'webpack/lib/rules/DescriptionDataMatcherRulePlugin',
          'webpack/lib/rules/RuleSetCompiler': 'webpack/lib/rules/RuleSetCompiler',
          'webpack/lib/rules/UseEffectRulePlugin': 'webpack/lib/rules/UseEffectRulePlugin',
        }
    },
    publicPath: process.env.VUE_PUBLIC_PATH || "/landing"
}
