import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    value: {
      default: false
    },
    onValue: {
      default: true
    },
    offValue: {
      default: false
    },
    required: {
      type: [Boolean, Function],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fvValidate () {
      if (this.required === true) {
        return this.value === this.onValue
      } else if (typeof this.required === 'function') {
        return this.required()
      }
      return true
    }
  },
  watch: {
    value () {
      this.setStructure()
    }
  },
  created () {
    this.setStructure()
  },
  methods: {
    toggle () {
      if (!this.disabled) {
        this.$emit('input', this.value === this.onValue ? this.offValue : this.onValue)
      }
    },
    setStructure () {
      if ([this.offValue, this.onValue].indexOf(this.value) === -1) {
        this.$emit('input', this.offValue)
      }
    },
    keydown (event) {
      switch (event.which) {
      case 13: case 32: // enter, space
        event.preventDefault()
        this.toggle()
        break
      }
    }
  },
  style,
  render: template.render
}
