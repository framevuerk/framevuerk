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
            name: 'width',
            type: 'Number',
            default: 250,
            description: 'Width of sidebar'
          },
          {
            name: 'position',
            type: 'Enum ["left", "right"]',
            default: 'Based on main main direction!',
            description: 'Position of sidebar'
          },
          {
            name: 'pin',
            type: 'Enum [true, false, null]',
            default: 'null',
            description: 'Pin state of sidebar.<br>If it\'s null, sidebar will pin or unpin based on viewport size!'
          }
        ],
        event: [
          {
            name: 'open',
            params: '---',
            description: 'Fired when sidebar opened'
          },
          {
            name: 'close',
            params: '---',
            description: 'Fired when sidebar closed'
          }
        ],
        method: [
          {
            name: 'open',
            params: '---',
            description: 'Open sidebar'
          },
          {
            name: 'close',
            params: '---',
            description: 'Close sidebar'
          },
          {
            name: 'toggle',
            params: '---',
            description: 'Toggle sidebar'
          }
        ]
      }
    }
  },
  render: template.render
}
