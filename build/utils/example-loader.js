
const getData = (str) => (str.match(/(@data)(.*)(?=)/g) || []).map((item) => {
  const parsed = item.substr(5).split('=');
  return `${parsed[0].trim()}: ${parsed[1].trim()}`;
}).join(',');

const getConfigs = (str) => {
  const ret = {};
  (str.match(new RegExp('(@config)(.*)', 'g')) || []).forEach((configLine) => {
    const splited = configLine.split(' ');
    // eslint-disable-next-line no-eval
    ret[splited[1]] = eval(splited[2]);
  });
  return ret;
};

const removeData = (str) => str.replace(/(@data|@config)(.*)(?=)/g, '').trim();

module.exports = function loader(source, map) {
  if (!source) {
    return this.callback(null, '', map);
  }
  const data = getData(source);
  const configs = getConfigs(source);
  const template = removeData(source);

  const content = `
    export default function (Component) {
      Component.options.__examples = Component.options.__examples || [];

      Component.options.__examples.push({
        template: ${JSON.stringify(template)},
        data: {${data}},
        configs: ${JSON.stringify(configs)},
      });
    }
  `;
  return this.callback(null, content, map);
};
