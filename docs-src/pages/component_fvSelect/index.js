import template from './template.pug'
import docApi from '../../components/docApi'
import docDescription from '../../components/docDescription'
import docExample from '../../components/docExample'
import docCode from '../../components/docCode'

export default {
  components: {
    docApi,
    docDescription,
    docExample,
    docCode
  },
  data () {
    return {
      inputs: {
        d1: undefined,
        d2: undefined,
        d3: [],
        d4: undefined,
        d5: [],
        d6: undefined
      },
      d3opts: ['USA', 'USB', 'USC'],
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '---',
            default: 'undefined',
            description: 'Value of select'
          },
          {
            name: 'input-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-input'
          },
          {
            name: 'dialog-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-dialog'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal select required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select disabled attribute'
          },
          {
            name: 'search',
            type: 'Enum [null, true, false]',
            default: 'true',
            description: 'Allow user to search in options. If it is null, search input will show, but does not affect to the list.'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '""',
            description: 'Just like normal select placeholder attribute'
          },
          {
            name: 'multiple',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to select multiple options'
          },
          {
            name: 'allow-insert',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to insert option to options'
          },
          {
            name: 'loading',
            type: 'Boolean',
            default: 'false',
            description: 'Show loading spinner instead of list'
          },
          {
            name: 'options',
            type: 'Array',
            default: '[]',
            description: 'List of options in select.'
          },
          {
            name: 'valueKey',
            type: 'String',
            default: '"value"',
            description: 'Value key in each object in options.'
          },
          {
            name: 'textKey',
            type: 'String',
            default: '"text"',
            description: 'Text key in each object in options.'
          },
          {
            name: 'disabledKey',
            type: 'String',
            default: '"disabled"',
            description: 'Disabled key in each object in options.'
          }
        ],
        event: [
          {
            name: 'open',
            params: '---',
            description: 'Fired when dialog opened'
          },
          {
            name: 'close',
            params: '---',
            description: 'Fired when dialog closed'
          },
          {
            name: 'update:options',
            params: '---',
            description: 'Fired when user insrted new option.'
          },
          {
            name: 'search',
            params: '(search-query)',
            description: 'Fired when search query changed'
          }
        ],
        method: [
          {
            name: 'open',
            params: '---',
            description: 'Open dialog'
          },
          {
            name: 'close',
            params: '---',
            description: 'Close dialog'
          }
        ]
      }
    }
  },
  render: template.render
}
