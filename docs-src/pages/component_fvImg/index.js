import template from './template.pug'
import docApi from '../../components/docApi'
import docDescription from '../../components/docDescription'
import docExample from '../../components/docExample'
import docCode from '../../components/docCode'
// images
import '../../assets/images/01.jpg'
import '../../assets/images/02.jpg'
import '../../assets/images/03.jpg'
import '../../assets/images/04.jpg'
import '../../assets/images/05.jpg'
import '../../assets/images/06.jpg'
import '../../assets/images/07.jpg'
import '../../assets/images/08.jpg'
import '../../assets/images/09.jpg'

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
            name: 'src',
            type: '[String, Array]',
            default: '',
            description: 'Source of image(s).<br>If it\'s string, src is just like normal img tag.<br>But if Array, you can put Array of src.'
          },
          {
            name: 'show-buttons',
            type: 'Boolean',
            default: 'false',
            description: 'Show next and prev buttons if available.'
          },
          {
            name: 'interval',
            type: 'Number',
            default: '0',
            description: 'Interval time of auto slide. If zero or src length < 2, it\'s not affect.'
          }
        ]
      }
    }
  },
  render: template.render
}
