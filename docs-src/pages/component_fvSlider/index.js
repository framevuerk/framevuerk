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
      items: {
        s1: '',
        s2: '',
        s3: ''
      },
      api: {
        prop: [
          {
            name: 'value',
            type: 'String',
            default: '',
            description: 'Selected slot.'
          },
          {
            name: 'show-tabs',
            type: 'Boolean',
            default: 'true',
            description: 'Show tab on top of slider.'
          },
          {
            name: 'show-buttons',
            type: 'Boolean',
            default: 'false',
            description: 'Show next and prev buttons on slider.'
          },
          {
            name: 'show-navs',
            type: 'Boolean',
            default: 'false',
            description: 'Show nav at bottom of slider.'
          },
          {
            name: 'interval',
            type: 'Number',
            default: '0',
            description: 'Interval time of auto slide. If zero or slots length < 2, it\'s not affect.'
          }
        ]
      }
    }
  },
  render: template.render
}
