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

function normalizeRemoteItem(key, remote) {
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
  if (!remotes) return {};
  const result  = {}
  // if (Array.isArray(remotes)) {
  //   Object.keys()
  //     return remotes.map(item => normalizeRemoteItem(item.name, item));
  // }
  if (typeof remotes === "object") {
    Object.keys(remotes).forEach(key => {
      result[key] = normalizeRemoteItem(key, remotes[key])
    })
  }
  return result
}
exports.normalizeRemotes = normalizeRemotes


function normalizeShareItem(key, shareItem) {
  if (typeof shareItem === "string") {
    return {
      name: shareItem,
      version: "*",
      scope: "default",
      shareConfig: {
        singleton: false,
        requiredVersion: "*"
      }
    }
  }
  if (typeof shareItem === "object") {
    return {
      name: key,
      version: shareItem.version || "*",
      scope: shareItem.shareScope || "default",
      shareConfig: {
        singleton: shareItem.singleton || false,
        requiredVersion: shareItem.requiredVersion || "*"
      }
    }
  }
}
function normalizeShared(shared) {
  if (!shared) return {};
  const result = {}
  if (Array.isArray(shared)) {
    shared.forEach(keyt => {
      result[key] = normalizeShareItem(key, key)
    })
  }
  if (typeof shared === "object") {
    Object.keys(shared).forEach(key => {
      result[key] = normalizeShareItem(key, shared[key])
    })
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
