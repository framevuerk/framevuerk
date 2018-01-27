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
            name: 'height',
            type: 'String',
            default: '\'55px\'',
            description: 'Height of element'
          }
        ]
      }
    }
  },
  render: template.render
}
