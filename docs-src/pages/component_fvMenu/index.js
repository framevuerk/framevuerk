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
        d1: 'X Arg'
      },
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
            description: 'List of items in menu.'
          },
          {
            name: 'textKey',
            type: 'String',
            default: '"text"',
            description: 'Text key in each object in items.'
          },
          {
            name: 'disabledKey',
            type: 'String',
            default: '"disabled"',
            description: 'Disabled key in each object in items.'
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
            name: 'item-click',
            params: '(item, user-argument)',
            description: 'Fired when user click on item.'
          }
        ],
        method: [
          {
            name: 'open',
            params: '(user-argument)',
            description: 'Open menu.<br>The optional argument can be accessed on click-item event and in custom template.'
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
  methods: {
    doIt (a, b) {
      alert(`You clicked on ${typeof a === 'string' ? a : a.text}${b ? ` and user-argument is ${b}` : ''}`)
    }
  },
  render: template.render
}
