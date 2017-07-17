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
        d2: {
          value: undefined,
          displayValue: null
        },
        d3: null
      },
      api: {
        prop: [
          {
            name: 'value',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'display-value',
            type: '',
            default: 'undefined',
            description: 'Display value of input.<br>Normally used for models like Id or something like that to show meaningful data, so normal usability of input by using this will be lost.'
          },
          {
            name: 'required',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal input required attribute'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal input disabled attribute'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '""',
            description: 'Just like normal input placeholder attribute'
          },
          {
            name: 'caretIcon',
            type: '---',
            default: '""',
            description: 'Icon of input (only used when display-value is not undefined)'
          }
        ],
        event: [
          {
            name: 'click',
            params: '---',
            description: 'Fired when input clicked'
          },
          {
            name: 'enter',
            params: '---',
            description: 'Fired When used click or press enter key on focused state.<br>(Only fired on when display-value is not undefined)'
          }
        ],
        method: []
      }
    }
  },
  render: template.render
}
