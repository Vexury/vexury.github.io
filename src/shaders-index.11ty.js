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
    const dir = path.join(__dirname, 'files/shaders');
    const files = fs.readdirSync(dir)
      .filter(f => /\.(shadergraph|shadersubgraph)$/.test(f))
      .map(f => ({
        name: f.replace(/\.(shadergraph|shadersubgraph)$/, ''),
        ext:  f.endsWith('.shadersubgraph') ? 'shadersubgraph' : 'shadergraph',
      }));
    return JSON.stringify(files);
  }
};
