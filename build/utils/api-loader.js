const dashCase = (str) => str.split('').map((char) => (/[A-Z]/.test(char) ? '-' : '') + char.toLowerCase()).join('');

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

module.exports = function loader(source, map) {
  // throw new Error('hi:)');
  if (!source) {
    return this.callback(null, '', map);
  }

  const api = {
    doc: getKeys(source, 'doc'),
    props: getKeys(source, 'prop'),
    events: getKeys(source, 'event'),
    slots: getKeys(source, 'slot'),
    methods: getKeys(source, 'method'),
  };

  const content = `
    export default function (Component) {
      Component.options.__api = ${JSON.stringify(api)};
    }
  `;

  // console.log(content);
  return this.callback(null, content, map);
};
