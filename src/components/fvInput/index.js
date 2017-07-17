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
      type: Boolean,
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
  data () {
    return {
      invalid: false,
      focus: false
    }
  },
  watch: {
    value () {
      this.checkInvalid()
    }
  },
  methods: {
    checkInvalid () {
      if (this.required) {
        if (this.value === undefined || (this.value.constructor === Array && this.value.length === 0)) {
          this.invalid = true
        } else {
          this.invalid = false
        }
      } else {
        this.invalid = false
      }
    },
    pFocus () {
      this.$refs.inputEl.focus()
    },
    pClick (event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    },
    pEnter (event) {
      if (!this.disabled) {
        this.$emit('enter', event)
      }
    }
  },
  style,
  render: template.render
}
