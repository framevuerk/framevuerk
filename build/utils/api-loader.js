const getKeys = (content, keyName) => {
  const lines = (content.match(new RegExp(`(@${keyName})(.*)`, 'g')) || []);
  return lines.map((line) => {
    const sections = line.split('@');
    const lineRet = {};
    let lineKey = '';
    sections.forEach((section) => {
      const s = section.trim().split(' ');
      const p = s[0];
      const v = s.splice(1).join(' ');
      if (p === keyName) {
        lineKey = v;
        lineRet[lineKey] = {};
      } else if (lineRet[lineKey] && lineRet[lineKey][p]) {
        lineRet[lineKey][p] = [
          ...(Array.isArray(lineRet[lineKey][p]) ? lineRet[lineKey][p] : [lineRet[lineKey][p]]),
          v,
        ];
      } else if (lineRet[lineKey]) {
        lineRet[lineKey][p] = v;
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
    props: getKeys(source, 'prop'),
    events: getKeys(source, 'event'),
    slots: getKeys(source, 'slot'),
  };

  const content = `
    export default function (Component) {
      Component.options.__api = ${JSON.stringify(api)};
    }
  `;

  // console.log(content);
  return this.callback(null, content, map);
};
