
module.exports = (shared) => ({
  name: 'normalizeBuild',
  config(config, { command }) {
    if (!config.build) config.build = {}
    if (!config.build.rollupOptions) config.build.rollupOptions = {}
    let {rollupOptions} = config.build
    if (!rollupOptions.output) rollupOptions.output = {}
    normalizeManualChunks(rollupOptions.output, shared)
  }
})
function normalizeManualChunks(output, shared = {}) {
  if (!output.manualChunks) output.manualChunks = {}
  const customChunks = new Set(Object.keys(shared))
  const wrapManualChunks = (original) => (id, ...args) => {
    if (customChunks.has(id)) return id
    if (typeof original === 'function') {
      return original(id, ...args);
    }
    if (typeof original === "object" && original) {
      return original[id]
    }
  };
  output.manualChunks = wrapManualChunks(output.manualChunks)
}