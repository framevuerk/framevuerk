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
        d2: '',
        d3: ''
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'multiple',
            type: 'Boolean',
            default: 'false',
            description: 'Allow user to select multiple options'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Disable all options'
          },
          {
            name: 'options',
            type: 'Array',
            default: '[]',
            description: 'List of options.<br>Each item in array, is object that can have<br>text:String, value:String and disabled:Boolean prop.'
          }
        ],
        event: [],
        method: []
      }
    }
  },
  render: template.render
}
