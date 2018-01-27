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
        d3: undefined,
        d4: undefined,
        d5: undefined
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '---',
            default: 'undefined',
            description: 'Value of filepicker'
          },
          {
            name: 'button-class',
            type: '---',
            default: '""',
            description: 'Class attr of fv-button'
          },
          {
            name: 'default-text',
            type: '---',
            default: '"Browse..." (based on your locale)',
            description: 'Default text appear to button'
          },
          {
            name: 'required',
            type: '[Boolean, Function]',
            default: 'false',
            description: 'Just like normal input required attribute. Also you can pass a function to check validity of value as you want.'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select disabled attribute'
          },
          {
            name: 'type',
            type: 'Enum["blob", "file"]',
            default: '"blob"',
            description: 'Type of value.'
          }
        ],
        event: [],
        method: []
      }
    }
  },
  methods: {
    getUrl (v) {
      return URL.createObjectURL(v)
    }
  },
  render: template.render
}
