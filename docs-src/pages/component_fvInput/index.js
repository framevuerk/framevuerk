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
            name: 'value || v-model (required)',
            type: '',
            default: 'undefined',
            description: 'Value of input'
          },
          {
            name: 'render-type',
            type: 'Enum ["normal", "display"]',
            default: '"normal"',
            description: 'Render type of input'
          },
          {
            name: 'display-value',
            type: '',
            default: 'undefined',
            description: 'Display value of input.<br>Only used when render-type = "display"<br>Normally used for models like Id or something like that to show meaningful data, so normal usability of input by using this will be lost.'
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
            description: 'Icon of input<br>Only used when render-type = "display"'
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
            description: 'Fired When used click or press enter key on focused state.<br>Only used when render-type = "display"'
          }
        ],
        method: []
      }
    }
  },
  render: template.render
}
