import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'

export default {
  props: {
    title: {
      default: '',
      required: false
    },
    position: {
      type: String,
      validator: (value) => {
        return ['bottom', 'center'].indexOf(value) > -1
      },
      default: 'center'
    },
    modal: {
      type: Boolean,
      default: false
    },
    buttons: {
      type: Array,
      default: () => []
    },
    contentClass: {
      default: ''
    },
    firstFocusOn: {
      type: [Number, Boolean],
      default: false // can be index or false (lastindex) or true (firstindex)
    }
  },
  data () {
    return {
      pShow: false,
      pProp: null,
      focusBackElem: null
    }
  },
  computed: {
    pButtons () {
      let ret = []
      this.buttons.forEach((value) => {
        ret.push({
          key: value.key || value.text || value,
          icon: value.icon || false,
          text: value.text || value,
          action: value.action || function () {},
          class: value.class || 'fv-default',
          disabled: value.disabled || false
        })
      })
      return ret
    },
    focusableItems () {
      return this.$refs.dialog.$el.querySelectorAll('select, input, textarea, button, a, [tabindex]')
    },
    animationName () {
      return `fv-dialog-${this.position}`
    }
  },
  methods: {
    toggle () {
      this[this.pShow ? 'close' : 'open']()
    },
    open (prop = null) {
      this.pShow = true
      this.pProp = prop
      this.focusBackElem = document.querySelector(':focus')
      this.$emit('open', this.pProp)
      utility.doIt(() => {
        this.pFocus(this.firstFocusOn)
      })
    },
    close () {
      this.pShow = false
      this.pProp = null
      if (this.focusBackElem) {
        utility.doIt(() => {
          this.focusBackElem.focus()
        })
      }
      this.$emit('close', this.pProp)
    },
    closeIf () {
      if (this.modal === false) {
        this.close()
      }
    },
    pFocus (index = true) {
      let i
      if (typeof index === 'boolean') {
        i = index ? 0 : this.focusableItems.length - 1
      } else {
        i = index
      }
      this.focusableItems[i].focus()
    },
    pKeyDown (event) {
      switch (event.which) {
      case 9: // tab
        if (event.target === this.focusableItems[0] && event.shiftKey) { // when first item is focused and user press shift + tab
          event.preventDefault()
          this.pFocus(false)
        } else if (event.target === this.focusableItems[this.focusableItems.length - 1] && !event.shiftKey) { // when last item is focused and user press tab
          event.preventDefault()
          this.pFocus(true)
        }
        break
      case 13: // enter
        event.target.click()
        event.preventDefault()
        break
      case 27: // esc
        this.closeIf()
      }
    },
    clickButton (button) {
      this.$emit('click-button', button.key, this.pProp)
      button.action(this.pProp)
    }
  },
  style,
  render: template.render
}
