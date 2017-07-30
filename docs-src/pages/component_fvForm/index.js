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
        d1: '',
        d2: '',
        d3: '',
        d4: {
          value: '',
          displayValud: ''
        },
        d5: '',
        d6: "salam\nkhubi?",
        d7: '',
        d8: '',
        d9: '',
        d10: '',
        d11: '',
      },
      api: {
        prop: [],
        event: [
          {
            name: 'submit',
            params: '---',
            description: 'Fired when form submitted'
          },
          {
            name: 'reject',
            params: '(first-invalid-child)',
            description: 'Fired when form submitted, but rejected!'
          }
        ],
        method: [
          {
            name: 'submit',
            params: '---',
            description: 'Submit form.'
          }
        ]
      }
    }
  },
  render: template.render
}
