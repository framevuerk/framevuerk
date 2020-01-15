
const getData = (str) => (str.match(/(@data)(.*)(?=)/g) || []).map((item) => {
  const parsed = item.substr(5).split('=');
  return `${parsed[0].trim()}: ${parsed[1].trim()}`;
}).join(',');

const removeData = (str) => str.replace(/(@data)(.*)(?=)/g, '').trim();

module.exports = function loader(source, map) {
  // throw new Error('hi:)');
  if (!source) {
    return this.callback(null, '', map);
  }
  const data = getData(source);
  const template = removeData(source);

  const content = `
    export default function (Component) {
      const component = {
        template: \`
          <div>
            ${template}
          </div>
        \`,
        data() {
          return {
            ${data}
          }
        },
      };
      const code = ${JSON.stringify(template)};

      Component.options.__examples = Component.options.__examples || [];
      Component.options.__examples.push({
        component: component,
        code: code,
      });
    }
  `;
  return this.callback(null, content, map);
};
