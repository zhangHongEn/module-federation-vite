
module.exports = function addEntry(entryName) {
  return {
    name: 'add-entry',
    config(config, { command }) {
      config.build = config.build || {};
      config.build.rollupOptions = config.build.rollupOptions || {};
      config.build.rollupOptions.input = {
        main: config.build.rollupOptions.input,
        [entryName]: "virtual:__addEntry__" + entryName
      };

      config.build.rollupOptions.output = config.build.rollupOptions.output || {};
      config.build.rollupOptions.output.entryFileNames = ({ name }) => {
        return name === 'prodEntry' ? 'remoteEntry.js' : '[name].js';
      };
    },
  };
};
