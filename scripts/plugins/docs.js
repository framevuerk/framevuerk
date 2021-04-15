// eslint-disable-next-line import/no-extraneous-dependencies
const { parse } = require('node-html-parser');

module.exports = () => ({
  name: 'docs',
  transform: (_source, id) => {
    if (!id.endsWith('.docs')) return null;
    const source = parse(_source, {
      comment: true,
    });
    const scripts = [...source.querySelectorAll('script')];
    const templates = [...source.querySelectorAll('template')];
    const api = scripts.find((tag) => !tag.getAttribute('data-id')).innerHTML.trim().replace('export default ', '');
    const examples = [...templates].map((rawTemplate) => {
      const exampleId = rawTemplate.getAttribute('data-id');
      const template = rawTemplate.innerHTML;
      const rawComponent = scripts.find((tag) => tag.getAttribute('data-id') === exampleId);
      const component = rawComponent ? rawComponent.innerHTML.trim().replace('export default ', '') : '{}';
      return `
        {
          template: \`\n${template}\n\`,
          ${component.substr(1)}
      `;
    });

    const code = `
      export default (component) => {
        component.api = ${api};
        component.examples = [${examples.join(',')}];
      };
    `;
    return code;
  },
});
