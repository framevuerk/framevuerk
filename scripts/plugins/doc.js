const path = require('path');

const dashCase = require('../utils/dashCase');

const getKeys = (content, keyName) => {
  const lines = (content.match(new RegExp(`(@${keyName})(.*)`, 'g')) || []);
  return lines.map((line) => {
    const sections = line.split('@');
    const lineRet = {};
    sections.forEach((section) => {
      const s = section.trim().split(' ');
      const p = s[0];
      const v = s.splice(1).join(' ');
      if (p === keyName) {
        lineRet.name = dashCase(v);
      } else if (lineRet[p]) {
        lineRet[p] = [
          ...(Array.isArray(lineRet[p]) ? lineRet[p] : [lineRet[p]]),
          v,
        ];
      } else {
        lineRet[p] = v;
      }
    });
    return lineRet;
  });
};

module.exports = () => ({
  name: 'doc',
  transform: (source, id) => {
    if (!id.endsWith('.doc')) return null;

    const api = {
      doc: getKeys(source, 'doc'),
      props: getKeys(source, 'prop'),
      events: getKeys(source, 'event'),
      slots: getKeys(source, 'slot'),
      methods: getKeys(source, 'method'),
    };
  
    const componentName = (() => {
      let ret = path.basename(id);;
      ret = ret.substring(0, ret.indexOf('.vue'));
      return dashCase(ret);
    })();

    const code = `
      window.framevuerkDocs = window.framevuerkDocs || {};
      window.framevuerkDocs['${componentName}'] = ${JSON.stringify(api)};
    `;
  
    return {
      code,
      map: {
        mappings: ''
      }
    };
  },
});
