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
            description: 'Title of dialog (if it\'s empty, title container not rendered'
          },
          {
            name: 'content',
            type: 'String',
            default: '""',
            description: 'Content of dialog (if it\'s empty, content container not rendered'
          },
          {
            name: 'position',
            type: 'Enum ["bottom", "center", "fill", "center-fill", "center-bottom"]',
            default: '"center"',
            description: 'Position of dialog.<br>Note that "X-Y"s values means that if viewport size is xs, use Y instead of X.'
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
            description: 'Buttons of dialog.<br>Each item in array, directly bind to fvButton component, so it should be an Object with fvButton props and values.'
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
            params: '(user-argument)',
            description: 'Fired when dialog opened'
          },
          {
            name: 'close',
            params: '(user-argument)',
            description: 'Fired when dialog closed'
          },
          {
            name: 'button-click',
            params: '(button, user-argument)',
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
