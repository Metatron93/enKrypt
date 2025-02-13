const path = require("path");

const setConfig = (config) => {
  config.devtool("source-map");
  config.resolve.symlinks(false);
  config.resolve.set("fallback", {
    Buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url/"),
    os: false,
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    path: require.resolve("path-browserify"),
    fs: false,
  });
  config
    .plugin("buffer") // <-arbitrary name to give this plugin entry I guess?
    .use(require.resolve("webpack/lib/ProvidePlugin"), [
      { Buffer: ["buffer", "Buffer"] },
    ]);
  config.resolve.alias.set(
    "@action",
    path.resolve(__dirname, "../src/ui/action")
  );
};

exports.setConfig = setConfig;
