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
            name: 'value',
            type: 'Number',
            default: '0',
            description: 'Index of selected image.'
          },
          {
            name: 'src',
            type: 'Enum [String, Array]',
            default: '',
            description: 'Source of image(s).<br>If it\'s string, src is just like normal img tag.<br>But if Array, you can put Array of String or Array of Object.<br>The object can have<br>image:String, caption:String Or caption.text:String, caption.class.'
          },
          {
            name: 'height',
            type: 'Enum [Number, String]',
            default: '"25em"',
            description: 'Height of element'
          },
          {
            name: 'width',
            type: 'Enum [Number, String]',
            default: '"100%"',
            description: 'Width of element'
          },
          {
            name: 'nav',
            type: 'Boolean',
            default: 'true',
            description: 'Show navigation and buttons when src is array and more than one image.'
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
