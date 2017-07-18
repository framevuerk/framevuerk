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
            name: 'position',
            type: 'Enum ["bottom", "center"]',
            default: '"center"',
            description: 'Position of dialog'
          },
          {
            name: 'autoClose',
            type: 'Boolean',
            default: 'true',
            description: 'Close dialog by clicking buttons'
          },
          {
            name: 'modal',
            type: 'Boolean',
            default: 'false',
            description: 'Close dialog by clicking overlay or by ESC key'
          },
          {
            name: 'buttons',
            type: 'Array',
            default: '[]',
            description: 'Buttons of dialog.<br>Each item in array, is object that can have<br>key:String, icon:String, text:String, action:Function, class:String and disabled:Boolean prop. '
          },
          {
            name: 'content-class',
            type: '---',
            default: '""',
            description: 'Class attribute of <fv-content> section inside dialog.'
          },
          {
            name: 'first-focus-on',
            type: 'Boolean or Number',
            default: '""',
            description: 'First focus target element of dialog.<br>If it\'s true, first focusable element will give focus.<br>If it\'s false, last focusable element will give focus!<br>Else if that\'s Number, fv-dialog use this as index of element to be focused.'
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
