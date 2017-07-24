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
        d1: '',
        d2: null
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '',
            default: 'undefined',
            description: 'Value of textarea'
          },
          {
            name: 'required',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal textarea required attribute'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal textarea disabled attribute'
          },
          {
            name: 'auto-height',
            type: 'Boolean',
            default: 'false',
            description: 'Set height automatic by content'
          }
        ],
        event: [],
        method: []
      }
    }
  },
  render: template.render
}
