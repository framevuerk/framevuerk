import utility from '../../utility'
import template from './template.pug'

export default {
  props: {
    value: {
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  mounted () {
    utility.vueEvents().forEach(eventName => {
      this.$refs.inputEl.addEventListener(eventName, (event) => this.$emit(eventName, event))
    })
  },
  methods: {
    pFocus () {
      this.$refs.inputEl.focus()
    }
  },
  render: template.render
}
