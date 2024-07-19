// vite-plugin-replace-module-name.js
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { createFilter } from '@rollup/pluginutils';

export default function replaceModuleName(options = {}) {
  const { targets = [], replacement = 'sharedvue' } = options;
  const filter = createFilter([/\.js$/, /\.vue$/]);

  return {
    name: 'replace-module-name',
    enforce: "post",
    transform(code, id) {
      if (!filter(id)) return null;

      let ast;
      try {
        ast = this.parse(code, {
          allowReturnOutsideFunction: true
        });
      } catch (e) {
        throw new Error(`${id}: ${e}`);
      }

      const s = new MagicString(code);

      walk(ast, {
        enter(node) {
          const replaceIfMatch = (sourceNode) => {
            if (sourceNode && sourceNode.value && targets.includes(sourceNode.value)) {
              const originalModuleName = sourceNode.value;
              const newModuleName = `${replacement}`;
              const start = sourceNode.start + 1; // Skip the opening quote
              const end = sourceNode.end - 1; // Skip the closing quote
              s.overwrite(start, end, newModuleName);
            }
          };

          if (node.type === 'ImportDeclaration') {
            replaceIfMatch(node.source);
          }

          if (node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration') {
            replaceIfMatch(node.source);
          }

          if (
            node.type === 'CallExpression' &&
            node.callee.type === 'Import' &&
            node.arguments.length &&
            node.arguments[0].type === 'Literal'
          ) {
            replaceIfMatch(node.arguments[0]);
          }

          if (
            node.type === 'CallExpression' &&
            node.callee.name === 'require' &&
            node.arguments.length &&
            node.arguments[0].type === 'Literal'
          ) {
            replaceIfMatch(node.arguments[0]);
          }
        }
      });

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true })
      };
    }
  };
}