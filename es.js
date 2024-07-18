import path from 'node:path'
import fs from 'node:fs'

const syntheticNamedExportsPlugin = {
  name: 'synthetic-named-exports',
  setup(build) {
    build.onLoad({ filter: /\.js$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');
      const lines = source.split('\n');
      const exportNames = [];
      let hasDefaultExport = false;

      lines.forEach(line => {
        if (line.startsWith('export default')) {
          hasDefaultExport = true;
          const match = line.match(/export default ({[\s\S]*})/);
          if (match) {
            const exports = match[1]
              .replace(/[{}]/g, '')
              .split(',')
              .map(e => e.trim().split(':')[0]);
            exportNames.push(...exports);
          }
        }
      });

      if (hasDefaultExport) {
        const newLines = lines.map(line => {
          if (line.startsWith('export default')) {
            const exportStatements = exportNames
              .map(name => `export const ${name} = defaultExport.${name};`)
              .join('\n');
            return line + '\n' + exportStatements;
          }
          return line;
        });
        newLines.unshift(`import defaultExport from '${path.relative(path.dirname(args.path), args.path)}';`);
        return {
          contents: newLines.join('\n'),
          loader: 'js',
        };
      }

      return null;
    });
  },
};

export default syntheticNamedExportsPlugin;