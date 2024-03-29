// https://github.com/bootstrap-vue/bootstrap-vue/issues/5954#issuecomment-714934578
const BootstrapVueLoader = require("bootstrap-vue-loader");
const CopyPlugin = require("copy-webpack-plugin");
const process = require("node:process");

module.exports = {
  lintOnSave: false,
  devServer: {
    watchFiles: {
      paths: ["src/**/*", "public/**/*"],
      options: {
        ignored: /node_modules/,
        // Required for hot reload with docker container on Windows 10
        // poll: 1000
      },
    },
    port: 80,
    host: "0.0.0.0",
    client: {
      webSocketURL: "auto://localhost:4200/ws",
    },
    webSocketServer: "ws",
    allowedHosts: "all",
    // https://cli.vuejs.org/config/#devserver-proxy
    proxy: {
      "^/api": {
        target: "http://server.cityvizor:3000",
      },
    },
  },
  configureWebpack: {
    plugins: [
      new BootstrapVueLoader(),
      new CopyPlugin([{ from: "cfg", to: "cfg" }]),
    ],
    module: {
      rules: [
        {
          test: /\.md$/i,
          use: "raw-loader",
        },
      ],
    },
  },
  publicPath: process.env.VUE_PUBLIC_PATH || "/landing",
};
