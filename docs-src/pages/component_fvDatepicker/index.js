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
        d4: new Date(),
        d5: undefined
      },
      api: {
        prop: [
          {
            name: 'value || v-model (required)',
            type: 'Date',
            default: 'undefined',
            description: 'Value of datepicker'
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
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select required attribute'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal select disabled attribute'
          },
          {
            name: 'placeholder',
            type: 'String',
            default: '""',
            description: 'Just like normal select placeholder attribute'
          },
          {
            name: 'pick',
            type: 'Array of Enum["year", "month", "day", "hour", "minute", "second"]',
            default: '["year", "month", "day", "hour", "minute", "second"]',
            description: 'Pick sections of datepicker.'
          },
          {
            name: 'display-format',
            type: 'String',
            default: '"D MMMM YYYY, HH:mm"',
            description: 'Display format of value'
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
