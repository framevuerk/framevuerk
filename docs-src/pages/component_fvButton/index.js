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
            name: 'loading',
            type: 'Boolean',
            default: 'false',
            description: 'Show loading spinner instead of content'
          },
          {
            name: 'icon',
            type: '',
            default: '""',
            description: 'Icon of button'
          },
          {
            name: 'text',
            type: '',
            default: '',
            description: 'Text of button (also you can use slot like normal buttons)'
          },
          {
            name: 'disabled',
            type: 'Boolean',
            default: 'false',
            description: 'Just like normal button disabled prop'
          }
        ],
        event: [
          {
            name: 'click',
            params: 'event',
            description: 'Fired when user clicked on button and both disabled and loading props are false.'
          }
        ],
        method: []
      }
    }
  },
  render: template.render
}
