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
      api: {
        prop: [
          {
            name: 'title',
            type: 'String',
            default: '""',
            description: 'Title of dialog'
          },
          {
            name: 'sheet',
            type: 'Enum [null, true, false]',
            default: 'null',
            description: 'Menu sheet style. If null, it is calced by viewport size.'
          },
          {
            name: 'auto-close',
            type: 'Boolean',
            default: 'true',
            description: 'Close dialog by clicking buttons'
          },
          {
            name: 'items',
            type: 'Array',
            default: '[]',
            description: 'Items of menu.<br>Each item in array, is object that can have<br>key:String, icon:String, text:String, action:Function, class:String and disabled:Boolean prop. '
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
            name: 'click-button',
            params: '(button-key, user-argument)',
            description: 'Fired when dialog buttons clicked'
          }
        ],
        method: [
          {
            name: 'open',
            params: '(user-argument)',
            description: 'Open dialog.<br>The optional argument can be accessed on click-button event.'
          },
          {
            name: 'close',
            params: '---',
            description: 'Close dialog'
          },
          {
            name: 'toggle',
            params: '---',
            description: 'Toggle dialog'
          }
        ]
      }
    }
  },
  render: template.render
}
