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
            description: 'Determines whether the sidebar should be pinned or not.<br>Null means sidebar will be pinned/unpinned depends on the viewport.'
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
