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
        props: [
          {
            name: 'parent',
            type: 'Boolean',
            default: 'true',
            description: 'If true, all children dialogs overlays on this.'
          }
        ]
      }
    }
  },
  render: template.render
}
