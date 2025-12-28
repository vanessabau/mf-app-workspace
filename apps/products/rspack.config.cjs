// apps/products/rspack.config.cjs
const path = require("path");
const rspack = require("@rspack/core");
const { ModuleFederationPlugin } = require("@module-federation/rspack");

const isDev = process.env.NODE_ENV !== "production";
const PRODUCTS_URL = process.env.PRODUCTS_URL || "http://localhost:3001/";

module.exports = {
  context: __dirname,
  entry: "./src/main.tsx",
  mode: isDev ? "development" : "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: PRODUCTS_URL,
    clean: true,
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/ProductList.tsx",
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: false },
        "react-dom": { singleton: true, eager: true, requiredVersion: false },
      },
      // turn off the dev-time type-hints runtime and any extra runtime plugins
      dts: isDev ? false : false,
      runtimePlugins: [],
    }),
  ],
  devServer: {
    port: 3001,
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
