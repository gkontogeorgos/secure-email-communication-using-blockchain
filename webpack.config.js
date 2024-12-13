const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development", // Use "production" for production builds
  entry: "./src/index.js",
  target: "web",
  output: {
    path: path.resolve(__dirname, "public/build"),
    filename: "index_bundle.js",
    publicPath: "/", // Ensure paths resolve correctly in the browser
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"], // File extensions to resolve
    alias: {
      "@": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src"), // Use 'src' as an alias for the './src' directory
      assets: path.resolve(__dirname, "src/assets"), // Use 'assets' for the './src/assets' directory
    },
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true, // Ensures routes like `/some/path` work
    },
    static: path.join(__dirname, "./public"),
    port: 3000,
    hot: true,
  },
  module: {
    noParse: /gun\.js$/,
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Ensure this file exists
      filename: "index.html",
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets/manifest.json", to: "manifest.json" },
        { from: "_headers", to: "_headers" },
        { from: "_redirects", to: "_redirects" },
        { from: "src/images/icon-192x192.png", to: "icon-192x192.png" },
      ],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^gun$/,
      contextRegExp: /gun$/,
    }),
  ],
};
