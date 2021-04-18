const html = require('@rollup/plugin-html');
const fs = require('fs');

module.exports = (input) => html({
  template: ({ files }) => {
    const template = fs.readFileSync(input, 'utf-8');
    const cssLinks = (files.css || []).map(({ fileName }) => `<link href="/${fileName}" rel="stylesheet">`).join('');
    const jsScripts = (files.js || []).map(({ fileName }) => `System.import('/${fileName}');`).join('');
    return template
      .replace('${css}', cssLinks)
      .replace('${js}', `<script>${jsScripts}</script>`);
  }
});