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
      listApi: {
        prop: [
          {
            name: 'parent',
            type: 'Boolean',
            default: 'false',
            description: 'Set it true to calculate highlighted.'
          },
          {
            name: 'not-found-text',
            type: '',
            default: 'locale.notFoundText()',
            description: 'If list items is empty, show this text.'
          }
        ],
        event: [],
        method: []
      },
      listItemApi: {
        prop: [
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'If disabled, item cannot be clicked or selected by user.'
          },
          {
            name: 'selected',
            type: 'Boolean',
            default: 'false',
            description: 'Set selected style to item.'
          },
          {
            name: 'expanded',
            type: 'Boolean',
            default: 'false',
            description: 'If item has \'sub-list\' slot in body, expand it by default.'
          }
        ],
        event: [
          {
            name: 'click',
            params: '---',
            description: 'Fired when user click on item.'
          },
          {
            name: 'collapse',
            params: '---',
            description: 'Fired when \'sub-list\' slot collapsed.'
          },
          {
            name: 'expand',
            params: '---',
            description: 'Fired when api \'sub-list\' slot expanded.'
          }
        ],
        method: [
          {
            name: 'collapse',
            params: '---',
            description: 'Collapse \'sub-list\' slot.'
          },
          {
            name: 'expand',
            params: '---',
            description: 'Expand \'sub-list\' slot.'
          },
          {
            name: 'toggle',
            params: '---',
            description: 'Collapse/Expand \'sub-list\' slot'
          }
        ]
      }
    }
  },
  render: template.render
}
