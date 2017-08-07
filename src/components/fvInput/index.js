import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    value: {
      default: undefined
    },
    displayValue: {
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
    placeholder: {
      type: String,
      default: ''
    },
    renderType: {
      type: String,
      validator: (v) => {
        return ['normal', 'display']
      },
      default: 'normal'
    },
    caretIcon: {
      default: ''
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        if (!this.value || (this.value.constructor === Array && this.value.length === 0)) {
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
  methods: {
    enter (event) {
      if (!this.disabled) {
        this.$emit('enter', event)
      }
    }
  },
  style,
  render: template.render
}
