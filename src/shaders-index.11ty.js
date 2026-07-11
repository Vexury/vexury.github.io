const fs   = require('fs');
const path = require('path');

module.exports = class {
  data() {
    return {
      permalink: '/shaders-index.json',
      eleventyExcludeFromCollections: true,
    };
  }

  render() {
    const root = path.join(__dirname, 'files/shaders');
    const files = [];

    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        var m = entry.name.match(/\.(shadergraph|shadersubgraph|hlsl)$/);
        if (!m) continue;
        var relDir = path.relative(root, dir).split(path.sep).filter(Boolean).join('/');
        files.push({
          name: entry.name.slice(0, -m[0].length),
          ext: m[1],
          dir: relDir,
        });
      }
    }
    walk(root);

    return JSON.stringify(files);
  }
};
