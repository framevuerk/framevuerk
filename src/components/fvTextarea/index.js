import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    value: {
      default: undefined
    },
    required: {
      type: [Boolean, Function],
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
      if (this.required === true) {
        if (!this.value) {
          return false
        } else {
          return true
        }
      } else if (typeof this.required === 'function') {
        return this.required()
      }
      return true
    }
  },
  mounted () {
    this.setHeight(this.value)
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
  watch: {
    value (val) {
      this.setHeight(val)
    }
  },
  style,
  render: template.render
}
