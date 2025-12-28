// apps/container/rspack.config.cjs
const path = require("path");
const rspack = require("@rspack/core");
const { ModuleFederationPlugin } = require("@module-federation/rspack");

const isDev = process.env.NODE_ENV !== "production";
const CONTAINER_URL = process.env.CONTAINER_URL || "http://localhost:3000/";
const PRODUCTS_URL = process.env.PRODUCTS_URL || "http://localhost:3001/";

module.exports = {
  context: __dirname,
  entry: "./src/main.tsx",
  mode: isDev ? "development" : "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: CONTAINER_URL,
    clean: true,
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        products: `products@${PRODUCTS_URL}remoteEntry.js`,
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        "react-dom": { singleton: true, eager: true, requiredVersion: false },
      },
      // prevent noisy websockets/runtime plugins — same as products
      dts: isDev ? false : false,
      runtimePlugins: [],
    }),
  ],
  devServer: {
    port: 3000,
    static: { directory: path.join(__dirname, "public") },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: { syntax: "typescript", tsx: true },
            transform: { react: { runtime: "automatic" } },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};
