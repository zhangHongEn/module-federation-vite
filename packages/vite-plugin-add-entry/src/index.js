
module.exports = function addEntry(entryName, entryPath, fileName) {
  let command
  return {
    name: 'add-entry',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith(fileName.replace(/^\/?/, "/"))) {
          req.url = entryPath
        }
        next();
      });
    },
    config(config, { command: _command }) {
      command = _command
      if (command !== "build") return
      config.build = config.build || {};
      config.build.rollupOptions = config.build.rollupOptions || {};
      if (!config.build.rollupOptions.input || typeof config.build.rollupOptions.input === "string") {
        config.build.rollupOptions.input = {
          index: config.build.rollupOptions.input || "index.html",
          [entryName]: entryPath
        };
      }
      if (typeof config.build.rollupOptions.input === "object") {
        config.build.rollupOptions.input = {
          ...config.build.rollupOptions.input,
          [entryName]: entryPath
        };
      }

      config.build.rollupOptions.output = config.build.rollupOptions.output || {};
      const ori = config.build.rollupOptions.output.entryFileNames
      config.build.rollupOptions.output.entryFileNames = (...args) => {
        const [{name}] = args
        if (name === entryName) {
          return fileName
        }
        if (typeof ori === "function") {
          return ori.apply(this, args)
        }
        if (typeof ori === "string") {
          return ori
        }
        return "[name][hash].js"
      };
    },
    transformIndexHtml(c) {
      if (command !== "build") return c.replace("<head>", `<head><script type="module" src=${JSON.stringify(entryPath)}></script>`)
        return c.replace("<head>", `<head><script type="module" src=${fileName}></script>`)

    },
  };
};
