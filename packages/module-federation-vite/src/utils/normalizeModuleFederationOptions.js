// name: string;
//     version?: string;
//     buildVersion?: string;
//     entry: string;
//     type: RemoteEntryType;
//     entryGlobalName: string;
//     shareScope: string;

    // Helper functions to normalize each type of option
function normalizeExposes(exposes) {
  if (!exposes) return {};
  if (Array.isArray(exposes)) {
      const normalized = {};
      exposes.forEach((item, index) => {
          if (typeof item === 'string') {
              normalized[`module_${index}`] = { import: item };
          } else {
              Object.assign(normalized, item);
          }
      });
      return normalized;
  }
  return exposes;
}
exports.normalizeExposes = normalizeExposes

function normalizeInfo(key, remote) {
  if (typeof remote === "string") {
    const [entryGlobalName] = remote.split("@")
    const entry = remote.replace(entryGlobalName + "@", "")
    return {
      type: "var",
      name: key,
      entry,
      // alias: "",
      entryGlobalName,
      shareScope: "default"
    }
  }
  return Object.assign({
    type: "var",
    name: key,
    shareScope: "default",
    entryGlobalName: key,
  }, remote)
}

function normalizeRemotes(remotes) {
  if (!remotes) return [];
  if (Array.isArray(remotes)) {
      return remotes.map(item => normalizeInfo(item.name, item));
  }
  if (typeof remotes === "object") {
    return Object.keys(remotes).map(key => normalizeInfo(key, remotes[key]))
  }
  return []
}
exports.normalizeRemotes = normalizeRemotes

function normalizeShared(shared) {
  if (!shared) return {};
  if (Array.isArray(shared)) {
      const normalized = {};
      shared.forEach((item, index) => {
          if (typeof item === 'string') {
              normalized[`shared_${index}`] = { import: item };
          } else {
              Object.assign(normalized, item);
          }
      });
      return normalized;
  }
  return shared;
}
exports.normalizeShared = normalizeShared

function normalizeLibrary(library) {
  if (!library) return undefined;
  return library;
}

// Main normalization function
exports.normalizeModuleFederationOptions = normalizeModuleFederationOptions
function normalizeModuleFederationOptions(options) {
  return {
      exposes: normalizeExposes(options.exposes),
      filename: options.filename,
      library: normalizeLibrary(options.library),
      name: options.name,
      remoteType: options.remoteType,
      remotes: normalizeRemotes(options.remotes),
      runtime: options.runtime,
      shareScope: options.shareScope,
      shared: normalizeShared(options.shared),
      runtimePlugins: options.runtimePlugins,
      getPublicPath: options.getPublicPath,
      implementation: options.implementation,
      manifest: options.manifest,
      dev: options.dev,
      dts: options.dts
  };
}

// Example usage
// const rawOptions = {
//   // Initialize with your raw options
//   exposes: ["./module1", { "./module2": { import: "./module2", name: "module2" } }],
//   filename: "remoteEntry.js",
//   library: { type: "var", name: "MyLibrary" },
//   name: "myApp",
//   remoteType: "var",
//   remotes: ["./remote1", { "./remote2": { external: "./remote2" } }],
//   runtime: false,
//   shareScope: "default",
//   shared: ["react", { "react-dom": { singleton: true, import: "react-dom" } }],
//   runtimePlugins: ["plugin1", "plugin2"],
//   getPublicPath: "/publicPath/",
//   implementation: "webpack",
//   manifest: true,
//   dev: { disableLiveReload: true },
//   dts: { generateTypes: true }
// };

// const normalizedOptions = normalizeModuleFederationOptions(rawOptions);
// console.log(normalizedOptions);
