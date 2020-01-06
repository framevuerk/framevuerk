
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
      Component.options.__example = Component.options.__example || [];

      Component.options.__example.push({
        component: {
          template: \`
            <div>
              ${template}
            </div>
          \`,
          data() {
            return {
              ${data}
            }
          }
        },
        code: ${JSON.stringify(template)},
      });
    }
  `;
  return this.callback(null, content, map);
};
