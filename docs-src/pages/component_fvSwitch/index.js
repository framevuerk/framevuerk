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
        d2: false,
        d3: null
      },
      api: {
        prop: [
          {
            name: 'value || v-model',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'offValue',
            type: '---',
            default: 'false',
            description: 'Value of switch, when it is unchecked'
          },
          {
            name: 'onValue',
            type: '---',
            default: 'true',
            description: 'Value of switch, when it is checked'
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
            description: 'Just like normal input disabled attribute'
          }
        ],
        event: [],
        method: [
          {
            name: 'toggle',
            params: '---',
            description: 'Toggle value of switch'
          }
        ]
      }
    }
  },
  render: template.render
}
