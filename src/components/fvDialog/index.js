import utility from '../../utility'
import template from './template.pug'
import style from './style.scss'
/* global document */

export default {
  props: {
    title: {
      default: ''
    },
    content: {
      default: ''
    },
    position: {
      type: String,
      validator: (value) => {
        return ['bottom', 'center', 'fill', 'center-fill', 'center-bottom'].indexOf(value) > -1
      },
      default: 'center'
    },
    modal: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => []
    },
    firstFocusOn: {
      type: [Number, Boolean],
      default: false // can be index or false (lastindex) or true (firstindex)
    }
  },
  data () {
    return {
      pShow: false,
      param: null,
      focusBackElem: null,
      focusableItems: []
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
    animationName () {
      return `fv-dialog-${this.position}`
    }
  },
  methods: {
    toggle () {
      this[this.pShow ? 'close' : 'open']()
    },
    open (param = null) {
      document.body.appendChild(this.$el)
      this.pShow = true
      this.param = param
      this.focusBackElem = document.querySelector(':focus')
      this.$emit('open', this.param)
      utility.doIt(() => {
        this.pFocus(this.firstFocusOn)
      })
    },
    close () {
      this.pShow = false
      if (this.focusBackElem) {
        utility.doIt(() => {
          this.focusBackElem.focus()
        })
      }
      this.$emit('close', this.param)
    },
    closeIf () {
      if (this.modal === false) {
        this.close()
      }
    },
    pFocus (index = true) {
      this.focusableItems = this.$el.querySelectorAll('select, input, textarea, button, a, [tabindex]:not([tabindex=""])')
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
        break
      case 27: // esc
        this.closeIf()
      }
    },
    clickButton (button) {
      this.$emit('click-button', button, this.param)
      button.action(this.param)
      if (this.autoClose) {
        this.close()
      }
    }
  },
  beforeDestroy () {
    this.$el.remove()
  },
  style,
  render: template.render
}
