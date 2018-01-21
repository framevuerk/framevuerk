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
        d1: 'Hello',
        d2: 3000
      },
      api: {
        method: [
          {
            name: 'show',
            params: '(text = null, timeout = 5500)',
            description: 'Show toast'
          },
          {
            name: 'hide',
            params: '---',
            description: 'Manually hide toast'
          }
        ]
      }
    }
  },
  methods: {
    show (text, timeout) {
      this.$toast.show(text, timeout)
    }
  },
  render: template.render
}
