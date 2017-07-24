import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    value: {
      default: undefined
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fvValidate () {
      if (this.required) {
        if (!this.value) {
          return false
        } else {
          return true
        }
      }
      return true
    }
  },
  methods: {
    setHeight (val) {
      if (this.autoHeight) {
        let height
        if (val) {
          height = val.split('\n').length
        } else {
          height = 1
        }
        this.$el.style.height = `${height * 3}em`
      }
    }
  },
  style,
  render: template.render
}
