import template from './template.pug'
import style from './style.scss'
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    pOptions () {
      let ret = []
      this.options.forEach(option => {
        ret.push({
          text: option.text || option.value || option,
          value: option.value || option.text || option,
          disabled: option.disabled || false
        })
      })
      return ret
    }
  },
  methods: {
    clickOption (option) {
      if (!option.disabled && !this.disabled) {
        let newValue
        if (this.multiple) {
          if (this.value && this.value.constructor === Array) {
            if (this.isChecked(option)) {
              newValue = this.value
              newValue.splice(newValue.indexOf(option.value), 1)
            } else {
              newValue = this.value.concat(option.value)
            }
          } else {
            newValue = [option.value]
          }
        } else {
          newValue = option.value
        }
        this.$emit('input', newValue)
      }
    },
    isChecked (option) {
      const value = this.multipe ? (this.value && this.value.constructor === Array ? this.value : []) : (this.value)
      if (this.multiple) {
        if (this.value && this.value.constructor === Array) {
          return value.indexOf(option.value) !== -1
        }
        return false
      } else {
        return value === option.value
      }
    }
  },
  style,
  render: template.render
}
