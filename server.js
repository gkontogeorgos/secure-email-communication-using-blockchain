const path = require("path");
const express = require("express");
const Gun = require("gun");

const app = express();

// custom port for the process
const port = process.env.PORT || 8080;

// webpack configurations and modules for the production mode
if (process.env.NODE_ENV != "production") {
  console.log("This is the development mode!");
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const config = require("./webpack.config.js");
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler));
} else {
  const index_path = path.join(__dirname, "dist/index.html");

  app.use(express.static("dist"));
  app.get("*", function(_, res) {
    // sends the file to the Response using the express module and manages the directory of this file
    res.sendFile(index_path);
  });
}

app.use(Gun.serve);
const server = app.listen(port);

Gun({ file: "db/data.json", web: server });
console.log('Project is running at http://localhost:'+ port + ' with /gun\n');
