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
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      focus: false
    }
  },
  computed: {
    invalid () {
      return this.required === true && this.value !== this.onValue
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
    pSetValue (value) {
      this.$emit('input', value)
      this.$emit('change')
    },
    pToggle () {
      this.pSetValue(this.value === this.onValue ? this.offValue : this.onValue)
    },
    pFocus () {
      if (!this.disabled) {
        this.$refs.switch.focus()
      }
    },
    pClick () {
      if (!this.disabled) {
        this.pToggle()
        this.focus = true
      }
    },
    setStructure () {
      if ([this.offValue, this.onValue].indexOf(this.value) === -1) {
        this.pSetValue(this.offValue)
      }
    },
    pKeyDown (event) {
      switch (event.which) {
        case 13: case 32: // enter, space
          event.preventDefault()
          this.pToggle()
          break
      }
    }
  },
  style,
  render: template.render
}
