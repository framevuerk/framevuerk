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
        d5: []
      },
      d3opts: ['USA', {text: 'USB', value: 'USB'}, 'USC'],
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
            name: 'options',
            type: 'Array',
            default: '[]',
            description: 'Options of select.<br>Each item in array, is object that can have<br>key:String, icon:String, text:String, action:Function, class:String and disabled:Boolean prop.'
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
            name: 'insert',
            params: '(inserted-option-text, requested-by)',
            description: 'Fired when user insrted new option. First argument inserted text and second is request source. It is \'user\'(when user add something) or \'value\'(when selected value is not in options).'
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
