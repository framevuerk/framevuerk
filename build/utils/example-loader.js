
const getData = (str) => (str.match(/(@data)(.*)(?=)/g) || []).map((item) => {
  const parsed = item.substr(5).split('=');
  return `${parsed[0].trim()}: ${parsed[1].trim()}`;
}).join(',');

const removeData = (str) => str.replace(/(@data|@config)(.*)(?=)/g, '').trim();

module.exports = function loader(source, map) {
  // throw new Error('hi:)');
  if (!source) {
    return this.callback(null, '', map);
  }
  const data = getData(source);
  const template = removeData(source);
  const hideState = (/(@config)(.*)(hidestate)/g).test(source);

  const content = `
    export default function (Component) {
      Component.options.__examples = Component.options.__examples || [];

      const code = ${JSON.stringify(template)};
      const data = {${data}};

      Component.options.__examples.push({
        code: code,
        data: data,
        config: {
          hideState: ${hideState},
        },
      });
    }
  `;
  return this.callback(null, content, map);
};
